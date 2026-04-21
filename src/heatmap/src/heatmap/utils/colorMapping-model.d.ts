import { Property, extend, ChildProperty, Collection, isNullOrUndefined, Complex } from '@syncfusion/ej2-base';import { HeatMap } from '../heatmap';import { PaletteType, ColorGradientMode} from '../utils/enum';import { ColorCollection, LegendColorCollection, PaletteCollection, FillColor } from '../model/base';import { PaletteCollectionModel, FillColorModel } from '../model/base-model';import { PaletterColor, LegendRange } from './helper';

/**
 * Interface for a class PaletteSettings
 */
export interface PaletteSettingsModel {

    /**
     * Sets and gets the color palette collection for heatmap cell.
     */
    palette?: PaletteCollectionModel[];

    /**
     * Specifies the style in which the color is to be applied to the cells.
     * * Gradient - Renders the heatmap cells with linear gradient colors.
     * * Fixed - Renders the heatmap cells with fixed colors.
     *
     * @default 'Gradient'
     */
    type?: PaletteType;

    /**
     * Specifies the color for the empty points in heatmap.
     *
     * @default ''
     */
    emptyPointColor?: string;

    /**
     * Specifies the color gradient mode in heatmap. This property is used to set the minimum and maximum values for colors based on row and column.
     *
     * @default 'Table'
     */
    colorGradientMode?: ColorGradientMode;

    /**
     * Specifies the options to set fill colors.
     */

    fillColor?: FillColorModel;

}

/**
 * Interface for a class RgbColor
 */
export interface RgbColorModel {

}

/**
 * Interface for a class CellColor
 */
export interface CellColorModel {

}