/**
 * Theme / colour-scheme constants from DrawingML (`dml-main.xsd`).
 *
 * @remarks
 * Slot names are `ST_ColorSchemeIndex` enumerations. Do not invent alternate tokens.
 * DrawingML namespace is shared with shapes (`DML_NS`).
 */
import { DML_NS } from '../shapes/constants';
export { DML_NS };
/**
 * Twelve required colour-scheme slot local names (`ST_ColorSchemeIndex`
 * `CT_ColorScheme` child sequence in `dml-main.xsd`).
 */
export const COLOR_SCHEME_SLOTS: ReadonlyArray<string> = Object.freeze([
    'dk1',
    'lt1',
    'dk2',
    'lt2',
    'accent1',
    'accent2',
    'accent3',
    'accent4',
    'accent5',
    'accent6',
    'hlink',
    'folHlink'
]);
/**
 * One of the twelve `ST_ColorSchemeIndex` values on a theme colour scheme.
 *
 * @remarks
 * Source: Transitional `dml-main.xsd` `ST_ColorSchemeIndex`. Distinct from
 * {@link ColorMapKey} / `ST_SchemeColorVal` map keys (`bg1`, `tx1`, …) used by
 * `schemeClr` — those resolve through `clrMap` (TASK-1012).
 */
export type ColorSchemeIndex = (typeof COLOR_SCHEME_SLOTS)[number];
/**
 * Twelve required `CT_ColorMapping` attribute names (`dml-main.xsd`).
 *
 * @remarks
 * These are the **map keys** on `p:clrMap` / `a:overrideClrMapping`. Values of
 * those attributes are {@link ColorSchemeIndex} tokens into `a:clrScheme`.
 * Citation: Transitional `dml-main.xsd` `CT_ColorMapping` ~2306–2322.
 */
export const COLOR_MAP_KEYS: ReadonlyArray<string> = Object.freeze([
    'bg1',
    'tx1',
    'bg2',
    'tx2',
    'accent1',
    'accent2',
    'accent3',
    'accent4',
    'accent5',
    'accent6',
    'hlink',
    'folHlink'
]);
/**
 * One map-key token on `CT_ColorMapping` (subset of `ST_SchemeColorVal`).
 */
export type ColorMapKey = (typeof COLOR_MAP_KEYS)[number];
/**
 * `ST_SchemeColorVal` tokens accepted on `a:schemeClr/@val` (`dml-main.xsd`).
 *
 * @remarks
 * Includes map keys, scheme indices, and `phClr`. Citation: Transitional
 * `dml-main.xsd` `ST_SchemeColorVal` ~392–411.
 */
export const SCHEME_COLOR_VALS: ReadonlyArray<string> = Object.freeze([
    'bg1',
    'tx1',
    'bg2',
    'tx2',
    'accent1',
    'accent2',
    'accent3',
    'accent4',
    'accent5',
    'accent6',
    'hlink',
    'folHlink',
    'phClr',
    'dk1',
    'lt1',
    'dk2',
    'lt2'
]);
/** One `ST_SchemeColorVal` token. */
export type SchemeColorVal = (typeof SCHEME_COLOR_VALS)[number];
const COLOR_SCHEME_INDEX_SET: ReadonlySet<string> = new Set(COLOR_SCHEME_SLOTS);
const COLOR_MAP_KEY_SET: ReadonlySet<string> = new Set(COLOR_MAP_KEYS);
/**
 * Type guard: string is a {@link ColorSchemeIndex}.
 *
 * @param {string} value - Candidate token.
 * @returns {boolean} The result.
 */
export function isColorSchemeIndex(value: string): value is ColorSchemeIndex {
    return COLOR_SCHEME_INDEX_SET.has(value);
}
/**
 * Type guard: string is a {@link ColorMapKey}.
 *
 * @param {string} value - Candidate token.
 * @returns {boolean} The result.
 */
export function isColorMapKey(value: string): value is ColorMapKey {
    return COLOR_MAP_KEY_SET.has(value);
}
