/**
 * clear-selection.ts — Collapse the current selection to a cursor at the selection anchor.
 *
 * **Dispatch Guarantee:**
 * This command always dispatches a transaction, collapsing the current selection
 * to a single cursor position at the selection's anchor point.
 *
 * **History Behavior:**
 * Selection-only transactions (transactions with `setSelection` but no content changes)
 * are NOT added to the undo history by the history plugin. This matches standard editor
 * behavior where selecting text is not an undoable action. Users undo content changes,
 * not selection changes.
 *
 * This is PM's native behavior and is not configurable per-command.
 *
 * **Cursor Placement:**
 * The resulting cursor is placed at the current selection's `anchor` point.
 * In most editors, anchor is the "stable" end of a selection (opposite the active end).
 *
 * @see src/pm/plugins/history.ts for how the history plugin filters transactions
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { TextSelection, PMEditorState, PMTransaction } from '../../../pm/pm-guard';

export const clearSelectionCommand: PMCommandInternal<void> = {
    name: 'clearSelection',
    meta: { label: 'Clear Selection', category: 'selection' },

    /**
     * Check if clearSelection can execute.
     * Always returns true — clearSelection is always available.
     *
     * @returns {boolean} Always `true`
     */
    canExecute(): boolean {
        return true;
    },

    /**
     * Execute clearSelection by collapsing the current selection to its anchor point.
     * Dispatches a transaction with a cursor at the anchor.
     *
     * Selection changes are NOT added to undo history (PM native behavior).
     *
     * @param {PMCommandContext} ctx - The command context with PM state snapshot
     * @returns {void} Dispatch is guaranteed
     */
    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const anchor: number = pmState.selection.anchor;
        const selection: TextSelection = TextSelection.create(pmState.doc, anchor, anchor);
        const tr: PMTransaction = pmState.tr.setSelection(selection);
        ctx.dispatch(wrapTransaction(tr));
    }
};
