import { append, addClass, remove, isNullOrUndefined, setStyleAttribute, createElement } from '@syncfusion/ej2-base';
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
    private isScrollHeightNull: boolean = true;
    private focusedEle: Element;
    private isResourceCell: boolean;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.virtualScroll, this.virtualScrolling, this);
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.virtualScroll, this.virtualScrolling);
    }

    public getRenderedCount(): number {
        this.setItemSize();
        return Math.ceil(this.parent.element.clientHeight / this.itemSize) + this.bufferCount;
    }

    public setTranslateValue(): void {
        const resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
        const conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        const eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        const timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
        this.renderVirtualTrackHeight(conWrap, resWrap);
        this.setTranslate(resWrap, conWrap, eventWrap, timeIndicator);
    }

    private renderVirtualTrackHeight(contentWrap: HTMLElement, resourceWrap: HTMLElement): void {
        this.parent.resourceBase.setExpandedResources();
        if (this.isScrollHeightNull) {
            const wrap: HTMLElement = createElement('div', { className: cls.VIRTUAL_TRACK_CLASS }) as HTMLElement;
            const resWrap: HTMLElement[] = [].slice.call((resourceWrap).querySelectorAll('table td'));
            const startIndex: number = parseInt(resWrap[0].getAttribute('data-group-index'), 10);
            const endIndex: number = parseInt(resWrap[resWrap.length - 1].getAttribute('data-group-index'), 10);
            this.parent.resourceBase.renderedResources = this.parent.resourceBase.expandedResources.filter((resource: TdData) =>
                (resource.groupIndex >= startIndex && resource.groupIndex <= endIndex));
            this.setItemSize();
            wrap.style.height = (this.parent.resourceBase.expandedResources.length * this.itemSize) + 'px';
            this.isScrollHeightNull = false;
            const virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
            if (!isNullOrUndefined(virtual)) {
                remove(virtual);
            }
            contentWrap.appendChild(wrap);
        }
    }

    public renderVirtualTrack(contentWrap: Element): void {
        const wrap: HTMLElement = createElement('div', { className: cls.VIRTUAL_TRACK_CLASS }) as HTMLElement;
        wrap.style.height = (this.parent.resourceBase.expandedResources.length * this.itemSize) + 'px';
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
        this.itemSize = util.getElementHeightFromClass(this.parent.activeView.element, cls.WORK_CELLS_CLASS) || this.itemSize;
    }

    private renderEvents(): void {
        this.setTabIndex(),
        this.parent.notify(events.dataReady, {});
        this.parent.notify(events.contentReady, {});
        this.parent.hideSpinner();
    }

    public virtualScrolling(): void {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide();
            this.parent.quickPopup.morePopup.hide();
        }
        const resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
        const conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        const eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS) as HTMLElement;
        const timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
        const conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        this.renderedLength = resWrap.querySelector('tbody').children.length;
        const firstTDIndex: number = parseInt(resWrap.querySelector('tbody td').getAttribute('data-group-index'), 10);
        const scrollHeight: number = this.parent.rowAutoHeight ?
            (conTable.offsetHeight - conWrap.offsetHeight) : this.bufferCount * this.itemSize;
        addClass([conWrap], 'e-transition');
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
            const height: number = (this.parent.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
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

    public updateContent(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, resCollection: TdData[]): void {
        const renderedLenth: number = resWrap.querySelector('tbody').children.length;
        if (document.activeElement && document.activeElement.classList.contains(cls.RESOURCE_CELLS_CLASS)) {
            this.isResourceCell = true;
            this.parent.element.focus();
        }
        for (let i: number = 0; i < renderedLenth; i++) {
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

    private setTabIndex(): void {
        let resColWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
        let resCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.RESOURCE_CELLS_CLASS));
        if (resCells && resColWrap) {
            resCells.forEach((element: HTMLElement) => {
                if (element.getBoundingClientRect().top >= resColWrap.getBoundingClientRect().top) {
                    element.setAttribute('tabindex', '0');
                }
            });
        }
        const focusResCell: HTMLElement = this.parent.element.querySelector(`.${cls.RESOURCE_CELLS_CLASS}[tabindex="${0}"]`)
        if (this.isResourceCell && focusResCell) {
            focusResCell.focus();
            this.isResourceCell = false;
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }

}
