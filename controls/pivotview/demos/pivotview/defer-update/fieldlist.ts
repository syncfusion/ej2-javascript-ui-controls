/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { PivotFieldList } from '../../../src/pivotfieldlist/base/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import { Browser, prepend, setStyleAttribute } from '@syncfusion/ej2-base';
import '../../../node_modules/es6-promise/dist/es6-promise';

PivotFieldList.Inject(CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    enginePopulated: () => {
        if (fieldlist) {
            fieldlist.update(pivotGridObj);
        }
    },
    allowDeferLayoutUpdate: true,
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
    load: (): void => {
        if (Browser.isDevice) {
            fieldlist.renderMode = 'Popup';
            fieldlist.target = '.control-section';
            setStyleAttribute(document.getElementById('FieldList'), {
                width: '0',
                height: '0',
                float: 'left'
            });
        }
    },
    dataBound: (): void => {
        pivotGridObj.toolTip.destroy();
        pivotGridObj.refresh();
        if (Browser.isDevice) {
            prepend([document.getElementById('FieldList')], document.getElementById('PivotView'));
        }
    },
    allowDeferLayoutUpdate: true,
    showValuesButton: true,
    enginePopulated: (): void => {
        if (fieldlist.isRequiredUpdate) {
            fieldlist.updateView(pivotGridObj);
        }
        pivotGridObj.notify('ui-update', pivotGridObj);
        if (!Browser.isDevice) {
            fieldlist.notify('tree-view-update', fieldlist);
        }
    },
    allowCalculatedField: true,
    renderMode: 'Fixed'
});
fieldlist.appendTo('#FieldList');
