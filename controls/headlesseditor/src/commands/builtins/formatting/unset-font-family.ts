import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setMarkCommand, applySetMarkInTransaction } from './set-mark';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMTransaction } from '../../../pm/pm-guard';

/**
 * Removes font family formatting from the current selection.
 */
export const unsetFontFamilyCommand: PMCommandInternal<void> = {
    name: 'unsetFontFamily',
    meta: { label: 'Unset Font Family', category: 'formatting' },

    canExecute(ctx: PMCommandContext): boolean {
        return setMarkCommand.canExecute(ctx, { markType: 'textStyle', attrs: { fontFamily: null } }) ?? false;
    },
    execute(ctx: PMCommandContext): void {
        const transaction: PMTransaction = applySetMarkInTransaction(ctx.pmState.tr, ctx.pmState, { markType: 'textStyle', attrs: { fontFamily: null } });
        ctx.dispatch(wrapTransaction(transaction));
    }
};
