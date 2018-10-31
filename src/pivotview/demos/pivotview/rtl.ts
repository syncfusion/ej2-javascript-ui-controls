/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../../spec/base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import '../../node_modules/es6-promise/dist/es6-promise';

PivotView.Inject(GroupingBar);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
        { name: 'company', type: 'Include', items: ['NIPAZ'] },
        { name: 'gender', type: 'Include', items: ['male'] }],
        rows: [{ name: 'company' }, { name: 'state' }],
        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        columns: [{ name: 'name' }],
        values: [{ name: 'balance' },
        { name: 'price', type: 'CalculatedField' },
        { name: 'quantity' }], filters: [{ name: 'gender' }]
    },
    showGroupingBar: true,
    enableRtl: true
});
pivotGridObj.appendTo('#PivotView');