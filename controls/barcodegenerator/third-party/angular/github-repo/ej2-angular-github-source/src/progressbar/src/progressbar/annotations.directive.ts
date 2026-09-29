import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['annotationAngle', 'annotationRadius', 'content'];
let outputs: string[] = [];
/**
 * ProgressBarAnnotations Directive
 * ```html
 * <e-progressbar-annotations>
 * <e-progressbar-annotation></e-progressbar-annotation>
 * </e-progressbar-annotations>
 * ```
 */
@Directive({
    selector: 'e-progressbar-annotations>e-progressbar-annotation',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        content: new ContentChild('content')
    }
})
export class ProgressBarAnnotationDirective extends ComplexBase<ProgressBarAnnotationDirective> {
    public directivePropList: any;
	


    /** 
     * to move annotation
     * @default 0
     */
    public declare annotationAngle: any;
    /** 
     * to move annotation
     * @default '0%'
     */
    public declare annotationRadius: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(ProgressBarAnnotationDirective.prototype, 'content');

/**
 * ProgressBarAnnotation Array Directive
 * @private
 */
@Directive({
    selector: 'ej-progressbar>e-progressbar-annotations',
    standalone: true,
    queries: {
        children: new ContentChildren(ProgressBarAnnotationDirective)
    },
})
export class ProgressBarAnnotationsDirective extends ArrayBase<ProgressBarAnnotationsDirective> {
    constructor() {
        super('annotations');
    }
}