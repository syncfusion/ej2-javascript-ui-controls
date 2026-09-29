import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboBoxComponent } from './combobox.component';

const COMBOBOX_DIRECTIVES = [
    ComboBoxComponent
];

/**
 * NgModule definition for the ComboBox component.
 * Re-exports standalone ComboBox component and directives so existing apps can keep using:
 * `imports: [ComboBoxModule]`
 */
@NgModule({
    imports: [CommonModule, ...COMBOBOX_DIRECTIVES],
    exports: [...COMBOBOX_DIRECTIVES]
})
export class ComboBoxModule { }