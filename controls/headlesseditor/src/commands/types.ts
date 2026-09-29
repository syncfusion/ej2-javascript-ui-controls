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
 * CommandContext — passed to every command's `canExecute` and `execute`.
 *
 * Contains only what commands actually need. No PM types.
 */
export interface CommandContext {
    /** Syncfusion-owned snapshot of the current editor state. */
    readonly editorState: EditorState;
    /** Convenience accessor — same as `editorState.selection`. */
    readonly selection: Selection;
    /** Convenience accessor — same as `editorState.document`. */
    readonly document: DocumentRoot;
    /** Reference to the editor instance. */
    readonly editor: EditorRef;
    /**
     * Dispatch a transaction. The only path for committing a state change.
     * Internally wraps `IntegrationManager.dispatch()`. PM types stay inside
     * `src/pm/`.
     */
    readonly dispatch: (transaction: EditorTransaction) => void;
}

// ── CommandMeta ───────────────────────────────────────────────────────────────

/**
 * CommandMeta — optional metadata attached to a command.
 *
 * `category` is intentionally a plain string so extensions can introduce
 * custom category values without modifying this file.
 */
export interface CommandMeta {
    readonly label?: string;
    readonly description?: string;
    /**
     * Built-in recommended values:
     * 'formatting' | 'structure' | 'list' | 'table' | 'content' |
     * 'selection' | 'history' | 'media' | 'collaboration'
     */
    readonly category?: string;
    readonly shortcut?: string;
    readonly icon?: string;
    readonly tags?: readonly string[];
    /** Focus the editor after the command's transaction updates its DOM. */
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
