import { CircularGauge } from '../circular-gauge';import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { GradientColor, LinearGradient as Linear, RadialGradient as Radial } from '@syncfusion/ej2-svg-base';import { PointerModel, CapModel, NeedleTailModel, RangeModel } from '../axes/axis-model';import { SvgRenderer } from '@syncfusion/ej2-svg-base';

/**
 * Interface for a class ColorStop
 */
export interface ColorStopModel {

    /**
     * Defines the color to be used in the gradient.
     * @default '#000000'
     */
    color?: string;

    /**
     *  Defines the opacity to be used in the gradient.
     * @default 1
     */
    opacity?: number;

    /**
     *  Defines the gradient color begin and end in percentage
     * @default '0%'
     */
    offset?: string;

    /**
     * Defines the style of the color stop in the gradient element.
     * @default ''
     */
    style?: string;

}

/**
 * Interface for a class GradientPosition
 */
export interface GradientPositionModel {

    /**
     * Defines the horizontal position in percentage.
     * @default '0%'
     */
    x?: string;

    /**
     * Defines the vertical position in percentage.
     * @default '0%'
     */
    y?: string;

}

/**
 * Interface for a class LinearGradient
 */
export interface LinearGradientModel {

    /**
     * Defines the start value of the linear gradient.
     * @default '0%'
     */
    startValue?: string;

    /**
     * Defines the end value of the linear gradient.
     * @default '100%'
     */
    endValue?: string;

    /**
     * Defines the color range properties for the gradient.
     */
    colorStop?: ColorStopModel[];

}

/**
 * Interface for a class RadialGradient
 */
export interface RadialGradientModel {

    /**
     * Defines the radius of the radial gradient in percentage.
     * @default '0%'
     */
    radius?: string;

    /**
     * Defines the outer circle of the radial gradient.
     */
    outerPosition?: GradientPositionModel;

    /**
     * Defines the inner circle of the radial gradient.
     * 
     */
    innerPosition?: GradientPositionModel;

    /**
     * Defines the color range properties for the gradient.
     */
    colorStop?: ColorStopModel[];

}

/**
 * Interface for a class Gradient
 */
export interface GradientModel {

}