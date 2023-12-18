import { Property, ChildProperty, Complex, Collection, Browser } from '@syncfusion/ej2-base';import { FadeOutMode, TooltipPosition } from '../../chart/utils/enum';import { AccEmptyPointMode, ConnectorType} from '../../accumulation-chart/model/enum';import { Alignment, EmptyPointMode, TextOverflow, TitlePosition} from '../utils/enum';import { RangeIntervalType, PeriodSelectorPosition } from '../utils/enum';import {  Theme } from '../model/theme';

/**
 * Interface for a class Connector
 */
export interface ConnectorModel {

    /**
     * specifies the type of the connector line. They are
     * * Smooth
     * * Line
     *
     * @default 'Line'
     */

    type?: ConnectorType;

    /**
     * Color of the connector line.
     *
     * @default null
     */

    color?: string;

    /**
     * Width of the connector line in pixels.
     *
     * @default 1
     */

    width?: number;

    /**
     * Length of the connector line in pixels.
     *
     * @default null
     */

    length?: string;

    /**
     * dashArray of the connector line.
     *
     * @default ''
     */

    dashArray?: string;

}

/**
 * Interface for a class titleBorder
 */
export interface titleBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */

    color?: string;

    /**
     * The width of the border in pixels.
     *
     * @default 0
     */

    width?: number;

    /**
     * corder radius for the border.
     *
     * @default 0.8
     */

    cornerRadius?: number;

}

/**
 * Interface for a class titleSettings
 */
export interface titleSettingsModel {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */

    fontStyle?: string;

    /**
     * Font size for the text.
     *
     * @default '15px'
     */

    size?: string;

    /**
     * FontWeight for the text.
     *
     * @default '500'
     */

    fontWeight?: string;

    /**
     * Color for the text.
     *
     * @default ''
     */

    color?: string;

    /**
     * text alignment.
     *
     * @default 'Center'
     */

    textAlignment?: Alignment;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * Specifies the chart title text overflow.
     *
     * @default 'Wrap'
     */

    textOverflow?: TextOverflow;

    /**
     * Defines the position for the chart title.
     * * Top: Displays the title at the top of the chart.
     * * Left: Displays the title at the left of the chart.
     * * Bottom: Displays the title at the bottom of the chart.
     * * Right: Displays the title at the right of the chart.
     * * Custom: Displays the title based on the given x and y values.
     *
     * @default 'Top'
     */

    position?: TitlePosition;

    /**
     * Defines the X coordinate for the chart title.
     *
     * @default 0
     */

    x?: number;

    /**
     * Defines the Y coordinate for the chart title.
     *
     * @default 0
     */

    y?: number;

    /**
     * Background of the title border.
     *
     * @default 'transparent'
     */

    background?: string;

    /**
     * Options to customize the border of the chart title.
     */

    border?: titleBorderModel;

}

/**
 * Interface for a class Location
 */
export interface LocationModel {

    /**
     * X coordinate of the legend or tooltip in pixels.
     *
     * @default 0
     */

    x?: number;

    /**
     * Y coordinate of the legend or tooltip in pixels.
     *
     * @default 0
     */

    y?: number;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

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
     * FontWeight for the text.
     *
     * @default 'Normal'
     */

    fontWeight?: string;

    /**
     * Color for the text.
     *
     * @default ''
     */

    color?: string;

    /**
     * text alignment.
     *
     * @default 'Center'
     */

    textAlignment?: Alignment;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * Specifies the chart title text overflow.
     *
     * @default 'Wrap'
     */

    textOverflow?: TextOverflow;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */

    color?: string;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */

    width?: number;

}

/**
 * Interface for a class Offset
 */
export interface OffsetModel {

    /**
     * x value of the marker position.
     *
     * @default 0
     */

    x?: number;

    /**
     * y value of the marker position.
     *
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
     *
     * @default 'transparent'
     */

    background?: string;

    /**
     * The opacity for background.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * The background image of the chart area that accepts value in string as url link or location of an image.
     *
     * @default null
     */

    backgroundImage?: string;

    /**
     * Defines the width for the chart area element. Takes value in percentage and in pixel.
     *
     * @default null
     */

    width?: string;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Left margin in pixels.
     *
     * @default 10
     */

    left?: number;

    /**
     * Right margin in pixels.
     *
     * @default 10
     */

    right?: number;

    /**
     * Top margin in pixels.
     *
     * @default 10
     */

    top?: number;

    /**
     * Bottom margin in pixels.
     *
     * @default 10
     */

    bottom?: number;

}

/**
 * Interface for a class ContainerPadding
 */
export interface ContainerPaddingModel {

    /**
     * Left padding in pixels.
     *
     * @default 0
     */
    left?: number;

    /**
     * Right padding in pixels.
     *
     * @default 0
     */
    right?: number;

    /**
     * Top padding in pixels.
     *
     * @default 0
     */
    top?: number;

    /**
     * Bottom padding in pixels.
     *
     * @default 0
     */
    bottom?: number;

}

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * If set to true, series gets animated on initial loading.
     *
     * @default true
     */

    enable?: boolean;

    /**
     * The duration of animation in milliseconds.
     *
     * @default 1000
     */

    duration?: number;

    /**
     * The option to delay animation of the series.
     *
     * @default 0
     */

    delay?: number;

}

/**
 * Interface for a class Indexes
 */
export interface IndexesModel {

    /**
     * Specifies the series index.
     *
     * @default 0
     * @aspType int
     */

    series?: number;

    /**
     * Specifies the point index.
     *
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
     * Specifies the top left corner radius value.
     *
     * @default 0
     */

    topLeft?: number;

    /**
     * Specifies the top right corner radius value.
     *
     * @default 0
     */

    topRight?: number;

    /**
     * Specifies the bottom left corner radius value.
     *
     * @default 0
     */

    bottomLeft?: number;

    /**
     * Specifies the bottom right corner radius value.
     *
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
     *
     * @default null
     */

    fill?: string;

    /**
     * Options to customize the border of empty points.
     *
     * @default "{color: 'transparent', width: 0}"
     */

    border?: BorderModel;

    /**
     * To customize the mode of empty points.
     *
     * @default Gap
     */

    mode?: EmptyPointMode | AccEmptyPointMode;

}

/**
 * Interface for a class DragSettings
 */
export interface DragSettingsModel {

    /**
     * To enable the drag the points.
     *
     * @default false
     */

    enable?: boolean;

    /**
     * To set the minimum y of the point.
     *
     * @default null
     */

    minY?: number;

    /**
     * To set the maximum y of the point.
     *
     * @default null
     */

    maxY?: number;

    /**
     * To set the color of the edited point.
     *
     * @default null
     */

    fill?: string;

}

/**
 * Interface for a class CenterLabel
 */
export interface CenterLabelModel {

    /**
     * Define the label to be placed to the center of the pie and doughnut chart.
     *
     * @default null
     */

    text?: string;

    /**
     * Defines the font style of the center label.
     */

    textStyle?: FontModel;

    /**
     * Define the format for the center label when mouse hovered on the pie data.
     *
     * @default null
     */

    hoverTextFormat?: string;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * If set to true, enables the tooltip for the data points.
     *
     * @default false.
     */

    enable?: boolean;

    /**
     * If set to true, enables the marker in the chart tooltip.
     *
     * @default true.
     */

    enableMarker?: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     *
     * @default false.
     */

    shared?: boolean;

    /**
     * The fill color of the tooltip, specified as a valid CSS color string in hex or rgba format.
     *
     * @default null
     */

    fill?: string;

    /**
     * The header text for the tooltip. By default, it displays the series name.
     *
     * @default null
     */

    header?: string;

    /**
     * The opacity of the tooltip, expressed as a numerical value.
     *
     * @default null
     */

    opacity?: number;

    /**
     * Options for customizing the tooltip text appearance.
     */

    textStyle?: FontModel;

    /**
     * The format for customizing the tooltip content.
     *
     * @default null.
     */

    format?: string;

    /**
     * A custom template used to format the Tooltip content. You can use ${x} and ${y} as placeholder text to display the corresponding data points.
     *
     * @default null.
     * @aspType string
     */

    template?: string | Function;

    /**
     * If set to true, tooltip will animate while moving from one point to another.
     *
     * @default true.
     */
    enableAnimation?: boolean;

    /**
     * Duration for the Tooltip animation.
     *
     * @default 300
     */

    duration?: number;

    /**
     * Duration of the fade-out animation for hiding the Tooltip.
     *
     * @default 1000
     */

    fadeOutDuration?: number;

    /**
     * Fade Out duration for the Tooltip hide.
     *
     * @default Move
     */

    fadeOutMode?: FadeOutMode;

    /**
     * To wrap the tooltip long text based on available space.
     * This is only application for chart tooltip.
     *
     * @default false
     */

    enableTextWrap?: boolean;

    /**
     * By default, the nearest points will be included in the shared tooltip; however, you can set it to false to exclude the nearest value from the tooltip.
     *
     * @default true
     */

    showNearestPoint?: boolean;

    /**
     * Options for customizing the tooltip borders.
     */

    border?: BorderModel;

    /**
     * Specifies the location of the tooltip, relative to the chart. 
     * If x is 20, tooltip moves by 20 pixels to the right of the chart 
     * ```html 
     * <div id='Chart'></div> 
     * ``` 
     * ```typescript 
     * let chart: Chart = new Chart({ 
     * ... 
     * tooltipSettings: { 
     * enable: true, 
     * location: { x: 100, y: 150 }, 
     *   }, 
     * ... 
     * }); 
     * chart.appendTo('#Chart'); 
     * ``` 
     */

    location?: LocationModel;

}

/**
 * Interface for a class StockTooltipSettings
 */
export interface StockTooltipSettingsModel {

    /**
     * Enables / Disables the visibility of the tooltip.
     *
     * @default false.
     */

    enable?: boolean;

    /**
     * Enables / Disables the visibility of the marker.
     *
     * @default true.
     */

    enableMarker?: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     *
     * @default false.
     */

    shared?: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    fill?: string;

    /**
     * Header for tooltip. By default, the shared tooltip displays the point x value and the series name for each individual tooltip.
     *
     * @default null
     */

    header?: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 0.75
     */

    opacity?: number;

    /**
     * Options to customize the ToolTip text.
     */

    textStyle?: FontModel;

    /**
     * Format the ToolTip content.
     *
     * @default null.
     */

    format?: string;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     *
     * @default null.
     * @aspType string
     */

    template?: string | Function;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.
     *
     * @default true.
     */
    enableAnimation?: boolean;

    /**
     * Duration for the ToolTip animation.
     *
     * @default 300
     */

    duration?: number;

    /**
     * Fade Out duration for the ToolTip hide.
     *
     * @default 1000
     */

    fadeOutDuration?: number;

    /**
     * Fade Out duration for the Tooltip hide.
     *
     * @default Move
     */

    fadeOutMode?: FadeOutMode;

    /**
     * To wrap the tooltip long text based on available space.
     * This is only application for chart tooltip.
     *
     * @default false
     */

    enableTextWrap?: boolean;

    /**
     * By default, the nearest points will be included in the shared tooltip; however, you can set it to false to exclude the nearest value from the tooltip.
     *
     * @default true
     */

    showNearestPoint?: boolean;

    /**
     * Options to customize tooltip borders.
     */

    border?: BorderModel;

    /**
     * Specifies the tooltip position. They are, 
     * * fixed - Place the tooltip in the fixed position. 
     * * nearest- Tooltip moves along with the mouse. 
     * 
     * @default 'Fixed' 
     */

    position?: TooltipPosition; 

}

/**
 * Interface for a class Periods
 */
export interface PeriodsModel {

    /**
     * IntervalType of button.
     *
     * @default 'Years'
     */

    intervalType?: RangeIntervalType;

    /**
     * Count value for the button.
     *
     * @default 1
     */

    interval?: number;

    /**
     * Text to be displayed on the button.
     *
     * @default null
     */

    text?: string;

    /**
     * To select the default period.
     *
     * @default false
     */

    selected?: boolean;

}

/**
 * Interface for a class PeriodSelectorSettings
 */
export interface PeriodSelectorSettingsModel {

    /**
     * Height for the period selector.
     *
     * @default 43
     */

    height?: number;

    /**
     * vertical position of the period selector.
     *
     * @default 'Bottom'
     */

    position?: PeriodSelectorPosition;

    /**
     * Buttons
     */

    periods?: PeriodsModel[];

}