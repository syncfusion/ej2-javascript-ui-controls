import { Shape } from '../core/shapes/shape';
import { OoxmlElement } from '../core/xml/dom';
import { findChild, getAttr } from '../core/shapes/dom-utils';
import { readFillProperties, readLineElement } from '../core/shapes/read-fill-line';
import { getGradientDrawingNamespace } from '../core/theme/read-gradient';
import { TableRenderSnapshot, TableCellRenderSnapshot, TableCellBorderSnapshot, TableCellDirectStyleSnapshot,
    TableCellTextBodySnapshot, TableJsonValue } from './table-render-snapshot';
import { TableGradientFillSnapshot } from './table-fill-bindings';
import { readTextParagraphContentSnapshot, readTextParagraphDirectStyleSnapshot,
    readTextParagraphEndCharacterSnapshot } from './rich-text-snapshot';
import { arrayAt } from '../core/util/es5-compat';

/**
 * Projects the actual live table source for the main-thread viewing fallback.
 * Fill/style ownership is supplied by the same canonical selector used by the worker.
 * No optional authoring module or second XML parser is loaded.
 *
 * @param {Shape} shape - Existing library-owned graphic frame.
 * @param {TableGradientFillSnapshot} fills - Canonical source and selected fill bindings.
 * @param {Readonly<Record<string,string>>} relationships - Existing part relationship targets.
 * @returns {TableRenderSnapshot | undefined} Detached physical grid, or unavailable source.
 * @internal
 */
export function readTableShapeSnapshot(shape: Shape, fills: TableGradientFillSnapshot,
                                       relationships: Readonly<Record<string, string>> = {}): TableRenderSnapshot | undefined {
    const frame: OoxmlElement = shape.getElement();
    const ns: string | undefined = getGradientDrawingNamespace(frame.namespaceUri);
    if (ns === undefined) { return undefined; }
    const graphic: OoxmlElement | undefined = findChild(frame, ns, 'graphic');
    const data: OoxmlElement | undefined = graphic === undefined ? undefined : findChild(graphic, ns, 'graphicData');
    const table: OoxmlElement | undefined = data === undefined ? undefined : findChild(data, ns, 'tbl');
    if (table === undefined) { return undefined; }
    const pr: OoxmlElement | undefined = findChild(table, ns, 'tblPr');
    const grid: OoxmlElement | undefined = findChild(table, ns, 'tblGrid');
    const rows: OoxmlElement[] = children(table, 'tr');
    const cells: TableCellRenderSnapshot[] = [];
    const owners: Map<string, { readonly row: number; readonly column: number; }> = new Map();
    rows.forEach((row: OoxmlElement, r: number): void => {
        children(row, 'tc').forEach((cell: OoxmlElement, c: number): void => {
            const source: typeof fills.direct.cells[number] | undefined = fills.direct.cells.filter(
                (value: typeof fills.direct.cells[number]): boolean => value.row === r && value.column === c)[0];
            const selectedIndex: number = fills.direct.cells.indexOf(source);
            if (source === undefined || selectedIndex < 0) { return; }
            const props: OoxmlElement | undefined = findChild(cell, ns, 'tcPr');
            const borders: TableCellBorderSnapshot = { left: readLineElement(props && findChild(props, ns, 'lnL')),
                right: readLineElement(props && findChild(props, ns, 'lnR')), top: readLineElement(props && findChild(props, ns, 'lnT')),
                bottom: readLineElement(props && findChild(props, ns, 'lnB')), insideDiagonalDown: readLineElement(props && findChild(props, ns, 'lnTlToBr')),
                insideDiagonalUp: readLineElement(props && findChild(props, ns, 'lnBlToTr')) };
            const direct: TableCellDirectStyleSnapshot = {
                marginLeftEmu: number(props, 'marL', 91440), marginRightEmu: number(props, 'marR', 91440),
                marginTopEmu: number(props, 'marT', 45720), marginBottomEmu: number(props, 'marB', 45720),
                verticalType: attr(props, 'vert') || 'horz', anchor: attr(props, 'anchor') || 't',
                anchorCenter: boolean(props, 'anchorCtr'), horizontalOverflow: attr(props, 'horzOverflow') || 'clip',
                fill: props === undefined ? { kind: 'missing' } : readFillProperties(props), borders };
            const owner: { readonly row: number; readonly column: number; } = owners.get(r + ':' + c) || { row: r, column: c };
            if (!source.horizontalMerge && !source.verticalMerge) {
                for (let y: number = r; y < Math.min(rows.length, r + source.rowSpan); y++) {
                    for (let x: number = c; x < Math.min(fills.direct.columnCount, c + source.columnSpan); x++) {
                        owners.set(y + ':' + x, owner);
                    }
                }
            }
            const selected: typeof fills.resolved.cells[number] = arrayAt(fills.resolved.cells, selectedIndex);
            const body: OoxmlElement | undefined = findChild(cell, ns, 'txBody');
            cells.push({ row: r, column: c, columnSpan: source.columnSpan, rowSpan: source.rowSpan,
                horizontalMerge: source.horizontalMerge, verticalMerge: source.verticalMerge,
                mergeOwnerRow: owner.row, mergeOwnerColumn: owner.column, direct,
                resolved: { buckets: source.buckets, fill: selected.choice.kind === 'fill' && selected.choice.fill.kind === 'none' ?
                    { kind: 'noFill' } : direct.fill, fillSource: selected.source === 'cell' ? 'cell' : 'none', borders,
                borderSources: { left: 'none', right: 'none', top: 'none', bottom: 'none', insideDiagonalDown: 'none', insideDiagonalUp: 'none' } },
                ...(body === undefined ? {} : { textBody: textBody(body, relationships) }) });
        });
    });
    return { authoredFills: fills, direct: { styleId: fills.direct.styleId,
        firstRow: boolean(pr, 'firstRow'), lastRow: boolean(pr, 'lastRow'), firstColumn: boolean(pr, 'firstCol'),
        lastColumn: boolean(pr, 'lastCol'), bandedRows: boolean(pr, 'bandRow'), bandedColumns: boolean(pr, 'bandCol') },
    columnWidthsEmu: grid === undefined ? [] : children(grid, 'gridCol').map((col: OoxmlElement): number => number(col, 'w', 0)),
    rowHeightsEmu: rows.map((row: OoxmlElement): number => number(row, 'h', 0)), cells };
}
/** @param {OoxmlElement} body - Actual source body.
 * @param {Readonly<Record<string,string>>} relationships - Part relationship targets.
 * @returns {TableCellTextBodySnapshot} Clone-safe sparse authored text.
 */
function textBody(body: OoxmlElement, relationships: Readonly<Record<string, string>>): TableCellTextBodySnapshot {
    // Serialize only DTOs, never DOM. The JSON boundary retains the existing open text payload type.
    const value: unknown = JSON.parse(JSON.stringify({ paragraphs: children(body, 'p').map((paragraph: OoxmlElement): object => {
        const pr: OoxmlElement | undefined = findChild(paragraph, body.namespaceUri, 'pPr');
        return { ...(pr === undefined ? {} : readTextParagraphDirectStyleSnapshot(pr, relationships)),
            content: readTextParagraphContentSnapshot(paragraph, relationships),
            endCharacter: readTextParagraphEndCharacterSnapshot(paragraph, relationships) };
    }) }));
    return jsonObject(value) ? value : {};
}
/** @param {*} value - JSON boundary input.
 * @returns {boolean} A recursively checked DTO object.
 */
function jsonObject(value: unknown): value is TableCellTextBodySnapshot {
    return value !== null && typeof value === 'object' && !Array.isArray(value) &&
        Object.keys(value).every((key: string): boolean => jsonValue(Object.getOwnPropertyDescriptor(value, key).value));
}
/** @param {*} value - JSON boundary member.
 * @returns {boolean} Supported scalar/array/object only.
 */
function jsonValue(value: unknown): value is TableJsonValue {
    return value === null || typeof value === 'string' || typeof value === 'boolean' ||
        typeof value === 'number' && Number.isFinite(value) ||
        Array.isArray(value) && value.every(jsonValue) || jsonObject(value);
}
/** @param {OoxmlElement} parent - Actual scoped owner.
 * @param {string} name - DrawingML child name.
 * @returns {OoxmlElement[]} Direct children only.
 */
function children(parent: OoxmlElement, name: string): OoxmlElement[] {
    return parent.children.filter((child: typeof parent.children[number]): child is OoxmlElement =>
        child.kind === 'element' && child.namespaceUri === parent.namespaceUri && child.localName === name);
}
/** @param {OoxmlElement} owner - Optional direct source.
 * @param {string} name - Attribute name.
 * @returns {string | undefined} Authored token.
 */
function attr(owner: OoxmlElement | undefined, name: string): string | undefined { return owner === undefined ? undefined : getAttr(owner, '', name); }
/** @param {OoxmlElement} owner - Optional source.
 * @param {string} name - Attribute name.
 * @param {number} fallback - Schema/read default.
 * @returns {number} Finite nonnegative source value or default.
 */
function number(owner: OoxmlElement | undefined, name: string, fallback: number): number {
    const raw: string | undefined = attr(owner, name); const value: number = Number(raw);
    return raw !== undefined && Number.isFinite(value) && value >= 0 ? value : fallback;
}
/** @param {OoxmlElement} owner - Optional source.
 * @param {string} name - Attribute name.
 * @returns {boolean} Native boolean token.
 */
function boolean(owner: OoxmlElement | undefined, name: string): boolean { const value: string | undefined = attr(owner, name); return value === '1' || value === 'true'; }
