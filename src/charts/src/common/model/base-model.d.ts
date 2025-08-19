import { Property, ChildProperty, Browser, Complex, Collection } from '@syncfusion/ej2-base';import { Alignment, EmptyPointMode, PeriodSelectorPosition, RangeIntervalType, TextOverflow, TitlePosition } from '../utils/enum';import { FadeOutMode, TooltipPosition } from '../../chart/utils/enum';import { AccEmptyPointMode, ConnectorType } from '../../accumulation-chart/model/enum';

/**
 * Interface for a class Connector
 */
export interface ConnectorModel {

    /**
     * Specifies the type of connector line.
     * The available types are:
     * * Smooth
     * * Line
     *
     * @default 'Line'
     */

    type?: ConnectorType;

    /**
     * Specifies the color of the connector line, accepting values in hex or rgba as valid CSS color strings.
     *
     * @default null
     */

    color?: string;

    /**
     * Specifies the width of the connector line in pixels.
     *
     * @default 1
     */

    width?: number;

    /**
     * Specifies the length of the connector line in pixels.
     *
     * @default null
     */

    length?: string;

    /**
     * Specifies the dash pattern of the connector line.
     *
     * @default ''
     */

    dashArray?: string;

}

/**
 * Interface for a class Location
 */
export interface LocationModel {

    /**
     * Specifies the X coordinate position of the legend or tooltip in pixels.
     *
     * @default 0
     */

    x?: number;

    /**
     * Specifies the Y coordinate position of the legend or tooltip in pixels.
     *
     * @default 0
     */

    y?: number;

}

/**
 * Interface for a class Accessibility
 */
export interface AccessibilityModel {

    /**
     * Specifies the accessibility description of the chart element. This description is typically read by screen readers to give context to users.
     *
     * @default null
     */

    accessibilityDescription?: string;

    /**
     * Defines the accessibility role of the UI element, which helps screen readers understand the purpose of the element.
     *
     * @default null
     */

    accessibilityRole?: string;

    /**
     * Determines whether the chart elements can receive focus.
     *
     * @default true
     */

    focusable?: boolean;

    /**
     * Specifies the tab index for the chart elements.
     *
     * @default 0
     */

    tabIndex?: number;

}

/**
 * Interface for a class SeriesAccessibility
 */
export interface SeriesAccessibilityModel extends AccessibilityModel{

    /**
     * Accessibility description format for the chart element.
     *
     * @default null
     */

    accessibilityDescriptionFormat?: string;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Specifies the style of the text.
     *
     * @default 'Normal'
     */

    fontStyle?: string;

    /**
     * Specifies the size of the text.
     *
     * @default '16px'
     */

    size?: string;

    /**
     * Specifies the font weight of the text.
     *
     * @default 'Normal'
     */

    fontWeight?: string;

    /**
     * Specifies the color of the text.
     *
     * @default ''
     */

    color?: string;

    /**
     * Specifies the alignment of the text.
     *
     * @default 'Center'
     */

    textAlignment?: Alignment;

    /**
     * Specifies the font family for the text.
     */
    fontFamily?: string;

    /**
     * Specifies the opacity level for the text.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * Specifies how the chart title text should handle overflow.
     *
     * @default 'Wrap'
     */

    textOverflow?: TextOverflow;

}

/**
 * Interface for a class StackLabelsFont
 */
export interface StackLabelsFontModel {

    /**
     * Specifies the style of the text.
     *
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Specifies the size of the text.
     *
     * @default '16px'
     */
    size?: string;

    /**
     * Specifies the font weight of the text.
     *
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Specifies the color of the text.
     *
     * @default ''
     */
    color?: string;

    /**
     * Specifies the alignment of the text.
     *
     * @default 'Center'
     */
    textAlignment?: Alignment;

    /**
     * Specifies the font family for the text.
     */
    fontFamily?: string;

    /**
     * Specifies the opacity level for the text.
     *
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class CenterLabel
 */
export interface CenterLabelModel {

    /**
     * Defines the text to be placed at the center of the Pie and Donut chart.
     *
     * @default null
     */

    text?: string;

    /**
     * Defines the font style for the center label of the Pie and Donut charts.
     */

    textStyle?: FontModel;

    /**
     * Defines the format for the center label when the mouse hovers over the pie data.
     *
     * @default null
     */

    hoverTextFormat?: string;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * Specifies the color of the border, accepting values in hex or RGBA as valid CSS color strings.
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

    /**
     * Sets the length of dashes in the stroke of border.
     *
     * @default ''
     */

    dashArray?: string;

}

/**
 * Interface for a class Offset
 */
export interface OffsetModel {

    /**
     * Specifies the x value of the marker's position.
     *
     * @default 0
     */

    x?: number;

    /**
     * Specifies the y value of the marker's position.
     *
     * @default 0
     */

    y?: number;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * The left margin of the chart, specified in pixels.
     *
     * @default 10
     */

    left?: number;

    /**
     * The right margin of the chart, specified in pixels.
     *
     * @default 10
     */

    right?: number;

    /**
     * The top margin of the chart, specified in pixels.
     *
     * @default 10
     */

    top?: number;

    /**
     * The bottom margin of the chart, specified in pixels.
     *
     * @default 10
     */

    bottom?: number;

}

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * If set to true, the series will be animated on initial loading.
     *
     * @default true
     */

    enable?: boolean;

    /**
     * The duration of the animation in milliseconds.
     *
     * @default 1000
     */

    duration?: number;

    /**
     * The option to delay the animation of the series, specified in milliseconds.
     *
     * @default 0
     */

    delay?: number;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * If set to true, enables tooltips for the data points.
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
     * If set to true, a single tooltip will be displayed for each index.
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
     * Customizes the header text for the tooltip. By default, this property displays the series name.
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
     * This property defines the font family, size, style, weight, and color for the tooltip text.
     */

    textStyle?: FontModel;

    /**
     * Specifies the format for customizing the content of the tooltip.
     *
     * @default null.
     */

    format?: string;

    /**
     * A custom template used to format the tooltip content. Use `${x}` and `${y}` as placeholders for the corresponding data points.
     *
     * @default null.
     * @aspType string
     */

    template?: string | Function;

    /**
     * If set to true, the tooltip will animate as it moves from one point to another.
     *
     * @default true.
     */
    enableAnimation?: boolean;

    /**
     * Duration of the tooltip animation, specified in milliseconds.
     *
     * @default 300
     */

    duration?: number;

    /**
     * Duration of the fade-out animation for hiding the tooltip, in milliseconds.
     *
     * @default 1000
     */

    fadeOutDuration?: number;

    /**
     * Specifies the mode for the fade-out animation when hiding the tooltip.
     *
     * @default Move
     */

    fadeOutMode?: FadeOutMode;

    /**
     * Wraps the tooltip's long text based on the available space.
     > Note that this feature applies only to chart tooltips.
     *
     * @default false
     */

    enableTextWrap?: boolean;

    /**
     * Specifies whether the nearest points should be included in the shared tooltip.
     * By default, the nearest data points are displayed.
     * Set this property to false to exclude the nearest point.
     *
     * @default true
     */

    showNearestPoint?: boolean;

    /**
     * Options for customizing the tooltip borders, including the color and width of the tooltip's border.
     */

    border?: BorderModel;

    /**
     * Specifies the location of the tooltip relative to the chart.
     * If x is 20, the tooltip moves 20 pixels to the right of the chart.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     * tooltip: {
     *        enable: true,
     *        location: { x: 100, y: 150 }
     *  }
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     */

    location?: LocationModel;

    /**
     * When set to true, highlights all points in the hovered series while dimming points in other series for better focus and clarity.
     *
     * @default false.
     */
    enableHighlight?: boolean;

    /**
     * Enables or disables the display of tooltips for the nearest data point to the cursor.
     *
     * @default false.
     */

    showNearestTooltip?: boolean;

    /**
     * Specifies whether to display the header line in the tooltip.
     *
     * @default true
     */

    showHeaderLine?: boolean;

}

/**
 * Interface for a class EmptyPointSettings
 */
export interface EmptyPointSettingsModel {

    /**
     * Customizes the fill color for empty points in the series.
     *
     * @default null
     */

    fill?: string;

    /**
     * Options to customize the border for empty points in the series, including color and width.
     *
     * @default "{color: '', width: 0}"
     */

    border?: BorderModel;

    /**
     * Defines the mode for handling empty or missing data points in the series.
     * The available modes are:
     * * Gap - Displays empty points as gaps in the series.
     * * Zero - Displays empty points as zero values.
     * * Drop - Ignores empty points while rendering the series.
     * * Average - Displays empty points as the average of the previous and next points.
     *
     * @default Gap
     */

    mode?: EmptyPointMode;

}

/**
 * Interface for a class Indexes
 */
export interface IndexesModel {

    /**
     * Specifies the index of the series.
     *
     * @default 0
     * @aspType int
     */

    series?: number;

    /**
     * Specifies the index of the data point within the series.
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
     * Specifies the top-left corner radius value.
     *
     * @default 0
     */

    topLeft?: number;

    /**
     * Specifies the top-right corner radius value.
     *
     * @default 0
     */

    topRight?: number;

    /**
     * Specifies the bottom-left corner radius value.
     *
     * @default 0
     */

    bottomLeft?: number;

    /**
     * Specifies the bottom-right corner radius value.
     *
     * @default 0
     */

    bottomRight?: number;

}

/**
 * Interface for a class ContainerPadding
 */
export interface ContainerPaddingModel {

    /**
     * Defines the left padding for the legend container in pixels.
     *
     * @default 0
     */
    left?: number;

    /**
     * Defines the right padding for the legend container in pixels.
     *
     * @default 0
     */
    right?: number;

    /**
     * Defines the top padding for the legend container in pixels.
     *
     * @default 0
     */
    top?: number;

    /**
     * Defines the bottom padding for the legend container in pixels.
     *
     * @default 0
     */
    bottom?: number;

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
     * The `width` property defines the thickness of the border surrounding the chart title and subtitle.
     *
     * @default 0
     */

    width?: number;

    /**
     * Specifies the radius of the corners for the border.
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
     * The `fontStyle` property specifies the style of the text used for the chart title and subtitle.
     *
     * @default 'Normal'
     */

    fontStyle?: string;

    /**
     * Specifies the font size for the chart title and subtitle.
     *
     * @default '15px'
     */

    size?: string;

    /**
     * The `fontWeight` property specifies the weight (thickness) of the text used for the chart title and subtitle.
     *
     * @default '500'
     */

    fontWeight?: string;

    /**
     * The `color` property specifies the color of the text used for the chart title and subtitle.
     *
     * @default ''
     */

    color?: string;

    /**
     * The `textAlignment` property determines how the text is aligned within the specified area.
     *
     * @default 'Center'
     */

    textAlignment?: Alignment;

    /**
     * The `fontFamily` property specifies the font family for the text used in the chart title and subtitle.
     */
    fontFamily?: string;

    /**
     * Specifies the opacity for the text.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * The `textOverflow` property determines how the text in the chart title and subtitle behaves when it exceeds the available space.
     *
     * @default 'Wrap'
     */

    textOverflow?: TextOverflow;

    /**
     * Defines the position for the chart title and subtitle.
     * The available options are:
     * * Top: Displays the title and subtitle at the top of the chart.
     * * Left: Displays the title and subtitle at the left of the chart.
     * * Bottom: Displays the title and subtitle at the bottom of the chart.
     * * Right: Displays the title and subtitle at the right of the chart.
     * * Custom: Displays the title and subtitle based on the specified x and y values.
     *
     * @default 'Top'
     */

    position?: TitlePosition;

    /**
     * Defines the X coordinate for the chart title and subtitle.
     *
     * @default 0
     */

    x?: number;

    /**
     * Defines the Y coordinate for the chart title and subtitle.
     *
     * @default 0
     */

    y?: number;

    /**
     * The `background` property sets the background color of the chart title and subtitle.
     *
     * @default 'transparent'
     */

    background?: string;

    /**
     * The `border` property allows configuring the border settings for the chart title and subtitle.
     */

    border?: titleBorderModel;

    /**
     * Options to improve accessibility for chart title and subtitle elements.
     */
    accessibility?: AccessibilityModel;

}

/**
 * Interface for a class TitleStyleSettings
 */
export interface TitleStyleSettingsModel extends FontModel{

    /**
     * Defines the position for the chart title and subtitle.
     * The available options are:
     * * Top: Displays the title and subtitle at the top of the accumulation chart.
     * * Left: Displays the title and subtitle at the left of the accumulation chart.
     * * Bottom: Displays the title and subtitle at the bottom of the accumulation chart.
     * * Right: Displays the title and subtitle at the right of the accumulation chart.
     * * Custom: Displays the title and subtitle based on the specified x and y values.
     *
     * @default 'Top'
     */
    position?: TitlePosition;

    /**
     * Defines the X coordinate for the accumulation chart title and subtitle.
     *
     * @default 0
     */
    x?: number;

    /**
     * Defines the Y coordinate for the accumulation chart title and subtitle.
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
     * The `background` property accepts both hex color codes and rgba color values for customizing the chart area's background.
     *
     * @default 'transparent'
     */

    background?: string;

    /**
     * The `opacity` property controls the transparency of the background of the chart area.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * The background image of the chart area, specified as a URL or local image path.
     *
     * @default null
     */

    backgroundImage?: string;

    /**
     * Defines the width of the chart area element.
     * Accepts values in `percentage` or `pixels`.
     *
     * @default null
     */

    width?: string;

    /**
     * Defines the margin options for the chart area, specifying the space between the chart container and the chart area.
     * The margin object can customize the left, right, top, and bottom margins.
     *
     * @default {left: 0, right: 0, top: 0, bottom: 0}
     */

    margin?: MarginModel;

}

/**
 * Interface for a class DragSettings
 */
export interface DragSettingsModel {

    /**
     * If set to true, dragging of the points is enabled.
     * If set to false, dragging is disabled.
     *
     * @default false
     */

    enable?: boolean;

    /**
     * Sets the minimum y-coordinate value that a point can be dragged to.
     *
     * @default null
     */

    minY?: number;

    /**
     * Sets the maximum y-coordinate value that a point can be dragged to.
     *
     * @default null
     */

    maxY?: number;

    /**
     * Sets the color of the point while it is being edited.
     *
     * @default null
     */

    fill?: string;

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
     * Vertical position of the period selector.
     *
     * @default 'Bottom'
     */

    position?: PeriodSelectorPosition;

    /**
     * Specify the attributes of each period.
     */

    periods?: PeriodsModel[];

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
     * Specifies the tooltip position. They are:
     * * fixed - Place the tooltip in the fixed position.
     * * nearest- Tooltip moves along with the mouse.
     *
     * @default 'Fixed'
     */

    position?: TooltipPosition;

    /**
     * Enables or disables the display of tooltips for the nearest data point to the cursor.
     *
     * @default false.
     */

    showNearestTooltip?: boolean;

    /**
     * Specifies whether to display the header line in the tooltip.
     *
     * @default true
     */

    showHeaderLine?: boolean;

}

/**
 * Interface for a class Index
 * @private
 */
export interface IndexModel {

}