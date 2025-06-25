import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class LinkSettings
 */
export interface LinkSettingsModel {

    /**
     * Specifies the URL of the link.
     * This is the destination where the link will navigate to when clicked.
     *
     * @default ''
     */
    url?: string;

    /**
     * Specifies whether the link should open in a new window/tab.
     * If set to true, the link will open in a new window/tab, otherwise it will open in the same window.
     *
     * @default true
     */
    openInNewWindow?: boolean;

}