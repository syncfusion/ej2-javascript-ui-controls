import { CellModel, SheetModel } from './index';import { ChildProperty, Collection, Property, Complex } from '@syncfusion/ej2-base';import { Cell } from './cell';import { FormatModel, Format } from '../common/index';

/**
 * Interface for a class Row
 */
export interface RowModel {

    /**
     * Specifies cell and its properties for the row.
     *
     * @default []
     */
    cells?: CellModel[];

    /**
     * Specifies the index to the row. Based on the index, row properties are applied.
     *
     * @default 0
     * @asptype int
     */
    index?: number;

    /**
     * Specifies height of the row.
     *
     * @default 20
     * @asptype int
     */
    height?: number;

    /**
     * specifies custom height of the row.
     *
     * @default false
     */
    customHeight?: boolean;

    /**
     * To hide/show the row in spreadsheet.
     *
     * @default false
     */
    hidden?: boolean;

    /**
     * Specifies format of the row.
     *
     * @default {}
     */
    format?: FormatModel;

}