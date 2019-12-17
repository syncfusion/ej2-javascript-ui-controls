import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, closest } from '@syncfusion/ej2-base';import { EmitType, Event, EventHandler, MouseEventArgs, isBlazor } from '@syncfusion/ej2-base';import { addClass, isRippleEnabled, removeClass, rippleEffect, isNullOrUndefined } from '@syncfusion/ej2-base';import { rippleMouseHandler, destroy, preRender, ChangeEventArgs, setHiddenInput } from './../common/common';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Switch
 */
export interface SwitchModel extends ComponentModel{

    /**
     * Triggers when Switch state has been changed by user interaction.
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
     * Specifies a value that indicates whether the Switch is `checked` or not.
     * When set to `true`, the Switch will be in `checked` state.
     * @default false
     */
    checked?: boolean;

    /**
     * You can add custom styles to the Switch by using this property.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the Switch is `disabled` or not.
     * When set to `true`, the Switch will be in `disabled` state.
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines `name` attribute for the Switch.
     * It is used to reference form data (Switch value) after a form is submitted.
     * @default ''
     */
    name?: string;

    /**
     * Specifies a text that indicates the Switch is in checked state.
     * @default ''
     */
    onLabel?: string;

    /**
     * Specifies a text that indicates the Switch is in unchecked state.
     * @default ''
     */
    offLabel?: string;

    /**
     * Defines `value` attribute for the Switch.
     * It is a form data passed to the server when submitting the form.
     * @default ''
     */
    value?: string;

}