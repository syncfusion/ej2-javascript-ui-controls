/**
 * Pivot Value Filtering Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import '../../../node_modules/es6-promise/dist/es6-promise';


//335 or 315
PivotView.Inject(FieldList, GroupingBar);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: true,
        enableSorting: true,
        allowValueFilter: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        formatSettings: [{ name: 'balance', format: 'C' }],
        filterSettings: [
            { name: 'gender', type: 'Value', condition: 'Equals', value1: '3250', measure: 'quantity' },
            { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '200', measure: 'quantity' }
        ],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
    },
    showFieldList: true,
    showGroupingBar: true,
    width: 1000,
    height: 400
});
pivotGridObj.appendTo('#PivotView');