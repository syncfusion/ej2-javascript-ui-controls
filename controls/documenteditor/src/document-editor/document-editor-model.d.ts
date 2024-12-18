import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration, ChildProperty, classList, Complex, formatUnit, Base } from '@syncfusion/ej2-base';import { isNullOrUndefined, L10n, EmitType, Browser } from '@syncfusion/ej2-base';import { Save } from '@syncfusion/ej2-file-utils';import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle, BeforePaneSwitchEventArgs, LayoutType, FormFieldFillEventArgs, FormFieldData } from './index';import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, CommentDeleteEventArgs, RevisionActionEventArgs, BeforeFileOpenArgs, CommentActionEventArgs, XmlHttpRequestEventArgs, XmlHttpRequestHandler, beforeXmlHttpRequestSend } from './index';import { LayoutViewer, PageLayoutViewer, WebLayoutViewer, BulletsAndNumberingDialog } from './index';import { Print, SearchResultsChangeEventArgs, SelectionWidgetInfo, Dictionary, ElementBox } from './index';import { Page, BodyWidget, ParagraphWidget } from './index';import { WSectionFormat, WParagraphFormat, WCharacterFormat } from './index';import { SfdtReader } from './index';import { Selection } from './index';import { TextPosition } from './index';import { Editor, EditorHistory } from './index';import { WStyles } from './index';import { HeaderFooters } from './index';import { Search } from './index';import { OptionsPane } from './index';import { XmlPane } from './index';import { WordExport } from './index';import { TextExport } from './index';import { FormatType, PageFitType, DialogType, FormattingExceptions, CompatibilityMode } from './index';import { ContextMenu } from './index';import { ImageResizer } from './index';import { SfdtExport } from './index';import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';import { SpellChecker } from './implementation/spell-check/spell-checker';import { SpellCheckDialog } from './implementation/dialogs/spellCheck-dialog';import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties, DocumentHelper, listsProperty, abstractListsProperty } from './index';import { PasteOptions } from './index';import { CommentReviewPane, CheckBoxFormFieldDialog, DropDownFormField, TextFormField, CheckBoxFormField, FieldElementBox, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, ContextElementInfo, CollaborativeEditing, CollaborativeEditingEventArgs, Operation, ProtectionInfo, HistoryInfo, BaseHistoryInfo, WParagraphStyle, WList, WCharacterStyle, CollaborativeEditingHandler, ActionInfo, ExternalFontInfo } from './implementation/index';import { TextFormFieldDialog } from './implementation/dialogs/form-field-text-dialog';import { DropDownFormFieldDialog } from './implementation/dialogs/form-field-drop-down-dialog';import { FormFillingMode, TrackChangeEventArgs, ServiceFailureArgs, ImageFormat, ProtectionType, ContentControlInfo, ServerActionType, CommentInfo, CommentProperties } from './base';import { TrackChangesPane } from './implementation/track-changes/track-changes-pane';import { RevisionCollection } from './implementation/track-changes/track-changes';import { NotesDialog } from './implementation/dialogs/notes-dialog';import { CommentElementBox, ContentControl, FootNoteWidget, HeaderFooterWidget, IWidget, ImageElementBox, LineWidget, TextElementBox } from './implementation/viewer/page';import { internalZoomFactorChange, contentChangeEvent, documentChangeEvent, selectionChangeEvent, zoomFactorChangeEvent, beforeFieldFillEvent, afterFieldFillEvent, serviceFailureEvent, viewChangeEvent, customContextMenuSelectEvent, customContextMenuBeforeOpenEvent, internalviewChangeEvent, internalDocumentEditorSettingsChange, trackChanges, internalOptionPaneChange, documentLoadFailedEvent, beforecontentControlFillEvent, aftercontentControlFillEvent } from './base/constants';import { Optimized, Regular, HelperMethods } from './index';import { ColumnsDialog } from './implementation/dialogs/columns-dialog';import { DocumentCanvasElement } from './implementation/viewer/document-canvas';import { ZipArchiveItem, ZipArchive } from '@syncfusion/ej2-compression';import { Ruler } from './implementation/ruler/index';import { TabDialog } from './implementation/dialogs/tab-dialog';import { RulerHelper } from './implementation/utility/dom-util';import { ColorPickerModel } from '@syncfusion/ej2-inputs';import { MentionModel } from '@syncfusion/ej2-dropdowns';import { DatePickerDialog } from './implementation/dialogs/datepicker-dialog';import { ContentControlPropertiesDialog } from './implementation/dialogs/content-control-properties-dialog';import { PicContentControlDialog } from './implementation/dialogs/pic-contentControl-dialog';import { DialogUtility, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';import { Comment, ContentControlFillEventArgs, DocumentLoadFailedEventArgs } from './base/events-helper';import { FieldSettingsModel } from '@syncfusion/ej2-dropdowns';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DocumentEditorSettings
 */
export interface DocumentEditorSettingsModel {

    /**
     * Gets or sets a value indicating where to append the pop up element
     *
     * @returns {HTMLElement}
     * @aspType HTMLElement
     * @default null
     */
    popupTarget?: HTMLElement;

    /**
     * Specifies the user preferred Search Highlight Color of Document Editor.
     *
     * @default '#FFE97F'
     */
    searchHighlightColor?: string;

    /**
     * Specifies the user preferred font family of Document Editor.
     * @default ['Algerian','Arial','Calibri','Cambria','CambriaMath','Candara','CourierNew','Georgia','Impact','SegoePrint','SegoeScript','SegoeUI','Symbol','TimesNewRoman','Verdana','Wingdings']
     */
    fontFamilies?: string[];

    /**
     * Gets or sets the form field settings.
     */
    formFieldSettings?: FormFieldSettingsModel;

    /**
     * Specified the auto resize settings.
     */
    autoResizeSettings?: AutoResizeSettingsModel;

    /**
     * Gets ot sets the collaborative editing settings.
     */
    collaborativeEditingSettings?: CollaborativeEditingSettingsModel;

    /**
     * Specifies the device pixel ratio for the image generated for printing.
     * > Increasing the device pixel ratio will increase the image file size, due to high resolution of image.
     */
    printDevicePixelRatio?: number;

    /**
     * Gets or sets a value indicating whether to use optimized text measuring approach to match Microsoft Word pagination.
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` if uses optimized text measuring approach to match Microsoft Word pagination; otherwise, `false`
     */
    enableOptimizedTextMeasuring?: boolean;

    /**
     * Enable or Disable moving selected content within Document Editor
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` moving selected content within Document Editor is enabled; otherwise, `false`
     */
    allowDragAndDrop?: boolean;

    /**
     * Gets or sets the maximum number of rows allowed while inserting a table in Document editor component.
     * > The maximum value is 32767, as per Microsoft Word application and you can set any value less than 32767 to this property. If you set any value greater than 32767, then Syncfusion Document editor will automatically reset as 32767.
     *
     * @default 32767
     * @returns {number}
     */
    maximumRows?: number;

    /**
     * Gets or sets the maximum number of columns allowed while inserting a table in Document editor component.
     * > The maximum value is 63, as per Microsoft Word application and you can set any value less than 63 to this property. If you set any value greater than 63, then Syncfusion Document editor will automatically reset as 63.
     *
     * @default 63
     * @returns {number}
     */
    maximumColumns?: number;

    /**
     * Gets or sets a value indicating whether to show the hidden characters like spaces, tab, paragraph marks, and breaks.
     *
     * @default false
     * @aspType bool
     * @returns {boolean} Returns `false` if hides the hidden characters like spaces, tab, paragraph marks, and breaks. Otherwise `true`.
     */
    showHiddenMarks?: boolean;

    /**
     * Gets or sets a value indicating whether to show square brackets around bookmarked items.
     *
     * @returns {boolean}
     * @aspType bool
     * @default false
     */
    showBookmarks?: boolean;

    /**
     * Gets or sets a value indicating whether to highlight the editable ranges in the document where the current user can edit.
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` if editable ranges in the document is highlighted. Otherwise `false`.
     */
    highlightEditableRanges?: boolean;

    /**
     * Describes whether to reduce the resultant SFDT file size by minifying the file content
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` if sfdt content generated is optimized. Otherwise `false`.
     */
    optimizeSfdt?: boolean;

    /**
     *  Gets or sets a value indicating whether to display ruler in Document Editor.
     *
     * @default false
     * @aspType bool
     * @returns {boolean} Returns `true` if ruler is visible in Document Editor. Otherwise `false`.
     */
    showRuler?: boolean;

    /**
     * Gets or sets color picker settings to customize the color picker used in Document Editor.
     */
    colorPickerSettings?: ColorPickerModel;

    /**
     *  Gets or sets a value indicating whether to display navigation pane in Document Editor.
     *
     * @default false
     * @aspType bool
     * @returns {boolean} Returns `true` if navigation pane is visible in Document Editor. Otherwise `false`.
     */
    showNavigationPane?: boolean;

    /**
     * Gets ot sets the mention configuration used in Document Editor.
     */
    mentionSettings?: MentionModel;

}

/**
 * Interface for a class DocumentSettings
 */
export interface DocumentSettingsModel {

    /**
     * Gets or sets the compatibility mode of the current document.
     *
     * @default `Word2013`
     * @returns {CompatibilityMode}
     */
    compatibilityMode?: CompatibilityMode;

}

/**
 * Interface for a class AutoResizeSettings
 */
export interface AutoResizeSettingsModel {

    /**
     * Gets or sets the time interval in milliseconds to validate whether the parent element's height and width is non-zero.
     *
     * @default 2000
     * @returns {number}
     */
    interval?: number;

    /**
     * Gets or sets the number of times the Document editor has to validate whether the parent element's height and width is non-zero.
     *
     * @default 5
     * @returns {number}
     */
    iterationCount?: number;

}

/**
 * Interface for a class DocumentEditor
 */
export interface DocumentEditorModel extends ComponentModel{

    /**
     * Enable collaborative editing in document editor.
     *
     * @default false
     */
    enableCollaborativeEditing?: boolean;

    /**
     * Gets or sets the default Paste Formatting Options
     *
     * @default KeepSourceFormatting
     */
    defaultPasteOption?: PasteOptions;

    /**
     * Gets or sets the Layout Type.
     *
     * @default Pages
     */
    layoutType?: LayoutType;

    /**
     * Gets or sets the current user.
     *
     * @default ''
     */
    currentUser?: string;

    /**
     * Gets or sets the color used for highlighting the editable ranges or regions of the `currentUser` in Document Editor. The default value is "#FFFF00".
     * > If the visibility of text affected due this highlight color matching with random color applied for the track changes, then modify the color value of this property to resolve text visibility problem.
     *
     * @default '#FFFF00'
     */
    userColor?: string;

    /**
     * Gets or sets the page gap value in document editor.
     *
     * @default 20
     */
    pageGap?: number;

    /**
     * Gets or sets the name of the document.
     *
     * @default ''
     */
    documentName?: string;

    /**
     * Defines the width of the DocumentEditor component.
     *
     * @default '100%'
     */
    width?: string;

    /**
     * Defines the height of the DocumentEditor component.
     *
     * @default '200px'
     */
    height?: string;

    /**
     * Gets or sets the Sfdt Service URL.
     *
     * @default ''
     */
    serviceUrl?: string;

    /**
     * Gets or sets the zoom factor in document editor.
     *
     * @default 1
     */
    zoomFactor?: number;

    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     *
     * @default 2000
     * @aspType int
     */
    zIndex?: number;

    /**
     * Gets or sets a value indicating whether the document editor is in read only state or not.
     *
     * @default true
     */
    isReadOnly?: boolean;

    /**
     * Gets or sets a value indicating whether print needs to be enabled or not.
     *
     * @default false
     */
    enablePrint?: boolean;

    /**
     * Gets or sets a value indicating whether selection needs to be enabled or not.
     *
     * @default false
     */
    enableSelection?: boolean;

    /**
     * Gets or sets a value indicating whether editor needs to be enabled or not.
     *
     * @default false
     */
    enableEditor?: boolean;

    /**
     * Gets or sets a value indicating whether editor history needs to be enabled or not.
     *
     * @default false
     */
    enableEditorHistory?: boolean;

    /**
     * Gets or sets a value indicating whether Sfdt export needs to be enabled or not.
     *
     * @default false
     */
    enableSfdtExport?: boolean;

    /**
     * Gets or sets a value indicating whether word export needs to be enabled or not.
     *
     * @default false
     */
    enableWordExport?: boolean;

    /**
     * Gets or sets a value indicating whether the automatic focus behavior is enabled for Document editor or not.
     *
     * > By default, the Document editor gets focused automatically when the page loads. If you want the Document editor not to be focused automatically, then set this property to false.
     *
     * @returns {boolean}
     * @aspType bool
     * @default true
     */
    enableAutoFocus?: boolean;

    /**
     * Gets or sets a value indicating whether text export needs to be enabled or not.
     *
     * @default false
     */
    enableTextExport?: boolean;

    /**
     * Gets or sets a value indicating whether options pane is enabled or not.
     *
     * @default false
     */
    enableOptionsPane?: boolean;

    /**
     * Gets or sets a value indicating whether context menu is enabled or not.
     *
     * @default false
     */
    enableContextMenu?: boolean;

    /**
     * Gets or sets a value indicating whether hyperlink dialog is enabled or not.
     *
     * @default false
     */
    enableHyperlinkDialog?: boolean;

    /**
     * Gets or sets a value indicating whether bookmark dialog is enabled or not.
     *
     * @default false
     */
    enableBookmarkDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table of contents dialog is enabled or not.
     *
     * @default false
     */
    enableTableOfContentsDialog?: boolean;

    /**
     * Gets or sets a value indicating whether search module is enabled or not.
     *
     * @default false
     */
    enableSearch?: boolean;

    /**
     * Gets or sets a value indicating whether paragraph dialog is enabled or not.
     *
     * @default false
     */
    enableParagraphDialog?: boolean;

    /**
     * Gets or sets a value indicating whether list dialog is enabled or not.
     *
     * @default false
     */
    enableListDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table properties dialog is enabled or not.
     *
     * @default false
     */
    enableTablePropertiesDialog?: boolean;

    /**
     * Gets or sets a value indicating whether borders and shading dialog is enabled or not.
     *
     * @default false
     */
    enableBordersAndShadingDialog?: boolean;

    /**
     * Gets or sets a value indicating whether notes dialog is enabled or not.
     *
     * @default false
     */
    enableFootnoteAndEndnoteDialog?: boolean;

    /**
     * Gets or sets a value indicating whether margin dialog is enabled or not.
     *
     * @default false
     */
    enableColumnsDialog?: boolean;

    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     *
     * @default false
     */
    enablePageSetupDialog?: boolean;

    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     *
     * @default false
     */
    enableStyleDialog?: boolean;

    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     *
     * @default false
     */
    enableFontDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table options dialog is enabled or not.
     *
     * @default false
     */
    enableTableOptionsDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table dialog is enabled or not.
     *
     * @default false
     */
    enableTableDialog?: boolean;

    /**
     * Gets or sets a value indicating whether image resizer is enabled or not.
     *
     * @default false
     */
    enableImageResizer?: boolean;

    /**
     * Gets or sets a value indicating whether editor need to be spell checked.
     *
     * @default false
     */
    enableSpellCheck?: boolean;

    /**
     * Gets or sets a value indicating whether comment is enabled or not
     *
     * @default false
     */
    enableComment?: boolean;

    /**
     * Gets or sets a value indicating whether track changes is enabled or not
     *
     * @default false
     */
    enableTrackChanges?: boolean;

    /**
     * Gets or sets a value indicating whether form fields is enabled or not.
     *
     * @default false
     */
    enableFormField?: boolean;

    /**
     * Gets or sets a value indicating whether tab key can be accepted as input or not.
     *
     * @default false
     */
    acceptTab?: boolean;

    /**
     * Gets or sets a value indicating whether holding Ctrl key is required to follow hyperlink on click. The default value is true.
     *
     * @default true
     */
    useCtrlClickToFollowHyperlink?: boolean;

    /**
     * Gets or sets the page outline color.
     *
     * @default '#000000'
     */
    pageOutline?: string;

    /**
     * Gets or sets a value indicating whether to enable cursor in document editor on read only state or not. The default value is false.
     *
     * @default false
     */
    enableCursorOnReadOnly?: boolean;

    /**
     * Gets or sets a value indicating whether local paste needs to be enabled or not.
     *
     * @default false
     */
    enableLocalPaste?: boolean;

    /**
     * Enables the partial lock and edit module.
     *
     * @default false
     */
    enableLockAndEdit?: boolean;

    /**
     * Defines the settings for DocumentEditor customization.
     *
     * @default {}
     */
    documentEditorSettings?: DocumentEditorSettingsModel;

    /**
     * Gets the settings and properties of the document that is opened in Document editor component.
     *
     * @default {}
     */
    documentSettings?: DocumentSettingsModel;

    /**
     * Defines the settings of the DocumentEditor services
     */
    serverActionSettings?: ServerActionSettingsModel;

    /**
     * Adds the custom headers to XMLHttpRequest.
     *
     * @default []
     */
    headers?: object[];

    /**
     * Shows the comment in the document.
     *
     * @default false
     */
    showComments?: boolean;

    /**
     * Shows the revision changes in the document.
     *
     * @default false
     */
    showRevisions?: boolean;

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
    autoResizeOnVisibilityChange?: boolean;

    /**
     * Triggers whenever the document changes in the document editor.
     *
     * @event documentChange
     */
    documentChange?: EmitType<DocumentChangeEventArgs>;

    /**
     * Triggers whenever the container view changes in the document editor.
     *
     * @event viewChange
     */
    viewChange?: EmitType<ViewChangeEventArgs>;

    /**
     * Triggers whenever the zoom factor changes in the document editor.
     *
     * @event zoomFactorChange
     */
    zoomFactorChange?: EmitType<ZoomFactorChangeEventArgs>;

    /**
     * Triggers whenever the selection changes in the document editor.
     *
     * @event selectionChange
     */
    selectionChange?: EmitType<SelectionChangeEventArgs>;

    /**
     * Triggers whenever the hyperlink is clicked or tapped in the document editor.
     *
     * @event requestNavigate
     */
    requestNavigate?: EmitType<RequestNavigateEventArgs>;

    /**
     * Triggers whenever the content changes in the document editor.
     *
     * @event contentChange
     */
    contentChange?: EmitType<ContentChangeEventArgs>;

    /**
     * Triggers whenever the key is pressed in the document editor.
     *
     * @event keyDown
     */
    keyDown?: EmitType<DocumentEditorKeyDownEventArgs>;

    /**
     * Triggers whenever search results changes in the document editor.
     *
     * @event searchResultsChange
     */
    searchResultsChange?: EmitType<SearchResultsChangeEventArgs>;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers while selecting the custom context-menu option.
     *
     * @event customContextMenuSelect
     */
    customContextMenuSelect?: EmitType<CustomContentMenuEventArgs>;

    /**
     * Triggers before opening the custom context-menu option.
     *
     * @event customContextMenuBeforeOpen
     */
    customContextMenuBeforeOpen?: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;

    /**
     * Triggers before opening the comment pane.
     *
     * @event beforePaneSwitch
     */
    beforePaneSwitch?: EmitType<BeforePaneSwitchEventArgs>;

    /**
     * Triggers after inserting the comment.
     *
     * @event commentBegin
     */
    commentBegin?: EmitType<Object>;

    /**
     * Triggers after posting the comment.
     *
     * @event commentEnd
     */
    commentEnd?: EmitType<Object>;

    /**
     * Triggers before a file is opened.
     *
     * @event beforeFileOpen
     */
    beforeFileOpen?: EmitType<BeforeFileOpenArgs>;

    /**
     * Triggers after deleting the comment.
     *
     * @event commentDelete
     */
    commentDelete?: EmitType<CommentDeleteEventArgs>;

    /**
     * Triggers before accepting or rejecting changes.
     *
     * @event beforeAcceptRejectChanges
     */
    beforeAcceptRejectChanges?: EmitType<RevisionActionEventArgs>;

    /**
     * Triggers on comment actions(Post, edit, reply, resolve, reopen).
     *
     * @event beforeCommentAction
     */
    beforeCommentAction?: EmitType<CommentActionEventArgs>;

    /**
     * Triggers when the trackChanges enabled / disabled.
     *
     * @event trackChange
     */
    trackChange?: EmitType<TrackChangeEventArgs>;

    /**
     * Triggers before the form field fill.
     *
     * @event beforeFormFieldFill
     */
    beforeFormFieldFill?: EmitType<FormFieldFillEventArgs>;

    /**
     * Triggers when the server side action fails.
     *
     * @event serviceFailure
     */
    serviceFailure?: EmitType<ServiceFailureArgs>;

    /**
     * Triggers after the form field fill.
     *
     * @event afterFormFieldFill
     */
    afterFormFieldFill?: EmitType<FormFieldFillEventArgs>;

    /**
     * Triggers when the document editor collaborative actions (such as LockContent, SaveContent, UnlockContent) gets completed.
     *
     * @event actionComplete
     */
    actionComplete?: EmitType<CollaborativeEditingEventArgs>;

    /**
     * Triggers when user interaction prevented in content control.
     *
     * @event contentControl
     */
    contentControl?: EmitType<Object>;

    /**
     * Triggers before a server request is started, allows you to modify the XMLHttpRequest object (setting additional headers, if needed).
     */
    beforeXmlHttpRequestSend?: EmitType<XmlHttpRequestEventArgs>;

    /**
     * Triggers when SFDT is failed to load in the document editor
     */
    documentLoadFailed?: EmitType<DocumentLoadFailedEventArgs>;

}

/**
 * Interface for a class ServerActionSettings
 */
export interface ServerActionSettingsModel {

    /**
     * Specifies the system clipboard action of Document Editor.
     *
     * @default 'SystemClipboard'
     */
    systemClipboard?: string;

    /**
     * Specifies the spell check action of Document Editor.
     *
     * @default 'SpellCheck'
     */
    spellCheck?: string;

    /**
     * Specifies the spell check by page action of Document Editor.
     *
     * @default 'SpellCheckByPage'
     */
    spellCheckByPage?: string;

    /**
     * Specifies the restrict editing encryption/decryption action of Document Editor.
     *
     * @default 'RestrictEditing'
     */
    restrictEditing?: string;

    /**
     * Specifies the server action name to lock selected region.
     *
     * @default 'CanLock'
     */
    canLock?: string;

    /**
     * Specifies the server action name to pull pending actions.
     *
     * @default 'GetPendingActions'
     */
    getPendingActions?: string;

}

/**
 * Interface for a class FormFieldSettings
 */
export interface FormFieldSettingsModel {

    /**
     * Gets or sets the form fields shading color.
     * You can customize shading color in application level, but cannot be exported in file level
     *
     * @default '#cfcfcf'
     */
    shadingColor?: string;

    /**
     * Gets or sets the whether apply shadings for field or not.
     *
     * @default true
     */
    applyShading?: boolean;

    /**
     * Gets or sets the field selection color.
     *
     * @default '#cccccc'
     */
    selectionColor?: string;

    /**
     * Gets or sets the form filling mode type.
     *
     * @default 'Popup'
     */
    formFillingMode?: FormFillingMode;

    /**
     * Gets or sets the formatting exception.
     *
     * @default []
     */
    formattingExceptions?: FormattingExceptions[];

}

/**
 * Interface for a class CollaborativeEditingSettings
 */
export interface CollaborativeEditingSettingsModel {

    /**
     * Gets or sets the collaborative editing room name.
     *
     * @default ''
     */
    roomName?: string;

    /**
     * Gets or sets the editable region color.
     */
    editableRegionColor?: string;

    /**
     * Gets or sets the locked region color.
     */
    lockedRegionColor?: string;

    /**
     * Gets or sets the timeout for syncing content in milliseconds.
     */
    saveTimeout?: number;

}

/**
 * Interface for a class ContainerServerActionSettings
 */
export interface ContainerServerActionSettingsModel extends ServerActionSettingsModel{

    /**
     * Specifies the load action of Document Editor.
     *
     * @default 'Import'
     */
    import?: string;

}