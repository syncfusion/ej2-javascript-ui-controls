/**
 * Group by date default sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';

PivotView.Inject(GroupingBar, FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        expandAll: true,
        enableSorting: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
        filterSettings: [{ name: 'eyeColor', type: 'Exclude', items: ['blue'] }],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
    },
    cellTemplate: '<div class="templatewrap">${getCellContent(data)}</div>',
    allowCalculatedField: true,
    showGroupingBar: true,
    showFieldList: true,
    height: 500,
    width: 1000,
    gridSettings: {
        rowHeight: 60
    }
});

pivotGridObj.appendTo('#PivotView');


// (window as TemplateFunction).getCellContent = (data: any) => {
//     let template: string;
//     // if (data.targetCell.className.indexOf('e-valuescontent') > -1) {
//         // data.targetCell.textContent = '';
//         template = '<img src="../../pivotview/images/Perfect.png" /><div class="caption"></div>';
//     // }
//     return template;
// };
// interface TemplateFunction extends Window {
//     getCellContent?: Function;
// }

(<{ getCellContent?: Function }>window).getCellContent = (e: any): any => {
    let template: string;
    if (e && e.targetCell.className.indexOf('e-valuescontent') > -1) {
        template = '<img src="../../pivotview/images/Insufficient.png" /><div class="caption"></div>';
    } else if (e && e.targetCell.className.indexOf('e-columnsheader') > -1) {
        template = '<img src="../../pivotview/images/Perfect.png" /><div class="caption"></div>';
    } else if (e && e.targetCell.className.indexOf('e-rowsheader') > -1) {
        template = '<img src="../../pivotview/images/Sufficient.png" /><div class="caption"></div>';
    }
    return template;
};
