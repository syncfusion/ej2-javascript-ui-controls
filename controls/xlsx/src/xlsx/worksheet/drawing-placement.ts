/**
 * Absolute point placement for spreadsheet drawings (charts, images).
 *
 * Public `top` / `left` are points from the sheet origin (row 1 / column A),
 * matching Syncfusion XlsIO `IShape.Top` / `IShape.Left`. Storage remains the
 * DrawingML `xdr:from` marker: 0-based `col`/`row` plus `colOff`/`rowOff` EMU
 * (dml-spreadsheetDrawing.xsd `CT_Marker`).
 *
 * When worksheet row height or column width is unset (`getRowHeight` /
 * `getColumnWidth` return `0`), Excel-like defaults are used:
 * - row height: {@link DEFAULT_ROW_HEIGHT_PT} (15 pt)
 * - column width: {@link DEFAULT_COLUMN_WIDTH_CHARS} (8.43 character units)
 * - max digit width: {@link DEFAULT_MAX_DIGIT_WIDTH_PX} (7 px, Calibri 11)
 *
 * Column character units convert to pixels with the ECMA-376 width formula,
 * then to EMU at 96 DPI ({@link EMU_PER_PX_96DPI}).
 *
 * Citations:
 * - dml-spreadsheetDrawing.xsd `CT_Marker` / `CT_OneCellAnchor`
 * - ECMA-376-1 column width (max digit width) conversion
 * - docs/api/API-RULES.md R4.1 (drawing geometry in points)
 * - src/xlsx/core/length.ts EMU constants
 *
 * @private
 */

import { InvalidArgumentError } from '../core/errors';
import { EMU_PER_PT, EMU_PER_PX_96DPI } from '../core/length';

/** Excel default row height in points when `@ht` is absent. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_ROW_HEIGHT_PT: 15 = 15;

/**
 * Excel default column width in character units when `col@width` is absent
 * (UI default ~8.43 for Calibri 11).
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_COLUMN_WIDTH_CHARS: 8.43 = 8.43;

/**
 * Maximum digit width in pixels for the default font (Calibri 11 → 7).
 * Used only for character-width → physical conversion for placement.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_MAX_DIGIT_WIDTH_PX: 7 = 7;

/** Excel maximum row index (1-based). */
const MAX_ROW_INDEX: 1048576 = 1_048_576;

/** Excel maximum column index (1-based, XFD). */
const MAX_COLUMN_INDEX: 16384 = 16_384;

/**
 * Optional live sheet metrics. Missing methods or `0` values mean “unset” and
 * fall back to {@link DEFAULT_ROW_HEIGHT_PT} / {@link DEFAULT_COLUMN_WIDTH_CHARS}.
 *
 * @private
 */
export interface SheetMetrics {
    /** 1-based row height in points; `0` or absent → default. */
    getRowHeightPt(row: number): number;
    /** 1-based column width in OOXML character units; `0` or absent → default. */
    getColumnWidthChars(column: number): number;
    /** Whether a 1-based row is hidden; optional, defaults to `false`. */
    isRowHidden?(row: number): boolean;
    /** Whether a 1-based column is hidden; optional, defaults to `false`. */
    isColumnHidden?(column: number): boolean;
}

/**
 * Cell + offset placement stored on drawing entries.
 *
 * @private
 */
export interface CellAnchorPlacement {
    /** 1-based anchor row. */
    readonly row: number;
    /** 1-based anchor column. */
    readonly column: number;
    /** Offset below the top of {@link row}, in EMU. */
    readonly rowOffEmu: number;
    /** Offset right of the left of {@link column}, in EMU. */
    readonly colOffEmu: number;
}

/**
 * Convert points (1/72 in) to EMU. @private
 *
 * @param {number} points - The points parameter.
 * @returns {number} - Returns the result.
 */
export function pointsToEmu(points: number): number {
    return Math.round(points * EMU_PER_PT);
}

/**
 * Convert EMU to points. @private
 *
 * @param {number} emu - The emu parameter.
 * @returns {number} - Returns the result.
 */
export function emuToPoints(emu: number): number {
    return emu / EMU_PER_PT;
}

/**
 * Convert OOXML column width (character units) to EMU using the ECMA pixel
 * formula and 96 DPI.
 *
 * `px = Truncate(((256 * chars + Truncate(128 / mdw)) / 256) * mdw)`
 *
 * @private
 *
 * @param {number} chars - The chars parameter.
 * @param {number} mdwPx - The mdwPx parameter.
 * @returns {number} - Returns the result.
 */
export function columnWidthCharsToEmu(
    chars: number,
    mdwPx: number = DEFAULT_MAX_DIGIT_WIDTH_PX
): number {
    if (!(chars > 0) || !(mdwPx > 0)) {
        return columnWidthCharsToEmu(DEFAULT_COLUMN_WIDTH_CHARS, DEFAULT_MAX_DIGIT_WIDTH_PX);
    }
    const widthPx: number = Math.floor(((256 * chars + Math.floor(128 / mdwPx)) / 256) * mdwPx);
    return Math.max(0, widthPx) * EMU_PER_PX_96DPI;
}

/**
 * Resolve stored row height (`0` → default). @private
 *
 * @param {number} heightPt - The heightPt parameter.
 * @returns {number} - Returns the result.
 */
export function resolveRowHeightPt(heightPt: number): number {
    if (typeof heightPt !== 'number' || !Number.isFinite(heightPt) || heightPt <= 0) {
        return DEFAULT_ROW_HEIGHT_PT;
    }
    return heightPt;
}

/**
 * Resolve stored column width chars (`0` → default). @private
 *
 * @param {number} widthChars - The widthChars parameter.
 * @returns {number} - Returns the result.
 */
export function resolveColumnWidthChars(widthChars: number): number {
    if (typeof widthChars !== 'number' || !Number.isFinite(widthChars) || widthChars <= 0) {
        return DEFAULT_COLUMN_WIDTH_CHARS;
    }
    return widthChars;
}

/**
 * rowHeightEmu.
 *
 * @param {number} row - The row parameter.
 * @param {SheetMetrics | undefined} metrics - The metrics parameter.
 * @returns {number} - Returns the result.
 */
function rowHeightEmu(row: number, metrics: SheetMetrics | undefined): number {
    if (metrics !== undefined && metrics.isRowHidden !== undefined && metrics.isRowHidden(row)) {
        return 0;
    }
    const raw: number =
    metrics === undefined ? 0 : metrics.getRowHeightPt(row);
    return pointsToEmu(resolveRowHeightPt(raw));
}

/**
 * columnWidthEmu.
 *
 * @param {number} column - The column parameter.
 * @param {SheetMetrics | undefined} metrics - The metrics parameter.
 * @returns {number} - Returns the result.
 */
function columnWidthEmu(column: number, metrics: SheetMetrics | undefined): number {
    if (metrics !== undefined && metrics.isColumnHidden !== undefined && metrics.isColumnHidden(column)) {
        return 0;
    }
    const raw: number =
    metrics === undefined ? 0 : metrics.getColumnWidthChars(column);
    return columnWidthCharsToEmu(resolveColumnWidthChars(raw));
}

/**
 * EMU width or height of a two-cell DrawingML anchor (`xdr:from` → `xdr:to`).
 *
 * Spanned cells use live sheet metrics (same conversion as absolute top/left).
 * Hidden rows and columns contribute 0. When metrics are absent, the Excel
 * defaults used by {@link columnWidthCharsToEmu} / {@link resolveRowHeightPt}
 * apply — not a fixed 64 px column.
 *
 * @private
 *
 * @param {number} fromIndex0 - 0-based start row or column (`xdr:row` / `xdr:col`).
 * @param {number} fromOffEmu - Offset inside the start cell.
 * @param {number} toIndex0 - 0-based end row or column.
 * @param {number} toOffEmu - Offset inside the end cell.
 * @param {(index: number) => number} cellEmu - 1-based cell size in EMU.
 * @returns {number} - Returns the result.
 */
export function twoCellSpanEmu(
    fromIndex0: number,
    fromOffEmu: number,
    toIndex0: number,
    toOffEmu: number,
    cellEmu: (index: number) => number
): number {
    if (toIndex0 === fromIndex0) {
        return Math.max(0, toOffEmu - fromOffEmu);
    }
    if (toIndex0 < fromIndex0) {
        return 0;
    }
    let total: number = Math.max(0, cellEmu(fromIndex0 + 1) - Math.max(0, fromOffEmu));
    for (let index: number = fromIndex0 + 1; index < toIndex0; index += 1) {
        total += cellEmu(index + 1);
    }
    total += Math.max(0, toOffEmu);
    return total;
}

/**
 * Two-cell anchor width in EMU from sheet column metrics. @private
 *
 * @param {number} fromCol0 - The fromCol0 parameter.
 * @param {number} fromColOffEmu - The fromColOffEmu parameter.
 * @param {number} toCol0 - The toCol0 parameter.
 * @param {number} toColOffEmu - The toColOffEmu parameter.
 * @param {SheetMetrics | undefined} metrics - The metrics parameter.
 * @returns {number} - Returns the result.
 */
export function twoCellAnchorWidthEmu(
    fromCol0: number,
    fromColOffEmu: number,
    toCol0: number,
    toColOffEmu: number,
    metrics?: SheetMetrics
): number {
    return twoCellSpanEmu(fromCol0, fromColOffEmu, toCol0, toColOffEmu, (column: number) => columnWidthEmu(column, metrics));
}

/**
 * Two-cell anchor height in EMU from sheet row metrics. @private
 *
 * @param {number} fromRow0 - The fromRow0 parameter.
 * @param {number} fromRowOffEmu - The fromRowOffEmu parameter.
 * @param {number} toRow0 - The toRow0 parameter.
 * @param {number} toRowOffEmu - The toRowOffEmu parameter.
 * @param {SheetMetrics | undefined} metrics - The metrics parameter.
 * @returns {number} - Returns the result.
 */
export function twoCellAnchorHeightEmu(
    fromRow0: number,
    fromRowOffEmu: number,
    toRow0: number,
    toRowOffEmu: number,
    metrics?: SheetMetrics
): number {
    return twoCellSpanEmu(fromRow0, fromRowOffEmu, toRow0, toRowOffEmu, (row: number) => rowHeightEmu(row, metrics));
}

/**
 * Map absolute top/left points (sheet origin) to cell + EMU offsets.
 *
 * @private
 *
 * @param {number} topPt - The topPt parameter.
 * @param {number} leftPt - The leftPt parameter.
 * @param {SheetMetrics} metrics - The metrics parameter.
 * @returns {CellAnchorPlacement} - Returns the result.
 */
export function absolutePointsToAnchor(
    topPt: number,
    leftPt: number,
    metrics?: SheetMetrics
): CellAnchorPlacement {
    requireNonNegativePoints(topPt, 'top');
    requireNonNegativePoints(leftPt, 'left');

    let remainingTop: number = pointsToEmu(topPt);
    let row: number = 1;
    while (row < MAX_ROW_INDEX) {
        const h: number = rowHeightEmu(row, metrics);
        if (remainingTop < h) {
            break;
        }
        remainingTop -= h;
        row += 1;
    }

    let remainingLeft: number = pointsToEmu(leftPt);
    let column: number = 1;
    while (column < MAX_COLUMN_INDEX) {
        const w: number = columnWidthEmu(column, metrics);
        if (remainingLeft < w) {
            break;
        }
        remainingLeft -= w;
        column += 1;
    }

    return {
        row,
        column,
        rowOffEmu: Math.max(0, Math.round(remainingTop)),
        colOffEmu: Math.max(0, Math.round(remainingLeft))
    };
}

/**
 * Absolute top in points from a cell + offset placement.
 *
 * @private
 *
 * @param {Pick<CellAnchorPlacement, 'row' | 'rowOffEmu'>} placement - The placement parameter.
 * @param {SheetMetrics} metrics - The metrics parameter.
 * @returns {number} - Returns the result.
 */
export function anchorToAbsoluteTopPt(
    placement: Pick<CellAnchorPlacement, 'row' | 'rowOffEmu'>,
    metrics?: SheetMetrics
): number {
    let total: number = 0;
    for (let r: number = 1; r < placement.row; r += 1) {
        total += rowHeightEmu(r, metrics);
    }
    total += Math.max(0, placement.rowOffEmu);
    return emuToPoints(total);
}

/**
 * Absolute left in points from a cell + offset placement.
 *
 * @private
 *
 * @param {Pick<CellAnchorPlacement, 'column' | 'colOffEmu'>} placement - The placement parameter.
 * @param {SheetMetrics} metrics - The metrics parameter.
 * @returns {number} - Returns the result.
 */
export function anchorToAbsoluteLeftPt(
    placement: Pick<CellAnchorPlacement, 'column' | 'colOffEmu'>,
    metrics?: SheetMetrics
): number {
    let total: number = 0;
    for (let c: number = 1; c < placement.column; c += 1) {
        total += columnWidthEmu(c, metrics);
    }
    total += Math.max(0, placement.colOffEmu);
    return emuToPoints(total);
}

/**
 * Apply absolute top: rewrite row + rowOffEmu; keep column offsets.
 *
 * @private
 * @param {Object} entry - The entry parameter.
 * @param {number} topPt - The topPt parameter.
 * @param {SheetMetrics} metrics - The metrics parameter.
 * @returns {void} - Returns the result.
 */
export function applyAbsoluteTop(
    entry: { row: number; rowOffEmu: number },
    topPt: number,
    metrics?: SheetMetrics
): void {
    requireNonNegativePoints(topPt, 'top');
    let remainingTop: number = pointsToEmu(topPt);
    let row: number = 1;
    while (row < MAX_ROW_INDEX) {
        const h: number = rowHeightEmu(row, metrics);
        if (remainingTop < h) {
            break;
        }
        remainingTop -= h;
        row += 1;
    }
    entry.row = row;
    entry.rowOffEmu = Math.max(0, Math.round(remainingTop));
}

/**
 * Apply absolute left: rewrite column + colOffEmu; keep row offsets.
 *
 * @private
 * @param {Object} entry - The entry parameter.
 * @param {number} leftPt - The leftPt parameter.
 * @param {SheetMetrics} metrics - The metrics parameter.
 * @returns {void} - Returns the result.
 */
export function applyAbsoluteLeft(
    entry: { column: number; colOffEmu: number },
    leftPt: number,
    metrics?: SheetMetrics
): void {
    requireNonNegativePoints(leftPt, 'left');
    let remainingLeft: number = pointsToEmu(leftPt);
    let column: number = 1;
    while (column < MAX_COLUMN_INDEX) {
        const w: number = columnWidthEmu(column, metrics);
        if (remainingLeft < w) {
            break;
        }
        remainingLeft -= w;
        column += 1;
    }
    entry.column = column;
    entry.colOffEmu = Math.max(0, Math.round(remainingLeft));
}

/**
 * Finite points ≥ 0 (Top/Left allow 0). @private
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {void} - Returns the result.
 */
export function requireNonNegativePoints(value: number, label: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        throw new InvalidArgumentError(`${label} must be a non-negative number of points`);
    }
}

/**
 * Finite points > 0 (width/height). @private
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {void} - Returns the result.
 */
export function requirePositivePoints(value: number, label: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        throw new InvalidArgumentError(`${label} must be a positive number of points`);
    }
}

/**
 * Positive integer (row/column). @private
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {void} - Returns the result.
 */
export function requirePositiveInt(value: number, label: string): void {
    if (!Number.isInteger(value) || value <= 0) {
        throw new InvalidArgumentError(`${label} must be a positive integer`);
    }
}
