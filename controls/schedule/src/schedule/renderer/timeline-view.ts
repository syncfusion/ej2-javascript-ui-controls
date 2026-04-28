import { isNullOrUndefined, createElement, prepend, extend, formatUnit, append, setStyleAttribute } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { VerticalView } from './vertical-view';
import { TimelineEvent } from '../event-renderer/timeline-view';
import { CallbackFunction, TdData, TimeSlotData } from '../base/interface';
import { TimelineHeaderRow } from './timeline-header-row';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * timeline views
 */
export class TimelineViews extends VerticalView {
    private timelineAppointment: TimelineEvent = null;

    constructor(parent: Schedule) {
        super(parent);
        this.baseCssClass = 'e-timeline-view';
    }

    protected getModuleName(): string {
        return 'timelineViews';
    }

    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
    }

    public scrollTopPanel(target: HTMLElement): void {
        super.scrollTopPanel(target);
        this.scrollHeaderLabels(target);
    }

    public scrollToWorkHour(): void {
        const start: Date = this.parent.getStartEndTime(this.parent.workHours.start);
        const currDateTime: number = this.isWorkDay(this.parent.selectedDate) && this.parent.workHours.highlight &&
            !isNullOrUndefined(start) ? new Date(+this.parent.selectedDate).setHours(start.getHours(), start.getMinutes(), 0, 0)
            : new Date(+this.parent.selectedDate).setHours(0, 0, 0, 0);
        const queryString: string = '[data-date="' + new Date(currDateTime).getTime().toString() + '"]';
        const firstWorkHourCell: HTMLElement = this.element.querySelector(queryString) as HTMLElement;
        if (firstWorkHourCell) {
            this.getContentAreaElement().scrollLeft = !this.parent.enableRtl ? firstWorkHourCell.offsetLeft :
                -(this.parent.getContentTable().offsetWidth - firstWorkHourCell.offsetLeft - firstWorkHourCell.offsetWidth);
        }
    }

    public scrollToHour(hour: string, scrollDate: Date): void {
        let date: Date;
        let index: number;
        if (scrollDate) {
            index = this.parent.getIndexOfDate(this.renderDates, util.resetTime(scrollDate));
            if (index >= 0) {
                date = scrollDate;
                if (!isNullOrUndefined(hour)) {
                    const timeString: string[] = hour.split(':');
                    if (timeString.length === 2) {
                        date = new Date(scrollDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0));
                    }
                }
            }
        }
        date = isNullOrUndefined(scrollDate) ? this.parent.getStartEndTime(hour) : date;
        if (isNullOrUndefined(date)) {
            return;
        }
        let scrollLeft: number;
        if (isNullOrUndefined(hour) || !this.parent.activeViewOptions.timeScale.enable) {
            scrollLeft = index * this.parent.getElementWidth(this.element.querySelector('.e-work-cells'));
        } else {
            scrollLeft = isNullOrUndefined(scrollDate) ? this.getLeftFromDateTime(null, date) :
                this.getLeftFromDateTime([index], date);
        }
        this.getScrollableElement().scrollLeft = !this.parent.enableRtl ? scrollLeft : -scrollLeft;
    }

    public generateColumnLevels(): TdData[][] {
        let levels: TdData[][] = [];
        const dateSlots: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
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
            const renderGn: TimelineHeaderRow = new TimelineHeaderRow(this.parent, this.renderDates);
            levels = renderGn.generateColumnLevels(dateSlots, hourSlots);
        }
        return levels;
    }

    private generateTimeSlots(dateSlots: TdData[]): TdData[] {
        const handler: CallbackFunction = (r: TimeSlotData): TimeSlotData => {
            r.type = r.first ? 'majorSlot' : 'minorSlot';
            r.className = r.first ? [cls.TIME_SLOT_CLASS] : [cls.TIME_SLOT_CLASS, cls.TIME_CELLS_CLASS];
            r.workDays = this.parent.activeViewOptions.workDays;
            return r;
        };
        const timeSlotData: TimeSlotData[] = this.getTimeSlotRows(handler);
        const slots: TdData[] = [];
        for (const data of dateSlots) {
            data.colSpan = timeSlotData.length;
            const tempTimeSlots: TdData[] = <TdData[]>extend([], timeSlotData, null, true);
            for (const slot of tempTimeSlots) {
                const cellDate: Date = util.resetTime(new Date('' + data.date));
                slot.date = util.setTime(cellDate, util.getDateInMs(slot.date));
                slots.push(slot);
            }
        }
        return slots;
    }

    public changeCurrentTimePosition(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.removeCurrentTimeIndicatorElements();
        const currentDateIndex: number[] = this.getCurrentTimeIndicatorIndex();
        const left: number = this.getLeftFromDateTime(currentDateIndex, this.parent.getCurrentTime());
        const height: number = (this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement).offsetHeight;
        const headerWrap: Element = this.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS);
        const contentWrap: Element = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        contentWrap.appendChild(createElement('div', {
            className: cls.CURRENT_TIMELINE_CLASS,
            styles: (this.parent.enableRtl ? 'right' : 'left') + ':' + formatUnit(left) + '; height:' + formatUnit(height)
        }));
        if (this.parent.virtualScrollModule) {
            const timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
            const element: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table');
            setStyleAttribute(timeIndicator, {
                transform: element.style.transform
            });
        }
        const currentTimeEle: HTMLElement = createElement('div', {
            innerHTML: this.parent.getTimeString(this.parent.getCurrentTime()),
            className: cls.CURRENT_TIME_CLASS
        });
        headerWrap.appendChild(currentTimeEle);
        currentTimeEle.style[this.parent.enableRtl ? 'right' : 'left'] = formatUnit(left - (currentTimeEle.offsetWidth / 2));
    }

    private getLeftFromDateTime(currentDateIndex: number[], date: Date): number {
        const startHour: Date = this.getStartHour();
        const endHour: Date = this.getEndHour();
        let diffInDates: number = 0;
        let diffInMinutes: number = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        const hoursRange: { [key: string]: Date } =
            util.getStartEndHours(util.resetTime(new Date(date.getTime())), startHour, endHour);
        const totalMinutes: number = (hoursRange.endHour.getTime() - hoursRange.startHour.getTime()) / util.MS_PER_MINUTE;
        const timescaleInterval: number = this.parent.activeViewOptions.timeScale.interval;
        let interval: number = 0;
        if (startHour.getHours() === 0 && startHour.getMinutes() === 0 && endHour.getHours() === 0 && endHour.getMinutes() === 0) {
            interval = timescaleInterval;
        } else {
            interval = (this.parent.activeViewOptions.timeScale.slotCount !== 1) ? timescaleInterval :
                (timescaleInterval > totalMinutes ? totalMinutes : timescaleInterval);
        }
        if (!isNullOrUndefined(currentDateIndex)) {
            if (currentDateIndex[0] !== 0) {
                const index: number = this.parent.activeView.colLevels.findIndex((level: TdData[]) => level[0].type === 'dateHeader');
                if (this.parent.activeView.colLevels[parseInt(index.toString(), 10)] &&
                    this.parent.activeView.colLevels[parseInt(index.toString(), 10)][0].colSpan) {
                    diffInDates = currentDateIndex[0] * this.parent.activeView.colLevels[parseInt(index.toString(), 10)][0].colSpan *
                        this.parent.getElementWidth(this.element.querySelector('.e-work-cells'));
                }
                else {
                    const endHour: Date = this.getEndHour();
                    const end: number = (endHour.getHours() === 0) ? 24 : endHour.getHours();
                    diffInMinutes = diffInMinutes + ((currentDateIndex[0]) * (((end - startHour.getHours()) * 60) +
                        (endHour.getMinutes() - startHour.getMinutes())));
                }
            }
        }
        return diffInDates + ((diffInMinutes * this.parent.getElementWidth(this.element.querySelector('.e-work-cells'))
            * this.parent.activeViewOptions.timeScale.slotCount) / interval);
    }

    public renderHeader(): void {
        const tr: Element = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
        const dateTd: Element = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public createAllDayRow(table: Element, tdData: TdData[]): void { /** */ }

    public getCurrentTimeIndicatorIndex(): number[] {
        const currentDateIndex: number[] = [];
        const index: number = this.parent.getIndexOfDate(this.renderDates, util.resetTime(this.parent.getCurrentTime()));
        if (index >= 0) {
            currentDateIndex.push(index);
        }
        return currentDateIndex;
    }

    public renderContent(): void {
        const tr: Element = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            const resTd: Element = createElement('td');
            resTd.appendChild(this.parent.resourceBase.createResourceColumn());
            tr.appendChild(resTd);
        }
        const workTd: Element = createElement('td');
        const wrap: Element = this.renderContentArea();
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
        const resLevel: TdData = this.parent.resourceBase.renderedResources[parseInt(i.toString(), 10)];
        const resSHr: string = (resLevel.resourceData[resLevel.resource.startHourField] as string) || this.parent.workHours.start;
        const resEHr: string = (resLevel.resourceData[resLevel.resource.endHourField] as string) || this.parent.workHours.end;
        tdData.startHour = this.parent.getStartEndTime(resSHr);
        tdData.endHour = this.parent.getStartEndTime(resEHr);
        tdData.workDays = (resLevel.resourceData[resLevel.resource.workDaysField] as number[]) || this.parent.workDays;
        tdData.className = resLevel.className;
        tdData.groupIndex = resLevel.groupIndex;
        tdData.groupOrder = resLevel.groupOrder;
        return tdData;
    }

    public renderContentTable(table: Element): void {
        const tBody: Element = table.querySelector('tbody');
        append(this.getContentRows(), tBody);
    }

    public getContentRows(): Element[] {
        const rows: Element[] = [];
        const tr: Element = createElement('tr');
        const td: Element = createElement('td');
        const trCount: number = this.getRowCount();
        const existingGroupIndices: number[] = this.getGroupIndices();
        for (let i: number = 0; i < trCount; i++) {
            if (existingGroupIndices.length > 0 &&
                existingGroupIndices.indexOf(this.parent.resourceBase.renderedResources[parseInt(i.toString(), 10)].groupIndex) > -1) {
                continue;
            }
            const ntr: Element = tr.cloneNode() as Element;
            for (let tdData of this.colLevels[this.colLevels.length - 1]) {
                if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    tdData = this.getResourceTdData(i, tdData);
                }
                const ntd: Element = this.createContentTd(tdData, <TimeSlotData>tdData, td);
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
        this.timelineAppointment = new TimelineEvent(this.parent, this.parent.activeViewOptions.timeScale.enable ? 'hour' : 'day');
        this.timelineAppointment.renderAppointments();
        this.parent.notify(event.eventsLoaded, {});
    }

    public getAdjustedDate(date: Date): Date {
        if (!this.parent.activeViewOptions.timeScale.enable) {
            return new Date(date.setHours(0, 0, 0, 0));
        } else {
            const timeSlots: TdData[] = this.colLevels[this.colLevels.length - 1];
            for (let i: number = 0; i < timeSlots.length; i++) {
                if (timeSlots[parseInt(i.toString(), 10)].date.getTime() > date.getTime()) {
                    return timeSlots[i - 1].date;
                }
            }
        }
        return null;
    }

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            this.parent = null;
            return;
        }
        if (this.timelineAppointment) {
            this.timelineAppointment.destroy();
            this.timelineAppointment = null;
        }
        super.destroy();
    }

}
