/* eslint-disable @typescript-eslint/no-explicit-any */
import { extend } from '@syncfusion/ej2-base';
import { DataManager, Query, Deferred, UrlAdaptor } from '@syncfusion/ej2-data';
import { Kanban } from './kanban';
import { ActionEventArgs, SaveChanges, DataStateChangeEventArgs, DataSourceChangedEventArgs, PendingState } from './interface';
import { ReturnType } from './type';
import * as events from './constant';

/**
 * Kanban data module
 */
export class Data {
    private parent: Kanban;
    private kanbanData: DataManager;
    public dataManager: DataManager;
    private query: Query;
    private keyField: string;
    private isObservable: boolean;
    protected dataState: PendingState = { isPending: false, resolver: null, isDataChanged: false };

    /**
     * Constructor for data module
     *
     * @param {Kanban} parent Accepts the instance of the Kanban
     */
    constructor(parent: Kanban) {
        this.parent = parent;
        this.keyField = this.parent.cardSettings.headerField;
        this.dataState = { isDataChanged: false };
        this.isObservable = false;
        this.initDataManager(parent.dataSource, parent.query);
        this.refreshDataManager();
    }

    /**
     * The function used to initialize dataManager` and query
     *
     * @param {Object[] | DataManager} dataSource Accepts the dataSource as collection of objects or Datamanager instance.
     * @param {Query} query Accepts the query to process the data from collections.
     * @returns {void}
     * @private
     */
    private initDataManager(dataSource: Record<string, any>[] | DataManager, query: Query): void {
        this.dataManager = dataSource instanceof DataManager ? <DataManager>dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
        this.kanbanData = new DataManager(this.parent.kanbanData);
    }

    /**
     * The function used to generate updated Query from schedule model
     *
     * @returns {void}
     * @private
     */
    public getQuery(): Query {
        return this.query.clone();
    }

    /**
     * The function used to get dataSource by executing given Query
     *
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @returns {void}
     * @private
     */
    private getData(query?: Query): Promise<any> {
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            const def: Deferred = this.eventPromise({ requestType: '' }, query);
            this.isObservable = true;
            return def.promise;
        }
        return this.dataManager.executeQuery(query);
    }

    public setState(state: PendingState): Object {
        return this.dataState = state;
    }

    private getStateEventArgument(query: Query): PendingState {
        const adaptr: UrlAdaptor = new UrlAdaptor();
        const dm: DataManager = new DataManager({ url: '', adaptor: new UrlAdaptor });
        const state: { data?: string, pvtData?: Object[] } = adaptr.processQuery(dm, query);
        const data: Object = JSON.parse(state.data);
        return extend(data, state.pvtData);
    }

    private eventPromise(args: ActionEventArgs, query?: Query, index?: number): Deferred {
        const dataArgs: DataSourceChangedEventArgs = args;
        const state: DataStateChangeEventArgs = <DataStateChangeEventArgs>this.getStateEventArgument(query);
        const def: Deferred = new Deferred();
        const deff: Deferred = new Deferred();
        if (args.requestType !== undefined && this.dataState.isDataChanged !== false) {
            state.action = <{}>args as ActionEventArgs;
            if (args.requestType === 'cardChanged' || args.requestType === 'cardRemoved' || args.requestType === 'cardCreated') {
                const editArgs: DataSourceChangedEventArgs = args;
                editArgs.promise = deff.promise;
                editArgs.state = state;
                editArgs.index = index;
                this.setState({ isPending: true, resolver: deff.resolve });
                dataArgs.endEdit = deff.resolve;
                dataArgs.cancelEdit = deff.reject;
                this.parent.trigger(events.dataSourceChanged, editArgs);
                deff.promise.then(() => {
                    this.setState({ isPending: true, resolver: def.resolve });
                    this.parent.trigger(events.dataStateChange, state);
                    editArgs.addedRecords.forEach((data: Record<string, any>) => {
                        this.parent.kanbanData.push(data);
                    });
                    editArgs.changedRecords.forEach((changedRecord: Record<string, any>) => {
                        let cardObj: Record<string, any> = this.parent.kanbanData.filter((data: Record<string, any>) =>
                        data[this.parent.cardSettings.headerField] === changedRecord[this.parent.cardSettings.headerField])[0] as Record<string, any>;
                        extend(cardObj, changedRecord);
                    });
                    editArgs.deletedRecords.forEach((deletedRecord: Record<string, any>) => {
                        const index: number = this.parent.kanbanData.findIndex((data: Record<string, any>) =>
                                data[this.parent.cardSettings.headerField] === deletedRecord[this.parent.cardSettings.headerField]);
                        this.parent.kanbanData.splice(index, 1);
                   });
                }).catch(() => { this.parent.hideSpinner(); void 0});
            } else {
                this.setState({ isPending: true, resolver: def.resolve });
                this.parent.trigger(events.dataStateChange, state);
            }
        } else {
            this.setState({});
            def.resolve(this.parent.dataSource);
        }
        return def;
    }

    /**
     * The function used to get the table name from the given Query
     *
     * @returns {string} Returns the table name.
     * @private
     */
    private getTable(): string {
        if (this.parent.query) {
            const query: Query = this.getQuery();
            return query.fromTable;
        } else {
            return null;
        }
    }

    /**
     * The function is used to send the request and get response from datamanager
     *
     * @returns {void}
     * @private
     */
    private refreshDataManager(): void {
        const dataManager: Promise<any> = this.getData(this.getQuery());
        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e)).catch((e: ReturnType) => this.dataManagerFailure(e));
    }

    /**
     * The function is used to handle the success response from dataManager
     *
     * @param {ReturnType} e Accepts the dataManager success result
     * @returns {void}
     * @private
     */
    private dataManagerSuccess(e: ReturnType, type?: string): void {
        if (this.parent.isDestroyed) { return; }
        if (type) {
            const resultData: Record<string, any>[] = extend([], e.result, null, true) as Record<string, any>[];
            this.parent.kanbanData = resultData;
        } else {
            this.parent.trigger(events.dataBinding, e, (args: ReturnType) => {
                const resultData: Record<string, any>[] = extend([], args.result, null, true) as Record<string, any>[];
                this.parent.kanbanData = resultData;
                this.parent.notify(events.dataReady, { processedData: resultData });
                this.parent.trigger(events.dataBound, null, () => this.parent.hideSpinner());
            });
        }
    }

    /**
     * The function is used to handle the failure response from dataManager
     *
     * @param {ReturnType} e Accepts the dataManager failure result
     * @returns {void}
     * @private
     */
    private dataManagerFailure(e: ReturnType): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.actionFailure, { error: e }, () => this.parent.hideSpinner());
    }

    /**
     * The function is used to perform the insert, update, delete and batch actions in datamanager
     *
     * @param {string} updateType Accepts the update type action
     * @param {SaveChanges} params Accepts the savechanges params
     * @param {string} type Accepts the requestType as string
     * @param {Object} data Accepts the data to perform crud action
     * @param {number} index Accepts the index to refresh the data into UI
     * @returns {void}
     * @private
     */
    public updateDataManager(updateType: string, params: SaveChanges, type: string, data: Record<string, any>, index?: number): void {
        this.parent.showSpinner();
        let promise: Promise<any>;
        const actionArgs: ActionEventArgs = {
            requestType: type, cancel: false, addedRecords: params.addedRecords,
            changedRecords: params.changedRecords, deletedRecords: params.deletedRecords
        };
        this.eventPromise(actionArgs, this.query, index);
        this.parent.trigger(events.actionComplete, actionArgs, (offlineArgs: ActionEventArgs) => {
            if (!offlineArgs.cancel) {
                switch (updateType) {
                case 'insert':
                    promise = this.dataManager.insert(data, this.getTable(), this.getQuery()) as Promise<any>;
                    break;
                case 'update':
                    promise = this.dataManager.update(this.keyField, data, this.getTable(), this.getQuery()) as Promise<any>;
                    break;
                case 'delete':
                    promise = this.dataManager.remove(this.keyField, data, this.getTable(), this.getQuery()) as Promise<any>;
                    break;
                case 'batch':
                    promise = this.dataManager.saveChanges(params, this.keyField, this.getTable(), this.getQuery()) as Promise<any>;
                    break;
                }
                if (this.dataManager.dataSource.offline) {
                    if (!this.isObservable) {
                        this.kanbanData = this.dataManager;
                        this.parent.kanbanData = this.dataManager.dataSource.json as Record<string, any>[];
                        this.refreshUI(offlineArgs, index);
                    }
                } else {
                    promise.then((e: ReturnType) => {
                        if (this.parent.isDestroyed) { return; }
                        const dataManager: Promise<any> = this.getData(this.getQuery());
                        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e, 'DataSourceChange')).catch((e: ReturnType) => this.dataManagerFailure(e));
                        if (offlineArgs.requestType === "cardCreated") {
                            if (!Array.isArray(e)) {
                                offlineArgs.addedRecords[0] = extend(offlineArgs.addedRecords[0], e);
                            } else {
                                this.modifyArrayData(offlineArgs.addedRecords, e);
                            }
                        } else if (offlineArgs.requestType === "cardChanged") {
                            if (!Array.isArray(e)) {
                                offlineArgs.changedRecords[0] = extend(offlineArgs.changedRecords[0], e);
                            } else {
                                this.modifyArrayData(offlineArgs.changedRecords, e);
                            }
                        } else if (offlineArgs.requestType === "cardRemoved") {
                            if (!Array.isArray(e)) {
                                offlineArgs.deletedRecords[0] = extend(offlineArgs.deletedRecords[0], e);
                            } else {
                                this.modifyArrayData(offlineArgs.deletedRecords, e);
                            }
                        }
                        this.refreshUI(offlineArgs, index);
                    }).catch((e: ReturnType) => {
                        this.dataManagerFailure(e);
                    });
                }
            }
        });
    }

    private modifyArrayData(onLineData: Record<string, any>[], e: Record<string, any>[]): Record<string, any>[] {
        if (onLineData.length === e.length) {
            for (let i: number = 0; i < e.length; i++) {
                onLineData[i] = extend(onLineData[i], e[i]);
            }
        }
        return onLineData;
    }


    /**
     * The function is used to refresh the UI once the data manager action is completed
     *
     * @param {ActionEventArgs} args Accepts the ActionEventArgs to refresh UI.
     * @param {number} position Accepts the index to refresh UI.
     * @returns {void}
     */
    public refreshUI(args: ActionEventArgs, position: number): void {
        this.parent.layoutModule.columnData = this.parent.layoutModule.getColumnCards();
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.layoutModule.kanbanRows = this.parent.layoutModule.getRows();
            this.parent.layoutModule.swimlaneData = this.parent.layoutModule.getSwimlaneCards();
        }
        args.addedRecords.forEach((data: Record<string, any>, index: number) => {
            if (this.parent.swimlaneSettings.keyField && !data[this.parent.swimlaneSettings.keyField]) {
                data[this.parent.swimlaneSettings.keyField] = '';
            }
            this.parent.layoutModule.renderCardBasedOnIndex(data, position + index);
        });
        args.changedRecords.forEach((data: Record<string, any>) => {
            if (this.parent.swimlaneSettings.keyField && !data[this.parent.swimlaneSettings.keyField]) {
                data[this.parent.swimlaneSettings.keyField] = '';
            }
            this.parent.layoutModule.removeCard(data);
            this.parent.layoutModule.renderCardBasedOnIndex(data, position);
            if (this.parent.layoutModule.isSelectedCard) {
                this.parent.actionModule.SingleCardSelection(data);
            }
            if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index'
                && this.parent.sortSettings.direction === 'Descending' && position > 0) {
                --position;
            }
        });
        args.deletedRecords.forEach((data: Record<string, any>) => {
            this.parent.layoutModule.removeCard(data);
        });
        this.parent.layoutModule.refresh();
        this.parent.renderTemplates();
        this.parent.notify(events.contentReady, {});
        this.parent.trigger(events.dataBound, args, () => this.parent.hideSpinner());
    }
}
