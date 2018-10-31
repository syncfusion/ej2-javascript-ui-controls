import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration } from '@syncfusion/ej2-base';
import { isNullOrUndefined, L10n, setCulture, EmitType, Browser } from '@syncfusion/ej2-base';
import { Save } from '@syncfusion/ej2-file-utils';
import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle } from './index';
import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs } from './index';
import { LayoutViewer, PageLayoutViewer, BulletsAndNumberingDialog } from './index';
import { Print, SearchResultsChangeEventArgs } from './index';
import { Page, BodyWidget, ParagraphWidget } from './index';
import { WSectionFormat, WParagraphFormat, WCharacterFormat } from './index';
import { SfdtReader } from './index';
import { Selection } from './index';
import { TextPosition } from './index';
import { Editor, EditorHistory } from './index';
import { WStyles } from './index';
import { HeaderFooters } from './index';
import { Search } from './index';
import { OptionsPane } from './index';
import { WordExport } from './index';
import { TextExport } from './index';
import { FormatType, PageFitType, DialogType } from './index';
import { ContextMenu } from './index';
import { ImageResizer } from './index';
import { SfdtExport } from './index';
import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';
import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';
import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';
import { DocumentEditorModel } from './document-editor-model';

/**
 * The Document editor component is used to draft, save or print rich text contents as page by page.
 */
@NotifyPropertyChanges
export class DocumentEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    //Internal Variable
    private enableHeaderFooterIn: boolean = false;
    /**
     * @private
     */
    get enableHeaderAndFooter(): boolean {
        return this.enableHeaderFooterIn;
    }
    set enableHeaderAndFooter(value: boolean) {
        this.enableHeaderFooterIn = value;
        this.viewer.updateScrollBars();
    }
    /**
     * @private
     */
    public viewer: LayoutViewer;
    /**
     * @private
     */
    public isShiftingEnabled: boolean = false;
    /**
     * @private
     */
    public isLayoutEnabled: boolean = true;
    /**
     * @private
     */
    public isPastingContent: boolean = false;
    /**
     * @private
     */
    public parser: SfdtReader = undefined;
    private isDocumentLoadedIn: boolean;
    private disableHistoryIn: boolean = false;
    /**
     * @private
     */
    public findResultsList: string[] = undefined;
    /**
     * Gets or sets the name of the document.    
     */
    public documentName: string = '';
    //Module Declaration
    /**
     * @private
     */
    public printModule: Print;
    /**
     * @private
     */
    public sfdtExportModule: SfdtExport;
    /**
     * @private
     */
    public selectionModule: Selection;
    /**
     * @private
     */
    public editorModule: Editor;
    /**
     * @private
     */
    public wordExportModule: WordExport;
    /**
     * @private
     */
    public textExportModule: TextExport;
    /**
     * @private
     */
    public editorHistoryModule: EditorHistory;
    /**
     * @private
     */
    public tableOfContentsDialogModule: TableOfContentsDialog;
    /**
     * @private
     */
    public tablePropertiesDialogModule: TablePropertiesDialog = undefined;
    /**
     * @private
     */
    public bordersAndShadingDialogModule: BordersAndShadingDialog = undefined;
    /**
     * @private
     */
    public listDialogModule: ListDialog;
    /**
     * @private
     */
    public styleDialogModule: StyleDialog;
    /**
     * @private
     */
    public cellOptionsDialogModule: CellOptionsDialog = undefined;
    /**
     * @private
     */
    public tableOptionsDialogModule: TableOptionsDialog = undefined;
    /**
     * @private
     */
    public tableDialogModule: TableDialog;
    /**
     * @private
     */
    public pageSetupDialogModule: PageSetupDialog;
    /**
     * @private
     */
    public paragraphDialogModule: ParagraphDialog = undefined;
    /**
     * @private
     */
    public optionsPaneModule: OptionsPane;
    /**
     * @private
     */
    public hyperlinkDialogModule: HyperlinkDialog;
    /**
     * @private
     */
    public bookmarkDialogModule: BookmarkDialog;
    /**
     * @private
     */
    public stylesDialogModule: StylesDialog;
    /**
     * @private
     */
    public contextMenuModule: ContextMenu;
    /**
     * @private
     */
    public imageResizerModule: ImageResizer = undefined;
    /**
     * @private
     */
    public searchModule: Search;

    // Public Implementation Starts
    /**
     * Gets or sets the zoom factor in document editor.
     * @default 1
     */
    @Property(1)
    public zoomFactor: number;
    /**
     * Gets or sets a value indicating whether the document editor is in read only state or not.
     * @default true
     */
    @Property(true)
    public isReadOnly: boolean;
    /**
     * Gets or sets a value indicating whether print needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enablePrint: boolean;
    /**
     * Gets or sets a value indicating whether selection needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableSelection: boolean;
    /**
     * Gets or sets a value indicating whether editor needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableEditor: boolean;
    /**
     * Gets or sets a value indicating whether editor history needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableEditorHistory: boolean;
    /**
     * Gets or sets a value indicating whether Sfdt export needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableSfdtExport: boolean;
    /**
     * Gets or sets a value indicating whether word export needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableWordExport: boolean;
    /**
     * Gets or sets a value indicating whether text export needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableTextExport: boolean;
    /**
     * Gets or sets a value indicating whether options pane is enabled or not.
     * @default false
     */
    @Property(false)
    public enableOptionsPane: boolean;
    /**
     * Gets or sets a value indicating whether context menu is enabled or not.
     * @default false
     */
    @Property(false)
    public enableContextMenu: boolean;
    /**
     * Gets or sets a value indicating whether hyperlink dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableHyperlinkDialog: boolean;
    /**
     * Gets or sets a value indicating whether bookmark dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableBookmarkDialog: boolean;
    /**
     * Gets or sets a value indicating whether table of contents dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableTableOfContentsDialog: boolean;
    /**
     * Gets or sets a value indicating whether search module is enabled or not.
     * @default false
     */
    @Property(false)
    public enableSearch: boolean;
    /**
     * Gets or sets a value indicating whether paragraph dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableParagraphDialog: boolean;
    /**
     * Gets or sets a value indicating whether list dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableListDialog: boolean;
    /**
     * Gets or sets a value indicating whether table properties dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableTablePropertiesDialog: boolean;
    /**
     * Gets or sets a value indicating whether borders and shading dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableBordersAndShadingDialog: boolean;
    /**
     * Gets or sets a value indicating whether margin dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enablePageSetupDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableStyleDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableFontDialog: boolean;
    /**
     * @private
     */
    public fontDialogModule: FontDialog;
    /**
     * Gets or sets a value indicating whether table options dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableTableOptionsDialog: boolean;
    /**
     * Gets or sets a value indicating whether table dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableTableDialog: boolean;
    /**
     * Gets or sets a value indicating whether image resizer is enabled or not.
     * @default false
     */
    @Property(false)
    public enableImageResizer: boolean;
    /**
     * Triggers whenever document changes in the document editor.
     * @event
     */
    @Event()
    public documentChange: EmitType<DocumentChangeEventArgs>;
    /**
     * Triggers whenever container view changes in the document editor.
     * @event
     */
    @Event()
    public viewChange: EmitType<ViewChangeEventArgs>;
    /**
     * Triggers whenever zoom factor changes in the document editor.
     * @event
     */
    @Event()
    public zoomFactorChange: EmitType<ZoomFactorChangeEventArgs>;
    /**
     * Triggers whenever selection changes in the document editor.
     * @event
     */
    @Event()
    public selectionChange: EmitType<SelectionChangeEventArgs>;
    /**
     * Triggers whenever hyperlink is clicked or tapped in the document editor.
     * @event
     */
    @Event()
    public requestNavigate: EmitType<RequestNavigateEventArgs>;
    /**
     * Triggers whenever content changes in the document editor.
     * @event
     */
    @Event()
    public contentChange: EmitType<ContentChangeEventArgs>;
    /**
     * Triggers whenever key is pressed in the document editor.
     * @event
     */
    @Event()
    public keyDown: EmitType<DocumentEditorKeyDownEventArgs>;
    /**
     * Triggers whenever search results changes in the document editor.
     * @event
     */
    @Event()
    public searchResultsChange: EmitType<SearchResultsChangeEventArgs>;
    /**
     * Triggers when the component is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Gets or Sets a value indicating whether tab key can be accepted as input or not.
     * @default false
     */
    public acceptTab: boolean;
    /**
     * Gets or Sets a value indicating whether holding Ctrl key is required to follow hyperlink on click. The default value is true.
     */
    public useCtrlClickToFollowHyperlink​​​: boolean = true;
    /**
     * Gets or sets the page outline color.
     */
    public pageOutline: string = '#000000';
    /**
     * Gets or sets a value indicating whether to enable cursor in document editor on read only state or not. The default value is false.
     */
    public enableCursorOnReadOnly: boolean = false;
    /**
     * Gets or sets a value indicating whether local paste needs to be enabled or not.
     */
    public enableLocalPaste: boolean = false;
    /**
     * Gets the total number of pages.
     */
    get pageCount(): number {
        if (!this.isDocumentLoaded || isNullOrUndefined(this.viewer)) {
            return 1;
        }
        return this.viewer.pages.length;
    }
    /**
     *  Gets the selection object of the document editor.
     * @returns Selection
     * @default undefined
     */
    get selection(): Selection {
        return this.selectionModule;
    }
    /**
     *  Gets the editor object of the document editor.
     * @returns Editor
     * @default undefined
     */
    get editor(): Editor {
        return this.editorModule;
    }
    /** 
     * Gets the editor history object of the document editor.
     * @returns EditorHistory
     */
    get editorHistory(): EditorHistory {
        return this.editorHistoryModule;
    }
    /** 
     * Gets the search object of the document editor.
     * @returns { Search }
     */
    get search(): Search {
        return this.searchModule;
    }
    /**
     * Gets the context menu object of the document editor.
     * @returns ContextMenu
     */
    get contextMenu(): ContextMenu {
        return this.contextMenuModule;
    }
    /**
     * @private
     */
    get containerId(): string {
        return this.element.id;
    }
    /**
     * @private
     */
    get isDocumentLoaded(): boolean {
        return this.isDocumentLoadedIn;
    }
    set isDocumentLoaded(value: boolean) {
        this.isDocumentLoadedIn = value;
    }
    /**
     * Determines whether history needs to be enabled or not.
     * @default - false
     * @private
     */
    get enableHistoryMode(): boolean {
        return this.enableEditorHistory && !isNullOrUndefined(this.editorHistoryModule);
    }
    /**
     * Gets the start text position in the document.
     * @default undefined
     * @private
     */
    get documentStart(): TextPosition {
        if (!isNullOrUndefined(this.selectionModule)) {
            return this.selection.getDocumentStart();
        }
        return undefined;
    }
    /**
     * Gets the end text position in the document.
     * @default undefined
     * @private
     */
    get documentEnd(): TextPosition {
        if (!isNullOrUndefined(this.selectionModule)) {
            return this.selection.getDocumentEnd();
        }
        return undefined;
    }
    /**
     * @private
     */
    get isReadOnlyMode(): boolean {
        return this.isReadOnly || isNullOrUndefined(this.editorModule) || isNullOrUndefined(this.selectionModule);
    }
    /**
     * Specifies to enable image resizer option
     * default - false
     * @private
     */
    get enableImageResizerMode(): boolean {
        return this.enableImageResizer && !isNullOrUndefined(this.imageResizerModule);
    }
    /** 
     * Initialize the constructor of DocumentEditor
     */
    constructor(options?: DocumentEditorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.viewer = new PageLayoutViewer(this);
        this.parser = new SfdtReader(this.viewer);
    }
    protected preRender(): void {
        this.findResultsList = [];
        //pre render section
    }
    protected render(): void {
        this.viewer.initializeComponents();
        this.openBlank();
        if (!isNullOrUndefined(this.element)) {
            let container: HTMLElement = this.element;
            container.style.minHeight = '200px';
            container.style.minWidth = '200px';
        }
    }
    /**
     * Get component name
     * @private
     */
    public getModuleName(): string {
        return 'DocumentEditor';
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(model: DocumentEditorModel, oldProp: DocumentEditorModel): void {
        for (let prop of Object.keys(model)) {
            switch (prop) {
                case 'zoomFactor':
                    if (this.viewer) {
                        this.viewer.zoomFactor = model.zoomFactor;
                    }
                    break;
                case 'locale':
                    this.localizeDialogs();
                    break;
                case 'isReadOnly':
                    if (!isNullOrUndefined(this.optionsPaneModule) && this.optionsPaneModule.isOptionsPaneShow) {
                        this.optionsPaneModule.showHideOptionsPane(false);
                    }
                    break;
            }
        }
    }
    private localizeDialogs(): void {
        if (this.locale !== '') {
            let l10n: L10n = new L10n('documenteditor', this.defaultLocale);
            l10n.setLocale(this.locale);
            setCulture(this.locale);
            if (this.optionsPaneModule) {
                this.optionsPaneModule.initOptionsPane(l10n);
            }
            if (this.paragraphDialogModule) {
                this.paragraphDialogModule.initParagraphDialog(l10n);
            }
            if (this.pageSetupDialogModule) {
                this.pageSetupDialogModule.initPageSetupDialog(l10n);
            }
            if (this.fontDialogModule) {
                this.fontDialogModule.initFontDialog(l10n);
            }
            if (this.hyperlinkDialogModule) {
                this.hyperlinkDialogModule.initHyperlinkDialog(l10n);
            }
            if (this.contextMenuModule) {
                this.contextMenuModule.initContextMenu(l10n);
            }
            if (this.listDialogModule) {
                this.listDialogModule.initListDialog(l10n);
            }
            if (this.tablePropertiesDialogModule) {
                this.tablePropertiesDialogModule.initTablePropertyDialog(l10n);
            }
            if (this.bordersAndShadingDialogModule) {
                this.bordersAndShadingDialogModule.initBordersAndShadingsDialog(l10n);
            }
            if (this.cellOptionsDialogModule) {
                this.cellOptionsDialogModule.initCellMarginsDialog(l10n);
            }
            if (this.tableOptionsDialogModule) {
                this.tableOptionsDialogModule.initTableOptionsDialog(l10n);
            }
            if (this.tableDialogModule) {
                this.tableDialogModule.initTableDialog(l10n);
            }
            if (this.styleDialogModule) {
                this.styleDialogModule.initStyleDialog(l10n);
            }
            if (this.tableOfContentsDialogModule) {
                this.tableOfContentsDialogModule.initTableOfContentDialog(l10n);
            }
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return 'documenteditor';
    }
    private clearPreservedCollectionsInViewer(): void {
        if (this.viewer instanceof LayoutViewer) {
            this.viewer.clearDocumentItems();
        }
    }
    /**
     * @private
     */
    public getDocumentEditorElement(): HTMLElement {
        return this.element as HTMLElement;
    }
    /**
     * @private
     */
    public fireContentChange(): void {
        let eventArgs: ContentChangeEventArgs = { source: this };
        this.trigger('contentChange', eventArgs);
    }
    /**
     * @private
     */
    public fireDocumentChange(): void {
        let eventArgs: DocumentChangeEventArgs = { source: this };
        this.trigger('documentChange', eventArgs);
    }
    /**
     * @private
     */
    public fireSelectionChange(): void {
        if (!this.viewer.isCompositionStart && Browser.isDevice && this.editorModule) {
            this.editorModule.predictText();
        }
        let eventArgs: SelectionChangeEventArgs = { source: this };
        this.trigger('selectionChange', eventArgs);
    }
    /**
     * @private
     */
    public fireZoomFactorChange(): void {
        let eventArgs: ZoomFactorChangeEventArgs = { source: this };
        this.trigger('zoomFactorChange', eventArgs);
    }
    /**
     * @private
     */
    public fireViewChange(): void {
        if (this.viewer && this.viewer.pages.length > 0) {
            if ((this.viewer as PageLayoutViewer).visiblePages.length > 0) {
                let pages: Page[] = (this.viewer as PageLayoutViewer).visiblePages;
                let eventArgs: ViewChangeEventArgs = {
                    startPage: pages[0].index + 1,
                    endPage: pages[pages.length - 1].index + 1,
                    source: this
                };
                this.trigger('viewChange', eventArgs);
            }
        }
    }
    /**
     * Shows the Paragraph dialog
     * @private
     */
    public showParagraphDialog(paragraphFormat?: WParagraphFormat): void {
        if (this.paragraphDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.paragraphDialogModule.show(paragraphFormat);
        }
    }
    /**
     * Shows the margin dialog
     * @private
     */
    public showPageSetupDialog(): void {
        if (this.pageSetupDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.pageSetupDialogModule.show();
        }
    }
    /**
     * Shows the font dialog
     * @private
     */
    public showFontDialog(characterFormat?: WCharacterFormat): void {
        if (this.fontDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.fontDialogModule.showFontDialog(characterFormat);
        }
    }
    /**
     * Shows the cell option dialog
     * @private
     */
    public showCellOptionsDialog(): void {
        if (this.cellOptionsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.cellOptionsDialogModule.show();
        }
    }
    /**
     * Shows the table options dialog.
     * @private
     */
    public showTableOptionsDialog(): void {
        if (this.tableOptionsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableOptionsDialogModule.show();
        }
    }
    /**
     * Shows insert table dialog
     * @private
     */
    public showTableDialog(): void {
        if (this.tableDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableDialogModule.show();
        }
    }
    /**
     * Shows the table of content dialog
     * @private
     */
    public showTableOfContentsDialog(): void {
        if (this.tableOfContentsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableOfContentsDialogModule.show();
        }
    }
    /* tslint:enable:no-any */
    /**
     * Shows the style dialog
     * @private
     */
    public showStyleDialog(): void {
        if (this.styleDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.styleDialogModule.show();
        }
    }
    /**
     * Shows the hyperlink dialog
     * @private
     */
    public showHyperlinkDialog(): void {
        if (this.hyperlinkDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.hyperlinkDialogModule.show();
        }
    }
    /**
     * Shows the bookmark dialog.
     * @private
     */
    public showBookmarkDialog(): void {
        if (this.bookmarkDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.bookmarkDialogModule.show();
        }
    }
    /**
     * Shows the styles dialog.
     * @private
     */
    public showStylesDialog(): void {
        if (this.stylesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.stylesDialogModule.show();
        }
    }
    /**
     * Shows the List dialog
     * @private
     */
    public showListDialog(): void {
        if (this.listDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.listDialogModule.showListDialog();
        }
    }
    /**
     * Shows the table properties dialog
     * @private
     */
    public showTablePropertiesDialog(): void {
        if (this.tablePropertiesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tablePropertiesDialogModule.show();
        }
    }
    /**
     * Shows the borders and shading dialog
     * @private
     */
    public showBordersAndShadingDialog(): void {
        if (this.bordersAndShadingDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.bordersAndShadingDialogModule.show();
        }
    }
    //tslint:disable: max-func-body-length
    protected requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: []
            });
        }
        if (this.enableSfdtExport || this.enableWordExport || this.enableTextExport || this.enableSelection || this.enableEditor) {
            modules.push({
                member: 'SfdtExport', args: [this.viewer]
            });
        }
        if (this.enableWordExport) {
            modules.push({
                member: 'WordExport', args: []
            });
        }
        if (this.enableTextExport) {
            modules.push({
                member: 'TextExport', args: []
            });
        }
        if (this.enableSelection || this.enableSearch || this.enableEditor) {
            modules.push({
                member: 'Selection', args: [this]
            });
            if (this.enableContextMenu) {
                modules.push({
                    member: 'ContextMenu', args: [this.viewer]
                });
            }
        }
        if (this.enableSearch) {
            modules.push({
                member: 'Search', args: [this]
            });
            if (this.enableOptionsPane) {
                modules.push({
                    member: 'OptionsPane', args: [this.viewer]
                });
            }
        }
        if (this.enableEditor) {
            modules.push({
                member: 'Editor', args: [this.viewer]
            });
            if (this.enableImageResizer) {
                modules.push({
                    member: 'ImageResizer', args: [this, this.viewer]
                });
            }
            if (this.enableEditorHistory) {
                modules.push({
                    member: 'EditorHistory', args: [this]
                });
            }
            if (this.enableHyperlinkDialog) {
                modules.push({
                    member: 'HyperlinkDialog', args: [this.viewer]
                });
            }
            if (this.enableTableDialog) {
                modules.push({
                    member: 'TableDialog', args: [this.viewer]
                });
            }
            if (this.enableBookmarkDialog) {
                modules.push({
                    member: 'BookmarkDialog', args: [this.viewer]
                });
            }
            if (this.enableTableOfContentsDialog) {
                modules.push({
                    member: 'TableOfContentsDialog', args: [this.viewer]
                });
            }
            if (this.enablePageSetupDialog) {
                modules.push({
                    member: 'PageSetupDialog', args: [this.viewer]
                });
            }
            if (this.enableStyleDialog) {
                modules.push({
                    member: 'StylesDialog', args: [this.viewer]
                });
                modules.push({
                    member: 'StyleDialog', args: [this.viewer]
                });
                modules.push({
                    member: 'BulletsAndNumberingDialog', args: [this.viewer]
                });
            }
            if (this.enableListDialog) {
                modules.push({
                    member: 'ListDialog', args: [this.viewer]
                });
            }
            if (this.enableParagraphDialog) {
                modules.push({
                    member: 'ParagraphDialog', args: [this.viewer]
                });
            }
            if (this.enableFontDialog) {
                modules.push({
                    member: 'FontDialog', args: [this.viewer]
                });
            }
            if (this.enableTablePropertiesDialog) {
                modules.push({
                    member: 'TablePropertiesDialog', args: [this.viewer]
                });
                modules.push({
                    member: 'CellOptionsDialog', args: [this.viewer]
                });
            }
            if (this.enableBordersAndShadingDialog) {
                modules.push({
                    member: 'BordersAndShadingDialog', args: [this.viewer]
                });
            }
            if (this.enableTableOptionsDialog) {
                modules.push({
                    member: 'TableOptionsDialog', args: [this.viewer]
                });
            }
        }
        return modules;
    }
    /**
     * @private
     */
    public defaultLocale: Object = {
        'Table': 'Table',
        'Row': 'Row',
        'Cell': 'Cell',
        'Ok': 'Ok',
        'Cancel': 'Cancel',
        'Size': 'Size',
        'Preferred Width': 'Preferred width',
        'Points': 'Points',
        'Percent': 'Percent',
        'Measure in': 'Measure in',
        'Alignment': 'Alignment',
        'Left': 'Left',
        'Center': 'Center',
        'Right': 'Right',
        'Justify': 'Justify',
        'Indent from left': 'Indent from left',
        'Borders and Shading': 'Borders and Shading',
        'Options': 'Options',
        'Specify height': 'Specify height',
        'At least': 'At least',
        'Exactly': 'Exactly',
        'Row height is': 'Row height is',
        'Allow row to break across pages': 'Allow row to break across pages',
        'Repeat as header row at the top of each page': 'Repeat as header row at the top of each page',
        'Vertical alignment': 'Vertical alignment',
        'Top': 'Top',
        'Bottom': 'Bottom',
        'Default cell margins': 'Default cell margins',
        'Default cell spacing': 'Default cell spacing',
        'Allow spacing between cells': 'Allow spacing between cells',
        'Cell margins': 'Cell margins',
        'Same as the whole table': 'Same as the whole table',
        'Borders': 'Borders',
        'None': 'None',
        'Single': 'Single',
        'Dot': 'Dot',
        'DashSmallGap': 'DashSmallGap',
        'DashLargeGap': 'DashLargeGap',
        'DashDot': 'DashDot',
        'DashDotDot': 'DashDotDot',
        'Double': 'Double',
        'Triple': 'Triple',
        'ThinThickSmallGap': 'ThinThickSmallGap',
        'ThickThinSmallGap': 'ThickThinSmallGap',
        'ThinThickThinSmallGap': 'ThinThickThinSmallGap',
        'ThinThickMediumGap': 'ThinThickMediumGap',
        'ThickThinMediumGap': 'ThickThinMediumGap',
        'ThinThickThinMediumGap': 'ThinThickThinMediumGap',
        'ThinThickLargeGap': 'ThinThickLargeGap',
        'ThickThinLargeGap': 'ThickThinLargeGap',
        'ThinThickThinLargeGap': 'ThinThickThinLargeGap',
        'SingleWavy': 'SingleWavy',
        'DoubleWavy': 'DoubleWavy',
        'DashDotStroked': 'DashDotStroked',
        'Emboss3D': 'Emboss3D',
        'Engrave3D': 'Engrave3D',
        'Outset': 'Outset',
        'Inset': 'Inset',
        'Thick': 'Thick',
        'Style': 'Style',
        'Width': 'Width',
        'Height': 'Height',
        'Letter': 'Letter',
        'Tabloid': 'Tabloid',
        'Legal': 'Legal',
        'Statement': 'Statement',
        'Executive': 'Executive',
        'A3': 'A3',
        'A4': 'A4',
        'A5': 'A5',
        'B4': 'B4',
        'B5': 'B5',
        'Custom Size': 'Custom size',
        'Different odd and even': 'Different odd and even',
        'Different first page': 'Different first page',
        'From edge': 'From edge',
        'Header': 'Header',
        'Footer': 'Footer',
        'Margin': 'Margins',
        'Paper': 'Paper',
        'Layout': 'Layout',
        'Orientation': 'Orientation',
        'Landscape': 'Landscape',
        'Portrait': 'Portrait',
        'Table Of Contents': 'Table Of Contents',
        'Show page numbers': 'Show page numbers',
        'Right align page numbers': 'Right align page numbers',
        'Nothing': 'Nothing',
        'Tab leader': 'Tab leader',
        'Show levels': 'Show levels',
        'Use hyperlinks instead of page numbers': 'Use hyperlinks instead of page numbers',
        'Build table of contents from': 'Build table of contents from',
        'Styles': 'Styles',
        'Available styles': 'Available styles',
        'TOC level': 'TOC level',
        'Heading': 'Heading',
        'List Paragraph': 'List Paragraph',
        'Normal': 'Normal',
        'Outline levels': 'Outline levels',
        'Table entry fields': 'Table entry fields',
        'Modify': 'Modify',
        'Color': 'Color',
        'Setting': 'Setting',
        'Box': 'Box',
        'All': 'All',
        'Custom': 'Custom',
        'Preview': 'Preview',
        'Shading': 'Shading',
        'Fill': 'Fill',
        'Apply To': 'Apply to',
        'Table Properties': 'Table Properties',
        'Cell Options': 'Cell Options',
        'Table Options': 'Table Options',
        'Insert Table': 'Insert Table',
        'Number of columns': 'Number of columns',
        'Number of rows': 'Number of rows',
        'Text to display': 'Text to display',
        'Address': 'Address',
        'Insert Hyperlink': 'Insert Hyperlink',
        'Edit Hyperlink': 'Edit Hyperlink',
        'Insert': 'Insert',
        'General': 'General',
        'Indentation': 'Indentation',
        'Before text': 'Before text',
        'Special': 'Special',
        'First line': 'First line',
        'Hanging': 'Hanging',
        'After text': 'After text',
        'By': 'By',
        'Before': 'Before',
        'Line Spacing': 'Line spacing',
        'After': 'After',
        'At': 'At',
        'Multiple': 'Multiple',
        'Spacing': 'Spacing',
        'Define new Multilevel list': 'Define new Multilevel list',
        'List level': 'List level',
        'Choose level to modify': 'Choose level to modify',
        'Level': 'Level',
        'Number format': 'Number format',
        'Number style for this level': 'Number style for this level',
        'Enter formatting for number': 'Enter formatting for number',
        'Start at': 'Start at',
        'Restart list after': 'Restart list after',
        'Position': 'Position',
        'Text indent at': 'Text indent at',
        'Aligned at': 'Aligned at',
        'Follow number with': 'Follow number with',
        'Tab character': 'Tab character',
        'Space': 'Space',
        'Arabic': 'Arabic',
        'UpRoman': 'UpRoman',
        'LowRoman': 'LowRoman',
        'UpLetter': 'UpLetter',
        'LowLetter': 'LowLetter',
        'Number': 'Number',
        'Leading zero': 'Leading zero',
        'Bullet': 'Bullet',
        'Ordinal': 'Ordinal',
        'Ordinal Text': 'Ordinal Text',
        'For East': 'For East',
        'No Restart': 'No Restart',
        'Font': 'Font',
        'Font style': 'Font style',
        'Underline style': 'Underline style',
        'Font color': 'Font color',
        'Effects': 'Effects',
        'Strikethrough': 'Strikethrough',
        'Superscript': 'Superscript',
        'Subscript': 'Subscript',
        'Double strikethrough': 'Double strikethrough',
        'Regular': 'Regular',
        'Bold': 'Bold',
        'Italic': 'Italic',
        'Cut': 'Cut',
        'Copy': 'Copy',
        'Paste': 'Paste',
        'Hyperlink': 'Hyperlink',
        'Open Hyperlink': 'Open Hyperlink',
        'Copy Hyperlink': 'Copy Hyperlink',
        'Remove Hyperlink': 'Remove Hyperlink',
        'Paragraph': 'Paragraph',
        'Merge Cells': 'Merge Cells',
        'Insert Above': 'Insert Above',
        'Insert Below': 'Insert Below',
        'Insert Left': 'Insert Left',
        'Insert Right': 'Insert Right',
        'Delete': 'Delete',
        'Delete Table': 'Delete Table',
        'Delete Row': 'Delete Row',
        'Delete Column': 'Delete Column',
        'File Name': 'File Name',
        'Format Type': 'Format Type',
        'Save': 'Save',
        'Navigation': 'Navigation',
        'Results': 'Results',
        'Replace': 'Replace',
        'Replace All': 'Replace All',
        'We replaced all': 'We replaced all',
        'Find': 'Find',
        'No matches': 'No matches',
        'All Done': 'All Done',
        'Result': 'Result',
        'of': 'of',
        'instances': 'instances',
        'with': 'with',
        'Click to follow link': 'Click to follow link',
        'Continue Numbering': 'Continue Numbering',
        'Bookmark name': 'Bookmark name',
        'Close': 'Close',
        'Restart At': 'Restart At',
        'Properties': 'Properties',
        'Name': 'Name',
        'Style type': 'Style type',
        'Style based on': 'Style based on',
        'Style for following paragraph': 'Style for following paragraph',
        'Formatting': 'Formatting',
        'Numbering and Bullets': 'Numbering and Bullets',
        'Numbering': 'Numbering',
        'Update Field': 'Update Field',
        'Edit Field': 'Edit Field',
        'Bookmark': 'Bookmark',
        'Page Setup': 'Page Setup',
        'No bookmarks found': 'No bookmarks found',
        'Number format tooltip information': 'Single-level number format: </br>[PREFIX]%[LEVELNUMBER][SUFFIX]</br>'
            + 'For example, "Chapter %1." will display numbering like</br>Chapter 1. Item</br>Chapter 2. Item</br>…'
            + '</br>Chapter N. Item</br>'
            + '</br>Multilevel number format:</br>[PREFIX]%[LEVELNUMBER][SUFFIX]+[PREFIX]%[LEVELNUMBER][SUFFIX]'
            + '</br>For example, "%1.%2." will display numbering like</br>1.1. Item</br>1.2. Item</br>…</br>1.N. Item',
        'Format': 'Format',
        'Create New Style': 'Create New Style',
        'Modify Style': 'Modify Style',
        'New': 'New',
        'Bullets': 'Bullets',
        'Use bookmarks': 'Use bookmarks',
        'Table of Contents': 'Table of Contents'
    };
    // Public Implementation Starts
    /**
     * Opens the given Sfdt text.
     * @param {string} sfdtText.
     */
    public open(sfdtText: string): void {
        if (!isNullOrUndefined(this.viewer)) {
            this.clearPreservedCollectionsInViewer();
            this.viewer.lists = [];
            this.viewer.abstractLists = [];
            this.viewer.styles = new WStyles();
            if (!isNullOrUndefined(sfdtText) && this.viewer) {
                this.viewer.onDocumentChanged(this.parser.convertJsonToDocument(sfdtText));
                if (this.editorModule) {
                    this.editorModule.intializeDefaultStyles();
                }
            }
        }
    }
    /**
     * Scrolls view to start of the given page number if exists.
     * @param  {number} pageNumber.
     * @returns void
     */
    public scrollToPage(pageNumber: number): boolean {
        if (isNullOrUndefined(this.viewer) || pageNumber < 1 || pageNumber > this.viewer.pages.length) {
            return false;
        }
        this.viewer.scrollToPage(pageNumber - 1);
        return true;
    }
    /**
     * Enables all the modules.
     * @returns void
     */
    public enableAllModules(): void {
        this.enablePrint = this.enableSfdtExport = this.enableWordExport = this.enableTextExport
            = this.enableSelection = this.enableContextMenu = this.enableSearch = this.enableOptionsPane
            = this.enableEditor = this.enableImageResizer = this.enableEditorHistory
            = this.enableHyperlinkDialog = this.enableTableDialog = this.enableBookmarkDialog
            = this.enableTableOfContentsDialog = this.enablePageSetupDialog = this.enableStyleDialog
            = this.enableListDialog = this.enableParagraphDialog = this.enableFontDialog
            = this.enableTablePropertiesDialog = this.enableBordersAndShadingDialog
            = this.enableTableOptionsDialog = true;
        // tslint:disable-next-line:max-line-length
        DocumentEditor.Inject(Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog);
    }
    /**
     * Resizes the component and its sub elements based on given size or container size.
     * @param width 
     * @param height 
     */
    public resize(width?: number, height?: number): void {
        if (this.element) {
            if (!isNullOrUndefined(width) && width > 200) {
                this.element.style.width = width + 'px';
            }
            if (!isNullOrUndefined(height) && height > 200) {
                this.element.style.height = height + 'px';
            }
            if (this.viewer) {
                this.viewer.updateViewerSize();
            }
        }
    }
    /**
     * Shifts the focus to the document.
     */
    public focusIn(): void {
        if (this.viewer) {
            this.viewer.updateFocus();
        }
    }
    /**
     * Fits the page based on given fit type.
     * @param  {PageFitType} pageFitType? - Default value of ‘pageFitType’ parameter is 'None'
     * @returns void
     */
    public fitPage(pageFitType?: PageFitType): void {
        if (isNullOrUndefined(pageFitType)) {
            pageFitType = 'None';
        }
        if (this.viewer) {
            this.viewer.pageFitType = pageFitType;
        }
    }
    /**
     * Prints the document.
     * @param  {Window} printWindow? - Default value of 'printWindow' parameter is undefined.
     */
    public print(printWindow?: Window): void {
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation.');
        }
        if (this.printModule) {
            this.printModule.print(this.viewer as PageLayoutViewer, printWindow);
        } else {
            throw new Error('Invalid operation. Print is not enabled.');
        }
    }
    /**
     * Serialize the data to JSON string.
     */
    public serialize(): string {
        let json: string = '';
        if (this.enableSfdtExport && this.sfdtExportModule instanceof SfdtExport) {
            json = this.sfdtExportModule.serialize();
        } else {
            throw new Error('Invalid operation. Sfdt export is not enabled.');
        }
        return json;
    }
    /**
     * Saves the document.
     * @param {string} fileName
     * @param {FormatType} formatType
     */
    public save(fileName: string, formatType?: FormatType): void {
        fileName = fileName || 'Untitled';
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation.');
        }
        if (formatType === 'Docx' && this.wordExportModule) {
            if (this.wordExportModule) {
                this.wordExportModule.save(this.viewer, fileName);
            }
        } else if (formatType === 'Txt' && this.textExportModule) {
            this.textExportModule.save(this.viewer, fileName);
        } else if (formatType === 'Sfdt' && this.enableSfdtExport && this.sfdtExportModule) {
            let jsonString: string = this.serialize();
            let blob: Blob = new Blob([jsonString], {
                type: 'application/json'
            });
            Save.save(fileName + '.sfdt', blob);
        } else {
            throw new Error('Invalid operation. Specified export is not enabled.');
        }
    }
    /**
     * Saves the document as blob.
     * @param {FormatType} formatType
     */
    public saveAsBlob(formatType?: FormatType): Promise<Blob> {
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation');
        }
        return new Promise((resolve: Function, reject: Function) => {
            if (formatType === 'Docx' && this.wordExportModule) {
                resolve(this.wordExportModule.saveAsBlob(this.viewer));
            } else if (formatType === 'Txt' && this.textExportModule) {
                resolve(this.textExportModule.saveAsBlob(this.viewer));
            } else if (formatType === 'Sfdt' && this.enableSfdtExport && this.sfdtExportModule) {
                resolve(this.sfdtExportModule.saveAsBlob(this.viewer));
            }
        });
    }
    /**
     * Opens a blank document.
     */
    public openBlank(): void {
        let section: BodyWidget = new BodyWidget();
        section.index = 0;
        section.sectionFormat = new WSectionFormat(section);
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.index = 0;
        paragraph.paragraphFormat = new WParagraphFormat(paragraph);
        paragraph.characterFormat = new WCharacterFormat(paragraph);
        section.childWidgets.push(paragraph);
        paragraph.containerWidget = section;
        let sections: BodyWidget[] = [];
        sections.push(section);
        // tslint:disable-next-line:max-line-length
        let hfs: HeaderFooters = this.parser.parseHeaderFooter({ header: {}, footer: {}, evenHeader: {}, evenFooter: {}, firstPageHeader: {}, firstPageFooter: {} }, undefined);
        if (this.viewer) {
            this.clearPreservedCollectionsInViewer();
            this.viewer.headersFooters.push(hfs);
            this.viewer.onDocumentChanged(sections);
            if (this.editorModule) {
                this.editorModule.intializeDefaultStyles();
                let style: WStyle = this.viewer.styles.findByName('Normal') as WStyle;
                paragraph.paragraphFormat.baseStyle = style;
                paragraph.paragraphFormat.listFormat.baseStyle = style;
            }
        }
    }
    /**
     * Gets the style names based on given style type.
     * @param styleType 
     */
    public getStyleNames(styleType?: StyleType): string[] {
        if (this.viewer) {
            return this.viewer.styles.getStyleNames(styleType);
        }
        return [];
    }
    /**
     * Gets the style objects on given style type.
     * @param styleType 
     */
    public getStyles(styleType?: StyleType): Object[] {
        if (this.viewer) {
            return this.viewer.styles.getStyles(styleType);
        }
        return [];
    }
    /**
     * Shows the dialog.
     * @param {DialogType} dialogType
     * @returns void
     */
    public showDialog(dialogType: DialogType): void {
        switch (dialogType) {
            case 'Hyperlink':
                this.showHyperlinkDialog();
                break;
            case 'Table':
                this.showTableDialog();
                break;
            case 'Bookmark':
                this.showBookmarkDialog();
                break;
            case 'TableOfContents':
                this.showTableOfContentsDialog();
                break;
            case 'PageSetup':
                this.showPageSetupDialog();
                break;
            case 'List':
                this.showListDialog();
                break;
            case 'Styles':
                this.showStylesDialog();
                break;
            case 'Style':
                this.showStyleDialog();
                break;
            case 'Paragraph':
                this.showParagraphDialog();
                break;
            case 'Font':
                this.showFontDialog();
                break;
            case 'TableProperties':
                this.showTablePropertiesDialog();
                break;
            case 'BordersAndShading':
                this.showBordersAndShadingDialog();
                break;
            case 'TableOptions':
                this.showTableOptionsDialog();
                break;
        }
    }
    /**
     * Shows the options pane.
     */
    public showOptionsPane(): void {
        if (!isNullOrUndefined(this.optionsPaneModule) && !isNullOrUndefined(this.viewer)) {
            this.optionsPaneModule.showHideOptionsPane(true);
        }
    }
    /**
     * Destroys all managed resources used by this object. 
     */
    public destroy(): void {
        super.destroy();
        this.destroyDependentModules();
        if (!isNullOrUndefined(this.viewer)) {
            this.viewer.destroy();
        }
        this.viewer = undefined;
        if (!isNullOrUndefined(this.element)) {
            this.element.classList.remove('e-documenteditor');
            this.element.innerHTML = '';
        }
        this.element = undefined;
        this.findResultsList = [];
        this.findResultsList = undefined;
    }
    private destroyDependentModules(): void {
        if (this.printModule) {
            this.printModule.destroy();
            this.printModule = undefined;
        }
        if (this.sfdtExportModule) {
            this.sfdtExportModule.destroy();
            this.sfdtExportModule = undefined;
        }
        if (this.optionsPaneModule) {
            this.optionsPaneModule.destroy();
            this.optionsPaneModule = undefined;
        }
        if (!isNullOrUndefined(this.hyperlinkDialogModule)) {
            this.hyperlinkDialogModule.destroy();
            this.hyperlinkDialogModule = undefined;
        }
        if (this.searchModule) {
            this.searchModule.destroy();
            this.searchModule = undefined;
        }
        if (this.contextMenuModule) {
            this.contextMenuModule.destroy();
            this.contextMenuModule = undefined;
        }
        if (this.editorModule) {
            this.editorModule.destroy();
            this.editorModule = undefined;
        }
        if (this.selectionModule) {
            this.selectionModule.destroy();
            this.selectionModule = undefined;
        }
        if (this.editorHistoryModule) {
            this.editorHistoryModule.destroy();
            this.editorHistoryModule = undefined;
        }
        if (!isNullOrUndefined(this.paragraphDialogModule)) {
            this.paragraphDialogModule.destroy();
            this.paragraphDialogModule = undefined;
        }
        if (this.pageSetupDialogModule) {
            this.pageSetupDialogModule.destroy();
            this.pageSetupDialogModule = undefined;
        }
        if (this.fontDialogModule) {
            this.fontDialogModule.destroy();
            this.fontDialogModule = undefined;
        }
        if (this.listDialogModule) {
            this.listDialogModule.destroy();
            this.listDialogModule = undefined;
        }
        if (this.imageResizerModule) {
            this.imageResizerModule.destroy();
            this.imageResizerModule = undefined;
        }
        if (this.tablePropertiesDialogModule) {
            this.tablePropertiesDialogModule.destroy();
            this.tablePropertiesDialogModule = undefined;
        }
        if (this.bordersAndShadingDialogModule) {
            this.bordersAndShadingDialogModule.destroy();
            this.bordersAndShadingDialogModule = undefined;
        }
        if (this.cellOptionsDialogModule) {
            this.cellOptionsDialogModule.destroy();
            this.cellOptionsDialogModule = undefined;
        }
        if (this.tableOptionsDialogModule) {
            this.tableOptionsDialogModule.destroy();
            this.tableOptionsDialogModule = undefined;
        }
        if (this.tableDialogModule) {
            this.tableDialogModule.destroy();
            this.tableDialogModule = undefined;
        }
        if (this.styleDialogModule) {
            this.styleDialogModule = undefined;
        }
        if (this.bookmarkDialogModule) {
            this.bookmarkDialogModule.destroy();
            this.bookmarkDialogModule = undefined;
        }
        if (this.styleDialogModule) {
            this.styleDialogModule.destroy();
            this.styleDialogModule = undefined;
        }
        if (this.textExportModule) {
            this.textExportModule.destroy();
            this.textExportModule = undefined;
        }
        if (this.wordExportModule) {
            this.wordExportModule.destroy();
            this.wordExportModule = undefined;
        }
        if (this.tableOfContentsDialogModule) {
            this.tableOfContentsDialogModule.destroy();
            this.tableOfContentsDialogModule = undefined;
        }
    }
    // Public Implementation Ends.
}