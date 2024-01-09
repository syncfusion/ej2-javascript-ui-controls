/* eslint-disable @typescript-eslint/no-explicit-any */
import { extend, isNullOrUndefined, formatUnit, Ajax } from '@syncfusion/ej2-base';
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
    private initload: boolean = false;
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
     * @returns {boolean} returns whether its remote data
     * @hidden
     */
    public isRemote(): boolean {
        return this.dataManager.dataSource.offline !== true && this.dataManager.dataSource.url !== undefined &&
            this.dataManager.dataSource.url !== '';
    }

    /**
     * @returns {boolean} returns the column key fields
     * @hidden
     */
    private columnKeyFields(): string[] {
        const columns: string[] = [];
        for (const column of this.parent.columns) {
            if (column.keyField.toString().split(',').length > 1) {
                for (const innerColumns of column.keyField.toString().split(',')) {
                    columns.push(innerColumns.trim());
                }
            } else {
                columns.push(column.keyField.toString());
            }
        }
        return columns;
    }

    /**
     * The function used to generate updated Query from schedule model
     *
     * @param {string} parameter Accepts the parameter that needs to be sent to the service end.
     * @returns {void}
     * @private
     */
    public getQuery(parameter?: string): Query {
        const query: Query = this.query.clone();
        if (this.isRemote() && this.parent.enableVirtualization) {
            const cardHeight: number = this.parent.cardHeight === 'auto' ? 100 :
                parseInt(formatUnit(this.parent.cardHeight).split('px')[0], 10);
            const take: number = this.parent.height === 'auto' ? (Math.ceil(window.innerHeight / cardHeight) * 2) :
                (Math.ceil(parseInt(formatUnit(this.parent.height).split('px')[0], 10) / cardHeight) * 2);
            const columns: string[] = this.columnKeyFields();
            for (let i: number = 0; i < columns.length; i++) {
                query.where(this.parent.keyField, 'equal', columns[i as number]);
            }
            query.take(take);
            if (isNullOrUndefined(parameter)) {
                parameter = 'KanbanVirtualization';
            }
            query.addParams('KanbanVirtualization', parameter);
        }
        return query;
    }

    /**
     * The function used to get dataSource by executing given Query
     *
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @returns {void}
     * @private
     */
    private getData(query?: Query): Promise<Ajax> | Promise<Object> {
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
                        const cardObj: Record<string, any> = this.parent.kanbanData.filter((data: Record<string, any>) =>
                            data[this.parent.cardSettings.headerField] ===
                             changedRecord[this.parent.cardSettings.headerField])[0] as Record<string, any>;
                        extend(cardObj, changedRecord);
                    });
                    editArgs.deletedRecords.forEach((deletedRecord: Record<string, any>) => {
                        const index: number = this.parent.kanbanData.findIndex((data: Record<string, any>) =>
                            data[this.parent.cardSettings.headerField] === deletedRecord[this.parent.cardSettings.headerField]);
                        this.parent.kanbanData.splice(index, 1);
                    });
                }).catch(() => { this.parent.hideSpinner(); void 0; });
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
        const dataManager: Promise<Object> = this.getData(this.getQuery());
        dataManager.then((e: ReturnType) =>
            this.dataManagerSuccess(e)
        ).catch((e: ReturnType) => this.dataManagerFailure(e));
    }

    /**
     * The function is used to handle the success response from dataManager
     *
     * @param {ReturnType} e Accepts the dataManager success result
     * @param type
     * @returns {void}
     * @private
     */

    // eslint-disable-next-line
    private dataManagerSuccess(e: ReturnType, type?: string, offlineArgs?: ActionEventArgs, index?: number): void {
        if (this.parent.isDestroyed) { return; }
        if (type) {
            this.updateKanbanData(e);
            if (this.parent.enableVirtualization && this.isRemote()) {
                this.parent.virtualLayoutModule.refresh();
            }
        }
        else{
            this.parent.trigger(events.dataBinding, e, (args: ReturnType) => {
                this.updateKanbanData(args);
                this.parent.notify(events.dataReady, { processedData: this.parent.kanbanData });
                this.parent.trigger(events.dataBound, null, () => this.parent.hideSpinner());
            });
        }
        if (this.initload) {
            this.parent.resetTemplates();
            this.parent.layoutModule.refreshHeaders();
            this.parent.renderTemplates();
        }
        this.initload = true;
    }

    /**
     * The function is used to handle the update the column data count for remote, and update kanbanData while perform the CRUD action
     *
     * @param {ReturnType} args Accepts the dataManager success result
     * @returns {void}
     * @private
     */

    private updateKanbanData(args: ReturnType): void {
        const resultData: Record<string, any>[] = extend([], !isNullOrUndefined((args.result as any).result) ?
            (args.result as any).result : args.result, null, true) as Record<string, any>[];
        if (this.isRemote() && this.parent.enableVirtualization && resultData.length > 0
            && !isNullOrUndefined((args.result as any).count)) {
            const columnsKeyFields: string[] = this.columnKeyFields();
            for (let i: number = 0; i < columnsKeyFields.length; i++) {
                if ((args.result as any).count[i as number].Key === columnsKeyFields[i as number]) {
                    this.parent.columnDataCount[columnsKeyFields[i as number]] = (args.result as any).count[i as number].Value;
                }
            }
        }
        this.parent.kanbanData = resultData;
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
     * @param {boolean} isDropped Accepts the boolean value based on based if it is dragged and dropped
     * @param {string} dataDropIndexKeyFieldValue Accepts the dropped index key field value card
     * @param {number} draggedKey Accepts the dragged keyfield of the column
     * @param {number} droppedKey Accepts the dropped keyfield of the column
     * @param {number} isMultipleDrag Accepts boolean value based on the multiple drag of the cards
     * @returns {void}
     * @private
     */
    public updateDataManager(
        updateType: string, params: SaveChanges, type: string,
        data: Record<string, any>, index?: number, isDropped?: boolean, dataDropIndexKeyFieldValue?: string,
        draggedKey?: string, droppedKey?: string, isMultipleDrag?: boolean): void {
        this.parent.showSpinner();
        let promise: Promise<Object> | Object;
        const actionArgs: ActionEventArgs = {
            requestType: type, cancel: false, addedRecords: params.addedRecords,
            changedRecords: params.changedRecords, deletedRecords: params.deletedRecords
        };
        this.setState({ isDataChanged: true });
        this.eventPromise(actionArgs, this.query, index);
        this.parent.trigger(events.actionComplete, actionArgs, (offlineArgs: ActionEventArgs) => {
            if (!offlineArgs.cancel) {
                switch (updateType) {
                case 'insert':
                    promise = this.dataManager.insert(data, this.getTable(), this.getQuery());
                    break;
                case 'update':
                    if (this.parent.enableVirtualization && !this.parent.dataModule.isRemote() && isDropped) {
                        promise = this.dataManager.remove(this.keyField, data, this.getTable(), this.getQuery());
                        promise = this.dataManager.insert(
                            data, this.getTable(), this.getQuery(),
                            this.dataManager.dataSource.json.findIndex((data: Record<string, any>) =>
                                data[this.parent.cardSettings.headerField] === dataDropIndexKeyFieldValue));
                    } else {
                        promise = this.dataManager.update(this.keyField, data, this.getTable(), this.getQuery());
                    }
                    break;
                case 'delete':
                    promise = this.dataManager.remove(this.keyField, data, this.getTable(), this.getQuery());
                    break;
                case 'batch':
                    if (!this.parent.dataModule.isRemote() && isDropped && this.parent.enableVirtualization && data ) {
                        for (let i: number = 0; i < data.length; i++) {
                            promise = this.dataManager.remove(
                                this.keyField, data[i as number], this.getTable(), this.getQuery()
                            ) as Promise<any>;
                        }
                        let currentIndex: number = this.dataManager.dataSource.json.findIndex((data: Record<string, any>) =>
                            data[this.parent.cardSettings.headerField] === dataDropIndexKeyFieldValue);
                        for (let i: number = 0; i < data.length; i++, currentIndex++) {
                            promise = this.dataManager.insert(
                                data[i as number], this.getTable(), this.getQuery(), currentIndex);
                        }
                    } else {
                        promise = this.dataManager.saveChanges(params, this.keyField, this.getTable(), this.getQuery());
                    }
                    break;
                }
                if (this.dataManager.dataSource.offline) {
                    if (!this.isObservable) {
                        this.kanbanData = this.dataManager;
                        this.parent.kanbanData = this.dataManager.dataSource.json as Record<string, any>[];
                        index = draggedKey === droppedKey && isMultipleDrag ? index - 1 : index;
                        this.refreshUI(offlineArgs, index, isDropped);
                        if (this.parent.enableVirtualization) {
                            this.parent.virtualLayoutModule.refreshColumnData(
                                draggedKey, droppedKey, offlineArgs.requestType, data[this.parent.keyField]
                            );
                        }
                    }
                } else {
                    (promise as Promise<Ajax>).then((args: Ajax) => {
                        if (this.parent.isDestroyed) { return; }
                        const dataManager: Promise<Object> = this.getData(this.getQuery());
                        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e, 'DataSourceChange', offlineArgs, index)).catch((e: ReturnType) => this.dataManagerFailure(e));
                        if (offlineArgs.requestType === 'cardCreated') {
                            if (!Array.isArray(args)) {
                                offlineArgs.addedRecords[0] = extend(offlineArgs.addedRecords[0], args);
                            } else {
                                this.modifyArrayData(offlineArgs.addedRecords, args);
                            }
                        } else if (offlineArgs.requestType === 'cardChanged') {
                            if (!Array.isArray(args)) {
                                offlineArgs.changedRecords[0] = extend(offlineArgs.changedRecords[0], args);
                            } else {
                                this.modifyArrayData(offlineArgs.changedRecords, args);
                            }
                        } else if (offlineArgs.requestType === 'cardRemoved') {
                            if (!Array.isArray(args)) {
                                offlineArgs.deletedRecords[0] = extend(offlineArgs.deletedRecords[0], args);
                            } else {
                                this.modifyArrayData(offlineArgs.deletedRecords, args);
                            }
                        }
                        index = draggedKey === droppedKey && isMultipleDrag ? index - 1 : index;
                        this.refreshUI(offlineArgs, index, isDropped);
                        if (this.parent.enableVirtualization) {
                            this.parent.virtualLayoutModule.refreshColumnData(
                                draggedKey, droppedKey, offlineArgs.requestType, data[this.parent.keyField]
                            );
                        }
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
                onLineData[i as number] = extend(onLineData[i as number], e[i as number]);
            }
        }
        return onLineData;
    }


    /**
     * The function is used to refresh the UI once the data manager action is completed
     *
     * @param {ActionEventArgs} args Accepts the ActionEventArgs to refresh UI.
     * @param {number} position Accepts the index to refresh UI.
     * @param {boolean} isDropped Accepts the boolean value based on based if it is dragged and dropped
     * @returns {void}
     */
    public refreshUI(args: ActionEventArgs, position: number, isDropped?: boolean): void {
        if (this.parent.enableVirtualization) {
            this.parent.virtualLayoutModule.columnData = this.parent.virtualLayoutModule.getColumnCards();
            args.addedRecords.forEach((data: Record<string, any>, index: number) => {
                this.parent.virtualLayoutModule.renderCardBasedOnIndex(data, position + index, isDropped, args.requestType);
            });
            args.changedRecords.forEach((data: Record<string, any>) => {
                this.parent.virtualLayoutModule.removeCard(data);
                this.parent.virtualLayoutModule.renderCardBasedOnIndex(data, position, isDropped, args.requestType);
                if (this.parent.virtualLayoutModule.isSelectedCard) {
                    this.parent.actionModule.SingleCardSelection(data);
                }
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index'
                    && this.parent.sortSettings.direction === 'Descending' && position > 0) {
                    --position;
                } else {
                    position++;
                }
            });
            args.deletedRecords.forEach((data: Record<string, any>) => {
                this.parent.virtualLayoutModule.removeCard(data);
            });
            this.parent.virtualLayoutModule.refresh();
        } else {
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
                } else {
                    position++;
                }
            });
            args.deletedRecords.forEach((data: Record<string, any>) => {
                this.parent.layoutModule.removeCard(data);
            });
            this.parent.layoutModule.refresh();
        }
        this.parent.renderTemplates();
        this.parent.notify(events.contentReady, {});
        this.parent.trigger(events.dataBound, args, () => this.parent.hideSpinner());
    }
}
