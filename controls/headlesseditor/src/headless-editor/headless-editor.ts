import { DocumentRoot } from '../model/editor-node';
import { IdGenerator } from '../utils/id-generator';
import { DocumentMapper } from '../pm/adapters/document-mapper';
import { IntegrationManager } from '../pm/integration/integration-manager';
import { adaptNodeViews } from '../pm/nodeviews/node-view';
import type { DirectEditorProps, PMEditorView } from '../pm/pm-guard';
import type { PMEditorState } from '../pm/pm-guard';
import { PMDOMSerializer, TextSelection } from '../pm/pm-guard';
import { PMFragment, PMNode, PMSchema, PMTransaction } from '../pm/pm-guard';
import { parseHtmlToDocument } from '../schema/serialization/html-content-parser';
import { PasteHandler, createPasteHandler } from '../pm/adapters/clipboard/paste-handler';
import { EditorBuilder, EditorBuilderOptions } from './editor-builder';
import { EditorConfig } from '../model/editor-config';
import {
    CONTENT_CHANGED,
    SELECTION_CHANGED,
    FOCUS,
    BLUR,
    BEFORE_PASTE,
    AFTER_PASTE,
    BEFORE_DELETE,
    AFTER_DELETE
} from '../events/event-names';
import {
    ContentChangedPayload,
    SelectionChangedPayload
} from '../events/public-events/document-events';
import {
    BeforePastePayload,
    AfterPastePayload,
    BeforeDeletePayload,
    AfterDeletePayload
} from '../events/public-events/user-events';
import { DiagnosticsService } from '../diagnostics/diagnostics-service';
import { EventBus, SubscriberPriority } from '../events/event-bus';
import { ServiceRegistry } from '../services/service-registry';
import { ServiceLifecycleManager } from '../services/service-lifecycle-manager';
import { DiagnosticsToken, EventBusToken } from '../services/built-in-tokens';
import { EventAggregator } from '../events/public-events/event-aggregator';
import { EditorEvent, IDisposable } from '../events';
import { EditorLifecycleError } from '../errors/editor-lifecycle-error';
import { CommandRegistry } from '../commands/registry';
import { CommandManager } from '../commands/manager';
import { readCodeBlockContent } from '../commands/builtins/code-block/get-code-block-content';
import { readCodeBlockLanguage } from '../commands/builtins/code-block/get-code-block-language';
import { createCommandsFacade, createCanFacade, createChainFacade } from '../commands/facade';
import { TypedCommandsFacade, TypedCanFacade, TypedChain } from '../commands/typed-surface';
import { ChainBuilder } from '../commands/chain';
import { SelectionManager } from '../pm/integration/selection-manager';
import { SelectionAdapter } from '../pm/adapters/selection-adapter';
import { SelectedNodeResolver } from '../pm/integration/selected-node-resolver';
import { ActiveMarksResolver } from '../pm/integration/active-marks-resolver';
import type { SelectedNode, SelectedCell, SelectionSnapshot } from '../model/selection';
import { FOCUS_LOST } from '../events/event-names';
import type { ExtensionManager } from '../extensions/extension-manager';
import { FileHandler } from '../services/file-handler';
import { UploadStateRegistry } from '../services/upload-state-registry';
import type { FileUploadHandler } from '../model/file-upload-handler';
import { initializeTelemetry, validateLicense } from '@syncfusion/ej2-base';

/**
 * Editor — the public entry point for the Syncfusion Headless Editor.
 *
 * Usage:
 *   const editor = Editor.create({ schema: mySchema });
 *   editor.mount(containerElement);
 *   const doc = editor.getDocument();
 *   editor.destroy();
 */
export class HeadlessEditor {
    private readonly config: EditorConfig;
    private readonly idGen: IdGenerator;
    private currentDoc: DocumentRoot;

    // ── Bootstrap singletons (per design.md Decision 4) ──────────────────────
    private readonly diagnostics: DiagnosticsService;
    private readonly serviceRegistry: ServiceRegistry;
    private readonly lifecycleManager: ServiceLifecycleManager;
    private readonly aggregator: EventAggregator;
    private readonly subscriptions: Map<Function, IDisposable> = new Map<Function, IDisposable>();
    private readonly manager: CommandManager;
    private readonly selectionManager: SelectionManager;
    private readonly selectedNodeResolver: SelectedNodeResolver;
    private readonly activeMarksResolver: ActiveMarksResolver;
    private blurSubscription: IDisposable | null;
    private readonly extensionManager?: ExtensionManager;

    /** Typed proxy for immediate command execution: `editor.commands.toggleBold()` */
    public readonly commands: TypedCommandsFacade;

    /* @hidden */
    public readonly commandRegistry: CommandRegistry;

    /* @hidden */
    public isDestroyed: boolean;
    /* @hidden */
    public readonly integration: IntegrationManager;
    /* @hidden */
    public readonly eventBus: EventBus;

    /**
     * Adapted NodeView map — set by Editor.create() after bindEditorAndFinalize().
     * Passed directly to PMEditorView via buildViewProps().
     */
    private adaptedNodeViews: DirectEditorProps['nodeViews'] = {};

    /**
     * Paste handler for clipboard operations.
     * Implements four-stage paste workflow with event emission for extension/product customization.
     */
    private pasteHandler: PasteHandler | null = null;

    /**
     * File handler for upload operations.
     * Manages file lifecycle: paste/drop → upload ID generation → upload orchestration → events.
     */
    private fileHandler: FileHandler | null = null;

    /**
     * Generic runtime upload state registry.
     * Publishes upload lifecycle state keyed by an opaque owner key
     * (e.g. a stable image node ID) so extension NodeViews can render
     * product-supplied status UI without touching the document.
     */
    /* @hidden */
    public readonly uploadStateRegistry: UploadStateRegistry = new UploadStateRegistry();

    /**
     * Constructor is only called by Editor.create() via EditorBuilder.
     * Direct instantiation is not supported.
     *
     * Implementation detail; use Editor.create() instead.
     *
     * @param {EditorConfig} config - Resolved editor configuration used to construct the editor.
     * @param {IntegrationManager} integration - Fully initialized IntegrationManager (owns PM state).
     * @param {IdGenerator} idGen - IdGenerator for future document operations.
     * @param {DocumentRoot} initialDoc - The initial document after schema compilation and PM mapping.
     * @param {DiagnosticsService} diagnostics - The diagnostics service for error reporting.
     * @param {EventBus} eventBus - The event bus for inter-service communication.
     * @param {ServiceRegistry} serviceRegistry - The service registry holding bootstrap singletons.
     * @param {ServiceLifecycleManager} lifecycleManager - The service lifecycle manager.
     * @param {EventAggregator} aggregator - The aggregator that maps PM events to public editor events.
     * @param {CommandRegistry} commandRegistry - Pre-populated CommandRegistry with all built-in commands.
     * @param {CommandManager} commandManager - Shared CommandManager instance used by the editor and input-rule infrastructure.
     * @param {ExtensionManager} [extensionManager] - Optional ExtensionManager if extensions were loaded.
     */
    constructor(
        config: EditorConfig,
        integration: IntegrationManager,
        idGen: IdGenerator,
        initialDoc: DocumentRoot,
        diagnostics: DiagnosticsService,
        eventBus: EventBus,
        serviceRegistry: ServiceRegistry,
        lifecycleManager: ServiceLifecycleManager,
        aggregator: EventAggregator,
        commandRegistry: CommandRegistry,
        commandManager: CommandManager,
        extensionManager?: ExtensionManager
    ) {
        this.config = config;
        this.integration = integration;
        this.idGen = idGen;
        this.currentDoc = initialDoc;
        this.diagnostics = diagnostics;
        this.eventBus = eventBus;
        this.serviceRegistry = serviceRegistry;
        this.lifecycleManager = lifecycleManager;
        this.aggregator = aggregator;
        this.commandRegistry = commandRegistry;
        this.extensionManager = extensionManager;
        this.blurSubscription = null;

        // Construct the SelectionManager wired to the integration's
        // position adapter so snapshot-remap operations use the same cache.
        const selectionAdapter: SelectionAdapter = new SelectionAdapter(this.integration.positionAdapter);
        this.selectionManager = new SelectionManager(
            this.integration,
            selectionAdapter,
            this.integration.positionAdapter,
            initialDoc.schemaVersion ?? 1
        );
        this.selectionManager.discard();
        this.integration.postDispatchHook = (): void => {
            this.selectionManager.onTransactionApplied();
        };

        this.manager = commandManager;
        this.commands = createCommandsFacade(this.manager);

        // Initialize selected node resolver for context-aware node queries
        this.selectedNodeResolver = new SelectedNodeResolver();

        // Initialize active marks resolver for toolbar state queries
        this.activeMarksResolver = new ActiveMarksResolver();

        // Activate the auto-save-on-blur subscription if requested.
        if (this.config.autoSaveSelectionOnBlur) {
            this.setAutoSaveSelectionOnBlur(true);
        }
        validateLicense('headless-editor');
        initializeTelemetry('HeadlessEditor');
    }

    // ── Factory ───────────────────────────────────────────────────────────────

    /**
     * Creates an Editor instance.
     *
     * Does NOT create any DOM element or PM view.
     * Call editor.mount(container) after creation to attach to the DOM.
     *
     * @param {EditorConfig} config - The editor configuration.
     * @returns {Editor} A fully initialized Editor instance.
     */
    public static create(config: EditorConfig): HeadlessEditor {
        // ── Bootstrap sequence (design.md Decision 4, 7-step order) ──────────
        // 1. DiagnosticsService — must exist before everything else
        const diagnostics: DiagnosticsService = new DiagnosticsService();
        // 2. EventBus — injected with diagnostics for error logging
        const eventBus: EventBus = new EventBus(diagnostics);
        // 3. ServiceRegistry
        const serviceRegistry: ServiceRegistry = new ServiceRegistry();
        // 4. Register bootstrap singletons into registry for downstream consumers
        serviceRegistry.register(DiagnosticsToken, diagnostics);
        // 5. Register EventBus token
        serviceRegistry.register(EventBusToken, eventBus);

        // 6. Initialize remaining managed services (none yet — reserved for extensions)
        const lifecycleManager: ServiceLifecycleManager = new ServiceLifecycleManager();
        lifecycleManager.initializeAll();

        // 7. Build command registry before the PM integration layer so the
        //    keymap plugin can resolve commands during EditorState creation.
        const commandRegistry: CommandRegistry = new CommandRegistry();

        // 8. Initialize PM integration layer (passes eventBus + commandRegistry for plugin wiring)
        const builder: EditorBuilder = new EditorBuilder(config);
        const options: EditorBuilderOptions = builder.initiate(eventBus, commandRegistry, diagnostics);

        // 9. Wire EventAggregator — maps internal PM events to public editor events
        const aggregator: EventAggregator = new EventAggregator(
            eventBus,
            () => DocumentMapper.fromPMDoc(options.integration.getState().doc, options.idGen),
            () => options.integration.getState().selection as never,
            () => options.idGen
        );
        const editor: HeadlessEditor = new HeadlessEditor(
            config,
            options.integration,
            options.idGen,
            options.initialDoc,
            diagnostics,
            eventBus,
            serviceRegistry,
            lifecycleManager,
            aggregator,
            commandRegistry,
            options.commandManager,
            options.extensionManager
        );

        options.extensionCompiler.bindEditorAndFinalize(editor);

        // Store adapted NodeViews on the editor so buildViewProps() can use them at mount() time.
        // adaptNodeViews bridges PM-free constructors → real PM NodeView factories.
        editor.adaptedNodeViews = adaptNodeViews(options.extensionCompiler.getNodeViews()) as DirectEditorProps['nodeViews'];

        // 11. Add the keymap plugin to the PM state. The keymap plugin is
        //     built now (post-Editor) so its handlers close over the
        //     fully constructed editor and `editor.commands` facade.
        const keymapPlugin: unknown = builder.initializedKeymapPlugin();
        options.integration.addPlugins([keymapPlugin as never]);

        // 12. Add the image upload plugin if the image extension is registered.
        //     This plugin needs direct access to the editor instance to subscribe
        //     to file upload events, so it's added after the editor is fully constructed.
        //     Like the keymap plugin, this is built post-Editor to close over the
        //     fully constructed editor.
        const hasImageExtension: boolean = options.extensionManager?.getExtensions().some(
            (ext: any) => ext?.definition?.name === 'image'
        ) ?? false;

        if (hasImageExtension) {
            const imageUploadPlugin: unknown = builder.initializedImageUploadPlugin(
                editor,
                editor.uploadStateRegistry
            );
            options.integration.addPlugins([imageUploadPlugin as never]);
        }

        // Wire config-level lifecycle callbacks to their corresponding public events.
        editor.wireConfigCallbacks(config);

        editor.aggregator.publishEditorCreated();
        // `created` is invoked directly so it fires synchronously after init,
        // matching the EventBus timing without requiring a subscription.
        if (config.created) {
            config.created();
        }
        return editor;
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    /**
     * Mounts the editor into the given container element. DOM required.
     *
     * If `config.autofocus` is set, focuses the editor after mounting:
     *   - `true` or `'auto'`: at the last saved selection (or start if none)
     *   - `'start'`: at document beginning
     *   - `'end'`: at document end
     *
     * @param {HTMLElement} container - The DOM element to mount the editor into.
     * @returns {void}
     */
    public mount(container: HTMLElement): void {
        this.integration.mount(container, this.buildViewProps());

        // Handle autofocus after mounting
        if (this.config.autofocus) {
            this.applyAutofocus(this.config.autofocus);
        }
    }

    /**
     * Destroys the PM view but preserves state. Can be re-mounted.
     *
     * @returns {void}
     */
    public unmount(): void {
        this.integration.unmount();
    }

    /**
     * Applies autofocus according to the autofocus config value.
     *
     * @param {boolean | 'start' | 'end' | 'auto'} autofocus - The autofocus mode.
     * @returns {void}
     * @hidden
     */
    private applyAutofocus(autofocus: boolean | 'start' | 'end' | 'auto'): void {
        const state: PMEditorState = this.integration.getState();
        let focusPosition: number;

        if (autofocus === 'start') {
            // Focus at document start
            focusPosition = 1;
        } else if (autofocus === 'end') {
            // Focus at document end
            focusPosition = state.doc.content.size;
        } else {
            // autofocus === true || autofocus === 'auto': use current selection or start
            focusPosition = state.selection.from !== state.selection.to
                ? state.selection.from
                : 1;
        }

        // Create new selection at focus position and apply transaction
        const tr: typeof state.tr = state.tr.setSelection(TextSelection.create(state.doc, focusPosition));
        this.integration.dispatch(tr);

        // Focus the PM view
        this.integration.focusView();
    }

    /**
     * Subscribes each provided config-level lifecycle callback to its
     * corresponding public EventBus event.
     *
     * `created` and `destroyed` are handled directly in `create()` and
     * `destroy()` respectively and are NOT wired here to avoid double-firing.
     *
     * @param {EditorConfig} callbacks - Callbacks from EditorConfig.
     * @returns {void}
     */
    private wireConfigCallbacks(callbacks: EditorConfig): void {
        if (callbacks.contentChanged) {
            const contentChanged: NonNullable<EditorConfig['contentChanged']> = callbacks.contentChanged;
            this.on<ContentChangedPayload>(CONTENT_CHANGED, (payload: ContentChangedPayload): void => { contentChanged(payload); });
        }
        if (callbacks.selectionChanged) {
            const selectionChanged: NonNullable<EditorConfig['selectionChanged']> = callbacks.selectionChanged;
            this.on<SelectionChangedPayload>(SELECTION_CHANGED, (payload: SelectionChangedPayload): void => { selectionChanged(payload); });
        }
        if (callbacks.focus) {
            const focus: NonNullable<EditorConfig['focus']> = callbacks.focus;
            this.on(FOCUS, (): void => { focus(); });
        }
        if (callbacks.blur) {
            const blur: NonNullable<EditorConfig['blur']> = callbacks.blur;
            this.on(BLUR, (): void => { blur(); });
        }
        if (callbacks.beforePaste) {
            const beforePaste: NonNullable<EditorConfig['beforePaste']> = callbacks.beforePaste;
            this.on<BeforePastePayload>(BEFORE_PASTE, (payload: BeforePastePayload): void => { beforePaste(payload); });
        }
        if (callbacks.afterPaste) {
            const afterPaste: NonNullable<EditorConfig['afterPaste']> = callbacks.afterPaste;
            this.on<AfterPastePayload>(AFTER_PASTE, (payload: AfterPastePayload): void => { afterPaste(payload); });
        }
        if (callbacks.beforeDelete) {
            const beforeDelete: NonNullable<EditorConfig['beforeDelete']> = callbacks.beforeDelete;
            this.on<BeforeDeletePayload>(BEFORE_DELETE, (payload: BeforeDeletePayload): void => { beforeDelete(payload); });
        }
        if (callbacks.afterDelete) {
            const afterDelete: NonNullable<EditorConfig['afterDelete']> = callbacks.afterDelete;
            this.on<AfterDeletePayload>(AFTER_DELETE, (payload: AfterDeletePayload): void => { afterDelete(payload); });
        }
    }

    /**
     * Builds the Phase 1 view props passed to `IntegrationManager.mount()`.
     *
     * Phase 1 (this implementation):
     *   - `editable`: driven by `config.readOnly` flag.
     *
     *   This method will be extended to add `handlePaste`.
     *
     * @returns {Partial<DirectEditorProps>} View props for the ProseMirror EditorView.
     */
    private buildViewProps(): Partial<DirectEditorProps> {
        // Initialize file handler if not already created
        if (this.fileHandler === null) {
            this.fileHandler = new FileHandler(this.eventBus, this.uploadStateRegistry);
        }

        // Wire up file upload handler from config if provided
        if (this.config.fileUploadHandler && this.fileHandler) {
            this.fileHandler.setUploadHandler(this.config.fileUploadHandler);
        }

        // Initialize paste handler if not already created
        if (this.pasteHandler === null) {
            this.pasteHandler = createPasteHandler(this.eventBus as any, this.fileHandler);
        }

        return {
            editable: () => !(this.config.readOnly ?? false),
            nodeViews: this.adaptedNodeViews,
            handlePaste: (view: PMEditorView, event: ClipboardEvent): boolean => {
                if (this.pasteHandler) {
                    return this.pasteHandler.handlePaste(view, event) as any;
                }
                return false;
            },
            // Images dragged from the OS file explorer land in the page
            // with no clipboardData — only dataTransfer — so this path is
            // separate from handlePaste but routes into the same
            // insertImageNodes helper.
            handleDrop: (view: PMEditorView, event: DragEvent, _slice: unknown): boolean => {
                if (this.pasteHandler) {
                    return this.pasteHandler.handleDrop(view, event) as any;
                }
                return false;
            },
            // Pre-empt the browser's default dragover behavior when at
            // least one file is being dragged; otherwise the drop event
            // never fires for us. Text drags fall through untouched.
            handleDOMEvents: {
                dragover: (view: PMEditorView, event: Event): boolean => {
                    const dragEvent: DragEvent = event as DragEvent;
                    if (!dragEvent.dataTransfer) {
                        return false;
                    }
                    const types: readonly string[] = Array.from(dragEvent.dataTransfer.types);
                    if (types.indexOf('Files') !== -1) {
                        event.preventDefault();
                        dragEvent.dataTransfer.dropEffect = 'copy';
                    }
                    return false;
                }
            }
        };
    }

    /**
     * Fully destroys the editor in reverse bootstrap order:
     * integration → lifecycleManager → registry → eventBus → diagnostics
     * Subsequent calls are no-ops.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.aggregator.publishEditorDestroyed();
        if (this.config.destroyed) {
            this.config.destroyed();
        }
        this.subscriptions.forEach((d: IDisposable) => d.dispose());
        this.subscriptions.clear();
        if (this.blurSubscription) {
            this.blurSubscription.dispose();
            this.blurSubscription = null;
        }
        this.aggregator.dispose();
        this.integration.destroy();
        this.lifecycleManager.dispose();
        this.serviceRegistry.dispose();
        this.eventBus.dispose();
        // Final safety net: clear runtime upload state and any remaining
        // registry listeners so nothing can outlive the editor.
        this.uploadStateRegistry.clear();
        this.diagnostics.dispose();
    }

    /**
     * Returns the ExtensionManager if extensions were loaded.
     *
     * @returns {ExtensionManager|undefined} The extension manager instance if extensions were loaded; otherwise, `undefined`.
     */
    public getExtensionManager(): ExtensionManager | undefined {
        return this.extensionManager;
    }

    /**
     * Returns the FileHandler for managing file uploads.
     * Lazy-initializes on first access via buildViewProps().
     *
     * @returns {FileHandler} The file handler instance.
     */
    public getFileHandler(): FileHandler {
        // Ensure fileHandler is initialized before returning
        if (this.fileHandler === null) {
            this.fileHandler = new FileHandler(this.eventBus, this.uploadStateRegistry);
        }
        return this.fileHandler;
    }

    /**
     * Sets the product's file upload handler.
     * Must be called before file operations (paste/drop) begin.
     *
     * Example:
     * ```ts
     * import { FileUploadHandler } from '@syncfusion/ej2-headless-editor';
     *
     * const handler: FileUploadHandler = {
     *   upload: async (request) => {
     *     const formData = new FormData();
     *     formData.append('file', request.file);
     *     const response = await fetch('/api/upload', { method: 'POST', body: formData });
     *     return { url: response.json().url };
     *   }
     * };
     *
     * editor.setFileUploadHandler(handler);
     * ```
     *
     * @param {FileUploadHandler} handler - The upload handler implementation
     * @returns {void}
     * @public
     */
    public setFileUploadHandler(handler: FileUploadHandler): void {
        this.getFileHandler().setUploadHandler(handler);
    }

    /**
     * Subscribes to a public editor event by name.
     * The handler receives the event payload directly — identical to the
     * corresponding config-level callback argument.
     *
     * Example:
     * ```ts
     * editor.on('contentChanged', ({ document, selection }) => { });
     * editor.on('focus', () => { });
     * ```
     *
     * @param {string} eventName - The public event name (e.g. `'contentChanged'`).
     * @param {Function} handler - Invoked with the event payload on each occurrence.
     * @returns {void}
     */
    public on<T>(
        eventName: string,
        handler: (payload: T) => void
    ): void {
        const internalHandler: (event: EditorEvent<T>) => void = (event: EditorEvent<T>): void => { handler(event.payload); };
        const disposable: IDisposable = this.eventBus.subscribe(
            eventName,
            internalHandler,
            SubscriberPriority.Normal
        );
        this.subscriptions.set(handler, disposable);
    }

    /**
     * Removes a previously registered event handler.
     *
     * @param {string} eventName - The public event name to unsubscribe from.
     * @param {Function} handler - The handler originally passed to `on`.
     * @returns {void}
     */
    public off<T>(
        eventName: string,
        handler: (payload: T) => void
    ): void {
        const disposable: IDisposable | undefined = this.subscriptions.get(handler);
        if (!disposable) {
            return;
        }
        disposable.dispose();
        this.subscriptions.delete(handler);
    }
    // ── Command API ───────────────────────────────────────────────────────────

    /**
     * Execute a command by name.
     *
     * @param {string} name - Registered command name (e.g. `'toggleBold'`).
     * @param {*} [payload] - Optional payload; type is validated at runtime by the command.
     * @returns {boolean} `true` if the command dispatched a transaction; `false` otherwise.
     * @throws UnknownCommandError if `name` is not registered.
     */
    public execute(name: string, payload?: unknown): boolean {
        return this.manager.execute(name, payload);
    }

    /**
     * Returns a `TypedCanFacade` proxy for availability checks.
     *
     * `editor.can().toggleBold()` evaluates `canExecute` without dispatching.
     * A new facade instance is created per call (cheap — proxy only).
     */
    /**
     * Returns a `TypedCanFacade` proxy for availability checks.
     *
     * `editor.can().toggleBold()` evaluates `canExecute` without dispatching.
     * A new facade instance is created per call (cheap — proxy only).
     *
     * @returns {TypedCanFacade} A facade for read-only command availability checks.
     */
    public can(): TypedCanFacade {
        return createCanFacade(this.manager);
    }

    /**
     * Returns a `TypedChain` for deferred, batched command execution.
     *
     * `editor.chain().toggleBold().insertText({ text: 'x' }).run()`
     * dispatches exactly one transaction regardless of how many steps are queued.
     *
     * A new `ChainBuilder` (and facade) is created per call.
     *
     * @returns {TypedChain} A new typed chain facade.
     */
    public chain(): TypedChain {
        const builder: ChainBuilder = new ChainBuilder(this.commandRegistry, this.integration);
        return createChainFacade(builder);
    }

    /**
     * Returns the nesting depth of the given list type at the current cursor/selection.
     *
     * A depth of `0` indicates that the current selection is not inside a list
     * of that type. Higher values represent deeper levels of nested lists of
     * the same type.
     *
     * @param {'ordered' | 'bullet'} listType - The logical list type to measure.
     * @returns {number} The current list nesting depth.
     */
    public getCurrentListDepth(listType: 'ordered' | 'bullet'): number {
        return this.integration.getCurrentListDepth(listType);
    }

    // ── Document access ───────────────────────────────────────────────────────

    /**
     * Returns the current document as a pure `DocumentRoot`.
     * No PM types appear in the return value.
     * Throws `EditorLifecycleError` if destroyed.
     *
     * @returns {DocumentRoot} The current document snapshot.
     */
    public getDocument(): DocumentRoot {
        const pmState: ReturnType<IntegrationManager['getState']> = this.integration.getState(); // throws if destroyed
        return DocumentMapper.fromPMDoc(pmState.doc, this.idGen);
    }

    /**
     * Returns the plain-text content of the current selection.
     * Returns an empty string if the selection is collapsed (cursor only) or
     * if the editor has been destroyed.
     *
     * @returns {string} The selected text, or '' if the selection is collapsed.
     */
    public getSelectionText(): string {
        try {
            const { from, to, empty }: { from: number; to: number; empty: boolean } = this.getSelection();
            if (empty || from === to) {
                return '';
            }
            const state: PMEditorState = this.integration.getState();
            return state.doc.textBetween(from, to, '\n', '\ufffc');
        } catch {
            return '';
        }
    }

    /**
     * Returns the current selection range.
     *
     * @returns {{from: number, to: number, empty: boolean}} The current selection range.
     */
    public getSelection(): { from: number; to: number; empty: boolean } {
        return this.integration.getState().selection as { from: number; to: number; empty: boolean };
    }

    // ── Selection save & restore ──────────────────────────────────────────────

    /**
     * Captures the current PM selection as a PM-free SelectionSnapshot.
     *
     * The snapshot is held by the editor. The next call to
     * `editor.commands.x()`, `editor.can().x()`, `editor.execute(x)`, or
     * any chain run/canRun will auto-apply the snapshot to the live state
     * before the command runs. This is what makes toolbar-button clicks
     * (which blur the editor) safe — the original range is restored
     * transparently.
     *
     * Calling `saveSelection()` again replaces the previously held snapshot.
     *
     * @returns {SelectionSnapshot} The captured snapshot.
     * @throws EditorLifecycleError if the editor has been destroyed.
     */
    public saveSelection(): SelectionSnapshot {
        if (this.isDestroyed) {
            throw new EditorLifecycleError('Editor has been destroyed');
        }
        return this.selectionManager.save();
    }

    /**
     * Applies a previously captured selection snapshot to the live state.
     *
     * If no snapshot is provided, the most recently held snapshot is used.
     * If an explicit snapshot is provided, it replaces the held one only on
     * success; on failure (stale), the held snapshot is updated to the
     * provided one's status.
     *
     * Restore does NOT mark the snapshot as consumed — only command
     * execution consumes. Calling `restoreSelection` then immediately
     * running a command is the same as a single command run.
     *
     * @param {SelectionSnapshot} [snapshot] - Optional explicit snapshot. Defaults to the held one.
     * @returns {boolean} `true` if the snapshot was applied; `false` if it was stale or missing.
     * @throws EditorLifecycleError if the editor has been destroyed.
     */
    public restoreSelection(snapshot?: SelectionSnapshot): boolean {
        if (this.isDestroyed) {
            throw new EditorLifecycleError('Editor has been destroyed');
        }
        return this.selectionManager.restore(snapshot);
    }

    /**
     * Enables or disables auto-save-on-blur. When enabled, the framework
     * subscribes to the internal FOCUS_LOST event and calls
     * `saveSelection()` automatically. Use this when toolbar buttons are
     * outside the editor and clicks would otherwise lose the selection.
     *
     * Calling this method updates the subscription immediately. Disabling
     * disposes the subscription; the currently held snapshot is unaffected.
     *
     * @param {boolean} enabled - Whether to auto-save the selection on every blur.
     * @returns {void}
     * @hidden
     */
    public setAutoSaveSelectionOnBlur(enabled: boolean): void {
        this.config.autoSaveSelectionOnBlur = !!enabled;
        if (this.blurSubscription) {
            this.blurSubscription.dispose();
            this.blurSubscription = null;
        }
        if (this.config.autoSaveSelectionOnBlur) {
            this.blurSubscription = this.eventBus.subscribe(
                FOCUS_LOST,
                (): void => {
                    try {
                        this.saveSelection();
                    } catch {
                        // ignore — already destroyed or no selection to save
                    }
                },
                SubscriberPriority.Normal
            );
        }
    }

    // ── Context-Aware Node Queries ────────────────────────────────────────────

    /**
     * Returns the currently selected atom node (for NodeSelection on an image,
     * horizontal rule, hard break, etc.).
     *
     * Returns null for any other selection shape (Text, Cell, Block, All).
     * Use {@link getSelectedBlock} for block-level context; use
     * {@link getSelectedCell} for table cells.
     *
     * The returned node includes its live DOM element (if mounted) for toolbar
     * positioning.
     *
     * @returns {SelectedNode | null} Info for the selected atom, or null.
     */
    public getSelectedNode(): SelectedNode | null {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const pmView: PMEditorView = this.integration.getView();
            return this.selectedNodeResolver.resolveSelectedNode(
                pmState.selection,
                pmState.doc,
                pmView,
                this.idGen
            );
        } catch {
            return null;
        }
    }

    /**
     * Returns the block-level node that encloses the current selection.
     *
     * For any selection shape, walks up the node tree to find the nearest
     * ancestor with `group: 'block'` in its schema. Returns the document
     * root as a fallback.
     *
     * The returned node includes its live DOM element (if mounted) for toolbar
     * positioning.
     *
     * @returns {SelectedNode | null} Info for the enclosing block, or null if destroyed.
     */
    public getSelectedBlock(): SelectedNode | null {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const pmView: PMEditorView = this.integration.getView();
            return this.selectedNodeResolver.resolveSelectedBlock(
                pmState.selection,
                pmState.doc,
                pmView,
                this.idGen
            );
        } catch {
            return null;
        }
    }

    /**
     * Returns all block-level nodes that intersect the current selection.
     *
     * For a cursor or single selection, returns a single block.
     * For a range spanning multiple blocks, returns all blocks in the range.
     *
     * Each returned node includes its live DOM element (if mounted) for toolbar
     * positioning.
     *
     * @returns {SelectedNode[]} Array of block nodes. Empty if destroyed or not mounted.
     */
    public getSelectedBlocks(): SelectedNode[] {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const pmView: PMEditorView = this.integration.getView();
            return this.selectedNodeResolver.resolveSelectedBlocks(
                pmState.selection,
                pmState.doc,
                pmView,
                this.idGen
            );
        } catch {
            return [];
        }
    }

    /**
     * Returns the text content of the code block at the current selection.
     *
     * Falls back to the first code block in the document when the
     * cursor is not currently inside one — this is the case when a
     * NodeView's header UI (Copy button, language dropdown) owns focus
     * and PM's selection has not yet been re-positioned into the code
     * block. The fallback mirrors `setCodeBlockLanguage` so both header
     * surfaces stay consistent.
     *
     * @returns {string} Plain text of the resolved code block, or '' if none exists / editor destroyed.
     */
    public getCodeBlockContent(): string {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return readCodeBlockContent(pmState);
        } catch {
            return '';
        }
    }

    /**
     * Returns the language attribute of the code block at the current selection.
     *
     * Falls back to the first code block in the document when the
     * cursor is not currently inside one — mirrors `getCodeBlockContent`
     * so the NodeView's header UI (language dropdown, Copy button) can
     * read the language even when Syncfusion's widget wrapper owns focus.
     *
     * @returns {string} Language of the resolved code block, or '' if none exists / editor destroyed.
     */
    public getCodeBlockLanguage(): string {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return readCodeBlockLanguage(pmState);
        } catch {
            return '';
        }
    }

    /**
     * Returns the currently selected image node (for NodeSelection on an image).
     *
     * @returns {SelectedNode | null} Info for the selected image, or null.
     */
    public getSelectedImage(): SelectedNode | null {
        const node: SelectedNode = this.getSelectedNode();
        if (!node) {
            return null;
        }
        return node.node.type === 'image' ? node : null;
    }

    /**
     * Returns the currently selected table cell (for CellSelection).
     *
     * For multi-cell selections, returns the anchor (first) cell only.
     * Use {@link getSelectedCells} to retrieve all selected cells.
     *
     * The returned cell includes its live DOM element (if mounted), row and
     * table node references, and 0-based row/column coordinates for toolbar
     * actions like "delete column".
     *
     * @returns {SelectedCell | null} Info for the anchor cell, or null.
     */
    public getSelectedCell(): SelectedCell | null {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const pmView: PMEditorView = this.integration.getView();
            const syncDoc: DocumentRoot = this.currentDoc;
            return this.selectedNodeResolver.resolveSelectedCell(
                pmState.selection,
                pmState.doc,
                pmView,
                this.idGen,
                syncDoc
            );
        } catch {
            return null;
        }
    }

    /**
     * Returns all currently selected table cells (for CellSelection).
     *
     * For non-CellSelection, returns an empty array.
     * Each cell includes its live DOM element (if mounted), row and table
     * references, and 0-based coordinates.
     *
     * @returns {SelectedCell[]} Array of cell info. Empty for non-cell selections.
     */
    public getSelectedCells(): SelectedCell[] {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const pmView: PMEditorView = this.integration.getView();
            const syncDoc: DocumentRoot = this.currentDoc;
            return this.selectedNodeResolver.resolveSelectedCells(
                pmState.selection,
                pmState.doc,
                pmView,
                this.idGen,
                syncDoc
            );
        } catch {
            return [];
        }
    }

    /**
     * Returns all leaf nodes (atom nodes with no children: image, horizontal rule,
     * hard break, etc.) within the current selection range.
     *
     * Each returned node includes its live DOM element (if mounted) for toolbar
     * positioning or bulk operations.
     *
     * @returns {SelectedNode[]} Array of leaf nodes. Empty if none are selected or destroyed.
     */
    public getSelectedLeafNodes(): SelectedNode[] {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const pmView: PMEditorView = this.integration.getView();
            return this.selectedNodeResolver.resolveSelectedLeafNodes(
                pmState.selection,
                pmState.doc,
                pmView,
                this.idGen
            );
        } catch {
            return [];
        }
    }

    // ── Active Marks State (Toolbar Synchronization) ─────────────────────────

    /**
     * Get set of active mark type names on current selection.
     *
     * Efficiently queries marks at the current cursor position or range.
     * For ranges, returns only marks present on all selected text (intersection).
     *
     * **Performance:** O(inline nodes in selection) using PM's nodesBetween.
     *
     * **Use case:** Toolbar state synchronization on selectionChange.
     *
     * @returns {Set<string>} Set of active mark names; empty set if no marks or selection destroyed.
     *
     * @example
     * ```typescript
     * editor.on('selectionChange', () => {
     *     const activeMarks = editor.getActiveMarks();
     *     updateToolbar({
     *         bold: activeMarks.has('bold'),
     *         italic: activeMarks.has('italic'),
     *         link: activeMarks.has('link')
     *     });
     * });
     * ```
     */
    public getActiveMarks(): Set<string> {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return this.activeMarksResolver.resolveActiveMarks(pmState);
        } catch {
            return new Set();
        }
    }

    /**
     * Check if a specific mark is active on current selection.
     *
     * If `attrs` is provided, checks that the mark is active AND all attributes match exactly.
     * For range selections, checks attributes at the anchor (first) position.
     *
     * **Use when:** Single mark check in conditional.
     * **Avoid for:** Multiple sequential checks (call getActiveMarks() instead).
     *
     * @param {string} markName - Mark type name (e.g., 'bold', 'italic', 'link')
     * @param {Record<string, unknown>} [attrs] - Optional attributes to match. If provided, all attributes must match exactly.
     * @returns {boolean} `true` if mark is active (and attributes match if provided); `false` otherwise
     *
     * @example
     * ```typescript
     * if (editor.isMarkActive('bold')) {
     *     boldButton.classList.add('active');
     * }
     * if (editor.isMarkActive('link', { href: 'https://example.com' })) {
     *     linkButton.classList.add('active');
     * }
     * ```
     */
    public isMarkActive(markName: string, attrs?: Record<string, unknown>): boolean {
        const activeMarks: Set<string> = this.getActiveMarks();

        if (!activeMarks.has(markName)) {
            return false;
        }

        // If no attrs filter, mark is active
        if (!attrs) {
            return true;
        }

        // Check if attrs match exactly
        const markAttrs: Record<string, unknown> | null = this.getMarkAttributes(markName);
        if (!markAttrs) {
            return false;
        }

        // Compare all provided attrs
        const attrKeys: string[] = Object.keys(attrs);
        for (let i: number = 0; i < attrKeys.length; i++) {
            const key: string = attrKeys[i as number];
            const value: unknown = attrs[`${key}`];
            if (markAttrs[`${key}`] !== value) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get attributes of a specific mark at current selection.
     *
     * Returns mark attributes only if the mark is active at current selection.
     * For range selections, returns the anchor (first position) mark's attributes.
     *
     * **Single source of truth:** Delegates to `ActiveMarksResolver.getActiveMarkAttributes()`.
     *
     * @param {string} markName - Mark type name (e.g., 'bold', 'italic', 'link', 'font-color')
     * @returns {Record<string, unknown>} Mark attributes object if mark is active; null if not active, unknown mark, or not a text selection
     *
     * @example
     * ```typescript
     * const linkAttrs = editor.getMarkAttributes('link');
     * if (linkAttrs) {
     *     console.log('Link URL:', linkAttrs.href);
     * }
     * ```
     */
    public getMarkAttributes(markName: string): Record<string, unknown> | null {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return this.activeMarksResolver.getActiveMarkAttributes(pmState, markName) as Record<string, unknown> | null;
        } catch {
            return null;
        }
    }

    // ── Document Serialization ────────────────────────────────────────────────

    /**
     * Serializes the entire document to HTML.
     *
     * Uses the schema's parseDOM and serialization rules to generate valid HTML.
     * All extension node specs and mark specs contribute to serialization via their
     * `toDOM` specifications.
     *
     * @returns {string} The HTML representation of the current document. Empty string on error.
     *
     * @example
     * ```typescript
     * const html = editor.getHtml();
     * console.log(html); // "<p>Hello <strong>world</strong></p>"
     * ```
     */
    public getHtml(): string {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const serializer: InstanceType<typeof PMDOMSerializer> = PMDOMSerializer.fromSchema(pmState.schema);
            const domNode: unknown = serializer.serializeFragment(pmState.doc.content);
            const container: HTMLElement = document.createElement('div');
            container.appendChild(domNode as Node);
            return container.innerHTML;
        } catch {
            return '';
        }
    }

    // ── Document Replacement ──────────────────────────────────────────────────

    /**
     * Replaces the entire document content with the supplied HTML markup.
     *
     * The HTML is parsed through the same schema-driven pipeline used at
     * create-time (`EditorConfig.content`): every `parseDOM` rule contributed
     * by the loaded extensions is applied, then the parsed tree replaces the
     * current document body in **one transaction**.
     *
     * Because replacement is a single transaction on the live editor state:
     * - The editor instance, PM view, plugins, and undo stack are preserved —
     *   no destroy/re-create, no remount.
     * - NodeViews for the old document are destroyed and NodeViews for the
     *   new document are created by the normal PM view update.
     * - `contentChanged` and `documentChanged` (action `'Replaced'`) fire once.
     * - The replacement is a single undo step; `undo()` restores the previous
     *   content.
     * - The selection is reset to the start of the new document.
     *
     * All-or-nothing: when parsing fails, a diagnostic warning is emitted, the
     * existing document and selection are left untouched, no events fire, and
     * `false` is returned.
     *
     * @param {string} html - The HTML markup for the new document. An empty or
     *        whitespace-only string resets the document to a single empty paragraph.
     * @returns {boolean} `true` when the content was replaced; `false` when the
     *          HTML could not be parsed and the previous content is preserved.
     *
     * @throws EditorLifecycleError When the editor is destroyed.
     *
     * @example
     * ```typescript
     * editor.setContent('<h1>New Title</h1><p>Fresh content.</p>');
     * editor.getHtml(); // "<h1>New Title</h1><p>Fresh content.</p>"
     * ```
     */
    public setContent(html: string): boolean {
        // Strict lifecycle check — matches getDocument()/saveSelection().
        const pmState: PMEditorState = this.integration.getState(); // throws if destroyed

        if (typeof html !== 'string') {
            this.diagnostics.warn('setContent() ignored: the html argument must be a string.');
            return false;
        }

        // Empty / whitespace-only input resets to a default empty document.
        if (html.trim() === '') {
            return this._setEmptyDocument();
        }

        try {
            const newRoot: DocumentRoot = parseHtmlToDocument(html, pmState.schema as PMSchema, this.idGen);
            // Convert once: DocumentRoot → PM doc, taking the body content.
            const newPMDoc: PMNode = DocumentMapper.toPMDoc(newRoot, pmState.schema as PMSchema);
            return this._replaceDocument(newPMDoc.content, false);
        } catch (error) {
            this.diagnostics.warn(
                `setContent() failed to parse HTML. Existing content preserved. Error: ${String(error)}`
            );
            return false;
        }
    }

    /**
     * Shared reset path for empty `setContent` input: converts the empty root
     * once and delegates to the replacement primitive.
     *
     * @returns {boolean} `true` when the transaction was dispatched.
     * @hidden
     */
    private _setEmptyDocument(): boolean {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const emptyPMDoc: PMNode = DocumentMapper.toPMDoc(this._buildEmptyRoot(), pmState.schema as PMSchema);
            return this._replaceDocument(emptyPMDoc.content, false);
        } catch (error) {
            this.diagnostics.warn(
                `setContent() failed to build the empty document. Existing content preserved. Error: ${String(error)}`
            );
            return false;
        }
    }

    /**
     * Replaces the entire document content with the supplied structured document.
     *
     * The structured tree replaces the current document body in **one
     * transaction**, with the same lifecycle guarantees as
     * {@link HeadlessEditor.setContent}: view/plugins/undo preserved, NodeViews
     * swapped by the normal PM view update, single undo step, selection reset
     * to document start.
     *
     * All-or-nothing: when the document is invalid (unknown node types,
     * unregistered marks), a diagnostic warning is emitted, the existing
     * document and selection are left untouched, no events fire, and `false`
     * is returned.
     *
     * @param {DocumentRoot} doc - The new document. The live root `id` is taken
     *        from the supplied document; child node ids are preserved when
     *        present and generated when absent.
     * @returns {boolean} `true` when the document was replaced; `false` when the
     *          payload was rejected and the previous content is preserved.
     *
     * @throws EditorLifecycleError When the editor is destroyed.
     *
     * @example
     * ```typescript
     * editor.setDocument({
     *     type: 'document', id: 'root', attrs: {}, marks: [],
     *     schemaVersion: 1,
     *     children: [{ type: 'paragraph', id: 'p1', attrs: {}, marks: [], children: [] }]
     * });
     * ```
     */
    public setDocument(doc: DocumentRoot): boolean {
        // Strict lifecycle check — matches getDocument()/saveSelection().
        const pmState: PMEditorState = this.integration.getState(); // throws if destroyed

        if (doc === null || doc === undefined || typeof doc !== 'object') {
            this.diagnostics.warn('setDocument() ignored: the doc argument must be a DocumentRoot object.');
            return false;
        }

        try {
            // Convert once here (validating unknown node/mark types via the
            // NodeMapper throw), then hand the fragment to the shared
            // replacement primitive — no second conversion.
            const newPMDoc: PMNode = DocumentMapper.toPMDoc(doc, pmState.schema as PMSchema);
            return this._replaceDocument(newPMDoc.content, true, doc.id);
        } catch (error) {
            this.diagnostics.warn(
                `setDocument() failed to map the supplied document. Existing content preserved. Error: ${String(error)}`
            );
            return false;
        }
    }

    /**
     * Core replacement primitive shared by `setContent`/`setDocument`.
     *
     * Swaps the document body in one transaction (`replaceWith(0, size, …)`) and
     * resets the selection to the start of the new document. Dispatching through
     * `IntegrationManager.dispatch` keeps every existing guarantee: history
     * records a single undo step, NodeView create/destroy happens in the PM
     * view update, the EventAggregator publishes `contentChanged` /
     * `documentChanged`, and the selection snapshot staleness hook runs.
     *
     * When the fragment cannot fit the root content rule, the mismatch is
     * detected up front (before any step is recorded) and reported as a warned
     * rejection leaving the previous document untouched.
     *
     * @param {PMFragment} newContent - The pre-converted PM content for the new
     *        document body (callers convert exactly once).
     * @param {boolean} adoptRootId - `true` when the public caller supplied the
     *        root itself (`setDocument`) and its identity should replace the
     *        live root's; `false` to keep the current root id (`setContent`).
     * @param {string} [rootId] - The new root id, applied when `adoptRootId` is set.
     * @returns {boolean} `true` when the transaction was dispatched.
     * @hidden
     */
    private _replaceDocument(newContent: PMFragment, adoptRootId: boolean, rootId?: string): boolean {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const tr: PMTransaction = pmState.tr;

            // Pre-validate the fragment against the root content rule BEFORE
            // recording any step. replaceWith alone cannot catch this: PM
            // node types constructed via create() skip content validation, so
            // an invalid fragment (e.g. empty children against block+) would
            // dispatch and corrupt the document.
            const contentMatch: { matchFragment: (f: PMFragment) => { validEnd: boolean } } =
                pmState.doc.type.contentMatch as never;
            if (!contentMatch.matchFragment(newContent).validEnd) {
                this.diagnostics.warn(
                    'Failed to replace document content: the new content does not match the root content rule. ' +
                    'Existing content preserved.'
                );
                return false;
            }

            // One ReplaceStep covering the full range [0, size].
            tr.replaceWith(0, pmState.doc.content.size, newContent);

            // setDocument adopts the supplied root identity (create-time parity);
            // setContent keeps the current root id.
            if (adoptRootId && rootId !== undefined) {
                tr.setDocAttribute('id', rootId);
            }

            // Collapse the selection to the start of the new document. atStart
            // resolves a valid insertion point for every document shape
            // (including empty bodies) — a raw resolve(1) would throw on those.
            tr.setSelection(TextSelection.atStart(tr.doc));

            this.integration.dispatch(tr);
            return true;
        } catch (error) {
            this.diagnostics.warn(
                `Failed to replace document content. Existing content preserved. Error: ${String(error)}`
            );
            return false;
        }
    }

    /**
     * Builds a minimal empty root for empty-input resets. The PM conversion
     * happens in `_replaceDocument`; this only supplies the seed shape.
     *
     * @returns {DocumentRoot} A single-empty-paragraph document root.
     * @hidden
     */
    private _buildEmptyRoot(): DocumentRoot {
        return {
            id: this.idGen.generate(),
            type: 'document',
            schemaVersion: 1,
            attrs: {},
            marks: [],
            children: [
                {
                    id: this.idGen.generate(),
                    type: 'paragraph',
                    attrs: {},
                    marks: [],
                    children: []
                }
            ]
        };
    }

    /**
     * Returns the plain-text content of the entire document.
     *
     * Strips all formatting and marks, returning only text content.
     *
     * @returns {string} The plain text of the document. Empty string on error.
     *
     * @example
     * ```typescript
     * const text = editor.getText();
     * console.log(text); // "Hello world"
     * ```
     */
    public getText(): string {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return pmState.doc.textContent;
        } catch {
            return '';
        }
    }

    /**
     * Get attributes of the currently selected node.
     *
     * Returns node attributes only if a single node is selected (NodeSelection).
     * For other selection types (Text, Range, Cell), returns null.
     *
     * Use {@link getMarkAttributes} to get attributes of active marks.
     *
     * @param {string} nodeName - Node type name to match (e.g., 'image', 'video', 'table')
     * @returns {Record<string, unknown> | null} Node attributes if a node of the specified type is selected; `null` otherwise
     *
     * @example
     * ```typescript
     * const imageAttrs = editor.getNodeAttributes('image');
     * if (imageAttrs) {
     *     console.log('Image src:', imageAttrs.src);
     * }
     * ```
     */
    public getNodeAttributes(nodeName: string): Record<string, unknown> | null {
        try {
            const selectedNode: SelectedNode | null = this.getSelectedNode();
            if (!selectedNode || selectedNode.node.type !== nodeName) {
                return null;
            }
            return selectedNode.node.attrs ?? {};
        } catch {
            return null;
        }
    }

    // ── Focus Management ──────────────────────────────────────────────────────

    /**
     * Programmatically focus the editor view.
     *
     * Useful for programmatic interaction when the editor loses focus (e.g., after
     * a toolbar button click). The focus is placed at the current selection position.
     *
     * @returns {void}
     *
     * @example
     * ```typescript
     * button.addEventListener('click', () => {
     *     editor.commands.toggleBold();
     *     editor.focusView();
     * });
     * ```
     */
    public focusView(): void {
        try {
            this.integration.focusView();
        } catch {
            // ignore if editor is destroyed or not mounted
        }
    }

    // ── Configuration Updates ─────────────────────────────────────────────────

    /**
     * Updates safe editor configuration properties after initialization.
     *
     * Only a subset of properties can be updated after mount. Structural properties
     * (document, content, extensions) require full re-initialization and cannot be changed.
     *
     * Supported properties:
     * - `readOnly` — Update editor editability (immediately reflected if mounted)
     * - `autofocus` — Update autofocus behavior (applies on next mount if unmounted)
     * - `autoSaveSelectionOnBlur` — Update blur selection auto-save
     * - `enableInputRules` — Update input rules enabled state
     *
     * Unsupported properties (structural, require re-init):
     * - `document`, `content`, `extensions`, `idGenerator`, `schema`
     *
     * @param {Partial<EditorConfig>} options - Configuration properties to update
     * @returns {void}
     *
     * @example
     * ```typescript
     * editor.setOptions({
     *     readOnly: true,
     *     autoSaveSelectionOnBlur: true
     * });
     * ```
     */
    public setOptions(options: Partial<EditorConfig>): void {
        // Whitelist of updateable properties
        const allowedKeys: Set<string> = new Set(['readOnly', 'autofocus', 'autoSaveSelectionOnBlur', 'enableInputRules']);

        // Check for unsupported structural properties
        const unsupportedKeys: string[] = Object.keys(options).filter((key: string) =>
            !allowedKeys.has(key) && (options as Record<string, unknown>)[`${key}`] !== undefined);
        if (unsupportedKeys.length > 0) {
            this.diagnostics.warn(
                `setOptions() does not support updating: ${unsupportedKeys.join(', ')}. ` +
                'These are structural properties that require full re-initialization.'
            );
        }

        // Update readOnly
        if ('readOnly' in options && options.readOnly !== undefined) {
            const readOnly: boolean = !!options.readOnly;
            this.config.readOnly = readOnly;
            // Trigger view update if mounted — ProseMirror will call editable() which now reads updated config
            try {
                const pmState: PMEditorState = this.integration.getState();
                const pmView: PMEditorView = this.integration.getView();
                pmView.updateState(pmState);
            } catch {
                // ignore if editor is destroyed or not mounted
            }
        }

        // Update autofocus
        if ('autofocus' in options && options.autofocus !== undefined) {
            this.config.autofocus = options.autofocus;
        }

        // Update autoSaveSelectionOnBlur
        if ('autoSaveSelectionOnBlur' in options && options.autoSaveSelectionOnBlur !== undefined) {
            this.setAutoSaveSelectionOnBlur(!!options.autoSaveSelectionOnBlur);
        }

        // Update enableInputRules
        if ('enableInputRules' in options && options.enableInputRules !== undefined) {
            this.config.enableInputRules = !!options.enableInputRules;
            // Note: Changing enableInputRules does not require view update as input rules
            // are evaluated during transaction dispatch; the updated config will be used on next input
        }
    }
}
