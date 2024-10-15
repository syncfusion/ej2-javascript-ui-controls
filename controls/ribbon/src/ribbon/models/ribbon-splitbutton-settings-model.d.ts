import { ChildProperty, Collection, Event, EmitType, Property } from '@syncfusion/ej2-base';import { ItemModel, Item, BeforeOpenCloseMenuEventArgs, MenuEventArgs, OpenCloseMenuEventArgs, ClickEventArgs } from '@syncfusion/ej2-splitbuttons';

/**
 * Interface for a class RibbonSplitButtonSettings
 */
export interface RibbonSplitButtonSettingsModel {

    /**
     * Specifies the event to close the SplitButton popup.
     *
     * @default ''
     */
    closeActionEvents?: string;

    /**
     * Specifies the content of the SplitButton.
     *
     * @default ''
     */
    content?: string;

    /**
     * Defines one or more CSS classes to customize the appearance of SplitButton.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines the CSS class for the icons to be shown in the SplitButton.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Defines the list of items for the SplitButton popup.
     *
     * @default []
     */
    items?: ItemModel[];

    /**
     * Specifies the selector for the element to be shown in the SplitButton popup.
     *
     * @default ''
     * @aspType string
     */
    target?: string | HTMLElement;

    /**
     * Specifies additional HTML attributes to be applied to the SplitButton.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Triggers before closing the SplitButton popup.
     *
     * @event beforeClose
     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while rendering each Popup item of SplitButton.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the SplitButton popup.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the SplitButton popup.
     *
     * @event close
     */
    close?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while clicking the primary button in SplitButton.
     *
     * @event click
     */
    click?: EmitType<ClickEventArgs>;

    /**
     * Event triggers once the SplitButton is created.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Triggers while opening the SplitButton popup.
     *
     * @event open
     */
    open?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting an action item in SplitButton popup.
     *
     * @event select
     */
    select?: EmitType<MenuEventArgs>;

}