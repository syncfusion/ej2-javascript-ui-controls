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
    data?: IPointInformation[];
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
    data?: IPointInformation;
    /** Defines the template for the tooltip. */
    template?: string;
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
