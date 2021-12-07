import { CellStyle } from './cell-style';
/**
 * Worksheet class
 * @private
 */
export class Cell {
    public index: number;
    public rowSpan: number;
    public colSpan: number;
    public value: string | Date | number | boolean;
    public formula: string;
    public cellStyle: CellStyle;
    public styleIndex: number;
    public sharedStringIndex: number;
    public saveType: string;
    public type: string;
    public refName: string;
}

/**
 * Cells class
 * @private
 */
export class Cells extends Array {
    public add = (cell: Cell): void => {
        let inserted: boolean = false;
        let count: number = 0;
        for (let c of this) {
            if (c.index === cell.index) {
                this[count] = cell;
                inserted = true;
            }
            count++;
        }
        if (!inserted) {
            this.push(cell);
        }
    }
}