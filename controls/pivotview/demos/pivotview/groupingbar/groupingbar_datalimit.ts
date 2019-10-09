/**
 * Grouping Bar Default Sample
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
        sortSettings: [{ name: 'company', order: 'Descending' }],
        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        rows: [{ name: 'product' }, { name: 'state' }],
        columns: [{ name: 'gender' }, { name: 'index' }],
        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
        { name: 'quantity' }], filters: [],
        allowLabelFilter: true,
        allowValueFilter: true
    },
    allowCalculatedField: true,
    showGroupingBar: true,
    showFieldList: false,
    maxNodeLimitInMemberEditor: 20
});
pivotGridObj.appendTo('#PivotView');