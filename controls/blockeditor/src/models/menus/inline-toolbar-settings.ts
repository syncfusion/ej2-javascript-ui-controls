import { ChildProperty, EmitType, Event, Property } from '@syncfusion/ej2-base';
import { ToolbarItemClickEventArgs } from '../eventargs';
import { IToolbarItemModel } from '../interface';
import { ToolbarCommandName } from '../types';

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
    public popupWidth: string | number;

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
     * @default ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Color', 'BackgroundColor']
     */
    @Property(['Bold', 'Italic', 'Underline', 'Strikethrough', 'Color', 'BackgroundColor'])
    public items: (string | ToolbarCommandName | IToolbarItemModel)[];

    /**
     * Triggers when the item is clicked in the toolbar.
     *
     * @event itemClick
     */
    @Event()
    public itemClick: EmitType<ToolbarItemClickEventArgs>;

}
