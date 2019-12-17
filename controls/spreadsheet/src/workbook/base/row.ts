import { Property, Collection, ChildProperty } from '@syncfusion/ej2-base';
import { CellModel, SheetModel, RowModel } from './index';
import { Cell } from './cell';

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
     * @default []
     */
    @Collection([], Cell)
    public cells: CellModel[];

    /**
     * Specifies the index to the row. Based on the index, row properties are applied.
     * @default 0
     * @asptype int
     */
    @Property(0)
    public index: number;

    /**
     * Specifies height of the row.
     * @default 20
     * @asptype int
     */
    @Property(20)
    public height: number;

    /**
     * specifies custom height of the row.
     * @default false
     */
    @Property(false)
    public customHeight: boolean;

    /**
     * To hide/show the row in spreadsheet.
     * @default false
     * @hidden
     */
    @Property(false)
    public hidden: boolean;
}

/**
 * @hidden
 */
export function getRow(sheet: SheetModel, rowIndex: number): RowModel {
    return sheet.rows[rowIndex];
}

/** @hidden */
export function setRow(sheet: SheetModel, rowIndex: number, row: RowModel): void {
    if (!sheet.rows[rowIndex]) {
        sheet.rows[rowIndex] = {};
    }
    Object.keys(row).forEach((key: string): void => {
        sheet.rows[rowIndex][key] = row[key];
    });
}
/** @hidden */
export function isHiddenRow(sheet: SheetModel, index: number): boolean {
    return sheet.rows[index] && sheet.rows[index].hidden;
}
/**
 * @hidden
 */
export function getRowHeight(sheet: SheetModel, rowIndex: number): number {
    if (sheet && sheet.rows && sheet.rows[rowIndex]) {
        if (sheet.rows[rowIndex].hidden) { return 0; }
        return sheet.rows[rowIndex].height === undefined ? 20 : sheet.rows[rowIndex].height;
    } else {
        return 20;
    }
}
/**
 * @hidden
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
 */
export function getRowsHeight(sheet: SheetModel, startRow: number, endRow: number = startRow): number {
    let height: number = 0;
    let swap: number;
    if (startRow > endRow) {
        swap = startRow;
        startRow = endRow;
        endRow = swap;
    }
    for (let i: number = startRow; i <= endRow; i++) {
        height += getRowHeight(sheet, i);
    }
    return height;
}
