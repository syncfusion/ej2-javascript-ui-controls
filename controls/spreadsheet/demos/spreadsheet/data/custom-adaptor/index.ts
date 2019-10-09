/**
 * Remote data binding
 */
import { Spreadsheet } from './../../../../src/index';
import { DataManager, Query, ODataAdaptor } from '@syncfusion/ej2-data';

class SerialNoAdaptor extends ODataAdaptor {
    public processResponse(): Object {
        let i: number = 0;
        // calling base class processResponse function
        let original: { result: Object[], count: number } = super.processResponse.apply(this, arguments);
        // adding serial number
        original.result.forEach((item: { SNo: number }) => item.SNo = ++i);
        return { result: original.result, count: original.count };
    }
}

let dataManager: DataManager = new DataManager({
    url: 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders',
    adaptor: new SerialNoAdaptor,
});
let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: [{
        rangeSettings: [{
            dataSource: dataManager, startCell: 'A1',
            query: new Query().select(['OrderID', 'CustomerID', 'EmployeeID', 'ShipVia', 'Freight', 'ShipRegion', 'ShipCountry'])
        }]
    }]
});
spreadsheet.appendTo('#spreadsheet');