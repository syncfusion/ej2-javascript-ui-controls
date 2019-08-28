import { Spreadsheet, SheetModel } from './../../../../src/index';

/**
 * Spreadsheet formula sample
 */
let sheet: SheetModel[] = [{
    rows: [
        {
            index: 0,
            cells: [
                { value: 'JavaScript' },
                { value: '10' },
                { value: '100' },
                { value: '10.1'},
                { index: 5, value: 'SUM' },
                { formula: '=SUM(10,20)' },
                { formula: '=SUM(B1,10)' },
                { formula: '=SUM(20,B1)' },
                { formula: '=SUM(B1,C1,D1)' },
                { formula: '=SUM(B1:B5, 50)' },
                { formula: '=SUM(Sheet1!C2, 10)' },
                { formula: '=SUM(Sheet2!C1, 10)' },
                { formula: '=SUM(Sheet2!C5, 10)' }
            ]
        },
        {
            index: 1,
            cells: [
                { value: 'Angular' },
                { value: '20' },
                { value: '200' },
                { value: '20.2'}
            ]
        },
        {
            index: 2,
            cells: [
                { value: 'React' },
                { value: '30' },
                { value: '300' },
                { value: '30.3'}
            ]
        },
        {
            index: 3,
            cells: [
                { value: 'Vue' },
                { value: '40' },
                { value: '400' },
                { value: '40.4'}
            ]
        },
        {
            index: 4,
            cells: [
                { value: 'Asp.Net Core' },
                { value: '50' },
                { value: '500' },
                { value: '50.5'}
            ]
        }
    ],
    columns: [
        { width: 120 }
    ]
},
{
    rows: [
        {
            index: 0,
            cells: [
                { value: 'JavaScript' },
                { value: '10' },
                { value: '100' },
                { value: '10.1'},
                { index: 5, value: 'SUM' },
                { formula: '=SUM(10,20)' },
                { formula: '=SUM(B1,10)' },
                { formula: '=SUM(20,B1)' },
                { formula: '=SUM(B1,C1,D1)' },
                { formula: '=SUM(B1:B5, 50)' },
                { formula: '=SUM(Sheet2!C2, 10)' },
                { formula: '=SUM(Sheet1!C1, 10)' },
                { formula: '=SUM(Sheet1!C5, 10)' }
            ]
        },
        {
            index: 1,
            cells: [
                { value: 'Angular' },
                { value: '20' },
                { value: '200' },
                { value: '20.2'}
            ]
        },
        {
            index: 2,
            cells: [
                { value: 'React' },
                { value: '30' },
                { value: '300' },
                { value: '30.3'}
            ]
        },
        {
            index: 3,
            cells: [
                { value: 'Vue' },
                { value: '40' },
                { value: '400' },
                { value: '40.4'}
            ]
        },
        {
            index: 4,
            cells: [
                { value: 'Asp.Net Core' },
                { value: '50' },
                { value: '500' },
                { value: '50.5'}
            ]
        }
    ],
    columns: [
        { width: 120 }
    ]
}];
let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
});
spreadsheet.appendTo('#spreadsheet');