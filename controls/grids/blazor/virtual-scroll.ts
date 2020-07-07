import { formatUnit, Browser, isNullOrUndefined, EventHandler, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { VirtualInfo, InterSection, Column } from './interfaces';
import { InterSectionObserver } from './intersection-observer';
import { isGroupAdaptive, getScrollBarWidth } from './util';
import { SfGrid } from './sf-grid-fn';

/**
 * VirtualContentRenderer
 * @hidden
 */
export class VirtualContentRenderer {
    private parent: SfGrid;
    private count: number;
    private maxPage: number;
    private maxBlock: number;
    private prevHeight: number = 0;
    private observer: InterSectionObserver;
    private preStartIndex: number = 0;
    private preEndIndex: number;  
    private preventEvent: boolean = false;
    private actions: string[] = ['filtering', 'searching', 'grouping', 'ungrouping','Filtering', 'Searching', 'Grouping', 'Ungrouping'];
    private content: HTMLElement;
    private offsets: { [x: number]: number } = {};
    private tmpOffsets: { [x: number]: number } = {};
    private offsetKeys: string[] = [];
    private prevInfo: VirtualInfo;
    private currentInfo: VirtualInfo = {};
    private contentPanel: Element;
    private blazorActiveKey: string = '';
    private nextRowToNavigate: number = 0;
    private isScrollFromFocus: boolean;

    /** @hidden */
    public virtualEle: VirtualElementHandler = new VirtualElementHandler();
    /** @hidden */
    public activeKey: string;
    /** @hidden */
    public rowIndex: number;
    /** @hidden */
    public requestType: string;
    /** @hidden */
    public startColIndex: number;
    /** @hidden */
    public endColIndex: number;  
    /** @hidden */
    public vHelper: VirtualHelper;
    /** @hidden */
    public header: VirtualHeaderRenderer;
    /** @hidden */
    public startIndex: number = 0;

    constructor(parent: SfGrid) {
        this.parent = parent;
        this.contentPanel = this.parent.element.querySelector(".e-gridcontent");
        this.vHelper = new VirtualHelper(parent);
        this.addEventListener();
    }

    /**
     * Get the header content div element of grid 
     * @return {Element} 
     */
    public getPanel(): Element {
        return this.contentPanel;
    }

    /**
     * Get the header table element of grid
     * @return {Element} 
     */
    public getTable(): Element {
        return this.contentPanel.querySelector('.e-table');
    }

    public renderTable(): void {
        this.header = this.parent.virtualHeaderModule;
        this.virtualEle.table = <HTMLElement>this.getTable();
        this.virtualEle.content = this.content = <HTMLElement>this.getPanel().querySelector('.e-content');
        this.virtualEle.renderWrapper(Number(this.parent.options.height));
        this.virtualEle.renderPlaceHolder();
        let content: HTMLElement = this.content;
        let opt: InterSection = {
            container: content, pageHeight: this.getBlockHeight() * 2, debounceEvent: true,
            axes: this.parent.options.enableColumnVirtualization ? ['X', 'Y'] : ['Y']
        };
        this.observer = new InterSectionObserver(this.virtualEle.wrapper, opt);
        this.parent.dotNetRef.invokeMethodAsync("SetRowHeight", this.parent.getRowHeight());
    }

	private addEventListener(): void {
		EventHandler.add(this.parent.element, 'keydown', this.keyDownHandler, this);
    }
    
	public removeEventListener(): void {
		EventHandler.remove(this.parent.element, 'keydown', this.keyDownHandler);
	}

    public ensurePageSize(): void {
        let rowHeight: number = this.parent.getRowHeight();
        let vHeight: string | number = this.parent.options.height.toString().indexOf('%') < 0 ? this.parent.options.height :
        this.parent.element.getBoundingClientRect().height;
        let blockSize: number = ~~(<number>vHeight / rowHeight);
        let height: number =  blockSize * 2;
        let size: number = this.parent.options.pageSize;
        let actualPageSize : number= size < height ? height : size;
        this.parent.dotNetRef.invokeMethodAsync("SetPageSizeAndCIndex", {
            pageSize: actualPageSize,
            startColumnIndex: this.startColIndex,
            endColumnIndex: this.endColIndex,
            VTableWidth: this.getColumnOffset(this.endColIndex) - this.getColumnOffset(this.startColIndex - 1) + ''
        });
        this.parent.options.pageSize = actualPageSize;
        this.observer.options.pageHeight = this.getBlockHeight() * 2
    }

    private scrollListener(scrollArgs: ScrollArg): void {
        if (this.parent.options.enablePersistence) {
            this.parent.scrollPosition = scrollArgs.offset;
        }
        if (this.preventEvent) { this.preventEvent = false; return; }
        // if (this.preventEvent || this.parent.isDestroyed) { this.preventEvent = false; return; }
        let info: SentinelType = scrollArgs.sentinel;
        let pStartIndex: number = this.preStartIndex;
        let previousColIndexes: number[] = this.parent.getColumnIndexesInView();
        let viewInfo: VirtualInfo = this.currentInfo = this.getInfoFromView(scrollArgs.direction, info, scrollArgs.offset);
        if (this.parent.options.enableColumnVirtualization &&
        (JSON.stringify(previousColIndexes) !== JSON.stringify(viewInfo.columnIndexes))) {
            let translateX: number = this.getColumnOffset(this.startColIndex - 1);
            let width: string = this.getColumnOffset(this.endColIndex) - translateX + '';
            this.parent.dotNetRef.invokeMethodAsync("VirtualRefresh", {
                requestType: 'virtualscroll', 
                startColumnIndex: viewInfo.columnIndexes[0],
                endColumnIndex: viewInfo.columnIndexes[viewInfo.columnIndexes.length - 1],
                axis: 'X',
                VTablewidth: width,
                translateX: this.getColumnOffset(viewInfo.columnIndexes[0] - 1)
            });
            this.setColVTableWidthAndTranslate();
        }
        this.parent.setColumnIndexesInView(this.parent.options.enableColumnVirtualization ? viewInfo.columnIndexes : []);
        this.nextRowToNavigate = this.blazorActiveKey != '' ? this.nextRowToNavigate : 0;
        if (this.preStartIndex !== pStartIndex) {
            this.parent.options.currentPage = viewInfo.currentPage;
            this.parent.dotNetRef.invokeMethodAsync("VirtualRefresh", {
                requestType: 'virtualscroll',
                nextRowToNavigate: this.nextRowToNavigate,
                virtualStartIndex: viewInfo.startIndex,
                virtualEndIndex: viewInfo.endIndex,
                axis: 'Y',
                RHeight: this.parent.getRowHeight()
            });
        }
        this.prevInfo = viewInfo;
        this.blazorActiveKey = '';
    }

    public setColVTableWidthAndTranslate(args?: {refresh: boolean}): void {
        if (this.parent.options.enableColumnVirtualization && this.prevInfo &&
            (JSON.stringify(this.currentInfo.columnIndexes) !==
            JSON.stringify(this.prevInfo.columnIndexes)) || ((args && args.refresh))) {
            let translateX: number = this.getColumnOffset(this.startColIndex - 1);
            let width: string =  this.getColumnOffset(this.endColIndex) - translateX + '';
            this.header.virtualEle.setWrapperWidth(width);
            this.virtualEle.setWrapperWidth(width);
            this.header.virtualEle.adjustTable(translateX, 0);
            this.parent.getContentTable().parentElement.style.width = width + 'px';
        }
    }

	public refreshOnDataChange(): void {
        this.getPanel().firstElementChild.scrollTop = 0;
        this.getPanel().firstElementChild.scrollLeft = 0;
        if (this.parent.options.enableColumnVirtualization) {
            this.header.virtualEle.adjustTable(0, 0);
        }
        this.virtualEle.adjustTable(0,0);
        this.refreshOffsets();
        this.refreshVirtualElement();
   }

    // private block(blk: number): boolean {
    //     return this.vHelper.isBlockAvailable(blk);
    // }

	private keyDownHandler(e: KeyboardEventArgs): void {
		this.blazorActiveKey = (e.key === 'ArrowDown' || e.key === 'ArrowUp') ? e.key : '';
    }
    
    public focusCell(cell: HTMLElement, action: string): void {
        (cell as any).focus({preventScroll: true});
        let rowHeight: number = this.parent.getRowHeight();
        let content: HTMLElement = this.parent.getContent();
        if (action == "MoveDownCell" && cell.getBoundingClientRect().bottom > content.getBoundingClientRect().top +
            content.getBoundingClientRect().height - getScrollBarWidth()) {
            content.scrollTop = content.scrollTop + rowHeight;
        } else if (action == "MoveUpCell" && 
            cell.getBoundingClientRect().bottom < content.getBoundingClientRect().top + rowHeight) {
            this.isScrollFromFocus = true;
            content.scrollTop = content.scrollTop - rowHeight;
        }
    }

    private getInfoFromView(direction: string, info: SentinelType, e: Offsets): VirtualInfo {
        let isBlockAdded: boolean = false;
        // let tempBlocks: number[] = [];
        let infoType: VirtualInfo = { direction: direction, sentinelInfo: info, offsets: e,
            startIndex: this.preStartIndex, endIndex: this.preEndIndex };
        let vHeight: string | number = this.parent.options.height.toString().indexOf('%') < 0 ? this.content.getBoundingClientRect().height :
            this.parent.element.getBoundingClientRect().height;
        infoType.page = this.getPageFromTop(e.top + vHeight, infoType);
        infoType.blockIndexes = this.vHelper.getBlockIndexes(infoType.page);
        // infoType.blockIndexes = tempBlocks = this.vHelper.getBlockIndexes(infoType.page);
        // infoType.loadSelf = !this.vHelper.isBlockAvailable(tempBlocks[infoType.block]);
        // let blocks: number[] = this.ensureBlocks(infoType);
        // if (this.activeKey === 'upArrow' && infoType.blockIndexes.toString() !== blocks.toString()) {
        //     // To avoid dupilcate row index problem in key focus support
        //     let newBlock: number = blocks[blocks.length - 1];
        //     if (infoType.blockIndexes.indexOf(newBlock) === -1) {
        //         isBlockAdded = true;
        //     }
        // }
        // infoType.blockIndexes = blocks;
        // infoType.loadNext = !blocks.filter((val: number) => tempBlocks.indexOf(val) === -1)
        //     .every(this.block.bind(this));
        // infoType.event = (infoType.loadNext || infoType.loadSelf) ? 'modelChanged' : 'refreshVirtualBlock';
        // if (isBlockAdded) {
        //     infoType.blockIndexes = [infoType.blockIndexes[0] - 1, infoType.blockIndexes[0], infoType.blockIndexes[0] + 1];
        // }
        infoType.columnIndexes = info.axis === 'X' ? this.vHelper.getColumnIndexes() : this.parent.getColumnIndexesInView();

        //Row Start and End Index calculation
        let rowHeight: number = this.parent.getRowHeight();
        let exactTopIndex: number = e.top / rowHeight;
        let noOfInViewIndexes: number = vHeight / rowHeight;
        let exactEndIndex: number = exactTopIndex + noOfInViewIndexes;
        let pageSizeBy4: number = this.parent.options.pageSize / 4;
        let totalCount: number = this.parent.options.groupCount ? this.getVisibleGroupedRowCount() : this.count;
        if (infoType.direction === 'down' && !this.isScrollFromFocus) {
            let sIndex: number = Math.round(exactEndIndex) - Math.round((pageSizeBy4));
            if (isNullOrUndefined(infoType.startIndex) || (exactEndIndex >
            (infoType.startIndex + Math.round((this.parent.options.pageSize / 2 + pageSizeBy4)))
            && infoType.endIndex !== totalCount)) {
                infoType.startIndex = sIndex >= 0 ? Math.round(sIndex) : 0;
                infoType.startIndex = infoType.startIndex > exactTopIndex ? Math.floor(exactTopIndex) : infoType.startIndex;
                let eIndex: number = infoType.startIndex + this.parent.options.pageSize;
                infoType.startIndex = eIndex < exactEndIndex ? (Math.ceil(exactEndIndex) - this.parent.options.pageSize)
                : infoType.startIndex;
                infoType.endIndex =  eIndex < totalCount ? eIndex : totalCount;
                infoType.startIndex = eIndex >= totalCount ?
                infoType.endIndex - this.parent.options.pageSize : infoType.startIndex;
                infoType.currentPage = Math.ceil(infoType.endIndex / this.parent.options.pageSize);
                this.nextRowToNavigate = Math.floor(exactEndIndex - 1);
            }
        } else if (infoType.direction === 'up') {
            if (infoType.startIndex && infoType.endIndex) {
                let loadAtIndex: number = Math.round(((infoType.startIndex * rowHeight) + (pageSizeBy4 * rowHeight)) / rowHeight);
                if (exactTopIndex < loadAtIndex) {
                    let idxAddedToExactTop: number = (pageSizeBy4) > noOfInViewIndexes ? pageSizeBy4 :
                    (noOfInViewIndexes + noOfInViewIndexes / 4);
                    let eIndex: number = Math.round(exactTopIndex + idxAddedToExactTop);
                    infoType.endIndex = eIndex < totalCount ? eIndex : totalCount;
                    let sIndex: number = infoType.endIndex - this.parent.options.pageSize;
                    infoType.startIndex = sIndex > 0 ? sIndex : 0;
                    infoType.endIndex = sIndex < 0 ? this.parent.options.pageSize : infoType.endIndex;
                    infoType.currentPage = Math.ceil(infoType.startIndex / this.parent.options.pageSize);
                    this.nextRowToNavigate = Math.ceil(exactTopIndex + 1);
                }
            }
        }
        this.isScrollFromFocus = false;
        this.preStartIndex = this.startIndex = infoType.startIndex;
        this.preEndIndex = infoType.endIndex;

        return infoType;
    }

    public onDataReady(): void {
        this.bindScrollEvent();
        this.count =  this.parent.options.totalItemCount;
        this.maxPage = Math.ceil(this.count / this.parent.options.pageSize);
        // this.vHelper.checkAndResetCache(this.parent.options.requestType);
        if (['Refresh', 'Filtering', 'Searching', 'Grouping', 'Ungrouping', 'Reorder',
            'refresh', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder', null]
            .some((value: string) => { return this.parent.options.requestType === value; })) {
            this.refreshOffsets();
        }
        this.setVirtualHeight();
        this.resetScrollPosition(this.parent.options.requestType);
        this.setColVTableWidthAndTranslate();
        this.prevInfo = this.prevInfo ? this.prevInfo : this.vHelper.getData();
    }

    /** @hidden */
    public setVirtualHeight(): void {
        let width: string = this.parent.options.enableColumnVirtualization ?
        this.getColumnOffset(this.parent.options.columns.length + this.parent.options.groupCount - 1) + 'px' : '100%';
        let virtualHeight: number = this.parent.options.groupCount
            ? (this.parent.options.visibleGroupedRowsCount * this.parent.getRowHeight()) : this.offsets[this.getTotalBlocks()];
        this.virtualEle.setVirtualHeight(virtualHeight, width);
        if (this.parent.options.enableColumnVirtualization) {
            this.header.virtualEle.setVirtualHeight(1, width);
        }
    }

    private getPageFromTop(sTop: number, info: VirtualInfo): number {
        let total: number = (isGroupAdaptive(this.parent)) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        let page: number = 0; let extra: number = this.offsets[total] - this.prevHeight;
        this.offsetKeys.some((offset: string) => {
            let iOffset: number = Number(offset);
            let border: boolean = sTop <= this.offsets[offset] || (iOffset === total && sTop > this.offsets[offset]);
            if (border) {
                info.block = iOffset % 2 === 0 ? 1 : 0;
                page = Math.max(1, Math.min(this.vHelper.getPage(iOffset), this.maxPage));
            }
            return border;
        });
        return page;
    }

    protected getTranslateY(sTop: number, cHeight: number, info?: VirtualInfo, isOnenter?: boolean): number {
        if (info === undefined) {
            info = { page: this.getPageFromTop(sTop + cHeight, {}) };
            info.blockIndexes = this.vHelper.getBlockIndexes(info.page);
        }
        let block: number = (info.blockIndexes[0] || 1) - 1;
        let translate: number = this.getOffset(block);
        let endTranslate: number = this.getOffset(info.blockIndexes[info.blockIndexes.length - 1]);
        if (isOnenter) {
            info = this.prevInfo;
        }
        let result: number = translate > sTop ?
            this.getOffset(block - 1) : endTranslate < (sTop + cHeight) ? this.getOffset(block + 1) : translate;
        let blockHeight: number = this.offsets[info.blockIndexes[info.blockIndexes.length - 1]] -
            this.tmpOffsets[info.blockIndexes[0]];
        if (result + blockHeight > this.offsets[isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks()] && this.parent.options.groupCount == 0) {
            result -= (result + blockHeight) - this.offsets[this.getTotalBlocks()];
        }
        return result;
    }

    public getOffset(block: number): number {
        return Math.min(this.offsets[block] | 0, this.offsets[this.maxBlock] | 0);
    }

    private onEntered(): Function {
        return (element: HTMLElement, current: SentinelType, direction: string, e: Offsets, isWheel: boolean, check: boolean) => {
            if (Browser.isIE && !isWheel && check && !this.preventEvent) {
                //ToDo
                //this.parent.showSpinner();
            }
            let xAxis: boolean = current.axis === 'X'; let top: number = this.prevInfo.offsets ? this.prevInfo.offsets.top : null;
            let height: number = this.content.getBoundingClientRect().height;
            let x: number = this.getColumnOffset(xAxis ? this.vHelper.getColumnIndexes()[0] - 1 : this.prevInfo.columnIndexes[0] - 1);
            let y: number = this.getTranslateY(e.top, height, xAxis && top === e.top ? this.prevInfo : undefined, true);
            if (this.currentInfo && this.currentInfo.startIndex && xAxis) {
                y = this.currentInfo.startIndex * this.parent.getRowHeight();
            }
            this.virtualEle.adjustTable(x, Math.min(y, this.offsets[this.maxBlock]));
            if (xAxis) {
                this.setColVTableWidthAndTranslate({refresh: true});
            }
        };
    }


    public bindScrollEvent: Function = () => {
        this.observer.observe((scrollArgs: ScrollArg) => this.scrollListener(scrollArgs), this.onEntered());
        let gObj: SfGrid = this.parent;
        if (gObj.options.enablePersistence && gObj.scrollPosition) {
            this.content.scrollTop = gObj.scrollPosition.top;
            let scrollValues: ScrollArg = { direction: 'down', sentinel: this.observer.sentinelInfo.down,
                offset: gObj.scrollPosition, focusElement: gObj.element };
            this.scrollListener(scrollValues);
            if (gObj.options.enableColumnVirtualization) {
                this.content.scrollLeft = gObj.scrollPosition.left;
            }
        }
    };


    public getBlockSize(): number {
        return this.parent.options.pageSize >> 1;
    }

    public getBlockHeight(): number {
        return this.getBlockSize() * this.parent.getRowHeight();
    }

    public getGroupedTotalBlocks(): number {
        let visibleRowCount = this.getVisibleGroupedRowCount();
        return Math.floor((visibleRowCount / this.getBlockSize()) < 1 ? 1 : visibleRowCount / this.getBlockSize());
    }

    public getVisibleGroupedRowCount(): number {
        let visibleRowCount: number = Number(this.virtualEle.placeholder.style.height.substring(0,
            this.virtualEle.placeholder.style.height.indexOf('p')))/this.parent.getRowHeight();
            return visibleRowCount;
    }

    public getTotalBlocks(): number {
        return Math.ceil(this.count / this.getBlockSize());
    }

    public getColumnOffset(block: number): number {
        return this.vHelper.cOffsets[block] | 0;
    }

    private resetScrollPosition(action: string): void {
        if (this.actions.some((value: string) => value === action)) {
            let content: Element = this.content;
            this.preventEvent = content.scrollTop !== 0;
            content.scrollTop = 0;
        }
    }

    /** @hidden */
    public refreshOffsets(): void {
        let gObj: SfGrid = this.parent;
        let row: number = 0; let bSize: number = this.getBlockSize();
        let total: number = isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        this.prevHeight = this.offsets[total]; this.maxBlock = total % 2 === 0 ? total - 2 : total - 1; this.offsets = {};
        let vcRows : any = [];
        let cache: any = {};
        //Row offset update
        let blocks: number[] = Array.apply(null, Array(total)).map(() => ++row);
        for (let i: number = 0; i < blocks.length; i++) {
            let tmp: number = (cache[blocks[i]] || []).length;
            let rem: number = !isGroupAdaptive(this.parent) ? this.count % bSize : (vcRows.length % bSize);
            let size: number = !isGroupAdaptive(this.parent) && blocks[i] in cache ?
                tmp * this.parent.getRowHeight() : rem && blocks[i] === total ? rem * this.parent.getRowHeight() :
                this.getBlockHeight();
                // let size: number = this.parent.groupSettings.columns.length && block in this.vHelper.cache ?
                // tmp * getRowHeight() : this.getBlockHeight();
            this.offsets[blocks[i]] = (this.offsets[blocks[i] - 1] | 0) + size;
            this.tmpOffsets[blocks[i]] = this.offsets[blocks[i] - 1] | 0;
        }
        this.offsetKeys = Object.keys(this.offsets);
        //Column offset update
        if (this.parent.options.enableColumnVirtualization) {
            this.vHelper.refreshColOffsets();
        }
    }

    public refreshColumnIndexes(): void {
        this.vHelper.refreshColOffsets();
        let colIndexes: number[] = this.vHelper.getColumnIndexes();
        this.parent.setColumnIndexesInView(colIndexes);
        this.parent.dotNetRef.invokeMethodAsync("SetColumnIndexes", colIndexes[0], colIndexes[colIndexes.length - 1]);
    }

    public refreshVirtualElement(): void {
        this.vHelper.refreshColOffsets();
        this.setVirtualHeight();
    }

}
/**
 * @hidden
 */
export class VirtualHeaderRenderer {
    public virtualEle: VirtualElementHandler = new VirtualElementHandler();
    private vHelper: VirtualHelper;
    private parent: SfGrid;
    private headerPanel: Element;

    constructor(parent: SfGrid) {
        this.parent = parent;
        this.vHelper = new VirtualHelper(this.parent);
        this.headerPanel = this.parent.element.querySelector(".e-gridheader");
    }

    /**
     * Get the header content div element of grid 
     * @return {Element} 
     */
    public getPanel(): Element {
        return this.headerPanel;
    }

    /**
     * Get the header table element of grid
     * @return {Element} 
     */
    public getTable(): Element {
        return this.headerPanel.querySelector('.e-table');
    }

    public renderTable(): void {
        this.vHelper.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.vHelper.getColumnIndexes(<HTMLElement>this.getPanel().querySelector('.e-headercontent')));
        this.virtualEle.table = <HTMLElement>this.getTable();
        this.virtualEle.content = <HTMLElement>this.getPanel().querySelector('.e-headercontent');
        this.virtualEle.content.style.position = 'relative';
        this.virtualEle.renderWrapper();
        this.virtualEle.renderPlaceHolder();
    }

}
/**
 * @hidden
 */
    export class VirtualElementHandler {
        public wrapper: HTMLElement;
        public placeholder: HTMLElement;
        public content: HTMLElement;
        public table: HTMLElement;

        public renderWrapper(height?: number): void {
            this.wrapper = this.content.querySelector('.e-virtualtable');
            this.wrapper.setAttribute('styles', `min-height:${formatUnit(height)}`);
        }

        public renderPlaceHolder(): void {
            this.placeholder = this.content.querySelector('.e-virtualtrack');
        }

        public adjustTable(xValue: number, yValue: number): void {
            this.wrapper.style.transform = `translate(${xValue}px, ${yValue}px)`;
        }

        public setWrapperWidth(width: string, full?: boolean): void {
            this.wrapper.style.width = width ? `${width}px` : full ? '100%' : '';
        }

        public setVirtualHeight(height?: number, width?: string): void {
            this.placeholder.style.height = `${height}px`;
            this.placeholder.style.width = width;
        }

    }

/**
 * Content module is used to render grid content
 */
export class VirtualHelper {
    public parent: SfGrid;
    public cOffsets: { [x: number]: number } = {};
    public data: { [x: number]: Object[] } = {};
    public groups: { [x: number]: Object } = {};

    constructor(parent: SfGrid) {
        this.parent = parent;
    }

    public getBlockIndexes(page: number): number[] {
        return [page + (page - 1), page * 2];
    }

    public getPage(block: number): number {
        return block % 2 === 0 ? block / 2 : (block + 1) / 2;
    }

    // public isBlockAvailable(value: number): boolean {
    //     // return value in this.cache;
    // }

    public getData(): VirtualInfo {
        return {
            page: this.parent.options.currentPage,
            blockIndexes: this.getBlockIndexes(this.parent.options.currentPage),
            direction: 'down',
            columnIndexes: this.parent.getColumnIndexesInView()
        };
    }

    // private getStartIndex(blk: number, data: Object[], full: boolean = true): number {
    //     let page: number = this.getPage(blk); let even: boolean = blk % 2 === 0;
    //     let index: number = (page - 1) * this.model.pageSize;
    //     return full || !even ? index : index + ~~(this.model.pageSize / 2);
    // }

    public getColumnIndexes(content: HTMLElement =
        (<HTMLElement>this.parent.getHeaderContent())): number[] {
        let indexes: number[] = []; let sLeft: number = content.scrollLeft | 0;
        let keys: string[] = Object.keys(this.cOffsets);
        let cWidth: number = this.parent.options.needClientAction ? content.getBoundingClientRect().width :
                        Number(this.parent.options.width);
        sLeft = Math.min(this.cOffsets[keys.length - 1] - cWidth, sLeft); let calWidth: number = Browser.isDevice ? 2 * cWidth : cWidth / 2;
        let left: number = sLeft + cWidth + (sLeft === 0 ? calWidth : 0);
        keys.some((offset: string, indx: number, input: string[]) => {
            let iOffset: number = Number(offset); let offsetVal: number = this.cOffsets[offset];
            let border: boolean = sLeft - calWidth <= offsetVal && left + calWidth >= offsetVal;
            if (border) {
                indexes.push(iOffset);
            }
            return left + calWidth < offsetVal;
        });
        this.parent.virtualContentModule.startColIndex = indexes[0];
        this.parent.virtualContentModule.endColIndex = indexes[indexes.length - 1];
        return indexes;
    }

    // public checkAndResetCache(action: string): boolean {
    //     let clear: boolean = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder',
    //                         'save', 'delete'].some((value: string) => action === value);
    //     if (clear) {
    //         this.cache = {}; this.data = {}; this.groups = {};
    //     }
    //     return clear;
    // }

    public refreshColOffsets(): void {
        let col: number = 0; this.cOffsets = {}; let gLen: number = this.parent.options.groupCount;
        let cols: Column[] = (<Column[]>this.parent.options.columns);
        let cLen: number = cols.length;
        // let isVisible: Function = (column: Column) => column.visible &&
        //     (!this.parent.options.showGroupedColumn ? this.parent.options.groupedColumns.indexOf(column.field) < 0 : column.visible);
        // let c: string[] = this.parent.options.groupedColumns || [];
        // for (let i: number = 0; i < c.length; i++) {
        //     this.cOffsets[i] = (this.cOffsets[i - 1] | 0) + 30;
        // }
        let blocks: number[] = Array.apply(null, Array(cLen)).map(() => col++);
        for (let j: number = 0; j < blocks.length; j++) {
            blocks[j] = blocks[j] + gLen;
            this.cOffsets[blocks[j]] = (this.cOffsets[blocks[j] - 1] | 0) + (cols[j].visible ? parseInt(<string>cols[j].width, 10) : 0);
        }
    }

}


type ScrollArg = { direction: string, sentinel: SentinelType, offset: Offsets, focusElement: HTMLElement };


export type SentinelType = {
    check?: (rect: ClientRect, info: SentinelType) => boolean,
    top?: number, entered?: boolean,
    axis?: string;
};

export type SentinelInfo = { up?: SentinelType, down?: SentinelType, right?: SentinelType, left?: SentinelType };

export type Offsets = { top?: number, left?: number };