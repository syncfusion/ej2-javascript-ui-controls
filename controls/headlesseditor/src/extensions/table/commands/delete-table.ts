/**
 * delete-table.ts — Delete the entire table containing the cursor.
 *
 * PM boundary: allowed inside src/extensions/table/commands/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { deleteTablePM, isCursorInTable } from '../../../pm/adapters/table';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { TABLE_COMMAND_META_KEY } from '../table-constants';

// ── Command ───────────────────────────────────────────────────────────────────

/**
 * deleteTableCommand — removes the table under the cursor from the document.
 */
export const deleteTableCommand: PMCommandInternal<void> = {
    name: 'deleteTable',
    meta: { label: 'Delete Table', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        deleteTablePM(
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            }
        );
    }
};
