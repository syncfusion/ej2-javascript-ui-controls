import {
    createElement, append, prepend, isNullOrUndefined, getValue, getDefaultDateObject,
    cldrData, Internationalization, addClass, setStyleAttribute, formatUnit, isBlazor, EventHandler
} from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import {
    getDateInMs, addDays, resetTime, WEEK_LENGTH, getWeekFirstDate, getOuterHeight, getScrollBarWidth, capitalizeFirstWord
} from '../base/util';
import { TdData, ResourceDetails } from '../base/interface';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * view base
 */

export namespace ViewHelper {
    export const getDayName: Function = (proxy: Schedule, date: Date) => {
        return proxy.getDayNames('abbreviated')[date.getDay()];
    };
    export const getDate: Function = (proxy: Schedule, date: Date) => {
        return proxy.globalize.formatDate(date, { format: 'd', calendar: proxy.getCalendarMode() });
    };
    export const getTime: Function = (proxy: Schedule, date: Date) => {
        if (proxy.isAdaptive) {
            if (proxy.timeFormat === 'HH:mm' || proxy.timeFormat === 'HH.mm') {
                return proxy.globalize.formatDate(date, { format: 'H', calendar: proxy.getCalendarMode() });
            }
            return isBlazor() ?
                proxy.globalize.formatDate(date, { format: 'h', calendar: proxy.getCalendarMode() }) :
                proxy.globalize.formatDate(date, { skeleton: 'h', calendar: proxy.getCalendarMode() });
        }
        return proxy.getTimeString(date);
    };
    export const getTimelineDate: Function = (proxy: Schedule, date: Date) => {
        let skeleton: string = isBlazor() ? 'M' : 'MMMd';
        let text: string = proxy.globalize.formatDate(date, { skeleton: skeleton, calendar: proxy.getCalendarMode() }) + ', ' +
            proxy.getDayNames('wide')[date.getDay()];
        return capitalizeFirstWord(text, 'multiple');
    };
}
export class ViewBase {
    public element: HTMLElement;
    public parent: Schedule;
    public renderDates: Date[];
    public colLevels: TdData[][];
    public viewIndex: number;
    /**
     * Constructor
     */
    constructor(parent: Schedule) {
        this.parent = parent;
    }
    public isTimelineView(): boolean {
        return this.parent.currentView.indexOf('Timeline') !== -1;
    }
    public getContentRows(): Element[] {
        return [];
    }
    public serverRenderLayout(): void {
        // Need only for layout server rendering
    }
    public createEventTable(trCount: number): Element {
        let eventTable: Element = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        append(this.getEventRows(trCount), eventTable);
        return eventTable;
    }
    public getEventRows(trCount: number): Element[] {
        let eventRows: Element[] = [];
        let eventContainer: Element;
        for (let row: number = 0; row < trCount; row++) {
            eventContainer = createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS });
            if (this.parent.resourceBase && !this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.renderedResources) {
                eventContainer.setAttribute('data-group-index', this.parent.resourceBase.renderedResources[row].groupIndex.toString());
            }
            eventRows.push(eventContainer);
        }
        return eventRows;
    }
    public collapseRows(wrap: Element): void {
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
        if (lastRow[0] && lastRow[0].colSpan) {
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
                headerCells.forEach((element: HTMLElement) =>
                    (element.children[0] as HTMLElement).style[this.parent.enableRtl ? 'right' : 'left'] = '');
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
            let resHeader: HTMLElement = (<HTMLElement>this.parent.element.querySelector('.' + cls.RESOURCE_HEADER_TOOLBAR));
            if (resHeader) {
                headerBarHeight += resHeader.offsetHeight;
            }
        }
        return headerBarHeight;
    }
    public renderPanel(type: string): void {
        if (type === cls.PREVIOUS_PANEL_CLASS || isBlazor()) {
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
            let start: Date = getWeekFirstDate(selectedDate, this.parent.activeViewOptions.firstDayOfWeek);
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
            let start: Date = getWeekFirstDate(resetTime(this.parent.selectedDate), this.parent.activeViewOptions.firstDayOfWeek);
            for (let i: number = 0, length: number = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length; i++) {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
                start = addDays(start, 1);
            }
        } else {
            let start: Date = resetTime(this.parent.selectedDate);
            do {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                } else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = addDays(start, 1);
            } while (this.parent.activeViewOptions.interval !== renderDates.length);
        }
        if (!workDays) {
            this.renderDates = renderDates;
        }
        if (this.parent.headerModule) {
            this.parent.headerModule.previousNextIconHandler();
        }
        return renderDates;
    }
    public getNextPreviousDate(type: string): Date {
        if (this.parent.currentView === 'Day' || this.parent.currentView === 'TimelineDay') {
            if (this.parent.activeViewOptions.showWeekend) {
                let daysCount: number = this.parent.activeViewOptions.interval;
                return addDays(this.parent.selectedDate, type === 'next' ? daysCount : -daysCount);
            } else {
                let date: Date;
                if (type === 'next') {
                    date = addDays(this.renderDates.slice(-1)[0], 1);
                    while (!this.isWorkDay(date)) {
                        date = addDays(date, 1);
                    }
                } else {
                    date = addDays(this.renderDates[0], -1);
                    let count: number = 0;
                    do {
                        if (this.isWorkDay(date)) {
                            count += 1;
                        }
                        if (this.parent.activeViewOptions.interval !== count) {
                            date = addDays(date, -1);
                        }
                    } while (this.parent.activeViewOptions.interval !== count);
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
        let viewStr: string = view.charAt(0).toLowerCase() + view.substring(1);
        return this.parent.localeObj.getConstant(viewStr) + ' of ' + capitalizeFirstWord(
            isBlazor() ?
                this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'D', calendar: this.parent.getCalendarMode() }) :
                this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'long', calendar: this.parent.getCalendarMode() }),
            'single');
    }
    public getDateRangeText(): string {
        if (this.parent.isAdaptive) {
            return capitalizeFirstWord(
                this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() }),
                'single');
        }
        return this.formatDateRange(this.renderDates[0], this.renderDates[this.renderDates.length - 1]);
    }
    public formatDateRange(startDate: Date, endDate?: Date): string {
        let globalize: Internationalization = this.parent.globalize;
        let mode: string = this.parent.getCalendarMode();
        if (startDate === endDate) {
            endDate = null;
        }
        if (!isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            let text: string = '';
            if (!endDate) {
                text = globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode });
                return capitalizeFirstWord(text, 'multiple');
            }
            text = (globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode }) +
                ' - ' + globalize.formatDate(endDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode }));
            return capitalizeFirstWord(text, 'multiple');
        }
        let formattedStr: string;
        let longDateFormat: string;
        if (isBlazor()) {
            longDateFormat = 'MMMM d, y';
        } else {
            if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
                longDateFormat = getValue('dateFormats.long', getDefaultDateObject(mode));
            } else {
                longDateFormat = getValue('main.' + '' + this.parent.locale + '.dates.calendars.' + mode + '.dateFormats.long', cldrData);
            }
        }
        if (!endDate) {
            return capitalizeFirstWord(globalize.formatDate(startDate, { format: longDateFormat, calendar: mode }), 'single');
        }
        let dateFormat: string = longDateFormat.trim().toLocaleLowerCase();
        if (dateFormat.substr(0, 1) === 'd') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd', calendar: mode }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMMM yyyy', calendar: mode });
                } else {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd MMM', calendar: mode }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMM yyyy', calendar: mode });
                }
            } else {
                formattedStr = globalize.formatDate(startDate, { format: 'dd MMM yyyy', calendar: mode }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'dd MMM yyyy', calendar: mode });
            }
        } else if (dateFormat.substr(0, 1) === 'm') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMMM dd', calendar: mode }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd, yyyy', calendar: mode });
                } else {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMM dd', calendar: mode }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'MMM dd, yyyy', calendar: mode });
                }
            } else {
                formattedStr = globalize.
                    formatDate(startDate, { format: 'MMM dd, yyyy', calendar: mode }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'MMM dd, yyyy', calendar: mode });
            }
        } else {
            formattedStr = globalize.formatDate(startDate, { format: longDateFormat, calendar: mode }) + ' - ' +
                globalize.formatDate(endDate, { format: longDateFormat, calendar: mode });
        }
        return capitalizeFirstWord(formattedStr, 'multiple');
    }
    public getMobileDateElement(date: Date, className?: string): Element {
        let wrap: Element = createElement('div', {
            className: className,
            innerHTML: '<div class="e-m-date">' + this.parent.globalize.formatDate(
                date, { format: 'd', calendar: this.parent.getCalendarMode() }) + '</div>' + '<div class="e-m-day">' + capitalizeFirstWord(
                    this.parent.globalize.formatDate(date, { format: 'E', calendar: this.parent.getCalendarMode() }), 'single') + '</div>'
        });
        return wrap;
    }
    public setResourceHeaderContent(tdElement: Element, tdData: TdData, className: string = cls.TEXT_ELLIPSIS): void {
        if (this.parent.activeViewOptions.resourceHeaderTemplate) {
            let data: ResourceDetails = { resource: tdData.resource, resourceData: tdData.resourceData };
            let scheduleId: string = this.parent.element.id + '_';
            let viewName: string = this.parent.activeViewOptions.resourceHeaderTemplateName;
            let templateId: string = scheduleId + viewName + 'resourceHeaderTemplate';
            let quickTemplate: HTMLElement[] =
                [].slice.call(this.parent.getResourceHeaderTemplate()(data, this.parent, 'resourceHeaderTemplate', templateId, false));
            append(quickTemplate, tdElement);
        } else {
            tdElement.appendChild(createElement('div', {
                className: className, innerHTML: tdData.resourceData[tdData.resource.textField] as string
            }));
        }
    }

    public renderResourceMobileLayout(): void {
        if (this.parent.resourceBase.lastResourceLevel && this.parent.resourceBase.lastResourceLevel.length <= 0) {
            return;
        }
        this.parent.resourceBase.renderResourceHeader();
        this.parent.resourceBase.renderResourceTree();
    }
    public addAutoHeightClass(element: Element): void {
        if (!this.parent.uiStateValues.isGroupAdaptive && this.parent.rowAutoHeight && this.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            addClass([element], cls.AUTO_HEIGHT);
        }
    }

    private getColElements(): HTMLElement[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS
            + ' col, .' + cls.DATE_HEADER_WRAP_CLASS + ' col')) as HTMLElement[];
    }

    public setColWidth(content: HTMLElement): void {
        if (this.isTimelineView()) {
            let colElements: HTMLElement[] = this.getColElements();
            let contentBody: HTMLElement = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody') as HTMLElement;
            const colWidth: number = Math.ceil(contentBody.offsetWidth / (colElements.length / 2));
            colElements.forEach((col: HTMLElement) => setStyleAttribute(col, { 'width': formatUnit(colWidth) }));
            if (content.offsetHeight !== content.clientHeight) {
                let resourceColumn: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
                if (!isNullOrUndefined(resourceColumn)) {
                    setStyleAttribute(resourceColumn, { 'height': formatUnit(content.clientHeight) });
                }
            }
        }
    }

    public resetColWidth(): void {
        let colElements: HTMLElement[] = this.getColElements();
        colElements.forEach((col: HTMLElement) => col.style.width = '');
    }

    public getContentAreaElement(): HTMLElement {
        return this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
    }

    public wireExpandCollapseIconEvents(): void {
        if (this.parent.resourceBase && this.parent.resourceBase.resourceCollection.length > 1) {
            let treeIcons: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.RESOURCE_TREE_ICON_CLASS));
            treeIcons.forEach((icon: Element) => {
                EventHandler.clearEvents(icon);
                EventHandler.add(icon, 'click', this.parent.resourceBase.onTreeIconClick, this.parent.resourceBase);
            });
        }
    }

    public scrollToDate(scrollDate: Date): void {
        if (['Month', 'TimelineMonth'].indexOf(this.parent.currentView) === -1 || isNullOrUndefined(scrollDate)) {
            return;
        }
        let scrollWrap: HTMLElement = this.getContentAreaElement();
        let elementSelector: string =
            `.${cls.WORK_CELLS_CLASS}[data-date="${this.parent.getMsFromDate(new Date(util.resetTime(new Date(+scrollDate)).getTime()))}"]`;
        let dateElement: HTMLElement = scrollWrap.querySelector(elementSelector) as HTMLElement;
        if (this.parent.currentView === 'Month' && dateElement) {
            scrollWrap.scrollTop = dateElement.offsetTop;
        }
        if (this.parent.currentView === 'TimelineMonth' && dateElement) {
            scrollWrap.scrollLeft = dateElement.offsetLeft;
        }
    }

}