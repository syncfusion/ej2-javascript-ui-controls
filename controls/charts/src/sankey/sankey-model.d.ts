import { Component, Property, NotifyPropertyChanges, Internationalization, Complex, INotifyPropertyChanged, Browser, ModuleDeclaration, EventHandler, Collection, Event, EmitType } from '@syncfusion/ej2-base';import { Margin, Border, Accessibility, Animation } from '../common/model/base';import { MarginModel, BorderModel, AccessibilityModel, AnimationModel } from '../common/model/base-model';import { Alignment, ChartTheme, ExportType, Orientation } from '../common/utils/enum';import { Rect, Size, SvgRenderer, TextOption, measureText } from '@syncfusion/ej2-svg-base';import { appendChildElement, createSvg, getTextAnchor, getTitle, textElement, titlePositionX, ImageOption, ChartLocation, redrawElement } from '../common/utils/helper';import { RectOption, removeElement } from '../common/utils/helper';import { SankeySeries } from './series/series';import { SankeyLabelSettings, SankeyLinkSettings, SankeyNodeSettings, SankeyTitleStyle, SankeyLegendSettings, SankeyTooltipSettings, SankeyNode, SankeyLink } from './model/sankey-base';import { SankeyLabelSettingsModel, SankeyNodeSettingsModel, SankeyLinkSettingsModel, SankeyTitleStyleModel, SankeyLegendSettingsModel, SankeyTooltipSettingsModel, SankeyNodeModel, SankeyLinkModel } from './model/sankey-base-model';import { ISankeyThemeStyle, SankeyExportedEventArgs, SankeyExportEventArgs, SankeyLabelRenderEventArgs, SankeyLegendItemHoverEventArgs, SankeyLegendRenderEventArgs, SankeyLinkEventArgs, SankeyLinkRenderEventArgs, SankeyLoadedEventArgs, SankeyNodeEventArgs, SankeyNodeLayout, SankeyNodeRenderEventArgs, SankeyPrintEventArgs, SankeySizeChangedEventArgs, SankeyTooltipRenderEventArgs } from './model/sankey-interface';import { SankeyLegend } from './legend/legend';import { SankeyTooltip } from './user-interaction/tooltip';import { PrintUtils } from '../common/utils/print';import { IAfterExportEventArgs } from '../common';import { SankeyExport } from './print-export/export';import { SankeyHighlight } from './user-interaction/highlight';import { getSankeyThemeColor } from './model/sankey-theme';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Sankey
 */
export interface SankeyModel extends ComponentModel{

    /**
     * The width of the sankey diagram as a string, accepting values like '100px' or '100%'.
     * If specified as '100%', the component renders to the full width of its parent element.
     *
     * @default null
     */
    width?: string;

    /**
     * The height of the sankey diagram as a string, accepting values like '100px' or '100%'.
     * If specified as '100%', the component renders to the full height of its parent element.
     *
     * @default null
     */
    height?: string;

    /**
     * The title displayed at the top of the sankey diagram.
     *
     * @default ''
     */
    title?: string;

    /**
     * The subtitle displayed below the main title.
     *
     * @default ''
     */
    subTitle?: string;

    /**
     * Options to customize the appearance of the title text.
     */
    titleStyle?: SankeyTitleStyleModel;

    /**
     * Options to customize the appearance of the subtitle text.
     */
    subTitleStyle?: SankeyTitleStyleModel;

    /**
     * Background color of the sankey diagram. Accepts valid CSS color values.
     *
     * @default null
     */
    background?: string;

    /**
     * Background image URL of the sankey diagram.
     *
     * @default null
     */
    backgroundImage?: string;

    /**
     * Options to configure the margins around the component.
     */
    margin?: MarginModel;

    /**
     * Options to configure the outer border of the component.
     */
    border?: BorderModel;

    /**
     * Defines the theme of the component.
     *
     * @default 'Material'
     */
    theme?: ChartTheme;

    /**
     * Collection of Sankey links that represent the flow between nodes.
     * Each link defines properties such as source, target, and value.
     *
     * @default []
     */

    links?: SankeyLinkModel[];

    /**
     * Collection of Sankey nodes that represent entities in the diagram.
     * Each node defines properties such as name, color, and position.
     *
     * @default []
     */

    nodes?: SankeyNodeModel[];

    /**
     * Defines the orientation of the Sankey diagram.
     * The options are:
     * * Horizontal - Renders nodes from left to right.
     * * Vertical - Renders nodes from top to bottom.
     *
     * @default 'Horizontal'
     */
    orientation?: Orientation;

    /**
     * Customize labels using labelSettings to improve clarity and alignment with application design.
     */
    labelSettings?: SankeyLabelSettingsModel;

    /**
     * Node style configuration for the sankey diagram.
     * Customize node appearance, size, opacity, and text alignment.
     */
    nodeStyle?: SankeyNodeSettingsModel;

    /**
     * Link style configuration for the sankey diagram.
     * Customize link color, opacity, and hover behavior.
     */
    linkStyle?: SankeyLinkSettingsModel;

    /**
     * Legend configuration for the sankey diagram.
     */
    legendSettings?: SankeyLegendSettingsModel;

    /**
     * Tooltip configuration for displaying details on hover.
     */
    tooltip?: SankeyTooltipSettingsModel;

    /**
     * Options for customizing the animation.
     *
     */
    animation?: AnimationModel;

    /**
     * When set to true, enables export of the diagram into supported formats.
     *
     * @default true
     */
    enableExport?: boolean;

    /**
     * Enables export in specific scenarios.
     *
     * @default false
     */
    allowExport?: boolean;

    /**
     * Accessibility options for the component.
     */
    accessibility?: AccessibilityModel;

    /**
     * Triggers before a legend item is rendered. Allows customization of legend text and shape color.
     *
     * @event legendItemRendering
     */
    legendItemRendering?: EmitType<SankeyLegendRenderEventArgs>;

    /**
     * Triggers when the mouse hovers over a legend item.
     *
     * @event legendItemHover
     */
    legendItemHover?: EmitType<SankeyLegendItemHoverEventArgs>;

    /**
     * Triggers before a label is rendered. Allows customization of label text and style.
     *
     * @event labelRendering
     */
    labelRendering?: EmitType<SankeyLabelRenderEventArgs>;

    /**
     * Triggers before a node is rendered. Allows customization of node appearance.
     *
     * @event nodeRendering
     */
    nodeRendering?: EmitType<SankeyNodeRenderEventArgs>;

    /**
     * Triggers before a link is rendered. Allows customization of link appearance.
     *
     * @event linkRendering
     */
    linkRendering?: EmitType<SankeyLinkRenderEventArgs>;

    /**
     * Triggers when the chart size changes.
     *
     * @event sizeChanged
     */
    sizeChanged?: EmitType<SankeySizeChangedEventArgs>;

    /**
     * Triggers before a tooltip is rendered. Allows customization of tooltip text.
     *
     * @event tooltipRendering
     */
    tooltipRendering?: EmitType<SankeyTooltipRenderEventArgs>;

    /**
     * Triggers after the chart export is completed.
     *
     * @event exportCompleted
     */
    exportCompleted?: EmitType<SankeyExportedEventArgs>;

    /**
     * Triggers when a node is clicked.
     *
     * @event nodeClick
     */
    nodeClick?: EmitType<SankeyNodeEventArgs>;

    /**
     * Triggers when the mouse enters a node.
     *
     * @event nodeEnter
     */
    nodeEnter?: EmitType<SankeyNodeEventArgs>;

    /**
     * Triggers when the mouse leaves a node.
     *
     * @event nodeLeave
     */
    nodeLeave?: EmitType<SankeyNodeEventArgs>;

    /**
     * Triggers when a link is clicked.
     *
     * @event linkClick
     */
    linkClick?: EmitType<SankeyLinkEventArgs>;

    /**
     * Triggers when the mouse enters a link.
     *
     * @event linkEnter
     */
    linkEnter?: EmitType<SankeyLinkEventArgs>;

    /**
     * Triggers when the mouse leaves a link.
     *
     * @event linkLeave
     */
    linkLeave?: EmitType<SankeyLinkEventArgs>;

    /**
     * Triggers after the sankey has fully loaded.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<SankeyLoadedEventArgs>;

    /**
     * Triggers before the sankey loads. This event allows for customization and configuration before the sankey is rendered.
     *
     * @event load
     */
    load?: EmitType<SankeyLoadedEventArgs>;

    /**
     * Triggers before the export gets started.
     *
     * @event beforeExport
     */
    beforeExport?: EmitType<SankeyExportEventArgs>;

    /**
     * Triggers after the export completed.
     *
     * @event afterExport
     */
    afterExport?: EmitType<IAfterExportEventArgs>;

    /**
     * Triggers before the prints gets started.
     *
     * @event beforePrint
     */
    beforePrint?: EmitType<SankeyPrintEventArgs>;

    /**
     * Customize the focus border color.
     * If not specified, the element will use the default focus border color.
     *
     * @default null
     */
    focusBorderColor?: string;

    /**
     * Customize the focus border width.
     * If not specified, the element will use the default focus border width.
     *
     * @default 1.5
     */
    focusBorderWidth?: number;

    /**
     * Customize the focus border margin.
     * If not specified, the element will use the default focus border margin.
     *
     * @default 0
     */
    focusBorderMargin?: number;

}