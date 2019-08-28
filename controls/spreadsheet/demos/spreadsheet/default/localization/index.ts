/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel } from './../../../../src/index';
import { enableRipple, L10n } from '@syncfusion/ej2-base';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 20}px`;

L10n.load({
    'de-DE': {
        'spreadsheet': {
            'EmptyNamedRange': 'No Defined Named Ranges',
            'Cut': 'Cut',
            'Copy': 'Copy',
            'Paste': 'Paste',
            'Bold': 'Bold',
            'Italic': 'Italic',
            'Underline': 'Underline',
            'InsertFunction': 'Insert Function',
            'NameBox': 'Name Box',
            'ShowHeaders': 'Show Headers',
            'HideHeaders': 'Hide Headers',
            'ShowGridLines': 'Show Gridlines',
            'HideGridLines': 'Hide Gridlines',
            'AddSheet': 'Add Sheet',
            'ListAllSheet': 'List All Sheets',
            'FullScreen': 'Full Screen',
            'CollapseToolbar': 'Collapse Toolbar',
            'ExpandToolbar': 'Expand Toolbar',
            'CollapseFormulaBar': 'Collapse Formula Bar',
            'ExpandFormulaBar': 'Expand Formula Bar',
            'File': 'File',
            'Home': 'Home',
            'Formulas': 'Formulas',
            'View': 'View',
            'New': 'New',
            'Open': 'Open',
            'SaveAs': 'Save As',
            'FormulaBar': 'Formula Bar',
            'Ok': 'Ok',
            'Close': 'Close',
            'Cancel': 'Cancel'
        }
    }
});

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
    openUrl: '//172.16.105.192:4345/ej2_spread_server/WebMvcApplication1/Home/Open',
    saveUrl: '//172.16.105.192:4345/ej2_spread_server/WebMvcApplication1/Home/Export',
    locale: 'de-DE'
});

spreadsheet.appendTo('#spreadsheet');