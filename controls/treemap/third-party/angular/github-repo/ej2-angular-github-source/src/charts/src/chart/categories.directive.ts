import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['customAttributes', 'end', 'maximumTextWidth', 'start', 'text', 'type'];
let outputs: string[] = [];
/**
 * MultiLevelLabels Directive
 * ```html
 * <e-multilevellabels>
 * <e-multilevellabel>
 * <e-Categories>
 * <e-Category>
 * </e-Category>
 * </e-Categories>
 * </e-multilevellabel>
 * </e-multilevellabels>
 * ```
 */
@Directive({
    selector: 'e-multilevellabel>e-categories>e-category',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class CategoryDirective extends ComplexBase<CategoryDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the type of border for labels. 
     * Available border types: 
     * * Rectangle 
     * * Without Top Border 
     * * Without Top and Bottom Border 
     * * Without Border 
     * * Brace 
     * * Curly Brace
     * @default 'Rectangle'
     * @aspdefaultvalueignore 
     * @blazordefaultvalueignore 
     */
    public declare type: any;
    /** 
     * Allows adding custom data for multi-level labels.
     * @default null
     */
    public declare customAttributes: any;
    /** 
     * Specifies the end value for the multi-level labels.
     * @default null
     * @aspdefaultvalueignore 
     */
    public declare end: any;
    /** 
     * Specifies the maximum width of the text for multi-level labels.
     * @default null
     * @aspdefaultvalueignore 
     */
    public declare maximumTextWidth: any;
    /** 
     * Specifies the starting value for the multi-level labels.
     * @default null
     * @aspdefaultvalueignore 
     */
    public declare start: any;
    /** 
     * Specifies the text to be displayed for the multi-level labels.
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
 * Category Array Directive
 * @private
 */
@Directive({
    selector: 'e-multilevellabel>e-categories',
    standalone: true,
    queries: {
        children: new ContentChildren(CategoryDirective)
    },
})
export class CategoriesDirective extends ArrayBase<CategoriesDirective> {
    constructor() {
        super('categories');
    }
}