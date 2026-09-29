/**
 * duplicate-node.ts — Internal command: deep-copy a node subtree with
 * fresh IDs and insert the clone immediately after the original.
 *
 * Payload:
 *   nodeId — stable ID of the node to duplicate
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { EditorNode, TextNode } from '../../../model/editor-node';
import { NodeResolver } from '../../shared/node-resolver';
import { NodeMapper } from '../../../pm/adapters/node-mapper';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { DefaultIdGenerator } from '../../../utils/id-generator';
import { PMEditorState, PMTransaction, PMSchema, PMNode } from '../../../pm/pm-guard';
import { Mark } from '../../../model/mark';

export interface DuplicateNodePayload {
    nodeId: string;
}

const idGen: DefaultIdGenerator = new DefaultIdGenerator();

/**
 * Deep-clone an EditorNode tree, assigning a fresh UUID to every node.
 *
 * @param {EditorNode} node - The node to clone.
 * @returns {EditorNode} A structurally identical copy with new IDs throughout.
 */
function cloneWithFreshIds(node: EditorNode): EditorNode {
    const freshId: string = idGen.generate();
    const clonedChildren: EditorNode[] = node.children.map(cloneWithFreshIds);

    if (node.type === 'text') {
        const textNode: TextNode = node as TextNode;
        const cloned: TextNode = {
            id: freshId,
            type: 'text',
            text: textNode.text,
            attrs: { ...textNode.attrs },
            marks: textNode.marks.map((m: Mark) => ({ type: m.type, attrs: { ...m.attrs } })),
            children: []
        };
        return cloned;
    }

    return {
        id: freshId,
        type: node.type,
        attrs: { ...node.attrs },
        marks: node.marks.map((m: Mark) => ({ type: m.type, attrs: { ...m.attrs } })),
        children: clonedChildren
    };
}

export const duplicateNodeCommand: PMCommandInternal<DuplicateNodePayload> = {
    name: 'duplicateNode',
    meta: { label: 'Duplicate Node', category: 'content' },

    canExecute(ctx: PMCommandContext, payload: DuplicateNodePayload): boolean {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return false; }
        const parent: EditorNode | undefined = NodeResolver.findParent(ctx.document, payload.nodeId);
        return parent !== undefined;
    },

    execute(ctx: PMCommandContext, payload: DuplicateNodePayload): void {
        const target: EditorNode | undefined = NodeResolver.findNodeById(ctx.document, payload.nodeId);
        if (!target || target.type === 'document') { return; }
        const parent: EditorNode | undefined = NodeResolver.findParent(ctx.document, payload.nodeId);
        if (!parent) { return; }

        const clone: EditorNode = cloneWithFreshIds(target);

        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;

        // Build the cloned PM node
        const pmClone: PMNode = NodeMapper.toPMNode(clone, schema);

        // Insert immediately after the original (after its closing token)
        let insertPos: number = -1;
        pmState.doc.descendants((node: PMNode, pos: number): boolean => {
            if (insertPos !== -1) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (nodeId === payload.nodeId) {
                insertPos = pos + node.nodeSize;
                return false;
            }
            return true;
        });

        if (insertPos === -1) { return; }

        const tr: PMTransaction = pmState.tr.insert(insertPos, pmClone);
        ctx.dispatch(wrapTransaction(tr));
    }
};
