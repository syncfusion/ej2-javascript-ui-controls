/**
 * Spreadsheet insert column sample
 */
import { Spreadsheet, SheetModel, ColumnModel, CellModel, getCellAddress } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { productData } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

document.body.style.height = `${document.documentElement.clientHeight - 20}px`;

let columns: ColumnModel[] = [{ width: 90 }, { width: 220 }, { width: 90 }, { width: 140 }, { width: 100 }, { width: 100 }];

let dataSource: Object[] = productData.slice(0, 10);

let sheets: SheetModel[] = [{ ranges: [{ dataSource: dataSource, startCell: 'A2',
    query: new Query().select(['Product Id', 'Product Name', 'Supplier Id', 'Quantity Per Unit', 'Units In Stock', 'Discontinued']) }],
    columns: columns }];

// Cells model which we are going to update in the inserted 5th column dynamically
let cellsModel: CellModel[] = [{ value: 'Unit Price', style: { fontWeight: 'bold', textAlign: 'center' } }, { value: '18.00' },
    { value: '19.00' }, { value: '10.00' }, { value: '22.00' }, { value: '21.35' }, { value: '25.00' }, { value: '30.00' },
    { value: '21.00' }, { value: '40.00' }, { value: '97.00' }];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheets,
    created: (): void => {
        // Applies style formatting before inserting the column
        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A2:G2');
        // inserting a empty column at 0th index
        spreadsheet.insertColumn();
        // inserting 1 column at the 5th index with column model
        spreadsheet.insertColumn([{ index: 5, width: 90 }]);
        let rowIndex: number = 1;
        // Updating the 5th column data
        cellsModel.forEach((cell: CellModel): void => {
            spreadsheet.updateCell(cell, getCellAddress(rowIndex, 5)); rowIndex++;
        });
        // Applies style formatting after the columns are inserted
        spreadsheet.cellFormat({ textAlign: 'center' }, 'B3:B12');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'D3:D12');
        spreadsheet.cellFormat({ textAlign: 'center' }, 'F3:H12');
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');