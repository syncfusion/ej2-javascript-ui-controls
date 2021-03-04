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
    private startIndex: number = 0;
    private timeValue: number;
    private isScrollHeightNull: boolean = true;
    private previousTop: number = 0;

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

    private triggerScrolling(): void {
        this.parent.showSpinner();
        // tslint:disable-next-line:no-any
        let scheduleObj: any = this.parent;
        let adaptor: string = 'interopAdaptor';
        let invokeMethodAsync: string = 'invokeMethodAsync';
        scheduleObj[adaptor][invokeMethodAsync]('OnContentUpdate', this.startIndex);
    }

    public setTranslateValue(): void {
        let resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
        let conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        let eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        let timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
        this.renderVirtualTrackHeight(conWrap, resWrap);
        this.setTranslate(resWrap, conWrap, eventWrap, timeIndicator);
    }

    private renderVirtualTrackHeight(contentWrap: HTMLElement, resourceWrap: HTMLElement): void {
        this.parent.resourceBase.setExpandedResources();
        if (this.isScrollHeightNull) {
            let wrap: HTMLElement = createElement('div', { className: cls.VIRTUAL_TRACK_CLASS }) as HTMLElement;
            let resWrap: HTMLElement[] =
                [].slice.call((resourceWrap).querySelectorAll('table td'));
            let startIndex: number = parseInt(resWrap[0].getAttribute('data-group-index'), 10);
            let endIndex: number = parseInt(resWrap[resWrap.length - 1].getAttribute('data-group-index'), 10);
            this.parent.resourceBase.renderedResources = this.parent.resourceBase.expandedResources.filter((resource: TdData) =>
                (resource.groupIndex >= startIndex && resource.groupIndex <= endIndex));
            this.setItemSize();
            wrap.style.height = (this.parent.resourceBase.expandedResources.length * this.itemSize) + 'px';
            this.isScrollHeightNull = false;
            let virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
            if (!isNullOrUndefined(virtual)) {
                remove(virtual);
            }
            contentWrap.appendChild(wrap);
        }
    }

    public renderVirtualTrack(contentWrap: Element): void {
        let wrap: HTMLElement = createElement('div', { className: cls.VIRTUAL_TRACK_CLASS }) as HTMLElement;
        wrap.style.height = (this.parent.resourceBase.expandedResources.length * this.itemSize) + 'px';
        contentWrap.appendChild(wrap);
    }

    public updateVirtualScrollHeight(): void {
        let virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
        let lastResourceIndex: number =
            this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
        let lastRenderIndex: number =
            this.parent.resourceBase.renderedResources[this.parent.resourceBase.renderedResources.length - 1].groupIndex;
        if (lastRenderIndex !== lastResourceIndex) {
            let conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
            this.renderedLength = conTable.querySelector('tbody').children.length;
            virtual.style.height = (conTable.offsetHeight + (this.parent.resourceBase.expandedResources.length - (this.renderedLength)) *
                conTable.offsetHeight / this.renderedLength) + 'px';
        } else {
            virtual.style.height = '';
        }
        this.averageRowHeight = virtual.offsetHeight / this.parent.resourceBase.expandedResources.length;
    }

    public updateVirtualTrackHeight(wrap: HTMLElement): void {
        let resourceCount: number = this.parent.resourceBase.renderedResources.length;
        if (resourceCount !== this.getRenderedCount()) {
            wrap.style.height = (this.parent.element.querySelector('.e-content-wrap') as HTMLElement).clientHeight + 'px';
            let resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
            let conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
            let eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS) as HTMLElement;
            this.translateY = 0;
            this.setTranslate(resWrap, conWrap, eventWrap);
        } else {
            let lastRenderIndex: number = this.parent.resourceBase.renderedResources[resourceCount - 1].groupIndex;
            let lastCollIndex: number =
                this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
            let renderedResConut: number = resourceCount + (lastCollIndex - lastRenderIndex);
            renderedResConut = (renderedResConut > this.parent.resourceBase.expandedResources.length) ?
                this.parent.resourceBase.expandedResources.length : renderedResConut;
            wrap.style.height = (renderedResConut * this.itemSize) + 'px';
        }
    }

    public setItemSize(): void {
        this.itemSize = util.getElementHeightFromClass(this.parent.activeView.element, cls.WORK_CELLS_CLASS) || this.itemSize;
    }

    private beforeInvoke(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, timeIndicator?: HTMLElement): void {
        //code
    }

    private renderEvents(): void {
        this.parent.notify(events.dataReady, {});
        this.parent.notify(events.contentReady, {});
        this.parent.hideSpinner();
    }

    public virtualScrolling(): void {
        this.parent.quickPopup.quickPopupHide();
        this.parent.quickPopup.morePopup.hide();
        let resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
        let conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS) as HTMLElement;
        let timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
        let conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        this.renderedLength = resWrap.querySelector('tbody').children.length;
        let firstTDIndex: number = parseInt(resWrap.querySelector('tbody td').getAttribute('data-group-index'), 10);
        let scrollHeight: number = this.parent.rowAutoHeight ?
            (conTable.offsetHeight - conWrap.offsetHeight) : this.bufferCount * this.itemSize;
        addClass([conWrap], 'e-transition');
        let resCollection: TdData[] = [];
        if ((conWrap.scrollTop) - this.translateY < 0) {
            resCollection = this.upScroll(conWrap, firstTDIndex);
            this.beforeInvoke(resWrap, conWrap, eventWrap, timeIndicator);
        } else if (conWrap.scrollTop - this.translateY > scrollHeight) {
            resCollection = this.downScroll(conWrap, firstTDIndex);
            if (!(this.previousTop === conWrap.scrollTop)) {
                this.beforeInvoke(resWrap, conWrap, eventWrap, timeIndicator);
            }
        }
        if (!isNullOrUndefined(resCollection) && resCollection.length > 0) {
            this.parent.showSpinner();
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
        let prevSetCollection: TdData[] = this.getBufferCollection(index, index + this.renderedLength);
        this.parent.resourceBase.renderedResources = prevSetCollection;
        if (firstTDIndex === 0) {
            this.translateY = conWrap.scrollTop;
        } else {
            let height: number = (this.parent.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
            this.translateY = (conWrap.scrollTop - (this.bufferCount * height) > 0) ?
                conWrap.scrollTop - (this.bufferCount * height) : 0;
        }
        return prevSetCollection;
    }

    private downScroll(conWrap: HTMLElement, firstTDIndex: number): TdData[] {
        let lastResource: number = this.parent.resourceBase.
            renderedResources[this.parent.resourceBase.renderedResources.length - 1].groupIndex;
        let lastResourceIndex: number =
            this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
        if (lastResource === lastResourceIndex) {
            return null;
        }
        let nextSetResIndex: number = 0;
        let height: number = (this.parent.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
        nextSetResIndex = ~~(conWrap.scrollTop / this.itemSize);
        if (this.parent.rowAutoHeight) {
            nextSetResIndex = ~~((conWrap.scrollTop - this.translateY) / this.averageRowHeight) + firstTDIndex;
            nextSetResIndex = (nextSetResIndex > firstTDIndex + this.bufferCount) ? nextSetResIndex : firstTDIndex + this.bufferCount;
        }
        let lastIndex: number = nextSetResIndex + this.renderedLength;
        lastIndex = (lastIndex > this.parent.resourceBase.expandedResources.length) ?
            nextSetResIndex + (this.parent.resourceBase.expandedResources.length - nextSetResIndex) : lastIndex;
        let nextSetCollection: TdData[] = this.getBufferCollection(lastIndex - this.renderedLength, lastIndex);
        this.translateY = conWrap.scrollTop;
        return nextSetCollection;
    }

    public updateContent(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, resCollection: TdData[]): void {
        let renderedLenth: number = resWrap.querySelector('tbody').children.length;
        for (let i: number = 0; i < renderedLenth; i++) {
            remove(resWrap.querySelector('tbody tr'));
            remove(conWrap.querySelector('tbody tr'));
            remove(eventWrap.querySelector('div'));
        }
        this.parent.resourceBase.renderedResources = resCollection;
        let resourceRows: Element[] = this.parent.resourceBase.getContentRows(resCollection);
        let contentRows: Element[] = this.parent.activeView.getContentRows();
        let eventRows: Element[] = this.parent.activeView.getEventRows(resCollection.length);
        append(resourceRows, resWrap.querySelector('tbody'));
        append(contentRows, conWrap.querySelector('tbody'));
        append(eventRows, eventWrap);
    }

    private getBufferCollection(startIndex: number, endIndex: number): TdData[] {
        return this.parent.resourceBase.expandedResources.slice(startIndex, endIndex);
    }

    private setTranslate(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, timeIndicator?: HTMLElement): void {
        setStyleAttribute(resWrap.querySelector('table') as HTMLElement, {
            transform: `translateY(${this.translateY}px)`
        });
        setStyleAttribute(conWrap.querySelector('table') as HTMLElement, {
            transform: `translateY(${this.translateY}px)`
        });
        setStyleAttribute(eventWrap, {
            transform: `translateY(${this.translateY}px)`
        });
        if (!isNullOrUndefined(timeIndicator)) {
            setStyleAttribute(timeIndicator, {
                transform: `translateY(${this.translateY}px)`
            });
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }
}