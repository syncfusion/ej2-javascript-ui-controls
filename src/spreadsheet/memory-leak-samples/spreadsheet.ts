/**
 * Spreadsheet memory leak sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from '../src/index';
import { defaultData } from './data';
import '../node_modules/es6-promise/dist/es6-promise';

let wrapper: HTMLElement = document.getElementById('wrapper');
wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [
    { width: 130 },
    { width: 92 },
    { width: 96 }
];

let sheet: SheetModel[] = [{
    name: 'Price Details',
    ranges: [{ dataSource: defaultData, startCell: 'A1' }],
    rowCount: 200,
    columns: columns,
}];

let spreadsheet: Spreadsheet;
document.getElementById('render').addEventListener('click', renderSpreadsheet);
document.getElementById('destroy').addEventListener('click', destorySpreadsheet);

function renderSpreadsheet(): void {
    spreadsheet = new Spreadsheet({
        sheets: sheet,
        created: (): void => {
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        },
        openUrl: 'https://services.syncfusion.com/js/production/api/spreadsheet/open',
        saveUrl: 'https://services.syncfusion.com/js/production/api/spreadsheet/save',
        actionBegin: (args: Object) => {
            console.log(args);
        },
        actionComplete: (args: Object) => {
            console.log(args);
        }
    });
    spreadsheet.appendTo('#spreadsheet');
}

function destorySpreadsheet(): void {
    if (spreadsheet && !spreadsheet.isDestroyed) {
        spreadsheet.destroy();
    }
}
