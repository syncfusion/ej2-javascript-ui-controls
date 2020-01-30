import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';import { EmitType, Event, EventHandler, KeyboardEvents, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { addClass, detach, getUniqueID, isRippleEnabled, removeClass, rippleEffect, closest } from '@syncfusion/ej2-base';import { wrapperInitialize, rippleMouseHandler, ChangeEventArgs, setHiddenInput } from './../common/common';
import {LabelPosition} from "./check-box";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class CheckBox
 */
export interface CheckBoxModel extends ComponentModel{

    /**
     * Triggers when the CheckBox state has been changed by user interaction.
     * @event
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * Specifies a value that indicates whether the CheckBox is `checked` or not.
     * When set to `true`, the CheckBox will be in `checked` state.
     * @default false
     */
    checked?: boolean;

    /**
     * Defines class/multiple classes separated by a space in the CheckBox element.
     * You can add custom styles to the CheckBox by using this property.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the CheckBox is `disabled` or not.
     * When set to `true`, the CheckBox will be in `disabled` state.
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies a value that indicates whether the CheckBox is in `indeterminate` state or not.
     * When set to `true`, the CheckBox will be in `indeterminate` state.
     * @default false
     */
    indeterminate?: boolean;

    /**
     * Defines the caption for the CheckBox, that describes the purpose of the CheckBox.
     * @default ''
     */
    label?: string;

    /**
     * Positions label `before`/`after` the CheckBox.
     * The possible values are:
     * * Before - The label is positioned to left of the CheckBox.
     * * After - The label is positioned to right of the CheckBox.
     * @default 'After'
     */
    labelPosition?: LabelPosition;

    /**
     * Defines `name` attribute for the CheckBox.
     * It is used to reference form data (CheckBox value) after a form is submitted.
     * @default ''
     */
    name?: string;

    /**
     * Defines `value` attribute for the CheckBox.
     * It is a form data passed to the server when submitting the form.
     * @default ''
     */
    value?: string;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

}