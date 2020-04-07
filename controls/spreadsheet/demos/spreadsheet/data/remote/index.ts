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
        ranges: [{
            dataSource: dataManager, startCell: 'A1',
            query: new Query().select(['OrderID', 'CustomerID', 'EmployeeID', 'ShipVia', 'Freight', 'ShipCountry']).take(200)
        }]
    }],
    height: '70%',
    width: '70%'
});
spreadsheet.appendTo('#spreadsheet');