import { merge } from '@syncfusion/ej2-base';
import { Cell } from './cell';

/**
 * Row
 * @hidden
 */
export class Row<T> {

    public uid: string;

    public data: Object;

    public changes: Object;

    public isDirty: boolean;

    public edit: string;

    public isSelected: boolean;

    public isReadOnly: boolean;

    public isAltRow: boolean;

    public isDataRow: boolean;

    public isExpand: boolean;

    public rowSpan: number;

    public cells: Cell<T>[];

    public index: number;

    public indent: number;

    public subRowDetails: Object;

    public height: string;

    public visible: boolean;

    public attributes: { [x: string]: Object };

    public cssClass: string;

    public foreignKeyData: Object;

    constructor(options: { [x: string]: Object }) {
        merge(this, options);
    }

    public clone(): Row<T> {
        let row: Row<T> = new Row<T>({});
        merge(row, this);
        row.cells = this.cells.map((cell: Cell<T>) => cell.clone());
        return row;
    }
}