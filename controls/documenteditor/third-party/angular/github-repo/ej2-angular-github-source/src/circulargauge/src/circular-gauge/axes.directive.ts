import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { AnnotationsDirective } from './annotations.directive';
import { RangesDirective } from './ranges.directive';
import { PointersDirective } from './pointers.directive';

let input: string[] = ['annotations', 'background', 'direction', 'endAngle', 'hideIntersectingLabel', 'labelStyle', 'lineStyle', 'majorTicks', 'maximum', 'minimum', 'minorTicks', 'pointers', 'radius', 'rangeGap', 'ranges', 'roundingPlaces', 'showLastLabel', 'startAndEndRangeGap', 'startAngle'];
let outputs: string[] = [];
/**
 * Represents the directive to render the axes in the Circular Gauge.
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
        childAnnotations: new ContentChild(AnnotationsDirective),
        childRanges: new ContentChild(RangesDirective),
        childPointers: new ContentChild(PointersDirective)
    }
})
export class AxisDirective extends ComplexBase<AxisDirective> {
    public directivePropList: any;
	
    public declare childAnnotations: any;
    public declare childRanges: any;
    public declare childPointers: any;
    public tags: string[] = ['annotations', 'ranges', 'pointers'];
    /** 
     * Sets and gets the annotation elements for an axis in circular gauge.
     */
    public declare annotations: any;
    /** 
     * Sets and gets the background color of an axis. This property accepts value in hex code, rgba string as a valid CSS color string.
     * @default null
     */
    public declare background: any;
    /** 
     * Sets and gets the direction of an axis.
     * @default ClockWise
     */
    public declare direction: any;
    /** 
     * Sets and gets the end angle of an axis in circular gauge.
     * @default 160
     */
    public declare endAngle: any;
    /** 
     * Enables and disables the intersecting labels to be hidden in axis.
     * @default false
     */
    public declare hideIntersectingLabel: any;
    /** 
     * Sets and gets the style of the axis label in circular gauge.
     */
    public declare labelStyle: any;
    /** 
     * Sets and gets the style of the line in axis of circular gauge.
     */
    public declare lineStyle: any;
    /** 
     * Sets and gets the major tick lines of an axis in circular gauge.
     * @default { width: 2, height: 10 }
     */
    public declare majorTicks: any;
    /** 
     * Sets and gets the maximum value of an axis in the circular gauge.
     * @aspdefaultvalueignore 
     * @default null
     */
    public declare maximum: any;
    /** 
     * Sets and gets the minimum value of an axis in the circular gauge.
     * @aspdefaultvalueignore 
     * @default null
     */
    public declare minimum: any;
    /** 
     * Sets and gets the minor tick lines of an axis in circular gauge.
     * @default { width: 2, height: 5 }
     */
    public declare minorTicks: any;
    /** 
     * Sets and gets the pointers of an axis in circular gauge.
     */
    public declare pointers: any;
    /** 
     * Sets and gets the radius of an axis in circular gauge.
     * @default null
     */
    public declare radius: any;
    /** 
     * Sets and gets the gap between the ranges by specified value in circular gauge.
     * @default null
     */
    public declare rangeGap: any;
    /** 
     * Sets and gets the ranges of an axis in circular gauge.
     */
    public declare ranges: any;
    /** 
     * Sets and gets the rounding off value in the an axis label.
     * @default null
     */
    public declare roundingPlaces: any;
    /** 
     * Enables and disables the last label of axis when it is hidden in circular gauge.
     * @default false
     */
    public declare showLastLabel: any;
    /** 
     * Enables and disables the start and end gap between the ranges and axis in circular gauge.
     * @default false
     */
    public declare startAndEndRangeGap: any;
    /** 
     * Sets and gets the start angle of an axis in circular gauge.
     * @default 200
     */
    public declare startAngle: any;

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
    selector: 'ej-circulargauge>e-axes',
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