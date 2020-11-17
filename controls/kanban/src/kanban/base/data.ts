import { extend } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Kanban } from './kanban';
import { ActionEventArgs, SaveChanges } from './interface';
import { ReturnType } from './type';
import * as events from './constant';
import * as cls from '../base/css-constant';

/**
 * Kanban data module
 * @hidden
 */
export class Data {
    private parent: Kanban;
    private kanbanData: DataManager;
    public dataManager: DataManager;
    private query: Query;
    private keyField: string;

    /**
     * Constructor for data module
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
        this.keyField = this.parent.cardSettings.headerField;
        this.initDataManager(parent.dataSource, parent.query);
        this.refreshDataManager();
    }

    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    private initDataManager(dataSource: Object | DataManager, query: Query): void {
        this.dataManager = dataSource instanceof DataManager ? <DataManager>dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
        this.kanbanData = new DataManager(this.parent.kanbanData);
    }

    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    public getQuery(): Query {
        return this.query.clone();
    }

    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    private getData(query: Query): Promise<Object> {
        return this.dataManager.executeQuery(query);
    }

    /**
     * The function used to get the table name from the given Query
     * @return {string}
     * @private
     */
    private getTable(): string {
        if (this.parent.query) {
            let query: Query = this.getQuery();
            return query.fromTable;
        } else {
            return null;
        }
    }

    /**
     * The function is used to send the request and get response from datamanager
     * @return {void}
     * @private
     */
    private refreshDataManager(): void {
        let dataManager: Promise<Object> = this.getData(this.getQuery());
        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e)).catch((e: ReturnType) => this.dataManagerFailure(e));
    }

    /**
     * The function is used to handle the success response from dataManager
     * @return {void}
     * @private
     */
    private dataManagerSuccess(e: ReturnType): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.dataBinding, e, (args: ReturnType) => {
            let resultData: Object[] = extend([], args.result, null, true) as Object[];
            this.kanbanData.saveChanges({ addedRecords: resultData, changedRecords: [], deletedRecords: [] });
            this.parent.kanbanData = resultData;
            this.parent.notify(events.dataReady, { processedData: resultData });
            this.parent.trigger(events.dataBound, null, () => this.parent.hideSpinner());
        });
    }

    /**
     * The function is used to handle the failure response from dataManager
     * @return {void}
     * @private
     */
    private dataManagerFailure(e: ReturnType): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.actionFailure, { error: e }, () => this.parent.hideSpinner());
    }

    /**
     * The function is used to perform the insert, update, delete and batch actions in datamanager
     * @return {void}
     * @private
     */
    public updateDataManager(updateType: string, params: SaveChanges, type: string, data: { [key: string]: Object }, index?: number): void {
        this.parent.showSpinner();
        let promise: Promise<Object>;
        let actionArgs: ActionEventArgs = {
            requestType: type, cancel: false, addedRecords: params.addedRecords,
            changedRecords: params.changedRecords, deletedRecords: params.deletedRecords
        };
        this.parent.trigger(events.actionComplete, actionArgs, (offlineArgs: ActionEventArgs) => {
            if (!offlineArgs.cancel) {
                switch (updateType) {
                    case 'insert':
                        promise = this.dataManager.insert(data, this.getTable(), this.getQuery()) as Promise<Object>;
                        break;
                    case 'update':
                        promise = this.dataManager.update(this.keyField, data, this.getTable(), this.getQuery()) as Promise<Object>;
                        break;
                    case 'delete':
                        promise = this.dataManager.remove(this.keyField, data, this.getTable(), this.getQuery()) as Promise<Object>;
                        break;
                    case 'batch':
                        promise = this.dataManager.saveChanges(params, this.keyField, this.getTable(), this.getQuery()) as Promise<Object>;
                        break;
                }

                if (this.dataManager.dataSource.offline) {
                    this.kanbanData = this.dataManager;
                    this.parent.kanbanData = this.dataManager.dataSource.json;
                    this.refreshUI(offlineArgs, index);
                } else {
                    promise.then((e: ReturnType) => {
                        if (this.parent.isDestroyed) { return; }
                        this.refreshUI(offlineArgs, index);
                    }).catch((e: ReturnType) => {
                        this.dataManagerFailure(e);
                    });
                }
            }
        });
    }

    /**
     * The function is used to refresh the UI once the datamanager action is completed
     * @return {void}
     * @private
     */
    private refreshUI(args: ActionEventArgs, index: number): void {
        let field: string;
        this.parent.layoutModule.columnData = this.parent.layoutModule.getColumnCards();
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.layoutModule.swimlaneData = this.parent.layoutModule.getSwimlaneCards();
        }
        args.addedRecords.forEach((data: { [key: string]: Object }) => {
            this.parent.layoutModule.renderCardBasedOnIndex(data);
        });
        args.changedRecords.forEach((data: { [key: string]: Object }) => {
            let card: HTMLCollection = [].slice.call(this.parent.element
                .querySelectorAll('.' + cls.CARD_CLASS + '[data-id="' + data[this.parent.cardSettings.headerField] + '"]'));
            let updateIndex: number = [].slice.call(card[0].parentElement.children).indexOf(card[0]);
            this.parent.layoutModule.removeCard(data);
            this.parent.layoutModule.renderCardBasedOnIndex(data, updateIndex);
            if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index'
                && this.parent.sortSettings.direction === 'Descending' && index > 0) {
                --index;
            }
        });
        args.deletedRecords.forEach((data: { [key: string]: Object }) => {
            this.parent.layoutModule.removeCard(data);
        });
        this.parent.layoutModule.refresh();
        this.parent.renderTemplates();
        this.parent.trigger(events.dataBound, null, () => this.parent.hideSpinner());
    }
}
