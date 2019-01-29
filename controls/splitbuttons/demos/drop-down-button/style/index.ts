/**
 * DropDownButton Default Sample
 */
import { DropDownButton, DropDownButtonModel } from '../../../src/drop-down-button/index';
import { ItemModel } from '../../../src/common/index';
import { Button } from '@syncfusion/ej2-buttons';
import { enableRipple } from '@syncfusion/ej2-base';

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

//Theme
let btn: Button = new Button();
btn.appendTo('#material');

let btn1: Button = new Button();
btn1.appendTo('#fabric');

let btn2: Button = new Button();
btn2.appendTo('#bootstrap');

let btn3: Button = new Button();
btn3.appendTo('#contrast');

btn.element.onclick = (e: Event) => {
    document.body.classList.remove("darkBG");
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
};
btn1.element.onclick = (e: Event) => {
    document.body.classList.remove("darkBG");
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
};
btn2.element.onclick = (e: Event) => {
    document.body.classList.remove("darkBG");
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
};
btn3.element.onclick = (e: Event) => {
    document.body.classList.add("darkBG");
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
};