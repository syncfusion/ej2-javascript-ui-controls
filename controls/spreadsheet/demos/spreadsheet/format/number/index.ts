import { Spreadsheet, SheetModel, getFormatFromType } from '../../../../src/index';

/**
 * Spreadsheet number formatting sample.
 */
let sheet: SheetModel[] = [{
    rows: [{
        index: 0,
        cells: [{ index: 0, value: '2/10/2015' },
        { index: 1, value: '35.55', format: getFormatFromType('Percentage') },
        { index: 2, value: '23', format: getFormatFromType('Currency') },
        { index: 3, value: '45', format: getFormatFromType('Accounting') },
        { index: 4, value: '2', format: getFormatFromType('Text') },
        { index: 5, value: '45.23232', format: '0.0000000000' },
        { index: 6, value: '234344.232323223430000', format: '00.0' },
        { index: 7, value: '234344.232323223430000', format: '$0.000#' }
    ]
    },
    {
        index: 1,
        cells: [{ index: 0, value: '243', format: getFormatFromType('ShortDate') },
        { index: 1, value: '35', format: getFormatFromType('General') },
        { index: 2, value: '56', format: getFormatFromType('Number') },
        { index: 3, value: '6666', format: getFormatFromType('Text') },
        { index: 4, value: 'e2' },]
    },
    {
        index: 2,
        cells: [{ index: 0, value: '34', format: getFormatFromType('LongDate') },
        { index: 1, value: '234523', format: getFormatFromType('Scientific') },
        { index: 2, value: '23.45', format: getFormatFromType('Fraction') },
        { index: 3, value: 'd3' },
        { index: 4, value: 'e3' },]
    },
    {
        index: 3,
        cells: [{ index: 0, value: '24323', format: getFormatFromType('Time') },
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
        { index: 3, value: '3445' },
        { index: 4, value: 'e6' }]
    }],
    columns: [{
        width: 180
    }, {
        width: 180
    }, {
        width: 180
    }, {
        width: 180
    }, {
        width: 180
    }]
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    height: '80%',
    sheets: sheet,
    openUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/save'
});
spreadsheet.appendTo('#spreadsheet');
