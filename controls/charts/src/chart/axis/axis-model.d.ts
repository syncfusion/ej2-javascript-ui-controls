import { Property, Complex, ChildProperty, Collection, extend, Browser } from '@syncfusion/ej2-base';import { FontModel, BorderModel } from '../../common/model/base-model';import { Font, Border } from '../../common/model/base';import { AxisPosition } from '../utils/enum';import { EdgeLabelPlacement, ValueType, IntervalType, LabelIntersectAction, Orientation, ChartRangePadding, SkeletonType } from '../../common/utils/enum';import { rotateTextSize, firstToLowerCase, valueToCoefficient, inside, isBreakLabel, isZoomSet, getTitle, getElement, appendChildElement } from '../../common/utils/helper';import { Size, Rect, measureText } from '@syncfusion/ej2-svg-base';import { DoubleRange } from '../utils/double-range';import { Chart } from '../chart';import { Series } from '../series/chart-series';import { Double } from '../axis/double-axis';import { DateTime } from '../axis/date-time-axis';import { Category } from '../axis/category-axis';import { DateTimeCategory } from '../axis/date-time-category-axis';import { LabelPlacement, TextAlignment } from '../../common/utils/enum';import { IAxisRangeCalculatedEventArgs } from '../../chart/model/chart-interface';import { axisRangeCalculated } from '../../common/model/constants';import { StripLineSettings, MultiLevelLabels, LabelBorder, ScrollbarSettings } from '../model/chart-base';import { StripLineSettingsModel, MultiLevelLabelsModel, LabelBorderModel, ScrollbarSettingsModel} from '../model/chart-base-model';import { textWrap } from '../../common/utils/helper';import { ScrollBar } from '../../common/scrollbar/scrollbar';import { isNullOrUndefined } from '@syncfusion/ej2-base';import { VisibleRangeModel } from '../../common/model/interface';import { CartesianAxisLayoutPanel } from './cartesian-panel';

/**
 * Interface for a class Row
 */
export interface RowModel {

    /**
     * The height of the row as a string accepts input both as '100px' and '100%'.
     * If specified as '100%', the row renders to the full height of its chart.
     *
     * @default '100%'
     */

    height?: string;

    /**
     * Options to customize the border of the rows.
     */

    border?: BorderModel;

}

/**
 * Interface for a class Column
 */
export interface ColumnModel {

    /**
     * The width of the column as a string accepts input both as '100px' and '100%'.
     * If specified as '100%', the column renders to the full width of its chart.
     *
     * @default '100%'
     */

    width?: string;

    /**
     * Options to customize the border of the columns.
     */

    border?: BorderModel;

}

/**
 * Interface for a class MajorGridLines
 */
export interface MajorGridLinesModel {

    /**
     * The width of the major grid lines in pixels, determining the thickness of the lines on the axis.
     *
     * @default 1
     */

    width?: number;

    /**
     * The dash array of the grid lines, defining the pattern of dashes and gaps for the major grid lines on the axis.
     *
     * @default ''
     */

    dashArray?: string;

    /**
     * Specifies the color of the major grid line, accepting hex and rgba values as valid CSS color strings.
     *
     * @default null
     */

    color?: string;

}

/**
 * Interface for a class MinorGridLines
 */
export interface MinorGridLinesModel {

    /**
     * The width of the minor grid lines in pixels, determining the thickness of the lines on the axis.
     *
     * @default 0.7
     */

    width?: number;

    /**
     * The dash array of the grid lines, defining the pattern of dashes and gaps for the minor grid lines on the chart's axis.
     *
     * @default ''
     */

    dashArray?: string;

    /**
     * Specifies the color of the minor grid line, accepting hex and rgba values as valid CSS color strings.
     *
     * @default null
     */

    color?: string;

}

/**
 * Interface for a class AxisLine
 */
export interface AxisLineModel {

    /**
     * The width of the axis line in pixels, determining the thickness of the lines on the axis.
     *
     * @default 1
     */

    width?: number;

    /**
     * The dash array of the axis line, defining the pattern of dashes and gaps for the axis line.
     *
     * @default ''
     */

    dashArray?: string;

    /**
     * Specifies the color of the axis line. Accepts values in hex and rgba formats as valid CSS color strings.
     *
     * @default null
     */

    color?: string;

}

/**
 * Interface for a class MajorTickLines
 */
export interface MajorTickLinesModel {

    /**
     * The width of the major tick lines in pixels, determining the thickness of the lines on the axis.
     *
     * @default 1
     */

    width?: number;

    /**
     * The height of the ticks in pixels, which defines their length on the axis.
     *
     * @default 5
     */

    height?: number;

    /**
     * Specifies the color of the major tick line, accepting hex and rgba values as valid CSS color strings.
     *
     * @default null
     */

    color?: string;

}

/**
 * Interface for a class MinorTickLines
 */
export interface MinorTickLinesModel {

    /**
     * The width of the minor tick lines in pixels, determining the thickness of the lines on the axis.
     *
     * @default 0.7
     */

    width?: number;

    /**
     * The height of the ticks in pixels, which defines their length on the axis.
     *
     * @default 5
     */

    height?: number;

    /**
     * Specifies the color of the minor tick line, accepting hex and rgba values as valid CSS color strings.
     *
     * @default null
     */

    color?: string;

}

/**
 * Interface for a class CrosshairTooltip
 */
export interface CrosshairTooltipModel {

    /**
     * If set to true, the crosshair tooltip will be visible on the chart when interacting with the crosshair.
     *
     *  @default false
     */

    enable?: boolean;

    /**
     * The fill color of the tooltip accepts values in hex and rgba as valid CSS color string.
     *
     * @default null
     */

    fill?: string;

    /**
     * Options for customizing the crosshair tooltip text, including font settings such as family, size, style, weight, and color.
     */

    textStyle?: FontModel;

}

/**
 * Interface for a class Axis
 */
export interface AxisModel {

    /**
     * This property allows defining various font settings to control how the labels are displayed on the axis.
     */

    labelStyle?: FontModel;

    /**
     * Options to customize the appearance and behavior of the crosshair tooltip that appears when hovering over the chart.
     */

    crosshairTooltip?: CrosshairTooltipModel;

    /**
     * Specifies the title of an axis, displayed along the axis to provide context about the represented data.
     *
     * @default ''
     */

    title?: string;

    /**
     * Options for customizing the appearance of the axis title, including font family, size, style, weight, and color.
     */

    titleStyle?: FontModel;

    /**
     * Used to format the axis label. This property accepts global string formats such as `C`, `n1`, `P`, etc.
     * It also accepts placeholders like `{value}°C`, where `{value}` represents the axis label (e.g., 20°C).
     *
     * @default ''
     */

    labelFormat?: string;

    /**
     * Specifies the skeleton format used for processing date-time values.
     *
     * @default ''
     */

    skeleton?: string;

    /**
     * Specifies the format type to be used in date-time formatting.
     *
     * @default 'DateTime'
     * @deprecated
     */

    skeletonType?: SkeletonType;

    /**
     * Determines the alignment of labels when a line break occurs in the axis labels.
     *
     * @default 'Center'
     */

    lineBreakAlignment?: TextAlignment;

    /**
     * Specifies the padding on the top, bottom, left and right sides of the chart area, in pixels.
     *
     * @default 0
     */

    plotOffset?: number;

    /**
     * Specifies the left padding for the chart area, in pixels.
     *
     * @default null
     */

    plotOffsetLeft?: number;

    /**
     * Specifies the top padding for the chart area, in pixels.
     *
     * @default null
     */

    plotOffsetTop?: number;

    /**
     * Specifies the right padding for the chart area, in pixels.
     *
     * @default null
     */

    plotOffsetRight?: number;

    /**
     * Specifies the bottom padding for the chart area, in pixels.
     *
     * @default null
     */

    plotOffsetBottom?: number;

    /**
     * If set to true, data points are rendered based on their index.
     *
     * @default false
     */

    isIndexed?: boolean;

    /**
     * Specifies the base value for a logarithmic axis.
     > Note that `valueType` must be set to `Logarithmic` for this feature to work.
     *
     * @default 10
     */
    logBase?: number;

    /**
     * Specifies the index of the column where the axis is associated when the chart area is divided into multiple plot areas using `columns`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     columns: [{ width: '50%' },
     *               { width: '50%' }],
     *     axes: [{
     *                name: 'xAxis 1',
     *                columnIndex: 1
     *     }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default 0
     */

    columnIndex?: number;

    /**
     * Specifies the index of the row where the axis is associated when the chart area is divided into multiple plot areas using `rows`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     rows: [{ height: '50%' },
     *            { height: '50%' }],
     *     axes: [{
     *                name: 'yAxis 1',
     *                rowIndex: 1
     *      }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default 0
     */

    rowIndex?: number;

    /**
     * Specifies the number of `columns` or `rows` that an axis spans horizontally or vertically.
     *
     * @default 1
     */

    span?: number;

    /**
     * The `desiredIntervals` property allows the axis to calculate intervals that are roughly equal to the specified number, promoting a more readable and evenly spaced axis.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    desiredIntervals?: number;

    /**
     * Specifies the maximum number of labels per 100 pixels relative to the axis length.
     *
     * @default 3
     */

    maximumLabels?: number;

    /**
     * The axis is scaled by this factor. When `zoomFactor` is 0.5, the chart is scaled by 200% along this axis.
     > Note the value ranges from 0 to 1.
     *
     * @default 1
     */

    zoomFactor?: number;

    /**
     * Sets the position of the zoomed axis on the chart, with the `zoomPosition` property specifying the position within the zoomed range, from 0 (start) to 1 (end).
     *
     * @default 0
     */

    zoomPosition?: number;

    /**
     * If set to true, a scrollbar will appear while zooming to help navigate through the zoomed content.
     *
     * @default true
     */
    enableScrollbarOnZooming?: boolean;

    /**
     * If set to true, the axis will render on the opposite side of its default position.
     *
     * @default false
     */

    opposedPosition?: boolean;

    /**
     * If set to true, the axis interval will be calculated automatically based on the zoomed range.
     *
     * @default true
     */

    enableAutoIntervalOnZooming?: boolean;

    /**
     * The `rangePadding` property determines how padding is applied to the axis range, affecting the appearance of the chart by adjusting the minimum and maximum values of the axis.
     * Available options are:
     * * None: No padding is applied to the axis.
     * * Normal: Padding is applied based on the range calculation.
     * * Additional: The interval of the axis is added as padding to both the minimum and maximum values of the range.
     * * Round: The axis range is rounded to the nearest possible value that is divisible by the interval.
     *
     * @default 'Auto'
     */

    rangePadding?: ChartRangePadding;

    /**
     * The `valueType` property defines the type of data that the axis can manage, ensuring correct rendering based on the data type. This property supports multiple data types, each suited for different kinds of data visualization.
     * Available options include:
     * * Double: Used for rendering a numeric axis to accommodate numeric data.
     * * DateTime: Utilized for rendering a date-time axis to manage date-time data.
     * * Category: Employed for rendering a category axis to manage categorical data.
     * * Logarithmic: Applied for rendering a logarithmic axis to handle a wide range of values.
     * * DateTimeCategory: Used to render a date-time category axis for managing business days.
     *
     * @default 'Double'
     * @blazorType Syncfusion.EJ2.Blazor.Charts.ValueType
     * @isEnumeration true
     */

    valueType?: ValueType;

    /**
     * The `edgeLabelPlacement` property ensures that labels positioned at the edges of the axis do not overlap with the axis boundaries or other chart elements, offering several options to improve chart readability by managing edge labels effectively.
     * Available options are:
     * * None: No action will be performed on edge labels.
     * * Hide: Edge labels will be hidden to prevent overlap.
     * * Shift: Edge labels will be shifted to fit within the axis bounds without overlapping.
     *
     * @default 'None'
     */

    edgeLabelPlacement?: EdgeLabelPlacement;

    /**
     * The `intervalType` property defines how the intervals on a date-time axis are calculated and displayed.
     * Available options are:
     * * Auto: Automatically determines the interval type based on the data and chart settings.
     * * Years: Sets the interval of the axis in years.
     * * Months: Sets the interval of the axis in months.
     * * Days: Sets the interval of the axis in days.
     * * Hours: Sets the interval of the axis in hours.
     * * Minutes: Sets the interval of the axis in minutes.
     *
     * @default 'Auto'
     */

    intervalType?: IntervalType;

    /**
     * The `labelPlacement` property controls where the category axis labels are rendered in relation to the axis ticks.
     * Available options are:
     * * BetweenTicks: Renders the label between the axis ticks.
     * * OnTicks: Renders the label directly on the axis ticks.
     *
     * @default 'BetweenTicks'
     */

    labelPlacement?: LabelPlacement;

    /**
     * The `tickPosition` property determines where the axis ticks are rendered in relation to the axis line.
     * Available options are:
     * * Inside: Renders the ticks inside the axis line.
     * * Outside: Renders the ticks outside the axis line.
     *
     * @default 'Outside'
     */

    tickPosition?: AxisPosition;

    /**
     * The `labelPosition` property determines where the axis labels are rendered in relation to the axis line.
     * Available options are:
     * * Inside: Renders the labels inside the axis line.
     * * Outside: Renders the labels outside the axis line.
     *
     * @default 'Outside'
     */

    labelPosition?: AxisPosition;

    /**
     * A unique identifier for an axis. To associate an axis with a series, set this name to the `xAxisName` or `yAxisName` properties of the series.
     *
     * @default ''
     */

    name?: string;

    /**
     * If set to true, axis labels will be visible in the chart. By default, axis labels are enabled.
     *
     * @default true
     */

    visible?: boolean;

    /**
     * Specifies the number of minor ticks per interval.
     *
     * @default 0
     */

    minorTicksPerInterval?: number;

    /**
     * The angle to which the axis label gets rotated.
     *
     * @default 0
     */

    labelRotation?: number;

    /**
     * Defines an angle for rotating the axis title. By default, the angle is calculated based on the position and orientation of the axis.
     *
     * @default null
     */

    titleRotation?: number;

    /**
     * Specifies the value at which the axis line intersects with the vertical axis or vice versa.
     *
     * @default null
     */

    crossesAt?: Object;

    /**
     * Specifies whether axis elements, such as axis labels and the axis title, should be crossed by the axis line.
     *
     * @default true
     */

    placeNextToAxisLine?: boolean;

    /**
     * Specifies the name of the axis with which the axis line should intersect.
     *
     * @default null
     */

    crossesInAxis?: string;

    /**
     * Specifies the minimum value of the axis range, which sets the lower bound of the axis and defines the smallest value that will be displayed on the chart to control the visible range of data.
     *
     * @default null
     */

    minimum?: Object;

    /**
     * Specifies the maximum value of the axis range, which sets the upper bound of the axis and defines the largest value displayed on the chart, helping to control the visible range of data.
     *
     * @default null
     */

    maximum?: Object;

    /**
     * Specifies the interval for the axis.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    interval?: number;

    /**
     * Specifies the maximum width of an axis label.
     *
     * @default 34.
     */
    maximumLabelWidth?: number;

    /**
     * If set to true, axis labels will be trimmed based on the `maximumLabelWidth`.
     *
     * @default false
     */
    enableTrim?: boolean;

    /**
     * The `labelPadding` property adjusts the distance to ensure a clear space between the axis labels and the axis line.
     *
     * @default 5
     */

    labelPadding?: number;

    /**
     * Specifies the padding between the axis title and the axis labels.
     *
     * @default 5
     */

    titlePadding?: number;

    /**
     * Options for customizing major tick lines on the axis.
     */

    majorTickLines?: MajorTickLinesModel;

    /**
     * Options for customizing minor tick lines on the axis.
     */

    minorTickLines?: MinorTickLinesModel;

    /**
     * Options for customizing major grid lines on the axis.
     */

    majorGridLines?: MajorGridLinesModel;

    /**
     * Options for customizing minor grid lines on the axis.
     */

    minorGridLines?: MinorGridLinesModel;

    /**
     * Options for customizing the axis lines.
     */

    lineStyle?: AxisLineModel;

    /**
     * Specifies the action to take when axis labels intersect with each other.
     * The available options are:
     * * None: Shows all labels without any modification.
     * * Hide: Hides the label if it intersects with another label.
     * * Trim: Trims the label text to fit within the available space.
     * * Wrap: Wraps the label text to fit within the available space.
     * * MultipleRows: Displays the label text in multiple rows to avoid intersection.
     * * Rotate45: Rotates the label text by 45 degrees to avoid intersection.
     * * Rotate90: Rotates the label text by 90 degrees to avoid intersection.
     *
     * @default Trim
     */

    labelIntersectAction?: LabelIntersectAction;

    /**
     * If set to true, the axis will be rendered in an inversed manner.
     *
     * @default false
     */
    isInversed?: boolean;

    /**
     * The `coefficient` value adjusts the size of the polar radar chart's radius. A higher value increases the radius size, while a smaller value decreases it.
     *
     * @default 100
     */

    coefficient?: number;

    /**
     * Specifies the start angle for the series in a polar or radar chart, measured in degrees from the horizontal axis, determining the initial angle from which the series begins.
     *
     * @default 0
     */

    startAngle?: number;

    /**
     * If set to true, the axis starts from zero.
     * If set to false, the axis starts from the minimum value of the data.
     *
     * @default true
     */
    startFromZero?: boolean;

    /**
     * A description for the axis that provides additional information about its content for screen readers.
     *
     * @default null
     */
    description?: string;

    /**
     * The `tabIndex` value for the axis, determining its position in the tab order.
     *
     * @default 2
     */
    tabIndex?: number;

    /**
     * Specifies the collection of strip lines for the axis, which are visual elements used to mark or highlight specific ranges.
     */
    stripLines?: StripLineSettingsModel[];

    /**
     * Multi-level labels are used to display hierarchical or grouped labels on the axis, allowing for a more detailed and structured data representation.
     */
    multiLevelLabels?: MultiLevelLabelsModel[];

    /**
     * Configures the appearance of the border around multi-level labels, including the color, width, and type of the border.
     */
    border?: LabelBorderModel;

    /**
     * Configures the scrollbar with options for customization, including appearance, behavior, and lazy loading settings.
     */
    scrollbarSettings?: ScrollbarSettingsModel;

}

/**
 * Interface for a class VisibleLabels
 * @private
 */
export interface VisibleLabelsModel {

}