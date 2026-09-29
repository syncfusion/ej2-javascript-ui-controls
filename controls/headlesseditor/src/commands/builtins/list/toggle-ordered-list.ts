import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { toggleListTypeCommand } from './toggle-list-type';

export interface ToggleOrderedListPayload {
    /** When true, active marks are preserved on the new list item. */
    keepMarks?: boolean;
}

export const toggleOrderedListCommand: PMCommandInternal<ToggleOrderedListPayload | void> = {
    name: 'toggleOrderedList',
    meta: { label: 'Ordered List', category: 'list' },
    canExecute(ctx: PMCommandContext): boolean {
        return toggleListTypeCommand.canExecute?.(ctx, { listType: 'ordered' }) ?? false;
    },
    execute(ctx: PMCommandContext, payload?: ToggleOrderedListPayload): void {
        toggleListTypeCommand.execute(ctx, { listType: 'ordered', keepMarks: payload?.keepMarks });
    }
};
