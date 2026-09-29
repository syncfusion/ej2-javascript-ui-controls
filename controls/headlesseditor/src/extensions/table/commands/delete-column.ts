/**
 * delete-column.ts — Delete the column containing the cursor.
 *
 * PM boundary: allowed inside src/extensions/table/commands/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { deleteColumn, isCursorInTable } from '../../../pm/adapters/table';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { TABLE_COMMAND_META_KEY } from '../table-constants';

// ── Command ───────────────────────────────────────────────────────────────────

/**
 * deleteColumnCommand — removes the table column under the cursor.
 */
export const deleteColumnCommand: PMCommandInternal<void> = {
    name: 'deleteColumn',
    meta: { label: 'Delete Column', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        deleteColumn(
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            }
        );
    }
};
