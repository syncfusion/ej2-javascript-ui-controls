import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setMarkCommand, applySetMarkInTransaction } from './set-mark';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMTransaction } from '../../../pm/pm-guard';

/**
 * Command for removing font color formatting from the selected text.
 *
 * Text color formatting is removed from the shared `textStyle` mark
 * while preserving other text style attributes such as font family,
 * font size, and background color.
 */
export const unsetColorCommand: PMCommandInternal<void> = {
    name: 'unsetColor',
    meta: { label: 'Unset Color', category: 'formatting' },

    canExecute(ctx: PMCommandContext): boolean {
        return setMarkCommand.canExecute?.(ctx, { markType: 'textStyle', attrs: { color: null } }) ?? false;
    },
    execute(ctx: PMCommandContext): void {
        const transaction: PMTransaction = applySetMarkInTransaction(ctx.pmState.tr, ctx.pmState, { markType: 'textStyle', attrs: { color: null } });
        ctx.dispatch(wrapTransaction(transaction));
    }
};
