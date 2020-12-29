import { Component, Property, Event, EmitType, EventHandler, classList, L10n, compile, isNullOrUndefined} from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, detach, append, Animation } from '@syncfusion/ej2-base';
import { addClass, removeClass, KeyboardEvents, KeyboardEventArgs, setValue, getValue, ChildProperty } from '@syncfusion/ej2-base';
import { Collection, Complex, Browser, Ajax, BeforeSendEventArgs, getUniqueID, closest, remove } from '@syncfusion/ej2-base';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { UploaderModel, AsyncSettingsModel, ButtonsPropsModel, FilesPropModel } from './uploader-model';
import { updateBlazorTemplate, resetBlazorTemplate, isBlazor, select, selectAll } from '@syncfusion/ej2-base';

const ROOT: string =  'e-uploader';
const CONTROL_WRAPPER: string = 'e-upload e-control-wrapper';
const INPUT_WRAPPER: string = 'e-file-select';
const DROP_AREA: string = 'e-file-drop';
const DROP_WRAPPER: string = 'e-file-select-wrap';
const LIST_PARENT: string = 'e-upload-files';
const FILE: string = 'e-upload-file-list';
const STATUS: string = 'e-file-status';
const ACTION_BUTTONS: string = 'e-upload-actions';
const UPLOAD_BUTTONS: string = 'e-file-upload-btn e-css e-btn e-flat e-primary';
const CLEAR_BUTTONS: string = 'e-file-clear-btn e-css e-btn e-flat';
const FILE_NAME: string = 'e-file-name';
const FILE_TYPE: string = 'e-file-type';
const FILE_SIZE: string = 'e-file-size';
const REMOVE_ICON: string = 'e-file-remove-btn';
const DELETE_ICON: string = 'e-file-delete-btn';
const SPINNER_PANE: string = 'e-spinner-pane';
const ABORT_ICON: string = 'e-file-abort-btn';
const RETRY_ICON: string = 'e-file-reload-btn';
const DRAG_HOVER: string = 'e-upload-drag-hover';
const PROGRESS_WRAPPER: string = 'e-upload-progress-wrap';
const PROGRESSBAR: string = 'e-upload-progress-bar';
const PROGRESSBAR_TEXT: string = 'e-progress-bar-text';
const UPLOAD_INPROGRESS: string = 'e-upload-progress';
const UPLOAD_SUCCESS: string = 'e-upload-success';
const UPLOAD_FAILED: string = 'e-upload-fails';
const TEXT_CONTAINER: string = 'e-file-container';
const VALIDATION_FAILS: string = 'e-validation-fails';
const RTL: string = 'e-rtl';
const DISABLED : string = 'e-disabled';
const RTL_CONTAINER : string = 'e-rtl-container';
const ICON_FOCUSED : string = 'e-clear-icon-focus';
const PROGRESS_INNER_WRAPPER: string = 'e-progress-inner-wrap';
const PAUSE_UPLOAD: string = 'e-file-pause-btn';
const RESUME_UPLOAD: string = 'e-file-play-btn';
const RESTRICT_RETRY: string = 'e-restrict-retry';
const wrapperAttr: string[] = ['title', 'style', 'class'];
const FORM_UPLOAD: string = 'e-form-upload';
const HIDDEN_INPUT: string = 'e-hidden-file-input';
const INVALID_FILE: string = 'e-file-invalid';
const INFORMATION: string = 'e-file-information';

export type DropEffect = 'Copy' | 'Move' | 'Link' | 'None'| 'Default';
export class FilesProp extends ChildProperty<FilesProp> {
    /**
     * Specifies the name of the file
     * @default ''
     */
    @Property('')
    public name: string;
    /**
     * Specifies the size of the file
     * @default null
     */
    @Property(null)
    public size: number;
    /**
     * Specifies the type of the file
     * @default ''
     */
    @Property('')
    public type: string;
}

export class ButtonsProps extends ChildProperty<ButtonsProps> {
    /**
     * Specifies the text or html content to browse button
     * @default 'Browse...'
     */
    @Property('Browse...')
    public browse: string | HTMLElement;
    /**
     * Specifies the text or html content to upload button
     * @default 'Upload'
     */
    @Property('Upload')
    public upload: string | HTMLElement;
    /**
     * Specifies the text or html content to clear button
     * @default 'Clear'
     */
    @Property('Clear')
    public clear: string | HTMLElement;
}

export class AsyncSettings  extends ChildProperty<AsyncSettings> {
    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     * The save action type must be POST request and define the argument as same input name used to render the component.
     * The upload operations could not perform without this property.
     * @default ''
     */
    @Property('')
    public saveUrl: string;
    /**
     * Specifies the URL of remove action that receives the file information and handle the remove operation in server.
     * The remove action type must be POST request and define “removeFileNames” attribute to get file information that will be removed.
     * This property is optional.
     * @default ''
     */
    @Property('')
    public removeUrl: string;
    /**
     * Specifies the chunk size to split the large file into chunks, and upload it to the server in a sequential order.
     * If the chunk size property has value, the uploader enables the chunk upload by default.
     * It must be specified in bytes value.
     * 
     * > For more information, refer to the [chunk upload](../../uploader/chunk-upload/) section from the documentation.
     * 
     * @default 0
     */
    @Property(0)
    public chunkSize: number;
    /**
     * Specifies the number of retries that the uploader can perform on the file failed to upload.
     * By default, the uploader set 3 as maximum retries. This property must be specified to prevent infinity looping.
     * @default 3
     */
    @Property(3)
    public retryCount: number;
    /**
     * Specifies the delay time in milliseconds that the automatic retry happens after the delay.
     * @default 500
     */
    @Property(500)
    public retryAfterDelay: number;
}

export interface FileInfo {
    /**
     * Returns the upload file name.
     */
    name: string;
    /**
     * Returns the details about upload file.
     * @blazorType object
     */
    rawFile: string | Blob;
    /**
     * Returns the size of file in bytes.
     */
    size: number;
    /**
     * Returns the status of the file.
     */
    status: string;
    /**
     * Returns the MIME type of file as a string. Returns empty string if the file’s type is not determined.
     */
    type: string;
    /**
     * Returns the list of validation errors (if any).
     */
    validationMessages: ValidationMessages;
    /**
     * Returns the current state of the file such as Failed, Canceled, Selected, Uploaded, or Uploading.
     */
    statusCode: string;
    /**
     * Returns where the file selected from, to upload.
     */
    fileSource?: string;
    /**
     * Returns the respective file list item.
     */
    list ?: HTMLElement;
    /**
     * Returns the input element mapped with file list item.
     */
    input ?: HTMLInputElement;
    /**
     * Returns the unique upload file name ID.
     */
    id?: string;
}

export interface MetaData {
    chunkIndex: number;
    blob: Blob | string;
    file: FileInfo;
    start: number;
    end: number;
    retryCount: number;
    request: Ajax;
}

export interface ValidationMessages {
    /**
     * Returns the minimum file size validation message, if selected file size is less than specified minFileSize property.
     */
    minSize? : string;
    /**
     * Returns the maximum file size validation message, if selected file size is less than specified maxFileSize property.
     */
    maxSize? : string;
}

export interface SelectedEventArgs {
    /**
     * Returns the original event arguments.
     */
    event: MouseEvent | TouchEvent | DragEvent | ClipboardEvent;
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Returns the list of selected files.
     */
    filesData: FileInfo[];
    /**
     * Determines whether the file list generates based on the modified data.
     */
    isModified: boolean;
    /**
     * Specifies the modified files data to generate the file items. The argument depends on `isModified` argument.
     */
    modifiedFilesData: FileInfo[];
    /**
     * Specifies the step value to the progress bar.
     */
    progressInterval: string;
    /**
     * Specifies whether the file selection has been canceled
     */
    isCanceled?: boolean;
    /**
     * Set the current request header to the XMLHttpRequest instance.
     * @blazorType object
     */
    currentRequest?: { [key: string]: string }[];
    /**
     * Defines the additional data in key and value pair format that will be submitted to the upload action.
     */
    customFormData: { [key: string]: Object }[];
}

export interface BeforeRemoveEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Defines the additional data with key and value pair format that will be submitted to the remove action.
     * @blazorType object
     */
    customFormData: { [key: string]: Object }[];
    /**
     * Returns the XMLHttpRequest instance that is associated with remove action.
     * @blazorType object
     */
    currentRequest?: { [key: string]: string }[];
}

export interface RemovingEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Defines the additional data with key and value pair format that will be submitted to the remove action.
     * @blazorType object
     */
    customFormData: { [key: string]: Object }[];
    /**
     * Returns the original event arguments.
     */
    event: MouseEvent | TouchEvent | KeyboardEventArgs;
    /**
     * Returns the list of files’ details that will be removed.
     */
    filesData: FileInfo[];
    /**
     * Returns the XMLHttpRequest instance that is associated with remove action.
     * @blazorType object
     */
    currentRequest?: XMLHttpRequest;
    /**
     * Defines whether the selected raw file send to server remove action.
     * Set true to send raw file.
     * Set false to send file name only.
     */
    postRawFile?: boolean;
}

export interface ClearingEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Returns the list of files that will be cleared from the FileList.
     */
    filesData: FileInfo[];
}

export interface BeforeUploadEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Defines the additional data in key and value pair format that will be submitted to the upload action.
     * @blazorType object
     */
    customFormData: { [key: string]: Object }[];
    /**
     * Returns the XMLHttpRequest instance that is associated with upload action.
     * @blazorType object
     */
    currentRequest?: { [key: string]: string }[];
}

export interface UploadingEventArgs {
    /**
     * Returns the list of files that will be uploaded.
     */
    fileData: FileInfo;
    /**
     * Defines the additional data in key and value pair format that will be submitted to the upload action.
     * @deprecated
     */
    customFormData: { [key: string]: Object }[];
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Returns the chunk size in bytes if the chunk upload is enabled. 
     */
    chunkSize?: number;
    /**
     * Returns the index of current chunk if the chunk upload is enabled. 
     */
    currentChunkIndex?: number;
    /**
     * Returns the XMLHttpRequest instance that is associated with upload action.
     * @deprecated
     */
    currentRequest?: XMLHttpRequest;
}

export interface ProgressEventArgs {
    /**
     * Returns the original event arguments.
     */
    e?: object;
    /**
     * Returns the details about upload file.
     */
    file?: FileInfo;
    /**
     * Returns the upload event operation.
     */
    operation?: string;
}

export interface UploadChangeEventArgs {
    /**
     * Returns the list of files that will be cleared from the FileList.
     * @blazorType List<Syncfusion.Blazor.Inputs.Internal.UploadFiles>
     */
    files?: FileInfo[];
}
/* tslint:disable */
export interface FailureEventArgs extends SuccessEventArgs { }
/* tslint:enable */
export interface SuccessEventArgs {
    /**
     * Returns the original event arguments.
     */
    e?: object;
    /**
     * Returns the details about upload file.
     */
    file?: FileInfo;
    /**
     * Returns the upload status.
     */
    statusText?: string;
    /**
     * Returns the upload event operation.
     */
    operation: string;
    /**
     * Returns the upload event operation.
     */
    response?: ResponseEventArgs;
    /**
     * Returns the upload chunk index.
     */
    chunkIndex?: number;
    /**
     * Returns the upload chunk size.
     */
    chunkSize?: number;
    /**
     * Returns the total chunk size.
     */
    totalChunk?: number;
    /**
     * Returns the original event arguments.
     */
    event?: object;
}

export interface ResponseEventArgs {
    headers?: string;
    readyState?: object;
    statusCode?: object;
    statusText?: string;
    withCredentials?: boolean;
}

export interface CancelEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean;
    /**
     * Returns the original event arguments.
     */
    event: ProgressEventInit;
    /**
     * Returns the file details that will be canceled.
     */
    fileData: FileInfo;
    /**
     * Defines the additional data in key and value pair format that will be submitted when the upload action is canceled.
     * @blazorType object
     */
    customFormData: { [key: string]: Object }[];
}

export interface PauseResumeEventArgs {
    /**
     * Returns the original event arguments.
     */
    event: Event;
    /**
     * Returns the file data that is Paused or Resumed.
     */
    file: FileInfo;
    /**
     * Returns the total number of chunks.
     */
    chunkCount: number;
    /**
     * Returns the index of chunk that is Paused or Resumed.
     */
    chunkIndex: number;
    /**
     * Returns the chunk size value in bytes.
     */
    chunkSize: number;
}

export interface ActionCompleteEventArgs {
    /**
     * Return the selected file details.
     */
    fileData: FileInfo[];
}

export interface RenderingEventArgs {
    /**
     * Return the current file item element.
     */
    element: HTMLElement;
    /**
     * Return the current rendering file item data as File object.
     */
    fileInfo: FileInfo;
    /**
     * Return the index of the file item in the file list.
     */
    index: number;
    /**
     * Return whether the file is preloaded
     */
    isPreload: boolean;
}

export interface FileListRenderingEventArgs {
    /**
     * Return the current file item element.
     */
    element: HTMLElement;
    /**
     * Return the current rendering file item data as File object.
     */
    fileInfo: FileInfo;
    /**
     * Return the index of the file item in the file list.
     */
    index: number;
    /**
     * Return whether the file is preloaded
     */
    isPreload: boolean;
}

interface InitialAttr {
    accept: string;
    multiple: boolean;
    disabled: boolean;
}

/**
 * The uploader component allows to upload images, documents, and other files from local to server.
 * ```html
 * <input type='file' name='images[]' id='upload'/>
 * ```
 * ```typescript
 * <script>
 *   var uploadObj = new Uploader();
 *   uploadObj.appendTo('#upload');
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class Uploader extends Component<HTMLInputElement> implements INotifyPropertyChanged {
    private initialAttr: InitialAttr = { accept: null, multiple: false, disabled: false };
    private uploadWrapper: HTMLElement;
    private browseButton: HTMLElement;
    private listParent: HTMLElement;
    private sortFilesList: FileList;
    private actionButtons: HTMLElement;
    private uploadButton: HTMLElement;
    private clearButton: HTMLElement;
    private pauseButton: HTMLElement;
    private formElement: HTMLElement;
    private dropAreaWrapper: HTMLElement;
    // tslint:disable-next-line
    private filesEntries: any[];
    private uploadedFilesData: FileInfo[] = [];
    private base64String: string[] = [];
    private currentRequestHeader: { [key: string]: string }[];
    private customFormDatas: { [key: string]: object }[];
    private dropZoneElement: HTMLElement;
    private l10n: L10n;
    private preLocaleObj: { [key: string]: Object };
    private uploadTemplateFn: Function;
    private keyboardModule: KeyboardEvents;
    private progressInterval: string;
    private progressAnimation: Animation;
    private isForm: boolean = false;
    private allTypes: boolean = false;
    private keyConfigs: { [key: string]: string };
    private localeText: { [key: string]: Object };
    private pausedData: MetaData[] = [];
    private uploadMetaData: MetaData[] = [];
    private tabIndex: string = '0';
    private btnTabIndex: string = '0';
    private disableKeyboardNavigation: boolean = false;
    private count: number = -1;
    private actionCompleteCount: number = 0;
    private flag: boolean = true;
    private selectedFiles: FileInfo[] = [];
    private browserName: string;
    private uploaderOptions: UploaderModel;
    private uploaderName: string = 'UploadFiles';
    private isServerBlazor: boolean;
    private isBlazorSaveUrl: boolean;
    private isBlazorTemplate: boolean;
    private fileStreams: FileInfo[] = [];
    private newFileRef: number = 0;
    private isFirstFileOnSelection: boolean = false;
    /**
     * Get the file item(li) which are shown in file list.
     * @private
     */
    public fileList: HTMLElement[] = [];
    /**
     * Get the data of files which are shown in file list.
     * @private
     */
    public filesData: FileInfo[] = [];
    /**
     * Configures the save and remove URL to perform the upload operations in the server asynchronously.
     * @default { saveUrl: '', removeUrl: '' }
     */
    @Complex<AsyncSettingsModel>({ saveUrl: '', removeUrl: '' }, AsyncSettings)
    public asyncSettings: AsyncSettingsModel;

    /**
     * By default, the file uploader component is processing the multiple files simultaneously.
     * If sequentialUpload property is enabled, the file upload component performs the upload one after the other.
     * @default false
     */
    @Property(false)
    public sequentialUpload: boolean;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='uploader/htmlAttributes/index.md' %}{% endcodeBlock %}
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * Specifies the CSS class name that can be appended with root element of the uploader.
     * One or more custom CSS classes can be added to a uploader.
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Specifies Boolean value that indicates whether the component is enabled or disabled.
     * The uploader component does not allow to interact when this property is disabled.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies the HTML string that used to customize the content of each file in the list.
     * 
     * > For more information, refer to the [template](../../uploader/template/) section from the documentation.
     * 
     * @default null
     */
    @Property(null)
    public template: string;

    /**
     * Specifies a Boolean value that indicates whether the multiple files can be browsed or
     * dropped simultaneously in the uploader component.
     * @default true
     */
    @Property(true)
    public multiple: boolean;

    /**
     * By default, the uploader component initiates automatic upload when the files are added in upload queue.
     * If you want to manipulate the files before uploading to server, disable the autoUpload property.
     * The buttons “upload” and “clear” will be hided from file list when autoUpload property is true.
     * @default true
     */
    @Property(true)
    public autoUpload: boolean;

    /**
     * You can customize the default text of “browse, clear, and upload” buttons with plain text or HTML elements.
     * The buttons’ text can be customized from localization also. If you configured both locale and buttons property,
     * the uploader component considers the buttons property value.
     * {% codeBlock src='uploader/buttons/index.md' %}{% endcodeBlock %}
     * @default { browse : 'Browse...', clear: 'Clear', upload: 'Upload' }
     */
    @Complex<ButtonsPropsModel>({}, ButtonsProps)
    public buttons: ButtonsPropsModel;

    /**
     * Specifies the extensions of the file types allowed in the uploader component and pass the extensions
     * with comma separators. For example,
     * if you want to upload specific image files,  pass allowedExtensions as “.jpg,.png”.
     * @default ''
     */
    @Property('')
    public allowedExtensions: string;

    /**
     * Specifies the minimum file size to be uploaded in bytes.
     * The property used to make sure that you cannot upload empty files and small files.
     * @default 0
     */
    @Property(0)
    public minFileSize: number;

    /**
     * Specifies the maximum allowed file size to be uploaded in bytes.
     * The property used to make sure that you cannot upload too large files.
     * @default 30000000
     */
    @Property(30000000)
    public maxFileSize: number;

    /**
     * Specifies the drop target to handle the drag-and-drop upload.
     * By default, the component creates wrapper around file input that will act as drop target.
     * 
     * > For more information, refer to the [drag-and-drop](../../uploader/file-source/#drag-and-drop) section from the documentation.
     * 
     * @default null
     */
    @Property(null)
    public dropArea: string | HTMLElement;

    /**
     * Specifies the list of files that will be preloaded on rendering of uploader component.
     * The property used to view and remove the uploaded files from server. By default, the files are configured with
     * uploaded successfully state. The following properties are mandatory to configure the preload files:
     * * Name
     * * Size
     * * Type
     * 
     * {% codeBlock src='uploader/files/index.md' %}{% endcodeBlock %}
     * @default { name: '', size: null, type: '' }
     */
    @Collection<FilesPropModel>([{}], FilesProp)
    public files: FilesPropModel[];

    /**
     * Specifies a Boolean value that indicates whether the default file list can be rendered.
     * The property used to prevent default file list and design own template for file list.
     * @default true
     */
    @Property(true)
    public showFileList: boolean;

    /**
     * Specifies a Boolean value that indicates whether the folder of files can be browsed in the uploader component.
     * 
     * > When enabled this property, it allows only files of folder to select or drop to upload and
     * it cannot be allowed to select or drop files.
     * 
     * @default false
     */
    @Property(false)
    public directoryUpload: boolean;

    /**
     * Specifies the drag operation effect to the uploader component. Possible values are Copy , Move, Link and None.
     * 
     * By default, the uploader component works based on the browser drag operation effect.
     * 
     * @default 'Default'
     */
    @Property('Default')
    public dropEffect: DropEffect;

    /**
     * Triggers when the component is created.
     * @event
     * @blazorProperty 'Created' 
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers after all the selected files has processed to upload successfully or failed to server.
     * @event 
     * @blazorProperty 'OnActionComplete'
     */
    @Event()
    public actionComplete: EmitType<ActionCompleteEventArgs>;

    /**
     * DEPRECATED-Triggers before rendering each file item from the file list in a page.
     * It helps to customize specific file item structure.
     * @event
     */
    @Event()
    public rendering: EmitType<RenderingEventArgs>;

    /**
     * Triggers when the upload process before. This event is used to add additional parameter with upload request.
     * @event
     * @blazorProperty 'BeforeUpload'
     */
    @Event()
    public beforeUpload: EmitType<BeforeUploadEventArgs>;

    /**
     * Triggers before rendering each file item from the file list in a page.
     * It helps to customize specific file item structure.
     * @event
     * @blazorProperty 'OnFileListRender'
     */
    @Event()
    public fileListRendering: EmitType<FileListRenderingEventArgs>;

    /**
     * Triggers after selecting or dropping the files by adding the files in upload queue.
     * @event
     * @blazorProperty 'FileSelected'
     */
    @Event()
    public selected: EmitType<SelectedEventArgs>;

    /**
     * Triggers when the upload process gets started. This event is used to add additional parameter with upload request.
     * @event
     * @blazorProperty 'OnUploadStart'
     */
    @Event()
    public uploading: EmitType<UploadingEventArgs>;

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
     * @event
     * @blazorProperty 'Success'
     * @blazorType SuccessEventArgs
     */
    @Event()
    public success: EmitType<Object>;

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
     * @event
     * @blazorProperty 'OnFailured'
     * @blazorType FailureEventArgs
     */
    @Event()
    public failure: EmitType<Object>;

    /**
     * Triggers on removing the uploaded file. The event used to get confirm before removing the file from server.
     * @event
     * @blazorProperty 'OnRemove'
     */
    @Event()
    public removing: EmitType<RemovingEventArgs>;

    /**
     * Triggers on remove the uploaded file. The event used to get confirm before remove the file from server.
     * @event
     * @blazorProperty 'BeforeRemove'
     */
    @Event()
    public beforeRemove: EmitType<BeforeRemoveEventArgs>;

    /**
     * Triggers before clearing the items in file list when clicking “clear”.
     * @event
     * @blazorProperty 'OnClear'
     */
    @Event()
    public clearing: EmitType<ClearingEventArgs>;

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
     * @event
     * @blazorProperty 'Progressing'
     * @blazorType ProgressEventArgs
     */
    @Event()
    public progress: EmitType<Object>;

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
     * @event
     * @blazorProperty 'ValueChange'
     * @blazorType UploadChangeEventArgs
     */
    @Event()
    public change: EmitType<Object>;

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
     * @event
     * @blazorProperty 'OnChunkSuccess'
     * @blazorType SuccessEventArgs
     */
    @Event()
    public chunkSuccess: EmitType<Object>;

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
     * @event
     * @blazorProperty 'OnChunkFailured'
     * @blazorType FailureEventArgs
     */
    @Event()
    public chunkFailure: EmitType<Object>;

    /**
     * Fires when every chunk upload process gets started. This event is used to add additional parameter with upload request.
     * @event
     * @blazorProperty 'OnChunkUploadStart'
     */
    @Event()
    public chunkUploading: EmitType<UploadingEventArgs>;

    /**
     * Fires if cancel the chunk file uploading.
     * @event
     * @blazorProperty 'OnCancel'
     */
    @Event()
    public canceling: EmitType<CancelEventArgs>;

    /**
     * Fires if pause the chunk file uploading.
     * @event
     * @blazorProperty 'Paused'
     */
    @Event()
    public pausing: EmitType<PauseResumeEventArgs>;

    /**
     * Fires if resume the paused chunk file upload.
     * @event
     * @blazorProperty 'OnResume'
     */
    @Event()
    public resuming: EmitType<PauseResumeEventArgs>;
    /**
     * Triggers when change the Uploader value.
     */
    constructor(options?: UploaderModel, element?: string | HTMLInputElement) {
        super(options, element);
        this.uploaderOptions = options;
    }

    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    public onPropertyChanged(newProp: UploaderModel, oldProp: UploaderModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'allowedExtensions':
                    this.setExtensions(this.allowedExtensions);
                    this.clearAll();
                    break;
                case 'enabled':
                    this.setControlStatus();
                    break;
                case 'multiple':
                    this.setMultipleSelection();
                    break;
                case 'enableRtl':
                    this.setRTL();
                    this.reRenderFileList();
                    break;
                case 'buttons':
                    this.buttons.browse = isNullOrUndefined(this.buttons.browse) ? '' : this.buttons.browse;
                    this.buttons.clear = isNullOrUndefined(this.buttons.clear) ? '' : this.buttons.clear;
                    this.buttons.upload = isNullOrUndefined(this.buttons.upload) ? '' : this.buttons.upload;
                    this.renderButtonTemplates();
                    break;
                case 'dropArea':
                    this.unBindDropEvents();
                    this.updateDropArea();
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    this.checkHTMLAttributes(true);
                    break;
                case 'files':
                    this.renderPreLoadFiles();
                    break;
                case 'directoryUpload':
                    this.updateDirectoryAttributes();
                    break;
                case 'template':
                    if (!this.isServerBlazor) {
                        this.clearAll();
                    }
                    break;
                case 'minFileSize':
                case 'maxFileSize':
                case 'autoUpload':
                    this.clearAll();
                    break;
                case 'sequentialUpload':
                    this.clearAll();
                    break;
                case 'locale':
                    this.l10n.setLocale(this.locale);
                    this.setLocalizedTexts();
                    this.preLocaleObj = getValue('currentLocale', this.l10n);
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
            }
        }
    }

    private setLocalizedTexts() : void {
        if (isNullOrUndefined(this.template)) {
            if (typeof (this.buttons.browse) === 'string') {
                this.browseButton.innerText = (this.buttons.browse === 'Browse...') ?
                this.localizedTexts('Browse') : this.buttons.browse;
                this.browseButton.setAttribute('title', this.browseButton.innerText);
                if (this.uploadWrapper && !isNullOrUndefined(this.uploadWrapper.querySelector('.' + DROP_AREA))) {
                    this.uploadWrapper.querySelector('.' + DROP_AREA).innerHTML = this.localizedTexts('dropFilesHint');
                }
            }
            this.updateFileList();
        }
    }

    private getKeyValue(val : string): string {
        let keyValue: string;
        for (let key of Object.keys(this.preLocaleObj)) {
            if (this.preLocaleObj[key] === val) {
                keyValue = key;
            }
        }
        return keyValue;
    }

    private updateFileList () : void {
        let element : HTMLElement;
        /* istanbul ignore next */
        if (this.fileList.length > 0 && !isNullOrUndefined(this.uploadWrapper.querySelector('.' + LIST_PARENT ))) {
            for (let i: number = 0; i < this.fileList.length; i++) {
                element = this.fileList[i].querySelector('.e-file-status') as HTMLElement;
                element.innerHTML = this.localizedTexts(this.getKeyValue(this.filesData[i].status));
                this.filesData[i].status = this.localizedTexts(this.getKeyValue(this.filesData[i].status));
                if (this.fileList[i].classList.contains(UPLOAD_SUCCESS)) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('delete'));
                }
                if (this.fileList[i].querySelector('.e-file-play-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('resume'));
                }
                if (this.fileList[i].querySelector('.e-file-remove-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('remove'));
                }
                if (this.fileList[i].querySelector('.e-file-reload-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('retry'));
                }
                if (!this.autoUpload) {
                    this.uploadButton.innerText = (this.buttons.upload === 'Upload') ?
                    this.localizedTexts('Upload') : <string>this.buttons.upload;
                    this.uploadButton.setAttribute('title', this.localizedTexts('Upload'));
                    this.clearButton.innerText = (this.buttons.clear === 'Clear') ?
                    this.localizedTexts('Clear') : <string>this.buttons.clear;
                    this.clearButton.setAttribute('title', this.localizedTexts('Clear'));
                }
            }
        }
    }

    private reRenderFileList(): void {
        if (this.listParent) {
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createFileList(this.filesData);
            if (this.actionButtons) {
                this.removeActionButtons();
                this.renderActionButtons();
                this.checkActionButtonStatus();
            }
        }
    }

    protected preRender(): void {
        this.localeText = { Browse  : 'Browse...', Clear : 'Clear', Upload : 'Upload',
            dropFilesHint : 'Or drop files here', invalidMaxFileSize : 'File size is too large',
            invalidMinFileSize : 'File size is too small', invalidFileType: 'File type is not allowed',
            uploadFailedMessage : 'File failed to upload', uploadSuccessMessage : 'File uploaded successfully',
            removedSuccessMessage: 'File removed successfully', removedFailedMessage: 'Unable to remove file', inProgress: 'Uploading',
            readyToUploadMessage: 'Ready to upload', abort: 'Abort', remove: 'Remove', cancel: 'Cancel', delete: 'Delete file',
            pauseUpload: 'File upload paused', pause: 'Pause', resume: 'Resume', retry: 'Retry',
            fileUploadCancel: 'File upload canceled', invalidFileSelection: 'Invalid files selected', totalFiles: 'Total files',
            size: 'Size'
           };
        this.l10n = new L10n('uploader', this.localeText, this.locale);
        this.preLocaleObj = getValue('currentLocale', this.l10n);
        this.isServerBlazor =  (isBlazor() && this.isServerRendered) ? true : false;
        this.isBlazorTemplate = this.isServerBlazor && this.template !== '' && !isNullOrUndefined(this.template) ? true : false ;
        this.isBlazorSaveUrl = (this.isServerRendered &&
            (this.asyncSettings.saveUrl === '' || isNullOrUndefined(this.asyncSettings.saveUrl))) ? true : false;
        if (this.isBlazorSaveUrl && this.sequentialUpload) { this.sequentialUpload = false; }
        if (!this.isBlazorSaveUrl) { this.formRendered(); }
        if (!this.isServerBlazor) {
        this.updateHTMLAttrToElement();
        this.checkHTMLAttributes(false);
        // tslint:disable-next-line
        let ejInstance: any = getValue('ej2_instances', this.element);
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-UPLOADER') {
            let inputElement: HTMLInputElement = <HTMLInputElement>this.createElement('input', { attrs: { type: 'file' }});
            let index: number = 0;
            for (index; index < this.element.attributes.length; index++) {
                inputElement.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                inputElement.innerHTML = this.element.innerHTML;
            }
            if (!inputElement.hasAttribute('name')) {
                inputElement.setAttribute('name', 'UploadFiles');
            }
            this.element.appendChild(inputElement);
            this.element = inputElement;
            setValue('ej2_instances', ejInstance, this.element);
        }
        /* istanbul ignore next */
        if (ejInstance[0].isPureReactComponent) {
            if (!isNullOrUndefined(ejInstance[0].props.name)) {
                this.element.setAttribute('name', ejInstance[0].props.name);
            } else if (!isNullOrUndefined(ejInstance[0].props.id) && isNullOrUndefined(ejInstance[0].props.name)) {
                this.element.setAttribute('name', ejInstance[0].props.id);
            } else {
                this.element.setAttribute('name', 'UploadFiles');
            }
        }
        if (isNullOrUndefined(this.element.getAttribute('name'))) {
            this.element.setAttribute('name', this.element.getAttribute('id'));
        }
        if (!this.element.hasAttribute('type')) {
            this.element.setAttribute('type', 'file');
        }
        this.updateDirectoryAttributes();
    }
        this.keyConfigs = {
            enter: 'enter'
        };
        if (this.element.hasAttribute('tabindex')) {
            this.tabIndex = this.element.getAttribute('tabindex');
        }
        this.browserName = Browser.info.name;
        this.uploaderName = this.element.getAttribute('name');
    }

    private formRendered(): void {
        let parentEle: HTMLElement = closest(this.element, 'form') as HTMLElement;
        if (!isNullOrUndefined(parentEle)) {
            for (; parentEle && parentEle !== document.documentElement; parentEle = parentEle.parentElement) {
                if (parentEle.tagName === 'FORM') {
                    this.isForm = true;
                    this.formElement = parentEle;
                    parentEle.setAttribute('enctype', 'multipart/form-data');
                    parentEle.setAttribute('encoding', 'multipart/form-data');
                }
            }
        }
    }

    protected getPersistData(): string {
        return this.addOnPersist(['filesData']);
    }

    /**
     * Return the module name of the component.
     */
    public getModuleName(): string {
        return 'uploader';
    }

    private updateDirectoryAttributes(): void {
        if (this.directoryUpload) {
            this.element.setAttribute('directory', 'true');
            this.element.setAttribute('webkitdirectory', 'true');
        } else {
            this.element.removeAttribute('directory');
            this.element.removeAttribute('webkitdirectory');
        }
    }

    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        if (!this.isServerBlazor) {
            this.renderBrowseButton();
            this.initializeUpload();
            this.updateHTMLAttrToWrapper();
            this.wireEvents();
            this.setMultipleSelection();
            this.setExtensions(this.allowedExtensions);
            this.setRTL();
            this.renderPreLoadFiles();
            this.setControlStatus();
            this.setCSSClass();
        } else {
            this.dropAreaWrapper = closest(this.element, '.' + DROP_WRAPPER) as HTMLElement;
            this.uploadWrapper = closest(this.element, '.e-upload.e-control-wrapper') as HTMLElement;
            this.browseButton = this.dropAreaWrapper.querySelector('button.e-upload-browse-btn');
            this.setDropArea();
            this.renderPreLoadFiles();
            this.wireEvents();
        }
        if (this.isServerBlazor) {
            this.renderComplete();
        }
    }

    private renderBrowseButton(): void {
        this.browseButton = this.createElement('button', { className: 'e-css e-btn', attrs: {'type': 'button'}});
        this.browseButton.setAttribute('tabindex', this.tabIndex);
        if (typeof(this.buttons.browse) === 'string') {
            this.browseButton.textContent = (this.buttons.browse === 'Browse...') ?
            this.localizedTexts('Browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.innerText);
        } else {
            this.browseButton.appendChild(this.buttons.browse);
        }
        this.element.setAttribute('aria-label', 'Uploader');
    }

    private renderActionButtons(): void {
        this.element.setAttribute('tabindex', '-1');
        if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            this.actionButtons = this.createElement('div', { className: ACTION_BUTTONS });
            this.uploadButton = this.createElement('button', { className: UPLOAD_BUTTONS ,
                                                    attrs: {'type': 'button', 'tabindex': this.btnTabIndex }});
            this.clearButton = this.createElement('button', { className: CLEAR_BUTTONS,
                                                    attrs: {'type': 'button', 'tabindex': this.btnTabIndex }});
            this.actionButtons.appendChild(this.clearButton);
            this.actionButtons.appendChild(this.uploadButton);
            this.renderButtonTemplates();
            this.uploadWrapper.appendChild(this.actionButtons);
            this.browseButton.blur();
            this.uploadButton.focus();
            this.wireActionButtonEvents();
        }
    }

    /* istanbul ignore next */
    private serverActionButtonsEventBind(element: HTMLElement): void {
        if (element && !this.isForm) {
            this.browseButton.blur();
            this.actionButtons = element;
            this.uploadButton = this.actionButtons.querySelector('.e-file-upload-btn');
            this.clearButton = this.actionButtons.querySelector('.e-file-clear-btn');
            this.uploadButton.focus();
            this.unwireActionButtonEvents();
            this.wireActionButtonEvents();
            this.checkActionButtonStatus();
        }
    }

    /* istanbul ignore next */
    private serverUlElement(element: HTMLElement): void {
        if (element) {
            if (this.isBlazorSaveUrl || this.isBlazorTemplate) {
                this.listParent = element;
                this.fileList = [].slice.call(this.listParent.querySelectorAll('li'));
                this.serverRemoveIconBindEvent();
                if (!this.isForm) {
                    this.checkAutoUpload(this.filesData);
                }
            }
        }
    }

    private wireActionButtonEvents(): void {
        EventHandler.add(this.uploadButton, 'click', this.uploadButtonClick, this);
        EventHandler.add(this.clearButton, 'click', this.clearButtonClick, this);
    }

    private unwireActionButtonEvents(): void {
        EventHandler.remove(this.uploadButton, 'click', this.uploadButtonClick);
        EventHandler.remove(this.clearButton, 'click', this.clearButtonClick);
    }

    private removeActionButtons(): void {
        if (this.actionButtons) {
            this.unwireActionButtonEvents();
            if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                detach(this.actionButtons);
            }
            this.actionButtons = null;
        }
    }

    private renderButtonTemplates(): void {
        if (typeof (this.buttons.browse) === 'string') {
            this.browseButton.textContent = (this.buttons.browse === 'Browse...') ?
            this.localizedTexts('Browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.textContent);
        } else {
            this.browseButton.innerHTML = '';
            this.browseButton.appendChild(this.buttons.browse);
        }
        if (this.uploadButton) {
            let uploadText: string | HTMLElement;
            uploadText = isNullOrUndefined(this.buttons.upload) ? 'Upload' : this.buttons.upload;
            this.buttons.upload = uploadText;
            if (typeof (this.buttons.upload) === 'string') {
                this.uploadButton.textContent = (this.buttons.upload === 'Upload') ?
                this.localizedTexts('Upload') : this.buttons.upload;
                this.uploadButton.setAttribute('title', this.uploadButton.textContent);
            } else {
                this.uploadButton.innerHTML = '';
                this.uploadButton.appendChild(this.buttons.upload);
            }
        }
        if (this.clearButton) {
            let clearText: string | HTMLElement;
            clearText = isNullOrUndefined(this.buttons.clear) ? 'Clear' : this.buttons.clear;
            this.buttons.clear = clearText;
            if (typeof (this.buttons.clear) === 'string') {
                this.clearButton.textContent = (this.buttons.clear === 'Clear') ?
                this.localizedTexts('Clear') : this.buttons.clear;
                this.clearButton.setAttribute('title', this.clearButton.textContent);
            } else {
                this.clearButton.innerHTML = '';
                this.clearButton.appendChild(this.buttons.clear);
            }
        }
    }

    private initializeUpload(): void {
        this.element.setAttribute('tabindex', '-1');
        let inputWrapper: HTMLElement = this.createElement('span', { className: INPUT_WRAPPER });
        this.element.parentElement.insertBefore(inputWrapper, this.element);
        this.dropAreaWrapper = this.createElement('div', { className: DROP_WRAPPER });
        this.element.parentElement.insertBefore(this.dropAreaWrapper, this.element);
        inputWrapper.appendChild(this.element);
        this.dropAreaWrapper.appendChild(this.browseButton);
        this.dropAreaWrapper.appendChild(inputWrapper);
        this.uploadWrapper = this.createElement('div', { className: CONTROL_WRAPPER });
        this.dropAreaWrapper.parentElement.insertBefore(this.uploadWrapper, this.dropAreaWrapper);
        this.uploadWrapper.appendChild(this.dropAreaWrapper);
        this.setDropArea();
    }

    private renderPreLoadFiles(): void {
        if (this.files.length) {
            if (this.enablePersistence && this.filesData.length) {
                this.createFileList(this.filesData);
                return;
            }
            if (isNullOrUndefined(this.files[0].size)) {
                return;
            }
            let files: FilesPropModel[] = [].slice.call(this.files);
            let filesData: FileInfo[] = [];
            if (!this.multiple) {
                this.clearData();
                files = [files[0]];
            }
            for (let data of files) {
                let fileData: FileInfo = {
                    name: data.name + '.' + data.type.split('.')[data.type.split('.').length - 1],
                    rawFile: '',
                    size: data.size,
                    status: this.localizedTexts('uploadSuccessMessage'),
                    type: data.type,
                    validationMessages: {minSize: '', maxSize: ''},
                    statusCode: '2'
                };
                filesData.push(fileData);
                this.filesData.push(fileData);
            }
            this.createFileList(filesData);
            if (!this.autoUpload && this.listParent && !this.actionButtons && (!this.isForm || this.allowUpload()) && this.showFileList) {
                this.renderActionButtons();
            }
            this.checkActionButtonStatus();
            if (this.sequentialUpload) {
                this.count = this.filesData.length - 1;
            }
        }
    }

    private checkActionButtonStatus(): void {
        if (this.actionButtons) {
            let length: number = this.uploadWrapper.querySelectorAll('.' + VALIDATION_FAILS).length +
            this.uploadWrapper.querySelectorAll('.e-upload-fails:not(.e-upload-progress)').length +
            this.uploadWrapper.querySelectorAll('span.' + UPLOAD_SUCCESS).length +
            this.uploadWrapper.querySelectorAll('span.' + UPLOAD_INPROGRESS).length;
            if (length > 0 && length === this.uploadWrapper.querySelectorAll('li').length) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            } else {
                this.uploadButton.removeAttribute('disabled');
            }
        }
    }

    private setDropArea(): void {
        let dropTextArea: HTMLElement = <HTMLElement>this.dropAreaWrapper.querySelector('.e-file-drop');
        if (this.dropArea) {
            this.dropZoneElement = (typeof(this.dropArea) !== 'string') ? this.dropArea :
            select(this.dropArea, document) as HTMLElement;
            let element: HTMLElement = this.element;
            let enableDropText: Boolean = false;
            while (element.parentNode) {
                element = element.parentNode as HTMLElement;
                if (element === this.dropZoneElement) {
                    enableDropText = true;
                    if (!dropTextArea) {
                        this.createDropTextHint();
                    } else if (!this.isServerBlazor) {
                        dropTextArea.innerHTML = this.localizedTexts('dropFilesHint');
                    }
                }
            }
            if (!enableDropText && dropTextArea) {
                remove(dropTextArea);
            }
        } else if (!isNullOrUndefined(this.uploaderOptions) && this.uploaderOptions.dropArea === undefined) {
            this.createDropTextHint();
            this.dropZoneElement = this.uploadWrapper;
            this.setProperties({dropArea: this.uploadWrapper }, true);
        }
        this.bindDropEvents();
    }

    private updateDropArea() : void {
        if (this.dropArea) {
            this.setDropArea();
        } else {
            this.dropZoneElement = null;
            let dropTextArea: HTMLElement = <HTMLElement>this.dropAreaWrapper.querySelector('.e-file-drop');
            if (dropTextArea) {
                remove(dropTextArea);
            }
        }
    }

    private createDropTextHint () : void {
        if (!this.isServerBlazor) {
            let fileDropArea: HTMLElement = this.createElement('span', { className: DROP_AREA});
            fileDropArea.innerHTML = this.localizedTexts('dropFilesHint');
            this.dropAreaWrapper.appendChild(fileDropArea);
        }
    }

        private updateHTMLAttrToElement(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (let pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr.indexOf(pro) < 0 ) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    }
    private updateHTMLAttrToWrapper(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (let pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr.indexOf(pro) > -1 ) {
                    if (pro === 'class') {
                        let updatedClassValues : string = (this.htmlAttributes[pro].replace(/\s+/g, ' ')).trim();
                        if (updatedClassValues !== '') {
                            addClass([this.uploadWrapper], updatedClassValues.split(' '));
                        }
                    } else if (pro === 'style') {
                        let uploadStyle: string = this.uploadWrapper.getAttribute(pro);
                        uploadStyle = !isNullOrUndefined(uploadStyle) ? (uploadStyle + this.htmlAttributes[pro]) :
                        this.htmlAttributes[pro];
                        this.uploadWrapper.setAttribute(pro, uploadStyle);
                    } else {
                        this.uploadWrapper.setAttribute(pro, this.htmlAttributes[pro]);
                    }
                }
            }
        }
    }

    private setMultipleSelection(): void {
        if (this.multiple && !this.element.hasAttribute('multiple')) {
            let newAttr: Attr = document.createAttribute('multiple');
            newAttr.value = 'multiple';
            this.element.setAttributeNode(newAttr);
        } else if (!this.multiple) {
            this.element.removeAttribute('multiple');
        }
    }

    private checkAutoUpload(fileData: FileInfo[]): void {
        if (this.autoUpload) {
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                this.sequenceUpload(fileData);
            } else {
                this.upload(fileData);
            }
            this.removeActionButtons();
        } else if (!this.actionButtons) {
            this.renderActionButtons();
        }
        this.checkActionButtonStatus();
    }

    private sequenceUpload(fileData: FileInfo[]): void {
        if ( this.filesData.length - fileData.length === 0 ||
            this.filesData[(this.filesData.length - fileData.length - 1)].statusCode !== '1' ) {
            ++this.count;
            let isFileListCreated: boolean =  this.showFileList ? false : true;
            if (typeof this.filesData[this.count] === 'object') {
                this.isFirstFileOnSelection = false;
                this.upload(this.filesData[this.count], isFileListCreated);
                if (this.filesData[this.count].statusCode === '0') {
                    this.sequenceUpload(fileData);
                }
            } else {
                --this.count;
            }
        }
    }
    private setCSSClass(oldCSSClass?: string): void {
        let updatedCssClassValue: string = this.cssClass;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
           updatedCssClassValue = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(this.cssClass) && updatedCssClassValue !== '') {
           addClass([this.uploadWrapper], updatedCssClassValue.split(updatedCssClassValue.indexOf(',') > -1 ? ',' : ' '));
        }
        let updatedOldCssClass: string = oldCSSClass;
        if (!isNullOrUndefined(oldCSSClass)) {
            updatedOldCssClass = (oldCSSClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(oldCSSClass) && updatedOldCssClass !== '') {
            removeClass([this.uploadWrapper], updatedOldCssClass.split(' '));
        }
    }
    private wireEvents(): void {
        EventHandler.add(this.browseButton, 'click', this.browseButtonClick, this);
        EventHandler.add(this.element, 'change', this.onSelectFiles, this);
        EventHandler.add(document, 'click', this.removeFocus, this);
        this.keyboardModule = new KeyboardEvents( this.uploadWrapper, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            });
        if (this.isForm) {
            EventHandler.add(this.formElement, 'reset', this.resetForm, this);
        }
    }

    private unWireEvents(): void {
        EventHandler.remove(this.browseButton, 'click', this.browseButtonClick);
        EventHandler.remove(this.element, 'change', this.onSelectFiles);
        EventHandler.remove(document, 'click', this.removeFocus);
        if (this.isForm) {
            EventHandler.remove(this.formElement, 'reset', this.resetForm);
        }
        if (this.keyboardModule) { this.keyboardModule.destroy(); }
    }

    private resetForm() : void {
        this.clearAll();
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        let targetElement: HTMLElement = e.target as HTMLElement;
        switch (e.action) {
                case 'enter':
                if (e.target === this.clearButton) {
                    this.clearButtonClick();
                } else if (e.target === this.uploadButton) {
                    this.uploadButtonClick();
                } else if (e.target === this.browseButton) {
                    this.browseButtonClick();
                } else if (targetElement.classList.contains(PAUSE_UPLOAD)) {
                    let metaData: MetaData = this.getCurrentMetaData(null, e);
                    metaData.file.statusCode = '4';
                    metaData.file.status = this.localizedTexts('pauseUpload');
                    this.abortUpload(metaData, false);
                } else if (targetElement.classList.contains(RESUME_UPLOAD)) {
                    this.resumeUpload(this.getCurrentMetaData(null, e), e);
                } else if (targetElement.classList.contains(RETRY_ICON)) {
                    let metaData: MetaData = this.getCurrentMetaData(null, e);
                    if (!isNullOrUndefined(metaData)) {
                        metaData.file.statusCode = '1';
                        metaData.file.status = this.localizedTexts('readyToUploadMessage');
                        this.chunkUpload(metaData.file);
                    } else {
                        let target: HTMLElement = (<HTMLElement>e.target).parentElement;
                        let fileData: FileInfo = this.filesData[this.fileList.indexOf(target)];
                        this.retry(fileData);
                    }
                } else {
                    this.removeFiles(e);
                    if (!targetElement.classList.contains(ABORT_ICON)) {
                        this.browseButton.focus();
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                break;
            }
    }

    private getCurrentMetaData(fileInfo?: FileInfo, e?: KeyboardEventArgs) : MetaData {
        let fileData: FileInfo; let targetMetaData : MetaData;
        if (isNullOrUndefined(fileInfo)) {
            let target: HTMLElement = (<HTMLElement>e.target).parentElement;
            fileData = this.filesData[this.fileList.indexOf(target)];
        } else {
            fileData = fileInfo;
        }
        for (let i: number = 0; i < this.uploadMetaData.length; i++) {
            if (this.uploadMetaData[i].file.name === fileData.name) {
                targetMetaData = this.uploadMetaData[i];
            }
        }
        return targetMetaData;
    }

    private removeFocus() : void {
        if (this.uploadWrapper && this.listParent && this.listParent.querySelector('.' + ICON_FOCUSED)) {
            (<HTMLElement>document.activeElement).blur();
            this.listParent.querySelector('.' + ICON_FOCUSED).classList.remove(ICON_FOCUSED);
        }
    }

    private browseButtonClick(): void {
        this.element.click();
    }

    private uploadButtonClick(): void {
        if (this.sequentialUpload) {
            this.sequenceUpload(this.filesData);
        } else {
            this.upload(this.filesData);
        }
    }

    private clearButtonClick(): void {
        this.clearAll();
        /* istanbul ignore next */
        if (this.sequentialUpload) {
            this.count = -1;
        }
        this.actionCompleteCount = 0;
    }

    private bindDropEvents(): void {
        if (this.dropZoneElement) {
            EventHandler.add(this.dropZoneElement, 'drop', this.dropElement, this);
            EventHandler.add(this.dropZoneElement, 'dragover', this.dragHover, this);
            EventHandler.add(this.dropZoneElement, 'dragleave', this.onDragLeave, this);
            EventHandler.add(this.dropZoneElement, 'paste', this.onPasteFile, this);
        }
    }

    private unBindDropEvents(): void {
        if (this.dropZoneElement) {
            EventHandler.remove(this.dropZoneElement, 'drop', this.dropElement);
            EventHandler.remove(this.dropZoneElement, 'dragover', this.dragHover);
            EventHandler.remove(this.dropZoneElement, 'dragleave', this.onDragLeave);
        }
    }

    private onDragLeave(e: DragEvent): void {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
    }

    private dragHover(e: DragEvent): void {
        if (!this.enabled) { return; }
        this.dropZoneElement.classList.add(DRAG_HOVER);
        if (this.dropEffect !== 'Default') {
            e.dataTransfer.dropEffect = this.dropEffect.toLowerCase();
        }
        e.preventDefault();
        e.stopPropagation();
    }

    /* istanbul ignore next */
    private dropElement(e: DragEvent): void {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
        this.onSelectFiles(e);
        e.preventDefault();
        e.stopPropagation();
    }

    /* istanbul ignore next */
    private onPasteFile(event: ClipboardEvent): void {
        let item: DataTransferItemList = event.clipboardData.items;
        if (item.length !== 1) { return; }
        let pasteFile: DataTransferItem = [].slice.call(item)[0];
        if ((pasteFile.kind === 'file') && pasteFile.type.match('^image/')) {
            this.renderSelectedFiles(event, [pasteFile.getAsFile()], false, true);
        }
    }

    private getSelectedFiles(index: number): FileInfo[] {
        let data: FileInfo[] = [];
        let liElement: HTMLElement = this.fileList[index];
        let allFiles: FileInfo[] = this.getFilesData();
        let nameElements: number = +liElement.getAttribute('data-files-count');
        let startIndex: number = 0 ;
        for (let i: number = 0; i < index; i++ ) {
            startIndex += (+this.fileList[i].getAttribute('data-files-count'));
        }
        for (let j: number = startIndex; j < (startIndex + nameElements); j++) {
            data.push(allFiles[j]);
        }
        return data;
    }

    private removeFiles(args: MouseEvent | TouchEvent | KeyboardEventArgs): void {
        if (!this.enabled) { return; }
        let selectedElement: HTMLElement = (<HTMLInputElement>args.target).parentElement;
        if (this.isBlazorSaveUrl) {
            this.fileList = [].slice.call(this.uploadWrapper.querySelectorAll('li'));
        }
        let index: number = this.fileList.indexOf(selectedElement);
        let liElement: HTMLElement = this.fileList[index];
        let formUpload: boolean = this.isFormUpload();
        let fileData: FileInfo[] = formUpload ? this.getSelectedFiles(index) : this.getFilesInArray(this.filesData[index]);
        if (isNullOrUndefined(fileData)) { return; }
        if ((<HTMLInputElement>args.target).classList.contains(ABORT_ICON) && !formUpload) {
            fileData[0].statusCode = '5';
            if (!isNullOrUndefined(liElement)) {
                let spinnerTarget: HTMLElement = liElement.querySelector('.' + ABORT_ICON) as HTMLElement;
                createSpinner({ target: spinnerTarget , width: '20px' });
                showSpinner(spinnerTarget);
            }
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                this.uploadSequential();
            }
            if (!(liElement.classList.contains(RESTRICT_RETRY))) {
                this.checkActionComplete(true);
            }
        } else if (!closest(args.target as Element, '.' + SPINNER_PANE)) {
            this.remove(fileData, false, false, true, args);
        }
        this.element.value = '';
        this.checkActionButtonStatus();
    }

    private removeFilesData(file: FileInfo, customTemplate: boolean): void {
        let index: number ;
        if (customTemplate) {
            if (!this.showFileList) {
                index = this.filesData.indexOf(file);
                this.filesData.splice(index, 1);
            }
            return;
        }
        let selectedElement: HTMLElement = this.getLiElement(file);
        if (isNullOrUndefined(selectedElement)) { return; }
        if (!this.isBlazorSaveUrl) {
            detach(selectedElement);
        }
        index = this.fileList.indexOf(selectedElement);
        this.fileList.splice(index, 1);
        this.filesData.splice(index, 1);
        if (!this.isBlazorSaveUrl) {
        if (this.fileList.length === 0 && !isNullOrUndefined(this.listParent)) {
            detach(this.listParent);
            this.listParent = null;
            this.removeActionButtons();
        }
        if (this.sequentialUpload) {
            /* istanbul ignore next */
            if (index <= this.count) {
                --this.count;
            }
        }
    } else {
        // tslint:disable-next-line
        (this as any).interopAdaptor.invokeMethodAsync('removeFileData', index);
        }
    }

    private removeUploadedFile(
        file: FileInfo, eventArgs: RemovingEventArgs,
        removeDirectly: boolean, custom: boolean): void {
        let selectedFiles: FileInfo = file;
        let ajax: Ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
        ajax.emitError = false;
        let formData: FormData = new FormData();
        ajax.beforeSend = (e: BeforeSendEventArgs) => {
            eventArgs.currentRequest = ajax.httpRequest;
            if (isBlazor()) {
                if (this.currentRequestHeader) {
                    this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
                }
                if (this.customFormDatas) {
                    this.updateFormData(formData, this.customFormDatas);
                }
            }
            if (!removeDirectly) {
                this.trigger('removing', eventArgs, (eventArgs: RemovingEventArgs) => {
                    if (eventArgs.cancel) {
                        e.cancel = true;
                    } else {
                        this.removingEventCallback(eventArgs, formData, selectedFiles, file);
                    }
                });
            } else {
                this.removingEventCallback(eventArgs, formData, selectedFiles, file);
            }
        };
        if (this.isServerBlazor) {
            let name: string = this.element.getAttribute('name');
            if (!isNullOrUndefined(selectedFiles.rawFile) && selectedFiles.rawFile !== '') {
                formData.append(name, selectedFiles.rawFile, selectedFiles.name);
            } else {
                formData.append(name, selectedFiles.name);
            }
        }
        ajax.onLoad = (e: Event): object => { this.removeCompleted(e, selectedFiles, custom); return {}; };
        /* istanbul ignore next */
        ajax.onError = (e: Event): object => { this.removeFailed(e, selectedFiles, custom); return {}; };
        ajax.send(formData);
    }

    private removingEventCallback(eventArgs: RemovingEventArgs, formData: FormData, selectedFiles: FileInfo, file: FileInfo): void {
            /* istanbul ignore next */
            let name: string = this.element.getAttribute('name');
            let liElement: HTMLElement = this.getLiElement(file);
            if (!isNullOrUndefined(liElement) && (!isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON)) ||
            !isNullOrUndefined(liElement.querySelector('.' + REMOVE_ICON)))) {
                let spinnerTarget: HTMLElement;
                spinnerTarget = liElement.querySelector('.' + DELETE_ICON) ? liElement.querySelector('.' + DELETE_ICON) as HTMLElement :
                liElement.querySelector('.' + REMOVE_ICON) as HTMLElement;
                createSpinner({ target: spinnerTarget , width: '20px' });
                showSpinner(spinnerTarget);
            }
            if (!this.isServerBlazor) {
                if (eventArgs.postRawFile && !isNullOrUndefined(selectedFiles.rawFile) && selectedFiles.rawFile !== '') {
                    formData.append(name, selectedFiles.rawFile, selectedFiles.name);
                } else {
                    formData.append(name, selectedFiles.name);
                }
                this.updateFormData(formData, eventArgs.customFormData);
            }
    }

    /* istanbul ignore next */
    private updateFormData(formData: FormData, customData: { [key: string]: Object }[]): void {
        if (customData.length > 0 && customData[0]) {
            for (let i: number = 0; i < customData.length; i++) {
                let data: { [key: string]: Object } = customData[i];
                // tslint:disable-next-line
                let value: any = Object.keys(data).map(function(e) {
                    return data[e];
                });
                formData.append(Object.keys(data)[0], value);
            }
        }
    }

    /* istanbul ignore next */
    private updateCustomheader(request: XMLHttpRequest, currentRequest: { [key: string]: string }[]): void {
        if (currentRequest.length > 0 && currentRequest[0]) {
            for (let i: number = 0; i < currentRequest.length; i++) {
                let data: { [key: string]: string } = currentRequest[i];
                // tslint:disable-next-line
                let value: any = Object.keys(data).map(function (e) {
                    return data[e];
                });
                request.setRequestHeader(Object.keys(data)[0], value);
            }
        }
    }

    private removeCompleted(e: Event, files:  FileInfo, customTemplate: boolean): void {
        let response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let status : XMLHttpRequest = e.target as XMLHttpRequest;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299 ) {
            let args : Object = {
            e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedSuccessMessage'), '2')
            };
            this.trigger('success', args);
            this.removeFilesData(files, customTemplate);
            let index: number = this.uploadedFilesData.indexOf(files);
            this.uploadedFilesData.splice(index, 1);
            this.trigger('change', { files: this.uploadedFilesData });
        } else {
            this.removeFailed(e, files, customTemplate);
        }
    }

    private removeFailed(e: Event, files:  FileInfo, customTemplate: boolean): void {
        let response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let args : Object = {
            e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedFailedMessage'), '0')
        };
        if (!customTemplate) {
            let index: number = this.filesData.indexOf(files);
            let rootElement: HTMLElement = this.fileList[index];
            if (rootElement) {
                rootElement.classList.remove(UPLOAD_SUCCESS);
                rootElement.classList.add(UPLOAD_FAILED);
                let statusElement: HTMLElement = rootElement.querySelector('.' + STATUS) as HTMLElement;
                if (statusElement) {
                    statusElement.classList.remove(UPLOAD_SUCCESS);
                    statusElement.classList.add(UPLOAD_FAILED);
                }
            }
            this.checkActionButtonStatus();
        }
        this.trigger('failure', args);
        let liElement: HTMLElement = this.getLiElement(files);
        /* istanbul ignore next */
        if (!isNullOrUndefined(liElement) && !isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON))) {
            let spinnerTarget: HTMLElement = liElement.querySelector('.' + DELETE_ICON) as HTMLElement;
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
    }

    /* istanbul ignore next */
    private getFilesFromFolder(event: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        this.filesEntries = [];
        let items: DataTransferItem[] | DataTransferItemList;
        items = this.multiple ? (<DragEvent>event).dataTransfer.items : [(<DragEvent>event).dataTransfer.items[0]];
        let validDirectoryUpload: boolean = this.checkDirectoryUpload(items);
        if (!validDirectoryUpload) { return; }
        for (let i: number = 0; i < items.length; i++) {
            // tslint:disable-next-line
            let item: any = items[i].webkitGetAsEntry();
            if (item.isFile) {
                let files: { [key: string]: Object }[] = [];
                // tslint:disable-next-line
                (item).file( (fileObj: any) => {
                    let path: string = item.fullPath;
                    files.push({'path': path, 'file': fileObj});
                });
                this.renderSelectedFiles(event, files, true);
            } else if (item.isDirectory) {
                this.traverseFileTree(item, event);
            }
        }
    }

    /* istanbul ignore next */
    private checkDirectoryUpload(items: DataTransferItem[] | DataTransferItemList): boolean {
        for (let i: number = 0; items && i < items.length; i++) {
            // tslint:disable-next-line
            let item :any = items[i].webkitGetAsEntry();
            if (item.isDirectory) { return true; }
        }
        return false;
    }
    // tslint:disable
    /* istanbul ignore next */
    public traverseFileTree(item: any, event?: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        if (item.isFile) {
            this.filesEntries.push(item);
        } else if (item.isDirectory) {
            // tslint:disable-next-line
            let directoryReader: any = item.createReader();
            // tslint:disable-next-line
            this.readFileFromDirectory(directoryReader, event);
        }
    }

    // tslint:disable
    /* istanbul ignore next */
    private readFileFromDirectory(directoryReader: any, event?: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        // tslint:disable-next-line
        directoryReader.readEntries( (entries: any) => {
            for (let i: number = 0; i < entries.length; i++) {
                this.traverseFileTree(entries[i]);
                // tslint:disable-next-line
            };
            this.pushFilesEntries(event);
            if (entries.length) {
                this.readFileFromDirectory(directoryReader);
            }
        });
    }

    private pushFilesEntries(event?: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        let files: { [key: string]: Object }[] = [];
        for (let i: number = 0; i < this.filesEntries.length; i++) {
            // tslint:disable-next-line
            this.filesEntries[i].file( (fileObj: any) => {
                if (this.filesEntries.length) {
                    let path: string = this.filesEntries[i].fullPath;
                    files.push({'path': path, 'file': fileObj});
                    if (i === this.filesEntries.length - 1) {
                        this.filesEntries = [];
                        this.renderSelectedFiles(event, files, true);
                    }
                }
            });
        }
    }
    // tslint:enable
    private onSelectFiles(args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        if (!this.enabled) { return; }
        let targetFiles: File[];
        /* istanbul ignore next */
        if (args.type === 'drop') {
            if (this.directoryUpload) {
                this.getFilesFromFolder(args);
            } else {
                let files: FileList = this.sortFilesList = (<DragEvent>args).dataTransfer.files;
                if (this.browserName !== 'msie' && this.browserName !== 'edge') {
                    this.element.files = files;
                }
                if (files.length > 0) {
                    targetFiles = this.multiple ? this.sortFileList(files) : [files[0]];
                    this.renderSelectedFiles(args, targetFiles);
                }
            }
        } else {
            targetFiles = [].slice.call((<HTMLInputElement>args.target).files);
            this.renderSelectedFiles(args, targetFiles);
        }
    }
     /* istanbul ignore next */
    private getBase64(file: File): Promise<void> {
        return new Promise((resolve: Function, reject: Function) => {
            let fileReader: FileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.onerror = (error: ProgressEvent) => reject(error);
        });
    }

    /* istanbul ignore next */
    /* tslint:ignore */
    private renderSelectedFiles(
        args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent,
        // tslint:disable-next-line
        targetFiles: any, directory?: boolean, paste?: boolean): void {
            this.base64String = [];
        // tslint:disable-next-line
        let eventArgs: SelectedEventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            isModified: false,
            modifiedFilesData: [],
            progressInterval: '',
            isCanceled: false,
            currentRequest: null,
            customFormData: null
        };
        /* istanbul ignore next */
        if (targetFiles.length < 1) {
            eventArgs.isCanceled = true;
            this.trigger('selected', eventArgs);
            return;
        }
        this.flag = true;
        let fileData: FileInfo[] = [];
        if (!this.multiple) {
            this.clearData(true);
            targetFiles = [targetFiles[0]];
        }
        for (let i: number = 0; i < targetFiles.length; i++) {
            let file: File = directory ? targetFiles[i].file : targetFiles[i];
            this.updateInitialFileDetails(args, targetFiles, file, i, fileData, directory, paste);
        }
        eventArgs.filesData = fileData;
        if (this.allowedExtensions.indexOf('*') > -1) { this.allTypes = true; }
        if (!this.allTypes) { fileData =  this.checkExtension(fileData); }
        this.trigger('selected', eventArgs, (eventArgs: SelectedEventArgs) => {
            this._internalRenderSelect(eventArgs, fileData);
        });
    }

    private updateInitialFileDetails(args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent,
        // tslint:disable-next-line
        targetFiles: any, file: File, i: number, fileData: FileInfo[], directory?: boolean, paste?: boolean): void {
        let fileName: string = directory ? targetFiles[i].path.substring(1, targetFiles[i].path.length) : paste ?
            getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name) :
            this.directoryUpload ? targetFiles[i].webkitRelativePath : file.name;
        let fileDetails: FileInfo = {
            name: fileName,
            rawFile: file,
            size: file.size,
            status: this.localizedTexts('readyToUploadMessage'),
            type: this.getFileType(file.name),
            validationMessages: this.validatedFileSize(file.size),
            statusCode: '1',
            id: getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name)
        };
        /* istanbul ignore next */
        if (paste) { fileDetails.fileSource = 'paste'; }
        fileDetails.status = fileDetails.validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
            fileDetails.validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : fileDetails.status;
        if (fileDetails.validationMessages.minSize !== '' || fileDetails.validationMessages.maxSize !== '') {
            fileDetails.statusCode = '0';
        }
        fileData.push(fileDetails);
    }

    private _internalRenderSelect(eventArgs: SelectedEventArgs, fileData: FileInfo[]): void {
        if (!eventArgs.cancel) {
            /* istanbul ignore next */
            if (isBlazor()) {
                this.currentRequestHeader = eventArgs.currentRequest;
                this.customFormDatas = eventArgs.customFormData;
            }
            this.selectedFiles = this.selectedFiles.concat(fileData);
            this.btnTabIndex = this.disableKeyboardNavigation ? '-1' : '0';
            if (this.showFileList) {
                if (eventArgs.isModified && eventArgs.modifiedFilesData.length > 0) {
                    for (let j: number = 0; j < eventArgs.modifiedFilesData.length; j++) {
                        for (let k: number = 0; k < fileData.length; k++) {
                            if (eventArgs.modifiedFilesData[j].id === fileData[k].id) {
                                eventArgs.modifiedFilesData[j].rawFile = fileData[k].rawFile;
                            }
                        }
                    }
                    let dataFiles: FileInfo[] = this.allTypes ? eventArgs.modifiedFilesData :
                        this.checkExtension(eventArgs.modifiedFilesData);
                    this.updateSortedFileList(dataFiles);
                    this.filesData = dataFiles;
                    if (!this.isForm || this.allowUpload()) {
                        this.checkAutoUpload(dataFiles);
                    }
                } else {
                    this.createFileList(fileData, true);
                    if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                        this.filesData = this.filesData.concat(fileData);
                    }
                    if (!this.isForm || this.allowUpload()) {
                        if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                            this.checkAutoUpload(fileData);
                        }
                    }
                }
                if (!isNullOrUndefined(eventArgs.progressInterval) && eventArgs.progressInterval !== '') {
                    this.progressInterval = eventArgs.progressInterval;
                }
            } else {
                this.filesData = this.filesData.concat(fileData);
                if (this.isBlazorSaveUrl) {
                    // tslint:disable-next-line
                    (this as any).interopAdaptor.invokeMethodAsync('updateServerFileData', this.filesData, this.isForm);
                }
                if (this.autoUpload) {
                    this.upload(this.filesData, true);
                }
            }
            this.raiseActionComplete();
            this.isFirstFileOnSelection = true;
        }
    }

    private allowUpload(): boolean {
        let allowFormUpload: boolean = false;
        if (this.isForm && (!isNullOrUndefined(this.asyncSettings.saveUrl) && this.asyncSettings.saveUrl !== '' )) {
            allowFormUpload = true;
        }
        return allowFormUpload;
    }

    private isFormUpload(): boolean {
        let isFormUpload: boolean = false;
        if (this.isForm && ((isNullOrUndefined(this.asyncSettings.saveUrl) || this.asyncSettings.saveUrl === '' )
            && (isNullOrUndefined(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === '' ))) {
            isFormUpload = true;
        }
        return isFormUpload;
    }

    private clearData(singleUpload?: boolean) : void {
        if (!isNullOrUndefined(this.listParent) && !(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            detach(this.listParent);
            this.listParent = null;
        }
        if (this.browserName !== 'msie' && !singleUpload) {  this.element.value = '';  }
        this.fileList = [];
        this.filesData = [];
        if (this.isBlazorSaveUrl || this.isBlazorTemplate) {
            // tslint:disable-next-line
            (this as any).interopAdaptor.invokeMethodAsync('clearAll');
        } else {
            this.removeActionButtons();
        }
    }

    private updateSortedFileList(filesData: FileInfo[]): void {
        let previousListClone: HTMLElement = this.createElement('div', {id: 'clonewrapper'});
        let added: number = -1;
        let removedList: HTMLElement[];
        if (this.listParent) {
            for (let i: number = 0; i < this.listParent.querySelectorAll('li').length; i++) {
                let liElement: HTMLElement = this.listParent.querySelectorAll('li')[i];
                previousListClone.appendChild(liElement.cloneNode(true));
            }
            removedList = <HTMLElement[] & NodeListOf<HTMLLIElement>>this.listParent.querySelectorAll('li');
            for (let item of removedList) {
                detach(item);
            }
            this.removeActionButtons();
            let oldList: HTMLElement[] = [].slice.call(previousListClone.childNodes);
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createParentUL();
            for (let index: number = 0; index < filesData.length; index++) {
                for (let j: number = 0; j < this.filesData.length; j++) {
                    if (this.filesData[j].name === filesData[index].name) {
                        this.listParent.appendChild(oldList[j]);
                        EventHandler.add(oldList[j].querySelector('.e-icons'), 'click', this.removeFiles, this);
                        this.fileList.push(oldList[j]);
                        added = index;
                    }
                }
                if (added !== index) { this.createFileList([filesData[index]]); }
            }
        } else { this.createFileList(filesData); }
    }

    private isBlank(str: string): boolean {
        return (!str || /^\s*$/.test(str));
    }

    private checkExtension(files: FileInfo[]): FileInfo[] {
        let dropFiles: FileInfo[] = files;
        if (!this.isBlank(this.allowedExtensions)) {
            let allowedExtensions: string[] = [];
            let extensions: string[] = this.allowedExtensions.split(',');
            for (let extension of extensions) {
                allowedExtensions.push(extension.trim().toLocaleLowerCase());
            }
            for (let i: number = 0; i < files.length; i++) {
                if (allowedExtensions.indexOf(('.' + files[i].type).toLocaleLowerCase()) === -1) {
                    files[i].status = this.localizedTexts('invalidFileType');
                    files[i].statusCode = '0';
                }
            }
        }
        return dropFiles;
    }

    private validatedFileSize(fileSize: number): Object {
        let minSizeError: string = '';
        let maxSizeError: string = '';
        if (fileSize < this.minFileSize) {
            minSizeError = this.localizedTexts('invalidMinFileSize');
        } else if (fileSize > this.maxFileSize) {
            maxSizeError = this.localizedTexts('invalidMaxFileSize');
        } else {
            minSizeError = '';
            maxSizeError = '';
        }
        let errorMessage: Object = { minSize: minSizeError, maxSize: maxSizeError };
        return errorMessage;
    }

    private isPreLoadFile(fileData: FileInfo) : boolean {
        let isPreload: boolean = false;
        for (let i : number = 0; i < this.files.length; i++) {
            if (this.files[i].name === fileData.name.slice(0, fileData.name.lastIndexOf('.')) && this.files[i].type === fileData.type) {
                isPreload = true;
            }
        }
        return isPreload;
    }

    private createCustomfileList(fileData: FileInfo[]): void {
        this.createParentUL();
        resetBlazorTemplate(this.element.id + 'Template', 'Template');
        for (let listItem of fileData) {
            let liElement: HTMLElement = this.createElement('li', { className: FILE, attrs: { 'data-file-name': listItem.name } });
            this.uploadTemplateFn = this.templateComplier(this.template);
            // tslint:disable-next-line
            let liTempCompiler: any = this.uploadTemplateFn(listItem, this, 'template', this.element.id + 'Template', this.isStringTemplate, null, liElement);
            if (liTempCompiler) {
                let fromElements: HTMLElement[] = [].slice.call(liTempCompiler);
                append(fromElements, liElement);
            }
            let index: number = fileData.indexOf(listItem);
            let eventArgs: RenderingEventArgs = {
                element: liElement,
                fileInfo: listItem,
                index: index,
                isPreload: this.isPreLoadFile(listItem)
            };
            let eventsArgs: FileListRenderingEventArgs = {
                element: liElement,
                fileInfo: listItem,
                index: index,
                isPreload: this.isPreLoadFile(listItem)
            };
            this.trigger('rendering', eventArgs);
            this.trigger('fileListRendering', eventsArgs);
            this.listParent.appendChild(liElement);
            this.fileList.push(liElement);
        }
        this.renderReactTemplates();
        updateBlazorTemplate(this.element.id + 'Template', 'Template', this, false);
    }

    private createParentUL() : void {
        if (isNullOrUndefined(this.listParent)) {
            this.listParent = this.createElement('ul', { className: LIST_PARENT });
            this.uploadWrapper.appendChild(this.listParent);
        }
    }

    private formFileList(fileData: FileInfo[], files: FileList): void {
        let fileList: HTMLElement = this.createElement('li', { className: FILE });
        fileList.setAttribute('data-files-count', fileData.length + '');
        let fileContainer: HTMLElement = this.createElement('span', { className: TEXT_CONTAINER });
        let statusMessage: string;
        for (let listItem of fileData) {
            let fileNameEle: HTMLElement = this.createElement('span', { className: FILE_NAME });
            fileNameEle.innerHTML = this.getFileNameOnly(listItem.name);
            let fileTypeEle: HTMLElement = this.createElement('span', { className: FILE_TYPE });
            fileTypeEle.innerHTML = '.' + this.getFileType(listItem.name);
            if (!this.enableRtl) {
                fileContainer.appendChild(fileNameEle);
                fileContainer.appendChild(fileTypeEle);
            } else {
                let rtlContainer: Element = this.createElement('span', { className: RTL_CONTAINER });
                rtlContainer.appendChild(fileTypeEle);
                rtlContainer.appendChild(fileNameEle);
                fileContainer.appendChild(rtlContainer);
            }
            this.truncateName(fileNameEle);
            statusMessage = this.formValidateFileInfo(listItem, fileList);
        }
        fileList.appendChild(fileContainer);
        this.setListToFileInfo(fileData, fileList);
        let index: number = this.listParent.querySelectorAll('li').length;
        let infoEle: HTMLElement = this.createElement('span');
        if (fileList.classList.contains(INVALID_FILE)) {
            infoEle.classList.add(STATUS);
            infoEle.classList.add(INVALID_FILE);
            infoEle.innerText =  fileData.length > 1 ? this.localizedTexts('invalidFileSelection') : statusMessage;
        } else {
            infoEle.classList.add( fileData.length > 1 ? INFORMATION : FILE_SIZE);
            infoEle.innerText = fileData.length > 1 ? this.localizedTexts('totalFiles') + ': ' + fileData.length + ' , '
            + this.localizedTexts('size') + ': ' +
            this.bytesToSize(this.getFileSize(fileData)) : this.bytesToSize(fileData[0].size);
            this.createFormInput(fileData);
        }
        fileContainer.appendChild(infoEle);

        if (isNullOrUndefined(fileList.querySelector('.e-icons'))) {
            let iconElement: HTMLElement = this.createElement('span', {className: 'e-icons', attrs: { 'tabindex': this.btnTabIndex}});
            /* istanbul ignore next */
            if (this.browserName === 'msie') { iconElement.classList.add('e-msie'); }
            iconElement.setAttribute('title', this.localizedTexts('remove'));
            fileList.appendChild(fileContainer);
            fileList.appendChild(iconElement);
            EventHandler.add(iconElement, 'click', this.removeFiles, this);
            iconElement.classList.add(REMOVE_ICON);
        }

        let eventArgs: RenderingEventArgs = {
            element: fileList,
            fileInfo: this.mergeFileInfo(fileData, fileList),
            index: index,
            isPreload: this.isPreLoadFile(this.mergeFileInfo(fileData, fileList))
        };
        let eventsArgs: FileListRenderingEventArgs = {
            element: fileList,
            fileInfo: this.mergeFileInfo(fileData, fileList),
            index: index,
            isPreload: this.isPreLoadFile(this.mergeFileInfo(fileData, fileList))
        };
        this.trigger('rendering', eventArgs);
        this.trigger('fileListRendering', eventsArgs);
        this.listParent.appendChild(fileList);
        this.fileList.push(fileList);
    }

    private formValidateFileInfo(listItem: FileInfo, fileList: HTMLElement): string {
        let statusMessage: string = listItem.status;
        let validationMessages: ValidationMessages = this.validatedFileSize(listItem.size);
        if (validationMessages.minSize !== '' || validationMessages.maxSize !== '') {
            this.addInvalidClass(fileList);
            statusMessage = validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
            validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : statusMessage;
        }
        let typeValidationMessage: string = this.checkExtension(this.getFilesInArray(listItem))[0].status;
        if ( typeValidationMessage === this.localizedTexts('invalidFileType')) {
            this.addInvalidClass(fileList);
            statusMessage = typeValidationMessage;
        }
        return statusMessage;
    }

    private addInvalidClass(fileList: HTMLElement): void {
        fileList.classList.add(INVALID_FILE);
    }

    private createFormInput(fileData: FileInfo[]): void {
        let inputElement: HTMLInputElement = this.element.cloneNode(true) as HTMLInputElement;
        inputElement.classList.add(HIDDEN_INPUT);
        for (let listItem of fileData) {
            listItem.input = inputElement;
        }
        inputElement.setAttribute('name', this.uploaderName);
        this.uploadWrapper.querySelector('.' + INPUT_WRAPPER).appendChild(inputElement);
        if (this.browserName !== 'msie' && this.browserName !== 'edge') {
            this.element.value = '';
        }
    }

    private getFileSize(fileData: FileInfo[]): number {
        let fileSize: number = 0;
        for (let file of fileData) {
            fileSize += file.size;
        }
        return fileSize;
    }

    private mergeFileInfo(fileData: FileInfo[], fileList: HTMLElement): FileInfo {
        let result: FileInfo = {
            name: '',
            rawFile: '',
            size: 0,
            status: '',
            type: '',
            validationMessages: { minSize: '', maxSize: ''},
            statusCode: '1',
            list: fileList
        };
        let fileNames: string [] = [];
        let type: string = '';
        for (let listItem of fileData) {
            fileNames.push(listItem.name);
            type = listItem.type;
        }
        result.name = fileNames.join(', ');
        result.size = this.getFileSize(fileData);
        result.type = type;
        result.status = this.statusForFormUpload(fileData, fileList);
        return result;
    }

    private statusForFormUpload(fileData: FileInfo[], fileList: HTMLElement): string {
        let isValid: boolean = true;
        let statusMessage: string ;
        for (let listItem of fileData) {
            statusMessage = listItem.status;
            let validationMessages: ValidationMessages = this.validatedFileSize(listItem.size);
            if (validationMessages.minSize !== '' || validationMessages.maxSize !== '') {
                isValid = false;
                statusMessage = validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
                validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : statusMessage;
            }
            let typeValidationMessage: string = this.checkExtension(this.getFilesInArray(listItem))[0].status;
            if ( typeValidationMessage === this.localizedTexts('invalidFileType')) {
                isValid = false;
                statusMessage = typeValidationMessage;
            }
        }

        if (!isValid) {
            fileList.classList.add(INVALID_FILE);
            statusMessage = fileData.length > 1 ? this.localizedTexts('invalidFileSelection') : statusMessage;
        } else {
            statusMessage = this.localizedTexts('totalFiles') + ': ' + fileData.length + ' , '
            + this.localizedTexts('size') + ': ' +
            this.bytesToSize(this.getFileSize(fileData));
        }
        return statusMessage;
    }

    private formCustomFileList(fileData: FileInfo[], files: FileList): void {
        this.createParentUL();
        resetBlazorTemplate(this.element.id + 'Template', 'Template');
        let fileList: HTMLElement = this.createElement('li', { className: FILE });
        fileList.setAttribute('data-files-count', fileData.length + '');
        this.setListToFileInfo(fileData, fileList);
        let result: FileInfo = this.mergeFileInfo(fileData, fileList);
        fileList.setAttribute('data-file-name', result.name);
        this.uploadTemplateFn = this.templateComplier(this.template);
        // tslint:disable-next-line
        let liTempCompiler: any = this.uploadTemplateFn(result, this, 'template', this.element.id + 'Template', this.isStringTemplate, null, fileList);
        if (liTempCompiler) {
            let fromElements: HTMLElement[] = [].slice.call(liTempCompiler);
            append(fromElements, fileList);
        }
        let index: number = this.listParent.querySelectorAll('li').length;
        if (!fileList.classList.contains(INVALID_FILE)) {
            this.createFormInput(fileData);
        }
        let eventArgs: RenderingEventArgs = {
            element: fileList,
            fileInfo: result,
            index: index,
            isPreload: this.isPreLoadFile(result)
        };
        let eventsArgs: FileListRenderingEventArgs = {
            element: fileList,
            fileInfo: result,
            index: index,
            isPreload: this.isPreLoadFile(result)
        };
        this.trigger('rendering', eventArgs);
        this.trigger('fileListRendering', eventsArgs);
        this.listParent.appendChild(fileList);
        this.fileList.push(fileList);
        this.renderReactTemplates();
        updateBlazorTemplate(this.element.id + 'Template', 'Template', this, false);
    }

    /**
     * Create the file list for specified files data.
     * @param { FileInfo[] } fileData - specifies the files data for file list creation.
     * @returns void
     */
    public createFileList(fileData: FileInfo[], isSelectedFile?: boolean): void {
        if (this.isBlazorSaveUrl || this.isBlazorTemplate) {
            let fileListData: FileInfo[] = (isSelectedFile) ? this.filesData = this.filesData.concat(fileData) : fileData;
            // tslint:disable-next-line
            (this as any).interopAdaptor.invokeMethodAsync('createFileList', fileListData, this.isForm);
        } else {
            this.createParentUL();
            if (this.template !== '' && !isNullOrUndefined(this.template)) {
                if (this.isFormUpload()) {
                    this.uploadWrapper.classList.add(FORM_UPLOAD);
                    this.formCustomFileList(fileData, this.element.files);
                } else {
                    this.createCustomfileList(fileData);
                }
            } else if (this.isFormUpload()) {
                this.uploadWrapper.classList.add(FORM_UPLOAD);
                this.formFileList(fileData, this.element.files);
            } else {
                for (let listItem of fileData) {
                    let liElement: HTMLElement = this.createElement('li', {
                        className: FILE,
                        attrs: { 'data-file-name': listItem.name, 'data-files-count': '1' }
                    });
                    let textContainer: Element = this.createElement('span', { className: TEXT_CONTAINER });
                    let textElement: HTMLElement = this.createElement('span', { className: FILE_NAME, attrs: { 'title': listItem.name } });
                    textElement.innerHTML = this.getFileNameOnly(listItem.name);
                    let fileExtension: Element = this.createElement('span', { className: FILE_TYPE });
                    fileExtension.innerHTML = '.' + this.getFileType(listItem.name);
                    if (!this.enableRtl) {
                        textContainer.appendChild(textElement);
                        textContainer.appendChild(fileExtension);
                    } else {
                        let rtlContainer: Element = this.createElement('span', { className: RTL_CONTAINER });
                        rtlContainer.appendChild(fileExtension);
                        rtlContainer.appendChild(textElement);
                        textContainer.appendChild(rtlContainer);
                    }
                    let fileSize: Element = this.createElement('span', { className: FILE_SIZE });
                    fileSize.innerHTML = this.bytesToSize(listItem.size);
                    textContainer.appendChild(fileSize);
                    let statusElement: HTMLElement = this.createElement('span', { className: STATUS });
                    textContainer.appendChild(statusElement);
                    statusElement.innerHTML = listItem.status;
                    liElement.appendChild(textContainer);
                    let iconElement: HTMLElement = this.createElement('span', { className: ' e-icons',
                                                                        attrs: { 'tabindex': this.btnTabIndex } });
                    /* istanbul ignore next */
                    if (this.browserName === 'msie') { iconElement.classList.add('e-msie'); }
                    iconElement.setAttribute('title', this.localizedTexts('remove'));
                    liElement.appendChild(iconElement);
                    EventHandler.add(iconElement, 'click', this.removeFiles, this);
                    if (listItem.statusCode === '2') {
                        statusElement.classList.add(UPLOAD_SUCCESS);
                        iconElement.classList.add(DELETE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('delete'));
                    } else if (listItem.statusCode !== '1') {
                        statusElement.classList.remove(UPLOAD_SUCCESS);
                        statusElement.classList.add(VALIDATION_FAILS);
                    }
                    if (this.autoUpload && listItem.statusCode === '1' && this.asyncSettings.saveUrl !== '') {
                        statusElement.innerHTML = '';
                    }
                    if (!iconElement.classList.contains(DELETE_ICON)) {
                        iconElement.classList.add(REMOVE_ICON);
                    }
                    let index: number = fileData.indexOf(listItem);
                    let eventArgs: RenderingEventArgs = {
                        element: liElement,
                        fileInfo: listItem,
                        index: index,
                        isPreload: this.isPreLoadFile(listItem)
                    };
                    let eventsArgs: FileListRenderingEventArgs = {
                        element: liElement,
                        fileInfo: listItem,
                        index: index,
                        isPreload: this.isPreLoadFile(listItem)
                    };
                    this.trigger('rendering', eventArgs);
                    this.trigger('fileListRendering', eventsArgs);
                    this.listParent.appendChild(liElement);
                    this.fileList.push(liElement);
                    this.truncateName(textElement);
                    let preventActionComplete: boolean = this.flag;
                    if (this.isPreLoadFile(listItem)) {
                        this.flag = false;
                        this.checkActionComplete(true);
                        this.flag = preventActionComplete;
                    }
                }
            }
        }
    }

    private getSlicedName(nameElement: HTMLElement): void {
        let text: string;
        text = nameElement.textContent;
        nameElement.dataset.tail = text.slice(text.length - 10);
    }

    private setListToFileInfo(fileData: FileInfo[], fileList: HTMLElement): void {
        for (let listItem of fileData) {
            listItem.list = fileList;
        }
    }

    private truncateName(name: HTMLElement): void {
        let nameElement: HTMLElement = name;
        if (this.browserName !== 'edge' && nameElement.offsetWidth < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
            /* istanbul ignore next */
        } else if (nameElement.offsetWidth + 1 < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
        }
    }

    private getFileType(name: string): string {
        let extension: string;
        let index: number = name.lastIndexOf('.');
        if (index >= 0) {
            extension = name.substring(index + 1);
        }
        return extension ? extension : '';
    }

    private getFileNameOnly(name: string): string {
        let type: string = this.getFileType(name);
        let names: string[] = name.split('.' + type);
        return type = names[0];
    }

    private setInitialAttributes(): void {
        if (this.initialAttr.accept) { this.element.setAttribute('accept', this.initialAttr.accept); }
        if (this.initialAttr.disabled) { this.element.setAttribute('disabled', 'disabled'); }
        if (this.initialAttr.multiple) {
            let newAttr: Attr = document.createAttribute('multiple');
            this.element.setAttributeNode(newAttr);
        }
    }

    private filterfileList(files : FileInfo[]) : FileInfo[] {
        let filterFiles : FileInfo[] = [];
        let li : HTMLElement;
        for (let i : number = 0;  i < files.length; i++) {
            li = this.getLiElement(files[i]);
            if (!li.classList.contains(UPLOAD_SUCCESS)) {
                filterFiles.push(files[i]);
            }
        }
        return filterFiles;
    }

    private updateStatus(files : FileInfo, status ? : string, statusCode? : string, updateLiStatus : boolean = true ) : FileInfo {
        if (!(status === '' || isNullOrUndefined(status)) && !(statusCode === '' || isNullOrUndefined(statusCode))) {
            if (this.isBlazorSaveUrl) {
                for (let i: number = 0; i < this.filesData.length; i++) {
                    if (this.filesData[i].name === files.name) {
                        this.filesData[i].status = status;
                        this.filesData[i].statusCode = statusCode;
                    }
                }
            } else {
                files.status = status;
                files.statusCode = statusCode;
            }
        }
        if (updateLiStatus) {
            let li : HTMLElement = this.getLiElement(files);
            if (!isNullOrUndefined(li)) {
                if (!isNullOrUndefined(li.querySelector('.' + STATUS)) && !((status === '' || isNullOrUndefined(status)))) {
                    li.querySelector('.' + STATUS).textContent = status;
                }
            }
        }
        return files;
    }

    private getLiElement(files : FileInfo) : HTMLElement {
        let index: number;
        for (let i: number = 0; i < this.filesData.length; i++) {
            if ((!isNullOrUndefined(this.filesData[i].id) && !isNullOrUndefined(files.id)) ? (this.filesData[i].name === files.name &&
                 this.filesData[i].id === files.id) : this.filesData[i].name === files.name) {
                index = i;
            }
        }
        return this.fileList[index];
    }

    private createProgressBar(liElement : Element) : void {
        let progressbarWrapper : Element = this.createElement('span', {className: PROGRESS_WRAPPER});
        let progressBar : Element = this.createElement('progressbar', {className: PROGRESSBAR, attrs: {value : '0', max : '100'}});
        let progressbarInnerWrapper : Element = this.createElement('span', {className: PROGRESS_INNER_WRAPPER});
        progressBar.setAttribute('style', 'width: 0%');
        let progressbarText : Element = this.createElement('span', {className: PROGRESSBAR_TEXT});
        progressbarText.textContent = '0%';
        progressbarInnerWrapper.appendChild(progressBar);
        progressbarWrapper.appendChild(progressbarInnerWrapper);
        progressbarWrapper.appendChild(progressbarText);
        liElement.querySelector('.' + TEXT_CONTAINER).appendChild(progressbarWrapper);
    }

    /* istanbul ignore next */
    private updateProgressbar(e : ProgressEventInit, li : Element) : void {
        if (!isNaN(Math.round((e.loaded / e.total) * 100)) && !isNullOrUndefined(li.querySelector('.' + PROGRESSBAR))) {
            if (!isNullOrUndefined(this.progressInterval) && this.progressInterval !== '') {
                let value : number = (Math.round((e.loaded / e.total) * 100)) % parseInt(this.progressInterval, 10);
                if (value === 0 || value === 100 ) {
                    this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
                }
            } else {
                this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
            }
        }
    }

    private changeProgressValue(li : Element, progressValue : string) : void {
        li.querySelector('.' + PROGRESSBAR).setAttribute('style', 'width:' + progressValue );
        li.querySelector('.' + PROGRESSBAR_TEXT).textContent = progressValue;
    }

    private uploadInProgress (e: ProgressEventInit , files : FileInfo, customUI?: boolean, request?: Ajax) : void {
        let li : HTMLElement = this.getLiElement(files);
        if (isNullOrUndefined(li)  &&  (!customUI)) { return; }
        if (!isNullOrUndefined(li)) {
            /* istanbul ignore next */
            if (files.statusCode === '5') {
                this.cancelUploadingFile(files, e, request, li);
            }
            if (!(li.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0) && li.querySelector('.' + STATUS)) {
                li.querySelector('.' + STATUS).classList.add(UPLOAD_INPROGRESS);
                this.createProgressBar(li);
                this.updateProgressBarClasses(li, UPLOAD_INPROGRESS);
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            }
            this.updateProgressbar(e, <Element>li);
            let iconEle: HTMLElement = li.querySelector('.' + REMOVE_ICON) as HTMLElement;
            if (!isNullOrUndefined(iconEle)) {
                iconEle.classList.add(ABORT_ICON, UPLOAD_INPROGRESS);
                iconEle.setAttribute('title', this.localizedTexts('abort'));
                iconEle.classList.remove(REMOVE_ICON);
            }
        } else {
            this.cancelUploadingFile(files, e, request);
        }
        let args : object = {e, operation: 'upload', file: this.updateStatus(files, this.localizedTexts('inProgress'), '3')};
        this.trigger('progress', args);
    }

    /* istanbul ignore next */
    private cancelUploadingFile(files: FileInfo, e: ProgressEventInit, request?: Ajax, li?: HTMLElement): void {
        if (files.statusCode === '5') {
            let eventArgs: CancelEventArgs = {
                event: e,
                fileData: files,
                cancel: false,
                customFormData : []
            };
            this.trigger('canceling', eventArgs, (eventArgs: CancelEventArgs) => {
                if (eventArgs.cancel) {
                    files.statusCode = '3';
                    if (!isNullOrUndefined(li)) {
                        let spinnerTarget: HTMLElement = li.querySelector('.' + ABORT_ICON) as HTMLElement;
                        if (!isNullOrUndefined(spinnerTarget)) {
                            hideSpinner(spinnerTarget);
                            detach(li.querySelector('.e-spinner-pane'));
                        }
                    }
                } else {
                    request.emitError = false;
                    request.httpRequest.abort();
                    let formData: FormData = new FormData();
                    if (files.statusCode === '5') {
                        let name: string = this.element.getAttribute('name');
                        formData.append(name, files.name);
                        formData.append('cancel-uploading', files.name);
                        this.updateFormData(formData, eventArgs.customFormData);
                        let ajax: Ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
                        ajax.emitError = false;
                        ajax.onLoad = (e: Event): object => { this.removecanceledFile(e, files); return {}; };
                        ajax.send(formData);
                    }
                }
            });
        }
    }

    private removecanceledFile(e: Event, file: FileInfo): void {
        let liElement: HTMLElement = this.getLiElement(file);
        if (liElement.querySelector('.' + RETRY_ICON) || isNullOrUndefined(liElement.querySelector('.' + ABORT_ICON))) { return; }
        this.updateStatus(file, this.localizedTexts('fileUploadCancel'), '5');
        this.renderFailureState(e, file, liElement);
        let spinnerTarget: HTMLElement = liElement.querySelector('.' + REMOVE_ICON ) as HTMLElement;
        if (!isNullOrUndefined(liElement)) {
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
        let requestResponse: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let args: Object = { event: e, response: requestResponse, operation: 'cancel', file: file };
        this.trigger('success', args);
    }

    private renderFailureState(e: Event, file: FileInfo, liElement: HTMLElement): void {
        this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        this.removeProgressbar(liElement, 'failure');
        if (!isNullOrUndefined(liElement.querySelector('.e-file-status'))) {
            liElement.querySelector('.e-file-status').classList.add(UPLOAD_FAILED);
        }
        let deleteIcon: Element = liElement.querySelector('.' + ABORT_ICON);
        if (isNullOrUndefined(deleteIcon)) { return; }
        deleteIcon.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
        deleteIcon.classList.add(REMOVE_ICON);
        deleteIcon.setAttribute('title', this.localizedTexts('remove'));
        this.pauseButton = this.createElement('span', {className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex}});
        deleteIcon.parentElement.insertBefore(this.pauseButton, deleteIcon);
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        let retryElement: HTMLElement = liElement.querySelector('.' + RETRY_ICON) as HTMLElement;
        /* istanbul ignore next */
        retryElement.addEventListener('click', (e: Event) => { this.reloadcanceledFile(e, file, liElement, false); }, false);
    }

    private reloadcanceledFile(e: Event, file: FileInfo, liElement?: HTMLElement, custom?: boolean): void {
        file.statusCode = '1';
        file.status = this.localizedTexts('readyToUploadMessage');
        if (!custom) {
            liElement.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            if (!isNullOrUndefined(liElement.querySelector('.' + RETRY_ICON))) {
                detach(liElement.querySelector('.' + RETRY_ICON));
            }
            this.pauseButton = null;
        }
        /* istanbul ignore next */
        liElement.classList.add(RESTRICT_RETRY);
        this.upload([file]);
    }

    /* istanbul ignore next */
    private uploadComplete(e: Event, file:  FileInfo, customUI ?: boolean) : void {
        let status : XMLHttpRequest = e.target as XMLHttpRequest;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299 ) {
            let li : HTMLElement = this.getLiElement(file);
            if (isNullOrUndefined(li)  &&  (!customUI || isNullOrUndefined(customUI)) ) { return; }
            if (!isNullOrUndefined(li)) {
                this.updateProgressBarClasses(li, UPLOAD_SUCCESS);
                this.removeProgressbar(li, 'success');
                let iconEle: Element = li.querySelector('.' + ABORT_ICON);
                if (!isNullOrUndefined(iconEle)) {
                    iconEle.classList.add(DELETE_ICON);
                    iconEle.setAttribute('title', this.localizedTexts('delete'));
                    iconEle.classList.remove(ABORT_ICON);
                    iconEle.classList.remove(UPLOAD_INPROGRESS);
                }
            }
            this.raiseSuccessEvent(e, file);
        } else  {
            this.uploadFailed(e, file);
        }
    }

    private getResponse(e: Event): Object {
        // tslint:disable-next-line
        let target: any = e.currentTarget;
        let response: Object = {
            readyState: target.readyState,
            statusCode: target.status,
            statusText: target.statusText,
            headers: target.getAllResponseHeaders(),
            withCredentials: target.withCredentials
        };
        return response;
    }

    /* istanbul ignore next */
    private serverRemoveIconBindEvent(): void {
        if (this.uploadWrapper && this.isBlazorSaveUrl) {
            let iconElement: HTMLElement[] = [].slice.call(this.uploadWrapper.querySelectorAll('ul li'));
            for (let i: number = 0; i < iconElement.length; i++ ) {
                let removeIconEle: HTMLElement = (iconElement[i]) ? iconElement[i].querySelector('.e-icons') : null;
                if (removeIconEle) {
                    EventHandler.remove(removeIconEle, 'click', this.removeFiles);
                    EventHandler.add(removeIconEle, 'click', this.removeFiles, this);
                }
            }
        }
    }

    private raiseSuccessEvent(e: Event, file: FileInfo): void {
        let response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let statusMessage: string = this.localizedTexts('uploadSuccessMessage');
        let args: Object = {
            e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '2', false), statusText: statusMessage
        };
        if (!this.isBlazorSaveUrl) {
        let liElement: HTMLElement = this.getLiElement(file);
        if (!isNullOrUndefined(liElement)) {
            let spinnerEle: HTMLElement = liElement.querySelector('.' + SPINNER_PANE) as HTMLElement;
            if (!isNullOrUndefined(spinnerEle)) {
                hideSpinner(liElement);
                detach(spinnerEle);
            }
        }
    }
        this.trigger('success', args, (args: Object) => {
            // tslint:disable-next-line
            this.updateStatus(file, (args as any).statusText, '2');
            this.uploadedFilesData.push(file);
            if (!this.isBlazorSaveUrl) {
                this.trigger('change', { file: this.uploadedFilesData });
            }
            this.checkActionButtonStatus();
            if (this.fileList.length > 0) {
                if ((!(this.getLiElement(file)).classList.contains(RESTRICT_RETRY))) {
                    this.uploadSequential();
                    this.checkActionComplete(true);
                } else {
                    /* istanbul ignore next */
                    (this.getLiElement(file)).classList.remove(RESTRICT_RETRY);
                }
            }
        });
    }

    private uploadFailed(e: Event, file: FileInfo): void {
        let li: HTMLElement = this.getLiElement(file);
        let response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let statusMessage: string = this.localizedTexts('uploadFailedMessage');
        let args: Object = {
            e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '0', false), statusText: statusMessage
        };
        if (!isNullOrUndefined(li)) { this.renderFailureState(e, file, li); }
        this.trigger('failure', args, (args: Object) => {
            // tslint:disable-next-line
            this.updateStatus(file, (args as any).statusText, '0');
            this.checkActionButtonStatus();
            this.uploadSequential();
            this.checkActionComplete(true);
        });
    }

    private uploadSequential() : void {
        if (this.sequentialUpload) {
            if (this.autoUpload) {
                /* istanbul ignore next */
                this.checkAutoUpload(this.filesData);
            } else {
                this.uploadButtonClick();
            }
        }
    }

    private checkActionComplete(increment: boolean): void {
        increment ? ++this.actionCompleteCount : --this.actionCompleteCount;
        this.raiseActionComplete();
    }

    private raiseActionComplete(): void {
        if ((this.filesData.length === this.actionCompleteCount) && this.flag) {
            this.flag = false;
            let eventArgs: ActionCompleteEventArgs = {
                fileData: []
            };
            eventArgs.fileData =  this.getSelectedFileStatus(this.selectedFiles);
            this.trigger('actionComplete', eventArgs);
        }
    }

    private getSelectedFileStatus(selectedFiles: FileInfo[]): FileInfo[] {
        let matchFiles: FileInfo [] = [];
        let matchFilesIndex: number = 0;
        for ( let selectFileIndex: number =  0 ; selectFileIndex < selectedFiles.length; selectFileIndex++ ) {
            let selectedFileData: FileInfo = selectedFiles[selectFileIndex];
            for ( let fileDataIndex: number = 0 ; fileDataIndex < this.filesData.length; fileDataIndex++ ) {
                if ( this.filesData[fileDataIndex].name === selectedFileData.name ) {
                    matchFiles[matchFilesIndex] = this.filesData[fileDataIndex];
                    ++matchFilesIndex;
                }
            }
        }
        return matchFiles;
    }

    private updateProgressBarClasses (li : HTMLElement, className : string) : void {
        let progressBar: HTMLElement = <HTMLElement>li.querySelector('.' + PROGRESSBAR);
        if (!isNullOrUndefined(progressBar)) {
            progressBar.classList.add(className);
        }
    }

    private removeProgressbar(li : HTMLElement, callType : string) : void {
        if (!isNullOrUndefined(li.querySelector('.' + PROGRESS_WRAPPER))) {
            this.progressAnimation = new Animation({ duration: 1250 });
            this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + PROGRESS_WRAPPER), {name: 'FadeOut'});
            this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + PROGRESSBAR_TEXT), {name: 'FadeOut'});
            setTimeout(() => { this.animateProgressBar(li, callType); }, 750);
        }
    }

    /* istanbul ignore next */
    private animateProgressBar(li: Element, callType: string) : void {
        if (callType === 'success') {
            li.classList.add(UPLOAD_SUCCESS);
            if (!isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + STATUS), {name: 'FadeIn'});
                li.querySelector('.' + STATUS).classList.add(UPLOAD_SUCCESS);
            }
        } else {
            if (!isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + STATUS), {name: 'FadeIn'});
                li.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
            }
        }
        if (li.querySelector('.' + PROGRESS_WRAPPER)) { detach(li.querySelector('.' + PROGRESS_WRAPPER)); }
    }

    private setExtensions(extensions : string): void {
        if (extensions !== '' && !isNullOrUndefined(extensions)) {
            this.element.setAttribute('accept', extensions);
        } else {
            this.element.removeAttribute('accept');
        }
    }

    private templateComplier(uploadTemplate: string): Function {
        if (uploadTemplate) {
            let exception: Object;
            try {
                if (selectAll(uploadTemplate, document).length) {
                    return compile(select(uploadTemplate, document).innerHTML.trim());
                }
            } catch (exception) {
                return compile(uploadTemplate);
            }
        }
        return undefined;
    }

    private setRTL() : void {
        this.enableRtl ? addClass([this.uploadWrapper], RTL) : removeClass([this.uploadWrapper], RTL);
    }

    private localizedTexts(localeText : string): string {
        this.l10n.setLocale(this.locale);
        return this.l10n.getConstant(localeText);
    }

    private setControlStatus() : void {
        if (!this.enabled) {
            this.uploadWrapper.classList.add(DISABLED);
            this.element.setAttribute('disabled', 'disabled');
            this.browseButton.setAttribute('disabled', 'disabled');
            if (!isNullOrUndefined(this.clearButton)) {
                this.clearButton.setAttribute('disabled', 'disabled');
            }
            if (!isNullOrUndefined(this.uploadButton)) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            }
        } else {
            if (this.uploadWrapper.classList.contains(DISABLED)) {
                this.uploadWrapper.classList.remove(DISABLED);
            }
            if (!isNullOrUndefined(this.browseButton) && this.element.hasAttribute('disabled')) {
                this.element.removeAttribute('disabled');
                this.browseButton.removeAttribute('disabled');
            }
            if (!isNullOrUndefined(this.clearButton) && this.clearButton.hasAttribute('disabled')) {
                this.clearButton.removeAttribute('disabled');
            }
            if (!isNullOrUndefined(this.uploadButton) && this.uploadButton.hasAttribute('disabled')) {
                this.uploadButton.hasAttribute('disabled');
            }
        }
    }

    private checkHTMLAttributes(isDynamic: boolean) : void {
        let attributes: string[] = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['accept', 'multiple', 'disabled'];
        for (let prop of attributes) {
            if (!isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'accept':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['allowedExtensions'] === undefined)) 
                        || isDynamic) {
                        this.setProperties({allowedExtensions: this.element.getAttribute('accept')}, !isDynamic);
                        this.initialAttr.accept = this.allowedExtensions;
                        }
                    break;
                    case 'multiple':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['multiple'] === undefined)) || isDynamic) {
                            let isMutiple: boolean = this.element.getAttribute(prop) === 'multiple' ||
                                this.element.getAttribute(prop) === '' || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({multiple: isMutiple}, !isDynamic);
                            this.initialAttr.multiple = true;
                        }
                    break;
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['enabled'] === undefined)) || isDynamic) {
                            let isDisabled: boolean = this.element.getAttribute(prop) === 'disabled' ||
                                this.element.getAttribute(prop) === '' || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({enabled: isDisabled}, !isDynamic);
                            this.initialAttr.disabled = true;
                        }
                    }
                }
            }
        }

    private chunkUpload(file: FileInfo, custom?: boolean, fileIndex?: number): void {
        let start: number = 0;
        let end: number = Math.min(this.asyncSettings.chunkSize, file.size);
        let index: number = 0;
        let blob: string | Blob = file.rawFile.slice(start, end);
        let metaData: MetaData = { chunkIndex: index, blob: blob, file: file, start: start, end: end, retryCount: 0, request: null };
        this.sendRequest(file, metaData, custom, fileIndex);
    }

    private sendRequest(file: FileInfo, metaData: MetaData, custom?: boolean, fileIndex?: number): void {
        let formData: FormData = new FormData();
        let cloneFile: string | Blob;
        let blob: string | Blob = file.rawFile.slice(metaData.start, metaData.end);
        formData.append('chunkFile', blob, file.name);
        formData.append(this.uploaderName, blob, file.name);
        formData.append('chunk-index', metaData.chunkIndex.toString());
        formData.append('chunkIndex', metaData.chunkIndex.toString());
        let totalChunk: number = Math.max(Math.ceil(file.size / this.asyncSettings.chunkSize), 1);
        formData.append('total-chunk', totalChunk.toString());
        formData.append('totalChunk', totalChunk.toString());
        let ajax: Ajax = new Ajax({ url: this.asyncSettings.saveUrl, type: 'POST', async: true, contentType: null });
        ajax.emitError = false;
        ajax.onLoad = (e: Event): object => { this.chunkUploadComplete(e, metaData, custom); return {}; };
        ajax.onUploadProgress = (e: Event) => {
            this.chunkUploadInProgress(e, metaData, custom);
            return {};
        };
        let eventArgs: UploadingEventArgs = {
            fileData: file,
            customFormData: [],
            cancel: false,
            chunkSize: this.asyncSettings.chunkSize === 0 ? null : this.asyncSettings.chunkSize
        };
        ajax.beforeSend = (e: BeforeSendEventArgs) => {
            eventArgs.currentRequest = ajax.httpRequest;
            eventArgs.currentChunkIndex = metaData.chunkIndex;
            /* istanbul ignore next */
            if (isBlazor()) {
                if (this.currentRequestHeader) {
                    this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
                }
                if (this.customFormDatas) {
                    this.updateFormData(formData, this.customFormDatas);
                }
            }
            if (eventArgs.currentChunkIndex === 0) {
                // This event is currently not required but to avoid breaking changes for previous customer, we have included.
                this.trigger('uploading', eventArgs, (eventArgs: UploadingEventArgs) => {
                    this.uploadingEventCallback(formData, eventArgs, e, file);
                });
            } else {
                this.trigger('chunkUploading', eventArgs, (eventArgs: UploadingEventArgs) => {
                    this.uploadingEventCallback(formData, eventArgs, e, file);
                });
            }
        };
        /* istanbul ignore next */
        ajax.onError = (e: Event) => { this.chunkUploadFailed(e, metaData, custom); return {}; };
        ajax.send(formData);
        metaData.request = ajax;
    }

    private uploadingEventCallback(formData: FormData, eventArgs: UploadingEventArgs, e: BeforeSendEventArgs, file: FileInfo): void {
        if (eventArgs.cancel) {
            this.eventCancelByArgs(e, eventArgs, file);
        } else {
            this.updateFormData(formData, eventArgs.customFormData);
        }
    }

    private eventCancelByArgs(e: BeforeSendEventArgs, eventArgs: UploadingEventArgs, file: FileInfo): void {
        e.cancel = true;
        if (eventArgs.fileData.statusCode === '5') { return; }
        eventArgs.fileData.statusCode = '5';
        eventArgs.fileData.status = this.localizedTexts('fileUploadCancel');
        let liElement: HTMLElement = this.getLiElement(eventArgs.fileData);
        if (liElement) {
            if (!isNullOrUndefined(liElement.querySelector('.' + STATUS))) {
                liElement.querySelector('.' + STATUS).innerHTML = this.localizedTexts('fileUploadCancel');
                liElement.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
            }
            this.pauseButton = this.createElement('span', {className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex}});
            let removeIcon: Element = liElement.querySelector('.' + REMOVE_ICON);
            if (removeIcon) {
                removeIcon.parentElement.insertBefore(this.pauseButton, removeIcon);
            }
            this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
            /* istanbul ignore next */
            this.pauseButton.addEventListener('click', (e: Event) => { this.reloadcanceledFile(e, file, liElement); }, false);
            this.checkActionButtonStatus();
        }
    }

    private checkChunkUpload(): boolean {
        return (this.asyncSettings.chunkSize <= 0 || isNullOrUndefined(this.asyncSettings.chunkSize)) ? false : true;
    }

    private chunkUploadComplete(e: Event, metaData: MetaData, custom?: boolean): void {
        let response: XMLHttpRequest = e.target as XMLHttpRequest;
        let liElement: HTMLElement;
        if (response.readyState === 4 && response.status >= 200 && response.status < 300) {
            let requestResponse: Object = e && e.currentTarget ? this.getResponse(e) : null;
            let totalChunk: number = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
            let eventArgs: Object = {
                event: e,
                file: metaData.file,
                chunkIndex: metaData.chunkIndex,
                totalChunk: totalChunk,
                chunkSize: this.asyncSettings.chunkSize,
                response: requestResponse
            };
            this.trigger('chunkSuccess', eventArgs);
            if (isNullOrUndefined(custom) || !custom) { liElement = this.getLiElement(metaData.file); }
            this.updateMetaData(metaData);
            if (metaData.end === metaData.file.size) {
                metaData.file.statusCode = '3';
            }
            if (metaData.file.statusCode === '5') {
                let eventArgs: CancelEventArgs = { event: e, fileData: metaData.file, cancel: false, customFormData: [] };
                this.trigger('canceling', eventArgs, (eventArgs: CancelEventArgs) => {
                    /* istanbul ignore next */
                    if (eventArgs.cancel) {
                        metaData.file.statusCode = '3';
                        let spinnerTarget: HTMLElement = liElement.querySelector('.' + ABORT_ICON) as HTMLElement;
                        if (!isNullOrUndefined(liElement) && !isNullOrUndefined(spinnerTarget)) {
                            hideSpinner(spinnerTarget);
                            detach(liElement.querySelector('.e-spinner-pane'));
                        }
                        this.sendNextRequest(metaData);
                    } else {
                        metaData.request.emitError = false;
                        response.abort();
                        let formData: FormData = new FormData();
                        let name: string = this.element.getAttribute('name');
                        formData.append(name, metaData.file.name);
                        formData.append('cancel-uploading', metaData.file.name);
                        formData.append('cancelUploading', metaData.file.name);
                        this.updateFormData(formData, eventArgs.customFormData);
                        let ajax: Ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
                        ajax.emitError = false;
                        ajax.onLoad = (e: Event): object => { this.removeChunkFile(e, metaData, custom); return {}; };
                        ajax.send(formData);
                    }
                });
            } else {
                if ((totalChunk - 1) === metaData.chunkIndex && totalChunk > metaData.chunkIndex) {
                    let index: number = this.pausedData.indexOf(metaData);
                    if (index >= 0) {
                        this.pausedData.splice(index, 1);
                    }
                    if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
                        if (liElement) { detach(liElement.querySelector('.' + PAUSE_UPLOAD)); }
                        this.removeChunkProgressBar(metaData);
                    }
                    this.raiseSuccessEvent(e, metaData.file);
                    return;
                }
                this.sendNextRequest(metaData);
            }
        } else {
            this.chunkUploadFailed(e, metaData);
        }
    }

    private sendNextRequest(metaData: MetaData): void {
        metaData.start = metaData.end;
        metaData.end += this.asyncSettings.chunkSize;
        metaData.end = Math.min(metaData.end, metaData.file.size);
        metaData.chunkIndex += 1;
        this.sendRequest(metaData.file, metaData);
    }

    private removeChunkFile(e: Event, metaData: MetaData, custom: boolean): void {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) && !custom)) {
            let liElement: HTMLElement = this.getLiElement(metaData.file);
            let deleteIcon: Element = liElement.querySelector('.' + ABORT_ICON);
            let spinnerTarget: HTMLElement = deleteIcon as HTMLElement;
            this.updateStatus(metaData.file, this.localizedTexts('fileUploadCancel'), '5');
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
            this.removeProgressbar(liElement, 'failure');
            deleteIcon.classList.remove(ABORT_ICON);
            deleteIcon.classList.add(REMOVE_ICON);
            deleteIcon.setAttribute('title', this.localizedTexts('remove'));
            let pauseIcon: Element = liElement.querySelector('.' + PAUSE_UPLOAD);
            pauseIcon.classList.add(RETRY_ICON);
            pauseIcon.classList.remove(PAUSE_UPLOAD);
            pauseIcon.setAttribute('title', this.localizedTexts('retry'));
            if (!isNullOrUndefined(liElement) && !isNullOrUndefined(deleteIcon)) {
                hideSpinner(spinnerTarget);
                detach(liElement.querySelector('.e-spinner-pane'));
            }
        }
    }

    private pauseUpload(metaData: MetaData, e?: Event, custom?: boolean): void {
        metaData.file.statusCode = '4';
        metaData.file.status = this.localizedTexts('pause');
        this.updateMetaData(metaData);
        let eventArgs: PauseResumeEventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.abortUpload(metaData, custom, eventArgs);
    }

    private abortUpload(metaData: MetaData, custom: boolean, eventArgs?: PauseResumeEventArgs): void {
        metaData.request.emitError = false;
        metaData.request.httpRequest.abort();
        let liElement: HTMLElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) ) {
            let targetElement: HTMLElement = liElement.querySelector('.' + PAUSE_UPLOAD) as HTMLElement;
            targetElement.classList.remove(PAUSE_UPLOAD);
            targetElement.classList.add(RESUME_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('resume'));
            targetElement.nextElementSibling.classList.add(REMOVE_ICON);
            targetElement.nextElementSibling.classList.remove(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('remove'));
        }
        for (let i: number = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].file.name === metaData.file.name) {
                this.pausedData.splice(i, 1);
            }
        }
        this.pausedData.push(metaData);
        this.trigger('pausing', eventArgs);
    }
    private resumeUpload(metaData: MetaData, e?: Event, custom?: boolean): void {
        let liElement: HTMLElement = this.getLiElement(metaData.file);
        let targetElement: Element;
        if (!isNullOrUndefined(liElement)) {
            targetElement = liElement.querySelector('.' + RESUME_UPLOAD);
        }
        if (!isNullOrUndefined(targetElement) && (isNullOrUndefined(custom) || !custom)) {
            targetElement.classList.remove(RESUME_UPLOAD);
            targetElement.classList.add(PAUSE_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('pause'));
            targetElement.nextElementSibling.classList.remove(REMOVE_ICON);
            targetElement.nextElementSibling.classList.add(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('abort'));
        }
        metaData.file.status = this.localizedTexts('inProgress');
        metaData.file.statusCode = '3';
        this.updateMetaData(metaData);
        let eventArgs: PauseResumeEventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.trigger('resuming', eventArgs);
        for (let i: number = 0; i < this.pausedData.length; i++ ) {
            if (this.pausedData[i].end === this.pausedData[i].file.size ) {
               this.chunkUploadComplete(e, metaData, custom);
            } else {
                if (this.pausedData[i].file.name === metaData.file.name) {
                    this.pausedData[i].start = this.pausedData[i].end;
                    this.pausedData[i].end = this.pausedData[i].end + this.asyncSettings.chunkSize;
                    this.pausedData[i].end = Math.min(this.pausedData[i].end, this.pausedData[i].file.size);
                    this.pausedData[i].chunkIndex = this.pausedData[i].chunkIndex + 1;
                    this.sendRequest(this.pausedData[i].file, this.pausedData[i], custom);
                }
            }
        }
    }

    private updateMetaData(metaData : MetaData): void {
        if (this.uploadMetaData.indexOf(metaData) === -1) {
            this.uploadMetaData.push(metaData);
        } else {
            this.uploadMetaData.splice(this.uploadMetaData.indexOf(metaData), 1);
            this.uploadMetaData.push(metaData);
        }
    }

    private removeChunkProgressBar(metaData: MetaData): void {
        let liElement: HTMLElement = this.getLiElement(metaData.file);
        if (!isNullOrUndefined(liElement)) {
            this.updateProgressBarClasses(liElement, UPLOAD_SUCCESS);
            this.removeProgressbar(liElement, 'success');
            let cancelButton: Element = liElement.querySelector('.' + ABORT_ICON);
            if (!isNullOrUndefined(cancelButton)) {
                cancelButton.classList.add(DELETE_ICON);
                cancelButton.setAttribute('title', this.localizedTexts('delete'));
                cancelButton.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
            }
        }
    }

    private chunkUploadFailed(e: Event, metaData: MetaData, custom?: boolean): void {
        let chunkCount: number = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
        let liElement : HTMLElement;
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            liElement = this.getLiElement(metaData.file);
        }
        let requestResponse: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let eventArgs: Object = {
            event: e,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            totalChunk: chunkCount,
            chunkSize: this.asyncSettings.chunkSize,
            cancel: false,
            response: requestResponse
        };
        this.trigger('chunkFailure', eventArgs, (eventArgs: Object) => {
            // To prevent triggering of failure event
        // tslint:disable-next-line
        if (!(<any>eventArgs).cancel) {
            if (metaData.retryCount < this.asyncSettings.retryCount) {
                setTimeout(() => { this.retryRequest(liElement, metaData, custom); }, this.asyncSettings.retryAfterDelay);
            } else {
                if (!isNullOrUndefined(liElement)) {
                    let pauseButton: Element = liElement.querySelector('.' + PAUSE_UPLOAD) ?
                    liElement.querySelector('.' + PAUSE_UPLOAD) : liElement.querySelector('.' + RESUME_UPLOAD);
                    if (!isNullOrUndefined(pauseButton)) {
                        pauseButton.classList.add(RETRY_ICON);
                        pauseButton.classList.remove(PAUSE_UPLOAD, RESUME_UPLOAD);
                    }
                    this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
                    this.removeProgressbar(liElement, 'failure');
                    liElement.querySelector('.e-icons').classList.remove(UPLOAD_INPROGRESS);
                    let iconElement: Element = liElement.querySelector('.' + ABORT_ICON) ?
                        liElement.querySelector('.' + ABORT_ICON) : liElement.querySelector('.' + REMOVE_ICON);
                    iconElement.classList.remove(ABORT_ICON);
                    if (!isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD))) {
                        detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                    }
                    if (metaData.start > 0) {
                        iconElement.classList.add(DELETE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('delete'));
                    } else {
                        iconElement.classList.add(REMOVE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('remove'));
                    }
                }
                metaData.retryCount = 0;
                let file: FileInfo = metaData.file;
                let failureMessage: string = this.localizedTexts('uploadFailedMessage');
                let args: Object = {
                    e, response: requestResponse,
                    operation: 'upload',
                    file: this.updateStatus(file, failureMessage, '0', false),
                    statusText: failureMessage
                };
                this.trigger('failure', args, (args: Object) => {
                // tslint:disable-next-line
                this.updateStatus(file, (args as any).statusText, '0');
                this.uploadSequential();
                this.checkActionComplete(true);
                });
            }
        }
        });
    }

    private retryRequest(liElement: HTMLElement, metaData: MetaData, custom?: boolean): void {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        }
        metaData.retryCount += 1;
        this.sendRequest(metaData.file, metaData);
    }

    private checkPausePlayAction(e: Event): void {
        let targetElement: HTMLElement = e.target as HTMLElement;
        let selectedElement: HTMLElement = (<HTMLInputElement>e.target).parentElement;
        let index: number = this.fileList.indexOf(selectedElement);
        let fileData: FileInfo = this.filesData[index];
        let metaData: MetaData = this.getCurrentMetaData(fileData);
        if (targetElement.classList.contains(PAUSE_UPLOAD)) {
            /* istanbul ignore next */
            this.pauseUpload(metaData, e);
        } else if (targetElement.classList.contains(RESUME_UPLOAD)) {
            /* istanbul ignore next */
            this.resumeUpload(metaData, e);
        } else if (targetElement.classList.contains(RETRY_ICON)) {
            if (metaData.file.status === this.localizedTexts('fileUploadCancel')) {
                this.retryUpload(metaData, false);
            } else {
                this.retryUpload(metaData, true);
            }
        }
    }

    private retryUpload(metaData: MetaData, fromcanceledStage: boolean): void {
        if (fromcanceledStage) {
            metaData.end = metaData.end + this.asyncSettings.chunkSize;
            metaData.start = metaData.start + this.asyncSettings.chunkSize;
            this.sendRequest(metaData.file, metaData);
        } else {
            metaData.file.statusCode = '1';
            metaData.file.status = this.localizedTexts('readyToUploadMessage');
            this.chunkUpload(metaData.file);
        }
        /* istanbul ignore next */
        (this.getLiElement(metaData.file)).classList.add(RESTRICT_RETRY);
    }

    private chunkUploadInProgress(e: ProgressEventInit, metaData: MetaData, custom?: boolean): void {
        if (metaData.file.statusCode === '4')  { return; }
        if (metaData.file.statusCode !== '4' && metaData.file.statusCode !== '5') {
            metaData.file.statusCode = '3';
            metaData.file.status = this.localizedTexts('inProgress');
        }
        this.updateMetaData(metaData);
        let liElement: HTMLElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(liElement)) { return; }
        let target: Element;
        let retryElement: Element = liElement.querySelector('.' + RETRY_ICON);
        if (!isNullOrUndefined(retryElement)) {
            retryElement.classList.add(PAUSE_UPLOAD);
            retryElement.setAttribute('title', this.localizedTexts('pause'));
            retryElement.classList.remove(RETRY_ICON);
        }
        if (!isNullOrUndefined(liElement)) {
            if (!(liElement.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0)) {
                let statusElement: Element = liElement.querySelector('.' + STATUS);
                if ( isNullOrUndefined(this.template)) {
                    statusElement.classList.add(UPLOAD_INPROGRESS);
                    statusElement.classList.remove(UPLOAD_FAILED);
                    this.createProgressBar(liElement);
                    this.updateProgressBarClasses(liElement, UPLOAD_INPROGRESS);
                }
                let clearIcon: Element = liElement.querySelector('.' + REMOVE_ICON) ? liElement.querySelector('.' + REMOVE_ICON) :
                liElement.querySelector('.' + DELETE_ICON);
                if (!isNullOrUndefined(clearIcon)) {
                    clearIcon.classList.add(ABORT_ICON);
                    clearIcon.setAttribute('title', this.localizedTexts('abort'));
                    clearIcon.classList.remove(REMOVE_ICON);
                }
            }
            if (!isNaN(Math.round((e.loaded / e.total) * 100)) && isNullOrUndefined(this.template) && metaData.file.statusCode !== '4' ) {
                let loadedSize: number =  (metaData.chunkIndex * this.asyncSettings.chunkSize);
                let currentLoaded: number = e.loaded;
                if (currentLoaded > this.asyncSettings.chunkSize) {
                    currentLoaded = this.asyncSettings.chunkSize;
                }
                let value: number = Math.min((((loadedSize + currentLoaded) / metaData.file.size) * 100), 100);
                this.changeProgressValue(liElement, Math.round(value).toString() + '%');
            }
            if (metaData.chunkIndex === 0) {
                this.checkActionButtonStatus();
            }
        }
        if (isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD)) && isNullOrUndefined(this.template) ) {
            this.pauseButton = this.createElement('span', {className: 'e-icons e-file-pause-btn', attrs: { 'tabindex': this.btnTabIndex }});
            if (this.browserName === 'msie') { this.pauseButton.classList.add('e-msie'); }
            let abortIcon: Element = liElement.querySelector('.' + ABORT_ICON);
            abortIcon.parentElement.insertBefore(this.pauseButton, abortIcon);
            this.pauseButton.setAttribute('title', this.localizedTexts('pause'));
            this.pauseButton.addEventListener('click', (e: Event) => { this.checkPausePlayAction(e); }, false);
        }
    }

    /**
     * It is used to convert bytes value into kilobytes or megabytes depending on the size based
     * on [binary prefix](https://en.wikipedia.org/wiki/Binary_prefix).
     * @param { number } bytes - specifies the file size in bytes.
     * @returns string
     */
    public bytesToSize(bytes : number) : string {
        let i : number = -1;
        let size : number;
        if (!bytes) {
            return '0.0 KB';
        }
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);
        if (i >= 2) {
            bytes = bytes * 1024;
            i = 1;
        }
        return Math.max(bytes, 0).toFixed(1) + ' ' + ['KB', 'MB'][i];
    }

    /**
     * Allows you to sort the file data alphabetically based on its file name clearly.
     * @param { FileList } filesData - specifies the files data for upload.
     * @returns File[]
     */
    /* istanbul ignore next */
    public sortFileList(filesData?: FileList): File[] {
        filesData = filesData ? filesData : this.sortFilesList;
        let files: FileList = filesData;
        let fileNames: string[] = [];
        for (let i: number = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        let sortedFileNames: string[] = fileNames.sort();
        let sortedFilesData: File[] = [];
        let index: number = 0;
        for (let name of sortedFileNames) {
            for (let i: number = 0; i < files.length; i++) {
                if (name === files[i].name) {
                    sortedFilesData.push(files[i]);
                }
            }
        }
        return sortedFilesData;
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    public destroy(): void {
        this.element.value = null;
        this.clearTemplate();
        if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            this.clearAll();
        }
        this.unWireEvents();
        this.unBindDropEvents();
        if (this.multiple) {
            this.element.removeAttribute('multiple');
        }
        if (!this.enabled) {
            this.element.removeAttribute('disabled');
        }
        this.element.removeAttribute('accept');
        this.setInitialAttributes();
        let attributes: string[] = ['aria-label', 'directory', 'webkitdirectory', 'tabindex'];
        for (let key of attributes) {
            this.element.removeAttribute(key);
        }
        if (!this.isServerBlazor) {
            if (!isNullOrUndefined(this.uploadWrapper)) {
                this.uploadWrapper.parentElement.appendChild(this.element);
                detach(this.uploadWrapper);
            }
            this.uploadWrapper = null;
            super.destroy();
        } else {
            this.uploadWrapper = null;
        }
    }

    /**
     * Allows you to call the upload process manually by calling save URL action.
     * To process the selected files (added in upload queue), pass an empty argument otherwise
     * upload the specific file based on its argument. 
     * @param { FileInfo | FileInfo[] } files - specifies the files data for upload.
     * @returns void
     */
    public upload(files?: FileInfo | FileInfo[], custom?: boolean): void {
        files = files ? files : this.filesData;
        if (this.sequentialUpload && (this.isFirstFileOnSelection || custom)) {
            this.sequenceUpload(files as FileInfo[]);
        } else {
            let uploadFiles: FileInfo[] = this.getFilesInArray(files);
            let eventArgs: BeforeUploadEventArgs = {
                customFormData: [],
                currentRequest: null,
                cancel: false
            };
            this.trigger('beforeUpload', eventArgs, (eventArgs: BeforeUploadEventArgs) => {
                if (!eventArgs.cancel) {
                    if (isBlazor()) {
                        this.currentRequestHeader = eventArgs.currentRequest ? eventArgs.currentRequest : this.currentRequestHeader;
                        this.customFormDatas = (eventArgs.customFormData && eventArgs.customFormData.length > 0) ?
                            eventArgs.customFormData : this.customFormDatas;
                    }
                    this.uploadFiles(uploadFiles, custom);
                }
            });
        }
    }
    private getFilesInArray(files: FileInfo | FileInfo[]):  FileInfo[] {
        let  uploadFiles:  FileInfo[]  =  [];
        if  (files  instanceof  Array) {
            uploadFiles  =  files;
        }  else  {
            uploadFiles.push(files);
        }
        return uploadFiles;
    }

    /* istanbul ignore next */
    private serverReadFileBase64(fileIndex: number, position: number, totalCount: number) : Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
        let file: Blob = this.fileStreams[fileIndex].rawFile as Blob;
        try {
                let reader: FileReader  = new FileReader();
                // tslint:disable-next-line
                reader.onload = ((args: any) => {
                    return () => {
                        try {
                            let contents: string = args.result as string;
                            let data: string = contents ? contents.split(';base64,')[1] : null;
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    };
                })(reader);
                reader.readAsDataURL(file.slice(position, position + totalCount));
            } catch (e) {
                reject(e);
            }
        });
    }

    /* istanbul ignore next */
    private uploadFileCount(ele: Element): number {
        let files: FileInfo[] = this.filesData;
        if (!files || files.length === 0) {
            return -1;
        }
        let result: number = files.length;
        return result;
    }

    /* istanbul ignore next */
    private getFileRead(index: number, ele: Element): number {
        let files: FileInfo[] = this.filesData;
        if (!files || files.length === 0) {
            return -1;
        }
        let file: FileInfo = files[index];
        let fileCount: number = this.newFileRef++;
        this.fileStreams[fileCount] = file;
        return fileCount;
    }

    /* istanbul ignore next */
    private getFileInfo(index: number, ele: Element): FileInfo {
        let files: FileInfo[] = this.filesData;
        if (!files || files.length === 0) {
            return null;
        }
        let file: FileInfo = files[index];
        if (!file) {
            return null;
        }
        return this.filesData[index];
    }

    private uploadFiles(files: FileInfo[], custom?: boolean): void {
        let selectedFiles: FileInfo[] = [];
        if (this.asyncSettings.saveUrl === '' || isNullOrUndefined(this.asyncSettings.saveUrl)) {
            if (this.isServerBlazor) {
                // tslint:disable-next-line
                (this as any).interopAdaptor.invokeMethodAsync('GetFileDetails', files);
            }
            return;
        }
        if (!custom || isNullOrUndefined(custom)) {
            if (!this.multiple) {
                let file: FileInfo[] = [];
                file.push(files[0]);
                selectedFiles = this.filterfileList(file);
            } else {
                selectedFiles = this.filterfileList(files);
            }
        } else {
            selectedFiles = files;
        }
        for (let i: number = 0; i < selectedFiles.length; i++) {
            if (this.isServerBlazor && !this.checkChunkUpload()) {
				/* istanbul ignore next */
                /* tslint:disable */
                if (selectedFiles[i] && selectedFiles[i].rawFile instanceof File) {
                    this.getBase64(selectedFiles[i].rawFile as File).then((data: any) => {
                        this.base64String.push(data);
                        this.uploadFilesRequest(selectedFiles, i, custom);
                    });
                }
                /* tslint:disable */
            } else {
                this.uploadFilesRequest(selectedFiles, i, custom);
            }
        }
    }

    private uploadFilesRequest(selectedFiles: FileInfo[], i: number, custom?: boolean): void {
        let cloneFiles: Blob[] = [];
        let chunkEnabled: boolean = this.checkChunkUpload();
        let ajax: Ajax = new Ajax(this.asyncSettings.saveUrl, 'POST', true, null);
        ajax.emitError = false;
        let getFileData: FileInfo[];
        /* istanbul ignore next */
        if (this.isServerBlazor) {
            getFileData = selectedFiles.slice(0);
            cloneFiles.push(getFileData[i].rawFile as Blob);
        }
        let eventArgs: UploadingEventArgs = {
            fileData: (this.isServerBlazor) ? getFileData[i] : selectedFiles[i],
            customFormData: [],
            cancel: false
        };
        let formData: FormData = new FormData();
        ajax.beforeSend = (e: BeforeSendEventArgs) => {
            eventArgs.currentRequest = ajax.httpRequest;
            /* istanbul ignore next */
            if (isBlazor()) {
                eventArgs.fileData.rawFile = !chunkEnabled ? this.base64String[i] : eventArgs.fileData.rawFile;
                if (this.currentRequestHeader) {
                    this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
                }
                if (this.customFormDatas) {
                    this.updateFormData(formData, this.customFormDatas);
                }
            }
            this.trigger('uploading', eventArgs, (eventArgs: UploadingEventArgs) => {
                /* istanbul ignore next */
                if (this.isServerBlazor && !chunkEnabled) { selectedFiles[i].rawFile = eventArgs.fileData.rawFile = cloneFiles[i]; }
                if (eventArgs.cancel) {
                    this.eventCancelByArgs(e, eventArgs, selectedFiles[i]);
                }
                this.updateFormData(formData, eventArgs.customFormData);
            });
        };
        if (selectedFiles[i].statusCode === '1') {
            let name: string = this.element.getAttribute('name');
            formData.append(name, selectedFiles[i].rawFile, selectedFiles[i].name);
            if (chunkEnabled && selectedFiles[i].size > this.asyncSettings.chunkSize) {
                this.chunkUpload(selectedFiles[i], custom, i);
            } else {
                ajax.onLoad = (e: Event): object => {
                    if (eventArgs.cancel && this.isServerBlazor) {
                        return {};
                    } else {
                        this.uploadComplete(e, selectedFiles[i], custom);
                        return {};
                    }
                };
                ajax.onUploadProgress = (e: Event): object => {
                    if (eventArgs.cancel && this.isServerBlazor) {
                        return {};
                    } else {
                        this.uploadInProgress(e, selectedFiles[i], custom, ajax);
                        return {};
                    }
                };
                /* istanbul ignore next */
                ajax.onError = (e: Event) => { this.uploadFailed(e, selectedFiles[i]); return {}; };
                ajax.send(formData);
            }
        }
    }

    private spliceFiles(liIndex: number): void {
        let liElement: HTMLElement = this.fileList[liIndex];
        let allFiles: FileInfo[] = this.getFilesData();
        let nameElements: number = +liElement.getAttribute('data-files-count');
        let startIndex: number = 0 ;
        for (let i: number = 0; i < liIndex; i++ ) {
            startIndex += (+this.fileList[i].getAttribute('data-files-count'));
        }
        let endIndex: number = (startIndex + nameElements) - 1;
        for (let j: number = endIndex; j >= startIndex; j--) {
            allFiles.splice(j, 1);
        }
    }

    /**
     * Remove the uploaded file from server manually by calling the remove URL action.
     * If you pass an empty argument to this method, the complete file list can be cleared,
     * otherwise remove the specific file based on its argument (“file_data”).
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to remove from file list/server.
     * @param { boolean } customTemplate - Set true if the component rendering with customize template.
     * @param { boolean } removeDirectly - Set true if files remove without removing event.
     * @param { boolean } postRawFile - Set false, to post file name only to the remove action.
     * @returns void
     */
    public remove(
        fileData?: FileInfo | FileInfo[], customTemplate?: boolean, removeDirectly?: boolean,
        postRawFile?: boolean, args?: MouseEvent | TouchEvent | KeyboardEventArgs): void {
        if (isNullOrUndefined(postRawFile)) {
            postRawFile = true;
        }
        let eventArgs: RemovingEventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            customFormData: [],
            postRawFile: postRawFile,
            currentRequest: null
        };
        let beforeEventArgs: BeforeRemoveEventArgs = {
            cancel: false,
            customFormData: [],
            currentRequest: null
        };
        this.trigger('beforeRemove', beforeEventArgs, (beforeEventArgs: BeforeRemoveEventArgs) => {
            if (!beforeEventArgs.cancel) {
                if (isBlazor()) {
                    this.currentRequestHeader = beforeEventArgs.currentRequest;
                    this.customFormDatas = beforeEventArgs.customFormData;
                }
                let index: number;
                if (this.isFormUpload() && !this.isBlazorSaveUrl) {
                    eventArgs.filesData = fileData as FileInfo[];
                    this.trigger('removing', eventArgs, (eventArgs: RemovingEventArgs) => {
                        if (!eventArgs.cancel) {
                            let removingFiles: FileInfo[] = this.getFilesInArray(fileData);
                            let isLiRemoved: boolean = false;
                            let liIndex: number;
                            for (let data of removingFiles) {
                                if (!isLiRemoved) {
                                    liIndex = this.fileList.indexOf(data.list);
                                }
                                if (liIndex > -1) {
                                    let inputElement: HTMLElement = !isNullOrUndefined(data.input) ? data.input : null;
                                    if (inputElement) {
                                        detach(inputElement);
                                    }
                                    this.spliceFiles(liIndex);
                                    detach(this.fileList[liIndex]);
                                    this.fileList.splice(liIndex, 1);
                                    isLiRemoved = true;
                                    liIndex = -1;
                                }
                            }
                        }
                    });
                } else if (this.isForm && (isNullOrUndefined(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === '')
                        && !this.isBlazorSaveUrl) {
                    eventArgs.filesData = this.getFilesData();
                    this.trigger('removing', eventArgs, (eventArgs: RemovingEventArgs) => {
                        if (!eventArgs.cancel) {
                            this.clearAll();
                        }
                    });
                } else {
                    let removeFiles: FileInfo[] = [];
                    fileData = !isNullOrUndefined(fileData) ? fileData : this.filesData;
                    if (fileData instanceof Array) {
                        removeFiles = fileData;
                    } else {
                        removeFiles.push(fileData);
                    }
                    eventArgs.filesData = removeFiles;
                    let removeUrl: string = this.asyncSettings.removeUrl;
                    let validUrl: boolean = (removeUrl === '' || isNullOrUndefined(removeUrl)) ? false : true;
                    for (let files of removeFiles) {
                        index = this.filesData.indexOf(files);
                        let fileUploadedIndex : number = this.uploadedFilesData.indexOf(files) 
                        if ((files.statusCode === '2' || files.statusCode === '4' || (files.statusCode === '0' &&
                            fileUploadedIndex !== -1)) && validUrl) {
                            this.removeUploadedFile(files, eventArgs, removeDirectly, customTemplate);
                        } else {
                            if (!removeDirectly) {
                                this.trigger('removing', eventArgs, (eventArgs: RemovingEventArgs) => {
                                    if (!eventArgs.cancel) {
                                        this.removeFilesData(files, customTemplate);
                                    }
                                });
                            } else {
                                this.removeFilesData(files, customTemplate);
                            }
                        }
                        if (args && !(args.target as Element).classList.contains(REMOVE_ICON)) {
                            this.checkActionComplete(false);
                        }
                    }
                }
            }
        });
    }

    /**
     * Clear all the file entries from list that can be uploaded files or added in upload queue.
     * @returns void
     */
    public clearAll(): void {
        if (isNullOrUndefined(this.listParent) && !(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            if (this.browserName !== 'msie') { this.element.value = ''; }
            this.filesData = [];
            return;
        }
        let eventArgs: ClearingEventArgs = {
            cancel: false,
            filesData: this.filesData
        };
        this.trigger('clearing', eventArgs, (eventArgs: ClearingEventArgs) => {
            if (!eventArgs.cancel) {
                this.clearData();
                this.actionCompleteCount = 0;
                this.count = -1;
            }
        });
    }

    /**
     * Get the data of files which are shown in file list.
     * @param { number } index - specifies the file list item(li) index.
     * @returns FileInfo[]
     */
    public getFilesData(index?: number): FileInfo[] {
        if (!this.isServerBlazor) {
            if (isNullOrUndefined(index)) {
                return this.filesData;
            } else {
                return this.getSelectedFiles(index);
            }
        } else {
            for (let i: number = 0; i < this.filesData.length; i++) {
                this.filesData[i].rawFile = this.base64String[i];
            }
            return this.filesData;
        }
    }

    /**
     * Pauses the in-progress chunked upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to pause from uploading.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    public pause(fileData?: FileInfo | FileInfo[], custom?: boolean): void {
        fileData = fileData ? fileData : this.filesData;
        let fileDataFiles: FileInfo[] = this.getFilesInArray(fileData);
        this.pauseUploading(fileDataFiles, custom);
    }
    private pauseUploading(fileData: FileInfo[], custom?: boolean): void {
        let files: FileInfo[] = this.getFiles(fileData);
        for (let i: number = 0; i < files.length; i++) {
            if (files[i].statusCode === '3') {
                this.pauseUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    }

    private getFiles (fileData: FileInfo[]) : FileInfo[] {
        let files: FileInfo[] = [];
        if (!isNullOrUndefined(fileData) && !(fileData instanceof Array)) {
            files.push(fileData);
        } else {
            files = fileData;
        }
        return files;
    }

    /**
     * Resumes the chunked upload that is previously paused based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to resume the paused file.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    public resume(fileData?: FileInfo | FileInfo[], custom?: boolean): void {
        fileData = fileData ? fileData : this.filesData;
        let  fileDataFiles:  FileInfo[]  =  this.getFilesInArray(fileData);
        this.resumeFiles(fileDataFiles, custom);
    }

    private resumeFiles(fileData: FileInfo[], custom?: boolean): void {
        let files: FileInfo[] = this.getFiles(fileData);
        for (let i: number = 0; i < files.length; i++) {
            if (files[i].statusCode === '4') {
                this.resumeUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    }

    /**
     * Retries the canceled or failed file upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to retry the canceled or failed file.
     * @param { boolean } fromcanceledStage - Set true to retry from canceled stage and set false to retry from initial stage.
     * @returns void
     */
    public retry(fileData?: FileInfo | FileInfo[], fromcanceledStage?: boolean, custom?: boolean): void {
        fileData = fileData ? fileData : this.filesData;
        let  fileDataFiles:  FileInfo[]  =  this.getFilesInArray(fileData);
        this.retryFailedFiles(fileDataFiles, fromcanceledStage, custom);
    }

    private retryFailedFiles(fileData: FileInfo[], fromcanceledStage: boolean, custom: boolean): void {
        let files: FileInfo[] = this.getFiles(fileData);
        for (let i: number = 0; i < files.length; i++) {
            if (files[i].statusCode === '5' || files[i].statusCode === '0') {
                if (this.asyncSettings.chunkSize > 0) {
                    this.retryUpload(this.getCurrentMetaData(files[i], null), fromcanceledStage);
                } else {
                    let liElement: HTMLElement;
                    if (!custom) {
                    liElement = this.fileList[this.filesData.indexOf(files[i])];
                    }
                    this.reloadcanceledFile(null, files[i], liElement, custom);
                }
            }
        }
    }

    /**
     * Stops the in-progress chunked upload based on the file data.
     * When the file upload is canceled, the partially uploaded file is removed from server.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to cancel the progressing file.
     * @returns void
     */
    public cancel(fileData?: FileInfo[]): void {
        fileData = fileData ? fileData : this.filesData;
        let cancelingFiles:  FileInfo[]  =  this.getFilesInArray(fileData);
        this.cancelUpload(cancelingFiles);
    }

    private cancelUpload(fileData: FileInfo[]): void {
        let files: FileInfo[] = this.getFiles(fileData);
        if (this.asyncSettings.chunkSize > 0) {
            for (let i: number = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    let metaData: MetaData = this.getCurrentMetaData(files[i], null);
                    metaData.file.statusCode = '5';
                    metaData.file.status = this.localizedTexts('fileUploadCancel');
                    this.updateMetaData(metaData);
                    this.showHideUploadSpinner(files[i]);
                }
            }
        } else {
            for (let i: number = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    files[i].statusCode = '5';
                    files[i].status = this.localizedTexts('fileUploadCancel');
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
    }

    private showHideUploadSpinner(files: FileInfo): void {
        let liElement: HTMLElement = this.getLiElement(files);
        if (!isNullOrUndefined(liElement) && isNullOrUndefined(this.template)) {
            let spinnerTarget: HTMLElement = liElement.querySelector('.' + ABORT_ICON) as HTMLElement;
            createSpinner({ target: spinnerTarget , width: '20px' });
            showSpinner(spinnerTarget);
        }
    }
}
