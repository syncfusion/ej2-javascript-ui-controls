import { CircularGauge } from '../circular-gauge';import { appendPath, textElement, PathOption, TextOption, calculateShapes, textTrim, removeElement } from '../utils/helper';import { Rect, Size, GaugeLocation, stringToNumber, measureText, RectOption, getElement, showTooltip } from '../utils/helper';import { Property, Complex, ChildProperty, isNullOrUndefined } from '@syncfusion/ej2-base';import { BorderModel, FontModel, MarginModel } from '../model/base-model';import { Font, Border, Margin } from '../model/base';import { LegendPosition, Alignment, GaugeShape } from '../utils/enum';import { Theme } from '../model/theme';import { Axis } from '../axes/axis';import { ILegendRenderEventArgs } from '../model/interface';import { ILegendRegions } from '../model/interface';import { RangeModel } from '../axes/axis-model';import { Range } from '../axes/axis';

/**
 * Interface for a class Location
 */
export interface LocationModel {

    /**
     * X coordinate of the legend in pixels.

     */
    x?: number;

    /**
     * Y coordinate of the legend in pixels.

     */
    y?: number;

}

/**
 * Interface for a class LegendSettings
 */
export interface LegendSettingsModel {

    /**
     * If set to true, legend will be visible.

     */
    visible?: boolean;

    /**
     * If set to true, series' visibility collapses based on the legend visibility.

     */
    toggleVisibility?: boolean;

    /**
     * Legend in chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the chart.
     * * Center: Aligns the legend to the center of the chart.
     * * Far: Aligns the legend to the right of the chart.

     */
    alignment?: Alignment;

    /**
     * Options to customize the border of the legend.
     */
    border?: BorderModel;

    /**
     * Options to customize the border of the legend.
     */
    shapeBorder?: BorderModel;

    /**
     * Option to customize the padding between legend items.

     */
    padding?: number;

    /**
     * Opacity of the legend.

     */
    opacity?: number;

    /**
     * Position of the legend in the circular gauge are,
     * * Auto: Displays the legend based on the avail space of the circular this.gauge.
     * * Top: Displays the legend at the top of the circular this.gauge.
     * * Left: Displays the legend at the left of the circular this.gauge.
     * * Bottom: Displays the legend at the bottom of the circular this.gauge.
     * * Right: Displays the legend at the right of the circular this.gauge.

     */
    position?: LegendPosition;

    /**
     * Customize the legend shape of the maps.

     */
    shape?: GaugeShape;

    /**
     * The height of the legend in pixels.

     */
    height?: string;

    /**
     * The width of the legend in pixels.

     */
    width?: string;

    /**
     * Options to customize the legend text.
     */
    textStyle?: FontModel;

    /**
     * Height of the shape

     */
    shapeHeight?: number;

    /**
     * Width of the shape

     */
    shapeWidth?: number;

    /**
     * Padding for the shape

     */
    shapePadding?: number;

    /**
     * Specifies the location of the legend, relative to the chart.
     * If x is 20, legend moves by 20 pixels to the right of the chart. It requires the `position` to be `Custom`.
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
     * Options to customize the legend background

     */
    background?: string;

    /**
     * Options to customize the legend margin
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