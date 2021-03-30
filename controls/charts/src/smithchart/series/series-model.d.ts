import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { SmithchartFont } from '../utils/utils';import { SmithchartFontModel } from '../utils/utils-model';import { Theme } from '../model/theme';import { ISmithChartPoint } from '../model/interface';

/**
 * Interface for a class SeriesTooltipBorder
 */
export interface SeriesTooltipBorderModel {

    /**
     * border width  for tooltip.
     *
     * @default 1
     */
    width?: number;

    /**
     * border color for tooltip
     *
     * @default null
     */
    color?: string;

}

/**
 * Interface for a class SeriesTooltip
 */
export interface SeriesTooltipModel {

    /**
     * visibility of tooltip.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * color for tooltip
     *
     * @default null
     */
    fill?: string;

    /**
     * opacity for tooltip.
     *
     * @default 0.95
     */
    opacity?: number;

    /**
     * template for tooltip
     *
     * @default ''
     */
    template?: string;

    /**
     *  options for customizing tooltip border
     */

    border?: SeriesTooltipBorderModel;

}

/**
 * Interface for a class SeriesMarkerBorder
 */
export interface SeriesMarkerBorderModel {

    /**
     * border width for marker border.
     *
     * @default 3
     */
    width?: number;

    /**
     * border color for marker border.
     *
     * @default 'white'
     */
    color?: string;

}

/**
 * Interface for a class SeriesMarkerDataLabelBorder
 */
export interface SeriesMarkerDataLabelBorderModel {

    /**
     * border width for data label border.
     *
     * @default 0.1
     */
    width?: number;

    /**
     * border color for data label color.
     *
     * @default 'white'
     */
    color?: string;

}

/**
 * Interface for a class SeriesMarkerDataLabelConnectorLine
 */
export interface SeriesMarkerDataLabelConnectorLineModel {

    /**
     * border width for data label connector line.
     *
     * @default 1
     */
    width?: number;

    /**
     * border color for data label connector line.
     *
     * @default null
     */
    color?: string;

}

/**
 * Interface for a class SeriesMarkerDataLabel
 */
export interface SeriesMarkerDataLabelModel {

    /**
     * visibility for data label.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * showing template for data label template
     *
     * @default ''
     */
    template?: string;

    /**
     * color for data label.
     *
     * @default null
     */
    fill?: string;

    /**
     * opacity for data label.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * options for customizing data label border
     *
     */
    border?: SeriesMarkerDataLabelBorderModel;

    /**
     * options for customizing data label connector line
     */
    connectorLine?: SeriesMarkerDataLabelConnectorLineModel;

    /**
     * options for customizing font
     */
    textStyle?: SmithchartFontModel;

}

/**
 * Interface for a class SeriesMarker
 */
export interface SeriesMarkerModel {

    /**
     * visibility for marker.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * shape for marker.
     *
     * @default 'circle'
     */
    shape?: string;

    /**
     * width for marker.
     *
     * @default 6
     */
    width?: number;

    /**
     * height for marker.
     *
     * @default 6
     */
    height?: number;

    /**
     * Url for the image that is to be displayed as marker
     *
     * @default ''
     */

    imageUrl?: string;

    /**
     * color for marker.
     *
     * @default ''
     */
    fill?: string;

    /**
     * opacity for marker.
     *
     * @default 1
     */
    opacity?: number;

    /**
     *  options for customizing marker border
     */

    border?: SeriesMarkerBorderModel;

    /**
     * options for customizing marker data label
     */
    dataLabel?: SeriesMarkerDataLabelModel;

}

/**
 * Interface for a class SmithchartSeries
 */
export interface SmithchartSeriesModel {

    /**
     * visibility for series.
     *
     * @default 'visible'
     */
    visibility?: string;

    /**
     * points for series.
     *
     * @default []
     */
    points?: ISmithChartPoint[];

    /**
     * resistance name for dataSource
     *
     * @default ''
     */

    resistance?: string;

    /**
     * reactance name for dataSource
     *
     * @default ''
     */

    reactance?: string;

    /**
     * tooltip mapping name for the series
     *
     * @default ''
     */

    tooltipMappingName?: string;

    /**
     * Specifies the dataSource
     *
     * @default null
     * @isdatamanager false
     */

    dataSource?: Object;

    /**
     * The name of the series visible in legend.
     *
     * @default ''
     */

    name?: string;

    /**
     * color for series.
     *
     * @default null
     */
    fill?: string;

    /**
     * enable or disable the animation of series.
     *
     * @default false
     */
    enableAnimation?: boolean;

    /**
     * perform animation of series based on animation duration.
     *
     * @default '2000ms'
     */
    animationDuration?: string;

    /**
     * avoid the overlap of dataLabels.
     *
     * @default false
     */
    enableSmartLabels?: boolean;

    /**
     * width for series.
     *
     * @default 1
     */
    width?: number;

    /**
     * opacity for series.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * options for customizing marker
     */
    marker?: SeriesMarkerModel;

    /**
     * options for customizing tooltip
     */
    tooltip?: SeriesTooltipModel;

}