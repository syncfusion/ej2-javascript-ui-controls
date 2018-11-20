import { Component, Property, Event, EmitType, EventHandler, L10n, setValue, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, detach, Internationalization, getUniqueID } from '@syncfusion/ej2-base';import { FloatLabelType, Input, InputObject } from '../input/input';
import {ChangedEventArgs,FocusOutEventArgs,FocusInEventArgs,InputEventArgs} from "./textbox";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TextBox
 */
export interface TextBoxModel extends ComponentModel{

    /**
     * Specifies the behavior of the TextBox such as text, password, email, etc.
     * @default 'text'
     */
    type?: string;

    /**
     * Specifies the boolean value whether the TextBox allows user to change the text.
     * @default false
     */
    readonly?: boolean;

    /**
     * Sets the content of the TextBox.
     * @default null
     */
    value?: string;

    /**
     * Specifies the floating label behavior of the TextBox that the placeholder text floats above the TextBox based on the below values.
     * Possible values are:
     * * `Never` - The placeholder text should not be float ever.
     * * `Always` - The placeholder text floats above the TextBox always.
     * * `Auto` - The placeholder text floats above the TextBox while focusing or enter a value in Textbox.
     * @default Never
     */
    floatLabelType?: FloatLabelType;

    /**
     * Specifies the CSS class value that is appended to wrapper of Textbox.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the text that is shown as a hint/placeholder until the user focus or enter a value in Textbox.
     * The property is depending on the floatLabelType property.
     * @default null
     */
    placeholder?: string;

    /**
     * Specifies a Boolean value that enable or disable the RTL mode on the Textbox. The content of Textbox
     * display from right to left direction when enable this RTL mode.
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Specifies a Boolean value that indicates whether the TextBox allow user to interact with it.
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies a Boolean value that indicates whether the clear button is displayed in Textbox.
     * @default false
     */
    showClearButton?: boolean;

    /**
     * Enable or disable persisting TextBox state between page reloads. If enabled, the `value` state will be persisted.
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Triggers when the TextBox component is created.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the TextBox component is destroyed.
     * @event
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the content of TextBox has changed and gets focus-out.
     * @event
     */
    change?: EmitType<ChangedEventArgs>;

    /**
     * Triggers when the TextBox has focus-out.
     * @event
     */
    blur?: EmitType<FocusOutEventArgs>;

    /**
     * Triggers when the TextBox gets focus.
     * @event
     */
    focus?: EmitType<FocusInEventArgs>;

    /**
     * Triggers each time when the value of TextBox has changed.
     * @event
     */
    input?: EmitType<InputEventArgs>;

}