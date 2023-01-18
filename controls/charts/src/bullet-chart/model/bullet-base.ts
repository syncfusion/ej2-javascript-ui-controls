import { BulletLabelStyleModel } from './bullet-base-model';
import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { BorderModel, MarginModel } from '../../common/model/base-model';
import { Border, Margin } from '../../common/model/base';
import { Alignment, TextOverflow } from '../../common/utils/enum';
import { BulletChartTheme } from '../utils/theme';
import { LegendShape, LegendPosition } from '../../chart/utils/enum';
import { Location } from '../../common/legend/legend';
import { LocationModel } from '../../common/legend/legend-model';

/**
 * Configuration of the bullet chart ranges
 */
export class Range extends ChildProperty<Range> {

    /**
     * Default value for qualitative range end value.
     *
     * @default null
     */
    @Property(null)
    public end: number;

    /**
     * Range opacity
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Default value for qualitative range Color.
     *
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Default value for qualitative range Color.
     *
     * @default null
     */
    @Property(null)
    public index: number;

    /**
     * Default value for qualitative range name.
     *
     * @default null
     */
    @Property(null)
    public name: string;

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
     *
     * @default 'Rectangle'
     */
    @Property('Rectangle')
    public shape: LegendShape;

    /**
     * The URL for the Image that is to be displayed as a Legend icon.  It requires  `legendShape` value to be an `Image`.
     *
     * @default ''
     */

    @Property('')
    public legendImageUrl: string;
}

/**
 * Configures the major tick lines.
 */
export class MajorTickLinesSettings extends ChildProperty<MajorTickLinesSettings> {

    /**
     * The height of the tick lines in pixels.
     *
     * @default 12
     */
    @Property(12)
    public height: number;

    /**
     * The width of the ticks in pixels.
     *
     * @default 2
     */

    @Property(1)
    public width: number;

    /**
     * The stroke of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * It uses to apply range color to ticks and labels.
     *
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;
}

/**
 * Configures the minor tick lines.
 */
export class MinorTickLinesSettings extends ChildProperty<MinorTickLinesSettings> {

    /**
     * The height of the tick lines in pixels.
     *
     * @default 8
     */

    @Property(8)
    public height: number;

    /**
     * The width of the ticks in pixels.
     *
     * @default 2
     */

    @Property(1)
    public width: number;

    /**
     * The stroke of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * It uses to apply range color to ticks and labels.
     *
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;
}

/**
 * Configures the fonts in bullet chart.
 */

export class BulletLabelStyle extends ChildProperty<BulletLabelStyle> {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Font size for the text.
     *
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Color for the text.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * FontWeight for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * FontFamily for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Text alignment.
     *
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

    /**
     * Specifies the chart title text overflow.
     *
     * @default 'Trim'
     */
    @Property('None')
    public textOverflow: TextOverflow;

    /**
     * Opacity for the text.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Default value of enable trim.
     *
     * @default true
     */

    @Property(true)
    public enableTrim: boolean;

    /**
     * Maximum label width of the bullet chart.
     *
     * @default null
     */
    @Property(null)
    public maximumTitleWidth: number;
    /**
     * Range color.
     *
     * @default false
     */
    @Property(false)
    public useRangeColor: boolean;

}

/**
 * Configures the ToolTips in the bullet chart.
 */

export class BulletTooltipSettings extends ChildProperty<BulletTooltipSettings> {
    /**
     * Enables / Disables the visibility of the tooltip.
     *
     * @default false.
     */

    @Property(false)
    public enable: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Options to customize the ToolTip text.
     */

    @Complex<BulletLabelStyleModel>(BulletChartTheme.tooltipLabelFont, BulletLabelStyle)
    public textStyle: BulletLabelStyleModel;

    /**
     * Options to customize tooltip borders.
     */
    @Complex<BorderModel>({ color: '#cccccc', width: 0.5 }, Border)
    public border: BorderModel;


    /**
     * The default value of tooltip template.
     *
     * @default null
     */

    @Property(null)
    public template: string;

}

/**
 * Configures the DataLabel in the bullet chart.
 */

export class BulletDataLabel extends ChildProperty<BulletDataLabel> {
    /**
     * Enables / Disables the visibility of the data label.
     *
     * @default false.
     */

    @Property(false)
    public enable: boolean;

    /**
     * Options to customize the data label text.
     */

    @Complex<BulletLabelStyleModel>(BulletChartTheme.dataLabelFont, BulletLabelStyle)
    public labelStyle: BulletLabelStyleModel;

}

/**
 * Configures the legends in charts.
 */
export class BulletChartLegendSettings extends ChildProperty<BulletChartLegendSettings> {

    /**
     * If set to true, legend will be visible.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

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
    @Complex<LocationModel>({ x: 0, y: 0 }, Location)
    public location: LocationModel;

    /**
     * Option to customize the padding between legend items.
     *
     * @default 8
     */
    @Property(8)
    public padding: number;

    /**
     * Legend in chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the bullet chart.
     * * Center: Aligns the legend to the center of the bullet chart.
     * * Far: Aligns the legend to the right of the bullet chart.
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Shape height of the bullet chart legend in pixels.
     *
     * @default 10
     */
    @Property(10)
    public shapeHeight: number;

    /**
     * Shape width of the bullet chart legend in pixels.
     *
     * @default 10
     */
    @Property(10)
    public shapeWidth: number;

    /**
     * Options to customize the bullet chart legend text.
     */
    @Complex<BulletLabelStyleModel>(BulletChartTheme.legendLabelFont, BulletLabelStyle)
    public textStyle: BulletLabelStyleModel;

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
    @Property('Auto')
    public position: LegendPosition;

    /**
     *  Options to customize left, right, top and bottom margins of the bullet chart.
     */

    @Complex<MarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    public margin: MarginModel;

    /**
     * Options to customize the border of the bullet chart legend.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Padding between the bullet chart legend shape and text.
     *
     * @default 5
     */
    @Property(5)
    public shapePadding: number;

    /**
     * The background color of the bullet chart legend that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Opacity of the bullet chart legend.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * TabIndex value for the bullet chart legend.
     *
     * @default 3
     */
    @Property(3)
    public tabIndex: number;
}
