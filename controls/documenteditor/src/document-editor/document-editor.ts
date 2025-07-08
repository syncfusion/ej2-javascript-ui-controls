import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration, ChildProperty, classList, Complex, formatUnit, Base, updateCSSText } from '@syncfusion/ej2-base';
import { isNullOrUndefined, L10n, EmitType, Browser } from '@syncfusion/ej2-base';
import { Save } from '@syncfusion/ej2-file-utils';
import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle, BeforePaneSwitchEventArgs, LayoutType, FormFieldFillEventArgs, FormFieldData } from './index';
import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, CommentDeleteEventArgs, RevisionActionEventArgs, BeforeFileOpenArgs, CommentActionEventArgs, XmlHttpRequestEventArgs, XmlHttpRequestHandler, beforeXmlHttpRequestSend } from './index';
import { LayoutViewer, PageLayoutViewer, WebLayoutViewer, BulletsAndNumberingDialog } from './index';
import { Print, SearchResultsChangeEventArgs, SelectionWidgetInfo, Dictionary, ElementBox } from './index';
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
import { XmlPane } from './index';
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
import { DocumentEditorModel, ServerActionSettingsModel, DocumentEditorSettingsModel, FormFieldSettingsModel, CollaborativeEditingSettingsModel, DocumentSettingsModel, AutoResizeSettingsModel, RevisionSettingsModel } from './document-editor-model';
import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties, DocumentHelper, listsProperty, abstractListsProperty } from './index';
import { PasteOptions } from './index';
import { CommentReviewPane, CheckBoxFormFieldDialog, DropDownFormField, TextFormField, CheckBoxFormField, FieldElementBox, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, ContextElementInfo, CollaborativeEditing, CollaborativeEditingEventArgs, Operation, ProtectionInfo, HistoryInfo, BaseHistoryInfo, WParagraphStyle, WList, WCharacterStyle, CollaborativeEditingHandler, ActionInfo, ExternalFontInfo } from './implementation/index';
import { TextFormFieldDialog } from './implementation/dialogs/form-field-text-dialog';
import { DropDownFormFieldDialog } from './implementation/dialogs/form-field-drop-down-dialog';
import { FormFillingMode, TrackChangeEventArgs, ServiceFailureArgs, ImageFormat, ProtectionType, ContentControlInfo, ServerActionType, CommentInfo, CommentProperties } from './base';
import { TrackChangesPane } from './implementation/track-changes/track-changes-pane';
import { Revision, RevisionCollection } from './implementation/track-changes/track-changes';
import { NotesDialog } from './implementation/dialogs/notes-dialog';
import { CommentElementBox, ContentControl, FootNoteWidget, HeaderFooterWidget, IWidget, ImageElementBox, LineWidget, TextElementBox } from './implementation/viewer/page';
import { internalZoomFactorChange, contentChangeEvent, documentChangeEvent, selectionChangeEvent, zoomFactorChangeEvent, beforeFieldFillEvent, afterFieldFillEvent, serviceFailureEvent, viewChangeEvent, customContextMenuSelectEvent, customContextMenuBeforeOpenEvent, internalviewChangeEvent, internalDocumentEditorSettingsChange, trackChanges, internalOptionPaneChange, documentLoadFailedEvent, beforecontentControlFillEvent, aftercontentControlFillEvent } from './base/constants';
import { Optimized, Regular, HelperMethods } from './index';
import { ColumnsDialog } from './implementation/dialogs/columns-dialog';
import { DocumentCanvasElement } from './implementation/viewer/document-canvas';
import { ZipArchiveItem, ZipArchive } from '@syncfusion/ej2-compression';
import { Ruler } from './implementation/ruler/index';
import { TabDialog } from './implementation/dialogs/tab-dialog';
import { RulerHelper } from './implementation/utility/dom-util';
import { ColorPickerModel } from '@syncfusion/ej2-inputs';
import { MentionModel } from '@syncfusion/ej2-dropdowns';
import { DatePickerDialog } from './implementation/dialogs/datepicker-dialog';
import { ContentControlPropertiesDialog } from './implementation/dialogs/content-control-properties-dialog';
import { PicContentControlDialog } from './implementation/dialogs/pic-contentControl-dialog';
import { DialogUtility, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Comment, ContentControlFillEventArgs, DocumentLoadFailedEventArgs } from './base/events-helper';
import { FieldSettingsModel } from '@syncfusion/ej2-dropdowns';
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
     * Gets or sets the revision settings.
     */
    @Property({ customData: '', showCustomDataWithAuthor: false })
    public revisionSettings: RevisionSettingsModel;

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
     *
     * @default 32767
     * @returns {number}
     */
    @Property(32767)
    public maximumRows: number;

    /**
     * Gets or sets the maximum number of columns allowed while inserting a table in Document editor component.
     * > The maximum value is 63, as per Microsoft Word application and you can set any value less than 63 to this property. If you set any value greater than 63, then Syncfusion Document editor will automatically reset as 63.
     *
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

    /**
     * Gets or sets color picker settings to customize the color picker used in Document Editor.
     */
    @Property({ mode: 'Picker', modeSwitcher: true, showButtons: true })
    public colorPickerSettings: ColorPickerModel;

    /**
     *  Gets or sets a value indicating whether to display navigation pane in Document Editor.
     *
     * @default false
     * @aspType bool
     * @returns {boolean} Returns `true` if navigation pane is visible in Document Editor. Otherwise `false`.
     */
    @Property(false)
    public showNavigationPane: boolean;

    /**
     * Gets ot sets the mention configuration used in Document Editor.
     */
    @Property({ mentionChar: '@' })
    public mentionSettings: MentionModel;

    /**
     * Gets or sets a value indicating whether the final paragraph of pasted content should be appended as a new paragraph in the Document Editor.
     *
     * @default false
     * @aspType bool
     */
    @Property(false)
    public pasteAsNewParagraph: boolean;

    /**
     * Enables or disables screen reader support in the Document Editor. When set to `true`, the editor will expose necessary accessibility information for screen reader tools.
     *
     * @default false
     * @aspType bool
     */
    @Property(false)
    public enableScreenReader: boolean;

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
 * Represents the revision settings.
 */
export class RevisionSettings extends ChildProperty<RevisionSettings> {
    /**
     * Gets or sets the custom data value
     *
     * @default ''
     */
    @Property('')
    public customData: string;
    /**
     * Gets or sets a boolean value indicating whether to show custom data along with author in the Track Changes pane.
     *
     * @default false
     *
     */
    @Property(false)
    public showCustomDataWithAuthor: boolean;
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
    private accesiblityTimer: number;
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
        if (!value && this.selectionModule && this.selectionModule.isWebLayout) {
            this.selectionModule.isWebLayout = false;
        }
        this.viewer.updateScrollBars();
    }

    /**
     * @private
     */
    public readableDiv: HTMLElement;

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
    public isContainerResize: boolean = false;
    /**
     * @private
     */
    public enableXMLPane: boolean = false;
    /**
     * @private
     */
    public xPathString: string;
    /**
     * @private
     */
    public prefixMappings: string;

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
    public isTableMarkerDragging: boolean = false;
    /**
     * @private
     */
    public startXPosition: number = 0;
    /**
     * @private
     */
    public parser: SfdtReader = undefined;
    /**
     * @private
     */
    public isUpdateTrackChanges: boolean = false;
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
    public findResultsList: HTMLElement[] = undefined;
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
    public dateContentDialogModule: DatePickerDialog;
    /**
     * @private
     */
    public picContentControlDialogModule: PicContentControlDialog;
    /**
     * @private
     */
    public picturePositionY: number;
    /**
     * @private
     */
    public contentControlPropertiesDialogModule: ContentControlPropertiesDialog;
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
    public xmlPaneModule: XmlPane;
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
     * Skip style update before document change
     * @private
     */
    public skipStyleUpdate: boolean;
    /**
     * Enable collaborative editing in document editor.
     *
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
     * Enables or disables pagination and layout rendering in the document editor.
     * When set to `false`, the editor skips layout processing such as pagination,
     * which can significantly improve performance during programmatic document updates.
     *
     * This is useful when applying multiple changes in bulk to avoid unnecessary reflows.
     * Set it back to `true` to re-enable layout and pagination.
     *
     * @default true
     */
    @Property(true)
    public enableLayout: boolean;
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
     * @private
     */
    public beforeContentControlFill: EmitType<ContentControlFillEventArgs>;
    /**
     * @private
     */
    public afterContentControlFill: EmitType<ContentControlFillEventArgs>;
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
     * Triggers when SFDT is failed to load in the document editor
     */
    @Event()
    public documentLoadFailed: EmitType<DocumentLoadFailedEventArgs>;
    /**
     * @private
     */
    public externalFonts: ExternalFontInfo[];
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
     * @private
     */
    public enableDateContentDialog: boolean;
    /**
     * @private
     */
    public enablePicContentControlDialog: boolean;
    /**
     * @private
     */
    public enableContentControlPropertiesDialog: boolean;
    /**
     * @private
     */
    public serverActionSettingsImport: string = 'Import';
    /**
     * Gets or sets a value indicating whether xml toolbar is enabled or not.
     * @private
     *
     * @default false
     */
    public isXmlPaneTool: boolean = false;
    /**
     * Gets or sets a value indicating whether xml cc is enabled or not.
     * @private
     *
     * @default false
     */
    public isXmlMapCC: boolean = false;
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
     * Gets the entire document's comment information.
     *
     * @returns {CommentInfo[]} Returns the collection of comments.
     */
    public getComments(): CommentInfo[] {
        const data: CommentInfo[] = [];

        const commentCollection: CommentElementBox[] = this.documentHelper.comments;
        if (commentCollection.length > 0) {
            let tempData: any = [];
            for (const comment of this.documentHelper.comments) {
                tempData = [];
                const commentProperties: CommentProperties = {
                    author: comment.author,
                    isResolved: comment.isResolved ? comment.isResolved : false,
                    dateTime: this.editor.parseDateTime(comment.createdDate)
                };
                for (const replyComment of comment.replyComments) {
                    const replyCommentProperties: CommentProperties = {
                        author: replyComment.author,
                        isResolved: replyComment.isResolved ? comment.isResolved : false,
                        dateTime: this.editor.parseDateTime(replyComment.createdDate)
                    };
                    const commentText: string = HelperMethods.parseCommentAsText(replyComment);
                    const newComment: Comment = new Comment(replyComment.commentId, replyCommentProperties, commentText);
                    tempData.push(newComment);
                }
                const commentInfo: CommentInfo = {
                    id: comment.commentId,
                    text: HelperMethods.parseCommentAsText(comment),
                    commentProperties: commentProperties,
                    replies: tempData
                };
                data.push(commentInfo);
            }
        }
        return data;
    }

    /**
     * Gets the selection object of the document editor.
     *
     * @default undefined
     * @aspType Selection
     * @returns {Selection} Returns the selection object.
     */
    public get selection(): Selection {
        if (!this.selectionModule) {
            this.checkModuleInjection('Selection', this.enableSelection);
        }
        return this.selectionModule;
    }
    /**
     * Gets the editor object of the document editor.
     *
     * @aspType Editor
     * @returns {Editor} Returns the editor object.
     */
    public get editor(): Editor {
        if (!this.editorModule) {
            this.checkModuleInjection('Editor', this.enableEditor);
        }
        return this.editorModule;
    }
    /**
     * Gets the editor history object of the document editor.
     *
     * @aspType EditorHistory
     * @returns {EditorHistory} Returns the editor history object.
     */
    public get editorHistory(): EditorHistory {
        if (!this.editorHistoryModule) {
            this.checkModuleInjection('EditorHistory', this.enableEditorHistory);
        }
        return this.editorHistoryModule;
    }
    /**
     * Gets the search object of the document editor.
     *
     * @aspType Search
     * @returns { Search } Returns the search object.
     */
    public get search(): Search {
        if (!this.searchModule) {
            this.checkModuleInjection('Search', this.enableSearch);
        }
        return this.searchModule;
    }
    /**
     * Gets the context menu object of the document editor.
     *
     * @aspType ContextMenu
     * @returns {ContextMenu} Returns the context menu object.
     */
    public get contextMenu(): ContextMenu {
        if (!this.contextMenuModule) {
            this.checkModuleInjection('ContextMenu', this.enableContextMenu);
        }
        return this.contextMenuModule;
    }
    /**
     * Gets the spell check dialog object of the document editor.
     *
     * @returns {SpellCheckDialog} Returns the spell check dialog object.
     */
    public get spellCheckDialog(): SpellCheckDialog {
        if (!this.spellCheckDialogModule) {
            this.checkModuleInjection('SpellCheck', this.enableSpellCheck);
        }
        return this.spellCheckDialogModule;
    }
    /**
     * Gets the spell check object of the document editor.
     *
     * @aspType SpellChecker
     * @returns {SpellChecker} Returns the spell checker object.
     */
    public get spellChecker(): SpellChecker {
        if (!this.spellCheckerModule) {
            this.checkModuleInjection('SpellCheck', this.enableSpellCheck);
        }
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
     * @param {boolean} value - Specifies whether the document is loaded or not.
     * @returns {void}
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
        if (this.documentHelper.pages.length === 1) {
            const firstPage: Page = this.documentHelper.pages[0];
            const headerWidget: HeaderFooterWidget = firstPage.headerWidget;
            const footerWidget: HeaderFooterWidget = firstPage.footerWidget;
            let isHeaderEmpty: boolean = true;
            let isFooterEmpty: boolean = true;
            if (!isNullOrUndefined(headerWidget) && !isNullOrUndefined(headerWidget.firstChild)) {
                if (!(headerWidget.firstChild instanceof ParagraphWidget) || !headerWidget.firstChild.isEmpty()) {
                    isHeaderEmpty = false;
                }
            }
            if (!isNullOrUndefined(footerWidget) && !isNullOrUndefined(footerWidget.firstChild)) {
                if (!(footerWidget.firstChild instanceof ParagraphWidget) || !footerWidget.firstChild.isEmpty()) {
                    isFooterEmpty = false;
                }
            }
            if (isHeaderEmpty && isFooterEmpty) {
                const firstBodywidget: BodyWidget = firstPage.bodyWidgets[0];
                if (isNullOrUndefined(firstBodywidget.nextWidget)) {
                    const firstChild: IWidget = firstBodywidget.firstChild;
                    if (firstChild instanceof ParagraphWidget
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
            return this.selectionModule.getDocumentStart();
        } else {
            this.checkModuleInjection('Selection', this.enableSelection);
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
            return this.selectionModule.getDocumentEnd();
        } else {
            this.checkModuleInjection('Selection', this.enableSelection);
        }
        return undefined;
    }
    /**
     * @private
     * @returns {TextPosition} - Returns isReadOnlyMode.
     */
    public get isReadOnlyMode(): boolean {
        return this.isReadOnly || isNullOrUndefined(this.editorModule)
            || isNullOrUndefined(this.selectionModule) || !isNullOrUndefined(this.editorModule) && this.editorModule.restrictEditing;
    }
    /**
     * @private
     * @returns {TextPosition} - Returns isSpellCheck.
     */
    public get isSpellCheck(): boolean {
        return this.enableSpellCheck && this.spellCheckerModule && this.spellCheckerModule.enableSpellCheck;
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

    private updateExternalStyle(): void {
        if (this.externalFonts && this.externalFonts.length > 0) {
            this.clearExistingStyles();
            const style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'e-de-custom-font-styles';
            let fontFaceDeclarations: string = '';
            this.externalFonts.forEach((externalFont: ExternalFontInfo) => {
                if (externalFont.src && externalFont.fontFamily && !this.parser.isFontInstalled(externalFont.fontFamily)) {
                    fontFaceDeclarations += `@font-face {font-family: '${externalFont.fontFamily}'; src: ${externalFont.src}}`;
                }
            });

            if (fontFaceDeclarations) {
                style.appendChild(document.createTextNode(fontFaceDeclarations));
                document.head.appendChild(style);
                style.onload = function (): void {
                    this.externalFonts.forEach((externalFont: ExternalFontInfo) => {
                        if (externalFont.src && externalFont.fontFamily && !this.parser.isFontInstalled(externalFont.fontFamily)) {
                            // Render text in a div for each font
                            const testDiv: HTMLElement = document.createElement('div');
                            const cssText: string = 'position:absolute;top:-1000px;left:-1000px;opacity:0;font-size:0px;line-height:normal;';
                            updateCSSText(testDiv, cssText);
                            testDiv.textContent = 'test font';
                            testDiv.style.fontFamily = `"${externalFont.fontFamily}"`;
                            document.body.appendChild(testDiv);
                        }
                    });
                }.bind(this);
            }
        }
    }
    private clearExistingStyles(): void {
        const head: HTMLHeadElement = document.head;
        const styles: NodeListOf<HTMLStyleElement> = head.querySelectorAll('style#e-de-custom-font-styles');

        styles.forEach((style: HTMLStyleElement) => {
            head.removeChild(style);
        });
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
        this.renderNavigationPane();
        this.createdTriggered = true;
    }
    /**
     * @private
     * @returns {void}
     */
    public renderRulers(): void {
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
    /**
     * @private
     * @returns {void}
     */
    public showHideRulers(): void {
        if (this.rulerHelper && this.documentEditorSettings && !isNullOrUndefined(!this.documentEditorSettings.showRuler)) {
            const showRuler: boolean = this.documentEditorSettings.showRuler && !this.isReadOnlyMode;
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
    private renderNavigationPane(): void {
        if (!this.isReadOnly && this.optionsPaneModule) {
            this.optionsPaneModule.isNavigationPane = this.documentEditorSettings.showNavigationPane;
            this.optionsPaneModule.showHideOptionsPane(this.documentEditorSettings.showNavigationPane);
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
                    if (this.enableCollaborativeEditing && this.collaborativeEditingHandlerModule) {
                        this.collaborativeEditingHandlerModule.updateCaretPosition();
                    }
                }
                break;
            case 'layoutType':
                if (this.selectionModule && this.selectionModule.isWebLayout) {
                    break;
                }
                this.viewer.destroy();
                if (this.layoutType === 'Pages') {
                    this.viewer = new PageLayoutViewer(this);
                } else {
                    if (this.enableHeaderAndFooter === true) {
                        this.selectionModule.closeHeaderFooter();
                    }
                    this.viewer = new WebLayoutViewer(this);
                }
                /* eslint-disable */
                    if (this.selectionModule) {
                        const paragraph: ParagraphWidget = this.selectionModule.start.paragraph;
                        if (paragraph.containerWidget instanceof FootNoteWidget) {
                            this.selectionModule.clearSelectionHighlightInSelectedWidgets();
                            this.selectionModule.selectContent(this.documentStart, true);
                        }
                    }
                    this.documentHelper.layout.layoutWholeDocument(true);
                    if (this.selectionModule) {
                        this.selectionModule.onHighlight();
                    }
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
                    if (this.selectionModule && this.documentHelper.isDocumentProtected) {
                        this.selectionModule.highlightEditRegion();
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
                                this.documentHelper.layout.layoutWholeDocument(true);
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
                        if (this.trackChangesPane) {
                            this.trackChangesPane.showHiddenParaMark();
                        }
                        this.viewer.updateScrollBars();
                    }
                    if (!isNullOrUndefined(model.documentEditorSettings.highlightEditableRanges)) {
                        if (this.documentHelper && this.documentHelper.restrictEditingPane) {
                            this.documentHelper.restrictEditingPane.highlightCheckBox.checked = model.documentEditorSettings.highlightEditableRanges;
                            this.documentHelper.selection.isHighlightEditRegion = model.documentEditorSettings.highlightEditableRanges;
                        }
                    }
                    if (!isNullOrUndefined(model.documentEditorSettings.colorPickerSettings)) {
                        if(model.documentEditorSettings.colorPickerSettings) {
                            this.applyColorPickerProperties(model);
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
                    if (!isNullOrUndefined(model.documentEditorSettings.showNavigationPane)) {
                        if (!this.isReadOnly && this.optionsPaneModule) {
                            this.optionsPaneModule.isNavigationPane = model.documentEditorSettings.showNavigationPane;
                            this.optionsPaneModule.showHideOptionsPane(this.documentEditorSettings.showNavigationPane);
                        }
                    }
                    if (this.enableCollaborativeEditing && this.collaborativeEditingHandlerModule) {
                        this.collaborativeEditingHandlerModule.updateCaretPosition();
                    }
                    if(!isNullOrUndefined(model.documentEditorSettings.pasteAsNewParagraph)){
                        this.documentEditorSettings.pasteAsNewParagraph=model.documentEditorSettings.pasteAsNewParagraph;
                    }
                    if (!isNullOrUndefined(model.documentEditorSettings.enableScreenReader)) {
                        this.documentEditorSettings.enableScreenReader = model.documentEditorSettings.enableScreenReader;
                    }
                    if (!isNullOrUndefined(model.documentEditorSettings.revisionSettings)) {
                        if (!isNullOrUndefined(model.documentEditorSettings.revisionSettings.customData)) {
                            this.documentEditorSettings.revisionSettings.customData = model.documentEditorSettings.revisionSettings.customData;
                        }
                        if (!isNullOrUndefined(model.documentEditorSettings.revisionSettings.showCustomDataWithAuthor)) {
                            this.documentEditorSettings.revisionSettings.showCustomDataWithAuthor = model.documentEditorSettings.revisionSettings.showCustomDataWithAuthor;
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
                case 'enableLayout':
                    this.refreshLayout();
                    break;
            }
        }
    }

    private refreshLayout(): void {
        if (this.searchModule && !isNullOrUndefined(this.searchModule.searchHighlighters)) {
            this.searchModule.clearSearchHighlight();
        }
        if (this.selection) {
            this.selection.moveToDocumentStart();
        }
        this.documentHelper.layout.layoutWholeDocument();
    }

    private applyColorPickerProperties(model : DocumentEditorModel) : void {
        if(model.documentEditorSettings.colorPickerSettings) {
                            
            let settings = model.documentEditorSettings.colorPickerSettings;
            if (!this.isReadOnly && !isNullOrUndefined(settings) && this.bordersAndShadingDialogModule && this.documentHelper.borderColorPicker && this.documentHelper.shadingColorPicker) {
                // setting border and shading color picker properties
                if(!isNullOrUndefined(settings.mode)){
                    this.documentHelper.borderColorPicker.mode = model.documentEditorSettings.colorPickerSettings.mode;
                    this.documentHelper.shadingColorPicker.mode = model.documentEditorSettings.colorPickerSettings.mode;
                }
                if(!isNullOrUndefined(settings.showButtons)){
                    this.documentHelper.borderColorPicker.showButtons = model.documentEditorSettings.colorPickerSettings.showButtons;
                    this.documentHelper.shadingColorPicker.showButtons = model.documentEditorSettings.colorPickerSettings.showButtons;
                }
                if(!isNullOrUndefined(settings.modeSwitcher)){
                    this.documentHelper.borderColorPicker.modeSwitcher = model.documentEditorSettings.colorPickerSettings.modeSwitcher;
                    this.documentHelper.shadingColorPicker.modeSwitcher = model.documentEditorSettings.colorPickerSettings.modeSwitcher;
                }             
            } 
            // setting fontColor picker properties
            if (!this.isReadOnly && !isNullOrUndefined(settings) && this.fontDialogModule && this.documentHelper.fontColor) {
                if(!isNullOrUndefined(settings.mode)){
                    this.documentHelper.fontColor.mode = model.documentEditorSettings.colorPickerSettings.mode;
                }
                if(!isNullOrUndefined(settings.showButtons)){
                    this.documentHelper.fontColor.showButtons = model.documentEditorSettings.colorPickerSettings.showButtons;
                }
                if(!isNullOrUndefined(settings.modeSwitcher)){
                    this.documentHelper.fontColor.modeSwitcher = model.documentEditorSettings.colorPickerSettings.modeSwitcher;
                }
            }
            // settingstyle dialog color picker
            if (!this.isReadOnly && !isNullOrUndefined(settings) && this.styleDialogModule && this.documentHelper.colorPicker){
                if(!isNullOrUndefined(settings.mode)){
                    this.documentHelper.colorPicker.mode = model.documentEditorSettings.colorPickerSettings.mode;
                }
                if(!isNullOrUndefined(settings.showButtons)){
                    this.documentHelper.colorPicker.showButtons = model.documentEditorSettings.colorPickerSettings.showButtons;
                }
                if(!isNullOrUndefined(settings.modeSwitcher)){
                    this.documentHelper.colorPicker.modeSwitcher = model.documentEditorSettings.colorPickerSettings.modeSwitcher;
                }
            }

            // setting font and table properties 
            if (!isNullOrUndefined(settings)) {
                if(!isNullOrUndefined(settings.mode)){
                    this.documentHelper.fontColorInputElement.mode = model.documentEditorSettings.colorPickerSettings.mode;
                    this.documentHelper.shadingBtn.mode = model.documentEditorSettings.colorPickerSettings.mode;
                    this.documentHelper.borderBtn.mode = model.documentEditorSettings.colorPickerSettings.mode;
                }
                if(!isNullOrUndefined(settings.showButtons)){
                    this.documentHelper.fontColorInputElement.showButtons = model.documentEditorSettings.colorPickerSettings.showButtons;
                    this.documentHelper.shadingBtn.showButtons = model.documentEditorSettings.colorPickerSettings.showButtons;
                    this.documentHelper.borderBtn.showButtons = model.documentEditorSettings.colorPickerSettings.showButtons;
                }
                if(!isNullOrUndefined(settings.modeSwitcher)){
                    this.documentHelper.fontColorInputElement.modeSwitcher = model.documentEditorSettings.colorPickerSettings.modeSwitcher;
                    this.documentHelper.shadingBtn.modeSwitcher = model.documentEditorSettings.colorPickerSettings.modeSwitcher;
                    this.documentHelper.borderBtn.modeSwitcher = model.documentEditorSettings.colorPickerSettings.modeSwitcher;
                }
               
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
        if (!isNullOrUndefined(this.selectionModule)) {
            this.selectionModule.retrieveCurrentFormatProperties();
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
        if (!isNullOrUndefined(this.selectionModule)) {
            this.selectionModule.retrieveCurrentFormatProperties();
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
        if (!isNullOrUndefined(this.selectionModule)) {
            this.selectionModule.retrieveCurrentFormatProperties();
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
        if(this.enableEditor && this.editorModule.isIncrementalSave) {
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
                if (!isNullOrUndefined(this.editorHistoryModule)) {
                    if (!isNullOrUndefined(this.editorHistoryModule.currentHistoryInfo) && this.editorHistoryModule.currentHistoryInfo.action === 'IMEInput') {
                        eventArgs.operations = this.editorHistoryModule.currentHistoryInfo.getActionInfo();
                    } else if (!isNullOrUndefined(this.editorHistoryModule.lastOperation)) {
                        let history: BaseHistoryInfo = this.editorHistoryModule.lastOperation;
                        if (history.action === 'IMEInput') {
                            eventArgs.operations = history.getActionInfo(true);
                        } else {
                            eventArgs.operations = history.getActionInfo();
                        }
                        this.editorHistoryModule.lastOperation = undefined;
                    }
                    if (this.enableTrackChanges && eventArgs.operations.length > 0) {
                        for (let i: number = 0; i < eventArgs.operations.length; i++) {
                            if (isNullOrUndefined(eventArgs.operations[i].markerData)) {
                                eventArgs.operations[i].markerData = {};
                            }
                            if (isNullOrUndefined(eventArgs.operations[i].markerData.author) || eventArgs.operations[i].markerData.author === '') {
                                eventArgs.operations[i].markerData.author = this.currentUser;
                            }
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
            this.editorModule.enforceProtection('', false, true);
        }
        const eventArgs: DocumentChangeEventArgs = { source: this };
        this.trigger(documentChangeEvent, eventArgs);
    }
    /**
     * @private
     * @returns {void}
     */
    public fireSelectionChange(): void {
        if(this.enableEditor && this.editorModule.isIncrementalSave) {
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
        if (this.documentEditorSettings.enableScreenReader) {
            this.setAccessibilityContent();
        }
        // }
    }

    private setAccessibilityContent(): void {
        if (!isNullOrUndefined(this.readableDiv)) {
            if (this.accesiblityTimer) {
                clearTimeout(this.accesiblityTimer);
                this.readableDiv.innerHTML = '';
            }
            this.accesiblityTimer = Number(setTimeout(() => {
                if (!this.selection.isEmpty) {
                    let selectedHTML: string = this.selection.getHtmlContent(true);
                    this.readableDiv.innerHTML = selectedHTML;
                }
                setTimeout(() => {
                    this.focusIn();
                }, 100);
            }, 200));
        }
    }
    /**
     * Triggers the screen reader to verbalize content starting from the current cursor position.
     *
     * @returns {void}
     */
    public verbalizeFromCursorLocation(): void {
        let actualEnd: TextPosition = this.selection.end;
        this.documentHelper.updateFocus();
        this.selection.end = this.documentEnd;
        this.setAccessibilityContent();
        setTimeout(()=> {
            this.selection.end = actualEnd;
        }, 300);
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
    public fireOptionPaneChange(show: boolean): void {
        const eventArgs: any = { show: show };
        this.notify(internalOptionPaneChange, eventArgs);
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
     * @returns {void}
     */
    public fireBeforeContentControlFill(): void {
        const eventArgs: ContentControlFillEventArgs = {};
        this.trigger(beforecontentControlFillEvent, eventArgs);
    }
    /**
     * @private
     * @returns {void}
     */
    public fireAfterContentControlFill(): void {
        const eventArgs: ContentControlFillEventArgs = {};
        this.trigger(aftercontentControlFillEvent, eventArgs);
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
        } else {
            this.checkModuleInjection('ParagraphDialog', this.enableParagraphDialog);
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
        } else {
            this.checkModuleInjection('PageSetupDialog', this.enablePageSetupDialog);
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
        } else {
            this.checkModuleInjection('ColumnsDialog', this.enableColumnsDialog);
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
        } else {
            this.checkModuleInjection('FontDialog', this.enableFontDialog);
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
        } else {
            this.checkModuleInjection('TableOptionsDialog', this.enableTableOptionsDialog);
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
        } else {
            this.checkModuleInjection('TableDialog', this.enableTableDialog);
        }
    }
    /**
     * Shows Date picker content dialog
     * 
     * @private
     * @returns {void}
     */
    public showDateContentDialog(): void {
        if (this.dateContentDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.dateContentDialogModule.show();
        } else {
            this.checkModuleInjection('DateContentDialog', this.enableDateContentDialog);
        }
    }
    /**
    * Apply Content control properties
    *
    * @private
    * @returns {void}
    */
    public showPicContentControlDialog(): void {
        let contentControlImage: ElementBox = this.getImageContentControl();
        let showPicCCButton: boolean = true;
        let pictureElement: boolean = true;
        let picturePositionY = this.picturePositionY;
        // to check whether the selection is empty =true, open the pic content control dialog 
        if (this.selection.isEmpty) {
            this.renderPictureContentControlElement(this, showPicCCButton, pictureElement, picturePositionY);
        }
        // to check whether selected image have content control =false , apply content control    
        if (this.selection.isImageSelected) {
            this.renderPictureContentControlElement(this, showPicCCButton, pictureElement, picturePositionY);
            if (!(contentControlImage instanceof ContentControl && contentControlImage.contentControlProperties.type != 'Picture')) {
                this.editor.insertContentControl('Picture');
            }
        }
    }
    /**
     * Shows Picture Content Control dialog
     *
     * @private
     * @returns {void}
     */
    public showpicContentControlDialogModule(): void {
        if (this.picContentControlDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.picContentControlDialogModule.show();
        } else {
            this.checkModuleInjection('PicContentControlDialog', this.enablePicContentControlDialog);
        }
    }
    /**
        * Shows Picture Content Control button
        *
        * @private
        * @returns {void}
    */
    public renderPictureContentControlElement(documentEditor: DocumentEditor, showPicContentControl: boolean, pictureElement: boolean, picturePositionY?: number): void {
        const PICTURE_CONTENT_CONTROL: string = '_picture_Content_Control';
        if (!this.enableSelection) {
            return;
        }
        const attributes: Object = {
            'id': this.element.id + 'PICTURE_CONTENT_CONTROL', innerHTML: 'Picture',
            class: 'e-btn-icon e-icons e-de-ctnr-image e-icon-left',
            style: 'height:' + 20 + 'px;width:' + 70 + 'px;z-index:5;position:absolute;background-color:#ccc;border:1px solid #ccc;display:',

        };
        let pictureCC: HTMLElement;
        let contentControlImage: ElementBox;
        let element: HTMLElement = document.getElementById(this.element.id + '_viewerContainer');
        let picture_cc: HTMLElement = document.getElementById(this.element.id + 'PICTURE_CONTENT_CONTROL');
        if ((isNullOrUndefined(picture_cc) && showPicContentControl) || pictureElement) {
            pictureCC = this.rulerHelper.createHtmlElement('div', attributes);
            this.setPictureContentControlPositions(pictureCC)
            element.insertBefore(pictureCC, element.firstChild);
            pictureCC.style.display = "block";
            pictureCC.addEventListener('click', (event) => {
                contentControlImage = this.getImageContentControl();
                if (isNullOrUndefined(contentControlImage) || !(contentControlImage.contentControlProperties.type == 'Picture')) {
                    this.picContentControlDialogModule.show();
                }
            });
        } else if (!isNullOrUndefined(picture_cc) && showPicContentControl && !pictureElement) {
            picture_cc.style.display = "block";
            this.setPictureContentControlPositions(picture_cc)
            picture_cc.addEventListener('click', (event) => {
                contentControlImage =this.getImageContentControl();
                if ((contentControlImage instanceof ContentControl && !contentControlImage.contentControlProperties.lockContentControl && contentControlImage.contentControlProperties.type == 'Picture' && !this.documentHelper.owner.isReadOnlyMode)) {
                    this.picContentControlDialogModule.show();
                }
            });
        } else if (!isNullOrUndefined(picture_cc) && !showPicContentControl && !pictureElement) {
            picture_cc.style.display = "none";
        }
        const locale: L10n = new L10n('documenteditor', this.defaultLocale);
        locale.setLocale(this.locale);
        locale.getConstant('Picture')
    }
    /**
        * Update the picture content control dialog position
        *
        * @private
        * @returns {void}
    */
    public setPictureContentControlPositions(pictureElement: HTMLElement): void {
        let left: number = this.selection.isForward ? this.selection.start.location.x : this.selection.end.location.x;
        let top: number = this.selection.getTop(this.documentHelper.selection.start.currentWidget);
        pictureElement.style.left = ((left * this.documentHelper.zoomFactor) + this.documentHelper.pages[0].boundingRectangle.x).toString() + 'px';
        pictureElement.style.top = (top * this.documentHelper.zoomFactor).toString() + 'px';
    }
    /**
    * @private
    * @returns {ElementBox}
    */
    public getImageContentControl(): ElementBox {
        let contentControlImage: ElementBox;
        let contentControlPara = this.documentHelper.owner.selectionModule.start.currentWidget.paragraph;
        for (let i: number = 0; i < contentControlPara.childWidgets.length; i++) {
            for (let j: number = 0; j < ((contentControlPara as ParagraphWidget).childWidgets[i] as LineWidget).children.length; j++) {
                let contentControlImageCheck = ((contentControlPara as ParagraphWidget).childWidgets[i] as LineWidget).children[j];
                if (contentControlImageCheck instanceof ContentControl && contentControlImageCheck.type == 0 && contentControlImageCheck.contentControlProperties.type == 'Picture') {
                    contentControlImage = ((contentControlPara as ParagraphWidget).childWidgets[i] as LineWidget).children[j];
                    break;
                }
            }
        }
        return contentControlImage;
    } 
    /**
     * Shows content Control properties dialog
     * 
     * @private
     * @returns {void}
     */
    public showContentPropertiesDialog(): void {
        if (this.contentControlPropertiesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.contentControlPropertiesDialogModule.show();
        } else {
            this.checkModuleInjection('ContentControlPropertiesDialog', this.enableContentControlPropertiesDialog);
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
        } else {
            this.checkModuleInjection('TableOfContentsDialog', this.enableTableOfContentsDialog);
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
        } else {
            this.checkModuleInjection('StyleDialog', this.enableStyleDialog);
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
        } else {
            this.checkModuleInjection('HyperlinkDialog', this.enableHyperlinkDialog);
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
        } else {
            this.checkModuleInjection('BookmarkDialog', this.enableBookmarkDialog);
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
        } else {
            this.checkModuleInjection('StylesDialog', this.enableStyleDialog);
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
        } else {
            this.checkModuleInjection('ListDialog', this.enableListDialog);
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
        } else {
            this.checkModuleInjection('TablePropertiesDialog', this.enableTablePropertiesDialog);
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
        } else {
            this.checkModuleInjection('BordersAndShadingDialog', this.enableBordersAndShadingDialog);
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
            modules.push({
                member: 'XmlPane', args: [this.documentHelper]
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
            if (this.enableDateContentDialog){
                modules.push({
                    member: 'DateContentDialog', args: [this.documentHelper]
                })
            }
            if (this.enablePicContentControlDialog) {
                modules.push({
                    member: 'PicContentControlDialog', args: [this.documentHelper]
                });
            }
            if (this.enableContentControlPropertiesDialog){
                modules.push({
                    member: 'ContentControlPropertiesDialog', args: [this.documentHelper]
                })
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
     * @param moduleName 
     * @param value 
     */
    public checkModuleInjection(moduleName: string, value: boolean) {
        if (!value && !this.isReadOnly) {
            console.warn(`[WARNING] :: Module "${moduleName}" is not available in Document Editor component! You either misspelled the module name or forgot to load it.`);
            throw new Error(`Inject ${moduleName} module`);
        }
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
        'OutlineLevel':'Outline Level',
        'BodyText': 'Body Text',
        'Level1':'Level 1',
        'Level2':'Level 2',
        'Level3':'Level 3',
        'Level4':'Level 4',
        'Level5':'Level 5',
        'Level6':'Level 6',
        'Level7':'Level 7',
        'Level8':'Level 8',
        'Level9':'Level 9',
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
        'Heading 7': 'Heading 7',
        'Heading 8': 'Heading 8',
        'Heading 9': 'Heading 9',
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
        'The number must be between': 'The number must be between 1 and 9',
        'The Invalid number': 'This is not a valid number',
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
        'Remove Content Control': 'Remove Content Control',
        'Content Control Properties':'Content Control Properties',
        'Remove content control when contents are edited' : 'Remove content control when contents are edited',
        'Content control cannot be deleted':'Content control cannot be deleted',
        'Contents cannot be edited' : 'Contents cannot be edited',
        'Plain Text properties' : 'Plain Text properties',
        'Allow carriage returns':'Allow carriage returns',
        'Drop_Down List properties':'Drop_Down List properties',
        'Display Text' : 'Display Text',
        'Locking' : 'Locking',
        'Tag' : 'Tag',
        'Value' : 'Value',
        'PictureContentControl': 'PictureContentControl',
        'Upload from computer': 'Upload from computer',
        'Picture':'Picture',
        'Choose an item': 'Choose an item',
        'Insert Pictures':'Insert Pictures',
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
        'Failed to load the file':'Failed to load the file' ,
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
        'XML Mapping': 'XML Mapping',
        'Custom XML Part' :'Custom XML Part:',
        'Discard Comment': 'Added comments not posted. If you continue, that comment will be discarded.',
        'Discard Content Control': 'You can not insert a content control when the selection includes another content control.',
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
        'Default Content Control Text': 'Click here or tap to insert text',
        'Default Date Picker': 'Click or tap enter the date',
        'Rich text Controls': 'Rich text controls cannot be applied here.',
        'Plain text Controls': 'Plain text controls cannot be applied here.',
        'DropDownLimitWarning': 'You can have no more than 25 items in your drop-down list box.'
    };
    /* eslint-enable */
    // Public Implementation Starts
    /**
     * Opens the given sfdt text or base 64 string or url.
     *
     * @param {string} sfdtText Specifies the sfdt text or base 64 string or url.
     * @returns {void}
     */
    public open(inputData: string): void;
    /**
     * Opens the given blob.
     *
     * @param {string} blob Specifies the Blob object containing the document data.
     * @returns {void}
     */
    public open(blob: Blob): void;
    /**
     * Opens the given file.
     *
     * @param {string} file Specifies the File object containing the document data..
     * @returns {void}
     */
    public open(file: File): void;

    public open(sfdtText: string | File | Blob): void {
        // sfdtText = HelperMethods.sanitizeString(sfdtText);
        showSpinner(this.element);
        try {
            if (!isNullOrUndefined(sfdtText)) {
                this.openInternal(sfdtText, false);
            }
        } catch (error) {
            this.failureHandler('onError');
        }
    }
    /**
     * Opens the given sfdt text or base 64 string or url.
     *
     * @param {string} sfdtText Specifies the sfdt text or base 64 string or url.
     * @returns {void}
     */
    public openAsync(inputData: string): void;
    /**
     * Opens the given blob.
     *
     * @param {string} blob Specifies the Blob object containing the document data.
     * @returns {void}
     */
    public openAsync(blob: Blob): void;
    /**
     * Opens the given file.
     *
     * @param {string} file Specifies the File object containing the document data..
     * @returns {void}
     */
    public openAsync(file: File): void;

    public openAsync(sfdtText: string | File | Blob): void {
        // sfdtText = HelperMethods.sanitizeString(sfdtText);
        showSpinner(this.element);
        try {
            if (!isNullOrUndefined(sfdtText)) {
                this.openInternal(sfdtText, true);
            }
        } catch (error) {
            this.failureHandler('onError');
        }
    }
    private openInternal(sfdtText: string | Blob | File, isAsync: boolean): void {
        const fileName: string = this.isValidUrl(sfdtText as string);
        if (fileName !== null) {
            this.getSfdtFromUrl(sfdtText as string, fileName)
                .then((sfdt: string) => {
                    sfdtText = sfdt;
                    // Continue with the next steps after getting sfdt from URL
                    this.processSfdt(sfdtText as string);
                })
                .catch((error: any) => {
                    // Handle error
                    console.error(error);
                });
        } else if (this.isValidBase64(sfdtText as string)) {
            this.getSfdtFromBase64string(sfdtText as string)
                .then((sfdt: string) => {
                    sfdtText = sfdt;
                    // Continue with the next steps after getting sfdt from base64 string
                    this.processSfdt(sfdtText as string);
                })
                .catch((error: any) => {
                    // Handle error
                    console.error(error);
                });
        } else if (sfdtText instanceof File) {
            this.convertToSfdt(sfdtText)
                .then((sfdt: string) => {
                    sfdtText = sfdt;
                    // Continue with the next steps after converting file to sfdt
                    this.processSfdt(sfdtText as string);
                })
                .catch((error: any) => {
                    // Handle error
                    console.error(error);
                });
        } else if (sfdtText instanceof Blob) {
            const name: string[] = sfdtText.type.split('/');
            if (name[name.length - 1] === 'sfdt') {
                this.convertFromSfdtBlob(sfdtText)
                    .then((sfdt: string) => {
                        sfdtText = sfdt;
                        // Continue with the next steps after converting from sfdt blob
                        this.processSfdt(sfdtText as string);
                    })
                    .catch((error: any) => {
                        // Handle error
                        console.error(error);
                    });
            } else {
                this.convertFromBlob(sfdtText)
                    .then((sfdt: string) => {
                        sfdtText = sfdt;
                        // Continue with the next steps after converting from blob
                        this.processSfdt(sfdtText as string);
                    })
                    .catch((error: any) => {
                        // Handle error
                        console.error(error);
                    });
            }
        } else {
            if (!isAsync) {
                this.processSfdt(sfdtText as string);
            }
            else {
                setTimeout(() => {
                    try {
                        this.processSfdt(sfdtText as string);
                    } catch (error) {
                        this.failureHandler('onError');
                    }
                }, 50);
            }
        }
    }
    private processSfdt(sfdtText: string): void {
        if (!isNullOrUndefined(this.viewer) && !isNullOrUndefined(sfdtText)) {
            this.clearPreservedCollectionsInViewer();
            this.documentHelper.userCollection.push('Everyone');
            this.documentHelper.lists = [];
            this.documentHelper.abstractLists = [];
            this.documentHelper.styles = new WStyles();
            this.documentHelper.cachedPages = [];
            this.clearSpellCheck();
            if (this.isSpellCheck) {
                if (this.isSpellCheck && !this.spellCheckerModule.enableOptimizedSpellCheck) {
                    this.documentHelper.triggerElementsOnLoading = true;
                    this.documentHelper.triggerSpellCheck = true;
                }
            }
            if (!isNullOrUndefined(sfdtText) && this.viewer) {
                const incrementalOps: Record<string, ActionInfo[]> = {};
                const sections: BodyWidget[] = this.parser.convertJsonToDocument(sfdtText as string, incrementalOps);
                this.documentHelper.setDefaultDocumentFormat();
                this.documentHelper.onDocumentChanged(sections, incrementalOps);
            }
            if (this.isSpellCheck) {
                if (this.isSpellCheck && !this.spellCheckerModule.enableOptimizedSpellCheck) {
                    this.documentHelper.triggerElementsOnLoading = false;
                    this.documentHelper.triggerSpellCheck = false;
                }
            }
        }
        hideSpinner(this.element);
    }
    private isValidUrl(url: string): string | null {
        try {
            const parsedUrl: URL = new URL(url);
            const pathname: string = parsedUrl.pathname;
            const segments: string[] = pathname.split('/');
            const fileName: string = segments.pop();
            return fileName || null;
        } catch (error) {
            return null;
        }
    }
    private isValidBase64(input: string): boolean {
        try {
            const decoded: string = atob(input);
            const reencoded: string = btoa(decoded);
            return reencoded === input;
        } catch (error) {
            return false;
        }
    }
    private async getSfdtFromUrl(value: string, fileName: string): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const documentEditor: DocumentEditor = this;
        return new Promise((resolve: (value: string | PromiseLike<string>) => void, reject: (reason: any) => void) => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.open('GET', value, true);
            xhr.responseType = 'blob';
            xhr.onload = async function (): Promise<void> {
                if (xhr.status === 200) {
                    const blob: any = xhr.response;
                    const formData: FormData = new FormData();
                    formData.append('file', blob, fileName);
                    const sfdt: string = await documentEditor.send(formData);
                    resolve(sfdt);
                }
            };
            xhr.onerror = function (): void{
                reject(null);
            };
            xhr.send();
        });
    }
    private async convertToSfdt(file: File): Promise<string> {
        const formData: FormData = new FormData();
        formData.append('files', file);
        return await this.send(formData);
    }
    private async getSfdtFromBase64string(value: string): Promise<string> {
        const binaryString: string = atob(value);
        const byteArray: Uint8Array = new Uint8Array(binaryString.length);
        for (let i: number = 0; i < binaryString.length; i++) {
            byteArray[parseInt(i.toString(), 10)] = binaryString.charCodeAt(parseInt(i.toString(), 10));
        }
        const blob: Blob = new Blob([byteArray], { type: 'application/octet-stream' });
        const formData: FormData = new FormData();
        formData.append('file', blob);
        return await this.send(formData);
    }
    private async convertFromBlob(blob: Blob): Promise<string> {
        const formData: FormData = new FormData();
        let type: string = this.getBlobType(blob.type);
        type = type === '' ? blob.type : type;
        formData.append('files', blob, type);
        return await this.send(formData);
    }
    private getBlobType(type: string): string {
        let contentType: string = '';
        switch (type) {
        case 'text/html':
            contentType = '.html';
            break;
        case 'text/plain':
            contentType = '.txt';
            break;
        case 'application/rtf':
            contentType = '.rtf';
            break;
        case 'application/xml':
            contentType = '.xml';
            break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
            contentType = '.dotx';
            break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            contentType = '.docx';
            break;
        case 'application/msword':
            contentType = '.doc';
            break;
        case 'application/vnd.ms-word.document.macroEnabled.12':
            contentType = '.docm';
            break;
        case 'application/vnd.ms-word.template.macroenabled.12':
            contentType = '.dotm';
            break;
        case 'application/vnd.oasis.opendocument.text':
            contentType = '.odt';
            break;
        }
        return contentType;
    }
    private send(formData: FormData): Promise<string> {
        const serviceUrl: string = this.serviceUrl + this.serverActionSettingsImport;
        return new Promise((resolve: (value: string | PromiseLike<string>) => void, reject: (reason: any) => void) => {
            const ajax: XmlHttpRequestHandler = new XmlHttpRequestHandler();
            ajax.url = serviceUrl;
            ajax.onSuccess = (result: any) => {
                resolve(result.data);
            };
            ajax.onFailure = this.failureHandler.bind(this);
            ajax.onError = this.failureHandler.bind(this);
            ajax.customHeaders = this.headers;
            const httprequestEventArgs: XmlHttpRequestEventArgs = {
                serverActionType: this.serverActionSettingsImport as ServerActionType,
                headers: this.headers, timeout: 0, cancel: false, withCredentials: false
            };
            this.trigger(beforeXmlHttpRequestSend, httprequestEventArgs);
            if (httprequestEventArgs.cancel) {
                reject(null);
            } else {
                ajax.send(formData, httprequestEventArgs);
            }
        });
    }
    private convertFromSfdtBlob(blob: Blob): Promise<string> {
        return new Promise((resolve: (value: string | PromiseLike<string>) => void) => {
            const reader: FileReader = new FileReader();
            // eslint-disable-next-line @typescript-eslint/tslint/config
            reader.onload = function (event) {
                const text: string = (event.target as FileReader).result as string;
                resolve(text);
            };
            reader.readAsText(blob);
        });
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private failureHandler(args: any): void {
        hideSpinner(this.element);
        const locale: L10n = new L10n('documenteditor', this.defaultLocale);
        const status: string = args.name === 'onError' ? locale.getConstant('Error in establishing connection with web server') :
            locale.getConstant('Failed to load the file');
        const failedargs: DocumentLoadFailedEventArgs = { status: status, hideOpenFailedPopup: false };
        this.trigger(documentLoadFailedEvent, failedargs);
        if (!failedargs.hideOpenFailedPopup) {
            if (args.name === 'onError') {
                DialogUtility.alert({
                    content: locale.getConstant('Error in establishing connection with web server'),
                    closeOnEscape: true, showCloseIcon: true,
                    position: { X: 'center', Y: 'center' }
                }).enableRtl = this.enableRtl;
            } else if (args === 'onError') {
                alert(locale.getConstant('Failed to load the file'));
                //this.fireServiceFailure(args);
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
            = this.enablePageSetupDialog = this.enableStyleDialog = this.enableDateContentDialog
            = this.enablePicContentControlDialog
            = this.enableContentControlPropertiesDialog
            = this.enableListDialog = this.enableParagraphDialog = this.enableFontDialog
            = this.enableTablePropertiesDialog = this.enableBordersAndShadingDialog
            = this.enableTableOptionsDialog = this.enableSpellCheck = this.enableComment
            = this.enableFormField = this.enableColumnsDialog = true;
        /* eslint-disable-next-line max-len */
        DocumentEditor.Inject(Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, NotesDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, TabDialog, DatePickerDialog, PicContentControlDialog, ContentControlPropertiesDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog, SpellChecker, SpellCheckDialog, CheckBoxFormFieldDialog, TextFormFieldDialog, DropDownFormFieldDialog, ColumnsDialog, XmlPane);
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
            if (this.optionsPaneModule) {
                this.optionsPaneModule.refreshHeadingPaneHeight();
            }
        }
        if (this.rulerHelper && this.documentEditorSettings && this.documentEditorSettings.showRuler) {
            this.rulerHelper.updateRuler(this, false);
        }
        if (this.enableCollaborativeEditing && this.collaborativeEditingHandlerModule) {
            this.collaborativeEditingHandlerModule.updateCaretPosition();
        }
    }
    /**
     * Resize Document Editor
     *
     * @private
     * @returns {void}
     */
    public triggerResize(): void{
        if (this) {
            setTimeout(() => {
                if (this) {
                    this.resize();
                }
            }, 10);
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
                if (this.selectionModule) {
                    this.selectionModule.selectFieldInternal(currentField);
                    if (this.editorModule) {
                        this.editorModule.setFormField(currentField, formFieldInfo);
                    } else {
                        this.checkModuleInjection('Editor', this.enableEditor);
                    }
                } else {
                    this.checkModuleInjection('Selection', this.enableSelection);
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
        if (!this.editorModule) {
            this.checkModuleInjection('Editor', this.enableEditor);
        }
        if (!isNullOrUndefined(name)) {
            name = HelperMethods.sanitizeString(name);
        }
        const formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if (isNullOrUndefined(name) || name === formFields[parseInt(i.toString(), 10)].formFieldData.name) {
                if (formFields[parseInt(i.toString(), 10)].formFieldData instanceof TextFormField) {
                    this.editorModule.updateFormField(formFields[parseInt(i.toString(), 10)], (formFields[parseInt(
                        i.toString(), 10)].formFieldData as TextFormField).defaultValue, true);
                } else if (formFields[parseInt(i.toString(), 10)].formFieldData instanceof CheckBoxFormField) {
                    /* eslint-disable-next-line max-len */
                    this.editorModule.toggleCheckBoxFormField(formFields[parseInt(i.toString(), 10)], true, (formFields[parseInt(i.toString(), 10)].formFieldData as CheckBoxFormField).defaultValue);
                } else if (formFields[parseInt(i.toString(), 10)].formFieldData instanceof DropDownFormField) {
                    this.editorModule.updateFormField(formFields[parseInt(i.toString(), 10)], 0, true);
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
        if (!this.editorModule) {
            this.checkModuleInjection('Editor', this.enableEditor);
        }
        const formField: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formData.length; i++) {
            const formFieldData: FormFieldData = formData[parseInt(i.toString(), 10)];
            const fieldName: string = formFieldData.fieldName;
            for (let j: number = 0; j < formField.length; j++) {
                if (formField[parseInt(j.toString(), 10)].formFieldData.name === fieldName) {
                    if (formField[parseInt(j.toString(), 10)].formFieldData instanceof CheckBoxFormField) {
                        this.editorModule.toggleCheckBoxFormField(formField[parseInt(j.toString(), 10)],
                                                                  true, formFieldData.value as boolean);
                    } else if (formField[parseInt(j.toString(), 10)].formFieldData instanceof TextFormField) {
                        this.editorModule.updateFormField(formField[parseInt(j.toString(), 10)], formFieldData.value as string);
                    } else if (formField[parseInt(j.toString(), 10)].formFieldData instanceof DropDownFormField) {
                        this.editorModule.updateFormField(formField[parseInt(j.toString(), 10)], formFieldData.value as number);
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
     * Imports content control data and returns the processed content control information.
     *
     * @param {ContentControlInfo[]} contentControlInfo - The array of content control information to be imported.
     * @returns {ContentControlInfo[]} The processed content control information.
     */
    public importContentControlData(contentControlInfo: ContentControlInfo[]): ContentControlInfo[] {
        for (let i: number = 0; i < contentControlInfo.length; i++) {
            const contentInfo: ContentControlInfo = contentControlInfo[parseInt(i.toString(), 10)];
            for (let j: number = 0; j < this.documentHelper.contentControlCollection.length; j++) {
                const contentControl: ContentControl = this.documentHelper.contentControlCollection[parseInt(j.toString(), 10)];
                if (contentInfo.type === contentControl.contentControlProperties.type
                    && contentInfo.title === contentControl.contentControlProperties.title) {
                    this.editorModule.updateContentControl(contentControl, contentInfo.value);
                }
            }
        }
        return [];
    }
    /**
     * Exports the content control values.
     *
     * @returns {ContentControlInfo[]} The array of content control data.
     */
    public exportContentControlData(): ContentControlInfo[] {
        this.selection.contentControleditRegionHighlighters.clear();
        this.selection.onHighlightContentControl();
        const data: ContentControlInfo[] = [];
        const properties: ContentControl[] = this.documentHelper.contentControlCollection;
        for (const contentControl of properties) {
            if (contentControl instanceof ContentControl) {
                const contentControlData: ContentControlInfo = { title: '', tag: '', value: '', canDelete: false, canEdit: false, type: contentControl.contentControlProperties.type };
                contentControlData.title = contentControl.contentControlProperties.title;
                contentControlData.tag = contentControl.contentControlProperties.tag;
                if (contentControl.contentControlProperties.lockContentControl) {
                    contentControlData.canDelete = true;
                }
                if (contentControl.contentControlProperties.lockContents) {
                    contentControlData.canEdit = true;
                }
                const element: ElementBox = contentControl.nextElement;
                if (contentControl.contentControlProperties.type === 'Picture') {
                    if (element instanceof ImageElementBox) {
                        contentControlData.value = this.documentHelper.getImageString(element);
                    }
                } else if (contentControl.contentControlProperties.type === 'CheckBox') {
                    contentControlData.value = String(contentControl.contentControlProperties.isChecked);
                } else if (contentControl.contentControlProperties.type === 'Date') {
                    contentControlData.value = (element as TextElementBox).text;
                } else if (contentControl.contentControlProperties.type === 'ComboBox' || contentControl.contentControlProperties.type === 'DropDownList') {
                    contentControlData.value = this.getContentControlValue(element as TextElementBox);
                } else {
                    contentControlData.value = this.getContentControlValueForText(contentControl);
                }

                data.push(contentControlData);
            }
        }
        return data;
    }
    /**
     * Resets the content control data.
     *
     * @param {ContentControlInfo[]} contentControInfo - The array of content control information to be reset.
     * @returns {void}
     */
    public resetContentControlData(contentControInfo: ContentControlInfo[]): void {
        for (let i: number = 0; i < contentControInfo.length; i++) {
            const contentInfo: ContentControlInfo = contentControInfo[parseInt(i.toString(), 10)];
            for (let j: number = 0; j < this.documentHelper.contentControlCollection.length; j++) {
                const contentControl: ContentControl = this.documentHelper.contentControlCollection[parseInt(j.toString(), 10)];
                if (contentInfo.title === contentControl.contentControlProperties.title) {
                    this.editorModule.updateContentControl(contentControl, contentInfo.value, true);
                }
            }
        }
    }
    /**
     * @param {TextElementBox} element - Specifies the text element box.
     * @private
     * @returns {string} - Returns the content control value.
     */
    public getContentControlValue(element: TextElementBox): string {
        let text: string = '';
        while (element) {
            if (element instanceof ContentControl) {
                break;
            }
            if (element instanceof TextElementBox) {
                text += element.text;
            }
            element = element.nextElement as TextElementBox;
        }
        return text;
    }
    /**
     * @param {ContentControl} element - Specifies the content control.
     * @private
     * @returns {string} - Returns the content control value.
     */
    public getContentControlValueForText(element: ContentControl): string {
        let text: string = '';
        let startIndex: number = element.line.children.indexOf(element) + 1;
        let skip: boolean = false;
        if (this.selection.contentControleditRegionHighlighters.containsKey(element)) {
            const contentInfo: Dictionary<LineWidget, SelectionWidgetInfo[]>
                = this.selection.contentControleditRegionHighlighters.get(element);
            for (let i: number = 0; i < contentInfo.keys.length; i++) {
                const line: LineWidget = contentInfo.keys[parseInt(i.toString(), 10)];
                if (i > 0 && line.paragraph !== contentInfo.keys[i - 1].paragraph) {
                    text += '/n';
                }
                for (let j: number = startIndex; j < line.children.length; j++) {
                    startIndex = 0;
                    const textElement: ElementBox = line.children[parseInt(j.toString(), 10)] as ElementBox;
                    if (textElement instanceof TextElementBox) {
                        text += textElement.text;
                    }
                    if (textElement instanceof ContentControl) {
                        skip = true;
                        break;
                    }
                }
                if (skip) {
                    break;
                }
            }
        }
        return text;
    }
    /**
     * Updates the fields in the current document.
     * Currently cross reference field only supported.
     *
     * @returns {void}
     */
    public updateFields(): void {
        if (!this.selectionModule) {
            this.checkModuleInjection('Selection', this.enableSelection);
        }
        for (let i: number = 0; i < this.documentHelper.fields.length; i++) {
            const field: FieldElementBox = this.documentHelper.fields[parseInt(i.toString(), 10)];
            const code: string = this.selectionModule.getFieldCode(field);
            if (code.toLowerCase().trim().indexOf('ref ') === 0) {
                const fieldPara: ParagraphWidget = field.line.paragraph;
                if (!isNullOrUndefined(fieldPara)
                    && !isNullOrUndefined(this.selectionModule)
                    && !isNullOrUndefined(this.selectionModule.getPage(fieldPara))) {
                    this.selectionModule.updateRefField(field);
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
        } else {
            this.checkModuleInjection('Print', this.enablePrint);
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
            (this.documentHelper.render.pageCanvas as DocumentCanvasElement).getContext('2d').renderedPath = '';
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
                this.documentHelper.layout.layoutWholeDocument();
                this.printModule.print(this.documentHelper, printWindow);
                this.viewer = new WebLayoutViewer(this);
                this.documentHelper.layout.layoutWholeDocument();
                this.documentHelper.isWebPrinting = false;
            } else {
                this.printModule.print(this.documentHelper, printWindow);
            }
        } else {
            this.checkModuleInjection('Print', this.enablePrint);
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
            this.checkModuleInjection('SfdtExport', this.enableSfdtExport);
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
        if (formatType === 'Docx' || formatType === 'Dotx') {
            if (this.wordExportModule) {
                this.wordExportModule.save(this.documentHelper, fileName, formatType);
            } else {
                this.checkModuleInjection('WordExport', this.enableWordExport);
            }
        } else if (formatType === 'Txt') {
            if (this.textExportModule) {
                this.textExportModule.save(this.documentHelper, fileName);
            } else {
                this.checkModuleInjection('TextExport', this.enableTextExport);
            }
        } else if (formatType === 'Sfdt') {
            if (this.sfdtExportModule) {
                if (this.documentEditorSettings.optimizeSfdt) {
                    const jsonString: string = this.serialize();
                    const blob: Blob = new Blob([jsonString], {
                        type: 'application/json'
                    });
                    const archiveItem: ZipArchiveItem = new ZipArchiveItem(blob, 'sfdt');
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
                this.checkModuleInjection('SfdtExport', this.enableSfdtExport);
            }
        } else {
            throw new Error('Invalid operation. Specified export is not enabled.');
        }
    }
    private zipArchiveBlobToSfdtFile(blob: Blob, fileName: string): void {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function () : void {
            const dataUrl: string = reader.result as string;
            const base64: string = dataUrl.split(',')[1];
            const jsonString: any = {};
            jsonString.sfdt = base64;
            const blob: Blob = new Blob([JSON.stringify(jsonString)], {
                type: 'application/json'
            });
            Save.save(fileName + '.sfdt', blob);
        };
    }
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
            if (formatType === 'Docx' || formatType === 'Dotx') {
                if (this.wordExportModule) {
                    resolve(this.wordExportModule.saveAsBlob(this.documentHelper, formatType));
                } else {
                    this.checkModuleInjection('WordExport', this.enableWordExport);
                }
            } else if (formatType === 'Txt') {
                if (this.textExportModule) {
                    resolve(this.textExportModule.saveAsBlob(this.documentHelper));
                } else {
                    this.checkModuleInjection('TextExport', this.enableTextExport);
                }
            } else if (formatType === 'Sfdt') {
                if (this.sfdtExportModule) {
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
                } else {
                    this.checkModuleInjection('SfdtExport', this.enableSfdtExport);
                }
            }
        });
    }
    private getBase64StringFromBlob(blob: Blob): Promise<string> {
        return new Promise((resolve: (value: string | PromiseLike<string>) => void,
                            reject: (value: string | PromiseLike<string>) => void) => {
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function () : void {
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
                    const paragraph: ParagraphWidget = sections[parseInt(i.toString(), 10)].childWidgets[0] as ParagraphWidget;
                    if (!this.enableLayout) {
                        this.documentHelper.layout.addLineWidget(paragraph);
                    }
                    paragraph.paragraphFormat.baseStyle = style;
                    paragraph.paragraphFormat.listFormat.baseStyle = style;
                }
            }
            this.documentHelper.onDocumentChanged(sections);
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
        case 'DatepickerContentControl':
            this.showDateContentDialog();
            break;
        case 'PictureContentControl':
            this.showPicContentControlDialog();
            break;
        case 'ContentControlProperties':
            this.showContentPropertiesDialog();
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
        } else {
            this.checkModuleInjection('OptionsPane', this.enableOptionsPane);
        }
    }
    /**
     * Shows the Xml pane.
     *
     * @returns {void}
     */
    public showXmlPane(): void {
        if (!isNullOrUndefined(this.xmlPaneModule) && isNullOrUndefined(this.xmlPaneModule.element)) {
            this.xmlPaneModule.showXmlProperties(true);
        } else {
            this.checkModuleInjection('XmlPane', this.enableXMLPane);
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
        if (this.spellCheckDialogModule && this.spellCheckerModule) {
            const element: ContextElementInfo = this.spellCheckerModule.retriveText();
            if (!isNullOrUndefined(element)) {
                this.spellCheckDialogModule.show(element.text, element.element);
            }
        } else {
            this.checkModuleInjection('SpellCheck', this.enableSpellCheck);
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
            if (!isNullOrUndefined(this.readableDiv)) {
                this.readableDiv.remove();
                this.readableDiv = undefined;
            }
            this.element.classList.remove('e-documenteditor');
            this.element.innerHTML = '';
        }
        if (!this.refreshing) {
            this.element = undefined;
            this.rulerHelper.destroy();
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
     * @param {WStyle} styleInCollection - Specifies the style in collection.
     * @param {WStyle} style - Specifies the style.
     * @private
     * @returns {void} - Returns the void.
     */
    public updateStyle(styleInCollection: WStyle, style: WStyle): void {
        if (!isNullOrUndefined(this.styleDialogModule)) {
            const type: string = style.type === 'Paragraph' ? !isNullOrUndefined(style.link) ? 'Linked Style' : 'Paragraph' : 'Character';
            styleInCollection.type = this.styleDialogModule.getTypeValue(type);
            styleInCollection.basedOn = style.basedOn;

            if (type === 'Paragraph' || type === 'Linked Style') {
                styleInCollection.next = style.next;
                (styleInCollection as WParagraphStyle).characterFormat.destroy();
                (styleInCollection as WParagraphStyle).characterFormat.copyFormat((style as WParagraphStyle).characterFormat);
                const oldListId: number = (styleInCollection as WParagraphStyle).paragraphFormat.listFormat.listId;
                (styleInCollection as WParagraphStyle).paragraphFormat.destroy();
                (styleInCollection as WParagraphStyle).paragraphFormat.copyFormat((style as WParagraphStyle).paragraphFormat);
                // this.updateList();
                styleInCollection.link = style.link;
                if (!isNullOrUndefined(oldListId) && oldListId > -1) {
                    const list: WList = this.documentHelper.getListById(oldListId);
                    if (!isNullOrUndefined(list)) {
                        this.documentHelper.lists.splice(this.documentHelper.lists.indexOf(list), 1);
                    }
                }
            } else if (type === 'Character') {
                (styleInCollection as WCharacterStyle).characterFormat.destroy();
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
        if (!isNullOrUndefined(this.spellCheckerModule)) {
            if (!isNullOrUndefined(this.spellCheckerModule.errorWordCollection)) {
                this.spellCheckerModule.errorWordCollection.clear();
            }
            if (!isNullOrUndefined(this.spellCheckerModule.uniqueWordsCollection)) {
                this.spellCheckerModule.uniqueWordsCollection.clear();
            }
        }
    }
    /**
     * @param {string} name - Specifies the name.
     * @param {number} listId - Specifies the list id.
     * @private
     * @returns {void} - Returns the void.
     */
    public setStyleData(name: string, listId?: number): void {
        if (!this.enableCollaborativeEditing) {
            return;
        }
        this.isSettingOp = true;
        let operation: Operation;
        if (!isNullOrUndefined(name) && !isNullOrUndefined(this.documentHelper.owner.sfdtExportModule)) {
            const style: Object = this.documentHelper.styles.findByName(name);
            if (!isNullOrUndefined(style)) {
                const styleObject: any = this.getStyleObject(style, listId);
                if (!isNullOrUndefined(style) && this.enableCollaborativeEditing) {
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
     * Sets custom fonts in the document editor.
     *
     * @param {string | object[]}fonts - A stringified JSON array or an array of objects, where each object defines:
     * - `fontFamily`: The name of the font family.
     * - `src`: A URL or relative path pointing to the font file.
     *
     * Example usage:
     *
     * // Using a stringified JSON array
     * documentEditor.setCustomFonts('[{fontFamily: "Algerian", src: "url('/fonts/myfont.ttf') format('ttf')"}, {fontFamily: "Arial", src: "url('https://example.com/font2.ttf') format('ttf')"}, {fontFamily: "Arial", src: "url('data:font/ttf;base64,d09GRgABAAAAAA...') format('ttf')"}]');
     *
     * // Using an array of objects
     * documentEditor.setCustomFonts([
     * {fontFamily: "Algerian", src: "url('/fonts/myfont.ttf') format('ttf')"},
     * {fontFamily: "Arial", src: "url('https://example.com/font2.ttf') format('ttf')"},
     * {fontFamily: "Arial", src: "url('data:font/ttf;base64,d09GRgABAAAAAA...') format('ttf')"}
     * ]);
     * @returns {void}
     */
    public setCustomFonts(fonts: string | object[]): void {
        let externalFonts: ExternalFontInfo[];
        this.externalFonts = [];
        if (typeof fonts === 'string') {
            try {
                externalFonts = JSON.parse(fonts) as ExternalFontInfo[];
            } catch (error) {
                console.error('Failed to parse JSON string:', error);
                return;
            }
        } else if (Array.isArray(fonts)) {
            externalFonts = fonts as ExternalFontInfo[];
        } else {
            console.error('Invalid input type');
            return;
        }
        externalFonts.forEach((externalFonts: ExternalFontInfo) => {
            this.externalFonts.push({
                fontFamily: externalFonts.fontFamily,
                src: externalFonts.src
            });
        });
        this.updateExternalStyle();
    }
    /**
     *
     * @private
     * @param {Object} style - Specifies the style.
     * @param {number} listId - Specifies the list id.
     * @returns {any} - Returns the style object.
     */
    public getStyleObject(style: Object, listId: number): any {
        if (!isNullOrUndefined(style)) {
            const keyIndex: number = this.documentHelper.owner.sfdtExportModule.keywordIndex;
            this.documentHelper.owner.sfdtExportModule.keywordIndex = 1;
            const styleData: any = this.documentHelper.owner.sfdtExportModule.writeStyle(style as WStyle);
            const styleObject: any = {
                'optimizeSfdt': true,
                'sty': [styleData]
            };
            if (this.editorModule.isLinkedStyle((style as WStyle).name)) {
                const linkedStyle: WStyle = this.documentHelper.styles.findByName((style as WStyle).name + ' Char') as WStyle;
                const linkedStyleData: any = this.documentHelper.owner.sfdtExportModule.writeStyle(linkedStyle);
                styleObject.sty.push(linkedStyleData);
            }
            if (!isNullOrUndefined(listId) && listId > -1) {
                const list: WList = this.documentHelper.getListById(listId);
                styleObject[listsProperty[1]] = [];
                styleObject[listsProperty[1]].push(this.sfdtExportModule.writeList(list));
                styleObject[abstractListsProperty[1]] = [];
                styleObject[abstractListsProperty[1]].push(this.sfdtExportModule.writeAbstractList(list.abstractList));
            }
            this.documentHelper.owner.sfdtExportModule.keywordIndex = keyIndex;
            return styleObject;
        }
        return undefined;
    }

    /**
     * @param {string} name - Specifies the name.
     * @param {boolean} value - Specifies the value.
     * @param {string} hashValue - Specifies the hash value.
     * @param {string} saltValue - Specifies the salt value.
     * @param {ProtectionType} protectionType - Specifies the protection type.
     * @private
     * @returns {void} - Returns the void.
     */
    public getSettingData(name: string, value: boolean, hashValue?: string, saltValue?: string, protectionType?: ProtectionType): void {
        if (!this.enableCollaborativeEditing || this.editorModule.isRemoteAction) {
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
            };
            operation = {
                text: name,
                protectionData: protectionData
            };
        } else {
            operation = {
                text: name,
                enableTrackChanges: value
            };
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
        if (this.xmlPaneModule) {
            this.xmlPaneModule.destroy();
            this.xmlPaneModule = undefined;
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
        if (this.contentControlPropertiesDialogModule){
            this.contentControlPropertiesDialogModule.destroy();
            this.contentControlPropertiesDialogModule = undefined;
        }
        if (this.picContentControlDialogModule) {
            this.picContentControlDialogModule.destroy();
            this.picContentControlDialogModule = undefined;
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
        if (this.hRuler) {
            this.hRuler.destroy();
            this.hRuler = undefined;
        }
        if (this.vRuler) {
            this.vRuler.destroy();
            this.vRuler = undefined;
        }
        if (this.rulerContainer) {
            this.rulerContainer.remove();
            this.rulerContainer = null;
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
     * Specifies the spell check by page action of Document Editor.
     *
     * @default 'SpellCheckByPage'
     */
    @Property('SpellCheckByPage')
    public spellCheckByPage: string;

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
