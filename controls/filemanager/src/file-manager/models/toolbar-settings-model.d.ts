import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * An array of string or object that is used to configure the toolbar items.
     *
     * @default toolbarItems
     */
    items?: string[];

    /**
     * Enables or disables the toolbar rendering in the file manager component.
     *
     * @default true
     */
    visible?: boolean;

}