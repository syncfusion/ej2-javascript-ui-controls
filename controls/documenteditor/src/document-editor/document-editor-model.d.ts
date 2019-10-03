import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration, ChildProperty, isBlazor } from '@syncfusion/ej2-base';import { isNullOrUndefined, L10n, EmitType, Browser } from '@syncfusion/ej2-base';import { Save } from '@syncfusion/ej2-file-utils';import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle } from './index';import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs } from './index';import { LayoutViewer, PageLayoutViewer, BulletsAndNumberingDialog } from './index';import { Print, SearchResultsChangeEventArgs } from './index';import { Page, BodyWidget, ParagraphWidget } from './index';import { WSectionFormat, WParagraphFormat, WCharacterFormat } from './index';import { SfdtReader } from './index';import { Selection } from './index';import { TextPosition } from './index';import { Editor, EditorHistory } from './index';import { WStyles } from './index';import { HeaderFooters } from './index';import { Search } from './index';import { OptionsPane } from './index';import { WordExport } from './index';import { TextExport } from './index';import { FormatType, PageFitType, DialogType } from './index';import { ContextMenu } from './index';import { ImageResizer } from './index';import { SfdtExport } from './index';import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';import { SpellChecker } from './implementation/spell-check/spell-checker';import { SpellCheckDialog } from './implementation/dialogs/spellCheck-dialog';import { CharacterFormatProperties, ParagraphFormatProperties } from './implementation';import { PasteOptions } from './index';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DocumentEditor
 */
export interface DocumentEditorModel extends ComponentModel{

    /**
     * Default Paste Formatting Options

     */
    defaultPasteOption?: PasteOptions;

    /**
     * Current User

     */
    currentUser?: string;

    /**
     * User Selection Highlight Color

     */
    userColor?: string;

    /**
     * Gets or sets the page gap value in document editor

     */
    pageGap?: number;

    /**
     * Gets or sets the name of the document.

     */
    documentName?: string;

    /**
     * Sfdt Service URL

     */
    serviceUrl?: string;

    /**
     * Gets or sets the zoom factor in document editor.

     */
    zoomFactor?: number;

    /**
     * Gets or sets a value indicating whether the document editor is in read only state or not.

     */
    isReadOnly?: boolean;

    /**
     * Gets or sets a value indicating whether print needs to be enabled or not.

     */
    enablePrint?: boolean;

    /**
     * Gets or sets a value indicating whether selection needs to be enabled or not.

     */
    enableSelection?: boolean;

    /**
     * Gets or sets a value indicating whether editor needs to be enabled or not.

     */
    enableEditor?: boolean;

    /**
     * Gets or sets a value indicating whether editor history needs to be enabled or not.

     */
    enableEditorHistory?: boolean;

    /**
     * Gets or sets a value indicating whether Sfdt export needs to be enabled or not.

     */
    enableSfdtExport?: boolean;

    /**
     * Gets or sets a value indicating whether word export needs to be enabled or not.

     */
    enableWordExport?: boolean;

    /**
     * Gets or sets a value indicating whether text export needs to be enabled or not.

     */
    enableTextExport?: boolean;

    /**
     * Gets or sets a value indicating whether options pane is enabled or not.

     */
    enableOptionsPane?: boolean;

    /**
     * Gets or sets a value indicating whether context menu is enabled or not.

     */
    enableContextMenu?: boolean;

    /**
     * Gets or sets a value indicating whether hyperlink dialog is enabled or not.

     */
    enableHyperlinkDialog?: boolean;

    /**
     * Gets or sets a value indicating whether bookmark dialog is enabled or not.

     */
    enableBookmarkDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table of contents dialog is enabled or not.

     */
    enableTableOfContentsDialog?: boolean;

    /**
     * Gets or sets a value indicating whether search module is enabled or not.

     */
    enableSearch?: boolean;

    /**
     * Gets or sets a value indicating whether paragraph dialog is enabled or not.

     */
    enableParagraphDialog?: boolean;

    /**
     * Gets or sets a value indicating whether list dialog is enabled or not.

     */
    enableListDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table properties dialog is enabled or not.

     */
    enableTablePropertiesDialog?: boolean;

    /**
     * Gets or sets a value indicating whether borders and shading dialog is enabled or not.

     */
    enableBordersAndShadingDialog?: boolean;

    /**
     * Gets or sets a value indicating whether margin dialog is enabled or not.

     */
    enablePageSetupDialog?: boolean;

    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.

     */
    enableStyleDialog?: boolean;

    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.

     */
    enableFontDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table options dialog is enabled or not.

     */
    enableTableOptionsDialog?: boolean;

    /**
     * Gets or sets a value indicating whether table dialog is enabled or not.

     */
    enableTableDialog?: boolean;

    /**
     * Gets or sets a value indicating whether image resizer is enabled or not.

     */
    enableImageResizer?: boolean;

    /**
     * Gets or sets a value indicating whether editor need to be spell checked.

     */
    enableSpellCheck?: boolean;

    /**
     * Gets or Sets a value indicating whether tab key can be accepted as input or not.

     */
    acceptTab?: boolean;

    /**
     * Gets or Sets a value indicating whether holding Ctrl key is required to follow hyperlink on click. The default value is true.

     */
    useCtrlClickToFollowHyperlink?: boolean;

    /**
     * Gets or sets the page outline color.

     */
    pageOutline?: string;

    /**
     * Gets or sets a value indicating whether to enable cursor in document editor on read only state or not. The default value is false.

     */
    enableCursorOnReadOnly?: boolean;

    /**
     * Gets or sets a value indicating whether local paste needs to be enabled or not.

     */
    enableLocalPaste?: boolean;

    /**
     * Defines the settings of the DocumentEditor services
     */
    // tslint:disable-next-line:max-line-length
    serverActionSettings?: ServerActionSettingsModel;

    /**
     * Triggers whenever document changes in the document editor.
     * @event

     */
    documentChange?: EmitType<DocumentChangeEventArgs>;

    /**
     * Triggers whenever container view changes in the document editor.
     * @event

     */
    viewChange?: EmitType<ViewChangeEventArgs>;

    /**
     * Triggers whenever zoom factor changes in the document editor.
     * @event

     */
    zoomFactorChange?: EmitType<ZoomFactorChangeEventArgs>;

    /**
     * Triggers whenever selection changes in the document editor.
     * @event

     */
    selectionChange?: EmitType<SelectionChangeEventArgs>;

    /**
     * Triggers whenever hyperlink is clicked or tapped in the document editor.
     * @event

     */
    requestNavigate?: EmitType<RequestNavigateEventArgs>;

    /**
     * Triggers whenever content changes in the document editor.
     * @event

     */
    contentChange?: EmitType<ContentChangeEventArgs>;

    /**
     * Triggers whenever key is pressed in the document editor.
     * @event

     */
    keyDown?: EmitType<DocumentEditorKeyDownEventArgs>;

    /**
     * Triggers whenever search results changes in the document editor.
     * @event

     */
    searchResultsChange?: EmitType<SearchResultsChangeEventArgs>;

    /**
     * Triggers when the component is created
     * @event

     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event

     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers while selecting the custom context-menu option.
     * @event

     */
    customContextMenuSelect?: EmitType<CustomContentMenuEventArgs>;

    /**
     * Triggers before opening the custom context-menu option.
     * @event

     */
    customContextMenuBeforeOpen?: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;

}

/**
 * Interface for a class ServerActionSettings
 */
export interface ServerActionSettingsModel {

    /**
     * Specifies the system clipboard action of Document Editor.

     */
    systemClipboard?: string;

    /**
     * Specifies the spell check action of Document Editor.

     */
    spellCheck?: string;

    /**
     * Specifies the restrict editing encryption/decryption action of Document Editor.

     */
    restrictEditing?: string;

}

/**
 * Interface for a class ContainerServerActionSettings
 */
export interface ContainerServerActionSettingsModel extends ServerActionSettingsModel{

    /**
     * Specifies the load action of Document Editor.

     */
    import?: string;

}