/**
 * Pivot Selection Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_nodata } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PivotCellSelectedEventArgs } from '../../../src';

PivotView.Inject(FieldList);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_nodata as IDataSet[],
        enableSorting: true,
        rows: [{ name: 'Country' }, { name: 'State' }],
        columns: [{ name: 'Product' }, { name: 'Date' }],
        values: [{ name: 'Quantity' }], filters: [],
    },
    showFieldList: false,
    width: 1000,
    height: 300,
    gridSettings: {
        allowSelection: true,
        selectionSettings: { mode: 'Both', type: 'Multiple', cellSelectionMode: 'Box' }
    },
    cellSelected: (args: PivotCellSelectedEventArgs) => {
        // You can get the selected cells info here
    }
});
pivotGridObj.appendTo('#PivotView');