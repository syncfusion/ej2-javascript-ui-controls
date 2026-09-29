import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockEditorComponent } from './blockeditor.component';
import { BlockEditorModule } from './blockeditor.module';
import {Collaboration, VersionHistory} from '@syncfusion/ej2-blockeditor'


export const CollaborationService: ValueProvider = { provide: 'BlockEditorCollaboration', useValue: Collaboration};
export const VersionHistoryService: ValueProvider = { provide: 'BlockEditorVersionHistory', useValue: VersionHistory};

/**
 * NgModule definition for the BlockEditor component with providers.
 */
@NgModule({
    imports: [CommonModule, BlockEditorModule],
    exports: [
        BlockEditorModule
    ],
    providers:[
        CollaborationService,
        VersionHistoryService
    ]
})
export class BlockEditorAllModule { }