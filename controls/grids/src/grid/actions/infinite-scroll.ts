import { isNullOrUndefined, remove, extend } from '@syncfusion/ej2-base';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { IGrid, IAction, NotifyArgs, InfiniteScrollArgs, CellFocusArgs, KeyboardEventArgs, IModelGenerator, SaveEventArgs, AddEventArgs } from '../base/interface';
import { RowModelGenerator } from '../services/row-model-generator';
import { RowRenderer } from '../renderer/row-renderer';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';
import { Row } from '../models/row';
import * as events from '../base/constant';
import { Grid } from '../base/grid';
import { getScrollBarWidth, getEditedDataIndex, resetRowIndex, setRowElements, getRowIndexFromElement, getGroupKeysAndFields, getPredicates, generateExpandPredicates } from '../base/util';
import { Action, freezeTable, FocusKeys } from '../base/enum';
import { ColumnWidthService } from '../services/width-controller';
import * as literals from '../base/string-literals';
import { GroupedData } from '../services/group-model-generator';

/**
 * Infinite Scrolling class
 *
 * @hidden
 */
export class InfiniteScroll implements IAction {
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private maxPage: number;
    private actionBeginFunction: () => void;
    private actionCompleteFunction: () => void;
    private dataBoundFunction: Function;
    private infiniteCache: { [x: number]: Row<Column>[] } = {};
    private infiniteCurrentViewData: { [x: number]: Object[] } = {};
    private isDownScroll: boolean = false;
    private isUpScroll: boolean = false;
    private isScroll: boolean = true;
    private top: number;
    private enableContinuousScroll: boolean = false;
    private initialRender: boolean = true;
    private pressedKey: FocusKeys;
    private isRemove: boolean = false;
    private isInitialCollapse: boolean = false;
    protected prevScrollTop: number = 0;
    private actions: string[] = ['filtering', 'searching', 'grouping', 'ungrouping', 'reorder', 'sorting', 'refresh'];
    private keys: FocusKeys[] = [literals.downArrow, literals.upArrow, literals.enter, literals.shiftEnter];
    private rowIndex: number;
    protected cellIndex: number;
    private rowTop: number = 0;
    private empty: number | string;
    private editRowIndex: number;
    private virtualInfiniteData: Object = {};
    private isAdd: boolean;
    private isEdit: boolean;
    private isCancel: boolean = false;
    private emptyRowData: Object = {};
    private isNormaledit: boolean = false;
    /** @hidden */
    public requestType: Action;
    private firstBlock: number;
    private firstIndex: number;
    private lastIndex: number;
    private rowModelGenerator: IModelGenerator<Column>;
    private isInfiniteScroll: boolean = false;
    private isLastPage: boolean = false;
    private isInitialRender: boolean = true;
    private isFocusScroll: boolean = false;
    private lastFocusInfo: { rowIdx: number, cellIdx: number };
    private isGroupCollapse: boolean = false;
    private parentCapUid: string;
    private groupCaptionAction: string;
    protected widthService: ColumnWidthService;
    private addRowIndex: number;
    /** @hidden */
    public infiniteDetailDestroy: boolean = false;

    /**
     * Constructor for the Grid infinite scrolling.
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the ServiceLocator
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.isNormaledit = this.parent.editSettings.mode === 'Normal';
        this.addEventListener();
        this.widthService = serviceLocator.getService<ColumnWidthService>('widthService');
        this.rowModelGenerator = new RowModelGenerator(this.parent);
    }

    public getModuleName(): string {
        return 'infiniteScroll';
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on(events.dataReady, this.onDataReady, this);
        this.parent.on(events.dataSourceModified, this.dataSourceModified, this);
        this.parent.on(events.infinitePageQuery, this.infinitePageQuery, this);
        this.parent.on(events.infiniteScrollHandler, this.infiniteScrollHandler, this);
        this.parent.on(events.beforeCellFocused, this.infiniteCellFocus, this);
        this.parent.on(events.appendInfiniteContent, this.appendInfiniteRows, this);
        this.parent.on(events.removeInfiniteRows, this.removeInfiniteCacheRows, this);
        this.parent.on(events.resetInfiniteBlocks, this.resetInfiniteBlocks, this);
        this.parent.on(events.setInfiniteCache, this.setCache, this);
        this.parent.on(events.initialCollapse, this.ensureIntialCollapse, this);
        this.parent.on(events.keyPressed, this.infiniteCellFocus, this);
        this.parent.on(events.infiniteShowHide, this.setDisplayNone, this);
        this.parent.on(events.virtualScrollEditActionBegin, this.editActionBegin, this);
        this.parent.on(events.getVirtualData, this.getVirtualInfiniteData, this);
        this.parent.on(events.editReset, this.resetInfiniteEdit, this);
        this.parent.on(events.virtualScrollEditSuccess, this.infiniteEditSuccess, this);
        this.parent.on(events.refreshVirtualCache, this.refreshInfiniteCache, this);
        this.parent.on(events.refreshInfiniteEditrowindex, this.refreshInfiniteEditrowindex, this);
        this.parent.on(events.infiniteEditHandler, this.infiniteEditHandler, this);
        this.parent.on(events.virtualScrollAddActionBegin, this.infiniteAddActionBegin, this);
        this.parent.on(events.modelChanged, this.modelChanged, this);
        this.parent.on(events.refreshInfiniteCurrentViewData, this.refreshInfiniteCurrentViewData, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.contentReady, this.selectNewRow, this);
        this.parent.on(events.captionActionComplete, this.captionActionComplete, this);
        this.parent.on(events.setVirtualPageQuery, this.setGroupCollapsePageQuery, this);
        this.parent.on(events.infiniteScrollComplete, this.onActionComplete, this);
        this.actionBeginFunction = this.actionBegin.bind(this);
        this.actionCompleteFunction = this.actionComplete.bind(this);
        this.dataBoundFunction = this.dataBound.bind(this);
        this.parent.addEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.addEventListener(events.dataBound, this.dataBoundFunction);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.dataReady, this.onDataReady);
        this.parent.off(events.dataSourceModified, this.dataSourceModified);
        this.parent.off(events.infinitePageQuery, this.infinitePageQuery);
        this.parent.off(events.infiniteScrollHandler, this.infiniteScrollHandler);
        this.parent.off(events.beforeCellFocused, this.infiniteCellFocus);
        this.parent.off(events.appendInfiniteContent, this.appendInfiniteRows);
        this.parent.off(events.removeInfiniteRows, this.removeInfiniteCacheRows);
        this.parent.off(events.resetInfiniteBlocks, this.resetInfiniteBlocks);
        this.parent.off(events.setInfiniteCache, this.setCache);
        this.parent.off(events.initialCollapse, this.ensureIntialCollapse);
        this.parent.off(events.keyPressed, this.infiniteCellFocus);
        this.parent.off(events.infiniteShowHide, this.setDisplayNone);
        this.parent.off(events.virtualScrollEditActionBegin, this.editActionBegin);
        this.parent.off(events.getVirtualData, this.getVirtualInfiniteData);
        this.parent.off(events.editReset, this.resetInfiniteEdit);
        this.parent.off(events.virtualScrollEditSuccess, this.infiniteEditSuccess);
        this.parent.off(events.refreshVirtualCache, this.refreshInfiniteCache);
        this.parent.on(events.refreshInfiniteEditrowindex, this.refreshInfiniteEditrowindex);
        this.parent.off(events.infiniteEditHandler, this.infiniteEditHandler);
        this.parent.off(events.virtualScrollAddActionBegin, this.infiniteAddActionBegin);
        this.parent.off(events.modelChanged, this.modelChanged);
        this.parent.off(events.refreshInfiniteCurrentViewData, this.refreshInfiniteCurrentViewData);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.contentReady, this.selectNewRow);
        this.parent.off(events.captionActionComplete, this.captionActionComplete);
        this.parent.off(events.setVirtualPageQuery, this.setGroupCollapsePageQuery);
        this.parent.off(events.infiniteScrollComplete, this.onActionComplete);
        this.parent.removeEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.removeEventListener(events.dataBound, this.dataBoundFunction);
    }

    private dataBound(): void {
        if (this.groupCaptionAction === 'collapse') {
            this.groupCaptionAction = 'refresh';
            this.makeGroupCollapseRequest();
        } else if (this.groupCaptionAction === 'refresh') {
            this.parent.hideSpinner();
            this.groupCaptionAction = this.empty as string;
        }
    }

    private setGroupCollapsePageQuery(args: { query: Query, skipPage: boolean }): void {
        const gObj: IGrid = this.parent;
        if (!gObj.infiniteScrollSettings.enableCache && this.isGroupCollapse) {
            args.skipPage = true; this.isGroupCollapse = false;
            if (this.groupCaptionAction === 'collapse') {
                const captionRow: Row<Column> = gObj.getRowObjectFromUID(this.parentCapUid);
                const rowObjs: Row<Column>[] = gObj.getRowsObject();
                let childCount: number = 0;
                for (let i: number = rowObjs.length - 1; i >= 0; i--) {
                    if (rowObjs[parseInt(i.toString(), 10)].indent === captionRow.indent) {
                        break;
                    }
                    if (rowObjs[parseInt(i.toString(), 10)].isDataRow) {
                        childCount++;
                    }
                }
                const key: { fields: string[], keys: string[] } = getGroupKeysAndFields(rowObjs.indexOf(captionRow), rowObjs);
                let pred: Predicate = generateExpandPredicates(key.fields, key.keys, this);
                const predicateList: Predicate[] = getPredicates(pred);
                pred = predicateList[predicateList.length - 1];
                for (let i: number = predicateList.length - 2; i >= 0; i--) {
                    pred = pred.and(predicateList[parseInt(i.toString(), 10)]);
                }
                args.query.where(pred);
                args.query.skip(childCount);
                this.parentCapUid = this.empty as string;
            } else {
                const rows: Element[] = gObj.getRows(); const size: number = gObj.pageSettings.pageSize;
                const skip: number = getRowIndexFromElement(rows[rows.length - 1]) + 1;
                let additionalCnt: number = ((skip - (skip % size)) + size) - skip;
                if ((skip % size) === 0) { additionalCnt = 0; }
                args.query.skip(skip);
                args.query.take((gObj.infiniteScrollSettings.initialBlocks * gObj.pageSettings.pageSize) + additionalCnt);
            }
        }
    }

    private captionActionComplete(args: { isCollapse: boolean, parentUid: string }): void {
        const gObj: IGrid = this.parent;
        if (!gObj.infiniteScrollSettings.enableCache && args.isCollapse) {
            const contetRect: DOMRect | ClientRect = gObj.getContent().firstElementChild.getBoundingClientRect();
            const tableReact: DOMRect | ClientRect = gObj.contentModule.getTable().getBoundingClientRect();
            if (Math.round(tableReact.bottom - gObj.getRowHeight()) <= Math.round(contetRect.bottom)) {
                this.parentCapUid = args.parentUid; this.groupCaptionAction = 'collapse';
                gObj.showSpinner(); const caption: Row<Column> = gObj.getRowObjectFromUID(args.parentUid);
                const childCount: boolean = this.getCaptionChildCount(caption);
                if (!childCount) {
                    this.groupCaptionAction = 'refresh';
                    this.makeGroupCollapseRequest();
                } else {
                    this.makeGroupCollapseRequest(args.parentUid);
                }
            }
        }
    }

    private makeGroupCollapseRequest(parentUid?: string): void {
        const gObj: IGrid = this.parent;
        const captionRows: Element[] = [].slice.call(gObj.getContentTable().querySelectorAll('tr'));
        const rows: Element[] = gObj.groupSettings.enableLazyLoading ? captionRows : gObj.getRows();
        const index: number = !gObj.groupSettings.enableLazyLoading ? getRowIndexFromElement(rows[rows.length - 1]) :
            gObj.contentModule['visibleRows'].length - 1;
        const prevPage: number = this.parent.pageSettings.currentPage;
        const nextPage: number = Math.ceil(index / this.parent.pageSettings.pageSize) + 1;
        if ((prevPage >= this.maxPage) || (nextPage > this.maxPage)) {
            gObj.hideSpinner();
            return;
        }
        this.parent.pageSettings.currentPage = nextPage;
        const scrollArg: InfiniteScrollArgs = {
            requestType: 'infiniteScroll',
            currentPage: this.parent.pageSettings.currentPage,
            prevPage: prevPage,
            startIndex: index + 1,
            direction: 'down',
            isCaptionCollapse: true,
            parentUid: parentUid
        };
        this.isGroupCollapse = true;
        this.parent.notify('model-changed', scrollArg);
    }

    private getCaptionChildCount(caption: Row<Column>): boolean {
        const rowObj: Row<Column>[] = this.parent.getRowsObject();
        const index: number = rowObj.indexOf(caption); let make: boolean = false;
        for (let i: number = index; i < rowObj.length; i++) {
            if ((rowObj[parseInt(i.toString(), 10)].indent === caption.indent || rowObj[parseInt(i.toString(), 10)].indent < caption.indent)
                && (rowObj[parseInt(i.toString(), 10)].data as GroupedData).key !== (caption.data as GroupedData).key) {
                break;
            }
            if (rowObj[parseInt(i.toString(), 10)].isCaptionRow && !this.childCheck(rowObj, rowObj[parseInt(i.toString(), 10)], i)) {
                make = true; break;
            }
        }
        return make;
    }

    private childCheck(rowObj: Row<Column>[], row: Row<Column>, index: number): boolean {
        let childCount: number = 0;
        for (let i: number = index + 1; i < rowObj.length; i++) {
            if (rowObj[parseInt(i.toString(), 10)].indent === row.indent) { break; }
            if (rowObj[parseInt(i.toString(), 10)].indent === (row.indent + 1)
                && rowObj[parseInt(i.toString(), 10)].parentUid === row.uid) {
                childCount++;
            }
        }
        return (row.data as GroupedData).count === childCount;
    }

    private updateCurrentViewData(): void {
        const gObj: IGrid = this.parent;
        if (gObj.groupSettings.columns.length) {
            return;
        }
        const keys: string[] = Object.keys(this.infiniteCurrentViewData);
        gObj.currentViewData = [];
        const page: number = gObj.pageSettings.currentPage;
        const isCache: boolean = gObj.infiniteScrollSettings.enableCache;
        const blocks: number = gObj.infiniteScrollSettings.maxBlocks;
        const isMiddlePage: boolean = isCache && (page > blocks || (this.isUpScroll && page > 1));
        const start: number = isMiddlePage ? this.isUpScroll ? page : (page - blocks) + 1 : 1;
        const end: number = isMiddlePage ? (start + blocks) - 1 : isCache ? blocks : keys.length;
        for (let i: number = start; i <= end; i++) {
            if (this.infiniteCurrentViewData[parseInt(i.toString(), 10)]) {
                gObj.currentViewData = gObj.currentViewData.concat(this.infiniteCurrentViewData[parseInt(i.toString(), 10)]);
            }
        }
    }

    private refreshInfiniteCurrentViewData(e: { args: NotifyArgs, data: Object[] }): void {
        const gObj: IGrid = this.parent;
        const infiniteDetailModified: boolean = gObj.enableInfiniteScrolling && (gObj.childGrid || gObj.detailTemplate)
        && ((e.args.action === 'add' && e.args.requestType === 'save') || e.args.requestType === 'delete');
        if (e.args.action === 'add' && e.args.requestType === 'save' && !infiniteDetailModified) {
            this.parent.pageSettings.currentPage = Math.ceil(e.args['index'] / this.parent.pageSettings.pageSize) ?
                Math.ceil(e.args['index'] / this.parent.pageSettings.pageSize) : 1;
        }
        const page: number = this.parent.pageSettings.currentPage;
        const size: number = this.parent.pageSettings.pageSize;
        const blocks: number = this.parent.infiniteScrollSettings.initialBlocks;
        const keys: string[] = Object.keys(this.infiniteCurrentViewData);
        const cache: boolean = this.parent.infiniteScrollSettings.enableCache;
        if (!this.parent.groupSettings.columns.length) {
            const isAdd: boolean = e.args.requestType === 'save' && !(this.parent.sortSettings.columns.length
                || this.parent.filterSettings.columns.length || this.parent.groupSettings.columns.length
                || this.parent.searchSettings.key);
            const isDelete: boolean = e.args.requestType === 'delete';
            if (!cache && (isAdd || isDelete) && !infiniteDetailModified) {
                if (isAdd) {
                    let indexCount: number = 0;
                    for (let i: number = 1; i <= keys.length; i++) {
                        indexCount += this.infiniteCurrentViewData[parseInt(i.toString(), 10)].length - 1;
                        if ((e.args as AddEventArgs).index <= indexCount) {
                            this.resetCurrentViewData(i);
                            this.infiniteCurrentViewData[parseInt(i.toString(), 10)]
                                .splice((e.args as AddEventArgs).index, 0, (e.args as AddEventArgs).data);
                            break;
                        }
                    }
                } else {
                    this.infiniteCurrentViewData[keys[keys.length - 1]].push(e.data[0]);
                }
            } else {
                if (blocks > 1 && e.data.length === (blocks * size)) {
                    if (infiniteDetailModified) {
                        this.infiniteCurrentViewData = {};
                        this.firstBlock = 1;
                    }
                    this.setInitialCache(e.data.slice() as Row<Column>[], {}, cache && e.args.requestType === 'delete', true);
                } else {
                    this.infiniteCurrentViewData[parseInt(page.toString(), 10)] = e.data.slice();
                }
            }
        }
    }

    private resetCurrentViewData(startIndex: number): void {
        const keys: string[] = Object.keys(this.infiniteCurrentViewData);
        for (let i: number = startIndex; i <= keys.length; i++) {
            const lastViewData: Object = this.infiniteCurrentViewData[parseInt(i.toString(), 10)][this
                .infiniteCurrentViewData[parseInt(i.toString(), 10)].length - 1];
            if (this.infiniteCurrentViewData[i + 1]) {
                this.infiniteCurrentViewData[i + 1].splice(0, 0, lastViewData);
            }
            this.infiniteCurrentViewData[parseInt(i.toString(), 10)].pop();
        }
    }

    private modelChanged(args: InfiniteScrollArgs): void {
        const rows: Element[] = this.parent.getRows();
        if (args.requestType === 'save' && (args as AddEventArgs).index && (args as AddEventArgs).data) {
            this.addRowIndex = (args as AddEventArgs).index;
        }
        if (rows && rows.length && args.requestType !== 'infiniteScroll' && (args.requestType === 'delete' || this.requestType === 'add')) {
            this.firstIndex = getRowIndexFromElement(rows[0]);
            this.firstBlock = Math.ceil((this.firstIndex + 1) / this.parent.pageSettings.pageSize);
            this.lastIndex = getRowIndexFromElement(rows[rows.length - 1]);
            if (args.requestType === 'delete') {
                const rowObj: Row<Column>[] = this.parent.getRowsObject();
                args.startIndex = this.parent.infiniteScrollSettings.enableCache
                    ? (this.firstBlock - 1) * this.parent.pageSettings.pageSize : rowObj[rowObj.length - 1].index;
            } else {
                args.startIndex = this.firstIndex;
            }
            if (!this.parent.infiniteScrollSettings.enableCache
                && this.parent.pageSettings.currentPage === this.maxPage && args.requestType === 'delete') {
                this.isLastPage = true;
                this.lastIndex = this.lastIndex - 1;
            }
        }
    }

    private infiniteAddActionBegin(args: { startEdit: boolean }): void {
        if (this.isNormaledit) {
            this.isAdd = true;
            if (this.parent.infiniteScrollSettings.enableCache) {
                if (!Object.keys(this.emptyRowData).length) {
                    this.createEmptyRowdata();
                }
                if (this.parent.pageSettings.currentPage > 1) {
                    args.startEdit = false;
                    this.resetInfiniteBlocks({}, true);
                    this.makeRequest({ currentPage: 1 });
                }
            }
        }
    }

    private infiniteEditHandler(args: { e: InfiniteScrollArgs, result: Object[] }): void {
        if (!this.parent.infiniteScrollSettings.enableCache && (args.e.requestType === 'delete'
            || (args.e.requestType === 'save' && this.requestType === 'add'))) {
            const rowElms: Element[] = this.parent.getRows();
            const rows: Row<Column>[] = this.parent.getRowsObject();
            if (this.ensureRowAvailability(rows, args.result[0])) {
                if (rowElms.length && !(this.addRowIndex && this.addRowIndex >= rowElms.length)) {
                    this.resetRowIndex(rows, args.e, rowElms, this.requestType === 'add', true);
                }
                if (!this.isLastPage) {
                    this.createRow(rows, args);
                } else {
                    this.isLastPage = false;
                    this.parent.pageSettings.currentPage = this.maxPage;
                    if (this.parent.selectionModule.index < this.parent.frozenRows) {
                        remove(rowElms[this.parent.frozenRows - 1]);
                        this.createRow([rows[this.parent.frozenRows - 1]], args, false, true);
                        setRowElements(this.parent);
                    }
                }
            }
            this.parent.hideSpinner();
            this.parent.notify(events.refreshInfinitePersistSelection, {});
            if (this.requestType === 'delete') {
                this.parent.notify(events.deleteComplete, args.e);
            } else {
                this.parent.notify(events.saveComplete, args.e);
            }
        }
        this.parent.notify(events.freezeRender, { case: 'refreshHeight' });
    }

    private createRow(
        rows: Row<Column>[], args: { e: InfiniteScrollArgs, result: Object[] },
        isMovable?: boolean, isFrozenRows?: boolean, isFrozenRight?: boolean): void {
        const row: Row<Column>[] = !isFrozenRows ? this.generateRows(args.result, args.e) : rows;
        const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        this.parent.removeMaskRow();
        if ((args.e as AddEventArgs).requestType === 'save' && (args.e as AddEventArgs).index && (args.e as AddEventArgs).data) {
            row[0].index = this.addRowIndex;
            this.addRowIndex = null;
            if (row[0].index >= rows.length) { return; }
        }
        let tbody: HTMLElement;
        tbody = this.parent.getContent().querySelector( literals.tbody);
        if (this.parent.frozenRows) {
            tbody = isFrozenRows && this.requestType !== 'add' || !isFrozenRows && this.requestType === 'add'
                ? this.parent.getHeaderContent().querySelector( literals.tbody) : tbody;
        }
        const notifyArgs: {
            rows: Row<Column>[], cancel: boolean, args: { e: InfiniteScrollArgs, result: Object[] },
            isMovable?: boolean, isFrozenRows?: boolean, isFrozenRight?: boolean, row: Row<Column>[]
        } = {
            rows: rows, cancel: false, args: args, isMovable: isMovable,
            isFrozenRows: isFrozenRows, isFrozenRight: isFrozenRows, row: row
        };
        this.parent.notify(events.infiniteCrudCancel, notifyArgs);
        if (!notifyArgs.cancel) {
            for (let i: number = row.length - 1; i >= 0; i--) {
                if (this.requestType === 'delete') {
                    tbody.appendChild(rowRenderer.render(row[parseInt(i.toString(), 10)], this.parent.getColumns()));
                } else {
                    tbody.insertBefore(rowRenderer.render(row[parseInt(i.toString(), 10)], this.parent.getColumns()),
                                       (tbody as HTMLTableElement).rows[((args.e as AddEventArgs).index)]);
                }
            }
        }
        if (!isFrozenRows && this.parent.frozenRows
            && (this.parent.selectionModule.index < this.parent.frozenRows || this.requestType === 'add')) {
            const rowElems: Element[] = this.parent.getRows();
            const index: number = (isMovable || isFrozenRight) && this.requestType === 'add'
                ? this.parent.frozenRows : this.parent.frozenRows - 1;
            remove(rowElems[parseInt(index.toString(), 10)]);
            this.createRow([rows[this.parent.frozenRows - 1]], args, false, true, false);
        }
        if (!this.parent.infiniteScrollSettings.enableCache && !isFrozenRows) {
            setRowElements(this.parent);
            (<{ visibleRows?: Row<Column>[] }>this.parent.contentModule).visibleRows = this.requestType === 'add'
                ? row.concat(rows) : rows.concat(row);
        }
    }

    private ensureRowAvailability(rows: Row<Column>[], data: Object): boolean {
        let resume: boolean = true;
        if (this.parent.frozenRows && !this.parent.infiniteScrollSettings.enableCache
            && this.parent.sortSettings.columns && this.requestType === 'add') {
            const key: string = this.parent.getPrimaryKeyFieldNames()[0];
            for (let i: number = 0; i < rows.length; i++) {
                if (rows[parseInt(i.toString(), 10)].data[`${key}`] === data[`${key}`]) {
                    resume = false;
                    break;
                }
            }
        }
        return resume;
    }

    private generateRows(data: Object[], args: NotifyArgs): Row<Column>[] {
        return this.rowModelGenerator.generateRows(data, args);
    }

    private resetRowIndex(rows: Row<Column>[], args: NotifyArgs, rowElms: Element[], isAdd: boolean, isFrozen?: boolean): void {
        const keyField: string = this.parent.getPrimaryKeyFieldNames()[0];
        const isRemove: boolean = !(rowElms.length % this.parent.pageSettings.pageSize);
        if (isAdd) {
            if (isRemove) {
                if (isFrozen && !this.parent.groupSettings.columns.length) {
                    this.swapCurrentViewData(1, true);
                }
                remove(rowElms[rows.length - 1]);
                rowElms.splice(rows.length - 1, 1);
                rows.splice(rows.length - 1, 1);
            }
        } else {
            rows.filter((e: Row<Column>, index: number) => {
                if (e.data[`${keyField}`] === (<{ data?: Object[] }>args).data[0][`${keyField}`]) {
                    if (isFrozen && !this.parent.groupSettings.columns.length) {
                        const page: number = Math.ceil((index + 1) / this.parent.pageSettings.pageSize);
                        this.resetInfiniteCurrentViewData(page, index);
                    }
                    rows.splice(index, 1);
                    const rowElement: Element = this.parent.getRowElementByUID(e.uid);
                    if (rowElement) {
                        const rowElementIndex: number = rowElms.indexOf(rowElement);
                        remove(rowElement);
                        rowElms.splice(rowElementIndex, 1);
                    }
                }
            });
        }
        const startIndex: number = isAdd ? this.addRowIndex ? this.addRowIndex + 1 : 1 : 0;
        resetRowIndex(this.parent, rows, rowElms as HTMLTableRowElement[], startIndex, this.addRowIndex ? this.addRowIndex : 0);
    }

    private resetInfiniteCurrentViewData(page: number, index: number): void {
        index = index - ((page - 1) * this.parent.pageSettings.pageSize);
        this.infiniteCurrentViewData[parseInt(page.toString(), 10)].splice(index, 1);
        this.swapCurrentViewData(page, false);
    }

    private swapCurrentViewData(page: number, isAdd: boolean): void {
        const keys: string[] = Object.keys(this.infiniteCurrentViewData);
        const end: number = isAdd ? keys.length + 1 : keys.length;
        for (let i: number = page; i < end; i++) {
            if (this.infiniteCurrentViewData[i + 1]) {
                const pageIndex: number = isAdd ? i : i + 1;
                const index: number = isAdd ? this.infiniteCurrentViewData[parseInt(i.toString(), 10)].length - 1 : 0;
                const data: Object[] = this.infiniteCurrentViewData[parseInt(pageIndex.toString(), 10)].splice(index, 1);
                if (isAdd) {
                    this.infiniteCurrentViewData[i + 1] = data.concat(this.infiniteCurrentViewData[i + 1]);
                    if ((i + 1) === end - 1) {
                        this.infiniteCurrentViewData[i + 1].splice(this.infiniteCurrentViewData[i + 1].length - 1, 1);
                    }
                } else {
                    this.infiniteCurrentViewData[parseInt(i.toString(), 10)].push(data[0]);
                }
            }
        }
        this.updateCurrentViewData();
    }

    private setDisplayNone(args: { visible: string, index: number, isFreeze: boolean }): void {
        if (this.parent.infiniteScrollSettings.enableCache) {
            const keys: string[] = Object.keys(this.infiniteCache);
            for (let i: number = 1; i <= keys.length; i++) {
                const cache: Row<Column>[] = this.infiniteCache[parseInt(i.toString(), 10)];
                cache.filter((e: Row<Column>) => {
                    e.cells[args.index].visible = args.visible === '';
                });
            }
            this.resetContentModuleCache(this.infiniteCache);
        }
    }

    private refreshInfiniteCache(args: { data: Object }): void {
        this.getEditedRowObject().data = args.data;
    }

    private refreshInfiniteCacheRowVisibleLength(args: {[x: number]: Row<Column>[]}, currentPage: number): number {
        const cPageRowArray: Row<Column>[] = args[parseInt(currentPage.toString(), 10)];
        if (this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache) {
            let length: number = 0;
            let vRowLen: number = 0;
            let hRowLen: number = 0;
            for (let i: number = 0; i < cPageRowArray.length; i++) {
                if (cPageRowArray[parseInt(i.toString(), 10)].visible
                    || isNullOrUndefined(cPageRowArray[parseInt(i.toString(), 10)].visible)) {
                    vRowLen++;
                }
                else {
                    hRowLen++;
                }
            }
            if (hRowLen > vRowLen) {
                length = hRowLen - vRowLen;
                if (length > vRowLen) {
                    length = vRowLen;
                }
            }
            else {
                length = vRowLen - hRowLen;
                if (length > hRowLen) {
                    length = hRowLen;
                }
            }
            if (length === 0) {
                length = 1;
            }
            return length;
        }
        else {
            return cPageRowArray.length;
        }
    }

    private refreshInfiniteEditrowindex(args: { index: number }): void {
        this.editRowIndex = args.index;
    }

    private getEditedRowObject(): Row<Column> {
        const rowObjects: Row<Column>[] = this.parent.getRowsObject();
        let editedrow: Row<Column>;
        for (let i: number = 0; i < rowObjects.length; i++) {
            if (rowObjects[parseInt(i.toString(), 10)].index === this.editRowIndex) {
                editedrow = rowObjects[parseInt(i.toString(), 10)];
            }
        }
        return editedrow;
    }

    private infiniteEditSuccess(args?: EditArgs): void {
        if (this.isNormaledit) {
            if (!this.isAdd && args.data) {
                this.updateCurrentViewRecords(args.data);
            }
            this.isAdd = false || this.parent.editSettings.showAddNewRow;
        }
    }

    private updateCurrentViewRecords(data: Object): void {
        const index: number = getEditedDataIndex(this.parent, data);
        if (!isNullOrUndefined(index)) {
            this.parent.getCurrentViewRecords()[parseInt(index.toString(), 10)] = data;
        }
    }

    private actionBegin(args: NotifyArgs): void {
        if (args.requestType === 'add' || args.requestType === 'delete') {
            this.requestType = args.requestType;
        } else if ((args as SaveEventArgs).action === 'add' && args.requestType === 'save') {
            this.requestType = (args as SaveEventArgs).action as Action;
        }
        if (this.parent.isFrozenGrid() && !args.cancel && args.requestType === 'searching'
            || args.requestType === 'sorting' || args.requestType === 'filtering') {
            this.isInitialRender = true;
        }
    }

    private actionComplete(args: NotifyArgs): void {
        if (args.requestType === 'delete' || args.requestType === 'save' || args.requestType === 'cancel') {
            this.requestType = this.empty as Action;
            this.isCancel = args.requestType === 'cancel' || args.requestType === 'save';
            this.isAdd = this.isEdit = false || this.parent.editSettings.showAddNewRow;
            if (this.isNormaledit) {
                this.editRowIndex = this.empty as number;
                this.virtualInfiniteData = {};
                (<{ previousVirtualData?: Object }>this.parent.editModule).previousVirtualData = {};
            }
        }
    }

    /**
     * The function used to trigger onActionComplete
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        const args: Object = { type: events.actionComplete };
        this.parent.trigger(events.actionComplete, extend(e, args));
    }

    private resetInfiniteEdit(): void {
        if (this.parent.enableInfiniteScrolling && this.isNormaledit) {
            if ((this.parent.editSettings.allowEditing && this.isEdit) || (this.parent.editSettings.allowAdding && this.isAdd)) {
                this.parent.isEdit = true;
            }
        }
    }

    private getVirtualInfiniteData(data: { virtualData: Object, isAdd: boolean, isCancel: boolean }): void {
        this.getVirtualInfiniteEditedData();
        data.virtualData = this.parent.enableColumnVirtualization && !this.parent.infiniteScrollSettings.enableCache ? data.virtualData
            : this.virtualInfiniteData;
        data.isAdd = this.isAdd;
        data.isCancel = this.isCancel;
    }

    private editActionBegin(e: { data: Object, index: number }): void {
        this.isEdit = true;
        this.editRowIndex = e.index;
        const rowObject: Object = extend({}, this.getEditedRowObject().data);
        e.data = Object.keys(this.virtualInfiniteData).length ? this.virtualInfiniteData : rowObject;
    }

    private dataSourceModified(): void {
        this.resetInfiniteBlocks({ requestType: this.empty as Action }, true);
    }

    private onDataReady(e: NotifyArgs): void {
        if (!isNullOrUndefined(e.count) && e.requestType !== 'infiniteScroll') {
            this.maxPage = Math.ceil(e.count / this.parent.pageSettings.pageSize);
        }
    }

    private ensureIntialCollapse(isExpand: boolean): void {
        this.isInitialCollapse = !isExpand;
    }

    private infiniteScrollHandler(e: { target: HTMLElement, isLeft: boolean }): void {
        if (this.infiniteDetailDestroy) {
            return;
        }
        this.restoreInfiniteEdit();
        this.restoreInfiniteAdd();
        const targetEle: HTMLElement = e.target as HTMLElement;
        const isInfinite: boolean = targetEle.classList.contains(literals.content);
        const detailGrid: boolean = this.parent.childGrid || this.parent.detailTemplate ? true : false;
        if (isInfinite && this.parent.enableInfiniteScrolling && !e.isLeft) {
            const scrollEle: Element = this.parent.getContent().firstElementChild;
            const captionRows: Element[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
            this.prevScrollTop = scrollEle.scrollTop;
            const rows: Element[] = detailGrid ? this.parent.getRows().filter((row: HTMLElement) => !row.classList.contains('e-detailrow'))
                : this.parent.groupSettings.enableLazyLoading ? captionRows : this.parent.getRows();
            if (!rows.length) {
                return;
            }
            const index: number = getRowIndexFromElement(rows[rows.length - 1]) + 1;
            const prevPage: number = this.parent.pageSettings.currentPage;
            let args: InfiniteScrollArgs;
            const offset: number = targetEle.scrollHeight - targetEle.scrollTop;
            const round: number = Math.round(targetEle.scrollHeight - targetEle.scrollTop);
            let floor: number = offset < targetEle.clientHeight ? Math.ceil(offset) : Math.floor(offset);
            let targetHeight: number = targetEle.clientHeight;
            if (floor > targetHeight) { floor = floor - 1; }
            else if (targetHeight > floor) { targetHeight = targetHeight - 1; }
            const isBottom: boolean = (floor === targetHeight || round === targetHeight);
            if (!isNullOrUndefined(this.groupCaptionAction)) { return; }
            if (this.isScroll && isBottom && (this.parent.pageSettings.currentPage <= this.maxPage - 1 || this.enableContinuousScroll)) {
                if (this.parent.infiniteScrollSettings.enableCache) {
                    this.isUpScroll = false;
                    this.isDownScroll = true;
                }
                const rows: Element[] = detailGrid ? this.getGridRows().filter((row: HTMLElement) => row.classList.contains('e-row')
                    && !row.classList.contains('e-addedrow')) : [].slice.call(scrollEle.querySelectorAll('.e-row:not(.e-addedrow)'));
                const row: Element = rows[rows.length - 1];
                const rowIndex: number = !(this.parent.groupSettings.enableLazyLoading && this.parent.groupSettings.columns.length)
                    ? getRowIndexFromElement(row) : this.parent.contentModule['visibleRows'].length - 1;
                this.parent.pageSettings.currentPage = Math.ceil(rowIndex / this.parent.pageSettings.pageSize) + 1;
                args = {
                    requestType: 'infiniteScroll',
                    currentPage: this.parent.pageSettings.currentPage,
                    prevPage: prevPage,
                    startIndex: index,
                    direction: 'down'
                };
                this.makeRequest(args);
            }

            if (this.isScroll && this.parent.infiniteScrollSettings.enableCache && targetEle.scrollTop === 0
                && this.parent.pageSettings.currentPage !== 1) {
                if (this.parent.infiniteScrollSettings.enableCache) {
                    this.isDownScroll = false;
                    this.isUpScroll = true;
                }
                const row: Element = detailGrid ? this.getGridRows().filter((row: HTMLElement) => row.classList.contains(literals.row))
                    : [].slice.call(scrollEle.getElementsByClassName(literals.row));
                const rowIndex: number = getRowIndexFromElement(row[this.parent.pageSettings.pageSize - 1]);
                const startIndex: number = getRowIndexFromElement(row[0]) - this.parent.pageSettings.pageSize;
                this.parent.pageSettings.currentPage = Math.ceil(rowIndex / this.parent.pageSettings.pageSize) - 1;
                if (this.parent.pageSettings.currentPage) {
                    args = {
                        requestType: 'infiniteScroll',
                        currentPage: this.parent.pageSettings.currentPage,
                        prevPage: prevPage,
                        startIndex: startIndex,
                        direction: 'up'
                    };
                    this.makeRequest(args);
                }
            }
            if (this.parent.infiniteScrollSettings.enableCache && !this.isScroll && isNullOrUndefined(args)) {
                if (this.isDownScroll || this.isUpScroll) {
                    scrollEle.scrollTop = this.top;
                }
            }
        }
    }

    private makeRequest(args: InfiniteScrollArgs): void {
        if (this.parent.pageSettings.currentPage !== args.prevPage) {
            const initBlocks: number = this.parent.infiniteScrollSettings.initialBlocks;
            if (initBlocks < this.maxPage && this.parent.pageSettings.currentPage <= this.maxPage) {
                this.isInfiniteScroll = true;
                if (isNullOrUndefined(this.infiniteCache[args.currentPage])) {
                    setTimeout(
                        () => {
                            this.getVirtualInfiniteEditedData();
                            this.parent.notify('model-changed', args);
                        },
                        100);
                } else {
                    setTimeout(
                        () => {
                            this.getVirtualInfiniteEditedData();
                            this.parent.notify(events.refreshInfiniteModeBlocks, args);
                        },
                        100);
                }
            } else {
                this.parent.pageSettings.currentPage = this.parent.groupSettings.enableLazyLoading
                    && this.parent.groupSettings.columns.length && initBlocks >= this.maxPage ? 1 : this.maxPage;
            }
        }
    }

    private infinitePageQuery(query: Query): void {
        if (this.initialRender || ((this.requestType === 'add' || this.requestType === 'delete')
            && (this.parent.childGrid || this.parent.detailTemplate))) {
            this.initialRender = false;
            this.intialPageQuery(query);
        } else {
            if ((this.requestType === 'delete' || this.requestType === 'add')) {
                if (!this.isInfiniteScroll && !this.parent.groupSettings.enableLazyLoading) {
                    this.editPageQuery(query);
                } else if (this.parent.groupSettings.enableLazyLoading && !this.parent.infiniteScrollSettings.enableCache) {
                    if (this.parent.infiniteScrollSettings.initialBlocks < this.parent.pageSettings.currentPage) {
                        query.page(1, this.parent.pageSettings.pageSize * this.parent.pageSettings.currentPage);
                    }
                    else {
                        query.page(1, this.parent.pageSettings.pageSize * this.parent.infiniteScrollSettings.initialBlocks);
                    }
                } else {
                    query.page(this.parent.pageSettings.currentPage, this.parent.pageSettings.pageSize);
                }
            } else {
                query.page(this.parent.pageSettings.currentPage, this.parent.pageSettings.pageSize);
            }
        }
    }

    private editPageQuery(query: Query): void {
        const initialBlocks: number = this.parent.infiniteScrollSettings.initialBlocks;
        const isCache: boolean = this.parent.infiniteScrollSettings.enableCache;
        if (isCache) {
            this.infiniteCache = {};
            this.infiniteCurrentViewData = {};
            query.skip(this.firstIndex);
            query.take(initialBlocks * this.parent.pageSettings.pageSize);
        } else {
            if (this.parent.editSettings.mode === 'Dialog') {
                this.parent.clearSelection();
            }
            const index: number = this.requestType === 'delete' ? this.lastIndex : this.addRowIndex ? this.addRowIndex : this.firstIndex;
            query.skip(index);
            if (!isNullOrUndefined(this.parent.getDataModule().dataManager.dataSource.url) &&
             this.parent.getDataModule().dataManager.dataSource.url !== '' && (this.requestType === 'delete' ||
                this.requestType === 'add')) {
                query.take(initialBlocks * this.parent.pageSettings.pageSize);

            } else {
                query.take(1);
            }
        }
    }

    private intialPageQuery(query: Query): void {
        if (this.parent.infiniteScrollSettings.enableCache
            && this.parent.infiniteScrollSettings.initialBlocks > this.parent.infiniteScrollSettings.maxBlocks) {
            this.parent.infiniteScrollSettings.initialBlocks = this.parent.infiniteScrollSettings.maxBlocks;
        }
        const pageSize: number = this.parent.pageSettings.pageSize * this.parent.infiniteScrollSettings.initialBlocks;
        query.page(1, pageSize);
    }

    private scrollToLastFocusedCell(e: CellFocusArgs): void {
        const gObj: IGrid = this.parent;
        const rowIdx: number = this.lastFocusInfo.rowIdx + (e.keyArgs.action === literals.upArrow ? -1 : 1);
        const cellIdx: number = this.lastFocusInfo.cellIdx;
        let row: HTMLTableRowElement = gObj.getRowByIndex(rowIdx) as HTMLTableRowElement;
        if (!row) {
            const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
            const page: number = Math.floor(rowIdx / this.parent.pageSettings.pageSize) + 1;
            gObj.pageSettings.currentPage = page;
            const cols: Column[] = gObj.getColumns();
            remove(gObj.getContent().querySelector('tbody'));
            gObj.getContent().querySelector('table').appendChild(gObj.createElement('tbody', { attrs: { 'role': 'rowgroup' } }));
            let focusRows: Row<Column>[] = [];
            // eslint-disable-next-line @typescript-eslint/tslint/config
            for (let i: number = (page === 1 || this.maxPage === page) ? 0 : -1, k = 0;
                k < gObj.infiniteScrollSettings.maxBlocks; this.maxPage === page ? i-- : i++, k++) {
                const rows: Row<Column>[] = this.infiniteCache[page + i];
                if (rows) {
                    focusRows = focusRows.concat(rows);
                    for (let j: number = 0; j < rows.length; j++) {
                        gObj.getContent().querySelector('tbody').appendChild(rowRenderer.render(rows[parseInt(j.toString(), 10)], cols));
                    }
                }
            }
            gObj.notify(events.contentReady, { rows: focusRows, args: {} });
            setRowElements(gObj);
        }
        row = gObj.getRowByIndex(rowIdx) as HTMLTableRowElement;
        const target: Element = row.cells[parseInt(cellIdx.toString(), 10)];
        gObj.focusModule.isInfiniteScroll = true;
        gObj.focusModule.onClick({ target }, true);
        gObj.selectRow(rowIdx);
        (target as HTMLElement).focus();
        this.isFocusScroll = false;
        e.cancel = true;
    }

    private setLastCellFocusInfo(e: CellFocusArgs): void {
        const cell: Element = ((e.byClick && e.clickArgs.target) || (e.byKey && e.keyArgs.target)
            || (!this.isFocusScroll && <{ target?: Element }>e).target) as Element;
        if (cell && cell.classList.contains('e-rowcell')) {
            const cellIdx: number = parseInt(cell.getAttribute('aria-colindex'), 10) - 1;
            const rowIdx: number = parseInt(cell.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            this.lastFocusInfo = { rowIdx: rowIdx, cellIdx: cellIdx };
        }
    }

    private infiniteCellFocus(e: CellFocusArgs): void {
        const gObj: IGrid = this.parent;
        const cache: boolean = gObj.infiniteScrollSettings.enableCache;
        if (e.byKey) {
            if (cache && this.isFocusScroll) {
                this.scrollToLastFocusedCell(e);
                return;
            }
            const cell: Element = document.activeElement;
            let rowIndex: number = getRowIndexFromElement(cell.parentElement);
            this.cellIndex = parseInt(cell.getAttribute(literals.ariaColIndex), 10) - 1;
            const content: Element = gObj.getContent().firstElementChild;
            const totalRowsCount: number = (this.maxPage * gObj.pageSettings.pageSize) - 1;
            const visibleRowCount: number = Math.floor((content as HTMLElement).offsetHeight / this.parent.getRowHeight());
            const contentRect: ClientRect = content.getBoundingClientRect();
            if (!isNaN(rowIndex)) {
                if (e.keyArgs.action === literals.downArrow || e.keyArgs.action === literals.enter) {
                    this.rowIndex = rowIndex += 1;
                    const row: Element = gObj.getRowByIndex(rowIndex);
                    const rowRect: ClientRect = row && row.getBoundingClientRect();
                    if (cache) {
                        rowIndex = (cell.parentElement as HTMLTableRowElement).rowIndex + 1;
                    }
                    if (this.isFocusScroll || (!row && rowIndex < totalRowsCount)
                        || (rowRect && rowRect.bottom >= contentRect.bottom)) {
                        if (!this.isFocusScroll) {
                            this.pressedKey = e.keyArgs.action;
                        }
                        this.isFocusScroll = false;
                        content.scrollTop = ((rowIndex - visibleRowCount) + 1) * this.parent.getRowHeight();
                    } else if (!cache && row) {
                        if (rowRect && (rowRect.bottom >= contentRect.bottom || rowRect.top < contentRect.top)) {
                            (row as HTMLTableRowElement).cells[this.cellIndex].scrollIntoView();
                        }
                    }
                } else if (e.keyArgs.action === literals.upArrow || e.keyArgs.action === literals.shiftEnter) {
                    this.rowIndex = rowIndex -= 1;
                    const row: Element = gObj.getRowByIndex(rowIndex);
                    const rowRect: ClientRect = row && row.getBoundingClientRect();
                    if (cache) {
                        rowIndex = (cell.parentElement as HTMLTableRowElement).rowIndex - 1;
                    }
                    if (!row || rowRect.top <= contentRect.top) {
                        this.pressedKey = e.keyArgs.action;
                        content.scrollTop = rowIndex * this.parent.getRowHeight();
                    }
                }
            }
        } else if ((e as KeyboardEventArgs).key === 'PageDown' || (e as KeyboardEventArgs).key === 'PageUp') {
            this.pressedKey = (e as KeyboardEventArgs).key as FocusKeys;
        }
        this.setLastCellFocusInfo(e);
    }

    private createEmptyRowdata(): void {
        this.parent.getColumns().filter((e: Column) => {
            this.emptyRowData[e.field] = this.empty;
        });
    }

    private getVirtualInfiniteEditedData(): void {
        const editForm: Element = this.parent.element.querySelector('.' + literals.editedRow);
        const addForm: Element = this.parent.element.querySelector('.' + literals.addedRow);
        const gridForm: Element = this.parent.element.querySelector('.e-gridform');
        if (this.parent.infiniteScrollSettings.enableCache && (editForm || addForm)) {
            const rowData: Object = editForm ? extend({}, this.getEditedRowObject().data)
                : extend({}, this.emptyRowData);
            this.virtualInfiniteData = this.parent.editModule.getCurrentEditedData(gridForm, rowData);
            const hiddenColumn: Column[] = (this.parent as Grid).getHiddenColumns();
            for (let i: number = 0; i < hiddenColumn.length; i++) {
                if (hiddenColumn[parseInt(i.toString(), 10)].defaultValue) {
                    this.virtualInfiniteData[hiddenColumn[parseInt(i.toString(), 10)].field] =
                        hiddenColumn[parseInt(i.toString(), 10)].defaultValue;
                }
            }
        }
    }

    private restoreInfiniteEdit(): void {
        const content: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        const frozenEdit: boolean = this.parent.frozenRows ? this.editRowIndex >= this.parent.frozenRows : true;
        if (this.isNormaledit && this.parent.infiniteScrollSettings.enableCache && frozenEdit) {
            if (this.parent.editSettings.allowEditing && !isNullOrUndefined(this.editRowIndex)) {
                const row: HTMLTableRowElement = this.parent.getRowByIndex(this.editRowIndex) as HTMLTableRowElement;
                if (Object.keys(this.virtualInfiniteData).length && row && !this.parent.getContent().querySelector('.' + literals.editedRow)) {
                    const top: number = row.getBoundingClientRect().top;
                    if (top < content.offsetHeight && top > this.parent.getRowHeight()) {
                        this.parent.isEdit = false;
                        this.parent.editModule.startEdit(row);
                    }
                }
            }
        }
    }

    private restoreInfiniteAdd(): void {
        const content: Element = this.parent.getContent().firstElementChild;
        if (this.parent.getCurrentViewRecords().length && this.parent.getRowByIndex(0) && this.isNormaledit &&
            this.parent.infiniteScrollSettings.enableCache && this.isAdd && !content.querySelector('.' + literals.addedRow)) {
            const isTop: boolean = content.scrollTop < this.parent.getRowHeight();
            if (isTop) {
                this.parent.isEdit = false;
                this.parent.addRecord();
            }
        }
    }

    private appendInfiniteRows(e: {
        tbody: Element, frag: DocumentFragment, args: InfiniteScrollArgs,
        rows: Row<Column>[], rowElements: Element[], visibleRows: Row<Column>[],
        tableName: freezeTable
    }): void {
        const gObj: IGrid = this.parent;
        const scrollEle: Element = this.parent.getContent().firstElementChild;
        const isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling && e.args.requestType === 'infiniteScroll';
        const infiniteDetailModified: boolean = gObj.enableInfiniteScrolling && (gObj.childGrid || gObj.detailTemplate)
        && (((e.args as NotifyArgs).action === 'add' && e.args.requestType === 'save') || e.args.requestType === 'delete');
        if (infiniteDetailModified) {
            scrollEle.scrollTop = 0;
            gObj.pageSettings.currentPage = 1;
        }
        if ((this.parent.isAngular || this.parent.isReact || this.parent.isVue || this.parent.isVue3) && isInfiniteScroll &&
         !e.args.isFrozen && this.parent.infiniteScrollSettings.enableCache){
            const isChildGrid: boolean = this.parent.childGrid && this.parent.element.querySelectorAll('.e-childgrid').length ? true : false;
            const rows: Element[] | NodeListOf<Element> = this.parent.getDataRows();
            (this.parent as Grid).refreshReactTemplateTD(rows, isChildGrid);
        }
        if ((isInfiniteScroll && !e.args.isFrozen) || !isInfiniteScroll) {
            if (isInfiniteScroll && e.args.direction === 'up') {
                e.tbody.insertBefore(e.frag, e.tbody.firstElementChild);
            } else {
                e.tbody.appendChild(e.frag);
            }
        }
        (this.parent as Grid).contentModule.getTable().appendChild(e.tbody);
        this.updateCurrentViewData();
        if (this.isInitialRender && !e.args.isFrozen) {
            this.isInitialRender = false;
            this.parent.scrollModule.setHeight();
        }
        if (!e.args.isFrozen) {
            this.rowTop = !this.rowTop ? this.parent.getRows()[0].getBoundingClientRect().top : this.rowTop;
            if (isInfiniteScroll) {
                if (this.parent.infiniteScrollSettings.enableCache && this.isRemove) {
                    scrollEle.scrollTop = this.top;
                }
                setRowElements(this.parent);
            }
            this.restoreInfiniteAdd();
            this.isScroll = true;
        }
        this.isInfiniteScroll = false;
        this.infiniteDetailDestroy = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private selectNewRow(args: { direction: string }): void {
        const gObj: IGrid = this.parent;
        const row: Element = gObj.getRowByIndex(this.rowIndex);
        const cache: boolean = gObj.infiniteScrollSettings.enableCache;
        if (row && this.keys.some((value: string) => value === this.pressedKey)) {
            const content: Element = gObj.getContent().firstElementChild;
            const rowHeight: number = gObj.getRowHeight();
            const target: HTMLTableCellElement = (row as HTMLTableRowElement).cells[this.cellIndex];
            if ((this.pressedKey === literals.downArrow || this.pressedKey === literals.enter)
                || (cache && (this.pressedKey === literals.upArrow || this.pressedKey === literals.shiftEnter))) {
                if (!cache && this.pressedKey !== literals.upArrow && this.pressedKey !== literals.shiftEnter) {
                    content.scrollTop = content.scrollTop + rowHeight;
                }
                gObj.focusModule.isInfiniteScroll = true;
                gObj.focusModule.onClick({ target }, true);
                gObj.selectRow(this.rowIndex);
            }
        } else if (this.lastFocusInfo && (this.pressedKey === literals.pageDown || this.pressedKey === literals.pageUp)) {
            const idx: number = cache ? 0 : this.lastFocusInfo.rowIdx;
            if (gObj.getRowByIndex(idx)) {
                const target: Element = gObj.getCellFromIndex(idx, this.lastFocusInfo.cellIdx);
                if (target) {
                    this.isFocusScroll = true;
                    if (!cache) {
                        gObj.focusModule.isInfiniteScroll = true;
                        gObj.focusModule.onClick({ target }, true);
                    } else {
                        (target as HTMLElement).focus({ preventScroll: true });
                    }
                }
            }
        }
        this.pressedKey = undefined;
    }

    private removeInfiniteCacheRows(e: { args: InfiniteScrollArgs }): void {
        const isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling && e.args.requestType === 'infiniteScroll';
        if (!e.args.isFrozen && isInfiniteScroll && this.parent.infiniteScrollSettings.enableCache && this.isRemove) {
            const detailGrid: boolean = this.parent.childGrid || this.parent.detailTemplate ? true : false;
            const rows: Element[] = detailGrid ? this.getGridRows().filter((row: HTMLElement) => row.classList.contains(literals.row))
                : [].slice.call(this.parent.getContentTable().getElementsByClassName(literals.row));
            if (e.args.direction === 'down') {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    const captionRows: Element[] = detailGrid ? this.getGridRows().filter((row: HTMLElement) => !row.classList
                        .contains('e-detailrow')) : [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
                    this.removeCaptionRows(captionRows, e.args);
                }
                const addRowCount: number = this.parent.element.querySelector('.' + literals.addedRow) ? 0 : 1;
                this.removeTopRows(rows, this.parent.pageSettings.pageSize - addRowCount);
            }
            if (e.args.direction === 'up') {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    const captionRows: Element[] = detailGrid ? this.getGridRows().filter((row: HTMLElement) => !row.classList
                        .contains('e-detailrow')) : [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
                    this.removeCaptionRows(captionRows, e.args);
                } else {
                    this.removeBottomRows(rows, rows.length - 1, e.args);
                }
            }
            this.isScroll = false;
            this.top = this.calculateScrollTop(e.args);
        }
    }

    private calculateScrollTop(args: InfiniteScrollArgs): number {
        let top: number = 0;
        const scrollCnt: Element = this.parent.getContent().firstElementChild;
        if (args.direction === 'down') {
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length && !this.isInitialCollapse) {
                top = this.captionRowHeight();
            }
            const captionRows: Element[] = [].slice.call(this.parent.getContent().firstElementChild.querySelectorAll('tr:not(.e-row)'));
            let captionCount: number = 0;
            if (this.isInitialCollapse && !isNullOrUndefined(captionRows)) {
                captionCount = Math.round((captionRows.length - 1) / this.parent.groupSettings.columns.length);
            }
            const value: number = captionCount ? captionCount
                : this.parent.pageSettings.pageSize * (this.parent.infiniteScrollSettings.maxBlocks - 1);
            let currentViewRowCount: number = 0;
            let i: number = 0;
            while (currentViewRowCount < scrollCnt.clientHeight) {
                i++;
                currentViewRowCount = i * this.parent.getRowHeight();
            }
            i = i - 1;
            top += (value - i) * this.parent.getRowHeight();
        }

        if (args.direction === 'up') {
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length && !this.isInitialCollapse) {
                const len: number = this.refreshInfiniteCacheRowVisibleLength(this.infiniteCache, this.parent.pageSettings.currentPage);
                top = len * this.parent.getRowHeight();
            } else if (this.isInitialCollapse) {
                const groupedData: Row<Column>[] = this.infiniteCache[this.parent.pageSettings.currentPage];
                let count: number = 0;
                for (let i: number = 0; i < groupedData.length; i++) {
                    if (groupedData[parseInt(i.toString(), 10)].isCaptionRow) {
                        count++;
                    }
                }
                top += Math.round(count / this.parent.groupSettings.columns.length) * this.parent.getRowHeight();
            } else {
                top += (this.parent.pageSettings.pageSize * this.parent.getRowHeight() + getScrollBarWidth());
            }
        }
        return top;
    }

    private captionRowHeight(): number {
        const rows: Element[] = [].slice.call(this.parent.getContent().querySelectorAll('tr:not(.e-row)'));
        return rows.length * this.parent.getRowHeight();
    }

    private removeTopRows(rows: Element[], maxIndx: number): void {
        for (let i: number = 0; i <= maxIndx; i++) {
            if (this.parent.frozenRows && this.parent.pageSettings.currentPage === this.parent.infiniteScrollSettings.maxBlocks + 1
                && i > (maxIndx - this.parent.frozenRows)) {
                continue;
            }
            remove(rows[parseInt(i.toString(), 10)]);
        }
    }

    private removeBottomRows(rows: Element[], maxIndx: number, args: InfiniteScrollArgs): void {
        let cnt: number = 0;
        const pageSize: number = this.parent.pageSettings.pageSize;
        if (this.infiniteCache[args.prevPage].length < pageSize) {
            cnt = this.parent.pageSettings.pageSize - this.infiniteCache[args.prevPage].length;
        }
        for (let i: number = maxIndx; cnt < pageSize; i--) {
            cnt++;
            remove(rows[parseInt(i.toString(), 10)]);
        }
    }

    private removeCaptionRows(rows: Element[], args: InfiniteScrollArgs): void {
        const detailGrid: boolean = this.parent.childGrid || this.parent.detailTemplate ? true : false;
        const rowElements: Element[] = detailGrid ? this.getGridRows().filter((row: HTMLElement) => row.classList.contains(literals.row))
            : [].slice.call(this.parent.getContent().getElementsByClassName(literals.row));
        if (args.direction === 'down') {
            const lastRow: Element = rowElements[this.parent.pageSettings.pageSize - 1];
            const lastRowIndex: number = getRowIndexFromElement(lastRow) - 1;
            let k: number = 0;
            for (let i: number = 0; k < lastRowIndex; i++) {
                if (!rows[parseInt(i.toString(), 10)].classList.contains(literals.row)) {
                    remove(rows[parseInt(i.toString(), 10)]);
                } else {
                    k = getRowIndexFromElement(rows[parseInt(i.toString(), 10)]);
                }
            }
        }
        if (args.direction === 'up') {
            const lastIndex: number = getRowIndexFromElement(rowElements[rowElements.length - 1]);
            const page: number = Math.ceil(lastIndex / this.parent.pageSettings.pageSize);
            let startIndex: number = 0;
            for (let i: number = this.parent.pageSettings.currentPage + 1; i < page; i++) {
                startIndex += detailGrid ? this.infiniteCache[parseInt(i.toString(), 10)]
                    .filter((row: Row<Column>) => !row.isDetailRow).length : this.infiniteCache[parseInt(i.toString(), 10)].length;
            }
            for (let i: number = startIndex; i < rows.length; i++) {
                remove(rows[parseInt(i.toString(), 10)]);
            }
        }
    }

    private getGridRows(): Element[] {
        return [].slice.call((this.parent.getContentTable() as HTMLTableElement).rows);
    }

    private resetInfiniteBlocks(args: InfiniteScrollArgs, isDataModified?: boolean): void {
        const isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling && args.requestType !== 'infiniteScroll';
        if (!this.initialRender && !isNullOrUndefined((this.parent as Grid).infiniteScrollModule) && isInfiniteScroll) {
            if (this.actions.some((value: string) => value === args.requestType) || isDataModified || (args.requestType === 'save'
                && (this.parent.sortSettings.columns.length || this.parent.filterSettings.columns.length
                || this.parent.groupSettings.columns.length || this.parent.searchSettings.key))) {
                const scrollEle: Element = this.parent.getContent().firstElementChild;
                this.parent.notify(events.detachDetailTemplate, {});
                this.initialRender = true;
                scrollEle.scrollTop = 0;
                this.parent.pageSettings.currentPage = 1;
                this.infiniteCache = {};
                this.infiniteCurrentViewData = {};
                this.resetContentModuleCache({});
                this.isRemove = false;
                this.top = 0;
                this.isInitialCollapse = false;
                (<{ isRemove?: boolean }>(this.parent as Grid).contentModule).isRemove = this.isRemove;
                (<{ isAddRows?: boolean }>(this.parent as Grid).contentModule).isAddRows = this.isRemove;
                (<{ visibleRows?: Row<Column>[] }>(this.parent as Grid).contentModule).visibleRows = [];
                (<{ visibleFrozenRows?: Row<Column>[] }>(this.parent as Grid).contentModule).visibleFrozenRows = [];
            }
        }
    }

    private setCache(e: { isInfiniteScroll: boolean, modelData: Row<Column>[], args?: InfiniteScrollArgs }): void {
        if (this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache) {
            const gObj: IGrid = this.parent;
            const infiniteDetailModified: boolean = (gObj.childGrid || gObj.detailTemplate) && (((e.args as NotifyArgs).action === 'add'
                && e.args.requestType === 'save') || e.args.requestType === 'delete');
            const isEdit: boolean = e.args.requestType !== 'infiniteScroll'
                && (this.requestType === 'delete' || this.requestType === 'add');
            const currentPage: number = this.parent.pageSettings.currentPage;
            if (!Object.keys(this.infiniteCache).length || isEdit) {
                if (infiniteDetailModified) {
                    this.infiniteCache = {};
                }
                this.setInitialCache(e.modelData, e.args, isEdit);
            }
            if (isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage]) && !infiniteDetailModified) {
                this.infiniteCache[this.parent.pageSettings.currentPage] = e.modelData;
                this.resetContentModuleCache(this.infiniteCache);
            }
            if (e.isInfiniteScroll && !this.isRemove) {
                this.isRemove = (currentPage - 1) % this.parent.infiniteScrollSettings.maxBlocks === 0;
                (<{ isRemove?: boolean }>(this.parent as Grid).contentModule).isRemove = this.isRemove;
            }
        }
    }

    private setInitialCache(data: Row<Column>[], args?: InfiniteScrollArgs, isEdit?: boolean, isCurrentViewData?: boolean): void {
        let k: number = !isEdit ? 1 : isNullOrUndefined(this.firstBlock) ? 1 : this.firstBlock;
        for (let i: number = 1; i <= this.parent.infiniteScrollSettings.initialBlocks; i++) {
            const startIndex: number = (i - 1) * this.parent.pageSettings.pageSize;
            const endIndex: number = i * this.parent.pageSettings.pageSize;
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length && !isCurrentViewData) {
                this.setInitialGroupCache(data, k, startIndex, endIndex);
            } else {
                if (isCurrentViewData) {
                    this.infiniteCurrentViewData[parseInt(k.toString(), 10)] = data.slice(startIndex, endIndex);
                } else {
                    this.infiniteCache[parseInt(k.toString(), 10)] = data.slice(startIndex, endIndex);
                    this.resetContentModuleCache(this.infiniteCache);
                }
            }
            k++;
        }
    }

    private setInitialGroupCache(data: Row<Column>[], index: number, sIndex: number, eIndex: number): void {
        const pageData: Object[] = [];
        let startIndex: number = 0;
        for (let i: number = 1; i <= Object.keys(this.infiniteCache).length; i++) {
            startIndex += this.infiniteCache[parseInt(i.toString(), 10)].length;
        }
        let k: number = sIndex;
        for (let i: number = startIndex; i < data.length && k < eIndex; i++) {
            if (data[parseInt(i.toString(), 10)].index < eIndex || data[parseInt(i.toString(), 10)].isCaptionRow) {
                k = data[parseInt(i.toString(), 10)].isCaptionRow ? k : data[parseInt(i.toString(), 10)].index;
                pageData.push(data[parseInt(i.toString(), 10)]);
            }
            if (data[parseInt(i.toString(), 10)].index >= eIndex || data[parseInt(i.toString(), 10)].index === eIndex - 1) {
                break;
            }
        }
        this.infiniteCache[parseInt(index.toString(), 10)] = pageData as Row<Column>[];
        this.resetContentModuleCache(this.infiniteCache);
    }

    private resetContentModuleCache(data: { [x: number]: Row<Column>[] } | { [x: number]: Row<Column>[][] }): void {
        (<{ infiniteCache?: { [x: number]: Row<Column>[] } | { [x: number]: Row<Column>[][] } }>(this.parent as Grid).contentModule)
            .infiniteCache = data;
    }

    /**
     * @param {Row<Column>[]} rowObjects - Defines the grid's row objects
     * @returns {void}
     * @hidden
     */
    public resetInfiniteCache(rowObjects: Row<Column>[]): void {
        const blockLength: number = Object.keys(this.infiniteCache).length;
        this.infiniteCache = {};
        for (let i: number = 1; i <= blockLength; i++) {
            const startIndex: number = (i - 1) * this.parent.pageSettings.pageSize;
            const endIndex: number = i * this.parent.pageSettings.pageSize;
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                this.setInitialGroupCache(rowObjects, i, startIndex, endIndex);
            } else {
                this.infiniteCache[parseInt(i.toString(), 10)] = rowObjects.slice(startIndex, endIndex);
                this.resetContentModuleCache(this.infiniteCache);
            }
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}

interface EditArgs {
    data?: Object;
    requestType?: string;
    previousData?: Object;
    selectedRow?: number;
    type?: string;
    promise?: Promise<Object>;
    row?: Element;
}
