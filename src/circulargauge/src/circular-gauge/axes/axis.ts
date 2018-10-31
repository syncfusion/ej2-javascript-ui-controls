import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';
import { RangeModel, LineModel, TickModel, LabelModel, AnimationModel } from './axis-model';
import { PointerModel, CapModel, NeedleTailModel, AnnotationModel } from './axis-model';
import { Font, Border } from '../model/base';
import { Position, PointerType, GaugeDirection, HiddenLabel, GaugeShape } from '../utils/enum';
import { FontModel, BorderModel } from '../model/base-model';
import { Size, Rect, VisibleLabels } from '../utils/helper';
import { Theme } from '../model/theme';

/**   
 * Configures the axis line.   
 */
export class Line extends ChildProperty<Line> {

    /**
     * The width of the line in pixels.
     * @default 2
     */

    @Property(2)
    public width: number;

    /**
     * The dash array of the axis line.
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * The color of the axis line, which accepts value in hex, rgba as a valid CSS color string.
     */

    @Property(Theme.axisLineColor)
    public color: string;
}

/**   
 * Configures the axis label.  
 */
export class Label extends ChildProperty<Label> {

    /**
     * The font of the axis labels
     */

    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public font: FontModel;

    /**
     * To format the axis label, which accepts any global string format like 'C', 'n1', 'P' etc.
     * Also accepts placeholder like '{value}°C' in which value represent the axis label e.g. 20°C.
     * @default ''
     */

    @Property('')
    public format: string;

    /**
     * Specifies the position of the labels. They are,
     * * inside -  Places the labels inside the axis.
     * * outside - Places the labels outside of the axis.
     * @default Inside
     */

    @Property('Inside')
    public position: Position;

    /**
     * Specifies the label of an axis, which must get hide when an axis makes a complete circle. They are
     * * first -  Hides the 1st label on intersect.
     * * last - Hides the last label on intersect.
     * * none - Places both the labels.
     * @default None
     */

    @Property('None')
    public hiddenLabel: HiddenLabel;

    /**
     * if set true, the labels will get rotated along the axis.
     * @default false
     */
    @Property(false)
    public autoAngle: boolean;

    /**
     * If set true, labels takes the range color.
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;

    /**
     * Distance of the labels from axis in pixel.
     * @default 0
     */

    @Property(0)
    public offset: number;

}

/**   
 * Configures the ranges of an axis.
 */

export class Range extends ChildProperty<Range> {

    /**
     * Specifies the minimum value of the range.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public start: number;

    /**
     * Specifies the maximum value of the range.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public end: number;

    /**
     * The radius of the range in pixels or in percentage.
     * @default null
     */

    @Property(null)
    public radius: string;

    /**
     * Specifies the start width of the ranges
     * @default 10
     */

    @Property(10)
    public startWidth: number | string;

    /**
     * Specifies the end width of the ranges
     * @default 10
     */

    @Property(10)
    public endWidth: number | string;

    /**
     * Specifies the color of the ranges
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Specifies the rounded corner radius for ranges.
     * @default 0
     */

    @Property(0)
    public roundedCornerRadius: number;

    /** @private */
    public currentRadius: number;
    /** @private */
    public rangeColor: string;

}

/**   
 * Configures the major and minor tick lines of an axis.   
 */

export class Tick extends ChildProperty<Tick> {

    /**
     * The width of the ticks in pixels.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public width: number;

    /**
     * The height of the line in pixels.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public height: number;

    /**
     * Specifies the interval of the tick line.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public interval: number;

    /**
     * Distance of the ticks from axis in pixel.
     * @default 0
     */

    @Property(0)
    public offset: number;

    /**
     * The color of the tick line, which accepts value in hex, rgba as a valid CSS color string.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(Theme.tickLineColor)
    public color: string;

    /**
     * Specifies the position of the ticks. They are
     * * inside -  Places the ticks inside the axis.
     * * outside - Places the ticks outside of the axis.
     * @default Inside
     */

    @Property('Inside')
    public position: Position;

    /**
     * If set true, major ticks takes the range color.
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;
}

/**   
 * Configures the needle cap in pointer.    
 */

export class Cap extends ChildProperty<Cap> {

    /**
     * The color of the cap.
     * @default '#ffffff'
     */

    @Property('#ffffff')
    public color: string;

    /**
     * Options for customizing the border of the cap.
     */

    @Complex<BorderModel>({ color: Theme.pointerColor, width: 8 }, Border)
    public border: BorderModel;

    /**
     * Radius of the cap in pixels.
     * @default 8
     */

    @Property(8)
    public radius: number;

}

/**   
 * Configures the back needle in pointers.   
 */

export class NeedleTail extends ChildProperty<NeedleTail> {

    /**
     * The color of the back needle.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(Theme.pointerColor)
    public color: string;

    /**
     * Options for customizing the border of the back needle.
     */

    @Complex<BorderModel>({ color: Theme.pointerColor, width: 0 }, Border)
    public border: BorderModel;

    /**
     * The radius of the back needle in pixels or in percentage.
     * @default 0%
     */

    @Property('0%')
    public length: string;

}

/**
 * Configures the animation of pointers.
 */

export class Animation extends ChildProperty<Animation> {

    /**
     * If set true, pointers get animate on initial loading.
     * @default true
     */

    @Property(true)
    public enable: boolean;

    /**
     * Duration of animation in milliseconds.
     * @default 1000
     */

    @Property(1000)
    public duration: number;

}

/**   
 * ‘Annotation’ module is used to handle annotation action for an axis.
 */

export class Annotation extends ChildProperty<Annotation> {

    /**
     * Content of the annotation, which accepts the id of the custom element.
     * @default null
     */
    @Property(null)
    public content: string;

    /**
     * Angle for annotation with respect to axis.
     * @default 90
     */
    @Property(90)
    public angle: number;

    /**
     * Radius for annotation with respect to axis.
     * @default '50%'
     */
    @Property('50%')
    public radius: string;

    /**
     * Order of an annotation in an axis.
     * @default '-1'
     */
    @Property('-1')
    public zIndex: string;

    /**
     * Rotates the annotation along the axis.
     * @default false
     */
    @Property(false)
    public autoAngle: boolean;

    /**
     * Options for customizing the annotation text.
     */

    @Complex<FontModel>({ size: '12px', color: '#686868' }, Font)
    public textStyle: FontModel;

    /**
     * Information about annotation for assistive technology.
     * @default null
     */
    @Property(null)
    public description: string;

}

/**   
 * Configures the pointers of an axis.
 */

export class Pointer extends ChildProperty<Pointer> {

    /**
     * Specifies the value of the pointer.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public value: number;

    /**
     * Specifies the type of pointer for an axis.
     * * needle -  Renders a needle.
     * * marker - Renders a marker.
     * * rangeBar - Renders a rangeBar.
     * @default Needle
     */

    @Property('Needle')
    public type: PointerType;

    /**
     * Specifies the rounded corner radius for pointer.
     * @default 0
     */

    @Property(0)
    public roundedCornerRadius: number;

    /**
     * The URL for the Image that is to be displayed as pointer.
     * It requires marker shape value to be Image.
     * @default null
     */
    @Property(null)
    public imageUrl: string;

    /**
     * Length of the pointer in pixels or in percentage.
     * @default null
     */
    @Property(null)
    public radius: string;

    /**
     * Width of the pointer in pixels.
     * @default 20
     */
    @Property(20)
    public pointerWidth: number;

    /**
     * Options for customizing the cap
     */

    @Complex<CapModel>({}, Cap)
    public cap: CapModel;

    /**
     * Options for customizing the back needle.
     */

    @Complex<NeedleTailModel>({}, NeedleTail)
    public needleTail: NeedleTailModel;

    /**
     * The color of the pointer.
     */

    @Property(Theme.pointerColor)
    public color: string;

    /**
     * Options for customizing the border of the needle.
     */

    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Configures the animation of pointers.
     */

    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * Specifies the shape of the marker. They are
     * * circle - Renders a circle.
     * * rectangle - Renders a rectangle.
     * * triangle - Renders a triangle.
     * * diamond - Renders a diamond.
     * * invertedTriangle - Renders a invertedTriangle.
     * * image - Renders a image.
     * @default Circle
     */

    @Property('Circle')
    public markerShape: GaugeShape;

    /**
     * The height of the marker in pixels.
     * @default 5
     */

    @Property(5)
    public markerHeight: number;

    /**
     * Information about pointer for assistive technology.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * The width of the marker in pixels.
     * @default 5
     */

    @Property(5)
    public markerWidth: number;

    /** @private */
    public currentValue: number;

    /** @private */
    public pathElement: Element[];

    /** @private */
    public currentRadius: number;

}

/**
 * Configures an axis in a gauge.
 */

export class Axis extends ChildProperty<Axis> {

    /**
     * Specifies the minimum value of an axis.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public minimum: number;

    /**
     * Specifies the maximum value of an axis.
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public maximum: number;

    /**
     * Radius of an axis in pixels or in percentage.
     * @default null
     */

    @Property(null)
    public radius: string;

    /**
     * Options for customizing the axis lines.
     */

    @Complex<LineModel>({}, Line)
    public lineStyle: LineModel;

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
     * ‘Annotation’ module is used to handle annotation action for an axis.
     */

    @Collection<AnnotationModel>([{}], Annotation)
    public annotations: AnnotationModel[];

    /**
     * Options for customizing the major tick lines.
     */

    @Complex<TickModel>({ width: 2, height: 10 }, Tick)
    public majorTicks: TickModel;

    /**
     * Options for customizing the minor tick lines.
     */

    @Complex<TickModel>({ width: 2, height: 5 }, Tick)
    public minorTicks: TickModel;

    /**
     * The start angle of an axis
     * @default 200
     */

    @Property(200)
    public startAngle: number;

    /**
     * The end angle of an axis
     * @default 160
     */

    @Property(160)
    public endAngle: number;

    /**
     * Specifies the direction of an axis. They are
     * * clockWise -  Renders the axis in clock wise direction.
     * * antiClockWise - Renders the axis in anti-clock wise direction.
     * @default ClockWise
     */

    @Property('ClockWise')
    public direction: GaugeDirection;

    /**
     * The background color of the axis, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Options to customize the axis label.
     */

    @Complex<LabelModel>({}, Label)
    public labelStyle: LabelModel;

    /** @private */
    public currentRadius: number;

    /** @private */
    public visibleRange: VisibleRangeModel;

    /** @private */
    public visibleLabels: VisibleLabels[] = [];

    /** @private */
    public maxLabelSize: Size;

    /** @private */
    public rect: Rect;

    /** @private */
    public nearSize: number;

    /** @private */
    public farSize: number;

}

/** @private */
export interface VisibleRangeModel {

    min?: number;

    max?: number;

    interval?: number;

}