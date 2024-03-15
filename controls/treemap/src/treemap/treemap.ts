/**
 * Tree Map Components
 */

import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, extend, Fetch } from '@syncfusion/ej2-base';
import { Complex, Collection, ModuleDeclaration } from '@syncfusion/ej2-base';
import { Event, EmitType, Internationalization } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { isNullOrUndefined, createElement, EventHandler, Browser, remove } from '@syncfusion/ej2-base';
import { BorderModel, TitleSettingsModel, MarginModel, LevelSettingsModel, FontModel } from './model/base-model';
import { LeafItemSettingsModel, TooltipSettingsModel, LegendSettingsModel, InitialDrillSettingsModel } from './model/base-model';
import { HighlightSettingsModel, SelectionSettingsModel } from './model/base-model';
import { Border, Margin, TitleSettings, LegendSettings, InitialDrillSettings } from './model/base';
import { SelectionSettings, TooltipSettings, LevelSettings, LeafItemSettings, HighlightSettings } from './model/base';
import { TreeMapModel } from './treemap-model';
import { LayoutMode, TreeMapTheme, RenderingMode } from './utils/enum';
import { ILoadEventArgs, ILoadedEventArgs, IPrintEventArgs } from '../treemap/model/interface';
import { ILegendItemRenderingEventArgs, ILegendRenderingEventArgs } from '../treemap/model/interface';
import { IItemRenderingEventArgs, IResizeEventArgs, IDoubleClickEventArgs, IRightClickEventArgs } from '../treemap/model/interface';
import { IItemClickEventArgs, IItemMoveEventArgs, IClickEventArgs, IMouseMoveEventArgs } from '../treemap/model/interface';
import { IDrillStartEventArgs, IItemSelectedEventArgs, ITreeMapTooltipRenderEventArgs } from '../treemap/model/interface';
import { IItemHighlightEventArgs, IDrillEndEventArgs, IThemeStyle } from '../treemap/model/interface';
import { Size, stringToNumber, RectOption, Rect, textTrim, measureText, findChildren, removeElement, setItemTemplateContent } from '../treemap/utils/helper';
import { removeClassNames, removeShape, textFormatter } from '../treemap/utils/helper';
import { findPosition, Location, TextOption, renderTextElement, isContainsData, TreeMapAjax } from '../treemap/utils/helper';
import { load, loaded, drillStart, drillEnd } from '../treemap/model/constants';
import { itemClick, itemMove, click, mouseMove, resize, doubleClick, rightClick } from '../treemap/model/constants';
import { LayoutPanel } from './layout/render-panel';
import { TreeMapTooltip } from './user-interaction/tooltip';
import { ExportType } from '../treemap/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { TreeMapHighlight, TreeMapSelection } from './user-interaction/highlight-selection';
import { TreeMapLegend } from './layout/legend';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { getThemeStyle } from './model/theme';
import { Print } from './model/print';
import { ImageExport } from './model/image-export';
import { PdfExport } from './model/pdf-export';
/**
 * Represents the treemap control. It is used to visualize both hierarchical and flat data.
 * ```html
 * <div id="container"/>
 * <script>
 *   var treemap = new TreeMap();
 *   treemap.appendTo("#container");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class TreeMap extends Component<HTMLElement> implements INotifyPropertyChanged {
    //Module Declaration for treemap.
    /**
     * Sets and gets the module that is used to add tooltip in the treemap.
     * @private
     */
    public treeMapTooltipModule: TreeMapTooltip;
    /**
     * Sets and gets the module that is used to add highlight functionality in the treemap.
     * @private
     */
    public treeMapHighlightModule: TreeMapHighlight;
    /**
     * Sets and gets the module that is used to add selection functionality in the treemap.
     * @private
     */
    public treeMapSelectionModule: TreeMapSelection;
    /**
     * Sets and gets the module that is used to add legend in the treemap.
     * @private
     */
    public treeMapLegendModule: TreeMapLegend;
    /**
     * Sets and gets the module that is used to add print functionality in the treemap.
     *
     * @private
     */
    public printModule: Print;
    /**
     * Sets and gets the module that is used to add imageExport functionality in the treemap.
     *
     * @private
     */
    public imageExportModule: ImageExport;
    /**
     * Sets and gets the module that is used to add pdf export functionality in the treemap.
     *
     * @private
     */
    public pdfExportModule: PdfExport ;
    /**
     * Enables and disables the print functionality in treemap.
     *
     * @default false
     */
    @Property(false)
    public allowPrint: boolean;
    /**
     * Enables and disables the export to image functionality in treemap.
     *
     * @default false
     */
    @Property(false)
    public allowImageExport: boolean;
    /**
     * Enables and disables the export to pdf functionality in treemap.
     *
     * @default false
     */
    @Property(false)
    public allowPdfExport: boolean;
    /**
     * Sets and gets the width of the treemap.
     *
     * @default null
     */
    @Property(null)
    public width: string;
    /**
     * Sets and gets the height of the treemap.
     *
     * @default null
     */
    @Property(null)
    public height: string;
    /**
     * Sets and gets the options for customizing the color and width of the treemap border.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Sets and gets the options for customizing the margin in the treemap.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;
    /**
     * Sets and gets the background color of the treemap.
     *
     * @default null
     */
    @Property(null)
    public background: string;
    /**
     * Sets and gets the theme styles supported for treemap. When the theme is set, the styles associated with the theme will be set in the treemap.
     *
     * @default Material
     */
    @Property('Material')
    public theme: TreeMapTheme;
    /**
     * Sets and gets the options for customizing the title of the treemap.
     */
    @Complex<TitleSettingsModel>({}, TitleSettings)
    public titleSettings: TitleSettingsModel;
    /**
     * Specifies the rendering type for the layout of the treemap.
     *
     * @default 'Squarified'
     */
    @Property('Squarified')
    public layoutType: LayoutMode;
    /**
     * Sets and gets the data source for the treemap.
     *
     * @isGenericType true
     * @isObservable true
     * @default null
     */
    @Property(null)
    public dataSource: DataManager | TreeMapAjax | Object[];
    /**
     * Sets and gets the query to select particular data from the shape data.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    @Property(null)
    public query: Query;
    /**
     * Sets and gets the value path of the weight from the data source, based on which the treemap item is rendered.
     *
     * @default null
     */
    @Property(null)
    public weightValuePath: string;
    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     * This property is used when range color mapping is set in the treemap.
     *
     * @default ''
     */
    @Property('')
    public rangeColorValuePath: string;
    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     * This property is used when equal color mapping is set in the treemap.
     *
     * @default ''
     */
    @Property('')
    public equalColorValuePath: string;
    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     *
     * @default null
     */
    @Property(null)
    public colorValuePath: string;
    /**
     * Sets and gets a set of colors to apply in the treemap items.
     *
     * @default []
     */
    @Property([])
    public palette: string[];
    /**
     * Specifies the rendering direction of layout of the treemap items.
     *
     * @default TopLeftBottomRight
     */
    @Property('TopLeftBottomRight')
    public renderDirection: RenderingMode;
    /**
     * Enables or disables the drill down functionality in treemap.
     *
     * @default false
     */
    @Property(false)
    public enableDrillDown: boolean;
    /**
     * Enables or disables the connection text in the header of the treemap when drill down is enabled.
     *
     * @default false
     */
    @Property(false)
    public enableBreadcrumb: boolean;
    /**
     * Specifies the symbol to show connection between the two words in the header of the treemap during drill down.
     *
     * @default ' - '
     */
    @Property(' - ')
    public breadcrumbConnector: string;
    /**
     * Enables or disables the initial drill in the treemap.
     *
     * @default false
     */
    @Property(false)
    public drillDownView: boolean;
    /**
     * Specifies the options for customizing the initial drill down in treemap.
     */
    @Complex<InitialDrillSettingsModel>({}, InitialDrillSettings)
    public initialDrillDown: InitialDrillSettingsModel;
    /**
     * Sets and gets the options for customizing the leaf item of the treemap.
     */
    @Complex<LeafItemSettingsModel>({}, LeafItemSettings)
    public leafItemSettings: LeafItemSettingsModel;
    /**
     * Sets and gets the options to configure and customize the levels of treemap items.
     */
    @Collection<LevelSettingsModel>([], LevelSettings)
    public levels: LevelSettingsModel[];
    /**
     * Sets and gets the options to customize the highlight functionality of the treemap.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
    /**
     * Sets and gets the options for customizing the selection functionality of the treemap.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Sets and gets the options for customizing the tooltip of the treemap.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * Sets and gets the options for customizing the legend of the treemap.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;
    /**
     * Enables or disables the visibility state of the separator for grouping.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;
    /**
     * Sets and gets the description for treemap.
     *
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * Sets and gets the tab index value for treemap.
     *
     * @default 0
     */
    @Property(0)
    public tabIndex: number;
    /**
     * Sets and gets format for the texts in the treemap. This property accepts any global string format like 'C', 'N1', 'P' etc.
     *
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Triggers before the treemap is rendered.
     *
     * @event load
     */
    @Event()
    public load: EmitType<ILoadEventArgs>;
    /**
     * Triggers before the print gets started.
     *
     * @event beforePrint
     */
    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;
    /**
     * Triggers after treemap is rendered.
     *
     * @event loaded
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers before item rendering in the treemap.
     *
     * @event itemRendering
     */
    @Event()
    public itemRendering: EmitType<IItemRenderingEventArgs>;
    /**
     * Triggers on performing drill down functionality in the treemap.
     *
     * @event drillStart
     */
    @Event()
    public drillStart: EmitType<IDrillStartEventArgs>;
    /**
     * Triggers after drill down functionality gets completed in the treemap.
     *
     * @event drillEnd
     */
    @Event()
    public drillEnd: EmitType<IDrillEndEventArgs>;
    /**
     * Triggers after selecting a treemap item.
     *
     * @event itemSelected
     */
    @Event()
    public itemSelected: EmitType<IItemSelectedEventArgs>;
    /**
     * Triggers after highlighting on the treemap item.
     *
     * @event itemHighlight
     */
    @Event()
    public itemHighlight: EmitType<IItemHighlightEventArgs>;
    /**
     * Triggers on rendering of the tooltip in the treemap.
     *
     * @event tooltipRendering
     */
    @Event()
    public tooltipRendering: EmitType<ITreeMapTooltipRenderEventArgs>;
    /**
     * Triggers after clicking an item in the treemap.
     *
     * @event itemClick
     */
    @Event()
    public itemClick: EmitType<IItemClickEventArgs>;
    /**
     * Triggers after mouse hover on the treemap item.
     *
     * @event itemMove
     */
    @Event()
    public itemMove: EmitType<IItemMoveEventArgs>;
    /**
     * Triggers after clicking on the treemap.
     *
     * @event click
     */
    @Event()
    public click: EmitType<IItemClickEventArgs>;
    /**
     * Triggers after double clicking on the treemap.
     *
     * @event doubleClick
     */
    @Event()
    public doubleClick: EmitType<IDoubleClickEventArgs>;
    /**
     * Triggers after right clicking on the treemap.
     *
     * @event rightClick
     */
    @Event()
    public rightClick: EmitType<IMouseMoveEventArgs>;
    /**
     * Triggers after mouse hover on the treemap.
     *
     * @event mouseMove
     */
    @Event()
    public mouseMove: EmitType<IMouseMoveEventArgs>;
    /**
     * Triggers to notify the resize of the treemap when the window is resized.
     *
     * @event resize
     */
    @Event()
    public resize: EmitType<IResizeEventArgs>;
    /**
     * Triggers before rendering each legend item in the treemap.
     *
     * @event legendItemRendering
     */
    @Event()
    public legendItemRendering: EmitType<ILegendItemRenderingEventArgs>;
    /**
     * Triggers before rendering the legend items in the treemap.
     *
     * @event legendRendering
     * @deprecated
     */
    @Event()
    public legendRendering: EmitType<ILegendRenderingEventArgs>;

    /**
     * resize the treemap
     */
    private isResize: boolean = false;
    /**
     * svg renderer object.
     *
     * @private
     */
    public renderer: SvgRenderer;
    /**
     * treemap svg element object
     *
     * @private
     */
    public svgObject: Element;
    /**
     * Stores the exact size of treemap.
     *
     * @private
     */
    public availableSize: Size;
    /**
     * Internal use of internationalization instance.
     *
     * @private
     */
    public intl: Internationalization;
    /**
     * Stores the area bounds.
     *
     * @private
     */
    public areaRect: Rect;
    /**
     * Define the theme style for treemap.
     *
     * @private
     */
    public themeStyle: IThemeStyle;
    /**
     * Stores the legend bounds.
     *
     * @private
     */
    public totalRect: Rect;
    /** @private */
    public layout: LayoutPanel;
    /** @private */
    public orientation: string = 'Horizontal';
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public drilledItems: any[] = [];
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public drilledLegendItems: any;
    /** @private */
    public currentLevel: number;
    /** @private */
    public isHierarchicalData: boolean = false;
    /** @private */
    private resizeTo: number;
    /** @private */
    private mouseDown: boolean;
    /** @private */
    private drillMouseMove: boolean;
    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public doubleTapTimer: any;
    /** @private */
    public levelSelection: string[] = [];
    /** @private */
    public legendId: string[] = [];
    /** @private */
    public selectionId: string;
    /** @private */
    public treemapLevelData: LevelsData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private resizeEvent: any;

    /**
     * Constructor for TreeMap.
     *
     * @param {TreeMapModel} options - Specifies the treemap instance.
     * @param {string | HTMLElement} element - Specifies the treemap element.
     */
    constructor(options?: TreeMapModel, element?: string | HTMLElement) {
        super(options, element);
    }

    protected preRender(): void {
        this.trigger(load, { treemap: this }, () => {
            this.initPrivateVariable();
            this.unWireEVents();
            this.createSvg();
            this.wireEVents();
            this.setCulture();
        });

    }

    protected render(): void {
        this.renderElements();
    }

    private renderElements(): void {
        this.treemapLevelData = new LevelsData();
        this.treemapLevelData.levelsData = null;
        this.treemapLevelData.defaultLevelsData = null;
        this.treemapLevelData.hierarchyData = null;
        this.createSecondaryElement();
        this.addTabIndex();
        this.themeStyle = getThemeStyle(this.theme);
        this.renderBorder();
        this.renderTitle(this.titleSettings, 'title', null, null);
        if (!isNullOrUndefined(this.treemapLevelData.levelsData)) {
            this.treemapLevelData.defaultLevelsData = this.treemapLevelData.levelsData;
        }
        this.processDataManager();
    }

    private processDataManager(): void {
        let dataModule: DataManager; let queryModule: Query; let fetchApiModule: Fetch;
        let localAjax: TreeMapAjax;
        if (this.dataSource instanceof DataManager) {
            dataModule = this.dataSource;
            queryModule = this.query instanceof Query ? this.query : new Query();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataManager: Promise<any> = dataModule.executeQuery(queryModule);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dataManager.then((e: any) => {
                this.dataSource = e['result'];
                this.renderTreeMapElements();
            });
        } else if (this.dataSource instanceof TreeMapAjax) {
            localAjax = this.dataSource as TreeMapAjax;
            fetchApiModule = new Fetch(localAjax.dataOptions, localAjax.type, localAjax.contentType);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchApiModule.onSuccess = (args: any) => {
                if (!isNullOrUndefined(args.type) && args.type === 'application/octet-stream') {
                    let reader: FileReader = new FileReader();
                    let treemap: TreeMap = this;
                    reader.onload = function (data) {
                        args = JSON.parse(reader.result.toString());
                        treemap.dataSource = args;
                        treemap.renderTreeMapElements();
                    };
                    reader.readAsText(args);
                } else {
                    this.dataSource = args;
                    this.renderTreeMapElements();
                }
            };
            fetchApiModule.send(localAjax.sendData);
        } else {
            this.renderTreeMapElements();
        }
    }

    private renderTreeMapElements(): void {

        this.processingData();

        if (this.treeMapLegendModule && this.legendSettings.visible) {

            this.treeMapLegendModule.renderLegend();

        }

        this.layout.processLayoutPanel();

        this.element.appendChild(this.svgObject);

        this.elementChange();

        this.trigger(loaded, {treemap: this, isResized: this.isResize});
        this.isResize = false;

        this.renderComplete();
    }

    protected createSvg(): void {
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        if (isNullOrUndefined(this.renderer)) {
            this.renderer = new SvgRenderer(this.element.id);
        }
        if (isNullOrUndefined(this.layout)) {
            this.layout = new LayoutPanel(this);
        }
        this.clearTemplate();
        const containerWidth: number = this.element.clientWidth;
        const containerHeight: number = this.element.clientHeight;
        this.availableSize = new Size(
            stringToNumber(this.width, containerWidth) || containerWidth || 600,
            stringToNumber(this.height, containerHeight) || containerHeight || 450
        );
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    }


    /**
     * To initilize the private varibales of treemap.
     *
     * @returns {void}
     */
    private initPrivateVariable(): void {
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-treemap').length;
            this.element.id = 'treemap_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);

        this.layout = new LayoutPanel(this);

    }

    private createSecondaryElement(): void {
        const secondaryEle: Element = document.getElementById(this.element.id + '_Secondary_Element');
        if (secondaryEle && secondaryEle.childElementCount > 0) {
            secondaryEle.parentNode.removeChild(secondaryEle);
        }
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            const secondaryElement: Element = createElement('div', {
                id: this.element.id + '_Secondary_Element'
            });
            (secondaryElement as HTMLElement).style.cssText = 'position: absolute;z-index:1;';
            this.element.appendChild(secondaryElement);
        }
    }

    private elementChange(): void {
        if (this.treeMapLegendModule && this.legendSettings.visible && this.treeMapLegendModule.legendGroup && this.layout.layoutGroup
            && !isNullOrUndefined(this.svgObject) && !isNullOrUndefined(document.getElementById(this.layout.layoutGroup.id))
            && !isNullOrUndefined(document.getElementById(this.treeMapLegendModule.legendGroup.id))) {
            this.svgObject.insertBefore(this.layout.layoutGroup, this.treeMapLegendModule.legendGroup);
        }
    }

    /**
     * Render the treemap border
     *
     * @private
     * @returns {void}
     */
    private renderBorder(): void {
        const width: number = this.border.width;
        const borderElement: Element = this.svgObject.querySelector('#' + this.element.id + '_TreeMap_Border');
        if ((this.border.width > 0 || (this.background || this.themeStyle.backgroundColor)) && isNullOrUndefined(borderElement)) {
            const borderRect: RectOption = new RectOption(
                this.element.id + '_TreeMap_Border', this.background || this.themeStyle.backgroundColor, this.border, 1,
                new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect) as SVGRectElement);
        } else if (borderElement) {
            borderElement.setAttribute('fill', this.background || this.themeStyle.backgroundColor);
        }
    }

    private renderTitle(title: TitleSettingsModel, type: string, bounds: Rect, groupEle: Element): void {
        const style: FontModel = {
            color: title.textStyle.color, size: title.textStyle.size, fontFamily: title.textStyle.fontFamily,
            fontStyle: title.textStyle.fontStyle, fontWeight: title.textStyle.fontWeight, opacity: title.textStyle.opacity
        };
        let height: number; const titlePadding: number = 10;
        const width: number = (this.availableSize.width - this.margin.right - this.margin.left);
        style.fontFamily = style.fontFamily || this.themeStyle.fontFamily;
        style.fontWeight = style.fontWeight || this.themeStyle.titleFontWeight;
        style.size = style.size || (type === 'title' ? this.themeStyle.fontSize : this.themeStyle.subtitleFontSize);
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            const trimmedTitle: string = textTrim(width, title.text, style);
            const elementSize: Size = measureText(trimmedTitle, style);
            const rect: Rect = (isNullOrUndefined(bounds)) ? new Rect(
                this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            const location: Location = findPosition(rect, title.alignment, elementSize, type);
            const options: TextOption = new TextOption(
                this.element.id + '_TreeMap_' + type, location.x, location.y, 'start', trimmedTitle
            );
            const titleBounds: Rect = new Rect(location.x, location.y, elementSize.width, elementSize.height);
            const element: Element = renderTextElement(
                options, style, style.color || (type === 'title' ? this.themeStyle.titleFontColor : this.themeStyle.subTitleFontColor),
                groupEle
            );
            element.setAttribute('aria-label', title.description || title.text);
            element.setAttribute('role', 'region');
            element.setAttribute('tabindex', this.tabIndex.toString());
            if ((type === 'title' && !title.subtitleSettings.text) || (type === 'subtitle')) {
                height = (this.availableSize.height - titleBounds.y - titlePadding - this.margin.bottom);
                this.areaRect = new Rect(this.margin.left, titleBounds.y + titlePadding, width, height);
            }
            if (type !== 'subtitle' && title.subtitleSettings.text) {
                this.renderTitle(title.subtitleSettings, 'subtitle', titleBounds, groupEle);
            } else {
                this.svgObject.appendChild(groupEle);
            }
        } else {
            height = (this.availableSize.height - this.margin.top - this.margin.bottom);
            this.areaRect = new Rect(this.margin.left, this.margin.top, width, height);
        }
    }

    protected processingData(): void {
        let path: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.dataSource = this.dataSource as any[];
        if (!isNullOrUndefined(this.dataSource) && this.dataSource.length > 0 && this.weightValuePath) {
            this.treemapLevelData.levelsData = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.dataSource.map((data: any) => {
                data[this.weightValuePath] = (data[this.weightValuePath]) ? (data[this.weightValuePath] as string).toString() :
                    data[this.weightValuePath];
            });
            this.leafItemSettings.labelPath = this.leafItemSettings.labelPath || this.weightValuePath;
            this.checkIsHierarchicalData();
            if (this.levels.length === 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: any = {};
                data['level'] = 0;
                path = this.leafItemSettings.labelPath;
                data[path as string] = [];
                for (let i: number = 0; i < this.dataSource.length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const child: any[] = findChildren(this.dataSource[i as number] as any)['values'];
                    if (this.isHierarchicalData && child && child.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        child.forEach((currentData: any) => {
                            if (currentData[path as string]) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (<any[]>data[path as string]).push({
                                    groupIndex: 0, name: currentData[path as string],
                                    levelOrderName: (currentData[path as string] as string).toString(),
                                    data: currentData, weight: currentData[this.weightValuePath]
                                });
                            }
                        });
                    } else {
                        if (this.dataSource[i as number][path as string]) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (<any[]>data[path as string]).push({
                                groupIndex: 0, name: this.dataSource[i as number][path as string], levelOrderName: (
                                    this.dataSource[i as number][path as string] as string).toString(), data: this.dataSource[i as number],
                                weight: this.dataSource[i as number][this.weightValuePath]
                            });
                        }
                    }
                }
                this.treemapLevelData.levelsData.push(data);
            } else {
                if (this.isHierarchicalData) {
                    this.treemapLevelData.hierarchyData = [];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.treemapLevelData.hierarchyData = extend([], this.dataSource, this.treemapLevelData.hierarchyData, true) as any[];
                    for (let i: number = 0; i < this.treemapLevelData.hierarchyData.length; i++) {
                        this.processHierarchicalData(this.treemapLevelData.hierarchyData[i as number], i);
                    }
                    this.treemapLevelData.levelsData = this.treemapLevelData.hierarchyData;
                } else {
                    this.processFlatJsonData();
                    if (this.treemapLevelData.levelsData.length > 1) {
                        this.reOrderLevelData(this.treemapLevelData.levelsData.length - 1);
                    }
                }
                path = this.levels[0].groupPath;
            }
            if (!this.isHierarchicalData) {
                this.findTotalWeight(this.treemapLevelData.levelsData[0][path as string], 'Parent');
            }
        }
    }

    private checkIsHierarchicalData(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let child: any[]; this.dataSource = this.dataSource as any[];
        for (let i: number = 0; i < this.dataSource.length; i++) {
            child = findChildren(this.dataSource[i as number])['values'];
            if (child && child.length) {
                this.isHierarchicalData = true;
                break;
            } else if (i === this.dataSource.length - 1) {
                this.isHierarchicalData = false;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private processHierarchicalData(data: any, dataCount: number): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let childData: any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let newData: any = {};
        let levelIndex: number;
        const path: string = this.leafItemSettings.labelPath ? this.leafItemSettings.labelPath : this.weightValuePath;
        let key: string;
        newData = findChildren(data);
        childData = newData ? newData['values'] : null;
        if (childData && childData.length > 0) {
            key = newData['key'];
            for (let i: number = 0; i < this.levels.length; i++) {
                if (key === this.levels[i as number].groupPath) {
                    levelIndex = i;
                }
            }
            for (let j: number = 0; j < childData.length; j++) {
                childData[j as number]['name'] = childData[j as number][path as string];
                childData[j as number]['levelOrderName'] = (levelIndex === 0 ? childData[j as number]['name'] :
                    data['levelOrderName'] + '#' + childData[j as number]['name']) + '';
                const childItemLevel: string = childData[j as number]['levelOrderName']; let childLevel: number;
                if (childItemLevel.search('#') > 0) {
                    childLevel = childItemLevel.split('#').length - 1;
                }
                childData[j as number]['groupIndex'] = isNullOrUndefined(levelIndex) ? childLevel === this.levels.length
                    ? this.levels.length : childLevel : levelIndex;
                if (levelIndex !== 0) {
                    childData[j as number]['parent'] = data;
                }
                childData[j as number]['groupName'] = key;
                childData[j as number]['data'] = childData[j as number];
                childData[j as number]['isDrilled'] = false;
                childData[j as number]['weight'] = childData[j as number][this.weightValuePath];
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            childData.forEach((currentData: any) => {
                this.processHierarchicalData(currentData, dataCount);
            });
        }
        if (dataCount === this.treemapLevelData.hierarchyData.length - 1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let mainData: any[] = this.treemapLevelData.hierarchyData[0][this.levels[0].groupPath];
            for (let k: number = 0; k < this.treemapLevelData.hierarchyData.length; k++) {
                childData = findChildren(this.treemapLevelData.hierarchyData[k as number])['values'];
                if (k !== 0 && childData) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    childData.forEach((currentData: any) => { mainData.push(currentData); });
                    this.treemapLevelData.hierarchyData.splice(k, 1);
                    k -= 1;
                }
            }
            mainData = this.treemapLevelData.hierarchyData[0][this.levels[0].groupPath];
            for (let l: number = 0; l < mainData.length; l++) {
                newData[this.levels[0].groupPath] = mainData;
                mainData[l as number]['parent'] = newData;
            }
        }
    }
    /* eslint-disable valid-jsdoc */
    /**
     * This method is used to perform the print functionality in treemap.
     *
     * @param {string[] | string | Element} id - Specifies the element to print the treemap.
     * @returns {void}
     */
    public print(id?: string[] | string | Element): void {
        if (this.allowPrint && this.printModule) {
            this.printModule.print(this, id);
        }
    }
    /**
     * This method is used to perform the export functionality for the rendered treemap.
     *
     * @param {ExportType} type - Specifies the extension type of the exported document.
     * @param {string} fileName - Specifies file name for exporting the rendered TreeMap.
     * @param {PdfPageOrientation} orientation - Specifies the orientation of the PDF document.
     * @param {boolean} allowDownload - Specifies whether the exported file should be downloaded or not.
     * @returns {string} - Specifies the base64 string of the exported image which is returned when the allowDownload is set to false.
     */
    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string> {
        if (isNullOrUndefined(allowDownload)) {
            allowDownload = true;
        }
        if (type === 'PDF' && this.allowPdfExport && this.pdfExportModule) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            return new Promise((resolve: any, reject: any) => {
                resolve(this.pdfExportModule.export(this, type, fileName, orientation, allowDownload));
            });

        } else if (this.allowImageExport && (type !== 'PDF') && this.imageExportModule) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            return new Promise((resolve: any, reject: any) => {
                resolve(this.imageExportModule.export(this, type, fileName, allowDownload));
            });
        }
        return null;
    }
    private processFlatJsonData(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.dataSource = this.dataSource as any[];
        let groupPath: string;
        const orderNames: string[] = [];
        for (let i: number = 0; i < this.levels.length + 1; i++) {
            groupPath = this.levels[i as number] ? this.levels[i as number].groupPath : this.leafItemSettings.labelPath;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const level: any = {};
            level['level'] = i;
            level[groupPath as string] = [];
            this.treemapLevelData.levelsData.push(level);
            for (let j: number = 0; j < this.dataSource.length; j++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const currentData: any = {}; let childName: string = '';
                if (!isNullOrUndefined(groupPath)) {
                    const name: string = this.dataSource[j as number][groupPath as string];
                    if (i !== 0) {
                        for (let k: number = 0; k <= i; k++) {
                            const childGroupPath: string = this.levels[k as number] ? this.levels[k as number].groupPath : groupPath;
                            childName += (this.dataSource[j as number][childGroupPath as string]) + ((k === i) ? '' : '#');
                        }
                    }
                    if (!(orderNames.length > 0 ? orderNames.indexOf(childName ?
                        childName : name) !== -1 : false)) {
                        currentData['name'] = name;
                        currentData['levelOrderName'] = ((childName) ? childName : name) + '';
                        currentData['groupIndex'] = i;
                        currentData['isDrilled'] = false;
                        currentData['groupName'] = groupPath;
                        currentData['data'] = this.dataSource[j as number];
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any, max-len
                        (<any[]>this.treemapLevelData.levelsData[(this.treemapLevelData.levelsData.length - 1) as number][groupPath as string]).push(currentData);
                        orderNames.push((childName) ? childName : name);
                    }
                }
            }
        }
    }

    /**
     * This method orders the treemap level data.
     *
     * @param {number} start - Specifies the start value of the treemap level.
     * @returns {void}
     * @private
     */
    public reOrderLevelData(start: number): void {
        let currentName: string;
        const currentPath: string = this.levels[start as number] ? this.levels[start as number].groupPath : this.leafItemSettings.labelPath;
        const prevPath: string = this.levels[start - 1].groupPath;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentData: any[] = this.treemapLevelData.levelsData[start as number][currentPath as string] as any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const previousData: any[] = this.treemapLevelData.levelsData[start - 1][prevPath as string] as any[];
        for (let i: number = 0; i < currentData.length; i++) {
            currentName = currentData[i as number]['levelOrderName'] as string;
            for (let j: number = 0; j < previousData.length; j++) {
                previousData[j as number][currentPath as string] = isNullOrUndefined(previousData[j as number][currentPath as string]) ?
                    [] : previousData[j as number][currentPath as string];
                if (this.IsChildHierarchy(currentName.split('#'), (previousData[j as number]['levelOrderName'] as string).split('#'))) {
                    if (isNullOrUndefined(currentData[i as number]['parent'])) {
                        currentData[i as number]['parent'] = previousData[j as number];
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (<any[]>previousData[j as number][currentPath as string]).push(currentData[i as number]);
                    break;
                }
            }
        }
        this.findTotalWeight(this.treemapLevelData.levelsData[this.treemapLevelData.levelsData.length - 1][currentPath as string], 'Child');
        this.treemapLevelData.levelsData.splice(start, 1);
        if ((start - 1) > 0) {
            this.reOrderLevelData(start - 1);
        }
    }

    private IsChildHierarchy (current: string[], previous: string[]): boolean {
        let isChild: boolean = false;
        for (let i: number = 0; i < previous.length; i++)
        {
            if (current.length < i || previous[i as number] !== current[i as number])
            {
                return false;
            }
            else
            {
                isChild = true;
            }
        }
        return isChild;
    }

    /**
     * This method finds the weight value of the treemap level.
     *
     * @param {any[]} processData - Specifies the treemap data.
     * @param {string} type - Specifies the type of the data.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public findTotalWeight(processData: any[], type: string): void {
        let totalWeight: number;
        let split: string[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let groupName: string; const groupObj: any = {};
        for (let i: number = 0; i < processData.length; i++) {
            totalWeight = 0;
            groupName = processData[i as number]['groupName'];
            split = (processData[i as number]['levelOrderName'] as string).split('#');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (<any[]>this.dataSource).forEach((data: any) => {
                if (isContainsData(split, processData[i as number]['levelOrderName'], data, this)) {
                    totalWeight += parseFloat(data[this.weightValuePath]);
                }
            });
            if (type === 'Parent') {
                groupObj[groupName as string] = processData;
                processData[i as number]['parent'] = groupObj;
            }
            processData[i as number]['weight'] = totalWeight;
        }
    }

    /**
     * To unbind event handlers for treemap.
     *
     * @returns {void}
     * @private
     */
    private unWireEVents(): void {
        EventHandler.remove(this.element, 'click', this.clickOnTreeMap);
        EventHandler.remove(this.element, 'dblclick', this.doubleClickOnTreeMap);
        EventHandler.remove(this.element, 'contextmenu', this.rightClickOnTreeMap);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnTreeMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnTreeMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnTreeMap);
        EventHandler.remove(this.element, 'pointerleave mouseleave', this.mouseLeaveOnTreeMap);
        window.removeEventListener('resize', this.resizeEvent);
    }

    /**
     * To bind event handlers for treemap.
     *
     * @returns {void}
     */
    private wireEVents(): void {
        EventHandler.add(this.element, 'click', this.clickOnTreeMap, this);
        EventHandler.add(this.element, 'dblclick', this.doubleClickOnTreeMap, this);
        EventHandler.add(this.element, 'contextmenu', this.rightClickOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnTreeMap, this);
        EventHandler.add(this.element, 'pointerleave mouseleave', this.mouseLeaveOnTreeMap, this);
        this.resizeEvent = this.resizeOnTreeMap.bind(this);
        window.addEventListener('resize', this.resizeEvent);
    }

    /**
     * Method to set culture for maps
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * To add tab index for treemap element
     *
     * @returns {void}
     */
    private addTabIndex(): void {
        this.element.setAttribute('aria-label', this.description || 'TreeMap Element');
        this.element.setAttribute('role', 'region');
        this.element.setAttribute('tabindex', this.tabIndex.toString());
    }

    /**
     * This method handles the window resize event on treemap.
     *
     * @param {Event} e - Specifies the pointer event.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public resizeOnTreeMap(e: Event): void {
        if (!this.isDestroyed) {
            this.isResize = true;
            const args: IResizeEventArgs = {
                name: resize,
                cancel: false,
                previousSize: this.availableSize,
                currentSize: new Size(0, 0),
                treemap: this
            };
            if (this.resizeTo) {
                clearTimeout(this.resizeTo);
            }
            if (!isNullOrUndefined(this.element) && this.element.classList.contains('e-treemap')) {
                this.resizeTo = setTimeout(
                    (): void => {
                        this.unWireEVents();
                        this.createSvg();
                        this.refreshing = true;
                        this.wireEVents();
                        args.currentSize = this.availableSize;
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        this.trigger(resize, args, (observedArgs: IResizeEventArgs) => {
                            this.render();
                            this.refreshing = false;
                        });
                    },
                    500);
            }
        }
    }

    /**
     * This method handles the click event on the treemap.
     *
     * @param {PointerEvent} e - Specifies the mouse click event in the treemap.
     * @returns {void}
     * @private
     */
    public clickOnTreeMap(e: PointerEvent): void {
        const targetEle: Element = <Element>e.target;
        const targetId: string = targetEle.id;
        let eventArgs: IItemClickEventArgs;
        let itemIndex: number;
        const labelText : string = (targetEle as HTMLElement).innerHTML;
        const clickArgs: IClickEventArgs = { cancel: false, name: click, treemap: this, mouseEvent: e };
        this.trigger(click, clickArgs);
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            itemIndex = parseFloat(targetId.split('_Item_Index_')[1]);
            eventArgs = {
                cancel: false, name: itemClick, treemap: this, item: this.layout.renderItems[itemIndex as number], mouseEvent: e,
                groupIndex: this.layout.renderItems[itemIndex as number]['groupIndex'], groupName: this.layout.renderItems[itemIndex as number]['name'],
                text: labelText, contentItemTemplate : labelText
            };
            this.trigger(itemClick, eventArgs, (observedArgs: IItemClickEventArgs) => {
                if (observedArgs.text !== labelText || observedArgs.contentItemTemplate !== labelText) {
                    if (isNullOrUndefined(this.leafItemSettings.labelTemplate)) {
                        observedArgs.text = textFormatter(observedArgs.text, observedArgs['item']['data'], observedArgs.treemap);
                        (targetEle as HTMLElement).textContent = observedArgs.text;
                    } else {
                        setItemTemplateContent(targetId, targetEle, observedArgs.contentItemTemplate);
                    }
                }
            });
        }
        const end: number = new Date().getMilliseconds();
        let doubleTapTimer1: number;
        if (!isNullOrUndefined(this.doubleClick)) {
            if (!isNullOrUndefined(doubleTapTimer1) && end - doubleTapTimer1 < 500) {
                this.doubleClickOnTreeMap(e);
            }
            doubleTapTimer1 = end;
        }

    }

    /**
     * This method handles the double click event in the treemap.
     *
     * @param {PointerEvent} e - Specifies the pointer event of mouse click.
     * @returns {void}
     */
    public doubleClickOnTreeMap(e: PointerEvent): void {
        const doubleClickArgs: IDoubleClickEventArgs = { cancel: false, name: doubleClick, treemap: this, mouseEvent: e };
        this.trigger(doubleClick, doubleClickArgs);
        //this.notify('dblclick', e);
    }

    /**
     * This method handles the right click event in the treemap.
     *
     * @param {PointerEvent} e - Specifies the pointer event of mouse click.
     * @returns {void}
     * @private
     */
    public rightClickOnTreeMap(e: PointerEvent): void {
        const rightClickArgs: IRightClickEventArgs = { cancel: false, name: rightClick, treemap: this, mouseEvent: e };
        this.trigger(rightClick, rightClickArgs);
    }


    /**
     * This method handles the mouse down event in the treemap.
     *
     * @param {PointerEvent} e - Specifies the pointer event of mouse click.
     * @returns {void}
     * @private
     */
    public mouseDownOnTreeMap(e: PointerEvent): void {
        if ((<Element>e.target).id.indexOf('_Item_Index') > -1) {
            this.mouseDown = true;
        }
        this.notify(Browser.touchStartEvent, e);
    }

    /**
     * This method handles the mouse move event in the treemap.
     *
     * @param {PointerEvent} e - Specifies the pointer event of mouse click.
     * @returns {void}
     * @private
     */
    public mouseMoveOnTreeMap(e: PointerEvent): void {
        const targetEle: Element = <Element>e.target;
        const targetId: string = targetEle.id;
        let eventArgs: IItemMoveEventArgs;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let item: any;
        const moveArgs: IMouseMoveEventArgs = { cancel: false, name: mouseMove, treemap: this, mouseEvent: e };
        this.trigger(mouseMove, moveArgs);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let childItems: any[];
        if (targetId.indexOf('_Item_Index') > -1) {
            item = this.layout.renderItems[parseFloat(targetId.split('_Item_Index_')[1])];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            childItems = findChildren(item)['values'] as any[];
            this.element.style.cursor = (!item['isLeafItem'] && childItems && childItems.length > 0 && this.enableDrillDown) ?
                'pointer' : 'auto';
            eventArgs = { cancel: false, name: itemMove, treemap: this, item: item, mouseEvent: e };
            this.trigger(itemMove, eventArgs);
        } else {
            this.element.style.cursor = 'default';
        }
        this.notify(Browser.touchMoveEvent, e);
    }

    /**
     * This method calculates the selected treemap levels.
     *
     * @param {string} labelText - Specifies the label text.
     * @param {any} item - Specifies the treemap item.
     * @returns {any} - Returns label of the drilled level.
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public calculateSelectedTextLevels(labelText: string, item: any): any {
        //to find the levels by clicking the particular text both for drillDownView as true / false.
        let drillLevel: number; let k: string; let text: string;
        const levelLabels: string = item['levelOrderName'];
        const levelText: string[] = levelLabels.split('#');
        for (k of Object.keys(levelText)) {
            if (levelText[k as string] === labelText) {
                drillLevel = parseInt(k, 10);
                text = labelText;
            }
        }
        return { drillLevel: drillLevel, currentLevelLabel: text, levelText: levelText };
    }

    /**
     * This method calculates the previous level of child items in treemap.
     *
     * @param {any} drillLevelValues - Specifies the values of drill level.
     * @param {any} item - Specifies the treemap item.
     * @param {boolean} directLevel - Specifies the current level.
     * @returns {boolean} - check whether it is previous level or not.
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public calculatePreviousLevelChildItems(drillLevelValues: any, item: any, directLevel: boolean): boolean {
        //By clicking any child items drilldown to the particular level.
        //At the time store all the previous drilled level items in drilledItems
        // This condition satisfies while drilldown View is set as false and the text contains '[+]'
        let text: string; let p: number = 0; let levelItems: string; let text1: string;
        const drillTextLevel: number = this.layout.renderItems[0]['levelOrderName'].split('#').length;
        for (let h: number = 0; h < drillTextLevel; h++) {
            text1 = h === 0 ? drillLevelValues['levelText'][h as number] : text1 + '#' + drillLevelValues['levelText'][h as number];
        }
        p = drillTextLevel > 1 ? drillTextLevel : p;
        for (levelItems of Object['values'](this.layout.renderItems)) {
            const drillLevelText: string = levelItems['levelOrderName'].split('#');
            if (drillLevelText[0] === drillLevelValues['levelText'][0]) {
                text = p === 0 ? isNullOrUndefined(text1 as string) ? text1 : drillLevelValues['levelText'][p as number] :
                    directLevel ? text1 : text1 + '#' + drillLevelValues['levelText'][p as number];
                if (text === levelItems['levelOrderName']) {
                    this.drilledItems.push({ name: levelItems['levelOrderName'], data: levelItems });
                    p++;
                    directLevel = true;
                    if (p <= item['groupIndex']) {
                        text = text + '#' + drillLevelValues['levelText'][p as number];
                        text1 = text;
                    }
                }
            }
        }
        return directLevel;
    }

    /**
     * This method compares the selected labels with the drill down items.
     *
     * @param {any} drillLevelValues - Specifies the values of drill level.
     * @param {any} item - Specifies the treemap item.
     * @param {number} i - Specifies the treemap item.
     * @returns {any} - return the new drill down object.
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public compareSelectedLabelWithDrillDownItems(drillLevelValues: any, item: any, i: number): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let drillLevelChild: any; const newDrillItem: any = {};
        const b: number = drillLevelValues['drillLevel'] + 1;
        if (b === this.drilledItems[i as number]['data']['groupIndex']) {
            drillLevelChild = this.drilledItems[i as number]['data']['parent'];
            drillLevelChild['isDrilled'] = true;
            newDrillItem[drillLevelChild[this.drilledItems[i as number]['data']['groupName']]]
                = [drillLevelChild];
            // to remove all the items after matched drilled items
            this.drilledItems.splice(i, this.drilledItems.length);
        } else if (drillLevelValues['drillLevel'] === (this.drilledItems.length - 1)
            || drillLevelValues['drillLevel'] === item['groupIndex']) {
            newDrillItem[item['groupName']] = [item];
        }
        return newDrillItem;
    }

    /**
     * This method handles mouse end event in treemap.
     *
     * @param {PointerEvent} e - Specifies the pointer event of mouse.
     * @returns {void}
     * @private
     */
    public mouseEndOnTreeMap(e: PointerEvent): void {
        const targetEle: Element = <Element>e.target; const targetId: string = targetEle.id; let totalRect: Rect;
        let startEvent: IDrillStartEventArgs; let endEvent: IDrillEndEventArgs; let directLevel: boolean = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let index: number; let newDrillItem: any = {}; let item: any; const process: boolean = true;
        const layoutID: string = this.element.id + '_TreeMap_' + this.layoutType + '_Layout'; let drillLevel: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const templateID: string = this.element.id + '_Label_Template_Group'; let drillLevelValues: any;
        if (targetId.indexOf('_Item_Index') > -1 && this.enableDrillDown && !this.drillMouseMove) {
            if (e.cancelable) {
                e.preventDefault();
            }
            index = parseFloat(targetId.split('_Item_Index_')[1]);
            item = this.layout.renderItems[index as number];
            const labelText: string = (targetEle as HTMLElement).textContent;
            if (this.enableBreadcrumb) {
                drillLevelValues = this.calculateSelectedTextLevels(labelText, item);
                drillLevel = drillLevelValues['drillLevel'];
                if (!this.drillDownView && labelText.search('[+]') !== -1) {
                    directLevel = this.calculatePreviousLevelChildItems(drillLevelValues, item, directLevel);
                }
            }
            if (this.levels.length !== 0 && !item['isLeafItem'] && findChildren(item)['values'] &&
                findChildren(item)['values'].length > 0) {
                if (this.drilledItems.length > 0) {
                    item = directLevel ? this.drilledItems[this.drilledItems.length - 1]['data'] : item;
                    for (let i: number = 0; i < this.drilledItems.length; i++) {
                        if (!isNullOrUndefined(drillLevel)) {  //Compare the selected text level with drilled items
                            const drillLength: number = this.drilledItems.length;
                            newDrillItem = this.compareSelectedLabelWithDrillDownItems(drillLevelValues, item, i);
                            if (drillLength !== this.drilledItems.length) {
                                i -= 1; break;
                            }
                        } //when clicking the levels drill back to the previous level process takes place
                        if (item['levelOrderName'] === this.drilledItems[i as number]['name'] && !directLevel && isNullOrUndefined(drillLevel)) {
                            if (item['groupIndex'] === 0 && item['parent'][item['groupName']] instanceof Array) {
                                item['isDrilled'] = !(item['isDrilled']);
                                if (!item['isDrilled']) {
                                    newDrillItem = item['parent'];
                                } else {
                                    newDrillItem[item['groupName']] = [item];
                                }
                            } else {
                                item['isDrilled'] = false; item['parent']['isDrilled'] = true; item = item['parent'];
                                newDrillItem[item['groupName']] = [item];
                            }
                            this.drilledItems.splice(i, 1);
                            i -= 1; break;
                        } else if (i === this.drilledItems.length - 1 && isNullOrUndefined(drillLevel)) {
                            item['isDrilled'] = true; // click the items move to next level.
                            newDrillItem[item['groupName']] = [item];
                        }
                    }
                } else {
                    item['isDrilled'] = true;
                    newDrillItem[item['groupName']] = [item];
                }
                startEvent = {
                    cancel: false, name: drillStart, treemap: this,
                    element: targetEle, groupIndex: this.enableBreadcrumb &&
                    this.drilledItems.length !== 0 && !isNullOrUndefined(drillLevel) ?
                        this.drilledItems[this.drilledItems.length - 1]['data']['groupIndex'] : item['groupIndex'],
                    groupName: this.enableBreadcrumb && this.drilledItems.length !== 0 && !isNullOrUndefined(drillLevel) ?
                        this.drilledItems[this.drilledItems.length - 1]['data']['name'] : item['name'],
                    rightClick: e.which === 3 ? true : false, childItems: null,  item: newDrillItem
                };
                this.trigger(drillStart, startEvent, (observedArgs: IDrillStartEventArgs) => {
                    this.currentLevel = item['isDrilled'] && isNullOrUndefined(drillLevel) ? item['groupIndex'] :
                        (!isNullOrUndefined(drillLevel) && this.enableBreadcrumb && item['isDrilled']) ? drillLevel : null;
                    if (!observedArgs.cancel) {
                        if (document.getElementById(layoutID)) {
                            const layerElementId: HTMLElement = document.getElementById(layoutID);
                            layerElementId.parentNode.removeChild(layerElementId);
                        }
                        totalRect = extend({}, this.areaRect, totalRect, true) as Rect;
                        if (this.legendSettings.visible && !isNullOrUndefined(this.treeMapLegendModule)) {
                            if (!isNullOrUndefined(newDrillItem)) {
                                this.treeMapLegendModule.legendGroup.textContent = ''; this.treeMapLegendModule.legendGroup = null;
                                this.treeMapLegendModule.widthIncrement = 0; this.treeMapLegendModule.heightIncrement = 0;
                                if (this.enableBreadcrumb && !isNullOrUndefined(drillLevel)) {
                                    this.drilledLegendItems = {
                                        name: this.drilledItems[this.drilledItems.length - 1]['data']['levelOrderName'],
                                        data: this.drilledItems[this.drilledItems.length - 1]['data']
                                    };
                                } else {
                                    this.drilledLegendItems = { name: item['levelOrderName'], data: item };
                                }
                                this.treeMapLegendModule.renderLegend();
                            }
                            totalRect = !isNullOrUndefined(this.totalRect) ? this.totalRect : totalRect;
                        }
                        if (document.getElementById(templateID)) {
                            const drillElementId: HTMLElement = document.getElementById(templateID);
                            drillElementId.parentNode.removeChild(drillElementId);
                        }
                        if (!isNullOrUndefined(observedArgs.childItems) && !observedArgs.cancel) {
                            this.layout.onDemandProcess(observedArgs.childItems);
                        } else {
                            this.layout.calculateLayoutItems(newDrillItem, totalRect);
                            this.layout.renderLayoutItems();
                        }
                    }
                });
                endEvent = { cancel: false, name: drillEnd, treemap: this, renderItems: this.layout.renderItems };
                this.trigger(drillEnd, endEvent);
                if (process) {
                    if (!directLevel && isNullOrUndefined(drillLevel)) {
                        this.drilledItems.push({ name: item['levelOrderName'], data: item });
                    }
                }
            }
        }
        this.mouseDown = false;
        this.notify(Browser.touchEndEvent, e);
    }

    /**
     * This method handles mouse leave event in treemap.
     *
     * @param {PointerEvent} e - Specifies the pointer event of mouse.
     * @return {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public mouseLeaveOnTreeMap(e: PointerEvent): void {
        if (this.treeMapTooltipModule) {
            this.treeMapTooltipModule.removeTooltip();
        }
        if (this.treeMapLegendModule) {
            this.treeMapLegendModule.removeInteractivePointer();
        }
        removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', this);
        if (this.treeMapHighlightModule) {
            removeShape(this.treeMapHighlightModule.shapeHighlightCollection);
            this.treeMapHighlightModule.highLightId = '';
        }
    }

    /**
     * This method is used to select or remove the selection of treemap item based on the provided selection settings.
     *
     * @param {string[]} levelOrder - Specifies the order of the level.
     * @param {boolean} isSelected - Specifies whether the treemap item should be selected or the selection should be removed.
     * @return {void}
     */
    public selectItem(levelOrder: string[], isSelected ?: boolean): void {
        if (isNullOrUndefined(isSelected)) {
            isSelected = true;
        }
        let levelOrderName: string = '';
        for (let i: number = 0; i < levelOrder.length; i++) {
            if (i !== levelOrder.length - 1) {
                levelOrderName += levelOrder[i as number] + '#';
            } else {
                levelOrderName += levelOrder[i as number];
            }
        }
        if (this.treeMapSelectionModule && this.selectionSettings.enable) {
            this.treeMapSelectionModule.selectTreemapItem(levelOrderName, isSelected);
        }
    }


    /**
     * To provide the array of modules needed for maps rendering
     *
     * @returns {ModuleDeclaration[]} Returns the modules
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.tooltipSettings.visible) {
            modules.push({
                member: 'treeMapTooltip',
                args: [this],
                name: 'TreeMapTooltip'
            });
        }
        if (this.highlightSettings.enable) {
            modules.push({
                member: 'treeMapHighlight',
                args: [this],
                name: 'TreeMapHighlight'
            });
        }
        if (this.selectionSettings.enable) {
            modules.push({
                member: 'treeMapSelection',
                args: [this],
                name: 'TreeMapSelection'
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'treeMapLegend',
                args: [this],
                name: 'TreeMapLegend'
            });
        }
        if (this.allowPrint) {
            modules.push({
                member: 'Print',
                args: [this, Print],
                name: 'Print'
            });
        }
        if (this.allowImageExport) {
            modules.push({
                member: 'ImageExport',
                args: [this, ImageExport],
                name: 'ImageExport'
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this, PdfExport],
                name: 'PdfExport'
            });
        }
        return modules;
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {TreeMapModel} newProp - Specifies the new property
     * @param {TreeMapModel} oldProp - Specifies the old property
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: TreeMapModel, oldProp: TreeMapModel): void {
        if (!this.isDestroyed) {
            let render: boolean = false;
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                case 'layoutType':
                case 'levels':
                case 'drillDownView':
                case 'renderDirection':
                case 'leafItemSettings':
                case 'legendSettings':
                case 'dataSource':
                    render = true;
                    break;
                }
            }
            if (render) {
                this.createSvg();
                this.renderElements();
            }
        }
    }

    /**
     * Gets component name.
     *
     * @returns {string} - return the treemap instance.
     * @private
     */
    public getModuleName(): string {
        return 'treemap';
    }

    /**
     * This method destroys the treemap. This method removes the events associated with the treemap and disposes the objects created for rendering and updating the treemap.
     */
    public destroy(): void {
        this.unWireEVents();
        removeElement('treeMapMeasureText');
        this.drilledItems = [];
        this.levelSelection = [];
        this.legendId = [];
        this.removeSvg();
        super.destroy();
    }

    private removeSvg(): void {
        removeElement(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Returns the string value.
     * @private
     */
    public getPersistData(): string {
        return '';
    }
}

/**
 * @private
 */
export class LevelsData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    levelsData : any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultLevelsData : any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hierarchyData : any[];
}
