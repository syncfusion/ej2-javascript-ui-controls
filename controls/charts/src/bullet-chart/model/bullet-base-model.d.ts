import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';import { BorderModel, MarginModel } from '../../common/model/base-model';import { Border, Margin } from '../../common/model/base';import { Alignment, TextOverflow } from '../../common/utils/enum';import { BulletChartTheme } from '../utils/theme';import { LegendShape, LegendPosition } from '../../chart/utils/enum';import { Location } from '../../common/legend/legend';import { LocationModel } from '../../common/legend/legend-model';

/**
 * Interface for a class Range
 */
export interface RangeModel {

    /**
     * Default value for qualitative range end value
     *
     * @default null
     */
    end?: number;

    /**
     * Range opacity
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Default value for qualitative range Color
     *
     * @default null
     */
    color?: string;

    /**
     * Default value for qualitative range Color
     *
     * @default null
     */
    index?: number;

    /**
     * Default value for qualitative range name
     *
     * @default null
     */
    name?: string;

    /**
     * The shape of the legend. Each ranges has its own legend shape. They are,
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
     * @default 'Rectangle'
     */
    shape?: LegendShape;

    /**
     * The URL for the Image that is to be displayed as a Legend icon.  It requires  `legendShape` value to be an `Image`.
     * @default ''
     */

    legendImageUrl?: string;

}

/**
 * Interface for a class MajorTickLinesSettings
 */
export interface MajorTickLinesSettingsModel {

    /**
     * The height of the tick lines in pixels.
     *
     * @default 12
     */
    height?: number;

    /**
     * The width of the ticks in pixels.
     *
     * @default 2
     */

    width?: number;

    /**
     * The stroke of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    color?: string;

    /**
     * It uses to apply range color to ticks and labels.
     *
     * @default false
     */

    useRangeColor?: boolean;

}

/**
 * Interface for a class MinorTickLinesSettings
 */
export interface MinorTickLinesSettingsModel {

    /**
     * The height of the tick lines in pixels.
     *
     * @default 8
     */

    height?: number;

    /**
     * The width of the ticks in pixels.
     *
     * @default 2
     */

    width?: number;

    /**
     * The stroke of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    color?: string;

    /**
     * It uses to apply range color to ticks and labels.
     *
     * @default false
     */

    useRangeColor?: boolean;

}

/**
 * Interface for a class BulletLabelStyle
 */
export interface BulletLabelStyleModel {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Font size for the text.
     *
     * @default '16px'
     */
    size?: string;

    /**
     * Color for the text.
     *
     * @default ''
     */
    color?: string;

    /**
     * FontWeight for the text.
     *
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Text alignment
     *
     * @default 'Center'
     */
    textAlignment?: Alignment;

    /**
     * Specifies the chart title text overflow
     *
     * @default 'Trim'
     */
    textOverflow?: TextOverflow;

    /**
     * Opacity for the text.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Default value of enable trim.
     *
     * @default true
     */

    enableTrim?: boolean;

    /**
     * Maximum label width of the bullet chart
     *
     * @default null
     */
    maximumTitleWidth?: number;

    /**
     * Range color
     *
     * @default false
     */
    useRangeColor?: boolean;

}

/**
 * Interface for a class BulletTooltipSettings
 */
export interface BulletTooltipSettingsModel {

    /**
     * Enables / Disables the visibility of the tooltip.
     *
     * @default false.
     */

    enable?: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    fill?: string;

    /**
     * Options to customize the ToolTip text.
     */

    textStyle?: BulletLabelStyleModel;

    /**
     * Options to customize tooltip borders.
     */
    border?: BorderModel;

    /**
     * The default value of tooltip template.
     *
     * @default null
     */

    template?: string;

}

/**
 * Interface for a class BulletDataLabel
 */
export interface BulletDataLabelModel {

    /**
     * Enables / Disables the visibility of the data label.
     *
     * @default false.
     */

    enable?: boolean;

    /**
     * Options to customize the data label text.
     */

    labelStyle?: BulletLabelStyleModel;

}

/**
 * Interface for a class BulletChartLegendSettings
 */
export interface BulletChartLegendSettingsModel {

    /**
     * If set to true, legend will be visible.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Specifies the location of the legend, relative to the bullet chart.
     * If x is 20, legend moves by 20 pixels to the right of the bullet chart. It requires the `position` to be `Custom`.
     * ```html
     * <div id='BulletChart'></div>
     * ```
     * ```typescript
     * let chart: BulletChart = new BulletChart({
     * ...
     *   legendSettings: {
     *     visible: true,
     *   },
     * ...
     * });
     * chart.appendTo('#BulletChart');
     * ```
     */
    location?: LocationModel;

    /**
     * Option to customize the padding between legend items.
     *
     * @default 8
     */
    padding?: number;

    /**
     * Legend in chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the bullet chart.
     * * Center: Aligns the legend to the center of the bullet chart.
     * * Far: Aligns the legend to the right of the bullet chart.
     *
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Shape height of the bullet chart legend in pixels.
     *
     * @default 10
     */
    shapeHeight?: number;

    /**
     * Shape width of the bullet chart legend in pixels.
     *
     * @default 10
     */
    shapeWidth?: number;

    /**
     * Options to customize the bullet chart legend text.
     */
    textStyle?: BulletLabelStyleModel;

    /**
     * Position of the legend in the bullet chart are,
     * * Auto: Places the legend based on area type.
     * * Top: Displays the legend at the top of the bullet chart.
     * * Left: Displays the legend at the left of the bullet chart.
     * * Bottom: Displays the legend at the bottom of the bullet chart.
     * * Right: Displays the legend at the right of the bullet chart.
     * * Custom: Displays the legend  based on the given x and y values.
     *
     * @default 'Auto'
     */
    position?: LegendPosition;

    /**
     *  Options to customize left, right, top and bottom margins of the bullet chart.
     */

    margin?: MarginModel;

    /**
     * Options to customize the border of the bullet chart legend.
     */
    border?: BorderModel;

    /**
     * Padding between the bullet chart legend shape and text.
     *
     * @default 5
     */
    shapePadding?: number;

    /**
     * The background color of the bullet chart legend that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */
    background?: string;

    /**
     * Opacity of the bullet chart legend.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * TabIndex value for the bullet chart legend.
     *
     * @default 3
     */
    tabIndex?: number;

}