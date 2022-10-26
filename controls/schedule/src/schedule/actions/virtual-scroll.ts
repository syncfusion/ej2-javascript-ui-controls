import { append, addClass, remove, isNullOrUndefined, setStyleAttribute, createElement, prepend } from '@syncfusion/ej2-base';
import { TdData } from '../base/interface';
import { Schedule } from '../base/schedule';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * Virtual Scroll
 */
export class VirtualScroll {
    private parent: Schedule;
    private translateY: number = 0;
    private itemSize: number = 60;
    public bufferCount: number = 3;
    private renderedLength: number = 0;
    private averageRowHeight: number = 0;
    private timeValue: number;
    private focusedEle: Element;
    private isResourceCell: boolean;
    public isHorizontalScroll: boolean;
    private startIndex: number = 0;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.parent.on(events.virtualScroll, this.virtualScrolling, this);
    }

    private removeEventListener(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.parent.off(events.virtualScroll, this.virtualScrolling);
    }

    public getRenderedCount(): number {
        this.setItemSize();
        const containerSize: number = this.isHorizontalScroll ? this.parent.element.clientWidth : this.parent.element.clientHeight;
        this.renderedLength = Math.ceil(containerSize / this.itemSize) + this.bufferCount;
        return this.renderedLength;
    }

    public renderVirtualTrack(contentWrap: Element): void {
        const wrap: HTMLElement = createElement('div', { className: cls.VIRTUAL_TRACK_CLASS }) as HTMLElement;
        if (this.isHorizontalScroll) {
            const colCount: number = this.parent.activeView.colLevels[this.parent.activeView.colLevels.length - 1].length;
            wrap.style.width = (colCount * this.itemSize) + 'px';
        } else {
            wrap.style.height = (this.parent.resourceBase.expandedResources.length * this.itemSize) + 'px';
        }
        contentWrap.appendChild(wrap);
    }

    public updateVirtualScrollHeight(): void {
        const virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
        const lastResourceIndex: number =
            this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
        const lastRenderIndex: number =
            this.parent.resourceBase.renderedResources[this.parent.resourceBase.renderedResources.length - 1].groupIndex;
        if (lastRenderIndex !== lastResourceIndex) {
            const conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
            this.renderedLength = conTable.querySelector('tbody').children.length;
            virtual.style.height = (conTable.offsetHeight + (this.parent.resourceBase.expandedResources.length - (this.renderedLength)) *
                conTable.offsetHeight / this.renderedLength) + 'px';
        } else {
            virtual.style.height = '';
        }
        this.averageRowHeight = virtual.offsetHeight / this.parent.resourceBase.expandedResources.length;
    }

    public updateVirtualTrackHeight(wrap: HTMLElement): void {
        const resourceCount: number = this.parent.resourceBase.renderedResources.length;
        if (resourceCount !== this.getRenderedCount()) {
            wrap.style.height = (this.parent.element.querySelector('.e-content-wrap') as HTMLElement).clientHeight + 'px';
            const resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
            const conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
            const eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS) as HTMLElement;
            this.translateY = 0;
            this.setTranslate(resWrap, conWrap, eventWrap);
        } else {
            const lastRenderIndex: number = this.parent.resourceBase.renderedResources[resourceCount - 1].groupIndex;
            const lastCollIndex: number =
                this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
            let renderedResCount: number = resourceCount + (lastCollIndex - lastRenderIndex);
            renderedResCount = (renderedResCount > this.parent.resourceBase.expandedResources.length) ?
                this.parent.resourceBase.expandedResources.length : renderedResCount;
            wrap.style.height = (renderedResCount * this.itemSize) + 'px';
        }
    }

    public setItemSize(): void {
        if (this.isHorizontalScroll) {
            this.itemSize = util.getElementWidthFromClass(this.parent.activeView.element, cls.WORK_CELLS_CLASS) || this.itemSize;
        } else {
            this.itemSize = util.getElementHeightFromClass(this.parent.activeView.element, cls.WORK_CELLS_CLASS) || this.itemSize;
        }
    }

    private renderEvents(): void {
        this.setTabIndex();
        if (this.parent.crudModule) {
            this.parent.crudModule.refreshProcessedData(true);
        }
        if (this.parent.currentView !== 'Month') {
            this.parent.notify(events.contentReady, {});
        }
        this.parent.hideSpinner();
    }

    public virtualScrolling(): void {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide();
            this.parent.quickPopup.morePopup.hide();
        }
        const conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (this.isHorizontalScroll) {
            this.horizontalScrolling(conWrap);
        } else {
            const resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
            const eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS) as HTMLElement;
            const timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
            const conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
            addClass([conWrap], 'e-transition');
            this.renderedLength = resWrap.querySelector('tbody').children.length;
            const firstTDIndex: number = parseInt(resWrap.querySelector('tbody td').getAttribute('data-group-index'), 10);
            const scrollHeight: number = this.parent.rowAutoHeight ?
                (conTable.offsetHeight - conWrap.offsetHeight) : this.bufferCount * this.itemSize;
            let resCollection: TdData[] = [];
            if ((conWrap.scrollTop) - this.translateY < 0) {
                resCollection = this.upScroll(conWrap, firstTDIndex);
            } else if (conWrap.scrollTop - this.translateY > scrollHeight) {
                resCollection = this.downScroll(conWrap, firstTDIndex);
            }
            if (!isNullOrUndefined(resCollection) && resCollection.length > 0) {
                this.parent.showSpinner();
                const selectedEle: Element[] = this.parent.getSelectedElements();
                this.focusedEle = selectedEle[selectedEle.length - 1] || this.focusedEle;
                this.updateContent(resWrap, conWrap, eventWrap, resCollection);
                this.setTranslate(resWrap, conWrap, eventWrap, timeIndicator);
                if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
                    this.parent.dragAndDropModule.navigationWrapper();
                }
                window.clearTimeout(this.timeValue);
                this.timeValue = window.setTimeout(() => { this.renderEvents(); }, 250);
            }
        }
    }

    private horizontalScrolling(conWrap: HTMLElement): void {
        let resCollection: TdData[] = [];
        const scrollWidth: number = this.bufferCount * this.itemSize;
        if (Math.abs(conWrap.scrollLeft) - Math.abs(this.translateY) < 0) {
            resCollection = this.leftScroll(conWrap);
        } else if (Math.abs(conWrap.scrollLeft) - Math.abs(this.translateY) > scrollWidth) {
            resCollection = this.rightScroll(conWrap);
        }
        if (!isNullOrUndefined(resCollection) && resCollection.length > 0) {
            if (this.parent.resourceBase.expandedResources.length !== resCollection.length ||
                this.parent.resourceBase.expandedResources[0] !== resCollection[0] ||
                this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1] !==
                    resCollection[resCollection.length - 1]) {
                this.parent.showSpinner();
                const colLevels: TdData[][] = this.parent.activeView.colLevels.slice(0);
                this.updateHorizontalContent(conWrap, resCollection);
                setStyleAttribute(conWrap.querySelector('table') as HTMLElement, { transform: `translateX(${this.translateY}px)` });
                this.parent.activeView.colLevels = colLevels;
                if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
                    this.parent.dragAndDropModule.navigationWrapper();
                }
            }
            window.clearTimeout(this.timeValue);
            this.timeValue = window.setTimeout(() => { this.renderEvents(); }, 250);
        }
    }

    private upScroll(conWrap: HTMLElement, firstTDIndex: number): TdData[] {
        let index: number = 0;
        index = (~~(conWrap.scrollTop / this.itemSize) + Math.ceil(conWrap.clientHeight / this.itemSize)) - this.renderedLength;

        if (this.parent.rowAutoHeight) {
            index = (index > firstTDIndex) ? firstTDIndex - this.bufferCount : index;
        }
        index = (index > 0) ? index : 0;
        const prevSetCollection: TdData[] = this.getBufferCollection(index, index + this.renderedLength);
        this.parent.resourceBase.renderedResources = prevSetCollection;
        if (firstTDIndex === 0) {
            this.translateY = conWrap.scrollTop;
        } else {
            let height: number = (this.parent.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
            height = (height > 0) ? height : this.itemSize;
            this.translateY = (conWrap.scrollTop - (this.bufferCount * height) > 0) ?
                conWrap.scrollTop - (this.bufferCount * height) : 0;
        }
        return prevSetCollection;
    }

    private downScroll(conWrap: HTMLElement, firstTDIndex: number): TdData[] {
        const lastResource: number = this.parent.resourceBase.
            renderedResources[this.parent.resourceBase.renderedResources.length - 1].groupIndex;
        const lastResourceIndex: number =
            this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
        if (lastResource === lastResourceIndex) {
            return null;
        }
        let nextSetResIndex: number = 0;
        nextSetResIndex = ~~(conWrap.scrollTop / this.itemSize);
        if (this.parent.rowAutoHeight) {
            nextSetResIndex = ~~((conWrap.scrollTop - this.translateY) / this.averageRowHeight) + firstTDIndex;
            nextSetResIndex = (nextSetResIndex > firstTDIndex + this.bufferCount) ? nextSetResIndex : firstTDIndex + this.bufferCount;
        }
        let lastIndex: number = nextSetResIndex + this.renderedLength;
        lastIndex = (lastIndex > this.parent.resourceBase.expandedResources.length) ?
            nextSetResIndex + (this.parent.resourceBase.expandedResources.length - nextSetResIndex) : lastIndex;
        const nextSetCollection: TdData[] = this.getBufferCollection(lastIndex - this.renderedLength, lastIndex);
        this.translateY = conWrap.scrollTop;
        return nextSetCollection;
    }

    private leftScroll(conWrap: HTMLElement): TdData[] {
        let index: number = 0;
        index = (~~(Math.abs(conWrap.scrollLeft) / this.itemSize) + Math.ceil(conWrap.clientWidth / this.itemSize)) - this.renderedLength;
        index = (index > 0) ? index : 0;
        return this.getCollection(index, index + this.renderedLength);
    }

    private rightScroll(conWrap: HTMLElement): TdData[] {
        const lastLevel: TdData[] = this.parent.activeView.colLevels[this.parent.activeView.colLevels.length - 1];
        let nextSetIndex: number = 0;
        nextSetIndex = ~~(Math.abs(conWrap.scrollLeft) / this.itemSize);
        let lastIndex: number = nextSetIndex + this.renderedLength;
        lastIndex = (lastIndex > lastLevel.length - 1 ) ? lastLevel.length - 1 : lastIndex;
        return this.getCollection(lastIndex - this.renderedLength, lastIndex);
    }

    private getCollection(startIndex: number, endIndex: number): TdData[] {
        this.translateY = startIndex * this.itemSize;
        const lastLevel: TdData[] = this.getResCollection(startIndex, endIndex);
        if (this.parent.enableRtl) {
            this.translateY = - this.translateY;
        }
        return lastLevel;
    }

    private getResCollection(startIndex: number, endIndex: number): TdData[] {
        const lastLevel: TdData[] = this.parent.activeView.colLevels[this.parent.activeView.colLevels.length - 1];
        let resCollection: TdData[] = [];
        const index: Record<string, number> = { startIndex: 0, endIndex: 0 };
        if (this.parent.activeViewOptions.group.byDate) {
            if (lastLevel[startIndex].date.getTime() === this.parent.resourceBase.expandedResources[0].date.getTime() &&
                lastLevel[endIndex].date.getTime() ===
                this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].date.getTime()) {
                return this.parent.resourceBase.expandedResources;
            }
            resCollection = this.getByDateCollection(lastLevel[startIndex], lastLevel[endIndex], index);
            this.setRenderedDates(resCollection);
        } else {
            if (lastLevel[startIndex].groupIndex === this.parent.resourceBase.expandedResources[0].groupIndex &&
                lastLevel[endIndex].groupIndex ===
                    this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex) {
                return this.parent.resourceBase.expandedResources;
            }
            resCollection = this.getByIdCollection(lastLevel[startIndex], lastLevel[endIndex], index);
        }
        if (this.parent.currentView !== 'Month') {
            this.startIndex = index.startIndex;
            resCollection = lastLevel.slice(index.startIndex, index.endIndex);
        }
        this.translateY = index.startIndex * this.itemSize;
        return resCollection;
    }

    private getByDateCollection(firstItem: TdData, lastItem: TdData, index: Record<string, number>): TdData[] {
        const resCollection: TdData[] = this.parent.activeView.colLevels[0].filter((data: TdData) =>
            firstItem.date.getTime() <= data.date.getTime() &&
            data.date.getTime() <= lastItem.date.getTime());
        this.setStartEndIndex(this.parent.activeView.colLevels[0], resCollection[0], resCollection[resCollection.length - 1], index);
        return resCollection;
    }

    private getByIdCollection(firstItem: TdData, lastItem: TdData, index: Record<string, number>): TdData[] {
        const resCollection: TdData[] = this.parent.resourceBase.lastResourceLevel.filter((data: TdData) =>
            firstItem.groupIndex <= data.groupIndex && data.groupIndex <= lastItem.groupIndex);
        this.parent.resourceBase.renderedResources = resCollection;
        this.setStartEndIndex(this.parent.resourceBase.lastResourceLevel, resCollection[0], resCollection[resCollection.length - 1], index);
        return resCollection;
    }

    private setStartEndIndex(data: TdData[], firstItem: TdData, lastItem: TdData, colIndex: Record<string, number>): void {
        let index: number = 0;
        data.filter((data: TdData) => {
            if (firstItem === data) {
                colIndex.startIndex = index;
            } else if (lastItem === data) {
                colIndex.endIndex = index + data.colSpan;
            }
            index += data.colSpan;
        });
        if (firstItem === lastItem) {
            colIndex.endIndex = colIndex.startIndex + lastItem.colSpan;
        }
    }

    public updateContent(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, resCollection: TdData[]): void {
        const renderedLength: number = resWrap.querySelector('tbody').children.length;
        if (document.activeElement && document.activeElement.classList.contains(cls.RESOURCE_CELLS_CLASS)) {
            this.isResourceCell = true;
            this.parent.element.focus();
        }
        for (let i: number = 0; i < renderedLength; i++) {
            remove(resWrap.querySelector('tbody tr'));
            remove(conWrap.querySelector('tbody tr'));
            remove(eventWrap.querySelector('div'));
        }
        this.parent.resourceBase.renderedResources = resCollection;
        const resourceRows: Element[] = this.parent.resourceBase.getContentRows(resCollection, true);
        const contentRows: Element[] = this.parent.activeView.getContentRows();
        const eventRows: Element[] = this.parent.activeView.getEventRows(resCollection.length);
        append(resourceRows, resWrap.querySelector('tbody'));
        append(contentRows, conWrap.querySelector('tbody'));
        append(eventRows, eventWrap);
    }

    private updateHorizontalContent(conWrap: HTMLElement, resCollection: TdData[]): void {
        this.parent.resourceBase.expandedResources = resCollection;
        const selectedEle: Element[] = this.parent.getSelectedElements();
        this.focusedEle = selectedEle[selectedEle.length - 1] || this.focusedEle;
        const renderedLength: number = conWrap.querySelectorAll('tbody tr').length;
        for (let i: number = 0; i < renderedLength; i++) {
            remove(conWrap.querySelector('tbody tr'));
        }
        if (this.parent.currentView === 'Month') {
            if (this.parent.activeViewOptions.group.byDate) {
                this.parent.activeView.colLevels[0] = resCollection;
            } else {
                this.parent.activeView.colLevels[this.parent.activeView.colLevels.length - 2] = resCollection;
            }
            const contentRows: Element[] = this.parent.activeView.getContentRows();
            append(contentRows, conWrap.querySelector('tbody'));
        } else {
            const col: Element[] = [].slice.call(conWrap.querySelector('colgroup').children);
            for (let i: number = 0; i < col.length; i++) {
                remove(col[i]);
            }
            this.parent.activeView.colLevels[this.parent.activeView.colLevels.length - 1] = resCollection;
            const contentRows: Element[] = this.parent.activeView.getContentRows();
            const table: Element = conWrap.querySelector('table');
            const thead: Element = conWrap.querySelector('thead');
            const colGroupEle: Element = conWrap.querySelector('colgroup');
            resCollection.forEach(() => {
                colGroupEle.appendChild(createElement('col'));
            });
            thead.appendChild(this.parent.eventBase.createEventWrapper('', this.startIndex > 0 ? this.startIndex : 0));
            if (this.parent.activeViewOptions.timeScale.enable) {
                thead.appendChild(this.parent.eventBase.createEventWrapper('timeIndicator'));
            }
            prepend([thead], table);
            append(contentRows, conWrap.querySelector('tbody'));
        }
    }

    private getBufferCollection(startIndex: number, endIndex: number): TdData[] {
        return this.parent.resourceBase.expandedResources.slice(startIndex, endIndex);
    }

    private setTranslate(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, timeIndicator?: HTMLElement): void {
        setStyleAttribute(resWrap.querySelector('table') as HTMLElement, { transform: `translateY(${this.translateY}px)` });
        setStyleAttribute(conWrap.querySelector('table') as HTMLElement, { transform: `translateY(${this.translateY}px)` });
        setStyleAttribute(eventWrap, { transform: `translateY(${this.translateY}px)` });
        if (!isNullOrUndefined(timeIndicator)) {
            setStyleAttribute(timeIndicator, { transform: `translateY(${this.translateY}px)` });
        }
    }

    public updateFocusedWorkCell(): void {
        if (this.focusedEle) {
            const date: number = parseInt(this.focusedEle.getAttribute('data-date'), 10);
            const groupIndex: number = parseInt(this.focusedEle.getAttribute('data-group-index'), 10);
            const ele: HTMLTableCellElement =
                this.parent.element.querySelector(`.${cls.WORK_CELLS_CLASS}[data-date="${date}"][data-group-index="${groupIndex}"]`);
            if (ele) {
                this.parent.addSelectedClass([ele], ele, true);
            }
            this.focusedEle = null;
        }
    }

    public setRenderedDates(resCollection: TdData[]): void {
        if (this.parent.currentView !== 'Month') {
            const dateCol: Date[] = resCollection.map((x: TdData) => x.date);
            this.parent.resourceBase.renderedResources.forEach((x: TdData) => x.renderDates = dateCol);
        } else {
            const dateCol: number[] = resCollection.map((x: TdData) => x.date.getDay());
            const renderDates: Date[] = this.parent.activeView.renderDates.filter((x: Date) => dateCol.indexOf(x.getDay()) >= 0);
            this.parent.resourceBase.renderedResources.forEach((x: TdData) => x.renderDates = renderDates);
        }
    }

    private setTabIndex(): void {
        const resColWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
        const resCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.RESOURCE_CELLS_CLASS));
        if (resCells && resColWrap) {
            resCells.forEach((element: HTMLElement) => {
                if (element.getBoundingClientRect().top >= resColWrap.getBoundingClientRect().top) {
                    element.setAttribute('tabindex', '0');
                }
            });
        }
        const focusResCell: HTMLElement = this.parent.element.querySelector(`.${cls.RESOURCE_CELLS_CLASS}[tabindex="${0}"]`);
        if (this.isResourceCell && focusResCell) {
            focusResCell.focus();
            this.isResourceCell = false;
        }
    }

    public destroy(): void {
        this.removeEventListener();
        this.focusedEle = null;
    }

}
