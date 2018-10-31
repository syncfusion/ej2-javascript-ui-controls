import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration } from '@syncfusion/ej2-base';import { isNullOrUndefined, L10n, setCulture, EmitType, Browser } from '@syncfusion/ej2-base';import { Save } from '@syncfusion/ej2-file-utils';import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle } from './index';import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs } from './index';import { LayoutViewer, PageLayoutViewer, BulletsAndNumberingDialog } from './index';import { Print, SearchResultsChangeEventArgs } from './index';import { Page, BodyWidget, ParagraphWidget } from './index';import { WSectionFormat, WParagraphFormat, WCharacterFormat } from './index';import { SfdtReader } from './index';import { Selection } from './index';import { TextPosition } from './index';import { Editor, EditorHistory } from './index';import { WStyles } from './index';import { HeaderFooters } from './index';import { Search } from './index';import { OptionsPane } from './index';import { WordExport } from './index';import { TextExport } from './index';import { FormatType, PageFitType, DialogType } from './index';import { ContextMenu } from './index';import { ImageResizer } from './index';import { SfdtExport } from './index';import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DocumentEditor
 */
export interface DocumentEditorModel extends ComponentModel{

    /**
     * Gets or sets the zoom factor in document editor.
     * @default 1
     */
    zoomFactor?: number;

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
     * Triggers when the component is created.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     * @event
     */
    destroyed?: EmitType<Object>;

}