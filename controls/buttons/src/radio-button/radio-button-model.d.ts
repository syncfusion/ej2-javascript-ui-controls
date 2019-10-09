import { Component, INotifyPropertyChanged, rippleEffect, NotifyPropertyChanges, Property, closest } from '@syncfusion/ej2-base';import { addClass, getInstance, getUniqueID, isRippleEnabled, removeClass, attributes, isNullOrUndefined } from '@syncfusion/ej2-base';import { BaseEventArgs, detach, EmitType, Event, EventHandler } from '@syncfusion/ej2-base';import { wrapperInitialize, rippleMouseHandler } from './../common/common';
import {ChangeArgs,RadioLabelPosition} from "./radio-button";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RadioButton
 */
export interface RadioButtonModel extends ComponentModel{

    /**
     * Event trigger when the RadioButton state has been changed by user interaction.
     * @event
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ChangeArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * Specifies a value that indicates whether the RadioButton is `checked` or not.
     * When set to `true`, the RadioButton will be in `checked` state.
     * @default false
     */
    checked?: boolean;

    /**
     * Defines class/multiple classes separated by a space in the RadioButton element.
     * You can add custom styles to the RadioButton by using this property.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the RadioButton is `disabled` or not.
     * When set to `true`, the RadioButton will be in `disabled` state.
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines the caption for the RadioButton, that describes the purpose of the RadioButton.
     * @default ''
     */
    label?: string;

    /**
     * Positions label `before`/`after` the RadioButton.
     * The possible values are:
     * * Before: The label is positioned to left of the RadioButton.
     * * After: The label is positioned to right of the RadioButton.
     * @default 'After'
     */
    labelPosition?: RadioLabelPosition;

    /**
     * Defines `name` attribute for the RadioButton.
     * It is used to reference form data (RadioButton value) after a form is submitted.
     * @default ''
     */
    name?: string;

    /**
     * Defines `value` attribute for the RadioButton.
     * It is a form data passed to the server when submitting the form.
     * @default ''
     */
    value?: string;

}