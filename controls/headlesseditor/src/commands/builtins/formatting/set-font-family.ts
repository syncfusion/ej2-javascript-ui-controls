import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setMarkCommand } from './set-mark';

/**
 * Payload for the `setFontFamily` command.
 *
 */
export interface SetFontFamilyPayload {
    family: string;
}

/**
 * Command for applying a font family to the selected text.
 *
 * Font family formatting is stored using the shared `textStyle` mark,
 * enabling multiple text style attributes to coexist on the same text.
 */
export const setFontFamilyCommand: PMCommandInternal<SetFontFamilyPayload> = {
    name: 'setFontFamily',
    meta: { label: 'Font Family', category: 'formatting' },

    canExecute(ctx: PMCommandContext, payload: SetFontFamilyPayload): boolean {
        if (!isValidFontFamilyPayload(payload)) {
            return false;
        }
        return setMarkCommand.canExecute(ctx, { markType: 'textStyle', attrs: { fontFamily: payload.family } });
    },
    execute(ctx: PMCommandContext, payload: SetFontFamilyPayload): void {
        setMarkCommand.execute(ctx, { markType: 'textStyle', attrs: { fontFamily: payload.family } });
    }
};

/**
 * Validates the payload required by the `setFontFamily` command.
 *
 * A valid payload must contain a non-empty font family value.
 *
 * @param {SetFontFamilyPayload | undefined} payload The payload to validate.
 * @returns {boolean} True if the payload contains a valid font family.
 */
function isValidFontFamilyPayload(payload: SetFontFamilyPayload | undefined): payload is SetFontFamilyPayload {
    return payload !== undefined && typeof payload.family === 'string' && payload.family.length > 0;
}
