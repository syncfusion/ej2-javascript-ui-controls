import { Collection, EmitType, Event, Property, ChildProperty } from '@syncfusion/ej2-base';import { BlockActionMenuOpenEventArgs, BlockActionMenuCloseEventArgs, BlockActionItemClickEventArgs } from '../../base/eventargs';import { BlockActionItem } from './blockaction-item';import { BlockActionItemModel } from './index';

/**
 * Interface for a class BlockActionMenuSettings
 */
export interface BlockActionMenuSettingsModel {

    /**
     * Specifies whether the block actions menu is enabled.
     * If set to `false`, the menu will not be displayed.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies the action items in the block actions menu.
     * This defines the set of commands that appear when the menu is opened.
     *
     * @default []
     */
    items?: BlockActionItemModel[];

    /**
     * Specifies the event triggered when the block actions menu opens.
     *
     * @event open
     */
    open?: EmitType<BlockActionMenuOpenEventArgs>;

    /**
     * Specifies the event triggered when the block actions menu closes.
     *
     * @event close
     */
    close?: EmitType<BlockActionMenuCloseEventArgs>;

    /**
     * Specifies the event triggered when an item is being selected from the menu.
     *
     * @event itemClick
     */
    itemClick?: EmitType<BlockActionItemClickEventArgs>;

    /**
     * Specifies the popup width for the action menu.
     *
     * @default '230px'
     */
    popupWidth?: string;

    /**
     * Specifies the popup height for the action menu.
     *
     * @default 'auto'
     */
    popupHeight?: string;

    /**
     * Specifies whether the tooltip is enabled for the block action menu.
     * If set to `true`, tooltips will be displayed based on the `tooltip` property of the action item.
     *
     * @default true
     */
    enableTooltip?: boolean;

}