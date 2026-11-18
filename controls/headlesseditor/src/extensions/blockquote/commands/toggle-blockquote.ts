/**
 * toggle-blockquote.ts — Public facade: toggle blockquote on selection.
 * Delegates to toggleBlockStructure with blockType='blockquote'.
 */
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { toggleBlockStructureCommand } from '../../../core/commands/builtins/structure/toggle-block-structure';

export const toggleBlockquoteCommand: PMCommandInternal<void> = {
    name: 'toggleBlockQuote',
    meta: { label: 'Blockquote', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        return toggleBlockStructureCommand.canExecute?.(ctx, { blockType: 'blockquote' }) ?? false;
    },

    execute(ctx: PMCommandContext): void {
        toggleBlockStructureCommand.execute(ctx, { blockType: 'blockquote' });
    }
};
