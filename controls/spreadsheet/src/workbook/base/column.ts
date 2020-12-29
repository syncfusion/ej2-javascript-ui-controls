import { SheetModel } from './index';
import { ColumnModel } from './column-model';
import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { FormatModel, Format } from '../common/index';

/**
 * Configures the Column behavior for the spreadsheet.
 */
export class Column extends ChildProperty<Column> {
    /**
     * Specifies index of the column. Based on the index, column properties are applied.
     * @default 0
     * @asptype int
     */
    @Property(0)
    public index: number;

    /**
     * Specifies width of the column.
     * @default 64
     * @asptype int
     */
    @Property(64)
    public width: number;

    /**
     * specifies custom width of the column.
     * @default false
     */
    @Property(false)
    public customWidth: boolean;

    /**
     * To hide/show the column in spreadsheet.
     * @default false
     */
    @Property(false)
    public hidden: boolean;

    /**
     * Specifies format of the column.
     * @default {}
     */
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;

    /**
     * To lock/unlock the column in the protected sheet.
     * @default true
     */
    @Property(true)
    public isLocked: boolean;
}

/**
 * @hidden
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

/** @hidden */
export function setColumn(sheet: SheetModel, colIndex: number, column: ColumnModel): void {
    let curColumn: ColumnModel = getColumn(sheet, colIndex);
    Object.keys(column).forEach((key: string): void => {
        curColumn[key] = column[key];
    });
}

/**
 * @hidden
 */
export function getColumnWidth(sheet: SheetModel, index: number, skipHidden?: boolean): number {
    if (sheet && sheet.columns && sheet.columns[index]) {
        if (!skipHidden && sheet.columns[index].hidden) { return 0; }
        return (sheet.columns[index].width || sheet.columns[index].customWidth) ? sheet.columns[index].width : 64;
    } else {
        return 64;
    }
}

/**
 * @hidden
 */
export function getColumnsWidth(sheet: SheetModel, startCol: number, endCol: number = startCol): number {
    let width: number = 0;
    if (startCol > endCol) {
        let swap: number = startCol;
        startCol = endCol;
        endCol = swap;
    }
    for (let i: number = startCol; i <= endCol; i++) {
        width += getColumnWidth(sheet, i);
    }
    return width;
}

/** @hidden */
export function isHiddenCol(sheet: SheetModel, index: number): boolean {
    return sheet.columns[index] && sheet.columns[index].hidden;
}