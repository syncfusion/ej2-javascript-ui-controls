/**
 *  Toolbar default Sample
 */
import { Accordion } from '../../src/accordion/index';

    let ctn: string = 'TypeScript is a free and open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript, and adds optional static typing to the language';
    let ctn1: string = 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces';
    let ctn2: string = 'AngularJS (commonly referred to as "Angular.js" or "AngularJS 1.X") is a JavaScript-based open-source front-end web application framework mainly maintained by Google';
    let ctn3: string = '#Angular'
    let acrdnObj: Accordion = new Accordion( {
        expandMode: 'Multiple',
        items : [
            { header: 'What is React?', content: ctn1, iconCss: 'e-react e-icons'},
            { header: 'What is Typescript?', content: ctn, expanded: true },
            { header: 'What is Angular?' , content: ctn3,}
          ]
    });
    acrdnObj.appendTo('#ej2Accordion');
    document.getElementById('btn_touch').onclick = (e : Event) => {
       (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
    };
    document.getElementById('btn_mouse').onclick = (e : Event) => {
       (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
    };