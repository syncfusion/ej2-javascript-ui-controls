import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { ColorModeType } from '../types';

/**
 * Configures the font color settings of the Block Editor component.
 * Use this class to customize text color options including default color, display mode (palette or picker), grid layout, and custom color palettes.
 */
export class FontColorSettings extends ChildProperty<FontColorSettings > {
    /**
     * Specifies the default font color to apply when users click the font color button without making a selection.
     * Accepts hex color codes (e.g., '#ff0000' for red). This color is used as the initial selected color in the palette.
     * @type {string}
     * @default '#ff0000'
     */
    @Property('#ff0000')
    public default: string;

    /**
     * Specifies the color display mode for the font color picker interface.
     * Set to 'Palette' to display a predefined grid of colors, or 'Picker' to display a custom color picker widget for RGB/HEX selection.
     * @type {ColorModeType}
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorModeType;

    /**
     * Specifies the number of columns in the color palette grid layout.
     * This property controls how many color swatches appear per row when using palette mode. Higher values create wider grids with more columns.
     * @type {number}
     * @default 10
     */
    @Property(10)
    public columns: number;

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
    @Property(null)
    public colorCode: { [key: string]: string[] };

    /**
     * Specifies whether users can toggle between Palette and Picker modes in the font color interface.
     * Set to true to display a mode switcher button that allows users to switch between predefined color palettes and custom color picker.
     * Set to false to lock the interface to a single mode defined by the mode property.
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public modeSwitcher: boolean;
}
