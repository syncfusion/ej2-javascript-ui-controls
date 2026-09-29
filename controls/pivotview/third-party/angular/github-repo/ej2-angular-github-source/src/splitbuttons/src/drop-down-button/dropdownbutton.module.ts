import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownButtonItemDirective, DropDownButtonItemsDirective } from './items.directive';
import { DropDownButtonComponent } from './dropdownbutton.component';

const DROPDOWNBUTTON_DIRECTIVES = [
    DropDownButtonComponent,
        DropDownButtonItemDirective,
        DropDownButtonItemsDirective
];

/**
 * NgModule definition for the DropDownButton component.
 * Re-exports standalone DropDownButton component and directives so existing apps can keep using:
 * `imports: [DropDownButtonModule]`
 */
@NgModule({
    imports: [CommonModule, ...DROPDOWNBUTTON_DIRECTIVES],
    exports: [...DROPDOWNBUTTON_DIRECTIVES]
})
export class DropDownButtonModule { }