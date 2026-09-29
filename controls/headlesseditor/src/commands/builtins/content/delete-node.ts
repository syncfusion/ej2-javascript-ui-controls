/**
 * delete-node.ts — Internal command: remove a node (and all its descendants)
 * from the document.
 *
 * Payload:
 *   nodeId — stable node ID of the target node to remove
 *
 * PM boundary: this file is inside src/commands/builtins/ and may import
 * from src/pm/ per the Shape C boundary rule.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { NodeResolver } from '../../shared/node-resolver';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { EditorNode } from '../../../model/editor-node';
import { PMEditorState, PMTransaction, PMNode } from '../../../pm/pm-guard';

export interface DeleteNodePayload {
    nodeId: string;
}

export const deleteNodeCommand: PMCommandInternal<DeleteNodePayload> = {
    name: 'deleteNode',
    meta: {
        label: 'Delete Node',
        category: 'content'
    },

    canExecute(ctx: PMCommandContext, payload: DeleteNodePayload): boolean {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target) { return false; }
        // Cannot delete the root document node
        if (target.type === 'document') { return false; }
        return true;
    },

    execute(ctx: PMCommandContext, payload: DeleteNodePayload): void {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return; }

        const pmState: PMEditorState = ctx.pmState;

        // Locate the PM range for the target node
        let nodeFrom: number = -1;
        let nodeTo: number = -1;

        pmState.doc.descendants((node: PMNode, pos: number): boolean => {
            if (nodeFrom !== -1) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (nodeId === payload.nodeId) {
                nodeFrom = pos;
                nodeTo = pos + node.nodeSize;
                return false;
            }
            return true;
        });

        if (nodeFrom === -1) { return; }

        const tr: PMTransaction = pmState.tr.delete(nodeFrom, nodeTo);
        ctx.dispatch(wrapTransaction(tr));
    }
};
