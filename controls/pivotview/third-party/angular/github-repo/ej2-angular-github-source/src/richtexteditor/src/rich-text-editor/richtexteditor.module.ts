import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './richtexteditor.component';

const RICHTEXTEDITOR_DIRECTIVES = [
    RichTextEditorComponent
];

/**
 * NgModule definition for the RichTextEditor component.
 * Re-exports standalone RichTextEditor component and directives so existing apps can keep using:
 * `imports: [RichTextEditorModule]`
 */
@NgModule({
    imports: [CommonModule, ...RICHTEXTEDITOR_DIRECTIVES],
    exports: [...RICHTEXTEDITOR_DIRECTIVES]
})
export class RichTextEditorModule { }