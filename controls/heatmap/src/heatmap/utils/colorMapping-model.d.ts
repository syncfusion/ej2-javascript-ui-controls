import { Property, extend, ChildProperty, Collection, isNullOrUndefined, Complex } from '@syncfusion/ej2-base';import { HeatMap } from '../heatmap';import { PaletteType, ColorGradientMode} from '../utils/enum';import { ColorCollection, LegendColorCollection, PaletteCollection, FillColor } from '../model/base';import { PaletteCollectionModel, FillColorModel } from '../model/base-model';import { PaletterColor, LegendRange } from './helper';

/**
 * Interface for a class PaletteSettings
 */
export interface PaletteSettingsModel {

    /**
     * Specifies the color collection for heat map cell.
     * @default ''
     */
    palette?: PaletteCollectionModel[];

    /**
     * Specifies the color style
     * * Gradient - Render a HeatMap cells with linear gradient color.
     * * Fixed - Render a HeatMap cells with fixed color.
     * @default 'Gradient'
     */
    type?: PaletteType;

    /**
     * Specifies the color for empty points in Heatmap.
     * @default ''
     */
    emptyPointColor?: string;

    /**
     * Specifies the colorGradientMode in Heatmap.
     * @default 'Table'
     */
    colorGradientMode?: ColorGradientMode;

    /**
     * Options to set fill colors.
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