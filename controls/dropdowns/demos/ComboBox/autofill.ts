/**
 * combo-box autofill Sample
 */
import { ComboBox } from '../../src/combo-box/index';
import { Button } from '@syncfusion/ej2-buttons';

let empList: { [key: string]: Object }[] = [
    { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
    { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
    { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
    { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
    { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
];

let listObj: ComboBox = new ComboBox({
    dataSource: empList,
    fields: { text: 'sports', value: 'id' },
    popupHeight: '300px',
    autofill: true,
    allowCustom:true
});
listObj.appendTo('#list');
