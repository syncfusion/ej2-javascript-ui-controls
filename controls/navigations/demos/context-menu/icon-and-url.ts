/**
 * Context Menu default sample
 */
import { Browser, select } from '@syncfusion/ej2-base';
import { ContextMenu } from './../../src/context-menu/index';
import { MenuItemModel } from './../../src/common/index';

let menuItems: MenuItemModel[] = [
    {
        text: 'Preview',
        iconCss: 'e-icons e-cut',
        url: 'www.google.com'
    },
    {
        text: 'Share',
        iconCss: 'e-icons e-share',
        items: [
            {
                text: 'Facebook'
            },
            {
                text: 'Whatsapp'
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
        text: 'Remove'
    }];

let menuOptions: { [key: string]: Object } = {
        target: '#editor',
        items: menuItems
    };

let menuObj: ContextMenu = new ContextMenu(menuOptions, '#contextmenu');

if (Browser.isDevice) {
    document.body.classList.add('e-bigger');
    menuObj.element.parentElement.classList.add('e-bigger');
    (select('#editor') as HTMLElement).style.width = 'auto';
}