import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setMarkCommand, applySetMarkInTransaction } from './set-mark';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMTransaction } from '../../../pm/pm-guard';

/**
 * Command for removing font size formatting from the selected text.
 *
 * Font size formatting is removed from the shared `textStyle` mark
 * while preserving other text style attributes such as font family,
 * font color, and background color.
 */
export const unsetFontSizeCommand: PMCommandInternal<void> = {
    name: 'unsetFontSize',
    meta: { label: 'Unset Font Size', category: 'formatting' },

    canExecute(ctx: PMCommandContext): boolean {
        return setMarkCommand.canExecute?.(ctx, { markType: 'textStyle', attrs: { fontSize: null } }) ?? false;
    },
    execute(ctx: PMCommandContext): void {
        const transaction: PMTransaction = applySetMarkInTransaction(ctx.pmState.tr, ctx.pmState, { markType: 'textStyle', attrs: { fontSize: null } });
        ctx.dispatch(wrapTransaction(transaction));
    }
};
