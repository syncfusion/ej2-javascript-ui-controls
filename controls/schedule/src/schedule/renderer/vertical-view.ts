import { compile, isNullOrUndefined, extend, EventHandler, formatUnit, Browser } from '@syncfusion/ej2-base';
import { createElement, remove, addClass, removeClass, append, prepend } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { WorkCellInteraction } from '../actions/work-cells';
import { ViewBase } from './view-base';
import { VerticalEvent } from '../event-renderer/vertical-view';
import { MonthEvent } from '../event-renderer/month';
import { RenderCellEventArgs, CellTemplateArgs, TdData, NotifyEventArgs, IRenderer, TimeSlotData } from '../base/interface';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';

const MAJOR_SLOT_TEMPLATE: string = '<span>${getTime(date)}</span>';
const MINOR_SLOT_TEMPLATE: string = '&nbsp;';

/**
 * vertical view
 */
export class VerticalView extends ViewBase implements IRenderer {
    public currentTimeIndicatorTimer: number;
    public viewClass: string = 'e-day-view';
    public isInverseTableSelect: boolean = true;
    public baseCssClass: string = 'e-vertical-view';
    public workCellAction: WorkCellInteraction;
    public dateHeaderTemplate: string = '<div class="e-header-day">${getDayName(date)}</div>' +
        '<div class="e-header-date e-navigate" role="link">${getDate(date)}</div>';
    /**
     * Constructor for vertical view
     */
    constructor(parent: Schedule) {
        super(parent);
        this.workCellAction = new WorkCellInteraction(parent);
    }
    public addEventListener(): void {
        this.parent.on(event.scrollUiUpdate, this.scrollUiUpdate, this);
        this.parent.on(event.dataReady, this.renderEvents, this);
    }
    public removeEventListener(): void {
        this.parent.off(event.scrollUiUpdate, this.scrollUiUpdate);
        this.parent.off(event.dataReady, this.renderEvents);
    }
    public renderEvents(): void {
        if (this.parent.activeViewOptions.timeScale.enable) {
            let appointment: VerticalEvent = new VerticalEvent(this.parent);
            appointment.renderAppointments();
        } else {
            let appointment: MonthEvent = new MonthEvent(this.parent);
            appointment.renderAppointments();
        }
    }
    private onContentScroll(e: Event): void {
        let target: HTMLElement = <HTMLElement>e.target;
        this.scrollLeftPanel(target);
        this.scrollTopPanel(target);
        if (!this.parent.isAdaptive) {
            this.parent.uiStateValues.top = target.scrollTop;
        }
        this.parent.uiStateValues.left = target.scrollLeft;
        if (!isNullOrUndefined(this.parent.quickPopup)) {
            this.parent.quickPopup.quickPopupHide();
        }
    }
    private onApaptiveMove(e: Event): void {
        if (this.parent.uiStateValues.action) {
            e.preventDefault();
        }
    }
    private onApaptiveScroll(e: Event): void {
        this.parent.uiStateValues.top = (<HTMLElement>e.target).scrollTop;
    }
    public scrollLeftPanel(target: HTMLElement): void {
        let leftPanel: HTMLElement = this.getLeftPanelElement();
        if (!isNullOrUndefined(leftPanel)) {
            leftPanel.scrollTop = target.scrollTop;
        }
    }
    private scrollUiUpdate(args: NotifyEventArgs): void {
        let headerBarHeight: number = this.getHeaderBarHeight();
        let timecells: HTMLElement = this.getLeftPanelElement();
        let content: HTMLElement = this.getScrollableElement() as HTMLElement;
        let header: HTMLElement = this.getDatesHeaderElement();
        let scrollerHeight: number = this.parent.element.offsetHeight - headerBarHeight - header.offsetHeight;
        this.setContentHeight(content, timecells, scrollerHeight);
        let scrollBarWidth: number = util.getScrollBarWidth();
        // tslint:disable:no-any
        if (content.offsetWidth - content.clientWidth > 0) {
            (header.firstChild as HTMLElement).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        } else {
            (header.firstChild as HTMLElement).style[<any>args.cssProperties.border] = '';
            header.style[<any>args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
        if (this.parent.uiStateValues.isInitial || this.isTimelineView()) {
            this.scrollToWorkHour();
            this.parent.uiStateValues.isInitial = this.isTimelineView();
        } else {
            content.scrollTop = this.parent.uiStateValues.top;
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.highlightCurrentTime();
        }
    }
    public setContentHeight(element: HTMLElement, leftPanelElement: HTMLElement, height: number): void {
        if (this.parent.isAdaptive && !this.isTimelineView()) {
            element.style.height = formatUnit(height);
        } else {
            if (!isNullOrUndefined(leftPanelElement)) {
                leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(element));
            }
            element.style.height = formatUnit(height);
        }
    }
    public scrollToWorkHour(): void {
        if (this.parent.workHours.highlight) {
            let firstWorkHourCell: HTMLElement = <HTMLElement>this.element.querySelector('.' + cls.WORK_HOURS_CLASS);
            if (firstWorkHourCell) {
                this.getScrollableElement().scrollTop = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.top = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.left = 0;
            }
        }
    }
    public scrollToHour(hour: string): void {
        let date: Date = this.parent.globalize.parseDate(hour, { skeleton: 'Hm' });
        if (isNullOrUndefined(date)) {
            return;
        }
        this.getScrollableElement().scrollTop = this.getTopFromDateTime(date);
    }
    public generateColumnLevels(): TdData[][] {
        let level: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        let columnLevels: TdData[][] = [];
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            columnLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.uiStateValues.isGroupAdaptive) {
                let resourceLevel: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                let resStartHour: string = resourceLevel.resourceData[resourceLevel.resource.startHourField] as string;
                let resEndHour: string = resourceLevel.resourceData[resourceLevel.resource.endHourField] as string;
                let dateSlots: TdData[] = this.getDateSlots(resourceLevel.renderDates, resourceLevel.workDays, resStartHour, resEndHour);
                columnLevels = [dateSlots];
            }
        } else {
            columnLevels.push(level);
        }
        this.colLevels = columnLevels;
        return columnLevels;
    }
    public getDateSlots(renderDates: Date[], workDays: number[], workStartHour: string = this.parent.workHours.start, workEndHour: string =
        this.parent.workHours.end): TdData[] {
        let dateCol: TdData[] = [];
        let start: Date = this.parent.globalize.parseDate(workStartHour, { skeleton: 'Hm' });
        let end: Date = this.parent.globalize.parseDate(workEndHour, { skeleton: 'Hm' });
        for (let col of renderDates) {
            let classList: string[] = [cls.HEADER_CELLS_CLASS];
            if (this.isCurrentDate(col)) {
                classList.push(cls.CURRENT_DAY_CLASS);
            }
            dateCol.push({
                date: col, type: 'dateHeader', className: classList, colSpan: 1,
                workDays: workDays, startHour: new Date(+start), endHour: new Date(+end)
            });
        }
        return dateCol;
    }
    private isWorkHourRange(date: Date): boolean {
        return (this.getStartHour().getTime() <= date.getTime()) && (this.getEndHour().getTime() >= date.getTime());
    }
    public highlightCurrentTime(): void {
        if (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return;
        }
        if (this.parent.showTimeIndicator && this.isWorkHourRange(new Date())) {
            let currentDateIndex: number[] = this.getCurrentTimeIndicatorIndex();
            if (currentDateIndex.length > 0) {
                this.changeCurrentTimePosition();
                if (isNullOrUndefined(this.currentTimeIndicatorTimer)) {
                    this.currentTimeIndicatorTimer = window.setInterval(() => { this.changeCurrentTimePosition(); }, util.MS_PER_MINUTE);
                }
            } else {
                this.clearCurrentTimeIndicatorTimer();
            }
        } else {
            this.clearCurrentTimeIndicatorTimer();
        }
    }
    public getCurrentTimeIndicatorIndex(): number[] {
        let currentDateIndex: number[] = [];
        if (!isNullOrUndefined(this.parent.resourceBase) && (this.parent.activeViewOptions.group.resources.length > 0) &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            let count: number = 0;
            for (let resource of this.parent.resourceBase.lastResourceLevel) {
                let index: number = this.parent.getIndexOfDate(resource.renderDates, util.resetTime(new Date()));
                if (index >= 0) {
                    let resIndex: number = this.parent.activeViewOptions.group.byDate ?
                        (this.parent.resourceBase.lastResourceLevel.length * index) + count : count + index;
                    currentDateIndex.push(resIndex);
                }
                count += this.parent.activeViewOptions.group.byDate ? 1 : resource.renderDates.length;
            }
        } else {
            let renderDates: Date[] = (this.parent.uiStateValues.isGroupAdaptive) ?
                this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex].renderDates : this.renderDates;
            let index: number = this.parent.getIndexOfDate(renderDates, util.resetTime(new Date()));
            if (index >= 0) {
                currentDateIndex.push(index);
            }
        }
        return currentDateIndex;
    }
    private clearCurrentTimeIndicatorTimer(): void {
        if (!isNullOrUndefined(this.currentTimeIndicatorTimer)) {
            window.clearInterval(this.currentTimeIndicatorTimer);
            this.currentTimeIndicatorTimer = null;
            this.removeCurrentTimeIndicatorElements();
        }
    }
    public removeCurrentTimeIndicatorElements(): void {
        let queryString: string = '.' + cls.PREVIOUS_TIMELINE_CLASS + ',.' + cls.CURRENT_TIMELINE_CLASS + ',.' + cls.CURRENT_TIME_CLASS;
        let timeIndicator: HTMLElement[] = [].slice.call(this.element.querySelectorAll(queryString));
        timeIndicator.forEach((indicator: HTMLElement) => remove(indicator));
    }
    public changeCurrentTimePosition(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeCurrentTimeIndicatorElements();
        let currentDateIndex: number[] = this.getCurrentTimeIndicatorIndex();
        let firstRow: HTMLTableRowElement = (this.parent.getContentTable() as HTMLTableElement).rows[0];
        let top: number = this.getTopFromDateTime(new Date());
        let topInPx: string = formatUnit(top);
        let rowIndex: number = Math.floor(top / firstRow.cells[0].offsetHeight);
        if (isNullOrUndefined(rowIndex) || isNaN(rowIndex)) { return; }
        let curTimeWrap: NodeListOf<Element> = this.element.querySelectorAll('.' + cls.TIMELINE_WRAPPER_CLASS);
        for (let i: number = 0, length: number = currentDateIndex[0]; i < length; i++) {
            curTimeWrap[i].appendChild(createElement('div', { className: cls.PREVIOUS_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        for (let day of currentDateIndex) {
            curTimeWrap[day].appendChild(createElement('div', { className: cls.CURRENT_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        let currentTimeEle: HTMLElement = createElement('div', {
            innerHTML: this.parent.getTimeString(new Date()),
            className: cls.CURRENT_TIME_CLASS,
            styles: 'top:' + topInPx
        });
        let timeCellsWrap: Element = this.getLeftPanelElement();
        removeClass(timeCellsWrap.querySelectorAll('.' + cls.HIDE_CHILDS_CLASS), cls.HIDE_CHILDS_CLASS);
        addClass([timeCellsWrap.querySelectorAll('tr')[rowIndex].lastChild as Element], cls.HIDE_CHILDS_CLASS);
        prepend([currentTimeEle], timeCellsWrap);
        currentTimeEle.style.top = formatUnit(currentTimeEle.offsetTop - (currentTimeEle.offsetHeight / 2));
    }
    public getTopFromDateTime(date: Date): number {
        let startHour: Date = this.getStartHour();
        let diffInMinutes: number = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.getWorkCellHeight() * this.parent.activeViewOptions.timeScale.slotCount) /
            this.parent.activeViewOptions.timeScale.interval;
    }
    private getWorkCellHeight(): number {
        return (this.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement).offsetHeight;
    }
    private getTdContent(date: Date, type: string, groupIndex?: number): NodeList {
        let cntEle: NodeList;
        switch (type) {
            case 'dateHeader':
                if (this.parent.activeViewOptions.dateHeaderTemplate) {
                    let args: CellTemplateArgs = { date: date, type: type };
                    cntEle = this.parent.getDateHeaderTemplate()(args);
                } else {
                    cntEle = compile(this.dateHeaderTemplate, this.customHelper)({ date: date });
                }
                break;
            case 'majorSlot':
                if (this.parent.activeViewOptions.timeScale.majorSlotTemplate) {
                    let args: CellTemplateArgs = { date: date, type: type };
                    cntEle = this.parent.getMajorSlotTemplate()(args);
                } else {
                    cntEle = compile(MAJOR_SLOT_TEMPLATE, this.customHelper)({ date: date });
                }
                break;
            case 'minorSlot':
                if (this.parent.activeViewOptions.timeScale.minorSlotTemplate) {
                    let args: CellTemplateArgs = { date: date, type: type };
                    cntEle = this.parent.getMinorSlotTemplate()(args);
                } else {
                    cntEle = compile(MINOR_SLOT_TEMPLATE, this.customHelper)({ date: date });
                }
                break;
            case 'alldayCells':
                if (this.parent.activeViewOptions.cellTemplate) {
                    let args: CellTemplateArgs = { date: date, type: type, groupIndex: groupIndex };
                    cntEle = this.parent.getCellTemplate()(args);
                }
                break;
        }
        return cntEle;
    }
    public renderLayout(type: string): void {
        this.setPanel(createElement('div', { className: cls.TABLE_WRAP_CLASS }));
        let clsList: string[] = [this.baseCssClass, this.viewClass];
        clsList.push(type);
        if (this.parent.activeViewOptions.group.byDate) {
            clsList.push('e-by-date');
        }
        if (!this.parent.activeViewOptions.timeScale.enable) {
            addClass([this.element], [cls.TIMESCALE_DISABLE, this.viewClass]);
        }
        this.renderPanel(type);
        addClass([this.element], clsList);
        this.element.appendChild(this.createTableLayout(cls.OUTER_TABLE_CLASS) as HTMLElement);
        this.colLevels = this.generateColumnLevels();
        this.renderHeader();
        this.renderContent();
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.element.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(event.contentReady, {});
    }
    public renderHeader(): void {
        let tr: Element = createElement('tr');
        let dateTd: Element = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        if (this.parent.activeViewOptions.timeScale.enable) {
            let indentTd: Element = createElement('td', { className: cls.LEFT_INDENT_CLASS });
            indentTd.appendChild(this.renderLeftIndent());
            tr.appendChild(indentTd);
        }
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    }
    public renderContent(): void {
        let tr: Element = createElement('tr');
        let workTd: Element = createElement('td');
        if (this.parent.isAdaptive) {
            workTd.setAttribute('colspan', (this.parent.activeViewOptions.timeScale.enable ? '2' : '1'));
            let scrollContainer: HTMLElement = createElement('div', { className: cls.SCROLL_CONTAINER_CLASS });
            if (this.parent.activeViewOptions.timeScale.enable) {
                scrollContainer.appendChild(this.renderTimeCells());
            }
            scrollContainer.appendChild(this.renderContentArea());
            workTd.appendChild(scrollContainer);
            EventHandler.add(scrollContainer, 'scroll', this.onApaptiveScroll, this);
            EventHandler.add(scrollContainer, Browser.touchMoveEvent, this.onApaptiveMove, this);
            tr.appendChild(workTd);
        } else {
            workTd.appendChild(this.renderContentArea());
            if (this.parent.activeViewOptions.timeScale.enable) {
                let timesTd: Element = createElement('td');
                timesTd.appendChild(this.renderTimeCells());
                tr.appendChild(timesTd);
            }
            tr.appendChild(workTd);
        }
        this.element.querySelector('tbody').appendChild(tr);
    }
    private renderLeftIndent(): HTMLElement {
        let wrap: HTMLElement = createElement('div', { className: cls.LEFT_INDENT_WRAP_CLASS });
        let tbl: Element = this.createTableLayout();
        let trEle: Element = createElement('tr');
        let rowCount: number = this.colLevels.length;
        for (let i: number = 0; i < rowCount; i++) {
            let ntr: Element = trEle.cloneNode() as Element;
            let data: TdData = { className: [this.colLevels[i][0].className[0]], type: 'emptyCells' };
            if (this.parent.activeViewOptions.showWeekNumber && data.className.indexOf(cls.HEADER_CELLS_CLASS) !== -1) {
                data.className.push(cls.WEEK_NUMBER_CLASS);
                let weekNo: number = util.getWeekNumber(this.renderDates.slice(-1)[0]);
                data.template = [createElement('span', {
                    innerHTML: '' + weekNo,
                    attrs: { title: this.parent.localeObj.getConstant('week') + ' ' + weekNo }
                })];
            }
            ntr.appendChild(this.createTd(data));
            tbl.querySelector('tbody').appendChild(ntr);
        }
        let ntr: Element = trEle.cloneNode() as Element;
        let appointmentExpandCollapse: Element = createElement('div', {
            attrs: { 'tabindex': '0', title: 'Expand-all-day-section', 'aria-disabled': 'false', 'aria-label': 'Expand section' },
            className: cls.ALLDAY_APPOINTMENT_SECTION_CLASS + ' ' + cls.APPOINTMENT_ROW_EXPAND_CLASS + ' ' +
                cls.ICON + ' ' + cls.DISABLE_CLASS,
        });
        let data: TdData = { className: [cls.ALLDAY_CELLS_CLASS], type: 'emptyCells' };
        let nth: Element = this.createTd(data);
        nth.appendChild(appointmentExpandCollapse);
        ntr.appendChild(nth);
        tbl.querySelector('tbody').appendChild(ntr);
        wrap.appendChild(tbl);
        return wrap;
    }
    public renderDatesHeader(): Element {
        let container: Element = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        let wrap: Element = createElement('div', { className: cls.DATE_HEADER_WRAP_CLASS });
        container.appendChild(wrap);
        let tbl: Element = this.createTableLayout();
        let trEle: Element = createElement('tr');
        let rowCount: number = this.colLevels.length;
        let lastLevel: TdData[] = this.colLevels[rowCount - 1];
        this.createColGroup(tbl, lastLevel);
        for (let i: number = 0; i < rowCount; i++) {
            let ntr: Element = trEle.cloneNode() as Element;
            addClass([ntr], cls.HEADER_ROW_CLASS);
            let level: TdData[] = this.colLevels[i];
            for (let j: number = 0; j < level.length; j++) {
                ntr.appendChild(this.createTd(level[j]));
            }
            tbl.querySelector('tbody').appendChild(ntr);
        }
        this.createAllDayRow(tbl, lastLevel);
        wrap.appendChild(tbl);
        return container;
    }

    public createAllDayRow(table: Element, tdData: TdData[]): void {
        let ntr: Element = createElement('tr');
        addClass([ntr], cls.ALLDAY_ROW_CLASS);
        for (let j: number = 0; j < tdData.length; j++) {
            let td: TdData = <TdData>extend({}, tdData[j]);
            td.className = [cls.ALLDAY_CELLS_CLASS];
            td.type = 'alldayCells';
            let ntd: Element = this.createTd(td);
            ntd.setAttribute('data-date', td.date.getTime().toString());
            if (!isNullOrUndefined(td.groupIndex)) {
                ntd.setAttribute('data-group-index', '' + td.groupIndex);
            }
            this.wireCellEvents(ntd);
            ntr.appendChild(ntd);
        }
        table.querySelector('tbody').appendChild(ntr);
        let thead: HTMLElement = createElement('thead');
        thead.appendChild(this.createEventWrapper('allDay'));
        prepend([thead], table);
    }
    public createTd(td: TdData): Element {
        let tdEle: Element = createElement('td');
        this.addAttributes(td, tdEle);
        if (td.date && td.type) {
            let ele: NodeList = this.getTdContent(td.date, td.type, td.groupIndex);
            if (ele && ele.length) {
                append([].slice.call(ele), tdEle);
            }
        }
        if (td.type === 'resourceHeader') {
            this.setResourceHeaderContent(tdEle, td);
        }
        if (td.type === 'dateHeader' && td.className.indexOf(cls.HEADER_CELLS_CLASS) >= 0) {
            tdEle.setAttribute('data-date', td.date.getTime().toString());
            if (!isNullOrUndefined(td.groupIndex)) {
                tdEle.setAttribute('data-group-index', '' + td.groupIndex);
            }
            EventHandler.add(tdEle, 'click', this.workCellAction.cellClick, this.workCellAction);
            EventHandler.add(tdEle, 'dblclick', this.workCellAction.cellDblClick, this.workCellAction);
        }
        let args: RenderCellEventArgs = { elementType: td.type, element: tdEle, date: td.date, groupIndex: td.groupIndex };
        this.parent.trigger(event.renderCell, args);
        return tdEle;
    }
    private wireCellEvents(element: Element): void {
        EventHandler.add(element, 'mousedown', this.workCellAction.cellMouseDown, this.workCellAction);
        EventHandler.add(element, 'click', this.workCellAction.cellClick, this.workCellAction);
        EventHandler.add(element, 'dblclick', this.workCellAction.cellDblClick, this.workCellAction);
    }
    private renderTimeCells(): HTMLElement {
        let wrap: HTMLElement = createElement('div', { className: cls.TIME_CELLS_WRAP_CLASS });
        let tbl: Element = this.createTableLayout();
        let trEle: Element = createElement('tr');
        let handler: Function = (r: TimeSlotData): TimeSlotData => {
            r.type = r.first ? 'majorSlot' : 'minorSlot';
            r.className = r.last ? [cls.TIME_CELLS_CLASS] : [];
            let ntr: Element = trEle.cloneNode() as Element;
            let data: TdData = { date: r.date, type: r.type, className: r.className };
            ntr.appendChild(this.createTd(data));
            tbl.querySelector('tbody').appendChild(ntr);
            return r;
        };
        this.getTimeSlotRows(handler);
        wrap.appendChild(tbl);
        return wrap;
    }
    public renderContentArea(): Element {
        let wrap: Element = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        let tbl: Element = this.createTableLayout(cls.CONTENT_TABLE_CLASS);
        this.createColGroup(tbl, this.colLevels.slice(-1)[0]);
        this.renderContentTable(tbl);
        wrap.appendChild(tbl);
        this.wireCellEvents(tbl.querySelector('tbody'));
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        EventHandler.add(wrap, Browser.touchMoveEvent, this.onApaptiveMove, this);
        return wrap;
    }
    public renderContentTable(table: Element): void {
        let tr: Element = createElement('tr', { attrs: { role: 'row' } });
        let td: Element = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        let tbody: Element = table.querySelector('tbody');
        let handler: Function = (r: TimeSlotData): TimeSlotData => {
            let ntr: Element = tr.cloneNode() as Element;
            for (let tdData of this.colLevels[this.colLevels.length - 1]) {
                let ntd: Element = this.createContentTd(tdData, r, td);
                ntr.appendChild(ntd);
            }
            tbody.appendChild(ntr);
            return r;
        };
        this.getTimeSlotRows(handler);
        this.renderContentTableHeader(table);
    }
    public createContentTd(tdData: TdData, r: TimeSlotData, td: Element): Element {
        let ntd: Element = td.cloneNode() as Element;
        if (tdData.colSpan) { ntd.setAttribute('colspan', tdData.colSpan.toString()); }
        let clsName: string[] = this.getContentTdClass(r);
        let cellDate: Date = util.resetTime(new Date('' + tdData.date));
        util.setTime(cellDate, util.getDateInMs(r.date));
        let type: string = 'workCells';
        if (tdData.className.indexOf(cls.RESOURCE_PARENT_CLASS) !== -1) {
            clsName.push(cls.RESOURCE_GROUP_CELLS_CLASS);
            type = 'resourceGroupCells';
        }
        if (this.parent.workHours.highlight && ((this.parent.activeViewOptions.timeScale.enable &&
            this.isWorkHour(cellDate, tdData.startHour, tdData.endHour, tdData.workDays)) ||
            (!this.parent.activeViewOptions.timeScale.enable && this.isWorkDay(cellDate, tdData.workDays)))) {
            clsName.push(cls.WORK_HOURS_CLASS);
        }
        addClass([ntd], clsName);
        if (this.parent.activeViewOptions.cellTemplate) {
            let args: CellTemplateArgs = { date: cellDate, type: type, groupIndex: tdData.groupIndex };
            append([].slice.call(this.parent.getCellTemplate()(args)), ntd);
        }
        ntd.setAttribute('data-date', cellDate.getTime().toString());
        if (!isNullOrUndefined(tdData.groupIndex) || this.parent.uiStateValues.isGroupAdaptive) {
            let groupIndex: number = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                tdData.groupIndex;
            ntd.setAttribute('data-group-index', '' + groupIndex);
        }
        let args: RenderCellEventArgs = { elementType: type, element: ntd, date: cellDate, groupIndex: tdData.groupIndex };
        this.parent.trigger(event.renderCell, args);
        return ntd;
    }
    public getContentTdClass(r: TimeSlotData): string[] {
        return r.last ? [cls.WORK_CELLS_CLASS] : [cls.WORK_CELLS_CLASS, cls.ALTERNATE_CELLS_CLASS];
    }
    private renderContentTableHeader(table: Element): void {
        let thead: Element = createElement('thead');
        thead.appendChild(this.createEventWrapper());
        if (this.parent.activeViewOptions.timeScale.enable) {
            thead.appendChild(this.createEventWrapper('timeIndicator'));
        }
        prepend([thead], table);
    }
    private createEventWrapper(type: string = ''): HTMLElement {
        let tr: HTMLElement = createElement('tr');
        this.colLevels.slice(-1)[0].forEach((col: TdData, day: number) => {
            let appointmentWrap: HTMLElement = createElement('td', {
                className: (type === 'allDay') ? cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS : (type === 'timeIndicator') ?
                    cls.TIMELINE_WRAPPER_CLASS : cls.DAY_WRAPPER_CLASS, attrs: { 'data-date': col.date.getTime().toString() }
            });
            if (!isNullOrUndefined(col.groupIndex)) {
                appointmentWrap.setAttribute('data-group-index', col.groupIndex.toString());
            }
            if (type === '') {
                let innerWrapper: HTMLElement = createElement('div', {
                    id: cls.APPOINTMENT_WRAPPER_CLASS + '-' + day.toString(),
                    className: cls.APPOINTMENT_WRAPPER_CLASS
                });
                appointmentWrap.appendChild(innerWrapper);
            }
            tr.appendChild(appointmentWrap);
        });
        return tr;
    }
    public getScrollableElement(): Element {
        if (this.parent.isAdaptive && this.parent.currentView.indexOf('Timeline') === -1) {
            return this.element.querySelector('.' + cls.SCROLL_CONTAINER_CLASS);
        } else {
            return this.getContentAreaElement();
        }
    }
    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.TIME_CELLS_WRAP_CLASS) as HTMLElement;
    }
    public getContentAreaElement(): HTMLElement {
        return this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
    }
    public getEndDateFromStartDate(start: Date): Date {
        let msMajorInterval: number = this.parent.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        let msInterval: number = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        let end: Date = new Date(start.getTime());
        end.setMilliseconds(end.getMilliseconds() + msInterval);
        return end;
    }
    public getTimeSlotRows(handler?: Function): TimeSlotData[] {
        let rows: TimeSlotData[] = [];
        let startHour: Date = this.getStartHour();
        let endHour: Date = this.getEndHour();
        let msMajorInterval: number = this.parent.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        let msInterval: number = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        let length: number = Math.round(util.MS_PER_DAY / msInterval);
        let msStartHour: number = startHour.getTime();
        let msEndHour: number = endHour.getTime();
        if (msStartHour !== msEndHour) {
            length = Math.round((msEndHour - msStartHour) / msInterval);
        }
        if (!this.parent.activeViewOptions.timeScale.enable) {
            length = 1;
        }
        let dt: Date = new Date(msStartHour);
        let start: Date = this.parent.globalize.parseDate(this.parent.workHours.start, { skeleton: 'Hm' });
        let end: Date = this.parent.globalize.parseDate(this.parent.workHours.end, { skeleton: 'Hm' });
        for (let i: number = 0; i < length; i++) {
            let majorTickDivider: number = i % (msMajorInterval / msInterval);
            let row: TimeSlotData = {
                date: new Date('' + dt),
                startHour: start,
                endHour: end,
                first: (majorTickDivider === 0),
                middle: (majorTickDivider < this.parent.activeViewOptions.timeScale.slotCount - 1),
                last: (majorTickDivider === this.parent.activeViewOptions.timeScale.slotCount - 1),
                type: ''
            };
            if (handler) {
                handler(row);
            }
            rows.push(row);
            dt.setMilliseconds(msInterval);
        }
        return rows;
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'verticalView';
    }
    /**
     * To destroy the vertical view.
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.clearCurrentTimeIndicatorTimer();
        if (this.element) {
            EventHandler.remove(this.getContentAreaElement(), 'scroll', this.onContentScroll);
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