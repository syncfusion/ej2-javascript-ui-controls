/* eslint-disable @typescript-eslint/ban-types */
import { Query, DataManager, Deferred } from '@syncfusion/ej2-data';

/**
 * data module is used to generate query and dataSource
 */
export class Data {
    //Internal variables
    private dataManager: DataManager;
    private query: Query;

    /**
     * Constructor for data module
     *
     * @param dataSource
     * @param query
     * @param dataSource
     * @param query
     * @private
     */

    constructor(dataSource?: Object | DataManager, query?: Query) {
        this.initDataManager(dataSource, query);
    }

    /**
     * The function used to initialize dataManager and query
     *
     * @param dataSource
     * @param query
     * @param dataSource
     * @param query
     * @returns {void}
     * @private
     */

    public initDataManager(dataSource: Object | DataManager, query: Query): void {
        this.dataManager = dataSource instanceof DataManager ? <DataManager>dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    }

    /**
     * The function used to generate updated Query from chart model
     *
     * @returns {void}
     * @private
     */

    public generateQuery(): Query {
        const query: Query = this.query.clone();
        return query;
    }

    /**
     * The function used to get dataSource by executing given Query
     *
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @returns {void}
     * @private
     */

    public getData(dataQuery: Query): Promise<Object> {
        if (this.dataManager.ready) {
            const dataManagerDeferred: Deferred = new Deferred();
            const ready: Promise<Object> = this.dataManager.ready;
            ready.then(() => {
                (<Promise<Object>>this.dataManager.executeQuery(dataQuery)).then((result: Object) => {
                    dataManagerDeferred.resolve(result);
                });
            }).catch((e: Object) => { dataManagerDeferred.reject(e); });
            return dataManagerDeferred.promise;
        } else {
            return this.dataManager.executeQuery(dataQuery);
        }
    }

}
