/**
 * Fill classic DrawingML chart `c:numCache` / `c:strCache` from embedding cells.
 *
 * @remarks
 * ej2-xlsx `exportChartPart` emits `c:numRef` / `c:strRef` with only `c:f`.
 * PowerPoint paints from the last-shown caches on the presentation chart part
 * when the embedding is not fully re-bound. Values come from dual-write sheet
 * cells along those formulas — never fabricated points.
 *
 * Citations: ECMA-376 Part 1 §21.2.2.120 `numCache`, §21.2.2.123 `numRef`,
 * §21.2.2.199 `strCache` / `strRef` (CT_NumData / CT_StrData / CT_NumRef);
 * ADR `docs/adr/2026-09-18-chart-edit.md` create path (cache coherent with data).
 *
 * @internal
 */
import { parseSimpleA1Range, readValuesAlongFormula, stripSheetAndDollars } from './chart-data-edit';
import { HostWorksheet } from './xlsx-chart-api';
import { arrayAt } from '../../core/util/es5-compat';
/**
 * Optional sheet name used when normalizing bare A1 formulas (scratch seed uses Sheet1).
 */
export const DEFAULT_CHART_CACHE_SHEET_NAME: string = 'Sheet1';
/**
 * Escape text for XML element content.
 *
 * @param {string} value - The value value.
 * @returns {string} The result.
 */
function escapeXmlText(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
/**
 * Normalize a chart formula to `SheetName!A1:B2` (no `$ `), using default sheet when bare.
 *
 * @param {string} formula - The formula value.
 * @param {string} sheetName - The sheetName value.
 * @returns {string} The result.
 */
export function qualifyChartFormula(formula: string, sheetName: string = DEFAULT_CHART_CACHE_SHEET_NAME): string {
    const trimmed: string = formula.trim();
    if (trimmed.length === 0) {
        return trimmed;
    }
    const bang: number = trimmed.lastIndexOf('!');
    let sheet: string = sheetName;
    let address: string = trimmed;
    if (bang >= 0) {
        const rawSheet: string = trimmed.slice(0, bang).replace(/^'|'$/g, '');
        if (rawSheet.length > 0) {
            sheet = rawSheet;
        }
        address = trimmed.slice(bang + 1);
    }
    const plain: string = stripSheetAndDollars(address);
    if (plain.length === 0) {
        return trimmed;
    }
    const needsQuotes: boolean = /[^A-Za-z0-9_]/.test(sheet);
    const sheetToken: string = needsQuotes ? `'${sheet.replace(/'/g, '\'\'')}'` : sheet;
    return `${sheetToken}!${plain}`;
}
/**
 *
 * @param {string | number | boolean | Date | null | undefined} value - The value value.
 * @returns {string} The result.
 */
function cellToCacheString(value: string | number | boolean | Date | null | undefined): string {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) {
            return '';
        }
        return String(value);
    }
    if (typeof value === 'boolean') {
        return value ? '1' : '0';
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    return String(value);
}
/**
 *
 * @param {string | number | boolean | Date | null | undefined} value - The value value.
 * @returns {string | undefined} The result.
 */
function cellToNumString(value: string | number | boolean | Date | null | undefined): string | undefined {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
    }
    if (typeof value === 'boolean') {
        return value ? '1' : '0';
    }
    if (typeof value === 'string') {
        const t: string = value.trim();
        if (t.length === 0) {
            return undefined;
        }
        const n: number = Number(t);
        if (Number.isFinite(n)) {
            return String(n);
        }
        return undefined;
    }
    return undefined;
}
/**
 *
 * @param {*} values - The values value.
 * @returns {string} The result.
 */
function buildStrCacheXml(values: ReadonlyArray<string | number | boolean | Date | null | undefined>): string {
    const pts: string[] = [];
    for (let i: number = 0; i < values.length; i += 1) {
        const s: string = cellToCacheString(arrayAt(values, i));
        pts.push(`<c:pt idx="${String(i)}"><c:v>${escapeXmlText(s)}</c:v></c:pt>`);
    }
    return `<c:strCache><c:ptCount val="${String(pts.length)}"/>${pts.join('')}</c:strCache>`;
}
/**
 *
 * @param {*} values - The values value.
 * @returns {string} The result.
 */
function buildNumCacheXml(values: ReadonlyArray<string | number | boolean | Date | null | undefined>): string {
    const pts: string[] = [];
    for (let i: number = 0; i < values.length; i += 1) {
        const n: string = cellToNumString(arrayAt(values, i));
        if (n === undefined) {
            continue;
        }
        pts.push(`<c:pt idx="${String(i)}"><c:v>${escapeXmlText(n)}</c:v></c:pt>`);
    }
    return `<c:numCache><c:formatCode>General</c:formatCode><c:ptCount val="${String(pts.length)}"/>${pts.join('')}</c:numCache>`;
}
/**
 * Extract inner text of the first `c:f` child of a `c:numRef` / `c:strRef` block.
 *
 * @param {string} inner - The inner value.
 * @returns {string | undefined} The result.
 */
function extractFormulaFromRefInner(inner: string): string | undefined {
    // indexOf-based extract — no regex (security/detect-unsafe-regex).
    const lower: string = inner.toLowerCase();
    const start: number = lower.indexOf('<c:f');
    if (start < 0) {
        return undefined;
    }
    const afterName: number = start + 4;
    if (afterName < inner.length) {
        const next: string = inner.charAt(afterName);
        if (next !== '>' && next !== ' ' && next !== '\t' && next !== '\r' && next !== '\n' && next !== '/') {
            return undefined;
        }
    }
    const gt: number = inner.indexOf('>', start);
    if (gt < 0) {
        return undefined;
    }
    // Self-closing <c:f ... />
    if (inner.charAt(gt - 1) === '/') {
        return '';
    }
    const afterOpen: number = gt + 1;
    const closeIdx: number = lower.indexOf('</c:f>', afterOpen);
    if (closeIdx < 0) {
        return undefined;
    }
    return inner.slice(afterOpen, closeIdx).replace(/^\s+|\s+$/g, '');
}
/**
 * Rebuild one `c:numRef` fragment with qualified `c:f` + `c:numCache`.
 *
 * @param {string} fullMatch - The fullMatch value.
 * @param {HostWorksheet} sheet - The sheet value.
 * @param {string} sheetName - The sheetName value.
 * @returns {string} The result.
 */
function enrichNumRefBlock(fullMatch: string, sheet: HostWorksheet, sheetName: string): string {
    const openEnd: number = fullMatch.indexOf('>');
    if (openEnd < 0) {
        return fullMatch;
    }
    const closeTag: number = fullMatch.lastIndexOf('</');
    if (closeTag < 0) {
        return fullMatch;
    }
    const inner: string = fullMatch.slice(openEnd + 1, closeTag);
    const formula: string = extractFormulaFromRefInner(inner);
    if (formula === undefined || formula.length === 0) {
        return fullMatch;
    }
    if (parseSimpleA1Range(formula) === undefined) {
        return fullMatch;
    }
    const values: ReadonlyArray<string | number | boolean | Date> = readValuesAlongFormula(sheet, formula);
    const q: string = qualifyChartFormula(formula, sheetName);
    if (values.length === 0) {
        return `<c:numRef><c:f>${escapeXmlText(q)}</c:f></c:numRef>`;
    }
    const cache: string = buildNumCacheXml(values);
    return `<c:numRef><c:f>${escapeXmlText(q)}</c:f>${cache}</c:numRef>`;
}
/**
 * Rebuild one `c:strRef` fragment with qualified `c:f` + `c:strCache`.
 *
 * @param {string} fullMatch - The fullMatch value.
 * @param {HostWorksheet} sheet - The sheet value.
 * @param {string} sheetName - The sheetName value.
 * @returns {string} The result.
 */
function enrichStrRefBlock(fullMatch: string, sheet: HostWorksheet, sheetName: string): string {
    const openEnd: number = fullMatch.indexOf('>');
    if (openEnd < 0) {
        return fullMatch;
    }
    const closeTag: number = fullMatch.lastIndexOf('</');
    if (closeTag < 0) {
        return fullMatch;
    }
    const inner: string = fullMatch.slice(openEnd + 1, closeTag);
    const formula: string = extractFormulaFromRefInner(inner);
    if (formula === undefined || formula.length === 0) {
        return fullMatch;
    }
    if (parseSimpleA1Range(formula) === undefined) {
        return fullMatch;
    }
    const values: ReadonlyArray<string | number | boolean | Date> = readValuesAlongFormula(sheet, formula);
    const q: string = qualifyChartFormula(formula, sheetName);
    if (values.length === 0) {
        return `<c:strRef><c:f>${escapeXmlText(q)}</c:f></c:strRef>`;
    }
    const cache: string = buildStrCacheXml(values);
    return `<c:strRef><c:f>${escapeXmlText(q)}</c:f>${cache}</c:strRef>`;
}
/**
 * Enrich `exportChartPart` XML with caches and sheet-qualified formulas from the sheet.
 *
 * @param {string} chartXml - Serialized `c:chartSpace` from ej2-xlsx.
 * @param {HostWorksheet} sheet - Embedding worksheet holding dual-write cells.
 * @param {string} sheetName - Name used when qualifying bare A1 refs (default Sheet1).
 * @returns {string} The result.
 */
export function enrichChartPartCachesFromSheet(chartXml: string, sheet: HostWorksheet,
                                               sheetName: string = DEFAULT_CHART_CACHE_SHEET_NAME): string {
    let out: string = chartXml;
    out = out.replace(/<c:numRef\b[^>]*>[\s\S]*?<\/c:numRef>/gi, (block: string) => enrichNumRefBlock(block, sheet, sheetName));
    out = out.replace(/<c:strRef\b[^>]*>[\s\S]*?<\/c:strRef>/gi, (block: string) => enrichStrRefBlock(block, sheet, sheetName));
    return out;
}
