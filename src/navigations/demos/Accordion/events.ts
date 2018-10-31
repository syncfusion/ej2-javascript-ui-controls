/**
 *  Toolbar default Sample
 */
import { Accordion, AccordionClickArgs, ExpandEventArgs } from '../../src/accordion/index';
import { detach,Effect } from '@syncfusion/ej2-base';

let ctn: string = 'TypeScript is a free and open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript, and adds optional static typing to the language';
let ctn1: string = 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces';
let ctn2: string = 'AngularJS (commonly referred to as "Angular.js" or "AngularJS 1.X") is a JavaScript-based open-source front-end web application framework mainly maintained by Google';
let ctn3: string = '<div id ="nestAcrdion"></div>';
let ctn4: string = '<div id ="nestAcrdion1"></div>'
let acdnObj: Accordion;
let acObj: Accordion;
let acrdnObj: Accordion = new Accordion({
  expanded: expanded,
  expanding: expanding,
  clicked: create,
  items: [
    { header: 'What is React?', content: ctn3, iconCss: 'e-react e-icons' },
    { header: 'What is TypeScript?', content: ctn4 },
    { header: 'What is Angular?', content: ctn2 }
  ]
});
function create( e: AccordionClickArgs) {
    let el: HTMLElement = document.getElementById('nestAcrdion');
    let ele: HTMLElement = document.getElementById('nestAcrdion1');
    if (el && !el.classList.contains('e-control')) {
    acdnObj= new Accordion({
        items: [
            { content: ctn1, header: 'React', iconCss: 'e-react e-icons' }, { content: ctn2, header: 'Angular' }]
    });
    acdnObj.appendTo('#nestAcrdion'); }
    if (ele && !ele.classList.contains('e-control')) {
    acObj= new Accordion({
        items: [
            { content: ctn, header: 'Typescript' },]
    });
    acObj.appendTo('#nestAcrdion1'); }
  eventTrace("Event Name  " + e.name);
}
function expanded(e: ExpandEventArgs): void {
  eventTrace("Event Name  " + e.name);
  eventTrace("Action isExpanded ->" + e.isExpanded);
}
function expanding(e: ExpandEventArgs): void {
  eventTrace("Event Name  " + e.name);
  eventTrace("Action isExpanded ->" + e.isExpanded);
}
function eventTrace(event: string): void {
  let ele: HTMLElement = document.getElementById('EventContent');
  let eleCon: HTMLElement = document.getElementById('EventContentContainer');
  if (!ele) {
    let event: HTMLElement = document.createElement("div");
    event.id = "EventContent";
    eleCon.appendChild(event);
  }
  ele = document.getElementById('EventContent');
  let eventEle: HTMLElement = document.createElement("div");
  eventEle.className = 'e-event-content';
  eventEle.innerHTML = event;
  ele.insertBefore(eventEle, ele.children[0]);
}
acrdnObj.appendTo('#ej2Accordion');
document.getElementById('btn_touch').onclick = (e: Event) => {
  (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e: Event) => {
  (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};
document.getElementById('clear').onclick = (e: Event) => {
  let ele: HTMLElement = document.getElementById('EventContent');
  if (ele) { detach(ele); }
};
document.getElementById('AnimationEffect').onchange = (e: Event) => {
  acrdnObj.animation.expand.effect   = <Effect>(<HTMLSelectElement>e.target).value ;
  if (acdnObj) {acdnObj.animation.expand.effect   =<Effect>(<HTMLSelectElement>e.target).value ; }
  if (acObj) { acObj.animation.expand.effect   =<Effect>(<HTMLSelectElement>e.target).value ; }
}
document.getElementById('AnimationEffectCollapse').onchange = (e: Event) => {
  acrdnObj.animation.collapse.effect   =<Effect>(<HTMLSelectElement>e.target).value ;
  if (acdnObj) {acdnObj.animation.collapse.effect   =<Effect>(<HTMLSelectElement>e.target).value ; }
  if (acObj) { acObj.animation.collapse.effect   =<Effect>(<HTMLSelectElement>e.target).value ; }
}  