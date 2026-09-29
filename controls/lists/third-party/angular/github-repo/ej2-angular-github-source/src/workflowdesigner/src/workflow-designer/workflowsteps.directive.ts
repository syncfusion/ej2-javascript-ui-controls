import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['appearance', 'customProps', 'errorHandling', 'id', 'nodeName', 'position', 'props', 'size', 'stepType', 'template'];
let outputs: string[] = [];
/**
 * Workflow Steps Directive
 * ```html
 * <e-workflow-steps>
 * <e-workflow-step></e-workflow-step>
 * </e-workflow-steps>
 * ```
 */
@Directive({
    selector: 'e-workflow-steps>e-workflow-step',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class WorkflowStepDirective extends ComplexBase<WorkflowStepDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the visual appearance of the workflow step.
     * @default {}
     */
    public declare appearance: any;
    /** 
     * Defines application-specific JSON-safe values associated with the step.
     * @default {}
     */
    public declare customProps: any;
    /** 
     * Defines the error-handling configuration of the workflow step.
     * 
     * The foundation stores this configuration but does not execute it.
     *     
     * @default {}
     */
    public declare errorHandling: any;
    /** 
     * Defines the unique identifier of the workflow step.
     * 
     * The identifier must be unique across workflow steps, workflow
     *connections and sticky notes.
     *     
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines the display name of the workflow step.
     * @default ''
     */
    public declare nodeName: any;
    /** 
     * Defines the exact canvas position of the workflow step.
     * @default { x: 0, y: 0 }
     */
    public declare position: any;
    /** 
     * Defines step-specific configuration values.
     * 
     * The foundation stores JSON-safe values without interpreting them.
     *     
     * @default {}
     */
    public declare props: any;
    /** 
     * Defines the size of the workflow step.
     * @default {}
     */
    public declare size: any;
    /** 
     * Defines the workflow step type.
     * @default 'ManualTrigger'
     */
    public declare stepType: any;
    /** 
     * Defines a runtime-only template for the workflow step.
     * 
     * This value must not be included in WorkflowDefinitionModel
     *serialization.
     *     
     * @default null
     */
    public declare template: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * WorkflowStep Array Directive
 * @private
 */
@Directive({
    selector: 'ej-workflow-designer>e-workflow-steps',
    standalone: true,
    queries: {
        children: new ContentChildren(WorkflowStepDirective)
    },
})
export class WorkflowStepsDirective extends ArrayBase<WorkflowStepsDirective> {
    constructor() {
        super('workflowsteps');
    }
}