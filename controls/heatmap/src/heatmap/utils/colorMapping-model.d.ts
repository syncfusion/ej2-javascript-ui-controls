import { Property, extend, ChildProperty, Collection, isNullOrUndefined } from '@syncfusion/ej2-base';import { HeatMap } from '../heatmap';import { PaletteType, ColorGradientMode} from '../utils/enum';import { ColorCollection, LegendColorCollection, PaletteCollection } from '../model/base';import { PaletteCollectionModel } from '../model/base-model';import { PaletterColor, LegendRange } from './helper';

/**
 * Interface for a class PaletteSettings
 */
export interface PaletteSettingsModel {

    /**
     * Specifies the color collection for heat map cell.

     */
    palette?: PaletteCollectionModel[];

    /**
     * Specifies the color style
     * * Gradient - Render a HeatMap cells with linear gradient color.
     * * Fixed - Render a HeatMap cells with fixed color.

     */
    type?: PaletteType;

    /**
     * Specifies the color for empty points in Heatmap.

     */
    emptyPointColor?: string;

    /**
     * Specifies the colorGradientMode in Heatmap.

     */
    colorGradientMode?: ColorGradientMode;

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