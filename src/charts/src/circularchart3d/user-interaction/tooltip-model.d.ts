import { ChildProperty, Complex, Property, extend, remove } from '@syncfusion/ej2-base';import { BorderModel, FontModel, LocationModel } from '../../common/model/base-model';import { Border, Font, Location } from '../../common/model/base';import { CircularChart3D } from '../circularchart3d';import { removeElement, stopTimer, withInBounds } from '../../common/utils/helper';import { CircularChart3DPoints, CircularChart3DSeries } from '../renderer/series';import { Tooltip as SVGTooltip, ITooltipAnimationCompleteArgs, Rect } from '@syncfusion/ej2-svg-base';import { tooltipRender } from '../../common/model/constants';import { CircularChart3DTooltipRenderEventArgs } from '../model/pie-interface';import { CircularChart3DLocation } from '../model/circular3d-base';

/**
 * Interface for a class CircularChart3DPointData
 * @private
 */
export interface CircularChart3DPointDataModel {

}

/**
 * Interface for a class CircularChart3DTooltipSettings
 */
export interface CircularChart3DTooltipSettingsModel {

    /**
     * If set to true, enables the tooltip for the data points.
     *
     * @default false.
     */
    enable?: boolean;

    /**
     * If set to true, enables the marker in the chart tooltip.
     *
     * @default true.
     */
    enableMarker?: boolean;

    /**
     * The fill color of the tooltip, specified as a valid CSS color string in hex or rgba format.
     *
     * @default null
     */
    fill?: string;

    /**
     * The header text for the tooltip. By default, it displays the series name.
     *
     * @default null
     */
    header?: string;

    /**
     * The opacity of the tooltip, expressed as a numerical value.
     *
     * @default null
     */
    opacity?: number;

    /**
     * Options for customizing the tooltip text appearance.
     */
    textStyle?: FontModel;

    /**
     * The format for customizing the tooltip content.
     *
     * @default null.
     */
    format?: string;

    /**
     * A custom template used to format the tooltip content. You can use ${x} and ${y} as placeholder text to display the corresponding data points.
     *
     * @default null.
     * @aspType string
     */
    template?: string | Function;

    /**
     * If set to true, tooltip will animate while moving from one point to another.
     *
     * @default false.
     */
    enableAnimation?: boolean;

    /**
     * Duration for the tooltip animation.
     *
     * @default 300
     */
    duration?: number;

    /**
     * Duration of the fade-out animation for hiding the tooltip.
     *
     * @default 700
     */
    fadeOutDuration?: number;

    /**
     * To wrap the tooltip long text based on available space.
     * This is only application for chart tooltip.
     *
     * @default false
     */
    enableTextWrap?: boolean;

    /**
     * Options for customizing the tooltip borders.
     */
    border?: BorderModel;

    /**
     * Specifies the location of the tooltip, relative to the chart.
     * If x is 20, tooltip moves by 20 pixels to the right of the chart
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let pie: CircularChart3D = new CircularChart3D({
     * ...
     * tooltip: {
     * enable: true,
     * location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * pie.appendTo('#Chart');
     * ```
     */
    location?: LocationModel;

}

/**
 * Interface for a class CircularChartTooltip3D
 */
export interface CircularChartTooltip3DModel {

}