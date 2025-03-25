import { Rect } from '@syncfusion/ej2-svg-base';
import { RangeNavigator, RangeSlider, PeriodsModel } from '../../range-navigator';
import { ExcelRowAndColumn } from '../../accumulation-chart';
import { IChartEventArgs } from '../../chart/model/chart-interface';

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
 * Provides the event arguments for the chart export functionality.
 *
 */
export interface IExportEventArgs extends IChartEventArgs {
    /**
     * Specifies the width of the exported chart in pixels.
     * This value determines the width of the output file when exporting the chart as an image, PDF, or Excel file.
     *
     */
    width: number;
    /**
     * Specifies the height of the exported chart in pixels.
     * This value determines the height of the output file when exporting the chart as an image, PDF, or Excel file.
     *
     */
    height: number;
    /**
     * Defines additional properties related to the Excel export functionality.
     * This includes settings such as sheet name, cell formatting, and customization options for exported data.
     *
     * If not specified, the default Excel export settings will be applied.
     */
    excelProperties?: ExcelProperties;
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
/**
 * Defines the properties related to Excel export for the chart.
 * These properties are applicable only when exporting the chart to an Excel file.
 *
 * @interface
 * @private
 */
export interface ExcelProperties {
    /** Specifies the collection of rows to be exported to the Excel sheet. */
    rows: ExcelRowAndColumn[];
    /** Specifies the collection of columns to be exported to the Excel sheet. */
    columns: ExcelRowAndColumn[];
}
