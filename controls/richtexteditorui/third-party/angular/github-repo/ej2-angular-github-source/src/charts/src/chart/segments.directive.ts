import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['color', 'dashArray', 'value'];
let outputs: string[] = [];
/**
 * Series Directive
 * ```html
 * <e-series-collection>
 * <e-series>
 * <e-segments>
 * <e-segment>
 * </e-segment>
 * </e-segments>
 * </e-series-collection>
 * ```
 */
@Directive({
    selector: 'e-series>e-segments>e-segment',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class SegmentDirective extends ComplexBase<SegmentDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the fill color for the region using a color name, hex code, or rgba value.
     * @default null
     */
    public declare color: any;
    /** 
     * Specifies the dash pattern for the stroke of the series. The string format allows defining various dash and gap lengths.
     * @default '0'
     */
    public declare dashArray: any;
    /** 
     * Defines the starting point of region.
     * @default null
     */
    public declare value: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Segment Array Directive
 * @private
 */
@Directive({
    selector: 'e-series>e-segments',
    standalone: true,
    queries: {
        children: new ContentChildren(SegmentDirective)
    },
})
export class SegmentsDirective extends ArrayBase<SegmentsDirective> {
    constructor() {
        super('segments');
    }
}