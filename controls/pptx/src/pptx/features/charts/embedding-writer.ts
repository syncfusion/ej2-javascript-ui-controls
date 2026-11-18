/**
 * Synchronous minimal chart-embedding workbook writer.
 *
 * @remarks
 * Authoring no longer calls ej2-xlsx `Workbook.save()` (that path emits nested
 * `xl/charts` parts this library then strips). Bytes written here are the cell
 * subset PowerPoint reads for `c:f` caches: content types, package rels,
 * workbook, one worksheet, shared strings, and a stock styles part.
 *
 * Citations: ECMA-376 Part 1 SpreadsheetML worksheet `sheetData` / shared
 * strings; corpus Default Extension=`xlsx` content type
 * {@link EMBEDDED_XLSX_CONTENT_TYPE}; OPC `[Content_Types].xml` + `_rels/.rels`.
 * ZIP layout uses existing sync {@link writeZip} (store method).
 *
 * @internal
 */
import { writeZip } from '../../core/package/zip-writer';
import { EMBEDDED_XLSX_CONTENT_TYPE } from './add-chart';
import { ChartCellValue } from './chart-cell-sheet';
const utf8: TextEncoder = new TextEncoder();
const RELS_NS: string = 'http://schemas.openxmlformats.org/package/2006/relationships';
const CT_NS: string = 'http://schemas.openxmlformats.org/package/2006/content-types';
const SML_NS: string = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL_ATTR_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const OFFICE_DOCUMENT_REL: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
const WORKSHEET_REL: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet';
const SHARED_STRINGS_REL: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings';
const STYLES_REL: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles';
const WORKSHEET_CT: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml';
const SHARED_STRINGS_CT: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml';
const STYLES_CT: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml';
const WORKBOOK_MAIN_CT: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml';
/**
 * One cell in the minimal embedding grid (1-based row, 0-based column).
 *
 * @internal
 */
export interface EmbeddingCell {
    readonly col: number;
    readonly row: number;
    readonly value: ChartCellValue;
}
/**
 * Inputs for {@link writeChartEmbeddingXlsx}.
 *
 * @internal
 */
export interface ChartEmbeddingCells {
    readonly sheetName: string;
    readonly cells: ReadonlyArray<EmbeddingCell>;
}
/**
 * Stock styles part matching a created ej2-xlsx workbook (Normal / Calibri 11).
 *
 * @remarks Observed on `Workbook.create().save()` styles.xml. Not invented —
 * copied from that host save so embedded packages stay readable.
 */
const STYLES_XML: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<styleSheet xmlns="${SML_NS}">` +
    '<fonts count="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"></patternFill></fill><fill><patternFill patternType="gray125"></patternFill></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>' +
    '</styleSheet>';
/**
 * Writes a minimal XLSX package for chart embedding cells.
 *
 * @internal
 * @param {ChartEmbeddingCells} input - Sheet name and cell values.
 * @returns {Uint8Array} Store-method ZIP bytes.
 */
export function writeChartEmbeddingXlsx(input: ChartEmbeddingCells): Uint8Array {
    const sheetName: string = input.sheetName.length > 0 ? input.sheetName : 'Sheet1';
    const strings: string[] = [];
    const stringIndex: Map<string, number> = new Map<string, number>();
    const byRow: Map<number, EmbeddingCell[]> = new Map<number, EmbeddingCell[]>();
    let minCol: number = 0;
    let maxCol: number = 0;
    let minRow: number = 0;
    let maxRow: number = 0;
    let any: boolean = false;
    for (let i: number = 0; i < input.cells.length; i++) {
        const cell: EmbeddingCell = input.cells[i];
        if (cell.value === undefined || cell.value === null) {
            continue;
        }
        if (!any) {
            minCol = cell.col;
            maxCol = cell.col;
            minRow = cell.row;
            maxRow = cell.row;
            any = true;
        }
        else {
            if (cell.col < minCol) {
                minCol = cell.col;
            }
            if (cell.col > maxCol) {
                maxCol = cell.col;
            }
            if (cell.row < minRow) {
                minRow = cell.row;
            }
            if (cell.row > maxRow) {
                maxRow = cell.row;
            }
        }
        if (typeof cell.value === 'string') {
            if (!stringIndex.has(cell.value)) {
                stringIndex.set(cell.value, strings.length);
                strings.push(cell.value);
            }
        }
        const rowCells: EmbeddingCell[] | undefined = byRow.get(cell.row);
        if (rowCells === undefined) {
            byRow.set(cell.row, [cell]);
        }
        else {
            rowCells.push(cell);
        }
    }
    const sstParts: string[] = [];
    for (let i: number = 0; i < strings.length; i++) {
        sstParts.push(`<si><t>${escapeXml(strings[i])}</t></si>`);
    }
    const count: string = String(strings.length);
    const sharedStrings: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        `<sst xmlns="${SML_NS}" count="${count}" uniqueCount="${count}">${sstParts.join('')}</sst>`;
    const rowParts: string[] = [];
    const rowKeys: number[] = Array.from(byRow.keys()).sort((a: number, b: number) => a - b);
    const span: string = any ? ` spans="${String(minCol + 1)}:${String(maxCol + 1)}"` : '';
    for (let r: number = 0; r < rowKeys.length; r++) {
        const rowNum: number = rowKeys[r];
        const cells: EmbeddingCell[] = byRow.get(rowNum).slice().sort((a: EmbeddingCell, b: EmbeddingCell) => a.col - b.col);
        const cellXml: string[] = [];
        for (let c: number = 0; c < cells.length; c++) {
            const cell: EmbeddingCell = cells[c];
            const addr: string = colRowToA1(cell.col, cell.row);
            cellXml.push(cellXmlFor(addr, cell.value, stringIndex));
        }
        rowParts.push(`<row r="${String(rowNum)}"${span}>${cellXml.join('')}</row>`);
    }
    const dimension: string = any
        ? `<dimension ref="${colRowToA1(minCol, minRow)}:${colRowToA1(maxCol, maxRow)}"/>`
        : '<dimension ref="A1"/>';
    const sheetXml: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        `<worksheet xmlns="${SML_NS}" xmlns:r="${REL_ATTR_NS}">${dimension}<sheetData>${rowParts.join('')}</sheetData></worksheet>`;
    const workbookXml: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        `<workbook xmlns="${SML_NS}" xmlns:r="${REL_ATTR_NS}">` +
        '<bookViews><workbookView activeTab="0"/></bookViews>' +
        `<sheets><sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
    const contentTypes: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        `<Types xmlns="${CT_NS}">` +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        `<Default Extension="xlsx" ContentType="${EMBEDDED_XLSX_CONTENT_TYPE}"/>` +
        `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="${WORKSHEET_CT}"/>` +
        `<Override PartName="/xl/sharedStrings.xml" ContentType="${SHARED_STRINGS_CT}"/>` +
        `<Override PartName="/xl/styles.xml" ContentType="${STYLES_CT}"/>` +
        `<Override PartName="/xl/workbook.xml" ContentType="${WORKBOOK_MAIN_CT}"/>` +
        '</Types>';
    const rootRels: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        `<Relationships xmlns="${RELS_NS}">` +
        `<Relationship Id="rId1" Type="${OFFICE_DOCUMENT_REL}" Target="xl/workbook.xml"/>` +
        '</Relationships>';
    const workbookRels: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        `<Relationships xmlns="${RELS_NS}">` +
        `<Relationship Id="rId1" Type="${WORKSHEET_REL}" Target="worksheets/sheet1.xml"/>` +
        `<Relationship Id="rId2" Type="${SHARED_STRINGS_REL}" Target="sharedStrings.xml"/>` +
        `<Relationship Id="rId3" Type="${STYLES_REL}" Target="styles.xml"/>` +
        '</Relationships>';
    const parts: Map<string, Uint8Array> = new Map<string, Uint8Array>();
    parts.set('/[Content_Types].xml', utf8.encode(contentTypes));
    parts.set('/_rels/.rels', utf8.encode(rootRels));
    parts.set('/xl/workbook.xml', utf8.encode(workbookXml));
    parts.set('/xl/_rels/workbook.xml.rels', utf8.encode(workbookRels));
    parts.set('/xl/worksheets/sheet1.xml', utf8.encode(sheetXml));
    parts.set('/xl/sharedStrings.xml', utf8.encode(sharedStrings));
    parts.set('/xl/styles.xml', utf8.encode(STYLES_XML));
    return writeZip(parts);
}
/**
 *
 * @param {string} addr - A1 address.
 * @param {ChartCellValue} value - Cell value.
 * @param {Map<string, number>} stringIndex - Shared-string table.
 * @returns {string} `c` element.
 */
function cellXmlFor(addr: string, value: ChartCellValue, stringIndex: Map<string, number>): string {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return `<c r="${addr}"><v>${String(value)}</v></c>`;
    }
    if (typeof value === 'boolean') {
        return `<c r="${addr}" t="b"><v>${value ? '1' : '0'}</v></c>`;
    }
    if (value instanceof Date) {
        return `<c r="${addr}" t="s"><v>${String(intern(stringIndex, value.toISOString()))}</v></c>`;
    }
    const text: string = value === undefined || value === null ? '' : String(value);
    return `<c r="${addr}" t="s"><v>${String(intern(stringIndex, text))}</v></c>`;
}
/**
 *
 * @param {Map<string, number>} stringIndex - Shared-string table.
 * @param {string} text - String to intern.
 * @returns {number} Index. Caller must have interned already when writing sst; this is a lookup.
 */
function intern(stringIndex: Map<string, number>, text: string): number {
    const found: number | undefined = stringIndex.get(text);
    return found === undefined ? 0 : found;
}
/**
 *
 * @param {string} value - Text.
 * @returns {string} Escaped text.
 */
function escapeXml(value: string): string {
    const amp: string = String.fromCharCode(38);
    const lt: string = String.fromCharCode(60);
    const gt: string = String.fromCharCode(62);
    const quot: string = String.fromCharCode(34);
    return value
        .split(amp).join(amp + 'amp;')
        .split(lt).join(amp + 'lt;')
        .split(gt).join(amp + 'gt;')
        .split(quot).join(amp + 'quot;');
}
/**
 *
 * @param {number} col0 - Zero-based column.
 * @param {number} row1 - One-based row.
 * @returns {string} A1 address.
 */
function colRowToA1(col0: number, row1: number): string {
    let n: number = col0 + 1;
    let s: string = '';
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s + String(row1);
}
