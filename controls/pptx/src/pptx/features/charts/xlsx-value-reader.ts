/**
 * Synchronous read of chart-embedding cell values (sheet1 + shared strings).
 *
 * @remarks
 * Used when a chart was loaded via `Presentation.open()` or `addChart({ from: { data } })`
 * and the edit path must not await `Workbook.open`. Reads inline strings, shared
 * strings, numbers, and booleans. Formulas are not evaluated — cached `<v>` only.
 *
 * Citations: ECMA-376 Part 1 `sheetData` / `c` / `sst`; security pre-check via
 * {@link openNestedXlsxPackageSync} (same limits as the async nested open).
 *
 * @internal
 */
import { SecurityLimits } from '../../core/security/limits';
import { ChartCellSheet, ChartCellValue } from './chart-cell-sheet';
import { ChartsError, partNameOptions } from './errors';
import { openNestedXlsxPackageSync } from './nested-package-security';
const utf8: TextDecoder = new TextDecoder('utf-8');
/**
 * Reads the first worksheet's cells into a chart-local sheet.
 *
 * @internal
 * @param {Uint8Array} xlsxBytes - Embedding package bytes.
 * @param {string} partName - Part name for errors.
 * @param {Partial<SecurityLimits>} [overrides] - Optional limit overrides.
 * @returns {ChartCellSheet} Populated local sheet.
 */
export function readEmbeddingCellSheet(xlsxBytes: Uint8Array, partName: string,
                                       overrides?: Partial<SecurityLimits>): ChartCellSheet {
    const opened: { readonly parts: ReadonlyMap<string, Uint8Array> } = openNestedXlsxPackageSync(xlsxBytes, overrides, {
        partName
    });
    const sheetPart: Uint8Array | undefined = findPart(opened.parts, '/xl/worksheets/sheet1.xml');
    if (sheetPart === undefined) {
        throw new ChartsError('Embedded workbook has no worksheets', partNameOptions(partName));
    }
    const shared: ReadonlyArray<string> = readSharedStrings(findPart(opened.parts, '/xl/sharedStrings.xml'));
    const sheetName: string = readSheetName(findPart(opened.parts, '/xl/workbook.xml'));
    const sheet: ChartCellSheet = new ChartCellSheet(sheetName);
    const xml: string = utf8.decode(sheetPart);
    const rowRe: RegExp = /<row\b[^>]*\br="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
    let rowMatch: RegExpExecArray | null = rowRe.exec(xml);
    while (rowMatch !== null) {
        const row: string = rowMatch[1];
        const inner: string = rowMatch[2];
        const cellRe: RegExp = /<c\b([^>]*)>([\s\S]*?)<\/c>|<c\b([^>]*)\/>/g;
        let cellMatch: RegExpExecArray | null = cellRe.exec(inner);
        while (cellMatch !== null) {
            const attrs: string = cellMatch[1] !== undefined && cellMatch[1].length > 0 ? cellMatch[1] : (cellMatch[3] !== undefined ? cellMatch[3] : '');
            const body: string = cellMatch[2] !== undefined ? cellMatch[2] : '';
            const ref: string | undefined = attr(attrs, 'r');
            if (ref !== undefined) {
                const value: ChartCellValue = cellValue(attrs, body, shared);
                if (value !== undefined) {
                    sheet.getCell(ref).value = value;
                }
            }
            cellMatch = cellRe.exec(inner);
        }
        void row;
        rowMatch = rowRe.exec(xml);
    }
    return sheet;
}
/**
 *
 * @param {ReadonlyMap<string, Uint8Array>} parts - Nested parts.
 * @param {string} name - Absolute part name.
 * @returns {Uint8Array | undefined} Bytes when present.
 */
function findPart(parts: ReadonlyMap<string, Uint8Array>, name: string): Uint8Array | undefined {
    const direct: Uint8Array | undefined = parts.get(name);
    if (direct !== undefined) {
        return direct;
    }
    const keys: string[] = Array.from(parts.keys());
    const lower: string = name.toLowerCase();
    for (let i: number = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase() === lower) {
            return parts.get(keys[i]);
        }
    }
    return undefined;
}
/**
 *
 * @param {Uint8Array | undefined} bytes - sharedStrings part.
 * @returns {ReadonlyArray<string>} String table.
 */
function readSharedStrings(bytes: Uint8Array | undefined): ReadonlyArray<string> {
    if (bytes === undefined) {
        return [];
    }
    const xml: string = utf8.decode(bytes);
    const out: string[] = [];
    const re: RegExp = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
    let m: RegExpExecArray | null = re.exec(xml);
    while (m !== null) {
        out.push(concatText(m[1]));
        m = re.exec(xml);
    }
    return out;
}
/**
 *
 * @param {Uint8Array | undefined} bytes - workbook.xml.
 * @returns {string} First sheet name, or `Sheet1`.
 */
function readSheetName(bytes: Uint8Array | undefined): string {
    if (bytes === undefined) {
        return 'Sheet1';
    }
    const xml: string = utf8.decode(bytes);
    const m: RegExpExecArray | null = /<sheet\b[^>]*\bname="([^"]*)"/.exec(xml);
    if (m === null || m[1] === undefined || m[1].length === 0) {
        return 'Sheet1';
    }
    return decodeXml(m[1]);
}
/**
 *
 * @param {string} attrs - Cell attributes.
 * @param {string} body - Cell inner XML.
 * @param {ReadonlyArray<string>} shared - Shared strings.
 * @returns {ChartCellValue} Value, or undefined when empty.
 */
function cellValue(attrs: string, body: string, shared: ReadonlyArray<string>): ChartCellValue {
    const inline: RegExpExecArray | null = /<is\b[^>]*>([\s\S]*?)<\/is>/.exec(body);
    if (inline !== null) {
        return concatText(inline[1]);
    }
    const v: RegExpExecArray | null = /<v\b[^>]*>([\s\S]*?)<\/v>/.exec(body);
    if (v === null) {
        return undefined;
    }
    const text: string = decodeXml(v[1]);
    const type: string | undefined = attr(attrs, 't');
    if (type === 's') {
        const idx: number = Number.parseInt(text, 10);
        return Number.isFinite(idx) && shared[idx] !== undefined ? shared[idx] : text;
    }
    if (type === 'b') {
        return text === '1';
    }
    if (type === 'inlineStr' || type === 'str') {
        return text;
    }
    if (type === undefined || type === 'n') {
        const n: number = Number(text);
        return Number.isFinite(n) ? n : text;
    }
    return text;
}
/**
 *
 * @param {string} xml - Fragment.
 * @returns {string} Concatenated text nodes.
 */
function concatText(xml: string): string {
    const parts: string[] = [];
    const re: RegExp = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
    let m: RegExpExecArray | null = re.exec(xml);
    while (m !== null) {
        parts.push(decodeXml(m[1]));
        m = re.exec(xml);
    }
    return parts.join('');
}
/**
 *
 * @param {string} attrs - Attribute source.
 * @param {string} name - Attribute name.
 * @returns {string | undefined} Value.
 */
function attr(attrs: string, name: string): string | undefined {
    const re: RegExp = new RegExp(`\\b${name}="([^"]*)"`);
    const m: RegExpExecArray | null = re.exec(attrs);
    return m === null || m[1] === undefined ? undefined : decodeXml(m[1]);
}
/**
 *
 * @param {string} value - XML text.
 * @returns {string} Decoded text.
 */
function decodeXml(value: string): string {
    const amp: string = String.fromCharCode(38);
    const lt: string = String.fromCharCode(60);
    const gt: string = String.fromCharCode(62);
    const quot: string = String.fromCharCode(34);
    const apos: string = String.fromCharCode(39);
    return value
        .split(amp + 'lt;').join(lt)
        .split(amp + 'gt;').join(gt)
        .split(amp + 'quot;').join(quot)
        .split(amp + 'apos;').join(apos)
        .split(amp + 'amp;').join(amp);
}
