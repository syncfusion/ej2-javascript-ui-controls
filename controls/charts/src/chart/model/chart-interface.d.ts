import { Chart, Alignment } from '..';
import { AxisModel } from '../axis/axis-model';
import { Axis } from '../axis/axis';
import { SeriesModel } from '../series/chart-series-model';
import { BorderModel, CornerRadiusModel, FontModel } from '../../common/model/base-model';
import { Series, Points } from '../series/chart-series';
import { ChartShape } from '../utils/enum';
import { AccPoints, AccumulationSeries } from '../../accumulation-chart/model/acc-base';
import { ScrollbarSettingsRangeModel } from './chart-base-model';
import { ChartLocation, LabelLocation } from '../../common/utils/helper';
import { Rect, Size } from '@syncfusion/ej2-svg-base';
import { AccumulationChart } from '../../accumulation-chart';
import { StockChart } from '../../stock-chart/stock-chart';
import { VisibleRangeModel } from '../../common/model/interface';
import { ChartTheme, LegendShape } from '../../common/utils/enum';
export interface IChartEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Defines the event's cancellation status. */
    cancel: boolean;
}
/**
 * Defines the configuration used to register WebMCP tools.
 */
export interface WebMcpToolRegistrationArgs {
    /** Optional prefix applied to each registered WebMCP tool name. */
    prefix?: string;
    /** Optional tool-name allowlist or custom WebMCP tool definitions. */
    tools?: string[] | WebMcpTool[];
    /** Optional origins or model contexts allowed to access the tools. */
    exposedTo?: string[];
}
/**
 * Defines the event arguments raised before a WebMCP tool executes.
 */
export interface WebMcpToolExecuteEventArgs {
    /** Cancels the tool execution when set to true. */
    cancel?: boolean;
    /** Name of the WebMCP tool being executed. */
    toolName?: string;
    /** Arguments supplied to the WebMCP tool. */
    toolArgs?: object;
    /** Requests user confirmation before the tool executes. */
    showConfirmationDialog?: boolean;
    /** Custom response returned when execution is cancelled. */
    cancellationResponse?: string;
}
/**
 * Defines a WebMCP tool schema and optional execution callback.
 */
export interface WebMcpTool {
    /** Unique WebMCP tool name. */
    name: string;
    /** Natural-language tool description. */
    description: string;
    /** JSON Schema for tool input. */
    inputSchema: object;
    /** JSON Schema for tool output. */
    outputSchema: object;
    /** WebMCP tool annotations. */
    annotations: object;
    /** Tool execution callback assigned during registration. */
    execute?: Function;
}
/**
 * Defines the standard WebMCP tool response envelope.
 */
export interface WebMcpToolResponse {
    /** Text content returned to the model context. */
    content: {
        type: string;
        text: string;
    }[];
    /** Indicates that the tool operation failed. */
    isError?: boolean;
}
/**
 * Defines the arguments used to retrieve or populate WebMCP tools.
 */
export interface WebMcpToolExecutionArgs {
    /** Optional names of the built-in WebMCP tools to retrieve. */
    toolNames?: string[];
    /** WebMCP tool definitions populated for the requested tool names. */
    tools?: WebMcpTool[];
}
/**
 * Defines the arguments used to update supported chart-level properties.
 */
export interface UpdateChartArgs {
    /** Supported chart-level properties to apply to the chart. */
    properties: {
        [key: string]: any;
    };
}
/**
 * Defines the arguments used to update an existing chart series.
 */
export interface UpdateChartSeriesArgs {
    /** Zero-based index of the chart series to update. */
    seriesIndex: number;
    /** Supported series properties to apply to the selected series. */
    properties: {
        [key: string]: any;
    };
}
/**
 * Defines the arguments used to update an individual chart point.
 */
export interface UpdateChartPointArgs {
    /** Zero-based index of the chart series containing the point. */
    seriesIndex: number;
    /** Zero-based index of the chart point to update. */
    pointIndex: number;
    /** Data-record properties to apply to the selected chart point. */
    properties: {
        [key: string]: any;
    };
}
/**
 * Defines the arguments used to append data records to a chart series.
 */
export interface AppendChartDataArgs {
    /** Zero-based index of the chart series receiving the data records. */
    seriesIndex: number;
    /** Data records to append to the selected chart series. */
    data: Object[];
    /** Optional maximum number of data records to retain in the series. */
    maxPoints?: number;
}
/**
 * Defines the arguments used to remove data records from a chart series.
 */
export interface RemoveChartPointsArgs {
    /** Zero-based index of the chart series containing the data records. */
    seriesIndex: number;
    /** Zero-based index of the first data record to remove. */
    startIndex: number;
    /** Number of consecutive data records to remove. */
    count: number;
}
/**
 * Defines the series and point indexes used to identify a chart point.
 */
export interface ChartPointArgs {
    /** Zero-based index of the chart series containing the point. */
    seriesIndex: number;
    /** Zero-based index of the chart point to retrieve. */
    pointIndex: number;
}
/**
 * Defines chart-local coordinates used to retrieve the nearest chart point.
 */
export interface ChartPointPositionArgs {
    /** Chart-local horizontal coordinate. */
    x: number;
    /** Chart-local vertical coordinate. */
    y: number;
    /** Optional maximum pixel distance allowed from the specified coordinates. */
    maxDistance?: number;
}
/**
 * Defines the arguments used to add chart annotations.
 */
export interface AddChartAnnotationArgs {
    /** JSON-serializable chart annotation definitions to add. */
    annotations: Object[];
}
/**
 * Defines the arguments used to remove a chart annotation.
 */
export interface RemoveChartAnnotationArgs {
    /** Zero-based index of the chart annotation to remove. */
    annotationIndex: number;
}
/**
 * Defines the arguments used to configure zoom for a chart axis.
 */
export interface ConfigureChartZoomArgs {
    /** Selects the x-axis or y-axis orientation. */
    axis: 'x' | 'y';
    /** Optional name of a secondary axis to configure. */
    axisName?: string;
    /** Visible proportion of the selected chart axis. */
    zoomFactor: number;
    /** Starting position of the zoomed range on the selected chart axis. */
    zoomPosition: number;
}
/**
 * Defines the arguments used to reset zoom for a chart axis.
 */
export interface ResetChartZoomArgs {
    /** Optional primary axis orientation to reset. */
    axis?: 'x' | 'y';
    /** Optional name of a secondary axis to reset. */
    axisName?: string;
}
/**
 * Defines the arguments used to retrieve chart stripline information.
 */
export interface GetChartStriplinesArgs {
    /** Optional primary or secondary axis name used to filter the returned striplines. */
    axisName?: string;
}
/**
 * Defines the browser model context used to register WebMCP tools.
 */
export interface ModelContext {
    /** Registers a WebMCP tool and its optional registration settings. */
    registerTool: Function;
}
/**
 * Defines the arguments used to remove a secondary chart axis.
 */
export interface RemoveChartAxisArgs {
    /** Optional name of the secondary axis to remove. */
    axisName?: string;
    /** Optional zero-based index of the secondary axis to remove. */
    axisIndex?: number;
    /** Indicates whether affected series bindings should be reset. */
    resetSeriesBindings?: boolean;
}
/**
 * Defines the arguments used to retrieve a localized Chart label.
 */
export interface GetChartLocalizationArgs {
    /** Localization resource key to resolve. */
    key: string;
}
export interface IAnimationCompleteEventArgs extends IChartEventArgs {
    /** Defines the series that has completed animation. */
    series: Series;
}
export interface IAxisMultiLabelRenderEventArgs extends IChartEventArgs {
    /** Defines the axis. */
    axis: Axis;
    /** Defines the text of the multi-label. */
    text: string;
    /** Defines the font style for the multi-labels. */
    textStyle: FontModel;
    /** Defines the text alignment for the multi-labels. */
    alignment: Alignment;
    /** Defines custom attributes for the multi-labels. */
    customAttributes: object;
}
export interface IMultiLevelLabelClickEventArgs extends IChartEventArgs {
    /** Defines the axis associated with the clicked label. */
    axis: Axis;
    /** Defines the text of the clicked multi-level label. */
    text: string;
    /** Defines the level of the clicked multi-level label. */
    level: number;
    /** Defines the start value of the clicked multi-level label. */
    start: number | Date | string;
    /** Defines the end value of the clicked multi-level label. */
    end: number | Date | string;
    /** Defines custom attributes for the multi-level labels. */
    customAttributes: object;
}
export interface IPointEventArgs extends IChartEventArgs {
    /** Defines the series associated with the clicked point. */
    series: SeriesModel;
    /** Defines the clicked point. */
    point: Points;
    /** Defines the index of the clicked point within the series. */
    pointIndex: number;
    /** Defines the index of the series containing the clicked point. */
    seriesIndex: number;
    /** Defines the chart instance where the point was clicked. */
    chart: Chart;
    /** Defines the x-coordinate of the mouse when the point was clicked. */
    x: number;
    /** Defines the y-coordinate of the mouse when the point was clicked. */
    y: number;
    /** Defines the x-coordinate of the mouse relative to the page. */
    pageX?: number;
    /** Defines the y-coordinate of the mouse relative to the page. */
    pageY?: number;
}
export interface ISharedTooltipRenderEventArgs extends IChartEventArgs {
    /** Defines the text collections to be displayed in the tooltip. */
    text?: string[];
    /** Defines the style of the tooltip text. */
    textStyle?: FontModel;
    /** Defines the series associated with the tooltip. */
    series: Series[];
    /** Defines the points associated with the tooltip. */
    point: Points[];
    /** Defines the header text for the tooltip. */
    headerText?: string;
    /** Provides information about the points. */
    data?: IPointData[];
    /** Defines the templates for the tooltip. */
    template?: string[];
}
export interface IScrollEventArgs {
    /** Defines the event's cancellation status. */
    cancel?: boolean;
    /** Defines the name of the event. */
    name?: string;
    /** Defines the zoom position. */
    zoomPosition?: number;
    /** Defines the zoom factor. */
    zoomFactor?: number;
    /** Defines the visible range. */
    range?: VisibleRangeModel;
    /** Defines the previous zoom position. */
    previousZoomPosition?: number;
    /** Defines the previous zoom factor. */
    previousZoomFactor?: number;
    /** Defines the previous visible range. */
    previousRange?: VisibleRangeModel;
    /** Defines the scroll axis. */
    axis?: Axis;
    /** Defines the previous range of the axis. */
    previousAxisRange?: ScrollbarSettingsRangeModel;
    /** Defines the range of the axis. */
    currentRange?: ScrollbarSettingsRangeModel;
}
export interface IZoomCompleteEventArgs extends IChartEventArgs {
    /** Defines the axis that was zoomed. */
    axis: AxisModel;
    /** Defines the zoom factor before the zoom operation. */
    previousZoomFactor: number;
    /** Defines the zoom position before the zoom operation. */
    previousZoomPosition: number;
    /** Defines the zoom factor after the zoom operation. */
    currentZoomFactor: number;
    /** Defines the zoom position after the zoom operation. */
    currentZoomPosition: number;
    /** Defines the visible range of the axis after the zoom operation. */
    currentVisibleRange: VisibleRangeModel;
    /** Defines the visible range of the axis before the zoom operation. */
    previousVisibleRange: VisibleRangeModel;
}
export interface ITooltipRenderEventArgs extends IChartEventArgs {
    /** Defines the text to be displayed in the tooltip. */
    text?: string;
    /** Defines the style of the tooltip text. */
    textStyle?: FontModel;
    /** Defines the series associated with the tooltip. */
    series: Series | AccumulationSeries;
    /** Defines the point associated with the tooltip. */
    point: Points | AccPoints;
    /** Defines the header text for the tooltip. */
    headerText?: string;
    /** Provides information about the point. */
    data?: IPointData;
    /** Defines the template for the tooltip. */
    template?: string;
}
/**
 * Defines the data information for the point in tooltip render events,
 * including the complete underlying datasource record.
 */
export interface IPointData {
    /** Point xValue. */
    pointX: object;
    /** Point yValue. */
    pointY: object;
    /** Point index. */
    pointIndex: number;
    /** Series index. */
    seriesIndex: number;
    /** Series name. */
    seriesName: string;
    /** Point text. */
    pointText: string;
    /**
     * The complete underlying datasource record associated with the point.
     * References the processed row backing the point (transforms, grouping,
     * and DataManager results applied). Returns null when the record cannot
     * be resolved.
     */
    rawData: Object;
}
/** @private */
export interface IPointInformation {
    /** Point xValue. */
    pointX: object;
    /** Point yValue. */
    pointY: object;
    /** Point index. */
    pointIndex: number;
    /** Series index. */
    seriesIndex: number;
    /** Series name. */
    seriesName: string;
    /** Point text. */
    pointText: string;
}
export interface IAxisLabelRenderEventArgs extends IChartEventArgs {
    /** Defines the axis to which the label belongs. */
    axis: Axis;
    /** Defines the text of the axis label. */
    text: string;
    /** Defines the value associated with the axis label. */
    value: number;
    /** Defines the font style of the axis label. */
    labelStyle: FontModel;
}
export interface IAxisLabelClickEventArgs extends IChartEventArgs {
    /** Defines the chart instance where the label was clicked. */
    chart: Chart;
    /** Defines the axis to which the clicked label belongs. */
    axis: Axis;
    /** Defines the text of the clicked axis label. */
    text: string;
    /** Defines the ID of the clicked axis label element. */
    labelID: string;
    /** Defines the index of the clicked axis label. */
    index: number;
    /** Defines the location of the clicked axis label on the chart. */
    location: ChartLocation;
    /** Defines the value associated with the clicked axis label. */
    value: number;
}
export interface ILegendRenderEventArgs extends IChartEventArgs {
    /** Defines the legend text. */
    text: string;
    /** Defines the legend fill color. */
    fill: string;
    /** Defines the legend shape. */
    shape: LegendShape;
    /** Defines the legend marker shape. */
    markerShape?: ChartShape;
    /** Defined the legend template */
    template?: string;
    /**
     * Defines the series associated with the legend item being rendered.
     *
     * Resolved at trigger time from the same loop that built the legend
     * collection. `undefined` when no owner can be resolved (e.g. gradient
     * bar rows, range legend rows without a single series, isolated legend
     * entries). Consumers SHOULD guard with `args.series?.<field>`.
     */
    series?: Series;
    /**
     * Defines the point associated with the legend item when the legend
     * mode is `Point` (and other point-scoped rows where applicable).
     * `undefined` otherwise.
     */
    point?: Points;
}
export interface ILegendClickEventArgs extends IChartEventArgs {
    /** Defines the chart instance when the legend is clicked. */
    chart: Chart;
    /** Defines the shape of the clicked legend item. */
    legendShape: LegendShape;
    /** Defines the series associated with the clicked legend item. */
    series: Series;
    /** Defines the list of points mapped to the legend item. */
    points: Points[];
    /** Defines the text of the clicked legend item. */
    legendText: string;
}
export interface ITextRenderEventArgs extends IChartEventArgs {
    /** Defines the series of the label. */
    series: SeriesModel;
    /** Defines the point of the data label only not applicable for stack label. */
    point: Points;
    /** Defines the text of the label. */
    text: string;
    /** Defines the width and height of the text. */
    textSize: Size;
    /** Defines the fill color of the label. */
    color: string;
    /** Defines the border of the label. */
    border: BorderModel;
    /** Defines the template for the data label only not applicable for stack label.
     *
     * @aspType string
     */
    template: string | Function;
    /** Defines the font used for the label. */
    font: FontModel;
    /** Defines whether the data label position alone can change, not applicable for stack label. */
    location: LabelLocation;
}
export interface IAnnotationRenderEventArgs extends IChartEventArgs {
    /** Defines the content of the annotation. */
    content: HTMLElement;
    /** Defines the location of the annotation on the chart. */
    location: ChartLocation;
}
export interface IPointRenderEventArgs extends IChartEventArgs {
    /** Defines the series of the point. */
    series: Series;
    /** Defines the point. */
    point: Points;
    /** Defines the point fill color. */
    fill: string;
    /** Defines the point border. */
    border: BorderModel;
    /** Defines the point height. */
    height?: number;
    /** Defines the point width. */
    width?: number;
    /** Defines the point marker shape. */
    shape?: ChartShape;
    /** Defines the corner radius of the point. */
    cornerRadius?: CornerRadiusModel;
}
export interface ISeriesRenderEventArgs {
    /** Defines the series to be rendered. */
    series: Series;
    /** Defines the data for the series. */
    data: Object;
    /** Defines the name of the event. */
    name: string;
    /** Defines the fill color of the series. */
    fill: string;
}
export interface IAxisRangeCalculatedEventArgs extends IChartEventArgs {
    /** Defines the axis. */
    axis: Axis;
    /** Defines the minimum value of the axis range. */
    minimum: number;
    /** Defines the maximum value of the axis range. */
    maximum: number;
    /** Defines the interval of the axis range. */
    interval: number;
}
export interface IMouseEventArgs extends IChartEventArgs {
    /** Defines the ID of the element that is the target of the mouse event. */
    target: string;
    /** Defines the x-coordinate of the mouse. */
    x: number;
    /** Defines the y-coordinate of the mouse. */
    y: number;
    /** Defines a collection of axis data, where the key is the axis name and the value is the axis value at the mouse location.*/
    axisData: {
        [key: string]: number;
    };
}
export interface IDragCompleteEventArgs extends IChartEventArgs {
    /** Defines the selected X and Y values of the data. */
    selectedDataValues: {
        x: string | number | Date;
        y: number;
    }[][];
}
export interface ISelectionCompleteEventArgs extends IChartEventArgs {
    /** Defines the selected X and Y values of the data. */
    selectedDataValues: {
        x?: string | number | Date;
        y?: number;
        seriesIndex?: number;
        pointIndex?: number;
    }[];
    /** Defines the chart instance where the selection was completed. */
    chart: Chart;
}
export interface ILoadedEventArgs extends IChartEventArgs {
    /** Defines the instance of the chart. */
    chart: Chart;
    /** Defines the theme applied to the chart, if available. */
    theme?: ChartTheme;
}
export interface IPrintEventArgs extends IChartEventArgs {
    /** Defines the HTML content of the chart that will be printed. */
    htmlContent: Element;
}
export interface IZoomingEventArgs extends IChartEventArgs {
    /** Defines the collection of axis data that is involved in the zoom operation. */
    axisCollection: IAxisData[];
}
export interface IAxisData {
    zoomFactor: number;
    zoomPosition: number;
    axisRange: VisibleRangeModel;
    axisName: string;
}
/** @private */
export interface IBoxPlotQuartile {
    minimum: number;
    maximum: number;
    outliers: number[];
    upperQuartile: number;
    lowerQuartile: number;
    average: number;
    median: number;
}
/** @private */
/**
 * Specifies the Theme style for chart and accumulation.
 */
export interface IThemeStyle {
    axisLabel: string;
    axisTitle: string;
    axisLine: string;
    majorGridLine: string;
    minorGridLine: string;
    majorTickLine: string;
    minorTickLine: string;
    chartTitle: string;
    legendLabel: string;
    background: string;
    areaBorder: string;
    errorBar: string;
    crosshairLine: string;
    crosshairBackground: string;
    crosshairFill: string;
    crosshairLabel: string;
    tooltipFill: string;
    tooltipBoldLabel: string;
    tooltipLightLabel: string;
    tooltipHeaderLine: string;
    markerShadow: string;
    selectionRectFill: string;
    selectionRectStroke: string;
    selectionCircleStroke: string;
    tabColor: string;
    bearFillColor: string;
    bullFillColor: string;
    toolkitSelectionColor: string;
    toolkitFill: string;
    toolkitIconRectOverFill: string;
    toolkitIconRectSelectionFill: string;
    toolkitIconRect: Rect;
    histogram?: string;
    chartTitleFont: FontModel;
    axisLabelFont: FontModel;
    legendTitleFont: FontModel;
    legendLabelFont: FontModel;
    tooltipOpacity?: number;
    tooltipLabelFont: FontModel;
    axisTitleFont: FontModel;
    crosshairLabelFont: FontModel;
    chartSubTitleFont: FontModel;
    stripLineLabelFont: FontModel;
    datalabelFont: FontModel;
    seriesLabelFont: FontModel;
}
/** @private */
export interface ITouches {
    pageX?: number;
    pageY?: number;
    pointerId?: number;
}
/** @private */
export interface IZoomAxisRange {
    actualMin?: number;
    actualDelta?: number;
    min?: number;
    delta?: number;
}
export interface IResizeEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Defines the previous size of the chart before resizing. */
    previousSize: Size;
    /** Defines the size of the chart after resizing. */
    currentSize: Size;
    /** Defines the instance of the chart that has been resized. */
    chart: Chart | AccumulationChart | StockChart;
}
export interface IBeforeResizeEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Indicates whether the resizing event should be canceled. */
    cancelResizedEvent: boolean;
}
export interface IDataEditingEventArgs {
    /**
     * Defines the index of the series containing the point.
     */
    seriesIndex: number;
    /**
     * Defines the index of the point within the series.
     */
    pointIndex: number;
    /**
     * Defines the old value of the point before the drag operation started.
     */
    oldValue: number;
    /**
     * Defines the new value of the point after the drag operation has started.
     */
    newValue: number;
    /**
     * Defines the series to which the point belongs.
     */
    series: Series;
    /**
     * Defines the point being dragged.
     */
    point: Points;
}
/** @private */
export interface IChartTemplate {
    /** point x. */
    x?: object;
    /** point y. */
    y?: object;
    /** point text. */
    text?: string;
    /** point open value. */
    open?: object;
    /** point close value. */
    close?: object;
    /** point high value. */
    high?: object;
    /** point low value. */
    low?: object;
    /** point volume value. */
    volume?: object;
}
