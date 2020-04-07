/**
 * Spreadsheet merge cells sample
 */
import { Spreadsheet, SheetModel, ColumnModel, RowModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [
    {
        width: 130
    },
    {
        width: 92
    },
    {
        width: 96
    }
];

let rows: RowModel[] = [{
    cells: [{ value: 'Price Details',
    style: { fontWeight: 'bold', fontSize: '14pt', textAlign: 'center', verticalAlign: 'middle' },
    colSpan: 8, rowSpan: 2 }]
}];

let sheet: SheetModel[] = [{
    name: 'Merge Cells',
    ranges: [{ dataSource: dataSource, startCell: 'A3' }],
    columns: columns,
    rows: rows
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A3:H3');
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