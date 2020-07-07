import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { RangeNavigatorType, ThumbType } from '../utils/enum';import { Border, Animation, Font } from '../../common/model/base';import { BorderModel, AnimationModel, FontModel } from '../../common/model/base-model';import { Axis } from '../../chart/axis/axis';import { TooltipDisplayMode } from  '../utils/enum';import { Rect } from '@syncfusion/ej2-svg-base';import { RangeNavigator, DataPoint } from '../index';import { RangeNavigatorTheme  } from '../utils/theme';

/**
 * Interface for a class RangeNavigatorSeries
 */
export interface RangeNavigatorSeriesModel {

    /**
     * It defines the data source for a series.
     * @default null
     */
    dataSource?: Object | DataManager;

    /**
     * It defines the xName for the series
     * @default null
     */
    xName?: string;

    /**
     * It defines the yName for the series
     * @default  null
     */
    yName?: string;

    /**
     * It defines the query for the data source
     * @default null
     */
    query?: Query;

    /**
     * It defines the series type of the range navigator
     * @default 'Line'
     */
    type?: RangeNavigatorType;

    /**
     * Options to customizing animation for the series.
     */

    animation?: AnimationModel;

    /**
     * Options for customizing the color and width of the series border.
     */
    border?: BorderModel;

    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.
     * @default null
     */

    fill?: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.
     * @default 1
     */

    width?: number;

    /**
     * The opacity for the background.
     * @default 1
     */

    opacity?: number;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
     * @default '0'
     */
    dashArray?: string;

}

/**
 * Interface for a class ThumbSettings
 */
export interface ThumbSettingsModel {

    /**
     * width of thumb
     * @default null
     * @aspDefaultValueIgnore
     */
    width?: number;

    /**
     * height of thumb
     * @default null
     * @aspDefaultValueIgnore
     */
    height?: number;

    /**
     * border for the thumb
     */
    border?: BorderModel;

    /**
     * fill color for the thumb
     * @default null
     */
    fill?: string;

    /**
     * type of thumb
     * @default `Circle`
     */
    type?: ThumbType;

}

/**
 * Interface for a class StyleSettings
 */
export interface StyleSettingsModel {

    /**
     * thumb settings
     */
    thumb?: ThumbSettingsModel;

    /**
     * Selected region color
     * @default null
     */
    selectedRegionColor?: string;

    /**
     * Un Selected region color
     * @default null
     */
    unselectedRegionColor?: string;

}

/**
 * Interface for a class RangeTooltipSettings
 */
export interface RangeTooltipSettingsModel {

    /**
     * Enables / Disables the visibility of the tooltip.
     * @default false.
     */

    enable?: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 
     * @default 0.85
     */

    opacity?: number;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 
     * @default null
     */

    fill?: string;

    /**
     * Format the ToolTip content.
     * @default null.
     */

    format?: string;

    /**
     * Options to customize the ToolTip text.
     */

    textStyle?: FontModel;

    /**
     * Custom template to format the ToolTip content. Use ${value} as the placeholder text to display the corresponding data point.
     * @default null.
     */

    template?: string;

    /**
     * Options to customize tooltip borders.
     */
    border?: BorderModel;

    /**
     * It defines display mode for tooltip
     * @default 'OnDemand'
     */
    displayMode?: TooltipDisplayMode;

}