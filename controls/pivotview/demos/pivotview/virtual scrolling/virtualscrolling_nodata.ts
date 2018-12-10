/**
 * Pivot Grid virtual scroll with no data
 */

import { IDataSet } from '../../../src/base/engine';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { VirtualScroll } from '../../../src/pivotview/actions/virtualscroll';
import { FieldList } from '../../../src/common/actions/field-list';
import { pivot_nodata } from '../../../spec/base/datasource.spec';

PivotView.Inject(VirtualScroll, FieldList);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_nodata as IDataSet[],
        expandAll: true,
        rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
        columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
        values: [{ name: 'Amount' }, { name: 'Quantity' }],
    },
    width: 1000,
    height: 400,
    enableVirtualization: true,
    showFieldList: true
});
pivotGridObj.appendTo('#PivotView');