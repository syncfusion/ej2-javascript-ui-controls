import { Rect } from '@syncfusion/ej2-svg-base';
import { RangeNavigator, RangeSlider, PeriodsModel } from '../../range-navigator';

/** @private */
export interface IFontMapping {
    size?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    fontFamily?: string;
    opacity?: number;
}

/** @private */
export interface IShapes {
    renderOption?: Object;
    functionName?: string;
}

/** @private */
/**
 * Specifies the Theme style for scrollbar.
 */
export interface IScrollbarThemeStyle {
    backRect: string;
    thumb: string;
    circle: string;
    circleHover: string;
    arrow: string;
    grip: string;
    arrowHover?: string;
    backRectBorder?: string;
}

export interface ILegendRegions {
    rect: Rect;
    index: number;
}

/**
 * Period selector component interface
 *
 * @private
 */

export interface IPeriodSelectorControl {
    /**
     * Element for the control
     */
    element: HTMLElement;
    /**
     * Series min value.
     */
    seriesXMin: number;
    /**
     * Series max value.
     */
    seriesXMax: number;
    /**
     * Start value for the axis.
     */
    startValue: number;
    /**
     * End value for the axis.
     */
    endValue: number;
    /**
     * Range slider instance.
     */
    rangeSlider: RangeSlider;
    /**
     * To disable the range selector.
     */
    disableRangeSelector: boolean;
    /**
     * To config period selector settings.
     */
    periods: PeriodsModel[];
    /**
     * Range navigator
     */
    rangeNavigatorControl: RangeNavigator;
}

/**
 * Header Footer Content.
 *
 * @private
 */

export interface IPDFArgs {
    /**
     * Content of the header
     */
    content: string;
    /**
     * FontSize of the content
     */
    fontSize?: number;
    /**
     * x position for the content
     */
    x?: number;
    /**
     * y position for the content
     */
    y?: number;
}

/**
 * Interface representing the arguments passed to an event that occurs after exporting data.
 *
 * @interface
 * @private
 */
export interface IAfterExportEventArgs {
    /** Specifies the name of the event. */
    name: string;
    /** Defines the event's cancellation status. */
    cancel: boolean;
    /** Provides the data URL generated after exporting. */
    dataUrl: string;
}

/**
 * Axis visible range.
 *
 * @public
 */
export interface VisibleRangeModel {
    /** Axis minimum value. */
    min?: number;
    /** Axis maximum value. */
    max?: number;
    /** Axis interval value. */
    interval?: number;
    /** Axis delta value. */
    delta?: number;
}
