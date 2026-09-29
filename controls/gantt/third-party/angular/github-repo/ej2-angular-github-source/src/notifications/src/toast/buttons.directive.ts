import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['model'];
let outputs: string[] = ['click'];
/**
 * 'e-button' directive represent a button of angular toast 
 * It must be contained in a Toast component(`ejs-toast`). 
 * ```html
 * <ejs-toast id='toast' showCloseIcon=true> 
 *   <e-buttons>
 *    <e-button content='Ok' isPrimary=true></e-button>
 *    <e-button content='Cancel'></e-button>
 *   </e-buttons>
 * </ejs-toast>
 * ```
 */
@Directive({
    selector: 'e-buttonmodelprops>e-buttonmodelprop',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ButtonModelPropDirective extends ComplexBase<ButtonModelPropDirective> {
    public directivePropList: any;
	public declare click: any;


    /** 
     * Specifies the Button component model properties to render the Toast action buttons. 
     * 
     * @default null
     */
    public declare model: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * ButtonModelProp Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-toast>e-buttonmodelprops',
    standalone: true,
    queries: {
        children: new ContentChildren(ButtonModelPropDirective)
    },
})
export class ButtonModelPropsDirective extends ArrayBase<ButtonModelPropsDirective> {
    constructor() {
        super('buttons');
    }
}