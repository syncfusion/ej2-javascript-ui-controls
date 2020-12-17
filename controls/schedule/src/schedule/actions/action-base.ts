import { addClass, createElement, extend, isNullOrUndefined, closest, setStyleAttribute } from '@syncfusion/ej2-base';
import { formatUnit, remove, removeClass, isBlazor } from '@syncfusion/ej2-base';
import { ActionBaseArgs, ResizeEdges, DragEventArgs, ResizeEventArgs, TdData } from '../base/interface';
import { Schedule } from '../base/schedule';
import { CurrentAction } from '../base/type';
import { MonthEvent } from '../event-renderer/month';
import { VerticalEvent } from '../event-renderer/vertical-view';
import { YearEvent } from '../event-renderer/year';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * Base class for the common drag and resize related actions
 */

export class ActionBase {
    public parent: Schedule;
    public actionObj: ActionBaseArgs;
    public resizeEdges: ResizeEdges;
    public scrollArgs: ActionBaseArgs;
    public scrollEdges: ResizeEdges;
    public monthEvent: MonthEvent;
    public verticalEvent: VerticalEvent;
    public yearEvent: YearEvent;
    public daysVariation: number = 0;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.actionObj = {
            X: 0, Y: 0, groupIndex: 0, cellWidth: 0, cellHeight: 0, slotInterval: 0, interval: 0, actionIndex: 0,
            cloneElement: [], originalElement: [], action: null, isAllDay: null, excludeSelectors: null,
            index: 0, navigationInterval: null, scrollInterval: null
        };
        this.scrollArgs = { element: null, width: 0, height: 0 };
        this.resizeEdges = { left: false, right: false, top: false, bottom: false };
        this.scrollEdges = { left: false, right: false, top: false, bottom: false };
    }

    public getChangedData(): { [key: string]: Object } {
        let eventObj: { [key: string]: Object } = extend({}, this.actionObj.event, null, true) as { [key: string]: Object };
        eventObj[this.parent.eventFields.startTime] = this.actionObj.start;
        eventObj[this.parent.eventFields.endTime] = this.actionObj.end;
        if (!isNullOrUndefined(this.actionObj.isAllDay)) {
            eventObj[this.parent.eventFields.isAllDay] = this.actionObj.isAllDay;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let originalElement: HTMLElement[] = this.getOriginalElement(this.actionObj.element);
            let indexCol: number[] = originalElement.map((element: HTMLElement) => parseInt(element.getAttribute('data-group-index'), 10));
            if (indexCol.indexOf(this.actionObj.groupIndex) === -1) {
                let cloneIndex: number = parseInt(this.actionObj.clone.getAttribute('data-group-index'), 10);
                indexCol = indexCol.filter((index: number) => index !== cloneIndex);
                indexCol.push(this.actionObj.groupIndex);
                this.parent.resourceBase.getResourceData(eventObj, this.actionObj.groupIndex, indexCol);
            }
        }
        return eventObj;
    }

    public saveChangedData(eventArgs: DragEventArgs | ResizeEventArgs): void {
        this.parent.activeEventData.event = this.actionObj.event;
        this.parent.currentAction = 'Save';
        if (isBlazor()) {
            (eventArgs.data[this.parent.eventFields.startTime] as Date) = this.parent.getDateTime(
                (eventArgs.data[this.parent.eventFields.startTime] as Date));
            (eventArgs.data[this.parent.eventFields.endTime] as Date) = this.parent.getDateTime(
                (eventArgs.data[this.parent.eventFields.endTime] as Date));
        }
        let eventObj: { [key: string]: Object } = eventArgs.data;
        let isSameResource: boolean = (this.parent.activeViewOptions.group.resources.length > 0) ?
            parseInt(this.actionObj.element.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex : true;
        if (+eventObj[this.parent.eventFields.startTime] === +this.actionObj.event[this.parent.eventFields.startTime] &&
            +eventObj[this.parent.eventFields.endTime] === +this.actionObj.event[this.parent.eventFields.endTime] && isSameResource) {
            return;
        }
        let currentAction: CurrentAction;
        if (eventObj[this.parent.eventFields.recurrenceRule]) {
            let eveId: number = <number>eventObj[this.parent.eventFields.recurrenceID] || <number>eventObj[this.parent.eventFields.id];
            if (eventObj[this.parent.eventFields.id] === eventObj[this.parent.eventFields.recurrenceID]) {
                eventObj[this.parent.eventFields.id] = this.parent.eventBase.getEventMaxID();
                currentAction = 'EditOccurrence';
            }
            if (this.parent.enableRecurrenceValidation
                && this.parent.eventWindow.editOccurrenceValidation(eveId, eventObj, this.actionObj.event)) {
                this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                return;
            }
        }
        if (eventObj[this.parent.eventFields.startTimezone] || eventObj[this.parent.eventFields.endTimezone]) {
            this.parent.eventBase.timezoneConvert(eventObj);
        }
        this.parent.crudModule.saveEvent(eventObj, currentAction);
    }

    public calculateIntervalTime(date: Date): Date {
        let intervalTime: Date = new Date(+date);
        intervalTime.setMinutes(Math.floor(intervalTime.getMinutes() / this.actionObj.interval) * this.actionObj.interval);
        return intervalTime;
    }

    public getContentAreaDimension(): { [key: string]: Object } {
        let viewElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let trElement: HTMLElement[] = [].slice.call(viewElement.querySelector('tr').children);
        if (!this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.isAdaptive) {
            trElement = this.getResourceElements(trElement as HTMLTableCellElement[]);
        }
        let leftOffset: ClientRect = trElement[0].getBoundingClientRect();
        let rightOffset: ClientRect = trElement.slice(-1)[0].getBoundingClientRect();
        let viewDimension: { [key: string]: Object } = {
            bottom: viewElement.scrollHeight - 5,
            left: this.parent.enableRtl ? rightOffset.left : leftOffset.left,
            right: this.parent.enableRtl ? leftOffset.right : rightOffset.right,
            top: 0
        };
        return viewDimension;
    }

    public getPageCoordinates(e: MouseEvent & TouchEvent): (MouseEvent & TouchEvent) | Touch {
        let eventArgs: TouchEvent = (e as { [key: string]: Object } & MouseEvent & TouchEvent).event as TouchEvent;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            (<MouseEvent & TouchEvent>eventArgs) || e;
    }

    public getIndex(index: number): number {
        let contentElements: HTMLTableCellElement[] = [].slice.call(this.parent.getContentTable().querySelector('tr').children);
        let indexes: { [key: string]: number } = { minIndex: 0, maxIndex: contentElements.length - 1 };
        if (this.actionObj.action === 'resize' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive && !this.parent.activeView.isTimelineView()) {
            let groupElements: HTMLTableCellElement[] = this.getResourceElements(contentElements);
            indexes.minIndex = groupElements[0].cellIndex;
            indexes.maxIndex = groupElements.slice(-1)[0].cellIndex;
        }
        if (index < indexes.minIndex) {
            index = indexes.minIndex;
        }
        if (index > indexes.maxIndex) {
            index = indexes.maxIndex;
        }
        return index;
    }

    public updateTimePosition(date: Date): void {
        for (let cloneElement of this.actionObj.cloneElement) {
            let timeElement: Element = cloneElement.querySelector('.' + cls.APPOINTMENT_TIME);
            if (timeElement) {
                timeElement.innerHTML = this.parent.getTimeString(this.actionObj.start) + ' - ' +
                    this.parent.getTimeString(this.actionObj.end);
            }
        }
        if (!this.parent.activeViewOptions.timeScale.enable || !this.parent.isAdaptive || this.parent.currentView === 'Month' ||
            this.parent.currentView === 'TimelineMonth') {
            return;
        }
        let timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CLONE_TIME_INDICATOR_CLASS) as HTMLElement;
        if (!timeIndicator) {
            timeIndicator = createElement('div', { className: cls.CLONE_TIME_INDICATOR_CLASS });
            let wrapperClass: string = this.parent.activeView.isTimelineView() ? cls.DATE_HEADER_WRAP_CLASS : cls.TIME_CELLS_WRAP_CLASS;
            this.parent.element.querySelector('.' + wrapperClass).appendChild(timeIndicator);
        }
        timeIndicator.innerHTML = this.parent.getTimeString(date);
        let offsetValue: number = 0;
        if (this.parent.activeView.isTimelineView()) {
            if (this.parent.enableRtl) {
                let rightValue: number = parseInt(this.actionObj.clone.style.right, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    rightValue + this.actionObj.clone.offsetWidth : rightValue;
                timeIndicator.style.right = formatUnit(offsetValue);
            } else {
                let leftValue: number = parseInt(this.actionObj.clone.style.left, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    leftValue : leftValue + this.actionObj.clone.offsetWidth;
                timeIndicator.style.left = formatUnit(offsetValue);
            }
        } else {
            offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.top ? this.actionObj.clone.offsetTop :
                this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight;
            timeIndicator.style.top = formatUnit(offsetValue);
        }
    }

    public getResourceElements(table: HTMLTableCellElement[]): HTMLTableCellElement[] {
        return table.filter((element: HTMLTableCellElement) =>
            parseInt(element.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex);
    }

    public getOriginalElement(element: HTMLElement): HTMLElement[] {
        let originalElement: HTMLElement[];
        let guid: string = element.getAttribute('data-guid');
        let isMorePopup: boolean = element.offsetParent && element.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS);
        if (isMorePopup || this.parent.activeView.isTimelineView()) {
            originalElement = [].slice.call(this.parent.element.querySelectorAll('[data-guid="' + guid + '"]'));
        } else {
            let tr: HTMLElement = closest(element, 'tr') as HTMLElement;
            originalElement = [].slice.call(tr.querySelectorAll('[data-guid="' + guid + '"]'));
        }
        return originalElement;
    }

    public createCloneElement(element: HTMLElement): HTMLElement {
        let cloneWrapper: HTMLElement = createElement('div', { innerHTML: element.outerHTML });
        let cloneElement: HTMLElement = cloneWrapper.children[0] as HTMLElement;
        let cloneClassLists: string[] = [cls.CLONE_ELEMENT_CLASS];
        cloneClassLists.push((this.actionObj.action === 'drag') ? cls.DRAG_CLONE_CLASS : cls.RESIZE_CLONE_CLASS);
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'TimelineMonth') {
            cloneClassLists.push(cls.MONTH_CLONE_ELEMENT_CLASS);
        }
        addClass([cloneElement], cloneClassLists);
        addClass([element], cls.EVENT_ACTION_CLASS);
        if (!isNullOrUndefined(element.parentElement)) {
            element.parentElement.appendChild(cloneElement);
        }
        cloneElement.style.width = formatUnit(cloneElement.offsetWidth - 2);
        if (this.parent.eventDragArea && this.actionObj.action === 'drag') {
            document.querySelector(this.parent.eventDragArea).appendChild(cloneElement);
        }
        setStyleAttribute(cloneElement, { border: '0px' });
        return cloneElement;
    }

    public removeCloneElementClasses(): void {
        let elements: HTMLElement[] = this.actionObj.originalElement;
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'TimelineYear') {
            elements = [].slice.call(this.parent.element.querySelectorAll('.' + cls.EVENT_ACTION_CLASS));
        }
        removeClass(elements, cls.EVENT_ACTION_CLASS);
    }

    public removeCloneElement(): void {
        this.actionObj.originalElement = [];
        for (let cloneElement of this.actionObj.cloneElement) {
            if (!isNullOrUndefined(cloneElement.parentNode)) { remove(cloneElement); }
        }
        this.actionObj.cloneElement = [];
        let timeIndicator: Element = this.parent.element.querySelector('.' + cls.CLONE_TIME_INDICATOR_CLASS);
        if (timeIndicator) {
            remove(timeIndicator);
        }
    }

    public getCursorElement(e: MouseEvent & TouchEvent): HTMLElement {
        let pages: (MouseEvent & TouchEvent) | Touch = this.getPageCoordinates(e);
        return document.elementFromPoint(pages.clientX, pages.clientY) as HTMLElement;
    }

    public autoScroll(): void {
        let parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let yIsScrollable: boolean = parent.offsetHeight <= parent.scrollHeight;
        let xIsScrollable: boolean = parent.offsetWidth <= parent.scrollWidth;
        let yInBounds: boolean = yIsScrollable && parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
        let xInBounds: boolean = xIsScrollable && parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
        if (yInBounds && (this.scrollEdges.top || this.scrollEdges.bottom)) {
            parent.scrollTop += this.scrollEdges.top ? -this.actionObj.scroll.scrollBy : this.actionObj.scroll.scrollBy;
            if (this.actionObj.action === 'resize') {
                if (parent.scrollHeight !== parent.offsetHeight + parent.scrollTop && parent.scrollTop > 0) {
                    this.actionObj.Y += this.scrollEdges.top ? this.actionObj.scroll.scrollBy : -this.actionObj.scroll.scrollBy;
                }
            }
        }
        if (xInBounds && (this.scrollEdges.left || this.scrollEdges.right)) {
            parent.scrollLeft += this.scrollEdges.left ? -this.actionObj.scroll.scrollBy : this.actionObj.scroll.scrollBy;
            if (this.actionObj.action === 'resize') {
                if (parent.scrollWidth !== parent.offsetWidth + parent.scrollLeft && parent.scrollLeft > 0) {
                    this.actionObj.X += this.scrollEdges.left ? this.actionObj.scroll.scrollBy : -this.actionObj.scroll.scrollBy;
                }
            }
        }
    }

    public autoScrollValidation(e: MouseEvent & TouchEvent): boolean {
        if (!this.actionObj.scroll.enable) {
            return false;
        }
        let res: ResizeEdges = this.parent.boundaryValidation(this.actionObj.pageY, this.actionObj.pageX);
        this.scrollEdges = res;
        return res.bottom || res.top || res.left || res.right;
    }

    public actionClass(type: string): void {
        if (type === 'addClass') {
            addClass([this.parent.element], cls.EVENT_ACTION_CLASS);
        } else {
            removeClass([this.parent.element], cls.EVENT_ACTION_CLASS);
        }
    }

    public updateScrollPosition(e: MouseEvent & TouchEvent): void {
        if (this.actionObj.scroll.enable && isNullOrUndefined(this.actionObj.scrollInterval)) {
            this.actionObj.scrollInterval = window.setInterval(
                () => {
                    if (this.autoScrollValidation(e) && !this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                        if (this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0
                            && this.actionObj.groupIndex < 0) {
                            return;
                        }
                        this.autoScroll();
                        if (this.actionObj.action === 'drag') {
                            this.parent.dragAndDropModule.updateDraggingDateTime(e);
                        } else {
                            this.parent.resizeModule.updateResizingDirection(e);
                        }
                    }
                },
                this.actionObj.scroll.timeDelay);
        }
    }

    public updateOriginalElement(cloneElement: HTMLElement): void {
        let query: string = '[data-id="' + cloneElement.getAttribute('data-id') + '"]';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            query = query.concat('[data-group-index = "' + cloneElement.getAttribute('data-group-index') + '"]');
        }
        let elements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(query));
        addClass(elements, cls.EVENT_ACTION_CLASS);
        let eventWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CLONE_ELEMENT_CLASS));
        removeClass(eventWrappers, cls.EVENT_ACTION_CLASS);
    }

    public getUpdatedEvent(startTime: Date, endTime: Date, eventObj: { [key: string]: Object }): { [key: string]: Object } {
        let event: { [key: string]: Object } = JSON.parse(JSON.stringify(eventObj));
        event[this.parent.eventFields.startTime] = startTime;
        event[this.parent.eventFields.endTime] = endTime;
        return event;
    }

    public dynamicYearlyEventsRendering(event: { [key: string]: Object }, isResize: boolean = false): void {
        let appWidth: number = this.actionObj.cellWidth - 7;
        if (isResize && (this.resizeEdges.left || this.resizeEdges.right)) {
            appWidth = this.actionObj.cellWidth * (event.count as number);
        }
        if (!isResize && (
            this.parent.activeViewOptions.orientation === 'Horizontal' && this.parent.activeViewOptions.group.resources.length === 0)) {
            let month: number = (event[this.parent.eventFields.startTime] as Date).getMonth();
            let eventObj: { [key: string]: Object } = this.yearEvent.isSpannedEvent(event as { [key: string]: Object }, month);
            if ((eventObj[this.parent.eventFields.startTime] as Date).getTime() ===
                (eventObj[this.parent.eventFields.endTime] as Date).getTime()) {
                (<{ [key: string]: number }>eventObj.isSpanned).count = 1;
            }
            appWidth = (<{ [key: string]: number }>eventObj.isSpanned).count * this.actionObj.cellWidth;
        }
        let appointmentElement: HTMLElement = this.createAppointmentElement(this.actionObj.groupIndex);
        appointmentElement.setAttribute('drag', 'true');
        addClass([appointmentElement], cls.CLONE_ELEMENT_CLASS);
        setStyleAttribute(appointmentElement, {
            'width': appWidth + 'px', 'border': '0px', 'pointer-events': 'none',
            'position': 'absolute', 'overflow': 'hidden', 'padding': '3px'
        });
        if (this.actionObj.clone.style.backgroundColor !== '') {
            setStyleAttribute(appointmentElement, { 'backgroundColor': this.actionObj.clone.style.backgroundColor });
        }
        let date: number = util.addLocalOffset(util.resetTime(event[this.parent.eventFields.startTime] as Date)).getTime();
        let query: string = '.' + cls.WORK_CELLS_CLASS + '[data-date="' + date + '"]';
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            query = '.' + cls.WORK_CELLS_CLASS + '[data-date="' + date + '"][data-group-index="' + this.actionObj.groupIndex + '"]';
        }
        let cellTd: Element = this.parent.element.querySelector(query);
        if (isResize) {
            let dateHeader: HTMLElement = cellTd.querySelector('.' + cls.DATE_HEADER_CLASS) as HTMLElement;
            let appHeight: number = this.actionObj.cellHeight * (event.count as number) -
                (dateHeader ? dateHeader.offsetHeight : 0) - 7;
            if (this.resizeEdges.right || this.resizeEdges.left) {
                appHeight = parseInt(this.actionObj.clone.style.height, 10);
            }
            setStyleAttribute(appointmentElement, { 'height': appHeight + 'px' });
        }
        this.renderDynamicElement(cellTd, appointmentElement, true);
        this.actionObj.cloneElement.push(appointmentElement);
    }

    public renderDynamicElement(cellTd: HTMLElement | Element, element: HTMLElement, isAppointment: boolean = false): void {
        if (cellTd.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS)) {
            cellTd.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS).appendChild(element);
        } else {
            let wrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(element);
            cellTd.appendChild(wrapper);
        }
    }

    public createAppointmentElement(resIndex: number): HTMLElement {
        let appDetails: HTMLElement = this.actionObj.clone.querySelector('.e-appointment-details') ?
            this.actionObj.clone.querySelector('.e-appointment-details') : this.actionObj.clone.querySelector('.e-subject');
        let appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            innerHTML: appDetails.innerText
        });
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        return appointmentWrapper;
    }

    public dynamicEventsRendering(event: { [key: string]: Object }): void {
        let dateRender: Date[] = this.parent.activeView.renderDates;
        let workCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
        let workDays: number[] = this.parent.activeViewOptions.workDays;
        let groupOrder: string[];
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let resources: TdData[] = this.parent.resourceBase.lastResourceLevel.
                filter((res: TdData) => res.groupIndex === this.actionObj.groupIndex);
            dateRender = resources[0].renderDates;
            let elementSelector: string = `.${cls.WORK_CELLS_CLASS}[data-group-index="${this.actionObj.groupIndex}"]`;
            workCells = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
            workDays = resources[0].workDays;
            groupOrder = resources[0].groupOrder;
        }
        this.monthEvent.dateRender = dateRender;
        this.monthEvent.getSlotDates(workDays);
        let eventWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CLONE_ELEMENT_CLASS));
        for (let wrapper of eventWrappers) {
            remove(wrapper);
        }
        let splittedEvents: { [key: string]: Object }[] = this.monthEvent.splitEvent(event, dateRender);
        for (let event of splittedEvents) {
            let day: number = this.parent.getIndexOfDate(dateRender, util.resetTime(event[this.monthEvent.fields.startTime] as Date));
            let diffInDays: number = (event.data as { [key: string]: Object }).count as number;
            let appWidth: number = (diffInDays * this.actionObj.cellWidth) - 7;
            let appointmentElement: HTMLElement = this.monthEvent.createAppointmentElement(event, this.actionObj.groupIndex, true);
            appointmentElement.setAttribute('drag', 'true');
            addClass([appointmentElement], cls.CLONE_ELEMENT_CLASS);
            this.monthEvent.applyResourceColor(appointmentElement, event, 'backgroundColor', groupOrder);
            setStyleAttribute(appointmentElement, { 'width': appWidth + 'px', 'border': '0px', 'pointer-events': 'none' });
            let cellTd: Element = workCells[day];
            this.monthEvent.renderElement(cellTd, appointmentElement, true);
            this.actionObj.cloneElement.push(appointmentElement);
        }
    }

    /**
     * To destroy the action base module. 
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.actionObj = {};
        this.scrollArgs = {};
        this.resizeEdges = { left: false, right: false, top: false, bottom: false };
        this.scrollEdges = { left: false, right: false, top: false, bottom: false };
    }
}