/**
 * Context Menu default sample
 */
import { Browser } from '@syncfusion/ej2-base';
import { ListView, ListViewModel } from '@syncfusion/ej2-lists';
import { ContextMenu, ContextMenuModel } from '../../src/context-menu/index';
import { MenuEventArgs, MenuItemModel } from '../../src/common/index';

let listItems: { [key: string]: Object }[] = [
    {
        text: 'The Avengers',
        iconCss: 'e-icons e-video',
        id: 'movie1'
    },
    {
        text: 'Back to the Future',
        iconCss: 'e-icons e-video',
        id: 'movie2'
    },
    {
        text: 'Fight Club',
        iconCss: 'e-icons e-video',
        id: 'movie3'
    },
    {
        text: 'The Godfather',
        iconCss: 'e-icons e-video',
        id: 'movie4'
    },
    {
        text: 'The Dark Knight',
        iconCss: 'e-icons e-video',
        id: 'movie5'
    }];

let menuItems: MenuItemModel[] = [
    {
        text: 'Preview',
        iconCss: 'e-icons e-preview',
        url: 'http://www.google.com'
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

let listOptions: ListViewModel = {
    dataSource: listItems,
    headerTitle: 'Movie List',
    showHeader: true,
    showIcon: true
};

let menuOptions: ContextMenuModel = {
    target: '#listview .e-content',
    items: menuItems,
    showItemOnClick: false,
    beforeItemRender: (args: MenuEventArgs) => {
        if (args.item.url) {
            args.element.getElementsByTagName('a')[0].setAttribute('target', '_blank');
        }
    }
};

let listObj: ListView = new ListView(listOptions, '#listview');

let menuObj: ContextMenu = new ContextMenu(menuOptions, '#contextmenu');

if (Browser.isDevice) {
    document.body.classList.add('e-bigger');
}