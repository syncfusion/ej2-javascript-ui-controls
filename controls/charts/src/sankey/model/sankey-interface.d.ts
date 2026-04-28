import { Rect, Size } from '@syncfusion/ej2-svg-base';
import { FontModel } from '../../common/model/base-model';
import { ChildProperty } from '@syncfusion/ej2-base';
import { ChartLocation } from '../../common/utils/helper';
import { ChartTheme } from '../../common/utils/enum';
import { SankeyNode, SankeyLink } from '../model/sankey-base';
import { Sankey } from '../sankey';
/**
 * Defines a link between two nodes in a Sankey diagram along with its flow value.
 *
 * @private
 */
export interface SankeyLinkData {
    /** Unique identifier of the source node */
    sourceID: string;
    /** Unique identifier of the target node */
    targetID: string;
    /** Numerical value representing the flow between source and target */
    value: number;
}
/**
 * Represents the computed layout and visual properties of a Sankey node.
 *
 * @private
 */
export interface SankeyNodeLayout {
    /** Unique identifier of the node */
    id: string;
    /** Total value associated with the node */
    value: number;
    /** Incoming flow value to the node */
    inValue: number;
    /** Outgoing flow value from the node */
    outValue: number;
    /** Hierarchical level of the node within the Sankey layout */
    level: number;
    /** X-coordinate position of the node */
    x: number;
    /** Y-coordinate position of the node */
    y: number;
    /** Rendered height of the node */
    height: number;
    /** Offset value used to position outgoing links */
    outOffset: number;
    /** Offset value used to position incoming links */
    inOffset: number;
    /** Fill color applied to the node */
    color: string;
    /** Display label for the node */
    label?: string;
    /** Rendered width of the node */
    width?: number;
    /** Optional offset in pixels or percentage string (e.g. '10%') */
    offset?: number;
    /** Optional explicit column or level specified by the user (1-based) */
    column?: number;
}
/**
 * Specifies the theme-related style properties used by the Sankey chart.
 * @private
 */
export interface ISankeyThemeStyle {
    /** Color or style definition for the chart title text */
    chartTitle: string;
    /** Color or style definition for legend labels */
    legendLabel: string;
    /** Background color of the chart area */
    background: string;
    /** Border color of the chart plotting area */
    areaBorder: string;
    /** Fill color used for tooltip background */
    tooltipFill: string;
    /** Style applied to bold text inside tooltip */
    tooltipBoldLabel: string;
    /** Style applied to light text inside tooltip */
    tooltipLightLabel: string;
    /** Color of the horizontal line separating tooltip header */
    tooltipHeaderLine: string;
    /** Fill color used for selection rectangle */
    selectionRectFill: string;
    /** Stroke color used for selection rectangle */
    selectionRectStroke: string;
    /** Stroke color used for selection circle */
    selectionCircleStroke: string;
    /** Color applied to focus or tab indicator */
    tabColor: string;
    /** Font settings for chart title */
    chartTitleFont: FontModel;
    /** Font settings for legend title */
    legendTitleFont: FontModel;
    /** Font settings for legend labels */
    legendLabelFont: FontModel;
    /** Font settings for tooltip text */
    tooltipLabelFont: FontModel;
    /** Font settings for chart sub-title */
    chartSubTitleFont: FontModel;
    /** Font settings for data labels */
    datalabelFont: FontModel;
}
/**
 * Defines the possible fade-out behaviors for Sankey tooltips.
 */
export declare type SankeyTooltipFadeOutMode = 'Click' | 'Move';
/**
 * Represents aggregated input and output values for a Sankey node.
 *
 * @private
 */
export interface SankeyNodeAggregates {
    /** Unique identifier of the node */
    id?: string;
    /** Display name of the node */
    name?: string;
    /** Total incoming flow value */
    inValue?: number;
    /** Total outgoing flow value */
    outValue?: number;
    /** Combined value of the node */
    value?: number;
    /** Color associated with the node */
    color?: string;
    /** Aggregate details for the start node */
    start?: {
        name: string;
        value: number;
        in: number;
        out: number;
    };
    /** Aggregate details for the target node */
    target?: {
        name: string;
        value: number;
        in: number;
        out: number;
    };
}
/**
 * Defines configuration options used for rendering Sankey tooltips.
 *
 * @private
 */
export interface tooltipConfigurationOptions {
    /** Opacity applied to the tooltip */
    opacity: number;
    /** Header text displayed in the tooltip */
    header: string;
    /** Content lines displayed inside the tooltip */
    content: string[];
    /** Background fill color of the tooltip */
    fill: string;
    /** Location where the tooltip is rendered */
    location: ChartLocation;
    /** Offset applied to tooltip position */
    offset: number;
    /** Indicates whether tooltip animation is enabled */
    enableAnimation: boolean;
    /** Specifies whether the tooltip is shared across elements */
    shared: boolean;
    /** Indicates whether crosshair behavior is enabled */
    crosshair: boolean;
    /** Clipping bounds applied to tooltip rendering */
    clipBounds: Rect;
    /** Area bounds used for tooltip positioning */
    areaBounds: Rect;
    /** Template used to render tooltip content */
    template: string | Function;
    /** Theme applied to the tooltip */
    theme: ChartTheme;
    /** Text style applied to tooltip content */
    textStyle: SankeyTextStyle;
    /** Specifies whether the chart is rendered on canvas */
    isCanvas: boolean;
    /** Indicates whether the tooltip position is fixed */
    isFixed: boolean;
    /** Name of the chart control */
    controlName: string;
    /** Enables right-to-left rendering for tooltip content */
    enableRTL: boolean;
    /** Padding applied to tooltip arrow */
    arrowPadding: number;
    /** Available container size that uses correct dimensions */
    availableSize: Size;
}
/**
 * Event arguments for legend item rendering.
 */
export interface SankeyLegendRenderEventArgs {
    /**
     * Specifies the text displayed for the legend item.
     * You can modify this value to customize the legend label.
     *
     * @default null
     */
    text: string;
    /**
     * Specifies the fill color applied to the legend shape.
     * Accepts any valid CSS color value (e.g., `'#3498db'`, `'rgb(52, 152, 219)'`, `'blue'`).
     *
     * @default null
     */
    fill: string;
}
/**
 * Event arguments for legend item hover.
 */
export interface SankeyLegendItemHoverEventArgs {
    /**
     * Represents the node associated with the hovered legend item.
     */
    node: SankeyNode;
}
/**
 * Event arguments for label rendering.
 */
export interface SankeyLabelRenderEventArgs {
    /**
     * The current label text to be rendered.
     * Handlers can assign a new value to override the default.
     *
     * Examples:
     *   args.text = `${args.text} (${args.value})`;
     *   args.text = 'Custom Label';
     */
    text: string;
    /**
     * Represents the node associated with the label.
     */
    node: SankeyNode;
    /**
     * The link associated with this label (if you support link labels now or in future).
     */
    link?: SankeyLink;
    /**
     * Defines the text style for the label.
     */
    labelStyle: SankeyTextStyle;
}
/**
 * Event arguments for node rendering.
 */
export interface SankeyNodeRenderEventArgs {
    /**
     * Represents the node being rendered.
     */
    node: SankeyNode;
    /**
     * Specifies the fill color for the node.
     *
     * @default null
     */
    fill: string;
}
/**
 * Event arguments for link rendering.
 */
export interface SankeyLinkRenderEventArgs {
    /**
     * Represents the link being rendered.
     */
    link: SankeyLink;
    /**
     * Specifies the fill color for the link.
     *
     * @default null
     */
    fill: string;
}
/**
 * Event arguments for size change.
 */
export interface SankeySizeChangedEventArgs {
    /**
     * Represents the current size of the chart.
     */
    currentSize: Size;
    /**
     * Represents the previous size of the chart.
     */
    previousSize: Size;
}
/**
 * Event arguments for tooltip rendering.
 */
export interface SankeyTooltipRenderEventArgs {
    /**
     * Represents the node associated with the tooltip.
     */
    node: SankeyNode;
    /**
     * Represents the link associated with the tooltip.
     */
    link: SankeyLink;
    /**
     * Specifies the tooltip text.
     *
     * @default null
     */
    text: string;
}
/**
 * Event arguments for export completion.
 */
export interface SankeyExportedEventArgs {
    /**
     * Specifies the exported data URL.
     *
     * @default null
     */
    dataUrl: string;
    /**
     * Specifies the exported Base64 string.
     *
     * @default null
     */
    base64: string;
}
/**
 * Event arguments for node click, enter, and leave events.
 */
export interface SankeyNodeEventArgs {
    /**
     * Represents the node involved in the event.
     */
    node: SankeyNode;
}
/**
 * Event arguments for link click, enter, and leave events.
 */
export interface SankeyLinkEventArgs {
    /**
     * Represents the link involved in the event.
     */
    link: SankeyLink;
}
/**
 * Interface for event argument objects in a sankey chart.
 */
export interface SankeyEventArgs {
    /** Defines the event cancel status. */
    cancel: boolean;
}
/**
 * Represents event arguments for sankey chart export.
 *
 * @interface SankeyExportEventArgs
 */
export interface SankeyExportEventArgs extends SankeyEventArgs {
    /**
     * The width of the exported chart.
     */
    width: number;
    /**
     * The height of the exported chart.
     */
    height: number;
}
/**
 * Represents the arguments for the print event in a sankey chart.
 *
 * @interface SankeyPrintEventArgs
 */
export interface SankeyPrintEventArgs extends SankeyEventArgs {
    /** Specifies the HTML content to be printed. */
    htmlContent: Element;
}
export interface SankeyLoadedEventArgs extends SankeyEventArgs {
    /** Defines the instance of the sankey chart. */
    chart: Sankey;
    /** Defines the theme applied to the sankey chart, if available. */
    theme?: ChartTheme;
}
/**
 * Represents a text style configuration used across various Sankey elements.
 */
export declare class SankeyTextStyle extends ChildProperty<SankeyTextStyle> {
    /**
     * Specifies the color of the text.
     *
     * @default null
     */
    color: string;
    /**
     * Specifies the font family for the text.
     *
     * @default null
     */
    fontFamily: string;
    /**
     * Specifies the font style for the text.
     *
     * @default null
     */
    fontStyle: string;
    /**
     * Specifies the weight of the text.
     *
     * @default null
     */
    fontWeight: string;
    /**
     * Specifies the font size for the text.
     *
     * @default null
     */
    fontSize: string;
}
