import { Chart, Alignment } from '..';
import { AxisModel } from '../axis/axis-model';
import { Axis, VisibleRangeModel } from '../axis/axis';
import { SeriesModel } from '../series/chart-series-model';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { Series, Points } from '../series/chart-series';
import { LegendShape, ChartShape, ChartTheme } from '../utils/enum';
import { AccPoints, AccumulationSeries } from '../../accumulation-chart/model/acc-base';
import { ScrollbarSettingsRangeModel } from './chart-base-model';
import { ChartLocation, LabelLocation } from '../../common/utils/helper';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { Size } from '@syncfusion/ej2-svg-base';
import { AccumulationChart } from '../../accumulation-chart';
import { StockChart } from '../../stock-chart/stock-chart';
export interface IChartEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
}
export interface IAnimationCompleteEventArgs extends IChartEventArgs {
    /** Defines the current animation series */
    series: Series;
}
export interface IAxisMultiLabelRenderEventArgs extends IChartEventArgs {
    /** Defines the current axis */
    axis: Axis;
    /** Defines axis current label text */
    text: string;
    /** Defines font style for multi labels */
    textStyle: FontModel;
    /** Defines text alignment for multi labels */
    alignment: Alignment;
    /** Defines custom objects for multi labels */
    customAttributes: object;
}
export interface IMultiLevelLabelClickEventArgs extends IChartEventArgs {
    /** Defines the current axis */
    axis: Axis;
    /** Defines label current label text */
    text: string;
    level: number;
    start: number | Date | string;
    end: number | Date | string;
    /** Defines custom objects for multi labels */
    customAttributes: object;
}
export interface IPointEventArgs extends IChartEventArgs {
    /** Defines the current series */
    series: SeriesModel;
    /** Defines the current point */
    point: Points;
    /** Defines the point index */
    pointIndex: number;
    /** Defines the series index */
    seriesIndex: number;
    /** Defines the current chart instance */
    chart: Chart;
    /** Defines current mouse x location */
    x: number;
    /** Defines current mouse y location */
    y: number;
    /** Defines current window page x location */
    pageX?: number;
    /** Defines current window page y location */
    pageY?: number;
}
export interface ISharedTooltipRenderEventArgs extends IChartEventArgs {
    /** Defines tooltip text collections */
    text?: string[];
    /** Defines tooltip text style */
    textStyle?: FontModel;
    /** Defines the header text for the tooltip */
    headerText?: string;
    /** point informations */
    data?: IPointInformation[];
}
/**
 * Defines the scroll events
 */
export interface IScrollEventArgs {
    /** Defines the name of the event */
    name?: string;
    /** Defines the current Zoom Position */
    zoomPosition?: number;
    /** Defines the current Zoom Factor */
    zoomFactor?: number;
    /** Defines the current range */
    range?: VisibleRangeModel;
    /** Defines the previous Zoom Position */
    previousZoomPosition?: number;
    /** Defines the previous Zoom Factor */
    previousZoomFactor?: number;
    /** Defines the previous range */
    previousRange?: VisibleRangeModel;
    /** Defines the current scroll axis */
    axis?: Axis;
    /** Defines axis previous range */
    previousAxisRange?: ScrollbarSettingsRangeModel;
    /** Defines axis current range */
    currentRange?: ScrollbarSettingsRangeModel;
}
export interface IZoomCompleteEventArgs extends IChartEventArgs {
    /** Defines the zoomed axis */
    axis: AxisModel;
    /** Defines the previous zoom factor */
    previousZoomFactor: number;
    /** Defines the previous zoom position */
    previousZoomPosition: number;
    /** Defines the current zoom factor */
    currentZoomFactor: number;
    /** Defines the current zoom position */
    currentZoomPosition: number;
    /** Defines the current axis visible range */
    currentVisibleRange: VisibleRangeModel;
    /** Defines the previous axis visible range */
    previousVisibleRange: VisibleRangeModel;
}
export interface ITooltipRenderEventArgs extends IChartEventArgs {
    /** Defines tooltip text collections */
    text?: string;
    /** Defines tooltip text style */
    textStyle?: FontModel;
    /** Defines current tooltip series */
    series: Series | AccumulationSeries;
    /** Defines current tooltip point */
    point: Points | AccPoints;
    /** Defines the header text for the tooltip */
    headerText?: string;
    /** point informations */
    data?: IPointInformation;
    /** Defines the tooltip template */
    template?: string;
}
export interface IPointInformation {
    /** point xValue */
    pointX: object;
    /** point yValue */
    pointY: object;
    /** point index */
    pointIndex: number;
    /** series index */
    seriesIndex: number;
    /** series name */
    seriesName: string;
    /** point text */
    pointText: string;
}
export interface IAxisLabelRenderEventArgs extends IChartEventArgs {
    /** Defines the current axis */
    axis: Axis;
    /** Defines axis current label text */
    text: string;
    /** Defines axis current label value */
    value: number;
    /** Defines axis current label font style */
    labelStyle: FontModel;
}
export interface IAxisLabelClickEventArgs extends IChartEventArgs {
    /** Defines the chart when labelClick */
    chart: Chart;
    /** Defines the current axis */
    axis: Axis;
    /** Defines axis current label text */
    text: string;
    /** Defines axis current label element id */
    labelID: string;
    /** Defines axis current label index */
    index: number;
    /** Defines the current annotation location */
    location: ChartLocation;
    /** Defines axis current label value */
    value: number;
}
export interface ILegendRenderEventArgs extends IChartEventArgs {
    /** Defines the current legend text */
    text: string;
    /** Defines the current legend fill color */
    fill: string;
    /** Defines the current legend shape */
    shape: LegendShape;
    /** Defines the current legend marker shape */
    markerShape?: ChartShape;
}
export interface ILegendClickEventArgs extends IChartEventArgs {
    /** Defines the chart when legendClick */
    chart: Chart;
    /** Defines the current legend shape */
    legendShape: LegendShape;
    /** Defines the current series */
    series: Series;
    /** Defines the current legend text */
    legendText: string;
}
export interface ITextRenderEventArgs extends IChartEventArgs {
    /** Defines the current series of the label */
    series: SeriesModel;
    /** Defines the current point of the label */
    point: Points;
    /** Defines the current text */
    text: string;
    /** Defines the width and height of the current text */
    textSize: Size;
    /** Defines the current label fill color */
    color: string;
    /** Defines the current label border */
    border: BorderModel;
    /** Defines the current label template */
    template: string;
    /** Defines the current font */
    font: FontModel;
    /** Defines the current data label position can change */
    location: LabelLocation;
}
export interface IAnnotationRenderEventArgs extends IChartEventArgs {
    /** Defines the current annotation content */
    content: HTMLElement;
    /** Defines the current annotation location */
    location: ChartLocation;
}
export interface IPointRenderEventArgs extends IChartEventArgs {
    /** Defines the current series of the point */
    series: Series;
    /** Defines the current point */
    point: Points;
    /** Defines the current point fill color */
    fill: string;
    /** Defines the current point border */
    border: BorderModel;
    /** Defines the current point height */
    height?: number;
    /** Defines the current point width */
    width?: number;
    /** Defines the current point marker shape */
    shape?: ChartShape;
}
export interface ISeriesRenderEventArgs {
    /** Defines the current series */
    series: Series;
    /** Defines the current series data object */
    data: Object;
    /** Defines name of the event */
    name: string;
    /** Defines the current series fill */
    fill: string;
}
export interface IAxisRangeCalculatedEventArgs extends IChartEventArgs {
    /** Defines the current axis */
    axis: Axis;
    /** Defines axis current range */
    minimum: number;
    /** Defines axis current range */
    maximum: number;
    /** Defines axis current interval */
    interval: number;
}
export interface IMouseEventArgs extends IChartEventArgs {
    /** Defines current mouse event target id */
    target: string;
    /** Defines current mouse x location */
    x: number;
    /** Defines current mouse y location */
    y: number;
}
export interface IDragCompleteEventArgs extends IChartEventArgs {
    /** Defines current selected Data X, Y values */
    selectedDataValues: {
        x: string | number | Date;
        y: number;
    }[][];
}
export interface ISelectionCompleteEventArgs extends IChartEventArgs {
    /** Defines current selected Data X, Y values */
    selectedDataValues: {
        x?: string | number | Date;
        y?: number;
        seriesIndex?: number;
        pointIndex?: number;
    }[];
}
export interface ILoadedEventArgs extends IChartEventArgs {
    /** Defines the current chart instance */
    chart: Chart;
    theme?: ChartTheme;
}
export interface IPrintEventArgs extends IChartEventArgs {
    htmlContent: Element;
}
export interface IExportEventArgs extends IChartEventArgs {
    width: number;
    height: number;
}
export interface IAfterExportEventArgs extends IChartEventArgs {
    dataUrl: string;
}
export interface IZoomingEventArgs extends IChartEventArgs {
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
}
export interface IRangeSelectorRenderEventArgs extends IChartEventArgs {
    /** Defines selector collections */
    selector: ItemModel[];
    /** enable custom format for calendar */
    enableCustomFormat: boolean;
    /** content fro calendar format */
    content: string;
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
    /** Defines the name of the Event */
    name: string;
    /** Defines the previous size of the accumulation chart */
    previousSize: Size;
    /** Defines the current size of the accumulation chart */
    currentSize: Size;
    /** Defines the accumulation chart instance */
    chart: Chart | AccumulationChart | StockChart;
}
/**
 * Interface for point drag and drop
 */
export interface IDataEditingEventArgs {
    /**
     * current series index
     */
    seriesIndex: number;
    /**
     * Current point index
     */
    pointIndex: number;
    /**
     * current point old value
     */
    oldValue: number;
    /**
     * current point new value
     */
    newValue: number;
    /**
     * current series
     */
    series: Series;
    /**
     * current point
     */
    point: Points;
}
export interface IChartTemplate {
    /** point x */
    x?: object;
    /** point y */
    y?: object;
    /** point text */
    text?: string;
    /** point open value */
    open?: object;
    /** point close value */
    close?: object;
    /** point high value */
    high?: object;
    /** point low value */
    low?: object;
    /** point volume value */
    volume?: object;
}
