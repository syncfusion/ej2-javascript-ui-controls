import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { setMarkCommand } from '../../../core/commands/builtins/formatting/set-mark';

/**
 * Payload for the `setHighlight` command.
 *
 * Specifies the background color (highlight) to apply to selected text.
 * The color value is a CSS color that can be specified as hex, rgb, rgba, or named colors.
 *
 * @interface SetHighlightPayload
 *
 * @example
 * ```typescript
 * // Apply yellow highlight with hex color
 * editor.commands.setHighlight({ color: '#ffff00' });
 *
 * // Apply highlight with RGB color
 * editor.commands.setHighlight({ color: 'rgb(255, 255, 0)' });
 *
 * // Apply highlight with named color
 * editor.commands.setHighlight({ color: 'yellow' });
 * ```
 */
export interface SetHighlightPayload {
    /**
     * The CSS color value for the background highlight.
     *
     * Accepts hex colors (#RRGGBB), RGB/RGBA values (rgb(r, g, b) or rgba(r, g, b, a)),
     * HSL/HSLA values, or named CSS colors (yellow, blue, etc.).
     *
     * @type {string}
     * @example '#ffff00', 'rgb(255, 255, 0)', 'yellow'
     */
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
