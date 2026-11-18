import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { toggleMarkCommand, ToggleMarkPayload } from '../../../core/commands/builtins/formatting/toggle-mark';

const PAYLOAD: ToggleMarkPayload = { markType: 'underline' };

export const toggleUnderlineCommand: PMCommandInternal<void> = {
    name: 'toggleUnderline',
    meta: { label: 'Underline', category: 'formatting', shortcut: 'Mod-u' },

    canExecute(ctx: PMCommandContext): boolean {
        return toggleMarkCommand.canExecute?.(ctx, PAYLOAD) ?? false;
    },

    execute(ctx: PMCommandContext): void {
        toggleMarkCommand.execute(ctx, PAYLOAD);
    }
};
