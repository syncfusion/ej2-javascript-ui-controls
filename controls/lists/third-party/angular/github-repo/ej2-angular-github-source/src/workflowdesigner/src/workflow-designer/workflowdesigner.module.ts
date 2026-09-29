import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStepDirective, WorkflowStepsDirective } from './workflowsteps.directive';
import { WorkflowConnectionDirective, WorkflowConnectionsDirective } from './workflowconnections.directive';
import { StickyNoteDirective, StickyNotesDirective } from './stickynotes.directive';
import { WorkflowDesignerComponent } from './workflowdesigner.component';

const WORKFLOWDESIGNER_DIRECTIVES = [
    WorkflowDesignerComponent,
        WorkflowStepDirective,
        WorkflowStepsDirective,
        WorkflowConnectionDirective,
        WorkflowConnectionsDirective,
        StickyNoteDirective,
        StickyNotesDirective
];

/**
 * NgModule definition for the WorkflowDesigner component.
 * Re-exports standalone WorkflowDesigner component and directives so existing apps can keep using:
 * `imports: [WorkflowDesignerModule]`
 */
@NgModule({
    imports: [CommonModule, ...WORKFLOWDESIGNER_DIRECTIVES],
    exports: [...WORKFLOWDESIGNER_DIRECTIVES]
})
export class WorkflowDesignerModule { }