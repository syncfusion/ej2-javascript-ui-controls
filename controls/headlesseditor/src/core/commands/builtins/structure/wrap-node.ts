/**
 * wrap-node.ts — Internal command: wrap an existing node in a new container.
 *
 * Payload:
 *   from         — PM integer position of the node's open token
 *   to           — PM integer position of the node's close token
 *   wrapperType  — PM node type name (e.g. 'blockquote')
 *   wrapperAttrs — optional attributes for the wrapper node
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNodeType, PMNode } from '../../../../pm/pm-guard';
import { safeNodeAt } from '../../shared/safe-node-at';
export interface WrapNodePayload {
    from: number;
    to: number;
    wrapperType: string;
    wrapperAttrs?: Record<string, unknown>;
}

export const wrapNodeCommand: PMCommandInternal<WrapNodePayload> = {
    name: 'wrapNode',
    meta: { label: 'Wrap Node', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: WrapNodePayload): boolean {
        if (typeof payload.from !== 'number' || payload.to <= payload.from) {
            return false;
        }
        const pmState: PMEditorState = ctx.pmState;
        return pmState.schema.nodes[payload.wrapperType] !== undefined;
    },

    execute(ctx: PMCommandContext, payload: WrapNodePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMEditorState['schema'] = pmState.schema;

        const wrapperNodeType: PMNodeType = schema.nodes[payload.wrapperType];
        if (!wrapperNodeType) { return; }

        const originalNode: PMNode | null = safeNodeAt(pmState.doc, payload.from) as PMNode | null;
        if (!originalNode) { return; }

        const wrapperAttrs: Record<string, unknown> = { ...(payload.wrapperAttrs ?? {}) };
        const wrapperNode: PMNode = wrapperNodeType.create(
            wrapperAttrs as Parameters<PMNodeType['create']>[0],
            [originalNode]
        );

        const tr: PMTransaction = pmState.tr.replaceWith(payload.from, payload.to, wrapperNode);
        ctx.dispatch(wrapTransaction(tr));
    }
};
