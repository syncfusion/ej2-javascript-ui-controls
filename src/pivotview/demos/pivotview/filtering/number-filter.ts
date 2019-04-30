/**
 * Pivot Label Filteirng Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';


//335 or 315
PivotView.Inject(FieldList, CalculatedField, GroupingBar);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        allowLabelFilter: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        formatSettings: [{ name: 'balance', format: 'C' }],
        filterSettings: [{ name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' }],
        rows: [{ name: 'age', caption: 'Age' }],
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