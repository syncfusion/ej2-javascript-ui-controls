/**
 * dropdownlist Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-base/index';


let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];

let listObj: MultiSelect = new MultiSelect({
    allowCustomValue: true,
    dataSource: datasource,
    mode: 'Default',
    fields:{text:"text",value:"text"},
    popupHeight: 200,
    value: ['JAVA', 'C#', 'C++'] });
listObj.appendTo(<HTMLElement>document.querySelector("#component"));
let listObj1: MultiSelect = new MultiSelect({
    allowCustomValue: true,
    closePopupOnSelect: true,
    fields:{text:"text",value:"text"},
    dataSource: datasource,
    mode: 'Box',
    value: ['JAVA', 'C#', '.NET'] });
listObj1.appendTo( <HTMLElement>document.querySelector("#box"));
let listObj2: MultiSelect = new MultiSelect({
    dataSource: datasource,
    fields:{text:"text",value:"text"},
    allowCustomValue: true,
    mode: 'Delimiter',
    value: ['JAVA', 'C#', 'Oracle']
});
listObj2.appendTo(<HTMLElement>document.querySelector("#delim"));


