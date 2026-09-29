import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setMarkCommand } from './set-mark';

/**
 * Payload for the `setColor` command.
 *
 */
export interface SetColorPayload {
    color: string;
}

/**
 * Command for applying a text color to the selected text.
 *
 * Text color formatting is stored using the shared `textStyle` mark,
 * enabling it to coexist with other text style attributes such as
 * font family, font size, and background color.
 */
export const setColorCommand: PMCommandInternal<SetColorPayload> = {
    name: 'setColor',
    meta: { label: 'Text Color', category: 'formatting' },

    canExecute(ctx: PMCommandContext, payload: SetColorPayload): boolean {
        if (!isValidColorPayload(payload)) {
            return false;
        }
        return setMarkCommand.canExecute(ctx, { markType: 'textStyle', attrs: { color: payload.color } });
    },

    execute(ctx: PMCommandContext, payload: SetColorPayload): void {
        setMarkCommand.execute(ctx, { markType: 'textStyle', attrs: { color: payload.color } });
    }
};

/**
 * Validates the payload required by the `setColor` command.
 *
 * A valid payload must contain a non-empty color value.
 *
 * @param {SetColorPayload | undefined} payload The payload to validate.
 * @returns {boolean} True if the payload contains a valid color.
 */
function isValidColorPayload(payload: SetColorPayload | undefined): payload is SetColorPayload {
    return payload !== undefined && typeof payload.color === 'string' && payload.color.length > 0;
}
