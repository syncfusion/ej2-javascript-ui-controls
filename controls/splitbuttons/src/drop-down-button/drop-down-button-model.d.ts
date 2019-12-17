import { Collection, Event, NotifyPropertyChanges, detach, Property, EventHandler, EmitType } from '@syncfusion/ej2-base';import { addClass, INotifyPropertyChanged, getUniqueID, rippleEffect } from '@syncfusion/ej2-base';import { attributes, Component, closest, select, KeyboardEventArgs, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { classList, remove, removeClass, isBlazor, Observer } from '@syncfusion/ej2-base';import { Button, buttonObserver } from '@syncfusion/ej2-buttons';import { Popup } from '@syncfusion/ej2-popups';import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from './../common/common';import { getModel, SplitButtonIconPosition, Item } from './../common/common';import { ItemModel } from './../common/common-model';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DropDownButton
 */
export interface DropDownButtonModel extends ComponentModel{

    /**
     * Defines the content of the DropDownButton element that can either be a text or HTML elements.
     * @default ""
     */
    content?: string;

    /**
     * Defines class/multiple classes separated by a space in the DropDownButton element. The
     * DropDownButton size and styles can be customized by using this.
     * @default ""
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the DropDownButton is `disabled` or not.
     * @default false.
     */
    disabled?: boolean;

    /**
     * Defines class/multiple classes separated by a space for the DropDownButton that is used to
     * include an icon. DropDownButton can also include font icon and sprite image.
     * @default ""
     */
    iconCss?: string;

    /**
     * Positions the icon before/top of the text content in the DropDownButton. The possible values are:
     * * Left: The icon will be positioned to the left of the text content.
     * * Top: The icon will be positioned to the top of the text content.
     * @default "Left"
     */
    iconPosition?: SplitButtonIconPosition;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Specifies action items with its properties which will be rendered as DropDownButton popup.
     * @default []
     */
    items?: ItemModel[];

    /**
     * Allows to specify the DropDownButton popup item element.
     * @default ""
     */
    target?: string | Element;

    /**
     * Triggers while rendering each Popup item of DropDownButton.
     * @event
     * @blazorProperty 'OnItemRender'
     */
    beforeItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the DropDownButton popup.
     * @event
     * @blazorProperty 'OnOpen'
     */
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the DropDownButton popup.
     * @event
     * @blazorProperty 'OnClose'
     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the DropDownButton popup.
     * @event
     * @blazorProperty 'Closed'
     */
    close?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the DropDownButton popup.
     * @event
     * @blazorProperty 'Opened'
     */
    open?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting action item in DropDownButton popup.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    select?: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

}