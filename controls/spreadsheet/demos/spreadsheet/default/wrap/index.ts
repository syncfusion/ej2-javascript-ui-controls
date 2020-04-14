/**
 * Spreadsheet wrap text sample
 */
import { Spreadsheet, SheetModel, ColumnModel, RowModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { movieListData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [{ index: 1, width: 100 }, { width: 140 }, { width: 90 }, { width: 150 }, { width: 120 }, { width: 90 },
    { width: 180 }];

// Set wrap text to H2 to H5 cells through cell binding
let rows: RowModel[] = [{ height: 30 }, { cells: [{ index: 7, wrap: true }] }, { cells: [{ index: 7, wrap: true }] },
{ cells: [{ index: 7, wrap: true }] }, { cells: [{ index: 7, wrap: true }] }];

let sheets: SheetModel[] = [{ name: 'Movie List', ranges: [{ dataSource: dataSource }], rows: rows, columns: columns }];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        spreadsheet.cellFormat({ verticalAlign: 'middle' }, 'A1:H5');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'A2:B5');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D2:D5');
        // To wrap the cells from E2 to E5 range
        spreadsheet.wrap('E2:E5');
        // To unwrap the H3 cell
        spreadsheet.wrap('H3', false);
    },
    showFormulaBar: false
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);