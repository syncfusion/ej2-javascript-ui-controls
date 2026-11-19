/**
 * Synchronous embedded workbook writer for chart data.
 *
 * `saveSync` cannot await `Workbook.save()`, so the embedded `.xlsx` is written
 * directly from the chart's populated cells (single sheet, inline strings).
 * ECMA-376-1 §18 (SpreadsheetML), §15.2 (package parts).
 *
 * @private
 */
import { writeZip } from '../../core/zip/index';

export const CHART_SHEET_NAME: string = 'Sheet1';

export interface ChartCell {
    readonly row: number;
    readonly column: number;
    readonly value: string | number | boolean;
}

function esc(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function columnName(column: number): string {
    let letters: string = '';
    let n: number = column;
    while (n > 0) {
        letters = String.fromCharCode(65 + ((n - 1) % 26)) + letters;
        n = Math.floor((n - 1) / 26);
    }
    return letters;
}

function cellXml(cell: ChartCell): string {
    const ref: string = columnName(cell.column) + cell.row;
    if (typeof cell.value === 'number') {
        return '<c r="' + ref + '"><v>' + String(cell.value) + '</v></c>';
    }
    if (typeof cell.value === 'boolean') {
        return '<c r="' + ref + '" t="b"><v>' + (cell.value ? '1' : '0') + '</v></c>';
    }
    return '<c r="' + ref + '" t="inlineStr"><is><t xml:space="preserve">' + esc(cell.value) + '</t></is></c>';
}

/**
 * Build `.xlsx` bytes holding `cells` on a sheet named {@link CHART_SHEET_NAME}.
 *
 * @param {ReadonlyArray<ChartCell>} cells - The cells.
 * @returns {Uint8Array} The result.
 * @private
 */
export function createChartWorkbookBytes(cells: ReadonlyArray<ChartCell>): Uint8Array {
    const enc: TextEncoder = new TextEncoder();
    const rows: { [row: number]: string[] } = {};
    const rowNumbers: number[] = [];
    for (const cell of cells) {
        if (rows[cell.row] === undefined) {
            rows[cell.row] = [];
            rowNumbers.push(cell.row);
        }
        rows[cell.row].push(cellXml(cell));
    }
    rowNumbers.sort((a: number, b: number) => a - b);
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
    const sheetData: string = rowNumbers.map((r: number) => '<row r="' + r + '">' + rows[r].join('') + '</row>').join('');
    const decl: string = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    const main: string = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    const rel: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const pkgRel: string = 'http://schemas.openxmlformats.org/package/2006/relationships';
    const files: Array<[string, string]> = [
        ['[Content_Types].xml', decl + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            + '<Default Extension="xml" ContentType="application/xml"/>'
            + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            + '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            + '</Types>'],
        ['_rels/.rels', decl + '<Relationships xmlns="' + pkgRel + '"><Relationship Id="rId1" Type="' + rel + '/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
        ['xl/workbook.xml', decl + '<workbook xmlns="' + main + '" xmlns:r="' + rel + '"><sheets><sheet name="' + CHART_SHEET_NAME + '" sheetId="1" r:id="rId1"/></sheets></workbook>'],
        ['xl/_rels/workbook.xml.rels', decl + '<Relationships xmlns="' + pkgRel + '"><Relationship Id="rId1" Type="' + rel + '/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],
        ['xl/worksheets/sheet1.xml', decl + '<worksheet xmlns="' + main + '"><sheetData>' + sheetData + '</sheetData></worksheet>']
    ];
    return writeZip(files.map((f: [string, string]) => ({ name: f[0], data: enc.encode(f[1]) })));
}
