/**
 * insert-row.ts — Insert rows before or after the cursor row.
 *
 * PM boundary: allowed inside src/extensions/table/commands/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { insertRowBefore, insertRowAfter, isCursorInTable } from '../../../pm/adapters/table';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { TABLE_COMMAND_META_KEY } from '../table-constants';

// ── insertRowBefore ───────────────────────────────────────────────────────────

/**
 * insertRowBeforeCommand — inserts a new empty row above the current row.
 */
export const insertRowBeforeCommand: PMCommandInternal<void> = {
    name: 'insertRowBefore',
    meta: { label: 'Insert Row Before', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        // Collect the transaction without immediate dispatch
        const collected: { tr: PMTransaction | null } = { tr: null };

        const success: boolean = insertRowBefore(
            pmState,
            (tr: PMTransaction): void => {
                collected.tr = tr;  // Just collect, don't dispatch yet
            }
        );

        // Dispatch AFTER the PM command completes
        if (success && collected.tr) {
            collected.tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
            ctx.dispatch(wrapTransaction(collected.tr));
        }
    }
};

// ── insertRowAfter ────────────────────────────────────────────────────────────

/**
 * insertRowAfterCommand — inserts a new empty row below the current row.
 */
export const insertRowAfterCommand: PMCommandInternal<void> = {
    name: 'insertRowAfter',
    meta: { label: 'Insert Row After', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        // Collect the transaction without immediate dispatch
        const collected: { tr: PMTransaction | null } = { tr: null };

        const success: boolean = insertRowAfter(
            pmState,
            (tr: PMTransaction): void => {
                collected.tr = tr;  // Just collect, don't dispatch yet
            }
        );

        // Dispatch AFTER the PM command completes
        if (success && collected.tr) {
            collected.tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
            ctx.dispatch(wrapTransaction(collected.tr));
        }
    }
};
