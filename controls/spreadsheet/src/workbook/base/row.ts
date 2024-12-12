import { CellModel, SheetModel } from './index';
import { RowModel } from './row-model';
import { ChildProperty, Collection, Property, Complex } from '@syncfusion/ej2-base';
import { Cell } from './cell';
import { FormatModel, Format, ExtendedRowModel } from '../common/index';

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
     * @asptype double
     * @aspDefaultValue 20.0
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

    /** @hidden */
    public isFiltered: boolean;

    /**
     * Represents whether a row in the sheet is read-only or not. If set to true, it prevents editing the specified cell in the sheet.
     *
     * @default false
     */
    @Property(false)
    public isReadOnly: boolean;
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} rowIndex - Specifies the rowIndex.
 * @returns {RowModel} - To get the row.
 */
export function getRow(sheet: SheetModel, rowIndex: number): RowModel {
    return sheet.rows[rowIndex as number];
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} rowIndex - Specifies the rowIndex.
 * @param {RowModel} row - Specifies the row.
 * @returns {void} - To set the row.
 */
export function setRow(sheet: SheetModel, rowIndex: number, row: RowModel): void {
    if (!sheet.rows[rowIndex as number]) {
        sheet.rows[rowIndex as number] = {};
    }
    Object.keys(row).forEach((key: string): void => {
        sheet.rows[rowIndex as number][`${key}`] = row[`${key}`];
    });
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} index - Specifies the index.
 * @returns {boolean} - To return the bool value.
 */
export function isHiddenRow(sheet: SheetModel, index: number): boolean {
    return sheet.rows[index as number] && sheet.rows[index as number].hidden;
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} index - Specifies the index.
 * @returns {boolean} - To return the bool value.
 */
export function isFilterHidden(sheet: SheetModel, index: number): boolean {
    return sheet.rows[index as number] && (sheet.rows[index as number] as ExtendedRowModel).isFiltered;
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} rowIndex - Specifies the rowIndex.
 * @param {boolean} checkDPR - Specifies the bool value.
 * @param {boolean} addHidden - By default hidden rows are considered as 0, set `true` if you want to add the hidden rows height.
 * @returns {number} - To get the row height.
 */
export function getRowHeight(sheet: SheetModel, rowIndex: number, checkDPR?: boolean, addHidden?: boolean): number {
    let hgt: number;
    let stdHeight: number;
    if (sheet && sheet.standardHeight) { stdHeight = sheet.standardHeight; }
    if (sheet && sheet.rows && sheet.rows[rowIndex as number]) {
        if (!addHidden && sheet.rows[rowIndex as number].hidden) { return 0; }
        hgt = sheet.rows[rowIndex as number].height === undefined ?
            (stdHeight === undefined ? 20 : stdHeight) : sheet.rows[rowIndex as number].height;
    } else {
        hgt = stdHeight === undefined ? 20 : stdHeight;
    }
    if (checkDPR && window.devicePixelRatio % 1 > 0) {
        const pointValue: number = (hgt * window.devicePixelRatio) % 1;
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
        if (!sheet.rows[rowIndex as number]) {
            sheet.rows[rowIndex as number] = {};
        }
        sheet.rows[rowIndex as number].height = height;
    }
}
/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} startRow - Specifies the startRow.
 * @param {number} endRow - Specifies the endRow.
 * @param {boolean} checkDPR - Specifies the boolean value.
 * @param {boolean} addHidden - By default hidden rows are considered as 0, set `true` if you want to add the hidden rows height.
 * @returns {number} - To get the rows height.
 */
export function getRowsHeight(
    sheet: SheetModel, startRow: number, endRow: number = startRow, checkDPR?: boolean, addHidden?: boolean): number {
    let height: number = 0;
    let swap: number;
    if (startRow > endRow) {
        swap = startRow;
        startRow = endRow;
        endRow = swap;
    }
    for (let i: number = startRow; i <= endRow; i++) {
        height += getRowHeight(sheet, i, checkDPR, addHidden);
    }
    return height;
}
