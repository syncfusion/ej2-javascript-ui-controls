import { isNullOrUndefined, remove, extend } from '@syncfusion/ej2-base';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { IGrid, IAction, NotifyArgs, InfiniteScrollArgs, CellFocusArgs, KeyboardEventArgs, IModelGenerator, SaveEventArgs, AddEventArgs } from '../base/interface';
import { RowModelGenerator } from '../services/row-model-generator';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
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
    private infiniteFrozenCache: { [x: number]: Row<Column>[][] } = {};
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
    private isInitialMovableRender: boolean = true;
    private frozenFrag: DocumentFragment;
    private movableFrag: DocumentFragment;
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
        this.rowModelGenerator = this.parent.isFrozenGrid() ? new FreezeRowModelGenerator(this.parent)
            : new RowModelGenerator(this.parent);
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
        this.actionBeginFunction = this.actionBegin.bind(this);
        this.actionCompleteFunction = this.actionComplete.bind(this);
        this.dataBoundFunction = this.dataBound.bind(this);
        this.parent.on(events.deleteComplete, this.deleteComplate, this);
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
        if (prevPage >= this.maxPage) {
            gObj.hideSpinner();
            return;
        }
        this.parent.pageSettings.currentPage = Math.ceil(index / this.parent.pageSettings.pageSize) + 1;
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
        if (e.args.action === 'add' && e.args.requestType === 'save') {
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
            if (!cache && (isAdd || isDelete)) {
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

    private deleteComplate(): void {
        if (this.parent.isFrozenGrid() && !this.parent.infiniteScrollSettings.enableCache) {
            (<{ refreshScrollOffset?: Function }>this.parent.contentModule).refreshScrollOffset();
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
            const frozenCols: boolean = this.parent.isFrozenGrid();
            const rowElms: Element[] = this.parent.getRows();
            const rows: Row<Column>[] = this.parent.getRowsObject();
            if (this.ensureRowAvailability(rows, args.result[0])) {
                if (rowElms.length && !(this.addRowIndex && this.addRowIndex >= rowElms.length)) {
                    this.resetRowIndex(rows, args.e, rowElms, this.requestType === 'add', true);
                    if (frozenCols) {
                        const rows: Row<Column>[] = this.parent.getMovableRowsObject();
                        this.resetRowIndex(rows, args.e, this.parent.getMovableDataRows(), this.requestType === 'add');
                        if (this.parent.getFrozenMode() === literals.leftRight) {
                            const frRows: Row<Column>[] = this.parent.getFrozenRightRowsObject();
                            this.resetRowIndex(frRows, args.e, this.parent.getFrozenRightRows(), this.requestType === 'add');
                        }
                    }
                }
                if (!this.isLastPage) {
                    this.createRow(rows, args);
                } else {
                    this.isLastPage = false;
                    this.parent.pageSettings.currentPage = this.maxPage;
                    if (this.parent.selectionModule.index < this.parent.frozenRows) {
                        remove(rowElms[this.parent.frozenRows - 1]);
                        this.createRow([rows[this.parent.frozenRows - 1]], args, false, true);
                        if (frozenCols) {
                            const movableRows: Element[] = this.parent.getMovableDataRows();
                            remove(movableRows[this.parent.frozenRows]);
                            this.createRow([this.parent.getMovableRowsObject()[this.parent.frozenRows - 1]], args, true, true);
                            if (this.parent.getFrozenMode() === literals.leftRight) {
                                const rightRows: Element[] = this.parent.getFrozenRightDataRows();
                                remove(rightRows[this.parent.frozenRows]);
                                this.createRow(
                                    [this.parent.getFrozenRightRowsObject()[this.parent.frozenRows - 1]], args, false, true, true
                                );
                            }
                        }
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
        if (isFrozenRight) {
            tbody = this.parent.element.querySelector('.e-frozen-right-content').querySelector( literals.tbody);
        } else {
            tbody = !this.parent.isFrozenGrid() ? this.parent.getContent().querySelector( literals.tbody) : isMovable
                ? this.parent.getMovableVirtualContent().querySelector( literals.tbody)
                : this.parent.getFrozenVirtualContent().querySelector( literals.tbody);
        }
        if (this.parent.frozenRows) {
            tbody = isFrozenRows && this.requestType !== 'add' || !isFrozenRows && this.requestType === 'add'
                ? !this.parent.isFrozenGrid() ? this.parent.getHeaderContent().querySelector( literals.tbody)
                    : isMovable ? this.parent.getMovableVirtualHeader().querySelector( literals.tbody)
                        : isFrozenRight ? this.parent.element.querySelector('.e-frozen-right-header').querySelector( literals.tbody)
                            : this.parent.getFrozenVirtualHeader().querySelector( literals.tbody) : tbody;
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
            const rowElems: Element[] = isMovable ? this.parent.getMovableDataRows() : isFrozenRight ? this.parent.getFrozenRightDataRows()
                : this.parent.getRows();
            const index: number = (isMovable || isFrozenRight) && this.requestType === 'add'
                ? this.parent.frozenRows : this.parent.frozenRows - 1;
            remove(rowElems[parseInt(index.toString(), 10)]);
            this.createRow([rows[this.parent.frozenRows - 1]], args, isMovable, true, isFrozenRight);
        }
        if (!this.parent.infiniteScrollSettings.enableCache && !isFrozenRows) {
            if (isFrozenRight) {
                setRowElements(this.parent);
                (<{ rightFreezeRows?: Row<Column>[] }>this.parent.contentModule).rightFreezeRows = this.requestType === 'add'
                    ? row.concat(rows) : rows.concat(row);
            } else if (!this.parent.isFrozenGrid() || isMovable) {
                setRowElements(this.parent);
                (<{ visibleRows?: Row<Column>[] }>this.parent.contentModule).visibleRows = this.requestType === 'add'
                    ? row.concat(rows) : rows.concat(row);
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    (<{ renderMovableContent?: boolean }>args.e).renderMovableContent = true;
                    this.createRow(this.parent.getFrozenRightRowsObject(), args, false, false, true);
                }
            } else {
                (<{ visibleFrozenRows?: Row<Column>[] }>this.parent.contentModule).visibleFrozenRows = this.requestType === 'add'
                    ? row.concat(rows) : rows.concat(row);
                args.e.isFrozen = true;
                this.createRow(this.parent.getMovableRowsObject(), args, true);
            }
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
                    remove(rowElms[parseInt(index.toString(), 10)]);
                    rowElms.splice(index, 1);
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
            const frozenCols: boolean = this.parent.isFrozenGrid();
            const keys: string[] = frozenCols ? Object.keys(this.infiniteFrozenCache) : Object.keys(this.infiniteCache);
            for (let i: number = 1; i <= keys.length; i++) {
                const cache: Row<Column>[] = frozenCols ? args.isFreeze ? this.infiniteFrozenCache[parseInt(i.toString(), 10)][0]
                    : this.infiniteFrozenCache[parseInt(i.toString(), 10)][1] : this.infiniteCache[parseInt(i.toString(), 10)];
                cache.filter((e: Row<Column>) => {
                    e.cells[args.index].visible = args.visible === '';
                });
            }
            this.resetContentModuleCache(frozenCols ? this.infiniteFrozenCache : this.infiniteCache);
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
            this.isAdd = false;
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
            this.isAdd = this.isEdit = false;
            if (this.isNormaledit) {
                this.editRowIndex = this.empty as number;
                this.virtualInfiniteData = {};
                (<{ previousVirtualData?: Object }>this.parent.editModule).previousVirtualData = {};
            }
        }
    }

    private resetInfiniteEdit(): void {
        if (this.parent.enableInfiniteScrolling && this.isNormaledit) {
            if ((this.parent.editSettings.allowEditing && this.isEdit) || (this.parent.editSettings.allowAdding && this.isAdd)) {
                this.parent.isEdit = true;
            }
        }
    }

    private getVirtualInfiniteData(data: { virtualData: Object, isAdd: boolean, isCancel: boolean }): void {
        if (this.parent.infiniteScrollSettings.enableCache && this.parent.isEdit && isNullOrUndefined(data['endEdit'])) {
            this.parent.editModule.closeEdit();
        }
        else {
            this.getVirtualInfiniteEditedData();
            data.virtualData = this.virtualInfiniteData;
            data.isAdd = this.isAdd;
            data.isCancel = this.isCancel;
        }
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
        this.restoreInfiniteEdit();
        this.restoreInfiniteAdd();
        const targetEle: HTMLElement = e.target as HTMLElement;
        const isInfinite: boolean = targetEle.classList.contains(literals.content);
        if (isInfinite && this.parent.enableInfiniteScrolling && !e.isLeft) {
            const scrollEle: Element = this.parent.getContent().firstElementChild;
            const captionRows: Element[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
            this.prevScrollTop = scrollEle.scrollTop;
            const rows: Element[] = this.parent.groupSettings.enableLazyLoading ? captionRows : this.parent.getRows();
            if (!rows.length) {
                return;
            }
            const index: number = getRowIndexFromElement(rows[rows.length - 1]) + 1;
            const prevPage: number = this.parent.pageSettings.currentPage;
            let args: InfiniteScrollArgs;
            const offset: number = targetEle.scrollHeight - targetEle.scrollTop;
            const round: number = Math.round(targetEle.scrollHeight - targetEle.scrollTop);
            let floor: number = offset < targetEle.clientHeight ? Math.ceil(offset) : Math.floor(offset);
            if (floor > targetEle.clientHeight) { floor = floor - 1; }
            const isBottom: boolean = (floor === targetEle.clientHeight || round === targetEle.clientHeight);
            if (!isNullOrUndefined(this.groupCaptionAction)) { return; }
            if (this.isScroll && isBottom && (this.parent.pageSettings.currentPage <= this.maxPage - 1 || this.enableContinuousScroll)) {
                if (this.parent.infiniteScrollSettings.enableCache) {
                    this.isUpScroll = false;
                    this.isDownScroll = true;
                }
                const rows: Element[] = [].slice.call(scrollEle.querySelectorAll('.e-row:not(.e-addedrow)'));
                const row: Element = rows[rows.length - 1];
                const rowIndex: number = !this.parent.groupSettings.enableLazyLoading ? getRowIndexFromElement(row) :
                    this.parent.contentModule['visibleRows'].length - 1;
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
                const row: Element = [].slice.call(scrollEle.getElementsByClassName(literals.row));
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
                this.parent.pageSettings.currentPage = this.maxPage;
            }
        }
    }

    private infinitePageQuery(query: Query): void {
        if (this.initialRender) {
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
            this.infiniteFrozenCache = {};
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
            const cellIdx: number = parseInt(cell.getAttribute('data-colindex'), 10);
            const rowIdx: number = parseInt(cell.parentElement.getAttribute('data-rowindex'), 10);
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
            this.cellIndex = parseInt(cell.getAttribute(literals.dataColIndex), 10);
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
            if (this.parent.isFrozenGrid()) {
                this.virtualInfiniteData = this.parent.editModule
                    .getCurrentEditedData(this.parent.getMovableVirtualContent().querySelector('.e-gridform'), rowData);
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
        const frozenCols: boolean = this.parent.isFrozenGrid();
        const scrollEle: Element = this.parent.getContent().firstElementChild;
        const isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling && e.args.requestType === 'infiniteScroll';
        const isMovable: boolean = this.parent.getFrozenMode() === literals.leftRight &&  e.tableName === 'movable';
        if ((this.parent.isAngular || this.parent.isReact || this.parent.isVue || this.parent.isVue3) && isInfiniteScroll &&
         !e.args.isFrozen && this.parent.infiniteScrollSettings.enableCache){
            const isChildGrid: boolean = this.parent.childGrid && this.parent.element.querySelectorAll('.e-childgrid').length ? true : false;
            const rows: Element[] | NodeListOf<Element> = this.parent.getDataRows();
            if (frozenCols) {
                this.parent.contentModule['freezeRowElements'] = rows;
                const mCont: Element = this.parent.getContent().querySelector('.' + literals.movableContent);
                const frLCont: Element = this.parent.getContent().querySelector('.e-frozen-left-content');
                if (mCont && mCont.querySelectorAll('.e-templatecell').length) {
                    (this.parent as Grid).refreshReactTemplateTD(this.parent.getMovableDataRows(), isChildGrid, true);
                }
                if (frLCont && frLCont.querySelectorAll('.e-templatecell').length) {
                    (this.parent as Grid).refreshReactTemplateTD(this.parent.getDataRows(), isChildGrid, true);
                }
                this.parent.contentModule['freezeRowElements'] = this.parent.getRows();
            } else {
                (this.parent as Grid).refreshReactTemplateTD(rows, isChildGrid);
            }
        }
        if ((isInfiniteScroll && !e.args.isFrozen && !isMovable) || !isInfiniteScroll) {
            if (isInfiniteScroll && e.args.direction === 'up') {
                e.tbody.insertBefore(e.frag, e.tbody.firstElementChild);
            } else {
                e.tbody.appendChild(e.frag);
            }
        }
        if (!frozenCols) {
            (this.parent as Grid).contentModule.getTable().appendChild(e.tbody);
            this.updateCurrentViewData();
        } else {
            if (isInfiniteScroll) {
                if (e.tableName === literals.frozenLeft || (this.parent.getFrozenMode() === 'Right' && e.tableName === literals.frozenRight)) {
                    this.frozenFrag = e.frag;
                } else if (this.parent.getFrozenMode() === literals.leftRight && e.tableName === 'movable') {
                    this.movableFrag = e.frag;
                } else {
                    const tbody: Element = this.parent.getFrozenVirtualContent().querySelector( literals.tbody);
                    if (e.args.direction === 'up') {
                        tbody.insertBefore(this.frozenFrag, tbody.firstElementChild);
                    } else {
                        tbody.appendChild(this.frozenFrag);
                    }
                    if (e.tableName === literals.frozenRight) {
                        this.parent.getMovableVirtualContent().querySelector( literals.tbody).appendChild(this.movableFrag);
                        this.parent.element.querySelector('.e-frozen-right-content').querySelector( literals.tbody).appendChild(e.frag);
                    } else {
                        this.parent.getMovableVirtualContent().querySelector('.' + literals.table).appendChild(e.tbody);
                    }
                    (<{ refreshScrollOffset?: Function }>this.parent.contentModule).refreshScrollOffset();
                    this.updateCurrentViewData();
                }
            } else {
                let table: Element;
                if (e.tableName === literals.frozenLeft) {
                    table = this.parent.getFrozenVirtualContent().querySelector('.' + literals.table);
                } else if (e.tableName === 'movable') {
                    table = this.parent.getMovableVirtualContent().querySelector('.' + literals.table);
                    if (this.parent.getFrozenMode() !== literals.leftRight) {
                        (<{ refreshScrollOffset?: Function }>this.parent.contentModule).refreshScrollOffset();
                        this.updateCurrentViewData();
                    }
                } else {
                    table = this.parent.element.querySelector('.e-frozen-right-content').querySelector('.' + literals.table);
                    if (this.parent.getFrozenMode() === literals.leftRight) {
                        (<{ refreshScrollOffset?: Function }>this.parent.contentModule).refreshScrollOffset();
                        this.updateCurrentViewData();
                    }
                }
                table.appendChild(e.tbody);
                this.widthService.refreshFrozenScrollbar();
            }
        }
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
            const rows: Element[] = [].slice.call(this.parent.getContentTable().getElementsByClassName(literals.row));
            if (e.args.direction === 'down') {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    const captionRows: Element[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
                    this.removeCaptionRows(captionRows, e.args);
                }
                const addRowCount: number = this.parent.element.querySelector('.' + literals.addedRow) ? 0 : 1;
                this.removeTopRows(rows, this.parent.pageSettings.pageSize - addRowCount);
            }
            if (e.args.direction === 'up') {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    const captionRows: Element[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
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
        const frozeCols: boolean = this.parent.isFrozenGrid();
        const frRows: Element[] = this.parent.getFrozenMode() === literals.leftRight
            ? [].slice.call(this.parent.element.querySelector('.e-frozen-right-content').getElementsByClassName(literals.row)) : null;
        const movableRows: Element[] = frozeCols ?
            [].slice.call(this.parent.getMovableVirtualContent().getElementsByClassName(literals.row)) : null;
        for (let i: number = 0; i <= maxIndx; i++) {
            if (this.parent.frozenRows && this.parent.pageSettings.currentPage === this.parent.infiniteScrollSettings.maxBlocks + 1
                && i > (maxIndx - this.parent.frozenRows)) {
                continue;
            }
            remove(rows[parseInt(i.toString(), 10)]);
            if (movableRows) {
                remove(movableRows[parseInt(i.toString(), 10)]);
            }
            if (frRows) {
                remove(frRows[parseInt(i.toString(), 10)]);
            }
        }
    }

    private removeBottomRows(rows: Element[], maxIndx: number, args: InfiniteScrollArgs): void {
        let cnt: number = 0;
        const frozeCols: boolean = this.parent.isFrozenGrid();
        const movableRows: Element[] = frozeCols ?
            [].slice.call(this.parent.getMovableVirtualContent().getElementsByClassName(literals.row)) : null;
        const frRows: Element[] = this.parent.getFrozenMode() === literals.leftRight ?
            [].slice.call(this.parent.element.querySelector('.e-frozen-right-content').getElementsByClassName(literals.row)) : null;
        const pageSize: number = this.parent.pageSettings.pageSize;
        if (!frozeCols && this.infiniteCache[args.prevPage].length < pageSize) {
            cnt = this.parent.pageSettings.pageSize - this.infiniteCache[args.prevPage].length;
        }
        if (frozeCols && this.infiniteFrozenCache[args.prevPage][1].length < pageSize) {
            cnt = this.parent.pageSettings.pageSize - this.infiniteFrozenCache[args.prevPage][1].length;
        }
        for (let i: number = maxIndx; cnt < pageSize; i--) {
            cnt++;
            remove(rows[parseInt(i.toString(), 10)]);
            if (movableRows) {
                remove(movableRows[parseInt(i.toString(), 10)]);
            }
            if (frRows) {
                remove(frRows[parseInt(i.toString(), 10)]);
            }
        }
    }

    private removeCaptionRows(rows: Element[], args: InfiniteScrollArgs): void {
        const rowElements: Element[] = [].slice.call(this.parent.getContent().getElementsByClassName(literals.row));
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
                startIndex += this.infiniteCache[parseInt(i.toString(), 10)].length;
            }
            for (let i: number = startIndex; i < rows.length; i++) {
                remove(rows[parseInt(i.toString(), 10)]);
            }
        }
    }

    private resetInfiniteBlocks(args: InfiniteScrollArgs, isDataModified?: boolean): void {
        const isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling && args.requestType !== 'infiniteScroll';
        if (!this.initialRender && !isNullOrUndefined((this.parent as Grid).infiniteScrollModule) && isInfiniteScroll) {
            if (this.actions.some((value: string) => value === args.requestType) || isDataModified || (args.requestType === 'save'
                && (this.parent.sortSettings.columns.length || this.parent.filterSettings.columns.length
                || this.parent.groupSettings.columns.length || this.parent.searchSettings.key))) {
                const scrollEle: Element = this.parent.getContent().firstElementChild;
                this.initialRender = true;
                scrollEle.scrollTop = 0;
                this.parent.pageSettings.currentPage = 1;
                this.infiniteCache = this.infiniteFrozenCache = {};
                this.infiniteCurrentViewData = {};
                this.resetContentModuleCache({});
                this.isRemove = false;
                this.top = 0;
                this.isInitialMovableRender = true;
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
            const frozeCols: boolean = this.parent.isFrozenGrid();
            const idx: number = e.args.isFrozen ? 1 : 0;
            const isEdit: boolean = e.args.requestType !== 'infiniteScroll'
                && (this.requestType === 'delete' || this.requestType === 'add');
            const currentPage: number = this.parent.pageSettings.currentPage;
            if ((frozeCols && this.isInitialMovableRender) || (!frozeCols && !Object.keys(this.infiniteCache).length) || isEdit) {
                this.isInitialMovableRender = !e.args.isFrozen;
                this.setInitialCache(e.modelData, e.args, isEdit);
            }
            if (!frozeCols && isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage])) {
                this.infiniteCache[this.parent.pageSettings.currentPage] = e.modelData;
                this.resetContentModuleCache(this.infiniteCache);
            }
            if (frozeCols) {
                if ((idx === 0 && isNullOrUndefined(this.infiniteFrozenCache[parseInt(currentPage.toString(), 10)]))
                    || !this.infiniteFrozenCache[parseInt(currentPage.toString(), 10)][parseInt(idx.toString(), 10)].length) {
                    this.createFrozenCache(currentPage);
                    this.infiniteFrozenCache[parseInt(currentPage.toString(), 10)][parseInt(idx.toString(), 10)] = e.modelData;
                    if (idx === 1) {
                        this.resetContentModuleCache(this.infiniteFrozenCache);
                    }
                }
            }
            if (e.isInfiniteScroll && !this.isRemove) {
                this.isRemove = (currentPage - 1) % this.parent.infiniteScrollSettings.maxBlocks === 0;
                (<{ isRemove?: boolean }>(this.parent as Grid).contentModule).isRemove = this.isRemove;
            }
        }
    }

    private setInitialCache(data: Row<Column>[], args?: InfiniteScrollArgs, isEdit?: boolean, isCurrentViewData?: boolean): void {
        const frozenCols: boolean = this.parent.isFrozenGrid();
        const idx: number = args.isFrozen ? 1 : 0;
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
                    if (frozenCols) {
                        this.createFrozenCache(k);
                        this.infiniteFrozenCache[parseInt(k.toString(), 10)][parseInt(idx.toString(), 10)] = data
                            .slice(startIndex, endIndex);
                        this.resetContentModuleCache(this.infiniteFrozenCache);
                    } else {
                        this.infiniteCache[parseInt(k.toString(), 10)] = data.slice(startIndex, endIndex);
                        this.resetContentModuleCache(this.infiniteCache);
                    }
                }
            }
            k++;
        }
    }

    private createFrozenCache(index: number): void {
        if (!this.infiniteFrozenCache[parseInt(index.toString(), 10)]) {
            this.infiniteFrozenCache[parseInt(index.toString(), 10)] = [[], []];
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
