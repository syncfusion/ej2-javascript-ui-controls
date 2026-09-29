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
import { IdGenerator } from '../utils/id-generator';
import { PMPlugin } from '../pm/pm-guard';
import { IntegrationManager } from '../pm/integration/integration-manager';
import { EditorConfig } from '../model/editor-config';
import { ExtensionManager } from '../extensions/extension-manager';
import { ExtensionCompiler } from '../extensions/extension-compiler';
import { EventBus } from '../events/event-bus';
import { CommandRegistry } from '../commands/registry';
import { HeadlessEditor } from './headless-editor';
import { UploadStateRegistry } from '../services/upload-state-registry';
import { DiagnosticsService } from '../diagnostics';
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
export declare class EditorBuilder {
    private readonly config;
    private idGen;
    private schemaManager;
    private initialDoc;
    private extensionManager;
    private extensionCompiler;
    private diagnostics;
    private commandManager;
    integration: IntegrationManager;
    /**
     * Compiled extension artifacts. Set after `_initializeExtensions()` runs.
     * Empty default covers the no-extensions path.
     */
    private compiledArtifacts;
    private defaultConfig;
    constructor(config: EditorConfig);
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
    initiate(eventBus: EventBus, commandRegistry: CommandRegistry, diagnostics: DiagnosticsService): EditorBuilderOptions;
    /**
     * Step 1: Resolve the ID generator (already done in constructor, but explicit here).
     *
     * @returns {void}
     */
    private _resolveIdGenerator;
    /**
     * Step 2: Load and validate the schema definition.
     * Delegates to SchemaManager for structural validation.
     *
     * @returns {void}
     */
    private validateAndLoadSchema;
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
    private _initializeExtensions;
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
    private hasExtensionRegistered;
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
    private _resolveInitialDocument;
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
    private _initializeIntegration;
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
    private buildPlugins;
    /**
     * Build only the keymap plugin. Called from Editor.create() after
     * `extensionCompiler.bindEditorAndFinalize()` has populated the keyboard shortcut
     * handlers with a valid `editor` reference.
     *
     * @returns {PMPlugin} The keymap plugin wrapping all extension-contributed handlers.
     * @hidden
     */
    initializedKeymapPlugin(): PMPlugin;
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
    initializedImageUploadPlugin(editor: HeadlessEditor, registry: UploadStateRegistry): PMPlugin;
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
    private _parseHtmlContent;
    /**
     * Builds a default empty document (single paragraph).
     * Used when no initial document is provided in EditorConfig.
     *
     * @returns {DocumentRoot} A minimal default document containing one empty paragraph.
     */
    private _buildDefaultDocument;
}
