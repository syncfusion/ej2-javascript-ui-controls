/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';

let empList: { [key: string]: Object }[] = [
    { id: 'level1', country: 'American Football' }, { id: 'level2', country: 'Badminton' },
    { id: 'level3', country: 'Basketball' }, { id: 'level4', country: 'Cricket' },
    { id: 'level5', country: 'Football' }, { id: 'level6', country: 'Golf' },
    { id: 'level7', country: 'Hockey' }, { id: 'level8', country: 'Rugby' },
    { id: 'level9', country: 'Snooker' }, { id: 'level10', country: 'Tennis' },
];

let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('changeLog');
let listObj: AutoComplete = new AutoComplete({
    dataSource: empList,
    fields: { value: 'country' },
    width: '250px',
    placeholder: 'Find a game',
    popupHeight: '200px',
    popupWidth: '250px',
    select: () => {
        textArea.value = textArea.value + '\n Select event triggered';
    },
    focus: () => {
        textArea.value = textArea.value + '\n Focus event triggered';
    },
    blur: () => {
        textArea.value = textArea.value + '\n Blur event triggered';
    },
    change: () => {
        document.getElementById('value').textContent = listObj.value !== null ? listObj.value.toString() : 'null';
        document.getElementById('text').textContent = listObj.text !== null ? listObj.text.toString() : 'null';;
        document.getElementById('index').textContent = listObj.index !== null ? listObj.index.toString() : 'null';
        textArea.value = textArea.value + '\n Change event triggered';
    }
});
listObj.appendTo('#list');

document.getElementById('reset').addEventListener('click', () => {
    textArea.value = '';
})