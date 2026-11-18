/**
 * Adopts pivot caches and tables from an opened workbook so they can be read
 * and edited through the same model as authored ones.
 *
 * Only pivot tables the model describes completely are adopted: a worksheet
 * source with a plain `ref`, no grouped or calculated fields, no OLAP parts,
 * and a consistent field count. Everything else stays an opaque package part
 * exactly as before. Reading never evaluates, refreshes, or resolves
 * anything; sizes are bounded by the tree reader.
 *
 * Citations: ECMA-376-1 §18.10 (`pivotCacheDefinition`, `pivotTableDefinition`);
 * transitional `sml.xsd` `CT_PivotCacheDefinition`, `CT_CacheField`,
 * `CT_pivotTableDefinition`, `CT_PivotField`, `CT_DataField`;
 * `docs/ooxml-mapping/pivot-tables.md`.
 *
 * @private
 */

import { CellRange, parseA1, parseA1Range } from '../address/cell-address';
import { PIVOT_CACHE_DEFINITION_REL_TYPE, PIVOT_CACHE_RECORDS_REL_TYPE, PIVOT_TABLE_REL_TYPE } from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8 } from '../core/xml/minimal-xml';
import { WorkbookStyles } from '../styles/workbook-styles';
import { WorksheetImpl } from '../workbook/worksheet';
import { PivotCacheImpl, PivotCachesImpl } from './pivot-cache';
import { PivotItem, itemKey } from './pivot-snapshot';
import {
    LoadedDataField,
    LoadedField,
    LoadedTable,
    PivotDataFieldImpl,
    PivotFieldImpl,
    PivotTableImpl,
    PivotTablesImpl,
    isBuiltInPivotStyle,
    isPivotFunction,
} from './pivot-table';
import { PivotAxis, PivotBuiltInStyle, PivotFieldSubtotal, PivotLayout, PivotSortOrder, PivotTableOptions } from './pivot-types';
import { PivotXmlNode, childOf, decodeXstring, parsePivotXml } from './pivot-xml-tree';

/** Attribute → subtotal function, the inverse of the writer's table. */
const SUBTOTAL_BY_ATTR: ReadonlyArray<[string, PivotFieldSubtotal]> = [
    ['sumSubtotal', 'sum'],
    ['countASubtotal', 'count'],
    ['avgSubtotal', 'average'],
    ['maxSubtotal', 'max'],
    ['minSubtotal', 'min'],
    ['productSubtotal', 'product'],
    ['countSubtotal', 'countNumbers'],
    ['stdDevSubtotal', 'standardDeviation'],
    ['stdDevPSubtotal', 'populationStandardDeviation'],
    ['varSubtotal', 'variance'],
    ['varPSubtotal', 'populationVariance'],
];

const AXIS_BY_ATTR: { readonly [axis: string]: PivotAxis } = {
    axisRow: 'row',
    axisCol: 'column',
    axisPage: 'filter',
};

/** Root attributes of a cache definition that the writer regenerates or that carry no meaning to lose. */
const CACHE_ROOT_ATTRS: ReadonlyArray<string> = [
    'id', 'r:id', 'refreshOnLoad', 'refreshedBy', 'refreshedDate', 'refreshedDateIso', 'createdVersion', 'refreshedVersion',
    'minRefreshableVersion', 'recordCount', 'xmlns', 'xmlns:r',
];

/** Children of a supported cache definition. */
const CACHE_CHILDREN: ReadonlyArray<string> = ['cacheSource', 'cacheFields', 'extLst'];

/**
 * Host surface the loader needs from the workbook.
 *
 * @private
 */
export interface PivotLoaderHost {
    readonly package: OpcPackage;
    readonly workbookPartName: string;
    readonly caches: PivotCachesImpl;
    readonly styles: WorkbookStyles;
    readonly worksheets: ReadonlyArray<WorksheetImpl>;
    /** Top-level `workbook.xml` children that were preserved verbatim. */
    readonly preserved: ReadonlyArray<string>;
    /** Called for every table adopted, with its worksheet part. */
    registerTable(table: PivotTableImpl, sheetPart: string): void;
}

function flag(node: PivotXmlNode, name: string, fallback: boolean): boolean {
    const raw: string | undefined = node.attrs.get(name);
    if (raw === undefined) {
        return fallback;
    }
    return raw === '1' || raw === 'true';
}

function whole(node: PivotXmlNode, name: string): number | undefined {
    const raw: string | undefined = node.attrs.get(name);
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}

function readText(pkg: OpcPackage, name: string): string | undefined {
    const part = pkg.getPart(name);
    return part === undefined ? undefined : decodeUtf8(part.data);
}

function readPart(pkg: OpcPackage, name: string): PivotXmlNode | undefined {
    const text: string | undefined = readText(pkg, name);
    return text === undefined ? undefined : parsePivotXml(text);
}

function sharedItem(node: PivotXmlNode): PivotItem | undefined {
    const raw: string | undefined = node.attrs.get('v');
    switch (node.name) {
    case 'm':
        return { kind: 'blank' };
    case 'n': {
        const value: number = Number(raw);
        return raw !== undefined && raw.length > 0 && Number.isFinite(value) ? { kind: 'number', value } : undefined;
    }
    case 's':
        return raw === undefined ? undefined : { kind: 'string', value: decodeXstring(raw) };
    case 'b':
        return raw === undefined ? undefined : { kind: 'boolean', value: raw === '1' || raw === 'true' };
    case 'e':
        return raw === undefined ? undefined : { kind: 'error', value: decodeXstring(raw) };
    default:
        return undefined;
    }
}

function cacheIdToRelId(preserved: ReadonlyArray<string>): Map<number, string> {
    const map: Map<number, string> = new Map<number, string>();
    for (const snippet of preserved) {
        if (!/^<(?:[A-Za-z_][\w.-]*:)?pivotCaches[\s>/]/.test(snippet.trim())) {
            continue;
        }
        const root: PivotXmlNode | undefined = parsePivotXml(snippet);
        if (root === undefined) {
            continue;
        }
        for (const entry of root.children) {
            if (entry.name !== 'pivotCache') {
                continue;
            }
            const id: number | undefined = whole(entry, 'cacheId');
            let relId: string | undefined;
            entry.attrs.forEach((value: string, key: string): void => {
                if (key === 'id' || key.endsWith(':id')) {
                    relId = value;
                }
            });
            if (id !== undefined && relId !== undefined) {
                map.set(id, relId);
            }
        }
    }
    return map;
}

function findSheet(sheets: ReadonlyArray<WorksheetImpl>, name: string): WorksheetImpl | undefined {
    const exact: WorksheetImpl | undefined = sheets.find((s: WorksheetImpl): boolean => s.name === name);
    if (exact !== undefined) {
        return exact;
    }
    const lower: string = name.toLowerCase();
    return sheets.find((s: WorksheetImpl): boolean => s.name.toLowerCase() === lower);
}

function adoptCache(host: PivotLoaderHost, cacheId: number, relId: string): PivotCacheImpl | undefined {
    const pkg: OpcPackage = host.package;
    const rel: OpcRelationship | undefined = pkg.getRelationships(host.workbookPartName).find(
        (r: OpcRelationship): boolean => r.id === relId && r.type === PIVOT_CACHE_DEFINITION_REL_TYPE && r.targetMode !== 'External',
    );
    if (rel === undefined) {
        return undefined;
    }
    const root: PivotXmlNode | undefined = readPart(pkg, rel.resolvedTarget);
    if (root === undefined || root.name !== 'pivotCacheDefinition') {
        return undefined;
    }
    if (root.children.some((c: PivotXmlNode): boolean => CACHE_CHILDREN.indexOf(c.name) < 0)) {
        return undefined;
    }
    for (const key of Array.from(root.attrs.keys())) {
        // Namespace declarations and namespaced attributes (mc:Ignorable, xr:uid,
        // xmlns:x) carry revision/compatibility metadata the editor copies through.
        if (CACHE_ROOT_ATTRS.indexOf(key) < 0 && key.indexOf(':') < 0) {
            return undefined;
        }
    }
    const source: PivotXmlNode | undefined = childOf(root, 'cacheSource');
    const worksheetSource: PivotXmlNode | undefined = source === undefined ? undefined : childOf(source, 'worksheetSource');
    if (source === undefined || worksheetSource === undefined || source.attrs.get('type') !== 'worksheet') {
        return undefined;
    }
    const ref: string | undefined = worksheetSource.attrs.get('ref');
    const sheetName: string | undefined = worksheetSource.attrs.get('sheet');
    if (ref === undefined || sheetName === undefined || worksheetSource.attrs.has('name')) {
        return undefined;
    }
    const sheet: WorksheetImpl | undefined = findSheet(host.worksheets, decodeXstring(sheetName));
    const fieldsNode: PivotXmlNode | undefined = childOf(root, 'cacheFields');
    if (sheet === undefined || fieldsNode === undefined) {
        return undefined;
    }
    let bounds: CellRange;
    try {
        bounds = parseA1Range(ref);
    } catch (error) {
        return undefined;
    }
    const names: string[] = [];
    const items: Array<ReadonlyArray<PivotItem> | undefined> = [];
    for (const field of fieldsNode.children) {
        // A cache is only adopted when it can be regenerated without losing anything.
        if (field.name !== 'cacheField') {
            return undefined;
        }
        for (const key of Array.from(field.attrs.keys())) {
            if (key === 'name' || key === 'caption') {
                continue;
            }
            // Defaults Excel writes on every field carry nothing to lose.
            if ((key === 'numFmtId' && field.attrs.get(key) === '0')
                || (key === 'sqlType' && field.attrs.get(key) === '0')
                || (key === 'hierarchy' && field.attrs.get(key) === '0')
                || (key === 'level' && field.attrs.get(key) === '0')) {
                continue;
            }
            if (key === 'databaseField' || key === 'uniqueList' || key === 'serverField' || key === 'memberPropertyField') {
                continue;
            }
            return undefined;
        }
        if (field.children.some((c: PivotXmlNode): boolean => c.name !== 'sharedItems')) {
            return undefined;
        }
        const sharedNode: PivotXmlNode | undefined = childOf(field, 'sharedItems');
        if (sharedNode !== undefined && (sharedNode.attrs.get('containsDate') === '1' || sharedNode.attrs.has('longText'))) {
            return undefined;
        }
        const name: string | undefined = field.attrs.get('name');
        if (name === undefined) {
            return undefined;
        }
        names.push(decodeXstring(name));
        const shared: PivotXmlNode | undefined = childOf(field, 'sharedItems');
        if (shared === undefined || shared.children.length === 0) {
            items.push(undefined);
            continue;
        }
        const list: PivotItem[] = [];
        const keys: Set<string> = new Set<string>();
        for (const child of shared.children) {
            const item: PivotItem | undefined = sharedItem(child);
            // Duplicate items would renumber when the cache is regenerated.
            if (item === undefined || keys.has(itemKey(item))) {
                return undefined;
            }
            keys.add(itemKey(item));
            list.push(item);
        }
        items.push(list);
    }
    if (names.length === 0 || bounds.endRow - bounds.startRow < 1 || bounds.endCol - bounds.startCol + 1 !== names.length) {
        return undefined;
    }
    const definitionRels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(rel.resolvedTarget);
    const recordsRel: OpcRelationship | undefined = definitionRels.find(
        (r: OpcRelationship): boolean => r.type === PIVOT_CACHE_RECORDS_REL_TYPE && r.targetMode !== 'External',
    );
    if (recordsRel === undefined) {
        return undefined;
    }
    const cache: PivotCacheImpl = new PivotCacheImpl(host.caches, sheet, bounds, names, {
        refreshOnOpen: flag(root, 'refreshOnLoad', false),
        cacheId,
        definitionPartName: rel.resolvedTarget,
        recordsPartName: recordsRel.resolvedTarget,
        workbookRelId: relId,
        sheetName,
        sharedItems: items,
    });
    host.caches.register(cache);
    return cache;
}

function readOptions(root: PivotXmlNode, style: PivotXmlNode | undefined): PivotTableOptions {
    const errorShown: boolean = flag(root, 'showError', false);
    const missingShown: boolean = flag(root, 'showMissing', true);
    const text = (name: string): string | undefined => {
        const raw: string | undefined = root.attrs.get(name);
        return raw === undefined ? undefined : decodeXstring(raw);
    };
    const styleFlag = (name: string): boolean => (style === undefined ? false : flag(style, name, false));
    return {
        rowGrand: flag(root, 'rowGrandTotals', true),
        columnGrand: flag(root, 'colGrandTotals', true),
        showDrillIndicators: flag(root, 'showDrill', true),
        showFieldHeaders: flag(root, 'showHeaders', true),
        mergeLabels: flag(root, 'mergeItem', false),
        autoFormat: flag(root, 'useAutoFormatting', false),
        preserveFormatting: flag(root, 'preserveFormatting', true),
        rowHeaderCaption: text('rowHeaderCaption'),
        columnHeaderCaption: text('colHeaderCaption'),
        grandTotalCaption: text('grandTotalCaption'),
        dataCaption: text('dataCaption') === undefined ? 'Values' : String(text('dataCaption')),
        errorCaption: errorShown ? text('errorCaption') : undefined,
        emptyCellCaption: missingShown ? text('missingCaption') : undefined,
        showRowHeaders: styleFlag('showRowHeaders'),
        showColumnHeaders: styleFlag('showColHeaders'),
        showRowStripes: styleFlag('showRowStripes'),
        showColumnStripes: styleFlag('showColStripes'),
        showLastColumn: styleFlag('showLastColumn'),
    };
}

function readLayout(root: PivotXmlNode): PivotLayout {
    if (flag(root, 'compact', true)) {
        return 'compact';
    }
    return flag(root, 'outline', false) ? 'outline' : 'tabular';
}

function readSubtotals(node: PivotXmlNode): PivotFieldSubtotal[] {
    const out: PivotFieldSubtotal[] = [];
    if (flag(node, 'defaultSubtotal', true)) {
        out.push('automatic');
    }
    for (const [attr, fn] of SUBTOTAL_BY_ATTR) {
        if (flag(node, attr, false)) {
            out.push(fn);
        }
    }
    return out;
}

function numberFormatOf(styles: WorkbookStyles, node: PivotXmlNode): string | undefined {
    const id: number | undefined = whole(node, 'numFmtId');
    if (id === undefined || id === 0) {
        return undefined;
    }
    return styles.getFormatCode(id);
}

function axisFieldList(
    fields: ReadonlyArray<PivotFieldImpl>,
    list: PivotXmlNode | undefined,
    seen: Set<number>,
): { readonly fields: PivotFieldImpl[]; readonly valuesAt: number } | undefined {
    const out: PivotFieldImpl[] = [];
    let valuesAt: number = -1;
    if (list === undefined) {
        return { fields: out, valuesAt };
    }
    for (const entry of list.children) {
        const x: number | undefined = whole(entry, 'x');
        if (entry.name !== 'field' || x === undefined) {
            return undefined;
        }
        if (x === -2) {
            valuesAt = out.length;
            continue;
        }
        if (x < 0 || x >= fields.length || seen.has(x)) {
            return undefined;
        }
        seen.add(x);
        out.push(fields[x]);
    }
    return { fields: out, valuesAt };
}

function adoptTable(
    host: PivotLoaderHost,
    collection: PivotTablesImpl,
    cache: PivotCacheImpl,
    root: PivotXmlNode,
    originalXml: string,
    partName: string,
    sheetRelId: string,
): PivotTableImpl | undefined {
    const location: PivotXmlNode | undefined = childOf(root, 'location');
    const pivotFields: PivotXmlNode | undefined = childOf(root, 'pivotFields');
    const nameAttr: string | undefined = root.attrs.get('name');
    const ref: string | undefined = location === undefined ? undefined : location.attrs.get('ref');
    if (location === undefined || pivotFields === undefined || nameAttr === undefined || ref === undefined) {
        return undefined;
    }
    if (pivotFields.children.length !== cache.fieldNames.length || childOf(root, 'pivotHierarchies') !== undefined) {
        return undefined;
    }
    let top: { readonly row: number; readonly col: number };
    try {
        const range: CellRange = ref.indexOf(':') >= 0 ? parseA1Range(ref) : { startRow: parseA1(ref).row, startCol: parseA1(ref).col, endRow: 0, endCol: 0 };
        top = { row: range.startRow, col: range.startCol };
    } catch (error) {
        return undefined;
    }
    const style: PivotXmlNode | undefined = childOf(root, 'pivotTableStyleInfo');
    const styleName: string | undefined = style === undefined ? undefined : style.attrs.get('name');
    let builtIn: PivotBuiltInStyle = 'none';
    if (styleName !== undefined) {
        if (!isBuiltInPivotStyle(styleName)) {
            return undefined;
        }
        builtIn = styleName;
    }

    const table: PivotTableImpl = new PivotTableImpl(collection, cache, decodeXstring(nameAttr), top.row, top.col);
    const fields: ReadonlyArray<PivotFieldImpl> = table.allFields();

    const seen: Set<number> = new Set<number>();
    const rows = axisFieldList(fields, childOf(root, 'rowFields'), seen);
    const cols = axisFieldList(fields, childOf(root, 'colFields'), seen);
    if (rows === undefined || cols === undefined) {
        return undefined;
    }
    const pages: PivotFieldImpl[] = [];
    const pageNode: PivotXmlNode | undefined = childOf(root, 'pageFields');
    if (pageNode !== undefined) {
        for (const entry of pageNode.children) {
            const fld: number | undefined = whole(entry, 'fld');
            if (entry.name !== 'pageField' || fld === undefined || fld < 0 || fld >= fields.length || seen.has(fld)) {
                return undefined;
            }
            seen.add(fld);
            pages.push(fields[fld]);
        }
    }

    const axisOf: Map<PivotFieldImpl, PivotAxis> = new Map<PivotFieldImpl, PivotAxis>();
    rows.fields.forEach((f: PivotFieldImpl): void => { axisOf.set(f, 'row'); });
    cols.fields.forEach((f: PivotFieldImpl): void => { axisOf.set(f, 'column'); });
    pages.forEach((f: PivotFieldImpl): void => { axisOf.set(f, 'filter'); });

    const dataNode: PivotXmlNode | undefined = childOf(root, 'dataFields');
    const dataSpecs: Array<{ readonly node: PivotXmlNode; readonly field: PivotFieldImpl }> = [];
    if (dataNode !== undefined) {
        for (const entry of dataNode.children) {
            const fld: number | undefined = whole(entry, 'fld');
            if (entry.name !== 'dataField' || fld === undefined || fld < 0 || fld >= fields.length) {
                return undefined;
            }
            const fn: string = entry.attrs.get('subtotal') === undefined ? 'sum' : String(entry.attrs.get('subtotal'));
            if (!isPivotFunction(fn)) {
                return undefined;
            }
            dataSpecs.push({ node: entry, field: fields[fld] });
        }
    }
    const dataFieldIndices: Set<number> = new Set<number>(dataSpecs.map((d): number => d.field.index));

    for (let i: number = 0; i < fields.length; i++) {
        const node: PivotXmlNode = pivotFields.children[i];
        if (node.name !== 'pivotField') {
            return undefined;
        }
        const axisAttr: string | undefined = node.attrs.get('axis');
        const declared: PivotAxis = axisAttr === undefined ? 'none' : (AXIS_BY_ATTR[axisAttr] === undefined ? 'none' : AXIS_BY_ATTR[axisAttr]);
        const actual: PivotAxis | undefined = axisOf.get(fields[i]);
        // The field lists and the per-field axis attribute must agree.
        if ((actual === undefined ? 'none' : actual) !== declared) {
            return undefined;
        }
        const sortAttr: string | undefined = node.attrs.get('sortType');
        const sortOrder: PivotSortOrder = sortAttr === 'ascending' || sortAttr === 'descending' ? sortAttr : 'manual';
        const caption: string | undefined = node.attrs.get('name') === undefined ? undefined : decodeXstring(String(node.attrs.get('name')));
        const loaded: LoadedField = {
            axis: declared,
            caption,
            subtotals: readSubtotals(node),
            sortOrder,
            showItemsWithoutData: flag(node, 'showAll', true),
            numberFormat: numberFormatOf(host.styles, node),
            isData: flag(node, 'dataField', false) || dataFieldIndices.has(i),
        };
        fields[i].initialize(loaded);
    }

    const data: PivotDataFieldImpl[] = dataSpecs.map((spec, index): PivotDataFieldImpl => {
        const fn: string = spec.node.attrs.get('subtotal') === undefined ? 'sum' : String(spec.node.attrs.get('subtotal'));
        const fnName = fn as 'sum';
        const label: string = spec.node.attrs.get('name') === undefined
            ? `${fnName} of ${spec.field.displayName}`
            : decodeXstring(String(spec.node.attrs.get('name')));
        const numberFormat: string | undefined = numberFormatOf(host.styles, spec.node);
        const created: PivotDataFieldImpl = new PivotDataFieldImpl(table, spec.field, label, fnName, numberFormat);
        const loaded: LoadedDataField = { index, name: label, function: fnName, numberFormat };
        created.loaded = loaded;
        return created;
    });

    const dataOnRows: boolean = flag(root, 'dataOnRows', false);
    let valuesAxis: 'row' | 'column' | undefined;
    let valuesPosition: number = 0;
    if (rows.valuesAt >= 0 && (dataOnRows || cols.valuesAt < 0)) {
        valuesAxis = 'row';
        valuesPosition = rows.valuesAt;
    } else if (cols.valuesAt >= 0) {
        valuesAxis = 'column';
        valuesPosition = cols.valuesAt;
    }
    const loadedTable: LoadedTable = { originalXml, layout: readLayout(root), valuesAxis, valuesPosition };
    table.initialize(loadedTable, builtIn, rows.fields, cols.fields, pages, data, readOptions(root, style), partName, sheetRelId);
    return table;
}

/**
 * Adopt every pivot cache and pivot table the model can describe.
 *
 * @param {PivotLoaderHost} host - Workbook surface.
 * @private
 */
export function loadPivots(host: PivotLoaderHost): void {
    const relByCacheId: Map<number, string> = cacheIdToRelId(host.preserved);
    if (relByCacheId.size === 0) {
        return;
    }
    const caches: Map<number, PivotCacheImpl> = new Map<number, PivotCacheImpl>();
    relByCacheId.forEach((relId: string, cacheId: number): void => {
        const cache: PivotCacheImpl | undefined = adoptCache(host, cacheId, relId);
        if (cache !== undefined) {
            caches.set(cacheId, cache);
        }
    });
    if (caches.size === 0) {
        return;
    }
    let unreadable: boolean = false;
    for (const sheet of host.worksheets) {
        const sheetPart: string | undefined = sheet.partName;
        if (sheetPart === undefined || sheet.kind !== 'worksheet') {
            continue;
        }
        const rels: ReadonlyArray<OpcRelationship> = host.package.getRelationships(sheetPart).filter(
            (r: OpcRelationship): boolean => r.type === PIVOT_TABLE_REL_TYPE && r.targetMode !== 'External',
        );
        for (const rel of rels) {
            const text: string | undefined = readText(host.package, rel.resolvedTarget);
            const root: PivotXmlNode | undefined = text === undefined ? undefined : parsePivotXml(text);
            const id: number | undefined = root === undefined ? undefined : whole(root, 'cacheId');
            const cache: PivotCacheImpl | undefined = id === undefined ? undefined : caches.get(id);
            let table: PivotTableImpl | undefined;
            if (root !== undefined && text !== undefined && root.name === 'pivotTableDefinition' && cache !== undefined) {
                table = adoptTable(host, sheet.pivotTablesImpl(), cache, root, text, rel.resolvedTarget, rel.id);
            }
            if (table !== undefined && cache !== undefined) {
                sheet.pivotTablesImpl().adopt(table);
                host.registerTable(table, sheetPart);
                cache.adoptedTables += 1;
            } else if (cache !== undefined) {
                cache.pinned = true;
            } else if (id === undefined) {
                unreadable = true;
            }
        }
    }
    if (unreadable) {
        caches.forEach((cache: PivotCacheImpl): void => { cache.pinned = true; });
    }
}
