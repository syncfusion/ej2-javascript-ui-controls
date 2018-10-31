import { isNullOrUndefined, closest, extend, EventHandler, uniqueID } from '@syncfusion/ej2-base';
import { createElement, prepend, append, addClass, removeClass } from '@syncfusion/ej2-base';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { EventFieldsMapping, EventClickArgs, CellClickEventArgs, TdData } from '../base/interface';
import { Timezone } from '../timezone/timezone';
import { Schedule } from '../base/schedule';
import { ResourcesModel } from '../models/resources-model';
import { generate } from '../../recurrence-editor/date-generator';
import * as util from '../base/util';
import * as cls from '../base/css-constant';
import * as event from '../base/constant';

/**
 * EventBase for appointment rendering
 */
export class EventBase {
    public parent: Schedule;
    public timezone: Timezone;
    public slots: Object[] = [];
    public cssClass: string;
    public groupOrder: string[];

    /**
     * Constructor for EventBase
     */
    constructor(parent: Schedule) {
        this.parent = parent;
        this.timezone = new Timezone();
    }

    public processData(events: { [key: string]: Object }[], timeZonePropChanged?: boolean, oldTimezone?: string): Object[] {
        let start: Date = this.parent.activeView.startDate();
        let end: Date = this.parent.activeView.endDate();
        let fields: EventFieldsMapping = this.parent.eventFields;
        this.parent.eventsProcessed = [];
        let processed: Object[] = [];
        let temp: number = 1;
        let generateID: boolean = false;
        if (events.length > 0 && isNullOrUndefined(events[0][fields.id])) {
            generateID = true;
        }
        for (let event of events) {
            if (generateID) {
                event[fields.id] = temp++;
            }
            if (typeof event[fields.startTime] === 'string') {
                event[fields.startTime] = util.getDateFromString(event[fields.startTime] as string);
            }
            if (typeof event[fields.endTime] === 'string') {
                event[fields.endTime] = util.getDateFromString(event[fields.endTime] as string);
            }
            if (timeZonePropChanged) {
                this.processTimezoneChange(event, oldTimezone);
            } else {
                this.processTimezone(event);
            }
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && isNullOrUndefined(event[fields.recurrenceID])) {
                processed = processed.concat(this.generateOccurrence(event));
            } else {
                event.Guid = this.generateGuid();
                processed.push(event);
            }
        }
        this.parent.eventsProcessed = this.filterEvents(start, end, processed);
        return processed;
    }

    public timezonePropertyChange(oldTimezone: string): void {
        let processed: Object[] = this.processData(this.parent.eventsData as { [key: string]: Object }[], true, oldTimezone);
        this.parent.notify(event.dataReady, { processedData: processed });
    }

    /** @private */
    public timezoneConvert(eventData: { [key: string]: Object }): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        eventData[fields.startTimezone] = eventData[fields.startTimezone] || eventData[fields.endTimezone];
        eventData[fields.endTimezone] = eventData[fields.endTimezone] || eventData[fields.startTimezone];
        if (this.parent.timezone) {
            let startTz: string & number = <string & number>eventData[fields.startTimezone];
            let endTz: string & number = <string & number>eventData[fields.endTimezone];
            eventData[fields.startTime] =
                this.timezone.convert(<Date>eventData[fields.startTime], <string & number>this.parent.timezone, startTz);
            eventData[fields.endTime] =
                this.timezone.convert(<Date>eventData[fields.endTime], <string & number>this.parent.timezone, endTz);
        }
    }

    private processTimezoneChange(event: { [key: string]: Object }, oldTimezone: string): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        if (oldTimezone && this.parent.timezone) {
            event[fields.startTime] = this.timezone.convert(
                <Date>event[fields.startTime], <number & string>oldTimezone, <number & string>this.parent.timezone);
            event[fields.endTime] = this.timezone.convert(
                <Date>event[fields.endTime], <number & string>oldTimezone, <number & string>this.parent.timezone);
        } else if (!oldTimezone && this.parent.timezone) {
            event[fields.startTime] = this.timezone.add(<Date>event[fields.startTime], this.parent.timezone);
            event[fields.endTime] = this.timezone.add(<Date>event[fields.endTime], this.parent.timezone);
        } else if (oldTimezone && !this.parent.timezone) {
            event[fields.startTime] = this.timezone.remove(<Date>event[fields.startTime], oldTimezone);
            event[fields.endTime] = this.timezone.remove(<Date>event[fields.endTime], oldTimezone);
        }
    }

    private processTimezone(event: { [key: string]: Object }): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        if (event[fields.startTimezone] || event[fields.endTimezone]) {
            let startTimezone: string = <string>event[fields.startTimezone] || <string>event[fields.endTimezone];
            let endTimezone: string = <string>event[fields.endTimezone] || <string>event[fields.startTimezone];
            event[fields.startTime] = this.timezone.add(<Date>event[fields.startTime], startTimezone);
            event[fields.endTime] = this.timezone.add(<Date>event[fields.endTime], endTimezone);
            if (this.parent.timezone) {
                let zone: number & string = <number & string>this.parent.timezone;
                event[fields.startTime] = this.timezone.convert(<Date>event[fields.startTime], <number & string>startTimezone, zone);
                event[fields.endTime] = this.timezone.convert(<Date>event[fields.endTime], <number & string>endTimezone, zone);
            }
        } else if (this.parent.timezone) {
            event[fields.startTime] = this.timezone.add(<Date>event[fields.startTime], this.parent.timezone);
            event[fields.endTime] = this.timezone.add(<Date>event[fields.endTime], this.parent.timezone);
        }
    }

    public filterEvents(startDate: Date, endDate: Date, appointments: Object[] = this.parent.eventsProcessed, resourceTdData?: TdData)
        : Object[] {
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let predicate: Predicate = new Predicate(fieldMapping.startTime, 'greaterthanorequal', startDate).
            and(new Predicate(fieldMapping.endTime, 'greaterthanorequal', startDate)).
            and(new Predicate(fieldMapping.startTime, 'lessthan', endDate)).
            or(new Predicate(fieldMapping.startTime, 'lessthanorequal', startDate).
                and(new Predicate(fieldMapping.endTime, 'greaterthan', startDate)));
        let filter: Object[] = new DataManager({ json: appointments }).executeLocal(new Query().where(predicate));
        if (resourceTdData) {
            filter = this.filterEventsByResource(resourceTdData, filter);
        }
        return this.sortByTime(filter);
    }

    public filterEventsByResource(resourceTdData: TdData, appointments: Object[] = this.parent.eventsProcessed): Object[] {
        let predicate: Predicate;
        let resourceCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        for (let level: number = 0; level < resourceCollection.length; level++) {
            let operator: string = this.parent.activeViewOptions.group.allowGroupEdit && resourceCollection[level].allowMultiple ?
                'contains' : 'equal';
            let tempPredicate: Predicate = new Predicate(resourceCollection[level].field, operator, resourceTdData.groupOrder[level]);
            predicate = predicate ? predicate.and(tempPredicate) : tempPredicate;
        }
        return new DataManager({ json: appointments }).executeLocal(new Query().where(predicate));
    }

    public sortByTime(appointments: Object[]): Object[] {
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        appointments.sort((a: { [key: string]: Object }, b: { [key: string]: Object }) => {
            let d1: Date = a[fieldMapping.startTime] as Date;
            let d2: Date = b[fieldMapping.startTime] as Date;
            return d1.getTime() - d2.getTime();
        });
        return appointments;
    }

    public sortByDateTime(appointments: Object[]): Object[] {
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        appointments.sort((object1: { [key: string]: Object }, object2: { [key: string]: Object }) => {
            let d3: Date = object1[fieldMapping.startTime] as Date;
            let d4: Date = object2[fieldMapping.startTime] as Date;
            let d5: Date = object1[fieldMapping.endTime] as Date;
            let d6: Date = object2[fieldMapping.endTime] as Date;
            let d1: number = d5.getTime() - d3.getTime();
            let d2: number = d6.getTime() - d4.getTime();
            return (d3.getTime() - d4.getTime() || d2 - d1);
        });
        return appointments;
    }

    public getSmallestMissingNumber(array: Object[]): number {
        let large: number = Math.max.apply(Math, array);
        for (let i: number = 0; i < large; i++) {
            if (array.indexOf(i) === -1) { return i; }
        }
        return large + 1;
    }

    public splitEventByDay(event: { [key: string]: Object }): Object[] {
        let eventFields: EventFieldsMapping = this.parent.eventFields;
        let data: Object[] = [];
        let eventStartTime: Date = event[eventFields.startTime] as Date;
        let eventEndTime: Date = event[eventFields.endTime] as Date;
        let isDifferentDate: boolean = util.resetTime(new Date(eventStartTime.getTime())) <
            util.resetTime(new Date(eventEndTime.getTime()));
        if (isDifferentDate) {
            let start: Date = new Date(eventStartTime.getTime());
            let end: Date = util.addDays(util.resetTime(new Date(eventStartTime.getTime())), 1);
            let endDate: Date = (eventEndTime.getHours() === 0 && eventEndTime.getMinutes() === 0) ?
                eventEndTime : util.addDays(eventEndTime, 1);
            let index: number = 1;
            let eventLength: number = util.getDaysCount(eventStartTime.getTime(), endDate.getTime());
            while (end <= eventEndTime) {
                let app: { [key: string]: Object } = <{ [key: string]: Object }>extend({}, event);
                app[eventFields.startTime] = start;
                app[eventFields.endTime] = end;
                app.data = { index: index, count: eventLength };
                app.Guid = this.generateGuid();
                app.isSpanned = true;
                data.push(app);
                start = end;
                if ((new Date(start.getTime()).setHours(0, 0, 0, 0) === new Date(eventEndTime.getTime()).setHours(0, 0, 0, 0))
                    && !(end.getTime() === eventEndTime.getTime())) {
                    end = new Date(new Date(start.getTime()).setHours(eventEndTime.getHours(), eventEndTime.getMinutes()));
                } else {
                    end = util.addDays(util.resetTime(new Date(start.getTime())), 1);
                }
                index++;
            }
        } else {
            data.push(event);
        }
        return data;
    }

    public splitEvent(event: { [key: string]: Object }, dateRender: Date[]): { [key: string]: Object }[] {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let start: number = util.resetTime(new Date(event[fields.startTime] + '')).getTime();
        let end: number = util.resetTime(new Date(event[fields.endTime] + '')).getTime();
        if (util.getDateInMs(event[fields.endTime] as Date) <= 0) {
            let temp: number = util.addDays(util.resetTime(new Date(event[fields.endTime] + '')), -1).getTime();
            end = start > temp ? start : temp;
        }
        let orgStart: number = start;
        let orgEnd: number = end;
        let ranges: { [key: string]: Object }[] = [];
        if (start !== end) {
            if (start < dateRender[0].getTime()) {
                start = dateRender[0].getTime();
            }
            if (end > dateRender[dateRender.length - 1].getTime()) {
                end = dateRender[dateRender.length - 1].getTime();
            }
            let cStart: number = start;
            for (let level: number = 0; level < this.slots.length; level++) {
                let slot: number[] = <[number]>this.slots[level];
                let firstSlot: number = <number>slot[0];
                cStart = (cStart <= firstSlot && end >= firstSlot) ? firstSlot : cStart;
                if (cStart > end || firstSlot > end) {
                    break;
                }
                if (!this.parent.activeViewOptions.group.byDate && this.parent.activeViewOptions.showWeekend &&
                    this.parent.currentView !== 'WorkWeek' && this.parent.currentView !== 'TimelineWorkWeek') {
                    let startIndex: number = slot.indexOf(cStart);
                    if (startIndex !== -1) {
                        let endIndex: number = slot.indexOf(end);
                        let hasBreak: boolean = endIndex !== -1;
                        endIndex = hasBreak ? endIndex : slot.length - 1;
                        let count: number = ((endIndex - startIndex) + 1);
                        let isLeft: boolean = (slot[startIndex] !== orgStart);
                        let isRight: boolean = (slot[endIndex] !== orgEnd);
                        ranges.push(this.cloneEventObject(event, slot[startIndex], slot[endIndex], count, isLeft, isRight));
                        if (hasBreak) {
                            break;
                        }
                    }
                } else {
                    if (this.dateInRange(cStart, slot[0], slot[slot.length - 1])) {
                        let availSlot: number[] = [];
                        for (let i: number = 0; i < slot.length; i++) {
                            if (this.dateInRange(<number>slot[i], orgStart, orgEnd)) {
                                availSlot.push(slot[i]);
                            }
                        }
                        if (availSlot.length > 0) {
                            if (!this.parent.activeViewOptions.group.byDate) {
                                let isLeft: boolean = (availSlot[0] !== orgStart);
                                let isRight: boolean = (availSlot[availSlot.length - 1] !== orgEnd);
                                ranges.push(this.cloneEventObject(
                                    event, availSlot[0], availSlot[availSlot.length - 1], availSlot.length, isLeft, isRight));
                            } else {
                                for (let slot of availSlot) {
                                    ranges.push(this.cloneEventObject(event, slot, slot, 1, (slot !== orgStart), (slot !== orgEnd)));
                                }
                            }
                        }
                    }
                }
            }
        } else {
            ranges.push(this.cloneEventObject(event, start, end, 1, false, false));
        }
        return ranges;
    }

    private cloneEventObject(event: { [key: string]: Object }, start: number, end: number, count: number, isLeft: boolean, isRight: boolean)
        : { [key: string]: Object } {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let e: { [key: string]: Object } = extend({}, event, null, true) as { [key: string]: Object };
        let data: { [key: string]: Object } = { count: count, isLeft: isLeft, isRight: isRight };
        data[fields.startTime] = event[fields.startTime];
        data[fields.endTime] = event[fields.endTime];
        e.data = data;
        e[fields.startTime] = new Date(start);
        e[fields.endTime] = new Date(end);
        return e;
    }

    private dateInRange(date: number, start: number, end: number): boolean {
        return start <= date && date <= end;
    }

    public getSelectedEventElements(target: Element): Element[] {
        this.removeSelectedAppointmentClass();
        if (this.parent.selectedElements.length <= 0) {
            this.parent.selectedElements.push(target);
        } else {
            let isAlreadySelected: Element[] = this.parent.selectedElements.filter((element: HTMLElement) => {
                return element.getAttribute('data-guid') === target.getAttribute('data-guid');
            });
            if (isAlreadySelected.length <= 0) {
                let focusElements: Element[] = [].slice.call(this.parent.element.
                    querySelectorAll('div[data-guid="' + target.getAttribute('data-guid') + '"]'));
                for (let element of focusElements) {
                    this.parent.selectedElements.push(element);
                }
            } else {
                let selectedElements: Element[] = this.parent.selectedElements.filter((element: HTMLElement) => {
                    return element.getAttribute('data-guid') !== target.getAttribute('data-guid');
                });
                this.parent.selectedElements = selectedElements;
            }
        }
        if (target && this.parent.selectedElements.length > 0) {
            this.addSelectedAppointments(this.parent.selectedElements);
        }
        return this.parent.selectedElements;
    }

    public getSelectedEvents(): EventClickArgs {
        let eventSelect: Object[] = [];
        let elementSelect: HTMLElement[] = [];
        let selectAppointments: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
        selectAppointments.filter((element: HTMLElement) => {
            eventSelect.push(this.getEventByGuid(element.getAttribute('data-guid')));
            elementSelect.push(element);
        });
        return {
            event: eventSelect.length > 1 ? eventSelect : eventSelect[0],
            element: elementSelect.length > 1 ? elementSelect : elementSelect[0]
        } as EventClickArgs;
    }

    public removeSelectedAppointmentClass(): void {
        let selectedAppointments: Element[] = this.getSelectedAppointments();
        for (let appointment of selectedAppointments) {
            appointment.setAttribute('aria-selected', 'false');
        }
        removeClass(selectedAppointments, cls.APPOINTMENT_BORDER);
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            removeClass(selectedAppointments, cls.AGENDA_SELECTED_CELL);
        }
    }

    public addSelectedAppointments(cells: Element[]): void {
        for (let cell of cells) {
            cell.setAttribute('aria-selected', 'true');
        }
        this.parent.removeSelectedClass();
        addClass(cells, cls.APPOINTMENT_BORDER);
    }

    public getSelectedAppointments(): Element[] {
        return [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER + ',.' + cls.APPOINTMENT_CLASS + ':focus'));
    }

    public focusElement(): void {
        let selectedCell: Element[] = this.parent.getSelectedElements();
        if (selectedCell.length > 0) {
            if (this.parent.keyboardInteractionModule) {
                let target: HTMLTableCellElement = ((!isNullOrUndefined(this.parent.activeCellsData) &&
                    this.parent.activeCellsData.element) || selectedCell[selectedCell.length - 1]) as HTMLTableCellElement;
                this.parent.keyboardInteractionModule.selectCells(false, target);
            }
            return;
        }
        let selectedAppointments: Element[] = this.getSelectedAppointments();
        if (selectedAppointments.length > 0) {
            (selectedAppointments[selectedAppointments.length - 1] as HTMLElement).focus();
            return;
        }
    }

    public selectWorkCellByTime(eventsData: Object[]): Element {
        let target: Element;
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            return target;
        }
        if (eventsData.length > 0) {
            let selectedObject: { [key: string]: object } = eventsData[eventsData.length - 1] as { [key: string]: object };
            let eventStartTime: Date = <Date>selectedObject[this.parent.eventFields.startTime];
            let nearestTime: number = new Date(+eventStartTime).setMinutes(0, 0, 0);
            let isAllDay: boolean = this.isAllDayAppointment(selectedObject);
            if (this.parent.currentView === 'Month' || isAllDay) {
                nearestTime = new Date(+eventStartTime).setHours(0, 0, 0, 0);
            }
            let targetArea: Element;
            if (isAllDay && ['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) !== -1) {
                targetArea = this.parent.getAllDayRow();
            } else {
                targetArea = this.parent.getContentTable();
            }
            let queryString: string = '[data-date="' + nearestTime + '"]';
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                queryString += '[data-group-index="' + this.getGroupIndexFromEvent(selectedObject) + '"]';
            }
            target = targetArea.querySelector(queryString) as Element;
            if (target) {
                this.parent.activeCellsData = this.parent.getCellDetails(target);
                if (this.parent.keyboardInteractionModule) {
                    this.parent.keyboardInteractionModule.selectCells(false, target as HTMLTableCellElement);
                }
                return target;
            }
        }
        return target;
    }

    public getGroupIndexFromEvent(eventData: { [key: string]: Object }): number {
        let groupOrder: Object[] = [];
        let groupIndex: number = 0;
        for (let resourceData of this.parent.resourceBase.resourceCollection) {
            groupOrder.push(eventData[resourceData.field]);
        }
        this.parent.resourceBase.lastResourceLevel.forEach((resource: TdData) => {
            let count: number;
            let order: Object[] = resource.groupOrder;
            order.forEach((resIndex: Object, index: number) => {
                let resValue: Object = (groupOrder[index] instanceof Array) ? (<Object[]>groupOrder[index])[index] : groupOrder[index];
                if (resValue === resIndex) {
                    count = count ? count + 1 : 1;
                }
            });
            if (order.length === count) {
                groupIndex = resource.groupIndex;
            }
        });
        return groupIndex;
    }

    public isAllDayAppointment(event: { [key: string]: Object }): boolean {
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let isAllDay: boolean = event[fieldMapping.isAllDay] as boolean;
        let isFullDay: boolean = (((<Date>event[fieldMapping.endTime]).getTime() - (<Date>event[fieldMapping.startTime]).getTime())
            / util.MS_PER_DAY) >= 1;
        return (isAllDay || isFullDay) ? true : false;
    }

    public addEventListener(): void {
        this.parent.on(event.documentClick, this.appointmentBorderRemove, this);
    }

    private appointmentBorderRemove(event: Event & CellClickEventArgs): void {
        let element: HTMLElement = event.event.target as HTMLElement;
        if (closest(element as Element, '.' + cls.APPOINTMENT_CLASS)) {
            this.parent.removeSelectedClass();
        } else if (!closest(element as Element, '.' + cls.POPUP_OPEN)) {
            this.removeSelectedAppointmentClass();
        }
    }

    public wireAppointmentEvents(element: HTMLElement, isAllDay: boolean = false): void {
        EventHandler.add(element, 'click', this.eventClick, this);
        EventHandler.add(element, 'dblclick', this.eventDoubleClick, this);
        if (!this.parent.activeViewOptions.readonly && ['Agenda', 'MonthAgenda'].indexOf(this.parent.currentView) === -1) {
            if (this.parent.resizeModule) {
                this.parent.resizeModule.wireResizeEvent(element);
            }
            if (this.parent.dragAndDropModule) {
                this.parent.dragAndDropModule.wireDragEvent(element, isAllDay);
            }
        }
    }

    public renderResizeHandler(element: HTMLElement, spanEvent: { [key: string]: Object }): void {
        if (!this.parent.resizeModule || !this.parent.allowResizing || this.parent.activeViewOptions.readonly) {
            return;
        }
        for (let resizeEdge of Object.keys(spanEvent)) {
            let resizeHandler: HTMLElement = createElement('div', { className: cls.EVENT_RESIZE_CLASS });
            switch (resizeEdge) {
                case 'isLeft':
                    if (!spanEvent.isLeft) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-left-right-resize' }));
                        addClass([resizeHandler], this.parent.enableRtl ? cls.RIGHT_RESIZE_HANDLER : cls.LEFT_RESIZE_HANDLER);
                        prepend([resizeHandler], element);
                    }
                    break;
                case 'isRight':
                    if (!spanEvent.isRight) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-left-right-resize' }));
                        addClass([resizeHandler], this.parent.enableRtl ? cls.LEFT_RESIZE_HANDLER : cls.RIGHT_RESIZE_HANDLER);
                        append([resizeHandler], element);
                    }
                    break;
                case 'isTop':
                    if (!spanEvent.isTop) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-top-bottom-resize' }));
                        addClass([resizeHandler], cls.TOP_RESIZE_HANDLER);
                        prepend([resizeHandler], element);
                    }
                    break;
                case 'isBottom':
                    if (!spanEvent.isBottom) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-top-bottom-resize' }));
                        addClass([resizeHandler], cls.BOTTOM_RESIZE_HANDLER);
                        append([resizeHandler], element);
                    }
                    break;
            }
        }
    }

    private eventClick(eventData: Event & MouseEvent): void {
        let target: HTMLElement = eventData.target as HTMLElement;
        if (target.classList.contains(cls.DRAG_CLONE_CLASS) || target.classList.contains(cls.RESIZE_CLONE_CLASS)) {
            return;
        }
        if (eventData.ctrlKey && eventData.which === 1 && this.parent.keyboardInteractionModule) {
            this.parent.quickPopup.quickPopup.hide();
            this.parent.selectedElements = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
            this.parent.keyboardInteractionModule.onAppointmentSelection(eventData);
            return;
        }
        this.removeSelectedAppointmentClass();
        this.activeEventData(eventData);
        let args: EventClickArgs = <EventClickArgs>extend(this.parent.activeEventData, { cancel: false });
        this.parent.trigger(event.eventClick, args);
        if (args.cancel) {
            this.removeSelectedAppointmentClass();
            return;
        }
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            addClass([args.element as Element], cls.AGENDA_SELECTED_CELL);
        }
        this.parent.notify(event.eventClick, this.parent.activeEventData);
    }

    public eventDoubleClick(e: Event): void {
        this.parent.quickPopup.quickPopupHide(true);
        if (e.type === 'touchstart') {
            this.activeEventData(e);
        }
        this.removeSelectedAppointmentClass();
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        if (!isNullOrUndefined(this.parent.activeEventData.event) &&
            isNullOrUndefined((<{ [key: string]: Object }>this.parent.activeEventData.event)[fieldMapping.recurrenceID])) {
            this.parent.currentAction = 'Save';
            this.parent.eventWindow.openEditor(this.parent.activeEventData.event, 'Save');
        } else {
            this.parent.currentAction = 'EditOccurrence';
            this.parent.quickPopup.openRecurrenceAlert();
        }
    }

    public getEventByGuid(guid: string): Object {
        return new DataManager({ json: this.parent.eventsProcessed }).executeLocal(new Query().where('Guid', 'equal', guid))[0];
    }

    public generateGuid(): string {
        return 'xyxxxxyx-xxxy-yxxx-xyxx-xxyxxxxyyxxx'.replace(/[xy]/g, (c: string) => {
            const r: number = Math.random() * 16 | 0;
            const v: number = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public getEventIDType(): string {
        return typeof ((<{ [key: string]: Object }>this.parent.eventsData[0])[this.parent.eventFields.id]);
    }

    public getEventMaxID(resourceId?: number): number | string {
        if (this.parent.eventsData.length < 1) {
            return 1;
        }
        let eventId: string | number;
        let idType: string = this.getEventIDType();
        if (idType === 'string') {
            eventId = uniqueID().toString();
        }
        if (idType === 'number') {
            let maxId: number =
                Math.max.apply(Math, this.parent.eventsData.map((event: { [key: string]: Object }) => event[this.parent.eventFields.id]));
            maxId = isNullOrUndefined(resourceId) ? maxId : maxId + resourceId;
            eventId = maxId + 1;
        }
        return eventId;
    }

    private activeEventData(eventData: Event): void {
        let target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS);
        let guid: string = target.getAttribute('data-guid');
        this.addSelectedAppointments([].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]')));
        let eventObject: { [key: string]: Object } = this.getEventByGuid(guid) as { [key: string]: Object };
        if (eventObject && eventObject.isSpanned) {
            eventObject = this.parent.eventsData.filter((obj: { [key: string]: Object }) =>
                obj[this.parent.eventFields.id] === eventObject[this.parent.eventFields.id])[0] as { [key: string]: Object };
        }
        this.parent.activeEventData = { event: eventObject, element: target } as EventClickArgs;
    }

    public generateOccurrence(event: { [key: string]: Object }, viewDate?: Date): Object[] {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let startDate: Date = <Date>event[fields.startTime];
        let endDate: Date = <Date>event[fields.endTime];
        let occurrenceCollection: Object[] = [];
        let currentViewDate: Date = isNullOrUndefined(viewDate) ? this.parent.activeView.startDate() : viewDate;
        let eventRule: string = <string>event[fields.recurrenceRule];
        let duration: number = endDate.getTime() - startDate.getTime();
        currentViewDate = new Date(+currentViewDate - duration);
        let dates: number[] = generate(
            startDate, eventRule, <string>event[fields.recurrenceException], this.parent.firstDayOfWeek, undefined, currentViewDate);
        if (this.parent.currentView === 'Agenda' && eventRule.indexOf('COUNT') === -1 && eventRule.indexOf('UNTIL') === -1) {
            if (isNullOrUndefined(event.generatedDates)) {
                event.generatedDates = { start: new Date(dates[0]), end: new Date(dates[dates.length - 1]) };
            } else {
                if (dates[0] < (<Date>(<{ [key: string]: Object }>event.generatedDates).start).getTime()) {
                    (<{ [key: string]: Object }>event.generatedDates).start = new Date(dates[0]);
                }
                if (dates[dates.length - 1] > (<Date>(<{ [key: string]: Object }>event.generatedDates).end).getTime()) {
                    (<{ [key: string]: Object }>event.generatedDates).end = new Date(dates[dates.length - 1]);
                }
            }
        }
        let date: number = dates.shift();
        while (date) {
            let clonedObject: { [key: string]: Object } = <{ [key: string]: Object }>extend({}, event, null, true);
            clonedObject[fields.startTime] = new Date(date);
            clonedObject[fields.endTime] = new Date(new Date(date).setMilliseconds(duration));
            clonedObject[fields.recurrenceID] = clonedObject[fields.id];
            clonedObject.Guid = this.generateGuid();
            occurrenceCollection.push(clonedObject);
            date = dates.shift();
        }
        return occurrenceCollection;
    }

    public getRecurrenceEvent(eventData: { [key: string]: Object }): { [key: string]: Object } {
        let eventFields: EventFieldsMapping = this.parent.eventFields;
        let parentApp: { [key: string]: Object }[] = <{ [key: string]: Object }[]>new DataManager(this.parent.eventsData).
            executeLocal(new Query().where(eventFields.id, 'equal', eventData[eventFields.recurrenceID] as string | number));
        return parentApp[0];
    }

    public getOccurrencesByID(id: number | string): Object[] {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let occurrenceCollection: Object[] = [];
        let parentObject: Object[] = this.parent.eventsData.filter((obj: { [key: string]: Object }) => { return obj[fields.id] === id; });
        for (let event of parentObject as { [key: string]: Object }[]) {
            if (!isNullOrUndefined(event[fields.recurrenceRule])) {
                occurrenceCollection = occurrenceCollection.concat(this.generateOccurrence(event));
            }
        }
        return occurrenceCollection;
    }

    public getOccurrencesByRange(startTime: Date, endTime: Date): Object[] {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let occurrenceCollection: Object[] = [];
        for (let event of this.parent.eventsData as { [key: string]: Object }[]) {
            if (!isNullOrUndefined(event[fields.recurrenceRule])) {
                occurrenceCollection = occurrenceCollection.concat(this.generateOccurrence(event));
            }
        }
        let filter: Object[] = occurrenceCollection.filter((obj: { [key: string]: Object }) => {
            return obj[fields.startTime] >= startTime && obj[fields.endTime] <= endTime && !isNullOrUndefined(obj[fields.recurrenceID]);
        });
        return filter;
    }

    public applyResourceColor(
        element: HTMLElement, eventData: { [key: string]: Object }, type: string, groupOrder?: string[], alpha?: string): void {
        if (!this.parent.resourceBase) {
            return;
        }
        let alphaColor: Function = (color: string, alpha: string): string => {
            color = color.replace('#', '');
            const r: number = parseInt(color.substring(0, color.length / 3), 16);
            const g: number = parseInt(color.substring(color.length / 3, 2 * color.length / 3), 16);
            const b: number = parseInt(color.substring(2 * color.length / 3, 3 * color.length / 3), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        let color: string = this.parent.resourceBase.getResourceColor(eventData, groupOrder);
        if (color) {
            // tslint:disable-next-line:no-any
            element.style[<any>type] = !isNullOrUndefined(alpha) ? alphaColor(color, alpha) : color;
        }
    }
}