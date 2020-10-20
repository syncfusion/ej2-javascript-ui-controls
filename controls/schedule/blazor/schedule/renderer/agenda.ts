import { formatUnit, EventHandler, setStyleAttribute, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { IRenderer, NotifyEventArgs } from '../base/interface';
import { SfSchedule } from '../../schedule';
import { ViewBase } from './view-base';
import * as util from '../base/util';
import * as cls from '../base/css-constant';

/**
 * agenda view
 */
export class Agenda extends ViewBase implements IRenderer {
    public viewClass: string = 'e-agenda-view';
    public isInverseTableSelect: boolean = false;
    private translateY: number = 0;
    private itemCount: number = 0;
    private elementHeight: number = 70;
    private bufferCount: number = 3;
    private renderedCount: number = 10;
    private timeValue: number;
    constructor(parent: SfSchedule) {
        super(parent);
    }
    public renderLayout(): void {
        this.element = this.parent.element.querySelector('.' + cls.TABLE_WRAP_CLASS);
        this.wireEvents();
        this.parent.setDimensions();
    }
    public onDataReady(args: NotifyEventArgs, count?: number, isScrollTop?: boolean): void {
        let wrap: HTMLElement = this.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
        if (!wrap) {
            wrap = createElement('div', { className: cls.VIRTUAL_TRACK_CLASS }) as HTMLElement;
        }
        let conWrap: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        wrap.style.height = (count * this.elementHeight) - conWrap.offsetHeight + 'px';
        conWrap.appendChild(wrap);
        if (isScrollTop) {
            conWrap.scrollTop = this.translateY = 0;
            this.setTranslate(conWrap);
        }
        this.itemCount = count;
    }
    private wireEvents(): void {
        EventHandler.add(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), 'scroll', this.agendaScrolling, this);
    }
    private unWireEvents(): void {
        EventHandler.remove(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), 'scroll', this.agendaScrolling);
    }
    private agendaScrolling(): void {
        if (!isNullOrUndefined(this.parent.quickPopup)) {
            this.parent.quickPopup.hide();
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            let conWrap: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            let appElement: HTMLElement = this.element.querySelector('.e-agenda-item') as HTMLElement;
            this.elementHeight = appElement ? appElement.offsetHeight : this.elementHeight;
            let index : number;
            if (conWrap.scrollTop - this.translateY < 0) {
                index = ~~(conWrap.scrollTop / this.elementHeight);
                this.translateY = conWrap.scrollTop;
                this.setTranslate(conWrap);
                this.beforeInvoke(index);
            } else if (conWrap.scrollTop - this.translateY > (this.elementHeight * this.bufferCount)) {
                index = ~~(conWrap.scrollTop / this.elementHeight);
                index = (index > this.itemCount) ? this.itemCount - this.renderedCount : index;
                this.translateY = conWrap.scrollTop;
                if (this.translateY > (this.itemCount * this.elementHeight) - (this.renderedCount * this.elementHeight)) {
                    this.translateY = (this.itemCount * this.elementHeight - (this.renderedCount * this.elementHeight));
                }
                this.setTranslate(conWrap);
                this.beforeInvoke(index);
            }
        }
    }
    private beforeInvoke(index: number): void {
        window.clearTimeout(this.timeValue);
        this.timeValue = window.setTimeout(() => { this.triggerScrolling(index); }, 100);
    }
    private triggerScrolling(index: number): void {
        this.parent.dotNetRef.invokeMethodAsync('AgendaScroll', index);
    }
    public setTranslate(conWrap: HTMLElement): void {
        setStyleAttribute(conWrap.querySelector('table'), { transform: 'translateY(' + this.translateY + 'px)' });
    }
    public getEndDateFromStartDate(startDate: Date): Date {
        return util.resetTime(util.addDays(startDate, 1));
    }
    public onScrollUiUpdate(): void {
        let headerHeight: number = this.getHeaderBarHeight();
        let contentArea: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        contentArea.style.height = formatUnit(this.parent.element.offsetHeight - headerHeight);
    }
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.element) {
            this.unWireEvents();
            this.element = null;
        }
    }
}
