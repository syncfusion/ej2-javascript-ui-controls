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
        locale: 'fr-BE',
        placeholder: 'Select an employee',
    });
    listObj.appendTo('#list');

    L10n.load({
     'fr-BE': {
        'dropdowns': {
                'noRecordsTemplate': "Pas de modèle d'enregistrement",
            }
        },
    });