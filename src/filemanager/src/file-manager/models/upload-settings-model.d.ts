import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class UploadSettings
 */
export interface UploadSettingsModel {

    /**
     * By default, the FileManager component initiates automatic upload when the files are added in upload queue.
     * If you want to manipulate the files before uploading to server, disable the autoUpload property.
     * The buttons "upload" and "clear" will be hided from file list when autoUpload property is true.
     * @default true
     */
    autoUpload?: boolean;

    /**
     * Specifies the minimum file size to be uploaded in bytes.
     * The property used to make sure that you cannot upload empty files and small files.
     * @default 0
     */
    minFileSize?: number;

    /**
     * Specifies the maximum allowed file size to be uploaded in bytes.
     * The property used to make sure that you cannot upload too large files.
     * @default 30000000
     */
    maxFileSize?: number;

}