import { Component, INotifyPropertyChanged, NotifyPropertyChanges, addClass, removeClass, L10n, KeyboardEventArgs } from '@syncfusion/ej2-base';import { EmitType, Event, Property, detach, EventHandler, isNullOrUndefined as isNOU, compile, append } from '@syncfusion/ej2-base';
import {Severity,Variant,MessageCloseEventArgs} from "./message";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Message
 */
export interface MessageModel extends ComponentModel{

    /**
     * Specifies the content to be displayed in the Message component. It can be a paragraph, a list, or any other HTML element.
     * 
     * @default null
     */
    content?: string;

    /**
     * Specifies the CSS class or multiple classes separated by space that can be appended to the root element of the Message component to customize the message.
     * 
     * @default ''
     */
    cssClass?: string;

    /**
     * Shows or hides the severity icon in the Message component. When set to true, the severity icon is displayed at the left edge of the Message component.
     * This icon will be distinctive based on the severity property.
     * 
     * @default true
     */
    showIcon?: boolean;

    /**
     * Shows or hides the close icon in the Message component. An end user can click the close icon to hide the message. The closed event is triggered when the message is closed.
     * 
     * @default false
     */
    showCloseIcon?: boolean;

    /**
     * Specifies the severity of the message, which is used to define the appearance (icons and colors) of the message. The available severity messages are Normal, Success, Info, Warning, and Error.
     * 
     * @isenumeration true
     * @default Severity.Normal
     * @asptype Severity
     */
    severity?: string | Severity;

    /**
     * Specifies the variant from predefined appearance variants to display the content of the Message component. The available variants are Text, Outlined, and Filled.
     * 
     * @isenumeration true
     * @default Variant.Text
     * @asptype Variant
     */
    variant?: string | Variant;

    /**
     * Shows or hides the visibility of the Message component. When set to false, the Message component will be hidden.
     * 
     * @default true
     */
    visible?: boolean;

    /**
     * Triggers when the Message component is created successfully.
     * 
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the Message component is destroyed successfully.
     * 
     * @event
     */
    destroyed?: EmitType<Event>;

    /**
     * Triggers when the Message component is closed successfully.
     * 
     * @event
     */
    closed?: EmitType<MessageCloseEventArgs>

}