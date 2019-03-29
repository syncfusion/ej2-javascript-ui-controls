/**
 * ListBox Default Sample
 */
import { ListBox } from '../../src/list-box/index';

let data: { [key: string]: Object }[] = [
    { text: 'Hennessey Venom', id: 'list-01' },
    { text: 'Bugatti Chiron', id: 'list-02' },
    { text: 'Bugatti Veyron Super Sport', id: 'list-03' },
    { text: 'SSC Ultimate Aero', id: 'list-04' },
    { text: 'Koenigsegg CCR', id: 'list-05' },
    { text: 'McLaren F1', id: 'list-06' },
    { text: 'Aston Martin One- 77', id: 'list-07' },
    { text: 'Jaguar XJ220', id: 'list-08' },
    { text: 'McLaren P1', id: 'list-09' },
    { text: 'Ferrari LaFerrari', id: 'list-10' },
];

let listObj: ListBox = new ListBox({ dataSource: data });
listObj.appendTo('#listbox');


document.getElementById('material').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', './../themes/material.css');
};
document.getElementById('fabric').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', './../themes/fabric.css');
};
document.getElementById('bootstrap').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', './../themes/bootstrap.css');
};
document.getElementById('highcontrast').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', './../themes/highcontrast.css');
};