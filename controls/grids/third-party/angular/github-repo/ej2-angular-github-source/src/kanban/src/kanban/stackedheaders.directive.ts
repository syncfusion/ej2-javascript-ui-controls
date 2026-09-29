import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['keyFields', 'text'];
let outputs: string[] = [];
/**
 * `e-stackedHeaders` directive represent a stacked header of the Kanban board. 
 * It must be contained in a Kanban component(`ejs-kanban`). 
 * ```html
 * <ejs-kanban>
 *   <e-stackedHeaders>
 *    <e-stackedHeader keyField='Open' text='To Do'></e-stackedHeader>
 *    <e-stackedHeader keyField='Close' text='Completed'></e-stackedHeader>
 *   </e-stackedHeaders>
 * </ejs-kanban>
 * ```
 */
@Directive({
    selector: 'e-stackedHeaders>e-stackedHeader',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class StackedHeaderDirective extends ComplexBase<StackedHeaderDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the multiple columns keyField
     * @default null
     */
    public declare keyFields: any;
    /** 
     * Defines the column header text
     * @default null
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
 * StackedHeader Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-kanban>e-stackedHeaders',
    standalone: true,
    queries: {
        children: new ContentChildren(StackedHeaderDirective)
    },
})
export class StackedHeadersDirective extends ArrayBase<StackedHeadersDirective> {
    constructor() {
        super('stackedheaders');
    }
}