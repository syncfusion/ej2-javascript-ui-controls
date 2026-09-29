/**
 * set-ordered-list-type.ts — Set the `listStyleType` marker style on the
 * nearest enclosing `orderedList` node.
 *
 * Accepts CSS `list-style-type` values (`'decimal'`, `'lower-alpha'`,
 * `'upper-roman'`, ...) as plain strings; the legacy HTML `<ol type>`
 * values are no longer part of the public API — parsing converts them
 * to CSS equivalents at import time.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMTransaction } from '../../../pm/pm-guard';

export interface SetOrderedListTypePayload {
    /** CSS `list-style-type` value to apply (e.g. `'decimal'`, `'lower-roman'`). */
    readonly listStyleType: string;
}

/**
 * Find the position and node of the nearest enclosing `orderedList` ancestor.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {{ pos: number, node: PMNode } | null} Position and node, or null.
 */
function findEnclosingOrderedList(pmState: PMEditorState): { pos: number; node: PMNode } | null {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        const node: PMNode = $from.node(d);
        if (node.type.name === 'orderedList') {
            return { pos: $from.before(d), node };
        }
    }
    return null;
}

export const setOrderedListTypeCommand: PMCommandInternal<SetOrderedListTypePayload> = {
    name: 'setOrderedListType',
    meta: { label: 'Set Ordered List Type', category: 'list' },

    canExecute(ctx: PMCommandContext, payload: SetOrderedListTypePayload): boolean {
        return typeof payload?.listStyleType === 'string'
            && payload.listStyleType.length > 0
            && findEnclosingOrderedList(ctx.pmState) !== null;
    },

    execute(ctx: PMCommandContext, payload: SetOrderedListTypePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const found: { pos: number; node: PMNode } | null = findEnclosingOrderedList(pmState);
        if (!found) { return; }

        const { pos, node } = found;
        if (node.attrs['listStyleType'] === payload.listStyleType) { return; }

        const tr: PMTransaction = pmState.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            listStyleType: payload.listStyleType
        });
        ctx.dispatch(wrapTransaction(tr));
    }
};
