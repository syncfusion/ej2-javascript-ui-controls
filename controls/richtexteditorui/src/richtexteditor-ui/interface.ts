import { EmitType } from '@syncfusion/ej2-base';
import { ToolbarSettingsModel, FontSizeModel, FontFamilyModel, FormatModel } from './model/toolbar-settings-model';
import { ToolbarItem } from './model/toolbar.types';
import { ActionBeginEventArgs, ActionCompleteEventArgs } from '../controller/interface';
import { DocumentChangeAction, EditorNode, Selection } from '@syncfusion/ej2-headless-editor';
import { EditorDocument } from './types/editor-document';
import { FontColorModel, BackgroundColorModel } from './model/color-picker-settings-model';
import {
    BeforeDialogOpenEventArgs,
    BeforeDialogCloseEventArgs,
    BeforePopupOpenEventArgs,
    BeforePopupCloseEventArgs,
    BeforeFileUploadEventArgs,
    FileUploadingEventArgs,
    FileSelectedEventArgs,
    FileUploadSuccessEventArgs,
    FileUploadFailedEventArgs,
    FileRemovingEventArgs
} from '../common/interface';
import { ListSettingsModel } from './model/list-settings-model';
import { SlashCommandSettingsModel } from './model';

/**
 * Interface for the RichTextEditor wrapper component.
 * Mirrors the public options shape consumed by EditorBase.
 */
export interface IRichTextEditorUIModel {
    /**
     * Configures the toolbar settings used by the editor.
     */
    toolbarSettings?: ToolbarSettingsModel;
    /**
     * Configures the font size settings used by the editor.
     */
    fontSize?: FontSizeModel;
    /**
     * Configures the font family settings used by the editor.
     */
    fontFamily?: FontFamilyModel;
    listsettings?: ListSettingsModel;
    format?: FormatModel;
    slashCommandSettings?: SlashCommandSettingsModel;
    enable?: boolean;
    readonly?: boolean;
    width?: string | number;
    height?: string | number;
    placeholder?: string;
    htmlAttributes?: { [key: string]: string };
    enablePersistence?: boolean;
    /**
     * Editor content.
     *
     * The accepted type depends on `valueFormat`:
     *  - `'html'`: an HTML string.
     *  - `'json'`: an `EditorDocument` object.
     *
     * @see {@link ValueFormat}
     */
    value?: string | EditorDocument;
    /**
     * Format used by the `value` property and getter methods.
     *
     * @default 'json'
     */
    valueFormat?: ValueFormat;
    enableAutoSave?: boolean;
    saveInterval?: number;
    cssClass?: string;
    locale?: string;
    enableRtl?: boolean;
    /**
     * Enables HTML sanitization for incoming editor content.
     */
    enableHtmlSanitizer?: boolean;
    created?: EmitType<Object>;
    destroyed?: EmitType<Object>;
    focused?: EmitType<FocusedEventArgs>;
    blurred?: EmitType<BlurredEventArgs>;
    change?: EmitType<ChangeEventArgs>;
    actionBegin?: EmitType<ActionBeginEventArgs>;
    actionComplete?: EmitType<ActionCompleteEventArgs>;
    /**
     * Configures the font color picker (color palette, default color, mode, columns,
     * mode switcher, and recent-colors visibility).
     */
    fontColor?: FontColorModel;
    /**
     * Configures the background color / text highlight color picker using the
     * same shape as `fontColor` but with background-specific defaults
     * (`default: '#1E293B'`, `columns: 4`).
     */
    backgroundColor?: BackgroundColorModel;
    updatedToolbarStatus?: EmitType<UpdatedToolbarStatusEventArgs>;
    isDestroyed?: boolean
    /**
     * Sub component rendered inside the editor. Each event arg extends the
     * underlying ej2 event args with a `subType` field (a {@link DialogType}
     * value) identifying the editor feature (link, image, or table).
     */
    beforeDialogOpen?: EmitType<BeforeDialogOpenEventArgs>;
    beforeDialogClose?: EmitType<BeforeDialogCloseEventArgs>;
    beforePopupOpen?: EmitType<BeforePopupOpenEventArgs>;
    beforePopupClose?: EmitType<BeforePopupCloseEventArgs>;
    beforeFileUpload?: EmitType<BeforeFileUploadEventArgs>;
    fileUploading?: EmitType<FileUploadingEventArgs>;
    fileSelected?: EmitType<FileSelectedEventArgs>;
    fileUploadSuccess?: EmitType<FileUploadSuccessEventArgs>;
    fileUploadFailed?: EmitType<FileUploadFailedEventArgs>;
    fileRemoving?: EmitType<FileRemovingEventArgs>;
    getCssClass(isSpace?: boolean): string
    rootElement: HTMLElement
}

/**
 * Event arguments for the itemClick event raised when a toolbar item is clicked.
 */
export interface itemClickEventArgs {
    /** Stable ID of the toolbar item that was clicked */
    itemId: string;
    /** The toolbar item configuration */
    item: ToolbarItem;
    /** The action/command ID for the clicked item */
    actionId: string;
    /** The originating DOM event */
    originalEvent: MouseEvent | KeyboardEvent;
}

export interface CreatedEventArgs {
    readonly name: 'created';
}

export interface DestroyedEventArgs {
    readonly name: 'destroyed';
}

export interface FocusedEventArgs {
    readonly name: 'focused';
    readonly isInteracted: boolean;
    event: FocusEvent
    readonly source:  'Event' | 'Method'
}

export interface BlurredEventArgs {
    readonly name: 'blurred';
    readonly isInteracted: boolean;
    event: FocusEvent
    readonly source:  'Event' | 'Method'
}

export interface ChangeEventArgs {
    readonly name: 'change';
    /** The document state after the change. */
    document: EditorDocument;
    /** The selection state after the change. */
    selection: Selection;
    /**
     * Semantic action describing the nature of the change.
     * - `'Insertion'`: Content was added (typing, paste, insert command)
     * - `'Deletion'`: Content was removed (backspace, delete, remove command)
     * - `'Moved'`: Content was relocated (drag-drop, reorder, move command)
     * - `'Replaced'`: Content was swapped (find-replace, transform)
     * - `'Update'`: Attributes or formatting changed without structural change (heading level, text color)
     * - `'Unknown'`: Transaction too complex to categorize; examine `affectedNodes` for details
     */
    action: DocumentChangeAction;
    /**
     * All Headless Editor nodes touched by this transaction.
     * Populated based on action:
     * - `'Insertion'`: Newly inserted nodes and their ancestors
     * - `'Deletion'`: Nodes that existed before deletion (for archival/undo preview)
     * - `'Moved'`: Relocated nodes
     * - `'Replaced'`: Both old and new nodes
     * - `'Update'`: Mutated nodes
     * - `'Unknown'`: All nodes with changes (best effort)
     */
    affectedNodes: EditorNode[];
    /**
     * Unique node IDs of affected nodes. Deduped for efficient lookups.
     * Use for: filtering changes, triggering targeted updates, analytics.
     */
    affectedNodeIds: string[];
}

/**
 * Event arguments for the updatedToolbarStatus event raised after the toolbar
 * synchronizes its visual state (active buttons, dropdown values, color pickers)
 * with the current editor selection / cursor formatting.
 */
export interface UpdatedToolbarStatusEventArgs {
    readonly name: 'updatedToolbarStatus';
    /** Snapshot of the active marks at the current selection. */
    activeMarks: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikethrough: boolean;
        superscript: boolean;
        subscript: boolean;
        inlineCode: boolean;
    };
    /** Snapshot of block-level formats at the current selection. */
    blockFormats: {
        paragraph: boolean;
        heading: string | null;
        codeBlock: boolean;
        blockQuote: boolean;
        orderedList: boolean;
        bulletList: boolean;
        alignLeft: boolean;
        alignCenter: boolean;
        alignRight: boolean;
        alignJustify: boolean;
    };
    /** Resolved font / color values at the current selection. */
    styles: {
        fontColor: string | null;
        backgroundColor: string | null;
        fontSize: string | null;
        fontFamily: string | null;
    };
}
/**
 * Custom dropdown item.
 */
export interface CustomFormatListItem {
    /**
     * Text displayed in dropdown.
     */
    text: string;

    /**
     * Custom CSS list-style-type value.
     */
    value: string;
}

/**
 * ValueFormat - the format used by the Rich Text Editor's `value` property,
 * getter methods, and (eventually) form submission.
 *
 * Spec: docs/spec/05.value.md
 */

/**
 * Allowed value formats.
 *  - `'html'`: value is an HTML string.
 *  - `'json'`: value is an `EditorDocument` object.
 */
export type ValueFormat = 'html' | 'json';

