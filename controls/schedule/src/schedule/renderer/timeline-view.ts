import { isNullOrUndefined, createElement, prepend, extend, formatUnit, append, setStyleAttribute } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { VerticalView } from './vertical-view';
import { TimelineEvent } from '../event-renderer/timeline-view';
import { TdData, TimeSlotData } from '../base/interface';
import { TimelineHeaderRow } from './timeline-header-row';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * timeline view
 */
export class TimelineViews extends VerticalView {
    constructor(parent: Schedule) {
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
        let start: Date = this.parent.getStartEndTime(this.parent.workHours.start);
        let currDateTime: number = this.isWorkDay(this.parent.selectedDate) && this.parent.workHours.highlight &&
            !isNullOrUndefined(start) ? new Date(+this.parent.selectedDate).setHours(start.getHours(), start.getMinutes(), 0, 0)
            : new Date(+this.parent.selectedDate).setHours(0, 0, 0, 0);
        let queryString: string = '[data-date="' + this.parent.getMsFromDate(new Date(currDateTime)) + '"]';
        let firstWorkHourCell: HTMLElement = this.element.querySelector(queryString) as HTMLElement;
        if (firstWorkHourCell) {
            this.getScrollableElement().scrollLeft = firstWorkHourCell.offsetLeft;
        }
    }
    public scrollToHour(hour: string, scrollDate: Date): void {
        let date: Date;
        let index: number;
        if (scrollDate) {
            index = this.parent.getIndexOfDate(this.renderDates, util.resetTime(scrollDate));
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
        this.getScrollableElement().scrollLeft =
            isNullOrUndefined(scrollDate) ? this.getLeftFromDateTime(null, date) : this.getLeftFromDateTime([index], date);
    }
    public generateColumnLevels(): TdData[][] {
        let levels: TdData[][] = [];
        let dateSlots: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        levels.push(dateSlots);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.generateResourceLevels(dateSlots, !this.parent.uiStateValues.isGroupAdaptive);
        }
        let hourSlots: TdData[] = [];
        if (this.parent.activeViewOptions.timeScale.enable) {
            hourSlots = this.generateTimeSlots(levels[levels.length - 1]);
            levels.push(hourSlots);
        }
        if (this.parent.activeViewOptions.headerRows.length > 0) {
            let renderGn: TimelineHeaderRow = new TimelineHeaderRow(this.parent, this.renderDates);
            levels = renderGn.generateColumnLevels(dateSlots, hourSlots);
        }
        return levels;
    }
    private generateTimeSlots(dateSlots: TdData[]): TdData[] {
        let handler: Function = (r: TimeSlotData): TimeSlotData => {
            r.type = r.first ? 'majorSlot' : 'minorSlot';
            r.className = r.first ? [cls.TIME_SLOT_CLASS] : [cls.TIME_SLOT_CLASS, cls.TIME_CELLS_CLASS];
            r.workDays = this.parent.activeViewOptions.workDays;
            return r;
        };
        let timeSlotData: TimeSlotData[] = this.getTimeSlotRows(handler);
        let slots: TdData[] = [];
        for (let data of dateSlots) {
            data.colSpan = timeSlotData.length;
            let tempTimeSlots: TdData[] = <TdData[]>extend([], timeSlotData, null, true);
            for (let slot of tempTimeSlots) {
                let cellDate: Date = util.resetTime(new Date('' + data.date));
                slot.date = util.setTime(cellDate, util.getDateInMs(slot.date));
                slots.push(slot);
            }
        }
        return slots;
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
            styles: (this.parent.enableRtl ? 'right' : 'left') + ':' + formatUnit(left) + '; height:' + formatUnit(height)
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
        currentTimeEle.style[this.parent.enableRtl ? 'right' : 'left'] = formatUnit(left - (currentTimeEle.offsetWidth / 2));
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
    public renderHeader(): void {
        let tr: Element = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
        let dateTd: Element = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    }
    public createAllDayRow(table: Element, tdData: TdData[]): void {
        // For current time indicator wrapper
    }
    public getCurrentTimeIndicatorIndex(): number[] {
        let currentDateIndex: number[] = [];
        let index: number = this.parent.getIndexOfDate(this.renderDates, util.resetTime(this.parent.getCurrentTime()));
        if (index >= 0) {
            currentDateIndex.push(index);
        }
        return currentDateIndex;
    }
    public renderContent(): void {
        let tr: Element = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            let resTd: Element = createElement('td');
            resTd.appendChild(this.parent.resourceBase.createResourceColumn());
            tr.appendChild(resTd);
        }
        let workTd: Element = createElement('td');
        let wrap: Element = this.renderContentArea();
        wrap.appendChild(this.createEventTable(this.getRowCount()));
        this.collapseRows(wrap);
        workTd.appendChild(wrap);
        tr.appendChild(workTd);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.renderVirtualTrack(wrap);
        }
        this.element.querySelector('tbody').appendChild(tr);
    }
    private getRowCount(): number {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return this.parent.resourceBase.renderedResources.length;
        }
        return 1;
    }
    private getResourceTdData(i: number, tdData: TdData): TdData {
        let resLevel: TdData = this.parent.resourceBase.renderedResources[i];
        let resSHr: string = (resLevel.resourceData[resLevel.resource.startHourField] as string) || this.parent.workHours.start;
        let resEHr: string = (resLevel.resourceData[resLevel.resource.endHourField] as string) || this.parent.workHours.end;
        tdData.startHour = this.parent.getStartEndTime(resSHr);
        tdData.endHour = this.parent.getStartEndTime(resEHr);
        tdData.workDays = (resLevel.resourceData[resLevel.resource.workDaysField] as number[]) || this.parent.workDays;
        tdData.className = resLevel.className;
        tdData.groupIndex = resLevel.groupIndex;
        tdData.groupOrder = resLevel.groupOrder;
        return tdData;
    }
    public renderContentTable(table: Element): void {
        let tBody: Element = table.querySelector('tbody');
        append(this.getContentRows(), tBody);
    }
    public getContentRows(): Element[] {
        let rows: Element[] = [];
        let tr: Element = createElement('tr', { attrs: { role: 'row' } });
        let td: Element = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        let trCount: number = this.getRowCount();
        for (let i: number = 0; i < trCount; i++) {
            let ntr: Element = tr.cloneNode() as Element;
            for (let tdData of this.colLevels[this.colLevels.length - 1]) {
                if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    tdData = this.getResourceTdData(i, tdData);
                }
                let ntd: Element = this.createContentTd(tdData, <TimeSlotData>tdData, td);
                ntr.appendChild(ntd);
            }
            rows.push(ntr);
        }
        return rows;
    }
    public getContentTdClass(r: TimeSlotData): string[] {
        return (r.first || !this.parent.activeViewOptions.timeScale.enable) ? [cls.WORK_CELLS_CLASS] :
            [cls.WORK_CELLS_CLASS, cls.ALTERNATE_CELLS_CLASS];
    }
    public renderEvents(): void {
        if (this.parent.activeViewOptions.timeScale.enable) {
            let appointment: TimelineEvent = new TimelineEvent(this.parent, 'hour');
            appointment.renderAppointments();
        } else {
            let appointment: TimelineEvent = new TimelineEvent(this.parent, 'day');
            appointment.renderAppointments();
        }
        this.parent.notify(event.eventsLoaded, {});
    }

    protected getModuleName(): string {
        return 'timelineViews';
    }
}