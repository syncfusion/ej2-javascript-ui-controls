/**
 * Spreadsheet ribbon add sample
 */
import { Spreadsheet, SheetModel, ColumnModel, MenuSelectEventArgs } from './../../../../src/index';
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
    name: 'Price Details',
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
        spreadsheet.addToolbarItems('Home', [{ type: 'Separator' }, { text: 'Custom', tooltipText: 'Custom Btn' }], 2);
        spreadsheet.addToolbarItems('Formulas', [{ type: 'Separator' }, { text: 'Custom Formulas', tooltipText: 'Custom Formulas' }], 2);
        spreadsheet.addFileMenuItems([{ text: 'Export', iconCss: 'e-save e-icons' }], 'Save As');
        spreadsheet.addFileMenuItems([{ text: 'Import', iconCss: 'e-open e-icons' }], 'Open', false);
    },
    fileMenuBeforeOpen: (): void => spreadsheet.hideFileMenuItems(['Save As', 'Open']),
    fileMenuItemSelect: (args: MenuSelectEventArgs): void => {
        switch (args.item.text) {
            case 'Import': (spreadsheet.element.querySelector('#' + spreadsheet.element.id + '_fileUpload') as HTMLElement).click();
                break;
            case 'Export': spreadsheet.save({ saveType: 'Xlsx' });
                break;
        }
    }
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);