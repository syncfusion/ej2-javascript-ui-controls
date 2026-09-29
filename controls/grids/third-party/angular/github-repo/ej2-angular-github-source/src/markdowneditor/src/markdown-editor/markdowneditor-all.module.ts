import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEditorComponent } from './markdowneditor.component';
import { MarkdownEditorModule } from './markdowneditor.module';





/**
 * NgModule definition for the MarkdownEditor component with providers.
 */
@NgModule({
    imports: [CommonModule, MarkdownEditorModule],
    exports: [
        MarkdownEditorModule
    ],
    providers:[
        
    ]
})
export class MarkdownEditorAllModule { }