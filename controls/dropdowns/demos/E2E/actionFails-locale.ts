/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';

    
    let listObj: DropDownList = new DropDownList({
        dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svcs/' }),
        query: new Query().from('Customers').select('ContactName').take(7),
        fields: { text: 'ContactName' },
        width: '350px',
        locale: 'fr-BE',
        placeholder: 'Select a Customer'
    });
    listObj.appendTo('#list1');

    L10n.load({
     'fr-BE': {
        'dropdowns': {
                'actionFailureTemplate': "Modèle d'échec d'action",
            }
        }
    });