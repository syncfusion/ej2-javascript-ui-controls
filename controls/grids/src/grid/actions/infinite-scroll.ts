import { isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { IGrid, IAction, NotifyArgs, InfiniteScrollArgs, CellFocusArgs, KeyboardEventArgs } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import * as events from '../base/constant';
import { Grid } from '../base/grid';
import { getScrollBarWidth } from '../base/util';

/**
 * Infinite Scrolling class
 */
export class InfiniteScroll implements IAction {
    private parent: IGrid;
    private maxPage: number;
    private infiniteCache: { [x: number]: Row<Column>[] } = {};
    private isDownScroll: boolean = false;
    private isUpScroll: boolean = false;
    private isScroll: boolean = true;
    private top: number;
    private enableContinuousScroll: boolean = false;
    private initialRender: boolean = true;
    private pressedKey: string;
    private isRemove: boolean = false;
    private isInitialCollapse: boolean = false;
    private prevScrollTop: number = 0;
    private actions: string[] = ['filtering', 'searching', 'grouping', 'ungrouping', 'reorder'];
    private keys: string[] = ['downArrow', 'upArrow', 'PageUp', 'PageDown'];
    private rowIndex: number;
    private cellIndex: number;

    /**
     * Constructor for the Grid infinite scrolling.
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    public getModuleName(): string {
        return 'infiniteScroll';
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on(events.dataReady, this.onDataReady, this);
        this.parent.on(events.infinitePageQuery, this.infinitePageQuery, this);
        this.parent.on(events.infiniteScrollHandler, this.infiniteScrollHandler, this);
        this.parent.on(events.beforeCellFocused, this.infiniteCellFocus, this);
        this.parent.on(events.appendInfiniteContent, this.appendInfiniteRows, this);
        this.parent.on(events.removeInfiniteRows, this.removeInfiniteCacheRows, this);
        this.parent.on(events.resetInfiniteBlocks, this.resetInfiniteBlocks, this);
        this.parent.on(events.setInfiniteCache, this.setCache, this);
        this.parent.on(events.initialCollapse, this.ensureIntialCollapse, this);
        this.parent.on(events.keyPressed, this.infiniteCellFocus, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.dataReady, this.onDataReady);
        this.parent.off(events.infinitePageQuery, this.infinitePageQuery);
        this.parent.off(events.infiniteScrollHandler, this.infiniteScrollHandler);
        this.parent.off(events.beforeCellFocused, this.infiniteCellFocus);
        this.parent.off(events.appendInfiniteContent, this.appendInfiniteRows);
        this.parent.off(events.removeInfiniteRows, this.removeInfiniteCacheRows);
        this.parent.off(events.resetInfiniteBlocks, this.resetInfiniteBlocks);
        this.parent.off(events.setInfiniteCache, this.setCache);
        this.parent.off(events.initialCollapse, this.ensureIntialCollapse);
        this.parent.off(events.keyPressed, this.infiniteCellFocus);
    }

    private onDataReady(e: NotifyArgs): void {
        if (!isNullOrUndefined(e.count)) {
            this.maxPage = Math.ceil(e.count / this.parent.pageSettings.pageSize);
        }
    }

    private ensureIntialCollapse(isExpand: boolean): void {
        this.isInitialCollapse = !isExpand;
    }

    private infiniteScrollHandler(e: Event): void {
        if ((e.target as HTMLElement).classList.contains('e-content') && this.parent.infiniteScrollSettings.enableScroll) {
            let scrollEle: Element = this.parent.getContent().firstElementChild;
            let direction: string = this.prevScrollTop < scrollEle.scrollTop ? 'down' : 'up';
            this.prevScrollTop = scrollEle.scrollTop;
            let rows: Element[] = this.parent.getRows();
            let index: number = parseInt(rows[rows.length - 1].getAttribute('aria-rowindex'), 10) + 1;
            let prevPage: number = this.parent.pageSettings.currentPage;
            let args: InfiniteScrollArgs;
            let floor: number = Math.floor((e.target as HTMLElement).scrollHeight - (e.target as HTMLElement).scrollTop);
            let round: number = Math.round((e.target as HTMLElement).scrollHeight - (e.target as HTMLElement).scrollTop);
            let isBottom: boolean = (floor === (e.target as HTMLElement).clientHeight || round === (e.target as HTMLElement).clientHeight);
            if (this.isScroll && isBottom && (this.parent.pageSettings.currentPage <= this.maxPage - 1 || this.enableContinuousScroll)) {
                if (this.parent.infiniteScrollSettings.enableCache) {
                    this.isUpScroll = false;
                    this.isDownScroll = true;
                    setTimeout(
                        () => {
                            this.isScroll = true;
                        },
                        600);
                }
                let rows: Element[] = [].slice.call(this.parent.getContent()
                    .querySelectorAll('.e-row'));
                let row: Element = rows[rows.length - 1];
                let rowIndex: number = parseInt(row.getAttribute('aria-rowindex'), 10);
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

            if (this.isScroll && this.parent.infiniteScrollSettings.enableCache && (e.target as HTMLElement).scrollTop === 0
                && this.parent.pageSettings.currentPage !== 1) {
                if (this.parent.infiniteScrollSettings.enableCache) {
                    this.isDownScroll = false;
                    this.isUpScroll = true;
                    setTimeout(
                        () => {
                            this.isScroll = true;
                        },
                        600);
                }
                let row: Element = [].slice.call(this.parent.getContent()
                    .querySelectorAll('.e-row'))[this.parent.pageSettings.pageSize - 1];
                let rowIndex: number = parseInt(row.getAttribute('aria-rowindex'), 10);
                this.parent.pageSettings.currentPage = Math.ceil(rowIndex / this.parent.pageSettings.pageSize) - 1;
                if (this.parent.pageSettings.currentPage) {
                    args = {
                        requestType: 'infiniteScroll',
                        currentPage: this.parent.pageSettings.currentPage,
                        prevPage: prevPage,
                        direction: 'up'
                    };
                    this.makeRequest(args);
                }
            }
            if (this.parent.infiniteScrollSettings.enableCache && !this.isScroll && isNullOrUndefined(args)) {
                if (this.isDownScroll || this.isUpScroll) {
                    this.parent.getContent().firstElementChild.scrollTop = this.top;
                }
            }
        }
    }

    private makeRequest(args: InfiniteScrollArgs): void {
        if (this.parent.pageSettings.currentPage !== args.prevPage) {
            if (isNullOrUndefined(this.infiniteCache[args.currentPage]) && args.direction !== 'up') {
                this.parent.notify('model-changed', args);
            } else {
                setTimeout(
                    () => {
                        this.parent.notify(events.refreshInfiniteModeBlocks, args);
                    },
                    100);
            }
        }
    }

    private infinitePageQuery(query: Query): void {
        if (this.initialRender) {
            this.initialRender = false;
            this.intialPageQuery(query);
        } else {
            query.page(this.parent.pageSettings.currentPage, this.parent.pageSettings.pageSize);
        }
    }

    private intialPageQuery(query: Query): void {
        if (this.parent.infiniteScrollSettings.enableCache
            && this.parent.infiniteScrollSettings.initialBlocks > this.parent.infiniteScrollSettings.maxBlock) {
            this.parent.infiniteScrollSettings.initialBlocks = this.parent.infiniteScrollSettings.maxBlock;
        } else {
            let pageSize: number = this.parent.pageSettings.pageSize * this.parent.infiniteScrollSettings.initialBlocks;
            query.page(1, pageSize);
        }
    }

    private infiniteCellFocus(e: CellFocusArgs): void {
        if (e.byKey && (e.keyArgs.action === 'upArrow' || e.keyArgs.action === 'downArrow')) {
            this.pressedKey = e.keyArgs.action;
        } else if ((e as KeyboardEventArgs).key === 'PageDown' || (e as KeyboardEventArgs).key === 'PageUp') {
            this.pressedKey = (e as KeyboardEventArgs).key;
        }
    }

    private appendInfiniteRows(e: {
        tbody: Element, frag: DocumentFragment, args: InfiniteScrollArgs,
        rows: Row<Column>[], rowElements: Element[], visibleRows: Row<Column>[]
    }): void {
        let target: Element = document.activeElement;
        let isInfiniteScroll: boolean = this.parent.infiniteScrollSettings.enableScroll && e.args.requestType === 'infiniteScroll';
        if (isInfiniteScroll && e.args.direction === 'up') {
            e.tbody.insertBefore(e.frag, e.tbody.firstElementChild);
        } else {
            e.tbody.appendChild(e.frag);
        }
        (this.parent as Grid).contentModule.getTable().appendChild(e.tbody);
        if (isInfiniteScroll) {
            if (this.parent.infiniteScrollSettings.enableCache && this.isRemove) {
                if (e.args.direction === 'down') {
                    let startIndex: number = (this.parent.pageSettings.currentPage -
                        this.parent.infiniteScrollSettings.maxBlock) * this.parent.pageSettings.pageSize;
                    (<{ visibleRows?: Row<Column>[] }>(this.parent as Grid).contentModule).visibleRows =
                        e.rows.slice(startIndex, e.rows.length);
                }
                if (e.args.direction === 'up') {
                    let startIndex: number = (this.parent.pageSettings.currentPage - 1) * this.parent.pageSettings.pageSize;
                    let endIndex: number = ((this.parent.pageSettings.currentPage
                        + this.parent.infiniteScrollSettings.maxBlock) - 1) * this.parent.pageSettings.pageSize;
                    (<{ visibleRows?: Row<Column>[] }>(this.parent as Grid).contentModule).visibleRows =
                        e.rows.slice(startIndex, endIndex);
                }
                (<{ rowElements?: Element[] }>(this.parent as Grid).contentModule).rowElements =
                    [].slice.call(this.parent.getContent().querySelectorAll('.e-row'));
                this.parent.getContent().firstElementChild.scrollTop = this.top;
            }

            if (this.keys.some((value: string) => value === this.pressedKey)) {
                if (this.pressedKey === 'downArrow' || (this.parent.infiniteScrollSettings.enableCache && this.pressedKey === 'upArrow')) {
                    this.parent.focusModule.onClick({ target }, true);
                }
                if (this.pressedKey === 'PageDown') {
                    let row: Element = this.parent.getRowByIndex(e.args.startIndex);
                    if (row) {
                        (<{ cells?: HTMLElement[] }>row).cells[0].focus();
                    }
                }
                if (this.pressedKey === 'PageUp') {
                    (<{ cells?: HTMLElement[] }>e.tbody.querySelector('.e-row')).cells[0].focus();
                }
            }
            this.pressedKey = undefined;
        }
    }

    private removeInfiniteCacheRows(e: { args: InfiniteScrollArgs }): void {
        let isInfiniteScroll: boolean = this.parent.infiniteScrollSettings.enableScroll && e.args.requestType === 'infiniteScroll';
        if (isInfiniteScroll && this.parent.infiniteScrollSettings.enableCache && this.isRemove) {
            let rows: Element[] = [].slice.call(this.parent.getContentTable().querySelectorAll('.e-row'));
            if (e.args.direction === 'down') {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    let captionRows: Element[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
                    this.removeCaptionRows(captionRows, e.args);
                }
                this.removeTopRows(rows, this.parent.pageSettings.pageSize - 1);
            }
            if (e.args.direction === 'up') {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                    let captionRows: Element[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
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
        let scrollCnt: Element = this.parent.getContent().firstElementChild;
        if (args.direction === 'down') {
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length && !this.isInitialCollapse) {
                top = this.captionRowHeight();
            }
            let captionRows: Element[] = [].slice.call(this.parent.getContent().firstElementChild.querySelectorAll('tr:not(.e-row)'));
            let captionCount: number = 0;
            if (this.isInitialCollapse && !isNullOrUndefined(captionRows)) {
                captionCount = Math.round((captionRows.length - 1) / this.parent.groupSettings.columns.length);
            }
            let value: number = captionCount ? captionCount
                : this.parent.pageSettings.pageSize * (this.parent.infiniteScrollSettings.maxBlock - 1);
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
                top = this.infiniteCache[this.parent.pageSettings.currentPage].length * this.parent.getRowHeight();
            } else if (this.isInitialCollapse) {
                let groupedData: Row<Column>[] = this.infiniteCache[this.parent.pageSettings.currentPage];
                let count: number = 0;
                for (let i: number = 0; i < groupedData.length; i++) {
                    if (groupedData[i].isCaptionRow) {
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
        let rows: Element[] = [].slice.call(this.parent.getContent().querySelectorAll('tr:not(.e-row)'));
        return rows.length * this.parent.getRowHeight();
    }

    private removeTopRows(rows: Element[], maxIndx: number): void {
        for (let i: number = 0; i <= maxIndx; i++) {
            remove(rows[i]);
        }
    }

    private removeBottomRows(rows: Element[], maxIndx: number, args: InfiniteScrollArgs): void {
        let cnt: number = 0;
        if (this.infiniteCache[args.prevPage].length < this.parent.pageSettings.pageSize) {
            cnt = this.parent.pageSettings.pageSize - this.infiniteCache[args.prevPage].length;
        }
        for (let i: number = maxIndx; cnt < this.parent.pageSettings.pageSize; i--) {
            cnt++;
            remove(rows[i]);
        }
    }

    private removeCaptionRows(rows: Element[], args: InfiniteScrollArgs): void {
        if (args.direction === 'down') {
            let lastRow: Element = this.parent.getRows()[this.parent.pageSettings.pageSize];
            let lastRowIndex: number = parseInt(lastRow.getAttribute('aria-rowindex'), 10) - 1;
            let k: number = 0;
            for (let i: number = 0; k < lastRowIndex; i++) {
                if (!rows[i].classList.contains('e-row')) {
                    remove(rows[i]);
                } else {
                    k = parseInt(rows[i].getAttribute('aria-rowindex'), 10);
                }
            }
        }
        if (args.direction === 'up') {
            let rowElements: Element[] = [].slice.call(this.parent.getContent().querySelectorAll('.e-row'));
            let lastIndex: number = parseInt(rowElements[rowElements.length - 1].getAttribute('aria-rowindex'), 10);
            let page: number = Math.ceil(lastIndex / this.parent.pageSettings.pageSize);
            let startIndex: number = 0;
            for (let i: number = this.parent.pageSettings.currentPage + 1; i < page; i++) {
                startIndex += this.infiniteCache[i].length;
            }
            for (let i: number = startIndex; i < rows.length; i++) {
                remove(rows[i]);
            }
        }
    }

    private resetInfiniteBlocks(args: InfiniteScrollArgs): void {
        let isInfiniteScroll: boolean = this.parent.infiniteScrollSettings.enableScroll && args.requestType !== 'infiniteScroll';
        if (!this.initialRender && !isNullOrUndefined((this.parent as Grid).infiniteScrollModule) && isInfiniteScroll) {
            if (this.actions.some((value: string) => value === args.requestType)) {
                this.initialRender = true;
                this.parent.getContent().firstElementChild.scrollTop = 0;
                this.parent.pageSettings.currentPage = 1;
                this.infiniteCache = {};
                this.resetContentModuleCache({});
                this.isRemove = false;
                this.top = 0;
                this.isInitialCollapse = false;
                (<{ isRemove?: boolean }>(this.parent as Grid).contentModule).isRemove = this.isRemove;
            }
        }
    }

    private setCache(e: { isInfiniteScroll: boolean, modelData: Row<Column>[] }): void {
        if (this.parent.infiniteScrollSettings.enableScroll && this.parent.infiniteScrollSettings.enableCache) {
            if (!Object.keys(this.infiniteCache).length) {
                this.setInitialCache(e.modelData);
            }
            if (isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage])) {
                this.infiniteCache[this.parent.pageSettings.currentPage] = e.modelData;
                this.resetContentModuleCache(this.infiniteCache);
            }
            if (e.isInfiniteScroll && !this.isRemove) {
                this.isRemove = (this.parent.pageSettings.currentPage - 1) % this.parent.infiniteScrollSettings.maxBlock === 0;
                (<{ isRemove?: boolean }>(this.parent as Grid).contentModule).isRemove = this.isRemove;
            }
        }
    }

    private setInitialCache(data: Row<Column>[]): void {
        for (let i: number = 1; i <= this.parent.infiniteScrollSettings.initialBlocks; i++) {
            let startIndex: number = (i - 1) * this.parent.pageSettings.pageSize;
            let endIndex: number = i * this.parent.pageSettings.pageSize;
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                this.setInitialGroupCache(data, i, startIndex, endIndex);
            } else {
                this.infiniteCache[i] = data.slice(startIndex, endIndex);
                this.resetContentModuleCache(this.infiniteCache);
            }
        }
    }

    private setInitialGroupCache(data: Row<Column>[], index: number, sIndex: number, eIndex: number): void {
        let pageData: Object[] = [];
        let startIndex: number = 0;
        for (let i: number = 1; i <= Object.keys(this.infiniteCache).length; i++) {
            startIndex += this.infiniteCache[i].length;
        }
        let k: number = sIndex;
        for (let i: number = startIndex; i < data.length && k < eIndex; i++) {
            if (data[i].index < eIndex || data[i].isCaptionRow) {
                k = data[i].isCaptionRow ? k : data[i].index;
                pageData.push(data[i]);
            }
            if (data[i].index >= eIndex || data[i].index === eIndex - 1) {
                break;
            }
        }
        this.infiniteCache[index] = pageData as Row<Column>[];
        this.resetContentModuleCache(this.infiniteCache);
    }

    private resetContentModuleCache(data: { [x: number]: Row<Column>[] }): void {
        (<{ infiniteCache?: { [x: number]: Row<Column>[] } }>(this.parent as Grid).contentModule).infiniteCache = data;
    }

    /**
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}