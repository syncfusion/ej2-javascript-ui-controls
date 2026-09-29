/**
 * insert-node.ts — Internal command: insert an EditorNode into the document.
 *
 * Payload:
 *   parentId — stable node ID of the target parent
 *   index    — zero-based insertion index within the parent's children
 *   node     — the Syncfusion EditorNode subtree to insert
 *
 * PM boundary: this file is inside src/commands/builtins/ and may import
 * from src/pm/ per the Shape C boundary rule.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { EditorNode } from '../../../model/editor-node';
import { NodeResolver } from '../../shared/node-resolver';
import { NodeMapper } from '../../../pm/adapters/node-mapper';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMTransaction, PMEditorState, PMSchema, PMNode, PMFragment } from '../../../pm/pm-guard';

export interface InsertNodePayload {
    parentId: string;
    index: number;
    node: EditorNode;
}

export const insertNodeCommand: PMCommandInternal<InsertNodePayload> = {
    name: 'insertNode',
    meta: {
        label: 'Insert Node',
        category: 'content'
    },

    canExecute(ctx: PMCommandContext, payload: InsertNodePayload): boolean {
        const parent: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.parentId);
        if (!parent) { return false; }
        if (payload.index < 0 || payload.index > parent.children.length) { return false; }
        return true;
    },

    execute(ctx: PMCommandContext, payload: InsertNodePayload): void {
        const parent: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.parentId);
        if (!parent) { return; }

        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;

        // Build the PM node from the Syncfusion EditorNode
        const pmNode: PMNode = NodeMapper.toPMNode(payload.node, schema);

        // Find the PM position for insertion: start of parent + sum of prior
        // sibling sizes + 1 (parent open token)
        let insertPos: number = -1;
        pmState.doc.descendants((node: PMNode, pos: number): boolean => {
            if (insertPos !== -1) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (nodeId === payload.parentId) {
                // pos is the open-token position of the parent node.
                // Content starts at pos+1.
                let childPos: number = pos + 1;
                const children: PMFragment = node.content;
                let counted: number = 0;
                children.forEach((child: PMNode): void => {
                    if (counted < payload.index) {
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

        const tr: PMTransaction = pmState.tr.insert(insertPos, pmNode);
        ctx.dispatch(wrapTransaction(tr));
    }
};
