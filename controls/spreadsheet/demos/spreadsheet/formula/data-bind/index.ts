import { Spreadsheet, SheetModel } from './../../../../src/index';
import { formulaData as dataSource } from './../../../common/data-source';

/**
 * Spreadsheet formula datasource binding sample.
 */
let sheet: SheetModel[] = [{
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A1'
    }],
    columns: [
        { width: 120 },
        { index: 3, width: 120 },
        { width: 80 }
    ]
}];
let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
});
spreadsheet.appendTo('#spreadsheet');