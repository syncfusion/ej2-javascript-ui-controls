import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class AjaxSettings
 */
export interface AjaxSettingsModel {

    /**
     * Specifies URL to download the files from server.

     */
    downloadUrl?: string;

    /**
     * Specifies URL to get the images from server.

     */
    getImageUrl?: string;

    /**
     * Specifies URL to upload the files to server.

     */
    uploadUrl?: string;

    /**
     * Specifies URL to read the files from server.

     */
    url?: string;

}