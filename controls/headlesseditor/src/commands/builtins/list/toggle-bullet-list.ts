import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { toggleListTypeCommand } from './toggle-list-type';

export interface ToggleBulletListPayload {
    /** When true, active marks are preserved on the new list item. */
    keepMarks?: boolean;
}

export const toggleBulletListCommand: PMCommandInternal<ToggleBulletListPayload | void> = {
    name: 'toggleBulletList',
    meta: { label: 'Bullet List', category: 'list' },
    canExecute(ctx: PMCommandContext): boolean {
        return toggleListTypeCommand.canExecute?.(ctx, { listType: 'bullet' }) ?? false;
    },
    execute(ctx: PMCommandContext, payload?: ToggleBulletListPayload): void {
        toggleListTypeCommand.execute(ctx, { listType: 'bullet', keepMarks: payload?.keepMarks });
    }
};
