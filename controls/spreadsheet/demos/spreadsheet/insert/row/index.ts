/**
 * Spreadsheet insert row sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { productData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight}px`;

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

let sheet: SheetModel[] = [{
    name: 'Insert Row',
    rangeSettings: [{
        dataSource: dataSource
    }],
    rowCount: 200,
    columns: columns
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    created: (): void => {
        spreadsheet.cellFormat({ color: '#2f5496', fontWeight: 'bold', textAlign: 'center' }, 'A1:G1');
        spreadsheet.insertRow(0, 4);
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    document.body.style.height = `${document.documentElement.clientHeight}px`;
    spreadsheet.resize();
}