import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { RangesDirective } from './ranges.directive';
import { PointersDirective } from './pointers.directive';

let input: string[] = ['isInversed', 'labelStyle', 'line', 'majorTicks', 'maximum', 'minimum', 'minorTicks', 'opposedPosition', 'pointers', 'ranges', 'showLastLabel'];
let outputs: string[] = [];
/**
 * Represents the directive to render the axes in the Linear Gauge.
 * ```html
 * <e-axes><e-axis></e-axis></e-axes>
 * ```
 */
@Directive({
    selector: 'e-axes>e-axis',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childRanges: new ContentChild(RangesDirective),
        childPointers: new ContentChild(PointersDirective)
    }
})
export class AxisDirective extends ComplexBase<AxisDirective> {
    public directivePropList: any;
	
    public declare childRanges: any;
    public declare childPointers: any;
    public tags: string[] = ['ranges', 'pointers'];
    /** 
     * Enables or disables the inversed axis.
     * @default false
     */
    public declare isInversed: any;
    /** 
     * Sets and gets the options for customizing the appearance of the label in axis.
     */
    public declare labelStyle: any;
    /** 
     * Sets and gets the options for customizing the appearance of the axis line.
     */
    public declare line: any;
    /** 
     * Sets and gets the options for customizing the major tick lines.
     */
    public declare majorTicks: any;
    /** 
     * Sets and gets the maximum value for the axis.
     * @default 100
     */
    public declare maximum: any;
    /** 
     * Sets and gets the minimum value for the axis.
     * @default 0
     */
    public declare minimum: any;
    /** 
     * Sets and gets the options for customizing the minor tick lines.
     */
    public declare minorTicks: any;
    /** 
     * Enables or disables the opposed position of the axis in the linear gauge.
     * @default false
     */
    public declare opposedPosition: any;
    /** 
     * Sets and gets the options for customizing the pointers of an axis.
     */
    public declare pointers: any;
    /** 
     * Sets and gets the options for customizing the ranges of an axis.
     */
    public declare ranges: any;
    /** 
     * Shows or hides the last label in the axis of the linear gauge.
     * @default false
     */
    public declare showLastLabel: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Axis Array Directive
 * @private
 */
@Directive({
    selector: 'ej-lineargauge>e-axes',
    standalone: true,
    queries: {
        children: new ContentChildren(AxisDirective)
    },
})
export class AxesDirective extends ArrayBase<AxesDirective> {
    constructor() {
        super('axes');
    }
}