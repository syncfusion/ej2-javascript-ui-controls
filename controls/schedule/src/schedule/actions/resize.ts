/* eslint-disable @typescript-eslint/no-explicit-any */
import { addClass, Browser, EventHandler, remove, closest, extend, formatUnit, setStyleAttribute, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ResizeEventArgs } from '../base/interface';
import { ActionBase } from '../actions/action-base';
import { MonthEvent } from '../event-renderer/month';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Schedule events resize actions
 */
export class Resize extends ActionBase {
    public wireResizeEvent(element: HTMLElement): void {
        const resizeElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.' + cls.EVENT_RESIZE_CLASS));
        for (const element of resizeElement) {
            EventHandler.add(element, Browser.touchStartEvent, this.resizeStart, this);
        }
    }

    private resizeHelper(): void {
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.activeViewOptions.group.allowGroupEdit) {
            for (let i: number = 0, len: number = this.actionObj.originalElement.length; i < len; i++) {
                const cloneElement: HTMLElement = this.createCloneElement(this.actionObj.originalElement[parseInt(i.toString(), 10)]);
                this.actionObj.cloneElement[parseInt(i.toString(), 10)] = cloneElement;
                if (this.actionObj.element === this.actionObj.originalElement[parseInt(i.toString(), 10)]) {
                    this.actionObj.clone = cloneElement;
                }
            }
        } else {
            if (this.actionObj.element) {
                this.actionObj.clone = this.createCloneElement(this.actionObj.element);
            }
            this.actionObj.cloneElement = [this.actionObj.clone];
            this.actionObj.originalElement = [this.actionObj.element];
        }
    }

    public resizeStart(e: MouseEvent & TouchEvent): void {
        if ((e && e.type === 'touchstart' && (!this.parent.uiStateValues.isTapHold ||
            !closest(e.target as Element, '.' + cls.APPOINTMENT_BORDER))) || closest(e.target as Element, '.' + cls.INLINE_EDIT_CLASS)) {
            return;
        }
        const resizeTarget: HTMLElement = closest(e.target as Element, '.' + cls.EVENT_RESIZE_CLASS) as HTMLElement;
        this.actionObj.element = closest(resizeTarget, '.' + cls.APPOINTMENT_CLASS) as HTMLElement;
        this.actionObj.event = this.parent.eventBase.getEventByGuid(this.actionObj.element.getAttribute('data-guid')) as Record<string, any>;
        if (isNullOrUndefined(this.actionObj.event)) {
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        this.actionObj.action = 'resize';
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        const resizeArgs: ResizeEventArgs = {
            cancel: false,
            data: eventObj,
            element: this.actionObj.element,
            event: e,
            interval: this.actionObj.interval,
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        this.parent.trigger(event.resizeStart, resizeArgs, (resizeEventArgs: ResizeEventArgs) => {
            if (resizeEventArgs.cancel) {
                return;
            }
            this.actionClass('addClass');
            this.parent.uiStateValues.action = true;
            this.resizeEdges = {
                left: resizeTarget.classList.contains(cls.LEFT_RESIZE_HANDLER),
                right: resizeTarget.classList.contains(cls.RIGHT_RESIZE_HANDLER),
                top: resizeTarget.classList.contains(cls.TOP_RESIZE_HANDLER),
                bottom: resizeTarget.classList.contains(cls.BOTTOM_RESIZE_HANDLER)
            };
            this.actionObj.groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex : 0;
            const workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
            this.actionObj.cellWidth = this.parent.getElementWidth(workCell);
            this.actionObj.cellHeight = this.parent.getElementHeight(workCell);
            const hRows: string[] = this.parent.activeViewOptions.headerRows.map((row: Record<string, any>) => row.option as string);
            if (this.parent.activeView.isTimelineView() && hRows.length > 0 && ['Date', 'Hour'].indexOf(hRows.slice(-1)[0]) < 0) {
                const tr: HTMLTableRowElement = this.parent.getContentTable().querySelector('tr') as HTMLTableRowElement;
                let noOfDays: number = 0;
                const tdCollections: HTMLElement[] = [].slice.call(tr.children);
                for (const td of tdCollections) {
                    noOfDays += parseInt(td.getAttribute('colspan'), 10);
                }
                const trRect: ClientRect = tr.getBoundingClientRect();
                this.actionObj.cellWidth = trRect.width / noOfDays;
                this.actionObj.cellHeight = trRect.height;
            }
            const pages: (MouseEvent & TouchEvent) | Touch = this.parent.eventBase.getPageCoordinates(e);
            this.actionObj.X = pages.pageX;
            this.actionObj.Y = pages.pageY;
            this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
            this.actionObj.interval = resizeEventArgs.interval;
            this.actionObj.scroll = resizeEventArgs.scroll;
            this.actionObj.start = new Date((eventObj[this.parent.eventFields.startTime] as Date).getTime());
            this.actionObj.end = new Date((eventObj[this.parent.eventFields.endTime] as Date).getTime());
            this.actionObj.originalElement = this.getOriginalElement(this.actionObj.element);
            if (this.parent.currentView === 'Month') {
                this.daysVariation = -1;
                this.monthEvent = new MonthEvent(this.parent);
            }
            const viewElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
            this.scrollArgs = { element: viewElement, width: viewElement.scrollWidth, height: viewElement.scrollHeight };
            // 883565 - To fix the resizing not working issue at the last column of the timeline view
            if (['Month', 'TimelineYear'].indexOf(this.parent.currentView) < 0) {
                const scrollWidth: number = Math.round(this.scrollArgs.width / this.actionObj.cellWidth) * this.actionObj.cellWidth;
                this.scrollArgs.width = this.scrollArgs.width < scrollWidth ? scrollWidth : this.scrollArgs.width;
            }
            EventHandler.add(document, Browser.touchMoveEvent, this.resizing, this);
            EventHandler.add(document, Browser.touchEndEvent, this.resizeStop, this);
        });
    }

    private resizing(e: MouseEvent & TouchEvent): void {
        if (e && e.type === 'touchmove') {
            e.preventDefault();
        }
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide();
        }
        if (this.parent.element.querySelectorAll('.' + cls.RESIZE_CLONE_CLASS).length === 0) {
            this.resizeHelper();
        }
        if ((!isNullOrUndefined(e.target)) && (e.target as HTMLElement).classList.contains(cls.DISABLE_DATES)) {
            return;
        }
        const pages: (MouseEvent & TouchEvent) | Touch = this.parent.eventBase.getPageCoordinates(e);
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'TimelineYear') {
            const doc: HTMLElement = document.documentElement;
            const left: number = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            const top: number = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.actionObj.pageX = pages.pageX - left;
            this.actionObj.pageY = pages.pageY - top;
        } else {
            this.actionObj.pageX = pages.pageX;
            this.actionObj.pageY = pages.pageY;
        }
        this.updateScrollPosition(e);
        this.updateResizingDirection(e);
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        const resizeArgs: ResizeEventArgs = {
            cancel: false,
            data: eventObj,
            element: this.actionObj.element,
            event: e,
            startTime: this.actionObj.start,
            endTime: this.actionObj.end
        };
        if (this.parent.group.resources.length > 0) {
            resizeArgs.groupIndex = this.actionObj.groupIndex;
        }
        this.parent.trigger(event.resizing, resizeArgs);
    }

    public updateResizingDirection(e: MouseEvent & TouchEvent): void {
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'TimelineYear') {
            this.monthResizing();
            return;
        }
        const resizeValidation: boolean = this.resizeValidation(e);
        if (this.resizeEdges.left) {
            if (resizeValidation) {
                const leftStyles: Record<string, any> = this.getLeftRightStyles(e, true);
                if (parseInt(leftStyles.width as string, 10) < 1) {
                    return;
                }
                for (const cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, leftStyles);
                    addClass([cloneElement], cls.LEFT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(!this.parent.enableRtl);
        }
        if (this.resizeEdges.right) {
            if (resizeValidation) {
                const rightStyles: Record<string, any> = this.getLeftRightStyles(e, false);
                if (parseInt(rightStyles.width as string, 10) < 1) {
                    return;
                }
                for (const cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, rightStyles);
                    addClass([cloneElement], cls.RIGHT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(this.parent.enableRtl);
        }
        if (this.resizeEdges.top) {
            if (resizeValidation) {
                const topStyles: Record<string, any> = this.getTopBottomStyles(e, true);
                if (parseInt(topStyles.height as string, 10) < 1) {
                    return;
                }
                for (const cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, topStyles);
                    addClass([cloneElement], cls.TOP_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(true);
        }
        if (this.resizeEdges.bottom) {
            if (resizeValidation) {
                const bottomStyles: Record<string, any> = this.getTopBottomStyles(e, false);
                if (parseInt(bottomStyles.height as string, 10) < 1) {
                    return;
                }
                for (const cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, bottomStyles);
                    addClass([cloneElement], cls.BOTTOM_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(false);
        }
    }

    private monthResizing(): void {
        this.removeCloneElement();
        if (isNullOrUndefined(this.actionObj.pageX) || isNullOrUndefined(this.actionObj.pageY)) {
            return;
        }
        const td: HTMLTableCellElement = document.elementFromPoint(this.actionObj.pageX, this.actionObj.pageY) as HTMLTableCellElement;
        if (isNullOrUndefined(td)) {
            return;
        }
        const resizeTime: Date = this.parent.getDateFromElement(td);
        const isSameCell: boolean = this.parent.activeViewOptions.group.resources.length > 0 ?
            parseInt(td.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex : true;
        let startTime: Date = new Date((<Date>this.actionObj.event[this.parent.eventFields.startTime]).getTime());
        let endTime: Date = new Date((<Date>this.actionObj.event[this.parent.eventFields.endTime]).getTime());
        if ((!this.parent.enableRtl && this.resizeEdges.left) || (this.parent.enableRtl && this.resizeEdges.right)
            || this.resizeEdges.top) {
            startTime = resizeTime;
        } else if ((!this.parent.enableRtl && this.resizeEdges.right) || (this.parent.enableRtl && this.resizeEdges.left)
            || this.resizeEdges.bottom) {
            endTime = util.addDays(resizeTime, 1);
        }
        if (isSameCell && startTime < endTime) {
            this.actionObj.start = startTime;
            this.actionObj.end = endTime;
            const event: Record<string, any> = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
            if (this.parent.currentView === 'TimelineYear') {
                this.yearEventsRendering(event);
            } else {
                this.dynamicEventsRendering(event);
            }
            this.updateOriginalElement(this.actionObj.clone);
        }
    }

    private yearEventsRendering(event: Record<string, any>): void {
        const eventWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CLONE_ELEMENT_CLASS));
        for (const wrapper of eventWrappers) {
            remove(wrapper);
        }
        let endDate: Date = new Date(event[this.parent.eventFields.endTime] as Date);
        let monthDiff: number = 0;
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            monthDiff = this.getMonthDiff(event[this.parent.eventFields.startTime] as Date, util.addDays(endDate, -1));
        }
        for (let i: number = 0; i <= monthDiff; i++) {
            let eventObj: Record<string, any>;
            if (this.parent.activeViewOptions.group.resources.length === 0) {
                eventObj = this.getEventCount(event, this.actionObj.start.getMonth() + i);
            } else {
                eventObj = extend({}, event, null, true) as Record<string, any>;
                endDate = this.resizeEdges.left || this.resizeEdges.right ? util.addDays(endDate, -1) : endDate;
                eventObj.count = this.getMonthDiff(event[this.parent.eventFields.startTime] as Date, endDate) + 1;
            }
            this.dynamicYearlyEventsRendering(eventObj, true);
        }
    }

    private getMonthDiff(startDate: Date, endDate: Date): number {
        let months: number;
        months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += endDate.getMonth();
        return months <= 0 ? 0 : months;
    }

    private getEventCount(eventObj: Record<string, any>, month: number): Record<string, any> {
        const eventData: Record<string, any> = extend({}, eventObj, null, true) as Record<string, any>;
        const eventStart: Date = eventData[this.parent.eventFields.startTime] as Date;
        const eventEnd: Date = eventData[this.parent.eventFields.endTime] as Date;
        const monthStart: Date = new Date(this.parent.selectedDate.getFullYear(), month, 1);
        const monthEnd: Date = util.addDays(new Date(this.parent.selectedDate.getFullYear(), month + 1, 0), 1);
        let count: number = 1;
        if (eventStart.getTime() < monthStart.getTime()) {
            eventData[this.parent.eventFields.startTime] = monthStart;
        }
        if (eventEnd.getTime() > monthEnd.getTime()) {
            eventData[this.parent.eventFields.endTime] = monthEnd;
        }
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            count = Math.ceil(((eventData[this.parent.eventFields.endTime] as Date).getTime() -
                (eventData[this.parent.eventFields.startTime] as Date).getTime()) / util.MS_PER_DAY);
        }
        eventData.count = count;
        return eventData;
    }

    private resizeStop(e: MouseEvent): void {
        EventHandler.remove(document, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeStop);
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.actionObj.action = null;
        this.removeCloneElementClasses();
        this.removeCloneElement();
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = this.parent.uiStateValues.isTapHold = false;
        const resizeArgs: ResizeEventArgs = { cancel: false, data: this.getChangedData(), element: this.actionObj.element, event: e };
        this.parent.trigger(event.resizeStop, resizeArgs, (resizeEventArgs: ResizeEventArgs) => {
            if (resizeEventArgs.cancel) {
                return;
            }
            if (this.parent.eventBase.checkOverlap(resizeEventArgs.data)) {
                return;
            }
            if (this.parent.isSpecificResourceEvents()) {
                this.parent.crudModule.crudObj.sourceEvent =
                    [this.parent.resourceBase.lastResourceLevel[parseInt(resizeEventArgs.element.getAttribute('data-group-index'), 10)]];
                this.parent.crudModule.crudObj.targetEvent = this.parent.crudModule.crudObj.sourceEvent;
                this.parent.crudModule.crudObj.isCrudAction = true;
            }
            this.saveChangedData(resizeEventArgs);
        });
    }

    private verticalResizing(isTop: boolean): void {
        let offsetValue: number = this.actionObj.clone.offsetTop;
        if (!isTop) {
            offsetValue += this.actionObj.clone.offsetHeight;
        }
        const minutes: number = (offsetValue / Math.round(this.actionObj.cellHeight)) * this.actionObj.slotInterval;
        const element: Element = this.actionObj.clone.offsetParent;
        if (isNullOrUndefined(element)) {
            return;
        }
        const resizeTime: Date = util.resetTime(this.parent.getDateFromElement(element));
        resizeTime.setHours(this.parent.activeView.getStartHour().getHours());
        resizeTime.setMinutes(minutes + this.parent.activeView.getStartHour().getMinutes());
        if (isTop) {
            this.actionObj.start = this.calculateIntervalTime(resizeTime);
        } else {
            this.actionObj.end = this.calculateIntervalTime(resizeTime);
        }
        this.updateTimePosition(resizeTime);
    }

    private horizontalResizing(isLeft: boolean): void {
        const eventStart: Date = new Date((<Date>this.actionObj.event[this.parent.eventFields.startTime]).getTime());
        const eventEnd: Date = new Date((<Date>this.actionObj.event[this.parent.eventFields.endTime]).getTime());
        let resizeTime: Date;
        let headerName: string = this.parent.currentView;
        const isTimelineMonth: boolean = this.parent.currentView === 'TimelineMonth';
        if (this.parent.activeView.isTimelineView()) {
            const tr: HTMLTableRowElement = this.parent.getContentTable().querySelector('tr') as HTMLTableRowElement;
            if (this.parent.activeViewOptions.headerRows.length > 0) {
                const rows: string[] = this.parent.activeViewOptions.headerRows.map((row: Record<string, any>) => row.option as string);
                headerName = rows.slice(-1)[0];
                if (isTimelineMonth && headerName === 'Hour') {
                    headerName = rows.slice(-2)[0] || 'Month';
                }
            }
            resizeTime = isLeft ? eventStart : eventEnd;
            let cellIndex: number = 0;
            const tdCollections: HTMLElement[] = [].slice.call(tr.children);
            let isLastCell: boolean = false;
            const pixelsPerMinute: number = this.actionObj.cellWidth / (this.parent.activeViewOptions.timeScale.interval /
                this.parent.activeViewOptions.timeScale.slotCount);
            let offset: number = parseFloat(this.parent.enableRtl ? this.actionObj.clone.style.right :
                this.actionObj.clone.style.left);
            offset = Math.round(offset / pixelsPerMinute) * pixelsPerMinute;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                let noOfDays: number = 0;
                for (const td of tdCollections) {
                    noOfDays += parseInt(td.getAttribute('colspan'), 10);
                }
                let offsetValue: number = this.parent.enableRtl ? parseInt(this.actionObj.clone.style.right, 10) :
                    parseInt(this.actionObj.clone.style.left, 10);
                offsetValue = Math.round(offsetValue / this.actionObj.cellWidth) * this.actionObj.cellWidth;
                if (!isLeft) {
                    offsetValue += (this.parent.getElementWidth(this.actionObj.clone) - this.actionObj.cellWidth);
                }
                cellIndex = !isTimelineMonth ? Math.round(offsetValue / (this.parent.getElementWidth(tr) / noOfDays)) :
                    Math.floor(offsetValue / Math.floor(this.parent.getElementWidth(tr) / noOfDays));
                cellIndex = isLeft ? cellIndex : isTimelineMonth ? cellIndex + 1 : cellIndex;
                isLastCell = cellIndex === tdCollections.length;
                cellIndex = (cellIndex < 0) ? 0 : (cellIndex >= noOfDays) ? noOfDays - 1 : cellIndex;
            } else {
                const cellWidth: number = this.actionObj.cellWidth;
                cellIndex = isLeft ? Math.round(offset / this.actionObj.cellWidth) :
                    Math.ceil((offset + (this.parent.getElementWidth(this.actionObj.clone) - cellWidth)) / this.actionObj.cellWidth);
                if (this.parent.enableRtl) {
                    const offsetWidth: number = (Math.round(offset / this.actionObj.cellWidth) *
                        this.actionObj.cellWidth) + (isLeft ? 0 : (this.parent.getElementWidth(this.actionObj.clone) -
                            this.actionObj.cellWidth));
                    cellIndex = Math.floor(offsetWidth / this.actionObj.cellWidth);
                }
                isLastCell = cellIndex === tdCollections.length;
                cellIndex = this.getIndex(cellIndex);
            }
            let resizeDate: Date;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                resizeDate = new Date(this.parent.activeView.renderDates[parseInt(cellIndex.toString(), 10)].getTime());
            } else {
                resizeDate = this.parent.getDateFromElement(<HTMLElement>tr.children[parseInt(cellIndex.toString(), 10)]);
            }
            if (['TimelineMonth', 'Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1 ||
                !this.parent.activeViewOptions.timeScale.enable) {
                resizeTime = new Date(resizeDate.setHours(resizeTime.getHours(), resizeTime.getMinutes(), resizeTime.getSeconds()));
            } else {
                if (!isLeft) {
                    offset += this.parent.getElementWidth(this.actionObj.clone);
                }
                let spanMinutes: number = Math.floor((this.actionObj.slotInterval / this.actionObj.cellWidth) *
                    (offset - Math.floor(offset / this.actionObj.cellWidth) * this.actionObj.cellWidth));
                spanMinutes = (isLastCell || (!isLeft && spanMinutes === 0)) ? this.actionObj.slotInterval : spanMinutes;
                resizeTime = new Date(resizeDate.getTime());
                resizeTime = new Date(resizeDate.getTime() + (spanMinutes * util.MS_PER_MINUTE));
                this.updateTimePosition(resizeTime);
            }
        } else {
            const cloneIndex: number = (closest(this.actionObj.clone, 'td') as HTMLTableCellElement).cellIndex;
            const originalWidth: number = Math.ceil((isLeft ? this.parent.getElementWidth(this.actionObj.element) : 0) /
                this.actionObj.cellWidth) * this.actionObj.cellWidth;
            const noOfDays: number = Math.ceil((this.parent.getElementWidth(this.actionObj.clone) - originalWidth) /
                this.actionObj.cellWidth);
            const tr: HTMLTableRowElement = closest(this.actionObj.clone, 'tr') as HTMLTableRowElement;
            let dayIndex: number = isLeft ? cloneIndex - noOfDays : cloneIndex + noOfDays - 1;
            dayIndex = this.getIndex(dayIndex);
            resizeTime = this.parent.getDateFromElement(<HTMLElement>tr.children[parseInt(dayIndex.toString(), 10)]);
            if (isLeft) {
                resizeTime.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            } else {
                resizeTime.setHours(eventEnd.getHours(), eventEnd.getMinutes(), eventEnd.getSeconds());
            }
        }
        const isNotHourSlot: boolean = ['TimelineMonth', 'Year', 'Month', 'Week', 'WorkWeek', 'Date', 'Day'].indexOf(headerName) !== -1 ||
            !this.parent.activeViewOptions.timeScale.enable;
        if (isLeft) {
            if ((eventEnd.getTime() - resizeTime.getTime()) <= 0) {
                resizeTime = isNotHourSlot ? util.resetTime(eventEnd) : eventStart;
            }
            this.actionObj.start = !isNotHourSlot ? this.calculateIntervalTime(resizeTime) : resizeTime;
        } else {
            let resizeEnd: Date = (isNotHourSlot && resizeTime.getHours() === 0 && resizeTime.getMinutes() === 0) ?
                util.addDays(resizeTime, 1) : resizeTime;
            if (isNotHourSlot && (resizeEnd.getTime() - eventStart.getTime()) <= 0) {
                resizeEnd = util.addDays(util.resetTime(eventStart), 1);
            }
            this.actionObj.end = !isNotHourSlot ? this.calculateIntervalTime(resizeEnd) : resizeEnd;
        }
    }

    private getTopBottomStyles(e: MouseEvent & TouchEvent, isTop: boolean): Record<string, any> {
        const viewElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        const slotInterval: number = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
        let clnHeight: number = isTop ? this.actionObj.element.offsetHeight + (this.actionObj.Y - this.actionObj.pageY) :
            this.actionObj.element.offsetHeight + (this.actionObj.pageY - this.actionObj.Y);
        let clnTop: number = isTop ? this.actionObj.element.offsetTop -
            (this.actionObj.Y - this.actionObj.pageY) : this.actionObj.clone.offsetTop;
        clnHeight = (clnTop < 0) ? this.actionObj.clone.offsetHeight :
            (this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight) > this.scrollArgs.height ?
                this.actionObj.clone.offsetHeight : clnHeight;
        clnTop = (clnTop < 0) ? 0 : clnTop;
        clnTop = isTop ? Math.floor(clnTop / slotInterval) * slotInterval : clnTop;
        clnHeight = clnTop + clnHeight >= viewElement.scrollHeight ? viewElement.scrollHeight - clnTop :
            Math.ceil(clnHeight / slotInterval) * slotInterval;
        if (!isTop && this.actionObj.clone.offsetTop + clnHeight >= this.parent.getContentTable().offsetHeight) {
            clnHeight = this.parent.getContentTable().offsetHeight - this.actionObj.clone.offsetTop;
        }
        const styles: Record<string, any> = {
            height: formatUnit(clnHeight < this.actionObj.cellHeight ? Math.floor(clnHeight / slotInterval) * slotInterval : clnHeight),
            top: formatUnit((clnHeight < this.actionObj.cellHeight && isTop) ? Math.ceil(clnTop / slotInterval) * slotInterval : clnTop),
            left: '0px', right: '0px', width: '100%'
        };
        return styles;
    }

    private getLeftRightStyles(e: MouseEvent & TouchEvent, isLeft: boolean): Record<string, any> {
        const styles: Record<string, any> = {};
        const isTimelineView: boolean = this.parent.activeView.isTimelineView();
        const isTimeViews: boolean = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'].indexOf(this.parent.currentView) > -1 &&
            this.parent.activeViewOptions.timeScale.enable;
        const slotInterval: number = (this.actionObj.cellWidth / this.actionObj.slotInterval) * this.actionObj.interval;
        const pageWidth: number = isLeft ? (this.actionObj.X - this.actionObj.pageX) : (this.actionObj.pageX - this.actionObj.X);
        const targetWidth: number = isTimelineView ?
            Math.round(this.parent.getElementWidth(this.actionObj.element) / this.actionObj.cellWidth) * this.actionObj.cellWidth :
            this.parent.currentView === 'Month' ? this.parent.getElementWidth(this.actionObj.element) :
                Math.ceil(this.parent.getElementWidth(this.actionObj.element) / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        let offsetWidth: number = targetWidth + (Math.ceil(pageWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth);
        let left: number = (this.parent.enableRtl) ? parseInt(this.actionObj.element.style.right, 10) : this.actionObj.clone.offsetLeft;
        left = Math.round(left / slotInterval) * slotInterval;
        if (isTimeViews) {
            offsetWidth = targetWidth + (Math.ceil(pageWidth / slotInterval) * slotInterval);
            if (!isLeft) {
                const roundedLeft: string = (+parseFloat(this.actionObj.element.style[this.parent.enableRtl ? 'right' : 'left'])).toFixed(1);
                const roundedWidth: number = Math.round(targetWidth / slotInterval) * slotInterval;
                if (roundedLeft !== left.toFixed(1) || roundedWidth !== targetWidth) {
                    offsetWidth = (Math.round((left + offsetWidth) / slotInterval) * slotInterval) - left;
                }
            }
            this.actionObj.event[this.parent.eventFields.isAllDay] = false;
        }
        let width: number = !isLeft && (Math.floor(offsetWidth + this.actionObj.clone.offsetLeft) > this.scrollArgs.width) ?
            this.parent.getElementWidth(this.actionObj.clone) : (offsetWidth < this.actionObj.cellWidth) ? offsetWidth : offsetWidth;
        if (this.parent.enableRtl) {
            let rightValue: number = isTimelineView ? parseInt(this.actionObj.element.style.right, 10) :
                -(offsetWidth - this.actionObj.cellWidth);
            rightValue = isTimelineView ? rightValue : isLeft ? 0 : rightValue > 0 ? 0 : rightValue;
            if (isTimelineView && !isLeft) {
                rightValue = Math.round(rightValue / slotInterval) * slotInterval;
                rightValue = rightValue - (Math.ceil((this.actionObj.pageX - this.actionObj.X) / slotInterval) * slotInterval);
                if (rightValue < 0) {
                    rightValue = parseInt(this.actionObj.clone.style.right, 10);
                    width = parseInt(this.actionObj.clone.style.width, 10);
                }
            }
            rightValue = rightValue >= this.scrollArgs.width ? this.scrollArgs.width - this.actionObj.cellWidth : rightValue;
            styles.right = formatUnit(rightValue);
            width = width + rightValue > this.scrollArgs.width ? this.parent.getElementWidth(this.actionObj.clone) : width;
        } else {
            let offsetLeft: number = isLeft ? this.actionObj.element.offsetLeft - (this.actionObj.X - this.actionObj.pageX) :
                this.parent.enableRtl ? this.actionObj.element.offsetLeft : 0;
            if (isTimelineView) {
                offsetLeft = isLeft ? offsetLeft : parseInt(this.actionObj.clone.style.left, 10);
                if (this.parent.enableRtl) {
                    offsetLeft = !isLeft ? (this.actionObj.pageX < this.actionObj.X - this.parent.getElementWidth(this.actionObj.clone))
                        ? parseInt(this.actionObj.clone.style.right, 10) : offsetLeft : offsetLeft;
                } else {
                    offsetLeft = isLeft ? (this.actionObj.pageX > this.actionObj.X + this.parent.getElementWidth(this.actionObj.clone) &&
                    this.parent.getElementWidth(this.actionObj.clone) === this.actionObj.cellWidth) ?
                        parseInt(this.actionObj.clone.style.left, 10) : offsetLeft : offsetLeft;
                }
            }
            const leftValue: number = offsetLeft;
            offsetLeft = isTimelineView ? isTimeViews ? isLeft ? this.actionObj.element.offsetLeft -
                (Math.ceil((this.actionObj.element.offsetLeft - offsetLeft) / slotInterval) * slotInterval) : offsetLeft :
                Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth :
                Math.ceil(Math.abs(offsetLeft) / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            if (offsetLeft < 0) {
                if (isTimelineView && isLeft && (offsetLeft % slotInterval)) {
                    offsetLeft = parseInt(this.actionObj.clone.style.left, 10);
                    width = parseInt(this.actionObj.clone.style.width, 10);
                } else {
                    offsetLeft = 0;
                    width = this.parent.getElementWidth(this.actionObj.clone);
                }
            }
            const cloneWidth: number = Math.ceil(this.parent.getElementWidth(this.actionObj.clone) / this.actionObj.cellWidth) *
                this.actionObj.cellWidth;
            if (isLeft) {
                styles.left = formatUnit(isTimelineView ? offsetLeft : isLeft ? leftValue < 0 ? -offsetLeft :
                    (Math.ceil((targetWidth - cloneWidth) / this.actionObj.cellWidth) * this.actionObj.cellWidth) : offsetLeft);
            }
        }
        width = Math.floor(width);
        styles.width = formatUnit(width);
        return styles;
    }

    private resizeValidation(e: MouseEvent & TouchEvent): boolean {
        const pages: (MouseEvent & TouchEvent) | Touch = this.parent.eventBase.getPageCoordinates(e);
        const viewDimension: Record<string, any> = this.getContentAreaDimension();
        const isTimeScale: boolean = this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.timeScale.enable;
        let cellWidth: number = this.actionObj.cellWidth;
        let resizeValidation: boolean = false;
        if (this.resizeEdges.left) {
            if (pages.pageX < viewDimension.leftOffset && pages.pageX >= viewDimension.left && isTimeScale) {
                cellWidth = 0;
            }
            resizeValidation = (pages.pageX - cellWidth) >= viewDimension.left;

        }
        if (this.resizeEdges.right) {
            if (pages.pageX > viewDimension.rightOffset && pages.pageX <= viewDimension.right && isTimeScale) {
                cellWidth = 0;
            }
            resizeValidation = (pages.pageX + cellWidth) <= viewDimension.right;
        }
        if (this.resizeEdges.top) {
            resizeValidation = this.actionObj.clone.offsetTop >= viewDimension.top;
        }
        if (this.resizeEdges.bottom) {
            resizeValidation = (this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight) <= this.scrollArgs.height;
        }
        return resizeValidation;
    }

    /**
     * Get module name
     *
     * @returns {string} Returns the module name..
     */
    protected getModuleName(): string {
        return 'resize';
    }

}
