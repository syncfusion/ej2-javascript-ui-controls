/**
 * Cell-level access to a chart's embedded worksheet (1-based row/column).
 *
 * @public
 */
import { ownDelete, ownGet, ownSet } from '../../core/compat/object-compat';
import { CellValue } from '@syncfusion/ej2-xlsx';
import { Worksheet as IWorksheet } from '@syncfusion/ej2-xlsx';

function columnLetters(column: number): string {
    let letters: string = '';
    let n: number = column;
    while (n > 0) {
        const rem: number = (n - 1) % 26;
        letters = String.fromCharCode(65 + rem) + letters;
        n = Math.floor((n - 1) / 26);
    }
    return letters;
}

function address(row: number, column: number): string {
    if (!(row >= 1) || !(column >= 1) || Math.floor(row) !== row || Math.floor(column) !== column) {
        throw new RangeError('Row and column are 1-based positive integers');
    }
    return columnLetters(column) + row;
}

/**
 * Provides read and write access to the cells of the chart data worksheet.
 *
 * @public
 */
export class ChartData {
    private readonly worksheet: IWorksheet;
    private readonly cells: { [key: string]: { row: number; column: number; value: string | number | boolean } } = {};

    /**
     *  @private
     *
     * @param {IWorksheet} worksheet - The worksheet.
     */
    constructor(worksheet: IWorksheet) {
        this.worksheet = worksheet;
    }

    /**
     * Sets the value of a cell in the chart data worksheet.
     *
     * @param {number} row - The 1-based row index.
     * @param {number} column - The 1-based column index.
     * @param {string | number | boolean | null} value - The new cell value. Pass null to clear the cell.
     * @returns {void} Nothing is returned.
     * @public
     */
    setValue(row: number, column: number, value: string | number | boolean | null): void {
        const addr: string = address(row, column);
        this.worksheet.getCell(addr).value = value;
        if (value === null) {
            ownDelete(this.cells, addr);
        } else {
            ownSet(this.cells, addr, { row, column, value });
        }
    }

    /**
     * Gets the value of a cell in the chart data worksheet.
     *
     * @param {number} row - The 1-based row index.
     * @param {number} column - The 1-based column index.
     * @returns {string | number | boolean | null | undefined} The cell value, or null when the cell is empty.
     * @public
     */
    getValue(row: number, column: number): string | number | boolean | null | undefined {
        const v: CellValue = this.worksheet.getCell(address(row, column)).value;
        const error: { readonly type?: string; readonly code?: string; } = v as { readonly type?: string; readonly code?: string };
        if (v !== null && typeof v === 'object' && error.type === 'error') {
            return error.code;
        }
        return v as string | number | boolean | null;
    }

    /**
     * Gets the A1-style range reference (for example B2:B11) of a block of cells, for use as series values or category labels.
     *
     * @param {number} firstRow - The 1-based first row.
     * @param {number} firstColumn - The 1-based first column.
     * @param {number} lastRow - The 1-based last row.
     * @param {number} lastColumn - The 1-based last column.
     * @returns {string} The range reference.
     * @public
     */
    getRange(firstRow: number, firstColumn: number, lastRow: number, lastColumn: number): string {
        return address(firstRow, firstColumn) + ':' + address(lastRow, lastColumn);
    }

    /**
     *   Record cells already present on a loaded worksheet.
     *
     * @param {Object} entries - The entries.
     * @returns {void} Nothing is returned.
     * @private
     */
    adopt(entries: ReadonlyArray<{ row: number; column: number; value: string | number | boolean }>): void {
        for (const e of entries) {
            this.cells[address(e.row, e.column)] = { row: e.row, column: e.column, value: e.value };
        }
    }

    /**
     * Populated cells in row-major order (used to build the embedded workbook).
     *
     * @returns {Object} The result.
     * @private
     */
    cellEntries(): Array<{ row: number; column: number; value: string | number | boolean }> {
        const out: { row: number; column: number; value: string | number | boolean }[] = Object.keys(this.cells).map((key: string) =>
            ownGet(this.cells, key)
        );
        out.sort(
            (
                a: { row: number; column: number; value: string | number | boolean },
                b: { row: number; column: number; value: string | number | boolean }
            ) => a.row - b.row || a.column - b.column
        );
        return out;
    }
}
