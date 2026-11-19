/**
 * Serializers for the pivot parts the library authors, plus the geometry
 * calculation for `pivotTableDefinition/location`.
 *
 * - `pivotCacheDefinitionN.xml` — `CT_PivotCacheDefinition`
 * - `pivotCacheRecordsN.xml`   — `CT_PivotCacheRecords`
 * - `pivotTableN.xml`          — `CT_pivotTableDefinition`
 *
 * Element and attribute names come only from transitional `sml.xsd`; child
 * order follows the XSD sequences (`docs/specs/pivot-tables.md`).
 *
 * @private
 */

import { formatA1, formatA1Range } from '../address/cell-address';
import { OFFICE_DOCUMENT_RELATIONSHIPS_NS, SPREADSHEETML_NS_TRANSITIONAL } from '../core/package/constants';
import { PivotColumnSnapshot, PivotItem, PivotCacheSnapshot } from './pivot-snapshot';
import { PivotCacheImpl } from './pivot-cache';
import { PivotDataFieldImpl, PivotFieldImpl, PivotTableImpl } from './pivot-table';
import { PivotFieldSubtotal } from './pivot-types';

const XML_PROLOG: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

/**
 * Escape a string for an XML attribute value. Characters XML 1.0 cannot
 * carry become `_xHHHH_` (ST_Xstring), and a literal `_xHHHH_` is protected.
 *
 * @param {string} value - Raw text.
 * @returns {string} Attribute-safe text.
 * @private
 */
export function xmlAttr(value: string): string {
    let text: string = value.replace(/_(x[0-9A-Fa-f]{4}_)/g, '_x005F_$1');
    // eslint-disable-next-line no-control-regex -- XML 1.0 forbids these characters
    text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, (ch: string): string => {
        const hex: string = ch.charCodeAt(0).toString(16).toUpperCase();
        return `_x${'0000'.slice(hex.length)}${hex}_`;
    });
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\t/g, '&#9;')
        .replace(/\n/g, '&#10;')
        .replace(/\r/g, '&#13;');
}

function bool(value: boolean): string {
    return value ? '1' : '0';
}

function num(value: number): string {
    return String(value);
}

/**
 * Which cache columns must list their items under `sharedItems`: every field
 * used on an axis (items are referenced by index) and every field holding
 * text, logical, or error values.
 *
 * @param {PivotCacheSnapshot} snapshot - Cache data.
 * @param {ReadonlyArray<PivotTableImpl>} tables - Tables built over the cache.
 * @param {ReadonlyArray<boolean>} [forced] - Columns a file already lists, which must stay listed.
 * @returns {boolean[]} One flag per cache column.
 * @private
 */
export function enumeratedColumns(
    snapshot: PivotCacheSnapshot,
    tables: ReadonlyArray<PivotTableImpl>,
    forced?: ReadonlyArray<boolean>,
): boolean[] {
    const flags: boolean[] = snapshot.columns.map(
        (c: PivotColumnSnapshot, i: number): boolean => c.hasString || c.hasBoolean || c.hasError || (forced !== undefined && forced[i] === true),
    );
    for (const table of tables) {
        for (const f of table.allFields()) {
            if (f.axis !== 'none') {
                flags[f.index] = true;
            }
        }
    }
    return flags;
}

function itemElement(item: PivotItem): string {
    switch (item.kind) {
    case 'blank':
        return '<m/>';
    case 'number':
        return `<n v="${num(item.value)}"/>`;
    case 'string':
        return `<s v="${xmlAttr(item.value)}"/>`;
    case 'boolean':
        return `<b v="${bool(item.value)}"/>`;
    default:
        return `<e v="${xmlAttr(item.value)}"/>`;
    }
}

function sharedItemsXml(column: PivotColumnSnapshot, enumerated: boolean): string {
    const attrs: string[] = [];
    const kinds: number = (column.hasNumber ? 1 : 0) + (column.hasString ? 1 : 0) + (column.hasBoolean ? 1 : 0) + (column.hasError ? 1 : 0);
    const onlyBlank: boolean = kinds === 0 && column.hasBlank;
    if (onlyBlank) {
        attrs.push('containsNonDate="0"');
    }
    if (kinds === 0 || !column.hasString) {
        attrs.push('containsString="0"');
    }
    if (kinds > 0 && !column.hasString && !column.hasBlank && !column.hasError) {
        attrs.push('containsSemiMixedTypes="0"');
    }
    if (column.hasBlank) {
        attrs.push('containsBlank="1"');
    }
    if (kinds > 1) {
        attrs.push('containsMixedTypes="1"');
    }
    if (column.hasNumber) {
        attrs.push('containsNumber="1"');
        if (column.allIntegers) {
            attrs.push('containsInteger="1"');
        }
        if (column.minValue !== undefined && column.maxValue !== undefined) {
            attrs.push(`minValue="${num(column.minValue)}"`, `maxValue="${num(column.maxValue)}"`);
        }
    }
    // `containsSemiMixedTypes="0"` ordering is irrelevant in XML; keep a stable order.
    if (!enumerated) {
        return attrs.length > 0 ? `<sharedItems ${attrs.join(' ')}/>` : '<sharedItems/>';
    }
    attrs.push(`count="${column.items.length}"`);
    const body: string = column.items.map(itemElement).join('');
    return `<sharedItems ${attrs.join(' ')}>${body}</sharedItems>`;
}

/**
 * Serialize `pivotCacheDefinitionN.xml`.
 *
 * @param {PivotCacheImpl} cache - The cache.
 * @param {PivotCacheSnapshot} snapshot - Source data.
 * @param {ReadonlyArray<boolean>} enumerated - Per-column enumerate flags.
 * @param {string} recordsRelId - Relationship id of the records part.
 * @returns {string} Part XML.
 * @private
 */
export function serializePivotCacheDefinition(
    cache: PivotCacheImpl,
    snapshot: PivotCacheSnapshot,
    enumerated: ReadonlyArray<boolean>,
    recordsRelId: string,
): string {
    const fields: string = snapshot.columns
        .map((column: PivotColumnSnapshot, i: number): string =>
            `<cacheField name="${xmlAttr(column.name)}" numFmtId="0">${sharedItemsXml(column, enumerated[i])}</cacheField>`)
        .join('');
    const refresh: string = cache.refreshOnOpen ? ' refreshOnLoad="1"' : '';
    return `${XML_PROLOG}<pivotCacheDefinition xmlns="${SPREADSHEETML_NS_TRANSITIONAL}" xmlns:r="${OFFICE_DOCUMENT_RELATIONSHIPS_NS}" r:id="${xmlAttr(recordsRelId)}"${refresh} refreshedBy="ej2-xlsx" createdVersion="6" refreshedVersion="6" minRefreshableVersion="3" recordCount="${snapshot.recordCount}">`
        + `<cacheSource type="worksheet"><worksheetSource ref="${formatA1Range(cache.bounds)}" sheet="${xmlAttr(cache.sheet.name)}"/></cacheSource>`
        + `<cacheFields count="${snapshot.columns.length}">${fields}</cacheFields>`
        + '</pivotCacheDefinition>';
}

/**
 * Serialize `pivotCacheRecordsN.xml`.
 *
 * @param {PivotCacheSnapshot} snapshot - Source data.
 * @param {ReadonlyArray<boolean>} enumerated - Per-column enumerate flags.
 * @returns {string} Part XML.
 * @private
 */
export function serializePivotCacheRecords(snapshot: PivotCacheSnapshot, enumerated: ReadonlyArray<boolean>): string {
    const rows: string[] = [];
    for (let r: number = 0; r < snapshot.recordCount; r++) {
        let row: string = '<r>';
        for (let c: number = 0; c < snapshot.columns.length; c++) {
            const column: PivotColumnSnapshot = snapshot.columns[c];
            const index: number = column.recordItem[r];
            row += enumerated[c] ? `<x v="${index}"/>` : itemElement(column.items[index]);
        }
        rows.push(`${row}</r>`);
    }
    return `${XML_PROLOG}<pivotCacheRecords xmlns="${SPREADSHEETML_NS_TRANSITIONAL}" xmlns:r="${OFFICE_DOCUMENT_RELATIONSHIPS_NS}" count="${snapshot.recordCount}">${rows.join('')}</pivotCacheRecords>`;
}

/**
 * Computed placement of a pivot table body.
 *
 * @private
 */
export interface PivotGeometry {
    /** A1 range of the body (excludes report filters). */
    readonly ref: string;
    readonly firstHeaderRow: number;
    readonly firstDataRow: number;
    readonly firstDataCol: number;
    readonly pageCount: number;
    /** 1-based first row occupied by report filters (equals top row when none). */
    readonly pageTopRow: number;
    readonly topRow: number;
}

function distinctPrefixCount(
    snapshot: PivotCacheSnapshot,
    fields: ReadonlyArray<PivotFieldImpl>,
    length: number,
): number {
    if (length <= 0 || snapshot.recordCount === 0) {
        return snapshot.recordCount === 0 ? 0 : 1;
    }
    const seen: Set<string> = new Set<string>();
    for (let r: number = 0; r < snapshot.recordCount; r++) {
        let key: string = '';
        for (let i: number = 0; i < length; i++) {
            key += `${snapshot.columns[fields[i].index].recordItem[r]}|`;
        }
        seen.add(key);
    }
    return seen.size;
}

function hasSubtotals(field: PivotFieldImpl): boolean {
    return field.subtotals.length > 0;
}

/**
 * Compute the table body's location and header offsets for a layout.
 *
 * @param {PivotTableImpl} table - The pivot table.
 * @param {PivotCacheSnapshot} snapshot - Source data.
 * @returns {PivotGeometry} The geometry.
 * @private
 */
export function computeGeometry(table: PivotTableImpl, snapshot: PivotCacheSnapshot): PivotGeometry {
    const rows: ReadonlyArray<PivotFieldImpl> = table.axisList('row');
    const cols: ReadonlyArray<PivotFieldImpl> = table.axisList('column');
    const pages: ReadonlyArray<PivotFieldImpl> = table.axisList('filter');
    const k: number = table.dataFieldList().length;
    const m: number = cols.length;
    const n: number = rows.length;
    const top: number = table.row;
    const left: number = table.column;
    const pageTopRow: number = pages.length > 0 ? top - pages.length - 1 : top;

    if (n === 0 && m === 0 && k === 0) {
        // Excel's placeholder for an empty pivot table.
        return {
            ref: formatA1Range({ startRow: top, startCol: left, endRow: top + 17, endCol: left + 2 }),
            firstHeaderRow: 1,
            firstDataRow: 1,
            firstDataCol: 1,
            pageCount: pages.length,
            pageTopRow,
            topRow: top,
        };
    }

    const compactLike: boolean = table.layout !== 'tabular';
    // Row labels.
    let dataRows: number;
    if (n === 0) {
        dataRows = 1;
    } else {
        dataRows = 0;
        for (let level: number = 0; level < n - 1; level++) {
            const nodes: number = distinctPrefixCount(snapshot, rows, level + 1);
            const perNode: number = compactLike ? 1 : (hasSubtotals(rows[level]) ? 1 : 0);
            dataRows += perNode * nodes;
        }
        dataRows += distinctPrefixCount(snapshot, rows, n);
        if (table.options.columnGrand) {
            dataRows += 1;
        }
    }
    const rowLabelCols: number = n === 0 ? 0 : (table.layout === 'compact' ? 1 : n);

    // Value columns.
    let dataCols: number;
    if (m === 0) {
        dataCols = k;
    } else {
        let sets: number = distinctPrefixCount(snapshot, cols, m);
        for (let level: number = 0; level < m - 1; level++) {
            if (hasSubtotals(cols[level])) {
                sets += distinctPrefixCount(snapshot, cols, level + 1);
            }
        }
        if (table.options.rowGrand) {
            sets += 1;
        }
        dataCols = sets * Math.max(k, 1);
    }

    const headerRows: number = m > 0 ? m + 1 + (k > 1 ? 1 : 0) : 1;
    const width: number = Math.max(rowLabelCols + dataCols, 1);
    const height: number = headerRows + dataRows;
    return {
        ref: formatA1Range({ startRow: top, startCol: left, endRow: top + height - 1, endCol: left + width - 1 }),
        firstHeaderRow: m > 0 ? 1 : (k > 1 ? 0 : 1),
        firstDataRow: headerRows,
        firstDataCol: rowLabelCols,
        pageCount: pages.length,
        pageTopRow,
        topRow: top,
    };
}

const SUBTOTAL_ATTR: { readonly [subtotal: string]: string } = {
    sum: 'sumSubtotal',
    count: 'countASubtotal',
    average: 'avgSubtotal',
    max: 'maxSubtotal',
    min: 'minSubtotal',
    product: 'productSubtotal',
    countNumbers: 'countSubtotal',
    standardDeviation: 'stdDevSubtotal',
    populationStandardDeviation: 'stdDevPSubtotal',
    var: 'varSubtotal',
    populationVariance: 'varPSubtotal',
};

const SUBTOTAL_ITEM_TYPE: { readonly [subtotal: string]: string } = {
    automatic: 'default',
    sum: 'sum',
    count: 'countA',
    average: 'avg',
    max: 'max',
    min: 'min',
    product: 'product',
    countNumbers: 'count',
    standardDeviation: 'stdDev',
    populationStandardDeviation: 'stdDevP',
    variance: 'var',
    populationVariance: 'varP',
};

const AXIS_ATTR: { readonly [axis: string]: string } = {
    row: 'axisRow',
    column: 'axisCol',
    filter: 'axisPage',
};

/**
 * Resolves a number format code to a `numFmtId`.
 *
 * @private
 */
export type NumFmtResolver = (formatCode: string) => number;

function pivotFieldXml(
    field: PivotFieldImpl,
    column: PivotColumnSnapshot,
    table: PivotTableImpl,
    isData: boolean,
    resolveNumFmt: NumFmtResolver,
): string {
    const attrs: string[] = [];
    if (field.caption !== undefined) {
        attrs.push(`name="${xmlAttr(field.caption)}"`);
    }
    const onAxis: boolean = field.axis !== 'none';
    if (onAxis) {
        attrs.push(`axis="${AXIS_ATTR[field.axis]}"`);
    }
    if (isData) {
        attrs.push('dataField="1"');
    }
    if (table.layout !== 'compact') {
        attrs.push('compact="0"');
        if (table.layout === 'tabular') {
            attrs.push('outline="0"');
        }
    }
    if (field.numberFormat !== undefined) {
        attrs.push(`numFmtId="${resolveNumFmt(field.numberFormat)}"`);
    }
    attrs.push(`showAll="${bool(field.showItemsWithoutData)}"`);
    let sortScope: string = '';
    if (onAxis && field.sortOrder !== 'manual') {
        attrs.push(`sortType="${field.sortOrder}"`);
        sortScope = '<autoSortScope><pivotArea dataOnly="0" outline="0" fieldPosition="0"/></autoSortScope>';
    }
    let itemsXml: string = '';
    if (onAxis) {
        const subtotals: ReadonlyArray<PivotFieldSubtotal> = field.axis === 'filter' ? ['automatic'] : field.subtotals;
        if (field.axis !== 'filter') {
            if (subtotals.indexOf('automatic') < 0) {
                attrs.push('defaultSubtotal="0"');
            }
            for (const s of subtotals) {
                if (s !== 'automatic') {
                    attrs.push(`${SUBTOTAL_ATTR[s]}="1"`);
                }
            }
        }
        const order: number[] = column.sortedItemIndices.slice();
        if (field.sortOrder === 'descending') {
            order.reverse();
        }
        const items: string[] = order.map((index: number): string => `<item x="${index}"/>`);
        for (const s of subtotals) {
            items.push(`<item t="${SUBTOTAL_ITEM_TYPE[s]}"/>`);
        }
        itemsXml = `<items count="${items.length}">${items.join('')}</items>`;
    }
    const open: string = `<pivotField ${attrs.join(' ')}`;
    if (itemsXml.length === 0 && sortScope.length === 0) {
        return `${open}/>`;
    }
    return `${open}>${itemsXml}${sortScope}</pivotField>`;
}

/**
 * Serialize `pivotTableN.xml`.
 *
 * @param {PivotTableImpl} table - The table.
 * @param {PivotCacheSnapshot} snapshot - Source data.
 * @param {number} cacheId - Workbook-unique cache id.
 * @param {PivotGeometry} geometry - Body placement.
 * @param {NumFmtResolver} resolveNumFmt - Number format code → id.
 * @returns {string} Part XML.
 * @private
 */
export function serializePivotTable(
    table: PivotTableImpl,
    snapshot: PivotCacheSnapshot,
    cacheId: number,
    geometry: PivotGeometry,
    resolveNumFmt: NumFmtResolver,
): string {
    const o = table.options;
    const dataFields: ReadonlyArray<PivotDataFieldImpl> = table.dataFieldList();
    const rows: ReadonlyArray<PivotFieldImpl> = table.axisList('row');
    const cols: ReadonlyArray<PivotFieldImpl> = table.axisList('column');
    const pages: ReadonlyArray<PivotFieldImpl> = table.axisList('filter');

    const root: string[] = [
        `name="${xmlAttr(table.name)}"`,
        `cacheId="${cacheId}"`,
        'applyNumberFormats="0"',
        'applyBorderFormats="0"',
        'applyFontFormats="0"',
        'applyPatternFormats="0"',
        'applyAlignmentFormats="0"',
        'applyWidthHeightFormats="1"',
        `dataCaption="${xmlAttr(o.dataCaption)}"`,
    ];
    if (o.grandTotalCaption !== undefined) {
        root.push(`grandTotalCaption="${xmlAttr(o.grandTotalCaption)}"`);
    }
    if (o.errorCaption !== undefined) {
        root.push(`errorCaption="${xmlAttr(o.errorCaption)}"`, 'showError="1"');
    }
    if (o.emptyCellCaption !== undefined) {
        root.push(`missingCaption="${xmlAttr(o.emptyCellCaption)}"`);
    }
    root.push('updatedVersion="6"', 'minRefreshableVersion="3"');
    if (o.showDrillIndicators === false) {
        root.push('showDrill="0"');
    }
    if (o.preserveFormatting === false) {
        root.push('preserveFormatting="0"');
    }
    root.push(`useAutoFormatting="${bool(o.autoFormat)}"`);
    if (o.rowGrand === false) {
        root.push('rowGrandTotals="0"');
    }
    if (o.columnGrand === false) {
        root.push('colGrandTotals="0"');
    }
    if (o.mergeLabels) {
        root.push('mergeItem="1"');
    }
    root.push('itemPrintTitles="1"', 'createdVersion="6"', 'indent="0"');
    if (o.showFieldHeaders === false) {
        root.push('showHeaders="0"');
    }
    if (table.layout === 'compact') {
        root.push('outline="1"', 'outlineData="1"');
    } else if (table.layout === 'outline') {
        root.push('compact="0"', 'compactData="0"', 'outline="1"', 'outlineData="1"');
    } else {
        root.push('compact="0"', 'compactData="0"');
    }
    root.push('multipleFieldFilters="0"');
    if (o.rowHeaderCaption !== undefined) {
        root.push(`rowHeaderCaption="${xmlAttr(o.rowHeaderCaption)}"`);
    }
    if (o.columnHeaderCaption !== undefined) {
        root.push(`colHeaderCaption="${xmlAttr(o.columnHeaderCaption)}"`);
    }

    const locationAttrs: string[] = [
        `ref="${geometry.ref}"`,
        `firstHeaderRow="${geometry.firstHeaderRow}"`,
        `firstDataRow="${geometry.firstDataRow}"`,
        `firstDataCol="${geometry.firstDataCol}"`,
    ];
    if (geometry.pageCount > 0) {
        locationAttrs.push(`rowPageCount="${geometry.pageCount}"`, 'colPageCount="1"');
    }

    const dataFieldIndices: Set<number> = new Set<number>(dataFields.map((d: PivotDataFieldImpl): number => d.field.index));
    const pivotFields: string = table.allFields()
        .map((f: PivotFieldImpl): string => pivotFieldXml(f, snapshot.columns[f.index], table, dataFieldIndices.has(f.index), resolveNumFmt))
        .join('');

    let body: string = `<location ${locationAttrs.join(' ')}/>`;
    body += `<pivotFields count="${table.allFields().length}">${pivotFields}</pivotFields>`;
    if (rows.length > 0) {
        body += `<rowFields count="${rows.length}">${rows.map((f: PivotFieldImpl): string => `<field x="${f.index}"/>`).join('')}</rowFields>`;
    }
    const colEntries: string[] = cols.map((f: PivotFieldImpl): string => `<field x="${f.index}"/>`);
    if (dataFields.length > 1) {
        colEntries.push('<field x="-2"/>');
    }
    if (colEntries.length > 0) {
        body += `<colFields count="${colEntries.length}">${colEntries.join('')}</colFields>`;
    }
    if (pages.length > 0) {
        body += `<pageFields count="${pages.length}">${pages.map((f: PivotFieldImpl): string => `<pageField fld="${f.index}" hier="-1"/>`).join('')}</pageFields>`;
    }
    if (dataFields.length > 0) {
        const entries: string[] = dataFields.map((d: PivotDataFieldImpl): string => {
            const attrs: string[] = [`name="${xmlAttr(d.name)}"`, `fld="${d.field.index}"`];
            if (d.function !== 'sum') {
                attrs.push(`subtotal="${d.function}"`);
            }
            attrs.push('baseField="0"', 'baseItem="0"');
            if (d.numberFormat !== undefined) {
                attrs.push(`numFmtId="${resolveNumFmt(d.numberFormat)}"`);
            }
            return `<dataField ${attrs.join(' ')}/>`;
        });
        body += `<dataFields count="${entries.length}">${entries.join('')}</dataFields>`;
    }
    const styleName: string = table.pivotStyle === 'none' ? '' : ` name="${xmlAttr(table.pivotStyle)}"`;
    body += `<pivotTableStyleInfo${styleName} showRowHeaders="${bool(o.showRowHeaders)}" showColHeaders="${bool(o.showColumnHeaders)}" showRowStripes="${bool(o.showRowStripes)}" showColStripes="${bool(o.showColumnStripes)}" showLastColumn="${bool(o.showLastColumn)}"/>`;

    return `${XML_PROLOG}<pivotTableDefinition xmlns="${SPREADSHEETML_NS_TRANSITIONAL}" ${root.join(' ')}>${body}</pivotTableDefinition>`;
}

/**
 * Validate that report filters fit above the table.
 *
 * @param {PivotTableImpl} table - The table.
 * @returns {string | undefined} A message when the location is too close to the top.
 * @private
 */
export function pageFieldRoomProblem(table: PivotTableImpl): string | undefined {
    const pages: number = table.axisList('filter').length;
    if (pages > 0 && table.row < pages + 2) {
        return `Pivot table "${table.name}" has ${pages} report filter(s) and needs its location at row ${pages + 2} or lower (it is ${formatA1(table.row, table.column)})`;
    }
    return undefined;
}

/**
 * Add `<pivotCache>` entries to the workbook's preserved `pivotCaches`
 * element, creating it at the position `CT_Workbook` requires when absent.
 *
 * @param {ReadonlyArray<string>} preserved - Preserved top-level workbook children.
 * @param {ReadonlyArray<{cacheId: number, relId: string}>} entries - Authored caches.
 * @param {(local: string) => number} rankOf - Child order rank (`workbookChildOrderRank`).
 * @param {(snippet: string) => string} localName - Local element name reader.
 * @returns {string[]} The new preserved list.
 * @private
 */
export function mergePivotCachesXml(
    preserved: ReadonlyArray<string>,
    entries: ReadonlyArray<{ readonly cacheId: number; readonly relId: string }>,
    rankOf: (local: string) => number,
    localName: (snippet: string) => string,
): string[] {
    if (entries.length === 0) {
        return preserved.slice();
    }
    const added: string = entries
        .map((e): string => `<pivotCache cacheId="${e.cacheId}" r:id="${xmlAttr(e.relId)}"/>`)
        .join('');
    const out: string[] = [];
    let merged: boolean = false;
    for (const snippet of preserved) {
        if (!merged && localName(snippet) === 'pivotCaches') {
            const close: number = snippet.lastIndexOf('</');
            if (snippet.endsWith('/>') && close < 0) {
                out.push(`<pivotCaches>${added}</pivotCaches>`);
            } else if (close >= 0) {
                out.push(`${snippet.slice(0, close)}${added}${snippet.slice(close)}`);
            } else {
                out.push(snippet);
            }
            merged = true;
            continue;
        }
        out.push(snippet);
    }
    if (merged) {
        return out;
    }
    const fresh: string = `<pivotCaches>${added}</pivotCaches>`;
    const rank: number = rankOf('pivotCaches');
    const at: number = out.findIndex((snippet: string): boolean => rankOf(localName(snippet)) > rank);
    if (at < 0) {
        out.push(fresh);
    } else {
        out.splice(at, 0, fresh);
    }
    return out;
}
