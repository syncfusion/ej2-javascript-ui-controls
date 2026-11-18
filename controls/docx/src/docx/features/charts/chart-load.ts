/**
 * Load path: turns an existing chart drawing back into a live {@link Chart}.
 *
 * `w:drawing` runs whose `a:graphicData` is a chart are claimed by a run-leaf
 * handler (so they are no longer opaque) and, after the main document is
 * loaded, rebuilt from `word/charts/chartN.xml` plus the embedded workbook.
 * Charts whose parts cannot be resolved stay as the preserved drawing.
 *
 * @private
 */
import { ownGet } from '../../core/compat/object-compat';
import { parseChartPart } from './chart-merge';
import { OpenXmlElement, parseXml } from '../../core/xml/index';
import { OpcPackage, partByName, relationshipsForPart, PackagePart } from '../../core/opc/package';
import { PartName, resolveInternalTarget } from '../../core/opc/part-name';
import { readZip } from '../../core/zip/index';
import { FeatureRunLeaf } from '../document/feature-run-leaf';
import { emuToPoint } from '../document/length';
import { Chart } from './chart';
import { LoadedChartPart } from './chart-merge';
import { createChartBackendStateFromParsed } from './backend-adapter';
import { ChartCell } from './minimal-workbook';
import { Chart as XlsxChart, exportChartPart, parseOfficeChart, setChartDataSource } from '@syncfusion/ej2-xlsx';
import { ChartBackendState } from './backend-state';
import { OpcRelationship } from '../../core/opc/relationships';

const A_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const C_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
const C_NS_STRICT: string = 'http://purl.oclc.org/ooxml/drawingml/chart';
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const R_NS_STRICT: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships';
const WP_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';

/**
 * Preserved chart drawing run child; round-trips unchanged until replaced by a live chart.
 *
 * @private
 */
export class ChartRunLeaf implements FeatureRunLeaf {
    readonly xml: OpenXmlElement;
    constructor(xml: OpenXmlElement) {
        this.xml = xml;
    }
    toOpenXml(): OpenXmlElement {
        return this.xml;
    }
}

function find(el: OpenXmlElement, ns: string[], local: string): OpenXmlElement | undefined {
    for (const child of el.children) {
        if (child.kind !== 'element') {
            continue;
        }
        if (child.localName === local && ns.indexOf(child.namespaceUri) >= 0) {
            return child;
        }
        const nested: OpenXmlElement = find(child, ns, local);
        if (nested !== undefined) {
            return nested;
        }
    }
    return undefined;
}

function attrValue(el: OpenXmlElement, local: string): string | undefined {
    for (const a of el.attributes) {
        if (a.localName === local) {
            return a.value;
        }
    }
    return undefined;
}

function chartReference(drawing: OpenXmlElement): OpenXmlElement | undefined {
    return find(drawing, [C_NS, C_NS_STRICT], 'chart');
}

/**
 * Whether a `w:drawing` hosts a chart graphic.
 *
 * @param {OpenXmlElement} drawing - The drawing.
 * @returns {ChartRunLeaf | undefined} The result.
 * @private
 */
export function parseChartDrawing(drawing: OpenXmlElement): ChartRunLeaf | undefined {
    const data: OpenXmlElement = find(drawing, [A_NS], 'graphicData');
    if (data === undefined) {
        return undefined;
    }
    const uri: string = attrValue(data, 'uri');
    if (uri !== C_NS && uri !== C_NS_STRICT) {
        return undefined;
    }
    return chartReference(drawing) === undefined ? undefined : new ChartRunLeaf(drawing);
}

function unescapeXml(text: string): string {
    return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
}

function columnNumber(letters: string): number {
    let n: number = 0;
    for (let i: number = 0; i < letters.length; i++) {
        n = n * 26 + (letters.charCodeAt(i) - 64);
    }
    return n;
}

const utf8: TextDecoder = new TextDecoder('utf-8');

/**
 * Read cell values from the first worksheet of an embedded workbook.
 *
 * @param {Uint8Array} bytes - The bytes.
 * @returns {ChartCell[]} The result.
 * @private
 */
export function readWorkbookCells(bytes: Uint8Array): ChartCell[] {
    const files: { [name: string]: Uint8Array } = {};
    for (const entry of readZip(bytes)) {
        files[entry.name] = entry.data;
    }
    const text: (name: string) => string = (name: string): string | undefined =>
        ownGet(files, name) === undefined ? undefined : utf8.decode(ownGet(files, name));
    const shared: string[] = [];
    const sst: string = text('xl/sharedStrings.xml');
    if (sst !== undefined) {
        const re: RegExp = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
        let m: RegExpExecArray | null = re.exec(sst);
        for (; m !== null; m = re.exec(sst)) {
            let s: string = '';
            const tre: RegExp = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
            let t: RegExpExecArray | null = tre.exec(m[1]);
            for (; t !== null; t = tre.exec(m[1])) {
                s += unescapeXml(t[1]);
            }
            shared.push(s);
        }
    }
    let sheet: string = text('xl/worksheets/sheet1.xml');
    if (sheet === undefined) {
        const first: string = Object.keys(files).filter((n: string) => /^xl\/worksheets\/[^/]+\.xml$/.test(n)).sort()[0];
        sheet = first === undefined ? undefined : text(first);
    }
    const cells: ChartCell[] = [];
    if (sheet === undefined) {
        return cells;
    }
    const cre: RegExp = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
    let c: RegExpExecArray | null = cre.exec(sheet);
    for (; c !== null; c = cre.exec(sheet)) {
        const ref: RegExpExecArray = /\br="([A-Z]+)(\d+)"/.exec(c[1]);
        if (ref === null || c[2] === undefined) {
            continue;
        }
        const type: RegExpExecArray = /\bt="(\w+)"/.exec(c[1]);
        const kind: string = type === null ? 'n' : type[1];
        const v: RegExpExecArray = /<v>([\s\S]*?)<\/v>/.exec(c[2]);
        let value: string | number | boolean | undefined;
        if (kind === 'inlineStr') {
            const t: RegExpExecArray = /<t\b[^>]*>([\s\S]*?)<\/t>/.exec(c[2]);
            value = t === null ? undefined : unescapeXml(t[1]);
        } else if (v !== null && kind === 's') {
            value = shared[parseInt(v[1], 10)];
        } else if (v !== null && kind === 'b') {
            value = v[1] === '1';
        } else if (v !== null && (kind === 'str' || kind === 'e')) {
            value = unescapeXml(v[1]);
        } else if (v !== null) {
            const num: number = Number(v[1]);
            value = isNaN(num) ? unescapeXml(v[1]) : num;
        }
        if (value !== undefined) {
            cells.push({ row: parseInt(ref[2], 10), column: columnNumber(ref[1]), value });
        }
    }
    return cells;
}

/**
 * Rebuild a live chart from a preserved drawing, or `undefined` when its parts are unavailable.
 *
 * @param {ChartRunLeaf} leaf - The leaf.
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} mainPartName - The main part name.
 * @returns {Chart | undefined} The result.
 * @private
 */
export function loadChart(leaf: ChartRunLeaf, pkg: OpcPackage, mainPartName: PartName): Chart | undefined {
    const ref: OpenXmlElement = chartReference(leaf.xml);
    if (ref === undefined) {
        return undefined;
    }
    let relId: string | undefined;
    for (const a of ref.attributes) {
        if (a.localName === 'id' && (a.namespaceUri === R_NS || a.namespaceUri === R_NS_STRICT)) {
            relId = a.value;
        }
    }
    const rel: OpcRelationship =
        relId === undefined ? undefined : relationshipsForPart(pkg, mainPartName).items.find((r: OpcRelationship) => r.id === relId);
    if (rel === undefined || rel.targetMode === 'External') {
        return undefined;
    }
    const chartPartName: PartName = resolveInternalTarget(rel.target, mainPartName);
    const part: PackagePart = partByName(pkg, chartPartName);
    const match: RegExpExecArray = /^\/word\/charts\/chart(\d+)\.xml$/.exec(chartPartName);
    if (part === undefined || match === null) {
        return undefined;
    }

    const chartXml: string = utf8.decode(part.data);
    const handle: XlsxChart = parseOfficeChart(chartXml, { chartPartName });
    if (handle === undefined) {
        return undefined;
    }
    restoreFrameFills(handle, chartXml);

    let cells: ChartCell[] = [];
    const embedRel: OpcRelationship = relationshipsForPart(pkg, chartPartName).items.find((r: OpcRelationship) => /\/package$/.test(r.type) && r.targetMode !== 'External');
    if (embedRel !== undefined) {
        const embed: PackagePart = partByName(pkg, resolveInternalTarget(embedRel.target, chartPartName));
        if (embed !== undefined) {
            try {
                cells = readWorkbookCells(embed.data);
            } catch (e) {
                cells = [];
            }
        }
    }

    const extent: OpenXmlElement = find(leaf.xml, [WP_NS], 'extent');
    const docPr: OpenXmlElement = find(leaf.xml, [WP_NS], 'docPr');
    const cx: number = extent === undefined ? NaN : Number(attrValue(extent, 'cx'));
    const cy: number = extent === undefined ? NaN : Number(attrValue(extent, 'cy'));
    const width: number = cx > 0 ? emuToPoint(cx) : 432;
    const height: number = cy > 0 ? emuToPoint(cy) : 288;
    const docPrId: number = docPr === undefined ? 0 : parseInt(attrValue(docPr, 'id') || '0', 10);
    const name: string = docPr === undefined ? 'Chart' : (attrValue(docPr, 'name') || 'Chart');

    const state: ChartBackendState = createChartBackendStateFromParsed(handle, cells);
    const chart: Chart = new Chart(rel.id, width, height, name, docPrId, state);
    chart.loadedPart = captureLoadedPart(
        chartXml,
        handle,
        embedRel === undefined ? undefined : embedRel.id,
        embedRel === undefined ? undefined : embedRel.target
    );
    chart.adoptLoadedState(cells);
    chart.assignPackageIdentity(rel.id, docPrId, parseInt(match[1], 10));
    return chart;
}

/**
 *  Snapshot the original part and a baseline export of the model exactly as loaded.
 *
 * @param {string} xml - The xml.
 * @param {XlsxChart} handle - The handle.
 * @param {string | undefined} embedRelId - The embed rel id.
 * @param {string | undefined} embedTarget - The embed target.
 * @returns {LoadedChartPart | undefined} The result.
 */
function captureLoadedPart(
    xml: string,
    handle: XlsxChart,
    embedRelId: string | undefined,
    embedTarget: string | undefined
): LoadedChartPart | undefined {
    try {
        setChartDataSource(handle, { kind: 'embedded', relationshipId: embedRelId === undefined ? 'rId1' : embedRelId });
        const target: string = embedTarget === undefined ? undefined : '../embeddings/' + embedTarget.replace(/^(\.\.\/|\/word\/)?(embeddings\/)?/, '');
        const baseline: string = exportChartPart(handle, target === undefined ? undefined : { embeddedTarget: target }).xml;
        return { original: parseChartPart(xml), baseline: parseChartPart(baseline) };
    } catch (e) {
        return undefined;
    }
}

interface FrameTarget {
    fill: FillTarget;
    line?: { weightPt: number | undefined };
}

interface FillTarget {
    type: string;
    foreColor: string | undefined;
}

/**
 * ej2-xlsx treats an `a:noFill` inside the frame border (`a:ln`) as "no fill" and
 * drops a sibling `a:solidFill`. Re-read the chart-area / plot-area fill with the
 * border element removed so the real fill survives open and save.
 *
 * @param {object} handle - The handle.
 * @param {string} xml - The xml.
 * @returns {void} Nothing is returned.
 */
function restoreFrameFills(handle: object, xml: string): void {
    const frames: { chartArea?: FrameTarget; plotArea?: FrameTarget; } = handle as { chartArea?: FrameTarget; plotArea?: FrameTarget };
    const chartSpace: RegExpExecArray = /<\/c:chart>\s*<c:spPr\b[^>]*>([\s\S]*?)<\/c:spPr>/.exec(xml);
    const plot: RegExpExecArray = plotAreaOwnSpPr(xml);
    applyFill(frames.chartArea, chartSpace === null ? undefined : chartSpace[1]);
    applyFill(frames.plotArea, plot === null ? undefined : plot[1]);
}

/**
 * Finds the `c:spPr` that is the last child of `c:plotArea` (the plot area's own fill), if any.
 *
 * @param {string} xml - The chart part XML.
 * @returns {RegExpExecArray} Match whose group 1 is the spPr content, or null.
 */
function plotAreaOwnSpPr(xml: string): RegExpExecArray {
    const end: number = xml.lastIndexOf('</c:plotArea>');
    if (end < 0) {
        return null;
    }
    const before: string = xml.slice(0, end).replace(/\s+$/, '');
    const closeTag: string = '</c:spPr>';
    if (before.slice(-closeTag.length) !== closeTag) {
        return null;
    }
    const start: number = before.lastIndexOf('<c:spPr');
    if (start < 0 || xml.lastIndexOf('<c:plotArea', start) < 0) {
        return null;
    }
    return /^<c:spPr\b[^>]*>([\s\S]*)<\/c:spPr>$/.exec(before.slice(start));
}

function applyFill(frame: FrameTarget | undefined, spPr: string | undefined): void {
    if (frame === undefined || spPr === undefined) {
        return;
    }
    if (frame.line !== undefined && /<a:ln\b[^>]*>\s*<a:noFill\s*\/>\s*<\/a:ln>/.test(spPr)) {
        frame.line.weightPt = 0;
    }
    const withoutLine: string = spPr.replace(/<a:ln\b[\s\S]*?<\/a:ln>|<a:ln\b[^>]*\/>/g, '');
    const color: RegExpExecArray = /<a:solidFill>\s*<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{6})"/.exec(withoutLine);
    if (color !== null) {
        frame.fill.type = 'solid';
        frame.fill.foreColor = color[1].toUpperCase();
    }
}
