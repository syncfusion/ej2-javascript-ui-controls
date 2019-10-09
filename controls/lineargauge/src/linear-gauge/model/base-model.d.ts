import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { Placement, ContainerType } from '../utils/enum';

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Font size for text.
     */
    size?: string;

    /**
     * Color for text.
     */
    color?: string;

    /**
     * FontFamily for text.
     */
    fontFamily?: string;

    /**
     * FontWeight for text.
     */
    fontWeight?: string;

    /**
     * FontStyle for text.
     */
    fontStyle?: string;

    /**
     * Opacity for text.
     * @blazorDefaultValue 1
     */
    opacity?: number;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Left margin in pixels.
     * @default 10
     */
    left?: number;

    /**
     * Right margin in pixels.
     * @default 10
     */
    right?: number;

    /**
     * Top margin in pixels.
     * @default 10
     */
    top?: number;

    /**
     * Bottom margin in pixels.
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border, which accepts value in hex, rgba as a valid CSS color string.
     */
    color?: string;

    /**
     * The width of the border in pixels.
     * @default 0
     */
    width?: number;

}

/**
 * Interface for a class Annotation
 */
export interface AnnotationModel {

    /**
     * Specifies the id of html element.
     */
    content?: string;

    /**
     * Specifies the position of x.
     */
    x?: number;

    /**
     * Specifies the position of y.
     */
    y?: number;

    /**
     * Specifies the vertical alignment of annotation.
     * @default None
     */
    verticalAlignment?: Placement;

    /**
     * Specifies the horizontal alignment of annotation.
     * @default None
     */
    horizontalAlignment?: Placement;

    /**
     * Specifies the zIndex of the annotation.
     * @default '-1'
     */
    zIndex?: string;

    /**
     * The font of the axis labels.
     */

    font?: FontModel;

    /**
     * Specifies the index of axis.
     * @aspDefaultValueIgnore
     */
    axisIndex?: number;

    /**
     * Specifies the value of axis.
     * @aspDefaultValueIgnore
     * @blazorDefaultValue null
     */
    axisValue?: number;

}

/**
 * Interface for a class Container
 */
export interface ContainerModel {

    /**
     * Specifies the type of container.
     * @default Normal
     */
    type?: ContainerType;

    /**
     * Specifies the height of the container.
     * @default 0
     */
    height?: number;

    /**
     * Specifies the width of the container.
     * @default 0
     */
    width?: number;

    /**
     * Specifies the corner radius for rounded rectangle.
     * @default 10
     */
    roundedCornerRadius?: number;

    /**
     * Specifies the background of the color.
     */
    backgroundColor?: string;

    /**
     * Specifies the border of container.
     */
    border?: BorderModel;

    /**
     * Specifies to move the container.
     * @blazorDefaultValue 0
     */
    offset?: number;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enable / Disable the visibility of tooltip.
     * @default false
     */

    enable?: boolean;

    /**
     * The fill color of the tooltip, which accepts value in hex, rgba as a valid CSS color string. 
     */

    fill?: string;

    /**
     * Options to customize the tooltip text.
     */

    textStyle?: FontModel;

    /**
     * Format of the tooltip content.
     * @default null
     */

    format?: string;

    /**
     * Custom template to format the tooltip content. Use ${x} and ${y} as a placeholder text to display the corresponding data point.
     * @default null
     */

    template?: string;

    /**
     * If set true, tooltip will animate, while moving from one point to another.
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Options to customize the border for tooltip.
     */
    border?: BorderModel;

}