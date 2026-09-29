/**
 * Color picker module type definitions and shared interfaces.
 *
 * Mirrors the structure of {@link ./toolbar.types.ts} but covers the
 * font color and background color pickers, their shared options shape,
 * and the default palette.
 */

/**
 * Enumerates the color picker display modes supported by the
 * font color and background color pickers.
 *
 * - `Palette`: Renders a fixed swatch grid.
 * - `Picker`:  Renders an inline color picker only (no palette).
 */
export type ColorModeType = 'Palette' | 'Picker';

/**
 * Identifies which editor color picker triggered an event or is being
 * referenced in a payload.
 */
export type ColorPickerType = 'FontColor' | 'BackgroundColor';

/**
 * Default preset colors used by the font color picker when no custom
 * `preset` is supplied.
 *
 * @remarks
 * - The `FontColor` class clones this per-instance via the
 *   `preset` `@Property` decorator (see {@link FontColorModel.preset}).
 */
export const DEFAULT_FONTCOLOR_PRESETS: { [key: string]: string[] } = {
    'Custom': [
        '#000000', '#D3D3D3', '#DC2626', '#B8590D', '#8C7000', '#5B21B6', '#4D700F', '#1F7333', '#146B52', '#0D6666', '#0A6185', '#1A5499', '#2640A6', '#383399', '#612E9E', '#732494', '#941F6B', '#9E2447', '#992938', '#704724', '#7A612E', '#5C611F', '#404C61', '#4D4D4D', '#242947'
    ]
};

/**
 * Default preset colors used by the background color picker when no
 * custom `preset` is supplied.
 *
 * @remarks
 * - The `BackgroundColor` class clones this per-instance via the
 *   `preset` `@Property` decorator (see {@link BackgroundColorModel.preset}).
 */
export const DEFAULT_BGCOLOR_PRESETS: { [key: string]: string[] } = {
    'Custom': [
        '#000000', '#D3D3D3', '#FCE3E0', '#FFEDD4', '#EBF7D1', '#FFF7C7',
        '#DBF5E0', '#D6F5EB', '#D4F2F2', '#D4F0FA', '#DBEBFC', '#E0E5FC', '#E5E3FC', '#EDE0FC', '#F2E0FC', '#FAE0F2', '#FCE0E8', '#FCE0E3',
        '#F5EBDE', '#F7F2E0', '#F0F2DB', '#E5EBF0', '#EDEDED', '#E0E0E5', '#DEE0EB'

    ]
};
