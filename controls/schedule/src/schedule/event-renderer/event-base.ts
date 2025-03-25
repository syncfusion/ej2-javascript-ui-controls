/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { isNullOrUndefined, closest, extend, EventHandler, setStyleAttribute } from '@syncfusion/ej2-base';
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
import { CurrentAction } from '../base/type';
/**
 * EventBase for appointment rendering
 */
export class EventBase {
    public parent: Schedule;
    public slots: number[] = [];
    public cssClass: string;
    public groupOrder: string[];
    public processedData: Record<string, any>[] = [];
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
            } else if (!this.parent.isPrinting && !this.parent.uiStateValues.isPreventTimezone) {
                event = this.processTimezone(event);
            }
            for (let level: number = 0; level < resourceCollection.length; level++) {
                if (event[resourceCollection[parseInt(level.toString(), 10)].field] === null || event[resourceCollection[parseInt(level.toString(), 10)].field] === 0) {
                    event[resourceCollection[parseInt(level.toString(), 10)].field] = undefined;
                }
            }
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && event[fields.recurrenceRule] === '') {
                event[fields.recurrenceRule] = null;
            }
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && isNullOrUndefined(event[fields.recurrenceID]) &&
                !(this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction)) {
                processed = processed.concat(this.generateOccurrence(event, null, true));
            } else {
                if (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction) {
                    if (!isNullOrUndefined(event[fields.recurrenceRule]) && isNullOrUndefined(event[fields.recurrenceID])) {
                        const recurrenceEvent: Record<string, any>[] = this.generateOccurrence(event, null, true);
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
        if (!this.parent.activeViewOptions.allowOverlap && this.parent.eventsProcessed.length > 0) {
            this.processedData = this.parent.eventsProcessed;
            const nonOverlapList: Record<string, any>[] = [];
            const fields: EventFieldsMapping = this.parent.eventFields;
            for (const data of this.parent.eventsProcessed as Record<string, any>[]) {
                const overlappingData: Record<string, any> = this.findOverlappingData(data, nonOverlapList);
                if (!overlappingData) {
                    nonOverlapList.push(data);
                } else if (!this.parent.eventSettings.sortComparer) {
                    const dataDuration: number = new Date(data[fields.endTime]).getTime() - new Date(data[fields.startTime]).getTime();
                    const duplicateDuration: number = new Date(overlappingData[fields.endTime]).getTime() - new Date(overlappingData[fields.startTime]).getTime();
                    if ((dataDuration > duplicateDuration && data[fields.startTime] === overlappingData[fields.startTime]) || (data[fields.isAllDay] === true)) {
                        const index: number = nonOverlapList.indexOf(overlappingData);
                        if (index !== -1) { nonOverlapList.splice(index, 1); }
                        nonOverlapList.push(data);
                    }
                }
            }
            this.parent.eventsProcessed = nonOverlapList;
        }
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

    private findOverlappingData(eventData: Record<string, any>, eventList: Record<string, any>[]): Record<string, any> | undefined {
        const isResource: boolean = this.parent.activeViewOptions.group.resources.length > 0;
        const resourceCollection: ResourcesModel[] = isResource ? this.parent.resourceBase.resourceCollection : [];
        const lastLevelResource: string = isResource ? resourceCollection[resourceCollection.length - 1].field : null;
        const fields: EventFieldsMapping = this.parent.eventFields;
        const newStartTime: Date = new Date(eventData[fields.startTime]);
        const newEndTime: Date = new Date(eventData[fields.endTime]);
        for (const existingEvent of eventList) {
            if (
                newStartTime < existingEvent[fields.endTime] &&
                newEndTime > existingEvent[fields.startTime] &&
                existingEvent[fields.id] !== eventData[fields.id] &&
                (!isResource || isNullOrUndefined(lastLevelResource) ||
                    this.compareResourceValues(existingEvent[`${lastLevelResource}`], eventData[`${lastLevelResource}`]))
            ) {
                return existingEvent;
            }
        }
        return undefined;
    }

    private isOverlapRange(eventData: Record<string, any> | Record<string, any>[], currentAction: CurrentAction = null): boolean {
        const isResource: boolean = this.parent.activeViewOptions.group.resources.length > 0;
        const resourceCollection: ResourcesModel[] = isResource ? this.parent.resourceBase.resourceCollection : [];
        const lastLevelResource: string = isResource ? resourceCollection[resourceCollection.length - 1].field : null;
        const eventCollection: Record<string, any>[] = Array.isArray(eventData) ? eventData : [eventData];
        const fields: EventFieldsMapping = this.parent.eventFields;

        const processOverlappingEvents: (data: Record<string, any>) => Record<string, any>[] = (data: Record<string, any>) => {
            return this.processedData.filter((x: Record<string, any>) =>
                data[fields.startTime] < x[fields.endTime] &&
                data[fields.endTime] > x[fields.startTime] &&
                x[fields.id] !== data[fields.id] &&
                (!isResource || isNullOrUndefined(lastLevelResource) || this.compareResourceValues(x[`${lastLevelResource}`], data[`${lastLevelResource}`]))
            );
        };
        const overlappedEvents: Record<string, any>[] = [];
        let isOverlapAlert: boolean = false;

        for (const event of eventCollection) {
            const dataCol: Record<string, any>[] = !isNullOrUndefined(event[fields.recurrenceRule]) &&
                (isNullOrUndefined(event[fields.recurrenceID]) || event[fields.recurrenceID] === event[fields.id]) &&
                (isNullOrUndefined(event[fields.recurrenceID]) || currentAction === 'EditSeries')
                ? this.generateOccurrence(event)
                : [event];

            for (const data of dataCol) {
                const overlappingEvents: Record<string, any>[] = processOverlappingEvents(data);
                if (overlappingEvents.length > 0) {
                    overlappedEvents.push(...overlappingEvents);
                }
                if (this.findOverlappingData(data, this.parent.eventsProcessed)) {
                    isOverlapAlert = true;
                }
            }
        }
        this.parent.overlapAppointments = overlappedEvents;
        return isOverlapAlert;
    }

    private compareResourceValues(a: string | number | (string | number)[], b: string | number | (string | number)[]): boolean {
        type GetValueFunction = (value: string | number | (string | number)[]) => string | number;
        const getValue: GetValueFunction = (value: string | number | (string | number)[]) => Array.isArray(value) ? value[0] : value;
        return getValue(a) === getValue(b);
    }

    public checkOverlap(eventData: Record<string, any> | Record<string, any>[]): boolean {
        if (!this.parent.activeViewOptions.allowOverlap) {
            if (this.isOverlapRange(eventData)) {
                this.parent.quickPopup.openValidationError('overlapAlert', eventData);
                return true;
            }
        }
        return false;
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
        if (event[fields.isAllDay]) {
            return event;
        }
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
            resourceData = this.parent.resourceBase.lastResourceLevel[parseInt(data.toString(), 10)];
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
        const predicate: Predicate = this.parent.dataModule.getStartEndQuery(startDate, endDate);
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
            predicate[resourceCollection[parseInt(level.toString(), 10)].field] = resourceTdData.groupOrder[parseInt(level.toString(), 10)];
        }
        const keys: string[] = Object.keys(predicate);
        const filteredCollection: Record<string, any>[] = appointments.filter((eventObj: Record<string, any>) => keys.every((key: string) => {
            if (eventObj[`${key}`] instanceof Array) {
                return (<(string | number)[]>eventObj[`${key}`]).indexOf(predicate[`${key}`]) > -1;
            } else {
                return eventObj[`${key}`] === predicate[`${key}`];
            }
        }));
        return filteredCollection;
    }

    public sortByTime(appointmentsCollection: Record<string, any>[]): Record<string, any>[] {
        if (this.parent.eventSettings.sortComparer && (typeof(this.parent.eventSettings.sortComparer) === 'function' || typeof(this.parent.eventSettings.sortComparer) === 'string')) {
            appointmentsCollection = this.customSorting(appointmentsCollection);
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
        if (this.parent.eventSettings.sortComparer && (typeof(this.parent.eventSettings.sortComparer) === 'function' || typeof(this.parent.eventSettings.sortComparer) === 'string')) {
            appointments = this.customSorting(appointments);
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

    private customSorting(appointments: Record<string, any>[]): Record<string, any>[] {
        if (typeof(this.parent.eventSettings.sortComparer) === 'function') {
            return this.parent.eventSettings.sortComparer.call(this.parent, appointments);
        } else if (typeof(this.parent.eventSettings.sortComparer) === 'string') {
            const splits: string[] = (this.parent.eventSettings.sortComparer as string).split('.');
            let sortFn: Function;
            if (!isNullOrUndefined(window)) {
                sortFn = (window as Record<string, any>)[splits[splits.length - 1]];
            }
            if (sortFn) {
                return sortFn(appointments);
            }
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
                let slot: number[] = <[number]><unknown>this.slots[parseInt(level.toString(), 10)];
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
                        const isLeft: boolean = (slot[parseInt(startIndex.toString(), 10)] !== orgStart);
                        const isRight: boolean = (slot[parseInt(endIndex.toString(), 10)] !== orgEnd);
                        ranges.push(this.cloneEventObject(event, slot[parseInt(startIndex.toString(), 10)], slot[parseInt(endIndex.toString(), 10)], count, isLeft, isRight));
                        if (hasBreak) {
                            break;
                        }
                    }
                } else {
                    if (this.dateInRange(cStart, slot[0], slot[slot.length - 1])) {
                        const availSlot: number[] = [];
                        for (let i: number = 0; i < slot.length; i++) {
                            if (this.dateInRange(<number>slot[parseInt(i.toString(), 10)], orgStart, orgEnd)) {
                                availSlot.push(slot[parseInt(i.toString(), 10)]);
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
            this.addSelectedAppointments(this.parent.selectedElements, false);
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
        removeClass(selectedAppointments, cls.APPOINTMENT_BORDER);
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            removeClass(selectedAppointments, cls.AGENDA_SELECTED_CELL);
        }
    }

    public addSelectedAppointments(cells: Element[], preventFocus?: boolean): void {
        if (this.parent.currentView !== 'MonthAgenda') {
            this.parent.removeSelectedClass();
        }
        addClass(cells, cls.APPOINTMENT_BORDER);
        if (cells.length > 0 && !preventFocus) {
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
        const selectedCell: Element[] = this.parent.getSelectedCells();
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
            if (this.parent.activeEventData && this.parent.activeEventData.element && selectedAppointments.indexOf(this.parent.activeEventData.element as Element) > -1) {
                (this.parent.activeEventData.element as HTMLElement).focus();
                return;
            }
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
            let nearestTime: number;
            const isAllDay: boolean = this.isAllDayAppointment(selectedObject);
            if (this.parent.currentView === 'Month' || isAllDay || !this.parent.activeViewOptions.timeScale.enable) {
                nearestTime = new Date(+eventStartTime).setHours(0, 0, 0, 0);
            }
            else {
                nearestTime = this.findNearestSlot(eventStartTime);
            }
            let targetArea: Element;
            if (isAllDay && ['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) !== -1) {
                targetArea = this.parent.getAllDayRow();
            } else {
                targetArea = this.parent.getContentTable();
            }
            let queryString: string = '[data-date="' + new Date(nearestTime).getTime() + '"]';
            if (!isNullOrUndefined(this.parent.activeViewOptions.group.resources) &&
                this.parent.activeViewOptions.group.resources.length > 0) {
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

    private findNearestSlot(appointmentTime: Date): number {
        const msMajorInterval: number = this.parent.activeViewOptions.timeScale.interval * util.MS_PER_MINUTE;
        const msInterval: number = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        const numberOfSlots: number = Math.round(util.MS_PER_DAY / msInterval);
        const startTime: Date = new Date(appointmentTime);
        startTime.setHours(0, 0, 0, 0);
        const slots: Date[] = Array.from({ length: numberOfSlots }, (_: any, i: number) => {
            const slotTime: Date = new Date(startTime.getTime() + i * msInterval);
            return slotTime;
        });
        const nearestSlot: Date = slots.reduce((nearest: Date, slot: Date) => {
            const difference: number = Math.abs(appointmentTime.getTime() - slot.getTime());
            if (!nearest || difference < Math.abs(appointmentTime.getTime() - nearest.getTime())) {
                return slot;
            }
            return nearest;
        }, null);
        return Math.trunc(nearestSlot.getTime() / 1000) * 1000;
    }


    public getGroupIndexFromEvent(eventData: Record<string, any>): number {
        let levelIndex: number;
        let resource: ResourcesModel;
        let levelName: string;
        let idField: string;
        for (let i: number = this.parent.resourceBase.resourceCollection.length - 1; i >= 0; i--) {
            const resourceData: Record<string, any> | string | number = eventData[this.parent.resourceBase.resourceCollection[parseInt(i.toString(), 10)].field] as Record<string, any>;
            if (!isNullOrUndefined(resourceData)) {
                resource = this.parent.resourceBase.resourceCollection[parseInt(i.toString(), 10)];
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
        const id: number = ((eventData[`${idField}`] instanceof Array) ?
            (eventData[`${idField}`] as Record<string, any>)[0] : eventData[`${idField}`]) as number;
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
            if (this.parent.uiStateValues.isTapHold && closest(element, '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS)) {
                return;
            }
            this.parent.uiStateValues.isTapHold = false;
            this.removeSelectedAppointmentClass();
            this.parent.selectedElements = [];
        }
    }

    public wireAppointmentEvents(element: HTMLElement, event?: Record<string, any>, isPreventCrud: boolean = false): void {
        const isReadOnly: boolean = (!isNullOrUndefined(event)) ? event[this.parent.eventFields.isReadonly] as boolean : false;
        EventHandler.add(element, 'click', this.eventClick, this);
        if (!this.parent.isAdaptive && !this.parent.activeViewOptions.readonly && !isReadOnly) {
            EventHandler.add(element, 'touchend', this.eventTouchClick, this);
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
        if (this.parent.uiStateValues.isTouchScroll || this.parent.uiStateValues.isTapHold || this.parent.uiStateValues.action) {
            this.parent.uiStateValues.isTouchScroll = this.parent.uiStateValues.isTapHold = false;
            return;
        }
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

    private eventDoubleClick(eventData: Event): void {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide(true);
        }
        if (eventData.type === 'touchend') {
            this.activeEventData(eventData, true);
        }
        this.removeSelectedAppointmentClass();
        this.parent.selectedElements = [];
        if ((this.parent.activeEventData.element as HTMLElement).classList.contains(cls.INLINE_APPOINTMENT_CLASS) ||
            (this.parent.activeEventData.element as HTMLElement).querySelector('.' + cls.INLINE_SUBJECT_CLASS)) {
            return;
        }
        const args: EventClickArgs = <EventClickArgs>extend(this.parent.activeEventData, { cancel: false, originalEvent: eventData });
        this.parent.trigger(event.eventDoubleClick, args, (eventDoubleClickArgs: EventClickArgs) => {
            if (!eventDoubleClickArgs.cancel) {
                if (!isNullOrUndefined(this.parent.activeEventData.event) &&
                    isNullOrUndefined((<Record<string, any>>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceID])) {
                    this.parent.eventWindow.openEditor(this.parent.activeEventData.event as Record<string, any>, 'Save');
                } else {
                    this.parent.currentAction = 'EditOccurrence';
                    this.parent.quickPopup.openRecurrenceAlert();
                }
            }
        });
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
            const appIds: number[] = datas.map((event: Record<string, number>) => event[this.parent.eventFields.id]);
            let maxId: number = appIds.reduce((a: number, b: number) => Math.max(a, b));
            maxId = isNullOrUndefined(resourceId) ? maxId : maxId + resourceId;
            eventId = maxId + 1;
        }
        return eventId;
    }

    private activeEventData(eventData: Event, isMultiple: boolean): void {
        const target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS);
        const guid: string = target.getAttribute('data-guid');
        if (isMultiple) {
            this.addSelectedAppointments([].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]')), true);
            (target as HTMLElement).focus();
        }
        let eventObject: Record<string, any> = this.getEventByGuid(guid);
        if (eventObject && eventObject.isSpanned) {
            eventObject = this.parent.eventsData.filter((obj: Record<string, any>) =>
                obj[this.parent.eventFields.id] === eventObject[this.parent.eventFields.id])[0];
        }
        this.parent.activeEventData = { event: eventObject, element: target } as EventClickArgs;
    }

    public generateOccurrence(event: Record<string, any>, viewDate?: Date, isMaxCount?: boolean): Record<string, any>[] {
        let startDate: Date = event[this.parent.eventFields.startTime] as Date;
        const endDate: Date = event[this.parent.eventFields.endTime] as Date;
        const eventRule: string = event[this.parent.eventFields.recurrenceRule] as string;
        const timeZoneDiff: number = endDate.getTimezoneOffset() - startDate.getTimezoneOffset();
        const duration: number = (endDate.getTime() - startDate.getTime()) - (timeZoneDiff * 60000);
        viewDate = new Date((viewDate || this.parent.activeView.startDate()).getTime() - duration);
        const exception: string = event[this.parent.eventFields.recurrenceException] as string;
        let maxCount: number;
        if (this.parent.currentView !== 'Agenda' && isMaxCount) {
            maxCount = util.getDateCount(viewDate, this.parent.activeView.endDate()) + 1;
        }
        const newTimezone: string = this.parent.timezone || this.parent.tzModule.getLocalTimezoneName();
        const firstDay: number = this.parent.activeViewOptions.firstDayOfWeek;
        const calendarMode: CalendarType = this.parent.calendarMode;
        if (event[this.parent.eventFields.recurrenceRule] && this.isDayBasedRecurrence(event) &&
            this.parent.timezone && event[this.parent.eventFields.startTimezone] && event[this.parent.eventFields.endTimezone]) {
            startDate = this.parent.tzModule.convert(event[this.parent.eventFields.startTime],
                                                     this.parent.timezone, event[this.parent.eventFields.startTimezone]);
        }
        const dates: number[] =
            generate(startDate, eventRule, exception, firstDay, maxCount, viewDate, calendarMode, newTimezone);
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
        let isDSTAdjusted: boolean = false;
        let convertedDates: number[] = [];
        if (event[this.parent.eventFields.recurrenceRule] && this.isDayBasedRecurrence(event) &&
            this.parent.timezone && event[this.parent.eventFields.startTimezone] && event[this.parent.eventFields.endTimezone]) {
            isDSTAdjusted = true;
            convertedDates.push(...dates.map((date: number) =>
                this.parent.tzModule.convert(new Date(date), event[this.parent.eventFields.startTimezone], this.parent.timezone).getTime()
            ));
        }
        convertedDates = convertedDates.length > 0 ? convertedDates : dates;
        const occurrenceCollection: Record<string, any>[] = [];
        for (let date of convertedDates) {
            const clonedObject: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
            date = !isDSTAdjusted ? this.getDSTAdjustedTime(date, clonedObject) : date;
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

    private isDayBasedRecurrence(event: Record<string, any>): boolean {
        return (event[this.parent.eventFields.recurrenceRule].includes('BYMONTHDAY')
        || event[this.parent.eventFields.recurrenceRule].includes('BYDAY'));
    }

    private getDSTAdjustedTime(date: number, event: Record<string, any>): number {
        let occurDate: number = date;
        if (this.parent.timezone &&
            (event[this.parent.eventFields.startTimezone] || event[this.parent.eventFields.endTimezone])) {
            const eventOffset: number = this.getDSTDiff(event[this.parent.eventFields.startTime], new Date(date), event[this.parent.eventFields.startTimezone]);
            const schOffset: number = this.getDSTDiff(event[this.parent.eventFields.startTime], new Date(date), this.parent.timezone);
            occurDate = (new Date(date).getTime() - (eventOffset - schOffset) * 60000);
        }
        return occurDate;
    }

    private getDSTDiff(startDate: Date, occurDate: Date, timezone: string): number {
        const startOffset: number = this.parent.tzModule.offset(new Date(startDate), timezone);
        const occurOffset: number = this.parent.tzModule.offset(new Date(occurDate), timezone);
        return startOffset - occurOffset;
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
        return dataSource.filter((data: Record<string, any>) => data[`${idField}`] === eventObj[`${fieldKey}`]);
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
                    eventObj[fields.recurrenceID] === parentObject[fields.id] && eventObj[fields.recurrenceException] === exDateString[parseInt(i.toString(), 10)]);
                if (edited.length === 0) {
                    const exDate: Date = getDateFromRecurrenceDateString(exDateString[parseInt(i.toString(), 10)]);
                    const childObject: Record<string, any> = extend({}, recurrenceData, null, true) as Record<string, any>;
                    childObject[fields.recurrenceID] = parentObject[fields.id];
                    delete childObject[fields.followingID];
                    childObject[fields.recurrenceException] = exDateString[parseInt(i.toString(), 10)];
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

    public createBlockAppointmentElement(record: Record<string, any>, resIndex: number, isResourceEventTemplate: boolean): HTMLElement {
        const eventSubject: string = (record[this.parent.eventFields.subject] || this.parent.eventSettings.fields.subject.default) as string;
        const appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.BLOCK_APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.parent.eventFields.id],
                'aria-disabled': 'true'
            }
        });
        let templateElement: HTMLElement[];
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            const scheduleId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.eventTemplateName;
            const templateId: string = scheduleId + viewName + 'eventTemplate';
            const templateName: string = isResourceEventTemplate && this.parent.currentView.indexOf('Year') === -1 ?
                this.parent.getEventTemplateName(resIndex) : 'eventTemplate';
            templateElement = this.parent.getAppointmentTemplate()(record, this.parent, templateName, templateId, false,
                                                                   undefined, undefined, this.parent.root);
        } else {
            const appointmentSubject: HTMLElement = createElement('div', { className: cls.SUBJECT_CLASS });
            this.parent.sanitize(eventSubject, appointmentSubject);
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
        const maxDate: Date = isNullOrUndefined(this.parent.maxDate) ? new Date(2099, 11, 31) : this.parent.maxDate;
        const minDate: Date = isNullOrUndefined(this.parent.minDate) ? new Date(1900, 0, 1) : this.parent.minDate;
        if (dateRender[0] < minDate && dateRender[dateRender.length - 1] > maxDate) {
            for (let i: number = 0; i < dateRender.length; i++) {
                if (util.resetTime(dateRender[parseInt(i.toString(), 10)]).getTime() === util.resetTime(new Date(minDate)).getTime()) {
                    firstDate = i;
                }
                if (util.resetTime(dateRender[parseInt(i.toString(), 10)]).getTime() === util.resetTime(new Date(maxDate)).getTime()) {
                    lastDate = i;
                }
            }
            filteredDates = dateRender.filter((date: Date) => date >= dateRender[parseInt(firstDate.toString(), 10)] && date <= dateRender[parseInt(lastDate.toString(), 10)]);
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
        if (startTime.getTime() < endTime.getTime() || (startTime.getTime() === endTime.getTime() &&
            (startEndHours.startHour.getTime() < endTime.getTime() && startEndHours.endHour.getTime() > startTime.getTime()) &&
            this.parent.currentView.indexOf('Timeline') === -1)) {
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

    public createEventWrapper(type: string = '',  index: number = 0): HTMLElement {
        const tr: HTMLElement = createElement('tr');
        const levels: TdData[] = this.parent.activeView.colLevels.slice(-1)[0];
        const className: string = (this.parent as any).isReact && this.parent.activeViewOptions.eventTemplate ?
            ' ' + cls.APPOINTMENT_WRAPPER_HIDDEN_CLASS : '';
        for (let i: number = 0, len: number = levels.length; i < len; i++) {
            const col: TdData = levels[parseInt(i.toString(), 10)];
            const appointmentWrap: HTMLElement = createElement('td', {
                className: (type === 'allDay') ? cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS + className : (type === 'timeIndicator') ?
                    cls.TIMELINE_WRAPPER_CLASS : cls.DAY_WRAPPER_CLASS + className, attrs: { 'data-date': col.date.getTime().toString() }
            });
            if (!isNullOrUndefined(col.groupIndex)) {
                appointmentWrap.setAttribute('data-group-index', col.groupIndex.toString());
            }
            if (type === '') {
                const innerWrapper: HTMLElement = createElement('div', {
                    id: cls.APPOINTMENT_WRAPPER_CLASS + '-' + index.toString(),
                    className: cls.APPOINTMENT_WRAPPER_CLASS
                });
                appointmentWrap.appendChild(innerWrapper);
            }
            tr.appendChild(appointmentWrap);
            index = index + 1;
        }
        return tr;
    }

    public getPageCoordinates(e: MouseEvent & TouchEvent): (MouseEvent & TouchEvent) | Touch {
        if (isNullOrUndefined(e)) {
            return e;
        }
        const eventArgs: TouchEvent = (e as Record<string, any> & MouseEvent & TouchEvent).event as TouchEvent;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            (<MouseEvent & TouchEvent>eventArgs) || e;
    }

    public renderSpannedIcon(element: HTMLElement, spanEvent: Record<string, any>): void {
        const iconElement: HTMLElement = createElement('div', { className: cls.EVENT_INDICATOR_CLASS + ' ' + cls.ICON });
        if (spanEvent.isLeft) {
            const iconLeft: HTMLElement = iconElement.cloneNode() as HTMLElement;
            addClass([iconLeft], cls.EVENT_ICON_LEFT_CLASS);
            prepend([iconLeft], element);
        }
        if (spanEvent.isRight) {
            const iconRight: HTMLElement = iconElement.cloneNode() as HTMLElement;
            addClass([iconRight], cls.EVENT_ICON_RIGHT_CLASS);
            append([iconRight], element);
        }
        if (spanEvent.isTop) {
            const iconTop: HTMLElement = iconElement.cloneNode() as HTMLElement;
            addClass([iconTop], cls.EVENT_ICON_UP_CLASS);
            prepend([iconTop], element);
        }
        if (spanEvent.isBottom) {
            const iconBottom: HTMLElement = iconElement.cloneNode() as HTMLElement;
            addClass([iconBottom], cls.EVENT_ICON_DOWN_CLASS);
            append([iconBottom], element);
        }
    }

    public addCellHeight(selector: string, eventHeight: number, eventGap: number, headerHeight: number, indHeight: number, isScrollUpdate: boolean = true): void {
        if (this.parent.activeViewOptions.maxEventsPerRow && !this.parent.rowAutoHeight) {
            const rows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(selector));
            const weekNumberRows: HTMLElement[] = this.parent.showWeekNumber
                ? [].slice.call(this.parent.element.querySelectorAll('.' + cls.WEEK_NUMBER_WRAPPER_CLASS + ' tbody tr'))
                : [];
            for (const row of rows) {
                const height: number = (this.parent.activeViewOptions.maxEventsPerRow *
                    ((eventHeight + (this.parent.currentView === 'Month' ? eventGap : 2)))) + headerHeight + indHeight;
                if (weekNumberRows.length > 0) {
                    setStyleAttribute(weekNumberRows[rows.indexOf(row)].firstElementChild as HTMLElement, { 'height': height + 'px' });
                }
                setStyleAttribute(row.firstElementChild as HTMLElement, { 'height': height + 'px' });
            }

            if (!this.parent.enablePersistence && !this.parent.activeViewOptions.allowVirtualScrolling && isScrollUpdate) {
                this.parent.notify(event.contentReady, {});
            }
        }
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
