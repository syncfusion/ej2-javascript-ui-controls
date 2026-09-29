import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['id', 'label', 'sourceDecorator', 'sourcePort', 'sourceStepId', 'style', 'targetDecorator', 'targetPort', 'targetStepId', 'type'];
let outputs: string[] = [];
/**
 * Workflow Connections Directive
 * ```html
 * <e-workflow-connections>
 * <e-workflow-connection></e-workflow-connection>
 * </e-workflow-connections>
 * ```
 */
@Directive({
    selector: 'e-workflow-connections>e-workflow-connection',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class WorkflowConnectionDirective extends ComplexBase<WorkflowConnectionDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the connector geometry type.
     * @default 'Orthogonal'
     */
    public declare type: any;
    /** 
     * Defines the unique identifier of the workflow connection.
     * 
     * The identifier must be unique across workflow steps, workflow
     *connections and sticky notes.
     *     
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines the connector label.
     * @default ''
     */
    public declare label: any;
    /** 
     * Defines the decorator displayed at the source end of the connection.
     * @default 'None'
     */
    public declare sourceDecorator: any;
    /** 
     * Defines the source output port name.
     * @default 'output'
     */
    public declare sourcePort: any;
    /** 
     * Defines the identifier of the source workflow step.
     * @default ''
     */
    public declare sourceStepId: any;
    /** 
     * Defines the visual style of the workflow connection.
     * @default {}
     */
    public declare style: any;
    /** 
     * Defines the decorator displayed at the target end of the connection.
     * @default 'Arrow'
     */
    public declare targetDecorator: any;
    /** 
     * Defines the target input port name.
     * @default 'input'
     */
    public declare targetPort: any;
    /** 
     * Defines the identifier of the target workflow step.
     * @default ''
     */
    public declare targetStepId: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * WorkflowConnection Array Directive
 * @private
 */
@Directive({
    selector: 'ej-workflow-designer>e-workflow-connections',
    standalone: true,
    queries: {
        children: new ContentChildren(WorkflowConnectionDirective)
    },
})
export class WorkflowConnectionsDirective extends ArrayBase<WorkflowConnectionsDirective> {
    constructor() {
        super('workflowconnections');
    }
}