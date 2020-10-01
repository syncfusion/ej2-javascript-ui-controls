import { isNullOrUndefined, createElement, formatUnit, setStyleAttribute } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';
import { VerticalViews } from './vertical-view';
import {TimelineEvent} from '../event-renderer/timeline-view';
import * as cls from '../base/css-constant';

/**
 * timeline view
 */
export class TimelineViews extends VerticalViews {
    constructor(parent: SfSchedule) {
        super(parent);
        this.baseCssClass = 'e-timeline-view';
    }
    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
    }
    public scrollTopPanel(target: HTMLElement): void {
        super.scrollTopPanel(target);
        this.scrollHeaderLabels(target);
    }
    public scrollToWorkHour(): void {
        let start: Date = this.parent.getStartEndTime(this.parent.options.workHours.start);
        let currDateTime: number = this.isWorkDay(this.parent.options.selectedDate) && this.parent.options.workHours.highlight &&
            !isNullOrUndefined(start) ? new Date(+this.parent.options.selectedDate).setHours(start.getHours(), start.getMinutes(), 0, 0)
            : new Date(+this.parent.options.selectedDate).setHours(0, 0, 0, 0);
        let queryString: string = '[data-date="' + this.parent.getMsFromDate(new Date(currDateTime)) + '"]';
        let firstWorkHourCell: HTMLElement = this.element.querySelector(queryString) as HTMLElement;
        if (firstWorkHourCell) {
            this.getContentAreaElement().scrollLeft = firstWorkHourCell.offsetLeft;
        }
    }
    public scrollToHour(hour: string, scrollDate: Date): void {
        let date: Date;
        let index: number;
        if (scrollDate) {
            index = this.parent.getIndexOfDate(this.renderDates, this.parent.resetTime(scrollDate));
            if (index >= 0) {
                let timeString: string[] = hour.split(':');
                if (timeString.length === 2) {
                    date = new Date(scrollDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0));
                }
            }
        }
        date = isNullOrUndefined(scrollDate) ? this.parent.getStartEndTime(hour) : date;
        if (isNullOrUndefined(date)) {
            return;
        }
        this.getContentAreaElement().scrollLeft =
            isNullOrUndefined(scrollDate) ? this.getLeftFromDateTime(null, date) : this.getLeftFromDateTime([index], date);
    }
    public changeCurrentTimePosition(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeCurrentTimeIndicatorElements();
        let currentDateIndex: number[] = this.getCurrentTimeIndicatorIndex();
        let left: number = this.getLeftFromDateTime(currentDateIndex, this.parent.getCurrentTime());
        let height: number = (this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement).offsetHeight;
        let headerWrap: Element = this.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS);
        let contentWrap: Element = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        contentWrap.appendChild(createElement('div', {
            className: cls.CURRENT_TIMELINE_CLASS,
            styles: (this.parent.options.enableRtl ? 'right' : 'left') + ':' + formatUnit(left) + '; height:' + formatUnit(height)
        }));
        if (this.parent.virtualScrollModule) {
            let timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
            let element: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table');
            setStyleAttribute(timeIndicator, {
                transform: element.style.transform
            });
        }
        let currentTimeEle: HTMLElement = createElement('div', {
            innerHTML: this.parent.getTimeString(this.parent.getCurrentTime()),
            className: cls.CURRENT_TIME_CLASS
        });
        headerWrap.appendChild(currentTimeEle);
        currentTimeEle.style[this.parent.options.enableRtl ? 'right' : 'left'] = formatUnit(left - (currentTimeEle.offsetWidth / 2));
    }
    private getLeftFromDateTime(currentDateIndex: number[], date: Date): number {
        let startHour: Date = this.getStartHour();
        let endHour: Date = this.getEndHour();
        let diffInDates: number = 0;
        let diffInMinutes: number = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        if (!isNullOrUndefined(currentDateIndex)) {
            let end: number = (endHour.getHours() === 0) ? 24 : endHour.getHours();
            if (currentDateIndex[0] !== 0) {
                diffInDates = (currentDateIndex[0]) * ((end - startHour.getHours()) * 60) + (endHour.getMinutes() - startHour.getMinutes());
            }
            diffInMinutes = diffInDates + diffInMinutes;
        }
        return (diffInMinutes * this.getWorkCellWidth() * this.parent.activeViewOptions.timeScale.slotCount) /
            this.parent.activeViewOptions.timeScale.interval;
    }
    private getWorkCellWidth(): number {
        return (this.element.querySelector('.e-work-cells') as HTMLElement).getBoundingClientRect().width;
    }
    public getCurrentTimeIndicatorIndex(): number[] {
        let currentDateIndex: number[] = [];
        let index: number = this.parent.getIndexOfDate(this.renderDates, this.parent.resetTime(this.parent.getCurrentTime()));
        if (index >= 0) {
            currentDateIndex.push(index);
        }
        return currentDateIndex;
    }
    public renderEvents(): void {
        // if (this.parent.activeViewOptions.timeScale.enable) {
        //     let appointment: TimelineEvent = new TimelineEvent(this.parent, 'hour');
        //     appointment.renderAppointments();
        // } else {
        //     let appointment: TimelineEvent = new TimelineEvent(this.parent, 'day');
        //     appointment.renderAppointments();
     }

    public onDataReady(): void {
        if (this.parent.activeViewOptions.timeScale.enable) {
            let appointment: TimelineEvent = new TimelineEvent(this.parent, 'hour');
            appointment.renderAppointments();
        } else {
            let appointment: TimelineEvent = new TimelineEvent(this.parent, 'day');
            appointment.renderAppointments();
        }
    }
}