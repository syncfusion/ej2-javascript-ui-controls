import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['angle', 'autoAngle', 'content', 'description', 'radius', 'textStyle', 'zIndex'];
let outputs: string[] = [];
/**
 * Represents the directive to render and customize the annotations in an axis of circular gauge.
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
     * Sets and gets the angle for annotation with respect to axis in circular gauge.
     * @default 90
     */
    public declare angle: any;
    /** 
     * Enables and disables the rotation of the annotation along the axis.
     * @default false
     */
    public declare autoAngle: any;
    /** 
     * Sets and gets the information about annotation for assistive technology.
     * @default null
     */
    public declare description: any;
    /** 
     * Sets and gets the radius for annotation with respect to axis in circular gauge.
     * @default '50%'
     */
    public declare radius: any;
    /** 
     * Sets and gets the style of the text in annotation.
     */
    public declare textStyle: any;
    /** 
     * Sets and gets the z-index of an annotation in an axis in the circular gauge.
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
    selector: 'ej-circulargauge>e-axes>e-axis>e-annotations',
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