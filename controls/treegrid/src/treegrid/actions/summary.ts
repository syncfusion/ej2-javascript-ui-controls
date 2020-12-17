import { TreeGrid } from '../base/treegrid';
import { QueryOptions, Query, DataManager } from '@syncfusion/ej2-data';
import { getObject, AggregateType, calculateAggregate, Aggregate as GridAggregate, Grid, appendChildren } from '@syncfusion/ej2-grids';
import { ITreeData } from '../base';
import { findParentRecords } from '../utils';
import { isNullOrUndefined, setValue, NumberFormatOptions, DateFormatOptions, createElement, extend } from '@syncfusion/ej2-base';
import { AggregateColumn } from '../models/summary';
import { AggregateRowModel } from '../models/summary-model';


/**
 * TreeGrid Aggregate module
 * @hidden
 */
export class Aggregate {
    private parent: TreeGrid;
    private flatChildRecords: Object[];
    private summaryQuery: QueryOptions[];
    /**
     * Constructor for Aggregate module
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridAggregate);
        this.parent = parent;
        this.flatChildRecords = [];
        this.summaryQuery = [];
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'summary';
    }

    public removeEventListener(): void {
       if (this.parent.isDestroyed) { return; }
    }

    /**
     * Function to calculate summary values
     *  @hidden
     */
    public calculateSummaryValue(summaryQuery: QueryOptions[], filteredData: Object[], isSort: boolean): Object[] {
        this.summaryQuery = summaryQuery;
        let parentRecord: ITreeData;
        let parentDataLength: number = Object.keys(filteredData).length;
        let parentData: Object[]; parentData = [];
        for (let p: number = 0, len: number = parentDataLength; p < len; p++) {
              let summaryRow: boolean = getObject('isSummaryRow', filteredData[p]);
              if (!summaryRow) {
                  parentData.push(filteredData[p]);
              }
        }
        let parentRecords: Object = findParentRecords(parentData);
        let flatRecords: Object[]; flatRecords = (<Object[]>parentData).slice();
        let columnLength: number = Object.keys(this.parent.columns).length;
        let summaryLength: number = Object.keys(this.parent.aggregates).length;
        let dataLength: number = Object.keys(parentRecords).length; let childRecordsLength: number;
        if (this.parent.aggregates.filter((x: AggregateRowModel) => x.showChildSummary).length) {
            for (let i: number = 0, len: number = dataLength; i < len; i++) {
                parentRecord = parentRecords[i];
                childRecordsLength = this.getChildRecordsLength(parentRecord, flatRecords);
                if (childRecordsLength) {
                    for (let summaryRowIndex: number = 1, len: number = summaryLength; summaryRowIndex <= len; summaryRowIndex++) {
                        let item: Object; item = {};
                        for (let columnIndex: number = 0, len: number = columnLength; columnIndex < len; columnIndex++) {
                            let field: string = isNullOrUndefined(getObject('field', this.parent.columns[columnIndex])) ?
                            this.parent.columns[columnIndex] : getObject('field', this.parent.columns[columnIndex]);
                            item[field] = null;
                        }
                        item = this.createSummaryItem(item,  this.parent.aggregates[summaryRowIndex - 1]);
                        if (this.parent.aggregates[summaryRowIndex - 1].showChildSummary) {
                            let idx: number;
                            flatRecords.map((e: ITreeData, i: number) => {
                                if (e.uniqueID === parentRecord.uniqueID) { idx = i; return; } });
                            let currentIndex: number = idx + childRecordsLength + summaryRowIndex;
                            let summaryParent: ITreeData = extend({}, parentRecord);
                            delete summaryParent.childRecords;
                            delete summaryParent[this.parent.childMapping];
                            setValue('parentItem', summaryParent, item);
                            let level: number = getObject('level', summaryParent);
                            setValue('level', level + 1, item);
                            let index: number = getObject('index', summaryParent);
                            setValue('isSummaryRow', true, item);
                            setValue('parentUniqueID', summaryParent.uniqueID, item);
                            if (isSort) {
                                let childRecords: Object[] = getObject('childRecords', parentRecord);
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
            let items: Object; items = {};
            for (let columnIndex: number = 0, length: number = columnLength; columnIndex < length; columnIndex++) {
                let fields: string = isNullOrUndefined(getObject('field', this.parent.columns[columnIndex])) ?
                this.parent.columns[columnIndex] : getObject('field', this.parent.columns[columnIndex]);
                items[fields] = null;
            }
            for (let summaryRowIndex: number = 1, length: number = summaryLength; summaryRowIndex <= length; summaryRowIndex++) {
                this.createSummaryItem(items,  this.parent.aggregates[summaryRowIndex - 1]);
            }
        }
        return flatRecords;
    }

    private getChildRecordsLength(parentData: ITreeData, flatData: Object[]): number {
        let recordLength: number = Object.keys(flatData).length; let record: ITreeData;
        for (let i: number = 0, len: number = recordLength; i < len; i++) {
            record = flatData[i];
            let parent: Object = isNullOrUndefined(record.parentItem) ? null :
                 flatData.filter((e: ITreeData) => {return e.uniqueID === record.parentItem.uniqueID; })[0];
            if (parentData === parent) {
               this.flatChildRecords.push(record);
               let hasChild: boolean = getObject('hasChildRecords', record);
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
        let summaryColumnLength: number = Object.keys(summary.columns).length;
        for (let i: number = 0, len: number = summaryColumnLength; i < len; i++) {
            let displayColumn: string = isNullOrUndefined(summary.columns[i].columnName) ? summary.columns[i].field :
                summary.columns[i].columnName;
            let keys: string[] = Object.keys(itemData);
            for (let key of keys) {
                if (key === displayColumn) {
                    if (this.flatChildRecords.length) {
                        itemData[key] = this.getSummaryValues(summary.columns[i] as AggregateColumn, this.flatChildRecords);
                    } else if (this.parent.isLocalData) {
                        let data: Object[] = this.parent.dataSource instanceof DataManager ? this.parent.dataSource.dataSource.json
                                            : this.parent.flatData;
                        itemData[key] = this.getSummaryValues(summary.columns[i] as AggregateColumn, data );
                     }
                } else {
                    continue;
                }
            }
        }
        return itemData;
    }

    private getSummaryValues(summaryColumn: AggregateColumn, summaryData: Object[]): string {
        let qry: Query =  new Query(); let single: Object; single = {};
        let helper: Object & { format?: Function } = {};
        let type: string = !isNullOrUndefined(summaryColumn.field) ?
            this.parent.getColumnByField(summaryColumn.field).type : undefined;
        summaryColumn.setPropertiesSilent({format: this.getFormatFromType(summaryColumn.format, type)});
        summaryColumn.setFormatter(this.parent.grid.locale);
        let formatFn: Function = summaryColumn.getFormatter() || ((): Function => (a: Object) => a)();
        summaryColumn.setTemplate(helper);
        let tempObj: { fn: Function, property: string } = summaryColumn.getTemplate(2);
        qry.queries = this.summaryQuery;
        qry.requiresCount();
        let sumData: Object[] = new DataManager(summaryData).executeLocal(qry);
        let types: AggregateType[] = <AggregateType[]>summaryColumn.type; let summaryKey: string;
        types = <AggregateType[]>[summaryColumn.type];
        for (let i: number = 0; i < types.length; i++) {
            summaryKey = types[i];
            let key: string = summaryColumn.field + ' - ' + types[i].toLowerCase();
            let val: Object = types[i] !== 'Custom' ? getObject('aggregates', sumData) :
            calculateAggregate(types[i], sumData, summaryColumn, this.parent);
            let disp: string = summaryColumn.columnName;
            let value: Object = types[i] !== 'Custom' ? val[key] : val;
            single[disp] = single[disp] || {}; single[disp][key] = value;
            single[disp][types[i]] = !isNullOrUndefined(val) ? formatFn(value) : ' ';
        }
        helper.format = summaryColumn.getFormatter();
        let cellElement: Element = createElement('td', {
            className: 'e-summary'
        });
        if ((<{ isReact?: boolean }>this.parent).isReact) {
            let renderReactTemplates: string = 'renderReactTemplates';
            tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property, '', null, null, cellElement);
            this.parent[renderReactTemplates]();
        } else {
            appendChildren(cellElement, tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property));
        }
        let value: string = single[summaryColumn.columnName][summaryKey];
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
     * @return {void}
     * @hidden
     */
    public destroy(): void {
       this.removeEventListener();
    }
}