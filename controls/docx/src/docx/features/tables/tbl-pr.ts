/**
 * Typed parse/serialize helpers for `w:tblPr` and shared table property types.
 *
 * Citations: Transitional `wml.xsd` `CT_TblPrBase`, `CT_TblWidth`, `CT_TblBorders`,
 * `CT_TblCellMar`, `CT_TblLook`, `ST_JcTable`, `ST_TblWidth`.
 */
import { ownGet, ownSet } from '../../core/compat/object-compat';
import { twipsToPoint, pointToTwips } from '../document/length';
import { parseOnOff, serializeOnOff } from '../document/on-off';
import { elementChildren, isWml, wValAttribute, wmlAttr, wmlElement } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import { OpenXmlAttribute } from '../../core/xml/model';
export { pointToTwips, twipsToPoint };
// ---------------------------------------------------------------------------
// Public shared types
// ---------------------------------------------------------------------------
/**
 * Table / cell preferred width (`CT_TblWidth`).
 *
 * - `dxa`: `@w:w` is twips on the wire; `value` is stored as points (`twips / 20`).
 * - `pct`: `@w:w` is fiftieths-of-a-percent; stored via the same twips→points bridge
 *   so callers can round-trip with `pointToTwips(value)` recovering the fiftieths.
 * - `auto` / `nil`: `value` is typically zero.
 *
 * @private
 * Internal storage shape for table and cell width settings. Prefer
 * the point-based {@link TableCell.width} accessor, or {@link Table.autoFit}.
 */
export interface TableWidth {
    readonly type: 'auto' | 'dxa' | 'nil' | 'pct';
    /** Preferred width in points (for `dxa`); see type notes for `pct`/`auto`/`nil`. */
    readonly value: number;
}
/**
 * One border edge of a table or table cell.
 *
 * A border is described by its line style, color, thickness, and the gap to
 * the cell contents. Omitting a field lets Word apply its own default for
 * that aspect; omitting the whole edge leaves the neighboring setting
 * (table defaults or cell override) in charge.
 *
 * `size` is measured in eighths of a point (so a value of 8 draws a 1 pt
 * line) and `space` in points.
 */
export interface TableBorder {
    /**
     * @private
     * Border line token as stored in `@w:val` (e.g. `'single'`). */
    readonly style?: string;
    /**
     * Gets the border line color.
     */
    readonly color?: string;
    /**
     * Gets the width of the border line, in points.
     */
    readonly size?: number;
    /**
     * Gets the gap between the line and the cell contents, in points.
     */
    readonly space?: number;
    /**
     * Gets a value indicating whether the shadow option is enabled.
     */
    readonly shadow?: boolean;
}
/**
 * Border settings for a whole table.
 *
 * The outer edges (`top`, `left`, `bottom`, `right`) frame the table;
 * `insideH` and `insideV` draw the lines between rows and columns. Any edge
 * left undefined falls back to Word's table style — set only the edges that
 * must differ from the surrounding look.
 *
 * Borders set here apply to the table as a whole; individual cells can
 * override them with {@link TableCell.borders}.
 */
export interface TableBorders {
    /**
     * Gets the top edge of the table.
     */
    readonly top?: TableBorder;
    /**
     * Gets the left edge of the table.
     */
    readonly left?: TableBorder;
    /**
     * Gets the bottom edge of the table.
     */
    readonly bottom?: TableBorder;
    /**
     * Gets the right edge of the table.
     */
    readonly right?: TableBorder;
    /**
     * Gets the line between adjacent rows.
     */
    readonly insideH?: TableBorder;
    /**
     * Gets the line between adjacent columns.
     */
    readonly insideV?: TableBorder;
}
/**
 * Border settings for one table cell.
 *
 * Cell borders override the table-level borders for this cell. Configure the
 * outer and inside edges the same way as {@link TableBorders}; any edge left
 * undefined keeps the inherited table setting.
 */
export interface TableCellBorders extends TableBorders {
    /**
     * Diagonal from the top-left to the bottom-right corner (`w:tl2br`).
     *
     * @private
     * Diagonal edge kept for round-trip; not part of the end-user
     * cell-border surface.
     */
    readonly tl2br?: TableBorder;
    /**
     * Diagonal from the top-right to the bottom-left corner (`w:tr2bl`).
     *
     * @private
     * Diagonal edge kept for round-trip; not part of the end-user
     * cell-border surface.
     */
    readonly tr2bl?: TableBorder;
}
/**
 * Padding between a cell's content and its borders, one value per side.
 * `undefined` per side uses Word's default.
 */
export interface TableCellMargins {
    /**
     * Gets the top cell margin, in points.
     */
    readonly top?: number;
    /**
     * Gets the right cell margin, in points.
     */
    readonly right?: number;
    /**
     * Gets the bottom cell margin, in points.
     */
    readonly bottom?: number;
    /**
     * Gets the left cell margin, in points.
     */
    readonly left?: number;
}
/**
 * Background shading of a table or table cell (`w:shd`).
 *
 * @private
 * Internal storage shape. Pattern/color tokens map directly to
 * `w:shd` attributes and are consumed by internal table plumbing.
 */
export interface TableShading {
    readonly fill?: string;
    readonly color?: string;
    readonly pattern?: string;
}
/**
 * Conditional formatting flags for table style banding (`w:tblLook`).
 *
 * @private
 * Internal storage shape for `w:tblLook`; authored by table style
 * plumbing rather than end-user code.
 */
export interface TableLook {
    readonly firstRow?: boolean;
    readonly lastRow?: boolean;
    readonly firstCol?: boolean;
    readonly lastCol?: boolean;
    readonly noHBand?: boolean;
    readonly noVBand?: boolean;
}
/**
 * How Word interprets a table row's height.
 *
 * - `auto`: the row grows and shrinks with its content.
 * - `atLeast`: the height is a minimum; content can still push it taller.
 * - `exact`: the height is fixed; overflow is clipped.
 */
export enum TableRowHeightRule {
    /** Specifies the auto rule. */
    Auto = 'auto',
    /** Specifies the at least rule. */
    AtLeast = 'atLeast',
    /** Specifies the exact rule. */
    Exact = 'exact'
}
/**
 * Height setting for a table row.
 *
 * `value` is the measured height in **points**;
 * `rule` (see {@link TableRowHeightRule}) decides whether it is a minimum, a
 * fixed value, or ignored.
 */
export interface TableRowHeight {
    /**
     * Gets the row height, in points.
     */
    readonly value: number;
    /**
     * Gets the rule that specifies how the height of the row is applied.
     */
    readonly rule: TableRowHeightRule;
}
/**
 * Specifies the horizontal alignment of a table on the page.
 *
 * Left aligns the table to the left margin, Center centers it between the margins, and Right aligns it to the right margin.
 *
 * @public
 */
export enum TableAlignment {
    /** Specifies the left alignment. */
    Left = 'left',
    /** Specifies the center alignment. */
    Center = 'center',
    /** Specifies the right alignment. */
    Right = 'right'
}
/**
 * Table column sizing algorithm (`w:tblLayout` / `ST_TblLayoutType`).
 *
 * @private
 * Internal flag behind `Table.autoFit`; exposes raw wire tokens
 * `autoFit` | `fixed` and defaults to `autoFit` when `w:tblLayout` is absent
 * ([MS-OE376] 2.1.159; ECMA-376 §17.4.52–53). Prefer `Table.autoFit`.
 */
export type TableLayout = 'autoFit' | 'fixed';
// ---------------------------------------------------------------------------
// Shared low-level helpers
// ---------------------------------------------------------------------------
export function parseDecimalVal(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return parseInt(raw, 10);
}
export function wmlAttrVal(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.prefix === 'w' || a.prefix === ''))), ts330 == null ? undefined : ts330.value);
}
function findWmlChild(parent: OpenXmlElement, localName: string): OpenXmlElement | undefined {
    for (const child of elementChildren(parent)) {
        if (isWml(child, localName)) {
            return child;
        }
    }
    return undefined;
}
/**
 * Replace or remove all children with `localName`; append when missing.
 * Preserves attributes and unmodeled siblings on the parent element.
 *
 * @param {OpenXmlElement} parent - The parent.
 * @param {string} parentLocalName - The parent local name.
 * @param {string} localName - The local name.
 * @param {OpenXmlElement | undefined} replacement - The replacement.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function upsertPropChild(
    parent: OpenXmlElement,
    parentLocalName: string,
    localName: string,
    replacement: OpenXmlElement | undefined
): OpenXmlElement {
    const children: ReadonlyArray<OpenXmlElement> = elementChildren(parent);
    const next: OpenXmlElement[] = [];
    let replaced: boolean = false;
    for (const child of children) {
        if (isWml(child, localName)) {
            if (!replaced && replacement !== undefined) {
                next.push(replacement);
            }
            replaced = true;
            continue;
        }
        next.push(child);
    }
    if (!replaced && replacement !== undefined) {
        next.push(replacement);
    }
    return wmlElement(parentLocalName, {
        attributes: parent.attributes,
        namespaceDeclarations: parent.namespaceDeclarations,
        children: next
    });
}
export function emptyPropsToUndefined(el: OpenXmlElement | undefined): OpenXmlElement | undefined {
    if (el === undefined) {
        return undefined;
    }
    if (elementChildren(el).length === 0 && el.attributes.length === 0) {
        return undefined;
    }
    return el;
}
// ---------------------------------------------------------------------------
// Width (CT_TblWidth)
// ---------------------------------------------------------------------------
const WIDTH_TYPES: Set<string> = new Set(['auto', 'dxa', 'nil', 'pct']);
/**
 * Parse `CT_TblWidth` (`@w:w`, `@w:type`).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {TableWidth | undefined} The result.
 * @private
 */
export function parseTblWidth(el: OpenXmlElement): TableWidth | undefined {
    let ts331: any; let ts332: any;
    const typeRaw: string = ((ts331 = wmlAttrVal(el, 'type')), ts331 != null ? ts331 : 'dxa');
    if (!WIDTH_TYPES.has(typeRaw)) {
        return undefined;
    }
    const type: TableWidth['type'] = typeRaw as TableWidth['type'];
    const wRaw: string = wmlAttrVal(el, 'w');
    const n: number = ((ts332 = parseDecimalVal(wRaw)), ts332 != null ? ts332 : 0);
    // pct: store fiftieths-of-percent raw via twips bridge (task note).
    // dxa/auto/nil: twips (may be 0).
    return { type, value: twipsToPoint(n) };
}
/**
 * Serialize `CT_TblWidth`.
 *
 * @param {string} localName - The local name.
 * @param {TableWidth} width - The width.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeTblWidth(localName: string, width: TableWidth): OpenXmlElement {
    const w: number = pointToTwips(width.value);
    return wmlElement(localName, {
        attributes: [wmlAttr('w', String(w)), wmlAttr('type', width.type)]
    });
}
// ---------------------------------------------------------------------------
// Borders
// ---------------------------------------------------------------------------
/**
 * Parse one `CT_Border`.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {TableBorder | undefined} The result.
 * @private
 */
export function parseBorderEdge(el: OpenXmlElement): TableBorder | undefined {
    const style: string = wmlAttrVal(el, 'val');
    if (style === undefined) {
        return undefined;
    }
    const colorRaw: string = wmlAttrVal(el, 'color');
    const szRaw: string = wmlAttrVal(el, 'sz');
    const sz: number = szRaw !== undefined ? parseDecimalVal(szRaw) : undefined;
    const spaceRaw: string = wmlAttrVal(el, 'space');
    const space: number = spaceRaw !== undefined ? parseDecimalVal(spaceRaw) : undefined;
    const shadowRaw: string = wmlAttrVal(el, 'shadow');
    let shadow: boolean | undefined;
    if (shadowRaw !== undefined) {
        const normalized: string = shadowRaw.trim().toLowerCase();
        if (normalized === 'true' || normalized === '1' || normalized === 'on') {
            shadow = true;
        }
        else if (normalized === 'false' || normalized === '0' || normalized === 'off') {
            shadow = false;
        }
    }
    return {
        style,
        ...(colorRaw !== undefined ? { color: colorRaw } : {}),
        ...(sz !== undefined ? { size: sz } : {}),
        ...(space !== undefined ? { space } : {}),
        ...(shadow !== undefined ? { shadow } : {})
    };
}
/**
 * Serialize one border edge element.
 *
 * `CT_Border` requires `@w:val`; an edge parsed without a style token
 * (schema-invalid input) is skipped so the output stays schema-valid.
 *
 * @param {string} localName - The local name.
 * @param {TableBorder} edge - The edge.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function serializeBorderEdge(localName: string, edge: TableBorder): OpenXmlElement | undefined {
    if (edge.style === undefined) {
        return undefined;
    }
    const attrs: ReturnType<typeof wmlAttr>[] = [wmlAttr('val', edge.style)];
    if (edge.color !== undefined) {
        // ST_HexColor / 'auto': strip a leading '#' if present.
        let color: string = edge.color;
        if (color.length > 0 && color.charAt(0) === '#') {
            color = color.slice(1);
        }
        attrs.push(wmlAttr('color', color));
    }
    if (edge.size !== undefined) {
        attrs.push(wmlAttr('sz', String(edge.size)));
    }
    if (edge.space !== undefined) {
        attrs.push(wmlAttr('space', String(edge.space)));
    }
    if (edge.shadow !== undefined) {
        attrs.push(wmlAttr('shadow', edge.shadow ? 'true' : 'false'));
    }
    return wmlElement(localName, { attributes: attrs });
}
/**
 * Parse table borders. Maps `start`→`left`, `end`→`right` (Strict → API).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {TableBorders} The result.
 * @private
 */
export function parseTblBorders(el: OpenXmlElement): TableBorders {
    let top: TableBorder | undefined;
    let left: TableBorder | undefined;
    let bottom: TableBorder | undefined;
    let right: TableBorder | undefined;
    let insideH: TableBorder | undefined;
    let insideV: TableBorder | undefined;
    for (const child of elementChildren(el)) {
        if (!isWml(child, child.localName)) {
            continue;
        }
        const edge: TableBorder = parseBorderEdge(child);
        if (edge === undefined) {
            continue;
        }
        switch (child.localName) {
        case 'top':
            top = edge;
            break;
        case 'left':
        case 'start':
            left = edge;
            break;
        case 'bottom':
            bottom = edge;
            break;
        case 'right':
        case 'end':
            right = edge;
            break;
        case 'insideH':
            insideH = edge;
            break;
        case 'insideV':
            insideV = edge;
            break;
        default:
            break;
        }
    }
    return {
        ...(top !== undefined ? { top } : {}),
        ...(left !== undefined ? { left } : {}),
        ...(bottom !== undefined ? { bottom } : {}),
        ...(right !== undefined ? { right } : {}),
        ...(insideH !== undefined ? { insideH } : {}),
        ...(insideV !== undefined ? { insideV } : {})
    };
}
/**
 * Serialize table borders as Transitional `left`/`right` (Word parity).
 * Preserves unmodeled children (e.g. Strict `start`/`end`) when rewriting.
 *
 * @param {TableBorders} borders - The borders.
 * @param {OpenXmlElement} existing - The existing.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeTblBorders(borders: TableBorders, existing?: OpenXmlElement): OpenXmlElement {
    const modeled: Set<string> = new Set(['top', 'left', 'right', 'bottom', 'insideH', 'insideV', 'start', 'end']);
    const children: OpenXmlElement[] = [];
    const pushEdge: (localName: string, edge: TableBorder) => void = (localName: string, edge: TableBorder | undefined): void => {
        const el: OpenXmlElement = edge !== undefined ? serializeBorderEdge(localName, edge) : undefined;
        if (el !== undefined) {
            children.push(el);
        }
    };
    pushEdge('top', borders.top);
    pushEdge('left', borders.left);
    pushEdge('bottom', borders.bottom);
    pushEdge('right', borders.right);
    pushEdge('insideH', borders.insideH);
    pushEdge('insideV', borders.insideV);
    if (existing !== undefined) {
        for (const child of elementChildren(existing)) {
            if (!isWml(child, child.localName) || !modeled.has(child.localName)) {
                children.push(child);
            }
        }
    }
    return wmlElement('tblBorders', { children });
}
/**
 * Parse cell borders including diagonals.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {TableCellBorders} The result.
 * @private
 */
export function parseTcBorders(el: OpenXmlElement): TableCellBorders {
    const base: TableBorders = parseTblBorders(el);
    let tl2br: TableBorder | undefined;
    let tr2bl: TableBorder | undefined;
    for (const child of elementChildren(el)) {
        if (!isWml(child, child.localName)) {
            continue;
        }
        const edge: TableBorder = parseBorderEdge(child);
        if (edge === undefined) {
            continue;
        }
        if (child.localName === 'tl2br') {
            tl2br = edge;
        }
        else if (child.localName === 'tr2bl') {
            tr2bl = edge;
        }
    }
    return {
        ...base,
        ...(tl2br !== undefined ? { tl2br } : {}),
        ...(tr2bl !== undefined ? { tr2bl } : {})
    };
}
/**
 * Serialize cell borders (`w:tcBorders`).
 *
 * @param {TableCellBorders} borders - The borders.
 * @param {OpenXmlElement} existing - The existing.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeTcBorders(borders: TableCellBorders, existing?: OpenXmlElement): OpenXmlElement {
    const modeled: Set<string> = new Set([
        'top',
        'left',
        'right',
        'bottom',
        'insideH',
        'insideV',
        'start',
        'end',
        'tl2br',
        'tr2bl'
    ]);
    const children: OpenXmlElement[] = [];
    const pushEdge: (localName: string, edge: TableBorder) => void = (localName: string, edge: TableBorder | undefined): void => {
        const el: OpenXmlElement = edge !== undefined ? serializeBorderEdge(localName, edge) : undefined;
        if (el !== undefined) {
            children.push(el);
        }
    };
    pushEdge('top', borders.top);
    pushEdge('left', borders.left);
    pushEdge('bottom', borders.bottom);
    pushEdge('right', borders.right);
    pushEdge('insideH', borders.insideH);
    pushEdge('insideV', borders.insideV);
    pushEdge('tl2br', borders.tl2br);
    pushEdge('tr2bl', borders.tr2bl);
    if (existing !== undefined) {
        for (const child of elementChildren(existing)) {
            if (!isWml(child, child.localName) || !modeled.has(child.localName)) {
                children.push(child);
            }
        }
    }
    return wmlElement('tcBorders', { children });
}
// ---------------------------------------------------------------------------
// Margins (CT_TblCellMar / CT_TcMar)
// ---------------------------------------------------------------------------
function parseMarginEdge(el: OpenXmlElement): number | undefined {
    const typeRaw: string = wmlAttrVal(el, 'type');
    // Prefer dxa; accept missing type as dxa (common Word output).
    if (typeRaw !== undefined && typeRaw !== 'dxa' && typeRaw !== 'auto' && typeRaw !== 'nil') {
        // pct margins are rare; still accept numeric w as twips-like raw for round-trip via Point
        if (typeRaw !== 'pct') {
            return undefined;
        }
    }
    const n: number = parseDecimalVal(wmlAttrVal(el, 'w'));
    if (n === undefined) {
        return undefined;
    }
    return twipsToPoint(n);
}
/**
 * Parse table/cell margins. Maps `start`→`left`, `end`→`right`.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {TableCellMargins} The result.
 * @private
 */
export function parseCellMargins(el: OpenXmlElement): TableCellMargins {
    let top: number | undefined;
    let right: number | undefined;
    let bottom: number | undefined;
    let left: number | undefined;
    for (const child of elementChildren(el)) {
        if (!isWml(child, child.localName)) {
            continue;
        }
        const len: number = parseMarginEdge(child);
        if (len === undefined) {
            continue;
        }
        switch (child.localName) {
        case 'top':
            top = len;
            break;
        case 'right':
        case 'end':
            right = len;
            break;
        case 'bottom':
            bottom = len;
            break;
        case 'left':
        case 'start':
            left = len;
            break;
        default:
            break;
        }
    }
    return {
        ...(top !== undefined ? { top } : {}),
        ...(right !== undefined ? { right } : {}),
        ...(bottom !== undefined ? { bottom } : {}),
        ...(left !== undefined ? { left } : {})
    };
}
function serializeMarginEdge(localName: string, value: number): OpenXmlElement {
    return wmlElement(localName, {
        attributes: [wmlAttr('w', String(pointToTwips(value))), wmlAttr('type', 'dxa')]
    });
}
/**
 * Serialize margins container (`tblCellMar` or `tcMar`) with Transitional left/right.
 *
 * @param {string | string} containerLocalName - The container local name.
 * @param {TableCellMargins} margins - The margins.
 * @param {OpenXmlElement} existing - The existing.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeCellMargins(containerLocalName: 'tblCellMar' | 'tcMar', margins: TableCellMargins, existing?: OpenXmlElement): OpenXmlElement {
    const modeled: Set<string> = new Set(['top', 'left', 'right', 'bottom', 'start', 'end']);
    const children: OpenXmlElement[] = [];
    if (margins.top !== undefined) {
        children.push(serializeMarginEdge('top', margins.top));
    }
    if (margins.left !== undefined) {
        children.push(serializeMarginEdge('left', margins.left));
    }
    if (margins.bottom !== undefined) {
        children.push(serializeMarginEdge('bottom', margins.bottom));
    }
    if (margins.right !== undefined) {
        children.push(serializeMarginEdge('right', margins.right));
    }
    if (existing !== undefined) {
        for (const child of elementChildren(existing)) {
            if (!isWml(child, child.localName) || !modeled.has(child.localName)) {
                children.push(child);
            }
        }
    }
    return wmlElement(containerLocalName, { children });
}
// ---------------------------------------------------------------------------
// Shading
// ---------------------------------------------------------------------------
/**
 * Parse `w:shd` (pattern is free string per task).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {TableShading} The result.
 * @private
 */
export function parseShd(el: OpenXmlElement): TableShading {
    const fillRaw: string = wmlAttrVal(el, 'fill');
    const colorRaw: string = wmlAttrVal(el, 'color');
    const valRaw: string = wmlAttrVal(el, 'val');
    return {
        ...(fillRaw !== undefined ? { fill: fillRaw } : {}),
        ...(colorRaw !== undefined ? { color: colorRaw } : {}),
        ...(valRaw !== undefined ? { pattern: valRaw } : {})
    };
}
/**
 * Serialize `w:shd` (order: pattern/val, color, fill).
 *
 * @param {TableShading} shd - The shd.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeShd(shd: TableShading): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [];
    if (shd.pattern !== undefined) {
        attrs.push(wmlAttr('val', shd.pattern));
    }
    if (shd.color !== undefined) {
        attrs.push(wmlAttr('color', shd.color));
    }
    if (shd.fill !== undefined) {
        // ST_HexColor / 'auto': strip a leading '#' if present so invalid
        // authoring input still emits a schema-valid wire value.
        let fill: string = shd.fill;
        if (fill.length > 0 && fill.charAt(0) === '#') {
            fill = fill.slice(1);
        }
        attrs.push(wmlAttr('fill', fill));
    }
    return wmlElement('shd', { attributes: attrs });
}
// ---------------------------------------------------------------------------
// Alignment (ST_JcTable subset)
// ---------------------------------------------------------------------------
/**
 * Parse table/row `w:jc` → public left|center|right (start→left, end→right).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {TableAlignment | undefined} The result.
 * @private
 */
export function parseTableAlignment(el: OpenXmlElement): TableAlignment | undefined {
    const raw: string = wValAttribute(el);
    if (raw === 'left' || raw === 'start') {
        return TableAlignment.Left;
    }
    if (raw === 'right' || raw === 'end') {
        return TableAlignment.Right;
    }
    if (raw === 'center') {
        return TableAlignment.Center;
    }
    return undefined;
}
/**
 * Serialize table/row alignment as Transitional left|center|right.
 *
 * @param {TableAlignment} alignment - The alignment.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeTableAlignment(alignment: TableAlignment): OpenXmlElement {
    return wmlElement('jc', { attributes: [wmlAttr('val', alignment)] });
}
// ---------------------------------------------------------------------------
// tblLook
// ---------------------------------------------------------------------------
/** ECMA-376 / Word `w:tblLook/@w:val` bit flags (when named attrs absent). */
const TBLLOOK_FIRST_ROW: number = 0x0020;
const TBLLOOK_LAST_ROW: number = 0x0040;
const TBLLOOK_FIRST_COLUMN: number = 0x0080;
const TBLLOOK_LAST_COLUMN: number = 0x0100;
const TBLLOOK_NO_H_BAND: number = 0x0200;
const TBLLOOK_NO_V_BAND: number = 0x0400;
function parseHexMask(raw: string | undefined): number | undefined {
    if (raw === undefined || raw.length === 0) {
        return undefined;
    }
    // TS 3.3 / ES5 parity: avoid String.prototype.startsWith.
    const cleaned: string = (raw.indexOf('0x') === 0 || raw.indexOf('0X') === 0) ? raw.slice(2) : raw;
    if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
        return undefined;
    }
    return parseInt(cleaned, 16);
}
function onOffAttr(el: OpenXmlElement, localName: string): boolean | undefined {
    const raw: string = wmlAttrVal(el, localName);
    if (raw === undefined) {
        return undefined;
    }
    if (raw === '1' || raw === 'true' || raw === 'on') {
        return true;
    }
    if (raw === '0' || raw === 'false' || raw === 'off') {
        return false;
    }
    return undefined;
}
/**
 * Parse `w:tblLook` named onOff attrs and/or legacy hex `@w:val`.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {TableLook} The result.
 * @private
 */
export function parseTblLook(el: OpenXmlElement): TableLook {
    let firstRow: boolean = onOffAttr(el, 'firstRow');
    let lastRow: boolean = onOffAttr(el, 'lastRow');
    let firstCol: boolean = onOffAttr(el, 'firstColumn');
    let lastCol: boolean = onOffAttr(el, 'lastColumn');
    let noHBand: boolean = onOffAttr(el, 'noHBand');
    let noVBand: boolean = onOffAttr(el, 'noVBand');
    const mask: number = parseHexMask(wmlAttrVal(el, 'val'));
    if (mask !== undefined) {
        if (firstRow === undefined) {
            firstRow = (mask & TBLLOOK_FIRST_ROW) !== 0;
        }
        if (lastRow === undefined) {
            lastRow = (mask & TBLLOOK_LAST_ROW) !== 0;
        }
        if (firstCol === undefined) {
            firstCol = (mask & TBLLOOK_FIRST_COLUMN) !== 0;
        }
        if (lastCol === undefined) {
            lastCol = (mask & TBLLOOK_LAST_COLUMN) !== 0;
        }
        if (noHBand === undefined) {
            noHBand = (mask & TBLLOOK_NO_H_BAND) !== 0;
        }
        if (noVBand === undefined) {
            noVBand = (mask & TBLLOOK_NO_V_BAND) !== 0;
        }
    }
    return {
        ...(firstRow !== undefined ? { firstRow } : {}),
        ...(lastRow !== undefined ? { lastRow } : {}),
        ...(firstCol !== undefined ? { firstCol } : {}),
        ...(lastCol !== undefined ? { lastCol } : {}),
        ...(noHBand !== undefined ? { noHBand } : {}),
        ...(noVBand !== undefined ? { noVBand } : {})
    };
}
function pushOnOffAttr(attrs: ReturnType<typeof wmlAttr>[], localName: string, value: boolean | undefined): void {
    if (value === undefined) {
        return;
    }
    attrs.push(wmlAttr(localName, value ? '1' : '0'));
}
/**
 * Serialize `w:tblLook` with named onOff attributes (preferred over hex-only).
 *
 * @param {TableLook} look - The look.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeTblLook(look: TableLook): OpenXmlElement {
    const attrs: ReturnType<typeof wmlAttr>[] = [];
    pushOnOffAttr(attrs, 'firstRow', look.firstRow);
    pushOnOffAttr(attrs, 'lastRow', look.lastRow);
    pushOnOffAttr(attrs, 'firstColumn', look.firstCol);
    pushOnOffAttr(attrs, 'lastColumn', look.lastCol);
    pushOnOffAttr(attrs, 'noHBand', look.noHBand);
    pushOnOffAttr(attrs, 'noVBand', look.noVBand);
    return wmlElement('tblLook', { attributes: attrs });
}
// ---------------------------------------------------------------------------
// cnfStyle (CT_Cnf) — preserve-only typed codecs (trPr / tcPr)
// Citations: ECMA-376-1 §17.3.1.8 / §17.4.7 / §17.4.8; Part 4 §14.3.1.1 / §14.11.9;
// Transitional wml.xsd CT_Cnf / ST_Cnf.
// ---------------------------------------------------------------------------
/**
 * Conditional formatting membership flags on a row or cell (`w:cnfStyle` / `CT_Cnf`).
 *
 * Named OnOff attributes match Transitional `CT_Cnf`. The transitional
 * `@w:val` ST_Cnf 12-char bitmask is accepted on parse and emitted complete
 * on serialize so dual-form consumers round-trip.
 *
 * @private
 * Typed internal storage only — not a public TableRow/TableCell surface.
 * Does not recompute membership from table layout (preserve-only).
 */
export interface CnfStyle {
    readonly firstRow?: boolean;
    readonly lastRow?: boolean;
    readonly firstColumn?: boolean;
    readonly lastColumn?: boolean;
    readonly oddVBand?: boolean;
    readonly evenVBand?: boolean;
    readonly oddHBand?: boolean;
    readonly evenHBand?: boolean;
    readonly firstRowFirstColumn?: boolean;
    readonly firstRowLastColumn?: boolean;
    readonly lastRowFirstColumn?: boolean;
    readonly lastRowLastColumn?: boolean;
}
/**
 * Fully resolved `w:cnfStyle` membership — every named flag is present.
 *
 * @private
 */
export interface NormalizedCnfStyle {
    readonly firstRow: boolean;
    readonly lastRow: boolean;
    readonly firstColumn: boolean;
    readonly lastColumn: boolean;
    readonly oddVBand: boolean;
    readonly evenVBand: boolean;
    readonly oddHBand: boolean;
    readonly evenHBand: boolean;
    readonly firstRowFirstColumn: boolean;
    readonly firstRowLastColumn: boolean;
    readonly lastRowFirstColumn: boolean;
    readonly lastRowLastColumn: boolean;
}
/**
 * Transitional ST_Cnf character positions (1-based LTR) → CT_Cnf fields.
 * Corner bit order (positions 9–12): firstRowLastColumn, firstRowFirstColumn,
 * lastRowLastColumn, lastRowFirstColumn. Named XML attrs still emit NW→SE order.
 */
const CNF_VAL_FIELDS: ReadonlyArray<keyof NormalizedCnfStyle> = [
    'firstRow',
    'lastRow',
    'firstColumn',
    'lastColumn',
    'oddVBand',
    'evenVBand',
    'oddHBand',
    'evenHBand',
    'firstRowLastColumn',
    'firstRowFirstColumn',
    'lastRowLastColumn',
    'lastRowFirstColumn'
];
const CNF_KNOWN_ATTRS: { [localName: string]: boolean } = {
    val: true,
    firstRow: true,
    lastRow: true,
    firstColumn: true,
    lastColumn: true,
    oddVBand: true,
    evenVBand: true,
    oddHBand: true,
    evenHBand: true,
    firstRowFirstColumn: true,
    firstRowLastColumn: true,
    lastRowFirstColumn: true,
    lastRowLastColumn: true
};
function parseCnfValMask(raw: string | undefined): string | undefined {
    if (raw === undefined || raw.length !== 12 || !/^[01]{12}$/.test(raw)) {
        return undefined;
    }
    return raw;
}
/**
 * The twelve named flags in `w:val` mask order (same order as {@link CNF_VAL_FIELDS}).
 *
 * @param {CnfStyle} state - The conditional-formatting membership.
 * @returns {ReadonlyArray<boolean | undefined>} The flag values, in mask order.
 * @private
 */
function cnfFlagsInMaskOrder(state: CnfStyle): ReadonlyArray<boolean | undefined> {
    return [
        state.firstRow,
        state.lastRow,
        state.firstColumn,
        state.lastColumn,
        state.oddVBand,
        state.evenVBand,
        state.oddHBand,
        state.evenHBand,
        state.firstRowLastColumn,
        state.firstRowFirstColumn,
        state.lastRowLastColumn,
        state.lastRowFirstColumn
    ];
}
function cnfStyleHasAny(state: CnfStyle): boolean {
    for (const flag of cnfFlagsInMaskOrder(state)) {
        if (flag !== undefined) {
            return true;
        }
    }
    return false;
}
/**
 * All-false normalized conditional membership.
 *
 * @returns {NormalizedCnfStyle} The result.
 * @private
 */
export function createDefaultCnfStyle(): NormalizedCnfStyle {
    return {
        firstRow: false,
        lastRow: false,
        firstColumn: false,
        lastColumn: false,
        oddVBand: false,
        evenVBand: false,
        oddHBand: false,
        evenHBand: false,
        firstRowFirstColumn: false,
        firstRowLastColumn: false,
        lastRowFirstColumn: false,
        lastRowLastColumn: false
    };
}
/**
 * Coerce partial/optional {@link CnfStyle} into a fully boolean {@link NormalizedCnfStyle}.
 *
 * @param {CnfStyle | undefined} state - The state.
 * @returns {NormalizedCnfStyle} The result.
 * @private
 */
export function normalizeCnfStyle(state: CnfStyle | undefined): NormalizedCnfStyle {
    return {
        firstRow: state !== undefined && state.firstRow === true,
        lastRow: state !== undefined && state.lastRow === true,
        firstColumn: state !== undefined && state.firstColumn === true,
        lastColumn: state !== undefined && state.lastColumn === true,
        oddVBand: state !== undefined && state.oddVBand === true,
        evenVBand: state !== undefined && state.evenVBand === true,
        oddHBand: state !== undefined && state.oddHBand === true,
        evenHBand: state !== undefined && state.evenHBand === true,
        firstRowFirstColumn: state !== undefined && state.firstRowFirstColumn === true,
        firstRowLastColumn: state !== undefined && state.firstRowLastColumn === true,
        lastRowFirstColumn: state !== undefined && state.lastRowFirstColumn === true,
        lastRowLastColumn: state !== undefined && state.lastRowLastColumn === true
    };
}
/**
 * True when any named flag is true on a normalized state.
 *
 * @param {NormalizedCnfStyle} state - The state.
 * @returns {boolean} The result.
 * @private
 */
export function normalizedCnfStyleHasTrue(state: NormalizedCnfStyle): boolean {
    for (const flag of cnfFlagsInMaskOrder(state)) {
        if (flag === true) {
            return true;
        }
    }
    return false;
}
/**
 * Alias of {@link normalizedCnfStyleHasTrue} (Word placement helper name).
 *
 * @param {NormalizedCnfStyle} state - The state.
 * @returns {boolean} The result.
 * @private
 */
export function hasAnyCnfStyleFlag(state: NormalizedCnfStyle): boolean {
    return normalizedCnfStyleHasTrue(state);
}
/**
 * Parse `w:cnfStyle` named OnOff attributes and/or transitional `@w:val` ST_Cnf.
 * Named attributes win when both forms are present (same rule as {@link parseTblLook}).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {CnfStyle} The result.
 * @private
 */
export function parseCnfStyle(el: OpenXmlElement): CnfStyle {
    // Mutable bag — CnfStyle fields are readonly on the public shape.
    const named: { [key: string]: boolean | undefined } = {
        firstRow: onOffAttr(el, 'firstRow'),
        lastRow: onOffAttr(el, 'lastRow'),
        firstColumn: onOffAttr(el, 'firstColumn'),
        lastColumn: onOffAttr(el, 'lastColumn'),
        oddVBand: onOffAttr(el, 'oddVBand'),
        evenVBand: onOffAttr(el, 'evenVBand'),
        oddHBand: onOffAttr(el, 'oddHBand'),
        evenHBand: onOffAttr(el, 'evenHBand'),
        firstRowFirstColumn: onOffAttr(el, 'firstRowFirstColumn'),
        firstRowLastColumn: onOffAttr(el, 'firstRowLastColumn'),
        lastRowFirstColumn: onOffAttr(el, 'lastRowFirstColumn'),
        lastRowLastColumn: onOffAttr(el, 'lastRowLastColumn')
    };
    const mask: string = parseCnfValMask(wmlAttrVal(el, 'val'));
    if (mask !== undefined) {
        for (const [i, entry] of CNF_VAL_FIELDS.entries()) {
            if (ownGet(named, entry) === undefined) {
                ownSet(named, entry, mask.charAt(i) === '1');
            }
        }
    }
    const out: { [key: string]: boolean | undefined } = {};
    for (const entry of CNF_VAL_FIELDS) {
        const value: boolean = ownGet(named, entry);
        if (value !== undefined) {
            ownSet(out, entry, value);
        }
    }
    return out as CnfStyle;
}
/**
 * Serialize `w:cnfStyle` with `w:val` first, then all twelve named OnOff attrs
 * as explicit `0`/`1`. Preserves unknown attributes, namespaces, and children.
 *
 * @param {NormalizedCnfStyle} state - The state.
 * @param {OpenXmlElement} existing - The existing.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeCnfStyle(
    state: NormalizedCnfStyle,
    existing?: OpenXmlElement
): OpenXmlElement {
    let val: string = '';
    for (const flag of cnfFlagsInMaskOrder(state)) {
        val += flag ? '1' : '0';
    }
    const attrs: ReturnType<typeof wmlAttr>[] = [
        wmlAttr('val', val),
        wmlAttr('firstRow', state.firstRow ? '1' : '0'),
        wmlAttr('lastRow', state.lastRow ? '1' : '0'),
        wmlAttr('firstColumn', state.firstColumn ? '1' : '0'),
        wmlAttr('lastColumn', state.lastColumn ? '1' : '0'),
        wmlAttr('oddVBand', state.oddVBand ? '1' : '0'),
        wmlAttr('evenVBand', state.evenVBand ? '1' : '0'),
        wmlAttr('oddHBand', state.oddHBand ? '1' : '0'),
        wmlAttr('evenHBand', state.evenHBand ? '1' : '0'),
        wmlAttr('firstRowFirstColumn', state.firstRowFirstColumn ? '1' : '0'),
        wmlAttr('firstRowLastColumn', state.firstRowLastColumn ? '1' : '0'),
        wmlAttr('lastRowFirstColumn', state.lastRowFirstColumn ? '1' : '0'),
        wmlAttr('lastRowLastColumn', state.lastRowLastColumn ? '1' : '0')
    ];
    if (existing !== undefined) {
        for (const attr of existing.attributes) {
            if (CNF_KNOWN_ATTRS[attr.localName] === true) {
                continue;
            }
            attrs.push(attr);
        }
    }
    return wmlElement('cnfStyle', {
        attributes: attrs,
        namespaceDeclarations:
            existing !== undefined ? existing.namespaceDeclarations : undefined,
        children: existing !== undefined ? elementChildren(existing) : undefined
    });
}
/**
 * True when any `CnfStyle` flag is explicitly set (including `false`).
 *
 * @param {CnfStyle} state - The state.
 * @returns {boolean} The result.
 * @private
 */
export function cnfStyleIsEmpty(state: CnfStyle): boolean {
    return !cnfStyleHasAny(state);
}
// ---------------------------------------------------------------------------
// String-valued children (caption / description)
// ---------------------------------------------------------------------------
function parseStringVal(el: OpenXmlElement): string | undefined {
    return wValAttribute(el);
}
function serializeStringVal(localName: string, value: string): OpenXmlElement {
    return wmlElement(localName, { attributes: [wmlAttr('val', value)] });
}
// ---------------------------------------------------------------------------
// tblPr read / write
// ---------------------------------------------------------------------------
function ensureTblPr(tblPr: OpenXmlElement | undefined): OpenXmlElement {
    return tblPr != null ? tblPr : wmlElement('tblPr');
}
function writeTblChild(tblPr: OpenXmlElement | undefined, localName: string, replacement: OpenXmlElement | undefined): OpenXmlElement {
    return upsertPropChild(ensureTblPr(tblPr), 'tblPr', localName, replacement);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {TableAlignment | undefined} The result.
 * @private
 */
export function readTableAlignment(tblPr: OpenXmlElement): TableAlignment | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'jc');
    return el !== undefined ? parseTableAlignment(el) : undefined;
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {TableAlignment | undefined} alignment - The alignment.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableAlignment(tblPr: OpenXmlElement, alignment: TableAlignment | undefined): OpenXmlElement {
    return writeTblChild(tblPr, 'jc', alignment !== undefined ? serializeTableAlignment(alignment) : undefined);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {number | undefined} The result.
 * @private
 */
export function readTableIndent(tblPr: OpenXmlElement): number | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblInd');
    if (el === undefined) {
        return undefined;
    }
    const n: number = parseDecimalVal(wmlAttrVal(el, 'w'));
    if (n === undefined) {
        return undefined;
    }
    return twipsToPoint(n);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {number | undefined} indent - The indent.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableIndent(tblPr: OpenXmlElement, indent: number | undefined): OpenXmlElement {
    if (indent === undefined) {
        return writeTblChild(tblPr, 'tblInd', undefined);
    }
    const element: OpenXmlElement = wmlElement('tblInd', {
        attributes: [wmlAttr('w', String(pointToTwips(indent))), wmlAttr('type', 'dxa')]
    });
    return writeTblChild(tblPr, 'tblInd', element);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {TableWidth | undefined} The result.
 * @private
 */
export function readTablePreferredWidth(tblPr: OpenXmlElement): TableWidth | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblW');
    return el !== undefined ? parseTblWidth(el) : undefined;
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {TableWidth | undefined} width - The width.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTablePreferredWidth(tblPr: OpenXmlElement, width: TableWidth | undefined): OpenXmlElement {
    return writeTblChild(tblPr, 'tblW', width !== undefined ? serializeTblWidth('tblW', width) : undefined);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {TableBorders | undefined} The result.
 * @private
 */
export function readTableBorders(tblPr: OpenXmlElement): TableBorders | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblBorders');
    if (el === undefined) {
        return undefined;
    }
    const borders: TableBorders = parseTblBorders(el);
    if (borders.top === undefined &&
        borders.left === undefined &&
        borders.bottom === undefined &&
        borders.right === undefined &&
        borders.insideH === undefined &&
        borders.insideV === undefined) {
        return undefined;
    }
    return borders;
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {TableBorders | undefined} borders - The borders.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableBorders(tblPr: OpenXmlElement, borders: TableBorders | undefined): OpenXmlElement {
    const existing: OpenXmlElement = findWmlChild(tblPr, 'tblBorders');
    return writeTblChild(tblPr, 'tblBorders', borders !== undefined ? serializeTblBorders(borders, existing) : undefined);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {TableCellMargins | undefined} The result.
 * @private
 */
export function readTableCellMargins(tblPr: OpenXmlElement): TableCellMargins | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblCellMar');
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
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {TableCellMargins | undefined} margins - The margins.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableCellMargins(tblPr: OpenXmlElement, margins: TableCellMargins | undefined): OpenXmlElement {
    const existing: OpenXmlElement = findWmlChild(tblPr, 'tblCellMar');
    return writeTblChild(tblPr, 'tblCellMar', margins !== undefined ? serializeCellMargins('tblCellMar', margins, existing) : undefined);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {number | undefined} The result.
 * @private
 */
export function readTableCellSpacing(tblPr: OpenXmlElement): number | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblCellSpacing');
    if (el === undefined) {
        return undefined;
    }
    const n: number = parseDecimalVal(wmlAttrVal(el, 'w'));
    if (n === undefined) {
        return undefined;
    }
    return twipsToPoint(n);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {number | undefined} spacing - The spacing.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableCellSpacing(tblPr: OpenXmlElement, spacing: number | undefined): OpenXmlElement {
    if (spacing === undefined) {
        return writeTblChild(tblPr, 'tblCellSpacing', undefined);
    }
    const element: OpenXmlElement = wmlElement('tblCellSpacing', {
        attributes: [wmlAttr('w', String(pointToTwips(spacing))), wmlAttr('type', 'dxa')]
    });
    return writeTblChild(tblPr, 'tblCellSpacing', element);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {TableShading | undefined} The result.
 * @private
 */
export function readTableShading(tblPr: OpenXmlElement): TableShading | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'shd');
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
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {TableShading | undefined} shading - The shading.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableShading(tblPr: OpenXmlElement, shading: TableShading | undefined): OpenXmlElement {
    return writeTblChild(tblPr, 'shd', shading !== undefined ? serializeShd(shading) : undefined);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {TableLook | undefined} The result.
 * @private
 */
export function readTableLook(tblPr: OpenXmlElement): TableLook | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblLook');
    if (el === undefined) {
        return undefined;
    }
    const look: TableLook = parseTblLook(el);
    if (look.firstRow === undefined &&
        look.lastRow === undefined &&
        look.firstCol === undefined &&
        look.lastCol === undefined &&
        look.noHBand === undefined &&
        look.noVBand === undefined) {
        return undefined;
    }
    return look;
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {TableLook | undefined} look - The look.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableLook(tblPr: OpenXmlElement, look: TableLook | undefined): OpenXmlElement {
    return writeTblChild(tblPr, 'tblLook', look !== undefined ? serializeTblLook(look) : undefined);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {string | undefined} The result.
 * @private
 */
export function readTableCaption(tblPr: OpenXmlElement): string | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblCaption');
    return el !== undefined ? parseStringVal(el) : undefined;
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {string | undefined} caption - The caption.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableCaption(tblPr: OpenXmlElement, caption: string | undefined): OpenXmlElement {
    return writeTblChild(tblPr, 'tblCaption', caption !== undefined ? serializeStringVal('tblCaption', caption) : undefined);
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {string | undefined} The result.
 * @private
 */
export function readTableDescription(tblPr: OpenXmlElement): string | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblDescription');
    return el !== undefined ? parseStringVal(el) : undefined;
}
/**
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {string | undefined} description - The description.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableDescription(tblPr: OpenXmlElement, description: string | undefined): OpenXmlElement {
    return writeTblChild(tblPr, 'tblDescription', description !== undefined ? serializeStringVal('tblDescription', description) : undefined);
}
/**
 * Read `w:tblStyle/@w:val`.
 *
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {string | undefined} The result.
 * @private
 */
export function readTableStyle(tblPr: OpenXmlElement): string | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblStyle');
    return el !== undefined ? parseStringVal(el) : undefined;
}
/**
 * Write or clear `w:tblStyle`.
 *
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {string | undefined} styleId - The style id.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableStyle(tblPr: OpenXmlElement, styleId: string | undefined): OpenXmlElement {
    return writeTblChild(tblPr, 'tblStyle', styleId !== undefined ? serializeStringVal('tblStyle', styleId) : undefined);
}
/**
 * Read `w:tblLayout/@w:type` → public {@link TableLayout}.
 *
 * Absent element → `autoFit`. Unknown wire tokens leave the child untouched and
 * return `autoFit` for the typed surface (extras preserved on the element).
 *
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {TableLayout} The result.
 * @private
 */
export function readTableLayout(tblPr: OpenXmlElement): TableLayout {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblLayout');
    if (el === undefined) {
        return 'autoFit';
    }
    const raw: string = wmlAttrVal(el, 'type');
    if (raw === 'fixed') {
        return 'fixed';
    }
    // `autofit`, missing type, or unknown → public autoFit (default algorithm).
    return 'autoFit';
}
/**
 * Write `w:tblLayout`. Omit-on-default: `autoFit` removes the element;
 * `fixed` emits `<w:tblLayout w:type="fixed"/>`.
 *
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {TableLayout} layout - The layout.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableLayout(tblPr: OpenXmlElement, layout: TableLayout): OpenXmlElement {
    if (layout === 'autoFit') {
        return writeTblChild(tblPr, 'tblLayout', undefined);
    }
    return writeTblChild(tblPr, 'tblLayout', wmlElement('tblLayout', { attributes: [wmlAttr('type', 'fixed')] }));
}
/**
 * Read `w:tblStyleRowBandSize/@w:val` (`CT_DecimalNumber`).
 *
 * Absent or non-integer wire → `undefined` (consumer default band height is 1).
 * Citations: ECMA-376-1 §17.7.6.7; Transitional `wml.xsd` `CT_TblPrBase`.
 *
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {number | undefined} The result.
 * @private
 */
export function readTableRowBandSize(tblPr: OpenXmlElement): number | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblStyleRowBandSize');
    if (el === undefined) {
        return undefined;
    }
    return parseDecimalVal(wValAttribute(el));
}
/**
 * Write or clear `w:tblStyleRowBandSize`. Emitted only when `size` is defined.
 *
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {number | undefined} size - The size.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableRowBandSize(tblPr: OpenXmlElement, size: number | undefined): OpenXmlElement {
    return writeTblChild(
        tblPr,
        'tblStyleRowBandSize',
        size !== undefined ? serializeStringVal('tblStyleRowBandSize', String(size)) : undefined
    );
}
/**
 * Read `w:tblStyleColBandSize/@w:val` (`CT_DecimalNumber`).
 *
 * Absent or non-integer wire → `undefined` (consumer default band width is 1).
 * Citations: ECMA-376-1 §17.7.6.5; Transitional `wml.xsd` `CT_TblPrBase`.
 *
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @returns {number | undefined} The result.
 * @private
 */
export function readTableColumnBandSize(tblPr: OpenXmlElement): number | undefined {
    const el: OpenXmlElement = findWmlChild(tblPr, 'tblStyleColBandSize');
    if (el === undefined) {
        return undefined;
    }
    return parseDecimalVal(wValAttribute(el));
}
/**
 * Write or clear `w:tblStyleColBandSize`. Emitted only when `size` is defined.
 *
 * @param {OpenXmlElement} tblPr - The tbl pr.
 * @param {number | undefined} size - The size.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function writeTableColumnBandSize(tblPr: OpenXmlElement, size: number | undefined): OpenXmlElement {
    return writeTblChild(
        tblPr,
        'tblStyleColBandSize',
        size !== undefined ? serializeStringVal('tblStyleColBandSize', String(size)) : undefined
    );
}
// Re-export on-off for tr/tc consumers that need serializeOnOff without extra imports coupling
export { parseOnOff, serializeOnOff };
