import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * Gets and sets the color of the border in the circular gauge. This property accepts value in hex code,
     * rgba string as a valid CSS color string.
     * 
     * @default ''
     */
    color?: string;

    /**
     * Gets and sets the width of the border in circular gauge.
     *
     * @default 1
     */
    width?: number;

    /**
     * Gets and sets the dash-array of the border.
     * 
     * @default ''
     */
    dashArray?: string;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Gets and sets the text font size in an annotation, label, tooltip, and so on. The default of the size is '16px'.
     *
     * @default '16px'
     */
    size?: string;

    /**
     * Gets and sets the font color of the text in annotation, label, tooltip, and so on.
     *
     * @default ''
     */
    color?: string;

    /**
     * Gets and sets the font family for the text in annotation, label, tooltip, and so on.
     *
     * @default 'segoe UI'
     */
    fontFamily?: string;

    /**
     * Gets and sets the font weight for the text in annotation, label, tooltip, and so on.
     *
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Gets and sets the font style for the text in annotation, label, tooltip, and so on.
     *
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Sets and gets the font opacity for the text in annotation, label, tooltip, and so on.
     *
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class RangeTooltip
 */
export interface RangeTooltipModel {

    /**
     * Gets and sets the fill color of the range tooltip. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */

    fill?: string;

    /**
     * Sets and gets the options for the text style of the tooltip text for ranges in circular gauge.
     */

    textStyle?: FontModel;

    /**
     * Sets and gets the format of the range tooltip in circular gauge.
     *
     * @default null
     */
    format?: string;

    /**
     * Sets and gets the custom template to format the tooltip content. Use ${x} and ${y}
     * as a placeholder text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Enables and disables the animation for the range tooltip. The animation is set as true by default.
     *
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Sets and gets the options to customize the style properties of the border for range tooltip.
     */
    border?: BorderModel;

    /**
     * Enables and disables the range tooltip to be shown at mouse position. By default, it set as false.
     *
     * @default false
     */
    showAtMousePosition?: boolean;

}

/**
 * Interface for a class AnnotationTooltip
 */
export interface AnnotationTooltipModel {

    /**
     * Sets and gets the fill color of the annotation tooltip. This property accepts value in hex code,
     * rgba string as a valid CSS color string.
     *
     * @default null
     */
    fill?: string;

    /**
     * Gets and sets the tooltip text style of annotation.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the format of annotation in tooltip.
     *
     * @default null
     */

    format?: string;

    /**
     * Sets and gets the custom template to format the tooltip content. Use ${x} and ${y}
     * as a placeholder text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */

    template?: string | Function;

    /**
     * Enables and disables the animation of the annotation tooltip. By default, the animation is set as true.
     *
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Sets and gets the options to customize the style properties of the border for annotation tooltip.
     */
    border?: BorderModel;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Gets and sets the left margin value of the gauge.
     *
     * @default 10
     */
    left?: number;

    /**
     * Gets and sets the right margin value of the gauge.
     *
     * @default 10
     */
    right?: number;

    /**
     * Gets and sets the top margin value of the gauge.
     *
     * @default 10
     */
    top?: number;

    /**
     * Gets and sets the bottom margin value of the gauge.
     *
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enables or disables the visibility of tooltip.
     *
     * @default false
     */

    enable?: boolean;

    /**
     * Sets and gets the fill color of the pointer tooltip. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */

    fill?: string;

    /**
     * Gets and sets the text style of the pointer tooltip.
     */

    textStyle?: FontModel;

    /**
     * Sets and gets the tooltip settings of the range in circular gauge.
     */

    rangeSettings?: RangeTooltipModel;

    /**
     * Gets and sets the tooltip settings for the annotation in circular gauge.
     */

    annotationSettings?: AnnotationTooltipModel;

    /**
     * Sets and gets the format for the pointer tooltip content in circular gauge. Use ${value} as a placeholder text to display corresponding pointer value.
     *
     * @default null
     */

    format?: string;

    /**
     * Sets and gets the custom template to format the tooltip content. Use ${x} and ${y}
     * as a placeholder text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */

    template?: string | Function;

    /**
     * Enables and disables the animation of the pointer tooltip in circular gauge.
     *
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Sets and gets the options to customize the style properties of the border for pointer tooltip.
     */
    border?: BorderModel;

    /**
     * Enables and disables to show the tooltip of the pointer at mouse position. When set as false which is the default value, the tooltip will be displayed over the axis line.
     *
     * @default false
     */
    showAtMousePosition?: boolean;

    /**
     * Sets and gets the elements such as range, annotation and pointer to which the tooltip must be displayed.
     *
     * @default Pointer
     */
    type?: string[];

}