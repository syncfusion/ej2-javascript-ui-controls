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

/**
 * Defines the view type of the FileManager.
 */
export type ViewType = 'LargeIcons' | 'Details';
/**
 * Defines the files sorting order in FileManager.
 */
export type SortOrder = 'Ascending' |'Descending'| 'None';

/**
 * Defines the Toolbar items of the FileManager.
 */
export type ToolBarItems = 'NewFolder' | 'Upload' | 'Cut' | 'Copy' | 'Paste' | 'Delete' | 'Download'
| 'Rename' | 'SortBy' | 'Refresh' | 'Selection' | 'View' | 'Details';
/**
 * Defines the Context menu items for the FileManager.
 */
export type MenuItems = 'NewFolder' | 'Upload' | 'Cut' | 'Copy' | 'Paste' | 'Delete' | 'Download'
| 'Rename' | 'SortBy' | 'Refresh' | 'SelectAll' | 'View' | 'Details' | 'Open';

/**
 * Interfaces for File Manager Toolbar items.
 */
export interface IToolBarItems {
    template?: string;
    tooltipText?: string;
}
/** @hidden */
export interface NotifyArgs {
    module?: string;
    newProp?: FileManagerModel;
    oldProp?: FileManagerModel;
    target?: Element;
    selectedNode?: string;
}
/** @hidden */
export interface ReadArgs {
    // eslint-disable-next-line
    cwd?: { [key: string]: Object; };
    // eslint-disable-next-line
    files?: { [key: string]: Object; }[];
    error?: ErrorArgs;
    // eslint-disable-next-line
    details?: Object;
    id?: string;
}
/** @hidden */
export interface MouseArgs {
    target?: Element;
}
/** @hidden */
export interface UploadArgs {
    // eslint-disable-next-line
    files?: { [key: string]: Object; }[];
    // eslint-disable-next-line
    error?: Object[];
    // eslint-disable-next-line
    details?: Object;
}
/** @hidden */
export interface RetryArgs {
    action: string;
    file: FileInfo;
}
/** @hidden */
export interface ErrorArgs {
    code?: string;
    message?: string;
    fileExists?: string[];
}
/** @hidden */
export interface DialogOptions {
    dialogName?: string;
    header?: string;
    content?: string;
    buttons?: ButtonPropsModel[];
    // eslint-disable-next-line
    open?: EmitType<Object>;
    // eslint-disable-next-line
    close?: EmitType<Object>;
}
/** @hidden */
export interface SearchArgs {
    // eslint-disable-next-line
    files?: { [key: string]: Object; }[];
    // eslint-disable-next-line
    error?: Object[];
    // eslint-disable-next-line
    details?: Object;
}
/**
 * Interfaces for File details.
 */
export interface FileDetails {
    created?: string;
    isFile: boolean;
    location: string;
    modified: string;
    name: string;
    size: number;
    icon: string;
    multipleFiles: boolean;
    // eslint-disable-next-line
    permission: Object;
}
/** @hidden */
export interface DownloadArgs {
    // eslint-disable-next-line
    files?: { [key: string]: Object; }[];
    // eslint-disable-next-line
    error?: Object[];
    // eslint-disable-next-line
    details?: Object;
}

/**
 * Interface for Drag Event arguments
 */
export interface FileDragEventArgs {
    /**
     * Return the current items as an array of JSON object.
     */
    // eslint-disable-next-line
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
    cancel?: boolean;
}
/**
 * Interface for BeforeSend event arguments.
 */
export interface BeforeSendEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details, which are send to server.
     */
    // eslint-disable-next-line
    ajaxSettings?: Object;
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: boolean;
}
/**
 * Interface for BeforeDownload event arguments.
 */
export interface BeforeDownloadEventArgs {
    /**
     * Specifies the data to be sent to server.
     */
    // eslint-disable-next-line
    data?: Object;
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: boolean;
}
/**
 * Interface for BeforeImageLoad event arguments.
 */
export interface BeforeImageLoadEventArgs {
    /**
     * Return the current rendering image item as an array of JSON object.
     */
    // eslint-disable-next-line
    fileDetails?: Object[];
    /**
     * Specifies the URL along with custom attributes to be sent to server.
     */
    imageUrl?: string;
}
/**
 * Interface for Success event arguments.
 */
export interface SuccessEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details which are send to server.
     */
    // eslint-disable-next-line
    result?: Object;
}
/**
 * Interface for Failure event arguments.
 */
export interface FailureEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details, which are send to server.
     */
    // eslint-disable-next-line
    error?: Object;
}
/**
 * Interface for FileLoad event arguments.
 */
export interface FileLoadEventArgs {
    /**
     * Return the current rendering item.
     */
    element?: HTMLElement;
    /**
     * Return the current rendering item as JSON object.
     */
    // eslint-disable-next-line
    fileDetails?: Object;
    /**
     * Return the name of the rendering module in File Manager.
     */
    module?: string;
}
/**
 * Interface for FileOpen event arguments.
 */
export interface FileOpenEventArgs {
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: boolean;
    /**
     * Return the currently selected item as JSON object.
     */
    // eslint-disable-next-line
    fileDetails?: Object;
    /**
     * Returns the name of the target module in file manager.
     */
    module?: string;
}
/**
 * Interface for PopupOpenClose event arguments.
 */
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
/**
 * Interface for BeforePopupOpenClose event arguments.
 */
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
/**
 * Interface for FileSelect event arguments.
 */
export interface FileSelectEventArgs {
    /**
     * Return the name of action like select or unselect.
     */
    action?: string;
    /**
     * Return the currently selected item as JSON object.
     */
    // eslint-disable-next-line
    fileDetails?: Object;
    /**
     * Defines whether event is triggered by interaction or not.
     */
    isInteracted?: boolean;
}
/**
 * Interface for FileSelection event arguments.
 */
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
    // eslint-disable-next-line
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
/**
 * Interface for ToolbarCreate event arguments.
 */
export interface ToolbarCreateEventArgs {
    /**
     * Return an array of items that is used to configure toolbar content.
     */
    items: ItemModel[];
}
/**
 * Interface for ToolbarClick event arguments.
 */
export interface ToolbarClickEventArgs {
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * Return the currently selected folder/file items as an array of JSON object.
     */
    // eslint-disable-next-line
    fileDetails: Object[];
    /**
     * Return the currently clicked toolbar item as JSON object.
     */
    item: ItemModel;
}
/**
 * Interface for MenuClick event arguments.
 */
export interface MenuClickEventArgs {
    /**
     * If you want to cancel this event then, set cancel to true. Otherwise, false.
     */
    cancel?: boolean;
    /**
     * Return the currently clicked context menu item.
     */
    element?: HTMLElement;
    /**
     * Return the currently selected folder/file items as an array of JSON object.
     */
    // eslint-disable-next-line
    fileDetails?: Object[];
    /**
     * Return the currently clicked context menu item as JSON object.
     */
    item?: MenuItemModel;
}
/**
 * Interface for MenuOpen event arguments.
 */
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
    // eslint-disable-next-line
    fileDetails?: Object[];
    /**
     * Returns the current context menu items as JSON object.
     */
    items?: MenuItemModel[];
    /**
     * Returns the instance of context menu component.
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
/**
 * Interface for UploadListCreate event arguments.
 */
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
/**
 * Interface for File information.
 */
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
/**
 * Interface for Validation messages.
 */
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
    // eslint-disable-next-line
    itemData: Object[];
    // eslint-disable-next-line
    visitedData: Object;
    visitedItem: Element;
    // eslint-disable-next-line
    feParent: Object[];
    // eslint-disable-next-line
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
    // eslint-disable-next-line
    duplicateRecords: Object[];
    fileAction: string;
    replaceItems: string[];
    // eslint-disable-next-line
    createdItem: { [key: string]: Object; };
    // eslint-disable-next-line
    renamedItem: { [key: string]: Object; };
    renamedId: string;
    uploadItem: string[];
    fileLength: number;
    detailsviewModule: DetailsView;
    toolbarModule: Toolbar;
    fileView: string;
    isDevice: boolean;
    isMobile: boolean;
    isBigger: boolean;
    isFile: boolean;
    allowMultiSelection: boolean;
    selectedItems: string[];
    layoutSelectedItems: string[];
    sortOrder: SortOrder;
    sortBy: string;
    // eslint-disable-next-line
    actionRecords: Object[];
    // eslint-disable-next-line
    activeRecords: Object[];
    pasteNodes: string[];
    isCut: boolean;
    // eslint-disable-next-line
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
    rootAliasName: string;
    path: string;
    popupTarget: HTMLElement | string;
    folderPath: string;
    showFileExtension: boolean;
    enablePersistence: boolean;
    showHiddenItems: boolean;
    persistData: boolean;
    localeObj: L10n;
    uploadObj: Uploader;
    cssClass: string;
    // eslint-disable-next-line
    searchedItems: Object[];
    searchWord: string;
    retryFiles: FileInfo[];
    retryArgs: RetryArgs[];
    isApplySame: boolean;
    isRetryOpened: boolean;
    // eslint-disable-next-line
    dragData: { [key: string]: Object; }[];
    dragNodes: string[];
    dragPath: string;
    dropPath: string;
    // eslint-disable-next-line
    dropData: Object;
    virtualDragElement: HTMLElement;
    isDragDrop: boolean;
    isSearchDrag: boolean;
    targetModule: string;
    treeExpandTimer: number;
    dragCursorPosition: PositionModel;
    isDropEnd: boolean;
    dragCount: number;
    // eslint-disable-next-line
    droppedObjects: Object[];
    uploadEventArgs: BeforeSendEventArgs;
    destinationPath: string;
    enableHtmlSanitizer: boolean;
    refreshLayout(): void;
}

/** @hidden */
export interface ITreeView extends Component<HTMLElement> {
    treeObj: TreeView;
    // eslint-disable-next-line
    removeNode: Function;
    removeNodes: string[];
    // eslint-disable-next-line
    duplicateFiles: Function;
    rootID: string;
    activeNode: Element;
}

/** @hidden */
export interface IContextMenu extends Component<HTMLElement> {
    disableItem(items: string[]): void;
    getItemIndex(item: string): number;
    contextMenu: ContextMenu;
    // eslint-disable-next-line
    contextMenuBeforeOpen: Function;
    items: MenuItemModel[];
}
