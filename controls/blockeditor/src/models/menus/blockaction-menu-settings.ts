import { Collection, EmitType, Event, Property, ChildProperty } from '@syncfusion/ej2-base';
import { BlockActionMenuOpeningEventArgs, BlockActionMenuClosingEventArgs, BlockActionItemSelectEventArgs } from '../eventargs';
import { BlockActionItem } from './blockaction-item';
import { BlockActionItemModel } from './index';

/**
 * Represents BlockActionMenuSettings in the block editor component.
 */
export class BlockActionMenuSettings extends ChildProperty<BlockActionMenuSettings>{
    /**
     * Specifies whether the block actions menu is enabled.
     * If set to `false`, the menu will not be displayed.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies the action items in the block actions menu.
     * This defines the set of commands that appear when the menu is opened.
     *
     * @default []
     */
    @Collection<BlockActionItemModel>([], BlockActionItem)
    public items: BlockActionItemModel[];

    /**
     * Specifies the event triggered when the block actions menu opens.
     *
     * @event opening
     */
    @Event()
    public opening: EmitType<BlockActionMenuOpeningEventArgs>;

    /**
     * Specifies the event triggered when the block actions menu closes.
     *
     * @event closing
     */
    @Event()
    public closing: EmitType<BlockActionMenuClosingEventArgs>;

    /**
     * Specifies the event triggered when an item is being selected from the menu.
     *
     * @event itemSelect
     */
    @Event()
    public itemSelect: EmitType<BlockActionItemSelectEventArgs>;

    /**
     * Specifies the popup width for the action menu.
     *
     * @default '230px'
     */
    @Property('230px')
    public popupWidth: string;

    /**
     * Specifies the popup height for the action menu.
     *
     * @default 'auto'
     */
    @Property('auto')
    public popupHeight: string;

    /**
     * Specifies whether the tooltip is enabled for the block action menu.
     * If set to `true`, tooltips will be displayed based on the `tooltip` property of the action item.
     *
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;
}
