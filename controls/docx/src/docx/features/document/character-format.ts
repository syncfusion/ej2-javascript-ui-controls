/**
 * Character formatting for a run (`w:rPr`).
 *
 * Sole public surface for run properties. Owned by {@link Run}; never null once
 * accessed via {@link Run.characterFormat}.
 *
 * Citation: ECMA-376-1 §17.3.2; the format specification Rev 2.
 *
 * @public
 */
import { OpenXmlElement } from '../../core/xml/index';
import { parseOnOff, serializeOnOff } from './on-off';
import {
    HalfPoints,
    halfPoints,
    halfPointsToPoint,
    lengthToHalfPoints,
    pointToTwips,
    twipsToPoint
} from './length';
import {
    elementChildren,
    isWml,
    wValAttribute,
    wmlAttr,
    wmlElement
} from './wml';
import {
    Color,
    colorFromWire,
    colorToHexWire,
    colorToHighlightWire,
    highlightWireToColor
} from './color';
import { LocaleIDs, localeIdFromBcp47, localeIdToBcp47 } from './locale-ids';
import { SubSuperScript, subSuperScriptFromWire, subSuperScriptToWire } from './sub-super-script';
import {
    UnderlineStyle,
    underlineStyleFromWire,
    underlineStyleToWire
} from './underline-style';
import { OpenXmlAttribute } from '../../core/xml/model';

export { SubSuperScript } from './sub-super-script';

// ---------------------------------------------------------------------------
// Public unions and kept value types
// ---------------------------------------------------------------------------

/**
 * Emphasis mark.
 *
 * @public
 */
export type EmphasisMarkValue = 'none' | 'dot' | 'comma' | 'circle' | 'underDot';

/**
 * Animated text effect.
 *
 * @public
 */
export type TextEffectValue =
  | 'none'
  | 'blinkBackground'
  | 'lights'
  | 'antsBlack'
  | 'antsRed'
  | 'shimmer'
  | 'sparkle'
  | 'movie';

/**
 * Run character border (`w:bdr`). §17.3.2.5
 *  Internal run-border record. Not part of the public API.
 *
 * @private
 */
export interface RunBorderEdge {
    /** `@w:val` — border style (`ST_Border`). */
    readonly style: string;
    /** `@w:color` — hex color or `'auto'`. */
    readonly color?: string;
    /** `@w:sz` — border width in eighths-of-a-point. */
    readonly size?: number;
    /** `@w:space` — space from text in points. */
    readonly space?: number;
}

/**
 * Run language wire record (`w:lang`). §17.3.2.20
 *
 * Internal / snapshot only. Public API uses {@link LocaleIDs} via
 * `localeId` / `localeIdBidi` / `localeIdFarEast`.
 *
 * @private
 */
export interface RunLanguage {
    /** `@w:val` — BCP 47 language tag for Latin text. */
    readonly latin?: string;
    /** `@w:bidi` — BCP 47 language tag for bidirectional text. */
    readonly bidi?: string;
    /** `@w:eastAsia` — BCP 47 language tag for East Asian text. */
    readonly eastAsia?: string;
}

/**
 * Batch-assign delta for {@link CharacterFormat.assign}.
 *
 * @public
 */
export interface CharacterFormatDelta {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    doubleStrikethrough?: boolean;
    allCaps?: boolean;
    smallCaps?: boolean;
    hidden?: boolean;
    emboss?: boolean;
    engrave?: boolean;
    outline?: boolean;
    shadow?: boolean;
    noProof?: boolean;
    webHidden?: boolean;
    fontSize?: number;
    fontName?: string;
    fontNameBidi?: string;
    underlineStyle?: UnderlineStyle;
    underlineColor?: Color;
    textColor?: Color;
    highlightColor?: Color;
    textBackgroundColor?: Color;
    subSuperScript?: SubSuperScript;
    characterSpacing?: number;
    position?: number;
    kerning?: number;
    scaling?: number;
    border?: RunBorderEdge;
    localeId?: LocaleIDs;
    localeIdBidi?: LocaleIDs;
    localeIdFarEast?: LocaleIDs;
    characterStyle?: string;
    bidi?: boolean;
    complexScript?: boolean;
    boldBidi?: boolean;
    italicBidi?: boolean;
    fontSizeBidi?: number;
    emphasisMark?: EmphasisMarkValue;
    textEffect?: TextEffectValue;
}

/**
 * Host that owns a {@link CharacterFormat} and receives mutation notifications.
 *
 * @private
 */
export interface CharacterFormatHost {
    notifyCharacterFormatMutation(): void;
    /**
     * Optional effective resolver (Paragraph host). Style-hosted CF must omit this
     * so public getters stay direct/authored-only for style-chain walks.
     *
     * @private
     */
    resolveEffectiveCharacterValue?(key: string): unknown;
}

/**
 * Internal fonts record (`w:rFonts`).
 *
 * @private
 */
export interface CharacterFontsRecord {
    ascii?: string;
    hAnsi?: string;
    cs?: string;
    eastAsia?: string;
    hint?: string;
    asciiTheme?: string;
    hAnsiTheme?: string;
    eastAsiaTheme?: string;
    cTheme?: string;
}

/**
 * Internal shading record (`w:shd`).
 *
 * @private
 */
export interface CharacterShadingRecord {
    fill?: string;
    color?: string;
    pattern?: string;
}

/**
 * @private
 * Formatting snapshot for hydrate/serialize (CharacterFormat module).
 */
export interface CharacterFormatSnapshot {
    rPrExtra: OpenXmlElement[];
    styleIdValue: string | undefined;
    boldValue: boolean | undefined;
    italicValue: boolean | undefined;
    strikeValue: boolean | undefined;
    doubleStrikeValue: boolean | undefined;
    vanishValue: boolean | undefined;
    /** Legacy `w:hidden` for round-trip only (public `hidden` maps to `w:vanish`). */
    legacyHiddenValue: boolean | undefined;
    noProofValue: boolean | undefined;
    fontSizeValue: HalfPoints | undefined;
    fontSizeBidiValue: HalfPoints | undefined;
    textColorValue: string | undefined;
    textColorTheme: string | undefined;
    /** Wire highlight name (`ST_HighlightColor`). */
    highlightValue: string | undefined;
    shadingValue: CharacterShadingRecord | undefined;
    /** Wire underline style (`ST_Underline`). */
    underlineStyleValue: string | undefined;
    underlineColorValue: string | undefined;
    /** Wire vertAlign (`ST_VerticalAlignRun`). */
    vertAlignValue: string | undefined;
    smallCapsValue: boolean | undefined;
    allCapsValue: boolean | undefined;
    fontsValue: CharacterFontsRecord | undefined;
    characterScaleValue: number | undefined;
    kerningValue: number | undefined;
    characterSpacingValue: number | undefined;
    positionValue: number | undefined;
    borderValue: RunBorderEdge | undefined;
    languageValue: RunLanguage | undefined;
    embossValue: boolean | undefined;
    imprintValue: boolean | undefined;
    outlineValue: boolean | undefined;
    shadowValue: boolean | undefined;
    webHiddenValue: boolean | undefined;
    bidiValue: boolean | undefined;
    complexScriptValue: boolean | undefined;
    boldBidiValue: boolean | undefined;
    italicBidiValue: boolean | undefined;
    emphasisValue: EmphasisMarkValue | undefined;
    textEffectValue: TextEffectValue | undefined;
    specVanishValue: boolean | undefined;
    snapToGridValue: boolean | undefined;
}

const MODELED_RPR: Set<string> = new Set([
    'rStyle',
    'rFonts',
    'b',
    'bCs',
    'i',
    'iCs',
    'caps',
    'smallCaps',
    'strike',
    'dstrike',
    'outline',
    'shadow',
    'emboss',
    'imprint',
    'snapToGrid',
    'vanish',
    'webHidden',
    'noProof',
    'hidden',
    'specVanish',
    'color',
    'spacing',
    'w',
    'kern',
    'position',
    'sz',
    'szCs',
    'highlight',
    'u',
    'vertAlign',
    'lang',
    'em',
    'effect',
    'shd',
    'bdr',
    'cs',
    'rtl'
]);

/** Parked only — Group C / complex. */
const RPR_EXTRA_ONLY: Set<string> = new Set(['rPrChange', 'oMath', 'eastAsianLayout', 'fitText']);

const HIGHLIGHT_COLORS: Set<string> = new Set<string>([
    'black',
    'blue',
    'cyan',
    'darkBlue',
    'darkCyan',
    'darkGray',
    'darkGreen',
    'darkMagenta',
    'darkRed',
    'darkYellow',
    'green',
    'lightGray',
    'magenta',
    'none',
    'red',
    'white',
    'yellow'
]);

const UNDERLINE_STYLES: Set<string> = new Set<string>([
    'single',
    'words',
    'double',
    'thick',
    'dotted',
    'dottedHeavy',
    'dash',
    'dashedHeavy',
    'dashLong',
    'dashLongHeavy',
    'dotDash',
    'dotDashHeavy',
    'dotDotDash',
    'dotDotDashHeavy',
    'wave',
    'wavyHeavy',
    'wavyDouble',
    'none'
]);

const EMPHASIS_MARKS: Set<string> = new Set<string>(['none', 'dot', 'comma', 'circle', 'underDot']);

const TEXT_EFFECTS: Set<string> = new Set<string>([
    'none',
    'blinkBackground',
    'lights',
    'antsBlack',
    'antsRed',
    'shimmer',
    'sparkle',
    'movie'
]);

function pointToSignedHalfPoints(points: number): number {
    return Math.round(points * 2);
}

function parseDecimalVal(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}

function wmlAttrVal(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find(function (a: OpenXmlAttribute): boolean {
        return a.localName === localName && (a.prefix === 'w' || a.prefix === '');
    })),
    ts330 == null ? undefined : ts330.value);
}

function emptySnapshot(): CharacterFormatSnapshot {
    return {
        rPrExtra: [],
        styleIdValue: undefined,
        boldValue: undefined,
        italicValue: undefined,
        strikeValue: undefined,
        doubleStrikeValue: undefined,
        vanishValue: undefined,
        legacyHiddenValue: undefined,
        noProofValue: undefined,
        fontSizeValue: undefined,
        fontSizeBidiValue: undefined,
        textColorValue: undefined,
        textColorTheme: undefined,
        highlightValue: undefined,
        shadingValue: undefined,
        underlineStyleValue: undefined,
        underlineColorValue: undefined,
        vertAlignValue: undefined,
        smallCapsValue: undefined,
        allCapsValue: undefined,
        fontsValue: undefined,
        characterScaleValue: undefined,
        kerningValue: undefined,
        characterSpacingValue: undefined,
        positionValue: undefined,
        borderValue: undefined,
        languageValue: undefined,
        embossValue: undefined,
        imprintValue: undefined,
        outlineValue: undefined,
        shadowValue: undefined,
        webHiddenValue: undefined,
        bidiValue: undefined,
        complexScriptValue: undefined,
        boldBidiValue: undefined,
        italicBidiValue: undefined,
        emphasisValue: undefined,
        textEffectValue: undefined,
        specVanishValue: undefined,
        snapToGridValue: undefined
    };
}

function validateFontSizePoints(name: string, value: number): void {
    if (!(value > 0 && value <= 1638)) {
        throw new RangeError(name + ' must be in (0, 1638] points, got ' + String(value));
    }
}

function validateSignedExtentPoints(name: string, value: number): void {
    if (value < -1584 || value > 1584) {
        throw new RangeError(name + ' must be in [-1584, 1584] points, got ' + String(value));
    }
}

function ensureFonts(record: CharacterFontsRecord | undefined): CharacterFontsRecord {
    if (record !== undefined) {
        return record;
    }
    return {};
}

function fontsRecordIsEmpty(f: CharacterFontsRecord): boolean {
    return (
        f.ascii === undefined &&
    f.hAnsi === undefined &&
    f.cs === undefined &&
    f.eastAsia === undefined &&
    f.hint === undefined &&
    f.asciiTheme === undefined &&
    f.hAnsiTheme === undefined &&
    f.eastAsiaTheme === undefined &&
    f.cTheme === undefined
    );
}

function pushOnOff(children: OpenXmlElement[], localName: string, value: boolean | undefined): void {
    if (value === undefined) {
        return;
    }
    children.push(serializeOnOff(localName, value));
}

// ---------------------------------------------------------------------------
// Parse helpers
// ---------------------------------------------------------------------------

function parseHighlight(el: OpenXmlElement): string | undefined {
    const raw: string = wValAttribute(el);
    if (raw === undefined || !HIGHLIGHT_COLORS.has(raw)) {
        return undefined;
    }
    return raw;
}

function parseUnderline(
    el: OpenXmlElement
): { style: string; color?: string } | undefined {
    const attr: string = wmlAttrVal(el, 'val');
    const raw: string = attr !== undefined ? attr : 'single';
    if (!UNDERLINE_STYLES.has(raw)) {
        return undefined;
    }
    const color: string = wmlAttrVal(el, 'color');
    if (color !== undefined) {
        return { style: raw, color: color };
    }
    return { style: raw };
}

function parseRunFonts(el: OpenXmlElement): CharacterFontsRecord {
    const ascii: string = wmlAttrVal(el, 'ascii');
    const hAnsi: string = wmlAttrVal(el, 'hAnsi');
    const cs: string = wmlAttrVal(el, 'cs');
    const eastAsia: string = wmlAttrVal(el, 'eastAsia');
    const hint: string = wmlAttrVal(el, 'hint');
    const asciiTheme: string = wmlAttrVal(el, 'asciiTheme');
    const hAnsiTheme: string = wmlAttrVal(el, 'hAnsiTheme');
    const eastAsiaTheme: string = wmlAttrVal(el, 'eastAsiaTheme');
    const cTheme: string = wmlAttrVal(el, 'cTheme');
    const out: CharacterFontsRecord = {};
    if (ascii !== undefined) {
        out.ascii = ascii;
    }
    if (hAnsi !== undefined) {
        out.hAnsi = hAnsi;
    }
    if (cs !== undefined) {
        out.cs = cs;
    }
    if (eastAsia !== undefined) {
        out.eastAsia = eastAsia;
    }
    if (hint !== undefined) {
        out.hint = hint;
    }
    if (asciiTheme !== undefined) {
        out.asciiTheme = asciiTheme;
    }
    if (hAnsiTheme !== undefined) {
        out.hAnsiTheme = hAnsiTheme;
    }
    if (eastAsiaTheme !== undefined) {
        out.eastAsiaTheme = eastAsiaTheme;
    }
    if (cTheme !== undefined) {
        out.cTheme = cTheme;
    }
    return out;
}

function parseCharacterScale(el: OpenXmlElement): number | undefined {
    const n: number = parseDecimalVal(wValAttribute(el));
    if (n === undefined || n < 1 || n > 600) {
        return undefined;
    }
    return n;
}

function parseKerning(el: OpenXmlElement): number | undefined {
    const n: number = parseDecimalVal(wValAttribute(el));
    if (n === undefined || n < 0) {
        return undefined;
    }
    return n;
}

function parseCharacterSpacing(el: OpenXmlElement): number | undefined {
    return parseDecimalVal(wValAttribute(el));
}

function parsePosition(el: OpenXmlElement): number | undefined {
    return parseDecimalVal(wValAttribute(el));
}

function parseRunBorder(el: OpenXmlElement): RunBorderEdge | undefined {
    const style: string = wmlAttrVal(el, 'val');
    if (style === undefined) {
        return undefined;
    }
    const color: string = wmlAttrVal(el, 'color');
    const sz: number = parseDecimalVal(wmlAttrVal(el, 'sz'));
    const space: number = parseDecimalVal(wmlAttrVal(el, 'space'));
    if (color !== undefined && sz !== undefined && space !== undefined) {
        return { style: style, color: color, size: sz, space: space };
    }
    if (color !== undefined && sz !== undefined) {
        return { style: style, color: color, size: sz };
    }
    if (color !== undefined && space !== undefined) {
        return { style: style, color: color, space: space };
    }
    if (sz !== undefined && space !== undefined) {
        return { style: style, size: sz, space: space };
    }
    if (color !== undefined) {
        return { style: style, color: color };
    }
    if (sz !== undefined) {
        return { style: style, size: sz };
    }
    if (space !== undefined) {
        return { style: style, space: space };
    }
    return { style: style };
}

function parseRunShading(el: OpenXmlElement): CharacterShadingRecord {
    const fill: string = wmlAttrVal(el, 'fill');
    const color: string = wmlAttrVal(el, 'color');
    const pattern: string = wmlAttrVal(el, 'val');
    const out: CharacterShadingRecord = {};
    if (fill !== undefined) {
        out.fill = fill;
    }
    if (color !== undefined) {
        out.color = color;
    }
    if (pattern !== undefined) {
        out.pattern = pattern;
    }
    return out;
}

function parseRunLanguage(el: OpenXmlElement): RunLanguage {
    const val: string = wmlAttrVal(el, 'val');
    const bidi: string = wmlAttrVal(el, 'bidi');
    const eastAsia: string = wmlAttrVal(el, 'eastAsia');
    if (val !== undefined && bidi !== undefined && eastAsia !== undefined) {
        return { latin: val, bidi: bidi, eastAsia: eastAsia };
    }
    if (val !== undefined && bidi !== undefined) {
        return { latin: val, bidi: bidi };
    }
    if (val !== undefined && eastAsia !== undefined) {
        return { latin: val, eastAsia: eastAsia };
    }
    if (bidi !== undefined && eastAsia !== undefined) {
        return { bidi: bidi, eastAsia: eastAsia };
    }
    if (val !== undefined) {
        return { latin: val };
    }
    if (bidi !== undefined) {
        return { bidi: bidi };
    }
    if (eastAsia !== undefined) {
        return { eastAsia: eastAsia };
    }
    return {};
}

function parseVertAlign(el: OpenXmlElement): string | undefined {
    const raw: string = wValAttribute(el);
    if (raw === 'baseline' || raw === 'superscript' || raw === 'subscript') {
        return raw;
    }
    return undefined;
}

function parseEmphasis(el: OpenXmlElement): EmphasisMarkValue | undefined {
    const raw: string = wValAttribute(el);
    if (raw === undefined || !EMPHASIS_MARKS.has(raw)) {
        return undefined;
    }
    return raw as EmphasisMarkValue;
}

function parseTextEffect(el: OpenXmlElement): TextEffectValue | undefined {
    const raw: string = wValAttribute(el);
    if (raw === undefined || !TEXT_EFFECTS.has(raw)) {
        return undefined;
    }
    return raw as TextEffectValue;
}

function parseColorPair(
    el: OpenXmlElement
): { value: string; themeColor?: string } | undefined {
    const value: string = wmlAttrVal(el, 'val');
    if (value === undefined) {
        return undefined;
    }
    const themeColor: string = wmlAttrVal(el, 'themeColor');
    if (themeColor !== undefined) {
        return { value: value, themeColor: themeColor };
    }
    return { value: value };
}

/**
 * Parse `w:rPr` children into a {@link CharacterFormatSnapshot}.
 * Invalid modeled markup is parked in `rPrExtra` (never throws on load).
 *
 * @param {OpenXmlElement} rPrElement - The r pr element.
 * @returns {CharacterFormatSnapshot} The result.
 * @private
 */
export function parseCharacterFormat(rPrElement: OpenXmlElement): CharacterFormatSnapshot {
    const snap: CharacterFormatSnapshot = emptySnapshot();
    const rPrExtra: OpenXmlElement[] = [];

    for (const prop of elementChildren(rPrElement)) {
        if (!isWml(prop, prop.localName)) {
            rPrExtra.push(prop);
            continue;
        }
        if (RPR_EXTRA_ONLY.has(prop.localName)) {
            rPrExtra.push(prop);
            continue;
        }
        if (!MODELED_RPR.has(prop.localName)) {
            rPrExtra.push(prop);
            continue;
        }
        if (prop.localName === 'rStyle') {
            snap.styleIdValue = wValAttribute(prop);
            continue;
        }
        if (prop.localName === 'sz') {
            const raw: string = wValAttribute(prop);
            if (raw !== undefined && /^\d+$/.test(raw)) {
                snap.fontSizeValue = halfPoints(Number.parseInt(raw, 10));
            } else {
                rPrExtra.push(prop);
            }
            continue;
        }
        if (prop.localName === 'szCs') {
            const raw: string = wValAttribute(prop);
            if (raw !== undefined && /^\d+$/.test(raw)) {
                snap.fontSizeBidiValue = halfPoints(Number.parseInt(raw, 10));
            } else {
                rPrExtra.push(prop);
            }
            continue;
        }
        if (prop.localName === 'color') {
            const parsed: { value: string; themeColor?: string; } = parseColorPair(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.textColorValue = parsed.value;
                snap.textColorTheme = parsed.themeColor;
            }
            continue;
        }
        if (prop.localName === 'highlight') {
            const parsed: string = parseHighlight(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.highlightValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'shd') {
            snap.shadingValue = parseRunShading(prop);
            continue;
        }
        if (prop.localName === 'u') {
            const parsed: { style: string; color?: string; } = parseUnderline(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.underlineStyleValue = parsed.style;
                snap.underlineColorValue = parsed.color;
            }
            continue;
        }
        if (prop.localName === 'vertAlign') {
            const parsed: string = parseVertAlign(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.vertAlignValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'rFonts') {
            snap.fontsValue = parseRunFonts(prop);
            continue;
        }
        if (prop.localName === 'w') {
            const parsed: number = parseCharacterScale(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.characterScaleValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'kern') {
            const parsed: number = parseKerning(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.kerningValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'spacing') {
            const parsed: number = parseCharacterSpacing(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.characterSpacingValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'position') {
            const parsed: number = parsePosition(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.positionValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'bdr') {
            const parsed: RunBorderEdge = parseRunBorder(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.borderValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'lang') {
            snap.languageValue = parseRunLanguage(prop);
            continue;
        }
        if (prop.localName === 'em') {
            const parsed: EmphasisMarkValue = parseEmphasis(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.emphasisValue = parsed;
            }
            continue;
        }
        if (prop.localName === 'effect') {
            const parsed: TextEffectValue = parseTextEffect(prop);
            if (parsed === undefined) {
                rPrExtra.push(prop);
            } else {
                snap.textEffectValue = parsed;
            }
            continue;
        }

        const flag: boolean = parseOnOff(prop);
        if (flag === undefined) {
            rPrExtra.push(prop);
            continue;
        }
        if (prop.localName === 'b') {
            snap.boldValue = flag;
        } else if (prop.localName === 'bCs') {
            snap.boldBidiValue = flag;
        } else if (prop.localName === 'i') {
            snap.italicValue = flag;
        } else if (prop.localName === 'iCs') {
            snap.italicBidiValue = flag;
        } else if (prop.localName === 'strike') {
            snap.strikeValue = flag;
        } else if (prop.localName === 'dstrike') {
            snap.doubleStrikeValue = flag;
        } else if (prop.localName === 'vanish') {
            snap.vanishValue = flag;
        } else if (prop.localName === 'noProof') {
            snap.noProofValue = flag;
        } else if (prop.localName === 'smallCaps') {
            snap.smallCapsValue = flag;
        } else if (prop.localName === 'caps') {
            snap.allCapsValue = flag;
        } else if (prop.localName === 'hidden') {
            // Legacy element — public `hidden` maps to `w:vanish`. Preserve for RT.
            snap.legacyHiddenValue = flag;
        } else if (prop.localName === 'emboss') {
            snap.embossValue = flag;
        } else if (prop.localName === 'imprint') {
            snap.imprintValue = flag;
        } else if (prop.localName === 'outline') {
            snap.outlineValue = flag;
        } else if (prop.localName === 'shadow') {
            snap.shadowValue = flag;
        } else if (prop.localName === 'webHidden') {
            snap.webHiddenValue = flag;
        } else if (prop.localName === 'cs') {
            snap.complexScriptValue = flag;
        } else if (prop.localName === 'rtl') {
            snap.bidiValue = flag;
        } else if (prop.localName === 'specVanish') {
            snap.specVanishValue = flag;
        } else if (prop.localName === 'snapToGrid') {
            snap.snapToGridValue = flag;
        } else {
            rPrExtra.push(prop);
        }
    }

    snap.rPrExtra = rPrExtra;
    return snap;
}

// ---------------------------------------------------------------------------
// Serialize helpers
// ---------------------------------------------------------------------------

function serializeRunColor(value: string, themeColor: string | undefined): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [wmlAttr('val', value)];
    if (themeColor !== undefined) {
        attrs.push(wmlAttr('themeColor', themeColor));
    }
    return wmlElement('color', { attributes: attrs });
}

function serializeUnderline(style: string, color: string | undefined): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [wmlAttr('val', style)];
    if (color !== undefined) {
        attrs.push(wmlAttr('color', color));
    }
    return wmlElement('u', { attributes: attrs });
}

function ensureLanguage(record: RunLanguage | undefined): {
    latin?: string;
    bidi?: string;
    eastAsia?: string;
} {
    if (record !== undefined) {
        return {
            latin: record.latin,
            bidi: record.bidi,
            eastAsia: record.eastAsia
        };
    }
    return {};
}

function languageRecordIsEmpty(lang: {
    latin?: string;
    bidi?: string;
    eastAsia?: string;
}): boolean {
    return lang.latin === undefined && lang.bidi === undefined && lang.eastAsia === undefined;
}

function setLocaleIdField(
    current: RunLanguage | undefined,
    field: 'latin' | 'bidi' | 'eastAsia',
    value: LocaleIDs | undefined
): RunLanguage | undefined {
    const next: { latin?: string; bidi?: string; eastAsia?: string; } = ensureLanguage(current);
    const tag: string = value === undefined ? undefined : localeIdToBcp47(value);
    writeLanguageField(next, field, tag);
    return languageRecordIsEmpty(next) ? undefined : next;
}

function getLocaleIdField(
    current: RunLanguage | undefined,
    field: 'latin' | 'bidi' | 'eastAsia'
): LocaleIDs | undefined {
    if (current === undefined) {
        return undefined;
    }
    const tag: string = readLanguageField(current, field);
    if (tag === undefined) {
        return undefined;
    }
    return localeIdFromBcp47(tag);
}

function writeLanguageField(
    lang: { latin?: string; bidi?: string; eastAsia?: string },
    field: 'latin' | 'bidi' | 'eastAsia',
    tag: string | undefined
): void {
    switch (field) {
    case 'latin':
        lang.latin = tag;
        break;
    case 'bidi':
        lang.bidi = tag;
        break;
    default:
        lang.eastAsia = tag;
        break;
    }
}

function readLanguageField(
    lang: { latin?: string; bidi?: string; eastAsia?: string },
    field: 'latin' | 'bidi' | 'eastAsia'
): string | undefined {
    switch (field) {
    case 'latin':
        return lang.latin;
    case 'bidi':
        return lang.bidi;
    default:
        return lang.eastAsia;
    }
}

function colorToWireOrUndefined(value: Color | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    return colorToHexWire(value);
}

function wireColorToEnum(value: string | undefined): Color | undefined {
    if (value === undefined) {
        return undefined;
    }
    return colorFromWire(value);
}

function serializeRunFonts(fonts: CharacterFontsRecord): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [];
    if (fonts.ascii !== undefined) {
        attrs.push(wmlAttr('ascii', fonts.ascii));
    }
    if (fonts.hAnsi !== undefined) {
        attrs.push(wmlAttr('hAnsi', fonts.hAnsi));
    }
    if (fonts.cs !== undefined) {
        attrs.push(wmlAttr('cs', fonts.cs));
    }
    if (fonts.eastAsia !== undefined) {
        attrs.push(wmlAttr('eastAsia', fonts.eastAsia));
    }
    if (fonts.hint !== undefined) {
        attrs.push(wmlAttr('hint', fonts.hint));
    }
    if (fonts.asciiTheme !== undefined) {
        attrs.push(wmlAttr('asciiTheme', fonts.asciiTheme));
    }
    if (fonts.hAnsiTheme !== undefined) {
        attrs.push(wmlAttr('hAnsiTheme', fonts.hAnsiTheme));
    }
    if (fonts.eastAsiaTheme !== undefined) {
        attrs.push(wmlAttr('eastAsiaTheme', fonts.eastAsiaTheme));
    }
    if (fonts.cTheme !== undefined) {
        attrs.push(wmlAttr('cTheme', fonts.cTheme));
    }
    return wmlElement('rFonts', { attributes: attrs });
}

function serializeRunBorder(edge: RunBorderEdge): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [wmlAttr('val', edge.style)];
    if (edge.color !== undefined) {
        attrs.push(wmlAttr('color', edge.color));
    }
    if (edge.size !== undefined) {
        attrs.push(wmlAttr('sz', String(edge.size)));
    }
    if (edge.space !== undefined) {
        attrs.push(wmlAttr('space', String(edge.space)));
    }
    return wmlElement('bdr', { attributes: attrs });
}

function serializeRunShading(shd: CharacterShadingRecord): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [];
    if (shd.pattern !== undefined) {
        attrs.push(wmlAttr('val', shd.pattern));
    }
    if (shd.color !== undefined) {
        attrs.push(wmlAttr('color', shd.color));
    }
    if (shd.fill !== undefined) {
        attrs.push(wmlAttr('fill', shd.fill));
    }
    return wmlElement('shd', { attributes: attrs });
}

function serializeRunLanguage(lang: RunLanguage): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [];
    if (lang.latin !== undefined) {
        attrs.push(wmlAttr('val', lang.latin));
    }
    if (lang.bidi !== undefined) {
        attrs.push(wmlAttr('bidi', lang.bidi));
    }
    if (lang.eastAsia !== undefined) {
        attrs.push(wmlAttr('eastAsia', lang.eastAsia));
    }
    return wmlElement('lang', { attributes: attrs });
}

/**
 * Build `w:rPr` children in Spec §7.2 house order.
 *
 * @param {CharacterFormatSnapshot} snap - The snap.
 * @returns {OpenXmlElement[]} The result.
 * @private
 */
export function buildRPrChildrenFromSnapshot(snap: CharacterFormatSnapshot): OpenXmlElement[] {
    const rPrChildren: OpenXmlElement[] = [];

    if (snap.styleIdValue !== undefined) {
        rPrChildren.push(wmlElement('rStyle', { attributes: [wmlAttr('val', snap.styleIdValue)] }));
    }
    if (snap.fontsValue !== undefined && !fontsRecordIsEmpty(snap.fontsValue)) {
        rPrChildren.push(serializeRunFonts(snap.fontsValue));
    }
    pushOnOff(rPrChildren, 'b', snap.boldValue);
    pushOnOff(rPrChildren, 'bCs', snap.boldBidiValue);
    pushOnOff(rPrChildren, 'i', snap.italicValue);
    pushOnOff(rPrChildren, 'iCs', snap.italicBidiValue);
    pushOnOff(rPrChildren, 'caps', snap.allCapsValue);
    pushOnOff(rPrChildren, 'smallCaps', snap.smallCapsValue);
    pushOnOff(rPrChildren, 'strike', snap.strikeValue);
    pushOnOff(rPrChildren, 'dstrike', snap.doubleStrikeValue);
    pushOnOff(rPrChildren, 'outline', snap.outlineValue);
    pushOnOff(rPrChildren, 'shadow', snap.shadowValue);
    pushOnOff(rPrChildren, 'emboss', snap.embossValue);
    pushOnOff(rPrChildren, 'imprint', snap.imprintValue);
    pushOnOff(rPrChildren, 'snapToGrid', snap.snapToGridValue);
    pushOnOff(rPrChildren, 'vanish', snap.vanishValue);
    pushOnOff(rPrChildren, 'webHidden', snap.webHiddenValue);
    pushOnOff(rPrChildren, 'noProof', snap.noProofValue);
    pushOnOff(rPrChildren, 'hidden', snap.legacyHiddenValue);
    pushOnOff(rPrChildren, 'specVanish', snap.specVanishValue);
    if (snap.textColorValue !== undefined) {
        rPrChildren.push(serializeRunColor(snap.textColorValue, snap.textColorTheme));
    }
    if (snap.characterSpacingValue !== undefined) {
        rPrChildren.push(
            wmlElement('spacing', {
                attributes: [wmlAttr('val', String(snap.characterSpacingValue))]
            })
        );
    }
    if (snap.characterScaleValue !== undefined) {
        rPrChildren.push(
            wmlElement('w', { attributes: [wmlAttr('val', String(snap.characterScaleValue))] })
        );
    }
    if (snap.kerningValue !== undefined) {
        rPrChildren.push(
            wmlElement('kern', { attributes: [wmlAttr('val', String(snap.kerningValue))] })
        );
    }
    if (snap.positionValue !== undefined) {
        rPrChildren.push(
            wmlElement('position', { attributes: [wmlAttr('val', String(snap.positionValue))] })
        );
    }
    if (snap.fontSizeValue !== undefined) {
        rPrChildren.push(
            wmlElement('sz', { attributes: [wmlAttr('val', String(snap.fontSizeValue))] })
        );
    }
    if (snap.fontSizeBidiValue !== undefined) {
        rPrChildren.push(
            wmlElement('szCs', { attributes: [wmlAttr('val', String(snap.fontSizeBidiValue))] })
        );
    }
    if (snap.highlightValue !== undefined) {
        rPrChildren.push(
            wmlElement('highlight', { attributes: [wmlAttr('val', snap.highlightValue)] })
        );
    }
    if (snap.underlineStyleValue !== undefined) {
        rPrChildren.push(serializeUnderline(snap.underlineStyleValue, snap.underlineColorValue));
    }
    if (snap.vertAlignValue !== undefined) {
        rPrChildren.push(
            wmlElement('vertAlign', { attributes: [wmlAttr('val', snap.vertAlignValue)] })
        );
    }
    if (snap.languageValue !== undefined) {
        rPrChildren.push(serializeRunLanguage(snap.languageValue));
    }
    if (snap.emphasisValue !== undefined) {
        rPrChildren.push(wmlElement('em', { attributes: [wmlAttr('val', snap.emphasisValue)] }));
    }
    if (snap.textEffectValue !== undefined) {
        rPrChildren.push(
            wmlElement('effect', { attributes: [wmlAttr('val', snap.textEffectValue)] })
        );
    }
    if (snap.shadingValue !== undefined) {
        rPrChildren.push(serializeRunShading(snap.shadingValue));
    }
    if (snap.borderValue !== undefined) {
        rPrChildren.push(serializeRunBorder(snap.borderValue));
    }
    pushOnOff(rPrChildren, 'cs', snap.complexScriptValue);
    pushOnOff(rPrChildren, 'rtl', snap.bidiValue);
    for (const element of snap.rPrExtra) {
        rPrChildren.push(element);
    }
    return rPrChildren;
}

const CHARACTER_FORMAT_DEFAULTS: {
    readonly bold: boolean;
    readonly italic: boolean;
    readonly strikethrough: boolean;
    readonly doubleStrikethrough: boolean;
    readonly allCaps: boolean;
    readonly smallCaps: boolean;
    readonly hidden: boolean;
    readonly emboss: boolean;
    readonly engrave: boolean;
    readonly outline: boolean;
    readonly shadow: boolean;
    readonly noProof: boolean;
    readonly webHidden: boolean;
    readonly fontSize: number;
    readonly fontName: string;
    readonly fontNameAscii: string;
    readonly fontNameNonFarEast: string;
    readonly fontNameFarEast: string;
    readonly fontNameBidi: string;
    readonly underlineStyle: UnderlineStyle;
    readonly underlineColor: Color;
    readonly textColor: Color;
    readonly highlightColor: Color;
    readonly textBackgroundColor: Color;
    readonly subSuperScript: SubSuperScript;
    readonly characterSpacing: number;
    readonly position: number;
    readonly kerning: number;
    readonly scaling: number;
    readonly localeId: LocaleIDs;
    readonly localeIdBidi: LocaleIDs;
    readonly localeIdFarEast: LocaleIDs;
    readonly bidi: boolean;
    readonly complexScript: boolean;
    readonly boldBidi: boolean;
    readonly italicBidi: boolean;
    readonly fontSizeBidi: number;
    readonly emphasisMark: EmphasisMarkValue;
    readonly textEffect: TextEffectValue;
    readonly specVanish: boolean;
    readonly snapToGrid: boolean;
} = {
    bold: false,
    italic: false,
    strikethrough: false,
    doubleStrikethrough: false,
    allCaps: false,
    smallCaps: false,
    hidden: false,
    emboss: false,
    engrave: false,
    outline: false,
    shadow: false,
    noProof: false,
    webHidden: false,
    fontSize: 10,
    fontName: 'Times New Roman',
    fontNameAscii: 'Times New Roman',
    fontNameNonFarEast: 'Times New Roman',
    fontNameFarEast: 'Times New Roman',
    fontNameBidi: 'Times New Roman',
    underlineStyle: UnderlineStyle.None,
    underlineColor: Color.Transparent,
    textColor: Color.Transparent,
    highlightColor: Color.Transparent,
    textBackgroundColor: Color.Transparent,
    subSuperScript: SubSuperScript.None,
    characterSpacing: 0,
    position: 0,
    kerning: 0,
    scaling: 100,
    localeId: 1033 as LocaleIDs,
    localeIdBidi: 1025 as LocaleIDs,
    localeIdFarEast: 1033 as LocaleIDs,
    bidi: false,
    complexScript: false,
    boldBidi: false,
    italicBidi: false,
    fontSizeBidi: 10,
    emphasisMark: 'none' as EmphasisMarkValue,
    textEffect: 'none' as TextEffectValue,
    specVanish: false,
    snapToGrid: true
};

/**
 * Character formatting model for a run.
 *
 * @public
 */
export class CharacterFormat {
    private readonly host: CharacterFormatHost;

    private rPrExtra: OpenXmlElement[] = [];
    private styleIdValue: string | undefined;
    private boldValue: boolean | undefined;
    private italicValue: boolean | undefined;
    private strikeValue: boolean | undefined;
    private doubleStrikeValue: boolean | undefined;
    /** Public `hidden` → `w:vanish`. */
    private vanishValue: boolean | undefined;
    /** Legacy `w:hidden` only (not public). */
    private legacyHiddenValue: boolean | undefined;
    private noProofValue: boolean | undefined;
    private fontSizeValue: HalfPoints | undefined;
    private fontSizeBidiValue: HalfPoints | undefined;
    private textColorValue: string | undefined;
    private textColorTheme: string | undefined;
    private highlightValue: string | undefined;
    private shadingValue: CharacterShadingRecord | undefined;
    private underlineStyleValue: string | undefined;
    private underlineColorValue: string | undefined;
    private vertAlignValue: string | undefined;
    private smallCapsValue: boolean | undefined;
    private allCapsValue: boolean | undefined;
    private fontsValue: CharacterFontsRecord | undefined;
    private characterScaleValue: number | undefined;
    private kerningValue: number | undefined;
    private characterSpacingValue: number | undefined;
    private positionValue: number | undefined;
    private borderValue: RunBorderEdge | undefined;
    private languageValue: RunLanguage | undefined;
    private embossValue: boolean | undefined;
    private imprintValue: boolean | undefined;
    private outlineValue: boolean | undefined;
    private shadowValue: boolean | undefined;
    private webHiddenValue: boolean | undefined;
    private bidiValue: boolean | undefined;
    private complexScriptValue: boolean | undefined;
    private boldBidiValue: boolean | undefined;
    private italicBidiValue: boolean | undefined;
    private emphasisValue: EmphasisMarkValue | undefined;
    private textEffectValue: TextEffectValue | undefined;
    private specVanishValue: boolean | undefined;
    private snapToGridValue: boolean | undefined;

    /**
     * @param {CharacterFormatHost} host - The host.
     * @private
     */
    constructor(host: CharacterFormatHost) {
        this.host = host;
    }

    private mutate(): void {
        this.host.notifyCharacterFormatMutation();
    }


    private effective<T>(key: string): T | undefined {
        const resolve: (key: string) => unknown = this.host.resolveEffectiveCharacterValue;
        const value: any = resolve !== undefined ? resolve.call(this.host, key) : undefined;
        return value !== undefined ? value as T : undefined;
    }

    private effectiveOrDefault<T>(key: string, defaultValue: T): T {
        const value: T = this.effective<T>(key);
        return value !== undefined ? value : defaultValue;
    }

    // ---- Group A ----

    /**
     * Gets or sets a value indicating whether the text is bold.
     *
     * If undefined, the value is inherited from the style.
     */
    get bold(): boolean | undefined {
        if (this.boldValue !== undefined) {
            return this.boldValue;
        }
        return this.effective<boolean>('bold');
    }
    set bold(value: boolean | undefined) {
        this.boldValue = value;
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text is italic.
     *
     * If undefined, the value is inherited from the style.
     */
    get italic(): boolean | undefined {
        if (this.italicValue !== undefined) {
            return this.italicValue;
        }
        return this.effective<boolean>('italic');
    }
    set italic(value: boolean | undefined) {
        this.italicValue = value;
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text has a single strikethrough.
     *
     * Setting this to true clears the double strikethrough setting.
     */
    get strikethrough(): boolean | undefined {
        if (this.strikeValue !== undefined) {
            return this.strikeValue;
        }
        return this.effective<boolean>('strikethrough');
    }
    set strikethrough(value: boolean | undefined) {
        this.strikeValue = value;
        if (value === true) {
            this.doubleStrikeValue = undefined;
        }
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text has a double strikethrough.
     *
     * Setting this to true clears the single strikethrough setting.
     */
    get doubleStrikethrough(): boolean | undefined {
        if (this.doubleStrikeValue !== undefined) {
            return this.doubleStrikeValue;
        }
        return this.effective<boolean>('doubleStrikethrough');
    }
    set doubleStrikethrough(value: boolean | undefined) {
        this.doubleStrikeValue = value;
        if (value === true) {
            this.strikeValue = undefined;
        }
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text is displayed in all capital letters.
     *
     * Setting this to true clears the small caps setting.
     */
    get allCaps(): boolean | undefined {
        if (this.allCapsValue !== undefined) {
            return this.allCapsValue;
        }
        return this.effective<boolean>('allCaps');
    }
    set allCaps(value: boolean | undefined) {
        this.allCapsValue = value;
        if (value === true) {
            this.smallCapsValue = undefined;
        }
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text is displayed in small capital letters.
     *
     * Setting this to true clears the all caps setting.
     */
    get smallCaps(): boolean | undefined {
        if (this.smallCapsValue !== undefined) {
            return this.smallCapsValue;
        }
        return this.effective<boolean>('smallCaps');
    }
    set smallCaps(value: boolean | undefined) {
        this.smallCapsValue = value;
        if (value === true) {
            this.allCapsValue = undefined;
        }
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text is hidden.
     *
     * If undefined, the value is inherited from the style.
     */
    get hidden(): boolean | undefined {
        if (this.vanishValue !== undefined) {
            return this.vanishValue;
        }
        return this.effective<boolean>('hidden');
    }
    set hidden(value: boolean | undefined) {
        this.vanishValue = value;
        this.mutate();
    }

    /**
     * Direct `w:emboss`. Setter clears engrave/outline/shadow when true (not on hydrate).
     *
     * @private
     */
    get emboss(): boolean | undefined {
        if (this.embossValue !== undefined) {
            return this.embossValue;
        }
        return this.effective<boolean>('emboss');
    }
    set emboss(value: boolean | undefined) {
        this.embossValue = value;
        if (value === true) {
            this.imprintValue = undefined;
            this.outlineValue = undefined;
            this.shadowValue = undefined;
        }
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text appears engraved.
     */
    get engrave(): boolean | undefined {
        if (this.imprintValue !== undefined) {
            return this.imprintValue;
        }
        return this.effective<boolean>('engrave');
    }
    set engrave(value: boolean | undefined) {
        this.imprintValue = value;
        if (value === true) {
            this.embossValue = undefined;
            this.outlineValue = undefined;
            this.shadowValue = undefined;
        }
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text is displayed with an outline effect.
     */
    get outline(): boolean | undefined {
        if (this.outlineValue !== undefined) {
            return this.outlineValue;
        }
        return this.effective<boolean>('outline');
    }
    set outline(value: boolean | undefined) {
        this.outlineValue = value;
        if (value === true) {
            this.embossValue = undefined;
            this.imprintValue = undefined;
            this.shadowValue = undefined;
        }
        this.mutate();
    }

    /**
     * Gets or sets a value indicating whether the text has a shadow effect.
     */
    get shadow(): boolean | undefined {
        if (this.shadowValue !== undefined) {
            return this.shadowValue;
        }
        return this.effective<boolean>('shadow');
    }
    set shadow(value: boolean | undefined) {
        this.shadowValue = value;
        if (value === true) {
            this.embossValue = undefined;
            this.imprintValue = undefined;
            this.outlineValue = undefined;
        }
        this.mutate();
    }

    /**
     * Direct `w:noProof`.
     *
     * @private
     */
    get noProof(): boolean | undefined {
        if (this.noProofValue !== undefined) {
            return this.noProofValue;
        }
        return this.effective<boolean>('noProof');
    }
    set noProof(value: boolean | undefined) {
        this.noProofValue = value;
        this.mutate();
    }

    /**
     * Direct `w:webHidden`.
     *
     * @private
     */
    get webHidden(): boolean | undefined {
        if (this.webHiddenValue !== undefined) {
            return this.webHiddenValue;
        }
        return this.effective<boolean>('webHidden');
    }
    set webHidden(value: boolean | undefined) {
        this.webHiddenValue = value;
        this.mutate();
    }

    /**
     * Gets or sets the font size in points. Range (0, 1638].
     */
    get fontSize(): number {
        if (this.fontSizeValue !== undefined) {
            return halfPointsToPoint(this.fontSizeValue as number);
        }
        return this.effectiveOrDefault('fontSize', CHARACTER_FORMAT_DEFAULTS.fontSize);
    }
    set fontSize(value: number | undefined) {
        if (value === undefined) {
            this.fontSizeValue = undefined;
            this.mutate();
            return;
        }
        validateFontSizePoints('fontSize', value);
        this.fontSizeValue = lengthToHalfPoints(value);
        this.mutate();
    }

    /**
     * Gets or sets the font name. Setter also writes eastAsia/cs only when those slots are already set.
     */
    get fontName(): string {
        if (this.fontsValue !== undefined) {
            if (this.fontsValue.ascii !== undefined) {
                return this.fontsValue.ascii;
            }
            if (this.fontsValue.hAnsi !== undefined) {
                return this.fontsValue.hAnsi;
            }
        }
        return this.effectiveOrDefault('fontName', CHARACTER_FORMAT_DEFAULTS.fontName);
    }
    set fontName(value: string | undefined) {
        if (value === undefined) {
            if (this.fontsValue === undefined) {
                return;
            }
            this.fontsValue.ascii = undefined;
            this.fontsValue.hAnsi = undefined;
            if (fontsRecordIsEmpty(this.fontsValue)) {
                this.fontsValue = undefined;
            }
            this.mutate();
            return;
        }
        const fonts: CharacterFontsRecord = ensureFonts(this.fontsValue);
        fonts.ascii = value;
        fonts.hAnsi = value;
        if (fonts.eastAsia !== undefined) {
            fonts.eastAsia = value;
        }
        if (fonts.cs !== undefined) {
            fonts.cs = value;
        }
        this.fontsValue = fonts;
        this.mutate();
    }

    /**
     * @private
     * `w:rFonts/@w:ascii`
     */
    get fontNameAscii(): string {
        if (this.fontsValue !== undefined) {
            if (this.fontsValue.ascii !== undefined) {
                return this.fontsValue.ascii;
            }
        }
        return this.effectiveOrDefault('fontNameAscii', CHARACTER_FORMAT_DEFAULTS.fontNameAscii);
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set fontNameAscii(value: string | undefined) {
        const fonts: CharacterFontsRecord = ensureFonts(this.fontsValue);
        fonts.ascii = value;
        this.fontsValue = fontsRecordIsEmpty(fonts) ? undefined : fonts;
        this.mutate();
    }

    /**
     * @private
     * `w:rFonts/@w:hAnsi`
     */
    get fontNameNonFarEast(): string {
        if (this.fontsValue !== undefined) {
            if (this.fontsValue.hAnsi !== undefined) {
                return this.fontsValue.hAnsi;
            }
        }
        return this.effectiveOrDefault('fontNameNonFarEast', CHARACTER_FORMAT_DEFAULTS.fontNameNonFarEast);
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set fontNameNonFarEast(value: string | undefined) {
        const fonts: CharacterFontsRecord = ensureFonts(this.fontsValue);
        fonts.hAnsi = value;
        this.fontsValue = fontsRecordIsEmpty(fonts) ? undefined : fonts;
        this.mutate();
    }

    /**
     * @private
     * `w:rFonts/@w:eastAsia`
     */
    get fontNameFarEast(): string {
        if (this.fontsValue !== undefined) {
            if (this.fontsValue.eastAsia !== undefined) {
                return this.fontsValue.eastAsia;
            }
        }
        return this.effectiveOrDefault('fontNameFarEast', CHARACTER_FORMAT_DEFAULTS.fontNameFarEast);
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set fontNameFarEast(value: string | undefined) {
        const fonts: CharacterFontsRecord = ensureFonts(this.fontsValue);
        fonts.eastAsia = value;
        this.fontsValue = fontsRecordIsEmpty(fonts) ? undefined : fonts;
        this.mutate();
    }

    /**
     * Gets or sets the complex-script font.
     */
    get fontNameBidi(): string {
        if (this.fontsValue !== undefined) {
            if (this.fontsValue.cs !== undefined) {
                return this.fontsValue.cs;
            }
        }
        return this.effectiveOrDefault('fontNameBidi', CHARACTER_FORMAT_DEFAULTS.fontNameBidi);
    }
    set fontNameBidi(value: string | undefined) {
        const fonts: CharacterFontsRecord = ensureFonts(this.fontsValue);
        fonts.cs = value;
        this.fontsValue = fontsRecordIsEmpty(fonts) ? undefined : fonts;
        this.mutate();
    }

    /**
     * Gets or sets the underline style.
     */
    get underlineStyle(): UnderlineStyle {
        if (this.underlineStyleValue !== undefined) {
            return underlineStyleFromWire(this.underlineStyleValue);
        }
        return this.effectiveOrDefault('underlineStyle', CHARACTER_FORMAT_DEFAULTS.underlineStyle);
    }
    set underlineStyle(value: UnderlineStyle | undefined) {
        if (value === undefined) {
            this.underlineStyleValue = undefined;
            this.underlineColorValue = undefined;
            this.mutate();
            return;
        }
        this.underlineStyleValue = underlineStyleToWire(value);
        this.mutate();
    }

    /**
     * Gets or sets the underline color.
     */
    get underlineColor(): Color {
        if (this.underlineColorValue !== undefined) {
            const mapped: Color = wireColorToEnum(this.underlineColorValue);
            return mapped !== undefined ? mapped : Color.Transparent;
        }
        const resolved: Color | 'transparent' = this.effective<Color | 'transparent'>('underlineColor');
        if (resolved === 'transparent') {
            return Color.Transparent;
        }
        return resolved !== undefined ? resolved : CHARACTER_FORMAT_DEFAULTS.underlineColor;
    }
    set underlineColor(value: Color | undefined) {
        this.underlineColorValue = colorToWireOrUndefined(value);
        this.mutate();
    }

    /**
     * Gets or sets the text color. Setting clears theme color.
     */
    get textColor(): Color {
        if (this.textColorValue !== undefined) {
            const mapped: Color = wireColorToEnum(this.textColorValue);
            return mapped !== undefined ? mapped : Color.Transparent;
        }
        const resolved: Color | 'transparent' = this.effective<Color | 'transparent'>('textColor');
        if (resolved === 'transparent') {
            return Color.Transparent;
        }
        return resolved !== undefined ? resolved : CHARACTER_FORMAT_DEFAULTS.textColor;
    }
    set textColor(value: Color | undefined) {
        this.textColorValue = colorToWireOrUndefined(value);
        this.textColorTheme = undefined;
        this.mutate();
    }

    /**
     * Gets or sets the highlight color.
     */
    get highlightColor(): Color {
        if (this.highlightValue !== undefined) {
            return highlightWireToColor(this.highlightValue);
        }
        const resolved: Color | 'transparent' = this.effective<Color | 'transparent'>('highlightColor');
        if (resolved === 'transparent') {
            return Color.Transparent;
        }
        return resolved !== undefined ? resolved : CHARACTER_FORMAT_DEFAULTS.highlightColor;
    }
    set highlightColor(value: Color | undefined) {
        if (value === undefined) {
            this.highlightValue = undefined;
            this.mutate();
            return;
        }
        this.highlightValue = colorToHighlightWire(value);
        this.mutate();
    }

    /**
     * Gets or sets the text background.
     */
    get textBackgroundColor(): Color {
        if (this.shadingValue !== undefined && this.shadingValue.fill !== undefined) {
            const mapped: Color = wireColorToEnum(this.shadingValue.fill);
            return mapped !== undefined ? mapped : Color.Transparent;
        }
        const resolved: Color | 'transparent' = this.effective<Color | 'transparent'>('textBackgroundColor');
        if (resolved === 'transparent') {
            return Color.Transparent;
        }
        return resolved !== undefined ? resolved : CHARACTER_FORMAT_DEFAULTS.textBackgroundColor;
    }
    set textBackgroundColor(value: Color | undefined) {
        if (value === undefined) {
            this.shadingValue = undefined;
            this.mutate();
            return;
        }
        const fill: string = colorToHexWire(value);
        this.shadingValue = { pattern: 'clear', fill: fill };
        this.mutate();
    }

    /**
     * Gets or sets the sub/superscript.
     */
    get subSuperScript(): SubSuperScript {
        if (this.vertAlignValue !== undefined) {
            return subSuperScriptFromWire(this.vertAlignValue);
        }
        return this.effectiveOrDefault('subSuperScript', CHARACTER_FORMAT_DEFAULTS.subSuperScript);
    }
    set subSuperScript(value: SubSuperScript | undefined) {
        if (value === undefined) {
            this.vertAlignValue = undefined;
            this.mutate();
            return;
        }
        this.vertAlignValue = subSuperScriptToWire(value);
        this.mutate();
    }

    /**
     * Gets or sets the character spacing in points. Range ±1584.
     */
    get characterSpacing(): number {
        if (this.characterSpacingValue !== undefined) {
            return twipsToPoint(this.characterSpacingValue);
        }
        return this.effectiveOrDefault('characterSpacing', CHARACTER_FORMAT_DEFAULTS.characterSpacing);
    }
    set characterSpacing(value: number | undefined) {
        if (value === undefined) {
            this.characterSpacingValue = undefined;
            this.mutate();
            return;
        }
        validateSignedExtentPoints('characterSpacing', value);
        this.characterSpacingValue = pointToTwips(value);
        this.mutate();
    }

    /**
     * Gets or sets the raised/lowered position in points. Range ±1584.
     */
    get position(): number {
        if (this.positionValue !== undefined) {
            return halfPointsToPoint(this.positionValue);
        }
        return this.effectiveOrDefault('position', CHARACTER_FORMAT_DEFAULTS.position);
    }
    set position(value: number | undefined) {
        if (value === undefined) {
            this.positionValue = undefined;
            this.mutate();
            return;
        }
        validateSignedExtentPoints('position', value);
        this.positionValue = pointToSignedHalfPoints(value);
        this.mutate();
    }

    /**
     * Kerning threshold in points (`w:kern` half-points).
     *
     * @private
     */
    get kerning(): number {
        if (this.kerningValue !== undefined) {
            return halfPointsToPoint(this.kerningValue);
        }
        return this.effectiveOrDefault('kerning', CHARACTER_FORMAT_DEFAULTS.kerning);
    }
    set kerning(value: number | undefined) {
        if (value === undefined) {
            this.kerningValue = undefined;
            this.mutate();
            return;
        }
        if (value < 0) {
            throw new RangeError('kerning must be non-negative, got ' + String(value));
        }
        const hp: number = pointToSignedHalfPoints(value);
        if (hp < 0) {
            throw new RangeError('kerning must be non-negative, got ' + String(hp) + ' half-points');
        }
        this.kerningValue = hp;
        this.mutate();
    }

    /**
     * Gets or sets the character scale percentage. Integer 1–600.
     */
    get scaling(): number {
        if (this.characterScaleValue !== undefined) {
            return this.characterScaleValue;
        }
        return this.effectiveOrDefault('scaling', CHARACTER_FORMAT_DEFAULTS.scaling);
    }
    set scaling(value: number | undefined) {
        if (value !== undefined && (!Number.isInteger(value) || value < 1 || value > 600)) {
            throw new RangeError('scaling must be an integer 1–600, got ' + String(value));
        }
        this.characterScaleValue = value;
        this.mutate();
    }

    /**
     * Gets or sets the character border.
     */
    get border(): RunBorderEdge | undefined {
        if (this.borderValue !== undefined) {
            return this.borderValue;
        }
        return this.effective<RunBorderEdge>('border');
    }
    set border(value: RunBorderEdge | undefined) {
        this.borderValue = value;
        this.mutate();
    }

    /**
     * Gets or sets the latin locale id.
     *
     * @public
     */
    get localeId(): LocaleIDs {
        const direct: LocaleIDs = getLocaleIdField(this.languageValue, 'latin');
        if (direct !== undefined) {
            return direct;
        }
        return this.effectiveOrDefault('localeId', CHARACTER_FORMAT_DEFAULTS.localeId);
    }
    set localeId(value: LocaleIDs | undefined) {
        this.languageValue = setLocaleIdField(this.languageValue, 'latin', value);
        this.mutate();
    }

    /**
     * Gets or sets the bidirectional locale id.
     *
     * @public
     */
    get localeIdBidi(): LocaleIDs {
        const direct: LocaleIDs = getLocaleIdField(this.languageValue, 'bidi');
        if (direct !== undefined) {
            return direct;
        }
        return this.effectiveOrDefault('localeIdBidi', CHARACTER_FORMAT_DEFAULTS.localeIdBidi);
    }
    set localeIdBidi(value: LocaleIDs | undefined) {
        this.languageValue = setLocaleIdField(this.languageValue, 'bidi', value);
        this.mutate();
    }

    /**
     * East Asian locale id (`w:lang/@w:eastAsia` as {@link LocaleIDs}).
     *
     * @private
     */
    get localeIdFarEast(): LocaleIDs {
        const direct: LocaleIDs = getLocaleIdField(this.languageValue, 'eastAsia');
        if (direct !== undefined) {
            return direct;
        }
        return this.effectiveOrDefault('localeIdFarEast', CHARACTER_FORMAT_DEFAULTS.localeIdFarEast);
    }
    set localeIdFarEast(value: LocaleIDs | undefined) {
        this.languageValue = setLocaleIdField(this.languageValue, 'eastAsia', value);
        this.mutate();
    }

    /**
     * Gets or sets the character style id.
     */
    get characterStyle(): string | undefined {
        return this.styleIdValue;
    }
    set characterStyle(value: string | undefined) {
        this.styleIdValue = value;
        this.mutate();
    }

    // ---- Group B ----

    /**
     * Gets or sets the bidirectional.
     */
    get bidi(): boolean | undefined {
        if (this.bidiValue !== undefined) {
            return this.bidiValue;
        }
        return this.effective<boolean>('bidi');
    }
    set bidi(value: boolean | undefined) {
        this.bidiValue = value;
        this.mutate();
    }

    /**
     * Gets or sets the complex script.
     */
    get complexScript(): boolean | undefined {
        if (this.complexScriptValue !== undefined) {
            return this.complexScriptValue;
        }
        return this.effective<boolean>('complexScript');
    }
    set complexScript(value: boolean | undefined) {
        this.complexScriptValue = value;
        this.mutate();
    }

    /**
     * Gets or sets the bold complex script.
     */
    get boldBidi(): boolean | undefined {
        if (this.boldBidiValue !== undefined) {
            return this.boldBidiValue;
        }
        return this.effective<boolean>('boldBidi');
    }
    set boldBidi(value: boolean | undefined) {
        this.boldBidiValue = value;
        this.mutate();
    }

    /**
     * Gets or sets the italic complex script.
     */
    get italicBidi(): boolean | undefined {
        if (this.italicBidiValue !== undefined) {
            return this.italicBidiValue;
        }
        return this.effective<boolean>('italicBidi');
    }
    set italicBidi(value: boolean | undefined) {
        this.italicBidiValue = value;
        this.mutate();
    }

    /**
     * Gets or sets the complex-script font size in points. Range (0, 1638].
     */
    get fontSizeBidi(): number {
        if (this.fontSizeBidiValue !== undefined) {
            return halfPointsToPoint(this.fontSizeBidiValue as number);
        }
        return this.effectiveOrDefault('fontSizeBidi', CHARACTER_FORMAT_DEFAULTS.fontSizeBidi);
    }
    set fontSizeBidi(value: number | undefined) {
        if (value === undefined) {
            this.fontSizeBidiValue = undefined;
            this.mutate();
            return;
        }
        validateFontSizePoints('fontSizeBidi', value);
        this.fontSizeBidiValue = lengthToHalfPoints(value);
        this.mutate();
    }

    /**
     * Gets or sets the emphasis mark.
     */
    get emphasisMark(): EmphasisMarkValue {
        if (this.emphasisValue !== undefined) {
            return this.emphasisValue;
        }
        return this.effectiveOrDefault('emphasisMark', CHARACTER_FORMAT_DEFAULTS.emphasisMark);
    }
    set emphasisMark(value: EmphasisMarkValue | undefined) {
        this.emphasisValue = value;
        this.mutate();
    }

    /**
     * Gets or sets the animated text effect.
     */
    get textEffect(): TextEffectValue {
        if (this.textEffectValue !== undefined) {
            return this.textEffectValue;
        }
        return this.effectiveOrDefault('textEffect', CHARACTER_FORMAT_DEFAULTS.textEffect);
    }
    set textEffect(value: TextEffectValue | undefined) {
        this.textEffectValue = value;
        this.mutate();
    }

    /**
     * @private
     * `w:specVanish`
     */
    get specVanish(): boolean | undefined {
        if (this.specVanishValue !== undefined) {
            return this.specVanishValue;
        }
        return this.effective<boolean>('specVanish');
    }
    /**
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set specVanish(value: boolean | undefined) {
        this.specVanishValue = value;
        this.mutate();
    }

    /**
     * @private
     * `w:snapToGrid`
     */
    get snapToGrid(): boolean | undefined {
        if (this.snapToGridValue !== undefined) {
            return this.snapToGridValue;
        }
        return this.effective<boolean>('snapToGrid');
    }
    /**
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set snapToGrid(value: boolean | undefined) {
        this.snapToGridValue = value;
        this.mutate();
    }

    /**
     * Apply a partial delta. Uses setters (exclusivity applies).
     *
     * @param {CharacterFormatDelta} delta - The delta.
     * @returns {void} Nothing is returned.
     * @private
     */
    assign(delta: CharacterFormatDelta): void {
        if (delta.bold !== undefined) {
            this.bold = delta.bold;
        }
        if (delta.italic !== undefined) {
            this.italic = delta.italic;
        }
        if (delta.strikethrough !== undefined) {
            this.strikethrough = delta.strikethrough;
        }
        if (delta.doubleStrikethrough !== undefined) {
            this.doubleStrikethrough = delta.doubleStrikethrough;
        }
        if (delta.allCaps !== undefined) {
            this.allCaps = delta.allCaps;
        }
        if (delta.smallCaps !== undefined) {
            this.smallCaps = delta.smallCaps;
        }
        if (delta.hidden !== undefined) {
            this.hidden = delta.hidden;
        }
        if (delta.emboss !== undefined) {
            this.emboss = delta.emboss;
        }
        if (delta.engrave !== undefined) {
            this.engrave = delta.engrave;
        }
        if (delta.outline !== undefined) {
            this.outline = delta.outline;
        }
        if (delta.shadow !== undefined) {
            this.shadow = delta.shadow;
        }
        if (delta.noProof !== undefined) {
            this.noProof = delta.noProof;
        }
        if (delta.webHidden !== undefined) {
            this.webHidden = delta.webHidden;
        }
        if (delta.fontSize !== undefined) {
            this.fontSize = delta.fontSize;
        }
        if (delta.fontName !== undefined) {
            this.fontName = delta.fontName;
        }
        if (delta.fontNameBidi !== undefined) {
            this.fontNameBidi = delta.fontNameBidi;
        }
        if (delta.underlineStyle !== undefined) {
            this.underlineStyle = delta.underlineStyle;
        }
        if (delta.underlineColor !== undefined) {
            this.underlineColor = delta.underlineColor;
        }
        if (delta.textColor !== undefined) {
            this.textColor = delta.textColor;
        }
        if (delta.highlightColor !== undefined) {
            this.highlightColor = delta.highlightColor;
        }
        if (delta.textBackgroundColor !== undefined) {
            this.textBackgroundColor = delta.textBackgroundColor;
        }
        if (delta.subSuperScript !== undefined) {
            this.subSuperScript = delta.subSuperScript;
        }
        if (delta.characterSpacing !== undefined) {
            this.characterSpacing = delta.characterSpacing;
        }
        if (delta.position !== undefined) {
            this.position = delta.position;
        }
        if (delta.kerning !== undefined) {
            this.kerning = delta.kerning;
        }
        if (delta.scaling !== undefined) {
            this.scaling = delta.scaling;
        }
        if (delta.border !== undefined) {
            this.border = delta.border;
        }
        if (delta.localeId !== undefined) {
            this.localeId = delta.localeId;
        }
        if (delta.localeIdBidi !== undefined) {
            this.localeIdBidi = delta.localeIdBidi;
        }
        if (delta.localeIdFarEast !== undefined) {
            this.localeIdFarEast = delta.localeIdFarEast;
        }
        if (delta.characterStyle !== undefined) {
            this.characterStyle = delta.characterStyle;
        }
        if (delta.bidi !== undefined) {
            this.bidi = delta.bidi;
        }
        if (delta.complexScript !== undefined) {
            this.complexScript = delta.complexScript;
        }
        if (delta.boldBidi !== undefined) {
            this.boldBidi = delta.boldBidi;
        }
        if (delta.italicBidi !== undefined) {
            this.italicBidi = delta.italicBidi;
        }
        if (delta.fontSizeBidi !== undefined) {
            this.fontSizeBidi = delta.fontSizeBidi;
        }
        if (delta.emphasisMark !== undefined) {
            this.emphasisMark = delta.emphasisMark;
        }
        if (delta.textEffect !== undefined) {
            this.textEffect = delta.textEffect;
        }
    }

    /**
     * Clear all typed formatting. Does not clear `rPrExtra`.
     *
     * @returns {void}
     * @public
     */
    clear(): void {
        this.styleIdValue = undefined;
        this.boldValue = undefined;
        this.italicValue = undefined;
        this.strikeValue = undefined;
        this.doubleStrikeValue = undefined;
        this.vanishValue = undefined;
        this.legacyHiddenValue = undefined;
        this.noProofValue = undefined;
        this.fontSizeValue = undefined;
        this.fontSizeBidiValue = undefined;
        this.textColorValue = undefined;
        this.textColorTheme = undefined;
        this.highlightValue = undefined;
        this.shadingValue = undefined;
        this.underlineStyleValue = undefined;
        this.underlineColorValue = undefined;
        this.vertAlignValue = undefined;
        this.smallCapsValue = undefined;
        this.allCapsValue = undefined;
        this.fontsValue = undefined;
        this.characterScaleValue = undefined;
        this.kerningValue = undefined;
        this.characterSpacingValue = undefined;
        this.positionValue = undefined;
        this.borderValue = undefined;
        this.languageValue = undefined;
        this.embossValue = undefined;
        this.imprintValue = undefined;
        this.outlineValue = undefined;
        this.shadowValue = undefined;
        this.webHiddenValue = undefined;
        this.bidiValue = undefined;
        this.complexScriptValue = undefined;
        this.boldBidiValue = undefined;
        this.italicBidiValue = undefined;
        this.emphasisValue = undefined;
        this.textEffectValue = undefined;
        this.specVanishValue = undefined;
        this.snapToGridValue = undefined;
        this.mutate();
    }

    /**
     * @param {CharacterFormatSnapshot} data - The data.
     * @returns {void} Nothing is returned.
     * @private
     * Load snapshot without exclusivity side-effects.
     */
    hydrate(data: CharacterFormatSnapshot): void {
        this.rPrExtra = data.rPrExtra;
        this.styleIdValue = data.styleIdValue;
        this.boldValue = data.boldValue;
        this.italicValue = data.italicValue;
        this.strikeValue = data.strikeValue;
        this.doubleStrikeValue = data.doubleStrikeValue;
        this.vanishValue = data.vanishValue;
        this.legacyHiddenValue = data.legacyHiddenValue;
        this.noProofValue = data.noProofValue;
        this.fontSizeValue = data.fontSizeValue;
        this.fontSizeBidiValue = data.fontSizeBidiValue;
        this.textColorValue = data.textColorValue;
        this.textColorTheme = data.textColorTheme;
        this.highlightValue = data.highlightValue;
        this.shadingValue = data.shadingValue;
        this.underlineStyleValue = data.underlineStyleValue;
        this.underlineColorValue = data.underlineColorValue;
        this.vertAlignValue = data.vertAlignValue;
        this.smallCapsValue = data.smallCapsValue;
        this.allCapsValue = data.allCapsValue;
        this.fontsValue = data.fontsValue;
        this.characterScaleValue = data.characterScaleValue;
        this.kerningValue = data.kerningValue;
        this.characterSpacingValue = data.characterSpacingValue;
        this.positionValue = data.positionValue;
        this.borderValue = data.borderValue;
        this.languageValue = data.languageValue;
        this.embossValue = data.embossValue;
        this.imprintValue = data.imprintValue;
        this.outlineValue = data.outlineValue;
        this.shadowValue = data.shadowValue;
        this.webHiddenValue = data.webHiddenValue;
        this.bidiValue = data.bidiValue;
        this.complexScriptValue = data.complexScriptValue;
        this.boldBidiValue = data.boldBidiValue;
        this.italicBidiValue = data.italicBidiValue;
        this.emphasisValue = data.emphasisValue;
        this.textEffectValue = data.textEffectValue;
        this.specVanishValue = data.specVanishValue;
        this.snapToGridValue = data.snapToGridValue;
    }

    /**
     * @returns {CharacterFormatSnapshot} The result.
     * @private
     */
    snapshot(): CharacterFormatSnapshot {
        return {
            rPrExtra: this.rPrExtra,
            styleIdValue: this.styleIdValue,
            boldValue: this.boldValue,
            italicValue: this.italicValue,
            strikeValue: this.strikeValue,
            doubleStrikeValue: this.doubleStrikeValue,
            vanishValue: this.vanishValue,
            legacyHiddenValue: this.legacyHiddenValue,
            noProofValue: this.noProofValue,
            fontSizeValue: this.fontSizeValue,
            fontSizeBidiValue: this.fontSizeBidiValue,
            textColorValue: this.textColorValue,
            textColorTheme: this.textColorTheme,
            highlightValue: this.highlightValue,
            shadingValue: this.shadingValue,
            underlineStyleValue: this.underlineStyleValue,
            underlineColorValue: this.underlineColorValue,
            vertAlignValue: this.vertAlignValue,
            smallCapsValue: this.smallCapsValue,
            allCapsValue: this.allCapsValue,
            fontsValue: this.fontsValue,
            characterScaleValue: this.characterScaleValue,
            kerningValue: this.kerningValue,
            characterSpacingValue: this.characterSpacingValue,
            positionValue: this.positionValue,
            borderValue: this.borderValue,
            languageValue: this.languageValue,
            embossValue: this.embossValue,
            imprintValue: this.imprintValue,
            outlineValue: this.outlineValue,
            shadowValue: this.shadowValue,
            webHiddenValue: this.webHiddenValue,
            bidiValue: this.bidiValue,
            complexScriptValue: this.complexScriptValue,
            boldBidiValue: this.boldBidiValue,
            italicBidiValue: this.italicBidiValue,
            emphasisValue: this.emphasisValue,
            textEffectValue: this.textEffectValue,
            specVanishValue: this.specVanishValue,
            snapToGridValue: this.snapToGridValue
        };
    }

    /**
     * @returns {OpenXmlElement[]} The result.
     * @private
     * Materialize `w:rPr` children (Spec §7.2 order).
     */
    buildRPrChildren(): OpenXmlElement[] {
        return buildRPrChildrenFromSnapshot(this.snapshot());
    }

    /**
     * @returns {CharacterFontsRecord | undefined} The result.
     * @private
     * Fonts record for style resolver / direct font parse.
     */
    fontsRecord(): CharacterFontsRecord | undefined {
        return this.fontsValue;
    }

    /**
     * Create an independent copy of this character formatting.
     * All properties are copied; no state is shared with the source.
     *
     * The cloned format is detached and has no host until hydrated or
     * attached to another character-format owner.
     *
     * @returns {CharacterFormat} Cloned character format.
     * @public
     */
    clone(): CharacterFormat {
        const cloned: CharacterFormat = new CharacterFormat(undefined);
        const snap: CharacterFormatSnapshot = this.snapshot();
        // Records are mutated in place by the setters, so they must not be shared.
        cloned.hydrate({
            ...snap,
            shadingValue: snap.shadingValue === undefined ? undefined : { ...snap.shadingValue },
            fontsValue: snap.fontsValue === undefined ? undefined : { ...snap.fontsValue },
            rPrExtra: snap.rPrExtra.slice()
        });
        return cloned;
    }
}
