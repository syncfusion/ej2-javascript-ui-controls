import { BlazorDotnetObject, Browser, isNullOrUndefined, Touch, formatUnit, remove, classList, closest } from '@syncfusion/ej2-base';
import { EventHandler, Internationalization, TapEventArgs, removeClass, addClass, getElement, createElement } from '@syncfusion/ej2-base';
import { BlazorScheduleElement, IScheduleOptions, UIStateArgs, NotifyEventArgs, EventClickArgs } from './schedule/base/interface';
import { ScrollCss, IRenderer, ResizeEdges, CellClickEventArgs } from './schedule/base/interface';
import { Popup, isCollide } from '@syncfusion/ej2-popups';
import { ViewsModel, View } from './schedule/base/interface';
import { VerticalViews } from './schedule/renderer/vertical-view';
import { TimelineViews } from './schedule/renderer/timeline-view';
import { Month } from './schedule/renderer/month';
import { MonthAgenda } from './schedule/renderer/month-agenda';
import { TimelineMonth } from './schedule/renderer/timeline-month';
import { Year } from './schedule/renderer/year';
import { Agenda } from './schedule/renderer/agenda';
import { WorkCellInteraction } from './schedule/actions/work-cells';
import { KeyboardInteraction } from './schedule/actions/keyboard';
import { EventBase } from './schedule/event-renderer/event-base';
import * as cls from './schedule/base/css-constant';
import * as util from './schedule/base/util';
import { Resize } from './schedule/actions/resize';
import { DragAndDrop } from './schedule/actions/drag';
import { VirtualScroll } from './schedule/actions/virtual-scroll';
import { InlineEdit } from './schedule/event-renderer/inline-edit';

/**
 * Schedule base class
 */
export class SfSchedule {
    public element: BlazorScheduleElement;
    public dotNetRef: BlazorDotnetObject;
    public options: IScheduleOptions;
    public isAdaptive: Boolean;
    public activeView: IRenderer;
    public isDestroyed: boolean;
    public activeViewOptions: ViewsModel;
    public uiStateValues: UIStateArgs;
    public eventBase: EventBase;
    public workCellAction: WorkCellInteraction;
    public touchObj: Touch;
    public headerPopup: Popup;
    public quickPopup: Popup;
    public morePopup: Popup;
    public keyboardInteractionModule: KeyboardInteraction;
    public resizeModule: Resize;
    public dragAndDropModule: DragAndDrop;
    public currentCell: HTMLTableCellElement;
    public activeCellsData: CellClickEventArgs;
    public activeEventData: EventClickArgs;
    public selectedElements: Element[];
    public virtualScrollModule: VirtualScroll;
    public inlineModule: InlineEdit;
    public globalize: Internationalization;
    public isTapHold: boolean;

    constructor(element: BlazorScheduleElement, options: IScheduleOptions, viewOptions: ViewsModel, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.activeViewOptions = viewOptions;
        this.isAdaptive = Browser.isDevice;
        this.uiStateValues = {
            expand: false, isInitial: true, left: 0, top: 0, isGroupAdaptive: false,
            isIgnoreOccurrence: false, groupIndex: 0, action: false, isBlock: false
        };
        this.render();
    }
    public render(isPrevent: boolean=  false): void {
        this.setHeight();
        this.workCellAction = new WorkCellInteraction(this);
        this.initializeLayout(this.options.currentView);
        this.eventBase = new EventBase(this);
        if (this.options.allowKeyboardInteraction && !this.keyboardInteractionModule) {
            this.keyboardInteractionModule = new KeyboardInteraction(this);
        } else if (!this.options.allowKeyboardInteraction && this.keyboardInteractionModule) {
            this.keyboardInteractionModule.destroy();
        }
        if (this.options.allowDragAndDrop) {
            this.dragAndDropModule = new DragAndDrop(this);
        }
        if (this.options.allowResizing) {
            this.resizeModule = new Resize(this);
        }
        if (this.options.allowInline) {
            this.inlineModule = new InlineEdit(this);
        }
        if (!isPrevent) {
            this.wireEvents();
        }
    }
    private initializeLayout(viewName: View): void {
        if (this.activeView) {
            this.activeView.destroy();
        }
        switch (viewName) {
            case 'Day':
            case 'Week':
            case 'WorkWeek':
                this.activeView = new VerticalViews(this);
                break;
            case 'TimelineDay':
            case 'TimelineWorkWeek':
            case 'TimelineWeek':
                this.activeView = new TimelineViews(this);
                break;
            case 'Month':
                this.activeView = new Month(this);
                break;
            case 'MonthAgenda':
                this.activeView = new MonthAgenda(this);
                break;
            case 'TimelineMonth':
                this.activeView = new TimelineMonth(this);
                break;
            case 'Year':
            case 'TimelineYear':
                this.activeView = new Year(this);
                break;
            case 'Agenda':
                this.activeView = new Agenda(this);
                break;
        }
        if (!this.activeView) {
            return;
        }
        this.uiStateValues.isGroupAdaptive = this.isAdaptive && this.activeViewOptions.group.resources.length > 0 &&
            this.activeViewOptions.group.enableCompactView;
        if (this.virtualScrollModule) {
            this.virtualScrollModule = null;
        }
        if (this.options.currentView.indexOf('Timeline') !== -1 && this.activeViewOptions.allowVirtualScrolling
            && this.activeViewOptions.group.resources.length > 0 && !this.uiStateValues.isGroupAdaptive) {
            this.virtualScrollModule = new VirtualScroll(this);
            this.uiStateValues.top = 0;
        }
        this.globalize = new Internationalization(this.options.locale);
        this.activeView.getRenderDates();
        this.activeView.renderLayout();
    }

    public scrollContentReady(updateHeight: boolean): void {
        if (this.virtualScrollModule) {
            if (updateHeight) {
                this.virtualScrollModule.updateVirtualTrackHeight(this.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS));
                let timeIndicator: HTMLElement = this.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS) as HTMLElement;
                if (!isNullOrUndefined(timeIndicator)) {
                    timeIndicator.style.height =
                        (this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement).offsetHeight + 'px';
                }
                let data: NotifyEventArgs = { cssProperties: this.getCssProperties() };
                this.onScrollUiUpdate(data);
                return;
            }
            this.virtualScrollModule.setTranslateValue();
        }
    }

    public scrollToResource(groupIndex: number, levelIndex: number): void {
        let scrollElement: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (this.options.currentView.indexOf('Timeline') < 0 ||
            (this.options.currentView === 'TimelineYear' && this.activeViewOptions.orientation === 'Horizontal')) {
            levelIndex = this.activeViewOptions.group.byDate ? levelIndex + 1 : levelIndex;
            let offsetTarget: HTMLElement =
                this.element.querySelectorAll('.' + cls.DATE_HEADER_WRAP_CLASS + ' tbody tr')[levelIndex] as HTMLElement;
            scrollElement.scrollLeft = (offsetTarget.children[groupIndex] as HTMLElement).offsetLeft;
        } else {
            if (this.virtualScrollModule && this.options.currentView !== 'TimelineYear') {
                let virtual: HTMLElement = this.element.querySelector('.e-virtual-track') as HTMLElement;
                let resWrap: HTMLElement = this.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
                let averageRowHeight: number = Math.round(virtual.offsetHeight / parseInt(resWrap.getAttribute('data-expanded-count'), 10));
                scrollElement.scrollTop = (groupIndex * averageRowHeight)
                    - (((this.virtualScrollModule.bufferCount - 1) * averageRowHeight));
                this.virtualScrollModule.virtualScrolling();
                if (this.options.rowAutoHeight) {
                    let td: HTMLElement =
                        this.element.querySelector(`.${cls.WORK_CELLS_CLASS}[data-group-index="${groupIndex}"]`) as HTMLElement;
                    if (td && !td.parentElement.classList.contains(cls.HIDDEN_CLASS)) {
                        scrollElement.scrollTop =
                            (scrollElement.scrollTop < td.offsetTop) ? td.offsetTop : scrollElement.scrollTop + td.offsetTop;
                    }
                } else {
                    scrollElement.scrollTop = (groupIndex * averageRowHeight);
                }
            } else {
                let td: HTMLElement =
                    this.element.querySelector(`.${cls.WORK_CELLS_CLASS}[data-group-index="${groupIndex}"]`) as HTMLElement;
                if (td && !td.parentElement.classList.contains(cls.HIDDEN_CLASS)) {
                    scrollElement.scrollTop = td.offsetTop;
                }
            }
        }
    }

    public dataReady(count?: number, isScrollTop?: boolean): void {
        if (this.activeView) {
            this.activeView.onDataReady({}, count, isScrollTop);
        }
    }
    public isTimelineView(): boolean {
        return this.options.currentView.indexOf('Timeline') !== -1;
    }
    public isAllDayCell(td: Element): boolean {
        if (['Month', 'TimelineMonth', 'TimelineYear', 'MonthAgenda'].indexOf(this.options.currentView) > -1 ||
            td.classList.contains(cls.ALLDAY_CELLS_CLASS) ||
            td.classList.contains(cls.HEADER_CELLS_CLASS) || !this.activeViewOptions.timeScale.enable) {
            return true;
        }
        if (this.isTimelineView() && this.activeViewOptions.headerRows.length > 0 &&
            this.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return true;
        }
        return false;
    }
    public getDateFromElement(td: Element): Date {
        let dateString: string = td.getAttribute('data-date');
        if (!isNullOrUndefined(dateString)) {
            let dateInMS: number = parseInt(dateString, 10);
            let date: Date = new Date(dateInMS);
            let localDate: Date = new Date(+date + (date.getTimezoneOffset() * 60000));
            return new Date(localDate.getTime() + (localDate.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
        }
        return undefined;
    }
    public getMsFromDate(date: Date): number {
        return new Date(+date - (date.getTimezoneOffset() * 60000)).getTime();
    }
    public getTimeString(date: Date): string {
        return this.globalize.formatDate(date, { format: this.options.timeFormat, type: 'time' });
    }
    public getDateTime(date: Date): Date {
        return date instanceof Date ? new Date(date.getTime()) : new Date(date);
    }
    public getStartEndTime(startEndTime: string): Date {
        if (!isNullOrUndefined(startEndTime) && startEndTime !== '') {
            let startEndDate: Date = this.resetTime(this.getCurrentTime());
            let timeString: string[] = startEndTime.split(':');
            if (timeString.length === 2) {
                startEndDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0);
            }
            return startEndDate;
        }
        return null;
    }
    public resetTime(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    public getCurrentTime(): Date {
        // if (this.timezone) {
        //     let localOffset: number & string = new Date().getTimezoneOffset() as number & string;
        //     return this.tzModule.convert(new Date(), localOffset, this.timezone as number & string);
        // }
        return new Date();
    }
    public boundaryValidation(pageY: number, pageX: number): ResizeEdges {
        let autoScrollDistance: number = 30;
        let scrollEdges: ResizeEdges = { left: false, right: false, top: false, bottom: false };
        let viewBoundaries: ClientRect = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).getBoundingClientRect();
        if ((pageY < viewBoundaries.top + autoScrollDistance + window.pageYOffset) &&
            (pageY > viewBoundaries.top + window.pageYOffset)) {
            scrollEdges.top = true;
        }
        if ((pageY > (viewBoundaries.bottom - autoScrollDistance) + window.pageYOffset) &&
            (pageY < viewBoundaries.bottom + window.pageYOffset)) {
            scrollEdges.bottom = true;
        }
        if ((pageX < viewBoundaries.left + autoScrollDistance + window.pageXOffset) &&
            (pageX > viewBoundaries.left + window.pageXOffset)) {
            scrollEdges.left = true;
        }
        if ((pageX > (viewBoundaries.right - autoScrollDistance) + window.pageXOffset) &&
            (pageX < viewBoundaries.right + window.pageXOffset)) {
            scrollEdges.right = true;
        }
        return scrollEdges;
    }
    public onCellMouseDown(e: Event & MouseEvent): void {
        if (this.keyboardInteractionModule) {
            this.keyboardInteractionModule.onCellMouseDown(e);
        }
    }
    public getNavigateView(): View {
        if (this.isTimelineView()) {
            return this.options.currentView === 'TimelineMonth' || this.options.currentView === 'TimelineYear' ? 'TimelineDay' : 'Agenda';
        }
        return 'Day';
    }
    public addSelectedClass(cells: HTMLTableCellElement[], focusCell: HTMLTableCellElement): void {
        for (let cell of cells) {
            cell.setAttribute('aria-selected', 'true');
        }
        addClass(cells, cls.SELECTED_CELL_CLASS);
        if (focusCell) {
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
        }
    }
    public removeSelectedClass(): void {
        let selectedCells: Element[] = this.getSelectedElements();
        for (let cell of selectedCells) {
            cell.setAttribute('aria-selected', 'false');
            cell.removeAttribute('tabindex');
        }
        removeClass(selectedCells, cls.SELECTED_CELL_CLASS);
    }
    public setWorkHours(dates: Date[], start: string, end: string, groupIndex?: number): void {
        let cells: HTMLTableCellElement[] = [];
        cells = this.getWorkHourCells(dates, start, end, groupIndex);
        addClass(cells, cls.WORK_HOURS_CLASS);
    }
    public resetWorkHours(dates: Date[] = this.activeView.renderDates, start?: string, end?: string, groupIndex?: number): void {
        if (dates && start && end) {
            let cells: HTMLTableCellElement[] = this.getWorkHourCells(dates, start, end, groupIndex);
            removeClass(cells, cls.WORK_HOURS_CLASS);
        } else {
            let workHourCells: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            removeClass(workHourCells, cls.WORK_HOURS_CLASS);
        }
    }

    private getWorkHourCells(dates: Date[], start: string, end: string, groupIndex?: number): HTMLTableCellElement[] {
        if (['Agenda', 'MonthAgenda', 'Month', 'TimelineMonth'].indexOf(this.options.currentView) > -1) {
            return [];
        }
        let startHour: Date = this.getStartEndTime(start);
        let endHour: Date = this.getStartEndTime(end);
        let tableEle: HTMLTableElement = this.getContentTable() as HTMLTableElement;
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour) || !tableEle) {
            return [];
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        let viewStartHour: Date = this.activeView.getStartHour();
        if (startHour < viewStartHour) {
            startHour = viewStartHour;
        }
        let viewEndHour: Date = this.activeView.getEndHour();
        if (endHour > viewEndHour) {
            endHour = viewEndHour;
        }
        let msMajorInterval: number = this.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        let msInterval: number = msMajorInterval / this.activeViewOptions.timeScale.slotCount;
        let startIndex: number = Math.round((startHour.getTime() - viewStartHour.getTime()) / msInterval);
        let endIndex: number = Math.ceil((endHour.getTime() - viewStartHour.getTime()) / msInterval);
        let tempStartIndex: number = startIndex;
        let tempEndIndex: number = endIndex;
        let cells: HTMLTableCellElement[] = [];
        for (let date of dates) {
            date = this.getDateTime(date);
            this.resetTime(date);
            let renderDates: Date[] = this.activeView.renderDates;
            // if (!isNullOrUndefined(groupIndex) && this.resourceBase && !this.activeView.isTimelineView()) {
            //     renderDates = this.resourceBase.lastResourceLevel[groupIndex].renderDates;
            // }
            let colIndex: number = this.getIndexOfDate(renderDates, date);
            if (colIndex >= 0) {
                if (this.isTimelineView()) {
                    let slotsPerDay: number = Math.round((viewEndHour.getTime() - viewStartHour.getTime()) / msInterval);
                    startIndex = tempStartIndex + (colIndex * slotsPerDay);
                    endIndex = tempEndIndex + (colIndex * slotsPerDay);
                }
                for (let i: number = startIndex; i < endIndex; i++) {
                    if (this.isTimelineView()) {
                        let rowIndex: number = (!isNullOrUndefined(groupIndex)) ? groupIndex : 0;
                        cells.push(tableEle.rows[rowIndex].cells[i]);
                    } else {
                        if (!isNullOrUndefined(groupIndex)) {
                            let tds: HTMLTableCellElement[] = [].slice.call(tableEle.rows[i].querySelectorAll
                                ('.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + groupIndex + '"]'));
                            cells.push(tds[colIndex]);
                        } else {
                            cells.push(tableEle.rows[i].cells[colIndex]);
                        }
                    }
                }
            }
        }
        return cells;
    }
    public getCellDetails(tdCol: Element | Element[]): CellClickEventArgs {
        let td: Element[] = (tdCol instanceof Array) ? tdCol : [tdCol];
        let firstTd: Element = getElement(td[0]);
        let lastTd: Element = getElement(td.slice(-1)[0]);
        let startTime: Date = this.getDateFromElement(firstTd);
        let endTime: Date = this.getDateFromElement(lastTd);
        if (isNullOrUndefined(startTime) || isNullOrUndefined(endTime)) {
            return undefined;
        }
        let endDateFromColSpan: boolean = this.isTimelineView() && !isNullOrUndefined(lastTd.getAttribute('colSpan')) &&
            this.activeViewOptions.headerRows.length > 0;
        let duration: number = endDateFromColSpan ? parseInt(lastTd.getAttribute('colSpan'), 10) : 1;
        if (!this.activeViewOptions.timeScale.enable || endDateFromColSpan || lastTd.classList.contains(cls.ALLDAY_CELLS_CLASS) ||
            lastTd.classList.contains(cls.HEADER_CELLS_CLASS)) {
            endTime = util.addDays(new Date(endTime.getTime()), duration);
        } else {
            endTime = this.activeView.getEndDateFromStartDate(endTime);
        }
        let data: CellClickEventArgs = {
            startTime: startTime,
            endTime: endTime,
            isAllDay: this.isAllDayCell(firstTd),
            element: firstTd as HTMLElement
        };
        let groupIndex: string = firstTd.getAttribute('data-group-index');
        if (!isNullOrUndefined(groupIndex)) {
            data.groupIndex = parseInt(groupIndex, 10);
        }
        return data;
    }
    public getSelectedElements(): Element[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_CELL_CLASS));
    }
    public selectCell(element: HTMLElement & HTMLTableCellElement): void {
        this.removeSelectedClass();
        this.addSelectedClass([element], element);
    }
    public getAllDayRow(): Element {
        return this.element.querySelector('.' + cls.ALLDAY_ROW_CLASS);
    }
    public getTableRows(): HTMLElement[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr:not(.' + cls.HIDDEN_CLASS + ')'));
    }
    public getWorkCellElements(): Element[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
    }
    public getContentTable(): HTMLElement {
        return this.element.querySelector('.e-content-table tbody') as HTMLElement;
    }
    public getIndexOfDate(collection: Date[], date: Date): number {
        return collection.map(Number).indexOf(+date);
    }
    public setHeight(): void {
        this.element.style.height = formatUnit(this.options.height);
    }
    public setDimensions(): void {
        this.setHeight();
        let data: NotifyEventArgs = { cssProperties: this.getCssProperties() };
        this.onScrollUiUpdate(data);
    }
    public getCssProperties(): ScrollCss {
        let cssProps: ScrollCss = {
            border: this.options.enableRtl ? 'borderLeftWidth' : 'borderRightWidth',
            padding: this.options.enableRtl ? 'paddingLeft' : 'paddingRight',
            rtlBorder: this.options.enableRtl ? 'borderRightWidth' : 'borderLeftWidth',
            rtlPadding: this.options.enableRtl ? 'paddingRight' : 'paddingLeft'
        };
        return cssProps;
    }
    public onScrollUiUpdate(args: NotifyEventArgs): void {
        if (this.activeView) {
            this.activeView.onScrollUiUpdate(args);
        }
    }
    public onVirtualScroll(): void {
        if (this.virtualScrollModule) {
            this.virtualScrollModule.virtualScrolling();
        }
    }
    public removeNewEventElement(): void {
        let eventClone: HTMLElement = this.element.querySelector('.e-new-event');
        if (!isNullOrUndefined(eventClone)) {
            remove(eventClone);
        }
    }
    private closeSidebar(e: Event): void {
        let sidebar: Element = this.element.querySelector('.e-sidebar');
        if (closest(e.target as Element, '.e-icon-menu,.e-sidebar') && sidebar && sidebar.classList.contains('e-open')) {
            e.preventDefault();
            return;
        }
    }
    private closeHeaderPopup(e: Event): void {
        let closestEle: Element = closest(e.target as HTMLElement, '.e-date-range,.e-header-popup,.e-day,.e-selected');
        let element: Element = this.element.querySelector('.e-header-popup');
        if (!isNullOrUndefined(closestEle)) {
            return;
        }
        if (element && this.headerPopup) {
            this.headerPopup.hide();
        }
    }
    private closeQuickPopup(e: Event): void {
        let classNames: string = '.' + cls.POPUP_WRAPPER_CLASS + ',.' + cls.HEADER_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS +
            ',.' + cls.WORK_CELLS_CLASS + ',.' + cls.APPOINTMENT_CLASS + ',.e-popup';
        let closestEle: Element = closest(e.target as HTMLElement, classNames);
        let element: Element = this.element.querySelector('.e-quick-popup-wrapper');
        if (!isNullOrUndefined(closestEle)) {
            return;
        }
        if (element && element.childElementCount > 0 && this.quickPopup) {
            this.quickPopup.hide();
        }
        if (closest(e.target as HTMLElement, '.' + cls.APPOINTMENT_CLASS + ',.' + cls.HEADER_CELLS_CLASS)) {
            this.removeNewEventElement();
        }
        if (!closest(e.target as HTMLElement, classNames) && this.quickPopup) {
            this.quickPopup.hide();
            this.removeNewEventElement();
        }
    }
    public beforeOpenEditor(): void {
        this.onClosePopup();
        this.removeNewEventElement();
    }
    public createCalendarPopup(): void {
        let headerPopupEle: HTMLElement = this.element.querySelector('.e-header-popup');
        if (headerPopupEle && !this.headerPopup) {
            this.headerPopup = new Popup(headerPopupEle, {
                actionOnScroll: 'hide',
                targetType: 'relative',
                relateTo: this.isAdaptive ? this.element.querySelector('.e-schedule-toolbar') as HTMLElement :
                    this.element.querySelector('.e-date-range') as HTMLElement,
                position: { X: 'left', Y: 'bottom' },
                enableRtl: this.options.enableRtl
            });
            this.headerPopup.isStringTemplate = true;
        }
        if (this.headerPopup) {
            if (this.headerPopup.element.classList.contains(cls.POPUP_OPEN)) {
                this.headerPopup.hide();
            } else {
                this.headerPopup.show();
            }
        }
    }
    public createQuickPopup(guid: string): void {
        if (this.isAdaptive && isNullOrUndefined(guid)) {
            let newEventClone: HTMLElement = this.element.querySelector('.' + cls.NEW_EVENT_CLASS) as HTMLElement;
            if (isNullOrUndefined(newEventClone)) {
                newEventClone = createElement('div', {
                    className: cls.NEW_EVENT_CLASS,
                    innerHTML: '<div class="e-title">New Event</div>'
                });
            }
            this.currentCell.appendChild(newEventClone);
            return;
        }
        let popupEle: HTMLElement = this.element.querySelector('.e-quick-popup-wrapper');
        let isEventPopup: boolean;
        if (!isNullOrUndefined(guid)) {
            isEventPopup = true;
            this.currentCell = this.element.querySelector('.e-appointment[data-guid="' + guid + '"]');
            this.activeEventData = { element: this.currentCell, guid: [guid] } as EventClickArgs;
        }
        let isWorkCell: boolean = this.currentCell.classList.contains(cls.WORK_CELLS_CLASS) ||
            this.currentCell.classList.contains(cls.ALLDAY_CELLS_CLASS);
        if (isWorkCell && this.getSelectedElements().length === 0) {
            this.selectCell(this.currentCell);
        }
        if (popupEle && !this.quickPopup) {
            this.quickPopup = new Popup(popupEle, {
                targetType: (this.isAdaptive ? 'container' : 'relative'),
                enableRtl: this.options.enableRtl,
                relateTo: this.currentCell,
                open: this.quickPopupOpen.bind(this),
                //close: this.quickPopupClose.bind(this),
                hideAnimation: (this.isAdaptive ? { name: 'ZoomOut' } : { name: 'FadeOut', duration: 150 }),
                showAnimation: (this.isAdaptive ? { name: 'ZoomIn' } : { name: 'FadeIn', duration: 150 }),
                collision: (this.isAdaptive ? { X: 'fit', Y: 'fit' } :
                    (this.options.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'none', Y: 'fit' })),
                position: (this.isAdaptive || this.options.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }),
                viewPortElement: (this.isAdaptive ? document.body : this.element),
                zIndex: (this.isAdaptive ? 1004 : 3)
            });
            this.quickPopup.isStringTemplate = true;
        }
        if (this.quickPopup) {
            if (this.isAdaptive) {
                addClass([this.quickPopup.element], 'e-device');
            }
            this.quickPopup.relateTo = this.currentCell;
            if (isEventPopup) {
                this.applyEventColor();
            }
            this.adjustPopupPosition();
        }
    }
    private applyEventColor(): void {
        let colorField: string = '';
        if (this.options.currentView === 'Agenda' || this.options.currentView === 'MonthAgenda') {
            colorField = this.options.enableRtl ? 'border-right-color' : 'border-left-color';
        } else {
            colorField = 'background-color';
        }
        // tslint:disable-next-line:no-any
        let color: string = (<HTMLElement>this.activeEventData.element).style[<any>colorField];
        if (color === '') {
            return;
        }
        let colorEle: HTMLElement = this.quickPopup.element.querySelector('.' + cls.POPUP_HEADER_CLASS) as HTMLElement;
        let footerEle: HTMLElement = this.quickPopup.element.querySelector('.' + cls.POPUP_FOOTER_CLASS) as HTMLElement;
        if (footerEle) {
            colorEle = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLElement;
            if (colorEle) {
                colorEle.style.borderLeftColor = color;
                color = `rgba(${color.match(/\d+/g).join()},0.3)`;
            }
        }
        if (colorEle) {
            colorEle.style.backgroundColor = color;
        }
    }
    public inlineEdit(clickType: string, isTemplate: boolean, guid: string = null): void {
        this.inlineModule.inlineEdit(clickType, isTemplate, guid);
    }

    public inlineCrudActions(target: HTMLTableCellElement): void {
        if (closest(target, '.' + cls.INLINE_APPOINTMENT_CLASS)) {
            let saveObj: { [key: string]: Object } = this.inlineModule.generateEventData(target);
            saveObj.startTime = util.addLocalOffset(saveObj.startTime as Date);
            saveObj.endTime = util.addLocalOffset(saveObj.endTime as Date);
            this.dotNetRef.invokeMethodAsync('AddInlineAppointment', saveObj, saveObj.groupIndex);
        } else {
            let sub: string = (target as HTMLTableCellElement & HTMLInputElement).value;
            this.dotNetRef.invokeMethodAsync('SaveInlineAppointment', sub);
        }
        this.inlineModule.removeInlineAppointmentElement();
    }

    private quickPopupOpen(): void {
        if (this.isAdaptive) {
            this.quickPopup.element.style.top = '0px';
            return;
        }
        if (this.quickPopup.element.querySelector('.' + cls.CELL_POPUP_CLASS)) {
            let subjectElement: HTMLElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLElement;
            if (subjectElement) {
                (<HTMLInputElement>subjectElement).focus();
            }
        } else {
            let editElement: HTMLElement = this.quickPopup.element.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLElement;
            if (editElement) {
                (<HTMLInputElement>editElement).focus();
            }
            let editIcon: HTMLElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLElement;
            if (editIcon) {
                (<HTMLInputElement>editIcon).focus();
            }
        }
    }
    public adjustPopupPosition(): void {
        let display: string = this.quickPopup.element.style.display;
        this.quickPopup.element.style.display = 'block';
        if (this.isAdaptive) {
            this.quickPopup.element.removeAttribute('style');
            this.quickPopup.element.style.display = 'block';
            this.quickPopup.element.style.height = formatUnit((this.isTapHold) ? 65 : window.innerHeight);
        } else {
            this.quickPopup.offsetX = 10;
            this.quickPopup.collision = { X: this.options.enableRtl ? 'flip' : 'none', Y: 'fit' };
            this.quickPopup.position = { X: this.options.enableRtl ? 'left' : 'right', Y: 'top' };
            this.quickPopup.dataBind();
            this.quickPopup.refreshPosition(null, true);
            let collide: string[] = isCollide(this.quickPopup.element, this.element);
            if (collide.indexOf(this.options.enableRtl ? 'left' : 'right') > -1) {
                this.quickPopup.offsetX = -(this.currentCell as HTMLElement).offsetWidth - 10 - this.quickPopup.element.offsetWidth;
                this.quickPopup.dataBind();
                let leftCollide: string[] = isCollide(this.quickPopup.element, this.element);
                if (leftCollide.indexOf('left') > -1) {
                    this.quickPopup.position = { X: 'center', Y: 'center' };
                    this.quickPopup.collision = { X: 'fit', Y: 'fit' };
                    this.quickPopup.offsetX = -(this.quickPopup.element.offsetWidth / 2);
                    this.quickPopup.dataBind();
                }
            }
            if (this.virtualScrollModule && (collide.indexOf('top') > -1 || collide.indexOf('bottom') > -1)) {
                let element: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table');
                let translateY: number = util.getTranslateY(element);
                this.quickPopup.offsetY = translateY;
                this.quickPopup.dataBind();
            }
        }
        // if (isEventPopup) {
        //     this.applyEventColor();
        // }
        this.quickPopup.element.style.display = display;
        this.quickPopup.dataBind();
        this.quickPopup.show();
    }
    public onQuickPopupClose(): void {
        this.isTapHold = false;
        if (this.quickPopup && this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            this.quickPopup.hide();
        }
        this.eventBase.focusElement();
    }
    public onClosePopup(): void {
        //this.quickPopupHide();
        if (this.quickPopup) {
            this.quickPopup.hide();
        }
        this.eventBase.focusElement();
    }
    public createMoreEventPopup(clsName: string, dataDate: string): void {
        let popupEle: HTMLElement = this.element.querySelector('.e-more-popup-wrapper');
        if (popupEle && !this.morePopup) {
            this.morePopup = new Popup(popupEle, {
                targetType: (this.isAdaptive ? 'container' : 'relative'),
                enableRtl: this.options.enableRtl,
                hideAnimation: { name: 'ZoomOut', duration: 300 },
                showAnimation: { name: 'ZoomIn', duration: 300 },
                //open: this.morePopupOpen.bind(this),
                //close: this.morePopupClose.bind(this),
                collision: (this.isAdaptive ? { X: 'fit', Y: 'fit' } :
                    (this.options.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'flip', Y: 'flip' })),
                viewPortElement: (this.isAdaptive ? document.body : this.element),
                zIndex: (this.isAdaptive ? 1002 : 2)
            });
            this.morePopup.isStringTemplate = true;
        }
        if (this.morePopup) {
            let appointments: NodeListOf<HTMLElement> = this.morePopup.element.querySelectorAll('.e-appointment');
            for (let i: number = 0; i < appointments.length; i++) {
                let ele: HTMLElement = appointments[i];
                this.eventBase.wireAppointmentEvents(ele, this.options.currentView === 'TimelineYear' ? true : false, true);
            }
            this.morePopup.relateTo = this.element.querySelector('.' + clsName + '[data-date="' + dataDate + '"]') as HTMLElement;
            this.morePopup.show();
        }
    }
    public onMoreEventPopupClose(): void {
        if (this.morePopup && this.morePopup.element.classList.contains(cls.POPUP_OPEN)) {
            this.onQuickPopupClose();
            this.morePopup.hide();
        }
    }
    public getTooltipPosition(fieldName: string, isQuickPopup: boolean): void {
        let dlgContent: HTMLElement;
        if (isQuickPopup) {
            dlgContent = this.element.querySelector('.e-quick-popup-wrapper');
        } else {
            dlgContent = document.querySelector('#' + this.element.id + '_dialog_wrapper' + ' .e-dlg-content');
        }
        let fieldEle: HTMLElement = dlgContent.querySelector('#' + fieldName);
        let inputClient: ClientRect = fieldEle.getBoundingClientRect();
        let dlgClient: ClientRect = dlgContent.getBoundingClientRect();
        let toolTipPos: { [key: string]: Object } = {};
        toolTipPos[fieldName] = 'top:' + (inputClient.bottom - dlgClient.top + dlgContent.scrollTop + 9) +
            'px;left:' + (inputClient.left - dlgClient.left + dlgContent.scrollLeft + inputClient.width / 2) + 'px;';
        this.dotNetRef.invokeMethodAsync('ErrorPositioning', toolTipPos, isQuickPopup);
    }
    public scrollTo(hour: string, scrollDate?: Date): void {
        scrollDate = isNullOrUndefined(scrollDate) ? scrollDate : this.getDateTime(scrollDate);
        if (this.activeView.scrollToDate && isNullOrUndefined(hour) && scrollDate) {
            this.activeView.scrollToDate(scrollDate);
        } else if (this.activeView.scrollToHour) {
            this.activeView.scrollToHour(hour, scrollDate);
        }
    }
    public print(): void {
        let printEle: HTMLElement = this.element;
        let currentView: View = this.options.currentView;
        let clone: HTMLElement = printEle.cloneNode(true) as HTMLElement;
        clone.id = this.element.id + '_print';
        document.body.appendChild(clone);
        function getScrollableElement(scrollElement: Element): Element {
            if (currentView === 'MonthAgenda') {
                return scrollElement.querySelector('.e-appointment-wrap');
            }
            return scrollElement.querySelector('.e-content-wrap');
        }
        let scrollEle: Element = getScrollableElement(this.element);
        let top: number = scrollEle.scrollTop;
        let left: number = scrollEle.scrollLeft;
        let links: Element[] = [].slice.call(document.getElementsByTagName('head')[0].querySelectorAll('link, style'));
        let reference: string = '';
        links.forEach((link: Element) => {
            reference += link.outerHTML;
        });
        let div: Element = createElement('div');
        clone.style.width = this.element.offsetWidth + 'px';
        let elementWidth: number = Math.round((parseInt(clone.style.width, 10)) / 100) * 100;
        div.appendChild(clone);
        let printWindow: Window = window.open('', 'print', 'height=550,width=' + elementWidth + ',tabbar=no');
        printWindow.document.write('<!DOCTYPE html> <html><head>' + reference + '</head><body>' + div.innerHTML +
            '<script> (function() { window.ready = true; })(); </script>' + '</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(
            () => {
                // tslint:disable-next-line:no-any
                let scrollableEle: Element = getScrollableElement(printWindow.document.body);
                scrollableEle.scrollLeft = left;
                scrollableEle.scrollTop = top;
                let headerTimeCellsScroll: HTMLElement = printWindow.document.querySelector('.e-date-header-wrap');
                if (currentView.indexOf('Timeline') !== -1) {
                    headerTimeCellsScroll.scrollLeft = left;
                }
                if (currentView === 'Day' || currentView === 'Week'
                    || currentView === 'WorkWeek') {
                    let timeCellsScroll: HTMLElement = printWindow.document.querySelector('.e-time-cells-wrap');
                    timeCellsScroll.scrollTop = top;
                    headerTimeCellsScroll.scrollLeft = left;
                }
                if (currentView === 'Month') {
                    headerTimeCellsScroll.scrollLeft = left;
                }
                printWindow.print();
                printWindow.close();
            },
            2000);
    }
    private wireEvents(): void {
        this.wireTouchEvents();
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.onScheduleResize, this);
        EventHandler.add(<HTMLElement & Window><unknown>window, 'orientationchange', this.onScheduleResize, this);
        EventHandler.add(document, Browser.touchStartEvent, this.onDocumentClick, this);
    }
    private unwireEvents(): void {
        this.unwireTouchEvents();
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.onScheduleResize);
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'orientationchange', this.onScheduleResize);
        EventHandler.remove(document, Browser.touchStartEvent, this.onDocumentClick);
    }

    private wireTouchEvents(): void {
        let element: HTMLElement = this.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS) as HTMLElement;
        if (element && isNullOrUndefined(this.touchObj)) {
            this.touchObj = new Touch(element, {
                tapHold: this.tapHoldHandler.bind(this)
            });
        }
    }

    private unwireTouchEvents(): void {
        if (this.touchObj) {
            this.touchObj.destroy();
        }
    }

    private tapHoldHandler(e: TapEventArgs): void {
        let target: Element = closest((e.originalEvent.target as Element), '.' + cls.APPOINTMENT_CLASS);
        if (!isNullOrUndefined(target) && this.isAdaptive) {
            let guid: string = target.getAttribute('data-guid');
            this.isTapHold = true;
            this.selectedElements = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
            this.eventBase.getSelectedEventElements(target);
            this.dotNetRef.invokeMethodAsync('OnTapHold', guid, this.isTapHold);
            return;
        }
    }

    private onScheduleResize(): void {
        this.onClosePopup();
        if (this.morePopup) {
            this.morePopup.hide();
        }
        if (this.options.currentView === 'Month' || !this.activeViewOptions.timeScale.enable || this.isTimelineView()) {
            this.activeView.resetColWidth();
            this.onScrollUiUpdate({ cssProperties: this.getCssProperties(), isPreventScrollUpdate: true });
            this.dataReady();
        }
    }
    private onDocumentClick(e: Event): void {
        if (this.options.allowInline) {
            let target: HTMLInputElement = this.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) as HTMLInputElement;
            if (target && target.value !== '') {
                this.inlineCrudActions(target as HTMLTableCellElement & HTMLInputElement);
            } else {
                this.inlineModule.removeInlineAppointmentElement();
            }
        }
        this.closeHeaderPopup(e);
        this.closeSidebar(e);
        this.closeQuickPopup(e);
        if (this.eventBase) {
            this.eventBase.appointmentBorderRemove(e);
        }
        let target: Element = e.target as Element;
        if (this.morePopup && !closest(target, '.' + cls.MORE_POPUP_WRAPPER_CLASS) && !target.classList.contains(cls.MORE_INDICATOR_CLASS)
            && (!closest(target, '.' + cls.POPUP_OPEN)) && !closest(target, '.' + cls.WORK_CELLS_CLASS)) {
            this.morePopup.hide();
        }
    }
    public setPersistence(): void {
        if (this.options.enablePersistence) {
            let props: Object = { selectedDate: this.options.selectedDate, currentView: this.options.currentView };
            window.localStorage.setItem(this.element.id, JSON.stringify(props));
        }
    }
    public destroy(): void {
        this.isDestroyed = true;
        this.setPersistence();
        this.unwireEvents();
        if (this.headerPopup) {
            this.headerPopup.destroy();
        }
        if (this.quickPopup) {
            this.quickPopup.destroy();
        }
        if (this.morePopup) {
            this.morePopup.destroy();
        }
        if (this.keyboardInteractionModule) {
            this.keyboardInteractionModule.destroy();
        }
        if (this.activeView) {
            this.activeView.destroy();
            this.activeView = null;
        }
    }
}