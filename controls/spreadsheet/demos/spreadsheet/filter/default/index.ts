/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel, initiateFilterUI } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource, getTradeData } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';
import { DataManager } from '@syncfusion/ej2-data';

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

let sheet: SheetModel[] = [
    {
        rangeSettings: [{
            dataSource: dataSource,
            startCell: 'A1'
        }],
        rowCount: 200,
        columns: columns
    },
    {
        rangeSettings: [{
            dataSource: new DataManager(getTradeData(30)),
            startCell: 'A1'
        }],
        rowCount: 200,
        columns: columns
    }];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    beforeDataBound: (): void => {
        if (spreadsheet.sheets[spreadsheet.activeSheetTab - 1].name === 'Sheet1') {
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        }
        if (spreadsheet.sheets[spreadsheet.activeSheetTab - 1].name === 'Sheet2') {
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:K1');
        }
    },
    openUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/save',
    allowFiltering: true,
    dataBound: function () {

    }
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);
document.getElementById("btn").addEventListener('click', filter);
document.getElementById("btn1").addEventListener('click', clearFilter);

function filter() { // check in Sheet 1
    debugger;
    spreadsheet.applyFilter();
}

function clearFilter() { //Check in Sheet 2
    debugger;
    spreadsheet.clearFilter();
}