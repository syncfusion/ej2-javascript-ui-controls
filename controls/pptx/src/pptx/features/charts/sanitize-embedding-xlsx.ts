/**
 * Sanitize chart-embedding XLSX bytes after ej2-xlsx `Workbook.save()`.
 *
 * @remarks
 * PPT chart spaces dual-write category/value **cells** into an embedded workbook
 * and keep formulas on the **presentation** chart part (`c:f` → cells). The host
 * path still calls worksheet `addChart` so `exportChartPart` can emit type/series
 * markup, then `Workbook.save()` also serializes nested DrawingML chart parts
 * inside the XLSX (e.g. `xl/charts/chartN.xml` with `c:externalData` and empty
 * `chartN.xml.rels`). PowerPoint treats those nested dangling `r:id` targets as
 * a broken linked file and prompts to embed instead of link.
 *
 * This pass keeps sheet cell values and workbook structure required by dual-write,
 * and drops nested chart/drawing package graph pieces that are not needed for the
 * PPT embedding contract. It does not invent OOXML; it only removes parts whose
 * presence was observed to break Office open of library-generated PPTX.
 *
 * Citations: ECMA-376 chart `c:externalData` + EMBEDDED_PACKAGE; ADR 2026-09-18
 * (PPT chart part is authoritative XML; embedding holds cells); package forensics
 * on dual-write save (empty nested chart rels).
 *
 * @packageDocumentation
 */
import { writeZip } from '../../core/package/zip-writer';
import { ChartsError, partNameOptions } from './errors';
import { openNestedXlsxPackage, NestedPackageOpenResult } from './nested-package-security';
import { stringIncludes, arrayAt } from '../../core/util/es5-compat';
const utf8Dec: TextDecoder = new TextDecoder('utf-8');
const utf8Enc: TextEncoder = new TextEncoder();
/** Content types package part (absolute OPC name after zip-reader normalize). */
const CONTENT_TYPES_PART: string = '/[Content_Types].xml';
/**
 * True when a nested XLSX part is a DrawingML chart / chart drawing graph piece
 * that must not ship inside PPT embeddings produced by this library.
 *
 * @param {string} partName - The partName value.
 * @returns {boolean} The result.
 */
function isNestedChartGraphPart(partName: string): boolean {
    const n: string = partName.toLowerCase();
    if (stringIncludes(n, '/xl/charts/')) {
        return true;
    }
    if (stringIncludes(n, '/xl/drawings/')) {
        return true;
    }
    if (stringIncludes(n, '/xl/chartsheets/')) {
        return true;
    }
    // Loose chart style / color parts sometimes sit under xl/ without charts/ prefix.
    if (stringIncludes(n, '/xl/chartstyles/') || stringIncludes(n, '/xl/chartcolors/')) {
        return true;
    }
    return false;
}
/**
 * True when a relationship Target (resolved or as written) points at chart/drawing.
 *
 * @param {string} target - The target value.
 * @returns {boolean} The result.
 */
function isChartOrDrawingRelTarget(target: string): boolean {
    const t: string = target.replace(/\\/g, '/').toLowerCase();
    return (stringIncludes(t, 'charts/') ||
        stringIncludes(t, 'drawings/') ||
        stringIncludes(t, 'chartsheets/') ||
        stringIncludes(t, 'chartstyles/') ||
        stringIncludes(t, 'chartcolors/'));
}
/**
 * Strip Relationship elements whose Target is a nested chart/drawing part.
 *
 * Uses conservative string surgery on well-formed OPC rels XML emitted by the
 * host save path (single-level Relationship empty elements or pairs).
 *
 * @param {string} xml - The xml value.
 * @returns {string} The result.
 */
function stripChartDrawingRelationshipsXml(xml: string): string {
    // Match <Relationship ... /> or <Relationship ...></Relationship>
    return xml.replace(/<Relationship\b[^>]*\/?>/gi, (tag: string) => {
        const targetMatch: RegExpExecArray = /\bTarget\s*=\s*(["'])(.*?)\1/i.exec(tag);
        if (targetMatch === null) {
            return tag;
        }
        const target: string = (targetMatch[2] !== null && targetMatch[2] !== undefined ? targetMatch[2] : '');
        return isChartOrDrawingRelTarget(target) ? '' : tag;
    });
}
/**
 * Remove Override entries that only apply to dropped chart graph parts.
 *
 * @param {string} xml - The xml value.
 * @returns {string} The result.
 */
function stripChartDrawingContentTypesXml(xml: string): string {
    return xml.replace(/<Override\b[^>]*\/?>/gi, (tag: string) => {
        const pn: RegExpExecArray = /\bPartName\s*=\s*(["'])(.*?)\1/i.exec(tag);
        if (pn !== null) {
            const partName: string = ((pn[2] !== null && pn[2] !== undefined ? pn[2] : '')).toLowerCase();
            if (stringIncludes(partName, '/xl/charts/') ||
                stringIncludes(partName, '/xl/drawings/') ||
                stringIncludes(partName, '/xl/chartsheets/') ||
                stringIncludes(partName, '/xl/chartstyles/') ||
                stringIncludes(partName, '/xl/chartcolors/')) {
                return '';
            }
        }
        const ct: RegExpExecArray = /\bContentType\s*=\s*(["'])(.*?)\1/i.exec(tag);
        if (ct !== null) {
            const contentType: string = ((ct[2] !== null && ct[2] !== undefined ? ct[2] : '')).toLowerCase();
            if (stringIncludes(contentType, 'drawingml.chart') ||
                stringIncludes(contentType, 'spreadsheetml.chartsheet') ||
                stringIncludes(contentType, 'vnd.openxmlformats-officedocument.drawing+xml')) {
                return '';
            }
        }
        return tag;
    });
}
/**
 * Drop worksheet drawing anchors after nested drawings/charts are removed.
 *
 * Host `Workbook.save()` leaves `<drawing r:id="rIdN"/>` on the sheet while the
 * matching Relationship Target pointed at `../drawings/drawing1.xml`. Once that
 * Relationship is stripped, the orphan `r:id` is another broken-link surface for
 * Office when the XLSX is opened from PPT embeddings. Sheet cell data is kept.
 *
 * @param {string} xml - The xml value.
 * @returns {string} The result.
 */
function stripWorksheetDrawingElementsXml(xml: string): string {
    return xml
        .replace(/<drawing\b[^>]*\/>/gi, '')
        .replace(/<drawing\b[^>]*>[\s\S]*?<\/drawing>/gi, '');
}
/**
 *
 * @param {string} partName - The partName value.
 * @returns {boolean} The result.
 */
function isWorksheetPartName(partName: string): boolean {
    const n: string = partName.toLowerCase();
    return stringIncludes(n, '/xl/worksheets/') && n.endsWith('.xml') && !stringIncludes(n, '.rels');
}
/**
 * Sanitize embedding workbook bytes after host `Workbook.save()`.
 *
 * @internal
 * @param {Uint8Array} xlsxBytes - Raw XLSX from ej2-xlsx save (may contain nested charts).
 * @param {*} options - The options value.
 * @param {string} [options.partName] - Part name for error context.
 * @returns {*} Rewritten XLSX without nested chart/drawing graph parts.
 */
export async function sanitizeChartEmbeddingXlsx(xlsxBytes: Uint8Array, options: {
    readonly partName?: string;
} = {}): Promise<Uint8Array> {
    const opened: NestedPackageOpenResult = await openNestedXlsxPackage(xlsxBytes, undefined, partNameOptions(options.partName));
    const next: Map<string, Uint8Array> = new Map<string, Uint8Array>();
    let droppedChartGraph: boolean = false;
    const openedPartEntries: Array<[string, Uint8Array]> = Array.from(opened.parts.entries());
    for (let i: number = 0; i < openedPartEntries.length; i++) {
        const name: string = arrayAt(openedPartEntries, i)[0];
        const data: Uint8Array = arrayAt(openedPartEntries, i)[1];
        if (isNestedChartGraphPart(name)) {
            droppedChartGraph = true;
            continue;
        }
        const lower: string = name.toLowerCase();
        if (lower.endsWith('.rels')) {
            const xml: string = utf8Dec.decode(data);
            const cleaned: string = stripChartDrawingRelationshipsXml(xml);
            if (cleaned !== xml) {
                droppedChartGraph = true;
            }
            next.set(name, utf8Enc.encode(cleaned));
            continue;
        }
        if (name === CONTENT_TYPES_PART || lower.endsWith('/[content_types].xml')) {
            const xml: string = utf8Dec.decode(data);
            const cleaned: string = stripChartDrawingContentTypesXml(xml);
            if (cleaned !== xml) {
                droppedChartGraph = true;
            }
            next.set(name, utf8Enc.encode(cleaned));
            continue;
        }
        if (isWorksheetPartName(name)) {
            const xml: string = utf8Dec.decode(data);
            const cleaned: string = stripWorksheetDrawingElementsXml(xml);
            if (cleaned !== xml) {
                droppedChartGraph = true;
            }
            next.set(name, utf8Enc.encode(cleaned));
            continue;
        }
        next.set(name, data);

    }
    if (!next.has(CONTENT_TYPES_PART) && opened.parts.has(CONTENT_TYPES_PART)) {
        throw new ChartsError('sanitizeChartEmbeddingXlsx lost [Content_Types].xml', partNameOptions(options.partName));
    }
    // Always rewrite so store-method ZIP is deterministic; even when nothing
    // dropped, round-trip through limits-checked parts is acceptable.
    void droppedChartGraph;
    return writeZip(next);
}
