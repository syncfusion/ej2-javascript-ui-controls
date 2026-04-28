import { TreeGrid } from '../base/treegrid';
import { Grid, InfiniteScroll as GridInfiniteScroll, ActionEventArgs, getRowIndexFromElement, NotifyArgs } from '@syncfusion/ej2-grids';
import { InfiniteScrollArgs, Column, Row, RowRenderer, ServiceLocator, resetRowIndex } from '@syncfusion/ej2-grids';
import { getValue, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { ITreeData } from '../base';
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';
import { findChildrenRecords } from '../utils';

/**
 * TreeGrid Infinite Scroll module will handle Infinite Scrolling.
 *
 * @hidden
 */
export class InfiniteScroll {
    private parent: TreeGrid;
    private visualData: ITreeData[];
    private maxPage: number;
    private treeAction: string;
    private collapsedData: ITreeData;
    private dataBoundFunction: Function;

    /**
     * Constructor for VirtualScroll module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        this.parent = parent;
        Grid.Inject(GridInfiniteScroll);
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} - Returns Logger module name
     */
    protected getModuleName(): string {
        return 'infiniteScroll';
    }
    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on(events.pagingActions, this.infinitePageAction, this);
        this.parent.on('infinite-remote-expand', this.infiniteRemoteExpand, this);
        this.parent.grid.on('delete-complete', this.infiniteDeleteHandler, this);
        this.parent.grid.on('infinite-edit-handler', this.infiniteEditHandler, this);
        this.parent.grid.on('infinite-crud-cancel', this.createRows, this);
        this.parent.grid.on('content-ready', this.contentready, this);
        this.parent.on(events.collapseActionComplete, this.collapseActionComplete, this);
        this.parent.grid.on('data-ready', this.onDataReady, this);
        this.dataBoundFunction = this.dataBound.bind(this);
        this.parent.addEventListener(events.dataBound, this.dataBoundFunction);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('infinite-remote-expand', this.infiniteRemoteExpand);
        this.parent.grid.off('delete-complete', this.infiniteDeleteHandler);
        this.parent.grid.off('infinite-edit-handler', this.infiniteEditHandler);
        this.parent.off(events.pagingActions, this.infinitePageAction);
        this.parent.grid.off('infinite-crud-cancel', this.createRows);
        this.parent.grid.off('content-ready', this.contentready);
        this.parent.off(events.collapseActionComplete, this.collapseActionComplete);
        this.parent.grid.off('data-ready', this.onDataReady);
        this.parent.removeEventListener(events.dataBound, this.dataBoundFunction);
    }

    private dataBound(): void {
        if (this.treeAction === 'collapse') {
            this.treeAction = 'refresh';
            this.makeCollapseRequest();
        } else if (this.treeAction === 'refresh') {
            this.treeAction = null;
        }
    }
    private onDataReady(e: NotifyArgs): void {
        if (!isNullOrUndefined(e.count) && e.requestType !== 'infiniteScroll') {
            this.maxPage = Math.ceil(e.count / this.parent.pageSettings.pageSize);
        }
    }

    private collapseActionComplete(args: { isCollapse: boolean, data: ITreeData, row: HTMLTableRowElement }): void {
        if (!this.parent.infiniteScrollSettings.enableCache && args.isCollapse) {
            const contentBounds: DOMRect | ClientRect = this.parent.getContent().firstElementChild.getBoundingClientRect();
            const tableBounds: DOMRect | ClientRect = this.parent.grid.contentModule.getTable().getBoundingClientRect();
            if (Math.round(tableBounds.bottom - this.parent.grid.getRowHeight()) <= Math.round(contentBounds.bottom)) {
                this.treeAction = 'collapse';
                this.collapsedData = args.data;
                this.makeCollapseRequest(args);
            }
        }
    }

    private makeCollapseRequest(args?: any): void {
        const rows: Element[] = this.parent.getRows();
        const index: number = getRowIndexFromElement(rows[rows.length - 1]);
        const previousPage: number = this.parent.grid.pageSettings.currentPage;
        const nextPage: number = Math.ceil(index / this.parent.grid.pageSettings.pageSize) + 1;
        if ((previousPage >= this.maxPage) || (nextPage > this.maxPage)) {
            return;
        }
        this.parent.grid.pageSettings.currentPage = nextPage;
        this.parent['isInfiniteCollapse'] = true;
        const scrollArg: InfiniteScrollArgs = {
            requestType: 'infiniteScroll',
            currentPage: this.parent.grid.pageSettings.currentPage,
            prevPage: previousPage,
            startIndex: index + 1,
            direction: 'down'
        };
        this.parent.grid.notify('model-changed', scrollArg);
    }

    /**
     * Handles the Expand Collapse action for Remote data with infinite scrolling.
     *
     * @param {{ index: number, childData: ITreeData[] }} args - expanded row index and its child data
     * @param { number } args.index - expanded row index
     * @param { ITreeData[] } args.childData - child data of expanded row
     * @returns {void}
     */
    private infiniteRemoteExpand(args: { index: number, childData: ITreeData[] }): void {
        const rowObjects: Row<Column>[] = this.parent.grid.getRowsObject();
        const locator: string = 'serviceLocator'; const generateRows: string = 'generateRows';
        const serviceLocator: ServiceLocator = this.parent.grid.infiniteScrollModule[`${locator}`];
        const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(serviceLocator, null, this.parent.grid);
        const rows: Element[] = this.parent.getRows();
        const position: string = args.index === rows.length - 1 ? 'after' : 'before';
        const cols: Column[] = this.parent.grid.getColumns();
        const childRowObjects: Row<Column>[] = this.parent.grid.infiniteScrollModule[`${generateRows}`](args.childData, args);
        const childRowElements: Element[] = [];
        for (let i: number = 0; i < childRowObjects.length; i++) {
            childRowElements.push(rowRenderer.render(childRowObjects[parseInt(i.toString(), 10)], cols));
        }
        rowObjects.splice(args.index + 1, 0, ...childRowObjects);
        for (let i: number = 0; i < childRowElements.length; i++) {
            if (position === 'after') {
                rows[args.index + i][`${position}`](childRowElements[parseInt(i.toString(), 10)]);
            } else {
                rows[args.index + i + 1][`${position}`](childRowElements[parseInt(i.toString(), 10)]);
            }
            rows.splice(args.index + 1 + i, 0, childRowElements[parseInt(i.toString(), 10)]);
        }
        resetRowIndex(this.parent.grid, this.parent.grid.getRowsObject(), this.parent.grid.getRows() as HTMLTableRowElement[], 0);
    }

    /**
     * Resetted the row index for expand collapse action for cache support.
     *
     * @returns {void}
     */
    private contentready (): void {
        if (this.parent.infiniteScrollSettings.enableCache && !isNullOrUndefined(this.parent.editModule)) {
            const updateIndex: string = 'updateIndex';
            this.parent.editModule[`${updateIndex}`](this.parent.grid.dataSource, this.parent.getRows(), this.parent.getCurrentViewRecords());
            if (this.parent.getFrozenColumns()) {
                this.parent.editModule[`${updateIndex}`](this.parent.grid.dataSource, this.parent.getDataRows(),
                                                         this.parent.getCurrentViewRecords());
            }
        }
    }

    /**
     * Handles the page query for Data operations and CRUD actions.
     *
     * @param {{ result: ITreeData[], count: number, actionArgs: object }} pageingDetails - data, its count and action details
     * @param {ITreeData[]} pageingDetails.result - data on scroll action
     * @param {number} pageingDetails.count - data count on scroll action
     * @param {Object} pageingDetails.actionArgs - scroll action details
     * @returns {void}
     */
    private infinitePageAction(pageingDetails: { result: ITreeData[], count: number, actionArgs: Object }): void {
        const dm: DataManager = new DataManager(pageingDetails.result);
        const expanded: Predicate = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
        const visualData: ITreeData[] = dm.executeLocal(new Query().where(expanded));
        const actionArgs: ActionEventArgs = getValue('actionArgs', pageingDetails.actionArgs);
        const actions: string[] = getValue('actions', this.parent.grid.infiniteScrollModule);
        if (this.parent.grid.infiniteScrollModule['isInitialRender'] && !this.parent.initialRender) {
            this.parent.grid.pageSettings.currentPage = 1;
        }
        const initial: boolean = actions.some((value: string): boolean => { return value === actionArgs.requestType; });
        const initialRender: boolean = initial ? true : this.parent.initialRender ? true : false;
        this.visualData = visualData;
        pageingDetails.count = visualData.length;
        if (getValue('isPrinting', pageingDetails.actionArgs)) {
            pageingDetails.result = visualData;
        } else {
            let query: Query = new Query();
            const isCache: boolean = this.parent.infiniteScrollSettings.enableCache;
            if (isCache && this.parent.infiniteScrollSettings.initialBlocks > this.parent.infiniteScrollSettings.maxBlocks) {
                this.parent.infiniteScrollSettings.initialBlocks = this.parent.infiniteScrollSettings.maxBlocks;
            }
            const size: number = initialRender ?
                this.parent.grid.pageSettings.pageSize * this.parent.infiniteScrollSettings.initialBlocks :
                this.parent.grid.pageSettings.pageSize;
            const current: number = this.parent.grid.pageSettings.currentPage;
            if (!isNullOrUndefined(actionArgs)) {
                const lastIndex: number = getValue('lastIndex', this.parent.grid.infiniteScrollModule);
                const firstIndex: number = getValue('firstIndex', this.parent.grid.infiniteScrollModule);
                if (!isCache && actionArgs.requestType === 'delete') {
                    const skip: number = lastIndex - (<Object[]>actionArgs.data).length + 1;
                    const take: number = (<Object[]>actionArgs.data).length;
                    if (skip < 0) {
                        query = query.take(take);
                    }
                    else {
                        query = query.skip(skip).take(take);
                    }
                } else if (isCache && actionArgs.requestType === 'delete' ||
                    (actionArgs.requestType === 'save' && actionArgs.action === 'add')) {
                    query = query.skip(firstIndex);
                    query = query.take(this.parent.infiniteScrollSettings.initialBlocks * this.parent.pageSettings.pageSize);
                } else {
                    if (this.treeAction !== 'collapse' && this.treeAction !== 'refresh') {
                        query = query.page(current, size);
                    }
                }
            } else {
                query = query.page(current, size);
            }
            dm.dataSource.json = visualData;
            if (this.treeAction === 'collapse') {
                const rows: HTMLTableRowElement[] = this.parent.getRows();
                const skip: number = getRowIndexFromElement(rows[rows.length - 1]) + 1;
                query = query.skip(skip);
                const renderedChildDataCount: number = this.parent.grid.getRowsObject().filter((record: any) => {
                    return record.data.parentUniqueID === this.collapsedData.uniqueID;
                }).length;
                const remainingChildDataCount: number = this.collapsedData.childRecords.length - renderedChildDataCount;
                if (remainingChildDataCount > 0) {
                    query = query.take(Math.max(remainingChildDataCount, 0));
                }
                else {
                    query = query.take(this.parent.pageSettings.pageSize);
                }
            }
            else if (this.treeAction === 'refresh') {
                const rows: HTMLTableRowElement[] = this.parent.getRows();
                const skip: number = getRowIndexFromElement(rows[rows.length - 1]) + 1;
                query = query.skip(skip);
                query = query.take(this.parent.infiniteScrollSettings.initialBlocks * this.parent.pageSettings.pageSize);
            }
            if (!isCache && !isNullOrUndefined(actionArgs) && actionArgs.requestType === 'save' && actionArgs.action === 'add') {
                pageingDetails.result = [actionArgs.data];
            } else {
                pageingDetails.result = dm.executeLocal(query);
            }
        }
        this.parent.notify('updateAction', pageingDetails);
    }


    /**
     * Handles the currentviewdata for delete operation.
     *
     * @param {{ e: InfiniteScrollArgs, result: Object[] }} args - Scroller and data details
     * @param {InfiniteScrollArgs} args.e -  scroller details while CRUD
     * @param {Object[]} args.result - data details while CRUD
     * @returns {void}
     */
    private infiniteEditHandler(args: { e: InfiniteScrollArgs, result: Object[] }): void {
        const infiniteData: string = 'infiniteCurrentViewData';
        const infiniteCurrentViewData: { [x: number]: Object[] } = this.parent.grid.infiniteScrollModule[`${infiniteData}`];
        const keys: string[] = Object.keys(infiniteCurrentViewData);
        if (args.e.requestType === 'delete' && args.result.length > 1) {
            for (let i: number = 1; i < args.result.length; i++) {
                infiniteCurrentViewData[keys[keys.length - 1]].push(args.result[parseInt(i.toString(), 10)]);
            }
        }
    }


    /**
     * Handles the row objects for delete operation.
     *
     * @param {ActionEventArgs} args - crud action details
     * @returns {void}
     */
    private infiniteDeleteHandler(args: ActionEventArgs): void {
        if (args.requestType === 'delete') {
            const rows: Row<Column>[] = this.parent.grid.getRowsObject();
            const rowElms: Element[] = this.parent.getRows();
            const data: Object[] = args.data instanceof Array ? args.data : [args.data];
            const keyField: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
            this.removeRows(rowElms, rows, data, keyField, true);
            if (this.parent.getFrozenColumns() > 0) {
                const mRows: Row<Column>[] = this.parent.grid.getRowsObject();
                const mRowElms: Element[] = this.parent.grid.getRows();
                this.removeRows(mRowElms, mRows, data, keyField);
            }
        }
    }


    /**
     * Handles the row objects for delete operation.
     *
     * @param {Element[]} rowElms - row elements
     * @param {Row<Column>[]} rows - Row object collection
     * @param {Object[]} data - data collection
     * @param {string} keyField - primary key name
     * @param { boolean} isFrozen - Specifies whether frozen column enabled
     * @returns {void}
     */
    private removeRows(rowElms: Element[], rows: Row<Column>[], data: Object[], keyField: string, isFrozen?: boolean): void {
        const resetInfiniteCurrentViewData: string = 'resetInfiniteCurrentViewData';
        for (let i: number = 0; i < data.length; i++) {
            rows.filter((e: Row<Column>, index: number) => {
                if (e.data[`${keyField}`] === data[parseInt(i.toString(), 10)][`${keyField}`]) {
                    if (isFrozen) {
                        const page: number = Math.ceil((index + 1) / this.parent.grid.pageSettings.pageSize);
                        this.parent.grid.infiniteScrollModule[`${resetInfiniteCurrentViewData}`](page, index);
                    }
                    rows.splice(index, 1);
                    remove(rowElms[parseInt(index.toString(), 10)]);
                    rowElms.splice(index, 1);
                }
            });
        }
    }



    /**
     * Handles the row objects for Add operation.
     */

    private createRows(eventArgs: {
        rows: Row<Column>[], row: Row<Column>[], cancel: boolean, args: { e: ActionEventArgs, result: Object[] },
        isMovable?: boolean, isFrozenRows?: boolean, isFrozenRight?: boolean
    }): void {
        const locator: string = 'serviceLocator';
        const actionArgs: ActionEventArgs = eventArgs.args.e;
        const row: Row<Column>[] = eventArgs.row;
        const serviceLocator: ServiceLocator = this.parent.grid.infiniteScrollModule[`${locator}`];
        const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(serviceLocator, null, this.parent.grid);
        let tbody: HTMLElement;
        const currentData: ITreeData[] = this.parent.getCurrentViewRecords();
        const currentRows: HTMLTableRowElement[] = eventArgs.isMovable ? <HTMLTableRowElement[]>this.parent.grid.getRows()
            : <HTMLTableRowElement[]>this.parent.grid.getDataRows();
        if (eventArgs.isFrozenRight) {
            tbody = this.parent.element.querySelector('.e-frozen-right-content').querySelector('tbody');
        } else {
            tbody = !this.parent.grid.isFrozenGrid() ? this.parent.getContent().querySelector('tbody') : eventArgs.isMovable
                ? this.parent.grid.getContent().querySelector('tbody')
                : this.parent.grid.getContent().querySelector('tbody');
        }
        if (this.parent.frozenRows) {
            tbody = eventArgs.isFrozenRows && this.parent.grid.infiniteScrollModule.requestType !== 'add'
              || !eventArgs.isFrozenRows && this.parent.grid.infiniteScrollModule.requestType === 'add'
                ? !this.parent.grid.isFrozenGrid() ? this.parent.getHeaderContent().querySelector('tbody')
                    : eventArgs.isMovable ? this.parent.grid.getHeaderContent().querySelector('tbody')
                        : eventArgs.isFrozenRight ? this.parent.element.querySelector('.e-frozen-right-header').querySelector('tbody')
                            : this.parent.grid.getHeaderContent().querySelector('tbody') : tbody;
        }
        let position: string;
        const addRowIndex: string = 'addRowIndex';
        let newRowIndex: number = this.parent.editModule[`${addRowIndex}`];
        for (let i: number = 0; i < row.length; i++) {
            const newRow: HTMLTableRowElement = <HTMLTableRowElement>rowRenderer.render(row[parseInt(i.toString(), 10)],
                                                                                        this.parent.grid.getColumns());
            if (actionArgs.requestType === 'save' && actionArgs.action === 'add') {
                if (getValue('selectedIndex', this.parent.editModule) !== -1 && this.parent.editSettings.newRowPosition !== 'Top') {
                    if (this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child') {
                        position = 'after';
                        newRowIndex += findChildrenRecords(currentData[parseInt(newRowIndex.toString(), 10)]).length;
                        if (this.parent.editSettings.newRowPosition === 'Child') {
                            newRowIndex -= 1;    //// for child position already child record is added in childRecords so subtracting 1
                        }
                        currentRows[parseInt(newRowIndex.toString(), 10)][`${position}`](newRow);
                    } else if (this.parent.editSettings.newRowPosition === 'Above') {
                        position = 'before';
                        currentRows[this.parent.editModule[`${addRowIndex}`]][`${position}`](newRow);
                    }
                } else if (this.parent.editSettings.newRowPosition === 'Bottom') {
                    tbody.appendChild(newRow);
                } else {
                    tbody.insertBefore(newRow, tbody.firstElementChild);
                }
            } else if (actionArgs.requestType === 'delete') {
                tbody.appendChild(newRow);
            }
        }
        eventArgs.cancel = true;
    }

    /**
     * To destroy the infiniteScroll module
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
