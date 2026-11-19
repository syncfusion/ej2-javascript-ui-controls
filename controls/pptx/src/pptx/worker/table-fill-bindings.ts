import { TableTextStyleSnapshot, TableTextStyleSelection, readTableTextStyle, resolveTableTextStyles } from './table-text-style';
import { LayoutTextBodySnapshot } from '../core/layout/layout-model';
import { readTextBodyLayoutSnapshot } from './rich-text-snapshot';
import { TableBorderRecord, TableBorderSelection, readTableBorders, resolveTableBorderCells } from './table-border-bindings';
import { AuthoredGradientFill } from '../core/theme/gradient-types';
import { parseGradientBoolean } from '../core/theme/gradient-values';
/** Complete table fills and selected sources, independent of legacy paint projection. */
import { OoxmlElement, OoxmlText } from '../core/xml/dom';
import { findChild, getAttr, collectDirectText } from '../core/shapes/dom-utils';
import { getGradientDrawingNamespace } from '../core/theme/read-gradient';
import { readDrawingFillChoice, TextFillSnapshot } from '../core/text/character-fills';
import { AuthoredFillMatrixReference, readFillMatrixReference } from '../core/theme/read-fill-reference';
import { DEFAULT_SECURITY_LIMITS } from '../core/security/limits';
import { PackageLimitError } from '../core/security/errors';
import { arrayAt } from '../core/util/es5-compat';
import { TableDirectPropertiesSnapshot, TableStyleBucket, TableRenderSnapshot, TableCellRenderSnapshot } from './table-render-snapshot';
/** Authored fill choice or a theme matrix reference; no evaluated RGB. @public */
export type TableFillChoice = { readonly kind: 'missing' } |
{ readonly kind: 'fill'; readonly fill: TextFillSnapshot } |
{ readonly kind: 'reference'; readonly reference: AuthoredFillMatrixReference };
/** Complete fill and sparse border sources for one actual table-style region. @public */
export interface TableStyleFillRegion {
    /** Independent direct table text defaults; absent in older producers. */
    readonly textStyle?: TableTextStyleSnapshot;
    readonly bucket: TableStyleBucket;
    readonly fill: TableFillChoice;
    readonly borders?: ReadonlyArray<TableBorderRecord>;
}
/** One exact table-style definition. Duplicate IDs are retained as ambiguous. @public */
export interface TableStyleFillSnapshot {
    readonly partName: string;
    readonly styleId: string | undefined;
    readonly background: TableFillChoice;
    readonly regions: ReadonlyArray<TableStyleFillRegion>;
}
/** Physical cell source, not redirected to a merge owner. @public */
export interface TableCellFillSnapshot {
    /** Sparse authored text for the existing rich-text layout contract; absent in older producers. */
    readonly textBody?: LayoutTextBodySnapshot;
    readonly row: number;
    readonly column: number;
    readonly columnSpan: number;
    readonly rowSpan: number;
    readonly horizontalMerge: boolean;
    readonly verticalMerge: boolean;
    readonly fill: TableFillChoice;
    readonly buckets: ReadonlyArray<TableStyleBucket>;
    /** Sparse actual direct border carriers; absent in older producers. */
    readonly borders?: ReadonlyArray<TableBorderRecord>;
}
/** Complete direct table and physical cell fill inputs. @public */
export interface TableFillData {
    readonly partName: string;
    readonly styleId: string | undefined;
    readonly inlineStyle: TableStyleFillSnapshot | undefined;
    readonly background: TableFillChoice;
    readonly columnCount: number;
    readonly rowCount: number;
    readonly cells: ReadonlyArray<TableCellFillSnapshot>;
}
/** Selected source with raw reference substitution context; theme evaluation is separate. @public */
export interface TableFillSelection {
    readonly source: 'table' | 'cell' | 'style-background' | TableStyleBucket | 'none';
    readonly partName: string;
    readonly choice: TableFillChoice;
}
/** Region selection without flattening gradients, references, or background into cells. @public */
export interface TableFillResolvedData {
    /** Independent per-cell text defaults and provenance; absent in older producers. */
    readonly textCells?: ReadonlyArray<TableTextStyleSelection>;
    readonly styleResolution: 'inline' | 'shared' | 'none' | 'missing' | 'ambiguous';
    readonly style: TableStyleFillSnapshot | undefined;
    readonly background: TableFillSelection;
    readonly cells: ReadonlyArray<TableFillSelection>;
    /** Independent border-source selection in physical row-major order. */
    readonly borderCells?: ReadonlyArray<ReadonlyArray<TableBorderSelection>>;
}
/** Bindable shape identity for a canonical table; duplicate identities are withheld. @internal */
export interface TableFillBinding { readonly id: string; readonly data: TableFillData; }
/** Part-local parse cache; never retained in a wire record. */
type GradientCache = ReadonlyMap<OoxmlElement, AuthoredGradientFill>;
const MISSING: TableFillChoice = Object.freeze<{ kind: 'missing' }>({ kind: 'missing' });
const REGIONS: ReadonlyArray<TableStyleBucket> = ['wholeTbl', 'band1H', 'band2H', 'band1V', 'band2V',
    'firstRow', 'lastRow', 'firstCol', 'lastCol', 'nwCell', 'neCell', 'swCell', 'seCell'];

/**
 * @param {OoxmlElement} parent - Exact dialect container, or absent.
 * @param {string} partName - Source identity.
 * @param {boolean} themeable - Whether fill/fillRef wrappers are schema alternatives.
 * @param {GradientCache} gradients - Optional parsed gradients from the same complete part.
 * @returns {TableFillChoice} First selected direct alternative without nested fallback.
 */
function readChoice(parent: OoxmlElement | undefined, partName: string, themeable: boolean, gradients?: GradientCache): TableFillChoice {
    if (parent === undefined) { return MISSING; }
    const ns: string = parent.namespaceUri;
    if (!themeable) {
        const fill: TextFillSnapshot = readDrawingFillChoice(parent, ns, partName, gradients);
        return fill.kind === 'missing' ? MISSING : { kind: 'fill', fill };
    }
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== ns) { continue; }
        if (child.localName === 'fill') { return { kind: 'fill', fill: readDrawingFillChoice(child, ns, partName, gradients) }; }
        if (child.localName === 'fillRef') {
            const reference: AuthoredFillMatrixReference | undefined = readFillMatrixReference(child, partName);
            return reference === undefined ? MISSING : { kind: 'reference', reference };
        }
    }
    return MISSING;
}
/**
 * @param {OoxmlElement} root - Complete tableStyles part root with in-scope namespaces.
 * @param {string} partName - Source identity.
 * @param {GradientCache} gradients - Optional parsed gradients from the same complete part.
 * @returns {ReadonlyArray<TableStyleFillSnapshot>} Direct shared styles; duplicates retained for explicit ambiguity.
 * @internal
 */
export function readTableStyleFills(root: OoxmlElement, partName: string,
                                    gradients?: GradientCache): ReadonlyArray<TableStyleFillSnapshot> {
    if (getGradientDrawingNamespace(root.namespaceUri) !== root.namespaceUri || root.localName !== 'tblStyleLst') { return []; }
    return children(root, 'tblStyle').map((style: OoxmlElement): TableStyleFillSnapshot => readStyle(style, partName, gradients));
}
/**
 * @param {OoxmlElement} style - Exact tableStyle or tblStyle.
 * @param {string} partName - Source identity.
 * @param {GradientCache} gradients - Optional parsed gradients from the same complete part.
 * @returns {TableStyleFillSnapshot} Background and region sources, without theme evaluation.
 */
function readStyle(style: OoxmlElement, partName: string, gradients?: GradientCache): TableStyleFillSnapshot {
    const regions: TableStyleFillRegion[] = [];
    REGIONS.forEach((bucket: TableStyleBucket): void => {
        const region: OoxmlElement | undefined = findChild(style, style.namespaceUri, bucket);
        if (region !== undefined) {
            const cellStyle: OoxmlElement | undefined = findChild(region, style.namespaceUri, 'tcStyle');
            const borders: ReadonlyArray<TableBorderRecord> | undefined = readTableBorders(cellStyle === undefined ? undefined :
                findChild(cellStyle, style.namespaceUri, 'tcBdr'), partName, true, gradients);
            const textStyle: TableTextStyleSnapshot | undefined = readTableTextStyle(findChild(region, style.namespaceUri, 'tcTxStyle'));
            regions.push({ bucket, ...(textStyle === undefined ? {} : { textStyle }),
                fill: readChoice(cellStyle, partName, true, gradients), ...(borders === undefined ? {} : { borders }) });
        }
    });
    return { partName, styleId: getAttr(style, '', 'styleId'), regions,
        background: readChoice(findChild(style, style.namespaceUri, 'tblBg'), partName, true, gradients) };
}

/**
 * Existing Cell.DefaultFillFormat region order; header/first-column cells are excluded from bands.
 *
 * @param {number} row - Physical row.
 * @param {number} column - Physical column.
 * @param {number} rowCount - Row count.
 * @param {number} columnCount - Grid width.
 * @param {TableDirectPropertiesSnapshot} direct - Existing authored flags.
 * @returns {ReadonlyArray<TableStyleBucket>} High-to-low selection order, unchanged from the legacy Worker.
 * @internal
 */
export function tableFillBuckets(row: number, column: number, rowCount: number, columnCount: number,
                                 direct: TableDirectPropertiesSnapshot): ReadonlyArray<TableStyleBucket> {
    const buckets: TableStyleBucket[] = [];
    if (direct.firstRow && row === 0) { buckets.push('firstRow'); }
    if (direct.firstColumn && column === 0) { buckets.push('firstCol'); }
    if (direct.lastColumn && column === columnCount - 1) { buckets.push('lastCol'); }
    if (direct.lastRow && row === rowCount - 1) { buckets.push('lastRow'); }
    if (direct.bandedRows && !(direct.firstRow && row === 0)) { buckets.push((row - (direct.firstRow ? 1 : 0)) % 2 === 0 ? 'band1H' : 'band2H'); }
    if (direct.bandedColumns && !(direct.firstColumn && column === 0)) {
        buckets.push((column - (direct.firstColumn ? 1 : 0)) % 2 === 0 ? 'band1V' : 'band2V');
    }
    buckets.push('wholeTbl');
    return buckets;
}
/**
 * @param {OoxmlElement} parent - Exact owning dialect.
 * @param {string} name - Direct local name.
 * @returns {OoxmlElement[]} Matching direct children, excluding foreign/MC branches.
 */
function children(parent: OoxmlElement, name: string): OoxmlElement[] {
    const result: OoxmlElement[] = [];
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === parent.namespaceUri && child.localName === name) { result.push(child); }
    }
    return result;
}

/**
 * @param {OoxmlElement} root - Already parsed complete slide/layout/master part.
 * @param {string} partName - Source identity.
 * @param {number} maxDepth - Existing group-depth limit.
 * @param {GradientCache} gradients - Optional parsed gradients from the same complete part.
 * @returns {ReadonlyArray<TableFillBinding>} Actual table frames with unique canonical identities.
 * @internal
 */
export function readTableFillBindings(root: OoxmlElement, partName: string,
                                      maxDepth: number = DEFAULT_SECURITY_LIMITS.groupNestingDepth,
                                      gradients?: GradientCache): ReadonlyArray<TableFillBinding> {
    const ns: string = root.namespaceUri;
    const dml: string | undefined = getGradientDrawingNamespace(ns);
    if (dml === undefined || dml === ns) { return []; }
    const common: OoxmlElement | undefined = findChild(root, ns, 'cSld');
    const tree: OoxmlElement | undefined = common === undefined ? undefined : findChild(common, ns, 'spTree');
    if (tree === undefined) { return []; }
    const result: TableFillBinding[] = [];
    const counts: Map<string, number> = new Map();
    /**
     * @param {OoxmlElement} shape - Actual direct shape-tree element.
     * @returns {string | undefined} Owning nonvisual id.
     */
    function identity(shape: OoxmlElement): string | undefined {
        const name: string = shape.localName === 'sp' ? 'nvSpPr' : shape.localName === 'cxnSp' ? 'nvCxnSpPr' :
            shape.localName === 'pic' ? 'nvPicPr' : shape.localName === 'graphicFrame' ? 'nvGraphicFramePr' :
                shape.localName === 'contentPart' ? 'nvContentPartPr' : 'nvGrpSpPr';
        const nv: OoxmlElement | undefined = findChild(shape, ns, name);
        const properties: OoxmlElement | undefined = nv === undefined ? undefined : findChild(nv, ns, 'cNvPr');
        return properties === undefined ? undefined : getAttr(properties, '', 'id');
    }
    /**
     * @param {OoxmlElement} container - Root or nested group.
     * @param {number} depth - Root spTree is zero.
     * @returns {void} Collects exact table records and all potential id collisions.
     */
    function visit(container: OoxmlElement, depth: number): void {
        for (let i: number = 0; i < container.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(container.children, i);
            if (child.kind !== 'element' || child.namespaceUri !== ns ||
                ['sp', 'cxnSp', 'pic', 'grpSp', 'graphicFrame', 'contentPart'].indexOf(child.localName) < 0) { continue; }
            const id: string | undefined = identity(child);
            if (id !== undefined) { counts.set(id, (counts.get(id) || 0) + 1); }
            if (child.localName === 'grpSp') {
                if (depth + 1 > maxDepth) { throw new PackageLimitError('groupNestingDepth', { partName, actual: depth + 1 }); }
                visit(child, depth + 1);
            }
            if (child.localName !== 'graphicFrame' || id === undefined) { continue; }
            const graphic: OoxmlElement | undefined = findChild(child, dml, 'graphic');
            const data: OoxmlElement | undefined = graphic === undefined ? undefined : findChild(graphic, dml, 'graphicData');
            const uri: string | undefined = data === undefined ? undefined : getAttr(data, '', 'uri');
            if (uri !== 'http://schemas.openxmlformats.org/drawingml/2006/table' &&
                uri !== 'http://purl.oclc.org/ooxml/drawingml/table') { continue; }
            const table: OoxmlElement | undefined = data === undefined ? undefined : findChild(data, dml, 'tbl');
            if (table !== undefined) { result.push({ id, data: readTableFillData(table, partName, gradients) }); }
        }
    }
    const rootId: string | undefined = identity(tree);
    if (rootId !== undefined) { counts.set(rootId, 1); }
    visit(tree, 0);
    return result.filter((binding: TableFillBinding): boolean => counts.get(binding.id) === 1);
}
/**
 * @param {OoxmlElement} table - Exact DrawingML tbl, independent of optional authoring adapters.
 * @param {string} partName - Source identity.
 * @param {GradientCache} gradients - Optional parsed gradients from the same complete part.
 * @returns {TableFillData} Complete physical fill inputs in row-major order.
 * @internal
 */
export function readTableFillData(table: OoxmlElement, partName: string, gradients?: GradientCache): TableFillData {
    const ns: string = table.namespaceUri;
    const properties: OoxmlElement | undefined = findChild(table, ns, 'tblPr');
    const grid: OoxmlElement | undefined = findChild(table, ns, 'tblGrid');
    const rows: OoxmlElement[] = children(table, 'tr');
    const columnCount: number = grid === undefined ? 0 : children(grid, 'gridCol').length;
    let styleId: string | undefined;
    let inlineStyle: TableStyleFillSnapshot | undefined;
    if (properties !== undefined) {
        for (let i: number = 0; i < properties.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(properties.children, i);
            if (child.kind !== 'element' || child.namespaceUri !== ns) { continue; }
            if (child.localName === 'tableStyle') { inlineStyle = readStyle(child, partName, gradients); break; }
            if (child.localName === 'tableStyleId') {
                styleId = collectDirectText(child).replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, ''); break;
            }
        }
    }
    const flags: TableDirectPropertiesSnapshot = { firstRow: flag(properties, 'firstRow'), lastRow: flag(properties, 'lastRow'),
        firstColumn: flag(properties, 'firstCol'), lastColumn: flag(properties, 'lastCol'),
        bandedRows: flag(properties, 'bandRow'), bandedColumns: flag(properties, 'bandCol') };
    const cells: TableCellFillSnapshot[] = [];
    rows.forEach((row: OoxmlElement, rowIndex: number): void => {
        children(row, 'tc').forEach((cell: OoxmlElement, column: number): void => {
            const borders: ReadonlyArray<TableBorderRecord> | undefined =
                readTableBorders(findChild(cell, ns, 'tcPr'), partName, false, gradients);
            const body: OoxmlElement | undefined = findChild(cell, ns, 'txBody');
            cells.push({ ...(body === undefined ? {} : { textBody: readTextBodyLayoutSnapshot(body) }),
                ...(borders === undefined ? {} : { borders }), row: rowIndex, column, columnSpan: span(cell, 'gridSpan'), rowSpan: span(cell, 'rowSpan'),
                horizontalMerge: flag(cell, 'hMerge'), verticalMerge: flag(cell, 'vMerge'),
                fill: readChoice(findChild(cell, ns, 'tcPr'), partName, false, gradients),
                buckets: tableFillBuckets(rowIndex, column, rows.length, columnCount, flags) });
        });
    });
    return { partName, styleId, inlineStyle, background: readChoice(properties, partName, false, gradients),
        columnCount, rowCount: rows.length, cells };
}
/**
 * @param {OoxmlElement} element - Direct carrier or absent.
 * @param {string} name - XML boolean attribute.
 * @returns {boolean} Valid true spelling; missing/invalid retains the existing false fallback.
 */
function flag(element: OoxmlElement | undefined, name: string): boolean {
    const raw: string | undefined = element === undefined ? undefined : getAttr(element, '', name);
    const parsed: ReturnType<typeof parseGradientBoolean> = parseGradientBoolean(raw);
    return parsed.kind === 'value' && parsed.value;
}
/**
 * @param {OoxmlElement} element - Physical cell.
 * @param {string} name - Span attribute.
 * @returns {number} Positive whole span or the existing one-cell fallback.
 */
function span(element: OoxmlElement, name: string): number {
    const raw: string | undefined = getAttr(element, '', name);
    const token: string = raw === undefined ? '' : raw.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '');
    const value: number = Number(token);
    return /^[+]?[0-9]+$/.test(token) && Number.isInteger(value) && value >= 1 && value <= 2147483647 ? value : 1;
}

/**
 * Selects existing region sources without replacing theme references with literal colors.
 *
 * @param {TableFillData} data - Exact table and physical cell authored inputs.
 * @param {ReadonlyArray<TableStyleFillSnapshot>} styles - Canonical styles from the related tableStyles part.
 * @param {TableStyleFillIndex} index - Optional reusable package index.
 * @returns {TableFillResolvedData} Selected source context; references still require theme evaluation.
 * @internal
 */
export function resolveTableFillData(data: TableFillData, styles: ReadonlyArray<TableStyleFillSnapshot> = [],
                                     index: TableStyleFillIndex = indexTableStyleFills(styles)): TableFillResolvedData {
    const entry: TableStyleFillSnapshot | undefined = data.styleId === undefined ? undefined : index.get(data.styleId);
    const style: TableStyleFillSnapshot | undefined = data.inlineStyle || entry;
    const styleResolution: TableFillResolvedData['styleResolution'] = data.inlineStyle !== undefined ? 'inline' :
        data.styleId === undefined ? 'none' : !index.has(data.styleId) ? 'missing' : entry === undefined ? 'ambiguous' : 'shared';
    const background: TableFillSelection = data.background.kind !== 'missing' ?
        { source: 'table', partName: data.partName, choice: data.background } : style !== undefined && style.background.kind !== 'missing' ?
            { source: 'style-background', partName: style.partName, choice: style.background } :
            { source: 'none', partName: data.partName, choice: MISSING };
    const borderCells: ReadonlyArray<ReadonlyArray<TableBorderSelection>> | undefined =
        resolveTableBorderCells(data.cells, style, data.partName);
    return { styleResolution, style, background, textCells: resolveTableTextStyles(data.cells, style),
        ...(borderCells === undefined ? {} : { borderCells }),
        cells: data.cells.map((cell: TableCellFillSnapshot): TableFillSelection => {
            if (cell.fill.kind !== 'missing') { return { source: 'cell', partName: data.partName, choice: cell.fill }; }
            if (style !== undefined) {
                for (let i: number = 0; i < cell.buckets.length; i++) {
                    const bucket: TableStyleBucket = arrayAt(cell.buckets, i);
                    for (let j: number = 0; j < style.regions.length; j++) {
                        const region: TableStyleFillRegion = arrayAt(style.regions, j);
                        if (region.bucket === bucket && region.fill.kind !== 'missing') {
                            return { source: bucket, partName: style.partName, choice: region.fill };
                        }
                    }
                }
            }
            return { source: 'none', partName: data.partName, choice: MISSING };
        }) };
}

/** Direct and selected table fill data carried separately from legacy paint. @public */
export interface TableGradientFillSnapshot {
    readonly direct: TableFillData;
    readonly resolved: TableFillResolvedData;
}
/**
 * @param {TableRenderSnapshot} snapshot - Existing physical-cell/merge snapshot.
 * @param {TableFillData} data - Canonical complete-part table.
 * @param {ReadonlyArray<TableStyleFillSnapshot>} styles - Related shared styles.
 * @param {TableStyleFillIndex} index - Optional reusable package index.
 * @returns {TableGradientFillSnapshot | undefined} Matching table sources or withheld ambiguous projection.
 * @internal
 */
export function bindTableFillData(snapshot: TableRenderSnapshot, data: TableFillData,
                                  styles: ReadonlyArray<TableStyleFillSnapshot> = [],
                                  index: TableStyleFillIndex = indexTableStyleFills(styles)): TableGradientFillSnapshot | undefined {
    if (snapshot.columnWidthsEmu.length !== data.columnCount || snapshot.rowHeightsEmu.length !== data.rowCount ||
        snapshot.cells.length !== data.cells.length) { return undefined; }
    for (let i: number = 0; i < data.cells.length; i++) {
        const canonical: TableCellFillSnapshot = arrayAt(data.cells, i);
        const projected: TableCellRenderSnapshot = arrayAt(snapshot.cells, i);
        if (canonical.row !== projected.row || canonical.column !== projected.column || canonical.columnSpan !== projected.columnSpan ||
            canonical.rowSpan !== projected.rowSpan || canonical.horizontalMerge !== projected.horizontalMerge ||
            canonical.verticalMerge !== projected.verticalMerge) { return undefined; }
    }
    return { direct: data, resolved: resolveTableFillData(data, styles, index) };
}

/** Duplicate-aware package index; an existing undefined entry is ambiguous. @internal */
export type TableStyleFillIndex = ReadonlyMap<string, TableStyleFillSnapshot | undefined>;
/**
 * @param {ReadonlyArray<TableStyleFillSnapshot>} styles - Complete related shared styles.
 * @returns {TableStyleFillIndex} One index per package, without last-definition-wins guessing.
 * @internal
 */
export function indexTableStyleFills(styles: ReadonlyArray<TableStyleFillSnapshot>): TableStyleFillIndex {
    const index: Map<string, TableStyleFillSnapshot | undefined> = new Map();
    styles.forEach((style: TableStyleFillSnapshot): void => {
        if (style.styleId !== undefined) { index.set(style.styleId, index.has(style.styleId) ? undefined : style); }
    });
    return index;
}
