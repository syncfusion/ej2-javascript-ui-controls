/**
 * Trial-license marks applied on save when `validateLicense('xlsx')` fails.
 *
 * Same gate as `document.save` in ej2-docx. Kept out of the public barrel so
 * workbook serialization can call it without a value-import cycle.
 *
 * Built only from public worksheet features: cells, merge, hyperlinks, rich
 * text, `addSheet` and sheet protection.
 * - every worksheet: a notice row after the used range (merged A:T, linked);
 *   a sheet with a pivot table gets no notice row
 * - an appended "Evaluation Warning" sheet with the same notice, protected
 *
 * @private
 */

import { formatA1, formatA1Range, parseA1Range } from '../address/cell-address';
import { secureRandomBytes } from '../core/encryption-adapter';
import { Workbook } from '../workbook/workbook';
import { Worksheet } from '../workbook/worksheet';

/** Trial sentence written into the notice cells. */
const LICENSE_NOTICE_TEXT: string =
    'Created with a trial version of Syncfusion Excel library or registered the wrong key in your application. Click here to obtain the valid key.';

/** Warning sheet tab title. */
const EVALUATION_SHEET_NAME: string = 'Evaluation Warning';

/** Link blue and warning red used by the notice. */
const NOTICE_BLUE_RGB: string = 'FF0563C1';
const NOTICE_RED_RGB: string = 'FFFF0000';

/** Last column of the merged notice (T on content sheets, S on the warning sheet). */
const NOTICE_END_COL: number = 20;
const WARNING_END_COL: number = 19;

/** License claim URL (product list only; no version parameter). */
const LICENSE_CLAIM_URL: string = 'https://www.syncfusion.com/account/claim-license-key?pl=ZXhjZWwsc3ByZWFkc2hlZXRlZGl0b3IsZ3JpZHNkaw==';

/**
 * Claim URL.
 *
 * @returns {string} Claim URL.
 */
function claimUrl(): string {
    return LICENSE_CLAIM_URL;
}

/**
 * Stamp trial marks before worksheet flush. No-op when the warning sheet
 * is already present (idempotent re-save).
 *
 * @param {Workbook} workbook - Workbook being saved.
 * @returns {void} Nothing.
 * @private
 */
export function applyLicenseWatermark(workbook: Workbook): void {
    if (hasEvaluationSheet(workbook)) {
        return;
    }
    const count: number = workbook.worksheets.length;
    for (let i: number = 0; i < count; i += 1) {
        const sheet: Worksheet = workbook.sheet(i);
        if (sheet.kind !== 'worksheet') {
            continue;
        }
        // A notice row would sit outside a pivot range and break its layout.
        if (sheet.pivotTables.count === 0) {
            stampNoticeRow(sheet, false);
        }
    }
    const warning: Worksheet = workbook.addSheet(uniqueSheetName(workbook, EVALUATION_SHEET_NAME));
    stampNoticeRow(warning, true);
    warning.protect(randomPassword());
    workbook.activeSheet = warning;
}

function hasEvaluationSheet(workbook: Workbook): boolean {
    return workbook.worksheets.some((sheet: Worksheet): boolean => sheet.name.indexOf(EVALUATION_SHEET_NAME) === 0);
}

function uniqueSheetName(workbook: Workbook, base: string): string {
    const taken: string[] = workbook.worksheets.map((sheet: Worksheet): string => sheet.name);
    let name: string = base;
    for (let n: number = 2; taken.indexOf(name) >= 0; n += 1) {
        name = `${base} ${n}`;
    }
    return name;
}

/**
 * Notice cell on the row after the used range (content sheets) or row 10
 * (warning sheet): merged, linked, red bold text with a blue "here".
 *
 * @param {Worksheet} sheet - Sheet to stamp.
 * @param {boolean} warningSheet - True for the evaluation sheet layout.
 * @returns {void} Nothing.
 */
function stampNoticeRow(sheet: Worksheet, warningSheet: boolean): void {
    const row: number = warningSheet ? 10 : noticeRow(sheet);
    const endCol: number = warningSheet ? WARNING_END_COL : NOTICE_END_COL;
    const url: string = claimUrl();
    const cell: ReturnType<Worksheet['cell']> = sheet.cell(row, 1);
    cell.value = LICENSE_NOTICE_TEXT;
    sheet.range(formatA1Range({ startRow: row, startCol: 1, endRow: row, endCol })).merge();
    sheet.hyperlinks.add(formatA1(row, 1), url, LICENSE_NOTICE_TEXT, url, 'url');
    // After hyperlinks.add: it rewrites the cell as plain display text.
    const size: number = warningSheet ? 14 : 12;
    const hereStart: number = LICENSE_NOTICE_TEXT.indexOf(' here');
    const hereEnd: number = hereStart + ' here'.length;
    const font: (rgb: string) => { name: string; size: number; bold: boolean; color: { rgb: string } } =
        (rgb: string) => ({ name: 'Calibri', size, bold: true, color: { rgb } });
    cell.richText.characters(0, hereStart - 1).font = font(NOTICE_RED_RGB);
    cell.richText.characters(hereStart, hereEnd - 1).font = font(NOTICE_BLUE_RGB);
    cell.richText.characters(hereEnd, LICENSE_NOTICE_TEXT.length - 1).font = font(NOTICE_RED_RGB);
    if (warningSheet) {
        sheet.setRowHeight(row, 25);
    }
}

/** First row after the used range whose A:T span does not touch a merge. */
function noticeRow(sheet: Worksheet): number {
    const last: number | undefined = sheet.lastRow;
    let row: number = last === undefined ? 1 : last + 1;
    const merges: ReadonlyArray<string> = sheet.mergedCells.list();
    const touches: (r: number) => boolean = (r: number): boolean => merges.some((ref: string): boolean => {
        const m: ReturnType<typeof parseA1Range> = parseA1Range(ref);
        return r >= m.startRow && r <= m.endRow && m.startCol <= NOTICE_END_COL;
    });
    while (touches(row)) {
        row += 1;
    }
    return row;
}

/** Random 32-hex-digit sheet password, never retained. */
function randomPassword(): string {
    const bytes: Uint8Array = secureRandomBytes(16);
    let text: string = '';
    for (let i: number = 0; i < bytes.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- index into a local byte array
        text += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    }
    return text;
}
