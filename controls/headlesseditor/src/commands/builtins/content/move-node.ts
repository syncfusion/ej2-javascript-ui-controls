/**
 * move-node.ts — Internal command: relocate a node to a new parent/index.
 *
 * Payload:
 *   nodeId      — stable ID of the node to move
 *   newParentId — stable ID of the destination parent
 *   newIndex    — zero-based insertion index inside the new parent
 *
 * Strategy: extract the node (cut) then re-insert at the destination.
 * Both operations are batched on one PM transaction.
 *
 * PM boundary: this file is inside src/commands/builtins/ and may import
 * from src/pm/ per the Shape C boundary rule.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { NodeResolver } from '../../shared/node-resolver';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMNode } from '../../../pm/pm-guard';
import { EditorNode } from '../../../model/editor-node';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';

export interface MoveNodePayload {
    nodeId: string;
    newParentId: string;
    newIndex: number;
}

export const moveNodeCommand: PMCommandInternal<MoveNodePayload> = {
    name: 'moveNode',
    meta: {
        label: 'Move Node',
        category: 'content'
    },

    canExecute(ctx: PMCommandContext, payload: MoveNodePayload): boolean {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return false; }
        const newParent: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.newParentId);
        if (!newParent) { return false; }
        // Prevent moving a node into itself or its own descendant
        if (NodeResolver.findNodeById(target, payload.newParentId) !== undefined) {
            return false;
        }
        if (payload.newIndex < 0) { return false; }
        return true;
    },

    execute(ctx: PMCommandContext, payload: MoveNodePayload): void {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        const newParent: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.newParentId);
        if (!target || target.type === 'document' || !newParent) { return; }

        const pmState: PMEditorState = ctx.pmState;

        // Step 1: locate source range
        let sourceFrom: number = -1;
        let sourceTo: number = -1;
        let pmNodeToMove: PMNode | null = null;

        pmState.doc.descendants((node: PMNode, pos: number): boolean => {
            if (sourceFrom !== -1) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (nodeId === payload.nodeId) {
                sourceFrom = pos;
                sourceTo = pos + node.nodeSize;
                pmNodeToMove = node;
                return false;
            }
            return true;
        });

        if (sourceFrom === -1 || !pmNodeToMove) { return; }

        // Step 2: delete from source
        let tr: PMTransaction = pmState.tr.delete(sourceFrom, sourceTo);

        // Step 3: find destination in the post-delete doc
        // After deletion the doc is tr.doc, so we traverse that
        let insertPos: number = -1;
        tr.doc.descendants((node: PMNode, pos: number): boolean => {
            if (insertPos !== -1) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (nodeId === payload.newParentId) {
                let childPos: number = pos + 1;
                let counted: number = 0;
                node.content.forEach((child: PMNode): void => {
                    if (counted < payload.newIndex) {
                        childPos += child.nodeSize;
                        counted++;
                    }
                });
                insertPos = childPos;
                return false;
            }
            return true;
        });

        if (insertPos === -1) { return; }

        tr = tr.insert(insertPos, pmNodeToMove);
        ctx.dispatch(wrapTransaction(tr));
    }
};
