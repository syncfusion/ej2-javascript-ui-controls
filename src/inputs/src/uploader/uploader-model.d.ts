import { Component, Property, Event, EmitType, EventHandler, classList, L10n, compile, isNullOrUndefined } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, detach, append, Animation } from '@syncfusion/ej2-base';import { addClass, removeClass, KeyboardEvents, KeyboardEventArgs, setValue, getValue, ChildProperty } from '@syncfusion/ej2-base';import { Collection, Complex, Browser, Ajax, BeforeSendEventArgs, getUniqueID } from '@syncfusion/ej2-base';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import {SelectedEventArgs,RemovingEventArgs,ClearingEventArgs} from "./uploader";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FilesProp
 */
export interface FilesPropModel {

    /**
     * Specifies the name of the file
     * @default ''
     */
    name?: string;

    /**
     * Specifies the size of the file
     * @default null
     */
    size?: number;

    /**
     * Specifies the type of the file
     * @default ''
     */
    type?: string;

}

/**
 * Interface for a class ButtonsProps
 */
export interface ButtonsPropsModel {

    /**
     * Specifies the text or html content to browse button
     * @default 'Browse...'
     */
    browse?: string | HTMLElement;

    /**
     * Specifies the text or html content to upload button
     * @default 'Upload'
     */
    upload?: string | HTMLElement;

    /**
     * Specifies the text or html content to clear button
     * @default 'Clear'
     */
    clear?: string | HTMLElement;

}

/**
 * Interface for a class AsyncSettings
 */
export interface AsyncSettingsModel {

    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     * The save action type must be POST request and define the argument as same input name used to render the component.
     * The upload operations could not perform without this property.
     * @default ''
     */
    saveUrl?: string;

    /**
     * Specifies the URL of remove action that receives the file information and handle the remove operation in server.
     * The remove action type must be POST request and define “removeFileNames” attribute to get file information that will be removed.
     * This property is optional.
     * @default ''
     */
    removeUrl?: string;

    /**
     * Specifies the chunk size to split the large file into chunks, and upload it to the server in a sequential order.
     * If the chunk size property has value, the uploader enables the chunk upload by default.
     * It must be specified in bytes value.
     * 
     * > For more information, refer to the [chunk upload](./chunk-upload.html) section from the documentation.
     * 
     * @default 0
     */
    chunkSize?: number;

    /**
     * Specifies the number of retries that the uploader can perform on the file failed to upload.
     * By default, the uploader set 3 as maximum retries. This property must be specified to prevent infinity looping.
     * @default 3
     */
    retryCount?: number;

    /**
     * Specifies the delay time in milliseconds that the automatic retry happens after the delay.
     * @default 500
     */
    retryAfterDelay?: number;

}

/**
 * Interface for a class Uploader
 */
export interface UploaderModel extends ComponentModel{

    /**
     * Configures the save and remove URL to perform the upload operations in the server asynchronously.
     * @default { saveUrl: '', removeUrl: '' }
     */
    asyncSettings?: AsyncSettingsModel;

    /**
     * When this property is enabled, the uploader component elements are aligned from right-to-left direction to support locales.
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Specifies Boolean value that indicates whether the component is enabled or disabled.
     * The uploader component does not allow to interact when this property is disabled.
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies the HTML string that used to customize the content of each file in the list.
     * 
     * > For more information, refer to the [template](./template.html) section from the documentation.
     * 
     * @default null
     */
    template?: string;

    /**
     * Specifies a Boolean value that indicates whether the multiple files can be browsed or
     * dropped simultaneously in the uploader component.
     * @default true
     */
    multiple?: boolean;

    /**
     * By default, the uploader component initiates automatic upload when the files are added in upload queue.
     * If you want to manipulate the files before uploading to server, disable the autoUpload property.
     * The buttons “upload” and “clear” will be hided from file list when autoUpload property is true.
     * @default true
     */
    autoUpload?: boolean;

    /**
     * You can customize the default text of “browse, clear, and upload” buttons with plain text or HTML elements.
     * The buttons’ text can be customized from localization also. If you configured both locale and buttons property,
     * the uploader component considers the buttons property value.
     * @default { browse : 'Browse...', clear: 'Clear', upload: 'Upload' }
     */
    buttons?: ButtonsPropsModel;

    /**
     * Specifies the extensions of the file types allowed in the uploader component and pass the extensions
     * with comma separators. For example,
     * if you want to upload specific image files,  pass allowedExtensions as “.jpg,.png”.
     * @default ''
     */
    allowedExtensions?: string;

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

    /**
     * Specifies the drop target to handle the drag-and-drop upload.
     * By default, the component creates wrapper around file input that will act as drop target.
     * 
     * > For more information, refer to the [drag-and-drop](./file-source.html#drag-and-drop) section from the documentation.
     * 
     * @default null
     */
    dropArea?: string | HTMLElement;

    /**
     * Specifies the list of files that will be preloaded on rendering of uploader component.
     * The property used to view and remove the uploaded files from server. By default, the files are configured with
     * uploaded successfully state. The following properties are mandatory to configure the preload files:
     * * Name
     * * Size
     * * Type
     * 
     * {% codeBlock src="uploader/files-api/index.ts" %}{% endcodeBlock %}
     * 
     * {% codeBlock src="uploader/files-api/index.html" %}{% endcodeBlock %}
     * @default { name: '', size: null, type: '' }
     */
    files?: FilesPropModel[];

    /**
     * Specifies a Boolean value that indicates whether the default file list can be rendered.
     * The property used to prevent default file list and design own template for file list.
     * @default true
     */
    showFileList?: boolean;

    /**
     * Specifies a Boolean value that indicates whether the folder of files can be browsed in the uploader component.
     * 
     * > When enabled this property, it allows only files of folder to select or drop to upload and
     * it cannot be allowed to select or drop files.
     * 
     * @default false
     */
    directoryUpload?: boolean;

    /**
     * Triggers when the component is created.
     * @event 
     */
    created?: EmitType<Object>;

    /**
     * Triggers after selecting or dropping the files by adding the files in upload queue.
     * @event
     */
    selected?: EmitType<SelectedEventArgs>;

    /**
     * Triggers when the upload process gets started. This event is used to add additional parameter with upload request.
     * @event
     */
    uploading?: EmitType<Object>;

    /**
     * Triggers when the AJAX request gets success on uploading files or removing files.
     * @event
     */
    success?: EmitType<Object>;

    /**
     * Triggers when the AJAX request fails on uploading or removing files.
     * @event
     */
    failure?: EmitType<Object>;

    /**
     * Triggers on removing the uploaded file. The event used to get confirm before removing the file from server.
     * @event
     */
    removing?: EmitType<RemovingEventArgs>;

    /**
     * Triggers before clearing the items in file list when clicking “clear”.
     * @event
     */
    clearing?: EmitType<ClearingEventArgs>;

    /**
     * Triggers when uploading a file to the server using the AJAX request.
     * @event
     */
    progress?: EmitType<Object>;

    /**
     * Triggers when changes occur in uploaded file list by selecting or dropping files.
     * @event
     */
    change?: EmitType<Object>;

    /**
     * Fires when the chunk file uploaded successfully.
     * @event
     */
    chunkSuccess?: EmitType<Object>;

    /**
     * Fires if the chunk file failed to upload.
     * @event
     */
    chunkFailure?: EmitType<Object>;

    /**
     * Fires if cancel the chunk file uploading.
     * @event
     */
    canceling?: EmitType<Object>;

    /**
     * Fires if pause the chunk file uploading.
     * @event
     */
    pausing?: EmitType<Object>;

    /**
     * Fires if resume the paused chunk file upload.
     * @event
     */
    resuming?: EmitType<Object>;

}