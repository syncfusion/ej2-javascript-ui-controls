/**
 * unwrap-node.ts — Internal command: hoist a node's children up one level,
 * replacing the container node.
 *
 * Payload:
 *   nodeId — stable ID of the wrapper node to dissolve
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { NodeResolver } from '../../shared/node-resolver';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMNode } from '../../../pm/pm-guard';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { EditorNode } from '../../../model/editor-node';

export interface UnwrapNodePayload {
    nodeId: string;
}

export const unwrapNodeCommand: PMCommandInternal<UnwrapNodePayload> = {
    name: 'unwrapNode',
    meta: { label: 'Unwrap Node', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: UnwrapNodePayload): boolean {
        const target: EditorNode | undefined  = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return false; }
        // Must have a parent that is not the document (can't unwrap a top-level block into the doc root arbitrarily)
        const parent: EditorNode | undefined = NodeResolver.findParent(ctx.document, payload.nodeId);
        return parent !== undefined;
    },

    execute(ctx: PMCommandContext, payload: UnwrapNodePayload): void {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return; }

        const pmState: PMEditorState = ctx.pmState;

        let nodeFrom: number = -1;
        let nodeTo: number = -1;
        let childNodes: PMNode[] = [];

        pmState.doc.descendants((node: PMNode, pos: number) => {
            if (nodeFrom !== -1) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (nodeId === payload.nodeId) {
                nodeFrom = pos;
                nodeTo = pos + node.nodeSize;
                childNodes = [];
                node.content.forEach((child: PMNode) => {
                    childNodes.push(child);
                });
                return false;
            }
            return true;
        });

        if (nodeFrom === -1) { return; }
        if (childNodes.length === 0) {
            // No children — just delete
            const tr: PMTransaction = pmState.tr.delete(nodeFrom, nodeTo);
            ctx.dispatch(wrapTransaction(tr));
            return;
        }

        const tr: PMTransaction = pmState.tr.replaceWith(nodeFrom, nodeTo, childNodes);
        ctx.dispatch(wrapTransaction(tr));
    }
};
