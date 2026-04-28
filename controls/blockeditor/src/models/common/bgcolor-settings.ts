import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { ColorModeType } from '../types';

/**
 * Configures the background color settings of the Block Editor component.
 * Use this class to customize background color options including default color, display mode (palette or picker), grid layout, and custom color palettes for text highlighting and emphasis.
 */
export class BackgroundColorSettings extends ChildProperty<BackgroundColorSettings> {
    /**
     * Specifies the default background color to apply when users click the background color button without making a selection.
     * Accepts hex color codes (e.g., '#ffff00' for yellow). This color is used as the initial selected color in the palette for background highlighting.
     * @type {string}
     * @default '#ffff00'
     */
    @Property('#ffff00')
    public default: string;

    /**
     * Specifies the background color display mode for the color picker interface.
     * Set to 'Palette' to display a predefined grid of colors, or 'Picker' to display a custom color picker widget for RGB/HEX selection and custom background color creation.
     * @type {ColorModeType}
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorModeType;

    /**
     * Specifies the number of columns in the background color palette grid layout.
     * This property controls how many color swatches appear per row when using palette mode. Higher values create wider grids with more columns for easier color selection.
     * @type {number}
     * @default 10
     */
    @Property(10)
    public columns: number;

    /**
     * Specifies custom background color codes organized in named groups as key-value pairs.
     * Keys represent color group names (e.g., 'Standard', 'Light', 'Dark'), and values are arrays of hex color codes to display in each group for background highlighting purposes.
     * This allows developers to create branded color palettes with organized background color categories for users to apply emphasis and visual hierarchy to content.
     * @type {{ [key: string]: string[] }}
     * @default null
     * @example
     * colorCode: {
     *   'Standard': ['#000000', '#ffffff', '#ffff00'],
     *   'Light': ['#ffcccc', '#ccffcc', '#ffffcc'],
     *   'Dark': ['#333333', '#666666', '#999999']
     * }
     */
    @Property(null)
    public colorCode: { [key: string]: string[] };

    /**
     * Specifies whether users can toggle between Palette and Picker modes in the background color interface.
     * Set to true to display a mode switcher button that allows users to switch between predefined background color palettes and custom color picker for maximum flexibility.
     * Set to false to lock the interface to a single mode defined by the mode property.
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public modeSwitcher: boolean;
}
