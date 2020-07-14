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
            { type: "ThreeArrows", range: 'B3:B10' },
            { type: "ThreeArrowsGray", range: 'C3:C10' },
            { type: "ThreeTriangles", range: 'D3:D10' },
            { type: "FourArrowsGray", range: 'E3:E10' },
            { type: "FourArrows", range: 'F3:F10' },
            { type: "FiveArrowsGray", range: 'G3:G10' },
            { type: "FiveArrows", range: 'H3:H10' },
            { type: "ThreeTrafficLights1", range: 'I3:I10' },
            { type: "ThreeTrafficLights2", range: 'J3:J10' },
            { type: "ThreeSigns", range: 'K3:K10' }
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
        spreadsheet.conditionalFormat({ type: "FourTrafficLights", range: 'L3:L10' });
        spreadsheet.conditionalFormat({ type: "FourRedToBlack", range: 'M3:M10' });
        spreadsheet.conditionalFormat({ type: "ThreeSymbols", range: 'O3:O10' });
        spreadsheet.conditionalFormat({ type: "ThreeSymbols2", range: 'P3:P10' });
        spreadsheet.conditionalFormat({ type: "ThreeFlags", range: 'Q3:Q10' });
        spreadsheet.conditionalFormat({ type: "ThreeStars", range: 'R3:R10' });
        spreadsheet.conditionalFormat({ type: "FourRating", range: 'S3:S10' });
        spreadsheet.conditionalFormat({ type: "FiveQuarters", range: 'T3:T10' });
        spreadsheet.conditionalFormat({ type: "FiveRating", range: 'U3:U10' });
        spreadsheet.conditionalFormat({ type: "FiveBoxes", range: 'V3:V10' });
    }
});
//Render initialized Spreadsheet component
spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);
