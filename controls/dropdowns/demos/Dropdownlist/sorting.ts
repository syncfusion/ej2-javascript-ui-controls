/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';
import { Button } from '@syncfusion/ej2-buttons';

    let empList: { [key: string]: Object }[] = [
        { id: 'level1', country: 'American Football' }, { id: 'level2', country: 'Badminton' },
        { id: 'level3', country: 'Basketball' }, { id: 'level4', country: 'Cricket' },
        { id: 'level5', country: 'Football' }, { id: 'level6', country: 'Golf' },
        { id: 'level7', country: 'Hockey' }, { id: 'level8', country: 'Rugby' },
        { id: 'level9', country: 'Snooker' }, { id: 'level10', country: 'Tennis' },
    ];

    let listObj: DropDownList = new DropDownList({
        dataSource: empList,
        fields: { text: 'country' },
        sortOrder: 'Ascending',
        width: '250px',
        popupHeight: '200px',
        popupWidth: '250px',
    });
    listObj.appendTo('#list');
    let button: Button = new Button();
    button.appendTo('#btn');

    let button1: HTMLElement = document.getElementById('btn');
    button1.onclick = () => {
        if (button1.innerText === 'ASCENDING') {
            listObj.sortOrder = 'Ascending';
            listObj.dataBind();
            button1.innerText = 'DESCENDING';
        } else {
            listObj.sortOrder = 'Descending';
            listObj.dataBind();
            button1.innerText = 'ASCENDING';
        }
     };