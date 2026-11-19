/**
 * Save-time packaging of charts: chart part, embedded workbook, relationships,
 * content types. Mirrors the ej2-powerpoint-library flow (`exportChartPart` +
 * embedded `.xlsx` + `c:externalData`).
 *
 * @private
 */
import { mergeLoadedChart } from './chart-merge';
import { Chart as XlsxChart, exportChartPart, setChartDataSource } from '@syncfusion/ej2-xlsx';
import { OpcPackage, partByName, relationshipsForPart, withAddedPart, withContentTypeOverride, withPartRelationships, withRemovedPart, withReplacedPart } from '../../core/opc/package';
import { OpcRelationship, allocateRelationshipId, relationshipId, relationshipsWith, Relationships } from '../../core/opc/relationships';
import { partName, PartName } from '../../core/opc/part-name';
import { OpenXmlChild, OpenXmlElement, parseXml, serializeXml } from '../../core/xml/index';
import { FeaturePackageLevelPart } from '../document/feature-package-level-part';
import { Chart } from './chart';
import { CHART_SHEET_NAME, columnName, createChartWorkbookBytes } from './minimal-workbook';

const CHART_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart';
const PACKAGE_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/package';
const CHART_CT: string = 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml';
const XLSX_CT: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function xmlEscape(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseCol(letters: string): number {
    let n: number = 0;
    for (let i: number = 0; i < letters.length; i++) {
        n = n * 26 + (letters.charCodeAt(i) - 64);
    }
    return n;
}

function expandRange(formula: string): Array<{ row: number; column: number }> {
    const plain: string = formula.replace(/\$/g, '').replace(/^.*!/, '');
    const m: RegExpExecArray = /^([A-Z]+)(\d+)$/.exec(plain) || /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(plain);
    if (m === null) {
        return [];
    }
    const c1: number = parseCol(m[1]);
    const r1: number = parseInt(m[2], 10);
    const c2: number = m[3] !== undefined ? parseCol(m[3]) : c1;
    const r2: number = m[4] !== undefined ? parseInt(m[4], 10) : r1;
    const out: Array<{ row: number; column: number }> = [];
    for (let r: number = r1; r <= r2; r++) {
        for (let c: number = c1; c <= c2; c++) {
            out.push({ row: r, column: c });
        }
    }
    return out;
}

function qualify(formula: string): string {
    const plain: string = formula.replace(/^.*!/, '').replace(/\$/g, '');
    const parts: string[] = plain.split(':').map((p: string) => {
        const m: RegExpExecArray = /^([A-Z]+)(\d+)$/.exec(p);
        return m === null ? p : '$' + m[1] + '$' + m[2];
    });
    return CHART_SHEET_NAME + '!' + parts.join(':');
}

/**
 * New charts follow the DocIO layout: no `c:style` (Word then uses its classic look with
 * dark series and gridlines instead of the themed one) and an explicit `c:date1904`.
 *
 * @param {string} xml - The xml.
 * @returns {string} The result.
 */
function classicNewChart(xml: string): string {
    const root: OpenXmlElement = parseXml(xml);
    const rest: OpenXmlChild[] = root.children.filter((c: OpenXmlChild) => !(c.kind === 'element' && (c.localName === 'style' || c.localName === 'date1904')));
    const date1904: OpenXmlElement = { kind: 'element', namespaceUri: root.namespaceUri, localName: 'date1904', prefix: root.prefix, attributes: [{ namespaceUri: '', localName: 'val', prefix: '', value: '0' }], namespaceDeclarations: [], children: [] };
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + serializeXml({ ...root, children: ([date1904] as OpenXmlChild[]).concat(rest) });
}

/**
 * New charts get thin default series lines and gridlines instead of heavy theme widths.
 * Without an explicit width, Word uses the theme line width (2 pt), making lines too thick.
 * This ensures consistent thin rendering.
 *
 * @param {string} xml - The xml.
 * @returns {string} The result.
 */
function thinDefaultLines(xml: string): string {
    let out: string = xml.replace(/<c:majorGridlines\/>/g, '<c:majorGridlines><c:spPr><a:ln w="9525"/></c:spPr></c:majorGridlines>')
        .replace(/<c:minorGridlines\/>/g, '<c:minorGridlines><c:spPr><a:ln w="9525"/></c:spPr></c:minorGridlines>');
    out = out.replace(/<c:lineChart>[\s\S]*?<\/c:lineChart>/g, (plot: string) => plot.replace(/<c:ser>[\s\S]*?<\/c:ser>/g, (ser: string) => {
        if (/<c:spPr>/.test(ser.replace(/<c:marker>[\s\S]*?<\/c:marker>/, ''))) { return ser; }
        return ser.replace(/(<\/c:tx>)/, '$1<c:spPr><a:ln w="28575"/></c:spPr>');
    }));
    return out;
}

/**
 *  Add the sheet-qualified formula and value caches ej2-xlsx leaves out.
 *
 * @param {string} xml - The xml.
 * @param {Chart} chart - The chart.
 * @returns {string} The result.
 */
function enrichCaches(xml: string, chart: Chart): string {
    const lookup: { [key: string]: string | number | boolean } = {};
    for (const cell of chart.chartData.cellEntries()) {
        lookup[columnName(cell.column) + cell.row] = cell.value;
    }
    const build: (formula: string, numeric: boolean) => string = (formula: string, numeric: boolean): string => {
        const cells: { row: number; column: number; }[] = expandRange(formula);
        let pts: string = '';
        let count: number = 0;
        cells.forEach((c: { row: number; column: number; }, idx: number) => {
            const v: string | number | boolean = lookup[columnName(c.column) + c.row];
            if (v === undefined) {
                return;
            }
            count = idx + 1;
            pts += '<c:pt idx="' + idx + '"><c:v>' + xmlEscape(String(v)) + '</c:v></c:pt>';
        });
        const fmt: string = numeric ? '<c:formatCode>General</c:formatCode>' : '';
        const tag: string = numeric ? 'numCache' : 'strCache';
        return '<c:f>' + xmlEscape(qualify(formula)) + '</c:f><c:' + tag + '>' + fmt + '<c:ptCount val="' + Math.max(count, cells.length) + '"/>' + pts + '</c:' + tag + '>';
    };
    const hasData: (formula: string) => boolean = (formula: string): boolean =>
        expandRange(formula).some((c: { row: number; column: number }) => lookup[columnName(c.column) + c.row] !== undefined);
    // Without worksheet data for the range, keep the cache already in the part instead of emptying it.
    const keepOrBuild: (whole: string, f: string, numeric: boolean) => string = (whole: string, f: string, numeric: boolean): string => {
        if (!hasData(f)) {
            return whole;
        }
        const tag: string = numeric ? 'numRef' : 'strRef';
        return '<c:' + tag + '>' + build(f, numeric) + '</c:' + tag + '>';
    };
    const rewriteRef: (whole: string, kind: 'num' | 'str') => string = (whole: string, kind: 'num' | 'str'): string => {
        const head: RegExpExecArray = /^<c:(?:num|str)Ref>\s*<c:f>([^<]*)<\/c:f>/.exec(whole);
        if (head === null) {
            return whole;
        }
        const closeRef: string = '</c:' + kind + 'Ref>';
        const cacheOpen: string = '<c:' + kind + 'Cache>';
        const cacheClose: string = '</c:' + kind + 'Cache>';
        const rest: string = whole.slice(head[0].length, whole.length - closeRef.length).trim();
        const hasSingleCache: boolean = rest.indexOf(cacheOpen) === 0 && rest.indexOf(cacheClose) === rest.length - cacheClose.length;
        if (rest !== '' && !hasSingleCache) {
            return whole;
        }
        return keepOrBuild(whole, head[1], kind === 'num');
    };
    let out: string = xml.replace(/<a:ln w="0"\/>/g, '<a:ln><a:noFill/></a:ln>').replace(/<c:numRef>[\s\S]*?<\/c:numRef>/g, (m: string) => rewriteRef(m, 'num'));
    out = out.replace(/<c:strRef>[\s\S]*?<\/c:strRef>/g, (m: string) => rewriteRef(m, 'str'));
    return out;
}

/**
 * A newly created chart with no explicit title shows its series name when it has
 * exactly one series (Word / DocIO behaviour). An empty title is otherwise hidden.
 *
 * @param {Chart} chart - The chart.
 * @returns {void} Nothing is returned.
 */
function applyAutomaticTitle(chart: Chart): void {
    if (!chart.autoTitle) {
        return;
    }
    const backend: XlsxChart = chart.backendState.backendChart;
    if (backend.series.length === 1 && backend.series[0].title) {
        backend.chartTitle = backend.series[0].title;
    } else {
        backend.hasTitle = false;
    }
}

/**
 * Package-level feature part that writes every chart in the document.
 *
 * @private
 */
export class ChartPackagePart implements FeaturePackageLevelPart {
    private readonly charts: ReadonlyArray<Chart>;
    private readonly mainPartName: PartName;
    private readonly firstDocPrId: number;

    private readonly removedIndexes: ReadonlyArray<number>;

    constructor(charts: ReadonlyArray<Chart>, mainPartName: PartName, firstDocPrId: number, removedIndexes: ReadonlyArray<number> = []) {
        this.removedIndexes = removedIndexes;
        this.charts = charts;
        this.mainPartName = mainPartName;
        this.firstDocPrId = firstDocPrId;
    }

    isDirty(): boolean {
        return this.charts.length > 0 || this.removedIndexes.length > 0;
    }

    /**
     *  Drop the parts of charts that were loaded from the file and then deleted.
     *
     * @param {OpcPackage} pkg - The pkg.
     * @returns {OpcPackage} The result.
     */
    private removeDeletedCharts(pkg: OpcPackage): OpcPackage {
        let next: OpcPackage = pkg;
        for (const n of this.removedIndexes) {
            const chartPart: PartName = partName('/word/charts/chart' + n + '.xml');
            if (partByName(next, chartPart) === undefined) {
                continue;
            }
            for (const rel of relationshipsForPart(next, chartPart).items) {
                if (rel.targetMode === 'External' || !/\/package$/.test(rel.type)) {
                    continue;
                }
                const embed: PartName = partName('/word/' + rel.target.replace(/^(\.\.\/|\/word\/)/, ''));
                next = withRemovedPart(next, embed);
            }
            next = withRemovedPart(next, chartPart);
            const mainRels: Relationships = relationshipsForPart(next, this.mainPartName);
            const target: string = 'charts/chart' + n + '.xml';
            const kept: OpcRelationship[] = mainRels.items.filter(
                (r: OpcRelationship) => !(r.type === CHART_REL_TYPE && r.target === target)
            );
            if (kept.length !== mainRels.items.length) {
                next = withPartRelationships(next, this.mainPartName, relationshipsWith(kept, mainRels.opaque));
            }
        }
        return next;
    }

    applyToPackage(pkg: OpcPackage): OpcPackage {
        let next: OpcPackage = this.removeDeletedCharts(pkg);
        let docPr: number = this.firstDocPrId;
        let index: number = 0;
        const usedIndexes: Set<number> = new Set<number>();
        for (const chart of this.charts) {
            if (chart.packageIndex !== undefined) {
                usedIndexes.add(chart.packageIndex);
            }
        }
        for (const chart of this.charts) {
            let n: number = chart.packageIndex;
            const isNew: boolean = n === undefined;
            if (n === undefined) {
                do {
                    index += 1;
                } while (usedIndexes.has(index));
                n = index;
                usedIndexes.add(n);
            }
            const chartPart: PartName = partName('/word/charts/chart' + n + '.xml');
            const chartExists: boolean = partByName(next, chartPart) !== undefined;
            const existingChartRels: Relationships = chartExists ? relationshipsForPart(next, chartPart) : undefined;
            const existingEmbedRel: OpcRelationship = existingChartRels === undefined ? undefined
                : existingChartRels.items.find((r: OpcRelationship) => /\/package$/.test(r.type) && r.targetMode !== 'External');
            let embedName: string = 'Microsoft_Excel_Worksheet' + n + '.xlsx';
            let embedRelId: string = 'rId1';
            if (existingEmbedRel !== undefined) {
                embedRelId = existingEmbedRel.id;
                embedName = existingEmbedRel.target.replace(/^(\.\.\/|\/word\/)?(embeddings\/)?/, '');
            }
            const embedPart: PartName = partName('/word/embeddings/' + embedName);

            applyAutomaticTitle(chart);
            const handle: XlsxChart = chart.backendState.backendChart;
            setChartDataSource(handle, { kind: 'embedded', relationshipId: embedRelId });
            const exported: ReturnType<typeof exportChartPart> = exportChartPart(handle, { embeddedTarget: '../embeddings/' + embedName });
            const merged: string =
                chart.loadedPart === undefined ? classicNewChart(exported.xml) : mergeLoadedChart(chart.loadedPart, exported.xml);
            let xml: string = enrichCaches(merged, chart);
            if (chart.loadedPart === undefined) {
                xml = thinDefaultLines(xml);
            }
            const encoder: TextEncoder = new TextEncoder();
            const workbookBytes: Uint8Array = createChartWorkbookBytes(chart.chartData.cellEntries());

            if (!chartExists) {
                next = withAddedPart(next, { name: chartPart, contentType: CHART_CT, data: encoder.encode(xml) });
                next = withContentTypeOverride(next, chartPart, CHART_CT);
            } else {
                next = withReplacedPart(next, chartPart, encoder.encode(xml));
            }
            // Cells could not be read from the loaded workbook: keep that workbook rather than overwrite it with an empty one.
            const keepWorkbook: boolean =
                chart.loadedPart !== undefined && chart.chartData.cellEntries().length === 0 && partByName(next, embedPart) !== undefined;
            if (keepWorkbook) {
                // unchanged
            } else if (partByName(next, embedPart) === undefined) {
                next = withAddedPart(next, { name: embedPart, contentType: XLSX_CT, data: workbookBytes });
                next = withContentTypeOverride(next, embedPart, XLSX_CT);
            } else {
                next = withReplacedPart(next, embedPart, workbookBytes);
            }
            if (existingEmbedRel === undefined) {
                const chartRel: OpcRelationship = {
                    id: relationshipId('rId1'),
                    type: PACKAGE_REL_TYPE,
                    target: '../embeddings/' + embedName,
                    extraAttributes: [],
                    children: []
                };
                const others: OpcRelationship[] = existingChartRels === undefined ? [] : existingChartRels.items.filter((r: OpcRelationship) => r.id !== 'rId1');
                next = withPartRelationships(
                    next,
                    chartPart,
                    relationshipsWith([chartRel, ...others], existingChartRels === undefined ? undefined : existingChartRels.opaque)
                );
            }

            const mainRels: Relationships = relationshipsForPart(next, this.mainPartName);
            const target: string = 'charts/chart' + n + '.xml';
            const existing: OpcRelationship = mainRels.items.find((r: OpcRelationship) => r.type === CHART_REL_TYPE && r.target === target);
            let relId: string;
            if (existing !== undefined) {
                relId = existing.id;
            } else {
                relId = allocateRelationshipId(new Set(mainRels.items.map((r: OpcRelationship) => r.id)));
                const rel: OpcRelationship = { id: relationshipId(relId), type: CHART_REL_TYPE, target, extraAttributes: [], children: [] };
                next = withPartRelationships(next, this.mainPartName, relationshipsWith([...mainRels.items, rel], mainRels.opaque));
            }
            chart.assignPackageIdentity(relId, isNew ? docPr++ : chart.docPrId, n);
        }
        return next;
    }
}
