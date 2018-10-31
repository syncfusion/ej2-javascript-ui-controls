/**
 * Radio-button default sample
 */
import { RadioButton } from './../../../src/radio-button/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { Button } from '../../../src/button/index';

enableRipple(true);
let radiobutton: RadioButton = new RadioButton({label: 'Credit/Debit Card', name: 'payment', value: 'credit/debit', checked: true}); 
radiobutton.appendTo('#radio1');

let radiobutton1: RadioButton = new RadioButton({label: 'Net Banking', name: 'payment', value: 'netbanking'}); 
radiobutton1.appendTo('#radio2');

let radiobutton2: RadioButton = new RadioButton({label: 'Cash on Delivery', name: 'payment', value: 'cashondelivery'});
radiobutton2.appendTo('#radio3');

let radiobutton3: RadioButton = new RadioButton({label: 'Other Wallets', name: 'payment', value: 'others'}); 
radiobutton3.appendTo('#radio4');

//Theme
let btnObj: Button = new Button();
btnObj.appendTo('#material');

btnObj = new Button();
btnObj.appendTo('#fabric');

btnObj = new Button();
btnObj.appendTo('#bootstrap');

btnObj = new Button();
btnObj.appendTo('#highcontrast');

document.getElementById('material').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
};
document.getElementById('fabric').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
};
document.getElementById('bootstrap').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
};
document.getElementById('highcontrast').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
};