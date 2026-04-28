import { merge } from '@syncfusion/ej2-base';
import { Cell } from './cell';
import { IGrid } from '../base/interface';
import { DataManager } from '@syncfusion/ej2-data';

/**
 * Row
 *
 * @hidden
 */
export class Row<T> {

    public parent?: IGrid;

    public uid: string;

    public data: Object;

    public tIndex: number;

    public groupDataIndex?: number;

    public isCaptionRow: boolean;

    public isAggregateRow: boolean;

    public changes: Object;

    public isDirty: boolean;

    public aggregatesCount: number;

    public edit: string;

    public isSelected: boolean;

    public isFreezeRow: boolean;

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

    public lazyLoadCssClass: string;

    public foreignKeyData: Object;

    public isDetailRow: boolean;

    public childGrid: IGrid;

    public parentUid: string;

    public isSelectable?: boolean;

    constructor(options: { [x: string]: Object }, parent?: IGrid) {
        merge(this, options);
        this.parent = parent;
    }

    public clone(): Row<T> {
        const row: Row<T> = new Row<T>({});
        merge(row, this);
        row.cells = this.cells.map((cell: Cell<T>) => cell.clone());
        return row;
    }

    /**
     * Replaces the row data and grid refresh the particular row element only.
     *
     * @param  {Object} data - To update new data for the particular row.
     * @returns {void}
     */
    public setRowValue(data: Object): void {
        if (!this.parent) {
            return;
        }
        const key: string | number = this.data[this.parent.getPrimaryKeyFieldNames()[0]];
        this.parent.setRowData(key, data);
    }

    /**
     * Replaces the given field value and refresh the particular cell element only.
     *
     * @param {string} field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     * @returns {void}
     */
    public setCellValue(field: string, value: string | number | boolean | Date | null): void {
        if (!this.parent) {
            return;
        }
        const isValDiff: boolean = !(this.data[`${field}`].toString() === value.toString());
        if (isValDiff) {
            const pKeyField: string = this.parent.getPrimaryKeyFieldNames()[0];
            const key: string | number = this.data[`${pKeyField}`];
            this.parent.setCellValue(key, field, value);
            this.makechanges(pKeyField, this.data);
        } else {
            return;
        }
    }

    private makechanges(key: string, data: Object): void {
        if (!this.parent) {
            return;
        }
        const gObj: IGrid = this.parent;
        const dataManager: DataManager = gObj.getDataModule().dataManager;
        dataManager.update(key, data);
    }
}
