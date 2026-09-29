import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorUIComponent } from './richtexteditorui.component';

const RICHTEXTEDITORUI_DIRECTIVES = [
    RichTextEditorUIComponent
];

/**
 * NgModule definition for the RichTextEditorUI component.
 * Re-exports standalone RichTextEditorUI component and directives so existing apps can keep using:
 * `imports: [RichTextEditorUIModule]`
 */
@NgModule({
    imports: [CommonModule, ...RICHTEXTEDITORUI_DIRECTIVES],
    exports: [...RICHTEXTEDITORUI_DIRECTIVES]
})
export class RichTextEditorUIModule { }