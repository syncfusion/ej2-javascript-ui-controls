import { EventHandler, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove, addClass, append, prepend } from '@syncfusion/ej2-base';
import { IRenderer, TdData, RenderCellEventArgs, CellTemplateArgs, NotifyEventArgs, CellClickEventArgs } from '../base/interface';
import { Schedule } from '../base/schedule';
import { WorkCellInteraction } from '../actions/work-cells';
import { ViewBase } from './view-base';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import { MonthEvent } from '../event-renderer/month';

/**
 * month view
 */
export class Month extends ViewBase implements IRenderer {
    public dayNameFormat: string = 'wide';
    public viewClass: string = 'e-month-view';
    public isInverseTableSelect: boolean = false;
    private workCellAction: WorkCellInteraction;
    private monthDates: { [key: string]: Date };
    /**
     * Constructor for month view
     */
    constructor(parent: Schedule) {
        super(parent);
        this.monthDates = {};
        this.workCellAction = new WorkCellInteraction(parent);
    }
    public addEventListener(): void {
        this.parent.on(event.scrollUiUpdate, this.onScrollUIUpdate, this);
        this.parent.on(event.dataReady, this.onDataReady, this);
        this.parent.on(event.cellClick, this.onCellClick, this);
    }
    public removeEventListener(): void {
        this.parent.off(event.scrollUiUpdate, this.onScrollUIUpdate);
        this.parent.off(event.dataReady, this.onDataReady);
        this.parent.off(event.cellClick, this.onCellClick);
    }
    public onDataReady(args: NotifyEventArgs): void {
        let monthEvent: MonthEvent = new MonthEvent(this.parent);
        monthEvent.renderAppointments();
    }
    public onCellClick(event: CellClickEventArgs): void {
        // Here cell click
    }
    public onContentScroll(e: Event): void {
        this.scrollTopPanel(<HTMLElement>e.target);
        this.scrollLeftPanel(<HTMLElement>e.target);
    }
    public scrollLeftPanel(target: HTMLElement): void {
        let leftPanel: HTMLElement = this.getLeftPanelElement();
        if (leftPanel) {
            leftPanel.scrollTop = target.scrollTop;
        }
    }
    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.WEEK_NUMBER_WRAPPER_CLASS) as HTMLElement;
    }
    public onScrollUIUpdate(args: NotifyEventArgs): void {
        let headerHeight: number = this.getHeaderBarHeight();
        let header: HTMLElement = this.getDatesHeaderElement();
        let content: HTMLElement = this.getContentAreaElement();
        let height: number = this.parent.element.offsetHeight - headerHeight - header.offsetHeight;
        let leftPanel: HTMLElement = this.getLeftPanelElement();
        this.setContentHeight(content, leftPanel, height);
        let scrollBarWidth: number = util.getScrollBarWidth();
        // tslint:disable:no-any
        if (content.offsetWidth - content.clientWidth > 0) {
            (<HTMLElement>header.firstChild).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        } else {
            (<HTMLElement>header.firstChild).style[<any>args.cssProperties.border] = '';
            header.style[<any>args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
    }
    public setContentHeight(content: HTMLElement, leftPanelElement: HTMLElement, height: number): void {
        content.style.height = 'auto';
        if (this.parent.currentView === 'Month') {
            content.style.height = formatUnit(height);
        }
        if (leftPanelElement) {
            if (this.parent.currentView === 'MonthAgenda') {
                height = (<HTMLElement>this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS)).offsetHeight;
            }
            leftPanelElement.style.height = 'auto';
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
    }
    public generateColumnLevels(): TdData[][] {
        let colLevels: TdData[][] = [];
        let level: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            colLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.currentView === 'MonthAgenda') {
                colLevels = [level];
            }
            if (this.parent.uiStateValues.isGroupAdaptive) {
                let resourceLevel: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                colLevels = [this.getDateSlots(resourceLevel.renderDates, resourceLevel.workDays)];
            }
        } else {
            colLevels.push(level);
        }
        this.colLevels = colLevels;
        return colLevels;
    }
    public getDateSlots(renderDates: Date[], workDays: number[]): TdData[] {
        let count: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH : workDays.length;
        let dateSlots: TdData[] = [];
        for (let col: number = 0; col < count; col++) {
            let classList: string[] = [cls.HEADER_CELLS_CLASS];
            let currentDateIndex: number[] = renderDates.slice(0, count).map((date: Date) => date.getDay());
            if (this.isCurrentMonth(this.parent.selectedDate) && currentDateIndex.indexOf(new Date().getDay()) === col) {
                classList.push(cls.CURRENT_DAY_CLASS);
            }
            dateSlots.push({ date: renderDates[col], type: 'monthDay', className: classList, colSpan: 1, workDays: workDays });
        }
        return dateSlots;
    }
    public getDayNameFormat(): string {
        if (this.parent.isAdaptive || this.parent.activeViewOptions.group.resources.length > 0) {
            return 'abbreviated';
        }
        return 'wide';
    }
    public renderLayout(type: string): void {
        this.dayNameFormat = this.getDayNameFormat();
        this.setPanel(createElement('div', { className: cls.TABLE_WRAP_CLASS }));
        let clsList: string[] = [this.viewClass];
        clsList.push(type);
        if (this.parent.activeViewOptions.group.byDate) {
            clsList.push('e-by-date');
        }
        addClass([this.element], clsList);
        this.renderPanel(type);
        this.element.appendChild(this.createTableLayout(cls.OUTER_TABLE_CLASS) as HTMLElement);
        this.colLevels = this.generateColumnLevels();
        this.renderHeader();
        this.renderContent();
        let target: HTMLElement = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        if (this.parent.uiStateValues.isGroupAdaptive && !target.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(event.contentReady, {});
    }
    public wireCellEvents(element: Element): void {
        EventHandler.add(element, 'mousedown', this.workCellAction.cellMouseDown, this.workCellAction);
        EventHandler.add(element, 'click', this.workCellAction.cellClick, this.workCellAction);
        EventHandler.add(element, 'dblclick', this.workCellAction.cellDblClick, this.workCellAction);
    }
    public renderHeader(): void {
        let tr: Element = createElement('tr');
        this.renderLeftIndent(tr);
        let dateTd: Element = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    }
    public renderLeftIndent(tr: Element): void {
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(createElement('td', { className: 'e-left-indent' }));
        }
    }
    public renderContent(): void {
        let tr: Element = createElement('tr');
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(this.renderWeekNumberContent());
        }
        let workTd: Element = createElement('td');
        let wrap: Element = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        let contentArea: Element = this.renderContentArea();
        if (this.parent.currentView === 'Month') {
            wrap.appendChild(contentArea);
        } else {
            let monthAgendaWrapper: HTMLElement = createElement('div', { className: cls.TABLE_CONTAINER_CLASS });
            monthAgendaWrapper.appendChild(contentArea);
            wrap.appendChild(monthAgendaWrapper);
        }
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        workTd.appendChild(wrap);
        tr.appendChild(workTd);
        this.element.querySelector('tbody').appendChild(tr);
        this.renderAppointmentContainer();
    }
    private renderWeekNumberContent(): HTMLElement {
        let dateCol: Date[] = this.renderDates.map((date: Date) => new Date(+date));
        let td: HTMLElement = createElement('td');
        let contentWrapper: HTMLElement = createElement('div', { className: cls.WEEK_NUMBER_WRAPPER_CLASS });
        td.appendChild(contentWrapper);
        let contentWrapTable: HTMLElement = this.createTableLayout() as HTMLElement;
        contentWrapper.appendChild(contentWrapTable);
        let noOfDays: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH :
            this.parent.activeViewOptions.workDays.length;
        for (let i: number = 0, length: number = (this.renderDates.length / noOfDays); i < length; i++) {
            let dates: Date[] = dateCol.splice(0, noOfDays);
            let weekNumber: string = util.getWeekNumber(dates.slice(-1)[0]).toString();
            contentWrapTable.querySelector('tbody').appendChild(this.createWeekNumberElement(weekNumber));
        }
        return td;
    }
    public renderAppointmentContainer(): void {
        //Here needs to render mobile view appointment details on selected date
    }
    public renderDatesHeader(): Element {
        let container: Element = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        let wrap: Element = createElement('div', { className: cls.DATE_HEADER_WRAP_CLASS });
        container.appendChild(wrap);
        let table: Element = this.createTableLayout();
        this.createColGroup(table, this.colLevels[this.colLevels.length - 1]);
        let trEle: Element = createElement('tr');
        for (let i: number = 0; i < this.colLevels.length; i++) {
            let level: TdData[] = this.colLevels[i];
            let ntr: Element = trEle.cloneNode() as Element;
            for (let j: number = 0; j < level.length; j++) {
                let td: TdData = level[j];
                ntr.appendChild(this.createHeaderCell(td));
            }
            table.querySelector('tbody').appendChild(ntr);
        }
        wrap.appendChild(table);
        return container;
    }
    private createHeaderCell(td: TdData): Element {
        let tdEle: Element = createElement('td');
        this.addAttributes(td, tdEle);
        if (td.type === 'monthDay') {
            let ele: Element = createElement('span', { innerHTML: this.parent.getDayNames(this.dayNameFormat)[td.date.getDay()] });
            tdEle.appendChild(ele);
        }
        if (td.type === 'resourceHeader') {
            this.setResourceHeaderContent(tdEle, td);
        }
        if (td.type === 'dateHeader') {
            addClass([tdEle], cls.DATE_HEADER_CLASS);
            tdEle.setAttribute('data-date', td.date.getTime().toString());
            if (this.parent.activeViewOptions.dateHeaderTemplate) {
                let cellArgs: CellTemplateArgs = { date: td.date, type: td.type };
                let ele: HTMLCollection = this.parent.getDateHeaderTemplate()(cellArgs);
                if (ele && ele.length) {
                    append([].slice.call(ele), tdEle);
                }
            } else {
                let ele: Element = createElement('span', { className: cls.NAVIGATE_CLASS });
                let title: string = this.parent.globalize.formatDate(td.date, { skeleton: 'full' });
                ele.setAttribute('title', title);
                ele.innerHTML = (td.date.getDate() === 1 && !this.isCurrentDate(td.date) && !this.parent.isAdaptive) ?
                    this.parent.globalize.formatDate(td.date, { format: 'MMM d' }) :
                    this.parent.globalize.formatDate(td.date, { skeleton: 'd' });
                tdEle.appendChild(ele);
            }
            this.wireCellEvents(tdEle);
        }
        let args: RenderCellEventArgs = { elementType: td.type, element: tdEle, date: td.date, groupIndex: td.groupIndex };
        this.parent.trigger(event.renderCell, args);
        return tdEle;
    }
    public getContentSlots(): TdData[][] {
        let slotDatas: TdData[][] = [];
        let prepareSlots: Function = (rowIndex: number, renderDate: Date, resData: TdData, classList?: string[]) => {
            let data: TdData = {
                date: new Date(+renderDate), groupIndex: resData.groupIndex, workDays: resData.workDays,
                type: 'monthCells', className: classList || [cls.WORK_CELLS_CLASS]
            };
            if (!slotDatas[rowIndex]) {
                slotDatas[rowIndex] = [];
            }
            slotDatas[rowIndex].push(data);
        };
        let includeResource: boolean = this.parent.currentView !== 'MonthAgenda' &&
            this.parent.activeViewOptions.group.resources.length > 0;
        if (includeResource && !this.parent.uiStateValues.isGroupAdaptive && !this.parent.activeViewOptions.group.byDate) {
            for (let res of this.colLevels[this.colLevels.length - 2]) {
                let dates: Date[] = res.renderDates.map((date: Date) => new Date(+date));
                let count: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH : res.workDays.length;
                for (let i: number = 0; i < (res.renderDates.length / count); i++) {
                    let colDates: Date[] = dates.splice(0, count);
                    for (let colDate of colDates) {
                        prepareSlots(i, colDate, res);
                    }
                }
            }
        } else {
            let dates: Date[] = this.renderDates.map((date: Date) => new Date(+date));
            let count: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH :
                this.parent.activeViewOptions.workDays.length;
            for (let i: number = 0; i < (this.renderDates.length / count); i++) {
                let colDates: Date[] = dates.splice(0, count);
                for (let colDate of colDates) {
                    if (includeResource) {
                        let lastRow: TdData[] = this.colLevels[(this.colLevels.length - 1)];
                        let resourcesTd: TdData[] = lastRow.slice(0, lastRow.length / count);
                        for (let resIndex: number = 0; resIndex < resourcesTd.length; resIndex++) {
                            let clsList: string[];
                            if (resIndex !== 0) {
                                clsList = [cls.WORK_CELLS_CLASS, cls.DISABLE_DATE];
                            }
                            prepareSlots(i, colDate, resourcesTd[resIndex], clsList);
                        }
                    } else {
                        prepareSlots(i, colDate, this.colLevels[this.colLevels.length - 1][0]);
                    }
                }
            }
        }
        return slotDatas;
    }
    public updateClassList(data: TdData): void {
        if (this.isOtherMonth(data.date)) {
            data.className.push(cls.OTHERMONTH_CLASS);
        }
        if (this.parent.currentView === 'MonthAgenda' && this.parent.isSelectedDate(data.date)) {
            data.className.push(cls.SELECTED_CELL_CLASS);
        }
    }
    private isOtherMonth(date: Date): boolean {
        return date.getTime() < this.monthDates.start.getTime() || date.getTime() > this.monthDates.end.getTime();
    }
    public renderContentArea(): Element {
        let tbl: Element = this.createTableLayout(cls.CONTENT_TABLE_CLASS);
        if (this.parent.currentView === 'TimelineMonth') {
            this.createColGroup(tbl, this.colLevels[this.colLevels.length - 1]);
        }
        let monthDate: Date = new Date(this.parent.selectedDate.getTime());
        this.monthDates = {
            start: util.firstDateOfMonth(monthDate),
            end: util.lastDateOfMonth(util.addMonths(monthDate, this.parent.activeViewOptions.interval - 1))
        };
        this.renderContentTable(tbl);
        this.wireCellEvents(tbl.querySelector('tbody'));
        return tbl;
    }
    public renderContentTable(table: Element): void {
        let tbody: Element = table.querySelector('tbody');
        let tr: Element = createElement('tr', { attrs: { role: 'row' } });
        let td: Element = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        let slotDatas: TdData[][] = this.getContentSlots();
        for (let row: number = 0; row < slotDatas.length; row++) {
            let ntr: Element = tr.cloneNode() as Element;
            for (let col: number = 0; col < slotDatas[row].length; col++) {
                let ntd: Element = this.createContentTd(slotDatas[row][col], td);
                ntr.appendChild(ntd);
            }
            tbody.appendChild(ntr);
        }
    }
    public createContentTd(data: TdData, td: Element): Element {
        let ntd: Element = td.cloneNode() as Element;
        if (data.colSpan) { ntd.setAttribute('colspan', data.colSpan.toString()); }
        this.updateClassList(data);
        let type: string = data.type;
        if (data.className.indexOf(cls.RESOURCE_PARENT_CLASS) !== -1) {
            data.className.push(cls.RESOURCE_GROUP_CELLS_CLASS);
            type = 'resourceGroupCells';
        }
        if (this.parent.workHours.highlight && this.isWorkDay(data.date, data.workDays)) {
            data.className.push(cls.WORKDAY_CLASS);
        }
        if (this.isCurrentDate(data.date)) {
            data.className.push(cls.CURRENTDATE_CLASS);
        }
        addClass([ntd], data.className);
        ntd.setAttribute('data-date', data.date.getTime().toString());
        if (!isNullOrUndefined(data.groupIndex) || this.parent.uiStateValues.isGroupAdaptive) {
            let groupIndex: number = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                data.groupIndex;
            ntd.setAttribute('data-group-index', '' + groupIndex);
        }
        this.renderDateHeaderElement(data, ntd);
        if (this.parent.activeViewOptions.cellTemplate) {
            let args: CellTemplateArgs = { date: data.date, type: type, groupIndex: data.groupIndex };
            append([].slice.call(this.parent.getCellTemplate()(args)), ntd);
        }
        let args: RenderCellEventArgs = { elementType: type, element: ntd, date: data.date, groupIndex: data.groupIndex };
        this.parent.trigger(event.renderCell, args);
        return ntd;
    }
    public getContentAreaElement(): HTMLElement {
        return this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
    }
    private renderDateHeaderElement(data: TdData, ntd: Element): void {
        if (this.parent.currentView === 'TimelineMonth') {
            return;
        }
        let dateHeader: Element = createElement('div', { className: cls.DATE_HEADER_CLASS });
        dateHeader.innerHTML = (data.date.getDate() === 1 && !this.isCurrentDate(data.date) && !this.parent.isAdaptive) ?
            this.parent.globalize.formatDate(data.date, { format: 'MMM d' }) :
            this.parent.globalize.formatDate(data.date, { skeleton: 'd' });
        ntd.appendChild(dateHeader);
        if (this.getModuleName() === 'month') {
            addClass([dateHeader], cls.NAVIGATE_CLASS);
        }
    }

    public getMonthStart(currentDate: Date): Date {
        let monthStart: Date = util.getWeekFirstDate(util.firstDateOfMonth(currentDate), this.parent.firstDayOfWeek);
        let start: Date = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
        return start;
    }

    public getMonthEnd(currentDate: Date): Date {
        let endDate: Date = util.addMonths(currentDate, this.parent.activeViewOptions.interval - 1);
        let lastWeekOfMonth: Date = util.getWeekFirstDate(util.lastDateOfMonth(endDate), this.parent.firstDayOfWeek);
        let monthEnd: Date = util.addDays(lastWeekOfMonth, util.WEEK_LENGTH - 1);
        return monthEnd;
    }

    public getRenderDates(workDays?: number[]): Date[] {
        let renderDates: Date[] = [];
        let currentDate: Date = util.resetTime(this.parent.selectedDate);
        let start: Date = this.getMonthStart(currentDate);
        let monthEnd: Date = this.getMonthEnd(currentDate);
        do {
            if (this.parent.activeViewOptions.showWeekend) {
                renderDates.push(start);
            } else {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
            }
            start = util.addDays(start, 1);
        } while (start.getTime() <= monthEnd.getTime());
        if (!workDays) {
            this.renderDates = renderDates;
        }
        return renderDates;
    }
    public getNextPreviousDate(type: string): Date {
        if (type === 'next') {
            return util.addMonths(this.parent.selectedDate, this.parent.activeViewOptions.interval);
        } else {
            return util.addMonths(this.parent.selectedDate, -(this.parent.activeViewOptions.interval));
        }
    }
    public getEndDateFromStartDate(start: Date): Date {
        return util.addDays(new Date(start.getTime()), 1);
    }
    public getDateRangeText(): string {
        if (this.parent.isAdaptive || isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            if (this.parent.activeViewOptions.interval > 1) {
                let endDate: Date =
                    util.addMonths(util.lastDateOfMonth(this.parent.selectedDate), this.parent.activeViewOptions.interval - 1);
                if (this.parent.selectedDate.getFullYear() === endDate.getFullYear()) {
                    let monthNames: string = (this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM' }))
                        + ' - ' + (this.parent.globalize.formatDate(endDate, { format: 'MMMM ' })) + endDate.getFullYear();
                    return monthNames;
                }
                return (this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM' })) + ' ' +
                    this.parent.selectedDate.getFullYear() + ' - ' + (this.parent.globalize.formatDate(endDate, { format: 'MMMM ' })) +
                    endDate.getFullYear();
            }
            return this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM y' });
        }
        return this.formatDateRange(this.parent.selectedDate);
    }
    public getLabelText(view: string): string {
        return this.parent.localeObj.getConstant(view) + ' of ' +
            this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM y' });
    }
    private createWeekNumberElement(text?: string): HTMLElement {
        let tr: HTMLElement = createElement('tr');
        let td: HTMLElement = createElement('td', {
            className: cls.WEEK_NUMBER_CLASS,
            attrs: { 'title': (text ? this.parent.localeObj.getConstant('week') + ' ' + text : '') },
            innerHTML: (text || '')
        });
        tr.appendChild(td);
        let args: RenderCellEventArgs = { elementType: 'weekNumberCell', element: td };
        this.parent.trigger(event.renderCell, args);
        return tr;
    }

    public unwireEvents(): void {
        // No scroller events for month view
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'month';
    }
    /**
     * To destroy the month.
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.element) {
            this.unwireEvents();
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
            if (this.parent.scheduleTouchModule) {
                this.parent.scheduleTouchModule.resetValues();
            }
        }
    }
}