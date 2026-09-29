import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskedTextBoxComponent } from './maskedtextbox.component';

const MASKEDTEXTBOX_DIRECTIVES = [
    MaskedTextBoxComponent
];

/**
 * NgModule definition for the MaskedTextBox component.
 * Re-exports standalone MaskedTextBox component and directives so existing apps can keep using:
 * `imports: [MaskedTextBoxModule]`
 */
@NgModule({
    imports: [CommonModule, ...MASKEDTEXTBOX_DIRECTIVES],
    exports: [...MASKEDTEXTBOX_DIRECTIVES]
})
export class MaskedTextBoxModule { }