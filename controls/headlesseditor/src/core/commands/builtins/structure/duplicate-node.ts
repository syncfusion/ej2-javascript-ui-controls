/**
 * duplicate-node.ts — Internal command: deep-copy a node subtree and
 * insert the clone immediately after the original.
 *
 * Payload:
 *   from — PM integer position of the node's open token
 *   to   — PM integer position of the node's close token (`from` + nodeSize)
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNode } from '../../../../pm/pm-guard';
import { safeNodeAt } from '../../shared/safe-node-at';

export interface DuplicateNodePayload {
    from: number;
    to: number;
}

/**
 * Deep-clone a PM node subtree.
 *
 * @param {PMNode} node - The node to clone.
 * @returns {PMNode} A structurally identical copy.
 */
function cloneSubtree(node: PMNode): PMNode {
    return node.copy(node.content);
}

export const duplicateNodeCommand: PMCommandInternal<DuplicateNodePayload> = {
    name: 'duplicateNode',
    meta: { label: 'Duplicate Node', category: 'content' },

    canExecute(ctx: PMCommandContext, payload: DuplicateNodePayload): boolean {
        if (typeof payload.from !== 'number' || typeof payload.to !== 'number') {
            return false;
        }
        if (payload.from < 0 || payload.to <= payload.from) { return false; }
        if (!safeNodeAt(ctx.pmState.doc, payload.from)) { return false; }
        return true;
    },

    execute(ctx: PMCommandContext, payload: DuplicateNodePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const node: PMNode | null = safeNodeAt(pmState.doc, payload.from) as PMNode | null;
        if (!node) { return; }

        const clone: PMNode = cloneSubtree(node);
        const tr: PMTransaction = pmState.tr.insert(payload.to, clone);
        ctx.dispatch(wrapTransaction(tr));
    }
};
