/** Exact existing classic-chart host targeting and fill-only XML mutation. */
import { OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { arrayAt } from '../../core/util/es5-compat';
import { asMutable, findChild } from '../../core/shapes/dom-utils';
import { GradientFillError } from '../../core/shapes/write-gradient-fill';
import { replaceLineFill } from '../../core/shapes/mutate-decoration-fill';
import { ChartGradientSource, readChartGradientSources } from './chart-gradient-sources';
/** Source owner: series is its zero-based collection position; point is the authored data-point idx. @public */
export type ChartGradientTarget = { readonly kind: 'chart-area' | 'plot-area' | 'title' | 'legend'; } |
{ readonly kind: 'series'; readonly series: number; } | { readonly kind: 'point'; readonly series: number; readonly point: number; };
/** Independent source paint lane. @public */
export type ChartGradientLane = 'fill' | 'outline';
const FILLS: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
/**
 * @param {OoxmlElement} root - Complete exact chart root.
 * @param {ChartGradientTarget} target - Explicit supported target.
 * @param {boolean} createPoint - Whether to create a validated missing point override.
 * @param {string} partName - Diagnostic part.
 * @returns {OoxmlElement | undefined} Unique owner; optional point absence for reset.
 * @internal
 */
export function chartGradientOwner(root: OoxmlElement, target: ChartGradientTarget, createPoint: boolean,
                                   partName?: string): OoxmlElement | undefined {
    if (target === null || typeof target !== 'object') { throw new GradientFillError(partName, 'chart.target'); }
    const sources: ReadonlyArray<ChartGradientSource> = readChartGradientSources(root, partName);
    let matches: ReadonlyArray<ChartGradientSource>;
    if (target.kind === 'series' || target.kind === 'point') {
        const series: ReadonlyArray<ChartGradientSource> = sources.filter((source: ChartGradientSource): boolean => source.kind === 'series');
        if (!Number.isInteger(target.series) || target.series < 0 || target.series >= series.length) {
            throw new GradientFillError(partName, 'chart.series');
        }
        const selected: ChartGradientSource = arrayAt(series, target.series);
        if (target.kind === 'series') { return chartNodeAt(root, selected.path); }
        const group: OoxmlElement = chartNodeAt(root, selected.path.slice(0, -1));
        if (group.localName === 'surfaceChart' || group.localName === 'surface3DChart') {
            throw new GradientFillError(partName, 'chart.point.unsupported-series');
        }
        if (!Number.isInteger(target.point) || target.point < 0 || target.point > 4294967295) {
            throw new GradientFillError(partName, 'chart.point');
        }
        matches = sources.filter((source: ChartGradientSource): boolean => source.kind === 'point' &&
            source.path.length === selected.path.length + 1 && selected.path.every((value: number, index: number): boolean =>
            arrayAt(source.path, index) === value) && source.pointIndex !== undefined &&
            /^[ \t\r\n]*[+]?[0-9]+[ \t\r\n]*$/.test(source.pointIndex) && Number(source.pointIndex) === target.point);
        if (matches.length === 0) {
            if (!createPoint) { return undefined; }
            const owner: OoxmlElement = chartNodeAt(root, selected.path);
            const point: OoxmlElement = element(root.namespaceUri, 'dPt', [{ kind: 'element', namespaceUri: root.namespaceUri,
                localName: 'idx', attributes: [{ namespaceUri: '', localName: 'val', value: String(target.point) }], children: [] }]);
            insertChartChild(owner, point, ['dLbls', 'trendline', 'errBars', 'cat', 'val', 'xVal', 'yVal', 'bubbleSize', 'bubble3D', 'smooth', 'shape', 'extLst']);
            return point;
        }
    } else {
        if (['chart-area', 'plot-area', 'title', 'legend'].indexOf(target.kind) < 0) {
            throw new GradientFillError(partName, 'chart.target');
        }
        matches = sources.filter((source: ChartGradientSource): boolean => source.kind === target.kind);
    }
    if (matches.length !== 1) { throw new GradientFillError(partName, 'chart.target.ambiguous-or-missing'); }
    return chartNodeAt(root, arrayAt(matches, 0).path);
}
/**
 * @param {OoxmlElement} root - Complete source root.
 * @param {ReadonlyArray<number>} path - Snapshot element-child address.
 * @returns {OoxmlElement} Exact addressed source node.
 * @internal
 */
export function chartNodeAt(root: OoxmlElement, path: ReadonlyArray<number>): OoxmlElement {
    let current: OoxmlElement = root;
    path.forEach((position: number): void => {
        current = arrayAt(current.children.filter((child: OoxmlElement | OoxmlText): child is OoxmlElement => child.kind === 'element'), position);
    });
    return current;
}
/**
 * @param {OoxmlElement} owner - Valid exact chart owner.
 * @param {ChartGradientLane} lane - Independent fill or outline.
 * @param {OoxmlElement} fill - Detached fill, or undefined to reset.
 * @param {string} main - Paired DrawingML main namespace.
 * @returns {boolean} Whether source changed.
 * @internal
 */
export function replaceChartGradientFill(owner: OoxmlElement, lane: ChartGradientLane, fill: OoxmlElement | undefined,
                                         main: string): boolean {
    if (lane !== 'fill' && lane !== 'outline') { throw new GradientFillError(undefined, 'chart.lane'); }
    const properties: OoxmlElement | undefined = findChild(owner, owner.namespaceUri, 'spPr');
    if (properties === undefined && fill === undefined) { return false; }
    const selected: OoxmlElement = properties || element(owner.namespaceUri, 'spPr');
    if (properties === undefined) {
        const following: ReadonlyArray<string> = owner.localName === 'chartSpace' ?
            ['txPr', 'externalData', 'printSettings', 'userShapes', 'extLst'] : owner.localName === 'ser' ?
                ['invertIfNegative', 'marker', 'bubble3D', 'explosion', 'pictureOptions', 'dPt', 'dLbls', 'trendline',
                    'errBars', 'cat', 'val', 'xVal', 'yVal', 'bubbleSize', 'bubble3D', 'smooth', 'shape', 'extLst'] :
                owner.localName === 'dPt' ? ['pictureOptions', 'extLst'] : ['txPr', 'extLst'];
        insertChartChild(owner, selected, following);
    }
    if (lane === 'outline') {
        const line: OoxmlElement | undefined = findChild(selected, main, 'ln');
        if (line === undefined && fill === undefined) { return false; }
        const actual: OoxmlElement = line || element(main, 'ln');
        if (line === undefined) { insertChartChild(selected, actual, ['effectLst', 'effectDag', 'scene3d', 'sp3d', 'extLst']); }
        return replaceLineFill(actual, main, fill);
    }
    const children: Array<OoxmlElement | OoxmlText> = selected.children.filter((child: OoxmlElement | OoxmlText): boolean =>
        child.kind !== 'element' || child.namespaceUri !== main || FILLS.indexOf(child.localName) < 0);
    if (fill === undefined && children.length === selected.children.length) { return false; }
    asMutable(selected).children = children;
    if (fill !== undefined) { insertChartChild(selected, fill, ['ln', 'effectLst', 'effectDag', 'scene3d', 'sp3d', 'extLst']); }
    return true;
}
/**
 * @param {OoxmlElement} parent - Existing source parent.
 * @param {OoxmlElement} child - Detached known schema child.
 * @param {ReadonlyArray<string>} following - Exact following siblings in its schema sequence.
 * @returns {void} Nothing.
 * @internal
 */
export function insertChartChild(parent: OoxmlElement, child: OoxmlElement, following: ReadonlyArray<string>): void {
    const children: Array<OoxmlElement | OoxmlText> = parent.children.slice();
    let position: number = children.length;
    for (let i: number = 0; i < children.length; i++) {
        const item: OoxmlElement | OoxmlText = arrayAt(children, i);
        if (item.kind === 'element' && (item.namespaceUri === child.namespaceUri || item.namespaceUri === parent.namespaceUri) &&
            following.indexOf(item.localName) >= 0) { position = i; break; }
    }
    children.splice(position, 0, child); asMutable(parent).children = children;
}
/**
 * @param {string} namespaceUri - Exact owning namespace.
 * @param {string} localName - Known schema child.
 * @param {ReadonlyArray<OoxmlElement>} children - Detached known children.
 * @returns {OoxmlElement} Detached source element.
 */
function element(namespaceUri: string, localName: string, children: ReadonlyArray<OoxmlElement> = []): OoxmlElement {
    return { kind: 'element', namespaceUri, localName, attributes: [], children };
}
