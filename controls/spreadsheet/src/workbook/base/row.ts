import { CellModel, SheetModel } from './index';
import { RowModel } from './row-model';
import { ChildProperty, Collection, Property, Complex } from '@syncfusion/ej2-base';
import { Cell } from './cell';
import { FormatModel, Format } from '../common/index';

/**
 * Configures the Row behavior for the spreadsheet.
 *  ```html
 * <div id='Spreadsheet'></div>
 * ```
 * ```typescript
 * let spreadsheet: Spreadsheet = new Spreadsheet({
 *      sheets: [{
 *                rows: [{
 *                        index: 30,
 *                        cells: [{ index: 4, value: 'Total Amount:' },
 *                               { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
 *                }]
 * ...
 * });
 * spreadsheet.appendTo('#Spreadsheet');
 * ```
 */
export class Row extends ChildProperty<SheetModel> {
    /**
     * Specifies cell and its properties for the row.
     *
     * @default []
     */
    @Collection([], Cell)
    public cells: CellModel[];

    /**
     * Specifies the index to the row. Based on the index, row properties are applied.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public index: number;

    /**
     * Specifies height of the row.
     *
     * @default 20
     * @asptype int
     */
    @Property(20)
    public height: number;

    /**
     * specifies custom height of the row.
     *
     * @default false
     */
    @Property(false)
    public customHeight: boolean;

    /**
     * To hide/show the row in spreadsheet.
     *
     * @default false
     */
    @Property(false)
    public hidden: boolean;

    /**
     * Specifies format of the row.
     *
     * @default {}
     */
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} rowIndex - Specifies the rowIndex.
 * @returns {RowModel} - To get the row.
 */
export function getRow(sheet: SheetModel, rowIndex: number): RowModel {
    return sheet.rows[rowIndex];
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} rowIndex - Specifies the rowIndex.
 * @param {RowModel} row - Specifies the row.
 * @returns {void} - To set the row.
 */
export function setRow(sheet: SheetModel, rowIndex: number, row: RowModel): void {
    if (!sheet.rows[rowIndex]) {
        sheet.rows[rowIndex] = {};
    }
    Object.keys(row).forEach((key: string): void => {
        sheet.rows[rowIndex][key] = row[key];
    });
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} index - Specifies the index.
 * @returns {boolean} - To return the bool value.
 */
export function isHiddenRow(sheet: SheetModel, index: number): boolean {
    return sheet.rows[index] && sheet.rows[index].hidden;
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} rowIndex - Specifies the rowIndex.
 * @returns {number} - To get the row height.
 */
export function getRowHeight(sheet: SheetModel, rowIndex: number, checkDPR?: boolean): number {
    let hgt: number;
    if (sheet && sheet.rows && sheet.rows[rowIndex]) {
        if (sheet.rows[rowIndex].hidden) { return 0; }
        hgt = sheet.rows[rowIndex].height === undefined ? 20 : sheet.rows[rowIndex].height
    } else {
        hgt = 20;
    }
    if (checkDPR && window.devicePixelRatio % 1 > 0) {
        const pointValue = (hgt * window.devicePixelRatio) % 1;
        return hgt + (pointValue ? ((pointValue > 0.5 ? (1 - pointValue) : -1 * pointValue) / window.devicePixelRatio) : 0);
    } else {
        return hgt;
    }
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} rowIndex - Specifies the rowIndex.
 * @param {number} height - Specifies the height.
 * @returns {void} - To set the row height.
 */
export function setRowHeight(sheet: SheetModel, rowIndex: number, height: number): void {
    if (sheet && sheet.rows) {
        if (!sheet.rows[rowIndex]) {
            sheet.rows[rowIndex] = {};
        }
        sheet.rows[rowIndex].height = height;
    }
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} startRow - Specifies the startRow.
 * @param {number} endRow - Specifies the endRow.
 * @returns {number} - To get the rows height.
 */
export function getRowsHeight(sheet: SheetModel, startRow: number, endRow: number = startRow, checkDPR?: boolean): number {
    let height: number = 0;
    let swap: number;
    if (startRow > endRow) {
        swap = startRow;
        startRow = endRow;
        endRow = swap;
    }
    for (let i: number = startRow; i <= endRow; i++) {
        height += getRowHeight(sheet, i, checkDPR);
    }
    return height;
}
