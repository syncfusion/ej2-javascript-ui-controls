import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['border', 'height'];
let outputs: string[] = [];
/**
 * Row Directive
 * ```html
 * <e-rows><e-row></e-row><e-rows>
 * ```
 */
@Directive({
    selector: 'e-stockchart-rows>e-striplines>e-stockchart-row',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class StockChartRowDirective extends ComplexBase<StockChartRowDirective> {
    public directivePropList: any;
	


    /** 
     * Options to customize the border of the rows.
     */
    public declare border: any;
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
 * StockChartRow Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-stockchart>e-stockchart-rows',
    standalone: true,
    queries: {
        children: new ContentChildren(StockChartRowDirective)
    },
})
export class StockChartRowsDirective extends ArrayBase<StockChartRowsDirective> {
    constructor() {
        super('rows');
    }
}