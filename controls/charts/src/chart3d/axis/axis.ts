import { Property, Complex, ChildProperty, Browser } from '@syncfusion/ej2-base';
import { rotateTextSize, firstToLowerCase, isBreakLabel, getTitle } from '../../common/utils/helper';
import { Size, Rect, measureText } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/doubleRange';
import { Chart3DSeries } from '../series/chart-series';
import { Double3D } from '../axis/double-axis';
import { DateTime3D } from '../axis/date-time-axis';
import { Category3D } from '../axis/category-axis';
import { DateTimeCategory3D } from '../axis/date-time-category-axis';
import { ChartRangePadding, EdgeLabelPlacement, IntervalType, LabelIntersectAction, LabelPlacement, Orientation, SkeletonType, TextAlignment, ValueType } from '../../common/utils/enum';
import { axisRangeCalculated } from '../../common/model/constants';
import { textWrap } from '../../common/utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart3D } from '../chart3D';
import { Chart3DAxisRangeCalculatedEventArgs, Chart3DFont } from '../model/chart3d-Interface';
import { Chart3DMajorGridLinesModel, Chart3DMajorTickLinesModel, Chart3DMinorGridLinesModel, Chart3DMinorTickLinesModel } from './axis-model';
import { VisibleRangeModel } from '../../common/model/interface';
import { Chart3DFontModel } from '../model/chart3d-Interface-model';
import { valueToCoefficients } from '../utils/chart3dRender';

/**
 * Configures the `rows` of the chart.
 */
export class Chart3DRow extends ChildProperty<Chart3DRow> {

    /**
     * The height of the row as a string accept input both as '100px' and '100%'.
     * If specified as '100%, row renders to the full height of its chart.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string;
    /** @private */
    public axes: Chart3DAxis[] = [];
    /** @private */
    public computedHeight: number;
    /** @private */
    public computedTop: number;
    /** @private */
    public nearSizes: number[] = [];
    /** @private */
    public farSizes: number[] = [];

    /**
     * Computes the size for a three-dimensional axis, row, or column within the 3D chart.
     *
     * @param {Chart3DAxis} axis - The three-dimensional axis to compute the size for.
     * @param {Chart3D} chart - The 3D chart containing the axis and data definitions.
     * @returns {void}
     */
    public computeSize(axis: Chart3DAxis, chart: Chart3D): void {
        let width: number = 0;
        const innerPadding: number = 5;
        if (axis.visible && axis.internalVisibility) {
            width += (axis.majorTickLines.height +
                axis.findLabelSize( innerPadding, chart));
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
export class Chart3DColumn extends ChildProperty<Chart3DColumn> {

    /**
     * The width of the column as a string accepts input both as like '100px' or '100%'.
     * If specified as '100%, column renders to the full width of its chart.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string;

    /** @private */
    public axes: Chart3DAxis[] = [];
    /** @private */
    public computedWidth: number;
    /** @private */
    public computedLeft: number;
    /** @private */
    public nearSizes: number[] = [];
    /** @private */
    public farSizes: number[] = [];

    /**
     * Computes the size for a three-dimensional axis, row, or column within the 3D chart.
     *
     * @param {Chart3DAxis} axis - The three-dimensional axis to compute the size for.
     * @param {Chart3D} chart - The 3D chart containing the axis and data definitions.
     * @returns {void}
     */
    public computeSize(axis: Chart3DAxis, chart: Chart3D): void {
        let height: number = 0;
        const innerPadding: number = 5;
        if (axis.visible && axis.internalVisibility) {
            height += (axis.majorTickLines.height +
                axis.findLabelSize(innerPadding, chart));
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
export class Chart3DMajorGridLines extends ChildProperty<Chart3DMajorGridLines> {

    /**
     * The width of the line in pixels.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

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
export class Chart3DMinorGridLines extends ChildProperty<Chart3DMinorGridLines> {

    /**
     * The width of the line in pixels.
     *
     * @default 0.7
     */
    @Property(0.7)
    public width: number;

    /**
     * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public color: string;
}

/**
 * Configures the major tick lines.
 */
export class Chart3DMajorTickLines extends ChildProperty<Chart3DMajorTickLines> {

    /**
     * The width of the tick lines in pixels.
     *
     * @default 0
     */
    @Property(0)
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
export class Chart3DMinorTickLines extends ChildProperty<Chart3DMinorTickLines> {

    /**
     * The width of the tick line in pixels.
     *
     * @default 0
     */
    @Property(0)
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
 * Configures the axes in the chart.
 *
 * @public
 */
export class Chart3DAxis extends ChildProperty<Chart3DAxis> {
    /**
     * Options to customize the axis label.
     */
    @Complex<Chart3DFontModel>({ fontFamily: null, size: '12px', fontStyle: 'Normal', fontWeight: '400', color: null }, Chart3DFont)
    public labelStyle: Chart3DFontModel;

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
    @Complex<Chart3DFontModel>({ fontFamily: null, size: '14px', fontStyle: 'Normal', fontWeight: '600', color: null }, Chart3DFont)
    public titleStyle: Chart3DFontModel;

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
     * <div id='Chart3D'></div>
     * ```
     * ```typescript
     * let chart3D: Chart3D = new Chart3D({
     * ...
     *     columns: [{ width: '50%' },
     *               { width: '50%' }],
     *     axes: [{
     *                name: 'xAxis 1',
     *                columnIndex: 1,
     *     }],
     * ...
     * });
     * chart3D.appendTo('#Chart3D');
     * ```
     *
     * @default 0
     */
    @Property(0)
    public columnIndex: number;

    /**
     * Specifies the index of the row where the axis is associated, when the chart area is divided into multiple plot areas by using `rows`.
     * ```html
     * <div id='Chart3D'></div>
     * ```
     * ```typescript
     * let chart3D: Chart3D = new Chart3D({
     * ...
     *     rows: [{ height: '50%' },
     *            { height: '50%' }],
     *     axes: [{
     *                name: 'yAxis 1',
     *                rowIndex: 1,
     *      }],
     * ...
     * });
     * chart3D.appendTo('#Chart3D');
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
     * If set to true, the axis will render at the opposite side of its default position.
     *
     * @default false
     */
    @Property(false)
    public opposedPosition: boolean;

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
     * Specifies the data types that the axis can handle:
     * * Double: This type is used for rendering a numeric axis to accommodate numeric data.
     * * DateTime: This type is utilized for rendering a date-time axis to manage date-time data.
     * * Category: This type is employed for rendering a category axis to manage categorical data.
     * * Logarithmic: This type is applied for rendering a logarithmic axis to handle a wide range of values.
     * * DateTimeCategory: This type is used to render a date time category axis for managing business days.
     *
     * @default 'Double'
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
     * @default 'OnTicks'
     */

    @Property('OnTicks')
    public labelPlacement: LabelPlacement;
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
    @Complex<Chart3DMajorTickLinesModel>({}, Chart3DMajorTickLines)
    public majorTickLines: Chart3DMajorTickLinesModel;

    /**
     * Options for customizing minor tick lines.
     */
    @Complex<Chart3DMinorTickLinesModel>({}, Chart3DMinorTickLines)
    public minorTickLines: Chart3DMinorTickLinesModel;

    /**
     * Options for customizing major grid lines.
     */
    @Complex<Chart3DMajorGridLinesModel>({}, Chart3DMajorGridLines)
    public majorGridLines: Chart3DMajorGridLinesModel;

    /**
     * Options for customizing minor grid lines.
     */
    @Complex<Chart3DMinorGridLinesModel>({}, Chart3DMinorGridLines)
    public minorGridLines: Chart3DMinorGridLinesModel;


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
     * It specifies whether the axis to be start from zero.
     *
     * @default true
     */
    @Property(true)
    public startFromZero: boolean;

    /** @private */
    public visibleRange: VisibleRangeModel;
    /** @private */
    public visibleLabels: Visible3DLabels[] = [];
    /** @private */
    public actualRange: VisibleRangeModel;
    /** @private */
    public series: Chart3DSeries[] = [];
    /** @private */
    public doubleRange: DoubleRange;
    /** @private */
    public maxLabelSize: Size;
    /** @private */
    public rotatedLabel: string;
    /** @private */
    public rect: Rect = new Rect(undefined, undefined, 0, 0);
    /** @private */
    public orientation: Orientation;
    /** @private */
    public actualIntervalType: IntervalType;
    /** @private */
    public labels: string[];
    /** @private */
    public indexLabels: object;
    /** @private */
    public format: Function;
    /** @private */
    public baseModule: Double3D | DateTime3D | Category3D | DateTimeCategory3D;
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
    public updatedRect: Rect = null;
    /** @private */
    public maxPointLength: number;
    /** @private */
    public isIntervalInDecimal: boolean = true;
    /** @private */
    public intervalDivs: number[] = [10, 5, 2, 1];
    /** @private */
    public titleCollection: string[] = [];
    /** @private */
    public titleSize: Size = new Size(0, 0);
    /** @private */
    public isAxisInverse: boolean;
    /** @private */
    public isAxisOpposedPosition: boolean;
    /**
     * This property used to hide the axis when series hide from legend click.
     *
     * @private
     */
    public internalVisibility: boolean = true;
    /**
     * This property is used to place the vertical axis in opposed position and horizontal axis in inversed.
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
     * Finds the size of labels with specified inner padding within the 3D chart.
     *
     * @param {number} innerPadding - The inner padding value for labels.
     * @param {Chart3D} chart - The 3D chart for which label size is calculated.
     * @returns {number} - The size of labels accounting for the inner padding.
     */
    public findLabelSize(innerPadding: number, chart: Chart3D): number {
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
        const labelSize: number = titleSize + innerPadding + this.titlePadding + this.labelPadding +
            ((this.orientation === 'Vertical') ? this.maxLabelSize.width : this.maxLabelSize.height);
        return labelSize;
    }

    /**
     * Triggers the axis range calculated event with specified minimum, maximum, and interval values.
     *
     * @param {Chart3D} chart - The 3D chart for which the range is being calculated.
     * @param {number} minimum - The minimum value of the range.
     * @param {number} maximum - The maximum value of the range.
     * @param {number} interval - The interval value for the range.
     * @returns {void}
     */
    public triggerRangeRender(chart: Chart3D, minimum: number, maximum: number, interval: number): void {
        const argsData: Chart3DAxisRangeCalculatedEventArgs = {
            cancel: false, axis: this,
            minimum: minimum, maximum: maximum, interval: interval
        };
        chart.trigger(axisRangeCalculated, argsData);
        if (!argsData.cancel) {
            this.visibleRange = {
                min: argsData.minimum, max: argsData.maximum, interval: argsData.interval,
                delta: argsData.maximum - argsData.minimum
            };
        }
    }

    /**
     * Calculate padding for the axis.
     *
     * @param {Chart3D} chart - Chart instance.
     * @returns {string} - Padding value.
     * @private
     */
    public getRangePadding(chart: Chart3D): string {
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
     *
     * @param {Chart3D} chart - Chart instance.
     * @returns {void}
     * @private
     */
    public getMaxLabelWidth(chart: Chart3D): void {
        let pointX: number; let previousEnd: number = 0;
        let isIntersect: boolean = false; let isAxisLabelBreak: boolean;
        this.angle = this.labelRotation; this.maxLabelSize = new Size(0, 0);
        const action: LabelIntersectAction = this.labelIntersectAction; let label: Visible3DLabels;
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

                pointX = (valueToCoefficients(label.value, this) * this.rect.width) + this.rect.x;
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
            this.rotatedLabel = isNullOrUndefined(this.rotatedLabel) ? '' : this.rotatedLabel;
            const isHorizontalAngle: boolean = this.angle === -360 || this.angle === 0 || this.angle === -180 ||
                this.angle === 180 || this.angle === 360;
            if (!isHorizontalAngle && isBreakLabel(this.rotatedLabel)) {
                this.maxLabelSize = new Size(this.maxLabelSize.height, this.maxLabelSize.width);
            }
            this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart);
        } else if (this.angle !== 0 && this.orientation === 'Vertical') {
            this.rotatedLabel = isNullOrUndefined(this.rotatedLabel) ? '' : this.rotatedLabel;
            const isHorizontalAngle: boolean = this.angle === -360 || this.angle === 0 || this.angle === -180 ||
                this.angle === 180 || this.angle === 360;
            // To avoid overlap axis label with chart title or chart legend when it is outside.
            if (!isHorizontalAngle && isBreakLabel(this.rotatedLabel)) {
                this.maxLabelSize = new Size(this.maxLabelSize.height, this.maxLabelSize.width);
            }
            this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart);
        }
    }

    /**
     * Finds and manages multiple rows for labels within the 3D chart axis.
     *
     * @param {number} length - The length of the labels to be considered.
     * @param {number} currentX - The current X position.
     * @param {Visible3DLabels} currentLabel - The label for which multiple rows are being determined.
     * @param {boolean} isBreakLabels - Indicates whether the labels are break labels.
     * @returns {void}
     */
    private findMultiRows(length: number, currentX: number, currentLabel: Visible3DLabels, isBreakLabels: boolean): void {
        let label: Visible3DLabels;
        let pointX: number; let width2: number;
        const store: number[] = [];
        let isMultiRows: boolean;
        for (let i: number = length - 1; i >= 0; i--) {
            label = this.visibleLabels[i as number];
            width2 = isBreakLabels ? label.breakLabelSize.width : label.size.width;
            pointX = (valueToCoefficients(label.value, this) * this.rect.width) + this.rect.x;
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
     * @param {Chart3D} chart - Chart instance.
     * @returns {void}
     * @private
     */
    public getModule(chart: Chart3D): void {
        if (this.valueType === 'Double') {
            this.baseModule = new Double3D(chart);
        } else {
            this.baseModule = chart[firstToLowerCase(this.valueType) + '3DModule'];
        }
    }

    /**
     * Set the axis `opposedPosition` and `isInversed` properties.
     *
     * @returns {void}
     * @private
     */
    public setIsInversedAndOpposedPosition(): void {
        this.isAxisOpposedPosition = this.opposedPosition || (this.isRTLEnabled && this.orientation === 'Vertical');
        this.isAxisInverse = this.isInversed || (this.isRTLEnabled && this.orientation === 'Horizontal');
    }
}

/**
 * Calculates the axis visible labels.
 *
 * @private
 */
export class Visible3DLabels {

    public text: string | string[];

    public value: number;

    public labelStyle: Chart3DFontModel;

    public size: Size;

    public breakLabelSize: Size;

    public index: number;

    public originalText: string;

    constructor(
        text: string | string[], value: number, labelStyle: Chart3DFontModel,
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
