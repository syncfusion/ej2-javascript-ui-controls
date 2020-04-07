/**
 * Spreadsheet ribbon disable sample
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
    name: 'PriceDetails',
    ranges: [{ dataSource: dataSource }],
    rowCount: 200,
    columns: columns
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        spreadsheet.enableRibbonTabs(['Insert', 'View'], false);
        spreadsheet.enableToolbarItems('Home', ['spreadsheet_line-through', 'spreadsheet_underline', 'spreadsheet_vertical_align'], false);
        spreadsheet.enableToolbarItems('Formulas', [0], false);
    },
    fileMenuBeforeOpen: (): void => {
        spreadsheet.enableFileMenuItems(['New', 'Comma-separated values', 'Microsoft Excel 97-2003'], false);
        spreadsheet.enableFileMenuItems([`${spreadsheet.element.id}_Open`], false, true);
    }
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);