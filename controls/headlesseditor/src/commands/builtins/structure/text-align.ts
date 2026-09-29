/**
 * text-align.ts — Public facade: set text alignment on the selected block.
 *
 * Stores alignment as a node attribute (`align`) on block-level nodes via
 * `tr.setNodeMarkup`. Iterates all selected block nodes.
 *
 * The set of block types that participate in alignment is supplied by the
 * caller via the factory parameter. The default value for that list is
 * owned by the `textAlignExtension` (`TextAlignOptions.types`), not by
 * this module — the command has no opinion on which block types are
 * alignable; it merely applies the supplied filter.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNode } from '../../../pm/pm-guard';

export interface SetTextAlignPayload {
    align: 'left' | 'center' | 'right' | 'justify';
}

const LIST_BLOCK_NAMES: ReadonlySet<string> = new Set(['listItem', 'taskItem']);

/**
 * Locate the alignment target inside a list-shaped block.
 *
 * Walks down from the listItem's first child until either:
 *
 *   - a child whose type is in `alignable` is found — returned with its
 *     absolute document position; OR
 *   - a structural block whose type is NOT in `alignable` is found,
 *     causing the walk to descend through it (so non-alignable wrapper
 *     blocks like a hypothetical `article` between `<li>` and `<p>`
 *     don't break the discovery); OR
 *   - a text leaf is reached directly — the descent found no alignable
 *     wrapper, so `null` is returned and the caller falls back to
 *     writing the attribute on the listItem itself.
 *
 * Empty listItems also yield `null` (no children at all).
 *
 * `pos` is the document position of the listItem. The first child sits
 * at `pos + 1` (after the parent's opening token).
 *
 * @param {PMNode} block - The listItem node to search within.
 * @param {number} pos - Absolute document position of the listItem.
 * @param {ReadonlySet<string>} alignable - Set of alignable node type names.
 * @returns {Object} The alignable child + position, or null.
 */
function findListAlignTarget(
    block: PMNode,
    pos: number,
    alignable: ReadonlySet<string>
): { node: PMNode; pos: number } | null {
    let current: PMNode | null | undefined = block.firstChild;
    let currentPos: number = pos + 1;
    while (current) {
        // Reached a text leaf — the chain has no alignable wrapper.
        // The caller falls back to the listItem itself.
        if ((current as { isText?: boolean }).isText === true ||
            current.type.name === 'text') {
            return null;
        }
        if (alignable.has(current.type.name)) {
            return { node: current, pos: currentPos };
        }
        // Non-text, non-alignable wrapper block — descend through it.
        if (!current.firstChild) {
            return null;
        }
        currentPos += 1;
        current = current.firstChild;
    }
    return null;
}

/**
 * Build the `setTextAlign` command instance scoped to the given block types.
 *
 * `alignableTypes` is the set of node type names that the command is
 * allowed to act on. The caller (the `textAlignExtension`) is responsible
 * for resolving this list from its `TextAlignOptions.types` — including
 * the default value. This module does not ship a default list.
 *
 * @param {Array} alignableTypes Block type names eligible for alignment.
 * @returns {Object} A command instance bound to the supplied list.
 */
export function setTextAlignCommand(
    alignableTypes: readonly string[]
): PMCommandInternal<SetTextAlignPayload> {
    const alignable: Set<string> = new Set(alignableTypes);

    return {
        name: 'setTextAlign',
        meta: { label: 'Text Align', category: 'structure' },

        canExecute(ctx: PMCommandContext): boolean {
            const pmState: PMEditorState = ctx.pmState;
            const { from, to } = pmState.selection;
            let found: boolean = false;
            pmState.doc.nodesBetween(from, to, (node: PMNode): void => {
                if (alignable.has(node.type.name)) { found = true; }
            });
            return found;
        },

        execute(ctx: PMCommandContext, payload: SetTextAlignPayload): void {
            const pmState: PMEditorState = ctx.pmState;
            const { from, to } = pmState.selection;
            let tr: PMTransaction = pmState.tr;

            pmState.doc.nodesBetween(from, to, (node: PMNode, pos: number): void => {
                if (!alignable.has(node.type.name)) { return; }
                if (LIST_BLOCK_NAMES.has(node.type.name)) {
                    // FIX: Pass the real 'pos' here instead of '0'
                    const target: { node: PMNode; pos: number } | null = findListAlignTarget(node, pos, alignable);
                    if (target) {
                        tr = tr.setNodeMarkup(target.pos, undefined, {
                            ...target.node.attrs,
                            align: payload.align
                        });
                    } else {
                        // Writes directly to the <li> at the correct position
                        tr = tr.setNodeMarkup(pos, undefined, {
                            ...node.attrs,
                            align: payload.align
                        });
                    }
                    return;
                }
                tr = tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    align: payload.align
                });
            });

            ctx.dispatch(wrapTransaction(tr));
        }
    };
}

/**
 * Build the `unsetTextAlign` command instance scoped to the given block types.
 *
 * Mirrors `setTextAlignCommand` — same `alignableTypes` parameter,
 * same list-aware routing. The "where does the attribute live" rule
 * (first alignable wrapper, falling back to the listItem) is identical.
 *
 * @param {Array} alignableTypes Block type names eligible for clearing alignment.
 * @returns {Object} A command instance bound to the supplied list.
 */
export function unsetTextAlignCommand(
    alignableTypes: readonly string[]
): PMCommandInternal<void> {
    const alignable: Set<string> = new Set(alignableTypes);

    return {
        name: 'unsetTextAlign',
        meta: { label: 'Unset Text Align', category: 'structure' },

        canExecute(ctx: PMCommandContext): boolean {
            const pmState: PMEditorState = ctx.pmState;
            const { from, to } = pmState.selection;
            let found: boolean = false;
            pmState.doc.nodesBetween(from, to, (node: PMNode): void => {
                if (alignable.has(node.type.name)) { found = true; }
            });
            return found;
        },

        execute(ctx: PMCommandContext): void {
            const pmState: PMEditorState = ctx.pmState;
            const { from, to } = pmState.selection;
            let tr: PMTransaction = pmState.tr;
            let changed: boolean = false;

            const clearAlign: (target: PMNode, targetPos: number) => void = (target: PMNode, targetPos: number): void => {
                if (target.attrs['align'] == null) { return; }
                const nextAttrs: Record<string, unknown> = { ...target.attrs };
                delete nextAttrs['align'];
                tr = tr.setNodeMarkup(targetPos, undefined, nextAttrs);
                changed = true;
            };

            pmState.doc.nodesBetween(from, to, (node: PMNode, pos: number): void => {
                if (!alignable.has(node.type.name)) { return; }
                if (LIST_BLOCK_NAMES.has(node.type.name)) {
                    // FIX: Pass the real 'pos' here instead of '0'
                    const target: { node: PMNode; pos: number } | null = findListAlignTarget(node, pos, alignable);
                    if (target) {
                        clearAlign(target.node, target.pos);
                    } else {
                        clearAlign(node, pos);
                    }
                    return;
                }
                clearAlign(node, pos);
            });

            if (changed) {
                ctx.dispatch(wrapTransaction(tr));
            }
        }
    };
}
