import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';import { BorderModel } from '../../common/model/base-model';import { Border } from '../../common/model/base';import { Alignment, TextOverflow } from '../../common/utils/enum';import { BulletChartTheme } from '../utils/theme';

/**
 * Interface for a class Range
 */
export interface RangeModel {

    /**
     * Default value for qualitative range end value
     * @default null
     */
    end?: number;

    /**
     * Range opacity
     * @default 1
     */
    opacity?: number;

    /**
     * Default value for qualitative range Color
     * @default null
     */
    color?: string;

}

/**
 * Interface for a class MajorTickLinesSettings
 */
export interface MajorTickLinesSettingsModel {

    /**
     * The height of the tick lines in pixels.
     * @default 12
     */

    height?: number;

    /**
     * The width of the ticks in pixels.
     * @default 2
     */

    width?: number;

    /**
     * The stroke of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */

    color?: string;

    /**
     * It uses to apply range color to ticks and labels.
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
     * @default 8
     */

    height?: number;

    /**
     * The width of the ticks in pixels.
     * @default 2
     */

    width?: number;

    /**
     * The stroke of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */

    color?: string;

    /**
     * It uses to apply range color to ticks and labels.
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
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Font size for the text.
     * @default '16px'
     */
    size?: string;

    /**
     * Color for the text.
     * @default ''
     */
    color?: string;

    /**
     * FontWeight for the text.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Text alignment
     * @default 'Center'
     */
    textAlignment?: Alignment;

    /**
     * Specifies the chart title text overflow
     * @default 'Trim'
     */
    textOverflow?: TextOverflow;

    /**
     * Opacity for the text.
     * @default 1
     */
    opacity?: number;

    /**
     * Default value of enable trim.
     * @default true
     */

    enableTrim?: boolean;

    /**
     * Maximum label width of the bullet chart
     * @default null
     */
    maximumTitleWidth?: number;

    /**
     * Range color 
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
     * @default false.
     */

    enable?: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
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
     * The default value of tooltip template .
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
     * @default false.
     */

    enable?: boolean;

    /**
     * Options to customize the data label text.
     */

    labelStyle?: BulletLabelStyleModel;

}