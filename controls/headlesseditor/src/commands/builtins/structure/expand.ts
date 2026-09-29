/**
 * Sets `collapsed = false` on the nearest collapsible ancestor.
 *
 * Walks the selection's ancestor chain to find the innermost `collapsible`
 * node, then applies a `setNodeMarkup` transaction to set its `collapsed`
 * attribute to `false`.
 *
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNode } from '../../../pm/pm-guard';

/** Payload for expand — `pos` bypasses selection-based lookup (used by NodeView). */
export interface ExpandPayload {
    /** Absolute document position of the collapsible node. When provided, selection is ignored. */
    readonly pos?: number;
}

/**
 * Returns the document position of the nearest `collapsible` ancestor node,
 * or -1 if none is found.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {number} Position of the collapsible ancestor, or -1.
 */
function findCollapsibleAncestorPos(pmState: PMEditorState): number {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === 'collapsible') {
            return $from.before(d);
        }
    }
    return -1;
}

/**
 * Resolves the collapsible position from explicit `pos` or selection.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @param {ExpandPayload} payload - The command payload.
 * @returns {number} Document position of the collapsible ancestor, or -1.
 */
function resolveCollapsiblePos(pmState: PMEditorState, payload: ExpandPayload): number {
    if (typeof payload.pos === 'number') {
        const $pos: { depth: number; node: (d: number) => { type: { name: string } }; before: (d: number) => number } =
            pmState.doc.resolve(payload.pos);
        for (let d: number = $pos.depth; d >= 0; d--) {
            if ($pos.node(d).type.name === 'collapsible') {
                return $pos.before(d);
            }
        }
        return -1;
    }
    return findCollapsibleAncestorPos(pmState);
}

export const expandCommand: PMCommandInternal<ExpandPayload> = {
    name: 'expand',
    meta: { label: 'Expand', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: ExpandPayload): boolean {
        const pos: number = resolveCollapsiblePos(ctx.pmState, payload ?? {});
        if (pos === -1) { return false; }
        const node: PMNode | null = ctx.pmState.doc.nodeAt(pos);
        // Only executable when currently collapsed
        return node !== null && node.attrs['collapsed'] === true;
    },

    execute(ctx: PMCommandContext, payload: ExpandPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const pos: number = resolveCollapsiblePos(pmState, payload ?? {});
        if (pos === -1) { return; }

        const node: PMNode | null = pmState.doc.nodeAt(pos);
        if (!node) { return; }

        const tr: PMTransaction = pmState.tr.setNodeMarkup(
            pos,
            undefined,
            { ...node.attrs, collapsed: false }
        );
        ctx.dispatch(wrapTransaction(tr));
    }
};
