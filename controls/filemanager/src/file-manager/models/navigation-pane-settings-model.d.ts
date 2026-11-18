import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SortOrder } from '../base/interface';

/**
 * Interface for a class NavigationPaneSettings
 */
export interface NavigationPaneSettingsModel {

    /**
     * Specifies the maximum width of navigationpane.
     *
     * @default '650px'
     */
    maxWidth?: string | number;

    /**
     * Specifies the minimum width of navigationpane.
     *
     * @default '240px'
     */
    minWidth?: string | number;

    /**
     * Enables or disables the navigation pane.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Specifies a value that indicates how to sort the folders in the navigation pane of the file manager component.
     * The available sort orders are:
     * * `None` - Indicates that the folders are not sorted.
     * * `Ascending` - Indicates that the folders are sorted in ascending order.
     * * `Descending` - Indicates that the folders are sorted in descending order.
     *
     * @default 'None'
     */
    sortOrder?: SortOrder;

}