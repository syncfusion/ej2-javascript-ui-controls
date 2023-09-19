import { EventHandler, Browser, ScrollEventArgs, select, isNullOrUndefined } from '@syncfusion/ej2-base';
import { debounce, Touch } from '@syncfusion/ej2-base';
import { IDropdownlist } from './interface'; 
import { DropDownList } from '../drop-down-list/'; 
import { Query } from '@syncfusion/ej2-data';
export type ScrollDirection = 'up' | 'down';
type ScrollArg = { direction: string, sentinel: SentinelType, offset: Offsets, focusElement: HTMLElement };
export type SentinelType = {
    check?: (rect: ClientRect, info: SentinelType) => boolean,
    top?: number, entered?: boolean,
    axis?: string;
};

export type SentinelInfo = { up?: SentinelType, down?: SentinelType, right?: SentinelType, left?: SentinelType };

export type Offsets = { top?: number, left?: number };
export interface VirtualInfo {
    currentPageNumber?: number;
    direction?: string;
    sentinelInfo?: SentinelType;
    offsets?: Offsets;
    startIndex?: number;
    endIndex?: number;
}

export class VirtualScroll {
    private parent: IDropdownlist;
    private containerElementRect: ClientRect;
    private element: HTMLElement;
    private options: any;
    private touchModule: Touch;
    private component: string;

    constructor(parent: IDropdownlist) {
        this.parent = parent;
        this.removeEventListener();
        this.addEventListener();
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on('observe', this.observe, this);
        this.parent.on('setGeneratedData', this.setGeneratedData, this);
        this.parent.on('dataProcessAsync', this.dataProcessAsync, this);
        this.parent.on('setCurrentViewDataAsync', this.setCurrentViewDataAsync, this);
        this.parent.on('bindScrollEvent', this.bindScrollEvent, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('observe', this.observe);
        this.parent.off('setGeneratedData', this.setGeneratedData);
        this.parent.off('dataProcessAsync', this.dataProcessAsync);
        this.parent.off('setCurrentViewDataAsync', this.setCurrentViewDataAsync);
        this.parent.off('bindScrollEvent', this.bindScrollEvent);
    }

    private bindScrollEvent(component: object): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.component = (component as any).component;
        this.observe((scrollArgs: ScrollArg) => this.scrollListener(scrollArgs));
    }

    private observe(callback: Function): void {
        this.containerElementRect = this.parent.popupContentElement.getBoundingClientRect();
        EventHandler.add(this.parent.popupContentElement, 'wheel mousedown', this.popupScrollHandler, this);
        this.touchModule = new Touch(this.parent.popupContentElement, {
            scroll: this.popupScrollHandler.bind(this)
        });
        EventHandler.add(this.parent.popupContentElement, 'scroll', this.virtualScrollHandler(callback), this);
    }

    public getModuleName(): string {
        return 'VirtualScroll';
    }

    private popupScrollHandler(e: ScrollEventArgs): void {
        this.parent.isMouseScrollAction = true;
        this.parent.isPreventScrollAction = false;
    }

    private getPageQuery(query: Query, virtualStartIndex: number, virtualEndIndex: number): Query {
        if (virtualEndIndex !== 0 && !this.parent.allowFiltering && this.component !== 'autocomplete') {
            query = query.skip(virtualStartIndex);
        }
        return query;
    }

    private setGeneratedData(qStartIndex: number, recentlyGeneratedData: object[]): void {
        let loopIteration: number = 0;
        let endIndex: number = this.parent.listData.length + this.parent.virtualItemStartIndex;
        for (let i = this.parent.virtualItemStartIndex; i < endIndex; i++) {
            const alreadyAddedData: object | undefined = this.parent.generatedDataObject[i as number];
            if (!alreadyAddedData) {
                if (recentlyGeneratedData !== null && this.parent.listData.slice(loopIteration, loopIteration + 1).length > 0) {
                    const slicedData = this.parent.listData.slice(loopIteration, loopIteration + 1);
                    if (slicedData.length > 0) {
                        // Safely assign slicedData to this.parent.generatedDataObject[i]
                        this.parent.generatedDataObject[i as number] = slicedData;
                    }
                }
            }
            loopIteration++;
        }
    }

    private generateAndExecuteQueryAsync(query: Query, virtualItemStartIndex: number = 0, virtualItemEndIndex: number = 0, isQueryGenerated: boolean = false): void {
        let dataSource = this.parent.dataSource;
        if (!isQueryGenerated) {
            query = this.getPageQuery(query, virtualItemStartIndex, virtualItemEndIndex);
        }
        this.parent.resetList(dataSource, this.parent.fields, query);
    }
    
    public setCurrentViewDataAsync(): void {
        // eslint-disable-next-line
        let currentData: any = [];
        for (let i = this.parent.viewPortInfo.startIndex; i < this.parent.viewPortInfo.endIndex; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const alreadyAddedData: any = this.parent.generatedDataObject[i as number];
            if (alreadyAddedData) {
                currentData.push(alreadyAddedData[0]);
            }
        }
        this.parent.renderItems(currentData, this.parent.fields);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const virtualTrackElement = this.parent.list.getElementsByClassName('e-virtual-ddl')[0] as any;
        if (virtualTrackElement) {
            (virtualTrackElement).style = this.parent.GetVirtualTrackHeight();
        }
        this.parent.UpdateSkeleton();
        this.parent.liCollections = <HTMLElement[] & NodeListOf<Element>>this.parent.list.querySelectorAll('.e-list-item');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const virtualContentElement = this.parent.list.getElementsByClassName('e-virtual-ddl-content')[0] as any;
        if (virtualContentElement) {
            (virtualContentElement).style = this.parent.getTransformValues();
        }
    }

    private generateQueryAndSetQueryIndexAsync(query: Query, isPopupOpen?: boolean): void {
        let isStartIndexInitialised: boolean = false;
        let queryStartIndex: number = 0;
        let queryEndIndex: number = 0;
        let sortedDataStartIndex: number = 0;
        let vEndIndex: number = this.parent && this.parent.viewPortInfo.endIndex !== 0 ? this.parent.viewPortInfo.endIndex : sortedDataStartIndex + this.parent.getItems().length;
        if (!isPopupOpen && vEndIndex !== 0) {
            for (let i = this.parent.viewPortInfo.startIndex; i <= vEndIndex; i++) {
                if (!(i in this.parent.generatedDataObject)) {
                    if (!isStartIndexInitialised) {
                        isStartIndexInitialised = true;
                        queryStartIndex = queryEndIndex = i;
                    } else {
                        queryEndIndex = i === vEndIndex ? i : i + 1;
                    }
                }
            }
        }
        if (isStartIndexInitialised && !((this.parent.totalItemCount == queryStartIndex) && (this.parent.totalItemCount == queryEndIndex))) {
            this.parent.virtualItemStartIndex = queryStartIndex;
            this.parent.virtualItemEndIndex = queryEndIndex;
            this.generateAndExecuteQueryAsync(query, queryStartIndex, queryEndIndex);
        }
        this.setCurrentViewDataAsync();
    }
    private dataProcessAsync(isOpenPopup?: boolean): void {
        this.parent.selectedValueInfo = null;
        this.parent.virtualItemStartIndex = this.parent.viewPortInfo.startIndex;
        this.parent.virtualItemEndIndex = this.parent.viewPortInfo.endIndex;
        this.generateQueryAndSetQueryIndexAsync(new Query(), isOpenPopup);
    }
    private async virtualScrollRefreshAsync(): Promise<void> {
        this.parent.isCustomFilter = (!(this.parent.isTyped || (this.component === 'combobox' && this.parent.allowFiltering && this.parent.queryString != this.parent.typedString) || (!isNullOrUndefined(this.parent.filterInput) && !isNullOrUndefined(this.parent.filterInput.value) && this.parent.filterInput.value !=='') && this.component !== 'combobox') && !(this.component === 'autocomplete' && this.parent.value != null)) || this.parent.isCustomFilter;
        if (this.parent.allowFiltering || this.component === 'autocomplete') {
            if (!isNullOrUndefined(this.parent.typedString) && !(this.component === 'combobox' && !isNullOrUndefined(this.parent.typedString) && this.parent.allowFiltering)) {
                if (this.parent.viewPortInfo.endIndex >= this.parent.dataCount) {
                    this.parent.viewPortInfo.endIndex = this.parent.dataCount;
                }
                if (this.parent.viewPortInfo.startIndex >= this.parent.dataCount) {
                    this.parent.viewPortInfo.startIndex = this.parent.dataCount - this.parent.itemCount;
                }
            }
            else {
                this.parent.getSkeletonCount(true);
            }
        }
        await this.dataProcessAsync();
        if (this.parent.keyboardEvent != null) {
            this.parent.handleVirtualKeyboardActions(this.parent.keyboardEvent, this.parent.pageCount);
        }
        this.parent.isCustomFilter = false;
    }

    public scrollListener(scrollArgs: ScrollArg): void {
        if (!this.parent.isPreventScrollAction) {
            let info: SentinelType = scrollArgs.sentinel;
            let pStartIndex: number = this.parent.previousStartIndex;
            this.parent.viewPortInfo = this.getInfoFromView(scrollArgs.direction, info, scrollArgs.offset, false);
            this.parent.isUpwardScrolling = false;
            if (this.parent.previousStartIndex !== pStartIndex && !this.parent.isKeyBoardAction) {
                this.parent.isScrollActionTriggered = false;
                this.parent.currentPageNumber = this.parent.viewPortInfo.currentPageNumber;
                this.parent.virtualListInfo = { ...this.parent.viewPortInfo };
                this.parent.isPreventKeyAction = true;
                this.parent.isVirtualScrolling = true;
                setTimeout(() => {
                    this.parent.pageCount = this.parent.getPageCount();
                    this.virtualScrollRefreshAsync().then(() => {
                        if (this.parent.popupObj) {
                            this.parent.list = this.parent.popupObj.element.querySelector('.' + 'e-content') || select('.' + 'e-content');
                            this.parent.updateSelectionList();
                            this.parent.liCollections = <HTMLElement[] & NodeListOf<Element>>this.parent.getItems();
                        }
                        this.parent.isKeyBoardAction = false;
                        this.parent.isVirtualScrolling = false;
                        this.parent.isPreventKeyAction = false;
                    });
                }, 5);
            }
            else if (this.parent.isScrollActionTriggered) {
                this.parent.isPreventKeyAction = false;
                this.parent.isScrollActionTriggered = false;
                let virtualListCount: number = this.parent.list.querySelectorAll('.e-virtual-list').length;
                let listElement: HTMLElement = this.parent.list.querySelector('.' + 'e-list-item');
                let translateY: number = scrollArgs.offset.top - (listElement.offsetHeight * virtualListCount);
                (this.parent.list.getElementsByClassName('e-virtual-ddl-content') as HTMLCollectionOf<HTMLElement>)[0].style.transform = "translate(0px," + translateY + "px)"
            }
            this.parent.previousInfo = this.parent.viewPortInfo;
        }
    }

    private getPageCount(popupElement: HTMLElement, returnExactCount: boolean = false): number {
        var list = popupElement && popupElement.querySelector('.e-content');
        if (list) {
            var liHeight = list.classList.contains('e-nodata') ? null : getComputedStyle(list.querySelectorAll('.e-list-item')[0], null).getPropertyValue('height');
            var pageCount = list.getBoundingClientRect().height / parseInt(liHeight, 10)
            return returnExactCount ? pageCount : Math.round(pageCount);
        }
        return 0;
    };

    private getRowHeight(): number {
        return (isNullOrUndefined(this.parent.liCollections) || this.parent.liCollections.length == 0) ? 0 : Math.ceil(this.parent.liCollections[0].getBoundingClientRect().height);
    }
    private getInfoFromView(direction: string, info: SentinelType, e: Offsets, isscrollAction: boolean): VirtualInfo {

        let infoType: VirtualInfo = {
            direction: direction, sentinelInfo: info, offsets: e,
            startIndex: this.parent.previousStartIndex, endIndex: this.parent.previousEndIndex
        };
        let vHeight: string | number = this.parent.popupContentElement.getBoundingClientRect().height;
        //Row Start and End Index calculation
        let rowHeight: number = this.parent.listItemHeight;
        let exactTopIndex: number = e.top / rowHeight;
        let infoViewIndices: number = vHeight / rowHeight;
        let exactEndIndex: number = exactTopIndex + infoViewIndices;
        let pageSizeBy4: number = this.parent.virtualItemCount / 4;
        let totalItemCount: number = this.parent.totalItemCount;
        if (infoType.direction === 'down') {
            let sIndex: number = Math.round(exactEndIndex) - Math.round((pageSizeBy4));

            if (isNullOrUndefined(infoType.startIndex) || (exactEndIndex >
                (infoType.startIndex + Math.round((this.parent.virtualItemCount / 2 + pageSizeBy4)))
                && infoType.endIndex !== totalItemCount)) {
                infoType.startIndex = sIndex >= 0 ? Math.round(sIndex) : 0;
                infoType.startIndex = infoType.startIndex > exactTopIndex ? Math.floor(exactTopIndex) : infoType.startIndex;
                let eIndex: number = infoType.startIndex + this.parent.virtualItemCount;
                infoType.startIndex = eIndex < exactEndIndex ? (Math.ceil(exactEndIndex) - this.parent.virtualItemCount)
                    : infoType.startIndex;
                infoType.endIndex = eIndex < totalItemCount ? eIndex : totalItemCount;
                infoType.startIndex = eIndex >= totalItemCount ? (infoType.endIndex - this.parent.virtualItemCount > 0 ? infoType.endIndex - this.parent.virtualItemCount : 0) : infoType.startIndex;
                infoType.currentPageNumber = Math.ceil(infoType.endIndex / this.parent.virtualItemCount);
            }
        } else if (infoType.direction === 'up') {
            if (infoType.startIndex && infoType.endIndex) {
                let loadAtIndex: number = Math.round(((infoType.startIndex * rowHeight) + (pageSizeBy4 * rowHeight)) / rowHeight);
                if (exactTopIndex < loadAtIndex) {
                    let idxAddedToExactTop: number = (pageSizeBy4) > infoViewIndices ? pageSizeBy4 :
                        (infoViewIndices + infoViewIndices / 4);
                    let eIndex: number = Math.round(exactTopIndex + idxAddedToExactTop);
                    infoType.endIndex = eIndex < totalItemCount ? eIndex : totalItemCount;
                    let sIndex: number = infoType.endIndex - this.parent.virtualItemCount;
                    infoType.startIndex = sIndex > 0 ? sIndex : 0;
                    infoType.endIndex = sIndex < 0 ? this.parent.virtualItemCount : infoType.endIndex;
                    infoType.currentPageNumber = Math.ceil(infoType.startIndex / this.parent.virtualItemCount);
                }
            }
        }
        if (!isscrollAction) {
            this.parent.previousStartIndex = infoType.startIndex;
            this.parent.startIndex = infoType.startIndex;
            this.parent.previousEndIndex = infoType.endIndex;
        }
        else {
            this.parent.scrollPreStartIndex = infoType.startIndex;
        }
        return infoType;
    }
    private sentinelInfo: SentinelInfo = {
        'up': {
            check: (rect: ClientRect, info: SentinelType) => {
                let top: number = rect.top - this.containerElementRect.top;
                info.entered = top >= 0;
                return top + (this.parent.listItemHeight * this.parent.virtualItemCount / 2) >= 0;
            },
            axis: 'Y'
        },
        'down': {
            check: (rect: ClientRect, info: SentinelType) => {
                let cHeight: number = this.parent.popupContentElement.clientHeight;
                let top: number = rect.bottom;
                info.entered = rect.bottom <= this.containerElementRect.bottom;
                return top - (this.parent.listItemHeight * this.parent.virtualItemCount / 2) <= this.parent.listItemHeight * this.parent.virtualItemCount / 2;
            }, axis: 'Y'
        }
    };

    private virtualScrollHandler(callback?: Function): Function {
        let delay: number = Browser.info.name === 'chrome' ? 200 : 100;
        let prevTop: number = 0; let debounced100: Function = debounce(callback, delay);
        let debounced50: Function = debounce(callback, 50);
        return (e: Event) => {
            let top: number = (<HTMLElement>e.target).scrollTop;
            let left: number = (<HTMLElement>e.target).scrollLeft;
            let direction: ScrollDirection = prevTop < top && !this.parent.isUpwardScrolling ? 'down' : 'up';
            prevTop = top;
            let current: SentinelType = this.sentinelInfo[direction as 'up' | 'down'];
            var pstartIndex = this.parent.scrollPreStartIndex;
            var scrollOffsetargs = {
                top: top,
                left: left
            }
            if (this.parent.list.querySelectorAll('.e-virtual-list').length > 0) {
                var infoview = this.getInfoFromView(direction, current, scrollOffsetargs, true)
                if (this.parent.scrollPreStartIndex != pstartIndex && !this.parent.isPreventScrollAction) {
                    this.parent.isScrollActionTriggered = true;
                    let virtualPoup: HTMLElement = (this.parent.list.querySelector('.e-virtual-ddl-content'));
                    virtualPoup.style.transform = "translate(0px," + top + "px)";
                }
            }
            let debounceFunction: Function = debounced100;
            if (current.axis === 'X') { debounceFunction = debounced50; }
            debounceFunction({ direction: direction, sentinel: current, offset: { top: top, left: left },
                focusElement: document.activeElement});
        };
    }
}
