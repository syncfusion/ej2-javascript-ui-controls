import { CircularGauge } from '../circular-gauge';import { removeElement, getElement, stringToNumber, measureText, textElement, appendPath, calculateShapes, PathOption, RectOption, Size, GaugeLocation, Rect, TextOption } from '../utils/helper-common';import { textTrim, showTooltip } from '../utils/helper-legend';import { Property, Complex, ChildProperty, isNullOrUndefined } from '@syncfusion/ej2-base';import { BorderModel, FontModel, MarginModel } from '../model/base-model';import { Font, Border, Margin } from '../model/base';import { LegendPosition, Alignment, GaugeShape } from '../utils/enum';import { Theme } from '../model/theme';import { Axis } from '../axes/axis';import { ILegendRenderEventArgs } from '../model/interface';import { ILegendRegions } from '../model/interface';import { RangeModel } from '../axes/axis-model';import { Range } from '../axes/axis';

/**
 * Interface for a class Location
 */
export interface LocationModel {

    /**
     * Sets and gets the X coordinate of the legend in the circular gauge.
     *
     * @default 0
     */
    x?: number;

    /**
     * Sets and gets the Y coordinate of the legend in the circular gauge.
     *
     * @default 0
     */
    y?: number;

}

/**
 * Interface for a class LegendSettings
 */
export interface LegendSettingsModel {

    /**
     * Enable and disables the visibility of the legend in circular gauge.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Enables and disables the ranges visibility collapses based on the legend visibility.
     *
     * @default true
     */
    toggleVisibility?: boolean;

    /**
     * Sets and gets the alignment of the legend in the circular gauge.
     *
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Sets and gets the options to customize the border settings of the legend.
     *
     */
    border?: BorderModel;

    /**
     * Sets and gets the options to customize the border for the shape of the legend in the circular gauge.
     */
    shapeBorder?: BorderModel;

    /**
     * Sets and gets the options to customize the padding between legend items.
     *
     * @default 8
     */
    padding?: number;

    /**
     * Sets and gets the opacity of the legend.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the position of the legend in the circular gauge.
     *
     * @default 'Auto'
     */
    position?: LegendPosition;

    /**
     * Sets and gets the shape of the legend in circular gauge.
     *
     * @default Circle
     */
    shape?: GaugeShape;

    /**
     * Sets and gets the height of the legend in the circular gauge.
     *
     * @default null
     */
    height?: string;

    /**
     * Sets and gets the width of the legend in the circular gauge.
     *
     * @default null
     */
    width?: string;

    /**
     * Sets and gets the options to customize the text of the legend.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the height of the legend shape in circular gauge.
     *
     * @default 10
     */
    shapeHeight?: number;

    /**
     * Sets and gets the width of the legend shape in circular gauge.
     *
     * @default 10
     */
    shapeWidth?: number;

    /**
     * Sets and gets the padding for the legend shape in circular gauge.
     *
     * @default 5
     */
    shapePadding?: number;

    /**
     * Sets and gets the location of the legend, relative to the circular gauge.
     * If x is 20, legend moves by 20 pixels to the right of the gauge. It requires the `position` to be `Custom`.
     * ```html
     * <div id='Gauge'></div>
     * ```
     * ```typescript
     * let gauge: CircularGauge = new CircularGauge({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * this.gauge.appendTo('#Gauge');
     * ```
     */
    location?: LocationModel;

    /**
     * Sets and gets the background color of the legend in circular gauge.
     *
     * @default 'transparent'
     */
    background?: string;

    /**
     * Sets and gets the options to customize the legend margin.
     */
    margin?: MarginModel;

}

/**
 * Interface for a class Legend
 */
export interface LegendModel {

}

/**
 * Interface for a class Index
 * @private
 */
export interface IndexModel {

}

/**
 * Interface for a class LegendOptions
 * @private
 */
export interface LegendOptionsModel {

}