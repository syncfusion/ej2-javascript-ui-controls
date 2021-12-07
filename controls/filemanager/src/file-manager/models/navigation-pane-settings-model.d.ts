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

}