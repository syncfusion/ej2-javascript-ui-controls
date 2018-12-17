/**
 * Default Sample
 */
import { InPlaceEditor } from '../../../src/inplace-editor/base/inplace-editor';

let today: Date = new Date();
let currentYear: number = today.getFullYear();
let currentMonth: number = today.getMonth();
let currentHour: number = today.getHours();
let currentMinute: number = today.getMinutes();
let currentSecond: number = today.getSeconds();

let editObj: InPlaceEditor = new InPlaceEditor({
    mode: 'Inline',
    type: 'DateTime',
    model: {
        min: new Date(currentYear, currentMonth, 7, 0, 0, 0),
        max: new Date(currentYear, currentMonth, 27,currentHour,currentMinute,currentSecond),
        value: new Date(new Date().setDate(14))
    }
});
editObj.appendTo('#element');

document.getElementById('renderMode').addEventListener('change', (e: any) => {
    switch (e.target.value) {
        case "1":
            document.body.classList.remove('e-bigger');
            break;
        case "2":
            document.body.classList.add('e-bigger');
            break;
    }
});

document.getElementById('themes').addEventListener('change', (e: any) => {
    document.getElementsByTagName('link')[0].href = '../theme-files/' + e.target.value + '.css';
});
