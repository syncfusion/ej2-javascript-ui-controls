import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { liftListItemCommand } from './lift-list-item';

export const outdentListItemCommand: PMCommandInternal<void> = {
    name: 'outdentListItem',
    meta: { label: 'Outdent List Item', category: 'list' },
    canExecute(ctx: PMCommandContext): boolean {
        return liftListItemCommand.canExecute?.(ctx, undefined) ?? true;
    },
    execute(ctx: PMCommandContext): void {
        liftListItemCommand.execute(ctx, undefined);
    }
};
