import { Component, EmitType, ModuleDeclaration, isNullOrUndefined, L10n, closest } from '@syncfusion/ej2-base';
import { Property, INotifyPropertyChanged, NotifyPropertyChanges, Complex, select } from '@syncfusion/ej2-base';
import { createElement, addClass, removeClass, setStyleAttribute as setAttr } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, formatUnit, Browser, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Event, EventHandler, getValue, setValue } from '@syncfusion/ej2-base';
import { Splitter, PanePropertiesModel } from '@syncfusion/ej2-layouts';
import { Dialog, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { createDialog, createExtDialog } from '../pop-up/dialog';
import { ToolbarSettings, ToolbarSettingsModel, AjaxSettings, NavigationPaneSettings, DetailsViewSettings } from '../models/index';
import { NavigationPaneSettingsModel, DetailsViewSettingsModel } from '../models/index';
import { AjaxSettingsModel, SearchSettings, SearchSettingsModel } from '../models/index';
import { Toolbar } from '../actions/toolbar';
import { DetailsView } from '../layout/details-view';
import { LargeIconsView } from '../layout/large-icons-view';
import { Uploader, UploadingEventArgs, SelectedEventArgs, FileInfo } from '@syncfusion/ej2-inputs';
import { UploadSettingsModel } from '../models/upload-settings-model';
import { UploadSettings } from '../models/upload-settings';
import * as events from './constant';
import * as CLS from './classes';
import { read, filter } from '../common/operations';
import { FileManagerModel } from './file-manager-model';
import { ITreeView, IContextMenu, ViewType, SortOrder, FileDragEventArgs, RetryArgs } from './interface';
import { BeforeSendEventArgs, SuccessEventArgs, FailureEventArgs, FileLoadEventArgs } from './interface';
import { FileOpenEventArgs, FileSelectEventArgs, MenuClickEventArgs, MenuOpenEventArgs } from './interface';
import { ToolbarClickEventArgs, ToolbarCreateEventArgs, UploadListCreateArgs } from './interface';
import { refresh, getPathObject, getLocaleText, setNextPath, createDeniedDialog } from '../common/utility';
import { hasContentAccess, hasUploadAccess, updateLayout } from '../common/utility';
import { TreeView as BaseTreeView } from '@syncfusion/ej2-navigations';
import { ContextMenuSettingsModel } from '../models/contextMenu-settings-model';
import { ContextMenuSettings } from '../models/contextMenu-settings';
import { BreadCrumbBar } from '../actions/breadcrumb-bar';
import { ContextMenu } from '../pop-up/context-menu';
import { defaultLocale } from '../models/default-locale';
import { PositionModel } from '@syncfusion/ej2-base/src/draggable-model';

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
    public isDevice: Boolean;
    public isMobile: Boolean;
    public isBigger: Boolean;
    public isFile: boolean = false;
    public sortOrder: SortOrder = 'Ascending';
    public sortBy: string = 'name';
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
    public droppedObjects: Object[] = [];
    public destinationPath: string;

    /**
     * Specifies the AJAX settings of the file manager.
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
     * Enables or disables drag-and-drop of files.
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Enables or disables the multiple files selection of the file manager.
     * @default true
     */
    @Property(true)
    public allowMultiSelection: boolean;

    /**
     * Specifies the context menu settings of the file manager.
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
     * @default ''
     */
    @Property('')
    public cssClass: string;

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
    @Complex<DetailsViewSettingsModel>({}, DetailsViewSettings)
    public detailsViewSettings: DetailsViewSettingsModel;

    /**
     * Enables or disables persisting component's state between page reloads. If enabled, the following APIs will persist:
     * 1. `view`: Represents the previous view of the file manager.
     * 2. `path`: Represents the previous path of the file manager.
     * 3. `selectedItems`: Represents the previous selected items in the file manager.
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Specifies the height of the file manager.
     * @default '400px'
     */
    @Property('400px')
    public height: string | number;

    /**
     * Specifies the initial view of the file manager. 
     * With the help of this property, initial view can be changed to details or largeicons view. The available views are:
     * * `LargeIcons`
     * * `Details`
     * @default 'LargeIcons'
     */
    @Property('LargeIcons')
    public view: ViewType;

    /**
     * Specifies the navigationpane settings of the file manager.
     * @default {
     *  maxWidth: '650px',
     *  minWidth: '240px',
     *  visible: true,
     * }
     */
    @Complex<NavigationPaneSettingsModel>({}, NavigationPaneSettings)
    public navigationPaneSettings: NavigationPaneSettingsModel;

    /**
     * Specifies the current path of the file manager.
     * @default '/'
     */
    @Property('/')
    public path: string;

    /**
     * Specifies the search settings of the file manager.
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
     * @default []
     */
    @Property()
    public selectedItems: string[];

    /**
     * Shows or hides the file extension in file manager.
     * @default true
     */
    @Property(true)
    public showFileExtension: boolean;

    /**
     * Shows or hides the files and folders that are marked as hidden.
     * @default false
     */
    @Property(false)
    public showHiddenItems: boolean;

    /**
     * Shows or hides the thumbnail images in largeicons view.
     * @default true
     */
    @Property(true)
    public showThumbnail: boolean;

    /**
     * Specifies the group of items aligned horizontally in the toolbar.
     * @default {
     *  items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete',
     *  'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'],
     *  visible: true
     * }
     */
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Specifies the upload settings for the file manager.
     * @default {
     *  autoUpload: true,
     *  minFileSize: 0,
     *  maxFileSize: 30000000,
     *  allowedExtensions: ''
     * }
     */
    @Complex<UploadSettingsModel>({}, UploadSettings)
    public uploadSettings: UploadSettingsModel;

    /**
     * Specifies the width of the file manager.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Triggers before the file/folder is rendered.
     * @event
     * @blazorproperty 'OnFileLoad'
     */
    @Event()
    public fileLoad: EmitType<FileLoadEventArgs>;

    /**
     * Triggers before the file/folder is opened.
     * @event
     * @blazorproperty 'OnFileOpen'
     */
    @Event()
    public fileOpen: EmitType<FileOpenEventArgs>;

    /**
     * Triggers before sending the AJAX request to the server.
     * @event
     * @blazorproperty 'OnSend'
     */
    @Event()
    public beforeSend: EmitType<BeforeSendEventArgs>;

    /**
     * Triggers when the file manager component is created.
     * @event
     * @blazorproperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the file manager component is destroyed.
     * @event
     * @blazorproperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the file/folder dragging is started.
     * @event
     * @blazorproperty 'OnFileDragStart'
     */
    @Event()
    public fileDragStart: EmitType<FileDragEventArgs>;

    /**
     * Triggers while dragging the file/folder.
     * @event
     * @blazorproperty 'FileDragging'
     */
    @Event()
    public fileDragging: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is about to be dropped at the target.
     * @event
     * @blazorproperty 'OnFileDragStop'
     */
    @Event()
    public fileDragStop: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is dropped.
     * @event
     * @blazorproperty 'FileDropped'
     */
    @Event()
    public fileDropped: EmitType<FileDragEventArgs>;

    /**
     * Triggers when the file/folder is selected/unselected.
     * @event
     * @blazorproperty 'FileSelected'
     */
    @Event()
    public fileSelect: EmitType<FileSelectEventArgs>;

    /**
     * Triggers when the context menu item is clicked.
     * @event
     * @blazorproperty 'OnMenuClick'
     */
    @Event()
    public menuClick: EmitType<MenuClickEventArgs>;

    /**
     * Triggers before the context menu is opened.
     * @event
     * @blazorproperty 'MenuOpened'
     */
    @Event()
    public menuOpen: EmitType<MenuOpenEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     * @event
     * @blazorproperty 'OnError'
     */
    @Event()
    public failure: EmitType<FailureEventArgs>;

    /**
     * Triggers when the AJAX request is success.
     * @event
     * @blazorproperty 'OnSuccess'
     */
    @Event()
    public success: EmitType<SuccessEventArgs>;

    /**
     * Triggers when the toolbar item is clicked.
     * @event
     * @blazorproperty 'ToolbarItemClicked'
     */
    @Event()
    public toolbarClick: EmitType<ToolbarClickEventArgs>;

    /**
     * Triggers before creating the toolbar.
     * @event
     * @blazorproperty 'ToolbarCreated'
     */
    @Event()
    public toolbarCreate: EmitType<ToolbarCreateEventArgs>;

    /**
     * Triggers before rendering each file item in upload dialog box.
     * @event
     * @blazorproperty 'UploadListCreated'
     */
    @Event()
    public uploadListCreate: EmitType<UploadListCreateArgs>;

    constructor(options?: FileManagerModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        FileManager.Inject(BreadCrumbBar, LargeIconsView, ContextMenu);
    }

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'filemanager';
    }

    /**
     * Initialize the event handler
     */
    protected preRender(): void {
        this.ensurePath();
        this.feParent = [];
        this.feFiles = [];
        setAttr(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        this.isDevice = Browser.isDevice;
        this.isMobile = this.checkMobile();
        if (this.isMobile) {
            this.setProperties({ navigationPaneSettings: { visible: false } }, true);
        }
        let ele: Element = closest(this.element, '.e-bigger');
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
     * Gets the properties to be maintained upon browser refresh..
     * @returns string
     * @hidden
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['view', 'path', 'selectedItems'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
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
                args: [this]
            });
        }
        if (this.navigationPaneSettings.visible) {
            modules.push({
                member: 'navigationpane',
                args: [this]
            });
        }
        if (this.view) {
            modules.push({
                member: 'detailsview',
                args: [this]
            });
        }
        if (this.contextMenuSettings.visible && !this.isDevice) {
            modules.push({
                member: 'contextmenu',
                args: [this]
            });
        }
        return modules;
    }

    /**
     * To Initialize the control rendering
     * @private
     */
    protected render(): void {
        this.initialize();
        this.setProperties({ selectedItems: (isNOU(this.selectedItems)) ? [] : this.selectedItems }, true);
        this.fileView = this.view;
        this.setRtl(this.enableRtl);
        this.addEventListeners();
        read(this, (this.path !== this.originalPath) ? events.initialEnd : events.finalizeEnd, this.path);
        this.adjustHeight();
        if (isNOU(this.navigationpaneModule)) {
            this.splitterObj.collapse(this.enableRtl ? 1 : 0);
            let bar: Element = select('.' + CLS.SPLIT_BAR, this.element);
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
        let paths: string[] = currentPath.split('/');
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
        let headerWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.TOOLBAR_ID });
        this.element.appendChild(headerWrap);
        let layoutWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.LAYOUT_ID, className: CLS.LAYOUT
        });
        this.element.appendChild(layoutWrap);
        let navigationWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.NAVIGATION_ID, className: CLS.NAVIGATION
        });
        let treeWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.TREE_ID
        });
        navigationWrap.appendChild(treeWrap);
        let contentWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.CONTENT_ID, className: CLS.LAYOUT_CONTENT
        });
        this.breadCrumbBarNavigation = this.createElement('div', {
            id: this.element.id + CLS.BREADCRUMBBAR_ID,
            className: CLS.BREADCRUMBS
        });
        contentWrap.appendChild(this.breadCrumbBarNavigation);
        let gridWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.GRID_ID
        });
        contentWrap.appendChild(gridWrap);
        let largeiconWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.LARGEICON_ID,
            className: CLS.LARGE_ICONS
        });
        contentWrap.appendChild(largeiconWrap);
        let overlay: HTMLElement = this.createElement('span', { className: CLS.OVERLAY });
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
            resizing: this.splitterResize.bind(this)
        });
        this.splitterObj.isStringTemplate = true;
        this.splitterObj.appendTo(layoutWrap);
        let dialogWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.DIALOG_ID });
        this.element.appendChild(dialogWrap);
        let menuWrap: HTMLElement = this.createElement('ul', { id: this.element.id + CLS.CONTEXT_MENU_ID });
        this.element.appendChild(menuWrap);
        let dialogImgWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.IMG_DIALOG_ID });
        this.element.appendChild(dialogImgWrap);
        let extnDialogWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.EXTN_DIALOG_ID });
        this.element.appendChild(extnDialogWrap);
        let uploadDialogWrap: HTMLElement = this.createElement('div', { id: this.element.id + CLS.UPLOAD_DIALOG_ID });
        this.element.appendChild(uploadDialogWrap);
    }

    private adjustHeight(): void {
        let toolbar: HTMLElement = <HTMLElement>select('#' + this.element.id + CLS.TOOLBAR_ID, this.element);
        let toolBarHeight: number = this.toolbarModule ? toolbar.offsetHeight : 0;
        this.splitterObj.height = (this.element.clientHeight - toolBarHeight).toString();
        this.splitterObj.dataBind();
    }
    /* istanbul ignore next */
    private splitterResize(): void {
        this.notify(events.splitterResize, {});
    }

    private splitterAdjust(): void {
        let bar: Element = select('.' + CLS.SPLIT_BAR, this.element);
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
        let id: string = this.element.id + CLS.UPLOAD_ID;
        let uploadEle: HTMLElement = this.createElement('input', { id: id, attrs: { name: 'uploadFiles', type: 'file' } });
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
            target: '#' + this.element.id,
            locale: this.locale,
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            enableRtl: this.enableRtl,
            open: this.onOpen.bind(this),
            close: this.onClose.bind(this),
        });
        this.uploadDialogObj.appendTo('#' + this.element.id + CLS.UPLOAD_DIALOG_ID);
        this.renderUploadBox();
    }

    private renderUploadBox(): void {
        let uploadUrl: string = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
        this.uploadObj = new Uploader({
            dropArea: <HTMLElement>select('#' + this.element.id + CLS.CONTENT_ID, this.element),
            asyncSettings: {
                saveUrl: uploadUrl,
                removeUrl: uploadUrl
            },
            locale: this.locale,
            enableRtl: this.enableRtl,
            uploading: this.onUploading.bind(this),
            removing: this.onRemoving.bind(this),
            clearing: this.onClearing.bind(this),
            selected: this.onSelected.bind(this),
            success: this.onUploadSuccess.bind(this),
            failure: this.onUploadFailure.bind(this),
            autoUpload: this.uploadSettings.autoUpload,
            minFileSize: this.uploadSettings.minFileSize,
            maxFileSize: this.uploadSettings.maxFileSize,
            allowedExtensions: this.uploadSettings.allowedExtensions,
            fileListRendering: this.onFileListRender.bind(this),
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
        this.uploadObj.dataBind();
    }

    /* istanbul ignore next */
    private onOpen(): void {
        this.isOpened = true;
        this.uploadDialogObj.element.focus();
    }
    /* istanbul ignore next */
    private onClose(): void {
        this.isOpened = false;
        this.uploadObj.clearAll();
    }
    /* istanbul ignore next */
    private onUploading(args: UploadingEventArgs): void {
        let action: string = 'save';
        if ((this.retryArgs.length !== 0)) {
            for (let i: number = 0; i < this.retryArgs.length; i++) {
                if (args.fileData.name === this.retryArgs[i].file.name) {
                    action = this.retryArgs[i].action;
                    this.retryArgs.splice(i, 1);
                    i = this.retryArgs.length;
                }
            }
        }
        let data: string = JSON.stringify(getValue(this.pathId[this.pathId.length - 1], this.feParent));
        args.customFormData = [{ 'path': this.path }, { 'action': action }, { 'data': data }];
        let uploadUrl: string = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
        let ajaxSettings: Object = {
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
            let eventArgs: Object = {
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
        if (this.uploadObj.getFilesData().length === 1) {
            this.uploadDialogObj.hide();
        }
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
        let details: Object = getPathObject(this);
        if (!hasUploadAccess(details)) {
            args.cancel = true;
            createDeniedDialog(this, details);
            return;
        }
        this.uploadDialogObj.show();
    }
    /* istanbul ignore next */
    private onUploadSuccess(files: Object): void {
        let args: SuccessEventArgs = { action: 'Upload', result: files };
        this.trigger('success', args);
        this.itemData = [getValue(this.pathId[this.pathId.length - 1], this.feParent)];
        read(this, events.pathChanged, this.path);
        if (typeof getValue('onSuccess', this.uploadEventArgs.ajaxSettings) === 'function') {
            getValue('onSuccess', this.uploadEventArgs.ajaxSettings)();
        }
    }
    /* istanbul ignore next */
    private onUploadFailure(files: Object): void {
        let response: object = getValue('response', files);
        let statusText: string = getValue('statusText', response);
        if (statusText !== '') { setValue('statusText', statusText, files); }
        let args: FailureEventArgs = { action: 'Upload', error: files };
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
        EventHandler.add(this.element, 'contextmenu', this.onContextMenu, this);
    }
    private removeEventListeners(): void {
        if (this.isDestroyed) { return; }
        this.off(events.beforeRequest, this.showSpinner);
        this.off(events.afterRequest, this.hideSpinner);
        this.off(events.initialEnd, this.onInitialEnd);
        this.off(events.detailsInit, this.onDetailsInit);
        EventHandler.remove(this.element, 'contextmenu', this.onContextMenu);
    }

    private onDetailsInit(): void {
        if (isNOU(this.activeModule)) {
            this.itemData = [getValue(this.pathId[this.pathId.length - 1], this.feParent)];
        }
    }

    private resizeHandler(): void {
        this.notify(events.resizeEnd, {});
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'altN':
                e.preventDefault();
                this.itemData = [getPathObject(this)];
                if (!hasContentAccess(this.itemData[0])) {
                    createDeniedDialog(this, this.itemData[0]);
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
                let uploadEle: HTMLElement = <HTMLElement>select('#' + this.element.id + CLS.UPLOAD_ID, this.element);
                uploadEle.click();
                break;

        }
    }

    private wireEvents(): void {
        window.addEventListener('resize', this.resizeHandler.bind(this));
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    private unWireEvents(): void {
        this.keyboardModule.destroy();
    }

    private setPath(): void {
        this.setProperties({ selectedItems: [] }, true);
        this.ensurePath();
        this.notify(events.clearPathInit, { selectedNode: this.pathId[0] });
        read(this, (this.path !== this.originalPath) ? events.initialEnd : events.finalizeEnd, this.path);
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {FileManager} newProp
     * @param  {FileManager} oldProp
     * @returns void
     * @private
     */
    /* istanbul ignore next */
    public onPropertyChanged(newProp: FileManagerModel, oldProp: FileManagerModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'ajaxSettings':
                    this.ajaxSettingSetModel(newProp);
                    break;
                case 'allowDragAndDrop':
                    this.allowDragAndDrop = newProp.allowDragAndDrop;
                    this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'allowMultiSelection':
                    if (this.allowMultiSelection) {
                        addClass([this.element], CLS.CHECK_SELECT);
                    } else {
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
                case 'enableRtl':
                    this.enableRtl = newProp.enableRtl;
                    this.refresh();
                    break;
                case 'height':
                    let height: string | number = !isNOU(newProp.height) ? formatUnit(newProp.height) : newProp.height;
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
                    let width: string | number = !isNOU(newProp.width) ? formatUnit(newProp.width) : newProp.width;
                    setAttr(this.element, { 'width': width });
                    this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
            }
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
     * @returns void
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
        super.destroy();
    }

    /**
     * Disables the specified toolbar items of the file manager.
     * @param {items: string[]} items - Specifies an array of items to be disabled.
     * @returns void
     */
    public disableToolbarItems(items: string[]): void {
        if (!isNOU(items)) {
            this.toolbarModule.enableItems(items, false);
        }
    }

    /**
     * Enables the specified toolbar items of the file manager.
     * @param {items: string[]} items - Specifies an array of items to be enabled.
     * @returns void
     */
    public enableToolbarItems(items: string[]): void {
        if (!isNOU(items)) {
            this.toolbarModule.enableItems(items, true);
        }
    }

    /**
     * Display the custom filtering files in file manager.
     * @param {filterData: Object} filterData - Specifies the custom filter details along with custom file action name,
     * which needs to be sent to the server side. If you do not specify the details, then default action name will be `filter`.
     * @returns void
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
     * @returns void
     */
    public getSelectedFiles(): Object[] {
        this.notify(events.updateSelectionData, {});
        return this.itemData;
    }

    /**
     * Refreshes the folder files of the file manager.
     * @returns void
     */
    public refreshFiles(): void {
        refresh(this);
    }

    /**
     * Refreshes the layout of the file manager.
     * @returns void
     */
    public refreshLayout(): void {
        this.adjustHeight();
        this.notify(events.layoutRefresh, {});
    }

    /**
     * Specifies the direction of FileManager
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