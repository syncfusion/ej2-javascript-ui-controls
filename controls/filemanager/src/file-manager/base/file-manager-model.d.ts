import { Component, EmitType, ModuleDeclaration, isNullOrUndefined, L10n, closest } from '@syncfusion/ej2-base';import { Property, INotifyPropertyChanged, NotifyPropertyChanges, Complex, select } from '@syncfusion/ej2-base';import { createElement, addClass, removeClass, setStyleAttribute as setAttr } from '@syncfusion/ej2-base';import { isNullOrUndefined as isNOU, formatUnit, Browser, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';import { Event, EventHandler } from '@syncfusion/ej2-base';import { Splitter } from '@syncfusion/ej2-layouts';import { Dialog, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';import { createDialog } from '../pop-up/dialog';import { ToolbarSettings, ToolbarSettingsModel, AjaxSettings, NavigationPaneSettings, DetailsViewSettings } from '../models/index';import { NavigationPaneSettingsModel, DetailsViewSettingsModel } from '../models/index';import { AjaxSettingsModel, SearchSettings, SearchSettingsModel } from '../models/index';import { Toolbar } from '../actions/toolbar';import { DetailsView } from '../layout/details-view';import { LargeIconsView } from '../layout/large-icons-view';import { Uploader, UploadingEventArgs, RemovingEventArgs } from '@syncfusion/ej2-inputs';import { UploadSettingsModel } from '../models/upload-settings-model';import { UploadSettings } from '../models/upload-settings';import * as events from './constant';import * as CLS from './classes';import { read, paste, Delete, GetDetails } from '../common/operations';import { IFileManager, ITreeView, IContextMenu, viewType, SortOrder } from './interface';import { FileBeforeSendEventArgs, FileOnSuccessEventArgs, FileOnErrorEventArgs, FileBeforeLoadEventArgs } from './interface';import { FileOpenEventArgs, FileSelectEventArgs, FileMenuClickEventArgs, FileMenuOpenEventArgs } from './interface';import { FileToolbarClickEventArgs } from './interface';import { activeElement, removeBlur, refresh, getPathObject, getLocaleText, setNextPath } from '../common/utility';import { TreeView as BaseTreeView } from '@syncfusion/ej2-navigations';import { ContextMenuSettingsModel } from '../models/contextMenu-settings-model';import { ContextMenuSettings } from '../models/contextMenu-settings';import { BreadCrumbBar } from '../actions/breadcrumb-bar';import { ContextMenu } from '../pop-up/context-menu';import { defaultLocale } from '../models/default-locale';
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
     * Enables or disables the multiple files selection of the file manager.
     * @default true
     */
    allowMultiSelection?: boolean;

    /**
     * Specifies the context menu settings of the file manager.
     * @default {
     *  file: ['Open', '|', 'Delete', 'Rename', '|', 'Details'],
     *  folder: ['Open', '|', 'Delete', 'Rename', '|', 'Details'],
     *  layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'],
     *  visible: true,
     * }
     */
    contextMenuSettings?: ContextMenuSettingsModel;

    /**
     * Specifies the root CSS class of the file manager that allows to customize the appearance by overriding the styles.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the details view settings of the file manager.
     * @default {     
     * Columns: [{
     * field: 'name', headerText: 'Name', minWidth: 120, width: 'auto', customAttributes: { class: 'e-fe-grid-name' },
     * template: '<span class="e-fe-text" title="${name}">${name}</span>'},{field: 'size', headerText: 'Size', 
     * minWidth: 50, width: '110', template: '<span class="e-fe-size">${size}</span>'},
     * { field: 'dateModified', headerText: 'DateModified',
     * minWidth: 50, width: '190'}
     * ]
     * }
     */
    detailsViewSettings?: DetailsViewSettingsModel;

    /**
     * Enables or disables persisting component's state between page reloads. If enabled, following APIs will persist.
     * 1. `view` - Represents the previous view of the file manager.
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * When set to true, enables RTL mode of the component that displays the content in the right-to-left direction.
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Specifies the height of the file manager.
     * @default '400px'
     */
    height?: string | number;

    /**
     * Specifies the initial view of the file manager. 
     * With the help of this property, initial view can be changed to details or largeicons view.
     * @default 'LargeIcons'
     */
    view?: viewType;

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
     * Specifies the selected folders and files name of the  file manager 
     * @default []
     */
    selectedItems?: string[];

    /**
     * Show or hide the file extension in file manager.
     * @default true
     */
    showFileExtension?: boolean;

    /**
     * Show or hide the files and folders that are marked as hidden.
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
     *  items: ['NewFolder', 'Upload', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'],
     *  visible: true
     * }
     */
    toolbarSettings?: ToolbarSettingsModel;

    /**
     * Specifies the upload settings for the file manager.
     * @default null
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
     */
    beforeFileLoad?: EmitType<FileBeforeLoadEventArgs>;

    /**
     * Triggers before the file/folder is opened.
     * @event
     */
    beforeFileOpen?: EmitType<FileOpenEventArgs>;

    /**
     * Triggers before the AJAX request send to the server.
     * @event
     */
    beforeSend?: EmitType<FileBeforeSendEventArgs>;

    /**
     * Triggers when the file manager component is created.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the file manager component is destroyed.
     * @event
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the file/folder is selected/unselected.
     * @event
     */
    fileSelect?: EmitType<FileSelectEventArgs>;

    /**
     * Triggers when the context menu item is clicked.
     * @event
     */
    menuClick?: EmitType<FileMenuClickEventArgs>;

    /**
     * Triggers before the context menu is opened.
     * @event
     */
    menuOpen?: EmitType<FileMenuOpenEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     * @event
     */
    onError?: EmitType<FileOnErrorEventArgs>;

    /**
     * Triggers when the AJAX request is success.
     * @event
     */
    onSuccess?: EmitType<FileOnSuccessEventArgs>;

    /**
     * Triggers when the toolbar item is clicked.
     * @event
     */
    toolbarClick?: EmitType<FileToolbarClickEventArgs>;

}