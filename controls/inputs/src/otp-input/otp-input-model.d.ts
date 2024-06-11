import { INotifyPropertyChanged, NotifyPropertyChanges, Component, Property, getUniqueID, isNullOrUndefined, addClass, attributes, removeClass, remove, EmitType, Event } from '@syncfusion/ej2-base';
import {OtpInputType,OtpInputStyle,OtpChangedEventArgs,OtpFocusEventArgs,OtpInputEventArgs} from "./otp-input";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class OtpInput
 */
export interface OtpInputModel extends ComponentModel{

    /**
     * Specifies the length of the Otp (One-Time Password) to be entered by the user.
     * This determines the number of input fields in the Otp Input.
     *
     * {% codeBlock src='otp-input/length/index.md' %}{% endcodeBlock %}
     *
     * @default 4
     */
    length?: number;

    /**
     * Specifies the value of the Otp (One-Time Password) input.
     * This can be a string or a number, representing the Otp value entered by the user.
     *
     * {% codeBlock src='otp-input/value/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @aspType string
     */
    value?: string | number;

    /**
     * Specifies the input type of the Otp.
     *
     * {% codeBlock src='otp-input/type/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default OtpInputType.Number
     * @asptype OtpInputType
     */
    type?: string | OtpInputType;

    /**
     * Specifies the separator used to separate each input field in the Otp Input component.
     * The separator is displayed between each input field.
     *
     * {% codeBlock src='otp-input/separator/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    separator?: string;

    /**
     * Specifies the text that is shown as a hint/placeholder until the user focuses on or enters a value in the Otp Input.
     * If a single text is provided, it will be used for all input fields; otherwise, each text letter will be used for each field.
     *
     * {% codeBlock src='otp-input/placeholder/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    placeholder?: string;

    /**
     * Specifies the style variant for the input fields in the Otp Input component.
     *
     * {% codeBlock src='otp-input/stylingMode/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default OtpInputStyle.Outlined
     * @asptype OtpInputStyle
     */
    stylingMode?: string | OtpInputStyle;

    /**
     * Specifies whether the Otp input component is disabled.
     * When set to true, the component is disabled and user input is not allowed.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines one or more CSS classes that can be used to customize the appearance of the Otp (One-Time Password) input component.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies additional HTML attributes to be applied to the Otp (One-Time Password) input component.
     *
     * {% codeBlock src='otp-input/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Defines the ARIA-label attribute for each input field in the Otp (One-Time Password) input component.
     * Each string in the array corresponds to the ARIA-label attribute for each input field.
     *
     * {% codeBlock src='otp-input/ariaLabels/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    ariaLabels?: string[];

    /**
     * Event triggers after the creation of the Otp Input.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Event triggers after the value is changed and the Otp input is focused out.
     *
     * @event change
     */
    valueChanged?: EmitType<OtpChangedEventArgs>;

    /**
     * Event triggers when the Otp input is focused.
     *
     * @event focus
     */
    focus?: EmitType<OtpFocusEventArgs>;

    /**
     * Event triggers when the Otp input is focused out.
     *
     * @event blur
     */
    blur?: EmitType<OtpFocusEventArgs>;

    /**
     * Event triggers each time when the value of each Otp input is changed.
     *
     * @event input
     */
    input?: EmitType<OtpInputEventArgs>;

}