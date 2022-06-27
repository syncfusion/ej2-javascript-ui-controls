/**
 * Heat Map Component
 */

import { Component, Property, NotifyPropertyChanges, Internationalization, Complex, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ModuleDeclaration, EmitType, remove, Event, EventHandler, Touch } from '@syncfusion/ej2-base';
// eslint-disable-next-line
import { INotifyPropertyChanged, setCulture, Browser } from '@syncfusion/ej2-base';
import { SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Size, stringToNumber, RectOption, Rect, TextBasic, measureText, CurrentRect, LegendRange, ToggleVisibility } from './utils/helper';
import { DrawSvgCanvas, TextOption, titlePositionX, getTitle, showTooltip, getElement, SelectedCellDetails } from './utils/helper';
import { removeElement, CanvasTooltip, getTooltipText } from './utils/helper';
import { HeatMapModel } from './heatmap-model';
import { FontModel, MarginModel, TitleModel } from './model/base-model';
import { Margin, Title, ColorCollection, LegendColorCollection } from './model/base';
import { Theme, getThemeColor } from './model/theme';
import { IThemeStyle, ILoadedEventArgs, ICellClickEventArgs, ITooltipEventArgs, IResizeEventArgs } from './model/interface';
import { ICellEventArgs, ISelectedEventArgs } from './model/interface';
import { DrawType, HeatMapTheme, ColorGradientMode } from './utils/enum';
import { Axis } from './axis/axis';
import { AxisModel } from './axis/axis-model';
import { AxisHelper } from './axis/axis-helpers';
import { Series, CellSettings } from './series/series';
import { CellSettingsModel } from './series/series-model';
import { PaletteSettingsModel } from './utils/colorMapping-model';
import { PaletteSettings, CellColor } from './utils/colorMapping';
import { TooltipSettings } from './utils/tooltip';
import { TooltipSettingsModel } from './utils/tooltip-model';
import { TwoDimensional } from './datasource/twodimensional';
import { Tooltip } from './utils/tooltip';
import { LegendSettingsModel } from '../heatmap/legend/legend-model';
import { LegendSettings, Legend } from '../heatmap/legend/legend';
import { Adaptor, Data } from './datasource/adaptor';
import { DataModel } from './datasource/adaptor-model';
import { ILegendRenderEventArgs } from './model/interface';
import { ExportUtils } from '../heatmap/utils/export';
import { ExportType } from '../heatmap/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';

@NotifyPropertyChanges
export class HeatMap extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * The width of the heatmap as a string accepts input as both like '100px' or '100%'.
     *
     * If specified as '100%, heatmap renders to the full width of its parent element.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the heatmap accepts pixel values given in string format.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Enable or disable the tool tip for heatmap
     *
     * @default true
     */

    @Property(true)
    public showTooltip: boolean;

    /**
     * Triggers when click the heat map cell.
     *
     * {% codeBlock src='heatmap/tooltipRender/index.md' %}{% endcodeBlock %}
     *
     * @event 'object'
     */
    @Event()
    public tooltipRender: EmitType<ITooltipEventArgs>;

    /**
     * Triggers after resizing of Heatmap.
     *
     * @event 'object'
     */
    @Event()
    public resized: EmitType<IResizeEventArgs>;

    /**
     * Triggers after heatmap is loaded.
     *
     * @event 'object'
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before each heatmap cell renders.
     * {% codeBlock src='heatmap/cellRender/index.md' %}{% endcodeBlock %}
     *
     * @deprecated
     * @event 'object'
     */
    @Event()
    public cellRender: EmitType<ICellEventArgs>;

    /**
     * Triggers when multiple cells gets selected.
     *
     * @event 'object'
     */
    @Event()
    public cellSelected: EmitType<ISelectedEventArgs>;

    /**
     * Specifies the rendering mode of heat map.
     * * SVG - Heat map is render using SVG draw mode.
     * * Canvas - Heat map is render using Canvas draw mode.
     * * Auto - Automatically switch the draw mode based on number of records in data source.
     *
     * @default SVG
     */
    @Property('SVG')
    public renderingMode: DrawType;

    /**
     * Specifies the datasource for the heat map.
     *
     * @isDataManager false
     * @default null
     */

    @Property(null)
    public dataSource: Object ;

    /**
     * Specifies the datasource settings for heat map.
     * {% codeBlock src='heatmap/dataSourceSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<DataModel>({}, Data)
    public dataSourceSettings : DataModel;

    /**
     *  Specifies the theme for heatmap.
     *
     * @default 'Material'
     */
    @Property('Material')
    public theme: HeatMapTheme;

    /**
     * Enable or disable the selection of multiple cells in heatmap
     * {% codeBlock src='heatmap/allowSelection/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */

    @Property(false)
    public allowSelection: boolean;

    /**
     * Options to customize left, right, top and bottom margins of the heat map.
     */

    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Title of heat map
     * {% codeBlock src='heatmap/titleSettings/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Complex<TitleModel>({ text: '', textStyle: Theme.heatMapTitleFont }, Title)
    public titleSettings: TitleModel;

    /**
     * Options to configure the horizontal axis.
     */

    @Complex<AxisModel>({}, Axis)
    public xAxis: AxisModel;

    /**
     * Options for customizing the legend of the heat map
     * {% codeBlock src='heatmap/legendSettings/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Complex<LegendSettingsModel>({ position: 'Right'}, LegendSettings)
    public legendSettings: LegendSettingsModel;

    /**
     * Options for customizing the cell color of the heat map
     * {% codeBlock src='heatmap/paletteSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<PaletteSettingsModel>({}, PaletteSettings)
    public paletteSettings: PaletteSettingsModel;

    /**
     * Options for customizing the ToolTipSettings property  of the heat map
     * {% codeBlock src='heatmap/tooltipSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;

    /**
     * Options to configure the vertical axis.
     */

    @Complex<AxisModel>({}, Axis)
    public yAxis: AxisModel;

    /**
     * Options to customize the heat map cell
     * {% codeBlock src='heatmap/cellSettings/index.md' %}{% endcodeBlock %}
     */

    @Complex<CellSettingsModel>({}, CellSettings)
    public cellSettings: CellSettingsModel;

    /**
     * Triggers after heat map rendered.
     *
     * @event 'object'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers before heat map load.
     * {% codeBlock src='heatmap/load/index.md' %}{% endcodeBlock %}
     *
     * @event 'object'
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * Triggers when click the heat map cell.
     *
     * @event 'object'
     */
    @Event()
    public cellClick: EmitType<ICellClickEventArgs>;

    /**
     * Triggers before the legend is rendered.
     * {% codeBlock src='heatmap/legendRender/index.md' %}{% endcodeBlock %}
     *
     * @deprecated
     * @event 'object'
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /** @private */
    public enableCanvasRendering: boolean = false;
    /** @private */
    public colorGradientMode: ColorGradientMode;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public canvasRenderer: CanvasRenderer;
    /** @private */
    public secondaryCanvasRenderer: CanvasRenderer;
    /** @private */
    public svgObject: Element;
    /** @private */
    public availableSize: Size;
    /** @private */
    private elementSize: Size;
    /** @private */
    public themeStyle: IThemeStyle;
    /** @private */
    public isColorRange: boolean = false;
    /** @private */
    public initialClipRect: Rect;

    // /** @private */
    public heatMapAxis: AxisHelper;

    // /** @private */
    public heatMapSeries: Series;
    // /** @private */
    private drawSvgCanvas: DrawSvgCanvas;
    // /** @private */
    private twoDimensional: TwoDimensional;
    // /** @private */
    private cellColor: CellColor;
    /** @private */
    public colorCollection: ColorCollection[];
    /** @private */
    public legendColorCollection: LegendColorCollection[];
    /** @private */
    public tempRectHoverClass: string;
    /** @private */
    public legendVisibilityByCellType: boolean;
    /** @private */
    public bubbleSizeWithColor: boolean;
    /** @private */
    public tempTooltipRectId: string;
    /** @private */
    // eslint-disable-next-line
    public clonedDataSource: any[];
    /** @private */
    public completeAdaptDataSource: Object;
    /** @private */
    public xLength: number;
    /** @private */
    public yLength: number;
    /** @private */
    public isCellTapHold: boolean = false;
    /** @private */
    public selectedCellCount: number = 0;
    /** @private */
    public currentRect : CurrentRect;
    /** @private */
    public dataSourceMinValue: number;
    /** @private */
    public dataMin: number [];
    /** @private */
    public dataMax: number [];
    /** @private */
    public dataSourceMaxValue: number;
    /** @private */
    public minColorValue: number;
    /** @private */
    public maxColorValue: number;
    /** @private */
    public isColorValueExist: boolean;
    /** @private */
    public tooltipTimer: number;
    /** @private */
    public gradientTimer: number;
    /** @private */
    public legendTooltipTimer: number;
    /** @private */
    public resizeTimer: number;
    /** @private */
    public emptyPointColor: string;
    /** @private */
    public rangeSelection: boolean;
    /** @private */
    public toggleValue: ToggleVisibility[] = [];
    /** @private */
    public legendOnLoad: boolean = true;
    /** @private */
    public resizing: boolean = false;
    /** @private */
    public rendering: boolean = true;
    /** @private */

    public horizontalGradient: boolean;
    /** @private */
    public multiSelection: boolean = false;
    /** @private */
    public rectSelected: boolean = false;
    /** @private */
    public previousRect: CurrentRect;
    /** @private */
    public selectedCellsRect: Rect;
    /** @private */
    public previousSelectedCellsRect: Rect[] = [];
    /** @private */
    public canvasSelectedCells: Rect;
    /** @private */
    public multiCellCollection: SelectedCellDetails[] = [];
    /** @private */
    public selectedMultiCellCollection: SelectedCellDetails[] = [];
    /** @private */
    public tempMultiCellCollection: SelectedCellDetails[][] = [];
    /** @private */
    public titleRect: Rect;
    /** @private */
    public initialCellX: number;
    /** @private */
    public initialCellY: number;
    /**
     * @private
     */
    public tooltipCollection: CanvasTooltip[] = [];
    /**
     * @private
     */
    public isTouch: boolean;
    /**
     * @private
     */
    public isRectBoundary: boolean;
    /**
     * @private
     */

    private border: Object;

    /**
     * Gets the axis of the HeatMap.
     *
     * @hidden
     */
    public axisCollections: Axis[];

    /**
     * @private
     */
    public intl: Internationalization;
    /**
     * @private
     */
    public isCellData: boolean = false;
    private titleCollection: string[];
    /**
     * @private
     */
    public mouseX: number;
    /**
     * @private
     */
    public mouseY: number;

    /**
     * The `legendModule` is used to display the legend.
     *
     * @private
     */
    public legendModule: Legend;

    /**
     * The `tooltipModule` is used to manipulate Tooltip item from base of heatmap.
     *
     * @private
     */
    public tooltipModule: Tooltip;

    /**
     * The `adaptorModule` is used to manipulate Adaptor item from base of heatmap.
     *
     * @private
     */
    public adaptorModule: Adaptor;

    protected preRender(): void {
        this.initPrivateVariable();
        this.unWireEvents();
        this.wireEvents();
    }

    /**
     * Handles the export method for heatmap control.
     *
     * @param type
     * @param fileName
     * @param orientation
     */

    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation): void {
        const exportMap: ExportUtils = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    }

    private initPrivateVariable(): void {
        this.renderer = new SvgRenderer(this.element.id);
        this.canvasRenderer = new CanvasRenderer(this.element.id);
        this.secondaryCanvasRenderer = new CanvasRenderer(this.element.id + '_secondary');
        this.heatMapAxis = new AxisHelper(this);
        this.heatMapSeries = new Series(this);
        this.drawSvgCanvas = new DrawSvgCanvas(this);
        this.twoDimensional = new TwoDimensional(this);
        this.cellColor = new CellColor(this);
        this.tempRectHoverClass = '';
        this.tempTooltipRectId = '';
        this.setCulture();
    }

    /**
     * Method to set culture for heatmap
     */

    private setCulture(): void {
        this.intl = new Internationalization();
    }
    protected render(): void {
        this.horizontalGradient = this.legendSettings.position === 'Bottom' || this.legendSettings.position === 'Top';
        this.updateBubbleHelperProperty();
        this.trigger('load', { heatmap: this });
        if (this.theme === 'TailwindDark' || this.theme === 'Tailwind') {
            const textSettings: LegendSettingsModel =  { title : { textStyle : { size : '12px', fontFamily : 'Inter', fontWeight : '500' }}, textStyle : { size : '12px', fontFamily : 'Inter' }};
            this.setProperties({ titleSettings : { textStyle : { size : '14px', fontFamily : 'Inter' }}}, true);
            this.setProperties({ legendSettings : textSettings }, true);
            this.setProperties({ xAxis : textSettings }, true);
            this.setProperties({ yAxis : textSettings }, true);
            this.setProperties({ cellSettings : { textStyle : { fontFamily : 'Inter' }}}, true);
        }
        if (this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark') {
            const textSettings: LegendSettingsModel =  { title : { textStyle : { size : '12px', fontFamily : 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontWeight : '500' }}, textStyle : { size : '12px', fontFamily : 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }};
            this.setProperties({ titleSettings : { textStyle : { size : '16px', fontFamily : 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}}, true);
            this.setProperties({ legendSettings : textSettings }, true);
            this.setProperties({ xAxis : textSettings }, true);
            this.setProperties({ yAxis : textSettings }, true);
            this.setProperties({ cellSettings : { textStyle : { fontFamily : 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}}, true);
        }
        if (this.theme === 'Fluent' || this.theme === 'FluentDark') {
            const textSettings: LegendSettingsModel =  { title : { textStyle : { size : '12px', fontFamily : '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif', fontWeight : '500' }}, textStyle : { size : '12px', fontFamily : 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }};
            this.setProperties({ titleSettings : { textStyle : { size : '16px', fontFamily : '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif' }}}, true);
            this.setProperties({ legendSettings : textSettings }, true);
            this.setProperties({ xAxis : textSettings }, true);
            this.setProperties({ yAxis : textSettings }, true);
            this.setProperties({ cellSettings : { textStyle : { fontFamily : '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif' }}}, true);
        }
        this.initAxis();
        this.processInitData();
        this.setTheme();
        this.calculateMaxLength();
        this.heatMapAxis.calculateVisibleLabels();
        this.twoDimensional.processDataSource(this.completeAdaptDataSource);
        this.createSvg();
        this.cellColor.getColorCollection();
        this.calculateBounds();
        this.renderElements();
        this.appendSvgObject();
        if (this.tooltipModule) {
            this.tooltipModule.showHideTooltip(false);
        }
        this.renderComplete();
    }

    /**
     * To re-calculate the datasource while changing datasource property dynamically.
     *
     * @private
     */

    private reRenderDatasource(): void {
        this.dataSourceMinValue = null;
        this.dataSourceMaxValue = null;
        this.processInitData();
        this.calculateMaxLength();
        this.heatMapAxis.calculateVisibleLabels();
        this.twoDimensional.processDataSource(this.completeAdaptDataSource);
        this.cellColor.getColorCollection();
        this.calculateBounds();
    }

    /**
     * To process datasource property.
     *
     * @private
     */

    private processInitData(): void {
        if (this.adaptorModule) {
            this.adaptorModule.constructDatasource(this.dataSource, this.dataSourceSettings);
        } else {
            this.completeAdaptDataSource = this.dataSource;
        }
    }

    /**
     * To set render mode of heatmap as SVG or Canvas.
     *
     * @private
     */

    private setRenderMode(): void {
        if (this.renderingMode === 'Canvas') {
            this.enableCanvasRendering = true;
        } else if (this.renderingMode === 'Auto' &&
            (this.axisCollections[0].axisLabelSize * this.axisCollections[1].axisLabelSize) >= 10000) {
            this.enableCanvasRendering = true;
        } else {
            this.enableCanvasRendering = false;
        }
    }

    /**
     * To set bubble helper private property.
     *
     * @private
     */

    private updateBubbleHelperProperty(): void {
        if (this.cellSettings.tileType === 'Bubble' &&
            (this.cellSettings.bubbleType === 'Size' || this.cellSettings.bubbleType === 'Sector')) {
            this.legendVisibilityByCellType = false;
        } else if (this.legendModule && this.legendSettings.visible) {
            this.legendVisibilityByCellType = true;
        }
        if (this.cellSettings.tileType === 'Bubble' && this.cellSettings.bubbleType === 'SizeAndColor') {
            this.bubbleSizeWithColor = true;
        } else {
            this.bubbleSizeWithColor = false;
        }
    }

    private renderElements(): void {
        this.tooltipCollection = [];
        this.renderSecondaryElement();
        this.renderBorder();
        this.renderTitle();
        this.heatMapAxis.renderAxes();
        if (this.tooltipModule && this.showTooltip) {
            this.tooltipModule.tooltipObject = null;
            this.tooltipModule.createTooltipDiv(this);
        }
        this.heatMapSeries.renderRectSeries();
        if (this.legendModule && this.legendSettings.visible
            && this.legendVisibilityByCellType) {
            this.legendModule.renderLegendItems();
            if (this.paletteSettings.type === 'Fixed' && this.legendSettings.enableSmartLegend &&
                this.legendSettings.labelDisplayType === 'None') {
                this.legendModule.createTooltipDiv();
            }
        }
    }

    /**
     * Get component name
     */

    public getModuleName(): string {
        return 'heatmap';
    }
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     */

    public getPersistData(): string {
        return '';
    }

    /**
     * @private
     */

    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: HeatMapModel, oldProp: HeatMapModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        let isUpdateSelection: boolean = true;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'renderingMode':
                this.rendering = false;
                isUpdateSelection = false; renderer = true;
                break;
            case 'cellSettings':
                this.updateBubbleHelperProperty();
                if (this.legendModule && ((newProp.cellSettings.tileType !== (oldProp.cellSettings
                        !== undefined && oldProp.cellSettings.tileType))
                        || (newProp.cellSettings.bubbleType !== oldProp.cellSettings.bubbleType))) {
                    this.legendOnLoad = true;
                    this.legendModule.updateLegendRangeCollections();
                }
                if (this.cellSettings.tileType === 'Bubble') {
                    isUpdateSelection = false;
                }
                this.reRenderDatasource();
                refreshBounds = true;
                break;
            case 'showTooltip':
                refreshBounds = true;
                break;
            case 'dataSource':
            case 'dataSourceSettings':
                this.isCellData = false;
                this.paletteCellSelectionUpdation();
                this.reRenderDatasource();
                isUpdateSelection = false; renderer = true;
                break;
            case 'titleSettings':
            case 'width':
            case 'height':
            case 'margin':
                refreshBounds = true;
                break;
            case 'legendSettings':
                this.updateBubbleHelperProperty();
                if (this.legendVisibilityByCellType && (((newProp.legendSettings.visible !==
                        (oldProp.legendSettings !== undefined && oldProp.legendSettings.visible)) ||
                        (newProp.legendSettings.enableSmartLegend !== oldProp.legendSettings.enableSmartLegend)))) {
                    this.legendOnLoad = true;
                    this.legendModule.updateLegendRangeCollections();
                } else {
                    this.legendOnLoad = false;
                }
                refreshBounds = true;
                break;
            case 'yAxis':
            case 'xAxis':
                this.paletteCellSelectionUpdation();
                this.reRenderDatasource();
                isUpdateSelection = false;
                refreshBounds = true;
                break;
            case 'paletteSettings':
                this.paletteCellSelectionUpdation();
                this.twoDimensional.processDataSource(this.completeAdaptDataSource);
                this.cellColor.getColorCollection();
                this.calculateBounds();
                renderer = true;
                break;
            case 'theme':
                this.setTheme();
                renderer = true;
                break;
            case 'tooltipSettings':
                if (this.tooltipModule) {
                    this.tooltipModule.tooltipObject.fill = this.tooltipSettings.fill;
                    this.tooltipModule.tooltipObject.border = this.tooltipSettings.border;
                    this.tooltipModule.tooltipObject.textStyle = this.tooltipSettings.textStyle;
                    this.tooltipModule.tooltipObject.template = this.tooltipSettings.template;
                    this.tooltipModule.tooltipObject.refresh();
                }
                break;
            }
        }
        if (!refreshBounds && renderer) {
            this.createSvg();
            this.renderElements();
            this.appendSvgObject();
            this.trigger('created');
            if (!isUpdateSelection) {
                this.clearSelection();
            }
        } else if (refreshBounds) {
            this.createSvg();
            this.refreshBound();
            this.appendSvgObject();
            this.trigger('created');
        }
        if (this.allowSelection && this.rectSelected) {
            if (isUpdateSelection) {
                this.updateCellSelection();
            } else {
                this.clearSelection();
            }
        }
        this.rendering = true;
    }
    private paletteCellSelectionUpdation(): void {
        this.updateBubbleHelperProperty();
        if (this.legendVisibilityByCellType) {
            this.legendOnLoad = true;
            this.legendModule.updateLegendRangeCollections();
        }
    }
    /**
     * create svg or canvas element
     *
     * @private
     */

    public createSvg(): void {
        this.removeSvg();
        this.setRenderMode();
        this.calculateSize();
        if (!this.enableCanvasRendering) {
            this.svgObject = this.renderer.createSvg({
                id: this.element.id + '_svg',
                width: this.availableSize.width,
                height: this.availableSize.height
            });
            if (this.cellSettings.border.width.toString() === '0' && this.cellSettings.tileType === 'Rect') {
                this.svgObject.setAttribute('shape-rendering', 'crispEdges');
            }
        } else {
            this.svgObject = this.canvasRenderer.createCanvas({
                id: this.element.id + '_canvas',
                width: this.availableSize.width,
                height: this.availableSize.height
            });
            if (this.allowSelection) {
                this.createMultiCellDiv(true);
            }
        }
    }

    /**
     *  To Remove the SVG.
     *
     * @private
     */

    public removeSvg(): void {
        if (document.getElementById(this.element.id + '_Secondary_Element')) {
            remove(document.getElementById(this.element.id + '_Secondary_Element'));
        }
        if (document.getElementById(this.element.id + 'Celltooltipcontainer')) {
            remove(document.getElementById(this.element.id + 'Celltooltipcontainer'));
        }
        if (document.getElementById(this.element.id + 'legendLabelTooltipContainer')) {
            remove(document.getElementById(this.element.id + 'legendLabelTooltipContainer'));
        }
        if (document.getElementById(this.element.id + '_Multi_CellSelection_Canvas')) {
            remove(document.getElementById(this.element.id + '_Multi_CellSelection_Canvas'));
        }
        if (document.getElementById(this.element.id + '_CellSelection_Container')) {
            remove(document.getElementById(this.element.id + '_CellSelection_Container'));
        }
        if (this.svgObject) {
            const svgElement: Element = document.getElementById(this.svgObject.id);
            if (svgElement) {
                while (this.svgObject.childNodes.length) {
                    this.svgObject.removeChild(this.svgObject.firstChild);
                }
                remove(this.svgObject);
            }
        }
    }

    private renderSecondaryElement(): void {
        const tooltipDiv: Element = this.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        this.element.appendChild(tooltipDiv);

        const divElement: Element = this.createElement('div', {
            id: this.element.id + '_CellSelection_Container',
            styles: 'position:absolute; z-index: 2 ; top:' + this.initialClipRect.y + 'px' + '; left:' + this.initialClipRect.x + 'px'
        });
        this.element.appendChild(divElement);
    }

    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]}
     * @private
     */

    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.showTooltip) {
            modules.push({
                member: 'Tooltip',
                args: [this]
            });
        }
        if (this.legendSettings) {
            modules.push({
                member: 'Legend',
                args: [this]
            });
        }
        if (this.dataSource) {
            modules.push({
                member: 'Adaptor',
                args: [this]
            });
        }
        return modules;
    }

    /**
     * To destroy the widget
     * {% codeBlock src='heatmap/destroy/index.md' %}{% endcodeBlock %}
     *
     * @function destroy
     * @returns {void}.
     * @member of Heatmap
     */

    public destroy(): void {
        this.unWireEvents();
        super.destroy();
        this.element.innerHTML = '';
        this.element.classList.remove('e-heatmap');
    }

    /**
     * Applies all the pending property changes and render the component again.
     *
     * @function destroy
     * @returns {void}.
     */
    public refresh(): void {
        super.refresh();
        this.element.classList.add('e-heatmap');
    }

    /**
     * Appending svg object to the element
     *
     * @private
     */

    private appendSvgObject(): void {
        if (this.enableCanvasRendering && this.allowSelection) {
            this.createMultiCellDiv(false);
        } else {
            this.element.appendChild(this.svgObject);
        }
    }

    private renderBorder(): void {
        this.border = {
            width: 0
        };
        const width: number = 0;
        const rect: RectOption = new RectOption(
            this.element.id + '_HeatmapBorder', this.themeStyle.background, this.border, 1,
            new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
        this.drawSvgCanvas.drawRectangle(rect, this.svgObject);
    }
    private calculateSize(): void {
        const width: number = stringToNumber(this.width, this.element.offsetWidth) || this.element.offsetWidth || 600;
        const height: number = stringToNumber(this.height, this.element.offsetHeight) || this.element.offsetHeight || 450;
        this.availableSize = new Size(width, height);
        let alignElement: HTMLElement = this.element;
        while (alignElement.parentNode) {
            if (alignElement.tagName === 'BODY') {
                break;
            }
            const align: string = (alignElement as HTMLInputElement).align;
            if (align === 'center') {
                const containerWidth: string = this.availableSize.width.toString();
                this.element.style.width = containerWidth + 'px';
                this.element.style.margin = '0 auto';
                break;
            }
            alignElement = alignElement.parentElement;
        }
    }

    private renderTitle(): void {
        if (this.titleSettings.text) {
            const titleStyle: FontModel = this.titleSettings.textStyle;
            const anchor: string = titleStyle.textAlignment === 'Near' ? 'start' :
                titleStyle.textAlignment === 'Far' ? 'end' : 'middle';
            this.elementSize = measureText(this.titleCollection[0], titleStyle);
            const options: TextOption = new TextOption(
                this.element.id + '_HeatmapTitle',
                new TextBasic(
                    titlePositionX(
                        this.availableSize.width - this.margin.left - this.margin.right,
                        this.margin.left,
                        this.margin.right,
                        titleStyle),
                    this.margin.top + ((this.elementSize.height) * 3 / 4), anchor, this.titleCollection),
                titleStyle, titleStyle.color || this.themeStyle.heatMapTitle);
            if (this.titleCollection.length > 1) {
                this.drawSvgCanvas.createWrapText(options, titleStyle, this.svgObject);
            } else {
                this.drawSvgCanvas.createText(options, this.svgObject, this.titleCollection[0]);
                if (this.titleCollection[0].indexOf('...') !== -1 && this.enableCanvasRendering) {
                    this.tooltipCollection.push(new CanvasTooltip(
                        this.titleSettings.text,
                        new Rect(this.margin.left, this.margin.top, this.elementSize.width, this.elementSize.height))
                    );
                }
            }
        }
    }

    private titleTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        if ((targetId === (this.element.id + '_HeatmapTitle')) && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            showTooltip(
                this.titleSettings.text, x, y, this.element.offsetWidth, this.element.id + '_Title_Tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch, this
            );
        } else {
            removeElement(this.element.id + '_Title_Tooltip');
        }
    }
    // eslint-disable-next-line
    private axisTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        const targetId: string = (<HTMLElement>event.target).id;
        if ((targetId.indexOf(this.element.id + '_XAxis_Label') !== -1) ||
            (targetId.indexOf(this.element.id + '_YAxis_Label') !== -1) ||
            (targetId.indexOf(this.element.id + '_XAxis_MultiLevel') !== -1) ||
            (targetId.indexOf(this.element.id + '_YAxis_MultiLevel') !== -1)) {
            const tooltipText: string = getTooltipText(this.tooltipCollection, x, y);
            if (tooltipText) {
                showTooltip(
                    tooltipText, x, y, this.element.offsetWidth, this.element.id + '_axis_Tooltip',
                    getElement(this.element.id + '_Secondary_Element'), this.isTouch, this
                );
            } else {
                removeElement(this.element.id + '_axis_Tooltip');
            }
        } else {
            removeElement(this.element.id + '_axis_Tooltip');
        }
    }

    private isHeatmapRect(x: number, y: number): boolean {
        const firstRectDetails: CurrentRect[] = [];
        const lastRectDetails: CurrentRect[] = [];
        let isRect: boolean;
        const borderBoundary: number = 5;
        firstRectDetails.push(this.heatMapSeries.rectPositionCollection[0][0]);
        lastRectDetails.push(this.heatMapSeries.rectPositionCollection[this.yLength - 1][this.xLength - 1]);

        if (this.cellSettings.border.width > borderBoundary && (x >= firstRectDetails[0].x && y >= firstRectDetails[0].y &&
            x <= (lastRectDetails[0].x + lastRectDetails[0].width) &&
           y <= (lastRectDetails[0].y + lastRectDetails[0].height)) && this.cellSettings.tileType === 'Rect') {
            const currentRect: CurrentRect = this.heatMapSeries.getCurrentRect(x, y);
            const rectHeight: number =  lastRectDetails[0].height;
            const rectWidth: number =  lastRectDetails[0].width;
            const cellBorder: number = this.cellSettings.border.width / 2;
            if ((x >= (currentRect.x + cellBorder) && ( y >= (currentRect.y + cellBorder)) &&
            (x <= (currentRect.x + (rectWidth - cellBorder)) &&
            (y <= (currentRect.y + (rectHeight - cellBorder)))))) {
                isRect = true;
                this.isRectBoundary = true;
            } else {
                isRect = false;
                this.isRectBoundary = false;
            }
        } else {
            isRect = (x >= firstRectDetails[0].x && y >= firstRectDetails[0].y &&
                x <= (lastRectDetails[0].x + lastRectDetails[0].width) &&
                y <= (lastRectDetails[0].y + lastRectDetails[0].height));
            this.isRectBoundary = isRect;
        }

        return isRect;
    }
    private setTheme(): void {
        /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
    }

    private calculateBounds(): void {
        const margin: MarginModel = this.margin;
        // Title Height;
        let titleHeight: number = 0;
        const padding: number = (this.legendModule && this.legendSettings.position === 'Top'
            && this.legendVisibilityByCellType) || this.titleSettings.textStyle.size === '0px' ? 0 : 16; // title padding
        const left: number = margin.left;
        const width: number = this.availableSize.width - left - margin.right;
        if ((this.paletteSettings.colorGradientMode === 'Column' || this.paletteSettings.colorGradientMode === 'Row') &&
            this.paletteSettings.type === 'Gradient') {
            if (this.paletteSettings.palette.length === 0) {
                this.legendVisibilityByCellType = false;
            } else {
                for (let i: number = 0; i < this.paletteSettings.palette.length; i++) {
                    if (this.paletteSettings.palette[i].value !== null || '') {
                        this.legendVisibilityByCellType = true;
                    } else if (this.paletteSettings.palette[i].value === null || '') {
                        this.legendVisibilityByCellType = false;
                        break;
                    }
                }
            }
        }
        if (this.titleSettings.text) {
            this.titleCollection = getTitle(this.titleSettings.text, this.titleSettings.textStyle, width);
            titleHeight = (measureText(this.titleSettings.text, this.titleSettings.textStyle).height * this.titleCollection.length) +
                padding;
        }
        const top: number = margin.top + titleHeight;
        this.titleRect = new Rect(margin.left, margin.top, this.availableSize.width - margin.left - margin.right, titleHeight);
        const height: number = this.availableSize.height - top - margin.bottom;
        this.initialClipRect = new Rect(left, top, width, height);
        const legendTop: number = this.initialClipRect.y;
        if (this.legendModule && this.legendSettings.visible && this.legendVisibilityByCellType) {
            this.legendModule.calculateLegendBounds(this.initialClipRect);
        }
        this.heatMapAxis.measureAxis(this.initialClipRect);
        if (this.legendModule && this.legendSettings.visible && this.legendVisibilityByCellType) {
            this.legendModule.calculateLegendSize(this.initialClipRect, legendTop);
        }
        this.heatMapAxis.calculateAxisSize(this.initialClipRect);
    }

    public refreshBound(): void {
        this.updateBubbleHelperProperty();
        this.calculateBounds();
        this.renderElements();
    }
    private initAxis(): void {
        let axis: Axis;
        const axes: AxisModel[] = [this.xAxis, this.yAxis];
        this.axisCollections = [];
        for (let i: number = 0, len: number = axes.length; i < len; i++) {
            axis = <Axis>axes[i];
            axis.orientation = (i === 0) ? 'Horizontal' : 'Vertical';
            axis.jsonCellLabel = [];
            this.axisCollections.push(axis);
        }
    }

    /**
     * Method to bind events for HeatMap
     */

    private wireEvents(): void {
        /*! Find the Events type */
        // eslint-disable-next-line
        const isIE11Pointer: Boolean = Browser.isPointer;
        const start: string = Browser.touchStartEvent;
        const stop: string = Browser.touchEndEvent;
        const move: string = Browser.touchMoveEvent;
        const cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, Browser.isDevice ? start : 'click', this.heatMapMouseClick, this);
        EventHandler.add(this.element, start, this.heatMapMouseMove, this);
        EventHandler.add(this.element, stop, this.heatMapMouseLeave, this);
        EventHandler.add(this.element, move, this.heatMapMouseMove, this);
        EventHandler.add(this.element, cancel, this.heatMapMouseLeave, this);

        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.heatMapResize.bind(this)
        );
        // eslint-disable-next-line
        const heatmap: HeatMap = this;
        /**
         * Support for touch tapHold and tap for HeatMap
         */

        // eslint-disable-next-line
        const touchObj: Touch = new Touch(this.element, {
            tapHold: () => {
                heatmap.isCellTapHold = true;
                heatmap.getDataCollection();
                heatmap.currentRect.allowCollection = false;
                heatmap.setCellOpacity();
                const argData: ISelectedEventArgs = {
                    heatmap: heatmap,
                    cancel: false,
                    name: 'cellSelected',
                    data: heatmap.multiCellCollection
                };
                heatmap.trigger('cellSelected', argData);
            },
            tap: () => {
                let isCellTap: boolean = false;
                if (!heatmap.isCellTapHold) {
                    isCellTap = true;
                }
                heatmap.tooltipOnMouseMove(null, heatmap.currentRect, isCellTap);
            }
        });

        this.setStyle(<HTMLElement>this.element);
    }

    /**
     * Applying styles for heatmap element
     */

    private setStyle(element: HTMLElement): void {
        element.style.touchAction = 'element';
        element.style.touchAction = 'element';
        element.style.zoom = 'none';
        element.style.userSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    }

    /**
     * Method to print the heatmap.
     */

    public print(): void {
        const exportChart: ExportUtils = new ExportUtils(this);
        exportChart.print();
    }

    /**
     * Method to unbind events for HeatMap
     */

    private unWireEvents(): void {
        /*! Find the Events type */
        // eslint-disable-next-line
        const isIE11Pointer: Boolean = Browser.isPointer;
        const start: string = Browser.touchStartEvent;
        // eslint-disable-next-line
        const stop: string = Browser.touchEndEvent;
        const move: string = Browser.touchMoveEvent;
        const cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.element, Browser.isDevice ? start : 'click', this.heatMapMouseClick);
        EventHandler.remove(this.element, start, this.heatMapMouseMove);
        EventHandler.remove(this.element, move, this.heatMapMouseLeave);
        EventHandler.remove(this.element, move, this.heatMapMouseMove);
        EventHandler.remove(this.element, cancel, this.heatMapMouseLeave);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.heatMapResize
        );
    }
    /**
     * Handles the heatmap resize.
     *
     * @returns {boolean}
     * @private
     */

    // eslint-disable-next-line
    public heatMapResize(e: Event): boolean {
        this.resizing = true;
        const argData: IResizeEventArgs = {
            heatmap: this,
            cancel: false,
            name: 'resized',
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            )
        };
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(
            (): void => {
                if (this.isDestroyed) {
                    clearTimeout(this.resizeTimer);
                    return;
                }
                this.createSvg();
                argData.currentSize = this.availableSize;
                this.trigger('resized', argData);
                this.refreshBound();
                this.appendSvgObject();
                if (this.allowSelection) {
                    this.updateCellSelection();
                }
                this.trigger('loaded', ({ heatmap: this }));
                this.resizing = false;
            },
            500);
        return false;
    }
    /**
     * Method to bind selection after window resize for HeatMap
     */

    private updateCellSelection(): void {
        const wSize: number = this.initialClipRect.width / this.axisCollections[0].axisLabelSize;
        const hSize: number = this.initialClipRect.height / this.axisCollections[1].axisLabelSize;
        const x: number = this.initialClipRect.x;
        const y: number = this.initialClipRect.y;
        if (!this.enableCanvasRendering) {
            if (this.multiCellCollection.length !== 0) {
                const containersRect: Element = document.getElementById(this.element.id + '_Container_RectGroup');
                const containerText: Element = document.getElementById(this.element.id + '_Container_TextGroup');
                for (let i: number = 0; i < containersRect.childNodes.length; i++) {
                    (containersRect.childNodes[i] as HTMLElement).setAttribute('opacity', '0.3');
                    if (this.cellSettings.showLabel && containerText.childNodes[i]) {
                        (containerText.childNodes[i] as HTMLElement).setAttribute('opacity', '0.3');
                    }
                }
                for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                    const collectionClass: Element = this.multiCellCollection[i].cellElement;
                    const cellIndex: string = collectionClass.id.replace(this.element.id + '_HeatMapRect_', '');
                    const index: number = parseInt(cellIndex, 10);
                    (containersRect.childNodes[index] as HTMLElement).setAttribute('opacity', '1');
                    if (this.cellSettings.showLabel && containerText.childNodes[i]) {
                        const getText: HTMLElement = document.getElementById(this.element.id + '_HeatMapRectLabels_' + index);
                        if (getText) {
                            getText.setAttribute('opacity', '1');
                        }
                        this.addSvgClass((containersRect.childNodes[index] as HTMLElement));
                    }
                }
            }
        } else if (this.enableCanvasRendering) {
            const rect: SelectedCellDetails[] = this.multiCellCollection;
            const oldCanvas: HTMLElement = document.getElementById(this.element.id + '_canvas');
            const newCanvas: HTMLElement = document.getElementById(this.element.id + '_secondary_canvas');
            const initialRect: Rect = this.initialClipRect;
            const rectHeight : number = initialRect.y + initialRect.height;
            const rectWidth : number = initialRect.x + initialRect.width;
            for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                this.multiCellCollection[i].width = rect[i].width = wSize;
                this.multiCellCollection[i].height = rect[i].height = hSize;
                this.multiCellCollection[i].x = rect[i].x = x + wSize * this.multiCellCollection[i].xPosition;
                this.multiCellCollection[i].y = rect[i].y = y + hSize * this.multiCellCollection[i].yPosition;
                const rectImage: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                    rect[i].x, rect[i].y, rect[i].width, rect[i].height);
                (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(rectImage, rect[i].x, rect[i].y);
                oldCanvas.style.opacity = '0.3';
            }
            const topPositions: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                0, 0, this.availableSize.width, initialRect.y);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(topPositions, 0, 0);
            const bottomPositions: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                0, rectHeight, this.availableSize.width,
                this.availableSize.height - rectHeight);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(
                bottomPositions, 0, initialRect.y + initialRect.height);
            const rightPosition: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').
                getImageData(
                    rectWidth, 0, this.availableSize.width - rectWidth, this.availableSize.height);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(rightPosition, rectWidth, 0);
            const leftPosition: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                0, 0, initialRect.x, this.availableSize.height);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(leftPosition, 0, 0);
            removeElement(this.element.id + '_selectedCells');
        }
    }
    private clearSVGSelection(): void {
        const rect: Element = document.getElementById(this.element.id + '_Container_RectGroup');
        const text: Element = document.getElementById(this.element.id + '_Container_TextGroup');
        for (let i: number = 0; i < rect.childNodes.length; i++) {
            const elementClassName: string = (rect.childNodes[i] as HTMLElement).getAttribute('class');
            if (elementClassName === this.element.id + '_selected') {
                this.removeSvgClass(rect.childNodes[i] as HTMLElement, elementClassName);
            }
            (rect.childNodes[i] as HTMLElement).setAttribute('opacity', '1');
            if (this.cellSettings.showLabel && text.childNodes[i]) {
                (text.childNodes[i] as HTMLElement).setAttribute('opacity', '1');
            }
        }
    }
    /**
     * Get the maximum length of data source for both horizontal and vertical
     *
     * @private
     */

    private calculateMaxLength(): void {
        const dataSource: Object[][] = <Object[][]>this.completeAdaptDataSource;
        if (dataSource && dataSource.length > 0) {
            const xAxisMax: number = dataSource.length - 1;
            let yAxisMax: number = 0;
            for (let i: number = 0; i <= xAxisMax; i++) {
                const length: number = dataSource[i].length;
                yAxisMax = yAxisMax > length ? yAxisMax : length;
            }
            this.axisCollections[0].maxLength = xAxisMax;
            this.axisCollections[1].maxLength = yAxisMax - 1;
        } else {
            this.axisCollections[0].maxLength = 0;
            this.axisCollections[1].maxLength = 0;
        }
    }

    /**
     * To find mouse x, y for aligned heatmap element svg position
     */

    private setMouseXY(pageX: number, pageY: number): void {
        const rect: ClientRect = this.element.getBoundingClientRect();
        let svgCanvasRect: ClientRect;
        if (this.enableCanvasRendering) {
            svgCanvasRect = document.getElementById(this.element.id + '_canvas').getBoundingClientRect();
        } else {
            svgCanvasRect = document.getElementById(this.element.id + '_svg').getBoundingClientRect();
        }
        this.mouseX = (pageX - rect.left) - Math.max(svgCanvasRect.left - rect.left, 0);
        this.mouseY = (pageY - rect.top) - Math.max(svgCanvasRect.top - rect.top, 0);
    }

    public heatMapMouseClick(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
        // eslint-disable-next-line
        let tooltipText: string;
        let touchArg: TouchEvent;

        const elementRect: ClientRect = this.element.getBoundingClientRect();
        if (e.type === 'touchstart') {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        } else {
            this.isTouch = false;
            pageY = e.clientY;
            pageX = e.clientX;
        }
        pageX -= elementRect.left;
        pageY -= elementRect.top;
        const isheatmapRect: boolean = this.isHeatmapRect(pageX, pageY);
        if (isheatmapRect) {
            const currentRect: CurrentRect = this.heatMapSeries.getCurrentRect(pageX, pageY);
            this.trigger('cellClick', {
                heatmap: this,
                value: currentRect.value,
                x: currentRect.x,
                y: currentRect.y,
                xLabel: this.heatMapSeries.hoverXAxisLabel,
                yLabel: this.heatMapSeries.hoverYAxisLabel,
                xValue: this.heatMapSeries.hoverXAxisValue,
                yValue: this.heatMapSeries.hoverYAxisValue,
                cellElement: this.enableCanvasRendering ? null : document.getElementById(currentRect.id),
                event: e
            });
        }
        this.notify('click', e);
        if (this.paletteSettings.type !== 'Gradient' && this.legendModule
            && this.legendSettings.visible && this.legendVisibilityByCellType) {
            const page: Rect[] = this.legendModule.navigationCollections;
            if (page.length && pageX > page[0].x && pageX < page[0].x + page[0].width &&
                pageY > page[0].y && pageY < page[0].y + page[0].height) {
                this.legendModule.translatePage(this, this.legendModule.currentPage, true);
            } else if (page.length && pageX > page[1].x && pageX < page[1].x + page[1].width &&
                pageY > page[1].y && pageY < page[1].y + page[1].height) {
                this.legendModule.translatePage(this, this.legendModule.currentPage, false);
            }
            const legendRange: LegendRange[] = this.legendModule.legendRange;
            const legendTextRange: LegendRange[] = this.legendModule.legendTextRange;
            let loop: boolean = true;
            for (let i: number = 0; i < legendRange.length; i++) {
                if (this.legendModule && this.legendSettings.toggleVisibility &&
                    this.legendModule.currentPage === legendRange[i].currentPage) {
                    if ((loop && (pageX >= legendRange[i].x && pageX <= legendRange[i].width + legendRange[i].x) &&
                        (pageY >= legendRange[i].y && pageY <= legendRange[i].y + legendRange[i].height) ||
                        ((this.legendSettings.showLabel && this.legendSettings.labelDisplayType !== 'None' &&
                            pageX >= legendTextRange[i].x && pageX <= legendTextRange[i].width + legendTextRange[i].x) &&
                            (pageY >= legendTextRange[i].y && pageY <= legendTextRange[i].y + legendTextRange[i].height)))) {
                        this.legendModule.legendRangeSelection(i);
                        loop = false;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Handles the mouse Move.
     *
     * @returns {boolean}
     *
     * @private
     */

    public heatMapMouseMove(e: PointerEvent): boolean {
        let pageX: number; let pageY: number;
        let touchArg: TouchEvent;
        const elementRect: ClientRect = this.element.getBoundingClientRect();
        if (e.type === 'touchmove' || e.type === 'touchstart') {
            this.isTouch = true;
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            this.isTouch = false;
            pageX = e.clientX;
            pageY = e.clientY;
        }
        pageX -= elementRect.left;
        pageY -= elementRect.top;
        this.setMouseXY(pageX, pageY);
        this.mouseAction(e, pageX, pageY, touchArg, elementRect);
        return true;
    }

    /**
     * Handles the mouse Move.
     *
     * @returns {boolean}
     */

    private mouseAction(e: PointerEvent, pageX: number, pageY: number, touchArg: TouchEvent, elementRect: ClientRect): boolean {
        let tooltipText: string;
        if (e.target && (<Element>e.target).id) {
            const isheatmapRect: boolean = this.isHeatmapRect(pageX, pageY);
            if (this.legendModule) {
                if (isheatmapRect) {
                    if (this.paletteSettings.type === 'Gradient' &&
                        this.legendSettings.showGradientPointer && this.legendSettings.visible && this.legendVisibilityByCellType) {
                        this.legendModule.renderGradientPointer(e, pageX, pageY);
                    }
                } else {
                    this.legendModule.removeGradientPointer();
                }
                this.renderMousePointer(pageX, pageY);
            }
            let isshowTooltip: boolean; let currentRect: CurrentRect;
            isshowTooltip = this.showTooltip && this.tooltipModule ? isheatmapRect : false;
            if (isheatmapRect) {
                currentRect = this.heatMapSeries.getCurrentRect(pageX, pageY);
                if (e.which !== 2 && e.which !== 3) {
                    isshowTooltip = this.cellSelectionOnMouseMove(e, currentRect, pageX, pageY, isshowTooltip);
                }
            }
            this.tooltipOnMouseMove(e, currentRect, isshowTooltip, isheatmapRect);
            if (this.legendModule && this.legendSettings.visible && this.paletteSettings.type === 'Fixed' &&
                this.legendSettings.enableSmartLegend && this.legendSettings.labelDisplayType === 'None') {
                this.legendModule.createTooltip(pageX, pageY);
            }
            if (!this.enableCanvasRendering) {
                if (this.titleSettings.text && this.titleSettings.textStyle.textOverflow === 'Trim') {
                    this.titleTooltip(e, pageX, pageY, this.isTouch);
                }
                this.axisTooltip(e, pageX, pageY, this.isTouch);
                if (this.legendModule && this.legendSettings.visible && this.legendSettings.showLabel && this.legendVisibilityByCellType) {
                    this.legendModule.renderLegendLabelTooltip(e, pageX, pageY);
                }
                if (this.legendModule && this.legendSettings.visible && this.legendVisibilityByCellType) {
                    this.legendModule.renderLegendTitleTooltip(e, pageX, pageY);
                }
            } else {
                // eslint-disable-next-line
                elementRect = this.element.getBoundingClientRect();
                const tooltipRect: boolean = (this.paletteSettings.type === 'Fixed' && this.legendSettings.enableSmartLegend &&
                this.legendSettings.labelDisplayType === 'None') ? false : true;
                tooltipText = getTooltipText(this.tooltipCollection, pageX, pageY) ||
                (this.legendModule && tooltipRect  && (getTooltipText(this.legendModule.legendLabelTooltip, pageX, pageY)
                || getTooltipText(this.legendModule.legendTitleTooltip, pageX, pageY)));
                if (tooltipText) {
                    showTooltip(
                        tooltipText,  pageX, pageY, this.element.offsetWidth, this.element.id + '_canvas_Tooltip',
                        getElement(this.element.id + '_Secondary_Element'), this.isTouch, this
                    );
                } else {
                    removeElement(this.element.id + '_canvas_Tooltip');
                }
            }
        }
        return true;
    }

    /**
     * Triggering cell selection
     */

    private cellSelectionOnMouseMove(
        e: PointerEvent, currentRect: CurrentRect, pageX: number, pageY: number, isshowTooltip: boolean): boolean {
        if ((this.cellSettings.tileType === 'Rect' && e.type === 'mousedown' || e.type === 'touchstart'
            || e.type === 'pointerdown') && this.allowSelection) {
            this.previousRect = currentRect; this.multiSelection = true; this.rectSelected = true;
            this.initialCellX = pageX; this.initialCellY = pageY;
            e.preventDefault();
        }
        if (this.cellSettings.tileType === 'Rect' && this.multiSelection && currentRect) {
            isshowTooltip = false;
            this.highlightSelectedCells(this.previousRect, currentRect, pageX, pageY, e);
        }
        return isshowTooltip;
    }

    /**
     * Rendering tooltip on mouse move
     */

    private tooltipOnMouseMove(e: PointerEvent, currentRect: CurrentRect, isshowTooltip: boolean, isheatmapRect?: boolean): void {
        if (isshowTooltip && currentRect) {
            if (this.tempTooltipRectId !== currentRect.id) {
                if (this.showTooltip) {
                    if ((this.cellSettings.enableCellHighlighting || (this.tooltipModule && this.showTooltip))
                        && !this.enableCanvasRendering) {
                        this.heatMapSeries.highlightSvgRect(currentRect.id);
                    }
                    this.tooltipModule.renderTooltip(currentRect);
                    if (this.isTouch) {
                        if (this.tooltipTimer) {
                            window.clearTimeout(this.tooltipTimer);
                        }
                        this.tooltipTimer = setTimeout(
                            () => {
                                this.tooltipModule.tooltipObject.fadeOut();
                                this.tooltipModule.isFadeout = true;
                            },
                            1500);
                        if (e) {
                            if (e.type === 'touchmove') {
                                e.preventDefault();
                            }
                        }
                    }
                }
                this.tempTooltipRectId = currentRect.id;
            }
        } else {
            if (e !== null) {
                const borderBoundary: number = 5;
                if (!isheatmapRect) {
                    if ((this.cellSettings.enableCellHighlighting || this.showTooltip) && !this.enableCanvasRendering &&
                        this.cellSettings.border.width < borderBoundary) {
                        this.heatMapSeries.highlightSvgRect((<Element>e.target).id);
                    }
                    if (this.tooltipModule && this.showTooltip) {
                        this.tooltipModule.showHideTooltip(false, true);
                    }
                } else if (!this.showTooltip && this.cellSettings.border.width > borderBoundary) {
                    this.heatMapSeries.highlightSvgRect((<Element>e.target).id);
                }
            }
            this.tempTooltipRectId = '';
        }
    }
    /**
     * To select the multiple cells on mouse move action
     */

    private highlightSelectedCells(
        previousRect: CurrentRect, currentRect: CurrentRect, pageX: number, pageY: number, e: PointerEvent): void {
        const pXIndex: number = previousRect.xIndex;
        const pYIndex: number = previousRect.yIndex;
        const cXIndex: number = currentRect.xIndex;
        const cYIndex: number = currentRect.yIndex;
        this.currentRect = currentRect;
        this.selectedCellsRect = new Rect(0, 0, 0, 0);
        this.selectedCellsRect.x = previousRect.x > currentRect.x ? currentRect.x : previousRect.x;
        this.selectedCellsRect.y = previousRect.y > currentRect.y ? currentRect.y : previousRect.y;
        this.selectedCellsRect.width = ((previousRect.x > currentRect.x ? (pXIndex - cXIndex) :
            (cXIndex - pXIndex)) + 1) * currentRect.width;
        this.selectedCellsRect.height = ((previousRect.y > currentRect.y ? (pYIndex - cYIndex) :
            (cYIndex - pYIndex)) + 1) * currentRect.height;
        if (e.type === 'touchstart') {
            this.isCellTapHold = true;
        } else {
            this.isCellTapHold = false;
        }
        e.preventDefault();
        if (e.ctrlKey === false && e.type !== 'touchstart' && e.type !== 'touchmove') {
            this.removeSelectedCellsBorder();
        }
        const x: number = this.initialCellX > pageX ? pageX : this.initialCellX;
        const y: number = this.initialCellY > pageY ? pageY : this.initialCellY;
        const parentDiv: HTMLElement = document.getElementById(this.element.id + '_CellSelection_Container');
        const svgObject: Element = this.renderer.createSvg({
            id: this.element.id + '_CellSelection_Container_svg',
            width: this.initialClipRect.width,
            height: this.initialClipRect.height
        });
        parentDiv.appendChild(svgObject);
        const parent: HTMLElement = document.getElementById(this.element.id + '_CellSelection_Container_svg');
        const rect: Rect = new Rect(
            x - this.initialClipRect.x, y - this.initialClipRect.y,
            Math.abs(pageX - this.initialCellX), Math.abs(pageY - this.initialCellY));
        const rectItems: RectOption = new RectOption(
            this.element.id + '_selectedCells', '#87ceeb', { color: 'transparent', width: 1 }, 1, rect, '#0000ff');
        parent.appendChild(this.renderer.drawRectangle(rectItems));
        document.getElementById(this.element.id + '_selectedCells').style.opacity = '0.5';
    }
    /**
     * Method to get selected cell data collection for HeatMap
     */

    private getDataCollection(): void {
        const pXIndex: number = this.previousRect.xIndex;
        const pYIndex: number = this.previousRect.yIndex;
        const cXIndex: number = this.currentRect.xIndex;
        const cYIndex: number = this.currentRect.yIndex;
        const minX: number = cXIndex > pXIndex ? pXIndex : cXIndex;
        const maxX: number = cXIndex > pXIndex ? cXIndex : pXIndex;
        const minY: number = cYIndex > pYIndex ? pYIndex : cYIndex;
        const maxY: number = cYIndex > pYIndex ? cYIndex : pYIndex;
        let tempX: number = minX;
        let tempY: number = minY;
        let cellX: number = this.previousRect.x;
        let cellY: number = this.previousRect.y;
        this.getCellCollection(this.currentRect, this.previousRect, true, tempX, tempY, maxX, maxY, minX, cellX, cellY);
        tempX = minX;
        tempY = minY;
        cellX = this.previousRect.x;
        cellY = this.previousRect.y;
        this.checkSelectedCells();
        this.getCellCollection(this.currentRect, this.previousRect, false, tempX, tempY, maxX, maxY, minX, cellX, cellY);
        this.selectedMultiCellCollection = [];
        this.canvasSelectedCells = new Rect(0, 0, 0, 0);
        this.selectedCellCount = 0;
    }
    /**
     * To get the selected datas.
     */

    private getCellCollection(
        currentRect: CurrentRect, previousRect: CurrentRect, singleCellData: boolean, tempX: number, tempY: number,
        maxX: number, maxY: number, minX: number, cellX: number, cellY: number): void {
        const xIndex: number = Math.abs((currentRect.xIndex === previousRect.xIndex ?
            0 : currentRect.xIndex - previousRect.xIndex)) + 1;
        const yIndex: number = Math.abs((currentRect.yIndex === previousRect.yIndex ?
            0 : currentRect.yIndex - previousRect.yIndex)) + 1;
        for (let i: number = 0; i < (xIndex * yIndex); i++) {
            if (singleCellData) {
                this.getSelectedCellData(cellX, cellY, true);
            } else {
                this.getSelectedCellData(cellX, cellY, false);
            }
            if (tempX < maxX) {
                cellX += currentRect.xIndex > previousRect.xIndex ? currentRect.width : -currentRect.width;
                tempX++;
            } else if (tempY < maxY) {
                cellY += currentRect.yIndex > previousRect.yIndex ? currentRect.height : -currentRect.height;
                cellX = previousRect.x;
                tempX = minX;
            }
        }
    }

    /**
     * To remove the selection on mouse click without ctrl key.
     */

    private removeSelectedCellsBorder(): void {
        if (!this.enableCanvasRendering) {
            const containerRect: HTMLElement = document.getElementById(this.element.id + '_Container_RectGroup');
            const containerText: HTMLElement = document.getElementById(this.element.id + '_Container_TextGroup');
            for (let i: number = 0; i < containerRect.childNodes.length; i++) {
                const elementClassName: string = (containerRect.childNodes[i] as HTMLElement).getAttribute('class');
                (containerRect.childNodes[i] as HTMLElement).setAttribute('opacity', '0.3');
                if (this.cellSettings.showLabel && containerText.childNodes[i]) {
                    (containerText.childNodes[i] as HTMLElement).setAttribute('opacity', '0.3');
                    this.removeSvgClass(
                        (containerRect.childNodes[i] as HTMLElement), elementClassName);
                }
            }
        } else {
            const ctx: CanvasRenderingContext2D = this.secondaryCanvasRenderer.ctx;
            for (let i: number = 0; i < this.previousSelectedCellsRect.length; i++) {
                const rect: Rect = this.previousSelectedCellsRect[i];
                ctx.save();
                ctx.clearRect(rect.x - 1, rect.y - 1, rect.width + 2, rect.height + 2);
                ctx.restore();
            }
            for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                const rects: SelectedCellDetails = this.multiCellCollection[i];
                if (this.multiCellCollection.length > 0) {
                    ctx.save();
                    ctx.clearRect(rects.x - 1, rects.y - 1, rects.width + 2, rects.height + 2);
                }
            }
        }
        this.multiCellCollection = [];
    }

    /**
     * To highlight the selected multiple cells on mouse move action in canvas mode.
     */

    private highlightSelectedAreaInCanvas(rect: Rect): void {
        if (rect.x) {
            const oldCanvas: HTMLElement = document.getElementById(this.element.id + '_canvas');
            const newCanvas: HTMLElement = document.getElementById(this.element.id + '_secondary_canvas');
            const initialRect: Rect = this.initialClipRect;
            const rectImage: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                rect.x, rect.y, rect.width, rect.height
            );
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(rectImage, rect.x, rect.y);
            oldCanvas.style.opacity = '0.3';
            const topPosition: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                0, 0, this.availableSize.width, initialRect.y);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(topPosition, 0, 0);
            const bottomPosition: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                0, initialRect.y + initialRect.height, this.availableSize.width,
                this.availableSize.height - (initialRect.y + initialRect.height));
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(bottomPosition, 0, initialRect.y + initialRect.height);
            const rightPosition: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                initialRect.x + initialRect.width, 0, this.availableSize.width - (initialRect.x + initialRect.width),
                this.availableSize.height);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(rightPosition, initialRect.x + initialRect.width, 0);
            const leftPosition: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                0, 0, initialRect.x, this.availableSize.height);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(leftPosition, 0, 0);
        }
    }
    /**
     * To get the collection of selected cells.
     */

    private getSelectedCellData(cellX: number, cellY: number, cellCollection: boolean): void {
        const xAxis: Axis = this.axisCollections[0];
        const yAxis: Axis = this.axisCollections[1];
        const xLabels: string[] = xAxis.tooltipLabels;
        const yLabels: string[] = yAxis.tooltipLabels.slice().reverse();
        const rectPosition: CurrentRect = this.heatMapSeries.getCurrentRect(cellX + 1, cellY + 1);
        const currentRect: Element = document.getElementById(rectPosition.id);
        const cellDetails: SelectedCellDetails = new SelectedCellDetails(null, '', '', 0, 0, null, 0, 0, 0, 0, 0, 0);
        cellDetails.value = rectPosition.value;
        cellDetails.xLabel = xLabels[rectPosition.xIndex].toString();
        cellDetails.yLabel = yLabels[rectPosition.yIndex].toString();
        cellDetails.xValue = xAxis.labelValue[rectPosition.xIndex];
        cellDetails.yValue = yAxis.labelValue.slice().reverse()[rectPosition.yIndex];
        cellDetails.cellElement = this.enableCanvasRendering ? null : currentRect;
        cellDetails.xPosition = rectPosition.xIndex;
        cellDetails.yPosition = rectPosition.yIndex;
        cellDetails.width = this.currentRect.width;
        cellDetails.height = this.currentRect.height;
        cellDetails.x = this.currentRect.x;
        cellDetails.y = this.currentRect.y;
        this.currentRect.allowCollection = true;
        this.addSvgClass(currentRect);
        if (cellCollection) {
            this.selectedMultiCellCollection.push(cellDetails);
            this.currentRect.allowCollection = false;
        } else {
            for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                if (this.multiCellCollection[i].xPosition === cellDetails.xPosition &&
                    this.multiCellCollection[i].yPosition === cellDetails.yPosition) {
                    this.currentRect.allowCollection = false;
                    if (this.selectedCellCount === this.selectedMultiCellCollection.length) {
                        this.currentRect.allowCollection = false;
                        if (!this.enableCanvasRendering) {
                            for (let j: number = 0; j < this.selectedMultiCellCollection.length; j++) {
                                const rectElement: Element = this.selectedMultiCellCollection[j].cellElement;
                                if (rectElement) {
                                    const index: string = rectElement.id.replace(this.element.id + '_HeatMapRect_', '');
                                    // eslint-disable-next-line
                                    const containerText: HTMLElement = document.getElementById(this.element.id + '_Container_TextGroup');
                                    const elementClassName: string = rectElement.getAttribute('class');
                                    rectElement.setAttribute('opacity', '0.3');
                                    const getText: HTMLElement = document.getElementById(this.element.id + '_HeatMapRectLabels_' + index);
                                    if (getText) {
                                        getText.setAttribute('opacity', '0.3');
                                    }
                                    this.removeSvgClass(rectElement, elementClassName);
                                }
                            }
                        } else {
                            const ctx: CanvasRenderingContext2D = this.secondaryCanvasRenderer.ctx;
                            const rect: Rect = this.canvasSelectedCells;
                            ctx.save();
                            ctx.clearRect(rect.x - 1, rect.y - 1, rect.width + 2, rect.height + 2);
                            ctx.restore();
                            this.selectedCellsRect = new Rect(0, 0, 0, 0);
                        }
                        this.multiCellCollection.splice(i, 1);
                    }
                }
            }
        }
        if (rectPosition.visible && !isNullOrUndefined(rectPosition.value) && this.currentRect.allowCollection === true) {
            this.multiCellCollection.push(cellDetails);
        }
    }
    /**
     * To add class for selected cells
     *
     * @private
     */

    public addSvgClass(element: Element): void {
        if (!this.enableCanvasRendering) {
            const className: string = this.element.id + '_selected';
            element.setAttribute('class', className);
        }
    }

    /**
     * To remove class for unselected cells
     *
     * @private
     */

    public removeSvgClass(rectElement: Element, className: string): void {
        if (className) {
            rectElement.setAttribute('class', className.replace(className, ''));
        }
    }

    /**
     * To clear the multi cell selection
     * {% codeBlock src='heatmap/clearSelection/index.md' %}{% endcodeBlock %}
     */

    public clearSelection(): void {
        if (!this.enableCanvasRendering && this.allowSelection) {
            this.clearSVGSelection();
        }
        if (this.enableCanvasRendering) {
            const ctx: CanvasRenderingContext2D = this.secondaryCanvasRenderer.ctx;
            for (let i: number = 0; i < this.previousSelectedCellsRect.length; i++) {
                ctx.save();
                ctx.clearRect(this.previousSelectedCellsRect[i].x - 1, this.previousSelectedCellsRect[i].y - 1,
                              this.previousSelectedCellsRect[i].width + 2, this.previousSelectedCellsRect[i].height + 2);
                ctx.restore();
            }
            for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                const rects: SelectedCellDetails = this.multiCellCollection[i];
                if (this.multiCellCollection.length > 0) {
                    ctx.save();
                    ctx.clearRect(rects.x - 1, rects.y - 1, rects.width + 2, rects.height + 2);
                }
            }
            const canvas: HTMLElement = document.getElementById(this.element.id + '_canvas');
            canvas.style.opacity = '1';
        }
        this.tempMultiCellCollection = [];
        this.multiCellCollection = [];
        this.rectSelected = false;
    }

    private renderMousePointer(pageX: number, pageY: number): void {
        const legendRange: LegendRange[] = this.legendModule.legendRange;
        const legendTextRange: LegendRange[] = this.legendModule.legendTextRange;
        let loop: boolean = true;
        for (let i: number = 0; i < legendRange.length; i++) {
            if (this.legendSettings.toggleVisibility && this.legendModule.currentPage === legendRange[i].currentPage) {
                if ((loop && (pageX >= legendRange[i].x && pageX <= legendRange[i].width + legendRange[i].x) &&
                    (pageY >= legendRange[i].y && pageY <= legendRange[i].y + legendRange[i].height) ||
                    ((this.legendSettings.showLabel && this.legendSettings.labelDisplayType !== 'None' &&
                        pageX >= legendTextRange[i].x && pageX <= legendTextRange[i].width + legendTextRange[i].x) &&
                        (pageY >= legendTextRange[i].y && pageY <= legendTextRange[i].y + legendTextRange[i].height)))) {
                    if (this.enableCanvasRendering) {
                        (document.getElementById(this.element.id + '_canvas') as HTMLElement).style.cursor = 'Pointer';
                    } else {
                        (document.getElementById(this.element.id + '_svg') as HTMLElement).style.cursor = 'Pointer';
                    }
                    loop = false;
                } else if (loop) {
                    if (this.enableCanvasRendering) {
                        (document.getElementById(this.element.id + '_canvas') as HTMLElement).style.cursor = '';
                    } else {
                        (document.getElementById(this.element.id + '_svg') as HTMLElement).style.cursor = '';
                    }
                }
            }
        }
    }

    /**
     * Handles the mouse end.
     *
     * @returns {boolean}
     * @private
     */

    public heatMapMouseLeave(e: PointerEvent): boolean {
        if (e.target && (<Element>e.target).id &&
            (this.cellSettings.enableCellHighlighting || (this.tooltipModule && this.showTooltip))
            && !this.enableCanvasRendering) {
            this.heatMapSeries.highlightSvgRect(this.tempTooltipRectId);
        }
        if (this.allowSelection && this.multiSelection) {
            this.multiSelection = false;
            if (e.type === 'mouseup' || e.type === 'touchend' || e.type === 'pointerup') {
                if (e.which !== 2 && e.which !== 3) {
                    if (this.isCellTapHold === false) {
                        this.getDataCollection();
                        this.currentRect.allowCollection = false;
                        this.setCellOpacity();
                        const argData: ISelectedEventArgs = {
                            heatmap: this,
                            cancel: false,
                            name: 'cellSelected',
                            data: this.multiCellCollection
                        };
                        this.trigger('cellSelected', argData);
                    } else {
                        this.isCellTapHold = false;
                    }
                }
            } else if (e.type === 'mouseleave' && (this.element.id + '_selectedCells')) {
                removeElement(this.element.id + '_selectedCells');
            }
        }
        if (this.tooltipModule && this.showTooltip && e.type === 'mouseleave') {
            this.tooltipModule.showHideTooltip(false);
        }
        this.tempTooltipRectId = '';
        if (this.legendModule && this.legendSettings.visible && this.legendModule.tooltipObject &&
            this.legendModule.tooltipObject.element) {
            const tooltipElement: HTMLElement = this.legendModule.tooltipObject.element.firstChild as HTMLElement;
            if (e.type === 'mouseleave') {
                tooltipElement.setAttribute('opacity', '0');
            } else {
                if (this.legendTooltipTimer) {
                    window.clearTimeout(this.legendTooltipTimer);
                }
                this.legendTooltipTimer = setTimeout(
                    () => {
                        tooltipElement.setAttribute('opacity', '0');
                    },
                    1500);
            }
        }
        if (this.paletteSettings.type === 'Gradient' && this.legendModule && this.legendSettings.showGradientPointer &&
            this.legendSettings.visible && this.legendVisibilityByCellType) {
            if (e.type === 'mouseleave') {
                this.legendModule.removeGradientPointer();
            } else {
                if (this.gradientTimer) {
                    window.clearTimeout(this.gradientTimer);
                }
                this.gradientTimer = setTimeout(() => { this.legendModule.removeGradientPointer(); }, 1500);
            }
        }
        if (this.enableCanvasRendering) {
            const main: HTMLElement = document.getElementById(this.element.id + '_hoverRect_canvas');
            if (main) {
                main.style.visibility = 'hidden';
                this.tempRectHoverClass = '';
            }
        }
        if (this.titleSettings.text && this.titleCollection[0].indexOf('...') !== -1) {
            if (!this.enableCanvasRendering) {
                removeElement(this.element.id + '_Title_Tooltip');
            } else {
                removeElement(this.element.id + '_canvas_Tooltip');
            }
        }
        return true;
    }

    /**
     * Method to Check for deselection of cell.
     */

    private checkSelectedCells() : void {
        if (!this.enableCanvasRendering) {
            for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                for (let j: number = 0; j < this.selectedMultiCellCollection.length; j++) {
                    if (this.selectedMultiCellCollection[j].cellElement.getAttribute('id')
                        === this.multiCellCollection[i].cellElement.getAttribute('id')) {
                        this.selectedCellCount++;
                    }
                }
            }
        } else {
            this.canvasSelectedCells = new Rect(0, 0, 0, 0);
            this.canvasSelectedCells.x = this.selectedCellsRect.x;
            this.canvasSelectedCells.y = this.selectedCellsRect.y;
            this.canvasSelectedCells.width = this.selectedCellsRect.width;
            this.canvasSelectedCells.height = this.selectedCellsRect.height;
            for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                for (let j: number = 0; j < this.selectedMultiCellCollection.length; j++) {
                    if (this.selectedMultiCellCollection[j].xPosition === this.multiCellCollection[i].xPosition &&
                        this.selectedMultiCellCollection[j].yPosition === this.multiCellCollection[i].yPosition) {
                        this.selectedCellCount++;
                    }
                }
            }
            if (this.rectSelected && this.paletteSettings.type === 'Gradient') {
                this.legendModule.removeGradientPointer();
            }
        }
    }
    /**
     * Method to remove opacity for text of selected cell for HeatMap
     */

    private removeOpacity(containersRect: Element, containerText: Element) : void {
        for (let i: number = 0; i < containersRect.childNodes.length; i++) {
            (containersRect.childNodes[i] as HTMLElement).setAttribute('opacity', '0.3');
            if (this.cellSettings.showLabel && containerText.childNodes[i] as HTMLElement) {
                (containerText.childNodes[i] as HTMLElement).setAttribute('opacity', '0.3');
            }
        }
    }
    /**
     * Method to set opacity for selected cell for HeatMap
     */

    private setCellOpacity() : void {
        if (!this.enableCanvasRendering) {
            if (this.multiCellCollection.length !== 0) {
                this.tempMultiCellCollection.push(this.multiCellCollection);
                const containersRect: Element = document.getElementById(this.element.id + '_Container_RectGroup');
                const containerText: Element = document.getElementById(this.element.id + '_Container_TextGroup');
                this.removeOpacity(containersRect, containerText);
                for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                    const collectionClasss: Element = this.multiCellCollection[i].cellElement;
                    const index: number = parseInt(collectionClasss.id.replace(this.element.id + '_HeatMapRect_', ''), 10);
                    (containersRect.childNodes[index]as HTMLElement).setAttribute('opacity', '1');
                    if (this.cellSettings.showLabel) {
                        const getText: HTMLElement = document.getElementById(this.element.id + '_HeatMapRectLabels_' + index);
                        if (getText) {
                            getText.setAttribute('opacity', '1');
                        }
                    }
                }
            }
        } else {
            this.previousSelectedCellsRect.push(this.selectedCellsRect);
            this.highlightSelectedAreaInCanvas(this.selectedCellsRect);
        }
        removeElement(this.element.id + '_selectedCells');
    }
    /**
     * To create div container for rendering two layers of canvas.
     *
     * @returns {void}
     * @private
     */

    public createMultiCellDiv(onLoad: boolean): void {
        if (onLoad) {
            const divElement: Element = this.createElement('div', {
                id: this.element.id + '_Multi_CellSelection_Canvas',
                styles: 'position:relative'
            });
            this.element.appendChild(divElement);
            divElement.appendChild(this.svgObject);
            (this.svgObject as HTMLElement).style.position = 'absolute';
            (this.svgObject as HTMLElement).style.left = '0px';
            (this.svgObject as HTMLElement).style.top = '0px';
            (this.svgObject as HTMLElement).style.zIndex = '0';

        } else {
            const element: Element = document.getElementById(this.element.id + '_Multi_CellSelection_Canvas');
            const secondaryCanvas: HTMLCanvasElement = this.secondaryCanvasRenderer.createCanvas({
                width: this.availableSize.width,
                height: this.availableSize.height, x: 0, y: 0,
                style: 'position: absolute; z-index: 1'
            });
            element.appendChild(secondaryCanvas);
        }
    }
}
