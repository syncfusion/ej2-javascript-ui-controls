import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStepDirective, WorkflowStepsDirective } from './workflowsteps.directive';
import { WorkflowConnectionDirective, WorkflowConnectionsDirective } from './workflowconnections.directive';
import { StickyNoteDirective, StickyNotesDirective } from './stickynotes.directive';
import { WorkflowDesignerComponent } from './workflowdesigner.component';
import { WorkflowDesignerModule } from './workflowdesigner.module';





/**
 * NgModule definition for the WorkflowDesigner component with providers.
 */
@NgModule({
    imports: [CommonModule, WorkflowDesignerModule],
    exports: [
        WorkflowDesignerModule
    ],
    providers:[
        
    ]
})
export class WorkflowDesignerAllModule { }