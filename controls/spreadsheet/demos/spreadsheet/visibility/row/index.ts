/**
 * Spreadsheet show/hide row sample
 */
import { Spreadsheet, SheetModel, ColumnModel, RowModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.getElementById('wrapper').style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [{ width: 150 }, { width: 100 }, { width: 100 }, { width: 80 }, { width: 80 },
    { width: 80 }, { width: 80 }, { width: 80 }];

// Hiding the 2nd and 3rd row index through property binding
let rows: RowModel[] = [{ index: 2, hidden: true }, { hidden: true }];

let sheets: SheetModel[] = [{ ranges: [{ dataSource: dataSource }], columns: columns, rows: rows }];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        // Unhide the 3rd index hidden row
        spreadsheet.hideRow(3, 3, false);
        // Hiding the 8th and 9th index row
        spreadsheet.hideRow(8, 9);
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D2:H11');
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);