import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['category', 'columns', 'field', 'format', 'label', 'operators', 'ruleTemplate', 'step', 'template', 'type', 'validation', 'value', 'values'];
let outputs: string[] = [];
/**
 * `e-column` directive represent a column of the Angular QueryBuilder. 
 * It must be contained in a QueryBuilder component(`ejs-querybuilder`). 
 * ```html
 * <ejs-querybuilder [dataSource]='data'> 
 *   <e-columns>
 *    <e-column field='ID' label='ID' type='number'></e-column>
 *    <e-column field='Date' label='Date' type='date' format='dd/MM/yyyy'></e-column>
 *   </e-columns>
 * </ejs-querybuilder>
 * ```
 */
@Directive({
    selector: 'ejs-querybuilder>e-columns>e-column',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        ruleTemplate: new ContentChild('ruleTemplate'),
        template: new ContentChild('template')
    }
})
export class ColumnDirective extends ComplexBase<ColumnDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the types in columns field.
     * @default null
     */
    public declare type: any;
    /** 
     * Specifies the category for columns.
     * @default null
     */
    public declare category: any;
    /** 
     * Specifies the sub fields in columns.
     * @default null
     */
    public declare columns: any;
    /** 
     * Specifies the fields in columns.
     * @default null
     */
    public declare field: any;
    /** 
     * Specifies the date format for columns.
     * @asptype string
     * @blazortype string
     * @default null
     */
    public declare format: any;
    /** 
     * Specifies the labels name in columns.
     * @default null
     */
    public declare label: any;
    /** 
     * Specifies the operators in columns.
     * @default null
     */
    public declare operators: any;
    /** 
     * Specifies the step value(numeric textbox) for columns.
     * @default null
     */
    public declare step: any;
    /** 
     * Specifies the validation for columns (text, number and date).
     * @default { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    public declare validation: any;
    /** 
     * Specifies the default value for columns.
     * @default null
     */
    public declare value: any;
    /** 
     * Specifies the values in columns or bind the values from sub controls.
     * @default null
     */
    public declare values: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(ColumnDirective.prototype, 'ruleTemplate');
Template()(ColumnDirective.prototype, 'template');

/**
 * Column Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-querybuilder>e-columns',
    standalone: true,
    queries: {
        children: new ContentChildren(ColumnDirective)
    },
})
export class ColumnsDirective extends ArrayBase<ColumnsDirective> {
    constructor() {
        super('columns');
    }
}