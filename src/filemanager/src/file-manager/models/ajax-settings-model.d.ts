import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class AjaxSettings
 */
export interface AjaxSettingsModel {

    /**
     * Specifies URL to download the files from server.
     * @default null
     */
    downloadUrl?: string;

    /**
     * Specifies URL to get the images from server.
     * @default null
     */
    getImageUrl?: string;

    /**
     * Specifies URL to upload the files to server.
     * @default null
     */
    uploadUrl?: string;

    /**
     * Specifies URL to read the files from server.
     * @default null
     */
    url?: string;

}