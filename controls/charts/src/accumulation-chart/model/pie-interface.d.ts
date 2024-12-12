/**
 * Interface for Accumulation chart
 */
import { AccumulationSeries, AccPoints } from './acc-base';
import { AccumulationSeriesModel } from './acc-base-model';
import { IChartEventArgs } from '../../chart/model/chart-interface';
import { LegendShape, SelectionPattern } from '../../common/utils/enum';
import { Size } from '@syncfusion/ej2-svg-base';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { AccumulationChart } from '../accumulation';
import { AccumulationTheme } from './enum';
/**
 * Accumulation Chart SeriesRender event arguments.
 */
export interface IAccSeriesRenderEventArgs {
    /** Defines the series to be rendered. */
    series: AccumulationSeries;
    /** Defines the series data object. */
    data: Object;
    /** Defines the name of the event. */
    name: string;
}
/**
 * Accumulation Chart TextRender event arguments.
 */
export interface IAccTextRenderEventArgs extends IChartEventArgs {
    /** Defines the series of the labels. */
    series: AccumulationSeriesModel;
    /** Defines the point of the label. */
    point: AccPoints;
    /** Defines the text of the label. */
    text: string;
    /** Defines the fill color of the label. */
    color: string;
    /** Defines the border of the label. */
    border: BorderModel;
    /** Defines the template for the data label.
     *
     * @aspType string
     */
    template: string | Function;
    /** Defines the font used for the label. */
    font: FontModel;
}
export interface IAccLegendClickEventArgs extends IChartEventArgs {
    /** Defines the chart instance when the legend is clicked. */
    chart: AccumulationChart;
    /** Defines the shape of the clicked legend item. */
    legendShape: LegendShape;
    /** Defines the series associated with the clicked legend item. */
    series: AccumulationSeries;
    /** Defines the list of points mapped to the legend item. */
    point: AccPoints;
    /** Defines the text of the clicked legend item. */
    legendText: string;
}
/**
 * Accumulation Chart TooltipRender event arguments.
 */
export interface IAccTooltipRenderEventArgs extends IChartEventArgs {
    /** Defines the tooltip content. */
    content?: string | HTMLElement;
    /** Defines the tooltip text style. */
    textStyle?: FontModel;
    /** Defines the tooltip series. */
    series: AccumulationSeries;
    /** Defines the tooltip point. */
    point: AccPoints;
    /** Defines the tooltip text. */
    text: string;
}
/**
 * Accumulation Chart AnimationComplete event arguments.
 */
export interface IAccAnimationCompleteEventArgs extends IChartEventArgs {
    /** Defines the animation series. */
    series: AccumulationSeries;
    /** Defines the accumulation chart instance. */
    accumulation: AccumulationChart;
    /** Defines the chart instance. */
    chart: AccumulationChart;
}
/**
 * Accumulation Chart SelectionComplete event arguments.
 */
export interface IAccSelectionCompleteEventArgs extends IChartEventArgs {
    /** Defines the selected X and Y values of the data. */
    selectedDataValues: {
        x?: string | number | Date;
        y?: number;
        seriesIndex?: number;
        pointIndex?: number;
    }[];
}
/**
 * Accumulation Chart Before Resize event arguments.
 */
export interface IAccBeforeResizeEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Indicates whether the resizing event should be canceled. */
    cancelResizedEvent: boolean;
}
/**
 * Accumulation Chart Resize event arguments.
 */
export interface IAccResizeEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Defines the previous size of the accumulation chart before resizing. */
    previousSize: Size;
    /** Defines the size of the accumulation chart after resizing. */
    currentSize: Size;
    /** Defines the instance of the accumulation chart that has been resized. */
    accumulation: AccumulationChart;
    /** Defines the instance of the chart that has been resized. */
    chart: AccumulationChart;
}
/**
 * Accumulation Chart PointRender event arguments.
 */
export interface IAccPointRenderEventArgs extends IChartEventArgs {
    /** Defines the series of the point. */
    series: AccumulationSeries;
    /** Defines the point. */
    point: AccPoints;
    /** Defines the point fill color. */
    fill: string;
    /** Defines the point border. */
    border: BorderModel;
    /** Defines the point height. */
    height?: number;
    /** Defines the point width. */
    width?: number;
    /** Defines the current point fill pattern. */
    pattern: SelectionPattern;
}
/**
 * Accumulation Chart Load or Loaded event arguments.
 */
export interface IAccLoadedEventArgs extends IChartEventArgs {
    /** Defines the instance of the accumulation chart. */
    accumulation: AccumulationChart;
    /** Defines the instance of the chart. */
    chart: AccumulationChart;
    /** Defines the theme applied to the accumulation chart, if available. */
    theme?: AccumulationTheme;
}
export interface IAccLegendRenderEventArgs extends IChartEventArgs {
    /** Defines the legend shape. */
    shape: LegendShape;
    /** Defines the legend fill color. */
    fill: string;
    /** Defines the legend text. */
    text: string;
}
export interface IAccumulationChartTemplate {
    /** Accumulation point x value. */
    x?: Object;
    /** Accumulation point y value. */
    y?: object;
    /** Accumulation point color. */
    label?: string;
    /** Accumulation point percentage value. */
    percentage?: number;
}
