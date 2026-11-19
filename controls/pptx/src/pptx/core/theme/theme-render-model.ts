/** Typed, read-only theme font and format-scheme data for rendering. */
import { arrayAt } from '../util/es5-compat';
import { findChild, getAttr } from '../shapes/dom-utils';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { ColorValue } from './color-value';
import { DML_NS } from './constants';
import { tryParseColorChoiceChild } from './parse-color-choice';
import { readAuthoredGradient, projectAuthoredGradient } from './read-gradient';
import { AuthoredGradientFill } from './gradient-types';

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
export type ThemeGradientPath = 'circle' | 'rect' | 'shape';

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
export type ThemeFillStyle =
    { readonly kind: 'noFill'; } |
    { readonly kind: 'solid'; readonly color: ColorValue | undefined; readonly colorTransforms: ReadonlyArray<ThemeColorTransform>; } |
    { readonly kind: 'gradient'; readonly stops: ReadonlyArray<ThemeGradientStop>; readonly angle: number | undefined;
        readonly path: ThemeGradientPath | undefined; readonly fillToRect: ThemeGradientFillToRect | undefined; } |
    { readonly kind: 'picture'; } |
    { readonly kind: 'pattern'; readonly preset: string | undefined; } |
    { readonly kind: 'group'; } |
    { readonly kind: 'unknown'; readonly elementName: string; };

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
export function parseThemeFontScheme(element: OoxmlElement | undefined): ThemeFontScheme {
    return {
        name: element === undefined ? undefined : getAttr(element, '', 'name'),
        major: readThemeFontCollection(element === undefined ? undefined : findChild(element, DML_NS, 'majorFont')),
        minor: readThemeFontCollection(element === undefined ? undefined : findChild(element, DML_NS, 'minorFont'))
    };
}

/**
 * Parse the theme format scheme into immutable render values.
 *
 * @internal
 * @param {OoxmlElement | undefined} element - Format-scheme element.
 * @returns {ThemeFormatScheme} Immutable format render model.
 */
export function parseThemeFormatScheme(element: OoxmlElement | undefined): ThemeFormatScheme {
    return {
        name: element === undefined ? undefined : getAttr(element, '', 'name'),
        fillStyles: parseFillList(element, 'fillStyleLst'),
        lineStyles: parseLineList(element),
        effectStyles: parseEffectList(element),
        backgroundFillStyles: parseFillList(element, 'bgFillStyleLst')
    };
}

function emptyTypeface(): ThemeTypeface {
    return { typeface: '', panose: undefined, pitchFamily: undefined, charset: undefined };
}

function parseTypeface(element: OoxmlElement | undefined): ThemeTypeface {
    if (element === undefined) {
        return emptyTypeface();
    }
    return {
        typeface: getAttr(element, '', 'typeface') || '',
        panose: getAttr(element, '', 'panose'),
        pitchFamily: getAttr(element, '', 'pitchFamily'),
        charset: getAttr(element, '', 'charset')
    };
}

/**
 * Reads an existing themeable font collection without resolving or mutating typefaces.
 * @param {OoxmlElement} element - Actual font collection owner, or absent.
 * @returns {ThemeFontCollection} Shared direct typeface and supplemental-font snapshot.
 * @internal
 */
export function readThemeFontCollection(element: OoxmlElement | undefined): ThemeFontCollection {
    const supplementalFonts: ThemeSupplementalFont[] = [];
    if (element !== undefined) {
        for (let i: number = 0; i < element.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(element.children, i);
            if (child.kind !== 'element' || child.namespaceUri !== element.namespaceUri || child.localName !== 'font') {
                continue;
            }
            const script: string = getAttr(child, '', 'script');
            const typeface: string = getAttr(child, '', 'typeface');
            if (script !== undefined && typeface !== undefined) {
                supplementalFonts.push({ script, typeface });
            }
        }
    }
    return {
        latin: parseTypeface(element === undefined ? undefined : findChild(element, DML_NS, 'latin')),
        eastAsian: parseTypeface(element === undefined ? undefined : findChild(element, DML_NS, 'ea')),
        complexScript: parseTypeface(element === undefined ? undefined : findChild(element, DML_NS, 'cs')),
        supplementalFonts
    };
}

function elementChildren(parent: OoxmlElement | undefined): OoxmlElement[] {
    if (parent === undefined) {
        return [];
    }
    const result: OoxmlElement[] = [];
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === DML_NS) {
            result.push(child);
        }
    }
    return result;
}

function parseFillList(format: OoxmlElement | undefined, localName: string): ThemeFillStyle[] {
    const list: OoxmlElement = format === undefined ? undefined : findChild(format, DML_NS, localName);
    return elementChildren(list).map(parseThemeFillStyle);
}

/**
 * Parse one DrawingML fill-property element.
 *
 * @internal
 * @param {OoxmlElement} element - Fill-property element.
 * @returns {ThemeFillStyle} Typed fill render model.
 */
export function parseThemeFillStyle(element: OoxmlElement): ThemeFillStyle {
    switch (element.localName) {
    case 'noFill': return { kind: 'noFill' };
    case 'solidFill': return {
        kind: 'solid',
        color: tryParseColorChoiceChild(element),
        colorTransforms: readColorTransforms(element)
    };
    case 'gradFill': {
        const authored: AuthoredGradientFill | undefined = readAuthoredGradient(element);
        return authored === undefined ? { kind: 'unknown', elementName: element.localName } : projectAuthoredGradient(authored);
    }
    case 'blipFill': return { kind: 'picture' };
    case 'pattFill': return { kind: 'pattern', preset: getAttr(element, '', 'prst') };
    case 'grpFill': return { kind: 'group' };
    default: return { kind: 'unknown', elementName: element.localName };
    }
}

/**
 * Read transforms beneath the first colour-choice child.
 *
 * @internal
 * @param {OoxmlElement} parent - Colour-bearing parent element.
 * @returns {ThemeColorTransform[]} Authored transforms in application order.
 */
export function readColorTransforms(parent: OoxmlElement): ThemeColorTransform[] {
    const colorChoice: OoxmlElement = elementChildren(parent).find((child: OoxmlElement) =>
        child.localName === 'srgbClr' || child.localName === 'scrgbClr' || child.localName === 'hslClr' ||
        child.localName === 'sysClr' || child.localName === 'schemeClr' || child.localName === 'prstClr');
    if (colorChoice === undefined) {
        return [];
    }
    return elementChildren(colorChoice).map((transform: OoxmlElement) => {
        const raw: string = getAttr(transform, '', 'val');
        const numeric: number = raw === undefined ? NaN : Number(raw);
        return { kind: transform.localName, value: Number.isFinite(numeric) ? numeric : undefined };
    });
}

function parseLineList(format: OoxmlElement | undefined): ThemeLineStyle[] {
    const list: OoxmlElement = format === undefined ? undefined : findChild(format, DML_NS, 'lnStyleLst');
    return elementChildren(list).filter((entry: OoxmlElement) => entry.localName === 'ln').map((line: OoxmlElement) => {
        const fillElement: OoxmlElement = elementChildren(line).find((child: OoxmlElement) =>
            child.localName === 'noFill' || child.localName === 'solidFill' || child.localName === 'gradFill' ||
            child.localName === 'pattFill' || child.localName === 'grpFill' || child.localName === 'blipFill');
        const widthRaw: string = getAttr(line, '', 'w');
        const widthEmu: number = widthRaw === undefined ? NaN : Number(widthRaw);
        const dash: OoxmlElement = findChild(line, DML_NS, 'prstDash');
        return {
            width: Number.isFinite(widthEmu) ? widthEmu / 12700 : undefined,
            cap: getAttr(line, '', 'cap'),
            compound: getAttr(line, '', 'cmpd'),
            alignment: getAttr(line, '', 'algn'),
            dash: dash === undefined ? undefined : getAttr(dash, '', 'val'),
            fill: fillElement === undefined ? { kind: 'unknown' as 'unknown', elementName: 'missing' } : parseThemeFillStyle(fillElement)
        };
    });
}

function parseEffectList(format: OoxmlElement | undefined): ThemeEffectStyle[] {
    const list: OoxmlElement = format === undefined ? undefined : findChild(format, DML_NS, 'effectStyleLst');
    return elementChildren(list).filter((entry: OoxmlElement) => entry.localName === 'effectStyle').map((entry: OoxmlElement) => {
        const effectList: OoxmlElement = findChild(entry, DML_NS, 'effectLst');
        const effectDag: OoxmlElement = findChild(entry, DML_NS, 'effectDag');
        if (effectList !== undefined) {
            return { kind: 'list' as 'list', hasEffects: elementChildren(effectList).length > 0 };
        }
        if (effectDag !== undefined) {
            return { kind: 'dag' as 'dag', hasEffects: elementChildren(effectDag).length > 0 };
        }
        return { kind: 'unknown' as 'unknown', hasEffects: false };
    });
}
