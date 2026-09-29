/**
 * Editor-specific command: toggle the checked state
 * of the task item (taskItem) that contains the current selection.
 *
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMTransaction } from '../../../pm/pm-guard';

/** Name of the task item node type. */
const TASK_ITEM_NODE: string = 'taskItem';

/** Payload for toggleTaskChecked — `pos` bypasses selection-based lookup. */
export interface ToggleTaskCheckedPayload {
    /** Absolute document position of the taskItem node. When provided, selection is ignored. */
    readonly pos?: number;
}

/**
 * Locate the nearest `taskItem` ancestor of the current selection.
 * Returns the node and its position, or null when not inside a taskItem.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {{ node: PMNode, pos: number } | null} The taskItem and its start position.
 */
function findTaskItem(pmState: PMEditorState): { node: PMNode; pos: number } | null {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === TASK_ITEM_NODE) {
            return { node: $from.node(d), pos: $from.before(d) };
        }
    }
    return null;
}

/**
 * Resolve the taskItem position from either the explicit `pos` payload
 * (NodeView path — bypasses selection) or the selection-based ancestor walk.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @param {ToggleTaskCheckedPayload} payload - The command payload.
 * @returns {{ node: PMNode, pos: number } | null} The taskItem and its start position.
 */
function resolveTaskItem(
    pmState: PMEditorState,
    payload: ToggleTaskCheckedPayload
): { node: PMNode; pos: number } | null {
    if (typeof payload.pos === 'number') {
        const node: PMNode | null = pmState.doc.nodeAt(payload.pos);
        if (node && node.type.name === TASK_ITEM_NODE) {
            return { node, pos: payload.pos };
        }
        return null;
    }
    return findTaskItem(pmState);
}

export const toggleTaskCheckedCommand: PMCommandInternal<ToggleTaskCheckedPayload> = {
    name: 'toggleTaskChecked',
    meta: { label: 'Toggle Task Checked', category: 'list' },

    canExecute(ctx: PMCommandContext, payload: ToggleTaskCheckedPayload): boolean {
        return resolveTaskItem(ctx.pmState, payload ?? {}) !== null;
    },

    execute(ctx: PMCommandContext, payload: ToggleTaskCheckedPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const found: { node: PMNode; pos: number } | null = resolveTaskItem(pmState, payload ?? {});
        if (!found) { return; }

        const { node, pos } = found;
        const currentChecked: boolean = (node.attrs['checked'] as boolean) ?? false;

        const tr: PMTransaction = pmState.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            checked: !currentChecked
        });
        ctx.dispatch(wrapTransaction(tr));
    }
};
