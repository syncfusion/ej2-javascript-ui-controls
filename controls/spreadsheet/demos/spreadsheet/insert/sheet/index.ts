/**
 * Spreadsheet insert sheet sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { productData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 20}px`;

let columns: ColumnModel[] = [{ width: 90 }, { width: 220 }, { width: 90 }, { width: 140 }, { width: 90 }, { width: 100 }, { width: 100 }];

let sheets: SheetModel[] = [{ ranges: [{ dataSource: dataSource }], columns: columns }];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        // Applies style formatting before inserting the rows
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        // inserting a sheet at 1st index
        spreadsheet.insertSheet([{ index: 1, ranges: [{ dataSource: dataSource }], columns: columns }]);
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');