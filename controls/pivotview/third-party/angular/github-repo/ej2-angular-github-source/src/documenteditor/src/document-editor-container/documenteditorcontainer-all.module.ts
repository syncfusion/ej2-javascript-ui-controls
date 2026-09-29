import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEditorContainerComponent } from './documenteditorcontainer.component';
import { DocumentEditorContainerModule } from './documenteditorcontainer.module';
import {Toolbar, Ribbon} from '@syncfusion/ej2-documenteditor'


export const ToolbarService: ValueProvider = { provide: 'DocumentEditorToolbar', useValue: Toolbar};
export const RibbonService: ValueProvider = { provide: 'DocumentEditorRibbon', useValue: Ribbon};

/**
 * NgModule definition for the DocumentEditorContainer component with providers.
 */
@NgModule({
    imports: [CommonModule, DocumentEditorContainerModule],
    exports: [
        DocumentEditorContainerModule
    ],
    providers:[
        ToolbarService,
        RibbonService
    ]
})
export class DocumentEditorContainerAllModule { }