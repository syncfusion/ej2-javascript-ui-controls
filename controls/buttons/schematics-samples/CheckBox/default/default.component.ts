import { Component, ViewChild } from '@angular/core';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';

/**
 * CheckBox Controller
 */
@Component({
    selector: 'app-checkbox',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css']
})

export class CheckBoxController {
    @ViewChild('checkbox')
    public checkbox: CheckBoxComponent;

    // function to handle the CheckBox change event
    public changeHandler(): void {
        this.checkbox.label = 'CheckBox: ' + this.checkbox.checked;
    }
 }
