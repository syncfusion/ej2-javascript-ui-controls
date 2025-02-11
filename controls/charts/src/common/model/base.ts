import { Property, ChildProperty, Browser, Complex, Collection } from '@syncfusion/ej2-base';
import { Alignment, EmptyPointMode, PeriodSelectorPosition, RangeIntervalType, TextOverflow, TitlePosition } from '../utils/enum';
import { FadeOutMode, TooltipPosition } from '../../chart/utils/enum';
import { AccEmptyPointMode, ConnectorType } from '../../accumulation-chart/model/enum';
import { BorderModel, FontModel, LocationModel, PeriodsModel, titleBorderModel, MarginModel, AccessibilityModel } from './base-model';

/**
 * The `Connector` class configures the appearance and properties of connectors in chart controls.
 */
export class Connector extends ChildProperty<Connector> {
    /**
     * Specifies the type of connector line.
     * The available types are:
     * * Smooth
     * * Line
     *
     * @default 'Line'
     */

    @Property('Line')
    public type: ConnectorType;

    /**
     * Specifies the color of the connector line, accepting values in hex or rgba as valid CSS color strings.
     *
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Specifies the width of the connector line in pixels.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * Specifies the length of the connector line in pixels.
     *
     * @default null
     */

    @Property(null)
    public length: string;

    /**
     * Specifies the dash pattern of the connector line.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;
}

/**
 * Configures the location for the legend and tooltip in the chart.
 */
export class Location extends ChildProperty<Location>  {
    /**
     * Specifies the X coordinate position of the legend or tooltip in pixels.
     *
     * @default 0
     */

    @Property(0)
    public x: number;

    /**
     * Specifies the Y coordinate position of the legend or tooltip in pixels.
     *
     * @default 0
     */

    @Property(0)
    public y: number;
}

/**
 * The `Accessibility` class configures accessibility options for chart controls.
 */
export class Accessibility extends ChildProperty<Accessibility> {
    /**
     * Specifies the accessibility description of the chart element. This description is typically read by screen readers to give context to users.
     *
     * @default null
     */

    @Property(null)
    public accessibilityDescription: string;

    /**
     * Defines the accessibility role of the UI element, which helps screen readers understand the purpose of the element.
     *
     * @default null
     */

    @Property(null)
    public accessibilityRole: string;

    /**
     * Determines whether the chart elements can receive focus.
     *
     * @default true
     */

    @Property(true)
    public focusable: boolean;

    /**
     * Specifies the tab index for the chart elements.
     *
     * @default 0
     */

    @Property(0)
    public tabIndex: number;

}

/**
 * The `SeriesAccessibility` class configures accessibility options specifically for chart series elements.
 */
export class SeriesAccessibility extends Accessibility {
    /**
     * Accessibility description format for the chart element.
     *
     * @default null
     */

    @Property(null)
    public accessibilityDescriptionFormat: string;

}

/**
 * The `Font` class provides configuration options for customizing the fonts used in the charts.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Specifies the style of the text.
     *
     * @default 'Normal'
     */

    @Property('Normal')
    public fontStyle: string;

    /**
     * Specifies the size of the text.
     *
     * @default '16px'
     */

    @Property('16px')
    public size: string;

    /**
     * Specifies the font weight of the text.
     *
     * @default 'Normal'
     */

    @Property('Normal')
    public fontWeight: string;

    /**
     * Specifies the color of the text.
     *
     * @default ''
     */

    @Property('')
    public color: string;

    /**
     * Specifies the alignment of the text.
     *
     * @default 'Center'
     */

    @Property('Center')
    public textAlignment: Alignment;

    /**
     * Specifies the font family for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Specifies the opacity level for the text.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * Specifies how the chart title text should handle overflow.
     *
     * @default 'Wrap'
     */

    @Property('Wrap')
    public textOverflow: TextOverflow;

}

/**
 * Options to customize the center label of the Pie and Donut charts.
 *
 * @default {}
 */
export class CenterLabel extends ChildProperty<CenterLabel> {

    /**
     * Defines the text to be placed at the center of the Pie and Donut chart.
     *
     * @default null
     */

    @Property(null)
    public text: string;

    /**
     * Defines the font style for the center label of the Pie and Donut charts.
     */

    @Complex<FontModel>({ fontFamily: null, size: '16px', fontStyle: 'Normal', fontWeight: '600', color: null }, Font)
    public textStyle: FontModel;

    /**
     * Defines the format for the center label when the mouse hovers over the pie data.
     *
     * @default null
     */

    @Property(null)
    public hoverTextFormat: string;
}

/**
 * The `Border` class provides configuration options for setting the borders in a chart.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Specifies the color of the border, accepting values in hex or RGBA as valid CSS color strings.
     *
     * @default ''
     */

    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * Sets the length of dashes in the stroke of border.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

}
/**
 * The `Offset` class provides options to adjust the position of the marker relative to its default location.
 */
export class Offset extends ChildProperty<Offset> {

    /**
     * Specifies the x value of the marker's position.
     *
     * @default 0
     */

    @Property(0)
    public x: number;

    /**
     * Specifies the y value of the marker's position.
     *
     * @default 0
     */

    @Property(0)
    public y: number;

}

/**
 * The `Margin` class enables configuration of the space around the chart's content.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * The left margin of the chart, specified in pixels.
     *
     * @default 10
     */

    @Property(Browser.isDevice ? 5 : 10)
    public left: number;

    /**
     * The right margin of the chart, specified in pixels.
     *
     * @default 10
     */

    @Property(Browser.isDevice ? 5 : 10)
    public right: number;

    /**
     * The top margin of the chart, specified in pixels.
     *
     * @default 10
     */

    @Property(Browser.isDevice ? 5 : 10)
    public top: number;

    /**
     * The bottom margin of the chart, specified in pixels.
     *
     * @default 10
     */

    @Property(Browser.isDevice ? 5 : 10)
    public bottom: number;
}

/**
 * Configures the animation behavior for the chart series.
 */

export class Animation extends ChildProperty<Animation> {

    /**
     * If set to true, the series will be animated on initial loading.
     *
     * @default true
     */

    @Property(true)
    public enable: boolean;

    /**
     * The duration of the animation in milliseconds.
     *
     * @default 1000
     */

    @Property(1000)
    public duration: number;

    /**
     * The option to delay the animation of the series, specified in milliseconds.
     *
     * @default 0
     */

    @Property(0)
    public delay: number;
}

export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * If set to true, enables tooltips for the data points.
     *
     * @default false.
     */

    @Property(false)
    public enable: boolean;

    /**
     * If set to true, enables the marker in the chart tooltip.
     *
     * @default true.
     */

    @Property(true)
    public enableMarker: boolean;

    /**
     * If set to true, a single tooltip will be displayed for each index.
     *
     * @default false.
     */

    @Property(false)
    public shared: boolean;

    /**
     * The fill color of the tooltip, specified as a valid CSS color string in hex or rgba format.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Customizes the header text for the tooltip. By default, this property displays the series name.
     *
     * @default null
     */

    @Property(null)
    public header: string;

    /**
     * The opacity of the tooltip, expressed as a numerical value.
     *
     * @default null
     */

    @Property(null)
    public opacity: number;

    /**
     * This property defines the font family, size, style, weight, and color for the tooltip text.
     */

    @Complex<FontModel>({ fontFamily: null, size: null, fontStyle: 'Normal', fontWeight: null, color: null }, Font)
    public textStyle: FontModel;

    /**
     * Specifies the format for customizing the content of the tooltip.
     *
     * @default null.
     */

    @Property(null)
    public format: string;

    /**
     * A custom template used to format the tooltip content. Use `${x}` and `${y}` as placeholders for the corresponding data points.
     *
     * @default null.
     * @aspType string
     */

    @Property(null)
    public template: string | Function;

    /**
     * If set to true, the tooltip will animate as it moves from one point to another.
     *
     * @default true.
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Duration of the tooltip animation, specified in milliseconds.
     *
     * @default 300
     */

    @Property(300)
    public duration: number;

    /**
     * Duration of the fade-out animation for hiding the tooltip, in milliseconds.
     *
     * @default 1000
     */

    @Property(1000)
    public fadeOutDuration: number;

    /**
     * Specifies the mode for the fade-out animation when hiding the tooltip.
     *
     * @default Move
     */

    @Property('Move')
    public fadeOutMode: FadeOutMode;

    /**
     * Wraps the tooltip's long text based on the available space.
     > Note that this feature applies only to chart tooltips.
     *
     * @default false
     */

    @Property(false)
    public enableTextWrap: boolean;

    /**
     * Specifies whether the nearest points should be included in the shared tooltip.
     * By default, the nearest data points are displayed.
     * Set this property to false to exclude the nearest point.
     *
     * @default true
     */

    @Property(true)
    public showNearestPoint: boolean;

    /**
     * Options for customizing the tooltip borders, including the color and width of the tooltip's border.
     */

    @Complex<BorderModel>({ color: null, width: null }, Border)
    public border: BorderModel;

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

    @Complex<LocationModel>({ x: null, y: null }, Location)
    public location: LocationModel;

    /**
     * When set to true, highlights all points in the hovered series while dimming points in other series for better focus and clarity.
     *
     * @default false.
     */
    @Property(false)
    public enableHighlight: boolean;
}

/**
 * This class configures the appearance and behavior of points with empty data in the series.
 */

export class EmptyPointSettings extends ChildProperty<EmptyPointSettings> {

    /**
     * Customizes the fill color for empty points in the series.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Options to customize the border for empty points in the series, including color and width.
     *
     * @default "{color: 'transparent', width: 0}"
     */

    @Complex<BorderModel>({ color: '', width: 0 }, Border)
    public border: BorderModel;

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

    @Property('Gap')
    public mode: EmptyPointMode | AccEmptyPointMode;
}

/**
 * Specifies the indexes for the series and data points.
 *
 * @public
 */

export class Indexes extends ChildProperty<Indexes> {
    /**
     * Specifies the index of the series.
     *
     * @default 0
     * @aspType int
     */

    @Property(0)
    public series: number;

    /**
     * Specifies the index of the data point within the series.
     *
     * @default 0
     * @aspType int
     */

    @Property(0)
    public point: number;

}

/**
 * The `CornerRadius` class provides options to customize the rounding of the corners for columns in the column series.
 */
export class CornerRadius extends ChildProperty<CornerRadius> {
    /**
     * Specifies the top-left corner radius value.
     *
     * @default 0
     */

    @Property(0)
    public topLeft: number;
    /**
     * Specifies the top-right corner radius value.
     *
     * @default 0
     */

    @Property(0)
    public topRight: number;
    /**
     * Specifies the bottom-left corner radius value.
     *
     * @default 0
     */

    @Property(0)
    public bottomLeft: number;
    /**
     * Specifies the bottom-right corner radius value.
     *
     * @default 0
     */

    @Property(0)
    public bottomRight: number;
}

/**
 * Configures the padding around the chart legend container.
 */
export class ContainerPadding extends ChildProperty<ContainerPadding> {

    /**
     * Defines the left padding for the legend container in pixels.
     *
     * @default 0
     */
    @Property(0)
    public left: number;

    /**
     * Defines the right padding for the legend container in pixels.
     *
     * @default 0
     */
    @Property(0)
    public right: number;

    /**
     * Defines the top padding for the legend container in pixels.
     *
     * @default 0
     */
    @Property(0)
    public top: number;

    /**
     * Defines the bottom padding for the legend container in pixels.
     *
     * @default 0
     */
    @Property(0)
    public bottom: number;
}

/**
 * Configures the borders of the chart title and subtitle.
 */
export class titleBorder extends ChildProperty<titleBorder> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public color: string;

    /**
     * The `width` property defines the thickness of the border surrounding the chart title and subtitle.
     *
     * @default 0
     */

    @Property(0)
    public width: number;

    /**
     * Specifies the radius of the corners for the border.
     *
     * @default 0.8
     */

    @Property(0.8)
    public cornerRadius: number;

}

/**
 * The `titleSettings` class provides options to customize the title and subtitle displayed in the chart.
 */
export class titleSettings extends ChildProperty<titleSettings> {

    /**
     * The `fontStyle` property specifies the style of the text used for the chart title and subtitle.
     *
     * @default 'Normal'
     */

    @Property('Normal')
    public fontStyle: string;

    /**
     * Specifies the font size for the chart title and subtitle.
     *
     * @default '15px'
     */

    @Property('15px')
    public size: string;

    /**
     * The `fontWeight` property specifies the weight (thickness) of the text used for the chart title and subtitle.
     *
     * @default '500'
     */

    @Property('500')
    public fontWeight: string;

    /**
     * The `color` property specifies the color of the text used for the chart title and subtitle.
     *
     * @default ''
     */

    @Property('')
    public color: string;

    /**
     * The `textAlignment` property determines how the text is aligned within the specified area.
     *
     * @default 'Center'
     */

    @Property('Center')
    public textAlignment: Alignment;

    /**
     * The `fontFamily` property specifies the font family for the text used in the chart title and subtitle.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Specifies the opacity for the text.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * The `textOverflow` property determines how the text in the chart title and subtitle behaves when it exceeds the available space.
     *
     * @default 'Wrap'
     */

    @Property('Wrap')
    public textOverflow: TextOverflow;

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

    @Property('Top')
    public position: TitlePosition;

    /**
     * Defines the X coordinate for the chart title and subtitle.
     *
     * @default 0
     */

    @Property(0)
    public x: number;

    /**
     * Defines the Y coordinate for the chart title and subtitle.
     *
     * @default 0
     */

    @Property(0)
    public y: number;

    /**
     * The `background` property sets the background color of the chart title and subtitle.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public background: string;

    /**
     * The `border` property allows configuring the border settings for the chart title and subtitle.
     */

    @Complex<titleBorderModel>({}, titleBorder)
    public border: titleBorderModel;

    /**
     * Options to improve accessibility for chart title and subtitle elements.
     */
    @Complex<AccessibilityModel>({}, Accessibility)
    public accessibility: AccessibilityModel;

}

/**
 * The `ChartArea` class provides properties to customize the appearance and layout of the chart's display area.
 */
export class ChartArea extends ChildProperty<ChartArea> {

    /**
     * Options to customize the border of the chart area.
     */

    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * The `background` property accepts both hex color codes and rgba color values for customizing the chart area's background.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public background: string;

    /**
     * The `opacity` property controls the transparency of the background of the chart area.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * The background image of the chart area, specified as a URL or local image path.
     *
     * @default null
     */

    @Property(null)
    public backgroundImage: string;

    /**
     * Defines the width of the chart area element.
     * Accepts values in `percentage` or `pixels`.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * Defines the margin options for the chart area, specifying the space between the chart container and the chart area.
     * The margin object can customize the left, right, top, and bottom margins.
     *
     * @default {left: 0, right: 0, top: 0, bottom: 0}
     */

    @Complex<MarginModel>({left: 0, right: 0, top: 0, bottom: 0}, Margin)
    public margin: MarginModel;

}

/**
 * Configures the drag settings for series in the chart.
 */

export class DragSettings extends ChildProperty<DragSettings> {

    /**
     * If set to true, dragging of the points is enabled.
     * If set to false, dragging is disabled.
     *
     * @default false
     */

    @Property(false)
    public enable: boolean;

    /**
     * Sets the minimum y-coordinate value that a point can be dragged to.
     *
     * @default null
     */

    @Property(null)
    public minY: number;

    /**
     * Sets the maximum y-coordinate value that a point can be dragged to.
     *
     * @default null
     */

    @Property(null)
    public maxY: number;

    /**
     * Sets the color of the point while it is being edited.
     *
     * @default null
     */

    @Property(null)
    public fill: string;
}

/**
 * Configures the button settings in period selector.
 */
export class Periods extends ChildProperty<Periods> {
    /**
     * IntervalType of button.
     *
     * @default 'Years'
     */

    @Property('Years')
    public intervalType: RangeIntervalType;

    /**
     * Count value for the button.
     *
     * @default 1
     */

    @Property(1)
    public interval: number;

    /**
     * Text to be displayed on the button.
     *
     * @default null
     */

    @Property(null)
    public text: string;

    /**
     * To select the default period.
     *
     * @default false
     */

    @Property(false)
    public selected: boolean;
}

/**
 * Configures the period selector settings.
 */
export class PeriodSelectorSettings extends ChildProperty<PeriodSelectorSettings> {

    /**
     * Height for the period selector.
     *
     * @default 43
     */

    @Property(43)
    public height: number;

    /**
     * Vertical position of the period selector.
     *
     * @default 'Bottom'
     */

    @Property('Bottom')
    public position: PeriodSelectorPosition;

    /**
     * Specify the attributes of each period.
     */

    @Collection<PeriodsModel>([], Periods)
    public periods: PeriodsModel[];
}

export class StockTooltipSettings extends ChildProperty<StockTooltipSettings> {
    /**
     * Enables / Disables the visibility of the tooltip.
     *
     * @default false.
     */

    @Property(false)
    public enable: boolean;

    /**
     * Enables / Disables the visibility of the marker.
     *
     * @default true.
     */

    @Property(true)
    public enableMarker: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     *
     * @default false.
     */

    @Property(false)
    public shared: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Header for tooltip. By default, the shared tooltip displays the point x value and the series name for each individual tooltip.
     *
     * @default null
     */

    @Property(null)
    public header: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 0.75
     */

    @Property(0.75)
    public opacity: number;

    /**
     * Options to customize the ToolTip text.
     */

    @Complex<FontModel>({fontFamily: null, size: '12px', fontStyle: 'Normal', fontWeight: null, color: null}, Font)
    public textStyle: FontModel;

    /**
     * Format the ToolTip content.
     *
     * @default null.
     */

    @Property(null)
    public format: string;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     *
     * @default null.
     * @aspType string
     */

    @Property(null)
    public template: string | Function;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.
     *
     * @default true.
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Duration for the ToolTip animation.
     *
     * @default 300
     */

    @Property(300)
    public duration: number;

    /**
     * Fade Out duration for the ToolTip hide.
     *
     * @default 1000
     */

    @Property(1000)
    public fadeOutDuration: number;

    /**
     * Fade Out duration for the Tooltip hide.
     *
     * @default Move
     */

    @Property('Move')
    public fadeOutMode: FadeOutMode;

    /**
     * To wrap the tooltip long text based on available space.
     * This is only application for chart tooltip.
     *
     * @default false
     */

    @Property(false)
    public enableTextWrap: boolean;

    /**
     * By default, the nearest points will be included in the shared tooltip; however, you can set it to false to exclude the nearest value from the tooltip.
     *
     * @default true
     */

    @Property(true)
    public showNearestPoint: boolean;

    /**
     * Options to customize tooltip borders.
     */

    @Complex<BorderModel>({ color: null, width: null }, Border)
    public border: BorderModel;

    /**
     * Specifies the tooltip position. They are:
     * * fixed - Place the tooltip in the fixed position.
     * * nearest- Tooltip moves along with the mouse.
     *
     * @default 'Fixed'
     */

    @Property('Fixed')
    public position: TooltipPosition;

}

/**
 * @private
 */
export class Index {
    public series: number;
    public point: number;
    constructor(seriesIndex: number, pointIndex?: number) {
        this.series = seriesIndex;
        this.point = pointIndex;
    }
}

