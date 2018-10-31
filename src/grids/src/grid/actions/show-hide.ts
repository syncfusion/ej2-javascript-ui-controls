import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { iterateArrayOrObject, isActionPrevent } from '../base/util';
import * as events from '../base/constant';
import { IGrid } from '../base/interface';

/**
 * The `ShowHide` module is used to control column visibility.
 */
export class ShowHide {

    private parent: IGrid;

    /**
     * Constructor for the show hide module.
     * @hidden
     */
    constructor(parent: IGrid) {
        this.parent = parent;
    }

    /** 
     * Shows a column by column name. 
     * @param  {string|string[]} columnName - Defines a single or collection of column names to show. 
     * @param  {string} showBy - Defines the column key either as field name or header text. 
     * @return {void} 
     */
    public show(columnName: string | string[], showBy?: string): void {
        let keys: string[] = this.getToggleFields(columnName);
        let columns: Column[] = this.getColumns(keys, showBy);
        this.parent.notify(events.tooltipDestroy, { module: 'edit' });

        columns.forEach((value: Column) => {
            value.visible = true;
        });

        this.setVisible(columns);
    }

    /** 
     * Hides a column by column name. 
     * @param  {string|string[]} columnName - Defines a single or collection of column names to hide. 
     * @param  {string} hideBy - Defines the column key either as field name or header text. 
     * @return {void} 
     */
    public hide(columnName: string | string[], hideBy?: string): void {
        let keys: string[] = this.getToggleFields(columnName);
        let columns: Column[] = this.getColumns(keys, hideBy);
        this.parent.notify(events.tooltipDestroy, { module: 'edit' });

        columns.forEach((value: Column) => {
            value.visible = false;
        });

        this.setVisible(columns);
    }

    private getToggleFields(key: string | string[]): string[] {
        let finalized: string[] = [];

        if (typeof key === 'string') {
            finalized = [key];
        } else {
            finalized = key;
        }

        return finalized;
    }

    private getColumns(keys: string[], getKeyBy?: string): Column[] {

        let columns: Column[] = iterateArrayOrObject<Column, string>(
            keys, (key: string, index: number) => {

                return iterateArrayOrObject<Column, Column>(
                    <Column[]>this.parent.getColumns(), (item: Column, index: number) => {
                        if (item[getKeyBy] === key) {
                            return item;
                        }
                        return undefined;
                    }
                )[0];

            }
        );

        return columns;
    }

    /**
     * Shows or hides columns by given column collection.
     * @private
     * @param  {Column[]} columns - Specifies the columns.
     * @return {void}
     */
    public setVisible(columns?: Column[]): void {
        if (isActionPrevent(this.parent)) {
            this.parent.notify(
                events.preventBatch,
                {
                    instance: this, handler: this.setVisible,
                    arg1: columns
                });
            return;
        }
        columns = isNullOrUndefined(columns) ? <Column[]>this.parent.getColumns() : columns;
        if (this.parent.allowSelection && this.parent.getSelectedRecords().length) {
            this.parent.clearSelection();
        }
        this.parent.notify(events.columnVisibilityChanged, columns);
        if (this.parent.columnQueryMode !== 'All') {
            this.parent.refresh();
        }
    }
}
