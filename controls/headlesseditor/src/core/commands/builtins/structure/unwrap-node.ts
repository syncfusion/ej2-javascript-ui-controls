/**
 * unwrap-node.ts — Internal command: hoist a node's children up one level,
 * replacing the container node.
 *
 * Payload:
 *   from — PM integer position of the wrapper's open token
 *   to   — PM integer position of the wrapper's close token
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMNode } from '../../../../pm/pm-guard';
import { PMEditorState, PMTransaction } from '../../../../pm/pm-guard';
import { safeNodeAt } from '../../shared/safe-node-at';

export interface UnwrapNodePayload {
    from: number;
    to: number;
}

export const unwrapNodeCommand: PMCommandInternal<UnwrapNodePayload> = {
    name: 'unwrapNode',
    meta: { label: 'Unwrap Node', category: 'structure' },

    canExecute(_ctx: PMCommandContext, payload: UnwrapNodePayload): boolean {
        return typeof payload.from === 'number' && payload.to > payload.from;
    },

    execute(ctx: PMCommandContext, payload: UnwrapNodePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const node: PMNode | null = safeNodeAt(pmState.doc, payload.from) as PMNode | null;
        if (!node) { return; }

        const childNodes: PMNode[] = [];
        node.content.forEach((child: PMNode) => {
            childNodes.push(child);
        });

        const tr: PMTransaction = childNodes.length === 0
            ? pmState.tr.delete(payload.from, payload.to)
            : pmState.tr.replaceWith(payload.from, payload.to, childNodes);

        ctx.dispatch(wrapTransaction(tr));
    }
};
