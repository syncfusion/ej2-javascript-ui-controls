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
     * @private
     */
    constructor(dataSource?: Object | DataManager, query? : Query) {
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
     * The function used to generate updated Query from chart model
     * @return {void}
     * @private
     */
    public generateQuery(): Query {
        let query: Query = this.query.clone();
        return query;
    }

    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    public getData(query: Query): Promise<Object> {
        if (this.dataManager.ready) {
            let deferred: Deferred = new Deferred();
            let ready: Promise<Object> = this.dataManager.ready;
            ready.then((e: Object) => {
                (<Promise<Object>>this.dataManager.executeQuery(query)).then((result: Object) => {
                    deferred.resolve(result);
                });
            }).catch((e: Object) => {
                deferred.reject(e);
            });
            return deferred.promise;
        } else {
            return this.dataManager.executeQuery(query);
        }
    }

}