import { createElement, closest, Draggable, extend, formatUnit, isNullOrUndefined, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { addClass, remove, removeClass, setStyleAttribute, isBlazor, getElement, Browser, EventHandler } from '@syncfusion/ej2-base';
import { DragEventArgs, TdData, EJ2Instance } from '../base/interface';
import { ActionBase } from '../actions/action-base';
import { MonthEvent } from '../event-renderer/month';
import { TimelineEvent } from '../event-renderer/timeline-view';
import { HeaderRowsModel } from '../models/header-rows-model';
import { VerticalEvent } from '../event-renderer/vertical-view';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import * as util from '../base/util';

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
    public wireDragEvent(element: HTMLElement): void {
        let dragObj: Draggable = new Draggable(element, {
            abort: '.' + cls.EVENT_RESIZE_CLASS,
            clone: true,
            isDragScroll: true,
            enableTapHold: this.parent.isAdaptive as boolean,
            enableTailMode: (this.parent.eventDragArea) ? true : false,
            cursorAt: (this.parent.eventDragArea) ? { left: -20, top: -20 } : { left: 0, top: 0 },
            dragArea: (this.parent.eventDragArea) ?
                document.querySelector(this.parent.eventDragArea) as HTMLElement :
                this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement,
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
            queryPositionInfo: this.dragPosition.bind(this)
        });
        if (!(dragObj.enableTapHold && Browser.isDevice && Browser.isTouch)) {
            // tslint:disable-next-line:no-any
            EventHandler.remove(element, 'touchstart', (dragObj as any).initialize);
        }
    }

    private dragHelper(e: { [key: string]: Object }): HTMLElement {
        this.setDragActionDefaultValues();
        this.actionObj.element = e.element as HTMLElement;
        this.actionObj.action = 'drag';
        this.actionObj.clone = this.createCloneElement(this.actionObj.element);
        if (!this.parent.eventDragArea && this.parent.currentView !== 'Month' &&
            this.parent.timeScale.enable && !this.parent.activeView.isTimelineView() &&
            !this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
            setStyleAttribute(this.actionObj.clone, { cursor: 'move', left: '0%', right: '0%', width: '100%' });
        }
        this.actionObj.clone.style.top = formatUnit(this.actionObj.element.offsetTop);
        this.actionObj.cloneElement = [this.actionObj.clone];
        this.actionObj.originalElement = [this.actionObj.element];
        return this.actionObj.clone;
    }

    private dragPosition(e: { [key: string]: Object }): { [key: string]: Object } {
        if (this.parent.eventDragArea) {
            return { left: e.left, top: e.top };
        }
        let cellHeight: number = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
        let leftValue: string = formatUnit(0);
        if (this.parent.currentView === 'Month') {
            leftValue = e.left as string;
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
            topValue = formatUnit(Math.ceil(top / cellHeight) * cellHeight);
            let scrollHeight: number = this.parent.element.querySelector('.e-content-wrap').scrollHeight;
            let cloneBottom: number = parseInt(topValue, 10) + this.actionObj.clone.offsetHeight;
            if (cloneBottom > scrollHeight) {
                topValue = (parseInt(topValue, 10) - (cloneBottom - scrollHeight)) + 'px';
            }
        }
        return { left: leftValue, top: topValue };
    }

    private setDragActionDefaultValues(): void {
        this.actionObj.action = 'drag';
        this.actionObj.isAllDay = null;
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        let workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
        this.actionObj.cellWidth = workCell.offsetWidth;
        this.actionObj.cellHeight = workCell.offsetHeight;
    }

    private dragStart(e: MouseEvent & TouchEvent & BlazorDragEventArgs & DragEventArgs): void {
        let eventGuid: string = this.actionObj.element.getAttribute('data-guid');
        this.actionObj.event = this.parent.eventBase.getEventByGuid(eventGuid) as { [key: string]: Object };
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let dragArgs: DragEventArgs = {
            cancel: false,
            data: eventObj,
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
                let dragObj: Draggable = (this.actionObj.element as EJ2Instance).ej2_instances[0] as Draggable;
                if (!isNullOrUndefined(dragObj)) {
                    dragObj.intDestroy((e as DragEventArgs).event as MouseEvent & TouchEvent);
                }
                this.actionObj.action = '';
                this.removeCloneElementClasses();
                this.removeCloneElement();
                return;
            } else if (isBlazor()) {
                e.bindEvents(e.dragElement);
                if (dragEventArgs.element) {
                    dragEventArgs.element = getElement(dragEventArgs.element);
                }
                (dragEventArgs.data[this.parent.eventFields.startTime] as Date) = this.parent.getDateTime(
                    (dragEventArgs.data[this.parent.eventFields.startTime] as Date));
                (dragEventArgs.data[this.parent.eventFields.endTime] as Date) = this.parent.getDateTime(
                    (dragEventArgs.data[this.parent.eventFields.endTime] as Date));
            }
            this.actionClass('addClass');
            this.parent.uiStateValues.action = true;
            this.actionObj.start = eventObj[this.parent.eventFields.startTime] as Date;
            this.actionObj.end = eventObj[this.parent.eventFields.endTime] as Date;
            this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
            this.actionObj.interval = dragEventArgs.interval;
            this.actionObj.navigation = dragEventArgs.navigation;
            this.actionObj.scroll = dragEventArgs.scroll;
            this.actionObj.excludeSelectors = dragEventArgs.excludeSelectors;
            let viewElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
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
            if ((this.parent.activeView.isTimelineView() || !this.parent.timeScale.enable)) {
                if (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
                    this.actionObj.clone.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS)) {
                    this.isMorePopupOpened = true;
                }
                let rows: HeaderRowsModel[] = this.parent.activeViewOptions.headerRows;
                this.isHeaderRows = rows.length > 0 && rows[rows.length - 1].option !== 'Hour' &&
                    rows[rows.length - 1].option !== 'Date';
                this.isTimelineDayProcess = !this.parent.activeViewOptions.timeScale.enable || this.isHeaderRows ||
                    this.parent.currentView === 'TimelineMonth' || (rows.length > 0 && rows[rows.length - 1].option === 'Date');
                this.isStepDragging = !this.isTimelineDayProcess && (this.actionObj.slotInterval !== this.actionObj.interval);
                if (this.isTimelineDayProcess) {
                    this.timelineEventModule = new TimelineEvent(this.parent, 'day');
                } else {
                    this.timelineEventModule = new TimelineEvent(this.parent, 'hour');
                }
            }
            if (this.parent.currentView === 'Month') {
                this.updateOriginalElement(this.actionObj.clone);
                this.monthEvent = new MonthEvent(this.parent);
            }
            if (this.parent.currentView === 'Day' || this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek') {
                this.verticalEvent = new VerticalEvent(this.parent);
            }
        });
    }

    private drag(e: MouseEvent & TouchEvent): void {
        this.parent.quickPopup.quickPopupHide(true);
        if ((!isNullOrUndefined(e.target)) && (e.target as HTMLElement).classList.contains(cls.DISABLE_DATES)) {
            return;
        }
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventArgs: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
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
        this.isAllDayDrag = (this.parent.activeViewOptions.timeScale.enable) ?
            this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) :
            this.actionObj.event[this.parent.eventFields.isAllDay] as boolean;
        if (this.isStepDragging && this.minDiff === 0) {
            this.calculateMinutesDiff(eventObj);
        }
        if ((this.parent.currentView === 'Month' || this.isAllDayDrag) && this.daysVariation < 0) {
            let date: Date = this.parent.getDateFromElement(this.actionObj.target as HTMLElement);
            if (!isNullOrUndefined(date)) {
                let currentDate: Date = util.resetTime(date);
                let startDate: Date = util.resetTime(new Date((eventObj[this.parent.eventFields.startTime] as Date).getTime()));
                this.daysVariation = (currentDate.getTime() - startDate.getTime()) / util.MS_PER_DAY;
            } else {
                this.daysVariation = 0;
            }
        } else {
            this.daysVariation = 0;
        }
        if (this.parent.eventDragArea) {
            let targetElement: HTMLElement = eventArgs.target as HTMLElement;
            this.actionObj.clone.style.top = formatUnit(targetElement.offsetTop);
            this.actionObj.clone.style.left = formatUnit(targetElement.offsetLeft);
            let currentTarget: Element = <Element>closest(targetElement, '.' + cls.ROOT);
            if (!currentTarget) {
                this.actionObj.clone.style.height = '';
                this.actionObj.clone.style.width = '';
            } else {
                if (!(this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek'
                    || this.parent.currentView === 'Day')) {
                    this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
                }
            }
        }
        this.updateScrollPosition(e);
        this.updateNavigatingPosition(e);
        this.updateDraggingDateTime(e);
        let dragArgs: DragEventArgs = {
            data: eventObj, event: e, element: this.actionObj.element, startTime: this.actionObj.start,
            endTime: this.actionObj.end
        };
        if (this.parent.group.resources.length > 0) {
            dragArgs.groupIndex = this.actionObj.groupIndex;
        }
        this.parent.trigger(events.drag, dragArgs);
    }

    private calculateMinutesDiff(eventObj: { [key: string]: Object }): void {
        if (this.parent.enableRtl) {
            this.minDiff =
                ((this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint) / this.widthPerMinute) * this.actionObj.interval;
        } else {
            this.minDiff = (this.widthUptoCursorPoint / this.widthPerMinute) * this.actionObj.interval;
        }
        let startDate: Date = eventObj[this.parent.eventFields.startTime] as Date;
        let startTime: Date = this.parent.activeView.renderDates[0];
        let startEndHours: { [key: string]: Date } =
            util.getStartEndHours(startTime, this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        if (startEndHours.startHour.getTime() > startDate.getTime()) {
            this.minDiff = this.minDiff + ((startEndHours.startHour.getTime() - startDate.getTime()) / util.MS_PER_MINUTE);
        }
    }

    private dragStop(e: MouseEvent): void {
        this.removeCloneElementClasses();
        this.removeCloneElement();
        clearInterval(this.actionObj.navigationInterval);
        this.actionObj.navigationInterval = null;
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = false;
        this.actionObj.action = null;
        if (this.isAllowDrop(e)) {
            return;
        }
        let target: HTMLElement = ((!(e.target as Element).classList.contains('e-work-cells') && this.parent.cellTemplate) ?
            closest(e.target as Element, '.e-work-cells') : e.target) as HTMLElement;
        let dragArgs: DragEventArgs = {
            cancel: false, data: this.getChangedData(),
            event: e, element: this.actionObj.element, target: target
        };
        this.parent.trigger(events.dragStop, dragArgs, (dragEventArgs: DragEventArgs) => {
            if (dragEventArgs.cancel) {
                return;
            }
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.activeViewOptions.group.allowGroupEdit
                && !this.parent.rowAutoHeight && !this.parent.virtualScrollModule && this.parent.activeViewOptions.group.byGroupID) {
                this.parent.crudModule.crudObj.isCrudAction = true;
                this.parent.crudModule.crudObj.sourceEvent =
                    [this.parent.resourceBase.lastResourceLevel[parseInt(dragArgs.element.getAttribute('data-group-index'), 10)]];
                this.parent.crudModule.crudObj.targetEvent =
                    [this.parent.resourceBase.lastResourceLevel[parseInt(dragArgs.target.getAttribute('data-group-index'), 10)]];
            }
            this.saveChangedData(dragEventArgs);
        });
    }

    public updateNavigatingPosition(e: MouseEvent & TouchEvent): void {
        if (this.actionObj.navigation.enable) {
            let currentDate: Date = this.parent.getCurrentTime();
            if (isNullOrUndefined(this.actionObj.navigationInterval)) {
                this.actionObj.navigationInterval = window.setInterval(
                    () => {
                        if (currentDate) {
                            let crtDate: Date = this.parent.getCurrentTime();
                            let end: number = crtDate.getSeconds();
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
        } else if (this.parent.activeView.isTimelineView()) {
            this.timelineEventModule.dateRender = this.parent.activeView.renderDates;
            this.timelineEventModule.cellWidth = this.actionObj.cellWidth;
            this.timelineEventModule.getSlotDates();
            this.actionObj.cellWidth = this.isHeaderRows ? this.timelineEventModule.cellWidth : this.actionObj.cellWidth;
            this.calculateTimelineTime(e);
        } else {
            if (this.parent.currentView === 'Month') {
                this.calculateVerticalDate(e);
            } else {
                this.calculateVerticalTime(e);
            }
        }
    }

    public navigationWrapper(): void {
        if (!this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'Month' || !this.parent.timeScale.enable) {
                let outerWrapperCls: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
                this.actionObj.index = (this.parent.activeView.renderDates.length < this.actionObj.index) ?
                    this.parent.activeView.renderDates.length - 1 : this.actionObj.index;
                let targetWrapper: Element = outerWrapperCls[this.actionObj.index].querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
                if (!targetWrapper) {
                    targetWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                    outerWrapperCls[this.actionObj.index].appendChild(targetWrapper);
                }
                targetWrapper.appendChild(this.actionObj.clone);
            } else {
                let wrapperClass: string = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) ?
                    '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + cls.APPOINTMENT_WRAPPER_CLASS;
                this.parent.element.querySelectorAll(wrapperClass)
                    .item(this.actionObj.index).appendChild(this.actionObj.clone);
                if (wrapperClass === '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS) {
                    let elementHeight: number = this.getAllDayEventHeight();
                    let event: HTMLElement[] =
                        [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS + ':first-child'));
                    if (event[0].offsetHeight < elementHeight) {
                        for (let e of event) {
                            e.style.height = ((elementHeight + 2) / 12) + 'em';
                        }
                    }
                    this.actionObj.clone.style.height = formatUnit(elementHeight);
                }
                this.actionObj.height = parseInt(this.actionObj.clone.style.height, 0);
            }
        } else {
            let outWrapper: Element;
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                outWrapper = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(this.actionObj.index);
            } else {
                outWrapper = this.parent.element.querySelector('.' + cls.APPOINTMENT_CONTAINER_CLASS);
            }
            let tarWrapper: Element = outWrapper.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
            if (!tarWrapper) {
                tarWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                outWrapper.appendChild(tarWrapper);
            }
            tarWrapper.appendChild(this.actionObj.clone);
        }
    }

    private viewNavigation(e: MouseEvent & TouchEvent): void {
        let navigationType: string;
        let dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (dragArea && ((!this.scrollEdges.top && !this.scrollEdges.bottom) ||
            closest(this.actionObj.clone, '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS))) {
            if ((dragArea.scrollLeft === 0) &&
                (Math.round(this.actionObj.X) <=
                    Math.round(dragArea.getBoundingClientRect().left + this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'next' : 'previous';
            } else if ((Math.round(dragArea.scrollLeft) + dragArea.clientWidth === dragArea.scrollWidth) &&
                (Math.round(this.actionObj.X) >=
                    Math.round(dragArea.getBoundingClientRect().right - this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'previous' : 'next';
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
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventDuration: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime();
        let td: HTMLElement = closest((<HTMLTableCellElement>e.target), 'td') as HTMLElement;
        let dragStart: Date = this.parent.getDateFromElement(td);
        let dragEnd: Date = new Date(dragStart.getTime());
        dragEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        this.actionObj.start = new Date(dragStart.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.actionObj.clone.style.top = formatUnit((<HTMLElement>td.offsetParent).offsetTop);
        this.actionObj.clone.style.left = formatUnit(td.offsetLeft);
        this.actionObj.clone.style.width = formatUnit(td.offsetWidth);
        let eventContainer: HTMLElement = td as HTMLElement;
        let eventWrapper: HTMLElement;
        if (this.parent.activeView.isTimelineView()) {
            let rowIndex: number = (closest(td, 'tr') as HTMLTableRowElement).rowIndex;
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
            (!(closest(this.actionObj.target as Element, 'td').classList.contains(cls.WORK_CELLS_CLASS)) &&
                !(closest(this.actionObj.target as Element, 'td').classList.contains(cls.ALLDAY_CELLS_CLASS)))) {
            return;
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.swapDragging(e);
        }
        let dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventStart: Date = eventObj[this.parent.eventFields.startTime] as Date;
        let eventEnd: Date = eventObj[this.parent.eventFields.endTime] as Date;
        let eventDuration: number = eventEnd.getTime() - eventStart.getTime();
        let offsetTop: number = Math.floor(parseInt(this.actionObj.clone.style.top, 10) / this.actionObj.cellHeight)
            * this.actionObj.cellHeight;
        offsetTop = offsetTop < 0 ? 0 : offsetTop;
        if (this.scrollEdges.top || this.scrollEdges.bottom) {
            offsetTop = this.scrollEdges.top ? dragArea.scrollTop - this.heightUptoCursorPoint +
                this.actionObj.cellHeight + window.pageYOffset :
                (dragArea.scrollTop + dragArea.offsetHeight - this.actionObj.clone.offsetHeight + window.pageYOffset) +
                (this.actionObj.clone.offsetHeight - this.heightUptoCursorPoint);
            offsetTop = Math.round(offsetTop / this.actionObj.cellHeight) * this.actionObj.cellHeight;
            this.actionObj.clone.style.top = formatUnit(offsetTop);
        }
        let rowIndex: number = (this.parent.activeViewOptions.timeScale.enable) ? (offsetTop / this.actionObj.cellHeight) : 0;
        let heightPerMinute: number = this.actionObj.cellHeight / this.actionObj.slotInterval;
        let diffInMinutes: number = parseInt(this.actionObj.clone.style.top, 10) - offsetTop;
        let tr: HTMLElement;
        if (this.isAllDayDrag) {
            tr = this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS) as HTMLElement;
        } else {
            let trCollections: HTMLTableRowElement[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
            tr = trCollections[rowIndex] as HTMLElement;
        }
        let index: number;
        if (closest(this.actionObj.target as Element, 'td').classList.contains(cls.WORK_CELLS_CLASS) ||
            closest(this.actionObj.target as Element, 'td').classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            index = (closest((<HTMLTableCellElement>this.actionObj.target), 'td') as HTMLTableCellElement).cellIndex;
        }
        let colIndex: number = isNullOrUndefined(index) ? (<HTMLTableCellElement>closest(this.actionObj.clone, 'td')).cellIndex : index;
        this.actionObj.index = colIndex;
        if (isNullOrUndefined(tr)) {
            return;
        }
        let td: HTMLElement = tr.children[colIndex] as HTMLElement;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        let dragStart: Date; let dragEnd: Date;
        if (this.parent.activeViewOptions.timeScale.enable && !this.isAllDayDrag) {
            this.appendCloneElement(this.getEventWrapper(colIndex));
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
            this.updateAllDayEvents(dragStart, dragEnd, this.parent.activeViewOptions.group.byDate ? colIndex : undefined);
        }
        this.actionObj.start = new Date(+dragStart);
        this.actionObj.end = new Date(+dragEnd);
        let event: { [key: string]: Object } = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
        this.updateEventHeight(event);
        this.updateTimePosition(this.actionObj.start);
    }

    private updateEventHeight(event: { [key: string]: Object }): void {
        this.verticalEvent.initializeValues();
        let datesCount: number = 0;
        for (let i: number = 0; i < this.actionObj.groupIndex; i++) {
            datesCount = datesCount + this.verticalEvent.dateRender[i].length;
        }
        let target: boolean = (this.parent.activeViewOptions.group.byDate &&
            !isNullOrUndefined(this.parent.getDateFromElement(this.actionObj.target as HTMLElement))) ? true : false;
        if (target || !this.parent.activeViewOptions.group.byDate) {
            let dayIndex: number = !this.parent.activeViewOptions.group.byDate ? this.actionObj.index - datesCount
                : this.parent.getIndexOfDate(this.verticalEvent.dateRender[this.actionObj.groupIndex], util.resetTime(
                    this.parent.getDateFromElement(this.actionObj.target as HTMLElement)));
            let record: { [key: string]: Object } = this.verticalEvent.isSpannedEvent(event, dayIndex, this.actionObj.groupIndex);
            let eStart: Date = record[this.verticalEvent.fields.startTime] as Date;
            let eEnd: Date = record[this.verticalEvent.fields.endTime] as Date;
            let topValue: number = 0;
            let appHeight: number = this.verticalEvent.getHeight(eStart, eEnd);
            topValue = this.verticalEvent.getTopValue(eStart, dayIndex, this.actionObj.groupIndex);
            this.actionObj.clone.style.top = formatUnit(topValue);
            this.actionObj.clone.style.height = formatUnit(appHeight);
        }
    }

    private updateAllDayEvents(startDate: Date, endDate: Date, colIndex: number): void {
        this.parent.eventBase.slots = [];
        let event: { [key: string]: Object } = this.getUpdatedEvent(startDate, endDate, this.actionObj.event);
        let renderDates: Date[] = this.parent.activeView.renderDates;
        this.parent.eventBase.slots.push(this.parent.activeView.renderDates.map((date: Date) => { return +date; }));
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.eventBase.slots = [];
            let resources: TdData[] = this.parent.resourceBase.lastResourceLevel.
                filter((res: TdData) => res.groupIndex === this.actionObj.groupIndex);
            renderDates = resources[0].renderDates;
            this.parent.eventBase.slots.push(renderDates.map((date: Date) => { return +date; }));
        }
        let events: { [key: string]: Object }[] = this.parent.eventBase.splitEvent(event, renderDates);
        let query: string = '.e-all-day-cells[data-date="' +
            this.parent.getMsFromDate(<Date>events[0][this.parent.eventFields.startTime]) + '"]';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            query = query.concat('[data-group-index = "' + this.actionObj.groupIndex + '"]');
        }
        let cell: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(query));
        if (cell.length > 0 || !isNullOrUndefined(colIndex)) {
            let cellIndex: number = !isNullOrUndefined(colIndex) ? colIndex : (cell[0] as HTMLTableCellElement).cellIndex;
            this.appendCloneElement(this.getEventWrapper(cellIndex));
            this.actionObj.clone.style.width =
                formatUnit(((<{ [key: string]: Object }>events[0].data).count as number) * this.actionObj.cellWidth);
        }
    }

    private swapDragging(e: MouseEvent & TouchEvent): void {
        let colIndex: number = (closest((<HTMLTableCellElement>this.actionObj.target), 'td') as HTMLTableCellElement).cellIndex;
        if (closest(this.actionObj.target as Element, '.' + cls.DATE_HEADER_WRAP_CLASS) &&
            !closest(this.actionObj.clone, '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS)) {
            addClass([this.actionObj.clone], cls.ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = true;
            let eventHeight: number = this.getAllDayEventHeight();
            let allDayElement: HTMLElement[] =
                [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS + ':first-child'));
            if (allDayElement[0].offsetHeight < eventHeight) {
                for (let element of allDayElement) {
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
            let height: number = (this.actionObj.element.offsetHeight === 0) ? this.actionObj.height : this.actionObj.element.offsetHeight;
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
        this.removeCloneElement();
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventDuration: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime();
        let td: HTMLTableCellElement = closest((<HTMLTableCellElement>this.actionObj.target), 'td') as HTMLTableCellElement;
        if (!isNullOrUndefined(td)) {
            let tr: HTMLTableRowElement = td.parentElement as HTMLTableRowElement;
            this.actionObj.index = (tr.rowIndex * tr.children.length) + td.cellIndex;
            let workCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
            td = <HTMLTableCellElement>workCells[this.actionObj.index];
            let currentDate: Date = this.parent.getDateFromElement(td);
            if (!isNullOrUndefined(currentDate)) {
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
                }
                let timeString: Date = new Date(currentDate.setDate(currentDate.getDate() - this.daysVariation));
                let dragStart: Date = new Date(timeString.getTime());
                let dragEnd: Date = new Date(dragStart.getTime());
                let startTimeDiff: number = (<Date>eventObj[this.parent.eventFields.startTime]).getTime() -
                    (util.resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
                dragStart = new Date(dragStart.getTime() + startTimeDiff);
                dragEnd = new Date(dragStart.getTime() + eventDuration);
                this.actionObj.start = new Date(dragStart.getTime());
                this.actionObj.end = new Date(dragEnd.getTime());
            }
        }
        let event: { [key: string]: Object } = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
        this.dynamicEventsRendering(event);
    }

    private calculateTimelineTime(e: MouseEvent & TouchEvent): void {
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventDuration: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime();
        let offsetLeft: number = this.parent.enableRtl ? Math.abs(this.actionObj.clone.offsetLeft) - this.actionObj.clone.offsetWidth :
            parseInt(this.actionObj.clone.style.left, 10);
        offsetLeft = Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        let rightOffset: number;
        if (this.parent.enableRtl) {
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.right, 10));
            this.actionObj.clone.style.right = formatUnit(rightOffset);
        }
        offsetLeft = this.getOffsetValue(offsetLeft, rightOffset);
        let colIndex: number = this.getColumnIndex(offsetLeft);
        let cloneIndex: number =
            Math.floor((this.actionObj.pageX - this.actionObj.clone.getBoundingClientRect().left) / this.actionObj.cellWidth);
        if (this.parent.enableRtl) {
            cloneIndex = Math.abs(Math.floor((this.actionObj.pageX - this.actionObj.clone.getBoundingClientRect().right) /
                this.actionObj.cellWidth)) - 1;
        }
        if (this.cursorPointIndex < 0) {
            this.cursorIndex(e, eventObj, offsetLeft, cloneIndex);
        }
        let tr: HTMLTableRowElement = this.parent.getContentTable().querySelector('tr') as HTMLTableRowElement;
        let index: number = this.getCursorCurrentIndex(colIndex, cloneIndex, tr);
        index = index < 0 ? 0 : index;
        let eventStart: Date = this.isHeaderRows ? new Date(this.timelineEventModule.dateRender[index].getTime()) :
            this.parent.getDateFromElement(<HTMLElement>tr.children[index]);
        if (this.isStepDragging) {
            let widthDiff: number = this.getWidthDiff(tr, index);
            if (widthDiff !== 0) {
                let timeDiff: number = Math.round(widthDiff / this.widthPerMinute);
                eventStart.setMinutes(eventStart.getMinutes() + (timeDiff * this.actionObj.interval));
                eventStart.setMinutes(eventStart.getMinutes() - this.minDiff);
            } else {
                eventStart = this.actionObj.start;
            }
        } else {
            eventStart.setMinutes(eventStart.getMinutes() -
                (this.cursorPointIndex * (this.isTimelineDayProcess ? MINUTES_PER_DAY : this.actionObj.slotInterval)));
        }
        eventStart = this.calculateIntervalTime(eventStart);
        if (this.isTimelineDayProcess) {
            let eventSrt: Date = eventObj[this.parent.eventFields.startTime] as Date;
            eventStart.setHours(eventSrt.getHours(), eventSrt.getMinutes(), eventSrt.getSeconds());
        }
        let eventEnd: Date = new Date(eventStart.getTime());
        eventEnd.setMilliseconds(eventDuration);
        let event: { [key: string]: Object } = this.getUpdatedEvent(eventStart, eventEnd, this.actionObj.event);
        let events: { [key: string]: Object }[] = this.timelineEventModule.splitEvent(event, this.timelineEventModule.dateRender);
        let eventData: { [key: string]: Object } = events[0].data as { [key: string]: Object };
        let startTime: Date = this.timelineEventModule.getStartTime(events[0], eventData);
        let endTime: Date = this.timelineEventModule.getEndTime(events[0], eventData);
        let width: number = this.timelineEventModule.
            getEventWidth(startTime, endTime, eventObj[this.parent.eventFields.isAllDay] as boolean, eventData.count as number);
        let day: number = this.parent.getIndexOfDate(this.timelineEventModule.dateRender, util.resetTime(new Date(startTime.getTime())));
        day = day < 0 ? 0 : day;
        let left: number =
            this.timelineEventModule.getPosition(startTime, endTime, eventObj[this.parent.eventFields.isAllDay] as boolean, day);
        if (this.parent.enableRtl) {
            this.actionObj.clone.style.right = formatUnit(left);
        } else {
            this.actionObj.clone.style.left = formatUnit(left);
        }
        if (!this.isMorePopupOpened) {
            this.actionObj.clone.style.width = formatUnit(width);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(eventStart.getTime());
        this.actionObj.end = new Date(eventEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    }

    private getOffsetValue(offsetLeft: number, rightOffset: number): number {
        if (this.scrollEdges.left || this.scrollEdges.right) {
            let viewEle: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
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
                this.actionObj.clone.style.left = formatUnit(rightOffset);
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
                this.actionObj.clone.style.left = formatUnit(offsetLeft);
            }
        }
        return offsetLeft;
    }

    private getWidthDiff(tr: HTMLTableRowElement, index: number): number {
        let pages: ClientRect | DOMRect = this.scrollArgs.element.getBoundingClientRect();
        if (pages.left <= this.actionObj.pageX && pages.right >= this.actionObj.pageX) {
            let targetLeft: number = (<HTMLElement>tr.children[index]).offsetLeft;
            let pageX: number = this.actionObj.pageX - pages.left;
            if (this.parent.enableRtl) {
                return (targetLeft + this.actionObj.cellWidth) - (this.scrollArgs.element.scrollLeft + pageX);
            } else {
                return (this.scrollArgs.element.scrollLeft + pageX) - targetLeft;
            }
        }
        return 0;
    }

    private getColumnIndex(offsetLeft: number): number {
        let index: number = Math.floor(offsetLeft / this.actionObj.cellWidth);
        if (this.isHeaderRows) {
            return index;
        }
        return this.getIndex(index);
    }

    private getCursorCurrentIndex(colIndex: number, cloneIndex: number, tr: HTMLTableRowElement): number {
        let index: number = colIndex + cloneIndex;
        if (this.isHeaderRows) {
            let dateLength: number = Math.floor(tr.offsetWidth / this.actionObj.cellWidth);
            return (index > dateLength - 1) ? dateLength - 1 : index;
        }
        return (index > tr.children.length - 1) ? tr.children.length - 1 : index;
    }

    private cursorIndex(e: MouseEvent & TouchEvent, event: { [key: string]: Object }, left: number, index: number): void {
        let td: HTMLElement = (<HTMLElement>closest(e.target as Element, '.e-work-cells'));
        if (!isNullOrUndefined(td) && !this.isMorePopupOpened) {
            let targetDate: Date = this.parent.getDateFromElement(td);
            if (this.isHeaderRows) {
                let currentIndex: number = Math.floor(left / this.actionObj.cellWidth);
                targetDate = new Date(this.timelineEventModule.dateRender[currentIndex + index].getTime());
            }
            let timeDiff: number = targetDate.getTime() - (event[this.parent.eventFields.startTime] as Date).getTime();
            if (this.isTimelineDayProcess) {
                this.cursorPointIndex = Math.abs(Math.ceil(timeDiff / (util.MS_PER_DAY)));
            } else {
                let widthDiff: number =
                    Math.floor((timeDiff / util.MS_PER_MINUTE) / (this.actionObj.slotInterval / this.actionObj.cellWidth));
                this.cursorPointIndex = Math.floor(widthDiff / this.actionObj.cellWidth);
                this.cursorPointIndex = this.cursorPointIndex < 0 ? 0 : this.cursorPointIndex;
            }
        } else {
            this.cursorPointIndex = 0;
        }
    }

    private calculateResourceGroupingPosition(e: MouseEvent & TouchEvent): void {
        let dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let trCollection: HTMLElement[] =
            [].slice.call(this.parent.element.querySelectorAll('.e-content-wrap .e-content-table tr:not(.e-hidden)'));
        let translateY: number = util.getTranslateY(dragArea.querySelector('table'));
        translateY = (isNullOrUndefined(translateY)) ? 0 : translateY;
        let rowHeight: number = (this.parent.rowAutoHeight) ?
            ~~(dragArea.querySelector('table').offsetHeight / trCollection.length) : this.actionObj.cellHeight;
        let rowIndex: number = Math.floor(Math.floor((this.actionObj.Y + (dragArea.scrollTop - translateY - window.scrollY)) -
            dragArea.getBoundingClientRect().top) / rowHeight);
        rowIndex = (rowIndex < 0) ? 0 : (rowIndex > trCollection.length - 1) ? trCollection.length - 1 : rowIndex;
        this.actionObj.index = rowIndex;
        let eventContainer: Element = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(rowIndex);
        let eventWrapper: HTMLElement = eventContainer.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS) as HTMLElement;
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
        let td: HTMLTableCellElement = closest((<HTMLTableCellElement>e.target), 'td') as HTMLTableCellElement;
        this.actionObj.groupIndex = (td && !isNaN(parseInt(td.getAttribute('data-group-index'), 10)))
            ? parseInt(td.getAttribute('data-group-index'), 10) : this.actionObj.groupIndex;
        let top: number = (<HTMLElement>trCollection[rowIndex]).offsetTop;
        if (this.parent.rowAutoHeight) {
            let cursorElement: HTMLElement = this.getCursorElement(e);
            if (cursorElement) {
                top = cursorElement.classList.contains(cls.WORK_CELLS_CLASS) ? cursorElement.offsetTop :
                    cursorElement.offsetParent.classList.contains(cls.APPOINTMENT_CLASS) ?
                        (cursorElement.offsetParent as HTMLElement).offsetTop : top;
            }
        }
        this.actionObj.clone.style.top = formatUnit(top);
    }

    private appendCloneElement(element: HTMLElement): void {
        if (this.parent.eventDragArea) {
            document.querySelector(this.parent.eventDragArea).appendChild(this.actionObj.clone);
        } else {
            element.appendChild(this.actionObj.clone);
        }
    }

    private getEventWrapper(index: number): HTMLElement {
        let eventWrapper: HTMLElement;
        let isAllDayDrag: boolean = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS);
        if (this.parent.activeViewOptions.timeScale.enable) {
            let wrapperClass: string = isAllDayDrag ? '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + cls.APPOINTMENT_WRAPPER_CLASS;
            eventWrapper = this.parent.element.querySelectorAll(wrapperClass).item(index) as HTMLElement;
        } else {
            let targetWrapper: HTMLElement = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS).item(index) as HTMLElement;
            eventWrapper = targetWrapper.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS) as HTMLElement;
            if (!eventWrapper) {
                eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                targetWrapper.appendChild(eventWrapper);
            }
        }
        return eventWrapper;
    }

    private getAllDayEventHeight(): number {
        let eventWrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_CLASS });
        this.parent.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS).appendChild(eventWrapper);
        let eventHeight: number = eventWrapper.offsetHeight;
        remove(eventWrapper);
        return eventHeight;
    }

    private isAllowDrop(e: MouseEvent): boolean {
        if (!this.actionObj.excludeSelectors) {
            return false;
        }
        let dropSelectors: string[] = this.actionObj.excludeSelectors.split(',');
        let isAllowDrop: boolean = false;
        for (let selector of dropSelectors) {
            if ((<HTMLElement>e.target).classList.contains(selector)) {
                isAllowDrop = true;
                break;
            }
        }
        return isAllowDrop;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'dragAndDrop';
    }

}