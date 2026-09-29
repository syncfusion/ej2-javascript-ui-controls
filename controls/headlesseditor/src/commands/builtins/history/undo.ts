/**
 * undo.ts — Undo the last history step.
 *
 * **Delegation Pattern:**
 * This command delegates dispatch to ProseMirror's `undo()` function rather than
 * dispatching directly inside execute(). The ProseMirror undo function calls dispatch
 * internally after computing the undo transaction.
 *
 * This violates the typical "dispatch inside execute()" pattern but is necessary because:
 * 1. PM's `undo()` function must compute the undo transaction from the history state
 * 2. Only PM knows which transactions are part of the current undo step
 * 3. The history plugin must process undo transactions specially
 *
 * **Key Points:**
 * - Undo cannot be chained (ChainBuilder rejects 'undo' at queue time)
 * - The CommandExecutor still detects dispatch via DispatchRecorder
 * - The invariant "exactly one dispatch per execute()" is preserved
 * - Remote transactions are excluded by IntegrationManager (marked with remote: true)
 *
 * @see src/pm/plugins/history.ts for history plugin configuration
 * @see src/commands/chain.ts for history command chain rejection
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { pmUndo, undoDepth, PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';

export const undoCommand: PMCommandInternal<void> = {
    name: 'undo',
    meta: { label: 'Undo', category: 'history' },

    /**
     * Check if there are undoable steps in the history stack.
     *
     * @param {PMCommandContext} ctx - The command context with PM state snapshot
     * @returns {boolean} `true` if undo depth > 0; `false` otherwise
     */
    canExecute(ctx: PMCommandContext): boolean {
        return undoDepth(ctx.pmState) > 0;
    },

    /**
     * Execute undo by delegating to PM's undo() function.
     *
     * PM's `undo()` function internally:
     * 1. Looks up the current undo step from the history state
     * 2. Computes the undo transaction
     * 3. Calls the provided dispatch callback with the transaction
     *
     * @param {PMCommandContext} ctx - The command context with PM state snapshot
     * @returns {void} Dispatch is handled by PM's undo() function
     */
    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        pmUndo(pmState, (tr: PMTransaction): void => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
