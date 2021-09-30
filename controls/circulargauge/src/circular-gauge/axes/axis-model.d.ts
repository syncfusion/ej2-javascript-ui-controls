import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';import { Font, Border } from '../model/base';import { Position, PointerRangePosition, PointerType, GaugeDirection, HiddenLabel, GaugeShape} from '../utils/enum';import { FontModel, BorderModel } from '../model/base-model';import { LinearGradientModel, RadialGradientModel } from './gradient-model';import { VisibleLabels, Size, Rect } from '../utils/helper-common';import { Theme } from '../model/theme';

/**
 * Interface for a class Line
 */
export interface LineModel {

    /**
     * Sets and gets the width of the line in circular gauge component.
     *
     * @default 2
     */

    width?: number;

    /**
     * Sets and gets the dash-array of the axis line in circular gauge component.
     *
     * @default ''
     */

    dashArray?: string;

    /**
     * Sets and gets the color of the axis line in the circular gauge component. This property accepts the value in hex code,
     * rgba string as a valid CSS color string.
     */

    color?: string;

}

/**
 * Interface for a class Label
 */
export interface LabelModel {

    /**
     * Sets and gets the options to customize the style of the text in axis labels in circular gauge component.
     */

    font?: FontModel;

    /**
     * Sets and gets the format for the axis label. This property accepts any global string format like 'C', 'n1', 'P' etc.
     * Also accepts placeholder like '{value}°C' in which value represent the axis label e.g. 20°C.
     *
     * @default ''
     */

    format?: string;

    /**
     * Sets and gets the position type to place the labels in the axis in the circular gauge component.
     *
     * @default Inside
     */

    position?: Position;

    /**
     * Sets and gets the label of an axis, which gets hidden when an axis makes a complete circle.
     *
     * @default None
     */

    hiddenLabel?: HiddenLabel;

    /**
     * Enables and disables the labels get rotated along the axis in the circular gauge component.
     *
     * @default false
     */
    autoAngle?: boolean;

    /**
     * Enables and disables the axis labels to use the range color of the axis.
     *
     * @default false
     */

    useRangeColor?: boolean;

    /**
     * Sets and gets the value to place the labels from the axis in circular gauge.
     *
     * @default 0
     */

    offset?: number;

    /**
     * Enables and disables the default padding value of axis labels in circular gauge component.
     *
     * @default true
     */

    shouldMaintainPadding?: boolean;

}

/**
 * Interface for a class Range
 */
export interface RangeModel {

    /**
     * Sets and gets the start value of the range in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default 0
     */

    start?: number;

    /**
     * Sets and gets the end value of the range in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default 0
     */

    end?: number;

    /**
     * Sets and gets the radius of the range for circular gauge component.
     *
     * @default null
     */

    radius?: string;

    /**
     * Sets and gets the width for the start of the range in the circular gauge component.
     *
     * @default '10'
     */

    startWidth?: number | string;

    /**
     * Sets and gets the width for the end of the range in the circular gauge component.
     *
     * @default '10'
     */

    endWidth?: number | string;

    /**
     * Sets and gets the color of the ranges in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    color?: string;

    /**
     * Sets and gets the corner radius for ranges in circular gauge component.
     *
     * @default 0
     */

    roundedCornerRadius?: number;

    /**
     * Sets and gets the opacity for the ranges in circular gauge component.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * Sets and gets the text for the legend in the circular gauge component.
     *
     * @default ''
     */
    legendText?: string;

    /**
     * Sets and gets the position of the range and pointer for an axis in circular gauge component.
     *
     * @default Auto
     */

    position?: PointerRangePosition;

    /**
     * Sets and gets the offset value of range in circular gauge component.
     *
     * @default '0'
     */
    offset?: number | string;

    /**
     * Sets and gets the properties to render a linear gradient for the range.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the range.
     *
     * @default null
     */
    linearGradient?: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for the range.
     *
     * @default null
     */
    radialGradient?: RadialGradientModel;

}

/**
 * Interface for a class Tick
 */
export interface TickModel {

    /**
     * Sets and gets the width of the ticks in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default 2
     */

    width?: number;

    /**
     * Sets and gets the height of the ticks in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    height?: number;

    /**
     * Sets and gets the interval between the tick lines in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    interval?: number;

    /**
     * Sets and gets the distance of the ticks from axis in circular gauge component.
     *
     * @default 0
     */

    offset?: number;

    /**
     * Sets and gets the color of the tick line. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    color?: string;

    /**
     * Sets and gets the position of the ticks in circular gauge component.
     *
     * @default Inside
     */

    position?: Position;

    /**
     * Enables and disables the tick lines to take the range color.
     *
     * @default false
     */

    useRangeColor?: boolean;

    /**
     * Sets and gets the dash-array for the ticks in circular gauge component.
     *
     * @default '0'
     */

    dashArray?: string;

}

/**
 * Interface for a class Cap
 */
export interface CapModel {

    /**
     * Sets and gets the color for the pointer cap in the circular gauge component.
     *
     * @default null
     */

    color?: string;

    /**
     * Sets and gets the properties to render a linear gradient for the cap of the needle pointer.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the cap.
     *
     * @default null
     */

    linearGradient?: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for cap of the needle pointer.
     *
     * @default null
     */

    radialGradient?: RadialGradientModel;

    /**
     * Sets and gets the border of the pointer cap in the circular gauge component.
     *
     */

    border?: BorderModel;

    /**
     * Sets and gets the radius of pointer cap in the circular gauge component.
     *
     * @default 8
     */

    radius?: number;

}

/**
 * Interface for a class NeedleTail
 */
export interface NeedleTailModel {

    /**
     * Sets and gets the color for the needle pointer in the circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    color?: string;

    /**
     * Sets and gets options to customize the color and width of the border for the pointer needle in the circular gauge component.
     */

    border?: BorderModel;

    /**
     * Sets and gets the length of the needle in pixels or in percentage in circular gauge component.
     *
     * @default '0%'
     */

    length?: string;

    /**
     * Sets and gets the properties to render a linear gradient for the tail of the needle pointer.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the needle tail.
     *
     * @default null
     */

    linearGradient?: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for tail of the needle pointer.
     *
     * @default null
     */

    radialGradient?: RadialGradientModel;

}

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * Enables and disables the pointer animation during initial rendering in circular gauge component.
     *
     * @default true
     */

    enable?: boolean;

    /**
     * Sets and gets the duration of animation in milliseconds in circular gauge component.
     *
     * @default 1000
     */

    duration?: number;

}

/**
 * Interface for a class Annotation
 */
export interface AnnotationModel {

    /**
     * Sets and gets the content of the annotation. This property accepts the id of the custom element.
     *
     * @default null
     */
    content?: string;

    /**
     * Sets and gets the angle for annotation with respect to axis in circular gauge component.
     *
     * @default 90
     */
    angle?: number;

    /**
     * Sets and gets the radius for annotation with respect to axis in circular gauge component.
     *
     * @default '50%'
     */
    radius?: string;

    /**
     * Sets and gets the z-index of an annotation in an axis in the circular gauge component.
     *
     * @default '-1'
     */
    zIndex?: string;

    /**
     * Enables and disables the annotation rotation along the axis.
     *
     * @default false
     */
    autoAngle?: boolean;

    /**
     * Sets and gets the style of the text in annotation.
     */

    textStyle?: FontModel;

    /**
     * Sets and gets the information about annotation for assistive technology.
     *
     * @default null
     */
    description?: string;

}

/**
 * Interface for a class Pointer
 */
export interface PointerModel {

    /**
     * Sets and gets the value of the pointer in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    value?: number;

    /**
     * Sets and gets the type of pointer for an axis in Circular gauge component.
     *
     * @default Needle
     */

    type?: PointerType;

    /**
     * Sets and gets the position of pointer for an axis.
     *
     * @default Auto
     */

    position?: PointerRangePosition;

    /**
     * Sets and gets the corner radius for pointer in axis.
     *
     * @default 0
     */

    roundedCornerRadius?: number;

    /**
     * Sets and gets the url for the image that is to be displayed as pointer.
     * It requires marker shape value to be Image.
     *
     * @default null
     */
    imageUrl?: string;

    /**
     * Sets and gets the radius of pointer for marker and range type pointer and fix length of pointer for needle pointer.
     *
     * @default null
     */
    radius?: string;

    /**
     * Sets and gets the width of the pointer in axis.
     *
     * @default 20
     */
    pointerWidth?: number;

    /**
     * Sets and gets the cap of pointer in an axis.
     */

    cap?: CapModel;

    /**
     * Sets and gets the style of text in pointer of an axis.
     */

    textStyle?: FontModel;

    /**
     * Sets and gets the tail of needle pointer in an axis.
     */

    needleTail?: NeedleTailModel;

    /**
     * Sets and gets the color of the pointer in an axis.
     */

    color?: string;

    /**
     * Sets and gets the options to customize the color and width of the border for the needle pointer in an axis.
     */

    border?: BorderModel;

    /**
     * Sets and gets the animation of pointers while rendering the axis in circular gauge.
     */

    animation?: AnimationModel;

    /**
     * Sets and gets the shape of the marker type pointer in an axis.
     *
     * @default Circle
     */

    markerShape?: GaugeShape;

    /**
     * Sets and gets the height of the marker pointer in an axis.
     *
     * @default 5
     */

    markerHeight?: number;

    /**
     * Sets and gets the text in pointer.
     *
     * @default ''
     */
    text?: string;

    /**
     * Sets and gets the information about pointer for assistive technology.
     *
     * @default null
     */
    description?: string;

    /**
     * Sets and gets the width of the marker pointer in an axis.
     *
     * @default 5
     */

    markerWidth?: number;

    /**
     * Sets and gets the offset value of pointer from scale.
     *
     * @default '0'
     */

    offset?: number | string;

    /**
     * Sets or gets the start width of the needle pointer in an axis.
     *
     * @default null
     */

    needleStartWidth?: number;

    /**
     * Sets or gets the end width of the needle pointer in an axis.
     *
     * @default null
     */

    needleEndWidth?: number;

    /**
     * Sets and gets the properties to render a linear gradient for the pointer.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the pointer.
     *
     * @default null
     */

    linearGradient?: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for pointer.
     *
     * @default null
     */

    radialGradient?: RadialGradientModel;

}

/**
 * Interface for a class Axis
 */
export interface AxisModel {

    /**
     * Sets and gets the minimum value of an axis in the circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    minimum?: number;

    /**
     * Sets and gets the maximum value of an axis in the circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    maximum?: number;

    /**
     * Enables and disables the last label of axis when it is hidden in circular gauge component.
     *
     * @default false
     */

    showLastLabel?: boolean;

    /**
     * Enables and disables the intersecting labels to be hidden in axis.
     *
     * @default false
     */

    hideIntersectingLabel?: boolean;

    /**
     * Sets and gets the rounding Off value in the label in an axis.
     *
     * @default null
     */

    roundingPlaces?: number;

    /**
     * Sets and gets the radius of an axis in circular gauge.
     *
     * @default null
     */

    radius?: string;

    /**
     * Sets and gets the style of the line in axis of circular gauge component.
     */

    lineStyle?: LineModel;

    /**
     * Sets and gets the ranges of an axis in circular gauge component.
     */

    ranges?: RangeModel[];

    /**
     * Sets and gets the pointers of an axis in circular gauge component.
     */

    pointers?: PointerModel[];

    /**
     * Sets and gets the annotation element for an axis in circular gauge component.
     */

    annotations?: AnnotationModel[];

    /**
     * Sets and gets the major tick lines of an axis in circular gauge component.
     *
     * @default { width: 2, height: 10 }
     */

    majorTicks?: TickModel;

    /**
     * Sets and gets the minor tick lines of an axis in circular gauge component.
     *
     * @default { width: 2, height: 5 }
     */

    minorTicks?: TickModel;

    /**
     * Sets and gets the start angle of an axis in circular gauge component.
     *
     * @default 200
     */

    startAngle?: number;

    /**
     * Sets and gets the end angle of an axis in circular gauge component.
     *
     * @default 160
     */

    endAngle?: number;

    /**
     * Sets and gets the direction of an axis.
     *
     * @default ClockWise
     */

    direction?: GaugeDirection;

    /**
     * Sets and gets the background color of an axis. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */
    background?: string;

    /**
     * Sets and gets the gap between the ranges by specified value in circular gauge component.
     *
     * @default null
     */
    rangeGap?: number;

    /**
     * Enables and disables the start and end gap between the ranges and axis in circular gauge.
     *
     * @default false
     */
    startAndEndRangeGap?: boolean;

    /**
     * Sets and gets the style of the axis label in circular gauge component.
     */

    labelStyle?: LabelModel;

}