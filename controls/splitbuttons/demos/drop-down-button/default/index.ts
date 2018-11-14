/**
 * DropDownButton Default Sample
 */
import { DropDownButton, DropDownButtonModel } from '../../../src/drop-down-button/index';
import { MenuEventArgs, ItemModel } from '../../../src/common/index';
import { enableRipple } from '@syncfusion/ej2-base';

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

let data: ItemModel[] = [
    {
        text: 'Appointments'
    },
    {
        text: 'Meeting'
    },
    {
        text: 'Task'
    },
    {
        separator: true
    },
    {
        text: 'Teams Meeting'
    },
    {
        text: 'Skype Meeting'
    }];

let data1: ItemModel[] = [
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
    iconCss: 'e-icons e-filter',
    iconPosition: 'Left',
    beforeItemRender: (args: MenuEventArgs) => {
        if (args.item.text === 'Important') {
            args.element.classList.add('e-disabled');
        }
    }
};

let items1: ItemModel[] = [
    {
        text: 'Align Left',
        iconCss: 'e-icons e-left',
    },
    {
        text: 'Align Center',
        iconCss: 'e-icons e-center',
    },
    {
        text: 'Align Right',
        iconCss: 'e-icons e-right'
    }];

let menuOptions1: DropDownButtonModel = {
    items: items1,
    iconCss: 'e-icons e-align',
    iconPosition: 'Left'
};

let btnObj: DropDownButton = new DropDownButton({ items: data });
btnObj.appendTo('#default');

let btnObj1: DropDownButton = new DropDownButton(menuOptions1);
btnObj1.appendTo('#icon-only');

let btnObj2: DropDownButton = new DropDownButton(menuOptions);
btnObj2.appendTo('#icon');

let btnObj3: DropDownButton = new DropDownButton({ items: data1 });
btnObj3.appendTo('#hide');
btnObj3.element.classList.add('e-caret-hide');

let btnObj4: DropDownButton = new DropDownButton({ items: items, iconCss: 'e-icons e-filter', disabled: true });
btnObj4.appendTo('#disabled');

let btnObj5: DropDownButton = new DropDownButton({ items: items, iconCss: 'e-icons e-filter', enableRtl: true });
btnObj5.appendTo('#rtl');

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