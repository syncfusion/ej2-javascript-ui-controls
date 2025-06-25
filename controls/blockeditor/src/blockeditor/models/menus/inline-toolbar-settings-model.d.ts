import { ChildProperty, Collection, EmitType, Event, Property } from '@syncfusion/ej2-base';import { ToolbarItemClickedEventArgs, ToolbarOpenEventArgs, ToolbarCloseEventArgs } from '../../base/eventargs';import { ToolbarItem, ToolbarItemModel } from './index';

/**
 * Interface for a class InlineToolbarSettings
 */
export interface InlineToolbarSettingsModel {

    /**
     * Specifies the width of the popup.
     * Defaults value is 100%.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Specifies whether to enable the inline toolbar.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies the individual items within a toolbar setup, specifying properties like commands, icons, and labels.
     *
     * @default []
     */
    items?: ToolbarItemModel[];

    /**
     * Specifies whether the tooltip is enabled for the inline toolbar.
     * If set to `true`, tooltips will be displayed based on the `tooltip` property of the toolbar item.
     *
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * Triggers when the inline toolbar is opened.
     *
     * @event open
     */
    open?: EmitType<ToolbarOpenEventArgs>;

    /**
     * Triggers when the inline toolbar is closed.
     *
     * @event close
     */
    close?: EmitType<ToolbarCloseEventArgs>;

    /**
     * Triggers when the item is clicked in the toolbar.
     *
     * @event itemClicked
     */
    itemClicked?: EmitType<ToolbarItemClickedEventArgs>;

}