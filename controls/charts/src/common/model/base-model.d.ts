import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { EmptyPointMode} from '../../chart/utils/enum';import { AccEmptyPointMode, ConnectorType} from '../../accumulation-chart/model/enum';import { Alignment, TextOverflow } from '../utils/enum';import { RangeIntervalType, PeriodSelectorPosition } from '../utils/enum';import {  Theme } from '../model/theme';

/**
 * Interface for a class Connector
 */
export interface ConnectorModel {

    /**
     * specifies the type of the connector line. They are
     * * Smooth
     * * Line
     * @default 'Line'
     */
    type?: ConnectorType;

    /**
     * Color of the connector line.
     * @default null
     */
    color?: string;

    /**
     * Width of the connector line in pixels.
     * @default 1
     */
    width?: number;

    /**
     * Length of the connector line in pixels.
     * @default null
     */
    length?: string;

    /**
     * dashArray of the connector line.
     * @default ''
     */
    dashArray?: string;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

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
     * FontWeight for the text.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Color for the text.
     * @default ''
     */
    color?: string;

    /**
     * text alignment
     * @default 'Center'
     */
    textAlignment?: Alignment;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    opacity?: number;

    /**
     * Specifies the chart title text overflow
     * @default 'Trim'
     */
    textOverflow?: TextOverflow;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    color?: string;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    width?: number;

}

/**
 * Interface for a class Offset
 */
export interface OffsetModel {

    /**
     * x value of the marker position
     * @default 0
     */
    x?: number;

    /**
     * y value of the marker position
     * @default 0
     */
    y?: number;

}

/**
 * Interface for a class ChartArea
 */
export interface ChartAreaModel {

    /**
     * Options to customize the border of the chart area.
     */
    border?: BorderModel;

    /**
     * The background of the chart area that accepts value in hex and rgba as a valid CSS color string..
     * @default 'transparent'
     */
    background?: string;

    /**
     * The opacity for background.
     * @default 1
     */
    opacity?: number;

    /**
     * The background image of the chart area that accepts value in string as url link or location of an image.
     * @default null
     */
    backgroundImage?: string;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Left margin in pixels.
     * @default 10
     */
    left?: number;

    /**
     * Right margin in pixels.
     * @default 10
     */
    right?: number;

    /**
     * Top margin in pixels.
     * @default 10
     */
    top?: number;

    /**
     * Bottom margin in pixels.
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * If set to true, series gets animated on initial loading.
     * @default true
     */

    enable?: boolean;

    /**
     * The duration of animation in milliseconds.
     * @default 1000
     */

    duration?: number;

    /**
     * The option to delay animation of the series.
     * @default 0
     */

    delay?: number;

}

/**
 * Interface for a class Indexes
 */
export interface IndexesModel {

    /**
     * Specifies the series index
     * @default 0
     * @aspType int
     */
    series?: number;

    /**
     * Specifies the point index
     * @default 0
     * @aspType int
     */
    point?: number;

}

/**
 * Interface for a class CornerRadius
 */
export interface CornerRadiusModel {

    /**
     * Specifies the top left corner radius value
     * @default 0
     */
    topLeft?: number;

    /**
     * Specifies the top right corner radius value
     * @default 0
     */
    topRight?: number;

    /**
     * Specifies the bottom left corner radius value
     * @default 0
     */
    bottomLeft?: number;

    /**
     * Specifies the bottom right corner radius value
     * @default 0
     */
    bottomRight?: number;

}

/**
 * Interface for a class Index
 * @private
 */
export interface IndexModel {

}

/**
 * Interface for a class EmptyPointSettings
 */
export interface EmptyPointSettingsModel {

    /**
     * To customize the fill color of empty points.
     * @default null
     */
    fill?: string;

    /**
     * Options to customize the border of empty points.
     * @default "{color: 'transparent', width: 0}"
     */
    border?: BorderModel;

    /**
     * To customize the mode of empty points.
     * @default Gap
     */
    mode?: EmptyPointMode | AccEmptyPointMode;

}

/**
 * Interface for a class DragSettings
 */
export interface DragSettingsModel {

    /**
     * To enable the drag the points
     * @default false
     */
    enable?: boolean;

    /**
     * To set the minimum y of the point
     * @default null
     */
    minY?: number;

    /**
     * To set the maximum y of the point
     * @default null
     */
    maxY?: number;

    /**
     * To set the color of the edited point
     * @default null
     */
    fill?: string;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enables / Disables the visibility of the tooltip.
     * @default false.
     */

    enable?: boolean;

    /**
     * Enables / Disables the visibility of the marker.
     * @default true.
     */

    enableMarker?: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     * @default false.
     */

    shared?: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */

    fill?: string;

    /**
     * Header for tooltip.
     * @default null
     */

    header?: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @default 0.75
     */

    opacity?: number;

    /**
     * Options to customize the ToolTip text.
     */

    textStyle?: FontModel;

    /**
     * Format the ToolTip content.
     * @default null.
     */

    format?: string;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     * @default null.
     */

    template?: string;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.
     * @default true.
     */
    enableAnimation?: boolean;

    /**
     * Duration for the ToolTip animation.
     * @default 300
     */

    duration?: number;

    /**
     * Fade Out duration for the ToolTip hide.
     * @default 1000
     */

    fadeOutDuration?: number;

    /**
     * To wrap the tooltip long text based on available space.
     * This is only application for chart tooltip.
     * @default false
     */

    enableTextWrap?: boolean;

    /**
     * Options to customize tooltip borders.
     */
    border?: BorderModel;

}

/**
 * Interface for a class Periods
 */
export interface PeriodsModel {

    /**
     * IntervalType of button
     * @default 'Years'
     */
    intervalType?: RangeIntervalType;

    /**
     * Count value for the button
     * @default 1
     */
    interval?: number;

    /**
     * Text to be displayed on the button
     * @default null
     */
    text?: string;

    /**
     * To select the default period
     * @default false
     */
    selected?: boolean;

}

/**
 * Interface for a class PeriodSelectorSettings
 */
export interface PeriodSelectorSettingsModel {

    /**
     * Height for the period selector
     * @default 43
     */
    height?: number;

    /**
     * vertical position of the period selector
     * @default 'Bottom'
     */
    position?: PeriodSelectorPosition;

    /**
     * Buttons
     */
    periods?: PeriodsModel[];

}