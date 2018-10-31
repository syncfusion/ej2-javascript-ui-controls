import { Query, DataManager } from '@syncfusion/ej2-data';

/**
 * data module is used to generate query and data source.
 * @hidden
 */
export class Data {

    //Internal variables
    public dataManager: DataManager;
    private query: Query;

    /**
     * Constructor for data module
     * @private
     */
    constructor(dataSource?: Object | DataManager, query?: Query) {
        this.initDataManager(dataSource, query);
    }

    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    public initDataManager(dataSource: Object | DataManager, query: Query): void {
        this.dataManager = dataSource instanceof DataManager ? <DataManager>dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    }

    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    public generateQuery(startDate?: Date, endDate?: Date): Query {
        let query: Query = this.query.clone();
        if (startDate) { query.addParams('StartDate', startDate.toISOString()); }
        if (endDate) { query.addParams('EndDate', endDate.toISOString()); }
        return query;
    }

    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    public getData(query: Query): Promise<Object> {
        return this.dataManager.executeQuery(query);
    }

}