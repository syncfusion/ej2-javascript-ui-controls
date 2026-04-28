import { ChildProperty, Collection, Event, EmitType, Property } from '@syncfusion/ej2-base';import { ItemModel, Item, BeforeOpenCloseMenuEventArgs, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';

/**
 * Interface for a class RibbonDropDownSettings
 */
export interface RibbonDropDownSettingsModel {

    /**
     * Specifies the event to close the DropDownButton popup.
     *
     * @default ''
     */
    closeActionEvents?: string;

    /**
     * Specifies the content of the DropDownButton.
     *
     * @default ''
     */
    content?: string;

    /**
     * Defines one or more CSS classes to customize the appearance of DropDownButton.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines the CSS class for the icons to be shown in the DropDownButton.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Defines the list of items for the DropDownButton popup.
     *
     * @default []
     */
    items?: ItemModel[];

    /**
     * Specifies the selector for the element to be shown in the DropDownButton popup.
     *
     * @default ''
     * @aspType string
     */
    target?: string | HTMLElement;

    /**
     * Specifies whether to create popup element on open.
     *
     * @default false
     */
    createPopupOnClick?: boolean;

    /**
     * Specifies additional HTML attributes to be applied to the DropDownButton.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Triggers before closing the DropDownButton popup.
     *
     * @event beforeClose
     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

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
     * Triggers while closing the DropDownButton popup.
     *
     * @event close
     */
    close?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Event triggers once the DropDownButton is created.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Triggers while opening the DropDownButton popup.
     *
     * @event open
     */
    open?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting an action item in DropDownButton popup.
     *
     * @event select
     */
    select?: EmitType<MenuEventArgs>;

}