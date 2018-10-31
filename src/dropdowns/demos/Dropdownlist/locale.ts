/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';

    let empList: { [key: string]: Object }[] = [];

    let listObj: DropDownList = new DropDownList({
        dataSource: empList,
        width: '350px',
        locale: 'en-US',
        placeholder: 'Select an employee',
    });
    listObj.appendTo('#list');

    
    let listObj1: DropDownList = new DropDownList({
        dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svcs/' }),
        query: new Query().from('Customers').select('ContactName').take(7),
        fields: { text: 'ContactName' },
        width: '350px',
        locale: 'en-US',
        placeholder: 'Select a Customer'
    });
    listObj1.appendTo('#list1');

    
    let button: HTMLElement = document.getElementById('btn');
    button.onclick = () => {
        listObj.locale = 'fr-BE';
        listObj.dataBind();
        listObj1.locale = 'fr-BE';
        listObj1.dataBind();
     };

    L10n.load({
     'fr-BE': {
        'dropdowns': {
                'noRecordsTemplate': "Pas de modèle d'enregistrement",
                'actionFailureTemplate': "Modèle d'échec d'action",
            }
        },
     'en-US': {
        'dropdowns': {
                'noRecordsTemplate': 'Nothing to show',
                'actionFailureTemplate': "Service Failure",
            }
        }
    });