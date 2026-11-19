import { EventHandler, createElement, formatUnit } from '@syncfusion/ej2-base';
import { TdData } from '../base/interface';
import { Schedule } from '../base/schedule';
import { Month } from './month';
import { TimelineEvent } from '../event-renderer/timeline-view';
import { TimelineHeaderRow } from './timeline-header-row';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * timeline month view
 */
export class TimelineMonth extends Month {
    public viewClass: string = 'e-timeline-month-view';
    public isInverseTableSelect: boolean = true;
    private appointment: TimelineEvent = null;

    constructor(parent: Schedule) {
        super(parent);
    }

    protected getModuleName(): string {
        return 'timelineMonth';
    }

    public onDataReady(): void {
        this.appointment = new TimelineEvent(this.parent, 'day');
        this.appointment.renderAppointments();
        this.parent.notify(event.eventsLoaded, {});
    }

    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
    }

    public scrollTopPanel(target: HTMLElement): void {
        super.scrollTopPanel(target);
        this.scrollHeaderLabels(target);
    }

    public setContentHeight(content: HTMLElement, leftPanelElement: HTMLElement, height: number): void {
        if (leftPanelElement) {
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
        content.style.height = formatUnit(height);
    }

    public getDateSlots(renderDates: Date[], workDays: number[]): TdData[] {
        const dateSlots: TdData[] = [];
        for (const col of renderDates) {
            const classList: string[] = [cls.HEADER_CELLS_CLASS];
            if (this.isCurrentDate(col)) {
                classList.push(cls.CURRENT_DAY_CLASS);
            }
            dateSlots.push({ date: col, type: 'dateHeader', className: classList, colSpan: 1, workDays: workDays });
        }
        return dateSlots;
    }

    public renderLeftIndent(tr: Element): void {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
    }

    public renderContent(): void {
        const contentTr: Element = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            const resTd: Element = createElement('td');
            resTd.appendChild(this.parent.resourceBase.createResourceColumn());
            contentTr.appendChild(resTd);
        }
        const contentTd: Element = createElement('td');
        this.element.querySelector('tbody').appendChild(contentTr);
        const wrap: HTMLElement = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        wrap.appendChild(this.renderContentArea());
        wrap.appendChild(this.createEventTable(this.getRowCount()));
        this.collapseRows(wrap);
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        contentTd.appendChild(wrap);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.renderVirtualTrack(wrap);
        }
        contentTr.appendChild(contentTd);
    }

    private getRowCount(): number {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return this.parent.resourceBase.renderedResources.length;
        }
        return 1;
    }

    public getContentSlots(): TdData[][] {
        const slotDatas: TdData[][] = [];
        for (let row: number = 0; row < this.getRowCount(); row++) {
            for (const data of this.colLevels[this.colLevels.length - 1]) {
                data.className = [cls.WORK_CELLS_CLASS];
                if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    const resLevel: TdData = this.parent.resourceBase.renderedResources[parseInt(row.toString(), 10)];
                    data.workDays = (resLevel.resourceData[resLevel.resource.workDaysField] as number[]) || this.parent.workDays;
                    data.className = data.className.concat(resLevel.className);
                    data.groupIndex = resLevel.groupIndex;
                    data.groupOrder = resLevel.groupOrder;
                }
                const slotData: TdData = {
                    date: new Date(+data.date), colSpan: data.colSpan, groupIndex: data.groupIndex, workDays: data.workDays,
                    type: 'monthCells', className: data.className
                };
                if (!slotDatas[parseInt(row.toString(), 10)]) {
                    slotDatas[parseInt(row.toString(), 10)] = [];
                }
                slotDatas[parseInt(row.toString(), 10)].push(slotData);
            }
        }
        return slotDatas;
    }

    public updateClassList(data: TdData): void {
        if (!this.parent.isMinMaxDate(data.date)) {
            data.className.push(cls.DISABLE_DATES);
        }
    }

    public unWireEvents(): void {
        EventHandler.remove(this.getContentAreaElement(), 'scroll', this.onContentScroll);
    }

    public getMonthStart(currentDate: Date): Date {
        const monthStart: Date = this.parent.calendarUtil.firstDateOfMonth(util.resetTime(currentDate));
        return new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
    }

    public getMonthEnd(currentDate: Date): Date {
        const monthStart: Date = this.parent.calendarUtil.firstDateOfMonth(util.resetTime(currentDate));
        return this.parent.calendarUtil.lastDateOfMonth(util.addMonths(new Date(+monthStart), this.parent.activeViewOptions.interval - 1));
    }

    public generateColumnLevels(): TdData[][] {
        let colLevels: TdData[][] = [];
        const level: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        colLevels.push(level);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.generateResourceLevels(level, !this.parent.uiStateValues.isGroupAdaptive);
        }
        const hourSlots: TdData[] = [];
        if (this.parent.activeViewOptions.headerRows.length > 0) {
            const renderGn: TimelineHeaderRow = new TimelineHeaderRow(this.parent, this.renderDates);
            colLevels = renderGn.generateColumnLevels(level, hourSlots);
        }
        this.colLevels = colLevels;
        return colLevels;
    }

    public getAdjustedDate(startTime: Date): Date {
        const timeSlots: TdData[] = this.colLevels[this.colLevels.length - 1];
        for (let i: number = 0; i < timeSlots.length; i++) {
            if (timeSlots[parseInt(i.toString(), 10)].date.getTime() > startTime.getTime()) {
                return timeSlots[i - 1].date;
            }
        }
        return null;
    }

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            this.parent = null;
            return;
        }
        if (this.element) {
            const contentScrollableEle: Element = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            if (contentScrollableEle) {
                EventHandler.remove(contentScrollableEle, 'scroll', this.onContentScroll);
            }
        }
        if (this.appointment) {
            this.appointment.destroy();
            this.appointment = null;
        }
        super.destroy();
    }

}
