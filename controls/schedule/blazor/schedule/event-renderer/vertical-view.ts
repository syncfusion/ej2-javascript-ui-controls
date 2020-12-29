import { formatUnit, setStyleAttribute, addClass, removeClass, EventHandler } from '@syncfusion/ej2-base';
import * as util from '../base/util';
import * as cls from '../base/css-constant';
import { SfSchedule } from '../../schedule';

/**
 * Vertical view appointment rendering
 */
export const ADD_BORDER_LENGTH: number = 4;
export const DEFAULT_ALL_DAY_ROW_LENGTH: number = 4;
export class VerticalEvent {
    public parent: SfSchedule;
    private slotCount: number;
    private interval: number;
    public cellHeight: number;
    public allDayElement: Element[];
    public allDayLevel: number = 0;
    private element: HTMLElement;


    constructor(parent: SfSchedule) {
        this.parent = parent;
        this.slotCount = parent.activeViewOptions.timeScale.slotCount;
        this.interval = parent.activeViewOptions.timeScale.interval;
        this.element = this.parent.activeView.getPanel();
    }
    public renderAppointments(): void {
        let expandCollapse: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        if (expandCollapse) {
            EventHandler.remove(expandCollapse, 'click', this.rowExpandCollapse);
            EventHandler.add(expandCollapse, 'click', this.rowExpandCollapse, this);
        }
        let workcell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
        if (!workcell) {
            return;
        }
        let contentWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        let normalElementList: HTMLElement[] = [].slice.call(contentWrap.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
        let blockElementList: HTMLElement[] = [].slice.call(contentWrap.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS));
        let elementList: HTMLElement[] = normalElementList.concat(blockElementList);
        let cellHeight: number =
            parseFloat(this.element.querySelector('.e-content-wrap tbody tr').getBoundingClientRect().height.toFixed(2));
        let cellWidth: number = workcell.getBoundingClientRect().width;
        for (let i: number = 0; i < elementList.length; i++) {
            let ele: HTMLElement = elementList[i] as HTMLElement;
            let columnCount: number = this.getColumn(ele);
            let widthSize: string = this.getAppWidth(this.getColumnCounts(ele));
            ele.style.top =
                ((this.getTopStartDuration(ele) / (this.parent.activeViewOptions.timeScale.interval /
                    this.parent.activeViewOptions.timeScale.slotCount * 60000)) * cellHeight) + 'px';
            ele.style.left = this.getEventLeft(widthSize, columnCount);
            ele.style.width = ele.classList.contains(cls.BLOCK_APPOINTMENT_CLASS) ? '100%' : widthSize;
            ele.style.height = ((((this.getTopStartDuration(ele) + this.getDuration(ele)) /
                (this.parent.activeViewOptions.timeScale.interval /
                    this.parent.activeViewOptions.timeScale.slotCount * 60000)) * cellHeight) -
                ((this.getTopStartDuration(ele) / (this.parent.activeViewOptions.timeScale.interval /
                    this.parent.activeViewOptions.timeScale.slotCount * 60000)) * cellHeight)) + 'px';
            this.parent.eventBase.wireAppointmentEvents(ele);
        }
        let allDayRowTop: number = (this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS) as HTMLElement).offsetTop;
        let allDaylementList: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_APPOINTMENT_CLASS));
        let appHeight: number = allDaylementList.length > 0 ? allDaylementList[0].offsetHeight : 0;
        let allDayWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS));
        this.setAllDayRowHeight(0);
        for (let j: number = 0; j < allDayWrapper.length; j++) {
            let eleList: HTMLCollection = allDayWrapper[j].children;
            for (let i: number = 0; i < eleList.length; i++) {
                let ele: HTMLElement = eleList[i] as HTMLElement;
                let allDayRowHeight: number = 0;
                if (!ele.classList.contains(cls.ROW_COUNT_WRAPPER_CLASS)) {
                    let rowCount: number = this.getRowCount(ele);
                    let totalLength: number = this.getTotalLength(ele);
                    this.allDayLevel = (this.allDayLevel < rowCount) ? rowCount : this.allDayLevel;
                    ele.style.top = allDayRowTop + (rowCount * appHeight) + 'px';
                    ele.style.width = (cellWidth * totalLength) - 15 + 'px';
                    allDayRowHeight = ((!this.parent.uiStateValues.expand && this.allDayLevel > 3) ?
                        (DEFAULT_ALL_DAY_ROW_LENGTH * appHeight) : ((this.allDayLevel + 1) * appHeight)) + ADD_BORDER_LENGTH;
                    this.parent.eventBase.wireAppointmentEvents(ele);
                } else {
                    ele.style.top = allDayRowTop + (DEFAULT_ALL_DAY_ROW_LENGTH * appHeight) + 'px';
                    allDayRowHeight = (DEFAULT_ALL_DAY_ROW_LENGTH * appHeight) + ADD_BORDER_LENGTH;
                }
                this.setAllDayRowHeight(allDayRowHeight);
            }
        }
        let moreIndicatorElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.MORE_INDICATOR_CLASS));
        for (let i: number = 0; i < moreIndicatorElement.length; i++) {
            EventHandler.clearEvents(moreIndicatorElement[i]);
            EventHandler.add(moreIndicatorElement[i], 'click', this.rowExpandCollapse, this);
        }
        this.parent.setDimensions();
    }
    private getAppWidth(overlapEvents: number): string {
        let width: number = this.parent.options.currentView === 'Day' ? 97 : 94;
        let tempWidth: number = ((width - overlapEvents) / overlapEvents);
        return (tempWidth < 0 ? 0 : tempWidth) + '%';
    }

    private getEventLeft(appWidth: string, index: number): string {
        let tempLeft: number = (parseFloat(appWidth) + 1) * index;
        return (tempLeft > 99 ? 99 : tempLeft) + '%';
    }

    private setAllDayRowHeight(height: number): void {
        let allDayElement: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS));
        for (let i: number = 0; i < allDayElement.length; i++) {
            allDayElement[i].style.height = (height / 12) + 'em';
        }
    }

    private getRowCount(ele: HTMLElement): number {
        return parseInt(ele.getAttribute('data-row-index'), 10);
    }

    private getTotalLength(ele: HTMLElement): number {
        return parseInt(ele.getAttribute('data-total-length'), 10);
    }

    private getDuration(ele: HTMLElement): number {
        return parseInt(ele.getAttribute('data-duration'), 10);
    }
    private getTopStartDuration(ele: HTMLElement): number {
        return parseInt(ele.getAttribute('data-top-start-duration'), 10);
    }
    private getColumnCounts(ele: HTMLElement): number {
        return parseInt(ele.getAttribute('data-columns-count'), 10);
    }
    private getColumn(ele: HTMLElement): number {
        return parseInt(ele.getAttribute('data-columns'), 10);
    }

    public rowExpandCollapse(): void {
        let target: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        this.parent.uiStateValues.expand = target.classList.contains(cls.APPOINTMENT_ROW_EXPAND_CLASS);
        let allDaylementList: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_APPOINTMENT_CLASS));
        let appHeight: number = allDaylementList.length > 0 ? allDaylementList[0].offsetHeight : 0;
        let rowHeight: number;
        if (this.parent.uiStateValues.expand) {
            target.setAttribute('title', 'Collapse-all-day-section');
            target.setAttribute('aria-label', 'Collapse section');
            rowHeight = ((this.allDayLevel + 1) * appHeight) + ADD_BORDER_LENGTH;
        } else {
            target.setAttribute('title', 'Expand-all-day-section');
            target.setAttribute('aria-label', 'Expand section');
            rowHeight = (DEFAULT_ALL_DAY_ROW_LENGTH * appHeight) + ADD_BORDER_LENGTH;
        }
        this.setAllDayRowHeight(rowHeight);
        this.addOrRemoveClass();
        this.parent.setDimensions();
    }
    private addOrRemoveClass(): void {
        let moreEvents: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-more-event'));
        moreEvents.filter((element: HTMLElement) => {
            if (!this.parent.uiStateValues.expand && this.allDayLevel > 2) {
                addClass([element], cls.EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '-1');
            } else {
                removeClass([element], cls.EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '0');
            }
        });
        let moreEventCount: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        if (this.parent.uiStateValues.expand) {
            removeClass([moreEventCount], cls.APPOINTMENT_ROW_EXPAND_CLASS);
            addClass([moreEventCount], cls.APPOINTMENT_ROW_COLLAPSE_CLASS);
        } else {
            removeClass([moreEventCount], cls.APPOINTMENT_ROW_COLLAPSE_CLASS);
            addClass([moreEventCount], cls.APPOINTMENT_ROW_EXPAND_CLASS);
        }
        (this.allDayLevel > 2) ? removeClass([moreEventCount], cls.DISABLE_CLASS) : addClass([moreEventCount], cls.DISABLE_CLASS);
        let countCell: Element[] = [].slice.call(this.element.querySelectorAll('.' + cls.ROW_COUNT_WRAPPER_CLASS));
        countCell.filter((element: Element) => {
            (!this.parent.uiStateValues.expand && this.allDayLevel > 2) ? removeClass([element], cls.DISABLE_CLASS) :
                addClass([element], cls.DISABLE_CLASS);
        });
    }
    public initializeValues(): void {
        this.cellHeight =
            parseFloat(this.parent.element.querySelector('.e-content-wrap tbody tr').getBoundingClientRect().height.toFixed(2));
    }

    public getHeight(start: Date, end: Date): number {
        let appHeight: number = (end.getTime() - start.getTime()) / (60 * 1000) * (this.cellHeight * this.slotCount) / this.interval;
        appHeight = (appHeight <= 0) ? this.cellHeight : appHeight;
        return appHeight;
    }

    public renderNormalEvents
        (eventObj: { [key: string]: Object }, dayIndex: number, resource: number, dayCount: number): void {
        let record: { [key: string]: Object } = eventObj;
        let eStart: Date = record.startTime as Date;
        let eEnd: Date = record.endTime as Date;
        let topValue: number = 0;
        let appHeight: number = this.getHeight(eStart, eEnd);
        topValue = this.getTopValue(eStart, dayIndex);
        let appointmentElement: HTMLElement;
        appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
        setStyleAttribute(appointmentElement, {
            'width': (this.getEventWidth()),
            'height': appHeight + 'px', 'top': topValue + 'px'
        });
        let index: number = this.parent.activeViewOptions.group.byDate ? (dayIndex) + resource : dayCount;
        let appointmentWrap: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_WRAPPER_CLASS));
        appointmentWrap[index].appendChild(appointmentElement);
    }

    private getEventWidth(): string {
        let width: number = this.parent.options.currentView === 'Day' ? 97 : 94;
        return (width < 0 ? 0 : width) + '%';
    }


    public getTopValue(date: Date, day: number): number {
        let currentDate: Date = util.resetTime(this.parent.activeView.renderDates[day]);
        let tDay: Date = new Date();
        tDay.setHours(0, 0, 0, 0);
        let startEndHours: { [key: string]: Date } =
            this.parent.eventBase.getStEdHours(currentDate, tDay, util.addDays(new Date(tDay.getTime()), 1));
        let startHour: Date = startEndHours.startHour;
        let diffInMinutes: number = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.cellHeight * this.slotCount) / this.interval;
    }


    public renderAllDayEvents
        (eventObj: { [key: string]: Object }, dayIndex: number, resource: number, dayCount: number): void {
        let record: { [key: string]: Object } = eventObj;
        let allDayRowCell: Element = this.parent.element.querySelector('.' + cls.ALLDAY_CELLS_CLASS + ':first-child');
        let cellTop: number = (<HTMLElement>allDayRowCell).offsetTop;
        let appWidth: number = 0; let topValue: number = 1; let allDayIndex: number = 0;
        record.Index = allDayIndex;
        this.allDayLevel = (this.allDayLevel < allDayIndex) ? allDayIndex : this.allDayLevel;
        let widthAdjustment: number = this.parent.options.currentView === 'Day' ? 4 : 7;
        appWidth = 100 - widthAdjustment;
        let wIndex: number = this.parent.activeViewOptions.group.byDate ? (dayIndex) + resource : dayCount;
        let eventWrapper: Element = this.parent.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS +
            ':nth-child(' + (wIndex + 1) + ')');
        let appointmentElement: HTMLElement;
        appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
        eventWrapper.appendChild(appointmentElement);
        topValue += cellTop + 1;
        setStyleAttribute(appointmentElement, { 'width': appWidth + '%', 'top': formatUnit(topValue) });
        addClass([appointmentElement], cls.ALLDAY_APPOINTMENT_CLASS);
    }
}