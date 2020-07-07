import { SvgRenderer, LinearGradient as Linear, RadialGradient as Radial, GradientColor } from '@syncfusion/ej2-svg-base';import { Pointer, Range } from '../axes/axis';import { LinearGauge } from '../../linear-gauge';import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';

/**
 * Interface for a class ColorStop
 */
export interface ColorStopModel {

    /**
     * Specifies the color of the gradient.
     * @default "#000000"
     */
    color?: string;

    /**
     * Specifies the opacity of the gradient.
     * @default 1
     */
    opacity?: number;

    /**
     * Specifies the offset of the gradient.
     * @default "0%"
     */
    offset?: string;

    /**
     * Specifies the style of the gradient.
     * @default ""
     */
    style?: string;

}

/**
 * Interface for a class GradientPosition
 */
export interface GradientPositionModel {

    /**
     * Specifies the horizontal position of the gradient.
     * @default "0%"
     */
    x?: string;

    /**
     * Specifies the vertical position of the gradient.
     * @default "0%"
     */
    y?: string;

}

/**
 * Interface for a class LinearGradient
 */
export interface LinearGradientModel {

    /**
     * Specifies the start value of the linear gradient.
     * @default "0%"
     */
    startValue?: string;

    /**
     * Specifies the end value of the linear gradient.
     * @default "100%"
     */
    endValue?: string;

    /**
     * Specifies the color, opacity, offset and style of the linear gradient.
     */
    colorStop?: ColorStopModel[];

}

/**
 * Interface for a class RadialGradient
 */
export interface RadialGradientModel {

    /**
     * Specifies the radius of the radial gradient.
     * @default "0%"
     */
    radius?: string;

    /**
     * Specifies the outer position of the radial gradient.
     */
    outerPosition?: GradientPositionModel;

    /**
     * Specifies the inner position of the radial gradient.
     */
    innerPosition?: GradientPositionModel;

    /**
     * Specifies the color, opacity, offset and style of the radial gradient.
     */
    colorStop?: ColorStopModel[];

}

/**
 * Interface for a class Gradient
 */
export interface GradientModel {

}