import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { Alignment, TextOverflow, BorderType } from '../utils/enum';import { Theme } from './theme';

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Font size for the text.

     */
    size?: string;

    /**
     * Color for the text.

     */
    color?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * FontWeight for the text.

     */
    fontWeight?: string;

    /**
     * FontStyle for the text.

     */
    fontStyle?: string;

    /**
     * text alignment

     */
    textAlignment?: Alignment;

    /**
     * Specifies the heat map text overflow

     */
    textOverflow?: TextOverflow;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Left margin in pixels.

     */
    left?: number;

    /**
     * Right margin in pixels.

     */
    right?: number;

    /**
     * Top margin in pixels.

     */
    top?: number;

    /**
     * Bottom margin in pixels.

     */
    bottom?: number;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.

     */
    color?: string;

    /**
     * The width of the border in pixels.

     */
    width?: number;

    /**
     * The radius of the border in pixels.

     */
    radius?: number;

}

/**
 * Interface for a class TooltipBorder
 */
export interface TooltipBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.

     */
    color?: string;

    /**
     * The width of the border in pixels.

     */
    width?: number;

}

/**
 * Interface for a class BubbleData
 */
export interface BubbleDataModel {

    /**
     * Mapping property to set size.

     */
    size?: string;

    /**
     * Mapping property to set color.

     */
    color?: string;

}

/**
 * Interface for a class Title
 */
export interface TitleModel {

    /**
     * Title text

     */
    text?: string;

    /**
     * Options for customizing the title.
     */
    textStyle?: FontModel;

}

/**
 * Interface for a class PaletteCollection
 */
export interface PaletteCollectionModel {

    /**
     * Palette color value

     */
    value?: number;

    /**
     * Palette color text

     */
    color?: string;

    /**
     * Palette color label

     */
    label?: string;

}

/**
 * Interface for a class AxisLabelBorder
 */
export interface AxisLabelBorderModel {

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
     * * Without Top/Bottom Border
     * * Without Border
     * * Without Bottom Border
     * * Brace

     */
    type?: BorderType;

}

/**
 * Interface for a class BubbleSize
 */
export interface BubbleSizeModel {

    /**
     * Specifies the minimum radius value of the cell in percentage.

     */
    minimum?: string;

    /**
     * Specifies the maximum radius value of the cell in percentage.

     */

    maximum?: string;

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
    border?: AxisLabelBorderModel;

    /**
     * multi level categories for multi level labels.
     */
    categories?: MultiLevelCategoriesModel[];

}

/**
 * Interface for a class ColorCollection
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
 */
export interface LegendColorCollectionModel {

}