import { addClass, Browser, EventHandler, closest, extend, formatUnit, setStyleAttribute, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getElement, isBlazor } from '@syncfusion/ej2-base';
import { ResizeEventArgs } from '../base/interface';
import { ActionBase } from '../actions/action-base';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import { MonthEvent } from '../event-renderer/month';

/**
 * Schedule events resize actions
 */
export class Resize extends ActionBase {
    public wireResizeEvent(element: HTMLElement): void {
        let resizeElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.' + cls.EVENT_RESIZE_CLASS));
        resizeElement.forEach((element: HTMLElement) => EventHandler.add(element, Browser.touchStartEvent, this.resizeStart, this));
    }

    private resizeHelper(): void {
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.activeViewOptions.group.allowGroupEdit) {
            this.actionObj.originalElement.forEach((element: HTMLElement, index: number) => {
                let cloneElement: HTMLElement = this.createCloneElement(element);
                this.actionObj.cloneElement[index] = cloneElement;
                if (this.actionObj.element === element) {
                    this.actionObj.clone = cloneElement;
                }
            });
        } else {
            this.actionObj.clone = this.createCloneElement(this.actionObj.element);
            this.actionObj.cloneElement = [this.actionObj.clone];
            this.actionObj.originalElement = [this.actionObj.element];
        }
    }

    private resizeStart(e: MouseEvent & TouchEvent): void {
        this.actionObj.action = 'resize';
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        let resizeTarget: HTMLElement = closest(e.target as Element, '.' + cls.EVENT_RESIZE_CLASS) as HTMLElement;
        this.actionObj.element = closest(resizeTarget, '.' + cls.APPOINTMENT_CLASS) as HTMLElement;
        this.actionObj.event = this.parent.eventBase.getEventByGuid(this.actionObj.element.getAttribute('data-guid')) as
            { [key: string]: Object };
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let resizeArgs: ResizeEventArgs = {
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
            if (isBlazor()) {
                if (resizeEventArgs.element) {
                    resizeEventArgs.element = getElement(resizeEventArgs.element);
                }
                (resizeEventArgs.data[this.parent.eventFields.startTime] as Date) = this.parent.getDateTime(
                    (resizeEventArgs.data[this.parent.eventFields.startTime] as Date));
                (resizeEventArgs.data[this.parent.eventFields.endTime] as Date) = this.parent.getDateTime(
                    (resizeEventArgs.data[this.parent.eventFields.endTime] as Date));
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
            let workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
            this.actionObj.cellWidth = workCell.offsetWidth;
            this.actionObj.cellHeight = workCell.offsetHeight;
            let headerRows: string[] = this.parent.activeViewOptions.headerRows.map((row: { [key: string]: Object }) =>
                row.option as string);
            if (this.parent.activeView.isTimelineView() && headerRows.length > 0 &&
                ['Date', 'Hour'].indexOf(headerRows.slice(-1)[0]) < 0) {
                let tr: HTMLTableRowElement = this.parent.getContentTable().querySelector('tr') as HTMLTableRowElement;
                let noOfDays: number = 0;
                let tdCollections: HTMLElement[] = [].slice.call(tr.children);
                tdCollections.forEach((td: HTMLElement) => noOfDays += parseInt(td.getAttribute('colspan'), 10));
                this.actionObj.cellWidth = tr.offsetWidth / noOfDays;
                this.actionObj.cellHeight = tr.offsetHeight;
            }
            let pages: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
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
            let viewElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
            this.scrollArgs = { element: viewElement, width: viewElement.scrollWidth, height: viewElement.scrollHeight };
            EventHandler.add(document, Browser.touchMoveEvent, this.resizing, this);
            EventHandler.add(document, Browser.touchEndEvent, this.resizeStop, this);
        });
    }

    private resizing(e: MouseEvent & TouchEvent): void {
        this.parent.quickPopup.quickPopupHide();
        if (this.parent.element.querySelectorAll('.' + cls.RESIZE_CLONE_CLASS).length === 0) {
            this.resizeHelper();
        }
        if ((!isNullOrUndefined(e.target)) && (e.target as HTMLElement).classList.contains(cls.DISABLE_DATES)) {
            return;
        }
        let pages: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
        this.actionObj.pageX = pages.pageX;
        this.actionObj.pageY = pages.pageY;
        this.updateScrollPosition(e);
        this.updateResizingDirection(e);
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        let resizeArgs: ResizeEventArgs = {
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
        if (this.parent.currentView === 'Month') {
            this.monthResizing();
            return;
        }
        let resizeValidation: boolean = this.resizeValidation(e);
        if (this.resizeEdges.left) {
            if (resizeValidation) {
                let leftStyles: { [key: string]: Object } = this.getLeftRightStyles(e, true);
                for (let cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, leftStyles);
                    addClass([cloneElement], cls.LEFT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(!this.parent.enableRtl);
        }
        if (this.resizeEdges.right) {
            if (resizeValidation) {
                let rightStyles: { [key: string]: Object } = this.getLeftRightStyles(e, false);
                for (let cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, rightStyles);
                    addClass([cloneElement], cls.RIGHT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(this.parent.enableRtl);
        }
        if (this.resizeEdges.top) {
            if (resizeValidation) {
                let topStyles: { [key: string]: Object } = this.getTopBottomStyles(e, true);
                for (let cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, topStyles);
                    addClass([cloneElement], cls.TOP_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(true);
        }
        if (this.resizeEdges.bottom) {
            if (resizeValidation) {
                let bottomStyles: { [key: string]: Object } = this.getTopBottomStyles(e, false);
                for (let cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, bottomStyles);
                    addClass([cloneElement], cls.BOTTOM_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(false);
        }
    }

    private monthResizing(): void {
        this.removeCloneElement();
        let td: HTMLTableCellElement = document.elementFromPoint(this.actionObj.pageX, this.actionObj.pageY) as HTMLTableCellElement;
        if (isNullOrUndefined(td)) {
            return;
        }
        let resizeTime: Date = this.parent.getDateFromElement(td);
        let isSameCell: boolean = this.parent.activeViewOptions.group.resources.length > 0 ?
            parseInt(td.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex : true;
        let startTime: Date = new Date((<Date>this.actionObj.event[this.parent.eventFields.startTime]).getTime());
        let endTime: Date = new Date((<Date>this.actionObj.event[this.parent.eventFields.endTime]).getTime());
        if ((!this.parent.enableRtl && this.resizeEdges.left) || (this.parent.enableRtl && this.resizeEdges.right)) {
            startTime = resizeTime;
        } else if ((!this.parent.enableRtl && this.resizeEdges.right) || (this.parent.enableRtl && this.resizeEdges.left)) {
            endTime = util.addDays(resizeTime, 1);
        }
        if (isSameCell && startTime < endTime) {
            this.actionObj.start = startTime;
            this.actionObj.end = endTime;
            let event: { [key: string]: Object } = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
            this.dynamicEventsRendering(event);
            this.updateOriginalElement(this.actionObj.clone);
        }
    }

    private resizeStop(e: MouseEvent): void {
        EventHandler.remove(document, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeStop);
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.removeCloneElementClasses();
        this.removeCloneElement();
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = false;
        let resizeArgs: ResizeEventArgs = { cancel: false, data: this.getChangedData(), element: this.actionObj.element, event: e };
        this.parent.trigger(event.resizeStop, resizeArgs, (resizeEventArgs: ResizeEventArgs) => {
            if (resizeEventArgs.cancel) {
                return;
            }
            this.saveChangedData(resizeEventArgs);
        });
    }

    private verticalResizing(isTop: boolean): void {
        let offsetValue: number = this.actionObj.clone.offsetTop;
        if (!isTop) {
            offsetValue += this.actionObj.clone.offsetHeight;
        }
        let minutes: number = (offsetValue / this.actionObj.cellHeight) * this.actionObj.slotInterval;
        let element: Element = this.actionObj.clone.offsetParent;
        if (isNullOrUndefined(element)) {
            return;
        }
        let resizeTime: Date = util.resetTime(this.parent.getDateFromElement(element));
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
        let eventStart: Date = new Date((<Date>this.actionObj.event[this.parent.eventFields.startTime]).getTime());
        let eventEnd: Date = new Date((<Date>this.actionObj.event[this.parent.eventFields.endTime]).getTime());
        let resizeTime: Date;
        if (this.parent.activeView.isTimelineView()) {
            let tr: HTMLTableRowElement = this.parent.getContentTable().querySelector('tr') as HTMLTableRowElement;
            let headerName: string = this.parent.currentView;
            if (this.parent.activeViewOptions.headerRows.length > 0) {
                let rows: string[] = this.parent.activeViewOptions.headerRows.map((row: { [key: string]: Object }) => row.option as string);
                headerName = rows.slice(-1)[0];
                if (this.parent.currentView === 'TimelineMonth' && headerName === 'Hour') {
                    headerName = rows.slice(-2)[0] || 'Month';
                }
            }
            resizeTime = isLeft ? eventStart : eventEnd;
            let cellIndex: number = 0;
            let tdCollections: HTMLElement[] = [].slice.call(tr.children);
            let isLastCell: boolean = false;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                let noOfDays: number = 0;
                tdCollections.forEach((td: HTMLElement) => noOfDays += parseInt(td.getAttribute('colspan'), 10));
                let offsetValue: number = this.parent.enableRtl ? parseInt(this.actionObj.clone.style.right, 10) :
                    parseInt(this.actionObj.clone.style.left, 10);
                if (!isLeft) {
                    offsetValue += (this.actionObj.clone.offsetWidth - this.actionObj.cellWidth);
                }
                cellIndex = Math.floor(offsetValue / Math.floor((<HTMLElement>tr).offsetWidth / noOfDays));
                cellIndex = isLeft ? cellIndex : this.parent.currentView === 'TimelineMonth' ? cellIndex + 1 : cellIndex;
                isLastCell = cellIndex === tdCollections.length;
                cellIndex = (cellIndex < 0) ? 0 : (cellIndex >= noOfDays) ? noOfDays - 1 : cellIndex;
            } else {
                let cellWidth: number = this.parent.currentView === 'TimelineMonth' || !this.parent.activeViewOptions.timeScale.enable ?
                    this.actionObj.cellWidth : this.actionObj.cellWidth - (this.actionObj.interval *
                        (this.actionObj.cellWidth / this.actionObj.slotInterval));
                cellIndex = isLeft ? Math.floor(this.actionObj.clone.offsetLeft / this.actionObj.cellWidth) :
                    Math.ceil((this.actionObj.clone.offsetLeft + (this.actionObj.clone.offsetWidth - cellWidth)) /
                        this.actionObj.cellWidth);
                if (this.parent.enableRtl) {
                    let cellOffsetWidth: number = 0;
                    if (headerName === 'TimelineMonth' || (!this.parent.activeViewOptions.timeScale.enable &&
                        this.parent.currentView !== 'TimelineMonth')) {
                        cellOffsetWidth = this.actionObj.cellWidth;
                    }
                    let offsetWidth: number = (Math.floor(parseInt(this.actionObj.clone.style.right, 10) / this.actionObj.cellWidth) *
                        this.actionObj.cellWidth) + (isLeft ? 0 : this.actionObj.clone.offsetWidth - cellOffsetWidth);
                    cellIndex = Math.floor(offsetWidth / this.actionObj.cellWidth);
                }
                isLastCell = cellIndex === tdCollections.length;
                cellIndex = this.getIndex(cellIndex);
            }
            let resizeDate: Date;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                resizeDate = new Date(this.parent.activeView.renderDates[cellIndex].getTime());
            } else {
                resizeDate = this.parent.getDateFromElement(<HTMLElement>tr.children[cellIndex]);
            }
            if (['TimelineMonth', 'Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1 ||
                !this.parent.activeViewOptions.timeScale.enable) {
                resizeTime = new Date(resizeDate.setHours(resizeTime.getHours(), resizeTime.getMinutes(), resizeTime.getSeconds()));
            } else {
                let offsetValue: number = this.parent.enableRtl ? parseFloat(this.actionObj.clone.style.right) :
                    parseFloat(this.actionObj.clone.style.left);
                if (!isLeft) {
                    offsetValue += this.actionObj.clone.offsetWidth;
                }
                let spanMinutes: number = Math.ceil((this.actionObj.slotInterval / this.actionObj.cellWidth) *
                    (offsetValue - Math.floor(offsetValue / this.actionObj.cellWidth) * this.actionObj.cellWidth));
                spanMinutes = isLastCell ? this.actionObj.slotInterval : spanMinutes;
                resizeTime = new Date(resizeDate.getTime());
                resizeTime.setMinutes(resizeTime.getMinutes() + spanMinutes);
                this.updateTimePosition(resizeTime);
            }
        } else {
            let cloneIndex: number = (closest(this.actionObj.clone, 'td') as HTMLTableCellElement).cellIndex;
            let originalWidth: number = Math.ceil((isLeft ? this.actionObj.element.offsetWidth : 0) / this.actionObj.cellWidth) *
                this.actionObj.cellWidth;
            let noOfDays: number = Math.ceil((this.actionObj.clone.offsetWidth - originalWidth) / this.actionObj.cellWidth);
            let tr: HTMLTableRowElement = closest(this.actionObj.clone, 'tr') as HTMLTableRowElement;
            let dayIndex: number = isLeft ? cloneIndex - noOfDays : cloneIndex + noOfDays - 1;
            dayIndex = this.getIndex(dayIndex);
            resizeTime = this.parent.getDateFromElement(<HTMLElement>tr.children[dayIndex]);
            if (isLeft) {
                resizeTime.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            } else {
                resizeTime.setHours(eventEnd.getHours(), eventEnd.getMinutes(), eventEnd.getSeconds());
            }
        }
        if (isLeft) {
            this.actionObj.start = this.parent.activeViewOptions.timeScale.enable ? this.calculateIntervalTime(resizeTime) : resizeTime;
        } else {
            let isTimeViews: boolean = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'].indexOf(this.parent.currentView) > -1 &&
                this.parent.activeViewOptions.timeScale.enable;
            let resizeEnd: Date = (!isTimeViews && resizeTime.getHours() === 0 && resizeTime.getMinutes() === 0) ?
                util.addDays(resizeTime, 1) : resizeTime;
            this.actionObj.end = this.parent.activeViewOptions.timeScale.enable && this.parent.currentView !== 'Month' ?
                this.calculateIntervalTime(resizeEnd) : resizeEnd;
        }
    }

    private getTopBottomStyles(e: MouseEvent & TouchEvent, isTop: boolean): { [key: string]: Object } {
        let viewElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let slotInterval: number = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
        let clnHeight: number = isTop ? this.actionObj.element.offsetHeight + (this.actionObj.Y - this.actionObj.pageY) :
            this.actionObj.element.offsetHeight + (this.actionObj.pageY - this.actionObj.Y);
        let clnTop: number = isTop ? this.actionObj.element.offsetTop -
            (this.actionObj.Y - this.actionObj.pageY) : this.actionObj.clone.offsetTop;
        clnHeight = (clnTop < 0) ? this.actionObj.clone.offsetHeight :
            (this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight) > this.scrollArgs.height ?
                this.actionObj.clone.offsetHeight : clnHeight;
        clnTop = (clnTop < 0) ? 0 : clnTop;
        clnTop = Math.floor(clnTop / slotInterval) * slotInterval;
        clnHeight = clnTop + clnHeight >= viewElement.scrollHeight ? viewElement.scrollHeight - clnTop :
            Math.ceil(clnHeight / slotInterval) * slotInterval;
        let styles: { [key: string]: Object } = {
            height: formatUnit(clnHeight < this.actionObj.cellHeight ? this.actionObj.cellHeight : clnHeight),
            top: formatUnit((clnHeight < this.actionObj.cellHeight && isTop) ? this.actionObj.clone.offsetTop : clnTop),
            left: '0px', right: '0px', width: '100%'
        };
        return styles;
    }

    private getLeftRightStyles(e: MouseEvent & TouchEvent, isLeft: boolean): { [key: string]: Object } {
        let styles: { [key: string]: Object } = {};
        let isTimelineView: boolean = this.parent.activeView.isTimelineView();
        let isTimeViews: boolean = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'].indexOf(this.parent.currentView) > -1 &&
            this.parent.activeViewOptions.timeScale.enable;
        let slotInterval: number = (this.actionObj.cellWidth / this.actionObj.slotInterval) * this.actionObj.interval;
        let pageWidth: number = isLeft ? (this.actionObj.X - this.actionObj.pageX) : (this.actionObj.pageX - this.actionObj.X);
        let targetWidth: number = isTimelineView ?
            (this.actionObj.element.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth :
            this.parent.currentView === 'Month' ? this.actionObj.element.offsetWidth :
                Math.ceil(this.actionObj.element.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        let offsetWidth: number = targetWidth + (Math.ceil(pageWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth);
        let left: number = (this.parent.enableRtl) ? parseInt(this.actionObj.element.style.right, 10) : this.actionObj.clone.offsetLeft;
        if (isTimeViews) {
            offsetWidth = targetWidth + (Math.ceil(pageWidth / slotInterval) * slotInterval);
            offsetWidth = (Math.ceil((left + offsetWidth) / slotInterval) * slotInterval) - left;
            this.actionObj.event[this.parent.eventFields.isAllDay] = false;
        }
        let width: number = !isLeft && ((offsetWidth + this.actionObj.clone.offsetLeft > this.scrollArgs.width)) ?
            this.actionObj.clone.offsetWidth : (offsetWidth < this.actionObj.cellWidth) ? this.actionObj.cellWidth : offsetWidth;
        if (this.parent.enableRtl) {
            let rightValue: number = isTimelineView ? parseInt(this.actionObj.element.style.right, 10) :
                -(offsetWidth - this.actionObj.cellWidth);
            rightValue = isTimelineView ? rightValue : isLeft ? 0 : rightValue > 0 ? 0 : rightValue;
            if (isTimelineView && !isLeft) {
                rightValue = Math.ceil((this.actionObj.element.offsetLeft + (this.actionObj.element.offsetWidth +
                    (this.actionObj.pageX - this.actionObj.X))) / slotInterval) * slotInterval;
                rightValue = rightValue < 0 ? Math.abs(rightValue) : -rightValue;
            }
            rightValue = rightValue >= this.scrollArgs.width ? this.scrollArgs.width - this.actionObj.cellWidth : rightValue;
            styles.right = formatUnit(rightValue);
            width = width + rightValue > this.scrollArgs.width ? this.actionObj.clone.offsetWidth : width;
        } else {
            let offsetLeft: number = isLeft ? this.actionObj.element.offsetLeft - (this.actionObj.X - this.actionObj.pageX) :
                this.parent.enableRtl ? this.actionObj.element.offsetLeft : 0;
            if (isTimelineView) {
                offsetLeft = isLeft ? offsetLeft : parseInt(this.actionObj.clone.style.left, 10);
                if (this.parent.enableRtl) {
                    offsetLeft = !isLeft ? (this.actionObj.pageX < this.actionObj.X - this.actionObj.clone.offsetWidth) ?
                        parseInt(this.actionObj.clone.style.right, 10) : offsetLeft : offsetLeft;
                } else {
                    offsetLeft = isLeft ? (this.actionObj.pageX > this.actionObj.X + this.actionObj.clone.offsetWidth &&
                        this.actionObj.clone.offsetWidth === this.actionObj.cellWidth) ?
                        parseInt(this.actionObj.clone.style.left, 10) : offsetLeft : offsetLeft;
                }
            }
            let leftValue: number = offsetLeft;
            offsetLeft = isTimelineView ? isTimeViews ? isLeft ? Math.floor(offsetLeft / slotInterval) * slotInterval : offsetLeft :
                Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth :
                Math.ceil(Math.abs(offsetLeft) / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            if (offsetLeft < 0) {
                offsetLeft = 0;
                width = this.actionObj.clone.offsetWidth;
            }
            let cloneWidth: number = Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            if (isLeft) {
                styles.left = formatUnit(isTimelineView ? offsetLeft : isLeft ? leftValue < 0 ? -offsetLeft :
                    (Math.ceil((targetWidth - cloneWidth) / this.actionObj.cellWidth) * this.actionObj.cellWidth) : offsetLeft);
            }
        }
        styles.width = formatUnit(width);
        return styles;
    }

    private resizeValidation(e: MouseEvent & TouchEvent): boolean {
        let pages: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
        let viewDimension: { [key: string]: Object } = this.getContentAreaDimension();
        let resizeValidation: boolean = false;
        if (this.resizeEdges.left) {
            resizeValidation = (pages.pageX - this.actionObj.cellWidth) >= viewDimension.left;
        }
        if (this.resizeEdges.right) {
            resizeValidation = (pages.pageX + this.actionObj.cellWidth) <= viewDimension.right;
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
     * Get module name.
     */
    protected getModuleName(): string {
        return 'resize';
    }
}