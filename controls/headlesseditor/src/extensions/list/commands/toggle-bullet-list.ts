import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { toggleListTypeCommand } from '../../list/commands/toggle-list-type';

export interface ToggleBulletListPayload {
    /** When true, active marks are preserved on the new list item. */
    keepMarks?: boolean;
    /**
     * CSS `list-style-type` value for the bullet list container (e.g.
     * `'disc'`, `'circle'`, `'square'`). When omitted, `'disc'` is used.
     * When the selection is already inside a bulletList using a different
     * style, the list is updated to this style instead of lifted.
     */
    listStyleType?: string;
}

export const toggleBulletListCommand: PMCommandInternal<ToggleBulletListPayload | void> = {
    name: 'toggleBulletList',
    meta: { label: 'Bullet List', category: 'list' },
    canExecute(ctx: PMCommandContext, payload?: ToggleBulletListPayload): boolean {
        return toggleListTypeCommand.canExecute?.(ctx, {
            listType: 'bullet',
            keepMarks: payload?.keepMarks,
            listStyleType: payload?.listStyleType
        }) ?? false;
    },
    execute(ctx: PMCommandContext, payload?: ToggleBulletListPayload): void {
        toggleListTypeCommand.execute(ctx, {
            listType: 'bullet',
            keepMarks: payload?.keepMarks,
            listStyleType: payload?.listStyleType
        });
    }
};
