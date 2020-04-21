/**
 * Spreadsheet sheet visibility sample
 */
import { Spreadsheet, SheetModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.getElementById('wrapper').style.height = `${document.documentElement.clientHeight - 70}px`;

let sheets: SheetModel[] = [{
    name: 'Visible Sheet',
    ranges: [{ dataSource: dataSource }],
    columns: [{ width: 150 }, { width: 110 }, { width: 110 }, { width: 85 }, { width: 85 }, { width: 85 }, { width: 85 },
        { width: 85 }],
    // State sets as `Visible` by default. No need to said in sample
    state: 'Visible'
},
{
    name: 'Very Hidden Sheet',
    ranges: [{ dataSource: dataSource }],
    columns: [{ width: 150 }, { width: 110 }, { width: 110 }, { width: 85 }, { width: 85 }, { width: 85 }, { width: 85 },
        { width: 85 }],
    // Sets sheet state as `VeryHidden`. It can't be unhidden.
    state: 'VeryHidden'
},
{
    name: 'Hidden Sheet',
    ranges: [{ dataSource: dataSource }],
    columns: [{ width: 150 }, { width: 110 }, { width: 110 }, { width: 85 }, { width: 85 }, { width: 85 }, { width: 85 },
        { width: 85 }],
    // Sets sheet state as `Hidden`. It can be unhidden dynamically.
    state: 'Hidden'
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        // Applies style formatting to active visible sheet
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D2:H11');
        // Applies style formatting to active hidden sheet
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'Hidden Sheet!A1:H1');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'Hidden Sheet!D2:H11');
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    showFormulaBar: false
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);