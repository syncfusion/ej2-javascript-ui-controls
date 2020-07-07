/**
 * Grouping Bar Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Button } from '@syncfusion/ej2-buttons';
import { NumberFormatting } from '../../../src/common/popups/formatting-dialog';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';


PivotView.Inject(NumberFormatting, FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: true,
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
        formatSettings:[{ name: 'balance', format: '€ ###.0'}]
    },
    showFieldList: true,
    allowCalculatedField: true,
    allowNumberFormatting: true,
    height: 300
});
pivotGridObj.appendTo('#PivotView');

let button: Button = new Button({ isPrimary: true });
button.appendTo('#format');

let button1: Button = new Button({ isPrimary: true });
button1.appendTo('#reset');

button1.element.onclick = (): void => {
    if (pivotGridObj.dataSourceSettings.formatSettings.length > 0) {
        pivotGridObj.dataSourceSettings.formatSettings = [];
        pivotGridObj.updateDataSource(false);
    }
};

button.element.onclick = (): void => {
    if (pivotGridObj.numberFormattingModule) {
        pivotGridObj.showNumberFormattingDialog();
    }
};