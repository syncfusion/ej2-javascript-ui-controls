/**
 * Interface for Accumulation chart
 */
import { AccumulationSeries, AccPoints } from './acc-base';
import { AccumulationSeriesModel } from './acc-base-model';
import { IChartEventArgs } from '../../chart/model/chart-interface';
import { LegendShape } from '../../chart/utils/enum';
import { Size } from '@syncfusion/ej2-svg-base';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { AccumulationChart } from '../accumulation';
import { AccumulationTheme } from './enum';
/**
 * Accumulation Chart SeriesRender event arguments.
 */
export interface IAccSeriesRenderEventArgs {
    /** Defines the current series */
    series: AccumulationSeries;
    /** Defines the current data object */
    data: Object;
    /** Defines the current series name */
    name: string;
}
/**
 * Accumulation Chart TextRender event arguments.
 */
export interface IAccTextRenderEventArgs extends IChartEventArgs {
    /** Defines the current series */
    series: AccumulationSeriesModel;
    /** Defines the current point */
    point: AccPoints;
    /** Defines the current text */
    text: string;
    /** Defines the current fill color */
    color: string;
    /** Defines the current label border */
    border: BorderModel;
    /** Defines the current text template */
    template: string;
    /** Defines the current font */
    font: FontModel;
}
/**
 * Accumulation Chart TooltipRender event arguments.
 */
export interface IAccTooltipRenderEventArgs extends IChartEventArgs {
    /** Defines the current tooltip content */
    content?: string | HTMLElement;
    /** Defines the current tooltip text style */
    textStyle?: FontModel;
    /** Defines the current tooltip series */
    series: AccumulationSeries;
    /** Defines the current tooltip point */
    point: AccPoints;
}
/**
 * Accumulation Chart AnimationComplete event arguments.
 */
export interface IAccAnimationCompleteEventArgs extends IChartEventArgs {
    /** Defines the current animation series */
    series: AccumulationSeries;
    /** Defines the accumulation chart instance */
    accumulation: AccumulationChart;
    /** Defines the accumulation chart instance */
    chart: AccumulationChart;
}
/**
 * Accumulation Chart Resize event arguments.
 */
export interface IAccResizeEventArgs {
    /** Defines the name of the Event */
    name: string;
    /** Defines the previous size of the accumulation chart */
    previousSize: Size;
    /** Defines the current size of the accumulation chart */
    currentSize: Size;
    /** Defines the accumulation chart instance */
    accumulation: AccumulationChart;
    /** Defines the accumulation chart instance */
    chart: AccumulationChart;
}
/**
 * Accumulation Chart Before Resize event arguments.
 */
export interface IAccBeforeResizeEventArgs {
    /** Defines the name of the Event */
    name: string;
    /** It is  used to cancel the resized event */
    cancelResizedEvent: boolean;
}
/**
 * Accumulation Chart PointRender event arguments.
 */
export interface IAccPointRenderEventArgs extends IChartEventArgs {
    /** Defines the current series of the point */
    series: AccumulationSeries;
    /** Defines the current point */
    point: AccPoints;
    /** Defines the current point fill color */
    fill: string;
    /** Defines the current point border color */
    border: BorderModel;
    /** Defines the current point height */
    height?: number;
    /** Defines the current point width */
    width?: number;
}
/**
 * Accumulation Chart Load or Loaded event arguments.
 */
export interface IAccLoadedEventArgs extends IChartEventArgs {
    /** Defines the accumulation chart instance */
    accumulation: AccumulationChart;
    /** Defines the accumulation chart instance */
    chart: AccumulationChart;
    /** Theme for the accumulation Chart */
    theme?: AccumulationTheme;
}
export interface IAccLegendRenderEventArgs extends IChartEventArgs {
    /** Defines the current legend shape */
    shape: LegendShape;
    /** Defines the current legend fill color */
    fill: string;
    /** Defines the current legend text */
    text: string;
}
export interface IAccumulationChartTemplate {
    /** accumulation point x value */
    x?: Object;
    /** accumulation point y value */
    y?: object;
    /** accumulation point color */
    label?: string;
    /** accumulation point percentage value */
    percentage?: number;
}
