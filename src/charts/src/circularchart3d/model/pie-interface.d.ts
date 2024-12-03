/**
 * Circular 3D chart interface file.
 */
import { Size } from '@syncfusion/ej2-svg-base';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { CircularChart3D } from '../circularchart3d';
import { CircularChart3DPoints, CircularChart3DSeries } from '../renderer/series';
import { LegendShape } from '../../common/utils/enum';
import { CircularChart3DTheme } from './enum';
import { CircularChart3DSeriesModel } from '../renderer/series-model';
import { CircularChart3DPointInformation } from './circular3d-base';
/**
 * Represents the arguments for a circular 3D chart event.
 *
 * @interface
 */
export interface CircularChart3DEventArgs {
    /** Defines the name of the event. */
    name?: string;
    /** Defines the event cancel status. */
    cancel: boolean;
}
/**
 * Circular 3D chart load or loaded event arguments.
 *
 * @interface
 * @extends CircularChart3DEventArgs
 */
export interface CircularChart3DLoadedEventArgs extends CircularChart3DEventArgs {
    /** Defines the circular 3D chart instance. */
    chart: CircularChart3D;
    /** Theme for the circular 3D chart. */
    theme?: CircularChart3DTheme;
}
/**
 * Circular 3D chart series render event arguments.
 *
 * @interface
 */
export interface CircularChart3DSeriesRenderEventArgs {
    /** Defines the current circular 3D series. */
    series: CircularChart3DSeries;
    /** Defines the current data object. */
    data: Object;
    /** Defines the current series name. */
    name: string;
}
/**
 * Represents the arguments for rendering the legend in a circular 3D chart.
 *
 * @interface
 * @extends CircularChart3DEventArgs
 */
export interface CircularChart3DLegendRenderEventArgs extends CircularChart3DEventArgs {
    /** Defines the current legend shape. */
    shape: LegendShape;
    /** Defines the current legend fill color. */
    fill: string;
    /** Defines the current legend text. */
    text: string;
}
/**
 * Represents the arguments for handling a legend click event in a circular 3D chart.
 *
 * @interface
 * @extends CircularChart3DEventArgs
 */
export interface CircularChart3DLegendClickEventArgs extends CircularChart3DEventArgs {
    /** Defines the chart when legendClick. */
    chart: CircularChart3D;
    /** Defines the current legend shape. */
    legendShape: LegendShape;
    /** Defines the current series. */
    series: CircularChart3DSeries;
    /** Defines the list of points mapped to a legend. */
    point: CircularChart3DPoints;
    /** Defines the current legend text. */
    legendText: string;
}
/**
 * Represents the arguments for the completion of a selection in a circular 3D chart.
 *
 * @interface
 * @extends CircularChart3DEventArgs
 */
export interface CircularChart3DSelectionCompleteEventArgs extends CircularChart3DEventArgs {
    /** Defines current selected Data X, Y values. */
    selectedDataValues: {
        x?: string | number | Date;
        y?: number;
        seriesIndex?: number;
        pointIndex?: number;
    }[];
}
/**
 * Circular 3D chart PointRender event arguments.
 *
 * @interface
 * @extends CircularChart3DEventArgs
 */
export interface CircularChart3DPointRenderEventArgs extends CircularChart3DEventArgs {
    /** Defines the current series of the point. */
    series: CircularChart3DSeries;
    /** Defines the current point. */
    point: CircularChart3DPoints;
    /** Defines the current point fill color. */
    fill: string;
}
/**
 * Circular 3D chart TextRender event arguments.
 *
 * @interface
 * @extends CircularChart3DEventArgs
 */
export interface CircularChart3DTextRenderEventArgs extends CircularChart3DEventArgs {
    /** Defines the current series. */
    series: CircularChart3DSeriesModel;
    /** Defines the current point. */
    point: CircularChart3DPoints;
    /** Defines the current text. */
    text: string;
    /** Defines the current fill color. */
    color: string;
    /** Defines the current label border. */
    border: BorderModel;
    /** Defines the current text template.
     *
     * @aspType string
     */
    template: string | Function;
    /** Defines the current font. */
    font: FontModel;
}
/**
 * Represents event arguments for circular 3D chart export.
 *
 * @interface
 * @extends CircularChart3DChartEventArgs
 */
export interface CircularChart3DExportEventArgs extends CircularChart3DEventArgs {
    /**
     * The width of the exported chart.
     */
    width: number;
    /**
     * The height of the exported chart.
     */
    height: number;
}
/**
 * Represents the arguments for the circular 3D print event in a chart.
 *
 * @interface
 * @extends CircularChart3DEventArgs
 */
export interface CircularChart3DPrintEventArgs extends CircularChart3DEventArgs {
    /** Specifies the HTML content to be printed. */
    htmlContent: Element;
}
/**
 * Interface representing the arguments passed to an event that occurs after exporting data.
 *
 * @interface
 */
export interface CircularChart3DAfterExportEventArgs {
    /** Specifies the event cancel status. */
    cancel: boolean;
    /** The data URL generated after exporting. */
    dataUrl: string;
}
/**
 * Represents event arguments for the resize event in a circular 3D chart.
 *
 * @interface
 */
export interface CircularChart3DResizeEventArgs {
    /** Defines the previous size of the circular 3D chart. */
    previousSize: Size;
    /** Defines the current size of the circular 3D chart. */
    currentSize: Size;
    /** Defines the circular 3D chart instance. */
    chart: CircularChart3D;
}
/**
 * Represents event arguments for the before resize event in a circular 3D chart.
 *
 * @interface
 */
export interface CircularChart3DBeforeResizeEventArgs {
    /** Specifies whether to cancel the resize event. */
    cancel: boolean;
}
/**
 * Represents event arguments for points in a circular 3D chart.
 *
 * @interface
 */
export interface CircularChart3DPointEventArgs {
    /** Defines the current series associated with the point. */
    series: CircularChart3DSeriesModel;
    /** Defines the current data point. */
    point: CircularChart3DPoints;
    /** Defines the index of the data point. */
    pointIndex: number;
    /** Defines the index of the series. */
    seriesIndex: number;
    /** Defines the current instance of the circular 3D chart. */
    chart: CircularChart3D;
    /** Defines the x-coordinate of the mouse pointer during the event. */
    x: number;
    /** Defines the x-coordinate of the mouse pointer during the event. */
    y: number;
    /** Defines the x-coordinate of the mouse pointer in the window's page coordinates. */
    pageX?: number;
    /** Defines the y-coordinate of the mouse pointer in the window's page coordinates. */
    pageY?: number;
}
/**
 * Represents event arguments for mouse interactions in a circular 3D chart.
 *
 * @interface
 * @extends CircularChart3DEventArgs
 */
export interface CircularChart3DMouseEventArgs extends CircularChart3DEventArgs {
    /** Defines the target element ID related to the mouse event. */
    target: string;
    /** Defines the x-coordinate of the mouse pointer during the event. */
    x: number;
    /** Defines the y-coordinate of the mouse pointer during the event. */
    y: number;
}
/**
 * Represents the arguments for rendering a tooltip in a circular 3D chart.
 *
 * @interface
 */
export interface CircularChart3DTooltipRenderEventArgs {
    /** Specifies whether to cancel the tooltip render. */
    cancel: boolean;
    /** Specifies a collection of tooltip text. */
    text?: string;
    /** Defines the style for tooltip text. */
    textStyle?: FontModel;
    /** Defines the current tooltip series. */
    series: CircularChart3DSeries;
    /** Defines the current tooltip point. */
    point: CircularChart3DPoints;
    /** Defines the header text for the tooltip. */
    headerText?: string;
    /** Defines the point information for the tooltip. */
    data?: CircularChart3DPointInformation;
    /** Defines the tooltip template. */
    template: string | Function;
}
/**
 * Interface representing attributes for a 3D circular chart polyline.
 */
export interface CircularChart3DPolyLineAttributes {
    /**  Unique identifier for the polyline. */
    id: string;
    /** The dash pattern of the polyline. */
    'stroke-dasharray': string;
    /** The width of the polyline stroke. */
    'stroke-width': number;
    /** The color of the polyline stroke. */
    stroke: string;
    /** The data attribute for the polyline. */
    d: string;
}
