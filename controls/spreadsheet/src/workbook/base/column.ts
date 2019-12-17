import { SheetModel, ColumnModel } from './index';
import { Property, ChildProperty } from '@syncfusion/ej2-base';

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
     * @hidden
     */
    @Property(false)
    public hidden: boolean;
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

/**
 * @hidden
 */
export function getColumnWidth(sheet: SheetModel, index: number): number {
    if (sheet && sheet.columns && sheet.columns[index] && (sheet.columns[index].width || sheet.columns[index].customWidth)) {
        return sheet.columns[index].width;
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
    return sheet.columns[index] && (sheet.columns[index].hidden || (sheet.columns[index].width !== undefined &&
        sheet.columns[index].width === 0));
}