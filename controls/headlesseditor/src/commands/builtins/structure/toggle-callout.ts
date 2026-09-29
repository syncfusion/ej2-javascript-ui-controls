/**
 * Public facade: toggle callout block on selection.
 * Delegates to toggleBlockStructure with blockType='callout'.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { toggleBlockStructureCommand } from './toggle-block-structure';

export interface ToggleCalloutPayload {
    variant?: string;
}

export const toggleCalloutCommand: PMCommandInternal<ToggleCalloutPayload> = {
    name: 'toggleCallout',
    meta: { label: 'Callout', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: ToggleCalloutPayload): boolean {
        return toggleBlockStructureCommand.canExecute?.(ctx, {
            blockType: 'callout',
            attrs: { variant: payload?.variant ?? 'info' }
        }) ?? false;
    },

    execute(ctx: PMCommandContext, payload: ToggleCalloutPayload): void {
        toggleBlockStructureCommand.execute(ctx, {
            blockType: 'callout',
            attrs: { variant: payload?.variant ?? 'info' }
        });
    }
};
