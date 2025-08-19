/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { isNullOrUndefined, extend, removeClass } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { getRecurrenceStringFromDate, generate } from '../../recurrence-editor/date-generator';
import { ActionEventArgs, EventFieldsMapping, SaveChanges, CrudArgs, CrudAction, TdData } from '../base/interface';
import { ReturnType, CurrentAction } from '../base/type';
import { Schedule } from '../base/schedule';
import * as events from '../base/constant';
import * as util from '../base/util';

/**
 * Schedule CRUD operations
 */

export class Crud {
    private parent: Schedule;
    public crudObj: CrudAction;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.crudObj = { sourceEvent: null, targetEvent: null, isCrudAction: false };
    }

    private getQuery(): Query {
        const start: Date = this.parent.activeView.startDate();
        const end: Date = this.parent.activeView.endDate();
        return this.parent.dataModule.generateQuery(start, end);
    }

    private getTable(): string {
        if (this.parent.eventSettings.query) {
            const query: Query = this.parent.eventSettings.query.clone();
            return query.fromTable;
        }
        return null;
    }

    public refreshDataManager(): void {
        if (!this.parent.activeView) {
            return;
        }

        if (this.parent.uiStateValues && this.parent.uiStateValues.isPreventEventRefresh) {
            this.parent.uiStateValues.isPreventEventRefresh = false;
            this.parent.refreshEvents(false);
            this.parent.hideSpinner();
            return;
        }
        const start: Date = this.parent.activeView.startDate();
        const end: Date = this.parent.activeView.endDate();
        const dataManager: Promise<any> = this.parent.dataModule.getData(this.parent.dataModule.generateQuery(start, end));
        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e)).catch((e: ReturnType) => this.dataManagerFailure(e));
    }

    private dataManagerSuccess(e: ReturnType): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.parent.trigger(events.dataBinding, e, (args: ReturnType) => {
            if (args.cancel) { return; }
            const resultData: Record<string, any>[] = extend([], args.result, null, true) as Record<string, any>[];
            this.parent.eventsData = resultData.filter((data: Record<string, any>) => !data[this.parent.eventFields.isBlock]);
            this.parent.blockData = resultData.filter((data: Record<string, any>) => data[this.parent.eventFields.isBlock]);
            this.refreshProcessedData();
            if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
                this.parent.dragAndDropModule.navigationWrapper();
            }
            this.parent.trigger(events.dataBound, null, () => {
                this.parent.hideSpinner();
                if (this.parent.isPrinting) {
                    setTimeout(() => {
                        this.parent.notify(events.print, {});
                    }, 100);
                }
            });
        });
    }

    public dataManagerFailure(e: ReturnType): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.parent.trigger(events.actionFailure, { error: e }, () => this.parent.hideSpinner());
    }

    public refreshProcessedData(isVirtualScrollAction: boolean = false, dynamicEvents?: Record<string, any>[]): void {
        if (this.parent.dragAndDropModule) {
            this.parent.dragAndDropModule.actionObj.action = '';
            removeClass([this.parent.element], 'e-event-action');
        }
        if (this.parent.activeViewOptions && this.parent.activeViewOptions.eventTemplate) {
            let templateNames: string[] = ['eventTemplate'];
            if (this.crudObj.isCrudAction &&
                ['Agenda', 'MonthAgenda', 'Year', 'TimelineYear'].indexOf(this.parent.currentView) === -1) {
                templateNames = [];
                for (let i: number = 0, len: number = this.crudObj.sourceEvent.length; i < len; i++) {
                    templateNames.push('eventTemplate_' + this.crudObj.sourceEvent[parseInt(i.toString(), 10)].groupIndex);
                    if (this.crudObj.targetEvent[parseInt(i.toString(), 10)] && this.crudObj.sourceEvent[parseInt(i.toString(), 10)].groupIndex !==
                        this.crudObj.targetEvent[parseInt(i.toString(), 10)].groupIndex) {
                        templateNames.push('eventTemplate_' + this.crudObj.targetEvent[parseInt(i.toString(), 10)].groupIndex);
                    }
                }
            }
            if (templateNames.length > 0) {
                this.parent.resetTemplates(templateNames);
            }
        }
        if (isVirtualScrollAction) {
            this.parent.notify(events.dataReady, { processedData: dynamicEvents ? this.parent.eventBase.processData(dynamicEvents) : this.parent.eventsProcessed });
            return;
        }
        const eventsData: Record<string, any>[] = this.parent.eventsData || [];
        const blockData: Record<string, any>[] = this.parent.blockData || [];
        const data: Record<string, any>[] = eventsData.concat(blockData);
        this.parent.notify(events.dataReady, { processedData: this.parent.eventBase ? this.parent.eventBase.processData(data) : [] });
    }

    private refreshData(args: CrudArgs): void {
        const actionArgs: ActionEventArgs = {
            requestType: args.requestType, cancel: false, data: args.data,
            addedRecords: args.editParams.addedRecords, changedRecords: args.editParams.changedRecords,
            deletedRecords: args.editParams.deletedRecords
        };
        if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj && this.parent.dragAndDropModule.actionObj.element && this.parent.dragAndDropModule.actionObj.action) {
            this.parent.dragAndDropModule.actionObj.element.style.display = 'none';
        }
        if (this.parent.resizeModule && this.parent.resizeModule.actionObj && this.parent.resizeModule.actionObj.element && this.parent.resizeModule.actionObj.action) {
            this.parent.resizeModule.actionObj.element.style.display = 'none';
        }
        if (this.parent.isSpecificResourceEvents()) {
            if (args.requestType === 'eventCreated' || args.requestType === 'eventRemoved') {
                this.crudObj.isCrudAction = true;
                this.crudObj.sourceEvent = [];
                const crudData: Record<string, any>[] = args.data instanceof Array ? (args.data.length === 0 &&
                    args.requestType === 'eventRemoved' ? args.editParams.deletedRecords : args.data) :
                    ((typeof args.data === 'string' || typeof args.data === 'number') && args.requestType === 'eventRemoved') ?
                        args.editParams.deletedRecords : [args.data];
                for (const data of crudData) {
                    this.crudObj.isCrudAction = !(args.requestType === 'eventRemoved' && !isNullOrUndefined(data.parent));
                    const groupIndex: number = this.parent.eventBase.getGroupIndexFromEvent(data);
                    if (groupIndex > -1 && this.parent.crudModule.crudObj.sourceEvent.filter((tdData: TdData) => tdData.groupIndex === groupIndex).length === 0
                        && this.crudObj.isCrudAction) {
                        this.crudObj.sourceEvent.push(this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex.toString(), 10)]);
                    }
                }
                this.crudObj.targetEvent = this.crudObj.sourceEvent;
            }
        }
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(events.actionComplete, actionArgs, (offlineArgs: ActionEventArgs) => {
                if (!offlineArgs.cancel) {
                    this.refreshDataManager();
                }
            });
        } else {
            args.promise.then(() => {
                if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
                this.parent.trigger(events.actionComplete, actionArgs, (onlineArgs: ActionEventArgs) => {
                    if (!onlineArgs.cancel) {
                        this.refreshDataManager();
                    }
                });
            }).catch((e: ReturnType) => {
                if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
                this.parent.trigger(events.actionFailure, { error: e });
            });
        }
    }

    private processAddEvent(addArgs: ActionEventArgs): void {
        const fields: EventFieldsMapping = this.parent.eventFields;
        const editParams: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        let promise: Promise<any>;
        if (addArgs.addedRecords instanceof Array) {
            for (let event of addArgs.addedRecords) {
                event = this.parent.eventBase.updateEventDateTime(event);
                const eventData: Record<string, any> = <Record<string, any>>extend({}, this.parent.eventBase.processTimezone(event, true), null, true);
                editParams.addedRecords.push(eventData);
            }
            promise = this.parent.dataModule.dataManager.saveChanges(editParams, fields.id, this.getTable(), this.getQuery()) as Promise<any>;
        } else {
            const event: Record<string, any> = this.parent.eventBase.processTimezone(addArgs.addedRecords, true);
            editParams.addedRecords.push(event);
            promise = this.parent.dataModule.dataManager.insert(event, this.getTable(), this.getQuery()) as Promise<any>;
        }
        const crudArgs: CrudArgs = {
            requestType: 'eventCreated', cancel: false, data: addArgs.addedRecords, promise: promise, editParams: editParams
        };
        this.refreshData(crudArgs);
    }

    private processSaveEvent(saveArgs: ActionEventArgs): void {
        let promise: Promise<any>;
        const fields: EventFieldsMapping = this.parent.eventFields;
        const editParams: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (saveArgs.changedRecords instanceof Array) {
            for (let event of saveArgs.changedRecords) {
                event = this.parent.eventBase.updateEventDateTime(event);
                const eventData: Record<string, any> = <Record<string, any>>extend({}, this.parent.eventBase.processTimezone(event, true), null, true);
                editParams.changedRecords.push(eventData);
            }
            promise = this.parent.dataModule.dataManager.saveChanges(editParams, fields.id, this.getTable(), this.getQuery()) as Promise<any>;
        } else {
            const event: Record<string, any> = this.parent.eventBase.processTimezone(saveArgs.changedRecords, true);
            editParams.changedRecords.push(event);
            promise = this.parent.dataModule.dataManager.update(fields.id, event, this.getTable(), this.getQuery()) as Promise<any>;
        }
        const cloneEvent: Record<string, any> = extend({}, saveArgs.changedRecords[saveArgs.changedRecords.length - 1], null, true) as Record<string, any>;
        this.parent.eventBase.selectWorkCellByTime([this.parent.eventBase.processTimezone(cloneEvent)]);
        const crudArgs: CrudArgs = {
            requestType: 'eventChanged', cancel: false,
            data: saveArgs.changedRecords, promise: promise, editParams: editParams
        };
        this.refreshData(crudArgs);
    }

    private processDeleteEvent(deleteArgs: ActionEventArgs): void {
        let promise: Promise<any>;
        const fields: EventFieldsMapping = this.parent.eventFields;
        const editParams: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (deleteArgs.deletedRecords.length > 1) {
            editParams.deletedRecords = editParams.deletedRecords.concat(deleteArgs.deletedRecords);
            promise = this.parent.dataModule.dataManager.saveChanges(editParams, fields.id, this.getTable(), this.getQuery()) as Promise<any>;
        } else {
            editParams.deletedRecords.push(deleteArgs.deletedRecords[0]);
            promise = this.parent.dataModule.dataManager.remove(fields.id, deleteArgs.deletedRecords[0], this.getTable(), this.getQuery()) as Promise<any>;
        }
        this.parent.eventBase.selectWorkCellByTime(deleteArgs.deletedRecords);
        const crudArgs: CrudArgs = {
            requestType: 'eventRemoved', cancel: false,
            data: deleteArgs.deletedRecords, promise: promise, editParams: editParams
        };
        this.refreshData(crudArgs);
    }

    public addEvent(eventData: Record<string, any> | Record<string, any>[]): void {
        if (this.parent.eventSettings.allowAdding && !this.parent.activeViewOptions.readonly) {
            if (!this.isBlockEvent(eventData) && this.parent.eventBase.isBlockRange(eventData)) {
                this.parent.quickPopup.openValidationError('blockAlert', eventData);
                return;
            }
            if (this.parent.eventBase.checkOverlap(eventData)) {
                return;
            }
            const addEvents: Record<string, any>[] = (eventData instanceof Array) ? eventData : [eventData];
            if (addEvents.length === 0) {
                return;
            }
            const args: ActionEventArgs = {
                requestType: 'eventCreate', cancel: false, data: addEvents,
                addedRecords: addEvents, changedRecords: [], deletedRecords: []
            };
            this.parent.trigger(events.actionBegin, args, (addArgs: ActionEventArgs) => {
                if (!addArgs.cancel) {
                    if (addArgs.promise) {
                        addArgs.promise.then((hasContinue: boolean) => {
                            if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
                            if (hasContinue) {
                                this.processAddEvent(addArgs);
                            }
                        }).catch((e: ReturnType) => {
                            if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
                            this.parent.trigger(events.actionFailure, { error: e });
                        });
                    } else {
                        this.processAddEvent(addArgs);
                    }
                }
            });
        }
    }

    public saveEvent(eventData: Record<string, any> | Record<string, any>[], action: CurrentAction): void {
        if (this.parent.eventSettings.allowEditing && !this.parent.activeViewOptions.readonly) {
            if (this.parent.currentAction !== 'EditFollowingEvents' && !this.isBlockEvent(eventData)
                && this.parent.eventBase.isBlockRange(eventData)) {
                this.parent.quickPopup.openValidationError('blockAlert', eventData);
                this.parent.crudModule.crudObj.isCrudAction = false;
                return;
            }
            const updateEvents: Record<string, any>[] = (eventData instanceof Array) ? eventData : [eventData];
            if (updateEvents.length === 0) {
                return;
            }
            this.parent.currentAction = action;
            if (action) {
                switch (action) {
                case 'Save':
                    this.processSave(eventData);
                    break;
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
                if (this.parent.eventBase.checkOverlap(eventData)) {
                    return;
                }
                const args: ActionEventArgs = {
                    requestType: 'eventChange', cancel: false, data: eventData,
                    addedRecords: [], changedRecords: updateEvents, deletedRecords: []
                };
                this.parent.trigger(events.actionBegin, args, (saveArgs: ActionEventArgs) => {
                    if (!saveArgs.cancel) {
                        if (saveArgs.promise) {
                            saveArgs.promise.then((hasContinue: boolean) => {
                                if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
                                if (hasContinue) {
                                    this.processSaveEvent(saveArgs);
                                }
                            }).catch((e: ReturnType) => {
                                if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
                                this.parent.trigger(events.actionFailure, { error: e });
                            });
                        } else {
                            this.processSaveEvent(saveArgs);
                        }
                    }
                });
            }
        }
    }

    public deleteEvent(eventData: string | number | Record<string, any> | Record<string, any>[], action: CurrentAction): void {
        if (this.parent.eventSettings.allowDeleting && !this.parent.activeViewOptions.readonly) {
            this.parent.currentAction = action;
            let deleteEvents: Record<string, any>[] = [];
            if (typeof eventData === 'string' || typeof eventData === 'number') {
                deleteEvents = this.parent.eventsData.filter((eventObj: Record<string, any>) =>
                    eventObj[this.parent.eventFields.id] === eventData) as Record<string, any>[];
            } else {
                deleteEvents = (eventData instanceof Array ? eventData : [eventData]) as Record<string, any>[];
            }
            if (deleteEvents.length === 0) {
                return;
            }
            if (action) {
                switch (action) {
                case 'Delete':
                    this.processDelete(deleteEvents);
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
                const args: ActionEventArgs = {
                    requestType: 'eventRemove', cancel: false, data: eventData as Record<string, any>,
                    addedRecords: [], changedRecords: [], deletedRecords: deleteEvents
                };
                this.parent.trigger(events.actionBegin, args, (deleteArgs: ActionEventArgs) => {
                    if (!deleteArgs.cancel) {
                        if (deleteArgs.promise) {
                            deleteArgs.promise.then((hasContinue: boolean) => {
                                if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
                                if (hasContinue) {
                                    this.processDeleteEvent(deleteArgs);
                                }
                            }).catch((e: ReturnType) => {
                                if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
                                this.parent.trigger(events.actionFailure, { error: e });
                            });
                        } else {
                            this.processDeleteEvent(deleteArgs);
                        }
                    }
                });
            }
        }
    }

    private processOccurrences(eventData: Record<string, any> | Record<string, any>[], action: CurrentAction): void {
        let occurrenceData: Record<string, any> | Record<string, any>[] = [];
        let isDeletedRecords: boolean = false;
        if (eventData instanceof Array) {
            for (const event of eventData) {
                occurrenceData.push({ occurrence: event, parent: this.getParentEvent(event) });
            }
        } else {
            occurrenceData = { occurrence: eventData, parent: this.getParentEvent(eventData) };
        }
        const updateEvents: Record<string, any>[] = (eventData instanceof Array) ? eventData : [eventData];
        const args: ActionEventArgs = {
            requestType: action === 'EditOccurrence' ? 'eventChange' : 'eventRemove',
            cancel: false,
            addedRecords: [], changedRecords: updateEvents, deletedRecords: []
        };
        args.data = occurrenceData;
        this.parent.trigger(events.actionBegin, args, (occurrenceArgs: ActionEventArgs) => {
            if (!occurrenceArgs.cancel) {
                const fields: EventFieldsMapping = this.parent.eventFields;
                const editParams: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                const occurrenceEvents: Record<string, any>[] = (occurrenceData instanceof Array ? occurrenceData : [occurrenceData]);
                for (let a: number = 0, count: number = occurrenceArgs.changedRecords.length; a < count; a++) {
                    const childEvent: Record<string, any> = occurrenceArgs.changedRecords[parseInt(a.toString(), 10)];
                    const parentEvent: Record<string, any> = occurrenceEvents[parseInt(a.toString(), 10)].parent as Record<string, any>;
                    const parentException: string = parentEvent[fields.recurrenceException] as string;
                    let editedData: Record<string, Date>;
                    let exceptionDate: string;
                    switch (action) {
                    case 'EditOccurrence':
                        editedData = this.parent.eventsProcessed.filter((event: Record<string, any>) => event.Guid === childEvent.Guid)[0] as Record<string, Date>;
                        exceptionDate = this.excludeDateCheck(editedData[fields.startTime], parentException);
                        if (exceptionDate !== parentEvent[fields.recurrenceException]) {
                            parentEvent[fields.recurrenceException] = exceptionDate;
                            childEvent[fields.recurrenceException] = getRecurrenceStringFromDate(editedData[fields.startTime] as Date);
                            childEvent[fields.recurrenceID] = parentEvent[fields.id];
                            childEvent[fields.followingID] = null;
                            editParams.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                            editParams.addedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                        } else {
                            editParams.changedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                        }
                        break;
                    case 'DeleteOccurrence':
                        if (!childEvent[fields.recurrenceException]) {
                            parentEvent[fields.recurrenceException] =
                                this.excludeDateCheck(<Date>childEvent[fields.startTime], parentException);
                            editParams.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                        }
                        if (childEvent[fields.id] !== parentEvent[fields.id]) {
                            editParams.deletedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                            isDeletedRecords = true;
                        }
                        break;
                    }
                }
                const promise: Promise<any> = this.parent.dataModule.dataManager.saveChanges(editParams, fields.id, this.getTable(), this.getQuery()) as Promise<any>;
                const cloneEvent: Record<string, any> = extend({}, occurrenceArgs.changedRecords[occurrenceArgs.changedRecords.length - 1], null, true) as Record<string, any>;
                this.parent.eventBase.selectWorkCellByTime(action === 'EditOccurrence' ? [this.parent.eventBase.processTimezone(cloneEvent)] : [cloneEvent]);
                const crudArgs: CrudArgs = {
                    requestType: action === 'EditOccurrence' ? 'eventChanged' : 'eventRemoved',
                    cancel: false, data: isDeletedRecords ? occurrenceArgs.deletedRecords : occurrenceArgs.changedRecords,
                    promise: promise, editParams: editParams
                };
                this.refreshData(crudArgs);
            }
        });
    }

    private processFollowSeries(eventData: Record<string, any> | Record<string, any>[], action: CurrentAction): void {
        let followData: Record<string, any> | Record<string, any>[] = [];
        if (eventData instanceof Array) {
            for (const event of eventData) {
                followData.push({ occurrence: event, parent: this.getParentEvent(event) });
            }
        } else {
            followData = { occurrence: eventData, parent: this.getParentEvent(eventData) };
        }
        const updateFollowEvents: Record<string, any>[] = (eventData instanceof Array) ? eventData : [eventData];
        const args: ActionEventArgs = {
            requestType: action === 'EditFollowingEvents' ? 'eventChange' : 'eventRemove', cancel: false,
            addedRecords: [], changedRecords: updateFollowEvents, deletedRecords: []
        };
        args.data = followData;
        this.parent.trigger(events.actionBegin, args, (followArgs: ActionEventArgs) => {
            if (!followArgs.cancel) {
                const fields: EventFieldsMapping = this.parent.eventFields;
                const editParams: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                const followEvents: Record<string, any>[] = followData instanceof Array ? followData : [followData];
                for (let a: number = 0, count: number = followArgs.changedRecords.length; a < count; a++) {
                    const childEvent: Record<string, any> = followArgs.changedRecords[parseInt(a.toString(), 10)];
                    const parentEvent: Record<string, any> = followEvents[parseInt(a.toString(), 10)].parent as Record<string, any>;
                    const followData: { [key: string]: Record<string, any>[] } = this.parent.eventBase.getEventCollections(parentEvent, childEvent) as { [key: string]: Record<string, any>[] };
                    let isSpanned: boolean;
                    switch (action) {
                    case 'EditFollowingEvents':
                        this.processRecurrenceRule(parentEvent, childEvent);
                        isSpanned = !this.parent.eventBase.isFollowingEvent(parentEvent, childEvent);
                        childEvent[fields.followingID] = isSpanned ? null : parentEvent[fields.id];
                        childEvent[fields.recurrenceID] = null;
                        editParams.addedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                        editParams.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                        if (!this.parent.uiStateValues.isIgnoreOccurrence) {
                            childEvent[fields.recurrenceException] = null;
                            if (followData.occurrence.length > 0) {
                                const rule: string = followData.occurrence.slice(-1)[0][fields.recurrenceRule] as string;
                                if (rule.indexOf('COUNT') === -1) {
                                    childEvent[fields.recurrenceRule] = rule;
                                }
                            }
                            if (followData.follow.length > 0) {
                                childEvent[fields.recurrenceRule] = followData.follow.slice(-1)[0][fields.recurrenceRule];
                                editParams.deletedRecords = editParams.deletedRecords.concat(followData.follow);
                            }
                            if (isSpanned) {
                                followData.occurrence = followData.occurrence.filter((eventObj: Record<string, any>) =>
                                    eventObj[fields.recurrenceID] === parentEvent[fields.id]);
                            }
                            editParams.deletedRecords = editParams.deletedRecords.concat(followData.occurrence);
                        }
                        break;
                    case 'DeleteFollowingEvents':
                        this.processRecurrenceRule(parentEvent, childEvent[fields.startTime] as Date);
                        editParams.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                        editParams.deletedRecords = editParams.deletedRecords.concat(followData.occurrence).concat(followData.follow);
                        break;
                    }
                }
                const promise: Promise<any> = this.parent.dataModule.dataManager.saveChanges(editParams, fields.id, this.getTable(), this.getQuery()) as Promise<any>;
                const cloneEvent: Record<string, any> = extend({}, followArgs.changedRecords[followArgs.changedRecords.length - 1], null, true) as Record<string, any>;
                this.parent.eventBase.selectWorkCellByTime(action === 'EditFollowingEvents' ? [this.parent.eventBase.processTimezone(cloneEvent)] : [cloneEvent]);
                const crudArgs: CrudArgs = {
                    requestType: action === 'EditFollowingEvents' ? 'eventChanged' : 'eventRemoved',
                    cancel: false, data: followArgs.changedRecords, promise: promise, editParams: editParams
                };
                this.refreshData(crudArgs);
            }
        });
    }

    private processEntireSeries(eventData: Record<string, any> | Record<string, any>[], action: CurrentAction): void {
        let seriesData: Record<string, any> | Record<string, any>[] = [];
        let isDeletedRecords: boolean = false;
        if (eventData instanceof Array) {
            for (const event of eventData) {
                seriesData.push(this.getParentEvent(event, true));
            }
        } else {
            seriesData = this.getParentEvent(eventData, true);
        }
        const updateSeriesEvents: Record<string, any>[] = (eventData instanceof Array) ? eventData : [eventData];
        const args: ActionEventArgs = {
            requestType: action === 'EditSeries' ? 'eventChange' : 'eventRemove', cancel: false,
            addedRecords: [], changedRecords: [], deletedRecords: []
        };
        args.data = seriesData;
        if (action === 'EditSeries') {
            args.changedRecords = updateSeriesEvents;
        } else {
            args.deletedRecords = updateSeriesEvents;
        }
        if (action === 'EditSeries' && !this.parent.uiStateValues.isIgnoreOccurrence) {
            const seriesEvents: Record<string, any>[] = seriesData instanceof Array ? seriesData : [seriesData];
            for (let a: number = 0, count: number = args.changedRecords.length; a < count; a++) {
                const parentEvent: Record<string, any> = seriesEvents[parseInt(a.toString(), 10)];
                const eventCollections: { [key: string]: Record<string, any>[] } = this.parent.eventBase.getEventCollections(parentEvent);
                const deletedEvents: Record<string, any>[] = eventCollections.follow.concat(eventCollections.occurrence);
                args.deletedRecords = args.deletedRecords.concat(deletedEvents);
            }
        }
        this.parent.trigger(events.actionBegin, args, (seriesArgs: ActionEventArgs) => {
            if (!seriesArgs.cancel) {
                const fields: EventFieldsMapping = this.parent.eventFields;
                const editParams: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                const seriesEvents: Record<string, any>[] = seriesData instanceof Array ? seriesData : [seriesData];
                const records: Record<string, any>[] = action === 'EditSeries' ? seriesArgs.changedRecords : seriesArgs.deletedRecords;
                for (let a: number = 0, count: number = records.length; a < count; a++) {
                    const childEvent: Record<string, any> = records[parseInt(a.toString(), 10)];
                    const parentEvent: Record<string, any> = seriesEvents[parseInt(a.toString(), 10)];
                    const eventCollections: { [key: string]: Record<string, any>[] } = this.parent.eventBase.getEventCollections(parentEvent);
                    const deletedEvents: Record<string, any>[] = eventCollections.follow.concat(eventCollections.occurrence);
                    switch (action) {
                    case 'EditSeries':
                        childEvent[fields.id] = parentEvent[fields.id];
                        childEvent[fields.recurrenceID] = null;
                        childEvent[fields.followingID] = null;
                        if (this.parent.uiStateValues.isIgnoreOccurrence && childEvent[fields.recurrenceException]) {
                            const originalParent: Record<string, any>[] = this.parent.eventsData.filter((eventObj: Record<string, any>) =>
                                eventObj[fields.id] === childEvent[fields.id]) as Record<string, any>[];
                            if (originalParent.length > 0) {
                                childEvent[fields.recurrenceRule] = originalParent[0][fields.recurrenceRule];
                            }
                        } else {
                            childEvent[fields.recurrenceException] = null;
                            editParams.deletedRecords = editParams.deletedRecords.concat(deletedEvents);
                        }
                        editParams.changedRecords.push(this.parent.eventBase.processTimezone(childEvent, true));
                        this.parent.uiStateValues.isIgnoreOccurrence = false;
                        break;
                    case 'DeleteSeries':
                        editParams.deletedRecords = editParams.deletedRecords.concat(deletedEvents.concat(
                            this.parent.eventBase.processTimezone(parentEvent, true)
                        ));
                        isDeletedRecords = true;
                        break;
                    }
                }
                const promise: Promise<any> = this.parent.dataModule.dataManager.saveChanges(editParams, fields.id, this.getTable(), this.getQuery()) as Promise<any>;
                const cloneEvent: Record<string, any> = extend({}, records[records.length - 1], null, true) as Record<string, any>;
                this.parent.eventBase.selectWorkCellByTime(action === 'EditSeries' ? [this.parent.eventBase.processTimezone(cloneEvent)] : [cloneEvent]);
                const crudArgs: CrudArgs = {
                    requestType: action === 'EditSeries' ? 'eventChanged' : 'eventRemoved',
                    cancel: false, data: isDeletedRecords ? seriesArgs.deletedRecords : seriesArgs.changedRecords,
                    promise: promise, editParams: editParams
                };
                this.refreshData(crudArgs);
            }
        });
    }

    private processDelete(eventData: Record<string, any>[]): void {
        const deleteData: Record<string, any>[] = [];
        for (const eventObj of eventData) {
            if (eventObj[this.parent.eventFields.recurrenceRule]) {
                deleteData.push({ occurrence: eventObj, parent: this.getParentEvent(eventObj) });
            } else {
                deleteData.push(eventObj);
            }
        }
        const args: ActionEventArgs = {
            requestType: 'eventRemove', cancel: false,
            addedRecords: [], changedRecords: [], deletedRecords: eventData
        };
        args.data = deleteData;
        this.parent.trigger(events.actionBegin, args, (deleteArgs: ActionEventArgs) => {
            if (!deleteArgs.cancel) {
                const fields: EventFieldsMapping = this.parent.eventFields;
                const editParams: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                const cloneEvents: Record<string, any>[] = extend([], deleteArgs.deletedRecords, null, true) as Record<string, any>[];
                for (let a: number = 0, count: number = deleteArgs.deletedRecords.length; a < count; a++) {
                    let isDelete: boolean = isNullOrUndefined(deleteArgs.deletedRecords[parseInt(a.toString(), 10)][this.parent.eventFields.recurrenceRule]);
                    if (!isDelete) {
                        const parentEvent: Record<string, any> = deleteData[parseInt(a.toString(), 10)].parent as Record<string, any>;
                        const isEdited: Record<string, any>[] = editParams.changedRecords.filter((obj: Record<string, any>) =>
                            obj[fields.id] === parentEvent[fields.id]) as Record<string, any>[];
                        const editedDate: Date = deleteArgs.deletedRecords[parseInt(a.toString(), 10)][fields.startTime] as Date;
                        if (isEdited.length > 0) {
                            const editedData: Record<string, any> = isEdited[0];
                            editedData[fields.recurrenceException] =
                                this.excludeDateCheck(editedDate, <string>editedData[fields.recurrenceException]);
                        } else {
                            parentEvent[fields.recurrenceException] =
                                this.excludeDateCheck(editedDate, <string>parentEvent[fields.recurrenceException]);
                        }
                        if (isEdited.length === 0) {
                            editParams.changedRecords.push(this.parent.eventBase.processTimezone(parentEvent, true));
                        }
                        isDelete = deleteArgs.deletedRecords[parseInt(a.toString(), 10)][fields.id] !== parentEvent[fields.id];
                    }
                    if (isDelete) {
                        if (deleteArgs.deletedRecords instanceof Array) {
                            for (const event of deleteArgs.deletedRecords) {
                                this.parent.eventBase.processTimezone(event, true);
                            }
                        }
                        editParams.deletedRecords.push(deleteArgs.deletedRecords[parseInt(a.toString(), 10)]);
                    }
                }
                const promise: Promise<any> = this.parent.dataModule.dataManager.saveChanges(editParams, fields.id, this.getTable(), this.getQuery()) as Promise<any>;
                this.parent.eventBase.selectWorkCellByTime(cloneEvents);
                const crudArgs: CrudArgs = {
                    requestType: 'eventRemoved', cancel: false, data: deleteArgs.deletedRecords, promise: promise, editParams: editParams
                };
                this.refreshData(crudArgs);
            }
        });
    }

    private processSave(data: Record<string, any> | Record<string, any>[]): void {
        const eventData: Record<string, any>[] = (data instanceof Array) ? data : [data];
        const editData: Record<string, any>[] = [];
        for (const eventObj of eventData) {
            if (eventObj[this.parent.eventFields.recurrenceRule]) {
                editData.push({ occurrence: eventObj, parent: this.getParentEvent(eventObj) });
            } else {
                editData.push(eventObj);
            }
        }
        const args: ActionEventArgs = { requestType: 'eventChange', cancel: false, addedRecords: [], changedRecords: eventData, deletedRecords: [] };
        args.data = editData;
        this.parent.trigger(events.actionBegin, args, (editArgs: ActionEventArgs) => {
            if (!editArgs.cancel) {
                const fields: EventFieldsMapping = this.parent.eventFields;
                const editParams: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
                for (const record of editArgs.changedRecords) {
                    if (!isNullOrUndefined(record[fields.recurrenceRule]) && isNullOrUndefined(record[fields.recurrenceException])) {
                        const exceptionString: string = getRecurrenceStringFromDate(record[fields.startTime]);
                        const parentEle: Record<string, any> = this.getParentEvent(record);
                        parentEle[fields.recurrenceException] = isNullOrUndefined(parentEle[fields.recurrenceException]) ?
                            exceptionString : parentEle[fields.recurrenceException].concat(',' + exceptionString);
                        record[fields.id] = this.parent.getEventMaxID();
                        record[fields.recurrenceException] = exceptionString;
                        editParams.addedRecords.push(this.parent.eventBase.processTimezone(record, true));
                        editParams.changedRecords.push(this.parent.eventBase.processTimezone(parentEle, true));
                    } else {
                        editParams.changedRecords.push(this.parent.eventBase.processTimezone(record, true));
                    }
                }
                const promise: Promise<any> = this.parent.dataModule.dataManager.saveChanges(editParams, fields.id, this.getTable(), this.getQuery()) as Promise<any>;
                const cloneEvent: Record<string, any> = extend({}, editArgs.changedRecords[editArgs.changedRecords.length - 1], null, true) as Record<string, any>;
                this.parent.eventBase.selectWorkCellByTime([this.parent.eventBase.processTimezone(cloneEvent)]);
                const crudArgs: CrudArgs = { requestType: 'eventChanged', cancel: false, data: editArgs.changedRecords, promise: promise, editParams: editParams };
                this.refreshData(crudArgs);
            }
        });
    }

    private getParentEvent(event: Record<string, any>, isParent: boolean = false): Record<string, any> {
        const parentEvent: Record<string, any> = this.parent.eventBase.getParentEvent(event, isParent) || event;
        if (parentEvent[this.parent.eventFields.startTimezone] || parentEvent[this.parent.eventFields.endTimezone]) {
            this.parent.eventBase.timezoneConvert(parentEvent);
        }
        return parentEvent;
    }

    private excludeDateCheck(eventStartTime: Date, exceptionDateList: string): string {
        const timezone: string = this.parent.timezone || this.parent.tzModule.getLocalTimezoneName();
        if (timezone) {
            eventStartTime = this.parent.tzModule.remove(new Date(+eventStartTime.getTime()), timezone);
        }
        const exDate: string = getRecurrenceStringFromDate(eventStartTime);
        if (!isNullOrUndefined(exceptionDateList)) {
            if (exceptionDateList.indexOf(exDate) === -1) {
                exceptionDateList = !(isNullOrUndefined(exceptionDateList)) ? exceptionDateList + ',' + exDate : exDate;
            }
        } else {
            exceptionDateList = exDate;
        }
        return exceptionDateList;
    }

    private processRecurrenceRule(parentEvent: Record<string, any>, followEvent?: Record<string, any> | Date): void {
        const fields: EventFieldsMapping = this.parent.eventFields;
        const recurrenceRule: string = parentEvent[fields.recurrenceRule] as string;
        let endDate: Date;
        if (followEvent instanceof Date) {
            endDate = new Date(+followEvent);
        } else {
            endDate = new Date(+followEvent[fields.startTime]);
            const newRecurrenceRule: string = followEvent[fields.recurrenceRule] as string;
            if (newRecurrenceRule) {
                const startDate: Date = parentEvent[fields.startTime] as Date;
                const ruleException: string = (this.parent.currentAction === 'DeleteFollowingEvents') ? followEvent[fields.recurrenceException] as string : null;
                const dateCollection: number[] = generate(startDate, newRecurrenceRule, ruleException, this.parent.activeViewOptions.firstDayOfWeek);
                const untilDate: Date = new Date(dateCollection.slice(-1)[0]);
                untilDate.setHours(endDate.getHours(), endDate.getMinutes(), endDate.getSeconds());
                endDate.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
                followEvent[fields.recurrenceRule] = this.getUpdatedRecurrenceRule(newRecurrenceRule, new Date(+untilDate), false);
            }
        }
        parentEvent[fields.recurrenceRule] = this.getUpdatedRecurrenceRule(recurrenceRule, util.addDays(new Date(endDate.getTime()), -1), true);
    }

    private getUpdatedRecurrenceRule(recurrenceRule: string, untilDate: Date, isParent: boolean): string {
        const splitRule: string[] = recurrenceRule.split(';');
        let updatedRule: string = '';
        for (let rule of splitRule) {
            if (rule !== '') {
                const ruleKey: string = rule.split('=')[0];
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

    private isBlockEvent(eventData: Record<string, any> | Record<string, any>[]): boolean {
        const eventCollection: Record<string, any>[] = (eventData instanceof Array) ? eventData : [eventData];
        let value: boolean = false;
        for (const event of eventCollection) {
            value = event[this.parent.eventFields.isBlock] as boolean || false;
        }
        return value;
    }

    /**
     * To destroy the crud module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.crudObj = null;
        this.parent = null;
    }

}
