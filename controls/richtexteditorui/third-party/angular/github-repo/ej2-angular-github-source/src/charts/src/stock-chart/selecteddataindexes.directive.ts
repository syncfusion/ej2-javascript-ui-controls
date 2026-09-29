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
    selector: 'ejs-stockchart-selectedDataIndexes>e-stockchart-selectedDataIndex',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class StockChartSelectedDataIndexDirective extends ComplexBase<StockChartSelectedDataIndexDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies index of point.
     * @default 0
     * @asptype int
     */
    public declare point: any;
    /** 
     * Specifies index of series.
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
 * StockChartSelectedDataIndex Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-stockchart>e-stockchart-selectedDataIndexes',
    standalone: true,
    queries: {
        children: new ContentChildren(StockChartSelectedDataIndexDirective)
    },
})
export class StockChartSelectedDataIndexesDirective extends ArrayBase<StockChartSelectedDataIndexesDirective> {
    constructor() {
        super('selecteddataindexes');
    }
}