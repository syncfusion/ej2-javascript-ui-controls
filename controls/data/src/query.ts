/* eslint-disable valid-jsdoc */
/* eslint-disable security/detect-object-injection */
import { DataUtil } from './util';
import { DataManager } from './manager';
import { NumberFormatOptions, DateFormatOptions, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Query class is used to build query which is used by the DataManager to communicate with datasource.
 */
export class Query {
    /** @hidden */
    public queries: QueryOptions[];
    /** @hidden */
    public key: string;
    /** @hidden */
    public fKey: string;
    /** @hidden */
    public fromTable: string;
    /** @hidden */
    public lookups: string[];
    /** @hidden */
    public expands: Object[];
    /** @hidden */
    public sortedColumns: Object[];
    /** @hidden */
    public groupedColumns: Object[];
    /** @hidden */
    public subQuerySelector: Function;
    /** @hidden */
    public subQuery: Query = null;
    /** @hidden */
    public isChild: boolean = false;
    /** @hidden */
    public params: ParamOption[];
    /** @hidden */
    public lazyLoad: { key: string, value: object | boolean }[];
    /** @hidden */
    public isCountRequired: boolean;
    /** @hidden */
    public dataManager: DataManager;
    /** @hidden */
    public distincts: string[] = [];
    /** @hidden */
    public get moduleName(): string { return 'query' };

    /**
     * Constructor for Query class.
     *
     * @param {string|string[]} from?
     * @param from
     * @hidden
     */
    constructor(from?: string | string[]) {
        this.queries = [];
        this.key = '';
        this.fKey = '';
        if (typeof from === 'string') {
            this.fromTable = from;
        } else if (from && from instanceof Array) {
            this.lookups = from;
        }
        this.expands = [];
        this.sortedColumns = [];
        this.groupedColumns = [];
        this.subQuery = null;
        this.isChild = false;
        this.params = [];
        this.lazyLoad = [];
        return this;
    }

    /**
     * Sets the primary key.
     *
     * @param  {string} field - Defines the column field.
     */
    public setKey(field: string): Query {
        this.key = field;
        return this;
    }

    /**
     * Sets default DataManager to execute query.
     *
     * @param  {DataManager} dataManager - Defines the DataManager.
     */
    public using(dataManager: DataManager): Query {
        this.dataManager = dataManager;
        return this;
    }

    /**
     * Executes query with the given DataManager.
     *
     * @param  {DataManager} dataManager - Defines the DataManager.
     * @param  {Function} done - Defines the success callback.
     * @param  {Function} fail - Defines the failure callback.
     * @param  {Function} always - Defines the callback which will be invoked on either success or failure.
     *
     * <pre>
     * let dataManager: DataManager = new DataManager([{ ID: '10' }, { ID: '2' }, { ID: '1' }, { ID: '20' }]);
     * let query: Query = new Query();
     * query.sortBy('ID', (x: string, y: string): number => { return parseInt(x, 10) - parseInt(y, 10) });
     * let promise: Promise< Object > = query.execute(dataManager);
     * promise.then((e: { result: Object }) => { });
     * </pre>
     */
    public execute(dataManager?: DataManager, done?: Function, fail?: Function, always?: Function): Promise<Object> {
        dataManager = dataManager || this.dataManager;

        if (dataManager) {
            return dataManager.executeQuery(this, done, fail, always);
        }

        return DataUtil.throwError(
            'Query - execute() : dataManager needs to be is set using "using" function or should be passed as argument'
        );
    }

    /**
     * Executes query with the local datasource.
     *
     * @param  {DataManager} dataManager - Defines the DataManager.
     */
    public executeLocal(dataManager?: DataManager): Object[] {
        dataManager = dataManager || this.dataManager;

        if (dataManager) {
            return dataManager.executeLocal(this);
        }

        return DataUtil.throwError(
            'Query - executeLocal() : dataManager needs to be is set using "using" function or should be passed as argument'
        );
    }

    /**
     * Creates deep copy of the Query object.
     */
    public clone(): Query {
        const cloned: Query = new Query();
        cloned.queries = this.queries.slice(0);
        cloned.key = this.key;
        cloned.isChild = this.isChild;
        cloned.dataManager = this.dataManager;
        cloned.fromTable = this.fromTable;
        cloned.params = this.params.slice(0);
        cloned.expands = this.expands.slice(0);
        cloned.sortedColumns = this.sortedColumns.slice(0);
        cloned.groupedColumns = this.groupedColumns.slice(0);
        cloned.subQuerySelector = this.subQuerySelector;
        cloned.subQuery = this.subQuery;
        cloned.fKey = this.fKey;
        cloned.isCountRequired = this.isCountRequired;
        cloned.distincts = this.distincts.slice(0);
        cloned.lazyLoad = this.lazyLoad.slice(0);
        return cloned;
    }

    /**
     * Specifies the name of table to retrieve data in query execution.
     *
     * @param  {string} tableName - Defines the table name.
     */
    public from(tableName: string): Query {
        this.fromTable = tableName;
        return this;
    }

    /**
     * Adds additional parameter which will be sent along with the request which will be generated while DataManager execute.
     *
     * @param  {string} key - Defines the key of additional parameter.
     * @param  {Function|string} value - Defines the value for the key.
     */
    public addParams(key: string, value: Function | string | null   ): Query {
        if (typeof value === 'function') {
            this.params.push({ key: key, fn: value });
        } else {
            this.params.push({ key: key, value: value });
        }
        return this;
    }

    /**
     * @param fields
     * @hidden
     */
    public distinct(fields: string | string[]): Query {
        if (typeof fields === 'string') {
            this.distincts = [].slice.call([fields], 0);
        } else {
            this.distincts = fields.slice(0);
        }
        return this;
    }

    /**
     * Expands the related table.
     *
     * @param  {string|Object[]} tables
     */
    public expand(tables: string | Object[]): Query {
        if (typeof tables === 'string') {
            this.expands = [].slice.call([tables], 0);
        } else {
            this.expands = tables.slice(0);
        }
        return this;
    }

    /**
     * Filter data with given filter criteria.
     *
     * @param {string|Predicate} fieldName - Defines the column field or Predicate.
     * @param {string} operator - Defines the operator how to filter data.
     * @param {string|number|boolean} value - Defines the values to match with data.
     * @param {boolean} ignoreCase - If ignore case set to false, then filter data with exact match or else
     * filter data with case insensitive.
     * @param ignoreAccent
     * @param matchCase
     */
    public where(
        fieldName: string | Predicate | Predicate[], operator?: string,
        value?: string | Date | number | boolean | null, ignoreCase?: boolean, ignoreAccent?: boolean, matchCase?: boolean): Query {

        operator = operator ? (operator).toLowerCase() : null;
        let predicate: Predicate | QueryOptions = null;
        if (typeof fieldName === 'string') {
            predicate = new Predicate(fieldName, operator, value, ignoreCase, ignoreAccent, matchCase);
        } else if (fieldName instanceof Predicate) {
            predicate = fieldName;
        }
        this.queries.push({
            fn: 'onWhere',
            e: <QueryOptions>predicate
        });
        return this;
    }

    /**
     * Search data with given search criteria.
     *
     * @param {string|number|boolean} searchKey - Defines the search key.
     * @param {string|string[]} fieldNames - Defines the collection of column fields.
     * @param {string} operator - Defines the operator how to search data.
     * @param {boolean} ignoreCase - If ignore case set to false, then filter data with exact match or else
     * filter data with case insensitive.
     * @param ignoreAccent
     */
    public search(
        searchKey: string | number | boolean, fieldNames?: string | string[], operator?: string, ignoreCase?: boolean,
        ignoreAccent?: boolean): Query {
        if (typeof fieldNames === 'string') {
            fieldNames = [(fieldNames as string)];
        }
        if (!operator || operator === 'none') {
            operator = 'contains';
        }
        const comparer: Function = (<{ [key: string]: Function }>DataUtil.fnOperators)[operator];
        this.queries.push({
            fn: 'onSearch',
            e: {
                fieldNames: fieldNames,
                operator: operator,
                searchKey: searchKey,
                ignoreCase: ignoreCase,
                ignoreAccent: ignoreAccent,
                comparer: comparer
            }
        });
        return this;
    }

    /**
     * Sort the data with given sort criteria.
     * By default, sort direction is ascending.
     *
     * @param {string|string[]} fieldName - Defines the single or collection of column fields.
     * @param {string|Function} comparer - Defines the sort direction or custom sort comparer function.
     * @param isFromGroup
     */
    public sortBy(fieldName: string | string[], comparer?: string | Function, isFromGroup?: boolean): Query {
        return this.sortByForeignKey(fieldName, comparer, isFromGroup);
    }

    /**
     * Sort the data with given sort criteria.
     * By default, sort direction is ascending.
     *
     * @param {string|string[]} fieldName - Defines the single or collection of column fields.
     * @param {string|Function} comparer - Defines the sort direction or custom sort comparer function.
     * @param isFromGroup
     * @param {string} direction - Defines the sort direction .
     */
    public sortByForeignKey(fieldName: string | string[], comparer?: string | Function, isFromGroup?: boolean, direction?: string): Query {
        let order: string = !isNullOrUndefined(direction) ? direction : 'ascending';
        let sorts: Object[];
        let temp: string | string[];

        if (typeof fieldName === 'string' && DataUtil.endsWith((fieldName as string).toLowerCase(), ' desc')) {
            fieldName = (fieldName as string).replace(/ desc$/i, '');
            comparer = 'descending';
        }

        if (!comparer || typeof comparer === 'string') {
            order = comparer ? (<string>comparer).toLowerCase() : 'ascending';
            comparer = DataUtil.fnSort(<string>comparer);
        }

        if (isFromGroup) {
            sorts = Query.filterQueries(this.queries, 'onSortBy');

            for (let i: number = 0; i < sorts.length; i++) {
                temp = (<QueryOptions>sorts[i]).e.fieldName;
                if (typeof temp === 'string') {
                    if (temp === fieldName) { return this; }
                } else if (<string[]>temp instanceof Array) {
                    for (let j: number = 0; j < (temp as string[]).length; j++) {
                        if (temp[j] === fieldName || (fieldName as string).toLowerCase() === temp[j] + ' desc') {
                            return this;
                        }
                    }
                }
            }
        }

        this.queries.push({
            fn: 'onSortBy',
            e: {
                fieldName: (<string>fieldName),
                comparer: comparer,
                direction: order
            }
        });

        return this;
    }

    /**
     * Sorts data in descending order.
     *
     * @param  {string} fieldName - Defines the column field.
     */
    public sortByDesc(fieldName: string): Query {
        return this.sortBy(fieldName, 'descending');
    }

    /**
     * Groups data with the given field name.
     *
     * @param {string} fieldName - Defines the column field.
     * @param fn
     * @param format
     */
    public group(fieldName: string, fn?: Function, format?: string | NumberFormatOptions | DateFormatOptions): Query {
        this.sortBy(fieldName, null, true);
        this.queries.push({
            fn: 'onGroup',
            e: {
                fieldName: fieldName,
                comparer: fn ? fn : null,
                format: format ? format : null
            }
        });
        return this;
    }

    /**
     * Gets data based on the given page index and size.
     *
     * @param  {number} pageIndex - Defines the current page index.
     * @param  {number} pageSize - Defines the no of records per page.
     */
    public page(pageIndex: number, pageSize: number): Query {
        this.queries.push({
            fn: 'onPage',
            e: {
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        });
        return this;
    }

    /**
     * Gets data based on the given start and end index.
     *
     * @param  {number} start - Defines the start index of the datasource.
     * @param  {number} end - Defines the end index of the datasource.
     */
    public range(start: number, end: number): Query {
        this.queries.push({
            fn: 'onRange',
            e: {
                start: start,
                end: end
            }
        });
        return this;
    }

    /**
     * Gets data from the top of the data source based on given number of records count.
     *
     * @param  {number} nos - Defines the no of records to retrieve from datasource.
     */
    public take(nos: number): Query {
        this.queries.push({
            fn: 'onTake',
            e: {
                nos: nos
            }
        });
        return this;
    }

    /**
     * Skips data with given number of records count from the top of the data source.
     *
     * @param  {number} nos - Defines the no of records skip in the datasource.
     */
    public skip(nos: number): Query {
        this.queries.push({
            fn: 'onSkip',
            e: { nos: nos }
        });
        return this;
    }

    /**
     * Selects specified columns from the data source.
     *
     * @param  {string|string[]} fieldNames - Defines the collection of column fields.
     */
    public select(fieldNames: string | string[]): Query {
        if (typeof fieldNames === 'string') {
            fieldNames = [].slice.call([fieldNames], 0);
        }
        this.queries.push({
            fn: 'onSelect',
            e: { fieldNames: fieldNames }
        });
        return this;
    }

    /**
     * Gets the records in hierarchical relationship from two tables. It requires the foreign key to relate two tables.
     *
     * @param  {Query} query - Defines the query to relate two tables.
     * @param  {Function} selectorFn - Defines the custom function to select records.
     */
    public hierarchy(query: Query, selectorFn: Function): Query {
        this.subQuerySelector = selectorFn;
        this.subQuery = query;
        return this;
    }

    /**
     * Sets the foreign key which is used to get data from the related table.
     *
     * @param  {string} key - Defines the foreign key.
     */
    public foreignKey(key: string): Query {
        this.fKey = key;
        return this;
    }

    /**
     * It is used to get total number of records in the DataManager execution result.
     */
    public requiresCount(): Query {
        this.isCountRequired = true;
        return this;
    }

    //type - sum, avg, min, max
    /**
     * Aggregate the data with given type and field name.
     *
     * @param  {string} type - Defines the aggregate type.
     * @param  {string} field - Defines the column field to aggregate.
     */
    public aggregate(type: string, field: string): Query {
        this.queries.push({
            fn: 'onAggregates',
            e: { field: field, type: type }
        });
        return this;
    }

    /**
     * Pass array of filterColumn query for performing filter operation.
     *
     * @param  {QueryOptions[]} queries
     * @param  {string} name
     * @hidden
     */
    public static filterQueries(queries: QueryOptions[], name: string): QueryOptions[] {
        return queries.filter((q: QueryOptions): boolean => {
            return q.fn === name;
        });
    }
    /**
     * To get the list of queries which is already filtered in current data source.
     *
     * @param  {Object[]} queries
     * @param  {string[]} singles
     * @hidden
     */
    public static filterQueryLists(queries: Object[], singles: string[]): Object {
        const filtered: QueryOptions[] = queries.filter((q: QueryOptions) => {
            return singles.indexOf(q.fn) !== -1;
        });
        const res: { [key: string]: Object } = {};
        for (let i: number = 0; i < filtered.length; i++) {
            if (!res[filtered[i].fn]) {
                res[filtered[i].fn] = filtered[i].e;
            }
        }
        return res;
    }
}

/**
 * Predicate class is used to generate complex filter criteria.
 * This will be used by DataManager to perform multiple filtering operation.
 */
export class Predicate {
    /** @hidden */
    public field: string;
    /** @hidden */
    public operator: string;
    /** @hidden */
    public value: string | number | Date | boolean | Predicate | Predicate[] | (string | number | boolean | Date)[] | null;
    /** @hidden */
    public condition: string;
    /** @hidden */
    public ignoreCase: boolean;
    /** @hidden */
    public matchCase: boolean;
    /** @hidden */
    public ignoreAccent: boolean = false;
    /** @hidden */
    public isComplex: boolean = false;
    /** @hidden */
    public predicates: Predicate[];
    /** @hidden */
    public comparer: Function;
    [x: string]: string | number | Date | boolean | Predicate | Predicate[] | Function | (string | number | boolean | Date)[] | null;

    /**
     * Constructor for Predicate class.
     *
     * @param {string|Predicate} field
     * @param {string} operator
     * @param {string | number | Date | boolean | Predicate | Predicate[] | (string | number | boolean | Date)[] | null} value
     * @param {boolean=false} ignoreCase
     * @param ignoreAccent
     * @param {boolean} matchCase
     * @hidden
     */
    constructor(
        field: string | Predicate, operator: string, value: string | number | Date | boolean | Predicate | Predicate[] | (string | number | boolean | Date)[] | null,
        ignoreCase: boolean = false, ignoreAccent?: boolean, matchCase?: boolean) {
        if (typeof field === 'string') {
            this.field = field;
            this.operator = operator.toLowerCase();
            this.value = value;
            this.matchCase = matchCase;
            this.ignoreCase = ignoreCase;
            this.ignoreAccent = ignoreAccent;
            this.isComplex = false;
            this.comparer = DataUtil.fnOperators.processOperator(this.operator);
        } else if (field instanceof Predicate && value instanceof Predicate || value instanceof Array) {
            this.isComplex = true;
            this.condition = operator.toLowerCase();
            this.predicates = [field];
            this.matchCase = field.matchCase;
            this.ignoreCase = field.ignoreCase;
            this.ignoreAccent = field.ignoreAccent;
            if (value instanceof Array) {
                [].push.apply(this.predicates, value);
            } else {
                this.predicates.push(value);
            }
        }
        return this;
    }

    /**
     * Adds n-number of new predicates on existing predicate with “and” condition.
     *
     * @param  {Object[]} args - Defines the collection of predicates.
     */
    public static and(...args: Object[]): Predicate {
        return Predicate.combinePredicates([].slice.call(args, 0), 'and');
    }

    /**
     * Adds new predicate on existing predicate with “and” condition.
     *
     * @param {string} field - Defines the column field.
     * @param {string} operator - Defines the operator how to filter data.
     * @param {string} value - Defines the values to match with data.
     * @param {boolean} ignoreCase? - If ignore case set to false, then filter data with exact match or else
     * filter data with case insensitive.
     * @param ignoreCase
     * @param ignoreAccent
     */
    public and(
        field: string | Predicate, operator?: string, value?: string | number | Date | boolean | null,
        ignoreCase?: boolean, ignoreAccent?: boolean): Predicate {
        return Predicate.combine(this, field, operator, value, 'and', ignoreCase, ignoreAccent);
    }

    /**
     * Adds n-number of new predicates on existing predicate with “or” condition.
     *
     * @param  {Object[]} args - Defines the collection of predicates.
     */
    public static or(...args: Object[]): Predicate {
        return Predicate.combinePredicates([].slice.call(args, 0), 'or');
    }

    /**
     * Adds new predicate on existing predicate with “or” condition.
     *
     * @param {string} field - Defines the column field.
     * @param {string} operator - Defines the operator how to filter data.
     * @param {string} value - Defines the values to match with data.
     * @param {boolean} ignoreCase? - If ignore case set to false, then filter data with exact match or else
     * filter data with case insensitive.
     * @param ignoreCase
     * @param ignoreAccent
     */
    public or(
        field: string | Predicate, operator?: string, value?: string | number | Date | boolean | null, ignoreCase?: boolean,
        ignoreAccent?: boolean): Predicate {
        return Predicate.combine(this, field, operator, value, 'or', ignoreCase, ignoreAccent);
    }

    /**
     * Adds n-number of new predicates on existing predicate with “and not” condition.
     *
     * @param  {Object[]} args - Defines the collection of predicates.
     */
    public static ornot(...args: Object[]): Predicate {
        return Predicate.combinePredicates([].slice.call(args, 0), 'or not');
    }

    /**
     * Adds new predicate on existing predicate with “and not” condition.
     *
     * @param {string} field - Defines the column field.
     * @param {string} operator - Defines the operator how to filter data.
     * @param {string} value - Defines the values to match with data.
     * @param {boolean} ignoreCase? - If ignore case set to false, then filter data with exact match or else
     * filter data with case insensitive.
     * @param ignoreCase
     * @param ignoreAccent
     */
    public ornot(
        field: string | Predicate, operator?: string, value?: string | number | Date | boolean | null, ignoreCase?: boolean,
        ignoreAccent?: boolean): Predicate {
        return Predicate.combine(this, field, operator, value, 'ornot', ignoreCase, ignoreAccent);
    }

    /**
     * Adds n-number of new predicates on existing predicate with “and not” condition.
     *
     * @param  {Object[]} args - Defines the collection of predicates.
     */
    public static andnot(...args: Object[]): Predicate {
        return Predicate.combinePredicates([].slice.call(args, 0), 'and not');
    }

    /**
     * Adds new predicate on existing predicate with “and not” condition.
     *
     * @param {string} field - Defines the column field.
     * @param {string} operator - Defines the operator how to filter data.
     * @param {string} value - Defines the values to match with data.
     * @param {boolean} ignoreCase? - If ignore case set to false, then filter data with exact match or else
     * filter data with case insensitive.
     * @param ignoreCase
     * @param ignoreAccent
     */
    public andnot(
        field: string | Predicate, operator?: string, value?: string | number | Date | boolean | null, ignoreCase?: boolean,
        ignoreAccent?: boolean): Predicate {
        return Predicate.combine(this, field, operator, value, 'andnot', ignoreCase, ignoreAccent);
    }

    /**
     * Converts plain JavaScript object to Predicate object.
     *
     * @param  {Predicate[]|Predicate} json - Defines single or collection of Predicate.
     */
    public static fromJson(json: Predicate[] | Predicate): Predicate[] {
        if (json instanceof Array) {
            const res: Predicate[] = [];
            for (let i: number = 0, len: number = json.length; i < len; i++) {
                res.push(this.fromJSONData(json[i]));
            }
            return res;
        }
        const pred: Predicate = <Predicate>json;
        return <Predicate[] & Predicate>this.fromJSONData(pred);
    }

    /**
     * Validate the record based on the predicates.
     *
     * @param  {Object} record - Defines the datasource record.
     */
    public validate(record: Object): boolean {
        const predicate: Predicate[] = this.predicates ? this.predicates : [];
        let ret: boolean;
        let isAnd: boolean;

        if (!this.isComplex && this.comparer) {
            if (this.condition && this.condition.indexOf('not') !== -1) {
                this.condition = this.condition.split('not')[0] === '' ? undefined : this.condition.split('not')[0];
                return !this.comparer.call(this, DataUtil.getObject(this.field, record), this.value, this.ignoreCase, this.ignoreAccent);
            }
            else {
                return this.comparer.call(this, DataUtil.getObject(this.field, record), this.value, this.ignoreCase, this.ignoreAccent);
            }
        }
        if (this.condition && this.condition.indexOf('not') !== -1) {
            isAnd = this.condition.indexOf('and') !== -1;
        }
        else {
            isAnd = this.condition === 'and';
        }

        for (let i: number = 0; i < predicate.length; i++) {
            if (i > 0 && this.condition && this.condition.indexOf('not') !== -1) {
                predicate[i].condition = predicate[i].condition ? predicate[i].condition + 'not' : 'not';
            }
            ret = predicate[i].validate(record);
            if (isAnd) {
                if (!ret) { return false; }
            } else {
                if (ret) { return true; }
            }
        }
        return isAnd;
    }

    /**
     * Converts predicates to plain JavaScript.
     * This method is uses Json stringify when serializing Predicate object.
     */
    public toJson(): Object {
        let predicates: Object[];
        let p: Predicate[];
        if (this.isComplex) {
            predicates = [];
            p = this.predicates;
            for (let i: number = 0; i < p.length; i++) {
                predicates.push(p[i].toJson());
            }
        }
        return {
            isComplex: this.isComplex,
            field: this.field,
            operator: this.operator,
            value: this.value,
            ignoreCase: this.ignoreCase,
            ignoreAccent: this.ignoreAccent,
            condition: this.condition,
            predicates: predicates,
            matchCase: this.matchCase
        };
    }

    private static combinePredicates(predicates: Predicate[] | Predicate[][], operator: string): Predicate {
        if (predicates.length === 1) {
            if (!(predicates[0] instanceof Array)) {
                return predicates[0] as Predicate;
            }
            predicates = predicates[0] as Predicate[];
        }
        return new Predicate(predicates[0] as Predicate, operator, (predicates as Predicate[]).slice(1));
    }

    private static combine(
        pred: Predicate, field: string | Predicate, operator: string, value: string | number | Date | boolean | null,
        condition: string, ignoreCase?: boolean, ignoreAccent?: boolean): Predicate {
        if (field instanceof Predicate) {
            return Predicate[condition](pred, field);
        }
        if (typeof field === 'string') {
            return Predicate[condition](pred, new Predicate(field, operator, value, ignoreCase, ignoreAccent));
        }
        return DataUtil.throwError('Predicate - ' + condition + ' : invalid arguments');
    }
    private static fromJSONData(json: Predicate): Predicate {
        const preds: Predicate[] = json.predicates || [];
        const len: number = preds.length;
        const predicates: Predicate[] = [];
        let result: Predicate;

        for (let i: number = 0; i < len; i++) {
            predicates.push(this.fromJSONData(preds[i]));
        }
        if (!json.isComplex) {
            result = new Predicate(json.field, json.operator, json.value, json.ignoreCase, json.ignoreAccent);
        } else {
            result = new Predicate(predicates[0], json.condition, predicates.slice(1));
        }

        return result;
    }
}
/**
 * @hidden
 */
export interface QueryOptions {
    fn?: string;
    e?: QueryOptions;
    fieldNames?: string | string[];
    operator?: string;
    searchKey?: string | number | boolean;
    ignoreCase?: boolean;
    ignoreAccent?: boolean;
    comparer?: string | Function;
    format?: string| NumberFormatOptions | DateFormatOptions;
    direction?: string;
    pageIndex?: number;
    pageSize?: number;
    start?: number;
    end?: number;
    nos?: number;
    field?: string;
    fieldName?: string;
    type?: Object;
    name?: string | string[];
    filter?: Object;
    key?: string;
    value?: string | number | Date | boolean | Predicate | Predicate[] | (string | number | boolean | Date)[];
    isComplex?: boolean;
    predicates?: Predicate[];
    condition?: string;
}
/**
 * @hidden
 */
export interface QueryList {
    onSelect?: QueryOptions;
    onPage?: QueryOptions;
    onSkip?: QueryOptions;
    onTake?: QueryOptions;
    onRange?: QueryOptions;
}
/**
 * @hidden
 */
export interface ParamOption {
    key: string;
    value?: string | null;
    fn?: Function;
}
