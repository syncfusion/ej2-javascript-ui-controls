/**
 * Spreadsheet default sample
 */
import { Spreadsheet, ConditionalFormat } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { conditionalFormatData1, conditionalFormatData2 } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: [{
        rows: [{
            height: 30,
            cells: [{
                index: 1,
                value: '2018 Monthly Sales',
            }, {
                index: 15,
                value: '2019 Monthly Sales',
            }]
        }],
        ranges: [{
            dataSource: conditionalFormatData1,
            startCell: 'A2'
            },
            {
                dataSource: conditionalFormatData2,
                startCell: 'O2'
            }
        ],
        conditionalFormats: [
            { type: "BlueDataBar", range: 'B3:C10' },
            { type: "GreenDataBar", range: 'D3:E10' },
            { type: "RedDataBar", range: 'F3:G10' },
        ],
        name: 'Car Sales Record',
        columns: [{
            width: 120
        }]
    },  ],
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    created: () => {
        spreadsheet.merge('A1:N1');
        spreadsheet.merge('O1:AA1');
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A2:AA2');
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle', fontSize: '13pt' }, 'A1:AA1');
        spreadsheet.conditionalFormat({ type: "OrangeDataBar", range: 'H3:I10' });
        spreadsheet.conditionalFormat({ type: "LightBlueDataBar", range: 'J3:K10' });
        spreadsheet.conditionalFormat({ type: "PurpleDataBar", range: 'L3:M10' });
    }
});
//Render initialized Spreadsheet component
spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);
