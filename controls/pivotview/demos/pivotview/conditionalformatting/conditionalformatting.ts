/**
 * Grouping Bar Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { ConditionalFormatting } from '../../../src/common/conditionalformatting/conditional-formatting';
import { Button } from '@syncfusion/ej2-buttons';

PivotView.Inject(ConditionalFormatting);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: true,
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
        conditionalFormatSettings: [
            {
                measure: 'balance',
                value1: 100000,
                conditions: 'LessThan',
                style: {
                    backgroundColor: '#80cbc4',
                    color: 'black',
                    fontFamily: 'Tahoma',
                    fontSize: '12px'
                }
            },
            {
                value1: 500,
                value2: 1000,
                measure: 'quantity',
                conditions: 'Between',
                style: {
                    backgroundColor: '#f48fb1',
                    color: 'black',
                    fontFamily: 'Tahoma',
                    fontSize: '12px'
                }
            }
        ]
    },
    height: 300,
    allowConditionalFormatting: true
});
pivotGridObj.appendTo('#PivotView');

let button: Button = new Button({ isPrimary: true });
button.appendTo('#format');

let button1: Button = new Button({ isPrimary: true });
button1.appendTo('#reset');

button1.element.onclick = (): void => {
    if (pivotGridObj.dataSourceSettings.conditionalFormatSettings.length > 0) {
        pivotGridObj.setProperties({ dataSource: { conditionalFormatSettings: [] } }, true);
        pivotGridObj.renderPivotGrid();
    }
    pivotGridObj.conditionalFormattingModule.destroy();
    document.getElementById('reset').blur();
};

button.element.onclick = (): void => {
    if (pivotGridObj.conditionalFormattingModule) {
        pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
    }
};