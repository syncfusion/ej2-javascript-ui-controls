import { isNullOrUndefined, NumberFormatOptions, DateFormatOptions, extend } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate, Deferred, UrlAdaptor, RemoteSaveAdaptor, AdaptorOptions } from '@syncfusion/ej2-data';
import { IDataProcessor, IGrid, DataStateChangeEventArgs, DataSourceChangedEventArgs, PendingState } from '../base/interface';
import { ReturnType } from '../base/type';
import { SearchSettingsModel, PredicateModel, SortDescriptorModel } from '../base/grid-model';
import { setFormatter, isGroupAdaptive, getColumnByForeignKeyValue, refreshFilteredColsUid } from '../base/util';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import * as events from '../base/constant';
import { ValueFormatter } from '../services/value-formatter';
import { ServiceLocator } from '../services/service-locator';
import { Column, ColumnModel } from '../models/column';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
import { SortDirection } from '../base/enum';
import { Page } from '..';
import { Pager } from '../..';

/**
 * Grid data module is used to generate query and data source.
 *
 * @hidden
 */
export class Data implements IDataProcessor {
    //Internal variables
    public dataManager: DataManager;
    /** @hidden */
    public isQueryInvokedFromData: boolean;

    //Module declarations
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected dataState: PendingState = { isPending: false, resolver: null, group: [] };
    public foreignKeyDataState: PendingState = { isPending: false, resolver: null };

    /**
     * Constructor for data module.
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the service locator
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.initDataManager();
        if (this.parent.isDestroyed || this.getModuleName() === 'foreignKey') { return; }
        this.parent.on(events.rowsAdded, this.addRows, this);
        this.parent.on(events.rowPositionChanged, this.reorderRows, this);
        this.parent.on(events.rowsRemoved, this.removeRows, this);
        this.parent.on(events.dataSourceModified, this.initDataManager, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.updateData, this.crudActions, this);
        this.parent.on(events.addDeleteAction, this.getData, this);
        this.parent.on(events.autoCol, this.refreshFilteredCols, this);
        this.parent.on(events.columnsPrepared, this.refreshFilteredCols, this);
    }

    private reorderRows(e: { fromIndex: number, toIndex: number }): void {
        this.dataManager.dataSource.json.splice(e.toIndex, 0, this.dataManager.dataSource.json.splice(e.fromIndex, 1)[0]);
    }

    protected getModuleName(): string {
        return 'data';
    }

    /**
     * The function used to initialize dataManager and external query
     *
     * @returns {void}
     */
    private initDataManager(): void {
        const gObj: IGrid = this.parent;
        this.dataManager = gObj.dataSource instanceof DataManager ? <DataManager>gObj.dataSource :
            (isNullOrUndefined(gObj.dataSource) ? new DataManager() : new DataManager(gObj.dataSource));
        if ((<{ isAngular?: boolean }>gObj).isAngular && !(gObj.query instanceof Query)) {
            gObj.setProperties({ query: new Query() }, true);
        } else {
            this.isQueryInvokedFromData = true;
            gObj.query = gObj.query instanceof Query ? gObj.query : new Query();
        }
    }

    /**
     * The function is used to generate updated Query from Grid model.
     *
     * @param {boolean} skipPage - specifies the boolean to skip the page
     * @param {boolean} isAutoCompleteCall - specifies for auto complete call
     * @returns {Query} returns the Query
     * @hidden
     */
    public generateQuery(skipPage?: boolean, isAutoCompleteCall?: boolean): Query {
        const gObj: IGrid = this.parent;
        const query: Query = gObj.getQuery().clone();
        if (this.parent.columnQueryMode === 'ExcludeHidden') {
            query.select((<Column[]>this.parent.getColumns()).filter(
                (column: Column) => !(column.isPrimaryKey !== true && column.visible === false || column.field === undefined)
            ).map((column: Column) => column.field));
        } else if (this.parent.columnQueryMode === 'Schema') {
            const selectQueryFields: string[] = [];
            const columns: string[] | Column[] | ColumnModel[] = this.parent.columns;
            for (let i: number = 0; i < columns.length; i++) {
                selectQueryFields.push((columns[parseInt(i.toString(), 10)] as Column).field);
            }
            query.select(selectQueryFields);
        }

        this.filterQuery(query);

        this.searchQuery(query);

        this.aggregateQuery(query);

        this.sortQuery(query);

        if (isGroupAdaptive(this.parent)) {
            this.virtualGroupPageQuery(query);
        } else {
            this.pageQuery(query, skipPage);
        }

        if (isNullOrUndefined(isAutoCompleteCall) || !isAutoCompleteCall) {
            this.groupQuery(query);
        }

        return query;
    }

    /**
     * @param {Query} query - specifies the query
     * @returns {Query} - returns the query
     * @hidden
     */
    public aggregateQuery(query: Query): Query {
        const rows: AggregateRowModel[] = this.parent.aggregates;
        for (let i: number = 0; i < rows.length; i++) {
            const row: AggregateRowModel = rows[parseInt(i.toString(), 10)];
            for (let j: number = 0; j < row.columns.length; j++) {
                const cols: AggregateColumnModel = row.columns[parseInt(j.toString(), 10)];
                const types: string[] = cols.type instanceof Array ? cols.type : [cols.type];
                for (let k: number = 0; k < types.length; k++) {
                    query.aggregate(types[parseInt(k.toString(), 10)].toLowerCase(), cols.field);
                }
            }
        }
        return query;
    }

    protected virtualGroupPageQuery(query: Query): Query {
        const fName: string = 'fn';
        if (query.queries.length) {
            for (let i: number = 0; i < query.queries.length; i++) {
                if (query.queries[parseInt(i.toString(), 10)][`${fName}`] === 'onPage') {
                    query.queries.splice(i, 1);
                }
            }
        }
        return query;
    }

    protected pageQuery(query: Query, skipPage?: boolean): Query {
        const gObj: IGrid = this.parent;
        const fName: string = 'fn';
        const args: { query: Query, skipPage: boolean } = { query: query, skipPage: false };
        gObj.notify(events.setVirtualPageQuery, args);
        if (args.skipPage) { return query; }
        if ((gObj.allowPaging || gObj.enableVirtualization || gObj.enableInfiniteScrolling) && skipPage !== true) {
            gObj.pageSettings.currentPage = Math.max(1, gObj.pageSettings.currentPage);
            if (gObj.pageSettings.pageCount <= 0) {
                gObj.pageSettings.pageCount = 8;
            }
            if (gObj.pageSettings.pageSize <= 0) {
                gObj.pageSettings.pageSize = 12;
            }
            if (query.queries.length) {
                for (let i: number = 0; i < query.queries.length; i++) {
                    if (query.queries[parseInt(i.toString(), 10)][`${fName}`] === 'onPage') {
                        query.queries.splice(i, 1);
                    }
                }
            }
            if (!isNullOrUndefined(gObj.infiniteScrollModule) && gObj.enableInfiniteScrolling) {
                this.parent.notify(events.infinitePageQuery, query);
            } else {
                query.page(gObj.pageSettings.currentPage, gObj.allowPaging && gObj.pagerModule as Page &&
                    ((gObj.pagerModule as Page).pagerObj as Pager).isAllPage && (!this.dataManager.dataSource.offline &&
                        !(this.dataManager.adaptor instanceof RemoteSaveAdaptor)) ? null : gObj.pageSettings.pageSize);
            }
        }
        return query;
    }

    protected groupQuery(query: Query): Query {
        const gObj: IGrid = this.parent;
        if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
            if (this.parent.groupSettings.enableLazyLoading) {
                query.lazyLoad.push({ key: 'isLazyLoad', value: this.parent.groupSettings.enableLazyLoading });
            }
            const columns: string[] = gObj.groupSettings.columns;
            for (let i: number = 0, len: number = columns.length; i < len; i++) {
                const column: Column = this.getColumnByField(columns[parseInt(i.toString(), 10)]);
                if (!column) {
                    this.parent.log('initial_action', { moduleName: 'group', columnName: columns[parseInt(i.toString(), 10)] });
                }
                const isGrpFmt: boolean = column.enableGroupByFormat;
                const format: string | NumberFormatOptions | DateFormatOptions = column.format;
                if (isGrpFmt) {
                    query.group(columns[parseInt(i.toString(), 10)], this.formatGroupColumn.bind(this), format);
                } else {
                    query.group(columns[parseInt(i.toString(), 10)], null);
                }
            }
        }
        return query;
    }

    protected sortQuery(query: Query): Query {
        const gObj: IGrid = this.parent;
        if ((gObj.allowSorting || gObj.allowGrouping) && gObj.sortSettings.columns.length) {
            const columns: SortDescriptorModel[] = gObj.sortSettings.columns;
            const sortGrp: SortDescriptorModel[] = [];
            for (let i: number = columns.length - 1; i > -1; i--) {
                const col: Column = this.getColumnByField(columns[parseInt(i.toString(), 10)].field);
                if (col) {
                    col.setSortDirection(columns[parseInt(i.toString(), 10)].direction);
                } else {
                    this.parent.log('initial_action', { moduleName: 'sort', columnName: columns[parseInt(i.toString(), 10)].field });
                    return query;
                }
                let fn: Function | string = columns[parseInt(i.toString(), 10)].direction;
                if (col.sortComparer) {
                    this.parent.log('grid_sort_comparer');
                    fn = !this.isRemote() ? (col.sortComparer as Function).bind(col) : columns[parseInt(i.toString(), 10)].direction;
                }
                if (gObj.groupSettings.columns.indexOf(columns[parseInt(i.toString(), 10)].field) === -1) {
                    if (col.isForeignColumn() || col.sortComparer) {
                        query.sortByForeignKey(col.field, fn, undefined, columns[parseInt(i.toString(), 10)].direction.toLowerCase());
                    } else {
                        query.sortBy(col.field, fn);
                    }
                } else {
                    sortGrp.push({ direction: <SortDirection>fn, field: col.field });
                }
            }
            for (let i: number = 0, len: number = sortGrp.length; i < len; i++) {
                if (typeof sortGrp[parseInt(i.toString(), 10)].direction === 'string') {
                    query.sortBy(sortGrp[parseInt(i.toString(), 10)].field, sortGrp[parseInt(i.toString(), 10)].direction);
                } else {
                    const col: Column = this.getColumnByField(sortGrp[parseInt(i.toString(), 10)].field);
                    query.sortByForeignKey(sortGrp[parseInt(i.toString(), 10)].field,
                                           sortGrp[parseInt(i.toString(), 10)].direction, undefined, col.getSortDirection().toLowerCase());
                }
            }
        }
        return query;
    }

    protected searchQuery(query: Query, fcolumn?: Column, isForeignKey?: boolean): Query {
        const sSettings: SearchSettingsModel = this.parent.searchSettings;
        let fields: string[] = sSettings.fields.length ? sSettings.fields : this.getSearchColumnFieldNames();
        let predicateList: Predicate[] = [];
        let needForeignKeySearch: boolean = false;
        if (this.parent.searchSettings.key.length) {
            needForeignKeySearch = this.parent.getForeignKeyColumns().some((col: Column) => fields.indexOf(col.field) > -1);
            const adaptor: AdaptorOptions = !isForeignKey ? this.dataManager.adaptor : (fcolumn.dataSource as DataManager).adaptor;
            if (needForeignKeySearch || ((<{ getModuleName?: Function }>adaptor).getModuleName &&
                (<{ getModuleName?: Function }>adaptor).getModuleName() === 'ODataV4Adaptor')) {
                fields = isForeignKey ? [fcolumn.foreignKeyValue] : fields;
                for (let i: number = 0; i < fields.length; i++) {
                    const column: Column = isForeignKey ? fcolumn : this.getColumnByField(fields[parseInt(i.toString(), 10)]);
                    if (column.isForeignColumn() && !isForeignKey) {
                        predicateList = this.fGeneratePredicate(column, predicateList);
                    } else {
                        predicateList.push(new Predicate(
                            fields[parseInt(i.toString(), 10)], sSettings.operator, sSettings.key,
                            sSettings.ignoreCase, sSettings.ignoreAccent
                        ));
                    }
                }
                const predList: Predicate = Predicate.or(predicateList);
                predList.key = sSettings.key;
                query.where(predList);
            } else {
                query.search(sSettings.key, fields, sSettings.operator, sSettings.ignoreCase, sSettings.ignoreAccent);
            }
        }
        return query;
    }

    protected filterQuery(query: Query, column?: PredicateModel[], skipFoerign?: boolean): Query {
        const gObj: IGrid = this.parent;
        let predicateList: Predicate[] = [];
        const actualFilter: PredicateModel[] = [];
        const foreignColumn: Column[] = this.parent.getForeignKeyColumns();
        let foreignColEmpty: boolean;
        if (gObj.allowFiltering && gObj.filterSettings.columns.length) {
            const columns: PredicateModel[] = column ? column : gObj.filterSettings.columns;
            const colType: Object = {};
            for (const col of gObj.getColumns() as Column[]) {
                colType[col.field] = col.filter.type ? col.filter.type : gObj.filterSettings.type;
            }
            const foreignCols: PredicateModel[] = [];
            const defaultFltrCols: PredicateModel[] = [];
            for (const col of columns) {
                const gridColumn: Column = col.isForeignKey ? gObj.getColumnByUid(col.uid) : gObj.getColumnByField(col.field);
                if (isNullOrUndefined(col.type) && gridColumn && (gridColumn.type === 'date' || gridColumn.type === 'datetime' || gridColumn.type === 'dateonly')) {
                    col.type = col.isForeignKey ? gObj.getColumnByUid(col.uid).type : gObj.getColumnByField(col.field).type;
                }
                if (col.isForeignKey) {
                    foreignCols.push(col);
                } else {
                    defaultFltrCols.push(col);
                }
            }
            if (defaultFltrCols.length) {
                for (let i: number = 0, len: number = defaultFltrCols.length; i < len; i++) {
                    defaultFltrCols[parseInt(i.toString(), 10)].uid = defaultFltrCols[parseInt(i.toString(), 10)].uid ||
                        this.parent.grabColumnByFieldFromAllCols(defaultFltrCols[parseInt(i.toString(), 10)].field).uid;
                }
                const excelPredicate: Predicate = CheckBoxFilterBase.getPredicate(defaultFltrCols);
                for (const prop of Object.keys(excelPredicate)) {
                    predicateList.push(<Predicate>excelPredicate[`${prop}`]);
                }
            }
            if (foreignCols.length) {
                for (const col of foreignCols) {
                    col.uid = col.uid || this.parent.grabColumnByFieldFromAllCols(col.field).uid;
                    const column: Column = this.parent.grabColumnByUidFromAllCols(col.uid);
                    if (!column) {
                        this.parent.log('initial_action', { moduleName: 'filter', columnName: col.field });
                    }
                    if (column.isForeignColumn() && getColumnByForeignKeyValue(col.field, foreignColumn) && !skipFoerign) {
                        actualFilter.push(col);
                        if (!column.columnData.length) {
                            foreignColEmpty = true;
                        }
                        predicateList = this.fGeneratePredicate(column, predicateList);
                    } else {
                        const excelPredicate: Predicate = CheckBoxFilterBase.getPredicate(columns);
                        for (const prop of Object.keys(excelPredicate)) {
                            predicateList.push(<Predicate>excelPredicate[`${prop}`]);
                        }
                    }
                }
            }
            if (predicateList.length && !foreignColEmpty) {
                query.where(Predicate.and(predicateList));
            } else {
                this.parent.notify(events.showEmptyGrid, {});
            }
        }
        return query;
    }

    private fGeneratePredicate(col: Column, predicateList: Predicate[]): Predicate[] {
        const fPredicate: { predicate?: Predicate } = {};
        if (col) {
            this.parent.notify(events.generateQuery, { predicate: fPredicate, column: col });
            if (fPredicate.predicate.predicates.length) {
                predicateList.push(fPredicate.predicate);
            }
        }
        return predicateList;
    }

    /**
     * The function is used to get dataManager promise by executing given Query.
     *
     * @param {object} args - specifies the object
     * @param {string} args.requestType - Defines the request type
     * @param {string[]} args.foreignKeyData - Defines the foreignKeyData.string
     * @param {Object} args.data - Defines the data.
     * @param {number} args.index - Defines the index .
     * @param {Query} query - Defines the query which will execute along with data processing.
     * @returns {Promise<Object>} - returns the object
     * @hidden
     */
    public getData(
        args: {
            requestType?: string, foreignKeyData?: string[], data?: Object, index?: number
        } =
        { requestType: '' },
        query?: Query): Promise<Object> {
        const key: string = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ?
            args.foreignKeyData : this.parent.getPrimaryKeyFieldNames());
        this.parent.log('datasource_syntax_mismatch', { dataState: this.parent as IGrid });
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            const def: Deferred = this.eventPromise(args, query, key);
            return def.promise;
        } else {
            let crud: Promise<Object>;
            switch (args.requestType) {
            case 'delete':
                query = query ? query : this.generateQuery();
                // eslint-disable-next-line no-case-declarations
                const len: number = Object.keys(args.data).length;
                if (len === 1) {
                    crud = this.dataManager.remove(key, args.data[0], query.fromTable, query) as Promise<Object>;
                } else {
                    const changes: { addedRecords: Object[], deletedRecords: Object[], changedRecords: Object[] } = {
                        addedRecords: [],
                        deletedRecords: [],
                        changedRecords: []
                    };
                    changes.deletedRecords = <Object[]>args.data;
                    crud = this.dataManager.saveChanges(changes, key, query.fromTable, query.requiresCount()) as Promise<Object>;
                }
                break;
            case 'save':
                query = query ? query : this.generateQuery();
                args.index = isNullOrUndefined(args.index) ? 0 : args.index;
                crud = this.dataManager.insert(args.data, query.fromTable, query, args.index) as Promise<Object>;
                break;
            }
            const promise: string = 'promise';
            args[`${promise}`] = crud;
            // eslint-disable-next-line no-prototype-builtins
            if (crud && !Array.isArray(crud) && !crud.hasOwnProperty('deletedRecords')) {
                return crud.then(() => {
                    return this.insert(query, args);
                });
            } else {
                return this.insert(query, args);
            }
        }
    }

    private insert(query: Query, args: Object): Promise<Object> {
        if ((<{ requestType?: string }>args).requestType === 'save') {
            this.parent.notify(events.recordAdded, args);
        }
        return this.executeQuery(query);
    }

    private executeQuery(query: Query): Promise<Object> {
        if (this.dataManager.ready) {
            const deferred: Deferred = new Deferred();
            const ready: Promise<Object> = this.dataManager.ready;
            ready.then(() => {
                (<Promise<Object>>this.dataManager.executeQuery(query)).then((result: ReturnType) => {
                    deferred.resolve(result);
                });
            }).catch((e: ReturnType) => {
                deferred.reject(e);
            });
            return deferred.promise;
        } else {
            return this.dataManager.executeQuery(query);
        }
    }
    private formatGroupColumn(value: number | Date, field: string): string | object {
        const serviceLocator: ServiceLocator = this.serviceLocator;
        const column: Column = this.getColumnByField(field);
        const date: Date = value as Date;
        if (!column.type) {
            column.type = date.getDay ? (date.getHours() > 0 || date.getMinutes() > 0 ||
                date.getSeconds() > 0 || date.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
        }
        if (isNullOrUndefined(column.getFormatter())) {
            setFormatter(serviceLocator, column);
        }
        const formatVal: string | object = ValueFormatter.prototype.toView(value, column.getFormatter());
        return formatVal;
    }
    private crudActions(args: {
        requestType?: string, foreignKeyData?: string[], data?: Object, previousData?: Object
    }): void {
        const query: Query = this.generateQuery();
        let promise: Promise<Object> = null;
        const pr: string = 'promise';
        const key: string = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ? args.foreignKeyData :
            this.parent.getPrimaryKeyFieldNames());
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            this.eventPromise(args, query, key);
        }
        switch (args.requestType) {
        case 'save':
            promise = this.dataManager.update(key, args.data, query.fromTable, query, args.previousData) as Promise<Object>;
            break;
        }
        args[`${pr}`] = promise ? promise : args[`${pr}`];
        this.parent.notify(events.crudAction, args);
    }

    /**
     * @param {object} changes - specifies the changes
     * @param {string} key - specifies the key
     * @param {object} original - specifies the original data
     * @param {Query} query - specifies the query
     * @returns {Promise<Object>} returns the object
     * @hidden
     */
    public saveChanges(changes: Object, key: string, original: Object, query: Query = this.generateQuery()): Promise<Object> {
        query.requiresCount();
        if ('result' in this.parent.dataSource) {
            const deff: Deferred = new Deferred();
            const args: DataSourceChangedEventArgs = {
                requestType: 'batchsave', changes: changes, key: key, query: query,
                endEdit: deff.resolve
            };
            this.setState({ isPending: true, resolver: deff.resolve });
            this.parent.trigger(events.dataSourceChanged, args);
            return deff.promise;
        } else {
            const promise: Promise<Object> =
                this.dataManager.saveChanges(changes, key, query.fromTable, query, original) as Promise<Object>;
            return promise;
        }
    }

    private getKey(keys: string[]): string {
        if (keys && keys.length) {
            return keys[0];
        }
        return undefined;
    }

    /**
     * @returns {boolean} returns whether its remote data
     * @hidden
     */
    public isRemote(): boolean {
        return this.dataManager.dataSource.offline !== true && this.dataManager.dataSource.url !== undefined &&
            this.dataManager.dataSource.url !== '';
    }

    private addRows(e: { toIndex: number, records: Object[] }): void {
        for (let i: number = e.records.length; i > 0; i--) {
            this.dataManager.dataSource.json.splice(e.toIndex, 0, e.records[i - 1]);
        }
    }

    private removeRows(e: { indexes: number[], records: Object[] }): void {
        const json: Object[] = this.dataManager.dataSource.json;
        this.dataManager.dataSource.json = json.filter((value: Object) => e.records.indexOf(value) === -1);
    }

    private getColumnByField(field: string): Column {
        let col: Column;
        return ((<{ columnModel?: Column[] }>this.parent).columnModel).some((column: Column) => {
            col = column;
            return column.field === field;
        }) && col;
    }

    protected destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.rowsAdded, this.addRows);
        this.parent.off(events.rowsRemoved, this.removeRows);
        this.parent.off(events.dataSourceModified, this.initDataManager);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.updateData, this.crudActions);
        this.parent.off(events.addDeleteAction, this.getData);
        this.parent.off(events.autoCol, this.refreshFilteredCols);
        this.parent.off(events.columnsPrepared, this.refreshFilteredCols);
    }
    public getState(): PendingState {
        return this.dataState;
    }

    public setState(state: PendingState): Object {
        return this.dataState = state;
    }

    public getForeignKeyDataState(): PendingState {
        return this.foreignKeyDataState;
    }

    public setForeignKeyDataState(state: PendingState): void {
        this.foreignKeyDataState = state;
    }

    public getStateEventArgument(query: Query): PendingState {
        const adaptr: UrlAdaptor = new UrlAdaptor();
        const dm: DataManager = new DataManager({ url: '', adaptor: new UrlAdaptor });
        const state: { data?: string, pvtData?: Object[] } = adaptr.processQuery(dm, query);
        const data: Object = JSON.parse(state.data);
        return extend(data, state.pvtData);
    }

    private eventPromise(args: { requestType?: string, foreignKeyData?: string[], data?: Object }, query?: Query, key?: string): Deferred {
        const dataArgs: DataSourceChangedEventArgs = args;
        const state: DataStateChangeEventArgs = this.getStateEventArgument(query);
        const def: Deferred = new Deferred();
        const deff: Deferred = new Deferred();
        if (args.requestType !== undefined && this.dataState.isDataChanged !== false) {
            state.action = <{}>args;
            if (args.requestType === 'save' || args.requestType === 'delete') {
                const editArgs: DataSourceChangedEventArgs = args;
                editArgs.key = key;
                const promise: string = 'promise';
                editArgs[`${promise}`] = deff.promise;
                editArgs.state = state;
                this.setState({ isPending: true, resolver: deff.resolve });
                dataArgs.endEdit = deff.resolve;
                dataArgs.cancelEdit = deff.reject;
                this.parent.trigger(events.dataSourceChanged, editArgs);
                deff.promise.then(() => {
                    this.setState({ isPending: true, resolver: def.resolve, group: state.group, aggregates: state.aggregates });
                    if (editArgs.requestType === 'save') {
                        this.parent.notify(events.recordAdded, editArgs);
                    }
                    this.parent.trigger(events.dataStateChange, state);
                })
                    .catch(() => void 0);
            } else {
                this.setState({ isPending: true, resolver: def.resolve, group: state.group, aggregates: state.aggregates });
                this.parent.trigger(events.dataStateChange, state);
            }
        } else {
            this.setState({});
            def.resolve(this.parent.dataSource);
        }
        return def;
    }

    /**
     * Gets the columns where searching needs to be performed from the Grid.
     *
     * @returns {string[]} returns the searched column field names
     */
    private getSearchColumnFieldNames(): string[] {
        const colFieldNames: string[] = [];
        const columns: Column[] = this.parent.getColumns();
        for (const col of columns) {
            if (col.allowSearching && !isNullOrUndefined(col.field)) {
                colFieldNames.push(col.field);
            }
        }
        return colFieldNames;
    }

    private refreshFilteredCols(): void {
        if (this.parent.allowFiltering && this.parent.filterSettings.columns.length) {
            refreshFilteredColsUid(this.parent, this.parent.filterSettings.columns);
        }
    }
}
