import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { toggleMarkCommand, ToggleMarkPayload } from '../../../core/commands/builtins/formatting/toggle-mark';

const PAYLOAD: ToggleMarkPayload = { markType: 'code' };

export const toggleCodeMarkCommand: PMCommandInternal<void> = {
    name: 'toggleCodeMark',
    meta: { label: 'Inline Code', category: 'formatting', shortcut: 'Mod-`' },

    canExecute(ctx: PMCommandContext): boolean {
        return toggleMarkCommand.canExecute?.(ctx, PAYLOAD) ?? false;
    },

    execute(ctx: PMCommandContext): void {
        toggleMarkCommand.execute(ctx, PAYLOAD);
    }
};
