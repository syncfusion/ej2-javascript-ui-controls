import { Property, ChildProperty, Complex, extend } from '@syncfusion/ej2-base';
import { SheetModel, getRowsHeight, getColumnsWidth, CellModel } from './index';
import { CellStyleModel, CellStyle } from '../common/index';
import { getRow } from './row';
import { RowModel } from './row-model';
/**
 * Represents the cell.
 */
export class Cell extends ChildProperty<RowModel> {
    /**
     * Defines the value of the cell which can be text or number with formatting.
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Defines the formula or expression of the cell.
     * @default ''
     */
    @Property('')
    public formula: string;

    /**
     * Specifies the index of the cell.
     * @default 0
     * @asptype int
     */
    @Property(0)
    public index: number;

    /**
     * Specifies the number format code to display value in specified number format.
     * @default 'General'
     */
    @Property('General')
    public format: string;

    /**
     * Specifies the cell style options.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * let spreadsheet: Spreadsheet = new Spreadsheet({
     *      sheets: [{
     *       ...
     *            rows: [{
     *                  cells: [{ value: '12', index: 2,  style: { fontWeight: 'bold', fontSize: 12, fontStyle: 'italic', textIndent: '2pt' 
     *                         backgroundColor: '#4b5366', color: '#ffffff' } }]
     *                  }]
     *            }]
     *  });
     * spreadsheet.appendTo('#Spreadsheet');
     * ```
     * @default {}
     */
    @Complex<CellStyleModel>({}, CellStyle)
    public style: CellStyleModel;
}

/**
 * @hidden
 */
export function getCell(rowIndex: number, colIndex: number, sheet: SheetModel, isInitRow?: boolean): CellModel {
    let row: RowModel = getRow(sheet, rowIndex);
    if (!row || !row.cells) {
        if (isInitRow) {
            if (!row) {
                sheet.rows[rowIndex] = { cells: [] };
            } else {
                sheet.rows[rowIndex].cells = [];
            }
        } else {
            return null;
        }
    }
    return sheet.rows[rowIndex].cells[colIndex];
}

/**
 * @hidden
 */
export function setCell(rowIndex: number, colIndex: number, sheet: SheetModel, cell: CellModel, isExtend?: boolean): void {
    if (!sheet.rows[rowIndex]) {
        sheet.rows[rowIndex] = { cells: [] };
    } else if (!sheet.rows[rowIndex].cells) {
        sheet.rows[rowIndex].cells = [];
    }
    if (isExtend && sheet.rows[rowIndex].cells[colIndex]) {
        extend(sheet.rows[rowIndex].cells[colIndex], cell, null, true);
    } else {
        sheet.rows[rowIndex].cells[colIndex] = cell;
    }
}

/**
 * @hidden
 */
export function getCellPosition(sheet: SheetModel, indexes: number[]): { top: number, left: number } {
    let i: number;
    let top: number = 0;
    let left: number = 0;
    for (i = 0; i < indexes[0]; i++) {
        top += getRowsHeight(sheet, i);
    }
    for (i = 0; i < indexes[1]; i++) {
        left += getColumnsWidth(sheet, i);
    }
    return { top: top, left: left };
}

/** @hidden */
export function skipDefaultValue(style: CellStyleModel, defaultKey?: boolean): CellStyleModel {
    let defaultProps: CellStyleModel = { fontFamily: 'Calibri', verticalAlign: 'bottom', textIndent: '0pt', backgroundColor: '#ffffff',
        color: '#000000', textAlign: 'left', fontSize: '11pt', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none'};
    let changedProps: CellStyleModel = {};
    Object.keys(defaultKey ? defaultProps : style).forEach((propName: string): void => {
        if (style[propName] !== defaultProps[propName]) {
            changedProps[propName] = style[propName];
        }
    });
    return changedProps;
}