import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, closest, setValue } from '@syncfusion/ej2-base';import { EmitType, Event, EventHandler, MouseEventArgs } from '@syncfusion/ej2-base';import { addClass, isRippleEnabled, removeClass, rippleEffect, isNullOrUndefined } from '@syncfusion/ej2-base';import { rippleMouseHandler, destroy, preRender, ChangeEventArgs, BeforeChangeEventArgs, setHiddenInput } from './../common/common';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Switch
 */
export interface SwitchModel extends ComponentModel{

    /**
     * This event is triggered before the state of the switch is changed in the Switch component.
     * @event beforeChange
     * @remarks
     * The `beforeChange` event allows developers to intercept and cancel the switch state change before it is applied.
     */
    beforeChange?: EmitType<BeforeChangeEventArgs>;

    /**
     * Triggers when Switch state has been changed by user interaction.
     *
     * @event change
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Specifies a value that indicates whether the Switch is `checked` or not.
     * When set to `true`, the Switch will be in `checked` state.
     *
     * @default false
     */
    checked?: boolean;

    /**
     * You can add custom styles to the Switch by using this property.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the Switch is `disabled` or not.
     * When set to `true`, the Switch will be in `disabled` state.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines `name` attribute for the Switch.
     * It is used to reference form data (Switch value) after a form is submitted.
     *
     * @default ''
     */
    name?: string;

    /**
     * Specifies a text that indicates the Switch is in checked state.
     *
     * @default ''
     */
    onLabel?: string;

    /**
     * Specifies a text that indicates the Switch is in unchecked state.
     *
     * @default ''
     */
    offLabel?: string;

    /**
     * Defines `value` attribute for the Switch.
     * It is a form data passed to the server when submitting the form.
     *
     * @default ''
     */
    value?: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

}