import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setMarkCommand } from './set-mark';

/**
 * Payload for the `setHighlight` command.
 *
 */
export interface SetHighlightPayload {
    color: string;
}

/**
 * Command for applying a highlight (background color) to the selected text.
 *
 * Highlight formatting is stored using the shared `textStyle` mark,
 * enabling it to coexist with other text style attributes such as
 * font family, font size, and text color.
 */
export const setHighlightCommand: PMCommandInternal<SetHighlightPayload> = {
    name: 'setHighlight',
    meta: { label: 'Highlight', category: 'formatting' },

    canExecute(ctx: PMCommandContext, payload: SetHighlightPayload): boolean {
        if (!isValidHighlightPayload(payload)) {
            return false;
        }
        return setMarkCommand.canExecute(ctx, { markType: 'textStyle', attrs: { backgroundColor: payload.color } });
    },
    execute(ctx: PMCommandContext, payload: SetHighlightPayload): void {
        setMarkCommand.execute(ctx, { markType: 'textStyle', attrs: { backgroundColor: payload.color } });
    }
};

/**
 * Validates the payload required by the `setHighlight` command.
 *
 * A valid payload must contain a non-empty color value.
 *
 * @param {SetHighlightPayload | undefined} payload The payload to validate.
 * @returns {boolean} True if the payload contains a valid color.
 */
function isValidHighlightPayload(payload: SetHighlightPayload | undefined): payload is SetHighlightPayload {
    return payload !== undefined && typeof payload.color === 'string' && payload.color.length > 0;
}
