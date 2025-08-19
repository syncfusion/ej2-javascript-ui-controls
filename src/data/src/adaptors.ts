/* eslint-disable valid-jsdoc */
/* eslint-disable prefer-rest-params */
/* eslint-disable security/detect-object-injection */
import { Fetch } from '@syncfusion/ej2-base';
import { merge, extend, isNullOrUndefined, setValue, getValue } from '@syncfusion/ej2-base';
import { DataUtil, Aggregates, Group, GraphQLParams } from './util';
import { DataManager, DataOptions } from './manager';
import { Query, Predicate, QueryOptions, QueryList, ParamOption } from './query';
const consts: { [key: string]: string } = { GroupGuid: '{271bbba0-1ee7}' };
/**
 * Adaptors are specific data source type aware interfaces that are used by DataManager to communicate with DataSource.
 * This is the base adaptor class that other adaptors can extend.
 *
 * @hidden
 */
export class Adaptor {
    /**
     * Specifies the datasource option.
     *
     * @default null
     */
    public dataSource: DataOptions;

    public updateType: string;

    public updateKey: string;

    /**
     * It contains the datamanager operations list like group, searches, etc.,
     *
     * @default null
     * @hidden
     */
    public pvt: PvtOptions;

    /**
     * Constructor for Adaptor class
     *
     * @param {DataOptions} ds?
     * @param ds
     * @hidden
     * @returns aggregates
     */
    constructor(ds?: DataOptions) {
        this.dataSource = ds;
        this.pvt = {};
    }

    // common options for all the adaptors
    protected options: RemoteOptions = {
        from: 'table',
        requestType: 'json',
        sortBy: 'sorted',
        select: 'select',
        skip: 'skip',
        group: 'group',
        take: 'take',
        search: 'search',
        count: 'requiresCounts',
        where: 'where',
        aggregates: 'aggregates',
        expand: 'expand'
    };

    /**
     * Returns the data from the query processing.
     *
     * @param {Object} data
     * @param {DataOptions} ds?
     * @param {Query} query?
     * @param {Request} xhr?
     * @param ds
     * @param query
     * @param xhr
     * @returns Object
     */
    public processResponse(data: Object, ds?: DataOptions, query?: Query, xhr?: Request): Object {
        return data;
    }

    /**
     * Specifies the type of adaptor.
     *
     * @default Adaptor
     */
    public type: Object = Adaptor;
}

/**
 * JsonAdaptor is used to process JSON data. It contains methods to process the given JSON data based on the queries.
 *
 * @hidden
 */
export class JsonAdaptor extends Adaptor {

    /**
     * Process the JSON data based on the provided queries.
     *
     * @param  {DataManager} dataManager
     * @param  {Query} query
     * @returns Object
     */
    public processQuery(dataManager: DataManager, query: Query): Object {
        let result: Object = dataManager.dataSource.json.slice(0);
        let count: number = (result as Object[]).length;
        let countFlg: boolean = true;
        let ret: Object[];
        let key: QueryOptions;
        const lazyLoad: object = {};
        let keyCount: number = 0;
        const group: object[] = [];
        const sort: { comparer: (a: Object, b: Object) => number, fieldName: string }[] = [];
        let page: { pageIndex: number, pageSize: number };
        for (let i: number = 0; i < query.lazyLoad.length; i++) {
            keyCount++;
            lazyLoad[query.lazyLoad[i].key] = query.lazyLoad[i].value;
        }
        const agg: { [key: string]: Object } = {};
        let isGroupByFormat: boolean = false;
        if(query.lazyLoad.length) {
            for (let i: number = 0; i < query.queries.length; i++) {
                key = query.queries[i];
                if(key.fn === 'onGroup' && !isNullOrUndefined(key.e.format)) {
                    isGroupByFormat = true;
                    break;
                }
            }
        }
        for (let i: number = 0; i < query.queries.length; i++) {
            key = query.queries[i];
            if ((key.fn === 'onPage' || key.fn === 'onGroup' || (key.fn === 'onSortBy' && !isGroupByFormat)) && query.lazyLoad.length) {
                if (key.fn === 'onGroup') {
                    group.push(key.e);
                }
                if (key.fn === 'onPage') {
                    page = key.e as { pageIndex: number, pageSize: number };
                }
                if (key.fn === 'onSortBy') {
                    sort.unshift(key.e as { comparer: (a: Object, b: Object) => number, fieldName: string });
                }
                continue;
            }
            ret = this[key.fn].call(this, result, key.e, query);
            if (key.fn === 'onAggregates') {
                agg[key.e.field + ' - ' + key.e.type] = ret;
            } else {
                result = ret !== undefined ? ret : result;
            }
            if (key.fn === 'onPage' || key.fn === 'onSkip' || key.fn === 'onTake' || key.fn === 'onRange') {
                countFlg = false;
            }
            if (countFlg) {
                count = (result as Object[]).length;
            }
        }

        if (keyCount) {
            const args: LazyLoadGroupArgs = {
                query: query, lazyLoad: lazyLoad as LazyLoad, result: result as Object[], group: group, page: page, sort: sort
            };
            const lazyLoadData: { result: Object[], count: number } = this.lazyLoadGroup(args);
            result = lazyLoadData.result;
            count = lazyLoadData.count;
        }

        if (query.isCountRequired) {
            result = {
                result: result,
                count: count,
                aggregates: agg
            };
        }
        return result;
    }

    /**
     * Perform lazy load grouping in JSON array based on the given query and lazy load details.
     *
     * @param  {LazyLoadGroupArgs} args
     */
    public lazyLoadGroup(args: LazyLoadGroupArgs): { result: Object[], count: number } {
        let count: number = 0;
        const agg: object[] = this.getAggregate(args.query);
        let result: Object[] = args.result;
        if (!isNullOrUndefined(args.lazyLoad.onDemandGroupInfo)) {
            const req: OnDemandGroupInfo = args.lazyLoad.onDemandGroupInfo;
            for (let i: number = req.where.length - 1; i >= 0; i--) {
                result = this.onWhere(result, req.where[i]);
            }
            if (args.group.length !== req.level) {
                const field: string = (<{ fieldName?: string }>args.group[req.level]).fieldName;
                result = DataUtil.group(result, field, agg, null, null, (<{ comparer?: Function }>args.group[req.level]).comparer, true);
                if(args.sort.length) {
                    result = this.onSortBy(result, args.sort[parseInt(req.level.toString(), 10)], args.query, true);
                }
            } else {
                for (let i: number = args.sort.length - 1; i >= req.level; i--) {
                    result = this.onSortBy(result, args.sort[parseInt(i.toString(), 10)], args.query, false);
                }
            }
            count = result.length;
            const data: Object[] = result;
            result = result.slice(req.skip);
            result = result.slice(0, req.take);
            if (args.group.length !== req.level) {
                this.formGroupResult(result, data);
            }
        } else {
            const field: string = (<{ fieldName?: string }>args.group[0]).fieldName;
            result = DataUtil.group(result, field, agg, null, null, (<{ comparer?: Function }>args.group[0]).comparer, true);
            count = result.length;
            const data: Object[] = result;
            if (args.sort.length) {
                const sort: { comparer: (a: Object, b: Object) => number, fieldName: string } = args.sort.length > 1 ?
                args.sort.filter((x) => x.fieldName === field)[0] : args.sort[0];
                result = this.onSortBy(result, sort, args.query, true);
            }
            if (args.page) {
                result = this.onPage(result, args.page, args.query);
            }
            this.formGroupResult(result, data);
        }
        return { result: result, count: count };
    }

    private formGroupResult(result: Object[], data: Object[]): Object[] {
        if (result.length && data.length) {
            const uid: string = 'GroupGuid'; const childLevel: string = 'childLevels'; const level: string = 'level';
            const records: string = 'records';
            result[uid] = data[uid];
            result[childLevel] = data[childLevel];
            result[level] = data[level];
            result[records] = data[records];
        }
        return result;
    }

    /**
     * Separate the aggregate query from the given queries
     *
     * @param  {Query} query
     */
    public getAggregate(query: Query): Object[] {
        const aggQuery: QueryOptions[] = Query.filterQueries(query.queries, 'onAggregates') as QueryOptions[];
        const agg: Object[] = [];
        if (aggQuery.length) {
            let tmp: QueryOptions;
            for (let i: number = 0; i < aggQuery.length; i++) {
                tmp = aggQuery[i].e;
                agg.push({ type: tmp.type, field: DataUtil.getValue(tmp.field, query) });
            }
        }
        return agg;
    }

    /**
     * Performs batch update in the JSON array which add, remove and update records.
     *
     * @param  {DataManager} dm
     * @param  {CrudOptions} changes
     * @param  {RemoteArgs} e
     */
    public batchRequest(dm: DataManager, changes: CrudOptions, e: RemoteArgs): CrudOptions {
        let i: number;
        const deletedRecordsLen: number = changes.deletedRecords.length;
        for (i = 0; i < changes.addedRecords.length; i++) {
            this.insert(dm, changes.addedRecords[i]);
        }
        for (i = 0; i < changes.changedRecords.length; i++) {
            this.update(dm, e.key, changes.changedRecords[i]);
        }
        for (i = 0; i < deletedRecordsLen; i++) {
            this.remove(dm, e.key, changes.deletedRecords[i]);
        }
        return changes;
    }

    /**
     * Performs filter operation with the given data and where query.
     *
     * @param {Object[]} ds
     * @param {{validate:Function}} e
     * @param e.validate
     */
    public onWhere(ds: Object[], e: { validate: Function }): Object[] {
        if (!ds || !ds.length) { return ds; }
        return ds.filter((obj: Object) => {
            if (e) { return e.validate(obj); }
        });
    }

    /**
     * Returns aggregate function based on the aggregate type.
     *
     * @param {Object[]} ds
     * @param e
     * @param {string} } type
     * @param e.field
     * @param e.type
     */
    public onAggregates(ds: Object[], e: { field: string, type: string }): Function {
        const fn: Function = DataUtil.aggregates[e.type] as Function;
        if (!ds || !fn || ds.length === 0) { return null; }
        return fn(ds, e.field);
    }

    /**
     * Performs search operation based on the given query.
     *
     * @param  {Object[]} ds
     * @param  {QueryOptions} e
     */
    public onSearch(ds: Object[], e: QueryOptions): Object[] {
        if (!ds || !ds.length) { return ds; }

        if (e.fieldNames.length === 0) {
            DataUtil.getFieldList(ds[0], <string[]>e.fieldNames);
        }

        return ds.filter((obj: Object): boolean => {
            for (let j: number = 0; j < e.fieldNames.length; j++) {
                if ((<Function>e.comparer).call(obj, DataUtil.getObject(e.fieldNames[j], obj), e.searchKey, e.ignoreCase, e.ignoreAccent)) {
                    return true;
                }
            }
            return false;
        });
    }

    /**
     * Sort the data with given direction and field.
     *
     * @param {Object[]} ds
     * @param e
     * @param {Object} b
     * @param e.comparer
     * @param e.fieldName
     * @param query
     * @param isLazyLoadGroupSort
     */
    public onSortBy(ds: Object[], e: { comparer: (a: Object, b: Object) => number, fieldName: string }, query: Query, isLazyLoadGroupSort?: boolean): Object[] {
        if (!ds || !ds.length) { return ds; }
        let fnCompare: Function;
        let field: string[] | string = <string[] | string>DataUtil.getValue(e.fieldName, query);
        if (!field) {
            return ds.sort(e.comparer);
        }

        if (field instanceof Array) {
            field = field.slice(0);

            for (let i: number = field.length - 1; i >= 0; i--) {
                if (!field[i]) { continue; }
                fnCompare = e.comparer;

                if (DataUtil.endsWith(field[i], ' desc')) {
                    fnCompare = DataUtil.fnSort('descending');
                    field[i] = field[i].replace(' desc', '');
                }

                ds = DataUtil.sort(ds, field[i], fnCompare);
            }
            return ds;
        }
        return DataUtil.sort(ds, isLazyLoadGroupSort ? 'key' : <string>field, e.comparer);
    }

    /**
     * Group the data based on the given query.
     *
     * @param  {Object[]} ds
     * @param  {QueryOptions} e
     * @param  {Query} query
     */
    public onGroup(ds: Object[], e: QueryOptions, query: Query): Object[] {
        if (!ds || !ds.length) { return ds; }
        const agg: Object[] = this.getAggregate(query);
        return DataUtil.group(ds, DataUtil.getValue(e.fieldName, query), agg, null, null, e.comparer as Function);
    }

    /**
     * Retrieves records based on the given page index and size.
     *
     * @param {Object[]} ds
     * @param e
     * @param {number} } pageIndex
     * @param e.pageSize
     * @param {Query} query
     * @param e.pageIndex
     */
    public onPage(ds: Object[], e: { pageSize: number, pageIndex: number }, query: Query): Object[] {
        const size: number = DataUtil.getValue(e.pageSize, query);
        const start: number = (DataUtil.getValue(e.pageIndex, query) - 1) * size;
        const end: number = start + size;
        if (!ds || !ds.length) { return ds; }
        return ds.slice(start, end);
    }

    /**
     * Retrieves records based on the given start and end index from query.
     *
     * @param {Object[]} ds
     * @param e
     * @param {number} } end
     * @param e.start
     * @param e.end
     */
    public onRange(ds: Object[], e: { start: number, end: number }): Object[] {
        if (!ds || !ds.length) { return ds; }
        return ds.slice(DataUtil.getValue(e.start), DataUtil.getValue(e.end));
    }

    /**
     * Picks the given count of records from the top of the datasource.
     *
     * @param {Object[]} ds
     * @param {{nos:number}} e
     * @param e.nos
     */
    public onTake(ds: Object[], e: { nos: number }): Object[] {
        if (!ds || !ds.length) { return ds; }
        return ds.slice(0, DataUtil.getValue(e.nos));
    }

    /**
     * Skips the given count of records from the data source.
     *
     * @param {Object[]} ds
     * @param {{nos:number}} e
     * @param e.nos
     */
    public onSkip(ds: Object[], e: { nos: number }): Object[] {
        if (!ds || !ds.length) { return ds; }
        return ds.slice(DataUtil.getValue(e.nos));
    }

    /**
     * Selects specified columns from the data source.
     *
     * @param {Object[]} ds
     * @param {{fieldNames:string}} e
     * @param e.fieldNames
     */
    public onSelect(ds: Object[], e: { fieldNames: string[] | Function }): Object[] {
        if (!ds || !ds.length) { return ds; }
        return DataUtil.select(ds, DataUtil.getValue<string[]>(e.fieldNames));
    }

    /**
     * Inserts new record in the table.
     *
     * @param {DataManager} dm
     * @param {Object} data
     * @param tableName
     * @param query
     * @param {number} position
     */
    public insert(dm: DataManager, data: Object, tableName?: string, query?: Query, position?: number): Object {
        if (isNullOrUndefined(position)) {
            return dm.dataSource.json.push(data);
        } else {
            return dm.dataSource.json.splice(position, 0, data);
        }
    }

    /**
     * Remove the data from the dataSource based on the key field value.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {Object} value
     * @param {string} tableName?
     * @param tableName
     * @returns null
     */
    public remove(dm: DataManager, keyField: string, value: Object, tableName?: string): Object {
        const ds: Object[] = dm.dataSource.json;
        let i: number;
        if (typeof value === 'object' && !(value instanceof Date)) {
            value = DataUtil.getObject(keyField, value);
        }
        for (i = 0; i < ds.length; i++) {
            if (DataUtil.getObject(keyField, ds[i]) === value) { break; }
        }

        return i !== ds.length ? ds.splice(i, 1) : null;
    }

    /**
     * Updates existing record and saves the changes to the table.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {Object} value
     * @param {string} tableName?
     * @param tableName
     * @returns null
     */
    public update(dm: DataManager, keyField: string, value: Object, tableName?: string): void {
        const ds: Object[] = dm.dataSource.json;
        let i: number;
        let key: string;
        if (!isNullOrUndefined(keyField)) {
            key = getValue(keyField, value as { [key: string]: string });
        }
        for (i = 0; i < ds.length; i++) {
            if (!isNullOrUndefined(keyField) && (getValue(keyField, ds[i] as { [key: string]: string })) === key) { break; }
        }
        return i < ds.length ? merge(ds[i], value) : null;
    }
}

/**
 * URL Adaptor of DataManager can be used when you are required to use remote service to retrieve data.
 * It interacts with server-side for all DataManager Queries and CRUD operations.
 *
 * @hidden
 */
export class UrlAdaptor extends Adaptor {

    /**
     * Process the query to generate request body.
     *
     * @param {DataManager} dm
     * @param {Query} query
     * @param {Object[]} hierarchyFilters?
     * @param hierarchyFilters
     * @returns p
     */
    // tslint:disable-next-line:max-func-body-length
    public processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
        const queries: Requests = this.getQueryRequest(query);
        const singles: QueryList = Query.filterQueryLists(query.queries, ['onSelect', 'onPage', 'onSkip', 'onTake', 'onRange']);
        const params: ParamOption[] = query.params;
        const url: string = dm.dataSource.url;
        let temp: QueryOptions;
        let skip: number;
        let take: number = null;
        const options: RemoteOptions = this.options;
        const request: Requests = { sorts: [], groups: [], filters: [], searches: [], aggregates: [] };
        // calc Paging & Range
        if ('onPage' in singles) {
            temp = singles.onPage;
            skip = DataUtil.getValue(temp.pageIndex, query);
            take = DataUtil.getValue(temp.pageSize, query);
            skip = (skip - 1) * take;
        } else if ('onRange' in singles) {
            temp = singles.onRange;
            skip = temp.start;
            take = temp.end - temp.start;
        }
        // Sorting
        for (let i: number = 0; i < queries.sorts.length; i++) {
            temp = DataUtil.getValue(queries.sorts[i].e.fieldName, query) as QueryOptions;
            request.sorts.push(DataUtil.callAdaptorFunction(
                this, 'onEachSort', { name: temp, direction: queries.sorts[i].e.direction }, query));
        }
        // hierarchy
        if (hierarchyFilters) {
            temp = (<Object>this.getFiltersFrom(hierarchyFilters, query));
            if (temp) {
                request.filters.push(DataUtil.callAdaptorFunction(this, 'onEachWhere', (<Predicate>temp).toJson(), query));
            }
        }
        // Filters
        for (let i: number = 0; i < queries.filters.length; i++) {
            let res: Object = DataUtil.callAdaptorFunction(this, 'onEachWhere', (<Predicate>queries.filters[i].e).toJson(), query);
            if (((<{ getModuleName?: Function }>this).getModuleName &&
                (<{ getModuleName?: Function }>this).getModuleName() === 'ODataV4Adaptor') &&
                !isNullOrUndefined(queries.filters[i].e.key) && queries.filters.length > 1) {
                res = '(' + res + ')';
            }
            request.filters.push(res);
            const keys: string[] = typeof request.filters[i] === 'object' ? Object.keys(request.filters[i]) : [];
            for (const prop of keys) {
                if (DataUtil.isNull((request)[prop])) {
                    delete request[prop];
                }
            }
        }
        // Searches
        for (let i: number = 0; i < queries.searches.length; i++) {
            temp = queries.searches[i].e;
            request.searches.push(DataUtil.callAdaptorFunction(
                this, 'onEachSearch', {
                    fields: temp.fieldNames,
                    operator: temp.operator,
                    key: temp.searchKey,
                    ignoreCase: temp.ignoreCase,
                    ignoreAccent: temp.ignoreAccent
                },
                query));
        }
        // Grouping
        for (let i: number = 0; i < queries.groups.length; i++) {
            request.groups.push(DataUtil.getValue(queries.groups[i].e.fieldName, query) as QueryOptions);
        }
        // aggregates
        for (let i: number = 0; i < queries.aggregates.length; i++) {
            temp = queries.aggregates[i].e;
            request.aggregates.push({ type: temp.type, field: DataUtil.getValue(temp.field, query) });
        }
        const req: { [key: string]: Object } = {};
        this.getRequestQuery(options, query, singles, request, req);
        // Params
        DataUtil.callAdaptorFunction(this, 'addParams', { dm: dm, query: query, params: params, reqParams: req });
        if (query.lazyLoad.length) {
            for (let i: number = 0; i < query.lazyLoad.length; i++) {
                req[query.lazyLoad[i].key] = query.lazyLoad[i].value;
            }
        }
        // cleanup
        const keys: string[] = Object.keys(req);
        for (const prop of keys) {
            if (DataUtil.isNull(req[prop]) || req[prop] === '' || (<Object[]>req[prop]).length === 0) {
                delete req[prop];
            }
        }
        if (!(options.skip in req && options.take in req) && take !== null) {
            req[options.skip] = DataUtil.callAdaptorFunction(this, 'onSkip', skip, query);
            req[options.take] = DataUtil.callAdaptorFunction(this, 'onTake', take, query);
        }
        const p: PvtOptions = this.pvt;
        this.pvt = {};
        if (this.options.requestType === 'json') {
            return {
                data: JSON.stringify(req, DataUtil.parse.jsonDateReplacer),
                url: url,
                pvtData: p,
                type: 'POST',
                contentType: 'application/json; charset=utf-8'
            };
        }
        temp = this.convertToQueryString(req, query, dm) as QueryOptions;
        temp = (dm.dataSource.url.indexOf('?') !== -1 ? '&' : '/') + temp as QueryOptions;
        return {
            type: 'GET', url: (<string>temp).length ? url.replace(/\/*$/, <string>temp) : url, pvtData: p
        };
    }

    private getRequestQuery(
        options: RemoteOptions, query: Query, singles: QueryList, request: Requests, request1: { [key: string]: Object }): void {

        const param: string = 'param';
        const req: { [key: string]: Object } = request1;
        req[options.from] = query.fromTable;
        if (options.apply && query.distincts.length) {
            req[options.apply] = 'onDistinct' in this ? DataUtil.callAdaptorFunction(this, 'onDistinct', query.distincts) : '';
        }
        if (!query.distincts.length && options.expand) {
            req[options.expand] = 'onExpand' in this && 'onSelect' in singles ?
                DataUtil.callAdaptorFunction(
                    this,
                    'onExpand',
                    { selects: DataUtil.getValue(singles.onSelect.fieldNames, query), expands: query.expands },
                    query) : query.expands;
        }
        req[options.select] = 'onSelect' in singles && !query.distincts.length ?
            DataUtil.callAdaptorFunction(this, 'onSelect', DataUtil.getValue(singles.onSelect.fieldNames, query), query) : '';
        req[options.count] = query.isCountRequired ? DataUtil.callAdaptorFunction(this, 'onCount', query.isCountRequired, query) : '';
        req[options.search] = request.searches.length ? DataUtil.callAdaptorFunction(this, 'onSearch', request.searches, query) : '';
        req[options.skip] = 'onSkip' in singles ?
            DataUtil.callAdaptorFunction(this, 'onSkip', DataUtil.getValue(singles.onSkip.nos, query), query) : '';
        req[options.take] = 'onTake' in singles ?
            DataUtil.callAdaptorFunction(this, 'onTake', DataUtil.getValue(singles.onTake.nos, query), query) : '';
        req[options.where] = request.filters.length || request.searches.length ?
            DataUtil.callAdaptorFunction(this, 'onWhere', request.filters, query) : '';
        req[options.sortBy] = request.sorts.length ? DataUtil.callAdaptorFunction(this, 'onSortBy', request.sorts, query) : '';
        req[options.group] = request.groups.length ? DataUtil.callAdaptorFunction(this, 'onGroup', request.groups, query) : '';
        req[options.aggregates] = request.aggregates.length ?
            DataUtil.callAdaptorFunction(this, 'onAggregates', request.aggregates, query) : '';
        req[param] = [];
    }

    /**
     * Convert the object from processQuery to string which can be added query string.
     *
     * @param {Object} req
     * @param request
     * @param {Query} query
     * @param {DataManager} dm
     */
    public convertToQueryString(request: Object, query: Query, dm: DataManager): string {
        return '';
        // this needs to be overridden
    }

    /**
     * Return the data from the data manager processing.
     *
     * @param {DataResult} data
     * @param {DataOptions} ds?
     * @param {Query} query?
     * @param {Request} xhr?
     * @param {Object} request?
     * @param {CrudOptions} changes?
     * @param ds
     * @param query
     * @param xhr
     * @param request
     * @param changes
     */
    public processResponse(
        data: DataResult, ds?: DataOptions, query?: Query, xhr?: Request, request?: Object, changes?: CrudOptions): DataResult {
        if (xhr && xhr.headers.get('Content-Type') &&
            xhr.headers.get('Content-Type').indexOf('application/json') !== -1) {
            const handleTimeZone: boolean = DataUtil.timeZoneHandling;
            if (ds && !ds.timeZoneHandling) {
                DataUtil.timeZoneHandling = false;
            }
            if (!ds.enableCache) {
                data = DataUtil.parse.parseJson(data);
            }
            DataUtil.timeZoneHandling = handleTimeZone;
        }
        const requests: { pvtData?: Object, data?: string } = request;
        const pvt: PvtOptions = requests.pvtData || {};
        const groupDs: Object[] = data ? data.groupDs : [];
        if (xhr && xhr.headers.get('Content-Type') &&
            xhr.headers.get('Content-Type').indexOf('xml') !== -1) {
            return (query.isCountRequired ? { result: [], count: 0 } : []) as DataResult;
        }
        const d: { action: string } = JSON.parse(requests.data);
        if (d && d.action === 'batch' && data && data.addedRecords && !isNullOrUndefined(changes)) {
            changes.addedRecords = data.addedRecords;
            return changes;
        }
        if (data && data.d) {
            data = <DataResult>data.d;
        }
        const args: DataResult = {};
        if (data && 'count' in data) { args.count = data.count; }
        args.result = data && data.result ? data.result : data;
        let isExpand: boolean = false;
        if (Array.isArray(data.result) && data.result.length) {
            const key: string = 'key'; const val: string = 'value'; const level: string = 'level';
            if (!isNullOrUndefined(data.result[0][key])) {
                args.result = this.formRemoteGroupedData(args.result as Group[], 1, pvt.groups.length - 1);
            }
            if (query && query.lazyLoad.length && pvt.groups.length) {
                for (let i: number = 0; i < query.lazyLoad.length; i++) {
                    if (query.lazyLoad[i][key] === 'onDemandGroupInfo') {
                        const value: Object = query.lazyLoad[i][val][level];
                        if (pvt.groups.length === value) {
                            isExpand = true;
                        }
                    }
                }
            }
        }
        if (!isExpand) {
            this.getAggregateResult(pvt, data, args, groupDs, query);
        }

        return DataUtil.isNull(args.count) ? args.result : { result: args.result, count: args.count, aggregates: args.aggregates };
    }

    protected formRemoteGroupedData(data: Group[], level: number, childLevel: number): Group[] {
        for (let i: number = 0; i < data.length; i++) {
            if (data[i].items.length && Object.keys(data[i].items[0]).indexOf('key') > -1) {
                this.formRemoteGroupedData(data[i].items, level + 1, childLevel - 1);
            }
        }

        const uid: string = 'GroupGuid'; const childLvl: string = 'childLevels'; const lvl: string = 'level';
        const records: string = 'records';
        data[uid] = consts[uid];
        data[lvl] = level;
        data[childLvl] = childLevel;
        data[records] = data[0].items.length ? this.getGroupedRecords(data, !isNullOrUndefined(data[0].items[records])) : [];
        return data;
    }

    private getGroupedRecords(data: Group[], hasRecords: boolean): Object[] {
        let childGroupedRecords: Object[] = [];
        const records: string = 'records';
        for (let i: number = 0; i < data.length; i++) {
            if (!hasRecords) {
                for (let j: number = 0; j < data[i].items.length; j++) {
                    childGroupedRecords.push(data[i].items[j]);
                }
            } else {
                childGroupedRecords = childGroupedRecords.concat(data[i].items[records]);
            }
        }
        return childGroupedRecords;
    }

    /**
     * Add the group query to the adaptor`s option.
     *
     * @param  {Object[]} e
     * @returns void
     */
    public onGroup(e: QueryOptions[]): QueryOptions[] {
        this.pvt.groups = e;
        return e;
    }

    /**
     * Add the aggregate query to the adaptor`s option.
     *
     * @param  {Aggregates[]} e
     * @returns void
     */
    public onAggregates(e: Aggregates[]): void {
        this.pvt.aggregates = e;
    }

    /**
     * Prepare the request body based on the newly added, removed and updated records.
     * The result is used by the batch request.
     *
     * @param {DataManager} dm
     * @param {CrudOptions} changes
     * @param {Object} e
     * @param query
     * @param original
     */
    public batchRequest(dm: DataManager, changes: CrudOptions, e: Object, query: Query, original?: Object): Object {
        let url: string;
        let key: string;
        return {
            type: 'POST',
            url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.removeUrl || dm.dataSource.url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(extend({}, {
                changed: changes.changedRecords,
                added: changes.addedRecords,
                deleted: changes.deletedRecords,
                action: 'batch',
                table: e[url],
                key: e[key]
            },                          DataUtil.getAddParams(this, dm, query)))
        };
    }

    /**
     * Method will trigger before send the request to server side.
     * Used to set the custom header or modify the request options.
     *
     * @param  {DataManager} dm
     * @param  {Request} request
     * @param  {Fetch} settings?
     * @returns void
     */
    public beforeSend(dm: DataManager, request: Request, settings?: Fetch): void {
        // need to extend this method
    }

    /**
     * Prepare and returns request body which is used to insert a new record in the table.
     *
     * @param {DataManager} dm
     * @param {Object} data
     * @param {string} tableName
     * @param query
     */
    public insert(dm: DataManager, data: Object, tableName: string, query: Query): Object {
        return {
            url: dm.dataSource.insertUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify(extend({}, {
                value: data,
                table: tableName,
                action: 'insert'
            },                          DataUtil.getAddParams(this, dm, query)))
        };
    }

    /**
     * Prepare and return request body which is used to remove record from the table.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {number|string} value
     * @param {string} tableName
     * @param query
     */
    public remove(dm: DataManager, keyField: string, value: number | string, tableName: string, query: Query): Object {
        return {
            type: 'POST',
            url: dm.dataSource.removeUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify(extend({}, {
                key: value,
                keyColumn: keyField,
                table: tableName,
                action: 'remove'
            },                          DataUtil.getAddParams(this, dm, query)))
        };
    }

    /**
     * Prepare and return request body which is used to update record.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {Object} value
     * @param {string} tableName
     * @param query
     */
    public update(dm: DataManager, keyField: string, value: Object, tableName: string, query: Query): Object {
        return {
            type: 'POST',
            url: dm.dataSource.updateUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify(extend({}, {
                value: value,
                action: 'update',
                keyColumn: keyField,
                key: DataUtil.getObject(keyField, value),
                table: tableName
            },                          DataUtil.getAddParams(this, dm, query)))
        };
    }

    /**
     * To generate the predicate based on the filtered query.
     *
     * @param  {Object[]|string[]|number[]} data
     * @param  {Query} query
     * @hidden
     */
    public getFiltersFrom(data: Object[] | string[] | number[], query: Query): Predicate {
        const key: string = query.fKey;
        let value: string | number | boolean;
        let prop: string = key;
        const pKey: string = query.key;
        const predicats: Predicate[] = [];

        if (typeof data[0] !== 'object') { prop = null; }

        for (let i: number = 0; i < data.length; i++) {
            if (typeof data[0] === 'object') {
                value = <string | number>DataUtil.getObject(pKey || prop, data[i]);
            } else {
                value = (<string[] | number[]>data)[i];
            }
            predicats.push(new Predicate(key, 'equal', value));
        }

        return Predicate.or(predicats);
    }

    protected getAggregateResult(pvt: PvtOptions, data: DataResult, args: DataResult, groupDs?: Object[], query?: Query): DataResult {
        let pData: DataResult | Object[] = data;
        if (data && data.result) { pData = data.result; }
        if (pvt && pvt.aggregates && pvt.aggregates.length) {
            const agg: Aggregates[] = pvt.aggregates;
            let fn: Function;
            let aggregateData: DataResult = pData;
            const res: { [key: string]: Aggregates } = {};
            if (data.aggregate) { aggregateData = data.aggregate; }
            for (let i: number = 0; i < agg.length; i++) {
                fn = DataUtil.aggregates[agg[i].type];
                if (fn) {
                    res[agg[i].field + ' - ' + agg[i].type] = fn(aggregateData, agg[i].field);
                }
            }
            args.aggregates = res;
        }

        const key: string = 'key';
        const isServerGrouping: boolean = Array.isArray(data.result) && data.result.length && !isNullOrUndefined(data.result[0][key]);
        if (pvt && pvt.groups && pvt.groups.length && !isServerGrouping) {
            const groups: string[] = (<string[]>pvt.groups);
            for (let i: number = 0; i < groups.length; i++) {
                const level: number = null;
                if (!isNullOrUndefined(groupDs)) {
                    groupDs = DataUtil.group(groupDs, groups[i]);
                }
                const groupQuery: QueryOptions = Query.filterQueries(query.queries, 'onGroup')[i].e;
                pData = DataUtil.group(<Object[]>pData, groups[i], pvt.aggregates, level, groupDs, groupQuery.comparer as Function);
            }
            args.result = pData;
        }
        return args;
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

    public addParams(options: { dm: DataManager, query: Query, params: ParamOption[], reqParams: { [key: string]: Object } }): void {
        const req: { params: Object } = options.reqParams as { params: Object };
        if (options.params.length) {
            req.params = {};
        }
        for (const tmp of options.params) {
            if (req[tmp.key]) {
                throw new Error('Query() - addParams: Custom Param is conflicting other request arguments');
            }
            req[tmp.key] = tmp.value;
            if (tmp.fn) {
                req[tmp.key] = tmp.fn.call(options.query, tmp.key, options.query, options.dm);
            }
            req.params[tmp.key] = req[tmp.key];
        }
    }

}

/**
 * OData Adaptor that is extended from URL Adaptor, is used for consuming data through OData Service.
 *
 * @hidden
 */
export class ODataAdaptor extends UrlAdaptor {

    protected getModuleName(): string {
        return 'ODataAdaptor';
    }

    /**
     * Specifies the root url of the provided odata url.
     *
     * @hidden
     * @default null
     */
    public rootUrl: string;

    /**
     * Specifies the resource name of the provided odata table.
     *
     * @hidden
     * @default null
     */
    public resourceTableName: string;

    // options replaced the default adaptor options
    protected options: RemoteOptions = extend({}, this.options, {
        requestType: 'get',
        accept: 'application/json;odata=light;q=1,application/json;odata=verbose;q=0.5',
        multipartAccept: 'multipart/mixed',
        sortBy: '$orderby',
        select: '$select',
        skip: '$skip',
        take: '$top',
        count: '$inlinecount',
        where: '$filter',
        expand: '$expand',
        batch: '$batch',
        changeSet: '--changeset_',
        batchPre: 'batch_',
        contentId: 'Content-Id: ',
        batchContent: 'Content-Type: multipart/mixed; boundary=',
        changeSetContent: 'Content-Type: application/http\nContent-Transfer-Encoding: binary ',
        batchChangeSetContentType: 'Content-Type: application/json; charset=utf-8 ',
        updateType: 'PUT'
    });
    constructor(props?: RemoteOptions) {
        super();
        extend(this.options, props || {});
    }
    /**
     * Generate request string based on the filter criteria from query.
     *
     * @param {Predicate} pred
     * @param {boolean} requiresCast?
     * @param predicate
     * @param query
     * @param requiresCast
     */
    public onPredicate(predicate: Predicate, query: Query | boolean, requiresCast?: boolean): string {
        let returnValue: string = '';
        let operator: string;
        let guid: string;
        let val: string | Date = <string | Date>predicate.value;
        const type: string = typeof val;
        let field: string = predicate.field ? ODataAdaptor.getField(predicate.field) : null;

        if (val instanceof Date) {
            val = 'datetime\'' + DataUtil.parse.replacer(<Date>val) + '\'';
        }

        if (type === 'string') {
            val = val.replace(/'/g, '\'\'');
            if (predicate.ignoreCase) {
                val = val.toLowerCase();
            }
            if (predicate.operator !== 'like') {
                val = encodeURIComponent(val);
            }
            if (predicate.operator !== 'wildcard' && predicate.operator !== 'like') {
                val = '\'' + val + '\'';
            }

            if (requiresCast) {
                field = 'cast(' + field + ', \'Edm.String\')';
            }
            if (DataUtil.parse.isGuid(val)) {
                guid = 'guid';
            }
            if (predicate.ignoreCase) {
                if (!guid) { field = 'tolower(' + field + ')'; }
                val = (<string>val).toLowerCase();
            }
        }

        if (predicate.operator === 'isempty' || predicate.operator === 'isnull' || predicate.operator === 'isnotempty' ||
            predicate.operator === 'isnotnull') {
            operator = predicate.operator.indexOf('isnot') !== -1 ? DataUtil.odBiOperator['notequal'] : DataUtil.odBiOperator['equal'];
            val = predicate.operator === 'isnull' || predicate.operator === 'isnotnull' ? null : '\'\'';
        }
        else {
            operator = DataUtil.odBiOperator[predicate.operator];
        }
        if (operator) {
            returnValue += field;
            returnValue += operator;
            if (guid) {
                returnValue += guid;
            }
            return returnValue + val;
        }

        if (!isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ) {
            operator = DataUtil.odv4UniOperator[predicate.operator];
        } else {
            operator = DataUtil.odUniOperator[predicate.operator];
        }

        if (operator === 'like') {
            val = <string>val;
            if (val.indexOf('%') !== -1) {
                if (val.charAt(0) === '%' && val.lastIndexOf('%') < 2) {
                    val = val.substring(1, val.length);
                    operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                        DataUtil.odv4UniOperator['startswith'] : DataUtil.odUniOperator['startswith'];
                }
                else if (val.charAt(val.length - 1) === '%' && val.indexOf('%') > val.length - 3) {
                    val = val.substring(0, val.length - 1);
                    operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                        DataUtil.odv4UniOperator['endswith'] : DataUtil.odUniOperator['endswith'];
                }
                else if (val.lastIndexOf('%') !== val.indexOf('%') && val.lastIndexOf('%') > val.indexOf('%') + 1) {
                    val = val.substring(val.indexOf('%') + 1, val.lastIndexOf('%'));
                    operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                        DataUtil.odv4UniOperator['contains'] : DataUtil.odUniOperator['contains'];
                }
                else {
                    operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                        DataUtil.odv4UniOperator['contains'] : DataUtil.odUniOperator['contains'];
                }
            }
            val = encodeURIComponent(val);
            val = '\'' + val + '\'';
        }
        else if (operator === 'wildcard') {
            val = <string>val;
            if (val.indexOf('*') !== -1) {
                const splittedStringValue: string[] = val.split('*');
                let splittedValue: string;
                let count: number = 0;
                if (val.indexOf('*') !== 0 && splittedStringValue[0].indexOf('%3f') === -1 &&
                    splittedStringValue[0].indexOf('?') === -1) {
                    splittedValue = splittedStringValue[0];
                    splittedValue = '\'' + splittedValue + '\'';
                    operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                        DataUtil.odv4UniOperator['startswith'] : DataUtil.odUniOperator['startswith'];
                    returnValue += operator + '(';
                    returnValue += field + ',';
                    if (guid) { returnValue += guid; }
                    returnValue += splittedValue + ')';
                    count++;
                }
                if (val.lastIndexOf('*') !== val.length - 1 && splittedStringValue[splittedStringValue.length - 1].indexOf('%3f') === -1 &&
                    splittedStringValue[splittedStringValue.length - 1].indexOf('?') === -1) {
                    splittedValue = splittedStringValue[splittedStringValue.length - 1];
                    splittedValue = '\'' + splittedValue + '\'';
                    operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                        DataUtil.odv4UniOperator['endswith'] : DataUtil.odUniOperator['endswith'];
                    if (count > 0) {
                        returnValue += ' and ';
                    }
                    returnValue += operator + '(';
                    returnValue += field + ',';
                    if (guid) { returnValue += guid; }
                    returnValue += splittedValue + ')';
                    count++;
                }
                if (splittedStringValue.length > 2) {
                    for (let i: number = 1; i < splittedStringValue.length - 1; i++) {
                        if (splittedStringValue[i].indexOf('%3f') === -1 && splittedStringValue[i].indexOf('?') === -1) {
                            splittedValue = splittedStringValue[i];
                            splittedValue = '\'' + splittedValue + '\'';
                            operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                                DataUtil.odv4UniOperator['contains'] : DataUtil.odUniOperator['contains'];
                            if (count > 0) {
                                returnValue += ' and ';
                            }
                            if (operator === 'substringof' || operator === 'not substringof') {
                                const temp: string = <string>splittedValue;
                                splittedValue = field;
                                field = temp;
                            }
                            returnValue += operator + '(';
                            returnValue += field + ',';
                            if (guid) { returnValue += guid; }
                            returnValue += splittedValue + ')';
                            count++;
                        }
                    }
                }
                if (count === 0) {
                    operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                        DataUtil.odv4UniOperator['contains'] : DataUtil.odUniOperator['contains'];
                    if (val.indexOf('?') !== -1 || val.indexOf('%3f') !== -1) {
                        val = val.indexOf('?') !== -1 ? val.split('?').join('') : val.split('%3f').join('');
                    }
                    val = '\'' + val + '\'';
                }
                else {
                    operator = 'wildcard';
                }
            }
            else {
                operator = !isNullOrUndefined(this.getModuleName) && this.getModuleName() === 'ODataV4Adaptor' ?
                    DataUtil.odv4UniOperator['contains'] : DataUtil.odUniOperator['contains'];
                if (val.indexOf('?') !== -1 || val.indexOf('%3f') !== -1) {
                    val = val.indexOf('?') !== -1 ? val.split('?').join('') : val.split('%3f').join('');
                }
                val = '\'' + val + '\'';
            }
        }
        if (operator === 'substringof' || operator === 'not substringof') {
            const temp: string = <string>val;
            val = field;
            field = temp;
        }

        if (operator !== 'wildcard') {
            returnValue += operator + '(';
            returnValue += field + ',';
            if (guid) { returnValue += guid; }
            returnValue += val + ')';
        }

        return returnValue;
    }

    public addParams(options: { dm: DataManager, query: Query, params: ParamOption[], reqParams: { [key: string]: Object } }): void {
        super.addParams(options);
        delete options.reqParams.params;
    }

    /**
     * Generate request string based on the multiple filter criteria from query.
     *
     * @param {Predicate} pred
     * @param {boolean} requiresCast?
     * @param predicate
     * @param query
     * @param requiresCast
     */
    public onComplexPredicate(predicate: Predicate, query: Query, requiresCast?: boolean): string {
        const res: string[] = [];
        for (let i: number = 0; i < predicate.predicates.length; i++) {
            res.push('(' + this.onEachWhere(predicate.predicates[i], query, requiresCast) + ')');
        }
        return res.join(' ' + predicate.condition + ' ');
    }

    /**
     * Generate query string based on the multiple filter criteria from query.
     *
     * @param {Predicate} filter
     * @param {boolean} requiresCast?
     * @param query
     * @param requiresCast
     */
    public onEachWhere(filter: Predicate, query: Query, requiresCast?: boolean): string {
        return filter.isComplex ? this.onComplexPredicate(filter, query, requiresCast) : this.onPredicate(filter, query, requiresCast);
    }

    /**
     * Generate query string based on the multiple filter criteria from query.
     *
     * @param  {string[]} filters
     */
    public onWhere(filters: string[]): string {
        if (this.pvt.search) {
            filters.push(this.onEachWhere((<Predicate>this.pvt.search), null, true));
        }
        return filters.join(' and ');
    }

    /**
     * Generate query string based on the multiple search criteria from query.
     *
     * @param e
     * @param {string} operator
     * @param {string} key
     * @param {boolean} } ignoreCase
     * @param e.fields
     * @param e.operator
     * @param e.key
     * @param e.ignoreCase
     */
    public onEachSearch(e: { fields: string[], operator: string, key: string, ignoreCase: boolean }): void {
        if (e.fields && e.fields.length === 0) {
            DataUtil.throwError('Query() - Search : oData search requires list of field names to search');
        }

        const filter: Object[] = (<Object[]>this.pvt.search) || [];
        for (let i: number = 0; i < e.fields.length; i++) {
            filter.push(new Predicate(e.fields[i], e.operator, e.key, e.ignoreCase));
        }
        this.pvt.search = filter;
    }

    /**
     * Generate query string based on the search criteria from query.
     *
     * @param  {Object} e
     */
    public onSearch(e: Object): string {
        this.pvt.search = Predicate.or(this.pvt.search);
        return '';
    }

    /**
     * Generate query string based on multiple sort criteria from query.
     *
     * @param  {QueryOptions} e
     */
    public onEachSort(e: QueryOptions): string {
        const res: string[] = [];
        if (e.name instanceof Array) {
            for (let i: number = 0; i < e.name.length; i++) {
                res.push(ODataAdaptor.getField(e.name[i]) + (e.direction === 'descending' ? ' desc' : ''));
            }
        } else {
            res.push(ODataAdaptor.getField(<string>e.name) + (e.direction === 'descending' ? ' desc' : ''));
        }
        return res.join(',');
    }

    /**
     * Returns sort query string.
     *
     * @param  {string[]} e
     */
    public onSortBy(e: string[]): string {
        return e.reverse().join(',');
    }

    /**
     * Adds the group query to the adaptor option.
     *
     * @param  {Object[]} e
     * @returns string
     */
    public onGroup(e: QueryOptions[]): QueryOptions[] {
        this.pvt.groups = e;
        return [];
    }

    /**
     * Returns the select query string.
     *
     * @param  {string[]} e
     */
    public onSelect(e: string[]): string {
        for (let i: number = 0; i < e.length; i++) {
            e[i] = ODataAdaptor.getField(e[i]);
        }
        return e.join(',');
    }

    /**
     * Add the aggregate query to the adaptor option.
     *
     * @param  {Object[]} e
     * @returns string
     */
    public onAggregates(e: Object[]): string {
        this.pvt.aggregates = e;
        return '';
    }

    /**
     * Returns the query string which requests total count from the data source.
     *
     * @param  {boolean} e
     * @returns string
     */
    public onCount(e: boolean): string {
        return e === true ? 'allpages' : '';
    }

    /**
     * Method will trigger before send the request to server side.
     * Used to set the custom header or modify the request options.
     *
     * @param {DataManager} dm
     * @param {Request} request
     * @param {Fetch} settings?
     * @param settings
     */
    public beforeSend(dm: DataManager, request: Request, settings?: Fetch): void {
        if (DataUtil.endsWith(settings.url, this.options.batch) && settings.type.toLowerCase() === 'post') {
            request.headers.set('Accept', this.options.multipartAccept);
            request.headers.set('DataServiceVersion', '2.0');
            //request.overrideMimeType('text/plain; charset=x-user-defined');
        } else {
            request.headers.set('Accept', this.options.accept);
        }
        request.headers.set('DataServiceVersion', '2.0');
        request.headers.set('MaxDataServiceVersion', '2.0');
    }

    /**
     * Returns the data from the query processing.
     *
     * @param {DataResult} data
     * @param {DataOptions} ds?
     * @param {Query} query?
     * @param {Request} xhr?
     * @param {Fetch} request?
     * @param {CrudOptions} changes?
     * @param ds
     * @param query
     * @param xhr
     * @param request
     * @param changes
     * @returns aggregateResult
     */
    public processResponse(
        data: DataResult, ds?: DataOptions, query?: Query, xhr?: Request, request?: Fetch, changes?: CrudOptions): Object {
        const metaCheck: string = 'odata.metadata';
        if ((request && request.type === 'GET') && !this.rootUrl && data[metaCheck]) {
            const dataUrls: string[] = data[metaCheck].split('/$metadata#');
            this.rootUrl = dataUrls[0];
            this.resourceTableName = dataUrls[1];
        }
        const pvtData: string = 'pvtData';
        if (!isNullOrUndefined(data.d)) {
            const dataCopy: Object[] = <Object[]>((query && query.isCountRequired) ? (<DataResult>data.d).results : data.d);
            const metaData: string = '__metadata';
            if (!isNullOrUndefined(dataCopy)) {
                for (let i: number = 0; i < dataCopy.length; i++) {
                    if (!isNullOrUndefined(dataCopy[i][metaData])) {
                        delete dataCopy[i][metaData];
                    }
                }
            }
        }
        const pvt: PvtOptions = request && request[pvtData];

        const emptyAndBatch: CrudOptions | DataResult = this.processBatchResponse(data, query, xhr, request, changes);
        if (emptyAndBatch) {
            return emptyAndBatch;
        }

        const versionCheck: string = xhr && request.fetchRequest.headers.get('DataServiceVersion');
        let count: number = null;
        const version: number = (versionCheck && parseInt(versionCheck, 10)) || 2;

        if (query && query.isCountRequired) {
            const oDataCount: string = '__count';
            if (data[oDataCount] || data['odata.count']) {
                count = data[oDataCount] || data['odata.count'];
            }
            if (data.d) { data = <DataResult>data.d; }
            if (data[oDataCount] || data['odata.count']) {
                count = data[oDataCount] || data['odata.count'];
            }
        }

        if (version === 3 && data.value) { data = data.value; }
        if (data.d) { data = <DataResult>data.d; }
        if (version < 3 && data.results) { data = data.results as DataResult; }

        const args: DataResult = {};
        args.count = count;
        args.result = data;
        this.getAggregateResult(pvt, data, args, null, query);

        return DataUtil.isNull(count) ? args.result : { result: args.result, count: args.count, aggregates: args.aggregates };
    }

    /**
     * Converts the request object to query string.
     *
     * @param {Object} req
     * @param request
     * @param {Query} query
     * @param {DataManager} dm
     * @returns tableName
     */
    public convertToQueryString(request: Object, query: Query, dm: DataManager): string {
        let res: string[] | string = [];
        const table: string = 'table';
        const tableName: string = request[table] || '';
        const format: string = '$format';
        delete request[table];

        if (dm.dataSource.requiresFormat) {
            request[format] = 'json';
        }
        const keys: string[] = Object.keys(request);
        for (const prop of keys) {
            (<string[]>res).push(prop + '=' + request[prop]);
        }
        res = (<string[]>res).join('&');

        if (dm.dataSource.url && dm.dataSource.url.indexOf('?') !== -1 && !tableName) {
            return (<string>res);
        }

        return res.length ? tableName + '?' + res : tableName || '';
    }

    private localTimeReplacer(key: string, convertObj: Object): Object {
        for (const prop of !isNullOrUndefined(convertObj) ? Object.keys(convertObj) : []) {
            if ((convertObj[prop] instanceof Date)) {
                convertObj[prop] = DataUtil.dateParse.toLocalTime(convertObj[prop]);
            }
        }
        return convertObj;
    }

    /**
     * Prepare and returns request body which is used to insert a new record in the table.
     *
     * @param {DataManager} dm
     * @param {Object} data
     * @param {string} tableName?
     * @param tableName
     */
    public insert(dm: DataManager, data: Object, tableName?: string): Object {
        return {
            url: (dm.dataSource.insertUrl || dm.dataSource.url).replace(/\/*$/, tableName ? '/' + tableName : ''),
            data: JSON.stringify(data, this.options.localTime ? this.localTimeReplacer : null)
        };
    }

    /**
     * Prepare and return request body which is used to remove record from the table.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {number} value
     * @param {string} tableName?
     * @param tableName
     */
    public remove(dm: DataManager, keyField: string, value: number, tableName?: string): Object {
        let url: string;
        if (typeof value === 'string' && !DataUtil.parse.isGuid(value)) {
            url = `('${value}')`;
        } else {
            url = `(${value})`;
        }
        return {
            type: 'DELETE',
            url: (dm.dataSource.removeUrl || dm.dataSource.url).replace(/\/*$/, tableName ? '/' + tableName : '') + url
        };
    }

    /**
     * Updates existing record and saves the changes to the table.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {Object} value
     * @param {string} tableName?
     * @param tableName
     * @param query
     * @param original
     * @returns this
     */
    public update(dm: DataManager, keyField: string, value: Object, tableName?: string, query?: Query, original?: Object): Object {
        if (this.options.updateType === 'PATCH' && !isNullOrUndefined(original)) {
            value = this.compareAndRemove(value, original, keyField);
        }
        let url: string;
        if (typeof value[keyField] === 'string' && !DataUtil.parse.isGuid(value[keyField])) {
            url = `('${value[keyField]}')`;
        } else {
            url = `(${value[keyField]})`;
        }
        return {
            type: this.options.updateType,
            url: (dm.dataSource.updateUrl || dm.dataSource.url).replace(/\/*$/, tableName ? '/' + tableName : '') + url,
            data: JSON.stringify(value, this.options.localTime ? this.localTimeReplacer : null),
            accept: this.options.accept
        };
    }

    /**
     * Prepare the request body based on the newly added, removed and updated records.
     * The result is used by the batch request.
     *
     * @param {DataManager} dm
     * @param {CrudOptions} changes
     * @param {RemoteArgs} e
     * @param query
     * @param original
     * @returns {Object}
     */
    public batchRequest(dm: DataManager, changes: CrudOptions, e: RemoteArgs, query: Query, original?: CrudOptions): Object {
        const initialGuid: string = e.guid = DataUtil.getGuid(this.options.batchPre);
        const url: string = (dm.dataSource.batchUrl || this.rootUrl) ?
            (dm.dataSource.batchUrl || this.rootUrl) + '/' + this.options.batch :
            (dm.dataSource.batchUrl || dm.dataSource.url).replace(/\/*$/, '/' + this.options.batch);
        e.url = this.resourceTableName ? this.resourceTableName : e.url;
        const args: RemoteArgs = {
            url: e.url,
            key: e.key,
            cid: 1,
            cSet: DataUtil.getGuid(this.options.changeSet)
        };
        let req: string = '--' + initialGuid + '\n';

        req += 'Content-Type: multipart/mixed; boundary=' + args.cSet.replace('--', '') + '\n';

        this.pvt.changeSet = 0;

        req += this.generateInsertRequest(changes.addedRecords, args, dm);
        req += this.generateUpdateRequest(changes.changedRecords, args, dm, original ? original.changedRecords : []);
        req += this.generateDeleteRequest(changes.deletedRecords, args, dm);

        req += args.cSet + '--\n';
        req += '--' + initialGuid + '--';

        return {
            type: 'POST',
            url: url,
            dataType: 'json',
            contentType: 'multipart/mixed; charset=UTF-8;boundary=' + initialGuid,
            data: req
        };
    }

    /**
     * Generate the string content from the removed records.
     * The result will be send during batch update.
     *
     * @param {Object[]} arr
     * @param {RemoteArgs} e
     * @param dm
     * @returns this
     */
    public generateDeleteRequest(arr: Object[], e: RemoteArgs, dm: DataManager): string {
        if (!arr) { return ''; }
        let req: string = '';

        const stat: { method: string, url: Function, data: Function } = {
            'method': 'DELETE ',
            'url': (data: Object[], i: number, key: string): string => {
                const url: object = DataUtil.getObject(key, data[i]);
                if (typeof url === 'number' || DataUtil.parse.isGuid(url)) {
                    return '(' + url as string + ')';
                } else if (url instanceof Date) {
                    const dateTime: Date = data[i][key];
                    return '(' + dateTime.toJSON() + ')';
                } else {
                    return `('${url}')`;
                }
            },
            'data': (data: Object[], i: number): string => ''
        };
        req = this.generateBodyContent(arr, e, stat, dm);

        return req + '\n';
    }

    /**
     * Generate the string content from the inserted records.
     * The result will be send during batch update.
     *
     * @param {Object[]} arr
     * @param {RemoteArgs} e
     * @param dm
     */
    public generateInsertRequest(arr: Object[], e: RemoteArgs, dm: DataManager): string {
        if (!arr) { return ''; }
        let req: string = '';

        const stat: { method: string, url: Function, data: Function } = {
            'method': 'POST ',
            'url': (data: Object[], i: number, key: string): string => '',
            'data': (data: Object[], i: number): string => JSON.stringify(data[i]) + '\n\n'
        };
        req = this.generateBodyContent(arr, e, stat, dm);

        return req;
    }

    /**
     * Generate the string content from the updated records.
     * The result will be send during batch update.
     *
     * @param {Object[]} arr
     * @param {RemoteArgs} e
     * @param dm
     * @param org
     */
    public generateUpdateRequest(arr: Object[], e: RemoteArgs, dm: DataManager, org?: Object[]): string {
        if (!arr) { return ''; }
        let req: string = '';
        arr.forEach((change: Object) => change = this.compareAndRemove(
            change, org.filter((o: Object) => DataUtil.getObject(e.key, o) === DataUtil.getObject(e.key, change))[0],
            e.key)
        );
        const stat: { method: string, url: Function, data: Function } = {
            'method': this.options.updateType + ' ',
            'url': (data: Object[], i: number, key: string): string => {
                if (typeof data[i][key] === 'number' || DataUtil.parse.isGuid(data[i][key])) {
                    return '(' + data[i][key] as string + ')';
                } else if (data[i][key] instanceof Date) {
                    const date: Date = data[i][key];
                    return '(' + date.toJSON() + ')';
                } else {
                    return `('${data[i][key]}')`;
                }
            },
            'data': (data: Object[], i: number): string => JSON.stringify(data[i]) + '\n\n'
        };
        req = this.generateBodyContent(arr, e, stat, dm);

        return req;
    }

    protected static getField(prop: string): string {
        return prop.replace(/\./g, '/');
    }

    private generateBodyContent(arr: Object[], e: RemoteArgs, stat: { method: string, url: Function, data: Function }, dm: DataManager)
        : string {
        let req: string = '';
        for (let i: number = 0; i < arr.length; i++) {
            req += '\n' + e.cSet + '\n';
            req += this.options.changeSetContent + '\n\n';
            req += stat.method;
            if (stat.method === 'POST ') {
                req += (dm.dataSource.insertUrl || dm.dataSource.crudUrl || e.url) + stat.url(arr, i, e.key) + ' HTTP/1.1\n';
            } else if (stat.method === 'PUT ' || stat.method === 'PATCH ') {
                req += (dm.dataSource.updateUrl || dm.dataSource.crudUrl || e.url) + stat.url(arr, i, e.key) + ' HTTP/1.1\n';
            } else if (stat.method === 'DELETE ') {
                req += (dm.dataSource.removeUrl || dm.dataSource.crudUrl || e.url) + stat.url(arr, i, e.key) + ' HTTP/1.1\n';
            }
            req += 'Accept: ' + this.options.accept + '\n';
            req += 'Content-Id: ' + this.pvt.changeSet++ + '\n';
            req += this.options.batchChangeSetContentType + '\n';
            if (!isNullOrUndefined(arr[i]['@odata.etag'])) {
                req += 'If-Match: ' + arr[i]['@odata.etag'] + '\n\n';
                delete arr[i]['@odata.etag'];
            } else {
                req += '\n';
            }

            req += stat.data(arr, i);
        }
        return req;
    }

    protected processBatchResponse(
        data: DataResult, query?: Query, xhr?: Request, request?: Fetch, changes?: CrudOptions): CrudOptions | DataResult {
        if (xhr && xhr.headers.get('Content-Type') && xhr.headers.get('Content-Type').indexOf('xml') !== -1) {
            return (query.isCountRequired ? { result: [], count: 0 } : []) as DataResult;
        }
        if (request && this.options.batch && DataUtil.endsWith(request.url, this.options.batch) && request.type.toLowerCase() === 'post') {
            let guid: string = xhr.headers.get('Content-Type');
            let cIdx: number;
            let jsonObj: Object; let d: string | string[] = data + '';
            guid = guid.substring(guid.indexOf('=batchresponse') + 1);
            d = (<string>d).split(guid);
            if ((<string[]>d).length < 2) { return {}; }

            d = (<string[]>d)[1];
            const exVal: RegExpExecArray = /(?:\bContent-Type.+boundary=)(changesetresponse.+)/i.exec(<string>d);
            if (exVal) { (<string>d).replace(exVal[0], ''); }

            const changeGuid: string = exVal ? exVal[1] : '';
            d = (<string>d).split(changeGuid);
            for (let i: number = (<string[]>d).length; i > -1; i--) {
                if (!/\bContent-ID:/i.test((<string[]>d)[i]) || !/\bHTTP.+201/.test((<string[]>d)[i])) {
                    continue;
                }

                cIdx = parseInt(/\bContent-ID: (\d+)/i.exec((<string[]>d)[i])[1], 10);

                if (changes.addedRecords[cIdx]) {
                    jsonObj = DataUtil.parse.parseJson(/^\{.+\}/m.exec(<string>d[i])[0]);
                    extend({}, changes.addedRecords[cIdx], this.processResponse(jsonObj));
                }
            }
            return changes;
        }
        return null;
    }

    public compareAndRemove(data: Object, original: Object, key?: string): Object {
        if (isNullOrUndefined(original)) { return data; }
        Object.keys(data).forEach((prop: string) => {
            if (prop !== key && prop !== '@odata.etag') {
                if (DataUtil.isPlainObject(data[prop])) {
                    this.compareAndRemove(data[prop], original[prop]);
                    const final: string[] = Object.keys(data[prop]).filter((data: string) => data !== '@odata.etag');
                    if (final.length === 0) { delete data[prop]; }
                } else if (data[prop] === original[prop]) {
                    delete data[prop];
                } else if (data[prop] && original[prop] && data[prop].valueOf() === original[prop].valueOf()) {
                    delete data[prop];
                }
            }
        });
        return data;
    }
}

/**
 * The OData v4 is an improved version of OData protocols.
 * The DataManager uses the ODataV4Adaptor to consume OData v4 services.
 *
 * @hidden
 */
export class ODataV4Adaptor extends ODataAdaptor {

    /**
     * @hidden
     */
    protected getModuleName(): string {
        return 'ODataV4Adaptor';
    }

    // options replaced the default adaptor options
    protected options: RemoteOptions = extend({}, this.options, {
        requestType: 'get',
        accept: 'application/json, text/javascript, */*; q=0.01',
        multipartAccept: 'multipart/mixed',
        sortBy: '$orderby',
        select: '$select',
        skip: '$skip',
        take: '$top',
        count: '$count',
        search: '$search',
        where: '$filter',
        expand: '$expand',
        batch: '$batch',
        changeSet: '--changeset_',
        batchPre: 'batch_',
        contentId: 'Content-Id: ',
        batchContent: 'Content-Type: multipart/mixed; boundary=',
        changeSetContent: 'Content-Type: application/http\nContent-Transfer-Encoding: binary ',
        batchChangeSetContentType: 'Content-Type: application/json; charset=utf-8 ',
        updateType: 'PATCH',
        localTime: false,
        apply: '$apply'
    });

    constructor(props?: RemoteOptions) {
        super(props);
        extend(this.options, props || {});
    }

    /**
     * Returns the query string which requests total count from the data source.
     *
     * @param  {boolean} e
     * @returns string
     */
    public onCount(e: boolean): string {
        return e === true ? 'true' : '';
    }

    /**
     * Generate request string based on the filter criteria from query.
     *
     * @param {Predicate} pred
     * @param {boolean} requiresCast?
     * @param predicate
     * @param query
     * @param requiresCast
     */
    public onPredicate(predicate: Predicate, query: Query | boolean, requiresCast?: boolean): string {
        let returnValue: string = '';
        const val: string | number | Date | boolean | Predicate | Predicate[] | (string | number | boolean | Date)[] = predicate.value;
        const isDate: boolean = val instanceof Date;

        if (query instanceof Query) {
            const queries: Requests = this.getQueryRequest((query as Query));
            for (let i: number = 0; i < queries.filters.length; i++) {
                if (queries.filters[i].e.key === predicate.value) {
                    requiresCast = true;
                }
            }
        }

        returnValue = super.onPredicate.call(this, predicate, query, requiresCast);

        if (isDate) {
            returnValue = returnValue.replace(/datetime'(.*)'$/, '$1');
        }
        if (DataUtil.parse.isGuid(val)) {
            returnValue = returnValue.replace('guid', '').replace(/'/g, '');
        }
        return returnValue;
    }

    /**
     * Generate query string based on the multiple search criteria from query.
     *
     * @param e
     * @param {string} operator
     * @param {string} key
     * @param {boolean} } ignoreCase
     * @param e.fields
     * @param e.operator
     * @param e.key
     * @param e.ignoreCase
     */
    public onEachSearch(e: { fields: string[], operator: string, key: string, ignoreCase: boolean }): void {
        const search: Object[] = this.pvt.searches || [];
        search.push(e.key);
        this.pvt.searches = search;
    }

    /**
     *  Generate query string based on the search criteria from query.
     *
     * @param  {Object} e
     */
    public onSearch(e: Object): string {
        return this.pvt.searches.join(' OR ');
    }

    /**
     * Returns the expand query string.
     *
     * @param {string} e
     * @param e.selects
     * @param e.expands
     */
    public onExpand(e: { selects: string[], expands: string[] }): string {
        const selected: Object = {}; const expanded: Object = {};
        const expands: string[] = e.expands.slice(); const exArr: string[] = [];
        const selects: Object[] = e.selects.filter((item: string) => item.indexOf('.') > -1);
        selects.forEach((select: string) => {
            const splits: string[] = select.split('.');
            if (!(splits[0] in selected)) {
                selected[splits[0]] = [];
            }
            if (splits.length === 2) {
                if (selected[splits[0]].length && Object.keys(selected).indexOf(splits[0]) !== -1) {
                    if (selected[splits[0]][0].indexOf('$expand') !== -1 && selected[splits[0]][0].indexOf(';$select=') === -1) {
                        selected[splits[0]][0] = selected[splits[0]][0] + ';' + '$select=' + splits[1];
                    } else {
                        selected[splits[0]][0] = selected[splits[0]][0] + ',' + splits[1];
                    }
                } else {
                    selected[splits[0]].push('$select=' + splits[1]);
                }
            } else {
                const sel: string = '$select=' + splits[splits.length - 1];
                let exp: string = ''; let close: string = '';
                for (let i: number = 1; i < splits.length - 1; i++) {
                    exp = exp + '$expand=' + splits[i] + '(';
                    close = close + ')';
                }
                const combineVal: string = exp + sel + close;
                if (selected[splits[0]].length && Object.keys(selected).indexOf(splits[0]) !== -1 &&
                    this.expandQueryIndex(selected[splits[0]], true)) {
                    const idx: number | boolean = this.expandQueryIndex(selected[splits[0]]);
                    selected[splits[0]][idx] = selected[splits[0]][idx] + combineVal.replace('$expand=', ',');
                } else {
                    selected[splits[0]].push(combineVal);
                }
            }
        });
        //Auto expand from select query
        Object.keys(selected).forEach((expand: string) => {
            if ((expands.indexOf(expand) === -1)) {
                expands.push(expand);
            }
        });
        expands.forEach((expand: string) => {
            expanded[expand] = expand in selected ? `${expand}(${selected[expand].join(';')})` : expand;
        });
        Object.keys(expanded).forEach((ex: string) => exArr.push(expanded[ex]));
        return exArr.join(',');
    }

    private expandQueryIndex( query: string[], isExpand?: boolean): boolean | number {
        for (let i: number = 0; i < query.length; i++) {
            if (query[i].indexOf('$expand') !== -1) {
                return isExpand ? true : i;
            }
        }
        return isExpand ? false : 0;
    }

    /**
     * Returns the groupby query string.
     *
     * @param {string} e
     * @param distinctFields
     */
    public onDistinct(distinctFields: string[]): Object {
        const fields: string = distinctFields.map((field: string) => ODataAdaptor.getField(field)).join(',');
        return `groupby((${fields}))`;
    }

    /**
     * Returns the select query string.
     *
     * @param  {string[]} e
     */
    public onSelect(e: string[]): string {
        return super.onSelect(e.filter((item: string) => item.indexOf('.') === -1));
    }

    /**
     * Method will trigger before send the request to server side.
     * Used to set the custom header or modify the request options.
     *
     * @param  {DataManager} dm
     * @param  {Request} request
     * @param  {Fetch} settings
     * @returns void
     */
    public beforeSend(dm: DataManager, request: Request, settings: Fetch): void {
        if (settings.type === 'POST' || settings.type === 'PUT' || settings.type === 'PATCH') {
            request.headers.set('Prefer', 'return=representation');
        }
        request.headers.set('Accept', this.options.accept);
    }

    /**
     * Returns the data from the query processing.
     *
     * @param {DataResult} data
     * @param {DataOptions} ds?
     * @param {Query} query?
     * @param {Request} xhr?
     * @param {Fetch} request?
     * @param {CrudOptions} changes?
     * @param ds
     * @param query
     * @param xhr
     * @param request
     * @param changes
     * @returns aggregateResult
     */
    public processResponse(
        data: DataResult, ds?: DataOptions, query?: Query, xhr?: Request, request?: Fetch, changes?: CrudOptions): Object {
        const metaName: string = '@odata.context';
        const metaV4Name: string = '@context';
        if ((request && request.type === 'GET') && !this.rootUrl && (data[metaName] || data[metaV4Name])) {
            const dataUrl: string[] = data[metaName] ? data[metaName].split('/$metadata#') : data[metaV4Name].split('/$metadata#');
            this.rootUrl = dataUrl[0];
            this.resourceTableName = dataUrl[1];
        }
        const pvtData: string = 'pvtData';
        const pvt: PvtOptions = request && request[pvtData];

        const emptyAndBatch: CrudOptions | DataResult = super.processBatchResponse(data, query, xhr, request, changes);
        if (emptyAndBatch) {
            return emptyAndBatch;
        }

        let count: number = null;
        const dataCount: string = '@odata.count';
        const dataV4Count: string = '@count';
        if (query && query.isCountRequired) {
            if (dataCount in data) { count = data[dataCount]; }
            else if (dataV4Count in data) { count = data[dataV4Count]; }
        }
        data = !isNullOrUndefined(data.value) ? data.value : data;

        const args: DataResult = {};
        args.count = count;
        args.result = data;

        this.getAggregateResult(pvt, data, args, null, query);

        return DataUtil.isNull(count) ? args.result : { result: args.result, count: count, aggregates: args.aggregates };
    }
}

/**
 * The Web API is a programmatic interface to define the request and response messages system that is mostly exposed in JSON or XML.
 * The DataManager uses the WebApiAdaptor to consume Web API.
 * Since this adaptor is targeted to interact with Web API created using OData endpoint, it is extended from ODataAdaptor
 *
 * @hidden
 */
export class WebApiAdaptor extends ODataAdaptor {

    protected getModuleName(): string {
        return 'WebApiAdaptor';
    }

    /**
     * Prepare and returns request body which is used to insert a new record in the table.
     *
     * @param {DataManager} dm
     * @param {Object} data
     * @param {string} tableName?
     * @param tableName
     */
    public insert(dm: DataManager, data: Object, tableName?: string): Object {
        return {
            type: 'POST',
            url: dm.dataSource.url,
            data: JSON.stringify(data)
        };
    }

    /**
     * Prepare and return request body which is used to remove record from the table.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {number} value
     * @param {string} tableName?
     * @param tableName
     */
    public remove(dm: DataManager, keyField: string, value: number, tableName?: string): Object {
        return {
            type: 'DELETE',
            url: dm.dataSource.url + '/' + value,
            data: JSON.stringify(value)
        };
    }

    /**
     * Prepare and return request body which is used to update record.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {Object} value
     * @param {string} tableName?
     * @param tableName
     */
    public update(dm: DataManager, keyField: string, value: Object, tableName?: string): Object {
        return {
            type: 'PUT',
            url: dm.dataSource.url,
            data: JSON.stringify(value)
        };
    }

    public batchRequest(dm: DataManager, changes: CrudOptions, e: RemoteArgs): Object {
        const initialGuid: string = e.guid = DataUtil.getGuid(this.options.batchPre);
        const url: string = dm.dataSource.url.replace(/\/*$/, '/' + this.options.batch);
        e.url = this.resourceTableName ? this.resourceTableName : e.url;
        const req: string[] = [];
        //insertion
        for (let i: number = 0, x: number = changes.addedRecords.length; i < x; i++) {
            changes.addedRecords.forEach((j: number, d: number) => {
                const stat: { method: string, url: Function, data: Function } = {
                    'method': 'POST ',
                    'url': (data: Object[], i: number, key: string): string => '',
                    'data': (data: Object[], i: number): string => JSON.stringify(data[i]) + '\n\n'
                };
                req.push('--' + initialGuid);
                req.push('Content-Type: application/http; msgtype=request', '');
                req.push('POST ' + '/api/' + (dm.dataSource.insertUrl || dm.dataSource.crudUrl || e.url)
                    + stat.url(changes.addedRecords, i, e.key) + ' HTTP/1.1');
                req.push('Content-Type: ' + 'application/json; charset=utf-8');
                req.push('Host: ' + location.host);
                req.push('', j ? JSON.stringify(j) : '');
            });
        }
        //updation
        for (let i: number = 0, x: number = changes.changedRecords.length; i < x; i++) {
            changes.changedRecords.forEach((j: number, d: number) => {
                const stat: { method: string, url: Function, data: Function } = {
                    'method': this.options.updateType + ' ',
                    'url': (data: Object[], i: number, key: string): string => '',
                    'data': (data: Object[], i: number): string => JSON.stringify(data[i]) + '\n\n'
                };
                req.push('--' + initialGuid);
                req.push('Content-Type: application/http; msgtype=request', '');
                req.push('PUT ' + '/api/' + (dm.dataSource.updateUrl || dm.dataSource.crudUrl || e.url)
                    + stat.url(changes.changedRecords, i, e.key) + ' HTTP/1.1');
                req.push('Content-Type: ' + 'application/json; charset=utf-8');
                req.push('Host: ' + location.host);
                req.push('', j ? JSON.stringify(j) : '');
            });
        }
        //deletion
        for (let i: number = 0, x: number = changes.deletedRecords.length; i < x; i++) {
            changes.deletedRecords.forEach((j: number, d: number) => {
                const state: { mtd: string, url: Function, data: Function } = {
                    'mtd': 'DELETE ',
                    'url': (data: Object[], i: number, key: string): string => {
                        const url: object = DataUtil.getObject(key, data[i]);
                        if (typeof url === 'number' || DataUtil.parse.isGuid(url)) {
                            return '/' + url as string;
                        } else if (url instanceof Date) {
                            const datTime: Date = data[i][key];
                            return '/' + datTime.toJSON();
                        } else {
                            return `/'${url}'`;
                        }
                    },
                    'data': (data: Object[], i: number): string => ''
                };
                req.push('--' + initialGuid);
                req.push('Content-Type: application/http; msgtype=request', '');
                req.push('DELETE ' + '/api/' + (dm.dataSource.removeUrl || dm.dataSource.crudUrl || e.url)
                    + state.url(changes.deletedRecords, i, e.key) + ' HTTP/1.1');
                req.push('Content-Type: ' + 'application/json; charset=utf-8');
                req.push('Host: ' + location.host);
                req.push('', j ? JSON.stringify(j) : '');
            });
        }
        req.push('--' + initialGuid + '--', '');
        return {
            type: 'POST',
            url: url,
            contentType: 'multipart/mixed; boundary=' + initialGuid,
            data: req.join('\r\n')
        };
    }
    /**
     * Method will trigger before send the request to server side.
     * Used to set the custom header or modify the request options.
     *
     * @param  {DataManager} dm
     * @param  {Request} request
     * @param  {Fetch} settings
     * @returns void
     */
    public beforeSend(dm: DataManager, request: Request, settings: Fetch): void {
        request.headers.set('Accept', 'application/json, text/javascript, */*; q=0.01');
    }

    /**
     * Returns the data from the query processing.
     *
     * @param {DataResult} data
     * @param {DataOptions} ds?
     * @param {Query} query?
     * @param {Request} xhr?
     * @param {Fetch} request?
     * @param {CrudOptions} changes?
     * @param ds
     * @param query
     * @param xhr
     * @param request
     * @param changes
     * @returns aggregateResult
     */
    public processResponse(
        data: DataResult, ds?: DataOptions, query?: Query, xhr?: Request, request?: Fetch, changes?: CrudOptions): Object {
        const pvtData: string = 'pvtData';
        const pvt: PvtOptions = request && request[pvtData];
        let count: number = null;
        const args: DataResult = {};
        if (request && request.type.toLowerCase() !== 'post') {
            const versionCheck: string = xhr && request.fetchRequest.headers.get('DataServiceVersion');
            const version: number = (versionCheck && parseInt(versionCheck, 10)) || 2;

            if (query && query.isCountRequired) {
                if (!DataUtil.isNull(data.Count)) { count = data.Count; }
            }

            if (version < 3 && data.Items) { data = data.Items as DataResult; }

            args.count = count;
            args.result = data;

            this.getAggregateResult(pvt, data, args, null, query);
        }
        args.result = args.result || data;
        return DataUtil.isNull(count) ? args.result : { result: args.result, count: args.count, aggregates: args.aggregates };
    }

}

/**
 * WebMethodAdaptor can be used by DataManager to interact with web method.
 *
 * @hidden
 */
export class WebMethodAdaptor extends UrlAdaptor {

    /**
     * Prepare the request body based on the query.
     * The query information can be accessed at the WebMethod using variable named `value`.
     *
     * @param {DataManager} dm
     * @param {Query} query
     * @param {Object[]} hierarchyFilters?
     * @param hierarchyFilters
     * @returns application
     */
    public processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
        const obj: Object = new UrlAdaptor().processQuery(dm, query, hierarchyFilters);
        const getData: string = 'data';
        const data: { param: Object[] } = DataUtil.parse.parseJson(obj[getData]);
        const result: { [key: string]: Object } = {};
        const value: string = 'value';

        if (data.param) {
            for (let i: number = 0; i < data.param.length; i++) {
                const param: Object = data.param[i];
                const key: string = Object.keys(param)[0];
                result[key] = param[key];
            }
        }
        result[value] = data;
        const pvtData: string = 'pvtData';
        const url: string = 'url';
        return {
            data: JSON.stringify(result, DataUtil.parse.jsonDateReplacer),
            url: obj[url],
            pvtData: obj[pvtData],
            type: 'POST',
            contentType: 'application/json; charset=utf-8'
        };
    }
}

/**
 * RemoteSaveAdaptor, extended from JsonAdaptor and it is used for binding local data and performs all DataManager queries in client-side.
 * It interacts with server-side only for CRUD operations.
 *
 * @hidden
 */
export class RemoteSaveAdaptor extends JsonAdaptor {
    /**
     * @hidden
     */
    constructor() {
        super();
    }
    public insert(dm: DataManager, data: Object, tableName: string, query: Query, position?: number): Object {
        this.pvt.position = position;
        this.updateType = 'add';
        return {
            url: dm.dataSource.insertUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify(extend({}, {
                value: data,
                table: tableName,
                action: 'insert'
            },                          DataUtil.getAddParams(this, dm, query)))
        };
    }
    public remove(dm: DataManager, keyField: string, val: Object, tableName?: string, query?: Query): Object {
        super.remove(dm, keyField, val);
        return {
            type: 'POST',
            url: dm.dataSource.removeUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify(extend({}, {
                key: val,
                keyColumn: keyField,
                table: tableName,
                action: 'remove'
            },                          DataUtil.getAddParams(this, dm, query)))
        };
    }
    public update(dm: DataManager, keyField: string, val: Object, tableName: string, query?: Query): Object {
        this.updateType = 'update';
        this.updateKey = keyField;
        return {
            type: 'POST',
            url: dm.dataSource.updateUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify(extend({}, {
                value: val,
                action: 'update',
                keyColumn: keyField,
                key: val[keyField],
                table: tableName
            },                          DataUtil.getAddParams(this, dm, query)))
        };
    }

    public processResponse(
        data: CrudOptions, ds?: DataOptions, query?: Query, xhr?: Request, request?: Fetch, changes?: CrudOptions, e?: RemoteArgs):
        Object {
        let i: number;
        const newData: CrudOptions = request ? JSON.parse((<{ data?: string }>request).data) : data;
        data = newData.action === 'batch' ? DataUtil.parse.parseJson(data) : data;
        if (this.updateType === 'add') {
            super.insert(ds as DataManager, data, null, null, this.pvt.position);
        }
        if (this.updateType === 'update') {
            super.update(ds as DataManager, this.updateKey, data);
        }
        this.updateType = undefined;
        if (data.added) {
            for (i = 0; i < data.added.length; i++) {
                super.insert(ds as DataManager, data.added[i]);
            }
        }
        if (data.changed) {
            for (i = 0; i < data.changed.length; i++) {
                super.update(ds as DataManager, e.key, data.changed[i]);
            }
        }
        if (data.deleted) {
            for (i = 0; i < data.deleted.length; i++) {
                super.remove(ds as DataManager, e.key, data.deleted[i]);
            }
        }
        return data;
    }

    /**
     * Prepare the request body based on the newly added, removed and updated records.
     * Also perform the changes in the locally cached data to sync with the remote data.
     * The result is used by the batch request.
     *
     * @param {DataManager} dm
     * @param {CrudOptions} changes
     * @param {RemoteArgs} e
     * @param query
     * @param original
     */
    public batchRequest(dm: DataManager, changes: CrudOptions, e: RemoteArgs, query?: Query, original?: Object): Object {
        return {
            type: 'POST',
            url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(extend({}, {
                changed: changes.changedRecords,
                added: changes.addedRecords,
                deleted: changes.deletedRecords,
                action: 'batch',
                table: e.url,
                key: e.key
            },                          DataUtil.getAddParams(this, dm, query)))
        };
    }

    public addParams(options: { dm: DataManager, query: Query, params: ParamOption[], reqParams: { [key: string]: Object } }): void {
        const urlParams: UrlAdaptor = new UrlAdaptor();
        urlParams.addParams(options);
    }

    /**
     * Method will trigger before send the request to server side.
     * Used to set the custom header or modify the request options.
     *
     * @param  {DataManager} dm
     * @param  {Request} request
     * @param  {Fetch} settings?
     * @returns void
     */
    public beforeSend(dm: DataManager, request: Request, settings?: Fetch): void {
        // need to extend this method
    }
}

/**
 * Fetch Adaptor that is extended from URL Adaptor, is used for handle data operations with user defined functions.
 *
 * @hidden
 */
export class CustomDataAdaptor extends UrlAdaptor {

    protected getModuleName(): string {
        return 'CustomDataAdaptor';
    }

    // options replaced the default adaptor options
    protected options: RemoteOptions = extend({}, this.options, {
        getData: () => { },
        addRecord: () => { },
        updateRecord: () => { },
        deleteRecord: () => { },
        batchUpdate: () => { }
    });
    constructor(props?: RemoteOptions) {
        super();
        extend(this.options, props || {});
    }
}

/**
 * The GraphqlAdaptor that is extended from URL Adaptor, is used for retrieving data from the Graphql server.
 * It interacts with the Graphql server with all the DataManager Queries and performs CRUD operations.
 *
 * @hidden
 */
export class GraphQLAdaptor extends UrlAdaptor {
    protected getModuleName(): string {
        return 'GraphQLAdaptor';
    }

    private opt: GraphQLAdaptorOptions;
    private schema: { result: string, count?: string, aggregates?: string };
    private query: string;
    public getVariables: Function;
    private getQuery: Function;

    constructor(options: GraphQLAdaptorOptions) {
        super();
        this.opt = options;
        this.schema = this.opt.response;
        this.query = this.opt.query;
        /* eslint-disable @typescript-eslint/no-empty-function */
        // tslint:disable-next-line:no-empty
        this.getVariables = this.opt.getVariables ? this.opt.getVariables : () => { };
        /* eslint-enable @typescript-eslint/no-empty-function */
        this.getQuery = () => this.query;
    }

    /**
     * Process the JSON data based on the provided queries.
     *
     * @param {DataManager} dm
     * @param {Query} query?
     * @param datamanager
     * @param query
     */
    public processQuery(datamanager: DataManager, query: Query): Object {
        const urlQuery: { data: string } = super.processQuery.apply(this, arguments);
        const dm: { data: string } = JSON.parse(urlQuery.data);

        // constructing GraphQL parameters
        const keys: string[] = ['skip', 'take', 'sorted', 'table', 'select', 'where',
            'search', 'requiresCounts', 'aggregates', 'params'];
        const temp: GraphQLParams = {};
        const str: string = 'searchwhereparams';
        keys.filter((e: string) => {
            temp[e] = str.indexOf(e) > -1 ? JSON.stringify(dm[e]) : dm[e];
        });

        const vars: Object = this.getVariables() || {};
        // tslint:disable-next-line:no-string-literal
        vars['datamanager'] = temp;
        const data: string = JSON.stringify({
            query:  this.getQuery(),
            variables: vars
        });
        urlQuery.data = data;
        return urlQuery;
    }
    /**
     * Returns the data from the query processing.
     * It will also cache the data for later usage.
     *
     * @param {DataResult} data
     * @param {DataManager} ds?
     * @param {Query} query?
     * @param {Request} xhr?
     * @param {Object} request?
     * @param resData
     * @param ds
     * @param query
     * @param xhr
     * @param request
     * @returns DataResult
     */
    public processResponse(resData: DataResult, ds?: DataManager, query?: Query, xhr?: Request, request?: Object): DataResult {
        const res: { data: Object[] } = resData as { data: Object[] };
        let count: number;
        let aggregates: Object;

        const result: Object | string = getValue(this.schema.result, res.data);

        if (this.schema.count) {
            count = getValue(this.schema.count, res.data);
        }

        if (this.schema.aggregates) {
            aggregates = getValue(this.schema.aggregates, res.data);
            aggregates = !isNullOrUndefined(aggregates) ? DataUtil.parse.parseJson(aggregates) : aggregates;
        }
        const pvt: PvtOptions = (request as { pvtData?: Object }).pvtData || {};
        const args: DataResult = { result: result, aggregates: aggregates };
        const data: DataResult = args;
        if ( pvt && pvt.groups && pvt.groups.length) {
            this.getAggregateResult(pvt, data, args, null, query);
        }
        return !isNullOrUndefined(count) ? { result: args.result, count: count, aggregates: aggregates } : args.result;
    }

    /**
     * Prepare and returns request body which is used to insert a new record in the table.
     */

    public insert(): {data: string} {
        const inserted: { data: string } = super.insert.apply(this, arguments);
        return this.generateCrudData(inserted, 'insert');
    }

    /**
     * Prepare and returns request body which is used to update a new record in the table.
     */
    public update(): {data: string} {
        const inserted: { data: string } = super.update.apply(this, arguments);
        return this.generateCrudData(inserted, 'update');
    }

    /**
     * Prepare and returns request body which is used to remove a new record in the table.
     */
    public remove(): {data: string} {
        const inserted: { data: string } = super.remove.apply(this, arguments);
        return this.generateCrudData(inserted, 'remove');
    }

    /**
     * Prepare the request body based on the newly added, removed and updated records.
     * The result is used by the batch request.
     *
     * @param {DataManager} dm
     * @param {CrudOptions} changes
     * @param {Object} e
     * @param e.key
     * @param {Query} query
     * @param {Object} original
     */
    public batchRequest(dm: DataManager, changes: CrudOptions, e: {key: string}, query: Query, original?: Object): Object {
        const batch: { data: string } = super.batchRequest.apply(this, arguments);
        // tslint:disable-next-line:typedef
        const bData = JSON.parse(batch.data);
        bData.key = e.key;
        batch.data = JSON.stringify(bData);
        return this.generateCrudData(batch, 'batch');
    }

    private generateCrudData(crudData: { data: string }, action: string): {data: string} {
        const parsed: Object = JSON.parse(crudData.data);
        crudData.data = JSON.stringify({
            query: this.opt.getMutation(action),
            variables: parsed
        });
        return crudData;
    }
}

/**
 * Cache Adaptor is used to cache the data of the visited pages. It prevents new requests for the previously visited pages.
 * You can configure cache page size and duration of caching by using cachingPageSize and timeTillExpiration properties of the DataManager
 *
 * @hidden
 */
export class CacheAdaptor extends UrlAdaptor {
    private cacheAdaptor: CacheAdaptor;
    private pageSize: number;
    private guidId: string;
    private isCrudAction: boolean = false;
    private isInsertAction: boolean = false;

    /**
     * Constructor for CacheAdaptor class.
     *
     * @param {CacheAdaptor} adaptor?
     * @param {number} timeStamp?
     * @param {number} pageSize?
     * @param adaptor
     * @param timeStamp
     * @param pageSize
     * @hidden
     */
    constructor(adaptor?: CacheAdaptor, timeStamp?: number, pageSize?: number) {
        super();
        if (!isNullOrUndefined(adaptor)) {
            this.cacheAdaptor = adaptor;
        }
        this.pageSize = pageSize;
        this.guidId = DataUtil.getGuid('cacheAdaptor');
        const obj: Object = { keys: [], results: [] };
        window.localStorage.setItem(this.guidId, JSON.stringify(obj));
        const guid: string = this.guidId;
        if (!isNullOrUndefined(timeStamp)) {
            setInterval(
                () => {
                    const data: {
                        results: { timeStamp: number }[],
                        keys: string[]
                    } = DataUtil.parse.parseJson(window.localStorage.getItem(guid));
                    const forDel: Object[] = [];
                    for (let i: number = 0; i < data.results.length; i++) {
                        const currentTime: number = +new Date();
                        const requestTime: number = +new Date(data.results[i].timeStamp);
                        data.results[i].timeStamp = currentTime - requestTime;
                        if (currentTime - requestTime > timeStamp) {
                            forDel.push(i);
                        }
                    }
                    for (let i: number = 0; i < forDel.length; i++) {
                        data.results.splice((<number>forDel[i]), 1);
                        data.keys.splice((<number>forDel[i]), 1);
                    }
                    window.localStorage.removeItem(guid);
                    window.localStorage.setItem(guid, JSON.stringify(data));
                },
                timeStamp);
        }
    }

    /**
     * It will generate the key based on the URL when we send a request to server.
     *
     * @param {string} url
     * @param {Query} query?
     * @param query
     * @hidden
     */
    public generateKey(url: string, query: Query): string {
        const queries: Requests = this.getQueryRequest(query);
        const singles: Object = Query.filterQueryLists(query.queries, ['onSelect', 'onPage', 'onSkip', 'onTake', 'onRange']);
        let key: string = url;
        const page: string = 'onPage';
        if (page in singles) {
            key += singles[page].pageIndex;
        }
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
        return key;
    }

    /**
     * Process the query to generate request body.
     * If the data is already cached, it will return the cached data.
     *
     * @param {DataManager} dm
     * @param {Query} query?
     * @param {Object[]} hierarchyFilters?
     * @param query
     * @param hierarchyFilters
     */
    public processQuery(dm: DataManager, query?: Query, hierarchyFilters?: Object[]): Object {
        const key: string = this.generateKey(dm.dataSource.url, query);
        const cachedItems: DataResult = DataUtil.parse.parseJson(window.localStorage.getItem(this.guidId));
        const data: DataResult = cachedItems ? cachedItems.results[cachedItems.keys.indexOf(key)] : null;
        if (data != null && !this.isCrudAction && !this.isInsertAction) {
            return data;
        }
        this.isCrudAction = null; this.isInsertAction = null;
        /* eslint-disable prefer-spread */
        return this.cacheAdaptor.processQuery.apply(this.cacheAdaptor, [].slice.call(arguments, 0));
        /* eslint-enable prefer-spread */
    }

    /**
     * Returns the data from the query processing.
     * It will also cache the data for later usage.
     *
     * @param {DataResult} data
     * @param {DataManager} ds?
     * @param {Query} query?
     * @param {Request} xhr?
     * @param {Fetch} request?
     * @param {CrudOptions} changes?
     * @param ds
     * @param query
     * @param xhr
     * @param request
     * @param changes
     */
    public processResponse(
        data: DataResult, ds?: DataManager, query?: Query, xhr?: Request, request?: Fetch, changes?: CrudOptions): DataResult {
        if (this.isInsertAction || (request && this.cacheAdaptor.options.batch &&
            DataUtil.endsWith(request.url, this.cacheAdaptor.options.batch) && request.type.toLowerCase() === 'post')) {
            return this.cacheAdaptor.processResponse(data, ds, query, xhr, request, changes);
        }
        /* eslint-disable prefer-spread */
        data = this.cacheAdaptor.processResponse.apply(this.cacheAdaptor, [].slice.call(arguments, 0));
        /* eslint-enable prefer-spread */
        const key: string = query ? this.generateKey(ds.dataSource.url, query) : ds.dataSource.url;
        let obj: DataResult = {};
        obj = DataUtil.parse.parseJson(window.localStorage.getItem(this.guidId));
        const index: number = obj.keys.indexOf(key);
        if (index !== -1) {
            (<Object[]>obj.results).splice(index, 1);
            obj.keys.splice(index, 1);
        }
        obj.results[obj.keys.push(key) - 1] = { keys: key, result: data.result, timeStamp: new Date(), count: data.count };
        while ((<Object[]>obj.results).length > this.pageSize) {
            (<Object[]>obj.results).splice(0, 1);
            obj.keys.splice(0, 1);
        }
        window.localStorage.setItem(this.guidId, JSON.stringify(obj));
        return data;
    }

    /**
     * Method will trigger before send the request to server side. Used to set the custom header or modify the request options.
     *
     * @param {DataManager} dm
     * @param {Request} request
     * @param {Fetch} settings?
     * @param settings
     */
    public beforeSend(dm: DataManager, request: Request, settings?: Fetch): void {
        if (!isNullOrUndefined(this.cacheAdaptor.options.batch) && DataUtil.endsWith(settings.url, this.cacheAdaptor.options.batch)
            && settings.type.toLowerCase() === 'post') {
            request.headers.set('Accept', this.cacheAdaptor.options.multipartAccept);
        }

        if (!dm.dataSource.crossDomain) {
            request.headers.set('Accept', this.cacheAdaptor.options.accept);
        }
    }

    /**
     * Updates existing record and saves the changes to the table.
     *
     * @param  {DataManager} dm
     * @param  {string} keyField
     * @param  {Object} value
     * @param  {string} tableName
     */
    public update(dm: DataManager, keyField: string, value: Object, tableName: string): Object {
        this.isCrudAction = true;
        return this.cacheAdaptor.update(dm, keyField, value, tableName);
    }

    /**
     * Prepare and returns request body which is used to insert a new record in the table.
     *
     * @param {DataManager} dm
     * @param {Object} data
     * @param {string} tableName?
     * @param tableName
     */
    public insert(dm: DataManager, data: Object, tableName?: string): Object {
        this.isInsertAction = true;
        return this.cacheAdaptor.insert(dm, data, tableName);
    }

    /**
     * Prepare and return request body which is used to remove record from the table.
     *
     * @param {DataManager} dm
     * @param {string} keyField
     * @param {Object} value
     * @param {string} tableName?
     * @param tableName
     */
    public remove(dm: DataManager, keyField: string, value: Object, tableName?: string): Object[] {
        this.isCrudAction = true;
        return this.cacheAdaptor.remove(dm, keyField, value, tableName);
    }

    /**
     * Prepare the request body based on the newly added, removed and updated records.
     * The result is used by the batch request.
     *
     * @param  {DataManager} dm
     * @param  {CrudOptions} changes
     * @param  {RemoteArgs} e
     */
    public batchRequest(dm: DataManager, changes: CrudOptions, e: RemoteArgs): CrudOptions {
        return this.cacheAdaptor.batchRequest(dm, changes, e);
    }
}

/**
 * @hidden
 */
export interface CrudOptions {
    changedRecords?: Object[];
    addedRecords?: Object[];
    deletedRecords?: Object[];
    changed?: Object[];
    added?: Object[];
    deleted?: Object[];
    action?: string;
    table?: string;
    key?: string;
}

/**
 * @hidden
 */
export interface PvtOptions {
    groups?: QueryOptions[];
    aggregates?: Aggregates[];
    search?: Object | Predicate;
    changeSet?: number;
    searches?: Object[];
    position?: number;
}

/**
 * @hidden
 */
export interface DataResult {
    nodeType?: number;
    addedRecords?: Object[];
    d?: DataResult | Object[];
    Count?: number;
    count?: number;
    result?: Object;
    results?: Object[] | DataResult;
    aggregate?: DataResult;
    aggregates?: Aggregates;
    value?: Object;
    Items?: Object[] | DataResult;
    keys?: string[];
    groupDs?: Object[];
}

/**
 * @hidden
 */
export interface Requests {
    sorts: QueryOptions[];
    groups: QueryOptions[];
    filters: QueryOptions[];
    searches: QueryOptions[];
    aggregates: QueryOptions[];
}

/**
 * @hidden
 */
export interface RemoteArgs {
    guid?: string;
    url?: string;
    key?: string;
    cid?: number;
    cSet?: string;
}

/**
 * @hidden
 */
export interface RemoteOptions {
    from?: string;
    requestType?: string;
    sortBy?: string;
    select?: string;
    skip?: string;
    group?: string;
    take?: string;
    search?: string;
    count?: string;
    where?: string;
    aggregates?: string;
    expand?: string;
    accept?: string;
    multipartAccept?: string;
    batch?: string;
    changeSet?: string;
    batchPre?: string;
    contentId?: string;
    batchContent?: string;
    changeSetContent?: string;
    batchChangeSetContentType?: string;
    updateType?: string;
    localTime?: boolean;
    apply?: string;
    getData?: Function;
    updateRecord?: Function;
    addRecord?: Function;
    deleteRecord?: Function;
    batchUpdate?: Function;
}

/**
 * @hidden
 */
export interface GraphQLAdaptorOptions {
    response: { result: string, count?: string, aggregates?: string};
    query: string;
    getQuery?: () => string;
    getVariables?: Function;
    getMutation?: (action: string) => string;
}

/**
 * @hidden
 */
interface TempOptions {
    pageIndex?: number;
    pageSize?: number;
    fn?: Function;
}

/**
 * @hidden
 */
export interface LazyLoad {
    isLazyLoad: boolean;
    onDemandGroupInfo: OnDemandGroupInfo;
}

/**
 * @hidden
 */
export interface OnDemandGroupInfo {
    level: number;
    skip: number;
    take: number;
    where: Predicate[];
}

/**
 * @hidden
 */
export interface LazyLoadGroupArgs {
    query: Query;
    lazyLoad: LazyLoad;
    result: Object[];
    group: Object[];
    sort: { comparer: (a: Object, b: Object) => number, fieldName: string }[];
    page: { pageIndex: number, pageSize: number };
}

/**
 * @hidden
 */
export type ReturnType = {
    result: Object[],
    count?: number,
    aggregates?: string
};
