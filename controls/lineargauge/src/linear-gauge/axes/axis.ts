import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';
import { VisibleLabels, Size, VisibleRange, Rect, Align } from '../utils/helper';
import { Font, Border } from '../model/base';
import { FontModel, BorderModel } from '../model/base-model';
import { RangeModel, PointerModel, LabelModel, TickModel, LineModel } from './axis-model';
import { Point, Placement, MarkerType, Position} from '../utils/enum';
import { LinearGradientModel, RadialGradientModel} from '../axes/gradient-model';

/** Sets and gets the options for customizing the axis line in linear gauge. */

export class Line extends ChildProperty<Line> {
    /**
     * Sets and gets the dash-array of the axis line.
     */

    @Property('')
    public dashArray: string;

    /**
     * Sets and gets the height of the axis line.
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     */
    @Property(null)
    public height: number;

    /**
     * Sets and gets the width of the axis line.
     * @default 2
     */
    @Property(2)
    public width: number;

    /**
     * Sets and gets the color for the axis line.
     */
    @Property(null)
    public color: string;

    /**
     * Sets and gets the offset to position the axis line in linear gauge.
     * @blazorDefaultValue 0
     */
    @Property(0)
    public offset: number;
}
/**
 * Sets and gets the options for customizing the appearance of the axis labels.
 */
export class Label extends ChildProperty<Label> {

    /**
     * Sets and gets the options for customizing the style of the text in axis labels.
     */

    @Complex<FontModel>({ size: '12px', color: null }, Font)
    public font: FontModel;

    /**
     * Enables or disables the color of the label to use the color of the ranges in linear gauge.
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;

    /**
     * Sets and gets the format for the axis label. This property accepts any global format string like 'C', 'n1', 'P' etc.
     * Also accepts placeholder like '{value}°C' in which value represent the axis label e.g. 20°C.
     */

    @Property('')
    public format: string;

    /**
     * Sets and gets the value to position the axis labels in linear gauge.
     * @default 0
     */
    @Property(0)
    public offset: number;

    /**
     * Sets and gets the position of the axis label in linear gauge.
     * @default Auto
     */
    @Property('Auto')
    public position: Position;

}

/**
 * Sets and gets the options for customizing the ranges of an axis.
 */

export class Range extends ChildProperty<Range> {

    /**
     * Sets and gets the start value for the range in axis.
     * @default 0
     */
    @Property(0)
    public start: number;

    /**
     * Sets and gets the end value for the range in axis.
     * @default 0
     */
    @Property(0)
    public end: number;

    /**
     * Sets and gets the properties to render a linear gradient for the range.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the range.
     * @default null
     */
    @Property(null)
    public linearGradient: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for the range.
     * @default null
     */
    @Property(null)
    public radialGradient: RadialGradientModel;

    /**
     * Sets and gets the position to place the ranges in the axis.
     * @default Outside
     */
    @Property('Outside')
    public position: Position;

    /**
     * Sets and gets the color of the axis range.
     */
    @Property('')
    public color: string;

    /**
     * Sets and gets the width of the start of the range in axis.
     * @default 10
     */
    @Property(10)
    public startWidth: number;

    /**
     * Sets and gets the width of the end of the range in axis.
     * @default 10
     */
    @Property(10)
    public endWidth: number;

    /**
     * Sets and gets the value to position the range in the axis.
     * @default '0'
     */
    @Property(0)
    public offset: number | string;

    /**
     * Sets and gets the options to customize the color and width of the border for the axis range.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public border: BorderModel;

    /** @private */
    public bounds: Rect;

    /** @private */
    public path: string;

    /** @private */
    public interior: string;

    /** @private */
    public currentOffset: number;

}

/**
 * Sets and gets the options for customizing the minor tick lines in axis.
 */

export class Tick extends ChildProperty<Tick> {
    /**
     * Sets and gets the height of the tick line in the axis.
     */
    @Property(20)
    public height: number;

    /**
     * Sets and gets the width of the tick line in the axis. 
     * @default 2
     */
    @Property(2)
    public width: number;

    /**
     * Sets and gets the gap between the ticks in the axis.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public interval: number;

    /**
     * Sets and gets the color for the major or minor tick line. This property accepts value in hex code,
     * rgba string as a valid CSS color string.
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets the value to move the ticks from the axis.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public offset: number;

    /**
     * Sets and gets the value to place the ticks in the axis.
     * @default Auto
     */
    @Property('Auto')
    public position: Position;

}


/**
 * Sets and gets the options for customizing the pointers of an axis in linear gauge.
 */

export class Pointer extends ChildProperty<Pointer> {
    /**
     * Sets and gets the type of pointer in axis.
     * @default Marker
     */
    @Property('Marker')
    public type: Point;

    /**
     * Sets and gets the properties to render a linear gradient for the pointer.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the pointer.
     * @default null
     */
    @Property(null)
    public linearGradient: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for the pointer.
     * @default null
     */
    @Property(null)
    public radialGradient: RadialGradientModel;

    /**
     * Sets and gets the value of the pointer in axis.
     * @blazorDefaultValue 0
     * @default null
     */

    @Property(null)
    public value: number;

    /**
     * Sets and gets the type of the marker for pointers in axis.
     * @default InvertedTriangle
     */
    @Property('InvertedTriangle')
    public markerType: MarkerType;

    /**
     * Sets and gets the URL path for the image in marker when the marker type is chosen as image.
     * @default null
     */
    @Property(null)
    public imageUrl: string;

    /**
     * Sets and gets the options to optimize the color and width of the border for pointers.
     */
    @Complex<BorderModel>({ color: '#808080' }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the corner radius for pointer.
     * @default 10
     */
    @Property(10)
    public roundedCornerRadius: number;

    /**
     * Sets and gets the place of the pointer.
     * @default Far
     */
    @Property('Far')
    public placement: Placement;

    /**
     * Sets and gets the height of the pointer.
     * @default 20
     */
    @Property(20)
    public height: number;

    /**
     * Sets and gets the width of the pointer.
     * @default 20
     */
    @Property(20)
    public width: number;

    /**
     * Sets and gets the color of the pointer.
     */
    @Property(null)
    public color: string;

    /**
     * Sets and gets the opacity of pointer in linear gauge.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Sets and gets the duration of animation in pointer.
     * @default 0
     */
    @Property(0)
    public animationDuration: number;

    /**
     * Enables or disables the drag movement of pointer.
     * @default false
     */
    @Property(false)
    public enableDrag: boolean;

    /**
     * Sets and gets the value to position the pointer from the axis.
     * @default '0'
     */
    @Property(0)
    public offset: number | string;

    /**
     * Sets and gets the position of the pointer.
     * @default Auto
     */
    @Property('Auto')
    public position: Position;

    /**
     * Sets and gets the description for the pointer.
     * @default null
     */
    @Property(null)
    public description: string;

    /** @private */
    public bounds: Rect;

    /** @private */
    public startValue: number;

    /** @private */
    public animationComplete: boolean = true;

    /** @private */
    public currentValue: number = null;

    /** @private */
    public currentOffset: number;

    /** @private */
    public pathElement: Element[];

}

/**
 * Sets and gets the options for customizing the axis of a gauge.
 */

export class Axis extends ChildProperty<Axis> {
    /**
     * Sets and gets the minimum value for the axis.
     * @default 0
     */

    @Property(0)
    public minimum: number;

    /**
     * Sets and gets the maximum value for the axis.
     * @default 100
     */

    @Property(100)
    public maximum: number;

    /**
     * Enables or disables the inversed axis.
     */

    @Property(false)
    public isInversed: boolean;

    /**
     * Shows or hides the last label in the axis of the linear gauge.
     */

    @Property(false)
    public showLastLabel: boolean;

    /**
     * Enables or disables the opposed position of the axis in the linear gauge.
     */
    @Property(false)
    public opposedPosition: boolean;

    /**
     * Sets and gets the options for customizing the axis line.
     */
    @Complex(<LineModel>{}, Line)
    public line: LineModel;


    /**
     * Sets and gets the options for customizing the ranges of an axis.
     */

    @Collection<RangeModel>([{}], Range)
    public ranges: RangeModel[];

    /**
     * Sets and gets the options for customizing the pointers of an axis.
     */

    @Collection<PointerModel>([{}], Pointer)
    public pointers: PointerModel[];

    /**
     * Sets and gets the options for customizing the major tick lines.
     */

    @Complex<TickModel>({ width: 2, height: 20 }, Tick)
    public majorTicks: TickModel;

    /**
     * Sets and gets the options for customizing the minor tick lines.
     */

    @Complex<TickModel>({ width: 1, height: 10 }, Tick)
    public minorTicks: TickModel;

    /**
     * Sets and gets the options for customizing the appearance of the label in axis.
     */

    @Complex<LabelModel>({}, Label)
    public labelStyle: LabelModel;

    /** @private */
    public visibleLabels: VisibleLabels[] = [];

    /** @private */
    public maxLabelSize: Size;

    /** @private */
    public visibleRange: VisibleRange;

    /** @private */
    public lineBounds: Rect;

    /** @private */
    public majorTickBounds: Rect;

    /** @private */
    public minorTickBounds: Rect;

    /** @private */
    public labelBounds: Rect;

    /** @private */
    public pointerBounds: Rect;

    /** @private */
    public bounds: Rect;

    /** @private */
    public maxTickLength: number;

    /** @private */
    public checkAlign: Align;

    /** @private */
    public majorInterval: number;

    /** @private */
    public minorInterval: number;

}