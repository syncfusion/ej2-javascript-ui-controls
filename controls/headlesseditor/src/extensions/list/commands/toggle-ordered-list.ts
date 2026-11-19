import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { toggleListTypeCommand } from '../../list/commands/toggle-list-type';

export interface ToggleOrderedListPayload {
    /** When true, active marks are preserved on the new list item. */
    keepMarks?: boolean;
    /**
     * CSS `list-style-type` value for the ordered list container (e.g.
     * `'decimal'`, `'lower-alpha'`, `'upper-roman'`). When omitted,
     * `'decimal'` is used. When the selection is already inside an
     * orderedList using a different style, the list is updated to this
     * style instead of lifted.
     */
    listStyleType?: string;
}

export const toggleOrderedListCommand: PMCommandInternal<ToggleOrderedListPayload | void> = {
    name: 'toggleOrderedList',
    meta: { label: 'Ordered List', category: 'list' },
    canExecute(ctx: PMCommandContext, payload?: ToggleOrderedListPayload): boolean {
        return toggleListTypeCommand.canExecute?.(ctx, {
            listType: 'ordered',
            keepMarks: payload?.keepMarks,
            listStyleType: payload?.listStyleType
        }) ?? false;
    },
    execute(ctx: PMCommandContext, payload?: ToggleOrderedListPayload): void {
        toggleListTypeCommand.execute(ctx, {
            listType: 'ordered',
            keepMarks: payload?.keepMarks,
            listStyleType: payload?.listStyleType
        });
    }
};
