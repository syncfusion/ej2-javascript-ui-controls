/** Exact classic-chart shape-property source inventory; no inherited or engine paint defaults. */
import { OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { arrayAt } from '../../core/util/es5-compat';
import { findChild, getAttr } from '../../core/shapes/dom-utils';
import { readDrawingFillProperties, readDrawingFillChoice, TextFillSnapshot, TextLineFillSnapshot } from '../../core/text/character-fills';
/** Existing classic-chart owner with c:spPr; ChartEx and axis/label/marker hosts are not included. @public */
export type ChartGradientHostKind = 'chart-area' | 'plot-area' | 'title' | 'legend' | 'series' | 'point';
/** Source-only host address, without allocating paint models during export. @internal */
export interface ChartGradientAddress {
    readonly kind: ChartGradientHostKind;
    /** Element-child positions from chartSpace; stable only for this source snapshot. */
    readonly path: ReadonlyArray<number>;
    /** Authored c:ser/c:idx value, retained without normalization. */
    readonly seriesIndex?: string;
    /** Authored c:ser/c:order value. */
    readonly seriesOrder?: string;
    /** Authored c:dPt/c:idx value. */
    readonly pointIndex?: string;
}
/** Complete direct source context, separate from chart engine frame-format projections. @public */
export interface ChartGradientSource extends ChartGradientAddress {
    readonly fill: TextFillSnapshot;
    readonly outline: TextLineFillSnapshot;
}
const GROUPS: ReadonlyArray<string> = ['areaChart', 'area3DChart', 'barChart', 'bar3DChart', 'lineChart', 'line3DChart',
    'pieChart', 'pie3DChart', 'doughnutChart', 'ofPieChart', 'scatterChart', 'bubbleChart', 'radarChart',
    'stockChart', 'surfaceChart', 'surface3DChart'];
/**
 * Reads exact CT_ChartSpace/CT_PlotArea/CT_Title/CT_Legend/EG_SerShared/CT_DPt owners.
 *
 * @param {OoxmlElement} root - Complete classic-chart part root in either exact dialect.
 * @param {string} partName - Diagnostic source part.
 * @returns {ReadonlyArray<ChartGradientSource>} Clone-safe authored sources; no writes or defaults.
 * @internal
 */
export function readChartGradientSources(root: OoxmlElement, partName?: string): ReadonlyArray<ChartGradientSource> {
    const main: string = root.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
        'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
    return collectChartGradientHosts(root).map((host: ChartGradientHost): ChartGradientSource => {
        const properties: OoxmlElement | undefined = findChild(host.owner, root.namespaceUri, 'spPr');
        const line: OoxmlElement | undefined = properties === undefined ? undefined : findChild(properties, main, 'ln');
        return { kind: host.kind, path: host.path,
            ...(host.seriesIndex === undefined ? {} : { seriesIndex: host.seriesIndex }),
            ...(host.seriesOrder === undefined ? {} : { seriesOrder: host.seriesOrder }),
            ...(host.pointIndex === undefined ? {} : { pointIndex: host.pointIndex }),
            fill: properties === undefined ? { kind: 'missing' } : readDrawingFillProperties(properties, main, partName),
            outline: line === undefined ? { kind: 'missing' } : { kind: 'line', fill: readDrawingFillChoice(line, main, partName) } };
    });
}
/** Exact owner node and address for internal source adapters. @internal */
export interface ChartGradientHost extends ChartGradientAddress { readonly owner: OoxmlElement; }
/**
 * Visits schema-owned chart hosts without parsing their paint or entering data-cache subtrees.
 *
 * @param {OoxmlElement} root - Complete chart source root.
 * @returns {ReadonlyArray<ChartGradientHost>} Exact source owners and snapshot addresses.
 * @internal
 */
export function collectChartGradientHosts(root: OoxmlElement): ReadonlyArray<ChartGradientHost> {
    const ns: string = root.namespaceUri;
    const main: string | undefined = ns === 'http://schemas.openxmlformats.org/drawingml/2006/chart' ?
        'http://schemas.openxmlformats.org/drawingml/2006/main' : ns === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
            'http://purl.oclc.org/ooxml/drawingml/main' : undefined;
    if (root.localName !== 'chartSpace' || main === undefined) { return []; }
    const records: ChartGradientHost[] = [];
    /**
     * Captures an exact schema-owned source without changing its namespace.
     *
     * @param {OoxmlElement} owner - Exact source host.
     * @param {ChartGradientHostKind} kind - Host family.
     * @param {ReadonlyArray<number>} path - Source element address.
     * @param {object} identity - Raw series/point identity context.
     * @param {string} identity.seriesIndex - Raw series index.
     * @param {string} identity.seriesOrder - Raw series order.
     * @param {string} identity.pointIndex - Raw point index.
     * @returns {void} Nothing.
     */
    const record: (owner: OoxmlElement, kind: ChartGradientHostKind, path: ReadonlyArray<number>,
        identity?: { seriesIndex?: string; seriesOrder?: string; pointIndex?: string }) => void =
        (owner: OoxmlElement, kind: ChartGradientHostKind, path: ReadonlyArray<number>,
         identity: { seriesIndex?: string; seriesOrder?: string; pointIndex?: string } = {}): void => {
            records.push({ kind, path, ...identity, owner });
        };
    record(root, 'chart-area', []);
    exactChildren(root, ns, (chart: OoxmlElement, chartIndex: number): void => {
        if (chart.localName !== 'chart') { return; }
        exactChildren(chart, ns, (host: OoxmlElement, hostIndex: number): void => {
            const path: ReadonlyArray<number> = [chartIndex, hostIndex];
            if (host.localName === 'title' || host.localName === 'legend') { record(host, host.localName, path); }
        });
        exactChildren(chart, ns, (plot: OoxmlElement, plotIndex: number): void => {
            if (plot.localName !== 'plotArea') { return; }
            const path: ReadonlyArray<number> = [chartIndex, plotIndex]; record(plot, 'plot-area', path);
            exactChildren(plot, ns, (group: OoxmlElement, groupIndex: number): void => {
                if (GROUPS.indexOf(group.localName) < 0) { return; }
                exactChildren(group, ns, (series: OoxmlElement, seriesIndex: number): void => {
                    if (series.localName !== 'ser') { return; }
                    const seriesPath: ReadonlyArray<number> = path.concat([groupIndex, seriesIndex]);
                    const index: OoxmlElement | undefined = findChild(series, ns, 'idx');
                    const order: OoxmlElement | undefined = findChild(series, ns, 'order');
                    const identity: { seriesIndex: string | undefined; seriesOrder: string | undefined } = {
                        seriesIndex: index === undefined ? undefined : getAttr(index, '', 'val'),
                        seriesOrder: order === undefined ? undefined : getAttr(order, '', 'val') };
                    record(series, 'series', seriesPath, identity);
                    if (group.localName === 'surfaceChart' || group.localName === 'surface3DChart') { return; }
                    exactChildren(series, ns, (point: OoxmlElement, pointIndex: number): void => {
                        if (point.localName !== 'dPt') { return; }
                        const value: OoxmlElement | undefined = findChild(point, ns, 'idx');
                        record(point, 'point', seriesPath.concat([pointIndex]), { ...identity,
                            pointIndex: value === undefined ? undefined : getAttr(value, '', 'val') });
                    });
                });
            });
        });
    });
    return records;
}
/**
 * @param {OoxmlElement} parent - Known owning node; does not enter extensions or MC alternatives.
 * @param {string} ns - Exact chart namespace.
 * @param {Function} visit - Visitor receives element-child position including skipped foreign siblings.
 * @returns {void} Nothing.
 */
function exactChildren(parent: OoxmlElement, ns: string, visit: (child: OoxmlElement, index: number) => void): void {
    let position: number = 0;
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind !== 'element') { continue; }
        if (child.namespaceUri === ns) { visit(child, position); } position++;
    }
}
