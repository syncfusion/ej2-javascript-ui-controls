import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';import { VisibleLabels, Size, VisibleRange, Rect, Align } from '../utils/helper';import { Font, Border } from '../model/base';import { FontModel, BorderModel } from '../model/base-model';import { Point, Placement, MarkerType, Position} from '../utils/enum';import { LinearGradientModel, RadialGradientModel} from '../axes/gradient-model';

/**
 * Interface for a class Line
 */
export interface LineModel {

    /**
     * Sets and gets the dash-array of the axis line.
     */

    dashArray?: string;

    /**
     * Sets and gets the height of the axis line.
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     */
    height?: number;

    /**
     * Sets and gets the width of the axis line.
     * @default 2
     */
    width?: number;

    /**
     * Sets and gets the color for the axis line.
     */
    color?: string;

    /**
     * Sets and gets the offset to position the axis line in linear gauge.
     * @blazorDefaultValue 0
     */
    offset?: number;

}

/**
 * Interface for a class Label
 */
export interface LabelModel {

    /**
     * Sets and gets the options for customizing the style of the text in axis labels.
     */

    font?: FontModel;

    /**
     * Enables or disables the color of the label to use the color of the ranges in linear gauge.
     * @default false
     */

    useRangeColor?: boolean;

    /**
     * Sets and gets the format for the axis label. This property accepts any global format string like 'C', 'n1', 'P' etc.
     * Also accepts placeholder like '{value}°C' in which value represent the axis label e.g. 20°C.
     */

    format?: string;

    /**
     * Sets and gets the value to position the axis labels in linear gauge.
     * @default 0
     */
    offset?: number;

    /**
     * Sets and gets the position of the axis label in linear gauge.
     * @default Auto
     */
    position?: Position;

}

/**
 * Interface for a class Range
 */
export interface RangeModel {

    /**
     * Sets and gets the start value for the range in axis.
     * @default 0
     */
    start?: number;

    /**
     * Sets and gets the end value for the range in axis.
     * @default 0
     */
    end?: number;

    /**
     * Sets and gets the properties to render a linear gradient for the range.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the range.
     * @default null
     */
    linearGradient?: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for the range.
     * @default null
     */
    radialGradient?: RadialGradientModel;

    /**
     * Sets and gets the position to place the ranges in the axis.
     * @default Outside
     */
    position?: Position;

    /**
     * Sets and gets the color of the axis range.
     */
    color?: string;

    /**
     * Sets and gets the width of the start of the range in axis.
     * @default 10
     */
    startWidth?: number;

    /**
     * Sets and gets the width of the end of the range in axis.
     * @default 10
     */
    endWidth?: number;

    /**
     * Sets and gets the value to position the range in the axis.
     * @default '0'
     */
    offset?: number | string;

    /**
     * Sets and gets the options to customize the color and width of the border for the axis range.
     */
    border?: BorderModel;

}

/**
 * Interface for a class Tick
 */
export interface TickModel {

    /**
     * Sets and gets the height of the tick line in the axis.
     */
    height?: number;

    /**
     * Sets and gets the width of the tick line in the axis. 
     * @default 2
     */
    width?: number;

    /**
     * Sets and gets the gap between the ticks in the axis.
     * @aspDefaultValueIgnore
     */
    interval?: number;

    /**
     * Sets and gets the color for the major or minor tick line. This property accepts value in hex code,
     * rgba string as a valid CSS color string.
     */

    color?: string;

    /**
     * Sets and gets the value to move the ticks from the axis.
     * @aspDefaultValueIgnore
     */
    offset?: number;

    /**
     * Sets and gets the value to place the ticks in the axis.
     * @default Auto
     */
    position?: Position;

}

/**
 * Interface for a class Pointer
 */
export interface PointerModel {

    /**
     * Sets and gets the type of pointer in axis.
     * @default Marker
     */
    type?: Point;

    /**
     * Sets and gets the properties to render a linear gradient for the pointer.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the pointer.
     * @default null
     */
    linearGradient?: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for the pointer.
     * @default null
     */
    radialGradient?: RadialGradientModel;

    /**
     * Sets and gets the value of the pointer in axis.
     * @blazorDefaultValue 0
     * @default null
     */

    value?: number;

    /**
     * Sets and gets the type of the marker for pointers in axis.
     * @default InvertedTriangle
     */
    markerType?: MarkerType;

    /**
     * Sets and gets the URL path for the image in marker when the marker type is chosen as image.
     * @default null
     */
    imageUrl?: string;

    /**
     * Sets and gets the options to optimize the color and width of the border for pointers.
     */
    border?: BorderModel;

    /**
     * Sets and gets the corner radius for pointer.
     * @default 10
     */
    roundedCornerRadius?: number;

    /**
     * Sets and gets the place of the pointer.
     * @default Far
     */
    placement?: Placement;

    /**
     * Sets and gets the height of the pointer.
     * @default 20
     */
    height?: number;

    /**
     * Sets and gets the width of the pointer.
     * @default 20
     */
    width?: number;

    /**
     * Sets and gets the color of the pointer.
     */
    color?: string;

    /**
     * Sets and gets the opacity of pointer in linear gauge.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the duration of animation in pointer.
     * @default 0
     */
    animationDuration?: number;

    /**
     * Enables or disables the drag movement of pointer.
     * @default false
     */
    enableDrag?: boolean;

    /**
     * Sets and gets the value to position the pointer from the axis.
     * @default '0'
     */
    offset?: number | string;

    /**
     * Sets and gets the position of the pointer.
     * @default Auto
     */
    position?: Position;

    /**
     * Sets and gets the description for the pointer.
     * @default null
     */
    description?: string;

}

/**
 * Interface for a class Axis
 */
export interface AxisModel {

    /**
     * Sets and gets the minimum value for the axis.
     * @default 0
     */

    minimum?: number;

    /**
     * Sets and gets the maximum value for the axis.
     * @default 100
     */

    maximum?: number;

    /**
     * Enables or disables the inversed axis.
     */

    isInversed?: boolean;

    /**
     * Shows or hides the last label in the axis of the linear gauge.
     */

    showLastLabel?: boolean;

    /**
     * Enables or disables the opposed position of the axis in the linear gauge.
     */
    opposedPosition?: boolean;

    /**
     * Sets and gets the options for customizing the axis line.
     */
    line?: LineModel;

    /**
     * Sets and gets the options for customizing the ranges of an axis.
     */

    ranges?: RangeModel[];

    /**
     * Sets and gets the options for customizing the pointers of an axis.
     */

    pointers?: PointerModel[];

    /**
     * Sets and gets the options for customizing the major tick lines.
     */

    majorTicks?: TickModel;

    /**
     * Sets and gets the options for customizing the minor tick lines.
     */

    minorTicks?: TickModel;

    /**
     * Sets and gets the options for customizing the appearance of the label in axis.
     */

    labelStyle?: LabelModel;

}