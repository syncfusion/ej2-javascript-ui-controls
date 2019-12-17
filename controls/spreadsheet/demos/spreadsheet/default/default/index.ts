/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel, SortEventArgs, CellSaveEventArgs, SaveCompleteEventArgs, CollaborativeEditArgs, BeforeCellFormatArgs } from './../../../../src/index';
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

let sheet: SheetModel[] = [{
    name: 'PriceDetails',
    rangeSettings: [{
        dataSource: dataSource,
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
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    actionBegin:(args: object) => {
        console.log(args);
    },
    actionComplete: (args: SortEventArgs | CellSaveEventArgs | SaveCompleteEventArgs |CollaborativeEditArgs | Object) => {
        //spreadsheet.refreshClient(args as CollaborativeEditArgs);
        console.log(args);
    },
    beforeCellFormat: (args: BeforeCellFormatArgs) => {
        console.log(args);
    },
    openComplete: (args: Object) => {
        console.log(args);
    }
    
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);