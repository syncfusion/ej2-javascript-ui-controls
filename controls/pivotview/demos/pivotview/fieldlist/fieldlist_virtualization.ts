/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { VirtualScroll } from '../../../src/pivotview/actions';

//335 or 315
PivotView.Inject(FieldList, CalculatedField, VirtualScroll);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: true,
        enableSorting: true,
        rows: [{ name: 'index' }, { name: 'gender' }],
        columns: [{ name: 'name' }, { name: 'isActive' }],
        values: [{ name: 'balance' },
        { name: 'quantity' }], filters: []
    },
    showFieldList: true,
    enableVirtualization: true,
    width: 1000,
    height: 400,
    showValuesButton: true
});
pivotGridObj.appendTo('#PivotView');