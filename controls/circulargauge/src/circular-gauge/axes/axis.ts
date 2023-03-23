import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';
import { RangeModel, LineModel, TickModel, LabelModel, AnimationModel } from './axis-model';
import { PointerModel, CapModel, NeedleTailModel, AnnotationModel } from './axis-model';
import { Font, Border } from '../model/base';
import { Position, PointerRangePosition, PointerType, GaugeDirection, HiddenLabel, GaugeShape} from '../utils/enum';
import { FontModel, BorderModel } from '../model/base-model';
import { LinearGradientModel, RadialGradientModel } from './gradient-model';
import { VisibleLabels, Size, Rect } from '../utils/helper-common';
import { Theme } from '../model/theme';

/**
 * Sets and gets the options to customize the axis line in circular gauge.
 */
export class Line extends ChildProperty<Line> {

    /**
     * Sets and gets the width of the line in circular gauge.
     *
     * @default 2
     */

    @Property(2)
    public width: number;

    /**
     * Sets and gets the dash-array of the axis line in circular gauge.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * Sets and gets the color of the axis line in the circular gauge. This property accepts the value in hex code,
     * rgba string as a valid CSS color string.
     * 
     * @default null
     */

    @Property(null)
    public color: string;
}

/**
 * Sets and gets the options to customize the axis label in circular gauge.
 */
export class Label extends ChildProperty<Label> {

    /**
     * Sets and gets the options to customize the style of the text in axis labels in circular gauge.
     */

    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public font: FontModel;

    /**
     * Sets and gets the format for the axis label. This property accepts any global string format like 'C', 'n1', 'P' etc.
     * Also accepts placeholder like '{value}°C' in which value represent the axis label e.g. 20°C.
     *
     * @default ''
     */

    @Property('')
    public format: string;

    /**
     * Sets and gets the position type to place the labels in the axis in the circular gauge.
     *
     * @default Inside
     */

    @Property('Inside')
    public position: Position;

    /**
     * Sets and gets the label of an axis, which gets hidden when an axis makes a complete circle.
     *
     * @default None
     */

    @Property('None')
    public hiddenLabel: HiddenLabel;

    /**
     * Enables and disables the rotation of the labels along the axis in the circular gauge.
     *
     * @default false
     */
    @Property(false)
    public autoAngle: boolean;

    /**
     * Enables and disables the applying of the range color to the labels in the axis.
     *
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;

    /**
     * Sets and gets the offset value from where the labels must be placed from the axis in circular gauge.
     *
     * @default 0
     */

    @Property(0)
    public offset: number;

    /**
     * Enables and disables the default padding value of axis labels in circular gauge.
     *
     * @default true
     */

    @Property(true)
    public shouldMaintainPadding: boolean;

}

/**
 * Sets and gets the option to customize the ranges of an axis in circular gauge.
 */

export class Range extends ChildProperty<Range> {

    /** @private */
    public pathElement: Element[];

    /** @private */
    public currentValue: number;

    /**
     * Sets and gets the start value of the range in circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default 0
     */

    @Property(0)
    public start: number;

    /**
     * Sets and gets the end value of the range in circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default 0
     */

    @Property(0)
    public end: number;

    /**
     * Sets and gets the radius of the range for circular gauge.
     *
     * @default null
     */

    @Property(null)
    public radius: string;

    /**
     * Sets and gets the width for the start of the range in the circular gauge.
     *
     * @default '10'
     */

    @Property(10)
    public startWidth: number | string;

    /**
     * Sets and gets the width for the end of the range in the circular gauge.
     *
     * @default '10'
     */

    @Property(10)
    public endWidth: number | string;

    /**
     * Sets and gets the color of the ranges in circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets the corner radius for ranges in circular gauge.
     *
     * @default 0
     */

    @Property(0)
    public roundedCornerRadius: number;

    /**
     * Sets and gets the opacity for the ranges in circular gauge.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * Sets and gets the text to be displayed for the corresponding legend item in the legend of the circular gauge.
     *
     * @default ''
     */
    @Property('')
    public legendText: string;

    /**
     * Sets and gets the position of the range in the axis in circular gauge.
     *
     * @default Auto
     */

    @Property('Auto')
    public position: PointerRangePosition;

    /**
     * Sets and gets the offset value for the range from which it is to be placed from the axis in circular gauge.
     *
     * @default '0'
     */
    @Property(0)
    public offset: number | string;

    /**
     * Sets and gets the properties to render a linear gradient for the range.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the range.
     *
     * @default null
     */
    @Property(null)
    public linearGradient: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for the range.
     *
     * @default null
     */
    @Property(null)
    public radialGradient: RadialGradientModel;

    /** @private */
    public currentRadius: number;
    /** @private */
    public gradientAngle: number;
    /** @private */
    public gradientAntiAngle: number;
    /** @private */
    public isLinearCircularGradient: boolean = false;
    /** @private */
    public rangeColor: string;
    /** @private */
    public currentDistanceFromScale: number;

}

/**
 * Sets and gets the options to customize the major and minor tick lines of an axis in circular gauge.
 */

export class Tick extends ChildProperty<Tick> {

    /**
     * Sets and gets the width of the ticks in circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default 2
     */

    @Property(2)
    public width: number;

    /**
     * Sets and gets the height of the ticks in circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public height: number;

    /**
     * Sets and gets the interval between the tick lines in circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public interval: number;

    /**
     * Sets and gets the distance of the ticks from axis in circular gauge.
     *
     * @default 0
     */

    @Property(0)
    public offset: number;

    /**
     * Sets and gets the color of the tick line. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets the position of the ticks in circular gauge.
     *
     * @default Inside
     */

    @Property('Inside')
    public position: Position;

    /**
     * Enables and disables the tick lines to take the color from the range element that overlaps with the ticks.
     *
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;

    /**
     * Sets and gets the dash-array for the ticks in circular gauge.
     *
     * @default '0'
     */

    @Property('0')
    public dashArray: string;
}

/**
 * Sets and gets the needle cap of pointer in circular gauge.
 */

export class Cap extends ChildProperty<Cap> {

    /**
     * Sets and gets the color for the pointer cap in the circular gauge.
     *
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets the properties to render a linear gradient for the cap of the needle pointer.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the cap.
     *
     * @default null
     */

    @Property(null)
    public linearGradient: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for cap of the needle pointer.
     *
     * @default null
     */

    @Property(null)
    public radialGradient: RadialGradientModel;

    /**
     * Sets and gets the options to customize the style properties of the border of the pointer cap in the circular gauge.
     *
     */

    @Complex<BorderModel>({ color: null, width: 8 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the radius of pointer cap in the circular gauge.
     *
     * @default 8
     */

    @Property(8)
    public radius: number;

}

/**
 * Sets and gets the options to customize the pointer needle in the circular gauge.
 */

export class NeedleTail extends ChildProperty<NeedleTail> {

    /**
     * Sets and gets the color for the needle pointer in the circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets options to customize the style properties of the border for the pointer needle in the circular gauge.
     */

    @Complex<BorderModel>({ color: null, width: 0 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the length of the needle in pixels or in percentage in circular gauge.
     *
     * @default '0%'
     */

    @Property('0%')
    public length: string;

    /**
     * Sets and gets the properties to render a linear gradient for the tail of the needle pointer.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the needle tail.
     *
     * @default null
     */

    @Property(null)
    public linearGradient: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for tail of the needle pointer.
     *
     * @default null
     */

    @Property(null)
    public radialGradient: RadialGradientModel;

}

/**
 * Sets and gets the animation of pointers in circular gauge.
 */

export class Animation extends ChildProperty<Animation> {

    /**
     * Enables and disables the pointer animation in circular gauge.
     *
     * @default true
     */

    @Property(true)
    public enable: boolean;

    /**
     * Sets and gets the duration of animation in milliseconds in circular gauge.
     *
     * @default 1000
     */

    @Property(1000)
    public duration: number;

}

/**
 * Sets and gets the annotation elements for an axis in circular gauge.
 */

export class Annotation extends ChildProperty<Annotation> {

    /**
     * Sets and gets the content of the annotation. This property accepts the HTML string or id of the custom element.
     *
     * @default null
     */
    @Property(null)
    public content: string;

    /**
     * Sets and gets the angle for annotation with respect to axis in circular gauge.
     *
     * @default 90
     */
    @Property(90)
    public angle: number;

    /**
     * Sets and gets the radius for annotation with respect to axis in circular gauge.
     *
     * @default '50%'
     */
    @Property('50%')
    public radius: string;

    /**
     * Sets and gets the z-index of an annotation in an axis in the circular gauge.
     *
     * @default '-1'
     */
    @Property('-1')
    public zIndex: string;

    /**
     * Enables and disables the rotation of the annotation along the axis.
     *
     * @default false
     */
    @Property(false)
    public autoAngle: boolean;

    /**
     * Sets and gets the style of the text in annotation.
     */

    @Complex<FontModel>({ size: '12px', color: '#686868' }, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the information about annotation for assistive technology.
     *
     * @default null
     */
    @Property(null)
    public description: string;

}

/**
 * Sets and gets the options to customize the pointers of an axis in circular gauge.
 */

export class Pointer extends ChildProperty<Pointer> {

    /**
     * Sets and gets the value of the pointer in circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public value: number;

    /**
     * Sets and gets the type of pointer for an axis in Circular gauge.
     *
     * @default Needle
     */

    @Property('Needle')
    public type: PointerType;

    /**
     * Sets and gets the position of pointer for an axis.
     *
     * @default Auto
     */

    @Property('Auto')
    public position: PointerRangePosition;

    /**
     * Sets and gets the corner radius for pointer in axis.
     *
     * @default 0
     */

    @Property(0)
    public roundedCornerRadius: number;

    /**
     * Sets and gets the URL for the image that is to be displayed as pointer.
     * It requires marker shape value to be `Image`.
     *
     * @default null
     */
    @Property(null)
    public imageUrl: string;

    /**
     * Sets and gets the radius of pointer for marker and range type pointer and fix length of pointer for needle pointer.
     *
     * @default null
     */
    @Property(null)
    public radius: string;

    /**
     * Sets and gets the width of the pointer in axis.
     *
     * @default 20
     */
    @Property(20)
    public pointerWidth: number;

    /**
     * Sets and gets the options to customize the cap element of the needle pointer in an axis.
     */

    @Complex<CapModel>({}, Cap)
    public cap: CapModel;

    /**
     * Sets and gets the style of text in marker pointer of an axis.
     */

    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the options to customize the tail element of the needle pointer in an axis.
     */

    @Complex<NeedleTailModel>({}, NeedleTail)
    public needleTail: NeedleTailModel;

    /**
     * Sets and gets the color of the pointer in an axis.
     * 
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets the options to customize the style properties of the border for the needle pointer in an axis.
     */

    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the options for the animation of the pointers that propagate while rendering the axis and updating the pointer value in the circular gauge.
     */

    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * Sets and gets the shape of the marker pointer in an axis.
     *
     * @default Circle
     */

    @Property('Circle')
    public markerShape: GaugeShape;

    /**
     * Sets and gets the height of the marker pointer in an axis.
     *
     * @default 5
     */

    @Property(5)
    public markerHeight: number;

    /**
     * Sets and gets the text for the marker pointer. To render the text in the marker pointer, the marker shape must be set as `Text`.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Sets and gets the information about pointer for assistive technology.
     *
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * Sets and gets the width of the marker pointer in an axis.
     *
     * @default 5
     */

    @Property(5)
    public markerWidth: number;

    /**
     * Sets and gets the offset value of pointer from scale.
     *
     * @default '0'
     */

    @Property(0)
    public offset: number | string;

    /** @private */
    public isPointerAnimation: boolean = true;

    /** @private */
    public currentValue: number;
    /** @private */
    public previousValue: number;

    /** @private */
    public pathElement: Element[];

    /** @private */
    public currentRadius: number;

    /** @private */
    public currentDistanceFromScale: number;

    /**
     * Sets or gets the width at the starting edge of the needle pointer in an axis.
     *
     * @default null
     */

    @Property(null)
    public needleStartWidth: number;

    /**
     * Sets or gets the width at the ending edge of the needle pointer in an axis.
     *
     * @default null
     */

    @Property(null)
    public needleEndWidth: number;

    /**
     * Sets and gets the properties to render a linear gradient for the pointer.
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the pointer.
     *
     * @default null
     */

    @Property(null)
    public linearGradient: LinearGradientModel;

    /**
     * Sets and gets the properties to render a radial gradient for pointer.
     *
     * @default null
     */

    @Property(null)
    public radialGradient: RadialGradientModel;
}

/**
 * Sets and gets the options to customize the axis for the circular gauge.
 */

export class Axis extends ChildProperty<Axis> {

    /**
     * Sets and gets the minimum value of an axis in the circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public minimum: number;

    /**
     * Sets and gets the maximum value of an axis in the circular gauge.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public maximum: number;

    /**
     * Enables and disables the last label of axis when it is hidden in circular gauge.
     *
     * @default false
     */

    @Property(false)
    public showLastLabel: boolean;

    /**
     * Enables and disables the intersecting labels to be hidden in axis.
     *
     * @default false
     */

    @Property(false)
    public hideIntersectingLabel: boolean;

    /**
     * Sets and gets the rounding off value in the an axis label.
     *
     * @default null
     */

    @Property(null)
    public roundingPlaces: number;

    /**
     * Sets and gets the radius of an axis in circular gauge.
     *
     * @default null
     */

    @Property(null)
    public radius: string;

    /**
     * Sets and gets the style of the line in axis of circular gauge.
     */

    @Complex<LineModel>({}, Line)
    public lineStyle: LineModel;

    /**
     * Sets and gets the ranges of an axis in circular gauge.
     */

    @Collection<RangeModel>([{}], Range)
    public ranges: RangeModel[];

    /**
     * Sets and gets the pointers of an axis in circular gauge.
     */

    @Collection<PointerModel>([{}], Pointer)
    public pointers: PointerModel[];

    /**
     * Sets and gets the annotation elements for an axis in circular gauge.
     */

    @Collection<AnnotationModel>([{}], Annotation)
    public annotations: AnnotationModel[];

    /**
     * Sets and gets the major tick lines of an axis in circular gauge.
     *
     * @default { width: 2, height: 10 }
     */

    @Complex<TickModel>({ width: 2, height: 10 }, Tick)
    public majorTicks: TickModel;

    /**
     * Sets and gets the minor tick lines of an axis in circular gauge.
     *
     * @default { width: 2, height: 5 }
     */

    @Complex<TickModel>({ width: 2, height: 5 }, Tick)
    public minorTicks: TickModel;

    /**
     * Sets and gets the start angle of an axis in circular gauge.
     *
     * @default 200
     */

    @Property(200)
    public startAngle: number;

    /**
     * Sets and gets the end angle of an axis in circular gauge.
     *
     * @default 160
     */

    @Property(160)
    public endAngle: number;

    /**
     * Sets and gets the direction of an axis.
     *
     * @default ClockWise
     */

    @Property('ClockWise')
    public direction: GaugeDirection;

    /**
     * Sets and gets the background color of an axis. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Sets and gets the gap between the ranges by specified value in circular gauge.
     *
     * @default null
     */
    @Property(null)
    public rangeGap: number;

    /**
     * Enables and disables the start and end gap between the ranges and axis in circular gauge.
     *
     * @default false
     */
    @Property(false)
    public startAndEndRangeGap: boolean;

    /**
     * Sets and gets the style of the axis label in circular gauge.
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
