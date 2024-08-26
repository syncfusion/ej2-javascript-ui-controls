import { Component, EmitType, ModuleDeclaration, isNullOrUndefined, L10n, closest, Collection } from '@syncfusion/ej2-base';import { Property, INotifyPropertyChanged, NotifyPropertyChanges, Complex, select } from '@syncfusion/ej2-base';import { createElement, addClass, removeClass, setStyleAttribute as setAttr, getUniqueID } from '@syncfusion/ej2-base';import { isNullOrUndefined as isNOU, formatUnit, Browser, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';import { Event, EventHandler, getValue, setValue } from '@syncfusion/ej2-base';import { Splitter, PanePropertiesModel } from '@syncfusion/ej2-layouts';import { Dialog, createSpinner, hideSpinner, showSpinner, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';import { createDialog, createExtDialog } from '../pop-up/dialog';import { ToolbarSettings, ToolbarSettingsModel, AjaxSettings, NavigationPaneSettings, DetailsViewSettings } from '../models/index';import { ToolbarItem, ToolbarItemModel } from'../models/index' ;import { NavigationPaneSettingsModel, DetailsViewSettingsModel } from '../models/index';import { AjaxSettingsModel, SearchSettings, SearchSettingsModel } from '../models/index';import { Toolbar } from '../actions/toolbar';import { DetailsView } from '../layout/details-view';import { LargeIconsView } from '../layout/large-icons-view';import { Uploader, UploadingEventArgs, SelectedEventArgs, FileInfo, CancelEventArgs } from '@syncfusion/ej2-inputs';import { UploadSettingsModel } from '../models/upload-settings-model';import { UploadSettings } from '../models/upload-settings';import * as events from './constant';import * as CLS from './classes';import { read, filter, createFolder } from '../common/operations';import { ITreeView, IContextMenu, ViewType, SortOrder, FileDragEventArgs, RetryArgs, ReadArgs, FileSelectionEventArgs } from './interface';import { BeforeSendEventArgs, SuccessEventArgs, FailureEventArgs, FileLoadEventArgs, FolderCreateEventArgs, DeleteEventArgs, RenameEventArgs, MoveEventArgs, SearchEventArgs } from './interface';import { FileOpenEventArgs, FileSelectEventArgs, MenuClickEventArgs, MenuOpenEventArgs, MenuCloseEventArgs } from './interface';import { ToolbarClickEventArgs, ToolbarCreateEventArgs, UploadListCreateArgs } from './interface';import { PopupOpenCloseEventArgs, BeforePopupOpenCloseEventArgs, BeforeDownloadEventArgs, BeforeImageLoadEventArgs } from './interface';import { refresh, getPathObject, getLocaleText, setNextPath, createDeniedDialog, getCssClass } from '../common/utility';import { hasContentAccess, hasUploadAccess, updateLayout, createNewFolder, uploadItem, closePopup } from '../common/utility';import { TreeView as BaseTreeView } from '@syncfusion/ej2-navigations';import { ContextMenuSettingsModel } from '../models/contextMenu-settings-model';import { ContextMenuSettings } from '../models/contextMenu-settings';import { BreadCrumbBar } from '../actions/breadcrumb-bar';import { ContextMenu } from '../pop-up/context-menu';import { defaultLocale } from '../models/default-locale';import { PositionModel } from '@syncfusion/ej2-base/src/draggable-model';import { Virtualization } from '../actions/virtualization';import { SortComparer } from './interface';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FileManager
 */
export interface FileManagerModel extends ComponentModel{

    /**
     * Specifies the AJAX settings of the file manager.
     *
     * @default {
     *  getImageUrl: null;
     *  url: null;
     *  uploadUrl: null;
     *  downloadUrl: null;
     * }
     */
    ajaxSettings?: AjaxSettingsModel;

    /**
     * Specifies the array of data to populate folders/files in the File Manager.
     * The mandatory fields to be included in the JSON data are defined in fileData interface.
     * This interface can be extended to add additional fields as required.
     *
     * @default []
     */
    fileSystemData?: { [key: string]: Object }[];

    /**
     * Enables or disables drag-and-drop of files.
     *
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Enables or disables the multiple files selection of the file manager.
     *
     * @default true
     */
    allowMultiSelection?: boolean;

    /**
     * Gets or sets a boolean value that determines whether to display checkboxes in the file manager. If enabled, checkboxes are shown for files or folders on hover.
     *
     * @default true
     */
    showItemCheckBoxes?: boolean;

    /**
     * Specifies the context menu settings of the file manager.
     *
     * @default {
     *  file: ['Open','|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details'],
     *  folder: ['Open','|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'],
     *  layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'],
     *  visible: true,
     * }
     */
    contextMenuSettings?: ContextMenuSettingsModel;

    /**
     * Specifies the root CSS class of the file manager that allows you to customize the appearance by overriding the styles.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the details view settings of the file manager.
     *
     * @default {
     * columns: [{
     * field: 'name', headerText: 'Name', minWidth: 120, template: '<span class="e-fe-text">${name}</span>',
     * customAttributes: { class: 'e-fe-grid-name'}}, { field: '_fm_modified', headerText: 'DateModified', type: 'dateTime',
     * format: 'MMMM dd, yyyy HH:mm', minWidth: 120, width: '190' }, { field: 'size', headerText: 'Size', minWidth: 90, width: '110',
     * template: '<span class="e-fe-size">${size}</span>' }
     * ]
     * }
     */
    detailsViewSettings?: DetailsViewSettingsModel;

    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Enables or disables persisting component's state between page reloads. If enabled, the following APIs will persist:
     * 1. `view`: Represents the previous view of the file manager.
     * 2. `path`: Represents the previous path of the file manager.
     * 3. `selectedItems`: Represents the previous selected items in the file manager.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Gets or sets a value that enables/disables the virtualization feature of the File Manager.
     * When enabled, the File Manager will only load a subset of files and folders based on the size of the view port, with the rest being loaded dynamically as the user scrolls vertically through the list.
     * This can improve performance when dealing with a large number of files and folders, as it reduces the initial load time and memory usage.
     *
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * Specifies the height of the file manager.
     *
     * @default '400px'
     */
    height?: string | number;

    /**
     * Specifies the initial view of the file manager.
     * With the help of this property, initial view can be changed to details or largeicons view. The available views are:
     * * `LargeIcons`
     * * `Details`
     *
     * @default 'LargeIcons'
     */
    view?: ViewType;

    /**
     * Specifies the navigationpane settings of the file manager.
     *
     * @default {
     *  maxWidth: '650px',
     *  minWidth: '240px',
     *  visible: true,
     *  sortOrder: 'None'
     * }
     */
    navigationPaneSettings?: NavigationPaneSettingsModel;

    /**
     * Specifies the current path of the file manager.
     *
     * @default '/'
     */
    path?: string;

    /**
     * Specifies the target element in which the File Manager’s dialog will be displayed.
     * The default value is null, which refers to the File Manager element.
     *
     * @default null
     */
    popupTarget?: HTMLElement | string;

    /**
     * Specifies the search settings of the file manager.
     *
     * @default {
     *  allowSearchOnTyping: true,
     *  filterType: 'contains',
     *  ignoreCase: true
     * }
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Specifies the selected folders and files name of the  file manager.
     *
     * @default []
     */
    selectedItems?: string[];

    /**
     * Shows or hides the file extension in file manager.
     *
     * @default true
     */
    showFileExtension?: boolean;

    /**
     * Specifies the root folder alias name in file manager
     *
     * @default null
     */
    rootAliasName?: string;

    /**
     * Shows or hides the files and folders that are marked as hidden.
     *
     * @default false
     */
    showHiddenItems?: boolean;

    /**
     * Shows or hides the thumbnail images in largeicons view.
     *
     * @default true
     */
    showThumbnail?: boolean;

    /**
     * Specifies a value that indicates whether the folders and files are sorted in the ascending or descending order,
     * or they are not sorted at all. The available types of sort orders are,
     * `None` - Indicates that the folders and files are not sorted.
     * `Ascending` - Indicates that the folders and files are sorted in the ascending order.
     * `Descending` - Indicates that the folders and files are sorted in the descending order.
     *
     * @default 'Ascending'
     */
    sortOrder?: SortOrder;

    /**
     * Specifies the field name being used as the sorting criteria to sort the files of the file manager component.
     *
     * @default 'name'
     */
    sortBy?: string;

    /**
     * Defines the custom sorting function.
     * The sort comparer function has the same functionality like
     * [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) sort comparer.
     * This can be used to customize the default sorting functionalities with required comparison values.
     *
     * @default null
     * @aspType string
     */
    sortComparer?: SortComparer | string;

    /**
     * Specifies the group of items aligned horizontally in the toolbar.
     *
     * @default {
     *  items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete',
     *  'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'],
     *  visible: true
     * }
     */
    toolbarSettings?: ToolbarSettingsModel;

    /**
     * An array of items that are used to configure File Manager toolbar items.
     *
     * @remarks
     * Use this property if you want to include custom toolbar items along with existing toolbar items. If both `toolbarSettings` and `toolbarItems` are defined, then items will be rendered based on toolbarItems.
     *
     * @default []
     *
     */
    toolbarItems?: ToolbarItemModel[];

    /**
     * Specifies the upload settings for the file manager.
     *
     * @default {
     *  autoUpload: true,
     *  minFileSize: 0,
     *  maxFileSize: 30000000,
     *  allowedExtensions: '',
     *  autoClose: false,
     *  directoryUpload: false
     * }
     */
    uploadSettings?: UploadSettingsModel;

    /**
     * Specifies the width of the file manager.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Triggers before the file/folder is rendered.
     *
     * @event fileLoad
     */
    fileLoad?: EmitType<FileLoadEventArgs>;

    /**
     * Triggers before the file/folder is opened.
     *
     * @event fileOpen
     */
    fileOpen?: EmitType<FileOpenEventArgs>;

    /**
     * Triggers before sending the download request to the server.
     *
     * @event beforeDownload
     */
    beforeDownload?: EmitType<BeforeDownloadEventArgs>;

    /**
     * Triggers before sending the getImage request to the server.
     *
     * @event beforeImageLoad
     */
    beforeImageLoad?: EmitType<BeforeImageLoadEventArgs>;

    /**
     * Triggers before the dialog is closed.
     *
     * @event beforePopupClose
     */
    beforePopupClose?: EmitType<BeforePopupOpenCloseEventArgs>;

    /**
     * Triggers before the dialog is opened.
     *
     * @event beforePopupOpen
     */
    beforePopupOpen?: EmitType<BeforePopupOpenCloseEventArgs>;

    /**
     * Triggers before sending the AJAX request to the server.
     *
     * @event beforeSend
     */
    beforeSend?: EmitType<BeforeSendEventArgs>;

    /**
     * Triggers when the file manager component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * This event is triggered before a folder is created. It allows for the restriction of folder creation based on the application's use case.
     *
     * @event beforeFolderCreate
     */
    beforeFolderCreate?: EmitType<FolderCreateEventArgs>;

    /**
     * This event is triggered when a folder is successfully created. It provides an opportunity to retrieve details about the newly created folder.
     *
     * @event folderCreate
     */
    folderCreate?: EmitType<FolderCreateEventArgs>;

    /**
     * Triggers when the file manager component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * This event is triggered before the deletion of a file or folder occurs. It can be utilized to prevent the deletion of specific files or folders. Any actions, such as displaying a spinner for deletion, can be implemented here.
     *
     * @event beforeDelete
     */
    beforeDelete?: EmitType<DeleteEventArgs>;

    /**
     * This event is triggered after the file or folder is deleted successfully. The deleted file or folder details can be retrieved here. Additionally, custom elements' visibility can be managed here based on the application's use case.
     *
     * @event delete
     */
    delete?: EmitType<DeleteEventArgs>;

    /**
     * This event is triggered when a file or folder is about to be renamed. It allows for the restriction of the rename action for specific folders or files by utilizing the cancel option.
     *
     * @event beforeRename
     */
    beforeRename?: EmitType<RenameEventArgs>;

    /**
     * This event is triggered when a file or folder is successfully renamed. It provides an opportunity to fetch details about the renamed file.
     *
     * @event rename
     */
    rename?: EmitType<RenameEventArgs>;

    /**
     * This event is triggered when a file or folder begins to move from its current path through a copy/cut and paste action.
     *
     * @event beforeMove
     */
    beforeMove?: EmitType<MoveEventArgs>;

    /**
     * This event is triggered when a file or folder is pasted into the destination path.
     *
     * @event move
     */
    move?: EmitType<MoveEventArgs>;

    /**
     * This event is triggered when a search action occurs in the search bar of the File Manager component. It triggers each character entered in the input during the search process.
     *
     * @event search
     */
    search?: EmitType<SearchEventArgs>;

    /**
     * Triggers when the file/folder dragging is started.
     *
     * @event fileDragStart
     */
    fileDragStart?: EmitType<FileDragEventArgs>;

    /**
     * Triggers while dragging the file/folder.
     *
     * @event fileDragging
     */
    fileDragging?: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is about to be dropped at the target.
     *
     * @event fileDragStop
     */
    fileDragStop?: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is dropped.
     *
     * @event fileDropped
     */
    fileDropped?: EmitType<FileDragEventArgs>;

    /**
     * Triggers before the file/folder is selected.
     *
     * @event fileSelection
     */
    fileSelection?: EmitType<FileSelectionEventArgs>;

    /**
     * Triggers when the file/folder is selected/unselected.
     *
     * @event fileSelect
     */
    fileSelect?: EmitType<FileSelectEventArgs>;

    /**
     * Triggers when the context menu item is clicked.
     *
     * @event menuClick
     */
    menuClick?: EmitType<MenuClickEventArgs>;

    /**
     * Triggers before the context menu is opened.
     *
     * @event menuOpen
     */
    menuOpen?: EmitType<MenuOpenEventArgs>;

    /**
     * Triggers before the context menu is closed.
     *
     * @event menuClose
     */
    menuClose?: EmitType<MenuCloseEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     *
     * @event failure
     */
    failure?: EmitType<FailureEventArgs>;

    /**
     * Triggers when the dialog is closed.
     *
     * @event popupClose
     */
    popupClose?: EmitType<PopupOpenCloseEventArgs>;

    /**
     * Triggers when the dialog is opened.
     *
     * @event popupOpen
     */
    popupOpen?: EmitType<PopupOpenCloseEventArgs>;

    /**
     * Triggers when the AJAX request is success.
     *
     * @event success
     */
    success?: EmitType<SuccessEventArgs>;

    /**
     * Triggers when the toolbar item is clicked.
     *
     * @event toolbarClick
     */
    toolbarClick?: EmitType<ToolbarClickEventArgs>;

    /**
     * Triggers before creating the toolbar.
     *
     * @event toolbarCreate
     */
    toolbarCreate?: EmitType<ToolbarCreateEventArgs>;

    /**
     * Triggers before rendering each file item in upload dialog box.
     *
     * @event uploadListCreate
     */
    uploadListCreate?: EmitType<UploadListCreateArgs>;

}