import { Component } from '@angular/core';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';

/**
 * DropDownButton Controller
 */
@Component({
    selector: 'dropdownbutton',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css']
})

export class DropDownButtonComponent {
    //DropDownButton items definition
    public items: ItemModel[] = [
        {
            text: 'Dashboard',
            iconCss: 'e-ddb-icons e-dashboard'
        },
        {
            text: 'Notifications',
            iconCss: 'e-ddb-icons e-notifications',
        },
        {
            text: 'User Settings',
            iconCss: 'e-ddb-icons e-settings',
        },
        {
            text: 'Log Out',
            iconCss: 'e-ddb-icons e-logout'
        }];
 }