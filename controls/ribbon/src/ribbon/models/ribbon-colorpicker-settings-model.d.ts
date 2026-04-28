import { ChildProperty, Event, EmitType, Property } from '@syncfusion/ej2-base';import { ColorPickerMode, ChangeEventArgs, OpenEventArgs, PaletteTileEventArgs, BeforeOpenCloseEventArgs, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';

/**
 * Interface for a class RibbonColorPickerSettings
 */
export interface RibbonColorPickerSettingsModel {

    /**
     * Defines the number of columns to be rendered in the color picker palette.
     *
     * @default 10
     */
    columns?: number;

    /**
     * Defines one or more CSS classes to customize the appearance of the color picker.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the label text for the overflow item.
     *
     * @default ''
     */
    label?: string;

    /**
     * Defines whether to enable the opacity option in the color picker.
     *
     * @default true
     */
    enableOpacity?: boolean;

    /**
     * Defines the rendering mode of the color picker.
     *
     * @default 'Palette'
     */
    mode?: ColorPickerMode;

    /**
     * Defines whether to show / hide the mode switcher button in the color picker.
     *
     * @default true
     */
    modeSwitcher?: boolean;

    /**
     * Defines whether to enable / disable the palette section in the color picker.
     *
     * @default false
     */
    noColor?: boolean;

    /**
     * Defines the custom colors to load in the color picker palette.
     *
     * @default null
     */
    presetColors?: { [key: string]: string[] };

    /**
     * Defines whether to show / hide the control buttons (apply / cancel) in the color picker.
     *
     * @default true
     */
    showButtons?: boolean;

    /**
     * Specifies the value of the color picker.
     * The value should be a valid hex color code.
     *
     * @default '#008000ff'
     */
    value?: string;

    /**
     * Specifies additional HTML attributes to be applied to the color picker.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Event triggers before closing the ColorPicker popup.
     *
     * @event beforeClose
     */
    beforeClose?: EmitType<BeforeOpenCloseEventArgs>;

    /**
     * Event triggers before opening the ColorPicker popup.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<BeforeOpenCloseEventArgs>;

    /**
     * Event triggers while rendering each palette tile.
     *
     * @event beforeTileRender
     */
    beforeTileRender?: EmitType<PaletteTileEventArgs>;

    /**
     * Event triggers once the color picker is created.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Event triggers while changing the colors. It will be triggered based on the showButtons property.
     * If the property is false, the event will be triggered while selecting the colors.
     * If the property is true, the event will be triggered while apply the selected color.
     *
     * @event change
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Event triggers while opening the ColorPicker popup.
     *
     * @event open
     */
    open?: EmitType<OpenEventArgs>;

    /**
     * Event triggers while selecting the color in picker / palette, when showButtons property is enabled.
     *
     * @event select
     */
    select?: EmitType<ColorPickerEventArgs>;

}