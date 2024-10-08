import { Property, Complex, ChildProperty, Collection, extend, Browser } from '@syncfusion/ej2-base';
import { FontModel, BorderModel } from '../../common/model/base-model';
import { Font, Border } from '../../common/model/base';
import { AxisPosition } from '../utils/enum';
import { EdgeLabelPlacement, ValueType, IntervalType, LabelIntersectAction, Orientation, ChartRangePadding, SkeletonType } from '../../common/utils/enum';
import { rotateTextSize, firstToLowerCase, valueToCoefficient, inside, isBreakLabel, isZoomSet, getTitle, getElement, appendChildElement } from '../../common/utils/helper';
import { Size, Rect, measureText } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Chart } from '../chart';
import { MajorGridLinesModel, MinorGridLinesModel, CrosshairTooltipModel } from '../axis/axis-model';
import { AxisLineModel, MajorTickLinesModel, MinorTickLinesModel } from '../axis/axis-model';
import { Series } from '../series/chart-series';
import { Double } from '../axis/double-axis';
import { DateTime } from '../axis/date-time-axis';
import { Category } from '../axis/category-axis';
import { DateTimeCategory } from '../axis/date-time-category-axis';
import { LabelPlacement, TextAlignment } from '../../common/utils/enum';
import { IAxisRangeCalculatedEventArgs } from '../../chart/model/chart-interface';
import { axisRangeCalculated } from '../../common/model/constants';
import { StripLineSettings, MultiLevelLabels, LabelBorder, ScrollbarSettings } from '../model/chart-base';
import { StripLineSettingsModel, MultiLevelLabelsModel, LabelBorderModel, ScrollbarSettingsModel} from '../model/chart-base-model';
import { textWrap } from '../../common/utils/helper';
import { ScrollBar } from '../../common/scrollbar/scrollbar';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { VisibleRangeModel } from '../../common/model/interface';
import { CartesianAxisLayoutPanel } from './cartesian-panel';

/**
 * Configures the `rows` of the chart to create multiple vertical rows within the chart area.
 */

export class Row extends ChildProperty<Row> {

    /**
     * The height of the row as a string accepts input both as '100px' and '100%'.
     * If specified as '100%', the row renders to the full height of its chart.
     *
     * @default '100%'
     */

    @Property('100%')
    public height: string;

    /**
     * Options to customize the border of the rows.
     */

    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /** @private */
    public axes: Axis[] = [];
    /** @private */
    public computedHeight: number;
    /** @private */
    public computedTop: number;
    /** @private */
    public nearSizes: number[] = [];
    /** @private */
    public farSizes: number[] = [];
    /** @private */
    public insideFarSizes: number[] = [];
    /** @private */
    public insideNearSizes: number[] = [];
    /**
     * Measure the row size.
     *
     * @param {Axis} axis - The axis for which to measure the row size.
     * @param {number} scrollBarHeight - The height of the scrollbar.
     * @param {Row | Column} definition - The definition of the row or column.
     * @param {Chart} chart - The chart instance.
     * @returns {void}
     * @private
     */
    public computeSize(axis: Axis, scrollBarHeight: number, definition: Row | Column, chart: Chart): void {
        let width: number = 0;
        const innerPadding: number = (axis.labelPosition === 'Inside' && (chart.axes.indexOf(axis) > -1)) ? -5 : 5;
        if (axis.visible && axis.internalVisibility) {
            width += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding, definition, chart) + axis.lineStyle.width * 0.5);
        }

        if (axis.isAxisOpposedPosition) {
            this.farSizes.push(width);
        } else {
            this.nearSizes.push(width);
        }
    }
}

/**
 * Configures the `columns` of the chart to create multiple horizontal columns within the chart area.
 */

export class Column extends ChildProperty<Column> {

    /**
     * The width of the column as a string accepts input both as '100px' and '100%'.
     * If specified as '100%', the column renders to the full width of its chart.
     *
     * @default '100%'
     */

    @Property('100%')
    public width: string;

    /**
     * Options to customize the border of the columns.
     */

    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /** @private */
    public axes: Axis[] = [];
    /** @private */
    public computedWidth: number;
    /** @private */
    public computedLeft: number;
    /** @private */
    public nearSizes: number[] = [];
    /** @private */
    public farSizes: number[] = [];
    /** @private */
    public insideFarSizes: number[] = [];
    /** @private */
    public insideNearSizes: number[] = [];
    /** @private */
    private padding: number = 0;

    /**
     * Measure the column size
     *
     * @returns {void}
     * @private
     */

    public computeSize(axis: Axis, scrollBarHeight: number, definition: Row | Column, chart: Chart): void {
        let height: number = 0;
        const innerPadding: number = 5;
        if (axis.visible && axis.internalVisibility) {
            height += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding, definition, chart) + axis.lineStyle.width * 0.5);
        }
        if (axis.isAxisOpposedPosition) {
            this.farSizes.push(height);
        } else {
            this.nearSizes.push(height);
        }
    }
}
/**
 * Configures the major grid lines in the axis, allowing for the setting of properties such as color, width, and dashArray to define how the grid lines appear on the chart.
 */
export class MajorGridLines extends ChildProperty<MajorGridLines> {

    /**
     * The width of the major grid lines in pixels, determining the thickness of the lines on the axis.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The dash array of the grid lines, defining the pattern of dashes and gaps for the major grid lines on the axis.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * Specifies the color of the major grid line, accepting hex and rgba values as valid CSS color strings.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the minor grid lines in the axis, allowing for the setting of properties such as color, width, and dashArray to define how the grid lines appear on the chart.
 */
export class MinorGridLines extends ChildProperty<MinorGridLines> {

    /**
     * The width of the minor grid lines in pixels, determining the thickness of the lines on the axis.
     *
     * @default 0.7
     */

    @Property(0.7)
    public width: number;

    /**
     * The dash array of the grid lines, defining the pattern of dashes and gaps for the minor grid lines on the chart's axis.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * Specifies the color of the minor grid line, accepting hex and rgba values as valid CSS color strings.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the axis line of a chart, allowing customization of the line's appearance, including its color, width, and dashArray.
 */
export class AxisLine extends ChildProperty<AxisLine> {

    /**
     * The width of the axis line in pixels, determining the thickness of the lines on the axis.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The dash array of the axis line, defining the pattern of dashes and gaps for the axis line.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * Specifies the color of the axis line. Accepts values in hex and rgba formats as valid CSS color strings.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the major tick lines in the axis, allowing for the setting of properties such as color, width, and height to define how the tick lines appear on the chart.
 */
export class MajorTickLines extends ChildProperty<MajorTickLines> {

    /**
     * The width of the major tick lines in pixels, determining the thickness of the lines on the axis.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The height of the ticks in pixels, which defines their length on the axis.
     *
     * @default 5
     */

    @Property(5)
    public height: number;

    /**
     * Specifies the color of the major tick line, accepting hex and rgba values as valid CSS color strings.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the minor tick lines in the axis, allowing for the setting of properties such as color, width, and height to define how the tick lines appear on the chart.
 */
export class MinorTickLines extends ChildProperty<MinorTickLines> {

    /**
     * The width of the minor tick lines in pixels, determining the thickness of the lines on the axis.
     *
     * @default 0.7
     */

    @Property(0.7)
    public width: number;

    /**
     * The height of the ticks in pixels, which defines their length on the axis.
     *
     * @default 5
     */

    @Property(5)
    public height: number;

    /**
     * Specifies the color of the minor tick line, accepting hex and rgba values as valid CSS color strings.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the crosshair tooltip for the chart, allowing customization of the tooltip's appearance and content during crosshair interactions.
 */
export class CrosshairTooltip extends ChildProperty<CrosshairTooltip> {

    /**
     * If set to true, the crosshair tooltip will be visible on the chart when interacting with the crosshair.
     *
     *  @default false
     */

    @Property(false)
    public enable: boolean;

    /**
     * The fill color of the tooltip accepts values in hex and rgba as valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Options for customizing the crosshair tooltip text, including font settings such as family, size, style, weight, and color.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public textStyle: FontModel;

}

/**
 * The Axis class configures the axes in the chart. It provides various properties to customize the appearance and behavior of chart axes, including settings for labels, grid lines, ticks, and more.
 *
 * @public
 */

export class Axis extends ChildProperty<Axis> {
    /**
     * This property allows defining various font settings to control how the labels are displayed on the axis.
     */

    @Complex<FontModel>({fontFamily: null, size: '12px', fontStyle: 'Normal', fontWeight: '400', color: null}, Font)
    public labelStyle: FontModel;

    /**
     * Options to customize the appearance and behavior of the crosshair tooltip that appears when hovering over the chart.
     */

    @Complex<CrosshairTooltipModel>({}, CrosshairTooltip)
    public crosshairTooltip: CrosshairTooltipModel;

    /**
     * Specifies the title of an axis, displayed along the axis to provide context about the represented data.
     *
     * @default ''
     */

    @Property('')
    public title: string;

    /**
     * Options for customizing the appearance of the axis title, including font family, size, style, weight, and color.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public titleStyle: FontModel;

    /**
     * Used to format the axis label. This property accepts global string formats such as `C`, `n1`, `P`, etc.
     * It also accepts placeholders like `{value}°C`, where `{value}` represents the axis label (e.g., 20°C).
     *
     * @default ''
     */

    @Property('')
    public labelFormat: string;

    /**
     * Specifies the skeleton format used for processing date-time values.
     *
     * @default ''
     */

    @Property('')
    public skeleton: string;

    /**
     * Specifies the format type to be used in date-time formatting.
     *
     * @default 'DateTime'
     * @deprecated
     */

    @Property('DateTime')
    public skeletonType: SkeletonType;

    /**
     * Determines the alignment of labels when a line break occurs in the axis labels.
     *
     * @default 'Center'
     */

    @Property('Center')
    public lineBreakAlignment: TextAlignment;

    /**
     * Specifies the padding on the top, bottom, left and right sides of the chart area, in pixels.
     *
     * @default 0
     */

    @Property(0)
    public plotOffset: number;

    /**
     * Specifies the left padding for the chart area, in pixels.
     *
     * @default null
     */

    @Property(null)
    public plotOffsetLeft: number;

    /**
     * Specifies the top padding for the chart area, in pixels.
     *
     * @default null
     */

    @Property(null)
    public plotOffsetTop: number;

    /**
     * Specifies the right padding for the chart area, in pixels.
     *
     * @default null
     */

    @Property(null)
    public plotOffsetRight: number;

    /**
     * Specifies the bottom padding for the chart area, in pixels.
     *
     * @default null
     */

    @Property(null)
    public plotOffsetBottom: number;

    /**
     * If set to true, data points are rendered based on their index.
     *
     * @default false
     */

    @Property(false)
    public isIndexed: boolean;

    /**
     * Specifies the base value for a logarithmic axis.
     > Note that `valueType` must be set to `Logarithmic` for this feature to work.
     *
     * @default 10
     */
    @Property(10)
    public logBase: number;

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

    @Property(0)
    public columnIndex: number;

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

    @Property(0)
    public rowIndex: number;


    /**
     * Specifies the number of `columns` or `rows` that an axis spans horizontally or vertically.
     *
     * @default 1
     */

    @Property(1)
    public span: number;

    /**
     * The `desiredIntervals` property allows the axis to calculate intervals that are roughly equal to the specified number, promoting a more readable and evenly spaced axis.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public desiredIntervals: number;

    /**
     * Specifies the maximum number of labels per 100 pixels relative to the axis length.
     *
     * @default 3
     */

    @Property(3)
    public maximumLabels: number;

    /**
     * The axis is scaled by this factor. When `zoomFactor` is 0.5, the chart is scaled by 200% along this axis.
     > Note the value ranges from 0 to 1.
     *
     * @default 1
     */

    @Property(1)
    public zoomFactor: number;

    /**
     * Sets the position of the zoomed axis on the chart, with the `zoomPosition` property specifying the position within the zoomed range, from 0 (start) to 1 (end).
     *
     * @default 0
     */

    @Property(0)
    public zoomPosition: number;

    /**
     * If set to true, a scrollbar will appear while zooming to help navigate through the zoomed content.
     *
     * @default true
     */
    @Property(true)
    public enableScrollbarOnZooming: boolean;

    /**
     * If set to true, the axis will render on the opposite side of its default position.
     *
     * @default false
     */

    @Property(false)
    public opposedPosition: boolean;

    /**
     * If set to true, the axis interval will be calculated automatically based on the zoomed range.
     *
     * @default true
     */

    @Property(true)
    public enableAutoIntervalOnZooming: boolean;

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

    @Property('Auto')
    public rangePadding: ChartRangePadding;

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

    @Property('Double')
    public valueType: ValueType;


    /**
     * The `edgeLabelPlacement` property ensures that labels positioned at the edges of the axis do not overlap with the axis boundaries or other chart elements, offering several options to improve chart readability by managing edge labels effectively.
     * Available options are:
     * * None: No action will be performed on edge labels.
     * * Hide: Edge labels will be hidden to prevent overlap.
     * * Shift: Edge labels will be shifted to fit within the axis bounds without overlapping.
     *
     * @default 'None'
     */

    @Property('None')
    public edgeLabelPlacement: EdgeLabelPlacement;

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

    @Property('Auto')
    public intervalType: IntervalType;

    /**
     * The `labelPlacement` property controls where the category axis labels are rendered in relation to the axis ticks.
     * Available options are:
     * * BetweenTicks: Renders the label between the axis ticks.
     * * OnTicks: Renders the label directly on the axis ticks.
     *
     * @default 'BetweenTicks'
     */

    @Property('BetweenTicks')
    public labelPlacement: LabelPlacement;

    /**
     * The `tickPosition` property determines where the axis ticks are rendered in relation to the axis line.
     * Available options are:
     * * Inside: Renders the ticks inside the axis line.
     * * Outside: Renders the ticks outside the axis line.
     *
     * @default 'Outside'
     */

    @Property('Outside')
    public tickPosition: AxisPosition;

    /**
     * The `labelPosition` property determines where the axis labels are rendered in relation to the axis line.
     * Available options are:
     * * Inside: Renders the labels inside the axis line.
     * * Outside: Renders the labels outside the axis line.
     *
     * @default 'Outside'
     */

    @Property('Outside')
    public labelPosition: AxisPosition;

    /**
     * A unique identifier for an axis. To associate an axis with a series, set this name to the `xAxisName` or `yAxisName` properties of the series.
     *
     * @default ''
     */

    @Property('')
    public name: string;

    /**
     * If set to true, axis labels will be visible in the chart. By default, axis labels are enabled.
     *
     * @default true
     */

    @Property(true)
    public visible: boolean;

    /**
     * Specifies the number of minor ticks per interval.
     *
     * @default 0
     */

    @Property(0)
    public minorTicksPerInterval: number;

    /**
     * The angle to which the axis label gets rotated.
     *
     * @default 0
     */

    @Property(0)
    public labelRotation: number;

    /**
     * Defines an angle for rotating the axis title. By default, the angle is calculated based on the position and orientation of the axis.
     *
     * @default null
     */

    @Property(null)
    public titleRotation: number;

    /**
     * Specifies the value at which the axis line intersects with the vertical axis or vice versa.
     *
     * @default null
     */

    @Property(null)
    public crossesAt: Object;

    /**
     * Specifies whether axis elements, such as axis labels and the axis title, should be crossed by the axis line.
     *
     * @default true
     */

    @Property(true)
    public placeNextToAxisLine: boolean;

    /**
     * Specifies the name of the axis with which the axis line should intersect.
     *
     * @default null
     */

    @Property(null)
    public crossesInAxis: string;

    /**
     * Specifies the minimum value of the axis range, which sets the lower bound of the axis and defines the smallest value that will be displayed on the chart to control the visible range of data.
     *
     * @default null
     */

    @Property(null)
    public minimum: Object;

    /**
     * Specifies the maximum value of the axis range, which sets the upper bound of the axis and defines the largest value displayed on the chart, helping to control the visible range of data.
     *
     * @default null
     */

    @Property(null)
    public maximum: Object;

    /**
     * Specifies the interval for the axis.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public interval: number;

    /**
     * Specifies the maximum width of an axis label.
     *
     * @default 34.
     */
    @Property(34)
    public maximumLabelWidth: number;

    /**
     * If set to true, axis labels will be trimmed based on the `maximumLabelWidth`.
     *
     * @default false
     */
    @Property(false)
    public enableTrim: boolean;

    /**
     * The `labelPadding` property adjusts the distance to ensure a clear space between the axis labels and the axis line.
     *
     * @default 5
     */

    @Property(5)
    public labelPadding: number;

    /**
     * Specifies the padding between the axis title and the axis labels.
     *
     * @default 5
     */

    @Property(5)
    public titlePadding: number;

    /**
     * Options for customizing major tick lines on the axis.
     */

    @Complex<MajorTickLinesModel>({}, MajorTickLines)
    public majorTickLines: MajorTickLinesModel;

    /**
     * Options for customizing minor tick lines on the axis.
     */

    @Complex<MinorTickLinesModel>({}, MinorTickLines)
    public minorTickLines: MinorTickLinesModel;

    /**
     * Options for customizing major grid lines on the axis.
     */

    @Complex<MajorGridLinesModel>({}, MajorGridLines)
    public majorGridLines: MajorGridLinesModel;

    /**
     * Options for customizing minor grid lines on the axis.
     */

    @Complex<MinorGridLinesModel>({}, MinorGridLines)
    public minorGridLines: MinorGridLinesModel;

    /**
     * Options for customizing the axis lines.
     */

    @Complex<AxisLineModel>({}, AxisLine)
    public lineStyle: AxisLineModel;

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

    @Property(Browser.isDevice ? 'Rotate45' : 'Trim')
    public labelIntersectAction: LabelIntersectAction;

    /**
     * If set to true, the axis will be rendered in an inversed manner.
     *
     * @default false
     */
    @Property(false)
    public isInversed: boolean;

    /**
     * The `coefficient` value adjusts the size of the polar radar chart's radius. A higher value increases the radius size, while a smaller value decreases it.
     *
     * @default 100
     */

    @Property(100)
    public coefficient: number;

    /**
     * Specifies the start angle for the series in a polar or radar chart, measured in degrees from the horizontal axis, determining the initial angle from which the series begins.
     *
     * @default 0
     */

    @Property(0)
    public startAngle: number;

    /**
     * If set to true, the axis starts from zero.
     * If set to false, the axis starts from the minimum value of the data.
     *
     * @default true
     */
    @Property(true)
    public startFromZero: boolean;

    /**
     * A description for the axis that provides additional information about its content for screen readers.
     *
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * The `tabIndex` value for the axis, determining its position in the tab order.
     *
     * @default 2
     */
    @Property(2)
    public tabIndex: number;

    /**
     * Specifies the collection of strip lines for the axis, which are visual elements used to mark or highlight specific ranges.
     */
    @Collection<StripLineSettings>([], StripLineSettings)
    public stripLines: StripLineSettingsModel[];

    /**
     * Multi-level labels are used to display hierarchical or grouped labels on the axis, allowing for a more detailed and structured data representation.
     */
    @Collection<MultiLevelLabelsModel>([], MultiLevelLabels)
    public multiLevelLabels: MultiLevelLabelsModel[];

    /**
     * Configures the appearance of the border around multi-level labels, including the color, width, and type of the border.
     */
    @Complex<LabelBorderModel>({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    public border: LabelBorderModel;

    /**
     * Configures the scrollbar with options for customization, including appearance, behavior, and lazy loading settings.
     */
    @Complex<ScrollbarSettingsModel>({}, ScrollbarSettings)
    public scrollbarSettings: ScrollbarSettingsModel;

    /** @private */
    public visibleRange: VisibleRangeModel;
    /** @private */
    public visibleLabels: VisibleLabels[] = [];
    /** @private */
    public actualRange: VisibleRangeModel;
    /** @private */
    public series: Series[] = [];
    /** @private */
    public doubleRange: DoubleRange;
    /** @private */
    public maxLabelSize: Size;
    /** @private */
    public rotatedLabel: string;
    /** @private */
    public rect: Rect = new Rect(undefined, undefined, 0, 0);
    /** @private */
    public axisBottomLine: BorderModel = null;
    /** @private */
    public orientation: Orientation;
    /** @private */
    public intervalDivs: number[] = [10, 5, 2, 1];
    /** @private */
    public actualIntervalType: IntervalType;
    /** @private */
    public labels: string[];
    /** @private */
    public indexLabels: object;
    /** @private */
    public format: Function;
    /** @private */
    public baseModule: Double | DateTime | Category | DateTimeCategory;
    /** @private */
    public startLabel: string;
    /** @private */
    public endLabel: string;
    /** @private */
    public angle: number;
    /** @private */
    public dateTimeInterval: number;
    /** @private */
    public isStack100: boolean = false;
    /** @private */
    public crossInAxis: this;
    /** @private */
    public crossAt: number = null;
    /** @private */
    public updatedRect: Rect = null;
    /** @private */
    public multiLevelLabelHeight: number = 0;
    public zoomingScrollBar: ScrollBar;
    /** @private */
    public scrollBarHeight: number;
    /** @private */
    public isChart: boolean = true;
    /** @private */
    public maxPointLength: number;
    /** @private */
    public isIntervalInDecimal: boolean = true;
    /** @private */
    public titleCollection: string[] = [];
    /** @private */
    public titleSize: Size = new Size(0, 0);
    /** @private */
    public isAxisInverse: boolean;
    /** @private */
    public isAxisOpposedPosition: boolean;
    /**
     * Task: BLAZ-2044
     * This property used to hide the axis when series hide from legend click
     *
     * @private
     */
    public internalVisibility: boolean = true;
    /**
     * This property is used to place the vertical axis in opposed position and horizontal axis in inversed
     * when RTL is enabled in chart
     *
     * @private */
    public isRTLEnabled: boolean = false;

    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
        this.angle = this.labelRotation;
    }
    /**
     * The function used to find tick size.
     *
     * @param {Axis} crossAxis - The cross axis for which to find the tick size.
     * @returns {number} - The tick line size.
     * @private
     */
    public findTickSize(crossAxis: Axis): number {
        if (this.tickPosition === 'Inside') {
            return 0;
        }
        if (crossAxis && (!crossAxis.visibleRange || this.isInside(crossAxis.visibleRange))) {
            return 0;
        }
        return this.majorTickLines.height;
    }

    /**
     * The function used to find axis position.
     *
     * @returns {number}
     * @private
     */

    public isInside(range: VisibleRangeModel): boolean {
        return (inside(this.crossAt, range) ||
            (!this.isAxisOpposedPosition && this.crossAt >= range.max) || (this.isAxisOpposedPosition && this.crossAt <= range.min));
    }

    /**
     * The function used to find label Size.
     *
     * @param {Axis} crossAxis - The cross axis for which to find the label size.
     * @param {number} innerPadding - The inner padding.
     * @param {Row | Column} definition - The row or column definition.
     * @param {Chart} chart - The chart instance.
     * @returns {number} - The label size.
     * @private
     */
    public findLabelSize(crossAxis: Axis, innerPadding: number, definition: Row | Column, chart: Chart): number {
        let titleSize: number = 0; const isHorizontal: boolean = this.orientation === 'Horizontal';
        if (this.title) {
            const angle: number = this.titleRotation;
            if ((isNullOrUndefined(angle))) {
                this.titleSize = measureText(this.title, this.titleStyle, chart.themeStyle.axisTitleFont);
                titleSize = this.titleSize.height + innerPadding;
            }
            else {
                this.titleSize = rotateTextSize(this.titleStyle, this.title, angle, chart, chart.themeStyle.axisTitleFont);
                titleSize = (this.orientation === 'Vertical' ? this.titleSize.width : this.titleSize.height) + innerPadding;
            }
            if (this.rect.width || this.rect.height) {
                const length: number = isHorizontal ? this.rect.width : this.rect.height;
                this.titleCollection = getTitle(this.title, this.titleStyle, length, chart.enableRtl, chart.themeStyle.axisTitleFont);
                titleSize = (titleSize * this.titleCollection.length);
            }
        }
        let diff: number;
        let value: number;
        let labelSize: number = titleSize + innerPadding + this.titlePadding + this.labelPadding +
            ((this.orientation === 'Vertical') ? this.maxLabelSize.width : this.maxLabelSize.height) + this.multiLevelLabelHeight;
        if (crossAxis && this.placeNextToAxisLine) {
            const range: VisibleRangeModel = crossAxis.visibleRange;
            const size: number = (crossAxis.orientation === 'Horizontal') ? crossAxis.rect.width : crossAxis.rect.height;
            if (!range || !size) {
                return 0;
            } else if (this.isInside(range)) {
                value = this.findDifference(crossAxis);
                diff = (value) * (size / range.delta);
                diff = (value) * ((size - (diff < labelSize ? (labelSize - diff) : 0)) / range.delta);
                labelSize = (diff < labelSize) ? (labelSize - diff) : 0;
            }
        }
        if (this.isAxisOpposedPosition) {
            definition.insideFarSizes.push(labelSize);
        }
        else {
            definition.insideNearSizes.push(labelSize);
        }
        if (this.labelPosition === 'Inside') {
            return titleSize + innerPadding;
        }
        return labelSize;
    }
    /**
     * The function used to find axis position.
     *
     * @returns {void}
     * @private
     */
    public updateCrossValue(): void {
        let value: number = this.crossAt;
        if (value === null || !this.isInside(this.crossInAxis.visibleRange)) {
            this.updatedRect = this.rect;
            return null;
        }
        const range: VisibleRangeModel = this.crossInAxis.visibleRange;
        if (!this.isAxisOpposedPosition) {
            if (this.crossAt > range.max) {
                value = range.max;
            }
        } else {
            if (this.crossAt < range.min) {
                value = range.min;
            }
        }
        this.updatedRect = <Rect>extend({}, this.rect, null, true);
        if (this.orientation === 'Horizontal') {
            value = this.crossInAxis.rect.height - (valueToCoefficient(value, this.crossInAxis) * this.crossInAxis.rect.height);
            this.updatedRect.y = this.crossInAxis.rect.y + value;
        } else {
            value = valueToCoefficient(value, this.crossInAxis) * this.crossInAxis.rect.width;
            this.updatedRect.x = this.crossInAxis.rect.x + value;
        }
    }

    private findDifference(crossAxis: Axis): number {
        let value: number = 0;
        if (this.isAxisOpposedPosition) {
            value = crossAxis.isAxisInverse ? crossAxis.visibleRange.min : crossAxis.visibleRange.max;
        } else {
            value = crossAxis.isAxisInverse ? crossAxis.visibleRange.max : crossAxis.visibleRange.min;
        }
        return Math.abs(this.crossAt - value);
    }

    /**
     * Calculate the visible range for the axis.
     *
     * @returns {void}
     * @private
     */
    public calculateVisibleRangeOnZooming(): void {
        if (isZoomSet(this)) {
            const baseRange: VisibleRangeModel = this.actualRange;
            let start: number;
            let end: number;
            if (!this.isAxisInverse) {
                start = this.actualRange.min + this.zoomPosition * this.actualRange.delta;
                end = start + this.zoomFactor * this.actualRange.delta;
            } else {
                start = this.actualRange.max - (this.zoomPosition * this.actualRange.delta);
                end = start - (this.zoomFactor * this.actualRange.delta);
            }
            if (start < baseRange.min) {
                end = end + (baseRange.min - start);
                start = baseRange.min;
            }
            if (end > baseRange.max) {
                start = start - (end - baseRange.max);
                end = baseRange.max;
            }
            this.doubleRange = new DoubleRange(start, end);
            this.visibleRange = { min: this.doubleRange.start, max : this.doubleRange.end,
                delta: this.doubleRange.delta, interval : this.visibleRange.interval };
        }
    }

    /**
     * Triggers the event.
     *
     * @returns {void}
     * @private
     */

    public triggerRangeRender(chart: Chart, minimum: number, maximum: number, interval: number): void {
        const argsData: IAxisRangeCalculatedEventArgs = {
            cancel: false, name: axisRangeCalculated, axis: this,
            minimum: minimum, maximum: maximum, interval: interval
        };
        chart.trigger(axisRangeCalculated, argsData);
        if (!argsData.cancel) {
            this.visibleRange = { min: argsData.minimum, max: argsData.maximum, interval: argsData.interval,
                delta : argsData.maximum - argsData.minimum };
        }
    }

    /**
     * Calculate padding for the axis.
     *
     * @returns {string}
     * @private
     */

    public getRangePadding(chart: Chart): string {
        let padding: string = this.rangePadding;
        if (padding !== 'Auto') {
            return padding;
        }
        switch (this.orientation) {
        case 'Horizontal':
            if (chart.requireInvertedAxis) {
                padding = (this.isStack100 || this.baseModule.chart.stockChart ? 'Round' : 'Normal');
            } else {
                padding = 'None';
            }
            break;
        case 'Vertical':
            if (!chart.requireInvertedAxis) {
                padding = (this.isStack100 || this.baseModule.chart.stockChart ? 'Round' : 'Normal');
            } else {
                padding = 'None';
            }
            break;
        }
        return padding;
    }

    /**
     * Calculate maximum label width for the axis.
     *
     * @param {Chart} chart - The chart for which to calculate the maximum label width.
     * @returns {void}
     * @private
     */
    public getMaxLabelWidth(chart: Chart): void {
        let pointX: number; let previousEnd: number = 0;
        let isIntersect: boolean = false; let isAxisLabelBreak: boolean;
        this.angle = this.labelRotation; this.maxLabelSize = new Size(0, 0);
        const action: LabelIntersectAction = this.labelIntersectAction; let label: VisibleLabels;
        for (let i: number = 0, len: number = this.visibleLabels.length; i < len; i++) {
            label = this.visibleLabels[i as number];
            isAxisLabelBreak = isBreakLabel(label.originalText);
            if (isAxisLabelBreak) {
                label.size = measureText(label.originalText.replace(/<br>/g, ' '), this.labelStyle, chart.themeStyle.axisLabelFont);
                label.breakLabelSize = measureText(
                    this.enableTrim ? (<string[]>label.text).join('<br>') : label.originalText, this.labelStyle, chart.themeStyle.axisLabelFont
                );
            } else {
                if ((this.angle === -90 || this.angle === 90 || this.angle === 270 || this.angle === -270) && this.orientation === 'Vertical') {
                    label.size = rotateTextSize(this.labelStyle, <string>label.text, this.angle, chart, chart.themeStyle.axisLabelFont);
                } else {
                    label.size = measureText(<string>label.text, this.labelStyle, chart.themeStyle.axisLabelFont);
                }
            }
            const width: number = isAxisLabelBreak ? label.breakLabelSize.width : label.size.width;
            if (width > this.maxLabelSize.width) {
                this.maxLabelSize.width = width;
                this.rotatedLabel = <string>label.text;
            }
            const height: number = isAxisLabelBreak ? label.breakLabelSize.height : label.size.height;
            if (height > this.maxLabelSize.height) {
                this.maxLabelSize.height = height;
            }
            if (isAxisLabelBreak) {
                label.text = this.enableTrim ? label.text : label.originalText.split('<br>');
            }
            if (action === 'None' || action === 'Hide' || action === 'Trim') {
                continue;
            }
            if ((<LabelIntersectAction>action !== 'None' || this.angle % 360 === 0) && this.orientation === 'Horizontal' &&
                this.rect.width > 0 && !isIntersect) {
                const width1: number = isAxisLabelBreak ? label.breakLabelSize.width : label.size.width;

                pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
                pointX -= width1 / 2;
                if (this.edgeLabelPlacement === 'Shift') {
                    if (i === 0 && pointX < this.rect.x) {
                        pointX = this.rect.x;
                    }
                    if (i === this.visibleLabels.length - 1 && ((pointX + width1) > (this.rect.x + this.rect.width))) {
                        pointX = this.rect.x + this.rect.width - width1;
                    }
                }
                switch (action) {
                case 'MultipleRows':
                    if (i > 0) {
                        this.findMultiRows(i, pointX, label, isAxisLabelBreak);
                    }
                    break;
                case 'Rotate45':
                case 'Rotate90':
                    if (i > 0 && (!this.isAxisInverse ? pointX <= previousEnd : pointX + width1 >= previousEnd)) {
                        this.angle = (action === 'Rotate45') ? 45 : 90;
                        isIntersect = true;
                    }
                    break;
                default: {
                    if (isAxisLabelBreak) {
                        let result: string[]; const result1: string[] = []; let str: string;
                        for (let index: number = 0; index < label.text.length; index++) {
                            result = textWrap(
                                label.text[index as number],
                                this.rect.width / this.visibleLabels.length, this.labelStyle, chart.enableRtl,
                                null, null, chart.themeStyle.axisLabelFont);
                            if (result.length > 1) {
                                for (let j: number = 0; j < result.length; j++) {
                                    str = result[j as number]; result1.push(str);
                                }
                            } else {
                                result1.push(result[0]);
                            }
                        }
                        label.text = result1;
                    } else {
                        label.text = textWrap(
                                <string>label.text,
                                this.rect.width / this.visibleLabels.length, this.labelStyle, chart.enableRtl,
                                null, null, chart.themeStyle.axisLabelFont
                        );
                    }
                    const height: number = (label.size.height * label.text.length);
                    if (height > this.maxLabelSize.height) {
                        this.maxLabelSize.height = height;
                    }
                    break;
                }
                }
                previousEnd = this.isAxisInverse ? pointX : pointX + width1;
            }
        }
        if (this.angle !== 0 && this.orientation === 'Horizontal') {
            //I264474: Fix for datasource bind im mounted console error ocurred
            this.rotatedLabel = isNullOrUndefined(this.rotatedLabel) ? '' : this.rotatedLabel;
            const isHorizontalAngle: boolean = this.angle === -360 || this.angle === 0 || this.angle === -180 ||
                this.angle === 180 || this.angle === 360;
            // To avoid overlap axis label with chart title or chart legend when it is outside.
            if (this.labelPosition === 'Outside' && !isHorizontalAngle && isBreakLabel(this.rotatedLabel)) {
                this.maxLabelSize = new Size(this.maxLabelSize.height, this.maxLabelSize.width);
            } else {
                this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart, chart.themeStyle.axisLabelFont);
            }
        } else if (this.angle !== 0 && this.orientation === 'Vertical') {
            //I264474: Fix for datasource bind im mounted console error ocurred
            this.rotatedLabel = isNullOrUndefined(this.rotatedLabel) ? '' : this.rotatedLabel;
            const isHorizontalAngle: boolean = this.angle === -360 || this.angle === 0 || this.angle === -180 ||
                this.angle === 180 || this.angle === 360;
            // To avoid overlap axis label with chart title or chart legend when it is outside.
            if (this.labelPosition === 'Outside' && !isHorizontalAngle && isBreakLabel(this.rotatedLabel)) {
                this.maxLabelSize = new Size(this.maxLabelSize.height, this.maxLabelSize.width);
            } else {
                this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart, chart.themeStyle.axisLabelFont);
            }
        }
        if (chart.multiLevelLabelModule && this.multiLevelLabels.length > 0) {
            chart.multiLevelLabelModule.getMultilevelLabelsHeight(this);
        }
    }

    /**
     * Finds the multiple rows for axis.
     *
     * @returns {void}
     */

    private findMultiRows(length: number, currentX: number, currentLabel: VisibleLabels, isBreakLabels: boolean): void {
        let label: VisibleLabels;
        let pointX: number;  let width2: number;
        const store: number[] = [];
        let isMultiRows: boolean;
        for (let i: number = length - 1; i >= 0; i--) {
            label = this.visibleLabels[i as number];
            width2 = isBreakLabels ? label.breakLabelSize.width : label.size.width;
            pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
            isMultiRows = !this.isAxisInverse ? currentX < (pointX + width2 * 0.5) :
                currentX + currentLabel.size.width > (pointX - width2 * 0.5);
            if (isMultiRows) {
                store.push(label.index);
                currentLabel.index = (currentLabel.index > label.index) ? currentLabel.index : label.index + 1;
            } else {
                currentLabel.index = store.indexOf(label.index) > - 1 ? currentLabel.index : label.index;
            }
        }
        const height: number = ((isBreakLabels ? currentLabel.breakLabelSize.height : currentLabel.size.height) * currentLabel.index) +
            (5 * (currentLabel.index - 1));
        if (height > this.maxLabelSize.height) {
            this.maxLabelSize.height = height;
        }
    }

    /**
     * Finds the default module for axis.
     *
     * @returns {void}
     * @private
     */

    public getModule(chart: Chart): void {
        if (this.valueType === 'Double') {
            this.baseModule = new Double(chart);
        } else {
            this.baseModule = chart[firstToLowerCase(this.valueType) + 'Module'];
        }
    }

    /**
     * Set the axis `opposedPosition` and `isInversed` properties.
     *
     * @param {boolean} isPolar - Indicates whether the axis is polar or not.
     * @returns {void}
     * @private
     */
    public setIsInversedAndOpposedPosition(isPolar: boolean = false): void {
        this.isAxisOpposedPosition = this.opposedPosition || (!isPolar && this.isRTLEnabled && this.orientation === 'Vertical');
        if (this.opposedPosition && (!isPolar && this.isRTLEnabled && this.orientation === 'Vertical')) {
            this.isAxisOpposedPosition = false;
        }
        this.isAxisInverse = this.isInversed || (this.isRTLEnabled && this.orientation === 'Horizontal');
        if (this.isInversed && (!isPolar && this.isRTLEnabled && this.orientation === 'Horizontal')) {
            this.isAxisInverse = false;
        }
    }

    /**
     * Updates the axis within the chart.
     *
     * @returns {void}
     * @private
     */
    public updateAxis(): void {
        const chart: Chart = this.baseModule.chart;
        const chartAxisLayoutPanel: CartesianAxisLayoutPanel = chart.chartAxisLayoutPanel as CartesianAxisLayoutPanel;
        const index: number = chart.axisCollections.indexOf(this);
        const axisElement: Element = getElement(chart.element.id + 'AxisInsideCollection');
        const axisLineElement: Element = getElement(chart.element.id + 'AxisOutsideCollection');
        chartAxisLayoutPanel.element = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + index + 'Inside' });
        const outsideElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + index + 'Outside' });
        const isInside: boolean = chartAxisLayoutPanel.findAxisPosition(this);
        chartAxisLayoutPanel.drawAxis(this, index, isInside, outsideElement, axisElement, axisLineElement);
        if (!chart.enableCanvas) {
            appendChildElement(chart.enableCanvas, axisElement, chartAxisLayoutPanel.element, chart.redraw);
        }
    }
}

/** @private */
export class VisibleLabels {

    public text: string | string[];

    public value: number;

    public labelStyle: FontModel;

    public size: Size;

    public breakLabelSize: Size;

    public index: number;

    public originalText: string;

    constructor(
        text: string | string[], value: number, labelStyle: FontModel,
        originalText: string | string[], size: Size = new Size(0, 0),
        breakLabelSize: Size = new Size(0, 0), index: number = 1
    ) {
        this.text = text;
        this.originalText = <string>originalText;
        this.value = value;
        this.labelStyle = labelStyle;
        this.size = size;
        this.breakLabelSize = breakLabelSize;
        this.index = index;
    }
}
