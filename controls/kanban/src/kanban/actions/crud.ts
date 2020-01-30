import { Query } from '@syncfusion/ej2-data';
import { Kanban } from '../base/kanban';
import { ActionEventArgs, CrudArgs, SaveChanges } from '../base/interface';
import { ReturnType } from '../base/type';
import * as events from '../base/constant';

/**
 * Kanban CRUD operations
 */

export class Crud {
    private parent: Kanban;
    private keyField: string;

    constructor(parent: Kanban) {
        this.parent = parent;
        this.keyField = this.parent.cardSettings.headerField;
    }

    private getQuery(): Query {
        return this.parent.dataModule.generateQuery();
    }

    private getTable(): string {
        if (this.parent.query) {
            let query: Query = this.parent.query.clone();
            return query.fromTable;
        }
        return null;
    }

    private refreshData(args: CrudArgs): void {
        let actionArgs: ActionEventArgs = {
            requestType: args.requestType, cancel: false, addedRecords: args.addedRecords,
            changedRecords: args.changedRecords, deletedRecords: args.deletedRecords
        };
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(events.actionComplete, actionArgs, (offlineArgs: ActionEventArgs) => {
                if (!offlineArgs.cancel) {
                    this.parent.dataModule.refreshDataManager();
                }
            });
        } else {
            args.promise.then((e: ReturnType) => {
                if (this.parent.isDestroyed) { return; }
                this.parent.trigger(events.actionComplete, actionArgs, (onlineArgs: ActionEventArgs) => {
                    if (!onlineArgs.cancel) {
                        this.parent.dataModule.refreshDataManager();
                    }
                });
            }).catch((e: ReturnType) => {
                if (this.parent.isDestroyed) { return; }
                this.parent.trigger(events.actionFailure, { error: e });
            });
        }
    }


    public addCard(cardData: { [key: string]: Object } | { [key: string]: Object }[]): void {
        let args: ActionEventArgs = {
            cancel: false, requestType: 'cardCreate', addedRecords: (cardData instanceof Array) ? cardData : [cardData],
            changedRecords: [], deletedRecords: []
        };
        this.parent.trigger(events.actionBegin, args, (addArgs: ActionEventArgs) => {
            if (!addArgs.cancel) {
                let promise: Promise<Object> = null;
                let editParms: SaveChanges = {
                    addedRecords: (cardData instanceof Array) ? cardData : [cardData], changedRecords: [], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    promise = this.parent.dataModule.dataManager.saveChanges(editParms, this.keyField, this.getTable(), this.getQuery()) as
                        Promise<Object>;
                } else {
                    promise = this.parent.dataModule.dataManager.insert(cardData, this.getTable(), this.getQuery()) as Promise<Object>;
                }
                let crudArgs: CrudArgs = {
                    requestType: 'cardCreated', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                this.refreshData(crudArgs);
            }
        });
    }

    public updateCard(cardData: { [key: string]: Object } | { [key: string]: Object }[]): void {
        let args: ActionEventArgs = {
            requestType: 'cardChange', cancel: false, addedRecords: [],
            changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
        };
        this.parent.trigger(events.actionBegin, args, (updateArgs: ActionEventArgs) => {
            if (!updateArgs.cancel) {
                let promise: Promise<Object> = null;
                let editParms: SaveChanges = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    promise = this.parent.dataModule.dataManager.saveChanges(editParms, this.keyField, this.getTable(), this.getQuery()) as
                        Promise<Object>;
                } else {
                    promise = this.parent.dataModule.dataManager.update(this.keyField, cardData, this.getTable(), this.getQuery()) as
                        Promise<Object>;
                }
                let crudArgs: CrudArgs = {
                    requestType: 'cardChanged', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                this.refreshData(crudArgs);
            }
        });
    }

    public deleteCard(cardData: string | number | { [key: string]: Object } | { [key: string]: Object }[]): void {
        let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (typeof cardData === 'string' || typeof cardData === 'number') {
            editParms.deletedRecords = this.parent.kanbanData.filter((data: { [key: string]: Object }) =>
                data[this.keyField] === cardData) as { [key: string]: Object }[];
        } else {
            editParms.deletedRecords = (cardData instanceof Array) ? cardData : [cardData] as { [key: string]: Object }[];
        }
        let args: ActionEventArgs = {
            requestType: 'cardRemove', cancel: false, addedRecords: [],
            changedRecords: [], deletedRecords: editParms.deletedRecords
        };
        this.parent.trigger(events.actionBegin, args, (deleteArgs: ActionEventArgs) => {
            if (!deleteArgs.cancel) {
                let promise: Promise<Object> = null;
                if (editParms.deletedRecords.length > 1) {
                    promise = this.parent.dataModule.dataManager.saveChanges(editParms, this.keyField, this.getTable(), this.getQuery()) as
                        Promise<Object>;
                } else {
                    promise = this.parent.dataModule.dataManager.remove(this.keyField, cardData, this.getTable(), this.getQuery()) as
                        Promise<Object>;
                }
                let crudArgs: CrudArgs = {
                    requestType: 'cardRemoved', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                this.refreshData(crudArgs);
            }
        });
    }

}
