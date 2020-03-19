import {  NotifyPropertyChanges, Property, Event, Complex, INotifyPropertyChanged, updateBlazorTemplate } from '@syncfusion/ej2-base';import {  extend,  compile as templateComplier, Component, resetBlazorTemplate, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';import { SvgRenderer } from '../svg-render/index';import {  ChildProperty, createElement, EmitType, remove, Browser, AnimationOptions, Animation} from '@syncfusion/ej2-base';import { ITooltipThemeStyle, ITooltipRenderingEventArgs, ITooltipAnimationCompleteArgs, IBlazorTemplate} from './interface';import { ITooltipLoadedEventArgs, getTooltipThemeColor } from './interface';import { Size, Rect, Side, measureText, getElement, findDirection, drawSymbol, textElement } from './helper';import { removeElement, TextOption, TooltipLocation, PathOption } from './helper';import { TooltipShape, TooltipTheme, TooltipPlacement } from './enum';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TextStyle
 * @private
 */
export interface TextStyleModel {

    /**
     * Font size for the text.
     * @default null
     */
    size?: string;

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
     * FontWeight for the text.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * FontStyle for the text.
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class TooltipBorder
 * @private
 */
export interface TooltipBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    color?: string;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    width?: number;

}

/**
 * Interface for a class AreaBounds
 * @private
 */
export interface AreaBoundsModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    x?: number;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    y?: number;

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    width?: number;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    height?: number;

}

/**
 * Interface for a class ToolLocation
 * @private
 */
export interface ToolLocationModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    x?: number;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    y?: number;

}

/**
 * Interface for a class Tooltip
 * @private
 */
export interface TooltipModel extends ComponentModel{

    /**
      * Enables / Disables the visibility of the tooltip.
      * @default false.
      * @private.
      */
    enable?: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     * @default false.
     * @private.
     */
    shared?: boolean;

    /**
     * To enable shadow for the tooltip.
     * @default true.
     * @private.
     */

    enableShadow?: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @private.
     */

    fill?: string;

    /**
     * Header for tooltip.
     * @private.
     */

    header?: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @private.
     */

    opacity?: number;

    /**
     * Options to customize the ToolTip text.
     * @private.
     */

    textStyle?: TextStyleModel;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     * @default null.
     * @private.
     */

    template?: string;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.
     * @default true.
     * @private.
     */
    enableAnimation?: boolean;

    /**
     * Duration for Tooltip animation.
     * @default 300
     * @private.
     */
    duration?: number;

    /**
    * To rotate the tooltip.
    * @default false.
    * @private.
    */
    inverted?: boolean;

    /**
    * Negative value of the tooltip.
    * @default true.
    * @private.
    */
    isNegative?: boolean;

    /**
     * Options to customize tooltip borders.
     * @private.
     */
    border?: TooltipBorderModel;

    /**
     * Content for the tooltip.
     * @private.
     */
    content?: string[];

    /**
     * Content for the tooltip.
     * @private.
     */
    markerSize?: number;

    /**
     * Clip location.
     * @private.
     */
    clipBounds?: ToolLocationModel;

    /**
     * Palette for marker.
     * @private.
     */
    palette?: string[];

    /**
     * Shapes for marker.
     * @private.
     */
    shapes?: TooltipShape[];

    /**
     * Location for Tooltip.
     * @private.
     */
    location?: ToolLocationModel;

    /**
     * Location for Tooltip.
     * @private.
     */
    offset?: number;

    /**
     * Rounded corner for x.
     * @private.
     */
    rx?: number;

    /**
     * Rounded corner for y.
     * @private.
     */
    ry?: number;

    /**
     * Margin for left and right.
     * @private.
     */
    marginX?: number;

    /**
     *  Margin for top and bottom.
     *  @private.
     */
    marginY?: number;

    /**
     * Padding for arrow.
     * @private.
     */
    arrowPadding?: number;

    /**
     * Data for template.
     * @private.
     */
    data?: Object;

    /**
    * Specifies the theme for the chart.
    * @default 'Material'
    * @private.
    */
    theme?: TooltipTheme;

    /**
     * Bounds for the rect.
     * @private.
     */
    areaBounds?: AreaBoundsModel;

    /**
     * Bounds for chart.
     * @private.
     */
    availableSize?: Size;

    /**
     * Blazor templates
     */
    blazorTemplate?: IBlazorTemplate;

    /**
     * To check chart is canvas.
     * @default false.
     * @private.
     */

    isCanvas?: boolean;

    /**
     * To check tooltip wrap for chart.
     * @default false.
     * @private.
     */

    isTextWrap?: boolean;

    /**
     * To place tooltip in a particular position.
     * @default null.
     * @private.
     */
    tooltipPlacement?: TooltipPlacement;

    /**
     * Triggers before each axis range is rendered.
     * @event
     * @private.
     */
    tooltipRender?: EmitType<ITooltipRenderingEventArgs>;

    /**
     * Triggers after chart load.
     * @event
     * @private.
     */
    loaded?: EmitType<ITooltipLoadedEventArgs>;

    /**
     * Triggers after chart load.
     * @event
     * @private.
     */
    animationComplete?: EmitType<ITooltipAnimationCompleteArgs>;

}