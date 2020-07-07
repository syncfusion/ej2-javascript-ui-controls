import { LinearGauge } from '../linear-gauge';
import { Axis, Pointer } from '../axes/axis';
import { Annotation, TooltipSettings } from '../model/base';
import { FontModel } from '../model/base-model';
import { Size, GaugeLocation } from '../utils/helper';

/**
 * @private
 * Specifies the event arguments of linear gauge.
 */
/** @private */
export interface ILinearGaugeEventArgs {
    /**
     * Specifies the name of the event.
     */
    name: string;
    /**
     * Specifies the cancel state for the event. The default value is false. If set as true, the event progress will be stopped.
     */
    cancel: boolean;
}
/**
 * Specifies the event arguments for print event in linear gauge.
 */
export interface IPrintEventArgs extends ILinearGaugeEventArgs {
    /**
     * Specifies the html content that is printed. The html content returned is usually the id string of the linear gauge.
     */
    htmlContent: Element;
}
/**
 * Specifies the event arguments for loaded event in linear gauge.
 */
export interface ILoadedEventArgs extends ILinearGaugeEventArgs {
    /**
     * Specifies the instance of linear gauge.
     */
    gauge: LinearGauge;
}
/**
 * Specifies the event arguments for load event in linear gauge.
 */
export interface ILoadEventArgs extends ILinearGaugeEventArgs {
    /**
     * Specifies the instance of linear gauge.
     */
    gauge: LinearGauge;
}
/**
 * Specifies the event arguments for animation completed event in linear gauge.
 */
export interface IAnimationCompleteEventArgs extends ILinearGaugeEventArgs {
    /**
     * Specifies the instance of axis in linear gauge.
     */
    axis: Axis;
    /**
     * Specifies the instance of pointer in linear gauge.
     */
    pointer: Pointer;
}
/**
 * Specifies the event arguments for axis label rendering event in linear gauge.
 */
export interface IAxisLabelRenderEventArgs extends ILinearGaugeEventArgs {
    /**
     * Specifies the instance of axis in linear gauge.
     */
    axis: Axis;
    /**
     * Specifies the text for the axis label.
     */
    text: string;
    /**
     * Specifies the value for the axis label.
     */
    value: number;
}

/**
 * Specifies the event arguments for tooltip event in linear gauge.
 */
export interface ITooltipRenderEventArgs extends ILinearGaugeEventArgs {
    /**
     * Specifies the instance of linear gauge component.
     */
    gauge: LinearGauge;
    /**
     * Specifies the mouse pointer event.
     */
    event: PointerEvent;
    /**
     * Specifies the content for the tooltip.
     */
    content?: string;
    /**
     * Specifies the options to customize the tooltip.
     */
    tooltip?: TooltipSettings;
    /**
     * Specifies the location of the tooltip in linear gauge.
     */
    location?: GaugeLocation;
    /**
     * Specifies the instance of axis.
     */
    axis: Axis;
    /**
     * Specifies the instance of pointer.
     */
    pointer: Pointer;
}
/**
 * Specifies the event arguments for annotation render event in linear gauge.
 */
export interface IAnnotationRenderEventArgs extends ILinearGaugeEventArgs {
    /**
     * Specifies the content for the annotation.
     */
    content?: string;
    /**
     * Specifies the options to customize the text in annotation.
     */
    textStyle?: FontModel;
    /**
     * Specifies the instance of annotation.
     */
    annotation: Annotation;
}
/**
 * Specifies the event arguments for mouse events in linear gauge.
 */
export interface IMouseEventArgs extends ILinearGaugeEventArgs {
    /**
     * Specifies the instance of linear gauge.
     */
    model?: LinearGauge;
    /**
     * Specifies the target element on which the mouse operation is performed.
     */
    target: Element;
    /**
     * Specifies the x position of the mouse event.
     */
    x: number;
    /**
     * Specifies the y position of the mouse event.
     */
    y: number;
}
/**
 * Specifies the event arguments for pointer drag event in linear gauge.
 */
export interface IPointerDragEventArgs {
    /**
     * Specifies the name of the event.
     */
    name: string;
    /**
     * Specifies the axis instance in linear gauge.
     */
    axis?: Axis;
    /**
     * Specifies the pointers instance in linear gauge 
     */
    pointer?: Pointer;
    /**
     * Specifies the value of the pointer after dragging the pointer.
     */
    currentValue: number;
    /**
     * Specifies the value of the pointer before dragging the pointer.
     */
    previousValue?: number;
    /**
     * Specifies the index value of the pointer that is dragged in linear gauge.
     */
    pointerIndex: number;
    /**
     * Specifies the index value of the axis on which the pointer is dragged.
     */
    axisIndex: number;

}
/**
 * Specifies the event arguments for resize event in linear gauge.
 */
export interface IResizeEventArgs {
    /**
     * Specifies the name of the event.
     */
    name: string;
    /**
     * Specifies the size of the linear gauge before resizing.
     */
    previousSize: Size;
    /**
     * Specifies the size of the linear gauge after resizing.
     */
    currentSize: Size;
    /**
     * Specifies the instance of linear gauge.
     */
    gauge: LinearGauge;
}
/**
 * Specifies the event arguments for value change event in linear gauge.
 */
export interface IValueChangeEventArgs {
    /**
     * Specifies the name of the event.
     */
    name: string;
    /**
     * Specifies the instance of the linear gauge.
     */
    gauge?: LinearGauge;
    /**
     * Specifies the element of the linear gauge.
     */
    element: Element;
    /**
     * specifies the index value of the current axis.
     */
    axisIndex: number;
    /**
     * Specifies the axis instance of linear gauge.
     */
    axis?: Axis;
    /**
     * Specifies the current pointer index in linear gauge.
     */
    pointerIndex: number;
    /**
     * Specifies the pointer instance of linear gauge.
     */
    pointer?: Pointer;
    /**
     * Specifies the current value.
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

/**
 * Specifies the theme style for linear gauge.
 */
export interface IThemeStyle {
    /**
     * Specifies the background color of linear gauge.
     */
    backgroundColor: string;
    /**
     * Specifies the text color for the title in  the linear gauge.
     */
    titleFontColor: string;
    /**
     * Specifies the fill color for the tooltip in the linear gauge.
     */
    tooltipFillColor: string;
    /**
     * Specifies the font color for the tooltip in the linear gauge.
     */
    tooltipFontColor: string;
    /**
     * Specifies the color of the axis line in the linear gauge.
     */
    lineColor: string;
    /**
     * Specifies the color of the label in the linear gage.
     */
    labelColor: string;
    /**
     * Specifies the color for major ticks in the linear gauge.
     */
    majorTickColor: string;
    /**
     * Specifies the color for minor ticks in the linear gauge.
     */
    minorTickColor: string;
    /**
     * Specifies the color for the linear gauge pointer.
     */
    pointerColor: string;
    /**
     * Specifies the font family of the text contents in linear gauge.
     */
    fontFamily?: string;
    /**
     * Specifies the font size of the text contents in linear gauge.
     */
    fontSize?: string;
    /**
     * Specifies the font family of the labels.
     */
    labelFontFamily?: string;
    /**
     * Specifies the opacity of the tooltip.
     */
    tooltipFillOpacity?: number;
    /**
     * Specifies the opacity of text content of the tooltip.
     */
    tooltipTextOpacity?: number;
    /**
     * Specifies the background color of the container.
     */
    containerBackground?: string;
}


