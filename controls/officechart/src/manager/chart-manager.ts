import { Component, Event, EmitType, INotifyPropertyChanged, extend, isNullOrUndefined, getComponent, getUniqueID } from '@syncfusion/ej2-base';
import {
    Chart, AccumulationChart, SeriesModel as ChartSeriesModel, AccumulationSeriesModel,
    ChartSeriesType, AccumulationLabelPosition, LabelPosition, LegendSettingsModel,
    AxisModel, MajorGridLinesModel, MinorGridLinesModel, MajorTickLinesModel
} from '@syncfusion/ej2-charts';
import { ChartModel } from '../base/chart';
import { LegendPosition, ChartTheme, ChartType, ChartShape } from '../common';
import {
    ChartCreatedEventArgs, ChartDeletedEventArgs, ChartRefreshedEventArgs, ChartUpdatedEventArgs, ChartOptions,
    IChartUpdateOptions, IChartBeforeActionEventArgs, IChartAfterActionEventArgs, RibbonAction
} from '../common/interface';
import { chartCreated, chartDeleted, chartRefreshed, chartUpdated, beforeChartAction, afterChartAction } from '../common/event';
import { OfficeSeriesModel } from '../integrations/data-provider';
import { IOverlayHost, DefaultOverlayHost } from '../integrations/overlay-host';
import { IUndoRedoHost } from '../integrations/undo-redo-host';
import { ChartRenderer, IChartRenderOptions, getThemeBgColor } from '../renderers/chart-renderer';
import { OverlayService } from '../services/overlay';
import { JsonSeriesProcessor, JsonChartProcessResult } from '../data/json-series-processor';
import {
    chartTypeProperty, chartCategoryProperty, categoryXNameProperty, chartTitleProperty, chartLegendProperty, positionProperty,
    seriesNameProperty, chartDataProperty, chartSeriesProperty, yValueProperty, CHART_THEMES,
    widthProperty, heightProperty, chartPrimaryCategoryAxisProperty, chartPrimaryValueAxisProperty,
    hasMajorGridLinesProperty, hasMinorGridLinesProperty, dataLabelProperty
} from '../common/constant';
import { SeriesProcessor, ISeriesProcessResult } from '../data/series-processor';
import { LifecycleManager, IChartLifecycleItem } from './lifecycle-manager';

export class ChartManager extends Component<HTMLElement> implements INotifyPropertyChanged {
    private chartRenderer: ChartRenderer = new ChartRenderer();
    private overlayService: OverlayService = new OverlayService();
    private lifecycleManager: LifecycleManager = new LifecycleManager('office');
    private overlayHost!: IOverlayHost;
    private defaultOverlayHost: DefaultOverlayHost = null;
    private undoRedoHost!: IUndoRedoHost;

    /**
     * Triggered when a chart is created.
     */
    @Event()
    public chartCreated: EmitType<ChartCreatedEventArgs>;

    /**
     * Triggered when a chart is updated.
     */
    @Event()
    public chartUpdated: EmitType<ChartUpdatedEventArgs>;

    /**
     * Triggered when a chart is refreshed.
     */
    @Event()
    public chartRefreshed: EmitType<ChartRefreshedEventArgs>;

    /**
     * Triggered when a chart is deleted.
     */
    @Event()
    public chartDeleted: EmitType<ChartDeletedEventArgs>;

    /**
     * Triggered before a chart action (theme, chartType, title, legend, etc.) is executed.
     * Can be canceled by setting args.cancel = true.
     */
    @Event()
    public beforeChartAction: EmitType<IChartBeforeActionEventArgs>;

    /**
     * Triggered after a chart action has been executed and applied.
     */
    @Event()
    public afterChartAction: EmitType<IChartAfterActionEventArgs>;

    constructor(options?: object, element?: string | HTMLElement) {
        super(options, element);
        if (this.overlayService) {
            this.overlayService.setAdapters(this);
        }
    }

    public preRender(): void {
        // Required lifecycle method
    }
    public render(): void {
        // Required lifecycle method
    }
    public onPropertyChanged(newProp: object, oldProp: object): void {
        void newProp;
        void oldProp;
    }
    public getModuleName(): string { return 'chartManager'; }
    public getPersistData(): string { return ''; }

    public setOverlayHost(host: IOverlayHost): void { this.overlayHost = host; }
    public setOverlayService(service: OverlayService): void {
        this.overlayService = service;
        if (this.overlayService) {
            this.overlayService.setAdapters(this, this.chartRibbon);
        }
    }
    public setUndoRedoHost(host: IUndoRedoHost): void { this.undoRedoHost = host; }
    public getUndoRedoHost(): IUndoRedoHost { return this.undoRedoHost; }

    private chartRibbon: Object;
    private activeChartId: string;

    public attachRibbon(ribbon: Object): void {
        this.chartRibbon = ribbon;
        if (this.overlayService) {
            this.overlayService.setAdapters(this, ribbon);
        }
    }

    public detachRibbon(): void {
        this.chartRibbon = null;
        if (this.overlayService) {
            this.overlayService.setAdapters(this, null);
        }
    }

    public getAttachedRibbon(): Object {
        return this.chartRibbon;
    }

    public setActiveChart(chartId: string): void {
        this.activeChartId = chartId;
        if (this.chartRibbon) {
            const item: IChartLifecycleItem = chartId ? this.lifecycleManager.getChart(chartId) : null;
            const ribbonAny: {
                enableChartTab?: (enable: boolean, theme?: string, type?: string, chartId?: string) => void;
                setActiveChart?: (id: string) => void;
                refreshTheme?: (theme: string) => void;
            } = this.chartRibbon as {
                enableChartTab?: (enable: boolean, theme?: string, type?: string, chartId?: string) => void;
                setActiveChart?: (id: string) => void;
                refreshTheme?: (theme: string) => void;
            };
            if (ribbonAny.setActiveChart) {
                ribbonAny.setActiveChart(chartId);
            }
            if (ribbonAny.enableChartTab) {
                if (item && item.model) {
                    const themeToPass: ChartTheme = (item.model.theme ? item.model.theme : (item.component && (item.component as { theme?: ChartTheme }).theme)) || 'Material';
                    ribbonAny.enableChartTab(true, themeToPass, item.model.type, chartId);
                } else {
                    ribbonAny.enableChartTab(false);
                }
            }
        }
    }

    public getActiveChart(): string {
        return this.activeChartId;
    }

    /**
     * Clears the active chart selection and removes the active styling from the overlay DOM.
     *
     * @returns {void}
     */
    public deselectChart(): void {
        if (this.overlayService) {
            this.overlayService.refreshOverlayElem();
        }
        this.setActiveChart(null);
    }

    /**
     * Dispatches ribbon actions (theme, type, switch row/column, add chart element) on the active chart.
     * Decodes element IDs and updates chart options, models, and JSON automatically.
     *
     * @param {RibbonAction} actionId - The ribbon action or element identifier.
     * @param {string} [value] - Optional associated value (such as custom theme name or chart type).
     * @returns {boolean} True if the action was executed.
     */
    public onRibbonAction(actionId: RibbonAction, value?: string): boolean {
        const chartId: string = this.activeChartId;
        if (!chartId || !actionId) {
            return false;
        }
        const item: IChartLifecycleItem = this.lifecycleManager.getChart(chartId);
        const isAcc: boolean = !!(item && item.model && (item.model.type === 'Pie' || item.model.type === 'Doughnut'));
        if (isAcc && (actionId.startsWith('PH') || actionId.startsWith('PV') || actionId.startsWith('GL') || actionId.startsWith('Gridlines'))) {
            return false;
        }
        if (actionId === 'switchRowColumn') {
            return this.updateChartOptions({ action: 'switchRowColumn' });
        }
        if (actionId === 'theme' || CHART_THEMES.indexOf(actionId as ChartTheme) !== -1) {
            const theme: ChartTheme = (value || actionId) as ChartTheme;
            return this.updateChartOptions({ action: 'theme', theme: theme });
        }
        if (actionId === 'chartType') {
            return this.updateChartOptions({ action: 'chartType', chartType: value });
        }
        // Add chart element mappings
        if (actionId === 'DLNone') {
            return this.updateChartOptions({ action: 'dataLabels', dataLabelPosition: 'None' });
        } else if (actionId === 'DLCenter') {
            return this.updateChartOptions({ action: 'dataLabels', dataLabelPosition: 'Center' });
        } else if (actionId === 'DLInsideend') {
            return this.updateChartOptions({ action: 'dataLabels', dataLabelPosition: 'InsideEnd' });
        } else if (actionId === 'DLInsidebase') {
            return this.updateChartOptions({ action: 'dataLabels', dataLabelPosition: 'InsideBase' });
        } else if (actionId === 'DLOutsideend') {
            return this.updateChartOptions({ action: 'dataLabels', dataLabelPosition: 'OutsideEnd' });
        } else if (actionId === 'LegendNone') {
            return this.updateChartOptions({ action: 'legend', legendPosition: 'None' });
        } else if (actionId === 'LegendsRight') {
            return this.updateChartOptions({ action: 'legend', legendPosition: 'Right' });
        } else if (actionId === 'LegendsLeft') {
            return this.updateChartOptions({ action: 'legend', legendPosition: 'Left' });
        } else if (actionId === 'LegendsBottom') {
            return this.updateChartOptions({ action: 'legend', legendPosition: 'Bottom' });
        } else if (actionId === 'LegendsTop') {
            return this.updateChartOptions({ action: 'legend', legendPosition: 'Top' });
        } else if (actionId === 'GLMajorHorizontal') {
            return this.updateChartOptions({ action: 'gridlines', gridlineType: 'MajorHorizontal' });
        } else if (actionId === 'GLMajorVertical') {
            return this.updateChartOptions({ action: 'gridlines', gridlineType: 'MajorVertical' });
        } else if (actionId === 'GLMinorHorizontal') {
            return this.updateChartOptions({ action: 'gridlines', gridlineType: 'MinorHorizontal' });
        } else if (actionId === 'GLMinorVertical') {
            return this.updateChartOptions({ action: 'gridlines', gridlineType: 'MinorVertical' });
        } else if (actionId === 'ChartTitleNone') {
            return this.updateChartOptions({ action: 'title', title: '' });
        } else if (actionId === 'ChartTitleAbove' || actionId === 'AboveChart') {
            return this.updateChartOptions({ action: 'title', title: !isNullOrUndefined(value) ? value : 'Chart Title' });
        } else if (actionId === 'CenteredOverlay') {
            return this.updateChartOptions({ action: 'title', title: !isNullOrUndefined(value) ? value : 'Chart Title' });
        } else if (actionId === 'PHAxes') {
            return this.updateChartOptions({ action: 'axis', axisType: 'PrimaryHorizontal' });
        } else if (actionId === 'PVAxes') {
            return this.updateChartOptions({ action: 'axis', axisType: 'PrimaryVertical' });
        } else if (actionId === 'PHAxisTitle') {
            return this.updateChartOptions({
                action: 'axisTitle', axisTitleType: 'PrimaryHorizontal', title: !isNullOrUndefined(value) ? value : 'Categories'
            });
        } else if (actionId === 'PVAxisTitle') {
            return this.updateChartOptions({
                action: 'axisTitle', axisTitleType: 'PrimaryVertical', title: !isNullOrUndefined(value) ? value : 'Values'
            });
        }
        return false;
    }

    /**
     * Handles overlay events (select, deselect, resize, move) directly at the source level.
     *
     * @param {'select' | 'deselect' | 'resize' | 'resizeProgress' | 'move'} action - The overlay action.
     * @param {string} overlayId - The overlay identifier.
     * @param {object} [bounds] - Optional coordinates/dimensions.
     * @param {number} [bounds.top] - Top coordinate.
     * @param {number} [bounds.left] - Left coordinate.
     * @param {number} [bounds.width] - Width dimension.
     * @param {number} [bounds.height] - Height dimension.
     * @returns {void}
     */
    public onOverlayAction(
        action: 'select' | 'deselect' | 'resize' | 'resizeProgress' | 'move',
        overlayId?: string,
        bounds?: { top?: number, left?: number, width?: number, height?: number }
    ): void {
        const chartId: string = overlayId ? overlayId.replace(/_overlay$/, '') : this.activeChartId;
        if (action === 'select') {
            this.setActiveChart(chartId);
        } else if (action === 'deselect') {
            if (this.overlayService) {
                this.overlayService.refreshOverlayElem();
            }
            this.setActiveChart(null);
        } else if (action === 'resizeProgress' && chartId && bounds) {
            const item: IChartLifecycleItem = this.lifecycleManager.getChart(chartId);
            if (item && item.component) {
                if (!isNullOrUndefined(bounds.width)) { item.component.width = bounds.width + 'px'; }
                if (!isNullOrUndefined(bounds.height)) { item.component.height = bounds.height + 'px'; }
            }
        } else if ((action === 'resize' || action === 'move') && chartId && bounds) {
            const item: IChartLifecycleItem = this.lifecycleManager.getChart(chartId);
            if (item) {
                const eventArgs: IChartBeforeActionEventArgs = {
                    id: chartId,
                    action: action,
                    options: { action: action, bounds: bounds },
                    cancel: false,
                    chartModel: item.model,
                    chartJson: item.json,
                    chartComponent: item.component
                };
                this.trigger(beforeChartAction, eventArgs);
                if (eventArgs.cancel) {
                    if (item.model) {
                        const overlayElem: HTMLElement = item.overlayElement || document.getElementById(chartId + '_overlay');
                        if (overlayElem) {
                            if (!isNullOrUndefined(item.model.top)) { overlayElem.style.top = item.model.top + 'px'; }
                            if (!isNullOrUndefined(item.model.left)) { overlayElem.style.left = item.model.left + 'px'; }
                            if (!isNullOrUndefined(item.model.width)) { overlayElem.style.width = item.model.width + 'px'; }
                            if (!isNullOrUndefined(item.model.height)) { overlayElem.style.height = item.model.height + 'px'; }
                        }
                        if (item.component) {
                            if (!isNullOrUndefined(item.model.width)) { item.component.width = item.model.width + 'px'; }
                            if (!isNullOrUndefined(item.model.height)) { item.component.height = item.model.height + 'px'; }
                            item.component.refresh();
                        }
                    }
                    return;
                }
                if (item.model) {
                    if (!isNullOrUndefined(bounds.top)) { item.model.top = bounds.top; }
                    if (!isNullOrUndefined(bounds.left)) { item.model.left = bounds.left; }
                    if (!isNullOrUndefined(bounds.width)) { item.model.width = bounds.width; }
                    if (!isNullOrUndefined(bounds.height)) { item.model.height = bounds.height; }
                }
                if (item.json) {
                    const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                    const jsonChart: Record<string, unknown> = item.json as Record<string, unknown>;
                    const wKey: string = widthProperty[parseInt(kw.toString(), 10)];
                    const hKey: string = heightProperty[parseInt(kw.toString(), 10)];
                    if (!isNullOrUndefined(bounds.width)) {
                        jsonChart[`${wKey}`] = Math.round(bounds.width * (72 / 96));
                    }
                    if (!isNullOrUndefined(bounds.height)) {
                        jsonChart[`${hKey}`] = Math.round(bounds.height * (72 / 96));
                    }
                }
                if (action === 'resize' && item.component) {
                    if (!isNullOrUndefined(bounds.width)) { item.component.width = bounds.width + 'px'; }
                    if (!isNullOrUndefined(bounds.height)) { item.component.height = bounds.height + 'px'; }
                    item.component.refresh();
                }
                const afterArgs: IChartAfterActionEventArgs = {
                    id: chartId,
                    action: action,
                    options: { action: action, bounds: bounds },
                    chartModel: item.model,
                    chartJson: item.json,
                    chartComponent: item.component
                };
                this.trigger(chartUpdated, {
                    chartId: chartId,
                    properties: {
                        top: bounds.top,
                        left: bounds.left,
                        width: bounds.width,
                        height: bounds.height
                    } as Partial<ChartModel>
                });
                this.trigger(afterChartAction, afterArgs);
            }
        }
    }

    public getChartRenderer(): ChartRenderer {
        return this.chartRenderer;
    }

    /**
     * Resolves ChartType and marker visibility from a ribbon / toolbar action ID.
     *
     * @param {string} id - Action identifier.
     * @returns {object} Resulting chart type and marker visibility.
     */
    public static getChartTypeFromId(id: string): { chartType: string, markerVisible: boolean, officeChartType: string } {
        let chartType: string = 'Column';
        let markerVisible: boolean = false;
        let officeChartType: string = 'Column_Clustered';
        switch (id) {
        case 'clusteredColumn':
            chartType = 'Column';
            officeChartType = 'Column_Clustered';
            break;
        case 'stackedColumn':
            chartType = 'StackingColumn';
            officeChartType = 'Column_Stacked';
            break;
        case 'stackedColumn100':
            chartType = 'StackingColumn100';
            officeChartType = 'Column_Stacked_100';
            break;
        case 'clusteredBar':
            chartType = 'Bar';
            officeChartType = 'Bar_Clustered';
            break;
        case 'stackedBar':
            chartType = 'StackingBar';
            officeChartType = 'Bar_Stacked';
            break;
        case 'stackedBar100':
            chartType = 'StackingBar100';
            officeChartType = 'Bar_Stacked_100';
            break;
        case 'area':
            chartType = 'Area';
            officeChartType = 'Area';
            break;
        case 'stackedArea':
            chartType = 'StackingArea';
            officeChartType = 'Area_Stacked';
            break;
        case 'stackedArea100':
            chartType = 'StackingArea100';
            officeChartType = 'Area_Stacked_100';
            break;
        case 'line':
            chartType = 'Line';
            officeChartType = 'Line';
            break;
        case 'lineMarker':
            chartType = 'Line';
            markerVisible = true;
            officeChartType = 'Line_Markers';
            break;
        case 'stackedLine':
            chartType = 'StackingLine';
            officeChartType = 'Line_Stacked';
            break;
        case 'stackedLineMarker':
            chartType = 'StackingLine';
            markerVisible = true;
            officeChartType = 'Line_Markers_Stacked';
            break;
        case 'stackedLine100':
            chartType = 'StackingLine100';
            officeChartType = 'Line_Stacked_100';
            break;
        case 'stackedLine100Marker':
            chartType = 'StackingLine100';
            markerVisible = true;
            officeChartType = 'Line_Markers_Stacked_100';
            break;
        case 'pie':
        case 'Pie':
            chartType = 'Pie';
            officeChartType = 'Pie';
            break;
        case 'doughnut':
        case 'Doughnut':
            chartType = 'Doughnut';
            officeChartType = 'Doughnut';
            break;
        case 'scatter':
        case 'Scatter':
        case 'scatterMarkers':
            chartType = 'Scatter';
            officeChartType = 'Scatter_Markers';
            break;
        case 'bubble':
        case 'Bubble':
            chartType = 'Bubble';
            officeChartType = 'Bubble';
            break;
        case 'Column':
            chartType = 'Column';
            officeChartType = 'Column_Clustered';
            break;
        case 'StackingColumn':
            chartType = 'StackingColumn';
            officeChartType = 'Column_Stacked';
            break;
        case 'StackingColumn100':
            chartType = 'StackingColumn100';
            officeChartType = 'Column_Stacked_100';
            break;
        case 'Bar':
            chartType = 'Bar';
            officeChartType = 'Bar_Clustered';
            break;
        case 'StackingBar':
            chartType = 'StackingBar';
            officeChartType = 'Bar_Stacked';
            break;
        case 'StackingBar100':
            chartType = 'StackingBar100';
            officeChartType = 'Bar_Stacked_100';
            break;
        case 'Area':
            chartType = 'Area';
            officeChartType = 'Area';
            break;
        case 'StackingArea':
            chartType = 'StackingArea';
            officeChartType = 'Area_Stacked';
            break;
        case 'StackingArea100':
            chartType = 'StackingArea100';
            officeChartType = 'Area_Stacked_100';
            break;
        case 'Line':
            chartType = 'Line';
            officeChartType = 'Line';
            break;
        case 'StackingLine':
            chartType = 'StackingLine';
            officeChartType = 'Line_Stacked';
            break;
        case 'StackingLine100':
            chartType = 'StackingLine100';
            officeChartType = 'Line_Stacked_100';
            break;
        default:
            chartType = 'Column';
            officeChartType = 'Column_Clustered';
            break;
        }
        return { chartType: chartType, markerVisible: markerVisible, officeChartType: officeChartType };
    }

    /**
     * Gets the background color for a theme.
     *
     * @param {string} theme - Target theme.
     * @returns {string} Theme background color string.
     */
    public getThemeBgColor(theme: string): string {
        return getThemeBgColor(theme);
    }

    /**
     * Renders a chart component directly with given model and pre-built series using a fresh ChartRenderer.
     * Does NOT register in lifecycleManager and does NOT mutate this.chartRenderer.
     *
     * @param {ChartModel} model - Chart model.
     * @param {OfficeSeriesModel[]} series - Pre-built series list.
     * @param {HTMLElement} container - DOM container.
     * @param {IChartRenderOptions} [options] - Additional render options.
     * @returns {Chart | AccumulationChart} Rendered chart instance.
     */
    public renderWithSeries(
        model: ChartModel, series: OfficeSeriesModel[], container: HTMLElement, options?: IChartRenderOptions
    ): Chart | AccumulationChart {
        return new ChartRenderer().render(model, series, container, options);
    }

    /**
     * Creates and renders an office chart supporting two input types:
     * 1. Direct series data provided in ChartModel (e.g. from Spreadsheet cell ranges)
     * 2. Raw JSON data parsed with JsonSeriesProcessor (e.g. from DocIO / OpenXML JSON)
     *
     * @param {ChartModel | any} chartData - Chart data (ChartModel with series OR raw JSON data).
     * @param {HTMLElement} [container] - Target container element to render into.
     * @param {ChartOptions} [options] - Creation options (top, left, width, height, enableOverlay, isSpreadsheet, id).
     * @returns {Chart | AccumulationChart} Rendered chart component instance.
     */
    public createChart(
        chartData: ChartModel | object | string, container?: HTMLElement, options?: ChartOptions
    ): Chart | AccumulationChart {
        const target: HTMLElement = container || (this.overlayHost ? this.overlayHost.getParentElement() : document.body);
        const opt: ChartOptions = options || {};
        const hasSeries: boolean = Boolean(
            chartData && typeof chartData === 'object' && (chartData as ChartModel).series
        );
        const isSpreadsheet: boolean = Boolean(opt.isSpreadsheet || hasSeries);
        const isJson: boolean = !isSpreadsheet;
        let parsedChartData: object | string = chartData;
        let jsonData: object = null;
        if (typeof chartData === 'string') {
            try {
                parsedChartData = JSON.parse(chartData);
                jsonData = parsedChartData as object;
            } catch (e) {
                parsedChartData = {};
                jsonData = {};
            }
        } else if (isJson) {
            jsonData = (parsedChartData || {}) as object;
        }
        let chartModel: ChartModel;
        let series: OfficeSeriesModel[] = [];
        let renderOptions: IChartRenderOptions = {};
        let chartId: string;
        let top: number;
        let left: number;
        let widthNum: number;
        let heightNum: number;
        if (isJson) {
            const keywordIndex: number = !isNullOrUndefined(opt.keywordIndex) ? opt.keywordIndex : 0;
            const processor: JsonSeriesProcessor = new JsonSeriesProcessor();
            const result: JsonChartProcessResult = processor.process(jsonData, keywordIndex);
            const parsedModel: ChartModel = (parsedChartData && typeof parsedChartData === 'object') ? parsedChartData as ChartModel : null;
            chartId = opt.id || (parsedModel && parsedModel.id) || getUniqueID('chart');
            top = !isNullOrUndefined(opt.top) ? opt.top : (!isNullOrUndefined(parsedModel && parsedModel.top) ? parsedModel.top : 0);
            left = !isNullOrUndefined(opt.left) ? opt.left : (!isNullOrUndefined(parsedModel && parsedModel.left) ? parsedModel.left : 0);
            widthNum = !isNullOrUndefined(opt.width) ? opt.width : parseFloat(String(result.model.width));
            heightNum = !isNullOrUndefined(opt.height) ? opt.height : parseFloat(String(result.model.height));
            const mappedType: ChartType = processor.mapOfficeChartType(result.chartType);
            chartModel = {
                id: chartId,
                top: top,
                left: left,
                width: widthNum,
                height: heightNum,
                type: result.chartType === 'Doughnut' ? 'Doughnut' : mappedType,
                title: result.title,
                legendSettings: result.legendSettings,
                primaryXAxis: result.primaryXAxis,
                primaryYAxis: result.primaryYAxis,
                series: result.series
            };
            series = result.series;
            renderOptions = {
                primaryXAxis: result.primaryXAxis,
                primaryYAxis: result.primaryYAxis,
                legendSettings: result.legendSettings
            };
        } else {
            let chartDataModel: ChartModel = {};
            if (parsedChartData && typeof parsedChartData === 'object') {
                chartDataModel = parsedChartData as ChartModel;
            }
            chartId = chartDataModel.id || opt.id || getUniqueID('chart');
            top = !isNullOrUndefined(opt.top) ? opt.top : (!isNullOrUndefined(chartDataModel.top) ? chartDataModel.top : 0);
            left = !isNullOrUndefined(opt.left) ? opt.left : (!isNullOrUndefined(chartDataModel.left) ? chartDataModel.left : 0);
            widthNum = !isNullOrUndefined(opt.width) ? opt.width :
                (!isNullOrUndefined(chartDataModel.width) ? chartDataModel.width : 400);
            heightNum = !isNullOrUndefined(opt.height) ? opt.height :
                (!isNullOrUndefined(chartDataModel.height) ? chartDataModel.height : 300);
            chartModel = chartDataModel;
            chartModel.id = chartId;
            chartModel.top = top;
            chartModel.left = left;
            chartModel.width = widthNum;
            chartModel.height = heightNum;
            if (opt.isSpreadsheet) {
                series = chartModel.series as OfficeSeriesModel[];
            } else {
                const seriesResult: ISeriesProcessResult = new SeriesProcessor().process(chartModel);
                series = seriesResult.series;
            }
            renderOptions = {
                primaryXAxis: chartModel.primaryXAxis,
                primaryYAxis: chartModel.primaryYAxis,
                legendSettings: chartModel.legendSettings
            };
        }
        if (opt.renderOptions) {
            extend(renderOptions, opt.renderOptions);
        }
        const eventArgs: IChartBeforeActionEventArgs = {
            id: chartId,
            action: 'create',
            options: { action: 'create', value: chartId },
            cancel: false,
            chartModel: chartModel,
            chartJson: jsonData
        };
        this.trigger(beforeChartAction, eventArgs);
        if (eventArgs.cancel) {
            return null;
        }
        let overlayDiv: HTMLElement;
        const oldItem: IChartLifecycleItem = this.lifecycleManager ? this.lifecycleManager.getChart(chartId) : null;
        if (oldItem) {
            if (oldItem.component) {
                oldItem.component.destroy();
            }
            if (this.overlayService && opt.enableOverlay) {
                this.overlayService.destroyOverlay(this.overlayHost, chartId);
            }
            if (oldItem.overlayElement && oldItem.overlayElement.isConnected && opt.enableOverlay) {
                oldItem.overlayElement.remove();
            }
            this.lifecycleManager.unregisterChart(chartId);
        }
        const enableOverlay: boolean = !isNullOrUndefined(opt.enableOverlay) ? opt.enableOverlay : false;
        let chartContainer: HTMLElement;
        if (enableOverlay) {
            const isTargetChanged: boolean = !this.defaultOverlayHost ||
                (this.defaultOverlayHost as DefaultOverlayHost).getRootElement() !== target;
            if (!this.overlayHost && isTargetChanged) {
                const oldDefaultHost: DefaultOverlayHost = this.defaultOverlayHost;
                this.defaultOverlayHost = new DefaultOverlayHost(target);
                this.overlayService.setHost(this.defaultOverlayHost);
                if (oldDefaultHost) {
                    oldDefaultHost.destroy();
                }
            } else {
                const host: IOverlayHost = this.overlayHost || this.defaultOverlayHost;
                this.overlayService.setHost(host);
            }
            overlayDiv = this.overlayService.createOverlayElement(
                chartId + '_overlay', true, target,
                { top: top, left: left, width: widthNum, height: heightNum }
            );
            overlayDiv.classList.add('e-datavisualization-chart');
            chartContainer = document.createElement('div');
            chartContainer.id = chartId;
            chartContainer.style.width = '100%';
            chartContainer.style.height = '100%';
            overlayDiv.appendChild(chartContainer);
            this.overlayService.renderResizeHandler(overlayDiv, 4);
            this.overlayService.addEventListener(overlayDiv);
            renderOptions.width = '100%';
            renderOptions.height = '100%';
        } else {
            if (target && target.id === chartId) {
                chartContainer = target;
            } else {
                chartContainer = document.createElement('div');
                chartContainer.id = chartId;
                chartContainer.style.position = 'absolute';
                chartContainer.style.top = top + 'px';
                chartContainer.style.left = left + 'px';
                chartContainer.style.width = widthNum + 'px';
                chartContainer.style.height = heightNum + 'px';
                target.appendChild(chartContainer);
            }
        }
        const renderer: ChartRenderer = new ChartRenderer();
        const chartComp: Chart | AccumulationChart = renderer.render(chartModel, series, chartContainer, renderOptions);
        const kwIndex: number = isJson ? (!isNullOrUndefined(opt.keywordIndex) ? opt.keywordIndex : 0) : undefined;
        this.lifecycleManager.registerChart(chartId, chartModel, chartComp, overlayDiv, jsonData, kwIndex);
        this.trigger(chartCreated, { chart: chartModel });
        this.setActiveChart(chartId);
        const completeEventArgs: IChartAfterActionEventArgs = {
            id: chartId,
            action: 'create',
            options: { action: 'create', value: chartId },
            chartComponent: chartComp
        };
        if (isJson && jsonData) {
            completeEventArgs.chartJson = jsonData;
        } else if (chartModel) {
            completeEventArgs.chartModel = chartModel;
        }
        this.trigger(afterChartAction, completeEventArgs);
        return chartComp;
    }

    /**
     * Registers an externally rendered chart into ChartManager's lifecycle.
     *
     * @param {string} id - Chart identifier.
     * @param {ChartModel} model - Chart model instance.
     * @param {Chart | AccumulationChart} comp - Rendered chart component.
     * @param {HTMLElement} [overlayEl] - Optional overlay container element.
     * @param {Object} [json] - Optional OpenXML JSON definition.
     * @param {number} [kwIndex] - Optional keyword index.
     * @returns {void}
     */
    public registerChart(
        id: string, model: ChartModel, comp: Chart | AccumulationChart,
        overlayEl?: HTMLElement, json?: Record<string, unknown>, kwIndex?: number
    ): void {
        this.lifecycleManager.registerChart(id, model, comp, overlayEl, json, kwIndex);
    }

    /**
     * Unregisters a chart from ChartManager's lifecycle.
     *
     * @param {string} id - Chart identifier.
     * @returns {void}
     */
    public unregisterChart(id: string): void {
        this.lifecycleManager.unregisterChart(id);
    }

    /**
     * Updates an existing chart with new properties.
     *
     * @param {string} id - Chart identifier.
     * @param {Partial<ChartModel>} properties - New chart properties.
     * @returns {void}
     */
    public updateChart(id: string, properties: Partial<ChartModel>): void {
        const item: IChartLifecycleItem = this.lifecycleManager.getChart(id);
        if (!item || !properties) {
            return;
        }
        const prevType: string = item.model ? item.model.type : undefined;
        const prevTheme: string = item.model ? item.model.theme : undefined;
        const remainingProps: Partial<ChartModel> = Object.assign({}, properties);
        delete remainingProps.type;
        delete remainingProps.theme;
        delete remainingProps.series;
        delete remainingProps.primaryXAxis;
        delete remainingProps.primaryYAxis;
        Object.assign(item.model, remainingProps);
        let needRefresh: boolean = false;
        if (!isNullOrUndefined(remainingProps.title)) {
            if (item.component) {
                item.component.title = remainingProps.title;
                needRefresh = true;
            }
        }
        if (!isNullOrUndefined(remainingProps.legendSettings)) {
            if (item.component && item.component.legendSettings) {
                Object.assign(item.component.legendSettings, remainingProps.legendSettings);
                needRefresh = true;
            }
        }
        if (!isNullOrUndefined(remainingProps.width) || !isNullOrUndefined(remainingProps.height)) {
            if (item.component) {
                if (!isNullOrUndefined(remainingProps.width)) { item.component.width = remainingProps.width.toString() + 'px'; }
                if (!isNullOrUndefined(remainingProps.height)) { item.component.height = remainingProps.height.toString() + 'px'; }
                needRefresh = true;
            }
            if (item.overlayElement) {
                if (!isNullOrUndefined(remainingProps.width)) { item.overlayElement.style.width = remainingProps.width.toString() + 'px'; }
                if (!isNullOrUndefined(remainingProps.height)) { item.overlayElement.style.height = remainingProps.height.toString() + 'px'; }
            }
        }
        if (item.overlayElement) {
            if (!isNullOrUndefined(remainingProps.top)) { item.overlayElement.style.top = remainingProps.top.toString() + 'px'; }
            if (!isNullOrUndefined(remainingProps.left)) { item.overlayElement.style.left = remainingProps.left.toString() + 'px'; }
        }
        let handledByOptions: boolean = false;
        if (properties.type && properties.type !== prevType) {
            this.updateChartOptions({
                action: 'chartType', chartType: properties.type,
                markerVisible: properties.markerSettings ? properties.markerSettings.visible : undefined
            }, id);
            handledByOptions = true;
        }
        if (properties.theme && properties.theme !== prevTheme) {
            this.updateChartOptions({ action: 'theme', theme: properties.theme }, id);
            handledByOptions = true;
        }
        if (needRefresh && item.component && item.component.refresh) {
            item.component.refresh();
        }
        if (!handledByOptions) {
            this.trigger(chartUpdated, { chartId: id, properties: properties });
        }
    }

    /**
     * Destroys the chart component and detaches overlay element.
     *
     * @param {HTMLElement} chartOverlayEle - Overlay wrapper element.
     * @param {string} chartId - Chart identifier.
     * @param {string} overlayId - Overlay identifier.
     * @returns {void}
     */
    public destroyChartElement(chartOverlayEle: HTMLElement, chartId: string, overlayId: string): void {
        if (chartOverlayEle) {
            const chartEle: HTMLElement = chartOverlayEle.querySelector(`#${chartId}`);
            if (chartEle) {
                const chartObject: Chart = getComponent(chartEle, 'chart') || getComponent(chartEle, 'accumulationchart');
                if (chartObject) {
                    chartObject.destroy();
                }
            }
        }
        const overlayDom: HTMLElement = document.getElementById(overlayId);
        if (overlayDom) {
            overlayDom.remove();
        }
    }

    /**
     * Handles switching theme and updating background colors.
     *
     * @param {ChartModel} chart - Specifies the chart model.
     * @param {ChartTheme} theme - Specifies the theme to switch to.
     * @param {Chart | AccumulationChart} chartComp - Specifies the chart component instance.
     * @returns {void}
     */
    public switchChartTheme(chart: ChartModel, theme: ChartTheme, chartComp: Chart | AccumulationChart): void {
        chart.theme = theme;
        const bg: string = getThemeBgColor(theme);
        if (chartComp && chartComp.setProperties) {
            chartComp.setProperties({ theme: theme, background: bg }, true);
        } else if (chartComp) {
            chartComp.theme = theme;
            chartComp.background = bg;
        }
        if (chartComp && chartComp.refresh) {
            chartComp.refresh();
        }
    }

    /**
     * Maps element actions for bar charts where axes/gridlines swap horizontally and vertically.
     *
     * @param {string} value - Action value to map.
     * @returns {string} Mapped action string.
     */
    public mapBarChartElement(value: string): string {
        const axisMapping: Map<string, string> = new Map<string, string>([
            ['PHAxes', 'PVAxes'],
            ['PVAxes', 'PHAxes'],
            ['PHAxisTitle', 'PVAxisTitle'],
            ['PVAxisTitle', 'PHAxisTitle'],
            ['GLMajorHorizontal', 'GLMajorVertical'],
            ['GLMajorVertical', 'GLMajorHorizontal'],
            ['GLMinorHorizontal', 'GLMinorVertical'],
            ['GLMinorVertical', 'GLMinorHorizontal']
        ]);
        const mappedValue: string = axisMapping.get(value);
        return mappedValue || value;
    }

    /**
     * Switches chart type with exact Cartesian vs Accumulation transition logic.
     *
     * @param {ChartModel} chart - Chart model.
     * @param {string} chartType - Target chart type.
     * @param {Chart | AccumulationChart} chartComp - Chart component instance.
     * @param {boolean} [markerVisible] - Whether markers should be visible.
     * @param {boolean} [enableMarker] - Whether markers are enabled in undo-redo.
     * @param {string} [action] - Triggering action name.
     * @returns {object} Object indicating if chart recreation is needed.
     */
    public switchChartType(
        chart: ChartModel, chartType: ChartType, chartComp: Chart | AccumulationChart,
        markerVisible?: boolean, enableMarker?: boolean, action?: string
    ): { needRecreate: boolean } {
        const type: string = chart.type;
        const isLineChart: boolean = chartType === 'Line' || chartType === 'StackingLine' || chartType === 'StackingLine100';
        if (type === 'Scatter' && isLineChart) {
            chart.type = chartType;
            const existingMarkerSettings: { shape?: ChartShape; visible?: boolean; isFilled?: boolean } =
                !isNullOrUndefined(chart.markerSettings) ? chart.markerSettings : {};
            chart.markerSettings = {
                shape: !isNullOrUndefined(existingMarkerSettings.shape) ? existingMarkerSettings.shape : 'Circle',
                visible: !isNullOrUndefined(markerVisible) ? markerVisible :
                    (!isNullOrUndefined(existingMarkerSettings.visible) ? existingMarkerSettings.visible : true),
                isFilled: !isNullOrUndefined(existingMarkerSettings.isFilled) ? existingMarkerSettings.isFilled : false
            };
            return { needRecreate: true };
        }
        const isFromAccumulation: boolean = type === 'Pie' || type === 'Doughnut';
        const isToAccumulation: boolean = chartType === 'Pie' || chartType === 'Doughnut';
        chart.type = chartType;
        if (!isToAccumulation) {
            if (isFromAccumulation) {
                if (!isNullOrUndefined(chart.markerSettings)) {
                    if (markerVisible) {
                        chart.markerSettings.visible = markerVisible;
                    } else if (action === 'undoRedo') {
                        chart.markerSettings.visible = enableMarker;
                    } else {
                        chart.markerSettings.visible = false;
                    }
                } else if (markerVisible && isLineChart) {
                    chart.markerSettings = { shape: 'Circle', visible: true, isFilled: false };
                }
                return { needRecreate: true };
            } else {
                if (chartComp) {
                    if (type !== chartType && (chartComp as Chart).primaryXAxis) {
                        if (chartType === 'Scatter') {
                            const labels: string[] = (chartComp as Chart).primaryXAxis['labels'];
                            const lastLabel: string = labels && labels.length > 0 ? labels[labels.length - 1] : '';
                            if (lastLabel !== '' && isFinite(Number(lastLabel))) {
                                (chartComp as Chart).primaryXAxis.valueType = 'Double';
                            }
                        } else if ((chartComp as Chart).primaryXAxis.valueType === 'Double') {
                            (chartComp as Chart).primaryXAxis.valueType = 'Category';
                            if ((chartComp as Chart).primaryXAxis.minimum) {
                                (chartComp as Chart).primaryXAxis.minimum = null;
                            }
                            if ((chartComp as Chart).primaryXAxis.maximum) {
                                (chartComp as Chart).primaryXAxis.maximum = null;
                            }
                        }
                    }
                    const chartSeries: ChartSeriesModel[] = (!isNullOrUndefined((chartComp as Chart).series) ?
                        (chartComp as Chart).series : []) as ChartSeriesModel[];
                    for (let idx: number = 0, len: number = chartSeries.length; idx < len; idx++) {
                        chartSeries[idx as number].type = chartType as ChartSeriesType;
                        if (isNullOrUndefined(chartSeries[idx as number].marker)) {
                            chartSeries[idx as number].marker = {};
                        }
                        if (isLineChart) {
                            chartSeries[idx as number].marker.visible = markerVisible;
                            chartSeries[idx as number].marker.shape = isNullOrUndefined(chartSeries[idx as number].marker.shape) ? 'Circle' : chartSeries[idx as number].marker.shape;
                            if (action === 'undoRedo') {
                                chartSeries[idx as number].marker.visible = enableMarker;
                            }
                        } else {
                            chartSeries[idx as number].marker.visible = false;
                        }
                    }
                    (chartComp as Chart).series = chartSeries;
                    const is100Stacked: boolean = (chartType && chartType.indexOf('100') !== -1);
                    const was100Stacked: boolean = (type && type.indexOf('100') !== -1);
                    if ((chartComp as Chart).primaryYAxis) {
                        if (is100Stacked) {
                            if (!(chartComp as Chart).primaryYAxis.interval || (chartComp as Chart).primaryYAxis.interval < 10) {
                                (chartComp as Chart).primaryYAxis.interval = 10;
                            }
                        } else if (was100Stacked && (chartComp as Chart).primaryYAxis.interval === 10) {
                            delete (chartComp as Chart).primaryYAxis.interval;
                        }
                    }
                    if (chart && chart.primaryYAxis) {
                        if (is100Stacked) {
                            if (!chart.primaryYAxis.interval || chart.primaryYAxis.interval < 10) {
                                chart.primaryYAxis.interval = 10;
                            }
                        } else if (was100Stacked && chart.primaryYAxis.interval === 10) {
                            delete chart.primaryYAxis.interval;
                        }
                    }
                    const dataBindableComp: { dataBind?: () => void } = chartComp as { dataBind?: () => void };
                    if (!isNullOrUndefined(dataBindableComp.dataBind)) {
                        dataBindableComp.dataBind();
                    }
                    if (!isNullOrUndefined(chartComp.refresh)) {
                        chartComp.refresh();
                    }
                }
                if (chart && chart.series && Array.isArray(chart.series)) {
                    for (let idx: number = 0, len: number = chart.series.length; idx < len; idx++) {
                        const sModel: ChartSeriesModel = chart.series[idx as number] as ChartSeriesModel;
                        sModel.type = chartType as ChartSeriesType;
                        if (isLineChart && markerVisible) {
                            if (!sModel.marker) {
                                sModel.marker = { shape: 'Circle', visible: true, isFilled: false };
                            } else {
                                sModel.marker.visible = true;
                            }
                        } else if (!isLineChart && sModel.marker) {
                            sModel.marker.visible = false;
                        }
                    }
                }
                if (chart) {
                    if (isLineChart) {
                        if (!isNullOrUndefined(chart.markerSettings)) {
                            chart.markerSettings.visible = markerVisible;
                        } else if (markerVisible) {
                            chart.markerSettings = { shape: 'Circle', visible: true, isFilled: false };
                        }
                    } else if (!isNullOrUndefined(chart.markerSettings)) {
                        chart.markerSettings.visible = false;
                    }
                }
                return { needRecreate: false };
            }
        } else {
            if (isFromAccumulation) {
                if (chartComp) {
                    const chartSeries: AccumulationSeriesModel[] = (chartComp as AccumulationChart).series as AccumulationSeriesModel[];
                    if (chartSeries && Array.isArray(chartSeries)) {
                        for (let idx: number = 0, len: number = chartSeries.length; idx < len; idx++) {
                            chartSeries[idx as number].innerRadius = chartType === 'Pie' ? '0%' : '40%';
                        }
                        chartComp.series = chartSeries;
                    }
                    if (!isNullOrUndefined(chartComp.refresh)) {
                        chartComp.refresh();
                    }
                }
                return { needRecreate: false };
            } else {
                return { needRecreate: true };
            }
        }
    }

    /**
     * Updates chart sub-elements (axes, titles, data labels, gridlines, legends) matching Spreadsheet line-for-line.
     *
     * @param {string} value - Action or element identifier.
     * @param {Chart | AccumulationChart} chartComp - Chart component instance.
     * @param {string} title - Chart or axis title text.
     * @param {string} [pXAxisLabelSize] - Primary X axis label font size.
     * @param {string} [pYAxisLabelSize] - Primary Y axis label font size.
     * @param {boolean} [isAccumulationChart] - Whether target is an AccumulationChart.
     * @param {boolean} [isBarChart] - Whether target is a Bar chart.
     * @param {boolean} [skipBarMapping] - Whether to skip horizontal/vertical axis remapping.
     * @param {string} [chartId] - Optional chart identifier.
     * @returns {void}
     */
    public updateChartElement(
        value: string, chartComp: Chart | AccumulationChart, title?: string,
        pXAxisLabelSize?: string, pYAxisLabelSize?: string, isAccumulationChart?: boolean, isBarChart?: boolean,
        skipBarMapping?: boolean, chartId?: string
    ): void {
        if (!chartComp) {
            return;
        }
        let chartSeries: ChartSeriesModel[] | AccumulationSeriesModel[];
        if (isBarChart && !skipBarMapping) {
            value = this.mapBarChartElement(value);
        }
        // If chart is an AccumulationChart (Pie/Doughnut), ignore Cartesian-only axis and gridline actions to prevent measureAxis null error
        if (isAccumulationChart &&
                ['PHAxes', 'PVAxes', 'PHAxisTitle', 'PVAxisTitle', 'GLMajorHorizontal',
                    'GLMajorVertical', 'GLMinorHorizontal', 'GLMinorVertical'].indexOf(value) > -1) {
            return;
        }
        const cartesianChart: Chart = !isAccumulationChart ? (chartComp as Chart) : null;
        if (cartesianChart) {
            if (!cartesianChart.primaryXAxis) {
                cartesianChart.primaryXAxis = {};
            }
            if (!cartesianChart.primaryYAxis) {
                cartesianChart.primaryYAxis = {};
            }
        }
        switch (value) {
        case 'PHAxes':
            if (cartesianChart) {
                if (!cartesianChart.primaryXAxis.labelStyle) {
                    cartesianChart.primaryXAxis.labelStyle = {};
                }
                if (!cartesianChart.primaryXAxis.majorTickLines) {
                    cartesianChart.primaryXAxis.majorTickLines = {};
                }
                if (cartesianChart.primaryXAxis.labelStyle.size === '0px') {
                    cartesianChart.primaryXAxis.labelStyle.size = pXAxisLabelSize || '12px';
                    cartesianChart.primaryXAxis.majorTickLines.width = 1;
                } else {
                    cartesianChart.primaryXAxis.labelStyle.size = '0px';
                    cartesianChart.primaryXAxis.majorTickLines.width = 0;
                }
            }
            break;
        case 'PVAxes':
            if (cartesianChart) {
                if (!cartesianChart.primaryYAxis.labelStyle) {
                    cartesianChart.primaryYAxis.labelStyle = {};
                }
                if (!cartesianChart.primaryYAxis.majorTickLines) {
                    cartesianChart.primaryYAxis.majorTickLines = {};
                }
                if (cartesianChart.primaryYAxis.labelStyle.size === '0px') {
                    cartesianChart.primaryYAxis.labelStyle.size = pYAxisLabelSize || '12px';
                    cartesianChart.primaryYAxis.majorTickLines.width = 1;
                } else {
                    cartesianChart.primaryYAxis.labelStyle.size = '0px';
                    cartesianChart.primaryYAxis.majorTickLines.width = 0;
                }
            }
            break;
        case 'PHAxisTitle':
            if (cartesianChart) {
                cartesianChart.primaryXAxis.title = title;
            }
            break;
        case 'PVAxisTitle':
            if (cartesianChart) {
                cartesianChart.primaryYAxis.title = title;
            }
            break;
        case 'ChartTitleNone':
            chartComp.title = '';
            break;
        case 'ChartTitleAbove':
            chartComp.title = title || '';
            break;
        case 'DLNone':
        case 'DLCenter':
        case 'DLInsideend':
        case 'DLInsideEnd':
        case 'DLInsidebase':
        case 'DLInsideBase':
        case 'DLOutsideend':
        case 'DLOutsideEnd':
            chartSeries = chartComp.series;
            if (chartSeries && chartSeries.length) {
                if (value === 'DLNone') {
                    for (let idx: number = 0, len: number = chartSeries.length; idx < len; idx++) {
                        if (isAccumulationChart) {
                            (chartSeries as AccumulationSeriesModel)[idx as number].dataLabel.visible = false;
                        } else {
                            if (!(chartSeries[idx as number] as ChartSeriesModel).marker) {
                                (chartSeries[idx as number] as ChartSeriesModel).marker = { dataLabel: {} };
                            }
                            (chartSeries[idx as number] as ChartSeriesModel).marker.dataLabel.visible = false;
                        }
                    }
                } else {
                    for (let idx: number = 0, len: number = chartSeries.length; idx < len; idx++) {
                        if (isAccumulationChart) {
                            const position: AccumulationLabelPosition = (value === 'DLOutsideend' || value === 'DLOutsideEnd') ? 'Outside' : 'Inside';
                            (chartSeries as AccumulationSeriesModel)[idx as number].dataLabel.visible = true;
                            (chartSeries as AccumulationSeriesModel)[idx as number].dataLabel.position = position;
                        } else {
                            if (!(chartSeries[idx as number] as ChartSeriesModel).marker) {
                                (chartSeries[idx as number] as ChartSeriesModel).marker = { dataLabel: {} };
                            }
                            let position: LabelPosition;
                            if (value === 'DLCenter') {
                                position = 'Middle';
                            } else if (value === 'DLInsideend' || value === 'DLInsideEnd') {
                                position = 'Top';
                            } else if (value === 'DLInsidebase' || value === 'DLInsideBase') {
                                position = 'Bottom';
                            } else if (value === 'DLOutsideend' || value === 'DLOutsideEnd') {
                                position = 'Outer';
                            } else {
                                position = (chartSeries[0] as ChartSeriesModel).marker.dataLabel.position;
                            }
                            (chartSeries[idx as number] as ChartSeriesModel).marker.dataLabel.visible = true;
                            (chartSeries[idx as number] as ChartSeriesModel).marker.dataLabel.position = position;
                            (chartSeries[idx as number] as ChartSeriesModel).marker.dataLabel.labelIntersectAction = 'None';
                        }
                    }
                }
                if (isAccumulationChart) {
                    (chartComp as AccumulationChart).series = chartSeries as AccumulationSeriesModel[];
                } else {
                    (chartComp as Chart).series = chartSeries as ChartSeriesModel[];
                }
                const targetId: string = chartId || (this.getActiveChart ? this.getActiveChart() : null) || this.activeChartId;
                const activeItem: IChartLifecycleItem = targetId ? this.lifecycleManager.getChart(targetId) : null;
                if (activeItem && activeItem.model) {
                    // Persist data label settings into model.dataLabelSettings matching Spreadsheet's chart.ts
                    if (!activeItem.model.dataLabelSettings) {
                        activeItem.model.dataLabelSettings = {};
                    }
                    if (value === 'DLNone') {
                        activeItem.model.dataLabelSettings.visible = false;
                    } else {
                        activeItem.model.dataLabelSettings.visible = true;
                        let pos: string = 'Middle';
                        if (value === 'DLCenter') {
                            pos = isAccumulationChart ? 'Middle' : 'Middle';
                        } else if (value === 'DLInsideend' || value === 'DLInsideEnd') {
                            pos = isAccumulationChart ? 'Middle' : 'Top';
                        } else if (value === 'DLInsidebase' || value === 'DLInsideBase') {
                            pos = isAccumulationChart ? 'Middle' : 'Bottom';
                        } else if (value === 'DLOutsideend' || value === 'DLOutsideEnd') {
                            pos = isAccumulationChart ? 'Outer' : 'Outer';
                        }
                        activeItem.model.dataLabelSettings.position = pos as LabelPosition;
                    }
                    if (activeItem.model.series) {
                        const modelSeries: ChartSeriesModel[] = activeItem.model.series as ChartSeriesModel[];
                        for (let sIdx: number = 0; sIdx < modelSeries.length; sIdx++) {
                            const curM: ChartSeriesModel = modelSeries[sIdx as number];
                            if (curM) {
                                if (!curM.marker) {
                                    curM.marker = {};
                                }
                                if (!curM.marker.dataLabel) {
                                    curM.marker.dataLabel = {};
                                }
                                curM.marker.dataLabel.visible = activeItem.model.dataLabelSettings.visible;
                                if (activeItem.model.dataLabelSettings.visible) {
                                    curM.marker.dataLabel.position = activeItem.model.dataLabelSettings.position as LabelPosition;
                                    curM.marker.dataLabel.labelIntersectAction = 'None';
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 'GLMajorHorizontal':
            if (cartesianChart) {
                if (!cartesianChart.primaryYAxis.majorGridLines) {
                    cartesianChart.primaryYAxis.majorGridLines = { width: 0 };
                }
                cartesianChart.primaryYAxis.majorGridLines.width = cartesianChart.primaryYAxis.majorGridLines.width === 0 ? 1 : 0;
            }
            break;
        case 'GLMajorVertical':
            if (cartesianChart) {
                if (!cartesianChart.primaryXAxis.majorGridLines) {
                    cartesianChart.primaryXAxis.majorGridLines = { width: 0 };
                }
                cartesianChart.primaryXAxis.majorGridLines.width = cartesianChart.primaryXAxis.majorGridLines.width === 0 ? 1 : 0;
            }
            break;
        case 'GLMinorHorizontal':
            if (cartesianChart) {
                if (!cartesianChart.primaryYAxis.minorGridLines) {
                    cartesianChart.primaryYAxis.minorGridLines = { width: 0 };
                }
                cartesianChart.primaryYAxis.minorTicksPerInterval = cartesianChart.primaryYAxis.minorGridLines.width === 0 ? 5 : 0;
                cartesianChart.primaryYAxis.minorGridLines.width = cartesianChart.primaryYAxis.minorGridLines.width === 0 ? 1 : 0;
            }
            break;
        case 'GLMinorVertical':
            if (cartesianChart) {
                if (!cartesianChart.primaryXAxis.minorGridLines) {
                    cartesianChart.primaryXAxis.minorGridLines = { width: 0 };
                }
                cartesianChart.primaryXAxis.minorTicksPerInterval = cartesianChart.primaryXAxis.minorGridLines.width === 0 ? 5 : 0;
                cartesianChart.primaryXAxis.minorGridLines.width = cartesianChart.primaryXAxis.minorGridLines.width === 0 ? 1 : 0;
            }
            break;
        case 'LegendNone':
            if (!chartComp.legendSettings) {
                chartComp.legendSettings = {};
            }
            chartComp.legendSettings.visible = false;
            break;
        case 'LegendsRight':
        case 'LegendsLeft':
        case 'LegendsBottom':
        case 'LegendsTop':
            if (!chartComp.legendSettings) {
                chartComp.legendSettings = {};
            }
            chartComp.legendSettings.visible = true;
            if (value === 'LegendsRight') {
                chartComp.legendSettings.position = 'Right';
            } else if (value === 'LegendsLeft') {
                chartComp.legendSettings.position = 'Left';
            } else if (value === 'LegendsBottom') {
                chartComp.legendSettings.position = 'Bottom';
            } else if (value === 'LegendsTop') {
                chartComp.legendSettings.position = 'Top';
            }
            break;
        }
        if (chartComp && chartComp.refresh && value !== 'PHAxes' && value !== 'PVAxes') {
            chartComp.refresh();
        }
    }

    /**
     * Unified method to update chart options (type, theme, title, legend, data labels, gridlines, switchRowColumn).
     * If chartId is omitted or null, it automatically updates the currently active chart.
     *
     * @param {IChartUpdateOptions} options - The update options payload.
     * @param {string} [chartId] - The chart identifier. Defaults to active chart ID.
     * @returns {boolean} True if the update succeeded and was not cancelled.
     */
    public updateChartOptions(options: IChartUpdateOptions, chartId?: string): boolean {
        chartId = chartId || this.activeChartId;
        if (!chartId || !options) {
            return false;
        }
        const item: IChartLifecycleItem = this.lifecycleManager.getChart(chartId);
        if (!item) {
            return false;
        }
        const eventArgs: IChartBeforeActionEventArgs = {
            id: chartId,
            action: options.action,
            options: options,
            cancel: false,
            chartComponent: item.component
        };
        if (item.json) {
            eventArgs.chartJson = item.json;
        } else if (item.model) {
            eventArgs.chartModel = item.model;
        }
        this.trigger(beforeChartAction, eventArgs);
        if (eventArgs.cancel) {
            return false;
        }
        const chartComponent: Chart | AccumulationChart = item.component;
        const model: ChartModel = item.model;
        const json: Record<string, unknown> = item.json;
        const isAccumulation: boolean = model ? (model.type === 'Pie' || model.type === 'Doughnut') : false;
        let toRefresh: boolean = false;
        switch (options.action) {
        case 'chartType': {
            const rawType: string = options.chartType || options.value;
            if (rawType) {
                const typeInfo: { chartType: string; markerVisible: boolean; officeChartType: string } =
                    ChartManager.getChartTypeFromId(rawType);
                const targetType: ChartType = (typeInfo.chartType || rawType) as ChartType;
                const markerVisible: boolean = !isNullOrUndefined(options.markerVisible) ? options.markerVisible : typeInfo.markerVisible;
                const officeChartType: string = typeInfo.officeChartType || rawType;
                if (model) {
                    const isNewAccumulation: boolean = targetType === 'Pie' || targetType === 'Doughnut';
                    const isOldAccumulation: boolean = isAccumulation;
                    const switchResult: { needRecreate: boolean } = this.switchChartType(
                        model, targetType, chartComponent, markerVisible
                    );
                    const mustRebuild: boolean = switchResult.needRecreate || (isOldAccumulation !== isNewAccumulation);
                    const isTargetLine: boolean = targetType === 'Line' || targetType === 'StackingLine' || targetType === 'StackingLine100';
                    if (isTargetLine) {
                        if (isNullOrUndefined(model.markerSettings)) {
                            model.markerSettings = { shape: 'Circle', visible: markerVisible, isFilled: false };
                        } else {
                            model.markerSettings.visible = markerVisible;
                        }
                    } else if (!isNullOrUndefined(model.markerSettings)) {
                        model.markerSettings.visible = false;
                    }
                    if (json) {
                        const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                        const propKey: string = chartTypeProperty[parseInt(kw.toString(), 10)];
                        (json as Record<string, unknown>)[`${propKey}`] = officeChartType;
                    }
                    if (mustRebuild) {
                        const chartContainer: HTMLElement = document.getElementById(chartId);
                        if (chartContainer) {
                            model.type = targetType;
                            const compTheme: string = (chartComponent && chartComponent.theme) ? chartComponent.theme : null;
                            const preservedTheme: ChartTheme = (compTheme || model.theme || 'Material') as ChartTheme;
                            const compTitle: string = (chartComponent && !isNullOrUndefined(chartComponent.title)) ?
                                chartComponent.title : null;
                            const preservedTitle: string = !isNullOrUndefined(compTitle) ? compTitle : model.title;
                            const preservedLegend: LegendSettingsModel = chartComponent && chartComponent.legendSettings
                                ? { visible: chartComponent.legendSettings.visible, position: chartComponent.legendSettings.position }
                                : model.legendSettings;
                            const canPreserveAxes: boolean = !isOldAccumulation && !isNewAccumulation;
                            const oldCartesian: Chart = !isOldAccumulation && chartComponent ? (chartComponent as Chart) : null;
                            const snapAxis: (axis: AxisModel) => Record<string, unknown> =
                                (axis: AxisModel): Record<string, unknown> => {
                                    if (!axis) {
                                        return null;
                                    }
                                    const res: Record<string, unknown> = {};
                                    if (axis.majorGridLines) {
                                        res['majorGridLines'] = { width: axis.majorGridLines.width };
                                    }
                                    if (axis.minorGridLines) {
                                        res['minorGridLines'] = { width: axis.minorGridLines.width };
                                    }
                                    if (!isNullOrUndefined(axis.minorTicksPerInterval)) {
                                        res['minorTicksPerInterval'] = axis.minorTicksPerInterval;
                                    }
                                    if (axis.majorTickLines) {
                                        res['majorTickLines'] = { width: axis.majorTickLines.width };
                                    }
                                    if (axis.labelStyle && axis.labelStyle.size) {
                                        res['labelSize'] = axis.labelStyle.size;
                                    }
                                    if (axis.title) {
                                        res['title'] = axis.title;
                                    }
                                    return res;
                                };
                            const oldXAxis: AxisModel = (oldCartesian && oldCartesian.primaryXAxis) ||
                                (model.primaryXAxis as AxisModel);
                            const oldYAxis: AxisModel = (oldCartesian && oldCartesian.primaryYAxis) ||
                                (model.primaryYAxis as AxisModel);
                            const liveXAxis: Record<string, unknown> = snapAxis(oldXAxis);
                            const liveYAxis: Record<string, unknown> = snapAxis(oldYAxis);
                            if (chartComponent) {
                                chartComponent.destroy();
                            }
                            chartContainer.innerHTML = '';
                            let seriesToRender: OfficeSeriesModel[] = [];
                            if (json) {
                                const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                                const propKey: string = chartTypeProperty[parseInt(kw.toString(), 10)];
                                (json as Record<string, unknown>)[`${propKey}`] = officeChartType;
                                const jsonProcessor: JsonSeriesProcessor = new JsonSeriesProcessor();
                                const jsonProcessed: JsonChartProcessResult = jsonProcessor.process(json, kw);
                                model.series = jsonProcessed.series;
                                if (canPreserveAxes && liveXAxis) {
                                    model.primaryXAxis = jsonProcessed.primaryXAxis || {};
                                    const pX: AxisModel = model.primaryXAxis as AxisModel;
                                    if (liveXAxis['majorGridLines']) { pX.majorGridLines = liveXAxis['majorGridLines'] as MajorGridLinesModel; }
                                    if (liveXAxis['minorGridLines']) { pX.minorGridLines = liveXAxis['minorGridLines'] as MinorGridLinesModel; }
                                    if (!isNullOrUndefined(liveXAxis['minorTicksPerInterval'])) {
                                        pX.minorTicksPerInterval = liveXAxis['minorTicksPerInterval'] as number;
                                    }
                                    if (liveXAxis['majorTickLines']) { pX.majorTickLines = liveXAxis['majorTickLines'] as MajorTickLinesModel; }
                                    if (liveXAxis['labelSize']) {
                                        pX.labelStyle = pX.labelStyle || {};
                                        pX.labelStyle.size = liveXAxis['labelSize'] as string;
                                    }
                                    if (liveXAxis['title']) { pX.title = liveXAxis['title'] as string; }
                                } else {
                                    model.primaryXAxis = isNewAccumulation ? undefined : jsonProcessed.primaryXAxis;
                                }
                                if (officeChartType === 'Scatter_Markers' && model.primaryXAxis) {
                                    const catProp: string = chartCategoryProperty[parseInt(kw.toString(), 10)];
                                    const cats: Record<string, unknown>[] = ((json as Record<string, unknown>)[`${catProp}`] as Record<string, unknown>[]) || [];
                                    const xProp: string = categoryXNameProperty[parseInt(kw.toString(), 10)];
                                    const numeric: boolean = cats.length > 0 && cats.every((c: Record<string, unknown>) => {
                                        const val: unknown = c[`${xProp}`];
                                        return !isNullOrUndefined(val) && String(val).trim() !== '' && isFinite(Number(val));
                                    });
                                    if (numeric) {
                                        model.primaryXAxis.valueType = 'Double';
                                    }
                                }
                                if (canPreserveAxes && liveYAxis) {
                                    model.primaryYAxis = jsonProcessed.primaryYAxis || {};
                                    const pY: AxisModel = model.primaryYAxis as AxisModel;
                                    if (liveYAxis['majorGridLines']) { pY.majorGridLines = liveYAxis['majorGridLines'] as MajorGridLinesModel; }
                                    if (liveYAxis['minorGridLines']) { pY.minorGridLines = liveYAxis['minorGridLines'] as MinorGridLinesModel; }
                                    if (!isNullOrUndefined(liveYAxis['minorTicksPerInterval'])) {
                                        pY.minorTicksPerInterval = liveYAxis['minorTicksPerInterval'] as number;
                                    }
                                    if (liveYAxis['majorTickLines']) { pY.majorTickLines = liveYAxis['majorTickLines'] as MajorTickLinesModel; }
                                    if (liveYAxis['labelSize']) {
                                        pY.labelStyle = pY.labelStyle || {};
                                        pY.labelStyle.size = liveYAxis['labelSize'] as string;
                                    }
                                    if (liveYAxis['title']) { pY.title = liveYAxis['title'] as string; }
                                } else {
                                    model.primaryYAxis = isNewAccumulation ? undefined : jsonProcessed.primaryYAxis;
                                }
                                if (model.primaryYAxis) {
                                    const typeStr: string = (targetType as string) || '';
                                    const is100Stacked: boolean = typeStr.indexOf('100') !== -1;
                                    if (is100Stacked && (!model.primaryYAxis.interval || model.primaryYAxis.interval < 10)) {
                                        model.primaryYAxis.interval = 10;
                                    }
                                }
                                model.legendSettings = !isNullOrUndefined(preservedLegend)
                                    ? preservedLegend : jsonProcessed.legendSettings;
                                model.title = !isNullOrUndefined(preservedTitle) ? preservedTitle : jsonProcessed.title;
                                seriesToRender = jsonProcessed.series as OfficeSeriesModel[];
                                const isTargetLineJson: boolean = targetType === 'Line' || targetType === 'StackingLine' || targetType === 'StackingLine100';
                                if (seriesToRender && Array.isArray(seriesToRender)) {
                                    for (let sIdx: number = 0; sIdx < seriesToRender.length; sIdx++) {
                                        const sItem: ChartSeriesModel = seriesToRender[sIdx as number] as ChartSeriesModel;
                                        if (!isTargetLineJson && sItem.marker) {
                                            sItem.marker.visible = false;
                                        } else if (isTargetLineJson && markerVisible) {
                                            if (!sItem.marker) {
                                                sItem.marker = { visible: true, shape: 'Circle', isFilled: false };
                                            } else {
                                                sItem.marker.visible = true;
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (model.series && Array.isArray(model.series)) {
                                    const isTargetLine: boolean = targetType === 'Line' || targetType === 'StackingLine' || targetType === 'StackingLine100';
                                    for (let idx: number = 0, len: number = model.series.length; idx < len; idx++) {
                                        const sItem: ChartSeriesModel = model.series[idx as number] as ChartSeriesModel;
                                        sItem.type = targetType as ChartSeriesType;
                                        if (isTargetLine) {
                                            if (model.markerSettings) {
                                                sItem.marker = {
                                                    visible: model.markerSettings.visible,
                                                    shape: model.markerSettings.shape || 'Circle',
                                                    isFilled: model.markerSettings.isFilled || false
                                                };
                                            } else if (markerVisible) {
                                                sItem.marker = { visible: true, shape: 'Circle', isFilled: false };
                                            }
                                        } else if (sItem.marker) {
                                            sItem.marker.visible = false;
                                        }
                                    }
                                }
                                if (!isNewAccumulation && !model.primaryXAxis) {
                                    model.primaryXAxis = { valueType: 'Category' };
                                }
                                if (!isNewAccumulation && !model.primaryYAxis) {
                                    model.primaryYAxis = {};
                                }
                                const processor: SeriesProcessor = new SeriesProcessor();
                                const processed: ISeriesProcessResult = processor.process(model, model.series as OfficeSeriesModel[]);
                                seriesToRender = processed.series;
                                if (!isNewAccumulation) {
                                    model.primaryXAxis = processed.primaryXAxis;
                                    model.primaryYAxis = processed.primaryYAxis;
                                }
                                model.legendSettings = processed.legendSettings;
                            }
                            model.theme = preservedTheme;
                            const renderer: ChartRenderer = new ChartRenderer();
                            const newComp: Chart | AccumulationChart = renderer.render(
                                model, seriesToRender, chartContainer, {
                                    width: '100%',
                                    height: '100%',
                                    primaryXAxis: model.primaryXAxis,
                                    primaryYAxis: model.primaryYAxis,
                                    legendSettings: model.legendSettings
                                }
                            );
                            item.component = newComp;
                            this.lifecycleManager.registerChart(chartId, model, newComp, item.overlayElement, json, item.keywordIndex);
                        }
                    } else {
                        if (model.series && Array.isArray(model.series)) {
                            for (let idx: number = 0, len: number = model.series.length; idx < len; idx++) {
                                (model.series[idx as number] as ChartSeriesModel).type = targetType as ChartSeriesType;
                            }
                        }
                        if (json) {
                            const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                            (json as Record<string, unknown>)[chartTypeProperty[parseInt(kw.toString(), 10)]] = officeChartType;
                        }
                    }
                }
            }
            break;
        }
        case 'theme': {
            const newTheme: ChartTheme = (options.theme || options.value) as ChartTheme;
            if (newTheme) {
                if (model && chartComponent) {
                    this.switchChartTheme(model, newTheme, chartComponent);
                } else {
                    if (model) {
                        model.theme = newTheme;
                    }
                    if (chartComponent) {
                        chartComponent.theme = newTheme;
                        toRefresh = true;
                    }
                }
            }
            break;
        }
        case 'title': {
            const newTitle: string = !isNullOrUndefined(options.title) ? options.title : options.value;
            if (!isNullOrUndefined(newTitle)) {
                if (model) {
                    model.title = newTitle;
                }
                if (chartComponent) {
                    chartComponent.title = newTitle;
                    toRefresh = true;
                }
                if (json) {
                    const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                    (json as Record<string, unknown>)[chartTitleProperty[parseInt(kw.toString(), 10)]] = newTitle;
                }
            }
            break;
        }
        case 'legend': {
            const pos: LegendPosition = (options.legendPosition || options.value || 'Bottom') as LegendPosition;
            const isVisible: boolean = (pos as string) !== 'None';
            if (model) {
                if (!model.legendSettings) {
                    model.legendSettings = {};
                }
                model.legendSettings.visible = isVisible;
                if (isVisible) {
                    model.legendSettings.position = pos;
                }
            }
            if (chartComponent && chartComponent.legendSettings) {
                chartComponent.legendSettings.visible = isVisible;
                if (isVisible) {
                    chartComponent.legendSettings.position = pos;
                }
                toRefresh = true;
            }
            if (json) {
                const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                const chartJson: Record<string, unknown> = json as Record<string, unknown>;
                const legendProp: string = chartLegendProperty[parseInt(kw.toString(), 10)];
                const posProp: string = positionProperty[parseInt(kw.toString(), 10)];
                if (!chartJson[`${legendProp}`]) {
                    chartJson[`${legendProp}`] = {};
                }
                const legendSub: Record<string, unknown> = chartJson[`${legendProp}`] as Record<string, unknown>;
                legendSub[`${posProp}`] = pos;
            }
            break;
        }
        case 'dataLabels': {
            const dlPos: string = options.dataLabelPosition || options.value || 'Center';
            const dlAction: string = dlPos === 'None' ? 'DLNone' : ('DL' + dlPos);
            this.updateChartElement(dlAction, chartComponent, '', undefined, undefined, isAccumulation, false, false, chartId);
            if (json) {
                const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                const chartJson: Record<string, unknown> = json as Record<string, unknown>;
                const serProp: string = chartSeriesProperty[parseInt(kw.toString(), 10)];
                const dlProp: string = dataLabelProperty[parseInt(kw.toString(), 10)];
                const posProp: string = positionProperty[parseInt(kw.toString(), 10)];
                const seriesList: Record<string, unknown>[] = chartJson[`${serProp}`] as Record<string, unknown>[];
                if (seriesList && Array.isArray(seriesList)) {
                    for (let sIdx: number = 0; sIdx < seriesList.length; sIdx++) {
                        const serItem: Record<string, unknown> = seriesList[sIdx as number];
                        if (serItem) {
                            if (dlPos === 'None') {
                                delete serItem[`${dlProp}`];
                            } else {
                                if (!serItem[`${dlProp}`]) {
                                    serItem[`${dlProp}`] = {};
                                }
                                (serItem[`${dlProp}`] as Record<string, unknown>)[`${posProp}`] = dlPos;
                            }
                        }
                    }
                }
            }
            break;
        }
        case 'gridlines': {
            const glType: string = options.gridlineType || options.value || 'MajorHorizontal';
            const glAction: string = 'GL' + glType;
            const isBarChart: boolean = !isAccumulation && model && ((model.type || '').includes('Bar'));
            this.updateChartElement(glAction, chartComponent, '', undefined, undefined, isAccumulation, isBarChart, false, chartId);
            break;
        }
        case 'axis': {
            const axisVal: string = options.axisType || options.value || 'PrimaryHorizontal';
            const axisAction: string = (axisVal === 'PrimaryHorizontal' || axisVal === 'PHAxes') ? 'PHAxes' : 'PVAxes';
            const isBarChart: boolean = !isAccumulation && model && ((model.type || '').includes('Bar'));
            this.updateChartElement(axisAction, chartComponent, '', undefined, undefined, isAccumulation, isBarChart, false, chartId);
            break;
        }
        case 'axisTitle': {
            const axisTitleVal: string = options.axisTitleType || options.value || 'PrimaryHorizontal';
            const titleText: string = options.title;
            const axisTitleAction: string = (axisTitleVal === 'PrimaryHorizontal' || axisTitleVal === 'PHAxisTitle') ? 'PHAxisTitle' : 'PVAxisTitle';
            const isBarChart: boolean = !isAccumulation && model && ((model.type || '').includes('Bar'));
            this.updateChartElement(
                axisTitleAction, chartComponent, titleText, undefined, undefined, isAccumulation, isBarChart, false, chartId);
            break;
        }
        case 'switchRowColumn': {
            if (json) {
                const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                this.transposeJson(json, kw);
                const jsonProcessor: JsonSeriesProcessor = new JsonSeriesProcessor();
                const jsonProcessed: JsonChartProcessResult = jsonProcessor.process(json, kw);
                // Preserve runtime dataLabel and marker visibility configurations from previous series across row/column switch
                const oldSeriesList: ChartSeriesModel[] = (chartComponent && chartComponent.series && chartComponent.series.length)
                    ? (chartComponent.series as ChartSeriesModel[])
                    : ((model && model.series && model.series.length) ? (model.series as ChartSeriesModel[]) : []);
                const firstOldSeries: ChartSeriesModel = oldSeriesList[0];
                if (firstOldSeries && firstOldSeries.marker) {
                    const markerVisible: boolean = Boolean(firstOldSeries.marker.visible);
                    const markerShape: ChartShape = (firstOldSeries.marker.shape as ChartShape) || 'Circle';
                    const markerFill: string = firstOldSeries.marker.fill;
                    const dlVisible: boolean = Boolean(firstOldSeries.marker.dataLabel && firstOldSeries.marker.dataLabel.visible);
                    const dlPos: LabelPosition = (firstOldSeries.marker.dataLabel && firstOldSeries.marker.dataLabel.position) || 'Middle';
                    if (jsonProcessed.series && Array.isArray(jsonProcessed.series)) {
                        for (let sIdx: number = 0; sIdx < jsonProcessed.series.length; sIdx++) {
                            const curS: ChartSeriesModel = jsonProcessed.series[sIdx as number] as ChartSeriesModel;
                            if (!curS.marker) {
                                curS.marker = {};
                            }
                            curS.marker.visible = markerVisible;
                            curS.marker.shape = markerShape;
                            if (markerFill) {
                                curS.marker.fill = markerFill;
                            }
                            if (!curS.marker.dataLabel) {
                                curS.marker.dataLabel = {};
                            }
                            curS.marker.dataLabel.visible = dlVisible;
                            curS.marker.dataLabel.position = dlPos;
                            curS.marker.dataLabel.labelIntersectAction = 'None';
                        }
                    }
                }
                if (model) {
                    model.series = jsonProcessed.series;
                }
                if (chartComponent) {
                    const seriesToAssign: ChartSeriesModel[] | AccumulationSeriesModel[] = (isAccumulation && jsonProcessed.series.length)
                        ? [jsonProcessed.series[0] as unknown as AccumulationSeriesModel]
                        : (jsonProcessed.series as ChartSeriesModel[]);
                    (chartComponent as Chart).series = seriesToAssign as ChartSeriesModel[];
                    chartComponent.refresh();
                }
            }
            break;
        }
        default:
            break;
        }
        if (toRefresh && chartComponent) {
            chartComponent.refresh();
        }
        if (model && item.component) {
            const compAny: { primaryXAxis?: AxisModel; primaryYAxis?: AxisModel } =
                item.component as { primaryXAxis?: AxisModel; primaryYAxis?: AxisModel };
            if (compAny.primaryXAxis) {
                if (!model.primaryXAxis) { model.primaryXAxis = {}; }
                if (compAny.primaryXAxis.title !== undefined) {
                    model.primaryXAxis.title = compAny.primaryXAxis.title;
                }
                if (compAny.primaryXAxis.majorGridLines) {
                    model.primaryXAxis.majorGridLines = { width: compAny.primaryXAxis.majorGridLines.width };
                }
                if (compAny.primaryXAxis.minorGridLines) {
                    model.primaryXAxis.minorGridLines = { width: compAny.primaryXAxis.minorGridLines.width };
                }
                if ((compAny.primaryXAxis as { majorTickLines?: { width?: number } }).majorTickLines) {
                    model.primaryXAxis.majorTickLines = {
                        width: (compAny.primaryXAxis as { majorTickLines?: { width?: number } }).majorTickLines.width
                    };
                }
                if ((compAny.primaryXAxis as { labelStyle?: { size?: string } }).labelStyle) {
                    model.primaryXAxis.labelStyle = { size: (compAny.primaryXAxis as { labelStyle?: { size?: string } }).labelStyle.size };
                }
            }
            if (compAny.primaryYAxis) {
                if (!model.primaryYAxis) { model.primaryYAxis = {}; }
                if (!isNullOrUndefined(compAny.primaryYAxis.title)) {
                    model.primaryYAxis.title = compAny.primaryYAxis.title;
                }
                if (compAny.primaryYAxis.majorGridLines) {
                    model.primaryYAxis.majorGridLines = { width: compAny.primaryYAxis.majorGridLines.width };
                }
                if (compAny.primaryYAxis.minorGridLines) {
                    model.primaryYAxis.minorGridLines = { width: compAny.primaryYAxis.minorGridLines.width };
                }
                if ((compAny.primaryYAxis as { majorTickLines?: { width?: number } }).majorTickLines) {
                    model.primaryYAxis.majorTickLines = {
                        width: (compAny.primaryYAxis as { majorTickLines?: { width?: number } }).majorTickLines.width
                    };
                }
                if ((compAny.primaryYAxis as { labelStyle?: { size?: string } }).labelStyle) {
                    model.primaryYAxis.labelStyle = { size: (compAny.primaryYAxis as { labelStyle?: { size?: string } }).labelStyle.size };
                }
                if (!isNullOrUndefined(compAny.primaryYAxis.interval)) {
                    model.primaryYAxis.interval = compAny.primaryYAxis.interval;
                }
            }
            if (item.json) {
                const kw: number = !isNullOrUndefined(item.keywordIndex) ? item.keywordIndex : 0;
                const chartJson: Record<string, unknown> = item.json as Record<string, unknown>;
                const catAxisProp: string = chartPrimaryCategoryAxisProperty[parseInt(kw.toString(), 10)];
                const valAxisProp: string = chartPrimaryValueAxisProperty[parseInt(kw.toString(), 10)];
                const titleProp: string = chartTitleProperty[parseInt(kw.toString(), 10)];
                const majGlProp: string = hasMajorGridLinesProperty[parseInt(kw.toString(), 10)];
                const minGlProp: string = hasMinorGridLinesProperty[parseInt(kw.toString(), 10)];
                if (compAny.primaryXAxis) {
                    if (!chartJson[`${catAxisProp}`]) { chartJson[`${catAxisProp}`] = {}; }
                    const catAxis: Record<string, unknown> = chartJson[`${catAxisProp}`] as Record<string, unknown>;
                    if (compAny.primaryXAxis.title !== undefined) {
                        catAxis[`${titleProp}`] = compAny.primaryXAxis.title;
                    }
                    if (compAny.primaryXAxis.majorGridLines) {
                        catAxis[`${majGlProp}`] = compAny.primaryXAxis.majorGridLines.width > 0;
                    }
                    if (compAny.primaryXAxis.minorGridLines) {
                        catAxis[`${minGlProp}`] = compAny.primaryXAxis.minorGridLines.width > 0;
                    }
                }
                if (compAny.primaryYAxis) {
                    if (!chartJson[`${valAxisProp}`]) { chartJson[`${valAxisProp}`] = {}; }
                    const valAxis: Record<string, unknown> = chartJson[`${valAxisProp}`] as Record<string, unknown>;
                    if (!isNullOrUndefined(compAny.primaryYAxis.title)) {
                        valAxis[`${titleProp}`] = compAny.primaryYAxis.title;
                    }
                    if (compAny.primaryYAxis.majorGridLines) {
                        valAxis[`${majGlProp}`] = compAny.primaryYAxis.majorGridLines.width > 0;
                    }
                    if (compAny.primaryYAxis.minorGridLines) {
                        valAxis[`${minGlProp}`] = compAny.primaryYAxis.minorGridLines.width > 0;
                    }
                }
            }
        }
        const afterArgs: IChartAfterActionEventArgs = {
            id: chartId,
            action: options.action,
            options: options,
            chartComponent: item.component
        };
        if (item.json) {
            afterArgs.chartJson = item.json;
        } else if (item.model) {
            afterArgs.chartModel = item.model;
        }
        const updatedProps: Partial<ChartModel> = {};
        if (model) {
            if (options.action === 'chartType') {
                updatedProps.type = model.type;
                if (model.markerSettings) { updatedProps.markerSettings = model.markerSettings; }
            }
            if (options.action === 'theme') { updatedProps.theme = model.theme; }
            if (options.action === 'title') { updatedProps.title = model.title; }
            if (options.action === 'legend') { updatedProps.legendSettings = model.legendSettings; }
            if (options.action === 'dataLabels') {
                updatedProps.dataLabelSettings = model.dataLabelSettings;
            }
            if (options.action === 'switchRowColumn') {
                updatedProps.isSeriesInRows = model.isSeriesInRows;
            }
            if (options.action === 'gridlines' || options.action === 'axis' || options.action === 'axisTitle') {
                updatedProps.primaryXAxis = model.primaryXAxis;
                updatedProps.primaryYAxis = model.primaryYAxis;
            }
        }
        this.trigger(chartUpdated, {
            chartId: chartId,
            properties: Object.keys(updatedProps).length > 0 ? updatedProps : (options as Partial<ChartModel>)
        });
        this.trigger(afterChartAction, afterArgs);
        if (this.chartRibbon) {
            const ribbonAny: {
                refreshThemeSelection?: (theme: string) => void;
                updateRibbonOptions?: (type: string) => void;
            } = this.chartRibbon as {
                refreshThemeSelection?: (theme: string) => void;
                updateRibbonOptions?: (type: string) => void;
            };
            if (options.action === 'theme' && options.theme && ribbonAny.refreshThemeSelection) {
                ribbonAny.refreshThemeSelection(options.theme as string);
            } else if (options.action === 'chartType' && ribbonAny.updateRibbonOptions) {
                const updatedType: string = (model ? model.type : (options.chartType || options.value)) || '';
                ribbonAny.updateRibbonOptions(updatedType);
            }
        }
        return true;
    }

    /**
     * Transposes category and series data matrix in OpenXML JSON for row/column switching.
     *
     * @param {Object} json - OpenXML JSON data.
     * @param {number} kw - Keyword index.
     * @returns {void}
     */
    private transposeJson(json: Record<string, unknown>, kw: number): void {
        const catProp: string = chartCategoryProperty[parseInt(kw.toString(), 10)];
        const serProp: string = chartSeriesProperty[parseInt(kw.toString(), 10)];
        const xNameProp: string = categoryXNameProperty[parseInt(kw.toString(), 10)];
        const sNameProp: string = seriesNameProperty[parseInt(kw.toString(), 10)];
        const dProp: string = chartDataProperty[parseInt(kw.toString(), 10)];
        const cats: Record<string, unknown>[] = (json[`${catProp}`] as Record<string, unknown>[]) || [];
        const sers: Record<string, unknown>[] = (json[`${serProp}`] as Record<string, unknown>[]) || [];
        if (cats.length === 0 || sers.length === 0) {
            return;
        }
        const yValProp: string = yValueProperty[parseInt(kw.toString(), 10)];
        const newCats: Record<string, unknown>[] = sers.map((s: Record<string, unknown>, j: number) => {
            const c: Record<string, unknown> = {};
            c[`${xNameProp}`] = s[`${sNameProp}`];
            c[`${dProp}`] = cats.map((cat: Record<string, unknown>) => {
                const cdArray: Record<string, unknown>[] = (cat[`${dProp}`] as Record<string, unknown>[]) || [];
                if (cdArray[parseInt(j.toString(), 10)]) {
                    return cdArray[parseInt(j.toString(), 10)];
                }
                const emptyPoint: Record<string, unknown> = {};
                emptyPoint[`${yValProp}`] = 0;
                return emptyPoint;
            });
            return c;
        });
        const newSers: Record<string, unknown>[] = cats.map((cat: Record<string, unknown>) => {
            const s: Record<string, unknown> = {};
            s[`${sNameProp}`] = cat[`${xNameProp}`];
            return s;
        });
        json[`${catProp}`] = newCats;
        json[`${serProp}`] = newSers;
    }

    /**
     * Returns a full snapshot of the chart model for the given ID.
     *
     * @param {string} id - Target chart ID.
     * @returns {ChartModel} Chart model copy.
     */
    public getChartModel(id: string): ChartModel {
        const item: IChartLifecycleItem = this.lifecycleManager.getChart(id);
        if (!item) {
            return undefined;
        }
        return extend({}, item.model, {}, true) as ChartModel;
    }

    /**
     * Refreshes chart component with current model properties.
     *
     * @param {string} id - Chart identifier.
     * @returns {void}
     */
    public refreshChart(id: string): void {
        const item: IChartLifecycleItem = this.lifecycleManager.getChart(id);
        if (item && item.component) {
            if (item.model && item.model.series && Array.isArray(item.model.series)) {
                const seriesList: (ChartSeriesModel | AccumulationSeriesModel)[] =
                    item.model.series as (ChartSeriesModel | AccumulationSeriesModel)[];
                const isAccumulation: boolean = item.model.type === 'Pie' || item.model.type === 'Doughnut';
                (item.component as Chart).series =
                    (isAccumulation && seriesList.length ? [seriesList[0]] : seriesList) as ChartSeriesModel[];
            }
            if (item.model && item.model.title) {
                item.component.title = item.model.title;
            }
            item.component.refresh();
            this.trigger(chartRefreshed, { chart: item.model });
        }
    }

    /**
     * Deletes a chart, destroys component instance, and unregisters overlay.
     *
     * @param {string} id - Chart identifier.
     * @returns {void}
     */
    public deleteChart(id: string): void {
        const item: IChartLifecycleItem = this.lifecycleManager.getChart(id);
        if (item) {
            const eventArgs: IChartBeforeActionEventArgs = {
                id: id,
                action: 'delete',
                options: { action: 'delete' },
                cancel: false,
                chartModel: item.model,
                chartJson: item.json,
                chartComponent: item.component
            };
            this.trigger(beforeChartAction, eventArgs);
            if (eventArgs.cancel) {
                return;
            }
            if (item.component) {
                item.component.destroy();
            }
            if (this.overlayHost) {
                this.overlayService.destroyOverlay(this.overlayHost, id);
            } else {
                const overlayEle: HTMLElement = document.getElementById(id + '_overlay');
                if (overlayEle) {
                    overlayEle.remove();
                } else {
                    const chartEle: HTMLElement = document.getElementById(id);
                    if (chartEle && chartEle.parentElement) {
                        chartEle.parentElement.removeChild(chartEle);
                    }
                }
            }
            this.lifecycleManager.unregisterChart(id);
            if (this.activeChartId === id) {
                this.setActiveChart(null);
            }
            this.trigger(chartDeleted, { chartId: id });
            const completeEventArgs: IChartAfterActionEventArgs = {
                id: id,
                action: 'delete',
                options: { action: 'delete' },
                chartModel: item.model,
                chartJson: item.json,
                chartComponent: item.component
            };
            this.trigger(afterChartAction, completeEventArgs);
        }
    }

    /**
     * Retrieves the chart record for the given ID.
     *
     * @param {string} id - Chart identifier.
     * @returns {IChartLifecycleItem} Chart registry record.
     */
    public getChart(id: string): IChartLifecycleItem { return this.lifecycleManager.getChart(id); }

    /**
     * Retrieves all chart models managed by this instance.
     *
     * @returns {ChartModel[]} Array of ChartModel objects.
     */
    public getAllCharts(): ChartModel[] { return this.lifecycleManager.getAllCharts(); }

    public destroy(): void {
        if (this.overlayService) {
            this.overlayService.destroy();
            this.overlayService = null;
        }
        if (this.defaultOverlayHost) {
            this.defaultOverlayHost.destroy();
            this.defaultOverlayHost = null;
        }
        if (this.chartRenderer) {
            this.chartRenderer.destroy();
            this.chartRenderer = null;
        }
        if (this.lifecycleManager) {
            this.lifecycleManager.destroyAll();
            this.lifecycleManager = null;
        }
        this.undoRedoHost = null;
        this.overlayHost = null;
        this.chartRibbon = null;
        this.activeChartId = null;
        if (this.element) {
            super.destroy();
        }
    }
}
