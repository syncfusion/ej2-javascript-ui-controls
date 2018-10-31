import { Chart, Alignment } from '../../chart';
import { AxisModel } from '../../chart/axis/axis-model';
import { Axis, VisibleRangeModel } from '../../chart/axis/axis';
import { SeriesModel } from '../../chart/series/chart-series-model';
import { Series, Points } from '../../chart/series/chart-series';
import { LegendShape, ChartShape } from '../../chart/utils/enum';
import { BorderModel, FontModel } from './base-model';
import { ChartLocation, Size } from '../utils/helper';
import { AccPoints, AccumulationSeries } from '../../accumulation-chart/model/acc-base';
import { AccumulationChart } from '../../accumulation-chart';
import { RangeNavigator } from '../../range-navigator';

export interface IChartEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
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
export interface IAccLegendRenderEventArgs extends IChartEventArgs {
    /** Defines the current legend shape */
    shape: LegendShape;
    /** Defines the current legend fill color */
    fill: string;
    /** Defines the current legend text */
    text: string;
}
export interface ITextRenderEventArgs extends IChartEventArgs {
    /** Defines the current series of the label */
    series: SeriesModel;
    /** Defines the current point of the label */
    point: Points;
    /** Defines the current text */
    text: string;
    /** Defines the current label fill color */
    color: string;
    /** Defines the current label border */
    border: BorderModel;
    /** Defines the current label template */
    template: string;
    /** Defines the current font */
    font: FontModel;
}
export interface IAnnotationRenderEventArgs extends IChartEventArgs {
    /** Defines the current annotation content */
    content: HTMLElement;
    /** Defines the current annotation location */
    location: ChartLocation;
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
export interface IAxisRangeCalculatedEventArgs extends IChartEventArgs {
    /** Defines the current axis */
    axis: Axis;
    /** Defines axis current range */
    minimum: number;
    /** Defines axis current range */
    maximum : number;
    /** Defines axis current interval */
    interval: number;
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
    /** Defines the header text for tooltip */
    headerText?: string;
}
export interface IMouseEventArgs extends IChartEventArgs {
    /** Defines current mouse event target id */
    target: string;
    /** Defines current mouse x location */
    x: number;
    /** Defines current mouse y location */
    y: number;
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
}
/** @private */
export interface IFontMapping {
    size?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    fontFamily?: string;
    opacity?: number;
}
/** @private */
export interface ITouches {
    pageX?: number;
    pageY?: number;
    pointerId?: number;
}
/** @private */
export interface IShapes {
    renderOption?: Object;
    functionName?: string;
}

/** @private */
export interface IZoomAxisRange {
    actualMin?: number;
    actualDelta?: number;
    min?: number;
    delta?: number;
}
export interface IDragCompleteEventArgs extends IChartEventArgs {
    /** Defines current selected Data X, Y values */
    selectedDataValues: { x: string, y: number }[][];
}
export interface ILoadedEventArgs extends IChartEventArgs {
    /** Defines the current chart instance */
    chart: Chart;
}
export interface IAnimationCompleteEventArgs extends IChartEventArgs {
    /** Defines the current animation series */
    series: Series;
}
export interface IPrintEventArgs extends IChartEventArgs {
    htmlContent: Element;
}

export interface IResizeEventArgs  {
    /** Defines the name of the Event */
    name: string;
    /** Defines the previous size of the accumulation chart */
    previousSize: Size;
    /** Defines the current size of the accumulation chart */
    currentSize: Size;
    /** Defines the accumulation chart instance */
    chart: Chart | AccumulationChart;
    /** Defines the name of event */
}
export interface IResizeRangeNavigatorEventArgs  {
    /** Defines the name of the Event */
    name: string;
    /** Defines the previous size of the accumulation chart */
    previousSize: Size;
    /** Defines the current size of the accumulation chart */
    currentSize: Size;
    /** Defines the range navigator instance */
    rangeNavigator: RangeNavigator;
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
    errorBar : string;
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

/** @private */
/**
 * Specifies the Theme style for scrollbar.
 */
export interface IScrollbarThemeStyle {
    backRect: string;
    thumb: string;
    circle: string;
    circleHover: string;
    arrow: string;
    grip: string;
    arrowHover?: string;
    backRectBorder?: string;
}

/**
 * Defines the scroll events
 */
export interface IScrollEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the current Zoom Position */
    zoomPosition: number;
    /** Defines the current Zoom Factor */
    zoomFactor: number;
    /** Defines the current range */
    range: VisibleRangeModel;
    /** Defines the previous Zoom Position */
    previousZoomPosition?: number;
    /** Defines the previous Zoom Factor */
    previousZoomFactor?: number;
    /** Defines the previous range */
    previousRange?: VisibleRangeModel;
    /** Defines the current scroll axis */
    axis: Axis;
}