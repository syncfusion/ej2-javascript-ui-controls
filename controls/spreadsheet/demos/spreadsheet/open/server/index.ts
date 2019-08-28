import { Spreadsheet, SheetModel, OpenFailureArgs } from '../../../../src/index';

/**
 * Spreadsheet default sample
 */
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
    height: '60%',
    sheets: sheet,
    openUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/save',
    openFailure: function (args: OpenFailureArgs) {
        alert(args.statusText);
    }
});
spreadsheet.appendTo('#spreadsheet');