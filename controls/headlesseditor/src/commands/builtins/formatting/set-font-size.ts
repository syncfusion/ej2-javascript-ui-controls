import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setMarkCommand } from './set-mark';

/**
 * Payload for the `setFontSize` command.
 *
 */
export interface SetFontSizePayload {
    size: string;
}

/**
 * Command for applying a font size to the selected text.
 *
 * Font size formatting is stored using the shared `textStyle` mark,
 * enabling it to coexist with other text style attributes such as
 * font family, font color, and background color.
 */
export const setFontSizeCommand: PMCommandInternal<SetFontSizePayload> = {
    name: 'setFontSize',
    meta: { label: 'Font Size', category: 'formatting' },

    canExecute(ctx: PMCommandContext, payload: SetFontSizePayload): boolean {
        if (!isValidFontSizePayload(payload)) {
            return false;
        }
        return setMarkCommand.canExecute(ctx, { markType: 'textStyle', attrs: { fontSize: payload.size } });
    },
    execute(ctx: PMCommandContext, payload: SetFontSizePayload): void {
        setMarkCommand.execute(ctx, { markType: 'textStyle', attrs: { fontSize: payload.size } });
    }
};

/**
 * Validates the payload required by the `setFontSize` command.
 *
 * A valid payload must contain a non-empty font size value.
 *
 * @param {SetFontSizePayload | undefined} payload The payload to validate.
 * @returns {boolean} True if the payload contains a valid font size.
 */
function isValidFontSizePayload(payload: SetFontSizePayload | undefined): payload is SetFontSizePayload {
    return payload !== undefined && typeof payload.size === 'string' && payload.size.length > 0;
}
