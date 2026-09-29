import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { toggleListTypeCommand } from './toggle-list-type';

export const toggleTaskListCommand: PMCommandInternal<void> = {
    name: 'toggleTaskList',
    meta: { label: 'Task List', category: 'list' },
    canExecute(ctx: PMCommandContext): boolean {
        return toggleListTypeCommand.canExecute?.(ctx, { listType: 'task' }) ?? false;
    },
    execute(ctx: PMCommandContext): void { toggleListTypeCommand.execute(ctx, { listType: 'task' }); }
};
