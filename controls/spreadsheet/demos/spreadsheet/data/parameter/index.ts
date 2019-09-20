/**
 * Remote data binding
 */
import { Spreadsheet } from './../../../../src/index';
import { DataManager, Query, ODataAdaptor } from '@syncfusion/ej2-data';

let dataManager: DataManager = new DataManager({
    url: 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders',
    adaptor: new ODataAdaptor,
});
let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: [{
        rangeSettings: [{
            dataSource: dataManager, startCell: 'A1',
            query: new Query().select(['OrderID', 'CustomerID', 'EmployeeID', 'ShipVia', 'Freight',
                'ShipRegion', 'ShipCountry']).addParams('ej2spreadsheet', 'true')
        }]
    }]
});
spreadsheet.appendTo('#spreadsheet');