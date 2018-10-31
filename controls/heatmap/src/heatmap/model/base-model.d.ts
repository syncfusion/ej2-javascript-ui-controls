import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { Alignment, TextOverflow } from '../utils/enum';

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