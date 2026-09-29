import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radiobutton.component';

const RADIOBUTTON_DIRECTIVES = [
    RadioButtonComponent
];

/**
 * NgModule definition for the RadioButton component.
 * Re-exports standalone RadioButton component and directives so existing apps can keep using:
 * `imports: [RadioButtonModule]`
 */
@NgModule({
    imports: [CommonModule, ...RADIOBUTTON_DIRECTIVES],
    exports: [...RADIOBUTTON_DIRECTIVES]
})
export class RadioButtonModule { }