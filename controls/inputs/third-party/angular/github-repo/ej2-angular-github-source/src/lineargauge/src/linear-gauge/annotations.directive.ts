import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['axisIndex', 'axisValue', 'content', 'font', 'horizontalAlignment', 'verticalAlignment', 'x', 'y', 'zIndex'];
let outputs: string[] = [];
/**
 * Represents the directive to render and customize the annotations in the linear gauge.
 * ```html
 * <e-annotations><e-annotation></e-annotation></e-annotations>
 * ```
 */
@Directive({
    selector: 'e-annotations>e-annotation',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        content: new ContentChild('content')
    }
})
export class AnnotationDirective extends ComplexBase<AnnotationDirective> {
    public directivePropList: any;
	


    /** 
     * Sets and gets the axis index which places the annotation in the specified axis in the linear gauge.
     * @aspdefaultvalueignore 
     * @default null
     */
    public declare axisIndex: any;
    /** 
     * Sets and gets the value of axis which places the annotation near the specified axis value.
     * @aspdefaultvalueignore 
     * @default null
     */
    public declare axisValue: any;
    /** 
     * Sets and gets the options to customize the font of the annotation in linear gauge.
     */
    public declare font: any;
    /** 
     * Sets and gets the horizontal alignment of annotation.
     * @default None
     */
    public declare horizontalAlignment: any;
    /** 
     * Sets and gets the vertical alignment of annotation.
     * @default None
     */
    public declare verticalAlignment: any;
    /** 
     * Sets and gets the x position for the annotation in linear gauge.
     * @default 0
     */
    public declare x: any;
    /** 
     * Sets and gets the y position for the annotation in linear gauge.
     * @default 0
     */
    public declare y: any;
    /** 
     * Sets and gets the z-index of the annotation.
     * @default '-1'
     */
    public declare zIndex: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(AnnotationDirective.prototype, 'content');

/**
 * Annotation Array Directive
 * @private
 */
@Directive({
    selector: 'ej-linear-gauge>e-annotations',
    standalone: true,
    queries: {
        children: new ContentChildren(AnnotationDirective)
    },
})
export class AnnotationsDirective extends ArrayBase<AnnotationsDirective> {
    constructor() {
        super('annotations');
    }
}