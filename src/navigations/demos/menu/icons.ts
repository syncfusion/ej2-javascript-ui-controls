/**
 * Context Menu default sample
 */
import { Browser } from '@syncfusion/ej2-base';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { Menu, MenuModel } from './../../src/menu/index';
import { MenuEventArgs, MenuItemModel } from '../../src/common/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let menuItems: MenuItemModel[] = [
    {
        text: 'Home',
        iconCss: 'e-icons e-home'
    },
    {
        text: 'Book Categories',
        iconCss: 'e-icons e-book',
        id: 'books',
        items: [
            {
                text: 'Cookbooks',
                iconCss: 'e-icons e-share',
                items: [
                    {
                        text: 'Desserts',
                        iconCss: 'e-icons e-share',
                    },
                    {
                        text: 'South Indian Cooks',
                        iconCss: 'e-icons e-share',
                    },
                    {
                        text: 'Cooking tips',
                        iconCss: 'e-icons e-share'
                    }
                ]
            },
            {
                text: 'Children',
                iconCss: 'e-icons e-share',
                items: [
                    {
                        text: 'Tales',
                        iconCss: 'e-icons e-share',
                    },
                    {
                        text: 'Animals',
                        iconCss: 'e-icons e-share',
                    },
                    {
                        text: 'Dreams',
                        iconCss: 'e-icons e-share',
                    }
                ]
            },
            {
                text: 'technologies',
                iconCss: 'e-icons e-share',
                id: 'technologies',
                items: [
                    {
                        text: 'Programming Languages',
                        iconCss: 'e-icons e-share',
                    },
                    {
                        text: 'Wifi Hacking',
                        iconCss: 'e-icons e-share',
                    },
                    {
                        text: 'Upcoming Tech',
                        iconCss: 'e-icons e-share',
                    }
                ]
            }
        ]
    },
    {
        text: 'Purchase',
        iconCss: 'e-icons e-purchase'
    },
    {
        text: 'Contact Us',
        iconCss: 'e-icons e-contact'
    },
    {
        separator: true,
    },
    {
        text: 'Login',
        iconCss: 'e-icons e-login',
        id: 'login'
    }
];

let menuOptions: MenuModel = {
    items: menuItems,
    showItemOnClick: false,
    beforeItemRender: (args: MenuEventArgs) => {
        if (args.item.url) {
            args.element.getElementsByTagName('a')[0].setAttribute('target', '_blank');
        }
    }
};

let menuObj: Menu = new Menu(menuOptions, '#menu');

if (Browser.isDevice) {
    document.body.classList.add('e-bigger');
} else {
    menuObj.animationSettings.effect = 'SlideDown';
}

let checkBoxObj: CheckBox = new CheckBox({ label: 'Enable Touch Mode', checked: Browser.isDevice ? true : false, change: onChange });
checkBoxObj.appendTo('#touchMode');

document.getElementById('material').onclick = (e: Event) => {
    document.body.classList.remove('darkBG');
    enableRipple(true);
    menuObj.refresh();
    document.getElementById('theme').setAttribute('href', './theme-files/material.css');
};
document.getElementById('fabric').onclick = (e: Event) => {
    document.body.classList.remove('darkBG');
    enableRipple(false);
    menuObj.refresh();
    document.getElementById('theme').setAttribute('href', './theme-files/fabric.css');
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    document.body.classList.remove('darkBG');
    enableRipple(false);
    menuObj.refresh();
    document.getElementById('theme').setAttribute('href', './theme-files/bootstrap.css');
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    document.body.classList.add('darkBG');
    enableRipple(false);
    menuObj.refresh();
    document.getElementById('theme').setAttribute('href', './theme-files/highcontrast.css');
};

// function to handle the CheckBox change event
function onChange(args: ChangeEventArgs): void {
    if (args.checked) {
        menuObj.cssClass = 'e-bigger';
    } else {
        menuObj.cssClass = '';
    }
}
