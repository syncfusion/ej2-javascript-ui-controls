import { PivotCommon } from '../base/pivot-common';
import * as events from '../../common/base/constant';
import { IFieldOptions, IField } from '../../base/engine';
import { SummaryTypes } from '../../base/types';
import { FieldDroppedEventArgs } from '../base/interface';

/**
 * `DataSourceUpdate` module is used to update the dataSource.
 */
/** @hidden */
export class DataSourceUpdate {
    public parent: PivotCommon;
    /** @hidden */
    public btnElement: HTMLElement;
    /** @hidden */
    /* tslint:disable-next-line */
    public control: any;

    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent?: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Updates the dataSource by adding the given field along with field dropped position to the dataSource.
     * @param  {string} fieldName - Defines dropped field name to update dataSource.
     * @param  {string} droppedClass -  Defines dropped field axis name to update dataSource.
     * @param  {number} fieldCaption - Defines dropped position to the axis based on field position.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    public updateDataSource(fieldName: string, droppedClass: string, droppedPosition: number): void {
        let dataSourceItem: IFieldOptions;
        if (this.control && this.btnElement && this.btnElement.getAttribute('isvalue') === 'true') {
            switch (droppedClass) {
                case '':
                    this.control.setProperties({ dataSource: { values: [] } }, true);
                    break;
                case 'rows':
                    this.control.setProperties({ dataSource: { valueAxis: 'row' } }, true);
                    break;
                case 'columns':
                    this.control.setProperties({ dataSource: { valueAxis: 'column' } }, true);
                    break;
            }
        } else {
            dataSourceItem = this.removeFieldFromReport(fieldName.toString());
            dataSourceItem = dataSourceItem ? dataSourceItem : this.getNewField(fieldName.toString());
            if (dataSourceItem.type === 'CalculatedField' && droppedClass !== '') {
                droppedClass = 'values';
            }
        }
        if (this.control) {
            let eventArgs: FieldDroppedEventArgs = {
                'droppedField': dataSourceItem, 'dataSource': this.parent.dataSource, 'droppedAxis': droppedClass
            };
            this.control.trigger(events.onFieldDropped, eventArgs);
        }
        if (dataSourceItem) {
            switch (droppedClass) {
                case 'filters':
                    droppedPosition !== -1 ?
                        this.parent.dataSource.filters.splice(droppedPosition as number, 0, dataSourceItem) :
                        this.parent.dataSource.filters.push(dataSourceItem);
                    break;
                case 'rows':
                    droppedPosition !== -1 ?
                        this.parent.dataSource.rows.splice(droppedPosition as number, 0, dataSourceItem) :
                        this.parent.dataSource.rows.push(dataSourceItem);
                    break;
                case 'columns':
                    droppedPosition !== -1 ?
                        this.parent.dataSource.columns.splice(droppedPosition as number, 0, dataSourceItem) :
                        this.parent.dataSource.columns.push(dataSourceItem);
                    break;
                case 'values':
                    droppedPosition !== -1 ?
                        this.parent.dataSource.values.splice(droppedPosition as number, 0, dataSourceItem) :
                        this.parent.dataSource.values.push(dataSourceItem);
                    break;
            }
        }
    }

    /**
     * Updates the dataSource by removing the given field from the dataSource.
     * @param  {string} fieldName - Defines dropped field name to remove dataSource.
     * @method removeFieldFromReport
     * @return {void}
     * @hidden
     */
    public removeFieldFromReport(fieldName: string): IFieldOptions {
        let dataSourceItem: IFieldOptions;
        let isDataSource: boolean = false;
        let rows: IFieldOptions[] = this.parent.dataSource.rows;
        let columns: IFieldOptions[] = this.parent.dataSource.columns;
        let values: IFieldOptions[] = this.parent.dataSource.values;
        let filters: IFieldOptions[] = this.parent.dataSource.filters;
        let fields: IFieldOptions[][] = [rows, columns, values, filters];
        for (let len: number = 0, lnt: number = fields.length; len < lnt; len++) {
            if (!isDataSource && fields[len]) {
                for (let i: number = 0, n: number = fields[len].length; i < n; i++) {
                    if (fields[len][i].name === fieldName) {
                        dataSourceItem = fields[len][i];
                        fields[len].splice(i, 1);
                        isDataSource = true;
                        break;
                    }
                }
            }
        }
        return dataSourceItem;
    }

    /**
     * Creates new field object given field name from the field list data.
     * @param  {string} fieldName - Defines dropped field name to add dataSource.
     * @method getNewField
     * @return {void}
     * @hidden
     */
    public getNewField(fieldName: string): IFieldOptions {
        let field: IField = this.parent.engineModule.fieldList[fieldName];
        let newField: IFieldOptions = {
            name: fieldName,
            caption: field.caption,
            type: field.aggregateType as SummaryTypes,
            showNoDataItems: field.showNoDataItems
        };
        return newField;
    }
}