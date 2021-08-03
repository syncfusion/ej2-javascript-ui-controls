import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, ModuleDeclaration, L10n, Complex, isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';
import { Event, EmitType } from '@syncfusion/ej2-base';
import { Toolbar } from './tool-bar/tool-bar';
import { DocumentEditorContainerModel } from './document-editor-container-model';
import { DocumentEditor, DocumentEditorSettings } from '../document-editor/document-editor';
import { TextProperties } from './properties-pane/text-properties-pane';
import { HeaderFooterProperties } from './properties-pane/header-footer-pane';
import { ImageProperties } from './properties-pane/image-properties-pane';
import { TocProperties } from './properties-pane/table-of-content-pane';
import { TableProperties } from './properties-pane/table-properties-pane';
import { StatusBar } from './properties-pane/status-bar';
import { ViewChangeEventArgs, RequestNavigateEventArgs, ContainerContentChangeEventArgs, ContainerSelectionChangeEventArgs, ContainerDocumentChangeEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, BeforePaneSwitchEventArgs, LayoutType, CommentDeleteEventArgs, ServiceFailureArgs, CommentActionEventArgs } from '../document-editor/base';
import { createSpinner } from '@syncfusion/ej2-popups';
import { ContainerServerActionSettingsModel, DocumentEditorSettingsModel, FormFieldSettingsModel } from '../document-editor/document-editor-model';
import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties } from '../document-editor/implementation';
import { ToolbarItem } from '../document-editor/base/types';
import { CustomToolbarItemModel, TrackChangeEventArgs } from '../document-editor/base/events-helper';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { internalZoomFactorChange, beforeCommentActionEvent, commentDeleteEvent, contentChangeEvent, trackChangeEvent, beforePaneSwitchEvent, serviceFailureEvent, documentChangeEvent, selectionChangeEvent, customContextMenuSelectEvent, customContextMenuBeforeOpenEvent } from '../document-editor/base/constants';

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
     * Enable or disable toolbar in document editor container.
     *
     * @default true
     */
    @Property(true)
    public enableToolbar: boolean;
    /**
     * Restrict editing operation.
     *
     * @default false
     */
    @Property(false)
    public restrictEditing: boolean;
    /**
     * Enable or disable spell checker in document editor container.
     *
     * @default false
     */
    @Property(false)
    public enableSpellCheck: boolean;
    /**
     * Enable or disable track changes in document editor container.
     *
     * @default false
     */
    @Property(false)
    public enableTrackChanges: boolean;
    /**
     * Layout Type
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
     * Remarks: If the visibility of text affected due this highlight color matching with random color applied for the track changes, then modify the color value of this property to resolve text visibility problem.
     *
     * @default '#FFFF00'
     */
    @Property('#FFFF00')
    public userColor: string;
    /**
     * Enable local paste
     *
     * @default false
     */
    @Property(false)
    public enableLocalPaste: boolean;
    /**
     * Sfdt service URL.
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
     * Enable rendering with strict Content Security policy.
     */
    @Property(false)
    public enableCsp: boolean;
    /**
     * Gets or set a value indicating whether comment is enabled or not
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
     * Enable partial lock and edit module.
     *
     * @default false
     */
    @Property(false)
    public enableLockAndEdit: boolean;
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
     * Document editor container's toolbar module
     *
     * @private
     */
    public toolbarModule: Toolbar;
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
     * Text Properties
     *
     * @private
     */
    public textProperties: TextProperties;
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
    public sectionFormat: SectionFormatProperties;
    /**
     * @private
     */
    public showHeaderProperties: boolean = true;

    /**
     * Defines the settings for DocumentEditor customization.
     *
     * @default {}
     */
    @Complex<DocumentEditorSettingsModel>({}, DocumentEditorSettings)
    public documentEditorSettings: DocumentEditorSettingsModel;
    /**
     * Defines the settings of the DocumentEditorContainer service.
     */
    @Property({ import: 'Import', systemClipboard: 'SystemClipboard', spellCheck: 'SpellCheck', restrictEditing: 'RestrictEditing', canLock: 'CanLock', getPendingActions: 'GetPendingActions' })
    public serverActionSettings: ContainerServerActionSettingsModel;

    /**
     * Defines toolbar items for DocumentEditorContainer.
     *
     * @default ['New','Open','Separator','Undo','Redo','Separator','Image','Table','Hyperlink','Bookmark','TableOfContents','Separator','Header','Footer','PageSetup','PageNumber','Break','InsertFootnote','InsertEndnote','Separator','Find','Separator','Comments','TrackChanges','LocalClipboard','RestrictEditing','Separator','FormFields','UpdateFields']
     */
    @Property(['New', 'Open', 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'InsertFootnote', 'InsertEndnote', 'Separator', 'Find', 'Separator', 'Comments', 'TrackChanges', 'Separator', 'LocalClipboard', 'RestrictEditing', 'Separator', 'FormFields', 'UpdateFields'])
    public toolbarItems: (CustomToolbarItemModel | ToolbarItem)[];
    /* eslint-enable max-len */
    /* eslint-disable */
    /**
     * Add custom headers to XMLHttpRequest.
     *
     * @default []
     */
    @Property([])
    public headers: object[];
     /* eslint-enable */
    /**
     * Gets DocumentEditor instance.
     *
     * @aspType DocumentEditor
     * @returns {DocumentEditor} - Returns the DocumentEditor instance.
     */
    public get documentEditor(): DocumentEditor {
        return this.documentEditorInternal;
    }
    /**
     * Gets toolbar instance.
     *
     * @returns {Toolbar} - Returns toolbar module.
     */
    public get toolbar(): Toolbar {
        return this.toolbarModule;
    }
    /**
     * Initialize the constructor of DocumentEditorContainer
     *
     * @param { DocumentEditorContainerModel } options - Specified DocumentEditorContainer model as options.
     * @param { string | HTMLElement }element - Specifies the element that is rendered as a DocumentEditorContainer.
     */
    public constructor(options?: DocumentEditorContainerModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * default locale
     *
     * @private
     */
    public defaultLocale: Object = {
        'New': 'New',
        'Insert Footnote': 'Insert Footnote',
        'Insert Endnote': 'Insert Endnote',
        'Footnote Tooltip': 'Insert Footnote (Alt+Ctrl+F).',
        'Endnote Tooltip': 'Insert Endnote (Alt+Ctrl+D).',
        'Open': 'Open',
        'Undo': 'Undo',
        'Redo': 'Redo',
        'Image': 'Image',
        'Table': 'Table',
        'Link': 'Link',
        'Bookmark': 'Bookmark',
        'Table of Contents': 'Table of Contents',
        'HEADING - - - - 1': 'HEADING - - - - 1',
        'HEADING - - - - 2': 'HEADING - - - - 2',
        'HEADING - - - - 3': 'HEADING - - - - 3',
        'Header': 'Header',
        'Footer': 'Footer',
        'Page Setup': 'Page Setup',
        'Page Number': 'Page Number',
        'Break': 'Break',
        'Find': 'Find',
        'Local Clipboard': 'Local Clipboard',
        'Restrict Editing': 'Restrict Editing',
        'Upload from computer': 'Upload from computer',
        'By URL': 'By URL',
        'Page Break': 'Page Break',
        'Show properties pane': 'Show properties pane',
        'Hide properties pane': 'Hide properties pane',
        'Section Break': 'Section Break',
        'Header And Footer': 'Header & Footer',
        'Options': 'Options',
        'Levels': 'Levels',
        'Different First Page': 'Different First Page',
        'Different header and footer for odd and even pages': 'Different header and footer for odd and even pages.',
        'Different Odd And Even Pages': 'Different Odd & Even Pages',
        'Different header and footer for first page': 'Different header and footer for first page.',
        'Position': 'Position',
        'Header from Top': 'Header from Top',
        'Footer from Bottom': 'Footer from Bottom',
        'Distance from top of the page to top of the header': 'Distance from top of the page to top of the header.',
        'Distance from bottom of the page to bottom of the footer': 'Distance from bottom of the page to bottom of the footer.',
        'Aspect ratio': 'Aspect ratio',
        'W': 'W',
        'H': 'H',
        'Width': 'Width',
        'Height': 'Height',
        'Text': 'Text',
        'Paragraph': 'Paragraph',
        'Fill': 'Fill',
        'Fill color': 'Fill color',
        'Border Style': 'Border Style',
        'Outside borders': 'Outside borders',
        'All borders': 'All borders',
        'Inside borders': 'Inside borders',
        'Left border': 'Left border',
        'Inside vertical border': 'Inside vertical border',
        'Right border': 'Right border',
        'Top border': 'Top border',
        'Inside horizontal border': 'Inside horizontal border',
        'Bottom border': 'Bottom border',
        'Border color': 'Border color',
        'Border width': 'Border width',
        'Cell': 'Cell',
        'Merge cells': 'Merge cells',
        'Insert Or Delete': 'Insert / Delete',
        'Insert columns to the left': 'Insert columns to the left',
        'Insert columns to the right': 'Insert columns to the right',
        'Insert rows above': 'Insert rows above',
        'Insert rows below': 'Insert rows below',
        'Delete rows': 'Delete rows',
        'Delete columns': 'Delete columns',
        'Cell Margin': 'Cell Margin',
        'Top': 'Top',
        'Bottom': 'Bottom',
        'Left': 'Left',
        'Right': 'Right',
        'Align Text': 'Align Text',
        'Align top': 'Align top',
        'Align bottom': 'Align bottom',
        'Align center': 'Align center',
        'Number of heading or outline levels to be shown in table of contents': 'Number of heading or outline levels to be shown in table of contents.',
        'Show page numbers': 'Show page numbers',
        'Show page numbers in table of contents': 'Show page numbers in table of contents.',
        'Right align page numbers': 'Right align page numbers',
        'Right align page numbers in table of contents': 'Right align page numbers in table of contents.',
        'Use hyperlinks': 'Use hyperlinks',
        'Use hyperlinks instead of page numbers': 'Use hyperlinks instead of page numbers.',
        'Font': 'Font',
        'Font Size': 'Font Size',
        'Font color': 'Font color',
        'Text highlight color': 'Text highlight color',
        'Clear all formatting': 'Clear all formatting',
        'Bold Tooltip': 'Bold (Ctrl+B)',
        'Italic Tooltip': 'Italic (Ctrl+I)',
        'Underline Tooltip': 'Underline (Ctrl+U)',
        'Strikethrough': 'Strikethrough',
        'Superscript Tooltip': 'Superscript (Ctrl+Shift++)',
        'Subscript Tooltip': 'Subscript (Ctrl+=)',
        'Align left Tooltip': 'Align left (Ctrl+L)',
        'Center Tooltip': 'Center (Ctrl+E)',
        'Align right Tooltip': 'Align right (Ctrl+R)',
        'Justify Tooltip': 'Justify (Ctrl+J)',
        'Decrease indent': 'Decrease indent',
        'Increase indent': 'Increase indent',
        'Line spacing': 'Line spacing',
        'Bullets': 'Bullets',
        'Numbering': 'Numbering',
        'Styles': 'Styles',
        'Manage Styles': 'Manage Styles',
        'Page': 'Page',
        'of': 'of',
        'Fit one page': 'Fit one page',
        'Spell Check': 'Spell Check',
        'Spelling': 'Spelling',
        'Underline errors': 'Underline errors',
        'Fit page width': 'Fit page width',
        'Update': 'Update',
        'Cancel': 'Cancel',
        'Insert': 'Insert',
        'No Border': 'No Border',
        'Create a new document': 'Create a new document.',
        'Open a document': 'Open a document.',
        'Undo Tooltip': 'Undo the last operation (Ctrl+Z).',
        'Redo Tooltip': 'Redo the last operation (Ctrl+Y).',
        'Insert inline picture from a file': 'Insert inline picture from a file.',
        'Insert a table into the document': 'Insert a table into the document',
        'Create Hyperlink': 'Create a link in your document for quick access to web pages and files (Ctrl+K).',
        'Insert a bookmark in a specific place in this document': 'Insert a bookmark in a specific place in this document.',
        'Provide an overview of your document by adding a table of contents': 'Provide an overview of your document by adding a table of contents.',
        'Add or edit the header': 'Add or edit the header.',
        'Add or edit the footer': 'Add or edit the footer.',
        'Open the page setup dialog': 'Open the page setup dialog.',
        'Add page numbers': 'Add page numbers.',
        'Find Text': 'Find text in the document (Ctrl+F).',
        'Toggle between the internal clipboard and system clipboard': 'Toggle between the internal clipboard and system clipboard.</br>' +
            'Access to system clipboard through script is denied due to browsers security policy. Instead, </br>' +
            ' 1. You can enable internal clipboard to cut, copy and paste within the component.</br>' +
            ' 2. You can use the keyboard shortcuts (Ctrl+X, Ctrl+C and Ctrl+V) to cut, copy and paste with system clipboard.',
        'Current Page Number': 'The current page number in the document. Click or tap to navigate specific page.',
        'Read only': 'Read only',
        'Protections': 'Protections',
        'Error in establishing connection with web server': 'Error in establishing connection with web server',
        'Single': 'Single',
        'Double': 'Double',
        'New comment': 'New comment',
        'Comments': 'Comments',
        'Print layout': 'Print layout',
        'Web layout': 'Web layout',
        'Form Fields': 'Form Fields',
        'Text Form': 'Text Form',
        'Check Box': 'Check Box',
        'DropDown': 'Drop-Down',
        'Update Fields': 'Update Fields',
        'Update cross reference fields': 'Update cross reference fields',
        'Track Changes': 'Keep track of the changes made in the document',
        'TrackChanges': 'Track Changes',
        'AllCaps': 'AllCaps',
        'Change case Tooltip': 'Change case',
        'UPPERCASE': 'UPPERCASE',
        'No color': 'No color'
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    public getModuleName(): string {
        return 'DocumentEditorContainer';
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
                    break;
                case 'enableTrackChanges':
                    if (this.documentEditor) {
                        this.documentEditor.enableTrackChanges = newModel.enableTrackChanges;
                        this.documentEditor.showRevisions = newModel.enableTrackChanges;
                        if (this.toolbarModule) {
                            this.toolbarModule.toggleTrackChanges(newModel.enableTrackChanges);
                        }
                        if (this.documentEditor.enableTrackChanges) {
                            this.documentEditor.documentHelper.showRevision = true;
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
                    if (this.toolbarModule) {
                        this.toolbarModule.enableDisableInsertComment(newModel.enableComment);
                    }
                    break;
                case 'enableSpellCheck':
                    if (this.documentEditor) {
                        this.documentEditor.enableSpellCheck = newModel.enableSpellCheck;
                    }
                    break;
                case 'documentEditorSettings':
                    if (this.documentEditor) {
                        this.customizeDocumentEditorSettings();
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
                        this.documentEditor.layoutType = newModel.layoutType;
                    }
                    break;
                case 'enableToolbar':
                    this.createToolbarContainer(this.enableRtl, true);
                    if (newModel.enableToolbar && this.toolbarModule) {
                        this.toolbarModule.initToolBar(this.toolbarItems);
                        this.toolbarModule.enableDisableInsertComment(this.enableComment);
                        this.toolbarModule.toggleTrackChanges(this.enableTrackChanges);
                    }
                    if (this.documentEditor) {
                        this.documentEditor.resize();
                    }
                    break;
                case 'height':
                    this.element.style.height = formatUnit(this.height);
                    if (this.documentEditor) {
                        this.documentEditor.resize();
                    }
                    break;
                case 'width':
                    this.element.style.width = formatUnit(this.width);
                    if (this.documentEditor) {
                        this.documentEditor.resize();
                    }
                    break;
            }
        }
    }

    /**
     * @private
     */
    protected preRender(): void {
        this.localObj = new L10n('documenteditorcontainer', this.defaultLocale, this.locale);
        this.initContainerElement();
        //Prototype
    }

    /**
     * @private
     */
    protected render(): void {
        if (this.toolbarModule) {
            this.toolbarModule.initToolBar(this.toolbarItems);
            this.toolbarModule.enableDisableInsertComment(this.enableComment);
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
        this.textProperties = new TextProperties(this, this.element.id, false, this.enableRtl);
        this.headerFooterProperties = new HeaderFooterProperties(this, this.enableRtl);
        this.imageProperties = new ImageProperties(this, this.enableRtl);
        this.tocProperties = new TocProperties(this, this.enableRtl);
        this.tableProperties = new TableProperties(this, this.imageProperties, this.textProperties, this.enableRtl);
        this.statusBar = new StatusBar(this.statusBarElement, this);
        // Waiting popup
        createSpinner({ target: this.containerTarget, cssClass: 'e-spin-overlay' });
        this.setserverActionSettings();
        this.customizeDocumentEditorSettings();
        this.renderComplete();
    }
    private restrictEditingToggleHelper(restrictEditing: boolean): void {
        this.documentEditor.isReadOnly = restrictEditing;
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableToolBarItem(!restrictEditing, false);
        }
        this.showPropertiesPane = !restrictEditing;
        this.showHidePropertiesPane(!restrictEditing);
        this.documentEditor.trackChangesPane.enableDisableButton(!restrictEditing);
    }

    private setFormat(): void {
        if (this.characterFormat) {
            this.documentEditor.setDefaultCharacterFormat(this.characterFormat);
        }
        if (this.paragraphFormat) {
            this.documentEditor.setDefaultParagraphFormat(this.paragraphFormat);
        }
        if (this.sectionFormat) {
            this.documentEditor.setDefaultSectionFormat(this.sectionFormat);
        }
    }

    private setserverActionSettings(): void {
        if (this.serviceUrl) {
            this.documentEditor.serviceUrl = this.serviceUrl;
        }
        if (this.serverActionSettings.spellCheck) {
            this.documentEditor.serverActionSettings.spellCheck = this.serverActionSettings.spellCheck;
        }
        if (this.serverActionSettings.restrictEditing) {
            this.documentEditor.serverActionSettings.restrictEditing = this.serverActionSettings.restrictEditing;
        }
        if (this.serverActionSettings.systemClipboard) {
            this.documentEditor.serverActionSettings.systemClipboard = this.serverActionSettings.systemClipboard;
        }
        if (this.headers) {
            this.documentEditor.headers = this.headers;
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
            this.documentEditor.documentEditorSettings.searchHighlightColor = this.documentEditorSettings.searchHighlightColor;
        }
        if (this.documentEditorSettings.fontFamilies) {
            this.documentEditor.documentEditorSettings.fontFamilies = this.documentEditorSettings.fontFamilies;
        }
        if (this.documentEditorSettings.collaborativeEditingSettings) {
            this.documentEditor.documentEditorSettings.collaborativeEditingSettings = this.documentEditorSettings.collaborativeEditingSettings;
        }
        if(this.documentEditorSettings.printDevicePixelRatio) {
            this.documentEditor.documentEditorSettings.printDevicePixelRatio = this.documentEditorSettings.printDevicePixelRatio;
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
            modules.push({
                member: 'toolbar', args: [this]
            });
        }
        return modules;
    }

    private initContainerElement(): void {
        // Toolbar container
        let isRtl: boolean = this.enableRtl;
        this.containerTarget = this.createElement('div', { className: 'e-de-ctn' });
        this.createToolbarContainer(isRtl);
        let propertiesPaneContainerBorder: string;
        if (!isRtl) {
            propertiesPaneContainerBorder = 'e-de-pane';
        } else {
            propertiesPaneContainerBorder = 'e-de-pane-rtl';
        }
        this.propertiesPaneContainer = this.createElement('div', { className: propertiesPaneContainerBorder, styles: 'display:none' });
        this.editorContainer.appendChild(this.propertiesPaneContainer);
        this.containerTarget.appendChild(this.editorContainer);
        this.statusBarElement = this.createElement('div', { className: 'e-de-status-bar' });
        if (isRtl) {
            this.statusBarElement.style.direction = 'rtl';
        }
        this.containerTarget.appendChild(this.statusBarElement);
        this.element.appendChild(this.containerTarget);
    }
    private createToolbarContainer(isRtl: boolean, isCustom?: boolean): void {
        if (isNullOrUndefined((this.editorContainer))) {
            this.editorContainer = this.createElement('div', { className: 'e-de-tool-ctnr-properties-pane' + (isRtl ? ' e-de-ctnr-rtl' : '') });
        }
        if (this.enableToolbar) {
            this.toolbarContainer = this.createElement('div', { className: 'e-de-ctnr-toolbar' + (isRtl ? ' e-de-ctnr-rtl' : '') });
            if (isCustom) {
                this.containerTarget.insertBefore(this.toolbarContainer, this.containerTarget.firstChild);
            } else {
                this.containerTarget.appendChild(this.toolbarContainer);
            }
            this.editorContainer.classList.remove('e-de-ctnr-properties-pane');
            this.editorContainer.classList.add('e-de-tool-ctnr-properties-pane');
        } else {
            this.editorContainer.classList.remove('e-de-tool-ctnr-properties-pane');
            this.editorContainer.classList.add('e-de-ctnr-properties-pane');
        }
    }
    private initializeDocumentEditor(): void {
        let id: string = this.element.id + '_editor';
        let documentEditorTarget: HTMLElement = this.createElement('div', { id: id, styles: 'width:100%;height:100%' });
        this.documentEditorInternal = new DocumentEditor({
            isReadOnly: false, enableRtl: this.enableRtl,
            selectionChange: this.onSelectionChange.bind(this),
            contentChange: this.onContentChange.bind(this),
            documentChange: this.onDocumentChange.bind(this),
            requestNavigate: this.onRequestNavigate.bind(this),
            viewChange: this.onViewChange.bind(this),
            customContextMenuSelect: this.onCustomContextMenuSelect.bind(this),
            customContextMenuBeforeOpen: this.onCustomContextMenuBeforeOpen.bind(this),
            beforePaneSwitch: this.onBeforePaneSwitch.bind(this),
            commentBegin: this.onCommentBegin.bind(this),
            commentEnd: this.onCommentEnd.bind(this),
            commentDelete: this.onCommentDelete.bind(this),
            beforeCommentAction: this.onCommentAction.bind(this),
            trackChange: this.onTrackChange.bind(this),
            serviceFailure: this.fireServiceFailure.bind(this),
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
            showRevisions: this.enableTrackChanges,
            enableLockAndEdit: this.enableLockAndEdit
        });
        this.wireEvents();
        this.documentEditor.enableAllModules();
        this.documentEditor.enableComment = this.enableComment;
        this.editorContainer.insertBefore(documentEditorTarget, this.editorContainer.firstChild);
        this.setFormat();
        this.documentEditor.appendTo(documentEditorTarget);
        this.documentEditor.resize();
    }
    private wireEvents(): void{
        this.documentEditor.on(internalZoomFactorChange, this.onZoomFactorChange, this);
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
    }
    private onCommentBegin(): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableInsertComment(false);
        }
    }
    private onCommentEnd(): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableInsertComment(true && this.enableComment);
        }
    }
    private onCommentDelete(args: CommentDeleteEventArgs): void {
        this.trigger(commentDeleteEvent, args);
    }
    private onCommentAction(args: CommentActionEventArgs): void {
        this.trigger(beforeCommentActionEvent, args);
    }
    private onTrackChange(args: TrackChangeEventArgs): void {
        this.trigger(trackChangeEvent, args);
        if (this.toolbarModule) {
            this.toolbarModule.toggleTrackChanges(args.isTrackChangesEnabled);
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
        this.propertiesPaneContainer.style.display = show ? 'block' : 'none';
        if (this.toolbarModule) {
            this.toolbarModule.propertiesPaneButton.element.style.opacity = show ? '1' : '0.5';
        }
        this.documentEditor.resize();

    }
    /**
     * Resizes the container component and its sub elements based on given size or client size.
     * @param width 
     * @param height 
     */
    public resize(width?: number, height?: number): void {
        if (this.element) {
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
            if (this.documentEditor) {
                this.documentEditor.resize();
            }
            if (this.toolbarModule) {
                this.toolbarModule.toolbar.refreshOverflow();
            }
        }
    }
    /**
     * @private
     */
    public onContentChange(): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableUndoRedo();
        }
        if (this.statusBar) {
            this.statusBar.updatePageCount();
        }
        let eventArgs: ContainerContentChangeEventArgs = { source: this };
        this.trigger(contentChangeEvent, eventArgs);
    }
    /**
     * @private
     */
    public onDocumentChange(): void {
        this.enableTrackChanges = this.documentEditor.enableTrackChanges;

        if (this.toolbarModule) {
            this.toolbarModule.isCommentEditing = false;
            this.toolbarModule.enableDisableInsertComment(true);
            this.toolbarModule.enableDisableUndoRedo();
        }
        if (this.textProperties) {
            this.textProperties.updateStyles();
        }
        if (this.statusBar) {
            this.statusBar.updatePageCount();
        }
        let eventArgs: ContainerDocumentChangeEventArgs = { source: this };
        this.trigger(documentChangeEvent, eventArgs);
    }
    /**
     * @private
     */
    public onSelectionChange(): void {
        setTimeout(() => {
            this.showPropertiesPaneOnSelection();
            let eventArgs: ContainerSelectionChangeEventArgs = { source: this };
            this.trigger(selectionChangeEvent, eventArgs);
        });
    }
    /**
     * @private
     */
    private onZoomFactorChange(): void {
        if (this.statusBar) {
            this.statusBar.updateZoomContent();
        }
    }
    /**
     * @private
     */
    private onRequestNavigate(args: RequestNavigateEventArgs): void {
        if (args.linkType !== 'Bookmark') {
            let link: string = args.navigationLink;
            if (args.localReference.length > 0) {
                link += '#' + args.localReference;
            }
            window.open(link);
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
    public showPropertiesPaneOnSelection(): void {
        if ((this.restrictEditing || this.textProperties === undefined) && !this.showPropertiesPane) {
            return;
        }
        let isProtectedDocument: boolean = this.documentEditor.documentHelper.protectionType !== 'NoProtection';
        let allowFormatting: boolean = isProtectedDocument && this.documentEditor.documentHelper.restrictFormatting;
        let isSelectionInProtectecRegion: boolean = this.documentEditor.editor.restrictEditing;

        if (isProtectedDocument) {
            if (this.toolbarModule) {
                this.toolbarModule.enableDisableToolBarItem(!isSelectionInProtectecRegion, true);
            }
            this.textProperties.enableDisableElements(!allowFormatting && !isSelectionInProtectecRegion);
            this.tableProperties.enableDisableElements(!allowFormatting && !isSelectionInProtectecRegion);
            this.tocProperties.enableDisableElements(!isSelectionInProtectecRegion);
            this.headerFooterProperties.enableDisableElements(!isSelectionInProtectecRegion);
            this.imageProperties.enableDisableElements(!isSelectionInProtectecRegion);
        } else {
            let isReadOnly: boolean = !this.documentEditor.isReadOnly;
            if (this.toolbarModule) {
                this.toolbarModule.enableDisableToolBarItem(isReadOnly, true || this.showPropertiesPane);
            }
            this.textProperties.enableDisableElements(isReadOnly || this.showPropertiesPane);
            this.tableProperties.enableDisableElements(true);
            this.tocProperties.enableDisableElements(true);
            this.headerFooterProperties.enableDisableElements(true);
            this.imageProperties.enableDisableElements(true);
        }

        let currentContext: string = this.documentEditor.selection.contextType;
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
            } else if (currentContext.indexOf('List') >= 0 || currentContext.indexOf('Text') >= 0
                && currentContext.indexOf('Table') < 0) {
                this.showProperties('text');
            } else if (currentContext.indexOf('Image') >= 0) {
                this.showProperties('image');
            } else if (currentContext.indexOf('TableOfContents') >= 0) {
                this.showProperties('toc');
            } else if (currentContext.indexOf('Table') >= 0) {
                this.showProperties('table');
            }
        }
        this.previousContext = this.documentEditor.selection.contextType;
        if (this.toolbarModule && this.toolbarModule.toolbar) {
            this.toolbarModule.enableDisableInsertComment(!this.documentEditor.enableHeaderAndFooter && this.enableComment && !this.documentEditor.isReadOnlyMode);
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
        this.textProperties.showTextProperties(property === 'text');
        this.tableProperties.showTableProperties(property === 'table');
        this.imageProperties.showImageProperties(property === 'image');
        this.headerFooterProperties.showHeaderFooterPane(property === 'headerfooter');
        this.tocProperties.showTocPane(property === 'toc');
    }

    /**
     * Set the default character format for document editor container
     * @param characterFormat
     */
    public setDefaultCharacterFormat(characterFormat: CharacterFormatProperties): void {
        this.characterFormat = characterFormat;
    }

    /**
     * Set the default paragraph format for document editor container
     * @param paragraphFormat
     */
    public setDefaultParagraphFormat(paragraphFormat: ParagraphFormatProperties): void {
        this.paragraphFormat = paragraphFormat;
    }

    /**
     * Set the default section format for document editor container
     * @param sectionFormat
     */
    public setDefaultSectionFormat(sectionFormat: SectionFormatProperties): void {
        this.sectionFormat = sectionFormat;
    }

    /**
     * Destroys all managed resources used by this object. 
     */
    public destroy(): void {
        super.destroy();
        if (this.element) {
            this.element.innerHTML = '';
        }
        if (!this.refreshing) {
            this.element.classList.remove('e-documenteditorcontainer');
            this.element = undefined;            
        }
        if (this.toolbarContainer && this.toolbarContainer.parentElement) {
            this.toolbarContainer.innerHTML = '';
            this.toolbarContainer.parentElement.removeChild(this.toolbarContainer);
        }
        this.toolbarContainer = undefined;
        if (this.documentEditorInternal) {
            this.unWireEvents();
            this.documentEditorInternal.destroy();
        }
        this.documentEditorInternal = undefined;
        if (this.textProperties) {
            this.textProperties.destroy();
        }
        this.textProperties = undefined;
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
        if (this.propertiesPaneContainer && this.editorContainer.parentElement) {
            this.propertiesPaneContainer.innerHTML = '';
            this.propertiesPaneContainer.parentElement.removeChild(this.propertiesPaneContainer);
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
        this.unWireEvents();
    }
}