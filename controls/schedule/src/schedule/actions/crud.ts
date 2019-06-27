import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { getRecurrenceStringFromDate, generate, getDateFromRecurrenceDateString } from '../../recurrence-editor/date-generator';
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
        if (this.parent.eventBase.isBlockRange(eventData)) {
            let data: Object | Object[] = (eventData instanceof Array) ? [eventData] : eventData;
            this.parent.quickPopup.openValidationError('blockAlert', data);
            return;
        }
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
        if (this.parent.eventBase.isBlockRange(event)) {
            let data: Object | Object[] = (event instanceof Array) ? [event] : event;
            this.parent.quickPopup.openValidationError('blockAlert', data);
            return;
        }
        this.parent.currentAction = action;
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
            let parentEvent: { [key: string]: Object } = this.getParentEvent(data);
            switch (action) {
                case 'EditOccurrence':
                    let edited: { [key: string]: Object }[] = this.getEditedOccurrence(data.Guid as string);
                    args.data = { occurrence: event, parent: parentEvent };
                    this.parent.trigger(events.actionBegin, args);
                    if (args.cancel) {
                        return;
                    }
                    let exDate: string = this.excludeDateCheck(edited[0][fields.startTime] as Date, <string>parentEvent
                    [fields.recurrenceException]);
                    if (exDate !== parentEvent[fields.recurrenceException]) {
                        parentEvent[fields.recurrenceException] = exDate;
                        data[fields.recurrenceID] = parentEvent[fields.id];
                        if (!isNullOrUndefined(data[fields.followingID])) {
                            delete (data[fields.followingID]);
                        }
                        this.processCrudTimezone(parentEvent);
                        editParms.changedRecords.push(parentEvent);
                        this.processCrudTimezone(data);
                        editParms.addedRecords.push(data);
                    } else {
                        this.processCrudTimezone(data);
                        editParms.changedRecords.push(data);
                    }
                    break;
                case 'EditFollowingEvents':
                    if (!this.processEditFutureOccurence(data, parentEvent, editParms)) {
                        return;
                    }
                    break;
                case 'EditSeries':
                    if (!this.processEditSeries(data, parentEvent, editParms)) {
                        return;
                    }
                    this.parent.uiStateValues.isIgnoreOccurrence = false;
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

    private processEditFutureOccurence
        (data: { [key: string]: Object }, parentEvent: { [key: string]: Object }, editParms: SaveChanges):
        boolean {
        let args: ActionEventArgs = { requestType: 'eventChange', cancel: false };
        args.data = data;
        let edited: { [key: string]: Object }[] = this.getEditedOccurrence(data.Guid as string);
        let fields: EventFieldsMapping = this.parent.eventFields;
        this.parent.trigger(events.actionBegin, args);
        if (args.cancel) {
            return false;
        }
        let isEventStart: boolean = (edited[0][fields.startTime] as Date).getTime() === (parentEvent[fields.startTime] as Date).getTime();
        let date: number;
        let immediateParentEvent: { [key: string]: Object };
        if (edited[0][fields.id] === parentEvent[fields.id] && isEventStart) {
            data[fields.id] = parentEvent[fields.id];
            immediateParentEvent = <{ [key: string]: Object }>extend({}, parentEvent);
        } else {
            immediateParentEvent = <{ [key: string]: Object }>extend(
                {}, this.parent.eventBase.getEventById(edited[0][fields.id] as string));
        }
        let initialRecRule: string = immediateParentEvent[fields.recurrenceRule] as string;
        if (data[fields.startTime] !== immediateParentEvent[fields.startTime]) {
            immediateParentEvent[fields.recurrenceRule] = this.getUpdatedParentRule(immediateParentEvent, edited[0]);
        }
        data[fields.recurrenceID] = null;
        let deleteRecurrenceEventList: { [key: string]: Object }[] = [];
        let deleteFutureEditEventList: { [key: string]: Object }[] = this.parent.eventBase.getSeriesEvents
            (immediateParentEvent, edited[0][fields.startTime] as string);
        if (deleteFutureEditEventList.length > 0) {
            initialRecRule = deleteFutureEditEventList.slice(-1)[0][fields.recurrenceRule] as string;
        }
        if (((<string>data[fields.recurrenceRule]).indexOf('COUNT') > -1
            || (<string>data[fields.recurrenceRule]).indexOf('UNTIL') > -1)) {
            let datecollection: number[] = generate(parentEvent[fields.startTime] as Date, initialRecRule, null, 0);
            date = datecollection[datecollection.length - 1];
        }
        deleteRecurrenceEventList = deleteRecurrenceEventList.concat(
            this.parent.eventBase.getEditedOccurrences(edited, edited[0][fields.startTime] as string));
        // To reset following id when start/end time changed or when doing following edit from 1st occurrence of the series
        if (new Date('' + data[fields.startTime]).getTime() !== new Date('' + edited[0][fields.startTime]).getTime()
            || new Date('' + data[fields.endTime]).getTime() !== new Date('' + edited[0][fields.endTime]).getTime() || isEventStart) {
            delete (data[fields.followingID]);
        }
        // To update recurrencce exception 
        data[fields.recurrenceException] = this.parent.uiStateValues.isIgnoreOccurrence
            ? this.updateRecurrenceException(deleteFutureEditEventList, data, parentEvent) : null;
        // To get the update recurrence rule
        data = this.updateRecurrenceRule(deleteFutureEditEventList, data, date);
        if (!isEventStart) {
            this.processCrudTimezone(immediateParentEvent);
            editParms.changedRecords.push(immediateParentEvent);
            this.processCrudTimezone(data);
            editParms.addedRecords.push(data);
        } else {
            this.processCrudTimezone(data);
            editParms.changedRecords.push(data);
        }
        if (!this.parent.uiStateValues.isIgnoreOccurrence) {
            this.updateParentRecurrentException(immediateParentEvent, edited[0], editParms);
            deleteRecurrenceEventList = deleteRecurrenceEventList.concat(this.parent.eventBase.getEditedOccurrences(
                deleteFutureEditEventList, edited[0][fields.startTime] as string));
            editParms.deletedRecords = editParms.deletedRecords.concat(deleteRecurrenceEventList);
        } else {
            // to delete the existing events when edit events using following events
            let deleteFutureEditEvents: Predicate = new Predicate(fields.recurrenceID, 'equal', null);
            deleteFutureEditEventList = this.parent.eventBase.getFilterEventsList(deleteFutureEditEventList, deleteFutureEditEvents);
        }
        // to update the edited event recurrence id & recurrence exception when delele the events
        this.updateRecurrenceIdAfterFollowingSeriesEdit(data, deleteRecurrenceEventList, edited[0], editParms);
        // To delete the existing events after updating futuer edit series.
        editParms.deletedRecords = editParms.deletedRecords.concat(deleteFutureEditEventList);
        this.parent.uiStateValues.isIgnoreOccurrence = false;
        return true;
    }

    private processEditSeries
        (data: { [key: string]: Object }, parentEvent: { [key: string]: Object }, editParms: SaveChanges):
        boolean {
        let args: ActionEventArgs = { requestType: 'eventChange', cancel: false };
        let fields: EventFieldsMapping = this.parent.eventFields;
        args.data = data;
        this.parent.trigger(events.actionBegin, args);
        if (args.cancel) {
            return false;
        }
        if (!this.parent.eventSettings.editFollowingEvents) {
            this.editSeries(data, parentEvent, editParms);
            return true;
        }
        let deleteRecurrenceEventList: { [key: string]: Object }[] = [];
        let deleteExistingEvents: { [key: string]: Object }[] = this.parent.eventBase.getSeriesEvents(
            parentEvent);
        if (deleteExistingEvents.length === 0) {
            this.editSeries(data, parentEvent, editParms);
            return true;
        } else {
            if (data[fields.recurrenceRule] === parentEvent[fields.recurrenceRule]) {
                data[fields.recurrenceRule] = deleteExistingEvents.slice(-1)[0][fields.recurrenceRule];
            }
            deleteRecurrenceEventList = this.parent.eventBase.getEditedOccurrences(deleteExistingEvents);
            data[fields.recurrenceException] = this.parent.uiStateValues.isIgnoreOccurrence
                ? this.updateRecurrenceException(deleteRecurrenceEventList, data, parentEvent) : null;
        }
        data[fields.id] = parentEvent[fields.id];
        data[fields.recurrenceID] = null;
        if (!isNullOrUndefined(data[fields.followingID])) {
            delete (data[fields.followingID]);
        }
        this.processCrudTimezone(data);
        editParms.changedRecords.push(data);
        // to update the edited event recurrence id & recurrence exception when delele the events
        this.updateRecurrenceIdAfterFollowingSeriesEdit(data, deleteRecurrenceEventList, parentEvent, editParms);
        if (!this.parent.uiStateValues.isIgnoreOccurrence) {
            editParms.deletedRecords = editParms.deletedRecords.concat(deleteRecurrenceEventList);
        }
        for (let event of deleteExistingEvents) {
            if (data[fields.id] !== event[fields.id]) {
                editParms.deletedRecords.push(event);
            }
        }

        return true;
    }

    private editSeries(data: { [key: string]: Object }, parentEvent: { [key: string]: Object }, editParms: SaveChanges): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let query: Query = new Query().where(fields.recurrenceID, 'equal', parentEvent[fields.id] as number);
        let delApp: Object[] = new DataManager(this.parent.eventsData).executeLocal(query);
        data[fields.id] = parentEvent[fields.id];
        data[fields.recurrenceException] = this.parent.uiStateValues.isIgnoreOccurrence ?
            parentEvent[fields.recurrenceException] : null;
        data[fields.recurrenceID] = null;
        this.processCrudTimezone(data as { [key: string]: Object });
        editParms.changedRecords.push(data as Object);
        if (!this.parent.uiStateValues.isIgnoreOccurrence) {
            for (let event of delApp) {
                editParms.deletedRecords.push(event);
            }
        }
    }

    private updateRecurrenceIdAfterFollowingSeriesEdit
        (data: { [key: string]: Object }, eventsList: Object[], edited: { [key: string]: Object }, editParms: SaveChanges): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let updateRecurrenceId: Predicate = (new Predicate(fields.recurrenceID, 'notequal', null)).
            and(new Predicate(fields.startTime, 'greaterthanorequal', edited[fields.startTime] as string));
        let eventsToUpdateRecurrenceId: { [key: string]: Object }[] = this.parent.eventBase.getFilterEventsList(
            eventsList, updateRecurrenceId);
        for (let event of eventsToUpdateRecurrenceId) {
            event[fields.recurrenceID] = <string>data[fields.id];
            event[fields.recurrenceException] = <string>data[fields.recurrenceException];
            event[fields.followingID] = null;
            editParms.changedRecords.push(event);
        }
    }

    private updateRecurrenceRule(followingEventsList: { [key: string]: Object }[], data: { [key: string]: Object }, lastEventDate?: number)
        : { [key: string]: Object } {
        let fields: EventFieldsMapping = this.parent.eventFields;
        if (followingEventsList.length > 0) {
            data[fields.recurrenceRule] = followingEventsList.slice(-1)[0][fields.recurrenceRule];
        }
        if (!isNullOrUndefined(lastEventDate) && ((<string>data[fields.recurrenceRule]).indexOf('COUNT') > -1
            || (<string>data[fields.recurrenceRule]).indexOf('UNTIL') > -1)) {
            let date: Date = new Date(lastEventDate);
            let startTime: Date = new Date(date.setDate((new Date(lastEventDate)).getDate()));
            data[fields.recurrenceRule] = this.formatRecurrenceRule(data, startTime);
        }
        return data;
    }

    private updateRecurrenceException
        (ignoreFutureEventList: { [key: string]: Object }[], data: { [key: string]: Object }, parentEvent: { [key: string]: Object })
        : string {
        let fields: EventFieldsMapping = this.parent.eventFields;
        for (let event of ignoreFutureEventList) {
            if (isNullOrUndefined(event[fields.recurrenceException])) {
                let followingEvent: Predicate = new Predicate(fields.id, 'equal', event[fields.recurrenceID] as string);
                let recParentEvent: { [key: string]: Object }[] = this.parent.eventBase.getFilterEventsList(
                    this.parent.eventsData, followingEvent);
                event[fields.recurrenceException] = recParentEvent.length > 0 ?
                    recParentEvent[0][fields.recurrenceException] as string : event[fields.recurrenceException];
            }
            if (!isNullOrUndefined(data[fields.recurrenceException]) && !isNullOrUndefined(event[fields.recurrenceException]) &&
                (<string>data[fields.recurrenceException]).indexOf(event[fields.recurrenceException] as string) === -1) {
                data[fields.recurrenceException] = data[fields.recurrenceException] + ',' + event[fields.recurrenceException];
            } else if (isNullOrUndefined(data[fields.recurrenceException])) {
                data[fields.recurrenceException] = !isNullOrUndefined(parentEvent[fields.recurrenceException])
                    ? parentEvent[fields.recurrenceException] as string : event[fields.recurrenceException];
            }
        }
        return data[fields.recurrenceException] as string;
    }

    private updateParentRecurrentException
        (parentEvent: { [key: string]: Object }, edited: { [key: string]: Object }, editParms: SaveChanges): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let recurrenceString: string[] = isNullOrUndefined(parentEvent[fields.recurrenceException])
            ? [] : (parentEvent[fields.recurrenceException] as string).split(',');
        let flag: number = 0;
        let parentExceptionUpdated: boolean = false;
        for (let recucrrence of recurrenceString) {
            flag++;
            let recurrenceDate: Date = getDateFromRecurrenceDateString(recucrrence);
            if (recurrenceDate >= edited[fields.startTime]) {
                let replaceString: string = flag > 1 ? ',' + recucrrence : recucrrence;
                parentEvent[fields.recurrenceException] = (parentEvent[fields.recurrenceException] as string)
                    .replace(replaceString, '');
                parentEvent[fields.recurrenceException] = parentEvent[fields.recurrenceException] === '' ? null
                    : parentEvent[fields.recurrenceException];
                parentExceptionUpdated = true;
            }
        }
        if (parentExceptionUpdated) {
            editParms.changedRecords.push(parentEvent);
        }
    }

    public deleteEvent(id: string | number | Object | Object[], action?: CurrentAction): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        let dataObj: Object[] = [];
        let normalEvent: Object[] = [];
        let recEvent: { [key: string]: Object }[] = [];
        this.parent.currentAction = action;
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
                        let parentEvent: { [key: string]: Object } = this.getParentEvent(recEvent[i]);
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
                case 'DeleteFollowingEvents':
                case 'DeleteSeries':
                    if (!this.parent.eventSettings.editFollowingEvents) {
                        for (let app of recEvent) {
                            let predicate: Predicate = new Predicate(fields.id, 'equal', (app[fields.recurrenceID] || id) as number).
                                or(new Predicate(fields.recurrenceID, 'equal', (app[fields.recurrenceID] || id) as number));
                            let delApp: Object[] = new DataManager(this.parent.eventsData).executeLocal(new Query().where(predicate));
                            for (let event of delApp) {
                                editParms.deletedRecords.push(event);
                            }
                        }
                    } else {
                        editParms = this.processDeleteSeries(recEvent, editParms, id);
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

    private processDeleteSeries(recEvent: { [key: string]: Object }[], editParms: SaveChanges, id: string | number | Object | Object[])
        : SaveChanges {
        let fields: EventFieldsMapping = this.parent.eventFields;
        for (let app of recEvent) {
            // To set recurrenceID when directly call deleteEvent, Since the parent event is taken based on recucrrence id.
            app[fields.recurrenceID] = isNullOrUndefined(app[fields.recurrenceID]) ? app[fields.id] : app[fields.recurrenceID];
            let parentEvent: { [key: string]: Object };
            let followingEvents: { [key: string]: Object }[] = [];
            let delApp: { [key: string]: Object }[];
            let eventID: string;
            let recurrenceEvent: Predicate;
            if (this.parent.currentAction === 'DeleteFollowingEvents') {
                parentEvent = this.parent.eventBase.getRecurrenceEvent(app);
                eventID = app[fields.id] as string;
                // To update until date for every future delete occurences 
                parentEvent[fields.recurrenceRule] = this.getUpdatedParentRule(parentEvent, app);
                this.processCrudTimezone(parentEvent);
                editParms.changedRecords = editParms.changedRecords.concat(parentEvent as Object);
                // To ignore the past date of clicked event's from edit 
                let delEventQuery: Predicate = new Predicate(fields.id, 'equal', eventID).
                    and(new Predicate(fields.startTime, 'lessthanorequal', app[fields.startTime] as string));
                followingEvents = this.parent.eventBase.getSeriesEvents(parentEvent, app[fields.startTime] as string);
                this.updateParentRecurrentException(parentEvent, app, editParms);
                let currentEvent: Object[] = this.parent.eventBase.getFilterEventsList(this.parent.eventsProcessed, delEventQuery);
                if (currentEvent.length === 1) { editParms.deletedRecords = editParms.deletedRecords.concat(app); }
                recurrenceEvent = (new Predicate(fields.recurrenceID, 'equal', eventID).and
                    (new Predicate(fields.startTime, 'greaterthanorequal', app[fields.startTime] as string)));
            } else {
                parentEvent = this.getParentEvent(app);
                eventID = parentEvent[fields.id] as string;
                followingEvents = this.parent.eventBase.getSeriesEvents(parentEvent);
                editParms.deletedRecords = editParms.deletedRecords.concat(parentEvent);
                recurrenceEvent = (new Predicate(fields.recurrenceID, 'equal', eventID));
            }
            if (followingEvents.length === 0) {
                delApp = this.parent.eventBase.getFilterEventsList(this.parent.eventsData, recurrenceEvent);
            } else {
                delApp = followingEvents.concat(this.parent.eventBase.getEditedOccurrences(
                    followingEvents, parentEvent[fields.startTime] as string));
            }
            editParms.deletedRecords = editParms.deletedRecords.concat(delApp);
        }
        return editParms;
    }
    private getParentEvent(event: { [key: string]: Object }): { [key: string]: Object } {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let parentEvent: { [key: string]: Object };
        if (this.parent.eventSettings.editFollowingEvents && (!isNullOrUndefined(event[fields.followingID]) ||
            (!isNullOrUndefined(fields.recurrenceID) && event[fields.recurrenceID] !== event[fields.id])) &&
            this.parent.currentAction !== 'EditOccurrence' && this.parent.currentAction !== 'DeleteOccurrence') {
            parentEvent = this.parent.eventBase.getParentEvent(event);
        } else {
            parentEvent = this.parent.eventBase.getRecurrenceEvent(event);
        }
        if (parentEvent[fields.startTimezone] || parentEvent[fields.endTimezone]) {
            this.parent.eventBase.timezoneConvert(parentEvent);
        }
        return parentEvent;
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

    private getEditedOccurrence(guid: string): { [key: string]: Object }[] {
        let query: Query = new Query().where('Guid', 'equal', guid as string);
        return new DataManager(this.parent.eventsProcessed).executeLocal(query) as { [key: string]: Object }[];
    }

    private getUpdatedParentRule(parentEvent: { [key: string]: Object }, edited: Object): string {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let date: Date = new Date('' + (<{ [key: string]: Date }>edited)[fields.startTime]);
        let startTime: Date = new Date(date.setDate(date.getDate() + (-1)));
        return this.formatRecurrenceRule(parentEvent, startTime);
    }

    private formatRecurrenceRule(event: { [key: string]: Object }, startTime: Date): string {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let untilDate: string = getRecurrenceStringFromDate(startTime);
        let rule: string = '';
        let splitRecRule: string[] = (<string>event[fields.recurrenceRule]).split(';');
        if ((<string>event[fields.recurrenceRule]).indexOf('UNTIL') > -1) {
            for (let recProperty of splitRecRule) {
                if (recProperty.indexOf('COUNT') === -1 && recProperty !== '') {
                    if (recProperty.indexOf('UNTIL') > -1) {
                        recProperty = recProperty.replace(recProperty, 'UNTIL=' + untilDate);
                    }
                    rule = rule + recProperty + ';';
                }
            }
        } else {
            let updatedRecRule: string;
            let countProp: string;
            for (let prop of splitRecRule) {
                countProp = prop.indexOf('COUNT') > -1 ? prop.replace(';', '') : countProp;
            }
            updatedRecRule = <string>event[fields.recurrenceRule];
            let lastChar: string = updatedRecRule.slice(-1)[0];
            rule = lastChar === ';' ? updatedRecRule + 'UNTIL=' + untilDate + ';' : updatedRecRule + ';UNTIL=' + untilDate + ';';
            rule = rule.indexOf('UNTIL') > -1 ? rule.replace(countProp + ';', '') : rule;
        }
        return rule;
    }
}