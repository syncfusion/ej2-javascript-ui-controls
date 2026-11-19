/**
 * This has the basic properties required for SvgRenderer and CanvasRenderer
 * @private
 */
export interface BaseAttibutes {
    /**
     * Specifies the ID of an element
     */
    id?: string;
    /**
     * Specifies the fill color value
     */
    fill?: string;
    /**
     * Specifies the border color value
     */
    stroke?: string;
    /**
     * Specifies the width of the border
     */
    'stroke-width'?: number;
    /**
     * Specifies the opacity value of an element
     */
    opacity?: number;
    /**
     * Height of the element
     */
    height?: number;
    /**
     * Width of the element
     */
    width?: number;
    /**
     * X value of the element
     */
    x?: number;
    /**
     * Y value of the element
     */
    y?: number;
    /**
     * Specifies the dash array value of an element
     */
    'stroke-dasharray'?: string;
    /**
     * Property to specify CSS styles for the elements
     */
    style?: string;
    /**
     * Color of the element
     */
    color?: string;
    /**
     * Specifies the name of the class
     */
    class?: string;
    /**
     * Specifies the transformation value
     */
    transform?: string;
    /**
     * Specifies the fill opacity of a shape/element
     */
    'fill-opacity'?: number;
    /**
     * Type of pointer for an element
     */
    pointer?: string;
    /**
     * Specifies the plot value
     */
    plot?: string;
    /**
     * Visibility of an element
     */
    visibility?: string;
    /**
     * Specifies the clip path of an element
     */
    'clip-path'?: string;
}
/**
 * This has the properties for a SVG element
 * @private
 */
export interface SVGAttributes extends BaseAttibutes {
    /**
     * View box property of an element
     */
    viewBox?: string;
    /**
     * Specifies the xmlns link property of a SVG element
     */
    xmlns?: string;
}
/**
 * Properties required to render a circle
 * @private
 */
export interface CircleAttributes extends BaseAttibutes {
    /**
     * Center x value of a circle
     */
    cx?: number;
    /**
     * Center y value of a circle
     */
    cy?: number;
    /**
     * Radius value of a circle
     */
    r?: number;
}
/**
 * Properties required to render a line
 * @private
 */
export interface LineAttributes extends BaseAttibutes {
    /**
     * Specifies the value of x1
     */
    x1?: number;
    /**
     * Specifies the value of x2
     */
    x2?: number;
    /**
     * Specifies the value of y1
     */
    y1?: number;
    /**
     * Specifies the value of y2
     */
    y2?: number;
}
/**
 * Properties required to render a rectangle
 * @private
 */
export interface RectAttributes extends BaseAttibutes {
    /**
     * Corner radius value of a rectangle
     */
    rx?: number;
}
/**
 * Properties required to render path
 * @private
 */
export interface PathAttributes extends BaseAttibutes {
    /**
     * Specifies the d value of a path
     */
    d?: string;
    /**
     * Inner radius value of a path
     */
    innerR?: number;
    /**
     * Value of cx in path
     */
    cx?: number;
    /**
     * Value of cy in path
     */
    cy?: number;
    /**
     * Radius value of a path
     */
    r?: number;
    /**
     * Specifies the start value
     */
    start?: number;
    /**
     * Specifies the end value
     */
    end?: number;
    /**
     * Specifies the radius value
     */
    radius?: number;
    /**
     * Specifies the direction of path
     */
    counterClockWise?: boolean;
}
/**
 * Properties required to render a polyline
 * @private
 */
export interface PolylineAttributes extends BaseAttibutes {
    /**
     * Points required to draw a polyline
     */
    points?: string;
}
/**
 * Properties required to render ellipse
 * @private
 */
export interface EllipseAttributes extends CircleAttributes {
    /**
     * Specifies the rx value
     */
    rx?: number;
    /**
     * Specifies the ry value
     */
    ry?: number;
}
/**
 * Properties required to render a pattern
 * @private
 */
export interface PatternAttributes extends BaseAttibutes {
    /**
     * Units to render a pattern
     */
    patternUnits?: string;
}
/**
 * Properties required to render an image
 * @private
 */
export interface ImageAttributes extends BaseAttibutes {
    /**
     * Specifies the link to render it as image
     */
    href?: string;
    /**
     * Ratio value to render an image
     */
    preserveAspectRatio?: string;
}
/**
 * Properties required to render text
 * @private
 */
export interface TextAttributes extends BaseAttibutes {
    /**
     * Size of the text
     */
    'font-size'?: string;
    /**
     * Font family of the text
     */
    'font-family'?: string;
    /**
     * Font style of the text
     */
    'font-style'?: string;
    /**
     * Weight of the text
     */
    'font-weight'?: string;
    /**
     * Specifies the text anchor value
     */
    'text-anchor'?: string;
    /**
     * Specifies the baseline value
     */
    'baseline'?: string;
    /**
     * Angle of rotation
     */
    'labelRotation'?: number;
}
/**
 * Properties required to render radial gradient
 * @private
 */
export interface RadialGradient {
    /**
     * Specifies the id of the radial gradient
     */
    id?: string;
    /**
     * Specifies the cx value
     */
    cx?: string;
    /**
     * Specifies the cy value
     */
    cy?: string;
    /**
     * Specifies the radius value
     */
    r?: string;
    /**
     * Specifies the fx value
     */
    fx?: string;
    /**
     * Specifies the fy value
     */
    fy?: string;
}
/**
 * Properties required to render linear gradient
 * @private
 */
export interface LinearGradient {
    /**
     * Id of the linear gradient
     */
    id?: string;
    /**
     * Specifies the x1 value
     */
    x1?: string;
    /**
     * Specifies the x2 value
     */
    x2?: string;
    /**
     * Specifies the y1 value
     */
    y1?: string;
    /**
     * Specifies the y2 value
     */
    y2?: string;
}
/**
 * Properties required to render a circle
 */
export interface SVGCanvasAttributes {
    /**
     * To specify a new property
     */
    [key: string]: string;
}
/**
 * Properties required to render a gradient
 * @private
 */
export interface GradientColor {
    /**
     * Specifies the color value of the gradient
     */
    color?: string;
    /**
     * Specifies the colorstop value of the gradient
     */
    colorStop?: string;
    /**
     * Specifies the opacity value of the gradient
     */
    opacity?: string;
     /**
     * Specifies the style for the gradient
     */
    style?: string;    
}
