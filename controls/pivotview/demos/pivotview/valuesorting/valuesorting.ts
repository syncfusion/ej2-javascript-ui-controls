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
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: true,
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
        valueSortSettings: {
            headerText: 'female##false##quantity',
            headerDelimiter: '##',
            sortOrder: 'Descending'
        }
    },
    showValuesButton: true,
    showFieldList: true,
    height: 300,
    enableValueSorting: true
});
pivotGridObj.appendTo('#PivotView');