import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['columnName', 'customAggregate', 'field', 'footerTemplate', 'format', 'type'];
let outputs: string[] = [];
/**
 * `e-aggregate->e-column` directive represent a aggregate column of the Angular TreeGrid. 
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
    selector: 'ejs-treegrid>e-aggregates>e-aggregate>e-columns>e-column',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        footerTemplate: new ContentChild('footerTemplate')
    }
})
export class AggregateColumnDirective extends ComplexBase<AggregateColumnDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the aggregate type(s) for a particular column. 
     * To apply multiple aggregates to a single column, specify the `type` as an array. 
     * Available aggregate types include: 
     * * `sum`: Calculates the sum of all values in a column. 
     * * `average`: Computes the average of the column values. 
     * * `max`: Finds the maximum value in a column. 
     * * `min`: Finds the minimum value in a column. 
     * * `count`: Counts the number of records. 
     * * `falsecount`: Counts the number of false values. 
     * * `truecount`: Counts the number of true values. 
     * * `custom`: Allows for a custom aggregate function.
     * 
     * Use `custom` to specify a custom aggregation.
     *     
     * @asptype string
     * @default null
     */
    public declare type: any;
    /** 
     * Specifies the column name to display the aggregate value. If not defined, the `field` name is used by default.
     * @default null
     */
    public declare columnName: any;
    /** 
     * Defines a custom function to calculate the aggregate value. The `type` must be set to `custom`. 
     * Use the custom value as `${custom}` in templates. 
     * * `Total aggregation`: The custom function is called with the entire dataset and the current `AggregateColumn` object. 
     * * `Group aggregation`: It is called with the current group details and the `AggregateColumn` object.
     * @default null
     */
    public declare customAggregate: any;
    /** 
     * Specifies the column name on which to perform the aggregation.
     * @default null
     */
    public declare field: any;
    /** 
     * Specifies the format to be applied to the calculated aggregate value before display. 
     * Supports both standard and custom formats for numbers and dates. 
     * Refer to the Syncfusion documentation for [number](https://ej2.syncfusion.com/documentation/common/internationalization#supported-format-string) 
     * and [date](https://ej2.syncfusion.com/documentation/common/internationalization#date-formatting) formats.
     * @asptype string
     * @default null
     */
    public declare format: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(AggregateColumnDirective.prototype, 'footerTemplate');

/**
 * AggregateColumn Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-treegrid>e-aggregates>e-aggregate>e-columns',
    standalone: true,
    queries: {
        children: new ContentChildren(AggregateColumnDirective)
    },
})
export class AggregateColumnsDirective extends ArrayBase<AggregateColumnsDirective> {
    constructor() {
        super('columns');
    }
}