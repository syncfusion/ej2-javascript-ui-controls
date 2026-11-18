/**
 * transform-node.ts — Internal command: change a node's type while
 * preserving its children and attributes (merged with new attrs).
 *
 * Payload:
 *   from    — PM integer position of the node's open token
 *   newType — target PM node type name
 *   newAttrs — optional attribute overrides for the new type
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { Command, CommandContext } from '../../types';
import { IntegrationManager } from '../../../../pm/integration/integration-manager';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNodeType, PMSchema, PMNode } from '../../../../pm/pm-guard';
import { safeNodeAt } from '../../shared/safe-node-at';

export interface TransformNodePayload {
    from: number;
    newType: string;
    newAttrs?: Record<string, unknown>;
}

/**
 * Extracts the IntegrationManager reference attached to a command context.
 *
 * @param {CommandContext} ctx - The command context to inspect.
 * @returns {IntegrationManager} The integration manager stored on the context.
 */
function getIM(ctx: CommandContext): IntegrationManager {
    return (ctx.editor as unknown as { imRef: IntegrationManager }).imRef;
}

export const transformNodeCommand: Command<TransformNodePayload> = {
    name: 'transformNode',
    meta: { label: 'Transform Node', category: 'structure' },

    canExecute(ctx: CommandContext, payload: TransformNodePayload): boolean {
        if (typeof payload.from !== 'number' || payload.from < 0) { return false; }
        const im: IntegrationManager = getIM(ctx);
        const schema: PMSchema = im.getState().schema;
        return schema.nodes[payload.newType] !== undefined;
    },

    execute(ctx: CommandContext, payload: TransformNodePayload): boolean {
        const im: IntegrationManager = getIM(ctx);
        const pmState: PMEditorState = im.getState();
        const schema: PMSchema = pmState.schema;

        const newNodeType: PMNodeType = schema.nodes[payload.newType];
        if (!newNodeType) { return false; }

        const originalNode: PMNode | null = safeNodeAt(pmState.doc, payload.from) as PMNode | null;
        if (!originalNode) { return false; }

        const mergedAttrs: Record<string, unknown> = {
            ...originalNode.attrs,
            ...(payload.newAttrs ?? {})
        };

        const tr: PMTransaction = pmState.tr.setNodeMarkup(
            payload.from,
            newNodeType,
            mergedAttrs as Parameters<PMTransaction['setNodeMarkup']>[2]
        );
        ctx.dispatch(wrapTransaction(tr));
        return true;
    }
};
