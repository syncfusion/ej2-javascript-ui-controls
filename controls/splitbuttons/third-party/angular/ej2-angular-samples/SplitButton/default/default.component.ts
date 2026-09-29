import { Component } from '@angular/core';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';

/**
 * Toolbar integration Menu Controller
 */
@Component({
    selector: 'splitbutton',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css']
})

export class SplitButtonComponent {
    //SplitButton items definition
    public items: ItemModel[] = [
        {
            text: 'Paste',
            iconCss: 'e-btn-icons e-paste'
        },
        {
            text: 'Paste Special',
            iconCss: 'e-btn-icons e-paste-special'
        },
        {
            text: 'Paste as Formula',
            iconCss: 'e-btn-icons e-paste-formula'
        },
        {
            text: 'Paste as Hyperlink',
            iconCss: 'e-btn-icons e-paste-hyperlink'
        }
    ];

    public addDisabled(args: MenuEventArgs): void {
        if (args.item.text !== 'Paste') {
            args.element.classList.add('e-disabled');
        }
    }
}
