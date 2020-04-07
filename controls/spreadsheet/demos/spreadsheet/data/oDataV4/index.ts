/**
 * OData V4 data binding
 */
import { Spreadsheet } from './../../../../src/index';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';

let dataManager: DataManager = new DataManager({
    url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    adaptor: new ODataV4Adaptor,
});
let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: [{
        ranges: [{
            dataSource: dataManager, startCell: 'A1',
            query: new Query().select(['OrderID', 'CustomerID', 'EmployeeID', 'ShipVia', 'Freight', 'ShipRegion', 'ShipCountry'])
        }]
    }]
});
spreadsheet.appendTo('#spreadsheet');