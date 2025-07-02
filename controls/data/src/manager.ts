/* eslint-disable valid-jsdoc */
/* eslint-disable security/detect-object-injection */
import { Fetch } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataUtil, Aggregates, Group } from './util';
import { Predicate, Query, QueryOptions } from './query';
import { ODataAdaptor, JsonAdaptor, CacheAdaptor, RemoteSaveAdaptor, RemoteOptions, CustomDataAdaptor, DataResult, Requests } from './adaptors';
/**
 * DataManager is used to manage and manipulate relational data.
 */
export class DataManager {
    /** @hidden */
    public adaptor: AdaptorOptions;
    /** @hidden */
    public defaultQuery: Query;
    /** @hidden */
    public dataSource: DataOptions;
    /** @hidden */
    public dateParse: boolean = true;
    /** @hidden */
    public timeZoneHandling: boolean = true;
    /** @hidden */
    public ready: Promise<Response>;
    /** @hidden */
    public get moduleName(): string { return 'datamanager' };
    private isDataAvailable: boolean;
    private persistQuery: object = {};
    private isInitialLoad: boolean = false;
    private requests: Fetch[] = [];
    private fetchDeffered: Deferred;
    private fetchReqOption: Fetch;
    private guidId: string;
    private previousCacheQuery: string;
    private isEnableCache: boolean = false;
    private cacheQuery: string;
    /** @hidden */
    public currentViewData: ReturnOption;

    /**
     * Constructor for DataManager class
     *
     * @param {DataOptions|JSON[]} dataSource?
     * @param {Query} query?
     * @param {AdaptorOptions|string} adaptor?
     * @param dataSource
     * @param query
     * @param adaptor
     * @hidden
     */
    constructor(dataSource?: DataOptions | JSON[] | Object[], query?: Query, adaptor?: AdaptorOptions | string) {
        this.isInitialLoad = true;
        this.isEnableCache = false;
        if (!dataSource && !this.dataSource) {
            dataSource = [];
        }
        adaptor = adaptor || (dataSource as DataOptions).adaptor;
        if (dataSource && (dataSource as DataOptions).timeZoneHandling === false) {
            this.timeZoneHandling = (dataSource as DataOptions).timeZoneHandling;
        }
        let data: DataOptions;
        if (dataSource instanceof Array) {
            data = {
                json: dataSource,
                offline: true
            };
        } else if (typeof dataSource === 'object') {
            if (!dataSource.json) {
                dataSource.json = [];
            }
            if (!dataSource.enablePersistence) {
                dataSource.enablePersistence = false;
            }
            if (!dataSource.id) {
                dataSource.id = '';
            }
            if (!dataSource.ignoreOnPersist) {
                dataSource.ignoreOnPersist = [];
            }
            data = {
                url: dataSource.url,
                insertUrl: dataSource.insertUrl,
                removeUrl: dataSource.removeUrl,
                updateUrl: dataSource.updateUrl,
                crudUrl: dataSource.crudUrl,
                batchUrl: dataSource.batchUrl,
                json: dataSource.json,
                headers: dataSource.headers,
                accept: dataSource.accept,
                data: dataSource.data,
                enableCache: dataSource.enableCache,
                timeTillExpiration: dataSource.timeTillExpiration,
                cachingPageSize: dataSource.cachingPageSize,
                enableCaching: dataSource.enableCaching,
                requestType: dataSource.requestType,
                key: dataSource.key,
                crossDomain: dataSource.crossDomain,
                jsonp: dataSource.jsonp,
                dataType: dataSource.dataType,
                offline: dataSource.offline !== undefined ? dataSource.offline
                    : dataSource.adaptor instanceof RemoteSaveAdaptor || dataSource.adaptor instanceof CustomDataAdaptor ?
                        false : dataSource.url ? false : true,
                requiresFormat: dataSource.requiresFormat,
                enablePersistence: dataSource.enablePersistence,
                id: dataSource.id,
                ignoreOnPersist: dataSource.ignoreOnPersist
            };
        } else {
            DataUtil.throwError('DataManager: Invalid arguments');
        }
        if (data.requiresFormat === undefined && !DataUtil.isCors()) {
            data.requiresFormat = isNullOrUndefined(data.crossDomain) ? true : data.crossDomain;
        }
        if (data.dataType === undefined) {
            data.dataType = 'json';
        }
        this.isEnableCache = data.enableCache;
        this.dataSource = data;
        this.defaultQuery = query;
        if (this.dataSource.enablePersistence && this.dataSource.id) {
            window.addEventListener('unload', this.setPersistData.bind(this));
        }

        if (data.url && data.offline && !data.json.length) {
            this.isDataAvailable = false;
            this.adaptor = <AdaptorOptions>adaptor || new ODataAdaptor();
            this.dataSource.offline = false;
            this.ready = this.executeQuery(query || new Query());
            this.ready.then((e: ReturnOption) => {
                this.dataSource.offline = true;
                this.isDataAvailable = true;
                data.json = (<Object[]>e.result);
                this.adaptor = new JsonAdaptor();
            });
        } else {
            this.adaptor = data.offline ? new JsonAdaptor() : new ODataAdaptor();
        }
        if (!data.jsonp && this.adaptor instanceof ODataAdaptor) {
            data.jsonp = 'callback';
        }
        this.adaptor = <AdaptorOptions>adaptor || this.adaptor;
        if (this.isEnableCache) {
            this.guidId = DataUtil.getGuid('cacheAdaptor');
            const obj: Object = { keys: [], results: [] };
            window.localStorage.setItem(this.guidId, JSON.stringify(obj));
        }
        if (data.enableCaching) {
            this.adaptor = new CacheAdaptor(<CacheAdaptor>this.adaptor, data.timeTillExpiration, data.cachingPageSize);
        }
        return this;
    }

    /**
     * Get the queries maintained in the persisted state.
     * @param {string} id - The identifier of the persisted query to retrieve.
     * @returns {object} The persisted data object.
     */
    public getPersistedData(id?: string): object {
        const persistedData: string = localStorage.getItem(id || this.dataSource.id);
        return JSON.parse(persistedData);
    }

     /**
     * Set the queries to be maintained in the persisted state.
     * @param {Event} e - The event parameter that triggers the setPersistData method.
     * @param {string} id - The identifier of the persisted query to set.
     * @param {object} persistData - The data to be persisted.
     * @returns {void} .
     */
    public setPersistData(e: Event, id?: string, persistData?:object): void {
        localStorage.setItem(id || this.dataSource.id, JSON.stringify(persistData || this.persistQuery));
    }

    private setPersistQuery(query: Query): Query {
        const persistedQuery: object = this.getPersistedData();
        if (this.isInitialLoad && persistedQuery && Object.keys(persistedQuery).length) {
            this.persistQuery = persistedQuery;
            (this.persistQuery as Query).queries = (this.persistQuery as Query).queries.filter((query: QueryOptions) => {
                if (this.dataSource.ignoreOnPersist && this.dataSource.ignoreOnPersist.length) {
                    if (query.fn && this.dataSource.ignoreOnPersist.some((keyword: string) => query.fn === keyword)) {
                        return false; // Exclude the matching query
                    }
                }

                if (query.fn === 'onWhere') {
                    const { e } = query;
                    if (e && e.isComplex && e.predicates instanceof Array) {
                        const allPredicates: Predicate[] = e.predicates.map((predicateObj: Predicate) => {
                            if (predicateObj.predicates && predicateObj.predicates instanceof Array) {
                                // Process nested predicate array
                                const nestedPredicates: Predicate[] = predicateObj.predicates.map((nestedPredicate: Predicate) => {
                                    const { field, operator, value, ignoreCase, ignoreAccent, matchCase } = nestedPredicate;
                                    return new Predicate(field, operator, value, ignoreCase, ignoreAccent, matchCase);
                                });
                                return predicateObj.condition === 'and' ? Predicate.and(nestedPredicates) : Predicate.or(nestedPredicates);
                            } else {
                                // Process individual predicate
                                const { field, operator, value, ignoreCase, ignoreAccent, matchCase } = predicateObj;
                                return new Predicate(field, operator, value, ignoreCase, ignoreAccent, matchCase);
                            }
                        });
                        query.e = new Predicate(allPredicates[0], e.condition, allPredicates.slice(1));
                    }
                }
                return true; // Keep all other queries
            });
            const newQuery: Query = extend(new Query(), this.persistQuery) as Query;
            this.isInitialLoad = false;
            return (newQuery);
        }
        else {
            this.persistQuery = query;
            this.isInitialLoad = false;
            return query;
        }
    }

    /**
     * Overrides DataManager's default query with given query.
     *
     * @param  {Query} query - Defines the new default query.
     */
    public setDefaultQuery(query: Query): DataManager {
        this.defaultQuery = query;
        return this;
    }

    /**
     * Executes the given query with local data source.
     *
     * @param  {Query} query - Defines the query to retrieve data.
     */
    public executeLocal(query?: Query): Object[] {
        if (!this.defaultQuery && !(query instanceof Query)) {
            DataUtil.throwError('DataManager - executeLocal() : A query is required to execute');
        }

        if (!this.dataSource.json) {
            DataUtil.throwError('DataManager - executeLocal() : Json data is required to execute');
        }

        if (this.dataSource.enablePersistence && this.dataSource.id) {
            query = this.setPersistQuery(query);
        }

        query = query || this.defaultQuery;
        
        const result: ReturnOption = this.adaptor.processQuery(this, query);

        if (query.subQuery) {
            const from: string = query.subQuery.fromTable;
            const lookup: Object = query.subQuery.lookups;
            const res: [{ [key: string]: Object[] }] = query.isCountRequired ? <[{ [key: string]: Object[] }]>result.result :
                <[{ [key: string]: Object[] }]>result;

            if (lookup && lookup instanceof Array) {
                DataUtil.buildHierarchy(query.subQuery.fKey, from, res as Group, lookup as Group, query.subQuery.key);
            }

            for (let j: number = 0; j < res.length; j++) {
                if (res[j][from] instanceof Array) {
                    res[j] = extend({}, {}, res[j]) as { [key: string]: Object[] };
                    res[j][from] = this.adaptor.processResponse(
                        query.subQuery.using(new DataManager(res[j][from].slice(0) as JSON[])).executeLocal(),
                        this, query);
                }
            }
        }
        return this.adaptor.processResponse(result, this, query);
    }

    /**
     * Executes the given query with either local or remote data source.
     * It will be executed as asynchronously and returns Promise object which will be resolved or rejected after action completed.
     *
     * @param  {Query|Function} query - Defines the query to retrieve data.
     * @param  {Function} done - Defines the callback function and triggers when the Promise is resolved.
     * @param  {Function} fail - Defines the callback function and triggers when the Promise is rejected.
     * @param  {Function} always - Defines the callback function and triggers when the Promise is resolved or rejected.
     */
    public executeQuery(query: Query | Function, done?: Function, fail?: Function, always?: Function): Promise<Response> {
        const makeRequest: string = 'makeRequest';
        if (this.dataSource.enablePersistence && this.dataSource.id) {
            query = this.setPersistQuery(query as Query);
        }
        if (typeof query === 'function') {
            always = fail;
            fail = done;
            done = <Function>query;
            query = null;
        }

        if (!query) {
            query = this.defaultQuery;
        }

        if (!(query instanceof Query)) {
            DataUtil.throwError('DataManager - executeQuery() : A query is required to execute');
        }

        const deffered: Deferred = new Deferred();
        let args: Object = { query: query };

        if (!this.dataSource.offline && (this.dataSource.url !== undefined && this.dataSource.url !== '')
            || (!isNullOrUndefined(this.adaptor[makeRequest])) || this.isCustomDataAdaptor(this.adaptor)) {
            const result: ReturnOption = this.isEnableCache ? this.processQuery(query as Query) :  this.adaptor.processQuery(this, query);
            if (!isNullOrUndefined(this.adaptor[makeRequest])) {
                this.adaptor[makeRequest](result, deffered, args, <Query>query);
            } else if (!isNullOrUndefined(result.url) || this.isCustomDataAdaptor(this.adaptor)) {
                this.requests = [];
                this.makeRequest(result, deffered, args, <Query>query);
            } else {
                args = DataManager.getDeferedArgs(<Query>query, result as ReturnOption, args as ReturnOption);
                deffered.resolve(args);
            }
        } else {
            DataManager.nextTick(
                () => {
                    const res: Object[] = this.executeLocal(<Query>query);
                    args = DataManager.getDeferedArgs(<Query>query, res as ReturnOption, args as ReturnOption);
                    deffered.resolve(args);
                });
        }
        if (done || fail) {
            deffered.promise.then(<(value: Object) => Object> done, <(value: Object) => Object> fail);
        }
        if (always) {
            deffered.promise.then(<(value: Object) => Object> always, <(value: Object) => Object> always);
        }

        return deffered.promise as Promise<Response>;
    }

    protected getQueryRequest(query: Query): Requests {
        const req: Requests = { sorts: [], groups: [], filters: [], searches: [], aggregates: [] };
        req.sorts = Query.filterQueries(query.queries, 'onSortBy');
        req.groups = Query.filterQueries(query.queries, 'onGroup');
        req.filters = Query.filterQueries(query.queries, 'onWhere');
        req.searches = Query.filterQueries(query.queries, 'onSearch');
        req.aggregates = Query.filterQueries(query.queries, 'onAggregates');
        return req;
    }


    private generateKey(url: string, query: Query): string {
        const queries: Requests = this.getQueryRequest(query);
        const singles: Object = Query.filterQueryLists(query.queries, ['onSelect', 'onPage', 'onSkip', 'onTake', 'onRange']);
        let key: string = url;
        const page: string = 'onPage';
        queries.sorts.forEach((obj: QueryOptions) => {
            key += obj.e.direction + obj.e.fieldName;
        });
        queries.groups.forEach((obj: QueryOptions) => {
            key += obj.e.fieldName;
        });
        queries.searches.forEach((obj: QueryOptions) => {
            key += obj.e.searchKey;
        });

        for (let filter: number = 0; filter < queries.filters.length; filter++) {
            const currentFilter: QueryOptions = queries.filters[filter];
            if (currentFilter.e.isComplex) {
                const newQuery: Query = query.clone();
                newQuery.queries = [];
                for (let i: number = 0; i < currentFilter.e.predicates.length; i++) {
                    newQuery.queries.push({ fn: 'onWhere', e: currentFilter.e.predicates[i], filter: query.queries.filter });
                }
                key += currentFilter.e.condition + this.generateKey(url, newQuery);
            } else {
                key += currentFilter.e.field + currentFilter.e.operator + currentFilter.e.value;
            }
        }
        if (!isNullOrUndefined(this.previousCacheQuery) && this.previousCacheQuery !== key) {
            const obj: Object = { keys: [], results: [] };
            window.localStorage.setItem(this.guidId, JSON.stringify(obj));
        }
        this.previousCacheQuery = key;
        if (page in singles) {
            key += singles[page].pageIndex;
        }
        return key;
    }

    private processQuery(query: Query): Object {
        const key: string = this.generateKey(this.dataSource.url, query);
        const cachedItems: DataResult = JSON.parse(window.localStorage.getItem(this.guidId));
        const data: DataResult = cachedItems ? cachedItems.results[cachedItems.keys.indexOf(key)] : null;
        if (data != null) {
            return DataUtil.parse.parseJson(data);
        }
        return this.adaptor.processQuery(this, query);
    }

    private static getDeferedArgs(query: Query, result: ReturnOption, args?: ReturnOption): Object {
        if (query.isCountRequired) {
            args.result = result.result;
            args.count = result.count;
            args.aggregates = result.aggregates;
        } else {
            args.result = result;
        }
        return args;
    }
    private static nextTick(fn: Function): void {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        // tslint:disable-next-line:no-any
        ((<any>window).setImmediate || window.setTimeout)(fn, 0);
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
    private extendRequest(url: Object, fnSuccess: Function, fnFail: Function): Object {
        return extend(
            {}, {
                type: 'GET',
                dataType: this.dataSource.dataType,
                crossDomain: this.dataSource.crossDomain,
                jsonp: this.dataSource.jsonp,
                cache: true,
                processData: false,
                onSuccess: fnSuccess,
                onFailure: fnFail
            },
            url);
    }
    // tslint:disable-next-line:max-func-body-length
    private makeRequest(url: ReturnOption, deffered: Deferred, args?: RequestOptions, query?: Query): Object {
        let isSelector: boolean = !!query.subQuerySelector;
        const fnFail: Function = (e: string) => {
            args.error = e;
            deffered.reject(args);
        };
        const process: Function = (
            data: Object, count: number, xhr: Request, request: Fetch, actual: Object,
            aggregates: Aggregates, virtualSelectRecords?: Object) => {
            args.xhr = xhr;
            args.count = count ? parseInt(count.toString(), 10) : 0;
            args.result = data;
            args.request = request;
            args.aggregates = aggregates;
            args.actual = actual;
            args.virtualSelectRecords = virtualSelectRecords;
            deffered.resolve(args);
        };
        const fnQueryChild: Function = (data: Object[], selector: Object) => {
            const subDeffer: Deferred = new Deferred();
            const childArgs: Object = { parent: args };
            query.subQuery.isChild = true;
            const subUrl: Object = this.adaptor.processQuery(this, query.subQuery, data ? this.adaptor.processResponse(data) : selector);
            const childReq: Object = this.makeRequest(subUrl, subDeffer, childArgs, query.subQuery);
            if (!isSelector) {
                subDeffer.then(
                    (subData: { count: number, xhr: Request }) => {
                        if (data) {
                            DataUtil.buildHierarchy(
                                query.subQuery.fKey, query.subQuery.fromTable, data as Group,
                                subData as Group, query.subQuery.key);
                            process(data, subData.count, subData.xhr);
                        }
                    },
                    fnFail);
            }
            return childReq;
        };
        const fnSuccess: Function = (data: string | Object, request: Fetch) => {
            if (this.isGraphQLAdaptor(this.adaptor)) {
                // tslint:disable-next-line:no-string-literal
                if (!isNullOrUndefined(data['errors'])) {
                    // tslint:disable-next-line:no-string-literal
                    return fnFail(data['errors'], request);
                }
            }
            if (this.isCustomDataAdaptor(this.adaptor)) {
                request = extend({}, this.fetchReqOption, request) as Fetch;
            }
            if (request.contentType.indexOf('xml') === -1 && this.dateParse && !this.isEnableCache) {
                data = DataUtil.parse.parseJson(data);
            }
            let result: ReturnOption;
            let promise: Promise<Object> = (<Promise<Object>>this.afterReponseRequest(data));
            promise.then((data: Object) => {
                result = this.adaptor.processResponse(data, this, query, request.fetchRequest, request);
                if (this.isEnableCache) {
                    /* eslint-enable prefer-spread */
                    const key: string = query ? this.generateKey(this.dataSource.url, query) : this.dataSource.url;
                    let obj: DataResult = {};
                    obj = JSON.parse(window.localStorage.getItem(this.guidId));
                    const index: number = obj.keys.indexOf(key);
                    if (index !== -1) {
                        (<Object[]>obj.results).splice(index, 1);
                        obj.keys.splice(index, 1);
                    }
                    obj.results[obj.keys.push(key) - 1] = { keys: key, result: result.result, timeStamp: new Date(), count: result.count };
                    window.localStorage.setItem(this.guidId, JSON.stringify(obj));
                }
                if (request.contentType.indexOf('xml') === -1 && this.dateParse && this.isEnableCache) {
                    result = DataUtil.parse.parseJson(result);
                }
                let count: number = 0;
                let aggregates: Aggregates = null;
                const virtualSelectRecords: string = 'virtualSelectRecords';
                const virtualRecords: { virtualSelectRecords: Object } =
                    (<{ [key: string]: { virtualSelectRecords: Object } }>data)[virtualSelectRecords];
                if (query.isCountRequired) {
                    count = result.count;
                    aggregates = result.aggregates;
                    result = result.result;
                }
                if (!query.subQuery) {
                    process(result, count, request.fetchRequest, request.type, data, aggregates, virtualRecords);
                    return;
                }
                if (!isSelector) {
                    fnQueryChild(result, request);
                };
            }).catch((e: Error) => this.dataManagerFailure(e, deffered, args));
        };
        let req: Object = this.extendRequest(url, fnSuccess, fnFail);
        if (!this.isCustomDataAdaptor(this.adaptor)) {
            let promise: Promise<Object> = (<Promise<Object>>this.useMiddleware(req));
            let fetch: Fetch;
            promise.then((response: any) => {
                fetch = new Fetch(req);
                fetch.beforeSend = () => {              
                    this.beforeSend(fetch.fetchRequest, fetch, response);
                };
                req = fetch.send();
                (<Promise<Response>>req).catch((e: Error) => true);
                this.requests.push(fetch);
            }).catch((e: Error) => this.dataManagerFailure(e, deffered, args));
        } else {
            this.fetchReqOption = req as Fetch;
            const request: FetchOption = req;
            (<{ options?: RemoteOptions }>this.adaptor).options.getData({
                data: request.data,
                onSuccess: request.onSuccess, onFailure: request.onFailure
            });
        }
        if (isSelector) {
            let promise: Promise<Object[]>;
            const res: Object[] = query.subQuerySelector.call(this, { query: query.subQuery, parent: query });
            if (res && res.length) {
                promise = Promise.all([req, fnQueryChild(null, res)]);
                promise.then((...args: Object[][]) => {
                    const result: Object[] = args[0];
                    let pResult: ReturnOption = this.adaptor.processResponse(
                        result[0], this, query, this.requests[0].fetchRequest, this.requests[0]);
                    let count: number = 0;
                    if (query.isCountRequired) {
                        count = pResult.count;
                        pResult = pResult.result;
                    }
                    let cResult: ReturnOption = this.adaptor.processResponse(
                        result[1], this, query.subQuery, this.requests[1].fetchRequest, this.requests[1]);
                    count = 0;
                    if (query.subQuery.isCountRequired) {
                        count = cResult.count;
                        cResult = cResult.result;
                    }
                    DataUtil.buildHierarchy(query.subQuery.fKey, query.subQuery.fromTable, pResult, cResult, query.subQuery.key);
                    isSelector = false;
                    process(pResult, count, this.requests[0].fetchRequest);
                });
            } else {
                isSelector = false;
            }
        }
        return req;
    }

    /**
     * @param {Error} e - specifies the string
     * @param {Deferred} deffered - specifies the deffered
     * @param {RequestOptions} args - specifies the RequestOptions
     * @hidden
     */
    public dataManagerFailure(e: Error, deffered: Deferred, args?: RequestOptions): void {
        args.error = e;
        deffered.reject(args);
    }

    

    private async afterReponseRequest(data: string | Object): Promise<Object> { 
        const reponse: Object = await this.applyPostRequestMiddlewares(data);
        const deffered: Deferred = new Deferred();
        deffered.resolve(reponse);
        return deffered.promise as Promise<Response>;
    }

    /**
     * Processes the middleware stack after receiving the response.
     * @param {Response} response - The response object.
     * @returns {Response} - The potentially modified response.
     */

    public async applyPostRequestMiddlewares(response: string | Object): Promise<Object> { 
        return response;
    }

    /**
     * Registers a new middleware in the DataManager.
     * @param {Middleware} middleware - The middleware instance to register.
     * @returns {void}
     */
    public async useMiddleware(request: Object): Promise<Object> { 
        const reponse: Object = await this.applyPreRequestMiddlewares(request);
        const deffered: Deferred = new Deferred();
        deffered.resolve(reponse);
        return deffered.promise as Promise<Response>;
    }

    /**
     * Processes the middleware stack before sending the request.
     * @param {Request} request - The request object.
     * @returns {Request} - The potentially modified request.
     */
    public async applyPreRequestMiddlewares(request: Object): Promise<Object> { 
        return request;
    }


    private beforeSend(request: Request, settings?: Fetch, response?: Object): void {
        this.adaptor.beforeSend(this, request, settings);
        let headers: Object[] = [];
        if (this.dataSource.headers) {
            headers = headers.concat(this.dataSource.headers);
        }
        let props: Object[];
        if (response && (<{ headers: Object[] }>response).headers) {
            headers = headers.concat((<{ headers: Object[] }>response).headers);
        }
        for (let i: number = 0; headers && i < headers.length; i++) {
            props = [];
            const keys: string[] = Object.keys(headers[i]);
            for (const prop of keys) {
                props.push(prop);
                request.headers.set(prop, (<{ [key: string]: string }>headers[i])[prop]);
            }
        }
    }

    /**
     * Save bulk changes to the given table name.
     * User can add a new record, edit an existing record, and delete a record at the same time.
     * If the datasource from remote, then updated in a single post.
     *
     * @param {Object} changes - Defines the CrudOptions.
     * @param {string} key - Defines the column field.
     * @param {string|Query} tableName - Defines the table name.
     * @param {Query} query - Sets default query for the DataManager.
     * @param original
     */
    public saveChanges(
        changes: Object, key?: string, tableName?: string | Query, query?: Query, original?: Object): Promise<Object> | Object {

        if (tableName instanceof Query) {
            query = <Query>tableName;
            tableName = null;
        }

        const args: Object = {
            url: tableName,
            key: key || this.dataSource.key
        };

        const req: Object = this.adaptor.batchRequest(this, changes, args, query || new Query(), original);

        const dofetchRequest: string = 'dofetchRequest';

        if (this.dataSource.offline) {
            return req;
        }

        if (!isNullOrUndefined(this.adaptor[dofetchRequest])) {
            return this.adaptor[dofetchRequest](req);
        } else if (!this.isCustomDataAdaptor(this.adaptor)) {
            const deff: Deferred = new Deferred();
            const fetch: Fetch = new Fetch(req);
            fetch.beforeSend = () => {
                this.beforeSend(fetch.fetchRequest, fetch);
            };
            fetch.onSuccess = (data: string | Object, request: Fetch) => {
                if (this.isGraphQLAdaptor(this.adaptor)) {
                    // tslint:disable-next-line:no-string-literal
                    if (!isNullOrUndefined(data['errors'])) {
                        // tslint:disable-next-line:no-string-literal
                        fetch.onFailure(JSON.stringify(data['errors']));
                    }
                }
                deff.resolve(this.adaptor.processResponse(
                    data, this, null, request.fetchRequest, request, changes, args));
            };
            fetch.onFailure = (e: string) => {
                deff.reject([{ error: e }]);
            };
            (<Promise<Response>>fetch.send()).catch((e: Error) => true); // to handle the failure requests.
            return deff.promise;
        } else {
            return this.dofetchRequest(req, (<{ options?: RemoteOptions }>this.adaptor).options.batchUpdate, changes);
        }
    }

    /**
     * Inserts new record in the given table.
     *
     * @param {Object} data - Defines the data to insert.
     * @param {string|Query} tableName - Defines the table name.
     * @param {Query} query - Sets default query for the DataManager.
     * @param position
     */
    public insert(data: Object, tableName?: string | Query, query?: Query, position?: number): Object | Promise<Object> {
        if (tableName instanceof Query) {
            query = <Query>tableName;
            tableName = null;
        }

        const req: Object = this.adaptor.insert(this, data, tableName, query, position);

        const dofetchRequest: string = 'dofetchRequest';

        if (this.dataSource.offline) {
            return req;
        }

        if (!isNullOrUndefined(this.adaptor[dofetchRequest])) {
            return this.adaptor[dofetchRequest](req);
        } else {
            return this.dofetchRequest(req, (<{ options?: RemoteOptions }>this.adaptor).options.addRecord);
        }
    }

    /**
     * Removes data from the table with the given key.
     *
     * @param  {string} keyField - Defines the column field.
     * @param  {Object} value - Defines the value to find the data in the specified column.
     * @param  {string|Query} tableName - Defines the table name
     * @param  {Query} query - Sets default query for the DataManager.
     */
    public remove(keyField: string, value: Object, tableName?: string | Query, query?: Query): Object | Promise<Object> {
        if (typeof value === 'object') {
            value = DataUtil.getObject(keyField, value);
        }

        if (tableName instanceof Query) {
            query = <Query>tableName;
            tableName = null;
        }

        const res: Object = this.adaptor.remove(this, keyField, value, tableName, query);

        const dofetchRequest: string = 'dofetchRequest';

        if (this.dataSource.offline) {
            return res;
        }

        if (!isNullOrUndefined(this.adaptor[dofetchRequest])) {
            return this.adaptor[dofetchRequest](res);
        } else {
            const remove: Function = (<{ options?: RemoteOptions }>this.adaptor).options.deleteRecord;
            return this.dofetchRequest(res, remove);
        }
    }
    /**
     * Updates existing record in the given table.
     *
     * @param {string} keyField - Defines the column field.
     * @param {Object} value - Defines the value to find the data in the specified column.
     * @param {string|Query} tableName - Defines the table name
     * @param {Query} query - Sets default query for the DataManager.
     * @param original
     */
    public update(keyField: string, value: Object, tableName?: string | Query, query?: Query, original?: Object): Object | Promise<Object> {

        if (tableName instanceof Query) {
            query = <Query>tableName;
            tableName = null;
        }

        if (this.isEnableCache) {
            this.cacheQuery = this.generateKey(this.dataSource.url, query);
        }

        const res: Object = this.adaptor.update(this, keyField, value, tableName, query, original);

        const dofetchRequest: string = 'dofetchRequest';

        if (this.dataSource.offline) {
            return res;
        }

        if (!isNullOrUndefined(this.adaptor[dofetchRequest])) {
            return this.adaptor[dofetchRequest](res);
        } else {
            const update: Function = (<{ options?: RemoteOptions }>this.adaptor).options.updateRecord;
            return this.dofetchRequest(res, update);
        }
    }

    private isCustomDataAdaptor(dataSource: AdaptorOptions): boolean {
        return (<{ getModuleName?: Function }>this.adaptor).getModuleName &&
            (<{ getModuleName?: Function }>this.adaptor).getModuleName() === 'CustomDataAdaptor';
    }

    private isGraphQLAdaptor(dataSource: AdaptorOptions): boolean {
        return (<{ getModuleName?: Function }>this.adaptor).getModuleName &&
            (<{ getModuleName?: Function }>this.adaptor).getModuleName() === 'GraphQLAdaptor';
    }

    private successFunc(record: string | Object, request: Fetch, changes?: Object): void {
        if (this.isGraphQLAdaptor(this.adaptor)) {
            const data: Object = typeof record === 'object' ? record : JSON.parse(record as string);
            // tslint:disable-next-line:no-string-literal
            if (!isNullOrUndefined(data['errors'])) {
                // tslint:disable-next-line:no-string-literal
                this.failureFunc(JSON.stringify(data['errors']));
            }
        }
        if (this.isCustomDataAdaptor(this.adaptor)) {
            request = extend({}, this.fetchReqOption, request) as Fetch;
        }
        try {
            DataUtil.parse.parseJson(record);
        } catch (e) {
            record = [];
        }

        if (this.isEnableCache) {
            const requests: { action: string, keyColumn: string, key: number | string, value: object } = JSON.parse((<{ data: string }>request).data);
            if (requests.action === 'insert' || requests.action === 'remove') {
                const obj: Object = { keys: [], results: [] };
                window.localStorage.setItem(this.guidId, JSON.stringify(obj));
            } else if (requests.action === 'update') {
                const cachedItems: DataResult = JSON.parse(window.localStorage.getItem(this.guidId));
                const data: DataResult = cachedItems ? cachedItems.results[cachedItems.keys.indexOf(this.cacheQuery)] : null;
                if (data && data.result) {
                    let cacheData: Object[] = <[{ [key: string]: Object[] }]>data.result;
                    for (let i: number = 0; i < cacheData.length; i++) {
                        if (cacheData[i][requests.keyColumn] === requests.key) {
                            cacheData[i] = requests.value;
                            window.localStorage.setItem(this.guidId, JSON.stringify(cachedItems));
                            break;
                        }
                    }
                }
            }
        }
        
        record = this.adaptor.processResponse(DataUtil.parse.parseJson(record), this, null, request.fetchRequest, request, changes);
        this.fetchDeffered.resolve(record);
    }

    private failureFunc (e: string): void  {
        if (this.isEnableCache) {
            this.cacheQuery = '';
        }
        this.fetchDeffered.reject([{ error: e }]);
    }

    private dofetchRequest(res: Object, fetchFunc?: Function, changes?: Object): Promise<Response> {

        res = extend(
            {}, {
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                processData: false
            },
            res);
        this.fetchDeffered = new Deferred();

        if (!this.isCustomDataAdaptor(this.adaptor)) {
            let promise: Promise<Object> = (<Promise<Object>>this.useMiddleware(res));
            let fetch: Fetch;
            promise.then((response: any) => {
                fetch = new Fetch(res);
                fetch.beforeSend = () => {              
                    this.beforeSend(fetch.fetchRequest, fetch, response);
                };
                fetch.onSuccess = this.successFunc.bind(this);
                fetch.onFailure = this.failureFunc.bind(this);
                res = fetch.send();
                (<Promise<Response>>res).catch((e: Error) => true); // to handle the failure requests.
            }).catch((e: Error) => this.dataManagerFailure(e, this.fetchDeffered, {} as Object));
        } else {
            this.fetchReqOption = res as Fetch;
            fetchFunc.call(this, {
                data: (res as FetchOption).data, onSuccess: this.successFunc.bind(this),
                onFailure: this.failureFunc.bind(this),
                changes: changes
            });
        }
        return this.fetchDeffered.promise as Promise<Response>;
    }

    public clearPersistence(): void {
        window.removeEventListener('unload', this.setPersistData.bind(this));
        this.dataSource.enablePersistence = false;
        this.persistQuery = {};
        window.localStorage.setItem(this.dataSource.id, '[]');
    }
}

/**
 * Deferred is used to handle asynchronous operation.
 */
export class Deferred {
    /**
     * Resolve a Deferred object and call doneCallbacks with the given args.
     */
    public resolve: Function;
    /**
     * Reject a Deferred object and call failCallbacks with the given args.
     */
    public reject: Function;
    /**
     * Promise is an object that represents a value that may not be available yet, but will be resolved at some point in the future.
     */
    public promise: Promise<Object> = new Promise((resolve: Function, reject: Function) => {
        this.resolve = resolve;
        this.reject = reject;
    });
    /**
     * Defines the callback function triggers when the Deferred object is resolved.
     */
    public then: Function = this.promise.then.bind(this.promise);
    /**
     * Defines the callback function triggers when the Deferred object is rejected.
     */
    public catch: Function = this.promise.catch.bind(this.promise);
}

/**
 * @hidden
 */
export interface DataOptions {
    url?: string;
    adaptor?: AdaptorOptions;
    insertUrl?: string;
    removeUrl?: string;
    updateUrl?: string;
    crudUrl?: string;
    batchUrl?: string;
    json?: Object[];
    headers?: Object[];
    accept?: boolean;
    data?: JSON;
    enableCache?: boolean;
    timeTillExpiration?: number;
    cachingPageSize?: number;
    enableCaching?: boolean;
    requestType?: string;
    key?: string;
    crossDomain?: boolean;
    jsonp?: string;
    dataType?: string;
    offline?: boolean;
    requiresFormat?: boolean;
    timeZoneHandling?: boolean;
    id?: string;
    enablePersistence?: boolean;
    ignoreOnPersist?: string[];
}

/**
 * @hidden
 */
export interface ReturnOption {
    result?: ReturnOption;
    count?: number;
    url?: string;
    aggregates?: Aggregates;
}

/**
 * @hidden
 */
export interface FetchOption {
    onSuccess?: Function;
    onFailure?: Function;
    data?: string;
}

/**
 * @hidden
 */
export interface RequestOptions {
    xhr?: Request;
    count?: number;
    result?: ReturnOption;
    request?: Fetch;
    aggregates?: Aggregates;
    actual?: Object;
    virtualSelectRecords?: Object;
    error?: string | Error;
}

/**
 * @hidden
 */
export interface AdaptorOptions {
    processQuery?: Function;
    processResponse?: Function;
    beforeSend?: Function;
    batchRequest?: Function;
    insert?: Function;
    remove?: Function;
    update?: Function;
    key?: string;
}
