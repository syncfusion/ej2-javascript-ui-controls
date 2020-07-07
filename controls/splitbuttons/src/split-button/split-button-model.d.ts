import { Event, EmitType, remove, addClass, removeClass, detach, getValue, setValue } from '@syncfusion/ej2-base';import { EventHandler, Collection, BaseEventArgs, NotifyPropertyChanges, INotifyPropertyChanged, Property } from '@syncfusion/ej2-base';import { attributes, getUniqueID, getInstance, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';import { Button, ButtonModel } from '@syncfusion/ej2-buttons';import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from './../common/common';import { getModel, SplitButtonIconPosition, Item } from './../common/common';import { DropDownButton } from '../drop-down-button/drop-down-button';import { ItemModel } from './../common/common-model';
import {ClickEventArgs} from "./split-button";
import {DropDownButtonModel} from "../drop-down-button/drop-down-button-model";

/**
 * Interface for a class SplitButton
 */
export interface SplitButtonModel extends DropDownButtonModel{

    /**
     * Defines the content of the SplitButton primary action button can either be a text or HTML elements.
     * @default ""
     */
    content?: string;

    /**
     * Defines class/multiple classes separated by a space in the SplitButton element. The SplitButton
     * size and styles can be customized by using this.
     * @default ""
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the SplitButton is disabled or not.
     * @default false.
     */
    disabled?: boolean;

    /**
     * Defines class/multiple classes separated by a space for the SplitButton that is used to include an 
     * icon. SplitButton can also include font icon and sprite image.
     * @default ""
     */
    iconCss?: string;

    /**
     * Positions the icon before/top of the text content in the SplitButton. The possible values are
     * * Left: The icon will be positioned to the left of the text content.
     * * Top: The icon will be positioned to the top of the text content.
     * @default "Left"
     */
    iconPosition?: SplitButtonIconPosition;

    /**
     * Specifies action items with its properties which will be rendered as SplitButton secondary button popup.
     * @default []
     */
    items?: ItemModel[];

    /**
     * Allows to specify the SplitButton popup item element.
     * @default ""
     */
    target?: string | Element;

    /**
     * Triggers while rendering each Popup item of SplitButton.
     * @event
     */
    beforeItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the SplitButton popup.
     * @event
     */
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the SplitButton popup.
     * @event
     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when the primary button of SplitButton has been clicked.
     * @event
     */
    click?: EmitType<ClickEventArgs>;

    /**
     * Triggers while closing the SplitButton popup.
     * @event
     */
    close?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the SplitButton popup.
     * @event
     */
    open?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting action item of SplitButton popup.
     * @event
     */
    select?: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    created?: EmitType<Event>;

}

/**
 * Interface for a class Deferred
 */
export interface DeferredModel {

}