import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['coefficient', 'crossesAt', 'crossesInAxis', 'crosshairTooltip', 'description', 'desiredIntervals', 'edgeLabelPlacement', 'enableAutoIntervalOnZooming', 'enableTrim', 'interval', 'intervalType', 'isInversed', 'labelFormat', 'labelIntersectAction', 'labelPlacement', 'labelPosition', 'labelRotation', 'labelStyle', 'lineStyle', 'logBase', 'majorGridLines', 'majorTickLines', 'maximum', 'maximumLabelWidth', 'maximumLabels', 'minimum', 'minorGridLines', 'minorTickLines', 'minorTicksPerInterval', 'name', 'opposedPosition', 'placeNextToAxisLine', 'plotOffset', 'rangePadding', 'rowIndex', 'skeleton', 'skeletonType', 'span', 'startAngle', 'stripLines', 'tabIndex', 'tickPosition', 'title', 'titleStyle', 'valueType', 'visible', 'zoomFactor', 'zoomPosition'];
let outputs: string[] = [];
/**
 * Axis Directive
 * ```html
 * <e-stockchart-axes><e-stockchart-axis></e-stockchart-axis></e-stockchart-axes>
 * ```
 */
@Directive({
    selector: 'e-stockchart-axes>e-stockchart-axis',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class StockChartAxisDirective extends ComplexBase<StockChartAxisDirective> {
    public directivePropList: any;
	


    /** 
     * The polar radar radius position.
     * @default 100
     */
    public declare coefficient: any;
    /** 
     * Specifies the value at which the axis line has to be intersect with the vertical axis or vice versa.
     * @default null
     */
    public declare crossesAt: any;
    /** 
     * Specifies axis name with which the axis line has to be crossed.
     * @default null
     */
    public declare crossesInAxis: any;
    /** 
     * Options to customize the crosshair ToolTip.
     */
    public declare crosshairTooltip: any;
    /** 
     * Description for axis and its element.
     * @default null
     */
    public declare description: any;
    /** 
     * With this property, you can request axis to calculate intervals approximately equal to your specified interval.
     * @default null
     * @aspdefaultvalueignore 
     */
    public declare desiredIntervals: any;
    /** 
     * Specifies the position of labels at the edge of the axis.They are, 
     * * None: No action will be performed. 
     * * Hide: Edge label will be hidden. 
     * * Shift: Shifts the edge labels.
     * @default 'None'
     */
    public declare edgeLabelPlacement: any;
    /** 
     * If set to true, axis interval will be calculated automatically with respect to the zoomed range.
     * @default true
     */
    public declare enableAutoIntervalOnZooming: any;
    /** 
     * Specifies the Trim property for an axis.
     * @default false
     */
    public declare enableTrim: any;
    /** 
     * Specifies the interval for an axis.
     * @default null
     * @aspdefaultvalueignore 
     */
    public declare interval: any;
    /** 
     * Specifies the types like `Years`, `Months`, `Days`, `Hours`, `Minutes`, `Seconds` in date time axis.They are, 
     * * Auto: Defines the interval of the axis based on data. 
     * * Years: Defines the interval of the axis in years. 
     * * Months: Defines the interval of the axis in months. 
     * * Days: Defines the interval of the axis in days. 
     * * Hours: Defines the interval of the axis in hours. 
     * * Minutes: Defines the interval of the axis in minutes.
     * @default 'Auto'
     */
    public declare intervalType: any;
    /** 
     * It specifies whether the axis to be rendered in inversed manner or not.
     * @default false
     */
    public declare isInversed: any;
    /** 
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc. 
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */
    public declare labelFormat: any;
    /** 
     * Specifies the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are, 
     * * None: Shows all the labels. 
     * * Hide: Hides the label when it intersects. 
     * * Rotate45: Rotates the label to 45 degree when it intersects. 
     * * Rotate90: Rotates the label to 90 degree when it intersects.
     * @default Hide
     */
    public declare labelIntersectAction: any;
    /** 
     * Specifies the placement of a label for category axis. They are, 
     * * betweenTicks: Renders the label between the ticks. 
     * * onTicks: Renders the label on the ticks.
     * @default 'BetweenTicks'
     */
    public declare labelPlacement: any;
    /** 
     * Specifies the placement of a labels to the axis line. They are, 
     * * inside: Renders the labels inside to the axis line. 
     * * outside: Renders the labels outside to the axis line.
     * @default 'Outside'
     */
    public declare labelPosition: any;
    /** 
     * The angle to which the axis label gets rotated.
     * @default 0
     */
    public declare labelRotation: any;
    /** 
     * Options to customize the axis label.
     */
    public declare labelStyle: any;
    /** 
     * Options for customizing axis lines.
     */
    public declare lineStyle: any;
    /** 
     * The base value for logarithmic axis. It requires `valueType` to be `Logarithmic`.
     * @default 10
     */
    public declare logBase: any;
    /** 
     * Options for customizing major grid lines.
     */
    public declare majorGridLines: any;
    /** 
     * Options for customizing major tick lines.
     */
    public declare majorTickLines: any;
    /** 
     * Specifies the maximum range of an axis.
     * @default null
     */
    public declare maximum: any;
    /** 
     * Specifies the maximum width of an axis label.
     * @default 34.
     */
    public declare maximumLabelWidth: any;
    /** 
     * The maximum number of label count per 100 pixels with respect to the axis length.
     * @default 3
     */
    public declare maximumLabels: any;
    /** 
     * Specifies the minimum range of an axis.
     * @default null
     */
    public declare minimum: any;
    /** 
     * Options for customizing minor grid lines.
     */
    public declare minorGridLines: any;
    /** 
     * Options for customizing minor tick lines.
     */
    public declare minorTickLines: any;
    /** 
     * Specifies the number of minor ticks per interval.
     * @default 0
     */
    public declare minorTicksPerInterval: any;
    /** 
     * Unique identifier of an axis. 
     * To associate an axis with the series, set this name to the xAxisName/yAxisName properties of the series.
     * @default ''
     */
    public declare name: any;
    /** 
     * If set to true, the axis will render at the opposite side of its default position.
     * @default false
     */
    public declare opposedPosition: any;
    /** 
     * Specifies whether axis elements like axis labels, axis title, etc has to be crossed with axis line.
     * @default true
     */
    public declare placeNextToAxisLine: any;
    /** 
     * Left and right padding for the plot area in pixels.
     * @default 0
     */
    public declare plotOffset: any;
    /** 
     * Specifies the padding for the axis range in terms of interval.They are, 
     * * none: Padding cannot be applied to the axis. 
     * * normal: Padding is applied to the axis based on the range calculation. 
     * * additional: Interval of the axis is added as padding to the minimum and maximum values of the range. 
     * * round: Axis range is rounded to the nearest possible value divided by the interval.
     * @default 'Auto'
     */
    public declare rangePadding: any;
    /** 
     * Specifies the index of the row where the axis is associated, when the chart area is divided into multiple plot areas by using `rows`. 
     * 
     * @default 0
     */
    public declare rowIndex: any;
    /** 
     * Specifies the skeleton format in which the dateTime format will process.
     * @default ''
     */
    public declare skeleton: any;
    /** 
     * It specifies the type of format to be used in dateTime format process.
     * @default 'DateTime'
     */
    public declare skeletonType: any;
    /** 
     * Specifies the number of `columns` or `rows` an axis has to span horizontally or vertically.
     * @default 1
     */
    public declare span: any;
    /** 
     * The start angle for the series.
     * @default 0
     */
    public declare startAngle: any;
    /** 
     * Specifies the stripLine collection for the axis.
     */
    public declare stripLines: any;
    /** 
     * TabIndex value for the axis.
     * @default 2
     */
    public declare tabIndex: any;
    /** 
     * Specifies the placement of a ticks to the axis line. They are, 
     * * inside: Renders the ticks inside to the axis line. 
     * * outside: Renders the ticks outside to the axis line.
     * @default 'Outside'
     */
    public declare tickPosition: any;
    /** 
     * Specifies the title of an axis.
     * @default ''
     */
    public declare title: any;
    /** 
     * Options for customizing the axis title.
     */
    public declare titleStyle: any;
    /** 
     * Specifies the data types that the axis can handle: 
     * * Double: This type is used for rendering a numeric axis to accommodate numeric data. 
     * * DateTime: This type is utilized for rendering a date-time axis to manage date-time data. 
     * * Category: This type is employed for rendering a category axis to manage categorical data. 
     * * Logarithmic: This type is applied for rendering a logarithmic axis to handle a wide range of values. 
     * * DateTimeCategory: This type is used to render a date time category axis for managing business days.
     * @default 'Double'
     * @blazortype Syncfusion.EJ2.Blazor.Charts.ValueType
     * @isenumeration true
     */
    public declare valueType: any;
    /** 
     * If set to true, axis label will be visible.
     * @default true
     */
    public declare visible: any;
    /** 
     * The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.
     * @default 1
     */
    public declare zoomFactor: any;
    /** 
     * Position of the zoomed axis. Value ranges from 0 to 1.
     * @default 0
     */
    public declare zoomPosition: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * StockChartAxis Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-stockchart>e-stockchart-axes',
    standalone: true,
    queries: {
        children: new ContentChildren(StockChartAxisDirective)
    },
})
export class StockChartAxesDirective extends ArrayBase<StockChartAxesDirective> {
    constructor() {
        super('axes');
    }
}