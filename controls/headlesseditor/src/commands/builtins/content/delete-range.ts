/**
 * delete-range.ts — Delete all content in a document-position range.
 *
 * Payload:
 *   from — start document position (integer, same coordinates as getSelection())
 *   to   — end document position (integer, inclusive-exclusive like PM ranges)
 *
 * Behavior:
 * - validates the range (shared range-validation.ts)
 * - tr.delete(from, to) — skipped for collapsed ranges (no content mutation)
 * - cursor is placed at the position MAPPED through the transaction,
 *   not the raw `from`, so structure-joining deletes leave a valid cursor
 * - single dispatched transaction → one undo step, normal event lifecycle
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { isValidRangePayload } from './range-validation';
import { TextSelection, PMEditorState, PMTransaction } from '../../../pm/pm-guard';

export interface DeleteRangePayload {
    /** Start document position (inclusive). */
    from: number;
    /** End document position (exclusive). */
    to: number;
}

export const deleteRangeCommand: PMCommandInternal<DeleteRangePayload> = {
    name: 'deleteRange',
    meta: { label: 'Delete Range', category: 'content' },

    canExecute(ctx: PMCommandContext, payload: DeleteRangePayload): boolean {
        return isValidRangePayload(payload, ctx.pmState);
    },

    execute(ctx: PMCommandContext, payload: DeleteRangePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        if (!isValidRangePayload(payload, pmState)) { return; }

        const tr: PMTransaction = pmState.tr;
        if (payload.from < payload.to) {
            tr.delete(payload.from, payload.to);
        }

        // Cursor placement: map `from` through the transaction so structural
        // joins/deletions cannot leave the cursor at a stale raw position.
        const cursorPos: number = tr.mapping.map(payload.from);
        tr.setSelection(TextSelection.create(tr.doc, cursorPos));

        ctx.dispatch(wrapTransaction(tr));
    }
};
