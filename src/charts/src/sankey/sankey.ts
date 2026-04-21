import { Component, Property, NotifyPropertyChanges, Internationalization, Complex, INotifyPropertyChanged, Browser, ModuleDeclaration, EventHandler, Collection, Event, EmitType } from '@syncfusion/ej2-base';
import { Margin, Border, Accessibility, Animation } from '../common/model/base';
import { MarginModel, BorderModel, AccessibilityModel, AnimationModel } from '../common/model/base-model';
import { Alignment, ChartTheme, ExportType, Orientation } from '../common/utils/enum';
import { Rect, Size, SvgRenderer, TextOption, measureText } from '@syncfusion/ej2-svg-base';
import { appendChildElement, createSvg, getTextAnchor, getTitle, textElement, titlePositionX, ImageOption, ChartLocation, redrawElement } from '../common/utils/helper';
import { RectOption, removeElement } from '../common/utils/helper';
import { SankeySeries } from './series/series';
import { SankeyModel } from './sankey-model';
import { SankeyLabelSettings, SankeyLinkSettings, SankeyNodeSettings, SankeyTitleStyle, SankeyLegendSettings, SankeyTooltipSettings, SankeyNode, SankeyLink } from './model/sankey-base';
import { SankeyLabelSettingsModel, SankeyNodeSettingsModel, SankeyLinkSettingsModel, SankeyTitleStyleModel, SankeyLegendSettingsModel, SankeyTooltipSettingsModel, SankeyNodeModel, SankeyLinkModel } from './model/sankey-base-model';
import { ISankeyThemeStyle, SankeyExportedEventArgs, SankeyExportEventArgs, SankeyLabelRenderEventArgs, SankeyLegendItemHoverEventArgs, SankeyLegendRenderEventArgs, SankeyLinkEventArgs, SankeyLinkRenderEventArgs, SankeyLoadedEventArgs, SankeyNodeEventArgs, SankeyNodeLayout, SankeyNodeRenderEventArgs, SankeyPrintEventArgs, SankeySizeChangedEventArgs, SankeyTooltipRenderEventArgs } from './model/sankey-interface';
import { SankeyLegend } from './legend/legend';
import { SankeyTooltip } from './user-interaction/tooltip';
import { PrintUtils } from '../common/utils/print';
import { IAfterExportEventArgs } from '../common';
import { SankeyExport } from './print-export/export';
import { SankeyHighlight } from './user-interaction/highlight';
import { getSankeyThemeColor } from './model/sankey-theme';

/**
 * Represents the Sankey diagram control for visualizing flow quantities between entities.
 *
 * const sankey = new Sankey({
 *   nodes: [
 *     { id: 'A', label: 'Source A' },
 *     { id: 'B', label: 'Process B' },
 *     { id: 'C', label: 'Destination C' }
 *   ],
 *   links: [
 *     { source: 'A', target: 'B', value: 40 },
 *     { source: 'B', target: 'C', value: 35 },
 *     { source: 'A', target: 'C', value: 5 }
 *   ],
 *   orientation: 'Horizontal,
 *   tooltip: { enabled: true }
 * });
 *
 * @public
 */
@NotifyPropertyChanges
export class Sankey extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * The width of the sankey diagram as a string, accepting values like '100px' or '100%'.
     * If specified as '100%', the component renders to the full width of its parent element.
     *
     * @default null
     */
    @Property(null)
    public width: string;

    /**
     * The height of the sankey diagram as a string, accepting values like '100px' or '100%'.
     * If specified as '100%', the component renders to the full height of its parent element.
     *
     * @default null
     */
    @Property(null)
    public height: string;

    /**
     * The title displayed at the top of the sankey diagram.
     *
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * The subtitle displayed below the main title.
     *
     * @default ''
     */
    @Property('')
    public subTitle: string;

    /**
     * Options to customize the appearance of the title text.
     */
    @Complex<SankeyTitleStyleModel>({ fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null }, SankeyTitleStyle)
    public titleStyle: SankeyTitleStyleModel;

    /**
     * Options to customize the appearance of the subtitle text.
     */
    @Complex<SankeyTitleStyleModel>({ fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null }, SankeyTitleStyle)
    public subTitleStyle: SankeyTitleStyleModel;

    /**
     * Background color of the sankey diagram. Accepts valid CSS color values.
     *
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Background image URL of the sankey diagram.
     *
     * @default null
     */
    @Property(null)
    public backgroundImage: string;

    /**
     * Options to configure the margins around the component.
     */
    @Complex<MarginModel>({ bottom: 10, left: 10, right: 10, top: 10 }, Margin)
    public margin: MarginModel;

    /**
     * Options to configure the outer border of the component.
     */
    @Complex<BorderModel>({ color: '', width: 1 }, Border)
    public border: BorderModel;

    /**
     * Defines the theme of the component.
     *
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Collection of Sankey links that represent the flow between nodes.
     * Each link defines properties such as source, target, and value.
     *
     * @default []
     */

    @Collection<SankeyLinkModel>([{}], SankeyLink)
    public links: SankeyLinkModel[];

    /**
     * Collection of Sankey nodes that represent entities in the diagram.
     * Each node defines properties such as name, color, and position.
     *
     * @default []
     */

    @Collection<SankeyNodeModel>([{}], SankeyNode)
    public nodes: SankeyNodeModel[];

    /**
     * Defines the orientation of the Sankey diagram.
     * The options are:
     * * Horizontal - Renders nodes from left to right.
     * * Vertical - Renders nodes from top to bottom.
     *
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public orientation: Orientation;

    /**
     * Customize labels using labelSettings to improve clarity and alignment with application design.
     */
    @Complex<SankeyLabelSettingsModel>({}, SankeyLabelSettings)
    public labelSettings: SankeyLabelSettingsModel;

    /**
     * Node style configuration for the sankey diagram.
     * Customize node appearance, size, opacity, and text alignment.
     */
    @Complex<SankeyNodeSettingsModel>({}, SankeyNodeSettings)
    public nodeStyle: SankeyNodeSettingsModel;

    /**
     * Link style configuration for the sankey diagram.
     * Customize link color, opacity, and hover behavior.
     */
    @Complex<SankeyLinkSettingsModel>({}, SankeyLinkSettings)
    public linkStyle: SankeyLinkSettingsModel;

    /**
     * Legend configuration for the sankey diagram.
     */
    @Complex<SankeyLegendSettingsModel>({}, SankeyLegendSettings)
    public legendSettings: SankeyLegendSettingsModel;

    /**
     * Tooltip configuration for displaying details on hover.
     */
    @Complex<SankeyTooltipSettingsModel>({}, SankeyTooltipSettings)
    public tooltip: SankeyTooltipSettingsModel;

    /**
     * Options for customizing the animation.
     *
     */
    @Complex<AnimationModel>({}, Animation)
    public animation: AnimationModel;

    /**
     * When set to true, enables export of the diagram into supported formats.
     *
     * @default true
     */
    @Property(true)
    public enableExport: boolean;

    /**
     * Enables export in specific scenarios.
     *
     * @default false
     */
    @Property(false)
    public allowExport: boolean;

    /**
     * Accessibility options for the component.
     */
    @Complex<AccessibilityModel>({}, Accessibility)
    public accessibility: AccessibilityModel;

    /**
     * Triggers before a legend item is rendered. Allows customization of legend text and shape color.
     *
     * @event legendItemRendering
     */
    @Event()
    public legendItemRendering: EmitType<SankeyLegendRenderEventArgs>;

    /**
     * Triggers when the mouse hovers over a legend item.
     *
     * @event legendItemHover
     */
    @Event()
    public legendItemHover: EmitType<SankeyLegendItemHoverEventArgs>;

    /**
     * Triggers before a label is rendered. Allows customization of label text and style.
     *
     * @event labelRendering
     */
    @Event()
    public labelRendering: EmitType<SankeyLabelRenderEventArgs>;

    /**
     * Triggers before a node is rendered. Allows customization of node appearance.
     *
     * @event nodeRendering
     */
    @Event()
    public nodeRendering: EmitType<SankeyNodeRenderEventArgs>;

    /**
     * Triggers before a link is rendered. Allows customization of link appearance.
     *
     * @event linkRendering
     */
    @Event()
    public linkRendering: EmitType<SankeyLinkRenderEventArgs>;

    /**
     * Triggers when the chart size changes.
     *
     * @event sizeChanged
     */
    @Event()
    public sizeChanged: EmitType<SankeySizeChangedEventArgs>;

    /**
     * Triggers before a tooltip is rendered. Allows customization of tooltip text.
     *
     * @event tooltipRendering
     */
    @Event()
    public tooltipRendering: EmitType<SankeyTooltipRenderEventArgs>;

    /**
     * Triggers after the chart export is completed.
     *
     * @event exportCompleted
     */
    @Event()
    public exportCompleted: EmitType<SankeyExportedEventArgs>;

    /**
     * Triggers when a node is clicked.
     *
     * @event nodeClick
     */
    @Event()
    public nodeClick: EmitType<SankeyNodeEventArgs>;

    /**
     * Triggers when the mouse enters a node.
     *
     * @event nodeEnter
     */
    @Event()
    public nodeEnter: EmitType<SankeyNodeEventArgs>;

    /**
     * Triggers when the mouse leaves a node.
     *
     * @event nodeLeave
     */
    @Event()
    public nodeLeave: EmitType<SankeyNodeEventArgs>;

    /**
     * Triggers when a link is clicked.
     *
     * @event linkClick
     */
    @Event()
    public linkClick: EmitType<SankeyLinkEventArgs>;

    /**
     * Triggers when the mouse enters a link.
     *
     * @event linkEnter
     */
    @Event()
    public linkEnter: EmitType<SankeyLinkEventArgs>;

    /**
     * Triggers when the mouse leaves a link.
     *
     * @event linkLeave
     */
    @Event()
    public linkLeave: EmitType<SankeyLinkEventArgs>;

    /**
     * Triggers after the sankey has fully loaded.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    @Event()
    public loaded: EmitType<SankeyLoadedEventArgs>;

    /**
     * Triggers before the sankey loads. This event allows for customization and configuration before the sankey is rendered.
     *
     * @event load
     */
    @Event()
    public load: EmitType<SankeyLoadedEventArgs>;

    /**
     * Triggers before the export gets started.
     *
     * @event beforeExport
     */
    @Event()
    public beforeExport: EmitType<SankeyExportEventArgs>;
    /**
     * Triggers after the export completed.
     *
     * @event afterExport
     */
    @Event()
    public afterExport: EmitType<IAfterExportEventArgs>;
    /**
     * Triggers before the prints gets started.
     *
     * @event beforePrint
     */
    @Event()
    public beforePrint: EmitType<SankeyPrintEventArgs>;

    /**
     * Customize the focus border color.
     * If not specified, the element will use the default focus border color.
     *
     * @default null
     */
    @Property(null)
    public focusBorderColor: string;

    /**
     * Customize the focus border width.
     * If not specified, the element will use the default focus border width.
     *
     * @default 1.5
     */
    @Property(1.5)
    public focusBorderWidth: number;

    /**
     * Customize the focus border margin.
     * If not specified, the element will use the default focus border margin.
     *
     * @default 0
     */
    @Property(0)
    public focusBorderMargin: number;

    // internal
    /** @private */
    public sankeySeriesModule: SankeySeries;
    /** @private */
    public sankeyLegendModule: SankeyLegend;
    /** @private */
    public previousTargetId: string = '';
    /** @private */
    public currentGroup: 'title' | 'subtitle' | 'nodes' | 'links' | 'legend' | null = null;
    /** @private */
    public currentNodeIndex: number = 0;
    /** @private */
    public currentLinkIndex: number = 0;
    /** @private */
    private currentLegendIndex: number = 0;
    /** @private */
    public intl: Internationalization;
    /** @private */
    public isTouch: boolean;
    /** @private */
    public startMove: boolean;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    /** @private */
    public disableTrackTooltip: boolean;
    /** @private */
    public svgObject: Element;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public availableSize: Size;
    /** @private */
    public initialClipRect: Rect;
    /** @private */
    public themeStyle: ISankeyThemeStyle;
    /** @private */
    private resizeBound: (() => void) = null;
    /** @private */
    public animateSeries: boolean;
    /** @private */
    /**
     * Stores the computed Sankey node layout map keyed by node id.
     */
    public nodeLayoutMap: { [key: string]: SankeyNodeLayout };

    /**
     * Provides the tooltip module used to render Sankey tooltips.
     *
     * @private
     */
    public tooltipModule: SankeyTooltip;
    /**
     * Holds the currently hovered Sankey node instance.
     *
     * @private
     */
    public hoveredNode: SankeyNode = null;
    /**
     * Holds the currently hovered Sankey link instance.
     *
     * @private
     */
    public hoveredLink: SankeyLink = null;
    /**
     * The Export Module is used to export chart.
     *
     * @private
     */
    public sankeyExportModule: SankeyExport;
    /**
     * Provides the highlight module used for node/link hover interactions.
     *
     * @private
     */
    public sankeyHighlightModule: SankeyHighlight;

    /**
     * Initializes the Sankey chart instance and its core modules.
     *
     * @param {SankeyModel} [options] - The Sankey configuration model used to initialize the component.
     * @param {string | HTMLElement} [element] - The host element or element id used to render the component.
     * @private
     */
    constructor(options?: SankeyModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.sankeySeriesModule = new SankeySeries(this);
    }

    /**
     * Prepares the Sankey component for rendering by wiring events, applying culture/RTL settings, and computing available size.
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.setCulture();
        this.wireEvents();
        if (this.element && this.element.className.indexOf('e-sankey') === -1) {
            this.element.classList.add('e-sankey');
        }
        this.element.setAttribute('dir', this.enableRtl ? 'rtl' : 'ltr');
        (this.element as HTMLElement).style.outline = 'none';
        this.animateSeries = true;
        this.calculateAvailableSize();
    }

    /**
     * Renders the Sankey component by initializing SVG, computing nodes/legend/bounds, and drawing visual elements.
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        const loadEventData: SankeyLoadedEventArgs = {
            chart: this, theme: this.theme, cancel: false
        };
        this.element.setAttribute('role', this.accessibility.accessibilityRole || 'region');
        this.element.setAttribute('tabindex', this.accessibility.focusable ? String(this.accessibility.tabIndex) : '-1');
        const regionLabel: string = this.accessibility.accessibilityDescription
            || (this.title ? `${this.title}. Interactive Sankey diagram.` : 'Interactive Sankey diagram.');
        this.element.setAttribute('aria-label', regionLabel);

        // Trigger `load` event and proceed with rendering inside the callback
        this.trigger('load', loadEventData, () => {
            this.renderer = new SvgRenderer(this.element.id);
            this.setTheme();
            this.calculateAvailableSize();
            this.createChartSvg();
            if (!this.sankeySeriesModule) {
                this.sankeySeriesModule = new SankeySeries(this);
            }
            if (this.sankeyHighlightModule) {
                this.sankeyHighlightModule.destroy();
                this.sankeyHighlightModule = null;
            }
            if (this.linkStyle && (this.linkStyle.highlightOpacity !== this.linkStyle.opacity
                || this.linkStyle.inactiveOpacity !== this.linkStyle.opacity) ||
                (this.nodeStyle && (this.nodeStyle.highlightOpacity !== this.nodeStyle.opacity
                    || this.nodeStyle.inactiveOpacity !== this.nodeStyle.opacity))) {
                this.sankeyHighlightModule = new SankeyHighlight(this);
            }
            this.nodeLayoutMap = this.sankeySeriesModule.buildNodes(this.links, this);
            if (this.sankeyLegendModule && this.legendSettings.visible) {
                this.sankeyLegendModule.getLegendOptions(this);
            }
            this.calculateBounds();
            this.renderElements();
            this.allowServerDataBinding = true;
        });
    }

    /**
     * Creates the chart SVG by removing the existing SVG and initializing a new one.
     *
     * @returns {void}
     * @private
     */
    public createChartSvg(): void { this.removeSvg(); createSvg(this); }

    /**
     * Removes the existing SVG and tooltip parent element from the DOM.
     *
     * @returns {void}
     * @private
     */
    public removeSvg(): void {
        removeElement(this.element.id + '_tooltip_parent');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length) { this.svgObject.removeChild(this.svgObject.firstChild); }
        }
    }

    /**
     * Creates the secondary tooltip container element used for rendering tooltip content.
     *
     * @returns {void}
     * @private
     */
    public createSecondaryElement(): void {

        if (this.element.tagName !== 'g') {
            const tooltipDiv: Element = redrawElement(false, this.element.id + '_Secondary_Element') ||
                this.createElement('div');
            tooltipDiv.id = this.element.id + '_Secondary_Element';
            (tooltipDiv as HTMLElement).style.cssText = 'position: relative';
            let tooltipHostElement: HTMLElement = document.getElementById(this.element.id + '_tooltip_parent') as HTMLElement;
            if (!tooltipHostElement) {
                tooltipHostElement = document.createElement('div');
                tooltipHostElement.id = this.element.id + '_tooltip_parent';
                tooltipHostElement.style.cssText = ` position: absolute; left: 0; top: 0; pointer-events: none;
            z-index: 100; overflow: hidden; contain: layout style paint; `;
                appendChildElement(false, tooltipDiv, tooltipHostElement, false);
            }
            appendChildElement(false, this.element, tooltipDiv, false);
        }

    }

    /**
     * Positions and applies required styles to the secondary tooltip container element.
     *
     * @returns {void}
     */
    private positionSecondaryElement(): void {
        const secondaryElement: HTMLDivElement = document.getElementById((this.element ? this.element.id : '') + '_tooltip_parent') as HTMLDivElement;
        if (!secondaryElement || !this.svgObject) { return; }

        secondaryElement.style.left = '0px';
        secondaryElement.style.top = '0px';
        secondaryElement.style.position = 'absolute';
        secondaryElement.style.pointerEvents = 'none';
        secondaryElement.style.zIndex = '1';
        secondaryElement.style.overflow = 'hidden';
    }

    /**
     * Calculates the initial clip rect and legend bounds based on margins, borders, titles, and available size.
     *
     * @returns {void}
     */
    private calculateBounds(): void {
        this.calculateAvailableSize();
        const margin: MarginModel = this.margin as MarginModel;
        let titleHeight: number = 0;
        let subTitleHeight: number = 0;
        const titlePadding: number = 10;
        const borderWidth: number = (this.border && this.border.width);

        const clipLeft: number = (margin.left) + borderWidth;
        const clipWidth: number = this.availableSize.width - clipLeft - (margin.right) - borderWidth;
        let clipTop: number = (margin.top) + borderWidth;
        let clipHeight: number = this.availableSize.height - clipTop - borderWidth - (margin.bottom);

        const titleCollection: string[] = this.title ? getTitle(this.title, this.titleStyle, clipWidth, this.enableRtl,
                                                                this.themeStyle.chartTitleFont) : [];
        if (this.title) {
            titleHeight = (measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont).height
                * titleCollection.length) + titlePadding;
            if (this.subTitle) {
                const subTitleCollection: string[] = getTitle(this.subTitle, this.subTitleStyle, clipWidth, this.enableRtl,
                                                              this.themeStyle.chartSubTitleFont);
                // use consistent 10px gap between title and subtitle lines
                subTitleHeight = (measureText(this.subTitle, this.subTitleStyle, this.themeStyle.chartSubTitleFont).height
                    * subTitleCollection.length) + 10;
            }
        }

        const totalTitlesHeight: number = titleHeight + subTitleHeight;
        clipTop += totalTitlesHeight; clipHeight -= totalTitlesHeight; // place titles on top by default

        this.initialClipRect = new Rect(clipLeft, clipTop, Math.max(0, clipWidth), Math.max(0, clipHeight));
        if (this.sankeyLegendModule && this.legendSettings.visible) {
            this.sankeyLegendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
        }
    }

    /**
     * Renders all visual elements of the Sankey chart including border, title, series, legend, and accessibility features.
     *
     * @returns {void}
     */
    private renderElements(): void {
        this.renderBorder();
        this.renderTitle();
        this.createSecondaryElement();
        if (!this.element.contains(this.svgObject)) { this.element.appendChild(this.svgObject); }
        if (this.sankeySeriesModule && this.initialClipRect && this.links && this.links.length > 0) {
            this.sankeySeriesModule.render(this);
        }
        this.renderLegend();
        this.positionSecondaryElement();
        this.initKeyboardTabOrder();
        this.trigger('loaded', { chart: this, theme: this.theme });
    }

    /**
     * Renders the chart border and background (including optional background image) into the SVG.
     *
     * @returns {void}
     */
    private renderBorder(): void {
        const padding: number = this.border.width;
        const borderRectOptions: RectOption = new RectOption(
            this.element.id + '_border', this.background || this.themeStyle.background, this.border, 1,
            new Rect(padding / 2, padding / 2, this.availableSize.width - padding, this.availableSize.height - padding), 0, 0, '', this.border.dashArray
        );
        const borderElement: Element = this.renderer.drawRectangle(borderRectOptions);
        borderElement.setAttribute('aria-hidden', 'true');
        appendChildElement(false, this.svgObject, borderElement, false);

        if (this.backgroundImage) {
            const backgroundImageOptions: ImageOption = new ImageOption(
                this.availableSize.height - padding,
                this.availableSize.width - padding,
                this.backgroundImage,
                0,
                0,
                this.element.id + '_background',
                'visible',
                'none'
            );
            const backgroundImageElement: HTMLElement = this.renderer.drawImage(backgroundImageOptions) as HTMLElement;
            backgroundImageElement.setAttribute('aria-hidden', 'true');
            appendChildElement(false, this.svgObject, backgroundImageElement, false);
        }
    }

    /**
     * Renders the chart title and subtitle text elements with accessibility attributes applied.
     *
     * @returns {void}
     */
    private renderTitle(): void {
        if (!this.title && !this.subTitle) { return; }

        const margin: MarginModel = this.margin as MarginModel;
        const titleRect: Rect = new Rect(
            margin.left,
            0,
            (this.availableSize.width - (margin.left) - (margin.right)),
            0
        );

        const titleTextSize: Size = this.title ? measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont) : new Size(0, 0);
        const titleCollection: string[] = this.title
            ? getTitle(this.title, this.titleStyle, titleRect.width, this.enableRtl, this.themeStyle.chartTitleFont)
            : [];

        const titleX: number = titlePositionX(titleRect, this.titleStyle);
        const titleY: number = (margin.top) + ((titleTextSize.height) * 3 / 4);

        if (this.title) {
            const titleTextOptions: TextOption = new TextOption(
                this.element.id + '_title',
                titleX,
                titleY,
                getTextAnchor(this.titleStyle.textAlignment, this.enableRtl),
                titleCollection,
                undefined,
                'auto'
            );
            const titleTextElement: Element = textElement(
                this.renderer,
                titleTextOptions,
                this.titleStyle,
                (this.titleStyle as SankeyTitleStyleModel).color || this.themeStyle.chartTitleFont.color,
                this.svgObject,
                null, null, null, null, null, null, null, null, false, null,
                this.themeStyle.chartTitleFont
            );
            titleTextElement.setAttribute('role', 'heading');
            titleTextElement.setAttribute('aria-level', '1');
            titleTextElement.setAttribute('tabindex', '-1');  // Readable but non-focusable
            titleTextElement.setAttribute('aria-label', this.title);
        }

        if (this.subTitle) {
            const subTitleCollection: string[] = getTitle(
                this.subTitle,
                this.subTitleStyle,
                titleRect.width,
                this.enableRtl,
                this.themeStyle.chartSubTitleFont
            );

            const subTitleLineSize: Size = measureText(
                this.subTitle,
                this.subTitleStyle,
                this.themeStyle.chartSubTitleFont
            );

            const titleLines: number = this.title ? (titleCollection.length || 1) : 0;
            const subTitleY: number = this.title
                ? (margin.top + (titleTextSize.height * 3 / 4) + (titleTextSize.height * titleLines) + 10)
                : (margin.top + (subTitleLineSize.height * 3 / 4));

            const subAlign: Alignment = (this.subTitleStyle && this.subTitleStyle.textAlignment) ? this.subTitleStyle.textAlignment : 'Center';
            const subTitleX: number = titlePositionX(
                titleRect,
                { textAlignment: subAlign } as SankeyTitleStyleModel
            );

            const subTitleTextOptions: TextOption = new TextOption(
                this.element.id + '_subtitle',
                subTitleX,
                subTitleY,
                getTextAnchor(subAlign, this.enableRtl),
                subTitleCollection,
                undefined,
                'auto'
            );

            const subTitleTextElement: Element = textElement(
                this.renderer,
                subTitleTextOptions,
                this.subTitleStyle,
                (this.subTitleStyle as SankeyTitleStyleModel).color || this.themeStyle.chartSubTitleFont.color,
                this.svgObject,
                null, null, null, null, null, null, null, null, false, null,
                this.themeStyle.chartSubTitleFont
            );

            subTitleTextElement.setAttribute('role', 'heading');
            subTitleTextElement.setAttribute('aria-level', '2');
            subTitleTextElement.setAttribute('tabindex', '-1');
            subTitleTextElement.setAttribute('aria-label', this.subTitle);
        }
    }

    /**
     * Renders the Sankey legend if the legend module is available and legend visibility is enabled.
     *
     * @returns {void}
     */
    private renderLegend(): void {
        if (this.sankeyLegendModule && this.sankeyLegendModule.legendCollections.length &&
            (this.legendSettings as SankeyLegendSettingsModel).visible) {
            this.sankeyLegendModule.calTotalPage = true;
            const legendBounds: Rect = this.sankeyLegendModule.legendBounds;
            this.sankeyLegendModule.renderLegend(this, this.legendSettings, legendBounds);
        }
    }

    /**
     * Finds and returns a user-defined node by id from the nodes collection.
     *
     * @param {string} id - The node id used to locate the node definition.
     * @returns {SankeyNode | null} returns node if present, else null.
     * @private
     */
    public findNode(id: string): SankeyNode | null {
        const nodesArray: SankeyNode[] = Array.isArray(this.nodes) ? (this.nodes as SankeyNode[]) : [];
        for (let nodeIndex: number = 0; nodeIndex < nodesArray.length; nodeIndex++) {
            if (nodesArray[nodeIndex as number] && (nodesArray[nodeIndex as number] as SankeyNode).id === id) {
                return nodesArray[nodeIndex as number];
            }
        }
        return null;
    }

    // helper: find link by source/target
    /**
     * Finds and returns a user-defined link by source and target ids from the links collection.
     *
     * @param {string} sourceId - The source node id used to locate the link definition.
     * @param {string} targetId - The target node id used to locate the link definition.
     * @returns {SankeyLink | null} returns link if present, else null.
     *
     * @private
     */
    public findLink(sourceId: string, targetId: string): SankeyLink | null {
        const linksArray: SankeyLink[] = Array.isArray(this.links) ? (this.links as SankeyLink[]) : [];
        for (let linkIndex: number = 0; linkIndex < linksArray.length; linkIndex++) {
            const currentLink: SankeyLink = linksArray[linkIndex as number];
            if (currentLink && (currentLink as SankeyLink).sourceId === sourceId &&
            (currentLink as SankeyLink).targetId === targetId) { return currentLink; }
        }
        return null;
    }

    /**
     * Initializes the internationalization instance used by the component.
     *
     * @returns {void}
     */
    private setCulture(): void { this.intl = new Internationalization(); }

    /**
     * Applies theme styles for the current chart theme.
     *
     * @returns {void}
     */
    private setTheme(): void { this.themeStyle = getSankeyThemeColor(this.theme); }

    /**
     * Calculates the available rendering size based on configured width/height or element client size.
     *
     * @returns {void}
     *
     * @private
     */
    public calculateAvailableSize(): void {
        // Use given width/height or fall back to parent/client size, defaulting to 600x450 when zero
        const parseSize: (v: string | null, fallback: number, client: number) => number = (
            v: string | null, fallback: number, client: number): number => {
            if (!v) { return client > 0 ? client : fallback; }
            const sizeText: string = v.toString();
            if (sizeText.indexOf('%') > -1) {
                const percent: number = parseFloat(sizeText);
                const base: number = (this.element && this.element.parentElement) ? this.element.parentElement.clientWidth : client;
                const value: number = (isNaN(percent) ? 100 : percent) / 100 * base;
                return value > 0 ? value : fallback;
            }
            const pixelValue: number = parseFloat(sizeText);
            return (pixelValue > 0 ? pixelValue : (client > 0 ? client : fallback));
        };

        const clientWidth: number = this.element ? this.element.clientWidth : 0;
        const clientHeight: number = this.element ? this.element.clientHeight : 0;
        const computedWidth: number = parseSize(this.width, 600, clientWidth);
        const computedHeight: number = parseSize(this.height, 450, clientHeight);
        this.availableSize = new Size(computedWidth, computedHeight);
    }

    /**
     * Unbinds all DOM and window event listeners attached for Sankey interactions.
     *
     * @returns {void}
     *
     * @private
     */
    public unWireEvents(): void {
        const touchStartEvent: string = Browser.touchStartEvent;
        const touchMoveEvent: string = Browser.touchMoveEvent;
        const touchEndEvent: string = Browser.touchEndEvent;
        const pointerLeaveOrMouseLeaveEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /** UnBind the Event handler */
        EventHandler.remove(this.element, touchStartEvent, this.handleMouseDown);
        EventHandler.remove(this.element, touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.handleMouseClick);
        EventHandler.remove(this.element, pointerLeaveOrMouseLeaveEvent, this.mouseLeave);
        EventHandler.remove(this.element, 'keydown', this.handleKeyDown);
        EventHandler.remove(document.body, 'keydown', this.handleDocumentKeyDown);
        EventHandler.remove(this.element, 'keyup', this.handleKeyUp);
        EventHandler.remove(this.element, 'focusin', this.handleFocusIn);

        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBound
        );
    }


    /**
     * Binds all required DOM and window event listeners for Sankey interactions.
     *
     * @returns {void}
     *
     * @private
     */
    public wireEvents(): void {
        /**
         * To fix react timeout destroy issue.
         */
        if (!this.element) {
            return;
        }
        /** Find the Events type */

        const pointerLeaveOrMouseLeaveEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /** Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.handleMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.handleMouseClick, this);
        EventHandler.add(this.element, pointerLeaveOrMouseLeaveEvent, this.mouseLeave, this);

        this.resizeBound = this.chartResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBound
        );
        EventHandler.add(this.element, 'keydown', this.handleKeyDown, this);
        EventHandler.add(document.body, 'keydown', this.handleDocumentKeyDown, this); // optional Alt+J
        EventHandler.add(this.element, 'keyup', this.handleKeyUp, this);
        EventHandler.add(this.element, 'focusin', this.handleFocusIn, this);

        this.element.addEventListener('pointermove', this.handlePointerMove.bind(this));
        this.element.addEventListener('pointerup', this.handlePointerUp.bind(this));
        this.element.addEventListener('pointerleave', this.handlePointerLeave.bind(this));

        this.setStyle(<HTMLElement>this.element);
    }

    /**
     * Applying styles for sankey chart element.
     *
     * @param {HTMLElement} element - Specifies the element.
     * @returns {void}
     */
    private setStyle(element: HTMLElement): void {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
        element.style.overflow = 'hidden';
        element.style.height = (element.style.height || (this.height && this.height.indexOf('%') === -1)) ? element.style.height : 'inherit';
    }

    /**
     * Handles document-level keyboard shortcuts for the Sankey chart.
     *
     * Moves focus to the chart container when the Alt + J key combination is pressed
     * and applies the container navigation focus styling.
     *
     * @param {KeyboardEvent} keyboardEvent - The keyboard event triggered on the document.
     * @returns {void}
     *
     * @private
     */
    public handleDocumentKeyDown(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.altKey && keyboardEvent.key.toLowerCase() === 'j' && this.element) {
            (this.element as HTMLElement).focus();
            this.clearNavigationStyles();
            this.setContainerNavigationStyle();
        }
    }

    /**
     * Applies keyboard navigation focus styling to the Sankey chart container.
     *
     * @returns {void}
     *
     * @private
     */
    public setContainerNavigationStyle(): void {
        const chartElement: HTMLElement = this.element as HTMLElement;
        const focusColor: string = this.focusBorderColor || this.themeStyle.tabColor;

        chartElement.style.setProperty('outline', `${this.focusBorderWidth}px solid ${focusColor}`);
        chartElement.style.setProperty('outline-offset', `${this.focusBorderMargin}px`);
    }

    /**
     * Handles pointer or mouse move events on the chart area.
     *
     * Updates the internal mouse position used for hit-testing
     * and tooltip positioning.
     *
     * @param {PointerEvent | MouseEvent} event - The pointer or mouse move event.
     * @returns {boolean} Returns false to prevent further propagation.
     */
    private handlePointerMove(event: PointerEvent | MouseEvent): boolean {
        this.updateMousePosition(event);
        this.notify(Browser.touchMoveEvent, event);
        return false;
    }

    /**
     * Handles pointer or mouse up events on the chart area.
     *
     * Updates the internal mouse position used for interaction handling.
     *
     * @param {PointerEvent | MouseEvent} event - The pointer or mouse up event.
     * @returns {boolean} Returns false to prevent further propagation.
     */
    private handlePointerUp(event: PointerEvent | MouseEvent): boolean {
        this.updateMousePosition(event);
        this.notify(Browser.touchEndEvent, event);
        return false;
    }

    /**
     * Handles pointer or mouse leave events on the chart area.
     *
     * Updates the mouse position (if available) and resets
     * the internal pointer movement state.
     *
     * @param {PointerEvent | MouseEvent} [event] - The optional pointer or mouse leave event.
     * @returns {boolean} Returns false to prevent further propagation.
     *
     * @private
     */
    public handlePointerLeave(event?: PointerEvent | MouseEvent): boolean {
        if (event) {
            this.updateMousePosition(event);
            this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', event);
        }
        this.startMove = false;
        return false;
    }

    /**
     * Handles window resize by recalculating available size, triggering sizeChanged, and re-rendering only when dimensions differ.
     *
     * @returns {boolean} returns boolean based on chart resize actions.
     *
     * @private
     */
    public chartResize(): boolean {
        this.animateSeries = false;
        const previousAvailableSize: Size = new Size(this.availableSize.width, this.availableSize.height);
        // Recompute available size first
        this.calculateAvailableSize();

        // If size hasn't changed, skip a full re-render but still update secondary elements and emit sizeChanged
        const isSizeChanged: boolean = (previousAvailableSize.width !== this.availableSize.width) ||
            (previousAvailableSize.height !== this.availableSize.height);

        // Trigger sizeChanged event regardless
        const sizeChangedEventArgs: SankeySizeChangedEventArgs = {
            previousSize: previousAvailableSize,
            currentSize: this.availableSize
        };
        this.trigger('sizeChanged', sizeChangedEventArgs);

        // If the chart size actually changed, recreate svg and re-render all elements
        if (isSizeChanged) {
            // recreate renderer + svg to ensure correct dimensions
            this.renderer = new SvgRenderer(this.element.id);
            this.setTheme();
            this.createChartSvg();
            this.nodeLayoutMap = this.sankeySeriesModule.buildNodes(this.links, this);
            if (this.sankeyLegendModule && this.legendSettings.visible) {
                this.sankeyLegendModule.getLegendOptions(this);
            }
            this.calculateBounds();
            this.renderElements();
        } else {
            // Update secondary DOM positions and clear tooltip state
            this.positionSecondaryElement();
            if (this.tooltipModule) { this.tooltipModule.svgTooltip = null; }
        }

        return false;
    }

    /**
     * Sets the mouse coordinates relative to the chart SVG for pointer and mouse events.
     *
     * @param {PointerEvent | MouseEvent} event - Mouse/pointer event with client coordinates.
     * @returns {void}
     *
     * @private
     */
    public updateMousePosition(event: { clientX: number; clientY: number } | PointerEvent | MouseEvent): void {
        const svgHostElement: HTMLElement = this.svgObject as HTMLElement;
        if (!svgHostElement || !event) { return; }
        const svgClientRect: DOMRect = svgHostElement.getBoundingClientRect() as DOMRect;
        const clientX: number = event.clientX;
        const clientY: number = event.clientY;
        this.mouseX = clientX - svgClientRect.left;
        this.mouseY = clientY - svgClientRect.top;
    }

    /**
     * Tracks pointer/touch movement, updates chart-relative mouse coordinates, and forwards the move event to the chart handler.
     *
     * @param {(PointerEvent | TouchEvent)} event - Pointer or touch move event containing client coordinates.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    public mouseMove(event: PointerEvent | TouchEvent): boolean {
        let clientX: number;
        let clientY: number;

        if (event.type === 'touchmove') {
            this.isTouch = true;
            const touchMoveEvent: TouchEvent = event as TouchEvent;
            clientX = touchMoveEvent.changedTouches[0].clientX;
            clientY = touchMoveEvent.changedTouches[0].clientY;
        } else {
            const pointerMoveEvent: PointerEvent = event as PointerEvent;
            this.isTouch = (pointerMoveEvent.pointerType === 'touch' || pointerMoveEvent.pointerType === '2') || this.isTouch;
            clientX = pointerMoveEvent.clientX;
            clientY = pointerMoveEvent.clientY;
        }

        this.updateMousePosition({ clientX: clientX, clientY: clientY });
        if (this.handleMouseMove) { this.handleMouseMove(event as MouseEvent); }
        return false;
    }

    /**
     * Tracks pointer/touch end, updates chart-relative mouse coordinates, and forwards the end event to the mouse-leave handler.
     *
     * @param {(PointerEvent | TouchEvent)} event - Pointer or touch end event containing client coordinates.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    public mouseEnd(event: PointerEvent | TouchEvent): boolean {
        let clientX: number;
        let clientY: number;

        if (event.type === 'touchend') {
            const touchEndEvent: TouchEvent = event as TouchEvent;
            clientX = touchEndEvent.changedTouches[0].clientX;
            clientY = touchEndEvent.changedTouches[0].clientY;
            this.isTouch = true;
        } else {
            const pointerEndEvent: PointerEvent = event as PointerEvent;
            clientX = pointerEndEvent.clientX;
            clientY = pointerEndEvent.clientY;
            this.isTouch = (pointerEndEvent.pointerType === 'touch' || pointerEndEvent.pointerType === '2');
        }

        this.updateMousePosition({ clientX: clientX, clientY: clientY });
        if (event.type === 'touchend') {
            this.notify(Browser.touchEndEvent, event);
        }
        return false;
    }


    /**
     * Handles mouse move interactions over the Sankey chart.
     *
     * Detects whether the pointer is over a node or a link, triggers the corresponding
     * enter/leave events, and maintains the current hovered node/link state.
     *
     * @param {MouseEvent} event - The mouse move event dispatched on the chart.
     * @returns {boolean} Always returns false to prevent default propagation in the control.
     *
     * @private
     */
    public handleMouseMove(event: MouseEvent): boolean {
        this.updateMousePosition(event);

        const targetElement: HTMLElement = event.target as HTMLElement;
        const nodeIdPrefix: string = `${this.element.id}_node_`;
        const linkGroupId: string = `${this.element.id}_link_collection`;

        // Node hit
        if (targetElement && targetElement.id && targetElement.id.indexOf(nodeIdPrefix) === 0) {
            const nodeId: string = targetElement.getAttribute('aria-label');
            if (!this.hoveredNode || (this.hoveredNode && this.hoveredNode.id !== nodeId)) {
                if (this.hoveredNode) {
                    this.trigger('nodeLeave', { node: this.hoveredNode } as SankeyNodeEventArgs);
                    this.hoveredNode = null;
                }
                const nodeObject: SankeyNode | null = this.findNode(nodeId);
                if (nodeObject) {
                    this.trigger('nodeEnter', { node: nodeObject } as SankeyNodeEventArgs);
                    this.hoveredNode = nodeObject;
                }
                if (this.hoveredLink) {
                    this.trigger('linkLeave', { link: this.hoveredLink } as SankeyLinkEventArgs);
                    this.hoveredLink = null;
                }
            }
        }
        // Link hit
        else if (targetElement && targetElement.tagName.toLowerCase() === 'path' && targetElement.closest(`[id="${linkGroupId}"]`)) {
            const sourceId: string = targetElement.getAttribute('data-source');
            const targetId: string = targetElement.getAttribute('data-target');
            if (!this.hoveredLink || (this.hoveredLink && (this.hoveredLink.sourceId !== sourceId
                || this.hoveredLink.targetId !== targetId))) {
                if (this.hoveredLink) {
                    this.trigger('linkLeave', { link: this.hoveredLink } as SankeyLinkEventArgs);
                    this.hoveredLink = null;
                }
                const linkObject: SankeyLink | null = this.findLink(sourceId, targetId);
                if (linkObject) {
                    this.trigger('linkEnter', { link: linkObject } as SankeyLinkEventArgs);
                    this.hoveredLink = linkObject;
                }
                if (this.hoveredNode) {
                    this.trigger('nodeLeave', { node: this.hoveredNode } as SankeyNodeEventArgs);
                    this.hoveredNode = null;
                }
            }
        }
        else {
            if (this.hoveredNode) {
                this.trigger('nodeLeave', { node: this.hoveredNode } as SankeyNodeEventArgs);
                this.hoveredNode = null;
            }
            if (this.hoveredLink) {
                this.trigger('linkLeave', { link: this.hoveredLink } as SankeyLinkEventArgs);
                this.hoveredLink = null;
            }
        }

        this.notify(Browser.touchMoveEvent, event);
        return false;
    }

    /**
     * Notifies the chart about the pointer/touch start event to initiate interaction handling.
     *
     * @param {PointerEvent} event - Pointer down event raised on the chart surface.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    public handleMouseDown(event: PointerEvent): boolean {
        this.notify(Browser.touchStartEvent, event);
        return false;
    }

    /**
     * Handles mouse leave by clearing hover states, triggering leave events, and notifying the chart about interaction end.
     *
     * @param {MouseEvent} event - Mouse leave event raised when the pointer exits the chart surface.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    public mouseLeave(event: MouseEvent): boolean {
        this.updateMousePosition(event);
        if (this.hoveredNode) {
            this.trigger('nodeLeave', { node: this.hoveredNode } as SankeyNodeEventArgs);
            this.hoveredNode = null;
        }
        if (this.hoveredLink) {
            this.trigger('linkLeave', { link: this.hoveredLink } as SankeyLinkEventArgs);
            this.hoveredLink = null;
        }
        this.notify(Browser.touchEndEvent, event);
        return false;
    }

    /**
     * Handles the mouse click on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse or touch event.
     * @returns {boolean} -  Return false.
     * @private
     *
     */
    public handleMouseClick(e: PointerEvent | TouchEvent): boolean {
        this.updateMousePosition(e as PointerEvent);
        const target: HTMLElement = e.target as HTMLElement;

        // Check if node was clicked
        const nodePrefix: string = `${this.element.id}_node_`;
        if (target.id && target.id.indexOf(nodePrefix) === 0) {
            const nodeId: string = target.getAttribute('aria-label');
            const node: SankeyNode | null = this.findNode(nodeId);
            if (node) {
                const nodeClickArgs: SankeyNodeEventArgs = { node: node };
                this.trigger('nodeClick', nodeClickArgs);
            }
        }

        // Check if link was clicked
        const linkGroupId: string = `${this.element.id}_link_collection`;
        if (target.tagName.toLowerCase() === 'path' && target.closest(`[id="${linkGroupId}"]`)) {
            const sourceID: string = (target as HTMLElement).getAttribute('data-source');
            const targetID: string = (target as HTMLElement).getAttribute('data-target');
            const link: SankeyLink | null = this.findLink(sourceID, targetID);
            if (link) {
                const linkClickArgs: SankeyLinkEventArgs = { link: link };
                this.trigger('linkClick', linkClickArgs);
            }
        }
        this.notify('click', e);
        return false;
    }

    /**
     * Export method for the chart.
     *
     * @param {ExportType} type - Specifies the type of the export.
     * @param {string} fileName - Specifies the file name of the exported file.
     * @returns {void}
     *
     * @private
     */
    public export(type: ExportType, fileName: string): void {
        if (this.sankeyExportModule) {
            this.sankeyExportModule.export(type, fileName);
            if (this.afterExport) {
                this.sankeyExportModule.getDataUrl(this);
            }
        }
    }

    /**
     * Prints the chart in the page.
     *
     * @param {string[] | string | Element} id - The id of the chart to be printed on the page.
     * @returns {void}
     *
     * @private
     */
    public print(id?: string[] | string | Element): void {
        const argsData: SankeyPrintEventArgs = {
            cancel: false, htmlContent: this.svgObject
        };
        this.trigger('beforePrint', argsData);
        if (!argsData.cancel) {
            const printChart: PrintUtils = new PrintUtils(this);
            printChart.print(id);
        }
    }

    /**
     * Returns the persisted state of the component.
     *
     * @returns {string} the persisted state.
     *
     * @private
     */
    public getPersistData(): string { return ''; }

    /**
     * Handles property updates and refreshes the Sankey rendering based on the changed properties.
     *
     * @param {SankeyModel} newProp - Newly updated property values.
     * @param {SankeyModel} _oldProp - Previously existing property values.
     * @returns {void}
     *
     * @private
     */
    public onPropertyChanged(newProp: SankeyModel, _oldProp: SankeyModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        this.animateSeries = false;

        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
            case 'height':
                this.createChartSvg();
                refreshBounds = true;
                break;
            case 'title':
            case 'subTitle':
                refreshBounds = true;
                break;
            case 'titleStyle':
            case 'subTitleStyle':
                renderer = true;
                break;
            case 'orientation':
            case 'nodes':
            case 'links':
            case 'labelSettings':
            case 'nodeStyle':
            case 'linkStyle':
            case 'margin':
            case 'border':
            case 'background':
            case 'backgroundImage':
            case 'legendSettings':
                refreshBounds = true;
                break;
            case 'enableExport':
                renderer = true;
                break;
            case 'tooltip':
                renderer = true;
                break;
            case 'animation':
                renderer = true;
                break;
            case 'enableRtl':
            case 'locale':
                this.refresh();
                break;
            case 'theme':
                this.animateSeries = true;
                renderer = true;
                break;
            default:
                renderer = true;
                break;
            }
        }

        if (refreshBounds) {
            this.nodeLayoutMap = this.sankeySeriesModule.buildNodes(this.links, this);
            if (this.sankeyLegendModule && this.legendSettings.visible) {
                this.sankeyLegendModule.getLegendOptions(this);
            }
            this.calculateAvailableSize();
            this.createChartSvg();
            if (this.isReact) { this.clearTemplate(); }
            this.calculateBounds();
            this.renderElements();
        } else if (renderer) {
            this.removeSvg();
            if (this.isReact) { this.clearTemplate(); }
            this.renderElements();
        }
    }

    /**
     * Handles focus-in events within the Sankey chart to manage keyboard navigation,
     * highlighting, and tooltip behavior based on the focused element group.
     *
     * @param {FocusEvent} event - The focus-in event dispatched on the chart.
     * @returns {void}
     * @private
     */
    public handleFocusIn(event: FocusEvent): void {
        const targetElement: HTMLElement | SVGElement | null = event.target as (HTMLElement | SVGElement | null);
        if (!targetElement || !targetElement.id) { return; }

        const canUseMatches: boolean = !!(targetElement).matches && typeof (targetElement).matches === 'function';
        if (canUseMatches && !(targetElement).matches(':focus-visible')) {
            this.clearNavigationStyles();
            const groupName: 'title' | 'subtitle' | 'nodes' | 'links' | 'legend' = this.getGroupOf(targetElement.id);
            if (groupName) { this.currentGroup = groupName; }
            this.previousTargetId = targetElement.id;
            return;
        }

        this.clearNavigationStyles();
        this.applyNavigationStyle(targetElement.id);

        const group: 'title' | 'subtitle' | 'nodes' | 'links' | 'legend' = this.getGroupOf(targetElement.id);

        if (group === 'nodes' || group === 'links') {
            if (this.ensureTooltip()) {
                const focusedElement: Element = (document.activeElement as Element) || (targetElement as Element);
                this.applyHighlightForElement(focusedElement);

                let centerPosition: ChartLocation;
                if (!centerPosition) { centerPosition = this.getElementCenterInChartCoords(focusedElement); }
                if (centerPosition) {
                    this.tooltipModule.showTooltipForElement(focusedElement, !this.tooltipModule.svgTooltip, centerPosition);
                }
            }
        } else {
            if (this.tooltipModule) { this.tooltipModule.hideTooltip(0); }
            if (group === 'legend' && this.sankeyHighlightModule) {
                const label: string = (targetElement as Element).getAttribute('aria-label');
                if (label) { this.sankeyHighlightModule.highlightForNode(label); }
            }
        }

        if (group) { this.currentGroup = group; }
        this.previousTargetId = targetElement.id;
    }

    /**
     * Initializes the keyboard tab order for focusable groups within the Sankey chart.
     *
     * The order is: Title → Subtitle → Nodes → Links → Legend.
     * Only the first element of each group is tabbable by default; others use roving tabindex.
     *
     * @returns {void}
     */
    private initKeyboardTabOrder(): void {
        // Title → Subtitle → Nodes → Links → Legend (first element in each group is tabbable)
        const titleElement: HTMLElement | null = document.getElementById(`${this.element.id}_title`) as HTMLElement | null;
        const subtitleElement: HTMLElement | null = document.getElementById(`${this.element.id}_subtitle`) as HTMLElement | null;

        const nodeElements: Element[] = this.getNodeElements();
        const linkElements: Element[] = this.getLinkElements();
        const legendItems: Element[] = this.getLegendItems();

        // Set tabindex states
        if (titleElement) { titleElement.setAttribute('tabindex', '0'); }
        if (subtitleElement) { subtitleElement.setAttribute('tabindex', '0'); } // requirement

        if (nodeElements.length) { (nodeElements[0] as Element).setAttribute('tabindex', '0'); }
        if (linkElements.length) { (linkElements[0] as Element).setAttribute('tabindex', '0'); }
        if (legendItems.length) { (legendItems[0] as Element).setAttribute('tabindex', '0'); }

        // Force all other legend <g> to -1 (avoid tabindex="")
        for (let i: number = 1; i < legendItems.length; i++) {
            const legendGroup: Element = legendItems[i as number];
            if (legendGroup instanceof HTMLElement || legendGroup instanceof SVGElement) {
                legendGroup.setAttribute('tabindex', '-1');
            }
        }

        // Reset roving indexes to 0 for Arrow navigation
        this.currentNodeIndex = 0;
        this.currentLinkIndex = 0;
        this.currentLegendIndex = 0;

        // Do not set currentGroup by default; we will infer from focused element.
        this.currentGroup = null;
        this.previousTargetId = '';
    }

    /**
     * Updates tabindex so the previous element becomes unfocusable and the next element becomes focusable.
     *
     * @param {Element | null} [previousElement] - The element to make unfocusable.
     * @param {Element | null} [nextElement] - The element to make focusable.
     * @returns {void}
     *
     * @private
     */
    public updateTabIndex(previousElement?: Element | null, nextElement?: Element | null): void {
        if (previousElement instanceof HTMLElement || previousElement instanceof SVGElement) {
            previousElement.setAttribute('tabindex', '-1');
        }
        if (nextElement instanceof HTMLElement || nextElement instanceof SVGElement) {
            nextElement.setAttribute('tabindex', '0');
        }
    }

    /**
     * Wraps an index into the valid range [0, total - 1].
     *
     * @param {number} index - The index to normalize.
     * @param {number} total - The total number of items in the collection.
     * @returns {number} The normalized index within bounds.
     *
     * @private
     */
    public normalizeIndex(index: number, total: number): number {
        return index > total - 1 ? 0 : (index < 0 ? total - 1 : index);
    }

    /**
     * Finds the index of an element by id within a list of elements.
     *
     * @param {Element[]} elements - The collection to search.
     * @param {string} targetId - The id of the element to find.
     * @returns {number} The index of the matching element, or 0 if not found.
     *
     * @private
     */
    public indexOfElementById(elements: Element[], targetId: string): number {
        for (let i: number = 0; i < elements.length; i++) {
            if ((elements[i as number] as Element).id === targetId) { return i; }
        }
        return 0;
    }

    /**
     * Removes the focused CSS class from elements currently marked as focused.
     *
     * @returns {void}
     */
    private clearFocusedClasses(): void {
        const focusedElements: NodeListOf<Element> = this.element.querySelectorAll('.e-sankey-focused');
        focusedElements.forEach((element: Element): void => {
            element.classList.remove('e-sankey-focused');
        });
    }

    /**
     * Focuses the specified element, applies the focused class, and ensures it is tabbable.
     *
     * @param {Element} element - The element to focus.
     * @returns {string} The id of the focused element, or an empty string if focus was not applied.
     *
     * @private
     */
    public focusElement(element: Element): string {
        if (!(element instanceof HTMLElement || element instanceof SVGElement)) { return ''; }

        this.clearFocusedClasses();

        element.setAttribute('tabindex', '0');
        element.classList.add('e-sankey-focused');
        (element as HTMLElement).focus();

        return element.id;
    }

    /**
     * Applies keyboard navigation outline styling to the specified target element by id.
     *
     * @param {string} targetId - The id of the element to style.
     * @returns {void}
     *
     * @private
     */
    public applyNavigationStyle(targetId: string): void {
        const targetElement: HTMLElement | SVGElement | null =
            document.getElementById(targetId) as (HTMLElement | SVGElement | null);
        if (!targetElement) { return; }

        const focusColor: string = this.focusBorderColor || this.themeStyle.tabColor;
        (targetElement as HTMLElement).style.setProperty('outline', `${this.focusBorderWidth}px solid ${focusColor}`);
        (targetElement as HTMLElement).style.setProperty('margin', `${this.focusBorderMargin}px`);
        // Ensure legacy outline-offset is cleared
        (targetElement as HTMLElement).style.removeProperty('outline-offset');
    }

    /**
     * Removes navigation outline styling from all focusable elements within the Sankey chart.
     *
     * @returns {void}
     *
     * @private
     */
    public clearNavigationStyles(): void {
        // Clear container outline (Alt+J focus)
        const hostElement: HTMLElement = this.element as HTMLElement;
        hostElement.style.setProperty('outline', 'none');
        hostElement.style.setProperty('outline-offset', '');

        const selector: string =
            `#${this.element.id}_title, ` +
            `#${this.element.id}_subtitle, ` +
            `#${this.element.id} [id*="_node_level_"], ` +
            `#${this.element.id} [id*="_link_level_"], ` +
            `#${this.element.id} [id*="_chart_legend_"]`;

        const elements: NodeListOf<Element> = document.querySelectorAll(selector);
        elements.forEach((el: Element): void => {
            if (el instanceof HTMLElement || el instanceof SVGElement) {
                el.style.setProperty('outline', 'none');
                el.style.setProperty('outline-offset', '');
                el.style.setProperty('margin', '');
            }
        });
    }

    /**
     * Determines the Sankey navigation group of a given element id.
     *
     * @param {string} targetId - The id of the element to classify.
     * @returns {'title' | 'subtitle' | 'nodes' | 'links' | 'legend' | null} The group name, or null if not recognized.
     *
     * @private
     */
    public getGroupOf(targetId: string): 'title' | 'subtitle' | 'nodes' | 'links' | 'legend' | null {
        if (!targetId) { return null; }

        if (targetId === `${this.element.id}_title`) { return 'title'; }
        if (targetId === `${this.element.id}_subtitle`) { return 'subtitle'; }
        if (targetId.indexOf('_node_level_') > -1) { return 'nodes'; }
        if (targetId.indexOf('_link_level_') > -1) { return 'links'; }
        if (targetId.indexOf('_chart_legend_g_') > -1) { return 'legend'; }

        return null;
    }

    /**
     * Gets all SVG node <rect> elements within the Sankey node collection.
     *
     * @returns {Element[]} An array of node elements.
     *
     * @private
     */
    public getNodeElements(): Element[] {
        const nodeList: NodeListOf<Element> =
            document.querySelectorAll(`#${this.element.id}_node_collection rect`);
        return Array.prototype.slice.call(nodeList) as Element[];
    }

    /**
     * Gets all SVG link <path> elements within the Sankey link collection.
     *
     * @returns {Element[]} An array of link elements.
     *
     * @private
     */
    public getLinkElements(): Element[] {
        const nodeList: NodeListOf<Element> =
            document.querySelectorAll(`#${this.element.id}_link_collection path`);
        return Array.prototype.slice.call(nodeList) as Element[];
    }

    /**
     * Gets all legend group elements within the Sankey legend container.
     *
     * @returns {Element[]} An array of legend group elements.
     *
     * @private
     */
    public getLegendItems(): Element[] {
        const nodeList: NodeListOf<Element> =
            document.querySelectorAll(`#${this.element.id}_chart_legend_translate_g > g`);
        return Array.prototype.slice.call(nodeList) as Element[];
    }

    /**
     * Moves keyboard focus within the specified group by the given step (delta).
     *
     * Uses a roving tabindex strategy among Nodes, Links, or Legend items.
     *
     * @param {'nodes' | 'links' | 'legend'} group - The group to navigate within.
     * @param {1 | -1} delta - The step to move focus by (1 for next, -1 for previous).
     * @returns {string | null} The id of the newly focused element, or null if none.
     *
     * @private
     */
    public moveFocusWithinGroup(group: 'nodes' | 'links' | 'legend', delta: 1 | -1): string | null {
        const items: Element[] =
            group === 'nodes' ? this.getNodeElements()
                : group === 'links' ? this.getLinkElements()
                    : this.getLegendItems();

        if (!items.length) { return null; }

        const currentIndex: number =
            group === 'nodes' ? this.currentNodeIndex
                : group === 'links' ? this.currentLinkIndex
                    : this.currentLegendIndex;

        const nextIndex: number = this.normalizeIndex(currentIndex + delta, items.length);
        this.updateTabIndex(items[currentIndex as number], items[nextIndex as number]);

        const newFocusedId: string = this.focusElement(items[nextIndex as number]);
        this.clearNavigationStyles();
        this.applyNavigationStyle(newFocusedId);

        if (group === 'nodes') {
            this.currentNodeIndex = nextIndex;
        } else if (group === 'links') {
            this.currentLinkIndex = nextIndex;
        } else {
            this.currentLegendIndex = nextIndex;
        }

        return newFocusedId;
    }

    /**
     * Applies highlight behavior based on the given element type (node or link).
     *
     * @param {Element} element - The element to highlight (node <rect> or link <path>).
     * @returns {void}
     *
     * @private
     */
    public applyHighlightForElement(element: Element): void {
        if (!this.sankeyHighlightModule) { return; }

        const elementId: string = element.id;

        if (elementId.indexOf('_node_level_') > -1) {
            const nodeId: string = element.getAttribute('aria-label');
            if (nodeId) {
                this.sankeyHighlightModule.highlightForNode(nodeId);
            }
        } else if (elementId.indexOf('_link_level_') > -1) {
            const sourceId: string = element.getAttribute('data-source');
            const targetId: string = element.getAttribute('data-target');
            if (sourceId && targetId) {
                this.sankeyHighlightModule.highlightForLink(sourceId, targetId);
            }
        }
    }

    /**
     * Ensures the tooltip module is created when tooltip is enabled.
     *
     * @returns {boolean} True if the tooltip module is available; otherwise, false.
     *
     * @private
     */
    public ensureTooltip(): boolean {
        if (!this.tooltipModule && this.tooltip && (this.tooltip as SankeyTooltipSettingsModel).enable) {
            this.tooltipModule = new SankeyTooltip(this);
        }
        return !!this.tooltipModule;
    }

    /**
     * Computes a fallback center position for an SVG element using client bounding rectangles.
     *
     * Converts the element's visual center from viewport coordinates to chart coordinate space,
     * relative to the initial clip rectangle.
     *
     * @param {Element} targetElement - The SVG element whose center should be calculated.
     * @returns {number | null} The computed center position, or null on failure.
     *
     * @private
     */
    public getElementCenterInChartCoords(targetElement: Element): { x: number; y: number } | null {
        const svgHost: HTMLElement = this.svgObject as HTMLElement;
        if (!svgHost) { return null; }

        const svgRect: DOMRect = svgHost.getBoundingClientRect() as DOMRect;
        const elementRect: DOMRect = (targetElement as Element).getBoundingClientRect() as DOMRect;

        const centerX: number = (elementRect.left + elementRect.width / 2) - svgRect.left;
        const centerY: number = (elementRect.top + elementRect.height / 2) - svgRect.top;

        return {
            x: centerX - this.initialClipRect.x + 4,
            y: centerY - this.initialClipRect.y + 4
        };
    }

    /**
     * Handles keydown events for Sankey keyboard interactions.
     *
     * Prevents default arrow key scrolling, clears effects on Escape,
     * and removes navigation outline on Tab. Triggers print on CtrlP.
     *
     * @param {KeyboardEvent} keyboardEvent - The keydown event.
     * @returns {boolean} Always returns false to prevent default behavior within the control.
     *
     * @private
     */
    public handleKeyDown(keyboardEvent: KeyboardEvent): boolean {
        const code: string = keyboardEvent.code;

        if (code && code.indexOf('Arrow') > -1) { keyboardEvent.preventDefault(); }
        if (code === 'Tab') { this.clearNavigationStyles(); }
        if (code === 'Escape') {
            this.clearNavigationStyles();
            if (this.sankeyHighlightModule) { this.sankeyHighlightModule.clearHighlights(); }
            if (this.tooltipModule) { this.tooltipModule.hideTooltip(0); }
        }
        if (code === 'CtrlP') { this.print(); }

        return false;
    }

    /**
     * Handles keyup events and delegates to Sankey keyboard navigation logic.
     *
     * Detects Tab, Arrow, and Escape actions and invokes the navigation handler.
     *
     * @param {KeyboardEvent} keyboardEvent - The keyup event.
     * @returns {boolean} Always returns false to prevent default behavior within the control.
     *
     * @private
     */
    public handleKeyUp(keyboardEvent: KeyboardEvent): boolean {
        const targetElement: HTMLElement = keyboardEvent.target as HTMLElement;
        const targetId: string = targetElement && targetElement.id ? targetElement.id : '';

        let action: 'Tab' | 'ArrowMove' | 'ESC' | '' = '';
        const code: string = keyboardEvent.code || '';

        if (code === 'Tab') { action = 'Tab'; }
        else if (code.indexOf('Arrow') > -1) { action = 'ArrowMove'; }
        else if (code === 'Escape') { action = 'ESC'; }

        if (!action) { return false; }

        this.handleKeyboardNavigation(keyboardEvent, targetId, action);
        return false;
    }

    /**
     * Executes roving tabindex navigation and tooltip/highlight behavior based on keyboard actions.
     *
     * Supports Arrow key movement within groups and Tab to move focus between groups, applying
     * highlight for nodes/links and hiding tooltip for non-tooltip groups (e.g., legend).
     *
     * @param {KeyboardEvent} keyboardEvent - The keyboard event that triggered navigation.
     * @param {string} targetId - The id of the currently focused element before navigation.
     * @param {'Tab' | 'ArrowMove' | 'Enter' | 'Space' | 'ESC'} action - The navigation action to perform.
     * @returns {void}
     *
     * @private
     */
    public handleKeyboardNavigation(
        keyboardEvent: KeyboardEvent,
        targetId: string,
        action: 'Tab' | 'ArrowMove' | 'Enter' | 'Space' | 'ESC'
    ): void {
        let group: string = this.getGroupOf(targetId) || this.currentGroup;

        if ((action === 'ArrowMove' || action === 'Tab') && group) {
            let newElementId: string | null = null;

            if (action === 'ArrowMove') {
                const forward: 1 | -1 = (keyboardEvent.code === 'ArrowRight' || keyboardEvent.code === 'ArrowDown') ? 1 : -1;

                if (group === 'nodes') {
                    const nodeElements: Element[] = this.getNodeElements();
                    this.currentNodeIndex = this.indexOfElementById(nodeElements, targetId);
                    newElementId = this.moveFocusWithinGroup('nodes', forward);
                } else if (group === 'links') {
                    const linkElements: Element[] = this.getLinkElements();
                    this.currentLinkIndex = this.indexOfElementById(linkElements, targetId);
                    newElementId = this.moveFocusWithinGroup('links', forward);
                } else if (group === 'legend') {
                    const legendItems: Element[] = this.getLegendItems();
                    this.currentLegendIndex = this.indexOfElementById(legendItems, targetId);
                    newElementId = this.moveFocusWithinGroup('legend', forward);
                }
            } else {
                const activeElement: Element | null = document.activeElement as Element | null;
                newElementId = activeElement && activeElement.id ? activeElement.id : targetId;

                const resolvedGroup: string = newElementId ? this.getGroupOf(newElementId) : null;
                if (resolvedGroup) { group = resolvedGroup; }

                if (newElementId && (group === 'nodes' || group === 'links')) {
                    this.applyNavigationStyle(newElementId);
                }
            }

            if (!newElementId) { return; }

            const element: Element | null = document.getElementById(newElementId);

            if (element && (group === 'nodes' || group === 'links')) {
                this.applyHighlightForElement(element);

                if (this.ensureTooltip()) {
                    let centerPosition: ChartLocation;
                    if (!centerPosition) { centerPosition = this.getElementCenterInChartCoords(element); }
                    if (centerPosition) {
                        const isFirst: boolean = !this.tooltipModule.svgTooltip;
                        this.tooltipModule.showTooltipForElement(element, isFirst, centerPosition);
                    }
                }
            } else {
                if (this.tooltipModule) { this.tooltipModule.hideTooltip(0); }

                if (group === 'legend' && this.sankeyHighlightModule && element) {
                    const label: string = element.getAttribute('aria-label');
                    if (label) {
                        this.sankeyHighlightModule.highlightForNode(label);
                    } else {
                        this.sankeyHighlightModule.clearHighlights();
                    }
                }
            }
            return;
        }
    }


    /**
     * Provides the list of modules required to render the control (series, tooltip, legend, export, etc.).
     *
     * @returns {ModuleDeclaration[]} returns required modules injected in sample.
     *
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.tooltip && (this.tooltip as SankeyTooltipSettingsModel).enable) {
            modules.push({ member: 'SankeyTooltip', args: [this] });
        }

        if (this.legendSettings && (this.legendSettings as SankeyLegendSettingsModel).visible) {
            modules.push({ member: 'SankeyLegend', args: [this] });
        }
        if (this.enableExport) {
            modules.push({
                member: 'SankeyExport',
                args: [this]
            });
        }

        return modules;
    }

    /**
     * To destroy the widget
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.nodeLayoutMap = null;
        removeElement('chartmeasuretext');
        if (this.element) {
            removeElement(this.element.id + '_tooltip_parent');
            this.unWireEvents();
            if (this.isReact) { this.clearTemplate(); }
            super.destroy();
            this.removeSvg();
            this.svgObject = null;
        }

    }

    /**
     * Returns the name of the module used for Sankey control identification.
     *
     * @returns {string} - the module name
     * @private
     */
    public getModuleName(): string {
        return 'sankey';
    }
}

