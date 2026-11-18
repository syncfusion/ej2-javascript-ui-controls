/**
 * types.ts — Core command framework type definitions.
 *
 * All types in this file are PM-free. They form the public contract for
 * commands, context, metadata, and chain results.
 */
import { DocumentRoot } from '../model/editor-node';
import { Selection } from '../model/selection';
import { EditorState } from '../model/editor-state';
import { EditorTransaction } from '../model/editor-transaction';

// Re-export for convenience — consumers import from here, not from model/
export type { EditorState } from '../model/editor-state';
export type { EditorTransaction } from '../model/editor-transaction';

// ── Forward reference (Editor is declared in src/editor/editor.ts) ────────────
// We use a minimal interface here to avoid a circular dependency between
// commands/ and editor/. The Editor class satisfies this at runtime.
export interface EditorRef {
    readonly commandRegistry: unknown;
}

// ── CommandContext ─────────────────────────────────────────────────────────────

/**
 * CommandContext — provides all required information to commands during execution.
 *
 * Every command's `canExecute()` and `execute()` methods receive a CommandContext instance.
 * This context exposes the current editor state, selection, document, and a dispatch function
 * for committing transaction changes. All types within CommandContext are Syncfusion-owned;
 * no ProseMirror types are exposed.
 *
 * @interface CommandContext
 */
export interface CommandContext {
    /**
     * The current Syncfusion editor state snapshot (document, selection, schema version).
     *
     * @example
     * ```typescript
     * const currentState = ctx.editorState;
     * const doc = currentState.document;
     * ```
     */
    readonly editorState: EditorState;

    /**
     * The current text, node, cell, or block selection.
     *
     * Convenience accessor equivalent to `editorState.selection`.
     */
    readonly selection: Selection;

    /**
     * The current document root and full node tree.
     *
     * Convenience accessor equivalent to `editorState.document`.
     */
    readonly document: DocumentRoot;

    /**
     * Reference to the HeadlessEditor instance for accessing commands, events, or other APIs.
     */
    readonly editor: EditorRef;

    /**
     * Dispatch a transaction to apply changes to the document and selection.
     *
     * This is the only path for committing state changes. Internally wraps `IntegrationManager.dispatch()`.
     * All transaction changes are validated and published to subscribers before returning.
     * ProseMirror types are encapsulated and stay inside `src/pm/`.
     *
     * @param {EditorTransaction} transaction - The transaction containing document/selection changes.
     * @returns {void}
     *
     * @example
     * ```typescript
     * ctx.dispatch({
     *   documentChanges: [...],
     *   selectionChanges: { ... }
     * });
     * ```
     */
    readonly dispatch: (transaction: EditorTransaction) => void;
}

// ── CommandMeta ───────────────────────────────────────────────────────────────

/**
 * CommandMeta — optional metadata for UI rendering, discovery, and accessibility of commands.
 *
 * CommandMeta provides human-readable labels, descriptions, icons, keyboard shortcuts, and searchable tags
 * for each command. This metadata is used by toolbars, menus, keyboard shortcut registries, command palettes,
 * and accessibility systems to organize and present commands to the user. All fields are optional, allowing
 * simple commands to omit metadata entirely.
 *
 * The `category` field is intentionally a plain string so custom categories can be introduced by extensions
 * without modifying this interface.
 *
 * @interface CommandMeta
 *
 * @example
 * ```typescript
 * // Command with full metadata
 * const boldMeta: CommandMeta = {
 *   label: 'Bold',
 *   description: 'Apply bold formatting to selected text',
 *   category: 'formatting',
 *   shortcut: 'Ctrl+B',
 *   icon: 'icon-bold',
 *   tags: ['text', 'formatting', 'emphasis'],
 *   focusAfterDispatch: true
 * };
 * ```
 */
export interface CommandMeta {
    /**
     * User-facing command label displayed in toolbars, menus, and dialogs.
     *
     * @default undefined
     *
     * @example
     * ```typescript
     * label: 'Make Bold'
     * label: 'Insert Table'
     * label: 'Undo Changes'
     * ```
     */
    readonly label?: string;

    /**
     * Longer explanation of what the command does and its effects.
     *
     * Used in extended help text, tooltips, and accessibility descriptions.
     * Should be clear and concise, describing the action outcome.
     *
     * @default undefined
     *
     * @example
     * ```typescript
     * description: 'Apply strong emphasis (bold) to selected text'
     * description: 'Insert a new table with default rows and columns'
     * ```
     */
    readonly description?: string;

    /**
     * Semantic category for command organization and filtering.
     *
     * The category is a plain string string intentionally allowing extensions to define
     * custom categories beyond built-in values. Recommended built-in categories:
     * `'formatting'` | `'structure'` | `'list'` | `'table'` | `'content'` |
     * `'selection'` | `'history'` | `'media'` | `'collaboration'` | `'block'` | `'inline'`
     *
     * Custom categories can be domain-specific (e.g., `'admonition'`, `'callout'`).
     *
     * @default undefined
     */
    readonly category?: string;

    /**
     * Keyboard shortcut hint for display in menus and help systems.
     *
     * Format is display-oriented (e.g., `'Ctrl+B'`, `'Cmd+I'`).
     * This field is for documentation only; actual keybinding registration is handled separately.
     * The shortcut string is not validated or executed.
     *
     * @default undefined
     *
     * @example
     * ```typescript
     * shortcut: 'Ctrl+B'     // Windows/Linux bold
     * shortcut: 'Cmd+B'      // macOS bold
     * ```
     */
    readonly shortcut?: string;

    /**
     * Icon identifier or resource for toolbar/menu rendering.
     *
     * Can be an icon name (e.g., `'icon-bold'`), a CSS class, a data URL, or an SVG identifier.
     * Format depends on the UI framework consuming this metadata. Product code is responsible
     * for resolving the icon value to an actual visual representation.
     *
     * @default undefined
     *
     * @example
     * ```typescript
     * icon: 'icon-bold'      // Named icon from icon library
     * icon: 'bi bi-bold'     // Bootstrap Icons class
     * icon: 'data:image/svg+xml;...'  // Inline SVG data URL
     * ```
     */
    readonly icon?: string;

    /**
     * Array of searchable tags for command discovery in command palettes and search.
     *
     * Tags enable end users to find commands via keyword search. Examples:
     * For bold command: `['text', 'formatting', 'emphasis']`
     * For heading command: `['heading', 'structure', 'block']`
     *
     * @default undefined
     *
     * @example
     * ```typescript
     * tags: ['text', 'formatting', 'emphasis']
     * tags: ['table', 'grid', 'data', 'insert']
     * tags: ['link', 'url', 'hyperlink']
     * ```
     */
    readonly tags?: readonly string[];

    /**
     * If `true`, automatically focus the editor after the command's transaction updates the DOM.
     *
     * Defaults to `true` for most interactive commands. Set to `false` for commands that should
     * not steal focus (e.g., background formatting, debug commands, or headless operations).
     * Allows the user's focus to remain in dialogs, toolbars, or other UI elements.
     *
     * @default true
     *
     * @example
     * ```typescript
     * focusAfterDispatch: true   // Bold command — keep focus in editor
     * focusAfterDispatch: false  // Background color — user may be in color picker
     * ```
     */
    readonly focusAfterDispatch?: boolean;
}

// ── Command ───────────────────────────────────────────────────────────────────

/**
 * Command<TPayload> — the unit of execution in the command framework.
 *
 * `name` must be unique across the registry.
 * Success is determined by whether `context.dispatch()` was called — not by
 * a return value. Commands return `void`.
 */
export interface Command<TPayload = unknown> {
    readonly name: string;
    readonly meta?: CommandMeta;
    /**
     * Optional guard. When defined, `CommandExecutor` calls this before
     * `execute`. If it returns `false`, execution is blocked.
     */
    canExecute?(context: CommandContext, payload: TPayload): boolean;
    /**
     * Perform the command. Call `context.dispatch(tr)` to commit a state change.
     * CommandExecutor detects dispatch via the DispatchRecorder — no return value needed.
     */
    execute(context: CommandContext, payload: TPayload): void;
}

// ── ChainResult ───────────────────────────────────────────────────────────────

/**
 * ChainResult — returned by `ChainBuilder.run()`.
 *
 * Distinguishes an empty chain from an aborted one so callers can react
 * appropriately.
 */
export type ChainResult =
    | { success: true }
    | { success: false; reason: 'empty' | 'aborted'; failedStep?: string };

// ── Errors ────────────────────────────────────────────────────────────────────

/**
 * UnknownCommandError — thrown when a command name is not found in the registry.
 *
 * @hidden
 */
export class UnknownCommandError extends Error {
    public readonly name: string = 'UnknownCommandError';

    constructor(commandName: string) {
        super(`Unknown command: "${commandName}"`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * DuplicateCommandError — thrown when attempting to register a command whose
 * name is already taken.
 *
 * @hidden
 */
export class DuplicateCommandError extends Error {
    public readonly name: string = 'DuplicateCommandError';

    constructor(commandName: string) {
        super(`Command already registered: "${commandName}"`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * MultipleDispatchError — thrown when a command calls ctx.dispatch() more than once.
 * Each command must dispatch exactly one transaction per invocation.
 *
 * @hidden
 */
export class MultipleDispatchError extends Error {
    public readonly name: string = 'MultipleDispatchError';

    constructor(commandName: string) {
        super(
            `Command "${commandName}" called ctx.dispatch() more than once. ` +
            'Each command must dispatch exactly one transaction.'
        );
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * HistoryCommandInChainError — thrown when `undo` or `redo` is queued inside
 * a chain. History commands carry PM-internal metadata that cannot be safely
 * merged into an accumulating transaction.
 *
 * @hidden
 */
export class HistoryCommandInChainError extends Error {
    public readonly name: string = 'HistoryCommandInChainError';

    constructor(commandName: string) {
        super(
            `"${commandName}" cannot be used inside chain(). ` +
            'Call editor.execute("' + commandName + '") directly.'
        );
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
