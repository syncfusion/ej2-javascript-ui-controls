import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckBoxComponent } from './checkbox.component';

const CHECKBOX_DIRECTIVES = [
    CheckBoxComponent
];

/**
 * NgModule definition for the CheckBox component.
 * Re-exports standalone CheckBox component and directives so existing apps can keep using:
 * `imports: [CheckBoxModule]`
 */
@NgModule({
    imports: [CommonModule, ...CHECKBOX_DIRECTIVES],
    exports: [...CHECKBOX_DIRECTIVES]
})
export class CheckBoxModule { }