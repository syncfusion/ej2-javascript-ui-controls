
import { IDataSet } from '../../../src/base/engine';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { PivotFieldList } from '../../../src/pivotfieldlist/base/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import { pivot_nodata } from '../../../spec/base/datasource.spec';
import { FieldDroppedEventArgs } from '../../../src';

PivotFieldList.Inject(CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    enginePopulated: () => {
        if (fieldlist) {
            fieldlist.update(pivotGridObj);
        }
    },
    width: "99%",
    height: 500
});
pivotGridObj.appendTo('#PivotView');
let fieldlist: PivotFieldList = new PivotFieldList({
    dataSource: {
        data: pivot_nodata as IDataSet[],
        expandAll: true,
        enableSorting: true,
        rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: false }],
        columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
        allowValueFilter: true,
        allowLabelFilter: true
    },
    showValuesButton: true,
    enginePopulated: (): void => {
        fieldlist.updateView(pivotGridObj);
    },
    onFieldDropped: (args: FieldDroppedEventArgs) => {
        if (args.droppedAxis === 'filters') {
            args.droppedField.showNoDataItems = true;
        }
    },
    allowCalculatedField: true,
    renderMode: 'Fixed'
});
fieldlist.appendTo('#FieldList');
