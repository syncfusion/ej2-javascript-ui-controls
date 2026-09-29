import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['point', 'series'];
let outputs: string[] = [];
/**
 * Selected Data Directive
 * ```html
 * <e-selecteddataindexes><e-selecteddataindex></e-selecteddataindex><e-selecteddataindexes>
 * ```
 */
@Directive({
    selector: 'e-chart3d-selecteddataindexes>e-chart3d-selecteddataindex',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class Chart3DSelectedDataIndexDirective extends ComplexBase<Chart3DSelectedDataIndexDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the index of the data point within the series.
     * @default 0
     * @asptype int
     */
    public declare point: any;
    /** 
     * Specifies the index of the series.
     * @default 0
     * @asptype int
     */
    public declare series: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Chart3DSelectedDataIndex Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-chart3d>e-chart3d-selecteddataindexes',
    standalone: true,
    queries: {
        children: new ContentChildren(Chart3DSelectedDataIndexDirective)
    },
})
export class Chart3DSelectedDataIndexesDirective extends ArrayBase<Chart3DSelectedDataIndexesDirective> {
    constructor() {
        super('selecteddataindexes');
    }
}