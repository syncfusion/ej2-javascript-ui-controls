import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEditorComponent } from './markdowneditor.component';

/**
 * NgModule definition for the MarkdownEditor component.
 */
@NgModule({
    imports: [CommonModule],
    declarations: [
        MarkdownEditorComponent
    ],
    exports: [
        MarkdownEditorComponent
    ]
})
export class MarkdownEditorModule { }