/**
 * Spreadsheet insert sheet sample
 */
import { Spreadsheet, SheetModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 20}px`;

let sheets: SheetModel[] = [{
    name: 'Price Details',
    ranges: [{ dataSource: dataSource }],
    columns: [{ width: 150 }, { width: 110 }, { width: 110 }, { width: 85 }, { width: 85 }, { width: 85 }, { width: 85 },
        { width: 85 }]
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        // Applies style formatting to active sheet before inserting new sheet
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D2:H11');
        // inserting a new sheet with data at 1st index
        // You can also insert empty sheets by specifying the start and end sheet index instead of sheet model
        spreadsheet.insertSheet([{
            index: 1,
            name: 'Inserted Sheet',
            ranges: [{ dataSource: dataSource }],
            columns: [{ width: 150 }, { width: 110 }, { width: 110 }, { width: 85 }, { width: 85 }, { width: 85 }, { width: 85 },
                { width: 85 }]
        }]);
        // Applies style formatting for the inserted sheet
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'Inserted Sheet!A1:H1');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'Inserted Sheet!D2:H11');
    }
});

spreadsheet.appendTo('#spreadsheet');