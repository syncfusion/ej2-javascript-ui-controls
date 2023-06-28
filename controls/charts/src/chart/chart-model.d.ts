import { Component, Property, NotifyPropertyChanges, Internationalization } from '@syncfusion/ej2-base';import { ModuleDeclaration, L10n, setValue, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';import { TapEventArgs, EmitType, ChildProperty } from '@syncfusion/ej2-base';import { remove, extend } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, Browser, Touch } from '@syncfusion/ej2-base';import { Event, EventHandler, Complex, Collection } from '@syncfusion/ej2-base';import { findClipRect, showTooltip, ImageOption, removeElement, appendChildElement, blazorTemplatesReset } from '../common/utils/helper';import { textElement, RectOption, createSvg, firstToLowerCase, titlePositionX, PointData, redrawElement, getTextAnchor } from '../common/utils/helper';import { appendClipElement, ChartLocation } from '../common/utils/helper';import { MarginModel, BorderModel, ChartAreaModel, FontModel, TooltipSettingsModel } from '../common/model/base-model';import { getSeriesColor, Theme, getThemeColor } from '../common/model/theme';import { IndexesModel } from '../common/model/base-model';import { Margin, Border, ChartArea, Font, Indexes, TooltipSettings } from '../common/model/base';import { AxisModel, RowModel, ColumnModel } from './axis/axis-model';import { Row, Column, Axis } from './axis/axis';import { Highlight } from './user-interaction/high-light';import { CartesianAxisLayoutPanel } from './axis/cartesian-panel';import { DateTime } from './axis/date-time-axis';import { Category } from './axis/category-axis';import { DateTimeCategory } from './axis/date-time-category-axis';import { CandleSeries } from './series/candle-series';import { ErrorBar } from './series/error-bar';import { Logarithmic } from './axis/logarithmic-axis';import { Rect, measureText, TextOption, Size, SvgRenderer, BaseAttibutes, CanvasRenderer } from '@syncfusion/ej2-svg-base';import { ChartData } from './utils/get-data';import { SelectionMode, HighlightMode, LineType, ZoomMode, ToolbarItems, ChartTheme } from './utils/enum';import { Series, SeriesBase } from './series/chart-series';import { SeriesModel } from './series/chart-series-model';import { Data } from '../common/model/data';import { LineSeries } from './series/line-series';import { AreaSeries } from './series/area-series';import { BarSeries } from './series/bar-series';import { HistogramSeries } from './series/histogram-series';import { StepLineSeries } from './series/step-line-series';import { StepAreaSeries } from './series/step-area-series';import { ColumnSeries } from './series/column-series';import { ParetoSeries } from './series/pareto-series';import { StackingColumnSeries } from './series/stacking-column-series';import { StackingBarSeries } from './series/stacking-bar-series';import { StackingAreaSeries } from './series/stacking-area-series';import { StackingStepAreaSeries } from './series/stacking-step-area-series';import { StackingLineSeries } from './series/stacking-line-series';import { ScatterSeries } from './series/scatter-series';import { SplineSeries } from './series/spline-series';import { SplineAreaSeries } from './series/spline-area-series';import { RangeColumnSeries } from './series/range-column-series';import { PolarSeries } from './series/polar-series';import { RadarSeries } from './series/radar-series';import { HiloSeries } from './series/hilo-series';import { HiloOpenCloseSeries } from './series/hilo-open-close-series';import { WaterfallSeries } from './series/waterfall-series';import { BubbleSeries } from './series/bubble-series';import { RangeAreaSeries } from './series/range-area-series';import { RangeStepAreaSeries } from './series/range-step-area-series';import { SplineRangeAreaSeries } from './series/spline-range-area-series';import { Tooltip } from './user-interaction/tooltip';import { Crosshair } from './user-interaction/crosshair';import { DataEditing } from './user-interaction/data-editing';import { Marker, markerShapes } from './series/marker';import { LegendSettings } from '../common/legend/legend';import { LegendSettingsModel } from '../common/legend/legend-model';import { Legend } from './legend/legend';import { Zoom } from './user-interaction/zooming';import { Selection } from './user-interaction/selection';import { DataLabel } from './series/data-label';import { StripLine } from './axis/strip-line';import { MultiLevelLabel } from './axis/multi-level-labels';import { BoxAndWhiskerSeries } from './series/box-and-whisker-series';import { PolarRadarPanel } from './axis/polar-radar-panel';import { StripLineSettingsModel } from './model/chart-base-model';import { Trendline } from './series/chart-series';import { Trendlines } from './trend-lines/trend-line';import { TechnicalIndicator } from './technical-indicators/technical-indicator';import { SmaIndicator } from './technical-indicators/sma-indicator';import { EmaIndicator } from './technical-indicators/ema-indicator';import { TmaIndicator } from './technical-indicators/tma-indicator';import { AccumulationDistributionIndicator } from './technical-indicators/ad-indicator';import { AtrIndicator } from './technical-indicators/atr-indicator';import { BollingerBands } from './technical-indicators/bollinger-bands';import { MomentumIndicator } from './technical-indicators/momentum-indicator';import { StochasticIndicator } from './technical-indicators/stochastic-indicator';import { MacdIndicator } from './technical-indicators/macd-indicator';import { RsiIndicator } from './technical-indicators/rsi-indicator';import { TechnicalIndicatorModel } from './technical-indicators/technical-indicator-model';import { ILegendRenderEventArgs, IAxisLabelRenderEventArgs, ITextRenderEventArgs, IResizeEventArgs } from '../chart/model/chart-interface';import { IAnnotationRenderEventArgs, IAxisMultiLabelRenderEventArgs, IThemeStyle, IScrollEventArgs } from '../chart/model/chart-interface';import { IPointRenderEventArgs, ISeriesRenderEventArgs, ISelectionCompleteEventArgs } from '../chart/model/chart-interface';import { IDragCompleteEventArgs, ITooltipRenderEventArgs, IExportEventArgs, IAfterExportEventArgs } from '../chart/model/chart-interface';import { IZoomCompleteEventArgs, ILoadedEventArgs, IZoomingEventArgs, IAxisLabelClickEventArgs } from '../chart/model/chart-interface';import { IMultiLevelLabelClickEventArgs, ILegendClickEventArgs, ISharedTooltipRenderEventArgs } from '../chart/model/chart-interface';import { IAnimationCompleteEventArgs, IMouseEventArgs, IPointEventArgs, IBeforeResizeEventArgs } from '../chart/model/chart-interface';import { chartMouseClick, chartDoubleClick, pointClick, pointDoubleClick, axisLabelClick, beforeResize  } from '../common/model/constants';import { chartMouseDown, chartMouseMove, chartMouseUp, load, pointMove, chartMouseLeave, resized } from '../common/model/constants';import { IPrintEventArgs, IAxisRangeCalculatedEventArgs, IDataEditingEventArgs } from '../chart/model/chart-interface';import { ChartAnnotationSettingsModel } from './model/chart-base-model';import { ChartAnnotationSettings } from './model/chart-base';import { ChartAnnotation } from './annotation/annotation';import { getElement, getTitle } from '../common/utils/helper';import { Alignment, ExportType, SelectionPattern, TextOverflow, TitlePosition } from '../common/utils/enum';import { MultiColoredLineSeries } from './series/multi-colored-line-series';import { MultiColoredAreaSeries } from './series/multi-colored-area-series';import { ScrollBar } from '../common/scrollbar/scrollbar';import { DataManager } from '@syncfusion/ej2-data';import { StockChart } from '../stock-chart/stock-chart';import { Export } from './print-export/export';import { ExportUtils } from '../common/utils/export';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RangeColorSetting
 */
export interface RangeColorSettingModel {

    /**
     * Specify the start value of color mapping range.
     */
    start?: number;

    /**
     * Specify the end value of color mapping range.
     */
    end?: number;

    /**
     * Specify the fill colors of point those lies on the given range, if multiple colors mentioned, then we need to fill gradient.
     */
    colors?: string[];

    /**
     * Specify name for the range mapping item.
     */
    label?: string;

}

/**
 * Interface for a class CrosshairSettings
 */
export interface CrosshairSettingsModel {

    /**
     * If set to true, crosshair line becomes visible.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * DashArray for crosshair.
     *
     * @default ''
     */
    dashArray?: string;

    /**
     * Options to customize the crosshair line.
     */
    line?: BorderModel;

    /**
     * Specifies the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
     * * None: Hides both vertical and horizontal crosshair lines.
     * * Both: Shows both vertical and horizontal crosshair lines.
     * * Vertical: Shows the vertical line.
     * * Horizontal: Shows the horizontal line.
     *
     * @default Both
     */
    lineType?: LineType;

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    verticalLineColor?: string;

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    horizontalLineColor?: string;

    /**
     * The opacity for background.
     *
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class ZoomSettings
 */
export interface ZoomSettingsModel {

    /**
     * If set to true, chart can be zoomed by a rectangular selecting region on the plot area.
     *
     * @default false
     */

    enableSelectionZooming?: boolean;

    /**
     * If to true, chart can be pinched to zoom in / zoom out.
     *
     * @default false
     */

    enablePinchZooming?: boolean;

    /**
     * If set to true, chart can be rendered with toolbar at initial load.
     *
     * @default false
     */

    showToolbar?: boolean;

    /**
     * If set to true, chart can be zoomed by using mouse wheel.
     *
     * @default false
     */

    enableMouseWheelZooming?: boolean;

    /**
     * If set to true, zooming will be performed on mouse up. It requires `enableSelectionZooming` to be true.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *    zoomSettings: {
     *      enableSelectionZooming: true,
     *      enableDeferredZooming: false
     *    }
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default true
     */

    enableDeferredZooming?: boolean;

    /**
     * Specifies whether to allow zooming vertically or horizontally or in both ways. They are,
     * * x,y: Chart can be zoomed both vertically and horizontally.
     * * x: Chart can be zoomed horizontally.
     * * y: Chart can be zoomed  vertically.
     *  It requires `enableSelectionZooming` to be true.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *    zoomSettings: {
     *      enableSelectionZooming: true,
     *      mode: 'XY'
     *    }
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default 'XY'
     */
    mode?: ZoomMode;

    /**
     * Specifies the toolkit options for the zooming as follows:
     * * Zoom
     * * ZoomIn
     * * ZoomOut
     * * Pan
     * * Reset
     *
     * @default '["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]'
     */

    toolbarItems?: ToolbarItems[];

    /**
     * Specifies whether chart needs to be panned by default.
     *
     * @default false.
     */

    enablePan?: boolean;

    /**
     * Specifies whether axis needs to have scrollbar.
     *
     * @default false.
     */

    enableScrollbar?: boolean;

}

/**
 * Interface for a class titleSettings
 */
export interface titleSettingsModel {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */

    fontStyle?: string;

    /**
     * Font size for the text.
     *
     * @default '15px'
     */

    size?: string;

    /**
     * FontWeight for the text.
     *
     * @default '500'
     */

    fontWeight?: string;

    /**
     * Color for the text.
     *
     * @default ''
     */

    color?: string;

    /**
     * text alignment.
     *
     * @default 'Center'
     */

    textAlignment?: Alignment;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * Specifies the chart title text overflow.
     *
     * @default 'Wrap'
     */

    textOverflow?: TextOverflow;

    /**
     * Defines the position for the chart title.
     * * Top: Displays the title at the top of the chart.
     * * Left: Displays the title at the left of the chart.
     * * Bottom: Displays the title at the bottom of the chart.
     * * Right: Displays the title at the right of the chart.
     * * Custom: Displays the title based on the given x and y values.
     *
     * @default 'Top'
     */

    position?: TitlePosition; 

    /**
    * Defines the X coordinate for the chart title.
    *
    * @default 0
    */

    x?: number;

    /**
    * Defines the Y coordinate for the chart title.
    *
    * @default 0
    */

    y?: number;

}

/**
 * Interface for a class Chart
 */
export interface ChartModel extends ComponentModel{

    /**
     * The width of the chart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, chart renders to the full width of its parent element.
     *
     * @default null
     */

    width?: string;

    /**
     * The height of the chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, chart renders to the full height of its parent element.
     *
     * @default null
     */

    height?: string;

    /**
     * Title of the chart
     *
     * @default ''
     */

    title?: string;

    /**
     * Specifies the DataSource for the chart. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let chart: Chart = new Chart({
     * ...
     *  dataSource:dataManager,
     *   series: [{
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default ''
     */

    dataSource?: Object | DataManager;

    /**
     * Options for customizing the title of the Chart.
     */

    titleStyle?: titleSettingsModel;

    /**
     * SubTitle of the chart.
     *
     * @default ''
     */

    subTitle?: string;

    /**
     * Options for customizing the Subtitle of the Chart.
     */

    subTitleStyle?: FontModel;

    /**
     *  Options to customize left, right, top and bottom margins of the chart.
     */

    margin?: MarginModel;

    /**
     * Options for customizing the color and width of the chart border.
     */

    border?: BorderModel;

    /**
     * The background color of the chart that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default null
     */
    background?: string;

    /**
     * Options for configuring the border and background of the chart area.
     */

    chartArea?: ChartAreaModel;

    /**
     * Options to configure the horizontal axis.
     */

    primaryXAxis?: AxisModel;

    /**
     * Options to configure the vertical axis.
     */

    primaryYAxis?: AxisModel;

    /**
     * Options to split Chart into multiple plotting areas horizontally.
     * Each object in the collection represents a plotting area in the Chart.
     */

    rows?: RowModel[];

    /**
     * Options to split chart into multiple plotting areas vertically.
     * Each object in the collection represents a plotting area in the chart.
     */

    columns?: ColumnModel[];

    /**
     * Secondary axis collection for the chart.
     */

    axes?: AxisModel[];

    /**
     * The configuration for series in the chart.
     */

    series?: SeriesModel[];

    /**
     * The configuration for annotation in chart.
     */

    annotations?: ChartAnnotationSettingsModel[];

    /**
     * Palette for the chart series.
     *
     * @default []
     */
    palettes?: string[];

    /**
     * Specifies the theme for the chart.
     *
     * @default 'Material'
     */
    theme?: ChartTheme;

    /**
     * Options for customizing the tooltip of the chart.
     */

    tooltip?: TooltipSettingsModel;

    /**
     * Options for customizing the crosshair of the chart.
     */
    crosshair?: CrosshairSettingsModel;

    /**
     * Options for customizing the legend of the chart.
     */
    legendSettings?: LegendSettingsModel;

    /**
     * Options for customizing the points fill color based on condition.
     */
    rangeColorSettings?: RangeColorSettingModel[];

    /**
     * Options to enable the zooming feature in the chart.
     */
    zoomSettings?: ZoomSettingsModel;

    /**
     * Define the color for the data point on highlight.
     *
     * @default ''
     */

    highlightColor?: string;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: Disables the selection.
     * * series: selects a series.
     * * point: selects a point.
     * * cluster: selects a cluster of point
     * * dragXY: selects points by dragging with respect to both horizontal and vertical axes
     * * dragX: selects points by dragging with respect to horizontal axis.
     * * dragY: selects points by dragging with respect to vertical axis.
     * * lasso: selects points by dragging with respect to free form.
     *
     * @default None
     */
    selectionMode?: SelectionMode;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: Disables the highlight.
     * * series: highlight a series.
     * * point: highlight a point.
     * * cluster: highlight a cluster of point
     *
     * @default None
     */
    highlightMode?: HighlightMode;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: sets none as selecting pattern.
     * * chessboard: sets chess board as selecting pattern.
     * * dots: sets dots as  selecting pattern.
     * * diagonalForward: sets diagonal forward as selecting pattern.
     * * crosshatch: sets crosshatch as selecting pattern.
     * * pacman: sets pacman selecting pattern.
     * * diagonalbackward: sets diagonal backward as selecting pattern.
     * * grid: sets grid as selecting pattern.
     * * turquoise: sets turquoise as selecting pattern.
     * * star: sets star as selecting pattern.
     * * triangle: sets triangle as selecting pattern.
     * * circle: sets circle as selecting pattern.
     * * tile: sets tile as selecting pattern.
     * * horizontaldash: sets horizontal dash as selecting pattern.
     * * verticaldash: sets vertical dash as selecting pattern.
     * * rectangle: sets rectangle as selecting pattern.
     * * box: sets box as selecting pattern.
     * * verticalstripe: sets vertical stripe as  selecting pattern.
     * * horizontalstripe: sets horizontal stripe as selecting pattern.
     * * bubble: sets bubble as selecting pattern.
     *
     * @default None
     */
    selectionPattern?: SelectionPattern;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: sets none as highlighting pattern.
     * * chessboard: sets chess board as highlighting pattern.
     * * dots: sets dots as highlighting pattern.
     * * diagonalForward: sets diagonal forward as highlighting pattern.
     * * crosshatch: sets crosshatch as highlighting pattern.
     * * pacman: sets pacman highlighting  pattern.
     * * diagonalbackward: sets diagonal backward as highlighting pattern.
     * * grid: sets grid as highlighting pattern.
     * * turquoise: sets turquoise as highlighting pattern.
     * * star: sets star as highlighting  pattern.
     * * triangle: sets triangle as highlighting pattern.
     * * circle: sets circle as highlighting  pattern.
     * * tile: sets tile as highlighting pattern.
     * * horizontaldash: sets horizontal dash as highlighting pattern.
     * * verticaldash: sets vertical dash as highlighting pattern.
     * * rectangle: sets rectangle as highlighting  pattern.
     * * box: sets box as highlighting pattern.
     * * verticalstripe: sets vertical stripe as highlighting  pattern.
     * * horizontalstripe: sets horizontal stripe as highlighting  pattern.
     * * bubble: sets bubble as highlighting  pattern.
     *
     * @default None
     */
    highlightPattern?: SelectionPattern;

    /**
     * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     *
     * @default false
     */
    isMultiSelect?: boolean;

    /**
     * If set true, enables the multi drag selection in chart. It requires `selectionMode` to be `Dragx` | `DragY` | or `DragXY`.
     *
     * @default false
     */
    allowMultiSelection?: boolean;

    /**
     * To enable export feature in chart.
     *
     * @default true
     */
    enableExport?: boolean;

    /**
     * To enable export feature in blazor chart.
     *
     * @default false
     */
    allowExport?: boolean;

    /**
     * Specifies the point indexes to be selected while loading a chart.
     * It requires `selectionMode` or `highlightMode` to be `Point` | `Series` | or `Cluster`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *   selectionMode: 'Point',
     *   selectedDataIndexes: [ { series: 0, point: 1},
     *                          { series: 2, point: 3} ],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default []
     */
    selectedDataIndexes?: IndexesModel[];

    /**
     * Specifies whether a grouping separator should be used for a number.
     *
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * If set to true, both axis interval will be calculated automatically with respect to the zoomed range.
     *
     * @default false
     */
    enableAutoIntervalOnBothAxis?: boolean;

    /**
     * It specifies whether the chart should be render in transposed manner or not.
     *
     * @default false
     */
    isTransposed?: boolean;

    /**
     * It specifies whether the chart should be rendered in canvas mode.
     *
     * @default false
     */
    enableCanvas?: boolean;

    /**
     * The background image of the chart that accepts value in string as url link or location of an image.
     *
     * @default null
     */
    backgroundImage?: string;

    /**
     * Defines the collection of technical indicators, that are used in financial markets.
     */
    indicators?: TechnicalIndicatorModel[];

    /**
     * If set true, Animation process will be executed.
     *
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Description for chart.
     *
     * @default null
     */
    description?: string;

    /**
     * TabIndex value for the chart.
     *
     * @default 1
     */
    tabIndex?: number;

    /**
     * To enable the side by side placing the points for column type series.
     *
     * @default true
     */
    enableSideBySidePlacement?: boolean;

    /**
     * Triggers after resizing of chart.
     *
     * @event resized
     * @blazorProperty 'Resized'
     */
    resized?: EmitType<IResizeEventArgs>;

    /**
     * Triggers before resizing of chart
     *
     * @event
     * @blazorProperty 'BeforeResize'
     */
    beforeResize?: EmitType<IBeforeResizeEventArgs>;

    /**
     * Triggers before the annotation gets rendered.
     *
     * @event annotationRender
     * @deprecated
     */

    annotationRender?: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before the prints gets started.
     *
     * @event beforePrint
     * @blazorProperty 'OnPrint'
     */

    beforePrint?: EmitType<IPrintEventArgs>;

    /**
     * Triggers after chart load.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the export gets started.
     *
     * @event beforeExport
     */
    beforeExport?: EmitType<IExportEventArgs>;

    /**
     * Triggers after the export completed.
     *
     * @event afterExport
     * @blazorProperty 'AfterExport'
     */
    afterExport?: EmitType<IAfterExportEventArgs>;

    /**
     * Triggers before chart load.
     *
     * @event load
     */
    load?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after animation is completed for the series.
     *
     * @event animationComplete
     * @blazorProperty 'OnAnimationComplete'
     */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before the legend is rendered.
     *
     * @event legendRender
     * @deprecated
     */
    legendRender?: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the data label for series is rendered.
     *
     * @event textRender
     * @deprecated
     */

    textRender?: EmitType<ITextRenderEventArgs>;

    /**
     * Triggers before each points for the series is rendered.
     *
     * @event pointRender
     * @deprecated
     */

    pointRender?: EmitType<IPointRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     *
     * @event seriesRender
     * @deprecated
     */

    seriesRender?: EmitType<ISeriesRenderEventArgs>;

    /**
     * Triggers before each axis label is rendered.
     *
     * @event axisLabelRender
     * @deprecated
     */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers when x axis label clicked.
     *
     * @event axisLabelClick
     * @deprecated
     */
    axisLabelClick?: EmitType<IAxisLabelClickEventArgs>;

    /**
     * Triggers before each axis range is rendered.
     *
     * @event axisRangeCalculated
     * @deprecated
     */
    axisRangeCalculated?: EmitType<IAxisRangeCalculatedEventArgs>;

    /**
     * Triggers before each axis multi label is rendered.
     *
     * @event axisMultiLabelRender
     * @deprecated
     */
    axisMultiLabelRender?: EmitType<IAxisMultiLabelRenderEventArgs>;

    /**
     * Triggers after click on legend.
     *
     * @event legendClick
     */
    legendClick?: EmitType<ILegendClickEventArgs>;

    /**
     * Triggers after click on multiLevelLabelClick.
     *
     * @event multiLevelLabelClick
     */
    multiLevelLabelClick?: EmitType<IMultiLevelLabelClickEventArgs>;

    /**
     * Triggers before the tooltip for series is rendered.
     *
     * @event tooltipRender
     */

    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the shared tooltip for series is rendered.
     *
     * @event sharedTooltipRender
     */

    sharedTooltipRender?: EmitType<ISharedTooltipRenderEventArgs>;

    /**
     * Triggers on hovering the chart.
     *
     * @event chartMouseMove
     * @blazorProperty 'OnChartMouseMove'
     */

    chartMouseMove?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on clicking the chart.
     *
     * @event chartMouseClick
     * @blazorProperty 'OnChartMouseClick'
     */

    chartMouseClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on double clicking the chart.
     *
     * @event chartDoubleClick
     * @blazorProperty 'OnChartDoubleClick'
     */

    chartDoubleClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on point click.
     *
     * @event pointClick
     * @blazorProperty 'OnPointClick'
     */

    pointClick?: EmitType<IPointEventArgs>;

    /**
     * Triggers on point double click.
     *
     * @event pointDoubleClick
     * @blazorProperty 'OnPointDoubleClick'
     */

    pointDoubleClick?: EmitType<IPointEventArgs>;

    /**
     * Triggers on point move.
     *
     * @event pointMove
     * @blazorProperty 'PointMoved'
     */

    pointMove?: EmitType<IPointEventArgs>;

    /**
     * Triggers when cursor leaves the chart.
     *
     * @event chartMouseLeave
     * @blazorProperty 'OnChartMouseLeave'
     */

    chartMouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     *
     * @event chartMouseDown
     * @blazorProperty 'OnChartMouseDown'
     */

    chartMouseDown?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     *
     * @event chartMouseUp
     * @blazorProperty 'OnChartMouseUp'
     */

    chartMouseUp?: EmitType<IMouseEventArgs>;

    /**
     * Triggers after the drag selection is completed.
     *
     * @event dragComplete
     * @blazorProperty 'OnDragComplete'
     */

    dragComplete?: EmitType<IDragCompleteEventArgs>;

    /**
     * Triggers after the selection is completed.
     *
     * @event selectionComplete
     * @blazorProperty 'OnSelectionComplete'
     */

    selectionComplete?: EmitType<ISelectionCompleteEventArgs>;

    /**
     * Triggers after the zoom selection is completed.
     *
     * @event zoomComplete
     * @deprecated
     */

    zoomComplete?: EmitType<IZoomCompleteEventArgs>;

    /**
     * Triggers after the zoom selection is triggered.
     *
     * @event onZooming
     */
    onZooming?: EmitType<IZoomingEventArgs>;

    /**
     * Triggers when start the scroll.
     *
     * @event scrollStart
     * @blazorProperty 'OnScrollStart'
     */
    scrollStart?: EmitType<IScrollEventArgs>;

    /**
     * Triggers after the scroll end.
     *
     * @event scrollEnd
     * @blazorProperty 'OnScrollEnd'
     */
    scrollEnd?: EmitType<IScrollEventArgs>;

    /**
     * Triggers when change the scroll.
     *
     * @event scrollChanged
     * @blazorProperty 'ScrollChanged'
     */
    scrollChanged?: EmitType<IScrollEventArgs>;

    /**
     * Triggers when the point drag start.
     *
     * @event dragStart
     */
    dragStart?: EmitType<IDataEditingEventArgs>;

    /**
     * Triggers when the point is dragging.
     *
     * @event drag
     */
    drag?: EmitType<IDataEditingEventArgs>;

    /**
     * Triggers when the point drag end.
     *
     * @event dragEnd
     */
    dragEnd?: EmitType<IDataEditingEventArgs>;

    /**
     * Defines the currencyCode format of the chart
     *
     * @private
     * @aspType string
     */
    currencyCode?: string;

}