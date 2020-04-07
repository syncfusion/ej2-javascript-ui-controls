/**
 * Remote data binding
 */
import { Spreadsheet } from './../../../../src/index';
import { DataManager, Query, WebApiAdaptor } from '@syncfusion/ej2-data';

let dataManager: DataManager = new DataManager({
    url: 'https://ej2services.syncfusion.com/production/web-services/api/Orders',
    adaptor: new WebApiAdaptor,
});
let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: [{
        ranges: [{
            dataSource: dataManager, startCell: 'A1',
            query: new Query().select(['OrderID', 'CustomerID', 'EmployeeID', 'Freight', 'ShipCountry'])
        }]
    }]
});
spreadsheet.appendTo('#spreadsheet');