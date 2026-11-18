import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { setMarkCommand } from '../../../core/commands/builtins/formatting/set-mark';

/**
 * Payload for the `setColor` command.
 *
 * Applies a color to the currently selected text or applies color to the editor's active text style mark.
 *
 * @example
 * ```typescript
 * // Apply red color to selection
 * editor.commands.setColor({ color: '#FF0000' });
 *
 * // Apply named color
 * editor.commands.setColor({ color: 'rgb(255, 0, 0)' });
 * ```
 */
export interface SetColorPayload {
    /** Hex, RGB, or named CSS color string. */
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
