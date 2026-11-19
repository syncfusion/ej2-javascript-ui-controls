/**
 * Excel serial date conversion (1900 / 1904 systems).
 *
 * Numbers remain the on-wire cell values; these helpers only map public
 * `Cell.dateTime` to/from serials. The 1900 system keeps Excel’s fictitious
 * 1900-02-29 (serial 60) for Lotus 1-2-3 compatibility.
 *
 * Citations: ECMA-376-1 workbookPr/@date1904; engineering-reference-pack
 * cells-and-values (1900 leap-day quirk).
 */

/** Default number format applied when authoring via `Cell.dateTime`. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_DATE_TIME_FORMAT: 'yyyy-mm-dd hh:mm' = 'yyyy-mm-dd hh:mm';

const MS_PER_DAY: 86400000 = 86_400_000;

/**
 * Convert a local civil `Date` to an Excel serial using the workbook date system. Local Y/M/D/h/m/s/ms components are used so round-trips match `Date` getters in the host timezone (public-API contract for `Cell.dateTime`).
 *
 * @param {Date} date - The date parameter.
 * @param {boolean} date1904 - The date1904 parameter.
 * @returns {number} - Returns the result.
 */
export function dateToExcelSerial(date: Date, date1904: boolean): number {
    const y: number = date.getFullYear();
    const m: number = date.getMonth();
    const d: number = date.getDate();
    const hh: number = date.getHours();
    const mm: number = date.getMinutes();
    const ss: number = date.getSeconds();
    const ms: number = date.getMilliseconds();
    const fraction: number = (hh * 3_600_000 + mm * 60_000 + ss * 1_000 + ms) / MS_PER_DAY;

    if (date1904) {
        const days: number = (Date.UTC(y, m, d) - Date.UTC(1904, 0, 1)) / MS_PER_DAY;
        return days + fraction;
    }

    // 1900 system: serial 1 = 1900-01-01. Excel inserts a phantom leap day at
    // serial 60, so civil dates on/after 1900-03-01 are one serial higher than
    // the true day count from 1899-12-31.
    let days: number = (Date.UTC(y, m, d) - Date.UTC(1899, 11, 31)) / MS_PER_DAY;
    if (Date.UTC(y, m, d) >= Date.UTC(1900, 2, 1)) {
        days += 1;
    }
    return days + fraction;
}

/**
 * Convert an Excel serial to a local civil `Date` (new instance every call). Serial 60 in the 1900 system is the non-existent 1900-02-29; JS has no such civil day, so it surfaces as 1900-03-01 local (same roll Excel UIs often show when materializing that serial outside the spreadsheet grid).
 *
 * @param {number} serial - The serial parameter.
 * @param {boolean} date1904 - The date1904 parameter.
 * @returns {Date} - Returns the result.
 */
export function excelSerialToDate(serial: number, date1904: boolean): Date {
    const whole: number = Math.trunc(serial);
    const fraction: number = serial - whole;
    let totalMs: number = Math.round(fraction * MS_PER_DAY);
    // Guard float edge: fraction may round to a full day.
    let dayCarry: number = 0;
    if (totalMs >= MS_PER_DAY) {
        dayCarry = 1;
        totalMs -= MS_PER_DAY;
    } else if (totalMs < 0) {
        dayCarry = -1;
        totalMs += MS_PER_DAY;
    }
    const hh: number = Math.floor(totalMs / 3_600_000);
    const rem1: number = totalMs % 3_600_000;
    const mm: number = Math.floor(rem1 / 60_000);
    const rem2: number = rem1 % 60_000;
    const ss: number = Math.floor(rem2 / 1_000);
    const milli: number = rem2 % 1_000;

    if (date1904) {
        const utc: number = Date.UTC(1904, 0, 1) + (whole + dayCarry) * MS_PER_DAY;
        const dt: Date = new Date(utc);
        return new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), hh, mm, ss, milli);
    }

    // Map serial → day offset from 1899-12-31, undoing the phantom leap day for
    // serials after 60. Serial 60 collapses to 1900-03-01 in JS Date space.
    let dayOffset: number = whole + dayCarry;
    if (dayOffset > 60) {
        dayOffset -= 1;
    }
    const utc: number = Date.UTC(1899, 11, 31) + dayOffset * MS_PER_DAY;
    const dt: Date = new Date(utc);
    return new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), hh, mm, ss, milli);
}
