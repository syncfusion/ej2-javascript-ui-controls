/**
 * Sorting Sample
 */
import { ListBox } from '../../src/list-box/index';
import { Button } from '@syncfusion/ej2-buttons';

let empList: { [key: string]: Object }[] = [
    { id: 'level1', country: 'AMERICAN FOOTBALL' }, { id: 'level2', country: 'BADMINTON' },
    { id: 'level3', country: 'BASKETBALL' }, { id: 'level4', country: 'CRICKET' },
    { id: 'level5', country: 'FOOTBALL' }, { id: 'level6', country: 'GOLF' },
    { id: 'level7', country: 'HOCKEY' }, { id: 'level8', country: 'RUGBY' },
    { id: 'level9', country: 'SNOOKER' }, { id: 'level10', country: 'TENNIS' },
];

let vegetableData: { [key: string]: Object }[] = [
    { Vegetable: 'Cabbage', Category: 'Leafy and Salad', Id: 'item1' },
    { Vegetable: 'Spinach', Category: 'Leafy and Salad', Id: 'item2' },
    { Vegetable: 'Wheat grass', Category: 'Leafy and Salad', Id: 'item3' },
    { Vegetable: 'Yarrow', Category: 'Leafy and Salad', Id: 'item4' },
    { Vegetable: 'Pumpkins', Category: 'Leafy and Salad', Id: 'item5' },
    { Vegetable: 'Chickpea', Category: 'Beans', Id: 'item6' },
    { Vegetable: 'Green bean', Category: 'Beans', Id: 'item7' },
    { Vegetable: 'Horse gram', Category: 'Beans', Id: 'item8' },
    { Vegetable: 'Garlic', Category: 'Bulb and Stem', Id: 'item9' },
    { Vegetable: 'Nopal', Category: 'Bulb and Stem', Id: 'item10' },
    { Vegetable: 'Onion', Category: 'Bulb and Stem', Id: 'item11' }
];

let listObj: ListBox = new ListBox({
    dataSource: empList,
    fields: { value: 'country' },
    sortOrder: 'Ascending'
});
listObj.appendTo('#listbox');


let listBoxGroup: ListBox = new ListBox({
    dataSource: vegetableData,
    fields: { groupBy: 'Category', text: 'Vegetable', value: 'Id' },
});
listBoxGroup.appendTo('#listboxgroup');

let button: Button = new Button();
button.appendTo('#btn');

let button2: Button = new Button();
button2.appendTo('#btn2');

button.element.onclick = () => { btnClickHandler(button.element, listObj); };
button2.element.onclick = () => { btnClickHandler(button2.element, listBoxGroup); };

function btnClickHandler(ele: HTMLElement, listObj: ListBox): void {
    if (ele.innerText === 'ASCENDING') {
        listObj.sortOrder = 'Ascending';
        listObj.dataBind();
        ele.innerText = 'DESCENDING';
    } else {
        listObj.sortOrder = 'Descending';
        listObj.dataBind();
        ele.innerText = 'ASCENDING';
    }
}