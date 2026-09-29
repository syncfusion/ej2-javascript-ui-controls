/**
 * node-resolver.ts — Pure TypeScript document tree traversal.
 *
 * No ProseMirror imports. Operates entirely on Syncfusion model types.
 * Used by structural built-in commands to locate nodes by ID or type
 * without duplicating traversal logic.
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
     * Finds the first node with the given `nodeId` in the document tree
     * (depth-first, pre-order). Returns `undefined` if not found.
     *
     * @param {EditorNode} root - The root node to search from (typically a DocumentRoot).
     * @param {string} nodeId - The id of the node to find.
     * @returns {EditorNode} The matching node, or undefined if not found.
     */
    public static findNodeById(root: EditorNode, nodeId: string): EditorNode | undefined {
        return NodeResolver.searchById(root, nodeId);
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
     * Finds the parent node of `nodeId`.
     * Returns `undefined` when the target is not found or is the root.
     *
     * @param {EditorNode} root - The root node to search from (typically a DocumentRoot).
     * @param {string} nodeId - The id of the child node whose parent to find.
     * @returns {EditorNode} The parent node, or undefined if not found.
     */
    public static findParent(root: EditorNode, nodeId: string): EditorNode | undefined {
        return NodeResolver.searchParent(root, nodeId);
    }

    /**
     * Returns the zero-based child index of `nodeId` within its parent,
     * or -1 when not found.
     *
     * @param {EditorNode} parent - The parent node whose children to scan.
     * @param {string} nodeId - The id of the child to locate.
     * @returns {number} The zero-based child index, or -1 when not found.
     */
    public static childIndexOf(parent: EditorNode, nodeId: string): number {
        for (let i: number = 0; i < parent.children.length; i++) {
            if (parent.children[i as number].id === nodeId) {
                return i;
            }
        }
        return -1;
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private static searchById(node: EditorNode, nodeId: string): EditorNode | undefined {
        if (node.id === nodeId) {
            return node;
        }
        for (const child of node.children) {
            const found: EditorNode | undefined = NodeResolver.searchById(child, nodeId);
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
        nodeId: string
    ): EditorNode | undefined {
        for (const child of current.children) {
            if (child.id === nodeId) {
                return current;
            }
            const found: EditorNode | undefined = NodeResolver.searchParent(child, nodeId);
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }
}
