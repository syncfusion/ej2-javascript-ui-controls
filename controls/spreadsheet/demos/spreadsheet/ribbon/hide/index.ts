/**
 * Spreadsheet ribbon hide sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
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
    ranges: [{ dataSource: dataSource }],
    columns: columns
},
{
    state: 'VeryHidden',
    ranges: [{ dataSource: dataSource }],
    columns: columns
},
{
    state: 'Hidden',
    ranges: [{ dataSource: dataSource }],
    columns: columns
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        spreadsheet.hideRibbonTabs(['Formulas', 'Insert']);
        spreadsheet.addRibbonTabs([{ header: { text: 'Custom' }, content: [{ text: 'Custom', tooltipText: 'Custom Btn' }] }], 'View');
        spreadsheet.hideToolbarItems('Home', [0, 1, 2, 4, 14, 15, 22, 23, 24]);
        spreadsheet.hideToolbarItems('View', [1, 2]);
    },
    fileMenuBeforeOpen: (): void => {
        spreadsheet.hideFileMenuItems(['New', 'Comma-separated values']);
        spreadsheet.hideFileMenuItems([`${spreadsheet.element.id}_Xls`], true, true);
    }
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);