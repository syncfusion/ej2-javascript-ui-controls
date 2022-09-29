import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Event, EmitType } from '@syncfusion/ej2-base';import { addClass, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import {AppBarMode,AppBarPosition,AppBarColor} from "./appbar";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class AppBar
 */
export interface AppBarModel extends ComponentModel{

    /**
     *  Specifies the mode of the AppBar that defines the AppBar height. The possible values for this property are as follows:
     *  * Regular
     *  * Prominent
     *  * Dense
     *
     *  @default 'Regular'
     */
    mode?: AppBarMode;

    /**
     *  Specifies the position of the AppBar. The possible values for this property are as follows:
     *  * Top
     *  * Bottom
     *
     *  @default 'Top'
     */
    position?: AppBarPosition;

    /**
     * Accepts single/multiple CSS classes (separated by a space) to be used for AppBar customization.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Defines whether the AppBar position is fixed or not while scrolling the page.
     * When set to `true`, the AppBar will be sticky while scrolling.
     *
     * @default false
     */
    isSticky?: boolean;

    /**
     * Accepts HTML attributes/custom attributes that will be applied to the AppBar element.
     *
     * @default null
     */
    htmlAttributes?: Record<string, string>;

    /**
     *  Specifies the color mode that defines the color of the AppBar component. The possible values for this property are as follows:
     *  * Light
     *  * Dark
     *  * Primary
     *  * Inherit
     *
     *  @default 'Light'
     */
    colorMode?: AppBarColor;

    /**
     * Triggers after the AppBar component is created.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Triggers when the AppBar component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Event>;

}