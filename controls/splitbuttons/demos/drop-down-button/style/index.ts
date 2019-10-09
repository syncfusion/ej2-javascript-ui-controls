/**
 * DropDownButton Default Sample
 */
import { DropDownButton, DropDownButtonModel } from '../../../src/drop-down-button/index';
import { ItemModel } from '../../../src/common/index';
import { Button } from '@syncfusion/ej2-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
import { createTable } from '../../common/common';

createTable();
enableRipple(true);

let items: ItemModel[] = [
    {
        text: 'My Profile'
    },
    {
        text: 'Friend Requests'
    },
    {
        text: 'Account Settings'
    },
    {
        text: 'Support'
    },
    {
        text: 'Logout'
    }];

let menuOptions: DropDownButtonModel = {
    items: items,
    cssClass: 'e-primary'
};

let btnObj: DropDownButton = new DropDownButton(menuOptions);
btnObj.appendTo('#primary');

menuOptions.cssClass = 'e-success';

let btnObj1: DropDownButton = new DropDownButton(menuOptions);
btnObj1.appendTo('#success');

menuOptions.cssClass = 'e-info';

let btnObj2: DropDownButton = new DropDownButton(menuOptions);
btnObj2.appendTo('#info');

menuOptions.cssClass = 'e-warning';

let btnObj3: DropDownButton = new DropDownButton(menuOptions);
btnObj3.appendTo('#warning');

menuOptions.cssClass = 'e-danger';

let btnObj4: DropDownButton = new DropDownButton(menuOptions);
btnObj4.appendTo('#danger');

document.getElementById('material').onclick = (e: Event) => {
    enableRipple(true);
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
    document.body.style.backgroundColor = 'white';
};
document.getElementById('fabric').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
    document.body.style.backgroundColor = 'white';
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
    document.body.style.backgroundColor = 'white';
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};
document.getElementById('material-dark').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/material-dark.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};
document.getElementById('fabric-dark').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric-dark.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};
document.getElementById('bootstrap-dark').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap-dark.css');
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};