import { Component, Property, ChildProperty, INotifyPropertyChanged, NotifyPropertyChanges, Animation } from '@syncfusion/ej2-base';import { Browser, isNullOrUndefined as isNOU,  getUniqueID, formatUnit, EventHandler, KeyboardEventArgs } from '@syncfusion/ej2-base';import { EmitType, Collection, Complex, setStyleAttribute, Event, Effect, detach, AnimationModel, L10n } from '@syncfusion/ej2-base';import { attributes, extend, closest, compile as templateCompiler, classList, BaseEventArgs, isUndefined} from '@syncfusion/ej2-base';import { SwipeEventArgs, Touch, updateBlazorTemplate, isBlazor, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { ButtonModel, Button  } from '@syncfusion/ej2-buttons';import { getZindexPartial } from '@syncfusion/ej2-popups';
import {PositionX,PositionY,BeforeSanitizeHtmlArgs,ToastOpenArgs,ToastBeforeOpenArgs,ToastCloseArgs,ToastClickEventArgs} from "./toast";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ToastPosition
 */
export interface ToastPositionModel {

    /**
   * Specifies the position of the Toast notification with respect to the target container's left edge.
   * @default 'Left'
   * @aspType string
   * @blazorType string
   */
    X?: PositionX | number | string;

    /**
   * Specifies the position of the Toast notification with respect to the target container's top edge.
   * @default 'Top'
   * @aspType string
   * @blazorType string
   */
    Y?: PositionY | number | string;

}

/**
 * Interface for a class ButtonModelProps
 */
export interface ButtonModelPropsModel {

    /**
   * Specifies the Button component model properties to render the Toast action buttons.
   * ```html
   * <div id="element"> </div>
   * ```
   * ```typescript
   * let toast: Toast =  new Toast({ 
   *      buttons:
   *      [{ 
   *         model: { content:`Button1`, cssClass: `e-success` }
   *      }] 
   * });
   * toast.appendTo('#element');
   * ```
   *  
   * @default null
   */
    model?: ButtonModel;

    /**
   * Specifies the click event binding of action buttons created within Toast.
   * @event
   * @blazorProperty 'Clicked'
   */
    click?: EmitType<Event>;

}

/**
 * Interface for a class ToastAnimations
 */
export interface ToastAnimationsModel {

    /**
   * Specifies the type of animation.
   * @default 'FadeIn'
   * @aspType string
   */
    effect?: Effect;

    /**
   * Specifies the duration to animate.
   * @default 600
   */
    duration?: number;

    /**
   * Specifies the animation timing function.
   * @default 'ease'
   */
    easing?: string;

}

/**
 * Interface for a class ToastAnimationSettings
 */
export interface ToastAnimationSettingsModel {

    /**
   * Specifies the animation to appear while showing the Toast.
   * @default { effect: 'FadeIn', duration: 600, easing: 'ease' }
   */
    show?: ToastAnimationsModel;

    /**
   * Specifies the animation to appear while hiding the Toast.
   * @default { effect: 'FadeOut', duration: 600, easing: 'ease' }
   */
    hide?: ToastAnimationsModel;

}

/**
 * Interface for a class Toast
 */
export interface ToastModel extends ComponentModel{

    /**
     * Specifies the width of the Toast in pixels/numbers/percentage. Number value is considered as pixels.
     * In mobile devices, default width is considered as `100%`. 
     * @default '300'
     * @blazorType string
     */
    width?: string | number;

    /**
     * Specifies the height of the Toast in pixels/number/percentage. Number value is considered as pixels.
     * @default 'auto'
     * @blazorType string
     */
    height?: string | number;

    /**
     * Specifies the title to be displayed on the Toast. 
     * Works only with string values.
     * @default null
     */
    title?: string;

    /**
     * Specifies the content to be displayed on the Toast. 
     * Accepts selectors, string values and HTML elements.
     * @default null
     * @blazorType string
     */
    content?: string | HTMLElement;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Defines CSS classes to specify an icon for the Toast which is to be displayed at top left corner of the Toast.
     * @default null
     */
    icon?: string;

    /**
     * Defines single/multiple classes (separated by space) to be used for customization of Toast.
     * @default null
     */
    cssClass?: string;

    /**
     * Specifies the HTML element/element ID as a string that can be displayed as a Toast.
     * The given template is taken as preference to render the Toast, even if the built-in properties such as title and content are defined.
     * @default null
     */
    template?: string;

    /**
     * Specifies the newly created Toast message display order while multiple toast's are added to page one after another.
     * By default, newly added Toast will be added after old Toast's.
     * @default true
     */
    newestOnTop?: boolean;

    /**
     * Specifies whether to show the close button in Toast message to close the Toast.
     * @default false
     */
    showCloseButton?: boolean;

    /**
     * Specifies whether to show the progress bar to denote the Toast message display timeout.
     * @default false
     */
    showProgressBar?: boolean;

    /**
     * Specifies the Toast display time duration on the page in milliseconds. 
     * - Once the time expires, Toast message will be removed.
     * - Setting 0 as a time out value displays the Toast on the page until the user closes it manually.
     * @default 5000
     */
    timeOut?: number;

    /**
     * Specifies the Toast display time duration after interacting with the Toast. 
     * @default 1000
     */
    extendedTimeout?: number;

    /**
     * Specifies the animation configuration settings for showing and hiding the Toast.
     * @default { show: { effect: 'FadeIn', duration: 600, easing: 'linear' },
     * hide: { effect: 'FadeOut', duration: 600, easing: 'linear' }}
     */
    animation?: ToastAnimationSettingsModel;

    /**
     * Specifies the position of the Toast message to be displayed within target container.
     * In the case of multiple Toast display, new Toast position will not update on dynamic change of property values
     * until the old Toast messages removed.
     * X values are: Left , Right ,Center
     * Y values are: Top , Bottom
     * @default { X: "Left", Y: "Top" }
     */
    position?: ToastPositionModel;

    /**
     * Specifies the collection of Toast action `buttons` to be rendered with the given
     * Button model properties and its click action handler.
     * @default [{}]
     */
    buttons?: ButtonModelPropsModel[];

    /**
     * Specifies the target container where the Toast to be displayed.
     * Based on the target, the positions such as `Left`, `Top` will be applied to the Toast.
     * The default value is null, which refers the `document.body` element.
     * @default null
     * @aspType string
     * @blazorType string
     */
    target?: HTMLElement | Element | string;

    /**
     * Triggers the event after the Toast gets created.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * Event triggers before sanitize the value.
     * @event 
     * @blazorProperty 'OnSanitizeHtml'
     */
    beforeSanitizeHtml?: EmitType<BeforeSanitizeHtmlArgs>;

    /**
     * Triggers the event after the Toast gets destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    destroyed?: EmitType<Event>;

    /**
     * Triggers the event after the Toast shown on the target container.
     * @event
     * @blazorProperty 'Opened'
     */
    open?: EmitType<ToastOpenArgs>;

    /**
     * Triggers the event before the toast shown.
     * @event
     * @blazorProperty 'OnOpen'
     */
    beforeOpen?: EmitType<ToastBeforeOpenArgs>;

    /**
     * Trigger the event after the Toast hides.
     * @event
     * @blazorProperty 'Closed'
     */
    close?: EmitType<ToastCloseArgs>;

    /**
     * The event will be fired while clicking on the Toast.
     * @event
     * @blazorProperty 'OnClick'
     */
    click?: EmitType<ToastClickEventArgs>;

}