/**
 * dropdownlist Sample
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
    dataSource: datasource,
    fields: { groupBy: 'category', text: 'vegetable' },
    placeholder: 'Select a vegetable', mode: 'Default', popupHeight: 200
});
listObj.appendTo(<HTMLElement>document.querySelector("#component"));
let socialMedia: { [key: string]: Object }[] = [
    { class: 'sf-icon-facebook', country: 'Facebook' }, { class: 'sf-icon-twitter', country: 'Twitter ' },
    { class: 'sf-icon-whatsapp', country: 'WhatsApp' }, { class: 'sf-icon-tumblr', country: 'Tumblr' },
    { class: 'sf-icon-google-plus', country: 'Google plus' }, { class: 'sf-icon-skype-01', country: 'Skype' },
    { class: 'sf-icon-vimeo', country: 'Vimeo' }, { class: 'sf-icon-instagram', country: 'Instagram' },
    { class: 'sf-icon-youtube1', country: 'YouTube' }, { class: 'sf-icon-reddit', country: 'Reddit' }
];
let listObj1: MultiSelect = new MultiSelect({
    dataSource: socialMedia,
    fields: { text: 'country', iconCss: 'class' },
    width: '250px',
    popupHeight: '200px',
    popupWidth: '250px',
});
listObj1.appendTo('#iconlist');
let listObj2: MultiSelect = new MultiSelect({
    noRecordsTemplate: '<div> <img src="http://www.404errorpages.com/images/image001.png" height="150px", width="150px"/> <div> There is no records to rendering the list items</div></div>',
    width: '290px',
    popupHeight: 300,
    popupWidth: '390px'
});
listObj2.appendTo('#emptyList');
let empList: { [key: string]: Object }[] = [
    { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
    { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
    { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
    { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
    { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
];
let listObjt: MultiSelect = new MultiSelect({
    dataSource: empList,
    fields: { text: 'text', groupBy: 'country' },
    headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
    itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
    footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
    valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
    '<span class="tempName"> ${text} </span></span>',
    width: '250px',
    placeholder: 'Select an employee',
    popupWidth: '250px',
    popupHeight: '300px'
});
listObjt.appendTo('#list');