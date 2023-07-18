/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { Property, Complex, ChildProperty, Collection, extend, Browser } from '@syncfusion/ej2-base';
import { FontModel, BorderModel } from '../../common/model/base-model';
import { Font, Border } from '../../common/model/base';
import { Orientation, ChartRangePadding, SkeletonType, AxisPosition } from '../utils/enum';
import { EdgeLabelPlacement, ValueType, IntervalType, LabelPlacement, LabelIntersectAction } from '../utils/enum';
import { rotateTextSize, firstToLowerCase, valueToCoefficient, inside, isBreakLabel, isZoomSet, getTitle } from '../../common/utils/helper';
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
import { Theme } from '../../common/model/theme';
import { TextAlignment } from '../../common/utils/enum';
import { IAxisRangeCalculatedEventArgs } from '../../chart/model/chart-interface';
import { axisRangeCalculated } from '../../common/model/constants';
import { StripLineSettings, MultiLevelLabels, LabelBorder, ScrollbarSettings } from '../model/chart-base';
import { StripLineSettingsModel, MultiLevelLabelsModel, LabelBorderModel, ScrollbarSettingsModel} from '../model/chart-base-model';
import { textWrap } from '../../common/utils/helper';
import { ScrollBar } from '../../common/scrollbar/scrollbar';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Configures the `rows` of the chart.
 */

export class Row extends ChildProperty<Row> {

    /**
     * The height of the row as a string accept input both as '100px' and '100%'.
     * If specified as '100%, row renders to the full height of its chart.
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
     * Measure the row size
     *
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
 * Configures the `columns` of the chart.
 */

export class Column extends ChildProperty<Column> {

    /**
     * The width of the column as a string accepts input both as like '100px' or '100%'.
     * If specified as '100%, column renders to the full width of its chart.
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
 * Configures the major grid lines in the `axis`.
 */
export class MajorGridLines extends ChildProperty<MajorGridLines> {

    /**
     * The width of the line in pixels.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The dash array of the grid lines.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * The color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the minor grid lines in the `axis`.
 */
export class MinorGridLines extends ChildProperty<MinorGridLines> {

    /**
     * The width of the line in pixels.
     *
     * @default 0.7
     */

    @Property(0.7)
    public width: number;

    /**
     * The dash array of grid lines.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the axis line of a chart.
 */
export class AxisLine extends ChildProperty<AxisLine> {

    /**
     * The width of the line in pixels.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The dash array of the axis line.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * The color of the axis line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the major tick lines.
 */
export class MajorTickLines extends ChildProperty<MajorTickLines> {

    /**
     * The width of the tick lines in pixels.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The height of the ticks in pixels.
     *
     * @default 5
     */

    @Property(5)
    public height: number;

    /**
     * The color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the minor tick lines.
 */
export class MinorTickLines extends ChildProperty<MinorTickLines> {

    /**
     * The width of the tick line in pixels.
     *
     * @default 0.7
     */

    @Property(0.7)
    public width: number;

    /**
     * The height of the ticks in pixels.
     *
     * @default 5
     */

    @Property(5)
    public height: number;
    /**
     * The color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;
}
/**
 * Configures the crosshair ToolTip.
 */
export class CrosshairTooltip extends ChildProperty<CrosshairTooltip> {

    /**
     * If set to true, crosshair ToolTip will be visible.
     *
     *  @default false
     */

    @Property(false)
    public enable: Boolean;

    /**
     * The fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Options to customize the crosshair ToolTip text.
     */

    @Complex<FontModel>({fontFamily: null, size: "12px", fontStyle: 'Normal', fontWeight: '400', color: null}, Font)
    public textStyle: FontModel;

}

/**
 * Configures the axes in the chart.
 *
 * @public
 */

export class Axis extends ChildProperty<Axis> {
    /**
     * Options to customize the axis label.
     */

    @Complex<FontModel>({fontFamily: null, size: "12px", fontStyle: 'Normal', fontWeight: '400', color: null}, Font)
    public labelStyle: FontModel;

    /**
     * Options to customize the crosshair ToolTip.
     */

    @Complex<CrosshairTooltipModel>({}, CrosshairTooltip)
    public crosshairTooltip: CrosshairTooltipModel;

    /**
     * Specifies the title of an axis.
     *
     * @default ''
     */

    @Property('')
    public title: string;

    /**
     * Options for customizing the axis title.
     */

    @Complex<FontModel>({fontFamily: null, size: "14px", fontStyle: 'Normal', fontWeight: '600', color: null}, Font)
    public titleStyle: FontModel;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     *
     * @default ''
     */

    @Property('')
    public labelFormat: string;

    /**
     * Specifies the skeleton format in which the dateTime format will process.
     *
     * @default ''
     */

    @Property('')
    public skeleton: string;

    /**
     * It specifies the type of format to be used in dateTime format process.
     *
     * @default 'DateTime'
     * @deprecated
     */

    @Property('DateTime')
    public skeletonType: SkeletonType;

    /**
     * It specifies alignment of the line break labels.
     *
     * @default 'Center'
     */

    @Property('Center')
    public lineBreakAlignment: TextAlignment;

    /**
     * Left and right padding for the plot area in pixels.
     *
     * @default 0
     */

    @Property(0)
    public plotOffset: number;

    /**
     * Left padding for the plot area in pixels.
     *
     * @default null
     */

    @Property(null)
    public plotOffsetLeft: number;

    /**
     * Top padding for the plot area in pixels.
     *
     * @default null
     */

    @Property(null)
    public plotOffsetTop: number;

    /**
     * Right padding for the plot area in pixels.
     *
     * @default null
     */

    @Property(null)
    public plotOffsetRight: number;

    /**
     * Bottom padding for the plot area in pixels.
     *
     * @default null
     */

    @Property(null)
    public plotOffsetBottom: number;
    /**
     * Specifies indexed category  axis.
     *
     * @default false
     */

    @Property(false)
    public isIndexed: boolean;

    /**
     * The base value for logarithmic axis. It requires `valueType` to be `Logarithmic`.
     *
     * @default 10
     */
    @Property(10)
    public logBase: number;

    /**
     * Specifies the index of the column where the axis is associated,
     * when the chart area is divided into multiple plot areas by using `columns`.
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
     *                columnIndex: 1,
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
     * Specifies the index of the row where the axis is associated, when the chart area is divided into multiple plot areas by using `rows`.
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
     *                rowIndex: 1,
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
     * Specifies the number of `columns` or `rows` an axis has to span horizontally or vertically.
     *
     * @default 1
     */

    @Property(1)
    public span: number;

    /**
     * With this property, you can request axis to calculate intervals approximately equal to your specified interval.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public desiredIntervals: number;

    /**
     * The maximum number of label count per 100 pixels with respect to the axis length.
     *
     * @default 3
     */

    @Property(3)
    public maximumLabels: number;

    /**
     * The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.
     *
     * @default 1
     */

    @Property(1)
    public zoomFactor: number;

    /**
     * Position of the zoomed axis. Value ranges from 0 to 1.
     *
     * @default 0
     */

    @Property(0)
    public zoomPosition: number;

    /**
     * Enables the scrollbar for zooming.
     *
     * @default true
     */
    @Property(true)
    public enableScrollbarOnZooming: boolean;

    /**
     * If set to true, the axis will render at the opposite side of its default position.
     *
     * @default false
     */

    @Property(false)
    public opposedPosition: boolean;

    /**
     * If set to true, axis interval will be calculated automatically with respect to the zoomed range.
     *
     * @default true
     */

    @Property(true)
    public enableAutoIntervalOnZooming: boolean;

    /**
     * Specifies the padding for the axis range in terms of interval.They are,
     * * none: Padding cannot be applied to the axis.
     * * normal: Padding is applied to the axis based on the range calculation.
     * * additional: Interval of the axis is added as padding to the minimum and maximum values of the range.
     * * round: Axis range is rounded to the nearest possible value divided by the interval.
     *
     * @default 'Auto'
     */

    @Property('Auto')
    public rangePadding: ChartRangePadding;

    /**
     * Specifies the type of data the axis is handling.
     * * Double:  Renders a numeric axis.
     * * DateTime: Renders a dateTime axis.
     * * Category: Renders a category axis.
     * * Logarithmic: Renders a log axis.
     *
     * @default 'Double'
     * @blazorType Syncfusion.EJ2.Blazor.Charts.ValueType
     * @isEnumeration true
     */

    @Property('Double')
    public valueType: ValueType;


    /**
     * Specifies the position of labels at the edge of the axis.They are,
     * * None: No action will be performed.
     * * Hide: Edge label will be hidden.
     * * Shift: Shifts the edge labels.
     *
     * @default 'None'
     */

    @Property('None')
    public edgeLabelPlacement: EdgeLabelPlacement;

    /**
     * Specifies the types like `Years`, `Months`, `Days`, `Hours`, `Minutes`, `Seconds` in date time axis.They are,
     * * Auto: Defines the interval of the axis based on data.
     * * Years: Defines the interval of the axis in years.
     * * Months: Defines the interval of the axis in months.
     * * Days: Defines the interval of the axis in days.
     * * Hours: Defines the interval of the axis in hours.
     * * Minutes: Defines the interval of the axis in minutes.
     *
     * @default 'Auto'
     */

    @Property('Auto')
    public intervalType: IntervalType;

    /**
     * Specifies the placement of a label for category axis. They are,
     * * betweenTicks: Renders the label between the ticks.
     * * onTicks: Renders the label on the ticks.
     *
     * @default 'BetweenTicks'
     */

    @Property('BetweenTicks')
    public labelPlacement: LabelPlacement;
    /**
     * Specifies the placement of a ticks to the axis line. They are,
     * * inside: Renders the ticks inside to the axis line.
     * * outside: Renders the ticks outside to the axis line.
     *
     * @default 'Outside'
     */

    @Property('Outside')
    public tickPosition: AxisPosition;

    /**
     * Specifies the placement of a labels to the axis line. They are,
     * * inside: Renders the labels inside to the axis line.
     * * outside: Renders the labels outside to the axis line.
     *
     * @default 'Outside'
     */

    @Property('Outside')
    public labelPosition: AxisPosition;
    /**
     * Unique identifier of an axis.
     * To associate an axis with the series, set this name to the xAxisName/yAxisName properties of the series.
     *
     * @default ''
     */

    @Property('')
    public name: string;

    /**
     * If set to true, axis label will be visible.
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
     * Defines an angle to rotate axis title. By default, angle auto calculated based on position and orientation of axis.
     *
     * @default null
     */

    @Property(null)
    public titleRotation: number;

    /**
     * Specifies the value at which the axis line has to be intersect with the vertical axis or vice versa.
     *
     * @default null
     */

    @Property(null)
    public crossesAt: Object;

    /**
     * Specifies whether axis elements like axis labels, axis title, etc has to be crossed with axis line.
     *
     * @default true
     */

    @Property(true)
    public placeNextToAxisLine: boolean;

    /**
     * Specifies axis name with which the axis line has to be crossed.
     *
     * @default null
     */

    @Property(null)
    public crossesInAxis: string;

    /**
     * Specifies the minimum range of an axis.
     *
     * @default null
     */

    @Property(null)
    public minimum: Object;

    /**
     * Specifies the maximum range of an axis.
     *
     * @default null
     */

    @Property(null)
    public maximum: Object;

    /**
     * Specifies the interval for an axis.
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
     * Specifies the Trim property for an axis.
     *
     * @default false
     */
    @Property(false)
    public enableTrim: boolean;

    /**
     * Specifies the labelPadding from axis.
     *
     * @default 5
     */

    @Property(5)
    public labelPadding: number;

    /**
     * Specifies the titlePadding from axis label.
     *
     * @default 5
     */

    @Property(5)
    public titlePadding: number;

    /**
     * Options for customizing major tick lines.
     */

    @Complex<MajorTickLinesModel>({}, MajorTickLines)
    public majorTickLines: MajorTickLinesModel;

    /**
     * Options for customizing minor tick lines.
     */

    @Complex<MinorTickLinesModel>({}, MinorTickLines)
    public minorTickLines: MinorTickLinesModel;

    /**
     * Options for customizing major grid lines.
     */

    @Complex<MajorGridLinesModel>({}, MajorGridLines)
    public majorGridLines: MajorGridLinesModel;

    /**
     * Options for customizing minor grid lines.
     */

    @Complex<MinorGridLinesModel>({}, MinorGridLines)
    public minorGridLines: MinorGridLinesModel;

    /**
     * Options for customizing axis lines.
     */

    @Complex<AxisLineModel>({}, AxisLine)
    public lineStyle: AxisLineModel;

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
     *
     * @default Trim
     */

    @Property(Browser.isDevice ? 'Rotate45' : 'Trim')
    public labelIntersectAction: LabelIntersectAction;

    /**
     * It specifies whether the axis to be rendered in inversed manner or not.
     *
     * @default false
     */
    @Property(false)
    public isInversed: boolean;

    /**
     * The polar radar radius position.
     *
     * @default 100
     */

    @Property(100)
    public coefficient: number;

    /**
     * The start angle for the series.
     *
     * @default 0
     */

    @Property(0)
    public startAngle: number;

    /**
     * It specifies whether the axis to be start from zero.
     *
     * @default true
     */
    @Property(true)
    public startFromZero: boolean;

    /**
     * Description for axis and its element.
     *
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for the axis.
     *
     * @default 2
     */
    @Property(2)
    public tabIndex: number;
    /**
     * Specifies the stripLine collection for the axis.
     */
    @Collection<StripLineSettings>([], StripLineSettings)
    public stripLines: StripLineSettingsModel[];
    /**
     * Specifies the multi level labels collection for the axis.
     */
    @Collection<MultiLevelLabelsModel>([], MultiLevelLabels)
    public multiLevelLabels: MultiLevelLabelsModel[];

    /**
     * Border of the multi level labels.
     */
    @Complex<LabelBorderModel>({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    public border: LabelBorderModel;

    /**
     * Option to customize scrollbar with lazy loading.
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
        this.angle = this.labelRotation;
    }
    /**
     * The function used to find tick size.
     *
     * @returns {number} tick line size
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
     * @returns {number} labelSize
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
                this.titleSize = rotateTextSize(this.titleStyle, this.title, angle, chart);
                titleSize = (this.orientation === 'Vertical' ? this.titleSize.width : this.titleSize.height) + innerPadding;
            }
            if (this.rect.width || this.rect.height) {
                const length: number = isHorizontal ? this.rect.width : this.rect.height;
                this.titleCollection = getTitle(this.title, this.titleStyle, length, chart.themeStyle.legendLabelFont);
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
     * Calculate visible range for axis.
     *
     * @returns {void}
     * @private
     */
    public calculateVisibleRangeOnZooming(size: Size): void {
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
                label.size = measureText(<string>label.text, this.labelStyle, chart.themeStyle.axisLabelFont);
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
                default:
                    if (isAxisLabelBreak) {
                        let result: string[]; const result1: string[] = []; let str: string;
                        for (let index: number = 0; index < label.text.length; index++) {
                            result = textWrap(
                                label.text[index as number],
                                this.rect.width / this.visibleLabels.length, this.labelStyle, null, null, chart.themeStyle.axisLabelFont);
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
                                this.rect.width / this.visibleLabels.length, this.labelStyle, null, null, chart.themeStyle.axisLabelFont
                        );
                    }
                    // eslint-disable-next-line no-case-declarations
                    const height: number = (label.size.height * label.text.length);
                    if (height > this.maxLabelSize.height) {
                        this.maxLabelSize.height = height;
                    }
                    break;
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
            } else if (!chart.stockChart) {
                this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart);
            }
        } else if (this.angle !== 0 && this.orientation === 'Vertical') {
            //I264474: Fix for datasource bind im mounted console error ocurred
            this.rotatedLabel = isNullOrUndefined(this.rotatedLabel) ? '' : this.rotatedLabel;
            const isHorizontalAngle: boolean = this.angle === -360 || this.angle === 0 || this.angle === -180 ||
                this.angle === 180 || this.angle === 360;
            // To avoid overlap axis label with chart title or chart legend when it is outside.
            if (this.labelPosition === 'Outside' && !isHorizontalAngle && isBreakLabel(this.rotatedLabel)) {
                this.maxLabelSize = new Size(this.maxLabelSize.height, this.maxLabelSize.width);
            } else if (!chart.stockChart) {
                this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart);
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
     * @returns {void}
     * @private
     */
    public setIsInversedAndOpposedPosition(isPolar: boolean = false): void {
        this.isAxisOpposedPosition = this.opposedPosition || (!isPolar && this.isRTLEnabled && this.orientation === 'Vertical');
        this.isAxisInverse = this.isInversed || (this.isRTLEnabled && this.orientation === 'Horizontal');
    }
}
/**
 * Axis visible range
 *
 * @public
 */
export interface VisibleRangeModel {
    /** axis minimum value. */
    min?: number;
    /** axis maximum value. */
    max?: number;
    /** axis interval value. */
    interval?: number;
    /** axis delta value. */
    delta?: number;
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
