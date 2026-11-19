/**
 * delete-node.ts — Internal command: remove a node (and all its descendants)
 * from the document.
 *
 * Payload:
 *   from — PM integer position of the node's open token
 *   to   — PM integer position of the node's close token (`from` + nodeSize)
 *
 * PM boundary: this file is inside src/commands/builtins/ and may import
 * from src/pm/ per the Shape C boundary rule.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction } from '../../../../pm/pm-guard';

export interface DeleteNodePayload {
    from: number;
    to: number;
}

export const deleteNodeCommand: PMCommandInternal<DeleteNodePayload> = {
    name: 'deleteNode',
    meta: {
        label: 'Delete Node',
        category: 'content'
    },

    canExecute(_ctx: PMCommandContext, payload: DeleteNodePayload): boolean {
        if (typeof payload.from !== 'number' || typeof payload.to !== 'number') {
            return false;
        }
        if (payload.from < 0 || payload.to <= payload.from) { return false; }
        return true;
    },

    execute(ctx: PMCommandContext, payload: DeleteNodePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const tr: PMTransaction = pmState.tr.delete(payload.from, payload.to);
        ctx.dispatch(wrapTransaction(tr));
    }
};
