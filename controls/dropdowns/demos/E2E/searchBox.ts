import { FilteringEventArgs } from './../../src/drop-down-base/index';
import { DropDownList } from './../../src/drop-down-list/index';
import { Browser } from '@syncfusion/ej2-base';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import '../../node_modules/es6-promise/dist/es6-promise';
let customerData: DataManager = new DataManager({
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
    adaptor: new ODataV4Adaptor,
    crossDomain: true
});
let popupElement: HTMLElement;
let targetElement: HTMLElement;
let query: Query = new Query().select(['ContactName', 'CustomerID']);
let noRecords: string;
let listObj: any = new DropDownList({
    dataSource: customerData,
    query: query.take(25),
    fields: { text: 'ContactName', value: 'CustomerID' },
    placeholder: 'Select a customer',
    filterBarPlaceholder: 'Search a customer',
    popupHeight: '230px',
    allowFiltering: true,
    filtering: (e: FilteringEventArgs) => {
        let query: Query = new Query().select(['ContactName', 'CustomerID']);
        query = (e.text !== '') ? query.where('ContactName', 'startswith', e.text, true) : query;
        e.updateData(customerData, query);
    }
});
listObj.appendTo('#dropdownlist');
listObj.showPopup();
setTimeout(() => {
    let filterEle: HTMLInputElement = <HTMLInputElement>document.getElementsByClassName('e-input-filter')[0];
    filterEle.value = 'g';
    listObj.searchLists();
}, 350);