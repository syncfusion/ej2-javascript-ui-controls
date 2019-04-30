/**
 * Grouping Bar Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { FieldList } from '../../../src/common/actions/field-list';

PivotView.Inject(FieldList);

let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_dataset as IDataSet[],
        expandAll: true,
        formatSettings: [{ name: 'balance', format: 'C' }],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }],
        filters: [],
        alwaysShowValueHeader: true
    },
    showFieldList: true,
    showValuesButton: true,
    height: 300
});
pivotGridObj.appendTo('#PivotView');