import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaComponent } from './textarea.component';

const TEXTAREA_DIRECTIVES = [
    TextAreaComponent
];

/**
 * NgModule definition for the TextArea component.
 * Re-exports standalone TextArea component and directives so existing apps can keep using:
 * `imports: [TextAreaModule]`
 */
@NgModule({
    imports: [CommonModule, ...TEXTAREA_DIRECTIVES],
    exports: [...TEXTAREA_DIRECTIVES]
})
export class TextAreaModule { }