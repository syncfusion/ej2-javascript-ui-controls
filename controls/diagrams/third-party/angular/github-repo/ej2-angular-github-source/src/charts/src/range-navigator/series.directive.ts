import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['animation', 'border', 'dashArray', 'dataSource', 'fill', 'opacity', 'query', 'type', 'width', 'xName', 'yName'];
let outputs: string[] = [];
/**
 * RangenavigatorSeries Directive
 * ```html
 * <e-rangenavigator-series-collection>
 * <e-rangenavigator-series></e-rangenavigator-series>
 * </e-rangenavigator-series-collection>
 * ```
 */
@Directive({
    selector: 'e-rangenavigator-series-collection>e-rangenavigator-series',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class RangenavigatorSeriesDirective extends ComplexBase<RangenavigatorSeriesDirective> {
    public directivePropList: any;
	


    /** 
     * It defines the series type of the range navigator.
     * @default 'Line'
     */
    public declare type: any;
    /** 
     * Options to customizing animation for the series.
     */
    public declare animation: any;
    /** 
     * Options for customizing the color and width of the series border.
     */
    public declare border: any;
    /** 
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
     * @default '0'
     */
    public declare dashArray: any;
    /** 
     * It defines the data source for a series.
     * @default null
     */
    public declare dataSource: any;
    /** 
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string. 
     * It also represents the color of the signal lines in technical indicators. 
     * For technical indicators, the default value is 'blue' and for series, it has null.
     * @default null
     */
    public declare fill: any;
    /** 
     * The opacity for the background.
     * @default 1
     */
    public declare opacity: any;
    /** 
     * It defines the query for the data source.
     * @default null
     */
    public declare query: any;
    /** 
     * The stroke width for the series that is applicable only for `Line` type series. 
     * It also represents the stroke width of the signal lines in technical indicators.
     * @default 1
     */
    public declare width: any;
    /** 
     * It defines the xName for the series.
     * @default null
     */
    public declare xName: any;
    /** 
     * It defines the yName for the series.
     * @default null
     */
    public declare yName: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * RangenavigatorSeries Array Directive
 * @private
 */
@Directive({
    selector: 'ej-rangenavigator>e-rangenavigator-series-collection',
    standalone: true,
    queries: {
        children: new ContentChildren(RangenavigatorSeriesDirective)
    },
})
export class RangenavigatorSeriesCollectionDirective extends ArrayBase<RangenavigatorSeriesCollectionDirective> {
    constructor() {
        super('series');
    }
}