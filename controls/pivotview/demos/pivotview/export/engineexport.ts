/**
 * PivotView engine exporting Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PDFExport } from '../../../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../../../src/pivotview/actions/excel-export';

//335 or 315
PivotView.Inject(PDFExport, ExcelExport, FieldList, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
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
        showGrandTotals: false
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
    pivotGridObj.excelExportModule.exportToExcel('Excel');
};
document.getElementById('csv').onclick = function () {
    pivotGridObj.excelExportModule.exportToExcel('csv');
};
document.getElementById('pdf').onclick = function () {
    pivotGridObj.pdfExportModule.exportToPDF();
};