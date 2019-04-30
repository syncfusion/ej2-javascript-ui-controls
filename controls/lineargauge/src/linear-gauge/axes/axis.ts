import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';
import { VisibleLabels, Size, VisibleRange, Rect, Align } from '../utils/helper';
import { Font, Border } from '../model/base';
import { FontModel, BorderModel } from '../model/base-model';
import { RangeModel, PointerModel, LabelModel, TickModel, LineModel } from './axis-model';
import { Point, Placement, MarkerType, Position } from '../utils/enum';


/** Options for customizing the axis line. */

export class Line extends ChildProperty<Line> {
    /**
     * The dash array of the axis line.
     */

    @Property('')
    public dashArray: string;

    /**
     * Height of the axis line.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public height: number;

    /**
     * Width of the axis line.
     * @default 2
     */
    @Property(2)
    public width: number;

    /**
     * Color of the axis line.
     */
    @Property(null)
    public color: string;

    /**
     * Specifies to move the axis line.
     */
    @Property(0)
    public offset: number;
}
/**   
 * Options for customizing the axis labels appearance.    
 */
export class Label extends ChildProperty<Label> {

    /**
     * The font of the axis labels.
     */

    @Complex<FontModel>({ size: '12px', color: null }, Font)
    public font: FontModel;

    /**
     * The color of the label, based on range color.
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;

    /**
     * To format the axis label, which accepts any global format string like 'C', 'n1', 'P' etc.
     * Also accepts placeholder like '{value}°C' in which value represent the axis label e.g. 20°C.
     */

    @Property('')
    public format: string;

    /**
     * To move the axis labels.
     * @default 0
     */
    @Property(0)
    public offset: number;

}

/**
 * Options for customizing the ranges of an axis.
 */

export class Range extends ChildProperty<Range> {

    /**
     * Start of the axis range.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public start: number;

    /**
     * End of the axis range.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public end: number;

    /**
     * Specifies to position the axis range.
     * @default Outside
     */
    @Property('Outside')
    public position: Position;

    /**
     * Color of the axis range.
     */
    @Property('')
    public color: string;

    /**
     * Starting width of axis range.
     * @default 10
     */
    @Property(10)
    public startWidth: number;

    /**
     * Ending width of axis range.
     * @default 10
     */
    @Property(10)
    public endWidth: number;

    /**
     * Specifies to move the axis range.
     * @default 0
     */
    @Property(0)
    public offset: number;

    /**
     * Specifies the border of axis range.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public border: BorderModel;

    /** @private */
    public bounds: Rect;

    /** @private */
    public path: string;

    /** @private */
    public interior: string;

}

/**
 * Options for customizing the minor tick lines.
 */

export class Tick extends ChildProperty<Tick> {
    /**
     * Height of the tick line.
     */
    @Property(20)
    public height: number;

    /**
     * Width of the tick line. 
     * @default 2
     */
    @Property(2)
    public width: number;

    /**
     * Specifies the interval for ticks.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public interval: number;

    /**
     * The color of the major or minor tick line, which accepts value in hex, rgba as a valid CSS color string.
     */

    @Property(null)
    public color: string;

    /**
     * Specifies to move the axis ticks.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public offset: number;

}


/**
 * Options for customizing the pointers of an axis.
 */

export class Pointer extends ChildProperty<Pointer> {
    /**
     * Specifies the type of pointer.
     * @default Marker
     */
    @Property('Marker')
    public type: Point;

    /**
     * Specifies value of the pointer.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public value: number;

    /**
     * Specifies the marker shape in pointer.
     * @default InvertedTriangle
     */
    @Property('InvertedTriangle')
    public markerType: MarkerType;

    /**
     * Specifies the path of image.
     * @default null
     */
    @Property(null)
    public imageUrl: string;

    /**
     * Specifies the border of pointer.
     */
    @Complex<BorderModel>({ color: '#808080' }, Border)
    public border: BorderModel;

    /**
     * Specifies the corner radius for rounded rectangle.
     * @default 10
     */
    @Property(10)
    public roundedCornerRadius: number;

    /**
     * Specifies the place of the pointer.
     * @default Far
     */
    @Property('Far')
    public placement: Placement;

    /**
     * Specifies the height of pointer.
     * @default 20
     */
    @Property(20)
    public height: number;

    /**
     * Specifies the width of pointer.
     * @default 20
     */
    @Property(20)
    public width: number;

    /**
     * Specifies the color of the pointer.
     */
    @Property(null)
    public color: string;

    /**
     * Specifies the opacity for pointer.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Specifies the animating duration of pointer in milliseconds.
     * @default 0
     */
    @Property(0)
    public animationDuration: number;

    /**
     * Specifies the enable or disable the pointer drag.
     * @default false
     */
    @Property(false)
    public enableDrag: boolean;

    /**
     * Specifies to move the pointer.
     * @default 0
     */
    @Property(0)
    public offset: number;

    /**
     * Description of the pointer.
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

}




export class Axis extends ChildProperty<Axis> {
    /**
     * Specifies the minimum value of an axis.
     * @default 0
     */

    @Property(0)
    public minimum: number;

    /**
     * Specifies the maximum value of an axis.
     * @default 100
     */

    @Property(100)
    public maximum: number;

    /**
     * Specifies the axis rendering direction.
     */

    @Property(false)
    public isInversed: boolean;

    /**
     * Specifies the axis rendering position.
     */
    @Property(false)
    public opposedPosition: boolean;

    /**
     * Options for customizing the axis line.
     */
    @Complex(<LineModel>{}, Line)
    public line: LineModel;


    /**
     * Options for customizing the ranges of an axis
     */

    @Collection<RangeModel>([{}], Range)
    public ranges: RangeModel[];

    /**
     * Options for customizing the pointers of an axis
     */

    @Collection<PointerModel>([{}], Pointer)
    public pointers: PointerModel[];

    /**
     * Options for customizing the major tick lines.
     */

    @Complex<TickModel>({ width: 2, height: 20 }, Tick)
    public majorTicks: TickModel;

    /**
     * Options for customizing the minor tick lines.
     */

    @Complex<TickModel>({ width: 1, height: 10 }, Tick)
    public minorTicks: TickModel;

    /**
     * Options for customizing the axis label appearance.
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