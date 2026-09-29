import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['cssClass', 'disabled', 'iconCss', 'isValid', 'label', 'optional', 'status', 'text'];
let outputs: string[] = [];
/**
 * 'e-step' directive represents a step of the Angular Stepper.
 * It must be contained in a Stepper component(`ejs-stepper`). 
 * ```html
 * <ejs-stepper>
 *  <e-steps>
 *   <e-step [iconCss]='e-icons e-folder' [text]='Step 1' />
 *   <e-step [iconCss]='e-icons e-folder' [text]='Step 2' />
 *  </e-steps> 
 * </ejs-stepper>
 * ```
 */
@Directive({
    selector: 'ejs-stepper>e-steps>e-step',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class StepDirective extends ComplexBase<StepDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the CSS class to customize the step appearance.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Defines whether a step is enabled or disabled.
     * @default false
     */
    public declare disabled: any;
    /** 
     * Defines the icon content of the step.
     * @default ''
     */
    public declare iconCss: any;
    /** 
     * Defines the state whether it is valid completion or not. 
     * If set to true, the completion is valid. 
     * If false, the completion is invalid. 
     * If null, the completion state is not determined.
     * @asptype bool?
     * @default null
     */
    public declare isValid: any;
    /** 
     * Defines the label content of the step.
     * @default ''
     */
    public declare label: any;
    /** 
     * Defines whether the step is optionally to skip completion or not.
     * @default false
     */
    public declare optional: any;
    /** 
     * Defines the status of the step. 
     * The possible values are 
     * * NotStarted 
     * * InProgress 
     * * Completed
     * @isenumeration true
     * @default StepStatus.NotStarted
     * @asptype StepStatus
     */
    public declare status: any;
    /** 
     * Defines the text content of the step.
     * @default ''
     */
    public declare text: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Step Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-stepper>e-steps',
    standalone: true,
    queries: {
        children: new ContentChildren(StepDirective)
    },
})
export class StepsDirective extends ArrayBase<StepsDirective> {
    constructor() {
        super('steps');
    }
}