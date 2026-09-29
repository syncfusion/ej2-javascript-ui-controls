/**
 * insert-paragraph-in-cell.ts — Insert a paragraph inside the current table cell.
 *
 * Used by the Enter key binding inside a table cell. Creates a new paragraph
 * node within the cell rather than splitting the cell itself.
 *
 * PM boundary: allowed inside src/extensions/table/commands/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { insertParagraphInCell, isCursorInTable } from '../../../pm/adapters/table';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { TABLE_COMMAND_META_KEY } from '../table-constants';

// ── Command ───────────────────────────────────────────────────────────────────

/**
 * insertParagraphInCellCommand — inserts a new paragraph block inside the
 * current table cell without splitting the cell structure.
 *
 * Bound to the Enter key by the table keyboard handler when the cursor
 * is inside a table cell.
 */
export const insertParagraphInCellCommand: PMCommandInternal<void> = {
    name: 'insertParagraphInCell',
    meta: { label: 'Insert Paragraph in Cell', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        insertParagraphInCell(
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            }
        );
    }
};
