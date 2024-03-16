import { ChildProperty, Property, Event, EmitType, Complex, Collection, BaseEventArgs } from '@syncfusion/ej2-base';import { MenuAnimationSettings, MenuAnimationSettingsModel, MenuItem, MenuItemModel } from '@syncfusion/ej2-navigations';import { RibbonTooltip } from './ribbon-tooltip';import { RibbonTooltipModel } from './ribbon-tooltip-model';
import {FileMenuBeforeOpenCloseEventArgs,FileMenuEventArgs,FileMenuOpenCloseEventArgs} from "./ribbon-file-menu-settings";

/**
 * Interface for a class FileMenuSettings
 */
export interface FileMenuSettingsModel {

    /**
     * Defines the text content of file menu button.
     *
     * @default 'File'
     */
    text?: string;

    /**
     * Defines whether to show the file menu button.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Defines the list of menu items for the file menu.
     *
     * @default []
     */
    menuItems?: MenuItemModel[];

    /**
     * Specifies whether to show the sub menu or not on click.
     * When set to true, the sub menu will open only on mouse click.
     *
     * @default false
     */
    showItemOnClick?: boolean;

    /**
     * Specifies the animation settings for the sub menu open/close.
     *
     * @default ''
     */
    animationSettings?: MenuAnimationSettingsModel;

    /**
     * Specifies the template for file menu item.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    itemTemplate?: string | Function;

    /**
     * Specifies the custom content for the file menu popup.
     *
     * @default ''
     * @angularType string | HTMLElement
     * @reactType string | HTMLElement | JSX.Element
     * @vueType string | HTMLElement
     * @aspType string
     */
    popupTemplate?: string | HTMLElement;

    /**
     * Specifies the tooltip settings for the file menu button.
     *
     * @default {}
     */
    ribbonTooltipSettings?: RibbonTooltipModel;

    /**
     * Event triggers before closing the file menu popup.
     *
     * @event beforeClose
     */
    beforeClose?: EmitType<FileMenuBeforeOpenCloseEventArgs>;

    /**
     * Event triggers before opening the file menu popup.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<FileMenuBeforeOpenCloseEventArgs>;

    /**
     * Event triggers while rendering each ribbon file menu item.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: EmitType<FileMenuEventArgs>;

    /**
     * Event triggers when file menu popup is closed.
     *
     * @event close
     */
    close?: EmitType<FileMenuOpenCloseEventArgs>;

    /**
     * Event triggers when file menu popup is opened.
     *
     * @event open
     */
    open?: EmitType<FileMenuOpenCloseEventArgs>;

    /**
     * Event triggers while selecting an item in ribbon file menu.
     *
     * @event select
     */
    select?: EmitType<FileMenuEventArgs>;

    /**
     * Specifies the keytip content.
     *
     * @default ''
     */
    keyTip?: string;

}