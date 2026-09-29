/**
 * insert-column.ts — Insert columns before or after the cursor column.
 *
 * PM boundary: allowed inside src/extensions/table/commands/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { insertColumnBefore, insertColumnAfter, isCursorInTable } from '../../../pm/adapters/table';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { TABLE_COMMAND_META_KEY } from '../table-constants';

// ── insertColumnBefore ────────────────────────────────────────────────────────

/**
 * insertColumnBeforeCommand — inserts a new empty column to the left of the
 * current column.
 */
export const insertColumnBeforeCommand: PMCommandInternal<void> = {
    name: 'insertColumnBefore',
    meta: { label: 'Insert Column Before', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        insertColumnBefore(
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            }
        );
    }
};

// ── insertColumnAfter ─────────────────────────────────────────────────────────

/**
 * insertColumnAfterCommand — inserts a new empty column to the right of the
 * current column.
 */
export const insertColumnAfterCommand: PMCommandInternal<void> = {
    name: 'insertColumnAfter',
    meta: { label: 'Insert Column After', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: void): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, _payload: void): void {
        const pmState: PMEditorState = ctx.pmState;

        insertColumnAfter(
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            }
        );
    }
};
