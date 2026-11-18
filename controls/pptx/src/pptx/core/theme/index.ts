/**
 * Theme part load and colour-scheme / colour-map resolve (core).
 *
 * @packageDocumentation
 */
export { COLOR_MAP_KEYS, COLOR_SCHEME_SLOTS, DML_NS, SCHEME_COLOR_VALS, isColorMapKey, isColorSchemeIndex,
    ColorMapKey, ColorSchemeIndex, SchemeColorVal } from './constants';
export { ColorMapping } from './color-mapping';
export { ColorScheme } from './color-scheme';
export { ColorValue, HslColorValue, PrstColorValue, SchemeColorValue, ScrgbColorValue, SrgbColorValue,
    SysColorValue } from './color-value';
export { loadMasterColorMap, parseColorMapping, parseSlideColorMapOverride, SlideColorMapOverride } from './load-color-map';
export { loadThemePart } from './load-theme';
export { effectiveColorMap, resolveColor, resolveSchemeColor, EffectiveColorContext } from './resolve-color';
export { ResolvedColor, ResolvedDirectColor, ResolvedSrgbColor, UnresolvedColor, UnresolvedColorReason } from './resolved-color';
export { ThemePart } from './theme-part';
export { ThemeColorTransform, ThemeEffectStyle, ThemeFillStyle, ThemeFontCollection, ThemeFontScheme, ThemeFormatScheme,
    ThemeGradientFillToRect, ThemeGradientPath, ThemeGradientStop, ThemeLineStyle, ThemeSupplementalFont,
    ThemeTypeface } from './theme-render-model';

export { ThemeGradientMatrix } from './theme-matrix-editor';
