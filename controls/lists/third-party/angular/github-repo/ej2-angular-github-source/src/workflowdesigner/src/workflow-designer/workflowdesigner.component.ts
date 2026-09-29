import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { WorkflowDesigner } from '@syncfusion/ej2-workflow-designer';

import { WorkflowStepsDirective } from './workflowsteps.directive';
import { WorkflowConnectionsDirective } from './workflowconnections.directive';
import { StickyNotesDirective } from './stickynotes.directive';

export const inputs: string[] = ['aiAssistSettings','canvasToolbarSettings','enablePersistence','enableRtl','errorSettings','locale','nodeCollectionSettings','propertyPanelSettings','simulationLogSettings','simulationSettings','simulationState','stickyNotes','toolbarSettings','workflowConnections','workflowSettings','workflowSteps'];
export const outputs: string[] = ['aiAssistCompleted','aiAssistFailed','aiAssistRequested','aiRequested','apiRequestRequested','approvalRequested','created','customExecutionRequested','formatterCompleted','notifyRequested','simulationCompleted','simulationFailed','simulationStarted','simulationStateChanged','simulationStepCompleted','simulationStepFailed','simulationStepStarted','simulationStopped','validationCompleted','workflowChanged','workflowItemSelected','workflowPropertyChanged'];
export const twoWays: string[] = [''];

/**
 * Workflow Designer Component
 * ```html
 * <ej-workflow-designer></ej-workflow-designer>
 * ```
 */
@Component({
    selector: 'ejs-workflowdesigner',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childWorkflowSteps: new ContentChild(WorkflowStepsDirective),
        childWorkflowConnections: new ContentChild(WorkflowConnectionsDirective),
        childStickyNotes: new ContentChild(StickyNotesDirective)
    }
})
@ComponentMixins([ComponentBase])
export class WorkflowDesignerComponent extends WorkflowDesigner implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare aiAssistCompleted: any;
	declare aiAssistFailed: any;
	declare aiAssistRequested: any;
	declare aiRequested: any;
	declare apiRequestRequested: any;
	declare approvalRequested: any;
	declare created: any;
	declare customExecutionRequested: any;
	declare formatterCompleted: any;
	declare notifyRequested: any;
	declare simulationCompleted: any;
	declare simulationFailed: any;
	declare simulationStarted: any;
	declare simulationStateChanged: any;
	declare simulationStepCompleted: any;
	declare simulationStepFailed: any;
	declare simulationStepStarted: any;
	declare simulationStopped: any;
	declare validationCompleted: any;
	declare workflowChanged: any;
	declare workflowItemSelected: any;
	public declare workflowPropertyChanged: any;
    public declare childWorkflowSteps: QueryList<WorkflowStepsDirective>;
    public declare childWorkflowConnections: QueryList<WorkflowConnectionsDirective>;
    public declare childStickyNotes: QueryList<StickyNotesDirective>;
    public tags: string[] = ['workflowSteps', 'workflowConnections', 'stickyNotes'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childWorkflowSteps;
        if (this.childWorkflowConnections) {
                    this.tagObjects[1].instance = this.childWorkflowConnections as any;
                }
        if (this.childStickyNotes) {
                    this.tagObjects[2].instance = this.childStickyNotes as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}


