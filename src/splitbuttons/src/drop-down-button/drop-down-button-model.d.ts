import { Collection, Event, NotifyPropertyChanges, detach, Property, EventHandler, EmitType, isRippleEnabled, isNullOrUndefined, append, formatUnit, Animation } from '@syncfusion/ej2-base';import { addClass, INotifyPropertyChanged, getUniqueID, rippleEffect, getComponent, ChildProperty, Complex, AnimationModel } from '@syncfusion/ej2-base';import { attributes, Component, closest, select, KeyboardEventArgs, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { classList, removeClass, compile } from '@syncfusion/ej2-base';import { Button } from '@syncfusion/ej2-buttons';import { Popup } from '@syncfusion/ej2-popups';import { SplitButton } from '../split-button/split-button';import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, upDownKeyHandler, DropDownAnimationEffect } from './../common/common';import { getModel, SplitButtonIconPosition, Item, setBlankIconStyle } from './../common/common';import { ItemModel } from './../common/common-model';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DropDownMenuAnimationSettings
 */
export interface DropDownMenuAnimationSettingsModel {

    /**
     * Specifies the animation effect applied when the DropDownMenu is shown.
     * The possible effects are:
     * * None: Specifies that the DropDownMenu appears without any animation effect.
     * * SlideDown: Specifies that the DropDownMenu appears with a slide down effect.
     * * ZoomIn: Specifies that the DropDownMenu appears with a zoom in effect.
     * * FadeIn: Specifies that the DropDownMenu appears with a fade in effect.
     *
     * @default 'SlideDown'
     * @isEnumeration true
     */
    effect?: DropDownAnimationEffect;

    /**
     * Specifies the time duration (in milliseconds) of the animation effect when the DropDownMenu is displayed.
     *
     * @default 400
     */
    duration?: number;

    /**
     * Specifies the easing function applied during the animation effect of the DropDownMenu.
     *
     * @default 'ease'
     */
    easing?: string;

}

/**
 * Interface for a class DropDownButton
 */
export interface DropDownButtonModel extends ComponentModel{

    /**
     * Defines the content of the DropDownButton element that can either be a text or HTML elements.
     *
     * @default ""
     */
    content?: string;

    /**
     * Defines class/multiple classes separated by a space in the DropDownButton element. The
     * DropDownButton size and styles can be customized by using this.
     *
     * @default ""
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the DropDownButton is `disabled` or not.
     *
     * @default false.
     */
    disabled?: boolean;

    /**
     * Defines class/multiple classes separated by a space for the DropDownButton that is used to
     * include an icon. DropDownButton can also include font icon and sprite image.
     *
     * @default ""
     */
    iconCss?: string;

    /**
     * Positions the icon before/top of the text content in the DropDownButton. The possible values are:
     * * Left: The icon will be positioned to the left of the text content.
     * * Top: The icon will be positioned to the top of the text content.
     *
     * @default "Left"
     */
    iconPosition?: SplitButtonIconPosition;

    /**
     * Specifies whether to enable the rendering of untrusted HTML values in the DropDownButton component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Specifies action items with its properties which will be rendered as DropDownButton popup.
     *
     * @default []
     */
    items?: ItemModel[];

    /**
     * Specifies the popup element creation on open.
     *
     * @default false
     */
    createPopupOnClick?: boolean;

    /**
     * Allows to specify the DropDownButton popup item element.
     *
     * @default ""
     */
    target?: string | Element;

    /**
     * Specifies the event to close the DropDownButton popup.
     *
     * @default ""
     */
    closeActionEvents?: string;

    /**
     * Specifies the template content to be displayed.
     *
     * @default null
     * @aspType string
     */
    itemTemplate?: string | Function;

    /**
     * This property defines the width of the dropdown popup for the DropDownButton component.
     *
     * @property {string | number} popupWidth - A string or number representing the width of the dropdown.
     * It can be a valid CSS unit such as `px`, `%`, or `rem`, or a number interpreted as pixels.
     * @default "auto"
     * @remarks
     * The `popupWidth` property allows developers to control the width of the dropdown popup, ensuring it fits their design requirements.
     * The default value of `auto` allows the popup to adjust based on the content length, but a specific width can be provided for more precise control.
     */
    popupWidth?: string | number;

    /**
     * Specifies the animation settings for opening the sub menu in the DropDownMenu.
     * The settings control the duration, easing, and effect of the animation applied when the sub menu opens.
     *
     * @default { effect: 'None' }
     */
    animationSettings?: DropDownMenuAnimationSettingsModel;

    /**
     * Triggers while rendering each Popup item of DropDownButton.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the DropDownButton popup.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the DropDownButton popup.
     *
     * @event beforeClose
     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the DropDownButton popup.
     *
     * @event close
     */
    close?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the DropDownButton popup.
     *
     * @event open
     */
    open?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting action item in DropDownButton popup.
     *
     * @event select
     */
    select?: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    created?: EmitType<Event>;

}