import { extend, Property, ChildProperty, Complex, Collection, } from '@syncfusion/ej2-base';import { SheetModel } from './index';import { CellStyleModel, HyperlinkModel, CellStyle, wrapEvent, ValidationModel, Chart, ChartModel } from '../common/index';import { ImageModel, Image } from '../common/index';import { getRow } from './index';import { RowModel } from './row-model';import { Workbook } from './workbook';import { getSheet } from './sheet';

/**
 * Interface for a class Cell
 */
export interface CellModel {

    /**
     * Specifies the image of the cell.
     * @default []
     */
    image?: ImageModel[];

    /**
     * Specifies the chart of the cell.
     * @default []
     */
    chart?: ChartModel[];

    /**
     * Defines the value of the cell which can be text or number.
     * @default ''
     */
    value?: string;

    /**
     * Defines the formula or expression of the cell.
     * @default ''
     */
    formula?: string;

    /**
     * Specifies the index of the cell.
     * @default 0
     * @asptype int
     */
    index?: number;

    /**
     * Specifies the number format code to display value in specified number format.
     * @default 'General'
     */
    format?: string;

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
    style?: CellStyleModel;

    /**
     * Specifies the hyperlink of the cell.
     * @default ''
     */
    hyperlink?: string | HyperlinkModel;

    /**
     * Wraps the cell text to the next line, if the text width exceeds the column width.
     * @default false
     */
    wrap?: boolean;

    /**
     * Specifies the cell is locked or not, for allow edit range in spreadsheet protect option.
     * @default null
     */
    isLocked?: boolean;

    /**
     * Specifies the validation of the cell.
     * @default ''
     */
    validation?: ValidationModel;

    /**
     * Specifies the column-wise cell merge count.
     * @default 1
     * @asptype int
     */
    colSpan?: number;

    /**
     * Specifies the row-wise cell merge count.
     * @default 1
     * @asptype int
     */
    rowSpan?: number;

}