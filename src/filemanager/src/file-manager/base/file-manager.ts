import { Component, EmitType, ModuleDeclaration, isNullOrUndefined, L10n, closest } from '@syncfusion/ej2-base';
import { Property, INotifyPropertyChanged, NotifyPropertyChanges, Complex, select } from '@syncfusion/ej2-base';
import { createElement, addClass, removeClass, setStyleAttribute as setAttr } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, formatUnit, Browser, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Event, EventHandler } from '@syncfusion/ej2-base';
import { Splitter } from '@syncfusion/ej2-layouts';
import { Dialog, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { createDialog } from '../pop-up/dialog';
import { ToolbarSettings, ToolbarSettingsModel, AjaxSettings, NavigationPaneSettings, DetailsViewSettings } from '../models/index';
import { NavigationPaneSettingsModel, DetailsViewSettingsModel } from '../models/index';
import { AjaxSettingsModel, SearchSettings, SearchSettingsModel } from '../models/index';
import { Toolbar } from '../actions/toolbar';
import { DetailsView } from '../layout/details-view';
import { LargeIconsView } from '../layout/large-icons-view';
import { Uploader, UploadingEventArgs, RemovingEventArgs } from '@syncfusion/ej2-inputs';
import { UploadSettingsModel } from '../models/upload-settings-model';
import { UploadSettings } from '../models/upload-settings';
import * as events from './constant';
import * as CLS from './classes';
import { read, paste, Delete, GetDetails } from '../common/operations';
import { FileManagerModel } from './file-manager-model';
import { IFileManager, ITreeView, IContextMenu, viewType, SortOrder } from './interface';
import { FileBeforeSendEventArgs, FileOnSuccessEventArgs, FileOnErrorEventArgs, FileBeforeLoadEventArgs } from './interface';
import { FileOpenEventArgs, FileSelectEventArgs, FileMenuClickEventArgs, FileMenuOpenEventArgs } from './interface';
import { FileToolbarClickEventArgs } from './interface';
import { activeElement, removeBlur, refresh, getPathObject, getLocaleText, setNextPath } from '../common/utility';
import { TreeView as BaseTreeView } from '@syncfusion/ej2-navigations';
import { ContextMenuSettingsModel } from '../models/contextMenu-settings-model';
import { ContextMenuSettings } from '../models/contextMenu-settings';
import { BreadCrumbBar } from '../actions/breadcrumb-bar';
import { ContextMenu } from '../pop-up/context-menu';
import { defaultLocale } from '../models/default-locale';

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
    public originalPath: string;
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
    public activeElements: NodeListOf<Element>;
    public activeModule: string;
    public treeObj: BaseTreeView;
    public dialogObj: Dialog;
    public viewerObj: Dialog;
    public extDialogObj: Dialog;
    public selectedNodes: string[] = [];
    public duplicateItems: string[] = [];
    public previousPath: string[] = [];
    public nextPath: string[] = [];
    public fileAction: string;
    public replaceItems: string[];
    public createdItem: { [key: string]: Object; };
    public renamedItem: { [key: string]: Object; };
    public uploadItem: string[] = [];
    public fileLength: number;
    public deleteRecords: string[] = [];
    public fileView: string;
    public isDevice: Boolean;
    public isMobile: Boolean;
    public isBigger: Boolean;
    public isFile: boolean = false;
    public nodeNames: Object[];
    public sortOrder: SortOrder = 'Ascending';
    public sortBy: string = 'name';
    public cutNodes: Object[];
    public pasteNodes: Object[];
    public currentItemText: string;
    public renameText: string;
    public parentPath: string;
    public enablePaste: boolean = false;
    public splitterObj: Splitter;
    public persistData: boolean = false;
    public singleSelection: string;
    public breadCrumbBarNavigation: HTMLElement;
    public localeObj: L10n;
    public uploadObj: Uploader;
    public uploadDialogObj: Dialog;
    private isOpened: boolean = false;
    public searchedItems: { [key: string]: Object; }[] = [];

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
     * Enables or disables the multiple files selection of the file manager.
     * @default true
     */
    @Property(true)
    public allowMultiSelection: boolean;

    /**
     * Specifies the context menu settings of the file manager.
     * @default {
     *  file: ['Open', '|', 'Delete', 'Rename', '|', 'Details'],
     *  folder: ['Open', '|', 'Delete', 'Rename', '|', 'Details'],
     *  layout: ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'],
     *  visible: true,
     * }
     */
    @Complex<ContextMenuSettingsModel>({}, ContextMenuSettings)
    public contextMenuSettings: ContextMenuSettingsModel;

    /**
     * Specifies the root CSS class of the file manager that allows to customize the appearance by overriding the styles.
     * @default ''
     */
    @Property('')
    public cssClass: string;

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
    @Complex<DetailsViewSettingsModel>({}, DetailsViewSettings)
    public detailsViewSettings: DetailsViewSettingsModel;

    /**
     * Enables or disables persisting component's state between page reloads. If enabled, following APIs will persist.
     * 1. `view` - Represents the previous view of the file manager.
     * 2. `path` - Represents the previous path of the file manager.
     * 3. `selectedItems` - Represents the previous selected items in the file manager.
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * When set to true, enables RTL mode of the component that displays the content in the right-to-left direction.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Specifies the height of the file manager.
     * @default '400px'
     */
    @Property('400px')
    public height: string | number;

    /**
     * Specifies the initial view of the file manager. 
     * With the help of this property, initial view can be changed to details or largeicons view.
     * @default 'LargeIcons'
     */
    @Property('LargeIcons')
    public view: viewType;

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
     * Specifies the selected folders and files name of the  file manager 
     * @default []
     */
    @Property()
    public selectedItems: string[];

    /**
     * Show or hide the file extension in file manager.
     * @default true
     */
    @Property(true)
    public showFileExtension: boolean;

    /**
     * Show or hide the files and folders that are marked as hidden.
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
     *  items: ['NewFolder', 'Upload', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'],
     *  visible: true
     * }
     */
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Specifies the upload settings for the file manager.
     * @default null
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
     */
    @Event()
    public beforeFileLoad: EmitType<FileBeforeLoadEventArgs>;

    /**
     * Triggers before the file/folder is opened.
     * @event
     */
    @Event()
    public beforeFileOpen: EmitType<FileOpenEventArgs>;

    /**
     * Triggers before the AJAX request send to the server.
     * @event
     */
    @Event()
    public beforeSend: EmitType<FileBeforeSendEventArgs>;

    /**
     * Triggers when the file manager component is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the file manager component is destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the file/folder is selected/unselected.
     * @event
     */
    @Event()
    public fileSelect: EmitType<FileSelectEventArgs>;

    /**
     * Triggers when the context menu item is clicked.
     * @event
     */
    @Event()
    public menuClick: EmitType<FileMenuClickEventArgs>;

    /**
     * Triggers before the context menu is opened.
     * @event
     */
    @Event()
    public menuOpen: EmitType<FileMenuOpenEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     * @event
     */
    @Event()
    public onError: EmitType<FileOnErrorEventArgs>;

    /**
     * Triggers when the AJAX request is success.
     * @event
     */
    @Event()
    public onSuccess: EmitType<FileOnSuccessEventArgs>;

    /**
     * Triggers when the toolbar item is clicked.
     * @event
     */
    @Event()
    public toolbarClick: EmitType<FileToolbarClickEventArgs>;

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
        createSpinner({ target: this.element }, createElement);
        this.addWrapper();
        this.keyConfigs = {
            altN: 'alt+n',
            f5: 'f5',
            ctrlShift1: 'ctrl+shift+1',
            ctrlShift2: 'ctrl+shift+2'
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
        this.selectedItems = (isNOU(this.selectedItems)) ? [] : this.selectedItems;
        this.fileView = this.view;
        this.setRtl(this.enableRtl);
        this.addEventListeners();
        read(this, (this.path !== this.originalPath) ? events.initialEnd : events.finalizeEnd, this.path);
        this.adjustHeight();
        if (isNOU(this.navigationpaneModule)) {
            this.splitterObj.collapse(0);
            let bar: Element = select('.' + CLS.SPLIT_BAR, this.element);
            bar.classList.add(CLS.DISPLAY_NONE);
        }
        this.wireEvents();
    }

    private ensurePath(): void {
        let currentPath: string = this.path;
        if (isNOU(currentPath)) {
            currentPath = '/';
        }
        if (currentPath.indexOf('/') !== 0) {
            currentPath = '/' + currentPath;
        }
        if (currentPath.lastIndexOf('/') !== (currentPath.length - 1)) {
            currentPath = currentPath + '/';
        }
        this.originalPath = currentPath;
        this.setProperties({ path: '/' }, true);
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
        let treeWrap: HTMLElement = this.createElement('div', {
            id: this.element.id + CLS.TREE_ID
        });
        layoutWrap.appendChild(treeWrap);
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
        layoutWrap.appendChild(contentWrap);
        this.splitterObj = new Splitter({
            paneSettings: [
                {
                    size: '25%', min: this.navigationPaneSettings.minWidth.toString(),
                    max: this.navigationPaneSettings.maxWidth.toString()
                },
                { size: '75%', min: '270px' }
            ],
            width: '100%',
            resizing: this.splitterResize.bind(this)
        });
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
            this.splitterObj.expand(0);
            bar.classList.remove(CLS.DISPLAY_NONE);
        } else {
            this.splitterObj.collapse(0);
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
        });
        this.uploadObj.appendTo('#' + this.element.id + CLS.UPLOAD_ID);
    }

    private updateUploader(): void {
        this.uploadObj.autoUpload = this.uploadSettings.autoUpload;
        this.uploadObj.minFileSize = this.uploadSettings.minFileSize;
        this.uploadObj.maxFileSize = this.uploadSettings.maxFileSize;
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
        args.customFormData = [{ 'path': this.path }, { 'action': 'Save' }];
    }
    /* istanbul ignore next */
    private onRemoving(args: RemovingEventArgs): void {
        args.customFormData = [{ 'path': this.path }, { 'action': 'Remove' }];
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
    private onSelected(): void {
        this.uploadDialogObj.show();
    }
    /* istanbul ignore next */
    private onUploadSuccess(files: Object): void {
        this.trigger('onSuccess', { action: 'Upload', result: files });
        read(this, events.pathChanged, this.path);
    }
    /* istanbul ignore next */
    private onUploadFailure(files: Object): void {
        this.trigger('onError', { action: 'Upload', error: files });
    }

    private onInitialEnd(): void {
        setNextPath(this, this.path);
    }

    private addEventListeners(): void {
        this.on(events.beforeRequest, this.showSpinner, this);
        this.on(events.afterRequest, this.hideSpinner, this);
        this.on(events.initialEnd, this.onInitialEnd, this);
        EventHandler.add(this.element, 'contextmenu', this.onContextMenu, this);
    }
    private removeEventListeners(): void {
        if (this.isDestroyed) { return; }
        this.off(events.beforeRequest, this.showSpinner);
        this.off(events.afterRequest, this.hideSpinner);
        this.off(events.initialEnd, this.onInitialEnd);
        EventHandler.remove(this.element, 'contextmenu', this.onContextMenu);
    }

    private resizeHandler(): void {
        this.notify(events.resizeEnd, {});
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'altN':
                e.preventDefault();
                this.itemData = [getPathObject(this)];
                createDialog(this, 'NewFolder');
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
                read(this, events.layoutChange, '/');
                break;
            /* istanbul ignore next */
            case 'ctrlShift2':
                e.preventDefault();
                this.fileView = 'LargeIcons';
                this.setProperties({ view: 'LargeIcons' }, true);
                read(this, events.layoutChange, '/');
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
                case 'allowMultiSelection':
                    if (this.allowMultiSelection) {
                        addClass([this.element], CLS.CHECK_SELECT);
                    } else {
                        removeClass([this.element], CLS.CHECK_SELECT);
                    }
                    if (this.selectedItems.length === 1) {
                        this.singleSelection = this.selectedItems[0];
                    } else {
                        this.singleSelection = null;
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
                    this.setRtl(newProp.enableRtl);
                    this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
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
                    this.notify(events.modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
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
     * Refresh the folder files of the file manager.
     * @returns void
     */
    public refreshFiles(): void {
        refresh(this);
    }

    /**
     * To select node names for performing file operations
     * @public
     * @hidden
     */
    public fileOperation(nodes: Object[], operation?: string): void {
        let i: number = 0;
        let selectNodes: { [key: string]: string }[] = <{ [key: string]: string }[]>nodes;
        while (i < nodes.length) {
            (operation !== 'Remove') ? this.selectedNodes.push(selectNodes[i].name) : this.selectedNodes = this.selectedNodes;
            (operation === 'Remove') ? this.deleteRecords.push(selectNodes[i].name) : this.deleteRecords = this.deleteRecords;
            i++;
        }
    }

    /**
     * Gets details of file's / folder's
     * @hidden
     */
    /* istanbul ignore next */
    public getDetails(): void {
        removeBlur(this as IFileManager);
        this.targetPath = this.path;
        if (this.activeElements && this.activeElements.length === 0) {
            this.activeElements = this.element.querySelectorAll('.' + CLS.ACTIVE);
        }
        let items: Object[] = activeElement('FileInfo', null, this as IFileManager);
        /* istanbul ignore next */
        items = (items.length !== 0) ? items : activeElement('FileInfo', false, this as IFileManager);
        this.selectedNodes = [];
        this.fileOperation(items);
        if (this.selectedNodes.length === 0 || this.targetPath === '') {
            this.selectedNodes[0] = '';
        }
        GetDetails(this as IFileManager, this.selectedNodes, this.targetPath, 'GetDetails');
    }

    /**
     * Performs paste operation
     * @hidden
     */
    public pasteHandler(): void {
        if (this.selectedNodes.length !== 0) {
            if ((this.fileAction === 'MoveTo' && this.targetPath !== this.path) || this.fileAction === 'CopyTo') {
                paste(
                    // tslint:disable-next-line
                    this as IFileManager, this.targetPath, this.selectedNodes, this.path, this.fileAction, this.navigationpaneModule, []);
            } else {
                removeBlur(this as IFileManager);
            }
        }
    }

    /**
     * Performs delete operation
     * @hidden
     */
    public deleteHandler(items: Object[]): void {
        this.deleteRecords = [];
        this.fileOperation(items, 'Remove');
        Delete(this as IFileManager, this.deleteRecords, this.targetPath, 'Remove', this.navigationpaneModule);
        this.deleteRecords = [];
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