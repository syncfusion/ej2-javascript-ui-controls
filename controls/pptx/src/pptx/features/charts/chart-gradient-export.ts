import { projectChartExportDialect } from './chart-export-dialect';
import { preserveNestedChartText } from './chart-text-export';
/** Preserve authored chart shape properties through the existing xlsx chart export. */
import { OoxmlAttribute, OoxmlElement, OoxmlNamespaceDeclaration, OoxmlText, parseXml, serializeXml } from '../../core/xml/dom';
import { SecurityLimits } from '../../core/security/limits';
import { asMutable, findChild, getAttr } from '../../core/shapes/dom-utils';
import { GradientFillError } from '../../core/shapes/write-gradient-fill';
import { arrayAt } from '../../core/util/es5-compat';
import { ChartGradientAddress, collectChartGradientHosts } from './chart-gradient-sources';
import { insertChartChild } from './chart-gradient-target';
/** Explicit engine paint intent, including assigning an unchanged fallback value. @internal */
export interface ChartGradientPaintOverride { readonly kind: string; readonly series?: number; readonly lane: 'fill' | 'outline' | 'text-content'; }
interface AddressTrie { readonly children: Map<number, AddressTrie>; }
interface PaintIndex {
    readonly root: OoxmlElement;
    readonly records: ReadonlyArray<ChartGradientAddress>;
    readonly nodes: Map<string, OoxmlElement>;
    readonly series: ReadonlyArray<ChartGradientAddress>;
    readonly seriesPositions: Map<string, number>;
    readonly singletons: Map<string, ChartGradientAddress | undefined>;
    readonly points: Map<string, Map<number, ChartGradientAddress | undefined>>;
    readonly limits: SecurityLimits;
}
interface PaintPair {
    readonly source: ChartGradientAddress;
    readonly before: ChartGradientAddress | undefined;
    readonly after: ChartGradientAddress | undefined;
    readonly mappedSeries: number | undefined;
}
const FILLS: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
const POINT_FOLLOWING: ReadonlyArray<string> = ['dLbls', 'trendline', 'errBars', 'cat', 'val', 'xVal', 'yVal',
    'bubbleSize', 'bubble3D', 'smooth', 'shape', 'extLst'];
/**
 * Three-way shape-property merge. Chart data and workbook export remain owned by ej2-xlsx.
 *
 * @param {string} sourceXml - Current authored chart part.
 * @param {string} beforeXml - Engine export captured before the edit.
 * @param {string} afterXml - Engine export after the edit, before data cache enrichment.
 * @param {ReadonlyArray<number | undefined>} seriesMap - Old source position to current opaque-identity-matched engine position.
 * @param {SecurityLimits} limits - Existing package XML limits.
 * @param {string} partName - Diagnostic part.
 * @param {ReadonlyArray<ChartGradientPaintOverride>} overrides - Explicit engine paint intent.
 * @returns {string} Export retaining unchanged source formatting and applying explicit engine paint changes.
 * @internal
 */
export function preserveChartGradientExport(sourceXml: string, beforeXml: string, afterXml: string,
                                            seriesMap: ReadonlyArray<number | undefined>, limits: SecurityLimits, partName: string,
                                            overrides: ReadonlyArray<ChartGradientPaintOverride> = []): string {
    const source: PaintIndex = indexPaint(parseXml(sourceXml, { limits, partName }), limits, partName);
    const before: PaintIndex = indexPaint(projectChartExportDialect(parseXml(beforeXml, { limits, partName }),
                                                                    source.root.namespaceUri, partName), limits, partName);
    const after: PaintIndex = indexPaint(projectChartExportDialect(parseXml(afterXml, { limits, partName }),
                                                                   source.root.namespaceUri, partName), limits, partName);
    if (source.root.namespaceUri !== before.root.namespaceUri || source.root.namespaceUri !== after.root.namespaceUri) {
        throw new GradientFillError(partName, 'chart.export.dialect');
    }
    if (source.series.length !== seriesMap.length || source.series.length !== before.series.length) {
        throw new GradientFillError(partName, 'chart.export.series-ownership');
    }
    const main: string = source.root.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
        'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
    preserveNestedChartText(source.root, before.root, after.root, seriesMap, limits, partName,
                            (properties: OoxmlElement, previous: OoxmlElement | undefined,
                             next: OoxmlElement | undefined, forceFill: boolean): void => {
                                mergePaint(properties, previous, next, main, false, forceFill);
                            }, new Set(overrides.filter((value: ChartGradientPaintOverride): boolean => value.kind.endsWith('-text') && value.lane === 'fill')
                                .map((value: ChartGradientPaintOverride): string => value.kind.slice(0, -5))),
                            new Set(overrides.filter((value: ChartGradientPaintOverride): boolean => value.lane === 'text-content')
                                .map((value: ChartGradientPaintOverride): string => value.kind)));
    const pairs: PaintPair[] = [];
    const pending: Map<OoxmlElement, OoxmlElement[]> = new Map();
    source.records.forEach((record: ChartGradientAddress): void => {
        if (record.kind !== 'series' && record.kind !== 'point') {
            pairs.push({ source: record, before: before.singletons.get(record.kind), after: after.singletons.get(record.kind),
                mappedSeries: undefined }); return;
        }
        const ownerKey: string = (record.kind === 'series' ? record.path : record.path.slice(0, -1)).join('/');
        const position: number | undefined = source.seriesPositions.get(ownerKey);
        if (position === undefined) { throw new GradientFillError(partName, 'chart.export.point-owner'); }
        const mapped: number | undefined = arrayAt(seriesMap, position);
        if (mapped === undefined) { return; }
        if (mapped < 0 || mapped >= after.series.length) { throw new GradientFillError(partName, 'chart.export.series-target'); }
        const previous: ChartGradientAddress = arrayAt(before.series, position);
        const next: ChartGradientAddress = arrayAt(after.series, mapped);
        if (record.kind === 'series') {
            pairs.push({ source: record, before: previous, after: next, mappedSeries: mapped }); return;
        }
        const point: number = pointIndex(record.pointIndex, partName);
        const baseline: ChartGradientAddress | undefined = pointRecord(before, previous, point);
        const current: ChartGradientAddress | undefined = pointRecord(after, next, point);
        pairs.push({ source: record, before: baseline, after: current, mappedSeries: mapped });
        if (baseline === undefined && current === undefined) {
            const owner: OoxmlElement = indexedNode(after, next);
            let points: OoxmlElement[] | undefined = pending.get(owner);
            if (points === undefined) { points = []; pending.set(owner, points); }
            points.push(cloneSource(indexedNode(source, record)));
        }
    });
    const usedSeriesIds: Set<number> = new Set();
    const survivors: Set<number> = new Set();
    seriesMap.forEach((mapped: number | undefined, position: number): void => {
        if (mapped === undefined) { return; }
        const id: number = pointIndex(arrayAt(source.series, position).seriesIndex, partName);
        if (usedSeriesIds.has(id)) { throw new GradientFillError(partName, 'chart.export.ambiguous-series-index'); }
        usedSeriesIds.add(id); survivors.add(mapped);
    });
    const origins: Map<OoxmlElement, OoxmlElement> = new Map();
    pairs.forEach((pair: PaintPair): void => { retainContext(source, before, after, pair, origins, partName); });
    const forced: Map<string, { fill: boolean; outline: boolean }> = new Map();
    overrides.forEach((value: ChartGradientPaintOverride): void => {
        const key: string = value.kind + ':' + (value.series === undefined ? '' : value.series);
        let lanes: { fill: boolean; outline: boolean } | undefined = forced.get(key);
        if (lanes === undefined) { lanes = { fill: false, outline: false }; forced.set(key, lanes); }
        if (value.lane === 'fill') { lanes.fill = true; } else if (value.lane === 'outline') { lanes.outline = true; }
    });
    pairs.forEach((pair: PaintPair): void => {
        if (pair.after === undefined) {
            if (pair.before === undefined && (pair.source.kind === 'title' || pair.source.kind === 'legend')) {
                const chart: OoxmlElement | undefined = findChild(after.root, after.root.namespaceUri, 'chart');
                if (chart === undefined) { throw new GradientFillError(partName, 'chart.export.owner'); }
                insertChartChild(chart, cloneSource(indexedNode(source, pair.source)), pair.source.kind === 'title' ?
                    ['autoTitleDeleted', 'pivotFmts', 'view3D', 'floor', 'sideWall', 'backWall', 'plotArea', 'legend',
                        'plotVisOnly', 'dispBlanksAs', 'showDLblsOverMax', 'extLst'] :
                    ['plotVisOnly', 'dispBlanksAs', 'showDLblsOverMax', 'extLst']);
            }
            return;
        }
        const old: OoxmlElement = indexedNode(source, pair.source);
        const prior: OoxmlElement | undefined = pair.before === undefined ? undefined : indexedNode(before, pair.before);
        const current: OoxmlElement = indexedNode(after, pair.after);
        retainMetadata(source, pair.source, prior, current);
        const oldProperties: OoxmlElement | undefined = findChild(old, source.root.namespaceUri, 'spPr');
        const baselineProperties: OoxmlElement | undefined = prior === undefined ? undefined : findChild(prior, source.root.namespaceUri, 'spPr');
        const afterProperties: OoxmlElement | undefined = findChild(current, source.root.namespaceUri, 'spPr');
        const lanes: { fill: boolean; outline: boolean } | undefined = forced.get(pair.source.kind + ':' +
            (pair.source.kind === 'series' ? pair.mappedSeries : ''));
        if (oldProperties === undefined && signature(baselineProperties) === signature(afterProperties) &&
            (lanes === undefined || (!lanes.fill && !lanes.outline))) { replaceProperties(current, undefined); return; }
        const copied: OoxmlElement = oldProperties === undefined ? { kind: 'element', namespaceUri: source.root.namespaceUri,
            localName: 'spPr', attributes: [], children: [] } : cloneSource(oldProperties);
        mergePaint(copied, baselineProperties, afterProperties, main, false,
                   lanes !== undefined && lanes.fill, lanes !== undefined && lanes.outline);
        replaceProperties(current, copied);
    });
    let nextSeriesId: number = 0;
    after.series.forEach((record: ChartGradientAddress, position: number): void => {
        if (survivors.has(position)) { return; }
        const owner: OoxmlElement = indexedNode(after, record);
        const idx: OoxmlElement | undefined = findChild(owner, owner.namespaceUri, 'idx');
        if (idx === undefined) { throw new GradientFillError(partName, 'chart.export.series-index'); }
        let value: number = pointIndex(getAttr(idx, '', 'val'), partName);
        if (usedSeriesIds.has(value)) {
            while (usedSeriesIds.has(nextSeriesId)) { nextSeriesId++; }
            value = nextSeriesId;
            asMutable(idx).attributes = idx.attributes.map((attribute: OoxmlAttribute): OoxmlAttribute =>
                attribute.namespaceUri === '' && attribute.localName === 'val' ? { ...attribute, value: String(value) } : attribute);
        }
        usedSeriesIds.add(value);
    });
    pending.forEach((points: OoxmlElement[], owner: OoxmlElement): void => {
        const children: Array<OoxmlElement | OoxmlText> = owner.children.slice();
        let position: number = children.length;
        for (let i: number = 0; i < children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(children, i);
            if (child.kind === 'element' && child.namespaceUri === owner.namespaceUri && POINT_FOLLOWING.indexOf(child.localName) >= 0) {
                position = i; break;
            }
        }
        asMutable(owner).children = children.slice(0, position).concat(points, children.slice(position));
    });
    return serializeXml(after.root);
}
/**
 * @param {OoxmlElement} root - Exact complete part.
 * @param {SecurityLimits} limits - Existing package limits.
 * @param {string} partName - Diagnostic part.
 * @returns {PaintIndex} Bounded host/address/point indices; does not index data-cache subtrees.
 */
function indexPaint(root: OoxmlElement, limits: SecurityLimits, partName: string): PaintIndex {
    const records: ReadonlyArray<ChartGradientAddress> = collectChartGradientHosts(root);
    const nodes: Map<string, OoxmlElement> = new Map();
    const series: ChartGradientAddress[] = [];
    const seriesPositions: Map<string, number> = new Map();
    const singletons: Map<string, ChartGradientAddress | undefined> = new Map();
    const points: Map<string, Map<number, ChartGradientAddress | undefined>> = new Map();
    const trie: AddressTrie = { children: new Map() };
    records.forEach((record: ChartGradientAddress): void => {
        let branch: AddressTrie = trie;
        record.path.forEach((position: number): void => {
            let child: AddressTrie | undefined = branch.children.get(position);
            if (child === undefined) { child = { children: new Map() }; branch.children.set(position, child); }
            branch = child;
        });
        const key: string = record.path.join('/');
        if (record.kind === 'series') { seriesPositions.set(key, series.length); series.push(record); }
        else if (record.kind === 'point') {
            const owner: string = record.path.slice(0, -1).join('/');
            let values: Map<number, ChartGradientAddress | undefined> | undefined = points.get(owner);
            if (values === undefined) { values = new Map(); points.set(owner, values); }
            const index: number = pointIndex(record.pointIndex, partName);
            if (values.has(index)) { throw new GradientFillError(partName, 'chart.export.ambiguous-point'); }
            values.set(index, record);
        } else {
            if (singletons.has(record.kind)) { throw new GradientFillError(partName, 'chart.export.ambiguous-owner'); }
            singletons.set(record.kind, record);
        }
    });
    /**
     * @param {OoxmlElement} node - Existing source node.
     * @param {AddressTrie} branch - Desired host address children.
     * @param {string} path - Current address key.
     * @returns {void} Records host/ancestor references in one pruned traversal.
     */
    function visit(node: OoxmlElement, branch: AddressTrie, path: string): void {
        nodes.set(path, node);
        if (branch.children.size === 0) { return; }
        let position: number = 0;
        node.children.forEach((child: OoxmlElement | OoxmlText): void => {
            if (child.kind === 'element') {
                const selected: AddressTrie | undefined = branch.children.get(position);
                if (selected !== undefined) { visit(child, selected, path === '' ? String(position) : path + '/' + position); }
                position++;
            }
        });
    }
    visit(root, trie, '');
    return { root, records, nodes, series, seriesPositions, singletons, points, limits };
}
/**
 * @param {string | undefined} raw - Authored uint32 token.
 * @param {string} partName - Diagnostic part.
 * @returns {number} Safe point key; malformed source remains withheld.
 */
function pointIndex(raw: string | undefined, partName: string): number {
    if (raw === undefined || !/^[ \t\r\n]*[+]?[0-9]+[ \t\r\n]*$/.test(raw) || Number(raw) > 4294967295) {
        throw new GradientFillError(partName, 'chart.export.point-index');
    }
    return Number(raw);
}
/**
 * @param {PaintIndex} index - Indexed part.
 * @param {ChartGradientAddress} series - Existing series.
 * @param {number} point - Point identity.
 * @returns {ChartGradientAddress | undefined} Unique optional point.
 */
function pointRecord(index: PaintIndex, series: ChartGradientAddress, point: number): ChartGradientAddress | undefined {
    const values: Map<number, ChartGradientAddress | undefined> | undefined = index.points.get(series.path.join('/'));
    return values === undefined ? undefined : values.get(point);
}
/**
 * @param {PaintIndex} index - Indexed source.
 * @param {ChartGradientAddress} record - Known source address.
 * @returns {OoxmlElement} Exact host, without rescanning siblings.
 */
function indexedNode(index: PaintIndex, record: ChartGradientAddress): OoxmlElement {
    const node: OoxmlElement | undefined = index.nodes.get(record.path.join('/'));
    if (node === undefined) { throw new GradientFillError(undefined, 'chart.export.source-address'); }
    return node;
}
/**
 * Clones source content after retainContext restores its ancestor namespace and MC scope.
 *
 * @param {OoxmlElement} node - Already validated source element.
 * @returns {OoxmlElement} Detached tree with authored local namespace declarations only.
 */
function cloneSource(node: OoxmlElement): OoxmlElement {
    return { ...node,
        attributes: node.attributes.map((attribute: OoxmlAttribute): OoxmlAttribute => ({ ...attribute })),
        ...(node.namespaceDeclarations === undefined ? {} : {
            namespaceDeclarations: node.namespaceDeclarations.map(
                (value: OoxmlNamespaceDeclaration): OoxmlNamespaceDeclaration => ({ ...value }))
        }),
        children: node.children.map((child: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
            child.kind === 'element' ? cloneSource(child) : { ...child })
    };
}
/**
 * signature source adapter.
 *
 * @param {OoxmlElement | undefined} node - Optional source node.
 * @returns {string} Namespace-based structural comparison token.
 */
function signature(node: OoxmlElement | undefined): string {
    if (node === undefined) { return ''; }
    const tokens: string[] = [];
    const visit: (value: OoxmlElement | OoxmlText) => void = (value: OoxmlElement | OoxmlText): void => {
        if (value.kind === 'text') { tokens.push('text', value.text); return; }
        tokens.push('element', value.namespaceUri, value.localName);
        const attributes: string[] = value.attributes.map((attribute: OoxmlAttribute): string =>
            JSON.stringify([attribute.namespaceUri, attribute.localName, attribute.value])).sort();
        tokens.push(String(attributes.length));
        attributes.forEach((attribute: string): void => { tokens.push(attribute); });
        value.children.forEach(visit);
        tokens.push('end');
    };
    visit(node);
    return JSON.stringify(tokens);
}
/**
 * family source adapter.
 *
 * @param {OoxmlElement} node - DrawingML child.
 * @param {string} main - Paired main namespace.
 * @returns {string} Schema choice family.
 */
function family(node: OoxmlElement, main: string): string {
    if (node.namespaceUri === main) {
        if (FILLS.indexOf(node.localName) >= 0) { return 'fill'; }
        if (['prstDash', 'custDash'].indexOf(node.localName) >= 0) { return 'dash'; }
        if (['round', 'bevel', 'miter'].indexOf(node.localName) >= 0) { return 'join'; }
    }
    return node.namespaceUri + ':' + node.localName;
}
/**
 * member source adapter.
 *
 * @param {OoxmlElement | undefined} parent - Optional paint carrier.
 * @param {string} key - Schema choice family.
 * @param {string} main - Paired main namespace.
 * @returns {OoxmlElement | undefined} Existing direct choice.
 */
function member(parent: OoxmlElement | undefined, key: string, main: string): OoxmlElement | undefined {
    if (parent === undefined) { return undefined; }
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && family(child, main) === key) { return child; }
    }
    return undefined;
}
/**
 * mergePaint source adapter.
 *
 * @param {OoxmlElement} source - Detached original paint carrier.
 * @param {OoxmlElement | undefined} before - Engine prior paint.
 * @param {OoxmlElement | undefined} after - Engine changed paint.
 * @param {string} main - Paired main namespace.
 * @param {boolean} line - Whether the source carrier is a line.
 * @param {boolean} forceFill - Explicit source body fill override.
 * @param {boolean} forceOutline - Explicit source line fill override.
 * @returns {void} Applies only explicit engine paint deltas.
 */
function mergePaint(source: OoxmlElement, before: OoxmlElement | undefined, after: OoxmlElement | undefined,
                    main: string, line: boolean, forceFill: boolean = false, forceOutline: boolean = false): void {
    const attributes: Map<string, OoxmlAttribute> = new Map();
    source.attributes.forEach((attribute: OoxmlAttribute): void => { attributes.set(attribute.namespaceUri + ':' + attribute.localName, attribute); });
    const priorAttributes: Map<string, OoxmlAttribute> = new Map();
    const nextAttributes: Map<string, OoxmlAttribute> = new Map();
    if (before !== undefined) { before.attributes.forEach((value: OoxmlAttribute): void => {
        priorAttributes.set(value.namespaceUri + ':' + value.localName, value);
    }); }
    if (after !== undefined) { after.attributes.forEach((value: OoxmlAttribute): void => {
        nextAttributes.set(value.namespaceUri + ':' + value.localName, value);
    }); }
    const keys: Set<string> = new Set(Array.from(priorAttributes.keys()).concat(Array.from(nextAttributes.keys())));
    keys.forEach((key: string): void => {
        const old: OoxmlAttribute | undefined = priorAttributes.get(key);
        const next: OoxmlAttribute | undefined = nextAttributes.get(key);
        if ((old === undefined ? undefined : old.value) !== (next === undefined ? undefined : next.value)) {
            if (next === undefined) { attributes.delete(key); } else { attributes.set(key, next); }
        }
    });
    asMutable(source).attributes = Array.from(attributes.values());
    const children: Set<string> = new Set();
    [before, after].forEach((node: OoxmlElement | undefined): void => {
        if (node !== undefined) { node.children.forEach((child: OoxmlElement | OoxmlText): void => {
            if (child.kind === 'element') { children.add(family(child, main)); }
        }); }
    });
    children.forEach((key: string): void => {
        const previous: OoxmlElement | undefined = member(before, key, main);
        const next: OoxmlElement | undefined = member(after, key, main);
        const old: OoxmlElement | undefined = member(source, key, main);
        if (signature(previous) === signature(next) && !(key === 'fill' && (line ? forceOutline : forceFill)) &&
            !(!line && key === main + ':ln' && forceOutline)) { return; }
        if (!line && key === main + ':ln' && old !== undefined) {
            mergePaint(old, previous, next, main, true, false, forceOutline); return;
        }
        asMutable(source).children = source.children.filter((child: OoxmlElement | OoxmlText): boolean =>
            child.kind !== 'element' || family(child, main) !== key);
        if (next !== undefined) {
            insertChartChild(source, next, ['rPr', 'defRPr', 'endParaRPr'].indexOf(source.localName) >= 0 ? characterFollowing(next.localName) : key === 'fill' ? ['ln', 'prstDash', 'custDash', 'round', 'bevel', 'miter',
                'headEnd', 'tailEnd', 'effectLst', 'effectDag', 'scene3d', 'sp3d', 'extLst'] :
                next.localName === 'ln' ? ['effectLst', 'effectDag', 'scene3d', 'sp3d', 'extLst'] :
                    key === 'dash' ? ['round', 'bevel', 'miter', 'headEnd', 'tailEnd', 'extLst'] :
                        key === 'join' ? ['headEnd', 'tailEnd', 'extLst'] :
                            next.localName === 'headEnd' ? ['tailEnd', 'extLst'] : ['extLst']);
        }
    });
}
/**
 * replaceProperties source adapter.
 *
 * @param {OoxmlElement} owner - Existing chart owner.
 * @param {OoxmlElement | undefined} properties - Detached shape properties.
 * @returns {void} Replaces properties in schema order.
 */
function replaceProperties(owner: OoxmlElement, properties: OoxmlElement | undefined): void {
    const old: OoxmlElement | undefined = findChild(owner, owner.namespaceUri, 'spPr');
    if (old !== undefined) {
        asMutable(owner).children = owner.children.filter((child: OoxmlElement | OoxmlText): boolean => child !== old);
    }
    if (properties === undefined) { return; }
    const following: ReadonlyArray<string> = owner.localName === 'chartSpace' ?
        ['txPr', 'externalData', 'printSettings', 'userShapes', 'extLst'] : owner.localName === 'ser' ?
            ['invertIfNegative', 'marker', 'bubble3D', 'explosion', 'pictureOptions', 'dPt', 'dLbls', 'trendline',
                'errBars', 'cat', 'val', 'xVal', 'yVal', 'bubbleSize', 'smooth', 'shape', 'extLst'] :
            owner.localName === 'dPt' ? ['pictureOptions', 'extLst'] : ['txPr', 'extLst'];
    insertChartChild(owner, properties, following);
}

/**
 * Retains source metadata not changed by the shared engine, leaving chart data authoritative.
 *
 * @param {PaintIndex} index - Original source index.
 * @param {ChartGradientAddress} record - Original source host.
 * @param {OoxmlElement | undefined} before - Prior engine host.
 * @param {OoxmlElement} after - Current engine host.
 * @returns {void} Preserves style/extension identity and surviving series idx without copying cached data.
 */
function retainMetadata(index: PaintIndex, record: ChartGradientAddress, before: OoxmlElement | undefined, after: OoxmlElement): void {
    const source: OoxmlElement = indexedNode(index, record);
    const managed: ReadonlyArray<string> = record.kind === 'chart-area' ? ['chart', 'spPr'] :
        record.kind === 'plot-area' ? ['spPr', 'areaChart', 'area3DChart', 'barChart', 'bar3DChart', 'lineChart', 'line3DChart',
            'pieChart', 'pie3DChart', 'doughnutChart', 'ofPieChart', 'scatterChart', 'bubbleChart', 'radarChart',
            'stockChart', 'surfaceChart', 'surface3DChart', 'catAx', 'valAx', 'dateAx', 'serAx'] :
            record.kind === 'series' ? ['spPr', 'dPt', 'cat', 'val', 'xVal', 'yVal', 'bubbleSize'] : ['spPr'];
    const originals: Map<string, OoxmlElement[]> = new Map();
    const ranks: Map<string, number> = new Map();
    let position: number = 0;
    source.children.forEach((child: OoxmlElement | OoxmlText): void => {
        if (child.kind !== 'element') { return; }
        const key: string = child.namespaceUri + ':' + child.localName;
        if (!ranks.has(key)) { ranks.set(key, position++); }
        if (child.namespaceUri === source.namespaceUri && managed.indexOf(child.localName) >= 0) { return; }
        let group: OoxmlElement[] | undefined = originals.get(key);
        if (group === undefined) { group = []; originals.set(key, group); }
        group.push(child);
    });
    const prior: Map<string, OoxmlElement[]> = metadataGroups(before);
    const current: Map<string, OoxmlElement[]> = metadataGroups(after);
    const retained: Map<string, OoxmlElement[]> = new Map();
    originals.forEach((group: OoxmlElement[], key: string): void => {
        const stableId: boolean = record.kind === 'series' && key === source.namespaceUri + ':idx';
        if (stableId || groupSignature(prior.get(key)) === groupSignature(current.get(key))) {
            retained.set(key, group.map((child: OoxmlElement): OoxmlElement => cloneSource(child)));
        }
    });
    const pending: string[] = Array.from(retained.keys());
    const pendingSet: Set<string> = new Set(pending);
    let cursor: number = 0;
    const output: Array<OoxmlElement | OoxmlText> = [];
    after.children.forEach((child: OoxmlElement | OoxmlText): void => {
        if (child.kind !== 'element') { output.push(child); return; }
        const key: string = child.namespaceUri + ':' + child.localName;
        const rank: number | undefined = ranks.get(key);
        while (cursor < pending.length) {
            const nextKey: string = arrayAt(pending, cursor);
            const nextRank: number | undefined = ranks.get(nextKey);
            if (rank === undefined || nextRank === undefined || nextRank >= rank) { break; }
            const values: OoxmlElement[] | undefined = retained.get(nextKey);
            if (values !== undefined) { values.forEach((value: OoxmlElement): void => { output.push(value); }); retained.delete(nextKey); }
            cursor++;
        }
        const replacement: OoxmlElement[] | undefined = retained.get(key);
        if (replacement !== undefined) {
            replacement.forEach((value: OoxmlElement): void => { output.push(value); }); retained.delete(key);
        } else if (!originals.has(key) || !pendingSet.has(key)) { output.push(child); }
    });
    retained.forEach((group: OoxmlElement[]): void => { group.forEach((child: OoxmlElement): void => { output.push(child); }); });
    asMutable(after).children = output;
}
/**
 * @param {OoxmlElement | undefined} node - Optional engine owner.
 * @returns {Map<string, OoxmlElement[]>} Direct metadata groups without visiting cache data.
 */
function metadataGroups(node: OoxmlElement | undefined): Map<string, OoxmlElement[]> {
    const groups: Map<string, OoxmlElement[]> = new Map();
    if (node !== undefined) { node.children.forEach((child: OoxmlElement | OoxmlText): void => {
        if (child.kind !== 'element') { return; }
        const key: string = child.namespaceUri + ':' + child.localName;
        let group: OoxmlElement[] | undefined = groups.get(key);
        if (group === undefined) { group = []; groups.set(key, group); }
        group.push(child);
    }); }
    return groups;
}
/**
 * @param {ReadonlyArray<OoxmlElement> | undefined} group - Optional group.
 * @returns {string} Structural comparison, independent of QName prefixes.
 */
function groupSignature(group: ReadonlyArray<OoxmlElement> | undefined): string {
    return group === undefined ? '' : group.map(signature).join('|');
}

/**
 * Retains ancestor namespace and MC context without rebuilding or inspecting chart data.
 *
 * @param {PaintIndex} source - Original source index.
 * @param {PaintIndex} before - Prior engine index.
 * @param {PaintIndex} after - Current engine index.
 * @param {PaintPair} pair - Matched source host.
 * @param {Map<OoxmlElement, OoxmlElement>} origins - Unique destination ancestor ownership.
 * @param {string} partName - Diagnostic part.
 * @returns {void} Copies source context while honoring explicit engine attribute changes.
 */
function retainContext(source: PaintIndex, before: PaintIndex, after: PaintIndex, pair: PaintPair,
                       origins: Map<OoxmlElement, OoxmlElement>, partName: string): void {
    if (pair.after === undefined) { return; }
    const sourcePath: ReadonlyArray<number> = pair.source.path;
    const currentPath: ReadonlyArray<number> = pair.after.path;
    if (sourcePath.length !== currentPath.length) { throw new GradientFillError(partName, 'chart.export.host-layout'); }
    for (let i: number = 0; i <= sourcePath.length; i++) {
        const old: OoxmlElement | undefined = source.nodes.get(sourcePath.slice(0, i).join('/'));
        const current: OoxmlElement | undefined = after.nodes.get(currentPath.slice(0, i).join('/'));
        const prior: OoxmlElement | undefined = pair.before === undefined ? undefined :
            before.nodes.get(pair.before.path.slice(0, i).join('/'));
        if (old === undefined || current === undefined ||
            old.namespaceUri !== current.namespaceUri || old.localName !== current.localName) {
            throw new GradientFillError(partName, 'chart.export.host-layout');
        }
        const owner: OoxmlElement | undefined = origins.get(current);
        if (owner !== undefined) {
            if (owner !== old) { throw new GradientFillError(partName, 'chart.export.ambiguous-host-layout'); }
            continue;
        }
        origins.set(current, old);
        const declarations: Map<string, string> = new Map();
        (current.namespaceDeclarations || []).concat(old.namespaceDeclarations || []).forEach((value: OoxmlNamespaceDeclaration): void => {
            declarations.set(value.prefix, value.uri);
        });
        const bindings: OoxmlNamespaceDeclaration[] = [];
        declarations.forEach((uri: string, prefix: string): void => { bindings.push({ prefix, uri }); });
        asMutable(current).namespaceDeclarations = bindings;
        const attributes: Map<string, OoxmlAttribute> = new Map();
        old.attributes.forEach((value: OoxmlAttribute): void => { attributes.set(value.namespaceUri + ':' + value.localName, value); });
        const priorAttributes: Map<string, OoxmlAttribute> = new Map();
        const nextAttributes: Map<string, OoxmlAttribute> = new Map();
        if (prior !== undefined) { prior.attributes.forEach((value: OoxmlAttribute): void => {
            priorAttributes.set(value.namespaceUri + ':' + value.localName, value);
        }); }
        current.attributes.forEach((value: OoxmlAttribute): void => { nextAttributes.set(value.namespaceUri + ':' + value.localName, value); });
        const keys: Set<string> = new Set(Array.from(priorAttributes.keys()).concat(Array.from(nextAttributes.keys())));
        keys.forEach((key: string): void => {
            const previous: OoxmlAttribute | undefined = priorAttributes.get(key);
            const next: OoxmlAttribute | undefined = nextAttributes.get(key);
            if ((previous === undefined ? undefined : previous.value) !== (next === undefined ? undefined : next.value)) {
                if (next === undefined) { attributes.delete(key); } else { attributes.set(key, next); }
            }
        });
        asMutable(current).attributes = Array.from(attributes.values());
    }
}

/** @param {string} name - Character-property schema child.
 * @returns {ReadonlyArray<string>} Following character-property children in Office schema order. */
function characterFollowing(name: string): ReadonlyArray<string> {
    const groups: ReadonlyArray<ReadonlyArray<string>> = [['ln'], ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'],
        ['effectLst', 'effectDag'], ['highlight'], ['uLnTx', 'uLn'], ['uFillTx', 'uFill'], ['latin'], ['ea'], ['cs'], ['sym'],
        ['hlinkClick'], ['hlinkMouseOver'], ['rtl'], ['extLst']];
    const rank: number = groups.findIndex((group: ReadonlyArray<string>): boolean => group.indexOf(name) >= 0);
    const following: string[] = [];
    groups.forEach((group: ReadonlyArray<string>, index: number): void => { if (index > rank) { following.push(...group); } });
    return following;
}
