/**
 * transform-node.ts — Internal command: change a node's type while
 * preserving its children and attributes (merged with new attrs).
 *
 * Payload:
 *   nodeId   — stable ID of the node to transform
 *   newType  — target PM node type name
 *   newAttrs — optional attribute overrides for the new type
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { Command, CommandContext } from '../../types';
import { NodeResolver } from '../../shared/node-resolver';
import { IntegrationManager } from '../../../pm/integration/integration-manager';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNodeType, PMSchema, PMNode } from '../../../pm/pm-guard';
import { EditorNode } from '../../../model/editor-node';

export interface TransformNodePayload {
    nodeId: string;
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
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return false; }

        const im: IntegrationManager = getIM(ctx);
        const schema: PMSchema = im.getState().schema;
        return schema.nodes[payload.newType] !== undefined;
    },

    execute(ctx: CommandContext, payload: TransformNodePayload): boolean {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return false; }

        const im: IntegrationManager = getIM(ctx);
        const pmState: PMEditorState = im.getState();
        const schema: PMSchema = pmState.schema;

        const newNodeType: PMNodeType = schema.nodes[payload.newType];
        if (!newNodeType) { return false; }

        let nodeFrom: number = -1;

        pmState.doc.descendants((node: PMNode, pos: number) => {
            if (nodeFrom !== -1) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (nodeId === payload.nodeId) {
                nodeFrom = pos;
                return false;
            }
            return true;
        });

        if (nodeFrom === -1) { return false; }

        const originalNode: PMNode | null = pmState.doc.nodeAt(nodeFrom);
        if (!originalNode) { return false; }

        // Merge existing attrs + id + new attrs
        const mergedAttrs: Record<string, unknown> = {
            ...originalNode.attrs,
            ...(payload.newAttrs ?? {})
        };

        const tr: PMTransaction = pmState.tr.setNodeMarkup(
            nodeFrom,
            newNodeType,
            mergedAttrs as Parameters<PMTransaction['setNodeMarkup']>[2]
        );
        ctx.dispatch(wrapTransaction(tr));
        return true;
    }
};
