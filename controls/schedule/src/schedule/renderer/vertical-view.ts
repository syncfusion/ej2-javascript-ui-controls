import { isNullOrUndefined, extend, EventHandler, formatUnit, Browser } from '@syncfusion/ej2-base';
import { createElement, remove, addClass, removeClass, append, prepend } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { ViewBase } from './view-base';
import { VerticalEvent } from '../event-renderer/vertical-view';
import { MonthEvent } from '../event-renderer/month';
import { RenderCellEventArgs, CellTemplateArgs, TdData, NotifyEventArgs, IRenderer, TimeSlotData, CallbackFunction } from '../base/interface';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * vertical view
 */
export class VerticalView extends ViewBase implements IRenderer {
    public currentTimeIndicatorTimer: number;
    public viewClass: string = 'e-day-view';
    public isInverseTableSelect: boolean = true;
    public baseCssClass: string = 'e-vertical-view';
    private appointment: VerticalEvent | MonthEvent = null;

    constructor(parent: Schedule) {
        super(parent);
    }

    protected getModuleName(): string {
        return 'verticalView';
    }

    public addEventListener(): void {
        this.parent.on(event.scrollUiUpdate, this.scrollUiUpdate, this);
        this.parent.on(event.dataReady, this.renderEvents, this);
    }

    public removeEventListener(): void {
        if (this.parent) {
            this.parent.off(event.scrollUiUpdate, this.scrollUiUpdate);
            this.parent.off(event.dataReady, this.renderEvents);
        }
    }

    public renderEvents(): void {
        this.appointment = this.parent.activeViewOptions.timeScale.enable ?
            new VerticalEvent(this.parent) : new MonthEvent(this.parent);
        this.appointment.renderAppointments();
        this.parent.notify(event.eventsLoaded, {});
    }

    private onContentScroll(e: Event): void {
        this.parent.removeNewEventElement();
        const target: HTMLElement = <HTMLElement>e.target;
        this.parent.notify(event.virtualScroll, e);
        this.scrollLeftPanel(target);
        this.scrollTopPanel(target);
        if (!this.parent.isAdaptive) {
            this.parent.uiStateValues.top = target.scrollTop;
        }
        this.parent.uiStateValues.left = target.scrollLeft;
        if (!isNullOrUndefined(this.parent.quickPopup) && !this.parent.uiStateValues.isTapHold) {
            this.parent.quickPopup.quickPopupHide();
        }
        this.setPersistence();
    }

    private onAdaptiveMove(e: Event): void {
        if (this.parent.uiStateValues.action) {
            e.preventDefault();
        }
    }

    private onAdaptiveScroll(e: Event): void {
        if (this.parent && !this.parent.isDestroyed) {
            this.parent.removeNewEventElement();
            this.parent.uiStateValues.top = (<HTMLElement>e.target).scrollTop;
        }
    }

    public scrollLeftPanel(target: HTMLElement): void {
        const leftPanel: HTMLElement = this.getLeftPanelElement();
        if (!isNullOrUndefined(leftPanel)) {
            leftPanel.scrollTop = target.scrollTop;
        }
    }

    private scrollUiUpdate(args: NotifyEventArgs): void {
        if (!this.parent) {
            return;
        }
        const dateHeader: HTMLElement = (this.parent.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement);
        const headerBarHeight: number = this.getHeaderBarHeight();
        const timeCells: HTMLElement = this.getLeftPanelElement();
        const content: HTMLElement = this.getScrollableElement() as HTMLElement;
        const header: HTMLElement = this.getDatesHeaderElement();
        const scrollerHeight: number = this.parent.element.offsetHeight - headerBarHeight - header.offsetHeight;
        this.setContentHeight(content, timeCells, scrollerHeight);
        this.setColWidth(content);
        const scrollBarWidth: number = util.getScrollBarWidth();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (header.firstElementChild as HTMLElement).style[<any>args.cssProperties.rtlBorder] = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        header.style[<any>args.cssProperties.rtlPadding] = '';
        const isDateHeaderScroll: boolean = this.parent.enableAllDayScroll ? !((content.offsetWidth - content.clientWidth) <=
            (dateHeader.offsetWidth - dateHeader.clientWidth) && dateHeader.classList.contains('e-all-day-scroll')) : true;
        if (content.offsetWidth - content.clientWidth > 0 && isDateHeaderScroll) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (header.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            header.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (header.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = '';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            header.style[<any>args.cssProperties.padding] = '';
        }
        if (!args.isPreventScrollUpdate) {
            if (this.parent.uiStateValues.isInitial) {
                if (this.parent.currentView.indexOf('Timeline') > -1) {
                    content.scrollTop = this.parent.uiStateValues.top;
                }
                this.scrollToWorkHour();
                this.parent.uiStateValues.isInitial = false;
            } else {
                if (timeCells) {
                    timeCells.scrollTop = this.parent.uiStateValues.top;
                }
                content.scrollTop = this.parent.uiStateValues.top;
                content.scrollLeft = this.parent.uiStateValues.left;
            }
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.highlightCurrentTime();
        }
        this.retainScrollPosition();
        if (!isNullOrUndefined(timeCells) && !isNullOrUndefined(content) && timeCells.scrollTop !== content.scrollTop) {
            timeCells.scrollTop = content.scrollTop;
        }
    }

    public setContentHeight(element: HTMLElement, leftPanelElement: HTMLElement, height: number): void {
        if (this.parent.isAdaptive && !this.isTimelineView()) {
            element.style.height = (this.parent.height === 'auto') ? 'auto' : formatUnit(height);
        } else {
            if (!isNullOrUndefined(leftPanelElement)) {
                leftPanelElement.style.height = (this.parent.height === 'auto') ? 'auto'
                    : formatUnit(height - this.getScrollXIndent(element));
            }
            element.style.height = (this.parent.height === 'auto') ? 'auto' : formatUnit(height);
        }
    }

    public scrollToWorkHour(): void {
        if (this.parent.workHours.highlight) {
            const firstWorkHourCell: HTMLElement = <HTMLElement>this.element.querySelector('.' + cls.WORK_HOURS_CLASS);
            if (firstWorkHourCell) {
                this.getScrollableElement().scrollTop = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.top = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.left = 0;
            }
        }
    }

    public scrollToHour(hour: string, scrollDate?: Date): void {
        const date: Date = this.parent.getStartEndTime(hour);
        if (!isNullOrUndefined(scrollDate)) {
            const headerElement: HTMLElement = this.element.querySelector('.' + cls.HEADER_CELLS_CLASS + '[data-date="' + new Date(util.resetTime(scrollDate)).getTime() + '"]');
            if (headerElement) {
                if (this.parent.enableRtl) {
                    const conWrap: HTMLElement = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
                    this.getScrollableElement().scrollLeft = -(conWrap.offsetWidth - headerElement.offsetLeft - headerElement.offsetWidth);
                } else {
                    this.getScrollableElement().scrollLeft = headerElement.offsetLeft;
                }
            }
        }
        if (isNullOrUndefined(date)) {
            return;
        }
        this.getScrollableElement().scrollTop = this.getTopFromDateTime(date);
    }

    public scrollToDate(scrollDate: Date): void {
        this.scrollToHour(null, scrollDate);
    }

    public generateColumnLevels(): TdData[][] {
        let level: TdData[] = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        let columnLevels: TdData[][] = [];
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            columnLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.activeViewOptions.group.hideNonWorkingDays) {
                while (columnLevels[0].length === 0) {
                    this.parent.setProperties({ selectedDate: this.parent.activeView.getNextPreviousDate(this.previousNextAction) }, true);
                    this.parent.activeView.getRenderDates();
                    if (this.parent.headerModule) {
                        this.parent.headerModule.setCalendarDate(this.parent.selectedDate);
                        this.parent.headerModule.updateDateRange();
                    }
                    level = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
                    columnLevels = this.parent.resourceBase.generateResourceLevels(level);
                }
            }
            if (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0) {
                const resourceLevel: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                const resStartHour: string = resourceLevel.resourceData[resourceLevel.resource.startHourField] as string;
                const resEndHour: string = resourceLevel.resourceData[resourceLevel.resource.endHourField] as string;
                const dateSlots: TdData[] = this.getDateSlots(resourceLevel.renderDates, resourceLevel.workDays, resStartHour, resEndHour);
                columnLevels = [dateSlots];
            }
        } else {
            columnLevels.push(level);
        }
        this.colLevels = columnLevels;
        return columnLevels;
    }

    // eslint-disable-next-line max-len
    public getDateSlots(renderDates: Date[], workDays: number[], workStartHour: string = this.parent.workHours.start, workEndHour: string = this.parent.workHours.end): TdData[] {
        const dateCol: TdData[] = [];
        const start: Date = this.parent.getStartEndTime(workStartHour);
        const end: Date = this.parent.getStartEndTime(workEndHour);
        for (const col of renderDates) {
            const classList: string[] = [cls.HEADER_CELLS_CLASS];
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
        const currentDate: Date = this.parent.getCurrentTime();
        if (this.parent.showTimeIndicator && this.isWorkHourRange(currentDate)) {
            const currentDateIndex: number[] = this.getCurrentTimeIndicatorIndex();
            if (currentDateIndex.length > 0 && !isNullOrUndefined(this.element.querySelector('.' + cls.WORK_CELLS_CLASS))) {
                this.changeCurrentTimePosition();
                if (isNullOrUndefined(this.currentTimeIndicatorTimer)) {
                    const interval: number = util.MS_PER_MINUTE - ((currentDate.getSeconds() * 1000) + currentDate.getMilliseconds());
                    if (interval <= (util.MS_PER_MINUTE - 1000)) {
                        window.setTimeout(() => {
                            if (!isNullOrUndefined(this.currentTimeIndicatorTimer)) {
                                this.clearCurrentTimeIndicatorTimer();
                                this.changeCurrentTimePosition();
                                this.updateCurrentTimeIndicatorTimer();
                            }
                        }, interval);
                    }
                    this.updateCurrentTimeIndicatorTimer();
                }
            } else {
                this.clearCurrentTimeIndicatorTimer();
            }
        } else {
            this.clearCurrentTimeIndicatorTimer();
        }
    }

    public getCurrentTimeIndicatorIndex(): number[] {
        const currentDateIndex: number[] = [];
        if (!isNullOrUndefined(this.parent.resourceBase) && (this.parent.activeViewOptions.group.resources.length > 0) &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            let count: number = 0;
            const currentDate: Date = util.resetTime(this.parent.getCurrentTime());
            if (this.parent.virtualScrollModule && this.parent.activeViewOptions.allowVirtualScrolling &&
                this.parent.activeViewOptions.group.byDate) {
                for (const resource of this.parent.resourceBase.expandedResources) {
                    if (util.resetTime(resource.date).getTime() === currentDate.getTime()) {
                        currentDateIndex.push(count);
                    }
                    count += 1;
                }
            } else {
                for (const resource of this.parent.resourceBase.renderedResources) {
                    const index: number = this.parent.getIndexOfDate(resource.renderDates, currentDate);
                    if (index >= 0) {
                        const resIndex: number = this.parent.activeViewOptions.group.byDate ?
                            (this.parent.resourceBase.lastResourceLevel.length * index) + count : count + index;
                        currentDateIndex.push(resIndex);
                    }
                    count += this.parent.activeViewOptions.group.byDate ? 1 : resource.renderDates.length;
                }
            }
        } else {
            const renderDates: Date[] = (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0)
                ? this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex].renderDates : this.renderDates;
            const index: number = this.parent.getIndexOfDate(renderDates, util.resetTime(this.parent.getCurrentTime()));
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

    private updateCurrentTimeIndicatorTimer(): void {
        this.currentTimeIndicatorTimer = window.setInterval(() => { this.changeCurrentTimePosition(); }, util.MS_PER_MINUTE);
    }

    public removeCurrentTimeIndicatorElements(): void {
        const queryString: string = '.' + cls.PREVIOUS_TIMELINE_CLASS + ',.' + cls.CURRENT_TIMELINE_CLASS + ',.' + cls.CURRENT_TIME_CLASS;
        const timeIndicator: HTMLElement[] = [].slice.call(this.element.querySelectorAll(queryString));
        for (const indicator of timeIndicator) {
            remove(indicator);
        }
    }

    public changeCurrentTimePosition(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            this.parent = null;
            return;
        }
        this.removeCurrentTimeIndicatorElements();
        const currentDateIndex: number[] = this.getCurrentTimeIndicatorIndex();
        const firstRow: HTMLTableRowElement = (this.parent.getContentTable() as HTMLTableElement).rows[0];
        const top: number = this.getTopFromDateTime(this.parent.getCurrentTime());
        const topInPx: string = formatUnit(top);
        const rowIndex: number = Math.floor(top / firstRow.cells[0].offsetHeight);
        const timeCellsWrap: Element = this.getLeftPanelElement();
        const timeTrs: HTMLElement[] = [].slice.call(timeCellsWrap.querySelectorAll('tr'));
        if (isNullOrUndefined(rowIndex) || isNaN(rowIndex) || rowIndex === timeTrs.length) { return; }
        const curTimeWrap: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.TIMELINE_WRAPPER_CLASS));
        for (let i: number = 0, length: number = currentDateIndex[0]; i < length; i++) {
            curTimeWrap[parseInt(i.toString(), 10)].appendChild(createElement('div', { className: cls.PREVIOUS_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        for (const day of currentDateIndex) {
            if (curTimeWrap.length > day) {
                curTimeWrap[parseInt(day.toString(), 10)].appendChild(createElement('div', {
                    className: cls.CURRENT_TIMELINE_CLASS, styles: 'top:' + topInPx
                }));
            }
        }
        const currentTimeEle: HTMLElement = createElement('div', {
            innerHTML: this.parent.getTimeString(this.parent.getCurrentTime()),
            className: cls.CURRENT_TIME_CLASS,
            styles: 'top:' + topInPx
        });
        if (rowIndex <= timeTrs.length) {
            removeClass(timeCellsWrap.querySelectorAll('.' + cls.HIDE_CHILDS_CLASS), cls.HIDE_CHILDS_CLASS);
            if (timeTrs[parseInt(rowIndex.toString(), 10)]) {
                addClass([timeTrs[parseInt(rowIndex.toString(), 10)].lastElementChild as Element], cls.HIDE_CHILDS_CLASS);
            }
            prepend([currentTimeEle], timeCellsWrap);
            currentTimeEle.style.top = formatUnit(currentTimeEle.offsetTop - (currentTimeEle.offsetHeight / 2));
        }
    }

    public getTopFromDateTime(date: Date): number {
        const startHour: Date = this.getStartEndHours(this.parent.activeViewOptions.startHour);
        const endHour: Date = this.getStartEndHours(this.parent.activeViewOptions.endHour);
        const diffInMinutes: number = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
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
        return (diffInMinutes * this.getWorkCellHeight() * this.parent.activeViewOptions.timeScale.slotCount) / interval;
    }

    private getWorkCellHeight(): number {
        return parseFloat(this.parent.getElementHeight(this.element.querySelector('.' + cls.WORK_CELLS_CLASS)).toFixed(2));
    }
    private getTdContent(date: Date, type: string, groupIndex?: number): HTMLElement[] {
        let cntEle: HTMLElement[];
        const wrapper: HTMLElement = createElement('div');
        let templateName: string = '';
        const templateId: string = this.parent.element.id + '_';
        switch (type) {
        case 'dateHeader':
            if (this.parent.activeViewOptions.dateHeaderTemplate) {
                templateName = 'dateHeaderTemplate';
                const args: CellTemplateArgs = { date: date, type: type, groupIndex: groupIndex };
                const viewName: string = this.parent.activeViewOptions.dateHeaderTemplateName;
                cntEle = [].slice.call(this.parent.getDateHeaderTemplate()(args, this.parent, templateName,
                                                                           templateId + viewName + templateName,
                                                                           false, undefined, undefined, this.parent.root));
            } else {
                wrapper.innerHTML = this.parent.activeView.isTimelineView() ?
                    `<span class="e-header-date e-navigate">${this.getTimelineDate(date)}</span>` :
                    `<div class="e-header-day">${util.capitalizeFirstWord(this.getDayName(date), 'single')}</div>` +
                    `<div class="e-header-date e-navigate" role="link">${this.getDate(date)}</div>`;
                cntEle = [].slice.call(wrapper.childNodes);
            }
            break;
        case 'majorSlot':
            if (this.parent.activeViewOptions.timeScale.majorSlotTemplate) {
                templateName = 'majorSlotTemplate';
                const args: CellTemplateArgs = { date: date, type: type };
                cntEle = [].slice.call(this.parent.getMajorSlotTemplate()(args, this.parent, templateName,
                                                                          templateId + templateName,
                                                                          false, undefined, undefined, this.parent.root));
            } else {
                wrapper.innerHTML = `<span>${this.getTime(date)}</span>`;
                cntEle = [].slice.call(wrapper.childNodes);
            }
            break;
        case 'minorSlot':
            if (this.parent.activeViewOptions.timeScale.minorSlotTemplate) {
                templateName = 'minorSlotTemplate';
                const args: CellTemplateArgs = { date: date, type: type };
                cntEle = [].slice.call(this.parent.getMinorSlotTemplate()(args, this.parent,
                                                                          templateName, templateId + templateName,
                                                                          false, undefined, undefined, this.parent.root));
            } else {
                cntEle = [].slice.call(wrapper.childNodes);
            }
            break;
        case 'alldayCells':
            if (this.parent.activeViewOptions.cellTemplate) {
                const viewName: string = this.parent.activeViewOptions.cellTemplateName;
                templateName = 'cellTemplate';
                const args: CellTemplateArgs = { date: date, type: type, groupIndex: groupIndex };
                cntEle = [].slice.call(this.parent.getCellTemplate()(args, this.parent, templateName,
                                                                     templateId + viewName + templateName,
                                                                     false, undefined, undefined, this.parent.root));
            }
            break;
        }
        return cntEle;
    }

    public refreshHeader(): void {
        remove(this.element.querySelector('tbody tr'));
        this.renderHeader();
        this.parent.notify(event.contentReady, {});
        const dateHeader: HTMLElement = (this.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement);
        if (dateHeader) {
            dateHeader.scrollLeft = this.parent.uiStateValues.left;
        }
    }

    public renderLayout(type: string): void {
        this.setPanel(createElement('div', { className: cls.TABLE_WRAP_CLASS }));
        const clsList: string[] = [this.baseCssClass, this.viewClass];
        clsList.push(type);
        if (this.parent.activeViewOptions.group.byDate) {
            clsList.push('e-by-date');
        }
        if (!this.parent.activeViewOptions.timeScale.enable) {
            addClass([this.element], [cls.TIMESCALE_DISABLE, this.viewClass]);
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling && !this.parent.uiStateValues.isGroupAdaptive) {
            clsList.push(cls.VIRTUAL_SCROLL_CLASS);
        }
        if (this.parent.rowAutoHeight && this.parent.eventSettings.ignoreWhitespace) {
            clsList.push(cls.IGNORE_WHITESPACE);
        }
        this.renderPanel(type);
        addClass([this.element], clsList);
        this.element.appendChild(this.createTableLayout(cls.OUTER_TABLE_CLASS) as HTMLElement);
        this.element.querySelector('table').setAttribute('role', 'presentation');
        this.colLevels = this.generateColumnLevels();
        this.renderHeader();
        this.renderContent();
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.element.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(event.contentReady, {});
    }

    public renderHeader(): void {
        const tr: Element = createElement('tr');
        const dateTd: Element = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        if (this.parent.activeViewOptions.timeScale.enable) {
            const indentTd: Element = createElement('td', { className: cls.LEFT_INDENT_CLASS });
            indentTd.appendChild(this.renderLeftIndent());
            tr.appendChild(indentTd);
        }
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    }

    public renderContent(): void {
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.renderedResources = <TdData[]>extend([], this.parent.resourceBase.lastResourceLevel, null, true);
        }
        const tr: Element = createElement('tr');
        const workTd: Element = createElement('td');
        if (this.parent.isAdaptive) {
            workTd.setAttribute('colspan', (this.parent.activeViewOptions.timeScale.enable ? '2' : '1'));
            const scrollContainer: HTMLElement = createElement('div', { className: cls.SCROLL_CONTAINER_CLASS });
            if (this.parent.activeViewOptions.timeScale.enable) {
                scrollContainer.appendChild(this.renderTimeCells());
            }
            scrollContainer.appendChild(this.renderContentArea());
            workTd.appendChild(scrollContainer);
            EventHandler.add(scrollContainer, 'scroll', this.onAdaptiveScroll, this);
            EventHandler.add(scrollContainer, Browser.touchMoveEvent, this.onAdaptiveMove, this);
            tr.appendChild(workTd);
        } else {
            const levels: TdData[][] = this.colLevels.slice(0);
            if (this.parent.virtualScrollModule) {
                this.resetColLevels();
            }
            const wrap: Element = this.renderContentArea();
            workTd.appendChild(wrap);
            if (this.parent.activeViewOptions.timeScale.enable) {
                const timesTd: Element = createElement('td');
                timesTd.appendChild(this.renderTimeCells());
                tr.appendChild(timesTd);
            }
            tr.appendChild(workTd);
            if (this.parent.virtualScrollModule) {
                this.colLevels = levels;
                this.parent.virtualScrollModule.renderVirtualTrack(wrap);
            }
        }
        this.element.querySelector('tbody').appendChild(tr);
    }

    private renderLeftIndent(): HTMLElement {
        const wrap: HTMLElement = createElement('div', { className: cls.LEFT_INDENT_WRAP_CLASS });
        const tbl: Element = this.createTableLayout();
        const trEle: Element = createElement('tr');
        const rowCount: number = this.colLevels.length;
        let nth: Element;
        for (let i: number = 0; i < rowCount; i++) {
            const ntr: Element = trEle.cloneNode() as Element;
            const data: TdData = { className: [(this.colLevels[parseInt(i.toString(), 10)][0] && this.colLevels[parseInt(i.toString(), 10)][0].className[0])], type: 'emptyCells' };
            if (this.parent.activeViewOptions.showWeekNumber && data.className.indexOf(cls.HEADER_CELLS_CLASS) !== -1) {
                data.className.push(cls.WEEK_NUMBER_CLASS);
                const weekNo: string = this.parent.getWeekNumberContent(this.renderDates);
                data.template = [createElement('span', {
                    innerHTML: '' + weekNo,
                    attrs: { title: this.parent.localeObj.getConstant('week') + ' ' + weekNo }
                })];
            }
            nth = this.createTd(data);
            this.parent.renderHeaderIndentTemplate(data, nth);
            ntr.appendChild(nth);
            tbl.querySelector('tbody').appendChild(ntr);
        }
        const ntr: Element = trEle.cloneNode() as Element;
        const appointmentExpandCollapse: Element = createElement('div', {
            attrs: {
                'tabindex': '0', 'role': 'button',
                title: this.parent.localeObj.getConstant('expandAllDaySection'), 'aria-disabled': 'false',
                'aria-label': this.parent.localeObj.getConstant('expandAllDaySection')
            },
            className: cls.ALLDAY_APPOINTMENT_SECTION_CLASS + ' ' + cls.APPOINTMENT_ROW_EXPAND_CLASS + ' ' +
                cls.ICON + ' ' + cls.DISABLE_CLASS
        });
        const data: TdData = { className: [cls.ALLDAY_CELLS_CLASS], type: 'emptyCells' };
        nth = this.createTd(data);
        nth.appendChild(appointmentExpandCollapse);
        this.parent.renderHeaderIndentTemplate(data, nth);
        ntr.appendChild(nth);
        tbl.querySelector('tbody').appendChild(ntr);
        wrap.appendChild(tbl);
        return wrap;
    }

    public renderDatesHeader(): Element {
        const container: Element = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        const wrap: Element = createElement('div', { className: cls.DATE_HEADER_WRAP_CLASS });
        container.appendChild(wrap);
        const tbl: Element = this.createTableLayout();
        const trEle: Element = createElement('tr', { className: cls.HEADER_ROW_CLASS });
        const rowCount: number = this.colLevels.length;
        const lastLevel: TdData[] = this.colLevels[rowCount - 1];
        for (let i: number = 0; i < rowCount; i++) {
            const ntr: Element = trEle.cloneNode() as Element;
            const level: TdData[] = this.colLevels[parseInt(i.toString(), 10)];
            for (let j: number = 0; j < level.length; j++) {
                ntr.appendChild(this.createTd(level[parseInt(j.toString(), 10)]));
            }
            tbl.querySelector('tbody').appendChild(ntr);
        }
        this.createAllDayRow(tbl, lastLevel);
        this.createColGroup(tbl, lastLevel);
        wrap.appendChild(tbl);
        return container;
    }

    public createAllDayRow(table: Element, tdData: TdData[]): void {
        const ntr: Element = createElement('tr', { className: cls.ALLDAY_ROW_CLASS });
        for (let j: number = 0; j < tdData.length; j++) {
            const td: TdData = <TdData>extend({}, tdData[parseInt(j.toString(), 10)]);
            td.className = [cls.ALLDAY_CELLS_CLASS];
            td.type = 'alldayCells';
            const ntd: Element = this.createTd(td);
            ntd.setAttribute('data-date', td.date.getTime().toString());
            if (!isNullOrUndefined(td.groupIndex)) {
                ntd.setAttribute('data-group-index', '' + td.groupIndex);
            } else if (this.parent.uiStateValues.isGroupAdaptive) {
                ntd.setAttribute('data-group-index', '' + this.parent.uiStateValues.groupIndex);
            }
            this.wireCellEvents(ntd);
            ntr.appendChild(ntd);
        }
        table.querySelector('tbody').appendChild(ntr);
        const thead: HTMLElement = createElement('thead');
        thead.appendChild(this.parent.eventBase.createEventWrapper('allDay'));
        prepend([thead], table);
    }

    public createTd(td: TdData): Element {
        const tdEle: Element = createElement('td');
        this.addAttributes(td, tdEle);
        if (td.date && td.type) {
            const ele: HTMLElement[] = this.getTdContent(td.date, td.type, td.groupIndex);
            if (ele && ele.length) {
                append(ele, tdEle);
            }
        }
        if (!this.parent.isMinMaxDate(util.resetTime(new Date('' + td.date)))) {
            addClass([tdEle], cls.DISABLE_DATES);
        }
        if (td.type === 'resourceHeader') {
            this.setResourceHeaderContent(tdEle, td);
        }
        if (td.type === 'dateHeader' && td.className.indexOf(cls.HEADER_CELLS_CLASS) >= 0) {
            tdEle.setAttribute('data-date', td.date.getTime().toString());
            if (!isNullOrUndefined(td.groupIndex)) {
                tdEle.setAttribute('data-group-index', '' + td.groupIndex);
            }
            this.wireMouseEvents(tdEle);
        }
        const args: RenderCellEventArgs = { elementType: td.type, element: tdEle, date: td.date, groupIndex: td.groupIndex };
        this.parent.trigger(event.renderCell, args);
        return tdEle;
    }

    private wireCellEvents(element: Element): void {
        EventHandler.add(element, 'mousedown', this.parent.workCellAction.cellMouseDown, this.parent.workCellAction);
        this.wireMouseEvents(element);
    }

    private wireMouseEvents(element: Element): void {
        EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
        }
    }

    private renderTimeCells(): HTMLElement {
        const wrap: HTMLElement = createElement('div', { className: cls.TIME_CELLS_WRAP_CLASS });
        const tbl: Element = this.createTableLayout();
        const trEle: Element = createElement('tr');
        const handler: CallbackFunction = (r: TimeSlotData): TimeSlotData => {
            r.type = r.first ? 'majorSlot' : 'minorSlot';
            r.className = r.last ? [cls.TIME_CELLS_CLASS, cls.TIME_SLOT_CLASS] : [cls.TIME_SLOT_CLASS];
            const ntr: Element = trEle.cloneNode() as Element;
            const data: TdData = { date: r.date, type: r.type, className: r.className };
            ntr.appendChild(this.createTd(data));
            tbl.querySelector('tbody').appendChild(ntr);
            return r;
        };
        this.getTimeSlotRows(handler);
        wrap.appendChild(tbl);
        return wrap;
    }

    public renderContentArea(): Element {
        const wrap: Element = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        const tbl: Element = this.createTableLayout(cls.CONTENT_TABLE_CLASS);
        this.setAriaAttributes(tbl);
        this.addAutoHeightClass(tbl);
        this.renderContentTable(tbl);
        this.createColGroup(tbl, this.colLevels.slice(-1)[0]);
        wrap.appendChild(tbl);
        this.wireCellEvents(tbl.querySelector('tbody'));
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        EventHandler.add(wrap, Browser.touchMoveEvent, this.onAdaptiveMove, this);
        return wrap;
    }

    public renderContentTable(table: Element): void {
        const tBody: Element = table.querySelector('tbody');
        append(this.getContentRows(), tBody);
        this.renderContentTableHeader(table);
    }

    public getContentRows(): Element[] {
        const rows: Element[] = [];
        const tr: Element = createElement('tr');
        const td: Element = createElement('td');
        const existingGroupIndices: number[] = this.getGroupIndices();
        const handler: CallbackFunction = (r: TimeSlotData): TimeSlotData => {
            const ntr: Element = tr.cloneNode() as Element;
            for (const tdData of this.colLevels[this.colLevels.length - 1]) {
                let isAllowTdCreation: boolean = true;
                if (this.parent.virtualScrollModule && this.parent.activeViewOptions.group.resources.length > 0) {
                    if (existingGroupIndices.indexOf(tdData.groupIndex) > -1) {
                        isAllowTdCreation = false;
                    }
                }
                if (isAllowTdCreation) {
                    const ntd: Element = this.createContentTd(tdData, r, td);
                    ntr.appendChild(ntd);
                }
            }
            rows.push(ntr);
            return r;
        };
        this.getTimeSlotRows(handler);
        return rows;
    }

    public createContentTd(tdData: TdData, r: TimeSlotData, td: Element): Element {
        const ntd: Element = td.cloneNode() as Element;
        if (tdData.colSpan) { ntd.setAttribute('colspan', tdData.colSpan.toString()); }
        const clsName: string[] = this.getContentTdClass(r);
        let cellDate: Date = util.resetTime(tdData.date);
        if (!this.parent.isMinMaxDate(cellDate)) {
            clsName.push(cls.DISABLE_DATES);
        }
        cellDate = new Date(cellDate.setHours(r.date.getHours(), r.date.getMinutes(), r.date.getSeconds(), r.date.getMilliseconds()));
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
            const args: CellTemplateArgs = { date: cellDate, type: type, groupIndex: tdData.groupIndex };
            const scheduleId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.cellTemplateName;
            const templateId: string = scheduleId + viewName + 'cellTemplate';
            const tooltipTemplate: HTMLElement[] = [].slice.call(this.parent.getCellTemplate()(args, this.parent, 'cellTemplate',
                                                                                               templateId, false, undefined, undefined,
                                                                                               this.parent.root));
            append(tooltipTemplate, ntd);
        }
        ntd.setAttribute('data-date', cellDate.getTime().toString());
        const skeleton: string = 'full';
        if (!this.parent.activeViewOptions.timeScale.enable) {
            const announcementText: string =
                this.parent.globalize.formatDate(tdData.date, { skeleton: skeleton, calendar: this.parent.getCalendarMode() });
            ntd.setAttribute('aria-label', announcementText);
        } else {
            const startDateText: string = this.parent.globalize.formatDate( cellDate, {
                type: 'dateTime', skeleton: skeleton, calendar: this.parent.getCalendarMode()
            });
            const endDateText: string = this.parent.globalize.formatDate(this.getEndDateFromStartDate(cellDate), {
                type: 'dateTime', skeleton: skeleton, calendar: this.parent.getCalendarMode()
            });
            ntd.setAttribute('aria-label', startDateText + ' ' + this.parent.localeObj.getConstant('endAt') + ' ' + endDateText);
        }
        if (!isNullOrUndefined(tdData.groupIndex) || this.parent.uiStateValues.isGroupAdaptive) {
            const groupIndex: number = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                tdData.groupIndex;
            ntd.setAttribute('data-group-index', '' + groupIndex);
        }
        const args: RenderCellEventArgs = { elementType: type, element: ntd, date: cellDate, groupIndex: tdData.groupIndex };
        this.parent.trigger(event.renderCell, args);
        return ntd;
    }

    public getContentTdClass(r: TimeSlotData): string[] {
        return r.last ? [cls.WORK_CELLS_CLASS] : [cls.WORK_CELLS_CLASS, cls.ALTERNATE_CELLS_CLASS];
    }

    private renderContentTableHeader(table: Element): void {
        const thead: Element = createElement('thead');
        thead.appendChild(this.parent.eventBase.createEventWrapper());
        if (this.parent.activeViewOptions.timeScale.enable) {
            thead.appendChild(this.parent.eventBase.createEventWrapper('timeIndicator'));
        }
        prepend([thead], table);
    }

    public getScrollableElement(): Element {
        if (this.parent.isAdaptive && !this.isTimelineView()) {
            return this.element.querySelector('.' + cls.SCROLL_CONTAINER_CLASS);
        } else {
            return this.getContentAreaElement();
        }
    }

    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.TIME_CELLS_WRAP_CLASS) as HTMLElement;
    }

    public getEndDateFromStartDate(start: Date): Date {
        const msMajorInterval: number = this.parent.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        const msInterval: number = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        const end: Date = new Date(start.getTime());
        end.setMilliseconds(end.getMilliseconds() + msInterval);
        return end;
    }

    private getStartEndHours(startEndTime: string): Date {
        if (!isNullOrUndefined(startEndTime) && startEndTime !== '') {
            const startEndDate: Date = new Date(2000, 0, 0, 0);
            const timeString: string[] = startEndTime.split(':');
            if (timeString.length === 2) {
                startEndDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0);
            }
            return startEndDate;
        }
        return new Date(2000, 0, 0, 0);
    }

    public getTimeSlotRows(handler?: CallbackFunction): TimeSlotData[] {
        const rows: TimeSlotData[] = [];
        const startHour: Date = this.getStartEndHours(this.parent.activeViewOptions.startHour);
        const endHour: Date = this.getStartEndHours(this.parent.activeViewOptions.endHour);
        const msMajorInterval: number = this.parent.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        const msInterval: number = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        let length: number = Math.round(util.MS_PER_DAY / msInterval);
        const msStartHour: number = startHour.getTime();
        const msEndHour: number = endHour.getTime();
        if (msStartHour !== msEndHour) {
            const milliSeconds: number = (startHour.getTimezoneOffset() !== endHour.getTimezoneOffset()) ?
                (msEndHour - msStartHour) - 3600000 : (msEndHour - msStartHour);
            length = Math.round(milliSeconds / msInterval);
        }
        if (!this.parent.activeViewOptions.timeScale.enable) {
            length = 1;
        }
        const start: Date = this.parent.getStartEndTime(this.parent.workHours.start);
        const end: Date = this.parent.getStartEndTime(this.parent.workHours.end);
        for (let i: number = 0; i < length; i++) {
            let dt: Date = new Date(msStartHour + (msInterval * i));
            if (util.isDaylightSavingTime(dt) || new Date(msStartHour).getTimezoneOffset() !== dt.getTimezoneOffset()) {
                const timeOffset: number = new Date(msStartHour).getTimezoneOffset() - dt.getTimezoneOffset();
                dt = new Date(dt.getTime() - (1000 * 60 * timeOffset));
            }
            const majorTickDivider: number = i % (msMajorInterval / msInterval);
            const row: TimeSlotData = {
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
        }
        return rows;
    }

    public getAdjustedDate(startTime: Date): Date {
        if (!this.parent.activeViewOptions.timeScale.enable) {
            return new Date(startTime.setHours(0, 0, 0, 0));
        } else {
            const timeSlots: TimeSlotData[] = this.getTimeSlotRows();
            const startDate: Date = new Date(new Date(timeSlots[0].date.getTime()).
                setHours(startTime.getHours(), startTime.getMinutes(), startTime.getMilliseconds()));
            for (let i: number = 0; i < timeSlots.length; i++) {
                if (timeSlots[parseInt(i.toString(), 10)].date.getTime() > startDate.getTime()) {
                    startTime.setHours(
                        timeSlots[i - 1].date.getHours(), timeSlots[i - 1].date.getMinutes(), timeSlots[i - 1].date.getMilliseconds());
                    return new Date(startTime);
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
        this.clearCurrentTimeIndicatorTimer();
        if (this.element) {
            if (this.appointment) {
                this.appointment.destroy();
                this.appointment = null;
            }
            const contentScrollableEle: Element = this.getContentAreaElement();
            if (contentScrollableEle) {
                EventHandler.remove(contentScrollableEle, 'scroll', this.onContentScroll);
                EventHandler.remove(contentScrollableEle, Browser.touchMoveEvent, this.onAdaptiveMove);
            }
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
