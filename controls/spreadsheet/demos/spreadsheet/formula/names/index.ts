import { Spreadsheet, SheetModel, DefineNameModel } from './../../../../src/index';
import { formulaData as dataSource } from './../../../common/data-source';

/**
 * Spreadsheet formula name manager sample.
 */
let definedNames: DefineNameModel[] = [
    { name: 'value', refersTo: '=Sheet1!B1' },
    { name: 'Range', refersTo: '=Sheet1!B1:B5' },
    { name: 'Cross_Range', refersTo: '=Sheet2!C5:C10' },
];
let sheet: SheetModel[] = [
    {
        range: [{
            dataSource: dataSource,
            startCell: 'A1'
        }],
        columns: [
            { width: 120 },
            { index: 3, width: 120 },
            { width: 80 }
        ]
    },
    {
        
    }
];
let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    definedNames: definedNames
});
spreadsheet.appendTo('#spreadsheet');