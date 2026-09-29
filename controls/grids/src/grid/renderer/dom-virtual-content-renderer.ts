import { createElement, formatUnit, isNullOrUndefined, updateCSSText, closest, extend, Browser } from '@syncfusion/ej2-base';
import { IGrid, IRenderer, NotifyArgs, KeyboardEventArgs, InterSection } from '../base/interface';
import { ContentRender } from './content-renderer';
import { ServiceLocator } from '../services/service-locator';
import { ColumnWidthService } from '../services/width-controller';
import * as literals from '../base/string-literals';
import { getScrollBarWidth, ensureLastRow, ensureFirstRow, parentsUntil, getEditedDataIndex } from '../base/util';
import { Grid } from '../base/grid';
import * as events from '../base/constant';
import { dataReady, modelChanged, contentReady } from '../base/constant';
import { InterSectionObserver } from '../services/intersection-observer';
import { SentinelType, Offsets } from '../base/type';
import { GroupModelGenerator } from '../services/group-model-generator';
import { Row } from '../models/row';
import { Column } from '../models/column';

/**
 * @hidden
 */
export class DomVirtualElementHandler {
    public wrapper!: HTMLElement;
    public placeholder!: HTMLElement;
    public content!: HTMLElement;
    public table!: HTMLElement;
    public verticalScrollbar!: HTMLElement;
    public verticalScrollerContainer!: HTMLElement;
    public gridContent!: HTMLElement;

    public renderWrapper(height?: number): void {
        this.wrapper = createElement('div', { className: 'e-virtualtable e-dom-virtualtable' });
        updateCSSText(this.wrapper, `min-height: ${formatUnit(height as number)}; position: absolute;`);
        this.wrapper.appendChild(this.table);
        this.content.appendChild(this.wrapper);
    }

    public renderPlaceHolder(): void {
        this.placeholder = createElement('div', { className: 'e-virtualtrack e-dom-virtualtrack' });
        updateCSSText(this.placeholder, 'position: relative;');
        this.content.appendChild(this.placeholder);
    }

    public renderVerticalScrollbar(): void {
        this.verticalScrollbar = createElement('div', { className: 'e-virtual-vertical-scrollbar e-dom-virtual-vertical-scrollbar' });
        this.gridContent.style.position = 'relative';
        this.gridContent.appendChild(this.verticalScrollbar);
        this.verticalScrollerContainer = createElement('div', { className: 'e-virtual-vertical-track e-dom-virtual-vertical-track' });
        this.verticalScrollbar.appendChild(this.verticalScrollerContainer);
    }

    public adjustTable(yValue: number): void {
        updateCSSText(this.wrapper, `transform: translateY(${yValue}px);`);
    }

    public setVirtualHeight(height?: number): void {
        updateCSSText(this.placeholder, `height: ${!isNullOrUndefined(height) ? `${height}px` : '0px'};`);
    }
}

/**
 * @hidden
 */
export class DomVirtualContentRenderer extends ContentRender implements IRenderer {
    public virtualEle: DomVirtualElementHandler = new DomVirtualElementHandler();
    public content!: HTMLElement;
    private totalRecords: number = 0;
    private rowHeight: number = this.parent.getRowHeight();
    private currentScrollTop: number = 0;
    private prevScrollTop: number = -1;
    private prevStartIndex: number = -1;
    /**
     * @hidden
     */
    public currentStartIndex: number = 0;
    private preventScroll: boolean = false;
    private locator: ServiceLocator;
    private widthServices: ColumnWidthService;
    private expandedDetailRows: Map<number, number> = new Map<number, number>();
    private pendingSelectIndex: number = -1;
    private storedVirtualHeight: number = 0;
    private rowHeightCache: Map<number, number> = new Map<number, number>();
    private dynamicHeightSum: number = 0;
    private dynamicRowCount: number = 0;
    /** @hidden */
    public observer!: InterSectionObserver;
    private activeKey: string = '';
    public rowIndex: number = 0;
    public cellIndex: number = 0;
    private isCancel: boolean = false;
    /** @hidden */
    public offsets: { [x: number]: number } = {};
    /** @hidden */
    public offsetKeys: string[] = [];
    private actions: string[] = ['filtering', 'searching', 'grouping', 'ungrouping'];
    private count: number = 0;
    private maxPage: number = 0;
    private previousPage: number = 0;
    private pageSkip: number = -1;
    private pageTake: number = -1;
    private isNormaledit: boolean = this.parent.editSettings.mode === 'Normal';
    private editedRowIndex: number | undefined = undefined;
    private isAdd: boolean = false;
    /** @hidden */
    public virtualData: Object = {};
    private emptyRowData: Object = {};
    private boundActionComplete!: Function;
    private boundActionBegin!: Function;

    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.locator = locator as ServiceLocator;
        this.widthServices = (locator as ServiceLocator).getService<ColumnWidthService>('widthService');
        if (this.parent.isRowDomVirtualization()) {
            this.parent.on(events.selectVirtualRow, this.selectVirtualRow, this);
            this.parent.on(events.virtaulCellFocus, this.domVirtualCellFocus, this);
            this.parent.on(events.resetVirtualFocus, this.resetVirtualFocus, this);
        }
        this.parent.on(events.applyDomVirtualRowHeight, this.onApplyDomVirtualRowHeight, this);
        this.parent.on(events.refreshExpandandCollapse, this.onGroupExpandCollapse, this);
        this.parent.on(dataReady, this.onDataReady, this);
        this.parent.on(events.setVirtualPageQuery, this.setDomVirtualPageQuery, this);
        this.parent.on(events.virtualScrollEditActionBegin, this.editActionBegin, this);
        this.parent.on(events.virtualScrollAddActionBegin, this.addActionBegin, this);
        this.parent.on(events.virtualScrollEdit, this.restoreEdit, this);
        this.parent.on(events.virtualScrollEditSuccess, this.editSuccess, this);
        this.parent.on(events.editReset, this.resetIsedit, this);
        this.parent.on(events.getVirtualData, this.getVirtualData, this);
        this.parent.on(events.virtualScrollEditCancel, this.editCancel, this);
        this.boundActionComplete = this.actionComplete.bind(this);
        this.boundActionBegin = this.actionBegin.bind(this);
        this.parent.addEventListener(events.actionComplete, this.boundActionComplete);
        this.parent.addEventListener(events.actionBegin, this.boundActionBegin);
    }

    public renderTable(): void {
        super.renderTable();
        this.virtualEle.table = <HTMLElement>this.getTable();
        this.virtualEle.gridContent = this.parent.element.querySelector('.' + literals.gridContent) as HTMLElement;
        this.virtualEle.content = this.content = <HTMLElement>this.getPanel().querySelector('.' + literals.content);
        updateCSSText(this.virtualEle.gridContent, 'position: relative;');
        updateCSSText(this.virtualEle.content, 'position: relative;');
        this.virtualEle.renderWrapper(<number>this.parent.height);
        this.virtualEle.renderPlaceHolder();
        if (this.parent.isRowDomVirtualization()) {
            this.virtualEle.renderVerticalScrollbar();
            updateCSSText(this.virtualEle.verticalScrollbar, `width: ${getScrollBarWidth() + 1}px; overflow-x: scroll;`);
        }
        this.bindScrollEvents();
    }

    public refreshContentRows(args: NotifyArgs = {}): void {
        const gObj: IGrid = this.parent;
        if (gObj.isRowDomVirtualization()) {
            if (!gObj.currentViewData || (gObj.currentViewData as Object[]).length === 0) { return; }
            if ( args.requestType && args.requestType !== 'dom-virtualscroll') {
                this.expandedDetailRows.clear();
                this.rowHeightCache.clear();
                this.dynamicHeightSum = 0;
                this.dynamicRowCount = 0;
                this.storedVirtualHeight = 0;
            }
            if (this.virtualEle.gridContent && this.virtualEle.gridContent.style.position !== 'relative') {
                updateCSSText(this.virtualEle.gridContent, 'position: relative;');
            }
            if (this.virtualEle.content && this.virtualEle.content.style.position !== 'relative') {
                updateCSSText(this.virtualEle.content, 'position: relative;');
            }
            const isGrouped: boolean = !!(gObj.groupSettings && gObj.groupSettings.columns && gObj.groupSettings.columns.length);
            if (isGrouped) {
                const gen: GroupModelGenerator = this.generator as GroupModelGenerator;
                gen.buildGroupRowObj(gObj.currentViewData as { length: number }, args.requestType);
                this.totalRecords = gen.getVisibleGroupRows().length;
            } else {
                this.totalRecords = (gObj.currentViewData as Object[]).length;
                if (this.parent.enableVirtualization) {
                    this.totalRecords = gObj.totalDataRecordsCount as number;
                }
            }
            if (this.parent.frozenRows) {
                this.totalRecords -= this.parent.frozenRows;
            }
            this.initializeRowHeight();
            this.setVirtualDimensions();
            const startIndex: number = this.getStartIndex(this.currentScrollTop);
            const endIndex: number = this.getEndIndex(startIndex);
            if (this.parent.enableVirtualization) {
                const startPage: number = this.getPageFromIndex(startIndex);
                this.parent.setProperties({ pageSettings: { currentPage: startPage } }, true);
                const pageSize: number = (this.parent.pageSettings as { pageSize: number }).pageSize;
                const pageOffset: number = (this.parent.pageSettings.currentPage - 1) * pageSize;
                this.currentStartIndex = Math.max(startIndex, pageOffset);
            } else {
                this.currentStartIndex = startIndex;
            }
            const frozenOffset: number = this.parent.frozenRows;
            const isScrollRequest: boolean = (args as { requestType?: string }).requestType === 'dom-virtualscroll';
            (<{startIndex: number, endIndex: number}>args).startIndex = startIndex + (isScrollRequest ? frozenOffset : 0);
            (<{startIndex: number, endIndex: number}>args).endIndex = endIndex + (isScrollRequest ? frozenOffset : 0);
            this.prevStartIndex = startIndex;
        }
        if (this.parent.enableVirtualization && !gObj.isInitialLoad && (args as { requestType?: string }).requestType !== 'dom-virtualscroll') {
            const startIndex: number = this.getStartIndex(this.currentScrollTop);
            const endIndex: number = this.getEndIndex(startIndex);
            const currentData: number = (this.parent.getCurrentViewRecords() as Object[]).length;
            if (currentData > 0 && endIndex > currentData) {
                this.checkAndFetchCrossPageData(startIndex);
                return;
            }
        }
        super.refreshContentRows(args);
    }

    public appendContent(tbody: Element, frag: DocumentFragment, args: NotifyArgs, tableName?: string): void {
        super.appendContent(tbody, frag, args, tableName);
        if (this.parent.isRowDomVirtualization()) {
            if (this.isAutoRowHeight()) {
                this.measureRowHeights(tbody);
            }
            if (this.parent.enableVirtualization) {
                this.refreshOffsets();
                if ((args as { requestType?: string }).requestType === 'dom-virtualscroll') {
                    this.parent.removeMaskRow();
                }
            }
            this.setVirtualDimensions();
            this.virtualEle.adjustTable(this.getRowTopOffset(this.currentStartIndex));
            if (this.pendingSelectIndex >= 0) {
                const targetRow: Element = (this.parent.getRowByIndex as Function)(this.pendingSelectIndex);
                if (targetRow) {
                    const indexToSelect: number = this.pendingSelectIndex;
                    this.pendingSelectIndex = -1;
                    (this.parent.selectRow as Function)(indexToSelect);
                }
            }
            this.focusCell();
            this.restoreEdit(args);
        }
    }

    public renderEmpty(tbody: HTMLElement): void {
        this.getTable().appendChild(tbody);
        if (this.parent.frozenRows || this.parent.pinnedTopRowModels.length) {
            this.parent.getHeaderContent().querySelector(literals.tbody).innerHTML = '';
        }
        this.virtualEle.adjustTable(0);
        this.virtualEle.setVirtualHeight(0);
        if (this.virtualEle.verticalScrollerContainer) {
            updateCSSText(this.virtualEle.verticalScrollerContainer, 'height: 0px;');
        }
    }

    private bindScrollEvents(): void {
        const userThrottle: number = (this.parent as Grid).domVirtualizationSettings.scrollThrottle;
        const browserDefault: number = Browser.info.name === 'chrome' ? 200 : 100;
        const scrollThrottle: number = (this.parent.enableVirtualization && this.parent.isRowDomVirtualization())
            ? (userThrottle > browserDefault ? userThrottle : browserDefault)
            : userThrottle;
        const opt: InterSection = {
            container: this.content,
            pageHeight: this.content.clientHeight * 2,
            debounceEvent: false,
            axes: ['Y'],
            verticalScrollbar: this.virtualEle.verticalScrollbar,
            scrollThrottle: scrollThrottle
        };
        this.observer = new InterSectionObserver(this.virtualEle.wrapper, opt);
        const fn: Function = () => {
            const pageHeight: number = this.storedVirtualHeight > 0 ? this.storedVirtualHeight
                : this.content.clientHeight * 2;
            this.observer.setPageHeight(pageHeight);
            window.addEventListener('resize', this.updateScrollbarOnResize.bind(this));
            this.observer.observe(
                (scrollArgs: ScrollArg) => this.domScrollListener(scrollArgs),
                this.onEntered()
            );
            this.parent.off(contentReady, fn);
        };
        this.parent.on(contentReady, fn, this);
    }

    private domScrollListener(scrollArgs: ScrollArg): void {
        if (this.preventScroll) { return; }
        if (!this.parent.isRowDomVirtualization() || this.totalRecords === 0) { return; }
        this.currentScrollTop = scrollArgs.offset.top;
        this.prevScrollTop = this.currentScrollTop;
        this.scrollAfterEdit();
        const startIndex: number = this.getStartIndex(this.currentScrollTop);
        if (startIndex === this.prevStartIndex) { return; }
        if (this.parent.enableVirtualization) {
            this.checkAndFetchCrossPageData(startIndex);
        } else {
            this.refreshContentRows({ requestType: 'dom-virtualscroll' });
        }
    }

    private checkAndFetchCrossPageData(startIndex: number): void {
        const pageSize: number = (this.parent.pageSettings as { pageSize: number }).pageSize;
        const endIndex: number = this.getEndIndex(startIndex);
        const startPage: number = this.getPageFromIndex(startIndex);
        const endPage: number = this.getPageFromIndex(Math.max(0, endIndex - 1));
        const isCrossPage: boolean = endPage > startPage;
        const newSkip: number = isCrossPage ? (startPage - 1) * pageSize : -1;
        const newTake: number = isCrossPage ? (endPage - startPage + 1) * pageSize : -1;
        const pageChanged: boolean = startPage !== (this.parent.pageSettings.currentPage as number);
        const rangeChanged: boolean = newSkip !== this.pageSkip;
        if (pageChanged || rangeChanged) {
            this.pageSkip = newSkip;
            this.pageTake = newTake;
            this.parent.setProperties({ pageSettings: { currentPage: startPage } }, true);
            if (this.previousPage !== startPage || rangeChanged) {
                this.previousPage = startPage;
                if (this.parent.enableVirtualMaskRow) {
                    this.parent.showMaskRow();
                    this.parent.addShimmerEffect();
                }
                this.parent.notify(modelChanged, { requestType: 'dom-virtualscroll' });
            }
        }
    }

    private onEntered(): Function {
        return (_element: HTMLElement, _current: SentinelType, direction: string, e: Offsets) => {
            if (this.parent.enableVirtualization && this.parent.isRowDomVirtualization()
                && (direction === 'down' || direction === 'up')) {
                const pageSize: number = (this.parent.pageSettings as { pageSize: number }).pageSize;
                this.currentScrollTop = e.top;
                const startIndex: number = this.getStartIndex(this.currentScrollTop);
                const endIndex: number = this.getEndIndex(startIndex);
                const startPage: number = this.getPageFromIndex(startIndex);
                const endPage: number = this.getPageFromIndex(Math.max(0, endIndex - 1));
                const isCrossPage: boolean = endPage > startPage;
                const newSkip: number = isCrossPage ? (startPage - 1) * pageSize : -1;
                const pageChanged: boolean = startPage !== (this.parent.pageSettings.currentPage as number);
                const rangeChanged: boolean = newSkip !== this.pageSkip;
                if ((pageChanged || rangeChanged) && this.parent.enableVirtualMaskRow) {
                    this.parent.showMaskRow();
                } else {
                    this.refreshContentRows({ requestType: 'dom-virtualscroll' });
                    this.virtualEle.adjustTable(this.getRowTopOffset(this.currentStartIndex));
                }
            }
        };
    }

    protected onDataReady(e?: NotifyArgs): void {
        if (e && !isNullOrUndefined(e.count)) {
            this.count = e.count as number;
            this.maxPage = Math.ceil(
                (e.count as number) / (this.parent.pageSettings as { pageSize: number }).pageSize);
        }
        const requestType: string | undefined = e ? e.requestType : undefined;
        const resetActions: string[] = ['refresh', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder'];
        if (resetActions.some((value: string) => value === requestType) || isNullOrUndefined(requestType)) {
            this.previousPage = 0;
            this.pageSkip = -1;
            this.pageTake = -1;
            this.refreshOffsets();
        }
        this.resetScrollPosition(e.requestType);
    }

    private setDomVirtualPageQuery(args: { query: { skip: Function, take: Function }, skipPage: boolean }): void {
        if (!this.parent.enableVirtualization || !this.parent.isRowDomVirtualization()) { return; }
        const isCrossPageFetch: boolean = this.pageSkip >= 0;
        if (!isCrossPageFetch) { return; }
        args.query.skip(this.pageSkip);
        args.query.take(this.pageTake);
        args.skipPage = true;
    }

    /**
     * @returns {void}
     * @hidden */
    public refreshOffsets(): void {
        if (!this.parent.enableVirtualization || !this.parent.isRowDomVirtualization()) { return; }
        const pageSize: number = (this.parent.pageSettings as { pageSize: number }).pageSize;
        const blockSize: number = pageSize >> 1;
        if (blockSize <= 0 || this.count <= 0) { return; }
        const totalBlocks: number = Math.ceil(this.count / blockSize);
        this.maxPage = Math.ceil(this.count / pageSize);
        this.offsets = {};
        const rowHeight: number = this.rowHeight > 0 ? this.rowHeight : (this.parent.getRowHeight as Function)();
        for (let block: number = 1; block <= totalBlocks; block++) {
            const startRow: number = (block - 1) * blockSize;
            const endRow: number = Math.min(block * blockSize, this.count);
            const blockRowCount: number = endRow - startRow;
            this.offsets[parseInt(block.toString(), 10)] = (this.offsets[parseInt((block - 1).toString(), 10)] || 0)
            + blockRowCount * rowHeight;
        }
        this.offsetKeys = Object.keys(this.offsets);
    }

    private getPageFromIndex(absoluteIndex: number): number {
        if (this.maxPage <= 0) { return 1; }
        const pageSize: number = (this.parent.pageSettings as { pageSize: number }).pageSize;
        return Math.max(1, Math.min(Math.floor(absoluteIndex / pageSize) + 1, this.maxPage));
    }

    private isAutoRowHeight(): boolean {
        const gObj: Grid = this.parent as Grid;
        const settings: { autoRowHeight?: boolean } = gObj.domVirtualizationSettings;
        return settings.autoRowHeight !== false;
    }

    private hasRowHeightCallback(): boolean {
        return !this.isAutoRowHeight() && typeof (this.parent as Grid).setRowHeight === 'function';
    }

    private isDynamicHeight(): boolean {
        return this.isAutoRowHeight() || this.hasRowHeightCallback();
    }

    private measureRowHeights(tbody: Element): void {
        const rowObjects: Row<Column>[] = this.getRows() as Row<Column>[];
        const dataRows: NodeListOf<Element> = tbody.querySelectorAll('tr');
        for (let i: number = 0; i < dataRows.length; i++) {
            const h: number = (dataRows[parseInt(i.toString(), 10)] as HTMLElement).offsetHeight;
            if (h > 0 && rowObjects[parseInt(i.toString(), 10)]) {
                rowObjects[parseInt(i.toString(), 10)].rowHeight = h;
                const absoluteIndex: number = this.currentStartIndex + i;
                const prev: number | undefined = this.rowHeightCache.get(absoluteIndex);
                if (prev === undefined) {
                    this.dynamicRowCount++;
                } else {
                    this.dynamicHeightSum -= prev;
                }
                this.dynamicHeightSum += h;
                this.rowHeightCache.set(absoluteIndex, h);
            }
        }
    }

    private getAvgRowHeight(): number {
        if (!this.isDynamicHeight()) {
            return this.rowHeight;
        }
        if (this.dynamicRowCount > 0) {
            return Math.ceil(this.dynamicHeightSum / this.dynamicRowCount);
        }
        return this.rowHeight;
    }

    private getDataRowIndexByScrollTop(scrollTop: number): number {
        if (!this.isDynamicHeight() && this.expandedDetailRows.size === 0) {
            if (this.rowHeight <= 0) { return 0; }
            return Math.min(Math.floor(scrollTop / this.rowHeight), Math.max(0, this.totalRecords - 1));
        }
        const avgRowHeight: number = this.getAvgRowHeight();
        if (avgRowHeight <= 0) { return 0; }
        let rowTopOffset: number = 0;
        for (let i: number = 0; i < this.totalRecords; i++) {
            const cachedRowHeight: number | undefined = this.rowHeightCache.get(i);
            const effectiveRowHeight: number = cachedRowHeight !== undefined ? cachedRowHeight : avgRowHeight;
            if (rowTopOffset + effectiveRowHeight > scrollTop) {
                return i;
            }
            rowTopOffset += effectiveRowHeight;
            const detailRowHeight: number | undefined = this.expandedDetailRows.get(i);
            if (detailRowHeight !== undefined) {
                if (rowTopOffset + detailRowHeight > scrollTop) {
                    return i;
                }
                rowTopOffset += detailRowHeight;
            }
        }
        return Math.max(0, this.totalRecords - 1);
    }

    private getStartIndex(scrollTop: number): number {
        const firstVisible: number = this.getDataRowIndexByScrollTop(scrollTop);
        const bufferCount: number = this.getBufferRowCount();
        return Math.max(0, firstVisible - bufferCount);
    }

    private getEndIndex(startIndex: number): number {
        const firstVisible: number = this.getDataRowIndexByScrollTop(this.currentScrollTop);
        const visibleCount: number = this.getVisibleRowCount();
        const bufferCount: number = this.getBufferRowCount();
        let endIndex: number = Math.min(firstVisible + visibleCount + bufferCount, this.totalRecords);
        const maxPool: number = this.parent.domVirtualizationSettings.maxPoolSize;
        if (endIndex - startIndex > maxPool) {
            endIndex = startIndex + maxPool;
        }
        return endIndex;
    }

    private getVisibleRowCount(): number {
        const avgRowHeight: number = this.getAvgRowHeight();
        if (avgRowHeight <= 0) { return 20; }
        const viewportHeight: number = this.content.clientHeight;
        return Math.ceil(viewportHeight / avgRowHeight);
    }

    private getBufferRowCount(): number {
        return this.parent.domVirtualizationSettings.rowBuffer;
    }

    private initializeRowHeight(): void {
        this.rowHeight = this.parent.getRowHeight();
    }

    private setVirtualDimensions(): void {
        let totalExpandedHeight: number = 0;
        this.expandedDetailRows.forEach((height: number) => { totalExpandedHeight += height; });
        let totalHeight: number;
        if (this.isDynamicHeight()) {
            if (this.dynamicRowCount > 0) {
                const estimated: number = Math.ceil(this.dynamicHeightSum / this.dynamicRowCount);
                const unmeasuredCount: number = Math.max(0, this.totalRecords - this.dynamicRowCount);
                totalHeight = this.dynamicHeightSum + unmeasuredCount * estimated + totalExpandedHeight;
            } else {
                totalHeight = this.totalRecords * this.rowHeight + totalExpandedHeight;
            }
        } else {
            totalHeight = this.totalRecords * this.rowHeight + totalExpandedHeight;
        }
        if (this.observer) {
            this.observer.setPageHeight(totalHeight);
        }
        const previousHeight: number = this.storedVirtualHeight;
        if (previousHeight > 0 && totalHeight !== previousHeight && this.currentScrollTop > 0) {
            const scrollRatio: number = this.currentScrollTop / previousHeight;
            const newScrollTop: number = scrollRatio * totalHeight;
            this.storedVirtualHeight = totalHeight;
            this.virtualEle.setVirtualHeight(totalHeight);
            if (this.virtualEle.verticalScrollerContainer) {
                updateCSSText(this.virtualEle.verticalScrollerContainer, `height: ${totalHeight}px;`);
            }
            this.preventScroll = true;
            this.content.scrollTop = newScrollTop;
            this.virtualEle.verticalScrollbar.scrollTop = newScrollTop;
            this.preventScroll = false;
            this.currentScrollTop = newScrollTop;
            this.prevScrollTop = newScrollTop;
        } else {
            this.storedVirtualHeight = totalHeight;
            this.virtualEle.setVirtualHeight(totalHeight);
            if (this.virtualEle.verticalScrollerContainer) {
                updateCSSText(this.virtualEle.verticalScrollerContainer, `height: ${totalHeight}px;`);
            }
        }
        this.adjustVerticalScrollbarOverflow();
    }

    private adjustVerticalScrollbarOverflow(): void {
        if (!this.virtualEle.verticalScrollbar || !this.content) {
            return;
        }
        const hasHorizontalScroll: boolean = this.content.scrollWidth > this.content.clientWidth;
        const overflowX: string = hasHorizontalScroll ? 'scroll' : 'hidden';
        updateCSSText(this.virtualEle.verticalScrollbar, `overflow-x: ${overflowX};`);
    }

    private updateScrollbarOnResize(): void {
        if (this.parent.isRowDomVirtualization() && !isNullOrUndefined(this.virtualEle.verticalScrollbar)
            && !isNullOrUndefined(this.content)) {
            updateCSSText(this.virtualEle.verticalScrollbar, `width: ${getScrollBarWidth(true) + 1}px;`);
            this.adjustVerticalScrollbarOverflow();
        }
    }

    public getRowTopOffset(dataRowIndex: number): number {
        if (dataRowIndex <= 0) { return 0; }
        if (!this.isDynamicHeight() && this.expandedDetailRows.size === 0) {
            return dataRowIndex * this.rowHeight;
        }
        const avgRowHeight: number = this.getAvgRowHeight();
        let pixelOffset: number = 0;
        for (let i: number = 0; i < dataRowIndex; i++) {
            const cachedRowHeight: number | undefined = this.rowHeightCache.get(i);
            pixelOffset += cachedRowHeight !== undefined ? cachedRowHeight : avgRowHeight;
            const detailRowHeight: number | undefined = this.expandedDetailRows.get(i);
            if (detailRowHeight !== undefined) {
                pixelOffset += detailRowHeight;
            }
        }
        return pixelOffset;
    }

    public updateDetailRowHeight(rowIndex: number, isExpand: boolean, detailRowHeight?: number): void {
        const detailHeight: number = detailRowHeight !== undefined ? detailRowHeight : 500;
        if (isExpand) {
            this.expandedDetailRows.set(rowIndex, detailHeight);
        } else {
            this.expandedDetailRows.delete(rowIndex);
        }
        this.initializeRowHeight();
        if (this.parent.isRowDomVirtualization()) {
            this.setVirtualDimensions();
        }
    }

    public clearExpandedDetailRows(): void {
        this.expandedDetailRows.clear();
        this.rowHeightCache.clear();
        this.dynamicHeightSum = 0;
        this.dynamicRowCount = 0;
        this.storedVirtualHeight = 0;
    }

    public removeEventListeners(): void {
        window.removeEventListener('resize', this.updateScrollbarOnResize.bind(this));
        this.observer = null as unknown as InterSectionObserver;
    }

    public destroy(): void {
        this.removeEventListeners();
    }

    private domVirtualCellFocus(e: KeyboardEventArgs): void {
        if (!e || !e.action) { return; }
        if ((e.action === 'enter' || e.action === 'shiftEnter') && this.parent.editSettings &&
            this.parent.editSettings.mode === 'Cell') { return; }
        let element: Element | null = document.activeElement;
        if (element && !element.classList.contains(literals.rowCell) &&
            (element instanceof HTMLInputElement || !isNullOrUndefined(element.closest('.e-templatecell')))) {
            element = element.closest('.e-rowcell');
        }
        if (this.parent.allowGrouping && this.parent.groupSettings && this.parent.groupSettings.columns.length
            && element && (element.classList.contains(literals.rowCell)
                || !isNullOrUndefined(parentsUntil(element, literals.groupCaptionRow)))
            && e && (e.action === 'shiftEnter' || e.action === 'upArrow' || e.action === 'downArrow')) {
            const scrollEleG: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
            const scrollEleInfo: ClientRect = scrollEleG.getBoundingClientRect();
            const row: Element = closest(element, 'tr');
            const nextFocusRow: Element | null = e.action === 'downArrow'
                ? row.nextElementSibling : row.previousElementSibling;
            const nextFocusRowInfo: DOMRect | undefined = nextFocusRow
                ? nextFocusRow.getBoundingClientRect() as DOMRect : undefined;
            if (isNullOrUndefined(nextFocusRow)
                || (e.action === 'downArrow' && !!nextFocusRowInfo && nextFocusRowInfo.bottom > scrollEleInfo.bottom)
                || ((e.action === 'upArrow' || e.action === 'shiftEnter')
                    && !!nextFocusRowInfo && nextFocusRowInfo.top < scrollEleInfo.top)) {
                this.activeKey = e.action;
                if (this.parent.focusModule) {
                    this.parent.focusModule.virtualSelectionInfo = {
                        isPending: isNullOrUndefined(nextFocusRow), direction: e.action, event: e
                    };
                }
                const viewDiff: number = isNullOrUndefined(nextFocusRow) || !nextFocusRowInfo
                    ? (this.parent.getRowHeight ? this.parent.getRowHeight() : 0)
                    : e.action === 'downArrow'
                        ? nextFocusRowInfo.bottom - scrollEleInfo.bottom
                        : scrollEleInfo.top - nextFocusRowInfo.top;
                scrollEleG.scrollTop = e.action === 'downArrow'
                    ? scrollEleG.scrollTop + viewDiff
                    : scrollEleG.scrollTop - viewDiff;
            } else {
                this.activeKey = '';
            }
            return;
        }
        if (element && element.classList.contains(literals.rowCell)
            && e && (e.action === 'upArrow' || e.action === 'downArrow'
                || e.action === 'shiftEnter' || e.action === 'enter')) {
            let rowIndex: number = parseInt(
                (element.parentElement as HTMLElement).getAttribute(literals.ariaRowIndex) as string, 10) - 1;
            const scrollEle: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
            if (e.action === 'downArrow' || e.action === 'enter') {
                rowIndex += 1;
            } else {
                rowIndex -= 1;
            }
            if (rowIndex < 0 || rowIndex >= this.totalRecords) { return; }
            this.rowIndex = rowIndex;
            this.cellIndex = parseInt(element.getAttribute(literals.ariaColIndex) as string, 10) - 1;
            const row: Element = (this.parent.getRowByIndex as Function)(rowIndex);
            const visibleRowCount: number = Math.floor(scrollEle.offsetHeight / this.parent.getRowHeight()) - 1;
            const emptyRow: boolean = isNullOrUndefined(row);
            if (emptyRow
                || (ensureLastRow(row, this.parent) && (e.action === 'downArrow' || e.action === 'enter'))
                || (ensureFirstRow(row, this.parent.getRowHeight() * 2, this.parent)
                    && (e.action === 'upArrow' || e.action === 'shiftEnter'))) {
                this.activeKey = e.action;
                scrollEle.scrollTop = (e.action === 'downArrow' || e.action === 'enter')
                    ? Math.max(0, this.getRowTopOffset(rowIndex - visibleRowCount))
                    : this.getRowTopOffset(rowIndex);
                if (this.virtualEle.verticalScrollbar) {
                    this.virtualEle.verticalScrollbar.scrollTop = scrollEle.scrollTop;
                }
            } else {
                this.activeKey = '';
            }
        }
    }

    private focusCell(): void {
        if (!this.activeKey) { return; }
        const row: Element = (this.parent.getRowByIndex as Function)(this.rowIndex);
        if (!row) { return; }
        const cells: HTMLCollectionOf<Element> = row.getElementsByClassName(literals.rowCell);
        const cell: HTMLElement = cells[parseInt(this.cellIndex.toString(), 10)] as HTMLElement;
        if (cell) {
            cell.focus({ preventScroll: true });
        }
        if (this.parent.selectionSettings && !this.parent.selectionSettings.checkboxOnly) {
            (this.parent.selectRow as Function)(
                parseInt(row.getAttribute(literals.ariaRowIndex) as string, 10) - 1);
        }
        this.activeKey = '';
    }

    private resetVirtualFocus(e: { isCancel: boolean }): void {
        this.isCancel = e.isCancel;
    }

    private onGroupExpandCollapse(): void {
        if (!this.parent || !this.parent.groupSettings || !this.parent.groupSettings.columns.length) { return; }
        if (this.parent.isRowDomVirtualization()) {
            this.setVirtualDimensions();
        }
        this.refreshContentRows({ requestType: 'dom-virtualscroll' });
    }

    private onApplyDomVirtualRowHeight(args: { row: Row<Column> }): void {
        if (!this.hasRowHeightCallback()) { return; }
        const rowHeightCallback: Function = (this.parent as Grid).setRowHeight as Function;
        const customHeight: number = rowHeightCallback(args.row);
        if (customHeight > 0) {
            args.row.rowHeight = customHeight;
            const globalRowIndex: number = args.row.index;
            const prev: number | undefined = this.rowHeightCache.get(globalRowIndex);
            if (prev === undefined) {
                this.dynamicRowCount++;
            } else {
                this.dynamicHeightSum -= prev;
            }
            this.dynamicHeightSum += customHeight;
            this.rowHeightCache.set(globalRowIndex, customHeight);
        }
    }

    private selectVirtualRow(args: { selectedIndex: number, isAvailable: boolean }): void {
        args.isAvailable = args.selectedIndex >= 0 && args.selectedIndex < this.totalRecords;
        if (!args.isAvailable) { return; }

        const selectedRow: Element = (this.parent.getRowByIndex as Function)(args.selectedIndex);
        if (selectedRow) {
            return;
        }
        if (!this.parent.isRowDomVirtualization() || !this.virtualEle.verticalScrollbar) { return; }
        const scrollTop: number = this.getRowTopOffset(args.selectedIndex);
        this.pendingSelectIndex = args.selectedIndex;
        this.virtualEle.verticalScrollbar.scrollTop = scrollTop;
    }

    private scrollAfterEdit(): void {
        if (this.parent.editModule && this.parent.editSettings.allowEditing && this.isNormaledit) {
            if (this.parent.element.querySelector('.e-gridform')) {
                const editForm: Element = this.parent.element.querySelector('.' + literals.editedRow);
                const addForm: Element = this.parent.element.querySelector('.' + literals.addedRow);
                if (editForm || addForm) {
                    const rowData: Object = editForm
                        ? extend({}, this.parent.getCurrentViewRecords()[this.editedRowIndex as number])
                        : extend({}, this.emptyRowData);
                    const keys: string[] = Object.keys(this.virtualData);
                    this.virtualData = keys.length
                        ? this.getVirtualEditedData(this.virtualData)
                        : this.getVirtualEditedData(rowData);
                }
            }
        }
    }

    private restoreEdit(e?: NotifyArgs): void {
        if (this.isNormaledit) {
            if (this.parent.editSettings.allowEditing
                && this.parent.editModule && !isNullOrUndefined(this.editedRowIndex)) {
                const row: HTMLTableRowElement = this.parent.getRowByIndex(this.editedRowIndex) as HTMLTableRowElement;
                const content: Element = this.content;
                const keys: string[] = Object.keys(this.virtualData);
                if (keys.length && row && !content.querySelector('.' + literals.editedRow)
                    && ['sorting', 'filtering', 'grouping', 'refresh', 'searching', 'ungrouping', 'reorder']
                        .indexOf(e ? e.requestType : null) === -1) {
                    const rowTop: number = row.getBoundingClientRect().top
                        - this.parent.element.getBoundingClientRect().top;
                    if (rowTop < this.content.offsetHeight && rowTop > this.parent.getRowHeight()) {
                        this.parent.isEdit = false;
                        this.parent.editModule.startEdit(row);
                    }
                }
                if (row && this.content.querySelector('.' + literals.editedRow) && !keys.length) {
                    const rowData: Object = extend(
                        {}, this.parent.getCurrentViewRecords()[this.editedRowIndex as number]);
                    this.virtualData = this.getVirtualEditedData(rowData);
                }
            }
            this.restoreAdd();
        }
    }

    private restoreAdd(): void {
        const startAdd: boolean = !this.parent.element.querySelector('.' + literals.addedRow);
        if (this.isNormaledit && this.isAdd && startAdd) {
            const isTop: boolean = this.parent.editSettings.newRowPosition === 'Top'
                && this.content.scrollTop < this.parent.getRowHeight();
            const isBottom: boolean = this.parent.editSettings.newRowPosition === 'Bottom'
                && (!this.parent.enableVirtualization
                    ? this.content.scrollTop >= this.getRowTopOffset(Math.max(0, this.totalRecords - 1))
                    : this.parent.pageSettings.currentPage === this.maxPage);
            if (isTop || isBottom) {
                this.parent.isEdit = false;
                this.parent.addRecord();
            }
        }
    }

    private editActionBegin(e: { data: Object, index: number, isScroll: boolean }): void {
        this.editedRowIndex = e.index;
        let editIndex: number = e.index;
        if (this.parent.enableVirtualization) {
            const pageSize: number = Number(this.parent.pageSettings.pageSize);
            const currentPage: number = Number(this.parent.pageSettings.currentPage);
            const pageOffset: number = (currentPage - 1) * pageSize;
            editIndex = e.index - pageOffset;
        }
        const rowData: Object = extend({}, this.parent.getCurrentViewRecords()[parseInt(editIndex.toString(), 10)]);
        const keys: string[] = Object.keys(this.virtualData);
        e.data = keys.length && !this.parent.editSettings.showAddNewRow ? this.virtualData : rowData;
        e.isScroll = false;
    }

    private addActionBegin(args: { startEdit: boolean }): void {
        if (this.isNormaledit) {
            if (!Object.keys(this.emptyRowData).length) {
                this.createEmptyRowdata();
            }
            this.isAdd = true;
            if (!this.parent.frozenRows && this.content.scrollTop > 0
                && this.parent.editSettings.newRowPosition === 'Top') {
                this.isAdd = true;
                args.startEdit = false;
                this.content.scrollTop = 0;
            }
            if (this.parent.editSettings.newRowPosition === 'Bottom' && this.totalRecords > 0) {
                const bottomOffset: number = this.getRowTopOffset(this.totalRecords);
                if (this.content.scrollTop < bottomOffset - this.content.clientHeight) {
                    this.isAdd = true;
                    args.startEdit = false;
                    this.content.scrollTop = bottomOffset;
                }
            }
        }
    }

    private getVirtualEditedData(rowData: Object): Object {
        const editForms: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-gridform'));
        const isFormDestroyed: boolean = this.parent.editModule
            && this.parent.editModule.formObj
            && this.parent.editModule.formObj.isDestroyed;
        if (!isFormDestroyed) {
            for (let i: number = 0; i < editForms.length; i++) {
                rowData = this.parent.editModule.getCurrentEditedData(
                    editForms[parseInt(i.toString(), 10)], rowData);
            }
        }
        return rowData;
    }

    public getVirtualData(data: { virtualData: Object, isAdd: boolean, isCancel: boolean, isScroll: boolean }): void {
        if (this.isNormaledit) {
            const error: Element = this.parent.element.querySelector('.e-griderror:not([style*="display: none"])');
            const keys: string[] = Object.keys(this.virtualData);
            data.isScroll = false;
            if (error) { return; }
            this.virtualData = keys.length ? this.virtualData : data.virtualData;
            this.getVirtualEditedData(this.virtualData);
            data.virtualData = this.virtualData;
            data.isAdd = this.isAdd || this.parent.editSettings.showAddNewRow;
            data.isCancel = this.isCancel;
        }
    }

    public getVirtualRowIndex(index: number): number {
        const startIdx: number = this.getStartIndex(this.currentScrollTop);
        return startIdx + index;
    }

    private editCancel(args: { data: Object }): void {
        const dataIndex: number = getEditedDataIndex(this.parent, args.data);
        if (!isNullOrUndefined(dataIndex)) {
            args.data = this.parent.getCurrentViewRecords()[parseInt(dataIndex.toString(), 10)];
        }
    }

    private editSuccess(args?: { data?: Object }): void {
        if (this.isNormaledit) {
            if (!this.isAdd && args && args.data) {
                this.updateCurrentViewData(args.data);
            }
            this.isAdd = false;
        }
    }

    private updateCurrentViewData(data: Object): void {
        const dataIndex: number = getEditedDataIndex(this.parent, data);
        if (!isNullOrUndefined(dataIndex)) {
            this.parent.getCurrentViewRecords()[parseInt(dataIndex.toString(), 10)] = data;
        }
    }

    private createEmptyRowdata(): void {
        ((<{ columnModel?: Column[] }>this.parent).columnModel || []).forEach((col: Column) => {
            this.emptyRowData[col.field] = undefined;
        });
    }

    private resetIsedit(): void {
        if (this.parent.isRowDomVirtualization() && this.isNormaledit) {
            if ((this.parent.editSettings.allowEditing && Object.keys(this.virtualData).length)
                || (this.parent.editSettings.allowAdding && this.isAdd)) {
                this.parent.isEdit = true;
            }
        }
    }

    private resetScrollPosition(action: string): void {
        if (this.actions.some((value: string) => value === action)) {
            this.content.scrollTop = 0;
        }
    }

    private actionComplete(args: NotifyArgs): void {
        if (!this.parent.isRowDomVirtualization()) { return; }
        const editRequestTypes: string[] = ['delete', 'save', 'cancel'];
        const dataActionRequestTypes: string[] = [
            'sorting', 'filtering', 'grouping', 'refresh', 'searching', 'ungrouping', 'reorder'
        ];
        if (this.isNormaledit
            && (dataActionRequestTypes.some((v: string) => v === args.requestType)
                || editRequestTypes.some((v: string) => v === args.requestType))) {
            this.isCancel = true;
            this.isAdd = false || this.parent.editSettings.showAddNewRow;
            this.editedRowIndex = undefined;
            this.virtualData = {};
            if (this.parent.editModule) {
                this.parent.editModule.editModule.previousData = undefined;
            }
        }
    }

    private actionBegin(args: NotifyArgs): void {
        if (args.cancel && args.requestType === 'beginEdit') {
            this.virtualData = {};
        }
    }
}

type ScrollArg = { direction: string, sentinel: SentinelType, offset: { top: number, left: number }, focusElement: Element };
