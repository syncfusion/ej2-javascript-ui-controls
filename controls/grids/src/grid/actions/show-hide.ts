import { isNullOrUndefined , isBlazor} from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { iterateArrayOrObject } from '../base/util';
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

        for (let i: number = 0; i < columns.length; i++) {
            columns[i].visible = true;
        }

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

        for (let i: number = 0; i < columns.length; i++) {
            columns[i].visible = false;
        }

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
                    (<{columnModel?: Column[]}>this.parent).columnModel, (item: Column, index: number) => {
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
    public setVisible(columns?: Column[], changedStateColumns: Column[] = []): void {
        changedStateColumns = (changedStateColumns.length > 0) ? changedStateColumns :
            isBlazor() ? (JSON.parse(JSON.stringify(columns))) : columns;
        let args: Object = {
            requestType: 'columnstate',
            cancel: false,
            columns: changedStateColumns
        };
        let cancel: string = 'cancel';
        this.parent.trigger(events.actionBegin, args, (showHideArgs: Object) => {
            let currentViewCols: Column[] = this.parent.getColumns();
            columns = isNullOrUndefined(columns) ? currentViewCols : columns;
            if (showHideArgs[cancel]) {
                this.parent.notify(events.resetColumns, {showHideArgs: showHideArgs});
                if (columns.length > 0) {
                    columns[0].visible = true;
                }
                return;
            }
            if (this.parent.allowSelection && this.parent.getSelectedRecords().length) {
                this.parent.clearSelection();
            }
            if (this.parent.enableColumnVirtualization) {
                let colsInCurrentView: Column[] =
                    columns.filter((col1: Column) => (currentViewCols.some((col2: Column) => col1.field === col2.field)));
                if (colsInCurrentView.length) {
                    this.parent.notify(events.columnVisibilityChanged, columns);
                }
            } else {
                this.parent.notify(events.columnVisibilityChanged, columns);
            }
            let params: Object = {
                requestType: 'columnstate',
                columns: changedStateColumns
            };
            this.parent.trigger(events.actionComplete, params);
            if (this.parent.columnQueryMode !== 'All') {
                this.parent.refresh();
            }
        }
        );
    }
}
