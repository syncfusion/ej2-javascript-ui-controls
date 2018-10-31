/**
 * dropdownlist Sample
 */
import { MultiSelect, TaggingEventArgs } from '../../src/multi-select/index';

let noRecords: string;

let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' },
{ id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' },
{ id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];

let listObj: MultiSelect = new MultiSelect({
    dataSource: datasource,
    mode: 'Default',
    popupHeight: 200,
    fields: { text: 'text', value: 'id' },
    value: ['list3', 'list6', 'list2'],
    tagging: (e: TaggingEventArgs) => {
        e.setClass((e.itemData as any)[listObj.fields.value]);
    }
});
listObj.appendTo(<HTMLElement>document.querySelector("#component"));

let listObj1: MultiSelect = new MultiSelect({
    closePopupOnSelect: true,
    dataSource: datasource,
    fields: { text: 'text', value: 'id' },
    mode: 'Box',
    value: ['list3', 'list6', 'list2'],
    tagging: (e: TaggingEventArgs) => {
        e.setClass((e.itemData as any)[listObj1.fields.value]);
    }
});
listObj1.appendTo(<HTMLElement>document.querySelector("#box"));