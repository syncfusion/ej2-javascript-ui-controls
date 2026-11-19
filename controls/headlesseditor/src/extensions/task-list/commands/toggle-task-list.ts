/**
 * toggle-task-list.ts — Public `toggleTaskList` command.
 *
 * Delegates to the internal `toggleListType` infrastructure command with
 * `listType: 'task'`. Accepts an optional `checked` state applied to the
 * task items created when toggling into a task list.
 */
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { toggleListTypeCommand } from '../../list/commands/toggle-list-type';

export interface ToggleTaskListPayload {
    /** When true, active marks are preserved on the new task item. */
    keepMarks?: boolean;
    /**
     * Checked state applied to the task items created when toggling into a
     * task list. When omitted, the existing default behavior (unchecked on
     * wrap, preserved on conversion) is unchanged.
     */
    checked?: boolean;
}

export const toggleTaskListCommand: PMCommandInternal<ToggleTaskListPayload | void> = {
    name: 'toggleTaskList',
    meta: { label: 'Task List', category: 'list' },
    canExecute(ctx: PMCommandContext, payload?: ToggleTaskListPayload): boolean {
        return toggleListTypeCommand.canExecute?.(ctx, {
            listType: 'task',
            keepMarks: payload?.keepMarks,
            checked: payload?.checked
        }) ?? false;
    },
    execute(ctx: PMCommandContext, payload?: ToggleTaskListPayload): void {
        toggleListTypeCommand.execute(ctx, {
            listType: 'task',
            keepMarks: payload?.keepMarks,
            checked: payload?.checked
        });
    }
};
