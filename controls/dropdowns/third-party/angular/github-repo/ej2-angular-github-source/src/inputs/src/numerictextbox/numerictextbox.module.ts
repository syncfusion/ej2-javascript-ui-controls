import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumericTextBoxComponent } from './numerictextbox.component';

const NUMERICTEXTBOX_DIRECTIVES = [
    NumericTextBoxComponent
];

/**
 * NgModule definition for the NumericTextBox component.
 * Re-exports standalone NumericTextBox component and directives so existing apps can keep using:
 * `imports: [NumericTextBoxModule]`
 */
@NgModule({
    imports: [CommonModule, ...NUMERICTEXTBOX_DIRECTIVES],
    exports: [...NUMERICTEXTBOX_DIRECTIVES]
})
export class NumericTextBoxModule { }