import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, Query, Deferred, Predicate, DataUtil } from '@syncfusion/ej2-data';
import { IGrid } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';
import { PredicateModel, SearchSettingsModel } from '../base/grid-model';
import { ReturnType } from '../base/type';
import { initForeignKeyColumn, getForeignKeyData, generateQuery } from '../base/constant';
import { getDatePredicate } from '../base/util';
import { Data } from './data';

/**
 * `ForeignKey` module is used to handle foreign key column's actions.
 */

export class ForeignKey extends Data {

    constructor(parent: IGrid, serviceLocator: ServiceLocator) {
        super(parent, serviceLocator);
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.initEvent();
    }

    private initEvent(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(initForeignKeyColumn, this.initForeignKeyColumns, this);
        this.parent.on(getForeignKeyData, this.getForeignKeyData, this);
        this.parent.on(generateQuery, this.generateQueryFormData, this);
    }

    private initForeignKeyColumns(columns: Column[]): void {
        columns.forEach((column: Column) => {
            column.dataSource = (column.dataSource instanceof DataManager ? <DataManager>column.dataSource :
                (isNullOrUndefined(column.dataSource) ? new DataManager() : new DataManager(column.dataSource)));
        });
    }

    private getForeignKeyData(args: {
        data: Promise<Object>, result: ReturnType, promise: Deferred, isComplex?: boolean,
        column?: Column
    }): void {
        let foreignColumns: Column[] = args.column ? [args.column] : this.parent.getForeignKeyColumns();
        let allPromise: Promise<Object>[] = [];
        foreignColumns.forEach((col: Column) => {
            let promise: Promise<Object>;
            let query: Query = args.isComplex ? this.genarateColumnQuery(col) :
                <Query>this.genarateQuery(col, <{ records?: Object[] }>args.result.result, false, true);
            let dataSource: DataManager = <DataManager>col.dataSource;
            if (!dataSource.ready || dataSource.dataSource.offline) {
                promise = dataSource.executeQuery(query);
            } else {
                promise = dataSource.ready.then(() => {
                    return dataSource.executeQuery(query);
                });
            }
            allPromise.push(promise);
        });
        <Promise<Object>>Promise.all(allPromise).then((responses: ReturnType[]) => {
            responses.forEach((data: ReturnType, index: number) => {
                foreignColumns[index].columnData = data.result;
            });
            args.promise.resolve(args.result);
        }).catch((e: Object) => {
            if (args.promise && args.promise.reject) {
                args.promise.reject(e);
            }
            return e;
        });
    }

    private generateQueryFormData(args: { column: Column, predicate: { predicate?: Predicate } }): void {
        args.predicate.predicate = <Predicate>this.genarateQuery(args.column, <{ records?: Object[] }>args.column.columnData, true);
    }

    private genarateQuery(column: Column, e?: { records?: Object[] }, fromData?: boolean, needQuery?: boolean): Predicate | Query {
        let gObj: IGrid = this.parent;
        let predicates: Predicate[] = [];
        let predicate: Predicate;
        let query: Query = new Query();
        let field: string = fromData ? column.foreignKeyField : column.field;
        if (gObj.allowPaging || gObj.enableVirtualization || fromData) {
            e = <{ records?: Object[] }>new DataManager(((gObj.allowGrouping && gObj.groupSettings.columns.length && !fromData) ?
                e.records : e) as JSON[]).executeLocal(new Query().select(field));
            let filteredValue: Object[] = DataUtil.distinct(<Object[]>e, field, false);
            field = fromData ? column.field : column.foreignKeyField;
            filteredValue.forEach((obj: Object) => {
                if (obj && (<Date>obj).getDay) {
                    predicates.push(getDatePredicate
                        ({ field: field, operator: 'equal', value: <string>obj, matchCase: false }));
                } else {
                    predicates.push(new Predicate(field, 'equal', <string>obj, false));
                }
            });
        }
        if (needQuery) {
            return predicates.length ? query.where(Predicate.or(predicates)) : query;
        }
        predicate = (predicates.length ? Predicate.or(predicates) : { predicates: [] }) as Predicate;
        return predicate;
    }

    private genarateColumnQuery(column: Column): Query {
        let gObj: IGrid = this.parent;
        let query: Query = new Query();
        let predicate: PredicateModel[] = [];
        let queryColumn: { column: PredicateModel[], isTrue: boolean } = this.isFiltered(column);
        if (queryColumn.isTrue) {
            query = this.filterQuery(query, <PredicateModel[]>queryColumn.column, true);
        }

        if (gObj.searchSettings.key.length) {
            let sSettings: SearchSettingsModel = gObj.searchSettings;
            query.search(sSettings.key, column.foreignKeyValue, sSettings.operator, sSettings.ignoreCase);
        }

        return query;
    }

    private isFiltered(column: Column): { column: PredicateModel[], isTrue: boolean } {
        let filterColumn: PredicateModel[] = this.parent.filterSettings.columns.filter((fColumn: PredicateModel) => {
            return (fColumn.field === column.foreignKeyValue);
        });
        return {
            column: filterColumn, isTrue: !!filterColumn.length
        };
    }

    protected getModuleName(): string {
        return 'foreignKey';
    }

    protected destroy(): void {
        this.destroyEvent();
    }

    private destroyEvent(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(initForeignKeyColumn, this.initForeignKeyColumns);
        this.parent.off(getForeignKeyData, this.getForeignKeyData);
        this.parent.off(generateQuery, this.generateQueryFormData);
    }
}
