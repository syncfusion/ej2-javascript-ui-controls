import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { StockChartTrendlinesDirective } from './trendlines.directive';

let input: string[] = ['animation', 'bearFillColor', 'border', 'bullFillColor', 'cardinalSplineTension', 'close', 'columnSpacing', 'columnWidth', 'cornerRadius', 'dashArray', 'dataSource', 'emptyPointSettings', 'enableSolidCandles', 'enableTooltip', 'fill', 'high', 'labelSettings', 'lastValueLabel', 'legendImageUrl', 'legendShape', 'linearGradient', 'low', 'marker', 'name', 'opacity', 'open', 'pointColorMapping', 'query', 'radialGradient', 'selectionStyle', 'showNearestTooltip', 'tooltipMappingName', 'trendlines', 'type', 'visible', 'volume', 'width', 'xAxisName', 'xName', 'yAxisName', 'yName'];
let outputs: string[] = [];
/**
 * Series Directive
 * ```html
 * <e-stockchart-series-collection>
 * <e-stockchart-series></e-stockchart-series>
 * </e-stockchart-series-collection>
 * ```
 */
@Directive({
    selector: 'e-stockchart-series-collection>e-stockchart-series',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childTrendlines: new ContentChild(StockChartTrendlinesDirective)
    }
})
export class StockChartSeriesDirective extends ComplexBase<StockChartSeriesDirective> {
    public directivePropList: any;
	
    public declare childTrendlines: any;
    public tags: string[] = ['trendlines'];
    /** 
     * The type of the series are 
     * * Line 
     * * Column 
     * * Area 
     * * Spline 
     * * Hilo 
     * * HiloOpenClose 
     * * Candle
     * @default 'Candle'
     */
    public declare type: any;
    /** 
     * Options to customizing animation for the series.
     */
    public declare animation: any;
    /** 
     * This property is used in stock charts to visualize the price movements in stock. 
     * It defines the color of the candle/point, when the opening price is less than the closing price.
     * @default '#2ecd71'
     */
    public declare bearFillColor: any;
    /** 
     * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
     */
    public declare border: any;
    /** 
     * This property is used in financial charts to visualize the price movements in stock. 
     * It defines the color of the candle/point, when the opening price is higher than the closing price.
     * @default '#e74c3d'
     */
    public declare bullFillColor: any;
    /** 
     * It defines tension of cardinal spline types.
     * @default 0.5
     */
    public declare cardinalSplineTension: any;
    /** 
     * The DataSource field that contains the close value of y 
     * It is applicable for series and technical indicators
     * @default ''
     */
    public declare close: any;
    /** 
     * To render the column series points with particular column spacing. It takes value from 0 - 1.
     * @default 0
     */
    public declare columnSpacing: any;
    /** 
     * To render the column series points with particular column width. If the series type is histogram the 
     * default value is 1 otherwise 0.7.
     * @default null
     * @aspdefaultvalueignore 
     */
    public declare columnWidth: any;
    /** 
     * To render the column series points with particular rounded corner.
     */
    public declare cornerRadius: any;
    /** 
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
     * @default '0'
     */
    public declare dashArray: any;
    /** 
     * Specifies the DataSource for the series. It can be an array of JSON objects or an instance of DataManager.
     * @default ''
     */
    public declare dataSource: any;
    /** 
     * options to customize the empty points in series.
     */
    public declare emptyPointSettings: any;
    /** 
     * This property is applicable for candle series. 
     * It enables/disables to visually compare the current values with the previous values in stock.
     * @default false
     */
    public declare enableSolidCandles: any;
    /** 
     * If set true, the Tooltip for series will be visible.
     * @default true
     */
    public declare enableTooltip: any;
    /** 
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string. 
     * It also represents the color of the signal lines in technical indicators. 
     * For technical indicators, the default value is 'blue' and for series, it has null.
     * @default null
     */
    public declare fill: any;
    /** 
     * The DataSource field that contains the high value of y 
     * It is applicable for series and technical indicators
     * @default ''
     */
    public declare high: any;
    /** 
     * Configures the options for displaying series names as inline labels in the stock chart.
     */
    public declare labelSettings: any;
    /** 
     * Options for customizing and displaying the last value in the series.
     */
    public declare lastValueLabel: any;
    /** 
     * The URL for the Image that is to be displayed as a Legend icon.  It requires  `legendShape` value to be an `Image`.
     * @default ''
     */
    public declare legendImageUrl: any;
    /** 
     * The shape of the legend. Each series has its own legend shape. They are 
     * * Circle - Renders a circle. 
     * * Rectangle - Renders a rectangle. 
     * * Triangle - Renders a triangle. 
     * * Diamond - Renders a diamond. 
     * * Cross - Renders a cross. 
     * * HorizontalLine - Renders a horizontalLine. 
     * * VerticalLine - Renders a verticalLine. 
     * * Pentagon - Renders a pentagon. 
     * * InvertedTriangle - Renders a invertedTriangle. 
     * * SeriesType -Render a legend shape based on series type. 
     * * Image -Render a image.     *
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
     * The DataSource field that contains the low value of y 
     * It is applicable for series and technical indicators
     * @default ''
     */
    public declare low: any;
    /** 
     * Options for displaying and customizing markers for individual points in a series.
     */
    public declare marker: any;
    /** 
     * The name of the series visible in legend.
     * @default ''
     */
    public declare name: any;
    /** 
     * The opacity of the series.
     * @default 1
     */
    public declare opacity: any;
    /** 
     * The DataSource field that contains the open value of y 
     * It is applicable for series and technical indicators
     * @default ''
     */
    public declare open: any;
    /** 
     * The DataSource field that contains the color value of point 
     * It is applicable for series
     * @default ''
     */
    public declare pointColorMapping: any;
    /** 
     * Specifies query to select data from DataSource. This property is applicable only when the DataSource is `ej.DataManager`.
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
     * Custom style for the selected series or points.
     * @default null
     */
    public declare selectionStyle: any;
    /** 
     * Enables or disables the display of tooltips for the nearest data point to the cursor for series.
     * @default true
     */
    public declare showNearestTooltip: any;
    /** 
     * The provided value will be considered as a Tooltip name
     * @default ''
     */
    public declare tooltipMappingName: any;
    /** 
     * Defines the collection of trendlines that are used to predict the trend
     */
    public declare trendlines: any;
    /** 
     * Specifies the visibility of series.
     * @default true
     */
    public declare visible: any;
    /** 
     * Defines the data source field that contains the volume value in candle charts 
     * It is applicable for financial series and technical indicators
     * @default ''
     */
    public declare volume: any;
    /** 
     * The stroke width for the series that is applicable only for `Line` type series. 
     * It also represents the stroke width of the signal lines in technical indicators.
     * @default 1
     */
    public declare width: any;
    /** 
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart. 
     * It is applicable for series and technical indicators
     * @default null
     */
    public declare xAxisName: any;
    /** 
     * The DataSource field that contains the x value. 
     * It is applicable for series and technical indicators
     * @default ''
     */
    public declare xName: any;
    /** 
     * The name of the vertical axis associated with the series. It requires `axes` of the chart. 
     * It is applicable for series and technical indicators
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

/**
 * StockChartSeries Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-stockchart>e-stockchart-series-collection',
    standalone: true,
    queries: {
        children: new ContentChildren(StockChartSeriesDirective)
    },
})
export class StockChartSeriesCollectionDirective extends ArrayBase<StockChartSeriesCollectionDirective> {
    constructor() {
        super('series');
    }
}