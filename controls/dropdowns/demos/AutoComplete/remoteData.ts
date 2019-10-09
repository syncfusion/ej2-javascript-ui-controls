/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';
import { Query, DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import '../../node_modules/es6-promise/dist/es6-promise';


let listObj: AutoComplete = new AutoComplete({
        dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
        query: new Query().from('Customers').select('ContactName').take(7),
        fields: { value : 'ContactName' },
        placeholder: 'Select a name',
        popupWidth: '250px',
        popupHeight: '200px',
        width: '250px',
        autofill:true,
        filterType: 'StartsWith'
    });
    listObj.appendTo('#list');
