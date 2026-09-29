/**
 * Extension SDK Type Definitions
 *
 * This file defines the core extension contract types used throughout the SDK.
 * No ProseMirror types are exposed here — PM is internal to src/pm/ only.
 *
 * @module extensions/types
 */

import type { MarkDefinition } from '../schema/types/mark-definition';
import type { NodeDefinition } from '../schema/types/node-definition';
import type { AttributeDefinition } from '../schema/types/attribute-definition';
import type { Command } from '../commands/types';
import type { EditorNode } from '../model/editor-node';
import type { Selection } from '../model/selection';
import type { HeadlessEditor } from '../headless-editor';
import { EditorConfig } from '../model/editor-config';

/**
 * Single keyboard shortcut handler — a zero-arg function that returns
 * `true` when it handled the key (consumes it) or `false` to let the
 * next handler in the chain run. Used internally by the compiler and
 * plugin to type chain entries.
 */
export type KeyboardShortcutHandler = () => boolean;

/**
 * Unique identifier for an extension capability type.
 * Each capability maps to a contributor function in ExtensionConfig.
 */
export type ExtensionCapability =
    | 'Nodes'
    | 'Marks'
    | 'Commands'
    | 'Keymaps'
    | 'InputRules'
    | 'PasteRules'
    | 'Plugins'
    | 'Serializers'
    | 'GlobalAttributes'
    | 'EventSubscriptions'
    | 'DOMSpecs'
    | 'NodeViews';

/**
 * Describes the object returned by a NodeViewConstructor.
 * Mirrors ProseMirror's NodeView interface but uses only DOM/primitives —
 * no PM types are referenced here.
 */
export interface NodeViewDescriptor {
    /** The outer DOM element for the node. */
    readonly dom: HTMLElement;
    /**
     * If provided, ProseMirror will render the node's children into this
     * element (the "content hole"). If omitted the node is treated as a leaf.
     */
    readonly contentDOM?: HTMLElement | null;
    /**
     * Called whenever the node is updated with new attrs/content.
     * Return `true` to accept the update (ProseMirror re-renders children);
     * return `false` to force a full remount.
     */
    update?: (attrs: Record<string, unknown>, hasContent?: boolean) => boolean;
    /**
     * Called for every DOM mutation observed inside the NodeView. Return
     * `true` to tell ProseMirror the mutation is harmless UI noise and
     * must NOT trigger a remount — e.g. a widget's internal DOM swap
     * (Syncfusion's `Button.appendTo` wraps the host element). Returning
     * `false` lets ProseMirror process the mutation normally
     * (re-reading children, dispatching transactions).
     *
     * @param mutation - The DOM mutation record observed by ProseMirror.
     * @returns `true` to ignore the mutation; `false` to handle it normally.
     */
    ignoreMutation?: (mutation: unknown) => boolean;
    /** Called when the node view is removed from the DOM. */
    destroy?: () => void;
    /** Called when the node is selected. */
    selectNode?: () => void;
    /** Called when the node is deselected. */
    deselectNode?: () => void;
}

/**
 * PM-free factory function for a custom node view.
 *
 * Extensions implement this to take full control of a node's DOM rendering
 * and interactive behaviour without importing any ProseMirror types.
 *
 * @param attrs   - The node's attribute bag (plain `Record<string, unknown>`).
 * @param view    - Opaque reference to the PM EditorView. Extensions must NOT
 *                  cast this — use `editor.commands.*` for all state changes.
 * @param getPos  - Returns the node's current document position, or `undefined`
 *                  if the node has been removed.
 * @returns       A `NodeViewDescriptor` describing the DOM representation.
 */
export type NodeViewConstructor = (
    attrs: Record<string, unknown>,
    view: unknown,
    getPos: () => number | undefined,
    hasContent?: boolean
) => NodeViewDescriptor;

// ─── DOM spec descriptor types (PM-free) ─────────────────────────────────────

/**
 * PM-free representation of a single DOM output item.
 * Mirrors ProseMirror's DOMOutputSpec but without PM type imports.
 * Accepts a tag-name string or a nested array spec.
 */
export type DOMOutputDescriptor = string | readonly unknown[];

/**
 * PM-free descriptor for how a node type should render to the DOM.
 * Used by extensions to contribute custom `toDOM` behaviour without
 * importing any ProseMirror types.
 */
export interface NodeDOMDescriptor {
    /**
     * Returns a DOMOutputDescriptor for the node.
     * Receives the node's attribute bag — never the PM Node object.
     */
    toDOM?: (attrs: Record<string, unknown>) => DOMOutputDescriptor;

    /**
     * Parse rules for converting HTML to this node type during paste/import.
     * Array of ProseMirror ParseRule objects (see PM docs for format).
     * Each rule specifies how to recognize HTML elements and convert to this node.
     */
    parseDOM?: readonly unknown[];
}

/**
 * PM-free descriptor for how a mark type should render to the DOM.
 */
export interface MarkDOMDescriptor {
    /**
     * Returns a DOMOutputDescriptor for the mark.
     * Receives the mark's attribute bag and `inline` flag.
     */
    toDOM?: (attrs: Record<string, unknown>, inline: boolean) => DOMOutputDescriptor;

    /**
     * Parse rules for converting HTML to this mark type during paste/import.
     * Array of ProseMirror ParseRule objects (see PM docs for format).
     * Each rule specifies how to recognize HTML elements and convert to this mark.
     */
    parseDOM?: readonly unknown[];
}

/**
 * Collection of node and mark DOM descriptors contributed by an extension.
 */
export interface ExtensionDOMSpecs {
    /** keyed by NodeDefinition.name */
    readonly nodes?: Readonly<Record<string, NodeDOMDescriptor>>;
    /** keyed by MarkDefinition.name */
    readonly marks?: Readonly<Record<string, MarkDOMDescriptor>>;
}

/**
 * Generic payload type for commands and lifecycle hooks.
 */
export type ContributorPayload = unknown;

/**
 * PM-free context passed to every input rule handler at the point a pattern match fires.
 * All fields are read-only — handlers must not mutate the context.
 * Handlers must use only `dispatchCommand()` to modify editor state. Direct state
 * access or transaction dispatch is not available — use the command framework instead.
 */
export interface InputRuleContext {
    /** The match array produced by `RegExp.exec` against the text before the cursor. */
    readonly match: RegExpMatchArray;
    /** Start position of the match in the document. */
    readonly start: number;
    /** End position of the match in the document. */
    readonly end: number;
    /** The Syncfusion EditorNode at the cursor position, or null if unavailable. */
    readonly nodeAt: EditorNode | null;
    /** The current editor selection, converted to the Syncfusion model. */
    readonly selection: Selection;
    /**
     * Dispatches a registered command by name, returning true if it executed successfully.
     * This is the ONLY way for input rule handlers to modify editor state.
     * Thin closure over `CommandManager.execute()` — goes through the full command pipeline,
     * ensuring undo/redo grouping, event emission, and consistent state management.
     */
    readonly dispatchCommand: (commandName: string, payload?: unknown) => boolean;
}

/**
 * Definition of a single input rule contributed by an extension.
 * All fields are read-only; the registry never mutates definitions.
 */
export interface InputRuleDefinition {
    /** Unique rule identifier (e.g. `'mark:bold-stars'`). */
    readonly id: string;
    /** RegExp that is tested against the text immediately before the cursor. Must end with `$`. */
    readonly pattern: RegExp;
    /** Handler invoked when the pattern matches. Use `ctx.dispatchCommand()` to act. */
    readonly handler: (ctx: InputRuleContext) => void;
    /** Priority for ordering rules (higher = earlier). Defaults to 0. */
    readonly priority?: number;
    /** Human-readable label for tooling / debugging. */
    readonly label?: string;
    readonly allowUndo?: boolean;
}

/** Context provided to dynamic placeholder callbacks. */
export interface PlaceholderContext {
    /** Type of the node currently receiving a placeholder. */
    readonly nodeType: string;
}

/** Configuration options for the Placeholder Extension. */
export interface PlaceholderOptions extends ExtensionOptions {
    /** Placeholder text displayed for empty content. */
    readonly placeholder: string | ((context: PlaceholderContext) => string);
    /** CSS class applied to empty nodes displaying placeholders. */
    readonly emptyNodeClass?: string | ((context: PlaceholderContext) => string);
    /** Additional CSS class applied when the entire editor is empty. */
    readonly emptyEditorClass?: string;
    /** DOM attribute used to store placeholder text. */
    readonly dataAttribute?: string;
    /** Displays placeholders only for the currently active empty node. */
    readonly showOnlyCurrent?: boolean;
    /** Hides placeholders while the editor is in readonly mode. */
    readonly showOnlyWhenEditable?: boolean;
    /** Renders placeholders for nested nodes inside container structures. */
    readonly includeChildren?: boolean;
    /** Displays placeholders only when the entire editor is empty. */
    readonly showOnlyWhenEditorEmpty?: boolean;
}

/**
 * Context type alias for capability contributors that don't require a specific shape.
 */
export type ContributorContext = Record<string, unknown>;

/**
 * Common, reusable options shared by built-in extensions (bold, italic,
 * underline, strikethrough, code, etc.). Each extension can use this
 * interface as-is for its `TOptions` generic, or extend it with
 * extension-specific fields.
 *
 * All fields are optional so an extension that only needs one or two of
 * them can still use the shared type without forcing consumers to
 * supply the rest.
 */
export interface ExtensionOptions {
    /** HTML attributes applied to the rendered DOM element (class, data-*, etc.). */
    readonly htmlAttributes?: Readonly<Record<string, string>>;
}

/**
 * Extension lifecycle states.
 * Tracks the current state of an extension through registration, initialization, and destruction.
 */
export enum ExtensionLifecycleState {
    /** Not yet registered */
    Unregistered = 'Unregistered',

    /** Registered but not yet initialized */
    Registered = 'Registered',

    /** Initialized; onInitialize hook has completed */
    Initialized = 'Initialized',

    /** Ready; onReady hook has completed; all capabilities compiled */
    Ready = 'Ready',

    /** Destroyed */
    Destroyed = 'Destroyed',

    /** Failed during registration, initialization, or compilation */
    Failed = 'Failed'
}

/**
 * Describes an extension's configuration and capabilities.
 *
 * v1 excludes: TStorage generic, defaultStorage contributor, nodeViews contributor.
 * All capability contributors and lifecycle hooks use ExtensionScope as `this`.
 */
export interface ExtensionConfig<TOptions extends object = object> {
    // =========================================================================
    // Metadata
    // =========================================================================

    /** Unique extension identifier within an editor instance. */
    readonly name: string;

    /**
     * When this extension's nodes are added to the editor's schema.
     *
     * Higher numbers are added first. You only need to set this for
     * extensions that contribute blocks which can hold other blocks
     * (recursive containers — use `10`). For everything else, the default
     * of `50` is the right choice. If you're adding a block that should
     * always win as a filler (like a paragraph), use `100`.
     *
     * Quick guide:
     *   `100` — blocks that should be tried first when filling empty space
     *           (paragraph, heading, image, horizontal rule)
     *   `50`  — default; safe for most custom extensions
     *   `10`  — blocks that can contain other blocks (table, blockquote,
     *           list, callout, collapsible)
     *
     * @default 50
     */
    readonly priority?: number;

    // =========================================================================
    // Options
    // =========================================================================

    /** Factory function that returns the option values for this extension. */
    defineOptions?: () => TOptions;

    // =========================================================================
    // Capability Contributors
    // =========================================================================

    /** Contribute additional extensions (composition). */
    addExtensions?: (this: ExtensionScope<TOptions>) => readonly ExtensionDefinition<object>[];

    /** Contribute node type definitions. */
    nodes?: (this: ExtensionScope<TOptions>) => NodeDefinition[];

    /** Contribute mark type definitions. */
    marks?: (this: ExtensionScope<TOptions>) => MarkDefinition[];

    /** Contribute global attribute definitions. */
    globalAttributes?: (this: ExtensionScope<TOptions>) => AttributeDefinition[];

    /** Contribute command definitions. */
    commands?: () => Command[];

    /** Contribute keyboard shortcut definitions. */
    keyboardShortcuts?: (this: ExtensionScope<TOptions>, ctx: ContributorContext) => Record<string, Function>;

    /** Contribute input rule definitions. */
    inputRules?: (this: ExtensionScope<TOptions>, ctx: ContributorContext) => readonly InputRuleDefinition[];

    /** Contribute paste rule definitions. */
    pasteRules?: (this: ExtensionScope<TOptions>, ctx: ContributorContext) => readonly ContributorPayload[];

    /** Contribute editor plugins. */
    plugins?: (this: ExtensionScope<TOptions>, ctx: ContributorContext) => readonly ContributorPayload[];

    /** Contribute serializer definitions. */
    serializers?: (this: ExtensionScope<TOptions>, ctx: ContributorContext) => readonly ContributorPayload[];

    /** Contribute event subscription definitions. */
    eventSubscriptions?: (this: ExtensionScope<TOptions>, ctx: ContributorContext) => readonly ContributorPayload[];

    /**
     * Contribute DOM rendering specs for custom nodes and marks.
     *
     * Called during EditorBuilder._buildDOMSpecRegistry() — before PM schema
     * compilation. Implementations must not import or reference any PM types.
     * Use DOMOutputDescriptor (string | readonly unknown[]) as the return type
     * for toDOM functions.
     */
    domSpecs?: (this: ExtensionScope<TOptions>) => ExtensionDOMSpecs;

    /**
     * Contribute NodeView factories for custom node rendering.
     *
     * Called during `bindEditorAndFinalize()` so the `editor` reference is
     * available on `this`.  Return a map of node-type-name → NodeViewConstructor.
     *
     * NodeViews take precedence over `domSpecs` for the same node type.
     * Implementations must NOT import any PM types — use `editor.commands.*`
     * for all state mutations.
     */
    nodeViews?: (this: ExtensionScope<TOptions>) => Record<string, NodeViewConstructor>;

    // =========================================================================
    // Lifecycle Hooks (all synchronous in v1)
    // =========================================================================

    /** Called after successful registration. */
    onRegister?(): void;

    /** Called after editor startup completion. */
    onReady?(): void;

    /** Called during editor destruction. */
    onDestroy?(): void;
}

/**
 * Per-extension runtime scope.
 * v1 scope: extensions may attach arbitrary state to this object.
 */
export type ExtensionScope<TOptions extends object = object> = {

    /** To get editor instance. */
    readonly editor?: HeadlessEditor;

    /** To get editor Config. */
    readonly editorConfig?: EditorConfig;

    /** Unique extension name. */
    readonly name?: string;

    /** Fully resolved configuration options for this extension. */
    readonly options?: Readonly<TOptions>;

    /** Allow arbitrary per-extension state. */
    readonly [key: string]: unknown;
};

/**
 * An immutable extension definition.
 * Created by defineExtension() factory function.
 */
export interface ExtensionDefinition<TOptions extends object = object> {
    /** Unique extension identifier. */
    readonly name: string;

    /** Internal: full configuration (for ExtensionCompiler access) */
    readonly config: Readonly<ExtensionConfig<TOptions>>;

    /**
     * Creates a new extension with merged options.
     * Original is never modified.
     *
     * @param options - Partial options to merge into the extension's defaults.
     * @returns {ExtensionDefinition} New definition.
     */
    configure(options: Partial<TOptions>): ExtensionDefinition<TOptions>;

    /**
     * Creates a new extension by overriding parts of the config.
     * Original is never modified.
     *
     * @param overrides - Partial config overrides to apply.
     * @returns {ExtensionDefinition} New definition.
     */
    extend(overrides: Partial<ExtensionConfig<TOptions>>): ExtensionDefinition<TOptions>;
}

/**
 * Flattened extension with resolved dependencies.
 */
export interface FlattenedExtension<TOptions extends object = object> {
    definition: ExtensionDefinition<TOptions>;
    registrationOrder: number;
}
