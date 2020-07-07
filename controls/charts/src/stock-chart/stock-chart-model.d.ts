import { Component, INotifyPropertyChanged, Property, Complex, Collection, Internationalization } from '@syncfusion/ej2-base';import { Browser, EmitType, remove, Event, EventHandler } from '@syncfusion/ej2-base';import { DataManager } from '@syncfusion/ej2-data';import { Chart, ZoomSettings, CrosshairSettings } from '../chart/chart';import { ZoomSettingsModel, CrosshairSettingsModel } from '../chart/chart-model';import { appendChildElement, redrawElement, titlePositionX, textElement } from '../common/utils/helper';import { Axis } from '../chart/axis/axis';import { Series } from '../chart/series/chart-series';import { Size, Rect, TextOption, measureText, SvgRenderer } from '@syncfusion/ej2-svg-base';import { Periods } from '../common/model/base';import { IRangeSelectorRenderEventArgs, ITooltipRenderEventArgs, IMouseEventArgs, IPointEventArgs } from '../chart/model/chart-interface';import { IAxisLabelRenderEventArgs, ISeriesRenderEventArgs, IZoomingEventArgs  } from '../chart/model/chart-interface';import { PeriodsModel } from '../common/model/base-model';import { TooltipSettings } from '../common/model/base';import { TooltipSettingsModel } from '../common/model/base-model';import { calculateSize, getElement } from '../common/utils/helper';import { RangeNavigator } from '../range-navigator/range-navigator';import { getRangeValueXByPoint } from '../range-navigator/utils/helper';import { PeriodSelector } from '../common/period-selector/period-selector';import { CartesianChart } from './renderer/cartesian-chart';import { RangeSelector } from './renderer/range-selector';import { ToolBarSelector } from './renderer/toolbar-selector';import { StockMargin, StockChartArea, StockChartAxis, StockChartRow, StockChartIndexes, StockEventsSettings } from './model/base';import { StockSeries, IStockChartEventArgs, StockChartIndicator, StockChartBorder, IRangeChangeEventArgs } from './model/base';import { StockChartAnnotationSettings, IStockEventRenderArgs, } from './model/base';import { StockChartAnnotationSettingsModel } from './model/base-model';import { StockChartFont } from './model/base';import { StockSeriesModel, StockChartIndicatorModel, StockChartAxisModel, StockChartRowModel } from './model/base-model';import { StockChartIndexesModel, StockChartFontModel, StockChartAreaModel, StockEventsSettingsModel } from './model/base-model';import { StockChartBorderModel, StockMarginModel } from './model/base-model';import { ChartSeriesType, TrendlineTypes, TechnicalIndicators, ChartTheme, SelectionMode } from '../chart/utils/enum';import { ExportType, Alignment } from '../common/utils/enum';import { getThemeColor } from '../common/model/theme';import { StockEvents } from './renderer/stock-events';import { IThemeStyle } from '../chart/model/chart-interface';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class StockChart
 */
export interface StockChartModel extends ComponentModel{

    /**
     * The width of the stockChart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, stockChart renders to the full width of its parent element.
     * @default null
     */

    width?: string;

    /**
     * The height of the stockChart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, stockChart renders to the full height of its parent element.
     * @default null
     */

    height?: string;

    /**
     * Specifies the DataSource for the stockChart. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='financial'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let financial: stockChart = new stockChart({
     * ...
     *  dataSource:dataManager,
     *   series: [{
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * financial.appendTo('#financial');
     * ```
     * @default ''
     */

    dataSource?: Object | DataManager;

    /**
     *  Options to customize left, right, top and bottom margins of the stockChart.
     */

    margin?: StockMarginModel;

    /**
     * Options for customizing the color and width of the stockChart border.
     */

    border?: StockChartBorderModel;

    /**
     * The background color of the stockChart that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    background?: string;

    /**
     * Specifies the theme for the stockChart.
     * @default 'Material'
     */

    theme?: ChartTheme;

    /**
     * Options to configure the horizontal axis.
     */

    primaryXAxis?: StockChartAxisModel;

    /**
     * Options for configuring the border and background of the stockChart area.
     */

    chartArea?: StockChartAreaModel;

    /**
     * Options to configure the vertical axis.
     * @complex {opposedPosition=true, labelPosition=AxisPosition.Outside}
     */

    primaryYAxis?: StockChartAxisModel;

    /**
     * Options to split stockChart into multiple plotting areas horizontally.
     * Each object in the collection represents a plotting area in the stockChart.
     */

    rows?: StockChartRowModel[];

    /**
     * Secondary axis collection for the stockChart.
     */

    axes?: StockChartAxisModel[];

    /**
     * The configuration for series in the stockChart.
     */

    series?: StockSeriesModel[];

    /**
     * The configuration for stock events in the stockChart.
     */

    stockEvents?: StockEventsSettingsModel[];

    /**
     * It specifies whether the stockChart should be render in transposed manner or not.
     * @default false
     */
    isTransposed?: boolean;

    /**
     * Title of the chart
     * @default ''
     */

    title?: string;

    /**
     * Options for customizing the title of the Chart.
     */

    // tslint:disable-next-line:max-line-length
    titleStyle?: StockChartFontModel;

    /**
     * Defines the collection of technical indicators, that are used in financial markets
     */
    indicators?: StockChartIndicatorModel[];

    /**
     * Options for customizing the tooltip of the chart.
     */

    tooltip?: TooltipSettingsModel;

    /**
     * Options for customizing the crosshair of the chart.
     */
    crosshair?: CrosshairSettingsModel;

    /**
     * Options to enable the zooming feature in the chart.
     */
    zoomSettings?: ZoomSettingsModel;

    /**
     * It specifies whether the periodSelector to be rendered in financial chart
     * @default true
     */
    enablePeriodSelector?: boolean;

    /**
     * Custom Range
     * @default true
     */
    enableCustomRange?: boolean;

    /**
     * If set true, enables the animation in chart.
     * @default false
     */
    isSelect?: boolean;

    /**
     * It specifies whether the range navigator to be rendered in financial chart
     * @default true
     */
    enableSelector?: boolean;

    /**
     * To configure period selector options.
     */
    periods?: PeriodsModel[];

    /**
     * The configuration for annotation in chart.
     */

    annotations?: StockChartAnnotationSettingsModel[];

    /**
     * Triggers before render the selector
     * @event
     * @deprecated
     */
    selectorRender?: EmitType<IRangeSelectorRenderEventArgs>;

    /**
     * Triggers on hovering the stock chart.
     * @event
     * @blazorProperty 'OnStockChartMouseMove'
     */

    stockChartMouseMove?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when cursor leaves the chart.
     * @event
     * @blazorProperty 'OnStockChartMouseLeave'
     */

    stockChartMouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     * @event
     * @blazorProperty 'OnStockChartMouseDown'
     */

    stockChartMouseDown?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     * @event
     * @blazorProperty 'OnStockChartMouseUp'
     */

    stockChartMouseUp?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on clicking the stock chart.
     * @event
     * @blazorProperty 'OnStockChartMouseClick'
     */

    stockChartMouseClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on point click.
     * @event
     * @blazorProperty 'OnPointClick'
     */

    pointClick?: EmitType<IPointEventArgs>;

    /**
     * Triggers on point move.
     * @event
     * @blazorProperty 'PointMoved'
     */

    pointMove?: EmitType<IPointEventArgs>;

    /**
     * Triggers after the zoom selection is completed.
     * @event
     */
    onZooming?: EmitType<IZoomingEventArgs>;

    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: Disables the selection.
     * * series: selects a series.
     * * point: selects a point.
     * * cluster: selects a cluster of point
     * * dragXY: selects points by dragging with respect to both horizontal and vertical axes
     * * dragX: selects points by dragging with respect to horizontal axis.
     * * dragY: selects points by dragging with respect to vertical axis.
     * @default None
     */
    selectionMode?: SelectionMode;

    /**
     * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     * @default false
     */
    isMultiSelect?: boolean;

    /**
     * Triggers before the range navigator rendering
     * @event
     */
    load?: EmitType<IStockChartEventArgs>;

    /**
     * Triggers after the range navigator rendering
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<IStockChartEventArgs>;

    /**
     * Triggers if the range is changed
     * @event
     * @blazorProperty 'RangeChange'
     */
    rangeChange?: EmitType<IRangeChangeEventArgs>;

    /**
     * Triggers before each axis label is rendered.
     * @event
     * @deprecated
     */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers before the tooltip for series is rendered.
     * @event
     * @deprecated
     */

    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     * @event
     * @deprecated
     */

    seriesRender?: EmitType<ISeriesRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     * @event
     * @deprecated
     */
    stockEventRender?: EmitType<IStockEventRenderArgs>;

    /**
     * Specifies the point indexes to be selected while loading a chart.
     * It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
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
     * @default []
     */
    selectedDataIndexes?: StockChartIndexesModel[];

    /**
     * It specifies the types of series in financial chart.
     */
    seriesType?: ChartSeriesType[];

    /**
     * It specifies the types of indicators in financial chart.
     */
    indicatorType?: TechnicalIndicators[];

    /**
     * It specifies the types of Export types in financial chart.
     */
    exportType?: ExportType[];

    /**
     * It specifies the types of trendline types in financial chart.
     */
    trendlineType?: TrendlineTypes[];

}