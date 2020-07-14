/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let sheet: SheetModel[] = [
    {
        conditionalFormats: [
          { type: "Top10Items", cFColor: "RedFT", value: '5', range: 'B2:B11' },
          { type: "Top10Percentage", cFColor: "YellowFT", value: '5', range: 'C2:C11' },
          { type: "Bottom10Items", cFColor: "GreenFT", value: '5', range: 'D2:D11' },
        ],
        ranges: [{
            dataSource: dataSource,
            startCell: 'A1'
        }],
        columns: [
            { width: 130 }, { width: 92 }, { width: 96 }
        ]
    }
];

let spreadsheet: Spreadsheet = new Spreadsheet({ 
    sheets: sheet,
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        spreadsheet.conditionalFormat({ type: "Bottom10Percentage", cFColor: "RedF", value: '5', range: 'E2:E11' });
        spreadsheet.conditionalFormat({ type: "AboveAverage", cFColor: "RedT", range: 'F2:F11' });
        spreadsheet.conditionalFormat({ type: "BelowAverage", cFColor: "RedFT", value:'10,20', range: 'G2:G11' });
    }
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);