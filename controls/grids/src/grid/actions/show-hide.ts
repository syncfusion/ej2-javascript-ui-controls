import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { iterateArrayOrObject, isGroupAdaptive, isActionPrevent, addRemoveEventListener } from '../base/util';
import * as events from '../base/constant';
import { IGrid } from '../base/interface';
import { ContentRender } from '../renderer';
import { Grid } from '../base';

/**
 * The `ShowHide` module is used to control column visibility.
 */
export class ShowHide {

    private parent: IGrid;
    private colName : Column[] = [];
    private changedCol: Column[];
    private isShowHide: boolean = false;
    private evtHandlers: { event: string, handler: Function }[];

    /**
     * Constructor for the show hide module.
     *
     * @param {IGrid} parent - specifies the IGrid
     * @hidden
     */
    constructor(parent: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.evtHandlers = [ { event: events.batchCancel, handler: this.batchChanges },
            { event: events.batchCnfrmDlgCancel, handler: this.resetColumnState }
        ];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        addRemoveEventListener(this.parent, this.evtHandlers, false);
    }

    private batchChanges(): void {
        if (this.isShowHide){
            this.isShowHide = false;
            this.setVisible(this.colName, this.changedCol);
            this.changedCol = this.colName = [];
        }
    }

    /**
     * Shows a column by column name.
     *
     * @param  {string|string[]} columnName - Defines a single or collection of column names to show.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @returns {void}
     */
    public show(columnName: string | string[], showBy?: string): void {
        const keys: string[] = this.getToggleFields(columnName);
        const columns: Column[] = this.getColumns(keys, showBy);
        this.parent.notify(events.tooltipDestroy, { module: 'edit' });

        for (let i: number = 0; i < columns.length; i++) {
            columns[parseInt(i.toString(), 10)].visible = true;
        }

        this.setVisible(columns);
    }

    /**
     * Hides a column by column name.
     *
     * @param  {string|string[]} columnName - Defines a single or collection of column names to hide.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @returns {void}
     */
    public hide(columnName: string | string[], hideBy?: string): void {
        const keys: string[] = this.getToggleFields(columnName);
        const columns: Column[] = this.getColumns(keys, hideBy);
        this.parent.notify(events.tooltipDestroy, { module: 'edit' });

        for (let i: number = 0; i < columns.length; i++) {
            columns[parseInt(i.toString(), 10)].visible = false;
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

        const columns: Column[] = iterateArrayOrObject<Column, string>(
            keys, (key: string) => {

                return iterateArrayOrObject<Column, Column>(
                    (<{columnModel?: Column[]}>this.parent).columnModel, (item: Column) => {
                        if (item[`${getKeyBy}`] === key) {
                            return item;
                        }
                        return undefined;
                    }
                )[0];

            }
        );

        return columns;
    }

    private batchActionPrevent(columns?: Column[], changedStateColumns: Column[] = []): boolean {
        if (isActionPrevent(this.parent)) {
            this.colName = columns;
            this.changedCol = changedStateColumns;
            this.parent.closeEdit();
            return false;
        }
        return true;
    }

    public resetColumnState(): void {
        if (this.isShowHide) {
            for (let i: number = 0; i < this.colName.length; i++) {
                this.colName[parseInt(i.toString(), 10)].visible = !this.colName[parseInt(i.toString(), 10)].visible;
            }
        }
    }

    /**
     * Shows or hides columns by given column collection.
     *
     * @private
     * @param {Column[]} columns - Specifies the columns.
     * @param {Column[]} changedStateColumns - specifies the changedStateColumns
     * @returns {void}
     */
    public setVisible(columns?: Column[], changedStateColumns: Column[] = []): void {
        this.isShowHide = true;
        if (!this.batchActionPrevent(columns, changedStateColumns)){
            return;
        }
        changedStateColumns = (changedStateColumns.length > 0) ? changedStateColumns : columns;
        const args: Object = {
            requestType: 'columnstate',
            cancel: false,
            columns: changedStateColumns
        };
        const cancel: string = 'cancel';
        if (this.parent.enableInfiniteScrolling && this.parent.allowGrouping
            && (this.parent as Grid).groupModule.groupSettings.columns.length > 0) {
            (this.parent.contentModule as ContentRender).visibleRows = [];
        }
        this.parent.trigger(events.actionBegin, args, (showHideArgs: Object) => {
            const currentViewCols: Column[] = this.parent.getColumns();
            columns = isNullOrUndefined(columns) ? currentViewCols : columns;
            if (showHideArgs[`${cancel}`]) {
                this.parent.notify(events.resetColumns, {showHideArgs: showHideArgs});
                if (columns.length > 0) {
                    columns[0].visible = true;
                }
                return;
            }
            if ( isGroupAdaptive(this.parent)) {
                this.parent.contentModule.emptyVcRows(); }
            if (this.parent.allowSelection && this.parent.getSelectedRecords().length &&
                !this.parent.selectionSettings.persistSelection) {
                this.parent.clearSelection();
            }
            if (this.parent.enableColumnVirtualization) {
                const colsInCurrentView: Column[] =
                    columns.filter((col1: Column) => (currentViewCols.some((col2: Column) => col1.field === col2.field)));
                if (colsInCurrentView.length) {
                    this.parent.notify(events.columnVisibilityChanged, columns);
                }
            } else {
                if (this.parent.isFrozenGrid() && columns.length) {
                    this.parent.notify(events.refreshFrozenPosition, { isModeChg: true });
                }
                this.parent.notify(events.columnVisibilityChanged, columns);
            }
            const params: Object = {
                requestType: 'columnstate',
                columns: changedStateColumns
            };
            this.parent.trigger(events.actionComplete, params);
            if (this.parent.columnQueryMode !== 'All') {
                this.parent.refresh();
            }
        }
        );
        if (this.parent.autoFit && !this.parent.groupSettings.columns.length) {
            this.parent.preventAdjustColumns();
        }
    }
}
