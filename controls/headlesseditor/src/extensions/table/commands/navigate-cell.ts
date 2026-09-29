/**
 * navigate-cell.ts — Cell navigation commands (Tab / Shift-Tab).
 *
 * These commands delegate to the PM goToNextCell adapter which advances
 * the cursor to the next or previous cell in document order.
 *
 * PM boundary: allowed inside src/extensions/table/commands/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { moveToNextCell, moveToPreviousCell, isCursorInTable } from '../../../pm/adapters/table';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { TABLE_COMMAND_META_KEY } from '../table-constants';

// ── moveToNextCell ────────────────────────────────────────────────────────────

/**
 * moveToNextCellCommand — moves the cursor to the next table cell (Tab).
 */
export const moveToNextCellCommand: PMCommandInternal<void> = {
    name: 'moveToNextCell',
    meta: { label: 'Move to Next Cell', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        moveToNextCell(
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            }
        );
    }
};

// ── moveToPreviousCell ────────────────────────────────────────────────────────

/**
 * moveToPreviousCellCommand — moves the cursor to the previous table cell (Shift-Tab).
 */
export const moveToPreviousCellCommand: PMCommandInternal<void> = {
    name: 'moveToPreviousCell',
    meta: { label: 'Move to Previous Cell', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        moveToPreviousCell(
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            }
        );
    }
};
