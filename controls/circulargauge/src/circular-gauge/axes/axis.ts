/* eslint-disable @typescript-eslint/member-delimiter-style */
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
 * Sets and gets the axis line in circular gauge component.
 */
export class Line extends ChildProperty<Line> {

    /**
     * Sets and gets the width of the line in circular gauge component.
     *
     * @default 2
     */

    @Property(2)
    public width: number;

    /**
     * Sets and gets the dash-array of the axis line in circular gauge component.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * Sets and gets the color of the axis line in the circular gauge component. This property accepts the value in hex code,
     * rgba string as a valid CSS color string.
     */

    @Property(null)
    public color: string;
}

/**
 * Sets and gets the axis label in circular gauge component.
 */
export class Label extends ChildProperty<Label> {

    /**
     * Sets and gets the options to customize the style of the text in axis labels in circular gauge component.
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
     * Sets and gets the position type to place the labels in the axis in the circular gauge component.
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
     * Enables and disables the labels get rotated along the axis in the circular gauge component.
     *
     * @default false
     */
    @Property(false)
    public autoAngle: boolean;

    /**
     * Enables and disables the axis labels to use the range color of the axis.
     *
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;

    /**
     * Sets and gets the value to place the labels from the axis in circular gauge.
     *
     * @default 0
     */

    @Property(0)
    public offset: number;

    /**
     * Enables and disables the default padding value of axis labels in circular gauge component.
     *
     * @default true
     */

    @Property(true)
    public shouldMaintainPadding: boolean;

}

/**
 * Sets and gets the option to customize the ranges of an axis in circular gauge component.
 */

export class Range extends ChildProperty<Range> {

    /** @private */
    public pathElement: Element[];

    /** @private */
    public currentValue: number;

    /**
     * Sets and gets the start value of the range in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default 0
     */

    @Property(0)
    public start: number;

    /**
     * Sets and gets the end value of the range in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default 0
     */

    @Property(0)
    public end: number;

    /**
     * Sets and gets the radius of the range for circular gauge component.
     *
     * @default null
     */

    @Property(null)
    public radius: string;

    /**
     * Sets and gets the width for the start of the range in the circular gauge component.
     *
     * @default '10'
     */

    @Property(10)
    public startWidth: number | string;

    /**
     * Sets and gets the width for the end of the range in the circular gauge component.
     *
     * @default '10'
     */

    @Property(10)
    public endWidth: number | string;

    /**
     * Sets and gets the color of the ranges in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets the corner radius for ranges in circular gauge component.
     *
     * @default 0
     */

    @Property(0)
    public roundedCornerRadius: number;

    /**
     * Sets and gets the opacity for the ranges in circular gauge component.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * Sets and gets the text for the legend in the circular gauge component.
     *
     * @default ''
     */
    @Property('')
    public legendText: string;

    /**
     * Sets and gets the position of the range and pointer for an axis in circular gauge component.
     *
     * @default Auto
     */

    @Property('Auto')
    public position: PointerRangePosition;

    /**
     * Sets and gets the offset value of range in circular gauge component.
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
 * Sets and gets the major and minor tick lines of an axis in circular gauge component.
 */

export class Tick extends ChildProperty<Tick> {

    /**
     * Sets and gets the width of the ticks in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default 2
     */

    @Property(2)
    public width: number;

    /**
     * Sets and gets the height of the ticks in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public height: number;

    /**
     * Sets and gets the interval between the tick lines in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public interval: number;

    /**
     * Sets and gets the distance of the ticks from axis in circular gauge component.
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
     * Sets and gets the position of the ticks in circular gauge component.
     *
     * @default Inside
     */

    @Property('Inside')
    public position: Position;

    /**
     * Enables and disables the tick lines to take the range color.
     *
     * @default false
     */

    @Property(false)
    public useRangeColor: boolean;

    /**
     * Sets and gets the dash-array for the ticks in circular gauge component.
     *
     * @default '0'
     */

    @Property('0')
    public dashArray: string;
}

/**
 * Sets and gets the needle cap of pointer in circular gauge component.
 */

export class Cap extends ChildProperty<Cap> {

    /**
     * Sets and gets the color for the pointer cap in the circular gauge component.
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
     * Sets and gets the border of the pointer cap in the circular gauge component.
     *
     */

    @Complex<BorderModel>({ color: null, width: 8 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the radius of pointer cap in the circular gauge component.
     *
     * @default 8
     */

    @Property(8)
    public radius: number;

}

/**
 * Sets and gets the pointer needle in the circular gauge component.
 */

export class NeedleTail extends ChildProperty<NeedleTail> {

    /**
     * Sets and gets the color for the needle pointer in the circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets options to customize the color and width of the border for the pointer needle in the circular gauge component.
     */

    @Complex<BorderModel>({ color: null, width: 0 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the length of the needle in pixels or in percentage in circular gauge component.
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
 * Sets and gets the animation of pointers in circular gauge component.
 */

export class Animation extends ChildProperty<Animation> {

    /**
     * Enables and disables the pointer animation during initial rendering in circular gauge component.
     *
     * @default true
     */

    @Property(true)
    public enable: boolean;

    /**
     * Sets and gets the duration of animation in milliseconds in circular gauge component.
     *
     * @default 1000
     */

    @Property(1000)
    public duration: number;

}

/**
 * Sets and gets the annotation element for an axis in circular gauge component.
 */

export class Annotation extends ChildProperty<Annotation> {

    /**
     * Sets and gets the content of the annotation. This property accepts the id of the custom element.
     *
     * @default null
     */
    @Property(null)
    public content: string;

    /**
     * Sets and gets the angle for annotation with respect to axis in circular gauge component.
     *
     * @default 90
     */
    @Property(90)
    public angle: number;

    /**
     * Sets and gets the radius for annotation with respect to axis in circular gauge component.
     *
     * @default '50%'
     */
    @Property('50%')
    public radius: string;

    /**
     * Sets and gets the z-index of an annotation in an axis in the circular gauge component.
     *
     * @default '-1'
     */
    @Property('-1')
    public zIndex: string;

    /**
     * Enables and disables the annotation rotation along the axis.
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
 * Sets and gets the pointers of an axis in circular gauge component.
 */

export class Pointer extends ChildProperty<Pointer> {

    /**
     * Sets and gets the value of the pointer in circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public value: number;

    /**
     * Sets and gets the type of pointer for an axis in Circular gauge component.
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
     * Sets and gets the url for the image that is to be displayed as pointer.
     * It requires marker shape value to be Image.
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
     * Sets and gets the cap of pointer in an axis.
     */

    @Complex<CapModel>({}, Cap)
    public cap: CapModel;

    /**
     * Sets and gets the style of text in pointer of an axis.
     */

    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the tail of needle pointer in an axis.
     */

    @Complex<NeedleTailModel>({}, NeedleTail)
    public needleTail: NeedleTailModel;

    /**
     * Sets and gets the color of the pointer in an axis.
     */

    @Property(null)
    public color: string;

    /**
     * Sets and gets the options to customize the color and width of the border for the needle pointer in an axis.
     */

    @Complex<BorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the animation of pointers while rendering the axis in circular gauge.
     */

    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * Sets and gets the shape of the marker type pointer in an axis.
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
     * Sets and gets the text in pointer.
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
     * Sets or gets the start width of the needle pointer in an axis.
     *
     * @default null
     */

    @Property(null)
    public needleStartWidth: number;

    /**
     * Sets or gets the end width of the needle pointer in an axis.
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
 * Sets and gets the options to customize the axis for the circular gauge component.
 */

export class Axis extends ChildProperty<Axis> {

    /**
     * Sets and gets the minimum value of an axis in the circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public minimum: number;

    /**
     * Sets and gets the maximum value of an axis in the circular gauge component.
     *
     * @aspDefaultValueIgnore
     * @default null
     */

    @Property(null)
    public maximum: number;

    /**
     * Enables and disables the last label of axis when it is hidden in circular gauge component.
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
     * Sets and gets the rounding Off value in the label in an axis.
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
     * Sets and gets the style of the line in axis of circular gauge component.
     */

    @Complex<LineModel>({}, Line)
    public lineStyle: LineModel;

    /**
     * Sets and gets the ranges of an axis in circular gauge component.
     */

    @Collection<RangeModel>([{}], Range)
    public ranges: RangeModel[];

    /**
     * Sets and gets the pointers of an axis in circular gauge component.
     */

    @Collection<PointerModel>([{}], Pointer)
    public pointers: PointerModel[];

    /**
     * Sets and gets the annotation element for an axis in circular gauge component.
     */

    @Collection<AnnotationModel>([{}], Annotation)
    public annotations: AnnotationModel[];

    /**
     * Sets and gets the major tick lines of an axis in circular gauge component.
     *
     * @default { width: 2, height: 10 }
     */

    @Complex<TickModel>({ width: 2, height: 10 }, Tick)
    public majorTicks: TickModel;

    /**
     * Sets and gets the minor tick lines of an axis in circular gauge component.
     *
     * @default { width: 2, height: 5 }
     */

    @Complex<TickModel>({ width: 2, height: 5 }, Tick)
    public minorTicks: TickModel;

    /**
     * Sets and gets the start angle of an axis in circular gauge component.
     *
     * @default 200
     */

    @Property(200)
    public startAngle: number;

    /**
     * Sets and gets the end angle of an axis in circular gauge component.
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
     * Sets and gets the gap between the ranges by specified value in circular gauge component.
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
     * Sets and gets the style of the axis label in circular gauge component.
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
