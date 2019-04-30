/**
 * Drag and Drop Sample
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

let vegetableData: { [key: string]: Object }[] = [
    { text: 'Cabbage', id: 'item1' },
    { text: 'Spinach', id: 'item2' },
    { text: 'Wheat grass', id: 'item3' },
    { text: 'Yarrow', id: 'item4' },
    { text: 'Pumpkins', id: 'item5' },
    { text: 'Chickpea', id: 'item6' },
    { text: 'Green bean', id: 'item7' },
    { text: 'Horse gram', id: 'item8' },
    { text: 'Garlic', id: 'item9' },
    { text: 'Nopal', id: 'item10' },
    { text: 'Onion', id: 'item11' }
];

let listObj: ListBox = new ListBox({
    scope: '#listbox2', dataSource: data,
    toolbarSettings: { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
});
listObj.appendTo('#listbox1');

let listObj2: ListBox = new ListBox({ dataSource: vegetableData });
listObj2.appendTo('#listbox2');