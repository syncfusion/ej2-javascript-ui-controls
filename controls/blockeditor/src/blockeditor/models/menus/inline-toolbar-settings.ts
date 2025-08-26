import { ChildProperty, Collection, EmitType, Event, Property } from '@syncfusion/ej2-base';
import { ToolbarItemClickedEventArgs, ToolbarOpenEventArgs, ToolbarCloseEventArgs } from '../../base/eventargs';
import { ToolbarItem, ToolbarItemModel } from './index';

/**
 * Inline toolbar settings that will be opened when selecting a range of texts.
 */
export class InlineToolbarSettings  extends ChildProperty<InlineToolbarSettings> {

    /**
     * Specifies the width of the popup.
     * Defaults value is 100%.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies whether to enable the inline toolbar.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies the individual items within a toolbar setup, specifying properties like commands, icons, and labels.
     *
     * @default []
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public items: ToolbarItemModel[];

    /**
     * Specifies whether the tooltip is enabled for the inline toolbar.
     * If set to `true`, tooltips will be displayed based on the `tooltip` property of the toolbar item.
     *
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * Triggers when the inline toolbar is opened.
     *
     * @event open
     */
    @Event()
    public open: EmitType<ToolbarOpenEventArgs>;

    /**
     * Triggers when the inline toolbar is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<ToolbarCloseEventArgs>;

    /**
     * Triggers when the item is clicked in the toolbar.
     *
     * @event itemClicked
     */
    @Event()
    public itemClicked: EmitType<ToolbarItemClickedEventArgs>;

}
