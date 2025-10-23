import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, ModuleDeclaration, L10n, Complex, isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';
import { Event, EmitType } from '@syncfusion/ej2-base';
import { Toolbar } from './tool-bar/tool-bar';
import { DocumentEditorContainerModel } from './document-editor-container-model';
import { DocumentEditor, DocumentEditorSettings, DocumentSettings } from '../document-editor/document-editor';
import { HeaderFooterProperties } from './properties-pane/header-footer-pane';
import { ImageProperties } from './properties-pane/image-properties-pane';
import { TocProperties } from './properties-pane/table-of-content-pane';
import { TableProperties } from './properties-pane/table-properties-pane';
import { StatusBar } from './properties-pane/status-bar';
import { ViewChangeEventArgs, RequestNavigateEventArgs, ContainerContentChangeEventArgs, ContainerSelectionChangeEventArgs, ContainerDocumentChangeEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, BeforePaneSwitchEventArgs, LayoutType, CommentDeleteEventArgs, RevisionActionEventArgs, ServiceFailureArgs, CommentActionEventArgs, XmlHttpRequestEventArgs, ToolbarItem, ToolbarMode, FileMenuItemType, RibbonLayoutType } from '../document-editor/base';
import { createSpinner } from '@syncfusion/ej2-popups';
import { ContainerServerActionSettingsModel, DocumentEditorModel, DocumentEditorSettingsModel, DocumentSettingsModel, FormFieldSettingsModel } from '../document-editor/document-editor-model';
import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties } from '../document-editor/implementation';
import { CustomToolbarItemModel, TrackChangeEventArgs, AutoResizeEventArgs, ContentChangeEventArgs, BeforePasteEventArgs } from '../document-editor/base/events-helper';
import { ClickEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { beforeAutoResize, internalAutoResize, internalZoomFactorChange, beforeCommentActionEvent, commentDeleteEvent, contentChangeEvent, trackChangeEvent, beforePaneSwitchEvent, serviceFailureEvent, documentChangeEvent, selectionChangeEvent, customContextMenuSelectEvent, customContextMenuBeforeOpenEvent, internalviewChangeEvent, beforeXmlHttpRequestSend, protectionTypeChangeEvent, internalDocumentEditorSettingsChange, internalStyleCollectionChange, revisionActionEvent, trackChanges, internalOptionPaneChange, beforePaste, asyncPagesVisible } from '../document-editor/base/constants';
import { HelperMethods } from '../index';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { Text } from './properties-pane/text-properties';
import { Ribbon } from './ribbon/ribbon';
import { BackStageMenuModel } from '@syncfusion/ej2-ribbon';
import { defaultLocaleStrings } from './locale-strings';
import { IToolbarHandler } from './helper/toolbar-handler';
/**
 * Document Editor container component.
 */
@NotifyPropertyChanges
export class DocumentEditorContainer extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Show or hide properties pane.
     *
     * @default true
     */
    @Property(true)
    public showPropertiesPane: boolean;
    /**
     * Enable or disable either `Toolbar` or `Ribbon` based on the `toolbarMode` property.
     *
     * @default true
     */
    @Property(true)
    public enableToolbar: boolean;
    /**
     * Specifies the restrict editing operation.
     *
     * @default false
     */
    @Property(false)
    public restrictEditing: boolean;
    /**
     * Enable or disable the spell checker in document editor container.
     *
     * @default false
     */
    @Property(false)
    public enableSpellCheck: boolean;
    /**
     * Enable or disable the track changes in document editor container.
     *
     * @default false
     */
    @Property(false)
    public enableTrackChanges: boolean;
    /**
     * Gets or sets the Layout Type.
     *
     * @default Pages
     */
    @Property('Pages')
    public layoutType: LayoutType;
    /**
     * Gets or sets the current user.
     *
     * @default ''
     */
    @Property('')
    public currentUser: string;
    /**
     * Gets or sets the color used for highlighting the editable ranges or regions of the `currentUser` in Document Editor. The default value is "#FFFF00".
     * > If the visibility of text affected due this highlight color matching with random color applied for the track changes, then modify the color value of this property to resolve text visibility problem.
     *
     * @default '#FFFF00'
     */
    @Property('#FFFF00')
    public userColor: string;
    /**
     * Enables the local paste.
     *
     * @default false
     */
    @Property(false)
    public enableLocalPaste: boolean;
    /**
     * Gets or sets the Sfdt service URL.
     *
     * @default ''
     */
    @Property()
    public serviceUrl: string;
    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     *
     * @default 2000
     * @aspType int
     */
    @Property(2000)
    public zIndex: number;
    /**
     * Enables the rendering with strict Content Security policy.
     */
    @Property(false)
    public enableCsp: boolean;
    /**
     * Gets or sets a value indicating whether comment is enabled or not
     *
     * @default true
     */
    @Property(true)
    public enableComment: boolean;
    /**
     * Defines the width of the DocumentEditorContainer component
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string;

    /**
     * Defines the height of the DocumentEditorContainer component
     *
     * @default '320px'
     */
    @Property('320px')
    public height: string;
    /**
     * Gets or sets a value indicating whether the automatic focus behavior is enabled for Document editor or not.
     *
     * > By default, the Document editor gets focused automatically when the page loads. If you want the Document editor not to be focused automatically, then set this property to false.
     *
     * @returns {boolean}
     * @aspType bool
     * @default true
     */
    @Property(true)
    public enableAutoFocus: boolean;
    /**
     * Enables the partial lock and edit module.
     *
     * @default false
     */
    @Property(false)
    public enableLockAndEdit: boolean;

    /**
     * Gets or sets a value indicating whether to start automatic resize with the specified time interval and iteration count.
     *
     * > * Resize action triggers automatically for the specified number of iterations, or till the parent element's height and width is non-zero.
     *
     * > * If the parent element's height and width is zero even in the last iteration, then the default height and width (200) is allocated for the Document editor.
     *
     * @default false
     * @returns {boolean}
     */
    @Property(false)
    public autoResizeOnVisibilityChange: boolean;

    /**
     * Specifies the toolbar mode for the document editor container. Two modes are available: 'Toolbar' and 'Ribbon'.
     * @default 'Toolbar'
     */
    @Property('Toolbar')
    public toolbarMode: ToolbarMode;

    /**
     * Specifies the current ribbon layout type, either 'Classic' or 'Simplified'.
     *
     * Note: This property is only considered when the `toolbarMode` property is set to `Ribbon`.
     *
     * @default 'Simplified'
     */
    @Property('Simplified')
    public ribbonLayout: RibbonLayoutType;

    /**
     * Triggers when the component is created
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;
    /* eslint-enable */

    /**
     * This event is triggered before content is pasted in Document Editor.
     *
     * @event
     * @returns {void}
     */
    @Event()
    public beforePaste: EmitType<BeforePasteEventArgs>;
    /**
     * Triggers whenever the content changes in the document editor container.
     *
     * @event contentChange
     */
    @Event()
    public contentChange: EmitType<ContainerContentChangeEventArgs>;
    /**
     * Triggers whenever selection changes in the document editor container.
     *
     * @event selectionChange
     */
    @Event()
    public selectionChange: EmitType<ContainerSelectionChangeEventArgs>;
    /**
     * Triggers whenever document changes in the document editor container.
     *
     * @event documentChange
     */
    @Event()
    public documentChange: EmitType<ContainerDocumentChangeEventArgs>;
    /**
     * Triggers when toolbar item is clicked.
     *
     * @event toolbarClick
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;
    /**
     * Triggers when toolbar item is clicked.
     *
     * Note: This event is only considered when the `toolbarMode` property is set to `Ribbon`.
     *
     * @event fileMenuItemClick
     */
    @Event()
    public fileMenuItemClick: EmitType<ClickEventArgs>;
    /**
     * Triggers while selecting the custom context-menu option.
     *
     * @event customContextMenuSelect
     */
    @Event()
    public customContextMenuSelect: EmitType<CustomContentMenuEventArgs>;
    /**
     * Triggers before opening the custom context-menu option.
     *
     * @event customContextMenuBeforeOpen
     */
    @Event()
    public customContextMenuBeforeOpen: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;
    /**
     * Trigger before switching panes in DocumentEditor.
     *
     * @event beforePaneSwitch
     */
    @Event()
    public beforePaneSwitch: EmitType<BeforePaneSwitchEventArgs>;
    /**
     * Triggers on deleting a comment.
     *
     * @event commentDelete
     */
    @Event()
    public commentDelete: EmitType<CommentDeleteEventArgs>;
    /**
     * Triggers before accepting or rejecting changes.
     *
     * @event beforeAcceptRejectChanges
     */
    @Event()
    public beforeAcceptRejectChanges: EmitType<RevisionActionEventArgs>;
    /**
     * Triggers on comment actions(Post, edit, reply, resolve, reopen).
     *
     * @event beforeCommentAction
     */
    @Event()
    public beforeCommentAction: EmitType<CommentActionEventArgs>;
    /**
     * Triggers when the server action fails.
     *
     * @event serviceFailure
     */
    @Event()
    public serviceFailure: EmitType<ServiceFailureArgs>;

    /**
     * Triggers Keyboard shortcut of TrackChanges.
     *
     * @event trackChange
     */
    @Event()
    public trackChange: EmitType<TrackChangeEventArgs>;
    /**
     * Triggers when user interaction prevented in content control.
     *
     * @event contentControl
     */
    @Event()
    public contentControl: EmitType<Object>;
    /**
     * Triggers before a server request is started, allows you to modify the XMLHttpRequest object (setting additional headers, if needed).
     */
    @Event()
    public beforeXmlHttpRequestSend: EmitType<XmlHttpRequestEventArgs>;
    /**
     * @private
     * Triggers when pages loads asynchronously in the document editor
     */
    @Event()
    public asyncPagesVisible: EmitType<void>;
    /**
     * Document editor container's toolbar module
     *
     * @private
     */
    public toolbarModule: Toolbar;
    /**
     * Document editor container's ribbon module
     *
     * @private
     */
    public ribbonModule: Ribbon;
    /**
     * @private
     */
    public localObj: L10n;
    /**
     * Document Editor instance
     */
    private documentEditorInternal: DocumentEditor;
    /**
     * @private
     */
    public toolbarContainer: HTMLElement;
    /**
     * @private
     */
    public ribbonContainer: HTMLElement;
    /**
     * @private
     */
    public editorContainer: HTMLElement;
    /**
     * @private
     */
    public propertiesPaneContainer: HTMLElement;
    /**
     * @private
     */
    public statusBarElement: HTMLElement;
    /**
     * Header footer Properties
     *
     * @private
     */
    public headerFooterProperties: HeaderFooterProperties;
    /**
     * Image Properties Pane
     *
     * @private
     */
    public imageProperties: ImageProperties;
    /**
     * @private
     */
    public tocProperties: TocProperties;
    /**
     * @private
     */
    public tableProperties: TableProperties;
    /**
     * @private
     */
    public statusBar: StatusBar;
    /**
     * @private
     */
    public containerTarget: HTMLElement;
    /**
     * @private
     */
    public previousContext: string = '';
    /**
     * @private
     */
    public characterFormat: CharacterFormatProperties;
    /**
     * @private
     */
    public paragraphFormat: ParagraphFormatProperties;
    /**
     * @private
     */
    public documentCharacterFormat: CharacterFormatProperties;
    /**
     * @private
     */
    public sectionFormat: SectionFormatProperties;
    /**
     * @private
     */
    public documentParagraphFormat: ParagraphFormatProperties;
    /**
     * @private
     */
    public showHeaderProperties: boolean = true;
    /**
     * This will hold the value of showPropertiesPane during initial rendering or whenever the propertyChange occurs
     *
     * @private
     */
    public showPane: boolean = true;
    /**
     * Defines the settings for DocumentEditor customization.
     *
     * @default {}
     */
    @Complex<DocumentEditorSettingsModel>({}, DocumentEditorSettings)
    public documentEditorSettings: DocumentEditorSettingsModel;

    /**
     * Gets the settings and properties of the document that is opened in Document editor component.
     *
     * @default {}
     */
    @Complex<DocumentSettingsModel>({}, DocumentSettings)
    public documentSettings: DocumentSettingsModel;
    /**
     * Defines the settings of the DocumentEditorContainer service.
     */
    @Property({ import: 'Import', systemClipboard: 'SystemClipboard', spellCheck: 'SpellCheck', spellCheckByPage: 'SpellCheckByPage', restrictEditing: 'RestrictEditing', canLock: 'CanLock', getPendingActions: 'GetPendingActions' })
    public serverActionSettings: ContainerServerActionSettingsModel;

    /**
     * Defines toolbar items for DocumentEditorContainer.
     *
     * @default ['New','Open','Separator','Undo','Redo','Separator','Image','Table','Hyperlink','Bookmark','TableOfContents','Separator','Header','Footer','PageSetup','PageNumber','Break','InsertFootnote','InsertEndnote','Separator','Find','Separator','Comments','TrackChanges','LocalClipboard','RestrictEditing','Separator','FormFields','UpdateFields','ContentControl','XML Mapping']
     */
    @Property(['New', 'Open', 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'InsertFootnote', 'InsertEndnote', 'Separator', 'Find', 'Separator', 'Comments', 'TrackChanges', 'Separator', 'LocalClipboard', 'RestrictEditing', 'Separator', 'FormFields', 'UpdateFields', 'ContentControl', 'XML Mapping'])
    public toolbarItems: (CustomToolbarItemModel | ToolbarItem)[];
    /* eslint-enable max-len */
    /* eslint-disable */
    /**
     * Adds the custom headers to XMLHttpRequest.
     *
     * @default []
     */
    @Property([])
    public headers: object[];
    /**
     * Defines file menu items for Ribbon.
     *
     * Note: This property is only considered when the `toolbarMode` property is set to `Ribbon`.
     *
     * @default ['New', 'Open', 'Export','Print']
     */
    @Property(['New', 'Open', 'Export', 'Print'])
    public fileMenuItems: (FileMenuItemType | MenuItemModel)[];

    /**
     * Gets or sets the backstage menu configuration.
     * When set, this will replace the traditional file menu with a backstage view.
     *
     * Note: This property is only considered when the `toolbarMode` property is set to `Ribbon`.
     *
     * @default undefined
     */
    @Property(undefined)
    public backstageMenu: BackStageMenuModel;

    /* eslint-enable */
    /**
     * Gets the DocumentEditor instance.
     *
     * @aspType DocumentEditor
     * @returns {DocumentEditor} Returns the DocumentEditor instance.
     */
    public get documentEditor(): DocumentEditor {
        return this.documentEditorInternal;
    }
    /**
     * Gets the toolbar instance.
     *
     * @returns {Toolbar} Returns the toolbar module.
     */
    public get toolbar(): Toolbar {
        return this.toolbarModule;
    }
    /**
     * Gets the ribbon instance.
     *
     * @returns {Ribbon} Returns the ribbon module.
     */
    public get ribbon(): Ribbon {
        return this.ribbonModule;
    }

    /**
     * Initializes a new instance of the DocumentEditorContainer class.
     *
     * @param { DocumentEditorContainerModel } options Specifies the DocumentEditorContainer model as options.
     * @param { string | HTMLElement } element Specifies the element that is rendered as a DocumentEditorContainer.
     */
    public constructor(options?: DocumentEditorContainerModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * default locale
     *
     * @private
     */
    public defaultLocale: Object = defaultLocaleStrings;
    /* eslint-enable @typescript-eslint/naming-convention */
    /**
     * @private
     * @returns {string} Returns the DocumentEditorContainer module name.
     */
    public getModuleName(): string {
        return 'DocumentEditorContainer';
    }
    // Create a property to hold the current toolbar handler

    private get toolbarHandler(): IToolbarHandler {
        if (this.toolbarMode === 'Ribbon') {
            return this.ribbonModule;
        } else {
            return this.toolbarModule;
        }
    }
    /**
     * @private
     */
    /* eslint-disable  */
    public onPropertyChanged(newModel: DocumentEditorContainerModel, oldModel: DocumentEditorContainerModel): void {
        for (let prop of Object.keys(newModel)) {
            switch (prop) {
                case 'restrictEditing':
                    this.restrictEditingToggleHelper(newModel.restrictEditing);
                    break;
                case 'showPropertiesPane':
                    this.showHidePropertiesPane(newModel.showPropertiesPane);
                    this.showPane = this.showPropertiesPane;
                    break;
                case 'enableTrackChanges':
                    if (this.documentEditor.documentHelper.isTrackedOnlyMode && !newModel.enableTrackChanges && newModel.enableTrackChanges !== this.enableTrackChanges) {
                        this.enableTrackChanges = true;
                    }
                    if (this.documentEditor) {
                        this.documentEditor.enableTrackChanges = newModel.enableTrackChanges;
                        if (this.toolbarHandler) {
                            this.toolbarHandler.toggleTrackChanges(newModel.enableTrackChanges);
                        }
                        this.documentEditor.resize();
                    }
                    break;
                case 'enableLocalPaste':
                    if (this.documentEditor) {
                        this.documentEditor.enableLocalPaste = newModel.enableLocalPaste;
                    }
                    break;
                case 'serviceUrl':
                    if (this.documentEditor) {
                        this.documentEditor.serviceUrl = newModel.serviceUrl;
                    }
                    break;
                case 'serverActionSettings':
                    if (this.documentEditor) {
                        this.setserverActionSettings();
                    }
                    break;
                case 'zIndex':
                    if (this.documentEditor) {
                        this.documentEditor.zIndex = newModel.zIndex;
                    }
                    break;
                case 'headers':
                    if (this.documentEditor) {
                        this.documentEditor.headers = newModel.headers;
                    }
                    break;
                case 'locale':
                case 'enableRtl':
                    this.refresh();
                    break;
                case 'enableComment':
                    if (this.documentEditor) {
                        this.documentEditor.enableComment = newModel.enableComment;
                    }
                    if (this.toolbarHandler) {
                        this.toolbarHandler.enableDisableInsertComment(newModel.enableComment);
                    }
                    break;
                case 'enableSpellCheck':
                    if (this.documentEditor) {
                        this.documentEditor.enableSpellCheck = newModel.enableSpellCheck;
                    }
                    break;
                case 'documentSettings':
                    if (this.documentEditor) {
                        this.documentEditor.documentSettings.compatibilityMode = this.documentSettings.compatibilityMode;
                    }
                    break;
                case 'documentEditorSettings':
                    if (this.documentEditor) {
                        this.customizeDocumentEditorSettings();
                    }
                    if (!isNullOrUndefined(newModel.documentEditorSettings.fontFamilies)) {
                        const fontFamilyValue: string[] = newModel.documentEditorSettings.fontFamilies;
                        this.refreshFontFamilies(fontFamilyValue);
                    }
                    break;
                case 'toolbarItems':
                    if (this.toolbarModule) {
                        this.toolbarModule.reInitToolbarItems(newModel.toolbarItems);
                    }
                    break;
                case 'currentUser':
                    if (this.documentEditor) {
                        this.documentEditor.currentUser = newModel.currentUser;
                    }
                    break;
                case 'userColor':
                    if (this.documentEditor) {
                        this.documentEditor.userColor = newModel.userColor;
                    }
                    break;
                case 'layoutType':
                    if (this.documentEditor) {
                        if (this.documentEditor.documentHelper.isDocumentLoadAsynchronously) {
                            break;
                        }
                        this.documentEditor.layoutType = newModel.layoutType;
                        if (newModel.layoutType === 'Continuous') {
                            this.statusBar.togglePageLayout();
                        } else {
                            this.statusBar.toggleWebLayout();
                        }
                        if (this.ribbon) {
                            this.ribbon.tabManager.viewTab.onSelectionChange();
                        }
                    }
                    break;
                case 'toolbarMode':
                case 'enableToolbar':
                    this.handleToolbarModeChange();
                    break;
                case 'height':
                    this.element.style.height = formatUnit(this.height);
                    if (this.documentEditor) {
                        this.documentEditor.resize();
                    }
                    this.resize();
                    break;
                case 'width':
                    this.element.style.width = formatUnit(this.width);
                    if (this.documentEditor) {
                        this.documentEditor.resize();
                    }
                    break;
                case 'enableAutoFocus':
                    if (this.documentEditor) {
                        this.documentEditor.enableAutoFocus = newModel.enableAutoFocus;
                    }
                    break;
                case 'autoResizeOnVisibilityChange':
                    if (this.documentEditor) {
                        this.documentEditor.autoResizeOnVisibilityChange = newModel.autoResizeOnVisibilityChange;
                    }
                    break;
                case 'backstageMenu':
                    if (this.ribbonModule) {
                        this.ribbonModule.backstageMenu = newModel.backstageMenu;
                        this.ribbonModule.ribbon.refresh();
                    }
                    break;
                case 'fileMenuItems':
                    if (this.ribbonModule) {
                        this.ribbonModule.fileMenuItems = newModel.fileMenuItems;
                        this.ribbonModule.ribbon.refresh();
                    }
                    break;
            }
        }
    }

    private handleToolbarModeChange(): void {
        this.createToolbarContainer(this.enableRtl, true);
        if (this.toolbarHandler) {
            this.toolbarHandler.initialize(true);
        }
        if (this.documentEditor) {
            this.documentEditor.resize();
        }
    }
    /**
     * @private
     */
    protected preRender(): void {
        this.localObj = new L10n('documenteditorcontainer', this.defaultLocale, this.locale);
        if (!isNullOrUndefined(this.element) && this.element.id === '') {
            //Set unique id, if id is empty
            this.element.id = HelperMethods.getUniqueElementId();
        }
        this.initContainerElement();
    }

    /**
     * @private
     */
    protected render(): void {
        if (this.toolbarHandler) {
            this.toolbarHandler.initialize();
        }
        if (this.height !== '') {
            this.element.style.height = formatUnit(this.height);
        }
        if (this.width !== '') {
            this.element.style.width = formatUnit(this.width);
        }
        this.element.style.minHeight = '320px';
        this.initializeDocumentEditor();
        if (this.restrictEditing) {
            this.restrictEditingToggleHelper(this.restrictEditing);
        }
        if (this.toolbarMode !== 'Ribbon') {
            this.initializePane();
        }
        this.statusBar = new StatusBar(this.statusBarElement, this);
        // Waiting popup
        createSpinner({ target: this.containerTarget, cssClass: 'e-spin-overlay' });
        this.setserverActionSettings();
        this.renderComplete();
    }
    /**
     * @return {void}
     * @private
     */
    public initializePane(): void {
        if (!this.headerFooterProperties) {
            this.headerFooterProperties = new HeaderFooterProperties(this, this.enableRtl);
        }
        if (!this.imageProperties) {
            this.imageProperties = new ImageProperties(this, this.enableRtl);
        }
        if (!this.tocProperties) {
            this.tocProperties = new TocProperties(this, this.enableRtl);
        }
        if (!this.tableProperties) {
            this.tableProperties = new TableProperties(this, this.imageProperties, this.enableRtl);
        }
    }
    /**
     * @return {void}
     * @private
     */
    public destroyPane(): void {
        if (this.headerFooterProperties) {
            this.headerFooterProperties.destroy();
            this.headerFooterProperties = undefined;
        }
        if (this.imageProperties) {
            this.imageProperties.destroy();
            this.imageProperties = undefined;
        }
        if (this.tocProperties) {
            this.tocProperties.destroy();
            this.tocProperties = undefined;
        }
        if (this.tableProperties) {
            this.tableProperties.destroy();
            this.tableProperties = undefined;
        }
        if (this.propertiesPaneContainer) {
            this.propertiesPaneContainer.parentElement.removeChild(this.propertiesPaneContainer);
            this.propertiesPaneContainer = undefined;
        }
    }
    private restrictEditingToggleHelper(restrictEditing: boolean): void {
        this.documentEditor.isReadOnly = restrictEditing;
        if (this.toolbarHandler) {
            this.toolbarHandler.restrictEditingToggleHelper(restrictEditing);

        }
        if (this.showPane && this.toolbarMode !== 'Ribbon') {
            this.showPropertiesPane = !restrictEditing;
            this.showHidePropertiesPane(!restrictEditing);
        }
        this.documentEditor.trackChangesPane.enableDisableButton(!restrictEditing && !this.documentEditor.documentHelper.isDocumentProtected);
    }

    private setFormat(): void {
        if (this.characterFormat && this.documentEditor) {
            this.documentEditor.setDefaultCharacterFormat(this.characterFormat);
        }
        if (this.paragraphFormat && this.documentEditor) {
            this.documentEditor.setDefaultParagraphFormat(this.paragraphFormat);
        }
        if (this.sectionFormat && this.documentEditor) {
            this.documentEditor.setDefaultSectionFormat(this.sectionFormat);
        }
        if (this.documentParagraphFormat && this.documentEditor) {
            this.documentEditor.setDocumentParagraphFormat(this.documentParagraphFormat);
        }
        if (this.documentCharacterFormat && this.documentEditor) {
            this.documentEditor.setDocumentCharacterFormat(this.documentCharacterFormat);
        }
    }

    private setserverActionSettings(): void {
        if (this.serviceUrl) {
            this.documentEditor.serviceUrl = HelperMethods.sanitizeString(this.serviceUrl);
        }
        if (this.serverActionSettings.spellCheck) {
            this.documentEditor.serverActionSettings.spellCheck = HelperMethods.sanitizeString(this.serverActionSettings.spellCheck);
        }
        if (this.serverActionSettings.spellCheckByPage) {
            this.documentEditor.serverActionSettings.spellCheckByPage = HelperMethods.sanitizeString(this.serverActionSettings.spellCheckByPage);
        }
        if (this.serverActionSettings.restrictEditing) {
            this.documentEditor.serverActionSettings.restrictEditing = HelperMethods.sanitizeString(this.serverActionSettings.restrictEditing);
        }
        if (this.serverActionSettings.systemClipboard) {
            this.documentEditor.serverActionSettings.systemClipboard = HelperMethods.sanitizeString(this.serverActionSettings.systemClipboard);
        }
        if (this.serverActionSettings.import) {
            this.documentEditor.serverActionSettingsImport = HelperMethods.sanitizeString(this.serverActionSettings.import);
        }
        if (this.headers) {
            this.documentEditor.headers = JSON.parse(HelperMethods.sanitizeString(JSON.stringify(this.headers)));
        }
    }
    private customizeDocumentEditorSettings(): void {
        if (this.documentEditorSettings.formFieldSettings) {
            let settings: FormFieldSettingsModel = this.documentEditorSettings.formFieldSettings;
            let documentEditor: DocumentEditor = this.documentEditor;
            if (!isNullOrUndefined(settings.applyShading)) {
                documentEditor.documentEditorSettings.formFieldSettings.applyShading = settings.applyShading;
            }
            if (!isNullOrUndefined(settings.formFillingMode)) {
                documentEditor.documentEditorSettings.formFieldSettings.formFillingMode = settings.formFillingMode;
            }
            if (!isNullOrUndefined(settings.formattingExceptions)) {
                documentEditor.documentEditorSettings.formFieldSettings.formattingExceptions = settings.formattingExceptions;
            }
            if (!isNullOrUndefined(settings.selectionColor)) {
                documentEditor.documentEditorSettings.formFieldSettings.selectionColor = settings.selectionColor;
            }
            if (!isNullOrUndefined(settings.shadingColor)) {
                documentEditor.documentEditorSettings.formFieldSettings.shadingColor = settings.shadingColor;
            }
        }
        if (this.documentEditorSettings.searchHighlightColor) {
            this.documentEditor.documentEditorSettings.searchHighlightColor = HelperMethods.sanitizeString(this.documentEditorSettings.searchHighlightColor);
        }
        if (this.documentEditorSettings.fontFamilies) {
            this.documentEditor.documentEditorSettings.fontFamilies = JSON.parse(HelperMethods.sanitizeString(JSON.stringify(this.documentEditorSettings.fontFamilies)));
        }
        if (this.documentEditorSettings.collaborativeEditingSettings) {
            this.documentEditor.documentEditorSettings.collaborativeEditingSettings = this.documentEditorSettings.collaborativeEditingSettings;
        }
        if (this.documentEditorSettings.printDevicePixelRatio) {
            this.documentEditor.documentEditorSettings.printDevicePixelRatio = this.documentEditorSettings.printDevicePixelRatio;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.enableOptimizedTextMeasuring)) {
            this.documentEditor.documentEditorSettings.enableOptimizedTextMeasuring = this.documentEditorSettings.enableOptimizedTextMeasuring;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.maximumRows)) {
            this.documentEditor.documentEditorSettings.maximumRows = this.documentEditorSettings.maximumRows;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.maximumColumns)) {
            this.documentEditor.documentEditorSettings.maximumColumns = this.documentEditorSettings.maximumColumns;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.showHiddenMarks)) {
            this.documentEditor.documentEditorSettings.showHiddenMarks = this.documentEditorSettings.showHiddenMarks;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.showBookmarks)) {
            this.documentEditor.documentEditorSettings.showBookmarks = this.documentEditorSettings.showBookmarks;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.highlightEditableRanges)) {
            this.documentEditor.documentEditorSettings.highlightEditableRanges = this.documentEditorSettings.highlightEditableRanges;
        }

        if (!isNullOrUndefined(this.documentEditorSettings.allowDragAndDrop)) {
            this.documentEditor.documentEditorSettings.allowDragAndDrop = this.documentEditorSettings.allowDragAndDrop;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.optimizeSfdt)) {
            this.documentEditor.documentEditorSettings.optimizeSfdt = this.documentEditorSettings.optimizeSfdt;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.autoResizeSettings)) {
            this.documentEditor.documentEditorSettings.autoResizeSettings = this.documentEditorSettings.autoResizeSettings;
        }

        if (!isNullOrUndefined(this.documentEditorSettings.showRuler)) {
            this.documentEditor.documentEditorSettings.showRuler = this.documentEditorSettings.showRuler;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.colorPickerSettings)) {
            this.documentEditor.documentEditorSettings.colorPickerSettings = this.documentEditorSettings.colorPickerSettings;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.popupTarget)) {
            this.documentEditor.documentEditorSettings.popupTarget = this.documentEditorSettings.popupTarget;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.showNavigationPane)) {
            this.documentEditor.documentEditorSettings.showNavigationPane = this.documentEditorSettings.showNavigationPane;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.mentionSettings)) {
            this.documentEditor.documentEditorSettings.mentionSettings = this.documentEditorSettings.mentionSettings;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.pasteAsNewParagraph)) {
            this.documentEditor.documentEditorSettings.pasteAsNewParagraph = this.documentEditorSettings.pasteAsNewParagraph;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.enableScreenReader)) {
            this.documentEditor.documentEditorSettings.enableScreenReader = this.documentEditorSettings.enableScreenReader;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.enableSpellCheckOnScroll)) {
            this.documentEditor.documentEditorSettings.enableSpellCheckOnScroll = this.documentEditorSettings.enableSpellCheckOnScroll;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.revisionSettings)) {
            this.documentEditor.documentEditorSettings.revisionSettings = this.documentEditorSettings.revisionSettings;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.openAsyncSettings)) {
            this.documentEditor.documentEditorSettings.openAsyncSettings = this.documentEditorSettings.openAsyncSettings;
        }
        if (!isNullOrUndefined(this.documentEditorSettings.allowHyphensInBookmarkNames)) {
            this.documentEditor.documentEditorSettings.allowHyphensInBookmarkNames = this.documentEditorSettings.allowHyphensInBookmarkNames;
        }
    }
    /**
     * @private
     */
    public getPersistData(): string {
        return 'documenteditor-container';
    }

    /* eslint-disable  */
    protected requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];

        if (this.enableToolbar) {
            if (this.toolbarMode === 'Ribbon') {
                modules.push({
                    member: 'ribbon', args: [this]
                });
            } else {
                modules.push({
                    member: 'toolbar', args: [this]
                });
            }
        }

        return modules;
    }

    private initContainerElement(): void {
        // Toolbar container
        let isRtl: boolean = this.enableRtl;
        this.containerTarget = this.createElement('div', { className: 'e-de-ctn' });
        this.containerTarget.contentEditable = 'false';
        this.createToolbarContainer(isRtl);
        this.containerTarget.appendChild(this.editorContainer);
        this.statusBarElement = this.createElement('div', { className: 'e-de-status-bar' });
        if (isRtl) {
            this.statusBarElement.style.direction = 'rtl';
        }
        this.containerTarget.appendChild(this.statusBarElement);
        this.element.appendChild(this.containerTarget);
    }
    private initializePaneElement(): void {
        if (this.toolbarMode != 'Ribbon' && !this.propertiesPaneContainer) {
            let propertiesPaneContainerBorder: string;
            if (!this.enableRtl) {
                propertiesPaneContainerBorder = 'e-de-pane';
            } else {
                propertiesPaneContainerBorder = 'e-de-pane-rtl';
            }
            this.propertiesPaneContainer = this.createElement('div', { className: propertiesPaneContainerBorder, styles: 'display:none' });
            this.editorContainer.appendChild(this.propertiesPaneContainer);
        }
    }
    private createToolbarContainer(isRtl: boolean, isCustom?: boolean): void {
        if (isNullOrUndefined((this.editorContainer))) {
            this.editorContainer = this.createElement('div', { className: 'e-de-tool-ctnr-properties-pane' + (isRtl ? ' e-de-ctnr-rtl' : '') });
        }
        if (this.enableToolbar) {
            this.editorContainer.classList.remove(...['e-de-tool-ctnr-properties-pane', 'e-de-ribbon-simplified-ctnr-properties-pane', 'e-de-ribbon-classic-ctnr-properties-pane']);
            if (this.toolbarMode === 'Ribbon') {
                // Create ribbon container
                this.ribbonContainer = this.createElement('div', {
                    className: 'e-de-ctnr-ribbon' + (isRtl ? ' e-de-ctnr-rtl' : '')
                    // styles: 'min-height: 150px' // Adjust height as needed
                });

                // Add to DOM
                if (isCustom) {
                    this.containerTarget.insertBefore(this.ribbonContainer, this.containerTarget.firstChild);
                } else {
                    this.containerTarget.appendChild(this.ribbonContainer);
                }
                if (this.ribbonLayout === 'Simplified') {
                    this.editorContainer.classList.add('e-de-ribbon-simplified-ctnr-properties-pane');
                } else {
                    this.editorContainer.classList.add('e-de-ribbon-classic-ctnr-properties-pane');
                }
            } else {
                // Original toolbar container creation
                this.toolbarContainer = this.createElement('div', {
                    className: 'e-de-ctnr-toolbar' + (isRtl ? ' e-de-ctnr-rtl' : '')
                });
                if (isCustom) {
                    this.containerTarget.insertBefore(this.toolbarContainer, this.containerTarget.firstChild);
                } else {
                    this.containerTarget.appendChild(this.toolbarContainer);
                }
                this.editorContainer.classList.add('e-de-tool-ctnr-properties-pane');
            }
            this.editorContainer.classList.remove('e-de-ctnr-properties-pane');

        } else {
            this.editorContainer.classList.remove(...['e-de-tool-ctnr-properties-pane', 'e-de-ribbon-simplified-ctnr-properties-pane', 'e-de-ribbon-classic-ctnr-properties-pane']);
            this.editorContainer.classList.add('e-de-ctnr-properties-pane');
        }
        this.initializePaneElement();
    }
    private initializeDocumentEditor(): void {
        let id: string = this.element.id + '_editor';
        let documentEditorTarget: HTMLElement = this.createElement('div', { id: id, styles: 'width:100%;height:100%' });
        this.documentEditorInternal = new DocumentEditor({
            isReadOnly: false, enableRtl: this.enableRtl,
            selectionChange: this.onSelectionChange.bind(this),
            contentChange: this.onContentChange.bind(this),
            documentChange: this.onDocumentChange.bind(this),
            beforePaste: this.onBeforePaste.bind(this),
            requestNavigate: this.onRequestNavigate.bind(this),
            viewChange: this.onViewChange.bind(this),
            customContextMenuSelect: this.onCustomContextMenuSelect.bind(this),
            customContextMenuBeforeOpen: this.onCustomContextMenuBeforeOpen.bind(this),
            beforePaneSwitch: this.onBeforePaneSwitch.bind(this),
            commentBegin: this.onCommentBegin.bind(this),
            commentEnd: this.onCommentEnd.bind(this),
            commentDelete: this.onCommentDelete.bind(this),
            beforeAcceptRejectChanges: this.onBeforeAcceptRejectChanges.bind(this),
            beforeCommentAction: this.onCommentAction.bind(this),
            trackChange: this.onTrackChange.bind(this),
            serviceFailure: this.fireServiceFailure.bind(this),
            beforeXmlHttpRequestSend: this.beforeXmlHttpSend.bind(this),
            asyncPagesVisible: this.onAsyncPagesVisible.bind(this),
            locale: this.locale,
            acceptTab: true,
            zIndex: this.zIndex,
            enableLocalPaste: this.enableLocalPaste,
            layoutType: this.layoutType,
            pageOutline: '#E0E0E0',
            currentUser: this.currentUser,
            userColor: this.userColor,
            height: '100%',
            width: '100%',
            enableTrackChanges: this.enableTrackChanges,
            showRevisions: true,
            showComments: true,
            enableLockAndEdit: this.enableLockAndEdit,
            enableAutoFocus: this.enableAutoFocus
        });
        this.wireEvents();
        this.customizeDocumentEditorSettings();
        this.documentEditor.enableAllModules();
        this.documentEditor.enableComment = this.enableComment;
        this.showPane = this.showPropertiesPane;
        this.editorContainer.insertBefore(documentEditorTarget, this.editorContainer.firstChild);
        this.setFormat();
        this.documentEditor.appendTo(documentEditorTarget);
        this.documentEditor.resize();
    }
    private wireEvents(): void {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.documentEditor.on(internalZoomFactorChange, this.onZoomFactorChange, this);
        this.documentEditor.on(internalviewChangeEvent, this.onViewChange, this);
        this.documentEditor.on(protectionTypeChangeEvent, this.onProtectionChange, this);
        this.documentEditor.on(internalDocumentEditorSettingsChange, this.updateShowHiddenMarks, this);
        this.documentEditor.on(internalStyleCollectionChange, this.updateStyleCollection, this);
        // Internal event to trigger auto resize.
        this.documentEditor.on(internalAutoResize, this.triggerAutoResize, this)
        this.documentEditor.on(beforeAutoResize, this.onBeforeAutoResize, this);
        this.documentEditor.on(trackChanges, this.onEnableTrackChanges, this);
        this.documentEditor.on(internalOptionPaneChange, this.onOptionPaneChange, this);
    }

    private onWindowResize(): void {
        if (!isNullOrUndefined(this.documentEditor)) {
            this.documentEditor.isContainerResize = true;
            this.resize();
        }
    }

    private onOptionPaneChange(args: any): void {
        //this.documentEditorSettings.showNavigationPane = args.show;
        if (this.toolbarMode === 'Ribbon' && this.ribbonModule) {
            this.ribbonModule.tabManager.viewTab.onSelectionChange();
        }
    }

    private onEnableTrackChanges(model: DocumentEditorModel): void {
        if (model.enableTrackChanges !== this.enableTrackChanges) {
            this.enableTrackChanges = model.enableTrackChanges;
        }
    }

    private triggerAutoResize(args: AutoResizeEventArgs): void {
        // Cancels the auto resize of the document editor.
        args.cancel = true;
        this.resize();
    }

    private onBeforeAutoResize(args: AutoResizeEventArgs): void {
        args.element = this.element;
    }

    private unWireEvents(): void {
        if (isNullOrUndefined(this.documentEditor)) {
            return;
        }
        else {
            if (this.documentEditor.isDestroyed) {
                return;
            }
        }
        this.documentEditor.off(internalZoomFactorChange, this.onZoomFactorChange);
        this.documentEditor.off(internalviewChangeEvent, this.onViewChange);
        this.documentEditor.off(protectionTypeChangeEvent, this.onProtectionChange);
        this.documentEditor.off(internalDocumentEditorSettingsChange, this.updateShowHiddenMarks);
        this.documentEditor.off(internalStyleCollectionChange, this.updateStyleCollection);
    }
    private onCommentBegin(): void {
        if (this.toolbarHandler) {
            this.toolbarHandler.enableDisableInsertComment(false);
        }
    }
    private onCommentEnd(): void {
        if (this.toolbarHandler) {
            this.toolbarHandler.enableDisableInsertComment(true && this.enableComment);
        }
    }
    private beforeXmlHttpSend(args: XmlHttpRequestEventArgs): void {
        this.trigger(beforeXmlHttpRequestSend, args);
    }
    private onCommentDelete(args: CommentDeleteEventArgs): void {
        this.trigger(commentDeleteEvent, args);
    }
    private onBeforeAcceptRejectChanges(args: RevisionActionEventArgs): void {
        this.trigger(revisionActionEvent, args);
    }
    private onCommentAction(args: CommentActionEventArgs): void {
        this.trigger(beforeCommentActionEvent, args);
    }
    private onBeforePaste(args: BeforePasteEventArgs): void {
        this.trigger(beforePaste, args)
    }
    private onTrackChange(args: TrackChangeEventArgs): void {
        this.trigger(trackChangeEvent, args);
        if (this.toolbarHandler) {
            this.toolbarHandler.toggleTrackChanges(args.isTrackChangesEnabled);
        }
    }
    private onBeforePaneSwitch(args: BeforePaneSwitchEventArgs): void {
        this.trigger(beforePaneSwitchEvent, args);
    }
    /**
     * @private
     */
    private fireServiceFailure(eventArgs: ServiceFailureArgs): void {
        this.trigger(serviceFailureEvent, eventArgs);
    }
    /**
     * @private
     */
    public showHidePropertiesPane(show: boolean): void {
        if (this.showPropertiesPane) {
            this.showPropertiesPaneOnSelection();
        }
        if (this.propertiesPaneContainer) {
            this.propertiesPaneContainer.style.display = show ? 'block' : 'none';
        }
        if (this.toolbarModule) {
            this.toolbarModule.propertiesPaneButton.element.style.opacity = show ? '1' : '0.5';
        }
        this.documentEditor.resize();

    }
    private updateStyleCollection(): void {
        if (this.documentEditor.skipStyleUpdate) {
            return;
        }
        if (!isNullOrUndefined(this.tableProperties) && !isNullOrUndefined(this.tableProperties.tableTextProperties) && !isNullOrUndefined(this.tableProperties.tableTextProperties.paragraph)) {
            this.tableProperties.tableTextProperties.paragraph.updateStyleNames();
        }
        if (this.toolbarMode == 'Ribbon' && this.ribbon) {
            this.ribbon.tabManager.homeTab.updateStyleGallery();
        }
    }
    /**
     * Resizes the container component and its sub elements based on given size or client size.
     * @param width The width to be applied.
     * @param height The height to be applied.
     */
    public resize(width?: number, height?: number): void {
        if (this.element) {
            if (!this.documentEditor.isContainerResize) {
                if (isNullOrUndefined(height) && this.element && this.element.parentElement) {
                    height = this.element.parentElement.clientHeight;
                }
                if (isNullOrUndefined(width) && this.element && this.element.parentElement) {
                    width = this.element.parentElement.clientWidth;
                }
                if (!isNullOrUndefined(width) && width > 200) {
                    this.width = width.toString();
                    this.element.style.width = width + 'px';
                }
                if (!isNullOrUndefined(height) && height > 200) {
                    this.height = height.toString();
                    this.element.style.height = height + 'px';
                }
            }
            if (this.documentEditor) {
                this.documentEditor.resize();
            }
            if (this.toolbarModule) {
                this.toolbarModule.toolbar.refreshOverflow();
            }
            if (this.showPropertiesPane && this.tableProperties) {
                this.tableProperties.updateTabContainerHeight();
            }
            if (this.toolbarMode == 'Ribbon' && this.ribbon && this.ribbon.ribbon.tabs[this.ribbon.ribbon.selectedTab].header === this.ribbon.localObj.getConstant('Layout')) {
                this.ribbon.tabManager.layoutTab.layoutParagraphGroup.initializeNumericTextBoxes();
                this.ribbon.tabManager.layoutTab.layoutParagraphGroup.updateSelection();
            }
        }
    }
    /**
    * @private
    */
    public refreshFontFamilies(fontFamilies: string[]): void {
        if (!isNullOrUndefined(this.tableProperties) && !isNullOrUndefined(this.tableProperties.tableTextProperties) && !isNullOrUndefined(this.tableProperties.tableTextProperties.text)) {
            const text: Text = this.tableProperties.tableTextProperties.text;
            text.fontFamily.refresh();
            for (let i: number = 0; i < fontFamilies.length; i++) {
                const fontValue: string = fontFamilies[i];
                const fontStyleValue: { [key: string]: any } = { 'FontName': fontValue, 'FontValue': fontValue };
                text.fontFamily.addItem(fontStyleValue, i);
            }
        }
    }
    /**
     * @private
     */
    public onContentChange(args: ContentChangeEventArgs): void {
        if (this.toolbarHandler) {
            this.toolbarHandler.onContentChange();
        }
        if (this.statusBar) {
            this.statusBar.updatePageCount();
        }
        let eventArgs: ContainerContentChangeEventArgs = { source: this, operations: args.operations };
        this.trigger(contentChangeEvent, eventArgs);
    }
    /**
     * @private
     */
    public onDocumentChange(): void {
        this.enableTrackChanges = this.documentEditor.enableTrackChanges;
        if (!isNullOrUndefined(this.documentSettings) && !isNullOrUndefined(this.documentEditor)
            && !isNullOrUndefined(this.documentEditor.documentSettings)) {
            this.documentSettings.compatibilityMode = this.documentEditor.documentSettings.compatibilityMode;
        }
        if (!isNullOrUndefined(this.documentEditorSettings) && !isNullOrUndefined(this.documentEditorSettings.fontFamilies)) {
            const fontFamilyValue: string[] = this.documentEditorSettings.fontFamilies;
            this.refreshFontFamilies(fontFamilyValue);
        }
        if (this.toolbarHandler) {
            this.toolbarHandler.onDocumentChange();
        }
        if (this.statusBar) {
            this.statusBar.updatePageCount();
            this.statusBar.loadingDiv.style.display = 'none';
        }
        let eventArgs: ContainerDocumentChangeEventArgs = { source: this };
        this.trigger(documentChangeEvent, eventArgs);
        this.updateStyleCollection();
    }
    /**
     * @private
     */
    public onSelectionChange(): void {
        setTimeout(() => {
            if (!isNullOrUndefined(this.documentEditor)) {
                this.showPropertiesPaneOnSelection();
                if (this.ribbonModule) {
                    this.ribbonModule.updateRibbonState();
                }
                let eventArgs: ContainerSelectionChangeEventArgs = { source: this, isCompleted: this.documentEditor.documentHelper.isSelectionCompleted };
                this.trigger(selectionChangeEvent, eventArgs);
                this.documentEditor.documentHelper.isSelectionCompleted = true;
            }
        });
    }
    /**
     * @private
     */
    private onZoomFactorChange(): void {
        if (this.statusBar) {
            this.statusBar.updateZoomContent();
        }
        // Update ribbon zoom button states if ribbon is active
        if (this.toolbarMode === 'Ribbon' && this.ribbonModule) {
            this.ribbonModule.onZoomFactorChange();
        }

    }

    private onProtectionChange(): void {
        if (this.toolbarMode == 'Ribbon') {
            this.ribbon.stateManager.updateRibbonState(this.ribbon.ribbon);
        } else {
            this.showPropertiesPaneOnSelection();
        }
    }
    private updateShowHiddenMarks(settings: DocumentEditorSettingsModel): void {
        this.documentEditorSettings.showHiddenMarks = settings.showHiddenMarks;
        this.tableProperties.tableTextProperties.paragraph.toggleHiddenMarks();
    }
    /**
     * @private
     */
    private onRequestNavigate(args: RequestNavigateEventArgs): void {
        if (args.linkType !== 'Bookmark') {
            const navLink = args.navigationLink;
            let link: string = SanitizeHtmlHelper.sanitize(navLink);
            if (args.localReference.length > 0) {
                link += '#' + args.localReference;
            }
            if (navLink.substring(0, 8) === 'file:///'
                || (navLink.substring(0, 7) === 'http://' && navLink.length > 7)
                || (navLink.substring(0, 8) === 'https://' && navLink.length > 8)
                || (navLink.substring(0, 4) === 'www.' && navLink.length > 4)
                || (navLink.substring(0, 7) === 'mailto:' && navLink.length > 7)) {
                window.open(link);
            }
            else {
                DialogUtility.alert({
                    title: this.localObj.getConstant("Information"),
                    content: this.localObj.getConstant("The address of this site is not valid. Check the address and try again."),
                    okButton: { text: this.localObj.getConstant("OK") },
                    closeOnEscape: true,
                });
            }
            args.isHandled = true;
        }
    }
    /**
     * @private
     */
    private onViewChange(args: ViewChangeEventArgs): void {
        if (this.statusBar) {
            this.statusBar.updatePageNumberOnViewChange(args);
        }
    }
    /**
     * @private
     */
    private onCustomContextMenuSelect(args: CustomContentMenuEventArgs): void {
        this.trigger(customContextMenuSelectEvent, args);
    }
    /**
     * @private
     */
    private onCustomContextMenuBeforeOpen(args: BeforeOpenCloseCustomContentMenuEventArgs): void {
        this.trigger(customContextMenuBeforeOpenEvent, args);
    }
    /**
     * @private
     */
    private onAsyncPagesVisible(): void {
        if (this.statusBar) {
            this.statusBar.updatePageCount();
            this.statusBar.loadingDiv.style.display = 'inline-flex';
        }
    }
    /**
     * @private
     */
    public showPropertiesPaneOnSelection(): void {
        if (((this.restrictEditing) && !this.showPropertiesPane) || isNullOrUndefined(this.tableProperties)) {
            return;
        }
        let isProtectedDocument: boolean = this.documentEditor.documentHelper.protectionType !== 'NoProtection';
        let allowFormatting: boolean = isProtectedDocument && this.documentEditor.documentHelper.restrictFormatting;
        let isSelectionInProtectecRegion: boolean = this.documentEditor.editorModule.restrictEditing;

        if (isProtectedDocument) {
            if (this.toolbarModule) {
                this.toolbarModule.enableDisableToolBarItem(!isSelectionInProtectecRegion, true);
            }
            this.tableProperties.enableDisableElements(!allowFormatting && !isSelectionInProtectecRegion);
            this.tocProperties.enableDisableElements(!isSelectionInProtectecRegion);
            this.headerFooterProperties.enableDisableElements(!isSelectionInProtectecRegion);
            this.imageProperties.enableDisableElements(!isSelectionInProtectecRegion);
        } else {
            let isReadOnly: boolean = !this.documentEditor.isReadOnly;
            if (this.toolbarModule) {
                this.toolbarModule.enableDisableToolBarItem(isReadOnly, true || this.showPropertiesPane);
            }
            this.tableProperties.enableDisableElements(true);
            this.tocProperties.enableDisableElements(true);
            this.headerFooterProperties.enableDisableElements(true);
            this.imageProperties.enableDisableElements(true);
        }

        let currentContext: string = this.documentEditor.selectionModule.contextType;
        let isInHeaderFooter: boolean = currentContext.indexOf('Header') >= 0
            || currentContext.indexOf('Footer') >= 0;
        if (!isInHeaderFooter) {
            this.showHeaderProperties = true;
        }
        if (!this.showPropertiesPane) {
            this.showHidePropertiesPane(false);
            this.propertiesPaneContainer.style.display = 'none';
        } else {
            this.propertiesPaneContainer.style.display = 'block';
            if (isInHeaderFooter && this.showHeaderProperties) {
                this.showProperties('headerfooter');
            } else if ((currentContext.indexOf('List') >= 0 || currentContext.indexOf('Text') >= 0
                && currentContext.indexOf('Table') < 0)) {
                this.showProperties('text');
            } else if (currentContext.indexOf('Image') >= 0) {
                this.showProperties('image');
            } else if (currentContext.indexOf('TableOfContents') >= 0) {
                this.showProperties('toc');
            } else if (currentContext.indexOf('Table') >= 0) {
                this.showProperties('table');
            }
        }
        this.previousContext = this.documentEditor.selectionModule.contextType;
        if (this.toolbarHandler) {
            this.toolbarModule.enableDisableInsertComment(!this.documentEditor.enableHeaderAndFooter && this.enableComment && (!this.documentEditor.isReadOnlyMode || this.documentEditor.documentHelper.isDocumentLoadAsynchronously) && !this.documentEditor.selectionModule.isinFootnote && !this.documentEditor.selectionModule.isinEndnote &&
                !this.documentEditor.selectionModule.isPlainContentControl());
        }
    }
    /**
     * @private
     * @param property 
     */
    public showProperties(property: string): void {
        if (this.toolbarModule && property !== 'headerfooter' && property !== 'toc') {
            this.toolbarModule.enableDisablePropertyPaneButton(true);
        }
        this.tableProperties.showTableProperties((property === 'table' || property === 'text'), property);
        this.imageProperties.showImageProperties(property === 'image');
        this.headerFooterProperties.showHeaderFooterPane(property === 'headerfooter');
        this.tocProperties.showTocPane(property === 'toc');
    }

    /**
     * Set the default character format for document editor container
     * @param characterFormat Specify the character format properties to be applied for document editor.
     */
    public setDefaultCharacterFormat(characterFormat: CharacterFormatProperties): void {
        this.characterFormat = characterFormat;
        this.setFormat();
    }

    /**
     * Get the default character format for document editor container
     * @returns Returns the default character format for document editor container.
     */
    public getDefaultCharacterFormat(): CharacterFormatProperties {
        return this.characterFormat
    }

    /**
     * Set the default paragraph format for document editor container
     * @param paragraphFormat Specify the paragraph format properties to be applied for document editor.
     */
    public setDefaultParagraphFormat(paragraphFormat: ParagraphFormatProperties): void {
        this.paragraphFormat = paragraphFormat;
        this.setFormat();
    }

    /**
     * get the document paragraph format for document editor container
     * @returns Returns the default paragraph format for document editor container.
     */
    public getDefaultParagraphFormat(): ParagraphFormatProperties {
        return this.paragraphFormat;
    }

    /**
     * Set the default section format for document editor container
     * @param sectionFormat Specify the section format properties to be applied for document editor.
     */
    public setDefaultSectionFormat(sectionFormat: SectionFormatProperties): void {
        this.sectionFormat = sectionFormat;
        this.setFormat();
    }

    /**
     * get the document section format for document editor container
     * @returns Returns the default section format for document editor container.
     */
    public getDefaultSectionFormat(): SectionFormatProperties {
        return this.sectionFormat;
    }

    
    /**
     * Sets the document default paragraph format for document editor
     *
     * @param paragraphFormat - Specifies the paragraph format.
     * @returns {void}
     */
    public setDocumentParagraphFormat(paragraphFormat: ParagraphFormatProperties): void {
        this.documentParagraphFormat = JSON.parse(HelperMethods.sanitizeString(JSON.stringify(paragraphFormat)));
        this.setFormat();
    }

    /**
     * Gets the document default paragraph format for document editor
     * @returns Returns the default paragraph format for document editor.
     */
    public getDocumentParagraphFormat(): ParagraphFormatProperties {
        let format: ParagraphFormatProperties = {};
        HelperMethods.writeParagraphFormatProperties(this.documentEditor.documentHelper.paragraphFormat, format);
        return format;
    }

    /**
     * Set the document character format for document editor container
     * @param characterFormat Specify the character format properties to be applied for document editor container.
     */
    public setDocumentCharacterFormat(characterFormat: CharacterFormatProperties): void {
        this.documentCharacterFormat = characterFormat;
        this.setFormat();
    }

    /**
     * get the document character format for document editor container
     * @returns Returns the document character format for document editor container.
     */
    public getDocumentCharacterFormat(): CharacterFormatProperties {
        let format: CharacterFormatProperties = {};
        HelperMethods.writeCharacterFormatProperties(this.documentEditor.documentHelper.characterFormat, format);
        return format;
    }

    /**
     * Destroys all managed resources used by this object. 
     */
    public destroy(): void {
        super.destroy();
        if (this.element) {
            if (!this.refreshing) {
                this.element.classList.remove('e-documenteditorcontainer');
            }
            this.element.innerHTML = '';
        }
        if (!this.refreshing) {
            this.element = undefined;
            this.paragraphFormat = undefined;
            this.sectionFormat = undefined;
            this.characterFormat = undefined;
        }
        if (this.toolbarContainer && this.toolbarContainer.parentElement) {
            this.toolbarContainer.innerHTML = '';
            this.toolbarContainer.parentElement.removeChild(this.toolbarContainer);
        }
        this.toolbarContainer = undefined;
        if (this.documentEditorInternal) {
            this.unWireEvents();
            this.documentEditorInternal.destroy();
            this.documentEditorInternal = undefined;
        }
        if (this.headerFooterProperties) {
            this.headerFooterProperties.destroy();
        }
        this.headerFooterProperties = undefined;
        if (this.imageProperties) {
            this.imageProperties.destroy();
        }
        this.imageProperties = undefined;
        if (this.tocProperties) {
            this.tocProperties.destroy();
        }
        this.tocProperties = undefined;
        if (this.tableProperties) {
            this.tableProperties.destroy();
        }
        this.tableProperties = undefined;
        if (this.statusBar) {
            this.statusBar.destroy();
        }
        if (this.propertiesPaneContainer && this.propertiesPaneContainer.parentElement) {
            this.propertiesPaneContainer.remove();
        }
        this.propertiesPaneContainer = undefined;
        if (this.editorContainer && this.editorContainer.parentElement) {
            this.editorContainer.innerHTML = '';
            this.editorContainer.parentElement.removeChild(this.editorContainer);
        }
        if (this.statusBarElement && this.statusBarElement.parentElement) {
            this.statusBarElement.innerHTML = '';
            this.statusBarElement.parentElement.removeChild(this.statusBarElement);
        }
        if (this.containerTarget && this.containerTarget.parentElement) {
            this.containerTarget.innerHTML = '';
            this.containerTarget.parentElement.removeChild(this.containerTarget);
        }
        this.containerTarget = undefined;
        this.statusBarElement = undefined;
        this.editorContainer = undefined;
        this.statusBar = undefined;
        this.previousContext = undefined;
    }
}
