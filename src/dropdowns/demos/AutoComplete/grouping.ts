/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';

let datasource: { [key: string]: Object }[] = [
    { vegetable: 'Cabbage', category: 'Leafy and Salad' }, { vegetable: 'Spinach', category: 'Leafy and Salad' },
    { vegetable: 'Wheatgrass', category: 'Leafy and Salad' }, { vegetable: 'Yarrow', category: 'Leafy and Salad' },
    { vegetable: 'Chickpea', category: 'Beans' }, { vegetable: 'Green bean', category: 'Beans' },
    { vegetable: 'Horse gram', category: 'Beans' }, { vegetable: 'Garlic', category: 'Bulb and Stem' },
    { vegetable: 'Nopal', category: 'Bulb and Stem' }, { vegetable: 'Onion', category: 'Bulb and Stem' }
];

let grpList: AutoComplete = new AutoComplete({
    dataSource: datasource,
    fields: { groupBy: 'category', value: 'vegetable' },
    placeholder: 'Select a vegetable',
    width: '250px',
    popupHeight: '200px',
    popupWidth: '250px'
});
grpList.appendTo('#list');