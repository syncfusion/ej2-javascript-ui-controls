/**
 *  Toolbar default Sample
 */
import { Accordion } from '../../src/accordion/index';

    let ctn: string = 'TypeScript is a free and open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript, and adds optional static typing to the language';
    let ctn1: string = 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces';
    let ctn2: string = 'AngularJS (commonly referred to as "Angular.js" or "AngularJS 1.X") is a JavaScript-based open-source front-end web application framework mainly maintained by Google';
    let acrdnObj: Accordion = new Accordion( {
        expandMode: 'Multiple',
        items : [
            { header: 'What is React?', content: ctn1,},
            { header: 'What is TypeScript?', content: ctn },
            { header: 'What is Angular?' , content: ctn2,}
          ]
    });
    acrdnObj.appendTo('#ej2Accordion');
    document.getElementById('btn_touch').onclick = (e : Event) => {
       (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
    };
    document.getElementById('btn_mouse').onclick = (e : Event) => {
       (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
    };
    document.getElementById('btn_Add').onclick = (e : Event) => {
       acrdnObj.addItem( { header : 'Dynamic Header', content : 'Header Content' } , 2);
    };
    document.getElementById('btn_slct_lst').onclick = (e : Event) => {
       acrdnObj.select( acrdnObj.items.length - 1 );
    };
    document.getElementById('btn_Remove').onclick = (e :Event) => {
        acrdnObj.removeItem(2);
    };
    document.getElementById('btn_expd-lst').onclick = (e : Event) => {
       acrdnObj.expandItem(true ,  acrdnObj.items.length - 1  );
    };
    document.getElementById('btn_clpse-lst').onclick = (e : Event) => {
       acrdnObj.expandItem(false ,  acrdnObj.items.length - 1  );
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
