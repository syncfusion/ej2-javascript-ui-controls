import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { EmptyPointMode} from '../../chart/utils/enum';import { AccEmptyPointMode, ConnectorType} from '../../accumulation-chart/model/enum';import { Alignment, TextOverflow } from '../utils/enum';import { RangeIntervalType, PeriodSelectorPosition } from '../utils/enum';import {  Theme } from '../model/theme';

/**
 * Interface for a class Connector
 */
export interface ConnectorModel {

    /**
     * specifies the type of the connector line. They are
     * * Smooth
     * * Line

     */
    type?: ConnectorType;

    /**
     * Color of the connector line.

     */
    color?: string;

    /**
     * Width of the connector line in pixels.

     */
    width?: number;

    /**
     * Length of the connector line in pixels.

     */
    length?: string;

    /**
     * dashArray of the connector line.

     */
    dashArray?: string;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * FontStyle for the text.

     */
    fontStyle?: string;

    /**
     * Font size for the text.

     */
    size?: string;

    /**
     * FontWeight for the text.

     */
    fontWeight?: string;

    /**
     * Color for the text.

     */
    color?: string;

    /**
     * text alignment

     */
    textAlignment?: Alignment;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.

     */
    opacity?: number;

    /**
     * Specifies the chart title text overflow

     */
    textOverflow?: TextOverflow;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.

     */
    color?: string;

    /**
     * The width of the border in pixels.

     */
    width?: number;

}

/**
 * Interface for a class Offset
 */
export interface OffsetModel {

    /**
     * x value of the marker position

     */
    x?: number;

    /**
     * y value of the marker position

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

     */
    background?: string;

    /**
     * The opacity for background.

     */
    opacity?: number;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Left margin in pixels.

     */
    left?: number;

    /**
     * Right margin in pixels.

     */
    right?: number;

    /**
     * Top margin in pixels.

     */
    top?: number;

    /**
     * Bottom margin in pixels.

     */
    bottom?: number;

}

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * If set to true, series gets animated on initial loading.

     */

    enable?: boolean;

    /**
     * The duration of animation in milliseconds.

     */

    duration?: number;

    /**
     * The option to delay animation of the series.

     */

    delay?: number;

}

/**
 * Interface for a class Indexes
 */
export interface IndexesModel {

    /**
     * Specifies the series index


     */
    series?: number;

    /**
     * Specifies the point index


     */
    point?: number;

}

/**
 * Interface for a class CornerRadius
 */
export interface CornerRadiusModel {

    /**
     * Specifies the top left corner radius value

     */
    topLeft?: number;

    /**
     * Specifies the top right corner radius value

     */
    topRight?: number;

    /**
     * Specifies the bottom left corner radius value

     */
    bottomLeft?: number;

    /**
     * Specifies the bottom right corner radius value

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

     */
    fill?: string;

    /**
     * Options to customize the border of empty points.

     */
    border?: BorderModel;

    /**
     * To customize the mode of empty points.

     */
    mode?: EmptyPointMode | AccEmptyPointMode;

}

/**
 * Interface for a class DragSettings
 */
export interface DragSettingsModel {

    /**
     * To enable the drag the points

     */
    enable?: boolean;

    /**
     * To set the minimum y of the point

     */
    minY?: number;

    /**
     * To set the maximum y of the point

     */
    maxY?: number;

    /**
     * To set the color of the edited point

     */
    fill?: string;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enables / Disables the visibility of the tooltip.

     */

    enable?: boolean;

    /**
     * Enables / Disables the visibility of the marker.

     */

    enableMarker?: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.

     */

    shared?: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.

     */

    fill?: string;

    /**
     * Header for tooltip. 

     */

    header?: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 

     */

    opacity?: number;

    /**
     * Options to customize the ToolTip text.
     */

    textStyle?: FontModel;

    /**
     * Format the ToolTip content.

     */

    format?: string;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.

     */

    template?: string;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.

     */
    enableAnimation?: boolean;

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

     */
    intervalType?: RangeIntervalType;

    /**
     * Count value for the button

     */
    interval?: number;

    /**
     * Text to be displayed on the button

     */
    text?: string;

    /**
     * To select the default period

     */
    selected?: boolean;

}

/**
 * Interface for a class PeriodSelectorSettings
 */
export interface PeriodSelectorSettingsModel {

    /**
     * Height for the period selector

     */
    height?: number;

    /**
     * vertical position of the period selector

     */
    position?: PeriodSelectorPosition;

    /**
     * Buttons
     */
    periods?: PeriodsModel[];

}