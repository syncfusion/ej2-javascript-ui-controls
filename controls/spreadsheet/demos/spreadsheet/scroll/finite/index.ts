/**
 * Spreadsheet finate scrolling sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { filterData as dataSource } from './../../../common/data-source';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [
    {
        width: 64
    },
    {
        width: 80
    },
    {
        width: 80
    },
    {
        width: 166
    },
    {
        width: 100
    },
    {
        width: 206
    },
    {
        width: 86
    },
    {
        width: 92
    },
    {
        width: 92
    }
];

let sheet: SheetModel[] = [{
    ranges: [{ dataSource: dataSource }],
    rowCount: 200,
    colCount: 200,
    columns: columns
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    scrollSettings: { isFinite: true }
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize() {
    document.body.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);