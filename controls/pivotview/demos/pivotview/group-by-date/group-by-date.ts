/**
 * Group by date default sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';

PivotView.Inject(GroupingBar, FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        allowLabelFilter: true,
        formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
        filterSettings: [{ name: 'product', items: ['Flight'], type: 'Exclude' }],
        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        rows: [{ name: 'date', caption: 'TimeLine' }],
        values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'quantity' }],
        columns: [{name: 'age'}, { name: 'product', caption: 'Category' }],
        filters: [{ name: 'gender', caption: 'Population' }],
        groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days', 'Hours'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
        { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }]
    },
    allowCalculatedField: true,
    showGroupingBar: true,
    showFieldList: true,
    height: 350,
    width: 1000
});

pivotGridObj.appendTo('#PivotView');
