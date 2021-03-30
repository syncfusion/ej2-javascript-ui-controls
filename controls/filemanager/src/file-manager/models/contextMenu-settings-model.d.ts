import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class ContextMenuSettings
 */
export interface ContextMenuSettingsModel {

    /**
     * Specifies the array of string or object that is used to configure file items.
     *
     * @default fileItems
     */
    file?: string[];

    /**
     * An array of string or object that is used to configure folder items.
     *
     * @default folderItems
     */
    folder?: string[];

    /**
     * An array of string or object that is used to configure layout items.
     *
     * @default layoutItems
     */
    layout?: string[];

    /**
     * Enables or disables the ContextMenu.
     *
     * @default true
     */
    visible?: boolean;

}