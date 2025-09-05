import { Browser, KeyboardEventArgs, EventHandler } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { closest, classList } from '@syncfusion/ej2-base';
import { SortSettings } from '../base/grid';
import { Column } from '../models/column';
import { IGrid, IAction, NotifyArgs, EJ2Intance } from '../base/interface';
import { SortDirection, ResponsiveDialogAction } from '../base/enum';
import { setCssInGridPopUp, getActualPropFromColl, isActionPrevent, iterateExtend, parentsUntil } from '../base/util';
import { addRemoveEventListener } from '../base/util';
import * as events from '../base/constant';
import { SortDescriptorModel } from '../base/grid-model';
import { AriaService } from '../services/aria-service';
import { ServiceLocator } from '../services/service-locator';
import { FocusStrategy } from '../services/focus-strategy';
import { ResponsiveDialogRenderer } from '../renderer/responsive-dialog-renderer';
import * as literals from '../base/string-literals';

/**
 *
 * The `Sort` module is used to handle sorting action.
 */
export class Sort implements IAction {
    //Internal variables
    private columnName: string;
    private direction: SortDirection;
    private isMultiSort: boolean;
    private lastSortedCol: string;
    private sortSettings: SortSettings;
    private enableSortMultiTouch: boolean;
    private contentRefresh: boolean = true;
    private isRemove: boolean;
    private sortedColumns: string[];
    private isModelChanged: boolean = true;
    private aria: AriaService = new AriaService();
    private focus: FocusStrategy;
    private lastSortedCols: SortDescriptorModel[];
    private lastCols: string[];
    private evtHandlers: { event: string, handler: Function }[];

    //Module declarations
    /** @hidden */
    public parent: IGrid;
    private currentTarget: Element = null;
    /** @hidden */
    public responsiveDialogRenderer: ResponsiveDialogRenderer;
    /** @hidden */
    public serviceLocator: ServiceLocator;

    /**
     * Constructor for Grid sorting module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {SortSettings} sortSettings - specifies the SortSettings
     * @param {string[]} sortedColumns - specifies the string
     * @param {ServiceLocator} locator - specifies the ServiceLocator
     * @hidden
     */
    constructor(parent?: IGrid, sortSettings?: SortSettings, sortedColumns?: string[], locator?: ServiceLocator) {
        this.parent = parent;
        this.sortSettings = sortSettings;
        this.sortedColumns = sortedColumns;
        this.serviceLocator = locator;
        this.focus = locator.getService<FocusStrategy>('focus');
        this.addEventListener();
        this.setFullScreenDialog();
    }

    /**
     * The function used to update sortSettings
     *
     * @returns {void}
     * @hidden
     */
    public updateModel(): void {
        const sortedColumn: SortDescriptorModel = { field: this.columnName, direction: this.direction };
        let index: number;
        const gCols: string[] = this.parent.groupSettings.columns;
        let flag: boolean = false;
        if (!this.isMultiSort) {
            if (!gCols.length) {
                this.sortSettings.columns = [sortedColumn];
            } else {
                const sortedCols: SortDescriptorModel[] = [];
                for (let i: number = 0, len: number = gCols.length; i < len; i++) {
                    index = this.getSortedColsIndexByField(gCols[parseInt(i.toString(), 10)], sortedCols);
                    if (this.columnName === gCols[parseInt(i.toString(), 10)]) {
                        flag = true;
                        sortedCols.push(sortedColumn);
                    } else {
                        const sCol: SortDescriptorModel = this.getSortColumnFromField(gCols[parseInt(i.toString(), 10)]);
                        sortedCols.push({ field: sCol.field, direction: sCol.direction, isFromGroup: sCol.isFromGroup });
                    }
                }
                if (!flag) {
                    sortedCols.push(sortedColumn);
                }
                this.sortSettings.columns = sortedCols;
            }
        } else {
            index = this.getSortedColsIndexByField(this.columnName);
            if (index > -1) {
                this.sortSettings.columns.splice(index, 1);
            }
            this.sortSettings.columns.push(sortedColumn);
            // eslint-disable-next-line no-self-assign
            this.sortSettings.columns = this.sortSettings.columns;
        }
        this.parent.dataBind();
        this.lastSortedCol = this.columnName;
    }

    /**
     * The function used to trigger onActionComplete
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        const args: Object = !this.isRemove ? {
            columnName: this.columnName, direction: this.direction, requestType: 'sorting', type: events.actionComplete
        } : { requestType: 'sorting', type: events.actionComplete };
        this.isRemove = false;
        this.parent.trigger(events.actionComplete, extend(e, args));
    }

    /**
     * Sorts a column with the given options.
     *
     * @param {string} columnName - Defines the column name to sort.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previously sorted columns are to be maintained.
     * @returns {void}
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        const gObj: IGrid = this.parent;
        if (this.parent.getColumnByField(columnName).allowSorting === false || this.parent.isContextMenuOpen()) {
            this.parent.log('action_disabled_column', {moduleName: this.getModuleName(), columnName: columnName});
            return;
        }
        if (!gObj.allowMultiSorting) {
            isMultiSort = gObj.allowMultiSorting;
        }
        if (this.isActionPrevent()) {
            gObj.notify(
                events.preventBatch,
                {
                    instance: this, handler: this.sortColumn,
                    arg1: columnName, arg2: direction, arg3: isMultiSort
                });
            return;
        }
        this.backupSettings();
        this.columnName = columnName;
        this.direction = direction;
        this.isMultiSort = isMultiSort;
        this.removeSortIcons();
        this.updateSortedCols(columnName, isMultiSort);
        this.updateModel();
    }

    private setFullScreenDialog(): void {
        if (this.serviceLocator) {
            this.serviceLocator.registerAdaptiveService(this, this.parent.enableAdaptiveUI, ResponsiveDialogAction.isSort);
        }
    }

    private backupSettings(): void {
        this.lastSortedCols = iterateExtend(this.sortSettings.columns);
        this.lastCols = this.sortedColumns;
    }

    private restoreSettings(): void {
        this.isModelChanged = false;
        this.isMultiSort = true;
        this.parent.setProperties({ sortSettings: { columns: this.lastSortedCols } }, true);
        //this.parent.sortSettings.columns =  this.lastSortedCols;
        this.sortedColumns = this.lastCols;
        this.isModelChanged = true;
    }

    private updateSortedCols(columnName: string, isMultiSort: boolean): void {
        if (!isMultiSort) {
            if (this.parent.allowGrouping) {
                for (let i: number = 0, len: number = this.sortedColumns.length; i < len; i++) {
                    if (this.parent.groupSettings.columns.indexOf(this.sortedColumns[parseInt(i.toString(), 10)]) < 0) {
                        this.sortedColumns.splice(i, 1);
                        len--;
                        i--;
                    }
                }
            } else {
                this.sortedColumns.splice(0, this.sortedColumns.length);
            }
        }
        if (this.sortedColumns.indexOf(columnName) < 0) {
            this.sortedColumns.push(columnName);
        }
    }

    /**
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (this.contentRefresh) {
            const args: Object = this.sortSettings.columns.length ? {
                columnName: this.columnName, direction: this.direction, requestType: 'sorting',
                type: events.actionBegin, target: this.currentTarget, cancel: false
            } : {
                requestType: 'sorting', type: events.actionBegin, cancel: false,
                target: this.currentTarget
            };
            this.parent.notify(events.modelChanged, args);
        }
        this.refreshSortSettings();
        this.removeSortIcons();
        this.addSortIcons();
    }

    private refreshSortSettings(): void {
        this.sortedColumns.length = 0;
        const sortColumns: SortDescriptorModel[] = this.sortSettings.columns;
        for (let i: number = 0; i < sortColumns.length; i++) {
            if (!sortColumns[parseInt(i.toString(), 10)].isFromGroup) {
                this.sortedColumns.push(sortColumns[parseInt(i.toString(), 10)].field);
            }
        }
    }

    /**
     * Clears all the sorted columns of the Grid.
     *
     * @returns {void}
     */
    public clearSorting(): void {
        const cols: SortDescriptorModel[] = getActualPropFromColl(this.sortSettings.columns);
        if (this.isActionPrevent()) {
            this.parent.notify(events.preventBatch, { instance: this, handler: this.clearSorting });
            return;
        }
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            this.removeSortColumn(cols[parseInt(i.toString(), 10)].field);
        }
    }

    private isActionPrevent(): boolean {
        return isActionPrevent(this.parent);
    }

    /**
     * Remove sorted column by field name.
     *
     * @param {string} field - Defines the column field name to remove sort.
     * @returns {void}
     * @hidden
     */
    public removeSortColumn(field: string): void {
        const gObj: IGrid = this.parent;
        const cols: SortDescriptorModel[] = this.sortSettings.columns;
        if (cols.length === 0 && this.sortedColumns.indexOf(field) < 0) {
            return; }
        if (this.isActionPrevent()) {
            this.parent.notify(events.preventBatch, { instance: this, handler: this.removeSortColumn, arg1: field });
            return;
        }
        this.backupSettings();
        this.removeSortIcons();
        const args: Object = { requestType: 'sorting', type: events.actionBegin, target: this.currentTarget };
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[parseInt(i.toString(), 10)].field === field) {
                if (gObj.allowGrouping && gObj.groupSettings.columns.indexOf(cols[parseInt(i.toString(), 10)].field) > -1) {
                    continue;
                }
                this.sortedColumns.splice(this.sortedColumns.indexOf(cols[parseInt(i.toString(), 10)].field), 1);
                cols.splice(i, 1);
                this.isRemove = true;
                if (this.isModelChanged) {
                    this.parent.notify(events.modelChanged, args);
                }
                break;
            }
        }
        if (!(<{ cancel?: boolean }>args).cancel) {
            this.addSortIcons();
        }
    }

    private getSortedColsIndexByField(field: string, sortedColumns?: SortDescriptorModel[]): number {
        const cols: SortDescriptorModel[] = sortedColumns ? sortedColumns : this.sortSettings.columns;
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            if (cols[parseInt(i.toString(), 10)].field === field) {
                return i;
            }
        }
        return -1;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'sort';
    }

    private initialEnd(): void {
        this.parent.off(events.contentReady, this.initialEnd);
        if (this.parent.getColumns().length && this.sortSettings.columns.length) {
            const gObj: IGrid = this.parent;
            this.contentRefresh = false;
            this.isMultiSort = this.sortSettings.columns.length > 1;
            for (const col of gObj.sortSettings.columns.slice()) {
                if (this.sortedColumns.indexOf(col.field) > -1) {
                    this.sortColumn(col.field, col.direction, true);
                }
            }
            this.isMultiSort = false;
            this.contentRefresh = true;
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.evtHandlers = [{ event: events.setFullScreenDialog, handler: this.setFullScreenDialog },
            { event: events.renderResponsiveChangeAction, handler: this.renderResponsiveChangeAction },
            { event: events.contentReady, handler: this.initialEnd },
            { event: events.sortComplete, handler: this.onActionComplete },
            { event: events.inBoundModelChanged, handler: this.onPropertyChanged },
            { event: events.click, handler: this.clickHandler },
            { event: events.headerRefreshed, handler: this.refreshSortIcons },
            { event: events.keyPressed, handler: this.keyPressed },
            { event: events.cancelBegin, handler: this.cancelBeginEvent },
            { event: events.destroy, handler: this.destroy }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
        EventHandler.add(document.body, 'click', this.excelFilterSortAction, this);
        EventHandler.add(document.body, 'touchend', this.excelFilterSortAction, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        addRemoveEventListener(this.parent, this.evtHandlers, false);
        EventHandler.remove(document.body, 'click', this.excelFilterSortAction);
        EventHandler.remove(document.body, 'touchend', this.excelFilterSortAction);
    }

    private excelFilterSortAction(e: MouseEvent): void {
        const popUp: Element = parentsUntil(e.target as Element, 'e-grid-popup');
        const gridID: string = this.parent.element.id + '_e-popup';
        if (popUp && popUp.id === gridID && parentsUntil(e.target as Element, 'e-excelfilter')) {
            this.excelFilterSortActionHandler(e);
        }
    }

    /**
     * To destroy the sorting
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.isModelChanged = false;
        const gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        if (this.parent.element.querySelector('.e-gridpopup').getElementsByClassName('e-sortdirect').length) {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(<any>this.parent).refreshing && (this.parent.isDestroyed || !this.parent.allowSorting)) {
            this.clearSorting();
        }
        this.isModelChanged = true;
        this.removeEventListener();
    }

    private cancelBeginEvent(e: { requestType: string }): void {
        if (e.requestType === 'sorting') {
            this.restoreSettings();
            this.refreshSortIcons();
            this.isMultiSort = true;
        }
    }

    private clickHandler(e: MouseEvent): void {
        const gObj: IGrid = this.parent;
        this.currentTarget = null;
        this.popUpClickHandler(e);
        const target: Element = closest(e.target as Element, '.e-headercell');
        if (target && !(e.target as Element).classList.contains('e-grptogglebtn') &&
            !(target.classList.contains('e-resized')) &&
            !(e.target as Element).classList.contains('e-rhandler') &&
            !(e.target as Element).classList.contains('e-columnmenu') &&
            !(e.target as Element).classList.contains('e-filtermenudiv') &&
            !parentsUntil(e.target as Element, 'e-stackedheadercell') &&
            !(gObj.allowSelection && gObj.selectionSettings.allowColumnSelection &&
                (e.target as Element).classList.contains('e-headercell'))) {
            const gObj: IGrid = this.parent;
            const colObj: Column = gObj.getColumnByUid(target.querySelector('.e-headercelldiv').getAttribute('data-mappinguid')) as Column;
            if (colObj.type !== 'checkbox') {
                this.initiateSort(target, e, colObj);
                if (Browser.isDevice) {
                    this.showPopUp(e);
                }
            }
        }
        if (target) {
            target.classList.remove('e-resized');
        }
        this.excelFilterSortActionHandler(e);
    }

    private excelFilterSortActionHandler(e: MouseEvent): void {
        if (parentsUntil(e.target as Element, 'e-excel-ascending') || parentsUntil(e.target as Element, 'e-excel-descending')) {
            const colUid: string = (<EJ2Intance>closest(e.target as Element, '.e-filter-popup')).getAttribute('data-uid');
            const direction: SortDirection = isNullOrUndefined(parentsUntil(e.target as Element, 'e-excel-descending')) ?
                'Ascending' : 'Descending';
            this.sortColumn(this.parent.getColumnByUid(colUid).field, direction, false);
        }
    }

    private keyPressed(e: KeyboardEventArgs): void {
        const ele: Element = e.target as Element;
        if (!this.parent.isEdit && (e.action === 'enter' || e.action === 'ctrlEnter' || e.action === 'shiftEnter')
            && closest(ele as Element, '.e-headercell')) {
            const target: Element = this.focus.getFocusedElement();
            if (isNullOrUndefined(target) || !target.classList.contains('e-headercell')
                || !target.querySelector('.e-headercelldiv')) { return; }

            const col: Column = this.parent.getColumnByUid(target.querySelector('.e-headercelldiv').getAttribute('data-mappinguid')) as Column;
            this.initiateSort(target, e, col);
        }
    }

    private initiateSort(target: Element, e: MouseEvent | KeyboardEventArgs, column: Column): void {
        const gObj: IGrid = this.parent;
        const field: string = column.field;
        this.currentTarget = e.target as Element;
        const direction: SortDirection = !target.getElementsByClassName('e-ascending').length ? 'Ascending' :
            'Descending';
        this.isMultiSort = e.ctrlKey || this.enableSortMultiTouch ||
            (navigator.userAgent.indexOf('Mac OS') !== -1 && e.metaKey);
        if (e.shiftKey || (this.sortSettings.allowUnsort && target.getElementsByClassName('e-descending').length)
            && !(gObj.groupSettings.columns.indexOf(field) > -1)) {
            this.removeSortColumn(field);
        } else {
            this.sortColumn(field, direction, this.isMultiSort);
        }
    }

    private showPopUp(e: MouseEvent): void {
        const target: HTMLElement = closest(e.target as Element, '.e-headercell') as HTMLElement;
        if (this.parent.allowMultiSorting && (!isNullOrUndefined(target) || this.parent.isContextMenuOpen())) {
            setCssInGridPopUp(
                <HTMLElement>this.parent.element.querySelector('.e-gridpopup'), e,
                'e-sortdirect e-icons e-icon-sortdirect' + (this.sortedColumns.length > 1 ? ' e-spanclicked' : ''));
        }
    }

    private popUpClickHandler(e: MouseEvent): void {
        const target: Element = e.target as Element;
        if (closest(target, '.e-headercell') || (e.target as HTMLElement).classList.contains(literals.rowCell) ||
            closest(target, '.e-gridpopup')) {
            if (target.classList.contains('e-sortdirect')) {
                if (!target.classList.contains('e-spanclicked')) {
                    target.classList.add('e-spanclicked');
                    this.enableSortMultiTouch = true;
                } else {
                    target.classList.remove('e-spanclicked');
                    this.enableSortMultiTouch = false;
                    (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
                }
            }
        } else {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
    }

    private addSortIcons(): void {
        const gObj: IGrid = this.parent;
        let header: Element;
        let filterElement: Element;
        const cols: SortDescriptorModel[] = this.sortSettings.columns;
        const fieldNames: string[] = this.parent.getColumns().map((c: Column) => c.field);
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            header = gObj.getColumnHeaderByField(cols[parseInt(i.toString(), 10)].field);
            if (fieldNames.indexOf(cols[parseInt(i.toString(), 10)].field) === -1 || isNullOrUndefined(header)) { continue; }
            this.aria.setSort(<HTMLElement>header, (cols[parseInt(i.toString(), 10)].direction).toLowerCase() as SortDirection);
            if (cols.length > 1) {
                header.querySelector('.e-headercelldiv').insertBefore(
                    this.parent.createElement('span', { className: 'e-sortnumber', innerHTML: (i + 1).toString() }),
                    header.querySelector('.e-headertext'));
            }
            filterElement = header.querySelector('.e-sortfilterdiv');
            if (cols[parseInt(i.toString(), 10)].direction === 'Ascending') {
                classList(filterElement, ['e-ascending', 'e-icon-ascending'], []);
            } else {
                classList(filterElement, ['e-descending', 'e-icon-descending'], []);
            }
        }
    }

    private removeSortIcons(position?: number): void {
        const gObj: IGrid = this.parent;
        let header: Element;
        const cols: SortDescriptorModel[] = this.sortSettings.columns;
        const fieldNames: string[] = this.parent.getColumns().map((c: Column) => c.field);
        for (let i: number = position ? position : 0,
            len: number = !isNullOrUndefined(position) ? position + 1 : cols.length; i < len; i++) {
            header = gObj.getColumnHeaderByField(cols[parseInt(i.toString(), 10)].field);
            if (isNullOrUndefined(header) || (gObj.allowGrouping
                && gObj.groupSettings.columns.indexOf(cols[parseInt(i.toString(), 10)].field) > -1
                && !header.querySelector('.e-sortfilterdiv'))) {
                continue;
            }
            if (fieldNames.indexOf(cols[parseInt(i.toString(), 10)].field) === -1) { continue; }
            this.aria.setSort(<HTMLElement>header, 'none');
            classList(
                header.querySelector('.e-sortfilterdiv'), [], ['e-descending', 'e-icon-descending', 'e-ascending', 'e-icon-ascending']);
            if (header.querySelector('.e-sortnumber')) {
                header.querySelector('.e-headercelldiv').removeChild(header.querySelector('.e-sortnumber'));
            }
        }
    }

    private getSortColumnFromField(field: string): SortDescriptorModel {
        for (let i: number = 0, len: number = this.sortSettings.columns.length; i < len; i++) {
            if (this.sortSettings.columns[parseInt(i.toString(), 10)].field === field) {
                return this.sortSettings.columns[parseInt(i.toString(), 10)];
            }
        }
        return false as SortDescriptorModel;
    }

    private updateAriaAttr(): void {
        const fieldNames: string[] = this.parent.getColumns().map((c: Column) => c.field);
        for (const col of this.sortedColumns) {
            if (fieldNames.indexOf(col) === -1) { continue; }
            const header: Element = this.parent.getColumnHeaderByField(col);
            this.aria.setSort(<HTMLElement>header, this.getSortColumnFromField(col).direction);
        }
    }

    private refreshSortIcons(): void {
        this.removeSortIcons();
        this.isMultiSort = true;
        this.removeSortIcons();
        this.addSortIcons();
        this.isMultiSort = false;
        this.updateAriaAttr();
    }

    private renderResponsiveChangeAction(args: { action?: number }): void {
        this.responsiveDialogRenderer.action = args.action;
    }

    /**
     * To show the responsive custom sort dialog
     *
     * @param {boolean} enable - specifes dialog open
     * @returns {void}
     * @hidden
     */
    public showCustomSort(enable: boolean): void {
        this.responsiveDialogRenderer.isCustomDialog = enable;
        this.responsiveDialogRenderer.showResponsiveDialog();
    }
}
