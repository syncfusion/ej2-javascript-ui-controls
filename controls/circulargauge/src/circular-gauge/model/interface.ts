/**
 * interface doc
 */
import { CircularGauge } from '../circular-gauge';
import { Axis, Pointer, Annotation } from '../axes/axis';
import { FontModel } from '../model/base-model';
import { Size, GaugeLocation } from '../utils/helper';
import { TooltipSettings } from './base';

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
 */
export interface IAxisLabelRenderEventArgs extends ICircularGaugeEventArgs {
    /**
     * axis event argument 
     */
    axis: Axis;
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
 * Specifies TooltipRender event arguments for circular gauge.
 */
export interface ITooltipRenderEventArgs extends ICircularGaugeEventArgs {
    /**
     * Instance of linear gauge component.
     */
    gauge: CircularGauge;
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
    axis: Axis;
    /**
     * event argument pointer
     */
    pointer: Pointer;
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
    axis: Axis;
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
    axis: Axis;
    /**
     * pointer event argument 
     */
    pointer: Pointer;
    /**
     * currentValue event argument 
     */
    currentValue: number;
    /**
     * previousValue event argument 
     */
    previousValue?: number;
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
    gauge: CircularGauge;
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