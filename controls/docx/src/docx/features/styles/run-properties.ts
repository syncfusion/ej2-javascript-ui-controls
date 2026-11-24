import { parseOnOff, serializeOnOff } from '../document/on-off';
import { TextRange } from '../document/text-range';
import { pointToHalfPoints, halfPointsToPoint } from '../document/length';
import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute, WML } from '../document/wml';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { parseThemeFontSlot, ThemeFontSlot } from './theme';
import { CharacterFontsRecord } from '../document/character-format';
/**
 * Modeled language tags from `w:lang` (`CT_Language`).
 *
 * @private
 */
export interface ModeledRunLanguage {
    readonly val: string | undefined;
    readonly eastAsia: string | undefined;
    readonly bidi: string | undefined;
}
/**
 * Underline kind.
 *
 * @public
 */
export type RunUnderlineKind = 'single' | 'words' | 'double' | 'thick' | 'dotted' | 'dottedHeavy' | 'dash' | 'dashedHeavy' | 'dashLong' | 'dashLongHeavy' | 'dotDash' | 'dashDotHeavy' | 'dotDotDash' | 'dashDotDotHeavy' | 'wave' | 'wavyHeavy' | 'wavyDouble' | 'none';
/**
 * `w:u` payload. §17.3.2.40 (`CT_Underline`). Internal underline record. Not part of the public API.
 *
 * @private
 */
export interface ModeledRunUnderline {
    readonly kind: RunUnderlineKind;
    /** `@w:color` (`ST_HexColor`, `auto` allowed). */
    readonly color: string | undefined;
}
/**
 * Vertical alignment.
 *
 * @public
 */
export type RunVerticalAlignment = 'baseline' | 'superscript' | 'subscript';
/**
 * Font hint.
 *
 * @public
 */
export type RunFontHint = 'default' | 'eastAsia';
/**
 * Modeled run properties extracted from a `w:rPr` element. *
 *
 * @private
 */
export interface ModeledRunProperties {
    readonly bold: boolean | undefined;
    readonly boldCs: boolean | undefined;
    readonly italic: boolean | undefined;
    readonly italicCs: boolean | undefined;
    /** Font size in points (`w:sz` half-points on the wire). */
    readonly fontSize: number | undefined;
    /** Complex-script font size in points (`w:szCs` half-points on the wire). */
    readonly fontSizeCs: number | undefined;
    /** Kerning threshold in points (`w:kern` / `CT_HpsMeasure` half-points → pt). */
    readonly kerning: number | undefined;
    readonly asciiFont: string | undefined;
    readonly hAnsiFont: string | undefined;
    /** Explicit East-Asian font name (`w:rFonts/@w:eastAsia`). */
    readonly eastAsiaFont: string | undefined;
    /** Complex-script font name (`w:rFonts/@w:cs`). */
    readonly csFont: string | undefined;
    /** Font hint (`w:rFonts/@w:hint`). */
    readonly fontHint: RunFontHint | undefined;
    readonly asciiTheme: ThemeFontSlot | undefined;
    readonly hAnsiTheme: ThemeFontSlot | undefined;
    readonly eastAsiaTheme: ThemeFontSlot | undefined;
    readonly csTheme: ThemeFontSlot | undefined;
    readonly underline: ModeledRunUnderline | undefined;
    /** Font color (`w:color/@w:val`, `ST_HexColor`; `auto` preserved verbatim). */
    readonly color: string | undefined;
    readonly vertAlign: RunVerticalAlignment | undefined;
    readonly lang: ModeledRunLanguage | undefined;
}
export const EMPTY_MODELED_RUN_PROPERTIES: ModeledRunProperties = {
    bold: undefined,
    boldCs: undefined,
    italic: undefined,
    italicCs: undefined,
    fontSize: undefined,
    fontSizeCs: undefined,
    kerning: undefined,
    asciiFont: undefined,
    hAnsiFont: undefined,
    eastAsiaFont: undefined,
    csFont: undefined,
    fontHint: undefined,
    asciiTheme: undefined,
    hAnsiTheme: undefined,
    eastAsiaTheme: undefined,
    csTheme: undefined,
    underline: undefined,
    color: undefined,
    vertAlign: undefined,
    lang: undefined
};
const UNDERLINE_KINDS: ReadonlySet<string> = new Set([
    'single', 'words', 'double', 'thick', 'dotted', 'dottedHeavy', 'dash',
    'dashedHeavy', 'dashLong', 'dashLongHeavy', 'dotDash', 'dashDotHeavy',
    'dotDotDash', 'dashDotDotHeavy', 'wave', 'wavyHeavy', 'wavyDouble', 'none'
]);
const VERTICAL_ALIGNMENTS: ReadonlySet<string> = new Set([
    'baseline', 'superscript', 'subscript'
]);
const FONT_HINTS: ReadonlySet<string> = new Set(['default', 'eastAsia']);
/** `ST_HexColor` (`ST_HexColorAuto` | 6-digit `ST_HexColorRGB`). */
const HEX_COLOR_PATTERN: RegExp = /^([0-9A-Fa-f]{6}|auto)$/;
function parseUnderlineKind(raw: string | undefined): RunUnderlineKind | undefined {
    return raw !== undefined && UNDERLINE_KINDS.has(raw) ? (raw as RunUnderlineKind) : undefined;
}
function parseVerticalAlignment(raw: string | undefined): RunVerticalAlignment | undefined {
    return raw !== undefined && VERTICAL_ALIGNMENTS.has(raw)
        ? (raw as RunVerticalAlignment)
        : undefined;
}
function parseFontHint(raw: string | undefined): RunFontHint | undefined {
    return raw !== undefined && FONT_HINTS.has(raw) ? (raw as RunFontHint) : undefined;
}
function wRFontsAttribute(rFonts: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = rFonts.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName && (attribute.namespaceUri === WML || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function wLangAttribute(lang: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = lang.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName && (attribute.namespaceUri === WML || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function parseRFontsElement(rFonts: OpenXmlElement): Pick<ModeledRunProperties, 'asciiFont' | 'hAnsiFont' | 'eastAsiaFont' | 'csFont' | 'fontHint' | 'asciiTheme' | 'hAnsiTheme' | 'eastAsiaTheme' | 'csTheme'> {
    const ascii: string = wRFontsAttribute(rFonts, 'ascii');
    const hAnsi: string = wRFontsAttribute(rFonts, 'hAnsi');
    const eastAsia: string = wRFontsAttribute(rFonts, 'eastAsia');
    const cs: string = wRFontsAttribute(rFonts, 'cs');
    const asciiTheme: ThemeFontSlot = parseThemeFontSlot(wRFontsAttribute(rFonts, 'asciiTheme'));
    const hAnsiTheme: ThemeFontSlot = parseThemeFontSlot(wRFontsAttribute(rFonts, 'hAnsiTheme'));
    const eastAsiaTheme: ThemeFontSlot = parseThemeFontSlot(wRFontsAttribute(rFonts, 'eastAsiaTheme'));
    const csTheme: ThemeFontSlot = parseThemeFontSlot(wRFontsAttribute(rFonts, 'cstheme'));
    return {
        asciiFont: ascii !== undefined ? ascii : undefined,
        hAnsiFont: hAnsi !== undefined ? hAnsi : undefined,
        eastAsiaFont: eastAsia !== undefined ? eastAsia : undefined,
        csFont: cs !== undefined ? cs : undefined,
        fontHint: parseFontHint(wRFontsAttribute(rFonts, 'hint')),
        asciiTheme: ascii === undefined ? asciiTheme : undefined,
        hAnsiTheme: hAnsi === undefined ? hAnsiTheme : undefined,
        eastAsiaTheme: eastAsia === undefined ? eastAsiaTheme : undefined,
        csTheme: cs === undefined ? csTheme : undefined
    };
}
function parseLangElement(lang: OpenXmlElement): ModeledRunLanguage | undefined {
    const val: string = wLangAttribute(lang, 'val');
    const eastAsia: string = wLangAttribute(lang, 'eastAsia');
    const bidi: string = wLangAttribute(lang, 'bidi');
    if (val === undefined && eastAsia === undefined && bidi === undefined) {
        return undefined;
    }
    return { val, eastAsia, bidi };
}
function parseHpsMeasureToLength(element: OpenXmlElement): number | undefined {
    const raw: string = wValAttribute(element);
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    return halfPointsToPoint(parseInt(raw, 10));
}
export function parseModeledRunProperties(rPr: OpenXmlElement | undefined): ModeledRunProperties {
    if (rPr === undefined || !isWml(rPr, 'rPr')) {
        return EMPTY_MODELED_RUN_PROPERTIES;
    }
    let bold: boolean | undefined;
    let boldCs: boolean | undefined;
    let italic: boolean | undefined;
    let italicCs: boolean | undefined;
    let fontSize: number | undefined;
    let fontSizeCs: number | undefined;
    let kerning: number | undefined;
    let asciiFont: string | undefined;
    let hAnsiFont: string | undefined;
    let eastAsiaFont: string | undefined;
    let csFont: string | undefined;
    let fontHint: RunFontHint | undefined;
    let asciiTheme: ThemeFontSlot | undefined;
    let hAnsiTheme: ThemeFontSlot | undefined;
    let eastAsiaTheme: ThemeFontSlot | undefined;
    let csTheme: ThemeFontSlot | undefined;
    let underline: ModeledRunUnderline | undefined;
    let color: string | undefined;
    let vertAlign: RunVerticalAlignment | undefined;
    let lang: ModeledRunLanguage | undefined;
    for (const prop of elementChildren(rPr)) {
        if (!isWml(prop, prop.localName)) {
            continue;
        }
        if (prop.localName === 'rFonts') {
            const fonts: Pick<ModeledRunProperties, 'asciiFont' | 'hAnsiFont' | 'eastAsiaFont' | 'csFont' | 'fontHint' | 'asciiTheme' | 'hAnsiTheme' | 'eastAsiaTheme' | 'csTheme'> = parseRFontsElement(prop);
            asciiFont = fonts.asciiFont;
            hAnsiFont = fonts.hAnsiFont;
            eastAsiaFont = fonts.eastAsiaFont;
            csFont = fonts.csFont;
            fontHint = fonts.fontHint;
            asciiTheme = fonts.asciiTheme;
            hAnsiTheme = fonts.hAnsiTheme;
            eastAsiaTheme = fonts.eastAsiaTheme;
            csTheme = fonts.csTheme;
            continue;
        }
        if (prop.localName === 'sz') {
            fontSize = parseHpsMeasureToLength(prop);
            continue;
        }
        if (prop.localName === 'szCs') {
            fontSizeCs = parseHpsMeasureToLength(prop);
            continue;
        }
        if (prop.localName === 'kern') {
            kerning = parseHpsMeasureToLength(prop);
            continue;
        }
        if (prop.localName === 'lang') {
            lang = parseLangElement(prop);
            continue;
        }
        if (prop.localName === 'u') {
            const kind: RunUnderlineKind = parseUnderlineKind(wValAttribute(prop));
            if (kind !== undefined) {
                const uColor: string = wRFontsAttribute(prop, 'color');
                underline = {
                    kind,
                    color: uColor !== undefined ? uColor : undefined
                };
            }
            continue;
        }
        if (prop.localName === 'color') {
            const val: string = wValAttribute(prop);
            if (val !== undefined && HEX_COLOR_PATTERN.test(val)) {
                color = val;
            }
            continue;
        }
        if (prop.localName === 'vertAlign') {
            vertAlign = parseVerticalAlignment(wValAttribute(prop));
            continue;
        }
        if (prop.localName !== 'b' && prop.localName !== 'i' && prop.localName !== 'bCs' && prop.localName !== 'iCs') {
            continue;
        }
        const flag: boolean = parseOnOff(prop);
        if (flag === undefined) {
            continue;
        }
        if (prop.localName === 'b') {
            bold = flag;
        }
        else if (prop.localName === 'i') {
            italic = flag;
        }
        else if (prop.localName === 'bCs') {
            boldCs = flag;
        }
        else {
            italicCs = flag;
        }
    }
    return {
        bold,
        boldCs,
        italic,
        italicCs,
        fontSize,
        fontSizeCs,
        kerning,
        asciiFont,
        hAnsiFont,
        eastAsiaFont,
        csFont,
        fontHint,
        asciiTheme,
        hAnsiTheme,
        eastAsiaTheme,
        csTheme,
        underline,
        color,
        vertAlign,
        lang
    };
}
function mergeFontSlot(
    baseFont: string | undefined,
    baseTheme: ThemeFontSlot | undefined,
    overrideFont: string | undefined,
    overrideTheme: ThemeFontSlot | undefined
): { readonly font: string | undefined; readonly theme: ThemeFontSlot | undefined } {
    if (overrideFont !== undefined) {
        return { font: overrideFont, theme: undefined };
    }
    if (overrideTheme !== undefined) {
        return { font: undefined, theme: overrideTheme };
    }
    return { font: baseFont, theme: baseTheme };
}
/**
 *  Character slot merge: explicit name wins over theme slot; absent falls back.
 *
 * @param {string | undefined} baseFont - Specifies the base font.
 * @param {ThemeFontSlot | undefined} baseTheme - Specifies the base theme.
 * @param {string | undefined} overrideFont - Specifies the override font.
 * @param {ThemeFontSlot | undefined} overrideTheme - Specifies the override theme.
 * @returns {Object} Returns the result.
 */
function mergeNamedThemeSlot(
    baseFont: string | undefined,
    baseTheme: ThemeFontSlot | undefined,
    overrideFont: string | undefined,
    overrideTheme: ThemeFontSlot | undefined
): { readonly font: string | undefined; readonly theme: ThemeFontSlot | undefined } {
    if (overrideFont !== undefined) {
        return { font: overrideFont, theme: undefined };
    }
    if (overrideTheme !== undefined) {
        return { font: undefined, theme: overrideTheme };
    }
    return { font: baseFont, theme: baseTheme };
}
function mergeLang(base: ModeledRunLanguage | undefined, override: ModeledRunLanguage | undefined): ModeledRunLanguage | undefined {
    if (override === undefined) {
        return base;
    }
    if (base === undefined) {
        return override;
    }
    return {
        val: override.val !== undefined ? override.val : base.val,
        eastAsia: override.eastAsia !== undefined ? override.eastAsia : base.eastAsia,
        bidi: override.bidi !== undefined ? override.bidi : base.bidi
    };
}
export function mergeModeledRunProperties(base: ModeledRunProperties, override: ModeledRunProperties): ModeledRunProperties {
    const ascii: { readonly font: string; readonly theme: ThemeFontSlot } = mergeFontSlot(
        base.asciiFont,
        base.asciiTheme,
        override.asciiFont,
        override.asciiTheme
    );
    const hAnsi: { readonly font: string; readonly theme: ThemeFontSlot } = mergeFontSlot(
        base.hAnsiFont,
        base.hAnsiTheme,
        override.hAnsiFont,
        override.hAnsiTheme
    );
    const eastAsia: { readonly font: string; readonly theme: ThemeFontSlot } = mergeNamedThemeSlot(
        base.eastAsiaFont,
        base.eastAsiaTheme,
        override.eastAsiaFont,
        override.eastAsiaTheme
    );
    const cs: { readonly font: string; readonly theme: ThemeFontSlot } = mergeNamedThemeSlot(
        base.csFont,
        base.csTheme,
        override.csFont,
        override.csTheme
    );
    return {
        bold: override.bold !== undefined ? override.bold : base.bold,
        boldCs: override.boldCs !== undefined ? override.boldCs : base.boldCs,
        italic: override.italic !== undefined ? override.italic : base.italic,
        italicCs: override.italicCs !== undefined ? override.italicCs : base.italicCs,
        fontSize: override.fontSize !== undefined ? override.fontSize : base.fontSize,
        fontSizeCs: override.fontSizeCs !== undefined ? override.fontSizeCs : base.fontSizeCs,
        kerning: override.kerning !== undefined ? override.kerning : base.kerning,
        asciiFont: ascii.font,
        hAnsiFont: hAnsi.font,
        eastAsiaFont: eastAsia.font,
        csFont: cs.font,
        fontHint: override.fontHint !== undefined ? override.fontHint : base.fontHint,
        asciiTheme: ascii.theme,
        hAnsiTheme: hAnsi.theme,
        eastAsiaTheme: eastAsia.theme,
        csTheme: cs.theme,
        underline: override.underline !== undefined ? override.underline : base.underline,
        color: override.color !== undefined ? override.color : base.color,
        vertAlign: override.vertAlign !== undefined ? override.vertAlign : base.vertAlign,
        lang: mergeLang(base.lang, override.lang)
    };
}
/**
 *  Parse direct `w:rFonts` from the run's {@link TextRange.characterFormat} fonts record.
 *
 * @param {TextRange} run - The run.
 * @returns {Pick<ModeledRunProperties, string | string | string | string | string | string | string | string | string>} The result.
 * @private
 */
export function parseDirectRunFontProperties(run: TextRange): Pick<ModeledRunProperties, 'asciiFont' | 'hAnsiFont' | 'eastAsiaFont' | 'csFont' | 'fontHint' | 'asciiTheme' | 'hAnsiTheme' | 'eastAsiaTheme' | 'csTheme'> {
    const fonts: CharacterFontsRecord = run.characterFormat.fontsRecord();
    if (fonts === undefined) {
        return {
            asciiFont: undefined,
            hAnsiFont: undefined,
            eastAsiaFont: undefined,
            csFont: undefined,
            fontHint: undefined,
            asciiTheme: undefined,
            hAnsiTheme: undefined,
            eastAsiaTheme: undefined,
            csTheme: undefined
        };
    }
    const hintRaw: string = fonts.hint;
    const fontHint: RunFontHint | undefined =
        hintRaw === 'default' || hintRaw === 'eastAsia' ? hintRaw : undefined;
    return {
        asciiFont: fonts.ascii,
        hAnsiFont: fonts.hAnsi,
        eastAsiaFont: fonts.eastAsia,
        csFont: fonts.cs,
        fontHint: fontHint,
        asciiTheme: parseThemeFontSlot(fonts.asciiTheme),
        hAnsiTheme: parseThemeFontSlot(fonts.hAnsiTheme),
        eastAsiaTheme: parseThemeFontSlot(fonts.eastAsiaTheme),
        csTheme: parseThemeFontSlot(fonts.cTheme)
    };
}
export interface StyleRunDefinition {
    readonly basedOn: string | undefined;
    readonly runProperties: ModeledRunProperties;
}
export function parseStyleRunDefinition(style: OpenXmlElement): StyleRunDefinition {
    let basedOn: string | undefined;
    let rPr: OpenXmlElement | undefined;
    for (const child of elementChildren(style)) {
        if (isWml(child, 'basedOn')) {
            basedOn = wValAttribute(child);
            continue;
        }
        if (isWml(child, 'rPr')) {
            rPr = child;
        }
    }
    return {
        basedOn,
        runProperties: parseModeledRunProperties(rPr)
    };
}
/**
 * Modeled run properties from a `w:docDefaults` element (or any element that nests
 * `w:rPrDefault/w:rPr`). Prefer {@link DocDefaults.runProperties} when a typed
 * defaults object is already available.
 *
 * @param {OpenXmlElement | undefined} docDefaultsRoot - The doc defaults root.
 * @returns {ModeledRunProperties} The result.
 * @private
 */
export function parseDocDefaultsRunProperties(docDefaultsRoot: OpenXmlElement | undefined): ModeledRunProperties {
    if (docDefaultsRoot === undefined || !isWml(docDefaultsRoot, 'docDefaults')) {
        return EMPTY_MODELED_RUN_PROPERTIES;
    }
    for (const defaultsChild of elementChildren(docDefaultsRoot)) {
        if (!isWml(defaultsChild, 'rPrDefault')) {
            continue;
        }
        for (const rPrDefaultChild of elementChildren(defaultsChild)) {
            if (isWml(rPrDefaultChild, 'rPr')) {
                return parseModeledRunProperties(rPrDefaultChild);
            }
        }
    }
    return EMPTY_MODELED_RUN_PROPERTIES;
}
export function effectiveBold(properties: ModeledRunProperties): boolean {
    return properties.bold != null ? properties.bold : false;
}
export function effectiveItalic(properties: ModeledRunProperties): boolean {
    return properties.italic != null ? properties.italic : false;
}
// ---------------------------------------------------------------------------
// Serialization (typed fields → w:rPr children, EG_RPrBase sequence order)
// ---------------------------------------------------------------------------
/**
 *  Point → `ST_HpsMeasure` half-point string (12 pt → "24").
 *
 * @param {number} value - Specifies the value.
 * @returns {string} Returns the result.
 */
function serializeHpsMeasure(value: number): string {
    return String(pointToHalfPoints(value));
}
/**
 * Serialize modeled run properties into a `w:rPr` element.
 *
 * Emits only defined fields, in `EG_RPrBase` sequence order
 * (rFonts → b → bCs → i → iCs → color → kern → sz → szCs → u → vertAlign →
 * lang). Returns `undefined` when no modeled property is set — callers must
 * not write empty payload containers.
 *
 * @param {ModeledRunProperties} properties - The properties.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function serializeModeledRunProperties(properties: ModeledRunProperties): OpenXmlElement | undefined {
    const children: OpenXmlElement[] = [];
    if (properties.asciiFont !== undefined ||
        properties.hAnsiFont !== undefined ||
        properties.eastAsiaFont !== undefined ||
        properties.csFont !== undefined ||
        properties.fontHint !== undefined ||
        properties.asciiTheme !== undefined ||
        properties.hAnsiTheme !== undefined ||
        properties.eastAsiaTheme !== undefined ||
        properties.csTheme !== undefined) {
        const attributes: OpenXmlAttribute[] = [];
        if (properties.asciiFont !== undefined) {
            attributes.push(wmlAttr('ascii', properties.asciiFont));
        }
        if (properties.hAnsiFont !== undefined) {
            attributes.push(wmlAttr('hAnsi', properties.hAnsiFont));
        }
        if (properties.eastAsiaFont !== undefined) {
            attributes.push(wmlAttr('eastAsia', properties.eastAsiaFont));
        }
        if (properties.csFont !== undefined) {
            attributes.push(wmlAttr('cs', properties.csFont));
        }
        if (properties.asciiTheme !== undefined) {
            attributes.push(wmlAttr('asciiTheme', properties.asciiTheme));
        }
        if (properties.hAnsiTheme !== undefined) {
            attributes.push(wmlAttr('hAnsiTheme', properties.hAnsiTheme));
        }
        if (properties.eastAsiaTheme !== undefined) {
            attributes.push(wmlAttr('eastAsiaTheme', properties.eastAsiaTheme));
        }
        if (properties.csTheme !== undefined) {
            attributes.push(wmlAttr('cstheme', properties.csTheme));
        }
        if (properties.fontHint !== undefined) {
            attributes.push(wmlAttr('hint', properties.fontHint));
        }
        children.push(wmlElement('rFonts', { attributes }));
    }
    if (properties.bold !== undefined) {
        children.push(serializeOnOff('b', properties.bold));
    }
    if (properties.boldCs !== undefined) {
        children.push(serializeOnOff('bCs', properties.boldCs));
    }
    if (properties.italic !== undefined) {
        children.push(serializeOnOff('i', properties.italic));
    }
    if (properties.italicCs !== undefined) {
        children.push(serializeOnOff('iCs', properties.italicCs));
    }
    if (properties.color !== undefined) {
        children.push(wmlElement('color', { attributes: [wmlAttr('val', properties.color)] }));
    }
    if (properties.kerning !== undefined) {
        children.push(wmlElement('kern', { attributes: [wmlAttr('val', serializeHpsMeasure(properties.kerning))] }));
    }
    if (properties.fontSize !== undefined) {
        children.push(wmlElement('sz', { attributes: [wmlAttr('val', serializeHpsMeasure(properties.fontSize))] }));
    }
    if (properties.fontSizeCs !== undefined) {
        children.push(wmlElement('szCs', { attributes: [wmlAttr('val', serializeHpsMeasure(properties.fontSizeCs))] }));
    }
    if (properties.underline !== undefined) {
        const attributes: OpenXmlAttribute[] = [wmlAttr('val', properties.underline.kind)];
        if (properties.underline.color !== undefined) {
            attributes.push(wmlAttr('color', properties.underline.color));
        }
        children.push(wmlElement('u', { attributes }));
    }
    if (properties.vertAlign !== undefined) {
        children.push(wmlElement('vertAlign', { attributes: [wmlAttr('val', properties.vertAlign)] }));
    }
    if (properties.lang !== undefined) {
        const attributes: OpenXmlAttribute[] = [];
        if (properties.lang.val !== undefined) {
            attributes.push(wmlAttr('val', properties.lang.val));
        }
        if (properties.lang.eastAsia !== undefined) {
            attributes.push(wmlAttr('eastAsia', properties.lang.eastAsia));
        }
        if (properties.lang.bidi !== undefined) {
            attributes.push(wmlAttr('bidi', properties.lang.bidi));
        }
        if (attributes.length > 0) {
            children.push(wmlElement('lang', { attributes }));
        }
    }
    if (children.length === 0) {
        return undefined;
    }
    return wmlElement('rPr', { children });
}
