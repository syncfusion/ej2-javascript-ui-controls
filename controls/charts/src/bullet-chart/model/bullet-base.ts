import { BulletLabelStyleModel } from './bullet-base-model';
import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { BorderModel } from '../../common/model/base-model';
import { Border } from '../../common/model/base';
import { Alignment, TextOverflow } from '../../common/utils/enum';
import { BulletChartTheme } from '../utils/theme';

/**
 * Configuration of the bullet chart ranges
 */
export class Range extends ChildProperty<Range> {

    /**
     * Default value for qualitative range end value
     * @default null
     */
    @Property(null)
    public end: number;

    /**
     * Range opacity
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Default value for qualitative range Color
     * @default null
     */
    @Property(null)
    public color: string;

}

/**
 * Configures the major tick lines.
 */
export class MajorTickLinesSettings extends ChildProperty<MajorTickLinesSettings> {

    /**
     * The height of the tick lines in pixels.
     * @default 12
     */

    @Property(12)
    public height: number;

    /**
     * The width of the ticks in pixels.
     * @default 2
     */

    @Property(1)
    public width: number;

    /**
     * The stroke of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * It uses to apply range color to ticks and labels.
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
     * @default 8
     */

    @Property(8)
    public height: number;

    /**
     * The width of the ticks in pixels.
     * @default 2
     */

    @Property(1)
    public width: number;

    /**
     * The stroke of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * It uses to apply range color to ticks and labels.
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
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Font size for the text.
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Color for the text.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * FontWeight for the text.
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
     * Text alignment
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

    /**
     * Specifies the chart title text overflow
     * @default 'Trim'
     */
    @Property('None')
    public textOverflow: TextOverflow;

    /**
     * Opacity for the text.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Default value of enable trim.
     * @default true
     */

    @Property(true)
    public enableTrim: boolean;

    /**
     * Maximum label width of the bullet chart
     * @default null
     */
    @Property(null)
    public maximumTitleWidth: number;
    /**
     * Range color 
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
     * @default false.
     */

    @Property(false)
    public enable: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
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
     * The default value of tooltip template .
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