/**
 * Spreadsheet show/hide column sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.getElementById('wrapper').style.height = `${document.documentElement.clientHeight - 70}px`;

// Hiding the 1st and 2nd column index through property binding
let columns: ColumnModel[] = [{ width: 150 }, { width: 100, hidden: true }, { width: 100, hidden: true }, { width: 80 }, { width: 80 },
    { width: 80 }, { width: 80 }, { width: 80 }];

let sheets: SheetModel[] = [{ ranges: [{ dataSource: dataSource }], columns: columns }];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        // Unhide the 2nd index hidden column
        spreadsheet.hideColumn(1, 1, false);
        // Hiding the 6th index column
        spreadsheet.hideColumn(6);
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D2:H11');
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);