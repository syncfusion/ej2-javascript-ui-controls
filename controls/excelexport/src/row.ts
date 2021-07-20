import { Cells } from './cell';
import { Grouping } from './worksheet';
/**
 * Row class
 * @private
 */
export class Row {
    public height: number;
    public index: number;
    public cells: Cells;
    public spans: string;
    public grouping: Grouping;
}

/**
 * Rows class
 * @private
 */
export class Rows extends Array {
    public add = (row: Row): void => {
            this.push(row);
    }
}