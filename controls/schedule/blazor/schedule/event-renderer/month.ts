import { createElement, setStyleAttribute, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { EventBase } from './event-base';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { SfSchedule } from '../../schedule';
import { NotifyEventArgs } from '../base/interface';

/**
 * Month view events render
 */
export const ADD_EMPTY_LENGTH: number = 5;
const EVENT_GAP: number = 0;
const EVENT_TOP: number = 10;
const BLOCK_INDICATOR_WIDTH: number = 24;
export class MonthEvent extends EventBase {
    public dateRender: Date[];
    public renderedEvents: Object[] = [];
    public eventHeight: number;
    public workCells: HTMLElement[];
    public cellWidth: number;
    public cellHeight: number;
    public allDayLevel: number = 0;
    public moreIndicatorHeight: number = 19;
    private monthHeaderHeight: number = 0;
    public maxHeight: boolean;
    public withIndicator: boolean;
    public maxOrIndicator: boolean;

    constructor(parent: SfSchedule) {
        super(parent);
        this.maxHeight = this.parent.options.enableMaxHeight && !this.parent.options.enableIndicator
            && !this.parent.options.rowAutoHeight;
        this.withIndicator = this.parent.options.enableMaxHeight && this.parent.options.enableIndicator
            && !this.parent.options.rowAutoHeight;
        this.maxOrIndicator = (this.maxHeight || this.withIndicator);
        this.moreIndicatorHeight =
            (this.parent.options.rowAutoHeight && this.parent.options.ignoreWhitespace) ? 0 : this.moreIndicatorHeight;
    }

    public renderAppointments(): void {
        let eventTable: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        if (!isNullOrUndefined(eventTable)) {
            setStyleAttribute(eventTable, {
                'display': 'block'
            });
        }
        let eventsClass: string = '.' + cls.APPOINTMENT_CLASS + ', .' + cls.MORE_INDICATOR_CLASS;
        let blockEventClass: string = '.' + cls.BLOCK_APPOINTMENT_CLASS + ', .' + cls.BLOCK_INDICATOR_CLASS;
        let elementList: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(eventsClass + ', ' + blockEventClass));
        let workcell: HTMLElement = this.parent.element.querySelector('.e-work-cells');
        if (!workcell) {
            return;
        }
        let conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (this.parent.options.rowAutoHeight) {
            this.parent.uiStateValues.top = conWrap.scrollTop;
            this.parent.uiStateValues.left = conWrap.scrollLeft;
        }
        this.removeHeightProperty(cls.CONTENT_TABLE_CLASS);
        this.cellHeight = workcell.getBoundingClientRect().height;
        this.cellWidth = workcell.getBoundingClientRect().width;
        let currentPanel: HTMLElement = this.parent.element.querySelector('.e-current-panel');
        let appHeight: number = util.getElementHeightFromClass(currentPanel, cls.APPOINTMENT_CLASS);
        this.dateRender = this.parent.activeView.renderDates;
        for (let i: number = 0; i < elementList.length; i++) {
            let ele: HTMLElement = elementList[i] as HTMLElement;
            ele.removeAttribute('style');
            let startTime: string = this.getStartTime(ele);
            let overlapCount: number = this.getOverLapCount(ele);
            let diffInDays: number = this.getDataCount(ele);
            let appWidth: number = (diffInDays * this.cellWidth) - 5;
            let appLeft: number = 0;
            let appRight: number = 0;
            let resIndex: number = this.getGroupIndex(ele);
            let cellTd: HTMLElement = this.getCellTd(resIndex, startTime);
            let target: HTMLElement = closest(cellTd, 'tr') as HTMLElement;
            this.monthHeaderHeight = (<HTMLElement>cellTd.firstChild).offsetHeight;
            let height: number =
                this.monthHeaderHeight + ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight;
            if (this.parent.options.rowAutoHeight) {
                this.updateCellHeight(<HTMLElement>target.firstElementChild, height);
            }
            let top: number = cellTd.offsetTop;
            let appTop: number = this.monthHeaderHeight + ((ele.classList.contains('e-block-appointment')) ? top :
                (top + EVENT_GAP) + (overlapCount * (appHeight + EVENT_GAP))) + EVENT_TOP;
            appLeft = (this.parent.options.enableRtl) ? 0 : cellTd.offsetLeft;
            appRight = (this.parent.options.enableRtl) ? cellTd.parentElement.offsetWidth - cellTd.offsetLeft - this.cellWidth : 0;
            if (!ele.classList.contains('e-more-indicator')) {
                if (!ele.classList.contains('e-block-indicator')) {
                    setStyleAttribute(ele, {
                        'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                    });
                    if (this.maxOrIndicator) {
                        this.setMaxEventHeight(ele, cellTd);
                    }
                    if (ele.classList.contains('e-block-appointment')) {
                        setStyleAttribute(ele, {
                            'height': (<HTMLElement>cellTd).offsetHeight - this.monthHeaderHeight - 1 + 'px'
                        });
                    }
                    if (ele.classList.contains('e-appointment')) {
                        this.parent.eventBase.applyResourceColor(ele);
                        this.parent.eventBase.wireAppointmentEvents(ele);
                    }
                } else {
                    this.updateBlockIndicator(ele, appRight, appLeft, cellTd);

                }
            } else {
                this.updateMoreIndicator(ele, appRight, appLeft, top);
            }
        }
        this.updateRowHeight(appHeight);
    }

    public updateMoreIndicator(ele: HTMLElement, right: number, left: number, top: number): void {
        let appArea: number = this.cellHeight - this.moreIndicatorHeight;
        setStyleAttribute(ele, {
            'top': top + appArea + 'px', 'width': this.cellWidth + 'px', 'left': left + 'px', 'right': right + 'px'
        });
    }

    public updateBlockIndicator(ele: HTMLElement, right: number, left: number, cell: HTMLElement): void {
        if (this.parent.options.enableRtl) {
            ele.style.right = (right + this.cellWidth) - BLOCK_INDICATOR_WIDTH + 'px';
        } else {
            ele.style.left = (left + this.cellWidth) - BLOCK_INDICATOR_WIDTH + 'px';
        }
        ele.style.top = cell.offsetTop + (<HTMLElement>cell.firstChild).offsetTop + 22 + 'px';
        ele.style.position = 'absolute';
    }

    public setMaxEventHeight(event: HTMLElement, cell: HTMLElement): void {
        let headerHeight: number = util.getOuterHeight(cell.querySelector('.' + cls.DATE_HEADER_CLASS));
        let height: number = (cell.offsetHeight - headerHeight) - (this.maxHeight ? 0 : this.moreIndicatorHeight);
        setStyleAttribute(event, { 'height': height + 'px', 'align-items': 'center' });
    }

    public getCellTd(resIndex: number, date?: string): HTMLElement {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return (<HTMLElement>this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                ' ' + 'tbody td[data-group-index="' + resIndex.toString() + '"][data-date="' + date + '"]'));
        }
        return (<HTMLElement>this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
            ' ' + 'tbody td[data-date="' + date + '"]'));
    }

    public getGroupIndex(ele: HTMLElement): number {
        let index: number = parseInt(ele.getAttribute('data-group-index'), 10);
        return index ? index : 0;
    }
    public getOverLapCount(ele: HTMLElement): number {
        return parseInt(ele.getAttribute('data-index'), 10);
    }

    public getStartTime(ele: HTMLElement): string {
        return (ele.getAttribute('data-start'));
    }

    public getEndTime(ele: HTMLElement): Date {
        return new Date(ele.getAttribute('data-end'));
    }

    public getDataCount(ele: HTMLElement): number {
        return parseInt(ele.getAttribute('data-total-length'), 10);
    }

    public updateRowHeight(appHeight?: number): void {
        if (this.parent.options.rowAutoHeight) {
            this.updateBlockElements();
            this.updateNormalEventElements(appHeight);
            this.updateBlockIndicatorEle();
            let data: NotifyEventArgs = {
                cssProperties: this.parent.getCssProperties(),
                isPreventScrollUpdate: true,
                scrollPosition: { left: this.parent.uiStateValues.left, top: this.parent.uiStateValues.top }
            };
            this.parent.onScrollUiUpdate(data);
        }
    }

    private updateBlockIndicatorEle(): void {
        let blockElement: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.BLOCK_INDICATOR_CLASS));
        for (let element of blockElement) {
            let startTime: string = this.getStartTime(element);
            let resIndex: number = this.getGroupIndex(element);
            let cellTd: HTMLElement = this.getCellTd(resIndex, startTime);
            let appLeft: number = (this.parent.options.enableRtl) ? 0 : cellTd.offsetLeft;
            let appRight: number = (this.parent.options.enableRtl) ?
                cellTd.parentElement.offsetWidth - cellTd.offsetLeft - this.cellWidth : 0;
            this.updateBlockIndicator(element, appRight, appLeft, cellTd);
        }
    }

    public updateBlockElements(): void {
        let blockElement: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS));
        for (let element of blockElement) {
            let startTime: string = this.getStartTime(element);
            let resIndex: number = this.getGroupIndex(element);
            let cellTd: HTMLElement = this.getCellTd(resIndex, startTime);
            let height: number = (<HTMLElement>cellTd).offsetHeight - this.monthHeaderHeight - 1;
            let width: number = Math.round(element.offsetWidth / (<HTMLElement>cellTd).offsetWidth);
            width = ((<HTMLElement>cellTd).offsetWidth * width);
            let appLeft: number = (this.parent.options.enableRtl) ? 0 : cellTd.offsetLeft;
            let appRight: number = (this.parent.options.enableRtl) ?
                cellTd.parentElement.offsetWidth - cellTd.offsetLeft - this.cellWidth : 0;
            let appTop: number = cellTd.offsetTop + this.monthHeaderHeight + EVENT_TOP;
            setStyleAttribute(element, {
                'width': width + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'height': height + 'px', 'top': appTop + 'px'
            });
        }
    }

    private updateNormalEventElements(appHeight: number): void {
        let blockElement: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
        for (let element of blockElement) {
            let startTime: string = this.getStartTime(element);
            let resIndex: number = this.getGroupIndex(element);
            let cellTd: HTMLElement = this.getCellTd(resIndex, startTime);
            let overlapCount: number = this.getOverLapCount(element);
            let appLeft: number = (this.parent.options.enableRtl) ? 0 : cellTd.offsetLeft;
            let appRight: number = (this.parent.options.enableRtl) ?
                cellTd.parentElement.offsetWidth - cellTd.offsetLeft - this.cellWidth : 0;
            let top: number = this.monthHeaderHeight +
                ((<HTMLElement>cellTd).offsetTop + EVENT_GAP) + (overlapCount * (appHeight + EVENT_GAP)) + EVENT_TOP;
            setStyleAttribute(element, {
                'left': appLeft + 'px', 'right': appRight + 'px', 'top': top + 'px'
            });
        }
    }

    public updateCellHeight(cell: HTMLElement, height: number): void {
        if ((height > cell.offsetHeight)) {
            setStyleAttribute(cell as HTMLElement, { 'height': height + 'px' });
        }
    }

    public getSlotDates(workDays?: number[]): void {
        this.slots = [];
        let dates: number[] = this.dateRender.map((date: Date) => { return +date; });
        let noOfDays: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH : workDays.length;
        while (dates.length > 0) {
            this.slots.push(dates.splice(0, noOfDays));
        }
    }

    public renderEvents(event: { [key: string]: Object }, resIndex: number, eventsList?: { [key: string]: Object }[]): void {
        let startTime: Date = event.startTime as Date;
        let day: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(startTime));
        let diffInDays: number = (event.data as { [key: string]: Object }).count as number;
        let appWidth: number = (diffInDays * this.cellWidth) - 5;
        let cellTd: Element = this.workCells[day];
        let appointmentElement: HTMLElement;
        appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
        setStyleAttribute(appointmentElement, { 'width': appWidth + 'px' });
        this.renderEventElement(appointmentElement, cellTd);
    }
    public renderEventElement(appointmentElement: HTMLElement, cellTd: Element): void {
        let wrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
        wrapper.appendChild(appointmentElement);
        cellTd.appendChild(wrapper);
    }
    public removeHeightProperty(selector: string): void {
        let rows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + selector + ' tbody tr'));
        for (let row of rows) {
            (row.firstElementChild as HTMLElement).style.height = '';
        }
    }
}