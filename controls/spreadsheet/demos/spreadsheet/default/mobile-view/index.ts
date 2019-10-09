/**
 * Spreadsheet mobile view sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { defaultData as dataSource } from './../../../common/data-source';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 10}px`;

let columns: ColumnModel[] = [
    {
        width: 120
    },
    {
        width: 80
    },
    {
        width: 80
    }
];

let sheet: SheetModel[] = [{
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A1'
    }],
    rowCount: 200,
    columns: columns
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    openUrl: '//172.16.105.192:4345/ej2_spread_server/WebMvcApplication1/Home/Open',
    saveUrl: '//172.16.105.192:4345/ej2_spread_server/WebMvcApplication1/Home/Save'
});

spreadsheet.appendTo('#spreadsheet');
window.addEventListener('resize', onResize);

function onResize() {
    document.body.style.height = `${document.documentElement.clientHeight - 10}px`;
    spreadsheet.resize();
}
