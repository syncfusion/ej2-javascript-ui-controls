/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { isNullOrUndefined, closest, extend, EventHandler } from '@syncfusion/ej2-base';
import { createElement, prepend, append, addClass, removeClass } from '@syncfusion/ej2-base';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { EventFieldsMapping, EventClickArgs, CellClickEventArgs, TdData, SelectEventArgs, InlineClickArgs, CallbackFunction } from '../base/interface';
import { Schedule } from '../base/schedule';
import { ResourcesModel } from '../models/resources-model';
import { generate, getDateFromRecurrenceDateString } from '../../recurrence-editor/date-generator';
import { CalendarType } from '../../common/calendar-util';
import * as util from '../base/util';
import * as cls from '../base/css-constant';
import * as event from '../base/constant';
/**
 * EventBase for appointment rendering
 */
export class EventBase {
    public parent: Schedule;
    public slots: number[] = [];
    public cssClass: string;
    public groupOrder: string[];
    private isDoubleTapped: boolean = false;

    /**
     * Constructor for EventBase
     *
     * @param {Schedule} parent Accepts the schedule instance
     */
    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public processData(events: Record<string, any>[], timeZonePropChanged?: boolean, oldTimezone?: string): Record<string, any>[] {
        const start: Date = this.parent.activeView.startDate();
        const end: Date = this.parent.activeView.endDate();
        const fields: EventFieldsMapping = this.parent.eventFields;
        let processed: Record<string, any>[] = [];
        let temp: number = 1;
        let generateID: boolean = false;
        const resourceCollection: ResourcesModel[] = this.parent.resourceBase ? this.parent.resourceBase.resourceCollection : [];
        if (events.length > 0 && isNullOrUndefined(events[0][fields.id])) {
            generateID = true;
        }
        for (let event of events) {
            if (generateID) {
                event[fields.id] = temp++;
            }
            event = this.updateEventDateTime(event);
            if (timeZonePropChanged) {
                this.processTimezoneChange(event, oldTimezone);
            } else if (!this.parent.isPrinting && !this.parent.uiStateValues.isResize) {
                event = this.processTimezone(event);
            }
            for (let level: number = 0; level < resourceCollection.length; level++) {
                if (event[resourceCollection[level].field] === null || event[resourceCollection[level].field] === 0) {
                    event[resourceCollection[level].field] = undefined;
                }
            }
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && event[fields.recurrenceRule] === '') {
                event[fields.recurrenceRule] = null;
            }
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && isNullOrUndefined(event[fields.recurrenceID]) &&
                !(this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction)) {
                processed = processed.concat(this.generateOccurrence(event, null, oldTimezone, true));
            } else {
                if (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction) {
                    if (!isNullOrUndefined(event[fields.recurrenceRule]) && isNullOrUndefined(event[fields.recurrenceID])) {
                        const recurrenceEvent: Record<string, any>[] = this.generateOccurrence(event, null, oldTimezone, true);
                        for (const occurrence of recurrenceEvent) {
                            const app: Record<string, any>[] = this.parent.eventsProcessed.filter((data: Record<string, Date>) =>
                                data[fields.startTime].getTime() - (<Date>occurrence[fields.startTime]).getTime() === 0 &&
                                data[fields.id] === occurrence[fields.id]);
                            occurrence.Guid = (app.length > 0) ? app[0].Guid : this.generateGuid();
                            processed.push(occurrence);
                        }
                    } else {
                        const app: Record<string, any>[] = this.parent.eventsProcessed.filter((data: Record<string, any>) =>
                            data[this.parent.eventFields.id] === event[this.parent.eventFields.id]);
                        event.Guid = (app.length > 0) ? app[0].Guid : this.generateGuid();
                        processed.push(event);
                    }
                } else {
                    event.Guid = this.generateGuid();
                    processed.push(event);
                }
            }
        }
        this.parent.eventsProcessed = [];
        const eventData: Record<string, any>[] = processed.filter((data: Record<string, any>) =>
            !data[this.parent.eventFields.isBlock]);
        this.parent.eventsProcessed = this.filterEvents(start, end, eventData);
        const blockData: Record<string, any>[] = processed.filter((data: Record<string, any>) =>
            data[this.parent.eventFields.isBlock]);
        for (const eventObj of blockData) {
            if (eventObj[fields.isAllDay]) {
                const isDifferentDate: boolean = util.resetTime(new Date((eventObj[fields.startTime] as Date).getTime())) <
                    util.resetTime(new Date((eventObj[fields.endTime] as Date).getTime()));
                if (!isDifferentDate) {
                    eventObj[fields.startTime] = util.resetTime(eventObj[fields.startTime] as Date);
                    eventObj[fields.endTime] = util.addDays(util.resetTime(eventObj[fields.endTime] as Date), 1);
                }
            }
        }
        this.parent.blockProcessed = blockData;
        return eventData;
    }

    public updateEventDateTime(eventData: Record<string, any>): Record<string, any> {
        if (typeof eventData[this.parent.eventFields.startTime] === 'string') {
            eventData[this.parent.eventFields.startTime] = util.getDateFromString(eventData[this.parent.eventFields.startTime]);
        }
        if (typeof eventData[this.parent.eventFields.endTime] === 'string') {
            eventData[this.parent.eventFields.endTime] = util.getDateFromString(eventData[this.parent.eventFields.endTime]);
        }
        return eventData;
    }

    public getProcessedEvents(eventCollection: Record<string, any>[] = this.parent.eventsData): Record<string, any>[] {
        let processed: Record<string, any>[] = [];
        for (const event of eventCollection) {
            if (!isNullOrUndefined(event[this.parent.eventFields.recurrenceRule]) &&
                isNullOrUndefined(event[this.parent.eventFields.recurrenceID])) {
                processed = processed.concat(this.generateOccurrence(event));
            } else {
                processed.push(event);
            }
        }
        return processed;
    }

    public timezonePropertyChange(oldTimezone: string): void {
        const data: Record<string, any>[] = this.parent.eventsData.concat(this.parent.blockData) as Record<string, any>[];
        const processed: Record<string, any>[] = this.processData(data, true, oldTimezone);
        this.parent.notify(event.dataReady, { processedData: processed });
    }

    public timezoneConvert(eventData: Record<string, any>): void {
        const fields: EventFieldsMapping = this.parent.eventFields;
        eventData[fields.startTimezone] = eventData[fields.startTimezone] || eventData[fields.endTimezone];
        eventData[fields.endTimezone] = eventData[fields.endTimezone] || eventData[fields.startTimezone];
        if (this.parent.timezone) {
            const startTz: string = eventData[fields.startTimezone] as string;
            const endTz: string = eventData[fields.endTimezone] as string;
            eventData[fields.startTime] = this.parent.tzModule.convert(<Date>eventData[fields.startTime], this.parent.timezone, startTz);
            eventData[fields.endTime] = this.parent.tzModule.convert(<Date>eventData[fields.endTime], this.parent.timezone, endTz);
        }
    }

    private processTimezoneChange(event: Record<string, any>, oldTimezone: string): void {
        const fields: EventFieldsMapping = this.parent.eventFields;
        if (event[fields.isAllDay]) {
            return;
        }
        if (oldTimezone && this.parent.timezone) {
            event[fields.startTime] = this.parent.tzModule.convert(<Date>event[fields.startTime], oldTimezone, this.parent.timezone);
            event[fields.endTime] = this.parent.tzModule.convert(<Date>event[fields.endTime], oldTimezone, this.parent.timezone);
        } else if (!oldTimezone && this.parent.timezone) {
            event[fields.startTime] = this.parent.tzModule.add(<Date>event[fields.startTime], this.parent.timezone);
            event[fields.endTime] = this.parent.tzModule.add(<Date>event[fields.endTime], this.parent.timezone);
        } else if (oldTimezone && !this.parent.timezone) {
            event[fields.startTime] = this.parent.tzModule.remove(<Date>event[fields.startTime], oldTimezone);
            event[fields.endTime] = this.parent.tzModule.remove(<Date>event[fields.endTime], oldTimezone);
        }
    }

    public processTimezone(event: Record<string, any>, isReverse: boolean = false): Record<string, any> {
        const fields: EventFieldsMapping = this.parent.eventFields;
        if (event[fields.startTimezone] || event[fields.endTimezone]) {
            const startTimezone: string = <string>event[fields.startTimezone] || <string>event[fields.endTimezone];
            const endTimezone: string = <string>event[fields.endTimezone] || <string>event[fields.startTimezone];
            if (isReverse) {
                if (this.parent.timezone) {
                    event[fields.startTime] = this.parent.tzModule.convert(<Date>event[fields.startTime], startTimezone, this.parent.timezone);
                    event[fields.endTime] = this.parent.tzModule.convert(<Date>event[fields.endTime], endTimezone, this.parent.timezone);
                    event[fields.startTime] = this.parent.tzModule.remove(<Date>event[fields.startTime], this.parent.timezone);
                    event[fields.endTime] = this.parent.tzModule.remove(<Date>event[fields.endTime], this.parent.timezone);
                } else {
                    event[fields.startTime] = this.parent.tzModule.remove(<Date>event[fields.startTime], startTimezone);
                    event[fields.endTime] = this.parent.tzModule.remove(<Date>event[fields.endTime], endTimezone);
                }
            } else {
                event[fields.startTime] = this.parent.tzModule.add(<Date>event[fields.startTime], startTimezone);
                event[fields.endTime] = this.parent.tzModule.add(<Date>event[fields.endTime], endTimezone);
                if (this.parent.timezone) {
                    event[fields.startTime] = this.parent.tzModule.convert(<Date>event[fields.startTime], startTimezone, this.parent.timezone);
                    event[fields.endTime] = this.parent.tzModule.convert(<Date>event[fields.endTime], endTimezone, this.parent.timezone);
                }
            }
        } else if (this.parent.timezone) {
            if (isReverse) {
                event[fields.startTime] = this.parent.tzModule.remove(<Date>event[fields.startTime], this.parent.timezone);
                event[fields.endTime] = this.parent.tzModule.remove(<Date>event[fields.endTime], this.parent.timezone);
            } else {
                event[fields.startTime] = this.parent.tzModule.add(<Date>event[fields.startTime], this.parent.timezone);
                event[fields.endTime] = this.parent.tzModule.add(<Date>event[fields.endTime], this.parent.timezone);
            }
        }
        return event;
    }

    public filterBlockEvents(eventObj: Record<string, any>): Record<string, any>[] {
        const fields: EventFieldsMapping = this.parent.eventFields;
        const eStart: Date = eventObj[fields.startTime] as Date;
        const eEnd: Date = eventObj[fields.endTime] as Date;
        let resourceData: TdData;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            const data: number = this.getGroupIndexFromEvent(eventObj);
            resourceData = this.parent.resourceBase.lastResourceLevel[data];
        }
        const blockEvents: Record<string, any>[] = <Record<string, any>[]>extend([], this.parent.blockProcessed, null, true);
        for (const eventObj of blockEvents) {
            if (eventObj[fields.isAllDay]) {
                const isDifferentTime: boolean = (eventObj[fields.endTime] as Date).getTime() >
                    util.resetTime(new Date((eventObj[fields.endTime] as Date).getTime())).getTime();
                if (isDifferentTime) {
                    eventObj[fields.startTime] = util.resetTime(eventObj[fields.startTime] as Date);
                    eventObj[fields.endTime] = util.addDays(util.resetTime(eventObj[fields.endTime] as Date), 1);
                }
            }
        }
        return this.filterEvents(eStart, eEnd, blockEvents, resourceData);
    }

    public filterEvents(startDate: Date, endDate: Date, appointments: Record<string, any>[] = this.parent.eventsProcessed, resourceTdData?: TdData): Record<string, any>[] {
        const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        const predicate: Predicate = new Predicate(fieldMapping.startTime, 'greaterthanorequal', startDate).
            and(new Predicate(fieldMapping.endTime, 'greaterthanorequal', startDate)).
            and(new Predicate(fieldMapping.startTime, 'lessthan', endDate)).
            or(new Predicate(fieldMapping.startTime, 'lessthanorequal', startDate).
                and(new Predicate(fieldMapping.endTime, 'greaterthan', startDate)));
        let filter: Record<string, any>[] = new DataManager({ json: appointments }).executeLocal(new Query().where(predicate)) as Record<string, any>[];
        if (resourceTdData) {
            filter = this.filterEventsByResource(resourceTdData, filter);
        }
        return this.sortByTime(filter);
    }

    public filterEventsByRange(eventCollection: Record<string, any>[], startDate?: Date, endDate?: Date): Record<string, any>[] {
        let filteredEvents: Record<string, any>[] = [];
        if (startDate && endDate) {
            filteredEvents = this.filterEvents(startDate, endDate, eventCollection);
        } else if (startDate && !endDate) {
            filteredEvents = eventCollection.filter((e: Record<string, any>) => e[this.parent.eventFields.startTime] >= startDate);
        } else if (!startDate && endDate) {
            filteredEvents = eventCollection.filter((e: Record<string, any>) => e[this.parent.eventFields.endTime] <= endDate);
        } else {
            filteredEvents = eventCollection;
        }
        return this.sortByTime(filteredEvents);
    }

    public filterEventsByResource(resourceTdData: TdData, appointments: Record<string, any>[] = this.parent.eventsProcessed): Record<string, any>[] {
        const predicate: Record<string, number | string> = {};
        const resourceCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        for (let level: number = 0; level < resourceCollection.length; level++) {
            predicate[resourceCollection[level].field] = resourceTdData.groupOrder[level];
        }
        const keys: string[] = Object.keys(predicate);
        const filteredCollection: Record<string, any>[] = appointments.filter((eventObj: Record<string, any>) => keys.every((key: string) => {
            if (eventObj[key] instanceof Array) {
                return (<(string | number)[]>eventObj[key]).indexOf(predicate[key]) > -1;
            } else {
                return eventObj[key] === predicate[key];
            }
        }));
        return filteredCollection;
    }

    public sortByTime(appointmentsCollection: Record<string, any>[]): Record<string, any>[] {
        if (this.parent.eventSettings.sortComparer) {
            appointmentsCollection = this.parent.eventSettings.sortComparer.call(this.parent, appointmentsCollection);
        } else {
            const fieldMappings: EventFieldsMapping = this.parent.eventFields;
            appointmentsCollection.sort((a: Record<string, any>, b: Record<string, any>) => {
                const d1: Date = a[fieldMappings.startTime] as Date;
                const d2: Date = b[fieldMappings.startTime] as Date;
                return d1.getTime() - d2.getTime();
            });
        }
        return appointmentsCollection;
    }

    public sortByDateTime(appointments: Record<string, any>[]): Record<string, any>[] {
        if (this.parent.eventSettings.sortComparer) {
            appointments = this.parent.eventSettings.sortComparer.call(this.parent, appointments);
        } else {
            const fieldMapping: EventFieldsMapping = this.parent.eventFields;
            appointments.sort((object1: Record<string, any>, object2: Record<string, any>) => {
                const d3: Date = object1[fieldMapping.startTime] as Date;
                const d4: Date = object2[fieldMapping.startTime] as Date;
                const d5: Date = object1[fieldMapping.endTime] as Date;
                const d6: Date = object2[fieldMapping.endTime] as Date;
                const d1: number = d5.getTime() - d3.getTime();
                const d2: number = d6.getTime() - d4.getTime();
                return (d3.getTime() - d4.getTime() || d2 - d1);
            });
        }
        return appointments;
    }

    public getSmallestMissingNumber(array: number[]): number {
        const large: number = Math.max(...array);
        for (let i: number = 0; i < large; i++) {
            if (array.indexOf(i) === -1) { return i; }
        }
        return large + 1;
    }

    public splitEventByDay(event: Record<string, any>): Record<string, any>[] {
        const eventFields: EventFieldsMapping = this.parent.eventFields;
        const data: Record<string, any>[] = [];
        const eventStartTime: Date = event[eventFields.startTime] as Date;
        const eventEndTime: Date = event[eventFields.endTime] as Date;
        const isDifferentDate: boolean = util.resetTime(new Date(eventStartTime.getTime())) <
            util.resetTime(new Date(eventEndTime.getTime()));
        if (isDifferentDate) {
            let start: Date = new Date(eventStartTime.getTime());
            let end: Date = util.addDays(util.resetTime(new Date(eventStartTime.getTime())), 1);
            const endDate: Date = (eventEndTime.getHours() === 0 && eventEndTime.getMinutes() === 0) ?
                eventEndTime : util.addDays(eventEndTime, 1);
            let index: number = 1;
            const eventLength: number = util.getDaysCount(eventStartTime.getTime(), endDate.getTime());
            while (end <= eventEndTime && start.getTime() !== end.getTime()) {
                const app: Record<string, any> = <Record<string, any>>extend({}, event);
                app[eventFields.startTime] = start;
                app[eventFields.endTime] = end;
                app.data = { index: index, count: eventLength };
                app.Guid = this.generateGuid();
                app.isSpanned = true;
                data.push(app);
                start = end;
                if ((util.resetTime(new Date(start.getTime())).getTime() === util.resetTime(new Date(eventEndTime.getTime())).getTime())
                    && !(end.getTime() === eventEndTime.getTime())) {
                    end = new Date(start.getTime());
                    end = new Date(end.setHours(eventEndTime.getHours(), eventEndTime.getMinutes(), eventEndTime.getSeconds()));
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

    public splitEvent(event: Record<string, any>, dateRender: Date[]): Record<string, any>[] {
        const fields: EventFieldsMapping = this.parent.eventFields;
        let start: number = util.resetTime(event[fields.startTime]).getTime();
        let end: number = util.resetTime(event[fields.endTime]).getTime();
        if (util.getDateInMs(event[fields.endTime] as Date) <= 0) {
            const temp: number = util.addDays(util.resetTime(event[fields.endTime]), -1).getTime();
            end = start > temp ? start : temp;
        }
        const orgStart: number = start;
        const orgEnd: number = end;
        const ranges: Record<string, any>[] = [];
        if (start !== end) {
            if (start < dateRender[0].getTime()) {
                start = dateRender[0].getTime();
            }
            if (end > dateRender[dateRender.length - 1].getTime()) {
                end = dateRender[dateRender.length - 1].getTime();
            }
            let cStart: number = start;
            for (let level: number = 0; level < this.slots.length; level++) {
                let slot: number[] = <[number]><unknown>this.slots[level];
                if (this.parent.currentView === 'WorkWeek' || this.parent.currentView === 'TimelineWorkWeek'
                    || this.parent.activeViewOptions.group.byDate || this.parent.activeViewOptions.showWeekend) {
                    const slotDates: Date[] = [];
                    for (const s of slot) {
                        slotDates.push(new Date(s));
                    }
                    const renderedDates: Date[] = this.getRenderedDates(slotDates);
                    if (!isNullOrUndefined(renderedDates) && renderedDates.length > 0) {
                        slot = [];
                        for (const date of renderedDates) {
                            slot.push(date.getTime());
                        }
                    }
                }
                if (typeof (slot) === 'number') {
                    const temp: number = slot;
                    slot = [];
                    slot.push(temp);
                }
                const firstSlot: number = <number>slot[0];
                cStart = (cStart <= firstSlot && end >= firstSlot) ? firstSlot : cStart;
                if (cStart > end || firstSlot > end) {
                    break;
                }
                if (!this.parent.activeViewOptions.group.byDate && this.parent.activeViewOptions.showWeekend &&
                    this.parent.currentView !== 'WorkWeek' && this.parent.currentView !== 'TimelineWorkWeek') {
                    const startIndex: number = slot.indexOf(cStart);
                    if (startIndex !== -1) {
                        let endIndex: number = slot.indexOf(end);
                        const hasBreak: boolean = endIndex !== -1;
                        endIndex = hasBreak ? endIndex : slot.length - 1;
                        const count: number = ((endIndex - startIndex) + 1);
                        const isLeft: boolean = (slot[startIndex] !== orgStart);
                        const isRight: boolean = (slot[endIndex] !== orgEnd);
                        ranges.push(this.cloneEventObject(event, slot[startIndex], slot[endIndex], count, isLeft, isRight));
                        if (hasBreak) {
                            break;
                        }
                    }
                } else {
                    if (this.dateInRange(cStart, slot[0], slot[slot.length - 1])) {
                        const availSlot: number[] = [];
                        for (let i: number = 0; i < slot.length; i++) {
                            if (this.dateInRange(<number>slot[i], orgStart, orgEnd)) {
                                availSlot.push(slot[i]);
                            }
                        }
                        if (availSlot.length > 0) {
                            if (!this.parent.activeViewOptions.group.byDate) {
                                const isLeft: boolean = (availSlot[0] !== orgStart);
                                const isRight: boolean = (availSlot[availSlot.length - 1] !== orgEnd);
                                ranges.push(this.cloneEventObject(
                                    event, availSlot[0], availSlot[availSlot.length - 1], availSlot.length, isLeft, isRight));
                            } else {
                                for (const slot of availSlot) {
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

    public cloneEventObject(event: Record<string, any>, start: number, end: number, count: number, isLeft: boolean, isRight: boolean): Record<string, any> {
        const fields: EventFieldsMapping = this.parent.eventFields;
        const e: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
        const data: Record<string, any> = { count: count, isLeft: isLeft, isRight: isRight };
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
            const isAlreadySelected: Element[] = this.parent.selectedElements.filter((element: HTMLElement) =>
                element.getAttribute('data-guid') === target.getAttribute('data-guid'));
            if (isAlreadySelected.length <= 0) {
                const elementSelector: string = 'div[data-guid="' + target.getAttribute('data-guid') + '"]';
                const focusElements: Element[] = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
                for (const element of focusElements) {
                    this.parent.selectedElements.push(element);
                }
            } else {
                const selectedElements: Element[] = this.parent.selectedElements.filter((element: HTMLElement) =>
                    element.getAttribute('data-guid') !== target.getAttribute('data-guid'));
                this.parent.selectedElements = selectedElements;
            }
        }
        if (target && this.parent.selectedElements.length > 0) {
            this.addSelectedAppointments(this.parent.selectedElements);
        }
        return this.parent.selectedElements;
    }

    public getSelectedEvents(): EventClickArgs {
        const eventSelect: Record<string, any>[] = [];
        const elementSelect: HTMLElement[] = [];
        const selectAppointments: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
        selectAppointments.filter((element: HTMLElement) => {
            const isAlreadyAdded: Record<string, any>[] = eventSelect.filter((event: Record<string, any>) => {
                return event.Guid === element.getAttribute('data-guid');
            });
            if (isAlreadyAdded.length === 0) {
                eventSelect.push(this.getEventByGuid(element.getAttribute('data-guid')));
            }
            elementSelect.push(element);
        });
        return {
            event: eventSelect.length > 1 ? eventSelect : eventSelect[0],
            element: elementSelect.length > 1 ? elementSelect : elementSelect[0]
        } as EventClickArgs;
    }

    public removeSelectedAppointmentClass(): void {
        const selectedAppointments: Element[] = this.getSelectedAppointments();
        for (const appointment of selectedAppointments) {
            appointment.setAttribute('aria-selected', 'false');
        }
        removeClass(selectedAppointments, cls.APPOINTMENT_BORDER);
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            removeClass(selectedAppointments, cls.AGENDA_SELECTED_CELL);
        }
    }

    public addSelectedAppointments(cells: Element[]): void {
        for (const cell of cells) {
            cell.setAttribute('aria-selected', 'true');
        }
        if (this.parent.currentView !== 'MonthAgenda') {
            this.parent.removeSelectedClass();
        }
        addClass(cells, cls.APPOINTMENT_BORDER);
        if (cells.length > 0) {
            (cells[cells.length - 1] as HTMLElement).focus();
        }
    }

    public getSelectedAppointments(): Element[] {
        return [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER + ',.' + cls.APPOINTMENT_CLASS + ':focus'));
    }

    public focusElement(isFocused?: boolean): void {
        if (this.parent.eventWindow.dialogObject && this.parent.eventWindow.dialogObject.visible) {
            return;
        }
        const activeEle: Element = document.activeElement;
        const selectedCell: Element[] = this.parent.getSelectedElements();
        if (selectedCell.length > 0 && ((activeEle && (this.parent.element.contains(activeEle) ||
            selectedCell.indexOf(activeEle) !== -1)) || isFocused)) {
            if (this.parent.keyboardInteractionModule) {
                const target: HTMLTableCellElement = ((!isNullOrUndefined(this.parent.activeCellsData) &&
                    this.parent.activeCellsData.element) || selectedCell[selectedCell.length - 1]) as HTMLTableCellElement;
                this.parent.keyboardInteractionModule.selectCells(target instanceof Array, target);
            }
            return;
        }
        const selectedAppointments: Element[] = this.getSelectedAppointments();
        if (selectedAppointments.length > 0) {
            (selectedAppointments[selectedAppointments.length - 1] as HTMLElement).focus();
            return;
        }
    }

    public selectWorkCellByTime(eventsData: Record<string, any>[]): Element {
        let target: Element;
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            return target;
        }
        if (eventsData.length > 0) {
            const selectedObject: Record<string, any> = eventsData[eventsData.length - 1];
            const eventStartTime: Date = <Date>selectedObject[this.parent.eventFields.startTime];
            let nearestTime: number = new Date(+eventStartTime).setMinutes(0, 0, 0);
            const isAllDay: boolean = this.isAllDayAppointment(selectedObject);
            if (this.parent.currentView === 'Month' || isAllDay) {
                nearestTime = new Date(+eventStartTime).setHours(0, 0, 0, 0);
            }
            let targetArea: Element;
            if (isAllDay && ['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) !== -1) {
                targetArea = this.parent.getAllDayRow();
            } else {
                targetArea = this.parent.getContentTable();
            }
            let queryString: string = '[data-date="' + new Date(nearestTime).getTime() + '"]';
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

    public getGroupIndexFromEvent(eventData: Record<string, any>): number {
        let levelIndex: number;
        let resource: ResourcesModel;
        let levelName: string;
        let idField: string;
        for (let i: number = this.parent.resourceBase.resourceCollection.length - 1; i >= 0; i--) {
            const resourceData: Record<string, any> | string | number = eventData[this.parent.resourceBase.resourceCollection[i].field] as Record<string, any>;
            if (!isNullOrUndefined(resourceData)) {
                resource = this.parent.resourceBase.resourceCollection[i];
                levelIndex = i;
                levelName = resource.name;
                idField = resource.field;
                break;
            }
        }
        if (isNullOrUndefined(levelName) && isNullOrUndefined(levelIndex)) {
            levelName = this.parent.resourceCollection.slice(-1)[0].name;
            levelIndex = this.parent.resourceCollection.length - 1;
            idField = this.parent.resourceCollection.slice(-1)[0].field;
            resource = this.parent.resourceCollection.filter((e: ResourcesModel, index: number) => {
                if (e.name === levelName) {
                    levelIndex = index;
                    return e;
                }
                return null;
            })[0];
        }
        const id: number = ((eventData[idField] instanceof Array) ?
            (eventData[idField] as Record<string, any>)[0] : eventData[idField]) as number;
        if (levelIndex > 0) {
            const parentField: string = this.parent.resourceCollection[levelIndex - 1].field;
            return this.parent.resourceBase.getIndexFromResourceId(id, levelName, resource, eventData, parentField);
        } else {
            return this.parent.resourceBase.getIndexFromResourceId(id, levelName, resource);
        }
    }

    public isAllDayAppointment(event: Record<string, any>): boolean {
        const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        const isAllDay: boolean = event[fieldMapping.isAllDay] as boolean;
        const isFullDay: boolean = ((util.getUniversalTime(<Date>event[fieldMapping.endTime]) - util.getUniversalTime(<Date>event[fieldMapping.startTime]))
            / util.MS_PER_DAY) >= 1;
        return (isAllDay || (this.parent.eventSettings.spannedEventPlacement !== 'TimeSlot' && isFullDay)) ? true : false;
    }

    public addEventListener(): void {
        this.parent.on(event.documentClick, this.appointmentBorderRemove, this);
    }

    public removeEventListener(): void {
        this.parent.off(event.documentClick, this.appointmentBorderRemove);
    }

    private appointmentBorderRemove(event: Event & CellClickEventArgs): void {
        const element: HTMLElement = event.event.target as HTMLElement;
        if (closest(element as Element, '.' + cls.APPOINTMENT_CLASS)) {
            if (this.parent.currentView !== 'MonthAgenda') {
                this.parent.removeSelectedClass();
            }
        } else if (!closest(element as Element, '.' + cls.POPUP_OPEN)) {
            this.removeSelectedAppointmentClass();
            this.parent.selectedElements = [];
        }
    }

    public wireAppointmentEvents(element: HTMLElement, event?: Record<string, any>, isPreventCrud: boolean = false): void {
        const isReadOnly: boolean = (!isNullOrUndefined(event)) ? event[this.parent.eventFields.isReadonly] as boolean : false;
        EventHandler.add(element, 'click', this.eventClick, this);
        if (!this.parent.isAdaptive && !this.parent.activeViewOptions.readonly && !isReadOnly) {
            EventHandler.add(element, 'touchstart', this.eventTouchClick, this);
            EventHandler.add(element, 'dblclick', this.eventDoubleClick, this);
        }
        if (!this.parent.activeViewOptions.readonly && !isReadOnly && !isPreventCrud) {
            if (this.parent.resizeModule) {
                this.parent.resizeModule.wireResizeEvent(element);
            }
            if (this.parent.dragAndDropModule) {
                this.parent.dragAndDropModule.wireDragEvent(element);
            }
        }
    }

    private eventTouchClick(e: Event): void {
        setTimeout(() => this.isDoubleTapped = false, 250);
        e.preventDefault();
        if (this.isDoubleTapped) {
            this.eventDoubleClick(e);
        } else if (!this.isDoubleTapped) {
            this.isDoubleTapped = true;
            this.eventClick(e as Event & MouseEvent);
        }
    }

    public renderResizeHandler(element: HTMLElement, spanEvent: Record<string, any>, isReadOnly: boolean): void {
        if (!this.parent.resizeModule || !this.parent.allowResizing || this.parent.activeViewOptions.readonly || isReadOnly) {
            return;
        }
        for (const resizeEdge of Object.keys(spanEvent)) {
            const resizeHandler: HTMLElement = createElement('div', { className: cls.EVENT_RESIZE_CLASS });
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
        const target: HTMLElement = eventData.target as HTMLElement;
        if (target.classList.contains(cls.DRAG_CLONE_CLASS) || target.classList.contains(cls.RESIZE_CLONE_CLASS) ||
            target.classList.contains(cls.INLINE_SUBJECT_CLASS)) {
            return;
        }
        if ((eventData.ctrlKey || eventData.metaKey) && eventData.which === 1 && this.parent.keyboardInteractionModule) {
            this.parent.quickPopup.quickPopup.hide();
            this.parent.selectedElements = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
            const target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS) as Element;
            this.getSelectedEventElements(target);
            this.activeEventData(eventData, false);
            const selectArgs: SelectEventArgs = {
                data: this.parent.activeEventData.event,
                element: this.parent.activeEventData.element,
                event: eventData, requestType: 'eventSelect'
            };
            this.parent.trigger(event.select, selectArgs);
            const args: EventClickArgs = <EventClickArgs>extend(this.parent.activeEventData, { cancel: false, originalEvent: eventData });
            this.parent.trigger(event.eventClick, args);
        } else {
            this.removeSelectedAppointmentClass();
            this.activeEventData(eventData, true);
            const selectEventArgs: SelectEventArgs = {
                data: this.parent.activeEventData.event,
                element: this.parent.activeEventData.element,
                event: eventData, requestType: 'eventSelect'
            };
            this.parent.trigger(event.select, selectEventArgs);
            const args: EventClickArgs = <EventClickArgs>extend(this.parent.activeEventData, { cancel: false, originalEvent: eventData });
            this.parent.trigger(event.eventClick, args, (eventClickArgs: EventClickArgs) => {
                if (eventClickArgs.cancel) {
                    this.removeSelectedAppointmentClass();
                    this.parent.selectedElements = [];
                    if (this.parent.quickPopup) {
                        this.parent.quickPopup.quickPopupHide();
                    }
                } else {
                    if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
                        addClass([this.parent.activeEventData.element as Element], cls.AGENDA_SELECTED_CELL);
                    }
                    if (this.parent.allowInline) {
                        const inlineArgs: InlineClickArgs = {
                            data: eventClickArgs.event as Record<string, any>,
                            element: eventClickArgs.element as HTMLElement,
                            type: 'Event'
                        };
                        this.parent.notify(event.inlineClick, inlineArgs);
                    } else {
                        this.parent.notify(event.eventClick, eventClickArgs);
                    }
                }
            });
        }
    }

    private eventDoubleClick(e: Event): void {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide(true);
        }
        if (e.type === 'touchstart') {
            this.activeEventData(e, true);
        }
        this.removeSelectedAppointmentClass();
        this.parent.selectedElements = [];
        if ((this.parent.activeEventData.element as HTMLElement).classList.contains(cls.INLINE_APPOINTMENT_CLASS) ||
            (this.parent.activeEventData.element as HTMLElement).querySelector('.' + cls.INLINE_SUBJECT_CLASS)) {
            return;
        }
        if (!isNullOrUndefined(this.parent.activeEventData.event) &&
            isNullOrUndefined((<Record<string, any>>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceID])) {
            this.parent.eventWindow.openEditor(this.parent.activeEventData.event as Record<string, any>, 'Save');
        } else {
            this.parent.currentAction = 'EditOccurrence';
            this.parent.quickPopup.openRecurrenceAlert();
        }
    }

    public getEventByGuid(guid: string): Record<string, any> {
        return this.parent.eventsProcessed.filter((data: Record<string, any>) => data.Guid === guid)[0];
    }

    public getEventById(id: number | string): Record<string, any> {
        return this.parent.eventsData.filter((data: Record<string, any>) =>
            data[this.parent.eventFields.id] === id)[0] as Record<string, any>;
    }

    public generateGuid(): string {
        return 'xyxxxxyx-xxxy-yxxx-xyxx-xxyxxxxyyxxx'.replace(/[xy]/g, (c: string) => {
            const r: number = Math.random() * 16 | 0;
            const v: number = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public getEventIDType(): string {
        if (this.parent.eventsData.length !== 0) {
            return typeof ((<Record<string, any>>this.parent.eventsData[0])[this.parent.eventFields.id]);
        }
        if (this.parent.blockData.length !== 0) {
            return typeof ((<Record<string, any>>this.parent.blockData[0])[this.parent.eventFields.id]);
        }
        return 'string';
    }

    public getEventMaxID(resourceId?: number): number | string {
        if (this.parent.eventsData.length < 1 && this.parent.blockData.length < 1) {
            return 1;
        }
        let eventId: string | number;
        const idType: string = this.getEventIDType();
        if (idType === 'string') {
            eventId = this.generateGuid();
        }
        if (idType === 'number') {
            const datas: Record<string, number>[] = this.parent.eventsData.concat(this.parent.blockData) as Record<string, number>[];
            let maxId: number = Math.max(...datas.map((event: Record<string, number>) => event[this.parent.eventFields.id]));
            maxId = isNullOrUndefined(resourceId) ? maxId : maxId + resourceId;
            eventId = maxId + 1;
        }
        return eventId;
    }

    private activeEventData(eventData: Event, isMultiple: boolean): void {
        const target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS);
        const guid: string = target.getAttribute('data-guid');
        if (isMultiple) {
            this.addSelectedAppointments([].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]')));
            (target as HTMLElement).focus();
        }
        let eventObject: Record<string, any> = this.getEventByGuid(guid);
        if (eventObject && eventObject.isSpanned) {
            eventObject = this.parent.eventsData.filter((obj: Record<string, any>) =>
                obj[this.parent.eventFields.id] === eventObject[this.parent.eventFields.id])[0];
        }
        this.parent.activeEventData = { event: eventObject, element: target } as EventClickArgs;
    }

    public generateOccurrence(event: Record<string, any>, viewDate?: Date, oldTimezone?: string, isMaxCount?: boolean): Record<string, any>[] {
        const startDate: Date = event[this.parent.eventFields.startTime] as Date;
        const endDate: Date = event[this.parent.eventFields.endTime] as Date;
        const eventRule: string = event[this.parent.eventFields.recurrenceRule] as string;
        const duration: number = endDate.getTime() - startDate.getTime();
        viewDate = new Date((viewDate || this.parent.activeView.startDate()).getTime() - duration);
        const exception: string = event[this.parent.eventFields.recurrenceException] as string;
        let maxCount: number;
        if (this.parent.currentView !== 'Agenda' && isMaxCount) {
            maxCount = util.getDateCount(this.parent.activeView.startDate(), this.parent.activeView.endDate()) + 1;
        }
        const newTimezone: string = this.parent.timezone || this.parent.tzModule.getLocalTimezoneName();
        const firstDay: number = this.parent.activeViewOptions.firstDayOfWeek;
        const calendarMode: CalendarType = this.parent.calendarMode;
        const dates: number[] =
            generate(startDate, eventRule, exception, firstDay, maxCount, viewDate, calendarMode, oldTimezone, newTimezone);
        if (this.parent.currentView === 'Agenda' && eventRule.indexOf('COUNT') === -1 && eventRule.indexOf('UNTIL') === -1) {
            if (isNullOrUndefined(event.generatedDates)) {
                event.generatedDates = { start: new Date(dates[0]), end: new Date(dates[dates.length - 1]) };
            } else {
                if (dates[0] < (<Date>(<Record<string, any>>event.generatedDates).start).getTime()) {
                    (<Record<string, any>>event.generatedDates).start = new Date(dates[0]);
                }
                if (dates[dates.length - 1] > (<Date>(<Record<string, any>>event.generatedDates).end).getTime()) {
                    (<Record<string, any>>event.generatedDates).end = new Date(dates[dates.length - 1]);
                }
            }
        }
        const occurrenceCollection: Record<string, any>[] = [];
        for (const date of dates) {
            const clonedObject: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
            clonedObject[this.parent.eventFields.startTime] = new Date(date);
            clonedObject[this.parent.eventFields.endTime] = new Date(new Date(date).setMilliseconds(duration));
            clonedObject[this.parent.eventFields.recurrenceID] = clonedObject[this.parent.eventFields.id];
            delete clonedObject[this.parent.eventFields.recurrenceException];
            delete clonedObject[this.parent.eventFields.followingID];
            clonedObject.Guid = this.generateGuid();
            occurrenceCollection.push(clonedObject);
        }
        return occurrenceCollection;
    }

    public getParentEvent(eventObj: Record<string, any>, isParent: boolean = false): Record<string, any> {
        let parentEvent: Record<string, any>;
        do {
            eventObj = this.getFollowingEvent(eventObj);
            if (eventObj) {
                parentEvent = extend({}, eventObj, null, true) as Record<string, any>;
            }
        } while (eventObj && isParent);
        if (isParent && parentEvent) {
            const collection: Record<string, unknown[]> = this.getEventCollections(parentEvent);
            let followObj: Record<string, any> = collection.follow.slice(-1)[0] as Record<string, any>;
            if (collection.occurrence.length > 0 && !parentEvent[this.parent.eventFields.recurrenceException]) {
                followObj = collection.occurrence.slice(-1)[0] as Record<string, any>;
            }
            if (followObj) {
                parentEvent[this.parent.eventFields.recurrenceRule] = followObj[this.parent.eventFields.recurrenceRule];
            }
        }
        return parentEvent;
    }

    public getEventCollections(parentObj: Record<string, any>, childObj?: Record<string, any>): { [key: string]: Record<string, any>[] } {
        const followingCollection: Record<string, any>[] = [];
        let occurrenceCollection: Record<string, any>[] = [];
        let followingEvent: Record<string, any> = parentObj;
        do {
            followingEvent = this.getFollowingEvent(followingEvent, true);
            if (followingEvent) {
                followingCollection.push(followingEvent);
            }
            occurrenceCollection = occurrenceCollection.concat(this.getOccurrenceEvent(followingEvent || parentObj));
        } while (followingEvent);
        let collections: { [key: string]: Record<string, any>[] } = {};
        if (childObj) {
            const fields: EventFieldsMapping = this.parent.eventFields;
            collections = {
                follow: followingCollection.filter((eventData: Record<string, any>) =>
                    eventData[fields.startTime] >= childObj[fields.startTime]),
                occurrence: occurrenceCollection.filter((eventData: Record<string, any>) =>
                    eventData[fields.startTime] >= childObj[fields.startTime])
            };
        } else {
            collections = { follow: followingCollection, occurrence: occurrenceCollection };
        }
        return collections;
    }

    public getFollowingEvent(parentObj: Record<string, any>, isReverse?: boolean): Record<string, any> {
        const fields: EventFieldsMapping = this.parent.eventFields;
        let fieldValue: string | number;
        if (isReverse) {
            fieldValue = parentObj[fields.id] as string | number;
        } else {
            fieldValue = (parentObj[fields.recurrenceID] || parentObj[fields.followingID]) as string | number;
        }
        const parentApp: Record<string, any>[] = this.parent.eventsData.filter((data: Record<string, any>) =>
            data[isReverse ? fields.followingID : fields.id] === fieldValue);
        return parentApp.shift() as Record<string, any>;
    }

    public isFollowingEvent(parentObj: Record<string, any>, childObj: Record<string, any>): boolean {
        const parentStart: Date = parentObj[this.parent.eventFields.startTime] as Date;
        const childStart: Date = childObj[this.parent.eventFields.startTime] as Date;
        return parentStart.getHours() === childStart.getHours() && parentStart.getMinutes() === childStart.getMinutes() &&
            parentStart.getSeconds() === childStart.getSeconds();
    }

    public getOccurrenceEvent(eventObj: Record<string, any>, isGuid: boolean = false, isFollowing: boolean = false): Record<string, any>[] {
        const idField: string = isGuid ? 'Guid' : (isFollowing) ? this.parent.eventFields.followingID : this.parent.eventFields.recurrenceID;
        const fieldKey: string = isGuid ? 'Guid' : this.parent.eventFields.id;
        const dataSource: Record<string, any>[] = isGuid ? this.parent.eventsProcessed : this.parent.eventsData;
        return dataSource.filter((data: Record<string, any>) => data[idField] === eventObj[fieldKey]);
    }

    public getOccurrencesByID(id: number | string): Record<string, any>[] {
        const fields: EventFieldsMapping = this.parent.eventFields;
        let occurrenceCollection: Record<string, any>[] = [];
        const parentObject: Record<string, any>[] = this.parent.eventsData.filter((obj: Record<string, any>) => obj[fields.id] === id);
        for (const event of parentObject) {
            if (!isNullOrUndefined(event[fields.recurrenceRule])) {
                occurrenceCollection = occurrenceCollection.concat(this.generateOccurrence(event));
            }
        }
        return occurrenceCollection;
    }

    public getOccurrencesByRange(startTime: Date, endTime: Date): Record<string, any>[] {
        const fields: EventFieldsMapping = this.parent.eventFields;
        let occurrenceCollection: Record<string, any>[] = [];
        for (const event of this.parent.eventsData) {
            if (!isNullOrUndefined(event[fields.recurrenceRule])) {
                occurrenceCollection = occurrenceCollection.concat(this.generateOccurrence(event));
            }
        }
        const filter: Record<string, any>[] = occurrenceCollection.filter((obj: Record<string, any>) =>
            obj[fields.startTime] >= startTime && obj[fields.endTime] <= endTime && !isNullOrUndefined(obj[fields.recurrenceID]));
        return filter;
    }

    public getDeletedOccurrences(recurrenceData: string | number | Record<string, any>): Record<string, any>[] {
        const fields: EventFieldsMapping = this.parent.eventFields;
        let parentObject: Record<string, any>;
        const deletedOccurrences: Record<string, any>[] = [];
        if (typeof recurrenceData === 'string' || typeof recurrenceData === 'number') {
            parentObject = this.parent.eventsData.filter((obj: Record<string, any>) =>
                obj[fields.id] === recurrenceData)[0] as Record<string, any>;
        } else {
            parentObject = extend({}, recurrenceData, null, true) as Record<string, any>;
        }
        if (parentObject[fields.recurrenceException]) {
            const exDateString: string[] = (<string>parentObject[fields.recurrenceException]).split(',');
            for (let i: number = 0, len: number = exDateString.length; i < len; i++) {
                const edited: Record<string, any>[] = this.parent.eventsData.filter((eventObj: Record<string, any>) =>
                    eventObj[fields.recurrenceID] === parentObject[fields.id] && eventObj[fields.recurrenceException] === exDateString[i]);
                if (edited.length === 0) {
                    const exDate: Date = getDateFromRecurrenceDateString(exDateString[i]);
                    const childObject: Record<string, any> = extend({}, recurrenceData, null, true) as Record<string, any>;
                    childObject[fields.recurrenceID] = parentObject[fields.id];
                    delete childObject[fields.followingID];
                    childObject[fields.recurrenceException] = exDateString[i];
                    const startDate: Date = new Date(exDate.getTime());
                    const time: number = (<Date>parentObject[fields.endTime]).getTime() - (<Date>parentObject[fields.startTime]).getTime();
                    const endDate: Date = new Date(startDate.getTime());
                    endDate.setMilliseconds(time);
                    childObject[fields.startTime] = new Date(startDate.getTime());
                    childObject[fields.endTime] = new Date(endDate.getTime());
                    deletedOccurrences.push(childObject);
                }
            }
        }
        return deletedOccurrences;
    }

    public applyResourceColor(element: HTMLElement, data: Record<string, any>, type: string, index?: string[], alpha?: string): void {
        if (!this.parent.resourceBase) {
            return;
        }
        const alphaColor: CallbackFunction = (color: string, alpha: string): string => {
            color = color.replace('#', '');
            const r: number = parseInt(color.substring(0, color.length / 3), 16);
            const g: number = parseInt(color.substring(color.length / 3, 2 * color.length / 3), 16);
            const b: number = parseInt(color.substring(2 * color.length / 3, 3 * color.length / 3), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        // index refers groupOrder
        const color: string = this.parent.resourceBase.getResourceColor(data, index);
        if (color) {
            element.style[<any>type] = !isNullOrUndefined(alpha) ? alphaColor(color, alpha) : color;
        }
    }

    public createBlockAppointmentElement(record: Record<string, any>, resIndex: number): HTMLElement {
        const eventSubject: string = (record[this.parent.eventFields.subject] || this.parent.eventSettings.fields.subject.default) as string;
        const appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.BLOCK_APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.parent.eventFields.id],
                'aria-readonly': 'true', 'aria-selected': 'false'
            }
        });
        let templateElement: HTMLElement[];
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            const scheduleId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.eventTemplateName;
            const templateId: string = scheduleId + viewName + 'eventTemplate';
            const templateName: string = 'eventTemplate' + (this.parent.activeViewOptions.group.resources.length > 0 &&
                this.parent.currentView.indexOf('Year') === -1 ? '_' + resIndex : '');
            templateElement = this.parent.getAppointmentTemplate()(record, this.parent, templateName, templateId, false);
        } else {
            const appointmentSubject: HTMLElement = createElement('div', {
                className: cls.SUBJECT_CLASS, innerHTML: eventSubject
            });
            templateElement = [appointmentSubject];
        }
        append(templateElement, appointmentWrapper);
        this.setWrapperAttributes(appointmentWrapper, resIndex);
        return appointmentWrapper;
    }

    public setWrapperAttributes(appointmentWrapper: HTMLElement, resIndex: number): void {
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
    }

    public getReadonlyAttribute(event: Record<string, any>): string {
        return (event[this.parent.eventFields.isReadonly] || this.parent.readonly).toString();
    }

    public isBlockRange(eventData: Record<string, any> | Record<string, any>[]): boolean {
        const eventCollection: Record<string, any>[] = (eventData instanceof Array) ? eventData : [eventData];
        let isBlockAlert: boolean = false;
        const fields: EventFieldsMapping = this.parent.eventFields;
        for (const event of eventCollection as Record<string, any>[]) {
            let dataCol: Record<string, any>[] = [];
            if (!isNullOrUndefined(event[fields.recurrenceRule]) &&
                (isNullOrUndefined(event[fields.recurrenceID]) || event[fields.id] === event[fields.recurrenceID])) {
                dataCol = this.generateOccurrence(event);
            } else {
                dataCol.push(event);
            }
            for (const data of dataCol) {
                const filterBlockEvents: Record<string, any>[] = this.filterBlockEvents(data);
                if (filterBlockEvents.length > 0) {
                    isBlockAlert = true;
                    break;
                }
            }
        }
        this.parent.uiStateValues.isBlock = isBlockAlert;
        return isBlockAlert;
    }

    public getFilterEventsList(dataSource: Record<string, any>[], query: Predicate): Record<string, any>[] {
        return new DataManager(dataSource).executeLocal(new Query().where(query)) as Record<string, any>[];
    }

    public getSeriesEvents(parentEvent: Record<string, any>, startTime?: string): Record<string, any>[] {
        const fields: EventFieldsMapping = this.parent.eventFields;
        startTime = isNullOrUndefined(startTime) ? parentEvent[fields.startTime] as string : startTime;
        let deleteFutureEditEvents: Record<string, any>;
        let futureEvents: Record<string, any>[];
        const deleteFutureEditEventList: Record<string, any>[] = [];
        let delId: string = parentEvent[fields.id] as string;
        let followingId: string = parentEvent[fields.followingID] as string;
        let deleteFutureEvent: Predicate;
        const startTimeQuery: string = this.parent.currentAction === 'EditSeries' ? 'greaterthan' : 'greaterthanorequal';
        do {
            deleteFutureEvent = ((new Predicate(fields.followingID, 'equal', delId))).
                and(new Predicate(fields.startTime, startTimeQuery, startTime));
            futureEvents = this.getFilterEventsList(this.parent.eventsData, deleteFutureEvent);
            deleteFutureEditEvents = futureEvents.slice(-1)[0];
            if (!isNullOrUndefined(deleteFutureEditEvents) && deleteFutureEditEvents[fields.id] !== followingId) {
                deleteFutureEditEventList.push(deleteFutureEditEvents);
                delId = deleteFutureEditEvents[fields.id] as string;
                followingId = deleteFutureEditEvents[fields.followingID] as string;
            } else { followingId = null; }
        } while (futureEvents.length === 1 && !isNullOrUndefined(deleteFutureEditEvents[fields.followingID]));
        return deleteFutureEditEventList;
    }

    public getEditedOccurrences(deleteFutureEditEventList: Record<string, any>[], startTime?: string): Record<string, any>[] {
        const fields: EventFieldsMapping = this.parent.eventFields;
        let deleteRecurrenceEventList: Record<string, any>[] = [];
        let delEditedEvents: Record<string, any>[];
        for (const event of deleteFutureEditEventList) {
            let delEventQuery: Predicate = new Predicate(fields.recurrenceID, 'equal', event[fields.id] as string).
                or(new Predicate(fields.recurrenceID, 'equal', event[fields.followingID] as string).
                    and(new Predicate(fields.recurrenceID, 'notequal', undefined)).
                    and(new Predicate(fields.recurrenceID, 'notequal', null)));
            if (this.parent.currentAction === 'EditFollowingEvents' || this.parent.currentAction === 'DeleteFollowingEvents') {
                delEventQuery = delEventQuery.and(new Predicate(fields.startTime, 'greaterthanorequal', startTime));
            }
            delEditedEvents = this.getFilterEventsList(this.parent.eventsData, delEventQuery);
            deleteRecurrenceEventList = deleteRecurrenceEventList.concat(delEditedEvents);
        }
        return deleteRecurrenceEventList;
    }

    public getRenderedDates(dateRender: Date[]): Date[] {
        let firstDate: number = 0;
        let lastDate: number = dateRender.length;
        let filteredDates: Date[];
        if (dateRender[0] < this.parent.minDate && dateRender[dateRender.length - 1] > this.parent.maxDate) {
            for (let i: number = 0; i < dateRender.length; i++) {
                if (util.resetTime(dateRender[i]).getTime() === util.resetTime(new Date(this.parent.minDate)).getTime()) {
                    firstDate = i;
                }
                if (util.resetTime(dateRender[i]).getTime() === util.resetTime(new Date(this.parent.maxDate)).getTime()) {
                    lastDate = i;
                }
            }
            filteredDates = dateRender.filter((date: Date) => date >= dateRender[firstDate] && date <= dateRender[lastDate]);
        }
        return filteredDates;
    }

    public isValidEvent(eventObj: Record<string, any>, start: Date, end: Date, schedule: { [key: string]: Date }): boolean {
        const isHourRange: boolean = end.getTime() > schedule.startHour.getTime() && start.getTime() < schedule.endHour.getTime();
        const isSameRange: boolean = schedule.startHour.getTime() <= start.getTime() &&
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime() >= schedule.startHour.getTime() &&
            (<Date>eventObj[this.parent.eventFields.endTime]).getTime() < schedule.endHour.getTime() && start.getTime() === end.getTime();
        return isHourRange || isSameRange;
    }

    public allDayExpandScroll(dateHeader: HTMLElement): void {
        let indentHeight: number = 0;
        const headerRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.HEADER_ROW_CLASS));
        headerRows.forEach((element: HTMLElement) => {
            const tdEle: HTMLElement[] = [].slice.call(element.children);
            tdEle.forEach((ele: HTMLElement) => { ele.style.top = indentHeight + 'px'; });
            indentHeight += element.offsetHeight;
        });
        indentHeight = dateHeader.offsetHeight - indentHeight;
        (this.parent.element.querySelector('.' + cls.ALLDAY_CELLS_CLASS) as HTMLElement).style.height = (indentHeight / 12) + 'em';
        if (this.parent.uiStateValues.expand) {
            addClass([dateHeader], cls.ALLDAY_APPOINTMENT_SCROLL);
        } else {
            removeClass([dateHeader], cls.ALLDAY_APPOINTMENT_SCROLL);
        }
    }

    public updateEventMinimumDuration(startEndHours: Record<string, Date>, startTime: Date, endTime: Date): Record<string, Date> {
        if (startTime.getTime() < endTime.getTime()) {
            const eventDuration: number = (util.getUniversalTime(endTime) - util.getUniversalTime(startTime)) / util.MS_PER_MINUTE;
            if (eventDuration < this.parent.eventSettings.minimumEventDuration) {
                const tempEnd: Date = new Date(startTime);
                tempEnd.setMinutes(tempEnd.getMinutes() + this.parent.eventSettings.minimumEventDuration);
                endTime = tempEnd;
                if (endTime.getTime() > startEndHours.endHour.getTime()) {
                    const tempStart: Date = new Date(startEndHours.endHour.getTime());
                    tempStart.setMinutes(tempStart.getMinutes() - this.parent.eventSettings.minimumEventDuration);
                    startTime = tempStart;
                    endTime = startEndHours.endHour;
                }
            }
        }
        return { startDate: startTime, endDate: endTime };
    }

    private unWireEvents(): void {
        const appElements: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
        for (const element of appElements) {
            EventHandler.clearEvents(element);
        }
    }

    public destroy(): void {
        this.unWireEvents();
        this.parent = null;
    }

}
