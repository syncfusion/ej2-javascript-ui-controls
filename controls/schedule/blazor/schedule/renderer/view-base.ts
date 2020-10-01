import { isNullOrUndefined, setStyleAttribute, formatUnit } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { NotifyEventArgs } from '../base/interface';

/**
 * view base
 */
export class ViewBase {
    public element: HTMLElement;
    public parent: SfSchedule;
    public renderDates: Date[];
    constructor(parent: SfSchedule) {
        this.parent = parent;
    }
    public onDataReady(args: NotifyEventArgs): void {
       // Need for events positioning
    }
    public getScrollXIndent(content: HTMLElement): number {
        return content.offsetHeight - content.clientHeight > 0 ? util.getScrollBarWidth() : 0;
    }
    public scrollTopPanel(target: HTMLElement): void {
        (this.getDatesHeaderElement().firstElementChild as Element).scrollLeft = target.scrollLeft;
    }
    public scrollHeaderLabels(target: HTMLElement): void {
        let headerTable: HTMLElement = this.element.querySelector('.e-date-header-wrap table') as HTMLElement;
        let colWidth: number = headerTable.offsetWidth / headerTable.querySelectorAll('colgroup col').length;
        let applyLeft: Function = (headerCells: HTMLElement[], isRtl: boolean) => {
            let currentCell: HTMLElement;
            let tdLeft: number = 0;
            let colSpan: number = 0;
            let hiddenLeft: number = isRtl ? target.scrollWidth - target.offsetWidth - target.scrollLeft : target.scrollLeft;
            for (let cell of headerCells) {
                colSpan += parseInt(cell.getAttribute('colSpan'), 10);
                if (colSpan > Math.floor(hiddenLeft / colWidth)) {
                    currentCell = cell;
                    break;
                }
                tdLeft += cell.offsetWidth;
            }
            (currentCell.children[0] as HTMLElement).style[isRtl ? 'right' : 'left'] = (hiddenLeft - tdLeft) + 'px';
        };
        let classNames: string[] = ['.e-header-year-cell', '.e-header-month-cell', '.e-header-week-cell', '.e-header-cells'];
        for (let className of classNames) {
            let headerCells: HTMLElement[] = [].slice.call(this.element.querySelectorAll(className));
            if (headerCells.length > 0) {
                for (let element of headerCells) {
                    (element.children[0] as HTMLElement).style[this.parent.options.enableRtl ? 'right' : 'left'] = '';
                }
                applyLeft(headerCells, this.parent.options.enableRtl);
            }
        }
    }
    public getHeaderBarHeight(includeResHeight: boolean = false): number {
        let headerBarHeight: number = 2;
        let headerBar: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_TOOLBAR) as HTMLElement;
        if (headerBar) {
            headerBarHeight += util.getOuterHeight(headerBar);
        }
        if (this.parent.uiStateValues.isGroupAdaptive || includeResHeight) {
            let resHeader: HTMLElement = (<HTMLElement>this.parent.element.querySelector('.' + cls.RESOURCE_HEADER_TOOLBAR));
            if (resHeader) {
                headerBarHeight += resHeader.offsetHeight;
            }
        }
        return headerBarHeight;
    }

    public getDatesHeaderElement(): HTMLElement {
        return this.element.querySelector('.' + cls.DATE_HEADER_CONTAINER_CLASS) as HTMLElement;
    }

    public highlightCurrentTime(): void {
        // Here showTimeIndicator functionalities
    }
    public getStartHour(): Date {
        let startHour: Date = this.parent.getStartEndTime(this.parent.activeViewOptions.startHour);
        if (isNullOrUndefined(startHour)) {
            startHour = new Date(2000, 0, 0, 0);
        }
        return startHour;
    }
    public getEndHour(): Date {
        let endHour: Date = this.parent.getStartEndTime(this.parent.activeViewOptions.endHour);
        if (isNullOrUndefined(endHour)) {
            endHour = new Date(2000, 0, 0, 0);
        }
        return endHour;
    }
    public isCurrentDate(date: Date): boolean {
        return date.setHours(0, 0, 0, 0) === this.parent.getCurrentTime().setHours(0, 0, 0, 0);
    }
    public isCurrentMonth(date: Date): boolean {
        return date.getFullYear() ===
            this.parent.getCurrentTime().getFullYear() && date.getMonth() === this.parent.getCurrentTime().getMonth();
    }
    public isWorkDay(date: Date, workDays: number[] = this.parent.activeViewOptions.workDays): boolean {
        if (workDays.indexOf(date.getDay()) >= 0) {
            return true;
        }
        return false;
    }
    public isWorkHour(date: Date, startHour: Date, endHour: Date, workDays: number[]): boolean {
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour)) {
            return false;
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        return !(util.getDateInMs(date) < util.getDateInMs(startHour) || util.getDateInMs(date) >= util.getDateInMs(endHour) ||
            !this.isWorkDay(date, workDays));
    }
    public getRenderDates(workDays?: number[]): Date[] {
        let renderDates: Date[] = [];
        // Due to same code for vertical and time line, week & work week views, if condition has used
        if (this.parent.options.currentView === 'Week' || this.parent.options.currentView === 'TimelineWeek') {
            let selectedDate: Date = util.resetTime(this.parent.options.selectedDate);
            let start: Date = util.getWeekFirstDate(selectedDate, this.parent.activeViewOptions.firstDayOfWeek);
            for (let i: number = 0, length: number = util.WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length; i++) {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                } else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = util.addDays(start, 1);
            }
        } else if (this.parent.options.currentView === 'WorkWeek' || this.parent.options.currentView === 'TimelineWorkWeek') {
            let date: Date = util.resetTime(this.parent.options.selectedDate);
            let start: Date = util.getWeekFirstDate(date, this.parent.activeViewOptions.firstDayOfWeek);
            for (let i: number = 0, length: number = util.WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length; i++) {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
                start = util.addDays(start, 1);
            }
        } else {
            let start: Date = util.resetTime(this.parent.options.selectedDate);
            do {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                } else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = util.addDays(start, 1);
            } while (this.parent.activeViewOptions.interval !== renderDates.length);
        }
        if (!workDays) {
            this.renderDates = renderDates;
        }
        return renderDates;
    }

    private getColElements(): HTMLElement[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS + ' col, .' + cls.DATE_HEADER_WRAP_CLASS + ' col'));
    }

    public setColWidth(content: HTMLElement): void {
        if (this.parent.isTimelineView()) {
            let colElements: HTMLElement[] = this.getColElements();
            let contentBody: HTMLElement = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody') as HTMLElement;
            const colWidth: number = Math.ceil(contentBody.offsetWidth / (colElements.length / 2));
            colElements.forEach((col: HTMLElement) => setStyleAttribute(col, { 'width': formatUnit(colWidth) }));
            if (content.offsetHeight !== content.clientHeight) {
                let leftPanelSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
                let leftPanel: HTMLElement = this.parent.element.querySelector(leftPanelSelector);
                if (!isNullOrUndefined(leftPanel)) {
                    setStyleAttribute(leftPanel, { 'height': formatUnit(content.clientHeight) });
                }
            }
        }
    }

    public resetColWidth(): void {
        let colElements: HTMLElement[] = this.getColElements();
        for (let col of colElements) {
            col.style.width = '';
        }
    }

    public getContentAreaElement(): HTMLElement {
        return this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
    }

    public scrollToDate(scrollDate: Date): void {
        if (['Month', 'TimelineMonth'].indexOf(this.parent.options.currentView) === -1 || isNullOrUndefined(scrollDate)) {
            return;
        }
        let scrollWrap: HTMLElement = this.getContentAreaElement();
        let tdDate: number = this.parent.getMsFromDate(new Date(util.resetTime(new Date(+scrollDate)).getTime()));
        let dateElement: HTMLElement = scrollWrap.querySelector(`.${cls.WORK_CELLS_CLASS}[data-date="${tdDate}"]`) as HTMLElement;
        if (this.parent.options.currentView === 'Month' && dateElement) {
            scrollWrap.scrollTop = dateElement.offsetTop;
        }
        if (this.parent.options.currentView === 'TimelineMonth' && dateElement) {
            scrollWrap.scrollLeft = dateElement.offsetLeft;
        }
    }

    public getPanel(): HTMLElement {
        return this.element;
    }
}