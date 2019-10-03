import { Property, Complex, ChildProperty} from '@syncfusion/ej2-base';import { SmithchartFont} from '../utils/utils';import { SmithchartFontModel} from '../utils/utils-model';import { Theme } from '../model/theme';

/**
 * Interface for a class SeriesTooltipBorder
 */
export interface SeriesTooltipBorderModel {

    /**
 * border width  for tooltip.

 */
    width?: number;

    /**
 * border color for tooltip

 */
    color?: string;

}

/**
 * Interface for a class SeriesTooltip
 */
export interface SeriesTooltipModel {

    /**
 * visibility of tooltip.

 */
    visible?: boolean;

    /**
 * color for tooltip .

 */
    fill?: string;

    /**
 * opacity for tooltip.

 */
    opacity?: number;

    /**
  * template for tooltip

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

 */
    width?: number;

    /**
 * border color for marker border.

 */
    color?: string;

}

/**
 * Interface for a class SeriesMarkerDataLabelBorder
 */
export interface SeriesMarkerDataLabelBorderModel {

    /**
 * border width for data label border.

 */
    width?: number;

    /**
 * border color for data label color.

 */
    color?: string;

}

/**
 * Interface for a class SeriesMarkerDataLabelConnectorLine
 */
export interface SeriesMarkerDataLabelConnectorLineModel {

    /**
 * border width for data label connector line.

 */
    width?: number;

    /**
 * border color for data label connector line.

 */
    color?: string;

}

/**
 * Interface for a class SeriesMarkerDataLabel
 */
export interface SeriesMarkerDataLabelModel {

    /**
 * visibility for data label.

 */
    visible?: boolean;

    /**
 * showing template for data label template

 */
    template?: string;

    /**
 * color for data label.

 */
    fill?: string;

    /**
 * opacity for data label.

 */
    opacity?: number;

    /**
 *  options for customizing data label border
 */
    border?: SeriesMarkerDataLabelBorderModel;

    /**
 *  options for customizing data label connector line
 */
    connectorLine?: SeriesMarkerDataLabelConnectorLineModel;

    /**
 *  options for customizing font
 */


    textStyle?: SmithchartFontModel;

}

/**
 * Interface for a class SeriesMarker
 */
export interface SeriesMarkerModel {

    /**
 * visibility for marker.

 */
    visible?: boolean;

    /**
 * shape for marker.

 */
    shape?: string;

    /**
 * width for marker.

 */
    width?: number;

    /**
 * height for marker.

 */
    height?: number;

    /**
 * Url for the image that is to be displayed as marker

 */

    imageUrl?: string;

    /**
 * color for marker.

 */
    fill?: string;

    /**
 * opacity for marker.

 */
    opacity?: number;

    /**
     *  options for customizing marker border
     */

    border?: SeriesMarkerBorderModel;

    /**
 *  options for customizing marker data label 
 */
    dataLabel?: SeriesMarkerDataLabelModel;

}

/**
 * Interface for a class SmithchartSeries
 */
export interface SmithchartSeriesModel {

    /**
 * visibility for series.

 */
    visibility?: string;

    /**
 * points for series.

 */
    points?: { resistance: number,  reactance: number}[];

    /**
 * resistance name for dataSource

 */

    resistance?: string;

    /**
 * reactance name for dataSource

 */

    reactance?: string;

    /**
 *  Specifies the dataSource


 */

    dataSource?: Object;

    /**
 * The name of the series visible in legend.

 */

    name?: string;

    /**
 * color for series.

 */
    fill?: string;

    /**
 * enable or disable the animation of series.

 */
    enableAnimation?: boolean;

    /**
 * perform animation of series based on animation duration.

 */
    animationDuration?: string;

    /**
 * avoid the overlap of dataLabels.

 */
    enableSmartLabels?: boolean;

    /**
 * width for series.

 */
    width?: number;

    /**
 * opacity for series.

 */
    opacity?: number;

    /**
 *  options for customizing marker
 */
    marker?: SeriesMarkerModel;

    /**
 *  options for customizing tooltip
 */
    tooltip?: SeriesTooltipModel;

}