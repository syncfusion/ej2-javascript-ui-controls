import { Accordion, AccordionClickArgs, ExpandEventArgs } from '../../src/accordion/index';

let nestAcrdn_vid: Accordion;
let nestAcrdn_mus: Accordion;
let nestAcrdn_musNew: Accordion;
let nestedAcrdn_musOld: Accordion;
let nestAcrdn_img: Accordion;
let nestedAcrdn_vidNew: Accordion;
let nestedAcrdn_vidOld: Accordion;
let accordion: Accordion = new Accordion({
  expanding: expanding,
  items: [
    { header: 'Video', content: '<div id="nested_video"></div>' },
    { header: 'Music', content: '<div id="nested_music"></div>' },
    { header: 'Images', content: '<div id="nested_images"></div>' },
  ]
});
accordion.appendTo('#element');
document.getElementById('btn_touch').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};
document.getElementById('btn_boot').onclick = (e : Event) => {
        document.getElementsByTagName('link')[0].href = '../../styles/bootstrap.css';
};
document.getElementById('btn_fabric').onclick = (e : Event) => {
        document.getElementsByTagName('link')[0].href = '../../styles/fabric.css';
};
function clicked(e: AccordionClickArgs): void {
  let ele: HTMLElement = <HTMLElement>e.originalEvent.target;
  if (ele.querySelectorAll('.e-accordion').length > 0) {
    return;
  }
  nestAcrdn_musNew = new Accordion({
    items: [
      { header: 'New Track1' },
      { header: 'New Track2' }
    ]
  }, '#nested_musicNew');
  nestedAcrdn_musOld = new Accordion({
     items: [
      { header: 'Old Track1' },
      { header: 'Old Track2' }
    ]
  }, '#nested_musicOld');
  nestedAcrdn_vidNew = new Accordion({
    items: [
      { header: 'New Video Track1' },
      { header: 'New Video Track2' }
    ]
  }, '#nested_videoNew');
  nestedAcrdn_vidOld = new Accordion({
     items: [
      { header: 'Old Video Track1' },
      { header: 'Old Video Track2' }
    ]
  }, '#nested_videoOld');
}

function expanding(e: ExpandEventArgs): void {
  if (e.isExpanded && [].indexOf.call(this.items, e.item) === 0) {
    if (e.element.querySelectorAll('.e-accordion').length > 0) {
      return;
    }
  nestAcrdn_vid = new Accordion({
    clicked: clicked,
    items: [
      { header: 'Video Track1' },
      { header: 'Video Track2' }
    ]
  }, '#nested_video');
  }
  if (e.isExpanded && [].indexOf.call(this.items, e.item) === 1) {
    if (e.element.querySelectorAll('.e-accordion').length > 0) {
      return;
    }
    nestAcrdn_mus = new Accordion({
      clicked: clicked,
      items: [
        { header: 'Music Track1' },
        { header: 'Music Track2' },
        { header: 'Music New', content: '<div id="nested_musicNew"></div>' }
      ]
    }, '#nested_music');
  }
  if (e.isExpanded && [].indexOf.call(this.items, e.item) === 2) {
    if (e.element.querySelectorAll('.e-accordion').length > 0) {
      return;
    }
    nestAcrdn_img = new Accordion({
      items: [
        { header: 'Track1' },
        { header: 'Track2' },
      ]
    }, '#nested_images');
  }
}