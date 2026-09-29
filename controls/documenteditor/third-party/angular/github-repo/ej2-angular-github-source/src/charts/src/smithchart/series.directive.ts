import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['animationDuration', 'dataSource', 'enableAnimation', 'enableSmartLabels', 'fill', 'marker', 'name', 'opacity', 'points', 'reactance', 'resistance', 'tooltip', 'tooltipMappingName', 'visibility', 'width'];
let outputs: string[] = [];

@Directive({
    selector: 'e-seriesCollection>e-series',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class SmithchartSeriesDirective extends ComplexBase<SmithchartSeriesDirective> {
    public directivePropList: any;
	


    /** 
     * perform animation of series based on animation duration.
     * @default '2000ms'
     */
    public declare animationDuration: any;
    /** 
     * Specifies the dataSource
     * @default null
     * @isdatamanager false
     */
    public declare dataSource: any;
    /** 
     * enable or disable the animation of series.
     * @default false
     */
    public declare enableAnimation: any;
    /** 
     * avoid the overlap of dataLabels.
     * @default false
     */
    public declare enableSmartLabels: any;
    /** 
     * color for series.
     * @default null
     */
    public declare fill: any;
    /** 
     * options for customizing marker.
     */
    public declare marker: any;
    /** 
     * The name of the series visible in legend.
     * @default ''
     */
    public declare name: any;
    /** 
     * opacity for series.
     * @default 1
     */
    public declare opacity: any;
    /** 
     * points for series.
     * @default []
     */
    public declare points: any;
    /** 
     * reactance name for dataSource.
     * @default ''
     */
    public declare reactance: any;
    /** 
     * resistance name for dataSource.
     * @default ''
     */
    public declare resistance: any;
    /** 
     * options for customizing tooltip.
     */
    public declare tooltip: any;
    /** 
     * tooltip mapping name for the series.
     * @default ''
     */
    public declare tooltipMappingName: any;
    /** 
     * visibility for series.
     * @default 'visible'
     */
    public declare visibility: any;
    /** 
     * width for series.
     * @default 1
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
 * SmithchartSeries Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-smithchart>e-seriesCollection',
    standalone: true,
    queries: {
        children: new ContentChildren(SmithchartSeriesDirective)
    },
})
export class SmithchartSeriesCollectionDirective extends ArrayBase<SmithchartSeriesCollectionDirective> {
    constructor() {
        super('series');
    }
}