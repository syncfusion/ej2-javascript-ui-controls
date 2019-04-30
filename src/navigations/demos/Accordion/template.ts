/**
 *  Toolbar default Sample
 */
import { Accordion } from '../../src/accordion/index';
    let acrdnObj: Accordion = new Accordion( {
    });
    acrdnObj.appendTo('#ej2Accordion');
    document.getElementById('btn_touch').onclick = (e : Event) => {
       (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
    };
    document.getElementById('btn_mouse').onclick = (e : Event) => {
       (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
    };