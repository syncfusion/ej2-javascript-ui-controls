import { Component } from '@angular/core';
/**
 * Icon Tab
 */
@Component({
    selector: 'app-tab',
    templateUrl: 'icon.component.html',
    styleUrls: ['icon.component.css']
})

export class IconComponent {
    public headerText: Object = [
        { text: 'Twitter', 'iconCss': 'e-twitter', iconPosition: 'top' },
        { text: 'Facebook', 'iconCss': 'e-facebook', iconPosition: 'top' },
        { text: 'WhatsApp', 'iconCss': 'e-whatsapp', iconPosition: 'top' }
      ];
}