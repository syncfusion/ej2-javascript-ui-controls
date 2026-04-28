/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventHandler, formatUnit, isNullOrUndefined, createElement, addClass, append, prepend, remove, extend } from '@syncfusion/ej2-base';
import { IRenderer, TdData, RenderCellEventArgs, CellTemplateArgs, NotifyEventArgs, CellClickEventArgs, CallbackFunction } from '../base/interface';
import { Schedule } from '../base/schedule';
import { ViewBase } from './view-base';
import { MonthEvent } from '../event-renderer/month';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import { NavigationDirection } from '../base/type';

/**
 * month view
 */
export class Month extends ViewBase implements IRenderer {
    public dayNameFormat: string = 'wide';
    public viewClass: string = 'e-month-view';
    public isInverseTableSelect: boolean = false;
    private monthDates: { [key: string]: Date };
    private monthEvent: MonthEvent = null;

    constructor(parent: Schedule) {
        super(parent);
        this.monthDates = {};
    }

    public addEventListener(): void {
        this.parent.on(event.scrollUiUpdate, this.onScrollUIUpdate, this);
        this.parent.on(event.dataReady, this.onDataReady, this);
        this.parent.on(event.cellClick, this.onCellClick, this);
    }

    public removeEventListener(): void {
        if (this.parent) {
            this.parent.off(event.scrollUiUpdate, this.onScrollUIUpdate);
            this.parent.off(event.dataReady, this.onDataReady);
            this.parent.off(event.cellClick, this.onCellClick);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onDataReady(args: NotifyEventArgs): void {
        this.monthEvent = new MonthEvent(this.parent);
        this.monthEvent.renderAppointments();
        this.parent.notify(event.eventsLoaded, {});
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onCellClick(event: CellClickEventArgs): void { /** */ }

    public onContentScroll(e: Event): void {
        if (!this.skipPersistenceSave) {
            this.parent.removeNewEventElement();
            this.parent.notify(event.virtualScroll, e);
            this.scrollTopPanel(<HTMLElement>e.target);
            this.scrollLeftPanel(<HTMLElement>e.target);
            this.parent.uiStateValues.top = (e.target as HTMLElement).scrollTop;
            this.parent.uiStateValues.left = (e.target as HTMLElement).scrollLeft;
            this.setPersistence();
        }
    }

    public scrollLeftPanel(target: HTMLElement): void {
        const leftPanel: HTMLElement = this.getLeftPanelElement();
        if (leftPanel) {
            leftPanel.scrollTop = target.scrollTop;
        }
    }

    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.WEEK_NUMBER_WRAPPER_CLASS) as HTMLElement;
    }

    public onScrollUIUpdate(args: NotifyEventArgs): void {
        const headerHeight: number = this.getHeaderBarHeight();
        const header: HTMLElement = this.getDatesHeaderElement();
        const content: HTMLElement = this.getContentAreaElement();
        const height: number = this.parent.element.offsetHeight - headerHeight - header.offsetHeight;
        const leftPanel: HTMLElement = this.getLeftPanelElement();
        if (this.parent.height !== 'auto') {
            this.setContentHeight(content, leftPanel, height);
        }
        const scrollBarWidth: number = util.getScrollBarWidth();
        (header.firstElementChild as HTMLElement).style[<any>args.cssProperties.rtlBorder] = '';
        header.style[<any>args.cssProperties.rtlPadding] = '';
        if (content.offsetWidth - content.clientWidth > 0) {
            (<HTMLElement>header.firstElementChild).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        } else {
            (<HTMLElement>header.firstElementChild).style[<any>args.cssProperties.border] = '';
            header.style[<any>args.cssProperties.padding] = '';
        }
        this.setColWidth(content);
        if (args.scrollPosition || !args.isPreventScrollUpdate && this.parent.currentView === 'TimelineMonth') {
            const top: number = this.parent.currentView === 'TimelineMonth' ? this.parent.uiStateValues.top : args.scrollPosition.top;
            if (leftPanel) {
                leftPanel.scrollTop = top;
            }
            content.scrollTop = top;
            if (this.parent.uiStateValues.isInitial) {
                this.scrollToSelectedDate();
                this.parent.uiStateValues.isInitial = false;
            } else {
                content.scrollLeft = this.parent.currentView === 'TimelineMonth' ? this.parent.uiStateValues.left :
                    args.scrollPosition.left;
            }
        }
        this.retainScrollPosition();
    }

    private scrollToSelectedDate(): void {
        const selectedDate: Date = new Date(this.parent.selectedDate);
        selectedDate.setHours(0, 0, 0, 0);
        const headerCell: HTMLElement = this.element.querySelector('.' + cls.HEADER_CELLS_CLASS + '[data-date="'
            + selectedDate.getTime().toString() + '"]');
        const content: HTMLElement = this.getContentAreaElement();
        if (!isNullOrUndefined(headerCell)) {
            content.scrollLeft = !this.parent.enableRtl ?
                headerCell.offsetLeft : -(this.parent.getContentTable().offsetWidth - headerCell.offsetLeft - headerCell.offsetWidth);
        } else {
            content.scrollLeft = 0;
        }
        if (content.scrollLeft === 0 && this.parent.uiStateValues.isInitial) {
            this.parent.uiStateValues.left = 0;
        }
    }

    public setContentHeight(content: HTMLElement, leftPanelElement: HTMLElement, height: number): void {
        content.style.height = 'auto';
        if (this.parent.currentView === 'Month') {
            content.style.height = formatUnit(height);
        }
        if (leftPanelElement) {
            if (this.parent.currentView === 'MonthAgenda') {
                height = (this.parent.activeViewOptions.interval > 1) ?
                    (<HTMLElement>this.getContentAreaElement().firstElementChild).offsetHeight :
                    (<HTMLElement>this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS)).offsetHeight;
            }
            leftPanelElement.style.height = 'auto';
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
    }

    public generateColumnLevels(): TdData[][] {
        let colLevels: TdData[][] = [];
        const level: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            colLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.currentView === 'MonthAgenda') {
                colLevels = [level];
            }
            if (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0) {
                const resourceLevel: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                let levels: TdData[] = this.getDateSlots(resourceLevel.renderDates, resourceLevel.workDays);
                if (this.parent.activeViewOptions.group.byDate && this.parent.activeViewOptions.group.hideNonWorkingDays) {
                    const index: number = levels.findIndex((x: TdData, index: number) =>
                        index !== 0 && x.date.getDay() === levels[0].date.getDay());
                    levels = index > -1 ? levels.slice(0, index) : levels;
                }
                colLevels = [levels];
            }
        } else {
            colLevels.push(level);
        }
        this.colLevels = colLevels;
        return colLevels;
    }

    public getDateSlots(renderDates: Date[], workDays: number[]): TdData[] {
        const count: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH : workDays.length;
        const dateSlots: TdData[] = [];
        const isCurrentMonth: boolean = this.isCurrentMonth(this.parent.selectedDate);
        for (let col: number = 0; col < count; col++) {
            const classList: string[] = [cls.HEADER_CELLS_CLASS];
            const currentDateIndex: number[] = renderDates.slice(0, count).map((date: Date) => date.getDay());
            if (isCurrentMonth && currentDateIndex.indexOf(this.parent.currentTimezoneDate.getDay()) === col) {
                classList.push(cls.CURRENT_DAY_CLASS);
            }
            dateSlots.push({ date: renderDates[parseInt(col.toString(), 10)], type: 'monthDay', className: classList, colSpan: 1, workDays: workDays });
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
        const clsList: string[] = [this.viewClass];
        clsList.push(type);
        if (this.parent.activeViewOptions.group.byDate) {
            clsList.push('e-by-date');
            if (this.parent.currentView !== 'Month') {
                this.parent.activeViewOptions.group.hideNonWorkingDays = false;
            }
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling && !this.parent.uiStateValues.isGroupAdaptive) {
            clsList.push(cls.VIRTUAL_SCROLL_CLASS);
        }
        if (this.parent.rowAutoHeight && this.parent.eventSettings.ignoreWhitespace) {
            clsList.push(cls.IGNORE_WHITESPACE);
        }
        addClass([this.element], clsList);
        this.renderPanel(type);
        this.element.appendChild(this.createTableLayout(cls.OUTER_TABLE_CLASS) as HTMLElement);
        this.element.querySelector('table').setAttribute('role', 'presentation');
        this.colLevels = this.generateColumnLevels();
        this.renderHeader();
        this.renderContent();
        const target: HTMLElement = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        if (this.parent.uiStateValues.isGroupAdaptive && !target.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(event.contentReady, {});
        if (this.parent.uiStateValues.isCustomMonth) {
            this.parent.uiStateValues.isCustomMonth = false;
        }
    }
    public refreshHeader(): void {
        remove(this.element.querySelector('tbody tr'));
        this.renderHeader();
        this.parent.notify(event.contentReady, {});
        const dateHeader: HTMLElement = (this.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement);
        const contentWrapper: HTMLElement = (this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement);
        if (dateHeader) {
            dateHeader.scrollLeft = this.parent.uiStateValues.left;
        }
        if (contentWrapper) {
            contentWrapper.scrollLeft = this.parent.uiStateValues.left;
        }
    }

    private wireCellEvents(element: Element): void {
        EventHandler.add(element, 'mousedown', this.parent.workCellAction.cellMouseDown, this.parent.workCellAction);
        EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
        }
    }

    public renderHeader(): void {
        const tr: Element = createElement('tr');
        this.renderLeftIndent(tr);
        const dateTd: Element = createElement('td');
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
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.renderedResources = <TdData[]>extend([], this.parent.resourceBase.lastResourceLevel, null, true);
        }
        const tr: Element = createElement('tr');
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(this.renderWeekNumberContent());
        }
        const workTd: Element = createElement('td');
        const levels: TdData[][] = this.colLevels.slice(0);
        if (this.parent.virtualScrollModule) {
            this.resetColLevels();
        }
        const wrap: Element = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        const contentArea: Element = this.renderContentArea();
        if (this.parent.currentView === 'Month') {
            wrap.appendChild(contentArea);
        } else {
            const monthAgendaWrapper: HTMLElement = createElement('div', { className: cls.TABLE_CONTAINER_CLASS });
            monthAgendaWrapper.appendChild(contentArea);
            wrap.appendChild(monthAgendaWrapper);
        }
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        workTd.appendChild(wrap);
        tr.appendChild(workTd);
        if (this.parent.virtualScrollModule) {
            this.colLevels = levels;
            this.parent.virtualScrollModule.renderVirtualTrack(wrap);
        }
        this.element.querySelector('tbody').appendChild(tr);
        this.renderAppointmentContainer();
    }

    private renderWeekNumberContent(): HTMLElement {
        const dateCol: Date[] = this.renderDates.map((date: Date) => new Date(+date));
        const td: HTMLElement = createElement('td');
        const contentWrapper: HTMLElement = createElement('div', { className: cls.WEEK_NUMBER_WRAPPER_CLASS });
        td.appendChild(contentWrapper);
        const contentWrapTable: HTMLElement = this.createTableLayout() as HTMLElement;
        contentWrapper.appendChild(contentWrapTable);
        const noOfDays: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH :
            this.parent.activeViewOptions.workDays.length;
        for (let i: number = 0, length: number = (this.renderDates.length / noOfDays); i < length; i++) {
            const dates: Date[] = dateCol.splice(0, noOfDays);
            const weekNumber: string = this.parent.getWeekNumberContent(dates);
            contentWrapTable.querySelector('tbody').appendChild(this.createWeekNumberElement(weekNumber));
        }
        return td;
    }

    public renderAppointmentContainer(): void {
        //Here needs to render mobile view appointment details on selected date
    }

    public renderDatesHeader(): Element {
        const container: Element = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        const wrap: Element = createElement('div', { className: cls.DATE_HEADER_WRAP_CLASS });
        container.appendChild(wrap);
        const table: Element = this.createTableLayout();
        if (this.parent.currentView === 'Month') {
            const thead: Element = createElement('thead');
            thead.appendChild(createElement('tr'));
            prepend([thead], table);
        }
        this.createColGroup(table, this.colLevels[this.colLevels.length - 1]);
        const trEle: Element = createElement('tr');
        for (let i: number = 0; i < this.colLevels.length; i++) {
            const level: TdData[] = this.colLevels[parseInt(i.toString(), 10)];
            const ntr: Element = trEle.cloneNode() as Element;
            for (let j: number = 0; j < level.length; j++) {
                const td: TdData = level[parseInt(j.toString(), 10)];
                ntr.appendChild(this.createHeaderCell(td));
            }
            table.querySelector('tbody').appendChild(ntr);
        }
        wrap.appendChild(table);
        return container;
    }

    private createHeaderCell(td: TdData): Element {
        const tdEle: Element = createElement('td');
        this.addAttributes(td, tdEle);
        if (td.type === 'monthDay') {
            const ele: Element = createElement(
                'span', { innerHTML: util.capitalizeFirstWord(this.parent.getDayNames(this.dayNameFormat)[td.date.getDay()], 'single') });
            tdEle.appendChild(ele);
        }
        if (td.type === 'resourceHeader') {
            this.setResourceHeaderContent(tdEle, td);
        }
        if (td.type === 'dateHeader') {
            addClass([tdEle], cls.DATE_HEADER_CLASS);
            tdEle.setAttribute('data-date', td.date.getTime().toString());
            if (this.parent.activeViewOptions.dateHeaderTemplate) {
                const cellArgs: CellTemplateArgs = { date: td.date, type: td.type };
                const elementId: string = this.parent.element.id + '_';
                const viewName: string = this.parent.activeViewOptions.dateHeaderTemplateName;
                const templateId: string = elementId + viewName + 'dateHeaderTemplate';
                const dateTemplate: HTMLElement[] = [].slice.call(
                    this.parent.getDateHeaderTemplate()(cellArgs, this.parent, 'dateHeaderTemplate', templateId,
                                                        false, undefined, undefined, this.parent.root));
                if (dateTemplate && dateTemplate.length) {
                    append(dateTemplate, tdEle);
                }
            } else {
                const ele: Element = createElement('span', { className: cls.NAVIGATE_CLASS });
                const skeleton: string = 'full';
                const title: string =
                    this.parent.globalize.formatDate(td.date, { skeleton: skeleton, calendar: this.parent.getCalendarMode() });
                ele.setAttribute('title', util.capitalizeFirstWord(title, 'multiple'));
                const innerText: string =
                    (this.parent.calendarUtil.isMonthStart(td.date) && !this.isCurrentDate(td.date) && !this.parent.isAdaptive) ?
                        this.parent.globalize.formatDate(td.date, { format: 'MMM d', calendar: this.parent.getCalendarMode() }) :
                        this.parent.globalize.formatDate(td.date, { skeleton: 'd', calendar: this.parent.getCalendarMode() });
                ele.innerHTML = util.capitalizeFirstWord(innerText, 'single');
                tdEle.appendChild(ele);
            }
            this.wireCellEvents(tdEle);
        }
        const args: RenderCellEventArgs = { elementType: td.type, element: tdEle, date: td.date, groupIndex: td.groupIndex };
        this.parent.trigger(event.renderCell, args);
        return tdEle;
    }

    public getContentSlots(): TdData[][] {
        if (!(this.colLevels[this.colLevels.length - 1] && this.colLevels[this.colLevels.length - 1][0])) {
            return [];
        }
        const slotDatas: TdData[][] = [];
        const prepareSlots: CallbackFunction = (rowIndex: number, renderDate: Date, resData: TdData, classList?: string[]) => {
            const data: TdData = {
                date: new Date(+renderDate), groupIndex: resData.groupIndex, workDays: resData.workDays,
                type: 'monthCells', className: classList || [cls.WORK_CELLS_CLASS]
            };
            if (!slotDatas[parseInt(rowIndex.toString(), 10)]) {
                slotDatas[parseInt(rowIndex.toString(), 10)] = [];
            }
            slotDatas[parseInt(rowIndex.toString(), 10)].push(data);
        };
        const includeResource: boolean = this.parent.currentView !== 'MonthAgenda' &&
            this.parent.activeViewOptions.group.resources.length > 0;
        if (includeResource && !this.parent.uiStateValues.isGroupAdaptive && !this.parent.activeViewOptions.group.byDate) {
            for (const res of this.colLevels[this.colLevels.length - 2]) {
                const dates: Date[] = res.renderDates.map((date: Date) => new Date(+date));
                const count: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH : res.workDays.length;
                for (let i: number = 0; i < (res.renderDates.length / count); i++) {
                    const colDates: Date[] = dates.splice(0, count);
                    for (const colDate of colDates) {
                        prepareSlots(i, colDate, res);
                    }
                }
            }
        } else {
            const dates: Date[] = this.renderDates.map((date: Date) => new Date(+date));
            const count: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH :
                this.parent.activeViewOptions.workDays.length;
            const level: TdData[] = this.colLevels.slice(0, 1)[0];
            const startIndex: number = this.renderDates.map(Number).indexOf(+level[0].date);
            for (let i: number = 0; i < (this.renderDates.length / count); i++) {
                const colDates: Date[] = dates.splice(0, count);
                let k: number = startIndex;
                for (let j: number = startIndex; j < (this.colLevels[0].length + startIndex) && j < colDates.length; j++) {
                    const colDate: Date = colDates[parseInt(k.toString(), 10)];
                    k++;
                    if (includeResource) {
                        const lastRow: TdData[] = this.colLevels[(this.colLevels.length - 1)];
                        const rowCount: number = lastRow.length / count;
                        let resourcesTd: TdData[] = lastRow.slice(0, rowCount);
                        if (this.parent.activeViewOptions.group.hideNonWorkingDays) {
                            resourcesTd = lastRow.filter((x: TdData) => x.date.getDay() === colDate.getDay());
                            if (resourcesTd.length === 0) {
                                j = j - 1;
                                continue;
                            }
                        }
                        for (let resIndex: number = 0; resIndex < resourcesTd.length; resIndex++) {
                            let clsList: string[];
                            if (resIndex !== 0) {
                                clsList = [cls.WORK_CELLS_CLASS, cls.DISABLE_DATE];
                            }
                            prepareSlots(i, colDate, resourcesTd[parseInt(resIndex.toString(), 10)], clsList);
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
        if (!this.isCustomMonth() && this.isOtherMonth(data.date)) {
            data.className.push(cls.OTHERMONTH_CLASS);
        }
        if (!this.parent.isMinMaxDate(data.date)) {
            data.className.push(cls.DISABLE_DATES);
        }
        this.updateSelectedCellClass(data);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public updateSelectedCellClass(data: TdData): void {
        return;
    }

    private isOtherMonth(date: Date): boolean {
        return date.getTime() < this.monthDates.start.getTime() || date.getTime() > this.monthDates.end.getTime();
    }

    public renderContentArea(): Element {
        const tbl: Element = this.createTableLayout(cls.CONTENT_TABLE_CLASS);
        this.setAriaAttributes(tbl);
        this.addAutoHeightClass(tbl);
        if (this.parent.currentView === 'TimelineMonth') {
            this.createColGroup(tbl, this.colLevels[this.colLevels.length - 1]);
        }
        const monthDate: Date = new Date(this.parent.selectedDate.getTime());
        this.monthDates = {
            start: this.parent.calendarUtil.firstDateOfMonth(monthDate),
            end: this.parent.calendarUtil.lastDateOfMonth(util.addMonths(monthDate, this.parent.activeViewOptions.interval - 1))
        };
        const tBody: Element = tbl.querySelector('tbody');
        append(this.getContentRows(), tBody);
        this.wireCellEvents(tBody);
        return tbl;
    }

    public getContentRows(): Element[] {
        const trows: Element[] = [];
        const tr: Element = createElement('tr');
        const td: Element = createElement('td');
        const slotDatas: TdData[][] = this.getContentSlots();
        const isTimeline: boolean = this.parent.currentView === 'TimelineMonth';
        const existingGroupIndices: number[] = isTimeline ? this.getGroupIndices() : [];
        for (let row: number = 0; row < slotDatas.length; row++) {
            if (existingGroupIndices.length > 0 &&
                existingGroupIndices.indexOf(slotDatas[parseInt(row.toString(), 10)][0].groupIndex) > -1) {
                continue;
            }
            const ntr: Element = tr.cloneNode() as Element;
            for (let col: number = 0; col < slotDatas[parseInt(row.toString(), 10)].length; col++) {
                const ntd: Element = this.createContentTd(slotDatas[parseInt(row.toString(), 10)][parseInt(col.toString(), 10)], td);
                ntr.appendChild(ntd);
            }
            trows.push(ntr);
        }
        return trows;
    }

    public createContentTd(data: TdData, td: Element): Element {
        const ntd: Element = td.cloneNode() as Element;
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
            const groupIndex: number = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                data.groupIndex;
            ntd.setAttribute('data-group-index', '' + groupIndex);
        }
        this.renderDateHeaderElement(data, ntd);
        if (this.parent.activeViewOptions.cellTemplate) {
            const args: CellTemplateArgs = { date: data.date, type: type, groupIndex: data.groupIndex };
            const scheduleId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.cellTemplateName;
            const templateId: string = scheduleId + viewName + 'cellTemplate';
            const cellTemplate: HTMLElement[] = [].slice.call(
                this.parent.getCellTemplate()(args, this.parent, 'cellTemplate', templateId,
                                              false, undefined, undefined, this.parent.root));
            append(cellTemplate, ntd);
        }
        const args: RenderCellEventArgs = { elementType: type, element: ntd, date: data.date, groupIndex: data.groupIndex };
        this.parent.trigger(event.renderCell, args);
        return ntd;
    }

    private renderDateHeaderElement(data: TdData, ntd: Element): void {
        if (this.parent.currentView === 'TimelineMonth') {
            return;
        }
        const dateHeader: Element = createElement('div', { className: cls.DATE_HEADER_CLASS });
        if (this.parent.activeViewOptions.cellHeaderTemplate) {
            const args: CellTemplateArgs = { date: data.date, type: data.type, groupIndex: data.groupIndex };
            const scheduleId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.cellHeaderTemplateName;
            const templateId: string = scheduleId + viewName + 'cellHeaderTemplate';
            const cellHeaderTemplate: HTMLElement[] = [].slice.call(
                this.parent.getCellHeaderTemplate()(args, this.parent, 'cellHeaderTemplate', templateId, false,
                                                    undefined, undefined, this.parent.root));
            append(cellHeaderTemplate, dateHeader);
        } else {
            const innerText: string =
                (this.parent.calendarUtil.isMonthStart(data.date) && !this.isCurrentDate(data.date) && !this.parent.isAdaptive) ?
                    this.parent.globalize.formatDate(data.date, { format: 'MMM d', calendar: this.parent.getCalendarMode() }) :
                    this.parent.globalize.formatDate(data.date, { skeleton: 'd', calendar: this.parent.getCalendarMode() });
            dateHeader.innerHTML = util.capitalizeFirstWord(innerText, 'single');
        }
        ntd.appendChild(dateHeader);
        if (this.getModuleName() === 'month') {
            addClass([dateHeader], cls.NAVIGATE_CLASS);
            const skeleton: string = 'full';
            const announcementText: string =
                this.parent.globalize.formatDate(data.date, { skeleton: skeleton, calendar: this.parent.getCalendarMode() });
            ntd.setAttribute('aria-label', announcementText);
        }
    }

    public getMonthStart(currentDate: Date): Date {
        const useDisplayDate: boolean = this.parent.currentView === 'Month' && !isNullOrUndefined(
            this.parent.activeViewOptions.displayDate) && !(this.parent.uiStateValues.isSwipeScroll) &&
            (this.parent.uiStateValues.isCustomMonth || this.isCustomRange());
        const date: Date = useDisplayDate ? this.parent.activeViewOptions.displayDate : !(this.parent.uiStateValues.isCustomMonth ||
            (!this.parent.uiStateValues.isSwipeScroll && this.isCustomRange())) && this.isCustomMonth() ? currentDate :
            this.parent.calendarUtil.firstDateOfMonth(currentDate);
        const monthStart: Date = util.getWeekFirstDate(date, this.parent.activeViewOptions.firstDayOfWeek);
        return new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
    }

    public getMonthEnd(currentDate: Date): Date {
        if (this.isCustomMonth()) {
            const start: Date = this.getMonthStart(currentDate);
            const numberOfDays: number = util.WEEK_LENGTH * (this.parent.activeViewOptions.numberOfWeeks > 0 ?
                this.parent.activeViewOptions.numberOfWeeks : util.DEFAULT_WEEKS);
            return util.addDays(start, (numberOfDays - 1));
        } else {
            const endDate: Date = util.addMonths(currentDate, this.parent.activeViewOptions.interval - 1);
            const lastWeekOfMonth: Date =
                util.getWeekFirstDate(this.parent.calendarUtil.lastDateOfMonth(endDate), this.parent.activeViewOptions.firstDayOfWeek);
            return util.addDays(lastWeekOfMonth, util.WEEK_LENGTH - 1);
        }
    }

    private isCustomRange(): boolean {
        const dates: Date[] = this.parent.getCurrentViewDates();
        if (dates && dates.length > 0) {
            const selectedTime: number = util.resetTime(this.parent.selectedDate).getTime();
            const weekFirstDate: Date = util.getWeekFirstDate(dates[dates.length - 1], this.parent.activeViewOptions.firstDayOfWeek);
            return !(selectedTime >= util.getWeekFirstDate(dates[0], this.parent.activeViewOptions.firstDayOfWeek).getTime() &&
                selectedTime <= util.addDays(weekFirstDate, 6).getTime());
        }
        return false;
    }

    public getRenderDates(workDays?: number[], selectedDate: Date = this.parent.selectedDate): Date[] {
        const renderDates: Date[] = [];
        const currentDate: Date = util.resetTime(selectedDate);
        let start: Date = this.getMonthStart(currentDate);
        const monthEnd: Date = this.getMonthEnd(currentDate);
        do {
            if (this.parent.activeViewOptions.showWeekend) {
                renderDates.push(start);
            } else {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
            }
            start = util.addDays(start, 1);
            if (start.getHours() > 0) {
                start = util.resetTime(start);
            }
        } while (start.getTime() <= monthEnd.getTime());
        if (!workDays) {
            this.renderDates = renderDates;
        }
        if (this.parent.headerModule) {
            this.parent.headerModule.previousNextIconHandler();
        }
        return renderDates;
    }

    public getNextPreviousDate(type: NavigationDirection): Date {
        if (this.isCustomMonth()) {
            const dates: Date[] = this.parent.getCurrentViewDates();
            const date: Date = util.getWeekFirstDate(type === 'Next' ? dates[dates.length - 1]
                : dates[0], this.parent.activeViewOptions.firstDayOfWeek);
            return util.addDays(date, type === 'Next' ? util.WEEK_LENGTH : -(this.parent.activeViewOptions.numberOfWeeks > 0 ?
                this.parent.activeViewOptions.numberOfWeeks : util.DEFAULT_WEEKS) * util.WEEK_LENGTH);
        } else {
            return util.addMonths(this.parent.selectedDate, ((type === 'Next' ? 1 : -1) * this.parent.activeViewOptions.interval));
        }
    }

    public getStartDate(): Date {
        return this.getMonthStart(this.parent.selectedDate);
    }

    public getEndDate(): Date {
        return this.getMonthEnd(this.parent.selectedDate);
    }

    public getEndDateFromStartDate(start: Date): Date {
        return util.addDays(new Date(start.getTime()), 1);
    }

    public getDateRangeText(startDate: Date = this.parent.selectedDate, dateCollection: Date[] = null): string {
        if (this.parent.isAdaptive || isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            const maxNumberOfDaysPerWeek: number = 7;
            startDate = !isNullOrUndefined(dateCollection) && dateCollection.length > maxNumberOfDaysPerWeek - 1
                ? dateCollection[maxNumberOfDaysPerWeek - 1] : startDate;
            let endDate: Date;
            let updateCustomRange: boolean = false;

            if (this.isCustomMonth()) {
                const dates: Date[] = !isNullOrUndefined(dateCollection) && dateCollection.length > 0 ? dateCollection :
                    this.parent.getCurrentViewDates();
                updateCustomRange = dates[0].getMonth() !== dates[dates.length - 1].getMonth() ||
                    dates[0].getFullYear() !== dates[dates.length - 1].getFullYear();
                if (updateCustomRange) {
                    startDate = dates[0];
                    endDate = dates[dates.length - 1];
                }
            }

            const isUpdateDateRange: boolean = (this.parent.currentView !== 'Month' || !this.isCustomMonth());
            if (this.parent.activeViewOptions.interval > 1 && isUpdateDateRange || updateCustomRange) {
                endDate = endDate ? endDate : util.addMonths(util.lastDateOfMonth(startDate), this.parent.activeViewOptions.interval - 1);
                if (startDate.getFullYear() === endDate.getFullYear()) {
                    const monthNames: string = (this.parent.globalize.formatDate(
                        startDate, { format: 'MMMM', calendar: this.parent.getCalendarMode() })) + ' - ' +
                        (this.parent.globalize.formatDate(endDate, { format: 'MMMM ', calendar: this.parent.getCalendarMode() })) +
                        this.parent.globalize.formatDate(endDate, { skeleton: 'y', calendar: this.parent.getCalendarMode() });
                    return util.capitalizeFirstWord(monthNames, 'single');
                }
                const text: string = (this.parent.globalize.formatDate(
                    startDate, { format: 'MMMM', calendar: this.parent.getCalendarMode() })) + ' ' +
                    startDate.getFullYear() + ' - ' +
                    this.parent.globalize.formatDate(endDate, { format: 'MMMM ', calendar: this.parent.getCalendarMode() }) +
                    this.parent.globalize.formatDate(endDate, { skeleton: 'y', calendar: this.parent.getCalendarMode() });
                return util.capitalizeFirstWord(text, 'single');
            }
            const format: string = (this.parent.activeViewOptions.dateFormat) ? this.parent.activeViewOptions.dateFormat : 'MMMM y';
            return util.capitalizeFirstWord(
                this.parent.globalize.formatDate(startDate, { format: format, calendar: this.parent.getCalendarMode() }), 'single');
        }
        return this.formatDateRange(!isNullOrUndefined(dateCollection) && dateCollection.length > 0 ? dateCollection[0] :
            this.parent.selectedDate);
    }

    public getLabelText(view: string): string {
        const viewStr: string = view.charAt(0).toLowerCase() + view.substring(1);
        return this.formatViewLabel(viewStr, this.getStartDate(), this.getEndDate());
    }

    private createWeekNumberElement(text?: string): HTMLElement {
        const tr: HTMLElement = createElement('tr');
        const td: HTMLElement = createElement('td', {
            className: cls.WEEK_NUMBER_CLASS,
            attrs: { 'title': (text ? this.parent.localeObj.getConstant('week') + ' ' + text : '') },
            innerHTML: (text || '')
        });
        tr.appendChild(td);
        const args: RenderCellEventArgs = { elementType: 'weekNumberCell', element: td };
        this.parent.trigger(event.renderCell, args);
        return tr;
    }

    public unWireEvents(): void {
        const contentScrollableEle: Element = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        if (contentScrollableEle) {
            EventHandler.remove(contentScrollableEle, 'scroll', this.onContentScroll);
        }
    }

    private isCustomMonth(): boolean {
        return this.parent.currentView === 'Month' &&
            (!isNullOrUndefined(this.parent.activeViewOptions.displayDate) || this.parent.activeViewOptions.numberOfWeeks > 0);
    }

    protected getModuleName(): string {
        return 'month';
    }

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            this.parent = null;
            return;
        }
        if (this.element) {
            if (this.monthEvent) {
                this.monthEvent.destroy();
                this.monthEvent = null;
            }
            this.unWireEvents();
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            if (this.parent.scheduleTouchModule) {
                this.parent.scheduleTouchModule.resetValues();
            }
            super.destroy();
        }
    }

}
