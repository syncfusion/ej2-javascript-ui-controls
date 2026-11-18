import { TableCellFillSnapshot, TableStyleFillSnapshot, TableStyleFillRegion } from './table-fill-bindings';
/** Canonical table-border sources; CT_TableCellProperties and CT_ThemeableLineStyle. */
import { OoxmlElement, OoxmlText } from '../core/xml/dom';
import { findChild, getAttr } from '../core/shapes/dom-utils';
import { AuthoredGradientFill } from '../core/theme/gradient-types';
import { getGradientDrawingNamespace } from '../core/theme/read-gradient';
import { readDrawingFillChoice, TextFillSnapshot } from '../core/text/character-fills';
import { AuthoredLineMatrixReference, readLineMatrixReference } from '../core/theme/read-fill-reference';
import { arrayAt } from '../core/util/es5-compat';
import { TableCellBorderSnapshot, TableStyleBucket } from './table-render-snapshot';
/** Physical border names from the established render contract. @public */
export type TablePhysicalBorderEdge = keyof TableCellBorderSnapshot;
/** Style-only interior edges remain authored context, not projected physical edges. @public */
export type TableBorderEdge = TablePhysicalBorderEdge | 'insideHorizontal' | 'insideVertical';
/** Uninterpreted authored line tokens; absence and present-empty carriers remain distinct. @public */
export interface TableBorderLineProperties {
    readonly width: string | undefined;
    readonly cap: string | undefined;
    readonly compound: string | undefined;
    readonly align: string | undefined;
    readonly dash?: { readonly kind: 'preset'; readonly value: string | undefined } |
    { readonly kind: 'custom'; readonly stops: ReadonlyArray<{ readonly dash: string | undefined; readonly space: string | undefined }> };
    readonly join?: { readonly kind: 'round' | 'bevel' | 'miter'; readonly limit: string | undefined };
    readonly headEnd?: { readonly type: string | undefined; readonly width: string | undefined; readonly length: string | undefined };
    readonly tailEnd?: { readonly type: string | undefined; readonly width: string | undefined; readonly length: string | undefined };
}
/** Present line, reference, or an empty style-edge wrapper. @public */
export type TableBorderChoice = { readonly kind: 'line'; readonly fill: TextFillSnapshot; readonly properties: TableBorderLineProperties } |
{ readonly kind: 'reference'; readonly reference: AuthoredLineMatrixReference } | { readonly kind: 'empty' };
/** Only actual edge carriers are recorded; absence does not allocate an empty bag. @public */
export interface TableBorderRecord { readonly edge: TableBorderEdge; readonly choice: TableBorderChoice; }
/** Selected source per physical edge, without evaluating theme references. @public */
export interface TableBorderSelection {
    readonly edge: TablePhysicalBorderEdge;
    readonly source: 'cell' | TableStyleBucket | 'none';
    readonly partName: string;
    readonly choice: TableBorderChoice | undefined;
}
/** Existing low-to-high border order, independent of fill selection order. @internal */
export const tableBorderBucketOrder: ReadonlyArray<TableStyleBucket> = ['wholeTbl', 'band1H', 'band2H', 'band1V', 'band2V',
    'firstRow', 'lastRow', 'firstCol', 'lastCol', 'nwCell', 'neCell', 'swCell', 'seCell'];
const PHYSICAL: ReadonlyArray<TablePhysicalBorderEdge> = ['left', 'right', 'top', 'bottom', 'insideDiagonalDown', 'insideDiagonalUp'];
const HOSTS: ReadonlyArray<{ edge: TableBorderEdge; cell: string | undefined; style: string }> = [
    { edge: 'left', cell: 'lnL', style: 'left' }, { edge: 'right', cell: 'lnR', style: 'right' },
    { edge: 'top', cell: 'lnT', style: 'top' }, { edge: 'bottom', cell: 'lnB', style: 'bottom' },
    { edge: 'insideDiagonalDown', cell: 'lnTlToBr', style: 'tl2br' }, { edge: 'insideDiagonalUp', cell: 'lnBlToTr', style: 'tr2bl' },
    { edge: 'insideHorizontal', cell: undefined, style: 'insideH' }, { edge: 'insideVertical', cell: undefined, style: 'insideV' }
];
/**
 * @param {OoxmlElement} parent - Optional exact tcPr or tcBdr.
 * @param {string} partName - Source identity.
 * @param {boolean} style - Whether this is a table-style border wrapper.
 * @param {ReadonlyMap<OoxmlElement, AuthoredGradientFill>} gradients - Part-local parsed gradient reuse.
 * @returns {ReadonlyArray<TableBorderRecord> | undefined} Sparse present edges, excluding foreign/MC branches.
 * @internal
 */
export function readTableBorders(parent: OoxmlElement | undefined, partName: string, style: boolean,
                                 gradients?: ReadonlyMap<OoxmlElement, AuthoredGradientFill>
): ReadonlyArray<TableBorderRecord> | undefined {
    if (parent === undefined || getGradientDrawingNamespace(parent.namespaceUri) !== parent.namespaceUri) { return undefined; }
    const records: TableBorderRecord[] = [];
    const seen: Set<TableBorderEdge> = new Set();
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== parent.namespaceUri) { continue; }
        for (let h: number = 0; h < HOSTS.length; h++) {
            const host: { edge: TableBorderEdge; cell: string | undefined; style: string } = arrayAt(HOSTS, h);
            if (child.localName !== (style ? host.style : host.cell) || seen.has(host.edge)) { continue; }
            seen.add(host.edge);
            const choice: OoxmlElement | undefined = style ? first(child, ['ln', 'lnRef']) : child;
            let value: TableBorderChoice = { kind: 'empty' };
            if (choice !== undefined && choice.localName === 'lnRef') {
                const reference: AuthoredLineMatrixReference | undefined = readLineMatrixReference(choice, partName);
                if (reference !== undefined) { value = { kind: 'reference', reference }; }
            } else if (choice !== undefined) {
                value = { kind: 'line', properties: readProperties(choice),
                    fill: readDrawingFillChoice(choice, parent.namespaceUri, partName, gradients) };
            }
            records.push({ edge: host.edge, choice: value }); break;
        }
    }
    return records.length === 0 ? undefined : records;
}
/**
 * @param {OoxmlElement} parent - Namespace-scoped carrier.
 * @param {ReadonlyArray<string>} names - Selected schema alternatives.
 * @returns {OoxmlElement | undefined} First direct exact-namespace choice.
 */
function first(parent: OoxmlElement, names: ReadonlyArray<string>): OoxmlElement | undefined {
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === parent.namespaceUri && names.indexOf(child.localName) >= 0) { return child; }
    }
    return undefined;
}
/**
 * @param {OoxmlElement} line - Exact CT_LineProperties host in either dialect.
 * @returns {TableBorderLineProperties} Known scalar/choice tokens; unknown XML stays in its source part.
 */
function readProperties(line: OoxmlElement): TableBorderLineProperties {
    const dash: OoxmlElement | undefined = first(line, ['prstDash', 'custDash']);
    const join: OoxmlElement | undefined = first(line, ['round', 'bevel', 'miter']);
    const stops: Array<{ dash: string | undefined; space: string | undefined }> = [];
    if (dash !== undefined && dash.localName === 'custDash') {
        for (let i: number = 0; i < dash.children.length; i++) {
            const stop: OoxmlElement | OoxmlText = arrayAt(dash.children, i);
            if (stop.kind === 'element' && stop.namespaceUri === line.namespaceUri && stop.localName === 'ds') {
                stops.push({ dash: getAttr(stop, '', 'd'), space: getAttr(stop, '', 'sp') });
            }
        }
    }
    return { width: getAttr(line, '', 'w'), cap: getAttr(line, '', 'cap'), compound: getAttr(line, '', 'cmpd'), align: getAttr(line, '', 'algn'),
        ...(dash === undefined ? {} : { dash: dash.localName === 'prstDash' ?
            { kind: 'preset', value: getAttr(dash, '', 'val') } : { kind: 'custom', stops } }),
        ...(join === undefined ? {} : { join: { kind: join.localName === 'round' ? 'round' : join.localName === 'bevel' ? 'bevel' : 'miter',
            limit: getAttr(join, '', 'lim') } }),
        ...end(line, 'headEnd'), ...end(line, 'tailEnd') };
}
/**
 * @param {OoxmlElement} line - Exact line host.
 * @param {string} name - headEnd or tailEnd.
 * @returns {Partial<TableBorderLineProperties>} Presence-aware endpoint tokens.
 */
function end(line: OoxmlElement, name: 'headEnd' | 'tailEnd'): Partial<TableBorderLineProperties> {
    const node: OoxmlElement | undefined = findChild(line, line.namespaceUri, name);
    if (node === undefined) { return {}; }
    const value: { type: string | undefined; width: string | undefined; length: string | undefined } =
        { type: getAttr(node, '', 'type'), width: getAttr(node, '', 'w'), length: getAttr(node, '', 'len') };
    return name === 'headEnd' ? { headEnd: value } : { tailEnd: value };
}

/**
 * @param {ReadonlyArray<TableCellFillSnapshot>} cells - Existing physical cell identities and eligible regions.
 * @param {TableStyleFillSnapshot} style - Unambiguous selected style, if any.
 * @param {string} partName - Direct source part.
 * @returns {ReadonlyArray<ReadonlyArray<TableBorderSelection>> | undefined} Selected six-edge sources, or sparse absence.
 * @internal
 */
export function resolveTableBorderCells(cells: ReadonlyArray<TableCellFillSnapshot>, style: TableStyleFillSnapshot | undefined,
                                        partName: string): ReadonlyArray<ReadonlyArray<TableBorderSelection>> | undefined {
    if (!cells.some((cell: TableCellFillSnapshot): boolean => cell.borders !== undefined) &&
        (style === undefined || !style.regions.some((region: TableStyleFillRegion): boolean => region.borders !== undefined))) {
        return undefined;
    }
    const ordered: TableStyleFillRegion[] = [];
    if (style !== undefined) {
        tableBorderBucketOrder.forEach((bucket: TableStyleBucket): void => {
            style.regions.forEach((region: TableStyleFillRegion): void => { if (region.bucket === bucket) { ordered.push(region); } });
        });
    }
    return cells.map((cell: TableCellFillSnapshot): ReadonlyArray<TableBorderSelection> =>
        PHYSICAL.map((edge: TablePhysicalBorderEdge): TableBorderSelection => {
            const direct: TableBorderChoice | undefined = borderChoice(cell.borders, edge);
            if (direct !== undefined && direct.kind !== 'empty') { return { edge, source: 'cell', partName, choice: direct }; }
            for (let i: number = ordered.length - 1; i >= 0; i--) {
                const region: TableStyleFillRegion = arrayAt(ordered, i);
                if (cell.buckets.indexOf(region.bucket) < 0) { continue; }
                const value: TableBorderChoice | undefined = borderChoice(region.borders, edge);
                if (value !== undefined && value.kind !== 'empty' && style !== undefined) {
                    return { edge, source: region.bucket, partName: style.partName, choice: value };
                }
            }
            return { edge, source: 'none', partName, choice: undefined };
        }));
}
/**
 * @param {ReadonlyArray<TableBorderRecord>} records - Optional sparse exact edge records.
 * @param {TablePhysicalBorderEdge} edge - Physical edge name.
 * @returns {TableBorderChoice | undefined} First authored choice, without merging properties across lines.
 */
function borderChoice(records: ReadonlyArray<TableBorderRecord> | undefined, edge: TablePhysicalBorderEdge): TableBorderChoice | undefined {
    if (records === undefined) { return undefined; }
    for (let i: number = 0; i < records.length; i++) {
        const record: TableBorderRecord = arrayAt(records, i);
        if (record.edge === edge) { return record.choice; }
    }
    return undefined;
}
