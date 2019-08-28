/**
 * Spreadsheet RTL sample
 */
import { Spreadsheet, SheetModel, Selection, KeyboardNavigation, Edit, ContextMenu, Calculate } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';

Spreadsheet.Inject(Selection, Edit, KeyboardNavigation, ContextMenu, Calculate);

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 70}px`;

let sheet: SheetModel[] = [{
    rows: [{
        index: 0,
        cells: [{ index: 0, value: 'a1' },
        { index: 1, value: 'b1' },
        { index: 2, value: 'c1' },
        { index: 3, value: 'd1' },
        { index: 4, value: 'e1' }]
    },
    {
        index: 1,
        cells: [{ index: 0, value: 'a2' },
        { index: 1, value: 'b2' },
        { index: 2, value: 'c2' },
        { index: 3, value: 'd2' },
        { index: 4, value: 'e2' },]
    },
    {
        index: 2,
        cells: [{ index: 0, value: 'a3' },
        { index: 1, value: 'b3' },
        { index: 2, value: 'c3' },
        { index: 3, value: 'd3' },
        { index: 4, value: 'e3' },]
    },
    {
        index: 3,
        cells: [{ index: 0, value: 'a4' },
        { index: 1, value: 'b4' },
        { index: 2, value: 'c4' },
        { index: 3, value: 'd4' },
        { index: 4, value: 'e4' },]
    },
    {
        index: 4,
        cells: [{ index: 0, value: 'a5' },
        { index: 1, value: 'b5' },
        { index: 2, value: 'c5' },
        { index: 3, value: 'd5' },
        { index: 4, value: 'e5' },]
    },
    {
        index: 5,
        cells: [{ index: 0, value: 'a6' },
        { index: 1, value: 'b6' },
        { index: 2, value: 'c6' },
        { index: 3, value: 'd6' },
        { index: 4, value: 'e6' },]
    }]
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    allowSave: false,
    allowOpen: false,
    showFormulaBar: false,
    showSheetTabs: false,
    showRibbon: false,
    enableRtl: true
});

spreadsheet.appendTo('#spreadsheet');


switchTheme('#select-theme', spreadsheet);