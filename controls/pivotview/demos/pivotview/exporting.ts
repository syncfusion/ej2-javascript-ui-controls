/**
 * PivotView exporting Sample
 */

import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../../spec/base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import '../../node_modules/es6-promise/dist/es6-promise';

//335 or 315
PivotView.Inject(FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_dataset as IDataSet[],
        expandAll: false,
        enableSorting: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        formatSettings: [{ name: 'balance', format: 'C' }],
        filterSettings: [
            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
        ],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
    },
    width: '100%',
    height: 300,
    allowCalculatedField: true,
    allowExcelExport: true,
    allowPdfExport: true,
    showFieldList: true,
});
pivotGridObj.appendTo('#PivotView');
document.getElementById('excel').onclick = function () {
    pivotGridObj.excelExport();
};
document.getElementById('csv').onclick = function () {
    pivotGridObj.csvExport();
};
document.getElementById('pdf').onclick = function () {
    pivotGridObj.pdfExport();
};