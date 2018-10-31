/**
 * Button Default Sample
 */
import { Button } from './../../../src/button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let btnObj: Button = new Button({ cssClass: 'e-small' });
btnObj.appendTo('#small1');

btnObj = new Button({ cssClass: 'e-small', isPrimary: true });
btnObj.appendTo('#small4');

btnObj = new Button({ cssClass: 'e-small e-success' });
btnObj.appendTo('#small5');

btnObj = new Button({ cssClass: 'e-small e-info' });
btnObj.appendTo('#small6');

btnObj = new Button({ cssClass: 'e-small e-warning' });
btnObj.appendTo('#small7');

btnObj = new Button({ cssClass: 'e-small e-danger' });
btnObj.appendTo('#small8');

btnObj = new Button({ cssClass: 'e-small', disabled: true });
btnObj.appendTo('#small9');

btnObj = new Button();
btnObj.appendTo('#normal1');

btnObj = new Button({ isPrimary: true });
btnObj.appendTo('#normal4');

btnObj = new Button({ cssClass: 'e-success' });
btnObj.appendTo('#normal5');

btnObj = new Button({ cssClass: 'e-info' });
btnObj.appendTo('#normal6');

btnObj = new Button({ cssClass: 'e-warning' });
btnObj.appendTo('#normal7');

btnObj = new Button({ cssClass: 'e-danger' });
btnObj.appendTo('#normal8');

btnObj = new Button({ disabled: true });
btnObj.appendTo('#normal9');

btnObj = new Button({ cssClass: 'e-small e-flat' });
btnObj.appendTo('#flat1');

btnObj = new Button({ cssClass: 'e-flat' });
btnObj.appendTo('#flat2');

btnObj = new Button({ isPrimary: true, cssClass: 'e-flat' });
btnObj.appendTo('#flat3');

btnObj = new Button({ cssClass: 'e-flat e-success' });
btnObj.appendTo('#flat4');

btnObj = new Button({ cssClass: 'e-flat e-info' });
btnObj.appendTo('#flat5');

btnObj = new Button({ cssClass: 'e-flat e-warning' });
btnObj.appendTo('#flat6');

btnObj = new Button({ cssClass: 'e-flat e-danger' });
btnObj.appendTo('#flat7');

btnObj = new Button({ cssClass: 'e-flat', disabled: true });
btnObj.appendTo('#flat8');

btnObj = new Button({ cssClass: 'e-small e-outline' });
btnObj.appendTo('#outline1');

btnObj = new Button({ cssClass: 'e-outline' });
btnObj.appendTo('#outline2');

btnObj = new Button({ isPrimary: true, cssClass: 'e-outline' });
btnObj.appendTo('#outline3');

btnObj = new Button({ cssClass: 'e-outline' });
btnObj.appendTo('#outline4');

btnObj = new Button({ cssClass: 'e-outline' });
btnObj.appendTo('#outline5');

btnObj = new Button({ cssClass: 'e-outline' });
btnObj.appendTo('#outline6');

btnObj = new Button({ cssClass: 'e-outline' });
btnObj.appendTo('#outline7');

btnObj = new Button({ cssClass: 'e-outline', disabled: true });
btnObj.appendTo('#outline8');

btnObj = new Button({ cssClass: 'e-small', isToggle: true });
btnObj.appendTo('#toggle1');

btnObj = new Button({ isToggle: true });
btnObj.appendTo('#toggle2');

btnObj = new Button({ cssClass: 'e-small e-flat', isToggle: true });
btnObj.appendTo('#toggle3');

btnObj = new Button({ cssClass: 'e-outline', isToggle: true });
btnObj.appendTo('#toggle4');

btnObj = new Button({ cssClass: 'e-toggle', isPrimary: true, isToggle: true });
btnObj.appendTo('#toggle5');

btnObj = new Button({ cssClass: 'e-success', isToggle: true });
btnObj.appendTo('#toggle6');

btnObj = new Button({ cssClass: 'e-info', isToggle: true });
btnObj.appendTo('#toggle7');

btnObj = new Button({ cssClass: 'e-warning', isToggle: true });
btnObj.appendTo('#toggle8');

btnObj = new Button({ cssClass: 'e-danger', isToggle: true });
btnObj.appendTo('#toggle9');

btnObj = new Button({ disabled: true, isToggle: true });
btnObj.appendTo('#toggle10');

btnObj = new Button({ cssClass: 'e-small', disabled: true });
btnObj.appendTo('#disabled1');

btnObj = new Button({ disabled: true });
btnObj.appendTo('#disabled2');

btnObj = new Button({ disabled: true, cssClass: 'e-flat' });
btnObj.appendTo('#disabled3');

btnObj = new Button({ disabled: true, cssClass: 'e-outline' });
btnObj.appendTo('#disabled4');

btnObj = new Button({ disabled: true, isPrimary: true });
btnObj.appendTo('#disabled5');

btnObj = new Button({ disabled: true, cssClass: 'e-success' });
btnObj.appendTo('#disabled6');

btnObj = new Button({ disabled: true, cssClass: 'e-info' });
btnObj.appendTo('#disabled7');

btnObj = new Button({ disabled: true, cssClass: 'e-warning' });
btnObj.appendTo('#disabled8');

btnObj = new Button({ disabled: true, cssClass: 'e-danger' });
btnObj.appendTo('#disabled9');

//Theme
btnObj = new Button();
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






