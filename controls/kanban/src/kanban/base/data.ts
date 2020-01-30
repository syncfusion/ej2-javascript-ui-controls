import { extend } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Kanban } from '../base/kanban';
import { ReturnType } from './type';
import * as events from '../base/constant';

/**
 * data module is used to generate query and data source.
 * @hidden
 */
export class Data {
    private parent: Kanban;
    public dataManager: DataManager;
    private query: Query;

    /**
     * Constructor for data module
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
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
    }

    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    public generateQuery(): Query {
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
     * The function is used to send the request and get response form datamanager
     * @return {void}
     * @private
     */
    public refreshDataManager(): void {
        let dataManager: Promise<Object> = this.getData(this.generateQuery());
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
    private dataManagerFailure(e: { result: Object[] }): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.actionFailure, { error: e }, () => this.parent.hideSpinner());
    }

}
