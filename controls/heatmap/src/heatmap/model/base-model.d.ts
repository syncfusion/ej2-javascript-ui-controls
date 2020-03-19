import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { Alignment, TextOverflow, BorderType } from '../utils/enum';import { Theme } from './theme';

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Font size for the text.
     * @default '16px'
     */
    size?: string;

    /**
     * Color for the text.
     * @default ''
     */
    color?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * FontWeight for the text.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * FontStyle for the text.
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * text alignment
     * @default 'Center'
     */
    textAlignment?: Alignment;

    /**
     * Specifies the heat map text overflow
     * @default 'Trim'
     */
    textOverflow?: TextOverflow;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Left margin in pixels.
     * @default 10
     */
    left?: number;

    /**
     * Right margin in pixels.
     * @default 10
     */
    right?: number;

    /**
     * Top margin in pixels.
     * @default 10
     */
    top?: number;

    /**
     * Bottom margin in pixels.
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    color?: string;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    width?: number;

    /**
     * The radius of the border in pixels.
     * @default ''
     */
    radius?: number;

}

/**
 * Interface for a class TooltipBorder
 */
export interface TooltipBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    color?: string;

    /**
     * The width of the border in pixels.
     * @default 0
     */
    width?: number;

}

/**
 * Interface for a class BubbleData
 */
export interface BubbleDataModel {

    /**
     * Mapping property to set size.
     * @default null
     */
    size?: string;

    /**
     * Mapping property to set color.
     * @default null
     */
    color?: string;

}

/**
 * Interface for a class Title
 */
export interface TitleModel {

    /**
     * Title text
     * @default ''
     */
    text?: string;

    /**
     * Options for customizing the title.
     */
    textStyle?: FontModel;

}

/**
 * Interface for a class FillColor
 */
export interface FillColorModel {

    /**
     * minimum fill color for cell color range
     * @default '#eeeeee'
     */
    minColor?: string;

    /**
     * maximum fill color for cell color range
     * @default '#eeeeee'
     */
    maxColor?: string;

}

/**
 * Interface for a class PaletteCollection
 */
export interface PaletteCollectionModel {

    /**
     * Palette color value
     * @default null
     */
    value?: number;

    /**
     * Palette color text
     * @default ''
     */
    color?: string;

    /**
     * Palette color label
     * @default ''
     */
    label?: string;

    /**
     * Palette start value
     * @default null
     */
    startValue?: number;

    /**
     * Palette end value
     * @default null
     */
    endValue?: number;

    /**
     * Palette minColor value
     * @default null
     */
    minColor?: string;

    /**
     * Palette maxColor value
     * @default null
     */
    maxColor?: string;

}

/**
 * Interface for a class AxisLabelBorder
 */
export interface AxisLabelBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    color?: string;

    /**
     * The width of the border in pixels.
     * @default 1
     * @blazordefaultvalue 0
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
     * @default '0%'
     */
    minimum?: string;

    /**
     * Specifies the maximum radius value of the cell in percentage.
     * @default '100%'
     */

    maximum?: string;

}

/**
 * Interface for a class MultiLevelCategories
 */
export interface MultiLevelCategoriesModel {

    /**
     * Start value of the multi level labels
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     */
    start?: number | Date | string;

    /**
     * End value of the multi level labels
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     */
    end?: number | Date | string;

    /**
     * multi level labels text.
     * @default ''
     */
    text?: string;

    /**
     * Maximum width of the text for multi level labels.
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
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
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Defines the textOverFlow for multi level labels. They are, 
     * * Trim: Trim textOverflow for multi level labels.
     * * Wrap: Wrap textOverflow for multi level labels.
     * * none: None textOverflow for multi level labels.
     * @default 'Wrap'
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

/**
 * Interface for a class MultipleRow
 */
export interface MultipleRowModel {

}