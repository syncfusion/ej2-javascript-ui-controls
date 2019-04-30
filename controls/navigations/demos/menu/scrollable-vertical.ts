/**
 * Context Menu default sample
 */
import { Browser, closest } from '@syncfusion/ej2-base';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { Menu, MenuModel } from './../../src/menu/index';
import { MenuItemModel, BeforeOpenCloseMenuEventArgs } from '../../src/common/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

// Menu items definition
let menuItems: MenuItemModel[] = [
    {
        text: 'Appliances',
        id: 'appliances',
        items: [
            {
                text: 'Kitchen',
                items: [
                    { text: 'Electric Cookers' },
                    { text: 'Coffee Makers' },
                    { text: 'Blenders' },
                    { text: 'Microwave Ovens' }
                ]
            },
            {
                text: 'Television',
                items: [
                    { text: 'Our Exclusive TVs' },
                    { text: 'Smart TVs' },
                    { text: 'Big Screen TVs' }
                ]
            },
            {
                text: 'Washing Machine'
            },
            {
                text: 'Refrigerators'
            },
            {
                text: 'Air Conditioners',
                items: [
                    { text: 'Inverter ACs' },
                    { text: 'Split ACs' },
                    { text: 'Window ACs' },
                ]
            },
            {
                text: 'Water Purifiers'
            },
            {
                text: 'Air Purifiers'
            },
            {
                text: 'Chimneys'
            },
            {
                text: 'Inverters'
            },
            {
                text: 'Healthy Living'
            },
            {
                text: 'Vacuum Cleaners'
            },
            {
                text: 'Room Heaters'
            },
            {
                text: 'New Launches'
            }
        ]
    },
    {
        text: 'Accessories',
        items: [
            {
                text: 'Mobile',
                id: 'mobile',
                items: [
                    { text: 'Headphones' },
                    { text: 'Batteries' },
                    { text: 'Memory Cards' },
                    { text: 'Power Banks' },
                    { text: 'Mobile Cases' },
                    { text: 'Screen Protectors' },
                    { text: 'Data Cables' },
                    { text: 'Chargers' },
                    { text: 'Selfie Sticks' },
                    { text: 'OTG Cable' }
                ]
            },
            {
                text: 'Laptops'
            },
            {
                text: 'Desktop PC',
                items: [
                    { text: 'Pendrives' },
                    { text: 'External Hard Disks' },
                    { text: 'Monitors' },
                    { text: 'Keyboards' }
                ]
            },
            {
                text: 'Camera',
                items: [
                    { text: 'Lens' },
                    { text: 'Tripods' }
                ]
            }
        ]
    },
    {
        text: 'Fashion',
        items: [
            {
                text: 'Men'
            },
            {
                text: 'Women'
            }
        ]
    },
    {
        text: 'Home & Living',
        items: [
            {
                text: 'Furniture'
            },
            {
                text: 'Decor'
            },
            {
                text: 'Smart Home Automation'
            },
            {
                text: 'Dining & Serving'
            }
        ]
    },
    {
        text: 'Entertainment',
        items: [
            {
                text: 'Televisions'
            },
            {
                text: 'Home Theatres'
            },
            {
                text: 'Gaming Laptops'
            }
        ]
    },
    {
        text: 'Contact Us'
    },
    {
        text: 'Help'
    }
];

let menuOptions: MenuModel = {
    items: menuItems,
    cssClass: 'e-custom-scroll',
    enableScrolling: true,
    orientation: 'Vertical',
    beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
        if (args.parentItem.text === 'Appliances') {
            (closest(args.element, '.e-menu-wrapper') as HTMLElement).style.height = '320px';
        }
        if (args.parentItem.text === 'Mobile') {
            (closest(args.element, '.e-menu-wrapper') as HTMLElement).style.height = '260px';
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
    document.getElementById('theme').setAttribute('href', './theme-files/material.css');
    menuObj.refresh();
};
document.getElementById('fabric').onclick = (e: Event) => {
    document.body.classList.remove('darkBG');
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', './theme-files/fabric.css');
    menuObj.refresh();
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    document.body.classList.remove('darkBG');
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', './theme-files/bootstrap.css');
    menuObj.refresh();
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    document.body.classList.add('darkBG');
    enableRipple(false);
    document.getElementById('theme').setAttribute('href', './theme-files/highcontrast.css');
    menuObj.refresh();
};
document.getElementById('materialdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    enableRipple(false);
    menuObj.refresh();
    document.getElementById('theme').setAttribute('href', './theme-files/material-dark.css');
};
document.getElementById('bootstrapdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    enableRipple(false);
    menuObj.refresh();
    document.getElementById('theme').setAttribute('href', './theme-files/bootstrap-dark.css');
};
document.getElementById('fabricdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    enableRipple(false);
    menuObj.refresh();
    document.getElementById('theme').setAttribute('href', './theme-files/fabric-dark.css');
};

// function to handle the CheckBox change event
function onChange(args: ChangeEventArgs): void {
    if (args.checked) {
        menuObj.cssClass = 'e-bigger';
    } else {
        menuObj.cssClass = '';
    }
}
