import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SortOrder } from '../base/interface';

/**
 * Specifies the navigationpane settings of the File Manager.
 */
export class NavigationPaneSettings extends ChildProperty<NavigationPaneSettings> {
    /**
     * Specifies the maximum width of navigationpane.
     *
     * @default '650px'
     */
    @Property('650px')
    public maxWidth: string | number;

    /**
     * Specifies the minimum width of navigationpane.
     *
     * @default '240px'
     */
    @Property('240px')
    public minWidth: string | number;

    /**
     * Enables or disables the navigation pane.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Specifies a value that indicates how to sort the folders in the navigation pane of the file manager component.
     * The available sort orders are:
     * * `None` - Indicates that the folders are not sorted.
     * * `Ascending` - Indicates that the folders are sorted in ascending order.
     * * `Descending` - Indicates that the folders are sorted in descending order.
     *
     * @default 'None'
     */
    @Property('None')
    public sortOrder: SortOrder;
}
