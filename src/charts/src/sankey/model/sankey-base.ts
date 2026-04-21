import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';
import { Alignment, LegendPosition } from '../../common/utils/enum';
import { BorderModel, FontModel, LocationModel, MarginModel } from '../../common/model/base-model';
import { Border, Font, Location, Margin } from '../../common/model/base';
import { SankeyTextStyle, SankeyTooltipFadeOutMode } from './sankey-interface';
import { ColorType } from './sankey-enum';
import { SankeyDataLabelModel } from './sankey-base-model';

/**
 * Configures label settings for Sankey nodes to customize their appearance and text styling.
 */
export class SankeyDataLabel extends ChildProperty<SankeyDataLabel> {

    /**
     * Options for customizing the data label of the Sankey
     * node.
     */
    @Property(null)
    public text: string;

    /**
     * Adds space around text for better placement.
     *
     * @default null
     */
    @Property(null)
    public padding: number;
}

/**
 * Configures label settings for Sankey nodes to customize their appearance and text styling.
 */
export class SankeyLabelSettings extends ChildProperty<SankeyLabelSettings> {

    /**
     * Shows or hides labels.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Controls label size.
     *
     * @default '12px'
     */
    @Property('12px')
    public fontSize: string | number;

    /**
     * Sets text color for labels.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Applies a specific font family to labels.
     *
     * @default null
     */
    @Property(null)
    public fontFamily: string;

    /**
     * Sets text weight (for example, 400 for normal, 700 for bold).
     *
     * @default '400'
     */
    @Property('400')
    public fontWeight: string;

    /**
     * Adds space around text for better placement.
     *
     * @default 10
     */
    @Property(10)
    public padding: number;

    /**
     * Enables text styles such as italic.
     *
     * @default 'normal'
     */
    @Property('normal')
    public fontStyle: string;
}

/**
 * Defines a Sankey node item.
 */
export class SankeyNode extends ChildProperty<SankeyNode> {

    /**
     * Specifies the color applied to the node.
     * The node color is applied based on the current theme if this property is not specified.
     *
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * A unique string identifier for the node.
     * Ensure the `id` is unique across all nodes in the Sankey chart.
     *
     * @default null
     */
    @Property(null)
    public id: string;

    /**
     * Options for customizing the data label of the Sankey node.
     */
    @Complex<SankeyDataLabelModel>({}, SankeyDataLabel)
    public label: SankeyDataLabelModel;

    /**
     * Specifies a custom offset position for the node.
     * This allows shifting the node horizontally (in Horizontal orientation) or vertically (in Vertical orientation), relative to its computed layout position.
     *
     * @default 0
     */
    @Property(0)
    public offset: number;
}

/**
 * Represents a single link (edge) in a Sankey diagram. A link connects a source node to a target node and carries a quantitative flow between them.
 */
export class SankeyLink extends ChildProperty<SankeyLink> {

    /**
     * Specifies the unique identifier of the source node for this
     * link.
     * This should match the `id` of an existing Sankey node.
     *
     * @default null
     */
    @Property(null)
    public sourceId: string;

    /**
     * Specifies the unique identifier of the target node for this link.
     * This should match the `id` of an existing Sankey node.
     *
     * @default null
     */
    @Property(null)
    public targetId: string;

    /**
     * Defines the weight or value of the link.
     * This determines the thickness of the link in the Sankey diagram.
     *
     * @default null
     */
    @Property(null)
    public value: number;
}

/**
 * Configures link style settings for Sankey diagram links to customize their appearance and behavior.
 */
export class SankeyLinkSettings extends ChildProperty<SankeyLinkSettings> {

    /**
     * Specifies the opacity of the link.
     *
     * @default 0.35
     */
    @Property(0.35)
    public opacity: number;

    /**
     * Specifies the opacity of the link when highlighted.
     *
     * @default 1
     */
    @Property(1)
    public highlightOpacity: number;

    /**
     * Specifies the opacity of the link when inactive.
     *
     * @default 0.3
     */
    @Property(0.3)
    public inactiveOpacity: number;

    /**
     * Link curvature factor (0..1), 0 = straight line, 1 = full curve.
     *
     * @default 0.55
     */
    @Property(0.55)
    public curvature: number;

    /**
     * Specifies the color blending type for the links.
     *
     * @default 'Blend'
     */
    @Property('Blend')
    public colorType: ColorType;
}

/**
 * Configures node style settings for Sankey nodes to customize their appearance and styling.
 */
export class SankeyNodeSettings extends ChildProperty<SankeyNodeSettings> {

    /**
     * Specifies the stroke color of the node.
     *
     * @default ''
     */
    @Property('')
    public stroke: string;

    /**
     * Specifies the fill color of the node.
     *
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Specifies the stroke width of the node.
     *
     * @default 1
     */
    @Property(1)
    public strokeWidth: number;

    /**
     * Specifies the padding around the node content.
     *
     * @default 10
     */
    @Property(10)
    public padding: number;

    /**
     * Specifies the width of the node rectangle in pixels.
     *
     * @default 20
     */
    @Property(20)
    public width: number;

    /**
     * Specifies the opacity of the node.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Specifies the opacity of the node when highlighted.
     *
     * @default 1
     */
    @Property(1)
    public highlightOpacity: number;

    /**
     * Specifies the opacity of the node when inactive.
     *
     * @default 0.3
     */
    @Property(0.3)
    public inactiveOpacity: number;
}

/**
 * Represents the text style settings used for rendering the title of a Sankey diagram.
 */
export class SankeyTitleStyle extends ChildProperty<SankeyTitleStyle> {

    /**
     * Specifies the font size for the title text.
     *
     * @default null
     */
    @Property(null)
    public size: string;

    /**
     * Specifies the weight of the title text.
     *
     * @default null
     */
    @Property(null)
    public fontWeight: string;

    /**
     * Specifies the font family for the title text.
     *
     * @default null
     */
    @Property(null)
    public fontFamily: string;

    /**
     * Specifies the color of the title text.
     *
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Specifies the font style for the title text.
     *
     * @default 'normal'
     */
    @Property('normal')
    public fontStyle: string;

    /**
     * Specifies the opacity of the title text.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * The `textAlignment` property determines how the text is aligned within the specified area.
     *
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

}

/**
 * Configures the tooltip behavior and appearance for the Sankey diagram.
 */
export class SankeyTooltipSettings extends ChildProperty<SankeyTooltipSettings> {

    /**
     * Enables or disables the tooltip display.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Background fill color of the tooltip.
     *
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Opacity of the tooltip container.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Text style used within the tooltip.
     *
     * @default null
     */
    @Property(null)
    public textStyle: SankeyTextStyle;

    /**
     * Format string for node tooltips.
     *
     * @default '$name : $value'
     */
    @Property('$name : $value')
    public nodeFormat: string;

    /**
     * Format string for link tooltips.
     *
     * @default '$start.name $start.value → $target.name $target.value'
     */
    @Property('$start.name $start.value → $target.name $target.value')
    public linkFormat: string;

    /**
     * Custom template or rendering function for node tooltips.
     *
     * @default null
     */
    @Property(null)
    public nodeTemplate: string | Function;

    /**
     * Custom template or rendering function for link tooltips.
     *
     * @default null
     */
    @Property(null)
    public linkTemplate: string | Function;

    /**
     * Enables or disables tooltip animation.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Duration of the tooltip show animation (in ms).
     *
     * @default 300
     */
    @Property(300)
    public duration: number;

    /**
     * Duration of the tooltip fade-out animation (in ms).
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
    public fadeOutMode: SankeyTooltipFadeOutMode;
}

/**
 * Configures the legend behavior and appearance for the Sankey diagram
 */
export class SankeyLegendSettings extends ChildProperty<SankeyLegendSettings> {

    /**
     * Enables or disables the legend display.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Specifies the width of the legend.
     *
     * @default null
     */
    @Property(null)
    public width: string;

    /**
     * Specifies the height of the legend.
     *
     * @default null
     */
    @Property(null)
    public height: string;

    /**
     * Specifies the position of the legend in the chart.
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public position: LegendPosition;

    /**
     * Padding around the legend container.
     *
     * @default 8
     */
    @Property(8)
    public padding: number;

    /**
     * Padding between legend items.
     *
     * @default null
     */
    @Property(null)
    public itemPadding: number;

    /**
     * Defines the text styling options applied to legend labels in the Sankey diagram.
     */
    @Complex<FontModel>({ fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null }, Font)
    public textStyle: FontModel;

    /**
     * Size of the legend shape (icon).
     *
     * @default 10
     */
    @Property(10)
    public shapeWidth: number;

    /**
     * Size of the legend shape (icon).
     *
     * @default 10
     */
    @Property(10)
    public shapeHeight: number;

    /**
     * Options for customizing the border of the legend.
     */

    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Options to configure the margins around the component.
     */
    @Complex<MarginModel>({ bottom: 10, left: 10, right: 10, top: 10 }, Margin)
    public margin: MarginModel;

    /**
     * Padding between the legend shape and its text.
     *
     * @default 8
     */
    @Property(8)
    public shapePadding: number;

    /**
     * Background color of the legend.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Opacity of the legend container.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Enables or disables highlighting of legend items on interaction.
     *
     * @default true
     */
    @Property(true)
    public enableHighlight: boolean;

    /**
     * Title text for the legend.
     *
     * @default null
     */
    @Property(null)
    public title: string;

    /**
     * Defines the font styling used for rendering the legend title in the Sankey diagram.
     */
    @Complex<FontModel>({ fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null }, Font)
    public titleStyle: FontModel;

    /**
     * Specifies whether the legend layout should be inverted.
     *
     * @default false
     */
    @Property(false)
    public isInversed: boolean;

    /**
     * Specifies whether the legend items should be displayed in reverse order.
     *
     * @default false
     */
    @Property(false)
    public reverse: boolean;

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
    @Complex<LocationModel>({ x: 0, y: 0 }, Location)
    public location: LocationModel;
}
