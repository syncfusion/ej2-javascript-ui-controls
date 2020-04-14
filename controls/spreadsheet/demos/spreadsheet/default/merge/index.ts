/**
 * Spreadsheet merge cells sample
 */
import { Spreadsheet, SheetModel, ColumnModel, RowModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { mergeCellsData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [{ width: 90 }, { width: 150 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 120 }, { width: 120 }, { width: 120 }, { width: 120 },
    { width: 120 }, { width: 120 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }];

let rows: RowModel[] = [{ height: 35 }, { height: 35, cells: [
    // Merging the 2nd cells of rows 2 and 3 through cell binding.
    { index: 1, rowSpan: 2 },
    // Merging the 2nd row's 3rd and 4th cells a through cell binding.
    { colSpan: 2 },
    // Merging the 2nd row's 7th, 8th and 9th cells a through cell binding.
    { index: 6, colSpan: 3 },
    // Merging the 2nd and 3rd rows 11th, 12th and 13th cells a through cell binding.
    { index: 10, rowSpan: 2, colSpan: 3 },
    { index: 13, colSpan: 2 }, { index: 17, colSpan: 2 } ] },
    { height: 35, cells: [{ index: 3, colSpan: 3 }, { index: 6, colSpan: 4 }, { index: 13, colSpan: 3 }, { index: 17, colSpan: 2 }] },
    { height: 35, cells: [{ index: 2, colSpan: 3 }, { index: 5, colSpan: 2 }, { index: 7, colSpan: 3 }, { index: 13, colSpan: 2 },
        { index: 15, colSpan: 2 }, { index: 17, colSpan: 2 }] },
    { height: 35, cells: [{ index: 2, colSpan: 3 }, { index: 6, colSpan: 4 }, { index: 13, colSpan: 2 }, { index: 16, colSpan: 2 }] },
    { height: 35, cells: [{ index: 2, colSpan: 4 }, { index: 7, colSpan: 3 }, { index: 13, colSpan: 2 }, { index: 15, colSpan: 2 },
        { index: 17, colSpan: 2 }] },
    { height: 35, cells: [{ index: 2, colSpan: 2 }, { index: 4, colSpan: 3 }, { index: 7, colSpan: 3 }, { index: 13, colSpan: 2 },
        { index: 15, colSpan: 2 }, { index: 17, colSpan: 2 }] },
    { height: 35, cells: [{ index: 2, colSpan: 2 }, { index: 5, colSpan: 2 }, { index: 7, colSpan: 3 }, { index: 14, colSpan: 2 },
        { index: 16, colSpan: 3 }] },
    { height: 35, cells: [{ index: 2, colSpan: 3 }, { index: 5, colSpan: 3 }, { index: 13, colSpan: 3 }, { index: 16, colSpan: 2 }] },
    { height: 35, cells: [{ index: 2, colSpan: 3 }, { index: 7, colSpan: 3 }, { index: 13, colSpan: 2 }, { index: 17, colSpan: 2 }] },
    { height: 35 }];

let sheet: SheetModel[] = [{ name: 'Merge Cells', ranges: [{ dataSource: dataSource }], columns: columns, rows: rows }];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:S1');
        spreadsheet.numberFormat('h:mm AM/PM', 'C1:S1');
        spreadsheet.cellFormat({ verticalAlign: 'middle' }, 'A1:S11');
        // Merging cells using method
        spreadsheet.merge('K4:M4');
        spreadsheet.merge('K4:M6', 'Vertically');
        spreadsheet.merge('K7:M10', 'Horizontally');
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);