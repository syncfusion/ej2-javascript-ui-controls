/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';

    let listObj1: DropDownList = new DropDownList({
        dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svcs/' }),
        query: new Query().from('Customers').select('ContactName').take(7),
        fields: { text: 'ContactName' },
        width: '350px',
        placeholder: 'Select a Customer'
    });
    listObj1.appendTo('#list1');
    