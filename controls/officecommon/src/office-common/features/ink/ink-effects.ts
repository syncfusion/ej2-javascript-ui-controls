/**
 * Effect → characteristic color mapping used when serializing ink brushes.
 *
 * Values are cited from the approved cross-repo ink specification
 * (`ej2-docx/docs/specs/ink-dom-parse-serialize.md`, Internal semantic model —
 * Effects → color), cross-checked against [MS-ODRAWXML] ink effect tokens.
 *
 * `'none'` and `'pencil'` do not override stroke color.
 */

import { ownValue } from '../../core/own-value';
import { InkEffectType } from './ink-model';

/**
 * Characteristic colors for non-default ink visual effects.
 *
 * | Effect | Color | Notes |
 * |---|---|---|
 * | bronze | `#BB5B18` | cited characteristic color |
 * | silver | `#B4C3DA` | cited characteristic color |
 * | gold | `#CC912C` | cited characteristic color |
 * | roseGold | `#EEB3A6` | cited characteristic color |
 * | ocean | `#0B868D` | cited characteristic color |
 * | lava | `#DA0C07` | cited characteristic color |
 * | rainbow | `#FF4E00` | cited characteristic color |
 * | galaxy | `#AE198D` | cited characteristic color |
 *
 * @public
 */
export const INK_EFFECT_COLORS: Readonly<
Partial<Record<InkEffectType, string>>
> = Object.freeze({
    bronze: '#BB5B18',
    silver: '#B4C3DA',
    gold: '#CC912C',
    roseGold: '#EEB3A6',
    ocean: '#0B868D',
    lava: '#DA0C07',
    rainbow: '#FF4E00',
    galaxy: '#AE198D'
});

/**
 * Resolve the characteristic color for an effect, if any.
 *
 * Returns `undefined` for `'none'` / `'pencil'` (no color override).
 *
 * @param {InkEffectType} effect - The effect.
 * @returns {string | undefined} The result.
 * @public
 */
export function inkEffectColor(effect: InkEffectType): string | undefined {
    return ownValue<string>(INK_EFFECT_COLORS, effect);
}
