/**
 * node-resolver.ts — Pure TypeScript document tree traversal.
 *
 * No ProseMirror imports. Operates entirely on Syncfusion model types.
 * Syncfusion documents carry no persistent node IDs, so all id-based
 * lookup helpers have been removed; node references are object references.
 */
import { EditorNode } from '../../model/editor-node';

// ── NodeResolver ─────────────────────────────────────────────────────────────

/**
 * NodeResolver — stateless utility for navigating a DocumentRoot tree.
 *
 * All methods are pure: they do not mutate the document and always return
 * a new value or `undefined`.
 */
export class NodeResolver {
    /**
     * Finds the first node whose `type` matches the given nodeType in the
     * document tree (depth-first, pre-order). Returns `undefined` if not found.
     *
     * @param {EditorNode} root - The root node to search from (typically a DocumentRoot).
     * @param {string} nodeType - The type name to match.
     * @returns {EditorNode} The matching node, or undefined if not found.
     */
    public static findFirstByType(root: EditorNode, nodeType: string): EditorNode | undefined {
        return NodeResolver.searchByType(root, nodeType);
    }

    /**
     * Collects all nodes whose `type` matches `nodeType`.
     * Returns an empty array when no matches exist.
     *
     * @param {EditorNode} root - The root node to search from (typically a DocumentRoot).
     * @param {string} nodeType - The type name to match.
     * @returns {EditorNode[]} A list of matching nodes (empty when none).
     */
    public static findNodesByType(root: EditorNode, nodeType: string): EditorNode[] {
        const results: EditorNode[] = [];
        NodeResolver.collectByType(root, nodeType, results);
        return results;
    }

    /**
     * Returns the zero-based child index of `childNode` within its parent,
     * or -1 when not found.
     *
     * @param {EditorNode} parent - The parent node whose children to scan.
     * @param {EditorNode} childNode - The child node to locate.
     * @returns {number} The zero-based child index, or -1 when not found.
     */
    public static childIndexOf(parent: EditorNode, childNode: EditorNode): number {
        for (let i: number = 0; i < parent.children.length; i++) {
            if (parent.children[i as number] === childNode) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Finds the parent node of `target`. Returns `undefined` when target is
     * not found or is the root.
     *
     * @param {EditorNode} root - The root node to search from.
     * @param {EditorNode} target - The node whose parent to find.
     * @returns {EditorNode} The parent node, or undefined if not found.
     */
    public static findParent(root: EditorNode, target: EditorNode): EditorNode | undefined {
        return NodeResolver.searchParent(root, target);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private static searchByType(node: EditorNode, nodeType: string): EditorNode | undefined {
        if (node.type === nodeType) {
            return node;
        }
        for (const child of node.children) {
            const found: EditorNode | undefined = NodeResolver.searchByType(child, nodeType);
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }

    private static collectByType(
        node: EditorNode,
        nodeType: string,
        results: EditorNode[]
    ): void {
        if (node.type === nodeType) {
            results.push(node);
        }
        for (const child of node.children) {
            NodeResolver.collectByType(child, nodeType, results);
        }
    }

    private static searchParent(
        current: EditorNode,
        target: EditorNode
    ): EditorNode | undefined {
        for (const child of current.children) {
            if (child === target) {
                return current;
            }
            const found: EditorNode | undefined = NodeResolver.searchParent(child, target);
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }
}
