import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['accessibility', 'animation', 'applyPattern', 'border', 'borderRadius', 'dashArray', 'dataLabel', 'dataSource', 'emptyPointSettings', 'enableTooltip', 'endAngle', 'explode', 'explodeAll', 'explodeIndex', 'explodeOffset', 'funnelMode', 'gapRatio', 'groupMode', 'groupTo', 'height', 'innerRadius', 'legendImageUrl', 'legendShape', 'linearGradient', 'name', 'neckHeight', 'neckWidth', 'opacity', 'palettes', 'pointColorMapping', 'pyramidMode', 'query', 'radialGradient', 'radius', 'selectionStyle', 'startAngle', 'tooltipMappingName', 'type', 'visible', 'width', 'xName', 'yName'];
let outputs: string[] = [];
/**
 * AccumulationSeries Directive
 * ```html
 * <e-accumulation-series-collection>
 * <e-accumulation-series></e-accumulation-series>
 * </e-accumulation-series-collection>
 * ```
 */
@Directive({
    selector: 'e-accumulation-series-collection>e-accumulation-series',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        dataLabel_template: new ContentChild('dataLabelTemplate')
    }
})
export class AccumulationSeriesDirective extends ComplexBase<AccumulationSeriesDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the type of series in the accumulation chart.
     * @default 'Pie'
     */
    public declare type: any;
    /** 
     * Options to improve accessibility for series elements.
     */
    public declare accessibility: any;
    /** 
     * Options for customizing the animation of the series. 
     * By default, animation is enabled with a duration of 1000 milliseconds (about 1 second). It can be disabled by setting enable to `false`. 
     * The following properties are supported in animation: 
     * * enable: If set to true, the series is animated on initial loading. 
     * * duration: The duration of the animation in milliseconds. 
     * * delay: The delay before the animation starts, in milliseconds.
     */
    public declare animation: any;
    /** 
     * When set to true, a different pattern is applied to each slice of the pie.
     * @default false
     */
    public declare applyPattern: any;
    /** 
     * Options for customizing the border of the series.
     */
    public declare border: any;
    /** 
     * Option for customizing the border radius.
     * @default 0
     */
    public declare borderRadius: any;
    /** 
     * Defines the pattern of dashes and gaps for the series border.
     * @default '0'
     */
    public declare dashArray: any;
    /** 
     * The data label property can be used to show the data label and customize its position and styling.
     */
    public declare dataLabel: any;
    /** 
     * Specifies the data source for the series. It can be an array of JSON objects, or an instance of DataManager. 
     * 
     * @default ''
     */
    public declare dataSource: any;
    /** 
     * Customization options for the appearance of empty points in the series, where `null` or `undefined` values are considered as empty points.
     */
    public declare emptyPointSettings: any;
    /** 
     * Controls whether the tooltip for the accumulation chart series is enabled or disabled. Set to true to display tooltips on hover, or false to hide them.
     * @default true
     */
    public declare enableTooltip: any;
    /** 
     * Specifies the ending angle for the series, in degrees.
     * @default null
     */
    public declare endAngle: any;
    /** 
     * If set to true, series points will explode on mouse click or touch.
     * @default false
     */
    public declare explode: any;
    /** 
     * If set to true, all the points in the series will explode on load.
     * @default false
     */
    public declare explodeAll: any;
    /** 
     * Index of the point in the series to be exploded on initial load.
     * @default null
     * @aspdefaultvalueignore 
     * @blazordefaultvalue Double.NaN
     */
    public declare explodeIndex: any;
    /** 
     * Specifies the distance of the point from the center, which can be defined in both pixels and percentage.
     * @default '30%'
     */
    public declare explodeOffset: any;
    /** 
     * Defines the rendering mode for the funnel chart. 
     * Available options are: 
     * * Standard - Displays a funnel shape that narrows down to a point. 
     * * Trapezoid - Displays a funnel shape with parallel sides near the top.
     * @default 'Standard'
     */
    public declare funnelMode: any;
    /** 
     * Defines the distance between the segments of a funnel or pyramid series. 
     * The range is from 0 to 1.
     * @default 0
     */
    public declare gapRatio: any;
    /** 
     * In the accumulation series, y-values less than `groupMode` are combined into a single slice named 'others'.
     * @default Value
     */
    public declare groupMode: any;
    /** 
     * The y-values of the accumulation series that are less than `groupTo` are combined into a single slice named 'others'.
     * @default null
     */
    public declare groupTo: any;
    /** 
     * Defines the height of the funnel or pyramid series relative to the chart area.
     * @default '80%'
     */
    public declare height: any;
    /** 
     * When the `innerRadius` value is greater than 0%, a donut shape will appear in the pie series. It accepts only percentage values.
     * @default '0'
     */
    public declare innerRadius: any;
    /** 
     * The URL for the image to be displayed as a legend icon. 
     * > Note that `legendShape` must be set to `Image`.
     * @default ''
     */
    public declare legendImageUrl: any;
    /** 
     * Specifies the shape of the legend icon for each data point. 
     * Available shapes for legend: 
     * * Circle - Renders a circular icon. 
     * * Rectangle - Renders a rectangular icon. 
     * * Triangle - Renders a triangular icon. 
     * * Diamond - Renders a diamond-shaped icon. 
     * * Cross - Renders a cross-shaped icon. 
     * * HorizontalLine - Renders a horizontal line icon. 
     * * VerticalLine - Renders a vertical line icon. 
     * * Pentagon - Renders a pentagon-shaped icon. 
     * * InvertedTriangle - Renders an inverted triangle-shaped icon. 
     * * SeriesType - Uses the default icon shape based on the series type. 
     * * Image - Renders a custom image for the legend icon.
     * @default 'SeriesType'
     */
    public declare legendShape: any;
    /** 
     * Applies a linear gradient fill to the series. 
     * The gradient transitions colors along a straight line. 
     * When both linearGradient and radialGradient are specified, linearGradient takes precedence.
     * @default null
     */
    public declare linearGradient: any;
    /** 
     * The `name` property allows for setting a name for the series.
     * @default ''
     */
    public declare name: any;
    /** 
     * Defines the height of the funnel neck relative to the chart area.
     * @default '20%'
     */
    public declare neckHeight: any;
    /** 
     * Defines the width of the funnel neck relative to the chart area.
     * @default '20%'
     */
    public declare neckWidth: any;
    /** 
     * Sets the opacity of the series, with a value between 0 and 1 where 0 is fully transparent and 1 is fully opaque.
     * @default 1.
     */
    public declare opacity: any;
    /** 
     * The `palettes` array defines a set of colors used for rendering the accumulation chart's points. Each color in the array is applied to each point in order.
     * @default []
     */
    public declare palettes: any;
    /** 
     * The data source field that contains the color value of a point. 
     * It is applicable for series.
     * @default ''
     */
    public declare pointColorMapping: any;
    /** 
     * Defines how the values are represented, either through the height or surface area of the segments.
     * @default 'Linear'
     */
    public declare pyramidMode: any;
    /** 
     * Specifies a query to select data from the data source. This property is applicable only when the data source is an `ej.DataManager`.
     * @default null
     */
    public declare query: any;
    /** 
     * Applies a radial gradient fill to the series. 
     * The gradient transitions colors outward from a central point.
     * @default null
     */
    public declare radialGradient: any;
    /** 
     * Specifies the radius of the pie series as a percentage of the chart's size.
     * @default null
     */
    public declare radius: any;
    /** 
     * The `selectionStyle` property is used to specify custom CSS styles for the selected series or points.
     * @default null
     */
    public declare selectionStyle: any;
    /** 
     * Specifies the starting angle for the series, in degrees.
     * @default 0
     */
    public declare startAngle: any;
    /** 
     * The data source field that contains the value to be displayed in the tooltip.
     * @default ''
     */
    public declare tooltipMappingName: any;
    /** 
     * If set to true, the series will be visible. If set to false, the series will be hidden.
     * @default true
     */
    public declare visible: any;
    /** 
     * Defines the width of the funnel or pyramid series relative to the chart area.
     * @default '80%'
     */
    public declare width: any;
    /** 
     * The data source field that contains the x value.
     * @default ''
     */
    public declare xName: any;
    /** 
     * The data source field that contains the y value.
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
Template()(AccumulationSeriesDirective.prototype, 'dataLabel_template');

/**
 * AccumulationSeries Array Directive
 * @private
 */
@Directive({
    selector: 'ej-accumulationchart>e-accumulation-series-collection',
    standalone: true,
    queries: {
        children: new ContentChildren(AccumulationSeriesDirective)
    },
})
export class AccumulationSeriesCollectionDirective extends ArrayBase<AccumulationSeriesCollectionDirective> {
    constructor() {
        super('series');
    }
}