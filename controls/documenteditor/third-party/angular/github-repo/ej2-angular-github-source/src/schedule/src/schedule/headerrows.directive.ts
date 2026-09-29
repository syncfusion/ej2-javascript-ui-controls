import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['option', 'template'];
let outputs: string[] = [];
/**
 * `e-header-rows` directive represent a header rows of the Schedule. 
 * It must be contained in a Schedule component(`ejs-schedule`). 
 * ```html
 * <ejs-schedule>
 *   <e-header-rows>
 *    <e-header-row option='Week'></e-header-row>
 *    <e-header-row option='Date'></e-header-row>
 *   </e-header-rows>
 * </ejs-schedule>
 * ```
 */
@Directive({
    selector: 'e-header-rows>e-header-row',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        template: new ContentChild('template')
    }
})
export class HeaderRowDirective extends ComplexBase<HeaderRowDirective> {
    public directivePropList: any;
	


    /** 
     * It defines the header row type, which accepts either of the following values. 
     * * `Year`: Denotes the year row in the header bar. 
     * * `Month`: Denotes the month row in the header bar. 
     * * `Week`: Denotes the week row in the header bar. 
     * * `Date`: Denotes the date row in the header bar. 
     * * `Hour`: Denotes the hour row in the header bar.
     * @default null
     */
    public declare option: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(HeaderRowDirective.prototype, 'template');

/**
 * HeaderRow Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-schedule>e-header-rows',
    standalone: true,
    queries: {
        children: new ContentChildren(HeaderRowDirective)
    },
})
export class HeaderRowsDirective extends ArrayBase<HeaderRowsDirective> {
    constructor() {
        super('headerrows');
    }
}