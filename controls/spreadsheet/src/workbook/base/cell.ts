import { extend, Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { SheetModel } from './index';
import { CellStyleModel, HyperlinkModel, CellStyle, wrapEvent, ValidationModel } from '../common/index';
import { getRow } from './row';
import { RowModel } from './row-model';
import { CellModel } from './cell-model';
import { Workbook } from './workbook';
import { getSheet } from './sheet';
/**
 * Represents the cell.
 */
export class Cell extends ChildProperty<RowModel> {
    /**
     * Defines the value of the cell which can be text or number.
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

    /**
     * Specifies the hyperlink of the cell.
     * @default ''
     */
    @Property('')
    public hyperlink: string | HyperlinkModel;

    /**
     * Wraps the cell text to the next line, if the text width exceeds the column width.
     * @default false
     */
    @Property(false)
    public wrap: boolean;

    /**
     * Specifies the cell is locked or not, for allow edit range in spreadsheet protect option.
     * @default true
     */
    @Property(true)
    public isLocked: boolean;


    /**
     * Specifies the validation of the cell.
     * @default ''
     */
    @Property('')
    public validation: ValidationModel;

    /**
     * Specifies the column-wise cell merge count.
     * @default 1
     * @asptype int
     */
    @Property(1)
    public colSpan: number;

    /**
     * Specifies the row-wise cell merge count.
     * @default 1
     * @asptype int
     */
    @Property(1)
    public rowSpan: number;
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
    return sheet.rows[rowIndex].cells[colIndex] || null;
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

/** @hidden */
export function skipDefaultValue(style: CellStyleModel, defaultKey?: boolean): CellStyleModel {
    let defaultProps: CellStyleModel = { fontFamily: 'Calibri', verticalAlign: 'bottom', textIndent: '0pt', backgroundColor: '#ffffff',
        color: '#000000', textAlign: 'left', fontSize: '11pt', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none',
        border: '', borderLeft: '', borderTop: '', borderRight: '', borderBottom: '' };
    let changedProps: CellStyleModel = {};
    Object.keys(defaultKey ? defaultProps : style).forEach((propName: string): void => {
        if (style[propName] !== defaultProps[propName]) {
            changedProps[propName] = style[propName];
        }
    });
    return changedProps;
}

/** @hidden */
export function wrap(address: string, wrap: boolean = true, context?: Workbook): void {
    let addressInfo: { sheetIndex: number, indices: number[] } = context.getAddressInfo(address);
    let rng: number[] = addressInfo.indices;
    let sheet: SheetModel = getSheet(context, addressInfo.sheetIndex);
    for (let i: number = rng[0]; i <= rng[2]; i++) {
        for (let j: number = rng[1]; j <= rng[3]; j++) {
            setCell(i, j, sheet, { wrap: wrap }, true);
        }
    }
    context.setProperties({ sheets: context.sheets }, true);
    context.notify(wrapEvent, { range: rng, wrap: wrap, sheet: sheet });
}
