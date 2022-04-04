/* eslint-disable @typescript-eslint/member-delimiter-style */
/**
 * interface doc
 */
import { CircularGauge } from '../circular-gauge';
import { Axis, Pointer, Annotation, Range } from '../axes/axis';
import { FontModel } from '../model/base-model';
import { Size, GaugeLocation, Rect } from '../utils/helper-common';
import { TooltipSettings } from './base';
import { GaugeShape } from '../utils/enum';

/**
 * Specifies the event arguments of the circular gauge component.
 */
export interface ICircularGaugeEventArgs {
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
 * Specifies the event arguments of the print event.
 */
export interface IPrintEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the html content that is printed. The html content returned is usually the id string of the circular gauge.
     */
    htmlContent: Element;
}

/**
 * Specifies the event arguments of the loaded event in circular gauge.
 */
export interface ILoadedEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the instance of the circular gauge.
     */
    gauge: CircularGauge;
}

/**
 * Specifies the event arguments for the animation complete event in circular gauge.
 */
export interface IAnimationCompleteEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the instance of the axis in the circular gauge.
     */
    axis: Axis;
    /**
     * Specifies the instance of pointer in the circular gauge.
     */
    pointer: Pointer;
}

/**
 * Specifies the event arguments for the axis label render event in circular gauge.
 */
export interface IAxisLabelRenderEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the instance of the axis in circular gauge.
     */
    axis?: Axis;
    /**
     * Specifies the text of the axis labels in the axis of the circular gauge.
     */
    text: string;
    /**
     * Specifies the value of the axis labels in the axis of the circular gauge.
     */
    value: number;
}

/**
 * Specifies the event argument for the radius calculate event in circular gauge.
 */
export interface IRadiusCalculateEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the instance of the circular gauge component.
     */
    gauge?: CircularGauge;
    /**
     * Specifies the current radius of the circular gauge.
     */
    currentRadius: number;
    /**
     * Specifies the axis of the circular gauge.
     */
    axis?: Axis;
    /**
     * Specifies the location of the circular gauge.
     */
    midPoint: GaugeLocation;
}

/**
 * Specifies the event arguments for the tooltip render event in circular gauge.
 */
export interface ITooltipRenderEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the instance of circular gauge component.
     */
    gauge?: CircularGauge;
    /**
     * Specifies the pointer event for the tooltip in circular gauge.
     */
    event: PointerEvent;
    /**
     * Specifies the content for the tooltip in circular gauge.
     */
    content?: string;
    /**
     * Specifies the options to customize the tooltip in circular gauge.
     */
    tooltip?: TooltipSettings;
    /**
     * Specifies the location of the tooltip in circular gauge.
     */
    location?: GaugeLocation;
    /**
     * Specifies the axis of the circular gauge.
     */
    axis?: Axis;
    /**
     * Specifies the pointer of the circular gauge.
     */
    pointer?: Pointer;
    /**
     * Specifies the instance of annotation of the circular gauge.
     */
    annotation?: Annotation;
    /**
     * Specifies the instance of ranges of the circular gauge.
     */
    range?: Range;
    /**
     * Enables and disables the tooltip element to append in body.
     */
    appendInBodyTag: boolean;
    /**
     * Specifies the element type in which the tooltip is rendered. The element types are
     * range, annotation, and pointer of the circular gauge.
     */
    type: string;

}

/**
 * Specifies the event arguments for the annotation render event in circular gauge.
 */
export interface IAnnotationRenderEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the content of the annotation in circular gauge.
     */
    content?: string;
    /**
     * Specifies the style of the text in annotation of circular gauge.
     */
    textStyle?: FontModel;
    /**
     * Specifies the axis instance of the circular gauge.
     */
    axis?: Axis;
    /**
     * Specifies the annotation instance of the circular gauge.
     */
    annotation: Annotation;
}

/**
 * Specifies the event arguments for the drag start, drag move and drag end events in circular gauge.
 */
export interface IPointerDragEventArgs {
    /**
     * Specifies the name of the event.
     */
    name: string;
    /**
     * Specifies the axis instance of the circular gauge.
     */
    axis?: Axis;
    /**
     * Specifies the pointer instance of the circular gauge.
     */
    pointer?: Pointer;
    /**
     * Specifies the range instance of the circular gauge.
     */
    range?: Range;
    /**
     * Specifies the value of the pointer before it gets dragged.
     */
    currentValue?: number;
    /**
     * Specifies the value of the pointer after it gets dragged.
     */
    previousValue?: number;
    /**
     * Specifies the index of the pointer in circular gauge.
     */
    pointerIndex?: number;
    /**
     * Specifies the index of the axis in circular gauge.
     */
    axisIndex: number;
    /**
     * Specifies the index of the range in circular gauge.
     */
    rangeIndex ?: number;
    /**
     * Specifies the type of the pointer in circular gauge.
     */
    type ?: string;
}

/**
 * Specifies the event arguments for the resize event in circular gauge.
 */
export interface IResizeEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the size of the circular gauge before it gets resized.
     */
    previousSize: Size;
    /**
     * Specifies the size of the circular gauge after it gets resized.
     */
    currentSize: Size;
    /**
     * Specifies the instance of the circular gauge.
     */
    gauge?: CircularGauge;
}

/**
 * Specifies the event arguments for the mouse events in circular gauge.
 */
export interface IMouseEventArgs extends ICircularGaugeEventArgs {
    /**
     * Specifies the element on which the mouse operation is performed.
     */
    target: Element;
    /**
     * Specifies the x position of the target element in circular gauge.
     */
    x: number;
    /**
     * Specifies the y position of the target element in circular gauge.
     */
    y: number;
}

/**
 * Specifies the event arguments for the visible pointer.
 */
export interface IVisiblePointer {
    /**
     * Specifies the index value of the axis in circular gauge.
     */
    axisIndex?: number;
    /**
     * Specifies the index value of the pointer in circular gauge.
     */
    pointerIndex?: number;

}

/**
 * Specifies the visible range
 */
export interface IVisibleRange {
    /**
     * Specifies the index value of the axis in circular gauge.
     */
    axisIndex?: number;
    /**
     * Specifies the index value of the range in circular gauge.
     */
    rangeIndex?: number;

}

/**
 * Specifies the event arguments for the font settings of the axis label and legend in circular gauge.
 */
export interface IFontMapping {
    /**
     * Specifies the size of the label and legend text in circular gauge.
     */
    size?: string;
    /**
     * Specifies the color of the label and legend text in circular gauge.
     */
    color?: string;
    /**
     * Specifies the font weight of the label and legend text in circular gauge.
     */
    fontWeight?: string;
    /**
     * Specifies the font style of the label and legend text in circular gauge.
     */
    fontStyle?: string;
    /**
     * Specifies the font family of the label and legend text in circular gauge.
     */
    fontFamily?: string;
}
/**
 * Specifies the arguments for the theme style in circular gauge.
 */
export interface IThemeStyle {
    /** Specifies the background color for the circular gauge. */
    backgroundColor: string;
    /** Specifies the font color for the title of circular gauge. */
    titleFontColor: string;
    /** Specifies the color for the tooltip in circular gauge. */
    tooltipFillColor: string;
    /** Specifies the font color for tooltip of the circular gauge. */
    tooltipFontColor: string;
    /** Specifies the color for the axis line in circular gauge. */
    lineColor: string;
    /** Specifies the axis label in circular gauge. */
    labelColor: string;
    /** Specifies the color for the major ticks in circular gauge. */
    majorTickColor: string;
    /** Specifies the color for the minor ticks in circular gauge. */
    minorTickColor: string;
    /** Specifies the color of the pointer in circular gauge. */
    pointerColor: string;
    /** Specifies the color of the needle in circular gauge. */
    needleColor: string;
    /** Specifies the color for the needle tail in circular gauge. */
    needleTailColor: string;
    /** Specifies the color for the cap in circular gauge. */
    capColor: string;
    /** Specifies the font-family for the text in circular gauge. */
    fontFamily?: string;
    /** Specifies the font size for the text in circular gauge. */
    fontSize?: string;
    /** Specifies the font-family for the axis label in circular gauge. */
    labelFontFamily?: string;
    /** Specifies the opacity for the tooltip in circular gauge. */
    tooltipFillOpacity?: number;
    /** Specifies the opacity for the text in tooltip in circular gauge. */
    tooltipTextOpacity?: number;
    /** Specifies the font weight for the text in title in circular gauge. */
    titleFontWeight?: string;

}


/**
 * Specifies the event arguments for rendering a legend in circular gauge.
 */
export interface ILegendRenderEventArgs extends ICircularGaugeEventArgs {
    /** Specifies the shape of the legend in circular gauge. */
    shape: GaugeShape;
    /** Specifies the fill color of the legend in circular gauge. */
    fill: string;
    /** Specifies the text of the legend in circular gauge. */
    text: string;
}

/**
 * Specifies the arguments for the legend regions in circular gauge.
 */
export interface ILegendRegions {
    /**
     * Specifies the bounds for the legend in circular gauge.
     */
    rect: Rect;
    /**
     * Specifies the index value for the legend in circular gauge.
     */
    index: number;
}

