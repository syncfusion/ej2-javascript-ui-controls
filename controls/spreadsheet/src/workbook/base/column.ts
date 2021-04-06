import { SheetModel } from './index';
import { ColumnModel } from './column-model';
import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { FormatModel, Format, ValidationModel } from '../common/index';

/**
 * Configures the Column behavior for the spreadsheet.
 */
export class Column extends ChildProperty<Column> {
    /**
     * Specifies index of the column. Based on the index, column properties are applied.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public index: number;

    /**
     * Specifies width of the column.
     *
     * @default 64
     * @asptype int
     */
    @Property(64)
    public width: number;

    /**
     * specifies custom width of the column.
     *
     * @default false
     */
    @Property(false)
    public customWidth: boolean;

    /**
     * To hide/show the column in spreadsheet.
     *
     * @default false
     */
    @Property(false)
    public hidden: boolean;

    /**
     * Specifies format of the column.
     *
     * @default {}
     */
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;

    /**
     * To lock/unlock the column in the protected sheet.
     *
     * @default true
     */
    @Property(true)
    public isLocked: boolean;

    /**
     * Specifies the validation of the column.
     *
     * @default ''
     */
    @Property('')
    public validation: ValidationModel;
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} colIndex - Specifies the colIndex.
 * @returns {ColumnModel} - To get Column.
 */
export function getColumn(sheet: SheetModel, colIndex: number): ColumnModel {
    if (sheet.columns) {
        if (!sheet.columns[colIndex]) {
            sheet.columns[colIndex] = {};
        }
    } else {
        sheet.columns = [];
        sheet.columns[colIndex] = {};
    }
    return sheet.columns[colIndex];
}

/** @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} colIndex - Specifies the colIndex.
 * @param {ColumnModel} column - Specifies the column.
 * @returns {void} - To set Column.
 */
export function setColumn(sheet: SheetModel, colIndex: number, column: ColumnModel): void {
    const curColumn: ColumnModel = getColumn(sheet, colIndex);
    Object.keys(column).forEach((key: string): void => {
        curColumn[key] = column[key];
    });
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} index - Specifies the index.
 * @param {boolean} skipHidden - Specifies the bool.
 * @returns {number} - To get Column width.
 */
export function getColumnWidth(sheet: SheetModel, index: number, skipHidden?: boolean, checkDPR: boolean = true): number {
    let width: number;
    if (sheet && sheet.columns && sheet.columns[index]) {
        if (!skipHidden && sheet.columns[index].hidden) { return 0; }
        width = (sheet.columns[index].width || sheet.columns[index].customWidth) ? sheet.columns[index].width : 64;
    } else {
        width = 64;
    }
    if(checkDPR && window.devicePixelRatio % 1 > 0) {
        return (width % 2 === 0) ? width : width + 1; // Adding 1 to making it as even number
    } else {
        return width;
    }
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} startCol - Specifies the startCol.
 * @param {number} endCol - Specifies the endCol.
 * @returns {number} - returns the column width.
 */
export function getColumnsWidth(sheet: SheetModel, startCol: number, endCol: number = startCol): number {
    let width: number = 0;
    if (startCol > endCol) {
        const swap: number = startCol;
        startCol = endCol;
        endCol = swap;
    }
    for (let i: number = startCol; i <= endCol; i++) {
        width += getColumnWidth(sheet, i);
    }
    return width;
}

/**
 * @hidden
 * @param {SheetModel} sheet - Specifies the sheet.
 * @param {number} index - Specifies the index.
 * @returns {boolean} - returns the boolean value. 
*/
export function isHiddenCol(sheet: SheetModel, index: number): boolean {
    return sheet.columns[index] && sheet.columns[index].hidden;
}
