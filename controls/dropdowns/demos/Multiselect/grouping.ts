/**
 * MultiSelect Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-base/index';

 let datasource: { [key: string]: Object }[] = [
        { vegetable: 'Cabbage', category: 'Leafy and Salad' }, { vegetable: 'Spinach', category: 'Leafy and Salad' },
        { vegetable: 'Wheatgrass', category: 'Leafy and Salad' }, { vegetable: 'Yarrow', category: 'Leafy and Salad' },
        { vegetable: 'Chickpea', category: 'Beans' }, { vegetable: 'Green bean', category: 'Beans' },
        { vegetable: 'Horse gram', category: 'Beans' }, { vegetable: 'Garlic', category: 'Bulb and Stem' },
        { vegetable: 'Nopal', category: 'Bulb and Stem' }, { vegetable: 'Onion', category: 'Bulb and Stem' }
    ];
let listObj: MultiSelect = new MultiSelect({
    allowCustomValue: true,
    dataSource: datasource,
    mode: 'Default',
    fields: { groupBy: 'category', text: 'vegetable' },
    popupHeight: 200,
    placeholder: 'Select a vegetable' });
listObj.appendTo(<HTMLElement>document.querySelector("#component"));
let listObj1: MultiSelect = new MultiSelect({
    allowCustomValue: true,
    closePopupOnSelect: true,
    fields: { groupBy: 'category', text: 'vegetable' },
    dataSource: datasource,
    mode: 'Box',
    placeholder: 'Select a vegetable' });
listObj1.appendTo( <HTMLElement>document.querySelector("#box"));
let listObj2: MultiSelect = new MultiSelect({
    dataSource: datasource,
    fields: { groupBy: 'category', text: 'vegetable' },
    allowCustomValue: true,
    mode: 'Delimiter',
    placeholder: 'Select a vegetable'
});
listObj2.appendTo(<HTMLElement>document.querySelector("#delim"));


