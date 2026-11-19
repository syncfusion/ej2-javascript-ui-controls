/**
 * move-node.ts — Internal command: relocate a node to a new parent/index.
 *
 * Payload:
 *   from         — PM integer position of the node's open token (will be cut)
 *   to           — PM integer position of the node's close token
 *   newParentPos — PM integer position of the destination parent's open token
 *   newIndex     — zero-based insertion index inside the new parent
 *
 * Strategy: extract the node (cut) then re-insert at the destination.
 * Both operations are batched on one PM transaction.
 *
 * PM boundary: this file is inside src/commands/builtins/ and may import
 * from src/pm/ per the Shape C boundary rule.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMNode } from '../../../../pm/pm-guard';
import { PMEditorState, PMTransaction } from '../../../../pm/pm-guard';
import { safeNodeAt } from '../../shared/safe-node-at';

export interface MoveNodePayload {
    from: number;
    to: number;
    newParentPos: number;
    newIndex: number;
}

export const moveNodeCommand: PMCommandInternal<MoveNodePayload> = {
    name: 'moveNode',
    meta: {
        label: 'Move Node',
        category: 'content'
    },

    canExecute(_ctx: PMCommandContext, payload: MoveNodePayload): boolean {
        if (typeof payload.from !== 'number' || payload.to <= payload.from) { return false; }
        if (typeof payload.newParentPos !== 'number') { return false; }
        if (payload.newIndex < 0) { return false; }
        return true;
    },

    execute(ctx: PMCommandContext, payload: MoveNodePayload): void {
        const pmState: PMEditorState = ctx.pmState;

        // Step 1: extract the moving node from source
        const pmNodeToMove: PMNode | null = safeNodeAt(pmState.doc, payload.from) as PMNode | null;
        if (!pmNodeToMove) { return; }

        // Step 2: delete from source
        let tr: PMTransaction = pmState.tr.delete(payload.from, payload.to);

        // Step 3: locate destination parent in the post-delete doc and
        //         compute the position for the `newIndex`-th child.
        const newParent: PMNode | null = safeNodeAt(tr.doc, payload.newParentPos) as PMNode | null;
        if (!newParent) { return; }

        let insertPos: number = payload.newParentPos + 1; // first content position
        let counted: number = 0;
        newParent.content.forEach((child: PMNode): void => {
            if (counted < payload.newIndex) {
                insertPos += child.nodeSize;
                counted++;
            }
        });

        tr = tr.insert(insertPos, pmNodeToMove);
        ctx.dispatch(wrapTransaction(tr));
    }
};
