import { ChildProperty, Event, EmitType, Property } from '@syncfusion/ej2-base';
import { ColorPickerMode, ChangeEventArgs, OpenEventArgs, PaletteTileEventArgs, BeforeOpenCloseEventArgs, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';

/**
 * Defines the ribbon color picker.
 */
export class RibbonColorPickerSettings extends ChildProperty<RibbonColorPickerSettings>  {

    /**
     * Defines the number of columns to be rendered in the color picker palette.
     *
     * @default 10
     */
    @Property(10)
    public columns: number;

    /**
     * Defines one or more CSS classes to customize the appearance of the color picker.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the label text for the overflow item.
     *
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Defines whether to enable the opacity option in the color picker.
     *
     * @default true
     */
    @Property(true)
    public enableOpacity: boolean;

    /**
     * Defines the rendering mode of the color picker.
     *
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorPickerMode;

    /**
     * Defines whether to show / hide the mode switcher button in the color picker.
     *
     * @default true
     */
    @Property(true)
    public modeSwitcher: boolean;

    /**
     * Defines whether to enable / disable the palette section in the color picker.
     *
     * @default false
     */
    @Property(false)
    public noColor: boolean;

    /**
     * Defines the custom colors to load in the color picker palette.
     *
     * @default null
     */
    @Property(null)
    public presetColors: { [key: string]: string[] };

    /**
     * Defines whether to show / hide the control buttons (apply / cancel) in the color picker.
     *
     * @default true
     */
    @Property(true)
    public showButtons: boolean;

    /**
     * Specifies the value of the color picker.
     * The value should be a valid hex color code.
     *
     * @default '#008000ff'
     */
    @Property('#008000ff')
    public value: string;

    /**
     * Specifies additional HTML attributes to be applied to the color picker.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Event triggers before closing the ColorPicker popup.
     *
     * @event beforeClose
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseEventArgs>;

    /**
     * Event triggers before opening the ColorPicker popup.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseEventArgs>;

    /**
     * Event triggers while rendering each palette tile.
     *
     * @event beforeTileRender
     */
    @Event()
    public beforeTileRender: EmitType<PaletteTileEventArgs>;

    /**
     * Event triggers once the color picker is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event triggers while changing the colors. It will be triggered based on the showButtons property.
     * If the property is false, the event will be triggered while selecting the colors.
     * If the property is true, the event will be triggered while apply the selected color.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Event triggers while opening the ColorPicker popup.
     *
     * @event open
     */
    @Event()
    public open: EmitType<OpenEventArgs>;

    /**
     * Event triggers while selecting the color in picker / palette, when showButtons property is enabled.
     *
     * @event select
     */
    @Event()
    public select: EmitType<ColorPickerEventArgs>;

    /**
     * @param {Object} prop - Gets the property of colorpicker.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}
