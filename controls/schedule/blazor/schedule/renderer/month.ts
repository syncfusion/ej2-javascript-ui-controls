import { EventHandler, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { IRenderer, NotifyEventArgs } from '../base/interface';
import { MonthEvent } from '../event-renderer/month';
import { SfSchedule } from '../../schedule';
import { ViewBase } from './view-base';
import * as util from '../base/util';
import * as cls from '../base/css-constant';

/**
 * month view
 */
export const ADD_BORDER_LENGTH: number = 4;
export class Month extends ViewBase implements IRenderer {
    public dayNameFormat: string = 'wide';
    public isInverseTableSelect: boolean = false;
    public allDayLevel: number = 0;
    constructor(parent: SfSchedule) {
        super(parent);
    }
    public onDataReady(args: NotifyEventArgs): void {
        let appointment: MonthEvent = new MonthEvent(this.parent);
        appointment.renderAppointments();
    }
    public onContentScroll(e: Event): void {
        this.parent.removeNewEventElement();
        this.parent.onVirtualScroll();
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
    public onScrollUiUpdate(args: NotifyEventArgs): void {
        let headerHeight: number = this.getHeaderBarHeight();
        let header: HTMLElement = this.getDatesHeaderElement();
        let content: HTMLElement = this.getContentAreaElement();
        let height: number = this.parent.element.offsetHeight - headerHeight - header.offsetHeight;
        let leftPanel: HTMLElement = this.getLeftPanelElement();
        this.setContentHeight(content, leftPanel, height);
        let scrollBarWidth: number = util.getScrollBarWidth();
        // tslint:disable:no-any
        (header.firstElementChild as HTMLElement).style[<any>args.cssProperties.rtlBorder] = '';
        header.style[<any>args.cssProperties.rtlPadding] = '';
        if (content.offsetWidth - content.clientWidth > 0) {
            (<HTMLElement>header.firstElementChild).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        } else {
            (<HTMLElement>header.firstElementChild).style[<any>args.cssProperties.border] = '';
            header.style[<any>args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
        this.setColWidth(content);
        if (args.scrollPosition) {
            if (leftPanel) {
                leftPanel.scrollTop = args.scrollPosition.top as number;
            }
            content.scrollTop = args.scrollPosition.top as number;
            content.scrollLeft = args.scrollPosition.left as number;
        } else {
            let headerCell: HTMLElement = document.querySelector('.' + cls.HEADER_CELLS_CLASS + '[data-date="'
                + this.parent.getMsFromDate(this.parent.options.selectedDate) + '"]');
            content.scrollLeft = headerCell !== null ? headerCell.offsetLeft : 0;
        }
    }
    public setContentHeight(content: HTMLElement, leftPanelElement: HTMLElement, height: number): void {
        content.style.height = 'auto';
        if (this.parent.options.currentView === 'Month') {
            content.style.height = formatUnit(height);
        }
        if (leftPanelElement) {
            if (this.parent.options.currentView === 'MonthAgenda') {
                height = (<HTMLElement>this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS)).offsetHeight;
            }
            leftPanelElement.style.height = 'auto';
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
    }
    public renderLayout(): void {
        let curElem: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CURRENT_DAY_CLASS));
        if (curElem.length > 0) {
            removeClass(curElem, cls.CURRENT_DAY_CLASS);
        }
        let curDate: Date = util.addLocalOffset(new Date(new Date().setHours(0, 0, 0, 0)));
        let queryString: string = '.' + cls.WORK_CELLS_CLASS + '[data-date="' + curDate.getTime().toString() + '"]';
        if (this.parent.options.currentView === 'Month' || this.parent.options.currentView === 'MonthAgenda') {
            curElem = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CURRENTDATE_CLASS));
            if (curElem.length > 0) {
                removeClass(curElem, cls.CURRENTDATE_CLASS);
            }
            let curEle: Element[] = [].slice.call(this.parent.element.querySelectorAll(queryString));
            for (let ele of curEle) {
                let index: number = (ele as HTMLTableCellElement).cellIndex;
                let curHeader: Element = [].slice.call(this.parent.element.querySelectorAll('.' + cls.HEADER_CELLS_CLASS))[index];
                addClass([ele], cls.CURRENTDATE_CLASS);
                addClass([curHeader], cls.CURRENT_DAY_CLASS);
            }
        }
        if (this.parent.options.currentView === 'TimelineMonth') {
            let curEle: HTMLElement =
                this.parent.element.querySelector('.' + cls.HEADER_CELLS_CLASS + '[data-date="' + curDate.getTime().toString() + '"]');
            if (!isNullOrUndefined(curEle)) {
                addClass([curEle], cls.CURRENT_DAY_CLASS);
            }
        }
        this.element = this.parent.element.querySelector('.' + cls.TABLE_WRAP_CLASS);
        let headerCells: Element[] =
            [].slice.call(this.element.querySelectorAll('.' + cls.DATE_HEADER_WRAP_CLASS + ' td.' + cls.HEADER_CELLS_CLASS));
        for (let cell of headerCells) {
            EventHandler.clearEvents(cell);
            this.wireCellEvents(cell);
        }
        let contentBody: Element = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody');
        EventHandler.clearEvents(contentBody);
        this.wireCellEvents(contentBody);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.setTranslateValue();
        }
        let wrap: Element = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        EventHandler.clearEvents(wrap);
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);

        this.renderAppointmentContainer();
        this.parent.setDimensions();
    }
    private wireCellEvents(element: Element): void {
        EventHandler.add(element, 'mousedown', this.parent.workCellAction.cellMouseDown, this.parent.workCellAction);
        EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
        }
    }

    public renderAppointmentContainer(): void {
        //Here needs to render mobile view appointment details on selected date
    }

    public getMonthStart(currentDate: Date): Date {
        let monthStart: Date =
            util.getWeekFirstDate(util.firstDateOfMonth(currentDate), this.parent.activeViewOptions.firstDayOfWeek);
        let start: Date = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
        return start;
    }

    public getMonthEnd(currentDate: Date): Date {
        let endDate: Date = util.addMonths(currentDate, this.parent.activeViewOptions.interval - 1);
        let lastWeekOfMonth: Date =
            util.getWeekFirstDate(util.lastDateOfMonth(endDate), this.parent.activeViewOptions.firstDayOfWeek);
        let monthEnd: Date = util.addDays(lastWeekOfMonth, util.WEEK_LENGTH - 1);
        return monthEnd;
    }

    public getRenderDates(workDays?: number[]): Date[] {
        let renderDates: Date[] = [];
        let currentDate: Date = util.resetTime(this.parent.options.selectedDate);
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
        // if (this.parent.headerModule) {
        //     this.parent.headerModule.previousNextIconHandler();
        // }
        return renderDates;
    }

    public getEndDateFromStartDate(start: Date): Date {
        return util.addDays(new Date(start.getTime()), 1);
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.element = null;
    }
}