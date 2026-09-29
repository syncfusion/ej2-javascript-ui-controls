import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBoxComponent } from './textbox.component';

const TEXTBOX_DIRECTIVES = [
    TextBoxComponent
];

/**
 * NgModule definition for the TextBox component.
 * Re-exports standalone TextBox component and directives so existing apps can keep using:
 * `imports: [TextBoxModule]`
 */
@NgModule({
    imports: [CommonModule, ...TEXTBOX_DIRECTIVES],
    exports: [...TEXTBOX_DIRECTIVES]
})
export class TextBoxModule { }