/**
 * MultiSelect Sample
 */

import { MultiSelect } from '../../src/multi-select/index';
import { Query, DataManager } from '@syncfusion/ej2-data';


let listObj: MultiSelect = new MultiSelect({
    dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
    query: new Query().from('Customers').select('ContactName').take(7),
    fields: { text: 'ContactName' },
    placeholder: 'Select a name',
    popupWidth: '250px',
    popupHeight: '200px',
});
listObj.appendTo('#component');

let listObj1: MultiSelect = new MultiSelect({
    dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
    query: new Query().from('Customers').select('ContactName').take(7),
    fields: { text: 'ContactName' },
    placeholder: 'Select a name',
    popupWidth: '250px',
    popupHeight: '200px',
    mode: 'Box'
});

listObj1.appendTo('#box');
let listObj2: MultiSelect = new MultiSelect({
    dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
    query: new Query().from('Customers').select('ContactName').take(7),
    fields: { text: 'ContactName' },
    placeholder: 'Select a name',
    popupWidth: '250px',
    popupHeight: '200px',
    mode: 'Delimiter'
});
listObj2.appendTo('#delimiter');