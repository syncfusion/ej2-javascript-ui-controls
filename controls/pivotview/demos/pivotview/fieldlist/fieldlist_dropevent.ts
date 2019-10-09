/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_nodata } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { FieldDroppedEventArgs } from '../../../src';

//335 or 315
PivotView.Inject(FieldList, CalculatedField, GroupingBar);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_nodata as IDataSet[],
        expandAll: false,
        enableSorting: true,
        rows: [{ name: 'Country' }, { name: 'State' }],
        columns: [{ name: 'Product' }, { name: 'Date' }],
        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
    },
    allowCalculatedField: true,
    showGroupingBar: true,
    showFieldList: true,
    width: 1000,
    showValuesButton: true,
    onFieldDropped: (args: FieldDroppedEventArgs) => {
        args.droppedField.caption = args.droppedField.name + ' -> ' + args.droppedAxis;
    }
});
pivotGridObj.appendTo('#PivotView');