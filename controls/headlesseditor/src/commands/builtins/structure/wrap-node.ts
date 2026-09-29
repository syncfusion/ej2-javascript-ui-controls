/**
 * wrap-node.ts — Internal command: wrap an existing node in a new container.
 *
 * Payload:
 *   nodeId      — stable ID of the node to wrap
 *   wrapperType — PM node type name (e.g. 'blockquote')
 *   wrapperAttrs — optional attributes for the wrapper node
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { NodeResolver } from '../../shared/node-resolver';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { DefaultIdGenerator } from '../../../utils/id-generator';
import { PMEditorState, PMTransaction, PMSchema, PMNodeType, PMNode } from '../../../pm/pm-guard';
import { EditorNode } from '../../../model/editor-node';

export interface WrapNodePayload {
    nodeId: string;
    wrapperType: string;
    wrapperAttrs?: Record<string, unknown>;
}

const idGen: DefaultIdGenerator  = new DefaultIdGenerator();

export const wrapNodeCommand: PMCommandInternal<WrapNodePayload> = {
    name: 'wrapNode',
    meta: { label: 'Wrap Node', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: WrapNodePayload): boolean {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return false; }

        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        return schema.nodes[payload.wrapperType] !== undefined;
    },

    execute(ctx: PMCommandContext, payload: WrapNodePayload): void {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return; }

        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;

        const wrapperNodeType: PMNodeType = schema.nodes[payload.wrapperType];
        if (!wrapperNodeType) { return; }

        let nodeFrom: number = -1;
        let nodeTo: number = -1;

        pmState.doc.descendants((node: PMNode, pos: number) => {
            if (nodeFrom !== -1) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (nodeId === payload.nodeId) {
                nodeFrom = pos;
                nodeTo = pos + node.nodeSize;
                return false;
            }
            return true;
        });

        if (nodeFrom === -1) { return; }

        // Wrap by replacing the range with wrapper(original)
        const originalNode: PMNode | null = pmState.doc.nodeAt(nodeFrom);
        if (!originalNode) { return; }

        const wrapperAttrs: Record<string, unknown> = {
            ...payload.wrapperAttrs,
            id: idGen.generate()
        };

        const wrapperNode: PMNode = wrapperNodeType.create(
            wrapperAttrs as Parameters<PMNodeType['create']>[0],
            [originalNode]
        );

        const tr: PMTransaction = pmState.tr.replaceWith(nodeFrom, nodeTo, wrapperNode);
        ctx.dispatch(wrapTransaction(tr));
    }
};
