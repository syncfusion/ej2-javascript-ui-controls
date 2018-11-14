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
        text: 'Unread',
        iconCss: 'e-icons e-unread',
    },
    {
        text: 'Has Attachments',
        iconCss: 'e-icons e-attachments',
        url: 'http://www.google.com'
    },
    {
        text: 'Categorized',
        iconCss: 'e-icons e-categorized'
    },
    {
        separator: true
    },
    {
        text: 'Important',
        iconCss: 'e-icons e-important'
    },
    {
        text: 'More Filters',
        iconCss: 'e-icons e-more',
    }];

let menuOptions: DropDownButtonModel = {
    items: items,
    iconCss: 'e-icons e-filter',
    iconPosition: 'Left'
};

let btnObj: DropDownButton = new DropDownButton(menuOptions);
btnObj.appendTo('#normal');

menuOptions.cssClass = 'e-small';

let btnObj1: DropDownButton = new DropDownButton(menuOptions);
btnObj1.appendTo('#small');

menuOptions.cssClass = 'e-bigger';

let btnObj2: DropDownButton = new DropDownButton(menuOptions);
btnObj2.appendTo('#bigger');

menuOptions.cssClass = 'e-bigger e-small';

let btnObj3: DropDownButton = new DropDownButton(menuOptions);
btnObj3.appendTo('#bigger-small');

//Theme
let btn: Button = new Button();
btn.appendTo('#material');

let btn1: Button = new Button();
btn1.appendTo('#fabric');

let btn2: Button = new Button();
btn2.appendTo('#bootstrap');

let btn3: Button = new Button();
btn3.appendTo('#contrast');

btn.element.onclick = (e : Event) => {
    document.body.classList.remove("darkBG");
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
};
btn1.element.onclick = (e : Event) => {
    document.body.classList.remove("darkBG");
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
};
btn2.element.onclick = (e : Event) => {
    document.body.classList.remove("darkBG");
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
};
btn3.element.onclick = (e : Event) => {
    document.body.classList.add("darkBG");
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
};