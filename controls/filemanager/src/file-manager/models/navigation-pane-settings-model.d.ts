import { Property, ChildProperty } from '@syncfusion/ej2-base';

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
     *
     * If the sortOrder is Ascending, the folders are sorted in ascending order.
     * If the sortOrder is Descending, the folders are sorted in descending order.
     * If the sortOrder is None, the folders are not sorted.
     *
     * @default 'None'
     */
    sortOrder?: 'None' | 'Ascending' | 'Descending';

}