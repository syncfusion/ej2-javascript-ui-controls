import { isNullOrUndefined, EventHandler, formatUnit, Browser } from '@syncfusion/ej2-base';
import { createElement, remove, addClass, removeClass, prepend } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';
import { ViewBase } from './view-base';
// import { VerticalEvent } from '../event-renderer/vertical-view';
// import { MonthEvent } from '../event-renderer/month';
import { NotifyEventArgs, IRenderer } from '../base/interface';
import { VerticalEvent } from '../event-renderer/vertical-view';
import { MonthEvent } from '../event-renderer/month';
import * as util from '../base/util';
import * as cls from '../base/css-constant';

/**
 * vertical view
 */
export const ADD_BORDER_LENGTH: number = 4;
export const DEFAULT_ALL_DAY_ROW_LENGTH: number = 4;
export class VerticalViews extends ViewBase implements IRenderer {
    public currentTimeIndicatorTimer: number;
    public isInverseTableSelect: boolean = true;
    public baseCssClass: string = 'e-vertical-view';

    constructor(parent: SfSchedule) {
        super(parent);
    }
    public onDataReady(): void {
        if (this.parent.activeViewOptions.timeScale.enable) {
            let appointment: VerticalEvent = new VerticalEvent(this.parent);
            appointment.renderAppointments();
        } else {
            let appointment: MonthEvent = new MonthEvent(this.parent);
            appointment.renderAppointments();
        }
    }
    private onContentScroll(e: Event): void {
        this.parent.removeNewEventElement();
        let target: HTMLElement = <HTMLElement>e.target;
        this.parent.onVirtualScroll();
        this.scrollLeftPanel(target);
        this.scrollTopPanel(target);
        if (!this.parent.isAdaptive) {
            this.parent.uiStateValues.top = target.scrollTop;
        }
        this.parent.uiStateValues.left = target.scrollLeft;
        if (!isNullOrUndefined(this.parent.quickPopup)) {
            this.parent.quickPopup.hide();
        }
    }
    private onApaptiveMove(e: Event): void {
        if (this.parent.uiStateValues.action) {
            e.preventDefault();
        }
    }
    public scrollLeftPanel(target: HTMLElement): void {
        let leftPanel: HTMLElement = this.getLeftPanelElement();
        if (!isNullOrUndefined(leftPanel)) {
            leftPanel.scrollTop = target.scrollTop;
        }
    }
    public onScrollUiUpdate(args: NotifyEventArgs): void {
        let headerBarHeight: number = this.getHeaderBarHeight();
        let timecells: HTMLElement = this.getLeftPanelElement();
        let content: HTMLElement = this.getContentAreaElement() as HTMLElement;
        let header: HTMLElement = this.getDatesHeaderElement();
        let scrollerHeight: number = this.parent.element.offsetHeight - headerBarHeight - header.offsetHeight;
        this.setColWidth(content);
        this.setContentHeight(content, timecells, scrollerHeight);
        let scrollBarWidth: number = util.getScrollBarWidth();
        // tslint:disable:no-any
        (header.firstElementChild as HTMLElement).style[<any>args.cssProperties.rtlBorder] = '';
        header.style[<any>args.cssProperties.rtlPadding] = '';
        if (content.offsetWidth - content.clientWidth > 0) {
            (header.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        } else {
            (header.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = '';
            header.style[<any>args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
        if (!args.isPreventScrollUpdate) {
            if (this.parent.uiStateValues.isInitial) {
                this.scrollToWorkHour();
                this.parent.uiStateValues.isInitial = false;
            } else {
                if (timecells) {
                    timecells.scrollTop = this.parent.uiStateValues.top;
                }
                content.scrollTop = this.parent.uiStateValues.top;
                content.scrollLeft = this.parent.uiStateValues.left;
            }
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.highlightCurrentTime();
        }
    }
    public setContentHeight(element: HTMLElement, leftPanelElement: HTMLElement, height: number): void {
        if (!isNullOrUndefined(leftPanelElement)) {
            leftPanelElement.style.height = (this.parent.options.height === 'auto') ? 'auto'
                : formatUnit(height - this.getScrollXIndent(element));
        }
        element.style.height = (this.parent.options.height === 'auto') ? 'auto' : formatUnit(height);
    }
    public scrollToWorkHour(): void {
        if (this.parent.options.workHours.highlight) {
            let firstWorkHourCell: HTMLElement = <HTMLElement>this.element.querySelector('.' + cls.WORK_HOURS_CLASS);
            if (firstWorkHourCell) {
                this.getContentAreaElement().scrollTop = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.top = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.left = 0;
            }
        }
    }
    public scrollToHour(hour: string, scrollDate?: Date): void {
        let date: Date = this.parent.getStartEndTime(hour);
        if (isNullOrUndefined(date) || !isNullOrUndefined(scrollDate)) {
            return;
        }
        this.getContentAreaElement().scrollTop = this.getTopFromDateTime(date);
    }
    private isWorkHourRange(date: Date): boolean {
        return (this.getStartHour().getTime() <= date.getTime()) && (this.getEndHour().getTime() >= date.getTime());
    }
    public highlightCurrentTime(): void {
        if (this.parent.activeViewOptions.headerRows && this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return;
        }
        let curEle: Element[] = [].slice.call(this.element.querySelectorAll('.' + cls.CURRENT_DAY_CLASS));
        if (curEle.length > 0) {
            removeClass(curEle, cls.CURRENT_DAY_CLASS);
        }
        let curDate: Date = util.addLocalOffset(new Date(new Date().setHours(0, 0, 0, 0)));
        let queryString: string = '.' + cls.DATE_HEADER_CLASS + '[data-date="' + curDate.getTime().toString() + '"]';
        curEle = [].slice.call(this.element.querySelectorAll(queryString));
        for (let ele of curEle) {
            addClass([ele], cls.CURRENT_DAY_CLASS);
        }

        if (this.parent.options.showTimeIndicator && this.isWorkHourRange(this.parent.getCurrentTime())) {
            let currentDateIndex: number[] = this.getCurrentTimeIndicatorIndex();
            let timeCellsWrap: Element = this.getLeftPanelElement();
            removeClass(timeCellsWrap.querySelectorAll('.' + cls.HIDE_CHILDS_CLASS), cls.HIDE_CHILDS_CLASS);
            if (currentDateIndex.length > 0) {
                let workCells: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
                if (workCells.length > 0) {
                    this.changeCurrentTimePosition();
                }
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
        let elements: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.e-timeline-wrapper'));
        let currentDateInMS: string = util.addLocalOffset(new Date(new Date().setHours(0, 0, 0, 0))).getTime().toString();
        for (let i: number = 0, length: number = elements.length; i < length; i++) {
            if (elements[i].getAttribute('data-date') === currentDateInMS) {
                currentDateIndex.push(i);
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
        for (let indicator of timeIndicator) {
            remove(indicator);
        }
    }
    public changeCurrentTimePosition(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeCurrentTimeIndicatorElements();
        let currentDateIndex: number[] = this.getCurrentTimeIndicatorIndex();
        let firstRow: HTMLTableRowElement = (this.parent.getContentTable() as HTMLTableElement).rows[0];
        let top: number = this.getTopFromDateTime(this.parent.getCurrentTime());
        let topInPx: string = formatUnit(top);
        let rowIndex: number = Math.floor(top / firstRow.cells[0].offsetHeight);
        if (isNullOrUndefined(rowIndex) || isNaN(rowIndex)) { return; }
        let curTimeWrap: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.TIMELINE_WRAPPER_CLASS));
        for (let i: number = 0, length: number = currentDateIndex[0]; i < length; i++) {
            curTimeWrap[i].appendChild(createElement('div', { className: cls.PREVIOUS_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        for (let day of currentDateIndex) {
            curTimeWrap[day].appendChild(createElement('div', { className: cls.CURRENT_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        let currentTimeEle: HTMLElement = createElement('div', {
            innerHTML: this.parent.getTimeString(this.parent.getCurrentTime()),
            className: cls.CURRENT_TIME_CLASS,
            styles: 'top:' + topInPx
        });
        let timeCellsWrap: Element = this.getLeftPanelElement();
        let timeTrs: HTMLElement[] = [].slice.call(timeCellsWrap.querySelectorAll('tr'));
        if (rowIndex <= timeTrs.length) {
            removeClass(timeCellsWrap.querySelectorAll('.' + cls.HIDE_CHILDS_CLASS), cls.HIDE_CHILDS_CLASS);
            addClass([timeTrs[rowIndex].lastElementChild as Element], cls.HIDE_CHILDS_CLASS);
            prepend([currentTimeEle], timeCellsWrap);
            currentTimeEle.style.top = formatUnit(currentTimeEle.offsetTop - (currentTimeEle.offsetHeight / 2));
        }
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
    public renderLayout(): void {
        this.element = this.parent.element.querySelector('.' + cls.TABLE_WRAP_CLASS);
        let headerCells: Element[] =
            [].slice.call(this.element.querySelectorAll('.' + cls.DATE_HEADER_WRAP_CLASS + ' td.' + cls.HEADER_CELLS_CLASS));
        for (let cell of headerCells) {
            EventHandler.clearEvents(cell);
            this.wireMouseEvents(cell);
        }
        let alldayCells: Element[] =
            [].slice.call(this.element.querySelectorAll('.' + cls.DATE_HEADER_WRAP_CLASS + ' td.' + cls.ALLDAY_CELLS_CLASS));
        for (let cell of alldayCells) {
            EventHandler.clearEvents(cell);
            this.wireCellEvents(cell);
        }
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.setTranslateValue();
        }
        let wrap: Element = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        let contentBody: Element = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody');
        EventHandler.clearEvents(contentBody);
        this.wireCellEvents(contentBody);
        EventHandler.clearEvents(wrap);
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        EventHandler.add(wrap, Browser.touchMoveEvent, this.onApaptiveMove, this);
        this.parent.setDimensions();
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
    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.TIME_CELLS_WRAP_CLASS) as HTMLElement;
    }
    public getEndDateFromStartDate(start: Date): Date {
        let msMajorInterval: number = this.parent.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        let msInterval: number = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        let end: Date = new Date(start.getTime());
        end.setMilliseconds(end.getMilliseconds() + msInterval);
        return end;
    }
    public destroy(): void {
        this.clearCurrentTimeIndicatorTimer();
        if (this.element) {
            let contentScrollableEle: Element = this.getContentAreaElement();
            if (contentScrollableEle) {
                EventHandler.remove(contentScrollableEle, 'scroll', this.onContentScroll);
            }
            this.element = null;
        }
    }
}