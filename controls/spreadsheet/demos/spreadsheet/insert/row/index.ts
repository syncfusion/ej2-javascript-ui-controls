/**
 * Spreadsheet insert row sample
 */
import { Spreadsheet, SheetModel, ColumnModel, RowModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { productData } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 20}px`;

let dataSource: Object[] = productData.slice(0, 8);

let columns: ColumnModel[] = [
    { width: 20 }, { width: 90 }, { width: 220 }, { width: 90 }, { width: 140 }, { width: 90 }, { width: 100 }, { width: 100 }
];

let sheets: SheetModel[] = [{ ranges: [{ dataSource: dataSource, startCell: 'B1' }], columns: columns }];

// Rows model which is going to insert dynamically
let rowsModel: RowModel[] = [{
    index: 10, // Need to specify the index for the first row collection, the specified rows will be inserted in this index.
    cells: [{ value: '' }, { value: '9' }, { value: 'Northwoods Cranberry Sauce' }, { value: '3' }, { value: '12 - 12 oz jars' },
        { value: '40.00' }, { value: '6' }, { value: 'false' }]
},
{
    cells: [{ value: '' }, { value: '10' }, { value: 'Mishi Kobe Niku' }, { value: '4' }, { value: '18 - 500 g pkgs.' }, { value: '97.00' },
        { value: '29' }, { value: 'true' }]
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        // Applies style formatting before inserting the rows
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        // inserting a empty row at 0th index
        spreadsheet.insertRow();
        // inserting 2 rows at the 9th index with data
        spreadsheet.insertRow(rowsModel);
        // Applies style formatting after the rows are inserted
        spreadsheet.cellFormat({ textAlign: 'center' }, 'B3:B12');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D3:D12');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'F3:H12');
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');