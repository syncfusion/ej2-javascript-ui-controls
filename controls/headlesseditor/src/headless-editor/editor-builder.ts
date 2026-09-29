/**
 * editor-builder.ts — Internal builder for Editor initialization.
 *
 * EditorBuilder encapsulates the entire initialization pipeline:
 *   - Schema validation and compilation
 *   - Initial document resolution
 *   - ProseMirror schema compilation
 *   - IntegrationManager setup
 *   - PM state initialization
 *
 * This class is an internal implementation detail and is NOT exported
 * from src/index.ts. It exists solely to keep Editor clean and focused
 * on its public API.
 */
import { DocumentRoot } from '../model/editor-node';
import { IdGenerator, DefaultIdGenerator } from '../utils/id-generator';
import { SchemaManager } from '../schema/schema-manager';
import { PMPlugin, PMNode } from '../pm/pm-guard';
import { DocumentMapper } from '../pm/adapters/document-mapper';
import { parseHtmlToDocument } from '../schema/serialization/html-content-parser';
import { IntegrationManager } from '../pm/integration/integration-manager';
import { EditorConfig } from '../model/editor-config';
import { ExtensionManager } from '../extensions/extension-manager';
import { CompiledExtensionArtifacts, ExtensionCompiler } from '../extensions/extension-compiler';
import { ExtensionDefinition } from '../extensions/types';
import { EventBus } from '../events/event-bus';
import { CommandRegistry } from '../commands/registry';
import { HeadlessEditor } from './headless-editor';
import { UploadStateRegistry } from '../services/upload-state-registry';
import { createHistoryPlugin } from '../pm/plugins/undo-redo';
import { selectionSyncPlugin } from '../pm/plugins/selection-sync-plugin';
import { focusBlurPlugin } from '../pm/plugins/focus-blur-plugin';
import { buildKeymapPlugin } from '../pm/plugins/keymap-plugin';
import { compileInputRulesPlugin } from '../pm/plugins/input-rules-plugin';
import { createImageUploadPlugin } from '../pm/plugins/image-upload-plugin';
import { FlattenedExtension } from '../extensions/types';
import { documentExtension, textExtension, listExtension, taskListExtension, listKeymapExtension, indentOutdentExtension } from '../extensions/builtins/index';
import { DiagnosticsService } from '../diagnostics';
import { UndoRedoOptions } from '../extensions/builtins/undo-redo';
import { registerInternalCommands } from '../commands/builtins/register';
import { CommandManager } from '../commands/manager';

/**
 * EditorBuilderOptions — internal result object returned by EditorBuilder.
 * Contains all initialized dependencies needed to construct an Editor.
 *
 * Used internally by Editor.create() only.
 */
export interface EditorBuilderOptions {
    integration: IntegrationManager;
    idGen: IdGenerator;
    initialDoc: DocumentRoot;
    extensionManager?: ExtensionManager;
    extensionCompiler: ExtensionCompiler;
    commandManager: CommandManager;
}

/**
 * EditorBuilder — internal factory for Editor initialization.
 * Owns the full initialization pipeline that was previously embedded in Editor.create().
 *
 * Instead of constructing an Editor directly, it returns EditorBuilderOptions
 * so Editor.create() can invoke the constructor itself.
 */
export class EditorBuilder {
    private readonly config: EditorConfig;
    private idGen: IdGenerator;
    private schemaManager: SchemaManager;
    private initialDoc: DocumentRoot = null;
    private extensionManager: ExtensionManager = null;
    private extensionCompiler: ExtensionCompiler = null;
    private diagnostics: DiagnosticsService = null;
    private commandManager: CommandManager = null;
    /* @hidden */
    public integration: IntegrationManager = null;

    /**
     * Compiled extension artifacts. Set after `_initializeExtensions()` runs.
     * Empty default covers the no-extensions path.
     */
    private compiledArtifacts: CompiledExtensionArtifacts = {
        nodeSpecs: {},
        markSpecs: {},
        globalAttributes: {},
        plugins: [],
        keyboardShortcuts: {},
        inputRules: [],
        pasteRules: [],
        serializers: [],
        nodeViews: {}
    };

    private defaultConfig: EditorConfig = {
        enableInputRules: true,
        enableTabKey: true
    }

    constructor(config: EditorConfig) {
        this.config = { ...this.defaultConfig, ...config };
        this.idGen = config.idGenerator ?? new DefaultIdGenerator();
        this.schemaManager = new SchemaManager();
    }

    /**
     * Executes the full initialization pipeline.
     * Returns EditorBuilderOptions (dependencies) ready for Editor constructor.
     *
     * Pipeline:
     *   1. Resolve ID generator
     *   2. Validate and load schema
     *   3. Compile PM schema
     *   4. Initialize extensions (if provided)
     *   5. Resolve initial document
     *   6. Initialize integration (PM state + plugins)
     *
     * @param {EventBus} eventBus - EventBus instance (created by Editor.create before calling initiate).
     * @param {CommandRegistry} commandRegistry - Pre-populated CommandRegistry (builtins already registered).
     * @param {DiagnosticsService} [diagnostics] - Optional shared sink for schema-compile
     *      errors (e.g. missing DOM specs). When omitted, a local DiagnosticsService is
     *      instantiated so errors stay scoped to this builder rather than propagating to the
     *      caller's logging pipeline.
     * @returns {EditorBuilderOptions} Initialized dependencies for the Editor constructor.
     *
     * @throws SchemaValidationError if schema is invalid
     * @throws TransactionTranslationError if document cannot be mapped to PM
     * @throws EditorLifecycleError if IntegrationManager initialization fails
     * @throws Error if extension initialization fails
     * @hidden
     */
    public initiate(eventBus: EventBus, commandRegistry: CommandRegistry, diagnostics: DiagnosticsService): EditorBuilderOptions {
        this.diagnostics = diagnostics;
        this._resolveIdGenerator();
        this._initializeExtensions(commandRegistry);   // must run before _buildDOMSpecRegistry
        this.validateAndLoadSchema();
        this._resolveInitialDocument();
        this._initializeIntegration(eventBus, commandRegistry);
        return {
            integration: this.integration,
            idGen: this.idGen,
            initialDoc: this.initialDoc,
            extensionManager: this.extensionManager,
            extensionCompiler: this.extensionCompiler,
            commandManager: this.commandManager
        };
    }

    // ── Private initialization steps ────────────────────────────────────────

    /**
     * Step 1: Resolve the ID generator (already done in constructor, but explicit here).
     *
     * @returns {void}
     */
    private _resolveIdGenerator(): void {
        this.idGen = this.config.idGenerator ?? new DefaultIdGenerator();
    }

    /**
     * Step 2: Load and validate the schema definition.
     * Delegates to SchemaManager for structural validation.
     *
     * @returns {void}
     */
    private validateAndLoadSchema(): void {
        this.schemaManager.load(this.extensionCompiler.schemaDefinition);
        this.schemaManager.validate();
    }

    /**
     * Initializes the configured extensions.
     *
     * Registers all configured extensions, invokes their registration and
     * initialization lifecycle hooks, and prepares them for integration with
     * the editor. If no extensions are configured, this method performs no action.
     *
     * The extension lifecycle executed by this method is:
     * 1. Register extensions.
     * 2. Invoke the `onRegister` hook.
     * 3. Invoke the `onInitialize` hook.
     * 4. Prepare extensions for later integration.
     *
     * The `onReady` hook is invoked after the editor integration has been
     * fully initialized.
     *
     * @param {CommandRegistry} commandRegistry - Pre-populated registry with all built-in commands.
     * @returns {void}
     */
    private _initializeExtensions(commandRegistry: CommandRegistry): void {
        const extensions: ExtensionDefinition<object>[] | undefined = [...(this.config.extensions ?? [])];
        if (!extensions || extensions.length === 0) {
            return;
        }
        if (!this.hasExtensionRegistered(extensions, textExtension)) {
            extensions.unshift(textExtension);
        }
        if (!this.hasExtensionRegistered(extensions, documentExtension)) {
            extensions.unshift(documentExtension);
        }
        // Auto-register listKeymapExtension to configure key actions whenever the consumer has
        // brought any list-type extension of their own.
        if (!this.hasExtensionRegistered(extensions, listKeymapExtension)
                && (this.hasExtensionRegistered(extensions, listExtension)
                    || this.hasExtensionRegistered(extensions, taskListExtension))) {
            extensions.push(listKeymapExtension);
        }
        if (this.config.enableTabKey && !this.hasExtensionRegistered(
            extensions,
            indentOutdentExtension)) {
            extensions.push(indentOutdentExtension);
        }
        // Create and register extensions
        this.extensionManager = new ExtensionManager(extensions);
        this.extensionManager.register();
        registerInternalCommands(commandRegistry);

        this.extensionCompiler = new ExtensionCompiler(this.diagnostics);
        this.compiledArtifacts = this.extensionCompiler.compile(
            this.extensionManager.getExtensions() as FlattenedExtension[],
            commandRegistry,
            this.extensionManager,
            undefined,
            this.config
        );
    }

    /**
     * True when the given extension (identified by name) is already in
     * the supplied extension list. Prevents double-registering an
     * extension when both the consumer and the auto-registration logic
     * would inject it.
     *
     * @param {ExtensionDefinition[]} extensions - The current list.
     * @param {ExtensionDefinition} target - The extension to look up.
     * @returns {boolean} True when the target's name matches an entry.
     */
    private hasExtensionRegistered(
        extensions: readonly ExtensionDefinition[],
        target: ExtensionDefinition
    ): boolean {
        return extensions.some((ext: ExtensionDefinition): boolean => ext.config.name === target.config.name);
    }

    /**
     * Resolve the initial document from config.document or config.content, falling back to default.
     *
     * Priority: document > content > default empty document
     *
     * If config.content is provided, it is parsed as HTML using the schema-driven parsing pipeline.
     * The pipeline leverages all parseDOM rules from registered extensions to convert HTML to
     * an EditorDocument. If parsing fails, a diagnostic warning is logged and an empty document
     * is used as fallback.
     *
     * @returns {void}
     */
    private _resolveInitialDocument(): void {
        // config.document takes precedence
        if (this.config.document) {
            this.initialDoc = this.config.document;
            return;
        }

        // Try to parse config.content as HTML via schema-driven pipeline
        if (this.config.content) {
            this.initialDoc = this._parseHtmlContent(this.config.content);
            return;
        }

        // Default: empty document
        this.initialDoc = this._buildDefaultDocument();
    }

    /**
     * Map the initial document to a PM doc, wire plugins, and create the PM EditorState.
     *
     * The keymap plugin is intentionally excluded from the initial plugin
     * list. It is added later via {@link initializedKeymapPlugin} once the
     * Editor is constructed and {@link ExtensionCompiler.bindEditorAndFinalize}
     * has populated the keymap handlers with a valid `editor` reference.
     *
     * @param {EventBus} eventBus - Used by selection-sync and focus-blur plugins.
     * @param {CommandRegistry} commandRegistry - Used to build a CommandManager for the keymap plugin.
     * @returns {void}
     */
    private _initializeIntegration(eventBus: EventBus, commandRegistry: CommandRegistry): void {
        // Translate the Syncfusion document tree into a ProseMirror document.
        const pmDoc: PMNode = DocumentMapper.toPMDoc(this.initialDoc, this.extensionCompiler.pmSchema);

        // Construct IntegrationManager so PM state can be attached.
        this.integration = new IntegrationManager(eventBus);

        this.commandManager = new CommandManager(commandRegistry, this.integration);
        // Build the plugin list (history, event bridges, extension plugins).
        const plugins: PMPlugin[] = this.buildPlugins(this.compiledArtifacts, eventBus, this.commandManager);

        // Attach PM state — schema, document, and plugins — to finalize the editor.
        this.integration.create({ schema: this.extensionCompiler.pmSchema, doc: pmDoc, plugins });
    }

    /**
     * Assembles the ordered list of PM plugins to include in every EditorState.
     *
     * **Plugin Order (CRITICAL):**
     *   1. history()              — undo/redo stack (MUST come first to see all transactions)
     *   2. selectionSyncPlugin    — bridges PM selection changes to EventBus
     *   3. focusBlurPlugin        — bridges DOM focus/blur events to EventBus
     *   4. buildKeymapPlugin      — maps keyboard shortcuts to CommandManager
     *   5. compileInputRulesPlugin     — text-pattern → command dispatch (NEW)
     *   6. ...artifacts.plugins        — plugins contributed by extensions (last)
     *
     * **Why History Must Be First:**
     * The history plugin tracks all editor state changes to build the undo/redo stacks.
     * If history is not at index 0, it may miss transactions processed by earlier plugins,
     * leading to incomplete or inconsistent undo history.
     *
     * @param {CompiledExtensionArtifacts} artifacts - Compiled extension artifacts (plugins + keymaps).
     * @param {EventBus} eventBus - EventBus injected into event-bridge plugins.
     * @param {CommandManager} commandManager - Command manager used by input-rule plugin.
     * @returns {PMPlugin[]} Ordered array of PMPlugin instances.
     * @throws {Error} If history plugin is not found at index 0 after assembly.
     */
    private buildPlugins(
        artifacts: CompiledExtensionArtifacts,
        eventBus: EventBus,
        commandManager: CommandManager
    ): PMPlugin[] {
        // 1. Locate the history extension instance using definition name
        const undoRedoExtension: FlattenedExtension<object> = this.extensionManager?.getExtensions().find(
            (ext: FlattenedExtension<object>) => ext?.definition?.name === 'undoRedo'
        );

        // 2. Invoke defineOptions() if it exists on the config to retrieve current/configured options
        const undoRedoOptions: UndoRedoOptions = undoRedoExtension?.definition?.config?.defineOptions?.() as UndoRedoOptions | undefined;

        // 3. Apply configurations with sensible default fallbacks
        const undoRedoConfig: {
            depth: number;
            newGroupDelay: number;
        } = {
            depth: undoRedoOptions?.depth,
            newGroupDelay: undoRedoOptions?.newGroupDelay
        };

        const plugins: PMPlugin[] = [
            // 3. Forward configurations right into the ProseMirror plugin wrapper
            createHistoryPlugin(undoRedoConfig),
            selectionSyncPlugin(eventBus),
            focusBlurPlugin(eventBus),
            ...(this.config.enableInputRules ? [compileInputRulesPlugin(artifacts.inputRules, commandManager)] : []),
            ...artifacts.plugins
        ];

        if (!plugins || plugins.length === 0) {
            throw new Error(
                'buildPlugins: Failed to create plugins array or plugin is missing'
            );
        }
        return plugins;
    }

    /**
     * Build only the keymap plugin. Called from Editor.create() after
     * `extensionCompiler.bindEditorAndFinalize()` has populated the keyboard shortcut
     * handlers with a valid `editor` reference.
     *
     * @returns {PMPlugin} The keymap plugin wrapping all extension-contributed handlers.
     * @hidden
     */
    public initializedKeymapPlugin(): PMPlugin {
        return buildKeymapPlugin(this.compiledArtifacts.keyboardShortcuts);
    }

    /**
     * Build the image upload plugin. Called from Editor.create() after the
     * editor is fully constructed, since the plugin needs direct access to
     * the HeadlessEditor instance to subscribe to file upload events.
     *
     * This follows the same pattern as `initializedKeymapPlugin()` - it's
     * built post-Editor to close over the fully constructed editor instance.
     * The registry is passed so the plugin can publish generic upload state
     * snapshots (progress never dispatches ProseMirror transactions).
     *
     * @param {HeadlessEditor} editor - The fully initialized editor instance
     * @param {UploadStateRegistry} registry - Generic runtime upload state registry
     * @returns {PMPlugin} The image upload plugin
     * @hidden
     */
    public initializedImageUploadPlugin(editor: HeadlessEditor, registry: UploadStateRegistry): PMPlugin {
        return createImageUploadPlugin(editor, registry);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    /**
     * Parse HTML content using the schema-driven parsing pipeline:
     *
     *     HTML (string)
     *         ↓
     *     window.DOMParser.parseFromString()
     *         ↓
     *     PMDOMParser.fromSchema()
     *         ↓
     *     PM Document (respects all extension parseDOM rules)
     *         ↓
     *     DocumentMapper.fromPMDoc()
     *         ↓
     *     EditorDocument
     *
     * All parseDOM rules and parsing specifications from registered extensions
     * are automatically applied via the PM schema. The parser respects node
     * and mark specifications, including custom parseDOM rules contributed by
     * extensions. If parsing fails, falls back to an empty document with a
     * diagnostic warning.
     *
     * @param {string} html - HTML string to parse.
     * @returns {DocumentRoot} Parsed EditorDocument or empty document on failure.
     * @private
     */
    private _parseHtmlContent(html: string): DocumentRoot {
        try {
            // Delegate to the shared schema-driven HTML parsing pipeline (also
            // used by HeadlessEditor.setContent for runtime replacement).
            // The pipeline applies all parseDOM rules from registered extensions.
            return parseHtmlToDocument(html, this.extensionCompiler.pmSchema, this.idGen);
        } catch (error) {
            this.diagnostics.warn(
                `Failed to parse config.content HTML. Falling back to empty document. Error: ${String(error)}`
            );
            return this._buildDefaultDocument();
        }
    }

    /**
     * Builds a default empty document (single paragraph).
     * Used when no initial document is provided in EditorConfig.
     *
     * @returns {DocumentRoot} A minimal default document containing one empty paragraph.
     */
    private _buildDefaultDocument(): DocumentRoot {
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
                    children: [],
                    marks: []
                }
            ]
        };
    }
}
