import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class ContextMenuSettings
 */
export interface ContextMenuSettingsModel {

    /**
     * Specifies the array of string or object that is used to configure file items.

     */
    file?: string[];

    /**
     * An array of string or object that is used to configure folder items.

     */
    folder?: string[];

    /**
     * An array of string or object that is used to configure layout items.

     */
    layout?: string[];

    /**
     * Enables or disables the ContextMenu.

     */
    visible?: boolean;

}