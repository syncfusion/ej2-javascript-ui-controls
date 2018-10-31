/**
 * Accordion RTL Sample
 */
import { Accordion, ExpandEventArgs } from '../../src/accordion/index';
let ctn1: string = '<div id ="nestAcrdion"></div>';
let ctn2: string = '<div id ="nestAcrdion1"></div>';
let ctn3: string = '<div id ="nestAcrdion2"></div>';
let acrdnObj: Accordion = new Accordion({
    clicked: create,
    expandMode: 'Single',
    expanding: expand,
    enableRtl: true,
    items: [
        { header: 'Athletics', iconCss: 'e-athletics e-acrdn-icons', content: ctn1  },
        { header: 'Water Games', iconCss: 'e-water-game e-acrdn-icons', content: ctn2 },
        { header: 'Racing', iconCss: 'e-racing-games e-acrdn-icons', content: ctn3 },
    ]
});
function expand(e: ExpandEventArgs) {
   if (e.isExpanded) { 
    let ele: HTMLElement = document.getElementById('nestAcrdion1');
    if (ele && !ele.classList.contains('e-control')) {
    let acObj: Accordion = new Accordion({
        items: [
            {  header: 'Diving', iconCss: 'e-acrdn-icons e-content-icon dive' },
            {  header: 'Swimming', iconCss: 'e-acrdn-icons e-content-icon swimming' },
            {  header: 'Marathon Swimming', iconCss: 'e-acrdn-icons e-content-icon marathan_swim' },
            ]
    });
    acObj.appendTo('#nestAcrdion1'); } }
    if (e.isExpanded) { 
    let ele: HTMLElement = document.getElementById('nestAcrdion2');
    if (ele && !ele.classList.contains('e-control')) {
    let acObj: Accordion = new Accordion({
        items: [
            {  header: 'Cycling BMX', iconCss: 'e-acrdn-icons e-content-icon cycle_BMX' },
            {  header: ' Cycling Mountain Bike', iconCss: 'e-acrdn-icons e-content-icon cycle_Mountain' },
            {  header: 'Cycle Racing', iconCss: 'e-acrdn-icons e-content-icon cycle' },
            ]
    });
    acObj.appendTo('#nestAcrdion2'); } }
}
function create() {
    let el: HTMLElement = document.getElementById('nestAcrdion');
    if (el && !el.classList.contains('e-control')) {
    let acdnObj: Accordion = new Accordion({
        items: [
            {  header: 'Marathon', iconCss: 'e-acrdn-icons e-content-icon marathon' },
            {  header: 'Javelin Throw', iconCss: 'e-acrdn-icons e-content-icon javelin' },
            {  header: 'Discus Throw', iconCss: 'e-acrdn-icons e-content-icon discus' },
            {  header: 'High Jump', iconCss: 'e-acrdn-icons e-content-icon highjump' },
            {  header: 'Long Jump', iconCss: 'e-acrdn-icons e-content-icon longjump' }
            ]
    });
    acdnObj.appendTo('#nestAcrdion'); }
}
//acrdnObj.enableRtl = true;
acrdnObj.appendTo('#ej2Accordion');
document.getElementById('btn_touch').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};
document.getElementById('btn_boot').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/bootstrap.css';
};
document.getElementById('btn_fabric').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/fabric.css';
};