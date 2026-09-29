import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['dataLabelSettings', 'height', 'id', 'isSeriesInRows', 'legendSettings', 'markerSettings', 'primaryXAxis', 'primaryYAxis', 'range', 'theme', 'title', 'type', 'width'];
let outputs: string[] = [];

@Directive({
    selector: 'e-charts>e-chart',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ChartDirective extends ComplexBase<ChartDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the type of a chart.
     * @default 'Line'
     */
    public declare type: any;
    /** 
     * The data label for the series.
     * @default {}
     */
    public declare dataLabelSettings: any;
    /** 
     * Specifies the height of the chart.
     * @default 290
     */
    public declare height: any;
    /** 
     * Specifies chart element id.
     * @default ''
     */
    public declare id: any;
    /** 
     * Specifies to switch the row or a column.
     * @default false
     */
    public declare isSeriesInRows: any;
    /** 
     * Options for customizing the legend of the chart.
     * @default {}
     */
    public declare legendSettings: any;
    /** 
     * Options to configure the marker
     * @default {}
     */
    public declare markerSettings: any;
    /** 
     * Options to configure the horizontal axis.
     * @default {}
     */
    public declare primaryXAxis: any;
    /** 
     * Options to configure the vertical axis.
     * @default {}
     */
    public declare primaryYAxis: any;
    /** 
     * Specifies the selected range or specified range.
     * @default ''
     */
    public declare range: any;
    /** 
     * Specifies the theme of a chart.
     * @default 'Material'
     */
    public declare theme: any;
    /** 
     * Title of the chart
     * @default ''
     */
    public declare title: any;
    /** 
     * Specifies the width of the chart.
     * @default 480
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
 * Chart Array Directive
 * @private
 */
@Directive({
    selector: 'e-cell>e-charts',
    standalone: true,
    queries: {
        children: new ContentChildren(ChartDirective)
    },
})
export class ChartsDirective extends ArrayBase<ChartsDirective> {
    constructor() {
        super('chart');
    }
}