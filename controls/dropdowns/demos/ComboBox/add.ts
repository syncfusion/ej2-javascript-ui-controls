/**
 * combo-box AddItem Sample
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
    value: 'level5',
    fields: { text: 'sports', value: 'id' },
    sortOrder: 'Ascending',
    width: '250px',
    index: -1,
    popupHeight: '200px',
    popupWidth: '250px',
    allowCustom: true
});
listObj.appendTo('#list');
let button: Button = new Button();
button.appendTo('#btn');

let buttons: Button = new Button();
buttons.appendTo('#btn1');

let button1: HTMLElement = document.getElementById('btn');
button1.onclick = () => {
    listObj.addItem({ id: 'level11', sports: 'Kabadi' });
};
let button2: HTMLElement = document.getElementById('btn1');
button2.onclick = () => {
     listObj.addItem({ id: 'level11', sports: 'Kabadi' }, 0);
};