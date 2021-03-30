import { Component, Property, Event, EmitType, EventHandler, L10n, setValue, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, detach, Internationalization, getUniqueID, closest } from '@syncfusion/ej2-base';import { addClass, removeClass, isBlazor } from '@syncfusion/ej2-base';import { FloatLabelType, Input, InputObject } from '../input/input';
import {ChangedEventArgs,FocusOutEventArgs,FocusInEventArgs,InputEventArgs} from "./textbox";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TextBox
 */
export interface TextBoxModel extends ComponentModel{

    /**
     * Specifies the behavior of the TextBox such as text, password, email, etc.
     *
     * @default 'text'
     */
    type?: string;

    /**
     * Specifies the boolean value whether the TextBox allows user to change the text.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Sets the content of the TextBox.
     *
     * @default null
     */
    value?: string;

    /**
     * Specifies the floating label behavior of the TextBox that the placeholder text floats above the TextBox based on the below values.
     * Possible values are:
     * * `Never` - The placeholder text should not be float ever.
     * * `Always` - The placeholder text floats above the TextBox always.
     * * `Auto` - The placeholder text floats above the TextBox while focusing or enter a value in Textbox.
     *
     * @default Never
     */
    floatLabelType?: FloatLabelType;

    /**
     * Specifies the CSS class value that is appended to wrapper of Textbox.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the text that is shown as a hint/placeholder until the user focus or enter a value in Textbox.
     * The property is depending on the floatLabelType property.
     *
     * @default null
     */
    placeholder?: string;

    /**
     * Specifies whether the browser is allow to automatically enter or select a value for the textbox.
     * By default, autocomplete is enabled for textbox.
     * Possible values are:
     * `on` - Specifies that autocomplete is enabled.
     * `off` - Specifies that autocomplete is disabled.
     *
     * @default 'on'
     */
    autocomplete?: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='textbox/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Specifies a boolean value that enable or disable the multiline on the TextBox.
     * The TextBox changes from single line to multiline when enable this multiline mode.
     *
     * @default false
     */
    multiline?: boolean;

    /**
     * Specifies a Boolean value that indicates whether the TextBox allow user to interact with it.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies a Boolean value that indicates whether the clear button is displayed in Textbox.
     *
     * @default false
     */
    showClearButton?: boolean;

    /**
     * Enable or disable persisting TextBox state between page reloads. If enabled, the `value` state will be persisted.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Specifies the width of the Textbox component.
     *
     * @default null
     */
    width?: number | string;

    /**
     * Triggers when the TextBox component is created.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the TextBox component is destroyed.
     *
     * @event destroyed
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the content of TextBox has changed and gets focus-out.
     *
     * @event change
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ChangedEventArgs>;

    /**
     * Triggers when the TextBox has focus-out.
     *
     * @event blur
     */
    blur?: EmitType<FocusOutEventArgs>;

    /**
     * Triggers when the TextBox gets focus.
     *
     * @event focus
     */
    focus?: EmitType<FocusInEventArgs>;

    /**
     * Triggers each time when the value of TextBox has changed.
     *
     * @event input
     */
    input?: EmitType<InputEventArgs>;

}