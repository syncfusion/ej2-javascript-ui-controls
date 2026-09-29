/**
 * set-bullet-list-type.ts — Set the `listStyleType` marker style on the
 * nearest enclosing `bulletList` node.
 *
 * Accepts CSS `list-style-type` values (`'disc'`, `'circle'`, `'square'`,
 * ...) as plain strings; custom values pass through untouched so future
 * CSS values need no library change.
 *
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMTransaction } from '../../../pm/pm-guard';

export interface SetBulletListTypePayload {
    /** CSS `list-style-type` value to apply (e.g. `'disc'`, `'circle'`). */
    readonly listStyleType: string;
}

/**
 * Find the position and node of the nearest enclosing `bulletList` ancestor.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {{ pos: number, node: PMNode } | null} Position and node, or null.
 */
function findEnclosingBulletList(pmState: PMEditorState): { pos: number; node: PMNode } | null {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        const node: PMNode = $from.node(d);
        if (node.type.name === 'bulletList') {
            return { pos: $from.before(d), node };
        }
    }
    return null;
}

export const setBulletListTypeCommand: PMCommandInternal<SetBulletListTypePayload> = {
    name: 'setBulletListType',
    meta: { label: 'Set Bullet List Type', category: 'list' },

    canExecute(ctx: PMCommandContext, payload: SetBulletListTypePayload): boolean {
        return typeof payload?.listStyleType === 'string'
            && payload.listStyleType.length > 0
            && findEnclosingBulletList(ctx.pmState) !== null;
    },

    execute(ctx: PMCommandContext, payload: SetBulletListTypePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const found: { pos: number; node: PMNode } | null = findEnclosingBulletList(pmState);
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
