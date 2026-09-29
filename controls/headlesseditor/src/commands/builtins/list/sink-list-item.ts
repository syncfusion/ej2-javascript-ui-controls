/**
 * sink-list-item.ts — Internal infrastructure command: increase nesting depth
 * of the current list item (indent).
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmSinkListItem, PMEditorState, PMNodeType, PMTransaction } from '../../../pm/pm-guard';

/** Node type names that are treated as list items. */
const LIST_ITEM_TYPES: readonly string[] = ['listItem', 'taskItem'];

/**
 * Resolve the list item node type at the current cursor position.
 *
 * Walks up the selection depth to find the nearest `listItem` or `taskItem`
 * ancestor and returns its node type. This allows a single command to work
 * in both regular lists and task lists without separate commands per item type.
 *
 * Falls back to the schema's `listItem` type when no item ancestor is found
 * (which lets PM's canExecute logic reject it cleanly).
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {PMNodeType|null} The list item node type at the cursor, or null.
 */
function getListItemType(pmState: PMEditorState): PMNodeType | null {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        const name: string = $from.node(d).type.name;
        if (LIST_ITEM_TYPES.indexOf(name) !== -1) {
            return $from.node(d).type;
        }
    }
    return pmState.schema.nodes['listItem'] ?? null;
}

export const sinkListItemCommand: PMCommandInternal<void> = {
    name: 'sinkListItem',
    meta: { label: 'Indent List Item', category: 'list' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const itemType: PMNodeType | null = getListItemType(pmState);
        if (!itemType) { return false; }
        return pmSinkListItem(itemType)(pmState);
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const itemType: PMNodeType | null = getListItemType(pmState);
        if (!itemType) { return; }

        pmSinkListItem(itemType)(pmState, (tr: PMTransaction) => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
