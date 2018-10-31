import { EventHandler, createElement, formatUnit } from '@syncfusion/ej2-base';
import { TdData, NotifyEventArgs } from '../base/interface';
import { Schedule } from '../base/schedule';
import { Month } from './month';
import { TimelineEvent } from '../event-renderer/timeline-view';
import * as util from '../base/util';
import * as cls from '../base/css-constant';
import { TimelineHeaderRow } from './timeline-header-row';

/**
 * timeline month view
 */
export class TimelineMonth extends Month {
    public viewClass: string = 'e-timeline-month-view';
    public isInverseTableSelect: boolean = true;

    /**
     * Constructor for timeline month view
     */
    constructor(parent: Schedule) {
        super(parent);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'timelineMonth';
    }

    public onDataReady(args: NotifyEventArgs): void {
        let appointment: TimelineEvent = new TimelineEvent(this.parent, 'day');
        appointment.renderAppointments();
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
        let dateSlots: TdData[] = [];
        for (let col of renderDates) {
            let classList: string[] = [cls.HEADER_CELLS_CLASS];
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
        let contentTr: Element = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            let resTd: Element = createElement('td');
            resTd.appendChild(this.parent.resourceBase.createResourceColumn());
            contentTr.appendChild(resTd);
        }
        let contentTd: Element = createElement('td');
        this.element.querySelector('tbody').appendChild(contentTr);
        let wrap: HTMLElement = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        wrap.appendChild(this.renderContentArea());
        wrap.appendChild(this.createEventTable(this.getRowCount()));
        this.collapseRows(wrap);
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        contentTd.appendChild(wrap);
        contentTr.appendChild(contentTd);
    }

    private getRowCount(): number {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return this.parent.resourceBase.lastResourceLevel.length;
        }
        return 1;
    }

    public getContentSlots(): TdData[][] {
        let slotDatas: TdData[][] = [];
        for (let row: number = 0; row < this.getRowCount(); row++) {
            for (let data of this.colLevels[this.colLevels.length - 1]) {
                data.className = [cls.WORK_CELLS_CLASS];
                if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    let resLevel: TdData = this.parent.resourceBase.lastResourceLevel[row];
                    data.workDays = (resLevel.resourceData[resLevel.resource.workDaysField] as number[]) || this.parent.workDays;
                    data.className = data.className.concat(resLevel.className);
                    data.groupIndex = resLevel.groupIndex;
                    data.groupOrder = resLevel.groupOrder;
                }
                let slotData: TdData = {
                    date: new Date(+data.date), colSpan: data.colSpan, groupIndex: data.groupIndex, workDays: data.workDays,
                    type: 'monthCells', className: data.className
                };
                if (!slotDatas[row]) {
                    slotDatas[row] = [];
                }
                slotDatas[row].push(slotData);
            }
        }
        return slotDatas;
    }

    public updateClassList(): void {
        // No need to update content for timeline month view
    }

    public unwireEvents(): void {
        EventHandler.remove(this.getContentAreaElement(), 'scroll', this.onContentScroll);
    }

    public getMonthStart(currentDate: Date): Date {
        let monthStart: Date = util.firstDateOfMonth(util.resetTime(currentDate));
        return new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
    }

    public getMonthEnd(currentDate: Date): Date {
        let monthStart: Date = util.firstDateOfMonth(util.resetTime(currentDate));
        return util.lastDateOfMonth(util.addMonths(new Date(+monthStart), this.parent.activeViewOptions.interval - 1));
    }

    public generateColumnLevels(): TdData[][] {
        let colLevels: TdData[][] = [];
        let level: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        colLevels.push(level);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.generateResourceLevels(level, !this.parent.uiStateValues.isGroupAdaptive);
        }
        let hourSlots: TdData[] = [];
        if (this.parent.activeViewOptions.headerRows.length > 0) {
            let renderGn: TimelineHeaderRow = new TimelineHeaderRow(this.parent, this.renderDates);
            colLevels = renderGn.generateColumnLevels(level, hourSlots);
        }
        this.colLevels = colLevels;
        return colLevels;
    }
}