import { PMSchema, PMNode, PMMark } from '../pm-guard';
import { EditorNode, TextNode } from '../../model/editor-node';
import { Mark } from '../../model/mark';
import { IdGenerator } from '../../utils/id-generator';
import { PMMarkType, PMNodeType } from '../pm-guard';

/**
 * NodeMapper — converts individual EditorNode ↔ ProseMirror Node.
 *
 * Handles recursive conversion of node trees, preserving IDs in `attrs.id`
 * and mapping marks between Syncfusion and PM representations.
 */
export class NodeMapper {
    /**
     * Converts a Syncfusion EditorNode to a ProseMirror Node.
     * Preserves the node's `id` in PM `attrs.id`.
     *
     * @param {EditorNode} node - The Syncfusion editor node to convert.
     * @param {PMSchema} schema - The PM schema used to resolve node and mark types.
     * @returns {PMNode} The corresponding ProseMirror node.
     */
    public static toPMNode(node: EditorNode, schema: PMSchema): PMNode {
        const nodeType: PMNodeType = schema.nodes[node.type];
        if (!nodeType) {
            throw new Error(`NodeMapper: unknown node type "${node.type}" in schema.`);
        }

        const attrs: Record<string, unknown> = { ...node.attrs, id: node.id };

        // Text node — no recursive children, just content as text with marks
        if (node.type === 'text') {
            const textNode: TextNode = node as TextNode;
            const pmMarks: PMMark[] = (textNode.marks ?? []).map((m: Mark) => {
                const markType: PMMarkType = schema.marks[m.type];
                if (!markType) {
                    throw new Error(`NodeMapper: unknown mark type "${m.type}" in schema.`);
                }
                return markType.create((m.attrs ?? {}) as Parameters<PMMarkType['create']>[0]);
            });
            return schema.text(textNode.text, pmMarks);
        }

        const children: PMNode[] = (node.children ?? []).map(
            (child: EditorNode) => NodeMapper.toPMNode(child, schema)
        );

        return nodeType.create(attrs as Parameters<PMNodeType['create']>[0], children);
    }

    /**
     * Converts a ProseMirror Node to a Syncfusion EditorNode.
     * If `attrs.id` is null or missing, generates a new UUID via `idGen`.
     *
     * @param {PMNode} pmNode - The ProseMirror node to convert.
     * @param {IdGenerator} idGen - Generator used when a node is missing an id.
     * @returns {EditorNode} The corresponding Syncfusion editor node.
     */
    public static fromPMNode(pmNode: PMNode, idGen: IdGenerator): EditorNode {
        // Text node
        if (pmNode.isText) {
            const id: string = (pmNode.attrs && pmNode.attrs['id']) ? String(pmNode.attrs['id']) : idGen.generate();
            const marks: Mark[] = (pmNode.marks ?? []).map((m: PMMark) => ({
                type: m.type.name,
                attrs: (m.attrs ?? {}) as Record<string, unknown>
            }));
            const textNode: TextNode = {
                id,
                type: 'text',
                text: pmNode.text ?? '',
                attrs: {},
                children: [],
                marks
            };
            return textNode;
        }

        const rawId: string = pmNode.attrs ? pmNode.attrs['id'] : null;
        const id: string = rawId !== null && rawId !== undefined ? String(rawId) : idGen.generate();

        // Collect attrs without id
        const attrs: Record<string, unknown> = {};
        if (pmNode.attrs) {
            for (const key of Object.keys(pmNode.attrs)) {
                if (key !== 'id') {
                    attrs[key as string] = pmNode.attrs[key as string];
                }
            }
        }

        // Recursively convert children
        const children: EditorNode[] = [];
        pmNode.forEach((child: PMNode) => {
            children.push(NodeMapper.fromPMNode(child, idGen));
        });

        return {
            id,
            type: pmNode.type.name,
            attrs,
            children,
            marks: []
        };
    }
}
