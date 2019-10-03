import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';import { EmitType, Event, EventHandler, KeyboardEvents, isNullOrUndefined } from '@syncfusion/ej2-base';import { addClass, detach, getUniqueID, isRippleEnabled, removeClass, rippleEffect, closest } from '@syncfusion/ej2-base';import { wrapperInitialize, rippleMouseHandler, ChangeEventArgs, setHiddenInput } from './../common/common';
import {LabelPosition} from "./check-box";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class CheckBox
 */
export interface CheckBoxModel extends ComponentModel{

    /**
     * Triggers when the CheckBox state has been changed by user interaction.
     * @event

     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event

     */
    created?: EmitType<Event>;

    /**
     * Specifies a value that indicates whether the CheckBox is `checked` or not.
     * When set to `true`, the CheckBox will be in `checked` state.

     */
    checked?: boolean;

    /**
     * Defines class/multiple classes separated by a space in the CheckBox element.
     * You can add custom styles to the CheckBox by using this property.

     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the CheckBox is `disabled` or not.
     * When set to `true`, the CheckBox will be in `disabled` state.

     */
    disabled?: boolean;

    /**
     * Specifies a value that indicates whether the CheckBox is in `indeterminate` state or not.
     * When set to `true`, the CheckBox will be in `indeterminate` state.

     */
    indeterminate?: boolean;

    /**
     * Defines the caption for the CheckBox, that describes the purpose of the CheckBox.

     */
    label?: string;

    /**
     * Positions label `before`/`after` the CheckBox.
     * The possible values are:
     * * Before - The label is positioned to left of the CheckBox.
     * * After - The label is positioned to right of the CheckBox.

     */
    labelPosition?: LabelPosition;

    /**
     * Defines `name` attribute for the CheckBox.
     * It is used to reference form data (CheckBox value) after a form is submitted.

     */
    name?: string;

    /**
     * Defines `value` attribute for the CheckBox.
     * It is a form data passed to the server when submitting the form.

     */
    value?: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.

     */
    htmlAttributes?: { [key: string]: string; };

}