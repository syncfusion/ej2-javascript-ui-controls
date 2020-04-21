/**
 * Spreadsheet hide/show gridlines and headers sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 20}px`;

let columns: ColumnModel[] = [{ width: 150 }, { width: 110 }, { width: 110 }, { width: 85 }, { width: 85 }, { width: 85 }, { width: 85 },
    { width: 85 }];

let sheets: SheetModel[] = [{
    name: 'Price Details',
    ranges: [{ dataSource: dataSource }],
    columns: columns,
    // hiding the gridlines in `Price Details` sheet
    showGridLines: false,
    // hiding the headers in `Price Details` sheet
    showHeaders: false
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D2:H11');
        // The gridlines has be removed, so setting border to range of cells.
        spreadsheet.setBorder({ border: '1px solid #e0e0e0' }, 'A1:H11');
    }
});

spreadsheet.appendTo('#spreadsheet');