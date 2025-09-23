/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, closest, Draggable, extend, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, remove, removeClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { DragEventArgs, EventFieldsMapping, TdData, EJ2Instance } from '../base/interface';
import { ActionBase } from '../actions/action-base';
import { MonthEvent } from '../event-renderer/month';
import { TimelineEvent } from '../event-renderer/timeline-view';
import { YearEvent } from '../event-renderer/year';
import { HeaderRowsModel } from '../models/header-rows-model';
import { VerticalEvent } from '../event-renderer/vertical-view';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import * as util from '../base/util';
import { NavigationDirection } from '../base/type';

const MINUTES_PER_DAY: number = 1440;

/**
 * Schedule events drag actions
 */

export class DragAndDrop extends ActionBase {
    private widthUptoCursorPoint: number = 0;
    private heightUptoCursorPoint: number = 0;
    private timelineEventModule: TimelineEvent;
    private cursorPointIndex: number = 0;
    private isHeaderRows: boolean = false;
    private isTimelineDayProcess: boolean = false;
    private widthPerMinute: number = 0;
    private heightPerMinute: number = 0;
    private minDiff: number = 0;
    private isStepDragging: boolean = false;
    private isMorePopupOpened: boolean = false;
    private isAllDayDrag: boolean = false;
    private isMultiSelect: boolean = false;
    private multiData: Record<string, any>[] = [];
    private updatedData: Record<string, any>[] = [];
    private swagData: Record<string, any>[] = [];
    private startTime: number = 0;
    private isAllDayTarget: boolean = false;
    private targetTd: HTMLElement = null;
    private isCursorAhead: boolean = false;
    private dragArea: HTMLElement;
    private enableCurrentViewDrag: boolean = false;
    private isPreventMultiDrag: boolean = false;
    private slotsUptoCursor: number = -1;
    private eleTop: number = 0;
    private distanceUptoCursor: number = 0;

    public wireDragEvent(element: HTMLElement): void {
        new Draggable(element, {
            abort: '.' + cls.EVENT_RESIZE_CLASS + ', .' + cls.INLINE_EDIT_CLASS,
            clone: true,
            isDragScroll: true,
            enableTailMode: this.parent.eventDragArea ? true : false,
            cursorAt: (this.parent.eventDragArea) ? { left: -20, top: -20 } : { left: 0, top: 0 },
            dragArea: this.dragArea,
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
            queryPositionInfo: this.dragPosition.bind(this)
        });
    }

    public setDragArea(): void {
        const dragElement: HTMLElement = document.querySelector(this.parent.eventDragArea);
        this.dragArea = this.parent.eventDragArea && dragElement ? dragElement :
            this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
    }

    private dragHelper(e: Record<string, any>): HTMLElement {
        if (e.sender && e.sender.type === 'touchmove' && (!this.parent.uiStateValues.isTapHold ||
            !e.element.classList.contains(cls.APPOINTMENT_BORDER))) {
            return null;
        }
        this.setDragActionDefaultValues();
        this.actionObj.element = e.element as HTMLElement;
        if (e.sender && ['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) > -1) {
            const eventArgs: (MouseEvent & TouchEvent) | Touch = this.parent.eventBase.getPageCoordinates(e.sender);
            this.distanceUptoCursor = eventArgs.clientY - this.actionObj.element.getBoundingClientRect().top;
            this.eleTop = parseFloat(this.actionObj.element.style.top);
            this.slotsUptoCursor = -1;
        }
        this.actionObj.action = 'drag';
        let elements: Element[] = [];
        if (!this.parent.allowMultiDrag || isNullOrUndefined(this.parent.selectedElements) || this.parent.selectedElements.length === 0 ||
            (this.parent.selectedElements.length > 0 && this.parent.selectedElements.indexOf(this.actionObj.element) === -1)) {
            elements = [e.element as HTMLElement];
        } else {
            elements = this.parent.selectedElements;
            this.isMultiSelect = true;
        }
        elements.forEach((ele: HTMLElement) => {
            const cloneElement: HTMLElement = this.createCloneElement(ele);
            if (ele.getAttribute('data-guid') === this.actionObj.element.getAttribute('data-guid')) {
                this.actionObj.clone = cloneElement;
                if (!this.parent.eventDragArea && this.parent.currentView !== 'Month' &&
                    this.parent.activeViewOptions.timeScale.enable && !this.parent.activeView.isTimelineView() &&
                    !this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                    setStyleAttribute(this.actionObj.clone, { cursor: 'move', left: '0%', right: '0%', width: '100%' });
                }
                this.actionObj.clone.style.top = formatUnit(this.actionObj.element.offsetTop);
            }
            this.actionObj.cloneElement.push(cloneElement);
            this.actionObj.originalElement.push(ele);
        });
        return this.actionObj.clone;
    }

    private dragPosition(e: Record<string, any>): Record<string, any> {
        if (this.parent.eventDragArea) {
            return { left: e.left, top: e.top };
        }
        const cellHeight: number = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
        let leftValue: string = formatUnit(0);
        if (this.parent.currentView === 'Month') {
            leftValue = e.left as string;
        }
        let cloneRight: number;
        if (this.isStepDragging) {
            cloneRight = Math.ceil(this.actionObj.clone.getBoundingClientRect().right) + this.actionObj.interval;
        } else {
            cloneRight = this.actionObj.clone.getBoundingClientRect().right;
        }
        const dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        const contentWrapRight: number = dragArea.getBoundingClientRect().right;
        if (this.parent.activeView.isTimelineView() && this.parent.currentView !== 'TimelineYear' && !this.parent.enableRtl &&
            this.actionObj.pageX > cloneRight && !this.isMorePopupOpened && !(this.actionObj.pageX > contentWrapRight)) {
            this.isCursorAhead = true;
        }
        if (this.parent.activeView.isTimelineView()) {
            leftValue = formatUnit(this.actionObj.clone.offsetLeft);
        }
        let topValue: string;
        if ((this.parent.activeView.isTimelineView() || !this.parent.timeScale.enable ||
            (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
                this.actionObj.clone.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS)))) {
            topValue = formatUnit(this.actionObj.clone.offsetTop);
        } else if (this.parent.currentView === 'Month') {
            topValue = formatUnit(0);
        } else if (this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
            topValue = formatUnit((<HTMLElement>this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS)).offsetTop);
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth),
                right: this.parent.enableRtl && formatUnit(0)
            });
        } else {
            if (this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) &&
                !this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                setStyleAttribute(this.actionObj.clone, {
                    height: formatUnit(this.actionObj.cellHeight),
                    width: formatUnit(this.actionObj.cellWidth - 1),
                    pointerEvents: 'none'
                });
            }
            let top: number = parseInt(<string>e.top, 10);
            top = top < 0 ? 0 : top;
            if (this.slotsUptoCursor < 0) {
                const cellsCountUptoCursor: number = Math.floor((this.eleTop + this.distanceUptoCursor) / cellHeight);
                const cellsCountUptoEleTop: number = Math.floor(this.eleTop / cellHeight);
                this.slotsUptoCursor = cellsCountUptoCursor - cellsCountUptoEleTop;
            }
            top = (Math.floor((top + this.distanceUptoCursor + 1) / cellHeight) - this.slotsUptoCursor) * cellHeight;
            topValue = formatUnit(top < 0 ? 0 : top);
            const scrollHeight: number = this.parent.element.querySelector('.e-content-wrap').scrollHeight;
            const cloneBottom: number = parseInt(topValue, 10) + this.actionObj.clone.offsetHeight;
            if (cloneBottom > scrollHeight) {
                topValue = (parseInt(topValue, 10) - (cloneBottom - scrollHeight)) + 'px';
            }
            if (this.isPreventMultiDrag) {
                topValue = formatUnit(this.actionObj.clone.offsetTop);
            }
        }
        return { left: leftValue, top: topValue };
    }

    private setDragActionDefaultValues(): void {
        this.actionObj.action = 'drag';
        this.actionObj.isAllDay = null;
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        const workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
        this.actionObj.cellWidth = workCell.offsetWidth;
        this.actionObj.cellHeight = workCell.offsetHeight;
    }

    private dragStart(e: MouseEvent & TouchEvent & DragEventArgs): void {
        const eventGuid: string = this.actionObj.element.getAttribute('data-guid');
        this.actionObj.event = this.parent.eventBase.getEventByGuid(eventGuid) as Record<string, any>;
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        if (!isNullOrUndefined(eventObj)) {
            this.startTime = (eventObj[this.parent.eventFields.startTime] as Date).getTime();
        }
        if (!this.parent.allowMultiDrag) {
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        const dragArgs: DragEventArgs = {
            cancel: false,
            data: eventObj,
            selectedData: this.getSelectedData(),
            event: e,
            excludeSelectors: null,
            element: this.actionObj.element,
            interval: this.actionObj.interval,
            navigation: { enable: false, timeDelay: 2000 },
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        this.parent.trigger(events.dragStart, dragArgs, (dragEventArgs: DragEventArgs) => {
            if (dragEventArgs.cancel || (!isNullOrUndefined(this.actionObj.element) &&
                isNullOrUndefined(this.actionObj.element.parentElement))) {
                const dragObj: Draggable = (this.actionObj.element as EJ2Instance).ej2_instances[0] as Draggable;
                if (!isNullOrUndefined(dragObj)) {
                    dragObj.intDestroy((e as DragEventArgs).event as MouseEvent & TouchEvent);
                }
                this.isMultiSelect = false;
                this.multiData = [];
                this.actionObj.action = '';
                this.removeCloneElementClasses();
                this.removeCloneElement();
                return;
            }
            this.actionClass('addClass');
            this.parent.uiStateValues.action = true;
            this.actionObj.start = eventObj[this.parent.eventFields.startTime] as Date;
            this.actionObj.end = eventObj[this.parent.eventFields.endTime] as Date;
            this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
            this.actionObj.interval = dragEventArgs.interval;
            this.actionObj.navigation = dragEventArgs.navigation;
            this.actionObj.scroll = dragEventArgs.scroll;
            this.enableCurrentViewDrag = dragArgs.dragWithinRange && !dragArgs.navigation.enable && this.parent.allowMultiDrag;
            this.actionObj.excludeSelectors = dragEventArgs.excludeSelectors;
            const viewElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
            this.scrollArgs = { element: viewElement, width: viewElement.scrollWidth, height: viewElement.scrollHeight };
            this.widthPerMinute = (this.actionObj.cellWidth / this.actionObj.slotInterval) * this.actionObj.interval;
            this.heightPerMinute = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
            this.widthUptoCursorPoint = 0;
            this.heightUptoCursorPoint = 0;
            this.cursorPointIndex = -1;
            this.isHeaderRows = false;
            this.isTimelineDayProcess = false;
            this.minDiff = 0;
            this.isMorePopupOpened = false;
            this.daysVariation = -1;
            this.isAllDayTarget = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS);
            if ((this.parent.activeView.isTimelineView() || !this.parent.timeScale.enable) && this.parent.currentView !== 'TimelineYear') {
                if (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
                    this.actionObj.clone.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS)) {
                    this.isMorePopupOpened = true;
                }
                this.actionObj.pageX = (e as DragEventArgs).event.pageX;
                const rows: HeaderRowsModel[] = this.parent.activeViewOptions.headerRows;
                this.isHeaderRows = rows.length > 0 && rows[rows.length - 1].option !== 'Hour' &&
                    rows[rows.length - 1].option !== 'Date';
                this.isTimelineDayProcess = !this.parent.activeViewOptions.timeScale.enable || this.isHeaderRows ||
                    this.parent.currentView === 'TimelineMonth' || (rows.length > 0 && rows[rows.length - 1].option === 'Date');
                this.isAllDayDrag = !this.isTimelineDayProcess && eventObj[this.parent.eventFields.isAllDay];
                this.isStepDragging = !this.isTimelineDayProcess && !this.isAllDayDrag &&
                    (this.actionObj.slotInterval !== this.actionObj.interval);
                if (this.isTimelineDayProcess) {
                    this.timelineEventModule = new TimelineEvent(this.parent, 'day');
                } else {
                    this.timelineEventModule = new TimelineEvent(this.parent, 'hour');
                }
            }
            if (this.parent.currentView === 'TimelineYear') {
                this.yearEvent = new YearEvent(this.parent);
            }
            if (this.parent.currentView === 'Month') {
                this.startTime = util.resetTime(new Date(this.startTime)).getTime();
                this.updateOriginalElement(this.actionObj.clone);
                this.monthEvent = new MonthEvent(this.parent);
            }
            if (this.parent.currentView === 'Day' || this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek') {
                this.verticalEvent = new VerticalEvent(this.parent);
                this.verticalEvent.initializeValues();
                const splitEvents: Record<string, any>[] = this.splitEvent(this.actionObj.event);
                splitEvents.forEach((event: Record<string, any>) => {
                    let query: string =
                        `.e-day-wrapper[data-date="${(<Date>util.resetTime(event[this.parent.eventFields.startTime])).getTime()}"]`;
                    if (this.parent.activeViewOptions.group.resources.length > 0) {
                        query = query.concat('[data-group-index = "' + this.actionObj.groupIndex + '"]');
                    }
                    const appWrap: HTMLTableCellElement = this.parent.element.querySelector(query) as HTMLTableCellElement;
                    if (appWrap) {
                        const appEle: Element = appWrap.querySelector('[data-id="' + this.actionObj.clone.getAttribute('data-id') + '"]');
                        if (appEle) {
                            addClass([appEle], cls.EVENT_ACTION_CLASS);
                        }
                    }
                });
            }
        });
    }

    public getSelectedData(): Record<string, any>[] {
        if (this.isMultiSelect && this.multiData.length === 0 && this.parent.selectedElements.length > 0) {
            for (const element of this.parent.selectedElements) {
                const eventGuid: string = element.getAttribute('data-guid');
                const data: Record<string, any> = this.parent.eventBase.getEventByGuid(eventGuid) as Record<string, any>;
                this.multiData.push(extend({}, data, null, true) as Record<string, any>);
            }
        }
        return this.multiData;
    }

    private drag(e: MouseEvent & TouchEvent): void {
        if ((e as Record<string, any>).event && (e as Record<string, any>).event.type === 'touchmove') {
            (e as Record<string, any>).event.preventDefault();
        }
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide(true);
        }
        if ((!isNullOrUndefined(e.target)) && (e.target as HTMLElement).classList &&
            (e.target as HTMLElement).classList.contains(cls.DISABLE_DATES)) {
            return;
        }
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        const eventArgs: (MouseEvent & TouchEvent) | Touch = this.parent.eventBase.getPageCoordinates(e);
        this.actionObj.Y = this.actionObj.pageY = eventArgs.pageY;
        this.actionObj.X = this.actionObj.pageX = eventArgs.pageX;
        this.actionObj.target = e.target;
        this.widthUptoCursorPoint = (this.widthUptoCursorPoint === 0) ?
            Math.ceil((Math.abs(this.actionObj.clone.getBoundingClientRect().left - this.actionObj.X) / this.widthPerMinute)) *
            this.widthPerMinute : this.widthUptoCursorPoint;
        this.widthUptoCursorPoint = this.isMorePopupOpened ? this.actionObj.cellWidth : this.widthUptoCursorPoint;
        this.heightUptoCursorPoint = (this.heightUptoCursorPoint === 0) ?
            Math.ceil((Math.abs(this.actionObj.clone.getBoundingClientRect().top - this.actionObj.Y) / this.heightPerMinute)) *
            this.heightPerMinute : this.heightUptoCursorPoint;
        if (['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) > -1) {
            this.isAllDayDrag = (this.parent.activeViewOptions.timeScale.enable) ?
                this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) :
                this.actionObj.event[this.parent.eventFields.isAllDay] as boolean;
        }
        if (this.isStepDragging && this.minDiff === 0) {
            this.calculateMinutesDiff(eventObj);
        }
        if ((this.parent.currentView === 'Month' || this.isAllDayDrag) && this.daysVariation < 0) {
            const date: Date = this.parent.getDateFromElement(this.actionObj.target as HTMLElement);
            if (!isNullOrUndefined(date)) {
                const currentDate: Date = util.resetTime(date);
                const startDate: Date = util.resetTime(new Date((eventObj[this.parent.eventFields.startTime] as Date).getTime()));
                this.daysVariation = (currentDate.getTime() - startDate.getTime()) / util.MS_PER_DAY;
            } else {
                this.daysVariation = 0;
            }
        } else {
            this.daysVariation = 0;
        }
        if (this.parent.eventDragArea) {
            const targetElement: HTMLElement = eventArgs.target as HTMLElement;
            this.actionObj.clone.style.top = formatUnit(targetElement.offsetTop);
            this.actionObj.clone.style.left = formatUnit(targetElement.offsetLeft);
            const currentTarget: Element = <Element>closest(targetElement, '.' + cls.ROOT);
            if (!currentTarget) {
                this.actionObj.clone.style.height = '';
                this.actionObj.clone.style.width = '';
            } else {
                if (!(this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek' || this.parent.currentView === 'Day')) {
                    this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
                }
            }
        }
        this.updateScrollPosition(e);
        this.updateNavigatingPosition(e);
        this.updateDraggingDateTime(e);
        const dragArgs: DragEventArgs = {
            data: eventObj, event: e, element: this.actionObj.element, startTime: this.actionObj.start,
            endTime: this.actionObj.end, selectedData: this.updatedData
        };
        if (this.parent.group.resources.length > 0) {
            dragArgs.groupIndex = this.actionObj.groupIndex;
        }
        this.parent.trigger(events.drag, dragArgs);
    }

    private calculateMinutesDiff(eventObj: Record<string, any>): void {
        if (this.parent.enableRtl) {
            this.minDiff =
                ((this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint) / this.widthPerMinute) * this.actionObj.interval;
        } else {
            this.minDiff = (this.widthUptoCursorPoint / this.widthPerMinute) * this.actionObj.interval;
        }
        const startDate: Date = eventObj[this.parent.eventFields.startTime] as Date;
        const startTime: Date = this.parent.activeView.renderDates[0];
        const startEndHours: { [key: string]: Date } =
            util.getStartEndHours(startTime, this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        if (startEndHours.startHour.getTime() > startDate.getTime()) {
            this.minDiff = this.minDiff + ((startEndHours.startHour.getTime() - startDate.getTime()) / util.MS_PER_MINUTE);
        }
    }

    private dragStop(e: MouseEvent): void {
        this.isCursorAhead = false;
        this.isPreventMultiDrag = false;
        this.removeCloneElementClasses();
        this.removeCloneElement();
        clearInterval(this.actionObj.navigationInterval);
        this.actionObj.navigationInterval = null;
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = this.parent.uiStateValues.isTapHold = false;
        if (this.isAllowDrop(e)) {
            return;
        }
        const target: HTMLElement = ((e.target as Element).classList && (!(e.target as Element).classList.contains('e-work-cells') && this.parent.cellTemplate) ?
            closest(e.target as Element, '.e-work-cells') : e.target) as HTMLElement;
        const dragArgs: DragEventArgs = {
            cancel: false, data: this.getChangedData(this.updatedData), selectedData: this.updatedData,
            event: e, element: this.actionObj.element, target: target
        };
        this.actionObj.action = null;
        this.parent.trigger(events.dragStop, dragArgs, (dragEventArgs: DragEventArgs) => {
            if (dragEventArgs.cancel) {
                return;
            }
            if (this.parent.eventBase.checkOverlap(dragEventArgs.data)) {
                return;
            }
            if (this.parent.isSpecificResourceEvents()) {
                this.parent.crudModule.crudObj.isCrudAction = true;
                this.parent.crudModule.crudObj.sourceEvent =
                    [this.parent.resourceBase.lastResourceLevel[parseInt(dragArgs.element.getAttribute('data-group-index'), 10)]];
                const currentGroupIndex: number = parseInt(dragArgs.target.getAttribute('data-group-index'), 10) || this.actionObj.groupIndex;
                this.parent.crudModule.crudObj.targetEvent =
                    [this.parent.resourceBase.lastResourceLevel[parseInt(currentGroupIndex.toString(), 10)]];
            }
            this.saveChangedData(dragEventArgs, this.isMultiSelect);
        });
        this.updatedData = [];
        this.multiData = [];
        this.isMultiSelect = false;
        this.parent.selectedElements = [];
    }

    public updateNavigatingPosition(e: MouseEvent & TouchEvent): void {
        if (this.actionObj.navigation.enable) {
            let currentDate: Date = this.parent.getCurrentTime();
            if (isNullOrUndefined(this.actionObj.navigationInterval)) {
                this.actionObj.navigationInterval = window.setInterval(
                    () => {
                        if (currentDate) {
                            const crtDate: Date = this.parent.getCurrentTime();
                            const end: number = crtDate.getSeconds();
                            let start: number = currentDate.getSeconds() + (this.actionObj.navigation.timeDelay / 1000);
                            start = (start >= 60) ? start - 60 : start;
                            if (start === end) {
                                currentDate = this.parent.getCurrentTime();
                                this.viewNavigation(e);
                                this.updateDraggingDateTime(e);
                            }
                        }
                    },
                    this.actionObj.navigation.timeDelay);
            }
        }
    }

    public updateDraggingDateTime(e: MouseEvent & TouchEvent): void {
        if (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
            this.actionObj.clone.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS)) {
            this.morePopupEventDragging(e);
        } else if (this.parent.activeView.isTimelineView() && this.parent.currentView !== 'TimelineYear') {
            this.timelineEventModule.dateRender = this.parent.activeView.renderDates;
            this.timelineEventModule.cellWidth = this.actionObj.cellWidth;
            this.timelineEventModule.getSlotDates();
            this.actionObj.cellWidth = this.isHeaderRows ? this.timelineEventModule.cellWidth :
                this.parent.getElementWidth(this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS));
            this.calculateTimelineTime(e);
        } else {
            if (this.parent.currentView === 'Month' || this.parent.currentView === 'TimelineYear') {
                this.calculateVerticalDate(e);
            } else {
                this.calculateVerticalTime(e);
            }
        }
    }

    public navigationWrapper(): void {
        if (!this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'Month' || !this.parent.timeScale.enable) {
                const outerWrapperCls: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
                this.actionObj.index = (this.parent.activeView.renderDates.length < this.actionObj.index) ?
                    this.parent.activeView.renderDates.length - 1 : this.actionObj.index;
                let targetWrapper: Element = outerWrapperCls[this.actionObj.index].querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
                if (!targetWrapper) {
                    targetWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                    outerWrapperCls[this.actionObj.index].appendChild(targetWrapper);
                }
                targetWrapper.appendChild(this.actionObj.clone);
            } else {
                const wrapperClass: string = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) ?
                    '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + cls.APPOINTMENT_WRAPPER_CLASS;
                this.parent.element.querySelectorAll(wrapperClass)
                    .item(this.actionObj.index).appendChild(this.actionObj.clone);
                if (wrapperClass === '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS) {
                    const elementHeight: number = this.getAllDayEventHeight();
                    const event: HTMLElement[] =
                        [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS + ':first-child'));
                    if (event[0].offsetHeight < elementHeight) {
                        for (const e of event) {
                            e.style.height = ((elementHeight + 2) / 12) + 'em';
                        }
                    }
                    this.actionObj.clone.style.height = formatUnit(elementHeight);
                }
                this.actionObj.height = parseInt(this.actionObj.clone.style.height, 10);
            }
        } else {
            let outWrapper: Element;
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                outWrapper = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(this.actionObj.index);
            } else {
                outWrapper = this.parent.element.querySelector('.' + cls.APPOINTMENT_CONTAINER_CLASS);
            }
            if (!isNullOrUndefined(outWrapper)) {
                let tarWrapper: Element = outWrapper.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
                if (!tarWrapper) {
                    tarWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                    outWrapper.appendChild(tarWrapper);
                }
                this.actionObj.cloneElement.forEach((ele: HTMLElement) => {
                    tarWrapper.appendChild(ele);
                });
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private viewNavigation(e: MouseEvent & TouchEvent): void {
        let navigationType: NavigationDirection;
        const dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (dragArea && ((!this.scrollEdges.top && !this.scrollEdges.bottom) ||
            closest(this.actionObj.clone, '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS))) {
            if ((dragArea.scrollLeft === 0) &&
                (Math.round(this.actionObj.X) <=
                    Math.round(dragArea.getBoundingClientRect().left + this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'Next' : 'Previous';
            } else if ((Math.round(dragArea.scrollLeft) + dragArea.clientWidth === dragArea.scrollWidth) &&
                (Math.round(this.actionObj.X) >=
                    Math.round(dragArea.getBoundingClientRect().right - this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'Previous' : 'Next';
            }
            if (navigationType) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate(navigationType));
            }
        }
    }

    private morePopupEventDragging(e: MouseEvent & TouchEvent): void {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest((<HTMLTableCellElement>e.target), 'td')))) {
            return;
        }
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        const eventDuration: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime();
        const td: HTMLElement = closest((<HTMLTableCellElement>e.target), 'td') as HTMLElement;
        if (this.parent.currentView === 'TimelineYear' && (!td.classList.contains(cls.WORK_CELLS_CLASS) || td.classList.contains(cls.OTHERMONTH_CLASS))) {
            return;
        }
        const dragStart: Date = this.parent.getDateFromElement(td);
        const dragEnd: Date = new Date(dragStart.getTime());
        dragEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        this.actionObj.start = new Date(dragStart.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.actionObj.clone.style.top = formatUnit((<HTMLElement>td.offsetParent).offsetTop);
        this.actionObj.clone.style.left = formatUnit(td.offsetLeft);
        this.actionObj.clone.style.width = formatUnit(td.offsetWidth);
        if (this.actionObj.cloneElement.length > 1) {
            this.actionObj.cloneElement.forEach((element: HTMLElement) => {
                element.style.width = formatUnit(td.offsetWidth);
            });
        }
        let eventContainer: HTMLElement = td as HTMLElement;
        let eventWrapper: HTMLElement;
        if (this.parent.activeView.isTimelineView()) {
            const rowIndex: number = (closest(td, 'tr') as HTMLTableRowElement).rowIndex;
            eventContainer = this.parent.element.querySelectorAll('.e-appointment-container').item(rowIndex) as HTMLElement;
        }
        eventWrapper = eventContainer.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS) as HTMLElement;
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
    }

    private calculateVerticalTime(e: MouseEvent & TouchEvent): void {
        if (isNullOrUndefined(this.actionObj.target) ||
            (this.actionObj.target && isNullOrUndefined(closest((<HTMLTableCellElement>this.actionObj.target), 'tr'))) ||
            (!isNullOrUndefined(closest(this.actionObj.target as Element, 'td')) && !(closest(this.actionObj.target as Element, 'td').classList.contains(cls.WORK_CELLS_CLASS)) &&
                !(closest(this.actionObj.target as Element, 'td').classList.contains(cls.ALLDAY_CELLS_CLASS)))) {
            return;
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.swapDragging(e);
        }
        const dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        const eventStart: Date = eventObj[this.parent.eventFields.startTime] as Date;
        const eventEnd: Date = eventObj[this.parent.eventFields.endTime] as Date;
        const eventDuration: number = util.getUniversalTime(eventEnd) - util.getUniversalTime(eventStart);
        let offsetTop: number = Math.floor(parseInt(this.actionObj.clone.style.top, 10) / this.actionObj.cellHeight)
            * this.actionObj.cellHeight;
        offsetTop = offsetTop < 0 ? 0 : offsetTop;
        if (this.scrollEdges.top || this.scrollEdges.bottom) {
            offsetTop = this.scrollEdges.top ? dragArea.scrollTop - this.heightUptoCursorPoint +
                this.actionObj.cellHeight + window.pageYOffset :
                (dragArea.scrollTop + dragArea.offsetHeight - this.actionObj.clone.offsetHeight + window.pageYOffset) +
                (this.actionObj.clone.offsetHeight - this.heightUptoCursorPoint);
            offsetTop = Math.round(offsetTop / this.actionObj.cellHeight) * this.actionObj.cellHeight;
            if (dragArea.scrollTop > 0 && offsetTop < dragArea.scrollHeight) {
                this.actionObj.clone.style.top = formatUnit(offsetTop);
            }
        }
        const rowIndex: number = (this.parent.activeViewOptions.timeScale.enable) ? (offsetTop / this.actionObj.cellHeight) : 0;
        const heightPerMinute: number = this.actionObj.cellHeight / this.actionObj.slotInterval;
        const diffInMinutes: number = parseInt(this.actionObj.clone.style.top, 10) - offsetTop;
        let tr: HTMLElement;
        if (this.isAllDayDrag) {
            tr = this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS) as HTMLElement;
        } else {
            const trCollections: HTMLTableRowElement[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
            tr = trCollections[parseInt(rowIndex.toString(), 10)] as HTMLElement;
        }
        let index: number;
        if (!isNullOrUndefined(closest(this.actionObj.target as Element, 'td')) && (closest(this.actionObj.target as Element, 'td').classList.contains(cls.WORK_CELLS_CLASS) ||
            closest(this.actionObj.target as Element, 'td').classList.contains(cls.ALLDAY_CELLS_CLASS))) {
            index = (closest((<HTMLTableCellElement>this.actionObj.target), 'td') as HTMLTableCellElement).cellIndex;
        }
        const colIndex: number = isNullOrUndefined(index) ? (<HTMLTableCellElement>closest(this.actionObj.clone, 'td')).cellIndex : index;
        this.actionObj.index = colIndex;
        if (isNullOrUndefined(tr)) {
            return;
        }
        const td: HTMLElement = tr.children[parseInt(colIndex.toString(), 10)] as HTMLElement;
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        let dragStart: Date; let dragEnd: Date;
        if (this.parent.activeViewOptions.timeScale.enable && !this.isAllDayDrag) {
            if (!this.enableCurrentViewDrag || this.multiData.length === 0) {
                this.appendCloneElement(this.getEventWrapper(colIndex));
            }
            dragStart = this.parent.getDateFromElement(td);
            dragStart.setMinutes(dragStart.getMinutes() + (diffInMinutes / heightPerMinute));
            dragEnd = new Date(dragStart.getTime());
            if (this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd.setMinutes(dragEnd.getMinutes() + this.actionObj.slotInterval);
            } else {
                dragEnd.setMilliseconds(eventDuration);
            }
        } else {
            dragStart = this.parent.getDateFromElement(td);
            dragStart.setDate(dragStart.getDate() - this.daysVariation);
            dragStart.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            dragEnd = new Date(dragStart.getTime());
            dragEnd.setMilliseconds(eventDuration);
            if (!this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) &&
                this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd = util.addDays(util.resetTime(dragEnd), 1);
            }
            const index: number = this.parent.activeViewOptions.group.byDate || (this.parent.virtualScrollModule &&
                !this.parent.activeViewOptions.timeScale.enable) ? colIndex : undefined;
            this.updateAllDayEvents(dragStart, dragEnd, index);
        }
        this.actionObj.start = new Date(+dragStart);
        this.actionObj.end = new Date(+dragEnd);
        const event: Record<string, any> = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
        const dynamicWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-dynamic-clone'));
        for (const wrapper of dynamicWrappers) {
            remove(wrapper);
        }
        if (this.multiData.length > 0) {
            if (this.isAllDayTarget && this.isAllDayDrag && !isNullOrUndefined(this.actionObj.isAllDay) && !this.actionObj.isAllDay) {
                const targetCellTime: number = parseInt((closest((<HTMLElement>this.actionObj.target), 'td')).getAttribute('data-date'), 10);
                this.multiData.forEach((data: Record<string, any>) => {
                    this.swagData.push(extend({}, data, null, true) as Record<string, any>);
                    if (data[this.parent.eventFields.isAllDay]) {
                        data[this.parent.eventFields.startTime] =
                            new Date((data[this.parent.eventFields.startTime] as Date).getTime() + (targetCellTime - this.startTime));
                        const startTime: Date = new Date(data[this.parent.eventFields.startTime] as Date);
                        const endTime: Date = new Date(startTime.setMinutes(startTime.getMinutes() + this.actionObj.slotInterval));
                        data[this.parent.eventFields.endTime] = endTime;
                        data[this.parent.eventFields.isAllDay] = false;
                    }
                });
                this.startTime = targetCellTime;
            }
            if (this.isAllDayTarget && this.isAllDayDrag &&
                !isNullOrUndefined(this.actionObj.isAllDay) && this.actionObj.isAllDay && this.swagData.length > 0) {
                this.multiData = this.swagData;
                this.swagData = [];
                const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
                this.startTime = (eventObj[this.parent.eventFields.startTime] as Date).getTime();
            }
            const startTimeDiff: number = (event[this.parent.eventFields.startTime] as Date).getTime() - this.startTime;
            if (this.enableCurrentViewDrag) {
                const renderDates: Date[] = this.getRenderedDates();
                for (let i: number = 0; i < this.multiData.length; i++) {
                    const eventObj: Record<string, any> =
                        extend({}, this.multiData[parseInt(i.toString(), 10)], null, true) as Record<string, any>;
                    const startTime: Date = new Date(eventObj[this.parent.eventFields.startTime].getTime() + startTimeDiff);
                    const dayIndex: number = this.parent.getIndexOfDate(renderDates, util.resetTime(startTime));
                    if (dayIndex < 0) {
                        this.isPreventMultiDrag = true;
                        break;
                    }
                    this.isPreventMultiDrag = false;
                }
            }
            if (!this.isPreventMultiDrag) {
                for (let index: number = 0; index < this.multiData.length; index++) {
                    this.updatedData[parseInt(index.toString(), 10)] =
                        this.updateMultipleData(this.multiData[parseInt(index.toString(), 10)], startTimeDiff);
                    const dayIndex: number = this.getDayIndex(this.updatedData[parseInt(index.toString(), 10)]);
                    if (dayIndex >= 0) {
                        const isAllDay: boolean =
                            this.updatedData[parseInt(index.toString(), 10)][this.parent.eventFields.isAllDay] as boolean;
                        const wrapper: HTMLElement = this.getEventWrapper(dayIndex, isAllDay);
                        this.appendCloneElement(wrapper, this.actionObj.cloneElement[parseInt(index.toString(), 10)]);
                        this.updateEventHeight(this.updatedData[parseInt(index.toString(), 10)], index, dayIndex);
                    } else {
                        if (!isNullOrUndefined(this.actionObj.cloneElement[parseInt(index.toString(), 10)].parentNode)) {
                            remove(this.actionObj.cloneElement[parseInt(index.toString(), 10)]);
                        }
                    }
                }
            }
        } else {
            this.updateEventHeight(event);
        }
        this.updateTimePosition(this.actionObj.start, this.updatedData);
    }

    private splitEvent(event: Record<string, any>): Record<string, any>[] {
        const eventFields: EventFieldsMapping = this.parent.eventFields;
        const eventData: Record<string, any>[] = [];
        const startTime: Date = event[eventFields.startTime] as Date;
        const endTime: Date = event[eventFields.endTime] as Date;
        if (util.resetTime(new Date(startTime.getTime())) < util.resetTime(new Date(endTime.getTime()))) {
            let startReferenceDate: Date = util.resetTime(new Date(startTime.getTime()));
            let endReferenceDate: Date = new Date(startReferenceDate.getTime());
            for (let i: number = 0; startReferenceDate < new Date(endTime.getTime()); i++) {
                endReferenceDate = new Date(endReferenceDate.setDate(startReferenceDate.getDate() + 1));
                const eventObj: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
                eventObj[eventFields.startTime] = new Date(startReferenceDate);
                eventObj[eventFields.endTime] = new Date(endReferenceDate);
                startReferenceDate = new Date(startReferenceDate.setDate(startReferenceDate.getDate() + 1));
                eventData.push(eventObj);
            }
            const index: number = eventData.length - 1;
            eventData[0][eventFields.startTime] = startTime;
            eventData[parseInt(index.toString(), 10)][eventFields.endTime] = endTime;
        } else {
            eventData.push(event);
        }
        return eventData;
    }

    private updateMultipleData(data: Record<string, any>, timeDifference: number): Record<string, any> {
        const eventObj: Record<string, any> = extend({}, data, null, true) as Record<string, any>;
        if (!isNullOrUndefined(this.actionObj.isAllDay) && this.parent.activeViewOptions.timeScale.enable &&
            ((this.isAllDayTarget && eventObj[this.parent.eventFields.isAllDay]) ||
                (!this.isAllDayTarget && !eventObj[this.parent.eventFields.isAllDay]))) {
            eventObj[this.parent.eventFields.isAllDay] = this.actionObj.isAllDay;
        }
        const endTimeDiff: number = (eventObj[this.parent.eventFields.endTime] as Date).getTime() -
            (eventObj[this.parent.eventFields.startTime] as Date).getTime();
        if (eventObj[this.parent.eventFields.isAllDay]) {
            const differInDays: number = Math.ceil(timeDifference / (1000 * 3600 * 24));
            const day: number = Math.ceil(endTimeDiff / (1000 * 3600 * 24));
            const startTime: Date = new Date(eventObj[this.parent.eventFields.startTime] as Date);
            eventObj[this.parent.eventFields.startTime] = util.resetTime(new Date(startTime.setDate(startTime.getDate() + differInDays)));
            eventObj[this.parent.eventFields.endTime] = util.addDays(eventObj[this.parent.eventFields.startTime] as Date, day);
        } else {
            eventObj[this.parent.eventFields.startTime] =
                new Date((eventObj[this.parent.eventFields.startTime] as Date).getTime() + timeDifference);
            eventObj[this.parent.eventFields.endTime] =
                new Date((eventObj[this.parent.eventFields.startTime] as Date).getTime() + endTimeDiff);
        }
        return eventObj;
    }

    private getDayIndex(event: Record<string, any>): number {
        const eventObj: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
        const startDate: Date = util.resetTime(eventObj[this.parent.eventFields.startTime] as Date);
        if (this.parent.activeViewOptions.timeScale.enable && !eventObj[this.parent.eventFields.isAllDay]) {
            const startHour: Date = this.parent.activeView.getStartHour();
            startDate.setMilliseconds(startHour.getTime() - util.resetTime(startHour).getTime());
        }
        const startTime: number = startDate.getTime();
        let query: string = '';
        let wrapper: string = cls.DAY_WRAPPER_CLASS;
        if (this.parent.activeViewOptions.timeScale.enable && (eventObj[this.parent.eventFields.isAllDay])) {
            wrapper = cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS;
        } else {
            wrapper = cls.WORK_CELLS_CLASS;
        }
        query = '.' + wrapper + '[data-date="' + startTime + '"]';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            query = query + '[data-group-index="' + this.actionObj.groupIndex + '"]';
        }
        this.targetTd = this.parent.element.querySelector(query) as HTMLElement;
        if (isNullOrUndefined(this.targetTd)) {
            return -1;
        }
        return (this.targetTd as HTMLTableCellElement).cellIndex;
    }

    private updateEventHeight(event: Record<string, any>, index?: number, colIndex?: number): void {
        this.verticalEvent.initializeValues();
        let datesCount: number = this.verticalEvent.getStartCount();
        if (!this.parent.uiStateValues.isGroupAdaptive) {
            for (let i: number = 0; i < this.actionObj.groupIndex; i++) {
                if (this.verticalEvent.dateRender[parseInt(i.toString(), 10)]) {
                    datesCount = datesCount + this.verticalEvent.dateRender[parseInt(i.toString(), 10)].length;
                }
            }
        }
        const indexGroup: number = this.parent.uiStateValues.isGroupAdaptive ? datesCount : this.actionObj.groupIndex;
        const target: boolean = (this.parent.activeViewOptions.group.byDate &&
            !isNullOrUndefined(this.parent.getDateFromElement(this.actionObj.target as HTMLElement))) ? true : false;
        if (target || !this.parent.activeViewOptions.group.byDate) {
            let dynamicIndex: number = -1;
            let dayIndex: number = !this.parent.activeViewOptions.group.byDate ?
                isNullOrUndefined(index) ? this.actionObj.index - datesCount : colIndex - datesCount
                : this.parent.getIndexOfDate(this.verticalEvent.dateRender[parseInt(indexGroup.toString(), 10)], util.resetTime(
                    // eslint-disable-next-line max-len
                    this.parent.getDateFromElement(isNullOrUndefined(index) ? this.actionObj.target as HTMLElement : this.targetTd as HTMLElement)));
            const splitEvents: Record<string, any>[] = this.splitEvent(event);
            const events: Record<string, any>[] = this.parent.eventBase.isAllDayAppointment(event) || splitEvents.length > 2 ||
                this.parent.eventSettings.spannedEventPlacement !== 'TimeSlot' ? [event] : splitEvents;
            for (let i: number = 0; i < events.length; i++) {
                if (i > 0) {
                    let filterQuery: string =
                        `.e-day-wrapper[data-date="${(<Date>util.resetTime(events[parseInt(i.toString(), 10)][this.parent.eventFields.startTime])).getTime()}"]`;
                    if (this.parent.activeViewOptions.group.resources.length > 0) {
                        filterQuery = filterQuery.concat('[data-group-index = "' + this.actionObj.groupIndex + '"]');
                    }
                    const appWrap: HTMLTableCellElement = this.parent.element.querySelector(filterQuery) as HTMLTableCellElement;
                    if (appWrap) {
                        dayIndex = dayIndex + 1;
                        dynamicIndex = appWrap.cellIndex;
                    } else {
                        dayIndex = -1;
                    }
                }
                if (dayIndex >= 0) {
                    const record: Record<string, any> =
                        this.verticalEvent.isSpannedEvent(events[parseInt(i.toString(), 10)], dayIndex, indexGroup);
                    const eStart: Date = record[this.verticalEvent.fields.startTime] as Date;
                    const eEnd: Date = record[this.verticalEvent.fields.endTime] as Date;
                    let appHeight: number = this.parent.activeViewOptions.timeScale.enable ? this.verticalEvent.getHeight(eStart, eEnd) :
                        this.actionObj.element.offsetHeight;
                    let topValue: number = this.parent.activeViewOptions.timeScale.enable ?
                        this.verticalEvent.getTopValue(eStart) : this.actionObj.element.offsetTop;
                    if (isNullOrUndefined(index)) {
                        if (i === 0) {
                            if (this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                                topValue = (<HTMLElement>this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS)).offsetTop;
                                appHeight = this.getAllDayEventHeight();
                            }
                            this.actionObj.clone.style.top = formatUnit(topValue);
                            this.actionObj.clone.style.height = formatUnit(appHeight);
                        } else {
                            this.renderSpannedEvents(record, dynamicIndex, topValue, appHeight);
                        }
                    } else {
                        let appWidth: number = this.actionObj.cellWidth;
                        if (event[this.parent.eventFields.isAllDay] && this.parent.activeViewOptions.timeScale.enable) {
                            const timeDiff: number = (event[this.parent.eventFields.endTime] as Date).getTime() -
                                (event[this.parent.eventFields.startTime] as Date).getTime();
                            const allDayDifference: number = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            if (allDayDifference >= 0) {
                                appWidth = (allDayDifference * this.actionObj.cellWidth);
                            }
                        }
                        if (this.actionObj.cloneElement[parseInt(index.toString(), 10)]) {
                            if (i === 0) {
                                this.actionObj.cloneElement[parseInt(index.toString(), 10)].style.top = formatUnit(topValue);
                                this.actionObj.cloneElement[parseInt(index.toString(), 10)].style.height = formatUnit(appHeight);
                                this.actionObj.cloneElement[parseInt(index.toString(), 10)].style.width = formatUnit(appWidth);
                                this.actionObj.cloneElement[parseInt(index.toString(), 10)].style.left = formatUnit(0);
                            } else {
                                this.renderSpannedEvents(record, dynamicIndex, topValue, appHeight);
                            }
                        }
                    }
                }
            }
        }
    }

    private renderSpannedEvents(record: Record<string, any>, index: number, top: number, height: number): void {
        const startTime: number = (record[this.parent.eventFields.startTime] as Date).getTime();
        const endTime: number = (record[this.parent.eventFields.endTime] as Date).getTime();
        if (startTime !== endTime) {
            const appointmentElement: HTMLElement = this.verticalEvent.
                createAppointmentElement(record, false, record.isSpanned as Record<string, any>, this.actionObj.groupIndex);
            addClass([appointmentElement], [cls.CLONE_ELEMENT_CLASS, 'e-dynamic-clone']);
            setStyleAttribute(appointmentElement, {
                'width': '100%',
                'height': height + 'px',
                'top': top + 'px',
                'border': '0px'
            });
            const appointmentWrap: HTMLElement[] =
                [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_WRAPPER_CLASS));
            appointmentWrap[parseInt(index.toString(), 10)].appendChild(appointmentElement);
        }
    }

    private getRenderedDates(): Date[] {
        let renderDates: Date[] = this.parent.activeView.renderDates;
        this.parent.eventBase.slots.push(...this.parent.activeView.renderDates.map((date: Date) => +date));
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.eventBase.slots = [];
            const resources: TdData[] = this.parent.resourceBase.lastResourceLevel.
                filter((res: TdData) => res.groupIndex === this.actionObj.groupIndex);
            renderDates = resources[0].renderDates;
            this.parent.eventBase.slots.push(...renderDates.map((date: Date) => +date));
        }
        return renderDates;
    }

    private updateAllDayEvents(startDate: Date, endDate: Date, colIndex: number): void {
        this.parent.eventBase.slots = [];
        const event: Record<string, any> = this.getUpdatedEvent(startDate, endDate, this.actionObj.event);
        const renderDates: Date[] = this.getRenderedDates();
        const events: Record<string, any>[] = this.parent.eventBase.splitEvent(event, renderDates);
        let query: string = `.e-all-day-cells[data-date="${(<Date>events[0][this.parent.eventFields.startTime]).getTime()}"]`;
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            query = query.concat('[data-group-index = "' + this.actionObj.groupIndex + '"]');
        }
        const cell: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(query));
        if (cell.length > 0 || !isNullOrUndefined(colIndex)) {
            const cellIndex: number = !isNullOrUndefined(colIndex) ? colIndex : (cell[0] as HTMLTableCellElement).cellIndex;
            this.appendCloneElement(this.getEventWrapper(cellIndex));
            // eslint-disable-next-line max-len
            this.actionObj.clone.style.width = formatUnit(((<Record<string, any>>events[0].data).count as number) * this.actionObj.cellWidth);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private swapDragging(e: MouseEvent & TouchEvent): void {
        if (this.isPreventMultiDrag) {
            return;
        }
        const colIndex: number = !isNullOrUndefined(closest((<HTMLTableCellElement>this.actionObj.target), 'td')) && (closest((<HTMLTableCellElement>this.actionObj.target), 'td') as HTMLTableCellElement).cellIndex;
        if (closest(this.actionObj.target as Element, '.' + cls.DATE_HEADER_WRAP_CLASS) &&
            !closest(this.actionObj.clone, '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS)) {
            addClass([this.actionObj.clone], cls.ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = true;
            const eventHeight: number = this.getAllDayEventHeight();
            const allDayElement: HTMLElement[] =
                [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS + ':first-child'));
            if (allDayElement[0].offsetHeight < eventHeight) {
                for (const element of allDayElement) {
                    element.style.height = ((eventHeight + 2) / 12) + 'em';
                }
            }
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(this.actionObj.cellWidth),
                height: formatUnit(eventHeight),
                top: formatUnit((<HTMLElement>this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS)).offsetTop)
            });
        }
        if (closest(this.actionObj.target as Element, '.' + cls.WORK_CELLS_CLASS) &&
            !closest(this.actionObj.clone, '.' + cls.DAY_WRAPPER_CLASS)) {
            removeClass([this.actionObj.clone], cls.ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = false;
            // eslint-disable-next-line max-len
            const height: number = (this.actionObj.element.offsetHeight === 0) ? this.actionObj.height : this.actionObj.element.offsetHeight;
            setStyleAttribute(this.actionObj.clone, {
                left: formatUnit(0),
                height: formatUnit(height),
                width: formatUnit(this.actionObj.cellWidth)
            });
        }
    }

    private calculateVerticalDate(e: MouseEvent & TouchEvent): void {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest((<HTMLTableCellElement>e.target), 'tr'))) ||
            (e.target && (<HTMLTableCellElement>e.target).tagName === 'DIV')) {
            return;
        }
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        if (isNullOrUndefined(this.parent.eventDragArea)) {
            this.removeCloneElement();
        }
        const eventDuration: number = util.getUniversalTime(<Date>eventObj[this.parent.eventFields.endTime]) -
            util.getUniversalTime(<Date>eventObj[this.parent.eventFields.startTime]);
        let td: HTMLTableCellElement = closest((<HTMLTableCellElement>this.actionObj.target), 'td') as HTMLTableCellElement;
        if (!isNullOrUndefined(td)) {
            const tr: HTMLTableRowElement = td.parentElement as HTMLTableRowElement;
            this.actionObj.index = (tr.rowIndex * tr.children.length) + td.cellIndex;
            const workCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            td = <HTMLTableCellElement>workCells[this.actionObj.index];
            const currentDate: Date = this.parent.getDateFromElement(td);
            if (!isNullOrUndefined(currentDate)) {
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
                }
                const timeString: Date = new Date(currentDate.setDate(currentDate.getDate() - this.daysVariation));
                const dragStart: Date = new Date(timeString.getTime());
                const startTimeDiff: number = util.getUniversalTime(<Date>eventObj[this.parent.eventFields.startTime]) -
                    util.getUniversalTime(util.resetTime(new Date(+eventObj[this.parent.eventFields.startTime])));
                dragStart.setMilliseconds(startTimeDiff);
                const dragEnd: Date = new Date(dragStart.getTime());
                dragEnd.setMilliseconds(eventDuration);
                this.actionObj.start = new Date(dragStart.getTime());
                this.actionObj.end = new Date(dragEnd.getTime());
            }
        }
        const event: Record<string, any> = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
        if (isNullOrUndefined(this.parent.eventDragArea)) {
            const eventWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CLONE_ELEMENT_CLASS));
            for (const wrapper of eventWrappers) {
                remove(wrapper);
            }
        }
        if (this.multiData && this.multiData.length > 0) {
            const startTime: Date = util.resetTime(new Date(event[this.parent.eventFields.startTime] as Date));
            let startTimeDiff: number = startTime.getTime() - this.startTime;
            if (this.parent.currentView === 'TimelineYear' && this.parent.group.resources.length > 0) {
                startTimeDiff = (startTime.getFullYear() - new Date(this.startTime).getFullYear()) * 12;
                startTimeDiff -= new Date(this.startTime).getMonth();
                startTimeDiff += startTime.getMonth();
            }
            for (let index: number = 0; index < this.multiData.length; index++) {
                this.updatedData[parseInt(index.toString(), 10)] =
                    this.updateMultipleVerticalDate(this.multiData[parseInt(index.toString(), 10)], startTimeDiff);
                if (this.parent.currentView === 'TimelineYear') {
                    this.dynamicYearlyEventsRendering(this.updatedData[parseInt(index.toString(), 10)]);
                } else {
                    this.dynamicEventsRendering(this.updatedData[parseInt(index.toString(), 10)]);
                }
            }
        } else {
            if (this.parent.currentView === 'TimelineYear') {
                this.dynamicYearlyEventsRendering(event);
            } else {
                this.dynamicEventsRendering(event);
            }
        }
    }

    private updateMultipleVerticalDate(data: Record<string, any>, timeDifference: number): Record<string, any> {
        const eventObj: Record<string, any> = extend({}, data, null, true) as Record<string, any>;
        const eventDuration: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime();
        const startDate: Date = new Date(eventObj[this.parent.eventFields.startTime] as Date);
        if (this.parent.currentView === 'TimelineYear' && this.parent.group.resources.length > 0) {
            eventObj[this.parent.eventFields.startTime] = new Date(startDate.setMonth(startDate.getMonth() + timeDifference));
        }
        else {
            const differInDays: number = Math.ceil(timeDifference / util.MS_PER_DAY);
            eventObj[this.parent.eventFields.startTime] = new Date(startDate.setDate(startDate.getDate() + differInDays));
        }
        eventObj[this.parent.eventFields.endTime] =
            new Date((eventObj[this.parent.eventFields.startTime] as Date).getTime() + eventDuration);
        return eventObj;
    }

    private calculateTimelineTime(e: MouseEvent & TouchEvent): void {
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        const eventDuration: number = util.getUniversalTime(<Date>eventObj[this.parent.eventFields.endTime]) -
            util.getUniversalTime(<Date>eventObj[this.parent.eventFields.startTime]);
        let offsetLeft: number = this.parent.enableRtl ? Math.abs(this.actionObj.clone.offsetLeft) - this.actionObj.clone.offsetWidth :
            parseInt(this.actionObj.clone.style.left, 10);
        offsetLeft = Math.round(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        let rightOffset: number;
        if (this.parent.enableRtl) {
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.right, 10));
            this.actionObj.clone.style.right = formatUnit(rightOffset);
        }
        offsetLeft = this.getOffsetValue(offsetLeft, rightOffset);
        const colIndex: number = this.getColumnIndex(offsetLeft);
        const dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        const contentWrapRight: number = dragArea.getBoundingClientRect().right;
        const cursorDrag: boolean = this.parent.activeView.isTimelineView() && !this.parent.enableRtl &&
            this.actionObj.pageX > this.actionObj.clone.getBoundingClientRect().right &&
            !this.isMorePopupOpened && !(this.actionObj.pageX > contentWrapRight);
        const leftVal: number = (this.parent.eventDragArea) ? dragArea.scrollLeft - dragArea.offsetLeft : 0;
        if ((this.isCursorAhead || cursorDrag) && !this.isStepDragging) {
            this.isCursorAhead = true;
        }
        let cloneIndex: number =
            Math.floor((this.actionObj.pageX - this.actionObj.clone.getBoundingClientRect().left + leftVal) / this.actionObj.cellWidth);
        if (this.parent.enableRtl) {
            cloneIndex = Math.abs(Math.floor((this.actionObj.pageX - this.actionObj.clone.getBoundingClientRect().right) /
                this.actionObj.cellWidth)) - 1;
        }
        if (this.cursorPointIndex < 0) {
            this.cursorIndex(e, eventObj, offsetLeft, cloneIndex);
        }
        const tr: HTMLTableRowElement = this.parent.getContentTable().querySelector('tr') as HTMLTableRowElement;
        let index: number = this.getCursorCurrentIndex(colIndex, cloneIndex, tr);
        index = index < 0 ? 0 : index;
        let eventStart: Date = this.isHeaderRows ? new Date(this.timelineEventModule.dateRender[parseInt(index.toString(), 10)].getTime()) :
            this.parent.getDateFromElement(<HTMLElement>tr.children[parseInt(index.toString(), 10)]);
        eventStart = this.isAllDayDrag ? util.resetTime(eventStart) : eventStart;
        if (this.isStepDragging) {
            const widthDiff: number = this.getWidthDiff(tr, index);
            if (widthDiff !== 0) {
                let timeDiff: number = Math.ceil(widthDiff / this.widthPerMinute);
                eventStart.setMinutes(eventStart.getMinutes() + (timeDiff * this.actionObj.interval));
                if (this.isCursorAhead || cursorDrag) {
                    eventStart.setMilliseconds(-(eventDuration));
                } else {
                    eventStart.setMinutes(eventStart.getMinutes() - this.minDiff);
                    const intervalInMS: number = this.actionObj.interval * util.MS_PER_MINUTE;
                    timeDiff = Math.abs(eventStart.getTime() - this.actionObj.start.getTime()) / intervalInMS;
                    const roundTimeDiff: number = Math.trunc(timeDiff);
                    if (roundTimeDiff !== timeDiff) {
                        timeDiff = (roundTimeDiff * intervalInMS) * (eventStart > this.actionObj.start ? 1 : -1);
                        eventStart = new Date(this.actionObj.start.getTime() + timeDiff);
                    }
                }
            } else {
                eventStart = this.actionObj.start;
            }
        } else {
            if ((this.isCursorAhead || cursorDrag) && !this.isAllDayDrag) {
                const minutes: number = this.isTimelineDayProcess || this.isAllDayDrag ? MINUTES_PER_DAY : this.actionObj.slotInterval;
                eventStart.setMinutes(eventStart.getMinutes() + minutes);
                eventStart.setMilliseconds(-(eventDuration));
                if (eventStart.getTime() === util.resetTime(eventStart).getTime() && eventStart.getMinutes() === 0 && eventDuration === 0) {
                    eventStart.setMinutes(-minutes);
                }
            } else {
                eventStart.setMinutes(eventStart.getMinutes() - (this.cursorPointIndex *
                    (this.isTimelineDayProcess || this.isAllDayDrag ? MINUTES_PER_DAY : this.actionObj.slotInterval)));
            }
        }
        if (!this.isStepDragging) {
            eventStart = this.calculateIntervalTime(eventStart);
        }
        if (this.isTimelineDayProcess || this.isAllDayDrag) {
            const eventSrt: Date = eventObj[this.parent.eventFields.startTime] as Date;
            eventStart.setHours(eventSrt.getHours(), eventSrt.getMinutes(), eventSrt.getSeconds());
        }
        if (this.parent.eventDragArea) {
            const targetDate: Date = this.parent.getDateFromElement(e.target as HTMLElement);
            if (!isNullOrUndefined(targetDate)) {
                if (!this.parent.activeViewOptions.timeScale.enable || (this.parent.currentView === 'TimelineMonth')) {
                    const eventSrt: Date = eventObj[this.parent.eventFields.startTime];
                    eventStart = new Date(targetDate.setHours(eventSrt.getHours(), eventSrt.getMinutes(), eventSrt.getSeconds()));
                } else {
                    eventStart = targetDate;
                }
            }
        }
        const eventEnd: Date = new Date(eventStart.getTime());
        eventEnd.setMilliseconds(eventDuration);
        let eventsData: Record<string, any>[] = [this.getUpdatedEvent(eventStart, eventEnd, this.actionObj.event)];
        if (this.multiData.length > 0) {
            const startTimeDiff: number = (eventsData[0][this.parent.eventFields.startTime] as Date).getTime() - this.startTime;
            for (let i: number = 0; i < this.multiData.length; i++) {
                this.updatedData[parseInt(i.toString(), 10)] =
                    this.updateMultipleData(this.multiData[parseInt(i.toString(), 10)], startTimeDiff);
            }
            eventsData = this.updatedData;
        }
        for (let dataIndex: number = 0; dataIndex < eventsData.length; dataIndex++) {
            const cloneElement: HTMLElement =
                this.multiData.length > 0 ? this.actionObj.cloneElement[parseInt(dataIndex.toString(), 10)] : this.actionObj.clone;
            if (isNullOrUndefined(this.parent.eventDragArea))
            {
                const events: Record<string, any>[] =
                this.timelineEventModule.splitEvent(eventsData[parseInt(dataIndex.toString(), 10)], this.timelineEventModule.dateRender);
                const eventData: Record<string, any> = events[0].data as Record<string, any>;
                const startTime: Date = this.timelineEventModule.getStartTime(events[0], eventData);
                const endTime: Date = this.timelineEventModule.getEndTime(events[0], eventData);
                // eslint-disable-next-line max-len
                const width: number = this.timelineEventModule.getEventWidth(startTime, endTime, eventObj[this.parent.eventFields.isAllDay] as boolean, eventData.count as number);
                // eslint-disable-next-line max-len
                let day: number = this.parent.getIndexOfDate(this.timelineEventModule.dateRender, util.resetTime(new Date(startTime.getTime())));
                day = day < 0 ? 0 : day;
                const left: number =
                    this.timelineEventModule.getPosition(startTime, endTime, eventObj[this.parent.eventFields.isAllDay] as boolean, day);
                if (this.parent.enableRtl) {
                    cloneElement.style.right = formatUnit(left);
                } else {
                    cloneElement.style.left = formatUnit(left);
                }
                if (!this.isMorePopupOpened) {
                    cloneElement.style.width = formatUnit(width);
                }
            }
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                this.calculateResourceGroupingPosition(e, cloneElement);
            }
            this.actionObj.start = new Date(eventStart.getTime());
            this.actionObj.end = new Date(eventEnd.getTime());
            this.updateTimePosition(this.actionObj.start, this.updatedData);
        }
    }

    private getOffsetValue(offsetLeft: number, rightOffset: number): number {
        if (this.scrollEdges.left || this.scrollEdges.right) {
            const viewEle: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
            if (this.parent.enableRtl) {
                rightOffset = viewEle.offsetWidth - viewEle.scrollLeft;
                if (this.scrollEdges.right) {
                    rightOffset = (rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth) -
                        (this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint);
                } else {
                    rightOffset = rightOffset + this.widthUptoCursorPoint;
                    if (rightOffset - this.widthUptoCursorPoint >= viewEle.scrollWidth) {
                        this.actionObj.clone.style.width =
                            formatUnit(this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint + this.actionObj.cellWidth);
                        rightOffset = (viewEle.scrollLeft - viewEle.scrollWidth);
                    }
                }
                if (isNullOrUndefined(this.parent.eventDragArea)) {
                    this.actionObj.clone.style.left = formatUnit(rightOffset);
                }
            } else {
                if (this.scrollEdges.left) {
                    offsetLeft = viewEle.scrollLeft - this.widthUptoCursorPoint + this.actionObj.cellWidth;
                    if (viewEle.scrollLeft + viewEle.offsetWidth >= viewEle.offsetWidth) {
                        viewEle.scrollLeft = viewEle.scrollLeft - 1;
                    } else if (this.actionObj.clone.offsetLeft === 0) {
                        offsetLeft = viewEle.scrollLeft;
                    }
                } else {
                    offsetLeft = (viewEle.scrollLeft + viewEle.offsetWidth -
                        this.actionObj.clone.offsetWidth) + (this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint);
                }
                offsetLeft = offsetLeft < 0 ? 0 : offsetLeft;
                if (isNullOrUndefined(this.parent.eventDragArea)) {
                    this.actionObj.clone.style.left = formatUnit(offsetLeft);
                }
            }
        }
        return offsetLeft;
    }

    private getWidthDiff(tr: HTMLTableRowElement, index: number): number {
        const pages: ClientRect | DOMRect = this.scrollArgs.element.getBoundingClientRect();
        if (pages.left <= this.actionObj.pageX && pages.right >= this.actionObj.pageX) {
            const targetLeft: number = (<HTMLElement>tr.children[parseInt(index.toString(), 10)]).offsetLeft;
            const pageX: number = this.actionObj.pageX - pages.left;
            if (this.parent.enableRtl) {
                return (targetLeft + this.actionObj.cellWidth) - (this.scrollArgs.element.scrollLeft + pageX);
            } else {
                return (this.scrollArgs.element.scrollLeft + pageX) - targetLeft;
            }
        }
        return 0;
    }

    private getColumnIndex(offsetLeft: number): number {
        const index: number = Math.round(offsetLeft / this.actionObj.cellWidth);
        if (this.isHeaderRows) {
            return index;
        }
        return this.getIndex(index);
    }

    private getCursorCurrentIndex(colIndex: number, cloneIndex: number, tr: HTMLTableRowElement): number {
        const index: number = colIndex + cloneIndex;
        if (this.isHeaderRows) {
            const dateLength: number = Math.floor(tr.offsetWidth / this.actionObj.cellWidth);
            return (index > dateLength - 1) ? dateLength - 1 : index;
        }
        return (index > tr.children.length - 1) ? tr.children.length - 1 : index;
    }

    private cursorIndex(e: MouseEvent & TouchEvent, event: Record<string, any>, left: number, index: number): void {
        const td: HTMLElement = (<HTMLElement>closest(e.target as Element, '.e-work-cells'));
        if (!isNullOrUndefined(td) && !this.isMorePopupOpened) {
            let targetDate: Date = this.parent.getDateFromElement(td);
            targetDate = this.isAllDayDrag ? util.resetTime(targetDate) : targetDate;
            if (this.isHeaderRows) {
                const currentIndex: number = Math.floor(left / this.actionObj.cellWidth);
                targetDate = new Date(this.timelineEventModule.dateRender[currentIndex + index].getTime());
            }
            const timeDiff: number = targetDate.getTime() - (event[this.parent.eventFields.startTime] as Date).getTime();
            if (this.isTimelineDayProcess || this.isAllDayDrag) {
                this.cursorPointIndex = Math.abs(Math.ceil(timeDiff / (util.MS_PER_DAY)));
            } else {
                const widthDiff: number =
                    Math.floor((timeDiff / util.MS_PER_MINUTE) / (this.actionObj.slotInterval / this.actionObj.cellWidth));
                this.cursorPointIndex = Math.floor(widthDiff / this.actionObj.cellWidth);
                this.cursorPointIndex = this.cursorPointIndex < 0 ? 0 : this.cursorPointIndex;
            }
        } else {
            this.cursorPointIndex = 0;
        }
    }

    private calculateResourceGroupingPosition(e: MouseEvent & TouchEvent, cloneElement: HTMLElement): void {
        const dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        const trCollection: HTMLElement[] =
            [].slice.call(this.parent.element.querySelectorAll('.e-content-wrap .e-content-table tr:not(.e-hidden)'));
        let translateY: number = util.getTranslateY(dragArea.querySelector('table'));
        translateY = (isNullOrUndefined(translateY)) ? 0 : translateY;
        const rowHeight: number = (this.parent.rowAutoHeight) ?
            ~~(dragArea.querySelector('table').offsetHeight / trCollection.length) : this.actionObj.cellHeight;
        let rowIndex: number = Math.floor(Math.floor((this.actionObj.Y +
            (dragArea.scrollTop - translateY - (window.scrollY || window.pageYOffset))) -
            util.getElementTop(dragArea, this.parent.uiStateValues.isTransformed)) / rowHeight);
        rowIndex = (rowIndex < 0) ? 0 : (rowIndex > trCollection.length - 1) ? trCollection.length - 1 : rowIndex;
        this.actionObj.index = rowIndex;
        const eventContainer: Element = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(rowIndex);
        let eventWrapper: HTMLElement = eventContainer.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS) as HTMLElement;
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper, cloneElement);
        const td: HTMLTableCellElement = closest((<HTMLTableCellElement>this.actionObj.target), 'td') as HTMLTableCellElement;
        this.actionObj.groupIndex = (td && !isNaN(parseInt(td.getAttribute('data-group-index'), 10)))
            ? parseInt(td.getAttribute('data-group-index'), 10) : this.actionObj.groupIndex;
        if (!isNullOrUndefined(this.parent.eventDragArea)) {
            return;
        }
        let top: number = this.parent.getElementHeight((<HTMLElement>trCollection[parseInt(rowIndex.toString(), 10)])) * rowIndex;
        if (this.parent.rowAutoHeight) {
            const cursorElement: HTMLElement = this.getCursorElement(e);
            if (cursorElement) {
                top = cursorElement.classList.contains(cls.WORK_CELLS_CLASS) ? cursorElement.offsetTop :
                    (cursorElement.offsetParent && cursorElement.offsetParent.classList.contains(cls.APPOINTMENT_CLASS)) ?
                        (cursorElement.offsetParent as HTMLElement).offsetTop : top;
            }
        }
        cloneElement.style.top = formatUnit(top);
    }

    private appendCloneElement(element: HTMLElement, cloneElement: HTMLElement = null): void {
        cloneElement = isNullOrUndefined(cloneElement) ? this.actionObj.clone : cloneElement;
        const dragElement: HTMLElement = document.querySelector(this.parent.eventDragArea);
        if (this.parent.eventDragArea && dragElement) {
            dragElement.appendChild(cloneElement);
        } else {
            element.appendChild(cloneElement);
        }
    }

    private getEventWrapper(index: number, isAllDayDrag?: boolean): HTMLElement {
        let eventWrapper: HTMLElement;
        if (isNullOrUndefined(isAllDayDrag)) {
            isAllDayDrag = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS);
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            const wrapperClass: string = isAllDayDrag ? '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + cls.APPOINTMENT_WRAPPER_CLASS;
            eventWrapper = this.parent.element.querySelectorAll(wrapperClass).item(index) as HTMLElement;
        } else {
            const targetWrapper: HTMLElement = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS).item(index) as HTMLElement;
            eventWrapper = targetWrapper.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS) as HTMLElement;
            if (!eventWrapper) {
                eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                targetWrapper.appendChild(eventWrapper);
            }
        }
        return eventWrapper;
    }

    private getAllDayEventHeight(): number {
        const eventWrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_CLASS });
        this.parent.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS).appendChild(eventWrapper);
        const eventHeight: number = eventWrapper.offsetHeight;
        remove(eventWrapper);
        return eventHeight;
    }

    private isAllowDrop(e: MouseEvent): boolean {
        if (!this.actionObj.excludeSelectors) {
            return false;
        }
        const dropSelectors: string[] = this.actionObj.excludeSelectors.split(',');
        let isAllowDrop: boolean = false;
        for (const selector of dropSelectors) {
            if ((<HTMLElement>e.target).classList.contains(selector)) {
                isAllowDrop = true;
                break;
            }
        }
        return isAllowDrop;
    }

    /**
     * Get module name.
     *
     * @returns {string} Returns the module name
     */
    protected getModuleName(): string {
        return 'dragAndDrop';
    }

}
