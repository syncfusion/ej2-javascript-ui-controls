/**
 * ComboBox Sample
 */
import { ComboBox } from '../../src/combo-box/index';
import { Button } from '@syncfusion/ej2-buttons';

    let empList: { [key: string]: Object }[] = [
        { id: 'level1', country: 'AMERICAN FOOTBALL' }, { id: 'level2', country: 'BADMINTON' },
        { id: 'level3', country: 'BASKETBALL' }, { id: 'level4', country: 'CRICKET' },
        { id: 'level5', country: 'FOOTBALL' }, { id: 'level6', country: 'GOLF' },
        { id: 'level7', country: 'HOCKEY' }, { id: 'level8', country: 'RUGBY' },
        { id: 'level9', country: 'SNOOKER' }, { id: 'level10', country: 'TENNIS' },
    ];

    let listObj: ComboBox = new ComboBox({
        dataSource: empList,
        fields: { text: 'country' },
        sortOrder: 'Ascending',
		placeholder: 'Select a game',
        width: '250px',
        index: -1,
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