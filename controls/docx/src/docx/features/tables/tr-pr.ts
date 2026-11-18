/**
 * Typed parse/serialize helpers for `w:trPr`.
 *
 * Citations: Transitional `wml.xsd` `CT_TrPrBase`, `CT_Height`, `ST_HeightRule`,
 * `ST_JcTable`.
 */
import { parseOnOff, serializeOnOff } from '../document/on-off';
import { elementChildren, isWml, wmlAttr, wmlElement } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import { emptyPropsToUndefined, parseCnfStyle, parseShd, parseDecimalVal, parseTableAlignment, pointToTwips, serializeCnfStyle, serializeShd, serializeTableAlignment, normalizeCnfStyle, normalizedCnfStyleHasTrue, CnfStyle, NormalizedCnfStyle, TableRowHeightRule, TableAlignment, TableRowHeight, TableShading, twipsToPoint, upsertPropChild, wmlAttrVal } from './tbl-pr';
import { OpenXmlAttribute } from '../../core/xml/model';
// TS 3.3: no `export type { ... }` — re-export interface via value import usage only.
function findWmlChild(parent: OpenXmlElement, localName: string): OpenXmlElement | undefined {
    for (const child of elementChildren(parent)) {
        if (isWml(child, localName)) {
            return child;
        }
    }
    return undefined;
}
function ensureTrPr(trPr: OpenXmlElement | undefined): OpenXmlElement {
    return trPr != null ? trPr : wmlElement('trPr');
}
function writeTrChild(
    trPr: OpenXmlElement | undefined,
    localName: string,
    replacement: OpenXmlElement | undefined
): OpenXmlElement | undefined {
    const next: OpenXmlElement = upsertPropChild(ensureTrPr(trPr), 'trPr', localName, replacement);
    return emptyPropsToUndefined(next);
}
// TS 3.3 / ES5 parity: avoid Object.values on the const map.
const HEIGHT_RULES: ReadonlySet<string> = new Set<string>([
    TableRowHeightRule.Auto,
    TableRowHeightRule.AtLeast,
    TableRowHeightRule.Exact
]);
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @returns {TableRowHeight | undefined} The result.
 * @private
 */
export function readRowHeight(trPr: OpenXmlElement | undefined): TableRowHeight | undefined {
    let ts330: any;
    if (trPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(trPr, 'trHeight');
    if (el === undefined) {
        return undefined;
    }
    const val: number = parseDecimalVal(wmlAttrVal(el, 'val'));
    if (val === undefined) {
        return undefined;
    }
    const ruleRaw: string = ((ts330 = wmlAttrVal(el, 'hRule')), ts330 != null ? ts330 : 'auto');
    if (!HEIGHT_RULES.has(ruleRaw)) {
        return undefined;
    }
    return {
        value: twipsToPoint(val),
        rule: ruleRaw as TableRowHeight['rule']
    };
}
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @param {TableRowHeight | undefined} height - The height.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeRowHeight(trPr: OpenXmlElement | undefined, height: TableRowHeight | undefined): OpenXmlElement | undefined {
    if (height === undefined) {
        if (trPr === undefined) {
            return undefined;
        }
        return writeTrChild(trPr, 'trHeight', undefined);
    }
    const attrs: OpenXmlAttribute[] = [
        wmlAttr('val', String(pointToTwips(height.value))),
        wmlAttr('hRule', height.rule)
    ];
    return writeTrChild(trPr, 'trHeight', wmlElement('trHeight', { attributes: attrs }));
}
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @returns {boolean | undefined} The result.
 * @private
 */
export function readRowCantSplit(trPr: OpenXmlElement | undefined): boolean | undefined {
    if (trPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(trPr, 'cantSplit');
    return el !== undefined ? parseOnOff(el) : undefined;
}
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @param {boolean | undefined} cantSplit - The cant split.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeRowCantSplit(trPr: OpenXmlElement | undefined, cantSplit: boolean | undefined): OpenXmlElement | undefined {
    if (cantSplit === undefined && trPr === undefined) {
        return undefined;
    }
    return writeTrChild(trPr, 'cantSplit', cantSplit !== undefined ? serializeOnOff('cantSplit', cantSplit) : undefined);
}
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @returns {boolean | undefined} The result.
 * @private
 */
export function readRowIsHeader(trPr: OpenXmlElement | undefined): boolean | undefined {
    if (trPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(trPr, 'tblHeader');
    return el !== undefined ? parseOnOff(el) : undefined;
}
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @param {boolean | undefined} isHeader - The is header.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeRowIsHeader(trPr: OpenXmlElement | undefined, isHeader: boolean | undefined): OpenXmlElement | undefined {
    if (isHeader === undefined && trPr === undefined) {
        return undefined;
    }
    return writeTrChild(trPr, 'tblHeader', isHeader !== undefined ? serializeOnOff('tblHeader', isHeader) : undefined);
}
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @returns {TableAlignment | undefined} The result.
 * @private
 */
export function readRowAlignment(trPr: OpenXmlElement | undefined): TableAlignment | undefined {
    if (trPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(trPr, 'jc');
    return el !== undefined ? parseTableAlignment(el) : undefined;
}
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @param {TableAlignment | undefined} alignment - The alignment.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeRowAlignment(trPr: OpenXmlElement | undefined, alignment: TableAlignment | undefined): OpenXmlElement | undefined {
    if (alignment === undefined && trPr === undefined) {
        return undefined;
    }
    return writeTrChild(trPr, 'jc', alignment !== undefined ? serializeTableAlignment(alignment) : undefined);
}
/**
 * Row shading (`w:trPr/w:shd`).
 *
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @returns {TableShading | undefined} The result.
 * @private
 */
export function readRowShading(trPr: OpenXmlElement | undefined): TableShading | undefined {
    if (trPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(trPr, 'shd');
    if (el === undefined) {
        return undefined;
    }
    const shd: TableShading = parseShd(el);
    if (shd.fill === undefined && shd.color === undefined && shd.pattern === undefined) {
        return undefined;
    }
    return shd;
}
/**
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @param {TableShading | undefined} shading - The shading.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeRowShading(trPr: OpenXmlElement | undefined, shading: TableShading | undefined): OpenXmlElement | undefined {
    if (shading === undefined && trPr === undefined) {
        return undefined;
    }
    return writeTrChild(trPr, 'shd', shading !== undefined ? serializeShd(shading) : undefined);
}
/**
 * Row conditional formatting membership (`w:trPr/w:cnfStyle` / `CT_Cnf`).
 * Preserve-only: does not recompute from table layout.
 *
 * Citations: ECMA-376-1 §17.4.7; Part 4 §14.3.1.1 / §14.11.9; Transitional `CT_Cnf`.
 *
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @returns {CnfStyle | undefined} The result.
 * @private
 */
export function readRowCnfStyle(trPr: OpenXmlElement | undefined): CnfStyle | undefined {
    if (trPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(trPr, 'cnfStyle');
    if (el === undefined) {
        return undefined;
    }
    const state: CnfStyle = parseCnfStyle(el);
    const normalized: NormalizedCnfStyle = normalizeCnfStyle(state);
    return normalizedCnfStyleHasTrue(normalized) ? state : undefined;
}
/**
 * Write or clear row `w:cnfStyle`. Passing `undefined` removes the element.
 * A supplied {@link NormalizedCnfStyle} is always written (including all-false).
 *
 * @param {OpenXmlElement | undefined} trPr - The tr pr.
 * @param {NormalizedCnfStyle | CnfStyle | undefined} state - The state.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeRowCnfStyle(
    trPr: OpenXmlElement | undefined,
    state: NormalizedCnfStyle | CnfStyle | undefined
): OpenXmlElement | undefined {
    if (state === undefined) {
        if (trPr === undefined) {
            return undefined;
        }
        return writeTrChild(trPr, 'cnfStyle', undefined);
    }
    const existing: OpenXmlElement = trPr !== undefined ? findWmlChild(trPr, 'cnfStyle') : undefined;
    const normalized: NormalizedCnfStyle = normalizeCnfStyle(state);
    return writeTrChild(trPr, 'cnfStyle', serializeCnfStyle(normalized, existing));
}
