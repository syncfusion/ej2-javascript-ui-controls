import { Component, EmitType, ModuleDeclaration, isNullOrUndefined, L10n, closest, isBlazor } from '@syncfusion/ej2-base';import { Property, INotifyPropertyChanged, NotifyPropertyChanges, Complex, select } from '@syncfusion/ej2-base';import { createElement, addClass, removeClass, setStyleAttribute as setAttr } from '@syncfusion/ej2-base';import { isNullOrUndefined as isNOU, formatUnit, Browser, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';import { Event, EventHandler, getValue, setValue } from '@syncfusion/ej2-base';import { Splitter, PanePropertiesModel } from '@syncfusion/ej2-layouts';import { Dialog, createSpinner, hideSpinner, showSpinner, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';import { createDialog, createExtDialog } from '../pop-up/dialog';import { ToolbarSettings, ToolbarSettingsModel, AjaxSettings, NavigationPaneSettings, DetailsViewSettings } from '../models/index';import { NavigationPaneSettingsModel, DetailsViewSettingsModel } from '../models/index';import { AjaxSettingsModel, SearchSettings, SearchSettingsModel } from '../models/index';import { Toolbar } from '../actions/toolbar';import { DetailsView } from '../layout/details-view';import { LargeIconsView } from '../layout/large-icons-view';import { Uploader, UploadingEventArgs, SelectedEventArgs, FileInfo } from '@syncfusion/ej2-inputs';import { UploadSettingsModel } from '../models/upload-settings-model';import { UploadSettings } from '../models/upload-settings';import * as events from './constant';import * as CLS from './classes';import { read, filter, createFolder } from '../common/operations';import { ITreeView, IContextMenu, ViewType, SortOrder, FileDragEventArgs, RetryArgs, ReadArgs, FileSelectionEventArgs } from './interface';import { BeforeSendEventArgs, SuccessEventArgs, FailureEventArgs, FileLoadEventArgs } from './interface';import { FileOpenEventArgs, FileSelectEventArgs, MenuClickEventArgs, MenuOpenEventArgs } from './interface';import { ToolbarClickEventArgs, ToolbarCreateEventArgs, UploadListCreateArgs } from './interface';import { PopupOpenCloseEventArgs, BeforePopupOpenCloseEventArgs } from './interface';import { refresh, getPathObject, getLocaleText, setNextPath, createDeniedDialog } from '../common/utility';import { hasContentAccess, hasUploadAccess, updateLayout, createNewFolder, uploadItem } from '../common/utility';import { TreeView as BaseTreeView } from '@syncfusion/ej2-navigations';import { ContextMenuSettingsModel } from '../models/contextMenu-settings-model';import { ContextMenuSettings } from '../models/contextMenu-settings';import { BreadCrumbBar } from '../actions/breadcrumb-bar';import { ContextMenu } from '../pop-up/context-menu';import { defaultLocale } from '../models/default-locale';import { PositionModel } from '@syncfusion/ej2-base/src/draggable-model';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FileManager
 */
export interface FileManagerModel extends ComponentModel{

    /**
     * Specifies the AJAX settings of the file manager.
     * @default {
     *  getImageUrl: null;
     *  url: null;
     *  uploadUrl: null;
     *  downloadUrl: null;
     * }
     */
    ajaxSettings?: AjaxSettingsModel;

    /**
     * Enables or disables drag-and-drop of files.
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Enables or disables the multiple files selection of the file manager.
     * @default true
     */
    allowMultiSelection?: boolean;

    /**
     * Specifies the context menu settings of the file manager.
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
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the details view settings of the file manager.
     * @default {     
     * columns: [{
     * field: 'name', headerText: 'Name', minWidth: 120, width: 'auto', template: '<span class="e-fe-text">${name}</span>',
     * customAttributes: { class: 'e-fe-grid-name'}}, { field: '_fm_modified', headerText: 'DateModified',
     * minWidth: 120, width: '190' }, { field: 'size', headerText: 'Size', minWidth: 90, width: '110',
     * template: '<span class="e-fe-size">${size}</span>' }
     * ]
     * }
     */
    detailsViewSettings?: DetailsViewSettingsModel;

    /**
     * Enables or disables persisting component's state between page reloads. If enabled, the following APIs will persist:
     * 1. `view`: Represents the previous view of the file manager.
     * 2. `path`: Represents the previous path of the file manager.
     * 3. `selectedItems`: Represents the previous selected items in the file manager.
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Specifies the height of the file manager.
     * @default '400px'
     */
    height?: string | number;

    /**
     * Specifies the initial view of the file manager. 
     * With the help of this property, initial view can be changed to details or largeicons view. The available views are:
     * * `LargeIcons`
     * * `Details`
     * @default 'LargeIcons'
     */
    view?: ViewType;

    /**
     * Specifies the navigationpane settings of the file manager.
     * @default {
     *  maxWidth: '650px',
     *  minWidth: '240px',
     *  visible: true,
     * }
     */
    navigationPaneSettings?: NavigationPaneSettingsModel;

    /**
     * Specifies the current path of the file manager.
     * @default '/'
     */
    path?: string;

    /**
     * Specifies the search settings of the file manager.
     * @default {
     *  allowSearchOnTyping: true,
     *  filterType: 'contains',
     *  ignoreCase: true
     * }
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Specifies the selected folders and files name of the  file manager.
     * @default []
     */
    selectedItems?: string[];

    /**
     * Shows or hides the file extension in file manager.
     * @default true
     */
    showFileExtension?: boolean;

    /**
     * Shows or hides the files and folders that are marked as hidden.
     * @default false
     */
    showHiddenItems?: boolean;

    /**
     * Shows or hides the thumbnail images in largeicons view.
     * @default true
     */
    showThumbnail?: boolean;

    /**
     * Specifies the group of items aligned horizontally in the toolbar.
     * @default {
     *  items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete',
     *  'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'],
     *  visible: true
     * }
     */
    toolbarSettings?: ToolbarSettingsModel;

    /**
     * Specifies the upload settings for the file manager.
     * @default {
     *  autoUpload: true,
     *  minFileSize: 0,
     *  maxFileSize: 30000000,
     *  allowedExtensions: ''
     * }
     */
    uploadSettings?: UploadSettingsModel;

    /**
     * Specifies the width of the file manager.
     * @default '100%'
     */
    width?: string | number;

    /**
     * Triggers before the file/folder is rendered.
     * @event
     * @blazorproperty 'OnFileLoad'
     */
    fileLoad?: EmitType<FileLoadEventArgs>;

    /**
     * Triggers before the file/folder is opened.
     * @event
     * @blazorproperty 'OnFileOpen'
     */
    fileOpen?: EmitType<FileOpenEventArgs>;

    /**
     * Triggers before the dialog is closed.
     * @event
     * @blazorproperty 'BeforePopupClose'
     */
    beforePopupClose?: EmitType<BeforePopupOpenCloseEventArgs>;

    /**
     * Triggers before the dialog is opened.
     * @event
     * @blazorproperty 'BeforePopupOpen'
     */
    beforePopupOpen?: EmitType<BeforePopupOpenCloseEventArgs>;

    /**
     * Triggers before sending the AJAX request to the server.
     * @event
     * @blazorproperty 'OnSend'
     */
    beforeSend?: EmitType<BeforeSendEventArgs>;

    /**
     * Triggers when the file manager component is created.
     * @event
     * @blazorproperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the file manager component is destroyed.
     * @event
     * @blazorproperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the file/folder dragging is started.
     * @event
     * @blazorproperty 'OnFileDragStart'
     */
    fileDragStart?: EmitType<FileDragEventArgs>;

    /**
     * Triggers while dragging the file/folder.
     * @event
     * @blazorproperty 'FileDragging'
     */
    fileDragging?: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is about to be dropped at the target.
     * @event
     * @blazorproperty 'OnFileDragStop'
     */
    fileDragStop?: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is dropped.
     * @event
     * @blazorproperty 'FileDropped'
     */
    fileDropped?: EmitType<FileDragEventArgs>;

    /**
     * Triggers before the file/folder is selected.
     * @event
     * @blazorproperty 'FileSelection'
     */
    fileSelection?: EmitType<FileSelectionEventArgs>;

    /**
     * Triggers when the file/folder is selected/unselected.
     * @event
     * @blazorproperty 'FileSelected'
     */
    fileSelect?: EmitType<FileSelectEventArgs>;

    /**
     * Triggers when the context menu item is clicked.
     * @event
     * @blazorproperty 'OnMenuClick'
     */
    menuClick?: EmitType<MenuClickEventArgs>;

    /**
     * Triggers before the context menu is opened.
     * @event
     * @blazorproperty 'MenuOpened'
     */
    menuOpen?: EmitType<MenuOpenEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     * @event
     * @blazorproperty 'OnError'
     */
    failure?: EmitType<FailureEventArgs>;

    /**
     * Triggers when the dialog is closed.
     * @event
     * @blazorproperty 'PopupClosed'
     */
    popupClose?: EmitType<PopupOpenCloseEventArgs>;

    /**
     * Triggers when the dialog is opened.
     * @event
     * @blazorproperty 'PopupOpened'
     */
    popupOpen?: EmitType<PopupOpenCloseEventArgs>;

    /**
     * Triggers when the AJAX request is success.
     * @event
     * @blazorproperty 'OnSuccess'
     */
    success?: EmitType<SuccessEventArgs>;

    /**
     * Triggers when the toolbar item is clicked.
     * @event
     * @blazorproperty 'ToolbarItemClicked'
     */
    toolbarClick?: EmitType<ToolbarClickEventArgs>;

    /**
     * Triggers before creating the toolbar.
     * @event
     * @blazorproperty 'ToolbarCreated'
     */
    toolbarCreate?: EmitType<ToolbarCreateEventArgs>;

    /**
     * Triggers before rendering each file item in upload dialog box.
     * @event
     * @blazorproperty 'UploadListCreated'
     */
    uploadListCreate?: EmitType<UploadListCreateArgs>;

}