import { merge } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
import { CommandModel } from '../base/interface';
/**
 * Cell
 *
 * @hidden
 */
export class Cell<T> {

    public colSpan: number;

    public rowSpan: number;

    public cellType: CellType;

    public visible: boolean;

    public isTemplate: boolean;

    public isDataCell: boolean;

    public isSelected: boolean;

    public isColumnSelected: boolean;

    public column: T;

    public rowID: string;

    public index: number;

    public colIndex: number;

    public className: string;

    public attributes: { [a: string]: Object };

    public isSpanned: boolean = false;

    public cellSpan: number;

    public isRowSpanned: boolean = false;

    public rowSpanRange: number;

    public colSpanRange: number;


    public spanText: string | number | boolean | Date;

    public commands: CommandModel[];

    public isForeignKey: boolean;

    public foreignKeyData: Object;

    constructor(options: { [x: string]: Object }) {
        merge(this, options);
    }

    public clone(): Cell<T> {
        const cell: Cell<T> = new Cell<T>({});
        merge(cell, this);
        return cell;
    }
}
