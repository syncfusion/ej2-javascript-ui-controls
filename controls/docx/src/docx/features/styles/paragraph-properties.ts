/**
 * Modeled paragraph properties subset for styles `w:pPr` / `w:pPrDefault`.
 *
 * Spacing and indentation lengths are plain point `number`s. Codecs delegate to
 * {@link parseParagraphSpacingPoints} / {@link parseParagraphIndentationPoints}
 * and their serialize counterparts on `paragraph-format` (TASK-9020-D shared
 * ownership with body `w:pPr`).
 *
 * Citation: ECMA-376-1 §17.3.1 `w:pPr` children — `w:keepNext` (§17.3.1.14),
 * `w:keepLines` (§17.3.1.15), `w:pageBreakBefore` (§17.3.1.17),
 * `w:widowControl` (§17.3.1.29), `w:spacing` (§17.3.1.33), `w:ind`
 * (§17.3.1.12), `w:contextualSpacing` (§17.3.1.8), `w:outlineLvl`
 * (§17.3.1.31 `CT_DecimalNumber`, zero-based); Transitional `wml.xsd`
 * `CT_PPrBase`, `CT_Ind`, `CT_Spacing`; Word fixture
 * `input-documents/Sample_With_All_word_Element.docx` (`w:pPrDefault/w:pPr/w:spacing`).
 */
import {
    ParagraphIndentation,
    ParagraphSpacing,
    parseParagraphIndentationPoints,
    parseParagraphSpacingPoints,
    serializeParagraphIndentationPoints,
    serializeParagraphSpacingPoints, LineSpacingRule
} from '../document/paragraph-format';
import { parseOnOff, serializeOnOff } from '../document/on-off';
import { elementChildren, isWml, wmlAttr, wmlElement, WML } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import { OpenXmlAttribute } from '../../core/xml/model';
/**
 * Modeled paragraph properties extracted from a `w:pPr` element.
 *
 * @private
 */
export interface ModeledParagraphProperties {
    readonly spacing: ParagraphSpacing | undefined;
    readonly indentation: ParagraphIndentation | undefined;
    readonly keepNext: boolean | undefined;
    readonly keepLines: boolean | undefined;
    readonly pageBreakBefore: boolean | undefined;
    readonly widowControl: boolean | undefined;
    readonly contextualSpacing: boolean | undefined;
    /** `w:outlineLvl`, zero-based (0 = Heading 1 … 8 = Heading 9). */
    readonly outlineLevel: number | undefined;
}
export const EMPTY_MODELED_PARAGRAPH_PROPERTIES: ModeledParagraphProperties = {
    spacing: undefined,
    indentation: undefined,
    keepNext: undefined,
    keepLines: undefined,
    pageBreakBefore: undefined,
    widowControl: undefined,
    contextualSpacing: undefined,
    outlineLevel: undefined
};
function wmlAttrVal(el: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = el.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === WML || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
/**
 * Parse `w:spacing` attributes into {@link ParagraphSpacing}.
 *
 * Delegates to {@link parseParagraphSpacingPoints} (shared with body pPr).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {ParagraphSpacing | undefined} The result.
 * @private
 */
export function parseParagraphSpacing(el: OpenXmlElement): ParagraphSpacing | undefined {
    return parseParagraphSpacingPoints(el);
}
/**
 * Parse modeled paragraph properties from a `w:pPr` element.
 *
 * @param {OpenXmlElement | undefined} pPr - The p pr.
 * @returns {ModeledParagraphProperties} The result.
 * @private
 */
export function parseModeledParagraphProperties(pPr: OpenXmlElement | undefined): ModeledParagraphProperties {
    if (pPr === undefined || !isWml(pPr, 'pPr')) {
        return EMPTY_MODELED_PARAGRAPH_PROPERTIES;
    }
    let spacing: ParagraphSpacing | undefined;
    let indentation: ParagraphIndentation | undefined;
    let keepNext: boolean | undefined;
    let keepLines: boolean | undefined;
    let pageBreakBefore: boolean | undefined;
    let widowControl: boolean | undefined;
    let contextualSpacing: boolean | undefined;
    let outlineLevel: number | undefined;
    for (const child of elementChildren(pPr)) {
        if (!isWml(child, child.localName)) {
            continue;
        }
        switch (child.localName) {
        case 'spacing':
            spacing = parseParagraphSpacingPoints(child);
            continue;
        case 'ind':
            indentation = parseParagraphIndentationPoints(child);
            continue;
        case 'keepNext': {
            const flag: boolean = parseOnOff(child);
            if (flag !== undefined) {
                keepNext = flag;
            }
            continue;
        }
        case 'keepLines': {
            const flag: boolean = parseOnOff(child);
            if (flag !== undefined) {
                keepLines = flag;
            }
            continue;
        }
        case 'pageBreakBefore': {
            const flag: boolean = parseOnOff(child);
            if (flag !== undefined) {
                pageBreakBefore = flag;
            }
            continue;
        }
        case 'widowControl': {
            const flag: boolean = parseOnOff(child);
            if (flag !== undefined) {
                widowControl = flag;
            }
            continue;
        }
        case 'contextualSpacing': {
            const flag: boolean = parseOnOff(child);
            if (flag !== undefined) {
                contextualSpacing = flag;
            }
            continue;
        }
        case 'outlineLvl': {
            const raw: string = wmlAttrVal(child, 'val');
            if (raw !== undefined && /^\d$/.test(raw)) {
                const level: number = parseInt(raw, 10);
                if (level >= 0 && level <= 8) {
                    outlineLevel = level;
                }
            }
            continue;
        }
        default:
            continue;
        }
    }
    return {
        spacing,
        indentation,
        keepNext,
        keepLines,
        pageBreakBefore,
        widowControl,
        contextualSpacing,
        outlineLevel
    };
}
function mergeFlag(base: boolean | undefined, override: boolean | undefined): boolean | undefined {
    return override !== undefined ? override : base;
}
/**
 * Merge two modeled paragraph property layers (`base` ← `override`).
 * `override` fields win when defined; spacing and indentation merge
 * attribute-by-attribute.
 *
 * @param {ModeledParagraphProperties} base - The base.
 * @param {ModeledParagraphProperties} override - The override.
 * @returns {ModeledParagraphProperties} The result.
 * @private
 */
export function mergeModeledParagraphProperties(
    base: ModeledParagraphProperties,
    override: ModeledParagraphProperties
): ModeledParagraphProperties {
    const spacing: {
        before?: number;
        after?: number;
        line?: number;
        lineSpacing?: number;
        lineRule?: LineSpacingRule;
        beforeAutospacing?: boolean;
        afterAutospacing?: boolean;
    } =
        override.spacing !== undefined || base.spacing !== undefined
            ? { ...(base.spacing != null ? base.spacing : {}), ...(override.spacing != null ? override.spacing : {}) }
            : undefined;
    const indentation: { left?: number; right?: number; firstLine?: number; hanging?: number } =
        override.indentation !== undefined || base.indentation !== undefined
            ? { ...(base.indentation != null ? base.indentation : {}), ...(override.indentation != null ? override.indentation : {}) }
            : undefined;
    return {
        spacing,
        indentation,
        keepNext: mergeFlag(base.keepNext, override.keepNext),
        keepLines: mergeFlag(base.keepLines, override.keepLines),
        pageBreakBefore: mergeFlag(base.pageBreakBefore, override.pageBreakBefore),
        widowControl: mergeFlag(base.widowControl, override.widowControl),
        contextualSpacing: mergeFlag(base.contextualSpacing, override.contextualSpacing),
        outlineLevel: override.outlineLevel !== undefined ? override.outlineLevel : base.outlineLevel
    };
}
// ---------------------------------------------------------------------------
// Serialization (typed fields → w:pPr children, CT_PPrBase sequence order)
// ---------------------------------------------------------------------------
/**
 * Serialize modeled paragraph properties into a `w:pPr` element.
 *
 * Emits only defined fields, in `CT_PPrBase` sequence order
 * (keepNext → keepLines → pageBreakBefore → widowControl → spacing → ind →
 * contextualSpacing → outlineLvl). Returns `undefined` when no modeled
 * property is set — callers must not write empty payload containers.
 *
 * Spacing / ind materialize via {@link serializeParagraphSpacingPoints} /
 * {@link serializeParagraphIndentationPoints} (shared body codecs).
 *
 * @param {ModeledParagraphProperties} properties - The properties.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function serializeModeledParagraphProperties(properties: ModeledParagraphProperties): OpenXmlElement | undefined {
    const children: OpenXmlElement[] = [];
    if (properties.keepNext !== undefined) {
        children.push(serializeOnOff('keepNext', properties.keepNext));
    }
    if (properties.keepLines !== undefined) {
        children.push(serializeOnOff('keepLines', properties.keepLines));
    }
    if (properties.pageBreakBefore !== undefined) {
        children.push(serializeOnOff('pageBreakBefore', properties.pageBreakBefore));
    }
    if (properties.widowControl !== undefined) {
        children.push(serializeOnOff('widowControl', properties.widowControl));
    }
    if (properties.spacing !== undefined) {
        children.push(serializeParagraphSpacingPoints(properties.spacing));
    }
    if (properties.indentation !== undefined) {
        children.push(serializeParagraphIndentationPoints(properties.indentation));
    }
    if (properties.contextualSpacing !== undefined) {
        children.push(serializeOnOff('contextualSpacing', properties.contextualSpacing));
    }
    if (properties.outlineLevel !== undefined) {
        children.push(wmlElement('outlineLvl', { attributes: [wmlAttr('val', String(properties.outlineLevel))] }));
    }
    if (children.length === 0) {
        return undefined;
    }
    return wmlElement('pPr', { children });
}
