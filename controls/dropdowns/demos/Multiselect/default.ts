/**
 * MultiSelect Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { L10n, setCulture} from '@syncfusion/ej2-base';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-base/index';
let customerData: DataManager = new DataManager({
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
    adaptor: new ODataV4Adaptor,
    crossDomain: true
});
L10n.load({
    'fr-BE': {
       'dropdowns': {
             'noRecordsTemplate': "Aucun enregistrement trouvé",
             'actionFailureTemplate': "Modèle d'échec d'action",
             "overflowCountTemplate": "More +${count} items"
         }

     }
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
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    },
    actionFailureTemplate: "<span>hate the <b>template support</b></span>"
}, <HTMLElement>document.querySelector("#remoteData"));


let noRecords: string;

let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];

let listObj: MultiSelect = new MultiSelect({
    dataSource: datasource,
    mode: 'Default',
    locale: 'fr-BE',
    popupHeight: 200,
    fields: { text: 'text',value:'text' },
    value: ['JAVA', 'C#', 'C++'],
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    }
});
listObj.appendTo(<HTMLElement>document.querySelector("#component"));
let listObj1: MultiSelect = new MultiSelect({
    closePopupOnSelect: true,
    dataSource: datasource,
    fields: { text: 'text',value:'text' },
    mode: 'Box',
    value: ['JAVA', 'C#', '.NET'],
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    }
    
});
listObj1.appendTo(<HTMLElement>document.querySelector("#box"));

let listObj11: MultiSelect = new MultiSelect({
    closePopupOnSelect: true,
    dataSource: datasource,
    fields: { text: 'text',value:'text' },
    mode: 'Box',
    enableRtl:true,
    value: ['JAVA', 'C#', '.NET'],
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    }
    
});
listObj11.appendTo(<HTMLElement>document.querySelector("#box-rtl"));

let listObj2: MultiSelect = new MultiSelect({
    dataSource: datasource,
    mode: 'Delimiter',
    fields: { text: 'text',value:'text' },
    value: ['JAVA', 'C#', 'Oracle'],
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    }
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

