/**
 * Heat Map Component
 */

import { Component, Property, NotifyPropertyChanges, Internationalization, Complex, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ModuleDeclaration, EmitType, remove, Event, EventHandler } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, SvgRenderer, CanvasRenderer, setCulture, Browser } from '@syncfusion/ej2-base';
import { Size, stringToNumber, RectOption, Rect, TextBasic, measureText, CurrentRect, LegendRange, ToggleVisibility } from './utils/helper';
import { DrawSvgCanvas, TextOption, titlePositionX, getTitle, showTooltip, getElement, sum, SelectedCellDetails } from './utils/helper';
import { removeElement, CanvasTooltip, getTooltipText } from './utils/helper';
import { HeatMapModel } from './heatmap-model';
import { FontModel, MarginModel, TitleModel } from './model/base-model';
import { Margin, Title, ColorCollection, LegendColorCollection } from './model/base';
import { Theme, getThemeColor } from './model/theme';
import { IThemeStyle, ILoadedEventArgs, ICellClickEventArgs, ITooltipEventArgs } from './model/interface';
import { ICellEventArgs, ISelectedEventArgs } from './model/interface';
import { DrawType, HeatMapTheme } from './utils/enum';
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
import { Adaptor } from './datasource/adaptor';
import { DataModel } from './datasource/adaptor-model';

@NotifyPropertyChanges
export class HeatMap extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * The width of the heatmap as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, heatmap renders to the full width of its parent element.
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the heatmap as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, heatmap renders to the full height of its parent element.
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Enable or disable the tool tip for heatmap
     * @default true
     */

    @Property(true)
    public showTooltip: boolean;

    /**
     * Triggers when click the heat map cell.
     * @event
     */
    @Event()
    public tooltipRender: EmitType<ITooltipEventArgs>;

    /**
     * Triggers before each heatmap cell renders.
     * @event
     */
    @Event()
    public cellRender: EmitType<ICellEventArgs>;

    /**
     * Triggers when multiple cells gets selected.
     * @event
     */
    @Event()
    public cellSelected: EmitType<ISelectedEventArgs>[];

    /**
     * Specifies the rendering mode of heat map.
     * * SVG - Heat map is render using SVG draw mode.
     * * Canvas - Heat map is render using Canvas draw mode.
     * * Auto - Automatically switch the draw mode based on number of records in data source.
     * @default SVG
     */
    @Property('SVG')
    public renderingMode: DrawType;

    /**
     * Specifies the datasource for the heat map.
     * @default null
     */

    @Property(null)
    public dataSource: Object | DataModel;

    /**
     *  Specifies the theme for heatmap.
     * @default 'Material'
     */
    @Property('Material')
    public theme: HeatMapTheme;

    /**
     * Enable or disable the selection of multiple cells in heatmap
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
     * @default ''
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;

    /**
     * Options for customizing the cell color of the heat map
     */
    @Complex<PaletteSettingsModel>({}, PaletteSettings)
    public paletteSettings: PaletteSettingsModel;

    /**
     * Options for customizing the ToolTipSettings property  of the heat map
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
     */

    @Complex<CellSettingsModel>({}, CellSettings)
    public cellSettings: CellSettingsModel;

    /**
     * Triggers after heat map rendered.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers before heat map load.
     * @event
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * Triggers when click the heat map cell.
     * @event
     */
    @Event()
    public cellClick: EmitType<ICellClickEventArgs>;

    /** @private */
    public enableCanvasRendering: boolean = false;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public canvasRenderer: CanvasRenderer;
    /** @private */
    public svgObject: Element;
    /** @private */
    public availableSize: Size;
    /** @private */
    private elementSize: Size;
    /** @private */
    public themeStyle: IThemeStyle;

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
    // tslint:disable-next-line:no-any 
    public clonedDataSource: any[];
    /** @private */
    public completeAdaptDataSource: Object;
    /** @private */
    public xLength: number;
    /** @private */
    public yLength: number;
    /** @private */
    public dataSourceMinValue: number;
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
    public horizontalGradient: boolean = this.legendSettings.position === 'Bottom' || this.legendSettings.position === 'Top';
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

    /** @private */
    public multiCellCollection: SelectedCellDetails[] = [];
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
    private border: Object;

    /**
     * Gets the axis of the HeatMap.
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
     * @private
     */
    public legendModule: Legend;

    /**
     * The `tooltipModule` is used to manipulate Tooltip item from base of heatmap.
     * @private
     */
    public tooltipModule: Tooltip;

    /**
     * The `adaptorModule` is used to manipulate Adaptor item from base of heatmap.
     * @private
     */
    public adaptorModule: Adaptor;

    protected preRender(): void {
        this.initPrivateVariable();
        this.unWireEvents();
        this.wireEvents();
    }
    private initPrivateVariable(): void {
        this.renderer = new SvgRenderer(this.element.id);
        this.canvasRenderer = new CanvasRenderer(this.element.id);
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
        this.updateBubbleHelperProperty();
        this.trigger('load', { heatmap: this });
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
    }

    /**
     * To re-calculate the datasource while changing datasource property dynamically.
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
     * @private
     */
    private processInitData(): void {
        if (this.adaptorModule) {
            this.adaptorModule.constructDatasource(this.dataSource);
        } else {
            this.completeAdaptDataSource = this.dataSource;
        }
    }

    /**
     * To set render mode of heatmap as SVG or Canvas.
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
                this.legendModule.createTooltipDiv(this);
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
     * @private
     */
    public getPersistData(): string {
        return '';
    }
    public onPropertyChanged(newProp: HeatMapModel, oldProp: HeatMapModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        for (let prop of Object.keys(newProp)) {
            this.legendOnLoad = false;
            switch (prop) {
                case 'renderingMode':
                    renderer = true;
                    break;
                case 'cellSettings':
                    this.updateBubbleHelperProperty();
                    if (this.legendModule && ((newProp.cellSettings.tileType !==
                        oldProp.cellSettings.tileType) || (newProp.cellSettings.bubbleType !== oldProp.cellSettings.bubbleType))) {
                        this.legendOnLoad = true;
                        this.legendModule.updateLegendRangeCollections();
                    }
                    this.reRenderDatasource();
                    refreshBounds = true;
                    break;
                case 'showTooltip':
                    refreshBounds = true;
                    break;
                case 'dataSource':
                    this.isCellData = false;
                    this.updateBubbleHelperProperty();
                    if (this.legendVisibilityByCellType) {
                        this.legendOnLoad = true;
                        this.legendModule.updateLegendRangeCollections();
                    }
                    this.reRenderDatasource();
                    renderer = true;
                    break;
                case 'titleSettings':
                case 'width':
                case 'height':
                case 'margin':
                    refreshBounds = true;
                    break;
                case 'legendSettings':
                    this.updateBubbleHelperProperty();
                    if (this.legendVisibilityByCellType && (((newProp.legendSettings.visible !== oldProp.legendSettings.visible) ||
                        (newProp.legendSettings.enableSmartLegend !== oldProp.legendSettings.enableSmartLegend)))) {
                        this.legendOnLoad = true;
                        this.legendModule.updateLegendRangeCollections();
                    }
                    refreshBounds = true;
                    break;
                case 'yAxis':
                case 'xAxis':
                    this.updateBubbleHelperProperty();
                    if (this.legendVisibilityByCellType) {
                        this.legendOnLoad = true;
                        this.legendModule.updateLegendRangeCollections();
                    }
                    this.reRenderDatasource();
                    refreshBounds = true;
                    break;
                case 'paletteSettings':
                    this.updateBubbleHelperProperty();
                    if (this.legendVisibilityByCellType) {
                        this.legendOnLoad = true;
                        this.legendModule.updateLegendRangeCollections();
                    }
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
            this.clearSelection();
        } else if (refreshBounds) {
            this.createSvg();
            this.refreshBound();
            this.appendSvgObject();
            this.trigger('created');
        }
    }

    /**
     * create svg or canvas element
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
            let svgElement: Element = document.getElementById(this.svgObject.id);
            if (svgElement) {
                while (this.svgObject.childNodes.length) {
                    this.svgObject.removeChild(this.svgObject.firstChild);
                }
                remove(this.svgObject);
            }
        }
    }

    private renderSecondaryElement(): void {
        let tooltipDiv: Element = this.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        tooltipDiv.setAttribute('style', 'position: relative');
        this.element.appendChild(tooltipDiv);

        let divElement: Element = this.createElement('div', {
            id: this.element.id + '_CellSelection_Container',
            styles: 'position:absolute; z-index: 2',
        });
        this.element.appendChild(divElement);
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return{ModuleDeclaration[]}
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
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
     * @method destroy
     * @return {void}.
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
     * @method destroy
     * @return {void}.
     */
    public refresh(): void {
        super.refresh();
        this.element.classList.add('e-heatmap');
    }

    /**
     * Appending svg object to the element
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
        let width: number = 0;
        let rect: RectOption = new RectOption(
            this.element.id + '_HeatmapBorder', this.themeStyle.background, this.border, 1,
            new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
        this.drawSvgCanvas.drawRectangle(rect, this.svgObject);
    }
    private calculateSize(): void {
        let width: number = stringToNumber(this.width, this.element.offsetWidth) || this.element.offsetWidth || 600;
        let height: number = stringToNumber(this.height, this.element.offsetHeight) || this.element.offsetHeight || 450;
        this.availableSize = new Size(width, height);
    }

    private renderTitle(): void {
        if (this.titleSettings.text) {
            let titleStyle: FontModel = this.titleSettings.textStyle;
            let anchor: string = titleStyle.textAlignment === 'Near' ? 'start' :
                titleStyle.textAlignment === 'Far' ? 'end' : 'middle';
            this.elementSize = measureText(this.titleCollection[0], titleStyle);
            let options: TextOption = new TextOption(
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
        let targetId: string = (<HTMLElement>event.target).id;
        if ((targetId === (this.element.id + '_HeatmapTitle')) && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            showTooltip(
                this.titleSettings.text, x, y, this.element.offsetWidth, this.element.id + '_Title_Tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch, this
            );
        } else {
            removeElement(this.element.id + '_Title_Tooltip');
        }
    }
    private axisTooltip(event: Event, x: number, y: number, isTouch?: boolean): void {
        let targetId: string = (<HTMLElement>event.target).id;
        if ((targetId.indexOf(this.element.id + '_XAxis_Label') !== -1) ||
            (targetId.indexOf(this.element.id + '_XAxis_MultiLevel') !== -1) ||
            (targetId.indexOf(this.element.id + '_YAxis_MultiLevel') !== -1)) {
            let tooltipText: string = getTooltipText(this.tooltipCollection, x, y);
            if (tooltipText) {
                showTooltip(
                    tooltipText, this.mouseX, this.mouseY, this.element.offsetWidth, this.element.id + '_axis_Tooltip',
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
        let firstRectDetails: CurrentRect[] = [];
        let lastRectDetails: CurrentRect[] = [];
        let isRect: boolean;
        firstRectDetails.push(this.heatMapSeries.rectPositionCollection[0][0]);
        lastRectDetails.push(this.heatMapSeries.rectPositionCollection[this.yLength - 1][this.xLength - 1]);
        isRect = (x >= firstRectDetails[0].x && y >= firstRectDetails[0].y &&
            x <= (lastRectDetails[0].x + lastRectDetails[0].width) &&
            y <= (lastRectDetails[0].y + lastRectDetails[0].height)) ? true : false;
        return isRect;
    }
    private setTheme(): void {
        /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
    }

    private calculateBounds(): void {
        let margin: MarginModel = this.margin;
        // Title Height;
        let titleHeight: number = 0;
        let padding: number = (this.legendModule && this.legendSettings.position === 'Top'
            && this.legendVisibilityByCellType) || this.titleSettings.textStyle.size === '0px' ? 0 : 16; // title padding
        let left: number = margin.left;
        let width: number = this.availableSize.width - left - margin.right;
        if (this.titleSettings.text) {
            this.titleCollection = getTitle(this.titleSettings.text, this.titleSettings.textStyle, width);
            titleHeight = (measureText(this.titleSettings.text, this.titleSettings.textStyle).height * this.titleCollection.length) +
                padding;
        }
        let top: number = margin.top + titleHeight;
        this.titleRect = new Rect(margin.left, margin.top, this.availableSize.width - margin.left - margin.right, titleHeight);
        let height: number = this.availableSize.height - top - margin.bottom;
        this.initialClipRect = new Rect(left, top, width, height);
        let legendTop: number = this.initialClipRect.y;
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
        let axes: AxisModel[] = [this.xAxis, this.yAxis];
        this.axisCollections = [];
        for (let i: number = 0, len: number = axes.length; i < len; i++) {
            axis = <Axis>axes[i];
            axis.orientation = (i === 0) ? 'Horizontal' : 'Vertical';
            this.axisCollections.push(axis);
        }
    }

    /**
     * Method to bind events for HeatMap
     */
    private wireEvents(): void {
        /*! Find the Events type */
        let isIE11Pointer: Boolean = Browser.isPointer;
        let start: string = Browser.touchStartEvent;
        let stop: string = Browser.touchEndEvent;
        let move: string = Browser.touchMoveEvent;
        let cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, Browser.isDevice ? start : 'click', this.heatMapMouseClick, this);
        EventHandler.add(this.element, start, this.heatMapMouseMove, this);
        EventHandler.add(this.element, stop, this.heatMapMouseLeave, this);
        EventHandler.add(this.element, move, this.heatMapMouseMove, this);
        EventHandler.add(this.element, cancel, this.heatMapMouseLeave, this);

        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.heatMapResize.bind(this)
        );

        this.setStyle(<HTMLElement>this.element);
    }

    /**
     * Applying styles for heatmap element
     */
    private setStyle(element: HTMLElement): void {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    }

    /**
     * Method to unbind events for HeatMap
     */
    private unWireEvents(): void {
        /*! Find the Events type */
        let isIE11Pointer: Boolean = Browser.isPointer;
        let start: string = Browser.touchStartEvent;
        let stop: string = Browser.touchEndEvent;
        let move: string = Browser.touchMoveEvent;
        let cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
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
     * @return {boolean}
     * @private
     */
    public heatMapResize(e: Event): boolean {
        this.rangeSelection = true;
        this.legendOnLoad = false;
        this.clearSelection();
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
                this.refreshBound();
                this.appendSvgObject();
            },
            500);
        return false;
    }

    /**
     * Get the maximum length of data source for both horizontal and vertical
     * @private
     */
    private calculateMaxLength(): void {
        let dataSource: Object[][] = <Object[][]>this.completeAdaptDataSource;
        if (dataSource && dataSource.length > 0) {
            let xAxisMax: number = dataSource.length - 1;
            let yAxisMax: number = 0;
            for (let i: number = 0; i <= xAxisMax; i++) {
                let length: number = dataSource[i].length;
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
        let rect: ClientRect = this.element.getBoundingClientRect();
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
        let tooltipText: string;
        let touchArg: TouchEvent;

        let elementRect: ClientRect = this.element.getBoundingClientRect();
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
        let isheatmapRect: boolean = this.isHeatmapRect(pageX, pageY);
        if (isheatmapRect) {
            let currentRect: CurrentRect = this.heatMapSeries.getCurrentRect(pageX, pageY);
            this.trigger('cellClick', {
                heatmap: this,
                value: currentRect.value,
                x: currentRect.x,
                y: currentRect.y,
                xLabel: this.heatMapSeries.hoverXAxisLabel,
                yLabel: this.heatMapSeries.hoverYAxisLabel,
                xValue: this.heatMapSeries.hoverXAxisValue,
                yValue: this.heatMapSeries.hoverYAxisValue,
                cellElement: this.enableCanvasRendering ? null : document.getElementById(currentRect.id)
            });
        }
        this.notify('click', e);
        if (this.paletteSettings.type !== 'Gradient' && this.legendModule
            && this.legendSettings.visible && this.legendVisibilityByCellType) {
            let page: Rect[] = this.legendModule.navigationCollections;
            if (page.length && pageX > page[0].x && pageX < page[0].x + page[0].width &&
                pageY > page[0].y && pageY < page[0].y + page[0].height) {
                this.legendModule.translatePage(this, this.legendModule.currentPage, true);
            } else if (page.length && pageX > page[1].x && pageX < page[1].x + page[1].width &&
                pageY > page[1].y && pageY < page[1].y + page[1].height) {
                this.legendModule.translatePage(this, this.legendModule.currentPage, false);
            }
            let legendRange: LegendRange[] = this.legendModule.legendRange;
            let legendTextRange: LegendRange[] = this.legendModule.legendTextRange;
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
     * @return {boolean}
     * @private
     */
    public heatMapMouseMove(e: PointerEvent): boolean {
        let pageX: number; let pageY: number;
        let tooltipText: string;
        let touchArg: TouchEvent;
        let elementRect: ClientRect = this.element.getBoundingClientRect();
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
        if (e.target && (<Element>e.target).id) {
            let isheatmapRect: boolean = this.isHeatmapRect(pageX, pageY);
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
                isshowTooltip = this.cellSelectionOnMouseMove(e, currentRect, pageX, pageY, isshowTooltip);
            }
            this.tooltipOnMouseMove(e, currentRect, isshowTooltip);
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
                    this.legendModule.renderLegendLabelTooltip(e);
                }
            } else {
                elementRect = this.element.getBoundingClientRect();
                let tooltipRect: boolean = (this.paletteSettings.type === 'Fixed' && this.legendSettings.enableSmartLegend &&
                    this.legendSettings.labelDisplayType === 'None') ? false : true;
                tooltipText = getTooltipText(this.tooltipCollection, pageX, pageY) ||
                    (this.legendModule && tooltipRect && getTooltipText(this.legendModule.legendLabelTooltip, pageX, pageY));
                if (tooltipText) {
                    showTooltip(
                        tooltipText, this.mouseX, this.mouseY, this.element.offsetWidth, this.element.id + '_canvas_Tooltip',
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
        if ((this.cellSettings.tileType === 'Rect' && e.type === 'mousedown' || e.type === 'touchstart') && this.allowSelection) {
            this.previousRect = currentRect; this.multiSelection = true; this.rectSelected = true;
            this.initialCellX = pageX; this.initialCellY = pageY;
        }
        if (this.cellSettings.tileType === 'Rect' && this.multiSelection && currentRect) {
            this.highlightSelectedCells(this.previousRect, currentRect, e);
            isshowTooltip = false;
        }
        return isshowTooltip;
    }

    /**
     * Rendering tooltip on mouse move
     */
    private tooltipOnMouseMove(e: PointerEvent, currentRect: CurrentRect, isshowTooltip: boolean): void {
        if (isshowTooltip) {
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
                        if (e.type === 'touchmove') {
                            e.preventDefault();
                        }
                    }
                }
                this.tempTooltipRectId = currentRect.id;
            }
        } else {
            if ((<Element>e.target).id.indexOf('Celltooltip') === -1) {
                if ((this.cellSettings.enableCellHighlighting || this.showTooltip) && !this.enableCanvasRendering) {
                    this.heatMapSeries.highlightSvgRect((<Element>e.target).id);
                }
                if (this.tooltipModule && this.showTooltip) {
                    this.tooltipModule.showHideTooltip(false, true);
                }
            }
            this.tempTooltipRectId = '';
        }
    }

    /**
     * To select the multiple cells on mouse move action
     */
    private highlightSelectedCells(previousRect: CurrentRect, currentRect: CurrentRect, e: PointerEvent): void {
        let pXIndex: number = previousRect.xIndex;
        let pYIndex: number = previousRect.yIndex;
        let cXIndex: number = currentRect.xIndex;
        let cYIndex: number = currentRect.yIndex;
        let xIndex: number = Math.abs((currentRect.xIndex === previousRect.xIndex ? 0 : currentRect.xIndex - previousRect.xIndex)) + 1;
        let yIndex: number = Math.abs((currentRect.yIndex === previousRect.yIndex ? 0 : currentRect.yIndex - previousRect.yIndex)) + 1;
        let minX: number = cXIndex > pXIndex ? pXIndex : cXIndex;
        let maxX: number = cXIndex > pXIndex ? cXIndex : pXIndex;
        let minY: number = cYIndex > pYIndex ? pYIndex : cYIndex;
        let maxY: number = cYIndex > pYIndex ? cYIndex : pYIndex;
        let tempX: number = minX; let tempY: number = minY;
        let cellX: number = previousRect.x;
        let cellY: number = previousRect.y;
        this.selectedCellsRect = new Rect(0, 0, 0, 0);
        this.selectedCellsRect.x = previousRect.x > currentRect.x ? currentRect.x : previousRect.x;
        this.selectedCellsRect.y = previousRect.y > currentRect.y ? currentRect.y : previousRect.y;
        this.selectedCellsRect.width = ((previousRect.x > currentRect.x ? (pXIndex - cXIndex) :
            (cXIndex - pXIndex)) + 1) * currentRect.width;
        this.selectedCellsRect.height = ((previousRect.y > currentRect.y ? (pYIndex - cYIndex) :
            (cYIndex - pYIndex)) + 1) * currentRect.height;
        this.removeSelectedCellsBorder();

        this.multiCellCollection = [];
        for (let i: number = 0; i < (xIndex * yIndex); i++) {
            this.getSelectedCellDatas(cellX, cellY);
            if (tempX < maxX) {
                cellX += cXIndex > pXIndex ? currentRect.width : -currentRect.width;
                tempX++;
            } else if (tempY < maxY) {
                cellY += cYIndex > pYIndex ? currentRect.height : -currentRect.height;
                cellX = previousRect.x;
                tempX = minX;
            }
        }
        let x: number = this.initialCellX > e.pageX ? e.pageX : this.initialCellX;
        let y: number = this.initialCellY > e.pageY ? e.pageY : this.initialCellY;
        let parentDiv: HTMLElement = document.getElementById(this.element.id + '_CellSelection_Container');
        parentDiv.style.left = (this.selectedCellsRect.x - 1) + 'px';
        parentDiv.style.top = (this.selectedCellsRect.y - 1) + 'px';
        let svgObject: Element = this.renderer.createSvg({
            id: this.element.id + '_CellSelection_Container_svg',
            width: this.selectedCellsRect.width + 2,
            height: this.selectedCellsRect.height + 2
        });
        parentDiv.appendChild(svgObject);
        let parent: HTMLElement = document.getElementById(this.element.id + '_CellSelection_Container_svg');
        let rect: Rect = new Rect(
            x - this.selectedCellsRect.x, y - this.selectedCellsRect.y,
            Math.abs(e.pageX - this.initialCellX), Math.abs(e.pageY - this.initialCellY));
        let rectItems: RectOption = new RectOption(
            this.element.id + '_selectedCells', '#87ceeb',
            { color: 'transparent', width: 1 }, 1, rect, '#0000ff');
        parent.appendChild(this.renderer.drawRectangle(rectItems));
        document.getElementById(this.element.id + '_selectedCells').style.opacity = '0.5';
    }

    /**
     * To select the multiple cells on mouse move action
     */
    private removeSelectedCellsBorder(): void {
        if (!this.enableCanvasRendering) {
            for (let i: number = 0; i < this.multiCellCollection.length; i++) {
                let rectElement: Element = this.multiCellCollection[i].cellElement;
                if (rectElement) {
                    let index: string = rectElement.id.slice((this.element.id + '_HeatMapRect_').length);
                    let textElement: HTMLElement = document.getElementById(this.element.id + '_HeatMapRectLabels_' + index);
                    let elementClassName: string = rectElement.getAttribute('class');
                    if (this.tempMultiCellCollection.length > 0) {
                        rectElement.setAttribute('opacity', '0.3');
                        if (this.cellSettings.showLabel) {
                            textElement.setAttribute('opacity', '0.3');
                        }
                    }
                    this.removeSvgClass(rectElement, textElement, elementClassName, false);
                }
            }
        } else {
            if (this.previousSelectedCellsRect.length > 0) {
                let ctx: CanvasRenderingContext2D = this.canvasRenderer.ctx;
                ctx.save();
                ctx.clearRect(
                    this.previousSelectedCellsRect[0].x - 1, this.previousSelectedCellsRect[0].y - 1,
                    this.previousSelectedCellsRect[0].width + 2, this.previousSelectedCellsRect[0].height + 2);
                ctx.restore();
                this.previousSelectedCellsRect.shift();
            }
        }
        if (this.element.id + '_selectedCellsBorder') {
            removeElement(this.element.id + '_selectedCellsBorder');
        }
    }

    /**
     * To select the multiple cells on mouse move action
     */
    private highlightSelectedAreaInCanvas(rect: Rect): void {
        let oldCanvas: HTMLElement = document.getElementById(this.element.id + '_canvas');
        let newCanvas: HTMLElement = document.getElementById(this.element.id + '_secondarycanvas');
        let padding: number = 10;
        let rectImage: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(rect.x, rect.y, rect.width, rect.height);
        (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(rectImage, rect.x, rect.y);
        if (this.legendModule && this.legendSettings.visible) {
            let legendRect: Rect = this.legendModule.legendGroup;
            let legendImage: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                legendRect.x, legendRect.y, legendRect.width, legendRect.height);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(legendImage, legendRect.x, legendRect.y);
        }
        if (this.titleSettings.text !== '') {
            let titleRect: Rect = this.titleRect;
            let titleImage: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
                titleRect.x, titleRect.y, titleRect.width, titleRect.height);
            (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(titleImage, titleRect.x, titleRect.y);
        }
        let axis: Axis[] = this.axisCollections;
        let xHeight: number = (axis[0].opposedPosition ? sum(axis[0].farSizes) : sum(axis[0].nearSizes)) + padding;
        let yWidth: number = (axis[1].opposedPosition ? sum(axis[1].farSizes) : sum(axis[1].nearSizes)) + padding;
        let x: number = axis[1].opposedPosition ? axis[1].rect.x : axis[1].rect.x - yWidth;
        let y: number = axis[0].opposedPosition ? axis[0].rect.y - xHeight : axis[0].rect.y;
        let xAxisImage: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
            axis[0].rect.x, y, axis[0].rect.width, xHeight);
        (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(xAxisImage, axis[0].rect.x, y);
        let yAxisImage: ImageData = (oldCanvas as HTMLCanvasElement).getContext('2d').getImageData(
            x, axis[1].rect.y,
            yWidth, axis[1].rect.height);
        (newCanvas as HTMLCanvasElement).getContext('2d').putImageData(
            yAxisImage, x, axis[1].rect.y);
        oldCanvas.style.opacity = '0.5';
    }

    /**
     * To select the multiple cells on mouse move action
     */
    private getSelectedCellDatas(cellX: number, cellY: number): void {
        let xAxis: Axis = this.axisCollections[0];
        let yAxis: Axis = this.axisCollections[1];
        let xLabels: string[] = xAxis.tooltipLabels;
        let yLabels: string[] = yAxis.tooltipLabels.slice().reverse();
        let rectPosition: CurrentRect = this.heatMapSeries.getCurrentRect(cellX + 1, cellY);
        let currentRect: Element = document.getElementById(rectPosition.id);
        let cellDetails: SelectedCellDetails = new SelectedCellDetails(null, '', '', 0, 0, null);
        cellDetails.value = rectPosition.value;
        cellDetails.xLabel = xLabels[rectPosition.xIndex].toString();
        cellDetails.yLabel = yLabels[rectPosition.yIndex].toString();
        cellDetails.xValue = xAxis.labelValue[rectPosition.xIndex];
        cellDetails.yValue = yLabels[rectPosition.yIndex];
        cellDetails.cellElement = this.enableCanvasRendering ? null : currentRect;
        this.addSvgClass(currentRect);
        if (rectPosition.visible && !isNullOrUndefined(rectPosition.value)) {
            this.multiCellCollection.push(cellDetails);
        }
    }
    /**
     * To add class for selected cells
     * @private
     */
    public addSvgClass(element: Element): void {
        if (!this.enableCanvasRendering) {
            let className: string = this.element.id + '_selected';
            element.setAttribute('class', className);
        }
    }

    /**
     * To remove class for unselected cells
     * @private
     */
    public removeSvgClass(rectElement: Element, textElement: Element, className: string, clearSelection: boolean): void {
        if (className) {
            rectElement.setAttribute('class', className.replace(className, ''));
        }
        if (!clearSelection && className !== this.element.id + '_selected') {
            rectElement.setAttribute('opacity', '0.3');
            if (this.cellSettings.showLabel) {
                textElement.setAttribute('opacity', '0.3');
            }
        }
    }

    /**
     * To clear the multi cell selection
     */
    public clearSelection(): void {
        if (!this.enableCanvasRendering) {
            let rect: Element = document.getElementById(this.element.id + '_Container_RectGroup');
            let text: Element = document.getElementById(this.element.id + '_Container_TextGroup');
            for (let i: number = 0; i < rect.childNodes.length; i++) {
                let elementClassName: string = rect.children[i].getAttribute('class');
                if (elementClassName === this.element.id + '_selected') {
                    this.removeSvgClass(rect.children[i], text.children[i], elementClassName, true);
                }
                rect.children[i].setAttribute('opacity', '1');
                if (this.cellSettings.showLabel) {
                    rect.children[i].setAttribute('opacity', '1');
                }
            }
        }
        this.tempMultiCellCollection = [];
        if (this.element.id + '_selectedCellsBorder') {
            removeElement(this.element.id + '_selectedCellsBorder');
        }
    }

    private renderMousePointer(pageX: number, pageY: number): void {
        let legendRange: LegendRange[] = this.legendModule.legendRange;
        let legendTextRange: LegendRange[] = this.legendModule.legendTextRange;
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
     * @return {boolean}
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
            if (e.type === 'mouseup' || e.type === 'touchend') {
                if (!this.enableCanvasRendering) {
                    this.tempMultiCellCollection.push(this.multiCellCollection);
                    let containerRect: Element = document.getElementById(this.element.id + '_Container_RectGroup');
                    let containerText: Element = document.getElementById(this.element.id + '_Container_TextGroup');
                    for (let i: number = 0; i < containerRect.childNodes.length; i++) {
                        let elementClassName: string = containerRect.children[i].getAttribute('class');
                        if (elementClassName !== this.element.id + '_selected') {
                            containerRect.children[i].setAttribute('opacity', '0.3');
                            if (this.cellSettings.showLabel) {
                                containerText.children[i].setAttribute('opacity', '0.3');
                            }
                        } else {
                            containerRect.children[i].setAttribute('opacity', '1');
                            if (this.cellSettings.showLabel) {
                                containerText.children[i].setAttribute('opacity', '1');
                            }
                        }
                    }
                } else {
                    this.previousSelectedCellsRect.push(this.selectedCellsRect);
                    this.highlightSelectedAreaInCanvas(this.selectedCellsRect);
                }
                removeElement(this.element.id + '_selectedCells');
                let rect: Rect = new Rect(1, 1, this.selectedCellsRect.width, this.selectedCellsRect.height);
                let rectItems: RectOption = new RectOption(
                    this.element.id + '_selectedCellsBorder', 'none',
                    { color: 'transparent', width: 1 }, 1, rect, 'Black');
                let parent: HTMLElement = document.getElementById(this.element.id + '_CellSelection_Container_svg');
                parent.appendChild(this.renderer.drawRectangle(rectItems));
                let argData: ISelectedEventArgs = {
                    heatmap: this,
                    cancel: false,
                    name: 'cellSelected',
                    data: this.multiCellCollection
                };
                this.trigger('cellSelected', argData);
            }
        }
        if (this.tooltipModule && this.showTooltip && e.type === 'mouseleave') {
            this.tooltipModule.showHideTooltip(false);
        }
        this.tempTooltipRectId = '';
        if (this.legendModule && this.legendSettings.visible && this.legendModule.tooltipObject &&
            this.legendModule.tooltipObject.element) {
            let tooltipElement: HTMLElement = this.legendModule.tooltipObject.element.firstChild as HTMLElement;
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
            let main: HTMLElement = document.getElementById(this.element.id + '_hoverRect_canvas');
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
     * To create div container for rendering two layers of canvas.
     * @return {void}
     * @private
     */
    public createMultiCellDiv(onLoad: boolean): void {
        if (onLoad) {
            let divElement: Element = this.createElement('div', {
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
            let element: Element = document.getElementById(this.element.id + '_Multi_CellSelection_Canvas');
            let secondaryCanvas: HTMLCanvasElement = this.canvasRenderer.createCanvas({
                width: this.availableSize.width,
                height: this.availableSize.height, x: 0, y: 0,
                style: 'position: absolute; z-index: 1'
            });
            element.appendChild(secondaryCanvas);
            secondaryCanvas.id = this.element.id + '_secondarycanvas';
        }
    }
}

