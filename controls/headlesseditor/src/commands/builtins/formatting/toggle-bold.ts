/**
 * toggle-bold.ts — Public facade: toggle bold mark on selection.
 * Delegates to internal `toggleMark` command.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { toggleMarkCommand, ToggleMarkPayload } from './toggle-mark';

const PAYLOAD: ToggleMarkPayload = { markType: 'bold' };

export const toggleBoldCommand: PMCommandInternal<void> = {
    name: 'toggleBold',
    meta: { label: 'Bold', category: 'formatting', shortcut: 'Mod-b' },

    canExecute(ctx: PMCommandContext): boolean {
        return toggleMarkCommand.canExecute?.(ctx, PAYLOAD) ?? false;
    },

    execute(ctx: PMCommandContext): void {
        toggleMarkCommand.execute(ctx, PAYLOAD);
    }
};
