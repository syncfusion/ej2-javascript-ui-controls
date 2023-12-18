import { TreeGrid } from '../base/treegrid';
import { QueryOptions, Query, DataManager } from '@syncfusion/ej2-data';
import { getObject, AggregateType, calculateAggregate, Aggregate as GridAggregate, Grid, appendChildren } from '@syncfusion/ej2-grids';
import { ITreeData } from '../base';
import { findParentRecords } from '../utils';
import { isNullOrUndefined, setValue, NumberFormatOptions, DateFormatOptions, createElement, extend } from '@syncfusion/ej2-base';
import { AggregateColumn } from '../models/summary';
import { AggregateRowModel } from '../models/summary-model';
import { Column } from '../models';
import * as events from '../base/constant';


/**
 * TreeGrid Aggregate module
 *
 * @hidden
 */
export class Aggregate {
    private parent: TreeGrid;
    private flatChildRecords: Object[];
    private summaryQuery: QueryOptions[];
    /**
     * Constructor for Aggregate module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridAggregate);
        this.parent = parent;
        this.flatChildRecords = [];
        this.summaryQuery = [];
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Summary module name
     */
    private getModuleName(): string {
        return 'summary';
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
    }

    /**
     * Function to calculate summary values
     *
     * @param {QueryOptions[]} summaryQuery - DataManager query for aggregate operations
     * @param {Object[]} filteredData - Filtered data collection
     * @param {boolean} isSort - Specified whether sorting operation performed
     * @hidden
     * @returns {Object[]} -  return flat records with summary values
     */
    public calculateSummaryValue(summaryQuery: QueryOptions[], filteredData: Object[], isSort: boolean): Object[] {
        this.summaryQuery = summaryQuery;
        let parentRecord: ITreeData;
        const parentDataLength: number = Object.keys(filteredData).length;
        const parentData: Object[] = [];
        for (let p: number = 0, len: number = parentDataLength; p < len; p++) {
            const summaryRow: boolean = getObject('isSummaryRow', filteredData[parseInt(p.toString(), 10)]);
            if (!summaryRow) {
                parentData.push(filteredData[parseInt(p.toString(), 10)]);
            }
        }
        const parentRecords: Object = findParentRecords(parentData);
        const flatRecords: Object[] = (<Object[]>parentData).slice();
        const summaryLength: number = Object.keys(this.parent.aggregates).length;
        const dataLength: number = Object.keys(parentRecords).length; let childRecordsLength: number;
        const columns: Column[] = this.parent.getColumns();
        if (this.parent.aggregates.filter((x: AggregateRowModel) => x.showChildSummary).length) {
            for (let i: number = 0, len: number = dataLength; i < len; i++) {
                parentRecord = parentRecords[parseInt(i.toString(), 10)];
                childRecordsLength = this.getChildRecordsLength(parentRecord, flatRecords);
                if (childRecordsLength) {
                    for (let summaryRowIndex: number = 1, len: number = summaryLength; summaryRowIndex <= len; summaryRowIndex++) {
                        let item: Object; item = {};
                        for (let i: number = 0; i < columns.length; i++) {
                            const  field: string = (isNullOrUndefined(getObject('field', columns[parseInt(i.toString(), 10)]))) ?
                                columns[parseInt(i.toString(), 10)] : getObject('field', (columns[parseInt(i.toString(), 10)]));
                            item[`${field}`] = null;
                        }
                        item = this.createSummaryItem(item,  this.parent.aggregates[summaryRowIndex - 1]);
                        if (this.parent.aggregates[summaryRowIndex - 1].showChildSummary) {
                            let idx: number;
                            flatRecords.map((e: ITreeData, i: number) => {
                                if (e.uniqueID === parentRecord.uniqueID) { idx = i; return; } });
                            const currentIndex: number = idx + childRecordsLength + summaryRowIndex;
                            const summaryParent: ITreeData = extend({}, parentRecord);
                            delete summaryParent.childRecords;
                            delete summaryParent[this.parent.childMapping];
                            setValue('parentItem', summaryParent, item);
                            const level: number = getObject('level', summaryParent);
                            setValue('level', level + 1, item);
                            setValue('isSummaryRow', true, item);
                            setValue('parentUniqueID', summaryParent.uniqueID, item);
                            if (isSort) {
                                const childRecords: Object[] = getObject('childRecords', parentRecord);
                                if (childRecords.length) {
                                    childRecords.push(item);
                                }
                            }
                            flatRecords.splice(currentIndex, 0, item);
                        } else {
                            continue;
                        }
                    }
                    this.flatChildRecords = [];
                }
            }
        } else {
            const items: Object = {};
            for (let columnIndex: number = 0, length: number = columns.length; columnIndex < length; columnIndex++) {
                const fields: string = isNullOrUndefined(getObject('field', columns[parseInt(columnIndex.toString(), 10)])) ?
                    columns[parseInt(columnIndex.toString(), 10)] : getObject('field', columns[parseInt(columnIndex.toString(), 10)]);
                items[`${fields}`] = null;
            }
            for (let summaryRowIndex: number = 1, length: number = summaryLength; summaryRowIndex <= length; summaryRowIndex++) {
                this.createSummaryItem(items,  this.parent.aggregates[summaryRowIndex - 1]);
            }
        }
        return flatRecords;
    }

    private getChildRecordsLength(parentData: ITreeData, flatData: Object[]): number {
        const recordLength: number = Object.keys(flatData).length; let record: ITreeData;
        for (let i: number = 0, len: number = recordLength; i < len; i++) {
            record = flatData[parseInt(i.toString(), 10)];
            const parent: Object = isNullOrUndefined(record.parentItem) ? null :
                flatData.filter((e: ITreeData) => {return e.uniqueID === record.parentItem.uniqueID; })[0];
            if (parentData === parent) {
                this.flatChildRecords.push(record);
                const hasChild: boolean = getObject('hasChildRecords', record);
                if (hasChild) {
                    this.getChildRecordsLength(record, flatData);
                } else {
                    continue;
                }
            }
        }
        return this.flatChildRecords.length;
    }

    private createSummaryItem(itemData: Object, summary: AggregateRowModel): Object {
        const summaryColumnLength: number = Object.keys(summary.columns).length;
        for (let i: number = 0, len: number = summaryColumnLength; i < len; i++) {
            const displayColumn: string = isNullOrUndefined(summary.columns[parseInt(i.toString(), 10)].columnName) ?
                summary.columns[parseInt(i.toString(), 10)].field : summary.columns[parseInt(i.toString(), 10)].columnName;
            const keys: string[] = Object.keys(itemData);
            for (const key of keys) {
                if (key === displayColumn) {
                    if (this.flatChildRecords.length) {
                        itemData[`${key}`] = this.getSummaryValues(summary.columns[parseInt(i.toString(), 10)] as AggregateColumn, this.flatChildRecords);
                    } else if (this.parent.isLocalData) {
                        const data: Object[] = this.parent.dataSource instanceof DataManager ? this.parent.dataSource.dataSource.json
                            : this.parent.flatData;
                        itemData[`${key}`] = this.getSummaryValues(summary.columns[parseInt(i.toString(), 10)] as AggregateColumn, data );
                    }
                } else {
                    continue;
                }
            }
        }
        return itemData;
    }

    private getSummaryValues(summaryColumn: AggregateColumn, summaryData: Object[]): string {
        const qry: Query =  new Query(); const single: Object = {};
        const helper: Object & { format?: Function } = {};
        const type: string = !isNullOrUndefined(summaryColumn.field) ?
            this.parent.getColumnByField(summaryColumn.field).type : undefined;
        summaryColumn.setPropertiesSilent({format: this.getFormatFromType(summaryColumn.format, type)});
        summaryColumn.setFormatter(this.parent.grid.locale);
        const formatFn: Function = summaryColumn.getFormatter() || ((): Function => (a: Object) => a)();
        summaryColumn.setTemplate(helper);
        const tempObj: { fn: Function, property: string } = summaryColumn.getTemplate(2);
        qry.queries = this.summaryQuery;
        qry.requiresCount();
        const sumData: Object[] = new DataManager(summaryData).executeLocal(qry);
        let types: AggregateType[] = <AggregateType[]>summaryColumn.type; let summaryKey: string;
        types = <AggregateType[]>[summaryColumn.type];
        for (let i: number = 0; i < types.length; i++) {
            summaryKey = types[parseInt(i.toString(), 10)];
            const key: string = summaryColumn.field + ' - ' + types[parseInt(i.toString(), 10)].toLowerCase();
            const val: Object = types[parseInt(i.toString(), 10)] !== 'Custom' ? getObject('aggregates', sumData) :
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                calculateAggregate(types[parseInt(i.toString(), 10)], sumData, summaryColumn as any, this.parent);
            const disp: string = summaryColumn.columnName;
            const value: Object = types[parseInt(i.toString(), 10)] !== 'Custom' ? val[`${key}`] : val;
            single[`${disp}`] = single[`${disp}`] || {}; single[`${disp}`][`${key}`] = value;
            single[`${disp}`][types[parseInt(i.toString(), 10)]] = !isNullOrUndefined(val) ? formatFn(value) : ' ';
        }
        helper.format = summaryColumn.getFormatter();
        const cellElement: Element = createElement('td', {
            className: 'e-summary'
        });
        if ((<{ isReact?: boolean }>this.parent).isReact) {
            const renderReactTemplates: string = 'renderReactTemplates';
            tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property, '', null, null, cellElement);
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const thisRef: Aggregate = this;
            // tslint:disable-next-line:typedef
            thisRef.parent[`${renderReactTemplates}`](function(){
                thisRef.parent.trigger(events.queryCellInfo, thisRef.parent['args']);
            });
        } else {
            appendChildren(cellElement, tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property));
        }
        const value: string = single[`${summaryColumn.columnName}`][`${summaryKey}`];
        let summaryValue: string;
        if (cellElement.innerHTML.indexOf(value) === -1) {
            summaryValue = cellElement.innerHTML + value;
            return summaryValue;
        } else {
            return cellElement.innerHTML;
        }
    }

    private getFormatFromType(summaryformat: string| NumberFormatOptions, type: string):
    string | NumberFormatOptions | DateFormatOptions {
        if (isNullOrUndefined(type) || typeof summaryformat !== 'string') {
            return summaryformat;
        }
        let obj: string | NumberFormatOptions | DateFormatOptions;
        switch (type) {
        case 'number':
            obj = { format: summaryformat };
            break;
        case 'datetime':
            obj = { type: 'dateTime', skeleton: summaryformat };
            break;
        case 'date':
            obj = { type: type, skeleton: summaryformat };
            break;
        }
        return obj;
    }

    /**
     * To destroy the Aggregate module
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
