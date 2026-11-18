/**
 * preserve-block-format.ts — Shared helper for `setBlockType` calls that need
 * to preserve the source block's `align` / `indent` attributes while still
 * layering the new attributes on top (e.g. converting a paragraph to a heading
 * must keep its existing `indent: 2` and `align: "right"`).
 *
 * Without this helper, `prosemirror-commands.setBlockType` overwrites the
 * entire attribute bag with whatever the caller passes, dropping every
 * pre-existing attribute that the caller did not explicitly forward.
 */

import { PMEditorState, PMNode, PMResolvedPos, NodeSelection } from '../../pm/pm-guard';

const PRESERVED_BLOCK_ATTRS: readonly string[] = ['align', 'indent'];

/**
 * Returns whether the current selection is contained by one convertible text
 * block from the supplied set. Container nodes are deliberately ignored: a
 * paragraph inside a blockquote is evaluated as a paragraph, while selecting
 * the blockquote itself has no enclosing text block and returns false.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @param {ReadonlySet<string>} convertibleBlockNames - Allowed text-block names.
 * @returns {boolean} Whether the selection can be converted as one block.
 * @hidden
 */
export function isBlockConvertible(
    pmState: PMEditorState,
    convertibleBlockNames: ReadonlySet<string>
): boolean {
    const selectionNode: PMNode | null = pmState.selection instanceof NodeSelection
        ? pmState.selection.node
        : null;
    if (selectionNode && !selectionNode.isTextblock) {
        return false;
    }

    const resolveTextblock: (resolved: PMResolvedPos) => { node: PMNode; pos: number } | null =
        (resolved: PMResolvedPos): { node: PMNode; pos: number } | null => {
            for (let depth: number = resolved.depth; depth > 0; depth--) {
                const node: PMNode = resolved.node(depth);
                if (node.isTextblock) {
                    return { node, pos: resolved.before(depth) };
                }
            }
            return null;
        };

    const fromBlock: { node: PMNode; pos: number } | null = resolveTextblock(pmState.selection.$from);
    const toBlock: { node: PMNode; pos: number } | null = resolveTextblock(pmState.selection.$to);
    return fromBlock !== null
        && toBlock !== null
        && fromBlock.pos === toBlock.pos
        && convertibleBlockNames.has(fromBlock.node.type.name);
}

/**
 * Returns a fresh attribute bag that starts from the source node's existing
 * attribute values (filtered to {@link PRESERVED_BLOCK_ATTRS}) and layers the
 * caller-supplied `newAttrs` on top.
 *
 * Node identity is position-based; this helper layers caller-supplied `newAttrs`
 * directly without any UUID preservation.
 *
 * @param {PMNode} oldNode - The original block node being transformed.
 * @param {Object} newAttrs - The new attrs to apply on top.
 * @returns {Object} A merged attribute bag.
 * @hidden
 */
export function preserveBlockFormat(
    oldNode: PMNode,
    newAttrs: Record<string, unknown> | undefined
): Record<string, unknown> {
    const preserved: Record<string, unknown> = {};
    const sourceAttrs: Record<string, unknown> = (oldNode && oldNode.attrs)
        ? (oldNode.attrs as Record<string, unknown>)
        : {};
    for (const name of PRESERVED_BLOCK_ATTRS) {
        if (Object.prototype.hasOwnProperty.call(sourceAttrs, name)) {
            // eslint-disable-next-line security/detect-object-injection
            const value: unknown = sourceAttrs[name];
            // Skip explicit `undefined` values so the spread doesn't reintroduce
            // the key with an `undefined` value. The caller-supplied newAttrs
            // still wins for any key it explicitly supplies (including `null`,
            // which is the schema "no value" sentinel for align).
            if (value !== undefined) {
                // eslint-disable-next-line security/detect-object-injection
                preserved[name] = value;
            }
        }
    }
    return { ...preserved, ...(newAttrs ?? {}) };
}
