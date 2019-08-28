/**
 * Grouping Bar Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_smalldata } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PivotChart } from '../../../src/pivotchart/index';

PivotView.Inject(GroupingBar, FieldList, CalculatedField, PivotChart);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_smalldata as IDataSet[],
        expandAll: false,
        enableSorting: true,
        columns: [{ name: 'Date' }, { name: 'Product' }],
        rows: [{ name: 'Country' }, { name: 'State' }],
        formatSettings: [{ name: 'Amount', format: 'C' }],
        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
        allowValueFilter: false,
        allowLabelFilter: true
    },
    height: 500,
    allowCalculatedField: true,
    showGroupingBar: true,
    showFieldList: true,
    displayOption: { view: 'Chart' },
    chartSettings: {
        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultiAxis: false,
    },
});
pivotGridObj.appendTo('#PivotView');