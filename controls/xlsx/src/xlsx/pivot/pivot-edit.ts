/**
 * Rewrites a pivot table (and, when needed, its cache definition) that was
 * read from a file, changing only what the caller edited.
 *
 * The original part text is re-read and every element the model does not
 * describe (`formats`, `conditionalFormats`, `chartFormats`, `filters`,
 * hierarchies, `extLst`, Markup Compatibility content, unknown attributes) is
 * copied through verbatim. Elements the model describes are regenerated only
 * when their model state differs from what was loaded. `rowItems` /
 * `colItems` and the cached report body are dropped when the layout changed,
 * and the cache is set to refresh on load so Excel rebuilds the body.
 *
 * Citations: ECMA-376-1 §18.10.1.73 `pivotTableDefinition` and the child
 * order of transitional `sml.xsd` `CT_pivotTableDefinition`;
 * `docs/ooxml-mapping/pivot-tables.md`.
 *
 * @private
 */

import { formatA1Range } from '../address/cell-address';
import { PivotGeometry, xmlAttr } from './pivot-xml';
import { PivotCacheImpl } from './pivot-cache';
import { PivotCacheSnapshot } from './pivot-snapshot';
import { PivotDataFieldImpl, PivotFieldImpl, PivotTableImpl } from './pivot-table';
import { PivotAxis, PivotFieldSubtotal } from './pivot-types';
import { PivotXmlNode, childOf, encodeXstring, parsePivotXml, serializeAttrs } from './pivot-xml-tree';

/** Resolves a number format code to a `numFmtId`. */
export type NumFmtLookup = (formatCode: string) => number;

/** Child order of `CT_pivotTableDefinition`. */
const TABLE_ORDER: ReadonlyArray<string> = [
    'location', 'pivotFields', 'rowFields', 'rowItems', 'colFields', 'colItems', 'pageFields', 'dataFields',
    'formats', 'conditionalFormats', 'chartFormats', 'pivotHierarchies', 'pivotTableStyleInfo', 'filters',
    'rowHierarchiesUsage', 'colHierarchiesUsage', 'extLst',
];

/** Children that describe the shape of the report and go stale when it changes. */
const SHAPE_DEPENDENT: ReadonlyArray<string> = ['formats', 'conditionalFormats', 'chartFormats', 'filters', 'rowHierarchiesUsage', 'colHierarchiesUsage'];

const SUBTOTAL_ATTR: ReadonlyArray<[PivotFieldSubtotal, string]> = [
    ['sum', 'sumSubtotal'],
    ['count', 'countASubtotal'],
    ['average', 'avgSubtotal'],
    ['max', 'maxSubtotal'],
    ['min', 'minSubtotal'],
    ['product', 'productSubtotal'],
    ['countNumbers', 'countSubtotal'],
    ['standardDeviation', 'stdDevSubtotal'],
    ['populationStandardDeviation', 'stdDevPSubtotal'],
    ['variance', 'varSubtotal'],
    ['populationVariance', 'varPSubtotal'],
];

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

const AXIS_ATTR: { readonly [axis: string]: string } = { row: 'axisRow', column: 'axisCol', filter: 'axisPage' };

function flagText(value: boolean): string {
    return value ? '1' : '0';
}

function setAttr(attrs: Map<string, string>, name: string, value: string | undefined): void {
    if (value === undefined) {
        attrs.delete(name);
    } else {
        attrs.set(name, value);
    }
}

function prefixOf(qname: string): string {
    const at: number = qname.indexOf(':');
    return at < 0 ? '' : qname.slice(0, at + 1);
}

function sameList(a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean {
    return a.length === b.length && a.every((v: string, i: number): boolean => v === b[i]);
}

function layoutAttrs(layout: string): { readonly [name: string]: string | undefined } {
    if (layout === 'compact') {
        return { compact: undefined, outline: undefined };
    }
    return layout === 'outline' ? { compact: '0', outline: undefined } : { compact: '0', outline: '0' };
}

/**
 * Whether a loaded field differs from its model state.
 *
 * @param {PivotFieldImpl} field - The field.
 * @param {boolean} isData - Whether the field is aggregated.
 * @param {boolean} layoutChanged - Whether the table layout changed.
 * @returns {boolean} True when the field element must be patched.
 */
function fieldChanged(field: PivotFieldImpl, isData: boolean, layoutChanged: boolean): boolean {
    const was = field.loaded;
    if (was === undefined || layoutChanged) {
        return true;
    }
    return was.axis !== field.axis
        || was.caption !== field.caption
        || was.sortOrder !== field.sortOrder
        || was.showItemsWithoutData !== field.showItemsWithoutData
        || was.numberFormat !== field.numberFormat
        || was.isData !== isData
        || !sameList(was.subtotals, field.subtotals);
}

function itemXml(prefix: string, attrs: string): string {
    return `<${prefix}item ${attrs}/>`;
}

function patchField(
    field: PivotFieldImpl,
    node: PivotXmlNode,
    text: string,
    snapshot: PivotCacheSnapshot,
    table: PivotTableImpl,
    isData: boolean,
    layoutChanged: boolean,
    resolveNumFmt: NumFmtLookup,
): string {
    const prefix: string = prefixOf(node.qname);
    const attrs: Map<string, string> = new Map<string, string>(node.attrs);
    const axis: PivotAxis = field.axis;
    const onAxis: boolean = axis !== 'none';

    const was = field.loaded;
    if (was === undefined || was.caption !== field.caption) {
        setAttr(attrs, 'name', field.caption === undefined ? undefined : encodeXstring(field.caption));
    }
    setAttr(attrs, 'axis', onAxis ? AXIS_ATTR[axis] : undefined);
    if (was === undefined || was.isData !== isData) {
        setAttr(attrs, 'dataField', isData ? '1' : undefined);
    }
    if (was === undefined || was.numberFormat !== field.numberFormat) {
        setAttr(attrs, 'numFmtId', field.numberFormat === undefined ? undefined : String(resolveNumFmt(field.numberFormat)));
    }
    if (was === undefined || was.showItemsWithoutData !== field.showItemsWithoutData) {
        attrs.set('showAll', flagText(field.showItemsWithoutData));
    }
    if (layoutChanged) {
        const layout = layoutAttrs(table.layout);
        setAttr(attrs, 'compact', layout.compact);
        setAttr(attrs, 'outline', layout.outline);
    }
    const sorted: boolean = onAxis && field.sortOrder !== 'manual';
    if (was === undefined || was.sortOrder !== field.sortOrder || was.axis !== axis) {
        setAttr(attrs, 'sortType', sorted ? field.sortOrder : undefined);
    }

    const subtotals: ReadonlyArray<PivotFieldSubtotal> = axis === 'filter' ? ['automatic'] : field.subtotals;
    if (axis !== 'filter' && (was === undefined || !sameList(was.subtotals, field.subtotals))) {
        setAttr(attrs, 'defaultSubtotal', subtotals.indexOf('automatic') < 0 ? '0' : undefined);
        for (const [fn, attr] of SUBTOTAL_ATTR) {
            setAttr(attrs, attr, subtotals.indexOf(fn) >= 0 ? '1' : undefined);
        }
    }

    const itemsNode: PivotXmlNode | undefined = node.children.find((c: PivotXmlNode): boolean => c.name === 'items');
    const sortNode: PivotXmlNode | undefined = node.children.find((c: PivotXmlNode): boolean => c.name === 'autoSortScope');
    const others: string = node.children
        .filter((c: PivotXmlNode): boolean => c.name !== 'items' && c.name !== 'autoSortScope')
        .map((c: PivotXmlNode): string => text.slice(c.start, c.end))
        .join('');

    let itemsXml: string = '';
    if (onAxis) {
        const column = snapshot.columns[field.index];
        const original: Map<number, string> = new Map<number, string>();
        const originalOrder: number[] = [];
        const keptSubtotals: string[] = [];
        if (itemsNode !== undefined) {
            for (const child of itemsNode.children) {
                const type: string | undefined = child.attrs.get('t');
                const slice: string = text.slice(child.start, child.end);
                if (type === undefined || type === 'data') {
                    const x: number = Number(child.attrs.get('x'));
                    if (Number.isInteger(x) && x >= 0 && x < column.items.length && !original.has(x)) {
                        original.set(x, slice);
                        originalOrder.push(x);
                    }
                } else {
                    keptSubtotals.push(slice);
                }
            }
        }
        const sortedAll: number[] = column.sortedItemIndices.slice();
        if (field.sortOrder === 'descending') {
            sortedAll.reverse();
        }
        let order: number[];
        if (field.sortOrder === 'manual') {
            order = originalOrder.slice();
            for (const x of column.sortedItemIndices) {
                if (!original.has(x)) {
                    order.push(x);
                }
            }
        } else {
            order = sortedAll;
        }
        const entries: string[] = order.map((x: number): string => {
            const slice: string | undefined = original.get(x);
            return slice !== undefined ? slice : itemXml(prefix, `x="${x}"`);
        });
        const subtotalsUnchanged: boolean = was !== undefined && was.axis !== 'filter' && axis !== 'filter' && sameList(was.subtotals, field.subtotals);
        if (subtotalsUnchanged && keptSubtotals.length > 0) {
            entries.push(...keptSubtotals);
        } else {
            for (const s of subtotals) {
                entries.push(itemXml(prefix, `t="${SUBTOTAL_ITEM_TYPE[s]}"`));
            }
        }
        itemsXml = `<${prefix}items count="${entries.length}">${entries.join('')}</${prefix}items>`;
    }
    let sortXml: string = '';
    if (sorted) {
        sortXml = sortNode !== undefined
            ? text.slice(sortNode.start, sortNode.end)
            : `<${prefix}autoSortScope><${prefix}pivotArea dataOnly="0" outline="0" fieldPosition="0"/></${prefix}autoSortScope>`;
    }
    const inner: string = `${itemsXml}${sortXml}${others}`;
    return inner.length === 0
        ? `<${node.qname}${serializeAttrs(attrs)}/>`
        : `<${node.qname}${serializeAttrs(attrs)}>${inner}</${node.qname}>`;
}

function axisFieldsXml(prefix: string, name: string, indices: ReadonlyArray<number>): string {
    if (indices.length === 0) {
        return '';
    }
    return `<${prefix}${name} count="${indices.length}">${indices.map((i: number): string => `<${prefix}field x="${i}"/>`).join('')}</${prefix}${name}>`;
}

function patchDataField(spec: PivotDataFieldImpl, node: PivotXmlNode | undefined, text: string, resolveNumFmt: NumFmtLookup, prefix: string): string {
    const was = spec.loaded;
    if (node !== undefined && was !== undefined
        && was.name === spec.name && was.function === spec.function && was.numberFormat === spec.numberFormat) {
        return text.slice(node.start, node.end);
    }
    const attrs: Map<string, string> = node === undefined
        ? new Map<string, string>([['fld', String(spec.field.index)], ['baseField', '0'], ['baseItem', '0']])
        : new Map<string, string>(node.attrs);
    const ordered: Map<string, string> = new Map<string, string>();
    ordered.set('name', encodeXstring(spec.name));
    attrs.forEach((value: string, key: string): void => {
        if (key !== 'name') {
            ordered.set(key, value);
        }
    });
    setAttr(ordered, 'subtotal', spec.function === 'sum' ? undefined : spec.function);
    setAttr(ordered, 'numFmtId', spec.numberFormat === undefined ? undefined : String(resolveNumFmt(spec.numberFormat)));
    const children: string = node === undefined ? '' : node.children.map((c: PivotXmlNode): string => text.slice(c.start, c.end)).join('');
    const qname: string = node === undefined ? `${prefix}dataField` : node.qname;
    return children.length === 0 ? `<${qname}${serializeAttrs(ordered)}/>` : `<${qname}${serializeAttrs(ordered)}>${children}</${qname}>`;
}

/**
 * Rewrite a loaded pivot table, honouring the caller's edits.
 *
 * @param {PivotTableImpl} table - The adopted table.
 * @param {string} original - The part text as loaded.
 * @param {PivotCacheSnapshot} snapshot - Current cache data (seeded with the file's shared items).
 * @param {PivotGeometry} geometry - Placement for the edited table.
 * @param {NumFmtLookup} resolveNumFmt - Number format code to id.
 * @returns {string | undefined} New part text, or `undefined` when the original cannot be re-read.
 * @private
 */
export function rewriteLoadedPivotTable(
    table: PivotTableImpl,
    original: string,
    snapshot: PivotCacheSnapshot,
    geometry: PivotGeometry,
    resolveNumFmt: NumFmtLookup,
): string | undefined {
    const root: PivotXmlNode | undefined = parsePivotXml(original);
    const loaded = table.loaded;
    if (root === undefined || loaded === undefined) {
        return undefined;
    }
    const prefix: string = prefixOf(root.qname);
    const o = table.options;
    const was: { readonly [key: string]: unknown } = table.baselineOptions;
    const changed = (key: string): boolean => (o as unknown as { [k: string]: unknown })[key] !== was[key];
    const layoutChanged: boolean = table.layout !== loaded.layout;
    const structureChanged: boolean = table.structureSignature() !== table.baselineStructure;
    const geometryChanged: boolean = table.geometrySignature() !== table.baselineGeometry;

    const attrs: Map<string, string> = new Map<string, string>(root.attrs);
    if (table.name !== table.baselineName) {
        attrs.set('name', encodeXstring(table.name));
    }
    if (changed('rowGrand')) {
        attrs.set('rowGrandTotals', flagText(o.rowGrand));
    }
    if (changed('columnGrand')) {
        attrs.set('colGrandTotals', flagText(o.columnGrand));
    }
    if (changed('showDrillIndicators')) {
        attrs.set('showDrill', flagText(o.showDrillIndicators));
    }
    if (changed('showFieldHeaders')) {
        attrs.set('showHeaders', flagText(o.showFieldHeaders));
    }
    if (changed('mergeLabels')) {
        attrs.set('mergeItem', flagText(o.mergeLabels));
    }
    if (changed('autoFormat')) {
        attrs.set('useAutoFormatting', flagText(o.autoFormat));
    }
    if (changed('preserveFormatting')) {
        attrs.set('preserveFormatting', flagText(o.preserveFormatting));
    }
    const captions: ReadonlyArray<[string, string, string | undefined]> = [
        ['rowHeaderCaption', 'rowHeaderCaption', o.rowHeaderCaption],
        ['columnHeaderCaption', 'colHeaderCaption', o.columnHeaderCaption],
        ['grandTotalCaption', 'grandTotalCaption', o.grandTotalCaption],
    ];
    for (const [key, attr, value] of captions) {
        if (changed(key)) {
            setAttr(attrs, attr, value === undefined ? undefined : encodeXstring(value));
        }
    }
    if (changed('dataCaption')) {
        attrs.set('dataCaption', encodeXstring(o.dataCaption));
    }
    if (changed('errorCaption')) {
        setAttr(attrs, 'errorCaption', o.errorCaption === undefined ? undefined : encodeXstring(o.errorCaption));
        attrs.set('showError', flagText(o.errorCaption !== undefined));
    }
    if (changed('emptyCellCaption')) {
        setAttr(attrs, 'missingCaption', o.emptyCellCaption === undefined ? undefined : encodeXstring(o.emptyCellCaption));
        if (o.emptyCellCaption !== undefined) {
            attrs.set('showMissing', '1');
        }
    }
    if (layoutChanged) {
        const compact: boolean = table.layout === 'compact';
        attrs.set('compact', flagText(compact));
        attrs.set('compactData', flagText(compact));
        attrs.set('outline', flagText(table.layout !== 'tabular'));
        attrs.set('outlineData', flagText(table.layout !== 'tabular'));
    }

    const fields: ReadonlyArray<PivotFieldImpl> = table.allFields();
    const dataList: ReadonlyArray<PivotDataFieldImpl> = table.dataFieldList();
    const dataIndices: Set<number> = new Set<number>(dataList.map((d: PivotDataFieldImpl): number => d.field.index));
    const byName = (name: string): PivotXmlNode | undefined => root.children.find((c: PivotXmlNode): boolean => c.name === name);
    const verbatim = (node: PivotXmlNode): string => original.slice(node.start, node.end);

    // Values pseudo-field position.
    let valuesAxis: 'row' | 'column' | undefined = loaded.valuesAxis;
    let valuesPosition: number = loaded.valuesPosition;
    if (dataList.length > 1 && valuesAxis === undefined) {
        valuesAxis = 'column';
        valuesPosition = table.axisList('column').length;
    }
    const withValues = (axis: 'row' | 'column'): number[] => {
        const list: number[] = table.axisList(axis).map((f: PivotFieldImpl): number => f.index);
        if (dataList.length > 1 && valuesAxis === axis) {
            list.splice(Math.min(valuesPosition, list.length), 0, -2);
        }
        return list;
    };
    if (valuesAxis !== undefined && dataList.length > 1) {
        attrs.set('dataOnRows', flagText(valuesAxis === 'row'));
    }

    const parts: Array<{ readonly rank: number; readonly xml: string }> = [];
    const rankOf = (name: string): number => TABLE_ORDER.indexOf(name);
    const push = (name: string, xml: string): void => {
        if (xml.length > 0) {
            parts.push({ rank: rankOf(name), xml });
        }
    };

    // location
    const locationNode: PivotXmlNode | undefined = byName('location');
    if (locationNode !== undefined) {
        if (geometryChanged) {
            const loc: Map<string, string> = new Map<string, string>(locationNode.attrs);
            loc.set('ref', geometry.ref);
            loc.set('firstHeaderRow', String(geometry.firstHeaderRow));
            loc.set('firstDataRow', String(geometry.firstDataRow));
            loc.set('firstDataCol', String(geometry.firstDataCol));
            setAttr(loc, 'rowPageCount', geometry.pageCount > 0 ? String(geometry.pageCount) : undefined);
            setAttr(loc, 'colPageCount', geometry.pageCount > 0 ? '1' : undefined);
            push('location', `<${locationNode.qname}${serializeAttrs(loc)}/>`);
        } else {
            push('location', verbatim(locationNode));
        }
    }

    // pivotFields
    const fieldsNode: PivotXmlNode | undefined = byName('pivotFields');
    if (fieldsNode !== undefined) {
        const xml: string[] = fieldsNode.children.map((node: PivotXmlNode, i: number): string => {
            const field: PivotFieldImpl = fields[i];
            const isData: boolean = dataIndices.has(i);
            return fieldChanged(field, isData, layoutChanged)
                ? patchField(field, node, original, snapshot, table, isData, layoutChanged, resolveNumFmt)
                : verbatim(node);
        });
        const open: string = `<${fieldsNode.qname}${serializeAttrs(fieldsNode.attrs)}>`;
        push('pivotFields', `${open}${xml.join('')}</${fieldsNode.qname}>`);
    }

    // axes
    push('rowFields', axisFieldsXml(prefix, 'rowFields', withValues('row')));
    push('colFields', axisFieldsXml(prefix, 'colFields', withValues('column')));
    const rowItems: PivotXmlNode | undefined = byName('rowItems');
    const colItems: PivotXmlNode | undefined = byName('colItems');
    if (!geometryChanged) {
        if (rowItems !== undefined) {
            push('rowItems', verbatim(rowItems));
        }
        if (colItems !== undefined) {
            push('colItems', verbatim(colItems));
        }
    }

    // pageFields
    const pageNode: PivotXmlNode | undefined = byName('pageFields');
    const pages: ReadonlyArray<PivotFieldImpl> = table.axisList('filter');
    if (pages.length > 0) {
        const entries: string[] = pages.map((f: PivotFieldImpl): string => {
            const kept: PivotXmlNode | undefined = pageNode === undefined
                ? undefined
                : pageNode.children.find((c: PivotXmlNode): boolean => Number(c.attrs.get('fld')) === f.index);
            return kept !== undefined ? verbatim(kept) : `<${prefix}pageField fld="${f.index}" hier="-1"/>`;
        });
        push('pageFields', `<${prefix}pageFields count="${entries.length}">${entries.join('')}</${prefix}pageFields>`);
    }

    // dataFields
    const dataNode: PivotXmlNode | undefined = byName('dataFields');
    if (dataList.length > 0) {
        const entries: string[] = dataList.map((d: PivotDataFieldImpl): string => {
            const source: PivotXmlNode | undefined = dataNode === undefined || d.loaded === undefined ? undefined : dataNode.children[d.loaded.index];
            return patchDataField(d, source, original, resolveNumFmt, prefix);
        });
        const qname: string = dataNode === undefined ? `${prefix}dataFields` : dataNode.qname;
        push('dataFields', `<${qname} count="${entries.length}">${entries.join('')}</${qname}>`);
    }

    // style
    const styleNode: PivotXmlNode | undefined = byName('pivotTableStyleInfo');
    const styleChanged: boolean = table.pivotStyle !== table.baselineStyle
        || ['showRowHeaders', 'showColumnHeaders', 'showRowStripes', 'showColumnStripes', 'showLastColumn'].some(changed);
    if (styleChanged) {
        const style: Map<string, string> = styleNode === undefined ? new Map<string, string>() : new Map<string, string>(styleNode.attrs);
        setAttr(style, 'name', table.pivotStyle === 'none' ? undefined : table.pivotStyle);
        style.set('showRowHeaders', flagText(o.showRowHeaders));
        style.set('showColHeaders', flagText(o.showColumnHeaders));
        style.set('showRowStripes', flagText(o.showRowStripes));
        style.set('showColStripes', flagText(o.showColumnStripes));
        style.set('showLastColumn', flagText(o.showLastColumn));
        const qname: string = styleNode === undefined ? `${prefix}pivotTableStyleInfo` : styleNode.qname;
        push('pivotTableStyleInfo', `<${qname}${serializeAttrs(style)}/>`);
    } else if (styleNode !== undefined) {
        push('pivotTableStyleInfo', verbatim(styleNode));
    }

    // Everything else is copied through; shape-dependent markup is dropped
    // when the axes changed because it would address fields that moved.
    let lastRank: number = 0;
    for (const child of root.children) {
        const rank: number = rankOf(child.name);
        if (rank >= 0) {
            lastRank = rank;
        }
        const handled: boolean = ['location', 'pivotFields', 'rowFields', 'rowItems', 'colFields', 'colItems', 'pageFields', 'dataFields', 'pivotTableStyleInfo']
            .indexOf(child.name) >= 0;
        if (handled) {
            continue;
        }
        if (structureChanged && SHAPE_DEPENDENT.indexOf(child.name) >= 0) {
            continue;
        }
        parts.push({ rank: rank >= 0 ? rank : lastRank + 0.5, xml: verbatim(child) });
    }
    const ordered: Array<{ readonly rank: number; readonly xml: string; readonly seq: number }> = parts
        .map((p, seq: number) => ({ rank: p.rank, xml: p.xml, seq }))
        .sort((a, b): number => (a.rank - b.rank) || (a.seq - b.seq));

    const prolog: string = original.slice(0, root.start);
    return `${prolog}<${root.qname}${serializeAttrs(attrs)}>${ordered.map((p): string => p.xml).join('')}</${root.qname}>`;
}

/**
 * Patch a loaded cache definition: source sheet name, source ref and
 * `refreshOnOpen`. Everything else, including Excel's default field
 * attributes, is kept byte for byte.
 *
 * @param {string} originalXml - The part text as read.
 * @param {PivotCacheImpl} cache - The cache.
 * @returns {string | undefined} The patched part text.
 * @private
 */
export function patchLoadedCacheDefinition(originalXml: string, cache: PivotCacheImpl): string | undefined {
    const root: PivotXmlNode | undefined = parsePivotXml(originalXml);
    if (root === undefined || root.name !== 'pivotCacheDefinition') {
        return undefined;
    }
    const source: PivotXmlNode | undefined = childOf(root, 'cacheSource');
    const worksheetSource: PivotXmlNode | undefined = source === undefined ? undefined : childOf(source, 'worksheetSource');
    if (worksheetSource === undefined) {
        return undefined;
    }
    const attrs: Map<string, string> = new Map<string, string>(root.attrs);
    attrs.set('refreshOnLoad', flagText(cache.refreshOnOpen));
    const wantedRef: string = formatA1Range(cache.bounds);
    const wantedSheet: string = encodeXstring(cache.sheet.name);
    const sourceAttrs: Map<string, string> = new Map<string, string>(worksheetSource.attrs);
    const refChanged: boolean = sourceAttrs.get('ref') !== wantedRef;
    const sheetChanged: boolean = sourceAttrs.get('sheet') !== wantedSheet;
    if (refChanged) {
        sourceAttrs.set('ref', wantedRef);
    }
    if (sheetChanged) {
        sourceAttrs.set('sheet', wantedSheet);
    }
    const selfClosing: boolean = root.closeStart < 0;
    const pieces: string[] = [];
    pieces.push(`${originalXml.slice(0, root.start)}<${root.qname}${serializeAttrs(attrs)}${selfClosing ? '/>' : '>'}`);
    let cursor: number = root.openEnd;
    for (const child of root.children) {
        pieces.push(originalXml.slice(cursor, child.start));
        if (child === source && (refChanged || sheetChanged)) {
            pieces.push(originalXml.slice(child.start, worksheetSource.start));
            pieces.push(`<${worksheetSource.qname}${serializeAttrs(sourceAttrs)}/>`);
            pieces.push(originalXml.slice(worksheetSource.end, child.end));
        } else {
            pieces.push(originalXml.slice(child.start, child.end));
        }
        cursor = child.end;
    }
    pieces.push(originalXml.slice(cursor));
    return pieces.join('');
}

/**
 * Set `refreshOnOpen` on a cache definition read from a file, leaving the
 * rest of the text untouched.
 *
 * @param {string} original - Cache definition text.
 * @param {boolean} value - New value.
 * @returns {string | undefined} New text, or `undefined` when the original cannot be re-read.
 * @private
 */
export function setCacheRefreshOnLoad(original: string, value: boolean): string | undefined {
    const root: PivotXmlNode | undefined = parsePivotXml(original);
    if (root === undefined) {
        return undefined;
    }
    const attrs: Map<string, string> = new Map<string, string>(root.attrs);
    attrs.set('refreshOnLoad', flagText(value));
    const selfClosing: boolean = root.closeStart < 0;
    return `${original.slice(0, root.start)}<${root.qname}${serializeAttrs(attrs)}${selfClosing ? '/>' : '>'}${original.slice(root.openEnd)}`;
}
