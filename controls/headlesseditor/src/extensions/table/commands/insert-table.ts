/**
 * insert-table.ts — Insert a new table at the current cursor position.
 *
 * PM boundary: allowed inside src/extensions/table/commands/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { insertTable as insertTablePM } from '../../../pm/adapters/table';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { TABLE_COMMAND_META_KEY } from '../table-constants';

// ── Payload ───────────────────────────────────────────────────────────────────

/**
 * Payload accepted by the insertTable command.
 *
 * @property {number} rows - Number of rows in the new table (minimum 1).
 * @property {number} columns - Number of columns in the new table (minimum 1).
 */
export interface InsertTablePayload {
    rows: number;
    columns: number;
}

// ── Command ───────────────────────────────────────────────────────────────────

/**
 * insertTableCommand — inserts a new table at the current cursor position.
 *
 * Creates a fully-formed table with the specified number of rows and columns,
 * each cell containing an empty paragraph. Inserts after the current block.
 */
export const insertTableCommand: PMCommandInternal<InsertTablePayload> = {
    name: 'insertTable',
    meta: { label: 'Insert Table', category: 'table', focusAfterDispatch: true },

    canExecute(_ctx: PMCommandContext, _payload: InsertTablePayload): boolean {
        return true;
    },

    execute(ctx: PMCommandContext, payload: InsertTablePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const { rows, columns } = payload;

        const clampedRows: number = Math.max(1, rows);
        const clampedColumns: number = Math.max(1, columns);

        insertTablePM(
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            },
            clampedRows,
            clampedColumns
        );
    }
};
