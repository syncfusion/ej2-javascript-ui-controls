import { Collection, EmitType, Event, Property, ChildProperty } from '@syncfusion/ej2-base';import { BlockActionMenuOpeningEventArgs, BlockActionMenuClosingEventArgs, BlockActionItemSelectEventArgs } from '../eventargs';import { BlockActionItem } from './blockaction-item';import { BlockActionItemModel } from './index';

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
     * @event opening
     */
    opening?: EmitType<BlockActionMenuOpeningEventArgs>;

    /**
     * Specifies the event triggered when the block actions menu closes.
     *
     * @event closing
     */
    closing?: EmitType<BlockActionMenuClosingEventArgs>;

    /**
     * Specifies the event triggered when an item is being selected from the menu.
     *
     * @event itemSelect
     */
    itemSelect?: EmitType<BlockActionItemSelectEventArgs>;

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