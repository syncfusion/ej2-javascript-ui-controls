/**
 * Heat Map Component
 */

import { Component, Property, NotifyPropertyChanges, Internationalization, Complex } from '@syncfusion/ej2-base';
import { ModuleDeclaration, EmitType, remove, Event, EventHandler } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, SvgRenderer, CanvasRenderer, setCulture, Browser } from '@syncfusion/ej2-base';
import { Size, stringToNumber, RectOption, Rect, TextBasic, measureText, CurrentRect } from './utils/helper';
import { DrawSvgCanvas, TextOption, titlePositionX, getTitle, showTooltip, getElement } from './utils/helper';
import { removeElement, CanvasTooltip, getTooltipText } from './utils/helper';
import { HeatMapModel } from './heatmap-model';
import { FontModel, MarginModel, TitleModel } from './model/base-model';
import { Margin, Title, ColorCollection, LegendColorCollection } from './model/base';
import { Theme, getThemeColor } from './model/theme';
import { IThemeStyle, ILoadedEventArgs, ICellClickEventArgs, ITooltipEventArgs } from './model/interface';
import { DrawType, HeatMapTheme } from './utils/enum';
import { Axis } from './axis/axis';
import { AxisModel } from './axis/axis-model';
import { AxisHelper } from './axis/axis-helpers';
import { Series, CellSettings } from './series/series';
import { CellSettingsModel } from './series/series-model';
import { PaletteSettingsModel } from './utils/colorMapping-model';
import { PaletteSettings, CellColor } from './utils/colorMapping';
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
    public created: EmitType<ILoadedEventArgs>;

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
    public horizontalGradient: boolean = this.legendSettings.position === 'Bottom' || this.legendSettings.position === 'Top';
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
        this.processInitData();
        this.setTheme();
        this.initAxis();
        this.calculateMaxLength();
        this.heatMapAxis.calculateVisibleLabels();
        this.twoDimensional.processDataSource(this.completeAdaptDataSource);
        this.createSvg();
        this.cellColor.getColorCollection();
        this.calculateBounds();
        this.renderElements();
        this.element.appendChild(this.svgObject);
        if (this.tooltipModule) {
            this.tooltipModule.showHideTooltip(false);
        }

        this.trigger('created', { heatmap: this });
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
            switch (prop) {
                case 'renderingMode':
                    renderer = true;
                    break;
                case 'cellSettings':
                    this.updateBubbleHelperProperty();
                    this.reRenderDatasource();
                    refreshBounds = true;
                    break;
                case 'showTooltip':
                    refreshBounds = true;
                    break;
                case 'dataSource':
                    this.isCellData = false;
                    this.updateBubbleHelperProperty();
                    this.reRenderDatasource();
                    renderer = true;
                    break;
                case 'titleSettings':
                case 'width':
                case 'height':
                case 'margin':
                case 'legendSettings':
                    refreshBounds = true;
                    break;
                case 'yAxis':
                case 'xAxis':
                    this.reRenderDatasource();
                    refreshBounds = true;
                    break;
                case 'paletteSettings':
                    this.cellColor.getColorCollection();
                    this.calculateBounds();
                    renderer = true;
                    break;
                case 'theme':
                    this.setTheme();
                    renderer = true;
                    break;
            }
        }
        if (!refreshBounds && renderer) {
            this.createSvg();
            this.renderElements();
            this.element.appendChild(this.svgObject);
            this.trigger('created', { heatmap: this });
        } else if (refreshBounds) {
            this.createSvg();
            this.refreshBound();
            this.element.appendChild(this.svgObject);
            this.trigger('created', { heatmap: this });
        }
    }
    private createSvg(): void {
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
        if ((targetId.indexOf(this.element.id + '_XAxis_Label') !== -1) && ((<HTMLElement>event.target).textContent.indexOf('...') > -1)) {
            let index: number = parseInt(targetId.replace(this.element.id + '_XAxis_Label', ''), 10);
            showTooltip(
                this.axisCollections[0].axisLabels[index], x, y, this.element.offsetWidth, this.element.id + '_axis_Tooltip',
                getElement(this.element.id + '_Secondary_Element'), isTouch, this
            );
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

    private refreshBound(): void {
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
                this.element.appendChild(this.svgObject);
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
        }
        return false;
    }

    /**
     * Handles the mouse Move. 
     * @return {boolean}
     * @private
     */
    public heatMapMouseMove(e: PointerEvent): boolean {
        let pageX: number;
        let pageY: number;
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
            }
            let isshowTooltip: boolean;
            isshowTooltip = this.showTooltip && this.tooltipModule ? this.isHeatmapRect(pageX, pageY) : false;
            if (isshowTooltip) {
                let currentRect: CurrentRect;
                currentRect = this.heatMapSeries.getCurrentRect(pageX, pageY);
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
}

