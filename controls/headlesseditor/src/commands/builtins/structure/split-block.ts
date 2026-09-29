/**
 * split-block.ts — Internal infrastructure command: split the block at the
 * current selection, creating a new sibling block of the same type (or the
 * schema's default block type when none matches).
 *
 * Preserves active inline formatting explicitly while splitting the block
 * so marks like bold and italic continue after Enter.
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmSplitBlockKeepMarks, PMTransaction } from '../../../pm/pm-guard';

export const splitBlockCommand: PMCommandInternal<void> = {
    name: 'splitBlock',
    meta: { label: 'Split Block', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        return pmSplitBlockKeepMarks(ctx.pmState);
    },

    execute(ctx: PMCommandContext): void {
        pmSplitBlockKeepMarks(ctx.pmState, (tr: PMTransaction): void => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
