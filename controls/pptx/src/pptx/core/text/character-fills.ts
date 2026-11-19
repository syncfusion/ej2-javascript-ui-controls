/** Direct CT_TextCharacterProperties fill choices; never resolved paint.
 * Local dml-main.xsd EG_FillProperties, CT_LineProperties and
 * EG_TextUnderlineFill/EG_TextUnderlineLine define the independent carriers.
 */
import { TextLineStyleSnapshot, readTextLineStyle } from './text-line-style';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { ColorValue } from '../theme/color-value';
import { ThemeColorTransform } from '../theme/theme-render-model';
import { AuthoredGradientFill } from '../theme/gradient-types';
import { getGradientDrawingNamespace, readAuthoredGradient, readGradientColorTransforms } from '../theme/read-gradient';
import { tryParseColorChoiceChild } from '../theme/parse-color-choice';
import { findChild, getAttr } from '../shapes/dom-utils';
import { arrayAt } from '../util/es5-compat';
/** Direct character fill; missing and explicit none have distinct semantics. @public */
export type TextFillSnapshot = AuthoredGradientFill |
{ readonly kind: 'missing' | 'none' | 'picture' | 'group'; } |
{ readonly kind: 'pattern'; readonly preset: string | undefined; } |
{ readonly kind: 'solid'; readonly color: ColorValue | undefined;
    readonly colorTransforms: ReadonlyArray<ThemeColorTransform>; };
/** A direct line carrier, including a present line with absent fill. @public */
export type TextLineFillSnapshot = { readonly kind: 'missing'; } |
{ readonly kind: 'line'; readonly fill: TextFillSnapshot; readonly lineStyle?: TextLineStyleSnapshot; };
/** Underline line may explicitly follow glyph formatting. @public */
export type TextUnderlineLineSnapshot = TextLineFillSnapshot | { readonly kind: 'follow-text'; };
/** Underline fill may explicitly follow glyph formatting. @public */
export type TextUnderlineFillSnapshot = { readonly kind: 'missing' | 'follow-text'; } |
{ readonly kind: 'fill'; readonly fill: TextFillSnapshot; };
/** Independent authored fields; highlight and bullets remain separate APIs. @public */
export interface TextCharacterFills {
    /** Direct glyph fill; no inheritance or default materialization. */
    readonly glyphFill: TextFillSnapshot;
    /** Optional glyph outline carrier and its direct fill. */
    readonly outline: TextLineFillSnapshot;
    /** Optional underline fill or explicit follow-text choice. */
    readonly underlineFill: TextUnderlineFillSnapshot;
    /** Optional underline line or explicit follow-text choice. */
    readonly underlineLine: TextUnderlineLineSnapshot;
}
// Readonly sentinels share empty carrier state without duplicating wire objects.
const MISSING: { readonly kind: 'missing'; } = { kind: 'missing' };
const FOLLOW_TEXT: { readonly kind: 'follow-text'; } = { kind: 'follow-text' };
Object.freeze(MISSING); Object.freeze(FOLLOW_TEXT);
const EMPTY_TRANSFORMS: ReadonlyArray<ThemeColorTransform> = Object.freeze([]);
const MISSING_FILLS: TextCharacterFills = Object.freeze({ glyphFill: MISSING, outline: MISSING,
    underlineFill: MISSING, underlineLine: MISSING });
const FILLS: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
const COLORS: ReadonlyArray<string> = ['srgbClr', 'scrgbClr', 'hslClr', 'sysClr', 'schemeClr', 'prstClr'];
/**
 * Reads only direct children on rPr, defRPr or endParaRPr in either dialect.
 *
 * @internal
 * @param {OoxmlElement | undefined} properties - Optional direct character carrier.
 * @param {string} partName - Owning package part for gradient diagnostics.
 * @returns {TextCharacterFills} Clone-safe authored fields, including sparse gradients.
 */
export function readTextCharacterFills(properties: OoxmlElement | undefined, partName?: string): TextCharacterFills {
    const ns: string | undefined = properties === undefined ? undefined : getGradientDrawingNamespace(properties.namespaceUri);
    if (properties === undefined || ns !== properties.namespaceUri ||
        ['rPr', 'defRPr', 'endParaRPr'].indexOf(properties.localName) < 0) {
        return MISSING_FILLS;
    }
    const outline: OoxmlElement | undefined = findChild(properties, ns, 'ln');
    const underlineFill: OoxmlElement | undefined = choice(properties, ns, ['uFillTx', 'uFill']);
    const underlineLine: OoxmlElement | undefined = choice(properties, ns, ['uLnTx', 'uLn']);
    return {
        glyphFill: readDrawingFillChoice(properties, ns, partName),
        outline: outline === undefined ? MISSING : { kind: 'line', fill: readDrawingFillChoice(outline, ns, partName),
            ...lineStyle(outline, ns) },
        underlineFill: underlineFill === undefined ? MISSING : underlineFill.localName === 'uFillTx' ?
            FOLLOW_TEXT : { kind: 'fill', fill: readDrawingFillChoice(underlineFill, ns, partName) },
        underlineLine: underlineLine === undefined ? MISSING : underlineLine.localName === 'uLnTx' ?
            FOLLOW_TEXT : { kind: 'line', fill: readDrawingFillChoice(underlineLine, ns, partName),
                ...lineStyle(underlineLine, ns) }
    };
}
/**
 * Supports an additive sparse wire field: absence means all carriers are missing.
 *
 * @internal
 * @param {TextCharacterFills} value - Complete direct snapshot.
 * @returns {boolean} Whether any carrier is explicitly authored.
 */
export function hasTextCharacterFills(value: TextCharacterFills): boolean {
    return value.glyphFill.kind !== 'missing' || value.outline.kind !== 'missing' ||
        value.underlineFill.kind !== 'missing' || value.underlineLine.kind !== 'missing';
}
/**
 * Shared DrawingML fill choice parser, also used by table style carriers.
 *
 * @internal
 * @param {OoxmlElement} parent - Direct fill owner, excluding nested effects/colors.
 * @param {string} ns - Exact owning dialect namespace.
 * @param {string | undefined} partName - Diagnostic identity.
 * @param {ReadonlyMap<OoxmlElement, AuthoredGradientFill>} gradients - Optional part-local parsed gradient cache.
 * @returns {TextFillSnapshot} Selected direct fill choice, without fallback.
 */
export function readDrawingFillChoice(parent: OoxmlElement, ns: string, partName: string | undefined,
                                      gradients?: ReadonlyMap<OoxmlElement, AuthoredGradientFill>): TextFillSnapshot {
    if (parent.namespaceUri !== ns || getGradientDrawingNamespace(ns) !== ns) { return MISSING; }
    return readDrawingFillProperties(parent, ns, partName, gradients);
}
/**
 * Reads DrawingML fill children of an independently validated shape-properties carrier (including c:spPr).
 *
 * @param {OoxmlElement} parent - Exact source owner validated by its domain adapter.
 * @param {string} ns - DrawingML main namespace of the owning dialect.
 * @param {string | undefined} partName - Source identity.
 * @param {ReadonlyMap<OoxmlElement, AuthoredGradientFill>} gradients - Optional parsed source gradient reuse.
 * @returns {TextFillSnapshot} Direct authored choice without changing the carrier namespace.
 * @internal
 */
export function readDrawingFillProperties(parent: OoxmlElement, ns: string, partName: string | undefined,
                                          gradients?: ReadonlyMap<OoxmlElement, AuthoredGradientFill>): TextFillSnapshot {
    if (getGradientDrawingNamespace(ns) !== ns) { return MISSING; }
    const fill: OoxmlElement | undefined = choice(parent, ns, FILLS);
    if (fill === undefined) { return MISSING; }
    const gradient: AuthoredGradientFill | undefined = (gradients === undefined ? undefined : gradients.get(fill)) ||
        readAuthoredGradient(fill, partName);
    if (gradient !== undefined) { return gradient; }
    switch (fill.localName) {
    case 'noFill': return { kind: 'none' };
    case 'grpFill': return { kind: 'group' };
    case 'blipFill': return { kind: 'picture' };
    case 'pattFill': return { kind: 'pattern', preset: getAttr(fill, '', 'prst') };
    default: {
        const color: OoxmlElement | undefined = choice(fill, ns, COLORS);
        const transforms: ReadonlyArray<ThemeColorTransform> = color === undefined || color.children.length === 0 ?
            EMPTY_TRANSFORMS : readGradientColorTransforms(color, ns,
                                                           ns === 'http://purl.oclc.org/ooxml/drawingml/main' ? 'strict' : 'transitional');
        return { kind: 'solid', color: tryParseColorChoiceChild(fill, ns), colorTransforms: transforms };
    }
    }
}
/**
 * @param {OoxmlElement} parent - Carrier whose direct children are inspected.
 * @param {string} ns - Exact namespace, never a prefix hint.
 * @param {ReadonlyArray<string>} names - Recognized schema alternatives.
 * @returns {OoxmlElement | undefined} First selected direct alternative.
 */
function choice(parent: OoxmlElement, ns: string, names: ReadonlyArray<string>): OoxmlElement | undefined {
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === ns && names.indexOf(child.localName) >= 0) { return child; }
    }
    return undefined;
}

/** @param {OoxmlElement} carrier - Native text line carrier.
 * @param {string} namespace - Exact dialect.
 * @returns {Object} Present-only sparse metadata. */
function lineStyle(carrier: OoxmlElement, namespace: string): { readonly lineStyle?: TextLineStyleSnapshot } {
    const style: TextLineStyleSnapshot | undefined = readTextLineStyle(carrier, namespace);
    return style ? { lineStyle: style } : {};
}
