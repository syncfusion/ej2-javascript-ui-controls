/**
 * Accordion Item Template Sample
 */
import { Accordion } from '../../src/accordion/index';
import { accordionItems, nestedAccordionItems } from './data';

let acrdnObj: Accordion = new Accordion({
    dataSource: accordionItems,
    headerTemplate: "#Title",
    itemTemplate: '#Customer',
    enableRtl: false,
    enablePersistence: false,
    expandMode: "Single",
    //width: "400px",
    //height: "400px"
});

//acrdnObj.enableRtl = true;
acrdnObj.appendTo('#ej2Accordion');
document.getElementById('btn_Add').onclick = (e : Event) => {
    let data: Object = {
        "ID": 5,
        "CompanyName": "Amazon",
        "Address": "706 SW 9th Street",
        "City": "Cape Town",
        "State": "Australia",
        "Zipcode": 72716,
        "Phone": "(800) 555-2797",
        "Fax": "(800) 555-2171",
        "Website": "http://www.nowebsitesupermart.com"
    };
    acrdnObj.addItem(data , 2);
 };
 document.getElementById('btn_slct_lst').onclick = (e : Event) => {
    acrdnObj.select( acrdnObj.dataSource.length - 1 );
 };
 document.getElementById('btn_Remove').onclick = (e :Event) => {
     acrdnObj.removeItem(2);
 };
 document.getElementById('btn_expd-lst').onclick = (e : Event) => {
    acrdnObj.expandItem(true ,  acrdnObj.dataSource.length - 1  );
 };
 document.getElementById('btn_clpse-lst').onclick = (e : Event) => {
    acrdnObj.expandItem(false ,  acrdnObj.dataSource.length - 1  );
 };
 document.getElementById('btn_expd-all').onclick = (e : Event) => {
    acrdnObj.expandItem(true);
 };
 document.getElementById('btn_clpse-all').onclick = (e : Event) => {
    acrdnObj.expandItem(false);
 };
 document.getElementById('btn_dspl-frst').onclick = (e : Event) => {
    acrdnObj.enableItem(0, false);
 };
 document.getElementById('btn_enpl-frst').onclick = (e : Event) => {
    acrdnObj.enableItem(0, true);
 };
 document.getElementById('btn_hide-frst').onclick = (e : Event) => {
    acrdnObj.hideItem(0, true);
 };
 document.getElementById('btn_show-frst').onclick = (e : Event) => {
    acrdnObj.hideItem(0, false);
 };
 document.getElementById('btn_DataSource').onclick = (e : Event) => {
    acrdnObj.dataSource = nestedAccordionItems;
    acrdnObj.dataBind();
 };
 document.getElementById('btn_headerTemplate').onclick = (e : Event) => {
    acrdnObj.headerTemplate = "#NestedTitle";
    acrdnObj.dataBind();
 };
 document.getElementById('btn_ItemTemplate').onclick = (e : Event) => {
    acrdnObj.itemTemplate = "#NestedCustomer";
    acrdnObj.dataBind();
 };