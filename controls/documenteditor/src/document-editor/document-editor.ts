import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration, ChildProperty, classList, Complex, formatUnit, Base } from '@syncfusion/ej2-base';
import { isNullOrUndefined, L10n, EmitType, Browser } from '@syncfusion/ej2-base';
import { Save } from '@syncfusion/ej2-file-utils';
import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle, BeforePaneSwitchEventArgs, LayoutType, FormFieldFillEventArgs, FormFieldData } from './index';
import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, CommentDeleteEventArgs, RevisionActionEventArgs, BeforeFileOpenArgs, CommentActionEventArgs, XmlHttpRequestEventArgs } from './index';
import { LayoutViewer, PageLayoutViewer, WebLayoutViewer, BulletsAndNumberingDialog } from './index';
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
import { FormatType, PageFitType, DialogType, FormattingExceptions, CompatibilityMode } from './index';
import { ContextMenu } from './index';
import { ImageResizer } from './index';
import { SfdtExport } from './index';
import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';
import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';
import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';
import { SpellChecker } from './implementation/spell-check/spell-checker';
import { SpellCheckDialog } from './implementation/dialogs/spellCheck-dialog';
import { DocumentEditorModel, ServerActionSettingsModel, DocumentEditorSettingsModel, FormFieldSettingsModel, CollaborativeEditingSettingsModel, DocumentSettingsModel, AutoResizeSettingsModel } from './document-editor-model';
import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties, DocumentHelper, listsProperty, abstractListsProperty } from './index';
import { PasteOptions } from './index';
import { CommentReviewPane, CheckBoxFormFieldDialog, DropDownFormField, TextFormField, CheckBoxFormField, FieldElementBox, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, ContextElementInfo, CollaborativeEditing, CollaborativeEditingEventArgs, Operation, ProtectionInfo, HistoryInfo, BaseHistoryInfo, WParagraphStyle, WList, WCharacterStyle, CollaborativeEditingHandler, ActionInfo } from './implementation/index';
import { TextFormFieldDialog } from './implementation/dialogs/form-field-text-dialog';
import { DropDownFormFieldDialog } from './implementation/dialogs/form-field-drop-down-dialog';
import { FormFillingMode, TrackChangeEventArgs, ServiceFailureArgs, ImageFormat, ProtectionType } from './base';
import { TrackChangesPane } from './implementation/track-changes/track-changes-pane';
import { RevisionCollection } from './implementation/track-changes/track-changes';
import { NotesDialog } from './implementation/dialogs/notes-dialog';
import { FootNoteWidget } from './implementation/viewer/page';
import { internalZoomFactorChange, contentChangeEvent, documentChangeEvent, selectionChangeEvent, zoomFactorChangeEvent, beforeFieldFillEvent, afterFieldFillEvent, serviceFailureEvent, viewChangeEvent, customContextMenuSelectEvent, customContextMenuBeforeOpenEvent, internalviewChangeEvent, internalDocumentEditorSettingsChange, trackChanges } from './base/constants';
import { Optimized, Regular, HelperMethods } from './index';
import { ColumnsDialog } from './implementation/dialogs/columns-dialog';
import { DocumentCanvasElement } from './implementation/viewer/document-canvas';
import { ZipArchiveItem, ZipArchive } from '@syncfusion/ej2-compression';
import { Ruler } from './implementation/ruler/index';
import { TabDialog } from './implementation/dialogs/tab-dialog';
import { RulerHelper } from './implementation/utility/dom-util';
/**
 * The `DocumentEditorSettings` module is used to provide the customize property of Document Editor.
 */
export class DocumentEditorSettings extends ChildProperty<DocumentEditorSettings> {
    /**
     * Gets or sets a value indicating where to append the pop up element
     *
     * @returns {HTMLElement}
     * @aspType HTMLElement
     * @default null
     */
    @Property(null)
    public popupTarget: HTMLElement;
    /**
     * Specifies the user preferred Search Highlight Color of Document Editor.
     *
     * @default '#FFE97F'
     */
    @Property('#FFE97F')
    public searchHighlightColor: string;

    /* eslint-disable */
    /**
     * Specifies the user preferred font family of Document Editor.
     * @default ['Algerian','Arial','Calibri','Cambria','CambriaMath','Candara','CourierNew','Georgia','Impact','SegoePrint','SegoeScript','SegoeUI','Symbol','TimesNewRoman','Verdana','Wingdings']
     */
    @Property(['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Wingdings'])
    public fontFamilies: string[];
    /* eslint-enable */

    /**
     * Gets or sets the form field settings.
     */
    @Property({ shadingColor: '#cfcfcf', applyShading: true, selectionColor: '#cccccc', formFillingMode: 'Popup' })
    public formFieldSettings: FormFieldSettingsModel;

    /**
     * Specified the auto resize settings.
     */
    @Property({ interval: 2000, itertationCount: 5 })
    public autoResizeSettings: AutoResizeSettingsModel;
    /**
     * Gets ot sets the collaborative editing settings.
     */
    @Property({ roomName: '', editableRegionColor: '#22b24b', lockedRegionColor: '#f44336' })
    public collaborativeEditingSettings: CollaborativeEditingSettingsModel;

    /**
     * Specifies the device pixel ratio for the image generated for printing.
     * > Increasing the device pixel ratio will increase the image file size, due to high resolution of image.
     */
    @Property(1)
    public printDevicePixelRatio: number;
    /**
     * Gets or sets a value indicating whether to use optimized text measuring approach to match Microsoft Word pagination.
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` if uses optimized text measuring approach to match Microsoft Word pagination; otherwise, `false`
     */
    @Property(true)
    public enableOptimizedTextMeasuring: boolean;

    /**
     * Enable or Disable moving selected content within Document Editor
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` moving selected content within Document Editor is enabled; otherwise, `false`
     */
    @Property(true)
    public allowDragAndDrop: boolean;

    /**
     * Gets or sets the maximum number of rows allowed while inserting a table in Document editor component.
     * > The maximum value is 32767, as per Microsoft Word application and you can set any value less than 32767 to this property. If you set any value greater than 32767, then Syncfusion Document editor will automatically reset as 32767.
     * @default 32767
     * @returns {number}
     */
    @Property(32767)
    public maximumRows: number;

    /**
     * Gets or sets the maximum number of columns allowed while inserting a table in Document editor component.
     * > The maximum value is 63, as per Microsoft Word application and you can set any value less than 63 to this property. If you set any value greater than 63, then Syncfusion Document editor will automatically reset as 63.
     * @default 63
     * @returns {number}
     */
    @Property(63)
    public maximumColumns: number;

    /**
     * Gets or sets a value indicating whether to show the hidden characters like spaces, tab, paragraph marks, and breaks.
     *
     * @default false
     * @aspType bool
     * @returns {boolean} Returns `false` if hides the hidden characters like spaces, tab, paragraph marks, and breaks. Otherwise `true`.
     */
    @Property(false)
    public showHiddenMarks: boolean;

    /**
     * Gets or sets a value indicating whether to show square brackets around bookmarked items.
     *
     * @returns {boolean}
     * @aspType bool
     * @default false
     */
    @Property(false)
    public showBookmarks: boolean;

    /**
     * Gets or sets a value indicating whether to highlight the editable ranges in the document where the current user can edit. 
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` if editable ranges in the document is highlighted. Otherwise `false`.
     */
    @Property(true)
    public highlightEditableRanges: boolean;

    /**
     * Describes whether to reduce the resultant SFDT file size by minifying the file content
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` if sfdt content generated is optimized. Otherwise `false`.
     */
    @Property(true)
    public optimizeSfdt: boolean;

    /**
     *  Gets or sets a value indicating whether to display ruler in Document Editor.
     *
     * @default false
     * @aspType bool
     * @returns {boolean} Returns `true` if ruler is visible in Document Editor. Otherwise `false`.
     */
    @Property(false)
    public showRuler: boolean;
}

/**
 * Represents the settings and properties of the document that is opened in Document editor component.
 */
export class DocumentSettings extends ChildProperty<DocumentSettings> {
    /**
     * Gets or sets the compatibility mode of the current document.
     *
     * @default `Word2013`
     * @returns {CompatibilityMode}
     */
    @Property('Word2013')
    public compatibilityMode: CompatibilityMode;
}



/**
 * Represents the settings required for resizing the Document editor automatically when the visibility of parent element changed.
 */
export class AutoResizeSettings extends ChildProperty<AutoResizeSettings> {
    /**
     * Gets or sets the time interval in milliseconds to validate whether the parent element's height and width is non-zero.
     *
     * @default 2000
     * @returns {number}
     */
    @Property(2000)
    public interval: number;

    /**
     * Gets or sets the number of times the Document editor has to validate whether the parent element's height and width is non-zero.
     *
     * @default 5
     * @returns {number}
     */
    @Property(5)
    public iterationCount: number;
}

/**
 * The Document editor component is used to draft, save or print rich text contents as page by page.
 */
@NotifyPropertyChanges
export class DocumentEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    private enableHeaderFooterIn: boolean = false;
    /**
     * @private
     * @returns {boolean} Returns true if header and footer is enabled.
     */
    public get enableHeaderAndFooter(): boolean {
        return this.enableHeaderFooterIn;
    }
    /**
     * @private
     * @param {boolean} value True if enable the header and footer; Otherwise, false.
     */
    public set enableHeaderAndFooter(value: boolean) {
        this.enableHeaderFooterIn = value;
        if (!value && this.selection && this.selection.isWebLayout) {
            this.selection.isWebLayout = false;
        }
        this.viewer.updateScrollBars();
    }
    /**
     * @private
     */
    public viewer: LayoutViewer;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
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
    public isOnIndent: boolean = false;
    /**
     * @private
     */
     public isTableMarkerDragging : boolean =false;
     /**
     * @private
     */
     public startXPosition : number =0;
    /**
     * @private
     */
    public parser: SfdtReader = undefined;
    private isDocumentLoadedIn: boolean;
    private disableHistoryIn: boolean = false;

    private documentSettingOps: Operation[] = [];
    /**
     * @private
     */
    public skipSettingsOps: boolean = false;
    /**
     * @private 
     */
    public hRuler: Ruler;
    /** 
     * @private 
     */
    public vRuler: Ruler;
    /**
     * @private
     */
    public rulerHelper: RulerHelper;

    private isSettingOp: boolean = false;
    /**
     * @private
     */
    public findResultsList: string[] = undefined;
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
    public tabDialogModule: TabDialog;
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
    public spellCheckDialogModule: SpellCheckDialog;
    /**
     * @private
     */
    public pageSetupDialogModule: PageSetupDialog;
    /**
     * @private
     */
    public columnsDialogModule: ColumnsDialog;
    /**
     * @private
     */
    public footNotesDialogModule: NotesDialog;
    /**
     * @private
     */
    public paragraphDialogModule: ParagraphDialog = undefined;
    /**
     * @private
     */
    public checkBoxFormFieldDialogModule: CheckBoxFormFieldDialog;
    /**
     * @private
     */
    public textFormFieldDialogModule: TextFormFieldDialog;
    /**
     * @private
     */
    public dropDownFormFieldDialogModule: DropDownFormFieldDialog;
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
    /**
     * @private
     */
    public optimizedModule: Optimized;
    /**
     * @private
     */
    public regularModule: Regular;
    private createdTriggered: boolean = false;
    /**
     * Gets or sets the Collaborative editing module.
     */
    public collaborativeEditingModule: CollaborativeEditing;
    /**
     * Gets or sets the Collaborative editing module.
     */
    public collaborativeEditingHandlerModule: CollaborativeEditingHandler;
    /**
     * Holds regular or optimized module based on DocumentEditorSettting `enableOptimizedTextMeasuring` property.
     *
     * @private
     */
    public textMeasureHelper: Regular | Optimized
    /**
     * Enable collaborative editing in document editor.
     * @default false
     */
    @Property(false)
    public enableCollaborativeEditing: boolean;
    /**
     * Gets or sets the default Paste Formatting Options
     *
     * @default KeepSourceFormatting
     */
    @Property('KeepSourceFormatting')
    public defaultPasteOption: PasteOptions;

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
     * Gets or sets the page gap value in document editor.
     *
     * @default 20
     */
    @Property(20)
    public pageGap: number;
    /**
     * Gets or sets the name of the document.
     *
     * @default ''
     */
    @Property('')
    public documentName: string;
    /**
     * @private
     */
    public spellCheckerModule: SpellChecker;
    /**
     * Defines the width of the DocumentEditor component.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string;
    /**
     * Defines the height of the DocumentEditor component.
     *
     * @default '200px'
     */
    @Property('200px')
    public height: string;
    /**
     * Gets or sets the Sfdt Service URL.
     *
     * @default ''
     */
    @Property('')
    public serviceUrl: string;
    // Public Implementation Starts
    /**
     * Gets or sets the zoom factor in document editor.
     *
     * @default 1
     */
    @Property(1)
    public zoomFactor: number;
    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     *
     * @default 2000
     * @aspType int
     */
    @Property(2000)
    public zIndex: number;
    /**
     * Gets or sets a value indicating whether the document editor is in read only state or not.
     *
     * @default true
     */
    @Property(true)
    public isReadOnly: boolean;
    /**
     * Gets or sets a value indicating whether print needs to be enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enablePrint: boolean;
    /**
     * Gets or sets a value indicating whether selection needs to be enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableSelection: boolean;
    /**
     * Gets or sets a value indicating whether editor needs to be enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableEditor: boolean;
    /**
     * Gets or sets a value indicating whether editor history needs to be enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableEditorHistory: boolean;
    /**
     * Gets or sets a value indicating whether Sfdt export needs to be enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableSfdtExport: boolean;
    /**
     * Gets or sets a value indicating whether word export needs to be enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableWordExport: boolean;
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
     * Gets or sets a value indicating whether text export needs to be enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableTextExport: boolean;
    /**
     * Gets or sets a value indicating whether options pane is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableOptionsPane: boolean;
    /**
     * Gets or sets a value indicating whether context menu is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableContextMenu: boolean;
    /**
     * Gets or sets a value indicating whether hyperlink dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableHyperlinkDialog: boolean;
    /**
     * Gets or sets a value indicating whether bookmark dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableBookmarkDialog: boolean;
    /**
     * Gets or sets a value indicating whether table of contents dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableTableOfContentsDialog: boolean;
    /**
     * Gets or sets a value indicating whether search module is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableSearch: boolean;
    /**
     * Gets or sets a value indicating whether paragraph dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableParagraphDialog: boolean;
    /**
     * Gets or sets a value indicating whether list dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableListDialog: boolean;
    /**
     * Gets or sets a value indicating whether table properties dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableTablePropertiesDialog: boolean;
    /**
     * Gets or sets a value indicating whether borders and shading dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableBordersAndShadingDialog: boolean;
    /**
     * Gets or sets a value indicating whether notes dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableFootnoteAndEndnoteDialog: boolean;
    /**
     * Gets or sets a value indicating whether margin dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableColumnsDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enablePageSetupDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableStyleDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     *
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
     *
     * @default false
     */
    @Property(false)
    public enableTableOptionsDialog: boolean;
    /**
     * Gets or sets a value indicating whether table dialog is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableTableDialog: boolean;
    /**
     * Gets or sets a value indicating whether image resizer is enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableImageResizer: boolean;
    /**
     * Gets or sets a value indicating whether editor need to be spell checked.
     *
     * @default false
     */
    @Property(false)
    public enableSpellCheck: boolean;
    /**
     * Gets or sets a value indicating whether comment is enabled or not
     *
     * @default false
     */
    @Property(false)
    public enableComment: boolean;
    /**
     * Gets or sets a value indicating whether track changes is enabled or not
     *
     * @default false
     */
    @Property(false)
    public enableTrackChanges: boolean;
    /**
     * Gets or sets a value indicating whether form fields is enabled or not.
     *
     * @default false
     */
    @Property(true)
    public enableFormField: boolean;
    /**
     * Gets or sets a value indicating whether tab key can be accepted as input or not.
     *
     * @default false
     */
    @Property(false)
    public acceptTab: boolean;
    /**
     * Gets or sets a value indicating whether holding Ctrl key is required to follow hyperlink on click. The default value is true.
     *
     * @default true
     */
    @Property(true)
    public useCtrlClickToFollowHyperlink: boolean;
    /**
     * Gets or sets the page outline color.
     *
     * @default '#000000'
     */
    @Property('#000000')
    public pageOutline: string;
    /**
     * Gets or sets a value indicating whether to enable cursor in document editor on read only state or not. The default value is false.
     *
     * @default false
     */
    @Property(false)
    public enableCursorOnReadOnly: boolean;
    /**
     * Gets or sets a value indicating whether local paste needs to be enabled or not.
     *
     * @default false
     */
    @Property(false)
    public enableLocalPaste: boolean;
    /**
     * Enables the partial lock and edit module.
     *
     * @default false
     */
    @Property(false)
    public enableLockAndEdit: boolean;
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
     * Defines the settings of the DocumentEditor services
     */
    @Property({ systemClipboard: 'SystemClipboard', spellCheck: 'SpellCheck', spellCheckByPage: 'SpellCheckByPage', restrictEditing: 'RestrictEditing', canLock: 'CanLock', getPendingActions: 'GetPendingActions' })
    public serverActionSettings: ServerActionSettingsModel;
    /**
     * Adds the custom headers to XMLHttpRequest.
     *
     * @default []
     */
    @Property([])
    public headers: object[];
    /* eslint-enable */
    /**
     * Shows the comment in the document.
     *
     * @default false
     */
    @Property(false)
    public showComments: boolean;
    /**
     * Shows the revision changes in the document.
     *
     * @default false
     */
    @Property(false)
    public showRevisions: boolean;

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
     * Triggers whenever the document changes in the document editor.
     *
     * @event documentChange
     */
    @Event()
    public documentChange: EmitType<DocumentChangeEventArgs>;
    /**
     * Triggers whenever the container view changes in the document editor.
     *
     * @event viewChange
     */
    @Event()
    public viewChange: EmitType<ViewChangeEventArgs>;
    /**
     * Triggers whenever the zoom factor changes in the document editor.
     *
     * @event zoomFactorChange
     */
    @Event()
    public zoomFactorChange: EmitType<ZoomFactorChangeEventArgs>;
    /**
     * Triggers whenever the selection changes in the document editor.
     *
     * @event selectionChange
     */
    @Event()
    public selectionChange: EmitType<SelectionChangeEventArgs>;
    /**
     * Triggers whenever the hyperlink is clicked or tapped in the document editor.
     *
     * @event requestNavigate
     */
    @Event()
    public requestNavigate: EmitType<RequestNavigateEventArgs>;
    /**
     * Triggers whenever the content changes in the document editor.
     *
     * @event contentChange
     */
    @Event()
    public contentChange: EmitType<ContentChangeEventArgs>;
    /**
     * Triggers whenever the key is pressed in the document editor.
     *
     * @event keyDown
     */
    @Event()
    public keyDown: EmitType<DocumentEditorKeyDownEventArgs>;
    /**
     * Triggers whenever search results changes in the document editor.
     *
     * @event searchResultsChange
     */
    @Event()
    public searchResultsChange: EmitType<SearchResultsChangeEventArgs>;
    /**
     * Triggers when the component is created.
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
     * Triggers before opening the comment pane.
     *
     * @event beforePaneSwitch
     */
    @Event()
    public beforePaneSwitch: EmitType<BeforePaneSwitchEventArgs>;
    /**
     * Triggers after inserting the comment.
     *
     * @event commentBegin
     */
    @Event()
    public commentBegin: EmitType<Object>;
    /**
     * Triggers after posting the comment.
     *
     * @event commentEnd
     */
    @Event()
    public commentEnd: EmitType<Object>;
    /**
     * Triggers before a file is opened.
     *
     * @event beforeFileOpen
     */
    @Event()
    public beforeFileOpen: EmitType<BeforeFileOpenArgs>;
    /**
     * Triggers after deleting the comment.
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
     * Triggers when the trackChanges enabled / disabled.
     *
     * @event trackChange
     */
    @Event()
    public trackChange: EmitType<TrackChangeEventArgs>;
    /**
     * Triggers before the form field fill.
     *
     * @event beforeFormFieldFill
     */
    @Event()
    public beforeFormFieldFill: EmitType<FormFieldFillEventArgs>;
    /**
     * Triggers when the server side action fails.
     *
     * @event serviceFailure
     */
    @Event()
    public serviceFailure: EmitType<ServiceFailureArgs>;

    /**
     * Triggers after the form field fill.
     *
     * @event afterFormFieldFill
     */
    @Event()
    public afterFormFieldFill: EmitType<FormFieldFillEventArgs>;
    /**
     * Triggers when the document editor collaborative actions (such as LockContent, SaveContent, UnlockContent) gets completed.
     *
     * @event actionComplete
     */
    @Event()
    public actionComplete: EmitType<CollaborativeEditingEventArgs>;
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
    public commentReviewPane: CommentReviewPane;
    /**
     * @private
     */
    public trackChangesPane: TrackChangesPane;

    /**
     * @private
     */
    public rulerContainer: HTMLElement;
    /**
     * @private
     */
    public revisionsInternal: RevisionCollection;
    /**
     * Gets the total number of pages.
     *
     * @returns {number} Returns the page count.
     */
    public get pageCount(): number {
        if (!this.isDocumentLoaded || isNullOrUndefined(this.viewer) || this.viewer instanceof WebLayoutViewer) {
            return 1;
        }
        return this.documentHelper.pages.length;
    }
    /**
     * Gets the selection object of the document editor.
     *
     * @default undefined
     * @aspType Selection
     * @returns {Selection} Returns the selection object.
     */
    public get selection(): Selection {
        return this.selectionModule;
    }
    /**
     * Gets the editor object of the document editor.
     *
     * @aspType Editor
     * @returns {Editor} Returns the editor object.
     */
    public get editor(): Editor {
        return this.editorModule;
    }
    /**
     * Gets the editor history object of the document editor.
     *
     * @aspType EditorHistory
     * @returns {EditorHistory} Returns the editor history object.
     */
    public get editorHistory(): EditorHistory {
        return this.editorHistoryModule;
    }
    /**
     * Gets the search object of the document editor.
     *
     * @aspType Search
     * @returns { Search } Returns the search object.
     */
    public get search(): Search {
        return this.searchModule;
    }
    /**
     * Gets the context menu object of the document editor.
     *
     * @aspType ContextMenu
     * @returns {ContextMenu} Returns the context menu object.
     */
    public get contextMenu(): ContextMenu {
        return this.contextMenuModule;
    }
    /**
     * Gets the spell check dialog object of the document editor.
     *
     * @returns {SpellCheckDialog} Returns the spell check dialog object.
     */
    public get spellCheckDialog(): SpellCheckDialog {
        return this.spellCheckDialogModule;
    }
    /**
     * Gets the spell check object of the document editor.
     *
     * @aspType SpellChecker
     * @returns {SpellChecker} Returns the spell checker object.
     */
    public get spellChecker(): SpellChecker {
        return this.spellCheckerModule;
    }
    /**
     * @private
     * @returns {string }- Returns the container id.
     */
    public get containerId(): string {
        return this.element.id;
    }
    /**
     * @private
     * @returns {boolean} - Returns true if document is loaded.
     */
    public get isDocumentLoaded(): boolean {
        return this.isDocumentLoadedIn;
    }
    /**
     * @private
     */
    public set isDocumentLoaded(value: boolean) {
        this.isDocumentLoadedIn = value;
    }
    /**
     *  Describes whether Document contains any content or not
     *
     * @returns {boolean} Returns `true` if Document does not contains any content; otherwise, `false`
     * @aspType bool
     * @default false
     */
    public get isDocumentEmpty(): boolean {
        if(this.documentHelper.pages.length == 1) {
            const firstPage = this.documentHelper.pages[0];
            const headerWidget = firstPage.headerWidget;
            const footerWidget = firstPage.footerWidget;
            let isHeaderEmpty = true;
            let isFooterEmpty = true;
            if(!isNullOrUndefined(headerWidget) && !isNullOrUndefined(headerWidget.firstChild)) {
                if(!(headerWidget.firstChild instanceof ParagraphWidget) || !headerWidget.firstChild.isEmpty()) {
                    isHeaderEmpty = false;
                }
            }
            if(!isNullOrUndefined(footerWidget) && !isNullOrUndefined(footerWidget.firstChild)) {
                if(!(footerWidget.firstChild instanceof ParagraphWidget) || !footerWidget.firstChild.isEmpty()) {
                    isFooterEmpty = false;
                }
            }
            if(isHeaderEmpty && isFooterEmpty) {
                const firstBodywidget = firstPage.bodyWidgets[0];
                if(isNullOrUndefined(firstBodywidget.nextWidget)) {
                    const firstChild = firstBodywidget.firstChild;
                    if(firstChild instanceof ParagraphWidget
                        && firstChild.isEmpty()
                        && isNullOrUndefined(firstChild.nextWidget)) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    }
    /**
     * Gets the revision collection which contains information about changes made from original document
     *
     * @returns {RevisionCollection} Returns the revision collection object.
     */
    public get revisions(): RevisionCollection {
        if (isNullOrUndefined(this.revisionsInternal)) {
            this.revisionsInternal = new RevisionCollection(this);
        }
        return this.revisionsInternal;
    }
    /**
     * Determines whether history needs to be enabled or not.
     *
     * @default - false
     * @private
     * @returns {boolean} Returns true if history module is enabled.
     */
    public get enableHistoryMode(): boolean {
        return this.enableEditorHistory && !isNullOrUndefined(this.editorHistoryModule);
    }
    /**
     * Gets the start text position in the document.
     *
     * @default undefined
     * @private
     * @returns {TextPosition} - Returns the document start.
     */
    public get documentStart(): TextPosition {
        if (!isNullOrUndefined(this.selectionModule)) {
            return this.selection.getDocumentStart();
        }
        return undefined;
    }
    /**
     * Gets the end text position in the document.
     *
     * @default undefined
     * @private
     * @returns {TextPosition} - Returns the document end.
     */
    public get documentEnd(): TextPosition {
        if (!isNullOrUndefined(this.selectionModule)) {
            return this.selection.getDocumentEnd();
        }
        return undefined;
    }
    /**
     * @private
     * @returns {TextPosition} - Returns isReadOnlyMode.
     */
    public get isReadOnlyMode(): boolean {
        return this.isReadOnly || isNullOrUndefined(this.editorModule)
            || isNullOrUndefined(this.selectionModule) || !isNullOrUndefined(this.editor) && this.editor.restrictEditing;
    }
    /**
     * @private
     * @returns {TextPosition} - Returns isSpellCheck.
     */
    public get isSpellCheck(): boolean {
        return this.enableSpellCheck && this.spellChecker.enableSpellCheck;
    }
    /**
     * Specifies to enable image resizer option
     *
     * @private
     * @returns {boolean} - Returns enableImageResizerMode.
     */
    public get enableImageResizerMode(): boolean {
        return this.enableImageResizer && !isNullOrUndefined(this.imageResizerModule);
    }
    /**
     * Initializes a new instance of the DocumentEditor class.
     *
     * @param {DocumentEditorModel} options Specifies the document editor model.
     * @param {string | HTMLElement} element Specifies the element.
     */
    public constructor(options?: DocumentEditorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.initHelper();
    }
    protected preRender(): void {
        if (this.documentEditorSettings && this.documentEditorSettings.enableOptimizedTextMeasuring) {
            DocumentEditor.Inject(Optimized);
        } else {
            DocumentEditor.Inject(Regular);
        }
        //pre render section
        this.findResultsList = [];
        setTimeout(() => {
            if (isNullOrUndefined(this.documentEditorSettings.popupTarget)) {
                this.documentEditorSettings.popupTarget = document.body;
            }
        }, 0);
        if (!isNullOrUndefined(this.element) && this.element.id === '') {
            //Set unique id, if id is empty
            this.element.id = HelperMethods.getUniqueElementId();
        }
        if (this.refreshing) {
            this.initHelper();
        }
    }
    private initHelper(): void {
        this.documentHelper = new DocumentHelper(this);
        if (this.layoutType === 'Pages') {
            this.viewer = new PageLayoutViewer(this);
        } else {
            this.viewer = new WebLayoutViewer(this);
        }
        this.parser = new SfdtReader(this.documentHelper);
    }
    protected render(): void {
        if (!isNullOrUndefined(this.element)) {
            const container: HTMLElement = this.element;
            container.style.minHeight = '200px';
            container.style.minWidth = '200px';
            if (this.height !== '') {
                this.element.style.height = formatUnit(this.height);
            }
            if (this.width !== '') {
                this.element.style.width = formatUnit(this.width);
            }
        }
        this.textMeasureHelper = (this.optimizedModule) ? this.optimizedModule : this.regularModule;
        if (isNullOrUndefined(this.textMeasureHelper)) {
            this.textMeasureHelper = new Optimized(this.documentHelper);
        }
        this.documentHelper.initializeComponents();
        this.openBlank();
        this.renderComplete();
        this.renderRulers();
        this.createdTriggered = true;
    }
    /**
     * @private
     */
    public renderRulers() {
        // if (this.documentEditorSettings.showRuler) {
            this.rulerHelper = new RulerHelper();
            this.rulerContainer = this.rulerHelper.renderOverlapElement(this);
            this.rulerHelper.renderRuler(this, true);
            this.rulerHelper.renderRuler(this, false);
            this.rulerHelper.renderRulerMarkerIndicatorElement(this);
            this.rulerHelper.createIndicatorLines(this);
            this.showHideRulers();
        // }
    }
    private showHideRulers(): void {
        if (this.rulerHelper && this.documentEditorSettings && !isNullOrUndefined(!this.documentEditorSettings.showRuler)) {
            let showRuler: boolean = this.documentEditorSettings.showRuler && !this.isReadOnlyMode;
            this.rulerHelper.hideTabStopSwitch(showRuler);
            this.rulerHelper.hideRulerBottom(showRuler);
            if (this.vRuler) {
                this.vRuler.showHideRuler(showRuler);
            }
            if (this.hRuler) {
                this.hRuler.showHideRuler(showRuler);
            }
        }
    }
    /**
     * Get component name
     *
     * @private
     * @returns {string} - Returns module name.
     */
    public getModuleName(): string {
        return 'DocumentEditor';
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {DocumentEditorModel} model - Specifies the new model.
     * @param {DocumentEditorModel} oldProp - Specifies the old model.
     * @returns {void}
     */
    public onPropertyChanged(model: DocumentEditorModel, oldProp: DocumentEditorModel): void {
        for (const prop of Object.keys(model)) {
            switch (prop) {
                case 'enableTrackChanges':
                    this.notify(trackChanges, model);
                    this.getSettingData('enableTrackChanges', model.enableTrackChanges);
                    if (this.documentHelper.isTrackedOnlyMode && !model.enableTrackChanges) {
                        this.enableTrackChanges = true;
                    }
                    break;
                case 'autoResizeOnVisibilityChange':
                    if (model.autoResizeOnVisibilityChange) {
                        this.documentHelper.triggerAutoResizeInterval();
                    }
                    break;
                case 'zoomFactor':
                    if (this.viewer && oldProp.zoomFactor !== model.zoomFactor) {
                        this.documentHelper.zoomFactor = model.zoomFactor;
                        if (this.rulerHelper && this.documentEditorSettings && this.documentEditorSettings.showRuler) {
                            this.rulerHelper.updateRuler(this, true);
                        }
                    }
                    break;
                case 'layoutType':
                    if (this.selection && this.selection.isWebLayout) {
                        break;
                    }
                    this.viewer.destroy();
                    if (this.layoutType === 'Pages') {
                        this.viewer = new PageLayoutViewer(this);
                    } else {
                        if (this.enableHeaderAndFooter === true) {
                            this.selection.closeHeaderFooter();
                        }
                        this.viewer = new WebLayoutViewer(this);
                    }
                    /* eslint-disable */
                    const paragraph: ParagraphWidget = this.selection.start.paragraph;
                    if (paragraph.containerWidget instanceof FootNoteWidget) {
                        this.selection.clearSelectionHighlightInSelectedWidgets();
                        this.selection.selectContent(this.documentStart, true);
                    }
                    this.editor.layoutWholeDocument(true);
                    setTimeout((): void => {
                        this.fireViewChange();
                    }, 200);
                    break;
                case 'locale':
                    this.localizeDialogs();
                    break;
                case 'isReadOnly':
                    if (!isNullOrUndefined(this.optionsPaneModule) && this.optionsPaneModule.isOptionsPaneShow) {
                        this.optionsPaneModule.showHideOptionsPane(false);
                        this.documentHelper.updateFocus();
                    }
                    if (this.showComments) {
                        this.commentReviewPane.showHidePane(true, 'Comments');
                    }
                    this.commentReviewPane.enableDisableItems();
                    this.trackChangesPane.enableDisableButton(!this.isReadOnly && !this.documentHelper.isDocumentProtected);
                    this.showHideRulers();
                    break;
                case 'currentUser':
                case 'userColor':
                    if (this.selection && this.documentHelper.isDocumentProtected) {
                        this.selection.highlightEditRegion();
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'pageGap':
                case 'pageOutline':
                    this.viewer.updateScrollBars();
                    break;
                case 'zIndex':
                    if (this.documentHelper.dialog) {
                        this.documentHelper.dialog.zIndex = model.zIndex + 10;
                    }
                    if (this.documentHelper.dialog2) {
                        this.documentHelper.dialog2.zIndex = model.zIndex;
                    }
                    break;
                case 'showComments':
                    if (this.viewer && model.showComments !== oldProp.showComments) {
                        this.documentHelper.showComments(model.showComments);
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'enableRtl':
                    this.localizeDialogs(model.enableRtl);
                    break;
                case 'enableComment':
                    if (this.viewer && this.showComments) {
                        this.showComments = this.showComments ? this.enableComment : false;
                        this.documentHelper.showComments(model.enableComment);
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'showRevisions':
                    if (this.isReadOnly || this.documentHelper.isDocumentProtected) {
                        this.documentHelper.showRevisions(false);
                    } else if (this.viewer) {
                        this.documentHelper.showRevisions(model.showRevisions);
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'documentSettings':
                    if (!isNullOrUndefined(model.documentSettings.compatibilityMode)) {
                        let oldValue: CompatibilityMode = oldProp.documentSettings.compatibilityMode;
                        let newValue: CompatibilityMode = model.documentSettings.compatibilityMode;
                        if ((oldValue == "Word2013" && newValue != "Word2013") || (oldValue != "Word2013" && newValue == "Word2013")) {
                            if (this.documentHelper.compatibilityMode !== newValue) {
                                this.documentHelper.compatibilityMode = newValue;
                                this.editor.layoutWholeDocument(true);
                            }
                        }
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'documentEditorSettings':
                    if (!isNullOrUndefined(model.documentEditorSettings.enableOptimizedTextMeasuring)) {
                        //Clears previously cached height information.
                        this.documentHelper.heightInfoCollection = {}
                        if (model.documentEditorSettings.enableOptimizedTextMeasuring) {
                            this.textMeasureHelper = this.optimizedModule;
                        } else {
                            this.textMeasureHelper = this.regularModule;
                        }
                        this.viewer.updateScrollBars();
                    }
                    if ((!isNullOrUndefined(model.documentEditorSettings.showHiddenMarks) && (model.documentEditorSettings.showHiddenMarks !== oldProp.documentEditorSettings.showHiddenMarks))
                    || (!isNullOrUndefined(model.documentEditorSettings.showBookmarks) && (model.documentEditorSettings.showBookmarks !== oldProp.documentEditorSettings.showBookmarks))) {
                        this.viewer.updateScrollBars();
                    }
                    if (!isNullOrUndefined(model.documentEditorSettings.highlightEditableRanges)) {
                        if (this.documentHelper && this.documentHelper.restrictEditingPane) {
                            this.documentHelper.restrictEditingPane.highlightCheckBox.checked = model.documentEditorSettings.highlightEditableRanges;
                        }
                    }
                    if(!isNullOrUndefined(model.documentEditorSettings.showRuler)) { 
                        this.showHideRulers();
                        if (model.documentEditorSettings.showRuler) {
                            // if (isNullOrUndefined(this.rulerHelper)) {
                            //     this.renderRulers();
                            // }
                            this.rulerHelper.updateRuler(this, true);
                        }
                    }
                    break;
                case 'height':
                    this.element.style.height = formatUnit(this.height);
                    this.resize();
                    break;
                case 'width':
                    this.element.style.width = formatUnit(this.width);
                    this.resize();
                    break;
                case 'enableAutoFocus':
                    this.enableAutoFocus = model.enableAutoFocus;
                    break;
            }
        }
    }
    private localizeDialogs(enableRtl?: boolean): void {
        if (this.locale !== '') {
            const l10n: L10n = new L10n('documenteditor', this.defaultLocale);
            l10n.setLocale(this.locale);
            if (!isNullOrUndefined(enableRtl)) {
                this.documentHelper.dialog.enableRtl = enableRtl;
                this.documentHelper.dialog2.enableRtl = enableRtl;
            }
            if (this.optionsPaneModule) {
                this.optionsPaneModule.initOptionsPane(l10n, enableRtl);
            }
            if (this.paragraphDialogModule) {
                this.paragraphDialogModule.initParagraphDialog(l10n);
            }
            if (this.footNotesDialogModule) {
                this.footNotesDialogModule.notesDialog(l10n, enableRtl);
            }
            if (this.pageSetupDialogModule) {
                this.pageSetupDialogModule.initPageSetupDialog(l10n, enableRtl);
            }
            if (this.columnsDialogModule) {
                this.columnsDialogModule.initColumnsDialog(l10n, enableRtl);
            }
            if (this.fontDialogModule) {
                this.fontDialogModule.initFontDialog(l10n, enableRtl);
            }
            if (this.hyperlinkDialogModule) {
                this.hyperlinkDialogModule.initHyperlinkDialog(l10n, enableRtl);
            }
            if (this.contextMenuModule) {
                this.contextMenuModule.contextMenuInstance.destroy();
                this.contextMenuModule.initContextMenu(l10n, enableRtl);
            }
            if (this.listDialogModule) {
                this.listDialogModule.initListDialog(l10n, enableRtl);
            }
            if (this.tablePropertiesDialogModule) {
                this.tablePropertiesDialogModule.initTablePropertyDialog(l10n, enableRtl);
            }
            if (this.bordersAndShadingDialogModule) {
                this.bordersAndShadingDialogModule.initBordersAndShadingsDialog(l10n, enableRtl);
            }
            if (this.cellOptionsDialogModule) {
                this.cellOptionsDialogModule.initCellMarginsDialog(l10n, enableRtl);
            }
            if (this.tableOptionsDialogModule) {
                this.tableOptionsDialogModule.initTableOptionsDialog(l10n, enableRtl);
            }
            if (this.tableDialogModule) {
                this.tableDialogModule.initTableDialog(l10n);
            }
            if (this.styleDialogModule) {
                this.styleDialogModule.initStyleDialog(l10n, enableRtl);
            }
            if (this.tabDialogModule) {
                this.tabDialogModule.initTabsDialog(l10n, enableRtl);
            }
            if (this.tableOfContentsDialogModule) {
                this.tableOfContentsDialogModule.initTableOfContentDialog(l10n, enableRtl);
            }
            if (this.commentReviewPane && this.commentReviewPane.parentPaneElement) {
                if (this.enableRtl) {
                    classList(this.commentReviewPane.parentPaneElement, ['e-rtl'], []);
                } else {
                    classList(this.commentReviewPane.parentPaneElement, [], ['e-rtl']);
                }
            }
        }
    }
    /**
     * Sets the default character format for document editor
     *
     * @param {CharacterFormatProperties} characterFormat Specifies the character format.
     * @returns {void}
     */
    public setDefaultCharacterFormat(characterFormat: CharacterFormatProperties): void {
        this.characterFormat = JSON.parse(HelperMethods.sanitizeString(JSON.stringify(characterFormat)));
        this.documentHelper.setDefaultDocumentFormat();
        if (!isNullOrUndefined(this.selection)) {
            this.selection.retrieveCurrentFormatProperties();
        }
    }

    /**
     * Sets the default paragraph format for document editor
     *
     * @param {ParagraphFormatProperties} paragraphFormat Specifies the paragraph format.
     * @returns {void}
     */
    public setDefaultParagraphFormat(paragraphFormat: ParagraphFormatProperties): void {
        this.paragraphFormat = JSON.parse(HelperMethods.sanitizeString(JSON.stringify(paragraphFormat)));
        this.documentHelper.setDefaultDocumentFormat();
        if (!isNullOrUndefined(this.selection)) {
            this.selection.retrieveCurrentFormatProperties();
        }
    }

    /**
     * Sets the default section format for document editor
     *
     * @param {SectionFormatProperties} sectionFormat Specifies the section format.
     * @returns {void}
     */
    public setDefaultSectionFormat(sectionFormat: SectionFormatProperties): void {
        this.sectionFormat = JSON.parse(HelperMethods.sanitizeString(JSON.stringify(sectionFormat)));
        this.documentHelper.setDefaultDocumentFormat();
        if (!isNullOrUndefined(this.selection)) {
            this.selection.retrieveCurrentFormatProperties();
        }
    }

    /**
     * Gets the properties to be maintained in the persisted state.
     *
     * @private
     * @returns {string} - Returns the persisted data.
     */
    public getPersistData(): string {
        return 'documenteditor';
    }
    private clearPreservedCollectionsInViewer(): void {
        if (this.viewer instanceof LayoutViewer) {
            this.documentHelper.clearDocumentItems();
        }
    }
    /**
     * @private
     * @returns {HTMLElement} - Returns the document editor element.
     */
    public getDocumentEditorElement(): HTMLElement {
        return this.element as HTMLElement;
    }
    /**
     * @private
     * @returns {void}
     */
    public fireContentChange(): void {
        if(this.enableEditor && this.editor.isIncrementalSave) {
            return;
        }
        if (this.enableLockAndEdit && this.collaborativeEditingModule) {
            this.collaborativeEditingModule.saveContent();
        }
        const eventArgs: ContentChangeEventArgs = { source: this };
        if (this.enableCollaborativeEditing) {
            eventArgs.operations = [];
            if (this.isSettingOp) {
                eventArgs.operations = this.documentSettingOps;
                this.documentSettingOps = [];
                this.isSettingOp = false;
            } else {
                if (!isNullOrUndefined(this.editorHistory)) {
                    if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo) && this.editorHistory.currentHistoryInfo.action != 'ApplyStyle' && this.editorHistory.currentHistoryInfo.action != 'TableMarginsSelection' && this.editorHistory.currentHistoryInfo.action != 'CellMarginsSelection') {
                        if (this.editorHistory.currentHistoryInfo.action === 'IMEInput') {
                            eventArgs.operations = this.editorHistory.currentHistoryInfo.getActionInfo();
                        }
                    } else if (!isNullOrUndefined(this.editorHistory.lastOperation)) {
                        let history: BaseHistoryInfo = this.editorHistory.lastOperation;
                        if (history.action === 'IMEInput') {
                            eventArgs.operations = history.getActionInfo(true);
                        } else {
                            eventArgs.operations = history.getActionInfo();
                        }
                    }
                    if (this.enableTrackChanges && eventArgs.operations.length > 0) {
                        for (let i: number = 0; i < eventArgs.operations.length; i++) {
                            if (isNullOrUndefined(eventArgs.operations[i].markerData)) {
                                eventArgs.operations[i].markerData = {};
                            }
                            eventArgs.operations[i].markerData.author = this.currentUser;
                        }
                    }
                }
            }
        }
        this.trigger(contentChangeEvent, eventArgs);
    }
    /** 
     * @private
     * @returns {void}
     */
    public fireDocumentChange(): void {
        if (this.enableLockAndEdit && this.enableEditor) {
            this.editor.enforceProtection('', false, true);
        }
        const eventArgs: DocumentChangeEventArgs = { source: this };
        this.trigger(documentChangeEvent, eventArgs);
    }
    /**
     * @private
     * @returns {void}
     */
    public fireSelectionChange(): void {
        if(this.enableEditor && this.editor.isIncrementalSave) {
            return;
        }
        if (!this.documentHelper.isCompositionStart && Browser.isDevice && this.editorModule) {
            this.editorModule.predictText();
        }
        const eventArgs: SelectionChangeEventArgs = { source: this, isCompleted: this.documentHelper.isCompleted };
        // if (this.createdTriggered) {
        this.trigger(selectionChangeEvent, eventArgs);
        this.documentHelper.isSelectionCompleted = this.documentHelper.isCompleted;
        this.documentHelper.isCompleted = true;
        // }
    }
    /**
     * @private
     * @returns {void}
     */
    public fireZoomFactorChange(): void {
        const eventArgs: ZoomFactorChangeEventArgs = { source: this };
        this.trigger(zoomFactorChangeEvent, eventArgs);
        this.notify(internalZoomFactorChange, eventArgs);
    }
    /**
     * @private
     * @returns {void}
     */
    public fireBeformFieldFill(): void {
        const eventArgs: FormFieldFillEventArgs = {};
        this.trigger(beforeFieldFillEvent, eventArgs);
    }
    /**
     * @private
     * @returns {void}
     */
    public fireAfterFormFieldFill(): void {
        const eventArgs: FormFieldFillEventArgs = {};
        this.trigger(afterFieldFillEvent, eventArgs);
    }

    /**
     * @private
     * @param {ServiceFailureArgs} eventArgs - Specifies the event args.
     * @returns {void}
     */
    public fireServiceFailure(eventArgs: ServiceFailureArgs): void {
        this.trigger(serviceFailureEvent, eventArgs);
    }
    /**
     * @private
     * @returns {void}
     */
    public fireViewChange(): void {
        if (this.viewer && this.documentHelper.pages.length > 0) {
            if ((this.viewer as PageLayoutViewer).visiblePages.length > 0) {
                const pages: Page[] = (this.viewer as PageLayoutViewer).visiblePages;
                const eventArgs: ViewChangeEventArgs = {
                    startPage: pages[0].index + 1,
                    endPage: pages[pages.length - 1].index + 1,
                    source: this
                };
                this.trigger(viewChangeEvent, eventArgs);
                this.notify(internalviewChangeEvent, eventArgs);
            }
        }
    }
    /**
     * @private
     * @param {string} item - Specifies the menu items.
     * @returns {void}
     */
    public fireCustomContextMenuSelect(item: string): void {
        const eventArgs: CustomContentMenuEventArgs = { id: item };
        this.trigger(customContextMenuSelectEvent, eventArgs);
    }
    /**
     * @private
     * @param {string[]} item - Specifies the menu items.
     * @returns {void}
     */
    public fireCustomContextMenuBeforeOpen(item: string[]): void {
        const eventArgs: BeforeOpenCloseCustomContentMenuEventArgs = { ids: item };
        this.trigger(customContextMenuBeforeOpenEvent, eventArgs);
    }
    /**
     * Shows the Paragraph dialog
     *
     * @private
     * @param {WParagraphFormat} paragraphFormat - Specifies the paragraph format.
     * @returns {void}
     */
    public showParagraphDialog(paragraphFormat?: WParagraphFormat): void {
        if (this.paragraphDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.paragraphDialogModule.show(paragraphFormat);
        }
    }
    /**
     * Shows the margin dialog
     *
     * @private
     * @returns {void}
     */
    public showPageSetupDialog(): void {
        if (this.pageSetupDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.pageSetupDialogModule.show();
        }
    }
    /**
     * Shows insert columns dialog
     *
     * @private
     * @returns {void}
     */
    public showColumnsDialog(): void {
        if (this.columnsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.columnsDialogModule.show();
        }
    }
    /**
     * Shows the Footnote dialog
     *
     * @private
     * @returns {void}
     */
    public showFootNotesDialog(): void {
        if (this.footNotesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.footNotesDialogModule.show();
        }
    }
    /**
     * Shows the font dialog
     *
     * @private
     * @param {WCharacterFormat} characterFormat - Specifies character format.
     * @returns {void}
     */
    public showFontDialog(characterFormat?: WCharacterFormat): void {
        if (this.fontDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.fontDialogModule.showFontDialog(characterFormat);
        }
    }
    /**
     * Shows the cell option dialog
     *
     * @private
     * @returns {void}
     */
    public showCellOptionsDialog(): void {
        if (this.cellOptionsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.cellOptionsDialogModule.show();
        }
    }
    /**
     * Shows the table options dialog.
     *
     * @private
     * @returns {void}
     */
    public showTableOptionsDialog(): void {
        if (this.tableOptionsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableOptionsDialogModule.show();
        }
    }
    /**
     * Shows insert table dialog
     *
     * @private
     * @returns {void}
     */
    public showTableDialog(): void {
        if (this.tableDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableDialogModule.show();
        }
    }
    /**
     * Shows the table of content dialog
     *
     * @private
     * @returns {void}
     */
    public showTableOfContentsDialog(): void {
        if (this.tableOfContentsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableOfContentsDialogModule.show();
        }
    }
    /**
     * Shows the style dialog
     *
     * @private
     * @returns {void}
     */
    public showStyleDialog(): void {
        if (this.styleDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.styleDialogModule.show();
        }
    }
    /**
     * Shows the hyperlink dialog
     *
     * @private
     * @returns {void}
     */
    public showHyperlinkDialog(): void {
        if (this.hyperlinkDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.hyperlinkDialogModule.show();
        }
    }
    /**
     * Shows the bookmark dialog.
     *
     * @private
     * @returns {void}
     */
    public showBookmarkDialog(): void {
        if (this.bookmarkDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.bookmarkDialogModule.show();
        }
    }
    /**
     * Shows the styles dialog.
     *
     * @private
     * @returns {void}
     */
    public showStylesDialog(): void {
        if (this.stylesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.stylesDialogModule.show();
        }
    }
    /**
     * Shows the List dialog
     *
     * @private
     * @returns {void}
     */
    public showListDialog(): void {
        if (this.listDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.listDialogModule.showListDialog();
        }
    }
    /**
     * Shows the table properties dialog
     *
     * @private
     * @returns {void}
     */
    public showTablePropertiesDialog(): void {
        if (this.tablePropertiesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tablePropertiesDialogModule.show();
        }
    }
    /**
     * Shows the borders and shading dialog
     *
     * @private
     * @returns {void}
     */
    public showBordersAndShadingDialog(): void {
        if (this.bordersAndShadingDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.bordersAndShadingDialogModule.show();
        }
    }
    /* eslint-disable  */
    protected requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];

        if(this.enableCollaborativeEditing) {
            modules.push({
                member: 'CollaborativeEditingHandler', args: [this]
            });
        }
        if (this.enableLockAndEdit) {
            modules.push({
                member: 'CollaborativeEditing', args: [this]
            });
        }
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: []
            });
        }
        if (this.enableSfdtExport || this.enableWordExport || this.enableTextExport || this.enableSelection || this.enableEditor) {
            modules.push({
                member: 'SfdtExport', args: [this.documentHelper]
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
                    member: 'ContextMenu', args: [this.documentHelper]
                });
            }
        }
        if (this.enableSearch) {
            modules.push({
                member: 'Search', args: [this]
            });
            if (this.enableOptionsPane) {
                modules.push({
                    member: 'OptionsPane', args: [this.documentHelper]
                });
            }
        }
        if (this.documentEditorSettings && this.documentEditorSettings.enableOptimizedTextMeasuring) {
            DocumentEditor.Inject(Optimized);
            modules.push({ member: 'Optimized', args: [this.documentHelper] });
        } else {
            DocumentEditor.Inject(Regular);
            modules.push({ member: 'Regular', args: [this.documentHelper] });
        }
        if (this.enableEditor) {
            modules.push({
                member: 'Editor', args: [this.documentHelper]
            });
            if (this.enableImageResizer) {
                modules.push({
                    member: 'ImageResizer', args: [this, this.documentHelper]
                });
            }
            if (this.enableEditorHistory) {
                modules.push({
                    member: 'EditorHistory', args: [this]
                });
            }
            if (this.enableHyperlinkDialog) {
                modules.push({
                    member: 'HyperlinkDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableDialog) {
                modules.push({
                    member: 'TableDialog', args: [this.documentHelper]
                });
            }
            if (this.enableBookmarkDialog) {
                modules.push({
                    member: 'BookmarkDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableOfContentsDialog) {
                modules.push({
                    member: 'TableOfContentsDialog', args: [this.documentHelper]
                });
            }
            if (this.enablePageSetupDialog) {
                modules.push({
                    member: 'PageSetupDialog', args: [this.documentHelper]
                });
            }
            if (this.enableColumnsDialog) {
                modules.push({
                    member: 'ColumnsDialog', args: [this.documentHelper]
                });
            }
            if (this.enableFootnoteAndEndnoteDialog) {
                modules.push({
                    member: 'FootNotesDialog', args: [this.documentHelper]
                });
            }
            if (this.enableStyleDialog) {
                modules.push({
                    member: 'StylesDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'StyleDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'BulletsAndNumberingDialog', args: [this.documentHelper]
                });
            }
            if (this.enableListDialog) {
                modules.push({
                    member: 'ListDialog', args: [this.documentHelper]
                });
            }
            if (this.enableParagraphDialog) {
                modules.push({
                    member: 'ParagraphDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'TabDialog', args: [this.documentHelper]
                });
            }
            if (this.enableFontDialog) {
                modules.push({
                    member: 'FontDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTablePropertiesDialog) {
                modules.push({
                    member: 'TablePropertiesDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'CellOptionsDialog', args: [this.documentHelper]
                });
            }
            if (this.enableBordersAndShadingDialog) {
                modules.push({
                    member: 'BordersAndShadingDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableOptionsDialog) {
                modules.push({
                    member: 'TableOptionsDialog', args: [this.documentHelper]
                });
            }
            if (this.enableSpellCheck) {
                modules.push({
                    member: 'SpellChecker', args: [this.documentHelper]
                });
                modules.push({
                    member: 'SpellCheckDialog', args: [this.documentHelper]
                });
            }
            if (this.enableFormField) {
                modules.push({
                    member: 'TextFormFieldDialog', args: [this]
                });
                modules.push({
                    member: 'DropDownFormFieldDialog', args: [this]
                });
                modules.push({
                    member: 'CheckBoxFormFieldDialog', args: [this]
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
        'Ok': 'OK',
        'Apply': 'Apply',
        'Alt Text': 'Alt Text',
        'Title': 'Title',
        'Description': 'Description',
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
        'Decimal': 'Decimal',
        'Bar': 'Bar',
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
        'Style': 'Style',
        'Width': 'Width',
        'Height': 'Height',
        'Letter': 'Letter',
        '1, 2, 3, ...': '1, 2, 3, ...',
        'a, b, c, ...': 'a, b, c, ...',
        'A, B, C, ...': 'A, B, C, ...',
        'I, II, III, ...': 'I, II, III, ...',
        'i, ii, iii, ...': 'i, ii, iii, ...',
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
        'First Page Header': 'First Page Header',
        'First Page Footer': 'First Page Footer',
        'Even Page Header': 'Even Page Header',
        'Even Page Footer': 'Even Page Footer',
        'Odd Page Header': 'Odd Page Header',
        'Odd Page Footer': 'Odd Page Footer',
        'Same as Previous': 'Same as Previous',
        'Section': 'Section',
        'Margin': 'Margins',
        'Paper': 'Paper',
        'Layout': 'Layout',
        'Orientation': 'Orientation',
        'Landscape': 'Landscape',
        'Portrait': 'Portrait',
        'Show page numbers': 'Show page numbers',
        'Right align page numbers': 'Right align page numbers',
        'Nothing': 'Nothing',
        'Tab leader': 'Tab leader',
        'Leader': 'Leader',
        'Show levels': 'Show levels',
        'Use hyperlinks instead of page numbers': 'Use hyperlinks instead of page numbers',
        'Build table of contents from': 'Build table of contents from',
        'Styles': 'Styles',
        'Available styles': 'Available styles',
        'TOC level': 'TOC level',
        'Heading': 'Heading',
        'Heading 1': 'Heading 1',
        'Heading 2': 'Heading 2',
        'Heading 3': 'Heading 3',
        'Heading 4': 'Heading 4',
        'Heading 5': 'Heading 5',
        'Heading 6': 'Heading 6',
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
        'ScreenTip text': 'ScreenTip text',
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
        'Linked Style': 'Linked(Paragraph and Character)',
        'Character': 'Character',
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
        'Tab': 'Tab',
        'Tab stop position': 'Tab stop position',
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
        'InsertFootnote': 'InsertFootnote',
        'InsertEndnote': 'InsertEndnote',
        'Footnote': 'Footnote',
        'Endnote': 'Endnote',
        'Notes Options': 'Notes Options',
        'Bullets': 'Bullets',
        'Use bookmarks': 'Use bookmarks',
        'Table of Contents': 'Table of Contents',
        'AutoFit': 'AutoFit',
        'AutoFit to Contents': 'AutoFit to Contents',
        'AutoFit to Window': 'AutoFit to Window',
        'Fixed Column Width': 'Fixed Column Width',
        'Reset': 'Reset',
        'Match case': 'Match case',
        'Whole words': 'Whole words',
        'Add': 'Add',
        'Go To': 'Go To',
        'Search for': 'Search for',
        'Replace with': 'Replace with',
        'TOC 1': 'TOC 1',
        'TOC 2': 'TOC 2',
        'TOC 3': 'TOC 3',
        'TOC 4': 'TOC 4',
        'TOC 5': 'TOC 5',
        'TOC 6': 'TOC 6',
        'TOC 7': 'TOC 7',
        'TOC 8': 'TOC 8',
        'TOC 9': 'TOC 9',
        'Right-to-left': 'Right-to-left',
        'Left-to-right': 'Left-to-right',
        'Direction': 'Direction',
        'Table direction': 'Table direction',
        'Indent from right': 'Indent from right',
        /* eslint-disable */
        "Contextual Spacing": "Don't add space between paragraphs of the same style",
        "Password Mismatch": "The password don't match",
        'Restrict Editing': 'Restrict Editing',
        'Formatting restrictions': 'Formatting restrictions',
        'Allow formatting': 'Allow formatting',
        'Editing restrictions': 'Editing restrictions',
        'Read only': 'Read only',
        'Exceptions Optional': 'Exceptions (optional)',
        'Select Part Of Document And User': 'Select parts of the document and choose users who are allowed to freely edit them.',
        'Everyone': 'Everyone',
        'More users': 'More users',
        'Add Users': 'Add Users',
        'Enforcing Protection': 'Yes, Start Enforcing Protection',
        'Start Enforcing Protection': 'Start Enforcing Protection',
        'Enter User': 'Enter User',
        'Users': 'Users',
        'Enter new password': 'Enter new password',
        'Reenter new password to confirm': 'Reenter new password to confirm',
        'Your permissions': 'Your permissions',
        'Protected Document': 'This document is protected from unintentional editing.',
        'FormFieldsOnly': 'You may only fill in forms in this region.',
        'CommentsOnly': 'You may only insert comments into this region.',
        'ReadOnlyProtection': 'You may edit in this region.',
        'Stop Protection': 'Stop Protection',
        'Password': 'Password',
        'Spelling Editor': 'Spelling Editor',
        'Spelling': 'Spelling',
        'Spell Check': 'Spell Check',
        'Underline errors': 'Underline errors',
        'Ignore': 'Ignore',
        'Ignore All': 'Ignore All',
        'Add to Dictionary': 'Add to Dictionary',
        'Change': 'Change',
        'Change All': 'Change All',
        'Suggestions': 'Suggestions',
        'The password is incorrect': 'The password is incorrect',
        'Error in establishing connection with web server': 'Error in establishing connection with web server',
        'Highlight the regions I can edit': 'Highlight the regions I can edit',
        'Show All Regions I Can Edit': 'Show All Regions I Can Edit',
        'Find Next Region I Can Edit': 'Find Next Region I Can Edit',
        'Keep source formatting': 'Keep source formatting',
        'Match destination formatting': 'Match destination formatting',
        'InsertAsRows': 'Insert as New Rows',
        'InsertAsColumns': 'Insert as New Columns',
        'OverwriteCells': 'Overwrite Cells',
        'NestTable': 'Nest Table',
        'Text only': 'Text only',
        'Comments': 'Comments',
        'Type your comment': 'Type your comment',
        'Post': 'Post',
        'Reply': 'Reply',
        'New Comment': 'New Comment',
        'Edit': 'Edit',
        'Resolve': 'Resolve',
        'Reopen': 'Reopen',
        'No comments in this document': 'No comments in this document',
        'more': 'more',
        'Type your comment here': 'Type your comment here',
        'Next Comment': 'Next Comment',
        'Previous Comment': 'Previous Comment',
        'Un-posted comments': 'Un-posted comments',
        'Discard Comment': 'Added comments not posted. If you continue, that comment will be discarded.',
        'No Headings': 'No Heading Found!',
        'Add Headings': 'This document has no headings. Please add headings and try again.',
        'More Options': 'More Options',
        'Click to see this comment': 'Click to see this comment',
        'Form Fields': 'Form Fields',
        'Text Form': 'Text Form',
        'Check Box': 'Check Box',
        'Drop Down Form Field': 'Drop Down Form Field',
        'Dropdown items': 'Drop-down items',
        'Items in dropdown list': 'Items in drop-down list',
        'ADD': 'ADD',
        'REMOVE': 'REMOVE',
        'Field settings': 'Field settings',
        'Tooltip': 'Tooltip',
        'Dropdown enabled': 'Drop-down enabled',
        'Check Box Form Field': 'Check Box Form Field',
        'Check box size': 'Check box size',
        'Auto': 'Auto',
        'Default value': 'Default value',
        'Not checked': 'Not checked',
        'Checked': 'Checked',
        'Check box enabled': 'Check box enabled',
        'Text Form Field': 'Text Form Field',
        'Type': 'Type',
        'Default text': 'Default text',
        'Maximum length': 'Maximum length',
        'Text format': 'Text format',
        'Fillin enabled': 'Fill-in enabled',
        'Default number': 'Default number',
        'Default date': 'Default date',
        'Date format': 'Date format',
        'Merge Track': 'This action wont be marked as change. Do you want to continue?',
        'UnTrack': 'Cannot be tracked !',
        'Accept': 'Accept',
        'Reject': 'Reject',
        'Previous Changes': 'Previous Changes',
        'Next Changes': 'Next Changes',
        'Inserted': 'Inserted',
        'Deleted': 'Deleted',
        'Move From': 'Move From',
        'Move To': 'Move To',
        'Changes': 'Changes',
        'Accept all': 'Accept all',
        'Reject all': 'Reject all',
        'No changes': 'No changes',
        'Accept Changes': 'Accept Changes',
        'Reject Changes': 'Reject Changes',
        'User': 'User',
        'View': 'View',
        'Insertion': 'Insertion',
        'Deletion': 'Deletion',
        'All caps': 'All caps',
        'This region is locked by': 'This region is locked by',
        'Lock': 'Lock',
        'Unlock': 'Unlock',
        'Already locked': 'Selected or part of region is already locked by another user',
        'Click to View/Edit Footnote': 'Click to View/Edit Footnote',
        'Click to View/Edit Endnote': 'Click to View/Edit Endnote',
        'Multiple Comment': 'Please post your comment',
        'No suggestions': 'No suggestions',
        'More Suggestion': 'More Suggestion',
        'Ignore Once': 'Ignore Once',
        'Keep With Next': 'Keep with next',
        'Keep Lines Together': 'Keep lines together',
        'WidowControl': 'Widow/Orphan control',
        'Indents and Spacing': 'Indents and Spacing',
        'Line and Page Breaks': 'Line and Page Breaks',
        'Pagination': 'Pagination',
        'Single': 'Single',
        'DashSmallGap': 'DashSmallGap',
        'DashDot': 'DashDot',
        'Double': 'Double',
        'ThinThickSmallGap': 'ThinThickSmallGap',
        'ThickThinSmallGap': 'ThickThinSmallGap',
        'ThickThinMediumGap': 'ThickThinMediumGap',
        'ThickThinLargeGap': 'ThickThinLargeGap',
        'SingleWavy': 'SingleWavy',
        'DoubleWavy': 'DoubleWavy',
        'Inset': 'Inset',
        'DashLargeGap': 'DashLargeGap',
        'Dot': 'Dot',
        'DashDotDot': 'DashDotDot',
        'Triple': 'Triple',
        'ThinThickThinSmallGap': 'ThinThickThinSmallGap',
        'ThinThickThinMediumGap': 'ThinThickThinMediumGap',
        'ThinThickThinLargeGap': 'ThinThickThinLargeGap',
        'DashDotStroked': 'DashDotStroked',
        'Engrave3D': 'Engrave3D',
        'Thick': 'Thick',
        'Outset': 'Outset',
        'Emboss3D': 'Emboss3D',
        'ThinThickLargeGap': 'ThinThickLargeGap',
        'ThinThickMediumGap': 'ThinThickMediumGap',
        'Number of rows must be between': 'Number of rows must be between',
        'Number of columns must be between': 'Number of columns must be between',
        'and': 'and',
        'Unlimited': 'Unlimited',
        'Regular text': 'Regular text',
        'Date': 'Date',
        'Uppercase': 'Uppercase',
        'Lowercase': 'Lowercase',
        'FirstCapital': 'FirstCapital',
        'TitleCase': 'Titlecase',
        'Filling in forms': 'Filling in forms',
        'px': 'px',
        'Tracked changes': 'Tracked changes',
        'TrackChangesOnly': 'You may edit in this region, but all change will be tracked.',
        'RemovedIgnoreExceptions': 'If you make this change in document protection, Word will ignore all the exceptions in this document.',
        'RemovedIgnore': 'Do you want to remove the ignored exceptions?',
        'Information': 'Information',
        'Yes': 'Yes',
        'No': 'No',
        'Page Break': 'Page Break',
        'Column Break': 'Column Break',
        'Section Break Next Page': 'Section Break (Next Page)',
        'Section Break Continuous': 'Section Break (Continuous)',
        'Unsupported format': 'The file format you have selected isn\'t supported. Please choose valid format.',
        'One': 'One',
        'Two': 'Two',
        'Three': 'Three',
        'Presets': 'Presets',
        'Columns': 'Columns',
        'Split your text into two or more columns': 'Split your text into two or more columns',
        'Line between column': 'Line between column',
        'Width and Spacing': 'Width and Spacing',
        'Equal column width': 'Equal column width',
        'Column': 'Column',
        'Paste Content Dialog': 'Due to browser’s security policy, paste from system clipboard is restricted. Alternatively use the keyboard shortcut',
        'Paste Content CheckBox': 'Don’t show again',
        'BookMarkList': 'List of bookmarks in the document',
        'TabMarkList': 'List of tab stops in the paragraph',
        'Default tab stops': 'Default tab stops',
        'Tab stops to be cleared': 'Tab stops to be cleared',
        'Tabs': 'Tabs',
        'Set': 'Set',
        'Clear': 'Clear',
        'Clear All': 'Clear All',
        'Discard': 'Discard',
        'The top/bottom margins are too large for the page height in some sections.': 'The top/bottom margins are too large for the page height in some sections.',
        'Column width cannot be less than 36 pt.': 'Column width cannot be less than 36 pt.',
        'Left and right margins.': 'Settings you chose for the left and right margins, column spacing, or pargraph indents are too large for the page width in same secitions.',
        'Left Indent': 'Left Indent',
        'Right Indent': 'Right Indent',
        'Hanging Indent': 'Hanging Indent',
        'First Line Indent': 'First Line Indent',
        'Left Margin': 'Left Margin',
        'Right Margin': 'Right Margin',
        'Top Margin': 'Top Margin',
        'Bottom Margin': 'Bottom Margin',
        'Left Tab': 'Left Tab',
        'Right Tab': 'Right Tab',
        'Center Tab': 'Center Tab',
        'Decimal Tab': 'Decimal Tab',
        'Bar Tab': 'Bar Tab',
        'Move Table Column': 'Move Table Column',
    };
    /* eslint-enable */
    // Public Implementation Starts
    /**
     * Opens the given Sfdt text.
     *
     * @param {string} sfdtText Specifies the sfdt text.
     * @returns {void}
     */
    public open(sfdtText: string): void {
        // sfdtText = HelperMethods.sanitizeString(sfdtText);
        if (!isNullOrUndefined(this.viewer)) {
            this.clearPreservedCollectionsInViewer();
            this.documentHelper.userCollection.push('Everyone');
            this.documentHelper.lists = [];
            this.documentHelper.abstractLists = [];
            this.documentHelper.styles = new WStyles();
            this.documentHelper.cachedPages = [];
            this.clearSpellCheck();
            if (this.isSpellCheck) {
                if (this.isSpellCheck && !this.spellChecker.enableOptimizedSpellCheck) {
                    this.documentHelper.triggerElementsOnLoading = true;
                    this.documentHelper.triggerSpellCheck = true;
                }
            }
            if (!isNullOrUndefined(sfdtText) && this.viewer) {
                let incrementalOps: Record<string, ActionInfo[]> = {};
                this.documentHelper.setDefaultDocumentFormat();
                this.documentHelper.onDocumentChanged(this.parser.convertJsonToDocument(sfdtText, incrementalOps), incrementalOps);
                if (this.editorModule) {
                    this.editorModule.intializeDefaultStyles();
                }
            }
            if (this.isSpellCheck) {
                if (this.isSpellCheck && !this.spellChecker.enableOptimizedSpellCheck) {
                    this.documentHelper.triggerElementsOnLoading = false;
                    this.documentHelper.triggerSpellCheck = false;
                }
            }
        }
    }
    /**
     * Scrolls view to start of the given page number if exists.
     *
     * @param {number} pageNumber Specifies the page number.
     * @returns {void}
     */
    public scrollToPage(pageNumber: number): boolean {
        if (isNullOrUndefined(this.viewer) || pageNumber < 1 || pageNumber > this.documentHelper.pages.length) {
            return false;
        }
        this.viewer.scrollToPage(pageNumber - 1);
        return true;
    }
    /**
     * Enables all the modules.
     *
     * @returns {void}
     */
    public enableAllModules(): void {
        this.enablePrint = this.enableSfdtExport = this.enableWordExport = this.enableTextExport
            = this.enableSelection = this.enableContextMenu = this.enableSearch = this.enableOptionsPane
            = this.enableEditor = this.enableImageResizer = this.enableEditorHistory
            = this.enableHyperlinkDialog = this.enableTableDialog = this.enableBookmarkDialog
            = this.enableTableOfContentsDialog = this.enableFootnoteAndEndnoteDialog
            = this.enablePageSetupDialog = this.enableStyleDialog
            = this.enableListDialog = this.enableParagraphDialog = this.enableFontDialog
            = this.enableTablePropertiesDialog = this.enableBordersAndShadingDialog
            = this.enableTableOptionsDialog = this.enableSpellCheck = this.enableComment
            = this.enableFormField = this.enableColumnsDialog = true;
        /* eslint-disable-next-line max-len */
        DocumentEditor.Inject(Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, NotesDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, TabDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog, SpellChecker, SpellCheckDialog, CheckBoxFormFieldDialog, TextFormFieldDialog, DropDownFormFieldDialog, ColumnsDialog);
    }
    /**
     * Resizes the component and its sub elements based on given size or container size.
     *
     * @param {number} width Specifies the width
     * @param {number} height Specifies the hight
     * @returns {void}
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
                this.documentHelper.updateViewerSize();
            }
            if (this.trackChangesPane.toolbar) {
                this.trackChangesPane.toolbar.refreshOverflow();
            }
        }
        if (this.rulerHelper && this.documentEditorSettings && this.documentEditorSettings.showRuler) {
            this.rulerHelper.updateRuler(this, false);
        }
    }
    /**
     * Gets all the form field names in current document.
     *
     * @returns {string[]} Returns all the form field names in current document.
     */
    public getFormFieldNames(): string[] {
        const formFieldNames: string[] = [];
        const formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if (formFields[parseInt(i.toString(), 10)].formFieldData.name !== '') {
                formFieldNames.push(formFields[parseInt(i.toString(), 10)].formFieldData.name);
            }
        }
        return formFieldNames;
    }
    /**
     * Gets the form field by name
     *
     * @param {string} name - The form field name.
     * @returns {TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo} Returns the form field info.
     */
    public getFormFieldInfo(name: string): TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo {
        name = HelperMethods.sanitizeString(name);
        const formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if ((formFields[parseInt(i.toString(), 10)].formFieldData.name === name) && (formFields[parseInt(i.toString(), 10)].formFieldData.name !== '')) {
                return formFields[parseInt(i.toString(), 10)].formFieldData.getFormFieldInfo();
            }
        }
        return undefined;
    }
    /**
     * Sets the form field info with the specified name.
     *
     * @param {string} name Specifies the form field name
     * @param {TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo} formFieldInfo - Form Field info.
     * @returns {void}
     */
    public setFormFieldInfo(name: string, formFieldInfo: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo): void {
        name = HelperMethods.sanitizeString(name);
        const formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if ((formFields[parseInt(i.toString(), 10)].formFieldData.name === name) && (formFields[parseInt(i.toString(), 10)].formFieldData.name !== '')) {
                const currentField: FieldElementBox = formFields[parseInt(i.toString(), 10)];
                if (this.selection) {
                    this.selection.selectFieldInternal(currentField);
                    if (this.editor) {
                        this.editor.setFormField(currentField, formFieldInfo);
                    }
                }
                return;
            }
        }
    }
    /**
     * Resets the form field value to default with the specified form field name.
     *
     * @param {string} name Specifies the form field name
     * @returns {void}
     */
    public resetFormFields(name?: string): void {
        if (!isNullOrUndefined(name)) {
            name = HelperMethods.sanitizeString(name);
        }
        const formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if (isNullOrUndefined(name) || name === formFields[parseInt(i.toString(), 10)].formFieldData.name) {
                if (formFields[parseInt(i.toString(), 10)].formFieldData instanceof TextFormField) {
                    this.editor.updateFormField(formFields[parseInt(i.toString(), 10)], (formFields[parseInt(i.toString(), 10)].formFieldData as TextFormField).defaultValue, true);
                } else if (formFields[parseInt(i.toString(), 10)].formFieldData instanceof CheckBoxFormField) {
                    /* eslint-disable-next-line max-len */
                    this.editor.toggleCheckBoxFormField(formFields[parseInt(i.toString(), 10)], true, (formFields[parseInt(i.toString(), 10)].formFieldData as CheckBoxFormField).defaultValue);
                } else if (formFields[parseInt(i.toString(), 10)].formFieldData instanceof DropDownFormField) {
                    this.editor.updateFormField(formFields[parseInt(i.toString(), 10)], 0, true);
                }
            }
        }
    }
    /**
     * Imports the form field values.
     *
     * @param {FormFieldData[]} formData Specifies the form field values.
     * @returns {void}
     */
    public importFormData(formData: FormFieldData[]): void {
        const formField: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formData.length; i++) {
            const formFieldData: FormFieldData = formData[parseInt(i.toString(), 10)];
            const fieldName: string = formFieldData.fieldName;
            for (let j: number = 0; j < formField.length; j++) {
                if (formField[parseInt(j.toString(), 10)].formFieldData.name === fieldName) {
                    if (formField[parseInt(j.toString(), 10)].formFieldData instanceof CheckBoxFormField) {
                        this.editor.toggleCheckBoxFormField(formField[parseInt(j.toString(), 10)], true, formFieldData.value as boolean);
                    } else if (formField[parseInt(j.toString(), 10)].formFieldData instanceof TextFormField) {
                        this.editor.updateFormField(formField[parseInt(j.toString(), 10)], formFieldData.value as string);
                    } else if (formField[parseInt(j.toString(), 10)].formFieldData instanceof DropDownFormField) {
                        this.editor.updateFormField(formField[parseInt(j.toString(), 10)], formFieldData.value as number);
                    }
                }
            }
        }
    }
    /**
     * Exports the form field values.
     *
     * @returns {FormFieldData[]} Returns the form field data.
     */
    public exportFormData(): FormFieldData[] {
        const data: FormFieldData[] = [];
        const formField: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formField.length; i++) {
            if (formField[parseInt(i.toString(), 10)].formFieldData.name !== '') {
                const formData: FormFieldData = { fieldName: '', value: '' };
                formData.fieldName = (formField[parseInt(i.toString(), 10)].formFieldData as TextFormField).name;
                if (formField[parseInt(i.toString(), 10)].formFieldData instanceof CheckBoxFormField) {
                    formData.value = (formField[parseInt(i.toString(), 10)].formFieldData as CheckBoxFormField).checked;
                } else if (formField[parseInt(i.toString(), 10)].formFieldData instanceof TextFormField) {
                    let resultText: string = '';
                    if (this.documentHelper.isInlineFormFillProtectedMode) {
                        resultText = this.editorModule.getFieldResultText(formField[parseInt(i.toString(), 10)]);
                    } else {
                        resultText = formField[parseInt(i.toString(), 10)].resultText;
                    }
                    const rex: RegExp = RegExp(this.documentHelper.textHelper.getEnSpaceCharacter(), 'gi');
                    if (resultText.replace(rex, '') === '') {
                        resultText = '';
                    }
                    formData.value = resultText;
                } else if (formField[parseInt(i.toString(), 10)].formFieldData instanceof DropDownFormField) {
                    formData.value = (formField[parseInt(i.toString(), 10)].formFieldData as DropDownFormField).selectedIndex;
                }
                data.push(formData);
            }
        }
        return data;
    }
    /**
     * Updates the fields in the current document.
     * Currently cross reference field only supported.
     *
     * @returns {void}
     */
    public updateFields(): void {
        for (let i: number = 0; i < this.documentHelper.fields.length; i++) {
            const field: FieldElementBox = this.documentHelper.fields[parseInt(i.toString(), 10)];
            const code: string = this.selection.getFieldCode(field);
            if (code.toLowerCase().trim().indexOf('ref ') === 0) {
                const fieldPara: ParagraphWidget = field.line.paragraph;
                if(!isNullOrUndefined(fieldPara)
                    && !isNullOrUndefined(this.selection)
                    && !isNullOrUndefined(this.selection.getPage(fieldPara))) {
                    this.selection.updateRefField(field);
                }
            }
        }
    }
    /**
     * Shifts the focus to the document.
     *
     * @returns {void}
     */
    public focusIn(): void {
        if (this.viewer) {
            this.documentHelper.updateFocus();
        }
    }
    /**
     * Fits the page based on given fit type.
     *
     * @param {PageFitType} pageFitType - The default value of ‘pageFitType’ parameter is 'None'
     * @returns {void}
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
     * Exports the specified page as image.
     *
     * @param {number} pageNumber Specifies the page number starts from index `1`.
     * @param {number} format Specifies the image format.
     * @returns {HTMLImageElement} Returns the html image element.
     */
    public exportAsImage(pageNumber: number, format: ImageFormat): HTMLImageElement {
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation.');
        }
        if (this.printModule) {
            const mimeType: string = format === 'Png' ? 'image/png' : 'image/jpeg';
            return this.printModule.exportAsImage(this.documentHelper, pageNumber, mimeType);
        }
        return undefined;
    }

    /**
     * Exports the specified page as content.
     *
     * @param {number} pageNumber Specifies the page number starts from index `1`.
     * @private
     * @returns {string} Returns the page as content.
     */
    public exportAsPath(pageNumber: number): string {
        if (!isNullOrUndefined(pageNumber) && pageNumber <= this.documentHelper.pages.length && pageNumber >= 1) {
            const printPage: Page = this.documentHelper.pages[(pageNumber - 1)];
            this.documentHelper.render.isExporting = true;
            this.documentHelper.render.renderWidgets(printPage, 0, 0, 0, 0);
            //get the image data from the canvas
            const imageData: string = this.documentHelper.render.pageCanvas.toDataURL();
            (this.documentHelper.render.pageCanvas as DocumentCanvasElement).getContext("2d").renderedPath = "";
            this.documentHelper.render.isExporting = false;
            return imageData;
        }
        return undefined;
    }

    /**
     * Prints the document.
     *
     * @param {Window} printWindow - Default value of 'printWindow' parameter is undefined.
     * @returns {void}
     */
    public print(printWindow?: Window): void {
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation.');
        }
        if (this.printModule) {
            if (this.layoutType === 'Continuous') {
                this.documentHelper.isWebPrinting = true;
                this.viewer = new PageLayoutViewer(this);
                this.editor.layoutWholeDocument();
                this.printModule.print(this.documentHelper, printWindow);
                this.viewer = new WebLayoutViewer(this);
                this.editor.layoutWholeDocument();
                this.documentHelper.isWebPrinting = false;
            } else {
                this.printModule.print(this.documentHelper, printWindow);
            }
        } else {
            throw new Error('Invalid operation. Print is not enabled.');
        }
    }
    /**
     * Serializes the data to JSON string.
     *
     * @returns {string} Returns the data as JSON string.
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
     *
     * @param {string} fileName Specifies the file name.
     * @param {FormatType} formatType Specifies the format type.
     * @returns {void}
     */
    public save(fileName: string, formatType?: FormatType): void {
        if (!isNullOrUndefined(fileName)) {
            fileName = HelperMethods.sanitizeString(fileName);
        }
        fileName = fileName || 'Untitled';
        if (isNullOrUndefined(this.documentHelper)) {
            throw new Error('Invalid operation.');
        }
        if (formatType === 'Docx' || formatType === 'Dotx' && this.wordExportModule) {
            if (this.wordExportModule) {
                this.documentHelper.owner.sfdtExportModule.isWordExport = true;
                this.wordExportModule.save(this.documentHelper, fileName, formatType);
                this.documentHelper.owner.sfdtExportModule.isWordExport = false;
            }
        } else if (formatType === 'Txt' && this.textExportModule) {
            this.textExportModule.save(this.documentHelper, fileName);
        } else if (formatType === 'Sfdt' && this.enableSfdtExport && this.sfdtExportModule) {
            if (this.documentEditorSettings.optimizeSfdt) {
                const jsonString: string = this.serialize();
                const blob: Blob = new Blob([jsonString], {
                    type: 'application/json'
                });
                const archiveItem: ZipArchiveItem = new ZipArchiveItem(blob, "sfdt");
                const mArchive: ZipArchive = new ZipArchive();
                mArchive.addItem(archiveItem);
                mArchive.saveAsBlob().then((blob: Blob): void => {
                    this.zipArchiveBlobToSfdtFile(blob, fileName);
                });
            } else {
                const jsonString: string = this.serialize();
                const blob: Blob = new Blob([jsonString], {
                    type: 'application/json'
                });
                Save.save(fileName + '.sfdt', blob);
            }
        } else {
            throw new Error('Invalid operation. Specified export is not enabled.');
        }
    }
    private zipArchiveBlobToSfdtFile(blob: Blob, fileName: string): void {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function () {
            let dataUrl: string = reader.result as string;
            let base64 = dataUrl.split(',')[1];
            const jsonString: any = {};
            jsonString.sfdt = base64;
            const blob: Blob = new Blob([JSON.stringify(jsonString)], {
                type: 'application/json'
            });
            Save.save(fileName + '.sfdt', blob);
        };
    };
    /**
     * Saves the document as blob.
     *
     * @param {FormatType} formatType Specifies the format type.
     * @returns {Promise<Blob>} Returns the document as blob.
     */
    public saveAsBlob(formatType?: FormatType): Promise<Blob> {
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation');
        }
        return new Promise((resolve: (value: Blob | PromiseLike<Blob>) => void) => {
            if ((formatType === 'Docx' || formatType === 'Dotx') && this.wordExportModule) {
                resolve(this.wordExportModule.saveAsBlob(this.documentHelper, formatType));
            } else if (formatType === 'Txt' && this.textExportModule) {
                resolve(this.textExportModule.saveAsBlob(this.documentHelper));
            } else if (formatType === 'Sfdt' && this.enableSfdtExport && this.sfdtExportModule) {
                if (this.documentEditorSettings.optimizeSfdt) {
                    this.sfdtExportModule.saveAsBlob(this.documentHelper).then((blob: Blob) => {
                        this.getBase64StringFromBlob(blob).then((base64: string) => {
                            const jsonString: any = {};
                            jsonString.sfdt = base64;
                            const blob: Blob = new Blob([JSON.stringify(jsonString)], {
                                type: 'application/json'
                            });
                            resolve(blob);
                        });
                    });
                } else {
                    resolve(this.sfdtExportModule.saveAsBlobNonOptimized(this.documentHelper));
                }
            }
        });
    }
    private getBase64StringFromBlob(blob: Blob): Promise<string> {
        return new Promise((resolve: (value: string | PromiseLike<string>) => void, reject: (value: string | PromiseLike<string>) => void) => {
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function () {
                const dataUrl: string = reader.result as string;
                const base64: string = dataUrl.split(',')[1];
                resolve(base64);
            };
        });
    }
    /**
     * Opens a blank document.
     *
     * @returns {void}
     */
    public openBlank(): void {
        const sections: BodyWidget[] = [];
        sections.push(this.createNewBodyWidget());
        /* eslint-disable-next-line max-len */
        const hfs: HeaderFooters = this.parser.parseHeaderFooter({ header: {}, footer: {}, evenHeader: {}, evenFooter: {}, firstPageHeader: {}, firstPageFooter: {} }, undefined);
        if (this.viewer) {
            this.clearPreservedCollectionsInViewer();
            this.documentHelper.userCollection.push('Everyone');
            this.documentHelper.cachedPages = [];
            this.clearSpellCheck();
            this.documentHelper.setDefaultDocumentFormat();
            this.documentHelper.headersFooters.push(hfs);
            if (this.editorModule) {
                this.editorModule.intializeDefaultStyles();
                const style: WStyle = this.documentHelper.styles.findByName('Normal') as WStyle;
                for (let i: number = 0; i < sections.length; i++) {
                    let paragraph: ParagraphWidget = sections[parseInt(i.toString(), 10)].childWidgets[0] as ParagraphWidget;
                    paragraph.paragraphFormat.baseStyle = style;
                    paragraph.paragraphFormat.listFormat.baseStyle = style;
                }
            }
            this.documentHelper.onDocumentChanged(sections,{});
        }
    }
    /**
     * Gets the style names based on given style type.
     *
     * @param {StyleType} styleType Specifies the style type.
     * @returns {string[]} Returns the style names.
     */
    public getStyleNames(styleType?: StyleType): string[] {
        if (this.viewer) {
            return this.documentHelper.styles.getStyleNames(styleType);
        }
        return [];
    }
    /**
     * Gets the style objects on given style type.
     *
     * @param {StyleType} styleType Specifies the style type.
     * @returns {Object[]} Returns the Specifies styles.
     */
    public getStyles(styleType?: StyleType): Object[] {
        if (this.viewer) {
            return this.documentHelper.styles.getStyles(styleType);
        }
        return [];
    }
    /* eslint-enable */
    /**
     * Gets the bookmarks.
     *
     * @returns {string[]} Returns the bookmark collection.
     */
    public getBookmarks(): string[] {
        let bookmarks: string[] = [];
        if (this.viewer) {
            bookmarks = this.documentHelper.getBookmarks(true);
        }
        return bookmarks;
    }
    /**
     * Shows the dialog.
     *
     * @param {DialogType} dialogType Specifies the dialog type.
     * @returns {void}
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
            case 'Columns':
                this.showColumnsDialog();
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
            case 'SpellCheck':
                this.showSpellCheckDialog();
                break;
            // case 'TabStop':
            //     this.showTabDialog();
            //     break;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public toggleShowHiddenMarksInternal(): void {
        this.documentEditorSettings.showHiddenMarks = !this.documentEditorSettings.showHiddenMarks;
        this.notify(internalDocumentEditorSettingsChange, this.documentEditorSettings);
    }
    /**
     * Shows the options pane.
     *
     * @returns {void}
     */
    public showOptionsPane(): void {
        if (!isNullOrUndefined(this.optionsPaneModule) && !isNullOrUndefined(this.viewer)) {
            this.optionsPaneModule.showHideOptionsPane(true);
        }
    }
    /**
     * Shows the restrict editing pane.
     *
     * @param {boolean} show Specifies to show or hide restrict editing pane.
     * @returns {void}
     */
    public showRestrictEditingPane(show?: boolean): void {
        show = isNullOrUndefined(show) ? true : show;
        if (this.documentHelper && this.documentHelper.restrictEditingPane) {
            this.documentHelper.restrictEditingPane.showHideRestrictPane(show);
        }
    }
    /**
     * Shows the spell check dialog.
     *
     * @private
     * @returns {void}
     */
    public showSpellCheckDialog(): void {
        if (this.spellCheckDialogModule && this.spellChecker) {
            const element: ContextElementInfo = this.spellChecker.retriveText();
            if (!isNullOrUndefined(element)) {
                this.spellCheckDialogModule.show(element.text, element.element);
            }
        }
    }
    /**
     * Shows the tab dialog.
     *
     * @private
     * @returns {void}
     */
    public showTabDialog(): void {
        if (this.tabDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tabDialogModule.show();
        }
    }
    /**
     * Destroys all managed resources used by this object.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        this.destroyDependentModules();
        if (!isNullOrUndefined(this.documentHelper)) {
            this.documentHelper.destroy();
        }
        if (this.viewer) {
            this.viewer.componentDestroy();
        }
        this.viewer = undefined;
        if (!isNullOrUndefined(this.element)) {
            this.element.classList.remove('e-documenteditor');
            this.element.innerHTML = '';
        }
        if (!this.refreshing) {
            this.element = undefined;
        }
        if (this.parser) {
            this.parser.destroy();
            this.parser = undefined;
        }
        if (this.revisionsInternal) {
            this.revisionsInternal.destroy();
            this.revisionsInternal = undefined;
        }
        this.findResultsList = [];
        this.findResultsList = undefined;
        this.documentHelper = undefined;
    }
    /**
     * @private
     */
    public updateStyle(styleInCollection: WStyle, style: WStyle): void {
        if (!isNullOrUndefined(this.styleDialogModule)) {
            let type: string = style.type == 'Paragraph' ? !isNullOrUndefined(style.link) ? 'Linked Style' : 'Paragraph' : 'Character';
            styleInCollection.type = this.styleDialogModule.getTypeValue(type);
            styleInCollection.basedOn = style.basedOn;

            if (type === 'Paragraph' || type === 'Linked Style') {
                styleInCollection.next = style.next;
                (styleInCollection as WParagraphStyle).characterFormat.copyFormat((style as WParagraphStyle).characterFormat);
                let oldListId: number = (styleInCollection as WParagraphStyle).paragraphFormat.listFormat.listId;
                (styleInCollection as WParagraphStyle).paragraphFormat.copyFormat((style as WParagraphStyle).paragraphFormat);
                // this.updateList();
                styleInCollection.link = style.link;
                if (!isNullOrUndefined(oldListId) && oldListId > -1) {
                    let list = this.documentHelper.getListById(oldListId);
                    if (!isNullOrUndefined(list)) {
                        this.documentHelper.lists.splice(this.documentHelper.lists.indexOf(list), 1);
                    }
                }
            } else if (type === 'Character') {
                (styleInCollection as WCharacterStyle).characterFormat.copyFormat((style as WCharacterStyle).characterFormat);
            }
            styleInCollection.name = style.name;
        }
    }
    private createNewBodyWidget(): BodyWidget {
        const section: BodyWidget = new BodyWidget();
        section.index = 0;
        section.sectionFormat = new WSectionFormat(section);
        if (this.sectionFormat) {
            this.parser.parseSectionFormat(0, this.sectionFormat, section.sectionFormat);
        }
        const paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.index = 0;
        paragraph.paragraphFormat = new WParagraphFormat(paragraph);
        paragraph.characterFormat = new WCharacterFormat(paragraph);
        section.childWidgets.push(paragraph);
        paragraph.containerWidget = section;
        return section;
    }
    private clearSpellCheck(): void {
        if (!isNullOrUndefined(this.spellChecker)) {
            if (!isNullOrUndefined(this.spellChecker.errorWordCollection)) {
                this.spellChecker.errorWordCollection.clear();
            }
            if (!isNullOrUndefined(this.spellChecker.uniqueWordsCollection)) {
                this.spellChecker.uniqueWordsCollection.clear();
            }
        }
    }
    /**
     * @private
     */
    public getStyleData(name: string, listId?: number): void {
        if (!this.enableCollaborativeEditing) {
            return;
        }
        this.isSettingOp = true;
        let operation: Operation;
        if (!isNullOrUndefined(name) && !isNullOrUndefined(this.documentHelper.owner.sfdtExportModule)) {
            let style = this.documentHelper.styles.findByName(name);
            if (!isNullOrUndefined(style)) {
                let keyIndex = this.documentHelper.owner.sfdtExportModule.keywordIndex;
                this.documentHelper.owner.sfdtExportModule.keywordIndex = 1;
                let styleData = this.documentHelper.owner.sfdtExportModule.writeStyle(style as WStyle);
                let styleObject = {
                    "optimizeSfdt": true,
                    "sty": [styleData]
                };
                if (this.editor.isLinkedStyle((style as WStyle).name)) {
                    let linkedStyle: WStyle = this.documentHelper.styles.findByName((style as WStyle).name + ' Char') as WStyle;
                    let linkedStyleData = this.documentHelper.owner.sfdtExportModule.writeStyle(linkedStyle);
                    styleObject.sty.push(linkedStyleData);
                }
                if (!isNullOrUndefined(listId) && listId > -1) {
                    let list: WList = this.documentHelper.getListById(listId);
                    styleObject[listsProperty[1]] = [];
                    styleObject[listsProperty[1]].push(this.sfdtExportModule.writeList(list));
                    styleObject[abstractListsProperty[1]] = [];
                    styleObject[abstractListsProperty[1]].push(this.sfdtExportModule.writeAbstractList(list.abstractList));
                }
                this.documentHelper.owner.sfdtExportModule.keywordIndex = keyIndex;
                if (!isNullOrUndefined(style)) {
                    operation = {
                        action: 'Update',
                        styleData: JSON.stringify(styleObject)
                    };
                    this.documentSettingOps.push(operation);
                }
            }
        }
        this.fireContentChange();
    }
    /**
     * @private
     */
    public getSettingData(name: string, value: boolean, hashValue?: string, saltValue?: string, protectionType?: ProtectionType): void {
        if (!this.enableCollaborativeEditing) {
            return;
        }
        this.isSettingOp = true;
        let protectionData: ProtectionInfo;
        let operation: Operation;
        if (name === 'protection') {
            protectionData = {
                saltValue: saltValue,
                hashValue: hashValue,
                protectionType: protectionType
            }
            operation = {
                text: name,
                protectionData: protectionData
            }
        } else {
            operation = {
                text: name,
                enableTrackChanges: value
            }
        }
        if (!this.skipSettingsOps) {
            this.documentSettingOps.push(operation);
            this.fireContentChange();
        }
        this.skipSettingsOps = false;
        this.isSettingOp = false;
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
        if (this.commentReviewPane) {
            this.commentReviewPane.destroy();
            this.commentReviewPane = undefined;
        }
        if (this.trackChangesPane) {
            this.trackChangesPane.destroy();
            this.trackChangesPane = undefined;
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
            this.contextMenuModule.componentDestroy();
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
        if (this.tabDialogModule) {
            this.tabDialogModule.destroy();
            this.tabDialogModule = undefined;
        }
        if (this.pageSetupDialogModule) {
            this.pageSetupDialogModule.destroy();
            this.pageSetupDialogModule = undefined;
        }
        if (this.columnsDialogModule) {
            this.columnsDialogModule.destroy();
            this.columnsDialogModule = undefined;
        }
        if (this.footNotesDialogModule) {
            this.footNotesDialogModule.destroy();
            this.footNotesDialogModule = undefined;
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
        if (this.spellCheckerModule) {
            this.spellCheckerModule.destroy();
            this.spellCheckerModule = undefined;
        }
        if (this.checkBoxFormFieldDialogModule) {
            this.checkBoxFormFieldDialogModule.destroy();
            this.checkBoxFormFieldDialogModule = undefined;
        }
        if (this.dropDownFormFieldDialogModule) {
            this.dropDownFormFieldDialogModule.destroy();
            this.dropDownFormFieldDialogModule = undefined;
        }
        if (this.textFormFieldDialogModule) {
            this.textFormFieldDialogModule.destroy();
            this.textFormFieldDialogModule = undefined;
        }
        if (this.spellCheckDialogModule) {
            this.spellCheckDialogModule.destroy();
            this.spellCheckDialogModule = undefined;
        }
        if (this.stylesDialogModule) {
            this.stylesDialogModule.destroy();
            this.stylesDialogModule = undefined;
        }
        if (this.optimizedModule) {
            this.optimizedModule.destroy();
            this.optimizedModule = undefined;
        }
        if (this.regularModule) {
            this.regularModule.destroy();
            this.regularModule = undefined;
        }
    }
    /* eslint-enable */
    // Public Implementation Ends.
}

/**
 * The `ServerActionSettings` module is used to provide the server action methods of Document Editor.
 */
export class ServerActionSettings extends ChildProperty<ServerActionSettings> {

    /**
     * Specifies the system clipboard action of Document Editor.
     *
     * @default 'SystemClipboard'
     */
    @Property('SystemClipboard')
    public systemClipboard: string;

    /**
     * Specifies the spell check action of Document Editor.
     *
     * @default 'SpellCheck'
     */
    @Property('SpellCheck')
    public spellCheck: string;

    /**
     * Specifies the restrict editing encryption/decryption action of Document Editor.
     *
     * @default 'RestrictEditing'
     */
    @Property('RestrictEditing')
    public restrictEditing: string;

    /**
     * Specifies the server action name to lock selected region.
     *
     * @default 'CanLock'
     */
    @Property('CanLock')
    public canLock: string;

    /**
     * Specifies the server action name to pull pending actions.
     *
     * @default 'GetPendingActions'
     */
    @Property('GetPendingActions')
    public getPendingActions: string;
}

/**
 * Form field settings.
 */
export class FormFieldSettings extends ChildProperty<FormFieldSettings> {

    /**
     * Gets or sets the form fields shading color.
     * You can customize shading color in application level, but cannot be exported in file level
     *
     * @default '#cfcfcf'
     */
    @Property('#cfcfcf')
    public shadingColor: string;

    /**
     * Gets or sets the whether apply shadings for field or not.
     *
     * @default true
     */
    @Property(true)
    public applyShading: boolean;

    /**
     * Gets or sets the field selection color.
     *
     * @default '#cccccc'
     */
    @Property('#cccccc')
    public selectionColor: string;
    /**
     * Gets or sets the form filling mode type.
     *
     * @default 'Popup'
     */
    @Property('Popup')
    public formFillingMode: FormFillingMode;
    /**
     * Gets or sets the formatting exception.
     *
     * @default []
     */
    @Property([])
    public formattingExceptions: FormattingExceptions[];
}

/**
 * Represents the collaborative editing settings.
 */
export class CollaborativeEditingSettings extends ChildProperty<CollaborativeEditingSettings> {
    /**
     * Gets or sets the collaborative editing room name.
     *
     * @default ''
     */
    @Property('')
    public roomName: string;

    /**
     * Gets or sets the editable region color.
     */
    @Property('#22b24b')
    public editableRegionColor: string;

    /**
     * Gets or sets the locked region color.
     */
    @Property('#f44336')
    public lockedRegionColor: string;

    /**
     * Gets or sets the timeout for syncing content in milliseconds.
     */
    @Property(3000)
    public saveTimeout: number;
}

/**
 * The `ServerActionSettings` module is used to provide the server action methods of Document Editor Container.
 */
export class ContainerServerActionSettings extends ServerActionSettings {
    /**
     * Specifies the load action of Document Editor.
     *
     * @default 'Import'
     */
    @Property('Import')
    public import: string;
}