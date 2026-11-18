import { ChildProperty, Property } from '@syncfusion/ej2-base';import { ColorModeType } from '../types';

/**
 * Interface for a class FontColorSettings
 */
export interface FontColorSettingsModel {

    /**
     * Specifies the default font color to apply when users click the font color button without making a selection.
     * Accepts hex color codes (e.g., '#ff0000' for red). This color is used as the initial selected color in the palette.
     * @type {string}
     * @default '#ff0000'
     */
    default?: string;

    /**
     * Specifies the color display mode for the font color picker interface.
     * Set to 'Palette' to display a predefined grid of colors, or 'Picker' to display a custom color picker widget for RGB/HEX selection.
     * @type {ColorModeType}
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies the number of columns in the color palette grid layout.
     * This property controls how many color swatches appear per row when using palette mode. Higher values create wider grids with more columns.
     * @type {number}
     * @default 10
     */
    columns?: number;

    /**
     * Specifies custom color codes organized in named groups as key-value pairs.
     * Keys represent color group names (e.g., 'Standard', 'Light', 'Dark'), and values are arrays of hex color codes to display in each group.
     * This allows developers to create branded color palettes with organized color categories for users to choose from.
     * @type {{ [key: string]: string[] }}
     * @default null
     * @example
     * colorCode: {
     *   'Light': ['#ffcccc', '#ccffcc', '#ccccff'],
     *   'Dark': ['#333333', '#666666', '#999999']
     * }
     */
    colorCode?: { [key: string]: string[] };

    /**
     * Specifies whether users can toggle between Palette and Picker modes in the font color interface.
     * Set to true to display a mode switcher button that allows users to switch between predefined color palettes and custom color picker.
     * Set to false to lock the interface to a single mode defined by the mode property.
     * @type {boolean}
     * @default false
     */
    modeSwitcher?: boolean;

}