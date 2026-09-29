import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['animation', 'columnFacet', 'columnSpacing', 'columnWidth', 'dataLabel', 'dataSource', 'emptyPointSettings', 'enableTooltip', 'fill', 'groupName', 'legendImageUrl', 'legendShape', 'name', 'opacity', 'pointColorMapping', 'query', 'size', 'stackingGroup', 'tooltipFormat', 'tooltipMappingName', 'type', 'visible', 'xAxisName', 'xName', 'yAxisName', 'yName'];
let outputs: string[] = [];
/**
 * Series3D Directive
 * ```html
 * <e-chart3d-series-collection>
 * <e-chart3d-series></e-chart3d-series>
 * </e-chart3d-series-collection>
 * ```
 */
@Directive({
    selector: 'e-chart3d-series-collection>e-chart3d-series',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        dataLabel_template: new ContentChild('dataLabelTemplate')
    }
})
export class Chart3DSeriesDirective extends ComplexBase<Chart3DSeriesDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the type of the series in the 3D chart. Available options include: 
     * - Column 
     * - Bar 
     * - StackingColumn 
     * - StackingBar 
     * - StackingColumn100 
     * - StackingBar100
     * @default 'Column'
     */
    public declare type: any;
    /** 
     * Options to customizing animation for the series.
     */
    public declare animation: any;
    /** 
     * Defines the shape of the data in a column and bar chart. 
     * Rectangle: Displays the data in a column and bar chart in a rectangle shape. 
     * Cylinder: Displays the data in a column and bar chart in a cylinder shape.
     * @default 'Rectangle'
     */
    public declare columnFacet: any;
    /** 
     * To render the column series points with particular column spacing. It takes value from 0 - 1.
     * @default 0.1
     */
    public declare columnSpacing: any;
    /** 
     * Render the column series points with a particular column width.
     * @default null
     */
    public declare columnWidth: any;
    /** 
     * The data label for the series.
     */
    public declare dataLabel: any;
    /** 
     * Specifies the data source for the series. It can be an array of JSON objects or an instance of DataManager.
     * @default ''
     */
    public declare dataSource: any;
    /** 
     * options to customize the empty points in series.
     */
    public declare emptyPointSettings: any;
    /** 
     * Enable tooltip for the chart series.
     * @default true
     */
    public declare enableTooltip: any;
    /** 
     * The fill color for the series, which can accept values in hex or rgba as a valid CSS color string.
     * @default null
     */
    public declare fill: any;
    /** 
     * Defines the name that specifies the chart series are mutually exclusive and can be overlaid. 
     * The axis in the same group shares the same baseline and location on the corresponding axis.
     * @default ''
     */
    public declare groupName: any;
    /** 
     * The URL for the Image that is to be displayed as a Legend icon.  It requires  `legendShape` value to be an `Image`.
     * @default ''
     */
    public declare legendImageUrl: any;
    /** 
     * The shape of the legend. Each series has its own legend shape, which can be one of the following: 
     * * Circle 
     * * Rectangle 
     * * Triangle 
     * * Diamond 
     * * Cross 
     * * HorizontalLine 
     * * VerticalLine 
     * * Pentagon 
     * * InvertedTriangle 
     * * SeriesType 
     * * Image
     * @default 'SeriesType'
     */
    public declare legendShape: any;
    /** 
     * The name of the series as displayed in the legend.
     * @default ''
     */
    public declare name: any;
    /** 
     * The opacity of the series.
     * @default 1
     */
    public declare opacity: any;
    /** 
     * The DataSource field that contains the point colors.
     * @default ''
     */
    public declare pointColorMapping: any;
    /** 
     * Specifies a query to select data from the DataSource. This property is applicable only when the DataSource is an `ej.DataManager`.
     * @default ''
     */
    public declare query: any;
    /** 
     * The DataSource field that contains the size value of y
     * @default ''
     */
    public declare size: any;
    /** 
     * This property allows grouping series in `stacked column / bar` charts. 
     * Any string value can be provided to the stackingGroup property. 
     * If any two or above series have the same value, those series will be grouped together.
     * @default ''
     */
    public declare stackingGroup: any;
    /** 
     * Format of the tooltip content.
     * @default ''
     */
    public declare tooltipFormat: any;
    /** 
     * The data source field that contains the tooltip value.
     * @default ''
     */
    public declare tooltipMappingName: any;
    /** 
     * Specifies the visibility of series.
     * @default true
     */
    public declare visible: any;
    /** 
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     * @default null
     */
    public declare xAxisName: any;
    /** 
     * The DataSource field that contains the x value.
     * @default ''
     */
    public declare xName: any;
    /** 
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * @default null
     */
    public declare yAxisName: any;
    /** 
     * The DataSource field that contains the y value.
     * @default ''
     */
    public declare yName: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(Chart3DSeriesDirective.prototype, 'dataLabel_template');

/**
 * Chart3DSeries Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-chart3d>e-chart3d-series-collection',
    standalone: true,
    queries: {
        children: new ContentChildren(Chart3DSeriesDirective)
    },
})
export class Chart3DSeriesCollectionDirective extends ArrayBase<Chart3DSeriesCollectionDirective> {
    constructor() {
        super('series');
    }
}