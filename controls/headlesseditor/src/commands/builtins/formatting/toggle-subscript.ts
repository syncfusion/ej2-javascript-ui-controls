/**
 * toggle-subscript.ts — Public facade: toggle subscript mark on selection.
 * Delegates to internal `toggleMark` command.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { toggleMarkCommand, ToggleMarkPayload } from './toggle-mark';

const PAYLOAD: ToggleMarkPayload = { markType: 'subscript' };

export const toggleSubscriptCommand: PMCommandInternal<void> = {
    name: 'toggleSubscript',
    meta: { label: 'Subscript', category: 'formatting', shortcut: 'Mod-Shift-,' },

    canExecute(ctx: PMCommandContext): boolean {
        return toggleMarkCommand.canExecute?.(ctx, PAYLOAD) ?? false;
    },

    execute(ctx: PMCommandContext): void {
        toggleMarkCommand.execute(ctx, PAYLOAD);
    }
};
