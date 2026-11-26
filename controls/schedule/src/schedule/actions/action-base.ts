/* eslint-disable @typescript-eslint/no-explicit-any */
import { addClass, createElement, extend, isNullOrUndefined, closest, setStyleAttribute } from '@syncfusion/ej2-base';
import { formatUnit, remove, removeClass } from '@syncfusion/ej2-base';
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
    private fixedScrollTarget: HTMLElement = null;
    public monthEvent: MonthEvent;
    public verticalEvent: VerticalEvent;
    public yearEvent: YearEvent;
    public daysVariation: number = 0;
    private scrollEventArgs: MouseEvent & TouchEvent;

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

    public getChangedData(multiData?: Record<string, any>[]): Record<string, any> {
        const eventObj: Record<string, any> = extend({}, this.actionObj.event, null, true) as Record<string, any>;
        eventObj[this.parent.eventFields.startTime] = this.actionObj.start;
        eventObj[this.parent.eventFields.endTime] = this.actionObj.end;
        if (!isNullOrUndefined(this.actionObj.isAllDay)) {
            eventObj[this.parent.eventFields.isAllDay] = this.actionObj.isAllDay;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            const originalElement: HTMLElement[] = this.getOriginalElement(this.actionObj.element);
            if (originalElement) {
                let indexCol: number[] = originalElement.map((element: HTMLElement) => parseInt(element.getAttribute('data-group-index'), 10));
                if (indexCol.indexOf(this.actionObj.groupIndex) === -1 || (!isNullOrUndefined(multiData) && multiData.length > 0)) {
                    const cloneIndex: number = parseInt(this.actionObj.clone.getAttribute('data-group-index'), 10);
                    indexCol = indexCol.filter((index: number) => index !== cloneIndex);
                    indexCol.push(this.actionObj.groupIndex);
                    if (multiData && multiData.length > 0) {
                        multiData.forEach((data: Record<string, any>) => {
                            this.parent.resourceBase.getResourceData(data, this.actionObj.groupIndex, indexCol);
                        });
                    } else {
                        this.parent.resourceBase.getResourceData(eventObj, this.actionObj.groupIndex, indexCol);
                    }
                }
            }
        }
        return eventObj;
    }

    public saveChangedData(eventArgs: DragEventArgs | ResizeEventArgs, isMultiSelect: boolean = false): void {
        this.parent.activeEventData.event = this.actionObj.event;
        this.parent.currentAction = 'Save';
        let currentAction: CurrentAction;
        let eventsCollection: Record<string, any>[] = [eventArgs.data];
        if (isMultiSelect) {
            eventsCollection = (eventArgs as DragEventArgs).selectedData;
        }
        for (const eventObj of eventsCollection) {
            const isSameResource: boolean = (this.parent.activeViewOptions.group.resources.length > 0) ?
                parseInt(this.actionObj.element.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex : true;
            if (+eventObj[this.parent.eventFields.startTime] === +this.actionObj.event[this.parent.eventFields.startTime] &&
                +eventObj[this.parent.eventFields.endTime] === +this.actionObj.event[this.parent.eventFields.endTime] && isSameResource) {
                this.parent.crudModule.crudObj.isCrudAction = false;
                return;
            }

            if (eventObj[this.parent.eventFields.recurrenceRule]) {
                const eveId: number = (eventObj[this.parent.eventFields.recurrenceID] || eventObj[this.parent.eventFields.id]) as number;
                if (eventObj[this.parent.eventFields.id] === eventObj[this.parent.eventFields.recurrenceID]) {
                    eventObj[this.parent.eventFields.id] = this.parent.eventBase.getEventMaxID();
                    currentAction = 'EditOccurrence';
                }
                if (this.parent.enableRecurrenceValidation
                    && this.parent.eventWindow.editOccurrenceValidation(eveId, eventObj, this.actionObj.event)) {
                    return;
                }
            } else {
                currentAction = null;
            }
            if (eventObj[this.parent.eventFields.startTimezone] || eventObj[this.parent.eventFields.endTimezone]) {
                this.parent.eventBase.timezoneConvert(eventObj);
            }
            this.parent.crudModule.saveEvent(eventObj, currentAction);
        }
    }

    public calculateIntervalTime(date: Date): Date {
        let dateInMS: number = util.resetTime(date).getTime();
        const startHour: Date = this.parent.activeView.getStartHour();
        const intervalInMS: number = util.MS_PER_MINUTE * this.actionObj.interval;
        dateInMS += (startHour.getHours() * 60 + startHour.getMinutes()) * util.MS_PER_MINUTE + startHour.getSeconds() * 1000;
        dateInMS = dateInMS + Math.floor((date.getTime() - dateInMS) / intervalInMS) * intervalInMS;
        return new Date(dateInMS);
    }

    /**
     * The first row of the content table can be a group summary row, whose merged cells do not map to work cell indexes.
     *
     * @param {HTMLElement} root Accepts the optional content root.
     * @returns {HTMLTableRowElement} Returns the first row that holds work cells.
     * @private
     */
    public getFirstWorkRow(root?: HTMLElement): HTMLTableRowElement {
        if (this.parent.groupSummaryModule && !root) {
            return this.parent.groupSummaryModule.getFirstWorkRow();
        }
        const rows: HTMLTableRowElement[] = [].slice.call((root || this.parent.getContentTable()).querySelectorAll('tr'));
        return rows.filter((row: HTMLTableRowElement) => !row.classList.contains(cls.GROUP_SUMMARY_ROW_CLASS))[0] || rows[0];
    }

    public getContentAreaDimension(): Record<string, any> {
        const viewElement: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        let trElement: HTMLElement[] = [].slice.call(this.getFirstWorkRow(viewElement).children);
        if (!this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.isAdaptive && !this.parent.enableAdaptiveUI && !this.parent.virtualScrollModule) {
            trElement = this.getResourceElements(trElement as HTMLTableCellElement[]);
        }
        const leftOffset: ClientRect = trElement[0].getBoundingClientRect();
        const rightOffset: ClientRect = trElement.slice(-1)[0].getBoundingClientRect();
        const viewDimension: Record<string, any> = {
            bottom: viewElement.scrollHeight - 5,
            left: this.parent.enableRtl ? rightOffset.left : leftOffset.left,
            right: this.parent.enableRtl ? leftOffset.right : rightOffset.right,
            top: 0,
            leftOffset: this.parent.enableRtl ? rightOffset.right : leftOffset.right,
            rightOffset: this.parent.enableRtl ? leftOffset.left : rightOffset.left
        };
        return viewDimension;
    }

    public getIndex(index: number): number {
        const contentElements: HTMLTableCellElement[] = [].slice.call(this.getFirstWorkRow().children);
        const indexes: { [key: string]: number } = { minIndex: 0, maxIndex: contentElements.length - 1 };
        if (this.actionObj.action === 'resize' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive && !this.parent.activeView.isTimelineView()) {
            const groupElements: HTMLTableCellElement[] = this.getResourceElements(contentElements);
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

    /**
     * Exact mode: the cursor decides the time, so the clone text and the tooltip show the interaction values continuously.
     *
     * @param {MouseEvent} e - Specifies the current pointer event; the tooltip is placed by it like for any other event tooltip.
     * @returns {void}
     */
    public updateExactFeedback(e?: MouseEvent & TouchEvent): void {
        if (!(this.parent.eventBase.isExactDayCellView() || this.parent.eventBase.isExactGroupedYear()) ||
            isNullOrUndefined(this.actionObj.start) || isNullOrUndefined(this.actionObj.end)) {
            return;
        }
        this.updateCloneTimes();
        if (this.parent.eventTooltip && this.parent.eventSettings.enableTooltip) {
            this.parent.eventTooltip.showInteraction(
                this.actionObj.element, this.actionObj.start, this.actionObj.end,
                e);
        }
    }

    private updateCloneTimes(): void {
        const startText: string = this.parent.getTimeString(this.actionObj.start);
        const endText: string = this.parent.getTimeString(this.actionObj.end);
        const clones: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CLONE_ELEMENT_CLASS));
        for (const clone of clones) {
            const subject: Element = clone.querySelector('.' + cls.SUBJECT_CLASS);
            for (const timeEle of [].slice.call(clone.querySelectorAll('.' + cls.APPOINTMENT_TIME)) as HTMLElement[]) {
                if (timeEle.textContent.indexOf(' - ') > -1) {
                    timeEle.innerHTML = startText + ' - ' + endText;
                } else if (subject && (timeEle.compareDocumentPosition(subject) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                    timeEle.innerHTML = startText;
                } else {
                    timeEle.innerHTML = endText;
                }
            }
        }
    }

    public endExactFeedback(): void {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.endInteraction();
        }
    }

    public updateTimePosition(date: Date, multiData?: Record<string, any>[]): void {
        let index: number = 0;
        for (const cloneElement of this.actionObj.cloneElement) {
            const timeElement: Element = cloneElement.querySelector('.' + cls.APPOINTMENT_TIME);
            if (timeElement) {
                let startTime: Date = this.actionObj.start;
                let endTime: Date = this.actionObj.end;
                if (multiData && multiData.length > 0) {
                    startTime = multiData[parseInt(index.toString(), 10)][this.parent.eventFields.startTime] as Date;
                    endTime = multiData[parseInt(index.toString(), 10)][this.parent.eventFields.endTime] as Date;
                }
                timeElement.innerHTML = this.parent.getTimeString(startTime) + ' - ' +
                    this.parent.getTimeString(endTime);
            }
            index++;
        }
        if (!this.parent.activeViewOptions.timeScale.enable || !this.parent.isAdaptive || this.parent.currentView === 'Month' ||
            this.parent.currentView === 'TimelineMonth') {
            return;
        }
        let timeIndicator: HTMLElement = this.parent.element.querySelector('.' + cls.CLONE_TIME_INDICATOR_CLASS) as HTMLElement;
        if (!timeIndicator) {
            timeIndicator = createElement('div', { className: cls.CLONE_TIME_INDICATOR_CLASS });
            const wrapperClass: string = this.parent.activeView.isTimelineView() ? cls.DATE_HEADER_WRAP_CLASS : cls.TIME_CELLS_WRAP_CLASS;
            this.parent.element.querySelector('.' + wrapperClass).appendChild(timeIndicator);
        }
        timeIndicator.innerHTML = this.parent.getTimeString(date);
        let offsetValue: number = 0;
        if (this.parent.activeView.isTimelineView()) {
            if (this.parent.enableRtl) {
                const rightValue: number = parseInt(this.actionObj.clone.style.right, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    rightValue + this.actionObj.clone.offsetWidth : rightValue;
                timeIndicator.style.right = formatUnit(offsetValue);
            } else {
                const leftValue: number = parseInt(this.actionObj.clone.style.left, 10);
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
        const guid: string = element.getAttribute('data-guid');
        const isMorePopup: boolean = element.offsetParent && element.offsetParent.classList.contains(cls.MORE_EVENT_POPUP_CLASS);
        if (isMorePopup || this.parent.activeView.isTimelineView() || (this.actionObj.action !== 'resize' && this.parent.virtualScrollModule)) {
            originalElement = [].slice.call(this.parent.element.querySelectorAll('[data-guid="' + guid + '"]'));
        } else {
            const tr: HTMLElement = closest(element, 'tr') as HTMLElement;
            if (tr) {
                originalElement = [].slice.call(tr.querySelectorAll('[data-guid="' + guid + '"]'));
            }
        }
        return originalElement;
    }

    public createCloneElement(element: HTMLElement): HTMLElement {
        const cloneWrapper: HTMLElement = document.createElement('div');
        cloneWrapper.appendChild(element.cloneNode(true));
        const cloneElement: HTMLElement = cloneWrapper.children[0] as HTMLElement;
        const cloneClassLists: string[] = [cls.CLONE_ELEMENT_CLASS];
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
        const dragElement: HTMLElement = document.querySelector(this.parent.eventDragArea);
        if (this.parent.eventDragArea && this.actionObj.action === 'drag' && dragElement) {
            dragElement.appendChild(cloneElement);
        }
        setStyleAttribute(cloneElement, { border: '0px' });
        return cloneElement;
    }

    public removeCloneElementClasses(): void {
        let elements: HTMLElement[] = this.actionObj.originalElement;
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'TimelineYear' ||
            this.parent.currentView === 'Day' || this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek') {
            elements = [].slice.call(this.parent.element.querySelectorAll('.' + cls.EVENT_ACTION_CLASS));
        }
        removeClass(elements, cls.EVENT_ACTION_CLASS);
    }

    public removeCloneElement(): void {
        this.actionObj.originalElement = [];
        const dynamicEle: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-dynamic-clone'));
        for (const cloneEle of dynamicEle) {
            remove(cloneEle);
        }
        for (const cloneElement of this.actionObj.cloneElement) {
            if (!isNullOrUndefined(cloneElement.parentNode)) { remove(cloneElement); }
        }
        this.actionObj.cloneElement = [];
        const timeIndicator: Element = this.parent.element.querySelector('.' + cls.CLONE_TIME_INDICATOR_CLASS);
        if (timeIndicator) {
            remove(timeIndicator);
        }
    }

    public removeDragResizeClones(): void {
        const eventWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CLONE_ELEMENT_CLASS));
        for (const wrapper of eventWrappers) {
            remove(wrapper);
        }
    }

    public getCursorElement(e: MouseEvent & TouchEvent): HTMLElement {
        const pages: (MouseEvent & TouchEvent) | Touch = this.parent.eventBase.getPageCoordinates(e);
        return document.elementFromPoint(pages.clientX, pages.clientY) as HTMLElement;
    }

    public autoScroll(): void {
        const parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        const vertical: HTMLElement = this.fixedScrollTarget || parent;
        const yIsScrollable: boolean = vertical.offsetHeight <= vertical.scrollHeight;
        const xIsScrollable: boolean = parent.offsetWidth <= parent.scrollWidth;
        const yInBounds: boolean = yIsScrollable && vertical.scrollTop >= 0 &&
            vertical.scrollTop + vertical.offsetHeight <= vertical.scrollHeight;
        let xInBounds: boolean = xIsScrollable && parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
        if (this.actionObj.action === 'resize' && this.scrollEdges.right && (parent.scrollLeft + parent.offsetWidth) > parent.scrollWidth) {
            const tdCollections: number = ([].slice.call(this.getFirstWorkRow().children)).length - 1;
            const cellIndex: number = Math.ceil((this.actionObj.clone.offsetLeft + (this.actionObj.clone.offsetWidth)) /
                this.actionObj.cellWidth);
            xInBounds = cellIndex === tdCollections;
        }
        if (yInBounds && (this.scrollEdges.top || this.scrollEdges.bottom)) {
            vertical.scrollTop += this.scrollEdges.top ? -this.actionObj.scroll.scrollBy : this.actionObj.scroll.scrollBy;
            if (this.actionObj.action === 'resize') {
                if (vertical.scrollHeight !== vertical.offsetHeight + vertical.scrollTop && vertical.scrollTop > 0) {
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

    public autoScrollValidation(): boolean {
        if (!this.actionObj.scroll.enable) {
            return false;
        }
        const res: ResizeEdges = this.parent.boundaryValidation(this.actionObj.pageY, this.actionObj.pageX);
        this.fixedScrollTarget = this.parent.fixedRowsModule ?
            this.parent.fixedRowsModule.adjustScrollEdges(this.actionObj.pageY, this.actionObj.pageX, res) : null;
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
        this.scrollEventArgs = e;
        if (this.actionObj.scroll.enable && isNullOrUndefined(this.actionObj.scrollInterval)) {
            this.actionObj.scrollInterval = window.setInterval(
                () => {
                    if (this.autoScrollValidation() && !this.actionObj.clone.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS)) {
                        if (this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0
                            && this.actionObj.groupIndex < 0) {
                            return;
                        }
                        this.autoScroll();
                        if (this.actionObj.action === 'drag') {
                            this.parent.dragAndDropModule.updateDraggingDateTime(this.scrollEventArgs);
                        } else {
                            this.parent.resizeModule.updateResizingDirection(this.scrollEventArgs);
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
        if (cloneElement.hasAttribute('data-guid')) {
            query += '[data-guid="' + cloneElement.getAttribute('data-guid') + '"]';
        }
        const elements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(query));
        addClass(elements, cls.EVENT_ACTION_CLASS);
        const eventWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CLONE_ELEMENT_CLASS));
        removeClass(eventWrappers, cls.EVENT_ACTION_CLASS);
    }

    public getUpdatedEvent(startTime: Date, endTime: Date, eventObj: Record<string, any>): Record<string, any> {
        const event: Record<string, any> = JSON.parse(JSON.stringify(eventObj));
        event[this.parent.eventFields.startTime] = startTime;
        event[this.parent.eventFields.endTime] = endTime;
        return event;
    }

    public dynamicYearlyEventsRendering(event: Record<string, any>, isResize: boolean = false, segmentDate?: Date): void {
        if (!isNullOrUndefined(this.parent.eventDragArea)) {
            return;
        }
        let appWidth: number = this.actionObj.cellWidth - 7;
        if (isResize && (this.resizeEdges.left || this.resizeEdges.right)) {
            appWidth = this.actionObj.cellWidth * (event.count as number);
        }
        if (!isResize && (
            this.parent.activeViewOptions.orientation === 'Horizontal' && this.parent.activeViewOptions.group.resources.length === 0)) {
            const eventObj: Record<string, any> = this.yearEvent.isSpannedEvent(event, event[this.parent.eventFields.startTime]);
            if ((eventObj[this.parent.eventFields.startTime] as Date).getTime() ===
                (eventObj[this.parent.eventFields.endTime] as Date).getTime()) {
                (<{ [key: string]: number }>eventObj.isSpanned).count = 1;
            }
            appWidth = (<{ [key: string]: number }>eventObj.isSpanned).count * this.actionObj.cellWidth;
        }
        if (!isResize && this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length !== 0) {
            const eventObj: Record<string, any> = this.yearEvent.isSpannedEvent(event, event[this.parent.eventFields.startTime]);
            appWidth = eventObj.isSpanned.count * this.actionObj.cellWidth;
        }
        const appointmentElement: HTMLElement =
            this.createAppointmentElement(this.actionObj.groupIndex, event[this.parent.eventFields.subject] as string);
        appointmentElement.setAttribute('drag', 'true');
        addClass([appointmentElement], cls.CLONE_ELEMENT_CLASS);
        if ((this.parent.eventBase.isExactGroupedYear() || this.parent.eventBase.isExactDayCellView()) &&
            !isNullOrUndefined(this.actionObj.start) && !isNullOrUndefined(this.actionObj.end) &&
            !event[this.parent.eventFields.isAllDay]) {
            // Timeline year hides the time of its bars; in Exact mode the user needs it to see where the cursor places the event
            const timeElement: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME,
                innerHTML: this.parent.getTimeString(this.actionObj.start) + ' - ' + this.parent.getTimeString(this.actionObj.end)
            });
            // the bar of a resize keeps the height of the original event, so the time stays on the subject line to remain visible
            setStyleAttribute(timeElement, { 'display': 'inline-block', 'margin-left': '6px' });
            appointmentElement.appendChild(timeElement);
        }
        setStyleAttribute(appointmentElement, {
            'width': appWidth + 'px', 'border': '0px', 'pointer-events': 'none',
            'position': 'absolute', 'overflow': 'hidden', 'padding': '3px'
        });
        const eventGuid: string = event.Guid as string;
        if (eventGuid) {
            const originalElement: HTMLElement = this.parent.element.querySelector(
                `[data-guid="${eventGuid}"]`
            ) as HTMLElement;
            if (originalElement && originalElement.style.backgroundColor) {
                setStyleAttribute(appointmentElement, { 'backgroundColor': originalElement.style.backgroundColor });
            }
        }
        const eventStart: Date = event[this.parent.eventFields.startTime] as Date;
        // grouped Timeline year cells are months, and an Exact drop keeps the day of month
        const monthSource: Date = segmentDate || eventStart;
        const date: number = this.parent.eventBase.isExactGroupedYear() ?
            new Date(monthSource.getFullYear(), monthSource.getMonth(), 1).getTime() : util.resetTime(monthSource).getTime();
        let query: string = '.' + cls.WORK_CELLS_CLASS + '[data-date="' + date + '"]';
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            query = '.' + cls.WORK_CELLS_CLASS + '[data-date="' + date + '"][data-group-index="' + this.actionObj.groupIndex + '"]';
        }
        const cellTd: Element = this.parent.element.querySelector(query);
        if (isNullOrUndefined(cellTd)) {
            return;
        }
        if (isResize) {
            const dateHeader: HTMLElement = cellTd.querySelector('.' + cls.DATE_HEADER_CLASS) as HTMLElement;
            let appHeight: number = this.actionObj.cellHeight * (event.count as number) -
                (dateHeader ? dateHeader.offsetHeight : 0) - 7;
            if (this.resizeEdges.right || this.resizeEdges.left) {
                appHeight = parseInt(this.actionObj.clone.style.height, 10);
            }
            setStyleAttribute(appointmentElement, { 'height': appHeight + 'px' });
        }
        // ungrouped horizontal drag keeps its single one-row clone (original height) but takes the Exact offset and width of the saved bar
        const isUngroupedHorizontalDrag: boolean = !isResize && !segmentDate && this.parent.eventBase.isExactDayCellView() &&
            this.parent.activeViewOptions.orientation === 'Horizontal' && this.parent.activeViewOptions.group.resources.length === 0;
        if (this.parent.eventBase.isExactGroupedYear() || ((isResize || segmentDate) && this.parent.eventBase.isExactDayCellView()) ||
            isUngroupedHorizontalDrag) {
            const geometry: Record<string, number> = this.yearEvent.getDragGeometry(event, this.actionObj.cellWidth, segmentDate);
            if (geometry) {
                // the clone is absolutely positioned against the content wrap, so its offset starts at the column of the hovered cell:
                // month columns when vertical, resource columns when horizontal
                const base: number = (cellTd as HTMLTableCellElement).cellIndex * this.actionObj.cellWidth;
                setStyleAttribute(appointmentElement, { 'width': geometry.width + 'px' });
                appointmentElement.style[this.parent.enableRtl ? 'right' : 'left'] = (base + geometry.offset) + 'px';
            }
        }
        this.renderDynamicElement(cellTd, appointmentElement, true);
        this.actionObj.cloneElement.push(appointmentElement);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public renderDynamicElement(cellTd: HTMLElement | Element, element: HTMLElement, isAppointment: boolean = false): void {
        if (cellTd.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS)) {
            cellTd.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS).appendChild(element);
        } else {
            const wrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(element);
            cellTd.appendChild(wrapper);
        }
    }

    public createAppointmentElement(resIndex: number, innerText: string): HTMLElement {
        const appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            innerHTML: innerText
        });
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        return appointmentWrapper;
    }

    public dynamicEventsRendering(event: Record<string, any>): void {
        if (!isNullOrUndefined(this.parent.eventDragArea)) {
            return;
        }
        let dateRender: Date[] = this.parent.activeView.renderDates;
        let workCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
        let workDays: number[] = this.parent.activeViewOptions.workDays;
        let groupOrder: string[];
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            const renderedResource: TdData[] = this.parent.virtualScrollModule && this.parent.virtualScrollModule.isHorizontalScroll ?
                this.parent.resourceBase.renderedResources : this.parent.resourceBase.lastResourceLevel;
            const resources: TdData[] = renderedResource.
                filter((res: TdData) => res.groupIndex === this.actionObj.groupIndex);
            dateRender = resources[0].renderDates;
            const elementSelector: string = `.${cls.WORK_CELLS_CLASS}[data-group-index="${this.actionObj.groupIndex}"]`;
            workCells = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
            workDays = resources[0].workDays;
            groupOrder = resources[0].groupOrder;
        }
        this.monthEvent.dateRender = dateRender;
        this.monthEvent.getSlotDates(workDays);
        if (this.resizeEdges.left || this.resizeEdges.right) {
            this.removeDragResizeClones();
        }
        const spannedEvents: Record<string, any>[] = this.monthEvent.splitEvent(event, dateRender);
        for (const event of spannedEvents) {
            const day: number = this.parent.getIndexOfDate(dateRender, util.resetTime(event[this.monthEvent.fields.startTime] as Date));
            const diffInDays: number = (event.data as Record<string, any>).count as number;
            let appWidth: number = (diffInDays * this.actionObj.cellWidth) - 7;
            let appOffset: number = 0;
            if (this.parent.currentView === 'Month' && this.parent.eventBase.isExactDayCellView()) {
                const rowLength: number = (this.monthEvent.slots[0] as any as number[]).length;
                const geometry: Record<string, any> = this.monthEvent.getExactGeometry(
                    event, this.actionObj.cellWidth, rowLength - (day % rowLength));
                appOffset = geometry.offset as number;
                appWidth = (geometry.width as number) - (geometry.endsAtEdge ? 7 : 0);
            }
            const appointmentElement: HTMLElement = this.monthEvent.createAppointmentElement(event, this.actionObj.groupIndex, true);
            appointmentElement.setAttribute('drag', 'true');
            addClass([appointmentElement], cls.CLONE_ELEMENT_CLASS);
            this.monthEvent.applyResourceColor(appointmentElement, event, 'backgroundColor', groupOrder);
            setStyleAttribute(appointmentElement, { 'width': appWidth + 'px', 'border': '0px', 'pointer-events': 'none' });
            if (appOffset > 0) {
                appointmentElement.style[this.parent.enableRtl ? 'right' : 'left'] = appOffset + 'px';
            }
            const eventGuid: string = event.Guid as string;
            if (eventGuid) {
                const originalElement: HTMLElement = this.parent.element.querySelector(
                    `[data-guid="${eventGuid}"]`
                ) as HTMLElement;
                if (originalElement && originalElement.style.backgroundColor) {
                    setStyleAttribute(appointmentElement, { 'backgroundColor': originalElement.style.backgroundColor });
                }
            }
            const cellTd: Element = workCells[parseInt(day.toString(), 10)];
            if (cellTd) {
                this.monthEvent.renderElement(cellTd, appointmentElement, true);
                this.actionObj.cloneElement.push(appointmentElement);
            }
        }
    }

    public yearEventsRendering(event: Record<string, any>): void {
        this.removeDragResizeClones();
        if (this.parent.eventBase.isExactDayCellView() && this.parent.activeViewOptions.orientation === 'Vertical' &&
            this.parent.activeViewOptions.group.resources.length === 0) {
            this.verticalYearExactRendering(event);
            return;
        }
        if (this.parent.eventBase.isExactGroupedYear() && this.parent.activeViewOptions.orientation === 'Horizontal') {
            this.groupedYearExactRendering(event);
            return;
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

    /**
     * Draws the resize preview of grouped horizontal Timeline year in Exact mode: one segment per month row, like the saved bar.
     *
     * @param {Record<string, any>} event - Specifies the event with the previewed start and end.
     * @returns {void}
     */
    public groupedYearExactRendering(event: Record<string, any>): void {
        const start: Date = event[this.parent.eventFields.startTime] as Date;
        const end: Date = event[this.parent.eventFields.endTime] as Date;
        const lastMonth: Date = new Date(end.getFullYear(), end.getMonth(), 1);
        const segment: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
        segment.count = 1;
        for (let month: Date = new Date(start.getFullYear(), start.getMonth(), 1); month.getTime() <= lastMonth.getTime();
            month = util.addMonths(month, 1)) {
            this.dynamicYearlyEventsRendering(segment, true, month);
        }
    }

    /**
     * Draws the resize preview of ungrouped vertical Timeline year in Exact mode: one segment per day row, with the
     * same offset and width as the saved bar (REQ-PLACE-009).
     *
     * @param {Record<string, any>} event - Specifies the event with the previewed start and end.
     * @returns {void}
     */
    public verticalYearExactRendering(event: Record<string, any>): void {
        const start: Date = event[this.parent.eventFields.startTime] as Date;
        const end: Date = event[this.parent.eventFields.endTime] as Date;
        const lastDay: number = util.resetTime(new Date(end.getTime() - 1)).getTime();
        for (let day: Date = util.resetTime(new Date(start.getTime())); day.getTime() <= lastDay; day = util.addDays(day, 1)) {
            this.dynamicYearlyEventsRendering(event, true, day);
        }
    }

    /**
     * Gets the number of months between two dates.
     *
     * @param {Date} startDate - Specifies the start date.
     * @param {Date} endDate - Specifies the end date.
     * @returns {number} Returns the month difference, or 0 when the end is not after the start.
     * @private
     */
    public getMonthDiff(startDate: Date, endDate: Date): number {
        let months: number;
        months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += endDate.getMonth();
        return months <= 0 ? 0 : months;
    }

    /**
     * Gets a copy of the event clipped to the given month of a multi-month span.
     *
     * @param {Record<string, any>} eventObj - Specifies the event.
     * @param {number} month - Specifies the month index.
     * @returns {Record<string, any>} Returns the event copy for that month.
     * @private
     */
    public getEventCount(eventObj: Record<string, any>, month: number): Record<string, any> {
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

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            return;
        }
        this.actionObj = {};
        this.scrollArgs = {};
        this.resizeEdges = { left: false, right: false, top: false, bottom: false };
        this.scrollEdges = { left: false, right: false, top: false, bottom: false };
    }
}
