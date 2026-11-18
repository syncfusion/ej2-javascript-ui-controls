/**
 * insert-node.ts — Internal command: insert an EditorNode into the document.
 *
 * Payload:
 *   parentPos — PM integer position of the target parent's open token
 *   index     — zero-based insertion index within the parent's children
 *   node      — the Syncfusion EditorNode subtree to insert
 *
 * PM boundary: this file is inside src/commands/builtins/ and may import
 * from src/pm/ per the Shape C boundary rule.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { EditorNode } from '../../../model/editor-node';
import { NodeMapper } from '../../../../pm/adapters/node-mapper';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMTransaction, PMEditorState, PMSchema, PMNode } from '../../../../pm/pm-guard';
import { safeNodeAt } from '../../shared/safe-node-at';

export interface InsertNodePayload {
    parentPos: number;
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
        if (typeof payload.parentPos !== 'number' || payload.parentPos < 0) { return false; }
        if (payload.index < 0) { return false; }
        const pmState: PMEditorState = ctx.pmState;
        const parent: PMNode | null = safeNodeAt(pmState.doc, payload.parentPos) as PMNode | null;
        if (!parent) { return false; }
        if (payload.index > parent.childCount) { return false; }
        return true;
    },

    execute(ctx: PMCommandContext, payload: InsertNodePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;

        const parent: PMNode | null = safeNodeAt(pmState.doc, payload.parentPos) as PMNode | null;
        if (!parent) { return; }

        const pmNode: PMNode = NodeMapper.toPMNode(payload.node, schema);

        // Content of the parent begins at parentPos + 1; advance by
        // `index` sibling sizes to reach the requested insertion point.
        let insertPos: number = payload.parentPos + 1;
        let counted: number = 0;
        parent.forEach((child: PMNode): void => {
            if (counted < payload.index) {
                insertPos += child.nodeSize;
                counted++;
            }
        });

        const tr: PMTransaction = pmState.tr.insert(insertPos, pmNode);
        ctx.dispatch(wrapTransaction(tr));
    }
};
