/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';
import { Button } from '@syncfusion/ej2-buttons';

let objectData1: number[] = [ 1001, 2001, 3001, 4001, 5001, 6001, 7001, 8001];

let listObj: AutoComplete = new AutoComplete({
    dataSource: objectData1,
    placeholder: 'Select a number',
    popupHeight: '200px',
    filterType: 'LessThan' as any
});
listObj.appendTo('#list');

let button: Button = new Button();
button.appendTo('#btn');

let buttons: Button = new Button();
buttons.appendTo('#btn1');

let buttons1: Button = new Button();
buttons1.appendTo('#btn2');

let buttons2: Button = new Button();
buttons1.appendTo('#btn3');

let buttons3: Button = new Button();
buttons1.appendTo('#btn4');

let buttons4: Button = new Button();
buttons1.appendTo('#btn5');

let buttn: HTMLElement = document.getElementById('btn');
buttn.onclick = () => {
    listObj.filterType = "LessThan" as any;
    listObj.dataBind();
 };
let button1: HTMLElement = document.getElementById('btn1');
button1.onclick = () => {
    listObj.filterType = "GreaterThan" as any;
    listObj.dataBind();
 };
 let button2: HTMLElement = document.getElementById('btn2');
 button2.onclick = () => {
     listObj.filterType = "LessThanOrEqual" as any;
     listObj.dataBind();
  };
  let button3: HTMLElement = document.getElementById('btn3');
  button3.onclick = () => {
      listObj.filterType = "GreaterThanOrEqual" as any;
      listObj.dataBind();
   };
   let button4: HTMLElement = document.getElementById('btn4');
   button4.onclick = () => {
       listObj.filterType = "Equal" as any;
       listObj.dataBind();
    };
    let button5: HTMLElement = document.getElementById('btn4');
    button5.onclick = () => {
        listObj.filterType = "NotEqual" as any;
        listObj.dataBind();
     };