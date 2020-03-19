import { PivotCommon } from '../base/pivot-common';
import * as events from '../../common/base/constant';
import { IFieldOptions, IField } from '../../base/engine';
import { SummaryTypes } from '../../base/types';
import { FieldDroppedEventArgs, FieldDropEventArgs } from '../base/interface';
import { OlapEngine, IOlapField } from '../../base/olap/engine';
import { isBlazor } from '@syncfusion/ej2-base';
import { PivotButton } from '../actions/pivot-button';
import { PivotUtil } from '../../base/util';
import { PivotView } from '../../pivotview';
import { PivotFieldList } from '../../pivotfieldlist';

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
    /** @hidden */
    public pivotButton: PivotButton;

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
        let draggedClass: string;
        let row: IFieldOptions[] = this.parent.dataSourceSettings.rows;
        let column: IFieldOptions[] = this.parent.dataSourceSettings.columns;
        let value: IFieldOptions[] = this.parent.dataSourceSettings.values;
        let filter: IFieldOptions[] = this.parent.dataSourceSettings.filters;
        let field: IFieldOptions[][] = [row, column, value, filter];
        for (let len: number = 0, lnt: number = field.length; len < lnt; len++) {
            if (field[len]) {
                for (let i: number = 0, n: number = field[len].length; i < n; i++) {
                    if (field[len][i].name === fieldName || (this.parent.dataType === 'olap' &&
                        field[len][i].name.toLowerCase() === '[measures]' && field[len][i].name.toLowerCase() === fieldName)) {
                        draggedClass = len === 0 ? 'rows' : len === 1 ? 'columns' : len === 2 ? 'values' : 'filters';
                    }
                    if (!draggedClass) {
                        draggedClass = 'fieldList';
                    }
                }
            }
        }
        let eventdrop: FieldDropEventArgs = {
            fieldName: fieldName, dropField: PivotUtil.getFieldInfo(fieldName, this.control).fieldItem,
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            dropAxis: droppedClass, dropPosition: droppedPosition, draggedAxis: draggedClass, cancel: false
        };
        let control: PivotView | PivotFieldList = this.control.getModuleName() === 'pivotfieldlist' && this.control.isPopupView ?
            this.control.pivotGridModule : this.control;
        control.trigger(events.fieldDrop, eventdrop, (observedArgs: FieldDropEventArgs) => {
            if (!observedArgs.cancel) {
                droppedClass = observedArgs.dropAxis;
                droppedPosition = observedArgs.dropPosition;
                fieldName = observedArgs.dropField ? observedArgs.dropField.name : observedArgs.fieldName;
                dataSourceItem = observedArgs.dropField;
                if (this.control && this.btnElement && this.btnElement.getAttribute('isvalue') === 'true') {
                    switch (droppedClass) {
                        case '':
                            this.control.setProperties({ dataSourceSettings: { values: [] } }, true);
                            break;
                        case 'rows':
                            this.control.setProperties({ dataSourceSettings: { valueAxis: 'row' } }, true);
                            break;
                        case 'columns':
                            this.control.setProperties({ dataSourceSettings: { valueAxis: 'column' } }, true);
                            break;
                    }
                } else {
                    // dataSourceItem = this.removeFieldFromReport(fieldName.toString());
                    // dataSourceItem = dataSourceItem ? dataSourceItem : this.getNewField(fieldName.toString());
                    this.removeFieldFromReport(fieldName.toString());
                    dataSourceItem = this.getNewField(fieldName.toString(), observedArgs.dropField);
                    if (dataSourceItem.type === 'CalculatedField' && droppedClass !== '') {
                        droppedClass = 'values';
                    }
                }
                if (this.parent.dataType === 'olap') {
                    // dataSourceItem = this.removeFieldFromReport(fieldName.toString());
                    // dataSourceItem = dataSourceItem ? dataSourceItem : this.getNewField(fieldName.toString());
                    this.removeFieldFromReport(fieldName.toString());
                    dataSourceItem = this.getNewField(fieldName.toString(), observedArgs.dropField);
                    if (this.parent.dataSourceSettings.values.length === 0) {
                        this.removeFieldFromReport('[measures]');
                    }
                    if (dataSourceItem.type === 'CalculatedField' && droppedClass !== '') {
                        droppedClass = 'values';
                    }
                }
                if (this.control) {
                    let eventArgs: FieldDroppedEventArgs = {
                        fieldName: fieldName, droppedField: dataSourceItem,
                        dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                        droppedAxis: droppedClass, droppedPosition: droppedPosition
                    };
                    /* tslint:disable */
                    let dataSourceUpdate: DataSourceUpdate = this;
                    control.trigger(events.onFieldDropped, eventArgs, (droppedArgs: FieldDroppedEventArgs) => {
                        dataSourceItem = droppedArgs.droppedField;
                        if (dataSourceItem) {
                            droppedPosition = droppedArgs.droppedPosition;
                            droppedClass = droppedArgs.droppedAxis;
                            switch (droppedClass) {
                                case 'filters':
                                    droppedPosition !== -1 ?
                                        (isBlazor() ? dataSourceUpdate.parent.dataSourceSettings.filters.splice(droppedPosition, 0, dataSourceItem) : this.parent.dataSourceSettings.filters.splice(droppedPosition, 0, dataSourceItem)) :
                                        (isBlazor() ? dataSourceUpdate.parent.dataSourceSettings.filters.push(dataSourceItem) : this.parent.dataSourceSettings.filters.push(dataSourceItem));
                                    break;
                                case 'rows':
                                    droppedPosition !== -1 ?
                                        (isBlazor() ? dataSourceUpdate.parent.dataSourceSettings.rows.splice(droppedPosition, 0, dataSourceItem) : this.parent.dataSourceSettings.rows.splice(droppedPosition, 0, dataSourceItem)) :
                                        (isBlazor() ? dataSourceUpdate.parent.dataSourceSettings.rows.push(dataSourceItem) : this.parent.dataSourceSettings.rows.push(dataSourceItem));
                                    break;
                                case 'columns':
                                    droppedPosition !== -1 ?
                                        (isBlazor() ? dataSourceUpdate.parent.dataSourceSettings.columns.splice(droppedPosition, 0, dataSourceItem) : this.parent.dataSourceSettings.columns.splice(droppedPosition, 0, dataSourceItem)) :
                                        (isBlazor() ? dataSourceUpdate.parent.dataSourceSettings.columns.push(dataSourceItem) : this.parent.dataSourceSettings.columns.push(dataSourceItem));
                                    break;
                                case 'values':
                                    droppedPosition !== -1 ?
                                        (isBlazor() ? dataSourceUpdate.parent.dataSourceSettings.values.splice(droppedPosition, 0, dataSourceItem) : this.parent.dataSourceSettings.values.splice(droppedPosition, 0, dataSourceItem)) :
                                        (isBlazor() ? dataSourceUpdate.parent.dataSourceSettings.values.push(dataSourceItem) : this.parent.dataSourceSettings.values.push(dataSourceItem));
                                    if (isBlazor()) {
                                        if (dataSourceUpdate.parent.dataType === 'olap' && !(dataSourceUpdate.parent.engineModule as OlapEngine).isMeasureAvail) {
                                            let measureField: IFieldOptions = {
                                                name: '[Measures]', caption: 'Measures', showRemoveIcon: true, allowDragAndDrop: true
                                            };
                                            let fieldAxis: IFieldOptions[] = dataSourceUpdate.parent.dataSourceSettings.valueAxis === 'row' ?
                                                dataSourceUpdate.parent.dataSourceSettings.rows : dataSourceUpdate.parent.dataSourceSettings.columns;
                                            fieldAxis.push(measureField);
                                        }
                                    } else {
                                        if (this.parent.dataType === 'olap' && !(this.parent.engineModule as OlapEngine).isMeasureAvail) {
                                            let measureField: IFieldOptions = {
                                                name: '[Measures]', caption: 'Measures', showRemoveIcon: true, allowDragAndDrop: true
                                            };
                                            let fieldAxis: IFieldOptions[] = this.parent.dataSourceSettings.valueAxis === 'row' ?
                                                this.parent.dataSourceSettings.rows : this.parent.dataSourceSettings.columns;
                                            fieldAxis.push(measureField);
                                        }
                                    }
                                    break;
                            }
                            if (isBlazor()) {
                                dataSourceUpdate.parent.control.pivotButtonModule.updateDataSource();
                                dataSourceUpdate.parent.control.axisFieldModule.render();
                            }
                        }
                    });
                }
            }
        });
    }
    /* tslint:enable */
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
        let rows: IFieldOptions[] = this.parent.dataSourceSettings.rows;
        let columns: IFieldOptions[] = this.parent.dataSourceSettings.columns;
        let values: IFieldOptions[] = this.parent.dataSourceSettings.values;
        let filters: IFieldOptions[] = this.parent.dataSourceSettings.filters;
        let fields: IFieldOptions[][] = [rows, columns, values, filters];
        let field: IField = this.parent.engineModule.fieldList[fieldName];
        for (let len: number = 0, lnt: number = fields.length; len < lnt; len++) {
            if (!isDataSource && fields[len]) {
                for (let i: number = 0, n: number = fields[len].length; i < n; i++) {
                    if (fields[len][i].name === fieldName || (this.parent.dataType === 'olap' &&
                        fields[len][i].name.toLowerCase() === '[measures]' && fields[len][i].name.toLowerCase() === fieldName)) {
                        dataSourceItem = (<{ [key: string]: IFieldOptions }>fields[len][i]).properties ?
                            (<{ [key: string]: IFieldOptions }>fields[len][i]).properties : fields[len][i];
                        dataSourceItem.type = (field && field.type === 'number') ? dataSourceItem.type :
                            'Count' as SummaryTypes;
                        fields[len].splice(i, 1);
                        if (this.parent.dataType === 'olap') {
                            let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
                            if (engineModule && engineModule.fieldList[fieldName]) {
                                engineModule.fieldList[fieldName].currrentMembers = {};
                                engineModule.fieldList[fieldName].searchMembers = [];
                            }
                        }
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
    public getNewField(fieldName: string, fieldItem?: IFieldOptions): IFieldOptions {
        let newField: IFieldOptions;
        if (this.parent.dataType === 'olap') {
            let field: IOlapField = (this.parent.engineModule as OlapEngine).fieldList[fieldName];
            newField = {
                name: fieldItem ? fieldItem.name : fieldName,
                caption: fieldItem ? fieldItem.caption : field.caption,
                isNamedSet: fieldItem ? fieldItem.isNamedSet : field.isNamedSets,
                isCalculatedField: fieldItem ? fieldItem.isCalculatedField : field.isCalculatedField,
                type: (fieldItem ? (fieldItem.type === undefined ? field.type === 'number' ? 'Sum' as SummaryTypes :
                    'Count' as SummaryTypes : fieldItem.type) :
                    ((field.aggregateType as SummaryTypes) === undefined ? field.type === 'number' ? 'Sum' as SummaryTypes :
                        'Count' as SummaryTypes : field.aggregateType as SummaryTypes)),
                showFilterIcon: fieldItem ? fieldItem.showFilterIcon : field.showFilterIcon,
                showSortIcon: fieldItem ? fieldItem.showSortIcon : field.showSortIcon,
                showEditIcon: fieldItem ? fieldItem.showEditIcon : field.showEditIcon,
                showRemoveIcon: fieldItem ? fieldItem.showRemoveIcon : field.showRemoveIcon,
                showValueTypeIcon: fieldItem ? fieldItem.showValueTypeIcon : field.showValueTypeIcon,
                allowDragAndDrop: fieldItem ? fieldItem.allowDragAndDrop : field.allowDragAndDrop,
                showSubTotals: fieldItem ? fieldItem.showSubTotals : field.showSubTotals
            };
        } else {
            let field: IField = this.parent.engineModule.fieldList[fieldName];
            newField = {
                name: fieldItem ? fieldItem.name : fieldName,
                caption: fieldItem ? fieldItem.caption : field.caption,
                type: (fieldItem ? ((fieldItem.type === undefined || fieldItem.type === null) ?
                    field.type === 'number' ? 'Sum' as SummaryTypes : 'Count' as SummaryTypes : fieldItem.type) :
                    (((field.aggregateType as SummaryTypes) === undefined || (field.aggregateType as SummaryTypes) === null) ?
                        field.type === 'number' ? 'Sum' as SummaryTypes :
                            'Count' as SummaryTypes : field.aggregateType as SummaryTypes)),
                showNoDataItems: fieldItem ? fieldItem.showNoDataItems : field.showNoDataItems,
                baseField: fieldItem ? fieldItem.baseField : field.baseField,
                baseItem: fieldItem ? fieldItem.baseItem : field.baseItem,
                allowDragAndDrop: fieldItem ? fieldItem.allowDragAndDrop : field.allowDragAndDrop,
                showSubTotals: fieldItem ? fieldItem.showSubTotals : field.showSubTotals,
                showFilterIcon: fieldItem ? fieldItem.showFilterIcon : field.showFilterIcon,
                showSortIcon: fieldItem ? fieldItem.showSortIcon : field.showSortIcon,
                showEditIcon: fieldItem ? fieldItem.showEditIcon : field.showEditIcon,
                showRemoveIcon: fieldItem ? fieldItem.showRemoveIcon : field.showRemoveIcon,
                showValueTypeIcon: fieldItem ? fieldItem.showValueTypeIcon : field.showValueTypeIcon
            };
        }
        return newField;
    }
}