/**
 * interface doc
 */
import { CircularGauge } from '../circular-gauge';
import { Axis, Pointer, Annotation, Range } from '../axes/axis';
import { FontModel } from '../model/base-model';
import { Size, GaugeLocation, Rect } from '../utils/helper';
import { TooltipSettings } from './base';
import { GaugeShape } from '../utils/enum';

/**
 * Specifies Circular-Gauge Events
 */
export interface ICircularGaugeEventArgs {
    /**
     * name of the event
     */
    name: string;
    /**
     * to cancel the event
     */
    cancel: boolean;
}

/**
 * Specifies Loaded event arguments for circular gauge.
 */
export interface ILoadedEventArgs extends ICircularGaugeEventArgs {
    /**
     * gauge event argument 
     */
    gauge: CircularGauge;
}

/**
 * Specifies AnimationComplete event arguments for circular gauge.
 */
export interface IAnimationCompleteEventArgs extends ICircularGaugeEventArgs {
    /**
     * axis event argument 
     */
    axis: Axis;
    /**
     * pointer event argument 
     */
    pointer: Pointer;
}

/**
 * Specifies AxisLabelRender event arguments for circular gauge.
 * @deprecated
 */
export interface IAxisLabelRenderEventArgs extends ICircularGaugeEventArgs {
    /**
     * axis event argument 
     */
    axis?: Axis;
    /**
     * text event argument 
     */
    text: string;
    /**
     * value event argument 
     */
    value: number;
}

/**
 * Specifies radiusRender event arguments for circular gauge
 */
export interface IRadiusCalculateEventArgs extends ICircularGaugeEventArgs {
    /**
     * Instance of Circular gauge component
     */
    gauge?: CircularGauge;
    /**
     * current radius event argument
     */
    currentRadius: number;
    /**
     * axis event argument
     */
    axis?: Axis;
    /**
     * midpoint event argument
     */
    midPoint: GaugeLocation;
}

/**
 * Specifies TooltipRender event arguments for circular gauge.
 */
export interface ITooltipRenderEventArgs extends ICircularGaugeEventArgs {
    /**
     * Instance of linear gauge component.
     */
    gauge?: CircularGauge;
    /**
     * Tooltip event
     */
    event: PointerEvent;
    /**
     * Render the tooltip content
     */
    content?: string;
    /**
     * Tooltip configuration
     */
    tooltip?: TooltipSettings;
    /**
     * Render the tooltip location
     */
    location?: GaugeLocation;
    /**
     * event argument axis
     */
    axis?: Axis;
    /**
     * event argument pointer
     */
    pointer?: Pointer;
    /**
     * event argument annotation
     */
    annotation?: Annotation;
    /**
     * event argument range
     */
    range?: Range;
    /**
     * event tooltip argument as append to body
     */
    appendInBodyTag: Boolean;

}

/**
 * Specifies AnnotationRender event arguments for circular gauge.
 */
export interface IAnnotationRenderEventArgs extends ICircularGaugeEventArgs {
    /**
     * content event argument 
     */
    content?: string;
    /**
     * textStyle event argument 
     */
    textStyle?: FontModel;
    /**
     * axis event argument 
     */
    axis?: Axis;
    /**
     * annotation event argument 
     */
    annotation: Annotation;
}

/**
 * Specifies DragStart, DragMove and DragEnd events arguments for circular gauge.
 */
export interface IPointerDragEventArgs {
    /**
     * name event argument 
     */
    name: string;
    /**
     * axis event argument 
     */
    axis?: Axis;
    /**
     * pointer event argument 
     */
    pointer?: Pointer;
    /**
     * currentValue event argument 
     */
    currentValue: number;
    /**
     * previousValue event argument 
     */
    previousValue?: number;
    /**
     * index of the current pointer argument 
     */
    pointerIndex: number;
    /**
     * index of the current pointer`s axis argument 
     */
    axisIndex: number;
}

/**
 * Specifies Resize event arguments for circular gauge.
 */
export interface IResizeEventArgs {
    /**
     * name event argument 
     */
    name: string;
    /**
     * previousSize event argument 
     */
    previousSize: Size;
    /**
     * currentSize event argument 
     */
    currentSize: Size;
    /**
     * gauge event argument 
     */
    gauge?: CircularGauge;
}

/**
 * Specifies Mouse events arguments for circular gauge.
 */
export interface IMouseEventArgs extends ICircularGaugeEventArgs {
    /**
     * target event argument 
     */
    target: Element;
    /**
     * x event argument 
     */
    x: number;
    /**
     * y event argument 
     */
    y: number;
}

/**
 * Specifies visible point
 */
export interface IVisiblePointer {
    /**
     * axisIndex event argument 
     */
    axisIndex?: number;
    /**
     * pointerIndex event argument 
     */
    pointerIndex?: number;

}

/**
 * Specifies font mapping
 */
export interface IFontMapping {
    /**
     * size event argument 
     */
    size?: string;
    /**
     * color event argument 
     */
    color?: string;
    /**
     * fontWeight event argument 
     */
    fontWeight?: string;
    /**
     * fontStyle event argument 
     */
    fontStyle?: string;
    /**
     * fontFamily event argument 
     */
    fontFamily?: string;
}

export interface IThemeStyle {

    backgroundColor: string;

    titleFontColor: string;

    tooltipFillColor: string;

    tooltipFontColor: string;

    lineColor: string;

    labelColor: string;

    majorTickColor: string;

    minorTickColor: string;

    pointerColor: string;

    needleColor: string;

    needleTailColor: string;

    capColor: string;

    fontFamily?: string;

    fontSize?: string;

    labelFontFamily?: string;

    tooltipFillOpacity?: number;

    tooltipTextOpacity?: number;

}

export interface ILegendRenderEventArgs extends ICircularGaugeEventArgs {
    /** Defines the current legend shape */
    shape: GaugeShape;
    /** Defines the current legend fill color */
    fill: string;
    /** Defines the current legend text */
    text: string;
}

export interface ILegendRegions {
    rect: Rect;
    index: number;
}