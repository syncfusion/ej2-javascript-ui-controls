/**
 * clear-formatting.ts — Public facade: remove all inline marks from selection.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMMarkType, PMTransaction } from '../../../pm/pm-guard';

export const clearFormattingCommand: PMCommandInternal<void> = {
    name: 'clearFormatting',
    meta: { label: 'Clear Formatting', category: 'formatting' },

    canExecute(ctx: PMCommandContext): boolean {
        return !ctx.pmState.selection.empty;
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const { from, to } = pmState.selection;
        if (from === to) {
            return;
        }
        let transaction: PMTransaction = pmState.tr;
        for (const markName of Object.keys(pmState.schema.marks)) {
            const markType: PMMarkType | undefined = pmState.schema.marks[markName as string];
            if (!markType) {
                continue;
            }
            transaction = transaction.removeMark(from, to, markType);
        }
        ctx.dispatch(wrapTransaction(transaction));
    }
};
