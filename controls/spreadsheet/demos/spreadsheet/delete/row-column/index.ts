/**
 * Spreadsheet insert row sample
 */
import { Spreadsheet, SheetModel, ColumnModel, RowModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { productData } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 20}px`;

let columns: ColumnModel[] = [{ width: 90 }, { width: 220 }, { width: 90 }, { width: 140 }, { width: 90 }, { width: 100 }, { width: 100 }];

let dataSource: Object[] = productData.slice(0, 10);

let sheets: SheetModel[] = [{ ranges: [{ dataSource: dataSource }], columns: columns }];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        // deleting the rows from 8th to 10th index 
        spreadsheet.delete(8, 10, 'Row');
        // deleting the 2nd and 5th indexed columns
        spreadsheet.delete(2, 2, 'Column');
        spreadsheet.delete(5, 5, 'Column');
        // Applies style formatting after deleted the rows and columns
        spreadsheet.cellFormat({ textAlign: 'center' }, 'A2:A8');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D2:G8');
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');