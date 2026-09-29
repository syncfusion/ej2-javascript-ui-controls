/**
 * set-selection.ts — Set a text selection range by ProseMirror positions.
 *
 * **Dispatch Guarantee:**
 * This command dispatches when canExecute passes. The selection is set to the
 * provided range [from, to].
 *
 * **History Behavior:**
 * Selection-only transactions (transactions with `setSelection` but no content changes)
 * are NOT added to the undo history by the history plugin. This matches standard editor
 * behavior where selecting text is not an undoable action. Users undo content changes,
 * not selection changes.
 *
 * This is PM's native behavior and is not configurable per-command.
 *
 * **Position Format:**
 * Positions are 0-indexed offsets into the document's flat representation
 * (not line/column numbers). Use `src/pm/adapters/position-adapter.ts` for
 * Syncfusion Position type conversion.
 *
 * @see src/pm/adapters/position-adapter.ts for Syncfusion Position ↔ PM position conversion
 * @see src/pm/plugins/history.ts for how the history plugin filters transactions
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMNode, TextSelection, PMEditorState, PMTransaction } from '../../../pm/pm-guard';

/**
 * Payload for setSelection command.
 *
 * @property {number} from - Start position (0-indexed)
 * @property {number} to - End position (0-indexed)
 */
export interface SetSelectionPayload {
    from: number;
    to: number;
}

export const setSelectionCommand: PMCommandInternal<SetSelectionPayload> = {
    name: 'setSelection',
    meta: { label: 'Set Selection', category: 'selection' },

    /**
     * Check if setSelection can execute with the given position range.
     *
     * Validates that:
     * - payload.from and payload.to are valid numbers
     * - Range is within document bounds [0, doc.content.size]
     * - from ≤ to (proper range order)
     *
     * @param {PMCommandContext} ctx - The command context with PM state snapshot
     * @param {SetSelectionPayload} payload - The target selection range
     * @returns {boolean} `true` if the range is valid; `false` otherwise
     */
    canExecute(ctx: PMCommandContext, payload: SetSelectionPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const doc: PMNode = pmState.doc;
        const maxPos: number = doc.content.size;
        return (
            typeof payload.from === 'number' &&
            typeof payload.to === 'number' &&
            payload.from >= 0 &&
            payload.to <= maxPos &&
            payload.from <= payload.to
        );
    },

    /**
     * Execute setSelection by creating a TextSelection at the given range.
     * Dispatches a transaction with the new selection.
     *
     * Selection changes are NOT added to undo history (PM native behavior).
     *
     * @param {PMCommandContext} ctx - The command context with PM state snapshot
     * @param {SetSelectionPayload} payload - The target selection range [from, to]
     * @returns {void} Dispatch is guaranteed if canExecute returned true
     */
    execute(ctx: PMCommandContext, payload: SetSelectionPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const selection: TextSelection = TextSelection.create(pmState.doc, payload.from, payload.to);
        const tr: PMTransaction = pmState.tr.setSelection(selection);
        ctx.dispatch(wrapTransaction(tr));
    }
};
