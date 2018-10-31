import { createElement, closest, Draggable, extend, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, remove, removeClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { DragEventArgs, EJ2Instance } from '../base/interface';
import { ActionBase } from '../actions/action-base';
import * as events from '../base/constant';
import * as util from '../base/util';
import * as cls from '../base/css-constant';

/**
 * Schedule events drag actions
 */

export class DragAndDrop extends ActionBase {
    public wireDragEvent(element: HTMLElement, isAllDay: boolean): void {
        let dragAreaTarget: string = isAllDay ? cls.DATE_HEADER_WRAP_CLASS : cls.CONTENT_WRAP_CLASS;
        new Draggable(element, {
            abort: '.' + cls.EVENT_RESIZE_CLASS,
            clone: true,
            enableTapHold: this.parent.isAdaptive as boolean,
            enableTailMode: (this.parent.eventDragArea) ? true : false,
            cursorAt: (this.parent.eventDragArea) ? { left: -20, top: -20 } : { left: 0, top: 0 },
            dragArea: (this.parent.eventDragArea) ?
                document.querySelector(this.parent.eventDragArea) as HTMLElement :
                this.parent.element.querySelector('.' + dragAreaTarget) as HTMLElement,
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
            queryPositionInfo: this.dragPosition.bind(this)
        });
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
        let slotInterval: number = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        let cellWidth: number = this.parent.activeView.isTimelineView() ? (this.actionObj.cellWidth / slotInterval) *
            this.actionObj.interval : this.actionObj.cellWidth;
        let cellHeight: number = (this.actionObj.cellHeight / slotInterval) * this.actionObj.interval;
        let leftOffset: number = this.parent.enableRtl ? parseInt(<string>e.left, 10) : Math.abs(parseInt(<string>e.left, 10));
        let leftValue: string;
        if (this.parent.currentView === 'Month' || this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
            leftValue = e.left as string;
        } else {
            leftValue = formatUnit(Math.floor(leftOffset / cellWidth) * cellWidth);
        }
        let topValue: string;
        if ((this.parent.activeView.isTimelineView() || !this.parent.timeScale.enable ||
            this.actionObj.clone.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS))) {
            topValue = formatUnit(this.actionObj.clone.offsetTop);
        } else if (this.parent.currentView === 'Month') {
            topValue = formatUnit(0);
        } else if (this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) &&
            !this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
            topValue = formatUnit((<HTMLElement>this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS)).scrollTop);
        } else if (this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
            topValue = formatUnit((<HTMLElement>this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS)).offsetTop);
        } else {
            topValue = formatUnit(Math.ceil(parseInt(<string>e.top, 10) / cellHeight) * cellHeight);
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

    private dragStart(e: MouseEvent & TouchEvent): void {
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
        this.parent.trigger(events.dragStart, dragArgs);
        if (dragArgs.cancel) {
            this.removeCloneElement();
            return;
        }
        this.actionClass('addClass');
        this.parent.uiStateValues.action = true;
        this.actionObj.start = eventObj[this.parent.eventFields.startTime] as Date;
        this.actionObj.end = eventObj[this.parent.eventFields.endTime] as Date;
        this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
        this.actionObj.interval = dragArgs.interval;
        this.actionObj.navigation = dragArgs.navigation;
        this.actionObj.scroll = dragArgs.scroll;
        this.actionObj.excludeSelectors = dragArgs.excludeSelectors;
    }

    private drag(e: MouseEvent & TouchEvent): void {
        this.parent.quickPopup.quickPopupHide(true);
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventArgs: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
        this.actionObj.Y = this.actionObj.pageY = eventArgs.pageY;
        this.actionObj.X = this.actionObj.pageX = eventArgs.pageX;
        this.actionObj.target = e.target;
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
                    this.actionObj.clone.style.height = formatUnit(this.actionObj.element.offsetHeight);
                    this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
                }
            }
        }
        this.updateScrollPosition(e);
        this.updateDraggingDateTime(e);
        let dragArgs: DragEventArgs = { data: eventObj, event: e, element: this.actionObj.element };
        this.parent.trigger(events.drag, dragArgs);
    }

    private dragStop(e: MouseEvent): void {
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
        let dragArgs: DragEventArgs = { cancel: false, data: this.getChangedData(), event: e, element: this.actionObj.element };
        this.parent.trigger(events.dragStop, dragArgs);
        if (dragArgs.cancel) {
            return;
        }
        this.saveChangedData(dragArgs);
    }

    public updateDraggingDateTime(e: MouseEvent & TouchEvent): void {
        if (this.actionObj.navigation.enable) {
            let currentDate: Date = new Date();
            if (isNullOrUndefined(this.actionObj.navigationInterval)) {
                this.actionObj.navigationInterval = window.setInterval(
                    () => {
                        if (currentDate) {
                            let crtDate: Date = new Date();
                            let end: number = crtDate.getSeconds();
                            let start: number = currentDate.getSeconds() + (this.actionObj.navigation.timeDelay / 1000);
                            start = (start >= 60) ? start - 60 : start;
                            if (start === end) {
                                currentDate = new Date();
                                this.viewNavigation(e);
                            }
                        }
                    },
                    this.actionObj.navigation.timeDelay);
            }
        }
        if (this.actionObj.clone.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS)) {
            this.morePopupEventDragging(e);
        } else if (this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'TimelineMonth') {
                this.calculateTimelineDate(e);
            } else {
                this.calculateTimelineTime(e);
            }
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
                let outerWrapperCls: NodeListOf<Element> = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS);
                this.actionObj.index = (this.parent.activeView.renderDates.length < this.actionObj.index) ?
                    this.parent.activeView.renderDates.length - 1 : this.actionObj.index;
                let targetWrapper: Element = outerWrapperCls.item(this.actionObj.index).querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
                if (!targetWrapper) {
                    targetWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                    outerWrapperCls.item(this.actionObj.index).appendChild(targetWrapper);
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
                        event.forEach((element: HTMLElement) => element.style.height = ((elementHeight + 2) / 12) + 'em');
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
        let dragStart: Date = new Date(parseInt(td.getAttribute('data-date'), 10));
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
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest((<HTMLTableCellElement>e.target), 'tr')))) {
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
        let offsetTop: number = Math.floor(this.actionObj.clone.offsetTop / this.actionObj.cellHeight) * this.actionObj.cellHeight;
        offsetTop = offsetTop < 0 ? 0 : offsetTop;
        if (this.scrollEdges.top || this.scrollEdges.bottom) {
            offsetTop = this.scrollEdges.top ? dragArea.scrollTop :
                dragArea.scrollTop + dragArea.offsetHeight - this.actionObj.clone.offsetHeight;
            offsetTop = Math.round(offsetTop / this.actionObj.cellHeight) * this.actionObj.cellHeight;
            this.actionObj.clone.style.top = formatUnit(offsetTop);
        }
        let rowIndex: number = offsetTop / this.actionObj.cellHeight;
        let heightPerMinute: number = this.actionObj.cellHeight / this.actionObj.slotInterval;
        let diffInMinutes: number = this.actionObj.clone.offsetTop - offsetTop;
        let isAllDayDrag: boolean = this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS);
        let tr: HTMLElement;
        if (isAllDayDrag) {
            tr = this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS) as HTMLElement;
        } else {
            let trCollections: NodeListOf<HTMLTableRowElement> = this.parent.getContentTable().querySelectorAll('tr');
            tr = trCollections.item(rowIndex) as HTMLElement;
        }
        let index: number = (closest((<HTMLTableCellElement>this.actionObj.target), 'td') as HTMLTableCellElement).cellIndex;
        let colIndex: number = isNullOrUndefined(index) ? (<HTMLTableCellElement>closest(this.actionObj.clone, 'td')).cellIndex : index;
        this.actionObj.index = colIndex;
        let td: HTMLElement = tr.childNodes.item(colIndex) as HTMLElement;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        let dragStart: Date; let dragEnd: Date;
        if (this.parent.activeViewOptions.timeScale.enable && !isAllDayDrag) {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            let spanHours: number = -(((this.actionObj.slotInterval / this.actionObj.cellHeight) * diffInMinutes) * (1000 * 60));
            if (this.actionObj.clone.querySelector('.' + cls.EVENT_ICON_UP_CLASS)) {
                let startTime: Date = new Date(eventStart.getTime());
                spanHours = util.addDays(util.resetTime(new Date(startTime.getTime())), 1).getTime() - startTime.getTime();
            }
            dragStart = new Date(parseInt(td.getAttribute('data-date'), 10));
            dragStart.setMinutes(dragStart.getMinutes() + (diffInMinutes * heightPerMinute));
            dragStart.setMilliseconds(-spanHours);
            dragStart = this.calculateIntervalTime(dragStart);
            dragStart.setMilliseconds(spanHours);
            dragEnd = new Date(dragStart.getTime());
            if (this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd.setMinutes(dragEnd.getMinutes() + this.actionObj.slotInterval);
            } else {
                dragEnd.setMilliseconds(eventDuration);
            }
        } else {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            dragStart = new Date(parseInt(td.getAttribute('data-date'), 10));
            dragStart.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            dragEnd = new Date(dragStart.getTime());
            dragEnd.setMilliseconds(eventDuration);
            if (!this.actionObj.element.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) &&
                this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd = util.addDays(util.resetTime(dragEnd), 1);
            }
        }
        this.actionObj.start = new Date(+dragStart);
        this.actionObj.end = new Date(+dragEnd);
        this.updateTimePosition(this.actionObj.start);
    }

    private swapDragging(e: MouseEvent & TouchEvent): void {
        let colIndex: number = (closest((<HTMLTableCellElement>e.target), 'td') as HTMLTableCellElement).cellIndex;
        let setDragArea: Function = (isAllDay: boolean) => {
            let dragAreaTarget: string = isAllDay ? cls.DATE_HEADER_WRAP_CLASS : cls.CONTENT_WRAP_CLASS;
            let dragObj: Draggable = (this.actionObj.element as EJ2Instance).ej2_instances[0] as Draggable;
            dragObj.dragArea = this.parent.eventDragArea ?
                document.querySelector(this.parent.eventDragArea) as HTMLElement :
                this.parent.element.querySelector('.' + dragAreaTarget) as HTMLElement;
            dragObj.dataBind();
        };
        if (closest(e.target as Element, '.' + cls.DATE_HEADER_WRAP_CLASS) &&
            !closest(this.actionObj.clone, '.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS)) {
            addClass([this.actionObj.clone], cls.ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = true;
            setDragArea(this.actionObj.isAllDay);
            let eventHeight: number = this.getAllDayEventHeight();
            let allDayElement: HTMLElement[] =
                [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS + ':first-child'));
            if (allDayElement[0].offsetHeight < eventHeight) {
                allDayElement.forEach((element: HTMLElement) => element.style.height = ((eventHeight + 2) / 12) + 'em');
            }
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(this.actionObj.cellWidth),
                height: formatUnit(eventHeight),
                top: formatUnit((<HTMLElement>this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS)).offsetTop)
            });
        }
        if (closest(e.target as Element, '.' + cls.WORK_CELLS_CLASS) && !closest(this.actionObj.clone, '.' + cls.DAY_WRAPPER_CLASS)) {
            removeClass([this.actionObj.clone], cls.ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = false;
            setDragArea(this.actionObj.isAllDay);
            let cursorElement: HTMLElement = this.getCursorElement(e);
            let height: number = (this.actionObj.element.offsetHeight === 0) ? this.actionObj.height : this.actionObj.element.offsetHeight;
            setStyleAttribute(this.actionObj.clone, {
                left: formatUnit(0),
                top: formatUnit(cursorElement.offsetTop),
                height: formatUnit(height),
                width: formatUnit(this.actionObj.cellWidth)
            });
        }
    }

    private calculateVerticalDate(e: MouseEvent & TouchEvent): void {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest((<HTMLTableCellElement>e.target), 'tr')))) {
            return;
        }
        this.actionObj.clone.style.top = formatUnit(0);
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventDuration: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime();
        let td: HTMLTableCellElement = closest((<HTMLTableCellElement>e.target), 'td') as HTMLTableCellElement;
        let tr: HTMLTableRowElement = td.parentElement as HTMLTableRowElement;
        let colIndex: number = (tr.rowIndex * tr.childNodes.length) + td.cellIndex;
        this.actionObj.index = colIndex;
        // let cellIndex: number = td.cellIndex;
        // let daysCount: number = Math.floor(this.actionObj.element.offsetWidth / this.actionObj.cellWidth);
        // let maxIndex: number = (tr.lastChild as HTMLTableCellElement).cellIndex;
        // if (cellIndex + daysCount > maxIndex) {
        //     this.actionObj.clone.style.width = formatUnit((this.actionObj.cellWidth - 2) * ((maxIndex + 1) - cellIndex));
        // } else {
        //     this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
        // }
        let outerWrapper: NodeListOf<Element> = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        let targetWrapper: Element = outerWrapper.item(colIndex).querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
        if (!targetWrapper) {
            targetWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            outerWrapper.item(colIndex).appendChild(targetWrapper);
        }
        if (!targetWrapper.querySelector('.' + cls.CLONE_ELEMENT_CLASS)) {
            this.appendCloneElement(targetWrapper as HTMLElement);
        }
        let timeString: string = td.getAttribute('data-date') || (<Date>eventObj[this.parent.eventFields.startTime]).getTime().toString();
        let dragStart: Date = new Date(parseInt(timeString, 10));
        let dragEnd: Date = new Date(dragStart.getTime());
        if (this.parent.enableRtl) {
            let endTimeDiff: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
                (util.resetTime(new Date(+eventObj[this.parent.eventFields.endTime]))).getTime();
            dragEnd = new Date(dragStart.getTime() + endTimeDiff);
            dragStart = new Date(dragEnd.getTime() - eventDuration);
        } else {
            let startTimeDiff: number = (<Date>eventObj[this.parent.eventFields.startTime]).getTime() -
                (util.resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
            dragStart = new Date(dragStart.getTime() + startTimeDiff);
            dragEnd = new Date(dragStart.getTime() + eventDuration);
        }
        this.actionObj.start = new Date(dragStart.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    }

    private calculateTimelineTime(e: MouseEvent & TouchEvent): void {
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventDuration: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime();
        let offsetLeft: number = this.parent.enableRtl ? Math.abs(this.actionObj.clone.offsetLeft) - this.actionObj.clone.offsetWidth :
            parseInt(this.actionObj.clone.style.left, 10);
        offsetLeft = Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        let rightOffset: number;
        let diffInMinutes: number = this.actionObj.clone.offsetLeft - offsetLeft;
        let viewEle: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (this.parent.enableRtl) {
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.left, 10)) - this.actionObj.clone.offsetWidth;
            this.actionObj.clone.style.right = formatUnit(rightOffset);
            diffInMinutes = rightOffset - offsetLeft;
        }
        if (this.scrollEdges.left || this.scrollEdges.right) {
            if (this.parent.enableRtl) {
                rightOffset = viewEle.scrollWidth - viewEle.scrollLeft;
                if (this.scrollEdges.right) {
                    rightOffset = rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth;
                }
                this.actionObj.clone.style.left = formatUnit(rightOffset);
            } else {
                offsetLeft = this.scrollEdges.left ? viewEle.scrollLeft :
                    viewEle.scrollLeft + viewEle.offsetWidth - this.actionObj.clone.offsetWidth;
                this.actionObj.clone.style.left = formatUnit(offsetLeft);
            }
        }
        let widthPerMinute: number = this.actionObj.slotInterval / this.actionObj.cellWidth;
        let colIndex: number = this.getIndex(Math.floor(offsetLeft / this.actionObj.cellWidth));
        let tr: HTMLTableRowElement = this.parent.getContentTable().querySelector('tr') as HTMLTableRowElement;
        let eventStart: Date = new Date(parseInt((<HTMLElement>tr.childNodes.item(colIndex)).getAttribute('data-date'), 10));
        eventStart.setMinutes(eventStart.getMinutes() + Math.round((widthPerMinute * diffInMinutes)));
        eventStart = this.calculateIntervalTime(eventStart);
        if (!this.parent.activeViewOptions.timeScale.enable) {
            let eventSrt: Date = eventObj[this.parent.eventFields.startTime] as Date;
            eventStart.setHours(eventSrt.getHours(), eventSrt.getMinutes(), eventSrt.getSeconds());
        }
        let eventEnd: Date = new Date(eventStart.getTime());
        eventEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(eventStart.getTime());
        this.actionObj.end = new Date(eventEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    }

    private calculateTimelineDate(e: MouseEvent & TouchEvent): void {
        let cloneIndex: number = 0;
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let eventDuration: number = (<Date>eventObj[this.parent.eventFields.endTime]).getTime() -
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime();
        if (this.parent.enableRtl) {
            cloneIndex = (Math.floor(parseInt(this.actionObj.clone.style.right, 10))) / this.actionObj.cellWidth;
            let rightOffset: number = Math.abs(parseInt(this.actionObj.clone.style.left, 10)) - this.actionObj.clone.offsetWidth;
            this.actionObj.clone.style.right = formatUnit(rightOffset);
        } else {
            cloneIndex = Math.floor(this.actionObj.clone.offsetLeft / this.actionObj.cellWidth);
            let leftOffset: number = parseInt(this.actionObj.clone.style.left, 10);
            this.actionObj.clone.style.left = formatUnit(leftOffset);
        }
        cloneIndex = this.getIndex(cloneIndex);
        let tr: HTMLTableRowElement = this.parent.getContentTable().querySelector('tr');
        let dragDate: Date = new Date(parseInt((<HTMLElement>tr.childNodes.item(cloneIndex)).getAttribute('data-date'), 10));
        let dragStart: Date = new Date(dragDate.getTime());
        let srtDateDiff: number = (<Date>eventObj[this.parent.eventFields.startTime]).getTime() -
            (util.resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
        dragStart = new Date(dragStart.getTime() + srtDateDiff);
        let dragEnd: Date = new Date(dragStart.getTime() + eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(dragStart.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    }

    private calculateResourceGroupingPosition(e: MouseEvent & TouchEvent): void {
        let dragArea: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let trCollection: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-content-wrap .e-content-table tr:not(.e-hidden)');
        let rowIndex: number = Math.floor(Math.floor((this.actionObj.Y + dragArea.scrollTop) -
            dragArea.getBoundingClientRect().top) / this.actionObj.cellHeight);
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
        this.actionObj.clone.style.top = formatUnit((<HTMLElement>trCollection.item(rowIndex)).offsetTop);
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