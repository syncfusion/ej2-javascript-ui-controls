/**
 * Context Menu default sample
 */
import { Browser, enableRipple } from '@syncfusion/ej2-base';
import { ContextMenu, ContextMenuModel } from './../../src/context-menu/index';
import { MenuItemModel } from './../../src/common/index';

enableRipple(true);

let menuItems: MenuItemModel[] = [
    {
        text: 'Preview',
        iconCss: 'e-icons e-preview',
        url: './icon-and-url.html'
    },
    {
        text: 'Share',
        iconCss: 'e-icons e-share',
        items: [
            {
                text: 'Facebook',
                iconCss: 'e-icons e-share',
            },
            {
                text: 'Whatsapp',
                iconCss: 'e-icons e-share',
            }
        ]
    },
    {
        text: 'Get Link'
    },
    {
        separator: true
    },
    {
        text: 'Copy',
        iconCss: 'e-icons e-copy'
    },
    {
        text: 'Download',
        iconCss: 'e-icons e-download'
    },
    {
        text: 'Remove',
        iconCss: 'e-icons e-delete'
    }];

let menuOptions: ContextMenuModel = {
    target: '#editor',
    items: menuItems,
    showItemOnClick: false,
    animationSettings: { effect: 'None' }
};

let menuObj: ContextMenu = new ContextMenu(menuOptions, '#contextmenu');

if (Browser.isDevice) {
    document.body.classList.add('e-bigger');
}

document.getElementById('material').onclick = (e: Event) => {
    enableRipple(true);
    document.getElementById('cm-theme').setAttribute('href', './theme-files/material.css');
    menuObj.refresh();
    document.body.style.backgroundColor = 'white';
};
document.getElementById('fabric').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('cm-theme').setAttribute('href', './theme-files/fabric.css');
    menuObj.refresh();
    document.body.style.backgroundColor = 'white';
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('cm-theme').setAttribute('href', './theme-files/bootstrap.css');
    menuObj.refresh();
    document.body.style.backgroundColor = 'white';
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    enableRipple(false);
    document.getElementById('cm-theme').setAttribute('href', './theme-files/highcontrast.css');
    menuObj.refresh();
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
};