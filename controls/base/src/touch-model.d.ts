import { extend } from './util';import { Property, Complex, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';import { Browser } from './browser';import { Base, EmitType } from './base';import { ChildProperty } from './child-property';import { EventHandler, BaseEventArgs } from './event-handler';
import {TapEventArgs,SwipeEventArgs,ScrollEventArgs} from "./touch";

/**
 * Interface for a class SwipeSettings
 */
export interface SwipeSettingsModel {

    /**
     * Property specifies minimum distance of swipe moved.
     */
    swipeThresholdDistance?: number;

}

/**
 * Interface for a class Touch
 */
export interface TouchModel {

    /**
     * Specifies the callback function for tap event.
     * @event
     */
    tap?: EmitType<TapEventArgs>;

    /**
     * Specifies the callback function for tapHold event.
     * @event
     */
    tapHold?: EmitType<TapEventArgs>;

    /**
     * Specifies the callback function for swipe event.
     * @event
     */
    swipe?: EmitType<SwipeEventArgs>;

    /**
     * Specifies the callback function for scroll event.
     * @event
     */
    scroll?: EmitType<ScrollEventArgs>;

    /**
     * Specifies the time delay for tap.

     */
    tapThreshold?: number;

    /**
     * Specifies the time delay for tap hold.

     */
    tapHoldThreshold?: number;

    /**
     * Customize the swipe event configuration.

     */
    swipeSettings?: SwipeSettingsModel;

}