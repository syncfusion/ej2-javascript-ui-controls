/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, DataManager } from '@syncfusion/ej2-data';

/**
 * data module is used to generate query and data source.
 *
 * @private
 */
export class Data {

    public dataManager: DataManager;
    private query: Query;

    /**
     * Constructor for data module
     *
     * @param {Object | DataManager} dataSource Accepts the datasource as JSON objects or DataManager
     * @param {Query} query Accepts the query to process the data
     * @private
     */
    constructor(dataSource?: Record<string, any>[] | DataManager, query?: Query) {
        this.initDataManager(dataSource, query);
    }

    /**
     * The function used to initialize dataManager and query
     *
     * @param {Object | DataManager} dataSource Accepts the datasource as JSON objects or DataManager
     * @param {Query} query Accepts the query to process the data
     * @returns {void}
     * @private
     */
    public initDataManager(dataSource: Record<string, any>[] | DataManager, query: Query): void {
        this.dataManager = dataSource instanceof DataManager ? <DataManager>dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    }

    /**
     * The function used to generate updated Query from schedule model
     *
     * @param {Date} startDate Accepts the start date
     * @param {Date} endDate Accepts the end date
     * @returns {void}
     * @private
     */
    public generateQuery(startDate?: Date, endDate?: Date): Query {
        const query: Query = this.query.clone();
        if (startDate) { query.addParams('StartDate', startDate.toISOString()); }
        if (endDate) { query.addParams('EndDate', endDate.toISOString()); }
        return query;
    }

    /**
     * The function used to get dataSource by executing given Query
     *
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @returns {void}
     * @private
     */
    public getData(query: Query): Promise<any> {
        return this.dataManager.executeQuery(query);
    }

    /**
     * To destroy the crud module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.dataManager = null;
        this.query = null;
    }

}
