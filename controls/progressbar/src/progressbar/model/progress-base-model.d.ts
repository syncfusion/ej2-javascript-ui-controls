import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';import { TextAlignmentType } from '../utils/enum';

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * To customize top margin value
     *
     * @default 10
     */

    top?: number;

    /**
     * To customize top bottom value
     *
     * @default 10
     */

    bottom?: number;

    /**
     * To customize top left value
     *
     * @default 10
     */

    left?: number;

    /**
     * To customize top right value
     *
     * @default 10
     */

    right?: number;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Font size for the text.
     *
     * @default '16px'
     */
    size?: string;

    /**
     * FontWeight for the text.
     *
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Color for the text.
     *
     * @default ''
     */
    color?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.
     *
     * @default null
     */
    opacity?: number;

    /**
     * text alignment for label
     *
     * @default Far
     */
    textAlignment?: TextAlignmentType;

    /**
     * label text
     *
     * @default ''
     */
    text?: string;

}

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * enable
     *
     * @default false
     */
    enable?: boolean;

    /**
     * duration
     *
     * @default 2000
     */
    duration?: number;

    /**
     * delay
     *
     * @default 0
     */
    delay?: number;

}

/**
 * Interface for a class ProgressAnnotationSettings
 */
export interface ProgressAnnotationSettingsModel {

    /**
     * Content of the annotation, which accepts the id of the custom element.
     *
     * @default null
     */
    content?: string;

    /**
     * to move annotation
     *
     * @default 0
     */
    annotationAngle?: number;

    /**
     * to move annotation
     *
     * @default '0%'
     */
    annotationRadius?: string;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border that accepts value in hex as a valid CSS color string.
     *
     * @default ''
     */

    color?: string;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */

    width?: number;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * If set to true, tooltip will be displayed for the progress bar.
     *
     * @default false.
     */

    enable?: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex as a valid CSS color string.
     *
     * @default null.
     */

    fill?: string;

    /**
     * Format the tooltip content. Use ${value} as the placeholder text to display the corresponding progress value.
     *
     * @default null.
     */

    format?: string;

    /**
     * If set to true, tooltip will be displayed for the progress bar on mouse hover.
     *
     * @default false.
     */

    showTooltipOnHover?: boolean;

    /**
     * Options to customize the tooltip text.
     *
     */

    textStyle?: FontModel;

    /**
     * Options to customize tooltip borders.
     *
     * @default {}
     */

    border?: BorderModel;

}

/**
 * Interface for a class RangeColor
 */
export interface RangeColorModel {

    /**
     * color
     *
     * @default null
     */
    color?: string;

    /**
     * start
     *
     * @default null
     */
    start?: number;

    /**
     * end
     *
     * @default null
     */
    end?: number;

}