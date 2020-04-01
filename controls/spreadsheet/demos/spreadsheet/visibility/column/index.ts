/**
 * Spreadsheet show/hide column sample
 */
import { Spreadsheet, SheetModel, ColumnModel, RowModel, RangeModel, SpreadsheetModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.getElementById('wrapper').style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [{ hidden: true }, { width: 130 }, { hidden: true, width: 92 }, { width: 96, hidden: true },
    { index: 5, hidden: true }, { index: 7, hidden: true }];

let rows: RowModel[] = [{ hidden: true }];

let rangeSettings: RangeModel[] = [{ dataSource: dataSource, startCell: 'B2' }];

let sheet: SheetModel[] = [{ name: 'Price Details', columns: columns, selectedRange: 'B2', rows: rows, range: rangeSettings }];

let spreadsheetModel: SpreadsheetModel = {
    sheets: sheet,
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    beforeDataBound: (): void => {
        if (spreadsheet.sheets[spreadsheet.activeSheetIndex].name === 'Price Details') {
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'B2:I2');
        }
    }
};

let spreadsheet: Spreadsheet = new Spreadsheet(spreadsheetModel);

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);