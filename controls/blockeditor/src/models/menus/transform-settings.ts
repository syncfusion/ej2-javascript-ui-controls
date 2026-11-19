import { ChildProperty, Property, Event, EmitType } from '@syncfusion/ej2-base';
import { TransformItemSelectEventArgs } from '../eventargs';
import { TransformCommandName } from '../types';
import { TransformItemModel } from '../interface';

/**
 * Represents TransformSettings in the Inline Toolbar of block editor component.
 */
export class TransformSettings extends ChildProperty<TransformSettings> {

    /**
     * Specifies an array of command item models representing the available commands in the menu.
     * This property holds the list of commands that appear in the menu.
     *
     * @default []
     */
    @Property([])
    public items: (string | TransformCommandName | TransformItemModel)[];

    /**
     * Specifies the event triggered when a command item is clicked.
     * This event can be used to perform actions based on user interaction.
     *
     * @event itemSelect
     */
    @Event()
    public itemSelect : EmitType<TransformItemSelectEventArgs >;

    /**
     * Specifies the width of the command menu popup.
     * Accepts valid CSS width values such as `px`, `%`, `auto`, etc.
     *
     * @default 'auto'
     */
    @Property('auto')
    public popupWidth: string;

    /**
     * Specifies the height of the command menu popup.
     * Accepts valid CSS height values such as `px`, `%`, `auto`, etc.
     *
     * @default 'auto'
     */
    @Property('auto')
    public popupHeight: string;
}
