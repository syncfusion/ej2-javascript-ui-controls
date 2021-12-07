import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration, ChildProperty, classList, Complex, formatUnit } from '@syncfusion/ej2-base';import { isNullOrUndefined, L10n, EmitType, Browser } from '@syncfusion/ej2-base';import { Save } from '@syncfusion/ej2-file-utils';import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle, BeforePaneSwitchEventArgs, LayoutType, FormFieldFillEventArgs, FormFieldData } from './index';import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, CommentDeleteEventArgs, BeforeFileOpenArgs, CommentActionEventArgs, XmlHttpRequestEventArgs } from './index';import { LayoutViewer, PageLayoutViewer, WebLayoutViewer, BulletsAndNumberingDialog } from './index';import { Print, SearchResultsChangeEventArgs } from './index';import { Page, BodyWidget, ParagraphWidget } from './index';import { WSectionFormat, WParagraphFormat, WCharacterFormat } from './index';import { SfdtReader } from './index';import { Selection } from './index';import { TextPosition } from './index';import { Editor, EditorHistory } from './index';import { WStyles } from './index';import { HeaderFooters } from './index';import { Search } from './index';import { OptionsPane } from './index';import { WordExport } from './index';import { TextExport } from './index';import { FormatType, PageFitType, DialogType, FormattingExceptions } from './index';import { ContextMenu } from './index';import { ImageResizer } from './index';import { SfdtExport } from './index';import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';import { SpellChecker } from './implementation/spell-check/spell-checker';import { SpellCheckDialog } from './implementation/dialogs/spellCheck-dialog';import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties, DocumentHelper } from './index';import { PasteOptions } from './index';import { CommentReviewPane, CheckBoxFormFieldDialog, DropDownFormField, TextFormField, CheckBoxFormField, FieldElementBox, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, ContextElementInfo, CollaborativeEditing, CollaborativeEditingEventArgs } from './implementation/index';import { TextFormFieldDialog } from './implementation/dialogs/form-field-text-dialog';import { DropDownFormFieldDialog } from './implementation/dialogs/form-field-drop-down-dialog';import { FormFillingMode, TrackChangeEventArgs, ServiceFailureArgs, ImageFormat } from './base';import { TrackChangesPane } from './implementation/track-changes/track-changes-pane';import { RevisionCollection } from './implementation/track-changes/track-changes';import { NotesDialog } from './implementation/dialogs/notes-dialog';import { FootNoteWidget } from './implementation/viewer/page';import { internalZoomFactorChange, contentChangeEvent, documentChangeEvent, selectionChangeEvent, zoomFactorChangeEvent, beforeFieldFillEvent, afterFieldFillEvent, serviceFailureEvent, viewChangeEvent, customContextMenuSelectEvent, customContextMenuBeforeOpenEvent, internalviewChangeEvent } from './base/constants';import { Optimized, Regular } from './index';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DocumentEditorSettings
 */
export interface DocumentEditorSettingsModel {

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
     * Form field settings.
     */
    formFieldSettings?: FormFieldSettingsModel;

    /**
     * Collaborative editing settings.
     */
    collaborativeEditingSettings?: CollaborativeEditingSettingsModel;

    /**
     * Specifies the device pixel ratio for the image generated for printing.
     * Remarks: Increasing the device pixel ratio will increase the image file size, due to high resolution of image.
     */
    printDevicePixelRatio?: number;

    /**
     * Gets or sets a value indicating whether to use optimized text measuring approach to match Microsoft Word pagination.
     *
     * @default true
     * @aspType bool
     * @returns {boolean} - `true` use optimized text measuring approach to match Microsoft Word pagination; otherwise, `false`
     */
    enableOptimizedTextMeasuring?: boolean

}

/**
 * Interface for a class DocumentEditor
 */
export interface DocumentEditorModel extends ComponentModel{

    /**
     * Default Paste Formatting Options
     *
     * @default KeepSourceFormatting
     */
    defaultPasteOption?: PasteOptions;

    /**
     * Layout Type
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
     * Remarks: If the visibility of text affected due this highlight color matching with random color applied for the track changes, then modify the color value of this property to resolve text visibility problem.
     *
     * @default '#FFFF00'
     */
    userColor?: string;

    /**
     * Gets or sets the page gap value in document editor
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
     * Defines the width of the DocumentEditor component
     *
     * @default '100%'
     */
    width?: string;

    /**
     * Defines the height of the DocumentEditor component
     *
     * @default '200px'
     */
    height?: string;

    /**
     * Sfdt Service URL
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
     * Gets or set a value indicating whether comment is enabled or not
     *
     * @default false
     */
    enableComment?: boolean;

    /**
     * Gets or set a value indicating whether track changes is enabled or not
     *
     * @default false
     */
    enableTrackChanges?: boolean;

    /**
     * Gets or set a value indicating whether form fields is enabled or not.
     *
     * @default false
     */
    enableFormField?: boolean;

    /**
     * Gets or Sets a value indicating whether tab key can be accepted as input or not.
     *
     * @default false
     */
    acceptTab?: boolean;

    /**
     * Gets or Sets a value indicating whether holding Ctrl key is required to follow hyperlink on click. The default value is true.
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
     * Enable partial lock and edit module.
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
     * Defines the settings of the DocumentEditor services
     */
    serverActionSettings?: ServerActionSettingsModel;

    /**
     * Add custom headers to XMLHttpRequest.
     *
     * @default []
     */
    headers?: object[];

    /**
     * Show comment in the document.
     *
     * @default false
     */
    showComments?: boolean;

    /**
     * Shows revision changes in the document.
     *
     * @default false
     */
    showRevisions?: boolean;

    /**
     * Triggers whenever document changes in the document editor.
     *
     * @event documentChange
     */
    documentChange?: EmitType<DocumentChangeEventArgs>;

    /**
     * Triggers whenever container view changes in the document editor.
     *
     * @event viewChange
     */
    viewChange?: EmitType<ViewChangeEventArgs>;

    /**
     * Triggers whenever zoom factor changes in the document editor.
     *
     * @event zoomFactorChange
     */
    zoomFactorChange?: EmitType<ZoomFactorChangeEventArgs>;

    /**
     * Triggers whenever selection changes in the document editor.
     *
     * @event selectionChange
     */
    selectionChange?: EmitType<SelectionChangeEventArgs>;

    /**
     * Triggers whenever hyperlink is clicked or tapped in the document editor.
     *
     * @event requestNavigate
     */
    requestNavigate?: EmitType<RequestNavigateEventArgs>;

    /**
     * Triggers whenever content changes in the document editor.
     *
     * @event contentChange
     */
    contentChange?: EmitType<ContentChangeEventArgs>;

    /**
     * Triggers whenever key is pressed in the document editor.
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
     * Triggers when the component is created
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
     * Triggers before opening comment pane.
     *
     * @event beforePaneSwitch
     */
    beforePaneSwitch?: EmitType<BeforePaneSwitchEventArgs>;

    /**
     * Triggers after inserting comment.
     *
     * @event commentBegin
     */
    commentBegin?: EmitType<Object>;

    /**
     * Triggers after posting comment.
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
     * Triggers after inserting comment.
     *
     * @event commentDelete
     */
    commentDelete?: EmitType<CommentDeleteEventArgs>;

    /**
     * Triggers on comment actions(Post, edit, reply, resolve, reopen).
     *
     * @event beforeCommentAction
     */
    beforeCommentAction?: EmitType<CommentActionEventArgs>;

    /**
     * Triggers when TrackChanges enabled / disabled.
     *
     * @event trackChange
     */
    trackChange?: EmitType<TrackChangeEventArgs>;

    /**
     * Triggers before form field fill.
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
     * Triggers after form field fill.
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
     * This event is triggered before a server request is started, allows you to modify the XMLHttpRequest object (setting additional headers, if needed).
     */
    beforeXmlHttpRequestSend?: EmitType<XmlHttpRequestEventArgs>;

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
     * Get or Set form fields shading color.
     * You can customize shading color in application level, but cannot be exported in file level
     *
     * @default '#cfcfcf'
     */
    shadingColor?: string;

    /**
     * Get or Set whether apply shadings for field or not.
     *
     * @default true
     */
    applyShading?: boolean;

    /**
     * Get or Set field selection color.
     *
     * @default '#cccccc'
     */
    selectionColor?: string;

    /**
     * Get or Set form filling mode type.
     *
     * @default 'Popup'
     */
    formFillingMode?: FormFillingMode;

    /**
     * Get or Set formatting exception.
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
     * Get or set collaborative editing room name.
     *
     * @default ''
     */
    roomName?: string;

    /**
     * Get or set editable region color.
     */
    editableRegionColor?: string;

    /**
     * Get or set locked region color.
     */
    lockedRegionColor?: string;

    /**
     * Get or set timeout for syncing content in milliseconds.
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