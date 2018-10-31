import { Property, Complex, ChildProperty, Collection, extend } from '@syncfusion/ej2-base';
import { FontModel, BorderModel } from '../../common/model/base-model';
import { Font, Border } from '../../common/model/base';
import { Orientation, ChartRangePadding, SkeletonType, AxisPosition } from '../utils/enum';
import { EdgeLabelPlacement, ValueType, IntervalType, LabelPlacement, LabelIntersectAction } from '../utils/enum';
import { Size, Rect, measureText, rotateTextSize, firstToLowerCase, valueToCoefficient, inside } from '../../common/utils/helper';
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
import { IAxisRangeCalculatedEventArgs } from '../../common/model/interface';
import { axisRangeCalculated } from '../../common/model/constants';
import { StripLineSettings, MultiLevelLabels, LabelBorder } from '../model/chart-base';
import { StripLineSettingsModel, MultiLevelLabelsModel, LabelBorderModel } from '../model/chart-base-model';
import { textWrap } from '../../common/utils/helper';
import { ScrollBar } from '../../common/scrollbar/scrollbar';


const axisPadding: number = 10;

/**   
 * Configures the `rows` of the chart.    
 */

export class Row extends ChildProperty<Row> {

    /**
     * The height of the row as a string accept input both as '100px' and '100%'.
     * If specified as '100%, row renders to the full height of its chart.
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
    /**
     * Measure the row size
     * @return {void}
     * @private
     */
    public computeSize(axis: Axis, clipRect: Rect, scrollBarHeight: number): void {
        let width: number = 0;
        let innerPadding: number = 5;
        if (axis.visible) {
            width += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding) + axis.lineStyle.width / 2);
        }

        if (axis.opposedPosition) {
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
    private padding: number = 0;

    /**
     * Measure the column size
     * @return {void}
     * @private
     */

    public computeSize(axis: Axis, clipRect: Rect, scrollBarHeight: number ): void {
        let height: number = 0;
        let innerPadding: number = 5;
        if (axis.visible) {
            height += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding) + axis.lineStyle.width / 2);
        }
        if (axis.opposedPosition) {
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
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The dash array of the grid lines.
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * The color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
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
     * @default 0.7
     */

    @Property(0.7)
    public width: number;

    /**
     * The dash array of grid lines.
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
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
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The dash array of the axis line.
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * The color of the axis line that accepts value in hex and rgba as a valid CSS color string.
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
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The height of the ticks in pixels.
     * @default 5
     */

    @Property(5)
    public height: number;

    /**
     * The color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
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
     * @default 0.7
     */

    @Property(0.7)
    public width: number;

    /**
     * The height of the ticks in pixels.
     * @default 5
     */

    @Property(5)
    public height: number;
    /**
     * The color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
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
     *  @default false
     */

    @Property(false)
    public enable: Boolean;

    /**
     * The fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Options to customize the crosshair ToolTip text.
     */

    @Complex<FontModel>(Theme.crosshairLabelFont, Font)
    public textStyle: FontModel;

}

/**
 * Configures the axes in the chart.
 */

export class Axis extends ChildProperty<Axis> {
    /**
     * Options to customize the axis label.
     */

    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public labelStyle: FontModel;

    /**
     * Options to customize the crosshair ToolTip.
     */

    @Complex<CrosshairTooltipModel>({}, CrosshairTooltip)
    public crosshairTooltip: CrosshairTooltipModel;

    /**
     * Specifies the title of an axis.
     * @default ''
     */

    @Property('')
    public title: string;

    /**
     * Options for customizing the axis title.
     */

    @Complex<FontModel>(Theme.axisTitleFont, Font)
    public titleStyle: FontModel;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */

    @Property('')
    public labelFormat: string;

    /**
     * Specifies the skeleton format in which the dateTime format will process.
     * @default ''
     */

    @Property('')
    public skeleton: string;

    /**
     * It specifies the type of format to be used in dateTime format process.
     * @default 'DateTime'
     */

    @Property('DateTime')
    public skeletonType: SkeletonType;

    /**
     * Left and right padding for the plot area in pixels.
     * @default 0
     */

    @Property(0)
    public plotOffset: number;

    /**
     * Specifies indexed category  axis.
     * @default false
     */

    @Property(false)
    public isIndexed: boolean;

    /**
     * The base value for logarithmic axis. It requires `valueType` to be `Logarithmic`.
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
     * @default 0
     */

    @Property(0)
    public rowIndex: number;


    /**
     * Specifies the number of `columns` or `rows` an axis has to span horizontally or vertically.
     * @default 1
     */

    @Property(1)
    public span: number;

    /**
     * With this property, you can request axis to calculate intervals approximately equal to your specified interval.
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public desiredIntervals: number;

    /**
     * The maximum number of label count per 100 pixels with respect to the axis length.
     * @default 3
     */

    @Property(3)
    public maximumLabels: number;

    /**
     * The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.
     * @default 1
     */

    @Property(1)
    public zoomFactor: number;

    /**
     * Position of the zoomed axis. Value ranges from 0 to 1.
     * @default 0
     */

    @Property(0)
    public zoomPosition: number;

    /**
     * If set to true, the axis will render at the opposite side of its default position.
     * @default false
     */

    @Property(false)
    public opposedPosition: boolean;

    /**
     * If set to true, axis interval will be calculated automatically with respect to the zoomed range.
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
     * @default 'Double'
     */

    @Property('Double')
    public valueType: ValueType;


    /**
     * Specifies the position of labels at the edge of the axis.They are,
     * * None: No action will be performed.
     * * Hide: Edge label will be hidden.
     * * Shift: Shifts the edge labels.
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
     * @default 'Auto'
     */

    @Property('Auto')
    public intervalType: IntervalType;

    /**
     * Specifies the placement of a label for category axis. They are,
     * * betweenTicks: Renders the label between the ticks.
     * * onTicks: Renders the label on the ticks.
     * @default 'BetweenTicks'
     */

    @Property('BetweenTicks')
    public labelPlacement: LabelPlacement;
    /**
     * Specifies the placement of a ticks to the axis line. They are,
     * * inside: Renders the ticks inside to the axis line.
     * * outside: Renders the ticks outside to the axis line.
     * @default 'Outside'
     */

    @Property('Outside')
    public tickPosition: AxisPosition;

    /**
     * Specifies the placement of a labels to the axis line. They are,
     * * inside: Renders the labels inside to the axis line.
     * * outside: Renders the labels outside to the axis line.
     * @default 'Outside'
     */

    @Property('Outside')
    public labelPosition: AxisPosition;
    /**
     * Unique identifier of an axis.
     * To associate an axis with the series, set this name to the xAxisName/yAxisName properties of the series.
     * @default ''
     */

    @Property('')
    public name: string;

    /**
     * If set to true, axis label will be visible.
     * @default true
     */

    @Property(true)
    public visible: boolean;

    /**
     * Specifies the number of minor ticks per interval.
     * @default 0
     */

    @Property(0)
    public minorTicksPerInterval: number;

    /**
     * The angle to which the axis label gets rotated.
     * @default 0
     */

    @Property(0)
    public labelRotation: number;

    /**
     * Specifies the value at which the axis line has to be intersect with the vertical axis or vice versa.
     * @default null
     */

    @Property(null)
    public crossesAt: Object;

    /**
     * Specifies whether axis elements like axis labels, axis title, etc has to be crossed with axis line
     * @default true
     */

    @Property(true)
    public placeNextToAxisLine: boolean;

    /**
     * Specifies axis name with which the axis line has to be crossed
     * @default null
     */

    @Property(null)
    public crossesInAxis: string;

    /**
     * Specifies the minimum range of an axis.
     * @default null
     */

    @Property(null)
    public minimum: Object;

    /**
     * Specifies the maximum range of an axis.
     * @default null
     */

    @Property(null)
    public maximum: Object;

    /**
     * Specifies the interval for an axis.
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public interval: number;

    /**
     * Specifies the maximum width of an axis label.
     * @default 34.
     */
    @Property(34)
    public maximumLabelWidth: number;

    /**
     * Specifies the Trim property for an axis.
     * @default false
     */
    @Property(false)
    public enableTrim: boolean;

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
     * Specifies the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Rotate90: Rotates the label to 90 degree when it intersects.
     * @default Hide
     */

    @Property('Trim')
    public labelIntersectAction: LabelIntersectAction;

    /**
     * It specifies whether the axis to be rendered in inversed manner or not.
     * @default false
     */
    @Property(false)
    public isInversed: boolean;

    /**
     * The polar radar radius position.
     * @default 100
     */

    @Property(100)
    public coefficient: number;

    /**
     * The start angle for the series.
     * @default 0
     */

    @Property(0)
    public startAngle: number;

    /**
     * Description for axis and its element.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for the axis.
     * @default 2
     */
    @Property(2)
    public tabIndex: number;
    /**
     * Specifies the stripLine collection for the axis
     */
    @Collection<StripLineSettings>([], StripLineSettings)
    public stripLines: StripLineSettingsModel[];
    /**
     * Specifies the multi level labels collection for the axis
     */
    @Collection<MultiLevelLabels>([], MultiLevelLabels)
    public multiLevelLabels: MultiLevelLabelsModel[];

    /**
     * Border of the multi level labels.
     */
    @Complex<LabelBorderModel>({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    public border: LabelBorderModel;



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
    public format: Function;
    /** @private */
    public baseModule: Double | DateTime | Category | DateTimeCategory;
    /** @private */
    public startLabel: string;
    /** @private */
    public endLabel: string;
    /** @private */
    public angle: number = this.labelRotation;
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

    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
    /**
     * The function used to find tick size.
     * @return {number}
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
     * @return {number}
     * @private
     */

    public isInside(range: VisibleRangeModel): boolean {
        return (inside(this.crossAt, range) ||
            (!this.opposedPosition && this.crossAt >= range.max) || (this.opposedPosition && this.crossAt <= range.min));
    }

    /**
     * The function used to find label Size.
     * @return {number}
     * @private
     */
    public findLabelSize(crossAxis: Axis, innerPadding: number): number {
        let titleSize: number = 0;
        if (this.title) {
            titleSize = measureText(this.title, this.titleStyle).height + innerPadding;
        }
        if (this.labelPosition === 'Inside') {
            return titleSize + innerPadding;
        }
        let diff: number;
        let value: number;
        let labelSize: number = titleSize + innerPadding + axisPadding +
            ((this.orientation === 'Vertical') ? this.maxLabelSize.width : this.maxLabelSize.height) + this.multiLevelLabelHeight;
        if (crossAxis && this.placeNextToAxisLine) {
            let range: VisibleRangeModel = crossAxis.visibleRange;
            let size: number = (crossAxis.orientation === 'Horizontal') ? crossAxis.rect.width : crossAxis.rect.height;
            if (!range || !size) {
                return 0;
            } else if (this.isInside(range)) {
                value = this.findDifference(crossAxis);
                diff = (value) * (size / range.delta);
                diff = (value) * ((size - (diff < labelSize ? (labelSize - diff) : 0)) / range.delta);
                labelSize = (diff < labelSize) ? (labelSize - diff) : 0;
            }
        }
        return labelSize;
    }
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    public updateCrossValue(chart: Chart): void {
        let value: number = this.crossAt;
        if (value === null || !this.isInside(this.crossInAxis.visibleRange)) {
            this.updatedRect = this.rect;
            return null;
        }
        let range: VisibleRangeModel = this.crossInAxis.visibleRange;
        if (!this.opposedPosition) {
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
        if (this.opposedPosition) {
            value = crossAxis.isInversed ? crossAxis.visibleRange.min : crossAxis.visibleRange.max;
        } else {
            value = crossAxis.isInversed ? crossAxis.visibleRange.max : crossAxis.visibleRange.min;
        }
        return Math.abs(this.crossAt - value);
    }

    /**
     * Calculate visible range for axis.
     * @return {void}
     * @private 
     */
    public calculateVisibleRange(size: Size): void {

        if (this.zoomFactor < 1 || this.zoomPosition > 0) {
            let baseRange: VisibleRangeModel = this.actualRange;
            let start: number;
            let end: number;
            if (!this.isInversed) {
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
            this.visibleRange.min = this.doubleRange.start;
            this.visibleRange.max = this.doubleRange.end;
            this.visibleRange.delta = this.doubleRange.delta;
        }
    }
    /**
     * Triggers the event.
     * @return {void}
     * @private
     */

    public triggerRangeRender(chart: Chart, minimum: number, maximum: number, interval: number): void {
        let argsData: IAxisRangeCalculatedEventArgs;
        argsData = {
            cancel: false, name: axisRangeCalculated, axis: this,
            minimum: minimum, maximum: maximum, interval: interval
        };
        chart.trigger(axisRangeCalculated, argsData);
        if (!argsData.cancel) {
            this.visibleRange.min = argsData.minimum;
            this.visibleRange.max = argsData.maximum;
            this.visibleRange.interval = argsData.interval;
            this.visibleRange.delta = argsData.maximum - argsData.minimum;
        }
    }

    /**
     * Calculate padding for the axis.
     * @return {string}
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
                    padding = (this.isStack100 ? 'Round' : 'Normal');
                } else {
                    padding = 'None';
                }
                break;
            case 'Vertical':
                if (!chart.requireInvertedAxis) {
                    padding = (this.isStack100 ? 'Round' : 'Normal');
                } else {
                    padding = 'None';
                }
                break;
        }
        return padding;
    }

    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     * @private
     */
    public getMaxLabelWidth(chart: Chart): void {
        let prevSize: Size = new Size(0, 0);
        let rotatedLabel: string;
        let pointX: number; let previousEnd: number = 0;
        let isIntersect: boolean = false;
        this.angle = this.labelRotation;
        this.maxLabelSize = new Size(0, 0);
        let action: LabelIntersectAction = this.labelIntersectAction;
        let label: VisibleLabels;
        for (let i: number = 0; i < this.visibleLabels.length; i++) {
            label = this.visibleLabels[i];
            label.size = measureText(<string>label.text, this.labelStyle);
            if (label.size.width > this.maxLabelSize.width) {
                this.maxLabelSize.width = label.size.width;
                this.rotatedLabel = <string>label.text;
            }
            if (label.size.height > this.maxLabelSize.height) {
                this.maxLabelSize.height = label.size.height;
            }
            if (action === 'None' || action === 'Hide' || action === 'Trim') {
                continue;
            }

            if ((<LabelIntersectAction>action !== 'None' || this.angle % 360 === 0) && this.orientation === 'Horizontal' &&
                this.rect.width > 0 && !isIntersect) {
                pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
                pointX -= label.size.width / 2;
                if (this.edgeLabelPlacement === 'Shift') {
                    if (i === 0 && pointX < this.rect.x) {
                        pointX = this.rect.x;
                    }
                    if (i === this.visibleLabels.length - 1 && ((pointX + label.size.width) > (this.rect.x + this.rect.width))) {
                        pointX = this.rect.x + this.rect.width - label.size.width;
                    }
                }
                switch (action) {
                    case 'MultipleRows':
                        if (i > 0) {
                            this.findMultiRows(i, pointX, label);
                        }
                        break;
                    case 'Rotate45':
                    case 'Rotate90':
                        if (i > 0 && (!this.isInversed ? pointX <= previousEnd : pointX + label.size.width >= previousEnd)) {
                            this.angle = (action === 'Rotate45') ? 45 : 90;
                            isIntersect = true;
                        }
                        break;
                    default:
                        label.text = textWrap(
                            <string>label.text,
                            this.rect.width / this.visibleLabels.length, this.labelStyle
                        );
                        let height: number = (label.size.height * label.text.length);
                        if (height > this.maxLabelSize.height) {
                            this.maxLabelSize.height = height;
                        }
                        break;
                }
                previousEnd = this.isInversed ? pointX : pointX + label.size.width;
            }
        }
        if (this.angle !== 0 && this.orientation === 'Horizontal') {
            this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart);
        }
        if (chart.multiLevelLabelModule && this.multiLevelLabels.length > 0) {
            chart.multiLevelLabelModule.getMultilevelLabelsHeight(this);
        }
    }

    /**
     * Finds the multiple rows for axis.
     * @return {void}
     */

    private findMultiRows(length: number, currentX: number, currentLabel: VisibleLabels): void {
        let label: VisibleLabels;
        let pointX: number;
        let store: number[] = [];
        let isMultiRows: boolean;
        for (let i: number = length - 1; i >= 0; i--) {
            label = this.visibleLabels[i];
            pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
            isMultiRows = !this.isInversed ? currentX < (pointX + label.size.width / 2) :
                currentX + currentLabel.size.width > (pointX - label.size.width / 2);
            if (isMultiRows) {
                store.push(label.index);
                currentLabel.index = (currentLabel.index > label.index) ? currentLabel.index : label.index + 1;
            } else {
                currentLabel.index = store.indexOf(label.index) > - 1 ? currentLabel.index : label.index;
            }
        }
        let height: number = (currentLabel.size.height * currentLabel.index) + (5 * (currentLabel.index - 1));
        if (height > this.maxLabelSize.height) {
            this.maxLabelSize.height = height;
        }
    }

    /**
     * Finds the default module for axis.
     * @return {void}
     * @private
     */

    public getModule(chart: Chart): void {
        if (this.valueType === 'Double') {
            this.baseModule = new Double(chart);
        } else {
            this.baseModule = chart[firstToLowerCase(this.valueType) + 'Module'];
        }
    }
}
/** @private */
export interface VisibleRangeModel {

    min?: number;

    max?: number;

    interval?: number;

    delta?: number;
}
/** @private */
export class VisibleLabels {

    public text: string | string[];

    public value: number;

    public labelStyle: FontModel;

    public size: Size;

    public index: number;

    public originalText: string;

    constructor(text: string | string[], value: number, labelStyle: FontModel, originalText: string | string[],
                size: Size = new Size(0, 0), index: number = 1) {
        this.text = text;
        this.originalText = <string>originalText;
        this.value = value;
        this.labelStyle = labelStyle;
        this.size = size;
        this.index = 1;
    }
}