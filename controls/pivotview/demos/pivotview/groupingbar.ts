/**
 * Grouping Bar Default Sample
 */

import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../../spec/base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import '../../node_modules/es6-promise/dist/es6-promise';

PivotView.Inject(GroupingBar, FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
        { name: 'company', type: 'Include', items: ['NIPAZ'] },
        { name: 'gender', type: 'Include', items: ['male'] }],
        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        rows: [{ name: 'company', caption: 'Industry' }, { name: 'state' }],
        columns: [{ name: 'name' }],
        values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'price', type: 'CalculatedField' },
        { name: 'quantity' }], filters: [{ name: 'gender' }]
    },
    allowCalculatedField: true,
    showGroupingBar: true,
    showFieldList: true
});
pivotGridObj.appendTo('#PivotView');