import { ChildProperty, Property } from '@syncfusion/ej2-base';import { SymbolDescription } from '../../symbol-palette/symbol-palette';import { DiagramElement } from '..';

/**
 * Interface for a class SymbolSize
 */
export interface SymbolSizeModel {

    /**
     * Sets the width of the symbols
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Sets the height of the symbols
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    height?: number;

}

/**
 * Interface for a class SymbolPaletteInfo
 */
export interface SymbolPaletteInfoModel {

    /**
     * Defines the width of the symbol description
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Defines the height of the symbol description
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Defines whether the symbol has to be fit inside the size, that is defined by the symbol palette
     *
     * @default true
     */
    fit?: boolean;

    /**
     * Define the text to be displayed and how that is to be handled.
     *
     * @default null
     */
    description?: SymbolDescription;

    /**
     * Define the template of the symbol that is to be drawn over the palette
     *
     * @default null
     */
    template?: DiagramElement;

    /**
     * Define the text to be displayed when mouse hover on the shape.
     *
     * @default ''
     */
    tooltip?: string;

}