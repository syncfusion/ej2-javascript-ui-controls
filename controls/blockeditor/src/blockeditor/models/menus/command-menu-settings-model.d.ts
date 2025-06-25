import { ChildProperty, Property, Collection, EmitType, Event } from '@syncfusion/ej2-base';import { CommandItemModel } from './index';import { CommandItem } from './command-item';import { CommandMenuOpenEventArgs, CommandMenuCloseEventArgs, CommandQueryFilteringEventArgs, CommandItemClickedEventArgs } from '../../base/eventargs';

/**
 * Interface for a class CommandMenuSettings
 */
export interface CommandMenuSettingsModel {

    /**
     * Specifies the width of the command menu popup.
     * Accepts valid CSS width values such as px, %, auto, etc.
     *
     * @default '250px'
     */
    popupWidth?: string;

    /**
     * Specifies the height of the command menu popup.
     * Accepts valid CSS height values such as px, %, auto, etc.
     *
     * @default '300px'
     */
    popupHeight?: string;

    /**
     * Specifies an array of command item models representing the available commands in the menu.
     * This property holds the list of commands that appear in the menu.
     *
     * @default []
     */
    commands?: CommandItemModel[];

    /**
     * Specifies whether the tooltip is enabled for the command menu.
     * If set to `true`, tooltips will be displayed based on the `tooltip` property of the command item.
     *
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * Specifies the event triggered when the command menu opens.
     *
     * @event open
     */
    open?: EmitType<CommandMenuOpenEventArgs>;

    /**
     * Specifies the event triggered when the command menu closes.
     *
     * @event close
     */
    close?: EmitType<CommandMenuCloseEventArgs>;

    /**
     * Specifies the event triggered for filtering commands based on the query input.
     *
     * @event queryFiltering
     */
    queryFiltering?: EmitType<CommandQueryFilteringEventArgs>;

    /**
     * Specifies the event triggered when a command item is clicked.
     * This event can be used to perform actions based on user interaction.
     *
     * @event itemClicked
     */
    itemClicked?: EmitType<CommandItemClickedEventArgs>;

}