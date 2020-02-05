import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';import { VisibleLabels, Size, VisibleRange, Rect, Align } from '../utils/helper';import { Font, Border } from '../model/base';import { FontModel, BorderModel } from '../model/base-model';import { Point, Placement, MarkerType, Position, ExtraPosition } from '../utils/enum';

/**
 * Interface for a class Line
 */
export interface LineModel {

    /**
     * The dash array of the axis line.
     */

    dashArray?: string;

    /**
     * Height of the axis line.
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     */
    height?: number;

    /**
     * Width of the axis line.
     * @default 2
     */
    width?: number;

    /**
     * Color of the axis line.
     */
    color?: string;

    /**
     * Specifies to move the axis line.
     * @blazorDefaultValue 0
     */
    offset?: number;

}

/**
 * Interface for a class Label
 */
export interface LabelModel {

    /**
     * The font of the axis labels.
     */

    font?: FontModel;

    /**
     * The color of the label, based on range color.
     * @default false
     */

    useRangeColor?: boolean;

    /**
     * To format the axis label, which accepts any global format string like 'C', 'n1', 'P' etc.
     * Also accepts placeholder like '{value}°C' in which value represent the axis label e.g. 20°C.
     */

    format?: string;

    /**
     * To move the axis labels.
     * @default 0
     */
    offset?: number;

    /**
     * Specifies to position the axis label.
     * @default Auto
     */
    position?: ExtraPosition;

}

/**
 * Interface for a class Range
 */
export interface RangeModel {

    /**
     * Start of the axis range.
     * @default 0
     */
    start?: number;

    /**
     * End of the axis range.
     * @default 0
     */
    end?: number;

    /**
     * Specifies to position the axis range.
     * @default Outside
     */
    position?: Position;

    /**
     * Color of the axis range.
     */
    color?: string;

    /**
     * Starting width of axis range.
     * @default 10
     */
    startWidth?: number;

    /**
     * Ending width of axis range.
     * @default 10
     */
    endWidth?: number;

    /**
     * Specifies to move the axis range.
     * @default '0'
     */
    offset?: number | string;

    /**
     * Specifies the border of axis range.
     */
    border?: BorderModel;

}

/**
 * Interface for a class Tick
 */
export interface TickModel {

    /**
     * Height of the tick line.
     */
    height?: number;

    /**
     * Width of the tick line. 
     * @default 2
     */
    width?: number;

    /**
     * Specifies the interval for ticks.
     * @aspDefaultValueIgnore
     */
    interval?: number;

    /**
     * The color of the major or minor tick line, which accepts value in hex, rgba as a valid CSS color string.
     */

    color?: string;

    /**
     * Specifies to move the axis ticks.
     * @aspDefaultValueIgnore
     */
    offset?: number;

    /**
     * Specifies to position the axis tick.
     * @default Auto
     */
    position?: ExtraPosition;

}

/**
 * Interface for a class Pointer
 */
export interface PointerModel {

    /**
     * Specifies the type of pointer.
     * @default Marker
     */
    type?: Point;

    /**
     * Specifies value of the pointer.
     * @blazorDefaultValue 0
     * @default null
     */

    value?: number;

    /**
     * Specifies the marker shape in pointer.
     * @default InvertedTriangle
     */
    markerType?: MarkerType;

    /**
     * Specifies the path of image.
     * @default null
     */
    imageUrl?: string;

    /**
     * Specifies the border of pointer.
     */
    border?: BorderModel;

    /**
     * Specifies the corner radius for rounded rectangle.
     * @default 10
     */
    roundedCornerRadius?: number;

    /**
     * Specifies the place of the pointer.
     * @default Far
     */
    placement?: Placement;

    /**
     * Specifies the height of pointer.
     * @default 20
     */
    height?: number;

    /**
     * Specifies the width of pointer.
     * @default 20
     */
    width?: number;

    /**
     * Specifies the color of the pointer.
     */
    color?: string;

    /**
     * Specifies the opacity for pointer.
     * @default 1
     */
    opacity?: number;

    /**
     * Specifies the animating duration of pointer in milliseconds.
     * @default 0
     */
    animationDuration?: number;

    /**
     * Specifies the enable or disable the pointer drag.
     * @default false
     */
    enableDrag?: boolean;

    /**
     * Specifies to move the pointer.
     * @default '0'
     */
    offset?: number | string;

    /**
     * Specifies to position the pointer.
     * @default Auto
     */
    position?: ExtraPosition;

    /**
     * Description of the pointer.
     * @default null
     */
    description?: string;

}

/**
 * Interface for a class Axis
 */
export interface AxisModel {

    /**
     * Specifies the minimum value of an axis.
     * @default 0
     */

    minimum?: number;

    /**
     * Specifies the maximum value of an axis.
     * @default 100
     */

    maximum?: number;

    /**
     * Specifies the axis rendering direction.
     */

    isInversed?: boolean;

    /**
     * Specifies the last label to be shown
     */

    showLastLabel?: boolean;

    /**
     * Specifies the axis rendering position.
     */
    opposedPosition?: boolean;

    /**
     * Options for customizing the axis line.
     */
    line?: LineModel;

    /**
     * Options for customizing the ranges of an axis
     */

    ranges?: RangeModel[];

    /**
     * Options for customizing the pointers of an axis
     */

    pointers?: PointerModel[];

    /**
     * Options for customizing the major tick lines.
     */

    majorTicks?: TickModel;

    /**
     * Options for customizing the minor tick lines.
     */

    minorTicks?: TickModel;

    /**
     * Options for customizing the axis label appearance.
     */

    labelStyle?: LabelModel;

}