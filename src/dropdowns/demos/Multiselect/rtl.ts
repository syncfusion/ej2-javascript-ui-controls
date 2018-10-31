/**
 * dropdownlist Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-base/index';
let customerData: DataManager = new DataManager({
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
    adaptor: new ODataV4Adaptor,
    crossDomain: true
});

let query: Query = new Query().select(['ContactName', 'CustomerID']);
let listObj22: MultiSelect = new MultiSelect({
    dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
    query: new Query().from('Customers').select('ContactName').take(7),
    fields: { text: 'ContactName' },
    placeholder: 'Select a name',
    allowFiltering: true, filtering: function (e) {
        var query = new Query().select(['ContactName']);
        query = (e.text !== '') ? query.where('ContactName', 'startswith', e.text, true) : query;
        e.updateData(customerData, query);
    },
}, <HTMLElement>document.querySelector("#remoteData"));


let noRecords: string;

let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];

let listObj: MultiSelect = new MultiSelect({ dataSource: datasource, mode: 'Default', popupHeight: 200, enableRtl:true, value: ['JAVA', 'C#', 'C++'] });
listObj.appendTo(<HTMLElement>document.querySelector("#component"));
let listObj1: MultiSelect = new MultiSelect({ closePopupOnSelect: true, dataSource: datasource, mode: 'Box', enableRtl:true, value: ['JAVA', 'C#', '.NET'] });
listObj1.appendTo(<HTMLElement>document.querySelector("#box"));
let listObj2: MultiSelect = new MultiSelect({
    dataSource: datasource,
    mode: 'Delimiter',
    enableRtl:true,
    value: ['JAVA', 'C#', 'Oracle']
});
listObj2.appendTo(<HTMLElement>document.querySelector("#delim"));


// let listObj3: MultiSelect = new MultiSelect({
//     dataSource: datasource,
//     mode: 'delimiter',
//     value: ['JAVA', 'C#', 'Oracle'],
//     allowFiltering: true, popupHeight: 200,
//     filtering: (e: FilteringEventArgs) => {
//         let query: Query = new Query().select(['text', 'id']);
//         query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
//         e.updateData(datasource, query);
//     },
//     actionBegin: () => {
//         if (noRecords) {
//             listObj.noRecordsTemplate = noRecords;
//             listObj.dataBind();
//         }
//     },
//     actionFailure: () => {
//         noRecords = listObj.noRecordsTemplate;
//         listObj.noRecordsTemplate = 'Service failure';
//         listObj.dataBind();
//     },

// }, <HTMLElement>document.querySelector("#remote"));
// let listObj4: MultiSelect = new MultiSelect({
//     dataSource: datasource,
//     mode: 'box',
//     value: ['JAVA', 'C#', 'Oracle'],
//     allowFiltering: true, popupHeight: 200,
//     filtering: (e: FilteringEventArgs) => {
//         let query: Query = new Query().select(['text', 'id']);
//         query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
//         e.updateData(datasource, query);
//     },
//     actionBegin: () => {
//         if (noRecords) {
//             listObj.noRecordsTemplate = noRecords;
//             listObj.dataBind();
//         }
//     },
//     actionFailure: () => {
//         noRecords = listObj.noRecordsTemplate;
//         listObj.noRecordsTemplate = 'Service failure';
//         listObj.dataBind();
//     },

// }, <HTMLElement>document.querySelector("#remotebox"));

