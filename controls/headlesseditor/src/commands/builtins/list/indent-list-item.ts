import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { sinkListItemCommand } from './sink-list-item';

export const indentListItemCommand: PMCommandInternal<void> = {
    name: 'indentListItem',
    meta: { label: 'Indent List Item', category: 'list' },
    canExecute(ctx: PMCommandContext): boolean {
        return sinkListItemCommand.canExecute?.(ctx, undefined) ?? true;
    },
    execute(ctx: PMCommandContext): void {
        sinkListItemCommand.execute(ctx, undefined);
    }
};
