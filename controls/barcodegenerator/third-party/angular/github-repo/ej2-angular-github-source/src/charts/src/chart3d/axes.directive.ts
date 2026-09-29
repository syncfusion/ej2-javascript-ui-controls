import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['columnIndex', 'desiredIntervals', 'edgeLabelPlacement', 'enableTrim', 'interval', 'intervalType', 'isIndexed', 'isInversed', 'labelFormat', 'labelIntersectAction', 'labelPadding', 'labelPlacement', 'labelRotation', 'labelStyle', 'logBase', 'majorGridLines', 'majorTickLines', 'maximum', 'maximumLabelWidth', 'maximumLabels', 'minimum', 'minorGridLines', 'minorTickLines', 'minorTicksPerInterval', 'name', 'opposedPosition', 'plotOffset', 'plotOffsetBottom', 'plotOffsetLeft', 'plotOffsetRight', 'plotOffsetTop', 'rangePadding', 'rowIndex', 'skeleton', 'skeletonType', 'span', 'startFromZero', 'title', 'titlePadding', 'titleRotation', 'titleStyle', 'valueType', 'visible'];
let outputs: string[] = [];
/**
 * Axis3D Directive
 * ```html
 * <e-axes><e-axis></e-axis></e-axes>
 * ```
 */
@Directive({
    selector: 'e-chart3daxes>e-chart3daxis',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class Chart3DAxisDirective extends ComplexBase<Chart3DAxisDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the index of the column where the axis is associated, 
     * when the chart area is divided into multiple plot areas by using `columns`. 
     * 
     * @default 0
     */
    public declare columnIndex: any;
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
     * Specifies indexed category  axis.
     * @default false
     */
    public declare isIndexed: any;
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
     * Specifies the actions like `None`, `Hide`, `Trim`, `Wrap`, `MultipleRows`, `Rotate45`, and `Rotate90` 
     * when the axis labels intersect with each other.They are, 
     * * None: Shows all the labels. 
     * * Hide: Hides the label when it intersects. 
     * * Trim: Trim the label when it intersects. 
     * * Wrap: Wrap the label when it intersects. 
     * * MultipleRows: Shows the label in MultipleRows when it intersects. 
     * * Rotate45: Rotates the label to 45 degree when it intersects. 
     * * Rotate90: Rotates the label to 90 degree when it intersects.
     * @default Trim
     */
    public declare labelIntersectAction: any;
    /** 
     * Specifies the labelPadding from axis.
     * @default 5
     */
    public declare labelPadding: any;
    /** 
     * Specifies the placement of a label for category axis. They are, 
     * * betweenTicks: Renders the label between the ticks. 
     * * onTicks: Renders the label on the ticks.
     * @default 'OnTicks'
     */
    public declare labelPlacement: any;
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
     * Left and right padding for the plot area in pixels.
     * @default 0
     */
    public declare plotOffset: any;
    /** 
     * Bottom padding for the plot area in pixels.
     * @default null
     */
    public declare plotOffsetBottom: any;
    /** 
     * Left padding for the plot area in pixels.
     * @default null
     */
    public declare plotOffsetLeft: any;
    /** 
     * Right padding for the plot area in pixels.
     * @default null
     */
    public declare plotOffsetRight: any;
    /** 
     * Top padding for the plot area in pixels.
     * @default null
     */
    public declare plotOffsetTop: any;
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
     * @deprecated 
     */
    public declare skeletonType: any;
    /** 
     * Specifies the number of `columns` or `rows` an axis has to span horizontally or vertically.
     * @default 1
     */
    public declare span: any;
    /** 
     * It specifies whether the axis to be start from zero.
     * @default true
     */
    public declare startFromZero: any;
    /** 
     * Specifies the title of an axis.
     * @default ''
     */
    public declare title: any;
    /** 
     * Specifies the titlePadding from axis label.
     * @default 5
     */
    public declare titlePadding: any;
    /** 
     * Defines an angle to rotate axis title. By default, angle auto calculated based on position and orientation of axis.
     * @default null
     */
    public declare titleRotation: any;
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
     * @isenumeration true
     */
    public declare valueType: any;
    /** 
     * If set to true, axis label will be visible.
     * @default true
     */
    public declare visible: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Chart3DAxis Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-chart3d>e-chart3daxes',
    standalone: true,
    queries: {
        children: new ContentChildren(Chart3DAxisDirective)
    },
})
export class Chart3DAxesDirective extends ArrayBase<Chart3DAxesDirective> {
    constructor() {
        super('axes');
    }
}