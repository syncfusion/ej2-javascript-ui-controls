import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { toggleMarkCommand, ToggleMarkPayload } from './toggle-mark';

const PAYLOAD: ToggleMarkPayload = { markType: 'strikethrough' };

export const toggleStrikethroughCommand: PMCommandInternal<void> = {
    name: 'toggleStrikethrough',
    meta: { label: 'Strikethrough', category: 'formatting', shortcut: 'Mod-Shift-x' },

    canExecute(ctx: PMCommandContext): boolean {
        return toggleMarkCommand.canExecute?.(ctx, PAYLOAD) ?? false;
    },

    execute(ctx: PMCommandContext): void {
        toggleMarkCommand.execute(ctx, PAYLOAD);
    }
};
