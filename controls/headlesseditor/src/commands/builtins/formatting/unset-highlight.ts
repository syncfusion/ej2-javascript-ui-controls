import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setMarkCommand, applySetMarkInTransaction } from './set-mark';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMTransaction } from '../../../pm/pm-guard';

/**
 * Command for removing highlight (background color) formatting from the selected text.
 *
 * Highlight formatting is removed from the shared `textStyle` mark
 * while preserving other text style attributes such as font family,
 * font size, and text color.
 */
export const unsetHighlightCommand: PMCommandInternal<void> = {
    name: 'unsetHighlight',
    meta: { label: 'Unset Highlight', category: 'formatting' },

    canExecute(ctx: PMCommandContext): boolean {
        return setMarkCommand.canExecute?.(ctx, { markType: 'textStyle', attrs: { backgroundColor: null } }) ?? false;
    },
    execute(ctx: PMCommandContext): void {
        const transaction: PMTransaction = applySetMarkInTransaction(ctx.pmState.tr, ctx.pmState, { markType: 'textStyle', attrs: { backgroundColor: null } });
        ctx.dispatch(wrapTransaction(transaction));
    }
};
