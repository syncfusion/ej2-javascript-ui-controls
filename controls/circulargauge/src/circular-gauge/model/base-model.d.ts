import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';

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
     * @default 1
     */
    width?: number;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Font size for text.
     * @default '16px'
     */
    size?: string;

    /**
     * Color for text.
     */
    color?: string;

    /**
     * FontFamily for text.
     * @default 'segoe UI'
     */
    fontFamily?: string;

    /**
     * FontWeight for text.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * FontStyle for text.
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Opacity for text.
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class RangeTooltip
 */
export interface RangeTooltipModel {

    /**
     * The fill color of the range tooltip, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */

    fill?: string;

    /**
     * Options to customize the tooltip text of range.
     */

    textStyle?: FontModel;

    /**
     * Format of the range tooltip content.
     * @default null
     */

    format?: string;

    /**
     * Custom template to format the  tooltip content. Use ${x} and ${y} as a placeholder text to display the corresponding data point.
     * @default null
     */

    template?: string;

    /**
     * If set true, range tooltip will animate, while moving from one point to another.
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Options to customize the border for range tooltip.
     */
    border?: BorderModel;

    /**
     * Options to show the range tooltip position on pointer.
     * @default false
     */
    showAtMousePosition?: boolean;

}

/**
 * Interface for a class AnnotationTooltip
 */
export interface AnnotationTooltipModel {

    /**
     * The fill color of the annotation tooltip, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */

    fill?: string;

    /**
     * Options to customize the tooltip text of annotation.
     */

    textStyle?: FontModel;

    /**
     * Format of the annotation tooltip content.
     * @default null
     */

    format?: string;

    /**
     * Custom template to format the  tooltip content. Use ${x} and ${y} as a placeholder text to display the corresponding data point.
     * @default null
     */

    template?: string;

    /**
     * If set true, range and annotation tooltip will animate, while moving from one point to another.
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Options to customize the border for annotation tooltip.
     */
    border?: BorderModel;

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
     * @default null
     */

    fill?: string;

    /**
     * Options to customize the tooltip text.
     */

    textStyle?: FontModel;

    /**
     * Options to customize the range tooltip property.
     */

    rangeSettings?: RangeTooltipModel;

    /**
     * Options to customize the annotation tooltip property.
     */

    annotationSettings?: AnnotationTooltipModel;

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

    /**
     * Options to show the tooltip position on pointer
     * @default false
     */
    showAtMousePosition?: boolean;

    /**
     * Option to select the tooltip from Range, Annotation, Pointer
     * @default Pointer
     */
    type?: string[];

}