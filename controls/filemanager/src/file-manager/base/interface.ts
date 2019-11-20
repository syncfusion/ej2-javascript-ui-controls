import { Component, EmitType, L10n } from '@syncfusion/ej2-base';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-popups';
import { FileManagerModel } from '../base/file-manager-model';
import { ToolbarSettingsModel, AjaxSettingsModel } from '../models/index';
import { TreeView, ContextMenu, MenuItemModel, ItemModel } from '@syncfusion/ej2-navigations';
import { DetailsView } from '../layout/details-view';
import { Toolbar } from '../actions/toolbar';
import { Splitter } from '@syncfusion/ej2-layouts';
import { SearchSettingsModel } from '../models/search-settings-model';
import { ContextMenuSettingsModel } from '../models/contextMenu-settings-model';
import { LargeIconsView } from '../layout';
import { NavigationPaneSettingsModel } from '../models/navigation-pane-settings-model';
import { Uploader } from '@syncfusion/ej2-inputs';
import { BreadCrumbBar } from '../actions';
import { PositionModel } from '@syncfusion/ej2-base/src/draggable-model';

export type ViewType = 'LargeIcons' | 'Details';
export type SortOrder = 'Ascending' | 'Descending';
export type ToolBarItems = 'NewFolder' | 'Upload' | 'Cut' | 'Copy' | 'Paste' | 'Delete' | 'Download'
    | 'Rename' | 'SortBy' | 'Refresh' | 'Selection' | 'View' | 'Details';
export type MenuItems = 'NewFolder' | 'Upload' | 'Cut' | 'Copy' | 'Paste' | 'Delete' | 'Download'
    | 'Rename' | 'SortBy' | 'Refresh' | 'SelectAll' | 'View' | 'Details' | 'Open';

/**
 * Interfaces for File Manager
 */
export interface IToolBarItems {
    template?: string;
    tooltipText?: string;
}

export interface NotifyArgs {
    module?: string;
    newProp?: FileManagerModel;
    oldProp?: FileManagerModel;
    target?: Element;
    selectedNode?: string;
}

export interface ReadArgs {
    cwd?: { [key: string]: Object; };
    files?: { [key: string]: Object; }[];
    error?: ErrorArgs;
    details?: Object;
    id?: string;
}

export interface MouseArgs {
    target?: Element;
}

export interface UploadArgs {
    files?: { [key: string]: Object; }[];
    error?: Object[];
    details?: Object;
}

export interface RetryArgs {
    action: string;
    file: FileInfo;
}

export interface ErrorArgs {
    code?: string;
    message?: string;
    fileExists?: string[];
}

export interface DialogOptions {
    dialogName?: string;
    header?: string;
    content?: string;
    buttons?: ButtonPropsModel[];
    open?: EmitType<Object>;
    close?: EmitType<Object>;
}
export interface SearchArgs {
    files?: { [key: string]: Object; }[];
    error?: Object[];
    details?: Object;
}

export interface FileDetails {
    created?: string;
    isFile: boolean;
    location: string;
    modified: string;
    name: string;
    size: number;
    icon: string;
    multipleFiles: boolean;
    permission: Object;
}
export interface DownloadArgs {
    files?: { [key: string]: Object; }[];
    error?: Object[];
    details?: Object;
}

/**
 * Drag Event arguments
 */
export interface FileDragEventArgs {
    /**
     * Return the current items as an array of JSON object.
     */
    fileDetails?: Object[];
    /**
     * Specifies the actual event.
     */
    event?: MouseEvent & TouchEvent;
    /**
     * Specifies the current drag element.
     */
    element?: HTMLElement;
    /**
     * Specifies the current target element.
     */
    target?: HTMLElement;
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: Boolean;
}

export interface BeforeSendEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details, which are send to server.
     */
    ajaxSettings?: Object;
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: boolean;
}

export interface SuccessEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details which are send to server.
     */
    result?: Object;
}

export interface FailureEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details, which are send to server.
     */
    error?: Object;
}

export interface FileLoadEventArgs {
    /**
     * Return the current rendering item.
     */
    element?: HTMLElement;
    /**
     * Return the current rendering item as JSON object.
     */
    fileDetails?: Object;
    /**
     * Return the name of the rendering module in File Manager.
     */
    module?: string;
}

export interface FileOpenEventArgs {
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: boolean;
    /**
     * Return the currently selected item as JSON object.
     */
    fileDetails?: Object;
    /**
     * Returns the name of the target module in file manager.
     */
    module?: string;
}

export interface PopupOpenCloseEventArgs {
    /**
     * Returns the current dialog component instance.
     */
    popupModule?: Dialog;
    /**
     * Returns the current dialog element.
     */
    element: HTMLElement;
    /**
     * Returns the current dialog action name.
     */
    popupName: string;
}

export interface BeforePopupOpenCloseEventArgs {
    /**
     * Returns the current dialog component instance.
     */
    popupModule: Dialog;
    /**
     * Returns the current dialog action name.
     */
    popupName: string;
    /**
     * Prevents the dialog from opening when it is set to true.
     */
    cancel: boolean;
}

export interface FileSelectEventArgs {
    /**
     * Return the name of action like select or unselect.
     */
    action?: string;
    /**
     * Return the currently selected item as JSON object.
     */
    fileDetails?: Object;
    /**
     * Defines whether event is triggered by interaction or not.
     */
    isInteracted?: boolean;
}
export interface FileSelectionEventArgs {
    /**
     * Return the name of action like select or unselect.
     */
    action?: string;
    /**
     * Defines the cancel selected file or folder. 
     */
    cancel?: boolean;
    /**
     * Return the currently selected item as JSON object.
     */
    fileDetails?: Object;
    /**
     * Defines whether event is triggered by interaction or not.
     */
    isInteracted?: boolean;
    /**
     * Specifies the actual target.
     */
    target?: Element;
}
export interface ToolbarCreateEventArgs {
    /**
     * Return an array of items that is used to configure toolbar content.
     * @blazorType List<Syncfusion.EJ2.Blazor.Navigations.ItemModel>
     */
    items: ItemModel[];
}

export interface ToolbarClickEventArgs {
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * Return the currently selected folder/file items as an array of JSON object.
     */
    fileDetails: Object[];
    /**
     * Return the currently clicked toolbar item as JSON object.
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ItemModel
     */
    item: ItemModel;
}

export interface MenuClickEventArgs {
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: Boolean;
    /**
     * Return the currently clicked context menu item.
     */
    element?: HTMLElement;
    /**
     * Return the currently selected folder/file items as an array of JSON object.
     */
    fileDetails?: Object[];
    /**
     * Return the currently clicked context menu item as JSON object.
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.MenuItemModel
     */
    item?: MenuItemModel;
}

export interface MenuOpenEventArgs {
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: boolean;
    /**
     * Returns the current context menu element.
     */
    element?: HTMLElement;
    /**
     * Returns the target folder/file item as an array of JSON object.
     */
    fileDetails?: Object[];
    /**
     * Returns the current context menu items as JSON object.
     * @blazorType List<Syncfusion.EJ2.Blazor.Navigations.MenuItemModel>
     */
    items?: MenuItemModel[];
    /**
     * Returns the instance of context menu component.
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ContextMenuModel
     */
    menuModule?: ContextMenu;
    /**
     * Returns whether the current context menu is sub-menu or not.
     */
    isSubMenu?: boolean;
    /**
     * Returns the target element of context menu.
     */
    target?: Element;
    /**
     * Returns the current context menu type based on current target.
     */
    menuType?: string;
}

export interface UploadListCreateArgs {
    /**
     * Return the current file item element.
     */
    element: HTMLElement;
    /**
     * Return the current rendering file item data as file object.
     */
    fileInfo: FileInfo;
    /**
     * Return the index of the file item in the file list.
     */
    index: number;
    /**
     * Return whether the file is preloaded.
     */
    isPreload: boolean;
}

export interface FileInfo {
    /**
     * Returns the upload file name.
     */
    name: string;
    /**
     * Returns the details about upload file.
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
     * Returns the MIME type of file as a string. Returns empty string if the file's type is not determined.
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
}

export interface ValidationMessages {
    /**
     * Returns the minimum file size validation message, if selected file size is less than the specified minFileSize property.
     */
    minSize?: string;
    /**
     * Returns the maximum file size validation message, if selected file size is less than specified maxFileSize property.
     */
    maxSize?: string;
}

/** @hidden */
export interface IFileManager extends Component<HTMLElement> {
    hasId: boolean;
    pathNames: string[];
    pathId: string[];
    originalPath: string;
    filterPath: string;
    filterId: string;
    expandedId: string;
    itemData: Object[];
    visitedData: Object;
    visitedItem: Element;
    feParent: Object[];
    feFiles: Object[];
    ajaxSettings: AjaxSettingsModel;
    toolbarSettings: ToolbarSettingsModel;
    dialogObj: Dialog;
    viewerObj: Dialog;
    extDialogObj: Dialog;
    splitterObj: Splitter;
    breadCrumbBarNavigation: HTMLElement;
    searchSettings: SearchSettingsModel;
    activeElements: Element[];
    contextMenuSettings: ContextMenuSettingsModel;
    contextmenuModule?: IContextMenu;
    navigationPaneSettings: NavigationPaneSettingsModel;
    targetPath: string;
    activeModule: string;
    selectedNodes: string[];
    previousPath: string[];
    nextPath: string[];
    navigationpaneModule: ITreeView;
    largeiconsviewModule: LargeIconsView;
    breadcrumbbarModule: BreadCrumbBar;
    toolbarSelection: boolean;
    duplicateItems: string[];
    duplicateRecords: Object[];
    fileAction: string;
    replaceItems: string[];
    createdItem: { [key: string]: Object; };
    renamedItem: { [key: string]: Object; };
    renamedId: string;
    uploadItem: string[];
    fileLength: number;
    detailsviewModule: DetailsView;
    toolbarModule: Toolbar;
    fileView: string;
    isDevice: Boolean;
    isMobile: Boolean;
    isBigger: Boolean;
    isFile: boolean;
    allowMultiSelection: boolean;
    selectedItems: string[];
    layoutSelectedItems: string[];
    sortOrder: SortOrder;
    sortBy: string;
    actionRecords: Object[];
    activeRecords: Object[];
    pasteNodes: string[];
    isCut: boolean;
    filterData: Object;
    isFiltered: boolean;
    isLayoutChange: boolean;
    isSearchCut: boolean;
    isPasteError: boolean;
    isSameAction: boolean;
    currentItemText: string;
    renameText: string;
    view: ViewType;
    isPathDrag: boolean;
    enablePaste: boolean;
    showThumbnail: boolean;
    allowDragAndDrop: boolean;
    enableRtl: boolean;
    path: string;
    folderPath: string;
    showFileExtension: boolean;
    enablePersistence: boolean;
    showHiddenItems: boolean;
    persistData: boolean;
    localeObj: L10n;
    uploadObj: Uploader;
    cssClass: string;
    searchedItems: Object[];
    searchWord: string;
    retryFiles: FileInfo[];
    retryArgs: RetryArgs[];
    isApplySame: boolean;
    isRetryOpened: boolean;
    dragData: { [key: string]: Object; }[];
    dragNodes: string[];
    dragPath: string;
    dropPath: string;
    dropData: Object;
    virtualDragElement: HTMLElement;
    isDragDrop: boolean;
    isSearchDrag: boolean;
    targetModule: string;
    treeExpandTimer: number;
    dragCursorPosition: PositionModel;
    isDropEnd: boolean;
    droppedObjects: Object[];
    uploadEventArgs: BeforeSendEventArgs;
    destinationPath: string;
    refreshLayout(): void;
}

/** @hidden */
export interface ITreeView extends Component<HTMLElement> {
    treeObj: TreeView;
    removeNode: Function;
    removeNodes: string[];
    duplicateFiles: Function;
    rootID: string;
    activeNode: Element;
}

/** @hidden */
export interface IContextMenu extends Component<HTMLElement> {
    disableItem(items: string[]): void;
    getItemIndex(item: string): number;
    contextMenu: ContextMenu;
    contextMenuBeforeOpen: Function;
    items: MenuItemModel[];
}