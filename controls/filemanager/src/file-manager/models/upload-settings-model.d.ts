import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class UploadSettings
 */
export interface UploadSettingsModel {

    /**
     * Specifies the extensions of the file types allowed in the file manager component and pass the extensions with comma separators.
     * For example, if you want to upload specific image files, pass allowedExtensions as ".jpg,.png".
     * @defaults ''
     */
    allowedExtensions?: string;

    /**
     * By default, the FileManager component initiates automatic upload when the files are added in upload queue.
     * If you want to manipulate the files before uploading to server, disable the autoUpload property.
     * The buttons "upload" and "clear" will be hided from file list when the autoUpload property is true.
     * @default true
     */
    autoUpload?: boolean;

    /**
     * Defines whether to close the upload dialog after uploading all the files.
     * @default false
     */
    autoClose?: boolean;

    /**
     * Specifies the minimum file size to be uploaded in bytes.
     * The property is used to make sure that you cannot upload empty files and small files.
     * @default 0
     */
    minFileSize?: number;

    /**
     * Specifies the maximum allowed file size to be uploaded in bytes.
     * The property is used to make sure that you cannot upload too large files.
     * @default 30000000
     */
    maxFileSize?: number;

}