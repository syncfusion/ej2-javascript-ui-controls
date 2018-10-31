/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';
import { Query, DataManager } from '@syncfusion/ej2-data';


    let listObj: DropDownList = new DropDownList({
        dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
        query: new Query().from('Customers').select('ContactName').take(7),
        fields: { text: 'ContactName' },
        placeholder: 'Select a name',
        popupWidth: '250px',
        popupHeight: '200px',
        width: '250px',
    });
    listObj.appendTo('#list');
