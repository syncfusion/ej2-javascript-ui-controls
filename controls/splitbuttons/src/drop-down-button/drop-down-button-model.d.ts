import { Collection, Event, NotifyPropertyChanges, detach, Property, EventHandler, EmitType } from '@syncfusion/ej2-base';import { addClass, INotifyPropertyChanged, getUniqueID, rippleEffect, getComponent } from '@syncfusion/ej2-base';import { attributes, Component, closest, select, KeyboardEventArgs, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { classList, removeClass } from '@syncfusion/ej2-base';import { Button } from '@syncfusion/ej2-buttons';import { Popup } from '@syncfusion/ej2-popups';import { SplitButton } from '../split-button/split-button';import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, upDownKeyHandler } from './../common/common';import { getModel, SplitButtonIconPosition, Item, setBlankIconStyle } from './../common/common';import { ItemModel } from './../common/common-model';
import {ComponentModel} from '@syncfusion/ej2-base';

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
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default false
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