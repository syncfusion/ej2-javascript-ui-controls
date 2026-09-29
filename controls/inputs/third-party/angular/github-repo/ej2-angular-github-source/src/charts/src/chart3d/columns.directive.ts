import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['width'];
let outputs: string[] = [];
/**
 * Column3D Directive
 * ```html
 * <e-columns><e-column></e-column><e-columns>
 * ```
 */
@Directive({
    selector: 'e-chart3d-columns>e-chart3d-columns',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class Chart3DColumnDirective extends ComplexBase<Chart3DColumnDirective> {
    public directivePropList: any;
	


    /** 
     * The width of the column as a string accepts input both as like '100px' or '100%'. 
     * If specified as '100%, column renders to the full width of its chart.
     * @default '100%'
     */
    public declare width: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Chart3DColumn Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-chart3d>e-chart3d-columns',
    standalone: true,
    queries: {
        children: new ContentChildren(Chart3DColumnDirective)
    },
})
export class Chart3DColumnsDirective extends ArrayBase<Chart3DColumnsDirective> {
    constructor() {
        super('columns');
    }
}