/**
 * delete-text.ts — Internal command: delete text in a given range.
 *
 * Payload:
 *   from — { nodeId, offset } start of range
 *   to   — { nodeId, offset } end of range
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PositionAdapter } from '../../../pm/adapters/position-adapter';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';

export interface DeleteTextPayload {
    from: { nodeId: string; offset: number };
    to: { nodeId: string; offset: number };
}

export const deleteTextCommand: PMCommandInternal<DeleteTextPayload> = {
    name: 'deleteText',
    meta: { label: 'Delete Text', category: 'content' },

    canExecute(): boolean {
        return true;
    },

    execute(ctx: PMCommandContext, payload: DeleteTextPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const pa: PositionAdapter = new PositionAdapter();

        let fromPos: number;
        let toPos: number;
        try {
            fromPos = pa.toPMPosition(
                { nodeId: payload.from.nodeId, offset: payload.from.offset },
                pmState.doc
            ).pmPos;
            toPos = pa.toPMPosition(
                { nodeId: payload.to.nodeId, offset: payload.to.offset },
                pmState.doc
            ).pmPos;
        } catch {
            return;
        }

        if (fromPos >= toPos) { return; }

        const tr: PMTransaction = pmState.tr.delete(fromPos, toPos);
        ctx.dispatch(wrapTransaction(tr));
    }
};
