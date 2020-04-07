/**
 * Spreadsheet cell formatting sample
 */
import { Spreadsheet, SheetModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 70}px`;

let sheet: SheetModel[] = [{
    name: 'Cell Format',
    rows: [{
        cells: [
            { value: 'Font Family' },
            { value: 'Arial' },
            { value: 'Times New Roman' },
            { value: 'Tahoma' },
            { value: 'Verdana' },
            { value: 'Calibri' }
        ]
    },
    {
        index: 2,
        cells: [
            { value: 'Font Style' },
            { value: 'Bold', style: { fontWeight: 'bold' } },
            { value: 'Italic', style: { fontStyle: 'italic' } }
        ]
    },
    {
        index: 4,
        cells: [
            { value: 'Font Size' },
            { value: '8pt', style: { fontSize: '8pt' } },
            { value: '11pt', style: { fontSize: '11pt' } },
            { value: '12pt', style: { fontSize: '12pt' } },
            { value: '14pt', style: { fontSize: '14pt' } },
            { value: '16pt', style: { fontSize: '16pt' } }
        ]
    },
    {
        index: 6,
        cells: [
            { value: 'Font Color' },
            { value: 'Font Color', style: { color: '#ec2024' } },
            { value: 'Fill Color', style: { backgroundColor: '#FFEB9C' } },
            { value: 'Font/Fill Color', style: { backgroundColor: '#C6EFCE', color: '#006100' } }
        ]
    },
    {
        index: 8,
        cells: [
            { value: 'Text Decoration' },
            { value: 'Underline', style: { textDecoration: 'underline' } },
            { value: 'Strikethrough', style: { textDecoration: 'line-through' } },
            { value: 'Underline/Strikethrough', style: { textDecoration: 'underline line-through' } }
        ]
    },
    {
        index: 10,
        cells: [
            { value: 'Vertical Alignment' },
            { value: 'Top', style: { verticalAlign: 'top' } },
            { value: 'Middle', style: { verticalAlign: 'middle' } },
            { value: 'Bottom', style: { verticalAlign: 'bottom' } }
        ],
        height: 56
    },
    {
        index: 12,
        cells: [
            { value: 'Text Alignment' },
            { value: 'Left', style: { textAlign: 'left' } },
            { value: 'Center', style: { textAlign: 'center' } },
            { value: 'Right', style: { textAlign: 'right' } }
        ]
    }],
    columns: [
        { width: 134 },
        { width: 100 },
        { width: 160 },
        { width: 176 },
        { width: 74 }
    ]
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    cellStyle: { fontSize: '12pt' },
    dataBound: (): void => {
        if (spreadsheet.sheets[spreadsheet.activeSheetIndex].name === 'Cell Format') {
            spreadsheet.cellFormat({ color: '#2f5496', fontWeight: 'bold' }, 'A1:A13');
            spreadsheet.cellFormat({ fontFamily: 'Arial' }, 'B1:B13');
            spreadsheet.cellFormat({ fontFamily: 'Times New Roman' }, 'C1:C13');
            spreadsheet.cellFormat({ fontFamily: 'Tahoma' }, 'D1:D13');
            spreadsheet.cellFormat({ fontFamily: 'Verdana' }, 'E1:E13');
        }

    },
    openUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize () {
    document.body.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);