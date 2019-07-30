import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Event } from '@syncfusion/ej2-base';import { Base, EmitType } from '@syncfusion/ej2-base';import { KeyboardEventsModel } from '@syncfusion/ej2-base';
import {KeyboardEventArgs} from "./keyboard";

/**
 * Interface for a class KeyboardEvents
 */
export interface KeyboardEventsModel {

    /**
     * Specifies key combination and it respective action name.
     * @default null
     */
    keyConfigs?: { [key: string]: string };

    /**
     * Specifies on which event keyboardEvents class should listen for key press. For ex., `keyup`, `keydown` or `keypress`
     * @default 'keyup'
     */
    eventName?: string;

    /**
     * Specifies the listener when keyboard actions is performed. 
     * @event
     */
    keyAction?: EmitType<KeyboardEventArgs>;

}