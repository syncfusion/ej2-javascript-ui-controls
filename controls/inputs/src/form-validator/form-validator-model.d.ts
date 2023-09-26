import { selectAll, select, createElement, Base, EmitType, detach } from '@syncfusion/ej2-base';import { extend, isNullOrUndefined, IKeyValue, EventHandler } from '@syncfusion/ej2-base';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, onIntlChange } from '@syncfusion/ej2-base';import { Internationalization, L10n } from '@syncfusion/ej2-base';
import {ErrorOption,ValidArgs,FormEventArgs} from "./form-validator";

/**
 * Interface for a class FormValidator
 */
export interface FormValidatorModel {

    /**
     * default locale variable
     */
    locale?: string;

    /**
     * Ignores input fields based on the class name
     *
     * @default 'e-hidden'
     */
    ignore?: string;

    /**
     * Maps the input fields with validation rules
     *
     * @default {}
     */
    rules?: { [name: string]: { [rule: string]: Object } };

    /**
     * Sets the defined css class to error fields
     *
     * @default 'e-error'
     */
    errorClass?: string;

    /**
     * Sets the defined css class to valid fields
     *
     * @default 'e-valid'
     */
    validClass?: string;

    /**
     * Specify HTML element for error
     *
     * @default 'label'
     */
    errorElement?: string;

    /**
     * Specify HTML element for error container
     *
     * @default 'div'
     */
    errorContainer?: string;

    /**
     * Option to display the error
     *
     * @default ErrorOption.Label
     * @deprecated
     */
    errorOption?: ErrorOption;

    /**
     * Triggers when a field's focused  out
     *
     * @event focusout
     */
    focusout?: EmitType<Event>;

    /**
     * Trigger when keyup is triggered in any fields
     *
     * @event keyup
     */
    keyup?: EmitType<KeyboardEvent>;

    /**
     * Triggers when a check box field is clicked
     *
     * @event click
     */
    click?: EmitType<Event>;

    /**
     * Trigger when a select/drop-down field is changed
     *
     * @event change
     */
    change?: EmitType<Event>;

    /**
     * Triggers before form is being submitted
     *
     * @event submit
     */
    submit?: EmitType<Event>;

    /**
     * Triggers before validation starts
     *
     * @event validationBegin
     */
    validationBegin?: EmitType<Object | ValidArgs>;

    /**
     * Triggers after validation is completed
     *
     * @event validationComplete
     */
    validationComplete?: EmitType<Object | FormEventArgs>;

    /**
     * Assigns the custom function to place the error message in the page.
     *
     * @event customPlacement
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    customPlacement?: EmitType<HTMLElement | any>;

}