/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../../spec/base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';

PivotFieldList.Inject(CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    enginePopulated: () => {
        if (fieldlist) {
            fieldlist.update(pivotGridObj);
        }
    },
    width: '99%',
    height: 530,
    gridSettings: { columnWidth: 140 }
});
pivotGridObj.appendTo('#PivotView');
let fieldlist: PivotFieldList = new PivotFieldList({
    dataSource: {
        data: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
        { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
        rows: [{ name: 'product' }, { name: 'state' }],
        columns: [{ name: 'gender' }],
        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
        { name: 'quantity' }], filters: []
    },
    enginePopulated: (): void => {
        fieldlist.updateView(pivotGridObj);
    },
    allowCalculatedField: true,
    renderMode: 'Fixed'
});
fieldlist.appendTo('#FieldList');
