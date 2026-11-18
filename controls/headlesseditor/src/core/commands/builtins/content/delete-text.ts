/**
 * delete-text.ts — Internal command: delete text in a given range.
 *
 * Payload:
 *   from — { offset } start of range
 *   to   — { offset } end of range
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction } from '../../../../pm/pm-guard';

export interface DeleteTextPayload {
    from: { offset: number };
    to: { offset: number };
}

export const deleteTextCommand: PMCommandInternal<DeleteTextPayload> = {
    name: 'deleteText',
    meta: { label: 'Delete Text', category: 'content' },

    canExecute(): boolean {
        return true;
    },

    execute(ctx: PMCommandContext, payload: DeleteTextPayload): void {
        const pmState: PMEditorState = ctx.pmState;

        const fromPos: number = payload.from.offset;
        const toPos: number = payload.to.offset;

        if (fromPos >= toPos) { return; }

        const tr: PMTransaction = pmState.tr.delete(fromPos, toPos);
        ctx.dispatch(wrapTransaction(tr));
    }
};
