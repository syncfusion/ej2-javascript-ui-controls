/**
 * Spreadsheet border formatting sample
 */
import { Spreadsheet, SheetModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { productData as dataSource } from '../../../common/data-source';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight}px`;

let sheet: SheetModel[] = [
    {
        name: 'Border Format',
        showGridLines: false,
        range: [{ dataSource: dataSource }],
        columns: [
            { width: 80 }, { width: 80 }, { width: 80 },
            { width: 160 }, { width: 80 }, { width: 85 }, { width: 85 }
        ]
    }
];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    beforeDataBound: (): void => {
        if (spreadsheet.sheets[spreadsheet.activeSheetIndex].name === 'Border Format') {
            spreadsheet.cellFormat({ color: '#2f5496', fontWeight: 'bold', textAlign: 'center' }, 'A1:G1');
            spreadsheet.setBorder({ border: '1px solid #000000' }, 'A1:G78', 'Outer');
            spreadsheet.setBorder({ border: '1px solid #000000' }, 'A1:G78', 'Inner');
        }
    },
    openUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    document.body.style.height = `${document.documentElement.clientHeight}px`;
    spreadsheet.resize();
}