import { OoxmlElement } from '../xml/dom';
import { ColorValue } from './color-value';
/** One authored theme typeface record. */
export interface ThemeTypeface {
    /** Font family name. Empty means the producer left this script unspecified. */
    readonly typeface: string;
    /** Optional PANOSE classification authored by the producer. */
    readonly panose: string | undefined;
    /** Optional Windows pitch/family byte as authored. */
    readonly pitchFamily: string | undefined;
    /** Optional character-set byte as authored. */
    readonly charset: string | undefined;
}
/** Supplemental font mapping for one Unicode script tag. */
export interface ThemeSupplementalFont {
    /** Unicode script tag, for example `Jpan` or `Arab`. */
    readonly script: string;
    /** Typeface used for the script. */
    readonly typeface: string;
}
/** Major or minor theme font collection. */
export interface ThemeFontCollection {
    /** Latin-script default. */
    readonly latin: ThemeTypeface;
    /** East-Asian default. */
    readonly eastAsian: ThemeTypeface;
    /** Complex-script default. */
    readonly complexScript: ThemeTypeface;
    /** Per-script fallback records in authored order. */
    readonly supplementalFonts: ReadonlyArray<ThemeSupplementalFont>;
}
/** Authored major/minor font scheme. */
export interface ThemeFontScheme {
    /** Scheme display name. */
    readonly name: string | undefined;
    /** Heading/theme-major fonts. */
    readonly major: ThemeFontCollection;
    /** Body/theme-minor fonts. */
    readonly minor: ThemeFontCollection;
}
/** One direct gradient stop. Position is normalized to `0..1`. */
export interface ThemeGradientStop {
    /** Stop position normalized from DrawingML percentage units. */
    readonly position: number;
    /** Authored colour reference/value. */
    readonly color: ColorValue | undefined;
    /** Authored colour transforms in application order. */
    readonly colorTransforms: ReadonlyArray<ThemeColorTransform>;
}
/** Authored DrawingML path-gradient shape. */
export declare type ThemeGradientPath = 'circle' | 'rect' | 'shape';
/** Authored rectangle offset ratios; negative outsets and values above one are legal. */
export interface ThemeGradientFillToRect {
    /** Distance from the left edge. */
    readonly left: number | undefined;
    /** Distance from the top edge. */
    readonly top: number | undefined;
    /** Distance from the right edge. */
    readonly right: number | undefined;
    /** Distance from the bottom edge. */
    readonly bottom: number | undefined;
}
/** One DrawingML colour transform retained for render-time application. */
export interface ThemeColorTransform {
    /** Transform name, for example `tint`, `shade`, `lumMod`, or `alpha`. */
    readonly kind: string;
    /** Authored numeric value; undefined for valueless transforms. */
    readonly value: number | undefined;
}
/** A renderable fill entry from the theme format matrix. */
export declare type ThemeFillStyle = {
    readonly kind: 'noFill';
} | {
    readonly kind: 'solid';
    readonly color: ColorValue | undefined;
    readonly colorTransforms: ReadonlyArray<ThemeColorTransform>;
} | {
    readonly kind: 'gradient';
    readonly stops: ReadonlyArray<ThemeGradientStop>;
    readonly angle: number | undefined;
    readonly path: ThemeGradientPath | undefined;
    readonly fillToRect: ThemeGradientFillToRect | undefined;
} | {
    readonly kind: 'picture';
} | {
    readonly kind: 'pattern';
    readonly preset: string | undefined;
} | {
    readonly kind: 'group';
} | {
    readonly kind: 'unknown';
    readonly elementName: string;
};
/** One line-style matrix entry. Dimensions use presentation points. */
export interface ThemeLineStyle {
    /** Line width in points. */
    readonly width: number | undefined;
    /** Authored cap token. */
    readonly cap: string | undefined;
    /** Authored compound-line token. */
    readonly compound: string | undefined;
    /** Authored line alignment token. */
    readonly alignment: string | undefined;
    /** Preset dash token. */
    readonly dash: string | undefined;
    /** Direct line fill. */
    readonly fill: ThemeFillStyle;
}
/** One effect-style matrix entry. Effects remain preserve-only but presence is typed. */
export interface ThemeEffectStyle {
    /** Whether the entry uses a flat effect list or effect DAG. */
    readonly kind: 'list' | 'dag' | 'unknown';
    /** True when the container has at least one authored effect. */
    readonly hasEffects: boolean;
}
/** Authored DrawingML format scheme. */
export interface ThemeFormatScheme {
    /** Scheme display name. */
    readonly name: string | undefined;
    /** Shape fill matrix entries in authored order. */
    readonly fillStyles: ReadonlyArray<ThemeFillStyle>;
    /** Shape line matrix entries in authored order. */
    readonly lineStyles: ReadonlyArray<ThemeLineStyle>;
    /** Effect matrix entries in authored order. */
    readonly effectStyles: ReadonlyArray<ThemeEffectStyle>;
    /** Slide/background fill matrix entries in authored order. */
    readonly backgroundFillStyles: ReadonlyArray<ThemeFillStyle>;
}
/**
 * Parse the theme font scheme without mutating retained XML.
 *
 * @internal
 * @param {OoxmlElement | undefined} element - Font-scheme element.
 * @returns {ThemeFontScheme} Immutable font render model.
 */
export declare function parseThemeFontScheme(element: OoxmlElement | undefined): ThemeFontScheme;
/**
 * Parse the theme format scheme into immutable render values.
 *
 * @internal
 * @param {OoxmlElement | undefined} element - Format-scheme element.
 * @returns {ThemeFormatScheme} Immutable format render model.
 */
export declare function parseThemeFormatScheme(element: OoxmlElement | undefined): ThemeFormatScheme;
/**
 * Reads an existing themeable font collection without resolving or mutating typefaces.
 * @param {OoxmlElement} element - Actual font collection owner, or absent.
 * @returns {ThemeFontCollection} Shared direct typeface and supplemental-font snapshot.
 * @internal
 */
export declare function readThemeFontCollection(element: OoxmlElement | undefined): ThemeFontCollection;
/**
 * Parse one DrawingML fill-property element.
 *
 * @internal
 * @param {OoxmlElement} element - Fill-property element.
 * @returns {ThemeFillStyle} Typed fill render model.
 */
export declare function parseThemeFillStyle(element: OoxmlElement): ThemeFillStyle;
/**
 * Read transforms beneath the first colour-choice child.
 *
 * @internal
 * @param {OoxmlElement} parent - Colour-bearing parent element.
 * @returns {ThemeColorTransform[]} Authored transforms in application order.
 */
export declare function readColorTransforms(parent: OoxmlElement): ThemeColorTransform[];
