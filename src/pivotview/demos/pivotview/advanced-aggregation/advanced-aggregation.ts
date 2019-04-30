/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { excel_data } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { SummaryTypes } from '../../../src/base/types';
import '../../../node_modules/es6-promise/dist/es6-promise';

//335 or 315
PivotView.Inject(FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: excel_data as IDataSet[],
        expandAll: false,
        enableSorting: true,
        emptyCellsTextContent: '*',
        rows: [{ name: 'Product' }],
        columns: [{ name: 'Date' }],
        values: [{ name: 'Qty 1', type: 'Sum', baseField: 'Product', baseItem: 'Staplers' }, { name: 'Qty 2' }],
        filters: []
    },
    width: '100%',
    showValuesButton: true,
});
pivotGridObj.appendTo('#PivotView');

let listObj: DropDownList = new DropDownList({
    placeholder: 'Select an aggregate type',
    popupHeight: '200px',
    change: (arg: ChangeEventArgs) => {
        pivotGridObj.dataSource.values[0].type = arg.value as SummaryTypes;
    },
    width: '250px'
});
listObj.appendTo('#summary-types');