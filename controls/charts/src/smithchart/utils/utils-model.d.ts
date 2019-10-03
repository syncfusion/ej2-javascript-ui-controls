import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class SmithchartFont
 */
export interface SmithchartFontModel {

    /**
     * font family for text.
     */
    fontFamily?: string;

    /**
     * font style for text.

     */
    fontStyle?: string;

    /**
     * font weight for text.

     */
    fontWeight?: string;

    /**
     * Color for the text.

     */
    color?: string;

    /**
     * font size for text.

     */
    size?: string;

    /**
     * font opacity for text.

     */
    opacity?: number;

}

/**
 * Interface for a class SmithchartMargin
 */
export interface SmithchartMarginModel {

    /**
     * top margin of chartArea.

     */
    top?: number;

    /**
     * bottom margin of chartArea.

     */
    bottom?: number;

    /**
     * right margin of chartArea.

     */

    right?: number;

    /**
     * left margin of chartArea.

     */

    left?: number;

}

/**
 * Interface for a class SmithchartBorder
 */
export interface SmithchartBorderModel {

    /**
     * width for smithchart border.

     */

    width?: number;

    /**
     * opacity for smithchart border.

     */
    opacity?: number;

    /**
     * color for smithchart border .

     */

    color?: string;

}

/**
 * Interface for a class SmithchartRect
 */
export interface SmithchartRectModel {

}

/**
 * Interface for a class LabelCollection
 */
export interface LabelCollectionModel {

}

/**
 * Interface for a class LegendSeries
 */
export interface LegendSeriesModel {

}

/**
 * Interface for a class LabelRegion
 */
export interface LabelRegionModel {

}

/**
 * Interface for a class HorizontalLabelCollection
 */
export interface HorizontalLabelCollectionModel extends LabelCollectionModel{

}

/**
 * Interface for a class RadialLabelCollections
 */
export interface RadialLabelCollectionsModel extends HorizontalLabelCollectionModel{

}

/**
 * Interface for a class LineSegment
 */
export interface LineSegmentModel {

}

/**
 * Interface for a class PointRegion
 */
export interface PointRegionModel {

}

/**
 * Interface for a class Point
 */
export interface PointModel {

}

/**
 * Interface for a class ClosestPoint
 */
export interface ClosestPointModel {

}

/**
 * Interface for a class MarkerOptions
 */
export interface MarkerOptionsModel {

}

/**
 * Interface for a class SmithchartLabelPosition
 */
export interface SmithchartLabelPositionModel {

}

/**
 * Interface for a class Direction
 */
export interface DirectionModel {

}

/**
 * Interface for a class DataLabelTextOptions
 */
export interface DataLabelTextOptionsModel {

}

/**
 * Interface for a class LabelOption
 */
export interface LabelOptionModel {

}

/**
 * Interface for a class SmithchartSize
 * @private
 */
export interface SmithchartSizeModel {

}

/**
 * Interface for a class GridArcPoints
 * @private
 */
export interface GridArcPointsModel {

}