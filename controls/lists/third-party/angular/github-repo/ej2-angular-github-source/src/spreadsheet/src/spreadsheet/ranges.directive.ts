import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['address', 'dataSource', 'fieldsOrder', 'query', 'showFieldAsHeader', 'startCell', 'template'];
let outputs: string[] = [];
/**
 * `e-range` directive represent a range of the Angular Spreadsheet.
 * It must be contained in a `e-sheet` directive.
 * ```html
 * <ejs-spreadsheet>
 *   <e-sheets>
 *    <e-sheet>
 *    <e-ranges>
 *    <e-range [dataSource]='data'></e-range>
 *    </e-ranges>
 *    </e-sheet>
 *   </e-sheets>
 * </ejs-spreadsheet>
 * ```
 */
@Directive({
    selector: 'e-ranges>e-range',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        template: new ContentChild('template')
    }
})
export class RangeDirective extends ComplexBase<RangeDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the address for updating the dataSource or template.
     * @default 'A1'
     */
    public declare address: any;
    /** 
     * Specifies the data as JSON / Data manager to the sheet.
     * @default null
     */
    public declare dataSource: any;
    /** 
     * By default, when a sheet is bound to a data source, columns are assigned to data source fields sequentially. 
     * This means that the first data field is assigned to Column A, the second to Column B, and so on. 
     * You can customize these assignments by specifying the field names in the desired column order using the 'fieldsOrder' property.
     * @default null
     */
    public declare fieldsOrder: any;
    /** 
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html) 
     * that will be executed along with data processing.
     * @default null
     */
    public declare query: any;
    /** 
     * Show/Hide the field of the datasource as header.
     * @default true
     */
    public declare showFieldAsHeader: any;
    /** 
     * Specifies the start cell from which the datasource will be populated.
     * @default 'A1'
     */
    public declare startCell: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(RangeDirective.prototype, 'template');

/**
 * Range Array Directive
 * @private
 */
@Directive({
    selector: 'e-sheet>e-ranges',
    standalone: true,
    queries: {
        children: new ContentChildren(RangeDirective)
    },
})
export class RangesDirective extends ArrayBase<RangesDirective> {
    constructor() {
        super('ranges');
    }
}