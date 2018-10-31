/**
 *  Toolbar default Sample
 */
import { Accordion, AccordionClickArgs, ExpandEventArgs } from '../../src/accordion/index';

    let ctn: string = 'TypeScript is a free and open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript, and adds optional static typing to the language';
    let ctn1: string = 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces';
    let ctn2: string = 'AngularJS (commonly referred to as "Angular.js" or "AngularJS 1.X") is a JavaScript-based open-source front-end web application framework mainly maintained by Google';
    let acrdnObj: Accordion = new Accordion( {
        expandMode: 'Single',
        clicked: click,
        expanded: expanded,
        expanding: expanding,
        items : [
            { header: 'What is React?', content: ctn1, iconCss: 'e-react e-icons'},
            { header: 'What is TypeScript?', content: ctn, expanded: true },
            { header: 'What is Angular?' , content: ctn2, expanded: true  }
          ]
    });
    function click(e: AccordionClickArgs): void {
      console.log(e.name);
    }
    function expanded (e: ExpandEventArgs): void {
      console.log(e.name);
    }
    function expanding (e: ExpandEventArgs): void {
      console.log(e.name);
    }
    acrdnObj.appendTo('#ej2Accordion');
    document.getElementById('btn_none').onclick = (e : Event) => {
       acrdnObj.animation = {
            collapse: { effect: 'None', duration: 600, easing: 'ease' },
            expand: { effect: 'None', duration: 600, easing: 'ease' }
       }
       acrdnObj.dataBind();
    };
    document.getElementById('btn_default').onclick = (e : Event) => {
        acrdnObj.animation = {
            collapse: { effect: 'SlideUp', duration: 600, easing: 'ease' },
            expand: { effect: 'SlideDown', duration: 600, easing: 'ease' }
       }
       acrdnObj.dataBind();
    };
    document.getElementById('btn_custom').onclick = (e : Event) => {
        acrdnObj.animation = {
            collapse: { effect: 'FlipXDownIn', duration: 600, easing: 'ease' },
            expand: { effect: 'FlipXUpIn', duration: 600, easing: 'ease' }
       }
       acrdnObj.dataBind();
    };