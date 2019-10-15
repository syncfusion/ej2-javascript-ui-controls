// tslint:disable-next-line:max-line-length
import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, ModuleDeclaration, L10n, isBlazor } from '@syncfusion/ej2-base';
import { Event, EmitType } from '@syncfusion/ej2-base';
import { Toolbar } from './tool-bar/tool-bar';
import { DocumentEditorContainerModel } from './document-editor-container-model';
import { DocumentEditor } from '../document-editor/document-editor';
import { TextProperties } from './properties-pane/text-properties-pane';
import { HeaderFooterProperties } from './properties-pane/header-footer-pane';
import { ImageProperties } from './properties-pane/image-properties-pane';
import { TocProperties } from './properties-pane/table-of-content-pane';
import { TableProperties } from './properties-pane/table-properties-pane';
import { StatusBar } from './properties-pane/status-bar';
// tslint:disable-next-line:max-line-length
import { ViewChangeEventArgs, RequestNavigateEventArgs, ContainerContentChangeEventArgs, ContainerSelectionChangeEventArgs, ContainerDocumentChangeEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs } from '../document-editor/base';
import { createSpinner } from '@syncfusion/ej2-popups';
import { ContainerServerActionSettingsModel } from '../document-editor/document-editor-model';
import { CharacterFormatProperties, ParagraphFormatProperties } from '../document-editor/implementation';

/**
 * Document Editor container component.
 */
@NotifyPropertyChanges
export class DocumentEditorContainer extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Show or hide properties pane.
     * @default true
     */
    @Property(true)
    public showPropertiesPane: boolean;
    /**
     * Enable or disable toolbar in document editor container.
     * @default true
     */
    @Property(true)
    public enableToolbar: boolean;
    /**
     * Restrict editing operation.
     * @default false
     */
    @Property(false)
    public restrictEditing: boolean;
    /**
     * Enable or disable spell checker in document editor container.
     * @default false
     */
    @Property(false)
    public enableSpellCheck: boolean;
    /**
     * Enable local paste
     * @default true
     */
    @Property(true)
    public enableLocalPaste: boolean;
    /**
     * Sfdt service URL.
     * @default ''
     */
    @Property()
    public serviceUrl: string;
    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     * @default 2000
     */
    @Property(2000)
    public zIndex: number;
    /**
     * Triggers when the component is created
     * @event
     * @blazorproperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     * @event
     * @blazorproperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers whenever the content changes in the document editor container.
     * @event
     * @blazorproperty 'ContentChanged'
     */
    @Event()
    public contentChange: EmitType<ContainerContentChangeEventArgs>;
    /**
     * Triggers whenever selection changes in the document editor container.
     * @event
     * @blazorproperty 'SelectionChanged'
     */
    @Event()
    public selectionChange: EmitType<ContainerSelectionChangeEventArgs>;
    /**
     * Triggers whenever document changes in the document editor container.
     * @event
     * @blazorproperty 'DocumentChanged'
     */
    @Event()
    public documentChange: EmitType<ContainerDocumentChangeEventArgs>;
    /**
     * Triggers while selecting the custom context-menu option.
     * @event
     * @blazorproperty 'ContextMenuItemSelected'
     */
    @Event()
    public customContextMenuSelect: EmitType<CustomContentMenuEventArgs>;
    /**
     * Triggers before opening the custom context-menu option.
     * @event
     * @blazorproperty 'OnContextMenuOpen'
     */
    @Event()
    public customContextMenuBeforeOpen: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;

    /**
     * Document editor container's toolbar module
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
     * @private
     */
    public textProperties: TextProperties;
    /**
     * Header footer Properties
     * @private
     */
    public headerFooterProperties: HeaderFooterProperties;
    /**
     * Image Properties Pane
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
     * Defines the settings of the DocumentEditorContainer service.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ import: 'Import', systemClipboard: 'SystemClipboard', spellCheck: 'SpellCheck', restrictEditing: 'RestrictEditing' })
    public serverActionSettings: ContainerServerActionSettingsModel;
    /**
     * Gets DocumentEditor instance.
     * @aspType DocumentEditor
     * @blazorType DocumentEditor
     */
    public get documentEditor(): DocumentEditor {
        return this.documentEditorInternal;
    }
    /** 
     * Initialize the constructor of DocumentEditorContainer
     */
    constructor(options?: DocumentEditorContainerModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * default locale
     * @private
     */
    public defaultLocale: Object = {
        'New': 'New',
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
        'Section Break': 'Section Break',
        'Header & Footer': 'Header & Footer',
        'Options': 'Options',
        'Levels': 'Levels',
        'Different First Page': 'Different First Page',
        'Different header and footer for odd and even pages.': 'Different header and footer for odd and even pages.',
        'Different Odd & Even Pages': 'Different Odd & Even Pages',
        'Different header and footer for first page.': 'Different header and footer for first page.',
        'Position': 'Position',
        'Header from Top': 'Header from Top',
        'Footer from Bottom': 'Footer from Bottom',
        'Distance from top of the page to top of the header.': 'Distance from top of the page to top of the header.',
        'Distance from bottom of the page to bottom of the footer.': 'Distance from bottom of the page to bottom of the footer.',
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
        'Insert / Delete': 'Insert / Delete',
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
        // tslint:disable-next-line:max-line-length
        'Number of heading or outline levels to be shown in table of contents.': 'Number of heading or outline levels to be shown in table of contents.',
        'Show page numbers': 'Show page numbers',
        'Show page numbers in table of contents.': 'Show page numbers in table of contents.',
        'Right align page numbers': 'Right align page numbers',
        'Right align page numbers in table of contents.': 'Right align page numbers in table of contents.',
        'Use hyperlinks': 'Use hyperlinks',
        'Use hyperlinks instead of page numbers.': 'Use hyperlinks instead of page numbers.',
        'Font': 'Font',
        'Font Size': 'Font Size',
        'Font color': 'Font color',
        'Text highlight color': 'Text highlight color',
        'Clear all formatting': 'Clear all formatting',
        'Bold (Ctrl+B)': 'Bold (Ctrl+B)',
        'Italic (Ctrl+I)': 'Italic (Ctrl+I)',
        'Underline (Ctrl+U)': 'Underline (Ctrl+U)',
        'Strikethrough': 'Strikethrough',
        'Superscript (Ctrl+Shift++)': 'Superscript (Ctrl+Shift++)',
        'Subscript (Ctrl+=)': 'Subscript (Ctrl+=)',
        'Align left (Ctrl+L)': 'Align left (Ctrl+L)',
        'Center (Ctrl+E)': 'Center (Ctrl+E)',
        'Align right (Ctrl+R)': 'Align right (Ctrl+R)',
        'Justify (Ctrl+J)': 'Justify (Ctrl+J)',
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
        'Underline errors': 'Underline errors',
        'Fit page width': 'Fit page width',
        'Update': 'Update',
        'Cancel': 'Cancel',
        'Insert': 'Insert',
        'No Border': 'No Border',
        'Create a new document.': 'Create a new document.',
        'Open a document.': 'Open a document.',
        'Undo the last operation (Ctrl+Z).': 'Undo the last operation (Ctrl+Z).',
        'Redo the last operation (Ctrl+Y).': 'Redo the last operation (Ctrl+Y).',
        'Insert inline picture from a file.': 'Insert inline picture from a file.',
        'Insert a table into the document': 'Insert a table into the document',
        // tslint:disable-next-line:max-line-length
        'Create a link in your document for quick access to web pages and files (Ctrl+K).': 'Create a link in your document for quick access to web pages and files (Ctrl+K).',
        'Insert a bookmark in a specific place in this document.': 'Insert a bookmark in a specific place in this document.',
        // tslint:disable-next-line:max-line-length
        'Provide an overview of your document by adding a table of contents.': 'Provide an overview of your document by adding a table of contents.',
        'Add or edit the header.': 'Add or edit the header.',
        'Add or edit the footer.': 'Add or edit the footer.',
        'Open the page setup dialog.': 'Open the page setup dialog.',
        'Add page numbers.': 'Add page numbers.',
        'Find text in the document (Ctrl+F).': 'Find text in the document (Ctrl+F).',
        'Toggle between the internal clipboard and system clipboard': 'Toggle between the internal clipboard and system clipboard.</br>' +
            'Access to system clipboard through script is denied due to browsers security policy. Instead, </br>' +
            ' 1. You can enable internal clipboard to cut, copy and paste within the component.</br>' +
            ' 2. You can use the keyboard shortcuts (Ctrl+X, Ctrl+C and Ctrl+V) to cut, copy and paste with system clipboard.',
        'Restrict editing.': 'Restrict editing.',
        // tslint:disable-next-line:max-line-length
        'The current page number in the document. Click or tap to navigate specific page.': 'The current page number in the document. Click or tap to navigate specific page.',
        'Read only': 'Read only',
        'Protections': 'Protections',
        'Error in establishing connection with web server': 'Error in establishing connection with web server',
        'Single': 'Single',
        'Double': 'Double'
    };

    /**
     * @private
     */
    public getModuleName(): string {
        return 'DocumentEditorContainer';
    }

    /**
     * @private
     */
    public onPropertyChanged(newModel: DocumentEditorContainerModel, oldModel: DocumentEditorContainerModel): void {
        for (let prop of Object.keys(newModel)) {
            switch (prop) {
                case 'restrictEditing':
                    if (this.toolbarModule) {
                        this.toolbarModule.enableDisableToolBarItem(!newModel.restrictEditing, false);
                    }
                    this.documentEditor.isReadOnly = newModel.restrictEditing;
                    break;
                case 'showPropertiesPane':
                    this.showHidePropertiesPane(newModel.showPropertiesPane);
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
            this.toolbarModule.initToolBar();
        }
        if (this.element.getBoundingClientRect().height < 320) {
            this.element.style.height = '320px';
        }
        this.element.style.minHeight = '320px';
        this.initializeDocumentEditor();
        this.textProperties = new TextProperties(this, this.element.id, false, this.enableRtl);
        this.headerFooterProperties = new HeaderFooterProperties(this, this.enableRtl);
        this.imageProperties = new ImageProperties(this, this.enableRtl);
        this.tocProperties = new TocProperties(this, this.enableRtl);
        this.tableProperties = new TableProperties(this, this.imageProperties, this.textProperties, this.enableRtl);
        this.statusBar = new StatusBar(this.statusBarElement, this);
        // Waiting popup
        createSpinner({ target: this.containerTarget, cssClass: 'e-spin-overlay' });
        this.setserverActionSettings();
        this.renderComplete();
    }

    private setFormat(): void {
        if (this.characterFormat) {
            this.documentEditor.setDefaultCharacterFormat(this.characterFormat);
        }
        if (this.paragraphFormat) {
            this.documentEditor.setDefaultParagraphFormat(this.paragraphFormat);
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
    }
    /**
     * @private
     */
    public getPersistData(): string {
        return 'documenteditor-container';
    }

    //tslint:disable: max-func-body-length
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
        if (this.enableToolbar) {
            this.toolbarContainer = this.createElement('div', { className: 'e-de-ctnr-toolbar' + (isRtl ? ' e-de-ctnr-rtl' : '') });
            this.containerTarget.appendChild(this.toolbarContainer);
            // tslint:disable-next-line:max-line-length
            this.editorContainer = this.createElement('div', { className: 'e-de-tool-ctnr-properties-pane' + (isRtl ? ' e-de-ctnr-rtl' : '') });
        } else {
            this.editorContainer = this.createElement('div', { className: 'e-de-ctnr-properties-pane' + (isRtl ? ' e-de-ctnr-rtl' : '') });
        }
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

    private initializeDocumentEditor(): void {
        let id: string = this.element.id + '_editor';
        let documentEditorTarget: HTMLElement = this.createElement('div', { id: id, styles: 'width:100%;height:100%' });
        this.documentEditorInternal = new DocumentEditor({
            isReadOnly: false, enableRtl: this.enableRtl,
            selectionChange: this.onSelectionChange.bind(this),
            contentChange: this.onContentChange.bind(this),
            documentChange: this.onDocumentChange.bind(this),
            zoomFactorChange: this.onZoomFactorChange.bind(this),
            requestNavigate: this.onRequestNavigate.bind(this),
            viewChange: this.onViewChange.bind(this),
            customContextMenuSelect: this.onCustomContextMenuSelect.bind(this),
            customContextMenuBeforeOpen: this.onCustomContextMenuBeforeOpen.bind(this),
            locale: this.locale,
            acceptTab: true,
            zIndex: this.zIndex,
            enableLocalPaste: this.enableLocalPaste,
            pageOutline: '#E0E0E0'
        });
        this.documentEditor.enableAllModules();
        this.editorContainer.insertBefore(documentEditorTarget, this.editorContainer.firstChild);
        this.setFormat();
        this.documentEditor.appendTo(documentEditorTarget);
        this.documentEditor.resize();
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
     * @private
     */
    public onContentChange(): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableUndoRedo();
        }
        if (this.statusBar) {
            this.statusBar.updatePageCount();
        }
        let eventArgs: ContainerContentChangeEventArgs = { source: isBlazor() ? null : this };
        this.trigger('contentChange', eventArgs);
    }
    /**
     * @private
     */
    public onDocumentChange(): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableUndoRedo();
        }
        if (this.textProperties) {
            this.textProperties.updateStyles();
        }
        if (this.statusBar) {
            this.statusBar.updatePageCount();
        }
        let eventArgs: ContainerDocumentChangeEventArgs = { source: isBlazor() ? null : this };
        this.trigger('documentChange', eventArgs);
    }
    /**
     * @private
     */
    public onSelectionChange(): void {
        setTimeout(() => {
            this.showPropertiesPaneOnSelection();
            let eventArgs: ContainerSelectionChangeEventArgs = { source: isBlazor() ? null : this };
            this.trigger('selectionChange', eventArgs);
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
        this.trigger('customContextMenuSelect', args);
    }
    /**
     * @private
     */
    private onCustomContextMenuBeforeOpen(args: BeforeOpenCloseCustomContentMenuEventArgs): void {
        this.trigger('customContextMenuBeforeOpen', args);
    }
    /**
     * @private
     */
    public showPropertiesPaneOnSelection(): void {
        if (this.restrictEditing) {
            return;
        }
        let isProtectedDocument: boolean = this.documentEditor.viewer.protectionType === 'ReadOnly';
        let allowFormatting: boolean = isProtectedDocument && this.documentEditor.viewer.restrictFormatting;
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
                this.toolbarModule.enableDisableToolBarItem(isReadOnly, true);
            }
            this.textProperties.enableDisableElements(isReadOnly);
            this.tableProperties.enableDisableElements(true);
            this.tocProperties.enableDisableElements(true);
            this.headerFooterProperties.enableDisableElements(true);
            this.imageProperties.enableDisableElements(true);
        }

        let currentContext: string = this.documentEditor.selection.contextType;
        let isInHeaderFooter: boolean = currentContext.indexOf('Header') >= 0
            || currentContext.indexOf('Footer') >= 0;
        if (!this.showPropertiesPane) {
            this.showHidePropertiesPane(false);
            this.propertiesPaneContainer.style.display = 'none';
        } else {
            this.propertiesPaneContainer.style.display = 'block';
            if (isInHeaderFooter) {
                this.showProperties('headerfooter');
            } else if (currentContext.indexOf('Text') >= 0
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
     * Destroys all managed resources used by this object. 
     */
    public destroy(): void {
        super.destroy();
        if (this.toolbarContainer && this.toolbarContainer.parentElement) {
            this.toolbarContainer.innerHTML = '';
            this.toolbarContainer.parentElement.removeChild(this.toolbarContainer);
        }
        this.toolbarContainer = undefined;
        if (this.documentEditorInternal) {
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

    }
}