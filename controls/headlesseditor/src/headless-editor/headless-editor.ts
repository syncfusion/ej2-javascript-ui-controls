import { DocumentRoot } from '../core/model/editor-node';
import { DocumentMapper } from '../pm/adapters/document-mapper';
import { IntegrationManager } from '../pm/integration/integration-manager';
import { adaptNodeViews } from '../pm/nodeviews/node-view';
import type { DirectEditorProps, PMEditorView } from '../pm/pm-guard';
import type { PMEditorState } from '../pm/pm-guard';
import { PMDOMSerializer, TextSelection } from '../pm/pm-guard';
import { PMFragment, PMNode, PMSchema, PMSlice, PMTransaction } from '../pm/pm-guard';
import { parseHtmlToDocument } from '../core/schema/serialization/html-content-parser';
import { PasteHandler, createPasteHandler } from '../pm/adapters/clipboard/paste-handler';
import { sanitizeClipboardHTML } from '../pm/adapters/clipboard/sanitizer';
import type { ClipboardOptions, ClipboardTransformContext, ClipboardContent } from '../core/model/editor-config';
import { EditorBuilder, EditorBuilderOptions } from './editor-builder';
import { EditorConfig } from '../core/model/editor-config';
import {
    CONTENT_CHANGED,
    SELECTION_CHANGED,
    FOCUS,
    BLUR,
    BEFORE_PASTE,
    AFTER_PASTE,
    RESIZE_START,
    RESIZING,
    RESIZE_STOP,
    DOCUMENT_CHANGED,
    BEFORE_FILE_UPLOAD,
    FILE_RECEIVED
} from '../core/events/event-names';
import {
    ContentChangedEventArgs,
    DocumentChangedEventArgs,
    SelectionChangedEventArgs
} from '../core/events/public-events/document-events';
import type { BeforePasteEventArgs, AfterPasteEventArgs } from '../core/events/public-events/clipboard-events';
import {
    ResizeStartEventArgs,
    ResizingEventArgs,
    ResizeStopEventArgs
} from '../core/events/public-events/user-events';
import { DiagnosticsService } from '../core/diagnostics/diagnostics-service';
import { EventBus, SubscriberPriority } from '../core/events/event-bus';
import { ServiceRegistry } from '../core/services/service-registry';
import { ServiceLifecycleManager } from '../core/services/service-lifecycle-manager';
import { DiagnosticsToken, EventBusToken } from '../core/services/built-in-tokens';
import { EventAggregator } from '../core/events/public-events/event-aggregator';
import { EditorEvent, IDisposable } from '../core/events';
import { EditorLifecycleError } from '../core/errors/editor-lifecycle-error';
import { CommandRegistry } from '../core/commands/registry';
import { CommandManager } from '../core/commands/manager';
import { getCodeBlockContent, getCodeBlockLanguage } from '../extensions/code-block/helper';
import { createCommandsFacade, createCanFacade, createChainFacade } from '../core/commands/facade';
import { TypedCommandsFacade, TypedCanFacade, TypedChain } from '../core/commands/typed-surface';
import { ChainBuilder } from '../core/commands/chain';
import { SelectionManager } from '../pm/integration/selection-manager';
import { SelectionAdapter } from '../pm/adapters/selection-adapter';
import { SelectedNodeResolver } from '../pm/integration/selected-node-resolver';
import { ActiveMarksResolver } from '../pm/integration/active-marks-resolver';
import { SelectionContextResolver } from '../pm/integration/selection-context-resolver';
import type { SelectedNode, SelectedCell, SelectionSnapshot } from '../core/model/selection';
import type { SelectionContext } from '../core/model/selection-context';
import { FOCUS_LOST } from '../core/events/event-names';
import type { ExtensionManager } from '../extensions/extension-manager';
import { FileHandler } from '../core/services/file-handler';
import { UploadStateRegistry } from '../core/services/upload-state-registry';
import type { FileUploadHandler } from '../core/model/file-upload-handler';
import { initializeTelemetry, validateLicense } from '@syncfusion/ej2-base';
import { BeforeFileUploadEventArgs, FileReceivedEventArgs } from '../core/events/public-events/file-upload-events';

/**
 * HeadlessEditor — Syncfusion's frameworkless rich text editor with complete command control,
 * extension system, and event-driven architecture.
 *
 * The Headless Editor provides a decoupled editing engine with no DOM dependencies for initialization,
 * full undo/redo, custom content schemas, extensible node types,
 * and comprehensive keyboard/paste/clipboard handling. Mount into any DOM container and control
 * via the typed command system.
 *
 * ```typescript
 * // Create and mount editor
 * const editor = HeadlessEditor.create({ schema: mySchema });
 * editor.mount(document.getElementById('editor'));
 *
 * // Execute typed commands
 * editor.commands.toggleBold();
 * editor.commands.setHeading({ level: 1 });
 * editor.commands.insertImage({ src: 'image.png' });
 *
 * // Query editor state
 * const doc = editor.getDocument();
 * const selection = editor.getSelection();
 *
 * // Subscribe to events
 * editor.on('contentChanged', (args) => console.log('Updated:', args.document));
 *
 * // Cleanup
 * editor.destroy();
 * ```
 */
export class HeadlessEditor {
    private readonly config: EditorConfig;
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
    private readonly selectionContextResolver: SelectionContextResolver;
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
     *
     * @hidden
     */
    public readonly uploadStateRegistry: UploadStateRegistry = new UploadStateRegistry();

    /**
     * Constructor is only called by Editor.create() via EditorBuilder.
     * Direct instantiation is not supported.
     *
     * Implementation detail; use Editor.create() instead.
     *
     * @param {EditorConfig} config - Resolved editor configuration used to construct the editor.
     * @param {IntegrationManager} integration - Fully initialized IntegrationManager (owns PM state).
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
        this.selectionContextResolver = new SelectionContextResolver();

        // Activate the auto-save-on-blur subscription if requested.
        if (this.config.autoSaveSelectionOnBlur) {
            this.setAutoSaveSelectionOnBlur(true);
        }
        validateLicense('headless-editor');
        initializeTelemetry('HeadlessEditor');
    }

    // ── Factory ───────────────────────────────────────────────────────────────

    /**
     * Creates a fully initialized HeadlessEditor instance.
     *
     * Performs full bootstrap of the editor including schema compilation, extension loading, command registry
     * initialization, and service layer setup. This method is called directly by applications; the constructor
     * is not public.
     *
     * The returned HeadlessEditor is ready for immediate use but does NOT attach to the DOM. Call `mount(container)`
     * to render the editor in the DOM. The editor can be mounted and unmounted multiple times without re-initialization.
     *
     * @param {EditorConfig} config - The editor configuration object containing schema, extensions, event callbacks, and options.
     *
     * @returns {HeadlessEditor} A fully initialized, DOM-independent editor instance ready for mounting and command execution.
     *
     * @throws {Error} Throws if the configuration is invalid or schema compilation fails.
     *
     * @example
     * ```typescript
     * // Create editor with schema and extensions
     * const editor = HeadlessEditor.create({
     *   schema: mySchema,
     *   extensions: [boldExtension, italicExtension],
     *   autofocus: 'start',
     *   created: () => console.log('Editor ready!')
     * });
     *
     * // Mount to DOM and use
     * editor.mount(document.getElementById('editor'));
     * editor.commands.toggleBold();
     * ```
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
            () => DocumentMapper.fromPMDoc(options.integration.getState().doc),
            () => options.integration.getState().selection as never
        );
        const editor: HeadlessEditor = new HeadlessEditor(
            config,
            options.integration,
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
     * Mounts the editor into the specified DOM container element.
     *
     * Creates the ProseMirror editor view within the container and initializes event listeners.
     * The container element must be a valid HTMLElement in the document. After mounting, the editor
     * is interactive and ready for user input and command execution.
     *
     * Autofocus behavior is controlled by `config.autofocus`:
     * - `true` or `'auto'`: Focuses at the last saved selection if available, otherwise at document start
     * - `'start'`: Focuses at the beginning of the document
     * - `'end'`: Focuses at the end of the document
     * - `false` or undefined: No autofocus (editor container must be manually focused if needed)
     *
     * The editor can be mounted, unmounted (`unmount()`), and re-mounted multiple times on the same instance.
     *
     * @param {HTMLElement} container - The DOM element that will contain the editor view. Must be a valid HTMLElement present in the document.
     *
     * @returns {void}
     *
     * @throws {Error} Throws if container is not a valid HTMLElement or if the editor is already destroyed.
     *
     * @example
     * ```typescript
     * // Mount editor into a div container
     * const container = document.getElementById('editor');
     * editor.mount(container);
     *
     * // Editor is now interactive and visible
     * editor.commands.focus();
     * editor.commands.toggleBold();
     * ```
     */
    public mount(container: HTMLElement): void {
        this.integration.mount(container, this.buildViewProps());

        // Handle autofocus after mounting
        if (this.config.autofocus) {
            this.applyAutofocus(this.config.autofocus);
        }
    }

    /**
     * Unmounts the editor from the DOM without destroying the editor instance.
     *
     * This method detaches the ProseMirror view from the DOM container but preserves all editor state
     * (document, selection, history). The editor can be re-mounted to a container (same or different)
     * using `mount()` without loss of state or configuration.
     *
     * All event listeners attached to the DOM are removed and the view is disposed.
     * The editor instance remains valid and can be used to query state via `getDocument()`, `getSelection()`, etc.
     *
     * @returns {void}
     *
     * @example
     * ```typescript
     * // Unmount editor from DOM
     * editor.unmount();
     *
     * // Editor state is preserved
     * const doc = editor.getDocument(); // Still accessible
     *
     * // Re-mount to same or different container
     * editor.mount(anotherContainer);
     * ```
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
            this.on<ContentChangedEventArgs>(CONTENT_CHANGED, (payload: ContentChangedEventArgs): void => { contentChanged(payload); });
        }
        if (callbacks.documentChanged) {
            const documentChanged: NonNullable<EditorConfig['documentChanged']> = callbacks.documentChanged;
            this.on<ContentChangedEventArgs>(DOCUMENT_CHANGED, (payload: DocumentChangedEventArgs): void => { documentChanged(payload); });
        }
        if (callbacks.selectionChanged) {
            const selectionChanged: NonNullable<EditorConfig['selectionChanged']> = callbacks.selectionChanged;
            this.on<SelectionChangedEventArgs>(SELECTION_CHANGED, (payload: SelectionChangedEventArgs): void =>
            { selectionChanged(payload); });
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
            this.on<BeforePasteEventArgs>(BEFORE_PASTE, (payload: BeforePasteEventArgs): void => { beforePaste(payload); });
        }
        if (callbacks.afterPaste) {
            const afterPaste: NonNullable<EditorConfig['afterPaste']> = callbacks.afterPaste;
            this.on<AfterPasteEventArgs>(AFTER_PASTE, (payload: AfterPasteEventArgs): void => { afterPaste(payload); });
        }
        if (callbacks.beforeFileUpload) {
            const beforeFileUpload: NonNullable<EditorConfig['beforeFileUpload']> = callbacks.beforeFileUpload;
            this.on<BeforeFileUploadEventArgs>(BEFORE_FILE_UPLOAD, (payload: BeforeFileUploadEventArgs): void =>
            { beforeFileUpload(payload); });
        }
        if (callbacks.fileReceived) {
            const fileReceived: NonNullable<EditorConfig['fileReceived']> = callbacks.fileReceived;
            this.on<FileReceivedEventArgs>(FILE_RECEIVED, (payload: FileReceivedEventArgs): void => { fileReceived(payload); });
        }
        if (callbacks.resizeStart) {
            const resizeStart: NonNullable<EditorConfig['resizeStart']> = callbacks.resizeStart;
            this.on<ResizeStartEventArgs>(RESIZE_START, (payload: ResizeStartEventArgs): void => { resizeStart(payload); });
        }
        if (callbacks.resizing) {
            const resizing: NonNullable<EditorConfig['resizing']> = callbacks.resizing;
            this.on<ResizingEventArgs>(RESIZING, (payload: ResizingEventArgs): void => { resizing(payload); });
        }
        if (callbacks.resizeStop) {
            const resizeStop: NonNullable<EditorConfig['resizeStop']> = callbacks.resizeStop;
            this.on<ResizeStopEventArgs>(RESIZE_STOP, (payload: ResizeStopEventArgs): void => { resizeStop(payload); });
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

        const clipboardOptions: ClipboardOptions | undefined = this.config.clipboard;

        return {
            editable: () => !(this.config.readOnly ?? false),
            nodeViews: this.adaptedNodeViews,
            transformCopied: (slice: PMSlice, view: PMEditorView): PMSlice => {
                const { $from, $to } = view.state.selection;
                const { collapsible, collapsibleHeader, collapsibleBody } = view.state.schema.nodes;
                if (!collapsible || !collapsibleHeader || !collapsibleBody) {
                    return slice;
                }
                const findAncestor: ( resolved: typeof $from, type: typeof collapsibleHeader) => number
                = (resolved: typeof $from, type: typeof collapsibleHeader): number => {
                    for (let depth: number = resolved.depth; depth > 0; depth--) {
                        if (resolved.node(depth).type === type
                            && resolved.node(depth - 1).type === collapsible) {
                            return depth;
                        }
                    }
                    return -1;
                };
                const fromHeaderDepth: number = findAncestor($from, collapsibleHeader);
                const toHeaderDepth: number = findAncestor($to, collapsibleHeader);
                const toBodyDepth: number = findAncestor($to, collapsibleBody);
                const fromCollapsibleDepth: number = fromHeaderDepth - 1;
                const toCollapsibleDepth: number = (toHeaderDepth !== -1 ? toHeaderDepth : toBodyDepth) - 1;

                if (fromHeaderDepth !== -1) {
                    const topLevelNodes: PMNode[] = [];
                    let fromIndex: number = -1;
                    let toIndex: number = -1;
                    let childPos: number = 0;
                    for (let index: number = 0; index < view.state.doc.childCount; index++) {
                        const child: PMNode = view.state.doc.child(index);
                        const childEnd: number = childPos + child.nodeSize;
                        if ($from.pos >= childPos && $from.pos < childEnd) {
                            fromIndex = index;
                        }
                        if ($to.pos > childPos && $to.pos <= childEnd) {
                            toIndex = index;
                        }
                        childPos = childEnd;
                    }
                    if (fromIndex !== -1 && toIndex !== -1 && fromIndex <= toIndex) {
                        for (let index: number = fromIndex; index <= toIndex; index++) {
                            const child: PMNode = view.state.doc.child(index);
                            if (child.type !== collapsible) {
                                topLevelNodes.length = 0;
                                break;
                            }
                            topLevelNodes.push(child);
                        }
                        if (topLevelNodes.length > 1) {
                            return new PMSlice(PMFragment.fromArray(topLevelNodes), 0, 0);
                        }
                    }
                }

                if (fromHeaderDepth !== -1
                    && fromCollapsibleDepth !== -1
                    && toCollapsibleDepth !== -1
                    && fromCollapsibleDepth === toCollapsibleDepth
                    && (toHeaderDepth !== -1 || toBodyDepth !== -1)
                    && $from.before(fromCollapsibleDepth) === $to.before(toCollapsibleDepth)
                    && (toHeaderDepth === -1 || $from.before(fromHeaderDepth) === $to.before(toHeaderDepth))
                    && (toBodyDepth === -1 || $from.before(fromHeaderDepth) < $to.before(toBodyDepth))
                ) {
                    return new PMSlice(PMFragment.from($from.node(fromCollapsibleDepth)), 0, 0);
                }
                return slice;
            },
            // Headless composes a non-overridable security sanitiser
            // (sanitizeClipboardHTML) ahead of any product-supplied
            // transformHTML hook. The result feeds ProseMirror's native
            // readHTML → DOMParser.fromSchema(schema).parseSlice flow.
            transformPastedHTML: (html: string, _view: PMEditorView): string => {
                const secured: string = sanitizeClipboardHTML(html);
                if (clipboardOptions?.transformHTML) {
                    const context: ClipboardTransformContext = {
                        editor: this,
                        source: secured ? 'html' : 'unknown'
                    };
                    return clipboardOptions.transformHTML(secured, context);
                }
                return secured;
            },
            // Optional post-parse product hook operating on the
            // ProseMirror slice produced by the schema parser.
            transformPasted: (slice: PMSlice, _view: PMEditorView, asText: boolean): PMSlice => {
                if (clipboardOptions?.transformContent) {
                    const context: ClipboardTransformContext = {
                        editor: this,
                        source: asText ? 'text' : 'html'
                    };
                    const result: ClipboardContent = clipboardOptions.transformContent({ slice }, context);
                    return result.slice;
                }
                return slice;
            },
            handlePaste: (view: PMEditorView, event: ClipboardEvent, slice: PMSlice): boolean => {
                if (this.pasteHandler) {
                    return this.pasteHandler.handlePaste(view, event, slice) as any;
                }
                return false;
            },
            // Images dragged from the OS file explorer land in the page
            // with no clipboardData — only dataTransfer — so this path is
            // separate from handlePaste but routes into the same
            // insertImageNodes helper.
            handleDrop: (view: PMEditorView, event: DragEvent, slice: PMSlice, _moved: boolean): boolean => {
                if (this.pasteHandler) {
                    return this.pasteHandler.handleDrop(view, event, slice) as any;
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
     * Destroys the editor and releases all resources.
     *
     * Performs complete teardown in reverse bootstrap order:
     * integration → lifecycleManager → serviceRegistry → eventBus → diagnostics.
     * All event subscriptions are disposed, the DOM view is destroyed, and internal
     * state is cleared. Subsequent calls to `destroy()` are safe no-ops.
     *
     * After calling `destroy()`, the editor instance becomes invalid and should not
     * be used. A new editor must be created via `HeadlessEditor.create()`.
     *
     * @returns {void}
     *
     * @example
     * ```typescript
     * // Create and use editor
     * const editor = HeadlessEditor.create({ schema: mySchema });
     * editor.mount(container);
     *
     * // ... use editor ...
     *
     * // Cleanup and destroy
     * editor.destroy();
     * ```
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
     * Returns the FileHandler instance for file upload operations.
     *
     * The FileHandler is lazily initialized on first access and manages the complete file lifecycle:
     * paste/drop detection, upload ID generation, handler invocation, and event emission.
     * This method provides low-level access for advanced use cases; most applications use
     * `setFileUploadHandler()` instead.
     *
     * @returns {FileHandler} The initialized file handler instance.
     *
     * @example
     * ```typescript
     * const fileHandler = editor.getFileHandler();
     * const uploadState = fileHandler.getUploadState(imageNodeId);
     * ```
     */
    public getFileHandler(): FileHandler {
        // Ensure fileHandler is initialized before returning
        if (this.fileHandler === null) {
            this.fileHandler = new FileHandler(this.eventBus, this.uploadStateRegistry);
        }
        return this.fileHandler;
    }

    /**
     * Registers a file upload handler for paste and drag-drop file operations.
     *
     * The provided handler is invoked whenever files are pasted or dropped into the editor.
     * This method must be called before file paste/drop operations begin to have any effect.
     * Calling it multiple times replaces the previous handler.
     *
     * The FileUploadHandler receives a file object and metadata, and must return a Promise
     * resolving to the uploaded file URL or resource identifier.
     *
     * @param {FileUploadHandler} handler - The upload handler implementation with an `upload()` method
     * that accepts a file request and returns a Promise with the uploaded URL.
     *
     * @returns {void}
     *
     * @example
     * ```typescript
     * import { FileUploadHandler } from '@syncfusion/ej2-headless-editor';
     *
     * const handler: FileUploadHandler = {
     *   upload: async (request) => {
     *     const formData = new FormData();
     *     formData.append('file', request.file);
     *     const response = await fetch('/api/upload', {
     *       method: 'POST',
     *       body: formData
     *     });
     *     const data = await response.json();
     *     return { url: data.url };
     *   }
     * };
     *
     * editor.setFileUploadHandler(handler);
     * ```
     */
    public setFileUploadHandler(handler: FileUploadHandler): void {
        this.getFileHandler().setUploadHandler(handler);
    }

    /**
     * Subscribes to a public editor event.
     *
     * Registers an event listener that fires each time the specified event is published.
     * The handler receives the event payload directly. Event names correspond to the config-level
     * callbacks (e.g., `'contentChanged'`, `'focus'`, `'beforePaste'`).
     *
     * Multiple handlers can be registered for the same event. Call `off()` to unsubscribe.
     *
     * @param {string} eventName - The public event name (e.g., `'contentChanged'`, `'focus'`, `'beforePaste'`).
     * @param {Function} handler - Callback invoked with the event payload each time the event fires.
     *
     * @returns {void}
     *
     * @example
     * ```typescript
     * // Subscribe to content changes
     * editor.on('contentChanged', ({ document, selection }) => {
     *   console.log('Document updated');
     * });
     *
     * // Subscribe to focus event
     * editor.on('focus', () => {
     *   console.log('Editor focused');
     * });
     *
     * // Subscribe to before-paste event
     * editor.on('beforePaste', ({ pasteContent, preventDefault }) => {
     *   if (containsMalicious(pasteContent)) {
     *     preventDefault();
     *   }
     * });
     * ```
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
     * Unsubscribes from a previously registered event listener.
     *
     * Removes the handler that was registered via `on()`. If the handler is not found or was
     * already unsubscribed, this method is a safe no-op.
     *
     * @param {string} eventName - The public event name to unsubscribe from (must match the name passed to `on()`).
     * @param {Function} handler - The exact callback function that was passed to `on()`.
     *
     * @returns {void}
     *
     * @example
     * ```typescript
     * const handleContentChange = (args) => console.log('Changed:', args.document);
     *
     * // Subscribe
     * editor.on('contentChanged', handleContentChange);
     *
     * // ... later ...
     *
     * // Unsubscribe
     * editor.off('contentChanged', handleContentChange);
     * ```
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
     * Executes a command by name with optional payload.
     *
     * This is the low-level untyped path. For type safety and IDE autocomplete,
     * use `editor.commands.commandName()` instead (via the typed facade).
     *
     * The command's `canExecute()` is checked first. If it returns false, the command
     * is not dispatched and this method returns false. If canExecute is true,
     * `execute()` is called and returns true (assuming a transaction was dispatched).
     *
     * @param {string} name - Registered command name (e.g., `'toggleBold'`, `'setHeading'`).
     * @param {unknown} [payload] - Optional command-specific payload object. Type validation happens at runtime within the command.
     *
     * @returns {boolean} `true` if the command dispatched a transaction; `false` if the command was unavailable (canExecute returned false).
     *
     * @throws {Error} Throws if the command name is not registered.
     *
     * @example
     * ```typescript
     * // Execute without payload
     * editor.execute('toggleBold');
     *
     * // Execute with payload
     * editor.execute('setHeading', { level: 2 });
     * editor.execute('insertImage', { src: 'image.png', alt: 'Alt text' });
     * ```
     */
    public execute(name: string, payload?: unknown): boolean {
        return this.manager.execute(name, payload);
    }

    /**
     * Returns a facade for dry-run command availability checks.
     *
     * Provides typed methods (`can().toggleBold()`, `can().setHeading({ level: 1 })`, etc.) that
     * evaluate the command's `canExecute()` logic without dispatching any transaction.
     * Useful for toolbar/menu state management and validation.
     *
     * A new facade instance is created per call; the cost is minimal as it wraps the command manager
     * without extra state. Facade creation is intentionally cheap.
     *
     * @returns {TypedCanFacade} A facade providing typed `canX()` methods for all registered commands.
     *
     * @example
     * ```typescript
     * // Check if bold is available
     * if (editor.can().toggleBold()) {
     *   // Enable bold button in toolbar
     *   updateToolbar('bold', true);
     * }
     *
     * // Check if image insertion is available
     * if (editor.can().insertImage({ src: 'url' })) {
     *   enableImageButton();
     * }
     * ```
     */
    public can(): TypedCanFacade {
        return createCanFacade(this.manager);
    }

    /**
     * Returns a facade for building and executing chained command sequences.
     *
     * Enables fluent API for command batching:
     * `editor.chain().command1().command2().command3().run()`.
     * All chained commands are collected and executed in a single atomic transaction.
     *
     * Terminal methods:
     * - `.run()` — Execute the chain and apply the transaction
     * - `.canRun()` — Check if all chained commands are available without executing
     *
     * A new ChainBuilder and facade are created per call, ensuring independent chains.
     *
     * @returns {TypedChain} A new typed chain facade with methods for each registered command and terminal methods.
     *
     * @example
     * ```typescript
     * // Chain multiple commands in a single transaction
     * editor.chain()
     *   .deleteSelection()
     *   .toggleBold()
     *   .insertText({ text: 'Hello' })
     *   .run();
     *
     * // Check if chain is executable before running
     * if (editor.chain().toggleBold().insertImage({ src: 'img.png' }).canRun()) {
     *   // Safe to execute
     * }
     * ```
     */
    public chain(): TypedChain {
        const builder: ChainBuilder = new ChainBuilder(this.commandRegistry, this.integration);
        return createChainFacade(builder);
    }

    /**
     * Returns the nesting depth of the given list type at the current selection.
     *
     * Measures how deeply nested the current selection is within lists of the specified type.
     * A depth of `0` means the selection is not inside any list of that type. Depths of 1 or higher
     * represent nesting levels (1 = direct child of list, 2 = nested list within a list, etc.).
     *
     * @param {'ordered' | 'bullet'} listType - The list type to measure: `'ordered'` (numbered lists) or `'bullet'` (bulleted lists).
     *
     * @returns {number} The nesting depth of the given list type at the current selection. Returns 0 if not in a list of that type.
     *
     * @example
     * ```typescript
     * // In a single-level bullet list
     * const depth = editor.getCurrentListDepth('bullet');
     * console.log(depth); // Output: 1
     *
     * // In a nested ordered list (nested within an ordered list)
     * const nestedDepth = editor.getCurrentListDepth('ordered');
     * console.log(nestedDepth); // Output: 2
     * ```
     *
     * @hidden
     */
    public getCurrentListDepth(listType: 'ordered' | 'bullet'): number {
        return this.integration.getCurrentListDepth(listType);
    }

    // ── Document access ───────────────────────────────────────────────────────

    /**
     * Returns the current document as a Syncfusion-native DocumentRoot object.
     *
     * The returned DocumentRoot is a pure TypeScript type containing the full node tree,
     * with all nodes having stable IDs and no ProseMirror types exposed.
     * This snapshot reflects the current state at the time of the call.
     *
     * Throws `EditorLifecycleError` if the editor has been destroyed.
     *
     * @returns {DocumentRoot} The current document structure with all nodes, marks, and content.
     *
     * @throws {EditorLifecycleError} Throws if `destroy()` has been called.
     *
     * @example
     * ```typescript
     * const doc = editor.getDocument();
     *
     * // Traverse the node tree
     * doc.content.forEach(node => {
     *   console.log(`Node: ${node.type}`, node);
     * });
     *
     * // Serialize to HTML
     * const html = serializeDocumentToHTML(doc);
     * ```
     */
    public getDocument(): DocumentRoot {
        const pmState: ReturnType<IntegrationManager['getState']> = this.integration.getState(); // throws if destroyed
        return DocumentMapper.fromPMDoc(pmState.doc);
    }

    /**
     * Returns the plain-text content of the current selection.
     *
     * Extracts text from the current selection range, preserving newlines between blocks.
     * Returns an empty string if no text is selected (selection is collapsed) or if the editor
     * has been destroyed.
     *
     * @returns {string} The plain-text content of the selection, or an empty string if the selection is collapsed or the editor is destroyed.
     *
     * @example
     * ```typescript
     * // User selects "Hello World" in the editor
     * const selectedText = editor.getSelectionText();
     * console.log(selectedText); // Output: "Hello World"
     *
     * // Cursor only (no selection)
     * if (!selectedText) {
     *   console.log('No text selected');
     * }
     * ```
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
     * Returns the current selection range as absolute document positions.
     *
     * Provides the `from` and `to` positions (in document offset units) and an `empty` flag
     * indicating whether the selection is a collapsed cursor or spans text.
     *
     * All positions are absolute offsets relative to the document root.
     *
     * @returns {Object} An object containing the selection range.
     * @returns {number} .from - Start position of the selection (inclusive, 0-based offset).
     * @returns {number} .to - End position of the selection (exclusive, 0-based offset).
     * @returns {boolean} .empty - `true` if the selection is collapsed to a cursor position (from === to), `false` if text or nodes are selected.
     *
     * @example
     * ```typescript
     * const sel = editor.getSelection();
     *
     * if (sel.empty) {
     *   console.log(`Cursor is at position ${sel.from}`);
     * } else {
     *   console.log(`Selected text spans from ${sel.from} to ${sel.to}`);
     *   const length = sel.to - sel.from;
     *   console.log(`Selection is ${length} characters long`);
     * }
     * ```
     */
    public getSelection(): { from: number; to: number; empty: boolean } {
        return this.integration.getState().selection as { from: number; to: number; empty: boolean };
    }

    // ── Selection save & restore ──────────────────────────────────────────────

    /**
     * Captures and stores the current selection as a PM-free SelectionSnapshot.
     *
     * Creates a persistent snapshot of the current selection (text range, node selection, or cell selection)
     * that survives DOM events like blur. The snapshot is retained by the editor and automatically applied
     * before the next command execution, making toolbar button clicks (which blur the editor) safe.
     *
     * Multiple calls to `saveSelection()` replace the previously held snapshot. The snapshot is independent
     * of any command chain or execution.
     *
     * This is essential for maintaining selection across focus changes in toolbar-based editors where
     * clicking a toolbar button blurs the editor, causing focus loss and selection reset.
     *
     * @returns {SelectionSnapshot} A PM-free snapshot of the current selection with lifecycle tracking.
     *
     * @throws {EditorLifecycleError} Throws if the editor has been destroyed via `destroy()`.
     *
     * @example
     * ```typescript
     * // User has text selected
     * const snapshot = editor.saveSelection();
     * console.log(snapshot.status); // 'pending'
     *
     * // User clicks toolbar button (blurs editor)
     * // ... selection would normally be lost ...
     *
     * // Next command auto-applies the snapshot
     * editor.commands.toggleBold(); // Selection is restored before executing bold
     * ```
     */
    public saveSelection(): SelectionSnapshot {
        if (this.isDestroyed) {
            throw new EditorLifecycleError('Editor has been destroyed');
        }
        return this.selectionManager.save();
    }

    /**
     * Applies a previously captured selection snapshot to the current editor state.
     *
     * Restores a saved selection from a SelectionSnapshot. If no snapshot is provided,
     * uses the most recently held snapshot from `saveSelection()`. If an explicit snapshot
     * is provided, it updates the editor's held snapshot.
     *
     * Success depends on snapshot freshness (stale snapshots may fail if document structure changed).
     * Restore operations do NOT consume the snapshot — only command execution consumes.
     * Calling `restoreSelection()` followed by a command is equivalent to a single command execution
     * with automatic selection restoration.
     *
     * @param {SelectionSnapshot} [snapshot] - Optional SelectionSnapshot to apply. If omitted, uses the most recently held snapshot.
     *
     * @returns {boolean} `true` if the snapshot was successfully applied; `false` if the snapshot was stale or no snapshot is available.
     *
     * @throws {EditorLifecycleError} Throws if the editor has been destroyed.
     *
     * @example
     * ```typescript
     * // Save selection before an async operation
     * const snapshot = editor.saveSelection();
     * console.log(snapshot.status); // 'pending'
     *
     * // Perform async work or other operations...
     * await someAsyncWork();
     *
     * // Restore selection
     * const restored = editor.restoreSelection(snapshot);
     * if (restored) {
     *   console.log('Selection restored successfully');
     * } else {
     *   console.log('Snapshot became stale, using last known position');
     * }
     * ```
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
     *
     * The returned node includes its live DOM element (if mounted) for toolbar
     * positioning.
     *
     * @returns {SelectedNode | null} Info for the selected atom, or null.
     *
     * @hidden
     */
    public getSelectedNode(): SelectedNode | null {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const pmView: PMEditorView = this.integration.getView();
            return this.selectedNodeResolver.resolveSelectedNode(
                pmState.selection,
                pmState.doc,
                pmView
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
                pmView
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
     *
     * @hidden
     */
    public getCodeBlockContent(): string {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return getCodeBlockContent(pmState);
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
     *
     * @hidden
     */
    public getCodeBlockLanguage(): string {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return getCodeBlockLanguage(pmState);
        } catch {
            return '';
        }
    }

    /**
     * Returns the currently selected image node (for NodeSelection on an image).
     *
     * @returns {SelectedNode | null} Info for the selected image, or null.
     *
     * @hidden
     */
    public getSelectedImage(): SelectedNode | null {
        const node: SelectedNode = this.getSelectedNode();
        if (!node) {
            return null;
        }
        return node.node.type === 'image' ? node : null;
    }

    /**
     * Returns all currently selected table cells (for CellSelection).
     *
     * For non-CellSelection, returns an empty array.
     * For a single cell (cursor or text range inside a cell) returns a
     * one-element array for that cell. For multi-cell selections, every
     * cell in the rectangular range is returned in row-major order.
     *
     * @returns {SelectedCell[]} Array of cell info. Empty for non-cell selections.
     */
    public getSelectedCells(): SelectedCell[] {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const pmView: PMEditorView = this.integration.getView();
            // Derive the sync doc from the live PM state so cell paths line
            // up with the actual document tree the PM selection lives in.
            const syncDoc: DocumentRoot = DocumentMapper.fromPMDoc(pmState.doc);
            return this.selectedNodeResolver.resolveSelectedCells(
                pmState.selection,
                pmState.doc,
                pmView,
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
                pmView
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
     *
     * @hidden
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
     *
     * @hidden
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
     *
     * @hidden
     */
    public getMarkAttributes(markName: string): Record<string, unknown> | null {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return this.activeMarksResolver.getActiveMarkAttributes(pmState, markName) as Record<string, unknown> | null;
        } catch {
            return null;
        }
    }

    /**
     * Returns the formatting marks and structural nodes relevant to the current selection.
     *
     * Marks are limited to those present at the selection start. A mark is
     * mixed when its attributes differ or it is absent from part of the range.
     * Structural wrapper nodes that do not represent toolbar context are omitted.
     *
     * @returns {SelectionContext} PM-free selection context, or an empty context
     * when the editor is destroyed or the selection cannot be resolved.
     */
    public getSelectionContext(): SelectionContext {
        try {
            const pmState: PMEditorState = this.integration.getState();
            return this.selectionContextResolver.resolve(pmState);
        } catch {
            return { marks: [], nodes: [] };
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
            return this.setEmptyDocument();
        }

        try {
            const newRoot: DocumentRoot = parseHtmlToDocument(html, pmState.schema as PMSchema);
            // Convert once: DocumentRoot → PM doc, taking the body content.
            const newPMDoc: PMNode = DocumentMapper.toPMDoc(newRoot, pmState.schema as PMSchema);
            return this.replaceDocument(newPMDoc.content);
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
    private setEmptyDocument(): boolean {
        try {
            const pmState: PMEditorState = this.integration.getState();
            const emptyPMDoc: PMNode = DocumentMapper.toPMDoc(this.buildEmptyRoot(), pmState.schema as PMSchema);
            return this.replaceDocument(emptyPMDoc.content);
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
     *     type: 'document', attrs: {}, marks: [],
     *     schemaVersion: 1,
     *     children: [{ type: 'paragraph', attrs: {}, marks: [], children: [] }]
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
            return this.replaceDocument(newPMDoc.content);
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
     * @returns {boolean} `true` when the transaction was dispatched.
     * @hidden
     */
    private replaceDocument(newContent: PMFragment): boolean {
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
     * happens in `replaceDocument`; this only supplies the seed shape.
     *
     * @returns {DocumentRoot} A single-empty-paragraph document root.
     * @hidden
     */
    private buildEmptyRoot(): DocumentRoot {
        return {
            type: 'document',
            schemaVersion: 1,
            attrs: {},
            marks: [],
            children: [
                {
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
     *
     * @hidden
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
     * - `document`, `content`, `extensions`, `schema`
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
