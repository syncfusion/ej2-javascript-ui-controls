/**
 * editor-transaction.ts — Syncfusion-owned transaction handle.
 *
 * `EditorTransaction` is the only transaction type that appears in
 * `CommandContext.dispatch()`. It wraps a PM transaction internally.
 * Extension authors and built-in command facades never touch PM directly.
 *
 * The concrete implementation lives in `src/pm/` where PM types are allowed.
 * This file declares only the public interface — zero PM imports.
 */

/**
 * EditorTransaction — an opaque handle representing a pending state change.
 *
 * Constructed by internal PM helpers in `src/pm/`. Passed to
 * `CommandContext.dispatch(transaction)` to commit the change.
 * The `brand` property is a compile-time discriminant only.
 */
export interface EditorTransaction {
    /** Nominal brand — prevents accidental structural compatibility. */
    readonly brand: 'EditorTransaction';
}
