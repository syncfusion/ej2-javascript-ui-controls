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
    selector: 'e-selecteddataindexes>e-selecteddataindex',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class SelectedDataIndexDirective extends ComplexBase<SelectedDataIndexDirective> {
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
 * SelectedDataIndex Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-chart>e-selecteddataindexes',
    standalone: true,
    queries: {
        children: new ContentChildren(SelectedDataIndexDirective)
    },
})
export class SelectedDataIndexesDirective extends ArrayBase<SelectedDataIndexesDirective> {
    constructor() {
        super('selecteddataindexes');
    }
}