/**
 *  Toolbar default Sample
 */
import { Accordion, ExpandEventArgs } from '../../src/accordion/index';
let ctn: string = 'TypeScript is a free and open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript, and adds optional static typing to the language';
let ctn1: string = 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces';
let ctn2: string = 'AngularJS (commonly referred to as "Angular.js" or "AngularJS 1.X") is a JavaScript-based open-source front-end web application framework mainly maintained by Google';
let ctn3: string = '<div id ="nestAcrdion"></div>';
let ctn4: string = '<div id ="nestAcrdion1"></div>'
let acrdnObj: Accordion = new Accordion({
    clicked: create,
    expandMode: 'Single',
    expanding: expand,
    items: [
        { header: 'What is React?', content: ctn3, iconCss: 'e-react e-icons' },
        { header: 'What is TypeScript?', content: ctn4 },
        { header: 'What is Angular?', content: ctn2 }
    ]
});
function expand(e: ExpandEventArgs) {
   if (e.isExpanded) { 
    let ele: HTMLElement = document.getElementById('nestAcrdion1');
    if (ele && !ele.classList.contains('e-control')) {
    let acObj: Accordion = new Accordion({
        items: [
            { content: ctn, header: 'Typescript' },]
    });
    acObj.appendTo('#nestAcrdion1'); } }
}
function create() {
    let el: HTMLElement = document.getElementById('nestAcrdion');
    if (el && !el.classList.contains('e-control')) {
    let acdnObj: Accordion = new Accordion({
        items: [
            { content: ctn1, header: 'React', iconCss: 'e-react e-icons' }, { content: ctn2, header: 'Angular' }]
    });
    acdnObj.appendTo('#nestAcrdion'); }
}
acrdnObj.appendTo('#ej2Accordion');
document.getElementById('btn_touch').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e: Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};