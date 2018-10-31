/**
 * CheckBox Default Sample
 */
import { CheckBox } from './../../../src/check-box/index';
import { Button } from './../../../src/button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let cbox1: CheckBox = new CheckBox({ label: 'Football' });
cbox1.appendTo('#checkbox1');

let cbox2: CheckBox = new CheckBox({ checked: true, label: 'Basketball' });
cbox2.appendTo('#checkbox2');

let cbox3: CheckBox = new CheckBox({ disabled: true, label: 'Tennis' });
cbox3.appendTo('#checkbox3');

let cbox4: CheckBox = new CheckBox({ label: 'Cricket' });
cbox4.appendTo('#checkbox4');

let cbox5: CheckBox = new CheckBox({ label: 'Baseball' });
cbox5.appendTo('#checkbox5');

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