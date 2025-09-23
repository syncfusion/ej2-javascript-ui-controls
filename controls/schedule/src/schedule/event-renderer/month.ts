/* eslint-disable @typescript-eslint/no-explicit-any */
import { append, prepend, createElement, extend, EventHandler, closest, addClass } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setStyleAttribute, remove } from '@syncfusion/ej2-base';
import { EventFieldsMapping, EventClickArgs, EventRenderedArgs, TdData, NotifyEventArgs, MoreEventsClickArgs } from '../base/interface';
import { Schedule } from '../base/schedule';
import { EventBase } from './event-base';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import * as util from '../base/util';

const EVENT_GAP: number = 0;
/**
 * Month view events render
 */
export class MonthEvent extends EventBase {
    public element: HTMLElement;
    public fields: EventFieldsMapping;
    public dateRender: Date[];
    public renderedEvents: Record<string, any>[] = [];
    public eventHeight: number;
    private monthHeaderHeight: number = 0;
    public workCells: HTMLElement[];
    public cellWidth: number;
    public cellHeight: number;
    public moreIndicatorHeight: number = 19;
    public renderType: string = 'day';
    public maxHeight: boolean;
    public withIndicator: boolean;
    public maxOrIndicator: boolean;
    public inlineValue: boolean;
    private isResourceEventTemplate: boolean;

    constructor(parent: Schedule) {
        super(parent);
        this.element = this.parent.activeView.getPanel();
        this.fields = this.parent.eventFields;
        this.maxHeight = this.parent.eventSettings.enableMaxHeight && !this.parent.eventSettings.enableIndicator
            && !this.parent.rowAutoHeight;
        this.withIndicator = this.parent.eventSettings.enableMaxHeight && this.parent.eventSettings.enableIndicator
            && !this.parent.rowAutoHeight;
        this.maxOrIndicator = (this.maxHeight || this.withIndicator);
        this.moreIndicatorHeight =
            (this.parent.rowAutoHeight && this.parent.eventSettings.ignoreWhitespace) ? 0 : this.moreIndicatorHeight;
        this.addEventListener();
    }

    private removeEventWrapper(appElement: Element[]): void {
        if (appElement.length > 0) {
            appElement = (this.parent.currentView === 'Month' || (!this.parent.activeView.isTimelineView() &&
                !this.parent.activeViewOptions.timeScale.enable)) ? appElement : [appElement[0]];
            for (const wrap of appElement) {
                if (wrap.parentElement && wrap.parentElement.parentNode) {
                    remove(wrap.parentElement);
                }
            }
        }
    }

    public renderAppointments(): void {
        if (this.parent.dragAndDropModule) {
            this.parent.dragAndDropModule.setDragArea();
        }
        this.isResourceEventTemplate = this.parent.isSpecificResourceEvents();
        const conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (this.parent.rowAutoHeight) {
            this.parent.uiStateValues.top = conWrap.scrollTop;
            this.parent.uiStateValues.left = conWrap.scrollLeft;
        }
        const appointmentWrapper: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_WRAPPER_CLASS));
        if (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction) {
            for (let i: number = 0, len: number = this.parent.crudModule.crudObj.sourceEvent.length; i < len; i++) {
                const appElement: Element[] = [].slice.call(this.element.querySelectorAll('.e-appointment-wrapper ' + '[data-group-index="' +
                    this.parent.crudModule.crudObj.sourceEvent[parseInt(i.toString(), 10)].groupIndex + '"]'));
                this.removeEventWrapper(appElement);
                if (this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)] &&
                    this.parent.crudModule.crudObj.sourceEvent[parseInt(i.toString(), 10)].groupIndex !==
                    this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)].groupIndex) {
                    const ele: Element[] = [].slice.call(this.element.querySelectorAll('.e-appointment-wrapper ' + '[data-group-index="' +
                        this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)].groupIndex + '"]'));
                    this.removeEventWrapper(ele);
                }
            }
        } else {
            for (const wrap of appointmentWrapper) {
                remove(wrap);
            }
        }
        this.removeHeightProperty(cls.CONTENT_TABLE_CLASS);
        if (!this.element.querySelector('.' + cls.WORK_CELLS_CLASS)) {
            return;
        }
        if (this.parent.currentView === 'Month') {
            const wrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            const cellTd: HTMLTableCellElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
            cellTd.appendChild(wrapper);
            this.monthHeaderHeight = wrapper.offsetTop - cellTd.offsetTop;
            cellTd.removeChild(wrapper);
        }
        this.eventHeight = this.parent.getElementHeightFromClass(this.element, cls.APPOINTMENT_CLASS);
        const selector: string = '.' + cls.CONTENT_TABLE_CLASS + ' tbody tr';
        this.addCellHeight(selector, this.eventHeight, (this.parent.currentView === 'Month' ? EVENT_GAP : 2), this.monthHeaderHeight, this.moreIndicatorHeight);
        const scrollTop: number = conWrap.scrollTop;
        if (this.parent.rowAutoHeight && this.parent.virtualScrollModule && !this.parent.virtualScrollModule.isHorizontalScroll
            && !isNullOrUndefined(this.parent.currentAction)) {
            conWrap.scrollTop = conWrap.scrollTop - 1;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.renderResourceEvents();
            if (this.parent.virtualScrollModule) {
                this.parent.virtualScrollModule.updateFocusedWorkCell();
            }
        } else {
            this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays);
        }
        if (this.parent.rowAutoHeight) {
            this.updateBlockElements();
            const data: NotifyEventArgs = {
                cssProperties: this.parent.getCssProperties(),
                module: this.parent.getModuleName(),
                isPreventScrollUpdate: true,
                scrollPosition: { left: this.parent.uiStateValues.left, top: this.parent.uiStateValues.top }
            };
            if (this.parent.virtualScrollModule && !this.parent.virtualScrollModule.isHorizontalScroll) {
                if (this.parent.currentAction) {
                    conWrap.scrollTop = scrollTop;
                    this.parent.currentAction = null;
                } else {
                    this.parent.virtualScrollModule.updateVirtualScrollHeight();
                }
            }
            if (!this.parent.enablePersistence) {
                this.parent.notify(events.contentReady, {});
            }
            this.parent.notify(events.scrollUiUpdate, data);
            if (this.parent.currentView === 'Month' && this.parent.showWeekNumber) {
                const totalCells: HTMLElement[] =
                    [].slice.call(this.parent.element.querySelectorAll('.e-content-wrap table tr td:first-child'));
                const weekNumberCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('td' + '.' + cls.WEEK_NUMBER_CLASS));
                weekNumberCells.forEach((cell: HTMLElement, i: number) => {
                    const height: number = totalCells[parseInt(i.toString(), 10)].offsetHeight;
                    setStyleAttribute(cell, { 'height': height + 'px' });
                });
                const weekNumberWrapper: HTMLElement = this.parent.element.querySelector('.' + cls.WEEK_NUMBER_WRAPPER_CLASS) as HTMLElement;
                if (!isNullOrUndefined(weekNumberWrapper)) {
                    weekNumberWrapper.scrollTop = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).scrollTop;
                }
            }
        }
        this.parent.renderTemplates();
    }

    public renderEventsHandler(dateRender: Date[], workDays: number[], resData?: TdData): void {
        this.renderedEvents = [];
        let eventsList: Record<string, any>[];
        let blockList: Record<string, any>[];
        let resIndex: number = 0;
        if (resData) {
            resIndex = resData.groupIndex;
            this.cssClass = resData.cssClass;
            this.groupOrder = resData.groupOrder;
            eventsList = this.parent.eventBase.filterEventsByResource(resData, this.parent.eventsProcessed) as Record<string, any>[];
            blockList = this.parent.eventBase.filterEventsByResource(resData, this.parent.blockProcessed) as Record<string, any>[];
            this.workCells = [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + resIndex + '"]'));
        } else {
            eventsList = this.parent.eventsProcessed;
            blockList = this.parent.blockProcessed;
            this.workCells = [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
        }
        this.sortByDateTime(eventsList);
        this.sortByDateTime(blockList);
        if (this.parent.currentView === 'Month' && this.parent.rowAutoHeight && this.parent.activeViewOptions.group.resources.length === 0) {
            const totalCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-wrap table tr td:first-child'));
            const height: number = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS).clientHeight / totalCells.length;
            totalCells.forEach((cell: HTMLElement) => {
                setStyleAttribute(cell, { 'height': height + 'px' });
            });
        }
        const cellDetail: HTMLElement = this.workCells[this.parent.activeView.isTimelineView() ? 0 : this.workCells.length - 1];
        this.cellWidth = this.parent.getElementWidth(cellDetail);
        this.cellHeight = this.parent.getElementHeight(cellDetail);
        this.dateRender = dateRender;
        const filteredDates: Date[] = this.getRenderedDates(dateRender);
        this.getSlotDates(workDays || this.parent.activeViewOptions.workDays);
        this.processBlockEvents(blockList, resIndex, resData);
        let events: Record<string, any>[] = [];
        for (const event of eventsList) {
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event);
            }
            events = events.concat(this.splitEvent(event, filteredDates || this.dateRender));
        }
        for (let level: number = 0; level < this.slots.length; level++) {
            this.renderedEvents = [];
            const slot: number[] = this.slots[parseInt(level.toString(), 10)] as any;
            const endDate: Date = util.addDays(new Date(slot[slot.length - 1]), 1);
            const spannedEvents: Record<string, any>[] = this.filterEvents(new Date(slot[0]), endDate, events);
            for (const event of spannedEvents) {
                if (this.maxHeight) {
                    const sDate: Date = this.parent.currentView === 'Month' ? event[this.fields.startTime] as Date :
                        this.getStartTime(event, event.data as Record<string, any>);
                    if (this.getIndex(sDate) > 0) {
                        continue;
                    }
                }
                this.updateIndicatorIcon(event);
                this.renderEvents(event, resIndex, eventsList);
            }
        }
        this.cssClass = null;
        this.groupOrder = null;
    }

    private processBlockEvents(blockEvents: Record<string, any>[], resIndex: number, resData?: TdData): void {
        for (const event of blockEvents) {
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event);
            }
            const blockSpannedList: Record<string, any>[] = [];
            if (this.renderType === 'day' && !event[this.fields.isAllDay]) {
                const temp: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
                let isSameDate: boolean = this.isSameDate(temp[this.fields.startTime] as Date, temp[this.fields.endTime] as Date);
                temp.isBlockIcon = isSameDate;
                if (!isSameDate && util.getDateInMs(temp[this.fields.startTime] as Date) > 0) {
                    const e: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
                    e[this.fields.endTime] = util.addDays(util.resetTime(new Date(event[this.fields.startTime] + '')), 1);
                    e.isBlockIcon = true;
                    temp[this.fields.startTime] = e[this.fields.endTime];
                    blockSpannedList.push(e);
                }
                isSameDate = this.isSameDate(temp[this.fields.startTime] as Date, temp[this.fields.endTime] as Date);
                if (!isSameDate && util.getDateInMs(temp[this.fields.endTime] as Date) > 0) {
                    const e: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
                    e[this.fields.startTime] = util.resetTime(new Date(event[this.fields.endTime] + ''));
                    e.isBlockIcon = true;
                    blockSpannedList.push(e);
                    temp[this.fields.endTime] = e[this.fields.startTime];
                }
                blockSpannedList.push(temp);
            } else {
                blockSpannedList.push(event);
            }
            for (const blockEvent of blockSpannedList) {
                const spannedEvents: Record<string, any>[] = this.splitEvent(blockEvent, this.dateRender);
                for (const event of spannedEvents) {
                    this.renderBlockEvents(event, resIndex, !!blockEvent.isBlockIcon);
                }
            }
        }
    }

    private isSameDate(start: Date, end: Date): boolean {
        return new Date(+start).setHours(0, 0, 0, 0) === new Date(+end).setHours(0, 0, 0, 0);
    }

    public renderBlockEvents(event: Record<string, any>, resIndex: number, isIcon: boolean): void {
        const eventData: Record<string, any> = event.data as Record<string, any>;
        const startTime: Date = this.getStartTime(event, eventData);
        const endTime: Date = this.getEndTime(event, eventData);
        const day: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime())));
        if (day < 0 || startTime > endTime) {
            return;
        }
        const cellTd: HTMLElement = this.getCellTd(day);
        const position: number = this.getPosition(startTime, endTime, event[this.fields.isAllDay] as boolean, day);
        if (!isIcon) {
            const diffInDays: number = eventData.count as number;
            let appWidth: number = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay] as boolean, diffInDays);
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth;
            appWidth = event.IsBlock ? appWidth - 1 : appWidth;
            const appLeft: number = (this.parent.enableRtl) ? 0 : event.IsBlock ? position + 1 : position;
            const appRight: number = (this.parent.enableRtl) ? event.IsBlock ? position + 1 : position : 0;
            let appHeight: number = this.cellHeight - this.monthHeaderHeight;
            appHeight = event.IsBlock ? appHeight - 1 : appHeight;
            const appTop: number = this.getRowTop(resIndex);
            const blockElement: HTMLElement = this.createBlockAppointmentElement(event, resIndex, this.isResourceEventTemplate);
            setStyleAttribute(blockElement, {
                'width': appWidth + 'px', 'height': appHeight + 'px', 'left': appLeft + 'px',
                'right': appRight + 'px', 'top': appTop + 'px'
            });
            this.renderEventElement(event, blockElement, cellTd);
        } else {
            this.renderBlockIndicator(cellTd, position, resIndex);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public renderBlockIndicator(cellTd: HTMLElement, position: number, resIndex: number): void {
        const blockIndicator: HTMLElement = createElement('div', { className: 'e-icons ' + cls.BLOCK_INDICATOR_CLASS });
        if (isNullOrUndefined(cellTd.querySelector('.' + cls.BLOCK_INDICATOR_CLASS))) {
            cellTd.appendChild(blockIndicator);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getStartTime(event: Record<string, any>, eventData: Record<string, any>): Date {
        return event[this.fields.startTime] as Date;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getEndTime(event: Record<string, any>, eventData: Record<string, any>): Date {
        return event[this.fields.endTime] as Date;
    }

    public getCellTd(day: number): HTMLElement {
        return this.workCells[parseInt(day.toString(), 10)];
    }

    public getEventWidth(startDate: Date, endDate: Date, isAllDay: boolean, count: number): number {
        return count * this.cellWidth - 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getPosition(startTime: Date, endTime: Date, isAllDay: boolean, day: number): number {
        return 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getRowTop(resIndex: number): number {
        return 0;
    }

    public updateIndicatorIcon(event: Record<string, any>): void {
        if (this.parent.currentView.indexOf('Timeline') === -1 || this.parent.currentView === 'TimelineMonth'
            || event[this.fields.isAllDay]) {
            return;
        }
        const cloneData: Record<string, any> = event.data as Record<string, any>;
        const start: Date = this.parent.activeView.getStartHour();
        const end: Date = this.parent.activeView.getEndHour();
        const startHour: Record<string, Date> = util.getStartEndHours(event[this.fields.startTime] as Date, start, end);
        const endHour: Record<string, Date> = util.getStartEndHours(event[this.fields.endTime] as Date, start, end);
        const actualStartTime: Date = <Date>cloneData[this.fields.startTime];
        const actualEndTime: Date = <Date>cloneData[this.fields.endTime];
        cloneData.isLeft = cloneData.isLeft || actualStartTime.getTime() < startHour.startHour.getTime();
        cloneData.isRight = cloneData.isRight || actualEndTime.getTime() > endHour.endHour.getTime();
        if (util.resetTime(actualStartTime).getTime() !== util.resetTime(actualEndTime).getTime()) {
            const actualStartHour: Date = startHour.startHour;
            const actualEndHour: Date = endHour.endHour;
            const startTime: Date = new Date(util.resetTime(actualStartTime));
            startTime.setHours(actualEndHour.getHours(), actualEndHour.getMinutes(), actualEndHour.getSeconds());
            cloneData.isLeft = cloneData.isLeft || actualStartTime.getTime() >= (actualStartHour.getDate() === startHour.endHour.getDate() ?
                startTime.getTime() : util.addDays(startTime, 1).getTime());
            if (actualEndTime.getTime() !== util.resetTime(actualEndTime).getTime()) {
                const endTime: Date = new Date(util.resetTime(actualEndTime));
                cloneData.isRight = cloneData.isRight || actualEndTime.getTime() <=
                    endTime.setHours(actualStartHour.getHours(), actualStartHour.getMinutes(), actualStartHour.getSeconds());
            }
        }
    }

    public renderResourceEvents(): void {
        const resources: TdData[] = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.renderedResources;
        if (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction) {
            for (let i: number = 0, len: number = this.parent.crudModule.crudObj.sourceEvent.length; i < len; i++) {
                const sourceRes: TdData = this.parent.crudModule.crudObj.sourceEvent[parseInt(i.toString(), 10)];
                if (!this.parent.uiStateValues.isGroupAdaptive ||
                    (this.parent.uiStateValues.groupIndex === sourceRes.groupIndex && this.parent.uiStateValues.isGroupAdaptive)) {
                    this.renderEventsHandler(sourceRes.renderDates, sourceRes.workDays, sourceRes);
                }
                if (this.parent.crudModule.crudObj.sourceEvent[parseInt(i.toString(), 10)].groupIndex !==
                    this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)].groupIndex) {
                    const target: TdData = this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)];
                    this.renderEventsHandler(target.renderDates, target.workDays, target);
                }
            }
            this.parent.crudModule.crudObj.isCrudAction = false;
        } else {
            for (const slotData of resources) {
                this.renderEventsHandler(slotData.renderDates, slotData.workDays, slotData);
            }
        }
    }

    public getSlotDates(workDays?: number[]): void {
        this.slots = [];
        const dates: number[] = this.dateRender.map((date: Date) => { return +date; });
        const noOfDays: number = !this.parent.activeViewOptions.showWeekend || (this.parent.activeViewOptions.group.byDate &&
            this.parent.activeViewOptions.group.hideNonWorkingDays) ? workDays.length : util.WEEK_LENGTH;
        while (dates.length > 0) {
            this.slots.push(dates.splice(0, noOfDays) as any);
        }
    }

    public createAppointmentElement(record: Record<string, any>, resIndex: number, isCloneElement: boolean = false): HTMLElement {
        const eventSubject: string = (record[this.fields.subject] || this.parent.eventSettings.fields.subject.default ||
            this.parent.localeObj.getConstant('addTitle')) as string;
        const newRecord: Record<string, any> = extend({}, record, record.data, true) as Record<string, any>;
        const attrs: { [key: string]: string } = {
            'data-id': 'Appointment_' + record[this.fields.id],
            'role': 'button', 'tabindex': '0',
            'aria-disabled': this.parent.eventBase.getReadonlyAttribute(record),
            'aria-label': this.parent.getAnnouncementString(newRecord, eventSubject)
        };
        if (!isCloneElement) {
            attrs['data-guid'] = record.Guid;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            attrs['data-group-index'] = resIndex.toString();
        }
        const appointmentWrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_CLASS, attrs: attrs });

        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        if (record[this.fields.isReadonly]) {
            addClass([appointmentWrapper], 'e-read-only');
        }
        const appointmentDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        let templateElement: HTMLElement[];
        const eventData: Record<string, any> = record.data as Record<string, any>;
        const eventObj: Record<string, any> = this.getEventData(record);
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            const scheduleId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.eventTemplateName;
            const templateId: string = scheduleId + viewName + 'eventTemplate';
            const eventTemplate: string = this.isResourceEventTemplate ? this.parent.getEventTemplateName(resIndex) : 'eventTemplate';
            templateElement = this.parent.getAppointmentTemplate()(eventObj, this.parent, eventTemplate, templateId, false,
                                                                   undefined, undefined, this.parent.root);
        } else {
            const eventLocation: string = (record[this.fields.location] || this.parent.eventSettings.fields.location.default || '') as string;
            const appointmentSubject: HTMLElement = createElement('div', { className: cls.SUBJECT_CLASS });
            this.parent.sanitize((eventSubject + (eventLocation ? '; ' + eventLocation : '')), appointmentSubject);
            const appointmentStartTime: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventData[this.fields.startTime] as Date)
            });
            const appointmentEndTime: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventData[this.fields.endTime] as Date)
            });
            if (this.parent.currentView === 'Month') {
                if (record[this.fields.isAllDay]) {
                    templateElement = [appointmentSubject];
                    addClass([appointmentSubject], 'e-text-center');
                } else if (eventData.count <= 1 && !eventData.isLeft && !eventData.isRight) {
                    templateElement = [appointmentStartTime, appointmentSubject];
                } else {
                    templateElement = [];
                    addClass([appointmentSubject], 'e-text-center');
                    if (!eventData.isLeft) {
                        templateElement.push(appointmentStartTime);
                    }
                    templateElement.push(appointmentSubject);
                    if (!eventData.isRight) {
                        templateElement.push(appointmentEndTime);
                    }
                }
            } else {
                let innerElement: HTMLElement[];
                if (record[this.fields.isAllDay]) {
                    const allDayString: HTMLElement = createElement('div', {
                        className: cls.APPOINTMENT_TIME, innerHTML: this.parent.localeObj.getConstant('allDay')
                    });
                    innerElement = [appointmentSubject, allDayString];
                } else {
                    const timeString: string = this.parent.getTimeString(eventData[this.fields.startTime] as Date)
                        + ' - ' + this.parent.getTimeString(eventData[this.fields.endTime] as Date);
                    const appTime: HTMLElement = createElement('div', {
                        className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''), innerHTML: timeString
                    });
                    const appLocation: HTMLElement = createElement('div', { className: cls.LOCATION_CLASS });
                    this.parent.sanitize(eventLocation, appLocation);
                    innerElement = [appointmentSubject, appTime, appLocation];
                }
                const wrap: HTMLElement = createElement('div', { className: 'e-inner-wrap' });
                append(innerElement, wrap);
                templateElement = [wrap];
            }
        }
        append(templateElement, appointmentDetails);
        this.appendEventIcons(record, appointmentDetails);
        this.renderResizeHandler(appointmentWrapper, record.data as Record<string, any>, record[this.fields.isReadonly] as boolean);
        return appointmentWrapper;
    }

    private appendEventIcons(record: Record<string, any>, appointmentDetails: HTMLElement): void {
        const eventData: Record<string, any> = record.data as Record<string, any>;
        if (!isNullOrUndefined(record[this.fields.recurrenceRule]) || !isNullOrUndefined(record[this.fields.recurrenceID])) {
            const iconClass: string = (record[this.fields.id] === record[this.fields.recurrenceID]) ?
                cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
            appointmentDetails.appendChild(createElement('div', {
                className: cls.ICON + ' ' + iconClass + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : '')
            }));
        }
        if (eventData.isLeft) {
            const iconLeft: HTMLElement = createElement('div', {
                className: cls.EVENT_INDICATOR_CLASS + ' ' + cls.ICON + ' ' + cls.EVENT_ICON_LEFT_CLASS
            });
            prepend([iconLeft], appointmentDetails);
        }
        if (eventData.isRight) {
            const iconRight: HTMLElement = createElement('div', {
                className: cls.EVENT_INDICATOR_CLASS + ' ' + cls.ICON + ' ' + cls.EVENT_ICON_RIGHT_CLASS
            });
            append([iconRight], appointmentDetails);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public renderEvents(event: Record<string, any>, resIndex: number, eventsList?: Record<string, any>[]): void {
        const startTime: Date = event[this.fields.startTime] as Date;
        const endTime: Date = event[this.fields.endTime] as Date;
        const day: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(startTime));
        if ((day < 0) || (startTime.getTime() < this.parent.minDate.getTime()) || (endTime.getTime() > this.parent.maxDate.getTime())) {
            return;
        }
        const eventsPerRow: number = this.parent.rowAutoHeight ? 1 : this.parent.activeViewOptions.maxEventsPerRow;
        const overlapCount: number = this.getIndex(startTime);
        event.Index = overlapCount;
        const diffInDays: number = (event.data as Record<string, any>).count as number;
        if (startTime.getTime() <= endTime.getTime()) {
            const appWidth: number = (diffInDays * this.cellWidth) - 5;
            const cellTd: Element = this.workCells[parseInt(day.toString(), 10)];
            const appTop: number = (overlapCount * (this.eventHeight + EVENT_GAP));
            const height: number =
                this.monthHeaderHeight + ((overlapCount + 1) * (this.eventHeight + EVENT_GAP)) + this.moreIndicatorHeight;
            const enableAppRender: boolean = this.parent.activeViewOptions.maxEventsPerRow && !this.parent.rowAutoHeight &&
                !this.parent.eventSettings.enableIndicator ? overlapCount < eventsPerRow : this.maxOrIndicator ? overlapCount < 1
                    ? true : false : this.cellHeight > height;
            if (this.parent.rowAutoHeight || enableAppRender) {
                this.renderedEvents.push(extend({}, event, null, true) as Record<string, any>);
                let appointmentElement: HTMLElement;
                if (this.inlineValue) {
                    appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
                } else {
                    appointmentElement = this.createAppointmentElement(event, resIndex);
                }
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                this.wireAppointmentEvents(appointmentElement, event);
                setStyleAttribute(appointmentElement, { 'width': appWidth + 'px', 'top': appTop + 'px' });
                this.renderEventElement(event, appointmentElement, cellTd);
                if (this.parent.rowAutoHeight) {
                    const conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
                    const conWidth: number = this.parent.getElementWidth(conWrap);
                    const isWithoutScroll: boolean = conWrap.offsetHeight === conWrap.clientHeight &&
                    conWrap.offsetWidth === conWrap.clientWidth;
                    const firstChild: HTMLElement = cellTd.parentElement.firstElementChild as HTMLElement;
                    this.updateCellHeight(firstChild, height);
                    if (isWithoutScroll &&
                        (conWrap.offsetWidth > conWrap.clientWidth || conWidth !== this.parent.getElementWidth(conWrap))) {
                        this.adjustAppointments(conWidth);
                    }
                }
            } else {
                for (let i: number = 0; i < diffInDays; i++) {
                    if (this.workCells[day + i]) {
                        const indicator: HTMLElement = this.workCells[day + i].querySelector('.' + cls.MORE_INDICATOR_CLASS);
                        if (indicator) {
                            const count: number = parseInt(indicator.getAttribute('data-count'), 10) + 1;
                            indicator.setAttribute('data-count', count.toString());
                            indicator.setAttribute('aria-label', count + ' ' + this.parent.localeObj.getConstant('moreEvents'));
                            indicator.innerHTML = this.getMoreIndicatorText(count);
                        } else {
                            const startDate: Date = new Date(this.dateRender[day + i].getTime());
                            const endDate: Date = util.addDays(this.dateRender[day + i], 1);
                            const groupIndex: string = this.workCells[day + i].getAttribute('data-group-index');
                            const moreIndicatorElement: HTMLElement = this.getMoreIndicatorElement(1, startDate, endDate);
                            if (!isNullOrUndefined(groupIndex)) {
                                moreIndicatorElement.setAttribute('data-group-index', groupIndex);
                            }
                            moreIndicatorElement.style.top = (this.cellHeight - this.monthHeaderHeight - this.moreIndicatorHeight) + 'px';
                            moreIndicatorElement.style.width = this.cellWidth - 2 + 'px';
                            this.renderElement(this.workCells[day + i], moreIndicatorElement);
                            EventHandler.add(moreIndicatorElement, 'click', this.moreIndicatorClick, this);
                        }
                    }
                }
            }
        }
    }

    public adjustAppointments(conWidth: number): void {
        const tr: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr');
        const actualCellWidth: number = this.parent.getElementWidth(this.workCells[0]);
        this.cellWidth = actualCellWidth / +(this.workCells[0].getAttribute('colspan') || 1);
        const currentPercentage: number = (actualCellWidth * tr.children.length) / (conWidth / 100);
        const apps: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
        apps.forEach((app: HTMLElement) => {
            if (this.parent.enableRtl && app.style.right !== '0px') {
                app.style.right = ((parseFloat(app.style.right) / 100) * currentPercentage) + 'px';
            } else if (app.style.left !== '0px') {
                app.style.left = ((parseFloat(app.style.left) / 100) * currentPercentage) + 'px';
            }
            app.style.width = ((parseFloat(app.style.width) / 100) * currentPercentage) + 'px';
        });
    }

    public updateCellHeight(cell: HTMLElement, height: number): void {
        if ((height > cell.offsetHeight)) {
            setStyleAttribute(cell as HTMLElement, { 'height': height + 'px' });
        }
    }

    public updateBlockElements(): void {
        const blockElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS));
        for (const element of blockElement) {
            const target: HTMLElement = closest(element, 'tr') as HTMLElement;
            this.monthHeaderHeight = (<HTMLElement>element.offsetParent).offsetTop - target.offsetTop;
            element.style.height = ((target.offsetHeight - 1) - this.monthHeaderHeight) + 'px';
            const firstChild: HTMLElement = target.firstElementChild as HTMLElement;
            const width: number = Math.round(element.offsetWidth / firstChild.offsetWidth);
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
    }

    // eslint-disable-next-line max-len
    public getFilteredEvents(startDate: Date, endDate: Date, groupIndex: string, eventsList?: Record<string, any>[]): Record<string, any>[] {
        let filteredEvents: Record<string, any>[];
        if (isNullOrUndefined(groupIndex)) {
            filteredEvents = this.filterEvents(startDate, endDate);
        } else {
            const data: TdData = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            filteredEvents = this.filterEvents(startDate, endDate, isNullOrUndefined(eventsList) ? undefined : eventsList, data);
        }
        return filteredEvents;
    }

    public getOverlapEvents(date: Date, appointments: Record<string, any>[]): Record<string, any>[] {
        const appointmentsList: Record<string, any>[] = [];
        const dateTime: number = util.resetTime(date).getTime();
        for (const app of appointments) {
            if ((util.resetTime(<Date>app[this.fields.startTime]).getTime() <= dateTime) &&
                (util.resetTime(<Date>app[this.fields.endTime]).getTime() >= dateTime)) {
                appointmentsList.push(app);
            }
        }
        return appointmentsList;
    }

    public getIndex(date: Date): number {
        let appIndex: number = -1;
        const appointments: Record<string, any>[] = <Record<string, any>[]>this.renderedEvents;
        if (appointments.length > 0) {
            const appointmentsList: Record<string, any>[] = this.getOverlapEvents(date, appointments);
            const appLevel: number[] = appointmentsList.map((obj: Record<string, any>) => obj.Index) as number[];
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    }

    public moreIndicatorClick(event: Event): void {
        const target: Element = closest((event.target as Element), '.' + cls.MORE_INDICATOR_CLASS);
        const startDate: Date = new Date(parseInt(target.getAttribute('data-start-date'), 10));
        const endDate: Date = new Date(parseInt(target.getAttribute('data-end-date'), 10));
        const groupIndex: string = target.getAttribute('data-group-index');
        const moreArgs: MoreEventsClickArgs = {
            cancel: false, event: event, element: target, isPopupOpen: true,
            startTime: startDate, endTime: endDate, viewName: this.parent.getNavigateView()
        };
        if (groupIndex) {
            moreArgs.groupIndex = parseInt(groupIndex, 10);
        }
        this.parent.trigger(events.moreEventsClick, moreArgs, (clickArgs: MoreEventsClickArgs) => {
            if (!clickArgs.cancel) {
                if (clickArgs.isPopupOpen) {
                    const filteredEvents: Record<string, any>[] = this.getFilteredEvents(startDate, endDate, groupIndex);
                    const moreArgs: EventClickArgs = { date: startDate, event: filteredEvents, element: event.target } as EventClickArgs;
                    this.parent.quickPopup.moreEventClick(moreArgs, endDate, groupIndex);
                } else {
                    this.parent.setProperties({ selectedDate: startDate }, true);
                    this.parent.changeView(clickArgs.viewName, event);
                }
            }
        });
    }

    public renderEventElement(event: Record<string, any>, appointmentElement: HTMLElement, cellTd: Element): void {
        const eventType: string = appointmentElement.classList.contains(cls.BLOCK_APPOINTMENT_CLASS) ? 'blockEvent' : 'event';
        const isAppointment: boolean = appointmentElement.classList.contains(cls.APPOINTMENT_CLASS);
        const eventObj: Record<string, any> = this.parent.currentView === 'Month' ? this.getSpannedTime(event) : this.getEventData(event);
        const args: EventRenderedArgs = { data: eventObj, element: appointmentElement, cancel: false, type: eventType };
        this.parent.trigger(events.eventRendered, args, (eventArgs: EventRenderedArgs) => {
            if (eventArgs.cancel) {
                this.renderedEvents.pop();
            } else {
                this.renderElement(cellTd, appointmentElement, isAppointment);
            }
        });
    }

    private getSpannedTime(event: Record<string, any>): Record<string, any> {
        const eventObj: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
        if ((eventObj[this.fields.startTime]).getDate() === (eventObj.data[this.fields.startTime]).getDate()) {
            eventObj[this.fields.startTime] = eventObj.data[this.fields.startTime];
        }
        if ((eventObj[this.fields.endTime]).getDate() === (eventObj.data[this.fields.endTime]).getDate()) {
            eventObj[this.fields.endTime] = eventObj.data[this.fields.endTime];
        }
        return eventObj;
    }

    public getEventData(event: Record<string, any>): Record<string, any> {
        const eventObj: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
        eventObj[this.fields.startTime] = (event.data as Record<string, any>)[this.fields.startTime];
        eventObj[this.fields.endTime] = (event.data as Record<string, any>)[this.fields.endTime];
        return eventObj;
    }

    public renderElement(cellTd: HTMLElement | Element, element: HTMLElement, isAppointment: boolean = false): void {
        if (this.maxOrIndicator && isAppointment) {
            this.setMaxEventHeight(element, cellTd as HTMLElement);
        }
        const wrapperEle: HTMLElement = cellTd.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
        if (wrapperEle) {
            wrapperEle.appendChild(element);
        } else {
            const wrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(element);
            cellTd.appendChild(wrapper);
        }
    }

    public getMoreIndicatorElement(count: number, startDate: Date, endDate: Date): HTMLElement {
        const moreIndicatorElement: HTMLElement = createElement('div', {
            className: cls.MORE_INDICATOR_CLASS,
            innerHTML: this.getMoreIndicatorText(count),
            attrs: {
                'role': 'button',
                'tabindex': '0',
                'aria-label': this.parent.globalize.formatNumber(count) + ' ' + this.parent.localeObj.getConstant('moreEvents'),
                'data-count': count.toString(),
                'data-start-date': startDate.getTime().toString(),
                'data-end-date': endDate.getTime().toString()
            }
        });
        return moreIndicatorElement;
    }

    private getMoreIndicatorText(count: number): string {
        return '+' + this.parent.globalize.formatNumber(count) + '&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more'));
    }

    public removeHeightProperty(selector: string): void {
        const rows: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + selector + ' tbody tr'));
        for (const row of rows) {
            (row.firstElementChild as HTMLElement).style.height = '';
        }
    }

    public setMaxEventHeight(event: HTMLElement, cell: HTMLElement): void {
        const headerHeight: number = util.getOuterHeight(cell.querySelector('.' + cls.DATE_HEADER_CLASS));
        const height: number = (cell.offsetHeight - headerHeight) - (this.maxHeight ? 0 : this.moreIndicatorHeight);
        setStyleAttribute(event, { 'height': height + 'px', 'align-items': 'center' });
    }

    public destroy(): void {
        this.element = null;
        this.fields = null;
        this.maxHeight = null;
        this.withIndicator = null;
        this.maxOrIndicator = null;
        this.moreIndicatorHeight = null;
        this.removeEventListener();
        super.destroy();
    }

}
