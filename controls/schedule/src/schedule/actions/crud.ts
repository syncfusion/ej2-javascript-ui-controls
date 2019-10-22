import { isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { getRecurrenceStringFromDate, generate } from '../../recurrence-editor/date-generator';
import { ActionEventArgs, EventFieldsMapping, SaveChanges, CrudArgs } from '../base/interface';
import { ReturnType, CurrentAction } from '../base/type';
import { Schedule } from '../base/schedule';
import * as events from '../base/constant';
import * as util from '../base/util';

/**
 * Schedule CRUD operations
 */

export class Crud {
    private parent: Schedule;

    constructor(parent: Schedule) {
        this.parent = parent;
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
        let actionArgs: ActionEventArgs = {
            requestType: args.requestType, cancel: false, data: args.data,
            addedRecords: args.editParms.addedRecords, changedRecords: args.editParms.changedRecords,
            deletedRecords: args.editParms.deletedRecords
        };
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(events.actionComplete, actionArgs, (offlineArgs: ActionEventArgs) => {
                if (!offlineArgs.cancel) {
                    this.parent.renderModule.refreshDataManager();
                }
            });
        } else {
            args.promise.then((e: ReturnType) => {
                if (this.parent.isDestroyed) { return; }
                this.parent.trigger(events.actionComplete, actionArgs, (onlineArgs: ActionEventArgs) => {
                    if (!onlineArgs.cancel) {
                        this.parent.renderModule.refreshDataManager();
                    }
                });
            }).catch((e: ReturnType) => {
                if (this.parent.isDestroyed) { return; }
                this.parent.trigger(events.actionFailure, { error: e });
            });
        }
    }

    public addEvent(eventData: Object | Object[]): void {
        if (this.parent.eventSettings.allowAdding) {
            if (this.parent.eventBase.isBlockRange(eventData)) {
                this.parent.quickPopup.openValidationError('blockAlert', (eventData instanceof Array) ? [eventData] : eventData);
                return;
            }
            let addEvents: Object[] = (eventData instanceof Array) ? eventData : [eventData];
            let args: ActionEventArgs = {
                requestType: 'eventCreate', cancel: false,
                addedRecords: addEvents, changedRecords: [], deletedRecords: []
            };
            if (!isBlazor()) {
                args.data = addEvents;
            }
            this.parent.trigger(events.actionBegin, args, (addArgs: ActionEventArgs) => {
                this.serializeData(addArgs.addedRecords);
                if (!addArgs.cancel) {
                    let fields: EventFieldsMapping = this.parent.eventFields;
                    let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                    let promise: Promise<Object>;
                    if (addArgs.addedRecords instanceof Array) {
                        for (let event of addArgs.addedRecords as { [key: string]: Object }[]) {
                            editParms.addedRecords.push(this.parent.eventBase.processTimezone(event, true));
                        }
                        // tslint:disable-next-line:max-line-length
                        promise = this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
                    } else {
                        let event: Object = this.parent.eventBase.processTimezone(addArgs.addedRecords as { [key: string]: Object }, true);
                        editParms.addedRecords.push(event);
                        promise = this.parent.dataModule.dataManager.insert(event, this.getTable(), this.getQuery()) as Promise<Object>;
                    }
                    let crudArgs: CrudArgs = {
                        requestType: 'eventCreated', cancel: false, data: addArgs.addedRecords, promise: promise, editParms: editParms
                    };
                    this.refreshData(crudArgs);
                }
            });
        }
    }

    public saveEvent(eventData: { [key: string]: Object } | { [key: string]: Object }[], action: CurrentAction): void {
        if (this.parent.eventSettings.allowEditing) {
            if (this.parent.eventBase.isBlockRange(eventData)) {
                this.parent.quickPopup.openValidationError('blockAlert', (eventData instanceof Array) ? [eventData] : eventData);
                return;
            }
            this.parent.currentAction = action;
            if (action) {
                switch (action) {
                    case 'EditOccurrence':
                        this.processOccurrences(eventData, action);
                        break;
                    case 'EditFollowingEvents':
                        this.processFollowSeries(eventData, action);
                        break;
                    case 'EditSeries':
                        this.processEntireSeries(eventData, action);
                        break;
                }
            } else {
                let updateEvents: Object[] = (eventData instanceof Array) ? eventData : [eventData];
                let args: ActionEventArgs = {
                    requestType: 'eventChange', cancel: false,
                    addedRecords: [], changedRecords: updateEvents, deletedRecords: []
                };
                if (!isBlazor()) {
                    args.data = eventData;
                }
                this.parent.trigger(events.actionBegin, args, (saveArgs: ActionEventArgs) => {
                    this.serializeData(saveArgs.changedRecords);
                    if (!saveArgs.cancel) {
                        let promise: Promise<Object>;
                        let fields: EventFieldsMapping = this.parent.eventFields;
                        let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                        if (saveArgs.changedRecords instanceof Array) {
                            for (let event of saveArgs.changedRecords as { [key: string]: Object }[]) {
                                editParms.changedRecords.push(this.parent.eventBase.processTimezone(event, true));
                            }
                            // tslint:disable-next-line:max-line-length
                            promise = this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
                        } else {
                            let event: { [key: string]: Object } = this.parent.eventBase.processTimezone(saveArgs.changedRecords, true);
                            editParms.changedRecords.push(event);
                            // tslint:disable-next-line:max-line-length
                            promise = this.parent.dataModule.dataManager.update(fields.id, event, this.getTable(), this.getQuery()) as Promise<Object>;
                        }
                        let crudArgs: CrudArgs = {
                            requestType: 'eventChanged', cancel: false, data: saveArgs.data, promise: promise, editParms: editParms
                        };
                        this.refreshData(crudArgs);
                    }
                });
            }
        }
    }

    public deleteEvent(eventData: string | number | Object | Object[], action: CurrentAction): void {
        if (this.parent.eventSettings.allowDeleting) {
            this.parent.currentAction = action;
            let deleteEvents: { [key: string]: Object }[] = [];
            if (typeof eventData === 'string' || typeof eventData === 'number') {
                deleteEvents = this.parent.eventsData.filter((eventObj: { [key: string]: Object }) =>
                    eventObj[this.parent.eventFields.id] === eventData) as { [key: string]: Object }[];
            } else {
                deleteEvents = (eventData instanceof Array ? eventData : [eventData]) as { [key: string]: Object }[];
            }
            if (action) {
                switch (action) {
                    case 'Delete':
                        this.processEventDelete(deleteEvents);
                        break;
                    case 'DeleteOccurrence':
                        this.processOccurrences(deleteEvents, action);
                        break;
                    case 'DeleteFollowingEvents':
                        this.processFollowSeries(deleteEvents, action);
                        break;
                    case 'DeleteSeries':
                        this.processEntireSeries(deleteEvents, action);
                        break;
                }
            } else {
                let args: ActionEventArgs = {
                    requestType: 'eventRemove', cancel: false,
                    addedRecords: [], changedRecords: [], deletedRecords: deleteEvents
                };
                if (!isBlazor()) {
                    args.data = eventData;
                }
                this.parent.trigger(events.actionBegin, args, (deleteArgs: ActionEventArgs) => {
                    this.serializeData(deleteArgs.deletedRecords);
                    if (!deleteArgs.cancel) {
                        let promise: Promise<Object>;
                        let fields: EventFieldsMapping = this.parent.eventFields;
                        let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                        if (deleteArgs.deletedRecords.length > 1) {
                            for (let eventObj of deleteArgs.deletedRecords) {
                                editParms.deletedRecords.push(eventObj);
                            }
                            // tslint:disable-next-line:max-line-length
                            promise = this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
                        } else {
                            editParms.deletedRecords.push(deleteArgs.deletedRecords[0]);
                            // tslint:disable-next-line:max-line-length
                            promise = this.parent.dataModule.dataManager.remove(fields.id, deleteArgs.deletedRecords[0], this.getTable(), this.getQuery()) as Promise<Object>;
                        }
                        this.parent.eventBase.selectWorkCellByTime(deleteArgs.deletedRecords);
                        let crudArgs: CrudArgs = {
                            requestType: 'eventRemoved', cancel: false, data: deleteArgs.data, promise: promise, editParms: editParms
                        };
                        this.refreshData(crudArgs);
                    }
                });
            }
        }
    }

    private processOccurrences(eventData: { [key: string]: Object } | { [key: string]: Object }[], action: CurrentAction): void {
        let occurenceData: { [key: string]: Object } | { [key: string]: Object }[] = [];
        if (eventData instanceof Array) {
            for (let event of eventData) {
                occurenceData.push({ occurrence: event, parent: this.getParentEvent(event) });
            }
        } else {
            occurenceData = { occurrence: eventData, parent: this.getParentEvent(eventData) };
        }
        let updateEvents: Object[] = (eventData instanceof Array) ? eventData : [eventData];
        let args: ActionEventArgs = {
            requestType: action === 'EditOccurrence' ? 'eventChange' : 'eventRemove', cancel: false,
            addedRecords: [], changedRecords: updateEvents, deletedRecords: []
        };
        if (!isBlazor()) {
            args.data = occurenceData;
        }
        this.parent.trigger(events.actionBegin, args, (occurenceArgs: ActionEventArgs) => {
            this.serializeData(occurenceArgs.changedRecords);
            if (!occurenceArgs.cancel) {
                let fields: EventFieldsMapping = this.parent.eventFields;
                let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                let occurrenceEvents: { [key: string]: Object }[] = (occurenceData instanceof Array ? occurenceData : [occurenceData]) as
                    { [key: string]: Object }[];
                for (let a: number = 0, count: number = occurenceArgs.changedRecords.length; a < count; a++) {
                    let childEvent: { [key: string]: Object } = occurenceArgs.changedRecords[a] as { [key: string]: Object };
                    let parentEvent: { [key: string]: Object } = occurrenceEvents[a].parent as { [key: string]: Object };
                    let parentException: string = parentEvent[fields.recurrenceException] as string;
                    switch (action) {
                        case 'EditOccurrence':
                            let editedData: { [key: string]: Date } = this.parent.eventsProcessed.filter(
                                (event: { [key: string]: Object }) => event.Guid === childEvent.Guid)[0] as { [key: string]: Date };
                            let exceptionDate: string = this.excludeDateCheck(editedData[fields.startTime], parentException);
                            if (exceptionDate !== parentEvent[fields.recurrenceException]) {
                                parentEvent[fields.recurrenceException] = exceptionDate;
                                childEvent[fields.recurrenceException] = getRecurrenceStringFromDate(editedData[fields.startTime] as Date);
                                childEvent[fields.recurrenceID] = parentEvent[fields.id];
                                childEvent[fields.followingID] = null;
                                editParms.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                                editParms.addedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                            } else {
                                editParms.changedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                            }
                            break;
                        case 'DeleteOccurrence':
                            if (!childEvent[fields.recurrenceException]) {
                                parentEvent[fields.recurrenceException] =
                                    this.excludeDateCheck(<Date>childEvent[fields.startTime], parentException);
                                editParms.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                            }
                            if (childEvent[fields.id] !== parentEvent[fields.id]) {
                                editParms.deletedRecords.push(childEvent);
                            }
                            break;
                    }
                }
                // tslint:disable-next-line:max-line-length
                let promise: Promise<Object> = this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
                this.parent.eventBase.selectWorkCellByTime(occurenceArgs.changedRecords);
                let crudArgs: CrudArgs = {
                    requestType: action === 'EditOccurrence' ? 'eventChanged' : 'eventRemoved',
                    cancel: false, data: occurenceArgs.data, promise: promise, editParms: editParms
                };
                this.refreshData(crudArgs);
            }
        });
    }

    private processFollowSeries(eventData: { [key: string]: Object } | { [key: string]: Object }[], action: CurrentAction): void {
        let followData: { [key: string]: Object } | { [key: string]: Object }[] = [];
        if (eventData instanceof Array) {
            for (let event of eventData) {
                followData.push({ occurrence: event, parent: this.getParentEvent(event) });
            }
        } else {
            followData = { occurrence: eventData, parent: this.getParentEvent(eventData) };
        }
        let updateFollowEvents: Object[] = (eventData instanceof Array) ? eventData : [eventData];
        let args: ActionEventArgs = {
            requestType: action === 'EditFollowingEvents' ? 'eventChange' : 'eventRemove', cancel: false,
            addedRecords: [], changedRecords: updateFollowEvents, deletedRecords: []
        };
        if (!isBlazor()) {
            args.data = followData;
        }
        this.parent.trigger(events.actionBegin, args, (followArgs: ActionEventArgs) => {
            this.serializeData(followArgs.changedRecords);
            if (!followArgs.cancel) {
                let fields: EventFieldsMapping = this.parent.eventFields;
                let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                let followEvents: { [key: string]: Object }[] = (followData instanceof Array ? followData : [followData]) as
                    { [key: string]: Object }[];
                for (let a: number = 0, count: number = followArgs.changedRecords.length; a < count; a++) {
                    let childEvent: { [key: string]: Object } = followArgs.changedRecords[a] as { [key: string]: Object };
                    let parentEvent: { [key: string]: Object } = followEvents[a].parent as { [key: string]: Object };
                    let followData: { [key: string]: Object[] } = this.parent.eventBase.getEventCollections(parentEvent, childEvent);
                    switch (action) {
                        case 'EditFollowingEvents':
                            this.processRecurrenceRule(parentEvent, childEvent);
                            let isSplitted: boolean = !this.parent.eventBase.isFollowingEvent(parentEvent, childEvent);
                            childEvent[fields.followingID] = isSplitted ? null : parentEvent[fields.id];
                            childEvent[fields.recurrenceID] = null;
                            editParms.addedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                            editParms.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                            if (!this.parent.uiStateValues.isIgnoreOccurrence) {
                                childEvent[fields.recurrenceException] = null;
                                if (followData.occurrence.length > 0) {
                                    childEvent[fields.recurrenceRule] =
                                        (<{ [key: string]: Object }>followData.occurrence.slice(-1)[0])[fields.recurrenceRule];
                                }
                                if (followData.follow.length > 0) {
                                    childEvent[fields.recurrenceRule] =
                                        (<{ [key: string]: Object }>followData.follow.slice(-1)[0])[fields.recurrenceRule];
                                    editParms.deletedRecords = editParms.deletedRecords.concat(followData.follow);
                                }
                                if (isSplitted) {
                                    followData.occurrence = followData.occurrence.filter((eventObj: { [key: string]: Object }) =>
                                        eventObj[fields.recurrenceID] === childEvent[fields.id]);
                                }
                                editParms.deletedRecords = editParms.deletedRecords.concat(followData.occurrence);
                            }
                            break;
                        case 'DeleteFollowingEvents':
                            this.processRecurrenceRule(parentEvent, childEvent[fields.startTime] as Date);
                            editParms.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                            editParms.deletedRecords =
                                editParms.deletedRecords.concat(followData.occurrence).concat(followData.follow);
                            break;
                    }
                }
                // tslint:disable-next-line:max-line-length
                let promise: Promise<Object> = this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
                this.parent.eventBase.selectWorkCellByTime(followArgs.changedRecords);
                let crudArgs: CrudArgs = {
                    requestType: action === 'EditFollowingEvents' ? 'eventChanged' : 'eventRemoved',
                    cancel: false, data: followArgs.data, promise: promise, editParms: editParms
                };
                this.refreshData(crudArgs);
            }
        });
    }

    private processEntireSeries(eventData: { [key: string]: Object } | { [key: string]: Object }[], action: CurrentAction): void {
        let seriesData: { [key: string]: Object } | { [key: string]: Object }[] = [];
        if (eventData instanceof Array) {
            for (let event of eventData) {
                seriesData.push(this.getParentEvent(event, true));
            }
        } else {
            seriesData = this.getParentEvent(eventData, true);
        }
        let updateSeriesEvents: Object[] = (eventData instanceof Array) ? eventData : [eventData];
        let args: ActionEventArgs = {
            requestType: action === 'EditSeries' ? 'eventChange' : 'eventRemove', cancel: false,
            addedRecords: [], changedRecords: updateSeriesEvents, deletedRecords: []
        };
        if (!isBlazor()) {
            args.data = seriesData;
        }
        this.parent.trigger(events.actionBegin, args, (seriesArgs: ActionEventArgs) => {
            this.serializeData(seriesArgs.changedRecords);
            if (!seriesArgs.cancel) {
                let fields: EventFieldsMapping = this.parent.eventFields;
                let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                let seriesEvents: { [key: string]: Object }[] = (seriesData instanceof Array ? seriesData : [seriesData]) as
                    { [key: string]: Object }[];
                for (let a: number = 0, count: number = seriesArgs.changedRecords.length; a < count; a++) {
                    let childEvent: { [key: string]: Object } = seriesArgs.changedRecords[a] as { [key: string]: Object };
                    let parentEvent: { [key: string]: Object } = seriesEvents[a] as { [key: string]: Object };
                    let eventCollections: { [key: string]: Object[]; } = this.parent.eventBase.getEventCollections(parentEvent);
                    let deletedEvents: Object[] = eventCollections.follow.concat(eventCollections.occurrence);
                    switch (action) {
                        case 'EditSeries':
                            childEvent[fields.id] = parentEvent[fields.id];
                            childEvent[fields.recurrenceID] = null;
                            childEvent[fields.followingID] = null;
                            if (this.parent.uiStateValues.isIgnoreOccurrence && childEvent[fields.recurrenceException]) {
                                let originalParent: { [key: string]: Object }[] =
                                    this.parent.eventsData.filter((eventObj: { [key: string]: Object }) =>
                                        eventObj[fields.id] === childEvent[fields.id]) as { [key: string]: Object }[];
                                if (originalParent.length > 0) {
                                    childEvent[fields.recurrenceRule] = originalParent[0][fields.recurrenceRule];
                                }
                            } else {
                                childEvent[fields.recurrenceException] = null;
                                editParms.deletedRecords = editParms.deletedRecords.concat(deletedEvents);
                            }
                            editParms.changedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                            this.parent.uiStateValues.isIgnoreOccurrence = false;
                            break;
                        case 'DeleteSeries':
                            editParms.deletedRecords = editParms.deletedRecords.concat(deletedEvents.concat(parentEvent));
                            break;
                    }
                }
                // tslint:disable-next-line:max-line-length
                let promise: Promise<Object> = this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
                this.parent.eventBase.selectWorkCellByTime(seriesArgs.changedRecords);
                let crudArgs: CrudArgs = {
                    requestType: action === 'EditSeries' ? 'eventChanged' : 'eventRemoved',
                    cancel: false, data: seriesArgs.data, promise: promise, editParms: editParms
                };
                this.refreshData(crudArgs);
            }
        });
    }

    private processEventDelete(eventData: { [key: string]: Object }[]): void {
        let deleteData: { [key: string]: Object }[] = [];
        for (let eventObj of eventData) {
            if (eventObj[this.parent.eventFields.recurrenceRule]) {
                deleteData.push({ occurrence: eventObj, parent: this.getParentEvent(eventObj) });
            } else {
                deleteData.push(eventObj);
            }
        }
        let args: ActionEventArgs = {
            requestType: 'eventRemove', cancel: false,
            addedRecords: [], changedRecords: [], deletedRecords: eventData
        };
        if (!isBlazor()) {
            args.data = deleteData;
        }
        this.parent.trigger(events.actionBegin, args, (deleteArgs: ActionEventArgs) => {
            this.serializeData(deleteArgs.deletedRecords);
            if (!deleteArgs.cancel) {
                let fields: EventFieldsMapping = this.parent.eventFields;
                let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                for (let a: number = 0, count: number = deleteArgs.deletedRecords.length; a < count; a++) {
                    let isDelete: boolean = isNullOrUndefined(
                        (deleteArgs.deletedRecords as { [key: string]: Object }[])[a][this.parent.eventFields.recurrenceRule]);
                    if (!isDelete) {
                        let parentEvent: { [key: string]: Object } = deleteData[a].parent as { [key: string]: Object };
                        let isEdited: { [key: string]: Object }[] = editParms.changedRecords.filter((obj: { [key: string]: Object }) =>
                            obj[fields.id] === parentEvent[fields.id]) as { [key: string]: Object }[];
                        let editedDate: Date = (deleteArgs.deletedRecords as { [key: string]: Object }[])[a][fields.startTime] as Date;
                        if (isEdited.length > 0) {
                            let editedData: { [key: string]: Object } = isEdited[0];
                            editedData[fields.recurrenceException] =
                                this.excludeDateCheck(editedDate, <string>editedData[fields.recurrenceException]);
                        } else {
                            parentEvent[fields.recurrenceException] =
                                this.excludeDateCheck(editedDate, <string>parentEvent[fields.recurrenceException]);
                        }
                        if (isEdited.length === 0) {
                            editParms.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                        }
                        isDelete = ((deleteArgs.deletedRecords as { [key: string]: Object }[])[a][fields.id] !== parentEvent[fields.id]);
                    }
                    if (isDelete) {
                        editParms.deletedRecords.push((deleteArgs.deletedRecords as { [key: string]: Object }[])[a]);
                    }
                }
                // tslint:disable-next-line:max-line-length
                let promise: Promise<Object> = this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery()) as Promise<Object>;
                let crudArgs: CrudArgs = {
                    requestType: 'eventRemoved', cancel: false, data: deleteArgs.data, promise: promise, editParms: editParms
                };
                this.refreshData(crudArgs);
            }
        });
    }

    public serializeData(eventData: Object[]): void {
        if (isBlazor()) {
            let eventFields: EventFieldsMapping = this.parent.eventFields;
            for (let event of eventData as { [key: string]: Date }[]) {
                event[eventFields.startTime] = this.parent.getDateTime(event[eventFields.startTime]);
                event[eventFields.endTime] = this.parent.getDateTime(event[eventFields.endTime]);
            }
        }
    }

    private getParentEvent(event: { [key: string]: Object }, isParent: boolean = false): { [key: string]: Object } {
        let parentEvent: { [key: string]: Object } = this.parent.eventBase.getParentEvent(event, isParent) || event;
        if (parentEvent[this.parent.eventFields.startTimezone] || parentEvent[this.parent.eventFields.endTimezone]) {
            this.parent.eventBase.timezoneConvert(parentEvent);
        }
        return parentEvent;
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

    private processRecurrenceRule(parentEvent: { [key: string]: Object }, followEvent?: { [key: string]: Object } | Date): void {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let recurrenceRule: string = parentEvent[fields.recurrenceRule] as string;
        let endDate: Date;
        if (followEvent instanceof Date) {
            endDate = new Date(+followEvent);
        } else {
            endDate = followEvent[fields.startTime] as Date;
            let startDate: Date = parentEvent[fields.startTime] as Date;
            let ruleException: string = followEvent[fields.recurrenceException] as string;
            let dateCollection: number[] = generate(startDate, recurrenceRule, ruleException, this.parent.activeViewOptions.firstDayOfWeek);
            let untilDate: Date = new Date(dateCollection.slice(-1)[0]);
            followEvent[fields.recurrenceRule] = this.getUpdatedRecurrenceRule(recurrenceRule, new Date(+untilDate), false);
        }
        parentEvent[fields.recurrenceRule] =
            this.getUpdatedRecurrenceRule(recurrenceRule, util.addDays(new Date(endDate.getTime()), -1), true);
    }

    private getUpdatedRecurrenceRule(recurrenceRule: string, untilDate: Date, isParent: boolean): string {
        let splitRule: string[] = recurrenceRule.split(';');
        let updatedRule: string = '';
        for (let rule of splitRule) {
            if (rule !== '') {
                let ruleKey: string = rule.split('=')[0];
                let ruleValue: string = rule.split('=')[1];
                if (ruleKey === 'COUNT' || ruleKey === 'UNTIL') {
                    ruleValue = getRecurrenceStringFromDate(untilDate);
                    rule = rule.replace(rule, 'UNTIL=' + ruleValue);
                }
                updatedRule += rule + ';';
            }
        }
        if (isParent && updatedRule.indexOf('UNTIL') === -1) {
            updatedRule += 'UNTIL=' + getRecurrenceStringFromDate(untilDate);
        }
        return updatedRule;
    }

}
