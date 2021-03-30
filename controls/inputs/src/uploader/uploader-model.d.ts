import { Component, Property, Event, EmitType, EventHandler, L10n, compile, isNullOrUndefined} from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, detach, append, Animation } from '@syncfusion/ej2-base';import { addClass, removeClass, KeyboardEvents, KeyboardEventArgs, setValue, getValue, ChildProperty } from '@syncfusion/ej2-base';import { Collection, Complex, Browser, Ajax, BeforeSendEventArgs, getUniqueID, closest, remove } from '@syncfusion/ej2-base';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { updateBlazorTemplate, resetBlazorTemplate, isBlazor, select, selectAll } from '@syncfusion/ej2-base';
import {DropEffect,ActionCompleteEventArgs,RenderingEventArgs,BeforeUploadEventArgs,FileListRenderingEventArgs,SelectedEventArgs,UploadingEventArgs,RemovingEventArgs,BeforeRemoveEventArgs,ClearingEventArgs,CancelEventArgs,PauseResumeEventArgs} from "./uploader";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FilesProp
 */
export interface FilesPropModel {

    /**
     * Specifies the name of the file
     *
     * @default ''
     */
    name?: string;

    /**
     * Specifies the size of the file
     *
     * @default null
     */
    size?: number;

    /**
     * Specifies the type of the file
     *
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
     *
     * @default 'Browse...'
     */
    browse?: string | HTMLElement;

    /**
     * Specifies the text or html content to upload button
     *
     * @default 'Upload'
     */
    upload?: string | HTMLElement;

    /**
     * Specifies the text or html content to clear button
     *
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
     *
     * @default ''
     */
    saveUrl?: string;

    /**
     * Specifies the URL of remove action that receives the file information and handle the remove operation in server.
     * The remove action type must be POST request and define “removeFileNames” attribute to get file information that will be removed.
     * This property is optional.
     *
     * @default ''
     */
    removeUrl?: string;

    /**
     * Specifies the chunk size to split the large file into chunks, and upload it to the server in a sequential order.
     * If the chunk size property has value, the uploader enables the chunk upload by default.
     * It must be specified in bytes value.
     *
     * > For more information, refer to the [chunk upload](../../uploader/chunk-upload/) section from the documentation.
     *
     * @default 0
     */
    chunkSize?: number;

    /**
     * Specifies the number of retries that the uploader can perform on the file failed to upload.
     * By default, the uploader set 3 as maximum retries. This property must be specified to prevent infinity looping.
     *
     * @default 3
     */
    retryCount?: number;

    /**
     * Specifies the delay time in milliseconds that the automatic retry happens after the delay.
     *
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
     *
     * @default { saveUrl: '', removeUrl: '' }
     */
    asyncSettings?: AsyncSettingsModel;

    /**
     * By default, the file uploader component is processing the multiple files simultaneously.
     * If sequentialUpload property is enabled, the file upload component performs the upload one after the other.
     *
     * @default false
     */
    sequentialUpload?: boolean;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='uploader/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Specifies the CSS class name that can be appended with root element of the uploader.
     * One or more custom CSS classes can be added to a uploader.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies Boolean value that indicates whether the component is enabled or disabled.
     * The uploader component does not allow to interact when this property is disabled.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies the HTML string that used to customize the content of each file in the list.
     *
     * > For more information, refer to the [template](../../uploader/template/) section from the documentation.
     *
     * @default null
     */
    template?: string;

    /**
     * Specifies a Boolean value that indicates whether the multiple files can be browsed or
     * dropped simultaneously in the uploader component.
     *
     * @default true
     */
    multiple?: boolean;

    /**
     * By default, the uploader component initiates automatic upload when the files are added in upload queue.
     * If you want to manipulate the files before uploading to server, disable the autoUpload property.
     * The buttons “upload” and “clear” will be hided from file list when autoUpload property is true.
     *
     * @default true
     */
    autoUpload?: boolean;

    /**
     * You can customize the default text of “browse, clear, and upload” buttons with plain text or HTML elements.
     * The buttons’ text can be customized from localization also. If you configured both locale and buttons property,
     * the uploader component considers the buttons property value.
     * {% codeBlock src='uploader/buttons/index.md' %}{% endcodeBlock %}
     *
     * @default { browse : 'Browse...', clear: 'Clear', upload: 'Upload' }
     */
    buttons?: ButtonsPropsModel;

    /**
     * Specifies the extensions of the file types allowed in the uploader component and pass the extensions
     * with comma separators. For example,
     * if you want to upload specific image files,  pass allowedExtensions as “.jpg,.png”.
     *
     * @default ''
     */
    allowedExtensions?: string;

    /**
     * Specifies the minimum file size to be uploaded in bytes.
     * The property used to make sure that you cannot upload empty files and small files.
     *
     * @default 0
     */
    minFileSize?: number;

    /**
     * Specifies the maximum allowed file size to be uploaded in bytes.
     * The property used to make sure that you cannot upload too large files.
     *
     * @default 30000000
     */
    maxFileSize?: number;

    /**
     * Specifies the drop target to handle the drag-and-drop upload.
     * By default, the component creates wrapper around file input that will act as drop target.
     *
     * > For more information, refer to the [drag-and-drop](../../uploader/file-source/#drag-and-drop) section from the documentation.
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
     * {% codeBlock src='uploader/files/index.md' %}{% endcodeBlock %}
     *
     * @default { name: '', size: null, type: '' }
     */
    files?: FilesPropModel[];

    /**
     * Specifies a Boolean value that indicates whether the default file list can be rendered.
     * The property used to prevent default file list and design own template for file list.
     *
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
     * Specifies the drag operation effect to the uploader component. Possible values are Copy , Move, Link and None.
     *
     * By default, the uploader component works based on the browser drag operation effect.
     *
     * @default 'Default'
     */
    dropEffect?: DropEffect;

    /**
     * Triggers when the component is created.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers after all the selected files has processed to upload successfully or failed to server.
     *
     * @event actionComplete
     * @blazorProperty 'OnActionComplete'
     */
    actionComplete?: EmitType<ActionCompleteEventArgs>;

    /**
     * DEPRECATED-Triggers before rendering each file item from the file list in a page.
     * It helps to customize specific file item structure.
     *
     * @event rendering
     */
    rendering?: EmitType<RenderingEventArgs>;

    /**
     * Triggers when the upload process before. This event is used to add additional parameter with upload request.
     *
     * @event beforeUpload
     * @blazorProperty 'BeforeUpload'
     */
    beforeUpload?: EmitType<BeforeUploadEventArgs>;

    /**
     * Triggers before rendering each file item from the file list in a page.
     * It helps to customize specific file item structure.
     *
     * @event fileListRendering
     * @blazorProperty 'OnFileListRender'
     */
    fileListRendering?: EmitType<FileListRenderingEventArgs>;

    /**
     * Triggers after selecting or dropping the files by adding the files in upload queue.
     *
     * @event selected
     * @blazorProperty 'FileSelected'
     */
    selected?: EmitType<SelectedEventArgs>;

    /**
     * Triggers when the upload process gets started. This event is used to add additional parameter with upload request.
     *
     * @event uploading
     * @blazorProperty 'OnUploadStart'
     */
    uploading?: EmitType<UploadingEventArgs>;

    /**
     * Triggers when the AJAX request gets success on uploading files or removing files.
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Event arguments<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * event<br/></td><td colSpan=1 rowSpan=1>
     * Ajax progress event arguments.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * file<br/></td><td colSpan=1 rowSpan=1>
     * File information which is uploaded/removed.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * name<br/></td><td colSpan=1 rowSpan=1>
     * Name of the event<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * operation<br/></td><td colSpan=1 rowSpan=1>
     * It indicates the success of the operation whether its uploaded or removed<br/></td></tr>
     * </table>
     *
     * @event success
     * @blazorProperty 'Success'
     * @blazorType SuccessEventArgs
     */
    success?: EmitType<Object>;

    /**
     * Triggers when the AJAX request fails on uploading or removing files.
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Event arguments<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * event<br/></td><td colSpan=1 rowSpan=1>
     * Ajax progress event arguments.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * file<br/></td><td colSpan=1 rowSpan=1>
     * File information which is failed from upload/remove.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * name<br/></td><td colSpan=1 rowSpan=1>
     * Name of the event<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * operation<br/></td><td colSpan=1 rowSpan=1>
     * It indicates the failure of the operation whether its upload or remove<br/></td></tr>
     * </table>
     *
     * @event failure
     * @blazorProperty 'OnFailured'
     * @blazorType FailureEventArgs
     */
    failure?: EmitType<Object>;

    /**
     * Triggers on removing the uploaded file. The event used to get confirm before removing the file from server.
     *
     * @event removing
     * @blazorProperty 'OnRemove'
     */
    removing?: EmitType<RemovingEventArgs>;

    /**
     * Triggers on remove the uploaded file. The event used to get confirm before remove the file from server.
     *
     * @event beforeRemove
     * @blazorProperty 'BeforeRemove'
     */
    beforeRemove?: EmitType<BeforeRemoveEventArgs>;

    /**
     * Triggers before clearing the items in file list when clicking “clear”.
     *
     * @event clearing
     * @blazorProperty 'OnClear'
     */
    clearing?: EmitType<ClearingEventArgs>;

    /**
     * Triggers when uploading a file to the server using the AJAX request.
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Event arguments<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * event<br/></td><td colSpan=1 rowSpan=1>
     * Ajax progress event arguments.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * file<br/></td><td colSpan=1 rowSpan=1>
     * File information which is uploading to server.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * name<br/></td><td colSpan=1 rowSpan=1>
     * Name of the event<br/></td></tr>
     * </table>
     *
     * @event progress
     * @blazorProperty 'Progressing'
     * @blazorType ProgressEventArgs
     */
    progress?: EmitType<Object>;

    /**
     * Triggers when changes occur in uploaded file list by selecting or dropping files.
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Event arguments<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * file<br/></td><td colSpan=1 rowSpan=1>
     * File information which is successfully uploaded to server or removed in server.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * name<br/></td><td colSpan=1 rowSpan=1>
     * Name of the event<br/></td></tr>
     * </table>
     *
     * @event change
     * @blazorProperty 'ValueChange'
     * @blazorType UploadChangeEventArgs
     */
    change?: EmitType<Object>;

    /**
     * Fires when the chunk file uploaded successfully.
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Event arguments<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * chunkIndex<br/></td><td colSpan=1 rowSpan=1>
     * Returns current chunk index.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * chunkSize<br/></td><td colSpan=1 rowSpan=1>
     * Returns the size of the chunk file.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * file<br/></td><td colSpan=1 rowSpan=1>
     * File information which is uploading to server.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * name<br/></td><td colSpan=1 rowSpan=1>
     * Name of the event<br/></td></tr>
     * </table>
     *
     * @event chunkSuccess
     * @blazorProperty 'OnChunkSuccess'
     * @blazorType SuccessEventArgs
     */
    chunkSuccess?: EmitType<Object>;

    /**
     * Fires if the chunk file failed to upload.
     *
     * <table>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * Event arguments<br/></td><td colSpan=1 rowSpan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * chunkIndex<br/></td><td colSpan=1 rowSpan=1>
     * Returns current chunk index.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * chunkSize<br/></td><td colSpan=1 rowSpan=1>
     * Returns the size of the chunk file.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * file<br/></td><td colSpan=1 rowSpan=1>
     * File information which is uploading to server.<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * name<br/></td><td colSpan=1 rowSpan=1>
     * Name of the event<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * totalChunk<br/></td><td colSpan=1 rowSpan=1>
     * Returns the total chunk count<br/></td></tr>
     * <tr>
     * <td colSpan=1 rowSpan=1>
     * cancel<br/></td><td colSpan=1 rowSpan=1>
     * Prevent triggering of failure event when we pass true to this attribute<br/></td></tr>
     * </table>
     *
     * @event chunkFailure
     * @blazorProperty 'OnChunkFailured'
     * @blazorType FailureEventArgs
     */
    chunkFailure?: EmitType<Object>;

    /**
     * Fires when every chunk upload process gets started. This event is used to add additional parameter with upload request.
     *
     * @event chunkUploading
     * @blazorProperty 'OnChunkUploadStart'
     */
    chunkUploading?: EmitType<UploadingEventArgs>;

    /**
     * Fires if cancel the chunk file uploading.
     *
     * @event canceling
     * @blazorProperty 'OnCancel'
     */
    canceling?: EmitType<CancelEventArgs>;

    /**
     * Fires if pause the chunk file uploading.
     *
     * @event pausing
     * @blazorProperty 'Paused'
     */
    pausing?: EmitType<PauseResumeEventArgs>;

    /**
     * Fires if resume the paused chunk file upload.
     *
     * @event resuming
     * @blazorProperty 'OnResume'
     */
    resuming?: EmitType<PauseResumeEventArgs>;

}