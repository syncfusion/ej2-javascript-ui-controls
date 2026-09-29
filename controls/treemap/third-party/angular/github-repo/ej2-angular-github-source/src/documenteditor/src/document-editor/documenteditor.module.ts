import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEditorComponent } from './documenteditor.component';

const DOCUMENTEDITOR_DIRECTIVES = [
    DocumentEditorComponent
];

/**
 * NgModule definition for the DocumentEditor component.
 * Re-exports standalone DocumentEditor component and directives so existing apps can keep using:
 * `imports: [DocumentEditorModule]`
 */
@NgModule({
    imports: [CommonModule, ...DOCUMENTEDITOR_DIRECTIVES],
    exports: [...DOCUMENTEDITOR_DIRECTIVES]
})
export class DocumentEditorModule { }