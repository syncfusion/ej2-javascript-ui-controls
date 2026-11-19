/** Schema-owned classic-chart text bodies; dependency data parsing remains separate. */
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { asMutable, getAttr } from '../../core/shapes/dom-utils';
import { arrayAt } from '../../core/util/es5-compat';
import { GradientFillError } from '../../core/shapes/write-gradient-fill';
import { chartGradientOwner, insertChartChild } from './chart-gradient-target';
/** Existing source text owner; series is collection position and point is authored label idx. */
export type ChartTextTarget = { readonly kind: 'title' | 'legend' | 'chart-defaults'; } |
{ readonly kind: 'axis-title' | 'axis-defaults'; readonly axisId: number; } |
{ readonly kind: 'data-labels'; readonly series: number; } |
{ readonly kind: 'data-label'; readonly series: number; readonly point: number; };
/** Rich content is never created over a reference; defaults address independent txPr. */
export type ChartTextLane = 'rich' | 'defaults';
/**
 * @param {OoxmlElement} root - Complete classic-chart source.
 * @param {ChartTextTarget} target - Exact existing semantic owner.
 * @param {ChartTextLane} lane - Rich text or independent default properties.
 * @param {string} partName - Diagnostic source identity.
 * @returns {OoxmlElement} Existing rich body or explicitly created default body.
 * @internal
 */
export function chartTextBody(root: OoxmlElement, target: ChartTextTarget, lane: ChartTextLane,
                              partName: string): OoxmlElement {
    const ns: string = root.namespaceUri;
    if (root.localName !== 'chartSpace' || (ns !== 'http://schemas.openxmlformats.org/drawingml/2006/chart' &&
        ns !== 'http://purl.oclc.org/ooxml/drawingml/chart') || !target || typeof target !== 'object' ||
        (lane !== 'rich' && lane !== 'defaults')) { throw new GradientFillError(partName, 'chart.text.target'); }
    const main: string = ns === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
        'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
    let owner: OoxmlElement | undefined;
    if (target.kind === 'title' || target.kind === 'legend') { owner = chartGradientOwner(root, { kind: target.kind }, false, partName); }
    else if (target.kind === 'chart-defaults') { owner = root; }
    else if (target.kind === 'data-label' || target.kind === 'data-labels') {
        const series: OoxmlElement | undefined = chartGradientOwner(root, { kind: 'series', series: target.series }, false, partName);
        const labels: OoxmlElement = unique(series, ns, 'dLbls', partName);
        if (deleted(labels, ns, partName)) { throw new GradientFillError(partName, 'chart.text.deleted'); }
        if (target.kind === 'data-labels') { owner = labels; }
        else {
            if (!Number.isInteger(target.point) || target.point < 0 || target.point > 4294967295) {
                throw new GradientFillError(partName, 'chart.text.point');
            }
            const matches: OoxmlElement[] = [];
            for (const child of labels.children) {
                if (child.kind === 'element' && child.namespaceUri === ns && child.localName === 'dLbl' &&
                    unsigned(unique(child, ns, 'idx', partName), partName) === target.point) { matches.push(child); }
            }
            if (matches.length !== 1) { throw new GradientFillError(partName, 'chart.text.label'); }
            owner = arrayAt(matches, 0);
            if (deleted(owner, ns, partName)) { throw new GradientFillError(partName, 'chart.text.deleted'); }
        }
    } else if (target.kind === 'axis-title' || target.kind === 'axis-defaults') {
        if (!Number.isInteger(target.axisId) || target.axisId < 0 || target.axisId > 4294967295) {
            throw new GradientFillError(partName, 'chart.text.axis');
        }
        const plot: OoxmlElement = unique(unique(root, ns, 'chart', partName), ns, 'plotArea', partName);
        const axes: OoxmlElement[] = [];
        for (const child of plot.children) {
            if (child.kind === 'element' && child.namespaceUri === ns &&
                ['catAx', 'valAx', 'dateAx', 'serAx'].indexOf(child.localName) >= 0 &&
                unsigned(unique(child, ns, 'axId', partName), partName) === target.axisId) { axes.push(child); }
        }
        if (axes.length !== 1) { throw new GradientFillError(partName, 'chart.text.axis'); }
        owner = target.kind === 'axis-title' ? unique(arrayAt(axes, 0), ns, 'title', partName) : arrayAt(axes, 0);
    }
    if (!owner) { throw new GradientFillError(partName, 'chart.text.target'); }
    if (lane === 'rich') {
        if (target.kind === 'legend' || target.kind === 'chart-defaults' || target.kind === 'axis-defaults' || target.kind === 'data-labels') {
            throw new GradientFillError(partName, 'chart.text.rich.unsupported');
        }
        const text: OoxmlElement = unique(owner, ns, 'tx', partName);
        if (uniqueOptional(text, ns, 'strRef', partName)) { throw new GradientFillError(partName, 'chart.text.reference'); }
        return unique(text, ns, 'rich', partName);
    }
    const existing: OoxmlElement | undefined = uniqueOptional(owner, ns, 'txPr', partName);
    if (existing) { return existing; }
    const body: OoxmlElement = { kind: 'element', namespaceUri: ns, localName: 'txPr', attributes: [], children:
        ['bodyPr', 'lstStyle', 'p'].map((localName: string): OoxmlElement =>
            ({ kind: 'element', namespaceUri: main, localName, attributes: [], children: [] })) };
    const following: ReadonlyArray<string> = owner.localName === 'chartSpace' ? ['externalData', 'printSettings', 'userShapes', 'extLst'] :
        ['dLblPos', 'showLegendKey', 'showVal', 'showCatName', 'showSerName', 'showPercent', 'showBubbleSize', 'separator',
            'showLeaderLines', 'leaderLines', 'crossAx', 'crosses', 'crossesAt', 'auto', 'lblAlgn', 'lblOffset', 'tickLblSkip',
            'tickMarkSkip', 'noMultiLvlLbl', 'crossBetween', 'majorUnit', 'minorUnit', 'majorTimeUnit', 'minorTimeUnit', 'extLst'];
    insertChartChild(owner, body, following); return body;
}
/** @param {OoxmlElement} parent - Exact owner.
 * @param {string} ns - Exact namespace.
 * @param {string} name - Schema child.
 * @param {string} partName - Diagnostic part.
 * @returns {OoxmlElement | undefined} Unambiguous optional child. */
function uniqueOptional(parent: OoxmlElement, ns: string, name: string, partName: string): OoxmlElement | undefined {
    const matches: OoxmlElement[] = [];
    for (const child of parent.children) {
        if (child.kind === 'element' && child.namespaceUri === ns && child.localName === name) { matches.push(child); }
    }
    if (matches.length > 1) { throw new GradientFillError(partName, 'chart.text.ambiguous'); }
    return matches.length ? arrayAt(matches, 0) : undefined;
}
/** @param {OoxmlElement} parent - Exact owner.
 * @param {string} ns - Exact namespace.
 * @param {string} name - Required child.
 * @param {string} partName - Diagnostic part.
 * @returns {OoxmlElement} Unique required child. */
function unique(parent: OoxmlElement, ns: string, name: string, partName: string): OoxmlElement {
    const child: OoxmlElement | undefined = uniqueOptional(parent, ns, name, partName);
    if (!child) { throw new GradientFillError(partName, 'chart.text.missing'); } return child;
}

/** @param {OoxmlElement} node - Exact unsigned index.
 * @param {string} partName - Diagnostic part.
 * @returns {number} Valid authored uint32 without empty-string coercion. */
function unsigned(node: OoxmlElement, partName: string): number {
    const raw: string | undefined = getAttr(node, '', 'val');
    if (raw === undefined || !/^[ \t\r\n]*[+]?[0-9]+[ \t\r\n]*$/.test(raw) || Number(raw) > 4294967295) {
        throw new GradientFillError(partName, 'chart.text.identity');
    }
    return Number(raw);
}
/** @param {OoxmlElement} owner - Exact label owner.
 * @param {string} ns - Chart namespace.
 * @param {string} partName - Diagnostic part.
 * @returns {boolean} Actual CT_Boolean delete state; absent val defaults true. */
function deleted(owner: OoxmlElement, ns: string, partName: string): boolean {
    const node: OoxmlElement | undefined = uniqueOptional(owner, ns, 'delete', partName);
    if (!node) { return false; }
    const raw: string | undefined = getAttr(node, '', 'val');
    if (raw === undefined || raw === '1' || raw === 'true') { return true; }
    if (raw === '0' || raw === 'false') {
        if (node.attributes.some((attribute: OoxmlAttribute): boolean => attribute.namespaceUri !== '' || attribute.localName !== 'val') ||
            node.children.some((child: OoxmlElement | OoxmlText): boolean => child.kind === 'element' || child.text.trim() !== '')) {
            throw new GradientFillError(partName, 'chart.text.delete.metadata');
        }
        asMutable(owner).children = owner.children.filter((child: OoxmlElement | OoxmlText): boolean => child !== node); return false;
    }
    throw new GradientFillError(partName, 'chart.text.delete');
}

/** @param {OoxmlElement} root - Actual classic-chart root.
 * @param {boolean} category - Primary category or value axis.
 * @param {string} partName - Diagnostic part.
 * @returns {string | undefined} Unambiguous actual axis-title identity for explicit engine text-color intent.
 * @internal */
export function primaryChartTitleTextKey(root: OoxmlElement, category: boolean, partName: string): string | undefined {
    const chart: OoxmlElement | undefined = uniqueOptional(root, root.namespaceUri, 'chart', partName);
    const plot: OoxmlElement | undefined = chart && uniqueOptional(chart, root.namespaceUri, 'plotArea', partName);
    if (!plot) { return undefined; }
    const axes: OoxmlElement[] = [];
    for (const node of plot.children) {
        if (node.kind === 'element' && node.namespaceUri === root.namespaceUri &&
            (category ? node.localName === 'catAx' || node.localName === 'dateAx' : node.localName === 'valAx')) { axes.push(node); }
    }
    if (axes.length > 1) { throw new GradientFillError(partName, 'chart.text.axis.primary.ambiguous'); }
    if (!axes.length) { return undefined; }
    return 'axis-title:' + unsigned(unique(arrayAt(axes, 0), root.namespaceUri, 'axId', partName), partName);
}
