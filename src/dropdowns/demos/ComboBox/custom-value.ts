import { FilteringEventArgs } from './../../src/drop-down-base/index';
import { ComboBox } from './../../src/combo-box/index';
import '../../node_modules/es6-promise/dist/es6-promise';
import { Button } from '@syncfusion/ej2-buttons';
import { Query } from '@syncfusion/ej2-data';

    let empList: { [key: string]: Object }[] = [
        { id: 'level1', country: 'American Football' }, { id: 'level2', country: 'Badminton' },
        { id: 'level3', country: 'Basketball' }, { id: 'level4', country: 'Cricket' },
        { id: 'level5', country: 'Football' }, { id: 'level6', country: 'Golf' },
        { id: 'level7', country: 'Hockey' }, { id: 'level8', country: 'Rugby' },
        { id: 'level9', country: 'Snooker' }, { id: 'level10', country: 'Tennis' },
    ];
    let comboBoxObj: ComboBox = new ComboBox({
        dataSource: empList,
        fields: { text: 'country', value: 'id' },
        placeholder: 'Select a customer',
        popupHeight: '230px',
        width: '350px',
        allowFiltering: true,
        noRecordsTemplate: '<div id="nodata"> No matched item, do you want to add it as new item in list?</div> <button onClick="addNew()" class="e-control e-btn">Add New Item</button>',
        filtering: function (e) {
            var query = new Query().select(['country', 'id']);
            query = (e.text !== '') ? query.where('country', 'contains', e.text, true) : query;
            e.updateData(empList, query);
        }
    });
    comboBoxObj.appendTo('#combobox');