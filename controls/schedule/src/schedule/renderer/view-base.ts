import { createElement, append, prepend, isNullOrUndefined, getValue, getDefaultDateObject, cldrData, Internationalization, addClass }
    from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { getDateInMs, addDays, resetTime, WEEK_LENGTH, getWeekFirstDate, getOuterHeight, getScrollBarWidth } from '../base/util';
import { TdData, ResourceDetails } from '../base/interface';
import * as cls from '../base/css-constant';

/**
 * view base
 */
export class ViewBase {
    public element: HTMLElement;
    public parent: Schedule;
    public renderDates: Date[];
    public colLevels: TdData[][];
    public customHelper: Object = {
        getDayName: (dt: Date) => {
            return this.parent.getDayNames('abbreviated')[dt.getDay()];
        },
        getDate: (dt: Date) => {
            return this.parent.globalize.formatDate(dt, { format: 'd' });
        },
        getTime: (dt: Date) => {
            if (this.parent.isAdaptive) {
                return this.parent.globalize.formatDate(dt, { skeleton: 'h' });
            }
            return this.parent.getTimeString(dt);
        },
        getTimelineDate: (dt: Date) => {
            return this.parent.globalize.formatDate(dt, { skeleton: 'MMMd' }) + ', ' + this.parent.getDayNames('wide')[dt.getDay()];
        }
    };
    /**
     * Constructor
     */
    constructor(parent: Schedule) {
        this.parent = parent;
    }
    public isTimelineView(): boolean {
        return this.parent.currentView.indexOf('Timeline') !== -1;
    }
    public createEventTable(trCount: number): Element {
        let eventTable: Element = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        for (let row: number = 0; row < trCount; row++) {
            eventTable.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
        }
        return eventTable;
    }
    public collapseRows(wrap: Element): void {
        if (!this.isTimelineView()) {
            return;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.hideResourceRows(wrap.querySelector('tbody'));
            this.parent.resourceBase.hideResourceRows(wrap.querySelector('.' + cls.EVENT_TABLE_CLASS));
        }
    }
    public createTableLayout(className?: string): Element {
        let clsName: string = className || '';
        let table: Element = createElement('table', { className: cls.SCHEDULE_TABLE_CLASS + ' ' + clsName });
        let tbody: Element = createElement('tbody');
        table.appendChild(tbody);
        return table;
    }
    public createColGroup(table: Element, lastRow: TdData[]): void {
        let length: number = lastRow.length;
        if (lastRow[0].colSpan) {
            length = lastRow.map((value: TdData) => value.colSpan).reduce((prev: number, next: number) => prev + next);
        }
        let colGroupEle: Element = createElement('colgroup');
        for (let i: number = 0; i < length; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        prepend([colGroupEle], table);
    }
    public getScrollXIndent(content: HTMLElement): number {
        return content.offsetHeight - content.clientHeight > 0 ? getScrollBarWidth() : 0;
    }
    public scrollTopPanel(target: HTMLElement): void {
        (this.getDatesHeaderElement().firstChild as Element).scrollLeft = target.scrollLeft;
    }
    public scrollHeaderLabels(target: HTMLElement): void {
        let headerTable: HTMLElement = this.element.querySelector('.e-date-header-wrap table') as HTMLElement;
        let colWidth: number = headerTable.offsetWidth / headerTable.querySelectorAll('colgroup col').length;
        let applyLeft: Function = (headerCells: HTMLElement[], isRtl: boolean) => {
            let currentCell: HTMLElement;
            let tdLeft: number = 0;
            let colSpan: number = 0;
            let hiddenLeft: number = isRtl ? target.scrollWidth - target.offsetWidth - target.scrollLeft : target.scrollLeft;
            for (let i: number = 0; i < headerCells.length; i++) {
                colSpan += parseInt(headerCells[i].getAttribute('colSpan'), 10);
                if (colSpan > Math.floor(hiddenLeft / colWidth)) {
                    currentCell = headerCells[i];
                    break;
                }
                tdLeft += headerCells[i].offsetWidth;
            }
            (currentCell.children[0] as HTMLElement).style[isRtl ? 'right' : 'left'] = (hiddenLeft - tdLeft) + 'px';
        };
        let className: string[] = ['.e-header-year-cell', '.e-header-month-cell', '.e-header-week-cell', '.e-header-cells'];
        for (let i: number = 0; i < className.length; i++) {
            let headerCells: HTMLElement[] = [].slice.call(this.element.querySelectorAll(className[i]));
            if (headerCells.length > 0) {
                headerCells.forEach((element: HTMLElement) => {
                    (element.children[0] as HTMLElement).style[this.parent.enableRtl ? 'right' : 'left'] = '';
                });
                applyLeft(headerCells, this.parent.enableRtl);
            }
        }
    }
    public addAttributes(td: TdData, element: Element): void {
        if (td.template) { append(td.template, element); }
        if (td.colSpan) { element.setAttribute('colspan', td.colSpan.toString()); }
        if (td.className) { addClass([element], td.className); }
    }
    public getHeaderBarHeight(): number {
        let headerBarHeight: number = 2;
        if (this.parent.headerModule) {
            headerBarHeight += getOuterHeight(this.parent.headerModule.getHeaderElement());
        }
        if (this.parent.uiStateValues.isGroupAdaptive) {
            headerBarHeight += (<HTMLElement>this.parent.element.querySelector('.' + cls.RESOURCE_HEADER_TOOLBAR)).offsetHeight;
        }
        return headerBarHeight;
    }
    public renderPanel(type: string): void {
        if (type === cls.PREVIOUS_PANEL_CLASS) {
            prepend([this.element], this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS));
        } else {
            this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(this.element);
        }
    }
    public setPanel(panel: HTMLElement): void {
        this.element = panel;
    }
    public getPanel(): HTMLElement {
        return this.element;
    }
    public getDatesHeaderElement(): HTMLElement {
        return this.element.querySelector('.' + cls.DATE_HEADER_CONTAINER_CLASS) as HTMLElement;
    }
    public adjustEventWrapper(): void {
        // Here adjust the events wrapper width based in work cells
    }
    public getDateSlots(renderDates: Date[], workDays: number[]): TdData[] {
        // Here getDateSlots only need in vertical and month views
        return [];
    }
    public generateColumnLevels(): TdData[][] {
        // Here generateColumnLevels only need in vertical and month views
        return [];
    }
    public getColumnLevels(): TdData[][] {
        return this.colLevels;
    }
    public highlightCurrentTime(): void {
        // Here showTimeIndicator functionalities
    }
    public startDate(): Date {
        return this.renderDates[0];
    }
    public endDate(): Date {
        return addDays(this.renderDates[this.renderDates.length - 1], 1);
    }
    public getStartHour(): Date {
        let startHour: Date = this.parent.globalize.parseDate(this.parent.activeViewOptions.startHour, { skeleton: 'Hm' });
        if (isNullOrUndefined(startHour)) {
            startHour = new Date(2000, 0, 0, 0);
        }
        return startHour;
    }
    public getEndHour(): Date {
        let endHour: Date = this.parent.globalize.parseDate(this.parent.activeViewOptions.endHour, { skeleton: 'Hm' });
        if (isNullOrUndefined(endHour)) {
            endHour = new Date(2000, 0, 0, 0);
        }
        return endHour;
    }
    public isCurrentDate(date: Date): boolean {
        return date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
    }
    public isCurrentMonth(date: Date): boolean {
        return date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth();
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
        if (getDateInMs(date) < getDateInMs(startHour) || getDateInMs(date) >= getDateInMs(endHour) || !this.isWorkDay(date, workDays)) {
            return false;
        }
        return true;
    }
    public getRenderDates(workDays?: number[]): Date[] {
        let renderDates: Date[] = [];
        // Due to same code for vertical and time line, week & work week views, if condition has used
        if (this.parent.currentView === 'Week' || this.parent.currentView === 'TimelineWeek') {
            let selectedDate: Date = resetTime(this.parent.selectedDate);
            let start: Date = getWeekFirstDate(selectedDate, this.parent.firstDayOfWeek);
            for (let i: number = 0, length: number = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length; i++) {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                } else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = addDays(start, 1);
            }
        } else if (this.parent.currentView === 'WorkWeek' || this.parent.currentView === 'TimelineWorkWeek') {
            let start: Date = getWeekFirstDate(resetTime(this.parent.selectedDate), this.parent.firstDayOfWeek);
            for (let i: number = 0, length: number = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length; i++) {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
                start = addDays(start, 1);
            }
        } else {
            for (let i: number = 0, length: number = this.parent.activeViewOptions.interval; i < length; i++) {
                renderDates.push(addDays(resetTime(this.parent.selectedDate), i));
            }
        }
        if (!workDays) {
            this.renderDates = renderDates;
        }
        return renderDates;
    }
    public getNextPreviousDate(type: string): Date {
        if (this.parent.currentView === 'Day' || this.parent.currentView === 'TimelineDay') {
            let daysCount: number = (type === 'next') ? this.parent.activeViewOptions.interval : -(this.parent.activeViewOptions.interval);
            if (this.parent.activeViewOptions.showWeekend) {
                return addDays(this.parent.selectedDate, daysCount);
            } else {
                let date: Date = addDays(this.parent.selectedDate, daysCount);
                while (!this.isWorkDay(date)) {
                    date = addDays(date, daysCount);
                }
                return date;
            }
        }
        if (type === 'next') {
            return addDays(this.parent.selectedDate, WEEK_LENGTH * this.parent.activeViewOptions.interval);
        } else {
            return addDays(this.parent.selectedDate, -WEEK_LENGTH * this.parent.activeViewOptions.interval);
        }
    }
    public getLabelText(view: string): string {
        return this.parent.localeObj.getConstant(view) + ' of ' +
            this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'long' });
    }
    public getDateRangeText(): string {
        if (this.parent.isAdaptive) {
            return this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM y' });
        }
        return this.formatDateRange(this.renderDates[0], this.renderDates[this.renderDates.length - 1]);
    }
    public formatDateRange(startDate: Date, endDate?: Date): string {
        let globalize: Internationalization = this.parent.globalize;
        if (startDate === endDate) {
            endDate = null;
        }
        if (!isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            if (!endDate) {
                return globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat });
            }
            return globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat }) + ' - ' +
                globalize.formatDate(endDate, { format: this.parent.activeViewOptions.dateFormat });
        }
        let formattedStr: string;
        let longDateFormat: string;
        if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            longDateFormat = getValue('dateFormats.long', getDefaultDateObject());
        } else {
            longDateFormat = getValue('main.' + '' + this.parent.locale + '.dates.calendars.gregorian.dateFormats.long', cldrData);
        }
        if (!endDate) {
            return globalize.formatDate(startDate, { format: longDateFormat });
        }
        let dateFormat: string = longDateFormat.trim().toLocaleLowerCase();
        if (dateFormat.substr(0, 1) === 'd') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd' }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMMM yyyy' });
                } else {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd MMM' }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMM yyyy' });
                }
            } else {
                formattedStr = globalize.formatDate(startDate, { format: 'dd MMM yyyy' }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'dd MMM yyyy' });
            }
        } else if (dateFormat.substr(0, 1) === 'm') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMMM dd' }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd, yyyy' });
                } else {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMM dd' }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'MMM dd, yyyy' });
                }
            } else {
                formattedStr = globalize.formatDate(startDate, { format: 'MMM dd, yyyy' }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'MMM dd, yyyy' });
            }
        } else {
            formattedStr = globalize.formatDate(startDate, { format: longDateFormat }) + ' - ' +
                globalize.formatDate(endDate, { format: longDateFormat });
        }
        return formattedStr;
    }
    public getMobileDateElement(date: Date, className?: string): Element {
        let wrap: Element = createElement('div', {
            className: className,
            innerHTML: '<div class="e-m-date">' + this.parent.globalize.formatDate(date, { format: 'd' }) + '</div>' +
                '<div class="e-m-day">' + this.parent.globalize.formatDate(date, { format: 'E' }) + '</div>'
        });
        return wrap;
    }
    public setResourceHeaderContent(tdElement: Element, tdData: TdData, className: string = 'e-text-ellipsis'): void {
        if (this.parent.activeViewOptions.resourceHeaderTemplate) {
            let data: ResourceDetails = {
                resource: tdData.resource,
                resourceData: tdData.resourceData
            };
            append(this.parent.getResourceHeaderTemplate()(data), tdElement);
        } else {
            tdElement.appendChild(createElement('div', {
                className: className, innerHTML: tdData.resourceData[tdData.resource.textField] as string
            }));
        }
    }

    public renderResourceMobileLayout(): void {
        this.parent.resourceBase.renderResourceHeader();
        this.parent.resourceBase.renderResourceTree();
    }
}