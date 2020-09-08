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
                this.parent.showSpinner();
                let promise: Promise<Object> = null;
                let modifiedData: { [key: string]: Object }[] = [];
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    if (!this.parent.isBlazorRender()) {
                        modifiedData = this.priorityOrder(modifiedData, addArgs);
                    }
                }
                let addedRecords: { [key: string]: Object }[] = (cardData instanceof Array) ? cardData : [cardData];
                let changedRecords: { [key: string]: Object }[] =
                    (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') ? modifiedData : [];
                let editParms: SaveChanges = { addedRecords: addedRecords, changedRecords: changedRecords, deletedRecords: [] };
                if (cardData instanceof Array || modifiedData.length > 0) {
                    if (!this.parent.isBlazorRender()) {
                        promise = this.parent.dataModule.dataManager.saveChanges(
                            editParms, this.keyField, this.getTable(), this.getQuery()) as Promise<Object>;
                    } else {
                        // tslint:disable-next-line
                        (this.parent as any).interopAdaptor.invokeMethodAsync('AddCards', { AddedRecords: addedRecords, ChangedRecords: changedRecords }, this.keyField);
                    }
                } else {
                    if (!this.parent.isBlazorRender()) {
                        promise = this.parent.dataModule.dataManager.insert(cardData, this.getTable(), this.getQuery()) as Promise<Object>;
                    } else {
                        // tslint:disable-next-line
                        (this.parent as any).interopAdaptor.invokeMethodAsync('AddCard', { Record: cardData });
                    }
                }
                if (!this.parent.isBlazorRender()) {
                    let crudArgs: CrudArgs = {
                        requestType: 'cardCreated', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    this.refreshData(crudArgs);
                }
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
                this.parent.showSpinner();
                let promise: Promise<Object> = null;
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                    let modifiedData: { [key: string]: Object }[] = [];
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    if (!this.parent.isBlazorRender()) {
                        cardData = this.priorityOrder(modifiedData, updateArgs);
                    }
                }
                let editParms: SaveChanges = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    if (!this.parent.isBlazorRender()) {
                        promise = this.parent.dataModule.dataManager.saveChanges(
                            editParms, this.keyField, this.getTable(), this.getQuery()) as Promise<Object>;
                    } else {
                        // tslint:disable-next-line
                        (this.parent as any).interopAdaptor.invokeMethodAsync('UpdateCards', { ChangedRecords: cardData }, this.keyField);
                    }
                } else {
                    if (!this.parent.isBlazorRender()) {
                        promise = this.parent.dataModule.dataManager.update(
                            this.keyField, cardData, this.getTable(), this.getQuery()) as Promise<Object>;
                    } else {
                        // tslint:disable-next-line
                        (this.parent as any).interopAdaptor.invokeMethodAsync('UpdateCard', this.keyField, { Record: cardData });
                    }
                }
                if (!this.parent.isBlazorRender()) {
                    let crudArgs: CrudArgs = {
                        requestType: 'cardChanged', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    this.refreshData(crudArgs);
                }
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
                this.parent.showSpinner();
                let promise: Promise<Object> = null;
                if (!this.parent.isBlazorRender()) {
                    if (editParms.deletedRecords.length > 1) {
                            promise = this.parent.dataModule.dataManager.saveChanges(
                                editParms, this.keyField, this.getTable(), this.getQuery()) as Promise<Object>;
                    } else {
                            promise = this.parent.dataModule.dataManager.remove(
                                this.keyField, editParms.deletedRecords[0], this.getTable(), this.getQuery()) as Promise<Object>;
                    }
                    let crudArgs: CrudArgs = {
                        requestType: 'cardRemoved', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    this.refreshData(crudArgs);
                } else {
                    if (cardData instanceof Array) {
                        // tslint:disable-next-line
                        (this.parent as any).interopAdaptor.invokeMethodAsync('DeleteCards', { DeletedRecords: cardData }, this.keyField);
                    } else {
                        // tslint:disable-next-line
                        (this.parent as any).interopAdaptor.invokeMethodAsync('DeleteCard', this.keyField, { Record: cardData });
                    }
                }
            }
        });
    }

    private priorityOrder(cardData: { [key: string]: Object }[], args?: ActionEventArgs): { [key: string]: Object }[] {
        let cardsId: string[] | number[] = cardData.map((obj: { [key: string]: string }) => obj[this.parent.cardSettings.headerField]);
        let allModifiedKeys: string[] = cardData.map((obj: { [key: string]: string }) => obj[this.parent.keyField]);
        let modifiedKey: string[] = allModifiedKeys.filter((key: string, index: number) => allModifiedKeys.indexOf(key) === index).sort();
        let columnAllDatas: { [key: string]: Object }[];
        let finalData: { [key: string]: Object }[] = [];
        for (let columnKey of modifiedKey) {
            let keyData: { [key: string]: Object }[] =
                cardData.filter((cardObj: { [key: string]: Object }) => cardObj[this.parent.keyField] === columnKey);
            columnAllDatas = this.parent.getColumnData(columnKey) as { [key: string]: Object }[];
            if (this.parent.sortSettings.direction === 'Descending') {
                columnAllDatas = this.removeData(columnAllDatas, keyData);
            }
            let customOrder: number = 1;
            let initialOrder: number;
            for (let data of keyData as { [key: string]: Object }[]) {
                let order: number;
                if (data[this.parent.sortSettings.field]) {
                    order = data[this.parent.sortSettings.field] as number;
                } else if (args.requestType !== 'cardChange') {
                    if (customOrder === 1) {
                        initialOrder = columnAllDatas.slice(-1)[0][this.parent.sortSettings.field] as number;
                    }
                    order = data[this.parent.sortSettings.field] = (customOrder > 1 ? initialOrder :
                        columnAllDatas.slice(-1)[0][this.parent.sortSettings.field] as number) + customOrder;
                    customOrder++;
                }
                if (this.parent.swimlaneSettings.keyField) {
                    let swimlaneDatas: Object[] = this.parent.getSwimlaneData(data[this.parent.swimlaneSettings.keyField] as string);
                    columnAllDatas = this.parent.getColumnData(columnKey, swimlaneDatas) as { [key: string]: Object }[];
                    if (this.parent.sortSettings.direction === 'Descending') {
                        columnAllDatas = this.removeData(columnAllDatas, keyData);
                    }
                }
                let count: number[] = [];
                for (let j: number = 0; j < columnAllDatas.length; j++) {
                    if (columnAllDatas[j][this.parent.sortSettings.field] === order) {
                        count.push(j + 1);
                        break;
                    }
                }
                if (args.requestType === 'cardChange') {
                    finalData.push(data);
                }
                let finalCardsId: string[] = finalData.map((obj: { [key: string]: string }) => obj[this.parent.cardSettings.headerField]);
                if (this.parent.sortSettings.direction === 'Ascending') {
                    for (let i: number = count[0]; i <= columnAllDatas.length; i++) {
                        let dataObj: { [key: string]: Object } = columnAllDatas[i - 1];
                        let index: number = cardsId.indexOf(dataObj[this.parent.cardSettings.headerField] as string);
                        if (index === -1 && order >= dataObj[this.parent.sortSettings.field]) {
                            dataObj[this.parent.sortSettings.field] = ++order;
                            let isData: number = finalCardsId.indexOf(dataObj[this.parent.cardSettings.headerField] as string);
                            (isData === -1) ? finalData.push(dataObj) : finalData[isData] = dataObj;
                        }
                    }
                } else {
                    for (let i: number = count[0]; i > 0; i--) {
                        let dataObj: { [key: string]: Object } = columnAllDatas[i - 1];
                        dataObj[this.parent.sortSettings.field] = ++order;
                        finalData.push(dataObj);
                    }
                }
            }
        }
        return finalData;
    }
    private removeData(columnAllDatas: { [key: string]: Object }[], keyData: { [key: string]: Object }[]): { [key: string]: Object }[] {
        keyData.map((cardObj: { [key: string]: Object }) => {
            if (columnAllDatas.indexOf(cardObj) !== -1) {
                columnAllDatas.splice(columnAllDatas.indexOf(cardObj), 1);
            }
        });
        return columnAllDatas;
    }
}
