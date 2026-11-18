import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';import { Alignment, LegendPosition } from '../../common/utils/enum';import { BorderModel, FontModel, LocationModel, MarginModel } from '../../common/model/base-model';import { Border, Font, Location, Margin } from '../../common/model/base';import { SankeyTextStyle, SankeyTooltipFadeOutMode } from './sankey-interface';import { ColorType } from './sankey-enum';

/**
 * Interface for a class SankeyDataLabel
 */
export interface SankeyDataLabelModel {

    /**
     * Options for customizing the data label of the Sankey
     * node.
     */
    text?: string;

    /**
     * Adds space around text for better placement.
     *
     * @default null
     */
    padding?: number;

}

/**
 * Interface for a class SankeyLabelSettings
 */
export interface SankeyLabelSettingsModel {

    /**
     * Shows or hides labels.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Controls label size.
     *
     * @default '12px'
     */
    fontSize?: string | number;

    /**
     * Sets text color for labels.
     *
     * @default ''
     */
    color?: string;

    /**
     * Applies a specific font family to labels.
     *
     * @default null
     */
    fontFamily?: string;

    /**
     * Sets text weight (for example, 400 for normal, 700 for bold).
     *
     * @default '400'
     */
    fontWeight?: string;

    /**
     * Adds space around text for better placement.
     *
     * @default 10
     */
    padding?: number;

    /**
     * Enables text styles such as italic.
     *
     * @default 'normal'
     */
    fontStyle?: string;

}

/**
 * Interface for a class SankeyNode
 */
export interface SankeyNodeModel {

    /**
     * Specifies the color applied to the node.
     * The node color is applied based on the current theme if this property is not specified.
     *
     * @default null
     */
    color?: string;

    /**
     * A unique string identifier for the node.
     * Ensure the `id` is unique across all nodes in the Sankey chart.
     *
     * @default null
     */
    id?: string;

    /**
     * Options for customizing the data label of the Sankey node.
     */
    label?: SankeyDataLabelModel;

    /**
     * Specifies a custom offset position for the node.
     * This allows shifting the node horizontally (in Horizontal orientation) or vertically (in Vertical orientation), relative to its computed layout position.
     *
     * @default 0
     */
    offset?: number;

}

/**
 * Interface for a class SankeyLink
 */
export interface SankeyLinkModel {

    /**
     * Specifies the unique identifier of the source node for this
     * link.
     * This should match the `id` of an existing Sankey node.
     *
     * @default null
     */
    sourceId?: string;

    /**
     * Specifies the unique identifier of the target node for this link.
     * This should match the `id` of an existing Sankey node.
     *
     * @default null
     */
    targetId?: string;

    /**
     * Defines the weight or value of the link.
     * This determines the thickness of the link in the Sankey diagram.
     *
     * @default null
     */
    value?: number;

}

/**
 * Interface for a class SankeyLinkSettings
 */
export interface SankeyLinkSettingsModel {

    /**
     * Specifies the opacity of the link.
     *
     * @default 0.35
     */
    opacity?: number;

    /**
     * Specifies the opacity of the link when highlighted.
     *
     * @default 1
     */
    highlightOpacity?: number;

    /**
     * Specifies the opacity of the link when inactive.
     *
     * @default 0.3
     */
    inactiveOpacity?: number;

    /**
     * Link curvature factor (0..1), 0 = straight line, 1 = full curve.
     *
     * @default 0.55
     */
    curvature?: number;

    /**
     * Specifies the color blending type for the links.
     *
     * @default 'Blend'
     */
    colorType?: ColorType;

}

/**
 * Interface for a class SankeyNodeSettings
 */
export interface SankeyNodeSettingsModel {

    /**
     * Specifies the stroke color of the node.
     *
     * @default ''
     */
    stroke?: string;

    /**
     * Specifies the fill color of the node.
     *
     * @default null
     */
    fill?: string;

    /**
     * Specifies the stroke width of the node.
     *
     * @default 1
     */
    strokeWidth?: number;

    /**
     * Specifies the padding around the node content.
     *
     * @default 10
     */
    padding?: number;

    /**
     * Specifies the width of the node rectangle in pixels.
     *
     * @default 20
     */
    width?: number;

    /**
     * Specifies the opacity of the node.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Specifies the opacity of the node when highlighted.
     *
     * @default 1
     */
    highlightOpacity?: number;

    /**
     * Specifies the opacity of the node when inactive.
     *
     * @default 0.3
     */
    inactiveOpacity?: number;

}

/**
 * Interface for a class SankeyTitleStyle
 */
export interface SankeyTitleStyleModel {

    /**
     * Specifies the font size for the title text.
     *
     * @default null
     */
    size?: string;

    /**
     * Specifies the weight of the title text.
     *
     * @default null
     */
    fontWeight?: string;

    /**
     * Specifies the font family for the title text.
     *
     * @default null
     */
    fontFamily?: string;

    /**
     * Specifies the color of the title text.
     *
     * @default null
     */
    color?: string;

    /**
     * Specifies the font style for the title text.
     *
     * @default 'normal'
     */
    fontStyle?: string;

    /**
     * Specifies the opacity of the title text.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * The `textAlignment` property determines how the text is aligned within the specified area.
     *
     * @default 'Center'
     */
    textAlignment?: Alignment;

}

/**
 * Interface for a class SankeyTooltipSettings
 */
export interface SankeyTooltipSettingsModel {

    /**
     * Enables or disables the tooltip display.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Background fill color of the tooltip.
     *
     * @default null
     */
    fill?: string;

    /**
     * Opacity of the tooltip container.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Text style used within the tooltip.
     *
     * @default null
     */
    textStyle?: SankeyTextStyle;

    /**
     * Format string for node tooltips.
     *
     * @default '$name : $value'
     */
    nodeFormat?: string;

    /**
     * Format string for link tooltips.
     *
     * @default '$start.name $start.value → $target.name $target.value'
     */
    linkFormat?: string;

    /**
     * Custom template or rendering function for node tooltips.
     *
     * @default null
     */
    nodeTemplate?: string | Function;

    /**
     * Custom template or rendering function for link tooltips.
     *
     * @default null
     */
    linkTemplate?: string | Function;

    /**
     * Enables or disables tooltip animation.
     *
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Duration of the tooltip show animation (in ms).
     *
     * @default 300
     */
    duration?: number;

    /**
     * Duration of the tooltip fade-out animation (in ms).
     *
     * @default 1000
     */
    fadeOutDuration?: number;

    /**
     * Specifies the mode for the fade-out animation when hiding the tooltip.
     *
     * @default Move
     */
    fadeOutMode?: SankeyTooltipFadeOutMode;

}

/**
 * Interface for a class SankeyLegendSettings
 */
export interface SankeyLegendSettingsModel {

    /**
     * Enables or disables the legend display.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Specifies the width of the legend.
     *
     * @default null
     */
    width?: string;

    /**
     * Specifies the height of the legend.
     *
     * @default null
     */
    height?: string;

    /**
     * Specifies the position of the legend in the chart.
     *
     * @default 'Auto'
     */
    position?: LegendPosition;

    /**
     * Padding around the legend container.
     *
     * @default 8
     */
    padding?: number;

    /**
     * Padding between legend items.
     *
     * @default null
     */
    itemPadding?: number;

    /**
     * Defines the text styling options applied to legend labels in the Sankey diagram.
     */
    textStyle?: FontModel;

    /**
     * Size of the legend shape (icon).
     *
     * @default 10
     */
    shapeWidth?: number;

    /**
     * Size of the legend shape (icon).
     *
     * @default 10
     */
    shapeHeight?: number;

    /**
     * Options for customizing the border of the legend.
     */

    border?: BorderModel;

    /**
     * Options to configure the margins around the component.
     */
    margin?: MarginModel;

    /**
     * Padding between the legend shape and its text.
     *
     * @default 8
     */
    shapePadding?: number;

    /**
     * Background color of the legend.
     *
     * @default 'transparent'
     */
    background?: string;

    /**
     * Opacity of the legend container.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Enables or disables highlighting of legend items on interaction.
     *
     * @default true
     */
    enableHighlight?: boolean;

    /**
     * Title text for the legend.
     *
     * @default null
     */
    title?: string;

    /**
     * Defines the font styling used for rendering the legend title in the Sankey diagram.
     */
    titleStyle?: FontModel;

    /**
     * Specifies whether the legend layout should be inverted.
     *
     * @default false
     */
    isInversed?: boolean;

    /**
     * Specifies whether the legend items should be displayed in reverse order.
     *
     * @default false
     */
    reverse?: boolean;

    /**
     * Specifies the location of the legend relative to the Sankey chart.
     * If x is 20, the legend moves 20 pixels to the right of the Sankey chart.
     > Note that the `position` must be set to `Custom` for this feature to work.
     * ```html
     * <div id='Sankey'></div>
     * ```
     * ```typescript
     * let sankey: Sankey = new Sankey({
     * ...
     *   legendSettings: {
     *           visible: true,
     *           position: 'Custom',
     *           location: { x: 100, y: 150 }
     *   }
     * ...
     * });
     * sankey.appendTo('#Sankey');
     * ```
     */
    location?: LocationModel;

}