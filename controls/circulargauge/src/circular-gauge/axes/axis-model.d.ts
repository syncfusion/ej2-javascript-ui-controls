import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';import { Font, Border } from '../model/base';import { Position, PointerType, GaugeDirection, HiddenLabel, GaugeShape } from '../utils/enum';import { FontModel, BorderModel } from '../model/base-model';import { Size, Rect, VisibleLabels } from '../utils/helper';import { Theme } from '../model/theme';

/**
 * Interface for a class Line
 */
export interface LineModel {

    /**
     * The width of the line in pixels.

     */

    width?: number;

    /**
     * The dash array of the axis line.

     */

    dashArray?: string;

    /**
     * The color of the axis line, which accepts value in hex, rgba as a valid CSS color string.
     */

    color?: string;

}

/**
 * Interface for a class Label
 */
export interface LabelModel {

    /**
     * The font of the axis labels
     */

    font?: FontModel;

    /**
     * To format the axis label, which accepts any global string format like 'C', 'n1', 'P' etc.
     * Also accepts placeholder like '{value}°C' in which value represent the axis label e.g. 20°C.

     */

    format?: string;

    /**
     * Specifies the position of the labels. They are,
     * * inside -  Places the labels inside the axis.
     * * outside - Places the labels outside of the axis.

     */

    position?: Position;

    /**
     * Specifies the label of an axis, which must get hide when an axis makes a complete circle. They are
     * * first -  Hides the 1st label on intersect.
     * * last - Hides the last label on intersect.
     * * none - Places both the labels.

     */

    hiddenLabel?: HiddenLabel;

    /**
     * if set true, the labels will get rotated along the axis.

     */
    autoAngle?: boolean;

    /**
     * If set true, labels takes the range color.

     */

    useRangeColor?: boolean;

    /**
     * Distance of the labels from axis in pixel.

     */

    offset?: number;

}

/**
 * Interface for a class Range
 */
export interface RangeModel {

    /**
     * Specifies the minimum value of the range.


     */

    start?: number;

    /**
     * Specifies the maximum value of the range.


     */

    end?: number;

    /**
     * The radius of the range in pixels or in percentage.

     */

    radius?: string;

    /**
     * Specifies the start width of the ranges

     */

    startWidth?: number | string;

    /**
     * Specifies the end width of the ranges

     */

    endWidth?: number | string;

    /**
     * Specifies the color of the ranges


     */

    color?: string;

    /**
     * Specifies the rounded corner radius for ranges.

     */

    roundedCornerRadius?: number;

    /**
     * Specifies the opacity for ranges.

     */

    opacity?: number;

    /**
     * Specifies the text for legend.

     */
    legendText?: string;

}

/**
 * Interface for a class Tick
 */
export interface TickModel {

    /**
     * The width of the ticks in pixels.


     */

    width?: number;

    /**
     * The height of the line in pixels.


     */

    height?: number;

    /**
     * Specifies the interval of the tick line.


     */

    interval?: number;

    /**
     * Distance of the ticks from axis in pixel.

     */

    offset?: number;

    /**
     * The color of the tick line, which accepts value in hex, rgba as a valid CSS color string.


     */

    color?: string;

    /**
     * Specifies the position of the ticks. They are
     * * inside -  Places the ticks inside the axis.
     * * outside - Places the ticks outside of the axis.

     */

    position?: Position;

    /**
     * If set true, major ticks takes the range color.

     */

    useRangeColor?: boolean;

}

/**
 * Interface for a class Cap
 */
export interface CapModel {

    /**
     * The color of the cap.

     */

    color?: string;

    /**
     * Options for customizing the border of the cap.
     */

    border?: BorderModel;

    /**
     * Radius of the cap in pixels.

     */

    radius?: number;

}

/**
 * Interface for a class NeedleTail
 */
export interface NeedleTailModel {

    /**
     * The color of the back needle.


     */

    color?: string;

    /**
     * Options for customizing the border of the back needle.
     */

    border?: BorderModel;

    /**
     * The radius of the back needle in pixels or in percentage.

     */

    length?: string;

}

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * If set true, pointers get animate on initial loading.

     */

    enable?: boolean;

    /**
     * Duration of animation in milliseconds.

     */

    duration?: number;

}

/**
 * Interface for a class Annotation
 */
export interface AnnotationModel {

    /**
     * Content of the annotation, which accepts the id of the custom element.

     */
    content?: string;

    /**
     * Angle for annotation with respect to axis.

     */
    angle?: number;

    /**
     * Radius for annotation with respect to axis.

     */
    radius?: string;

    /**
     * Order of an annotation in an axis.

     */
    zIndex?: string;

    /**
     * Rotates the annotation along the axis.

     */
    autoAngle?: boolean;

    /**
     * Options for customizing the annotation text.
     */

    textStyle?: FontModel;

    /**
     * Information about annotation for assistive technology.

     */
    description?: string;

}

/**
 * Interface for a class Pointer
 */
export interface PointerModel {

    /**
     * Specifies the value of the pointer.


     */

    value?: number;

    /**
     * Specifies the type of pointer for an axis.
     * * needle -  Renders a needle.
     * * marker - Renders a marker.
     * * rangeBar - Renders a rangeBar.

     */

    type?: PointerType;

    /**
     * Specifies the rounded corner radius for pointer.

     */

    roundedCornerRadius?: number;

    /**
     * The URL for the Image that is to be displayed as pointer.
     * It requires marker shape value to be Image.

     */
    imageUrl?: string;

    /**
     * Length of the pointer in pixels or in percentage.

     */
    radius?: string;

    /**
     * Width of the pointer in pixels.

     */
    pointerWidth?: number;

    /**
     * Options for customizing the cap
     */

    cap?: CapModel;

    /**
     * Options for customizing the back needle.
     */

    needleTail?: NeedleTailModel;

    /**
     * The color of the pointer.
     */

    color?: string;

    /**
     * Options for customizing the border of the needle.
     */

    border?: BorderModel;

    /**
     * Configures the animation of pointers.
     */

    animation?: AnimationModel;

    /**
     * Specifies the shape of the marker. They are
     * * circle - Renders a circle.
     * * rectangle - Renders a rectangle.
     * * triangle - Renders a triangle.
     * * diamond - Renders a diamond.
     * * invertedTriangle - Renders a invertedTriangle.
     * * image - Renders a image.

     */

    markerShape?: GaugeShape;

    /**
     * The height of the marker in pixels.

     */

    markerHeight?: number;

    /**
     * Information about pointer for assistive technology.

     */
    description?: string;

    /**
     * The width of the marker in pixels.

     */

    markerWidth?: number;

}

/**
 * Interface for a class Axis
 */
export interface AxisModel {

    /**
     * Specifies the minimum value of an axis.


     */

    minimum?: number;

    /**
     * Specifies the maximum value of an axis.


     */

    maximum?: number;

    /**
     * Specifies the last label to be shown

     */

    showLastLabel?: boolean;

    /**
     * Specifies to hide the intersecting axis labels

     */

    hideIntersectingLabel?: boolean;

    /**
     * Specifies the rounding Off value in the label

     */

    roundingPlaces?: number;

    /**
     * Radius of an axis in pixels or in percentage.

     */

    radius?: string;

    /**
     * Options for customizing the axis lines.
     */

    lineStyle?: LineModel;

    /**
     * Options for customizing the ranges of an axis
     */

    ranges?: RangeModel[];

    /**
     * Options for customizing the pointers of an axis
     */

    pointers?: PointerModel[];

    /**
     * ‘Annotation’ module is used to handle annotation action for an axis.
     */

    annotations?: AnnotationModel[];

    /**
     * Options for customizing the major tick lines.

     */

    majorTicks?: TickModel;

    /**
     * Options for customizing the minor tick lines.

     */

    minorTicks?: TickModel;

    /**
     * The start angle of an axis

     */

    startAngle?: number;

    /**
     * The end angle of an axis

     */

    endAngle?: number;

    /**
     * Specifies the direction of an axis. They are
     * * clockWise -  Renders the axis in clock wise direction.
     * * antiClockWise - Renders the axis in anti-clock wise direction.

     */

    direction?: GaugeDirection;

    /**
     * The background color of the axis, which accepts value in hex, rgba as a valid CSS color string.

     */
    background?: string;

    /**
     * Specifies the range gap property by pixel value.

     */
    rangeGap?: number;

    /**
     * Specifies the start and end range gap.

     */
    startAndEndRangeGap?: boolean;

    /**
     * Options to customize the axis label.
     */

    labelStyle?: LabelModel;

}