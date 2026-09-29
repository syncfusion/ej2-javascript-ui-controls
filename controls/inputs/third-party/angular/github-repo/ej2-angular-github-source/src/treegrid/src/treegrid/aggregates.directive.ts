import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { AggregateColumnsDirective } from './aggregate-columns.directive';

let input: string[] = ['columns', 'showChildSummary'];
let outputs: string[] = [];
/**
 * `e-aggregate` directive represent a aggregate row of the Angular TreeGrid. 
 * It must be contained in a TreeGrid component(`ejs-treegrid`). 
 * ```html
 * <ejs-treegrid [dataSource]='data' allowPaging='true' allowSorting='true'> 
 *   <e-columns>
 *     <e-column field='ID' width='100'></e-column>
 *     <e-column field='name' headerText='Name' width='100'></e-column>
 *   </e-columns>
 *   <e-aggregates>
 *     <e-aggregate>
 *       <e-columns>
 *         <e-column field='ID' type='Min'></e-column>
 *       </e-columns>
 *      </e-aggregate>
 *    </e-aggregates>
 * </ejs-treegrid>
 * ```
 */
@Directive({
    selector: 'ejs-treegrid>e-aggregates>e-aggregate',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childColumns: new ContentChild(AggregateColumnsDirective)
    }
})
export class AggregateDirective extends ComplexBase<AggregateDirective> {
    public directivePropList: any;
	
    public declare childColumns: any;
    public tags: string[] = ['columns'];
    /** 
     * Configures the collection of aggregate columns.
     * @default []
     */
    public declare columns: any;
    /** 
     * Determines whether to display child summaries for each parent row.
     */
    public declare showChildSummary: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Aggregate Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-treegrid>e-aggregates',
    standalone: true,
    queries: {
        children: new ContentChildren(AggregateDirective)
    },
})
export class AggregatesDirective extends ArrayBase<AggregatesDirective> {
    constructor() {
        super('aggregates');
    }
}