import { Ajax } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataUtil, Aggregates, Group } from './util';
import { Query } from './query';
import { ODataAdaptor, JsonAdaptor, CacheAdaptor, RemoteSaveAdaptor } from './adaptors';
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
    public ready: Promise<Ajax>;
    private isDataAvailable: boolean;
    private requests: Ajax[] = [];

    /**
     * Constructor for DataManager class
     * @param  {DataOptions|JSON[]} dataSource?
     * @param  {Query} query?
     * @param  {AdaptorOptions|string} adaptor?
     * @hidden
     */
    constructor(dataSource?: DataOptions | JSON[] | Object[], query?: Query, adaptor?: AdaptorOptions | string) {
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
                timeTillExpiration: dataSource.timeTillExpiration,
                cachingPageSize: dataSource.cachingPageSize,
                enableCaching: dataSource.enableCaching,
                requestType: dataSource.requestType,
                key: dataSource.key,
                crossDomain: dataSource.crossDomain,
                jsonp: dataSource.jsonp,
                dataType: dataSource.dataType,
                offline: dataSource.offline !== undefined ? dataSource.offline
                    : dataSource.adaptor instanceof RemoteSaveAdaptor ? false : dataSource.url ? false : true,
                requiresFormat: dataSource.requiresFormat
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

        this.dataSource = data;
        this.defaultQuery = query;

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
        if (data.enableCaching) {
            this.adaptor = new CacheAdaptor(<CacheAdaptor>this.adaptor, data.timeTillExpiration, data.cachingPageSize);
        }
        return this;
    }

    /**
     * Overrides DataManager's default query with given query. 
     * @param  {Query} query - Defines the new default query.     
     */
    public setDefaultQuery(query: Query): DataManager {
        this.defaultQuery = query;
        return this;
    }

    /**
     * Executes the given query with local data source.
     * @param  {Query} query - Defines the query to retrieve data.
     */
    public executeLocal(query?: Query): Object[] {
        if (!this.defaultQuery && !(query instanceof Query)) {
            DataUtil.throwError('DataManager - executeLocal() : A query is required to execute');
        }

        if (!this.dataSource.json) {
            DataUtil.throwError('DataManager - executeLocal() : Json data is required to execute');
        }

        query = query || this.defaultQuery;

        let result: ReturnOption = this.adaptor.processQuery(this, query);

        if (query.subQuery) {
            let from: string = query.subQuery.fromTable;
            let lookup: Object = query.subQuery.lookups;
            let res: [{ [key: string]: Object[] }] = query.isCountRequired ? <[{ [key: string]: Object[] }]>result.result :
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
     * @param  {Query|Function} query - Defines the query to retrieve data. 
     * @param  {Function} done - Defines the callback function and triggers when the Promise is resolved. 
     * @param  {Function} fail - Defines the callback function and triggers when the Promise is rejected.
     * @param  {Function} always - Defines the callback function and triggers when the Promise is resolved or rejected.
     */
    public executeQuery(query: Query | Function, done?: Function, fail?: Function, always?: Function): Promise<Ajax> {
        let makeRequest: string = 'makeRequest';
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

        let deffered: Deferred = new Deferred();
        let args: Object = { query: query };

        if (!this.dataSource.offline && (this.dataSource.url !== undefined && this.dataSource.url !== '')
            || (!isNullOrUndefined(this.adaptor[makeRequest]))) {
            let result: ReturnOption = this.adaptor.processQuery(this, query);
            if (!isNullOrUndefined(this.adaptor[makeRequest])) {
                this.adaptor[makeRequest](result, deffered, args, <Query>query);
            } else if (!isNullOrUndefined(result.url)) {
                this.makeRequest(result, deffered, args, <Query>query);
            } else {
                args = DataManager.getDeferedArgs(<Query>query, result as ReturnOption, args as ReturnOption);
                deffered.resolve(args);
            }
        } else {
            DataManager.nextTick(
                () => {
                    let res: Object[] = this.executeLocal(<Query>query);
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

        return deffered.promise as Promise<Ajax>;
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
        (window.setImmediate || window.setTimeout)(fn, 0);
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
    private makeRequest(url: ReturnOption, deffered: Deferred, args?: RequestOptions, query?: Query): Object {
        let isSelector: boolean = !!query.subQuerySelector;
        let fnFail: Function = (e: string) => {
            args.error = e;
            deffered.reject(args);
        };
        let process: Function = (
            data: Object, count: number, xhr: XMLHttpRequest, request: Ajax, actual: Object,
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
        let fnQueryChild: Function = (data: Object[], selector: Object) => {
            let subDeffer: Deferred = new Deferred();
            let childArgs: Object = { parent: args };
            query.subQuery.isChild = true;
            let subUrl: Object = this.adaptor.processQuery(this, query.subQuery, data ? this.adaptor.processResponse(data) : selector);
            let childReq: Object = this.makeRequest(subUrl, subDeffer, childArgs, query.subQuery);
            if (!isSelector) {
                subDeffer.then(
                    (subData: { count: number, xhr: XMLHttpRequest }) => {
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
        let fnSuccess: Function = (data: string | Object, request: Ajax) => {
            if (request.httpRequest.getResponseHeader('Content-Type').indexOf('xml') === -1 && this.dateParse) {
                data = DataUtil.parse.parseJson(data);
            }
            let result: ReturnOption = this.adaptor.processResponse(data, this, query, request.httpRequest, request);
            let count: number = 0;
            let aggregates: Aggregates = null;
            let virtualSelectRecords: string = 'virtualSelectRecords';
            let virtualRecords: { virtualSelectRecords: Object } =
                (<{ [key: string]: { virtualSelectRecords: Object } }>data)[virtualSelectRecords];
            if (query.isCountRequired) {
                count = result.count;
                aggregates = result.aggregates;
                result = result.result;
            }
            if (!query.subQuery) {
                process(result, count, request.httpRequest, request.type, data, aggregates, virtualRecords);
                return;
            }
            if (!isSelector) {
                fnQueryChild(result, request);
            }
        };
        let req: Object = this.extendRequest(url, fnSuccess, fnFail);
        let ajax: Ajax = new Ajax(req);
        ajax.beforeSend = () => {
            this.beforeSend(ajax.httpRequest, ajax);
        };
        req = ajax.send();
        (<Promise<Ajax>>req).catch((e: Error) => true); // to handle failure remote requests.        
        this.requests.push(ajax);
        if (isSelector) {
            let promise: Promise<Object[]>;
            let res: Object[] = query.subQuerySelector.call(this, { query: query.subQuery, parent: query });
            if (res && res.length) {
                promise = Promise.all([req, fnQueryChild(null, res)]);
                promise.then((...args: Object[][]) => {
                    let result: Object[] = args[0];
                    let pResult: ReturnOption = this.adaptor.processResponse(
                        result[0], this, query, this.requests[0].httpRequest, this.requests[0]);
                    let count: number = 0;
                    if (query.isCountRequired) {
                        count = pResult.count;
                        pResult = pResult.result;
                    }
                    let cResult: ReturnOption = this.adaptor.processResponse(
                        result[1], this, query.subQuery, this.requests[1].httpRequest, this.requests[1]);
                    count = 0;
                    if (query.subQuery.isCountRequired) {
                        count = cResult.count;
                        cResult = cResult.result;
                    }
                    DataUtil.buildHierarchy(query.subQuery.fKey, query.subQuery.fromTable, pResult, cResult, query.subQuery.key);
                    isSelector = false;
                    process(pResult, count, this.requests[0].httpRequest);
                });
            } else {
                isSelector = false;
            }
        }
        return req;
    }

    private beforeSend(request: XMLHttpRequest, settings?: Ajax): void {
        this.adaptor.beforeSend(this, request, settings);

        let headers: Object[] = this.dataSource.headers;
        let props: Object[];
        for (let i: number = 0; headers && i < headers.length; i++) {
            props = [];
            let keys: string[] = Object.keys(headers[i]);
            for (let prop of keys) {
                props.push(prop);
                request.setRequestHeader(prop, (<{ [key: string]: string }>headers[i])[prop]);
            }
        }
    }

    /**
     * Save bulk changes to the given table name. 
     * User can add a new record, edit an existing record, and delete a record at the same time. 
     * If the datasource from remote, then updated in a single post.
     * @param  {Object} changes - Defines the CrudOptions.
     * @param  {string} key - Defines the column field.
     * @param  {string|Query} tableName - Defines the table name.
     * @param  {Query} query - Sets default query for the DataManager.     
     */
    public saveChanges(
        changes: Object, key?: string, tableName?: string | Query, query?: Query, original?: Object): Promise<Object> | Object {

        if (tableName instanceof Query) {
            query = <Query>tableName;
            tableName = null;
        }

        let args: Object = {
            url: tableName,
            key: key || this.dataSource.key
        };

        let req: Object = this.adaptor.batchRequest(this, changes, args, query || new Query(), original);

        let doAjaxRequest: string = 'doAjaxRequest';

        if (this.dataSource.offline) {
            return req;
        }

        if (!isNullOrUndefined(this.adaptor[doAjaxRequest])) {
            return this.adaptor[doAjaxRequest](req);
        } else {
            let deff: Deferred = new Deferred();
            let ajax: Ajax = new Ajax(req);
            ajax.beforeSend = () => {
                this.beforeSend(ajax.httpRequest, ajax);
            };
            ajax.onSuccess = (data: string | Object, request: Ajax) => {
                deff.resolve(this.adaptor.processResponse(
                    data, this, null, request.httpRequest, request, changes, args));
            };
            ajax.onFailure = (e: string) => {
                deff.reject([{ error: e }]);
            };
            (<Promise<Ajax>>ajax.send()).catch((e: Error) => true); // to handle the failure requests.        
            return deff.promise;
        }

    }

    /**
     * Inserts new record in the given table.
     * @param  {Object} data - Defines the data to insert.
     * @param  {string|Query} tableName - Defines the table name.
     * @param  {Query} query - Sets default query for the DataManager.
     */
    public insert(data: Object, tableName?: string | Query, query?: Query, position?: number): Object | Promise<Object> {
        if (tableName instanceof Query) {
            query = <Query>tableName;
            tableName = null;
        }

        let req: Object = this.adaptor.insert(this, data, tableName, query, position);

        let doAjaxRequest: string = 'doAjaxRequest';

        if (this.dataSource.offline) {
            return req;
        }

        if (!isNullOrUndefined(this.adaptor[doAjaxRequest])) {
            return this.adaptor[doAjaxRequest](req);
        } else {
            return this.doAjaxRequest(req);
        }
    }

    /**
     * Removes data from the table with the given key.
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

        let res: Object = this.adaptor.remove(this, keyField, value, tableName, query);

        let doAjaxRequest: string = 'doAjaxRequest';

        if (this.dataSource.offline) {
            return res;
        }

        if (!isNullOrUndefined(this.adaptor[doAjaxRequest])) {
            return this.adaptor[doAjaxRequest](res);
        } else {
            return this.doAjaxRequest(res);
        }
    }
    /**
     * Updates existing record in the given table.
     * @param  {string} keyField - Defines the column field.
     * @param  {Object} value - Defines the value to find the data in the specified column.
     * @param  {string|Query} tableName - Defines the table name
     * @param  {Query} query - Sets default query for the DataManager.
     */
    public update(keyField: string, value: Object, tableName?: string | Query, query?: Query, original?: Object): Object | Promise<Object> {

        if (tableName instanceof Query) {
            query = <Query>tableName;
            tableName = null;
        }

        let res: Object = this.adaptor.update(this, keyField, value, tableName, query, original);

        let doAjaxRequest: string = 'doAjaxRequest';

        if (this.dataSource.offline) {
            return res;
        }

        if (!isNullOrUndefined(this.adaptor[doAjaxRequest])) {
            return this.adaptor[doAjaxRequest](res);
        } else {
            return this.doAjaxRequest(res);
        }
    }

    private doAjaxRequest(res: Object): Promise<Ajax> {
        let defer: Deferred = new Deferred();

        res = extend(
            {}, {
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                processData: false
            },
            res);

        let ajax: Ajax = new Ajax(res);

        ajax.beforeSend = () => {
            this.beforeSend(ajax.httpRequest, ajax);
        };
        ajax.onSuccess = (record: string | Object, request: Ajax) => {
            try {
                DataUtil.parse.parseJson(record);
            } catch (e) {
                record = [];
            }
            record = this.adaptor.processResponse(DataUtil.parse.parseJson(record), this, null, request.httpRequest, request);
            defer.resolve(record);
        };
        ajax.onFailure = (e: string) => {
            defer.reject([{ error: e }]);
        };
        (<Promise<Ajax>>ajax.send()).catch((e: Error) => true); // to handle the failure requests.
        return defer.promise as Promise<Ajax>;
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
export interface RequestOptions {
    xhr?: XMLHttpRequest;
    count?: number;
    result?: ReturnOption;
    request?: Ajax;
    aggregates?: Aggregates;
    actual?: Object;
    virtualSelectRecords?: Object;
    error?: string;
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
