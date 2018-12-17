import { Component } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
/**
 * Default ContextMenu Controller
 */
@Component({
    selector: 'app-contextmenu',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css']
})

export class ContextMenuComponent {

    // ContextMenu items definition
    public menuItems: MenuItemModel[] = [
        {
            text: 'Cut',
            iconCss: 'e-cm-icons e-cut'
        },
        {
            text: 'Copy',
            iconCss: 'e-cm-icons e-copy'
        },
        {
            text: 'Paste',
            iconCss: 'e-cm-icons e-paste',
            items: [
                {
                    text: 'Paste Text',
                    iconCss: 'e-cm-icons e-pastetext'
                },
                {
                    text: 'Paste Special',
                    iconCss: 'e-cm-icons e-pastespecial'
                }
            ]
        },
        {
            separator: true
        },
        {
            text: 'Link',
            iconCss: 'e-cm-icons e-link'
        },
        {
            text: 'New Comment',
            iconCss: 'e-cm-icons e-comment'
        }];

    // Event triggers while rendering each menu item where “Link” menu item is disabled
    public addDisabled  (args: MenuEventArgs) {
        if (args.item.text === 'Link') {
            args.element.classList.add('e-disabled');
        }
    }
}
