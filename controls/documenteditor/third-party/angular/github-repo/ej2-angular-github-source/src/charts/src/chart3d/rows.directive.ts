import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['height'];
let outputs: string[] = [];
/**
 * Row3D Directive
 * ```html
 * <e-rows><e-row></e-row><e-rows>
 * ```
 */
@Directive({
    selector: 'e-chart3d-rows>e-chart3d-row',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class Chart3DRowDirective extends ComplexBase<Chart3DRowDirective> {
    public directivePropList: any;
	


    /** 
     * The height of the row as a string accept input both as '100px' and '100%'. 
     * If specified as '100%, row renders to the full height of its chart.
     * @default '100%'
     */
    public declare height: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Chart3DRow Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-chart3d>e-chart3d-rows',
    standalone: true,
    queries: {
        children: new ContentChildren(Chart3DRowDirective)
    },
})
export class Chart3DRowsDirective extends ArrayBase<Chart3DRowsDirective> {
    constructor() {
        super('rows');
    }
}