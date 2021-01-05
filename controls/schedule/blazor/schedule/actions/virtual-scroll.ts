import { addClass, isNullOrUndefined, setStyleAttribute } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * Virtual Scroll
 */
export class VirtualScroll {
    private parent: SfSchedule;
    private translateY: number = 0;
    private itemSize: number = 60;
    public bufferCount: number = 3;
    private renderedLength: number = 0;
    private averageRowHeight: number = 0;
    private startIndex: number = 0;
    private timeValue: number;
    private previousTop: number = 0;

    constructor(parent: SfSchedule) {
        this.parent = parent;
    }

    public getRenderedCount(): number {
        let conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        this.renderedLength = conTable.querySelector('tbody').children.length;
        return this.renderedLength;
    }

    private triggerScrolling(): void {
        this.parent.dotNetRef.invokeMethodAsync('OnContentUpdate', this.startIndex);
    }

    public setTranslateValue(): void {
        let resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
        let conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        let eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        let timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
        this.setItemSize();
        this.setVirtualTrackHeight(resWrap);
        this.setTranslate(resWrap, conWrap, eventWrap, timeIndicator);
        conWrap.scrollTop = resWrap.scrollTop;
    }

    private setVirtualTrackHeight(resourceWrap: HTMLElement): void {
        let virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
        if (virtual) {
            let count: number = parseInt(resourceWrap.getAttribute('data-expanded-count'), 10);
            virtual.style.height = (count * this.itemSize) + 'px';
        }
    }

    public updateVirtualScrollHeight(): void {
        let virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
        let resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
        let lastRenderIndex: number = parseInt(resWrap.getAttribute('data-rendered-index'), 10);
        let lastCollIndex: number = parseInt(resWrap.getAttribute('data-expanded-index'), 10);
        let expandedCount: number = parseInt(resWrap.getAttribute('data-expanded-count'), 10);
        let conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        this.renderedLength = conTable.querySelector('tbody').children.length;
        virtual.style.height = (conTable.offsetHeight + (expandedCount - (this.renderedLength)) *
                conTable.offsetHeight / this.renderedLength) + 'px';
        this.averageRowHeight = virtual.offsetHeight / expandedCount;
    }

    public updateVirtualTrackHeight(wrap: HTMLElement): void {
        let resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
        let lastRenderIndex: number = parseInt(resWrap.getAttribute('data-rendered-index'), 10);
        let lastCollIndex: number = parseInt(resWrap.getAttribute('data-expanded-index'), 10);
        let renderedResCount: number = this.getRenderedCount() + (lastCollIndex - lastRenderIndex);
        let expandedCount: number = parseInt(resWrap.getAttribute('data-expanded-count'), 10);
        renderedResCount = (renderedResCount > expandedCount) ? expandedCount : renderedResCount;
        wrap.style.height = (renderedResCount * this.itemSize) + 'px';
    }

    private setItemSize(): void {
        this.itemSize = util.getElementHeightFromClass(this.parent.activeView.element, cls.WORK_CELLS_CLASS) || this.itemSize;
    }

    private beforeInvoke(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, timeIndicator?: HTMLElement): void {
        window.clearTimeout(this.timeValue);
        this.timeValue = window.setTimeout(() => { this.triggerScrolling(); }, 250);
        this.setTranslate(resWrap, conWrap, eventWrap, timeIndicator);
        this.previousTop = conWrap.scrollTop;
    }

    public virtualScrolling(): void {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.hide();
        }
        if (this.parent.morePopup) {
            this.parent.morePopup.hide();
        }
        let resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
        let conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let eventWrap: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS) as HTMLElement;
        let timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
        let conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        this.renderedLength = resWrap.querySelector('tbody').children.length;
        let firstTDIndex: number = parseInt(resWrap.querySelector('tbody td').getAttribute('data-group-index'), 10);
        let scrollHeight: number = this.parent.options.rowAutoHeight ?
            (conTable.offsetHeight - conWrap.offsetHeight) : this.bufferCount * this.itemSize;
        addClass([conWrap], 'e-transition');
        this.setItemSize();
        if ((conWrap.scrollTop) - this.translateY < 0) {
            this.upScroll(conWrap, firstTDIndex);
            this.beforeInvoke(resWrap, conWrap, eventWrap, timeIndicator);
        } else if (conWrap.scrollTop - this.translateY > scrollHeight) {
            this.downScroll(conWrap);
            if (!(this.previousTop === conWrap.scrollTop)) {
                this.beforeInvoke(resWrap, conWrap, eventWrap, timeIndicator);
            }
        }
    }

    private upScroll(conWrap: HTMLElement, firstTDIndex: number): void {
        let index: number = ~~(conWrap.scrollTop / this.itemSize);
        if (this.parent.options.rowAutoHeight) {
            index = (index > firstTDIndex) ? firstTDIndex - this.bufferCount : index;
        }
        index = (index > 0) ? index : 0;
        if (firstTDIndex === 0) {
            this.translateY = conWrap.scrollTop;
        } else {
            let height: number = (this.parent.options.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
            this.translateY = (conWrap.scrollTop - (this.bufferCount * height) > 0) ?
                conWrap.scrollTop - (this.bufferCount * height) : 0;
        }
        this.startIndex = index;
    }

    private downScroll(conWrap: HTMLElement): void {
        let resWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
        if (resWrap.getAttribute('data-rendered-index') === resWrap.getAttribute('data-expanded-index')) {
            return null;
        }
        let height: number = (this.parent.options.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
        let nextSetResIndex: number = ~~(conWrap.scrollTop / height);
        let lastIndex: number = nextSetResIndex + this.renderedLength;
        let expandedCount: number = parseInt(resWrap.getAttribute('data-expanded-count'), 10);
        lastIndex = (lastIndex > expandedCount) ? nextSetResIndex + (expandedCount - nextSetResIndex) : lastIndex;
        this.translateY = conWrap.scrollTop;
        if (this.translateY > (expandedCount * height) - (this.renderedLength * height)) {
            this.translateY = (expandedCount * height) - (this.renderedLength * height);
        }
        this.startIndex = lastIndex - this.renderedLength;
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
}