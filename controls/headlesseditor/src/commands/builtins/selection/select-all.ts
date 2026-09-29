/**
 * select-all.ts — Select the entire document content.
 *
 * **Dispatch Guarantee:**
 * This command always dispatches a transaction, even if no selection change occurs.
 * This is by design to ensure consistent command behavior.
 *
 * **History Behavior:**
 * Selection-only transactions (transactions with `setSelection` but no content changes)
 * are NOT added to the undo history by the history plugin. This matches standard editor
 * behavior where selecting text is not an undoable action. Users undo content changes,
 * not selection changes.
 *
 * This is PM's native behavior and is not configurable per-command.
 *
 * @see src/pm/plugins/history.ts for how the history plugin filters transactions
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { AllSelection, PMEditorState, PMTransaction } from '../../../pm/pm-guard';

export const selectAllCommand: PMCommandInternal<void> = {
    name: 'selectAll',
    meta: { label: 'Select All', category: 'selection' },

    /**
     * Check if selectAll can execute.
     * Always returns true — selectAll is always available.
     *
     * @returns {boolean} Always `true`
     */
    canExecute(): boolean {
        return true;
    },

    /**
     * Execute selectAll by creating an AllSelection covering the entire document.
     * Dispatches a transaction with the new selection.
     *
     * Selection changes are NOT added to undo history (PM native behavior).
     *
     * @param {PMCommandContext} ctx - The command context with PM state snapshot
     * @returns {void} Dispatch is guaranteed
     */
    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const selection: AllSelection = new AllSelection(pmState.doc);
        const tr: PMTransaction = pmState.tr.setSelection(selection);
        ctx.dispatch(wrapTransaction(tr));
    }
};
