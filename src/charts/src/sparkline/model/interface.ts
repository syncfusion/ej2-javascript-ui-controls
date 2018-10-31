/**
 * Sparkline interface file.
 */
import { Sparkline } from '../sparkline';
import { SparklineBorderModel, SparklineFontModel } from './base-model';
import { Size } from '../utils/helper';
/**
 * Specifies sparkline Events
 * @private
 */
export interface ISparklineEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
}
/**
 * Specifies the Loaded Event arguments.
 */
export interface ISparklineLoadedEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
}
/**
 * Specifies the Load Event arguments.
 */
export interface ISparklineLoadEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
}
/**
 * Specifies the axis rendering Event arguments.
 */
export interface IAxisRenderingEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
    /** Defines the sparkline axis min x */
    minX: number;
    /** Defines the sparkline axis max x */
    maxX: number;
    /** Defines the sparkline axis min y */
    minY: number;
    /** Defines the sparkline axis max y */
    maxY: number;
    /** Defines the sparkline axis value */
    value: number;
    /** Defines the sparkline axis line color */
    lineColor: string;
    /** Defines the sparkline axis line width */
    lineWidth: number;
}
/**
 * Specifies the sparkline series rendering Event arguments.
 */
export interface ISeriesRenderingEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
    /** Defines the sparkline series fill color */
    fill: string;
    /** Defines the sparkline series line width for applicable line and area. */
    lineWidth: number;
    /** Defines the current sparkline series border */
    border: SparklineBorderModel;
}
/**
 * Specifies the sparkline point related Event arguments.
 */
export interface ISparklinePointEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
    /** Defines the current sparkline point index */
    pointIndex: number;
    /** Defines the current sparkline point fill color */
    fill: string;
    /** Defines the current sparkline point border */
    border: SparklineBorderModel;
}
/**
 * Specifies the sparkline mouse related Event arguments.
 */
export interface ISparklineMouseEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
    /** Defines the current sparkline mouse event */
    event: PointerEvent | MouseEvent;
}
/**
 * Specifies the sparkline mouse point region Event arguments.
 */
export interface IPointRegionEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
    /** Defines the sparkline point index region event  */
    pointIndex: number;
    /** Defines the current sparkline mouse event */
    event: PointerEvent | MouseEvent;
}
/**
 * Specifies the sparkline datalabel rendering Event arguments.
 */
export interface IDataLabelRenderingEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
    /** Defines the current sparkline label text */
    text: string;
    /** Defines the current sparkline label text location x */
    x: number;
    /** Defines the current sparkline label text location y */
    y: number;
    /** Defines the current sparkline label text color */
    color: string;
    /** Defines the current sparkline label rect fill color */
    fill: string;
    /** Defines the current sparkline label rect border */
    border: SparklineBorderModel;
    /** Defines the current sparkline label point index */
    pointIndex: number;
}
/**
 * Specifies the sparkline marker rendering Event arguments.
 */
export interface IMarkerRenderingEventArgs extends ISparklineEventArgs {
    /** Defines the current sparkline instance */
    sparkline: Sparkline;
    /** Defines the current sparkline marker location x */
    x: number;
    /** Defines the current sparkline marker location y */
    y: number;
    /** Defines the sparkline marker radius */
    size: number;
    /** Defines the current sparkline marker fill color */
    fill: string;
    /** Defines the current sparkline marker border */
    border: SparklineBorderModel;
    /** Defines the current sparkline label point index */
    pointIndex: number;
}

/**
 * Sparkline Resize event arguments.
 */
export interface ISparklineResizeEventArgs {
    /** Defines the name of the Event */
    name: string;
    /** Defines the previous size of the sparkline */
    previousSize: Size;
    /** Defines the current size of the sparkline */
    currentSize: Size;
    /** Defines the sparkline instance */
    sparkline: Sparkline;
}
/**
 * Sparkline tooltip event args.
 */
export interface ITooltipRenderingEventArgs extends ISparklineEventArgs {
    /** Defines tooltip text */
    text?: string[];
    /** Defines tooltip text style */
    textStyle?: SparklineFontModel;
}
