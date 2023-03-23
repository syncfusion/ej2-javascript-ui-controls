import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { Alignment, TextOverflow, BorderType } from '../utils/enum';import { Theme } from './theme';

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Specifies the font size for the text.
     *
     * @default '16px'
     */
    size?: string;

    /**
     * Specifies the color for the text.
     *
     * @default ''
     */
    color?: string;

    /**
     * Specifies the font family for the text.
     */
    fontFamily?: string;

    /**
     * Specifies the font weight for the text.
     *
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Specifies the font style for the text.
     *
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Specifies the text alignment.
     *
     * @default 'Center'
     */
    textAlignment?: Alignment;

    /**
     * Specifies the overflow style for the text in heatmap.
     *
     * @default 'Trim'
     */
    textOverflow?: TextOverflow;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Specifies the left margin in pixels.
     *
     * @default 10
     */
    left?: number;

    /**
     * Specifies the right margin in pixels.
     *
     * @default 10
     */
    right?: number;

    /**
     * Specifies the top margin in pixels.
     *
     * @default 10
     */
    top?: number;

    /**
     * Specifies the bottom margin in pixels.
     *
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * Sets and gets the color of the border that accepts value in hex value and rgba as a valid CSS color string.
     *
     * @default ''
     */
    color?: string;

    /**
     * Specifies the width of the border in pixels.
     *
     * @default 1
     */
    width?: number;

    /**
     * Specifies the radius of the border in pixels.
     *
     * @default ''
     */
    radius?: number;

}

/**
 * Interface for a class TooltipBorder
 */
export interface TooltipBorderModel {

    /**
     * Specifies the color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    color?: string;

    /**
     * Sets and gets the width of the border in pixels.
     *
     * @default 0
     */
    width?: number;

}

/**
 * Interface for a class BubbleData
 */
export interface BubbleDataModel {

    /**
     * Specifies the mapping value to set size from the data source.
     *
     * @default null
     */
    size?: string;

    /**
     * Specifies the mapping value to set color from the data source.
     *
     * @default null
     */
    color?: string;

}

/**
 * Interface for a class Title
 */
export interface TitleModel {

    /**
     * Sets and gets the text for the title.
     *
     * @default ''
     */
    text?: string;

    /**
     * Sets and gets the options to customize the text of the title.
     */
    textStyle?: FontModel;

}

/**
 * Interface for a class FillColor
 */
export interface FillColorModel {

    /**
     * Specifies the minimum fill color for cell color range.
     *
     * @default '#eeeeee'
     */
    minColor?: string;

    /**
     * Specifies the maximum fill color for cell color range.
     *
     * @default '#eeeeee'
     */
    maxColor?: string;

}

/**
 * Interface for a class PaletteCollection
 */
export interface PaletteCollectionModel {

    /**
     * Sets and gets the value in the heatmap data to set the palette color.
     *
     * @default null
     */
    value?: number;

    /**
     * Sets and gets the color for a palette.
     *
     * @default ''
     */
    color?: string;

    /**
     * Sets and gets the label to be set in the corresponding legend for the palette color.
     *
     * @default ''
     */
    label?: string;

    /**
     * Sets and gets the start value in the heatmap data to set the palette color.
     *
     * @default null
     */
    startValue?: number;

    /**
     * Sets and gets the end value in the heatmap data to set the palette color.
     *
     * @default null
     */
    endValue?: number;

    /**
     * Sets and gets the minimum color for color range in a palette.
     *
     * @default null
     */
    minColor?: string;

    /**
     * Sets and gets the maximum color for color range in a palette.
     *
     * @default null
     */
    maxColor?: string;

}

/**
 * Interface for a class AxisLabelBorder
 */
export interface AxisLabelBorderModel {

    /**
     * Sets and gets the color of the border that accepts value in hex value and rgba as a valid CSS color string.
     *
     * @default ''
     */
    color?: string;

    /**
     * Specifies the width of the border in pixels.
     *
     * @default 1
     */
    width?: number;

    /**
     * Specifies the type of the border for the axis labels. The following are the available types.
     * * Rectangle
     * * Without Top Border
     * * Without Top/Bottom Border
     * * Without Border
     * * Without Bottom Border
     * * Brace
     *
     * @default 'Rectangle'
     */
    type?: BorderType;

}

/**
 * Interface for a class BubbleSize
 */
export interface BubbleSizeModel {

    /**
     * Specifies the minimum radius value of the cell in percentage.
     *
     * @default '0%'
     */
    minimum?: string;

    /**
     * Specifies the maximum radius value of the cell in percentage.
     *
     * @default '100%'
     */

    maximum?: string;

}

/**
 * Interface for a class MultiLevelCategories
 */
export interface MultiLevelCategoriesModel {

    /**
     * Specifies the start value of the multi-level label.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    start?: number | Date | string;

    /**
     * Specifies the end value of the multi-level label.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    end?: number | Date | string;

    /**
     * Specifies the text for multi-level label.
     *
     * @default ''
     */
    text?: string;

    /**
     * Specifies the maximum width of the text for multi-level label.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    maximumTextWidth?: number;

}

/**
 * Interface for a class MultiLevelLabels
 */
export interface MultiLevelLabelsModel {

    /**
     * Specifies the position of the multi-level labels. The available positions are,
     * * Near: Places the multi-level labels at left end of the available space.
     * * Center: Places the multi-level labels at center of the available space.
     * * Far: Places the multi-level labels at right end of the available space.
     *
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Sets and gets the overflow style of the multi-level labels. The available types are,
     * * None: No action is taken when the text overflows.
     * * Wrap: Wraps the multi-level labels when the text overflows.
     * * Trim: Trims the multi-level labels when the text overflows.
     *
     * @default 'Wrap'
     */
    overflow?: TextOverflow;

    /**
     * Sets and gets the options to customize the text of the multi-level labels.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the options to customize the border of the multi-level labels.
     */
    border?: AxisLabelBorderModel;

    /**
     * Sets and gets the options to configure the multi-level labels.
     */
    categories?: MultiLevelCategoriesModel[];

}

/**
 * Interface for a class ColorCollection
 * @private
 */
export interface ColorCollectionModel {

}

/**
 * Interface for a class BubbleTooltipData
 */
export interface BubbleTooltipDataModel {

}

/**
 * Interface for a class LegendColorCollection
 * @private
 */
export interface LegendColorCollectionModel {

}

/**
 * Interface for a class MultipleRow
 * @private
 */
export interface MultipleRowModel {

}