import { ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';import { ZIndex, Anchor, BorderType, SizeType } from '../utils/enum';import { Theme } from '../../common/model/theme';import { Font, Border } from '../../common/model/base';import { BorderModel, FontModel } from '../../common/model/base-model';import { Units, Alignment, Regions, Position, TextOverflow } from '../../common/utils/enum';

/**
 * Interface for a class ChartAnnotationSettings
 */
export interface ChartAnnotationSettingsModel {

    /**
     * if set coordinateUnit as `Pixel` X specifies the axis value
     * else is specifies pixel or percentage of coordinate

     */
    x?: string | Date | number;

    /**
     * if set coordinateUnit as `Pixel` Y specifies the axis value
     * else is specifies pixel or percentage of coordinate

     */
    y?: string | number;

    /**
     * Content of the annotation, which accepts the id of the custom element.

     */
    content?: string;

    /**
     * Specifies the alignment of the annotation. They are
     * * Near - Align the annotation element as left side.
     * * Far - Align the annotation element as right side.
     * * Center - Align the annotation element as mid point.

     */

    horizontalAlignment?: Alignment;

    /**
     * Specifies the coordinate units of the annotation. They are
     * * Pixel - Annotation renders based on x and y pixel value.
     * * Point - Annotation renders based on x and y axis value.

     */

    coordinateUnits?: Units;

    /**
     * Specifies the regions of the annotation. They are
     * * Chart - Annotation renders based on chart coordinates.
     * * Series - Annotation renders based on series coordinates.

     */

    region?: Regions;

    /**
     * Specifies the position of the annotation. They are
     * * Top - Align the annotation element as top side.
     * * Bottom - Align the annotation element as bottom side.
     * * Middle - Align the annotation element as mid point.

     */

    verticalAlignment?: Position;

    /**
     * The name of horizontal axis associated with the annotation.
     * It requires `axes` of chart.

     */

    xAxisName?: string;

    /**
     * The name of vertical axis associated with the annotation.
     * It requires `axes` of chart.

     */

    yAxisName?: string;

    /**
     * Information about annotation for assistive technology.

     */
    description?: string;

}

/**
 * Interface for a class LabelBorder
 */
export interface LabelBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.

     */
    color?: string;

    /**
     * The width of the border in pixels.

     */
    width?: number;

    /**
     * Border type for labels
     * * Rectangle
     * * Without Top Border
     * * Without Top and BottomBorder
     * * Without Border
     * * Brace
     * * CurlyBrace

     */
    type?: BorderType;

}

/**
 * Interface for a class MultiLevelCategories
 */
export interface MultiLevelCategoriesModel {

    /**
     * Start value of the multi level labels


     */
    start?: number | Date | string;

    /**
     * End value of the multi level labels


     */
    end?: number | Date | string;

    /**
     * multi level labels text.

     */
    text?: string;

    /**
     * Maximum width of the text for multi level labels.


     */
    maximumTextWidth?: number;

    /**
     * multi level labels custom data.

     */
    customAttributes?: object;

    /**
     * Border type for labels
     * * Rectangle
     * * Without Top Border
     * * Without Top and BottomBorder
     * * Without Border
     * * Brace
     * * CurlyBrace



     */
    type?: BorderType;

}

/**
 * Interface for a class StripLineSettings
 */
export interface StripLineSettingsModel {

    /**
     * If set true, strip line for axis renders.

     */
    visible?: boolean;

    /**
     *  If set true, strip line get render from axis origin.

     */
    startFromAxis?: boolean;

    /**
     * Start value of the strip line.


     */
    start?: number | Date;

    /**
     * End value of the strip line.


     */
    end?: number | Date;

    /**
     * Size of the strip line, when it starts from the origin.


     */
    size?: number;

    /**
     * Color of the strip line.

     */
    color?: string;

    /**
     * Dash Array of the strip line.


     */
    dashArray?: string;

    /**
     * Size type of the strip line

     */
    sizeType?: SizeType;

    /**
     * isRepeat value of the strip line.


     */
    isRepeat?: boolean;

    /**
     * repeatEvery value of the strip line.


     */
    repeatEvery?: number | Date;

    /**
     * repeatUntil value of the strip line.


     */
    repeatUntil?: number | Date;

    /**
     * isSegmented value of the strip line


     */
    isSegmented?: boolean;

    /**
     * segmentStart value of the strip line.


     */
    segmentStart?: number | Date;

    /**
     * segmentEnd value of the strip line.


     */
    segmentEnd?: number | Date;

    /**
     * segmentAxisName of the strip line.


     */
    segmentAxisName?: string;

    /**
     * Border of the strip line.
     */
    border?: BorderModel;

    /**
     * Strip line text.

     */
    text?: string;

    /**
     * The angle to which the strip line text gets rotated.


     */
    rotation?: number;

    /**
     * Defines the position of the strip line text horizontally. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.

     */
    horizontalAlignment?: Anchor;

    /**
     * Defines the position of the strip line text vertically. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.

     */
    verticalAlignment?: Anchor;

    /**
     * Options to customize the strip line text.
     */
    textStyle?: FontModel;

    /**
     * Specifies the order of the strip line. They are,
     * * Behind: Places the strip line behind the series elements.
     * * Over: Places the strip line over the series elements.

     */
    zIndex?: ZIndex;

    /**
     * Strip line Opacity

     */
    opacity?: number;

}

/**
 * Interface for a class MultiLevelLabels
 */
export interface MultiLevelLabelsModel {

    /**
     * Defines the position of the multi level labels. They are,
     * * Near: Places the multi level labels at Near.
     * * Center: Places the multi level labels at Center.
     * * Far: Places the multi level labels at Far.

     */
    alignment?: Alignment;

    /**
     * Defines the textOverFlow for multi level labels. They are,
     * * Trim: Trim textOverflow for multi level labels.
     * * Wrap: Wrap textOverflow for multi level labels.
     * * none: None textOverflow for multi level labels.

     */
    overflow?: TextOverflow;

    /**
     * Options to customize the multi level labels.
     */
    textStyle?: FontModel;

    /**
     * Border of the multi level labels.
     */
    border?: LabelBorderModel;

    /**
     * multi level categories for multi level labels.
     */
    categories?: MultiLevelCategoriesModel[];

}

/**
 * Interface for a class ScrollbarSettingsRange
 */
export interface ScrollbarSettingsRangeModel {

    /**
     * Specifies the minimum range of an scrollbar.

     */

    minimum?: Date | string | number;

    /**
      * Specifies the maximum range of an scrollbar.

      */

    maximum?: Date | string | number;

}

/**
 * Interface for a class ScrollbarSettings
 */
export interface ScrollbarSettingsModel {

    /**
       * Enables the scrollbar for lazy loading.

       */
    enable?: boolean;

    /**
       * Defines the length of the points for numeric and logarithmic values.

       */
    pointsLength?: number;

    /**
      * Specifies the range for date time values alone.
      */
    range?: ScrollbarSettingsRangeModel;

}