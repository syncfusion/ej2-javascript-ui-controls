import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Component } from '@syncfusion/ej2-base';import { addClass, Event, EmitType, detach, removeClass, rippleEffect, EventHandler } from '@syncfusion/ej2-base';import { getTextNode } from '../common/common';
import {IconPosition} from "./button";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Button
 */
export interface ButtonModel extends ComponentModel{

    /**
     * Positions the icon before/after the text content in the Button.
     * The possible values are:
     * * Left: The icon will be positioned to the left of the text content.
     * * Right: The icon will be positioned to the right of the text content.
     * @default "left"
     */
    iconPosition?: IconPosition;

    /**
     * Defines class/multiple classes separated by a space for the Button that is used to include an icon.
     * Buttons can also include font icon and sprite image.
     * @default ""
     */
    iconCss?: string;

    /**
     * Specifies a value that indicates whether the Button is `disabled` or not.
     * @default false.
     */
    disabled?: boolean;

    /**
     * Allows the appearance of the Button to be enhanced and visually appealing when set to `true`.
     * @default false
     */
    isPrimary?: boolean;

    /**
     * Defines class/multiple classes separated by a space in the Button element. The Button types, styles, and
     * size can be defined by using
     * [`this`](http://ej2.syncfusion.com/documentation/button/howto.html?lang=typescript#create-a-block-button).
     * @default ""
     */
    cssClass?: string;

    /**
     * Defines the text `content` of the Button element.
     * @default ""
     */
    content?: string;

    /**
     * Makes the Button toggle, when set to `true`. When you click it, the state changes from normal to active.
     * @default false
     */
    isToggle?: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     * @private
     */
    locale?: string;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    created?: EmitType<Event>;

}