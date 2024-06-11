import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, isNullOrUndefined, setValue, getValue } from '@syncfusion/ej2-base';import { detach, getUniqueID, Event, EventHandler, EmitType, Internationalization, L10n, addClass, removeClass, closest, formatUnit } from '@syncfusion/ej2-base';import { FloatLabelType, Input, InputObject, TEXTBOX_FOCUS } from '../input/input';import { FocusInEventArgs, FocusOutEventArgs, InputEventArgs, ChangedEventArgs } from '../textbox/textbox';
import {Resize} from "./textarea";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TextArea
 */
export interface TextAreaModel extends ComponentModel{

    /**
     * Specifies the boolean value whether the TextArea allows user to change the text.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Sets the content of the TextArea.
     *
     * @default null
     */
    value?: string;

    /**
     * Specifies the floating label behavior of the TextArea that the placeholder text floats above the TextArea based on the below values.
     * Possible values are:
     * * `Never` - The placeholder text should not be float ever.
     * * `Always` - The placeholder text floats above the TextArea always.
     * * `Auto` - The placeholder text floats above the TextArea while focusing or enter a value in TextArea.
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
     * Specifies the text that is shown as a hint/placeholder until the user focus or enter a value in TextArea.
     * The property is depending on the floatLabelType property.
     *
     * @default null
     */
    placeholder?: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Specifies a Boolean value that indicates whether the TextArea allow user to interact with it.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies a Boolean value that indicates whether the clear button is displayed in TextArea.
     *
     * @default false
     */
    showClearButton?: boolean;

    /**
     * Enable or disable persisting TextArea state between page reloads. If enabled, the `value` state will be persisted.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Specifies the width of the TextArea component.
     *
     * @default null
     */
    width?: number | string;

    /**
     * Specifies the resize mode of textarea.
     * possible values are:
     * * `Vertical` - The textarea element can be resized vertically.
     * * `Horizontal` - The textarea element can be resized horizontally.
     * * `Both` - The textarea element can be resized both vertically and horizontally.
     * * `None` - The textarea element cannot be resized.
     *
     * @default None
     */
    resizeMode?: Resize;

    /**
     * Specifies the maximum number of characters allowed in TextArea.
     *
     * @aspType int?
     */
    maxLength?: number;

    /**
     * specifies the visible width of the textarea, measured in average character widths.
     *
     * @aspType int?
     */
    cols?: number;

    /**
     * specifies the visible height of the textarea, measured in lines
     *
     * @aspType int?
     */
    rows?: number;

    /**
     * Triggers when the TextArea component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the TextArea component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the content of TextArea has changed and gets focus-out.
     *
     * @event change
     */
    change?: EmitType<ChangedEventArgs>;

    /**
     * Triggers when the TextArea has focus-out.
     *
     * @event blur
     */
    blur?: EmitType<FocusOutEventArgs>;

    /**
     * Triggers when the TextArea gets focus.
     *
     * @event focus
     */
    focus?: EmitType<FocusInEventArgs>;

    /**
     * Triggers each time when the value of TextArea has changed.
     *
     * @event input
     */
    input?: EmitType<InputEventArgs>;

}