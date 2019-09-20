import { BaseEventArgs, Component, EmitType, Event, INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';import { Browser, closest, detach, EventHandler, getInstance, select, selectAll, formatUnit } from '@syncfusion/ej2-base';import { addClass, attributes, classList, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';import { remove, removeClass, rippleEffect } from '@syncfusion/ej2-base';import { SplitButton, BeforeOpenCloseMenuEventArgs, getModel, ClickEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';import { Deferred } from '@syncfusion/ej2-splitbuttons';import { Tooltip, TooltipEventArgs, getZindexPartial, Popup } from '@syncfusion/ej2-popups';import { Input } from './../input/index';import { NumericTextBox, NumericTextBoxModel, ChangeEventArgs } from './../numerictextbox/index';import { Slider, SliderChangeEventArgs } from './../slider/slider';
import {ColorPickerMode,ColorPickerEventArgs,PaletteTileEventArgs,BeforeOpenCloseEventArgs,OpenEventArgs,ModeSwitchEventArgs} from "./color-picker";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ColorPicker
 */
export interface ColorPickerModel extends ComponentModel{

    /**
     * It is used to set the color value for ColorPicker. It should be specified as Hex code.
     * @default '#008000ff'
     */
    value?: string;

    /**
     * This property sets the CSS classes to root element of the ColorPicker
     *  which helps to customize the UI styles.
     * @default ''
     */
    cssClass?: string;

    /**
     * It is used to enable / disable ColorPicker component. If it is disabled the ColorPicker popup won’t open.
     * @default false
     */
    disabled?: boolean;

    /**
     * It is used to render the ColorPicker with the specified mode.
     * @default 'Picker'
     */
    mode?: ColorPickerMode;

    /**
     * It is used to show / hide the mode switcher button of ColorPicker component.
     * @default true
     */
    modeSwitcher?: boolean;

    /**
     * It is used to load custom colors to palette.
     * @default null
     */
    presetColors?: { [key: string]: string[] };

    /**
     * It is used to show / hide the control buttons (apply / cancel) of  ColorPicker component.
     * @default true
     */
    showButtons?: boolean;

    /**
     * It is used to render the ColorPicker palette with specified columns.
     * @default 10
     */
    columns?: number;

    /**
     * It is used to render the ColorPicker component as inline.
     * @default false
     */
    inline?: boolean;

    /**
     * It is used to enable / disable the no color option of ColorPicker component.
     * @default false
     */
    noColor?: boolean;

    /**
     * To enable or disable persisting component's state between page reloads and it is extended from component class.
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * It is used to enable / disable the opacity option of ColorPicker component.
     * @default true
     */
    enableOpacity?: boolean;

    /**
     * Triggers while selecting the color in picker / palette, when showButtons property is enabled.
     * @event
     * @blazorProperty 'Selected'
     */
    select?: EmitType<ColorPickerEventArgs>;

    /**
     * Triggers while changing the colors. It will be triggered based on the showButtons property.
     * If the property is false, the event will be triggered while selecting the colors.
     * If the property is true, the event will be triggered while apply the selected color.
     * @event
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ColorPickerEventArgs>;

    /**
     * Trigger while rendering each palette tile.
     * @event 
     * @blazorProperty 'OnTileRender'
     */
    beforeTileRender?: EmitType<PaletteTileEventArgs>;

    /**
     * Triggers before opening the ColorPicker popup.
     * @event
     * @blazorProperty 'OnOpen'
     */
    beforeOpen?: EmitType<BeforeOpenCloseEventArgs>;

    /**
     * Triggers while opening the ColorPicker popup.
     * @event
     * @blazorProperty 'Opened'
     */
    open?: EmitType<OpenEventArgs>;

    /**
     * Triggers before closing the ColorPicker popup.
     * @event
     * @blazorProperty 'OnClose'
     */
    beforeClose?: EmitType<BeforeOpenCloseEventArgs>;

    /**
     * Triggers before Switching between ColorPicker mode.
     * @event
     * @blazorProperty 'OnModeSwitch'
     */
    beforeModeSwitch?: EmitType<ModeSwitchEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

}