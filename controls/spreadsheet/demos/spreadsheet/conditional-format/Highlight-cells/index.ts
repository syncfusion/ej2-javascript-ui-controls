/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from '../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from '../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let sheet: SheetModel[] = [
    {
        conditionalFormats: [
          { type: "ContainsText", cFColor: "RedFT", value:'shoes', range: 'A2:A11' },
          { type: "DateOccur", cFColor: "YellowFT", value:'7/22/2014', range: 'B2:B11' },
          { type: "GreaterThan", cFColor: "GreenFT", value:'11:26:32 AM', range: 'C2:C11' },
          { type: "LessThan", cFColor: "RedF", value:'20', range: 'D2:D11' },
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
        spreadsheet.conditionalFormat({ type: "Duplicate", cFColor: "RedT", range: 'E2:E11' });
        spreadsheet.conditionalFormat({ type: "Unique", cFColor: "RedFT", range: 'F2:F11' });
        spreadsheet.conditionalFormat({ type: "Between", cFColor: "YellowFT", value:'10,20', range: 'G2:G11' });
        spreadsheet.conditionalFormat({ type: "EqualTo", cFColor: "GreenFT", value: '50', range: 'H2:H11' });
    }
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);