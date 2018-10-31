import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { getRecurrenceStringFromDate } from '../../recurrence-editor/date-generator';
import { ActionEventArgs, EventFieldsMapping, SaveChanges, CrudArgs } from '../base/interface';
import { ReturnType, CurrentAction } from '../base/type';
import { Schedule } from '../base/schedule';
import * as events from '../base/constant';
import { Timezone } from '../timezone/timezone';

/**
 * Schedule CRUD operations
 */

export class Crud {
    public parent: Schedule;
    public timezone: Timezone;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.timezone = new Timezone();
    }

    private getQuery(): Query {
        let start: Date = this.parent.activeView.startDate();
        let end: Date = this.parent.activeView.endDate();
        return this.parent.dataModule.generateQuery(start, end);
    }

    private getTable(): string {
        if (this.parent.eventSettings.query) {
            let query: Query = this.parent.eventSettings.query.clone();
            return query.fromTable;
        }
        return null;
    }

    private refreshData(args: CrudArgs): void {
        let actionArgs: ActionEventArgs = { requestType: args.requestType, cancel: false, data: args.data };
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(events.actionComplete, actionArgs);
            this.parent.renderModule.refreshDataManager();
            return;
        } else {
            args.promise.then((e: ReturnType) => {
                if (this.parent.isDestroyed) { return; }
                this.parent.trigger(events.actionComplete, actionArgs);
                if (actionArgs.cancel) {
                    return;
                }
                this.parent.renderModule.refreshDataManager();
            }).catch((e: ReturnType) => {
                if (this.parent.isDestroyed) { return; }
                this.parent.trigger(events.actionFailure, { error: e });
            });
        }
    }

    public addEvent(eventData: Object | Object[]): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let promise: Promise<Object> = null;
        let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        let args: ActionEventArgs = {
            cancel: false,
            data: (eventData instanceof Array) ? eventData : [eventData],
            requestType: 'eventCreate'
        };
        this.parent.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        if (eventData instanceof Array) {
            for (let event of eventData as Object[]) {
                this.processCrudTimezone(event as { [key: string]: Object });
                editParms.addedRecords.push(event);
            }
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
        } else {
            this.processCrudTimezone(eventData as { [key: string]: Object });
            promise = this.parent.dataModule.dataManager.insert(eventData, this.getTable(), this.getQuery()) as Promise<Object>;
        }
        let crudArgs: CrudArgs = { requestType: 'eventCreated', cancel: false, data: eventData, promise: promise };
        this.refreshData(crudArgs);
    }

    public saveEvent(event: Object | Object[], action?: CurrentAction): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let promise: Promise<Object> = null;
        let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        let args: ActionEventArgs = { requestType: 'eventChange', cancel: false };
        let data: { [key: string]: Object } = <{ [key: string]: Object }>event;
        if (isNullOrUndefined(action)) {
            args.data = data;
            this.parent.trigger(events.actionBegin, args);
            if (args.cancel) {
                return;
            }
            this.processCrudTimezone(data);
            if ((event instanceof Array)) {
                editParms.changedRecords = event;
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
            } else {
                promise = this.parent.dataModule.dataManager.update(fields.id, event, this.getTable(), this.getQuery()) as Promise<Object>;
            }
        } else {
            let parentEvent: { [key: string]: Object } = this.parent.eventBase.getRecurrenceEvent(data);
            let query: Query;
            switch (action) {
                case 'EditOccurrence':
                    args.data = { occurrence: event, parent: parentEvent };
                    this.parent.trigger(events.actionBegin, args);
                    if (args.cancel) {
                        return;
                    }
                    query = new Query().where('Guid', 'equal', data.Guid as string);
                    let edited: Object[] = new DataManager(this.parent.eventsProcessed).executeLocal(query);
                    let exDate: string = this.excludeDateCheck((<{ [key: string]: Date }>edited[0])[fields.startTime], <string>parentEvent
                    [fields.recurrenceException]);
                    if (exDate !== parentEvent[fields.recurrenceException]) {
                        parentEvent[fields.recurrenceException] = exDate;
                        data[fields.recurrenceID] = parentEvent[fields.id];
                        this.processCrudTimezone(parentEvent);
                        editParms.changedRecords.push(parentEvent);
                        this.processCrudTimezone(data);
                        editParms.addedRecords.push(data);
                    } else {
                        this.processCrudTimezone(data);
                        editParms.changedRecords.push(data);
                    }
                    break;
                case 'EditSeries':
                    args.data = data;
                    this.parent.trigger(events.actionBegin, args);
                    if (args.cancel) {
                        return;
                    }
                    query = new Query().where(fields.recurrenceID, 'equal', parentEvent[fields.id] as number);
                    let delApp: Object[] = new DataManager(this.parent.eventsData).executeLocal(query);
                    data[fields.id] = parentEvent[fields.id];
                    data[fields.recurrenceException] = null;
                    data[fields.recurrenceID] = null;
                    this.processCrudTimezone(data as { [key: string]: Object });
                    editParms.changedRecords.push(data as Object);
                    for (let event of delApp) {
                        editParms.deletedRecords.push(event);
                    }
                    break;
            }
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
        }
        // if (!this.parent.activeView.isTimelineView()) {
        //     this.parent.eventBase.selectWorkCellByTime(dataObj);
        // }
        let crudArgs: CrudArgs = { requestType: 'eventChanged', cancel: false, data: args.data, promise: promise };
        this.refreshData(crudArgs);
    }

    public deleteEvent(id: string | number | Object | Object[], action?: CurrentAction): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        let dataObj: Object[] = [];
        let normalEvent: Object[] = [];
        let recEvent: { [key: string]: Object }[] = [];
        switch (typeof id) {
            case 'string':
            case 'number':
                dataObj = new DataManager(this.parent.eventsData).executeLocal(new Query().where(fields.id, 'equal', <string | number>id));
                break;
            case 'object':
                dataObj = (id instanceof Array) ? id : [id];
                break;
        }
        for (let event of dataObj as { [key: string]: Object }[]) {
            (!isNullOrUndefined(event[fields.recurrenceRule])) ? recEvent.push(event) : normalEvent.push(event);
        }
        let args: ActionEventArgs = { requestType: 'eventRemove', cancel: false };
        if (action !== 'DeleteOccurrence') {
            args.data = dataObj;
            this.parent.trigger(events.actionBegin, args);
            if (args.cancel) {
                return;
            }
        }
        if (isNullOrUndefined(action) || normalEvent.length > 0) {
            for (let event of normalEvent) {
                editParms.deletedRecords.push(event);
            }
        }
        if (recEvent.length > 0) {
            switch (action) {
                case 'Delete':
                case 'DeleteOccurrence':
                    for (let i: number = 0; i < recEvent.length; i++) {
                        let parentEvent: { [key: string]: Object } = this.parent.eventBase.getRecurrenceEvent(recEvent[i]);
                        args.data = { occurrence: recEvent[i], parent: parentEvent };
                        this.parent.trigger(events.actionBegin, args);
                        if (args.cancel) {
                            return;
                        }
                        parentEvent[fields.recurrenceException] =
                            this.excludeDateCheck(<Date>recEvent[i][fields.startTime], <string>parentEvent[fields.recurrenceException]);
                        this.processCrudTimezone(parentEvent);
                        editParms.changedRecords.push(parentEvent as Object);
                        if (recEvent[i][fields.id] !== parentEvent[fields.id]) {
                            editParms.deletedRecords.push(recEvent[i] as Object);
                        }
                    }
                    break;
                case 'DeleteSeries':
                    for (let app of recEvent) {
                        let predicate: Predicate = new Predicate(fields.id, 'equal', (app[fields.recurrenceID] || id) as number).
                            or(new Predicate(fields.recurrenceID, 'equal', (app[fields.recurrenceID] || id) as number));
                        let delApp: Object[] = new DataManager(this.parent.eventsData).executeLocal(new Query().where(predicate));
                        for (let event of delApp) {
                            editParms.deletedRecords.push(event);
                        }
                    }
                    break;
            }
        }
        let promise: Promise<Object>;
        if (editParms.deletedRecords.length === 1 && editParms.changedRecords.length === 0) {
            let deleteEvent: Object = editParms.deletedRecords[0];
            promise =
                this.parent.dataModule.dataManager.remove(fields.id, deleteEvent, this.getTable(), this.getQuery()) as Promise<Object>;
        } else {
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
        }
        this.parent.eventBase.selectWorkCellByTime(dataObj);
        let crudArgs: CrudArgs = { requestType: 'eventRemoved', cancel: false, data: args.data, promise: promise };
        this.refreshData(crudArgs);
    }

    private processCrudTimezone(events: { [key: string]: Object }): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        if (events[fields.startTimezone] || events[fields.endTimezone]) {
            let startTimezone: string = <string>events[fields.startTimezone] || <string>events[fields.endTimezone];
            let endTimezone: string = <string>events[fields.endTimezone] || <string>events[fields.startTimezone];
            if (this.parent.timezone) {
                let zone: number & string = <number & string>this.parent.timezone;
                events[fields.startTime] = this.timezone.convert(<Date>events[fields.startTime], <number & string>startTimezone, zone);
                events[fields.endTime] = this.timezone.convert(<Date>events[fields.endTime], <number & string>endTimezone, zone);
                events[fields.startTime] = this.timezone.remove(<Date>events[fields.startTime], zone);
                events[fields.endTime] = this.timezone.remove(<Date>events[fields.endTime], zone);
            } else {
                events[fields.startTime] = this.timezone.remove(<Date>events[fields.startTime], startTimezone);
                events[fields.endTime] = this.timezone.remove(<Date>events[fields.endTime], endTimezone);
            }
        } else if (this.parent.timezone) {
            events[fields.startTime] = this.timezone.remove(<Date>events[fields.startTime], this.parent.timezone);
            events[fields.endTime] = this.timezone.remove(<Date>events[fields.endTime], this.parent.timezone);
        }
    }

    private excludeDateCheck(eventStartTime: Date, exceptionDateList: string): string {
        let exDate: string = getRecurrenceStringFromDate(eventStartTime);
        if (!isNullOrUndefined(exceptionDateList)) {
            if (exceptionDateList.indexOf(exDate) === -1) {
                exceptionDateList = !(isNullOrUndefined(exceptionDateList)) ? exceptionDateList + ',' + exDate : exDate;
            }
        } else {
            exceptionDateList = exDate;
        }
        return exceptionDateList;
    }
}