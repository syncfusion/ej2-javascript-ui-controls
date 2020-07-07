import { ChildProperty, Property } from '@syncfusion/ej2-base';import { TextAlignmentType } from '../utils/enum';

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * To customize top margin value
     * @default 10
     */

    top?: number;

    /**
     * To customize top bottom value
     * @default 10
     */

    bottom?: number;

    /**
     * To customize top left value
     * @default 10
     */

    left?: number;

    /**
     * To customize top right value
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
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Font size for the text.
     * @default '16px'
     */
    size?: string;

    /**
     * FontWeight for the text.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Color for the text.
     * @default ''
     */
    color?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    opacity?: number;

    /**
     * text alignment for label
     * @default Far
     */
    textAlignment?: TextAlignmentType;

    /**
     * label text
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
     * @default false
     */
    enable?: boolean;

    /**
     * duration
     * @default 2000
     */
    duration?: number;

    /**
     * delay
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
     * @default null
     */
    content?: string;

    /**
     * to move annotation 
     * @default 0
     */
    annotationAngle?: number;

    /**
     * to move annotation 
     * @default '0%'
     */
    annotationRadius?: string;

}

/**
 * Interface for a class RangeColor
 */
export interface RangeColorModel {

    /**
     * color
     * @default null
     */
    color?: string;

    /**
     * start
     * @default null
     */
    start?: number;

    /**
     * end
     * @default null
     */
    end?: number;

}