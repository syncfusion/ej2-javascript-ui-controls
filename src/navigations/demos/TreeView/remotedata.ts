import { TreeView } from '../../src/treeview/treeview';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import '../../node_modules/es6-promise/dist/es6-promise';

let data: DataManager = new DataManager({
    url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
    adaptor: new ODataV4Adaptor,
    crossDomain: true,
});
let query: Query = new Query().from('Employees').select('EmployeeID,FirstName,Title').take(5);
let query1: Query = new Query().from('Orders').select('OrderID,EmployeeID,ShipName').take(5);

let tree1: TreeView = new TreeView({
    fields: { dataSource: data, query: query, id: 'EmployeeID', text: 'FirstName', hasChildren: 'EmployeeID',
        child: { dataSource: data, query: query1, id: 'OrderID', parentID: 'EmployeeID', text: 'ShipName' }
    }
});
tree1.appendTo('#tree1');