import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['color', 'end', 'index', 'legendImageUrl', 'name', 'opacity', 'shape'];
let outputs: string[] = [];
/**
 * BulletRange Directive
 * ```html
 * <e-bullet-range-collection>
 * <e-bullet-range></e-bullet-range>
 * </e-bullet-range-collection>
 * ```
 */
@Directive({
    selector: 'e-bullet-range-collection>e-bullet-range',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class BulletRangeDirective extends ComplexBase<BulletRangeDirective> {
    public directivePropList: any;
	


    /** 
     * Default value for qualitative range Color.
     * @default null
     */
    public declare color: any;
    /** 
     * Default value for qualitative range end value.
     * @default null
     */
    public declare end: any;
    /** 
     * Default value for qualitative range Color.
     * @default null
     */
    public declare index: any;
    /** 
     * The URL for the Image that is to be displayed as a Legend icon.  It requires  `legendShape` value to be an `Image`.
     * @default ''
     */
    public declare legendImageUrl: any;
    /** 
     * Default value for qualitative range name.
     * @default null
     */
    public declare name: any;
    /** 
     * Range opacity
     * @default 1
     */
    public declare opacity: any;
    /** 
     * The shape of the legend. Each ranges has its own legend shape. They are, 
     * * Circle 
     * * Rectangle 
     * * Triangle 
     * * Diamond 
     * * Cross 
     * * HorizontalLine 
     * * VerticalLine 
     * * Pentagon 
     * * InvertedTriangle 
     * * SeriesType 
     * * Image
     * @default 'Rectangle'
     */
    public declare shape: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * BulletRange Array Directive
 * @private
 */
@Directive({
    selector: 'ej-bulletchart>e-bullet-range-collection',
    standalone: true,
    queries: {
        children: new ContentChildren(BulletRangeDirective)
    },
})
export class BulletRangeCollectionDirective extends ArrayBase<BulletRangeCollectionDirective> {
    constructor() {
        super('ranges');
    }
}