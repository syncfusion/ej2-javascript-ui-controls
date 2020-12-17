/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, getFormatFromType } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { GDPData } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let sheet: SheetModel[] = [{
    name: 'GDP',
    ranges: [{ dataSource:  GDPData , startCell: 'A3' }],
    rows: [
        {
            height: 30,
            cells: [
                {
                    value: 'Gross Domestic Product (in trillions)',
                    style: {
                        backgroundColor: '#e56590', color: '#fff',
                        fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'
                    }
                }
            ]
        },
        {
            cells: [
                { index: 6, chart: [{ type: 'Column', range: 'A3:E10' }] }
            ]
        }
    ],
    columns: [
        { width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }
    ]
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    created: (args: object) => {
        // Formatting cells dynamically using cellFormat method
        spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A3:E3');
        // Applying currency format to the specified range.
        spreadsheet.numberFormat(getFormatFromType('Currency'), 'B4:E10');
        // Merging the cells from A1 to E1
        spreadsheet.merge('A1:E1');
    }
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);