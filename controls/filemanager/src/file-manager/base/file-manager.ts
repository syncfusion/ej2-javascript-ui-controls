import { Component, EmitType, ModuleDeclaration, isNullOrUndefined, L10n, closest, Collection, detach, selectAll, setStyleAttribute } from '@syncfusion/ej2-base';
import { Property, INotifyPropertyChanged, NotifyPropertyChanges, Complex, select } from '@syncfusion/ej2-base';
import { createElement, addClass, removeClass, setStyleAttribute as setAttr, getUniqueID } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, formatUnit, Browser, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Event, EventHandler, getValue, setValue } from '@syncfusion/ej2-base';
import { Splitter, PanePropertiesModel } from '@syncfusion/ej2-layouts';
import { Dialog, createSpinner, hideSpinner, showSpinner, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { createDialog, createExtDialog } from '../pop-up/dialog';
import { ToolbarSettings, ToolbarSettingsModel, AjaxSettings, NavigationPaneSettings, DetailsViewSettings } from '../models/index';
import { ToolbarItem, ToolbarItemModel } from'../models/index' ;
import { NavigationPaneSettingsModel, DetailsViewSettingsModel } from '../models/index';
import { AjaxSettingsModel, SearchSettings, SearchSettingsModel } from '../models/index';
import { Toolbar } from '../actions/toolbar';
import { DetailsView } from '../layout/details-view';
import { LargeIconsView } from '../layout/large-icons-view';
import { Uploader, UploadingEventArgs, SelectedEventArgs, FileInfo, CancelEventArgs } from '@syncfusion/ej2-inputs';
import { UploadSettingsModel } from '../models/upload-settings-model';
import { UploadSettings } from '../models/upload-settings';
import * as events from './constant';
import * as CLS from './classes';
import { read, filter, createFolder } from '../common/operations';
import { FileManagerModel } from './file-manager-model';
import { ITreeView, IContextMenu, ViewType, SortOrder, FileDragEventArgs, RetryArgs, ReadArgs, FileSelectionEventArgs } from './interface';
import { BeforeSendEventArgs, SuccessEventArgs, FailureEventArgs, FileLoadEventArgs, FolderCreateEventArgs, DeleteEventArgs, RenameEventArgs, MoveEventArgs, SearchEventArgs } from './interface';
import { FileOpenEventArgs, FileSelectEventArgs, MenuClickEventArgs, MenuOpenEventArgs, MenuCloseEventArgs } from './interface';
import { ToolbarClickEventArgs, ToolbarCreateEventArgs, UploadListCreateArgs } from './interface';
import { PopupOpenCloseEventArgs, BeforePopupOpenCloseEventArgs, BeforeDownloadEventArgs, BeforeImageLoadEventArgs } from './interface';
import { refresh, getPathObject, getLocaleText, setNextPath, createDeniedDialog, getCssClass } from '../common/utility';
import { hasContentAccess, hasUploadAccess, updateLayout, createNewFolder, uploadItem, closePopup } from '../common/utility';
import { TreeView as BaseTreeView } from '@syncfusion/ej2-navigations';
import { ColumnModel } from '@syncfusion/ej2-grids';
import { ContextMenuSettingsModel } from '../models/contextMenu-settings-model';
import { ContextMenuSettings } from '../models/contextMenu-settings';
import { BreadCrumbBar } from '../actions/breadcrumb-bar';
import { ContextMenu } from '../pop-up/context-menu';
import { defaultLocale } from '../models/default-locale';
import { PositionModel } from '@syncfusion/ej2-base/src/draggable-model';
import { Virtualization } from '../actions/virtualization';
import { SortComparer } from './interface';

/**
 * The FileManager component allows users to access and manage the file system through the web  browser. It can performs the
 * functionalities like add, rename, search, sort, upload and delete files or folders. And also it
 * provides an easy way of  dynamic injectable modules like toolbar, navigationpane, detailsview, largeiconsview.
 * ```html
 *  <div id="file"></div>
 * ```
 * ```typescript,
 *  let feObj: FileManager = new FileManager();
 *  feObj.appendTo('#file');
 * ```
 */

@NotifyPropertyChanges
export class FileManager extends Component<HTMLElement> implements INotifyPropertyChanged {

    /* Internal modules */
    /** @hidden */
    public toolbarModule: Toolbar;
    /** @hidden */
    public detailsviewModule: DetailsView;
    /** @hidden */
    public navigationpaneModule: ITreeView;
    /** @hidden */
    public largeiconsviewModule: LargeIconsView;
    /** @hidden */
    public contextmenuModule: IContextMenu;
    /** @hidden */
    public breadcrumbbarModule: BreadCrumbBar;
    /** @hidden */
    public virtualizationModule: Virtualization;


    /* Internal variables */
    private keyboardModule: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    public filterData: Object = null;
    public originalPath: string;
    public filterPath: string;
    public filterId: string;
    public hasId: boolean;
    public pathNames: string[];
    public pathId: string[];
    public expandedId: string;
    public itemData: Object[];
    public visitedData: Object;
    public visitedItem: Element;
    public toolbarSelection: boolean;
    // Specifies the parent path of the CWD(this.path).
    public targetPath: string;
    public feParent: Object[];
    public feFiles: Object[];
    public activeElements: Element[];
    public activeModule: string;
    public targetModule: string;
    public treeObj: BaseTreeView;
    public dialogObj: Dialog;
    public viewerObj: Dialog;
    public extDialogObj: Dialog;
    public selectedNodes: string[] = [];
    public duplicateItems: string[] = [];
    public duplicateRecords: Object[] = [];
    public previousPath: string[] = [];
    public nextPath: string[] = [];
    public fileAction: string;
    public pasteNodes: string[];
    // Specifies response data of the file or folder.
    public responseData: { [key: string]: Object; };
    public existingFileCount: number = 0;
    public isLayoutChange: boolean = false;
    public replaceItems: string[];
    public createdItem: { [key: string]: Object; };
    public layoutSelectedItems: string[] = [];
    public renamedItem: { [key: string]: Object; };
    public renamedId: string = null;
    public uploadItem: string[] = [];
    public fileLength: number;
    public deleteRecords: string[] = [];
    public fileView: string;
    public isDevice: boolean;
    public isMobile: boolean;
    public isBigger: boolean;
    public isFile: boolean = false;
    public actionRecords: Object[];
    public activeRecords: Object[];
    public isCut: boolean = false;
    public isSearchCut: boolean = false;
    public isSearchDrag: boolean = false;
    public isPasteError: boolean = false;
    public folderPath: string = '';
    public isSameAction: boolean = false;
    public currentItemText: string;
    public renameText: string;
    public isFiltered: boolean = false;
    // Specifies whether the sort by option is clicked or not.
    public isSortByClicked: boolean = false;
    public enablePaste: boolean = false;
    public splitterObj: Splitter;
    public persistData: boolean = false;
    public breadCrumbBarNavigation: HTMLElement;
    public localeObj: L10n;
    public uploadObj: Uploader;
    public uploadDialogObj: Dialog;
    public retryArgs: RetryArgs[] = [];
    private isOpened: boolean = false;
    public isRetryOpened: boolean = false;
    public isPathDrag: boolean = false;
    public searchedItems: { [key: string]: Object; }[] = [];
    public searchWord: string;
    public retryFiles: FileInfo[] = [];
    public isApplySame: boolean = false;
    public uploadEventArgs: BeforeSendEventArgs;
    public dragData: { [key: string]: Object; }[] = [];
    public dragNodes: string[] = [];
    public dragPath: string = '';
    public dropPath: string = '';
    public isDragDrop: boolean = false;
    public virtualDragElement: HTMLElement;
    public dropData: Object;
    public treeExpandTimer: number = null;
    public dragCursorPosition: PositionModel = { left: 44, top: 18 };
    public isDropEnd: boolean = false;
    public dragCount: number = 0;
    public droppedObjects: Object[] = [];
    public destinationPath: string;
    public uploadingCount: number = 0;
    public uploadedCount: number = 0;
    //Specifies whether the operating system is MAC or not
    public isMac : boolean = false;
    public oldView: string;
    public oldPath: string;
    private viewElem: HTMLElement;
    private dragSelectElement: HTMLElement;
    private dragX: number;
    private dragY: number;
    private dragSelectedItems: string[] = [];

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
    @Complex<AjaxSettingsModel>({}, AjaxSettings)
    public ajaxSettings: AjaxSettingsModel;

    /**
     * Specifies the array of data to populate folders/files in the File Manager.
     * The mandatory fields to be included in the JSON data are defined in fileData interface.
     * This interface can be extended to add additional fields as required.
     *
     * @default []
     */
    @Property([])
    public fileSystemData: { [key: string]: Object }[];

    /**
     * Enables or disables drag-and-drop of files.
     *
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Enables or disables the multiple files selection of the file manager.
     *
     * @default true
     */
    @Property(true)
    public allowMultiSelection: boolean;

    /**
     * Gets or sets a boolean value that determines whether to display checkboxes in the file manager. If enabled, checkboxes are shown for files or folders on hover.
     *
     * @default true
     */
    @Property(true)
    public showItemCheckBoxes: boolean;

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
    @Complex<ContextMenuSettingsModel>({}, ContextMenuSettings)
    public contextMenuSettings: ContextMenuSettingsModel;

    /**
     * Specifies the root CSS class of the file manager that allows you to customize the appearance by overriding the styles.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

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
    @Complex<DetailsViewSettingsModel>({}, DetailsViewSettings)
    public detailsViewSettings: DetailsViewSettingsModel;

    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Enables or disables persisting component's state between page reloads. If enabled, the following APIs will persist:
     * 1. `view`: Represents the previous view of the file manager.
     * 2. `path`: Represents the previous path of the file manager.
     * 3. `selectedItems`: Represents the previous selected items in the file manager.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Gets or sets a value that enables/disables the virtualization feature of the File Manager.
     * When enabled, the File Manager will only load a subset of files and folders based on the size of the view port, with the rest being loaded dynamically as the user scrolls vertically through the list.
     * This can improve performance when dealing with a large number of files and folders, as it reduces the initial load time and memory usage.
     *
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;

    /**
     * Specifies the height of the file manager.
     *
     * @default '400px'
     */
    @Property('400px')
    public height: string | number;

    /**
     * Specifies the initial view of the file manager.
     * With the help of this property, initial view can be changed to details or largeicons view. The available views are:
     * * `LargeIcons`
     * * `Details`
     *
     * @default 'LargeIcons'
     */
    @Property('LargeIcons')
    public view: ViewType;

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
    @Complex<NavigationPaneSettingsModel>({}, NavigationPaneSettings)
    public navigationPaneSettings: NavigationPaneSettingsModel;

    /**
     * Specifies the current path of the file manager.
     *
     * @default '/'
     */
    @Property('/')
    public path: string;

    /**
     * Specifies the target element in which the File Manager’s dialog will be displayed.
     * The default value is null, which refers to the File Manager element.
     *
     * @default null
     */
    @Property(null)
    public popupTarget: HTMLElement | string;

    /**
     * Specifies the search settings of the file manager.
     *
     * @default {
     *  allowSearchOnTyping: true,
     *  filterType: 'contains',
     *  ignoreCase: true
     * }
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;

    /**
     * Specifies the selected folders and files name of the  file manager.
     *
     * @default []
     */
    @Property()
    public selectedItems: string[];

    /**
     * Shows or hides the file extension in file manager.
     *
     * @default true
     */
    @Property(true)
    public showFileExtension: boolean;

    /**
     * Specifies the root folder alias name in file manager
     *
     * @default null
     */
    @Property(null)
    public rootAliasName: string;

    /**
     * Determines whether to show or hide hidden files and folders.
     * This is applicable only for storage systems that support attributes for controlling the visibility of data, including physical file directories and custom flat data handlers.
     *
     * @default false
     */
    @Property(false)
    public showHiddenItems: boolean;

    /**
     * Shows or hides the thumbnail images in largeicons view.
     *
     * @default true
     */
    @Property(true)
    public showThumbnail: boolean;

    /**
     * Specifies a value that indicates whether the folders and files are sorted in the ascending or descending order,
     * or they are not sorted at all. The available types of sort orders are,
     * `None` - Indicates that the folders and files are not sorted.
     * `Ascending` - Indicates that the folders and files are sorted in the ascending order.
     * `Descending` - Indicates that the folders and files are sorted in the descending order.
     *
     * @default 'Ascending'
     */
    @Property('Ascending')
    public sortOrder: SortOrder;

    /**
     * Specifies the field name being used as the sorting criteria to sort the files of the file manager component.
     *
     * @default 'name'
     */
    @Property('name')
    public sortBy: string;

    /**
     * Defines the custom sorting function.
     * The sort comparer function has the same functionality like
     * [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) sort comparer.
     * This can be used to customize the default sorting functionalities with required comparison values.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public sortComparer: SortComparer | string;

    /**
     * Gets or sets a value that indicates whether the File Manager allows multiple items selection with mouse dragging.
     * Set this property to true to allow users to select multiple items with mouse drag as like file explorer. Hover over
     * the files or folders and drag the mouse to select the required items.
     *
     * @default false
     */
    @Property(false)
    public enableRangeSelection: boolean;

    /**
     * Specifies the group of items aligned horizontally in the toolbar.
     *
     * @default {
     *  items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete',
     *  'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'],
     *  visible: true
     * }
     */
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * An array of items that are used to configure File Manager toolbar items.
     *
     * @remarks
     * Use this property if you want to include custom toolbar items along with existing toolbar items. If both `toolbarSettings` and `toolbarItems` are defined, then items will be rendered based on toolbarItems.
     *
     * @default []
     *
     */
    @Collection<ToolbarItemModel>([], ToolbarItem)
    public toolbarItems: ToolbarItemModel[];

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
    @Complex<UploadSettingsModel>({}, UploadSettings)
    public uploadSettings: UploadSettingsModel;

    /**
     * Specifies the width of the file manager.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Triggers before the file/folder is rendered.
     *
     * @event fileLoad
     */
    @Event()
    public fileLoad: EmitType<FileLoadEventArgs>;

    /**
     * Triggers before the file/folder is opened.
     *
     * @event fileOpen
     */
    @Event()
    public fileOpen: EmitType<FileOpenEventArgs>;

    /**
     * Triggers before sending the download request to the server.
     *
     * @event beforeDownload
     */
    @Event()
    public beforeDownload: EmitType<BeforeDownloadEventArgs>;

    /**
     * Triggers before sending the getImage request to the server.
     *
     * @event beforeImageLoad
     */
    @Event()
    public beforeImageLoad: EmitType<BeforeImageLoadEventArgs>;

    /**
     * Triggers before the dialog is closed.
     *
     * @event beforePopupClose
     */
    @Event()
    public beforePopupClose: EmitType<BeforePopupOpenCloseEventArgs>;

    /**
     * Triggers before the dialog is opened.
     *
     * @event beforePopupOpen
     */
    @Event()
    public beforePopupOpen: EmitType<BeforePopupOpenCloseEventArgs>;

    /**
     * Triggers before sending the AJAX request to the server.
     *
     * @event beforeSend
     */
    @Event()
    public beforeSend: EmitType<BeforeSendEventArgs>;

    /**
     * Triggers when the file manager component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * This event is triggered before a folder is created. It allows for the restriction of folder creation based on the application's use case.
     *
     * @event beforeFolderCreate
     */
    @Event()
    public beforeFolderCreate: EmitType<FolderCreateEventArgs>;
    /**
     * This event is triggered when a folder is successfully created. It provides an opportunity to retrieve details about the newly created folder.
     *
     * @event folderCreate
     */
    @Event()
    public folderCreate: EmitType<FolderCreateEventArgs>;

    /**
     * Triggers when the file manager component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * This event is triggered before the deletion of a file or folder occurs. It can be utilized to prevent the deletion of specific files or folders. Any actions, such as displaying a spinner for deletion, can be implemented here.
     *
     * @event beforeDelete
     */
    @Event()
    public beforeDelete: EmitType<DeleteEventArgs>;
    /**
     * This event is triggered after the file or folder is deleted successfully. The deleted file or folder details can be retrieved here. Additionally, custom elements' visibility can be managed here based on the application's use case.
     *
     * @event delete
     */
    @Event()
    public delete: EmitType<DeleteEventArgs>;
    /**
     * This event is triggered when a file or folder is about to be renamed. It allows for the restriction of the rename action for specific folders or files by utilizing the cancel option.
     *
     * @event beforeRename
     */
    @Event()
    public beforeRename: EmitType<RenameEventArgs>;
    /**
     * This event is triggered when a file or folder is successfully renamed. It provides an opportunity to fetch details about the renamed file.
     *
     * @event rename
     */
    @Event()
    public rename: EmitType<RenameEventArgs>;
    /**
     * This event is triggered when a file or folder begins to move from its current path through a copy/cut and paste action.
     *
     * @event beforeMove
     */
    @Event()
    public beforeMove: EmitType<MoveEventArgs>;
    /**
     * This event is triggered when a file or folder is pasted into the destination path.
     *
     * @event move
     */
    @Event()
    public move: EmitType<MoveEventArgs>;

    /**
     * This event is triggered when a search action occurs in the search bar of the File Manager component. It triggers each character entered in the input during the search process.
     *
     * @event search
     */
    @Event()
    public search: EmitType<SearchEventArgs>;


    /**
     * Triggers when the file/folder dragging is started.
     *
     * @event fileDragStart
     */
    @Event()
    public fileDragStart: EmitType<FileDragEventArgs>;

    /**
     * Triggers while dragging the file/folder.
     *
     * @event fileDragging
     */
    @Event()
    public fileDragging: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is about to be dropped at the target.
     *
     * @event fileDragStop
     */
    @Event()
    public fileDragStop: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is dropped.
     *
     * @event fileDropped
     */
    @Event()
    public fileDropped: EmitType<FileDragEventArgs>;

    /**
     * Triggers before the file/folder is selected.
     *
     * @event fileSelection
     */
    @Event()
    public fileSelection: EmitType<FileSelectionEventArgs>;

    /**
     * Triggers when the file/folder is selected/unselected.
     *
     * @event fileSelect
     */
    @Event()
    public fileSelect: EmitType<FileSelectEventArgs>;

    /**
     * Triggers when the context menu item is clicked.
     *
     * @event menuClick
     */
    @Event()
    public menuClick: EmitType<MenuClickEventArgs>;

    /**
     * Triggers before the context menu is opened.
     *
     * @event menuOpen
     */
    @Event()
    public menuOpen: EmitType<MenuOpenEventArgs>;

    /**
     * Triggers before the context menu is closed.
     *
     * @event menuClose
     */
    @Event()
    public menuClose: EmitType<MenuCloseEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     *
     * @event failure
     */
    @Event()
    public failure: EmitType<FailureEventArgs>;

    /**
     * Triggers when the dialog is closed.
     *
     * @event popupClose
     */
    @Event()
    public popupClose: EmitType<PopupOpenCloseEventArgs>;

    /**
     * Triggers when the dialog is opened.
     *
     * @event popupOpen
     */
    @Event()
    public popupOpen: EmitType<PopupOpenCloseEventArgs>;

    /**
     * Triggers when the AJAX request is success.
     *
     * @event success
     */
    @Event()
    public success: EmitType<SuccessEventArgs>;

    /**
     * Triggers when the toolbar item is clicked.
     *
     * @event toolbarClick
     */
    @Event()
    public toolbarClick: EmitType<ToolbarClickEventArgs>;

    /**
     * Triggers before creating the toolbar.
     *
     * @event toolbarCreate
     */
    @Event()
    public toolbarCreate: EmitType<ToolbarCreateEventArgs>;

    /**
     * Triggers before rendering each file item in upload dialog box.
     *
     * @event uploadListCreate
     */
    @Event()
    public uploadListCreate: EmitType<UploadListCreateArgs>;

    constructor(options?: FileManagerModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        FileManager.Inject(BreadCrumbBar, LargeIconsView, ContextMenu);
    }

    /**
     * Get component name.
     *
     * @returns {string} - returns module name.
     * @private
     */
    public getModuleName(): string {
        return 'filemanager';
    }

    /**
     * Initialize the event handler
     *
     * @returns {void}
     */
    protected preRender(): void {
        if (isNOU(this.element.id) || this.element.id === '') {
            this.element.setAttribute('id', getUniqueID('filemanager'));
        }
        this.ensurePath();
        this.feParent = [];
        this.feFiles = [];
        setAttr(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        this.isDevice = Browser.isDevice as boolean;
        this.isMobile = this.checkMobile();
        if (this.isMobile) {
            this.setProperties({ navigationPaneSettings: { visible: false } }, true);
        }
        const ele: Element = closest(this.element, '.e-bigger');
        this.isBigger = ele ? true : false;
        this.activeModule = (this.view === 'LargeIcons') ? 'largeiconsview' : 'detailsview';
        createSpinner({ target: this.element }, createElement);
        this.addWrapper();
        this.keyConfigs = {
            altN: 'alt+n',
            f5: 'f5',
            ctrlShift1: 'ctrl+shift+1',
            ctrlShift2: 'ctrl+shift+2',
            ctrlU: 'ctrl+u'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
    }

    /**
     * Gets the properties to be maintained upon browser refresh.
     *
     * @returns {string} - returns the persisted data.
     * @hidden
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['view', 'path', 'selectedItems'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * To provide the array of modules needed for component rendering
     *
     * @returns {ModuleDeclaration[]} - returns module declaration.
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        modules.push({
            member: 'breadcrumbbar',
            args: [this]
        });
        modules.push({
            member: 'largeiconsview',
            args: [this]
        });
        if (this.toolbarSettings.visible) {
            modules.push({
                member: 'toolbar',
                args: [this],
                name: 'Toolbar'
            });
        }
        if (this.navigationPaneSettings.visible) {
            modules.push({
                member: 'navigationpane',
                args: [this],
                name: 'NavigationPane'
            });
        }
        if (this.view) {
            modules.push({
                member: 'detailsview',
                args: [this],
                name: 'DetailsView'
            });
        }
        if (this.contextMenuSettings.visible && !this.isDevice) {
            modules.push({
                member: 'contextmenu',
                args: [this],
                name: 'ContextMenu'
            });
        }
        if (this.enableVirtualization) {
            modules.push({
                member: 'virtualization',
                args: [this],
                name: 'Virtualization'
            });
        }
        return modules;
    }

    /**
     * To Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initialize();
        const slItems: string[] = isNOU(this.selectedItems) ? [] :
            this.allowMultiSelection ? this.selectedItems : this.selectedItems.slice(this.selectedItems.length - 1);
        this.setProperties({ selectedItems: slItems }, true);
        this.fileView = this.view;
        this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        this.setRtl(this.enableRtl);
        this.addEventListeners();
        read(this, (this.path !== this.originalPath) ? events.initialEnd : events.finalizeEnd, this.path);
        if (this.fileView === 'Details') {
            this.largeiconsviewModule.element.classList.add(CLS.DISPLAY_NONE);
        }
        this.adjustHeight();
        if (isNOU(this.navigationpaneModule)) {
            this.splitterObj.collapse(this.enableRtl ? 1 : 0);
            const bar: Element = select('.' + CLS.SPLIT_BAR, this.element);
            bar.classList.add(CLS.DISPLAY_NONE);
        }
        this.wireEvents();
        this.renderComplete();
    }

    private ensurePath(): void {
        let currentPath: string = this.path;
        if (isNOU(currentPath)) {
            currentPath = '/';
        }
        if (currentPath.lastIndexOf('/') !== (currentPath.length - 1)) {
            currentPath = currentPath + '/';
        }
        this.originalPath = currentPath;
        const paths: string[] = currentPath.split('/');
        this.setProperties({ path: paths[0] + '/' }, true);
        this.pathNames = [];
        this.pathId = ['fe_tree'];
        this.itemData = [];
    }

    private initialize(): void {
        if (this.isMobile) { addClass([this.element], CLS.MOBILE); }
        if (this.allowMultiSelection) { addClass([this.element], CLS.CHECK_SELECT); }
        this.addCssClass(null, this.cssClass);
        this.renderFileUpload();
    }

    private addWrapper(): void {
        const headerWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.TOOLBAR_ID });
        this.element.appendChild(headerWrap);
        const layoutWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.LAYOUT_ID, className: CLS.LAYOUT
        });
        this.element.appendChild(layoutWrap);
        const navigationWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.NAVIGATION_ID, className: CLS.NAVIGATION
        });
        const treeWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.TREE_ID
        });
        navigationWrap.appendChild(treeWrap);
        const contentWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.CONTENT_ID, className: CLS.LAYOUT_CONTENT
        });
        this.breadCrumbBarNavigation = this.createElement('div', {
            id: this.element.id + CLS.BREADCRUMBBAR_ID,
            className: CLS.BREADCRUMBS
        });
        contentWrap.appendChild(this.breadCrumbBarNavigation);
        const gridWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.GRID_ID
        });
        contentWrap.appendChild(gridWrap);
        const largeiconWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.LARGEICON_ID,
            className: CLS.LARGE_ICONS, attrs: { 'role': 'group' }
        });
        contentWrap.appendChild(largeiconWrap);
        const overlay: HTMLElement = this.createElement('span', { className: CLS.OVERLAY });
        contentWrap.appendChild(overlay);
        let paneSettings: PanePropertiesModel[];
        if (!this.enableRtl) {
            layoutWrap.appendChild(navigationWrap);
            layoutWrap.appendChild(contentWrap);
            paneSettings = [
                {
                    size: '25%', min: this.navigationPaneSettings.minWidth.toString(),
                    max: this.navigationPaneSettings.maxWidth.toString()
                },
                { size: '75%', min: '270px' }
            ];
        } else {
            layoutWrap.appendChild(contentWrap);
            layoutWrap.appendChild(navigationWrap);
            paneSettings = [
                { size: '75%', min: '270px' },
                {
                    size: '25%', min: this.navigationPaneSettings.minWidth.toString(),
                    max: this.navigationPaneSettings.maxWidth.toString()
                }
            ];
        }
        this.splitterObj = new Splitter({
            paneSettings: paneSettings,
            width: '100%',
            enableRtl: false,
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            resizing: this.splitterResize.bind(this)
        });
        this.splitterObj.isStringTemplate = true;
        this.splitterObj.appendTo(layoutWrap);
        const dialogWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.DIALOG_ID });
        this.element.appendChild(dialogWrap);
        const menuWrap: HTMLElement = this.createElement('ul', { id: this.element.id + CLS.CONTEXT_MENU_ID });
        this.element.appendChild(menuWrap);
        const dialogImgWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.IMG_DIALOG_ID });
        this.element.appendChild(dialogImgWrap);
        const extnDialogWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.EXTN_DIALOG_ID });
        this.element.appendChild(extnDialogWrap);
        const uploadDialogWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.UPLOAD_DIALOG_ID });
        this.element.appendChild(uploadDialogWrap);
    }

    private adjustHeight(): void {
        const toolbar: HTMLElement = <HTMLElement>select('#' + this.element.id + CLS.TOOLBAR_ID, this.element);
        const toolBarHeight: number = toolbar ? toolbar.offsetHeight : 0;
        if (this.splitterObj) {
            this.splitterObj.height = (this.element.clientHeight - toolBarHeight).toString();
            this.splitterObj.dataBind();
        }
    }
    /* istanbul ignore next */
    private splitterResize(): void {
        this.notify(events.splitterResize, {});
    }

    private splitterAdjust(): void {
        const bar: Element = select('.' + CLS.SPLIT_BAR, this.element);
        if (this.navigationPaneSettings.visible) {
            this.splitterObj.expand(this.enableRtl ? 1 : 0);
            bar.classList.remove(CLS.DISPLAY_NONE);
        } else {
            this.splitterObj.collapse(this.enableRtl ? 1 : 0);
            bar.classList.add(CLS.DISPLAY_NONE);
        }
    }

    private addCssClass(oldOne: string, newOne: string): void {
        if (!isNOU(oldOne) && oldOne !== '') {
            removeClass([this.element], oldOne.split(' '));
        }
        if (!isNOU(newOne) && newOne !== '') {
            addClass([this.element], newOne.split(' '));
        }
    }

    private showSpinner(): void {
        showSpinner(this.element);
    }

    private hideSpinner(): void {
        hideSpinner(this.element);
    }

    private onContextMenu(e: MouseEvent): void {
        e.preventDefault();
    }

    private checkMobile(): boolean {
        return (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(Browser.userAgent.toLowerCase())
            && /mobile/i.test(Browser.userAgent.toLowerCase()));
    }

    private renderFileUpload(): void {
        const id: string = this.element.id + CLS.UPLOAD_ID;
        const uploadEle: HTMLElement = this.createElement('input', { id: id, attrs: { name: 'uploadFiles', type: 'file' } });
        this.element.appendChild(uploadEle);
        this.uploadDialogObj = new Dialog({
            header: getLocaleText(this, 'Header-Upload'),
            content: uploadEle,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: false,
            isModal: true,
            width: '350px',
            target: this.popupTarget ? this.popupTarget : '#' + this.element.id,
            cssClass: getCssClass(this, this.isMobile ? CLS.MOB_POPUP : CLS.ROOT_POPUP),
            locale: this.locale,
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            enableRtl: this.enableRtl,
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            open: this.onOpen.bind(this),
            close: this.onClose.bind(this),
            beforeOpen: this.onBeforeOpen.bind(this),
            beforeClose: this.onBeforeClose.bind(this)
        });
        this.uploadDialogObj.appendTo('#' + this.element.id + CLS.UPLOAD_DIALOG_ID);
        this.renderUploadBox();
    }

    private renderUploadBox(): void {
        const uploadUrl: string = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
        this.uploadObj = new Uploader({
            dropArea: <HTMLElement>select('#' + this.element.id + CLS.CONTENT_ID, this.element),
            asyncSettings: {
                saveUrl: uploadUrl,
                removeUrl: uploadUrl,
                chunkSize: this.uploadSettings.chunkSize,
                retryCount: 0
            },
            locale: this.locale,
            enableRtl: this.enableRtl,
            uploading: this.onUploading.bind(this),
            chunkUploading: this.onChunkUploading.bind(this),
            removing: this.onRemoving.bind(this),
            canceling: this.onCancel.bind(this),
            clearing: this.onClearing.bind(this),
            selected: this.onSelected.bind(this),
            success: this.onUploadSuccess.bind(this),
            failure: this.onUploadFailure.bind(this),
            autoUpload: this.uploadSettings.autoUpload,
            minFileSize: this.uploadSettings.minFileSize,
            maxFileSize: this.uploadSettings.maxFileSize,
            allowedExtensions: this.uploadSettings.allowedExtensions,
            directoryUpload: this.uploadSettings.directoryUpload,
            fileListRendering: this.onFileListRender.bind(this)
        });
        this.uploadObj.appendTo('#' + this.element.id + CLS.UPLOAD_ID);
    }

    private onFileListRender(args: UploadListCreateArgs): void {
        this.trigger('uploadListCreate', args);
    }

    private updateUploader(): void {
        this.uploadObj.autoUpload = this.uploadSettings.autoUpload;
        this.uploadObj.minFileSize = this.uploadSettings.minFileSize;
        this.uploadObj.maxFileSize = this.uploadSettings.maxFileSize;
        this.uploadObj.allowedExtensions = this.uploadSettings.allowedExtensions;
        this.uploadObj.directoryUpload = this.uploadSettings.directoryUpload;
        this.uploadObj.dataBind();
    }

    private onBeforeOpen(args: BeforeOpenEventArgs): void {
        const eventArgs: BeforePopupOpenCloseEventArgs = {
            cancel: args.cancel, popupName: 'Upload', popupModule: this.uploadDialogObj
        };
        this.trigger('beforePopupOpen', eventArgs, (eventargs: BeforePopupOpenCloseEventArgs) => {
            args.cancel = eventargs.cancel;
        });
    }

    private onBeforeClose(args: BeforeCloseEventArgs): void {
        const eventArgs: BeforePopupOpenCloseEventArgs = {
            cancel: args.cancel, popupName: 'Upload', popupModule: this.uploadDialogObj
        };
        this.trigger('beforePopupClose', eventArgs, (eventargs: BeforePopupOpenCloseEventArgs) => {
            args.cancel = eventargs.cancel;
        });
    }

    private onOpen(): void {
        this.isOpened = true;
        this.uploadDialogObj.element.focus();
        const args: PopupOpenCloseEventArgs = {
            popupModule: this.uploadDialogObj, popupName: 'Upload',
            element: this.uploadDialogObj.element
        };
        this.trigger('popupOpen', args);
    }

    private onClose(): void {
        this.isOpened = false;
        this.uploadObj.clearAll();
        const args: PopupOpenCloseEventArgs = {
            popupModule: this.uploadDialogObj, popupName: 'Upload',
            element: this.uploadDialogObj.element
        };
        this.trigger('popupClose', args);
    }
    /* istanbul ignore next */
    private onChunkUploading(args: UploadingEventArgs): void {
        let action: string = 'save';
        if ((this.retryArgs.length !== 0)) {
            for (let i: number = 0; i < this.retryArgs.length; i++) {
                if (args.fileData.name === this.retryArgs[i as number].file.name) {
                    action = this.retryArgs[i as number].action;
                }
            }
        }
        const data: string = JSON.stringify(getValue(this.pathId[this.pathId.length - 1], this.feParent));
        args.customFormData = [{ 'path': this.path }, { 'size': args.fileData.size }, { 'action': action }, { 'data': data }, {'filename': args.fileData.name}];
    }
    /* istanbul ignore next */
    private onUploading(args: UploadingEventArgs): void {
        let action: string = 'save';
        if ((this.retryArgs.length !== 0)) {
            for (let i: number = 0; i < this.retryArgs.length; i++) {
                if (args.fileData.name === this.retryArgs[i as number].file.name) {
                    action = this.retryArgs[i as number].action;
                    if (this.uploadSettings.chunkSize === 0) {
                        this.retryArgs.splice(i, 1);
                        i = this.retryArgs.length;
                    }

                }
            }
        }
        const data: string = JSON.stringify(getValue(this.pathId[this.pathId.length - 1], this.feParent));
        args.customFormData = [{ 'path': this.path }, { 'size': args.fileData.size }, { 'action': action }, { 'data': data }, {'filename': args.fileData.name}];
        const uploadUrl: string = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
        const ajaxSettings: Object = {
            url: uploadUrl,
            type: 'POST',
            mode: true,
            dataType: null,
            contentType: null,
            data: JSON.stringify(args.customFormData),
            onSuccess: null,
            onFailure: null,
            beforeSend: null
        };
        this.uploadEventArgs = { action: 'Upload', ajaxSettings: ajaxSettings, cancel: false };
        this.trigger('beforeSend', this.uploadEventArgs, (uploadEventArgs: BeforeSendEventArgs) => {
            args.customFormData = JSON.parse(getValue('data', uploadEventArgs.ajaxSettings));
            args.cancel = uploadEventArgs.cancel;
            const eventArgs: Object = {
                cancel: false,
                httpRequest: args.currentRequest
            };
            if (typeof getValue('beforeSend', uploadEventArgs.ajaxSettings) === 'function') {
                getValue('beforeSend', uploadEventArgs.ajaxSettings)(eventArgs);
                if (getValue('cancel', eventArgs)) {
                    args.cancel = getValue('cancel', eventArgs);
                }
            }
        });
    }

    private onRemoving(): void {
        this.onFileUploadSuccess({ count: 1 });
        if (this.uploadObj.getFilesData().length === 1) {
            this.uploadDialogObj.hide();
        }
    }

    /* istanbul ignore next */
    private onCancel(args: CancelEventArgs): void {
        const data: string = JSON.stringify(getValue(this.pathId[this.pathId.length - 1], this.feParent));
        args.customFormData = [{ 'path': this.path }, { 'action': 'remove' }, { 'data': data }];
    }

    /* istanbul ignore next */
    private onClearing(): void {
        if (this.isOpened) {
            this.uploadDialogObj.hide();
        }
    }
    /* istanbul ignore next */
    private onSelected(args: SelectedEventArgs): void {
        if (args.filesData.length === 0) { return; }
        this.uploadingCount = args.filesData.length;
        this.uploadedCount = 0;
        const details: Object = getPathObject(this);
        if (!hasUploadAccess(details)) {
            args.cancel = true;
            createDeniedDialog(this, details, events.permissionUpload);
            return;
        }
        this.uploadDialogObj.show();
    }

    private onFileUploadSuccess(args: { [key: string]: Object; }): void {
        this.uploadedCount = this.uploadedCount + (<number>args.count) ;
        if (this.uploadSettings.autoClose && (this.uploadingCount === this.uploadedCount)) {
            this.uploadDialogObj.hide();
        }
    }

    private onChunkUploadComplete(files: Object): void {
        if ((this.retryArgs.length !== 0)) {
            for (let i: number = 0; i < this.retryArgs.length; i++) {
                const uploadFile: string = !isNullOrUndefined(files) ? getValue('file', files).name : '';
                if (uploadFile === this.retryArgs[i as number].file.name) {
                    this.retryArgs.splice(i, 1);
                    i = this.retryArgs.length;
                }
            }
        }
    }

    /* istanbul ignore next */
    private onUploadSuccess(files: Object): void {
        if (this.uploadSettings.chunkSize > 0) {
            this.onChunkUploadComplete(files);
        }
        const args: SuccessEventArgs = { action: 'Upload', result: files };
        this.trigger('success', args);
        this.itemData = [getValue(this.pathId[this.pathId.length - 1], this.feParent)];
        read(this, events.pathChanged, this.path);
        this.onFileUploadSuccess({ count: 1 });
        if (typeof getValue('onSuccess', this.uploadEventArgs.ajaxSettings) === 'function') {
            getValue('onSuccess', this.uploadEventArgs.ajaxSettings)();
        }
    }
    /* istanbul ignore next */
    private onUploadFailure(files: Object): void {
        if (this.uploadSettings.chunkSize > 0) {
            this.onChunkUploadComplete(files);
        }
        const response: object = getValue('response', files);
        const statusText: string = getValue('statusText', response);
        if (statusText !== '') { setValue('statusText', statusText, files); }
        const args: FailureEventArgs = { action: 'Upload', error: files };
        this.trigger('failure', args);
        if (getValue('statusCode', response) === 400) {
            this.retryFiles.push(getValue('file', files));
            if (!this.isRetryOpened) { createExtDialog(this, 'UploadRetry'); }
        }
        if (typeof getValue('onFailure', this.uploadEventArgs.ajaxSettings) === 'function') {
            getValue('onFailure', this.uploadEventArgs.ajaxSettings)();
        }
    }

    private onInitialEnd(): void {
        setNextPath(this, this.path);
    }

    private addEventListeners(): void {
        this.on(events.beforeRequest, this.showSpinner, this);
        this.on(events.afterRequest, this.hideSpinner, this);
        this.on(events.initialEnd, this.onInitialEnd, this);
        this.on(events.detailsInit, this.onDetailsInit, this);
        this.on(events.skipUpload, this.onFileUploadSuccess, this);
        EventHandler.add(this.element, 'contextmenu', this.onContextMenu, this);
    }
    private removeEventListeners(): void {
        if (this.isDestroyed) { return; }
        this.off(events.beforeRequest, this.showSpinner);
        this.off(events.afterRequest, this.hideSpinner);
        this.off(events.initialEnd, this.onInitialEnd);
        this.off(events.detailsInit, this.onDetailsInit);
        this.off(events.skipUpload, this.onFileUploadSuccess);
        EventHandler.remove(this.element, 'contextmenu', this.onContextMenu);
    }

    private onDetailsInit(): void {
        if (isNOU(this.activeModule)) {
            this.itemData = [getValue(this.pathId[this.pathId.length - 1], this.feParent)];
        }
    }

    private resizeHandler(): void {
        this.adjustHeight();
        this.notify(events.resizeEnd, {});
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        let uploadEle: HTMLElement;
        switch (e.action) {
        case 'altN':
            e.preventDefault();
            this.itemData = [getPathObject(this)];
            if (!hasContentAccess(this.itemData[0])) {
                createDeniedDialog(this, this.itemData[0], events.permissionEditContents);
            } else {
                createDialog(this, 'NewFolder');
            }
            break;
        case 'f5':
            e.preventDefault();
            refresh(this);
            break;
        /* istanbul ignore next */
        case 'ctrlShift1':
            e.preventDefault();
            this.fileView = 'Details';
            this.setProperties({ view: 'Details' }, true);
            showSpinner(this.element);
            updateLayout(this, 'Details');
            break;
            /* istanbul ignore next */
        case 'ctrlShift2':
            e.preventDefault();
            this.fileView = 'LargeIcons';
            this.setProperties({ view: 'LargeIcons' }, true);
            showSpinner(this.element);
            updateLayout(this, 'LargeIcons');
            break;
        case 'ctrlU':
            e.preventDefault();
            if (this.toolbarSettings.items.indexOf('Upload') !== -1){
                uploadEle = <HTMLElement>select('#' + this.element.id + CLS.UPLOAD_ID, this.element);
                uploadEle.click();
            }
            break;

        }
    }

    private wireSelectOnDragEvent(isBind: boolean): void {
        if (isNOU(this.view)) {
            return;
        }
        if (isBind) {
            this.viewElem = this.view === 'LargeIcons' ? this.largeiconsviewModule.element : this.element.querySelector('.e-gridcontent');
        }
        if (!this.viewElem) {
            return;
        }
        if (isBind) {
            if (this.allowMultiSelection) {
                EventHandler.add(this.viewElem, 'mousedown', this.onDragStart, this);
                this.on(events.layoutChange, this.onLayoutChange, this);
                this.on(events.selectionChanged, this.onLayoutChange, this);
            }
        }
        else {
            EventHandler.remove(this.viewElem, 'mousedown', this.onDragStart);
            this.off(events.layoutChange, this.onLayoutChange);
            this.off(events.selectionChanged, this.onLayoutChange);
        }
    }

    private wireEvents(): void {
        if (this.enableRangeSelection) {
            this.wireSelectOnDragEvent(true);
        }
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler, this);
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            }
        );
    }

    private unWireEvents(): void {
        this.wireSelectOnDragEvent(false);
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler);
        this.keyboardModule.destroy();
    }

    private onDragStart(event: MouseEvent): void {
        if (this.viewElem) {
            if (this.allowDragAndDrop) {
                const targetElement: Element = closest(event.target as Element, this.viewElem.classList.contains('e-large-icons') ? '.e-list-item' : '.e-fe-text');
                if (targetElement) {
                    return;
                }
            }
            event.preventDefault();
            this.dragX = event.pageX;
            this.dragY = event.pageY;
            if (!this.dragSelectElement) {
                this.dragSelectElement = createElement('div', {
                    id: this.element.id + '_drag',
                    className: 'e-filemanager e-drag-select',
                    styles: 'left: ' + this.dragX + 'px;top: ' + this.dragY + 'px;'
                });
                document.body.append(this.dragSelectElement);
            }
            EventHandler.add(document, 'mouseup', this.onDragStop, this);
            EventHandler.add(this.viewElem, 'mousemove', this.onDrag, this);
            EventHandler.add(this.dragSelectElement, 'mousemove', this.onDrag, this);
        }
    }

    private onDrag(event: MouseEvent): void {
        event.stopPropagation();
        if (this.dragSelectElement) {
            const diffX: number = event.pageX - this.dragX;
            const diffY: number = event.pageY - this.dragY;
            setStyleAttribute(this.dragSelectElement, {
                'left': diffX < 0 ? this.dragX + diffX + 'px' : this.dragX + 'px', 'top': diffY < 0 ? this.dragY + diffY + 'px' : this.dragY + 'px',
                'height': Math.abs(diffY) + 'px', 'width': Math.abs(diffX) + 'px'
            });
            this.selectItems();
        }
        else {
            EventHandler.remove(this.viewElem, 'mousemove', this.onDrag);
        }
    }

    private onDragStop(): void {
        if (this.viewElem) {
            EventHandler.remove(document, 'mouseup', this.onDragStop);
            EventHandler.remove(this.viewElem, 'mousemove', this.onDrag);
        }
        if (this.dragSelectElement) {
            EventHandler.remove(this.dragSelectElement, 'mousemove', this.onDrag);
            if (this.dragSelectElement.clientHeight > 0 && this.dragSelectElement.clientWidth > 0) {
                this.setProperties({ selectedItems: this.dragSelectedItems });
            }
            this.dragSelectedItems = [];
            detach(this.dragSelectElement);
            this.dragSelectElement = null;
        }
    }

    private selectItems(): void {
        this.dragSelectedItems = [];
        const dragRect: DOMRect = this.dragSelectElement.getBoundingClientRect() as DOMRect;
        const allItems: HTMLElement[] = selectAll(this.viewElem.classList.contains('e-large-icons') ? '.e-list-item' : '.e-row', this.viewElem);
        removeClass(selectAll('.e-active', this.viewElem), ['e-active', 'e-focus']);
        removeClass(selectAll('.e-check', this.viewElem), ['e-check']);
        for (const item of allItems) {
            const itemRect: DOMRect = item.getBoundingClientRect() as DOMRect;
            if (!(dragRect.right < itemRect.left || dragRect.left > itemRect.right
                || dragRect.bottom < itemRect.top || dragRect.top > itemRect.bottom)
                && (this.dragSelectElement.clientHeight > 0 && this.dragSelectElement.clientWidth > 0)) {
                if (this.viewElem.classList.contains('e-large-icons')) {
                    item.classList.add('e-active');
                    this.dragSelectedItems.push(item.getAttribute('title'));
                }
                else {
                    addClass(selectAll('.e-rowcell', item), ['e-active']);
                    this.dragSelectedItems.push(item.querySelector('.e-drag-text').textContent);
                }
                item.querySelector('.e-frame').classList.add('e-check');
            }
        }
    }

    private onLayoutChange(): void {
        if (this.enableRangeSelection) {
            this.unWireEvents();
            this.wireEvents();
        }
    }

    private setPath(): void {
        this.setProperties({ selectedItems: [] }, true);
        this.ensurePath();
        this.notify(events.clearPathInit, { selectedNode: this.pathId[0] });
        read(this, (this.path !== this.originalPath) ? events.initialEnd : events.finalizeEnd, this.path);
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {FileManager} newProp
     * @param  {FileManager} oldProp
     * @returns void
     * @private
     */
    /* istanbul ignore next */
    public onPropertyChanged(newProp: FileManagerModel, oldProp: FileManagerModel): void {
        let height: string | number;
        let requiresRefresh: boolean = false;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'ajaxSettings':
                this.ajaxSettingSetModel(newProp);
                break;
            case 'allowDragAndDrop':
                this.allowDragAndDrop = newProp.allowDragAndDrop;
                this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                break;
            case 'showItemCheckBoxes':
                this.showItemCheckBoxes = newProp.showItemCheckBoxes;
                this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                break;
            case 'enableVirtualization':
                this.enableVirtualization = newProp.enableVirtualization;
                requiresRefresh = true;
                break;
            case 'allowMultiSelection':
                if (this.allowMultiSelection) {
                    addClass([this.element], CLS.CHECK_SELECT);
                } else {
                    if (this.selectedItems.length > 1) {
                        this.setProperties({ selectedItems: this.selectedItems.slice(this.selectedItems.length - 1) }, true);
                    }
                    removeClass([this.element], CLS.CHECK_SELECT);
                }
                this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                break;
            case 'cssClass':
                this.addCssClass(oldProp.cssClass, newProp.cssClass);
                this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                break;
            case 'detailsViewSettings':
                this.notify(events.modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                break;
            case 'enableRangeSelection':
                this.wireSelectOnDragEvent(false);
                if (newProp.enableRangeSelection) {
                    this.wireSelectOnDragEvent(true);
                }
                break;
            case 'enableRtl':
                this.enableRtl = newProp.enableRtl;
                requiresRefresh = true;
                break;
            case 'rootAliasName':
                this.rootAliasName = newProp.rootAliasName;
                requiresRefresh = true;
                break;
            case 'height':
                height = !isNOU(newProp.height) ? formatUnit(newProp.height) : newProp.height;
                setAttr(this.element, { 'height': height });
                this.adjustHeight();
                this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                break;
            case 'locale':
                if (!isNOU(newProp.enableRtl)) {
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                }
                this.localeSetModelOption(newProp);
                break;
            case 'navigationPaneSettings':
                this.splitterAdjust();
                this.notify(events.modelChanged, { module: 'navigationpane', newProp: newProp, oldProp: oldProp });
                break;
            case 'path':
                this.setPath();
                break;
            case 'searchSettings':
                if (!isNullOrUndefined(newProp.searchSettings.allowSearchOnTyping)) {
                    this.setProperties({ searchSettings: { allowSearchOnTyping: newProp.searchSettings.allowSearchOnTyping } }, true);
                }
                if (isNullOrUndefined(newProp.searchSettings.ignoreCase)) {
                    this.setProperties({ searchSettings: { ignoreCase: newProp.searchSettings.ignoreCase } }, true);
                }
                if (isNullOrUndefined(newProp.searchSettings.filterType)) {
                    this.setProperties({ searchSettings: { filterType: newProp.searchSettings.filterType } }, true);
                }
                this.notify(events.modelChanged, { module: 'breadcrumbbar', newProp: newProp, oldProp: oldProp });
                break;
            case 'selectedItems':
                if (this.view === 'Details') {
                    this.notify(events.modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                } else if (this.view === 'LargeIcons') {
                    this.notify(events.modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                }
                break;
            case 'showFileExtension':
                this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                break;
            case 'showHiddenItems':
                this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                break;
            case 'showThumbnail':
                this.notify(events.modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                break;
            case 'toolbarSettings':
            case 'toolbarItems':
                this.adjustHeight();
                this.notify(events.modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                break;
            case 'uploadSettings':
                this.updateUploader();
                break;
            case 'view':
                if (newProp.view === 'Details') {
                    this.notify(events.modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                } else if (newProp.view === 'LargeIcons') {
                    this.notify(events.modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                }
                break;
            case 'width':
                setAttr(this.element, { 'width': !isNOU(newProp.width) ? formatUnit(newProp.width) : newProp.width });
                this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                break;
            case 'sortOrder':
                refresh(this);
                this.notify(events.sortByChange, {});
                break;
            case 'sortBy':
                if (this.view === 'Details') {
                    const columns: ColumnModel[] = this.detailsViewSettings.columns;
                    const isValidSortField: boolean = !isNullOrUndefined(columns) &&
                        columns.findIndex((col: ColumnModel) => col.field === this.sortBy) !== -1;
                    if (!isValidSortField) {
                        return;
                    }
                    refresh(this);
                    this.notify(events.sortByChange, {});
                    this.notify(events.sortColumn, {});
                }
                else {
                    refresh(this);
                    this.notify(events.sortByChange, {});
                }
                break;
            case 'popupTarget':
                if (this.uploadDialogObj) {
                    this.uploadDialogObj.target = newProp.popupTarget;
                }
                if (this.dialogObj) {
                    this.dialogObj.target = newProp.popupTarget;
                }
                if (this.extDialogObj) {
                    this.extDialogObj.target = newProp.popupTarget;
                }
                if (this.viewerObj) {
                    this.viewerObj.target = newProp.popupTarget;
                }
                break;
            case 'fileSystemData':
                this.fileSystemData = newProp.fileSystemData;
                requiresRefresh = true;
                break;
            }
        }
        if (requiresRefresh) {
            this.refresh();
        }
    }
    /* istanbul ignore next */
    private ajaxSettingSetModel(newProp: FileManagerModel): void {
        if (!isNullOrUndefined(newProp.ajaxSettings.url)) {
            this.setProperties({ ajaxSettings: { url: newProp.ajaxSettings.url } }, true);
        }
        if (!isNullOrUndefined(newProp.ajaxSettings.uploadUrl)) {
            this.setProperties({ ajaxSettings: { uploadUrl: newProp.ajaxSettings.uploadUrl } }, true);
        }
        if (!isNullOrUndefined(newProp.ajaxSettings.downloadUrl)) {
            this.setProperties({ ajaxSettings: { downloadUrl: newProp.ajaxSettings.downloadUrl } }, true);
        }
        if (!isNullOrUndefined(newProp.ajaxSettings.getImageUrl)) {
            this.setProperties({ ajaxSettings: { getImageUrl: newProp.ajaxSettings.getImageUrl } }, true);
        }
        this.setProperties({ path: '/' }, true);
        this.setProperties({ selectedItems: [] }, true);
        super.refresh();
    }

    /* istanbul ignore next */
    private localeSetModelOption(newProp: FileManagerModel): void {
        this.uploadObj.locale = newProp.locale;
        super.refresh();
    }

    /**
     * Triggers when the component is destroyed.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        if (!this.refreshing) {
            this.notify(events.destroy, {});
        }
        this.uploadObj.destroy();
        this.uploadObj = null;
        this.uploadDialogObj.destroy();
        this.uploadDialogObj = null;
        this.splitterObj.destroy();
        this.splitterObj = null;
        if (this.dialogObj) {
            this.dialogObj.destroy();
            this.dialogObj = null;
        }
        if (this.viewerObj) {
            this.viewerObj.destroy();
            this.viewerObj = null;
        }
        if (this.extDialogObj) {
            this.extDialogObj.destroy();
            this.extDialogObj = null;
        }
        this.element.removeAttribute('style');
        this.element.removeAttribute('tabindex');
        this.removeEventListeners();
        this.unWireEvents();
        this.addCssClass(this.cssClass, null);
        removeClass([this.element], [CLS.RTL, CLS.MOBILE, CLS.CHECK_SELECT]);
        this.element.innerHTML = '';
        this.breadCrumbBarNavigation = null;
        this.activeElements = null;
        this.virtualDragElement = null;
        this.visitedItem = null;
        super.destroy();
        this.virtualizationModule = null;
        this.navigationpaneModule = null;
        this.toolbarModule = null;
        this.contextmenuModule = null;
        this.largeiconsviewModule = null;
        this.detailsviewModule = null;
        this.breadcrumbbarModule = null;
        this.viewElem = null;
        this.dragSelectElement = null;
        this.dragSelectedItems = null;
    }

    /**
     * Creates a new folder in file manager.
     *
     * @param {string} name – Specifies the name of new folder in current path.
     * If it is not specified, then the default new folder dialog will be opened.
     * @returns {void}
     */
    public createFolder(name?: string): void {
        this.notify(events.methodCall, { action: 'createFolder' });
        const details: Object[] = [getPathObject(this)];
        this.itemData = details;
        if (name) {
            if (/[/\\|*?"<>:]/.test(name)) {
                const result: ReadArgs = {
                    files: null,
                    error: {
                        code: '402',
                        message: getLocaleText(this, 'Validation-Invalid').replace('{0}', '"' + name + '"'),
                        fileExists: null
                    }
                };
                createDialog(this, 'Error', result);
            } else {
                if (!hasContentAccess(details[0])) {
                    createDeniedDialog(this, details[0], events.permissionEditContents);
                } else {
                    createFolder(this, name);
                }
            }
        } else {
            createNewFolder(this);
        }
    }

    /**
     * Deletes the folders or files from the given unique identifiers.
     *
     * @param {string} ids - Specifies the name of folders or files in current path. If you want to delete the nested level folders or
     * files, then specify the filter path along with name of the folders or files when performing the search or custom filtering.
     * For ID based file provider, specify the unique identifier of folders or files.
     * If it is not specified, then delete confirmation dialog will be opened for selected item.
     *
     * @returns {void}
     */
    public deleteFiles(ids?: string[]): void {
        this.notify(events.methodCall, { action: 'deleteFiles', ids: ids });
    }

    /**
     * Disables the specified toolbar items of the file manager.
     *
     * @param {string[]} items - Specifies an array of items to be disabled.
     * @returns {void}
     */
    public disableToolbarItems(items: string[]): void {
        if (!isNOU(items) && this.toolbarModule) {
            this.toolbarModule.enableItems(items, false);
        }
    }

    /**
     * Downloads the folders or files from the given unique identifiers.
     *
     * @param {string} ids - Specifies the name of folders or files in current path. If you want to download the nested level folders
     * or files, then specify the filter path along with name of the folders or files when performing search or custom filtering.
     * For ID based file provider, specify the unique identifier of folders or files.
     * If it is not specified, then the selected items will be downloaded.
     *
     * @returns {void}
     */
    public downloadFiles(ids?: string[]): void {
        this.notify(events.methodCall, { action: 'downloadFiles', ids: ids });
    }

    /**
     * Enables the specified toolbar items of the file manager.
     *
     * @param {string[]} items - Specifies an array of items to be enabled.
     * @returns {void}
     */
    public enableToolbarItems(items: string[]): void {
        if (!isNOU(items) && this.toolbarModule) {
            this.toolbarModule.enableItems(items, true);
        }
    }
    /**
     * Disables the specified context menu items in file manager. This method is used only in the menuOpen event.
     *
     * @param {string[]} items - Specifies an array of items to be disabled.
     * @returns {void}
     */
    public disableMenuItems(items: string[]): void {
        if (!isNOU(items) && !isNOU(this.contextmenuModule.contextMenu)) {
            this.contextmenuModule.disableItem(items);
        }
    }

    /**
     * Returns the index position of given current context menu item in file manager.
     *
     * @param {string} item - Specifies an item to get the index position.
     * @returns {number} - returns menu item index.
     */
    public getMenuItemIndex(item: string): number {
        if (this.contextmenuModule) {
            return this.contextmenuModule.getItemIndex(item);
        } else {
            return -1;
        }
    }

    /**
     * Returns the index position of given toolbar item in file manager.
     *
     * @param {string} item - Specifies an item to get the index position.
     * @returns {number} - returns toolbar item index.
     */
    public getToolbarItemIndex(item: string): number {
        if (this.toolbarModule) {
            return this.toolbarModule.getItemIndex(item);
        } else {
            return -1;
        }
    }

    /**
     * Display the custom filtering files in file manager.
     *
     * @param {Object} filterData - Specifies the custom filter details along with custom file action name,
     * which needs to be sent to the server side. If you do not specify the details, then default action name will be `filter`.
     *
     * @returns {void}
     */
    public filterFiles(filterData?: Object): void {
        this.filterData = filterData ? filterData : null;
        this.setProperties({ selectedItems: [] }, true);
        this.notify(events.selectionChanged, {});
        this.isFiltered = true;
        if (this.breadcrumbbarModule.searchObj.element.value !== '') {
            this.breadcrumbbarModule.searchObj.element.value = '';
        }
        filter(this, events.filterEnd);
    }

    /**
     * Gets the details of the selected files in the file manager.
     *
     * @returns {Object[]} - returns selected files.
     */
    public getSelectedFiles(): Object[] {
        this.notify(events.updateSelectionData, {});
        return this.itemData;
    }

    /**
     * Opens the corresponding file or folder from the given unique identifier.
     *
     * @param {string} id - Specifies the name of folder or file in current path. If you want to open the nested level folder or
     * file, then specify the filter path along with name of the folder or file when performing search or custom filtering. For ID based
     * file provider, specify the unique identifier of folder or file.
     *
     * @returns {void}
     */
    public openFile(id: string): void {
        this.notify(events.methodCall, { action: 'openFile', id: id });
    }

    /**
     * Refreshes the folder files of the file manager.
     *
     * @returns {void}
     */
    public refreshFiles(): void {
        refresh(this);
    }

    /**
     * Refreshes the layout of the file manager.
     *
     * @returns {void}
     */
    public refreshLayout(): void {
        this.adjustHeight();
        this.notify(events.layoutRefresh, {});
    }

    /**
     * Selects the entire folders and files in current path.
     *
     * @returns {void}
     */
    public selectAll(): void {
        this.notify(events.methodCall, { action: 'selectAll' });
    }

    /**
     * Specifies the method that must be invoked to traverse the path backwards in the file manager.
     *
     * @returns {void}
     */
    public traverseBackward(): void {
        if (this.pathNames.length > 1 && this.breadcrumbbarModule.searchObj.element.value === '' && !this.isFiltered) {
            this.pathId.pop();
            this.pathNames.pop();
            let newPath: string = this.pathNames.slice(1).join('/');
            newPath = newPath === '' ? '/' : '/' + newPath + '/';
            this.setProperties({ path: newPath }, true);
            read(this, events.pathChanged, this.path);
            const treeNodeId: string = this.pathId[this.pathId.length - 1];
            this.notify(events.updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
        }
    }

    /**
     * Deselects the currently selected folders and files in current path.
     *
     * @returns {void}
     */
    public clearSelection(): void {
        this.notify(events.methodCall, { action: 'clearSelection' });
    }

    /**
     * Renames the file or folder with given new name in file manager.
     *
     * @param {string} id - Specifies the name of folder or file in current path. If you want to rename the nested level folder or
     * file, then specify the filter path along with name of the folder or file when performing search or custom filtering. For ID based
     * file provider, specify the unique identifier of folder or file.
     * If it is not specified, then rename dialog will be opened for selected item.
     *
     * @param {string} name – Specifies the new name of the file or folder in current path. If it is not specified, then rename dialog
     * will be opened for given identifier.
     *
     * @returns {void}
     */
    public renameFile(id?: string, name?: string): void {
        this.notify(events.methodCall, { action: 'renameFile', id: id, newName: name });
    }

    /**
     * Opens the upload dialog in file manager.
     *
     * @returns {void}
     */
    public uploadFiles(): void {
        const details: Object[] = [getPathObject(this)];
        this.itemData = details;
        uploadItem(this);
    }

    /**
     * Specifies the method which must be invoked to programmatically close the dialog popup in the file manager.
     *
     * @returns {void}
     */
    public closeDialog(): void {
        closePopup(this);
    }

    /**
     * Specifies the direction of FileManager
     *
     * @param {boolean} rtl - specifies rtl parameter.
     * @returns {void}
     */
    private setRtl(rtl: boolean): void {
        if (rtl) {
            this.addCssClass(null, CLS.RTL);
        } else {
            this.addCssClass(CLS.RTL, null);
        }
        if (this.uploadObj) {
            this.uploadDialogObj.enableRtl = rtl;
            this.uploadObj.enableRtl = rtl;
        }
    }
}
