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

export type viewType = 'LargeIcons' | 'Details';
export type SortOrder = 'Ascending' | 'Descending';

/**
 * Interfaces for File Manager
 */
export interface IToolBarItems {
    template?: string;
    tooltipText?: string;
}

export interface FileMenuOpenEventArgs {
    element?: HTMLElement;
    fileDetails?: Object;
    items?: MenuItemModel[];
    menuModule?: ContextMenu;
    parentItem?: MenuItemModel;
    cancel?: boolean;
    target?: Element;
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

export interface ErrorArgs {
    code?: string;
    message?: string;
    fileExists?: string[];
}

export interface DialogOptions {
    header?: string;
    content?: string;
    buttons?: ButtonPropsModel[];
    open?: EmitType<Object>;
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
}
export interface DownloadArgs {
    files?: { [key: string]: Object; }[];
    error?: Object[];
    details?: Object;
}

export interface FileBeforeSendEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details which are send to server.
     */
    ajaxSettings?: Object;
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel?: boolean;
}

export interface FileOnSuccessEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details which are send to server.
     */
    result?: Object;
}

export interface FileOnErrorEventArgs {
    /**
     * Return the name of the AJAX action will be performed.
     */
    action?: string;
    /**
     * Return the AJAX details which are send to server.
     */
    error?: Object;
}

export interface FileBeforeLoadEventArgs {
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
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel?: boolean;
    /**
     * Return the currently selected item as JSON object.
     */
    fileDetails?: Object;
}

export interface FileSelectEventArgs {
    /**
     * Return the name of action like select or un-select.
     */
    action?: string;
    /**
     * Return the currently selected item as JSON object.
     */
    fileDetails?: Object;
}

export interface FileToolbarClickEventArgs {
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel: boolean;
    /**
     * Return the currently selected folder/file item as JSON object.
     */
    fileDetails: Object;
    /**
     * Return the currently clicked toolbar item as JSON object.
     */
    item: ItemModel;
}

export interface FileMenuClickEventArgs {
    /**
     * If you want to cancel this event then, set cancel as true. Otherwise, false.
     */
    cancel?: Boolean;
    /**
     * Return the currently clicked context menu item.
     */
    element?: HTMLElement;
    /**
     * Return the currently selected folder/file item as JSON object.
     */
    fileDetails?: Object;
    /**
     * Return the currently clicked context menu item as JSON object.
     */
    item?: MenuItemModel;
}

export interface IFileManager extends Component<HTMLElement> {
    pathId: string[];
    originalPath: string;
    expandedId: string;
    itemData: Object[];
    visitedData: Object;
    visitedItem: Element;
    feParent: Object[];
    feFiles: Object;
    ajaxSettings: AjaxSettingsModel;
    toolbarSettings: ToolbarSettingsModel;
    dialogObj: Dialog;
    viewerObj: Dialog;
    extDialogObj: Dialog;
    splitterObj: Splitter;
    breadCrumbBarNavigation: HTMLElement;
    searchSettings: SearchSettingsModel;
    activeElements: NodeListOf<Element>;
    contextMenuSettings: ContextMenuSettingsModel;
    contextmenuModule?: IContextMenu;
    navigationPaneSettings: NavigationPaneSettingsModel;
    targetPath: string;
    activeModule: string;
    selectedNodes: string[];
    deleteHandler: Function;
    previousPath: string[];
    nextPath: string[];
    navigationpaneModule: ITreeView;
    largeiconsviewModule: LargeIconsView;
    breadcrumbbarModule: BreadCrumbBar;
    toolbarSelection: boolean;
    fileOperation: Function;
    getDetails: Function;
    pasteHandler: Function;
    duplicateItems: string[];
    fileAction: string;
    replaceItems: string[];
    createdItem: { [key: string]: Object; };
    renamedItem: { [key: string]: Object; };
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
    nodeNames: Object[];
    sortOrder: SortOrder;
    sortBy: string;
    cutNodes: Object[];
    pasteNodes: Object[];
    currentItemText: string;
    renameText: string;
    parentPath: string;
    view: viewType;
    enablePaste: boolean;
    showThumbnail: boolean;
    enableRtl: boolean;
    path: string;
    showFileExtension: boolean;
    enablePersistence: boolean;
    showHiddenItems: boolean;
    persistData: boolean;
    singleSelection: string;
    localeObj: L10n;
    uploadObj: Uploader;
    cssClass: string;
    searchedItems: Object[];
}

export interface ITreeView extends Component<HTMLElement> {
    treeObj: TreeView;
    treeNodes: string[];
    moveNode: Function;
    removeNode: Function;
    removeNodes: string[];
    copyNode: Function;
    duplicateFiles: Function;
    copyNodes: { [key: string]: Object }[];
    rootNode: string;
    rootID: string;
    activeNode: Element;
}

export interface IContextMenu extends Component<HTMLElement> {
    contextMenu: ContextMenu;
    contextMenuBeforeOpen: Function;
    items: MenuItemModel[];
}

