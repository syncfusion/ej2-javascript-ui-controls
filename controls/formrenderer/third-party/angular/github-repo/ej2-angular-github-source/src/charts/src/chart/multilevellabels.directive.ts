import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { CategoriesDirective } from './categories.directive';

let input: string[] = ['alignment', 'border', 'categories', 'overflow', 'textStyle'];
let outputs: string[] = [];
/**
 * MultiLevelLabel Directive
 * ```html
 * <e-axis>
 * <e-multilevellabels>
 * <e-multilevellabel></e-multilevellabel>
 * </e-multilevellabels>
 * </e-axis>
 * ```
 */
@Directive({
    selector: 'e-axis>e-multilevellabels>e-multilevellabel',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childCategories: new ContentChild(CategoriesDirective)
    }
})
export class MultiLevelLabelDirective extends ComplexBase<MultiLevelLabelDirective> {
    public directivePropList: any;
	
    public declare childCategories: any;
    public tags: string[] = ['categories'];
    /** 
     * Defines the position of the multi-level labels. 
     * The available options are: 
     * * Near: Places the multi-level labels close to the chart elements. 
     * * Center: Positions the multi-level labels in the center of the chart elements. 
     * * Far: Places the multi-level labels further from the chart elements.
     * @default 'Center'
     */
    public declare alignment: any;
    /** 
     * The `border` property allows customization of the border for multi-level labels. 
     * It includes options to set the color, width, and type of the border.
     */
    public declare border: any;
    /** 
     * Configures multi-level categories for multi-level labels.
     */
    public declare categories: any;
    /** 
     * Defines the text overflow behavior for multi-level labels. 
     * The available options are: 
     * * Trim: Trims the text that overflows for multi-level labels. 
     * * Wrap: Wraps the text that overflows for multi-level labels. 
     * * None: No text overflow handling for multi-level labels.
     * @default 'Wrap'
     */
    public declare overflow: any;
    /** 
     * Options to customize the multi-level labels.
     */
    public declare textStyle: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * MultiLevelLabel Array Directive
 * @private
 */
@Directive({
    selector: 'e-axis>e-multilevellabels',
    standalone: true,
    queries: {
        children: new ContentChildren(MultiLevelLabelDirective)
    },
})
export class MultiLevelLabelsDirective extends ArrayBase<MultiLevelLabelsDirective> {
    constructor() {
        super('multilevellabels');
    }
}