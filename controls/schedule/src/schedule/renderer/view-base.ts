import {
    createElement, append, prepend, isNullOrUndefined, getValue, getDefaultDateObject,
    cldrData, Internationalization, addClass, setStyleAttribute, formatUnit, EventHandler, remove
} from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { TdData, ResourceDetails, CallbackFunction, RenderCellEventArgs } from '../base/interface';
import * as cls from '../base/css-constant';
import * as event from '../base/constant';
import * as util from '../base/util';
import { NavigationDirection } from '../base/type';

/**
 * view base
 */
export class ViewBase {
    public previousNextAction: NavigationDirection = 'Next';
    public element: HTMLElement;
    public parent: Schedule;
    public renderDates: Date[];
    public colLevels: TdData[][];
    public viewIndex: number;
    public skipPersistenceSave: boolean = false;
    public isScrolledBottom: boolean = false;

    /**
     * Constructor
     *
     * @param {Schedule} parent Accepts the schedule instance
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

    public refreshHeader(): void {
        // Method to refresh the date header
    }

    public refreshResourceHeader(): void {
        const resTbl: HTMLElement = this.element.querySelector('.' + cls.RESOURCE_COLUMN_TABLE_CLASS) as HTMLElement;
        const resourceTd: HTMLElement[] = Array.from(resTbl.querySelectorAll('.' + cls.RESOURCE_CELLS_CLASS)) as HTMLElement[];
        resourceTd.forEach((currentElement: HTMLElement) => {
            const children: HTMLElement[] = Array.from(currentElement.children) as HTMLElement[];
            children.forEach((child: HTMLElement) => {
                if (!child.classList.contains(cls.RESOURCE_EXPAND_CLASS) && !child.classList.contains(cls.RESOURCE_COLLAPSE_CLASS)) {
                    remove(child);
                }
            });
        });
        const rendereData: TdData[] = this.parent.resourceBase.renderedResources;
        if (!isNullOrUndefined(rendereData) && rendereData.length > 0) {
            for (let i: number = 0; i < resourceTd.length; i++) {
                const element: HTMLElement = resourceTd[parseInt(i.toString(), 10)];
                const data: TdData = rendereData[parseInt(i.toString(), 10)];
                if (this.parent.activeView && !isNullOrUndefined(element) && !isNullOrUndefined(data)
                    && parseInt(element.getAttribute('data-group-index'), 10) === data.groupIndex) {
                    this.parent.activeView.setResourceHeaderContent(element, data, cls.RESOURCE_TEXT_CLASS);
                    const eventArgs: RenderCellEventArgs = { element: element, elementType: 'resourceHeader', groupIndex: data.groupIndex };
                    this.parent.trigger(event.renderCell, eventArgs);
                }
            }
        }
        this.parent.renderTemplates();
        this.parent.notify(event.contentReady, {});
    }

    public getDayName(date: Date): string {
        return this.parent.getDayNames('abbreviated')[date.getDay()];
    }

    public getDate(date: Date): string {
        return this.parent.globalize.formatDate(date, { format: 'd', calendar: this.parent.getCalendarMode() });
    }

    public getTime(date: Date): string {
        if (this.parent.isAdaptive) {
            if (this.parent.activeViewOptions.timeFormat === 'HH:mm' || this.parent.activeViewOptions.timeFormat === 'HH.mm') {
                return this.parent.globalize.formatDate(date, { format: 'H', calendar: this.parent.getCalendarMode() });
            }
            return this.parent.globalize.formatDate(date, { skeleton: 'h', calendar: this.parent.getCalendarMode() });
        }
        return this.parent.getTimeString(date);
    }

    public getTimelineDate(date: Date): string {
        const text: string = this.parent.globalize.formatDate(date, { skeleton: 'MMMd', calendar: this.parent.getCalendarMode() }) + ', ' +
            this.parent.getDayNames('wide')[date.getDay()];
        return util.capitalizeFirstWord(text, 'multiple');
    }

    public createEventTable(trCount: number): Element {
        const eventTable: Element = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        append(this.getEventRows(trCount), eventTable);
        return eventTable;
    }

    public getEventRows(trCount: number): Element[] {
        const eventRows: Element[] = [];
        let eventContainer: Element;
        for (let row: number = 0; row < trCount; row++) {
            eventContainer = createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS });
            if (this.parent.resourceBase && !this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.renderedResources) {
                eventContainer.setAttribute('data-group-index', this.parent.resourceBase.renderedResources[parseInt(row.toString(), 10)].groupIndex.toString());
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
        const clsName: string = className || '';
        const table: Element = createElement('table', { className: cls.SCHEDULE_TABLE_CLASS + ' ' + clsName });
        const tbody: Element = createElement('tbody');
        table.appendChild(tbody);
        return table;
    }

    public setAriaAttributes(table: Element): void {
        table.setAttribute('role', 'grid');
        if (this.parent.currentView !== 'Year') {
            table.setAttribute('id', this.parent.element.id + '_table');
        }
        table.setAttribute('aria-label', this.getLabelText(this.parent.currentView));
    }

    public createColGroup(table: Element, lastRow: TdData[]): void {
        if (isNullOrUndefined(lastRow)) {
            return;
        }
        let length: number = lastRow.length;
        if (lastRow[0] && lastRow[0].colSpan) {
            length = lastRow.map((value: TdData) => value.colSpan).reduce((prev: number, next: number) => prev + next);
        }
        const colGroupEle: Element = createElement('colgroup');
        for (let i: number = 0; i < length; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        prepend([colGroupEle], table);
    }

    public getScrollXIndent(content: HTMLElement): number {
        return content.offsetHeight - content.clientHeight > 0 ? util.getScrollBarWidth() : 0;
    }

    public scrollTopPanel(target: HTMLElement): void {
        (this.getDatesHeaderElement().firstElementChild as Element).scrollLeft = target.scrollLeft;
    }

    public scrollHeaderLabels(target: HTMLElement): void {
        const headerTable: HTMLElement = this.element.querySelector('.e-date-header-wrap table') as HTMLElement;
        const colWidth: number = headerTable.offsetWidth / headerTable.querySelectorAll('colgroup col').length;
        const applyLeft: CallbackFunction = (headerCells: HTMLElement[], isRtl: boolean) => {
            let currentCell: HTMLElement;
            let tdLeft: number = 0;
            let colSpan: number = 0;
            const hiddenLeft: number = isRtl ? -(target.scrollLeft) : target.scrollLeft;
            for (const cell of headerCells) {
                colSpan += parseInt(cell.getAttribute('colSpan'), 10);
                if (colSpan > Math.floor(hiddenLeft / colWidth)) {
                    currentCell = cell;
                    break;
                }
                tdLeft += cell.offsetWidth;
            }
            if (!isNullOrUndefined(currentCell)) {
                (currentCell.children[0] as HTMLElement).style[isRtl ? 'right' : 'left'] = (hiddenLeft - tdLeft) + 'px';
            }
        };
        const classNames: string[] = ['.e-header-year-cell', '.e-header-month-cell', '.e-header-week-cell', '.e-header-cells'];
        for (const className of classNames) {
            const headerCells: HTMLElement[] = [].slice.call(this.element.querySelectorAll(className));
            if (headerCells.length > 0) {
                for (const element of headerCells) {
                    (element.children[0] as HTMLElement).style[this.parent.enableRtl ? 'right' : 'left'] = '';
                }
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
            headerBarHeight += util.getOuterHeight(this.parent.headerModule.getHeaderElement());
        }
        if (this.parent.uiStateValues.isGroupAdaptive) {
            const resHeader: HTMLElement = (<HTMLElement>this.parent.element.querySelector('.' + cls.RESOURCE_HEADER_TOOLBAR));
            if (resHeader) {
                headerBarHeight += resHeader.offsetHeight;
            }
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getDateSlots(renderDates: Date[], workDays: number[]): TdData[] {
        return []; // Here getDateSlots only need in vertical and month views
    }

    public generateColumnLevels(): TdData[][] {
        return []; // Here generateColumnLevels only need in vertical and month views
    }

    public getColumnLevels(): TdData[][] {
        return this.colLevels;
    }

    public highlightCurrentTime(): void {
        // Here showTimeIndicator functionalities
    }

    public getStartDate(): Date {
        return this.renderDates[0];
    }

    public getEndDate(): Date {
        return this.renderDates[this.renderDates.length - 1];
    }

    public startDate(): Date {
        return this.renderDates[0];
    }

    public endDate(): Date {
        return util.addDays(this.renderDates[this.renderDates.length - 1], 1);
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
        return date.setHours(0, 0, 0, 0) === new Date(this.parent.currentTimezoneDate).setHours(0, 0, 0, 0);
    }

    public isCurrentMonth(date: Date): boolean {
        if (this.parent.activeViewOptions.displayDate || this.parent.activeViewOptions.numberOfWeeks > 0) {
            return this.parent.activeView.getStartDate().getTime() <= this.parent.getCurrentTime().getTime() &&
                this.parent.activeView.getEndDate().getTime() >= this.parent.getCurrentTime().getTime();
        }
        return date.getFullYear() ===
            this.parent.getCurrentTime().getFullYear() && date.getMonth() === this.parent.getCurrentTime().getMonth();
    }

    public isWorkDay(date: Date, workDays: number[] = this.parent.activeViewOptions.workDays): boolean {
        if (!isNullOrUndefined(workDays) && workDays.indexOf(date.getDay()) >= 0) {
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
        if (util.resetTime(date).getTime() !== util.resetTime(startHour).getTime()) {
            startHour = new Date(2000, 0, 0, startHour.getHours(), startHour.getMinutes(), startHour.getMilliseconds());
            endHour = new Date(2000, 0, 0, endHour.getHours(), endHour.getMinutes(), endHour.getMilliseconds());
        }
        return !(util.getDateInMs(date) < util.getDateInMs(startHour) || util.getDateInMs(date) >= util.getDateInMs(endHour) ||
            !this.isWorkDay(date, workDays));
    }

    public getRenderDates(workDays?: number[], date: Date = this.parent.selectedDate): Date[] {
        const renderDates: Date[] = [];
        // Due to same code for vertical and time line, week & work week views, if condition has used
        if (this.parent.currentView === 'Week' || this.parent.currentView === 'TimelineWeek') {
            const selectedDate: Date = util.resetTime(date);
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
        } else if (this.parent.currentView === 'WorkWeek' || this.parent.currentView === 'TimelineWorkWeek') {
            let start: Date = util.getWeekFirstDate(util.resetTime(date), this.parent.activeViewOptions.firstDayOfWeek);
            for (let i: number = 0, length: number = util.WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length; i++) {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
                start = util.addDays(start, 1);
            }
        } else {
            const dayCount: number = this.parent.currentView === 'Agenda' ? this.parent.agendaDaysCount :
                this.parent.activeViewOptions.interval;
            let start: Date = util.resetTime(date);
            do {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                } else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = util.addDays(start, 1);
            } while (dayCount !== renderDates.length);
        }
        if (!workDays) {
            this.renderDates = renderDates;
        }
        if (this.parent.headerModule) {
            this.parent.headerModule.previousNextIconHandler();
        }
        return renderDates;
    }

    public getNextPreviousDate(type: NavigationDirection): Date {
        this.previousNextAction = type;
        if (this.parent.currentView === 'Day' || this.parent.currentView === 'TimelineDay') {
            if (this.parent.activeViewOptions.showWeekend) {
                const daysCount: number = this.parent.activeViewOptions.interval;
                return util.addDays(this.parent.selectedDate, type === 'Next' ? daysCount : -daysCount);
            } else {
                let date: Date;
                if (type === 'Next') {
                    date = util.addDays(this.renderDates.slice(-1)[0], 1);
                    while (!this.isWorkDay(date)) {
                        date = util.addDays(date, 1);
                    }
                } else {
                    date = util.addDays(this.renderDates[0], -1);
                    let count: number = 0;
                    do {
                        if (this.isWorkDay(date)) {
                            count += 1;
                        }
                        if (this.parent.activeViewOptions.interval !== count) {
                            date = util.addDays(date, -1);
                        }
                    } while (this.parent.activeViewOptions.interval !== count);
                }
                return date;
            }
        }
        const weekLength: number = type === 'Next' ? util.WEEK_LENGTH : -util.WEEK_LENGTH;
        return util.addDays(this.parent.selectedDate, weekLength * this.parent.activeViewOptions.interval);
    }

    public formatViewLabel(view: string, startDate: Date, endDate: Date): string {
        const formatOptions: { type: string; skeleton: string; calendar: string } = { type: 'date', skeleton: 'full', calendar: this.parent.getCalendarMode() };
        return this.parent.localeObj.getConstant(view) + ' ' + this.parent.localeObj.getConstant('start') + ' ' + this.parent.globalize.formatDate(startDate, formatOptions) + ' '
            + this.parent.localeObj.getConstant('endAt') + ' ' + this.parent.globalize.formatDate(endDate, formatOptions);
    }

    public getLabelText(view: string): string {
        const viewStr: string = view.charAt(0).toLowerCase() + view.substring(1);
        if (view === 'Year' || view === 'TimelineYear') {
            return this.formatViewLabel(viewStr, this.parent.activeView.getStartDate(), this.parent.activeView.getEndDate());
        } else {
            if (this.renderDates.length > 0) {
                if (this.parent.currentView === 'Day' || this.parent.currentView === 'TimelineDay') {
                    return this.parent.localeObj.getConstant(viewStr) + ' of ' + util.capitalizeFirstWord(
                        this.parent.globalize.formatDate(this.parent.selectedDate, { type: 'date', skeleton: 'full', calendar: this.parent.getCalendarMode() }),
                        'single');
                } else {
                    return this.formatViewLabel(viewStr, this.renderDates[0], this.renderDates[this.renderDates.length - 1]);
                }
            } else {
                return '';
            }
        }
    }

    public getDateRangeText(date: Date = this.renderDates[0], dateCollection: Date[] = this.renderDates): string {
        if (this.parent.isAdaptive) {
            const formatDate: string = (this.parent.activeViewOptions.dateFormat) ? this.parent.activeViewOptions.dateFormat : 'MMMM y';
            return util.capitalizeFirstWord(
                this.parent.globalize.formatDate(this.parent.selectedDate, { format: formatDate, calendar: this.parent.getCalendarMode() }),
                'single');
        }
        return this.formatDateRange(date, dateCollection[dateCollection.length - 1]);
    }

    public formatDateRange(startDate: Date, endDate?: Date): string {
        const globalize: Internationalization = this.parent.globalize;
        const mode: string = this.parent.getCalendarMode();
        if (startDate === endDate) {
            endDate = null;
        }
        if (!isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            let text: string = '';
            if (!endDate) {
                text = globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode });
                return util.capitalizeFirstWord(text, 'multiple');
            }
            text = (globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode }) +
                ' - ' + globalize.formatDate(endDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode }));
            return util.capitalizeFirstWord(text, 'multiple');
        }
        let formattedStr: string;
        let longDateFormat: string;
        if (isNullOrUndefined(this.parent.locale) || this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            longDateFormat = getValue('dateFormats.long', getDefaultDateObject(mode));
        } else {
            longDateFormat = getValue('main.' + '' + this.parent.locale + '.dates.calendars.' + mode + '.dateFormats.long', cldrData);
        }
        if (!endDate) {
            return util.capitalizeFirstWord(globalize.formatDate(startDate, { format: longDateFormat, calendar: mode }), 'single');
        }
        const dateFormat: string = longDateFormat.trim().toLocaleLowerCase();
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
        return util.capitalizeFirstWord(formattedStr, 'multiple');
    }

    public getMobileDateElement(date: Date, className?: string): Element {
        const wrap: Element = createElement('div', {
            className: className,
            innerHTML: '<div class="e-m-date">' + this.parent.globalize.formatDate(
                date, { format: 'd', calendar: this.parent.getCalendarMode() }) + '</div>' + '<div class="e-m-day">' +
                util.capitalizeFirstWord(
                    this.parent.globalize.formatDate(date, { format: 'E', calendar: this.parent.getCalendarMode() }), 'single') + '</div>'
        });
        return wrap;
    }

    public setResourceHeaderContent(tdElement: Element, tdData: TdData, className: string = cls.TEXT_ELLIPSIS): void {
        if (this.parent.activeViewOptions.resourceHeaderTemplate) {
            const data: ResourceDetails = { resource: tdData.resource, resourceData: tdData.resourceData };
            const scheduleId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.resourceHeaderTemplateName;
            const templateId: string = scheduleId + viewName + 'resourceHeaderTemplate';
            const quickTemplate: HTMLElement[] = [].slice.call(this.parent.getResourceHeaderTemplate()(data, this.parent,                                                                                                       'resourceHeaderTemplate',
                                                                                                       templateId, false, undefined,
                                                                                                       undefined, this.parent.root));
            append(quickTemplate, tdElement);
        } else {
            const resourceText: HTMLElement = createElement('div', { className: className });
            this.parent.sanitize(tdData.resourceData[tdData.resource.textField] as string, resourceText);
            tdElement.appendChild(resourceText);
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
        return [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS + ' col, .' + cls.DATE_HEADER_WRAP_CLASS + ' col'));
    }

    public setColWidth(content: HTMLElement): void {
        if (this.isTimelineView()) {
            const colElements: HTMLElement[] = this.getColElements();
            const contentBody: HTMLElement = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody') as HTMLElement;
            const colWidth: number = (this.parent.getElementWidth(contentBody) / (colElements.length / 2));
            if (content.offsetHeight !== content.clientHeight) {
                const resourceColumn: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
                if (!isNullOrUndefined(resourceColumn) && resourceColumn.offsetHeight !== content.clientHeight) {
                    setStyleAttribute(resourceColumn, { 'height': formatUnit(content.clientHeight) });
                }
            }
            const cssClass: string = `.${cls.HEADER_CELLS_CLASS},.${cls.TIME_SLOT_CLASS},.${cls.HEADER_WEEK_CELLS_CLASS},.${cls.HEADER_MONTH_CELLS_CLASS},.${cls.HEADER_YEAR_CELLS_CLASS}`;
            const headerCellElements: HTMLElement[] = [].slice.call(this.element.querySelectorAll(cssClass));
            headerCellElements.forEach((ele: HTMLElement) => {
                const colSpan: string = isNullOrUndefined(ele.getAttribute('colspan')) ? '1' : ele.getAttribute('colspan');
                const headerCellColSpan: number = parseInt(colSpan, 10);
                setStyleAttribute(ele, { 'width': formatUnit(colWidth * headerCellColSpan) });
            });
        }
    }

    public resetColWidth(): void {
        const colElements: HTMLElement[] = this.getColElements();
        for (const col of colElements) {
            col.style.width = '';
        }
    }

    public getContentAreaElement(): HTMLElement {
        return this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
    }

    public wireExpandCollapseIconEvents(): void {
        if (this.parent.resourceBase && this.parent.resourceBase.resourceCollection.length > 1) {
            const treeIcons: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.RESOURCE_TREE_ICON_CLASS));
            for (const icon of treeIcons) {
                EventHandler.clearEvents(icon);
                EventHandler.add(icon, 'click', this.parent.resourceBase.onTreeIconClick, this.parent.resourceBase);
            }
        }
    }

    public scrollToDate(scrollDate: Date): void {
        if (['Month', 'TimelineMonth'].indexOf(this.parent.currentView) === -1 || isNullOrUndefined(scrollDate)) {
            return;
        }
        const scrollWrap: HTMLElement = this.getContentAreaElement();
        const tdDate: number = new Date(util.resetTime(new Date(+scrollDate)).getTime()).getTime();
        const dateElement: HTMLElement = scrollWrap.querySelector(`.${cls.WORK_CELLS_CLASS}[data-date="${tdDate}"]`) as HTMLElement;
        if (this.parent.currentView === 'Month' && dateElement) {
            if (scrollWrap.scrollWidth > scrollWrap.clientWidth) {
                if (!this.parent.enableRtl) {
                    scrollWrap.scrollLeft = dateElement.offsetLeft;
                } else {
                    scrollWrap.scrollLeft = -(this.parent.getContentTable().offsetWidth - dateElement.offsetLeft - dateElement.offsetWidth);
                }
            }
            scrollWrap.scrollTop = dateElement.offsetTop;
        }
        if (this.parent.currentView === 'TimelineMonth' && dateElement) {
            if (!this.parent.enableRtl) {
                scrollWrap.scrollLeft = dateElement.offsetLeft;
            } else {
                scrollWrap.scrollLeft = -(this.parent.getContentTable().offsetWidth - dateElement.offsetLeft - dateElement.offsetWidth);
            }
        }
    }

    public setPersistence(): void {
        if (this.parent.enablePersistence) {
            const contentWrap: HTMLElement = this.element.querySelector('.e-content-wrap') as HTMLElement;
            if (this.parent.virtualScrollModule && this.isScrolledBottom) {
                this.isScrolledBottom = false;
                this.skipPersistenceSave = true;
                contentWrap.scrollTop = this.parent.scrollTop;
                this.skipPersistenceSave = false;
            }
            if (!isNullOrUndefined(contentWrap)) {
                this.parent.scrollLeft = contentWrap.scrollLeft;
                this.parent.scrollTop = contentWrap.scrollTop;
            }
        }
    }

    public retainScrollPosition(): void {
        if (this.parent.enablePersistence) {
            const conWrap: HTMLElement = this.parent.element.querySelector('.e-content-wrap') as HTMLElement;
            if (!isNullOrUndefined(conWrap) && !isNullOrUndefined(this.parent.scrollLeft) && !isNullOrUndefined(this.parent.scrollTop)) {
                this.isScrolledBottom = conWrap.scrollHeight - conWrap.clientHeight < this.parent.scrollTop;
                conWrap.scrollTop = this.parent.scrollTop;
                conWrap.scrollLeft = this.parent.scrollLeft;
            }
        }
    }

    public getViewStartDate(): Date {
        let startDate: Date = this.renderDates[0];
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.resourceBase.lastResourceLevel.length > 0) {
            startDate = this.parent.resourceBase.getResourceRenderDates()[0];
        }
        return startDate;
    }

    public getViewEndDate(): Date {
        let endDate: Date = util.addDays(this.renderDates[this.renderDates.length - 1], 1);
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.resourceBase.lastResourceLevel.length > 0) {
            endDate = util.addDays(this.parent.resourceBase.getResourceRenderDates().slice(-1)[0], 1);
        }
        return endDate;
    }

    public getAdjustedDate(startTime: Date): Date {
        if (!this.parent.activeViewOptions.timeScale.enable || this.parent.currentView === 'Month' ||
            (this.parent.currentView === 'TimelineYear' && this.parent.activeViewOptions.group.resources.length === 0)) {
            return new Date(startTime.setHours(0, 0, 0, 0));
        }
        else if (this.parent.currentView === 'TimelineYear' && this.parent.activeViewOptions.group.resources.length > 0) {
            startTime.setHours(0, 0, 0, 0);
            return new Date(startTime.setDate(1));
        }
        return null;
    }

    public resetColLevels(): void {
        this.parent.resourceBase.expandedResources = [];
        const renderedCount: number = this.parent.virtualScrollModule.getRenderedCount();
        const lastLevel: TdData[] = this.parent.activeViewOptions.group.byDate ? this.colLevels[0] :
            this.parent.resourceBase.renderedResources;
        let index: number = 0;
        for (let i: number = 0; i < lastLevel.length; i++) {
            if (index >= renderedCount) {
                break;
            }
            index += lastLevel[parseInt(i.toString(), 10)].colSpan;
            this.parent.resourceBase.expandedResources.push(lastLevel[parseInt(i.toString(), 10)]);
        }
        if (this.parent.activeViewOptions.group.byDate) {
            this.colLevels[0] = this.parent.resourceBase.expandedResources;
            this.parent.virtualScrollModule.setRenderedDates(this.parent.resourceBase.expandedResources);
        } else {
            this.colLevels[this.colLevels.length - 2] = this.parent.resourceBase.expandedResources;
            this.parent.resourceBase.renderedResources = this.parent.resourceBase.expandedResources;
        }
        if (this.parent.currentView !== 'Month') {
            this.colLevels[this.colLevels.length - 1] = this.colLevels[this.colLevels.length - 1].slice(0, index);
            this.parent.resourceBase.expandedResources = this.colLevels[this.colLevels.length - 1];
        }
    }

    public getGroupIndices(dataCollection?: TdData[]): number[] {
        let groupIndices: number[] = [];
        if (this.parent.virtualScrollModule && this.parent.activeViewOptions.group.resources.length > 0 && (dataCollection ||
            this.parent.virtualScrollModule.existingDataCollection.length > 0) && !this.parent.uiStateValues.isGroupAdaptive) {
            dataCollection = isNullOrUndefined(dataCollection) ? this.parent.virtualScrollModule.existingDataCollection : dataCollection;
            groupIndices = dataCollection.map((data: TdData) => data.groupIndex);
        }
        return groupIndices;
    }

    public destroy(): void {
        if (this.element && this.element.parentNode) {
            remove(this.element);
        }
        this.element = null;
        this.renderDates = null;
        this.colLevels = null;
    }

}
