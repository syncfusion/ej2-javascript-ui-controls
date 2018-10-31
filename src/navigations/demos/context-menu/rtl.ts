/**
 * Context Menu default sample
 */
import { Browser, select } from '@syncfusion/ej2-base';
import { ContextMenu } from './../../src/context-menu/index';
import { MenuItemModel } from './../../src/common/index';

let menuItems: MenuItemModel[] = [
    {
        text: 'Preview',
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
        text: 'Get Link',
        iconCss: 'e-icons e-link'
    },
    {
        separator: true
    },
    {
        text: 'Copy',
        iconCss: 'e-icons e-copy'
    },
    {
        text: 'Download'
    },
    {
        text: 'Remove',
        iconCss: 'e-icons e-cut'
    }];

let menuOptions: { [key: string]: Object } = {
        target: '#editor',
        items: menuItems,
        enableRtl: true
    };

let menuObj: ContextMenu = new ContextMenu(menuOptions , '#contextmenu');

if (Browser.isDevice) {
    document.body.classList.add('e-bigger');
    menuObj.element.parentElement.classList.add('e-bigger');
    (select('#editor') as HTMLElement).style.width = 'auto';
}