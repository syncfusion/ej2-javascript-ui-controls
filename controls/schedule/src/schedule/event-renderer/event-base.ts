import { isNullOrUndefined, closest, extend, EventHandler } from '@syncfusion/ej2-base';
import { createElement, prepend, append, addClass, removeClass } from '@syncfusion/ej2-base';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { EventFieldsMapping, EventClickArgs, CellClickEventArgs, TdData, SelectEventArgs, InlineClickArgs } from '../base/interface';
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
    public slots: Object[] = [];
    public cssClass: string;
    public groupOrder: string[];
    private isDoubleTapped: boolean = false;

    /**
     * Constructor for EventBase
     */
    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public processData(events: { [key: string]: Object }[], timeZonePropChanged?: boolean, oldTimezone?: string): Object[] {
        let start: Date = this.parent.activeView.startDate();
        let end: Date = this.parent.activeView.endDate();
        let fields: EventFieldsMapping = this.parent.eventFields;
        let processed: Object[] = [];
        let temp: number = 1;
        let generateID: boolean = false;
        let resourceCollection: ResourcesModel[] = this.parent.resourceBase ? this.parent.resourceBase.resourceCollection : [];
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
                    let recEvent: object[];
                    let app: Object[];
                    if (!isNullOrUndefined(event[fields.recurrenceRule]) && isNullOrUndefined(event[fields.recurrenceID])) {
                        recEvent = this.generateOccurrence(event, null, oldTimezone, true);
                        for (let k: number = 0; k < recEvent.length; k++) {
                            event = recEvent[k] as { [key: string]: Object };
                            app = this.parent.eventsProcessed.filter((data: { [key: string]: Object }) =>
                                ((data[this.parent.eventFields.startTime] as Date).getTime() -
                                    (event[this.parent.eventFields.startTime] as Date).getTime() === 0 &&
                                    data[this.parent.eventFields.id] === event[this.parent.eventFields.id]));
                            event.Guid = (app.length > 0) ? (app[0] as { [key: string]: Object }).Guid : this.generateGuid();
                            processed.push(event);
                        }

                    } else {
                        app = this.parent.eventsProcessed.filter((data: { [key: string]: Object }) =>
                            data[this.parent.eventFields.id] === event[this.parent.eventFields.id]);
                        event.Guid = (app.length > 0) ? (app[0] as { [key: string]: Object }).Guid : this.generateGuid();
                        processed.push(event);
                    }

                } else {
                    event.Guid = this.generateGuid();
                    processed.push(event);
                }
            }
        }
        this.parent.eventsProcessed = [];
        let eventData: Object[] = processed.filter((data: { [key: string]: Object }) => !data[this.parent.eventFields.isBlock]);
        this.parent.eventsProcessed = this.filterEvents(start, end, eventData);
        let blockData: Object[] = processed.filter((data: { [key: string]: Object }) => data[this.parent.eventFields.isBlock]);
        for (let i: number = 0, len: number = blockData.length; i < len; i++) {
            let eventObj: { [key: string]: Object } = (blockData[i] as { [key: string]: Object });
            if (eventObj[fields.isAllDay]) {
                eventObj[fields.startTime] = util.resetTime(eventObj[fields.startTime] as Date);
                eventObj[fields.endTime] = util.addDays(util.resetTime(eventObj[fields.endTime] as Date), 1);
            }
        }
        this.parent.blockProcessed = blockData;
        return eventData;
    }

    public getProcessedEvents(eventCollection: Object[] = this.parent.eventsData): Object[] {
        let processed: Object[] = [];
        for (let event of eventCollection as { [key: string]: Object }[]) {
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
        let data: { [key: string]: Object }[] = this.parent.eventsData.concat(this.parent.blockData) as { [key: string]: Object }[];
        let processed: Object[] = this.processData(data, true, oldTimezone);
        this.parent.notify(event.dataReady, { processedData: processed });
    }

    /** @private */
    public timezoneConvert(eventData: { [key: string]: Object }): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        eventData[fields.startTimezone] = eventData[fields.startTimezone] || eventData[fields.endTimezone];
        eventData[fields.endTimezone] = eventData[fields.endTimezone] || eventData[fields.startTimezone];
        if (this.parent.timezone) {
            let startTz: string = eventData[fields.startTimezone] as string;
            let endTz: string = eventData[fields.endTimezone] as string;
            eventData[fields.startTime] = this.parent.tzModule.convert(<Date>eventData[fields.startTime], this.parent.timezone, startTz);
            eventData[fields.endTime] = this.parent.tzModule.convert(<Date>eventData[fields.endTime], this.parent.timezone, endTz);
        }
    }

    private processTimezoneChange(event: { [key: string]: Object }, oldTimezone: string): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
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

    public processTimezone(event: { [key: string]: Object }, isReverse: boolean = false): { [key: string]: Object } {
        let fields: EventFieldsMapping = this.parent.eventFields;
        if (event[fields.startTimezone] || event[fields.endTimezone]) {
            let startTimezone: string = <string>event[fields.startTimezone] || <string>event[fields.endTimezone];
            let endTimezone: string = <string>event[fields.endTimezone] || <string>event[fields.startTimezone];
            if (isReverse) {
                if (this.parent.timezone) {
                    event[fields.startTime] =
                        this.parent.tzModule.convert(<Date>event[fields.startTime], startTimezone, this.parent.timezone);
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
                    event[fields.startTime] =
                        this.parent.tzModule.convert(<Date>event[fields.startTime], startTimezone, this.parent.timezone);
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

    public filterBlockEvents(eventObj: { [key: string]: Object }): Object[] {
        let eStart: Date = eventObj[this.parent.eventFields.startTime] as Date;
        let eEnd: Date = eventObj[this.parent.eventFields.endTime] as Date;
        let resourceData: TdData;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let data: number = this.getGroupIndexFromEvent(eventObj);
            resourceData = this.parent.resourceBase.lastResourceLevel[data];
        }
        return this.filterEvents(eStart, eEnd, this.parent.blockProcessed, resourceData);
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

    public filterEventsByRange(eventCollection: Object[], startDate?: Date, endDate?: Date): Object[] {
        let filteredEvents: Object[] = [];
        if (startDate && endDate) {
            filteredEvents = this.filterEvents(startDate, endDate, eventCollection);
        } else if (startDate && !endDate) {
            filteredEvents = eventCollection.filter((e: { [key: string]: Object }) => e[this.parent.eventFields.startTime] >= startDate);
        } else if (!startDate && endDate) {
            filteredEvents = eventCollection.filter((e: { [key: string]: Object }) => e[this.parent.eventFields.endTime] <= endDate);
        } else {
            filteredEvents = eventCollection;
        }
        return this.sortByTime(filteredEvents);
    }

    public filterEventsByResource(resourceTdData: TdData, appointments: Object[] = this.parent.eventsProcessed): Object[] {
        let predicate: { [key: string]: number | string } = {};
        let resourceCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        for (let level: number = 0; level < resourceCollection.length; level++) {
            predicate[resourceCollection[level].field] = resourceTdData.groupOrder[level];
        }
        let keys: string[] = Object.keys(predicate);
        let filteredCollection: Object[] = appointments.filter((eventObj: { [key: string]: Object }) => keys.every((key: string) => {
            if (eventObj[key] instanceof Array) {
                return (<(string | number)[]>eventObj[key]).indexOf(predicate[key]) > -1;
            } else {
                return eventObj[key] === predicate[key];
            }
        }));
        return filteredCollection;
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
            while (end <= eventEndTime && start.getTime() !== end.getTime()) {
                let app: { [key: string]: Object } = <{ [key: string]: Object }>extend({}, event);
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
                if (this.parent.currentView === 'WorkWeek' || this.parent.currentView === 'TimelineWorkWeek'
                    || this.parent.activeViewOptions.group.byDate || this.parent.activeViewOptions.showWeekend) {
                    let slotDates: Date[] = [];
                    for (let s of slot) {
                        slotDates.push(new Date(s));
                    }
                    let renderedDates: Date[] = this.getRenderedDates(slotDates);
                    if (!isNullOrUndefined(renderedDates) && renderedDates.length > 0) {
                        slot = [];
                        for (let date of renderedDates) {
                            slot.push(date.getTime());
                        }
                    }
                }
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

    public cloneEventObject(event: { [key: string]: Object }, start: number, end: number, count: number, isLeft: boolean, isRight: boolean)
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
            let isAlreadySelected: Element[] = this.parent.selectedElements.filter((element: HTMLElement) =>
                element.getAttribute('data-guid') === target.getAttribute('data-guid'));
            if (isAlreadySelected.length <= 0) {
                let elementSelector: string = 'div[data-guid="' + target.getAttribute('data-guid') + '"]';
                let focusElements: Element[] = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
                for (let element of focusElements) {
                    this.parent.selectedElements.push(element);
                }
            } else {
                let selectedElements: Element[] = this.parent.selectedElements.filter((element: HTMLElement) =>
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
        let eventSelect: Object[] = [];
        let elementSelect: HTMLElement[] = [];
        let selectAppointments: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
        selectAppointments.filter((element: HTMLElement) => {
            let isAlreadyAdded: Object[] = eventSelect.filter((event: { [key: string]: Object }) => {
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
        if (this.parent.currentView !== 'MonthAgenda') {
            this.parent.removeSelectedClass();
        }
        addClass(cells, cls.APPOINTMENT_BORDER);
    }

    public getSelectedAppointments(): Element[] {
        return [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_BORDER + ',.' + cls.APPOINTMENT_CLASS + ':focus'));
    }

    public focusElement(): void {
        if (this.parent.eventWindow.dialogObject && this.parent.eventWindow.dialogObject.visible) {
            return;
        }
        let selectedCell: Element[] = this.parent.getSelectedElements();
        if (selectedCell.length > 0) {
            if (this.parent.keyboardInteractionModule) {
                let target: HTMLTableCellElement = ((!isNullOrUndefined(this.parent.activeCellsData) &&
                    this.parent.activeCellsData.element) || selectedCell[selectedCell.length - 1]) as HTMLTableCellElement;
                this.parent.keyboardInteractionModule.selectCells(target instanceof Array, target);
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
            let queryString: string = '[data-date="' + this.parent.getMsFromDate(new Date(nearestTime)) + '"]';
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
        let levelIndex: number;
        let resource: ResourcesModel;
        let levelName: string;
        let idField: string;
        for (let i: number = this.parent.resourceBase.resourceCollection.length - 1; i >= 0; i--) {
            let resourceData: Object | string | number = eventData[this.parent.resourceBase.resourceCollection[i].field];
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
        let id: number = ((eventData[idField] instanceof Array) ?
            (eventData[idField] as { [key: string]: Object })[0] : eventData[idField]) as number;
        if (levelIndex > 0) {
            let parentField: string = this.parent.resourceCollection[levelIndex - 1].field;
            return this.parent.resourceBase.getIndexFromResourceId(id, levelName, resource, eventData, parentField);
        } else {
            return this.parent.resourceBase.getIndexFromResourceId(id, levelName, resource);
        }
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
            if (this.parent.currentView !== 'MonthAgenda') {
                this.parent.removeSelectedClass();
            }
        } else if (!closest(element as Element, '.' + cls.POPUP_OPEN)) {
            this.removeSelectedAppointmentClass();
        }
    }

    public wireAppointmentEvents(element: HTMLElement, event?: { [key: string]: Object }, isPreventCrud: Boolean = false): void {
        let isReadOnly: boolean = (!isNullOrUndefined(event)) ? event[this.parent.eventFields.isReadonly] as boolean : false;
        EventHandler.add(element, 'click', this.eventClick, this);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'touchstart', this.eventTouchClick, this);
        }
        if (!this.parent.isAdaptive && !this.parent.activeViewOptions.readonly && !isReadOnly) {
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

    public renderResizeHandler(element: HTMLElement, spanEvent: { [key: string]: Object }, isReadOnly: boolean): void {
        if (!this.parent.resizeModule || !this.parent.allowResizing || this.parent.activeViewOptions.readonly || isReadOnly) {
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
            let target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS) as Element;
            this.getSelectedEventElements(target);
            this.activeEventData(eventData, false);
            let selectArgs: SelectEventArgs = {
                data: this.parent.activeEventData.event,
                element: this.parent.activeEventData.element,
                event: eventData, requestType: 'eventSelect'
            };
            this.parent.trigger(event.select, selectArgs);
            let args: EventClickArgs = <EventClickArgs>extend(this.parent.activeEventData, { cancel: false, originalEvent: eventData });
            this.parent.trigger(event.eventClick, args);
        } else {
            this.removeSelectedAppointmentClass();
            this.activeEventData(eventData, true);
            let selectEventArgs: SelectEventArgs = {
                data: this.parent.activeEventData.event,
                element: this.parent.activeEventData.element,
                event: eventData, requestType: 'eventSelect'
            };
            this.parent.trigger(event.select, selectEventArgs);
            let args: EventClickArgs = <EventClickArgs>extend(this.parent.activeEventData, { cancel: false, originalEvent: eventData });
            this.parent.trigger(event.eventClick, args, (eventClickArgs: EventClickArgs) => {
                if (eventClickArgs.cancel) {
                    this.removeSelectedAppointmentClass();
                    if (this.parent.quickPopup) {
                        this.parent.quickPopup.quickPopupHide();
                    }
                } else {
                    if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
                        addClass([this.parent.activeEventData.element as Element], cls.AGENDA_SELECTED_CELL);
                    }
                    if (this.parent.allowInline) {
                        let inlineArgs: InlineClickArgs = {
                            data: eventClickArgs.event as { [key: string]: Object },
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
        this.parent.quickPopup.quickPopupHide(true);
        if (e.type === 'touchstart') {
            this.activeEventData(e, true);
        }
        this.removeSelectedAppointmentClass();
        if ((this.parent.activeEventData.element as HTMLElement).classList.contains(cls.INLINE_APPOINTMENT_CLASS) ||
            (this.parent.activeEventData.element as HTMLElement).querySelector('.' + cls.INLINE_SUBJECT_CLASS)) {
            return;
        }
        if (!isNullOrUndefined(this.parent.activeEventData.event) &&
            isNullOrUndefined((<{ [key: string]: Object }>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceID])) {
            this.parent.eventWindow.openEditor(this.parent.activeEventData.event, 'Save');
        } else {
            this.parent.currentAction = 'EditOccurrence';
            this.parent.quickPopup.openRecurrenceAlert();
        }
    }

    public getEventByGuid(guid: string): Object {
        return this.parent.eventsProcessed.filter((data: { [key: string]: Object }) => data.Guid === guid)[0];
    }

    public getEventById(id: number | string): { [key: string]: Object } {
        return this.parent.eventsData.filter((data: { [key: string]: Object }) =>
            data[this.parent.eventFields.id] === id)[0] as { [key: string]: Object };
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
            return typeof ((<{ [key: string]: Object }>this.parent.eventsData[0])[this.parent.eventFields.id]);
        }
        if (this.parent.blockData.length !== 0) {
            return typeof ((<{ [key: string]: Object }>this.parent.blockData[0])[this.parent.eventFields.id]);
        }
        return 'string';
    }

    public getEventMaxID(resourceId?: number): number | string {
        if (this.parent.eventsData.length < 1 && this.parent.blockData.length < 1) {
            return 1;
        }
        let eventId: string | number;
        let idType: string = this.getEventIDType();
        if (idType === 'string') {
            eventId = this.generateGuid();
        }
        if (idType === 'number') {
            let datas: Object[] = this.parent.eventsData.concat(this.parent.blockData);
            let maxId: number =
                Math.max.apply(Math, datas.map((event: { [key: string]: Object }) => event[this.parent.eventFields.id]));
            maxId = isNullOrUndefined(resourceId) ? maxId : maxId + resourceId;
            eventId = maxId + 1;
        }
        return eventId;
    }

    private activeEventData(eventData: Event, isMultiple: boolean): void {
        let target: Element = closest(<Element>eventData.target, '.' + cls.APPOINTMENT_CLASS);
        let guid: string = target.getAttribute('data-guid');
        if (isMultiple) {
            this.addSelectedAppointments([].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]')));
            (target as HTMLElement).focus();
        }
        let eventObject: { [key: string]: Object } = this.getEventByGuid(guid) as { [key: string]: Object };
        if (eventObject && eventObject.isSpanned) {
            eventObject = this.parent.eventsData.filter((obj: { [key: string]: Object }) =>
                obj[this.parent.eventFields.id] === eventObject[this.parent.eventFields.id])[0] as { [key: string]: Object };
        }
        this.parent.activeEventData = { event: eventObject, element: target } as EventClickArgs;
    }

    public generateOccurrence(event: { [key: string]: Object }, viewDate?: Date, oldTimezone?: string, isMaxCount?: boolean): Object[] {
        let startDate: Date = event[this.parent.eventFields.startTime] as Date;
        let endDate: Date = event[this.parent.eventFields.endTime] as Date;
        let eventRule: string = event[this.parent.eventFields.recurrenceRule] as string;
        let duration: number = endDate.getTime() - startDate.getTime();
        viewDate = new Date((viewDate || this.parent.activeView.startDate()).getTime() - duration);
        let exception: string = event[this.parent.eventFields.recurrenceException] as string;
        let maxCount: number;
        if (this.parent.currentView !== 'Agenda' && isMaxCount) {
            maxCount = util.getDateCount(this.parent.activeView.startDate(), this.parent.activeView.endDate()) + 1;
        }
        let newTimezone: string = this.parent.timezone || this.parent.tzModule.getLocalTimezoneName();
        let firstDay: number = this.parent.activeViewOptions.firstDayOfWeek;
        let calendarMode: CalendarType = this.parent.calendarMode;
        let dates: number[] =
            generate(startDate, eventRule, exception, firstDay, maxCount, viewDate, calendarMode, oldTimezone, newTimezone);
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
        let occurrenceCollection: Object[] = [];
        for (let date of dates) {
            let clonedObject: { [key: string]: Object } = <{ [key: string]: Object }>extend({}, event, null, true);
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

    public getParentEvent(eventObj: { [key: string]: Object }, isParent: boolean = false): { [key: string]: Object } {
        let parentEvent: { [key: string]: Object };
        do {
            eventObj = this.getFollowingEvent(eventObj);
            if (eventObj) {
                parentEvent = extend({}, eventObj, null, true) as { [key: string]: Object };
            }
        } while (eventObj && isParent);
        if (isParent && parentEvent) {
            let collection: { [key: string]: Object[] } = this.getEventCollections(parentEvent);
            let followObj: { [key: string]: Object } = collection.follow.slice(-1)[0] as { [key: string]: Object };
            if (collection.occurrence.length > 0 && !parentEvent[this.parent.eventFields.recurrenceException]) {
                followObj = collection.occurrence.slice(-1)[0] as { [key: string]: Object };
            }
            if (followObj) {
                parentEvent[this.parent.eventFields.recurrenceRule] = followObj[this.parent.eventFields.recurrenceRule];
            }
        }
        return parentEvent;
    }

    public getEventCollections(parentObj: { [key: string]: Object }, childObj?: { [key: string]: Object }): { [key: string]: Object[] } {
        let followingCollection: Object[] = [];
        let occurrenceCollection: Object[] = [];
        let followingEvent: { [key: string]: Object } = parentObj;
        do {
            followingEvent = this.getFollowingEvent(followingEvent, true);
            if (followingEvent) {
                followingCollection.push(followingEvent);
            }
            occurrenceCollection = occurrenceCollection.concat(this.getOccurrenceEvent(followingEvent || parentObj));
        } while (followingEvent);
        let collections: { [key: string]: Object[] } = {};
        if (childObj) {
            let fields: EventFieldsMapping = this.parent.eventFields;
            collections = {
                follow: followingCollection.filter((eventData: { [key: string]: Object }) =>
                    eventData[fields.startTime] >= childObj[fields.startTime]),
                occurrence: occurrenceCollection.filter((eventData: { [key: string]: Object }) =>
                    eventData[fields.startTime] >= childObj[fields.startTime])
            };
        } else {
            collections = { follow: followingCollection, occurrence: occurrenceCollection };
        }
        return collections;
    }

    public getFollowingEvent(parentObj: { [key: string]: Object }, isReverse?: boolean): { [key: string]: Object } {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let fieldValue: string | number;
        if (isReverse) {
            fieldValue = parentObj[fields.id] as string | number;
        } else {
            fieldValue = (parentObj[fields.recurrenceID] || parentObj[fields.followingID]) as string | number;
        }
        let parentApp: Object[] = this.parent.eventsData.filter((data: { [key: string]: Object }) =>
            data[isReverse ? fields.followingID : fields.id] === fieldValue);
        return parentApp.shift() as { [key: string]: Object };
    }

    public isFollowingEvent(parentObj: { [key: string]: Object }, childObj: { [key: string]: Object }): boolean {
        let parentStart: Date = parentObj[this.parent.eventFields.startTime] as Date;
        let childStart: Date = childObj[this.parent.eventFields.startTime] as Date;
        return parentStart.getHours() === childStart.getHours() && parentStart.getMinutes() === childStart.getMinutes() &&
            parentStart.getSeconds() === childStart.getSeconds();
    }

    public getOccurrenceEvent(eventObj: { [key: string]: Object }, isGuid: boolean = false, isFollowing: boolean = false): Object[] {
        let idField: string = isGuid ? 'Guid' : (isFollowing) ? this.parent.eventFields.followingID : this.parent.eventFields.recurrenceID;
        let fieldKey: string = isGuid ? 'Guid' : this.parent.eventFields.id;
        let dataSource: Object[] = isGuid ? this.parent.eventsProcessed : this.parent.eventsData;
        return dataSource.filter((data: { [key: string]: Object }) => data[idField] === eventObj[fieldKey]);
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

    public getDeletedOccurrences(recurrenceData: string | number | { [key: string]: Object }): Object[] {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let parentObject: { [key: string]: Object };
        let deletedOccurrences: Object[] = [];
        if (typeof recurrenceData === 'string' || typeof recurrenceData === 'number') {
            parentObject = this.parent.eventsData.filter((obj: { [key: string]: Object }) =>
                obj[fields.id] === recurrenceData)[0] as { [key: string]: Object };
        } else {
            parentObject = extend({}, recurrenceData, null, true) as { [key: string]: Object };
        }
        if (parentObject[fields.recurrenceException]) {
            let exDateString: string[] = (<string>parentObject[fields.recurrenceException]).split(',');
            for (let i: number = 0, len: number = exDateString.length; i < len; i++) {
                let edited: Object[] = this.parent.eventsData.filter((eventObj: { [key: string]: Object }) =>
                    eventObj[fields.recurrenceID] === parentObject[fields.id] && eventObj[fields.recurrenceException] === exDateString[i]);
                if (edited.length === 0) {
                    let exDate: Date = getDateFromRecurrenceDateString(exDateString[i]);
                    let childObject: { [key: string]: Object } = extend({}, recurrenceData, null, true) as { [key: string]: Object };
                    childObject[fields.recurrenceID] = parentObject[fields.id];
                    delete childObject[fields.followingID];
                    childObject[fields.recurrenceException] = exDateString[i];
                    let startDate: Date = new Date(exDate.getTime());
                    let time: number = (<Date>parentObject[fields.endTime]).getTime() - (<Date>parentObject[fields.startTime]).getTime();
                    let endDate: Date = new Date(startDate.getTime());
                    endDate.setMilliseconds(time);
                    childObject[fields.startTime] = new Date(startDate.getTime());
                    childObject[fields.endTime] = new Date(endDate.getTime());
                    deletedOccurrences.push(childObject);
                }
            }
        }
        return deletedOccurrences;
    }

    public applyResourceColor(element: HTMLElement, data: { [key: string]: Object }, type: string, index?: string[], alpha?: string): void {
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
        // index refers groupOrder
        let color: string = this.parent.resourceBase.getResourceColor(data, index);
        if (color) {
            // tslint:disable-next-line:no-any
            element.style[<any>type] = !isNullOrUndefined(alpha) ? alphaColor(color, alpha) : color;
        }
    }

    public createBlockAppointmentElement(record: { [key: string]: Object }, resIndex: number): HTMLElement {
        let eventSubject: string = (record[this.parent.eventFields.subject] || this.parent.eventSettings.fields.subject.default) as string;
        let appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.BLOCK_APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.parent.eventFields.id],
                'aria-readonly': 'true', 'aria-selected': 'false'
            }
        });
        let templateElement: HTMLElement[];
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            let scheduleId: string = this.parent.element.id + '_';
            let viewName: string = this.parent.activeViewOptions.eventTemplateName;
            let templateId: string = scheduleId + viewName + 'eventTemplate';
            let templateArgs: Object = util.addLocalOffsetToEvent(record, this.parent.eventFields);
            templateElement = this.parent.getAppointmentTemplate()(templateArgs, this.parent, 'eventTemplate', templateId, false);
        } else {
            let appointmentSubject: HTMLElement = createElement('div', {
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

    public getReadonlyAttribute(event: { [key: string]: Object }): string {
        return (event[this.parent.eventFields.isReadonly] || this.parent.readonly).toString();
    }

    public isBlockRange(eventData: Object | Object[]): boolean {
        let eventCollection: Object[] = (eventData instanceof Array) ? eventData : [eventData];
        let isBlockAlert: boolean = false;
        let fields: EventFieldsMapping = this.parent.eventFields;
        for (let event of eventCollection as { [key: string]: Object }[]) {
            let dataCol: Object[] = [];
            if (!isNullOrUndefined(event[fields.recurrenceRule]) &&
                (isNullOrUndefined(event[fields.recurrenceID]) || event[fields.id] === event[fields.recurrenceID])) {
                dataCol = this.generateOccurrence(event);
            } else {
                dataCol.push(event);
            }
            for (let data of dataCol) {
                let filterBlockEvents: Object[] = this.filterBlockEvents(data as { [key: string]: Object });
                if (filterBlockEvents.length > 0) {
                    isBlockAlert = true;
                    break;
                }
            }
        }
        this.parent.uiStateValues.isBlock = isBlockAlert;
        return isBlockAlert;
    }

    public getFilterEventsList(dataSource: Object[], query: Predicate): { [key: string]: Object }[] {
        return new DataManager(dataSource).executeLocal(new Query().where(query)) as { [key: string]: Object }[];
    }

    public getSeriesEvents(parentEvent: { [key: string]: Object }, startTime?: string): { [key: string]: Object }[] {
        let fields: EventFieldsMapping = this.parent.eventFields;
        startTime = isNullOrUndefined(startTime) ? parentEvent[fields.startTime] as string : startTime;
        let deleteFutureEditEvents: { [key: string]: Object };
        let futureEvents: { [key: string]: Object }[];
        let deleteFutureEditEventList: { [key: string]: Object }[] = [];
        let delId: string = parentEvent[fields.id] as string;
        let followingId: string = parentEvent[fields.followingID] as string;
        let deleteFutureEvent: Predicate;
        let startTimeQuery: string = this.parent.currentAction === 'EditSeries' ? 'greaterthan' : 'greaterthanorequal';
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

    public getEditedOccurrences(deleteFutureEditEventList: { [key: string]: Object }[], startTime?: string): { [key: string]: Object }[] {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let deleteRecurrenceEventList: { [key: string]: Object }[] = [];
        let delEditedEvents: { [key: string]: Object }[];
        for (let event of deleteFutureEditEventList) {
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

    public isValidEvent(eventObj: { [key: string]: Object }, start: Date, end: Date, schedule: { [key: string]: Date }): boolean {
        let isHourRange: boolean = end.getTime() > schedule.startHour.getTime() && start.getTime() < schedule.endHour.getTime();
        let isSameRange: boolean = schedule.startHour.getTime() <= start.getTime() &&
            (<Date>eventObj[this.parent.eventFields.startTime]).getTime() >= schedule.startHour.getTime() &&
            (<Date>eventObj[this.parent.eventFields.endTime]).getTime() < schedule.endHour.getTime() && start.getTime() === end.getTime();
        return isHourRange || isSameRange;
    }
}