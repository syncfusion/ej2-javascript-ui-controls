import { LinearGauge } from '../linear-gauge';
import { Axis, Pointer } from '../axes/axis';
import { Annotation, TooltipSettings } from '../model/base';
import { FontModel } from '../model/base-model';
import { Size, GaugeLocation } from '../utils/helper';


/**
 * @private
 * Specifies LienarGauge Events
 */
/** @private */
export interface ILinearGaugeEventArgs {
    name: string;
    cancel: boolean;
}
/**
 * Gauge Loaded event arguments
 */
export interface ILoadedEventArgs extends ILinearGaugeEventArgs {
    /**
     * event argument gauge
     */
    gauge: LinearGauge;
}
/**
 * Gauge Load event arguments
 */
export interface ILoadEventArgs extends ILinearGaugeEventArgs {
    /**
     * event argument gauge
     */
    gauge: LinearGauge;
}
/**
 * Gauge animation completed event arguments
 */
export interface IAnimationCompleteEventArgs extends ILinearGaugeEventArgs {
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
 * Gauge axis label rendering event arguments
 */
export interface IAxisLabelRenderEventArgs extends ILinearGaugeEventArgs {
    /**
     * event argument axis
     */
    axis: Axis;
    /**
     * event argument text
     */
    text: string;
    /**
     * event argument value
     */
    value: number;
}

/**
 * Gauge tooltip event arguments
 */
export interface ITooltipRenderEventArgs extends ILinearGaugeEventArgs {
    /**
     * Instance of linear gauge component.
     */
    gauge: LinearGauge;
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
 * Gauge annotation render event arguments
 */
export interface IAnnotationRenderEventArgs extends ILinearGaugeEventArgs {
    /**
     * event argument content
     */
    content?: string;
    /**
     * event argument text style
     */
    textStyle?: FontModel;
    /**
     * event argument annotation
     */
    annotation: Annotation;
}
/**
 * Gauge mouse events args
 */
export interface IMouseEventArgs extends ILinearGaugeEventArgs {
    /**
     * event argument linear gauge model
     */
    model: LinearGauge;
    /**
     * event argument target
     */
    target: Element;
    /**
     * event argument x position
     */
    x: number;
    /**
     * event argument y position
     */
    y: number;
}
/**
 * Gauge resize event arguments
 */
export interface IResizeEventArgs {
    /**
     * event name
     */
    name: string;
    /**
     * event argument previous size
     */
    previousSize: Size;
    /**
     * event argument current size
     */
    currentSize: Size;
    /**
     * event argument gauge
     */
    gauge: LinearGauge;
}
/**
 * Gauge value change event arguments
 */
export interface IValueChangeEventArgs {
    /**
     * event name
     */
    name: string;
    /**
     * event argument gauge
     */
    gauge: LinearGauge;
    /**
     * event argument element
     */
    element: Element;
    /**
     * event argument axis index
     */
    axisIndex: number;
    /**
     * event argument axis
     */
    axis: Axis;
    /**
     * event argument pointer index
     */
    pointerIndex: number;
    /**
     * event argument pointer
     */
    pointer: Pointer;
    /**
     * event argument value
     */
    value: number;
}

/** @private */
export interface IVisiblePointer {

    axis?: Axis;

    axisIndex?: number;

    pointer?: Pointer;

    pointerIndex?: number;
}


/** @private */
export interface IMoveCursor {

    pointer?: boolean;

    style?: string;

}
