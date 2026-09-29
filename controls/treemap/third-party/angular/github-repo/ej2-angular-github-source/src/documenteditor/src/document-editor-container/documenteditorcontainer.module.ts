import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEditorContainerComponent } from './documenteditorcontainer.component';

const DOCUMENTEDITORCONTAINER_DIRECTIVES = [
    DocumentEditorContainerComponent
];

/**
 * NgModule definition for the DocumentEditorContainer component.
 * Re-exports standalone DocumentEditorContainer component and directives so existing apps can keep using:
 * `imports: [DocumentEditorContainerModule]`
 */
@NgModule({
    imports: [CommonModule, ...DOCUMENTEDITORCONTAINER_DIRECTIVES],
    exports: [...DOCUMENTEDITORCONTAINER_DIRECTIVES]
})
export class DocumentEditorContainerModule { }