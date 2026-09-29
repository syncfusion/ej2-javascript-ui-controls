/**
 * redo.ts — Redo the last undone history step.
 *
 * **Delegation Pattern:**
 * This command delegates dispatch to ProseMirror's `redo()` function rather than
 * dispatching directly inside execute(). The ProseMirror redo function calls dispatch
 * internally after computing the redo transaction.
 *
 * This violates the typical "dispatch inside execute()" pattern but is necessary because:
 * 1. PM's `redo()` function must compute the redo transaction from the history state
 * 2. Only PM knows which transactions are part of the current redo step
 * 3. The history plugin must process redo transactions specially
 *
 * **Key Points:**
 * - Redo cannot be chained (ChainBuilder rejects 'redo' at queue time)
 * - The CommandExecutor still detects dispatch via DispatchRecorder
 * - The invariant "exactly one dispatch per execute()" is preserved
 * - Remote transactions are excluded by IntegrationManager (marked with remote: true)
 *
 * @see src/pm/plugins/history.ts for history plugin configuration
 * @see src/commands/chain.ts for history command chain rejection
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { pmRedo, redoDepth, PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';

export const redoCommand: PMCommandInternal<void> = {
    name: 'redo',
    meta: { label: 'Redo', category: 'history' },

    /**
     * Check if there are redoable steps in the history stack.
     *
     * @param {PMCommandContext} ctx - The command context with PM state snapshot
     * @returns {boolean} `true` if redo depth > 0; `false` otherwise
     */
    canExecute(ctx: PMCommandContext): boolean {
        return redoDepth(ctx.pmState) > 0;
    },

    /**
     * Execute redo by delegating to PM's redo() function.
     *
     * PM's `redo()` function internally:
     * 1. Looks up the current redo step from the history state
     * 2. Computes the redo transaction
     * 3. Calls the provided dispatch callback with the transaction
     *
     * @param {PMCommandContext} ctx - The command context with PM state snapshot
     * @returns {void} Dispatch is handled by PM's redo() function
     */
    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        pmRedo(pmState, (tr: PMTransaction): void => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
