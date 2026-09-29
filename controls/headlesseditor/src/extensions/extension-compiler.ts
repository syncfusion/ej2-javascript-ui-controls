/**
 * Extension compiler — INTERNAL ONLY, PM-encapsulated.
 *
 * Compiles extension capabilities into ProseMirror artifacts:
 * - Schema (nodes, marks, global attributes)
 * - Plugins (with state and decorations)
 * - Keymaps (keyboard shortcuts)
 * - Input rules (text patterns)
 * - Paste rules (clipboard handling)
 * - Commands (registered into CommandRegistry)
 * - Serializers (HTML ↔ Document conversion)
 *
 * NOT compiled in v1: NodeViews, transaction hooks.
 *
 * Usage: Internal only. Not exported from src/index.ts.
 * Called by ExtensionManager during initialization phase.
 */

import { ExtensionConfig, FlattenedExtension, InputRuleDefinition } from '../extensions/types';
import { CommandRegistry } from '../commands/registry';
import { Command } from '../commands/types';
import { DiagnosticsService } from '../diagnostics';
import { ExtensionManager } from '../extensions/extension-manager';
import { PMPlugin, PMNode, PMMark, NodeSpec, MarkSpec, AttributeSpec, DOMOutputSpec, PMSchema} from '../pm/pm-guard';
import { ContributorContext, ContributorPayload, DOMOutputDescriptor, ExtensionDOMSpecs, ExtensionScope, MarkDOMDescriptor, NodeDOMDescriptor, NodeViewConstructor, KeyboardShortcutHandler } from '../extensions/types';
import { NodeDOMSpec, MarkDOMSpec, DOMSpecRegistry, DefaultDOMSpecRegistry } from '../pm/dom/dom-spec-registry';
import { MarkDefinition, NodeDefinition, SchemaDefinition } from '../schema/types';
import { PMSchemaAdapter } from '../pm/adapters';
import { HeadlessEditor } from '../headless-editor';
import { EditorConfig } from '../model';

/**
 * DOM spec maps collected from extensions that declare the `'DOMSpecs'`
 * capability.  Returned by ExtensionCompiler.collectDOMSpecs() and merged
 * into the DefaultDOMSpecRegistry by EditorBuilder.
 */
export interface CollectedDOMSpecs {
    readonly nodeDOMMap: ReadonlyMap<string, NodeDOMSpec>;
    readonly markDOMMap: ReadonlyMap<string, MarkDOMSpec>;
}

/**
 * Result of extension compilation
 */
export interface CompiledExtensionArtifacts {
    nodeSpecs: Record<string, NodeSpec>;
    markSpecs: Record<string, MarkSpec>;
    globalAttributes: Record<string, AttributeSpec>;
    plugins: PMPlugin[];
    keyboardShortcuts: Record<string, KeyboardShortcutHandler[]>;
    inputRules: InputRuleDefinition[];
    pasteRules: unknown[];
    serializers: unknown[];
    nodeViews: Record<string, NodeViewConstructor>;
}

/**
 * Compilation context passed to capability contributors
 */
export interface ExtensionCompilationContext {
    extensionName: string;
    /** Partial schema available at compile time */
    schema?: SchemaFragment;
    /** For command compilation */
    commands?: CommandRegistry;
}

/**
 * Lightweight placeholder for partial schema available at compile time.
 * Concrete schema spec is produced after all extensions are compiled.
 */
export type SchemaFragment = Record<string, unknown>;

/**
 * Contributor function signature used by capability pipelines.
 */
type Contributor<TPayload> = (
    this: ExtensionScope<object>,
    ctx: ContributorContext
) => readonly TPayload[];

/**
 * Extension compiler — collects and compiles capabilities from all extensions
 */
export class ExtensionCompiler {
    private readonly diagnostics: DiagnosticsService;
    private nodeSpecs: Record<string, NodeSpec> = {};
    private markSpecs: Record<string, MarkSpec> = {};
    private globalAttributes: Record<string, AttributeSpec> = {};
    private plugins: PMPlugin[] = [];
    private keyboardShortcuts: Record<string, KeyboardShortcutHandler[]> = {};
    private inputRules: InputRuleDefinition[] = [];
    private pasteRules: unknown[] = [];
    private serializers: unknown[] = [];
    private nodeViews: Record<string, NodeViewConstructor> = {};
    private domRegistry: DOMSpecRegistry;
    private editorConfig?: EditorConfig;
    /**
     * Keymap contributors that are deferred until the Editor instance exists.
     * Each entry holds the scope (already populated with `name` and `options`)
     * and the contributor function. The editor reference is injected into the
     * scope by `bindEditorAndFinalize()` before the contributor is invoked.
     */
    private keymapContributors: Array<{
        name: string;
        scope: ExtensionScope<object>;
        contributor: ExtensionConfig<object>['keyboardShortcuts'];
    }> = [];
    /** Stored for deferred nodeViews compilation in bindEditorAndFinalize(). */
    private extensions: FlattenedExtension[] = [];
    /** @hidden */
    public schemaDefinition: SchemaDefinition;
    /** @hidden */
    public pmSchema: PMSchema;

    /**
     * Creates a new ExtensionCompiler instance.
     *
     * @param {DiagnosticsService} [diagnosticsService] - Optional diagnostics service for error reporting.
     */
    constructor(diagnosticsService: DiagnosticsService) {
        this.diagnostics = diagnosticsService;
    }
    private editor?: HeadlessEditor;

    /**
     * Compile all extensions into artifacts.
     * Processes capabilities in order: schema → plugins → keymaps → rules → serializers.
     *
     * @param {FlattenedExtension[]} extensions - Extensions to compile in registration order.
     * @param {CommandRegistry} commandRegistry - Optional registry to receive compiled commands.
     * @param {ExtensionManager} extensionManager - Optional manager to check extension registration status.
     * @param {HeadlessEditor} editor - The editor instance
     * @param {EditorConfig} [editorConfig] - Optional editor configuration.
     *
     * @returns {CompiledExtensionArtifacts} Aggregated artifacts produced from all extensions.
     * @hidden
     */
    public compile(
        extensions: FlattenedExtension[],
        commandRegistry?: CommandRegistry,
        extensionManager?: ExtensionManager,
        editor?: HeadlessEditor,
        editorConfig?: EditorConfig
    ): CompiledExtensionArtifacts {
        this.editor = editor;
        this.extensions = extensions;
        this.editorConfig = editorConfig;
        try {
            // bui collect DomSpecs
            this.compileDomSpecs(extensions);
            // Phase 1: Collect schema artifacts (nodes, marks, global attributes)
            this.compileSchema(extensions);

            // Phase 2: Collect plugins
            this.compilePlugins(extensions);

            // Phase 3: Collect keyboard shortcuts
            this.compileKeyboardShortcuts(extensions);

            // Phase 4: Collect input rules
            this.compileInputRules(extensions);

            // Phase 5: Collect paste rules
            this.compilePasteRules(extensions);

            // Phase 6: Collect commands (into CommandRegistry)
            if (commandRegistry) {
                this.compileCommands(extensions, commandRegistry, extensionManager);
            }

            // Phase 7: Collect serializers
            this.compileSerializers(extensions);

            return {
                nodeSpecs: this.nodeSpecs,
                markSpecs: this.markSpecs,
                globalAttributes: this.globalAttributes,
                plugins: this.plugins,
                keyboardShortcuts: this.keyboardShortcuts,
                inputRules: this.inputRules,
                pasteRules: this.pasteRules,
                serializers: this.serializers,
                nodeViews: this.nodeViews
            };
        } catch (error) {
            this.diagnostics.error(
                `Extension compilation failed: ${this.getErrorMessage(error)}`
            );
            throw error;
        }
    }

    /**
     * Build the DOM spec registry.
     *
     * Starts from the built-in default maps and merges any `DOMSpecs`
     * contributions from registered extensions. The resulting registry is
     * immutable — no further mutations are possible after this point.
     *
     * Must run after _initializeExtensions() so that extension managers are
     * available, and before compilePMSchema() which consumes the registry.
     *
     * @param {FlattenedExtension[]} extensions - Extensions to scan for schema contributors.
     * @returns {void}
     */
    private compileDomSpecs(extensions: FlattenedExtension[]): void {
        // Start from mutable copies of the built-in defaults
        const nodeDOMMap: Map<string, NodeDOMSpec> = new Map<string, NodeDOMSpec>();
        const markDOMMap: Map<string, MarkDOMSpec> = new Map<string, MarkDOMSpec>();

        // Merge extension DOM spec contributions (if any)
        if (extensions) {
            if (extensions.length > 0) {
                const { nodeDOMMap: extNodes, markDOMMap: extMarks } =
                    this.collectDOMSpecs([...extensions]);

                // Extension specs override defaults for the same name
                extNodes.forEach((spec: NodeDOMSpec, name: string) => { nodeDOMMap.set(name, spec); });
                extMarks.forEach((spec: MarkDOMSpec, name: string) => { markDOMMap.set(name, spec); });
            }
        }

        this.domRegistry = DefaultDOMSpecRegistry.create(nodeDOMMap, markDOMMap);
    }

    /**
     * Compile the Syncfusion schema definition to a PM Schema.
     *
     * Nodes are collected from all extensions and then **stable-sorted by
     * extension priority (descending)** before the PM Schema is built.
     *
     * This guarantees that ProseMirror's `fillBefore` algorithm always
     * encounters non-recursive `block` nodes (e.g. `paragraph`) before
     * recursive containers (e.g. `table`, `blockquote`) in the schema node
     * map, regardless of extension registration order.
     *
     * `document` and `text` nodes are pinned unconditionally to positions 0
     * and 1 — they are PM framework requirements and must never be sorted.
     *
     * @param {FlattenedExtension[]} extensions - Extensions to scan for schema contributors.
     * @returns {void}
     */
    private compileSchema(extensions: FlattenedExtension[]): void {
        /** Tagged node definition carrying its source extension's priority. */
        interface PrioritisedNode {
            def: NodeDefinition;
            priority: number;
            /** Original collection index — preserves stable sort within a tier. */
            index: number;
        }

        const prioritisedNodes: PrioritisedNode[] = [];
        const marks: MarkDefinition[] = [];

        for (const ext of extensions) {
            const config: ExtensionConfig<object> = ext.definition.config;
            const priority: number = config.priority;
            const scope: ExtensionScope<object> = {
                name: config.name,
                options: config.defineOptions?.() ?? {}
            };

            if (typeof config.nodes === 'function') {
                const contributed: NodeDefinition[] = config.nodes.call(scope);
                for (const nodeDef of contributed) {
                    prioritisedNodes.push({
                        def: nodeDef,
                        priority,
                        index: prioritisedNodes.length
                    });
                }
            }
            if (typeof config.marks === 'function') {
                marks.push(...config.marks.call(scope));
            }
        }

        // ── Pin document and text to the front (PM framework requirements) ──
        // These two nodes must always be the first entries in the schema node
        // map. They are extracted from the sorted list and prepended manually.
        const pinnedNames: ReadonlySet<string> = new Set(['document', 'text']);
        const pinned: PrioritisedNode[] = prioritisedNodes.filter((n: PrioritisedNode) => pinnedNames.has(n.def.name));
        const sortable: PrioritisedNode[] = prioritisedNodes.filter((n: PrioritisedNode) => !pinnedNames.has(n.def.name));

        // Stable descending sort: higher priority → earlier in schema.
        // Stability is guaranteed by falling back to the original collection
        // index when two nodes share the same priority.
        sortable.sort((a: PrioritisedNode, b: PrioritisedNode): number => {
            const diff: number = b.priority - a.priority;
            return diff !== 0 ? diff : a.index - b.index;
        });

        const nodes: NodeDefinition[] = [
            ...pinned.map((n: PrioritisedNode) => n.def),
            ...sortable.map((n: PrioritisedNode) => n.def)
        ];

        this.schemaDefinition = { nodes, marks };
        const adapter: PMSchemaAdapter = new PMSchemaAdapter(this.domRegistry, this.diagnostics);
        this.pmSchema = adapter.compile(this.schemaDefinition);
    }

    /**
     * Compile plugins
     *
     * @param {FlattenedExtension[]} extensions - Extensions to scan for plugin contributors.
     * @returns {void}
     */
    private compilePlugins(extensions: FlattenedExtension[]): void {
        for (const ext of extensions) {
            const name: string = ext.definition.config.name;
            const config: ExtensionConfig<object> = ext.definition.config;
            const scope: ExtensionScope<object> = {
                name,
                options: config.defineOptions?.() ?? {}
            };
            if (config.plugins) {
                try {
                    const pluginContributor: Contributor<PMPlugin> = ext.definition.config.plugins as unknown as Contributor<PMPlugin>;
                    const ctx: ExtensionCompilationContext = {
                        extensionName: name
                    };
                    const plugins: readonly PMPlugin[] = pluginContributor.call(scope, ctx) as readonly PMPlugin[];

                    if (Array.isArray(plugins)) {
                        this.plugins.push(...plugins);
                    }
                } catch (error) {
                    this.diagnostics.error(
                        `Plugin compilation failed for extension "${name}": ${this.getErrorMessage(error)}`
                    );
                }
            }
        }
    }

    /**
     * Compile keyboard shortcuts
     *
     * @param {FlattenedExtension[]} extensions - Extensions to scan for keyboard shortcut contributors.
     * @returns {void}
     */
    private compileKeyboardShortcuts(extensions: FlattenedExtension[]): void {
        for (const ext of extensions) {
            const name: string = ext.definition.config.name;
            const config: ExtensionConfig<object> = ext.definition.config;
            const scope: ExtensionScope<object> = {
                name,
                options: config.defineOptions?.() ?? {},
                editorConfig: this.editorConfig
            };
            if (config.keyboardShortcuts) {
                this.keymapContributors.push({
                    name,
                    scope,
                    contributor: config.keyboardShortcuts
                });
            }
        }
    }

    /**
     * Bind the Editor instance to all stored scopes and execute the deferred
     * keymap contributors. Called by Editor.create() after the Editor
     * constructor completes.
     *
     * @param {HeadlessEditor} editor - The fully initialized Editor instance.
     * @returns {void}
     * @hidden
     */
    public bindEditorAndFinalize(editor: HeadlessEditor): void {
        this.editor = editor;
        // Priority lookup keyed by extension name. Higher priority → earlier
        // in the per-key chain. Stable for equal priorities (registration
        // order preserved). Reused by both the contributor sort and the
        // per-handler chain order.
        const priorityByName: Map<string, number> = new Map();
        for (const ext of this.extensions) {
            const extName: string = ext.definition.config.name;
            priorityByName.set(extName, ext.definition.config.priority ?? 50);
        }

        // Sort contributors by priority descending (stable). Higher priority
        // contributes first → its handlers are pushed first → its handler
        // runs first inside each chain.
        const sortedContributors: typeof this.keymapContributors = [...this.keymapContributors].sort(
            (a: typeof this.keymapContributors[number], b: typeof this.keymapContributors[number]) =>
                (priorityByName.get(b.name) ?? 50) - (priorityByName.get(a.name) ?? 50)
        );

        for (const key of sortedContributors) {
            try {
                (key.scope as { editor?: HeadlessEditor }).editor = editor;

                const ctx: ExtensionCompilationContext = {
                    extensionName: key.name
                };
                const keyboardShortcutContributor: Contributor<Record<string, () => boolean>> =
                    key.contributor as unknown as Contributor<Record<string, () => boolean>>;
                const keyboardShortcuts: Record<string, () => boolean> =
                    keyboardShortcutContributor.call(key.scope, ctx) as unknown as Record<string, () => boolean>;

                if (keyboardShortcuts && typeof keyboardShortcuts === 'object') {
                    // Promote each value to a one-element chain. Two
                    // extensions contributing the same key now stack into
                    // a chain (priority-sorted) instead of overwriting.
                    for (const keyName in keyboardShortcuts) {
                        if (!Object.prototype.hasOwnProperty.call(keyboardShortcuts, keyName)) {
                            continue;
                        }
                        // keyboardShortcuts is a plain record keyed by shortcut names; dynamic access is safe here.
                        // eslint-disable-next-line security/detect-object-injection
                        const handler: KeyboardShortcutHandler = (keyboardShortcuts as Record<string, KeyboardShortcutHandler>)[keyName];
                        // eslint-disable-next-line security/detect-object-injection
                        if (!this.keyboardShortcuts[keyName]) {
                            // eslint-disable-next-line security/detect-object-injection
                            this.keyboardShortcuts[keyName] = [];
                        }
                        // eslint-disable-next-line security/detect-object-injection
                        this.keyboardShortcuts[keyName].push(handler);
                    }
                }
            } catch (error) {
                this.diagnostics.error(
                    `Keyboard shortcut compilation failed for extension "${key.name}": ${this.getErrorMessage(error)}`
                );
            }
        }
        this.keymapContributors = [];

        // NodeViews are compiled here (deferred) so the editor reference is
        // available inside each constructor via the scope.
        this.compileNodeViews(this.extensions, editor);
    }

    /**
     * Returns the compiled NodeView constructors.
     * Only populated after `bindEditorAndFinalize()` has run.
     *
     * @returns {Record<string, NodeViewConstructor>} PM-free NodeView constructor map.
     * @hidden
     */
    public getNodeViews(): Record<string, NodeViewConstructor> {
        return { ...this.nodeViews };
    }

    /**
     * Compile NodeView contributors from extensions.
     * Deferred to `bindEditorAndFinalize()` so the Editor instance is available
     * on the scope — required for command dispatch inside node views.
     *
     * @param {FlattenedExtension[]} extensions - All registered extensions.
     * @param {HeadlessEditor} editor - The fully initialized Editor instance.
     * @returns {void}
     */
    private compileNodeViews(extensions: FlattenedExtension[], editor: HeadlessEditor): void {
        for (const ext of extensions) {
            const name: string = ext.definition.config.name;
            const config: ExtensionConfig<object> = ext.definition.config;
            if (!config.nodeViews) {
                continue;
            }
            try {
                const scope: ExtensionScope<object> = {
                    name,
                    options: config.defineOptions?.() ?? {},
                    editor
                };
                const contributed: Record<string, NodeViewConstructor> = config.nodeViews.call(scope);
                if (contributed && typeof contributed === 'object') {
                    Object.assign(this.nodeViews, contributed);
                }
            } catch (error) {
                this.diagnostics.error(
                    `NodeView compilation failed for extension "${name}": ${this.getErrorMessage(error)}`
                );
            }
        }
    }

    /**
     * Compile input rules
     *
     * @param {FlattenedExtension[]} extensions - Extensions to scan for input-rule contributors.
     * @returns {void}
     */
    private compileInputRules(extensions: FlattenedExtension[]): void {
        for (const ext of extensions) {
            const name: string = ext.definition.config.name;
            const config: ExtensionConfig<object> = ext.definition.config;
            const scope: ExtensionScope<object> = {
                name,
                options: config.defineOptions?.() ?? {}
            };
            if (config.inputRules) {
                try {
                    const ruleContributor: Contributor<InputRuleDefinition> =
                        ext.definition.config.inputRules as unknown as Contributor<InputRuleDefinition>;
                    const ctx: ExtensionCompilationContext = {
                        extensionName: name
                    };
                    const rules: readonly InputRuleDefinition[] = ruleContributor.call(scope, ctx);

                    if (Array.isArray(rules)) {
                        this.inputRules.push(...rules);
                    }
                } catch (error) {
                    this.diagnostics.error(
                        `Input rule compilation failed for extension "${name}": ${this.getErrorMessage(error)}`
                    );
                }
            }
        }
    }

    /**
     * Compile paste rules
     *
     * @param {FlattenedExtension[]} extensions - Extensions to scan for paste-rule contributors.
     * @returns {void}
     */
    private compilePasteRules(extensions: FlattenedExtension[]): void {
        for (const ext of extensions) {
            const name: string = ext.definition.config.name;
            const config: ExtensionConfig<object> = ext.definition.config;
            const scope: ExtensionScope<object> = {
                name,
                options: config.defineOptions?.() ?? {}
            };
            if (config.pasteRules) {
                try {
                    const ruleContributor: Contributor<unknown> = ext.definition.config.pasteRules;
                    const ctx: ExtensionCompilationContext = {
                        extensionName: name
                    };
                    const rules: unknown = ruleContributor.call(scope, ctx);

                    if (Array.isArray(rules)) {
                        this.pasteRules.push(...rules);
                    }
                } catch (error) {
                    this.diagnostics.error(
                        `Paste rule compilation failed for extension "${name}": ${this.getErrorMessage(error)}`
                    );
                }
            }
        }
    }

    /**
     * Compile commands into CommandRegistry
     *
     * @param {FlattenedExtension[]} extensions - Extensions to scan for command contributors.
     * @param {CommandRegistry} commandRegistry - Registry that receives compiled commands.
     * @param {ExtensionManager} [extensionManager] - Manager to check extension registration status.
     * @returns {void}
     */
    private compileCommands(extensions: FlattenedExtension[], commandRegistry: CommandRegistry, extensionManager: ExtensionManager): void {
        for (const extension of extensions) {
            const extensionName: string = extension.definition.config.name;
            const config: ExtensionConfig<object> = extension.definition.config;
            // Only register commands if the extension is registered
            if (extensionManager && !extensionManager.isExtensionRegistered(extensionName)) {
                continue;
            }
            if (config.commands) {
                try {
                    // Bind `this` to the extension scope so commands() can read
                    // `this.options` (e.g. for option-driven command factories).
                    const scope: ExtensionScope<object> = {
                        name: extensionName,
                        options: config.defineOptions?.() ?? {}
                    };
                    const commands: Command[] = (config.commands as (this: ExtensionScope<object>) => Command[]).call(scope);
                    for (const command of commands) {
                        // Register into existing CommandRegistry
                        // Note: CommandRegistry.register() throws on duplicate
                        commandRegistry.register(command, 'extension', extensionName);
                    }
                } catch (error) {
                    this.diagnostics.error(
                        `Command compilation failed for extension "${extensionName}": ${this.getErrorMessage(error)}`
                    );
                    throw error; // Rethrow: command registration failure is critical
                }
            }
        }
    }

    /**
     * Compile serializers
     *
     * @param {FlattenedExtension[]} extensions - Extensions to scan for serializer contributors.
     * @returns {void}
     */
    private compileSerializers(extensions: FlattenedExtension[]): void {
        for (const ext of extensions) {
            const name: string = ext.definition.config.name;
            const config: ExtensionConfig<object> = ext.definition.config;
            const scope: ExtensionScope<object> = {
                name,
                options: config.defineOptions?.() ?? {}
            };
            if (config.serializers) {
                try {
                    const serializerContributor: Contributor<ContributorPayload> = ext.definition.config.serializers;
                    const ctx: ExtensionCompilationContext = {
                        extensionName: name
                    };
                    const serializers: unknown = serializerContributor.call(scope, ctx);

                    if (Array.isArray(serializers)) {
                        this.serializers.push(...serializers);
                    }
                } catch (error) {
                    this.diagnostics.error(
                        `Serializer compilation failed for extension "${name}": ${this.getErrorMessage(error)}`
                    );
                }
            }
        }
    }

    /**
     * Collects DOM rendering specs contributed by extensions that declare the
     * `'DOMSpecs'` capability.
     *
     * Each extension's `domSpecs()` contributor returns PM-free descriptors
     * (`NodeDOMDescriptor` / `MarkDOMDescriptor`) whose `toDOM(attrs)` signature
     * takes a plain attribute bag.  This method wraps those functions into the
     * PM-typed `NodeToDOMFn` / `MarkToDOMFn` shapes expected by `DOMSpecRegistry`.
     *
     * Extension specs take precedence over defaults (last writer wins for
     * duplicate names — the caller is responsible for merge order).
     *
     * @param {FlattenedExtension[]} extensions - Flattened, priority-sorted extension list.
     * @returns {CollectedDOMSpecs} - Maps ready for merging into a `DefaultDOMSpecRegistry`.
     * @hidden
     */
    public collectDOMSpecs(extensions: FlattenedExtension[]): CollectedDOMSpecs {
        const nodeDOMMap: Map<string, NodeDOMSpec> = new Map<string, NodeDOMSpec>();
        const markDOMMap: Map<string, MarkDOMSpec> = new Map<string, MarkDOMSpec>();

        for (const ext of extensions) {
            const name: string = ext.definition.config.name;
            const config: ExtensionConfig<object> = ext.definition.config;

            if (!config.domSpecs) {
                continue;
            }

            try {
                const scope: ExtensionScope<object> = {
                    name,
                    options: config.defineOptions?.() ?? {}
                };
                const contributed: ExtensionDOMSpecs = config.domSpecs.call(scope);

                // ── Node DOM specs ───────────────────────────────────────────────
                if (contributed.nodes) {
                    const nodeEntries: Readonly<Record<string, NodeDOMDescriptor>> = contributed.nodes;
                    Object.keys(nodeEntries).forEach((nodeName: string) => {
                        const descriptor: NodeDOMDescriptor = nodeEntries[`${nodeName}`];
                        if (!descriptor || !descriptor.toDOM) { return; }
                        const rawToDOM: (attrs: Record<string, unknown>) => DOMOutputDescriptor = descriptor.toDOM;
                        const pmToDOM: (node: PMNode) => DOMOutputSpec = (node: PMNode): DOMOutputSpec =>
                            rawToDOM(node.attrs as Record<string, unknown>) as DOMOutputSpec;
                        const spec: NodeDOMSpec = descriptor.parseDOM
                            ? { toDOM: pmToDOM, parseDOM: descriptor.parseDOM }
                            : { toDOM: pmToDOM };
                        nodeDOMMap.set(nodeName, spec);
                    });
                }

                // ── Mark DOM specs ───────────────────────────────────────────────
                if (contributed.marks) {
                    const markEntries: Readonly<Record<string, MarkDOMDescriptor>> = contributed.marks;
                    Object.keys(markEntries).forEach((markName: string) => {
                        const descriptor: MarkDOMDescriptor = markEntries[`${markName}`];
                        if (!descriptor || !descriptor.toDOM) { return; }
                        const rawToDOM: (attrs: Record<string, unknown>, inline: boolean) => DOMOutputDescriptor = descriptor.toDOM; // (attrs, inline) => DOMOutputDescriptor
                        const pmToDOM: (mark: PMMark, inline: boolean) => DOMOutputSpec = (mark: PMMark, inline: boolean): DOMOutputSpec =>
                            rawToDOM(mark.attrs as Record<string, unknown>, inline) as DOMOutputSpec;
                        const spec: MarkDOMSpec = descriptor.parseDOM
                            ? { toDOM: pmToDOM, parseDOM: descriptor.parseDOM }
                            : { toDOM: pmToDOM };
                        markDOMMap.set(markName, spec);
                    });
                }
            } catch (error) {
                this.diagnostics.error(
                    `DOM spec collection failed for extension "${name}": ${this.getErrorMessage(error)}`
                );
            }
        }

        return { nodeDOMMap, markDOMMap };
    }

    /**
     * Helper: extract error message
     *
     * @param {*} error - The error value to stringify.
     * @returns {string} A human-readable message describing the error.
     */
    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        return String(error);
    }

    /**
     * Reset all compiled artifacts (for testing)
     *
     * @returns {void}
     */
    reset(): void {
        this.nodeSpecs = {};
        this.markSpecs = {};
        this.globalAttributes = {};
        this.plugins = [];
        this.keyboardShortcuts = {};
        this.inputRules = [];
        this.pasteRules = [];
        this.serializers = [];
    }

    /**
     * Get compiled node specs
     *
     * @returns {Record<string, NodeSpec>} A shallow copy of the compiled node specs.
     */
    getNodeSpecs(): Record<string, NodeSpec> {
        return { ...this.nodeSpecs };
    }

    /**
     * Get compiled mark specs
     *
     * @returns {Record<string, MarkSpec>} A shallow copy of the compiled mark specs.
     */
    getMarkSpecs(): Record<string, MarkSpec> {
        return { ...this.markSpecs };
    }

    /**
     * Get compiled plugins
     *
     * @returns {PMPlugin[]} A copy of the compiled plugins in registration order.
     */
    getPlugins(): PMPlugin[] {
        return [...this.plugins];
    }

    /**
     * Get compiled keyboard shortcuts
     *
     * @returns {Object} A shallow copy of the compiled keyboard shortcut bindings.
     */
    getKeyboardShortcuts(): Record<string, KeyboardShortcutHandler[]> {
        const copy: Record<string, KeyboardShortcutHandler[]> = {};
        for (const key in this.keyboardShortcuts) {
            if (!Object.prototype.hasOwnProperty.call(this.keyboardShortcuts, key)) {
                continue;
            }
            // copy/this.keyboardShortcuts are plain records keyed by shortcut names; dynamic access is safe here.
            // eslint-disable-next-line security/detect-object-injection
            copy[key] = this.keyboardShortcuts[key].slice();
        }
        return copy;
    }
}
