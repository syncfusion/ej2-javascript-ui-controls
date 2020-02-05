import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration, ChildProperty, isBlazor, classList } from '@syncfusion/ej2-base';import { isNullOrUndefined, L10n, EmitType, Browser } from '@syncfusion/ej2-base';import { Save } from '@syncfusion/ej2-file-utils';import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle, BeforePaneSwitchEventArgs } from './index';import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs } from './index';import { LayoutViewer, PageLayoutViewer, BulletsAndNumberingDialog } from './index';import { Print, SearchResultsChangeEventArgs } from './index';import { Page, BodyWidget, ParagraphWidget } from './index';import { WSectionFormat, WParagraphFormat, WCharacterFormat } from './index';import { SfdtReader } from './index';import { Selection } from './index';import { TextPosition } from './index';import { Editor, EditorHistory } from './index';import { WStyles } from './index';import { HeaderFooters } from './index';import { Search } from './index';import { OptionsPane } from './index';import { WordExport } from './index';import { TextExport } from './index';import { FormatType, PageFitType, DialogType } from './index';import { ContextMenu } from './index';import { ImageResizer } from './index';import { SfdtExport } from './index';import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';import { SpellChecker } from './implementation/spell-check/spell-checker';import { SpellCheckDialog } from './implementation/dialogs/spellCheck-dialog';import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties } from './implementation';import { PasteOptions } from './index';import { CommentReviewPane } from './implementation/index';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DocumentEditor
 */
export interface DocumentEditorModel extends ComponentModel{

    /**
     * Default Paste Formatting Options
     * @default KeepSourceFormatting
     */
    defaultPasteOption?: PasteOptions;

    /**
     * Current User
     * @default ''
     */
    currentUser?: string;

    /**
     * User Selection Highlight Color
     * @default '#FFFF00'
     */
    userColor?: string;

    /**
     * Gets or sets the page gap value in document editor
     * @default 20
     */
    pageGap?: number;

    /**
     * Gets or sets the name of the document.
     * @default ''
     */
    documentName?: string;

    /**
     * Sfdt Service URL
     * @default ''
     */
    serviceUrl?: string;

    /**
     * Gets or sets the zoom factor in document editor.
     * @default 1
     */
    zoomFactor?: number;

    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     * @default 2000
     * @aspType int
     */
    zIndex?: number;

    /**
     * Gets or sets a value indicating whether the document editor is in read only state or not.
     * @default true
     */
    isReadOnly?: boolean;

    /**
     * Gets or sets a value indicating whether print needs to be enabled or not.
     * @default false
     */
    enablePrint?: boolean;

    /**
     * Gets or sets a value indicating whether selection needs to be enabled or not.
     * @default false
     */
    enableSelection?: boolean;

    /**
     * Gets or sets a value indicating whether editor needs to be enabled or not.
     * @default false
     */
    enableEditor?: boolean;

    /**
     * Gets or sets a value indicating whether editor history needs to be enabled or not.
     * @default false
     */
    enableEditorHistory?: boolean;

    /**
     * Gets or sets a value indicating whether Sfdt export needs to be enabled or not.
     * @default false
     */
    enableSfdtExport?: boolean;

    /**
     * Gets or sets a value indicating whether word export needs to be enabled or not.
     * @default false
     */
    enableWordExport?: boolean;

    /**
     * Gets or sets a value indicating whether text export needs to be enabled or not.
     * @default false
     */
    enableTextExport?: boolean;

    /**
     * Gets or sets a value indicating whether options pane is enabled or not.
     * @default false
     */
    enableOptionsPane?: boolean;

    /**
     * Gets or sets a value indicating whether context menu is enabled or not.
     * @default false
     */
    enableContextMenu?: boolean;

    /**
     * Gets or sets a value indicating whether hyperlink dialog is enabled or not.
     * @default false
     */
    enableHyperlinkDialog?: boolean;

    /**
     * Gets or sets a value indicating whether bookmark dialog is enabled or not.
     * @default false
     */
    enableBookmarkDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table of contents dialog is enabled or not.
     * @default false
     */
    enableTableOfContentsDialog?: boolean;

    /**
     * Gets or sets a value indicating whether search module is enabled or not.
     * @default false
     */
    enableSearch?: boolean;

    /**
     * Gets or sets a value indicating whether paragraph dialog is enabled or not.
     * @default false
     */
    enableParagraphDialog?: boolean;

    /**
     * Gets or sets a value indicating whether list dialog is enabled or not.
     * @default false
     */
    enableListDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table properties dialog is enabled or not.
     * @default false
     */
    enableTablePropertiesDialog?: boolean;

    /**
     * Gets or sets a value indicating whether borders and shading dialog is enabled or not.
     * @default false
     */
    enableBordersAndShadingDialog?: boolean;

    /**
     * Gets or sets a value indicating whether margin dialog is enabled or not.
     * @default false
     */
    enablePageSetupDialog?: boolean;

    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     * @default false
     */
    enableStyleDialog?: boolean;

    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     * @default false
     */
    enableFontDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table options dialog is enabled or not.
     * @default false
     */
    enableTableOptionsDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table dialog is enabled or not.
     * @default false
     */
    enableTableDialog?: boolean;

    /**
     * Gets or sets a value indicating whether image resizer is enabled or not.
     * @default false
     */
    enableImageResizer?: boolean;

    /**
     * Gets or sets a value indicating whether editor need to be spell checked.
     * @default false
     */
    enableSpellCheck?: boolean;

    /**
     * Gets or set a value indicating whether comment is enabled or not
     * @default false
     */
    enableComment?: boolean;

    /**
     * Gets or Sets a value indicating whether tab key can be accepted as input or not.
     * @default false
     */
    acceptTab?: boolean;

    /**
     * Gets or Sets a value indicating whether holding Ctrl key is required to follow hyperlink on click. The default value is true.
     * @default true
     */
    useCtrlClickToFollowHyperlink?: boolean;

    /**
     * Gets or sets the page outline color.
     * @default '#000000'
     */
    pageOutline?: string;

    /**
     * Gets or sets a value indicating whether to enable cursor in document editor on read only state or not. The default value is false.
     * @default false
     */
    enableCursorOnReadOnly?: boolean;

    /**
     * Gets or sets a value indicating whether local paste needs to be enabled or not.
     * @default false
     */
    enableLocalPaste?: boolean;

    /**
     * Defines the settings of the DocumentEditor services
     */
    // tslint:disable-next-line:max-line-length
    serverActionSettings?: ServerActionSettingsModel;

    /**
     * Add custom headers to XMLHttpRequest.
     * @default []
     */
    headers?: object[];

    /**
     * Show comment in the document.
     * @default false
     */
    showComments?: boolean;

    /**
     * Triggers whenever document changes in the document editor.
     * @event
     * @blazorproperty 'DocumentChanged'
     */
    documentChange?: EmitType<DocumentChangeEventArgs>;

    /**
     * Triggers whenever container view changes in the document editor.
     * @event
     * @blazorproperty 'ViewChanged'
     */
    viewChange?: EmitType<ViewChangeEventArgs>;

    /**
     * Triggers whenever zoom factor changes in the document editor.
     * @event
     * @blazorproperty 'ZoomFactorChanged'
     */
    zoomFactorChange?: EmitType<ZoomFactorChangeEventArgs>;

    /**
     * Triggers whenever selection changes in the document editor.
     * @event
     * @blazorproperty 'SelectionChanged'
     */
    selectionChange?: EmitType<SelectionChangeEventArgs>;

    /**
     * Triggers whenever hyperlink is clicked or tapped in the document editor.
     * @event
     * @blazorproperty 'OnRequestNavigate'
     */
    requestNavigate?: EmitType<RequestNavigateEventArgs>;

    /**
     * Triggers whenever content changes in the document editor.
     * @event
     * @blazorproperty 'ContentChanged'
     */
    contentChange?: EmitType<ContentChangeEventArgs>;

    /**
     * Triggers whenever key is pressed in the document editor.
     * @event
     * @blazorproperty 'OnKeyDown'
     */
    keyDown?: EmitType<DocumentEditorKeyDownEventArgs>;

    /**
     * Triggers whenever search results changes in the document editor.
     * @event
     * @blazorproperty 'SearchResultsChanged'
     */
    searchResultsChange?: EmitType<SearchResultsChangeEventArgs>;

    /**
     * Triggers when the component is created
     * @event
     * @blazorproperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     * @blazorproperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers while selecting the custom context-menu option.
     * @event
     * @blazorproperty 'ContextMenuItemSelected'
     */
    customContextMenuSelect?: EmitType<CustomContentMenuEventArgs>;

    /**
     * Triggers before opening the custom context-menu option.
     * @event
     * @blazorproperty 'OnContextMenuOpen'
     */
    customContextMenuBeforeOpen?: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;

    /**
     * Triggers before opening comment pane.
     * @event
     * @blazorproperty 'BeforePaneSwitch'
     */
    beforePaneSwitch?: EmitType<BeforePaneSwitchEventArgs>;

    /**
     * Triggers after inserting comment.
     * @blazorproperty 'OnCommentBegin'
     * @event
     */
    commentBegin?: EmitType<Object>;

    /**
     * Triggers after posting comment.
     * @event
     * @blazorproperty 'AfterCommentEnd'
     */
    commentEnd?: EmitType<Object>;

}

/**
 * Interface for a class ServerActionSettings
 */
export interface ServerActionSettingsModel {

    /**
     * Specifies the system clipboard action of Document Editor.
     * @default 'SystemClipboard'
     */
    systemClipboard?: string;

    /**
     * Specifies the spell check action of Document Editor.
     * @default 'SpellCheck'
     */
    spellCheck?: string;

    /**
     * Specifies the restrict editing encryption/decryption action of Document Editor.
     * @default 'RestrictEditing'
     */
    restrictEditing?: string;

}

/**
 * Interface for a class ContainerServerActionSettings
 */
export interface ContainerServerActionSettingsModel extends ServerActionSettingsModel{

    /**
     * Specifies the load action of Document Editor.
     * @default 'Import'
     */
    import?: string;

}