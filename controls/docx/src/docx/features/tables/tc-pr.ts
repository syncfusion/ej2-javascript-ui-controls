/**
 * Typed parse/serialize helpers for `w:tcPr`.
 *
 * Citations: Transitional `wml.xsd` `CT_TcPrBase`, `CT_TblWidth`, `CT_TcBorders`,
 * `CT_TcMar`, `ST_TextDirection`, `ST_VerticalJc`, `ST_Merge`.
 */
import { parseOnOff, serializeOnOff } from '../document/on-off';
import { elementChildren, isWml, wValAttribute, wmlAttr, wmlElement } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import { emptyPropsToUndefined, normalizeCnfStyle, normalizedCnfStyleHasTrue, parseCellMargins, parseCnfStyle, parseShd, parseTblWidth, parseTcBorders, serializeCellMargins, serializeCnfStyle, serializeShd, serializeTblWidth, serializeTcBorders, twipsToPoint, CnfStyle, NormalizedCnfStyle, TableCellBorders, TableCellMargins, TableShading, TableWidth, upsertPropChild } from './tbl-pr';
/** Explicit zero cell margins used when leaving table padding inheritance. */
const ZERO_CELL_MARGINS: TableCellMargins = {
    top: twipsToPoint(0),
    left: twipsToPoint(0),
    bottom: twipsToPoint(0),
    right: twipsToPoint(0)
};
/**
 * Specifies how a table cell is merged vertically with adjacent cells.
 *
 * @public
 */
export type VerticalMerge = 'restart' | 'continue';
/**
 * Cell text direction.
 *
 * @public
 */
export type TableCellTextDirection = 'lr' | 'rl' | 'tb' | 'btLr' | 'lrV' | 'rlV';
/**
 * Cell vertical alignment.
 *
 * - {@link TableCellVerticalAlignment.Top}: top of the cell (default).
 * - {@link TableCellVerticalAlignment.Center}: middle of the cell.
 * - {@link TableCellVerticalAlignment.Bottom}: bottom of the cell.
 *
 * @public
 */
export enum TableCellVerticalAlignment {
    /** Specifies the top alignment. */
    Top = 'top',
    /** Specifies the center alignment. */
    Center = 'center',
    /** Specifies the bottom alignment. */
    Bottom = 'bottom'
}
function findWmlChild(parent: OpenXmlElement, localName: string): OpenXmlElement | undefined {
    for (const child of elementChildren(parent)) {
        if (isWml(child, localName)) {
            return child;
        }
    }
    return undefined;
}
function readDecimalChild(tcPr: OpenXmlElement, localName: string): number | undefined {
    for (const child of elementChildren(tcPr)) {
        if (!isWml(child, localName)) {
            continue;
        }
        const raw: string = wValAttribute(child);
        if (raw !== undefined && /^\d+$/.test(raw)) {
            return parseInt(raw, 10);
        }
    }
    return undefined;
}
function readVerticalMergeChild(tcPr: OpenXmlElement): VerticalMerge | undefined {
    for (const child of elementChildren(tcPr)) {
        if (!isWml(child, 'vMerge')) {
            continue;
        }
        const val: string = wValAttribute(child);
        if (val === 'restart') {
            return 'restart';
        }
        if (val === 'continue' || val === undefined) {
            return 'continue';
        }
    }
    return undefined;
}
function upsertTcPrChild(tcPr: OpenXmlElement, localName: string, replacement: OpenXmlElement | undefined): OpenXmlElement {
    return upsertPropChild(tcPr, 'tcPr', localName, replacement);
}
function ensureTcPr(tcPr: OpenXmlElement | undefined): OpenXmlElement {
    return tcPr != null ? tcPr : wmlElement('tcPr');
}
function writeTcChild(
    tcPr: OpenXmlElement | undefined,
    localName: string,
    replacement: OpenXmlElement | undefined
): OpenXmlElement | undefined {
    const next: OpenXmlElement = upsertTcPrChild(ensureTcPr(tcPr), localName, replacement);
    return emptyPropsToUndefined(next);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {number | undefined} The result.
 * @private
 */
export function readGridSpan(tcPr: OpenXmlElement | undefined): number | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    return readDecimalChild(tcPr, 'gridSpan');
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {VerticalMerge | undefined} The result.
 * @private
 */
export function readVerticalMerge(tcPr: OpenXmlElement | undefined): VerticalMerge | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    return readVerticalMergeChild(tcPr);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {number | undefined} span - The span.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeGridSpan(tcPr: OpenXmlElement | undefined, span: number | undefined): OpenXmlElement | undefined {
    // Absent and span===1 both mean one column — omit the element (ECMA / Word UI).
    if (span === undefined || span === 1) {
        if (tcPr === undefined) {
            return undefined;
        }
        return writeTcChild(tcPr, 'gridSpan', undefined);
    }
    if (span < 1) {
        throw new RangeError('gridSpan must be at least 1');
    }
    const element: OpenXmlElement = wmlElement('gridSpan', { attributes: [wmlAttr('val', String(span))] });
    return writeTcChild(tcPr, 'gridSpan', element);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {VerticalMerge | undefined} merge - The merge.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeVerticalMerge(tcPr: OpenXmlElement | undefined, merge: VerticalMerge | undefined): OpenXmlElement | undefined {
    if (merge === undefined) {
        if (tcPr === undefined) {
            return undefined;
        }
        return writeTcChild(tcPr, 'vMerge', undefined);
    }
    const element: OpenXmlElement = merge === 'restart'
        ? wmlElement('vMerge', { attributes: [wmlAttr('val', 'restart')] })
        : wmlElement('vMerge', { attributes: [wmlAttr('val', 'continue')] });
    return writeTcChild(tcPr, 'vMerge', element);
}
function readHorizontalMergeChild(tcPr: OpenXmlElement): VerticalMerge | undefined {
    for (const child of elementChildren(tcPr)) {
        if (!isWml(child, 'hMerge')) {
            continue;
        }
        const val: string = wValAttribute(child);
        if (val === 'restart') {
            return 'restart';
        }
        if (val === 'continue' || val === undefined) {
            return 'continue';
        }
    }
    return undefined;
}
/**
 * Horizontal merge setting on `w:tcPr/w:hMerge` (`ST_Merge`).
 *
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {VerticalMerge | undefined} The result.
 * @private
 */
export function readHorizontalMerge(tcPr: OpenXmlElement | undefined): VerticalMerge | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    return readHorizontalMergeChild(tcPr);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {VerticalMerge | undefined} merge - The merge.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeHorizontalMerge(tcPr: OpenXmlElement | undefined, merge: VerticalMerge | undefined): OpenXmlElement | undefined {
    if (merge === undefined) {
        if (tcPr === undefined) {
            return undefined;
        }
        return writeTcChild(tcPr, 'hMerge', undefined);
    }
    const element: OpenXmlElement = merge === 'restart'
        ? wmlElement('hMerge', { attributes: [wmlAttr('val', 'restart')] })
        : wmlElement('hMerge', { attributes: [wmlAttr('val', 'continue')] });
    return writeTcChild(tcPr, 'hMerge', element);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {TableWidth | undefined} The result.
 * @private
 */
export function readCellPreferredWidth(tcPr: OpenXmlElement | undefined): TableWidth | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'tcW');
    return el !== undefined ? parseTblWidth(el) : undefined;
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {TableWidth | undefined} width - The width.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellPreferredWidth(tcPr: OpenXmlElement | undefined, width: TableWidth | undefined): OpenXmlElement | undefined {
    return writeTcChild(tcPr, 'tcW', width !== undefined ? serializeTblWidth('tcW', width) : undefined);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {TableCellBorders | undefined} The result.
 * @private
 */
export function readCellBorders(tcPr: OpenXmlElement | undefined): TableCellBorders | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'tcBorders');
    if (el === undefined) {
        return undefined;
    }
    const borders: TableCellBorders = parseTcBorders(el);
    if (borders.top === undefined &&
        borders.left === undefined &&
        borders.bottom === undefined &&
        borders.right === undefined &&
        borders.insideH === undefined &&
        borders.insideV === undefined &&
        borders.tl2br === undefined &&
        borders.tr2bl === undefined) {
        return undefined;
    }
    return borders;
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {TableCellBorders | undefined} borders - The borders.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellBorders(tcPr: OpenXmlElement | undefined, borders: TableCellBorders | undefined): OpenXmlElement | undefined {
    const existing: OpenXmlElement = tcPr !== undefined ? findWmlChild(tcPr, 'tcBorders') : undefined;
    return writeTcChild(tcPr, 'tcBorders', borders !== undefined ? serializeTcBorders(borders, existing) : undefined);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {TableShading | undefined} The result.
 * @private
 */
export function readCellShading(tcPr: OpenXmlElement | undefined): TableShading | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'shd');
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
 * Whether cell shading carries explicit direct formatting worth serializing.
 * Bare `{ pattern: 'clear' }` with no fill/color is treated as uninitialized and omitted
 * so table-style shading can inherit. Explicit clear+fill/color, non-clear patterns, or
 * fill alone still emit. Parsed genuine bare clear is preserved only when callers pass a
 * shaded object that was read from the wire with additional markers — bare clear alone
 * must not be introduced on authoring paths.
 *
 * @param {TableShading} shading - The shading.
 * @returns {boolean} The result.
 * @private
 */
function isExplicitCellShading(shading: TableShading): boolean {
    if (shading.fill !== undefined && shading.fill.length > 0) {
        return true;
    }
    if (shading.color !== undefined && shading.color.length > 0 && shading.color !== 'auto') {
        return true;
    }
    if (shading.pattern !== undefined && shading.pattern.length > 0 && shading.pattern !== 'clear') {
        return true;
    }
    // Explicit clear with a color (including auto) is genuine direct formatting.
    if (
        shading.pattern === 'clear' &&
        shading.color !== undefined &&
        shading.color.length > 0
    ) {
        return true;
    }
    return false;
}

/**
 * Write cell shading only when it is explicit direct formatting.
 * Omits bare uninitialized `w:shd w:val="clear"` so style shading inherits in Word.
 *
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {TableShading | undefined} shading - The shading.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellShading(tcPr: OpenXmlElement | undefined, shading: TableShading | undefined): OpenXmlElement | undefined {
    if (shading === undefined || !isExplicitCellShading(shading)) {
        return writeTcChild(tcPr, 'shd', undefined);
    }
    return writeTcChild(tcPr, 'shd', serializeShd(shading));
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {TableCellMargins | undefined} The result.
 * @private
 */
export function readCellMargins(tcPr: OpenXmlElement | undefined): TableCellMargins | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'tcMar');
    if (el === undefined) {
        return undefined;
    }
    const m: TableCellMargins = parseCellMargins(el);
    if (m.top === undefined &&
        m.right === undefined &&
        m.bottom === undefined &&
        m.left === undefined) {
        return undefined;
    }
    return m;
}
/**
 * Whether the cell inherits table default cell margins (absence of `w:tcMar`).
 *
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {boolean} The result.
 * @private
 */
export function readIsSamePaddingsAsTable(tcPr: OpenXmlElement | undefined): boolean {
    if (tcPr === undefined) {
        return true;
    }
    return findWmlChild(tcPr, 'tcMar') === undefined;
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {TableCellMargins | undefined} margins - The margins.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellMargins(tcPr: OpenXmlElement | undefined, margins: TableCellMargins | undefined): OpenXmlElement | undefined {
    const existing: OpenXmlElement = tcPr !== undefined ? findWmlChild(tcPr, 'tcMar') : undefined;
    return writeTcChild(tcPr, 'tcMar', margins !== undefined ? serializeCellMargins('tcMar', margins, existing) : undefined);
}
/**
 * Write inheritance mode for cell padding.
 *
 * - `true` removes `w:tcMar` (inherit table `tblCellMar`).
 * - `false` ensures an explicit `w:tcMar` is present. Existing non-empty side
 *   values are retained. When `w:tcMar` is missing or empty, all four sides
 *   are written as 0 twips so Word treats the cell as a real override
 *   (Cell Options → “Same as the whole table” unchecked). An empty
 *   `<w:tcMar/>` alone is ignored by Word’s checkbox UI.
 *
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {boolean} sameAsTable - The same as table.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeIsSamePaddingsAsTable(tcPr: OpenXmlElement | undefined, sameAsTable: boolean): OpenXmlElement | undefined {
    if (sameAsTable) {
        return writeCellMargins(tcPr, undefined);
    }
    const existing: OpenXmlElement = tcPr !== undefined ? findWmlChild(tcPr, 'tcMar') : undefined;
    if (existing !== undefined) {
        const m: TableCellMargins = parseCellMargins(existing);
        if (m.top !== undefined ||
            m.right !== undefined ||
            m.bottom !== undefined ||
            m.left !== undefined) {
            return tcPr;
        }
    }
    // Word requires concrete side elements to uncheck "Same as the whole table".
    return writeCellMargins(tcPr, ZERO_CELL_MARGINS);
}
const TEXT_DIRECTIONS: Set<string> = new Set<string>(['lr', 'rl', 'tb', 'btLr', 'lrV', 'rlV']);
/**
 *  Map full ST_TextDirection tokens onto the public cell subset when possible.
 *
 * @param {string | undefined} raw - Specifies the raw.
 * @returns {TableCellTextDirection | undefined} Returns the result.
 */
function mapTextDirection(raw: string | undefined): TableCellTextDirection | undefined {
    if (raw === undefined) {
        return undefined;
    }
    if (TEXT_DIRECTIONS.has(raw)) {
        return raw as TableCellTextDirection;
    }
    if (raw === 'lrTb') {
        return 'lr';
    }
    if (raw === 'tbRl') {
        return 'tb';
    }
    if (raw === 'btLr') {
        return 'btLr';
    }
    if (raw === 'lrTbV') {
        return 'lrV';
    }
    if (raw === 'tbRlV') {
        return 'rlV';
    }
    if (raw === 'tbLrV') {
        return 'tb';
    }
    return undefined;
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {TableCellTextDirection | undefined} The result.
 * @private
 */
export function readCellTextDirection(tcPr: OpenXmlElement | undefined): TableCellTextDirection | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'textDirection');
    if (el === undefined) {
        return undefined;
    }
    return mapTextDirection(wValAttribute(el));
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {TableCellTextDirection | undefined} direction - The direction.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellTextDirection(
    tcPr: OpenXmlElement | undefined,
    direction: TableCellTextDirection | undefined
): OpenXmlElement | undefined {
    return writeTcChild(tcPr, 'textDirection', direction !== undefined
        ? wmlElement('textDirection', { attributes: [wmlAttr('val', direction)] })
        : undefined);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {TableCellVerticalAlignment | undefined} The result.
 * @private
 */
export function readCellVerticalAlignment(tcPr: OpenXmlElement | undefined): TableCellVerticalAlignment | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'vAlign');
    if (el === undefined) {
        return undefined;
    }
    const raw: string = wValAttribute(el);
    if (raw === 'top') {
        return TableCellVerticalAlignment.Top;
    }
    if (raw === 'center') {
        return TableCellVerticalAlignment.Center;
    }
    if (raw === 'bottom') {
        return TableCellVerticalAlignment.Bottom;
    }
    return undefined;
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {TableCellVerticalAlignment | undefined} alignment - The alignment.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellVerticalAlignment(
    tcPr: OpenXmlElement | undefined,
    alignment: TableCellVerticalAlignment | undefined
): OpenXmlElement | undefined {
    return writeTcChild(tcPr, 'vAlign', alignment !== undefined
        ? wmlElement('vAlign', { attributes: [wmlAttr('val', alignment)] })
        : undefined);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {boolean | undefined} The result.
 * @private
 */
export function readCellNoWrap(tcPr: OpenXmlElement | undefined): boolean | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'noWrap');
    return el !== undefined ? parseOnOff(el) : undefined;
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {boolean | undefined} noWrap - The no wrap.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellNoWrap(tcPr: OpenXmlElement | undefined, noWrap: boolean | undefined): OpenXmlElement | undefined {
    return writeTcChild(tcPr, 'noWrap', noWrap !== undefined ? serializeOnOff('noWrap', noWrap) : undefined);
}
/**
 * Fit text (`w:tcFitText` — not `w:fitText`).
 *
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {boolean | undefined} The result.
 * @private
 */
export function readCellFitText(tcPr: OpenXmlElement | undefined): boolean | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'tcFitText');
    return el !== undefined ? parseOnOff(el) : undefined;
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {boolean | undefined} fitText - The fit text.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellFitText(tcPr: OpenXmlElement | undefined, fitText: boolean | undefined): OpenXmlElement | undefined {
    return writeTcChild(tcPr, 'tcFitText', fitText !== undefined ? serializeOnOff('tcFitText', fitText) : undefined);
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {boolean | undefined} The result.
 * @private
 */
export function readCellHideMark(tcPr: OpenXmlElement | undefined): boolean | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'hideMark');
    return el !== undefined ? parseOnOff(el) : undefined;
}
/**
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {boolean | undefined} hideMark - The hide mark.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellHideMark(tcPr: OpenXmlElement | undefined, hideMark: boolean | undefined): OpenXmlElement | undefined {
    return writeTcChild(tcPr, 'hideMark', hideMark !== undefined ? serializeOnOff('hideMark', hideMark) : undefined);
}
/**
 * Cell conditional formatting membership (`w:tcPr/w:cnfStyle` / `CT_Cnf`).
 * Preserve-only: does not recompute from table layout.
 *
 * Citations: ECMA-376-1 §17.4.8; Part 4 §14.3.1.1 / §14.11.9; Transitional `CT_Cnf`.
 *
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @returns {CnfStyle | undefined} The result.
 * @private
 */
export function readCellCnfStyle(tcPr: OpenXmlElement | undefined): CnfStyle | undefined {
    if (tcPr === undefined) {
        return undefined;
    }
    const el: OpenXmlElement = findWmlChild(tcPr, 'cnfStyle');
    if (el === undefined) {
        return undefined;
    }
    const state: CnfStyle = parseCnfStyle(el);
    const normalized: NormalizedCnfStyle = normalizeCnfStyle(state);
    return normalizedCnfStyleHasTrue(normalized) ? state : undefined;
}
/**
 * Write or clear cell `w:cnfStyle`. Passing `undefined` removes the element.
 * A supplied {@link NormalizedCnfStyle} is always written (including all-false).
 *
 * @param {OpenXmlElement | undefined} tcPr - The tc pr.
 * @param {NormalizedCnfStyle | CnfStyle | undefined} state - The state.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function writeCellCnfStyle(
    tcPr: OpenXmlElement | undefined,
    state: NormalizedCnfStyle | CnfStyle | undefined
): OpenXmlElement | undefined {
    if (state === undefined) {
        if (tcPr === undefined) {
            return undefined;
        }
        return writeTcChild(tcPr, 'cnfStyle', undefined);
    }
    const existing: OpenXmlElement = tcPr !== undefined ? findWmlChild(tcPr, 'cnfStyle') : undefined;
    const normalized: NormalizedCnfStyle = normalizeCnfStyle(state);
    return writeTcChild(tcPr, 'cnfStyle', serializeCnfStyle(normalized, existing));
}
