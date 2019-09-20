/**
 * Accordion Item Template Sample
 */
import { Accordion, ExpandEventArgs } from '../../src/accordion/index';
import { accordionItems, nestedAccordionItems } from './data';

let nestAcrdn_vid: Accordion;
let nestAcrdn_mus: Accordion;
let nestAcrdn_musNew: Accordion;
let nestedAcrdn_musOld: Accordion;
let nestAcrdn_img: Accordion;
let nestedAcrdn_vidNew: Accordion;
let nestedAcrdn_vidOld: Accordion;
let acrdnObj: Accordion = new Accordion({
   expanding: expanding, 
   dataSource: nestedAccordionItems,
   headerTemplate: "#Title",
   itemTemplate: '#Customer'
});

//acrdnObj.enableRtl = true;
acrdnObj.appendTo('#ej2Accordion');

function expanding(e: ExpandEventArgs): void {
   if (e.isExpanded && [].indexOf.call(this.dataSource, e.item) === 0) {
     if (e.element.querySelectorAll('.e-accordion').length > 0) {
       return;
     }
   nestAcrdn_vid = new Accordion({
      dataSource: accordionItems,
      headerTemplate: "#Title",
      itemTemplate: '#NestedCustomer'
   }, '#nested_video');
   }
   if (e.isExpanded && [].indexOf.call(this.dataSource, e.item) === 1) {
      if (e.element.querySelectorAll('.e-accordion').length > 0) {
        return;
      }
      nestAcrdn_mus = new Accordion({
         dataSource: accordionItems,
         headerTemplate: "#Title",
         itemTemplate: '#NestedCustomer'
      }, '#nested_music');
    }
    if (e.isExpanded && [].indexOf.call(this.dataSource, e.item) === 2) {
      if (e.element.querySelectorAll('.e-accordion').length > 0) {
        return;
      }
      nestAcrdn_img = new Accordion({
         dataSource: accordionItems,
         headerTemplate: "#Title",
         itemTemplate: '#NestedCustomer'
      }, '#nested_images');
    }
 }

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
   nestAcrdn_vid.addItem(data , 2);
};
document.getElementById('btn_slct_lst').onclick = (e : Event) => {
   nestAcrdn_vid.select( nestAcrdn_vid.dataSource.length - 1 );
};
document.getElementById('btn_Remove').onclick = (e :Event) => {
   nestAcrdn_vid.removeItem(2);
};
document.getElementById('btn_expd-lst').onclick = (e : Event) => {
   nestAcrdn_vid.expandItem(true ,  nestAcrdn_vid.dataSource.length - 1  );
};
document.getElementById('btn_clpse-lst').onclick = (e : Event) => {
   nestAcrdn_vid.expandItem(false ,  nestAcrdn_vid.dataSource.length - 1  );
};
document.getElementById('btn_expd-all').onclick = (e : Event) => {
   nestAcrdn_vid.expandItem(true);
};
document.getElementById('btn_clpse-all').onclick = (e : Event) => {
   nestAcrdn_vid.expandItem(false);
};
document.getElementById('btn_dspl-frst').onclick = (e : Event) => {
   nestAcrdn_vid.enableItem(0, false);
};
document.getElementById('btn_enpl-frst').onclick = (e : Event) => {
   nestAcrdn_vid.enableItem(0, true);
};
document.getElementById('btn_hide-frst').onclick = (e : Event) => {
   nestAcrdn_vid.hideItem(0, true);
};
document.getElementById('btn_show-frst').onclick = (e : Event) => {
   nestAcrdn_vid.hideItem(0, false);
};